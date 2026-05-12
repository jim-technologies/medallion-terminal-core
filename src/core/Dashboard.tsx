import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { Template, WidgetConfig } from '../types/template'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WidgetShell } from '../widgets/WidgetShell'
import { DashboardContext, useDashboard, type DispatchOptions, type WidgetAction, type Severity, type DashboardEvent, type ActionLogEntry, type AlertLogEntry, type WidgetHealth } from './DashboardContext'
import { HoverProvider } from './HoverContext'
import { NowProvider } from './NowContext'
import { applyActions } from './applyActions'
import { readCtxFromUrl, writeCtxToUrl } from './urlState'
import { interpolate } from './resolveSource'
import { CommandPalette, type PaletteSuggest } from './CommandPalette'
import { ShortcutsOverlay } from './ShortcutsOverlay'
import { Toaster, type Toast } from './Toaster'
import { validateTemplate, type ValidationIssue } from './validateTemplate'
import { useNow } from './NowContext'

const DEFAULT_HEIGHTS: Record<string, number> = {
  metric: 120,
  timeseries: 300,
  candlestick: 400,
  table: 350,
  text: 350,
  prompt: 60,
  gauge: 220,
  distribution: 280,
  heatmap: 320,
  events: 320,
  catalog: 480,
  orderbook: 380,
  paired_grid: 420,
  trade: 280,
  ticker: 56,
  volume_profile: 380,
  stat_strip: 90,
  bar_chart: 320,
  scatter: 360,
  clock: 100,
  treemap: 380,
  image: 320,
  iframe: 360,
  histogram: 280,
  section: 24,
  area_chart: 280,
  slider: 80,
  select: 80,
  boxplot: 360,
  radar: 380,
  dag: 420,
  multi_select: 100,
  json: 360,
  sparkline: 60,
  action_log: 320,
  alert_log: 320,
  tape: 320,
}

const RANGES = ['1d', '5d', '1m', '3m', '1y', 'max']

// Cap the in-memory action blotter. Large enough for a trading session,
// small enough that an action storm can't blow up memory. Newest first;
// older entries fall off the tail.
const RECENT_ACTIONS_CAP = 200
const RECENT_ALERTS_CAP = 200

function RangeSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5">
      {RANGES.map(r => {
        const active = value.toLowerCase() === r
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${
              active ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {r}
          </button>
        )
      })}
    </div>
  )
}

const REFRESH_OPTIONS: Array<{ label: string; ms: number | null }> = [
  { label: 'Off', ms: null },
  { label: '5s',  ms: 5000 },
  { label: '30s', ms: 30000 },
  { label: '1m',  ms: 60000 },
  { label: '5m',  ms: 300000 },
]

function RefreshPicker({ value, onChange }: { value: number | null; onChange: (ms: number | null) => void }) {
  return (
    <div className="flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5">
      {REFRESH_OPTIONS.map(opt => {
        const active = value === opt.ms
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.ms)}
            className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${
              active ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={opt.ms ? `Refresh every ${opt.label}` : 'No auto-refresh'}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function OpenPaletteHint() {
  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)
  const trigger = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: isMac, ctrlKey: !isMac, bubbles: true }),
    )
  }
  return (
    <button
      onClick={trigger}
      className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded font-mono"
      title="Open command palette"
    >
      {isMac ? '⌘' : 'Ctrl'} K
    </button>
  )
}

