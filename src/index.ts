// Styles
import './index.css'

// Core
export { Dashboard } from './core/Dashboard'
export { MultiDashboard, useTabFromUrl } from './core/MultiDashboard'
export { DashboardContext, useDashboard } from './core/DashboardContext'
export { getWidget, registerWidget } from './core/WidgetRegistry'
export { ErrorBoundary } from './core/ErrorBoundary'
export { CommandPalette } from './core/CommandPalette'
export { ShortcutsOverlay } from './core/ShortcutsOverlay'
export { saveView, loadView, listViews, deleteView } from './core/savedViews'
export {
  resolveSource,
  interpolate,
  buildGenerateUrl,
  buildGenerateRequest,
  buildSubmitActionUrl,
  buildActionRequest,
  buildWatchActionUrl,
  buildActionWatchRequest,
  newClientRequestId,
} from './core/resolveSource'
export { applyActions } from './core/applyActions'
export { readCtxFromUrl, writeCtxToUrl } from './core/urlState'
export { getNested } from './core/getNested'
export { evaluateAlert, canParsePredicate } from './core/alerts'
export { validateTemplate, BUILTIN_COMPONENTS } from './core/validateTemplate'
export type { ValidationIssue, ValidationSeverity } from './core/validateTemplate'

// Widgets
export { Timeseries } from './widgets/Timeseries'
export { Candlestick } from './widgets/Candlestick'
export { DataTable } from './widgets/DataTable'
export { Metric } from './widgets/Metric'
export { Text } from './widgets/Text'
export { Prompt } from './widgets/Prompt'
export { Gauge } from './widgets/Gauge'
export { Distribution } from './widgets/Distribution'
export { Heatmap } from './widgets/Heatmap'
export { Events } from './widgets/Events'
export { Catalog } from './widgets/Catalog'
export { OrderBook } from './widgets/OrderBook'
export { PairedGrid } from './widgets/PairedGrid'
export { Trade } from './widgets/Trade'
export { Ticker } from './widgets/Ticker'
export { VolumeProfile } from './widgets/VolumeProfile'
export { StatStrip } from './widgets/StatStrip'
export { BarChart } from './widgets/BarChart'
export { Scatter } from './widgets/Scatter'
export { Clock } from './widgets/Clock'
export { Treemap } from './widgets/Treemap'
export { Image } from './widgets/Image'
export { Iframe } from './widgets/Iframe'
export { Histogram } from './widgets/Histogram'
export { Section } from './widgets/Section'
export { AreaChart } from './widgets/AreaChart'
export { Slider } from './widgets/Slider'
export { Select } from './widgets/Select'
export { Boxplot } from './widgets/Boxplot'
export { Radar } from './widgets/Radar'
export { Dag } from './widgets/Dag'
export { MultiSelect } from './widgets/MultiSelect'
export { Json } from './widgets/Json'
export { Sparkline } from './widgets/Sparkline'
export { WidgetShell } from './widgets/WidgetShell'
export { Placeholder } from './widgets/Placeholder'
export { Skeleton, ErrorState, Empty } from './widgets/states'
export { SEMANTIC, PALETTE, resolveColor } from './widgets/colors'
export { abbreviateAxis, formatCompact, formatStat, formatTimestamp } from './widgets/format'
export { HoverContext, HoverProvider, useHover } from './core/HoverContext'
export { NowContext, NowProvider, useNow } from './core/NowContext'

// Hooks
export { useDataSource } from './hooks/useDataSource'
export { useBreakpoint } from './hooks/useBreakpoint'
export { useAnimatedNumber } from './hooks/useAnimatedNumber'
export { useWatchAction, isTerminalStatus, type ActionUpdate } from './hooks/useWatchAction'

// Types
export type { Template, Context, WidgetConfig, WidgetAlert, DataSource, WidgetProps } from './types/template'
export type { DataSourceState } from './hooks/useDataSource'
export type { WidgetAction, DispatchOptions, DashboardContextValue, DashboardEvent, EmitEvent } from './core/DashboardContext'
export type { Breakpoint } from './hooks/useBreakpoint'

// Proto-derived JSON types — for backend implementers.
// Friendlier hand-rolled types above are the framework's primary API;
// these are the exact wire shapes for backends that want them.
export type * from './proto'
