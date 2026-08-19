import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { ComponentSize, Density, Intent } from '../foundations/types'
import { Icon } from './Icon'
import { cx } from './utils'

export type ButtonVariant = 'solid' | 'outline' | 'ghost'

/** Props shared by labeled action buttons. */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic visual intent. */
  intent?: Intent
  /** Surface treatment for the action. */
  variant?: ButtonVariant
  /** Visual control size. */
  size?: ComponentSize
  /** Optional density override for this action. */
  density?: Density
  /** Disables interaction and replaces the contents with a busy state. */
  loading?: boolean
  /** Accessible and visible text used while loading. */
  loadingLabel?: string
  /** Decorative or labeled content before the button label. */
  startIcon?: ReactNode
  /** Decorative or labeled content after the button label. */
  endIcon?: ReactNode
}

/** Semantic, ref-forwarding action button with consistent busy handling. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent = 'neutral',
    variant = 'outline',
    size = 'medium',
    density,
    loading = false,
    loadingLabel = 'Working',
    startIcon,
    endIcon,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx('mtc-button', density && `mtc-density-${density}`, className)}
      data-intent={intent}
      data-variant={variant}
      data-size={size}
    >
      {loading
        ? <Icon name="spinner" className="mtc-button-spinner" />
        : startIcon}
      <span className="mtc-button-label">{loading ? loadingLabel : children}</span>
      {!loading && endIcon}
    </button>
  )
})

/** Props for a square action that must always have an accessible name. */
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon'> {
  /** Required accessible name for the icon-only action. */
  'aria-label': string
  /** Icon or compact visual rendered inside the button. */
  icon: ReactNode
}

/** Compact icon-only action. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    className,
    loading = false,
    loadingLabel = 'Working',
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  return (
    <Button
      {...rest}
      ref={ref}
      className={cx('mtc-icon-button', className)}
      aria-label={loading ? loadingLabel : ariaLabel}
      loading={loading}
      loadingLabel={loadingLabel}
      startIcon={icon}
    >
      <span className="mtc-visually-hidden">{loading ? loadingLabel : ariaLabel}</span>
    </Button>
  )
})

/** Props for a visually connected set of related actions. */
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the grouped actions. */
  label?: string
  /** Optional density override inherited by the contained actions. */
  density?: Density
}

/** Groups related buttons under a single accessible label. */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { label, density, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      aria-label={label}
      className={cx('mtc-button-group', density && `mtc-density-${density}`, className)}
    >
      {children}
    </div>
  )
})
