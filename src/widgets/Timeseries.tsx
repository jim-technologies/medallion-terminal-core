import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { WidgetProps } from '../types/template'

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6']

export function Timeseries({ data }: WidgetProps) {
  const chart = normalize(data)
  if (!chart) return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chart.points}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="_ts"
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          tickFormatter={formatTimestamp}
        />
        <YAxis
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          tickFormatter={abbreviateNumber}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '0.375rem',
            fontSize: 12,
            color: '#fafafa',
          }}
          labelStyle={{ color: '#a1a1aa' }}
          labelFormatter={formatTimestamp}
        />
        {chart.keys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[i % COLORS.length]}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// --- data normalization ---

interface ChartData {
  points: Record<string, unknown>[]
  keys: string[]
}

const TS_KEYS = ['timestamp', 'date', 'time', 'datetime', 'ts', 'x', 't']

function findTimestampKey(obj: Record<string, unknown>): string | null {
  for (const k of TS_KEYS) {
    if (k in obj) return k
  }
  return null
}

function normalize(data: unknown): ChartData | null {
  if (!data) return null

  // Array of objects: auto-detect timestamp key and numeric value keys
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const sample = data[0] as Record<string, unknown>
    const tsKey = findTimestampKey(sample)
    if (!tsKey) return null

    const numericKeys = Object.keys(sample).filter(
      k => k !== tsKey && typeof sample[k] === 'number'
    )
    if (numericKeys.length === 0) return null

    const points = data.map(item => {
      const row = item as Record<string, unknown>
      const entry: Record<string, unknown> = { _ts: row[tsKey] }
      for (const k of numericKeys) entry[k] = row[k]
      return entry
    })

    return { points, keys: numericKeys }
  }

  // { series: [{ name, data: [{ timestamp, value }] }] }
  if (typeof data === 'object' && data !== null && 'series' in data) {
    const seriesArr = (data as Record<string, unknown>).series
    if (!Array.isArray(seriesArr)) return null

    const merged = new Map<string, Record<string, unknown>>()
    const keys: string[] = []

    for (const s of seriesArr) {
      const series = s as Record<string, unknown>
      const name = String(series.name || series.label || `s${keys.length}`)
      keys.push(name)
      const items = series.data as Record<string, unknown>[]
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

// --- formatting ---

function formatTimestamp(ts: unknown): string {
  if (ts == null) return ''
  try {
    const d = new Date(ts as string | number)
    if (isNaN(d.getTime())) return String(ts)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return String(ts)
  }
}

function abbreviateNumber(n: unknown): string {
  if (typeof n !== 'number') return String(n)
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(Number.isInteger(n) ? 0 : 2)
}
