import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { IconButton } from '../components/Button'
import { Panel } from '../components/Display'
import { Input } from '../components/FormControls'
import { Icon } from '../components/Icon'
import { cx } from '../components/utils'
import { useLocale, useMessage } from '../foundations/DesignSystemProvider'
import type { Density, StatusTone } from '../foundations/types'
import { PropertyValue } from './PropertyValue'
import { formatPropertyText, resolvePropertyKind, type PropertyKind } from './propertyFormat'
import type { ObjectRef } from './types'

/** One property of an object: its label, value and presentation. */
export interface PropertyDefinition {
  /** Stable property key. */
  id: string
  /** Human-readable name. */
  label: string
  /** The raw value. */
  value: unknown
  /** Presentation kind; inferred from the value when unset. */
  kind?: PropertyKind
  /** Kind refinement such as `currency:USD`. */
  format?: string
  /** Status tones for enum values. */
  tones?: Readonly<Record<string, StatusTone>>
  /** Group heading, such as "Commercial". Groups keep first-seen order. */
  group?: string
  /** Explanation shown under the label. */
  description?: ReactNode
}

/** Props for a grouped, filterable property panel. */
export interface PropertyPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Ordered properties. */
  properties: readonly PropertyDefinition[]
  /** Panel title; defaults to "Properties". */
  title?: ReactNode
  /** Shows a filter action in the header. */
  filterable?: boolean
  /** Extra header actions. */
  actions?: ReactNode
  /** Shown for empty values. */
  emptyValue?: ReactNode
  /** Anchor for relative times. */
  now?: number
  /** Optional row density override. */
  density?: Density
  /** Label column width in pixels (the value column takes the rest). */
  labelWidth?: number
  /** Host navigation for object-reference values. */
  onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void
  /** Heading level of the panel title. */
  headingLevel?: 2 | 3 | 4
}

/**
 * An object's properties as a grouped definition list inside a panel: the
 * label column, then each value rendered by `PropertyValue`. The header
 * shows "n of m" and, when filterable, filters by label or value text.
 */
export const PropertyPanel = forwardRef<HTMLElement, PropertyPanelProps>(function PropertyPanel(
  {
    properties,
    title,
    filterable = true,
    actions,
    emptyValue,
    now,
    density,
    labelWidth = 160,
    onNavigate,
    headingLevel,
    className,
    style,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const { locale, timeZone } = useLocale()
  const filterId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return properties
    return properties.filter(property => {
      const text = formatPropertyText(
        property.value,
        resolvePropertyKind(property.value, property.kind, property.format),
        { locale, timeZone },
      )
      return property.label.toLowerCase().includes(needle) || text.toLowerCase().includes(needle)
    })
  }, [properties, query, locale, timeZone])

  const groups = useMemo(() => {
    const ordered = new Map<string, PropertyDefinition[]>()
    for (const property of visible) {
      const key = property.group ?? ''
      ordered.set(key, [...(ordered.get(key) ?? []), property])
    }
    return [...ordered.entries()]
  }, [visible])

  const toggleFilter = () => {
    if (filterOpen) {
      setQuery('')
      setFilterOpen(false)
    } else {
      setFilterOpen(true)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  return (
    <Panel
      {...rest}
      ref={ref}
      title={title ?? t('propertyPanel.title')}
      subtitle={t('propertyPanel.count', { shown: visible.length, total: properties.length })}
      headingLevel={headingLevel}
      className={cx('mtc-property-panel', density && `mtc-density-${density}`, className)}
      style={{ '--mtc-property-label-width': `${labelWidth}px`, ...style } as CSSProperties}
      actions={(filterable || actions) && (
        <>
          {actions}
          {filterable && (
            <IconButton
              icon={<Icon name="filter" />}
              aria-label={t('propertyPanel.filter')}
              aria-expanded={filterOpen}
              aria-controls={filterOpen ? filterId : undefined}
              variant={filterOpen ? 'outline' : 'ghost'}
              size="small"
              onClick={toggleFilter}
            />
          )}
        </>
      )}
    >
      {filterOpen && (
        <div className="mtc-property-panel-filter">
          <Input
            ref={inputRef}
            id={filterId}
            type="search"
            size="small"
            value={query}
            aria-label={t('propertyPanel.filter')}
            placeholder={t('propertyPanel.filter')}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                event.preventDefault()
                toggleFilter()
              }
            }}
          />
        </div>
      )}
      {visible.length === 0 ? (
        <p className="mtc-property-panel-empty">{t('propertyPanel.noMatch', { query: query.trim() })}</p>
      ) : groups.map(([group, items]) => (
        <div key={group || '_'} className="mtc-property-group" role="group" aria-label={group || undefined}>
          {group && <div className="mtc-property-group-label" aria-hidden="true">{group}</div>}
          <dl className="mtc-property-rows">
            {items.map(property => (
              <div key={property.id} className="mtc-property-row">
                <dt>
                  <span>{property.label}</span>
                  {property.description && <small>{property.description}</small>}
                </dt>
                <dd>
                  <PropertyValue
                    value={property.value}
                    kind={property.kind}
                    format={property.format}
                    tones={property.tones}
                    emptyValue={emptyValue}
                    now={now}
                    onNavigate={onNavigate}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </Panel>
  )
})
