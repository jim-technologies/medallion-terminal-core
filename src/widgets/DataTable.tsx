import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboard } from '../core/DashboardContext'
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
  const { columns, rows } = useMemo(() => normalize(data), [data])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(0)

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

  const sorted = useMemo(() => {
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
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
  }, [rows, sortKey, sortAsc])

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
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
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
      {exportEnabled && (
        <div className="flex justify-end pb-1">
          <button
            onClick={exportCsv}
            className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800"
            title="Download as CSV"
          >
            ↓ CSV
          </button>
        </div>
      )}
      <div className="overflow-auto flex-1 min-h-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-900">
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="text-left px-3 py-2 text-zinc-400 border-b border-zinc-700
                    cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium"
                >
                  {col}
                  {sortKey === col && (
                    <span className="ml-1 text-zinc-500">{sortAsc ? '\u2191' : '\u2193'}</span>
                  )}
                </th>
              ))}
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
                  return (
                    <td
                      key={col}
                      className="px-3 py-2.5 whitespace-nowrap tabular-nums text-zinc-100"
                      style={heatStyle}
                    >
                      {formatCell(row[col])}
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

function normalize(data: unknown): { columns: string[]; rows: Record<string, unknown>[] } {
  if (!data) return { columns: [], rows: [] }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const columns = [...new Set(data.flatMap(row => Object.keys(row as object)))]
    return { columns, rows: data as Record<string, unknown>[] }
  }

  if (typeof data === 'object' && data !== null && 'columns' in data && 'rows' in data) {
    const d = data as { columns: string[]; rows: unknown[][] }
    const rows = d.rows.map(row =>
      Object.fromEntries(d.columns.map((col, i) => [col, row[i]]))
    )
    return { columns: d.columns, rows }
  }

  return { columns: [], rows: [] }
}

// Diverging when the column straddles 0 (% change), sequential otherwise.
// Returns a translucent rgba so the row's hover effect still shows through.
function heatColor(value: number, min: number, max: number): string {
  if (max === min) return 'transparent'
  if (min < 0 && max > 0) {
    const span = Math.max(Math.abs(min), Math.abs(max))
    const t = Math.max(-1, Math.min(1, value / span))
    return t >= 0
      ? `rgba(16, 185, 129, ${0.35 * t})`        // emerald
      : `rgba(239, 68, 68, ${0.35 * -t})`        // red
  }
  const t = (value - min) / (max - min)
  return `rgba(14, 165, 233, ${0.35 * t})`       // sky
}

// CSV-escape: wrap in quotes when needed, double internal quotes.
function csvEscape(v: unknown): string {
  if (v == null) return ''
  const s = typeof v === 'number' ? String(v) : String(v)
  if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
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
