import { Suspense, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { useDataSource } from '../hooks/useDataSource'
import { getWidget } from '../core/WidgetRegistry'
import { ErrorBoundary } from '../core/ErrorBoundary'
import { useDashboard } from '../core/DashboardContext'
import { resolveSource, interpolate } from '../core/resolveSource'
import { useNow } from '../core/NowContext'
import { evaluateAlert } from '../core/alerts'
import { Skeleton, ErrorState } from './states'
import type { WidgetConfig } from '../types/template'

function formatAge(now: number, ts: number | null): string | null {
  if (!ts) return null
  const seconds = Math.floor((now - ts) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

// Single source of truth for the body's loading/error/ready states.
// Suspense only enters the tree once data is ready, so the lazy-chunk
// fallback never overlaps with the data Skeleton.
function renderBody(args: {
  resolution: { error: string | null }
  loading: boolean
  error: string | null
  data: unknown
  options: Record<string, unknown> | undefined
  component: string
  Component: ComponentType<{ data: unknown; options?: Record<string, unknown> }>
  onRenderError?: (err: Error) => void
}) {
  const { resolution, loading, error, data, options, component, Component, onRenderError } = args
  if (resolution.error) return <ErrorState message={resolution.error} />
  if (loading) return <Skeleton component={component} />
  if (error) return <ErrorState message={error} />
  return (
    <div className="h-full motion-safe:animate-[fadeIn_200ms_ease-out]">
      <ErrorBoundary onError={onRenderError}>
        <Suspense fallback={<Skeleton component={component} />}>
          <Component data={data} options={options} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function ActionMenu({ widget, onRefresh }: { widget: WidgetConfig; onRefresh: () => void }) {
  const { dispatch, fullscreenId, setFullscreenId } = useDashboard()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  // Show Refresh only for live-fetched sources (skip inline + sourceless widgets).
  const src = widget.source
  const isInline = src?.data !== undefined && !src.url && !src.source_id
  const canRefresh = !!src && !isInline
  const canRemove = !!widget.id
  const canFullscreen = !!widget.id && fullscreenId !== widget.id

  if (!canRefresh && !canRemove && !canFullscreen) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-zinc-600 hover:text-zinc-300 px-1.5 text-base leading-none rounded"
        aria-label="Widget actions"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-20 min-w-[140px]">
          {canRefresh && (
            <button
              onClick={() => { onRefresh(); setOpen(false) }}
              className="block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Refresh
            </button>
          )}
          {canFullscreen && (
            <button
              onClick={() => { setFullscreenId(widget.id!); setOpen(false) }}
              className="block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Fullscreen
            </button>
          )}
          {canRemove && (
            <button
              onClick={() => {
                dispatch([{ targetId: widget.id!, remove: true }])
                setOpen(false)
              }}
              className="block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function WidgetShell({ config, contentHeight }: { config: WidgetConfig; contentHeight: number }) {
  const { ctx, backendUrl, refreshIntervalMs, compact, toast, focusedId, setFocusedId, refreshPulse, emit } = useDashboard()
  // Title interpolation is lenient — partial substitution is fine for a
  // human-facing string. Source interpolation is strict (resolveSource).
  const title = useMemo(
    () => (config.title ? interpolate(config.title, ctx) : config.title),
    [config.title, ctx],
  )
  // Memoize the resolved source. Apply the dashboard-level refresh
  // override here so non-streaming widgets respect the global toggle
  // without each widget knowing about it. Strict interpolation can throw
  // InterpolationError on missing ctx — surface it as a widget error.
  const resolution = useMemo(() => {
    if (!config.source) return { source: undefined, error: null }
    try {
      const resolved = resolveSource(config.source, ctx, backendUrl)
      if (refreshIntervalMs && refreshIntervalMs > 0 && !resolved.stream) {
        return { source: { ...resolved, refreshIntervalMs }, error: null }
      }
      return { source: resolved, error: null }
    } catch (e) {
      return { source: undefined, error: e instanceof Error ? e.message : 'Resolution error' }
    }
  }, [config.source, ctx, backendUrl, refreshIntervalMs])
  const source = resolution.source
  const { data, loading, error, lastUpdated, connected, refresh } = useDataSource(source)
  const Component = getWidget(config.component)
  // Reflect the resolved source so a dashboard-level refresh interval
  // override still drives the "last updated" badge.
  const isLive = !!source?.stream || !!(source?.refreshIntervalMs ?? source?.refreshInterval)
  // Subscribe to the dashboard's shared 1Hz tick only when we'd
  // actually render an "X ago" badge. The provider ref-counts so an
  // idle dashboard with no live widgets pays for nothing.
  const now = useNow(isLive && lastUpdated != null)

  // Refresh pulse — Dashboard's keyboard handler bumps refreshPulse with
  // our id when the user presses `r`. We watch the counter and trigger
  // a fresh fetch when it changes. Compares against a ref so a remount
  // doesn't accidentally refetch.
  const lastPulseN = useRef(0)
  useEffect(() => {
    if (!refreshPulse || refreshPulse.id !== config.id) return
    if (refreshPulse.n !== lastPulseN.current) {
      lastPulseN.current = refreshPulse.n
      refresh()
    }
  }, [refreshPulse, config.id, refresh])

  // Edge-triggered alert. Fires once when the predicate transitions
  // false → true; clears when it returns to false. Holds prev state
  // in a ref so re-renders without data updates don't refire.
  const alertWasTriggered = useRef(false)
  useEffect(() => {
    const alert = config.alert
    if (!alert || data == null) {
      alertWasTriggered.current = false
      return
    }
    const triggered = evaluateAlert(data, alert.when)
    if (triggered && !alertWasTriggered.current) {
      const interpolated = interpolate(alert.message, ctx)
      const severity = alert.severity ?? 'warn'
      toast(interpolated, severity)
      emit({ type: 'alert', widgetId: config.id, severity, message: interpolated, predicate: alert.when })
    }
    alertWasTriggered.current = triggered
  }, [data, config.alert, ctx, toast, emit, config.id])

  // Surface data/resolve errors as telemetry on the rising edge only —
  // streaming sources can churn between connected/disconnected and
  // we'd flood the sink if we emitted every render.
  const lastErrorEmitted = useRef<string | null>(null)
  useEffect(() => {
    const msg = resolution.error ?? error
    const source: 'data' | 'resolve' = resolution.error ? 'resolve' : 'data'
    if (msg && msg !== lastErrorEmitted.current) {
      emit({ type: 'widget_error', widgetId: config.id, component: config.component, message: msg, source })
      lastErrorEmitted.current = msg
    } else if (!msg) {
      lastErrorEmitted.current = null
    }
  }, [resolution.error, error, emit, config.id, config.component])

  const isFocused = !!config.id && focusedId === config.id
  // Mouse click to focus mirrors keyboard nav. Cheap visual affordance
  // for users who don't know about j/k yet.
  const onShellClick = config.id ? () => setFocusedId(config.id!) : undefined
  return (
    <div
      onClick={onShellClick}
      className={`bg-zinc-900 border ${isFocused ? 'border-sky-500/60 ring-1 ring-sky-500/40' : 'border-zinc-800'} ${compact ? 'rounded' : 'rounded-lg'} overflow-hidden transition-colors`}
    >
      {title && (
        <div className={`${compact ? 'px-2.5 py-1.5' : 'px-4 py-2.5'} border-b border-zinc-800 flex items-center justify-between`}>
          <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-zinc-100 truncate`}>{title}</h3>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isLive && lastUpdated && (
              <span className="text-[10px] text-zinc-600">{formatAge(now, lastUpdated)}</span>
            )}
            {config.source?.stream && (
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}
                title={connected ? 'Connected' : 'Disconnected'}
              />
            )}
            <ActionMenu widget={config} onRefresh={refresh} />
          </div>
        </div>
      )}
      <div className={compact ? 'p-2.5' : 'p-4'} style={{ height: compact ? Math.round(contentHeight * 0.92) : contentHeight }}>
        {renderBody({
          resolution, loading, error, data,
          options: config.options, component: config.component, Component,
          onRenderError: (err) => emit({
            type: 'widget_error',
            widgetId: config.id,
            component: config.component,
            message: err.message,
            source: 'render',
          }),
        })}
      </div>
    </div>
  )
}
