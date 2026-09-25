import {
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Density } from '../foundations/types'
import { cx } from '../components/utils'

/** One named value in a PropertyList. */
export interface PropertyListItem {
  /** Stable row key. */
  id?: string
  /** Human-readable property name. */
  label: ReactNode
  /** Arbitrary value rendered safely without HTML interpretation. */
  value: unknown
  /** Optional explanation shown with the property name. */
  description?: ReactNode
}

/** Props for arbitrary object metadata. */
export interface PropertyListProps extends HTMLAttributes<HTMLDListElement> {
  /** Ordered property definitions. Takes precedence over `properties`. */
  items?: readonly PropertyListItem[]
  /** Convenience object converted to ordered entries with `Object.entries`. */
  properties?: Readonly<Record<string, unknown>>
  /** Optional density override for property rows. */
  density?: Density
  /** Content used for null, undefined, and empty-string values. */
  emptyValue?: ReactNode
}

/**
 * Generic definition list for arbitrary host-owned metadata. Values render in
 * the sans face at the base size; lists of plain values read as a
 * comma-separated list, and only structured values fall back to monospace
 * JSON.
 */
export const PropertyList = forwardRef<HTMLDListElement, PropertyListProps>(function PropertyList(
  {
    items,
    properties,
    density,
    emptyValue = '—',
    className,
    ...rest
  },
  ref,
) {
  const entries: readonly PropertyListItem[] = items
    ?? Object.entries(properties ?? {}).map(([label, value]) => ({ id: label, label, value }))
  return (
    <dl
      {...rest}
      ref={ref}
      className={cx('mtc-property-list', density && `mtc-density-${density}`, className)}
    >
      {entries.map((item, index) => (
        <div key={item.id ?? index} className="mtc-property-row">
          <dt>
            <span>{item.label}</span>
            {item.description && <small>{item.description}</small>}
          </dt>
          <dd>{formatPropertyValue(item.value, emptyValue)}</dd>
        </div>
      ))}
    </dl>
  )
})

const MAX_SERIALIZED_LENGTH = 5000

function isPlainValue(value: unknown): value is string | number | bigint | boolean {
  return typeof value === 'string' || typeof value === 'number'
    || typeof value === 'bigint' || typeof value === 'boolean'
}

function plainText(value: string | number | bigint | boolean): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function formatPropertyValue(value: unknown, emptyValue: ReactNode): ReactNode {
  if (value == null || value === '') return emptyValue
  if (isValidElement(value)) return value
  if (isPlainValue(value)) return plainText(value)
  if (Array.isArray(value) && value.every(isPlainValue)) {
    if (value.length === 0) return emptyValue
    const joined = value.map(plainText).join(', ')
    return joined.length > MAX_SERIALIZED_LENGTH ? `${joined.slice(0, MAX_SERIALIZED_LENGTH)}…` : joined
  }
  try {
    const serialized = JSON.stringify(value)
    if (typeof serialized !== 'string') return String(value)
    return (
      <code>
        {serialized.length > MAX_SERIALIZED_LENGTH
          ? `${serialized.slice(0, MAX_SERIALIZED_LENGTH)}…`
          : serialized}
      </code>
    )
  } catch {
    return String(value)
  }
}
