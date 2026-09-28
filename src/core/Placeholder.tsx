import { Empty } from './WidgetStates'
import type { WidgetProps } from '../types/template'

export function Placeholder(_: WidgetProps) {
  return <Empty>Unknown widget type</Empty>
}
