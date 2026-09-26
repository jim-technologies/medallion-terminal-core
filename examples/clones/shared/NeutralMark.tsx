import type { CSSProperties } from 'react'
import {
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from './OperationalShowcasePrimitives'
import './NeutralMark.css'

export interface NeutralMarkProps {
  /** A generic glyph that says what the product does. */
  icon: OperationalShowcaseIconName
  /** Square size in pixels. */
  size?: number
  /** Accessible name; omit when a visible name sits beside the mark. */
  label?: string
  className?: string
}

/**
 * The product mark every clone showcase uses: a generic glyph on one plain
 * slate square, the same in every clone. Clones reproduce another product's
 * layout so the toolkit can be judged against it; they never reproduce its
 * name, logo, wordmark or the brand colour its logo is known by, so the mark
 * takes no colour.
 */
export function NeutralMark({ icon, size = 28, label, className }: NeutralMarkProps) {
  return (
    <span
      className={['clone-neutral-mark', className].filter(Boolean).join(' ')}
      style={{ '--clone-mark-size': `${size}px` } as CSSProperties}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <OperationalShowcaseIcon name={icon} size={Math.round(size * 0.6)} aria-hidden="true" />
    </span>
  )
}
