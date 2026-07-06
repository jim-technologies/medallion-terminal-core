import { Suspense, useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { useDataSource } from '../hooks/useDataSource'
import { getWidget } from '../core/WidgetRegistry'
import { ErrorBoundary } from '../core/ErrorBoundary'
import { useDashboard } from '../core/DashboardContext'
import { resolveSource, interpolate } from '../core/resolveSource'
import { useNow } from '../core/NowContext'
import { evaluateAlert } from '../core/alerts'
import { playAlertBeep } from '../core/sound'
import { Skeleton, ErrorState } from './states'
import { downloadView, viewRowCount, type ExportFormat } from '../export/exportView'
import { EXPORT_FORMATS } from '../export/serializers'
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
  widgetId?: string
  Component: ComponentType<{ data: unknown; options?: Record<string, unknown>; widgetId?: string }>
  onRenderError?: (err: Error) => void
  onRetry?: () => void
}) {
  const { resolution, loading, error, data, options, component, widgetId, Component, onRenderError, onRetry } = args
  // Retry is only meaningful when the source is fetchable — ctx-
  // resolution errors aren't fixed by re-fetching, but a stream/poll
  // failure might be transient.
  if (resolution.error) return <ErrorState message={resolution.error} />
  if (loading) return <Skeleton component={component} />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  return (
    <div className="h-full motion-safe:animate-[fadeIn_200ms_ease-out]">
      <ErrorBoundary onError={onRenderError}>
        <Suspense fallback={<Skeleton component={component} />}>
          <Component data={data} options={options} widgetId={widgetId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

function ActionMenu({
  widget, data, onRefresh, onCopy, onToast,
}: {
  widget: WidgetConfig
  // The widget's resolved data — exported when the user picks a format.
  data: unknown
  onRefresh: () => void
  // Returns true if data was copied; false if there's nothing to copy
  // or the clipboard refused. Toast is fired by the parent based on
  // the result so it can interpolate the widget title.
  onCopy: () => Promise<boolean>
  // Fire a toast from inside the menu (export result feedback).
  onToast: (msg: string, severity: 'ok' | 'warn' | 'error') => void
}) {
  const { dispatch, fullscreenId, setFullscreenId } = useDashboard()
  const [open, setOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setExportOpen(false)
      }
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
  const canCopy = true // every widget can attempt copy; onCopy guards no-data
  // Export is offered whenever the widget's data flattens to >=1 row.
  // Cheap to compute; gates the menu item so empty/non-tabular widgets
  // (a bare metric tile renders fine, but e.g. an image won't) don't
  // show a dead button.
  const exportRows = data == null ? 0 : viewRowCount({ data, component: widget.component })
  const canExport = exportRows > 0

  const runExport = async (format: ExportFormat) => {
    setExporting(true)
    try {
      const ok = await downloadView(
        { data, component: widget.component },
        format,
        widget.title ?? widget.id ?? widget.component,
      )
      onToast(
        ok ? `Exported ${exportRows.toLocaleString()} rows as ${format.toUpperCase()}` : 'Export failed',
        ok ? 'ok' : 'warn',
      )
    } catch {
      onToast('Export failed', 'error')
    } finally {
      setExporting(false)
      setOpen(false)
      setExportOpen(false)
    }
  }

  if (!canRefresh && !canRemove && !canFullscreen && !canCopy && !canExport) return null

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
          {canCopy && (
            <button
              onClick={async () => { await onCopy(); setOpen(false) }}
              className="block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              Copy data
            </button>
          )}
          {canExport && (
            <div>
              <button
                onClick={() => setExportOpen(o => !o)}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between"
                aria-expanded={exportOpen}
              >
                <span>Export{exporting ? '…' : ''}</span>
                <span className="text-zinc-600">{exportOpen ? '▾' : '▸'}</span>
              </button>
              {exportOpen && (
                <div className="bg-zinc-950/60">
                  {EXPORT_FORMATS.map(f => (
                    <button
                      key={f.key}
                      onClick={() => runExport(f.key)}
                      disabled={exporting}
                      className="block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

export function WidgetShell({ config, contentHeight, snapshotKey }: { config: WidgetConfig; contentHeight: number; snapshotKey?: string }) {
  const { ctx, backendUrl, refreshIntervalMs, compact, toast, focusedId, setFocusedId, refreshPulse, emit, soundEnabled, reportWidgetHealth, registerWidgetData } = useDashboard()
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
  const { data, loading, error, lastUpdated, connected, nextRetryAt, refresh } = useDataSource(source)
  const Component = getWidget(config.component)

  // Snapshot capture: expose the current rendered data to the dashboard
  // via a ref-backed getter so "Share" can freeze exactly what's on
  // screen without re-fetching (which would regenerate AI content).
  // Only grid widgets pass a snapshotKey — fullscreen/embed re-renders
  // omit it so they don't clobber the grid entry. The ref always holds
  // the latest data; registration runs once per key.
  const dataRef = useRef<unknown>(data)
  dataRef.current = data
  useEffect(() => {
    if (!snapshotKey) return
    return registerWidgetData(snapshotKey, () => dataRef.current)
  }, [snapshotKey, registerWidgetData])
  // Reflect the resolved source so a dashboard-level refresh interval
  // override still drives the "last updated" badge.
  const isLive = !!source?.stream || !!(source?.refreshIntervalMs ?? source?.refreshInterval)
  // Subscribe to the dashboard's shared 1Hz tick when anything in the
  // header needs to re-render per second: the "X ago" badge, the
  // reconnect countdown on a disconnected stream, OR a stale-after
  // threshold that may have just expired.
  const staleAfterMs = source?.staleAfterMs
  const tickActive = (isLive && lastUpdated != null) || nextRetryAt != null ||
    (!!staleAfterMs && lastUpdated != null)
  const now = useNow(tickActive)
  const isStale = !!staleAfterMs && lastUpdated != null && (now - lastUpdated) > staleAfterMs

  // Refresh pulse — Dashboard's keyboard handler bumps refreshPulse with
  // our id when the user presses `r`. We watch the counter and trigger
  // a fresh fetch when it changes. Compares against a ref so a remount
  // doesn't accidentally refetch. `id === '*'` means refresh every
  // widget (toolbar "Reload" button).
  //
  // refresh_policy gates the pulse. "manual" widgets skip even targeted
  // pulses — refetch only happens via the action-menu Refresh item which
  // calls refresh() directly. "self" widgets ignore '*' but still honor
  // their own id (a sibling widget can still nudge them after an action).
  const lastPulseN = useRef(0)
  useEffect(() => {
    if (!refreshPulse) return
    const policy = config.refresh_policy ?? 'global'
    if (policy === 'manual') return
    const isGlobal = refreshPulse.id === '*'
    if (isGlobal && policy === 'self') return
    const matches = isGlobal || refreshPulse.id === config.id
    if (!matches) return
    if (refreshPulse.n > lastPulseN.current) {
      lastPulseN.current = refreshPulse.n
      refresh()
    }
  }, [refreshPulse, config.id, config.refresh_policy, refresh])

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
      if (soundEnabled) playAlertBeep(severity)
    }
    alertWasTriggered.current = triggered
  }, [data, config.alert, ctx, toast, emit, config.id, soundEnabled])

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

  // Report widget health to the dashboard so the toolbar pill stays in
  // sync. Widgets without an id are anonymous and skip reporting —
  // the toolbar can't address them anyway. Title falls back to the
  // component name so the hover detail still names the offender.
  useEffect(() => {
    if (!config.id) return
    const streaming = !!source?.stream
    reportWidgetHealth(config.id, {
      title: title || config.title || config.component,
      streaming,
      connected: streaming ? connected : true,
      error: resolution.error ?? error,
      stale: isStale,
    })
    return () => reportWidgetHealth(config.id!, null)
  }, [config.id, title, config.title, config.component, source?.stream, connected, resolution.error, error, isStale, reportWidgetHealth])

  const isFocused = !!config.id && focusedId === config.id
  // Mouse click to focus mirrors keyboard nav. Cheap visual affordance
  // for users who don't know about j/k yet.
  const onShellClick = config.id ? () => setFocusedId(config.id!) : undefined
  // Focused state: replace the double-border ring with a soft single
  // border + outer glow. Looks more like a focused highlight, less
  // like a bright outline.
  const focusClass = isFocused
    ? 'border-sky-400/60 shadow-[0_0_12px_-2px_rgba(56,189,248,0.4)]'
    : 'border-zinc-800'
  return (
    <div
      onClick={onShellClick}
      className={`bg-zinc-900 border ${focusClass} ${compact ? 'rounded' : 'rounded-lg'} overflow-hidden transition-shadow`}
    >
      {title && (
        <div className={`${compact ? 'px-2.5 py-1.5' : 'px-4 py-2.5'} border-b border-zinc-800 flex items-center justify-between`}>
          <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-zinc-100 truncate`}>{title}</h3>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {isLive && lastUpdated && (
              <span className={`text-[10px] ${isStale ? 'text-amber-400/80' : 'text-zinc-600'}`}>
                {isStale ? 'stale · ' : ''}{formatAge(now, lastUpdated)}
              </span>
            )}
            {config.source?.stream && !connected && nextRetryAt != null && (
              <span className="text-[10px] text-amber-400/80 tabular-nums" title="Reconnecting">
                retry {Math.max(0, Math.ceil((nextRetryAt - now) / 1000))}s
              </span>
            )}
            {config.source?.stream && (
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500/70'}`}
                title={connected ? 'Connected' : (nextRetryAt ? 'Reconnecting' : 'Disconnected')}
              />
            )}
            <ActionMenu
              widget={config}
              data={data}
              onToast={toast}
              onRefresh={refresh}
              onCopy={async () => {
                if (data == null) { toast('No data to copy', 'warn'); return false }
                if (typeof navigator === 'undefined' || !navigator.clipboard) {
                  toast('Clipboard unavailable', 'warn'); return false
                }
                try {
                  await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                  toast(`${config.title ?? config.component} copied`, 'ok')
                  return true
                } catch {
                  toast('Clipboard blocked', 'warn'); return false
                }
              }}
            />
          </div>
        </div>
      )}
      <div className={compact ? 'p-2.5' : 'p-4'} style={{ height: compact ? Math.round(contentHeight * 0.92) : contentHeight }}>
        {renderBody({
          resolution, loading, error, data,
          options: config.options, component: config.component, widgetId: config.id, Component,
          onRenderError: (err) => emit({
            type: 'widget_error',
            widgetId: config.id,
            component: config.component,
            message: err.message,
            source: 'render',
          }),
          // Inline-data sources can't retry; only offer the button
          // when there's an actual fetch/stream behind the widget.
          onRetry: source && !(source.inline !== undefined || source.data !== undefined) ? refresh : undefined,
        })}
      </div>
    </div>
  )
}
