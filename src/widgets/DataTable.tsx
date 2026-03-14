import { useState, useMemo, useEffect, useCallback } from 'react'
import type { WidgetProps } from '../types/template'

const DEFAULT_PAGE_SIZE = 20

// Backend pagination response shape
interface PaginatedResponse {
  rows?: unknown[]
  data?: unknown[]
  nextCursor?: string | null
  prevCursor?: string | null
  next?: string | null
  prev?: string | null
  totalCount?: number
  total?: number
}

function isPaginated(data: unknown): data is PaginatedResponse {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  const d = data as Record<string, unknown>
  return ('rows' in d || 'data' in d) && ('nextCursor' in d || 'next' in d || 'totalCount' in d || 'total' in d)
}

export function DataTable({ data, options }: WidgetProps) {
  const pageSize = (options?.pageSize as number) || DEFAULT_PAGE_SIZE
  const paginated = isPaginated(data)

  // Backend pagination state
  const [cursors, setCursors] = useState<(string | null)[]>([null]) // stack of cursors
  const [serverPage, setServerPage] = useState(0)
  const [serverData, setServerData] = useState(data)

  // When source data changes (new fetch), update serverData
  useEffect(() => { setServerData(data) }, [data])

  const fetchPage = useCallback(async (cursor: string | null, direction: 'next' | 'prev') => {
    if (!options?.paginationUrl) return
    try {
      const body: Record<string, unknown> = { pageSize, ...(options?.paginationBody as object) }
      if (cursor) body.cursor = cursor
      const res = await fetch(options.paginationUrl as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) return
      const result = await res.json()
      setServerData(result)
      if (direction === 'next') {
        setServerPage(p => p + 1)
        const nextCursor = result.nextCursor ?? result.next ?? null
        setCursors(prev => [...prev, nextCursor])
      } else {
        setServerPage(p => Math.max(0, p - 1))
        setCursors(prev => prev.slice(0, -1))
      }
    } catch { /* ignore */ }
  }, [options?.paginationUrl, options?.paginationBody, pageSize])

  // Extract rows from paginated or plain data
  const rawRows = useMemo(() => {
    if (paginated && serverData) {
      const d = serverData as PaginatedResponse
      return (d.rows ?? d.data ?? []) as Record<string, unknown>[]
    }
    return null
  }, [paginated, serverData])

  const totalCount = paginated ? ((serverData as PaginatedResponse)?.totalCount ?? (serverData as PaginatedResponse)?.total) : undefined
  const nextCursor = paginated ? ((serverData as PaginatedResponse)?.nextCursor ?? (serverData as PaginatedResponse)?.next) : undefined
  const prevCursor = serverPage > 0 ? cursors[cursors.length - 2] : undefined

  // For non-paginated data, use client-side pagination
  const { columns, rows } = useMemo(() => normalize(rawRows ?? data), [rawRows, data])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [clientPage, setClientPage] = useState(0)

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

  // Client-side pagination (for non-server-paginated data)
  const clientTotalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safeClientPage = Math.min(clientPage, clientTotalPages - 1)
  const displayRows = paginated ? sorted : sorted.slice(safeClientPage * pageSize, (safeClientPage + 1) * pageSize)
  const showClientPagination = !paginated && sorted.length > pageSize

  const toggleSort = (col: string) => {
    if (sortKey === col) setSortAsc(!sortAsc)
    else { setSortKey(col); setSortAsc(true) }
    setClientPage(0)
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
            {displayRows.map((row, i) => (
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

      {/* Server-driven cursor pagination */}
      {paginated && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>{totalCount != null ? `${totalCount} rows` : `Page ${serverPage + 1}`}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevCursor !== undefined && fetchPage(prevCursor ?? null, 'prev')}
              disabled={serverPage === 0}
              className="px-2 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &lsaquo; Prev
            </button>
            <span className="px-2 text-zinc-300">
              {serverPage + 1}
            </span>
            <button
              onClick={() => nextCursor && fetchPage(nextCursor, 'next')}
              disabled={!nextCursor}
              className="px-2 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              Next &rsaquo;
            </button>
          </div>
        </div>
      )}

      {/* Client-side page pagination */}
      {showClientPagination && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>{sorted.length} rows</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setClientPage(0)}
              disabled={safeClientPage === 0}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &laquo;
            </button>
            <button
              onClick={() => setClientPage(p => Math.max(0, p - 1))}
              disabled={safeClientPage === 0}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &lsaquo;
            </button>
            <span className="px-2 text-zinc-300">
              {safeClientPage + 1} / {clientTotalPages}
            </span>
            <button
              onClick={() => setClientPage(p => Math.min(clientTotalPages - 1, p + 1))}
              disabled={safeClientPage >= clientTotalPages - 1}
              className="px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-default"
            >
              &rsaquo;
            </button>
            <button
              onClick={() => setClientPage(clientTotalPages - 1)}
              disabled={safeClientPage >= clientTotalPages - 1}
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
