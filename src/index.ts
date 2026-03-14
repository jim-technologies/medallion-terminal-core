// Styles
import './index.css'

// Core
export { Dashboard } from './core/Dashboard'
export { DashboardContext, useDashboard } from './core/DashboardContext'
export { getWidget, registerWidget } from './core/WidgetRegistry'
export { ErrorBoundary } from './core/ErrorBoundary'

// Widgets
export { Timeseries } from './widgets/Timeseries'
export { Candlestick } from './widgets/Candlestick'
export { DataTable } from './widgets/DataTable'
export { Metric } from './widgets/Metric'
export { Text } from './widgets/Text'
export { Prompt } from './widgets/Prompt'
export { WidgetShell } from './widgets/WidgetShell'
export { Placeholder } from './widgets/Placeholder'

// Hooks
export { useDataSource } from './hooks/useDataSource'
export { useBreakpoint } from './hooks/useBreakpoint'

// Types
export type { Template, WidgetConfig, DataSource, WidgetProps } from './types/template'
export type { DataSourceState } from './hooks/useDataSource'
export type { WidgetAction, DashboardContextValue } from './core/DashboardContext'
export type { Breakpoint } from './hooks/useBreakpoint'
