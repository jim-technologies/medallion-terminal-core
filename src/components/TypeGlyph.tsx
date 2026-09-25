import { forwardRef, type HTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'
import { cx } from './utils'

/**
 * The twelve object type identity slots, in hue order. Each maps to the
 * `--mtc-type-{slot}-fg|bg` tokens and is used only for type chips, facet
 * dots, and graph nodes.
 */
export const TYPE_COLORS = [
  'azure',
  'cyan',
  'teal',
  'green',
  'lime',
  'olive',
  'amber',
  'orange',
  'red',
  'rose',
  'magenta',
  'violet',
] as const

/** One object type identity slot. */
export type TypeColor = (typeof TYPE_COLORS)[number]

/**
 * Deterministic slot for a type without presentation hints: a 32-bit FNV-1a
 * hash of its id with a final avalanche step, so a type keeps its colour
 * across reloads and hosts.
 */
export function typeColorFor(typeId: string): TypeColor {
  let hash = 0x811c9dc5
  for (let index = 0; index < typeId.length; index++) {
    hash ^= typeId.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x85ebca6b)
  hash ^= hash >>> 13
  hash = Math.imul(hash, 0xc2b2ae35)
  hash ^= hash >>> 16
  return TYPE_COLORS[(hash >>> 0) % TYPE_COLORS.length]
}

/** Glyph chip sizes in pixels. */
export type TypeGlyphSize = 16 | 20 | 24 | 40

const ICON_SIZE: Record<TypeGlyphSize, number> = { 16: 11, 20: 12, 24: 14, 40: 22 }

/** Props for an object type identity chip. */
export interface TypeGlyphProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Type icon; the generic `object` glyph when the type declares none. */
  icon?: IconName
  /** Identity slot; use `typeColorFor(typeId)` when the type declares none. */
  color: TypeColor
  /** Chip size in pixels. */
  size?: TypeGlyphSize
  /**
   * Accessible type name. Omit when adjacent text already names the type;
   * the chip is then decorative.
   */
  label?: string
}

/**
 * The object type chip: a type icon on its identity slot. It is the only
 * place type colour appears in chrome, and it never carries status.
 */
export const TypeGlyph = forwardRef<HTMLSpanElement, TypeGlyphProps>(function TypeGlyph(
  { icon = 'object', color, size = 20, label, className, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={cx('mtc-type-glyph', className)}
      data-color={color}
      data-size={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Icon name={icon} size={ICON_SIZE[size]} strokeWidth={size <= 20 ? 2 : 1.75} />
    </span>
  )
})
