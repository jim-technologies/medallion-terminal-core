import { useEffect, useMemo, useRef, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { newClientRequestId } from '../core/resolveSource'
import { useSubmitAction } from '../hooks/useSubmitAction'
import { isErrorStatus } from '../hooks/useWatchAction'
import type { WidgetProps } from '../types/template'
import {
  actionParams,
  initialActionValues,
  normalizeActionForm,
  validateActionValues,
  type ActionField,
} from './actionFormShape'
import { Empty } from './states'

interface RuntimeOptions {
  url?: string
  refresh?: boolean
  refresh_target?: string
  reset_on_success?: boolean
}

export function ActionForm({ data, options, widgetId }: WidgetProps) {
  const { backendUrl, ctx, emit, requestRefresh, toast } = useDashboard()
  const form = useMemo(() => normalizeActionForm(data, options), [data, options])
  const opts = (options ?? {}) as RuntimeOptions
  const {
    submit,
    submitting: connectSubmitting,
    result,
  } = useSubmitAction(widgetId)
  const contextSignature = form
    ? JSON.stringify(form.fields.map(field =>
        field.contextKey ? [field.contextKey, ctx[field.contextKey]] : null,
      ))
    : ''
  const initial = useMemo(
    () => form ? initialActionValues(form, ctx) : {},
    // Only fields explicitly bound with context_key retarget the form.
    // Unrelated dashboard interactions must not discard in-progress input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, contextSignature],
  )
  const [values, setValues] = useState<Record<string, unknown>>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirming, setConfirming] = useState(false)
  const [legacySubmitting, setLegacySubmitting] = useState(false)
  const legacyLock = useRef(false)
  const [legacyReply, setLegacyReply] = useState<string | null>(null)
  const [legacyError, setLegacyError] = useState<string | null>(null)

  // A schema/context retarget is a new form. This is deliberate: action forms
  // are context-bound, so keeping values from the previous object/order would
  // be more dangerous than resetting them.
  useEffect(() => {
    setValues(initial)
    setErrors({})
    setConfirming(false)
    setLegacyReply(null)
    setLegacyError(null)
  }, [initial])

  if (!form) return <Empty>Action form requires fields</Empty>
  const target = backendUrl !== undefined ? 'connect' as const : opts.url ? 'url' as const : null
  if (!target) return <Empty>Action form requires backendUrl or options.url</Empty>
  if (!form.actionId) return <Empty>Action form requires action_id</Empty>

  const submitting = target === 'connect' ? connectSubmitting : legacySubmitting
  const update = (key: string, value: unknown) => {
    setValues(current => ({ ...current, [key]: value }))
    setErrors(current => {
      if (!(key in current)) return current
      const next = { ...current }
      delete next[key]
      return next
    })
    setConfirming(false)
    setLegacyReply(null)
    setLegacyError(null)
  }
  const reset = () => {
    setValues(initial)
    setErrors({})
    setConfirming(false)
  }
  const onSuccess = () => {
    if (opts.reset_on_success !== false) reset()
  }

  const run = async () => {
    if (submitting || legacyLock.current) return
    const nextErrors = validateActionValues(form.fields, values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    if (form.confirm && !confirming) {
      setConfirming(true)
      return
    }
    const params = actionParams(form, values)
    setConfirming(false)
    setLegacyReply(null)
    setLegacyError(null)

    if (target === 'connect') {
      await submit({
        actionId: form.actionId,
        params,
        successMessage: form.successMessage,
        refresh: opts.refresh !== false,
        refreshTarget: opts.refresh_target,
        onComplete: reply => {
          if (!isErrorStatus(reply.status)) onSuccess()
        },
      })
      return
    }

    legacyLock.current = true
    setLegacySubmitting(true)
    const clientRequestId = newClientRequestId()
    try {
      const response = await fetch(opts.url!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': clientRequestId,
        },
        body: JSON.stringify(params),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const body = await response.json().catch(() => ({})) as {
        message?: string
        status?: string
      }
      const status = body.status ?? 'ACTION_STATUS_OK'
      const failed = isErrorStatus(status)
      const message = body.message ??
        (failed ? `${form.actionId} failed` : form.successMessage ?? `${form.actionId} completed`)
      emit({
        type: 'action',
        actionId: form.actionId,
        clientRequestId,
        status,
        message,
        terminal: true,
      })
      if (failed) {
        setLegacyError(message)
        toast(message, 'error')
      } else {
        setLegacyReply(message)
        toast(message, 'ok')
        if (opts.refresh !== false) requestRefresh(opts.refresh_target ?? widgetId ?? '*')
        onSuccess()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed'
      setLegacyError(message)
      toast(message, 'error')
      emit({
        type: 'action',
        actionId: form.actionId,
        clientRequestId,
        status: 'ACTION_STATUS_FAILED',
        message,
        terminal: true,
      })
    } finally {
      legacyLock.current = false
      setLegacySubmitting(false)
    }
  }

  const connectMessage = result?.message ?? result?.status
  const connectError = result && isErrorStatus(result.status) ? connectMessage : null
  const connectReply = result && !isErrorStatus(result.status) ? connectMessage : null

  return (
    <form
      className="h-full min-h-0 flex flex-col gap-3"
      onSubmit={event => {
        event.preventDefault()
        void run()
      }}
    >
      {form.description && (
        <p className="text-xs leading-relaxed text-zinc-400">{form.description}</p>
      )}

      <div
        className={`grid gap-3 overflow-auto pr-1 ${form.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}
      >
        {form.fields.map(field => (
          <ActionInput
            key={field.key}
            field={field}
            value={values[field.key]}
            error={errors[field.key]}
            disabled={submitting || confirming}
            onChange={value => update(field.key, value)}
          />
        ))}
      </div>

      {confirming && (
        <div className="mtc-callout border border-amber-500/30 bg-amber-500/5 rounded px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-amber-300">Confirm action</div>
          <div className="mt-1 text-xs text-zinc-300">
            Submit <span className="font-mono text-zinc-100">{form.actionId}</span> with the values above?
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 shrink-0">
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={submitting}
            className="mtc-control px-3 py-2 text-xs text-zinc-300"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={`flex-1 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-40 ${submitTone(form.tone)}`}
        >
          {submitting ? 'Working…' : confirming ? `Confirm ${form.submitLabel}` : form.submitLabel}
        </button>
      </div>

      {(target === 'connect' ? connectReply : legacyReply) && (
        <div className="text-xs text-emerald-400">
          {target === 'connect' ? connectReply : legacyReply}
        </div>
      )}
      {(target === 'connect' ? connectError : legacyError) && (
        <div className="text-xs text-red-400">
          {target === 'connect' ? connectError : legacyError}
        </div>
      )}
    </form>
  )
}

function ActionInput({
  field,
  value,
  error,
  disabled,
  onChange,
}: {
  field: ActionField
  value: unknown
  error?: string
  disabled: boolean
  onChange: (value: unknown) => void
}) {
  const label = (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] uppercase tracking-wider text-zinc-400">
        {field.label}{field.required && <span className="ml-1 text-red-400">*</span>}
      </span>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  )

  if (field.type === 'boolean') {
    return (
      <label className="flex flex-col gap-1">
        {label}
        <span className="mtc-control min-h-9 flex items-center gap-2 px-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={value === true}
            onChange={event => onChange(event.target.checked)}
            disabled={disabled || field.readOnly}
            className="w-4 h-4"
          />
          {value === true ? 'Yes' : 'No'}
        </span>
        {field.description && <span className="text-[10px] text-zinc-600">{field.description}</span>}
      </label>
    )
  }

  if (field.type === 'select' || field.type === 'multi_select') {
    const selected = field.type === 'multi_select'
      ? Array.isArray(value) ? value.map(String) : []
      : value == null ? '' : String(value)
    return (
      <label className="flex flex-col gap-1">
        {label}
        <select
          multiple={field.type === 'multi_select'}
          value={selected}
          onChange={event => onChange(
            field.type === 'multi_select'
              ? [...event.target.selectedOptions].map(option => option.value)
              : event.target.value,
          )}
          disabled={disabled || field.readOnly}
          className={`mtc-control px-2 py-2 text-xs text-zinc-100 outline-none ${field.type === 'multi_select' ? 'min-h-20' : 'min-h-9'}`}
        >
          {field.type === 'select' && <option value="">Select…</option>}
          {field.choices.map(choice => (
            <option key={choice.value} value={choice.value}>{choice.label}</option>
          ))}
        </select>
        {field.description && <span className="text-[10px] text-zinc-600">{field.description}</span>}
      </label>
    )
  }

  const numeric = field.type === 'number' || field.type === 'currency' || field.type === 'percent'
  const inputType =
    numeric ? 'number' :
    field.type === 'date' ? 'date' :
    field.type === 'datetime' ? 'datetime-local' :
    field.type === 'email' ? 'email' :
    field.type === 'url' ? 'url' :
    field.type === 'password' ? 'password' :
    'text'
  const stringValue = value == null ? '' : String(value)
  const inputClass = `mtc-control w-full min-h-9 px-2 py-2 text-xs text-zinc-100 outline-none ${error ? 'border-red-500/60' : ''}`
  return (
    <label className="flex flex-col gap-1">
      {label}
      {field.type === 'long_text' ? (
        <textarea
          value={stringValue}
          placeholder={field.placeholder}
          onChange={event => onChange(event.target.value)}
          disabled={disabled || field.readOnly}
          rows={3}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type={inputType}
          value={stringValue}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step ?? (numeric ? 'any' : undefined)}
          onChange={event => {
            if (!numeric) {
              onChange(event.target.value)
              return
            }
            const number = Number(event.target.value)
            onChange(event.target.value === '' || !Number.isFinite(number) ? '' : number)
          }}
          disabled={disabled || field.readOnly}
          className={inputClass}
        />
      )}
      {field.description && <span className="text-[10px] text-zinc-600">{field.description}</span>}
    </label>
  )
}

function submitTone(tone: 'primary' | 'danger' | 'neutral'): string {
  if (tone === 'danger') return 'bg-red-500/85 hover:bg-red-500 text-zinc-950'
  if (tone === 'neutral') return 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
  return 'bg-sky-500/85 hover:bg-sky-500 text-zinc-950'
}
