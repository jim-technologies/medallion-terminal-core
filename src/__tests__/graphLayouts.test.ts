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
