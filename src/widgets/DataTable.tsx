import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { Empty } from './states'
import { formatCurrency, formatPercent, formatBps, formatCompact, formatDateTime } from './format'
import { safeUrl } from './textNormalize'
import type { WidgetProps } from '../types/template'

const DEFAULT_PAGE_SIZE = 25
// Tick-flash window. Matches Metric so a multi-metric dashboard reads
// consistently across tile types.
const FLASH_MS = 600

interface RowContext {
  key: string       // ctx key to set
  field?: string    // column whose cell value becomes the new ctx value (default: first column)
}

export function DataTable({ data, options }: WidgetProps) {
  const { setCtx } = useDashboard()
  const pageSize = (options?.pageSize as number) || DEFAULT_PAGE_SIZE
  const rowContext = options?.row_context as RowContext | undefined
  const heatColumns = (options?.heat_columns as string[] | undefined) ?? []
  const exportEnabled = options?.export === true
  // Opt-in tick flash for streaming watchlists. Off by default — most
  // tables aren't live and don't need the visual churn.
  const tickFlash = options?.tick_flash === true
  // Opt-in client-side search. Renders a small filter input at the top
  // that matches any cell value substring. Off by default; turn on for
  // long watchlists with `options.search = true`.
  const searchEnabled = options?.search === true
  // Per-column format hints. Values:
  //   "currency"          → $1,234.56 (USD)
  //   "currency:EUR"      → €1,234.56
  //   "percent"           → -2.18%   (input as fraction)
  //   "percent:signed"    → +2.18%
  //   "percent:p"         → 2.18%    (input already a percent)
  //   "bps"               → -25 bps
  //   "bps:signed"        → +25 bps
  //   "compact"           → 1.2K / 3.4M
  // Plus a signed sub-tag on numeric formats colors the cell (green/red).
  const authorFormats = (options?.column_formats as Record<string, string> | undefined) ?? {}
  const { columns, rows, labels, formats } = useMemo(() => normalize(data), [data])
  // Backend-declared formats (from TablePayload) are the base; author
  // options.column_formats override them per column.
  const columnFormats = useMemo(() => ({ ...formats, ...authorFormats }), [formats, authorFormats])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')

  // Row identity for flash tracking. Use the first column value — that
  // matches how a watchlist is structured (symbol leading the row).
  // Falls back to row index when the first column is missing.
  const rowKey = (row: Record<string, unknown>, i: number): string => {
    const k = columns[0] != null ? row[columns[0]] : undefined
    return k == null ? `_idx_${i}` : String(k)
  }

  // Track previous numeric values per row key; when any column changes,
  // record a flash direction (by the first changed numeric column) and
  // clear after FLASH_MS. Skipped entirely when tick_flash is off.
  const prevValues = useRef<Map<string, Record<string, number>>>(new Map())
  const [flashes, setFlashes] = useState<Map<string, 'up' | 'down'>>(new Map())
  useEffect(() => {
    if (!tickFlash) return
    const additions = new Map<string, 'up' | 'down'>()
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      const key = rowKey(r, i)
      const prev = prevValues.current.get(key)
      const curr: Record<string, number> = {}
      let direction: 'up' | 'down' | null = null
      for (const col of columns) {
        const v = r[col]
        if (typeof v === 'number') {
          curr[col] = v
          if (direction == null && prev && prev[col] != null && prev[col] !== v) {
            direction = v > prev[col] ? 'up' : 'down'
          }
        }
      }
      prevValues.current.set(key, curr)
      if (direction) additions.set(key, direction)
    }
    if (additions.size === 0) return
    setFlashes(prev => {
      const next = new Map(prev)
      for (const [k, dir] of additions) next.set(k, dir)
      return next
    })
    const t = setTimeout(() => {
      setFlashes(prev => {
        const next = new Map(prev)
        for (const [k, dir] of additions) {
          if (next.get(k) === dir) next.delete(k)
        }
        return next
      })
    }, FLASH_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- columns/rowKey are derived from rows
  }, [rows, tickFlash])

  // Pre-compute min/max per heat column over the full row set so coloring
  // is stable across pages and sort.
  const heatRanges = useMemo(() => {
    const out: Record<string, { min: number; max: number }> = {}
    for (const col of heatColumns) {
      let min = Infinity, max = -Infinity
      for (const row of rows) {
        const v = row[col]
        if (typeof v === 'number' && Number.isFinite(v)) {
          if (v < min) min = v
          if (v > max) max = v
        }
      }
      if (Number.isFinite(min) && Number.isFinite(max)) out[col] = { min, max }
    }
    return out
  }, [rows, heatColumns])

  const handleRowClick = (row: Record<string, unknown>) => {
    if (!rowContext) return
    const field = rowContext.field ?? columns[0]
    const value = row[field]
    if (value != null) setCtx(rowContext.key, String(value))
  }

  // Filter first (cheaper to sort fewer rows). Case-insensitive
  // substring match against any cell — sufficient for a watchlist;
  // authors who need column-scoped search can wire it via a Select
  // widget that filters at the backend.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(row =>
      columns.some(col => {
        const v = row[col]
        return v != null && String(v).toLowerCase().includes(q)
      }),
    )
  }, [rows, columns, query])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb))
      return sortAsc ? cmp : -cmp
    })
  }, [filtered, sortKey, sortAsc])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const display = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize)
  const showPagination = sorted.length > pageSize

  const toggleSort = (col: string) => {
    if (sortKey === col) setSortAsc(!sortAsc)
    else { setSortKey(col); setSortAsc(true) }
    setPage(0)
  }

  if (columns.length === 0) {
    return <Empty>No data</Empty>
  }

  const exportCsv = () => {
    const lines = [
      columns.map(csvEscape).join(','),
      ...sorted.map(r => columns.map(c => csvEscape(r[c])).join(',')),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      {(searchEnabled || exportEnabled) && (
        <div className="flex items-center gap-2 pb-1">
          {searchEnabled && (
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(0) }}
              placeholder="filter…"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
            />
          )}
          {exportEnabled && (
            <button
              onClick={exportCsv}
              className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0"
              title="Download as CSV"
            >
              ↓ CSV
            </button>
          )}
        </div>
      )}
      <div className="overflow-auto flex-1 min-h-0" tabIndex={0} aria-label="Table data">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-900">
            <tr>
              {columns.map(col => {
                const fmt = columnFormats[col]
                // Numeric formats right-align so digits line up under
                // tabular-nums. Sparklines / strings stay left.
                const numeric = fmt && fmt !== 'sparkline' &&
                  /^(currency|percent|bps|compact)(:|$)/.test(fmt)
                return (
                  <th
                    key={col}
                    onClick={() => toggleSort(col)}
                    className={`px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${numeric ? 'text-right' : 'text-left'}`}
                  >
                    {labels[col] ?? col}
                    {sortKey === col && (
                      <span className="ml-1 text-zinc-500">{sortAsc ? '\u2191' : '\u2193'}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {display.map((row, i) => {
              const flash = flashes.get(rowKey(row, i))
              const flashClass =
                flash === 'up'   ? 'bg-emerald-500/15' :
                flash === 'down' ? 'bg-red-500/15' :
                ''
              return (
              <tr
                key={i}
                onClick={rowContext ? () => handleRowClick(row) : undefined}
                className={`border-b border-zinc-800/60 transition-colors duration-300 ${flashClass} ${
                  rowContext ? 'cursor-pointer hover:bg-zinc-800' : 'hover:bg-zinc-800/40'
                }`}
              >
                {columns.map(col => {
                  const range = heatRanges[col]
                  const value = row[col]
                  const heatStyle =
                    range && typeof value === 'number'
                      ? { backgroundColor: heatColor(value, range.min, range.max) }
                      : undefined
                  const fmt = columnFormats[col]
                  // Sparkline column: the cell value is a number[] (or
                  // an array we can coerce) and we render a tiny inline
                  // SVG instead of formatted text. The signed coloring
                  // and heat-cell tinting don't apply.
                  // Link column: value is a URL string or {label, url}.
                  // Internal (root-relative) links navigate in-tab;
                  // external ones open a new tab. Empty/unsafe urls fall
                  // back to plain text.
                  if (fmt === 'link' && value != null) {
                    const obj = typeof value === 'object' && !Array.isArray(value)
                      ? value as {label?: unknown; url?: unknown}
                      : { label: undefined, url: value }
                    const url = safeUrl(obj.url)
                    const label = obj.label != null && obj.label !== ''
                      ? String(obj.label)
                      : url ?? ''
                    return (
                      <td key={col} className="px-3 py-2.5 whitespace-nowrap" style={heatStyle}>
                        {url ? (
                          <a
                            href={url}
                            {...(url.startsWith('/')
                              ? {}
                              : { target: '_blank', rel: 'noopener noreferrer' })}
                            className="text-sky-400 hover:underline"
                          >
                            {label}
                            <span className="ml-1 text-xs text-zinc-500" aria-hidden="true">{url.startsWith('/') ? '→' : '↗'}</span>
                          </a>
                        ) : (
                          <span className="text-zinc-100">{label}</span>
                        )}
                      </td>
                    )
                  }
                  if (fmt === 'sparkline' && Array.isArray(value)) {
                    return (
                      <td key={col} className="px-3 py-2.5 whitespace-nowrap" style={heatStyle}>
                        <SparklineCell values={value as unknown[]} />
                      </td>
                    )
                  }
                  const display = fmt ? formatWith(value, fmt) : formatCell(value)
                  // Signed numeric formats color the cell green/red.
                  const isSigned = fmt ? fmt.split(':').slice(1).includes('signed') : false
                  const isNumericFmt = fmt && fmt !== 'sparkline' &&
                    /^(currency|percent|bps|compact)(:|$)/.test(fmt)
                  const align = isNumericFmt ? 'text-right' : ''
                  const tone =
                    isSigned && typeof value === 'number'
                      ? value > 0 ? 'text-emerald-400' :
                        value < 0 ? 'text-red-400' :
                        'text-zinc-100'
                      : 'text-zinc-100'
                  return (
                    <td
                      key={col}
                      className={`px-3 py-2.5 whitespace-nowrap tabular-nums ${align} ${tone}`}
                      style={heatStyle}
                    >
                      {display}
                    </td>
                  )
                })}
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>{sorted.length} rows</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(0)} disabled={safePage === 0} className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30">&laquo;</button>
            <button onClick={() => setPage(p => p - 1)} disabled={safePage === 0} className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30">&lsaquo;</button>
            <span className="px-2 text-zinc-300">{safePage + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={safePage >= totalPages - 1} className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30">&rsaquo;</button>
            <button onClick={() => setPage(totalPages - 1)} disabled={safePage >= totalPages - 1} className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30">&raquo;</button>
          </div>
        </div>
      )}
    </div>
  )
}

interface NormalizedTable {
  columns: string[]
  rows: Record<string, unknown>[]
  // Header label per column key (from TablePayload TableColumn.label).
  labels: Record<string, string>
  // Format hint per column key (from TableColumn.format). Merged under
  // any options.column_formats the author supplies, so authoring wins.
  formats: Record<string, string>
}

// Accepts every table shape a backend might send:
//   - top-level array of row objects (columns auto-detected)
//   - the canonical TablePayload: { columns: [{key,label,format,...}], rows: [{...}] }
//   - the legacy positional form:  { columns: ["a","b"], rows: [[1,2], ...] }
//   - a bare { rows: [{...}] } (columns auto-detected from row keys)
function normalize(data: unknown): NormalizedTable {
  const empty: NormalizedTable = { columns: [], rows: [], labels: {}, formats: {} }
  if (!data) return empty

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const columns = [...new Set(data.flatMap(row => Object.keys(row as object)))]
    return { ...empty, columns, rows: data as Record<string, unknown>[] }
  }

  if (typeof data === 'object' && data !== null && 'rows' in data) {
    const d = data as { columns?: unknown[]; rows: unknown[] }
    const rawCols = Array.isArray(d.columns) ? d.columns : []

    // Canonical TablePayload — columns are { key, label?, format? } objects.
    if (rawCols.length > 0 && typeof rawCols[0] === 'object') {
      const cols = rawCols as { key: string; label?: string; format?: string }[]
      const columns = cols.map(c => c.key)
      const labels: Record<string, string> = {}
      const formats: Record<string, string> = {}
      for (const c of cols) {
        if (c.label) labels[c.key] = c.label
        if (c.format) formats[c.key] = c.format
      }
      const rows = (d.rows as unknown[]).map(row =>
        Array.isArray(row)
          ? Object.fromEntries(columns.map((k, i) => [k, (row as unknown[])[i]]))
          : (row as Record<string, unknown>),
      )
      return { columns, rows, labels, formats }
    }

    // Legacy positional form — string columns, array rows.
    if (rawCols.length > 0) {
      const columns = rawCols as string[]
      const rows = (d.rows as unknown[]).map(row =>
        Array.isArray(row)
          ? Object.fromEntries(columns.map((c, i) => [c, (row as unknown[])[i]]))
          : (row as Record<string, unknown>),
      )
      return { ...empty, columns, rows }
    }

    // Rows only — derive columns from the union of row keys.
    const rows = d.rows as Record<string, unknown>[]
    if (rows.length > 0 && typeof rows[0] === 'object' && !Array.isArray(rows[0])) {
      const columns = [...new Set(rows.flatMap(r => Object.keys(r)))]
      return { ...empty, columns, rows }
    }
  }

  return empty
}

// Diverging when the column straddles 0 (% change), sequential otherwise.
// Returns a translucent theme color so the row's hover effect still shows
// through and host/operator themes remain consistent.
function heatColor(value: number, min: number, max: number): string {
  if (max === min) return 'transparent'
  if (min < 0 && max > 0) {
    const span = Math.max(Math.abs(min), Math.abs(max))
    const t = Math.max(-1, Math.min(1, value / span))
    return t >= 0
      ? `color-mix(in oklab, var(--mtc-ok) ${35 * t}%, transparent)`
      : `color-mix(in oklab, var(--mtc-danger) ${35 * -t}%, transparent)`
  }
  const t = (value - min) / (max - min)
  return `color-mix(in oklab, var(--mtc-accent) ${35 * t}%, transparent)`
}

// CSV-escape: wrap in quotes when needed, double internal quotes.
function csvEscape(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'object' && !Array.isArray(v) && 'url' in (v as object)) {
    return csvEscape((v as {url?: unknown}).url)
  }
  const s = typeof v === 'number' ? String(v) : String(v)
  if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

// Tiny inline sparkline for table cells. Direction (up/down) chooses the
// stroke color — emerald if the last value is at-or-above the first,
// red otherwise. Drops on the floor if the array can't be coerced to
// at least two finite numbers.
function SparklineCell({ values }: { values: unknown[] }) {
  const nums = values.map(v => Number(v)).filter(n => Number.isFinite(n))
  if (nums.length < 2) return <span className="text-zinc-600">—</span>
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const range = max - min || 1
  const up = nums[nums.length - 1] >= nums[0]
  const color = up ? 'var(--mtc-ok)' : 'var(--mtc-danger)'
  const points = nums
    .map((v, i) => {
      const x = (i / (nums.length - 1)) * 100
      const y = 16 - ((v - min) / range) * 14 - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg viewBox="0 0 100 16" className="w-20 h-4" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function formatCell(value: unknown): string {
  if (value == null) return '\u2014'
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

// Apply a column_formats hint to one cell value. Non-numeric values pass
// through to the default formatter so a string in a "currency" column
// (e.g. an aggregator label) doesn't crash the row.
//
// Hint grammar: "type[:arg[:arg ...]]" \u2014 args are order-independent.
//   currency[:CODE]              CODE defaults to USD (e.g. "currency:EUR")
//   percent[:signed][:p]         p \u21d2 input already in % units; signed adds +/-
//   bps[:signed]                 signed adds +/-
//   compact                      1.2K / 3.4M
function formatWith(value: unknown, hint: string): string {
  if (value == null) return '\u2014'
  // datetime accepts strings (ISO) and epoch numbers; check before the
  // numeric short-circuit below.
  if (hint.split(':')[0] === 'datetime') return formatDateTime(value)
  if (typeof value !== 'number') return formatCell(value)
  const [head, ...args] = hint.split(':')
  const argSet = new Set(args)
  const signed = argSet.has('signed')
  switch (head) {
    case 'currency': {
      // The non-`signed` arg, if any, is the currency code.
      const code = args.find(a => a !== 'signed') ?? 'USD'
      return formatCurrency(value, code)
    }
    case 'percent': {
      const as = argSet.has('p') ? 'percent' as const : 'fraction' as const
      return formatPercent(value, { signed, as })
    }
    case 'bps':
      return formatBps(value, { signed })
    case 'compact':
      return formatCompact(value)
    default:
      return formatCell(value)
  }
}
