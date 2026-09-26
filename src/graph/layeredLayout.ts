/**
 * Longest-path layered layout for directed graphs, shared by the `dag`
 * widget and `SchemaGraph`: rank(v) = max(rank(parents)) + 1, sources at 0,
 * nodes spaced evenly within their rank. Kahn traversal keeps it linear. A
 * cycle is broken where it blocks the traversal: the waiting node with the
 * fewest unmet incoming edges (input order on ties) is released as if it
 * were a source, and edges back into processed nodes do not raise ranks, so
 * ontologies with mutual links still lay out in layers.
 */

export interface LayeredNodeInput {
  id: string
}

export interface LayeredEdgeInput {
  from: string
  to: string
}

/** Node box and spacing, in SVG user units. */
export interface LayeredLayoutOptions {
  nodeWidth: number
  nodeHeight: number
  /** Distance between the starts of consecutive ranks. */
  rankGap: number
  /** Gap between nodes of one rank. */
  nodeGap: number
  padding: number
  /** `down`: ranks are rows; `right`: ranks are columns. */
  direction?: 'down' | 'right'
}

export interface LaidOutNode<N> {
  node: N
  x: number
  y: number
  rank: number
}

export interface LaidOutEdge<E> {
  edge: E
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface LayeredLayout<N, E> {
  nodes: LaidOutNode<N>[]
  edges: LaidOutEdge<E>[]
  width: number
  height: number
}

export function layeredLayout<N extends LayeredNodeInput, E extends LayeredEdgeInput>(
  nodes: readonly N[],
  edges: readonly E[],
  { nodeWidth, nodeHeight, rankGap, nodeGap, padding, direction = 'down' }: LayeredLayoutOptions,
): LayeredLayout<N, E> | null {
  if (nodes.length === 0) return null
  const ids = new Set(nodes.map(node => node.id))
  const validEdges = edges.filter(edge => ids.has(edge.from) && ids.has(edge.to))
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

  const queue = nodes.filter(node => (indegree.get(node.id) ?? 0) === 0).map(node => node.id)
  const queued = new Set(queue)
  const processed = new Set<string>()
  for (let cursor = 0; processed.size < nodes.length; cursor++) {
    if (cursor >= queue.length) {
      let release: string | undefined
      for (const node of nodes) {
        if (queued.has(node.id)) continue
        if (release === undefined || (indegree.get(node.id) ?? 0) < (indegree.get(release) ?? 0)) release = node.id
      }
      if (release === undefined) break
      queue.push(release)
      queued.add(release)
    }
    const id = queue[cursor]!
    processed.add(id)
    for (const child of outgoing.get(id) ?? []) {
      if (processed.has(child)) continue
      rank.set(child, Math.max(rank.get(child) ?? 0, (rank.get(id) ?? 0) + 1))
      const remaining = (indegree.get(child) ?? 0) - 1
      indegree.set(child, remaining)
      if (remaining === 0 && !queued.has(child)) {
        queue.push(child)
        queued.add(child)
      }
    }
  }

  const ranks = new Map<number, string[]>()
  for (const node of nodes) {
    const value = rank.get(node.id) ?? 0
    ranks.set(value, [...(ranks.get(value) ?? []), node.id])
  }
  const maxRank = Math.max(0, ...rank.values())
  const widestRank = Math.max(...Array.from(ranks.values(), members => members.length))

  // Along the rank axis nodes follow each other; across it, ranks stack.
  const across = direction === 'down' ? nodeWidth : nodeHeight
  const along = direction === 'down' ? nodeHeight : nodeWidth
  const breadth = padding * 2 + widestRank * across + (widestRank - 1) * nodeGap
  const depth = padding * 2 + (maxRank + 1) * along + maxRank * (rankGap - along)

  const positions = new Map<string, { x: number; y: number; rank: number }>()
  for (const [value, members] of ranks) {
    const span = members.length * across + (members.length - 1) * nodeGap
    const start = (breadth - span) / 2
    members.forEach((id, index) => {
      const offset = start + index * (across + nodeGap)
      const level = padding + value * rankGap
      positions.set(id, direction === 'down'
        ? { x: offset, y: level, rank: value }
        : { x: level, y: offset, rank: value })
    })
  }

  const laidNodes = nodes.map(node => ({ node, ...positions.get(node.id)! }))
  const laidEdges: LaidOutEdge<E>[] = []
  for (const edge of validEdges) {
    const a = positions.get(edge.from)
    const b = positions.get(edge.to)
    if (!a || !b) continue
    laidEdges.push(direction === 'down'
      ? { edge, x1: a.x + nodeWidth / 2, y1: a.y + nodeHeight, x2: b.x + nodeWidth / 2, y2: b.y }
      : { edge, x1: a.x + nodeWidth, y1: a.y + nodeHeight / 2, x2: b.x, y2: b.y + nodeHeight / 2 })
  }
  return direction === 'down'
    ? { nodes: laidNodes, edges: laidEdges, width: breadth, height: depth }
    : { nodes: laidNodes, edges: laidEdges, width: depth, height: breadth }
}
