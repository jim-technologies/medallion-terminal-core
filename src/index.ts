// Styles
import './index.css'

// Core
export { Dashboard } from './core/Dashboard'
export type { DashboardTemplateTrust, DashboardTheme } from './core/Dashboard'
export { MultiDashboard, useTabFromUrl } from './core/MultiDashboard'
export { DashboardContext, useDashboard } from './core/DashboardContext'
export { getWidget, registerWidget, BUILTIN_KEYS } from './core/WidgetRegistry'
export { ErrorBoundary } from './core/ErrorBoundary'
export { CommandPalette } from './core/CommandPalette'
export type { PaletteSuggest, PaletteSuggestion } from './core/CommandPalette'
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
export {
  validateTemplateTrust,
  DEFAULT_UNTRUSTED_TEMPLATE_POLICY,
  DEFAULT_SENSITIVE_TEMPLATE_HEADERS,
  DEFAULT_IFRAME_SANDBOX,
  DEFAULT_IFRAME_SANDBOX_DISALLOWED_TOKENS,
} from './core/templateSecurity'
export type {
  TemplateTrustPolicy,
  TemplateSecurityIssue,
  TemplateSecuritySeverity,
  IframeSandboxPolicy,
} from './core/templateSecurity'
export { buildSnapshot, isStaticTemplate, widgetSnapshotKey } from './core/snapshot'

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
export { ActionLog } from './widgets/ActionLog'
export { AlertLog } from './widgets/AlertLog'
export { Tape } from './widgets/Tape'
export { FileBrowser } from './widgets/FileBrowser'
export { WidgetShell } from './widgets/WidgetShell'
export { Placeholder } from './widgets/Placeholder'
export { Skeleton, ErrorState, Empty } from './widgets/states'
export { SEMANTIC, PALETTE, resolveColor } from './widgets/colors'
export { abbreviateAxis, formatCompact, formatStat, formatTimestamp, formatPercent, formatCurrency, formatBps } from './widgets/format'
export { HoverContext, HoverProvider, useHover } from './core/HoverContext'
export { NowContext, NowProvider, useNow } from './core/NowContext'

// BI export / embedding surface
export {
  exportView,
  downloadView,
  viewRowCount,
  exportFilename,
} from './export/exportView'
export type { ExportableView, ExportFormat, FlatTable, Cell } from './export/exportView'
export { flatten } from './export/flatten'
export {
  toCsv,
  toJson,
  toNdjson,
  toParquet,
  csvEscape,
  serializeText,
  MIME,
  EXTENSION,
} from './export/serializers'
export { ExportMenu } from './export/ExportMenu'
export type { ExportMenuProps } from './export/ExportMenu'
export { EmbedView } from './embed/EmbedView'
export type { EmbedViewProps } from './embed/EmbedView'
export { parseEmbedConfig, buildEmbedUrl } from './embed/embedConfig'
export type { EmbedConfig } from './embed/embedConfig'
export {
  buildBiDescriptor,
  descriptorToJson,
  connectionFields,
} from './bi/connector'
export type {
  BiConnectorDescriptor,
  BiTable,
  BiColumn,
  BiParam,
  BiProtocol,
  BiColumnType,
  BiShape,
  SourceLike,
  BuildDescriptorOptions,
} from './bi/connector'

// Hooks
export { useDataSource } from './hooks/useDataSource'
export { useBreakpoint } from './hooks/useBreakpoint'
export { useAnimatedNumber } from './hooks/useAnimatedNumber'
export { useWatchAction, isTerminalStatus, type ActionUpdate } from './hooks/useWatchAction'

// Types
export type { Template, Context, WidgetConfig, WidgetAlert, TemplateShortcut, DataSource, WidgetProps } from './types/template'
export type { DataSourceState } from './hooks/useDataSource'
export type { WidgetAction, DispatchOptions, DashboardContextValue, DashboardEvent, EmitEvent, ActionLogEntry, AlertLogEntry } from './core/DashboardContext'
export type { Breakpoint } from './hooks/useBreakpoint'

// Proto-derived JSON types — for backend implementers.
// Friendlier hand-rolled types above are the framework's primary API;
// these are the exact wire shapes for backends that want them.
export type * from './proto'
