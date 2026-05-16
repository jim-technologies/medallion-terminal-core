export interface Template {
  title?: string
  columns?: number // grid columns, default 12
  context?: Context
  widgets: WidgetConfig[]
  // Optional per-dashboard hotkeys. Pressing a key (outside an editable
  // element, no modifier) merges the entry's `ctx` map into the active
  // context. Intended for "press 1 for BTC, 2 for ETH" trader flows.
  shortcuts?: TemplateShortcut[]
}

export interface TemplateShortcut {
  // The literal key character (e.g. "1", "b"). Single-char keys only —
  // anything fancier (modifiers, sequences) belongs in app-level code,
  // not the template. Case-sensitive: "B" and "b" differ.
  key: string
  // Map of ctx keys to set when the shortcut fires.
  ctx: Record<string, string>
  // Optional label shown in the shortcuts cheat sheet (`?`).
  label?: string
}

export interface Context {
  values: Record<string, string>
}

export interface WidgetConfig {
  id?: string
  component: string
  span?: number // 1-12, default 6
  height?: number // px, has sensible default per component
  title?: string
  source?: DataSource
  options?: Record<string, unknown>
  // Optional client-side alert evaluated against the widget's data
  // on every update. Edge-triggered: fires once when the predicate
  // transitions false → true. Cleared when it returns to false.
  alert?: WidgetAlert
}

export interface WidgetAlert {
  // Predicate. Format: "<path> <op> <literal>" where <op> is one of
  // > >= < <= == != and <literal> is a number, "string", true/false,
  // or null. Path uses dot-syntax into the widget's `data` and
  // supports array indexing (e.g. "rows.0.left.values.iv").
  // Examples:
  //   "value > 100"
  //   "rows.0.left.values.iv > 0.7"
  //   "status == \"EVENT_STATUS_ERROR\""
  when: string
  message: string
  // Toast severity. Defaults to "warn".
  severity?: 'info' | 'ok' | 'warn' | 'error'
}

export interface DataSource {
  // Mode 1 — server-backed via TerminalService (preferred, typed)
  source_id?: string

  // Mode 2 — arbitrary URL (federation / escape hatch)
  url?: string

  // Mode 3 — inline data baked into the template.
  // Proto-canonical name is `inline`; `data` is accepted as a legacy alias.
  inline?: unknown
  /** @deprecated use `inline` */
  data?: unknown

  // Common — values may contain ${ctx.<key>} substitution tokens.
  // For source_id mode: passed as TerminalService.params.
  // For url mode: appended as query string.
  params?: Record<string, string>

  // Streaming. true = SSE (url mode) or Connect server-streaming
  // (source_id mode); 'connect' = manually-encoded Connect stream
  // over an arbitrary URL.
  stream?: boolean | 'connect'

  // Polling interval (ms) when not streaming. 0 = fetch once.
  // Proto-canonical name is `refreshIntervalMs` (mirroring proto's
  // `refresh_interval_ms`). `refreshInterval` accepted as legacy alias.
  refreshIntervalMs?: number
  /** @deprecated use `refreshIntervalMs` */
  refreshInterval?: number

  // Throttle window (ms) for streaming sources. When set, only the
  // most recent payload within the window propagates to the widget.
  // Trailing-edge: the first message renders immediately, then at
  // most one render per window. Useful for tick-firehose feeds where
  // 1000 msg/s would otherwise force 1000 React renders.
  throttleMs?: number

  // Mark the widget "stale" when no update has arrived in this many
  // ms. The header shows an amber "stale" badge; data is still
  // displayed (silent freeze is worse than stale data with a warning).
  // Useful for desk traders monitoring live data lines.
  staleAfterMs?: number

  // url-mode only.
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
  transform?: string
}

export interface WidgetProps {
  data: unknown
  options?: Record<string, unknown>
  // Widget's own id from the template, when one was declared. Lets a
  // widget address itself via context APIs (e.g. requestRefresh) without
  // resorting to the over-broad '*' wildcard.
  widgetId?: string
}
