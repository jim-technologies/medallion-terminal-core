import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useLocale, useMessage, type Translate } from '../foundations/DesignSystemProvider'
import { formatDuration, formatRelativeTime, type DateInput } from '../foundations/intl'
import type { MessageKey } from '../foundations/messages'
import type { Intent } from '../foundations/types'
import type { SourceError, SourceErrorKind } from '../core/sourceError'
import { Button } from '../components/Button'
import { Icon, type IconName } from '../components/Icon'
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


/** Props shared by the access, session, availability and freshness states. */
export interface StatusStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Replaces the default heading. */
  title?: ReactNode
  /** Replaces the default explanation. */
  description?: ReactNode
  /**
   * The typed failure behind the state. Its reason, code and request id go in
   * a Details disclosure.
   */
  error?: SourceError
  /** Additional host-owned actions. */
  actions?: ReactNode
  /** Uses the bounded compact presentation. */
  compact?: boolean
}

interface StateFrameProps extends StatusStateProps {
  icon: IconName
  tone: 'neutral' | 'warning'
  state: string
  primaryAction?: ReactNode
}

const StateFrame = forwardRef<HTMLDivElement, StateFrameProps>(function StateFrame(
  { icon, tone, state, title, description, error, actions, primaryAction, compact, className, ...rest },
  ref,
) {
  return (
    <div
      role="status"
      {...rest}
      ref={ref}
      className={cx('mtc-state', className)}
      data-compact={compact}
      data-intent={tone}
      data-state={state}
    >
      <div className="mtc-state-icon" aria-hidden="true"><Icon name={icon} /></div>
      <div className="mtc-state-title">{title}</div>
      {description && <div className="mtc-state-description">{description}</div>}
      {error && <StateDetails reason={error.message} code={error.code} requestId={error.requestId} />}
      {(primaryAction || actions) && (
        <div className="mtc-state-actions">
          {primaryAction}
          {actions}
        </div>
      )}
    </div>
  )
})

/** Props for a denied scope. */
export interface AccessDeniedStateProps extends StatusStateProps {
  /** What was denied, in words: `bucket finance`. */
  resource?: string
}

/**
 * A scope the person may not read (HTTP 403, `permission_denied`). Render it
 * where the denied scope would be, so the rest of the app stays usable.
 */
export const AccessDeniedState = forwardRef<HTMLDivElement, AccessDeniedStateProps>(function AccessDeniedState(
  { resource, title, description, ...rest },
  ref,
) {
  const t = useMessage()
  return (
    <StateFrame
      {...rest}
      ref={ref}
      icon="lock"
      tone="neutral"
      state="access-denied"
      title={title ?? t('error.forbidden.title')}
      description={description ?? (resource
        ? t('state.accessDenied.resource', { resource })
        : t('error.forbidden.description'))}
    />
  )
})

/** Props for a missing session. */
export interface SignedOutStateProps extends StatusStateProps {
  /** Starts sign-in; renders the primary action. */
  onSignIn?: () => void
  /** Label for the sign-in action. */
  signInLabel?: string
}

/** No session at all: the person has to sign in before anything loads. */
export const SignedOutState = forwardRef<HTMLDivElement, SignedOutStateProps>(function SignedOutState(
  { onSignIn, signInLabel, title, description, ...rest },
  ref,
) {
  const t = useMessage()
  return (
    <StateFrame
      {...rest}
      ref={ref}
      icon="sign-in"
      tone="neutral"
      state="signed-out"
      title={title ?? t('state.signedOut.title')}
      description={description ?? t('state.signedOut.description')}
      primaryAction={onSignIn && (
        <Button size="small" intent="primary" variant="solid" onClick={onSignIn}>
          {signInLabel ?? t('state.signedOut.action')}
        </Button>
      )}
    />
  )
})

/** Props for an expired session. */
export interface SessionExpiredStateProps extends StatusStateProps {
  /** Renews the session (and retries); renders the primary action. */
  onContinue?: () => void
  /** Label for the renew action. */
  continueLabel?: string
}

/**
 * The session ended mid-journey (HTTP 401). The page, its route and drafts
 * stay; continuing renews the session instead of starting over.
 */
export const SessionExpiredState = forwardRef<HTMLDivElement, SessionExpiredStateProps>(function SessionExpiredState(
  { onContinue, continueLabel, title, description, ...rest },
  ref,
) {
  const t = useMessage()
  return (
    <StateFrame
      {...rest}
      ref={ref}
      icon="hourglass"
      tone="neutral"
      state="session-expired"
      title={title ?? t('state.sessionExpired.title')}
      description={description ?? t('state.sessionExpired.description')}
      primaryAction={onContinue && (
        <Button size="small" intent="primary" variant="solid" onClick={onContinue}>
          {continueLabel ?? t('state.sessionExpired.action')}
        </Button>
      )}
    />
  )
})

