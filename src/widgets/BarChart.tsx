import { useMemo } from 'react'
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { PALETTE, SEMANTIC, TOOLTIP_STYLE, assignSeriesColors } from './colors'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'
import { normalizeBars, type SingleBar } from './barNormalize'

const GRID = 'var(--mtc-grid)'
const AXIS = 'var(--mtc-border)'
const TICK = 'var(--mtc-muted)'
const CURSOR = 'color-mix(in oklab, var(--mtc-muted) 20%, transparent)'

export function BarChart({ data }: WidgetProps) {
  const normalized = useMemo(() => normalizeBars(data), [data])
  if (!normalized) {
    return <Empty>No data</Empty>
  }

  if (normalized.kind === 'grouped') {
    const seriesColors = assignSeriesColors(normalized.series, PALETTE)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={normalized.rows} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis
            dataKey="label"
            stroke={AXIS}
            tick={{ fontSize: 11, fill: TICK }}
            interval={0}
          />
          <YAxis
            stroke={AXIS}
            tick={{ fontSize: 11, fill: TICK }}
            tickFormatter={abbreviate}
            width={50}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: CURSOR }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {normalized.series.map((s, i) => (
            <Bar
              key={s}
              dataKey={s}
              fill={seriesColors[i]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    )
  }

  const bars = normalized.bars
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={bars} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis
          dataKey="label"
          stroke={AXIS}
          tick={{ fontSize: 11, fill: TICK }}
          interval={0}
        />
        <YAxis
          stroke={AXIS}
          tick={{ fontSize: 11, fill: TICK }}
          tickFormatter={abbreviate}
          width={50}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: CURSOR }}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {bars.map((b, i) => <Cell key={i} fill={resolveColor(b)} />)}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  )
}

function resolveColor(b: SingleBar): string {
  if (b.color && SEMANTIC[b.color]) return SEMANTIC[b.color]
  if (b.color && b.color.startsWith('#')) return b.color
  // Auto: red for negative, sky for positive — matches money-direction intuition.
  return b.value < 0 ? 'var(--mtc-danger)' : 'var(--mtc-accent)'
}

// Local tick formatter, intentionally distinct from the shared
// `abbreviateAxis` (format.ts): bars use 1dp for sub-1e3 non-integers
// (cleaner for counts/totals) where abbreviateAxis uses 2dp. See
// CONVENTIONS.md "Abbreviate decision" — do not swap; it changes ticks.
function abbreviate(n: number): string {
  if (typeof n !== 'number') return String(n)
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(Number.isInteger(n) ? 0 : 1)
}
