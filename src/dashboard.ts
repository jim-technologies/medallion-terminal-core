/**
 * Proto-driven Dashboard entry point.
 *
 * Built-in widgets remain behind the WidgetRegistry dynamic-import boundary;
 * consumers should prefer this subpath over the backwards-compatible root
 * entry when they only need Dashboard.
 */
export { Dashboard } from './core/Dashboard'
export type {
  DashboardProps,
  DashboardTemplateTrust,
  DashboardTheme,
} from './core/Dashboard'
export { MultiDashboard, useTabFromUrl } from './core/MultiDashboard'
export { DashboardContext, useDashboard } from './core/DashboardContext'
export {
  createWidgetRegistry,
  getWidget,
  registerWidget,
  BUILTIN_KEYS,
} from './core/WidgetRegistry'
export type {
  CreateWidgetRegistryOptions,
  WidgetComponent,
  WidgetRegistry,
} from './core/WidgetRegistry'
export type { TerminalIntent, TerminalIntentHandler } from './core/TerminalIntent'
export type {
  Template,
  Context,
  WidgetConfig,
  WidgetAlert,
  TemplateShortcut,
  DataSource,
  WidgetProps,
} from './types/template'
export type {
  WidgetAction,
  DispatchOptions,
  DashboardContextValue,
  DashboardEvent,
  EmitEvent,
  ActionLogEntry,
  AlertLogEntry,
} from './core/DashboardContext'
