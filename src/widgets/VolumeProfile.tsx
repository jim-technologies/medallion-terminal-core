import { useMemo } from 'react'
import type { WidgetProps } from '../types/template'

interface Row { price: number; volume: number }

// Horizontal volume-by-price histogram. Reuses the table-shaped payload:
// array of { price, volume } objects (or { rows: [...] }). Bars are
// scaled to the column max; rows are sorted high→low so the chart
// reads top-down.
export function VolumeProfile({ data }: WidgetProps) {
  const rows = useMemo(() => normalize(data), [data])
  if (!rows || rows.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  const max = Math.max(...rows.map(r => r.volume), 1)

  return (
    <div className="h-full overflow-auto">
      <div className="flex flex-col gap-px font-mono text-[10px]">
        {rows.map((r, i) => {
          const pct = (r.volume / max) * 100
          return (
            <div key={i} className="relative flex items-center px-2 py-0.5" title={`${r.price} — ${r.volume.toLocaleString()}`}>
              <div
                className="absolute inset-y-0.5 left-16 bg-sky-500/20 rounded-sm"
                style={{ width: `${pct}%`, maxWidth: 'calc(100% - 4.5rem)' }}
              />
              <span className="relative w-14 shrink-0 text-zinc-300 tabular-nums">{format(r.price)}</span>
              <span className="relative ml-auto text-zinc-400 tabular-nums">{abbrev(r.volume)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function normalize(data: unknown): Row[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) raw = data
  else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.rows)) raw = d.rows
    else if (Array.isArray(d.levels)) raw = d.levels
  }
  if (!raw) return null

  const rows: Row[] = raw
    .map(r => {
      const rr = r as Record<string, unknown>
      return { price: Number(rr.price ?? 0), volume: Number(rr.volume ?? rr.size ?? 0) }
    })
    .filter(r => Number.isFinite(r.price) && Number.isFinite(r.volume) && r.volume > 0)
  if (rows.length === 0) return null
  rows.sort((a, b) => b.price - a.price)
  return rows
}

function format(n: number): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return n.toFixed(2)
}

function abbrev(n: number): string {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(0)
}
