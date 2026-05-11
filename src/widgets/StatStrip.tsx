import { useMemo } from 'react'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { formatStat } from './format'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

interface Stat {
  label: string
  value: number
  delta?: number
  unit?: string
  trend?: number[]
}

// Compact horizontal strip of metric cards. Same shape as a list of
// MetricPayloads — a backend that emits one is free to emit many.
export function StatStrip({ data }: WidgetProps) {
  const stats = useMemo(() => normalize(data), [data])
  if (!stats || stats.length === 0) {
    return <Empty>No data</Empty>
  }

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      <div className="flex items-stretch gap-3 h-full">
        {stats.map((s, i) => (
          <Card key={i} stat={s} />
        ))}
      </div>
    </div>
  )
}

function Card({ stat }: { stat: Stat }) {
  const animated = useAnimatedNumber(stat.value)
  const deltaColor = stat.delta == null
    ? ''
    : stat.delta >= 0 ? 'text-emerald-400' : 'text-red-400'
  return (
    <div className="shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 truncate">{stat.label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-base font-semibold text-zinc-100 tabular-nums truncate">
          {formatStat(animated)}
        </span>
        {stat.unit && <span className="text-[10px] text-zinc-500 shrink-0">{stat.unit}</span>}
      </div>
      <div className="flex items-center gap-2">
        {stat.delta != null && (
          <span className={`text-[10px] font-medium tabular-nums ${deltaColor}`}>
            {stat.delta >= 0 ? '▲' : '▼'} {formatDelta(stat.delta)}
          </span>
        )}
        {stat.trend && stat.trend.length >= 2 && <Spark values={stat.trend} />}
      </div>
    </div>
  )
}

function Spark({ values }: { values: number[] }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const up = values[values.length - 1] >= values[0]
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = 18 - ((v - min) / range) * 16 - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg viewBox="0 0 100 18" className="w-12 h-3.5" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={up ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function normalize(data: unknown): Stat[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) raw = data
  else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.stats)) raw = d.stats
    else if (Array.isArray(d.metrics)) raw = d.metrics
  }
  if (!raw) return null
  const stats: Stat[] = raw
    .map(s => {
      const ss = s as Record<string, unknown>
      return {
        label: String(ss.label ?? ''),
        value: Number(ss.value ?? 0),
        delta: typeof ss.delta === 'number' ? ss.delta : undefined,
        unit: ss.unit != null ? String(ss.unit) : undefined,
        trend: Array.isArray(ss.trend) && ss.trend.every(n => typeof n === 'number')
          ? (ss.trend as number[])
          : undefined,
      }
    })
    .filter(s => Number.isFinite(s.value))
  return stats.length > 0 ? stats : null
}

function formatDelta(d: number): string {
  const pct = Math.abs(d) <= 1 ? d * 100 : d
  return `${Math.abs(pct).toFixed(2)}%`
}
