import { useEffect, useRef, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'

interface SliderOptions {
  key?: string
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  default?: number
}

const DEBOUNCE_MS = 100

// Numeric input that writes to ctx. Useful for "filter widgets by
// threshold X" patterns: lookback window, confidence cutoff, position
// size, anything continuous. Bound widgets see the change via
// `${ctx.<key>}` substitution and re-fetch.
export function Slider({ options }: WidgetProps) {
  const opts = (options ?? {}) as SliderOptions
  const { ctx, setCtx } = useDashboard()
  const min = opts.min ?? 0
  const max = opts.max ?? 100
  const step = opts.step ?? 1
  const label = opts.label ?? opts.key ?? 'value'

  const initial = (() => {
    if (opts.key && ctx[opts.key] != null) {
      const n = Number(ctx[opts.key])
      if (Number.isFinite(n)) return n
    }
    if (opts.default != null) return opts.default
    return min
  })()
  const [value, setValue] = useState(initial)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pull external ctx changes back into the slider (Cmd+K, URL load).
  useEffect(() => {
    if (!opts.key) return
    const fromCtx = ctx[opts.key]
    if (fromCtx == null) return
    const n = Number(fromCtx)
    if (Number.isFinite(n) && n !== value) setValue(n)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.key, ctx[opts.key ?? '']])

  if (!opts.key) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Slider requires options.key
      </div>
    )
  }

  const onChange = (next: number) => {
    setValue(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setCtx(opts.key!, String(next))
    }, DEBOUNCE_MS)
  }

  return (
    <div className="flex flex-col h-full justify-center gap-2 px-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
        <span className="text-sm font-semibold text-zinc-100 tabular-nums">
          {format(value, step)}{opts.unit && <span className="text-zinc-500 ml-1">{opts.unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-sky-500"
      />
      <div className="flex justify-between text-[10px] text-zinc-600 tabular-nums">
        <span>{format(min, step)}</span>
        <span>{format(max, step)}</span>
      </div>
    </div>
  )
}

function format(n: number, step: number): string {
  // Show decimals proportional to step size, capped at 4.
  const decimals = step >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(step)))
  return n.toFixed(decimals)
}
