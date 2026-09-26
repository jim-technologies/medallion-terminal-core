import type { CSSProperties } from 'react'
import {
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from './OperationalShowcasePrimitives'
import './NeutralMark.css'

export interface NeutralMarkProps {
  /** A generic glyph that says what the product does. */
  icon: OperationalShowcaseIconName
  /** Fill behind the glyph; defaults to a neutral slate. */
  color?: string
  /** Square size in pixels. */
  size?: number
  /** Accessible name; omit when a visible name sits beside the mark. */
  label?: string
  className?: string
}

/**
 * The product mark every clone showcase uses: a generic glyph on a plain
 * square. Clones reproduce another product's layout so the toolkit can be
 * judged against it; they never reproduce its name, logo or wordmark.
 */
export function NeutralMark({ icon, color, size = 28, label, className }: NeutralMarkProps) {
  return (
    <span
      className={['clone-neutral-mark', className].filter(Boolean).join(' ')}
      style={{
        '--clone-mark-size': `${size}px`,
        ...(color ? { '--clone-mark-color': color } : {}),
      } as CSSProperties}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <OperationalShowcaseIcon name={icon} size={Math.round(size * 0.6)} aria-hidden="true" />
    </span>
  )
}
