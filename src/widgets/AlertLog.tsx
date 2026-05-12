import { useNow } from '../core/NowContext'
import { useDashboard } from '../core/DashboardContext'
import { Empty } from './states'
import type { WidgetProps } from '../types/template'

// Live alert feed. Subscribes to the dashboard's alert ring (populated
// when any widget's predicate fires via emit({type:'alert'})). Useful
// for risk dashboards or any view that needs a record of what tripped
// recently, not just the toast.

const TONE: Record<string, { dot: string; text: string }> = {
  error: { dot: 'bg-red-400',     text: 'text-red-300' },
  warn:  { dot: 'bg-amber-400',   text: 'text-amber-300' },
  ok:    { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  info:  { dot: 'bg-sky-400',     text: 'text-sky-300' },
}

function ago(now: number, then: number): string {
  const s = Math.floor((now - then) / 1000)
  if (s < 5) return 'now'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h`
}

export function AlertLog({ options }: WidgetProps) {
  const { recentAlerts, clearRecentAlerts } = useDashboard()
  const limit = (options?.limit as number) || 50
  const now = useNow(recentAlerts.length > 0)
  const rows = recentAlerts.slice(0, limit)

  if (rows.length === 0) {
    return <Empty>No alerts</Empty>
  }

  return (
    <div className="h-full flex flex-col text-xs font-mono">
      <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {recentAlerts.length} alert{recentAlerts.length === 1 ? '' : 's'}
        </span>
        <button
          onClick={clearRecentAlerts}
          className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded"
          title="Clear log"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        {rows.map((r, i) => {
          const tone = TONE[r.severity] ?? TONE.warn
          return (
            <div
              key={`${r.receivedAt}-${i}`}
              className="flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30"
              title={r.predicate}
            >
              <span className="text-zinc-500 shrink-0 w-8 tabular-nums">{ago(now, r.receivedAt)}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tone.dot}`} />
              <span className={`uppercase tracking-wider text-[10px] shrink-0 ${tone.text}`}>
                {r.severity}
              </span>
              <span className="text-zinc-200 truncate flex-1 min-w-0">{r.message}</span>
              {r.widgetId && (
                <span className="text-zinc-600 text-[10px] shrink-0">{r.widgetId}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
