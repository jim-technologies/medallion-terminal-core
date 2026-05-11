import { useMemo } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { Empty } from './states'
import type { WidgetProps } from '../types/template'

// Click-a-row → set ctx[key] to the row's `key` (strike, line, etc).
// Mirrors the DataTable / Heatmap row_context convention.
interface PairedRowContext {
  key: string
}

interface PairedSide {
  values: Record<string, number>
}

interface PairedRow {
  key: number
  left?: PairedSide
  right?: PairedSide
}

interface PairedMeasure {
  key: string
  label: string
  format?: string
}

interface PairedGridData {
  subject: string
  dimension?: string
  subject_value?: number
  venue?: string
  rows: PairedRow[]
  left_label: string
  right_label: string
  key_label: string
  measures: PairedMeasure[]
}

const MAX_AUTO_MEASURES = 6

export function PairedGrid({ data, options }: WidgetProps) {
  const { setCtx } = useDashboard()
  const grid = useMemo(() => normalize(data), [data])
  const sortedRows = useMemo(
    () => (grid ? [...grid.rows].sort((a, b) => a.key - b.key) : []),
    [grid],
  )
  if (!grid) return <Empty>No data</Empty>

  const subjectVal = grid.subject_value
  const step = sortedRows.length >= 2 ? sortedRows[1].key - sortedRows[0].key : 0
  const measures = grid.measures
  const rowContext = options?.row_context as PairedRowContext | undefined

  return (
    <div className="h-full flex flex-col text-xs">
      <div className="px-3 py-2 border-b border-zinc-800 flex items-baseline gap-3 flex-wrap shrink-0">
        <span className="text-zinc-100 font-medium">{grid.subject}</span>
        {grid.dimension && <span className="text-zinc-500">{grid.dimension}</span>}
        {subjectVal != null && (
          <span className="text-zinc-300 tabular-nums">{subjectVal.toLocaleString()}</span>
        )}
        {grid.venue && <span className="ml-auto text-zinc-500 text-[10px] uppercase tracking-wider">{grid.venue}</span>}
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full font-mono tabular-nums">
          <thead className="sticky top-0 bg-zinc-900 z-10">
            <tr className="text-[10px] text-zinc-600 border-b border-zinc-800/60">
              <th colSpan={measures.length} className="text-center py-1 text-emerald-400 uppercase tracking-wider">{grid.left_label}</th>
              <th className="bg-zinc-950" />
              <th colSpan={measures.length} className="text-center py-1 text-red-400 uppercase tracking-wider">{grid.right_label}</th>
            </tr>
            <tr className="text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
              {measures.map(m => <th key={`l-${m.key}`} className="text-right px-2 py-1.5">{m.label}</th>)}
              <th className="text-center px-2 py-1.5 bg-zinc-950">{grid.key_label}</th>
              {measures.map(m => <th key={`r-${m.key}`} className="text-right px-2 py-1.5">{m.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, i) => {
              const isAtm = subjectVal != null && step > 0 && Math.abs(row.key - subjectVal) < step
              const clickable = !!rowContext
              const trClass = `${isAtm ? 'bg-zinc-800/40' : 'hover:bg-zinc-800/20'} ${clickable ? 'cursor-pointer' : ''}`
              return (
                <tr
                  key={i}
                  onClick={clickable ? () => setCtx(rowContext!.key, String(row.key)) : undefined}
                  className={`border-b border-zinc-800/40 ${trClass}`}
                >
                  {measures.map(m => (
                    <td key={`l-${m.key}`} className="text-right px-2 py-1 text-zinc-300">
                      {fmtMeasure(row.left?.values?.[m.key], m.format)}
                    </td>
                  ))}
                  <td className={`text-center px-2 py-1 font-medium ${isAtm ? 'text-zinc-100 bg-zinc-950/60' : 'text-zinc-300 bg-zinc-950/40'}`}>
                    {row.key.toLocaleString()}
                  </td>
                  {measures.map(m => (
                    <td key={`r-${m.key}`} className="text-right px-2 py-1 text-zinc-300">
                      {fmtMeasure(row.right?.values?.[m.key], m.format)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function normalize(data: unknown): PairedGridData | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const d = data as Record<string, unknown>
  if (!Array.isArray(d.rows) || d.rows.length === 0) return null

  const rows: PairedRow[] = d.rows.map(r => {
    const rr = r as Record<string, unknown>
    return {
      // Accept legacy options shape (`strike`/`call`/`put`) so authored
      // fixtures keep rendering during migration.
      key: Number(rr.key ?? rr.strike ?? 0),
      left: parseSide(rr.left ?? rr.call),
      right: parseSide(rr.right ?? rr.put),
    }
  })

  const declared = parseMeasures(d.measures)
  const measures = declared.length > 0 ? declared : inferMeasures(rows)

  return {
    subject: String(d.subject ?? d.underlying ?? ''),
    dimension: typeof d.dimension === 'string' ? d.dimension : typeof d.expiry === 'string' ? d.expiry : undefined,
    subject_value: typeof d.subject_value === 'number' ? d.subject_value : typeof d.underlying_price === 'number' ? d.underlying_price : undefined,
    venue: typeof d.venue === 'string' ? d.venue : undefined,
    rows,
    left_label: String(d.left_label ?? 'Left'),
    right_label: String(d.right_label ?? 'Right'),
    key_label: String(d.key_label ?? 'Key'),
    measures,
  }
}

function parseMeasures(raw: unknown): PairedMeasure[] {
  if (!Array.isArray(raw)) return []
  const out: PairedMeasure[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object') continue
    const mm = m as Record<string, unknown>
    if (typeof mm.key !== 'string') continue
    out.push({
      key: mm.key,
      label: typeof mm.label === 'string' && mm.label ? mm.label : mm.key,
      format: typeof mm.format === 'string' ? mm.format : undefined,
    })
  }
  return out
}

function inferMeasures(rows: PairedRow[]): PairedMeasure[] {
  const seen = new Set<string>()
  for (const r of rows) {
    for (const s of [r.left, r.right]) {
      if (s?.values) for (const k of Object.keys(s.values)) seen.add(k)
    }
  }
  return Array.from(seen).slice(0, MAX_AUTO_MEASURES).map(k => ({ key: k, label: k }))
}

function parseSide(raw: unknown): PairedSide | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const r = raw as Record<string, unknown>
  // When `values` is set it's the sole source of truth — never silently
  // promote sibling scalars, since future canonical metadata could be
  // numeric and would leak into the rendered measure columns.
  if (r.values && typeof r.values === 'object' && !Array.isArray(r.values)) {
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(r.values as Record<string, unknown>)) {
      if (typeof v === 'number') out[k] = v
    }
    return Object.keys(out).length === 0 ? undefined : { values: out }
  }
  // Legacy options shape — no `values` key, so promote scattered scalar
  // fields. Only fires for old fixtures during migration.
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(r)) {
    if (typeof v === 'number') out[k] = v
  }
  return Object.keys(out).length === 0 ? undefined : { values: out }
}

function fmtMeasure(n: number | undefined, format?: string): string {
  if (n == null) return '·'
  if (format === 'percent') return `${(n * 100).toFixed(0)}%`
  if (format === 'compact') {
    if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
    return n.toFixed(2)
  }
  if (format === 'delta') {
    const sign = n > 0 ? '+' : ''
    return `${sign}${n.toFixed(2)}`
  }
  if (format?.startsWith('currency')) {
    const code = format.split(':')[1] ?? 'USD'
    return n.toLocaleString(undefined, { style: 'currency', currency: code, maximumFractionDigits: 0 })
  }
  return n.toFixed(2)
}
