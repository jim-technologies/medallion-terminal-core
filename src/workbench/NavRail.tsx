import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { IconButton } from '../components/Button'
import { Icon, type IconName } from '../components/Icon'
import { navigateOnPlainClick } from '../components/navigation'
import { TypeGlyph } from '../components/TypeGlyph'
import { cx } from '../components/utils'
import { useMessage } from '../foundations/DesignSystemProvider'
import { typePresentation, type ObjectTypeRef } from '../objects/types'

/** One destination in the navigation rail. */
export interface NavRailItem {
  id: string
  label: string
  /** Destination; without it the item is a button for `onNavigate`. */
  href?: string
  /** Area icon (Home, Explore, Files). */
  icon?: IconName
  /** Object type glyph instead of an icon (pinned object types). */
  type?: ObjectTypeRef
  /** Count after the label, such as objects of a type. */
  count?: ReactNode
  disabled?: boolean
}

/** A titled group of destinations, such as "Operate" or "Platform". */
export interface NavRailSection {
  id: string
  /** Section label; the first section usually has none. */
  label?: string
  items: readonly NavRailItem[]
}

/** Props for the application navigation rail. */
export interface NavRailProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Accessible name of the navigation landmark. */
  label: string
  sections: readonly NavRailSection[]
  /** The current destination (`aria-current="page"`). */
  activeId?: string
  /** Host navigation for a plain click (links keep their `href`). */
  onNavigate?: (item: NavRailItem, event: MouseEvent<HTMLElement>) => void
  /** Icons only, 48 px wide; labels become tooltips and accessible names. */
  collapsed?: boolean
  /** Shows the collapse toggle and receives its requests. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Content above the sections, such as a scope switcher. */
  header?: ReactNode
  /** Content below the sections. */
  footer?: ReactNode
}

/**
 * The shell's left rail: sections of destinations with an icon or type
 * glyph, a label and an optional count, the current one marked with the
 * selection fill and a 2 px accent bar. It collapses to 48 px icons; on
 * phones the product shell shows it inside a drawer.
 */
export const NavRail = forwardRef<HTMLElement, NavRailProps>(function NavRail(
  {
    label,
    sections,
    activeId,
    onNavigate,
    collapsed = false,
    onCollapsedChange,
    header,
    footer,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={label}
      className={cx('mtc-nav-rail', className)}
      data-collapsed={collapsed || undefined}
    >
      {header && <div className="mtc-nav-rail-header">{header}</div>}
      <div className="mtc-nav-rail-sections">
        {sections.map(section => (
          <div key={section.id} className="mtc-nav-rail-section">
            {section.label && (
              <div className="mtc-nav-rail-section-label" aria-hidden={collapsed || undefined}>{section.label}</div>
            )}
            <ul aria-label={section.label}>
              {section.items.map(item => {
                const active = item.id === activeId
                const visual = item.type
                  ? (() => {
                    const { icon, color } = typePresentation(item.type)
                    return <TypeGlyph icon={icon} color={color} size={16} />
                  })()
                  : item.icon ? <Icon name={item.icon} className="mtc-nav-rail-icon" /> : null
                const content = (
                  <>
                    {visual}
                    <span className="mtc-nav-rail-label">{item.label}</span>
                    {item.count != null && <span className="mtc-nav-rail-count">{item.count}</span>}
                  </>
                )
                const common = {
                  className: 'mtc-nav-rail-item',
                  'data-active': active || undefined,
                  'aria-current': active ? ('page' as const) : undefined,
                  title: collapsed ? item.label : undefined,
                }
                return (
                  <li key={item.id}>
                    {item.href && !item.disabled ? (
                      <a
                        {...common}
                        href={item.href}
                        onClick={navigateOnPlainClick(onNavigate ? event => onNavigate(item, event) : undefined)}
                      >
                        {content}
                      </a>
                    ) : (
                      <button
                        {...common}
                        type="button"
                        disabled={item.disabled}
                        onClick={event => onNavigate?.(item, event)}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      {(footer || onCollapsedChange) && (
        <div className="mtc-nav-rail-footer">
          {footer}
          {onCollapsedChange && (
            <IconButton
              icon={<Icon name="panel-left" />}
              aria-label={collapsed ? t('navRail.expand') : t('navRail.collapse')}
              aria-expanded={!collapsed}
              variant="ghost"
              size="small"
              onClick={() => onCollapsedChange(!collapsed)}
            />
          )}
        </div>
      )}
    </nav>
  )
})
