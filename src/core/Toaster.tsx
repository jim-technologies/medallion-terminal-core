import { useEffect } from 'react'
import type { Severity } from './DashboardContext'

export interface Toast {
  id: number
  message: string
  severity: Severity
}

const COLOR: Record<Severity, string> = {
  ok:    'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  warn:  'border-amber-500/40   bg-amber-500/10   text-amber-200',
  error: 'border-red-500/40     bg-red-500/10     text-red-200',
  info:  'border-sky-500/40     bg-sky-500/10     text-sky-200',
}

const TTL_MS = 3500

// Renders the active toast queue in a fixed bottom-right stack.
// Each toast auto-dismisses after TTL_MS or when clicked.
export function Toaster({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => (
        <ToastView key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  )
}

function ToastView({ toast, dismiss }: { toast: Toast; dismiss: (id: number) => void }) {
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), TTL_MS)
    return () => clearTimeout(id)
  }, [toast.id, dismiss])
  return (
    <div
      onClick={() => dismiss(toast.id)}
      className={`mtc-popover pointer-events-auto cursor-pointer text-xs px-3 py-2 border ${COLOR[toast.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`}
    >
      {toast.message}
    </div>
  )
}
