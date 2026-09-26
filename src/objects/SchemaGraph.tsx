import { useId, useMemo, type MouseEvent, type SyntheticEvent } from 'react'
import { Icon } from '../components/Icon'
import { isPlainClick } from '../components/navigation'
import { useLocale } from '../foundations/DesignSystemProvider'
import { formatNumber } from '../foundations/intl'
import { layeredLayout } from '../graph/layeredLayout'
import { GraphCanvas } from './GraphCanvas'
import { typePresentation, type ObjectTypeRef } from './types'

/** An object type drawn as a schema node. */
export interface SchemaGraphType extends ObjectTypeRef {
  id: string
  /** Number of objects of this type, shown under the name. */
  count?: number
  /** The type's page. */
  href?: string
}

/** A link type between two object types. */
export interface SchemaGraphRelation {
  id?: string
  /** Source type id. */
  from: string
  /** Target type id. */
  to: string
  /** The relation's name, such as "Places". */
  label: string
}

/** Props for the ontology's type graph. */
export interface SchemaGraphProps {
  types: readonly SchemaGraphType[]
  relations: readonly SchemaGraphRelation[]
  /** Accessible name, such as "Object type graph". */
  label: string
  /** The highlighted type. */
  selectedId?: string
  /** Called when a type is chosen (click or Enter); a plain click on an `href` goes to the host instead of navigating. */
  onSelect?: (type: SchemaGraphType, event: SyntheticEvent<Element>) => void
  /** Height in pixels. */
  height?: number
  /** Ranks run left to right (default) or top to bottom. */
  direction?: 'right' | 'down'
}

const NODE_WIDTH = 176
const NODE_HEIGHT = 44
const MAX_NAME = 20
const BACK_BEND = 56

/**
 * A curved edge between two node sides. An edge into an earlier rank (a
 * back edge, from a broken cycle) leaves from the source's leading side and
 * enters the target's trailing side, so it never cuts through a node.
 */
function edgePath(direction: 'right' | 'down', x1: number, y1: number, x2: number, y2: number): string {
  if (direction === 'right') {
    if (x2 > x1) {
      const bend = (x2 - x1) / 2
      return `M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2 - 2} ${y2}`
    }
    const sx = x1 - NODE_WIDTH
    const tx = x2 + NODE_WIDTH
    return `M${sx} ${y1} C${sx - BACK_BEND} ${y1} ${tx + BACK_BEND} ${y2} ${tx + 2} ${y2}`
  }
  if (y2 > y1) {
    const bend = (y2 - y1) / 2
    return `M${x1} ${y1} C${x1} ${y1 + bend} ${x2} ${y2 - bend} ${x2} ${y2 - 2}`
  }
  const sy = y1 - NODE_HEIGHT
  const ty = y2 + NODE_HEIGHT
  return `M${x1} ${sy} C${x1} ${sy - BACK_BEND} ${x2} ${ty + BACK_BEND} ${x2} ${ty + 2}`
}

function truncate(text: string, length: number): string {
  return text.length > length ? `${text.slice(0, length - 1)}…` : text
}

/**
 * Object types as nodes (type glyph, name, object count) and link types as
 * labelled, directed edges, on the same layered layout as the `dag` widget.
 * Plain SVG with pan and zoom; types are focusable, and Enter or a click
 * selects one.
 */
export function SchemaGraph({
  types,
  relations,
  label,
  selectedId,
  onSelect,
  height = 360,
  direction = 'right',
}: SchemaGraphProps) {
  const { locale } = useLocale()
  const markerId = `mtc-schema-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const layout = useMemo(() => layeredLayout(types, relations, {
    nodeWidth: NODE_WIDTH,
    nodeHeight: NODE_HEIGHT,
    rankGap: direction === 'right' ? NODE_WIDTH + 96 : NODE_HEIGHT + 72,
    nodeGap: direction === 'right' ? 28 : 24,
    padding: 24,
    direction,
  }), [types, relations, direction])
  if (!layout) return null

  const choose = (type: SchemaGraphType) => (event: MouseEvent<Element>) => {
    if (!onSelect || !isPlainClick(event)) return
    event.preventDefault()
    onSelect(type, event)
  }

  return (
    <GraphCanvas label={label} width={layout.width} height={layout.height} viewHeight={height}>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L0,8 L8,4 z" className="mtc-graph-arrow" />
        </marker>
      </defs>
      <g className="mtc-graph-edges">
        {layout.edges.map(({ edge, x1, y1, x2, y2 }, index) => {
          const path = edgePath(direction, x1, y1, x2, y2)
          const active = selectedId !== undefined && (edge.from === selectedId || edge.to === selectedId)
          return (
            <g key={edge.id ?? `${edge.from}:${edge.to}:${index}`}>
              <path d={path} className="mtc-graph-edge" data-active={active || undefined} markerEnd={`url(#${markerId})`} />
              <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" className="mtc-graph-edge-label">
                {truncate(edge.label, 18)}
              </text>
            </g>
          )
        })}
      </g>
      {layout.nodes.map(({ node: type, x, y }) => {
        const { icon, color } = typePresentation(type)
        const selected = type.id === selectedId
        const interactive = Boolean(type.href || onSelect)
        const name = type.count === undefined
          ? type.label
          : `${type.label}, ${formatNumber(type.count, { locale })}`
        return (
          <a
            key={type.id}
            href={type.href}
            role={type.href ? undefined : interactive ? 'button' : 'img'}
            tabIndex={type.href ? undefined : interactive ? 0 : undefined}
            aria-label={name}
            aria-current={selected || undefined}
            data-graph-node={interactive || undefined}
            data-selected={selected || undefined}
            className="mtc-graph-node mtc-schema-node"
            onClick={choose(type)}
            onKeyDown={interactive ? event => {
              // SVG links do not activate on Enter by themselves.
              if (event.key !== 'Enter' && !(event.key === ' ' && !type.href)) return
              event.preventDefault()
              if (onSelect) onSelect(type, event)
              else event.currentTarget.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
            } : undefined}
          >
            <rect x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT} rx={4} className="mtc-schema-node-box" />
            <g style={{ color: `var(--mtc-type-${color}-fg)` }}>
              <rect x={x + 10} y={y + 10} width={24} height={24} rx={4} fill={`var(--mtc-type-${color}-bg)`} />
              <Icon name={icon} x={x + 15} y={y + 15} width={14} height={14} size={14} strokeWidth={2} />
            </g>
            <text x={x + 44} y={type.count === undefined ? y + NODE_HEIGHT / 2 : y + 18} dominantBaseline="middle" className="mtc-graph-node-label" data-emphasis="true">
              {truncate(type.label, MAX_NAME)}
            </text>
            {type.count !== undefined && (
              <text x={x + 44} y={y + 32} dominantBaseline="middle" className="mtc-graph-node-meta">
                {formatNumber(type.count, { locale })}
              </text>
            )}
          </a>
        )
      })}
    </GraphCanvas>
  )
}
