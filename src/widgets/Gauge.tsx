import type { WidgetProps } from '../types/template'

const COLORS: Record<string, string> = {
  ok:     '#10b981',
  warn:   '#f59e0b',
  danger: '#ef4444',
  error:  '#ef4444',
  info:   '#0ea5e9',
  muted:  '#71717a',
}

interface Band { from: number; to: number; color: string }
interface GaugeData {
  value: number
  min: number
  max: number
  label?: string
  bands: Band[]
}

const ARC_PATH = 'M 16 104 A 84 84 0 0 1 184 104'

export function Gauge({ data }: WidgetProps) {
  const g = normalize(data)
  if (!g) return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>

  const range = g.max - g.min
  const progress = range > 0 ? Math.max(0, Math.min(1, (g.value - g.min) / range)) : 0
  const activeBand = g.bands.find(b => g.value >= b.from && g.value <= b.to)
  const accent = COLORS[activeBand?.color ?? 'info'] ?? COLORS.info

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <svg viewBox="0 0 200 120" className="w-full max-w-[260px]">
        <path d={ARC_PATH} fill="none" stroke="#27272a" strokeWidth="16" pathLength="100" />
        {g.bands.map((b, i) => {
          const f = (b.from - g.min) / range
          const t = (b.to - g.min) / range
          return (
            <path
              key={i}
              d={ARC_PATH}
              fill="none"
              stroke={COLORS[b.color] ?? COLORS.muted}
              strokeWidth="16"
              opacity={0.22}
              pathLength="100"
              strokeDasharray={`${(t - f) * 100} 100`}
              strokeDashoffset={-f * 100}
            />
          )
        })}
        <path
          d={ARC_PATH}
          fill="none"
          stroke={accent}
          strokeWidth="16"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${progress * 100} 100`}
        />
        <text
          x="100"
          y="92"
          textAnchor="middle"
          fill="#fafafa"
          style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
        >
          {formatValue(g.value, g.min, g.max)}
        </text>
      </svg>
      {g.label && (
        <div className="text-xs text-zinc-500 text-center px-2 truncate max-w-full">{g.label}</div>
      )}
    </div>
  )
}

function normalize(data: unknown): GaugeData | null {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>
  if (typeof d.value !== 'number') return null
  const min = typeof d.min === 'number' ? d.min : 0
  const max = typeof d.max === 'number' ? d.max : 1
  const bands: Band[] = Array.isArray(d.bands)
    ? d.bands.map(b => {
        const bb = b as Record<string, unknown>
        return {
          from: Number(bb.from ?? 0),
          to: Number(bb.to ?? 0),
          color: String(bb.color ?? 'info'),
        }
      })
    : []
  return {
    value: d.value,
    min,
    max,
    bands,
    label: d.label != null ? String(d.label) : undefined,
  }
}

function formatValue(v: number, min: number, max: number): string {
  if (min === 0 && max === 1) return `${(v * 100).toFixed(1)}%`
  if (min === -1 && max === 1) return v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 })
}