function formatClock(ms: number): string {
  const d = new Date(ms)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

function formatAgo(now: number, then: number): string {
  const s = Math.floor((now - then) / 1000)
  if (s < 5) return 'now'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h`
}

// Bottom status bar — runs underneath the grid as a thin terminal-style
// footer. Reads only from context (no props) so it can be hidden without
// passing it down. Picks complementary info to the top toolbar: the
// toolbar shows current ctx + health pill + prefs; the footer shows
// the latest action and a live clock so the operator always sees both
// "what just happened" and "what time is it".
function StatusBar() {
  const { recentActions, widgetHealth } = useDashboard()
  // The clock needs a 1Hz tick; useNow ref-counts so this is the only
  // permanent subscriber when no live widgets are present.
  const now = useNow(true)
  const latest = recentActions[0]
  const entries = Object.values(widgetHealth)
  const streams = entries.filter(e => e.streaming)
  const liveStreams = streams.filter(e => e.connected && !e.error).length
  const errored = entries.filter(e => e.error).length
  const staleCount = entries.filter(e => e.stale).length
  const latestTone =
    latest?.status?.endsWith('_OK') ? 'text-emerald-400/80' :
    latest?.status?.endsWith('_PENDING') || latest?.status?.endsWith('_ACCEPTED') ? 'text-amber-400/80' :
    latest && (latest.status?.endsWith('_REJECTED') || latest.status?.endsWith('_FAILED') || latest.status?.endsWith('_CANCELLED')) ? 'text-red-400/80' :
    'text-zinc-400'

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/70 px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0">
      <div className="flex-1 min-w-0 truncate">
        {latest ? (
          <span className="flex items-center gap-2">
            <span className="tabular-nums w-7 shrink-0">{formatAgo(now, latest.receivedAt)}</span>
            <span className="text-zinc-300 shrink-0">{latest.actionId}</span>
            <span className={`uppercase tracking-wider shrink-0 ${latestTone}`}>
              {latest.status.replace(/^ACTION_STATUS_/, '').toLowerCase()}
            </span>
            {latest.message && (
              <span className="truncate text-zinc-400">{latest.message}</span>
            )}
          </span>
        ) : (
          <span className="text-zinc-600">idle</span>
        )}
      </div>
      {streams.length > 0 && (
        <span
          className={liveStreams === streams.length ? 'text-emerald-400/80' : 'text-amber-400/80'}
          title={`${liveStreams} of ${streams.length} streams connected`}
        >
          <span className="tabular-nums">{liveStreams}/{streams.length}</span> <span className="opacity-60">↑</span>
        </span>
      )}
      {staleCount > 0 && (
        <span className="text-amber-400/80 tabular-nums" title={`${staleCount} widget(s) without recent updates`}>
          {staleCount} stale
        </span>
      )}
      {errored > 0 && (
        <span className="text-red-400 tabular-nums">{errored} err</span>
      )}
      <span className="tabular-nums text-zinc-300">{formatClock(now)}</span>
    </div>
  )
}

function HealthPill({ health }: { health: Record<string, WidgetHealth> }) {
  const entries = Object.values(health)
  if (entries.length === 0) return null
  const streams = entries.filter(e => e.streaming)
  const liveStreams = streams.filter(e => e.connected && !e.error).length
  const errored = entries.filter(e => e.error)
  if (streams.length === 0 && errored.length === 0) return null
  const errorTitles = errored.map(e => e.title).join('\n')
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider bg-zinc-900 border border-zinc-800 rounded">
      {streams.length > 0 && (
        <span
          className={liveStreams === streams.length ? 'text-emerald-400' : 'text-amber-400'}
          title={`${liveStreams} of ${streams.length} streams connected`}
        >
          <span className="tabular-nums">{liveStreams}/{streams.length}</span>
          <span className="ml-0.5">↑</span>
        </span>
      )}
      {errored.length > 0 && (
        <span className="text-red-400 tabular-nums" title={errorTitles}>
          {errored.length} err{errored.length === 1 ? '' : 's'}
        </span>
      )}
    </div>
  )
}

function ReloadAllButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded"
      title="Refresh every widget"
    >
      Reload
    </button>
  )
}

function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded"
      title={enabled ? 'Mute alert sounds' : 'Enable alert sounds (warn/error)'}
    >
      {enabled ? '\u{1F50A} On' : '\u{1F507} Off'}
    </button>
  )
}

function DensityToggle({ compact, onToggle }: { compact: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded"
      title={compact ? 'Switch to comfortable density' : 'Switch to compact density'}
    >
      {compact ? 'Cozy' : 'Compact'}
    </button>
  )
}

function SnapshotButton({ onCopied }: { onCopied: () => void }) {
  const copy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(window.location.href)
      onCopied()
    } catch {
      // Clipboard blocked — silently no-op. Better than throwing on a
      // permission denial in a hostile iframe.
    }
  }
  return (
    <button
      onClick={copy}
      className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded"
      title="Copy current dashboard URL"
    >
      Snapshot
    </button>
  )
}

export function Dashboard({
  template, backendUrl, onEvent, onCtxChange, paletteSuggest,
}: {
  template: Template
  backendUrl?: string
  // Optional telemetry sink. Receives alerts, widget errors, and
  // action submissions. Keep handler cheap — it runs on every event.
  onEvent?: (event: DashboardEvent) => void
  // Fires when the active ctx changes (palette command, row click,
  // template shortcut, URL load). Use for analytics or to mirror ctx
  // into your app's router.
  onCtxChange?: (ctx: Record<string, string>) => void
  // Optional async source of palette suggestions. Wire to your symbol
  // search / source catalog / backend ListSources. Each suggestion
  // carries a `ctx` map that's merged into the active context when
  // the user clicks it.
  paletteSuggest?: PaletteSuggest
}) {
  const breakpoint = useBreakpoint()
  const columns = template.columns || 12
  const [widgets, setWidgets] = useState<WidgetConfig[]>(template.widgets)
  // Validation runs once per template identity. Errors are loud and
  // persistent; warnings are dismissible. Authors get a banner on bad
  // templates instead of a blank widget tile and a console error.
  const issues = useMemo(() => validateTemplate(template), [template])
  const hasErrors = useMemo(() => issues.some(i => i.severity === 'error'), [issues])
  const [bannerDismissed, setBannerDismissed] = useState(false)
  // ctx initial state: template defaults overlaid by URL params.
  // URL wins so shared bookmarks restore exactly the view the sender saw.
  const [ctx, setCtxState] = useState<Record<string, string>>(() => {
    const base = template.context?.values ?? {}
    if (typeof window === 'undefined') return base
    return { ...base, ...readCtxFromUrl(window.location.search) }
  })
  // Dashboard-level prefs persist to localStorage so they survive reloads.
  // ctx already lives in the URL (shareable); these knobs are personal.
  const [refreshIntervalMs, setRefreshIntervalMs] = useState<number | null>(() => readPref('refreshIntervalMs', null))
  const [compact, setCompact] = useState<boolean>(() => readPref('compact', false))
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => readPref('soundEnabled', false))
  useEffect(() => { writePref('refreshIntervalMs', refreshIntervalMs) }, [refreshIntervalMs])
  useEffect(() => { writePref('compact', compact) }, [compact])
  useEffect(() => { writePref('soundEnabled', soundEnabled) }, [soundEnabled])

  const [fullscreenId, setFullscreenId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [refreshPulse, setRefreshPulse] = useState<{ id: string; n: number } | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  // Monotonic — every bump increments. Widgets compare against their
  // last-seen `n` to decide whether to refetch, so the counter must
  // never reset (otherwise an `*` pulse after individual pulses could
  // silently fall below a widget's last-seen counter).
  const requestRefresh = useCallback((id: string) => {
    setRefreshPulse(prev => ({ id, n: (prev?.n ?? 0) + 1 }))
  }, [])

  // Hold the latest onEvent in a ref so widgets can emit through a
  // stable function — re-renders from a parent that swaps the handler
  // identity don't tear down WidgetShell's effects.
  const onEventRef = useRef(onEvent)
  useEffect(() => { onEventRef.current = onEvent }, [onEvent])

  // Ring buffer of recent action events for the action_log widget.
  // Capped so a noisy backend can't grow state without bound.
  const [recentActions, setRecentActions] = useState<ActionLogEntry[]>([])
  const clearRecentActions = useCallback(() => setRecentActions([]), [])
  // Parallel ring for alerts → drives the alert_log widget.
  const [recentAlerts, setRecentAlerts] = useState<AlertLogEntry[]>([])
  const clearRecentAlerts = useCallback(() => setRecentAlerts([]), [])

  // Aggregated widget health. Each WidgetShell reports its streaming
  // status, connection, and last error here. Pass `null` to unregister
  // on unmount. Setter dedupes identical state so unchanged ticks don't
  // re-render the toolbar.
  const [widgetHealth, setWidgetHealth] = useState<Record<string, WidgetHealth>>({})
  const reportWidgetHealth = useCallback((id: string, state: WidgetHealth | null) => {
    setWidgetHealth(prev => {
      const existing = prev[id]
      if (state === null) {
        if (!existing) return prev
        const next = { ...prev }
        delete next[id]
        return next
      }
      if (existing &&
          existing.streaming === state.streaming &&
          existing.connected === state.connected &&
          existing.error === state.error &&
          existing.title === state.title &&
          existing.stale === state.stale) {
        return prev
      }
      return { ...prev, [id]: state }
    })
  }, [])

  const emit = useCallback((event: DashboardEvent) => {
    onEventRef.current?.(event)
    if (event.type === 'action') {
      setRecentActions(prev => {
        const next: ActionLogEntry = {
          receivedAt: Date.now(),
          actionId: event.actionId,
          clientRequestId: event.clientRequestId,
          status: event.status,
          message: event.message,
          terminal: event.terminal,
        }
        return [next, ...prev].slice(0, RECENT_ACTIONS_CAP)
      })
    } else if (event.type === 'alert') {
      setRecentAlerts(prev => {
        const next: AlertLogEntry = {
          receivedAt: Date.now(),
          widgetId: event.widgetId,
          severity: event.severity,
          message: event.message,
          predicate: event.predicate,
        }
        return [next, ...prev].slice(0, RECENT_ALERTS_CAP)
      })
    }
  }, [])

  const toast = useCallback((message: string, severity: Severity = 'info') => {
    toastIdRef.current += 1
    const id = toastIdRef.current
    setToasts(prev => [...prev, { id, message, severity }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Identity guard — same value coming through (e.g. clicking the
  // currently-selected watchlist row) keeps the same state object so
  // downstream widgets don't re-fetch and the URL effect doesn't fire.
  const setCtx = useCallback((key: string, value: string) => {
    setCtxState(prev => (prev[key] === value ? prev : { ...prev, [key]: value }))
  }, [])

  // Mirror ctx into the URL on every change (replaceState — don't pollute history).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const qs = writeCtxToUrl(window.location.search, ctx)
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
    window.history.replaceState(null, '', url)
  }, [ctx])

  // Fan out ctx changes to the consumer. Held in a ref so swapping
  // callback identity doesn't retrigger the effect on every ctx tick.
  const onCtxChangeRef = useRef(onCtxChange)
  useEffect(() => { onCtxChangeRef.current = onCtxChange }, [onCtxChange])
  useEffect(() => { onCtxChangeRef.current?.(ctx) }, [ctx])

  const dispatch = useCallback((actions: WidgetAction[], options?: DispatchOptions) => {
    setWidgets(prev => applyActions(prev, actions, options))
  }, [])

  const effectiveSpan = (span: number) => {
    if (breakpoint === 'mobile') return columns
    if (breakpoint === 'tablet') return Math.min(span, Math.floor(columns / 2))
    return Math.min(span, columns)
  }

  // Stable context value — re-creates only when an actual dependency
  // changes, so consumers don't re-render on unrelated parent updates.
  const contextValue = useMemo(
    () => ({
      dispatch,
      ctx,
      setCtx,
      backendUrl,
      widgets,
      refreshIntervalMs: refreshIntervalMs ?? undefined,
      toast,
      compact,
      fullscreenId,
      setFullscreenId,
      focusedId,
      setFocusedId,
      refreshPulse,
      requestRefresh,
      emit,
      recentActions,
      clearRecentActions,
      recentAlerts,
      clearRecentAlerts,
      soundEnabled,
      widgetHealth,
      reportWidgetHealth,
    }),
    [dispatch, ctx, setCtx, backendUrl, widgets, refreshIntervalMs, toast, compact,
     fullscreenId, focusedId, refreshPulse, requestRefresh, emit,
     recentActions, clearRecentActions, recentAlerts, clearRecentAlerts,
     soundEnabled, widgetHealth, reportWidgetHealth],
  )

  // Esc closes fullscreen.
  useEffect(() => {
    if (!fullscreenId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFullscreenId(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [fullscreenId])

  // Keyboard widget navigation: j/k (or ↓/↑) cycle focus across widgets
  // that have an `id`; `f` fullscreens the focused widget; `r`
  // refreshes it; Esc clears focus. Skip when the user is typing into
  // an input/textarea/contenteditable. Modifier keys are ignored so
  // ⌘K still belongs to the palette. Per-template shortcuts (e.g.
  // `1 → ctx.symbol=BTC`) take precedence over the built-in nav keys
  // so authors can override `j`/`k` if they really want to.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement | null)?.tagName
      const inEditable = tag === 'INPUT' || tag === 'TEXTAREA' ||
        (e.target as HTMLElement | null)?.isContentEditable
      if (inEditable) return

      // Template-defined shortcut first.
      const shortcut = template.shortcuts?.find(s => s.key === e.key)
      if (shortcut) {
        e.preventDefault()
        for (const [k, v] of Object.entries(shortcut.ctx)) setCtx(k, v)
        return
      }

      const ids = widgets.map(w => w.id).filter((id): id is string => !!id)
      if (ids.length === 0) return

      const cycle = (delta: number) => {
        const idx = focusedId ? ids.indexOf(focusedId) : -1
        const next = ids[(idx + delta + ids.length) % ids.length]
        setFocusedId(next)
      }

      switch (e.key) {
        case 'j': case 'ArrowDown': e.preventDefault(); cycle(1); break
        case 'k': case 'ArrowUp':   e.preventDefault(); cycle(-1); break
        case 'f':
          if (focusedId) { e.preventDefault(); setFullscreenId(focusedId) }
          break
        case 'r':
          if (focusedId) { e.preventDefault(); requestRefresh(focusedId) }
          break
        case 'Escape':
          if (focusedId) { setFocusedId(null) }
          break
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [widgets, focusedId, requestRefresh, template.shortcuts, setCtx])

  const fullscreenWidget = fullscreenId ? widgets.find(w => w.id === fullscreenId) : null

  return (
    <DashboardContext.Provider value={contextValue}>
     <NowProvider>
     <HoverProvider>
      <CommandPalette suggest={paletteSuggest} />
      <ShortcutsOverlay templateShortcuts={template.shortcuts} />
      <Toaster toasts={toasts} dismiss={dismissToast} />
      {issues.length > 0 && (!bannerDismissed || hasErrors) && (
        <ValidationBanner
          issues={issues}
          dismissible={!hasErrors}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}
      <div className="min-h-full bg-zinc-950 flex flex-col">
       <div className="flex-1 p-3 md:p-5">
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          {template.title && (
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight mr-1">
              {interpolate(template.title, ctx)}
            </h1>
          )}
          {Object.entries(ctx).map(([k, v]) => {
            if (k === 'range') {
              return <RangeSelector key={k} value={v} onChange={val => setCtx(k, val)} />
            }
            return (
              <div
                key={k}
                className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs"
              >
                <span className="text-zinc-500 uppercase tracking-wider mr-1">{k}</span>
                <span className="text-zinc-100 font-mono">{v}</span>
              </div>
            )
          })}
          <div className="ml-auto flex items-center gap-2">
            <HealthPill health={widgetHealth} />
            <RefreshPicker value={refreshIntervalMs} onChange={setRefreshIntervalMs} />
            <ReloadAllButton onClick={() => requestRefresh('*')} />
            <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(s => !s)} />
            <DensityToggle compact={compact} onToggle={() => setCompact(c => !c)} />
            <SnapshotButton onCopied={() => toast('URL copied', 'ok')} />
            <OpenPaletteHint />
          </div>
        </div>
        <div
          className="grid gap-3 md:gap-4 items-start"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {widgets.map((widget, i) => (
            <div
              key={widget.id || i}
              style={{
                gridColumn: `span ${effectiveSpan(widget.span || 6)}`,
              }}
            >
              <WidgetShell
                config={widget}
                contentHeight={widget.height || DEFAULT_HEIGHTS[widget.component] || 280}
              />
            </div>
          ))}
        </div>
       </div>
       <StatusBar />
      </div>
      {fullscreenWidget && (
        <FullscreenOverlay widget={fullscreenWidget} onClose={() => setFullscreenId(null)} />
      )}
     </HoverProvider>
     </NowProvider>
    </DashboardContext.Provider>
  )
}

// Authoring-time banner for template validation issues. Errors stay
// pinned; warnings can be dismissed for the session. Kept inline in the
// Dashboard file because it's purely chrome around <Dashboard> and has
// no use outside it.
function ValidationBanner({
  issues, dismissible, onDismiss,
}: { issues: ValidationIssue[]; dismissible: boolean; onDismiss: () => void }) {
  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warn')
  const tone = errors.length > 0
    ? 'bg-red-500/10 border-red-500/40 text-red-200'
    : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
  const label = errors.length > 0 ? 'Template errors' : 'Template warnings'
  return (
    <div className={`border-b ${tone} px-3 md:px-5 py-2 text-xs flex items-start gap-3`}>
      <div className="flex-1 min-w-0">
        <div className="font-medium uppercase tracking-wider text-[10px] mb-1">
          {label} ({errors.length + warnings.length})
        </div>
        <ul className="space-y-0.5">
          {[...errors, ...warnings].slice(0, 8).map((i, idx) => (
            <li key={idx} className="font-mono text-[11px] leading-tight">
              <span className="opacity-60">{i.path || '<root>'}</span>
              <span className="mx-1.5 opacity-40">·</span>
              <span>{i.message}</span>
            </li>
          ))}
          {issues.length > 8 && (
            <li className="opacity-60 text-[10px]">… and {issues.length - 8} more</li>
          )}
        </ul>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}

function FullscreenOverlay({ widget, onClose }: { widget: WidgetConfig; onClose: () => void }) {
  // Use ~85vh of viewport for the content area; rest goes to chrome.
  const contentHeight = typeof window !== 'undefined' ? Math.floor(window.innerHeight * 0.82) : 600
  return (
    <div
      className="fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]"
      onClick={onClose}
    >
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          Fullscreen — esc to close
        </span>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs rounded border border-zinc-800"
        >
          Close
        </button>
      </div>
      <div onClick={e => e.stopPropagation()} className="flex-1 min-h-0">
        <WidgetShell config={widget} contentHeight={contentHeight} />
      </div>
    </div>
  )
}

// localStorage helpers — namespaced and JSON-encoded so future prefs
// can be added without churn. Quietly no-op if storage is unavailable.
const STORAGE_PREFIX = 'medallion-terminal:'

function readPref<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function writePref(key: string, value: unknown): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    // Quota or denied — leave silent. Reload defaults are fine.
  }
}
