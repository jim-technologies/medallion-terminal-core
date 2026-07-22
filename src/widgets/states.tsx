// Loading and error visuals shared by every widget via WidgetShell.
//
// The empty state stays per-widget — each widget knows what "empty"
// means in its domain (e.g. "No events" vs "No data").

const ARCHETYPE: Record<string, string> = {
  timeseries: 'chart',
  candlestick: 'chart',
  table: 'table',
  text: 'list',
  conversation: 'list',
  events: 'list',
  metric: 'single',
  gauge: 'single',
  distribution: 'donut',
  heatmap: 'grid',
  prompt: 'block',
  orderbook: 'table',
  depth_chart: 'chart',
  paired_grid: 'table',
  catalog: 'list',
  asset_catalog: 'list',
  object_view: 'list',
  code_browser: 'table',
  record_grid: 'table',
  record_board: 'grid',
  record_calendar: 'grid',
  record_form: 'block',
  action_form: 'block',
  trade: 'block',
  ticker: 'block',
  volume_profile: 'list',
  stat_strip: 'block',
  bar_chart: 'chart',
  scatter: 'chart',
  clock: 'block',
  treemap: 'grid',
  image: 'block',
  iframe: 'block',
  histogram: 'chart',
  section: 'block',
  area_chart: 'chart',
  slider: 'block',
  select: 'block',
  boxplot: 'chart',
  radar: 'chart',
  dag: 'grid',
  geo_map: 'grid',
  media_gallery: 'grid',
  multi_select: 'block',
  json: 'list',
  sparkline: 'chart',
  action_log: 'list',
  alert_log: 'list',
  tape: 'list',
  file_browser: 'table',
}

export function Skeleton({ component }: { component?: string }) {
  switch (component ? ARCHETYPE[component] : 'block') {
    case 'chart':  return <ChartSkeleton />
    case 'table':  return <TableSkeleton />
    case 'list':   return <ListSkeleton />
    case 'single': return <SingleSkeleton />
    case 'donut':  return <DonutSkeleton />
    case 'grid':   return <GridSkeleton />
    default:       return <BlockSkeleton />
  }
}

// Shared empty-state placeholder. Each widget owns its message ("No data",
// "No events", "No URL configured", etc.); this just unifies the markup
// and styling so all 30+ widgets stay visually consistent. A faint
// glyph above the text reads as "nothing here yet" without competing
// with real content.
export function Empty({ children, padded }: { children: React.ReactNode; padded?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full gap-1.5 text-zinc-500 text-sm${padded ? ' px-4 text-center' : ''}`}
    >
      <span aria-hidden="true" className="text-zinc-500 text-xs uppercase tracking-[0.2em] leading-none">·  ·  ·</span>
      {children}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 px-2">
      <div className="flex items-center gap-2 text-sm max-w-full">
        <span className="text-red-400 shrink-0">⚠</span>
        <span className="text-zinc-400 font-mono text-xs truncate">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// --- archetypes ---

const HEIGHTS = [40, 60, 35, 75, 55, 85, 50, 70, 90, 45, 65, 80, 55, 95, 60, 50, 75, 65, 80, 70]

function ChartSkeleton() {
  return (
    <div className="h-full flex items-end gap-1">
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-zinc-800 rounded-sm animate-pulse"
          style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  )
}

function TableSkeleton() {
  const rows = 5
  const cols = [80, 64, 96]
  return (
    <div className="h-full flex flex-col gap-2.5">
      <div className="flex gap-4 pb-2 border-b border-zinc-800">
        {cols.map((w, i) => (
          <div key={i} className="h-3 bg-zinc-800 rounded animate-pulse" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {cols.map((w, c) => (
            <div
              key={c}
              className="h-3 bg-zinc-800 rounded animate-pulse"
              style={{ width: w, animationDelay: `${(r * 3 + c) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="h-full flex flex-col gap-3.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start pt-1">
          <div className="w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" />
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <div
              className="h-2.5 bg-zinc-800 rounded animate-pulse"
              style={{ width: `${55 + ((i * 11) % 30)}%`, animationDelay: `${i * 80}ms` }}
            />
            <div
              className="h-2 bg-zinc-800/60 rounded animate-pulse"
              style={{ width: `${35 + ((i * 7) % 25)}%`, animationDelay: `${i * 80 + 40}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SingleSkeleton() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <div className="w-32 h-7 bg-zinc-800 rounded animate-pulse" />
      <div className="w-20 h-3 bg-zinc-800/60 rounded animate-pulse" style={{ animationDelay: '120ms' }} />
    </div>
  )
}

function DonutSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center min-h-0">
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[160px] max-h-[160px] animate-pulse">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--mtc-panel)" strokeWidth="14" />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" />
            <div
              className="flex-1 h-2 bg-zinc-800 rounded animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function GridSkeleton() {
  const cells = 40
  return (
    <div
      className="h-full grid gap-1"
      style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(5, 1fr)' }}
    >
      {Array.from({ length: cells }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-800 rounded-sm animate-pulse"
          style={{ animationDelay: `${i * 25}ms` }}
        />
      ))}
    </div>
  )
}

function BlockSkeleton() {
  return <div className="h-full w-full bg-zinc-800 rounded animate-pulse" />
}
