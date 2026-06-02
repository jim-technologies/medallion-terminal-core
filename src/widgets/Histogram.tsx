import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { formatCompact } from './format'
import { TOOLTIP_STYLE } from './colors'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

const DEFAULT_BINS = 20

interface Bucket { bin: string; count: number; rangeStart: number; rangeEnd: number }

// Distribution viz: bins a numeric series and renders bar heights as
// counts. Generic — used for returns, latencies, sizes, confidence
// scores, anything where "what's the spread?" is the question.
//
// Accepted data forms:
//   [1.2, -0.3, 0.5, ...]                        → raw values
//   { values: [...], bins?: 20 }                 → values + bin override
//   [{ bin: "0..1", count: 12 }]                 → pre-binned
export function Histogram({ data, options }: WidgetProps) {
  const buckets = useMemo(() => normalize(data, options), [data, options])
  if (!buckets || buckets.length === 0) {
    return <Empty>No data</Empty>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={buckets} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="bin"
          stroke="#3f3f46"
          tick={{ fontSize: 10, fill: '#a1a1aa' }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          allowDecimals={false}
          width={40}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(82, 82, 91, 0.2)' }}
        />
        <Bar dataKey="count" fill="#0ea5e9" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function normalize(data: unknown, options?: Record<string, unknown>): Bucket[] | null {
  // Already-binned: [{bin, count}]
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const sample = data[0] as Record<string, unknown>
    if ('count' in sample) {
      return data
        .map(d => {
          const dd = d as Record<string, unknown>
          const start = typeof dd.rangeStart === 'number' ? dd.rangeStart : 0
          const end = typeof dd.rangeEnd === 'number' ? dd.rangeEnd : 0
          return {
            bin: String(dd.bin ?? ''),
            count: Number(dd.count ?? 0),
            rangeStart: start,
            rangeEnd: end,
          }
        })
        .filter(b => Number.isFinite(b.count))
    }
  }

  // Raw values: array of numbers, or { values: [...], bins?: N }
  let values: number[] | null = null
  let binCount = DEFAULT_BINS
  if (Array.isArray(data) && data.every(v => typeof v === 'number')) {
    values = data as number[]
  } else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.values) && d.values.every(v => typeof v === 'number')) {
      values = d.values as number[]
    }
    if (typeof d.bins === 'number') binCount = d.bins
  }
  if (typeof options?.bins === 'number') binCount = options.bins as number

  if (!values) return null
  values = values.filter(v => Number.isFinite(v))
  if (values.length === 0) return null

  return bin(values, binCount)
}

function bin(values: number[], n: number): Bucket[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return [{ bin: formatCompact(min), count: values.length, rangeStart: min, rangeEnd: max }]

  const step = (max - min) / n
  const buckets: Bucket[] = Array.from({ length: n }, (_, i) => {
    const start = min + i * step
    const end = i === n - 1 ? max : start + step
    return { bin: formatCompact((start + end) / 2), count: 0, rangeStart: start, rangeEnd: end }
  })
  for (const v of values) {
    let idx = Math.floor((v - min) / step)
    if (idx >= n) idx = n - 1
    buckets[idx].count += 1
  }
  return buckets
}

