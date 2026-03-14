// Styles
import './index.css'

// Core
export { Dashboard } from './core/Dashboard'
export { getWidget, registerWidget } from './core/WidgetRegistry'
export { ErrorBoundary } from './core/ErrorBoundary'

// Widgets
export { Timeseries } from './widgets/Timeseries'
export { DataTable } from './widgets/DataTable'
export { Metric } from './widgets/Metric'
export { Text } from './widgets/Text'
export { Candlestick } from './widgets/Candlestick'
export { WidgetShell } from './widgets/WidgetShell'
export { Placeholder } from './widgets/Placeholder'
export { Filters, applyFilters } from './widgets/Filters'

// Hooks
export { useDataSource } from './hooks/useDataSource'
export { useBreakpoint } from './hooks/useBreakpoint'

// Types
export type { Template, WidgetConfig, DataSource, FilterConfig, WidgetProps } from './types/template'
export type { DataSourceState } from './hooks/useDataSource'
export type { Breakpoint } from './hooks/useBreakpoint'
