import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useMessage } from '../foundations/DesignSystemProvider'
import type { ComponentSize } from '../foundations/types'
import { Button } from './Button'
import { Icon } from './Icon'
import { cx } from './utils'

/** Props for page or cursor navigation. */
export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name of the navigation, such as "Record pages". */
  label?: string
  /** Current page (1-based) in numbered mode. */
  page?: number
  /** Number of pages in numbered mode; omit when the total is unknown. */
  pageCount?: number
  /** Numbered mode: called with the requested page. */
  onPageChange?: (page: number) => void
  /** Cursor mode: whether an earlier page exists. */
  hasPrevious?: boolean
  /** Cursor mode: whether a later page exists (an opaque next cursor). */
  hasNext?: boolean
  /** Cursor mode: go back one page. */
  onPrevious?: () => void
  /** Cursor mode: follow the next cursor. */
  onNext?: () => void
  /** Leading summary, such as "1–25 of 1,204". */
  summary?: ReactNode
  /** Overrides "Previous". */
  previousLabel?: string
  /** Overrides "Next". */
  nextLabel?: string
  /** Button size. */
  size?: ComponentSize
}

/**
 * Previous and Next with an optional summary: numbered (`page`,
 * `pageCount`, `onPageChange`) or cursor-based (`hasPrevious`, `hasNext`,
 * `onPrevious`, `onNext`) for opaque page tokens.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    label,
    page,
    pageCount,
    onPageChange,
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
    summary,
    previousLabel,
    nextLabel,
    size = 'small',
    className,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const numbered = page !== undefined
  const canPrevious = numbered ? page > 1 : Boolean(hasPrevious)
  const canNext = numbered ? (pageCount === undefined ? Boolean(hasNext) : page < pageCount) : Boolean(hasNext)
  const previous = () => (numbered ? onPageChange?.(Math.max(1, page - 1)) : onPrevious?.())
  const next = () => (numbered ? onPageChange?.(page + 1) : onNext?.())
  return (
    <nav {...rest} ref={ref} aria-label={label ?? t('pagination.label')} className={cx('mtc-pagination', className)}>
      {summary != null && <span className="mtc-pagination-summary">{summary}</span>}
      <div className="mtc-pagination-controls">
        <Button size={size} variant="ghost" startIcon={<Icon name="chevron-left" />} disabled={!canPrevious} onClick={previous}>
          {previousLabel ?? t('pagination.previous')}
        </Button>
        {numbered && (
          <span className="mtc-pagination-page" aria-live="polite">
            {pageCount === undefined
              ? t('pagination.pageOnly', { page })
              : t('pagination.page', { page, count: pageCount })}
          </span>
        )}
        <Button size={size} variant="ghost" endIcon={<Icon name="chevron-right" />} disabled={!canNext} onClick={next}>
          {nextLabel ?? t('pagination.next')}
        </Button>
      </div>
    </nav>
  )
})
