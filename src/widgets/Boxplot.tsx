import { useMemo } from 'react'
import { formatCompact } from './format'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

interface Box {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
}

const PADDING = { top: 12, right: 12, bottom: 28, left: 44 }
const BOX_PALETTE = ['#0ea5e9', '#10b981', '#a78bfa', '#f59e0b', '#f472b6', '#fbbf24']

// Boxplot widget: shows median + IQR + whiskers + outliers per category.
// Quants use this to compare distributions (returns by strategy, slippage
// by venue, PnL by hour-of-day, etc.) — same shape, different group labels.
//
// Accepts either:
//   [{ label, values: [...] }]                   — raw samples, auto-stat
//   [{ label, min, q1, median, q3, max, outliers? }] — pre-computed
export function Boxplot({ data }: WidgetProps) {
  const boxes = useMemo(() => normalize(data), [data])
  if (!boxes || boxes.length === 0) {
    return <Empty>No data</Empty>
  }

  // Y-axis range: extend slightly beyond outliers for breathing room.
  const allValues = boxes.flatMap(b => [b.min, b.max, ...b.outliers])
  const yMin = Math.min(...allValues)
  const yMax = Math.max(...allValues)
  const pad = (yMax - yMin) * 0.05 || 1
  const domainMin = yMin - pad
  const domainMax = yMax + pad

  // Tick values for y-axis (5 evenly spaced).
  const ticks = Array.from({ length: 5 }, (_, i) => domainMin + ((domainMax - domainMin) * i) / 4)

  return (
    <svg viewBox="0 0 600 320" className="w-full h-full" preserveAspectRatio="none">
      <BoxplotChart
        boxes={boxes}
        yMin={domainMin}
        yMax={domainMax}
        ticks={ticks}
        width={600}
        height={320}
      />
    </svg>
  )
}

function BoxplotChart({
  boxes, yMin, yMax, ticks, width, height,
}: { boxes: Box[]; yMin: number; yMax: number; ticks: number[]; width: number; height: number }) {
  const innerW = width - PADDING.left - PADDING.right
  const innerH = height - PADDING.top - PADDING.bottom
  const slot = innerW / boxes.length
  const boxW = Math.min(slot * 0.5, 60)

  const yPos = (v: number) => PADDING.top + (1 - (v - yMin) / (yMax - yMin)) * innerH

  return (
    <g>
      {/* Y gridlines + tick labels */}
      {ticks.map((t, i) => {
        const y = yPos(t)
        return (
          <g key={`g-${i}`}>
            <line x1={PADDING.left} x2={PADDING.left + innerW} y1={y} y2={y} stroke="#27272a" strokeDasharray="3 3" />
            <text x={PADDING.left - 6} y={y + 3} textAnchor="end" fontSize={10} fill="#a1a1aa" fontFamily="ui-sans-serif">
              {formatCompact(t)}
            </text>
          </g>
        )
      })}

      {/* Boxes */}
      {boxes.map((b, i) => {
        const cx = PADDING.left + slot * i + slot / 2
        const xLeft = cx - boxW / 2
        const color = BOX_PALETTE[i % BOX_PALETTE.length]
        const yMinV = yPos(b.min)
        const yMaxV = yPos(b.max)
        const yQ1 = yPos(b.q1)
        const yQ3 = yPos(b.q3)
        const yMed = yPos(b.median)
        return (
          <g key={i}>
            {/* Whisker line */}
            <line x1={cx} x2={cx} y1={yMinV} y2={yMaxV} stroke={color} strokeOpacity={0.6} />
            {/* Whisker caps */}
            <line x1={cx - boxW / 4} x2={cx + boxW / 4} y1={yMinV} y2={yMinV} stroke={color} strokeOpacity={0.8} />
            <line x1={cx - boxW / 4} x2={cx + boxW / 4} y1={yMaxV} y2={yMaxV} stroke={color} strokeOpacity={0.8} />
            {/* IQR box */}
            <rect x={xLeft} y={yQ3} width={boxW} height={Math.max(1, yQ1 - yQ3)} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
            {/* Median */}
            <line x1={xLeft} x2={xLeft + boxW} y1={yMed} y2={yMed} stroke={color} strokeWidth={2} />
            {/* Outliers */}
            {b.outliers.map((v, j) => (
              <circle key={j} cx={cx} cy={yPos(v)} r={2.5} fill={color} fillOpacity={0.7} />
            ))}
            {/* Label */}
            <text x={cx} y={height - 8} textAnchor="middle" fontSize={11} fill="#a1a1aa" fontFamily="ui-sans-serif">
              {b.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function normalize(data: unknown): Box[] | null {
  if (!Array.isArray(data) || data.length === 0) return null
  const boxes: Box[] = data
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const it = item as Record<string, unknown>
      const label = String(it.label ?? '')
      // Pre-computed
      if (typeof it.median === 'number') {
        return {
          label,
          min: Number(it.min ?? it.median),
          q1: Number(it.q1 ?? it.median),
          median: Number(it.median),
          q3: Number(it.q3 ?? it.median),
          max: Number(it.max ?? it.median),
          outliers: Array.isArray(it.outliers) ? it.outliers.filter(v => typeof v === 'number') as number[] : [],
        }
      }
      // Raw samples
      if (Array.isArray(it.values)) {
        const values = it.values.filter(v => typeof v === 'number' && Number.isFinite(v)) as number[]
        if (values.length === 0) return null
        return computeStats(label, values)
      }
      return null
    })
    .filter((b): b is Box => b != null)
  return boxes.length > 0 ? boxes : null
}

// Tukey's quartiles + 1.5×IQR outlier rule.
function computeStats(label: string, values: number[]): Box {
  const sorted = [...values].sort((a, b) => a - b)
  const q = (p: number) => {
    const idx = (sorted.length - 1) * p
    const lo = Math.floor(idx)
    const hi = Math.ceil(idx)
    return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
  }
  const q1 = q(0.25)
  const median = q(0.5)
  const q3 = q(0.75)
  const iqr = q3 - q1
  const fenceLow = q1 - 1.5 * iqr
  const fenceHigh = q3 + 1.5 * iqr
  const outliers: number[] = []
  let min = Infinity
  let max = -Infinity
  for (const v of sorted) {
    if (v < fenceLow || v > fenceHigh) outliers.push(v)
    else { if (v < min) min = v; if (v > max) max = v }
  }
  if (!Number.isFinite(min)) min = sorted[0]
  if (!Number.isFinite(max)) max = sorted[sorted.length - 1]
  return { label, min, q1, median, q3, max, outliers }
}

