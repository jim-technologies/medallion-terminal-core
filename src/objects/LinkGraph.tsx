import { useMemo, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'
import { Icon } from '../components/Icon'
import { isPlainClick } from '../components/navigation'
import type { TypeColor } from '../components/TypeGlyph'
import { useMessage } from '../foundations/DesignSystemProvider'
import { GraphCanvas, labelChars } from './GraphCanvas'
import { egoLayout, type EgoNode } from './linkGraphLayout'
import type { LinkGroup } from './LinkPanel'
import { typePresentation, type ObjectRef } from './types'

/** Props for a one-hop link graph around one object. */
export interface LinkGraphProps {
  /** The object in the centre. */
  center: ObjectRef
  /** Its link groups (the same data as `LinkPanel`). */
  groups: readonly LinkGroup[]
  /** Accessible name, such as "Links of Northstar Labs". */
  label: string
  /** Most linked objects drawn; each group's remainder becomes "+N". */
  maxNodes?: number
  /** Height in pixels. */
  height?: number
  /** Host navigation for a node. */
  onNavigate?: (object: ObjectRef, event: SyntheticEvent<Element>) => void
}

const NODE = 24
const CENTER = 40
const LABEL_SPACE = 150
// Labels are drawn at a fixed screen size (12 px), so they are truncated to
// the room they have at the current scale.
const LABEL_CHAR = 6.8
const EDGE_LABEL_ROOM = 104
const EDGE_LABEL_CHAR = 6.2
// Above this many nodes the ring's labels turn radial.
const DENSE = 16

function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length - 1)}…` : text
}

interface NodeGlyphProps {
  x: number
  y: number
  size: number
  color: TypeColor | null
  icon: ReactNode
  center?: boolean
}

function NodeGlyph({ x, y, size, color, icon, center }: NodeGlyphProps) {
  return (
    <g
      className="mtc-graph-glyph"
      data-center={center || undefined}
      style={color ? { color: `var(--mtc-type-${color}-fg)` } : undefined}
    >
      <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        rx={4}
        fill={color ? `var(--mtc-type-${color}-bg)` : 'var(--mtc-panel)'}
      />
      {icon}
    </g>
  )
}

/**
 * The object's links as a one-hop ego graph: the object in the centre, each
 * link type in its own sector of a ring with the relation labelled on its
 * middle edge, at most `maxNodes` nodes (the rest summarised as "+N"). The
 * layout is deterministic, plain SVG with no dependency. Nodes are links:
 * Tab or the arrow keys move between them and Enter opens one; the canvas
 * pans by dragging and zooms with its buttons.
 */
export function LinkGraph({
  center,
  groups,
  label,
  maxNodes = 40,
  height = 320,
  onNavigate,
}: LinkGraphProps) {
  const t = useMessage()
  const layout = useMemo(() => egoLayout(groups, maxNodes), [groups, maxNodes])
  const dense = layout.nodes.length > DENSE
  const reachX = layout.radius + NODE + LABEL_SPACE
  const reachY = layout.radius + NODE + 16
  const width = reachX * 2
  const viewHeight = reachY * 2
  const cx = reachX
  const cy = reachY
  const centerType = center.type ? typePresentation(center.type) : null

  const nodeTarget = (node: EgoNode): { object: ObjectRef; href?: string } | null => {
    if (node.kind === 'item' && node.item) return { object: node.item, href: node.item.href }
    const group = groups[node.groupIndex]
    if (!group) return null
    return {
      object: { id: `${group.id}:all`, title: group.relation, type: group.targetType },
      href: group.viewAllHref,
    }
  }

  const activate = (object: ObjectRef, href: string | undefined) => (event: MouseEvent<Element>) => {
    if (!onNavigate || !isPlainClick(event)) {
      if (!href) event.preventDefault()
      return
    }
    event.preventDefault()
    onNavigate(object, event)
  }

  return (
    <GraphCanvas
      label={label}
      width={width}
      height={viewHeight}
      viewHeight={height}
      focus={{ x: cx - CENTER / 2, y: cy - CENTER / 2, width: CENTER, height: CENTER }}
    >
      {({ scale }) => (
        <>
          <g className="mtc-graph-edges">
            {layout.nodes.map(node => (
              <line
                key={`edge:${node.key}`}
                x1={cx}
                y1={cy}
                x2={cx + node.x}
                y2={cy + node.y}
                className="mtc-graph-edge"
                data-direction={groups[node.groupIndex]?.direction ?? 'outgoing'}
              />
            ))}
          </g>
          {layout.labels.map(edgeLabel => (
            <text
              key={`label:${edgeLabel.groupIndex}`}
              x={cx + edgeLabel.x}
              y={cy + edgeLabel.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="mtc-graph-edge-label"
            >
              {truncate(edgeLabel.text, labelChars(EDGE_LABEL_ROOM, scale, EDGE_LABEL_CHAR))}
            </text>
          ))}
          <g className="mtc-graph-node" data-center="true" aria-hidden="true">
            <NodeGlyph
              x={cx}
              y={cy}
              size={CENTER}
              center
              color={centerType?.color ?? null}
              icon={<Icon name={centerType?.icon ?? 'object'} x={cx - 11} y={cy - 11} width={22} height={22} size={22} />}
            />
          </g>
          {layout.nodes.map(node => {
            const target = nodeTarget(node)
            if (!target) return null
            const group = groups[node.groupIndex]!
            const presentation = typePresentation(group.targetType)
            const x = cx + node.x
            const y = cy + node.y
            const cos = Math.cos(node.angle)
            const right = cos >= 0
            // A dense ring reads its labels radially so neighbours never collide;
            // a sparse one keeps them horizontal.
            const radial = dense
            const anchor = radial ? (right ? 'start' : 'end') : cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
            const gap = NODE / 2 + 8
            const labelX = radial
              ? x + Math.cos(node.angle) * gap
              : anchor === 'start' ? x + gap : anchor === 'end' ? x - gap : x
            const labelY = radial
              ? y + Math.sin(node.angle) * gap
              : anchor === 'middle' ? y + (Math.sin(node.angle) > 0 ? NODE / 2 + 14 : -NODE / 2 - 8) : y
            const rotation = radial ? (node.angle * 180) / Math.PI + (right ? 0 : 180) : 0
            const text = node.kind === 'more'
              ? t('graph.more', { count: node.moreCount ?? 0 })
              : node.item?.title ?? ''
            const name = node.kind === 'more'
              ? t('graph.moreLabel', { count: node.moreCount ?? 0, relation: group.relation, type: group.targetType.label })
              : `${text}, ${group.relation}`
            const interactive = Boolean(target.href || onNavigate)
            return (
              <a
                key={node.key}
                href={target.href}
                data-graph-node={interactive || undefined}
                className="mtc-graph-node"
                data-kind={node.kind}
                aria-label={name}
                role={target.href ? undefined : interactive ? 'link' : 'img'}
                tabIndex={target.href ? undefined : interactive ? 0 : undefined}
                onClick={activate(target.object, target.href)}
                onKeyDown={interactive ? event => {
                  // SVG links do not activate on Enter by themselves.
                  if (event.key !== 'Enter') return
                  event.preventDefault()
                  if (onNavigate) onNavigate(target.object, event)
                  else event.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
                } : undefined}
              >
                {node.kind === 'more' ? (
                  <g className="mtc-graph-more">
                    <rect x={x - NODE / 2} y={y - NODE / 2} width={NODE} height={NODE} rx={NODE / 2} />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="central">+{node.moreCount}</text>
                  </g>
                ) : (
                  <NodeGlyph
                    x={x}
                    y={y}
                    size={NODE}
                    color={presentation.color}
                    icon={<Icon name={presentation.icon} x={x - 7} y={y - 7} width={14} height={14} size={14} strokeWidth={2} />}
                  />
                )}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  transform={rotation ? `rotate(${rotation.toFixed(2)} ${labelX.toFixed(2)} ${labelY.toFixed(2)})` : undefined}
                  className="mtc-graph-node-label"
                >
                  {truncate(text, labelChars(LABEL_SPACE - 8, scale, LABEL_CHAR))}
                </text>
              </a>
            )
          })}
        </>
      )}
    </GraphCanvas>
  )
}
