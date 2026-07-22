import { useCallback, useEffect, useRef, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import {
  buildActionRequest,
  buildSubmitActionUrl,
  newClientRequestId,
} from '../core/resolveSource'
import {
  isErrorStatus,
  isNonTerminalStatus,
  isTerminalStatus,
  useWatchAction,
} from './useWatchAction'

export interface SubmitActionReply {
  id: string
  actionId: string
  clientRequestId: string
  status: string
  message?: string
  data?: Record<string, unknown>
  terminal: boolean
}

export interface SubmitActionInput {
  actionId: string
  params: Record<string, unknown>
  successMessage?: string
  refresh?: boolean
  refreshTarget?: string
  announce?: boolean
  onComplete?: (reply: SubmitActionReply) => void
}

interface ActiveAction {
  actionId: string
  clientRequestId: string
  successMessage?: string
  refresh: boolean
  refreshTarget: string
  announce: boolean
  onComplete?: (reply: SubmitActionReply) => void
}

// Generic mutation hook for schema-driven widgets.
//
// It keeps every write on TerminalService.SubmitAction, emits the standard
// dashboard lifecycle telemetry, follows asynchronous actions through
// WatchAction, refreshes the originating widget after success, and guarantees
// one idempotency key per submission. Domain widgets only supply action id +
// params; they do not reimplement transport or lifecycle handling.
export function useSubmitAction(widgetId?: string) {
  const {
    backendUrl,
    backendHeaders,
    emit,
    requestRefresh,
    toast,
  } = useDashboard()
  const [submitting, setSubmitting] = useState(false)
  const [active, setActive] = useState<ActiveAction | null>(null)
  const [result, setResult] = useState<SubmitActionReply | null>(null)
  const lastWatchKey = useRef('')
  // React state does not update synchronously. A ref closes the small window
  // where two clicks in the same event turn could both observe
  // `submitting === false` and mint different idempotency keys.
  const inFlightRef = useRef(false)
  const watch = useWatchAction(
    backendUrl,
    active ? { clientRequestId: active.clientRequestId } : null,
    backendHeaders,
  )

  const finish = useCallback((reply: SubmitActionReply, config: ActiveAction) => {
    setResult(reply)
    emit({
      type: 'action',
      actionId: reply.actionId,
      clientRequestId: reply.clientRequestId,
      status: reply.status,
      message: reply.message,
      terminal: reply.terminal,
    })

    if (!reply.terminal) return
    const failed = isErrorStatus(reply.status)
    // `announce: false` suppresses routine success noise (for example board
    // lane moves), never failures.
    if (failed || config.announce) {
      toast(
        reply.message ?? (failed ? `${reply.actionId} failed` : config.successMessage ?? `${reply.actionId} completed`),
        failed ? 'error' : 'ok',
      )
    }
    if (!failed && config.refresh) requestRefresh(config.refreshTarget)
    setActive(null)
    setSubmitting(false)
    inFlightRef.current = false
    // Release the transport lock before handing control to consumer code.
    // A callback that navigates/unmounts the widget cannot leave this hook
    // permanently busy.
    config.onComplete?.(reply)
  }, [emit, requestRefresh, toast])

  useEffect(() => {
    if (!active) return

    // Resolve transport/trailer errors first. Keeping all watch arbitration in
    // one effect prevents a malformed "invalid update + close" render from
    // settling the same action twice.
    if (watch.error) {
      const watchKey = `${active.clientRequestId}:error:${watch.error}`
      if (watchKey === lastWatchKey.current) return
      lastWatchKey.current = watchKey
      finish({
        id: watch.latest?.id ?? '',
        actionId: watch.latest?.action_id || active.actionId,
        clientRequestId: watch.latest?.client_request_id || active.clientRequestId,
        status: 'ACTION_STATUS_FAILED',
        message: watch.error,
        terminal: true,
      }, active)
      return
    }

    const update = watch.latest
    if (update) {
      const updateKey = `${active.clientRequestId}:${update.sequence}:${update.status}`
      if (updateKey !== lastWatchKey.current) {
        lastWatchKey.current = updateKey
        const knownStatus = isTerminalStatus(update.status) || isNonTerminalStatus(update.status)
        const terminal = !isNonTerminalStatus(update.status)
        finish({
          id: update.id,
          actionId: update.action_id || active.actionId,
          clientRequestId: update.client_request_id || active.clientRequestId,
          status: knownStatus ? update.status : 'ACTION_STATUS_FAILED',
          message: knownStatus
            ? update.message ?? update.status_detail
            : `WatchAction returned invalid status ${JSON.stringify(update.status)}`,
          data: update.data,
          terminal,
        }, active)
        if (terminal) return
      } else if (!isNonTerminalStatus(update.status)) {
        // This terminal/invalid update was already settled.
        return
      }
    }

    if (!watch.done) return
    const watchKey = `${active.clientRequestId}:ended-without-terminal`
    if (watchKey === lastWatchKey.current) return
    lastWatchKey.current = watchKey
    finish({
      id: update?.id ?? '',
      actionId: update?.action_id || active.actionId,
      clientRequestId: update?.client_request_id || active.clientRequestId,
      status: 'ACTION_STATUS_FAILED',
      message: 'WatchAction ended before a terminal status',
      terminal: true,
    }, active)
  }, [active, finish, watch.done, watch.error, watch.latest])

  const submit = useCallback(async (input: SubmitActionInput): Promise<SubmitActionReply | null> => {
    if (inFlightRef.current) return null
    const actionId = input.actionId.trim()
    if (!actionId) {
      toast('actionId is required', 'error')
      return null
    }
    if (backendUrl === undefined) {
      toast('This action requires backendUrl', 'error')
      return null
    }

    inFlightRef.current = true
    const clientRequestId = newClientRequestId()
    const config: ActiveAction = {
      actionId,
      clientRequestId,
      successMessage: input.successMessage,
      refresh: input.refresh !== false,
      refreshTarget: input.refreshTarget ?? widgetId ?? '*',
      announce: input.announce !== false,
      onComplete: input.onComplete,
    }
    setSubmitting(true)
    setResult(null)
    lastWatchKey.current = ''

    try {
      const response = await fetch(buildSubmitActionUrl(backendUrl), {
        method: 'POST',
        headers: { ...backendHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(buildActionRequest({
          actionId,
          params: input.params,
          clientRequestId,
        })),
      })
      if (!response.ok) throw new Error(`SubmitAction: HTTP ${response.status}`)
      const raw = await response.json() as {
        id?: string
        status?: string
        message?: string
        data?: Record<string, unknown>
      }
      const status = raw.status || 'ACTION_STATUS_FAILED'
      const knownStatus = isTerminalStatus(status) || isNonTerminalStatus(status)
      const reply: SubmitActionReply = {
        id: raw.id ?? '',
        actionId,
        clientRequestId,
        status: knownStatus ? status : 'ACTION_STATUS_FAILED',
        message: knownStatus
          ? raw.message
          : raw.message ?? `SubmitAction returned invalid status ${JSON.stringify(status)}`,
        data: raw.data,
        terminal: !isNonTerminalStatus(status),
      }

      if (reply.terminal) {
        finish(reply, config)
      } else {
        setResult(reply)
        emit({
          type: 'action',
          actionId: reply.actionId,
          clientRequestId,
          status,
          message: reply.message,
          terminal: false,
        })
        setActive(config)
      }
      return reply
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed'
      const reply: SubmitActionReply = {
        id: '',
        actionId,
        clientRequestId,
        status: 'ACTION_STATUS_FAILED',
        message,
        terminal: true,
      }
      finish(reply, config)
      return reply
    }
  }, [backendUrl, backendHeaders, emit, finish, toast, widgetId])

  return {
    submit,
    submitting: submitting || active != null,
    activeActionId: active?.actionId ?? null,
    result,
  }
}
