import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'

interface Choice { value: string; label?: string }

interface MultiSelectOptions {
  key?: string
  choices?: Array<string | Choice>
  label?: string
  default?: string[]
}

// Multiple-choice variant of `select`. Stores the chosen values in ctx
// as a comma-separated string so URL state and cmd-k integrations keep
// working. Substitution-friendly: a widget binding a param to
// `${ctx.venues}` gets "binance,coinbase".
//
// Renders as a row of toggle chips — natural at any width, no popovers.
export function MultiSelect({ options }: WidgetProps) {
  const opts = (options ?? {}) as MultiSelectOptions
  const { ctx, setCtx } = useDashboard()

  if (!opts.key) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">MultiSelect requires options.key</div>
  }
  const raw = opts.choices ?? []
  if (raw.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">MultiSelect requires options.choices</div>
  }
  const choices: Choice[] = raw.map(c =>
    typeof c === 'string' ? { value: c, label: c } : { value: c.value, label: c.label ?? c.value },
  )

  const stored = ctx[opts.key] != null
    ? ctx[opts.key].split(',').map(s => s.trim()).filter(Boolean)
    : opts.default ?? []
  const selected = new Set(stored)

  const toggle = (value: string) => {
    if (selected.has(value)) selected.delete(value)
    else selected.add(value)
    setCtx(opts.key!, Array.from(selected).join(','))
  }

  return (
    <div className="flex flex-col h-full justify-center gap-2 px-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">{opts.label ?? opts.key}</span>
        <span className="text-[10px] text-zinc-600">{selected.size} / {choices.length}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {choices.map(c => {
          const active = selected.has(c.value)
          return (
            <button
              key={c.value}
              onClick={() => toggle(c.value)}
              className={`px-2 py-0.5 text-xs rounded border ${
                active
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
