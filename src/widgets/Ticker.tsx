import { useMemo } from 'react'
import type { WidgetProps } from '../types/template'

// Auto-scrolling EventPayload renderer — same data shape as the
// `Events` widget, but laid out as a horizontal stock-ticker that
// loops continuously instead of requiring the user to scroll. Pauses
// on hover so the operator can read a passing alert.

const STATUS_COLOR: Record<string, string> = {
  EVENT_STATUS_OK:      'border-emerald-500/40 text-emerald-300',
  EVENT_STATUS_WARN:    'border-amber-500/40   text-amber-300',
  EVENT_STATUS_ERROR:   'border-red-500/40     text-red-300',
  EVENT_STATUS_INFO:    'border-sky-500/40     text-sky-300',
  EVENT_STATUS_PENDING: 'border-zinc-500/40    text-zinc-300',
  ok:      'border-emerald-500/40 text-emerald-300',
  warn:    'border-amber-500/40   text-amber-300',
  error:   'border-red-500/40     text-red-300',
  info:    'border-sky-500/40     text-sky-300',
  pending: 'border-zinc-500/40    text-zinc-300',
}
const DEFAULT_COLOR = 'border-zinc-700 text-zinc-300'

interface Item {
  timestamp: string
  label: string
  status?: string
}

interface TickerOptions {
  // Seconds per loop. Default 30 — one rotation per 30s. Smaller
  // numbers scroll faster.
  speed_seconds?: number
}

export function Ticker({ data, options }: WidgetProps) {
  const items = useMemo(() => normalize(data), [data])
  if (!items || items.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No items</div>
  }

  const opts = (options ?? {}) as TickerOptions
  const speed = Math.max(5, opts.speed_seconds ?? 30)

  return (
    <div className="h-full overflow-hidden flex items-center group">
      <div
        className="flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((item, i) => <Pill key={`a-${i}`} item={item} />)}
        {/* Second copy follows the first so translateX(-50%) loops seamlessly. */}
        {items.map((item, i) => <Pill key={`b-${i}`} item={item} aria-hidden />)}
      </div>
    </div>
  )
}

function Pill({ item, ...rest }: { item: Item; 'aria-hidden'?: boolean }) {
  const color = STATUS_COLOR[item.status ?? ''] ?? DEFAULT_COLOR
  return (
    <div
      {...rest}
      className={`shrink-0 px-2.5 py-1 rounded border bg-zinc-900/40 text-xs flex items-center gap-2 font-mono ${color}`}
    >
      <span className="text-[10px] text-zinc-500 tabular-nums">{item.timestamp}</span>
      <span>{item.label}</span>
    </div>
  )
}

function normalize(data: unknown): Item[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) {
    raw = data
  } else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.events)) raw = d.events
    else if (Array.isArray(d.items)) raw = d.items
  }
  if (!raw) return null
  return raw.map(e => {
    const ee = e as Record<string, unknown>
    return {
      timestamp: String(ee.timestamp ?? ''),
      label: String(ee.label ?? ''),
      status: ee.status != null ? String(ee.status) : undefined,
    }
  })
}
