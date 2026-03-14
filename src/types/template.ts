export interface Template {
  title?: string
  columns?: number // grid columns, default 12
  widgets: WidgetConfig[]
}

export interface WidgetConfig {
  id?: string
  component: string // 'timeseries' | 'table' | 'metric' | 'text' | 'candlestick' | ...
  span?: number // column span 1-12, default 6
  height?: number // content height in px, has sensible default per component
  title?: string
  source?: DataSource
  filters?: FilterConfig[] // auto-generated or explicit filters for this widget
  options?: Record<string, unknown>
}

export interface DataSource {
  url?: string
  data?: unknown // inline data — no fetch needed
  stream?: boolean | 'sse' | 'ws' | 'connect' // true/'sse' = SSE, 'ws' = WS, 'connect' = ConnectRPC streaming
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown // request body (used for POST, ConnectRPC unary/streaming)
  refreshInterval?: number // polling interval in ms (for non-streaming)
  transform?: string // dot-path to extract nested data, e.g. "data.items"
}

// ConnectRPC unary: { url: "/svc/Method", method: "POST", body: { ... } }
// ConnectRPC streaming: { url: "/svc/Method", stream: "connect", body: { ... } }
// Both use POST with JSON body. Unary returns single response, streaming returns envelope stream.

export interface FilterConfig {
  key: string // field name in the data to filter on
  label?: string // display label, defaults to key
  type?: 'select' | 'range' | 'text' | 'auto' // 'auto' infers from data (default)
  options?: string[] | number[] // explicit options for select filters
}

export interface WidgetProps {
  data: unknown
  options?: Record<string, unknown>
}
