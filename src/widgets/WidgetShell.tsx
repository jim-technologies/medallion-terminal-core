import { useState, useMemo } from 'react'
import { useDataSource } from '../hooks/useDataSource'
import { getWidget } from '../core/WidgetRegistry'
import { ErrorBoundary } from '../core/ErrorBoundary'
import { Filters, applyFilters, type FilterValues } from './Filters'
import type { WidgetConfig } from '../types/template'

function formatAge(ts: number | null): string | null {
  if (!ts) return null
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

export function WidgetShell({ config, contentHeight }: { config: WidgetConfig; contentHeight: number }) {
  const { data, loading, error, lastUpdated, connected } = useDataSource(config.source)
  const Component = getWidget(config.component)

  const isStreaming = config.source?.stream
  const isPolling = !isStreaming && config.source?.refreshInterval
  const hasFilters = config.filters && config.filters.length > 0

  const [filterValues, setFilterValues] = useState<FilterValues>({})

  const filteredData = useMemo(() => {
    if (!hasFilters || !data) return data
    return applyFilters(data, config.filters!, filterValues)
  }, [data, hasFilters, config.filters, filterValues])

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      {config.title && (
        <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-100 truncate">{config.title}</h3>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {(isStreaming || isPolling) && lastUpdated && (
              <span className="text-[10px] text-zinc-600">{formatAge(lastUpdated)}</span>
            )}
            {isStreaming && (
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  connected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                }`}
                title={connected ? 'Connected' : 'Disconnected'}
              />
            )}
          </div>
        </div>
      )}
      {hasFilters && !loading && data != null && (
        <div className="px-4 pt-3">
          <Filters filters={config.filters!} data={data} onChange={setFilterValues} />
        </div>
      )}
      <div className="p-4" style={{ height: contentHeight }}>
        {loading && (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            Loading...
          </div>
        )}
        {!loading && error && (
          <div className="flex items-center justify-center h-full text-red-400 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && (
          <ErrorBoundary>
            <Component data={filteredData} options={config.options} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}
