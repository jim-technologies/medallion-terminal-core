import { useMemo, useState } from 'react'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

const STATUS_DOT: Record<string, string> = {
  EVENT_STATUS_OK:      'bg-emerald-500',
  EVENT_STATUS_WARN:    'bg-amber-500',
  EVENT_STATUS_ERROR:   'bg-red-500',
  EVENT_STATUS_INFO:    'bg-sky-500',
  EVENT_STATUS_PENDING: 'bg-zinc-500 animate-pulse',
  ok:      'bg-emerald-500',
  warn:    'bg-amber-500',
  error:   'bg-red-500',
  info:    'bg-sky-500',
  pending: 'bg-zinc-500 animate-pulse',
}

interface Event {
  timestamp: string
  label: string
  status?: string
  body?: string
  source?: string
  tags?: string[]
}

export function Events({ data, options }: WidgetProps) {
  const events = useMemo(() => normalize(data), [data])
  const filterEnabled = options?.filter === true
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    if (!events) return null
    if (!query.trim()) return events
    const q = query.toLowerCase()
    return events.filter(e =>
      e.label.toLowerCase().includes(q)
      || (e.body?.toLowerCase().includes(q) ?? false)
      || (e.source?.toLowerCase().includes(q) ?? false)
      || (e.tags?.some(t => t.toLowerCase().includes(q)) ?? false),
    )
  }, [events, query])

  if (!events || events.length === 0) {
    return <Empty>No events</Empty>
  }

  return (
    <div className="h-full flex flex-col">
      {filterEnabled && (
        <input
          type="text"
          placeholder="Filter events…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 mb-2 shrink-0"
        />
      )}
      <div className="flex-1 overflow-auto min-h-0">
      {visible!.length === 0 && (
        <div className="flex items-center justify-center h-full text-zinc-500 text-xs">No matches</div>
      )}
      {visible!.map((e, i) => (
        <div key={i} className="flex gap-3 px-1 py-2.5 border-b border-zinc-800 last:border-0">
          <div className="flex flex-col items-center pt-1.5 shrink-0">
            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[e.status ?? ''] ?? 'bg-zinc-600'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-zinc-500 tabular-nums shrink-0 font-mono">{e.timestamp}</span>
              <span className="text-sm text-zinc-100 truncate">{e.label}</span>
            </div>
            {e.body && <div className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{e.body}</div>}
            {(e.source || (e.tags && e.tags.length > 0)) && (
              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500 flex-wrap">
                {e.source && <span className="text-zinc-500">{e.source}</span>}
                {e.tags?.map((t, ti) => (
                  <span key={ti} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

function normalize(data: unknown): Event[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) {
    raw = data
  } else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.events)) raw = d.events
  }
  if (!raw) return null
  return raw.map(e => {
    const ee = e as Record<string, unknown>
    return {
      timestamp: String(ee.timestamp ?? ''),
      label: String(ee.label ?? ''),
      status: ee.status != null ? String(ee.status) : undefined,
      body: ee.body != null ? String(ee.body) : undefined,
      source: ee.source != null ? String(ee.source) : undefined,
      tags: Array.isArray(ee.tags) ? ee.tags.map(String) : undefined,
    }
  })
}
