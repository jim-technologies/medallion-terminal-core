import { useMemo, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot, ReferenceLine, ReferenceArea, Brush,
} from 'recharts'
import { useHover } from '../core/HoverContext'
import { abbreviateAxis, formatTimestamp } from './format'
import { TOOLTIP_STYLE } from './colors'
import { Empty } from './states'
import type { WidgetProps } from '../types/template'

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6']

const ANN_COLOR: Record<string, string> = {
  buy:  '#10b981',
  sell: '#ef4444',
  info: '#0ea5e9',
  warn: '#f59e0b',
}

interface Annotation {
  timestamp: string
  endTimestamp?: string
  value?: number
  label: string
  kind?: string
  color?: string
}

export function Timeseries({ data, options }: WidgetProps) {
  const { hoverTime, setHoverTime } = useHover()
  const lastEmitted = useRef<string | null>(null)
  const chart = useMemo(() => normalize(data), [data])
  const showBrush = options?.brush === true
  if (!chart) return <Empty>No data</Empty>

  // Only render the sync line when the hover came from a different widget.
  const showSyncLine = hoverTime != null && hoverTime !== lastEmitted.current

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chart.points}
        onMouseMove={state => {
          const lbl = state?.activeLabel
          if (lbl != null) {
            const s = String(lbl)
            lastEmitted.current = s
            setHoverTime(s)
          }
        }}
        onMouseLeave={() => {
          lastEmitted.current = null
          setHoverTime(null)
        }}
      >
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
          tickFormatter={abbreviateAxis}
          width={60}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
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
        {showBrush && chart.points.length > 4 && (
          <Brush
            dataKey="_ts"
            height={20}
            stroke="#3f3f46"
            fill="#18181b"
            travellerWidth={6}
            tickFormatter={formatTimestamp}
          />
        )}
        {showSyncLine && (
          <ReferenceLine x={hoverTime} stroke="#52525b" strokeDasharray="3 3" />
        )}
        {chart.annotations.map((a, i) => {
          const color = a.color ?? (a.kind ? ANN_COLOR[a.kind] : null) ?? '#a1a1aa'
          // Range (band) annotation when both endpoints are present.
          if (a.endTimestamp) {
            const [x1, x2] = a.timestamp <= a.endTimestamp
              ? [a.timestamp, a.endTimestamp]
              : [a.endTimestamp, a.timestamp]
            return (
              <ReferenceArea
                key={i}
                x1={x1}
                x2={x2}
                fill={color}
                fillOpacity={0.1}
                stroke={color}
                strokeOpacity={0.4}
                strokeDasharray="3 3"
                label={{ value: a.label, position: 'insideTopLeft', fontSize: 10, fill: color }}
              />
            )
          }
          // Point annotation requires a y to render.
          if (a.value === undefined) return null
          return (
            <ReferenceDot
              key={i}
              x={a.timestamp}
              y={a.value}
              r={6}
              fill={color}
              stroke="#18181b"
              strokeWidth={2}
              ifOverflow="extendDomain"
              shape={(props) => <AnnotationGlyph {...props} kind={a.kind} color={color} label={a.label} />}
            />
          )
        })}
      </LineChart>
    </ResponsiveContainer>
  )
}

// SVG glyph for a single annotation. Triangle for buy/sell, dot otherwise.
// The label is exposed via <title> for native browser tooltip.
function AnnotationGlyph({ cx, cy, kind, color, label }: { cx?: number; cy?: number; kind?: string; color: string; label: string }) {
  if (cx == null || cy == null) return null
  let path: string
  if (kind === 'buy') {
    path = `M${cx} ${cy - 7} L${cx + 6} ${cy + 4} L${cx - 6} ${cy + 4} Z`
  } else if (kind === 'sell') {
    path = `M${cx} ${cy + 7} L${cx + 6} ${cy - 4} L${cx - 6} ${cy - 4} Z`
  } else {
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={color} stroke="#18181b" strokeWidth={2}>
          <title>{label}</title>
        </circle>
      </g>
    )
  }
  return (
    <g>
      <path d={path} fill={color} stroke="#18181b" strokeWidth={1.5}>
        <title>{label}</title>
      </path>
    </g>
  )
}

// --- data normalization ---

interface ChartData {
  points: Record<string, unknown>[]
  keys: string[]
  annotations: Annotation[]
}

const TS_KEYS = ['timestamp', 'date', 'time', 'datetime', 'ts', 'x', 't']

function findTimestampKey(obj: Record<string, unknown>): string | null {
  for (const k of TS_KEYS) {
    if (k in obj) return k
  }
  return null
}

function readAnnotations(data: unknown): Annotation[] {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return []
  const raw = (data as Record<string, unknown>).annotations
  if (!Array.isArray(raw)) return []
  return raw.map(a => {
    const aa = a as Record<string, unknown>
    return {
      timestamp: String(aa.timestamp ?? ''),
      endTimestamp: aa.end_timestamp != null
        ? String(aa.end_timestamp)
        : aa.endTimestamp != null ? String(aa.endTimestamp) : undefined,
      value: typeof aa.value === 'number' ? aa.value : undefined,
      label: String(aa.label ?? ''),
      kind: aa.kind != null ? String(aa.kind) : undefined,
      color: aa.color != null ? String(aa.color) : undefined,
    }
  })
}

function normalize(data: unknown): ChartData | null {
  if (!data) return null
  const annotations = readAnnotations(data)

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

    return { points, keys: numericKeys, annotations }
  }

  // { points: [...] } — canonical TimeseriesPayload shorthand form
  if (typeof data === 'object' && data !== null && 'points' in data) {
    const pointsArr = (data as Record<string, unknown>).points
    if (!Array.isArray(pointsArr) || pointsArr.length === 0) return null
    const points = pointsArr.map(p => {
      const pp = p as Record<string, unknown>
      return { _ts: pp.timestamp ?? pp.date ?? pp.time ?? pp.x, value: pp.value ?? pp.y ?? pp.v }
    })
    return { points, keys: ['value'], annotations }
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
      const items = (series.data ?? series.points) as Record<string, unknown>[]
      if (!Array.isArray(items)) continue
      for (const pt of items) {
        const ts = String(pt.timestamp ?? pt.date ?? pt.time ?? pt.x ?? '')
        if (!merged.has(ts)) merged.set(ts, { _ts: ts })
        merged.get(ts)![name] = pt.value ?? pt.y ?? pt.v
      }
    }

    return { points: Array.from(merged.values()), keys, annotations }
  }

  return null
}

