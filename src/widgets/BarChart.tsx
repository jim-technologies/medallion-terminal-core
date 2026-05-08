import { useMemo } from 'react'
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { SEMANTIC } from './colors'
import type { WidgetProps } from '../types/template'

interface Bar {
  label: string
  value: number
  color?: string
}

export function BarChart({ data }: WidgetProps) {
  const bars = useMemo(() => normalize(data), [data])
  if (!bars || bars.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={bars} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="label"
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          interval={0}
        />
        <YAxis
          stroke="#3f3f46"
          tick={{ fontSize: 11, fill: '#a1a1aa' }}
          tickFormatter={abbreviate}
          width={50}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 6,
            fontSize: 12,
            color: '#fafafa',
          }}
          cursor={{ fill: 'rgba(82, 82, 91, 0.2)' }}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {bars.map((b, i) => <Cell key={i} fill={resolveColor(b)} />)}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  )
}

function normalize(data: unknown): Bar[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) raw = data
  else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.bars)) raw = d.bars
    else if (Array.isArray(d.rows)) raw = d.rows
  }
  if (!raw) return null
  const bars: Bar[] = raw
    .map(r => {
      const rr = r as Record<string, unknown>
      return {
        label: String(rr.label ?? rr.name ?? ''),
        value: Number(rr.value ?? 0),
        color: rr.color != null ? String(rr.color) : undefined,
      }
    })
    .filter(b => Number.isFinite(b.value))
  return bars.length > 0 ? bars : null
}

function resolveColor(b: Bar): string {
  if (b.color && SEMANTIC[b.color]) return SEMANTIC[b.color]
  if (b.color && b.color.startsWith('#')) return b.color
  // Auto: red for negative, sky for positive — matches money-direction intuition.
  return b.value < 0 ? '#ef4444' : '#38bdf8'
}

function abbreviate(n: number): string {
  if (typeof n !== 'number') return String(n)
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(Number.isInteger(n) ? 0 : 1)
}
