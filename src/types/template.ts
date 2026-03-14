export interface Template {
  title?: string
  columns?: number // grid columns, default 12
  widgets: WidgetConfig[]
}

export interface WidgetConfig {
  id?: string
  component: string
  span?: number // 1-12, default 6
  height?: number // px, has sensible default per component
  title?: string
  source?: DataSource
  options?: Record<string, unknown>
}

export interface DataSource {
  url?: string
  data?: unknown // inline data, no fetch
  stream?: boolean | 'connect' // true = SSE, 'connect' = ConnectRPC server-streaming
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
  refreshInterval?: number // polling interval in ms
  transform?: string // dot-path to extract nested data
}

export interface WidgetProps {
  data: unknown
  options?: Record<string, unknown>
}
