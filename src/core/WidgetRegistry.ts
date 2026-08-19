import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { WidgetProps } from '../types/template'
import { Placeholder } from '../widgets/Placeholder'

// Widget registry — every entry is React.lazy so the heavy chart libs
// (Recharts, lightweight-charts) only land in the bundle for dashboards
// that actually use them. WidgetShell wraps renders in <Suspense> with
// the per-archetype <Skeleton> as fallback, so the swap from lazy chunk
// to rendered widget reuses the same loading visual the data-loading
// path already uses.

/** A synchronous or lazily loaded dashboard widget implementation. */
export type WidgetComponent =
  | ComponentType<WidgetProps>
  | LazyExoticComponent<ComponentType<WidgetProps>>

const lazyWidget = (loader: () => Promise<{ [k: string]: ComponentType<WidgetProps> }>, name: string) =>
  lazy(() => loader().then(m => ({ default: m[name] })))

const builtInWidgets = new Map<string, WidgetComponent>([
  ['timeseries',     lazyWidget(() => import('../widgets/Timeseries'), 'Timeseries')],
  ['candlestick',    lazyWidget(() => import('../widgets/Candlestick'), 'Candlestick')],
  ['table',          lazyWidget(() => import('../widgets/DataTable'), 'DataTable')],
  ['metric',         lazyWidget(() => import('../widgets/Metric'), 'Metric')],
  ['text',           lazyWidget(() => import('../widgets/Text'), 'Text')],
  ['conversation',   lazyWidget(() => import('../widgets/ConversationImpl'), 'ConversationImpl')],
  ['prompt',         lazyWidget(() => import('../widgets/Prompt'), 'Prompt')],
  ['gauge',          lazyWidget(() => import('../widgets/Gauge'), 'Gauge')],
  ['distribution',   lazyWidget(() => import('../widgets/Distribution'), 'Distribution')],
  ['heatmap',        lazyWidget(() => import('../widgets/Heatmap'), 'Heatmap')],
  ['events',         lazyWidget(() => import('../widgets/Events'), 'Events')],
  ['catalog',        lazyWidget(() => import('../widgets/Catalog'), 'Catalog')],
  ['asset_catalog',  lazyWidget(() => import('../widgets/AssetCatalog'), 'AssetCatalog')],
  ['object_view',    lazyWidget(() => import('../widgets/ObjectView'), 'ObjectView')],
  ['code_browser',   lazyWidget(() => import('../widgets/CodeBrowser'), 'CodeBrowser')],
  ['record_grid',    lazyWidget(() => import('../widgets/RecordGrid'), 'RecordGrid')],
  ['record_board',   lazyWidget(() => import('../widgets/RecordBoard'), 'RecordBoard')],
  ['record_calendar',lazyWidget(() => import('../widgets/RecordCalendar'), 'RecordCalendar')],
  ['record_form',    lazyWidget(() => import('../widgets/RecordForm'), 'RecordForm')],
  ['action_form',    lazyWidget(() => import('../widgets/ActionForm'), 'ActionForm')],
  ['orderbook',      lazyWidget(() => import('../widgets/OrderBook'), 'OrderBook')],
  ['depth_chart',    lazyWidget(() => import('../widgets/DepthChart'), 'DepthChart')],
  ['paired_grid',    lazyWidget(() => import('../widgets/PairedGrid'), 'PairedGrid')],
  ['trade',          lazyWidget(() => import('../widgets/Trade'), 'Trade')],
  ['ticker',         lazyWidget(() => import('../widgets/Ticker'), 'Ticker')],
  ['volume_profile', lazyWidget(() => import('../widgets/VolumeProfile'), 'VolumeProfile')],
  ['stat_strip',     lazyWidget(() => import('../widgets/StatStrip'), 'StatStrip')],
  ['bar_chart',      lazyWidget(() => import('../widgets/BarChart'), 'BarChart')],
  ['scatter',        lazyWidget(() => import('../widgets/Scatter'), 'Scatter')],
  ['clock',          lazyWidget(() => import('../widgets/Clock'), 'Clock')],
  ['treemap',        lazyWidget(() => import('../widgets/Treemap'), 'Treemap')],
  ['image',          lazyWidget(() => import('../widgets/Image'), 'Image')],
  ['iframe',         lazyWidget(() => import('../widgets/Iframe'), 'Iframe')],
  ['histogram',      lazyWidget(() => import('../widgets/Histogram'), 'Histogram')],
  ['section',        lazyWidget(() => import('../widgets/Section'), 'Section')],
  ['area_chart',     lazyWidget(() => import('../widgets/AreaChart'), 'AreaChart')],
  ['slider',         lazyWidget(() => import('../widgets/Slider'), 'Slider')],
  ['select',         lazyWidget(() => import('../widgets/Select'), 'Select')],
  ['boxplot',        lazyWidget(() => import('../widgets/Boxplot'), 'Boxplot')],
  ['radar',          lazyWidget(() => import('../widgets/Radar'), 'Radar')],
  ['dag',            lazyWidget(() => import('../widgets/Dag'), 'Dag')],
  ['geo_map',        lazyWidget(() => import('../widgets/GeoMap'), 'GeoMap')],
  ['media_gallery',  lazyWidget(() => import('../widgets/MediaGalleryImpl'), 'MediaGalleryImpl')],
  ['multi_select',   lazyWidget(() => import('../widgets/MultiSelect'), 'MultiSelect')],
  ['json',           lazyWidget(() => import('../widgets/Json'), 'Json')],
  ['sparkline',      lazyWidget(() => import('../widgets/Sparkline'), 'Sparkline')],
  ['action_log',     lazyWidget(() => import('../widgets/ActionLog'), 'ActionLog')],
  ['alert_log',      lazyWidget(() => import('../widgets/AlertLog'), 'AlertLog')],
  ['tape',           lazyWidget(() => import('../widgets/Tape'), 'Tape')],
  ['file_browser',   lazyWidget(() => import('../widgets/FileBrowser'), 'FileBrowser')],
])

