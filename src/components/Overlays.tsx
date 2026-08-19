import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type FocusEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react'
import type { Intent } from '../foundations/types'
import { IconButton } from './Button'
import { Icon } from './Icon'
import {
  cx,
  handleModalKeyDown,
  useControllableState,
  useModalFocus,
} from './utils'

/** Props for a text tooltip attached to one trigger. */
export interface TooltipProps {
  /** Text or compact explanatory content shown on hover and focus. */
  content: ReactNode
  /** One trigger element whose event and ARIA props are composed. */
  children: ReactElement
  /** Preferred side of the trigger. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Suppresses tooltip behavior and renders the child unchanged. */
  disabled?: boolean
  /** Additional class for the positioning wrapper. */
  className?: string
}

/** Hover/focus tooltip. Escape dismisses while focus remains on the trigger. */
export function Tooltip({
  content,
  children,
  placement = 'top',
  disabled,
  className,
}: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useControllableState<boolean>({
    value: undefined,
    defaultValue: false,
  })
  if (disabled) return <>{children}</>
  const trigger = children as ReactElement<{
    'aria-describedby'?: string
    onMouseEnter?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
    onFocus?: FocusEventHandler
    onBlur?: FocusEventHandler
    onKeyDown?: KeyboardEventHandler
  }>
  const describedBy = [
    trigger.props['aria-describedby'],
    open ? id : undefined,
  ].filter(Boolean).join(' ') || undefined
  return (
    <span className={cx('mtc-tooltip-trigger', className)}>
      {cloneElement(trigger, {
        'aria-describedby': describedBy,
        onMouseEnter: event => {
          trigger.props.onMouseEnter?.(event)
          setOpen(true)
        },
        onMouseLeave: event => {
          trigger.props.onMouseLeave?.(event)
          setOpen(false)
        },
        onFocus: event => {
          trigger.props.onFocus?.(event)
          setOpen(true)
        },
        onBlur: event => {
          trigger.props.onBlur?.(event)
          setOpen(false)
        },
        onKeyDown: event => {
          trigger.props.onKeyDown?.(event)
          if (event.key === 'Escape' && open) {
            event.stopPropagation()
            setOpen(false)
          }
        },
      })}
      {open && (
        <span id={id} role="tooltip" className="mtc-tooltip" data-placement={placement}>
          {content}
        </span>
      )}
    </span>
  )
}

/** Props for a controlled or uncontrolled anchored popover. */
export interface PopoverProps {
  /** Non-interactive visual content rendered inside the built-in button. */
  trigger: ReactNode
  /** Accessible trigger name and fallback content label when no title exists. */
  triggerAriaLabel?: string
  /** Popover body. */
  children: ReactNode
  /** Optional visible title used to label the popover dialog. */
  title?: ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called whenever user interaction requests an open-state change. */
  onOpenChange?: (open: boolean) => void
  /** Preferred anchor alignment. */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  /** Disables the trigger. */
  disabled?: boolean
  /** Additional class for the positioning wrapper. */
  className?: string
}

/**
 * Non-modal anchored content. The built-in trigger keeps the API semantic and
 * avoids nested interactive elements.
 */
export function Popover({
  trigger,
  triggerAriaLabel,
  children,
  title,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  disabled,
  className,
}: PopoverProps) {
  const id = useId()
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  useDismissableLayer(open, rootRef, () => {
    setOpen(false)
    triggerRef.current?.focus()
  })
  return (
    <div ref={rootRef} className={cx('mtc-popover-root', className)}>
      <button
        ref={triggerRef}
        type="button"
        className="mtc-popover-trigger"
        aria-label={triggerAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={title ? undefined : triggerAriaLabel}
          aria-labelledby={title ? titleId : undefined}
          className="mtc-popover mtc-popover-content"
          data-placement={placement}
        >
          {title && <div id={titleId} className="mtc-popover-title">{title}</div>}
          {children}
        </div>
      )}
    </div>
  )
}

/** One command or separator in a Menu or ContextMenu. */
export interface MenuItem {
  /** Stable item key. */
  id: string
  /** Visible command label. Omit only for separators. */
  label?: ReactNode
  /** Optional leading visual. */
  icon?: ReactNode
  /** Display-only keyboard shortcut hint. */
  shortcut?: string
  /** Prevents command selection. */
  disabled?: boolean
  /** Renders a non-interactive separator instead of a command. */
  separator?: boolean
  /** Optional destructive emphasis. */
  intent?: Extract<Intent, 'neutral' | 'danger'>
  /** Invoked once when the enabled command is selected. */
  onSelect?: () => void
}

