import { useEffect, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { Empty } from './states'

// Mirrors the Source / SourceParam messages from terminal.proto.
// Optional everywhere — backends are free to send partial entries.
interface SourceParam {
  key: string
  description?: string
  required?: boolean
  default_value?: string
  enum_values?: string[]
  type?: string
  repeated?: boolean
}

interface Source {
  id: string
  name?: string
  description?: string
  shape?: string
  params?: SourceParam[]
  streamable?: boolean
  tags?: string[]
}

const SERVICE = 'medallion.terminal.v1.TerminalService'

const SHAPE_LABEL: Record<string, string> = {
  SHAPE_TIMESERIES:   'timeseries',
  SHAPE_CANDLES:      'candles',
  SHAPE_TABLE:        'table',
  SHAPE_METRIC:       'metric',
  SHAPE_GAUGE:        'gauge',
  SHAPE_HEATMAP:      'heatmap',
  SHAPE_EVENTS:       'events',
  SHAPE_DISTRIBUTION: 'distribution',
  SHAPE_TEXT:         'text',
  SHAPE_ORDERBOOK:    'orderbook',
  SHAPE_PAIRED_GRID:  'paired_grid',
  SHAPE_EMBED:        'embed',
  SHAPE_ASSET_CATALOG:'asset_catalog',
  SHAPE_OBJECT:       'object',
  SHAPE_GRAPH:        'graph',
  SHAPE_REPOSITORY:   'repository',
  SHAPE_RECORD_SET:   'record_set',
  SHAPE_GEO:          'geo',
}

export function Catalog() {
  const { backendUrl } = useDashboard()
  const [sources, setSources] = useState<Source[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (backendUrl === undefined) {
      setLoading(false)
      setSources(null)
      return
    }
    let disposed = false
    setLoading(true)
    setError(null)
    const ctrl = new AbortController()
    fetch(`${backendUrl.replace(/\/$/, '')}/${SERVICE}/ListSources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: ctrl.signal,
    })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((res: { sources?: Source[] }) => {
        if (!disposed) setSources(res.sources ?? [])
      })
      .catch(err => {
        if (!disposed && err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!disposed) setLoading(false)
      })
    return () => {
      disposed = true
      ctrl.abort()
    }
  }, [backendUrl])

  if (backendUrl === undefined) return <Empty padded>No backendUrl configured on Dashboard</Empty>
  if (loading) return <Empty padded>Loading catalog…</Empty>
  if (error) return <Empty padded>Failed to load: {error}</Empty>
  if (!sources || sources.length === 0) return <Empty padded>No sources registered</Empty>

  const grouped: Record<string, Source[]> = {}
  for (const s of sources) {
    const shape = (s.shape && SHAPE_LABEL[s.shape]) || 'other'
    if (!grouped[shape]) grouped[shape] = []
    grouped[shape].push(s)
  }

  return (
    <div className="h-full overflow-auto pr-1">
      {Object.entries(grouped).map(([shape, list]) => (
        <div key={shape} className="mb-4 last:mb-0">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">
            {shape} <span className="text-zinc-700">— {list.length}</span>
          </div>
          {list.map(s => (
            <div key={s.id} className="py-2 border-b border-zinc-800/60 last:border-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm text-zinc-100 font-mono">{s.id}</span>
                {s.streamable && (
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    live
                  </span>
                )}
                {s.name && <span className="text-xs text-zinc-400">— {s.name}</span>}
              </div>
              {s.description && <div className="text-xs text-zinc-500 mt-0.5">{s.description}</div>}
              {s.params && s.params.length > 0 && (
                <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                  params:{' '}
                  {s.params.map(p => (p.required ? `${p.key}*` : p.key)).join(', ')}
                </div>
              )}
              {s.tags && s.tags.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {s.tags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
