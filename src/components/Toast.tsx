import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useMessage, usePortalContainer } from '../foundations/DesignSystemProvider'
import type { Intent } from '../foundations/types'
import { Button, IconButton } from './Button'
import { Icon, type IconName } from './Icon'

/** Intents a toast can carry. */
export type ToastIntent = Exclude<Intent, 'primary'>

/** One notification. */
export interface ToastData {
  id: string | number
  /** The message. */
  title: ReactNode
  /** Optional second line. */
  description?: ReactNode
  /** Tone; `danger` toasts are announced assertively. */
  intent?: ToastIntent
  /** One follow-up action, such as "Undo" or "View". */
  action?: { label: string; onClick: () => void }
  /** Milliseconds before it dismisses itself; 0 keeps it until dismissed. */
  duration?: number
}

/** Props for the notification stack. */
export interface ToasterProps {
  toasts: readonly ToastData[]
  /** Called when a toast times out or is dismissed. */
  onDismiss: (id: ToastData['id']) => void
  /** Corner of the viewport. */
  placement?: 'bottom-end' | 'top-end'
}

const ICON: Record<ToastIntent, IconName> = {
  neutral: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
}

const DEFAULT_DURATION = 5000
const DANGER_DURATION = 8000

function ToastView({ toast, onDismiss }: { toast: ToastData; onDismiss: ToasterProps['onDismiss'] }) {
  const t = useMessage()
  const intent = toast.intent ?? 'neutral'
  const duration = toast.duration ?? (intent === 'danger' ? DANGER_DURATION : DEFAULT_DURATION)
  const [paused, setPaused] = useState(false)
  const remaining = useRef(duration)
  useEffect(() => {
    if (duration <= 0 || paused) return
    const started = Date.now()
    const timer = setTimeout(() => onDismiss(toast.id), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(0, remaining.current - (Date.now() - started))
    }
  }, [duration, paused, onDismiss, toast.id])
  return (
    <li
      className="mtc-toast"
      data-intent={intent}
      role={intent === 'danger' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon name={ICON[intent]} className="mtc-toast-icon" />
      <div className="mtc-toast-content">
        <div className="mtc-toast-title">{toast.title}</div>
        {toast.description && <div className="mtc-toast-description">{toast.description}</div>}
        {toast.action && (
          <Button
            size="small"
            variant="ghost"
            intent="primary"
            className="mtc-toast-action"
            onClick={() => {
              toast.action?.onClick()
              onDismiss(toast.id)
            }}
          >
            {toast.action.label}
          </Button>
        )}
      </div>
      <IconButton
        icon={<Icon name="close" />}
        aria-label={t('toast.dismiss')}
        variant="ghost"
        size="small"
        onClick={() => onDismiss(toast.id)}
      />
    </li>
  )
}

/**
 * The notification stack. Toasts dismiss themselves (pausing while hovered or
 * focused), announce politely (`danger` assertively), and render into the
 * scope's portal container so they keep the theme above any layout.
 */
export function Toaster({ toasts, onDismiss, placement = 'bottom-end' }: ToasterProps) {
  const t = useMessage()
  const container = usePortalContainer()
  if (toasts.length === 0) return null
  const stack = (
    <section aria-label={t('toast.region')} className="mtc-toaster" data-placement={placement}>
      <ol>
        {toasts.map(toast => <ToastView key={toast.id} toast={toast} onDismiss={onDismiss} />)}
      </ol>
    </section>
  )
  return container ? createPortal(stack, container) : stack
}

/** What `useToast` returns. */
export interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (toast: Omit<ToastData, 'id'> & { id?: ToastData['id'] }) => ToastData['id']
  /** Dismisses a toast early. */
  dismiss: (id: ToastData['id']) => void
}

const ToastContext = createContext<ToastApi | null>(null)

/** Props for the toast state holder. */
export interface ToastProviderProps {
  children: ReactNode
  /** Most toasts shown at once; older ones drop off. */
  limit?: number
  placement?: ToasterProps['placement']
}

/** Holds a toast queue for its subtree and renders its `Toaster`. */
export function ToastProvider({ children, limit = 4, placement }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const next = useRef(0)
  const dismiss = useCallback((id: ToastData['id']) => {
    setToasts(current => current.filter(toast => toast.id !== id))
  }, [])
  const toast = useCallback<ToastApi['toast']>(({ id, ...rest }) => {
    next.current += 1
    const key = id ?? `toast-${next.current}`
    setToasts(current => [...current.filter(item => item.id !== key), { ...rest, id: key }].slice(-limit))
    return key
  }, [limit])
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss])
  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} placement={placement} />
    </ToastContext.Provider>
  )
}

/** The nearest `ToastProvider`'s API. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used inside a ToastProvider')
  return api
}
