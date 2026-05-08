import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { resolveColor } from './colors'
import type { WidgetProps } from '../types/template'

interface Slice { label: string; value: number; color?: string }

export function Distribution({ data }: WidgetProps) {
  const norm = useMemo(() => normalize(data), [data])
  if (!norm) return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>

  const { slices, total } = norm
  const colors = slices.map((s, i) => resolveColor(s.color, i))

  const top = slices.reduce((a, b) => (b.value > a.value ? b : a))
  const topPct = (top.value / total) * 100

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="60%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((_, i) => <Cell key={i} fill={colors[i]} />)}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: 6,
                fontSize: 12,
                color: '#fafafa',
              }}
              formatter={(v) => {
                const n = Number(v) || 0
                return [`${formatNumber(n)} (${((n / total) * 100).toFixed(1)}%)`, '']
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 truncate max-w-[60%]">{top.label}</div>
          <div className="text-2xl font-bold text-white tabular-nums">{topPct.toFixed(1)}%</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: colors[i] }} />
            <span className="text-zinc-300 truncate">{s.label}</span>
            <span className="text-zinc-500 ml-auto tabular-nums shrink-0">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function normalize(data: unknown): { slices: Slice[]; total: number } | null {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>
  const raw = Array.isArray(d.slices) ? d.slices : null
  if (!raw) return null
  const slices: Slice[] = raw
    .map(s => {
      const ss = s as Record<string, unknown>
      return {
        label: String(ss.label ?? ''),
        value: Number(ss.value ?? 0),
        color: ss.color != null ? String(ss.color) : undefined,
      }
    })
    .filter(s => s.value > 0)
  if (slices.length === 0) return null
  const explicit = typeof d.total === 'number' ? d.total : null
  const total = explicit ?? slices.reduce((a, b) => a + b.value, 0)
  return { slices, total }
}

function formatNumber(n: number): string {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}
