import {
  forwardRef,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import type { Density } from '../foundations/types'
import { Icon } from './Icon'
import { cx } from './utils'

/** One controlled tab and its associated panel. */
export interface TabItem {
  /** Stable ID used for selection and ARIA relationships. */
  id: string
  /** Visible tab label. */
  label: ReactNode
  /** Content associated with this tab. */
  panel: ReactNode
  /** Removes the tab from keyboard and pointer interaction. */
  disabled?: boolean
}

/** Props for an accessible controlled tab set. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Ordered tab definitions with unique IDs. */
  items: readonly TabItem[]
  /** ID of the selected tab. */
  value: string
  /** Called when user interaction selects a tab. */
  onValueChange: (value: string) => void
  /** Accessible name for the tab list. */
  label: string
  /** Layout and matching arrow-key axis. */
  orientation?: 'horizontal' | 'vertical'
  /** Whether arrow navigation immediately selects or waits for Enter/Space. */
  activationMode?: 'automatic' | 'manual'
  /** Optional density override for this tab set. */
  density?: Density
  /** Keeps inactive panels mounted with the native `hidden` attribute. */
  keepMounted?: boolean
}

/** Controlled tabs with roving focus and arrow/Home/End navigation. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value,
    onValueChange,
    label,
    orientation = 'horizontal',
    activationMode = 'automatic',
    density,
    keepMounted = false,
    className,
    ...rest
  },
  ref,
) {
  const generatedId = useId()
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const active = items.find(item => item.id === value && !item.disabled)
    ?? items.find(item => !item.disabled)

  const move = (currentId: string, delta: 1 | -1) => {
    const enabled = items.filter(item => !item.disabled)
    if (enabled.length === 0) return
    const currentIndex = enabled.findIndex(item => item.id === currentId)
    const next = enabled[(currentIndex + delta + enabled.length) % enabled.length]
    if (!next) return
    tabRefs.current.get(next.id)?.focus()
    if (activationMode === 'automatic') onValueChange(next.id)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, item: TabItem) => {
    const previousKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    if (event.key === previousKey || event.key === nextKey) {
      event.preventDefault()
      move(item.id, event.key === nextKey ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const enabled = items.filter(candidate => !candidate.disabled)
      const target = event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]
      if (target) {
        tabRefs.current.get(target.id)?.focus()
        if (activationMode === 'automatic') onValueChange(target.id)
      }
    } else if ((event.key === 'Enter' || event.key === ' ') && activationMode === 'manual') {
      event.preventDefault()
      onValueChange(item.id)
    }
  }

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('mtc-tabs', density && `mtc-density-${density}`, className)}
      data-orientation={orientation}
    >
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        className="mtc-tabs-list"
      >
        {items.map(item => {
          const selected = item.id === active?.id
          const tabId = `${generatedId}-tab-${item.id}`
          const panelId = `${generatedId}-panel-${item.id}`
          return (
            <button
              key={item.id}
              ref={node => {
                if (node) tabRefs.current.set(item.id, node)
                else tabRefs.current.delete(item.id)
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={selected}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              className="mtc-tab"
              onClick={() => onValueChange(item.id)}
              onKeyDown={event => onKeyDown(event, item)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="mtc-tabs-panels">
        {items.map(item => {
          const selected = item.id === active?.id
          if (!selected && !keepMounted) return null
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`${generatedId}-panel-${item.id}`}
              aria-labelledby={`${generatedId}-tab-${item.id}`}
              tabIndex={0}
              hidden={!selected}
              className="mtc-tab-panel"
            >
              {item.panel}
            </div>
          )
        })}
      </div>
    </div>
  )
})

/** One location in a breadcrumb trail. */
export interface BreadcrumbItem {
  /** Stable key for this location. */
  id?: string
  /** Human-readable location label. */
  label: ReactNode
  /** Link destination when navigation is URL-based. */
  href?: string
  /** Callback when navigation is host-managed. */
  onSelect?: () => void
}

/** Props for a semantic breadcrumb trail. */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Ordered locations from the root to the current page. */
  items: readonly BreadcrumbItem[]
  /** Accessible name for the navigation landmark. */
  label?: string
  /** Maximum visible locations; middle items collapse to an ellipsis. */
  maxItems?: number
}

/** Responsive semantic breadcrumbs using links or buttons where actionable. */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, label = 'Breadcrumbs', maxItems, className, ...rest },
  ref,
) {
  const visible = visibleBreadcrumbs(items, maxItems)
  return (
    <nav {...rest} ref={ref} aria-label={label} className={cx('mtc-breadcrumbs', className)}>
      <ol>
        {visible.map((item, index) => {
          const current = index === visible.length - 1
          return (
            <li key={`${item.id ?? 'item'}:${index}`}>
              {index > 0 && <Icon name="chevron-right" className="mtc-breadcrumb-separator" />}
              {current ? (
                <span aria-current="page" className="mtc-breadcrumb-current">{item.label}</span>
              ) : item.href ? (
                <a href={item.href} className="mtc-breadcrumb-action">{item.label}</a>
              ) : item.onSelect ? (
                <button type="button" onClick={item.onSelect} className="mtc-breadcrumb-action">
                  {item.label}
                </button>
              ) : (
                <span className="mtc-breadcrumb-muted">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

function visibleBreadcrumbs(
  items: readonly BreadcrumbItem[],
  maxItems: number | undefined,
): readonly BreadcrumbItem[] {
  if (maxItems == null || !Number.isFinite(maxItems)) return items
  const limit = Math.max(1, Math.floor(maxItems))
  if (items.length <= limit) return items
  if (limit === 1) return items.slice(-1)
  if (limit === 2) return [items[0]!, items[items.length - 1]!]
  return [
    items[0]!,
    { label: '…' },
    ...items.slice(-(limit - 2)),
  ]
}
