import { useMemo } from 'react'
import type { WidgetProps } from '../types/template'

interface SparkOptions {
  // Force a color regardless of trend direction. Otherwise the line
  // colours green when the last value ≥ first, red when below.
  color?: string
}

// Standalone sparkline: just the line, no axes, no labels. Distinct
// from `metric.trend` (decoration on a number) — this is a primitive
// that fits the "tiny chart" cells, header strips, status rows, etc.
//
// Accepts:
//   [42, 43, 41, ...]                            — bare values
//   { values: [...] }                            — explicit
//   [{ value: 42 }, { value: 43 }, ...]          — object form
export function Sparkline({ data, options }: WidgetProps) {
  const opts = (options ?? {}) as SparkOptions
  const values = useMemo(() => normalize(data), [data])

  if (!values || values.length < 2) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const up = values[values.length - 1] >= values[0]
  const color = opts.color ?? (up ? '#10b981' : '#ef4444')

  // Path: 100×24 viewBox, scaled by `preserveAspectRatio="none"` so
  // it fills any widget shape. vector-effect keeps the stroke crisp.
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 22 - ((v - min) / range) * 20 - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="h-full w-full flex items-center justify-center">
      <svg viewBox="0 0 100 24" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

function normalize(data: unknown): number[] | null {
  if (Array.isArray(data)) {
    if (data.every(v => typeof v === 'number')) return data as number[]
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      return data
        .map(v => {
          const r = v as Record<string, unknown>
          return typeof r.value === 'number' ? r.value : Number(r.y ?? r.v ?? NaN)
        })
        .filter(n => Number.isFinite(n))
    }
  }
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.values) && d.values.every(v => typeof v === 'number')) {
      return d.values as number[]
    }
  }
  return null
}
