import { useState, useCallback, type KeyboardEvent } from 'react'
import { useDashboard, type WidgetAction } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'

interface PromptResponse {
  dialogue?: {
    text?: string
  }
  actions?: WidgetAction[]
}

export function Prompt({ options }: WidgetProps) {
  const { dispatch } = useDashboard()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const url = options?.url as string | undefined

  const submit = useCallback(async () => {
    if (!url || !query.trim() || loading) return

    setLoading(true)
    setError(null)
    setReply(null)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const result: PromptResponse = await res.json()

      // Show dialogue text
      if (result.dialogue?.text) {
        setReply(result.dialogue.text)
      }

      // Dispatch actions to update widgets
      if (result.actions && result.actions.length > 0) {
        dispatch(result.actions)
      }

      setQuery('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [url, query, loading, dispatch])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Prompt requires options.url
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
      {reply && (
        <div className="text-xs text-zinc-400 leading-relaxed">{reply}</div>
      )}
      {error && (
        <div className="text-xs text-red-400">{error}</div>
      )}
    </div>
  )
}
