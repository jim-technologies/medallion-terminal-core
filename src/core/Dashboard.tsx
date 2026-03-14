import type { Template } from '../types/template'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WidgetShell } from '../widgets/WidgetShell'

const DEFAULT_HEIGHTS: Record<string, number> = {
  metric: 120,
  timeseries: 300,
  candlestick: 400,
  table: 350,
  text: 350,
}

export function Dashboard({ template }: { template: Template }) {
  const breakpoint = useBreakpoint()
  const columns = template.columns || 12

  const effectiveSpan = (span: number) => {
    if (breakpoint === 'mobile') return columns
    if (breakpoint === 'tablet') return Math.min(span, Math.floor(columns / 2))
    return Math.min(span, columns)
  }

  return (
    <div className="min-h-full bg-zinc-950 p-3 md:p-5">
      {template.title && (
        <h1 className="text-lg font-semibold text-zinc-100 mb-4 tracking-tight">
          {template.title}
        </h1>
      )}
      <div
        className="grid gap-3 md:gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {template.widgets.map((widget, i) => (
          <div
            key={widget.id || i}
            style={{
              gridColumn: `span ${effectiveSpan(widget.span || 6)}`,
            }}
          >
            <WidgetShell
              config={widget}
              contentHeight={widget.height || DEFAULT_HEIGHTS[widget.component] || 280}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
