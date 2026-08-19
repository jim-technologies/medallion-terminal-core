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

/** Generic definition list for arbitrary host-owned metadata. */
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

function formatPropertyValue(value: unknown, emptyValue: ReactNode): ReactNode {
  if (value == null || value === '') return emptyValue
  if (isValidElement(value)) return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }
  try {
    const serialized = JSON.stringify(value)
    if (typeof serialized !== 'string') return String(value)
    return serialized.length > 5000 ? `${serialized.slice(0, 5000)}…` : serialized
  } catch {
    return String(value)
  }
}
