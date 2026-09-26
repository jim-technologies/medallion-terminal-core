import { forwardRef, type MouseEvent, type ReactElement, type ReactNode, type Ref } from 'react'
import { HoverCard } from '../components/HoverCard'
import { navigateOnPlainClick } from '../components/navigation'
import { TypeGlyph } from '../components/TypeGlyph'
import { cx } from '../components/utils'
import { typePresentation, type ObjectRef } from './types'

/** Props for an inline object reference. */
export interface ObjectChipProps {
  /** The referenced object. Its `href` makes the chip a link. */
  object: ObjectRef
  /**
   * Host navigation for a plain click (the `href` still serves new-tab and
   * copy-link). Without an `href` the chip becomes a button.
   */
  onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void
  /** Preview shown on hover and focus, such as a compact ObjectHeader. */
  hoverCard?: ReactNode
  /** Renders the title in the monospace face (ids such as `ORD-4481`). */
  mono?: boolean
  /** Additional class. */
  className?: string
}

/**
 * An object reference: its type glyph and title in the link colour. Used in
 * property values, link panels, grids and activity feeds.
 */
export const ObjectChip = forwardRef<HTMLElement, ObjectChipProps>(function ObjectChip(
  { object, onNavigate, hoverCard, mono, className },
  ref,
) {
  const presentation = object.type ? typePresentation(object.type) : null
  const body = (
    <>
      {presentation && (
        <TypeGlyph icon={presentation.icon} color={presentation.color} size={16} />
      )}
      <span className="mtc-object-chip-title" data-mono={mono || undefined}>{object.title}</span>
    </>
  )
  const navigate = onNavigate
    ? (event: MouseEvent<HTMLElement>) => onNavigate(object, event)
    : undefined
  const classes = cx('mtc-object-chip', className)
  let chip: ReactNode
  if (object.href) {
    chip = (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={object.href}
        className={classes}
        data-interactive="true"
        onClick={navigateOnPlainClick(navigate)}
      >
        {body}
      </a>
    )
  } else if (navigate) {
    chip = (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        data-interactive="true"
        onClick={navigate}
      >
        {body}
      </button>
    )
  } else {
    chip = <span ref={ref as Ref<HTMLSpanElement>} className={classes}>{body}</span>
  }
  return hoverCard ? <HoverCard content={hoverCard}>{chip as ReactElement}</HoverCard> : chip
})
