import { useMemo } from 'react'
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
} from 'recharts'
import { abbreviateAxis, formatTimestamp } from './format'
import { TOOLTIP_STYLE } from './colors'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

// Local line palette, shared byte-for-byte with Timeseries and
// intentionally distinct from the categorical `PALETTE` (colors.ts):
// lighter hues for thin strokes/fills on dark. See CONVENTIONS.md
// "Palette decision". Do not replace with PALETTE — visual change.
const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6']
const GRID = 'var(--mtc-grid)'
const AXIS = 'var(--mtc-border)'
const TICK = 'var(--mtc-muted)'
const CHART_BG = 'var(--mtc-surface)'

interface ChartData {
  points: Record<string, unknown>[]
  keys: string[]
}

const TS_KEYS = ['timestamp', 'date', 'time', 'datetime', 'ts', 'x', 't']

// Stacked filled timeseries. Same payload shape as `timeseries`; auto-
// stacks when there are multiple series. Use for cumulative breakdowns
// over time (portfolio composition, allocation drift, energy mix).
export function AreaChart({ data, options }: WidgetProps) {
  const chart = useMemo(() => normalize(data), [data])
  const showBrush = options?.brush === true
  if (!chart) return <Empty>No data</Empty>

  const stack = chart.keys.length > 1

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReAreaChart data={chart.points}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis
          dataKey="_ts"
          stroke={AXIS}
          tick={{ fontSize: 11, fill: TICK }}
          tickFormatter={formatTimestamp}
        />
        <YAxis
          stroke={AXIS}
          tick={{ fontSize: 11, fill: TICK }}
          tickFormatter={abbreviateAxis}
          width={50}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={{ color: TICK }}
          labelFormatter={formatTimestamp}
        />
        {chart.keys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.35}
            strokeWidth={1.5}
            stackId={stack ? 'stack' : undefined}
          />
        ))}
        {showBrush && chart.points.length > 4 && (
          <Brush
            dataKey="_ts"
            height={20}
            stroke={AXIS}
            fill={CHART_BG}
            travellerWidth={6}
            tickFormatter={formatTimestamp}
          />
        )}
      </ReAreaChart>
    </ResponsiveContainer>
  )
}

function findTimestampKey(obj: Record<string, unknown>): string | null {
  for (const k of TS_KEYS) if (k in obj) return k
  return null
}

function normalize(data: unknown): ChartData | null {
  if (!data) return null

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const sample = data[0] as Record<string, unknown>
    const tsKey = findTimestampKey(sample)
    if (!tsKey) return null
    const numericKeys = Object.keys(sample).filter(k => k !== tsKey && typeof sample[k] === 'number')
    if (numericKeys.length === 0) return null
    const points = data.map(item => {
      const row = item as Record<string, unknown>
      const entry: Record<string, unknown> = { _ts: row[tsKey] }
      for (const k of numericKeys) entry[k] = row[k]
      return entry
    })
    return { points, keys: numericKeys }
  }

  if (typeof data === 'object' && data !== null && 'series' in data) {
    const seriesArr = (data as Record<string, unknown>).series
    if (!Array.isArray(seriesArr)) return null
    const merged = new Map<string, Record<string, unknown>>()
    const keys: string[] = []
    for (const s of seriesArr) {
      const series = s as Record<string, unknown>
      const name = String(series.name || series.label || `s${keys.length}`)
      keys.push(name)
      const items = (series.data ?? series.points) as Record<string, unknown>[]
      if (!Array.isArray(items)) continue
      for (const pt of items) {
        const ts = String(pt.timestamp ?? pt.date ?? pt.time ?? pt.x ?? '')
        if (!merged.has(ts)) merged.set(ts, { _ts: ts })
        merged.get(ts)![name] = pt.value ?? pt.y ?? pt.v
      }
    }
    return { points: Array.from(merged.values()), keys }
  }

  return null
}
