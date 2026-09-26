import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '../components/Navigation'
import { cx } from '../components/utils'

/** Props for a page's header block. */
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Location trail from the root to this page. */
  breadcrumbs?: readonly BreadcrumbItem[]
  /** Page title (an `h1`); omit when `children` supplies the heading. */
  title?: ReactNode
  /** One line under the title. */
  description?: ReactNode
  /** Page actions, aligned to the end. */
  actions?: ReactNode
  /** A tab strip under the heading, such as route tabs. */
  tabs?: ReactNode
  /** Sticks to the top of the scrolling page. */
  sticky?: boolean
}

/**
 * The top of every page: breadcrumbs, the title (or custom heading content
 * such as an `ObjectHeader`), a description, actions, and an optional tab
 * strip. Sticky when asked, flat always.
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { breadcrumbs, title, description, actions, tabs, sticky = false, className, children, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('mtc-page-header', className)} data-sticky={sticky || undefined}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mtc-page-header-crumbs" />}
      <div className="mtc-page-header-main">
        <div className="mtc-page-header-heading">
          {children ?? (
            <>
              {title && <h1 className="mtc-page-header-title">{title}</h1>}
              {description && <p className="mtc-page-header-description">{description}</p>}
            </>
          )}
        </div>
        {actions && <div className="mtc-page-header-actions">{actions}</div>}
      </div>
      {tabs && <div className="mtc-page-header-tabs">{tabs}</div>}
    </div>
  )
})
