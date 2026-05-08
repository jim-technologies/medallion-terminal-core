import { useMemo } from 'react'
import {
  ScatterChart,
  Scatter as ReScatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { SEMANTIC } from './colors'
import type { WidgetProps } from '../types/template'

interface Point {
  x: number
  y: number
  label?: string
  size?: number
  color?: string
}

// Generic scatter chart. Use for risk/reward, IV/delta, factor exposure,
// any (x, y) cloud with optional size and color encodings.
export function Scatter({ data }: WidgetProps) {
  const points = useMemo(() => normalize(data), [data])
  if (!points || points.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  const hasSize = points.some(p => p.size != null)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          type="number"
          dataKey="x"
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
        />
        <YAxis
          type="number"
          dataKey="y"
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          width={50}
        />
        {hasSize && <ZAxis type="number" dataKey="size" range={[40, 280]} />}
        <Tooltip
          cursor={{ strokeDasharray: '3 3', stroke: '#52525b' }}
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 6,
            fontSize: 12,
            color: '#fafafa',
          }}
        />
        <ReScatter
          data={points}
          fill="#0ea5e9"
          shape={(props: { cx?: number; cy?: number; payload?: Point }) => {
            const { cx, cy, payload } = props
            if (cx == null || cy == null || !payload) return <circle cx={0} cy={0} r={0} />
            const fill = resolveColor(payload)
            const r = payload.size != null ? Math.max(3, Math.sqrt(payload.size) * 2) : 5
            return (
              <g>
                <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.7} stroke={fill} strokeWidth={1}>
                  {payload.label && <title>{payload.label}</title>}
                </circle>
              </g>
            )
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

function normalize(data: unknown): Point[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) raw = data
  else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.points)) raw = d.points
  }
  if (!raw) return null
  const points: Point[] = raw
    .map(p => {
      const pp = p as Record<string, unknown>
      return {
        x: Number(pp.x ?? 0),
        y: Number(pp.y ?? 0),
        label: pp.label != null ? String(pp.label) : undefined,
        size: typeof pp.size === 'number' ? pp.size : undefined,
        color: pp.color != null ? String(pp.color) : undefined,
      }
    })
    .filter(p => Number.isFinite(p.x) && Number.isFinite(p.y))
  return points.length > 0 ? points : null
}

function resolveColor(p: Point): string {
  if (p.color && SEMANTIC[p.color]) return SEMANTIC[p.color]
  if (p.color && p.color.startsWith('#')) return p.color
  return '#0ea5e9'
}
