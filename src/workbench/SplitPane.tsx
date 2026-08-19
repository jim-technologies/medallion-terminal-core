import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { cx, useControllableState } from '../components/utils'

/** Props for a keyboard- and pointer-resizable two-pane layout. */
export interface SplitPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Content assigned to the logical primary pane. */
  primary: ReactNode
  /** Content assigned to the remaining pane. */
  secondary: ReactNode
  /** Horizontal lays panes left/right; vertical lays them top/bottom. */
  orientation?: 'horizontal' | 'vertical'
  /** Edge occupied by the primary pane. */
  primaryPane?: 'start' | 'end'
  /** Controlled primary-pane size as a percentage. */
  size?: number
  /** Initial primary-pane percentage when uncontrolled. */
  defaultSize?: number
  /** Called with a clamped primary-pane percentage after resizing. */
  onSizeChange?: (size: number) => void
  /** Minimum primary-pane percentage. */
  minSize?: number
  /** Maximum primary-pane percentage. */
  maxSize?: number
  /** Keyboard resize increment in percentage points. */
  step?: number
  /** Disables pointer and keyboard resizing. */
  disabled?: boolean
  /** Stacks panes and removes the separator below the toolkit breakpoint. */
  stackOnNarrow?: boolean
  /** Accessible name for the resize separator. */
  separatorLabel?: string
}

/**
 * Two-pane percentage layout. The separator supports pointer capture,
 * arrows, Home, and End; narrow layouts can stack without a pointer.
 */
export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(function SplitPane(
  {
    primary,
    secondary,
    orientation = 'horizontal',
    primaryPane = 'start',
    size: controlledSize,
    defaultSize = 30,
    onSizeChange,
    minSize = 15,
    maxSize = 85,
    step = 5,
    disabled,
    stackOnNarrow = true,
    separatorLabel = 'Resize panes',
    className,
    style,
    ...rest
  },
  forwardedRef,
) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false)
  const [rawSize, setRawSize] = useControllableState({
    value: controlledSize,
    defaultValue: defaultSize,
    onChange: onSizeChange,
  })
  const lowerBound = Math.min(minSize, maxSize)
  const upperBound = Math.max(minSize, maxSize)
  const keyboardStep = Number.isFinite(step) && step !== 0 ? Math.abs(step) : 1
  const size = clamp(rawSize, lowerBound, upperBound)
  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  const setFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !rootRef.current || disabled) return
    const rect = rootRef.current.getBoundingClientRect()
    const position = orientation === 'horizontal'
      ? ((event.clientX - rect.left) / rect.width) * 100
      : ((event.clientY - rect.top) / rect.height) * 100
    const primarySize = primaryPane === 'start' ? position : 100 - position
    setRawSize(clamp(primarySize, lowerBound, upperBound))
  }

  const adjust = (delta: number) => setRawSize(clamp(size + delta, lowerBound, upperBound))
  const startBasis = primaryPane === 'start' ? size : 100 - size
  const endBasis = 100 - startBasis

  return (
    <div
      {...rest}
      ref={setRefs}
      className={cx('mtc-split-pane', className)}
      data-orientation={orientation}
      data-stack-narrow={stackOnNarrow}
      style={{
        '--mtc-split-start': `${startBasis}fr`,
        '--mtc-split-end': `${endBasis}fr`,
        ...style,
      } as React.CSSProperties}
    >
      <div className="mtc-split-content mtc-split-start">{primaryPane === 'start' ? primary : secondary}</div>
      <div
        role="separator"
        aria-label={separatorLabel}
        aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuemin={lowerBound}
        aria-valuemax={upperBound}
        aria-valuenow={Math.round(size)}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        className="mtc-split-separator"
        onPointerDown={(event) => {
          if (disabled) return
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          setFromPointer(event)
        }}
        onPointerMove={setFromPointer}
        onPointerUp={(event) => {
          dragging.current = false
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        }}
        onPointerCancel={() => { dragging.current = false }}
        onKeyDown={(event) => {
          if (disabled) return
          const decreaseKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
          const increaseKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
          if (event.key === decreaseKey || event.key === increaseKey) {
            event.preventDefault()
            const physicalDelta = event.key === increaseKey ? keyboardStep : -keyboardStep
            adjust(primaryPane === 'start' ? physicalDelta : -physicalDelta)
          } else if (event.key === 'Home') {
            event.preventDefault()
            setRawSize(lowerBound)
          } else if (event.key === 'End') {
            event.preventDefault()
            setRawSize(upperBound)
          }
        }}
      >
        <span aria-hidden="true" />
      </div>
      <div className="mtc-split-content mtc-split-end">{primaryPane === 'start' ? secondary : primary}</div>
    </div>
  )
})

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(Math.max(value, min), max)
}
