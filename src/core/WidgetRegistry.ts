import type { ComponentType } from 'react'
import type { WidgetProps } from '../types/template'
import { Timeseries } from '../widgets/Timeseries'
import { DataTable } from '../widgets/DataTable'
import { Metric } from '../widgets/Metric'
import { Text } from '../widgets/Text'
import { Candlestick } from '../widgets/Candlestick'
import { Prompt } from '../widgets/Prompt'
import { Placeholder } from '../widgets/Placeholder'

const registry = new Map<string, ComponentType<WidgetProps>>([
  ['timeseries', Timeseries],
  ['candlestick', Candlestick],
  ['table', DataTable],
  ['metric', Metric],
  ['text', Text],
  ['prompt', Prompt],
])

export function getWidget(name: string): ComponentType<WidgetProps> {
  return registry.get(name) || Placeholder
}

export function registerWidget(name: string, component: ComponentType<WidgetProps>) {
  registry.set(name, component)
}