// Snapshot of the keys present at module load — i.e. the framework's
// built-in widgets, before any consumer-side registerWidget calls. The
// validator's BUILTIN_COMPONENTS list is asserted equal to this set in
// a test so the two never drift.
export const BUILTIN_KEYS: ReadonlySet<string> = new Set(builtInWidgets.keys())

/** Options for an isolated registry instance. */
export interface CreateWidgetRegistryOptions {
  /** Seed the registry with every built-in widget. Defaults to true. */
  includeBuiltIns?: boolean
}

/** Instance-local widget registry used by one or more explicit Dashboards. */
export interface WidgetRegistry {
  /** Registers or replaces a widget and returns this registry for chaining. */
  register(name: string, component: WidgetComponent): WidgetRegistry
  /** Removes a widget from this registry only. */
  unregister(name: string): boolean
  /** Returns the registered implementation without a placeholder fallback. */
  get(name: string): WidgetComponent | undefined
  /** Reports whether this registry contains the widget name. */
  has(name: string): boolean
  /** Returns an immutable snapshot of the currently registered names. */
  keys(): ReadonlySet<string>
}

class ScopedWidgetRegistry implements WidgetRegistry {
  readonly #widgets: Map<string, WidgetComponent>

  constructor(options: CreateWidgetRegistryOptions = {}) {
    this.#widgets = options.includeBuiltIns === false
      ? new Map()
      : new Map(builtInWidgets)
  }

  register(name: string, component: WidgetComponent): WidgetRegistry {
    this.#widgets.set(name, component)
    return this
  }

  unregister(name: string): boolean {
    return this.#widgets.delete(name)
  }

  get(name: string): WidgetComponent | undefined {
    return this.#widgets.get(name)
  }

  has(name: string): boolean {
    return this.#widgets.has(name)
  }

  keys(): ReadonlySet<string> {
    return new Set(this.#widgets.keys())
  }
}

/**
 * Creates a widget registry with no shared mutable state. Built-ins are copied
 * into each instance by default; legacy global registrations are never copied.
 */
export function createWidgetRegistry(
  options: CreateWidgetRegistryOptions = {},
): WidgetRegistry {
  return new ScopedWidgetRegistry(options)
}

// Legacy process-global registry. This remains separate from all instance
// registries so existing registerWidget() consumers keep their behavior while
// new hosts can opt into strict registry isolation.
const globalWidgets = new Map(builtInWidgets)

export function getWidget(name: string, scopedRegistry?: WidgetRegistry): WidgetComponent {
  return (scopedRegistry ? scopedRegistry.get(name) : globalWidgets.get(name)) || Placeholder
}

/** Registers a widget in the legacy process-global registry. */
export function registerWidget(name: string, component: WidgetComponent): void {
  globalWidgets.set(name, component)
}
