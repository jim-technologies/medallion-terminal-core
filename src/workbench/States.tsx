import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useLocale, useMessage, type Translate } from '../foundations/DesignSystemProvider'
import { formatDuration } from '../foundations/intl'
import type { MessageKey } from '../foundations/messages'
import type { Intent } from '../foundations/types'
import type { SourceError, SourceErrorKind } from '../core/sourceError'
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
    label,
    description,
    variant = 'spinner',
    lines = 3,
    compact,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessage()
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
      <div className="mtc-state-title">{label ?? t('state.loading')}</div>
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
  /** Optional error heading. Defaults to the typed error's title. */
  title?: ReactNode
  /**
   * Human-readable failure message. Defaults to product copy for the typed
   * error's kind; required when no `error` is given.
   */
  message?: ReactNode
  /**
   * A typed transport failure. Chooses the title, copy and intent from its
   * kind and puts the server's reason, error code and request id in a
   * Details disclosure rather than the headline.
   */
  error?: SourceError
  /** Adds a retry action when provided. */
  onRetry?: () => void
  /** Label for the generated retry action. */
  retryLabel?: string
  /** Additional host-owned recovery actions. */
  actions?: ReactNode
  /** Uses the bounded compact presentation. */
  compact?: boolean
  /** Error severity presentation. Defaults from the typed error's kind. */
  intent?: Extract<Intent, 'danger' | 'warning'>
}

const ERROR_COPY: Readonly<Record<SourceErrorKind, readonly [MessageKey, MessageKey]>> = {
  unauthenticated: ['error.unauthenticated.title', 'error.unauthenticated.description'],
  forbidden: ['error.forbidden.title', 'error.forbidden.description'],
  not_found: ['error.not_found.title', 'error.not_found.description'],
  rate_limited: ['error.rate_limited.title', 'error.rate_limited.description'],
  unavailable: ['error.unavailable.title', 'error.unavailable.description'],
  invalid: ['error.invalid.title', 'error.invalid.description'],
  unknown: ['state.error.title', 'error.unknown.description'],
}

/** Title and product copy for a typed failure, in the scope's language. */
function errorCopy(error: SourceError, t: Translate, locale: string): [string, string] {
  const [title, description] = ERROR_COPY[error.kind] ?? ERROR_COPY.unknown
  if (error.kind === 'rate_limited' && error.retryAfterMs !== undefined) {
    return [t(title), t('error.rate_limited.retryIn', { duration: formatDuration(error.retryAfterMs, { locale }) })]
  }
  return [t(title), t(description)]
}

/** Props for the raw-detail disclosure under a state. */
interface StateDetailsProps {
  /** The server's own words, kept out of the headline. */
  reason?: ReactNode
  code?: string
  requestId?: string
}

/**
 * The server's reason, error code and request id, collapsed by default so
 * people read product copy first and can still quote the request id.
 */
function StateDetails({ reason, code, requestId }: StateDetailsProps) {
  const t = useMessage()
  if (!reason && !code && !requestId) return null
  return (
    <details className="mtc-state-details">
      <summary>{t('state.details')}</summary>
      {reason && <p>{reason}</p>}
      {(code || requestId) && (
        <dl>
          {code && <><dt>{t('state.errorCode')}</dt><dd><code>{code}</code></dd></>}
          {requestId && <><dt>{t('state.requestId')}</dt><dd><code>{requestId}</code></dd></>}
        </dl>
      )}
    </details>
  )
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(function ErrorState(
  {
    title,
    message,
    error,
    onRetry,
    retryLabel,
    actions,
    compact,
    intent,
    className,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const { locale } = useLocale()
  const [typedTitle, typedMessage] = error ? errorCopy(error, t, locale) : [undefined, undefined]
  const tone = intent ?? (error && (error.kind === 'rate_limited' || error.kind === 'unavailable') ? 'warning' : 'danger')
  return (
    <div
      {...rest}
      ref={ref}
      role="alert"
      className={cx('mtc-state mtc-error-state', className)}
      data-compact={compact}
      data-intent={tone}
      data-error-kind={error?.kind}
    >
      <div className="mtc-state-icon" aria-hidden="true">
        <Icon name={tone === 'warning' ? 'warning' : 'error'} />
      </div>
      <div className="mtc-state-title">{title ?? typedTitle ?? t('state.error.title')}</div>
      <div className="mtc-state-description">{message ?? typedMessage}</div>
      {error && (
        <StateDetails reason={error.message} code={error.code} requestId={error.requestId} />
      )}
      {(onRetry || actions) && (
        <div className="mtc-state-actions">
          {onRetry && <Button size="small" onClick={onRetry}>{retryLabel ?? t('state.retry')}</Button>}
          {actions}
        </div>
      )}
    </div>
  )
})
