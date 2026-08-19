import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Intent } from '../foundations/types'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { cx } from '../components/utils'

/** Props for a neutral no-content state. */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Primary empty-state message. */
  title: ReactNode
  /** Optional explanation or next-step guidance. */
  description?: ReactNode
  /** Optional decorative visual. */
  icon?: ReactNode
  /** Optional recovery or creation actions. */
  actions?: ReactNode
  /** Uses the bounded compact presentation. */
  compact?: boolean
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, actions, compact, className, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('mtc-state', className)} data-compact={compact}>
      {icon && <div className="mtc-state-icon" aria-hidden="true">{icon}</div>}
      <div className="mtc-state-title">{title}</div>
      {description && <div className="mtc-state-description">{description}</div>}
      {actions && <div className="mtc-state-actions">{actions}</div>}
    </div>
  )
})

/** Props for a bounded loading placeholder. */
export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible and visible loading message. */
  label?: ReactNode
  /** Optional detail about the pending operation. */
  description?: ReactNode
  /** Spinner or bounded skeleton presentation. */
  variant?: 'spinner' | 'skeleton'
  /** Number of skeleton lines, clamped from one to eight. */
  lines?: number
  /** Uses the bounded compact presentation. */
  compact?: boolean
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(function LoadingState(
  {
    label = 'Loading',
    description,
    variant = 'spinner',
    lines = 3,
    compact,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cx('mtc-state mtc-loading-state', className)}
      data-compact={compact}
    >
      {variant === 'spinner' ? (
        <Icon name="spinner" className="mtc-state-spinner" />
      ) : (
        <div className="mtc-state-skeleton" aria-hidden="true">
          {Array.from({ length: boundedSkeletonLines(lines) }).map((_, index) => (
            <span key={index} style={{ width: `${88 - index * 9}%` }} />
          ))}
        </div>
      )}
      <div className="mtc-state-title">{label}</div>
      {description && <div className="mtc-state-description">{description}</div>}
    </div>
  )
})

function boundedSkeletonLines(lines: number): number {
  if (!Number.isFinite(lines)) return 3
  return Math.max(1, Math.min(Math.trunc(lines), 8))
}

/** Props for a recoverable application error state. */
export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional error heading. */
  title?: ReactNode
  /** Human-readable failure message. */
  message: ReactNode
  /** Adds a retry action when provided. */
  onRetry?: () => void
  /** Label for the generated retry action. */
  retryLabel?: string
  /** Additional host-owned recovery actions. */
  actions?: ReactNode
  /** Uses the bounded compact presentation. */
  compact?: boolean
  /** Error severity presentation. */
  intent?: Extract<Intent, 'danger' | 'warning'>
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  {
    title = 'Unable to load',
    message,
    onRetry,
    retryLabel = 'Retry',
    actions,
    compact,
    intent = 'danger',
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role="alert"
      className={cx('mtc-state mtc-error-state', className)}
      data-compact={compact}
      data-intent={intent}
    >
      <div className="mtc-state-icon" aria-hidden="true">
        <Icon name={intent === 'warning' ? 'warning' : 'error'} />
      </div>
      <div className="mtc-state-title">{title}</div>
      <div className="mtc-state-description">{message}</div>
      {(onRetry || actions) && (
        <div className="mtc-state-actions">
          {onRetry && <Button size="small" onClick={onRetry}>{retryLabel}</Button>}
          {actions}
        </div>
      )}
    </div>
  )
})
