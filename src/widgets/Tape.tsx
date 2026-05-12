import { useEffect, useRef, useState } from 'react'
import { Empty } from './states'
import { formatTimestamp } from './format'
import type { WidgetProps } from '../types/template'

// Time-and-sales / event tape. Append-only stream display optimized for
// high-frequency feeds (trade prints, transaction logs, headline crawl).
//
// Different from `events` (finite labeled list) and `action_log`
// (internal action ring): `tape` maintains its own bounded buffer and
// dedupes incoming entries, so a streaming source can fire one event
// per tick or a rolling snapshot per second — either works.
//
// Newest entries land at the top with a brief sky flash. Side ('buy' /
// 'sell' / 'bid' / 'ask') tints the row green or red so direction reads
// at a glance.

const BUFFER_CAP = 500
const FLASH_MS = 800

interface TapeEvent {
  id?: string
  timestamp?: string | number
  price?: number
  size?: number
  side?: string
  label?: string
}

interface BufferedEvent extends TapeEvent {
  _key: string
  _receivedAt: number
}

// Stable identity for dedup. Prefer an explicit id; fall back to a
// timestamp+price+size fingerprint that's almost always unique within
// the buffer window.
function eventKey(e: TapeEvent): string {
  if (e.id) return `id:${e.id}`
  return `t:${e.timestamp ?? ''}|p:${e.price ?? ''}|s:${e.size ?? ''}|x:${e.label ?? ''}`
}

function sideTone(side?: string): { row: string; text: string } {
  const s = (side ?? '').toLowerCase()
  if (s === 'buy' || s === 'bid') return { row: 'bg-emerald-500/5', text: 'text-emerald-400' }
  if (s === 'sell' || s === 'ask') return { row: 'bg-red-500/5', text: 'text-red-400' }
  return { row: '', text: 'text-zinc-300' }
}

// Normalize one update from a data source into zero or more events.
// Accepts: a single event object, an array of events, or
// `{events: [...]}` (canonical TextPayload-style envelope).
function normalize(data: unknown): TapeEvent[] {
  if (data == null) return []
  if (Array.isArray(data)) return data.map(normalizeOne)
  if (typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.events)) return d.events.map(normalizeOne)
    if (Array.isArray(d.items))  return d.items.map(normalizeOne)
    // Single event object.
    return [normalizeOne(d)]
  }
  return []
}

function normalizeOne(raw: unknown): TapeEvent {
  if (raw == null || typeof raw !== 'object') return {}
  const r = raw as Record<string, unknown>
  return {
    id:        r.id        != null ? String(r.id)        : undefined,
    timestamp: r.timestamp != null ? r.timestamp as (string | number)
             : r.time      != null ? r.time      as (string | number)
             : r.ts        != null ? r.ts        as (string | number) : undefined,
    price:     typeof r.price === 'number' ? r.price : undefined,
    size:      typeof r.size  === 'number' ? r.size  :
               typeof r.qty   === 'number' ? r.qty   :
               typeof r.amount === 'number' ? r.amount : undefined,
    side:      r.side  != null ? String(r.side).toLowerCase() : undefined,
    label:     r.label != null ? String(r.label) :
               r.text  != null ? String(r.text)  :
               r.title != null ? String(r.title) : undefined,
  }
}

export function Tape({ data, options }: WidgetProps) {
  const cap = (options?.cap as number) || BUFFER_CAP
  const incoming = normalize(data)

  // Bounded buffer. Entries are appended (newest first) when their
  // identity isn't already in the buffer. A separate state guards the
  // flash highlight on rising-edge inserts.
  const [buffer, setBuffer] = useState<BufferedEvent[]>([])
  const seen = useRef<Set<string>>(new Set())
  const initialized = useRef(false)

  useEffect(() => {
    if (incoming.length === 0) return
    const fresh: BufferedEvent[] = []
    for (const e of incoming) {
      const key = eventKey(e)
      if (seen.current.has(key)) continue
      seen.current.add(key)
      fresh.push({ ...e, _key: key, _receivedAt: Date.now() })
    }
    if (fresh.length === 0) return
    setBuffer(prev => {
      // Newest first; cap the tail. Maintain insertion order within the
      // same data tick so multi-event payloads display in source order.
      const next = [...fresh.reverse(), ...prev]
      if (next.length <= cap) return next
      // Drop trimmed entries from `seen` too so a long-running tape
      // doesn't grow the dedup set unboundedly.
      for (const dropped of next.slice(cap)) seen.current.delete(dropped._key)
      return next.slice(0, cap)
    })
    // On first render don't flash — a freshly mounted widget should
    // settle into its initial buffer without a wall of highlights.
    if (!initialized.current) {
      initialized.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- data identity tracks updates
  }, [data, cap])

  if (buffer.length === 0) {
    return <Empty>No prints yet</Empty>
  }

  const flashCutoff = Date.now() - FLASH_MS
  return (
    <div className="h-full overflow-auto text-xs font-mono">
      {buffer.map(e => {
        const tone = sideTone(e.side)
        const flashing = e._receivedAt > flashCutoff && initialized.current
        const rowBg = flashing ? 'bg-sky-500/10' : tone.row
        return (
          <div
            key={e._key}
            className={`grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${rowBg}`}
          >
            <span className="text-zinc-500 tabular-nums truncate">
              {e.timestamp != null ? formatTime(e.timestamp) : ''}
            </span>
            <span className={`truncate ${tone.text}`}>
              {e.label ?? e.side?.toUpperCase() ?? '·'}
            </span>
            <span className={`text-right tabular-nums ${tone.text}`}>
              {e.price != null ? formatPx(e.price) : ''}
            </span>
            <span className="text-right tabular-nums text-zinc-400">
              {e.size != null ? formatSize(e.size) : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// HH:MM:SS for intraday timestamps, else fall back to the standard date
// formatter. Tape prints almost always have a time-of-day so the short
// form is the common path.
function formatTime(ts: string | number): string {
  try {
    const d = new Date(ts)
    if (isNaN(d.getTime())) return String(ts)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  } catch {
    return formatTimestamp(ts)
  }
}

function formatPx(n: number): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return n.toFixed(Math.abs(n) < 1 ? 4 : 2)
}

function formatSize(n: number): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  if (Math.abs(n) >= 1) return n.toFixed(2)
  return n.toFixed(4)
}
