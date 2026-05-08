import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { WidgetProps } from '../types/template'
import { Placeholder } from '../widgets/Placeholder'

// Widget registry — every entry is React.lazy so the heavy chart libs
// (Recharts, lightweight-charts) only land in the bundle for dashboards
// that actually use them. WidgetShell wraps renders in <Suspense> with
// the per-archetype <Skeleton> as fallback, so the swap from lazy chunk
// to rendered widget reuses the same loading visual the data-loading
// path already uses.

type AnyWidget = ComponentType<WidgetProps> | LazyExoticComponent<ComponentType<WidgetProps>>

const lazyWidget = (loader: () => Promise<{ [k: string]: ComponentType<WidgetProps> }>, name: string) =>
  lazy(() => loader().then(m => ({ default: m[name] })))

const registry = new Map<string, AnyWidget>([
  ['timeseries',     lazyWidget(() => import('../widgets/Timeseries'), 'Timeseries')],
  ['candlestick',    lazyWidget(() => import('../widgets/Candlestick'), 'Candlestick')],
  ['table',          lazyWidget(() => import('../widgets/DataTable'), 'DataTable')],
  ['metric',         lazyWidget(() => import('../widgets/Metric'), 'Metric')],
  ['text',           lazyWidget(() => import('../widgets/Text'), 'Text')],
  ['prompt',         lazyWidget(() => import('../widgets/Prompt'), 'Prompt')],
  ['gauge',          lazyWidget(() => import('../widgets/Gauge'), 'Gauge')],
  ['distribution',   lazyWidget(() => import('../widgets/Distribution'), 'Distribution')],
  ['heatmap',        lazyWidget(() => import('../widgets/Heatmap'), 'Heatmap')],
  ['events',         lazyWidget(() => import('../widgets/Events'), 'Events')],
  ['catalog',        lazyWidget(() => import('../widgets/Catalog'), 'Catalog')],
  ['orderbook',      lazyWidget(() => import('../widgets/OrderBook'), 'OrderBook')],
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
  ['multi_select',   lazyWidget(() => import('../widgets/MultiSelect'), 'MultiSelect')],
  ['json',           lazyWidget(() => import('../widgets/Json'), 'Json')],
  ['sparkline',      lazyWidget(() => import('../widgets/Sparkline'), 'Sparkline')],
])

export function getWidget(name: string): AnyWidget {
  return registry.get(name) || Placeholder
}

export function registerWidget(name: string, component: AnyWidget) {
  registry.set(name, component)
}
