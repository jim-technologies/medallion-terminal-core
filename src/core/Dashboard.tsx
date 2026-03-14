import { useState, useCallback } from 'react'
import type { Template, WidgetConfig } from '../types/template'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { WidgetShell } from '../widgets/WidgetShell'
import { DashboardContext, type WidgetAction } from './DashboardContext'

const DEFAULT_HEIGHTS: Record<string, number> = {
  metric: 120,
  timeseries: 300,
  candlestick: 400,
  table: 350,
  text: 350,
  prompt: 60,
}

export function Dashboard({ template }: { template: Template }) {
  const breakpoint = useBreakpoint()
  const columns = template.columns || 12
  const [widgets, setWidgets] = useState<WidgetConfig[]>(template.widgets)

  const dispatch = useCallback((actions: WidgetAction[]) => {
    setWidgets(prev => {
      const next = [...prev]
      for (const action of actions) {
        const idx = next.findIndex(w => w.id === action.targetId)
        if (idx >= 0) {
          // Merge action fields into existing widget
          next[idx] = {
            ...next[idx],
            ...(action.component !== undefined && { component: action.component }),
            ...(action.title !== undefined && { title: action.title }),
            ...(action.span !== undefined && { span: action.span }),
            ...(action.height !== undefined && { height: action.height }),
            ...(action.source !== undefined && { source: action.source }),
            ...(action.filters !== undefined && { filters: action.filters }),
            ...(action.options !== undefined && { options: action.options }),
          }
        } else {
          // Create new widget from action
          next.push({
            id: action.targetId,
            component: action.component || 'placeholder',
            title: action.title,
            span: action.span,
            height: action.height,
            source: action.source,
            filters: action.filters,
            options: action.options,
          })
        }
      }
      return next
    })
  }, [])

  const effectiveSpan = (span: number) => {
    if (breakpoint === 'mobile') return columns
    if (breakpoint === 'tablet') return Math.min(span, Math.floor(columns / 2))
    return Math.min(span, columns)
  }

  return (
    <DashboardContext.Provider value={{ dispatch }}>
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
          {widgets.map((widget, i) => (
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
    </DashboardContext.Provider>
  )
}
