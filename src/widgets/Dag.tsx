import { useMemo } from 'react'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

interface Node {
  id: string
  label: string
  status?: string
}

interface Edge {
  from: string
  to: string
}

interface DagData {
  nodes: Node[]
  edges: Edge[]
}

const STATUS_COLOR: Record<string, string> = {
  ok:                  '#10b981',
  EVENT_STATUS_OK:     '#10b981',
  warn:                '#f59e0b',
  EVENT_STATUS_WARN:   '#f59e0b',
  error:               '#ef4444',
  EVENT_STATUS_ERROR:  '#ef4444',
  info:                '#0ea5e9',
  EVENT_STATUS_INFO:   '#0ea5e9',
  pending:             '#71717a',
  EVENT_STATUS_PENDING:'#71717a',
  running:             '#0ea5e9',
}
const DEFAULT_NODE = '#52525b'

const NODE_W = 130
const NODE_H = 44
const RANK_GAP = 80
const NODE_GAP = 18
const PAD = 16

// Generic DAG (directed acyclic graph) viz. Use for workflow / pipeline /
// dependency visualisations: Dagster asset graphs, Airflow DAGs, Temporal
// child workflows, build-system dependency trees, etc.
//
// Layout: longest-path layered top-to-bottom (or left-to-right when wider
// than tall). Nodes within a layer are spaced evenly. Edges drawn as
// straight lines with a small terminal arrow.
//
// Data shape:
//   { nodes: [{id, label, status?}], edges: [{from, to}] }
export function Dag({ data }: WidgetProps) {
  const laid = useMemo(() => layout(normalize(data)), [data])
  if (!laid) return <Empty>No data</Empty>

  return (
    <div className="h-full w-full overflow-auto">
      <svg
        viewBox={`0 0 ${laid.width} ${laid.height}`}
        width={laid.width}
        height={laid.height}
        style={{ display: 'block' }}
      >
        <defs>
          <marker id="dag-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,8 L8,4 z" fill="#52525b" />
          </marker>
        </defs>
        {laid.edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#3f3f46" strokeWidth={1.5}
            markerEnd="url(#dag-arrow)"
          />
        ))}
        {laid.nodes.map(n => {
          const fill = n.status ? STATUS_COLOR[n.status] ?? DEFAULT_NODE : DEFAULT_NODE
          return (
            <g key={n.id}>
              <rect
                x={n.x} y={n.y} width={NODE_W} height={NODE_H}
                rx={6} ry={6}
                fill="#18181b" stroke={fill} strokeWidth={2}
              />
              <text
                x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + 4}
                textAnchor="middle"
                fontSize={11} fill="#fafafa"
                fontFamily="ui-sans-serif"
              >
                {truncate(n.label, 18)}
              </text>
              <circle cx={n.x + 8} cy={n.y + 8} r={3} fill={fill} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

function normalize(data: unknown): DagData | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const d = data as Record<string, unknown>
  const nodesRaw = Array.isArray(d.nodes) ? d.nodes : null
  const edgesRaw = Array.isArray(d.edges) ? d.edges : []
  if (!nodesRaw) return null
  const nodes: Node[] = nodesRaw.map(n => {
    const nn = n as Record<string, unknown>
    return {
      id: String(nn.id ?? ''),
      label: String(nn.label ?? nn.id ?? ''),
      status: nn.status != null ? String(nn.status) : undefined,
    }
  }).filter(n => n.id)
  const edges: Edge[] = edgesRaw.map(e => {
    const ee = e as Record<string, unknown>
    return { from: String(ee.from ?? ''), to: String(ee.to ?? '') }
  }).filter(e => e.from && e.to)
  return { nodes, edges }
}

interface LaidOut {
  nodes: Array<Node & { x: number; y: number }>
  edges: Array<{ x1: number; y1: number; x2: number; y2: number }>
  width: number
  height: number
}

// Longest-path layering: rank(v) = max(rank(parents)) + 1, sources at 0.
// Place nodes within a rank evenly along the cross axis.
function layout(data: DagData | null): LaidOut | null {
  if (!data || data.nodes.length === 0) return null
  const { nodes, edges } = data

  const incoming = new Map<string, string[]>()
  for (const n of nodes) incoming.set(n.id, [])
  for (const e of edges) incoming.get(e.to)?.push(e.from)

  const rank = new Map<string, number>()
  for (const n of nodes) rank.set(n.id, 0)
  // Iterate to a fixed point — small graphs converge in O(rank) passes.
  let changed = true
  let guard = 0
  while (changed && guard++ < nodes.length + 1) {
    changed = false
    for (const e of edges) {
      const next = (rank.get(e.from) ?? 0) + 1
      if ((rank.get(e.to) ?? 0) < next) {
        rank.set(e.to, next)
        changed = true
      }
    }
  }

  const ranks = new Map<number, string[]>()
  for (const n of nodes) {
    const r = rank.get(n.id) ?? 0
    if (!ranks.has(r)) ranks.set(r, [])
    ranks.get(r)!.push(n.id)
  }
  const maxRank = Math.max(0, ...rank.values())
  const widestRank = Math.max(...Array.from(ranks.values(), v => v.length))

  // Layered top-to-bottom: x = horizontal slot in rank, y = rank * RANK_GAP.
  // Final SVG width = widestRank columns; height = (maxRank + 1) rows.
  const width = PAD * 2 + widestRank * NODE_W + (widestRank - 1) * NODE_GAP
  const height = PAD * 2 + (maxRank + 1) * NODE_H + maxRank * (RANK_GAP - NODE_H)

  const positions = new Map<string, { x: number; y: number }>()
  for (const [r, ids] of ranks) {
    const rowW = ids.length * NODE_W + (ids.length - 1) * NODE_GAP
    const startX = (width - rowW) / 2
    ids.forEach((id, i) => {
      positions.set(id, {
        x: startX + i * (NODE_W + NODE_GAP),
        y: PAD + r * RANK_GAP,
      })
    })
  }

  const laidNodes = nodes.map(n => ({ ...n, ...positions.get(n.id)! }))
  const laidEdges = edges
    .map(e => {
      const a = positions.get(e.from)
      const b = positions.get(e.to)
      if (!a || !b) return null
      return {
        x1: a.x + NODE_W / 2, y1: a.y + NODE_H,
        x2: b.x + NODE_W / 2, y2: b.y,
      }
    })
    .filter((e): e is { x1: number; y1: number; x2: number; y2: number } => e != null)

  return { nodes: laidNodes, edges: laidEdges, width, height }
}
