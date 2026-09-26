/**
 * Deterministic radial layout for a one-hop link graph: the object in the
 * centre, its linked objects on a ring, each link type in its own sector.
 * No physics, so the same links always draw the same picture.
 */
import type { LinkGroup, LinkItem } from './LinkPanel'

/** A node on the ring: a linked object, or "+N" for a group's remainder. */
export interface EgoNode {
  key: string
  kind: 'item' | 'more'
  groupIndex: number
  /** Position relative to the centre object. */
  x: number
  y: number
  /** Angle in radians (0 points right, clockwise in SVG). */
  angle: number
  item?: LinkItem
  /** For `more` nodes: links not drawn. */
  moreCount?: number
}

/** A link type's label, drawn on its sector's middle edge. */
export interface EgoLabel {
  groupIndex: number
  x: number
  y: number
  text: string
}

export interface EgoLayout {
  nodes: EgoNode[]
  labels: EgoLabel[]
  radius: number
}

/** Nodes per group within `maxNodes`: at least one each, "+N" included. */
export function allocateNodes(groups: readonly LinkGroup[], maxNodes: number): number[] {
  const wanted = groups.map(group => Math.min(group.items.length, Math.max(0, group.count)))
  const slots = (alloc: number[]) => alloc.reduce((total, value, index) => (
    total + value + (groups[index]!.count > value ? 1 : 0)
  ), 0)
  const alloc = [...wanted]
  // Shrink the largest group first until the drawing fits.
  while (slots(alloc) > maxNodes) {
    let largest = -1
    for (let index = 0; index < alloc.length; index++) {
      if (alloc[index]! > 1 && (largest < 0 || alloc[index]! > alloc[largest]!)) largest = index
    }
    if (largest < 0) break
    alloc[largest]! -= 1
  }
  return alloc
}

const MIN_ARC = 40
const BASE_RADIUS = 120
const GROUP_GAP = 0.6

/**
 * Places the allocated nodes. Sectors are proportional to their node count
 * with a small gap between link types, starting on the left and running
 * clockwise over the top.
 */
export function egoLayout(groups: readonly LinkGroup[], maxNodes = 40): EgoLayout {
  const alloc = allocateNodes(groups, maxNodes)
  const counts = alloc.map((value, index) => value + (groups[index]!.count > value ? 1 : 0))
  const total = counts.reduce((sum, value) => sum + value, 0)
  if (total === 0) return { nodes: [], labels: [], radius: BASE_RADIUS }
  const units = total + (groups.length > 1 ? groups.length * GROUP_GAP : 0)
  const radius = Math.max(BASE_RADIUS, (total * MIN_ARC) / (2 * Math.PI))
  const unit = (2 * Math.PI) / units
  const nodes: EgoNode[] = []
  const labels: EgoLabel[] = []
  let cursor = Math.PI - (groups.length > 1 ? (GROUP_GAP * unit) / 2 : 0)

  groups.forEach((group, groupIndex) => {
    const count = counts[groupIndex]!
    if (count === 0) return
    const start = cursor + (groups.length > 1 ? (GROUP_GAP * unit) / 2 : 0)
    const angleAt = (slot: number) => start + (slot + 0.5) * unit
    const shown = group.items.slice(0, alloc[groupIndex])
    shown.forEach((item, slot) => {
      const angle = angleAt(slot)
      nodes.push({
        key: `${group.id}:${item.id}`,
        kind: 'item',
        groupIndex,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle,
        item,
      })
    })
    if (group.count > shown.length) {
      const angle = angleAt(shown.length)
      nodes.push({
        key: `${group.id}:more`,
        kind: 'more',
        groupIndex,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle,
        moreCount: group.count - shown.length,
      })
    }
    const middle = start + (count / 2) * unit
    labels.push({
      groupIndex,
      x: Math.cos(middle) * radius * 0.6,
      y: Math.sin(middle) * radius * 0.6,
      text: group.relation,
    })
    cursor = start + count * unit + (groups.length > 1 ? (GROUP_GAP * unit) / 2 : 0)
  })
  return { nodes, labels, radius }
}
