import type { WidgetProps } from '../types/template'

export function Placeholder(_: WidgetProps) {
  return (
    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
      Unknown widget type
    </div>
  )
}
