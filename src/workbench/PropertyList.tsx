import {
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Density } from '../foundations/types'
import { cx } from '../components/utils'
import { PropertyValue } from '../objects/PropertyValue'
import type { PropertyKind } from '../objects/propertyFormat'

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
  /** Presentation kind; inferred from the value when unset. */
  kind?: PropertyKind
  /** Kind refinement such as `currency:USD` or `datetime`. */
  format?: string
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
 * Generic definition list for arbitrary host-owned metadata. Each value is
 * rendered by `PropertyValue`: numbers grouped, booleans as Yes/No, lists as
 * chips and nested objects in a disclosure, never as raw JSON. Pass `kind`
 * or `format` on an item for typed rendering (currency, dates, ids).
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
          <dd>
            {isValidElement(item.value)
              ? item.value
              : <PropertyValue value={item.value} kind={item.kind} format={item.format} emptyValue={emptyValue} />}
          </dd>
        </div>
      ))}
    </dl>
  )
})
