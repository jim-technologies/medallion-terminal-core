import { createContext, useContext } from 'react'
import type { WidgetConfig } from '../types/template'

export type Severity = 'ok' | 'warn' | 'error' | 'info'

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
}

export const DashboardContext = createContext<DashboardContextValue>({
  dispatch: () => {},
  ctx: {},
  setCtx: () => {},
  widgets: [],
  toast: () => {},
  compact: false,
  fullscreenId: null,
  setFullscreenId: () => {},
})

export function useDashboard(): DashboardContextValue {
  return useContext(DashboardContext)
}
