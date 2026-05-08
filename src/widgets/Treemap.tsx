import { useMemo } from 'react'
import {
  Treemap as ReTreemap,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { SEMANTIC, PALETTE } from './colors'
import type { WidgetProps } from '../types/template'

interface Node {
  name: string
  value?: number
  color?: string
  children?: Node[]
  // Recharts' TreemapDataType requires an index signature.
  [k: string]: unknown
}

// Generic proportional-rectangle viz. Same payload shape as
// Distribution, plus optional `children` for one level of hierarchy.
export function Treemap({ data }: WidgetProps) {
  const nodes = useMemo(() => normalize(data), [data])
  if (!nodes || nodes.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReTreemap
        data={nodes}
        dataKey="value"
        nameKey="name"
        stroke="#18181b"
        isAnimationActive={false}
        content={<Tile />}
      >
        <Tooltip
          contentStyle={{
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 6,
            fontSize: 12,
            color: '#fafafa',
          }}
          formatter={(v: unknown) => [String(v), '']}
        />
      </ReTreemap>
    </ResponsiveContainer>
  )
}

// Custom tile so we can colour from `payload.color` rather than the
// Recharts default depth-based palette.
interface TileProps {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  name?: string
  payload?: Node
}

function Tile(props: TileProps) {
  const { x = 0, y = 0, width = 0, height = 0, index = 0, name, payload } = props
  const color = resolveColor(payload, index)
  const showLabel = width > 60 && height > 24
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.85} stroke="#18181b" strokeWidth={2} />
      {showLabel && name && (
        <text x={x + 6} y={y + 16} fill="#fafafa" fontSize={11} style={{ pointerEvents: 'none' }}>
          {name}
        </text>
      )}
    </g>
  )
}

function resolveColor(node: Node | undefined, index: number): string {
  if (!node) return PALETTE[index % PALETTE.length]
  if (node.color && SEMANTIC[node.color]) return SEMANTIC[node.color]
  if (node.color && node.color.startsWith('#')) return node.color
  return PALETTE[index % PALETTE.length]
}

// Recharts wants `name` and `value` keys, plus optional `children`.
// We accept any of {label/name, value, color, children/slices}.
function normalize(data: unknown): Node[] | null {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) raw = data
  else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.slices)) raw = d.slices
    else if (Array.isArray(d.nodes)) raw = d.nodes
  }
  if (!raw) return null

  const map = (r: unknown): Node | null => {
    if (!r || typeof r !== 'object') return null
    const rr = r as Record<string, unknown>
    const name = String(rr.label ?? rr.name ?? '')
    const value = typeof rr.value === 'number' ? rr.value : undefined
    const color = rr.color != null ? String(rr.color) : undefined
    const childrenRaw = Array.isArray(rr.children) ? rr.children : Array.isArray(rr.slices) ? rr.slices : null
    const children = childrenRaw ? (childrenRaw.map(map).filter((n): n is Node => n != null)) : undefined
    if (!children && (!Number.isFinite(value) || (value ?? 0) <= 0)) return null
    return { name, value, color, children }
  }

  const nodes = raw.map(map).filter((n): n is Node => n != null)
  return nodes.length > 0 ? nodes : null
}
