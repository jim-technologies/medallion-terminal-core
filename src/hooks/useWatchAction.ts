import { useEffect, useState } from 'react'
import { buildWatchActionUrl, buildActionWatchRequest } from '../core/resolveSource'
import { parseConnectEnvelopes, CONNECT_JSON_CONTENT_TYPE } from '../core/connectFraming'

// Mirrors proto: terminal.proto ActionUpdate. Free-form `data` because
// it's a google.protobuf.Struct on the wire.
export interface ActionUpdate {
  id: string
  action_id: string
  client_request_id: string
  status: string
  status_detail?: string
  message?: string
  data?: Record<string, unknown>
  timestamp: string
  sequence: number
}

// Mirrors the terminal/non-terminal split in proto's ActionStatus.
// Exported so widgets that don't import the hook can still classify.
export const TERMINAL_ACTION_STATUSES = new Set([
  'ACTION_STATUS_OK',
  'ACTION_STATUS_REJECTED',
  'ACTION_STATUS_FAILED',
  'ACTION_STATUS_CANCELLED',
])

export const NON_TERMINAL_ACTION_STATUSES = new Set([
  'ACTION_STATUS_ACCEPTED',
  'ACTION_STATUS_PENDING',
])

const ERROR_ACTION_STATUSES = new Set([
  'ACTION_STATUS_REJECTED',
  'ACTION_STATUS_FAILED',
  'ACTION_STATUS_CANCELLED',
])

export function isTerminalStatus(s: string | undefined): boolean {
  return !!s && TERMINAL_ACTION_STATUSES.has(s)
}

export function isErrorStatus(s: string | undefined): boolean {
  return !!s && ERROR_ACTION_STATUSES.has(s)
}

export function isNonTerminalStatus(s: string | undefined): boolean {
  return !!s && NON_TERMINAL_ACTION_STATUSES.has(s)
}

interface UseWatchActionState {
  updates: ActionUpdate[]
  latest: ActionUpdate | null
  done: boolean
  error: string | null
}

interface WatchTarget {
  clientRequestId?: string
  id?: string
  actionId?: string
}

// Cap the in-memory update history so a misbehaving backend that
// streams thousands of non-terminal updates can't grow the React
// state unboundedly. The newest UPDATE_HISTORY_CAP entries are
// retained — `latest` always reads from the tail.
const UPDATE_HISTORY_CAP = 64

// Subscribe to lifecycle updates for a single action via WatchAction.
// The hook stays inert (no fetch) until `target` is non-null — that's
// how the Trade widget arms it only after SubmitAction returns a
// non-terminal status. Closing the connection on terminal updates
// matches the proto contract: backends MUST close after sending a
// terminal status.
export function useWatchAction(
  backendUrl: string | undefined,
  target: WatchTarget | null,
): UseWatchActionState {
  const [updates, setUpdates] = useState<ActionUpdate[]>([])
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stateKey, setStateKey] = useState('')
  const requestedKey = target
    ? JSON.stringify([backendUrl, target.clientRequestId, target.id, target.actionId])
    : ''

  useEffect(() => {
    // An empty backend URL intentionally means same-origin.
    if (backendUrl === undefined || !target) return
    const hasIdentifier = !!(target.clientRequestId || target.id || target.actionId)
    if (!hasIdentifier) return

    setUpdates([])
    setDone(false)
    setError(null)
    setStateKey(requestedKey)

    const ctrl = new AbortController()
    let disposed = false

    ;(async () => {
      try {
        const res = await fetch(buildWatchActionUrl(backendUrl), {
          method: 'POST',
          headers: { 'Content-Type': CONNECT_JSON_CONTENT_TYPE },
          body: JSON.stringify(buildActionWatchRequest(target)),
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error(`WatchAction: HTTP ${res.status}`)
        if (!res.body) throw new Error('WatchAction: no response body')

        const reader = res.body.getReader()
        await parseConnectEnvelopes(reader, {
          onMessage: raw => {
            const parsed = raw as ActionUpdate
            setUpdates(prev => {
              const next = prev.length >= UPDATE_HISTORY_CAP
                ? [...prev.slice(1), parsed]
                : [...prev, parsed]
              return next
            })
            if (isTerminalStatus(parsed.status)) setDone(true)
          },
          onTrailer: trailer => {
            if (trailer.error) {
              const code = trailer.error.code ?? 'unknown'
              const msg = trailer.error.message ?? 'watch error'
              setError(`${code}: ${msg}`)
            }
            setDone(true)
          },
          isDisposed: () => disposed,
        })
        reader.releaseLock()
      } catch (err: unknown) {
        if (!disposed && err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          setDone(true)
        }
      } finally {
        // Always flip `done` when the async block exits — covers the
        // case where the backend closed cleanly without a trailer
        // (server crash, network drop). Without this, consumers
        // waiting on `done` would hang forever.
        if (!disposed) setDone(true)
      }
    })()

    return () => {
      disposed = true
      ctrl.abort()
    }
  }, [backendUrl, requestedKey, target?.actionId, target?.clientRequestId, target?.id])

  // State updates from the previous target remain visible until this effect
  // commits. Mask them synchronously so a newly armed action can never
  // consume the prior action's terminal update or error.
  if (stateKey !== requestedKey) {
    return { updates: [], latest: null, done: false, error: null }
  }
  return {
    updates,
    latest: updates.length > 0 ? updates[updates.length - 1] : null,
    done,
    error,
  }
}
