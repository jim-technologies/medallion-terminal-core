import type { WidgetProps } from '../types/template'

// Pure layout primitive: a thin rule with an optional label, used to
// visually group widgets that follow it. No data, no source — just
// `options.label`.
//
// Span 12 by convention (full row), but any span works; the rule
// stretches to fill the widget width.
export function Section({ options }: WidgetProps) {
  const label = typeof options?.label === 'string' ? options.label : ''
  return (
    <div className="h-full flex items-center gap-3 px-1">
      {label && (
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  )
}
