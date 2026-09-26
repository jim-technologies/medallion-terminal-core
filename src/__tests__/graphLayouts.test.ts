import { describe, expect, it } from 'vitest'
import { layeredLayout } from '../graph/layeredLayout'
import { allocateNodes, egoLayout } from '../objects/linkGraphLayout'
import type { LinkGroup } from '../objects/LinkPanel'

const box = { nodeWidth: 100, nodeHeight: 40, rankGap: 80, nodeGap: 10, padding: 10 }

describe('layeredLayout', () => {
  it('ranks by longest path from the sources', () => {
    const layout = layeredLayout(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'a', to: 'c' }, { from: 'a', to: 'd' }],
      box,
    )!
    const rankOf = Object.fromEntries(layout.nodes.map(entry => [entry.node.id, entry.rank]))
    expect(rankOf).toEqual({ a: 0, b: 1, c: 2, d: 1 })
    expect(layout.edges).toHaveLength(4)
    expect(layout.height).toBe(10 * 2 + 3 * 40 + 2 * (80 - 40))
  })

  it('breaks cycles so every node still gets its own layer', () => {
    const layout = layeredLayout(
      [{ id: 'customer' }, { id: 'person' }, { id: 'employment' }],
      [{ from: 'customer', to: 'person' }, { from: 'person', to: 'employment' }, { from: 'employment', to: 'customer' }],
      box,
    )!
    const ranks = layout.nodes.map(entry => entry.rank)
    expect(new Set(ranks).size).toBe(3)
    expect(layout.nodes.find(entry => entry.node.id === 'customer')!.rank).toBe(0)
  })

  it('lays ranks out as columns when directed right', () => {
    const layout = layeredLayout([{ id: 'a' }, { id: 'b' }], [{ from: 'a', to: 'b' }], { ...box, direction: 'right' })!
    const [a, b] = layout.nodes
    expect(a!.y).toBe(b!.y)
    expect(b!.x - a!.x).toBe(80)
    expect(layout.edges[0]).toMatchObject({ x1: a!.x + 100, x2: b!.x })
    expect(layeredLayout([], [], box)).toBeNull()
  })

  it('routes an edge that skips ranks through gaps, never through a node', () => {
    // customer -> contract -> order, plus customer -> order skipping the
    // contract rank, which also holds person and ticket: the straight line
    // would run through contract.
    const nodes = [{ id: 'customer' }, { id: 'person' }, { id: 'contract' }, { id: 'ticket' }, { id: 'order' }]
    const edges = [
      { from: 'customer', to: 'person' },
      { from: 'customer', to: 'contract' },
      { from: 'customer', to: 'ticket' },
      { from: 'contract', to: 'order' },
      { from: 'customer', to: 'order' },
      { from: 'order', to: 'customer' },
    ]
    for (const direction of ['right', 'down'] as const) {
      const layout = layeredLayout(nodes, edges, { ...box, direction })!
      const inside = (point: { x: number; y: number }) => layout.nodes.some(({ x, y }) => (
        point.x > x && point.x < x + box.nodeWidth && point.y > y && point.y < y + box.nodeHeight
      ))
      const skip = layout.edges.find(({ edge }) => edge.from === 'customer' && edge.to === 'order')!
      const back = layout.edges.find(({ edge }) => edge.from === 'order' && edge.to === 'customer')!
      for (const route of [skip.route!, back.route!]) {
        expect(route).toHaveLength(2)
        const [enter, exit] = route as [{ x: number; y: number }, { x: number; y: number }]
        // The straight run across the skipped rank stays clear of its nodes.
        for (let step = 0; step <= 10; step++) {
          const point = { x: enter.x + ((exit.x - enter.x) * step) / 10, y: enter.y + ((exit.y - enter.y) * step) / 10 }
          expect(inside(point), `${direction} ${JSON.stringify(point)}`).toBe(false)
        }
      }
      // A back edge crosses the rank the other way.
      expect(direction === 'right' ? back.route![0]!.x > back.route![1]!.x : back.route![0]!.y > back.route![1]!.y).toBe(true)
      expect(layout.edges.find(({ edge }) => edge.from === 'contract')!.route).toBeUndefined()
    }
  })
})

function group(id: string, count: number, items: number): LinkGroup {
  return {
    id,
    relation: id,
    targetType: { label: id },
    count,
    items: Array.from({ length: items }, (_, index) => ({ id: `${id}-${index}`, title: `${id} ${index}` })),
  }
}

describe('link graph layout', () => {
  it('fits at most maxNodes nodes, "+N" included, at least one per group', () => {
    const groups = [group('people', 3, 3), group('orders', 212, 60), group('tickets', 9, 9)]
    const alloc = allocateNodes(groups, 40)
    const slots = alloc.reduce((total, value, index) => total + value + (groups[index]!.count > value ? 1 : 0), 0)
    expect(slots).toBeLessThanOrEqual(40)
    expect(alloc.every(value => value >= 1)).toBe(true)
    const layout = egoLayout(groups, 40)
    expect(layout.nodes).toHaveLength(slots)
    expect(layout.nodes.filter(node => node.kind === 'more').map(node => node.moreCount)).toEqual([212 - alloc[1]!, 9 - alloc[2]!].filter(count => count > 0))
    expect(layout.labels.map(label => label.text)).toEqual(['people', 'orders', 'tickets'])
  })

  it('places nodes on one ring, deterministically', () => {
    const groups = [group('employs', 3, 3), group('signed', 1, 1)]
    const first = egoLayout(groups)
    expect(egoLayout(groups)).toEqual(first)
    for (const node of first.nodes) {
      expect(Math.hypot(node.x, node.y)).toBeCloseTo(first.radius, 6)
    }
    // The first group starts on the left.
    expect(first.nodes[0]!.x).toBeLessThan(0)
    expect(egoLayout([]).nodes).toEqual([])
  })
})
