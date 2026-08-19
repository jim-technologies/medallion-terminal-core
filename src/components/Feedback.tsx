import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { ComponentSize, Intent } from '../foundations/types'
import { Icon, type IconName } from './Icon'
import { cx } from './utils'

/** Props for a removable or static categorical tag. */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color intent. */
  intent?: Intent
  /** Visual tag size. */
  size?: ComponentSize
  /** Adds a remove action and receives removal requests. */
  onRemove?: () => void
  /** Accessible name for the remove action. */
  removeLabel?: string
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    intent = 'neutral',
    size = 'small',
    onRemove,
    removeLabel = 'Remove',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={cx('mtc-tag', className)}
      data-intent={intent}
      data-size={size}
    >
      <span>{children}</span>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={removeLabel} className="mtc-tag-remove">
          <Icon name="close" />
        </button>
      )}
    </span>
  )
})

/** Props for a compact status or count badge. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic color intent. */
  intent?: Intent
  /** Visual badge size. */
  size?: ComponentSize
  /** Displays a status dot before the badge contents. */
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { intent = 'neutral', size = 'small', dot, className, children, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={cx('mtc-badge', className)}
      data-intent={intent}
      data-size={size}
    >
      {dot && <span className="mtc-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  )
})

/** Props for a prominent inline informational or status message. */
export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional prominent message heading. */
  title?: ReactNode
  /** Semantic status intent. */
  intent?: Exclude<Intent, 'primary'>
  /** Visual shown before the message; defaults to an intent icon. */
  icon?: ReactNode
  /** Optional action controls shown below the message. */
  actions?: ReactNode
}

/** Tokenized callout that never relies on color alone for status meaning. */
export const Callout = forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  {
    title,
    intent = 'info',
    icon,
    actions,
    className,
    children,
    role,
    ...rest
  },
  ref,
) {
  const iconName: IconName =
    intent === 'danger' ? 'error'
      : intent === 'warning' ? 'warning'
        : intent === 'success' ? 'success'
          : 'info'
  return (
    <div
      {...rest}
      ref={ref}
      role={role ?? (intent === 'danger' ? 'alert' : 'status')}
      className={cx('mtc-callout', className)}
      data-intent={intent}
    >
      <div className="mtc-callout-icon" aria-hidden="true">{icon ?? <Icon name={iconName} />}</div>
      <div className="mtc-callout-content">
        {title && <div className="mtc-callout-title">{title}</div>}
        <div className="mtc-callout-body">{children}</div>
        {actions && <div className="mtc-callout-actions">{actions}</div>}
      </div>
    </div>
  )
})
