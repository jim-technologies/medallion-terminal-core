import { useState, useCallback, type KeyboardEvent } from 'react'
import { useDashboard, type WidgetAction } from '../core/DashboardContext'
import { buildGenerateUrl, buildGenerateRequest } from '../core/resolveSource'
import type { Context, WidgetProps } from '../types/template'

// Response shape mirrors GenerateResponse from the proto. All fields
// optional — backends are free to send partial responses.
interface GenerateResponse {
  text?: string
  actions?: WidgetAction[]
  context?: Context
  replace_all?: boolean
}

// Legacy ad-hoc shape, kept for backwards compatibility with any
// non-Connect backend wired via options.url.
interface LegacyResponse {
  dialogue?: { text?: string }
  actions?: WidgetAction[]
}

export function Prompt({ options }: WidgetProps) {
  const { dispatch, ctx, setCtx, backendUrl, widgets } = useDashboard()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Prefer Connect Generate when the dashboard is configured against a
  // backend; otherwise speak the legacy ad-hoc shape against
  // `options.url` so demo backends keep working.
  const fallbackUrl = options?.url as string | undefined
  const hasBackend = !!backendUrl

  const submit = useCallback(async () => {
    const text = query.trim()
    if (!text || loading) return
    if (!hasBackend && !fallbackUrl) return

    setLoading(true)
    setError(null)
    setReply(null)

    try {
      const res = hasBackend
        ? await fetch(buildGenerateUrl(backendUrl!), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildGenerateRequest(text, ctx, widgets)),
          })
        : await fetch(fallbackUrl!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: text }),
          })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const result = (await res.json()) as GenerateResponse & LegacyResponse

      const replyText = result.text ?? result.dialogue?.text
      if (replyText) setReply(replyText)

      if (result.context?.values) {
        for (const [k, v] of Object.entries(result.context.values)) setCtx(k, v)
      }

      if (result.actions && result.actions.length > 0) {
        dispatch(result.actions, { replaceAll: result.replace_all })
      }

      setQuery('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [query, loading, hasBackend, backendUrl, fallbackUrl, ctx, widgets, dispatch, setCtx])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  if (!hasBackend && !fallbackUrl) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Set a backendUrl on Dashboard or options.url on this widget
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 h-full justify-center">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
            placeholder-zinc-500 outline-none focus:border-zinc-500 disabled:opacity-50"
          placeholder="Ask anything... (Enter to send)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          onClick={submit}
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default
            rounded-lg text-sm text-zinc-200 font-medium shrink-0"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
      {reply && <div className="text-xs text-zinc-400 leading-relaxed">{reply}</div>}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  )
}
