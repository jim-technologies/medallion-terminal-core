import { forwardRef, type CSSProperties, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { CopyButton, MetaRow, StatusBadge } from '../components/Display'
import { navigateOnPlainClick } from '../components/navigation'
import { TypeGlyph } from '../components/TypeGlyph'
import { cx } from '../components/utils'
import { useMessage } from '../foundations/DesignSystemProvider'
import type { StatusTone } from '../foundations/types'
import { typePresentation, type ObjectTypeRef } from './types'

/** Props for an object's identity header. */
export interface ObjectHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The object's type: its glyph, eyebrow label and colour. */
  type: ObjectTypeRef
  /** The object's title. */
  title: ReactNode
  /** Stable id, shown in monospace with a copy action. */
  objectId?: string
  /** Current status, shown as a StatusBadge. */
  status?: { label: ReactNode; tone: StatusTone }
  /** Metadata such as "Updated 18 min ago by Jamie Kim", "Revision 14". */
  meta?: readonly ReactNode[]
  /** Actions aligned to the end: a menu, the primary action, a more menu. */
  actions?: ReactNode
  /** The inspector variant: a 24 px glyph, a 16 px title, no metadata row. */
  compact?: boolean
  /** Heading level of the title (1 on an object page). */
  headingLevel?: 1 | 2 | 3
  /** Link to the type's page. */
  typeHref?: string
  /** Host navigation for the type link. */
  onTypeNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * The object anatomy's first block: a 40 px type glyph, the type eyebrow in
 * the type's colour with the monospace id, the title, then status and
 * metadata. One header serves object pages, the explorer inspector
 * (`compact`) and hover cards.
 */
export const ObjectHeader = forwardRef<HTMLElement, ObjectHeaderProps>(function ObjectHeader(
  {
    type,
    title,
    objectId,
    status,
    meta,
    actions,
    compact = false,
    headingLevel = compact ? 2 : 1,
    typeHref,
    onTypeNavigate,
    className,
    style,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const { icon, color } = typePresentation(type)
  const Heading = `h${headingLevel}` as 'h1'
  const hasMeta = !compact && (status || (meta && meta.length > 0))
  return (
    <div
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
      className={cx('mtc-object-header', className)}
      data-compact={compact || undefined}
      style={{ '--mtc-object-type-fg': `var(--mtc-type-${color}-fg)`, ...style } as CSSProperties}
    >
      <TypeGlyph icon={icon} color={color} size={compact ? 24 : 40} />
      <div className="mtc-object-header-main">
        <div className="mtc-object-header-eyebrow">
          {typeHref ? (
            <a className="mtc-object-header-type" href={typeHref} onClick={navigateOnPlainClick(onTypeNavigate)}>
              {type.label}
            </a>
          ) : (
            <span className="mtc-object-header-type">{type.label}</span>
          )}
          {objectId && (
            <>
              <span aria-hidden="true" className="mtc-object-header-dot">·</span>
              <code className="mtc-object-header-id">{objectId}</code>
              <CopyButton value={objectId} label={t('objectHeader.copyId')} />
            </>
          )}
        </div>
        <Heading className="mtc-object-header-title">{title}</Heading>
        {compact && status && (
          <div className="mtc-object-header-status">
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          </div>
        )}
        {hasMeta && (
          <div className="mtc-object-header-meta">
            {status && <StatusBadge tone={status.tone}>{status.label}</StatusBadge>}
            {meta && meta.length > 0 && <MetaRow items={meta} />}
          </div>
        )}
      </div>
      {actions && <div className="mtc-object-header-actions">{actions}</div>}
    </div>
  )
})
