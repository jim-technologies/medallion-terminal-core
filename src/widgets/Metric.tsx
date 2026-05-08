import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { formatStat } from './format'
import type { WidgetProps } from '../types/template'

export function Metric({ data }: WidgetProps) {
  const { value, delta, unit, label, trend } = normalize(data)
  const animated = useAnimatedNumber(value)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <div className="text-3xl font-bold text-white tabular-nums">
        {formatStat(animated)}
        {unit && <span className="text-base font-normal text-zinc-400 ml-1">{unit}</span>}
      </div>
      {delta != null && (
        <div className={`text-sm font-medium ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {delta >= 0 ? '\u25B2' : '\u25BC'} {formatDelta(delta)}
        </div>
      )}
      {trend && trend.length >= 2 && <Sparkline values={trend} />}
      {label && <div className="text-xs text-zinc-500">{label}</div>}
    </div>
  )
}

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const up = values[values.length - 1] >= values[0]
  const color = up ? '#10b981' : '#ef4444'
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 18 - ((v - min) / range) * 16 - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg viewBox="0 0 100 18" className="w-full max-w-[120px] h-5" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function normalize(data: unknown): { value: number; delta?: number; unit?: string; label?: string; trend?: number[] } {
  if (typeof data === 'number') return { value: data }
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    return {
      value: Number(d.value ?? 0),
      delta: d.delta != null ? Number(d.delta) : undefined,
      unit: d.unit != null ? String(d.unit) : undefined,
      label: d.label != null ? String(d.label) : undefined,
      trend: Array.isArray(d.trend) && d.trend.every(n => typeof n === 'number')
        ? (d.trend as number[])
        : undefined,
    }
  }
  return { value: 0 }
}

// delta in proto is a fraction (0.0218 = +2.18%). Display as percentage.
// Falls back to gracefully formatting raw values that exceed |1| in case
// callers send the percentage directly.
function formatDelta(d: number): string {
  const pct = Math.abs(d) <= 1 ? d * 100 : d
  return `${Math.abs(pct).toFixed(2)}%`
}