/** Props for an anchored application menu. */
export interface MenuProps {
  /** Accessible name for both the trigger and menu. */
  label: string
  /** Non-interactive visual content rendered inside the built-in button. */
  trigger: ReactNode
  /** Ordered commands and separators. */
  items: readonly MenuItem[]
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  /** Called whenever user interaction requests an open-state change. */
  onOpenChange?: (open: boolean) => void
  /** Horizontal menu alignment relative to the trigger. */
  align?: 'start' | 'end'
  /** Disables the trigger. */
  disabled?: boolean
  /** Additional class for the positioning wrapper. */
  className?: string
}

/** Keyboard-navigable action menu with roving focus. */
export function Menu({
  label,
  trigger,
  items,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  align = 'start',
  disabled,
  className,
}: MenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [initialIndex, setInitialIndex] = useControllableState({
    value: undefined,
    defaultValue: 0,
  })
  const [open, setOpen] = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const close = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }
  useDismissableLayer(open, rootRef, () => close(false))
  return (
    <div ref={rootRef} className={cx('mtc-menu-root', className)}>
      <button
        ref={triggerRef}
        type="button"
        className="mtc-menu-trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          setInitialIndex(firstMenuIndex(items, 1))
          setOpen(!open)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setInitialIndex(firstMenuIndex(items, event.key === 'ArrowDown' ? 1 : -1))
            setOpen(true)
          }
        }}
      >
        {trigger}
      </button>
      {open && (
        <MenuPopup
          label={label}
          items={items}
          initialIndex={initialIndex}
          align={align}
          onClose={close}
        />
      )}
    </div>
  )
}

/** Props for a contextual menu region. */
export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Accessible name for the focusable region and its menu. */
  label: string
  /** Commands available for the contextual target. */
  items: readonly MenuItem[]
  /** Contextual target content. */
  children: ReactNode
}

/** Pointer and Shift+F10 accessible contextual menu. */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { label, items, children, className, tabIndex = 0, onContextMenu, onKeyDown, ...rest },
  forwardedRef,
) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const [open, setOpen] = useControllableState({ value: undefined, defaultValue: false })
  const [initialIndex, setInitialIndex] = useControllableState({ value: undefined, defaultValue: 0 })
  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }
  useDismissableLayer(open, rootRef, () => setOpen(false))
  const show = (x: number, y: number) => {
    positionRef.current = { x, y }
    setInitialIndex(firstMenuIndex(items, 1))
    setOpen(true)
  }
  return (
    <div
      {...rest}
      ref={setRefs}
      className={cx('mtc-context-menu-region', className)}
      tabIndex={tabIndex}
      aria-label={label}
      onContextMenu={(event) => {
        onContextMenu?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        show(event.clientX, event.clientY)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          show(rect.left + 12, rect.top + 12)
        }
      }}
    >
      {children}
      {open && (
        <MenuPopup
          label={label}
          items={items}
          initialIndex={initialIndex}
          style={{ position: 'fixed', left: positionRef.current.x, top: positionRef.current.y }}
          onClose={() => {
            setOpen(false)
            rootRef.current?.focus()
          }}
        />
      )}
    </div>
  )
})

interface MenuPopupProps {
  label: string
  items: readonly MenuItem[]
  initialIndex: number
  onClose: (restoreFocus?: boolean) => void
  align?: 'start' | 'end'
  style?: CSSProperties
}

function MenuPopup({
  label,
  items,
  initialIndex,
  onClose,
  align = 'start',
  style,
}: MenuPopupProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const buttons = ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([disabled])')
      const target = [...(buttons ?? [])].find(button => Number(button.dataset.index) === initialIndex) ?? buttons?.[0]
      target?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [initialIndex])

  const focusIndex = (from: number, delta: 1 | -1) => {
    const next = nextMenuIndex(items, from, delta)
    ref.current?.querySelector<HTMLButtonElement>(`[role="menuitem"][data-index="${next}"]`)?.focus()
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      className="mtc-menu mtc-popover"
      data-align={align}
      style={style}
      onKeyDown={(event) => {
        const current = Number((event.target as HTMLElement).dataset.index ?? -1)
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          focusIndex(current, 1)
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          focusIndex(current, -1)
        } else if (event.key === 'Home') {
          event.preventDefault()
          focusIndex(-1, 1)
        } else if (event.key === 'End') {
          event.preventDefault()
          focusIndex(0, -1)
        } else if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          onClose(true)
        } else if (event.key === 'Tab') {
          onClose(false)
        }
      }}
    >
      {items.map((item, index) => item.separator ? (
        <div key={item.id} role="separator" className="mtc-menu-separator" />
      ) : (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          data-index={index}
          data-intent={item.intent ?? 'neutral'}
          className="mtc-menu-item"
          onClick={() => {
            if (item.disabled) return
            item.onSelect?.()
            onClose(true)
          }}
        >
          {item.icon && <span className="mtc-menu-icon" aria-hidden="true">{item.icon}</span>}
          <span className="mtc-menu-label">{item.label}</span>
          {item.shortcut && <kbd className="mtc-menu-shortcut">{item.shortcut}</kbd>}
        </button>
      ))}
    </div>
  )
}

