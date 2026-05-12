import { createContext, useContext } from 'react'
import type { WidgetConfig } from '../types/template'

export type Severity = 'ok' | 'warn' | 'error' | 'info'

// Single telemetry sink for the dashboard. Pass `onEvent` to <Dashboard>
// to forward these to your analytics / observability layer. Intentionally
// narrow — we only emit signals that operators actually need to see.
export type DashboardEvent =
  | {
      type: 'alert'
      widgetId?: string
      severity: Severity
      message: string
      predicate: string
    }
  | {
      type: 'widget_error'
      widgetId?: string
      component: string
      message: string
      // 'data' = source fetch / stream failure; 'render' = exception
      // caught by ErrorBoundary; 'resolve' = ctx interpolation failure.
      source: 'data' | 'render' | 'resolve'
    }
  | {
      type: 'action'
      actionId: string
      clientRequestId: string
      status: string
      message?: string
      // True when the status is terminal (OK/REJECTED/FAILED/CANCELLED).
      // Non-terminal (ACCEPTED/PENDING) means more updates are coming.
      terminal: boolean
    }

export type EmitEvent = (event: DashboardEvent) => void

// One row in the in-memory action blotter. Mirrors the 'action' event
// fields plus a wall-clock receive time so the log can show "12s ago".
export interface ActionLogEntry {
  receivedAt: number
  actionId: string
  clientRequestId: string
  status: string
  message?: string
  terminal: boolean
}

// One row in the in-memory alert ring. Mirrors the 'alert' event plus a
// receive time. Drives the alert_log widget the same way ActionLogEntry
// drives action_log — separate buffers so alert frequency doesn't push
// trade actions out of the blotter and vice versa.
export interface AlertLogEntry {
  receivedAt: number
  widgetId?: string
  severity: Severity
  message: string
  predicate: string
}

export interface WidgetAction {
  targetId: string
  // If true, remove the widget at targetId. Other fields ignored.
  remove?: boolean
  // Fields to merge into the target widget. Omitted fields are kept as-is.
  component?: string
  title?: string
  span?: number
  height?: number
  source?: WidgetConfig['source']
  options?: WidgetConfig['options']
}

export interface DispatchOptions {
  // If true, drop all existing widgets before applying actions.
  // Used by Generate responses with replace_all=true to rebuild the
  // whole dashboard from a prompt.
  replaceAll?: boolean
}

export interface DashboardContextValue {
  dispatch: (actions: WidgetAction[], options?: DispatchOptions) => void
  // Cross-widget context: changing a value here causes every widget that
  // references "${ctx.<key>}" in its source to re-fetch.
  ctx: Record<string, string>
  setCtx: (key: string, value: string) => void
  // Current widgets — used by Prompt to send `current_widgets` in the
  // GenerateRequest so the AI can decide between surgical edits and a
  // full rebuild.
  widgets: WidgetConfig[]
  // Connect backend that resolves widgets with `source_id` and powers
  // the Generate RPC. Optional — fallback paths exist for both.
  backendUrl?: string
  // Dashboard-level refresh interval (ms). Overrides per-widget
  // `source.refreshInterval` when set. 0 / undefined = no override.
  // Streaming sources are unaffected.
  refreshIntervalMs?: number
  // Fire a fleeting toast notification. Auto-dismisses after a
  // few seconds. Severity drives color: ok|warn|error|info.
  toast: (message: string, severity?: Severity) => void
  // Compact mode: tighter padding, smaller header text, slightly
  // shrunk content height. Power-user density toggle from the toolbar.
  compact: boolean
  // The widget id currently displayed full-screen, or null for normal grid.
  fullscreenId: string | null
  setFullscreenId: (id: string | null) => void
  // Keyboard navigation focus. `j`/`k` cycle through ids, `f`
  // fullscreens the focused widget, `r` refreshes it. Esc clears.
  focusedId: string | null
  setFocusedId: (id: string | null) => void
  // Bumps when the user presses `r` on the focused widget. WidgetShell
  // watches its own id against `id`: if they match (or id === '*'
  // meaning "all widgets") and `n` changed, it triggers a fresh
  // fetch. Keeps the refresh API one-way and doesn't require widgets
  // to register imperative handles.
  refreshPulse: { id: string; n: number } | null
  // Pass '*' to refresh every widget at once (toolbar "Reload" button).
  requestRefresh: (id: string) => void
  // Telemetry fan-out. Safe no-op when consumer didn't pass `onEvent`.
  // Widgets emit via this rather than calling props directly so the
  // surface stays uniform across alerts, errors, and actions.
  emit: EmitEvent
  // In-memory ring of recent action events. The action_log widget
  // reads from this; capped so a misbehaving backend can't grow state
  // forever. Each emit({type:'action'}) appends an entry.
  recentActions: ActionLogEntry[]
  clearRecentActions: () => void
  recentAlerts: AlertLogEntry[]
  clearRecentAlerts: () => void
  // When true, warn/error alerts play a short audio beep. Off by
  // default; toggled from the dashboard toolbar and persisted in
  // localStorage. Info/ok alerts are always silent.
  soundEnabled: boolean
  // Per-widget health snapshot — WidgetShell reports its streaming
  // status and last error here so the toolbar can render an aggregate
  // pill (N streams live, M errors). Stored as an object keyed by
  // widget id so React state diffing is cheap.
  widgetHealth: Record<string, WidgetHealth>
  reportWidgetHealth: (id: string, state: WidgetHealth | null) => void
}

export interface WidgetHealth {
  // Display title (or component name) so the toolbar's hover detail
  // can name the offender without a separate lookup.
  title: string
  // True only when the widget's source has `stream: true` — polling
  // widgets aren't "streams" and don't count toward the live ratio.
  streaming: boolean
  connected: boolean
  error: string | null
}

// No-op stub. Exported so Storybook fixtures (and tests) can spread it
// instead of re-listing every context field — keeps story files stable
// as the context grows.
export const DEFAULT_DASHBOARD_CONTEXT: DashboardContextValue = {
  dispatch: () => {},
  ctx: {},
  setCtx: () => {},
  widgets: [],
  toast: () => {},
  compact: false,
  fullscreenId: null,
  setFullscreenId: () => {},
  focusedId: null,
  setFocusedId: () => {},
  refreshPulse: null,
  requestRefresh: () => {},
  emit: () => {},
  recentActions: [],
  clearRecentActions: () => {},
  recentAlerts: [],
  clearRecentAlerts: () => {},
  soundEnabled: false,
  widgetHealth: {},
  reportWidgetHealth: () => {},
}

export const DashboardContext = createContext<DashboardContextValue>(DEFAULT_DASHBOARD_CONTEXT)

export function useDashboard(): DashboardContextValue {
  return useContext(DashboardContext)
}
