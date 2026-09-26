import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Panel } from '../components/Display'
import { Icon } from '../components/Icon'
import { navigateOnPlainClick } from '../components/navigation'
import { TypeGlyph } from '../components/TypeGlyph'
import { cx } from '../components/utils'
import { useMessage } from '../foundations/DesignSystemProvider'
import { ObjectChip } from './ObjectChip'
import { typePresentation, type ObjectRef, type ObjectTypeRef } from './types'

/** One linked object and its secondary detail (a role, a date, an amount). */
export interface LinkItem extends ObjectRef {
  /** Right-aligned detail, such as "Technical lead" or "$18,240.00". */
  detail?: ReactNode
  /** Monospace title, for ids such as `ORD-4481`. */
  mono?: boolean
}

/** All links of one link type from (or to) an object. */
export interface LinkGroup {
  /** Stable id of the link type. */
  id: string
  /** The relation as read from this object: "Employs", "Placed". */
  relation: string
  /** `incoming` links point at this object ("Subject of"). */
  direction?: 'outgoing' | 'incoming'
  /** The type at the other end. */
  targetType: ObjectTypeRef
  /** Total links of this type; may exceed the items shown. */
  count: number
  /** The first few linked objects. */
  items: readonly LinkItem[]
  /** Link to the full set. */
  viewAllHref?: string
  /** Host navigation for "View all". */
  onViewAll?: (event: MouseEvent<HTMLElement>) => void
  /** Overrides "View all {count}". */
  viewAllLabel?: ReactNode
}

/** Props for an object's link panel. */
export interface LinkPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Link groups in display order. */
  groups: readonly LinkGroup[]
  /** Panel title; defaults to "Links". */
  title?: ReactNode
  /** Header detail; defaults to "n link types · m objects". */
  subtitle?: ReactNode
  /** Items shown per group before "View all". */
  maxItems?: number
  /** Header actions, such as opening the link graph. */
  actions?: ReactNode
  /** Host navigation for linked objects. */
  onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void
  /** Heading level of the panel title. */
  headingLevel?: 2 | 3 | 4
}

/** Relation header of a link group: "Employs → [glyph] Person … 3". */
export function LinkRelation({ group }: { group: LinkGroup }) {
  const t = useMessage()
  const { icon, color } = typePresentation(group.targetType)
  const incoming = group.direction === 'incoming'
  return (
    <div className="mtc-link-relation">
      {incoming && <Icon name="arrow-left" label={t('linkPanel.incoming')} className="mtc-link-arrow" />}
      <span className="mtc-link-relation-name">{group.relation}</span>
      {!incoming && <Icon name="arrow-right" className="mtc-link-arrow" />}
      <TypeGlyph icon={icon} color={color} size={16} />
      <span className="mtc-link-relation-type">{group.targetType.label}</span>
      <span className="mtc-link-relation-count">{group.count}</span>
    </div>
  )
}

/**
 * An object's relationships grouped by link type: each group names the
 * relation and the type at the other end with its count, lists the first
 * few objects with their detail, and offers "View all".
 */
export const LinkPanel = forwardRef<HTMLElement, LinkPanelProps>(function LinkPanel(
  {
    groups,
    title,
    subtitle,
    maxItems = 3,
    actions,
    onNavigate,
    headingLevel,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const objects = groups.reduce((total, group) => total + group.count, 0)
  return (
    <Panel
      {...rest}
      ref={ref}
      title={title ?? t('linkPanel.title')}
      subtitle={subtitle ?? t('linkPanel.summary', { types: groups.length, objects })}
      actions={actions}
      headingLevel={headingLevel}
      className={cx('mtc-link-panel', className)}
    >
      {groups.length === 0 ? (
        <p className="mtc-link-panel-empty">{t('linkPanel.empty')}</p>
      ) : groups.map(group => {
        const shown = group.items.slice(0, maxItems)
        const more = group.count > shown.length
        return (
          <section key={group.id} className="mtc-link-group" aria-label={`${group.relation} ${group.targetType.label}`}>
            <LinkRelation group={group} />
            {shown.length > 0 && (
              <ul className="mtc-link-items">
                {shown.map(item => (
                  <li key={item.id} className="mtc-link-item">
                    <ObjectChip object={item} onNavigate={onNavigate} mono={item.mono} className="mtc-link-item-chip" />
                    {item.detail != null && <span className="mtc-link-item-detail">{item.detail}</span>}
                  </li>
                ))}
              </ul>
            )}
            {more && (group.viewAllHref || group.onViewAll) && (
              group.viewAllHref ? (
                <a className="mtc-link-view-all" href={group.viewAllHref} onClick={navigateOnPlainClick(group.onViewAll)}>
                  {group.viewAllLabel ?? t('linkPanel.viewAll', { count: group.count })}
                </a>
              ) : (
                <button type="button" className="mtc-link-view-all" onClick={group.onViewAll}>
                  {group.viewAllLabel ?? t('linkPanel.viewAll', { count: group.count })}
                </button>
              )
            )}
          </section>
        )
      })}
    </Panel>
  )
})
