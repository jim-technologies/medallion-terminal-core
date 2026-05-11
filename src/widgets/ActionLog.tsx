import { useNow } from '../core/NowContext'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'

// Order blotter. Subscribes to the dashboard's in-memory action ring
// (populated by emit({type:'action'}) from any widget) and renders the
// most recent entries newest-first. No data source of its own — purely
// a view onto whatever the dashboard's other widgets are submitting.

// Coarse → tone. Anything terminal-and-not-OK lights up red; non-terminal
// (ACCEPTED / PENDING) is amber; OK is green.
const TONE: Record<string, { dot: string; text: string }> = {
  ACTION_STATUS_OK:        { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  ACTION_STATUS_ACCEPTED:  { dot: 'bg-amber-400',   text: 'text-amber-300' },
  ACTION_STATUS_PENDING:   { dot: 'bg-amber-400',   text: 'text-amber-300' },
  ACTION_STATUS_REJECTED:  { dot: 'bg-red-400',     text: 'text-red-300' },
  ACTION_STATUS_FAILED:    { dot: 'bg-red-400',     text: 'text-red-300' },
  ACTION_STATUS_CANCELLED: { dot: 'bg-zinc-400',    text: 'text-zinc-300' },
}
const FALLBACK_TONE = { dot: 'bg-zinc-500', text: 'text-zinc-400' }

function shortStatus(s: string): string {
  return s.replace(/^ACTION_STATUS_/, '').toLowerCase()
}

function shortClientId(id: string): string {
  if (!id) return ''
  return id.length <= 8 ? id : id.slice(0, 6) + '…'
}

function ago(now: number, then: number): string {
  const s = Math.floor((now - then) / 1000)
  if (s < 5) return 'now'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h`
}

export function ActionLog({ options }: WidgetProps) {
  const { recentActions, clearRecentActions } = useDashboard()
  const limit = (options?.limit as number) || 25
  // Subscribe to the 1Hz tick so the "12s ago" column updates without
  // needing the blotter itself to receive new events.
  const now = useNow(recentActions.length > 0)
  const rows = recentActions.slice(0, limit)

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        No actions yet
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col text-xs font-mono">
      <div className="flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {recentActions.length} action{recentActions.length === 1 ? '' : 's'}
        </span>
        <button
          onClick={clearRecentActions}
          className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded"
          title="Clear log"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        {rows.map((r, i) => {
          const tone = TONE[r.status] ?? FALLBACK_TONE
          return (
            <div
              key={`${r.clientRequestId}-${r.receivedAt}-${i}`}
              className="flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30"
              title={r.message ?? ''}
            >
              <span className="text-zinc-500 shrink-0 w-8 tabular-nums">{ago(now, r.receivedAt)}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tone.dot}`} />
              <span className="text-zinc-200 shrink-0">{r.actionId}</span>
              <span className={`uppercase tracking-wider text-[10px] shrink-0 ${tone.text}`}>
                {shortStatus(r.status)}
              </span>
              {r.message && (
                <span className="text-zinc-400 truncate flex-1 min-w-0">{r.message}</span>
              )}
              <span className="text-zinc-600 text-[10px] shrink-0">{shortClientId(r.clientRequestId)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
