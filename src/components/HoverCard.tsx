import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { usePortalContainer } from '../foundations/DesignSystemProvider'
import { cx } from './utils'

/** Props for a preview card shown while a trigger is hovered or focused. */
export interface HoverCardProps {
  /** One trigger element, usually a link such as an ObjectChip. */
  children: ReactElement
  /** Preview content: a compact header, key properties, link counts. */
  content: ReactNode
  /** Delay before opening, in milliseconds. */
  openDelay?: number
  /** Delay before closing, so the pointer can travel onto the card. */
  closeDelay?: number
  /** Additional class for the card. */
  className?: string
}

interface Position {
  left: number
  top: number
  placement: 'below' | 'above'
}

const GAP = 6
const CARD_WIDTH = 320

/**
 * A non-modal preview of the object behind a link. It opens on hover and on
 * keyboard focus, closes on Escape, and is described to assistive
 * technology from its trigger. The card is supplementary: every action it
 * shows must also be reachable elsewhere. It renders into the scope's portal
 * container, so it keeps the theme and escapes clipping ancestors.
 */
export function HoverCard({
  children,
  content,
  openDelay = 350,
  closeDelay = 150,
  className,
}: HoverCardProps) {
  const id = useId()
  const container = usePortalContainer()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)

  const schedule = useCallback((next: boolean, delay: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), delay)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || typeof window === 'undefined') {
      setPosition(null)
      return
    }
    const rect = triggerRef.current.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom
    const placement = below < 220 && rect.top > below ? 'above' : 'below'
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - CARD_WIDTH - 8))
    setPosition({ left, top: placement === 'below' ? rect.bottom + GAP : rect.top - GAP, placement })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onScroll = () => setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  const trigger = children as ReactElement<{
    'aria-describedby'?: string
    onMouseEnter?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
    onFocus?: FocusEventHandler
    onBlur?: FocusEventHandler
  }>
  const describedBy = [trigger.props['aria-describedby'], open ? id : undefined]
    .filter(Boolean).join(' ') || undefined

  return (
    <span ref={triggerRef} className="mtc-hover-card-trigger">
      {cloneElement(trigger, {
        'aria-describedby': describedBy,
        onMouseEnter: event => {
          trigger.props.onMouseEnter?.(event)
          schedule(true, openDelay)
        },
        onMouseLeave: event => {
          trigger.props.onMouseLeave?.(event)
          schedule(false, closeDelay)
        },
        onFocus: event => {
          trigger.props.onFocus?.(event)
          schedule(true, openDelay)
        },
        onBlur: event => {
          trigger.props.onBlur?.(event)
          schedule(false, 0)
        },
      })}
      {open && container && position && createPortal(
        <div
          id={id}
          role="tooltip"
          className={cx('mtc-hover-card', className)}
          data-placement={position.placement}
          style={{
            left: position.left,
            top: position.top,
            width: CARD_WIDTH,
            transform: position.placement === 'above' ? 'translateY(-100%)' : undefined,
          }}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={() => schedule(false, closeDelay)}
        >
          {content}
        </div>,
        container,
      )}
    </span>
  )
}