/** Props for a missing object. */
export interface NotFoundStateProps extends StatusStateProps {
  /** What is missing, in words: `bucket finance`. */
  resource?: string
}

/** The object does not exist or moved (HTTP 404, `not_found`). */
export const NotFoundState = forwardRef<HTMLDivElement, NotFoundStateProps>(function NotFoundState(
  { resource, title, description, ...rest },
  ref,
) {
  const t = useMessage()
  return (
    <StateFrame
      {...rest}
      ref={ref}
      icon="search"
      tone="neutral"
      state="not-found"
      title={title ?? t('error.not_found.title')}
      description={description ?? (resource
        ? t('state.notFound.resource', { resource })
        : t('error.not_found.description'))}
    />
  )
})

/** Props for a throttled request. */
export interface RateLimitedStateProps extends StatusStateProps {
  /** How long the server asked to wait; defaults to the error's `Retry-After`. */
  retryAfterMs?: number
  /** Adds a retry action. */
  onRetry?: () => void
  /** Label for the retry action. */
  retryLabel?: string
}

/** Too many requests (HTTP 429, `resource_exhausted`), with the wait if known. */
export const RateLimitedState = forwardRef<HTMLDivElement, RateLimitedStateProps>(function RateLimitedState(
  { retryAfterMs, onRetry, retryLabel, title, description, error, ...rest },
  ref,
) {
  const t = useMessage()
  const { locale } = useLocale()
  const wait = retryAfterMs ?? error?.retryAfterMs
  return (
    <StateFrame
      {...rest}
      ref={ref}
      error={error}
      icon="clock"
      tone="warning"
      state="rate-limited"
      title={title ?? t('error.rate_limited.title')}
      description={description ?? (wait !== undefined
        ? t('error.rate_limited.retryIn', { duration: formatDuration(wait, { locale }) })
        : t('error.rate_limited.description'))}
      primaryAction={onRetry && (
        <Button size="small" onClick={onRetry}>{retryLabel ?? t('state.retry')}</Button>
      )}
    />
  )
})

/** Props for a view whose data has stopped refreshing. */
export interface StaleStateProps extends StatusStateProps {
  /** When the data last refreshed. */
  lastUpdated?: DateInput
  /** Clock for the relative time; defaults to now. */
  now?: number
  /** Adds a refresh action. */
  onRefresh?: () => void
}

/**
 * The data shown may be out of date (a stream dropped or polling stalled).
 * Use `compact` to show it beside the stale content rather than instead of it.
 */
export const StaleState = forwardRef<HTMLDivElement, StaleStateProps>(function StaleState(
  { lastUpdated, now, onRefresh, title, description, ...rest },
  ref,
) {
  const t = useMessage()
  const { locale } = useLocale()
  return (
    <StateFrame
      {...rest}
      ref={ref}
      icon="history"
      tone="warning"
      state="stale"
      title={title ?? t('state.stale.title')}
      description={description ?? (lastUpdated !== undefined
        ? t('state.stale.description', { time: formatRelativeTime(lastUpdated, { locale, now }) })
        : t('state.stale.generic'))}
      primaryAction={onRefresh && (
        <Button size="small" onClick={onRefresh}>{t('state.stale.action')}</Button>
      )}
    />
  )
})

/** Props for rendering any typed failure as its state. */
export interface SourceErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The failure to explain. */
  error: SourceError
  /** What failed, in words, for the access and not-found copy. */
  resource?: string
  /** Retries the failed request. */
  onRetry?: () => void
  /** Renews an expired session; falls back to `onRetry`. */
  onRenewSession?: () => void
  /** Uses the bounded compact presentation. */
  compact?: boolean
}

/**
 * Picks the state a failure deserves from its kind: an expired session,
 * a denied or missing scope, a rate limit, or a typed error with retry.
 */
export const SourceErrorState = forwardRef<HTMLDivElement, SourceErrorStateProps>(function SourceErrorState(
  { error, resource, onRetry, onRenewSession, ...rest },
  ref,
) {
  switch (error.kind) {
    case 'unauthenticated':
      return <SessionExpiredState {...rest} ref={ref} error={error} onContinue={onRenewSession ?? onRetry} />
    case 'forbidden':
      return <AccessDeniedState {...rest} ref={ref} error={error} resource={resource} />
    case 'not_found':
      return <NotFoundState {...rest} ref={ref} error={error} resource={resource} />
    case 'rate_limited':
      return <RateLimitedState {...rest} ref={ref} error={error} onRetry={onRetry} />
    default:
      return <ErrorState {...rest} ref={ref} error={error} onRetry={onRetry} />
  }
})
