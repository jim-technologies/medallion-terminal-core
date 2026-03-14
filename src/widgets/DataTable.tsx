import { useState, useMemo } from 'react'
import type { WidgetProps } from '../types/template'

const DEFAULT_PAGE_SIZE = 20

export function DataTable({ data, options }: WidgetProps) {
  const pageSize = (options?.pageSize as number) || DEFAULT_PAGE_SIZE
  const { columns, rows } = useMemo(() => normalize(data), [data])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [page, setPage] = useState(0)

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
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize)
  const showPagination = sorted.length > pageSize

  const toggleSort = (col: string) => {
    if (sortKey === col) setSortAsc(!sortAsc)
    else { setSortKey(col); setSortAsc(true) }
    setPage(0)
  }

  if (columns.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  return (
    <div className="flex flex-col h-full">
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
            {paged.map((row, i) => (
              <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-800/40">
                {columns.map(col => (
                  <td key={col} className="px-3 py-2.5 whitespace-nowrap tabular-nums text-zinc-100">
                    {formatCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>{sorted.length} rows</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(0)}
              disabled={safePage === 0}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &laquo;
            </button>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &lsaquo;
            </button>
            <span className="px-2 text-zinc-300">
              {safePage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &rsaquo;
            </button>
            <button
              onClick={() => setPage(totalPages - 1)}
              disabled={safePage >= totalPages - 1}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &raquo;
            </button>
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
