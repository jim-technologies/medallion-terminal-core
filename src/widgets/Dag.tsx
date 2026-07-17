import { useId, useMemo } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import { normalizeGraph, type GraphData, type GraphNodeData } from './platformShapes'
import { Empty } from './states'

interface DagOptions {
  node_context?: {
    key?: string
    kind_key?: string
  }
}

const STATUS_COLOR: Record<string, string> = {
  ok:                  'var(--mtc-ok)',
  EVENT_STATUS_OK:     'var(--mtc-ok)',
  warn:                'var(--mtc-warning)',
  EVENT_STATUS_WARN:   'var(--mtc-warning)',
  error:               'var(--mtc-danger)',
  EVENT_STATUS_ERROR:  'var(--mtc-danger)',
  info:                'var(--mtc-accent)',
  EVENT_STATUS_INFO:   'var(--mtc-accent)',
  pending:             'var(--mtc-muted)',
  EVENT_STATUS_PENDING:'var(--mtc-muted)',
  running:             'var(--mtc-accent)',
}
const DEFAULT_NODE = 'var(--mtc-muted-subtle)'

const NODE_W = 130
const NODE_H = 48
const RANK_GAP = 80
const NODE_GAP = 18
const PAD = 16

// Generic DAG (directed acyclic graph) viz. Use for workflow / pipeline /
// dependency visualisations: asset graphs, workflow DAGs
// child workflows, build-system dependency trees, etc.
//
// Layout: longest-path layered top-to-bottom (or left-to-right when wider
// than tall). Nodes within a layer are spaced evenly. Edges drawn as
// straight lines with a small terminal arrow.
//
// Data shape:
//   { nodes: [{id, label, kind?, status?, context?}],
//     edges: [{from, to, label?}] }
export function Dag({ data, options }: WidgetProps) {
  const graph = useMemo(() => normalizeGraph(data), [data])
  const laid = useMemo(() => layout(graph), [graph])
  const markerId = `dag-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const { ctx, setCtx } = useDashboard()
  const opts = (options ?? {}) as DagOptions
  const nodeIdKey = opts.node_context?.key ?? 'asset_id'
  if (!laid) return <Empty>No data</Empty>

  const selectNode = (node: GraphNodeData) => {
    if (Object.keys(node.context).length > 0) {
      for (const [key, value] of Object.entries(node.context)) setCtx(key, value)
    }
    if (opts.node_context) {
      const kindKey = opts.node_context.kind_key
      if (!(nodeIdKey in node.context)) setCtx(nodeIdKey, node.id)
      if (kindKey && node.kind && !(kindKey in node.context)) setCtx(kindKey, node.kind)
    }
  }

  return (
    <div className="h-full w-full overflow-auto">
      <svg
        viewBox={`0 0 ${laid.width} ${laid.height}`}
        width={laid.width}
        height={laid.height}
        style={{ display: 'block' }}
      >
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,8 L8,4 z" fill="var(--mtc-muted-subtle)" />
          </marker>
        </defs>
        {laid.edges.map((e, i) => (
          <g key={`${e.from}:${e.to}:${i}`}>
            <line
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="var(--mtc-border-strong)" strokeWidth={1.5}
              markerEnd={`url(#${markerId})`}
            />
            {e.label && (
              <text
                x={(e.x1 + e.x2) / 2}
                y={(e.y1 + e.y2) / 2 - 4}
                textAnchor="middle"
                fontSize={9}
                fill="var(--mtc-muted)"
                fontFamily="var(--mtc-font-sans)"
              >
                {truncate(e.label, 18)}
              </text>
            )}
          </g>
        ))}
        {laid.nodes.map(n => {
          const fill = n.status ? STATUS_COLOR[n.status] ?? DEFAULT_NODE : DEFAULT_NODE
          const selectable = !!opts.node_context || Object.keys(n.context).length > 0
          const selected = selectable && ctx[nodeIdKey] === n.id
          return (
            <g
              key={n.id}
              onClick={selectable ? () => selectNode(n) : undefined}
              onKeyDown={selectable ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  selectNode(n)
                }
              } : undefined}
              role={selectable ? 'button' : undefined}
              aria-label={selectable ? `Select ${n.label}` : undefined}
              tabIndex={selectable ? 0 : undefined}
              style={{ cursor: selectable ? 'pointer' : 'default' }}
            >
              <rect
                x={n.x} y={n.y} width={NODE_W} height={NODE_H}
                rx={4} ry={4}
                fill={selected ? 'color-mix(in oklab, var(--mtc-accent) 12%, var(--mtc-surface-raised))' : 'var(--mtc-surface-raised)'}
                stroke={selected ? 'var(--mtc-accent)' : fill}
                strokeWidth={selected ? 2.5 : 1.5}
              />
              <text
                x={n.x + NODE_W / 2}
                y={n.y + (n.subtitle ? 21 : NODE_H / 2 + 4)}
                textAnchor="middle"
                fontSize={11} fill="var(--mtc-fg)"
                fontFamily="var(--mtc-font-sans)"
              >
                {truncate(n.label, 18)}
              </text>
              {n.subtitle && (
                <text
                  x={n.x + NODE_W / 2}
                  y={n.y + 36}
                  textAnchor="middle"
                  fontSize={9}
                  fill="var(--mtc-muted)"
                  fontFamily="var(--mtc-font-sans)"
                >
                  {truncate(n.subtitle, 22)}
                </text>
              )}
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

interface LaidOut {
  nodes: Array<GraphNodeData & { x: number; y: number }>
  edges: Array<{ from: string; to: string; label?: string; x1: number; y1: number; x2: number; y2: number }>
  width: number
  height: number
}

// Longest-path layering: rank(v) = max(rank(parents)) + 1, sources at 0.
// Kahn traversal avoids the old fixed-point behavior where a cycle kept
// increasing ranks until a guard fired. Any cyclic remainder lands in
// one final layer so malformed lineage is still inspectable.
function layout(data: GraphData | null): LaidOut | null {
  if (!data || data.nodes.length === 0) return null
  const { nodes, edges } = data

  const ids = new Set(nodes.map((node) => node.id))
  const validEdges = edges.filter((edge) => ids.has(edge.from) && ids.has(edge.to))
  const indegree = new Map<string, number>()
  const outgoing = new Map<string, string[]>()
  const rank = new Map<string, number>()
  for (const node of nodes) {
    indegree.set(node.id, 0)
    outgoing.set(node.id, [])
    rank.set(node.id, 0)
  }
  for (const edge of validEdges) {
    indegree.set(edge.to, (indegree.get(edge.to) ?? 0) + 1)
    outgoing.get(edge.from)?.push(edge.to)
  }

  const queue = nodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((node) => node.id)
  const processed = new Set<string>()
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const id = queue[cursor]
    processed.add(id)
    for (const child of outgoing.get(id) ?? []) {
      rank.set(child, Math.max(rank.get(child) ?? 0, (rank.get(id) ?? 0) + 1))
      const remaining = (indegree.get(child) ?? 0) - 1
      indegree.set(child, remaining)
      if (remaining === 0) queue.push(child)
    }
  }

  if (processed.size < nodes.length) {
    const finalRank = Math.max(0, ...[...processed].map((id) => rank.get(id) ?? 0)) + 1
    for (const node of nodes) {
      if (!processed.has(node.id)) {
        rank.set(node.id, finalRank)
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
  const laidEdges = validEdges
    .map(e => {
      const a = positions.get(e.from)
      const b = positions.get(e.to)
      if (!a || !b) return null
      return {
        from: e.from,
        to: e.to,
        label: e.label,
        x1: a.x + NODE_W / 2, y1: a.y + NODE_H,
        x2: b.x + NODE_W / 2, y2: b.y,
      }
    })
    .filter((e): e is { from: string; to: string; label: string | undefined; x1: number; y1: number; x2: number; y2: number } => e != null)

  return { nodes: laidNodes, edges: laidEdges, width, height }
}
