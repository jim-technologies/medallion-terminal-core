import { useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as ReRadar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#a78bfa', '#f472b6', '#fbbf24']

interface ChartData {
  rows: Record<string, unknown>[]
  series: string[]
}

// Multi-metric radar (a.k.a. spider chart). Use for comparing N
// entities across M metrics: strategies × {Sharpe, DD, Vol, IC, ...},
// models × {accuracy, precision, recall, ...}, etc.
export function Radar({ data }: WidgetProps) {
  const chart = useMemo(() => normalize(data), [data])
  if (!chart) return <Empty>No data</Empty>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chart.rows} outerRadius="75%">
        <PolarGrid stroke="#27272a" />
        <PolarAngleAxis dataKey="metric" stroke="#3f3f46" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
        <PolarRadiusAxis stroke="#3f3f46" tick={{ fontSize: 9, fill: '#52525b' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 6,
            fontSize: 12,
            color: '#fafafa',
          }}
        />
        {chart.series.length > 1 && (
          <Legend wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }} />
        )}
        {chart.series.map((s, i) => (
          <ReRadar
            key={s}
            name={s}
            dataKey={s}
            stroke={COLORS[i % COLORS.length]}
            fill={COLORS[i % COLORS.length]}
            fillOpacity={0.25}
            strokeWidth={1.5}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  )
}

function normalize(data: unknown): ChartData | null {
  // Wide form: [{metric, A, B, ...}]
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const sample = data[0] as Record<string, unknown>
    if (typeof sample.metric === 'string') {
      const series = Object.keys(sample).filter(k => k !== 'metric' && typeof sample[k] === 'number')
      if (series.length === 0) return null
      return { rows: data as Record<string, unknown>[], series }
    }
  }
  // Long form: {metrics: [...], series: [{name, values: [...]}]}
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    const metrics = Array.isArray(d.metrics) ? d.metrics.map(String) : null
    const seriesArr = Array.isArray(d.series) ? d.series : null
    if (!metrics || !seriesArr) return null
    const series = seriesArr.map(s => String((s as Record<string, unknown>).name ?? '')).filter(Boolean)
    const rows = metrics.map((metric, i) => {
      const row: Record<string, unknown> = { metric }
      for (const s of seriesArr) {
        const ss = s as Record<string, unknown>
        const name = String(ss.name ?? '')
        const values = ss.values
        if (Array.isArray(values) && typeof values[i] === 'number') {
          row[name] = values[i]
        }
      }
      return row
    })
    return { rows, series }
  }
  return null
}
