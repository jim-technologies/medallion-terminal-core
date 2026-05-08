import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'

interface Choice { value: string; label?: string }

interface SelectOptions {
  key?: string
  choices?: Array<string | Choice>
  label?: string
  default?: string
}

// Categorical input that writes to ctx. Pairs with `slider` (numeric);
// together they cover the two standard input shapes.
//
// `choices` accepts either a flat string array or `[{value, label?}]`.
// Initial value comes from `ctx[key]` (URL / Cmd+K / another Select
// all sync into it).
export function Select({ options }: WidgetProps) {
  const opts = (options ?? {}) as SelectOptions
  const { ctx, setCtx } = useDashboard()
  const choices = (opts.choices ?? []).map(c =>
    typeof c === 'string' ? { value: c, label: c } : { value: c.value, label: c.label ?? c.value },
  )

  if (!opts.key) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Select requires options.key
      </div>
    )
  }
  if (choices.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Select requires options.choices
      </div>
    )
  }

  const current = ctx[opts.key] ?? opts.default ?? choices[0].value

  return (
    <div className="flex flex-col h-full justify-center gap-1.5 px-2">
      <label className="text-[10px] uppercase tracking-wider text-zinc-500">
        {opts.label ?? opts.key}
      </label>
      <select
        value={current}
        onChange={e => setCtx(opts.key!, e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
      >
        {choices.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
    </div>
  )
}
