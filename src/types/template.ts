export interface Template {
  title?: string
  columns?: number // grid columns, default 12
  widgets: WidgetConfig[]
}

export interface WidgetConfig {
  id?: string
  component: string // 'timeseries' | 'table' | 'metric' | 'text' | ...
  span?: number // column span 1-12, default 6
  height?: number // content height in px, has sensible default per component
  title?: string
  source?: DataSource
  options?: Record<string, unknown>
}

export interface DataSource {
  url?: string
  data?: unknown // inline data — no fetch needed
  stream?: boolean | 'sse' | 'ws' // true/'sse' = SSE, 'ws' = WebSocket
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
  refreshInterval?: number // polling interval in ms (for non-streaming)
  transform?: string // dot-path to extract nested data, e.g. "data.items"
}

export interface WidgetProps {
  data: unknown
  options?: Record<string, unknown>
}
