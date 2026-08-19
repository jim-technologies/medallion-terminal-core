import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Density } from '../foundations/types'
import { cx } from '../components/utils'

/** Props for the outer application work surface. */
export interface AppSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional density override for the composed surface. */
  density?: Density
  /** Fills the available parent height when true. */
  fullHeight?: boolean
}

/** Neutral application canvas for composing toolkit controls without Dashboard. */
export const AppSurface = forwardRef<HTMLDivElement, AppSurfaceProps>(function AppSurface(
  { density, fullHeight = true, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('mtc-app-surface', density && `mtc-density-${density}`, className)}
      data-full-height={fullHeight}
    >
      {children}
    </div>
  )
})

/** Props for a horizontally scrollable application toolbar. */
export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the toolbar landmark. */
  label?: string
  /** Fixed leading content, such as a title or navigation control. */
  start?: ReactNode
  /** Fixed trailing content, such as status or primary actions. */
  end?: ReactNode
  /** Optional density override for this toolbar. */
  density?: Density
  /** Pins the toolbar to the top of its nearest scrolling ancestor. */
  sticky?: boolean
}

/** Application toolbar with independent start, overflow, and end regions. */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  {
    label = 'Toolbar',
    start,
    end,
    density,
    sticky,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role="toolbar"
      aria-label={label}
      className={cx('mtc-app-toolbar', density && `mtc-density-${density}`, className)}
      data-sticky={sticky || undefined}
    >
      {start && <div className="mtc-toolbar-region mtc-toolbar-start">{start}</div>}
      <div className="mtc-toolbar-region mtc-toolbar-main">{children}</div>
      {end && <div className="mtc-toolbar-region mtc-toolbar-end">{end}</div>}
    </div>
  )
})

/** Props for a routing-agnostic application sidebar. */
export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the complementary landmark. */
  label: string
  /** Fixed content above the scrolling pane. */
  header?: ReactNode
  /** Fixed content below the scrolling pane. */
  footer?: ReactNode
  /** CSS width or numeric pixel width. */
  width?: number | string
  /** Visually and semantically hides the sidebar. */
  collapsed?: boolean
  /** Edge whose border separates the sidebar from adjacent content. */
  side?: 'left' | 'right'
}

/** Scroll-safe navigation or explorer sidebar. */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    label,
    header,
    footer,
    width = 280,
    collapsed = false,
    side = 'left',
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const sidebarStyle = {
    '--mtc-sidebar-width': typeof width === 'number' ? `${width}px` : width,
    ...style,
  } as CSSProperties
  return (
    <aside
      {...rest}
      ref={ref}
      aria-label={label}
      aria-hidden={collapsed || undefined}
      className={cx('mtc-sidebar', className)}
      data-collapsed={collapsed}
      data-side={side}
      style={sidebarStyle}
    >
      {header && <div className="mtc-sidebar-header">{header}</div>}
      <div className="mtc-sidebar-content">{children}</div>
      {footer && <div className="mtc-sidebar-footer">{footer}</div>}
    </aside>
  )
})

/** Props for an arbitrary object or selection inspector. */
export interface InspectorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Accessible name for the complementary landmark. */
  label: string
  /** Optional visible inspector heading. */
  title?: ReactNode
  /** Secondary heading context. */
  subtitle?: ReactNode
  /** Header actions. */
  actions?: ReactNode
  /** Fixed content below the scrolling pane. */
  footer?: ReactNode
  /** CSS width or numeric pixel width. */
  width?: number | string
  /** Visually and semantically hides the inspector when false. */
  open?: boolean
}

/** Generic details pane that owns presentation but no selection semantics. */
export const Inspector = forwardRef<HTMLElement, InspectorProps>(function Inspector(
  {
    label,
    title,
    subtitle,
    actions,
    footer,
    width = 320,
    open = true,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const inspectorStyle = {
    '--mtc-inspector-width': typeof width === 'number' ? `${width}px` : width,
    ...style,
  } as CSSProperties
  return (
    <aside
      {...rest}
      ref={ref}
      aria-label={label}
      aria-hidden={!open || undefined}
      className={cx('mtc-inspector', className)}
      data-open={open}
      style={inspectorStyle}
    >
      {(title || actions) && (
        <div className="mtc-inspector-header">
          <div className="mtc-inspector-heading">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="mtc-inspector-actions">{actions}</div>}
        </div>
      )}
      <div className="mtc-inspector-content">{children}</div>
      {footer && <div className="mtc-inspector-footer">{footer}</div>}
    </aside>
  )
})