/** Props shared by modal dialog surfaces. */
export interface DialogProps {
  /** Controlled visibility. */
  open: boolean
  /** Called when dismissal or host actions request a visibility change. */
  onOpenChange: (open: boolean) => void
  /** Required visible dialog heading. */
  title: ReactNode
  /** Optional text associated with the dialog through `aria-describedby`. */
  description?: ReactNode
  /** Scrollable dialog body. */
  children: ReactNode
  /** Optional fixed action footer. */
  footer?: ReactNode
  /** Maximum dialog width preset. */
  size?: 'small' | 'medium' | 'large'
  /** Enables Escape, backdrop, and close-button dismissal. */
  dismissible?: boolean
  /** Preferred initial focus target inside the dialog. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Additional class for the dialog surface. */
  className?: string
}

/** Modal dialog with focus trapping, Escape dismissal, and focus restoration. */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    size = 'medium',
    dismissible = true,
    initialFocusRef,
    className,
  },
  forwardedRef,
) {
  const titleId = useId()
  const descriptionId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  useModalFocus(open, contentRef, initialFocusRef)
  if (!open) return null
  return (
    <div
      className="mtc-modal-backdrop mtc-overlay"
      onMouseDown={(event) => {
        if (dismissible && event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        ref={node => {
          contentRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx('mtc-dialog', className)}
        data-size={size}
        onKeyDown={event => handleModalKeyDown(event, contentRef, dismissible, () => onOpenChange(false))}
      >
        <div className="mtc-modal-header">
          <div>
            <h2 id={titleId} className="mtc-modal-title">{title}</h2>
            {description && <p id={descriptionId} className="mtc-modal-description">{description}</p>}
          </div>
          {dismissible && (
            <IconButton
              icon={<Icon name="close" />}
              aria-label="Close dialog"
              variant="ghost"
              size="small"
              onClick={() => onOpenChange(false)}
            />
          )}
        </div>
        <div className="mtc-modal-body">{children}</div>
        {footer && <div className="mtc-modal-footer">{footer}</div>}
      </div>
    </div>
  )
})

/** Props for a modal edge-attached drawer. */
export interface DrawerProps extends Omit<DialogProps, 'size'> {
  /** Viewport edge to which the drawer attaches. */
  side?: 'left' | 'right'
  /** CSS width or numeric pixel width. */
  width?: number | string
}

/** Modal drawer with the same keyboard and focus contract as Dialog. */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    side = 'right',
    width = 420,
    dismissible = true,
    initialFocusRef,
    className,
  },
  forwardedRef,
) {
  const titleId = useId()
  const descriptionId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  useModalFocus(open, contentRef, initialFocusRef)
  if (!open) return null
  return (
    <div
      className="mtc-modal-backdrop mtc-overlay"
      onMouseDown={(event) => {
        if (dismissible && event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        ref={node => {
          contentRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cx('mtc-drawer', className)}
        data-side={side}
        style={{ width }}
        onKeyDown={event => handleModalKeyDown(event, contentRef, dismissible, () => onOpenChange(false))}
      >
        <div className="mtc-modal-header">
          <div>
            <h2 id={titleId} className="mtc-modal-title">{title}</h2>
            {description && <p id={descriptionId} className="mtc-modal-description">{description}</p>}
          </div>
          {dismissible && (
            <IconButton
              icon={<Icon name="close" />}
              aria-label="Close drawer"
              variant="ghost"
              size="small"
              onClick={() => onOpenChange(false)}
            />
          )}
        </div>
        <div className="mtc-modal-body">{children}</div>
        {footer && <div className="mtc-modal-footer">{footer}</div>}
      </div>
    </div>
  )
})

function useDismissableLayer(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, rootRef, close])
}

function firstMenuIndex(items: readonly MenuItem[], delta: 1 | -1): number {
  return nextMenuIndex(items, delta === 1 ? -1 : 0, delta)
}

function nextMenuIndex(items: readonly MenuItem[], from: number, delta: 1 | -1): number {
  if (items.length === 0) return -1
  let index = from
  for (let count = 0; count < items.length; count++) {
    index = (index + delta + items.length) % items.length
    const item = items[index]
    if (item && !item.separator && !item.disabled) return index
  }
  return -1
}
