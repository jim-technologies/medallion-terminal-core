import { useState, useMemo } from 'react'
import type { WidgetProps } from '../types/template'

export function DataTable({ data }: WidgetProps) {
  const { columns, rows } = useMemo(() => normalize(data), [data])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

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

  const toggleSort = (col: string) => {
    if (sortKey === col) setSortAsc(!sortAsc)
    else { setSortKey(col); setSortAsc(true) }
  }

  if (columns.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  return (
    <div className="overflow-auto h-full">
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
          {sorted.map((row, i) => (
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
  )
}

function normalize(data: unknown): { columns: string[]; rows: Record<string, unknown>[] } {
  if (!data) return { columns: [], rows: [] }

  // Array of objects — auto-generate columns from keys
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const columns = [...new Set(data.flatMap(row => Object.keys(row as object)))]
    return { columns, rows: data as Record<string, unknown>[] }
  }

  // Explicit { columns, rows } format
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
