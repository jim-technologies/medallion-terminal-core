import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react'

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined
  defaultValue: T
  onChange?: (value: T) => void
}): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const set = useCallback((next: T) => {
    if (!controlled) setInternal(next)
    onChange?.(next)
  }, [controlled, onChange])
  return [current, set]
}

export function focusableElements(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
  )].filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true')
}

let modalLayerCount = 0
let bodyOverflowBeforeModal = ''

/**
 * Shared modal lifecycle for toolkit and framework-owned surfaces: focus the
 * layer, restore the invoker, and prevent background scrolling while any modal
 * remains mounted.
 */
export function useModalFocus(
  open: boolean,
  contentRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const previousFocus = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    previousFocus.current = document.activeElement as HTMLElement | null
    if (modalLayerCount === 0) {
      bodyOverflowBeforeModal = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    modalLayerCount += 1

    const target = initialFocusRef?.current
      ?? (contentRef.current ? focusableElements(contentRef.current)[0] : undefined)
      ?? contentRef.current
    target?.focus()

    return () => {
      modalLayerCount = Math.max(0, modalLayerCount - 1)
      if (modalLayerCount === 0) {
        document.body.style.overflow = bodyOverflowBeforeModal
      }
      if (previousFocus.current?.isConnected) previousFocus.current.focus()
    }
  }, [open, contentRef, initialFocusRef])
}

/** Keyboard handling shared by every modal focus scope. */
export function handleModalKeyDown(
  event: ReactKeyboardEvent<HTMLElement>,
  contentRef: RefObject<HTMLElement | null>,
  dismissible: boolean,
  close: () => void,
) {
  if (event.key === 'Escape' && dismissible) {
    event.preventDefault()
    event.stopPropagation()
    close()
    return
  }
  if (event.key !== 'Tab' || !contentRef.current) return
  const focusable = focusableElements(contentRef.current)
  if (focusable.length === 0) {
    event.preventDefault()
    contentRef.current.focus()
    return
  }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
