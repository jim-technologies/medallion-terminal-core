import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button, IconButton } from '../components/Button'
import { Icon, type IconName } from '../components/Icon'
import { useControllableState } from '../components/utils'
import { useMessage, usePortalContainer } from '../foundations/DesignSystemProvider'

/** Where a long-running operation stands. */
export type OperationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'

/** One long-running operation: an upload, an ingest, a transaction, a workflow run. */
export interface Operation {
  id: string
  label: string
  /** Secondary line, such as a size, a target folder or an error. */
  detail?: ReactNode
  status: OperationStatus
  /** Progress from 0 to 1 while running; omit when unknown. */
  progress?: number
  /** Offers Cancel while queued or running. */
  cancellable?: boolean
  /** Offers Retry after a failure. */
  retryable?: boolean
}

/** Props for the operations tray. */
export interface OperationsTrayProps {
  operations: readonly Operation[]
  /** Tray title; defaults to "Operations". */
  title?: string
  onCancel?: (id: string) => void
  onRetry?: (id: string) => void
  /** Removes one finished operation. */
  onDismiss?: (id: string) => void
  /** Removes every finished operation. */
  onClearFinished?: () => void
  /** Controlled expansion. */
  open?: boolean
  /**
   * Initial expansion when uncontrolled: open on larger screens, collapsed
   * to its summary on phones (720 px and narrower), where the sheet would
   * cover the page.
   */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * `floating` (default) pins the tray to the bottom end of the screen;
   * `inline` renders it in the page, such as an Activity page.
   */
  placement?: 'floating' | 'inline'
}

const STATUS_ICON: Record<OperationStatus, IconName> = {
  queued: 'clock',
  running: 'spinner',
  succeeded: 'success',
  failed: 'error',
  cancelled: 'close',
}

const FINISHED = new Set<OperationStatus>(['succeeded', 'failed', 'cancelled'])

// Matches the stylesheet's bottom-sheet breakpoint.
const PHONE_QUERY = '(max-width: 720px)'

function opensExpanded(): boolean {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function' || !window.matchMedia(PHONE_QUERY).matches
}

/**
 * Long-running operations in a tray at the bottom end of the screen (a
 * bottom sheet on phones, collapsed to its summary until opened): a summary
 * header that expands to the list, with
 * progress, Cancel and Retry. Status changes are announced politely. The
 * tray only renders while there are operations, and it never polls: the
 * host feeds it.
 */
export function OperationsTray({
  operations,
  title,
  onCancel,
  onRetry,
  onDismiss,
  onClearFinished,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  placement = 'floating',
}: OperationsTrayProps) {
  const t = useMessage()
  const listId = useId()
  const container = usePortalContainer()
  const [initiallyOpen] = useState(() => defaultOpen ?? opensExpanded())
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: initiallyOpen, onChange: onOpenChange })
  const previous = useRef(new Map<string, OperationStatus>())
  const [announcement, setAnnouncement] = useState('')
  // Announce each operation that finished since the last change, once.
  useEffect(() => {
    const finished = operations.filter(operation => (
      FINISHED.has(operation.status) && previous.current.get(operation.id) !== operation.status
    ))
    previous.current = new Map(operations.map(operation => [operation.id, operation.status]))
    if (finished.length > 0) {
      setAnnouncement(finished.map(operation => `${operation.label}: ${t(`ops.status.${operation.status}`)}`).join('. '))
    }
  }, [operations, t])
  const counts = useMemo(() => {
    const tally = { queued: 0, running: 0, succeeded: 0, failed: 0, cancelled: 0 }
    for (const operation of operations) tally[operation.status] += 1
    return tally
  }, [operations])
  if (operations.length === 0) return null

  const summary = [
    counts.running > 0 && t('ops.running', { count: counts.running }),
    counts.queued > 0 && t('ops.queued', { count: counts.queued }),
    counts.failed > 0 && t('ops.failed', { count: counts.failed }),
    counts.succeeded > 0 && t('ops.done', { count: counts.succeeded }),
  ].filter(Boolean).join(' · ')
  const anyFinished = operations.some(operation => FINISHED.has(operation.status))

  const tray = (
    <section className="mtc-operations-tray" aria-label={title ?? t('ops.title')} data-open={open || undefined} data-placement={placement}>
      <div className="mtc-operations-header">
        <button
          type="button"
          className="mtc-operations-toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(!open)}
        >
          <Icon name={counts.running > 0 ? 'spinner' : counts.failed > 0 ? 'error' : 'success'} className="mtc-operations-header-icon" data-status={counts.running > 0 ? 'running' : counts.failed > 0 ? 'failed' : 'succeeded'} />
          <span className="mtc-operations-title">{title ?? t('ops.title')}</span>
          <span className="mtc-operations-summary">{summary}</span>
          <Icon name="chevron-down" className="mtc-operations-chevron" label={open ? t('ops.hide') : t('ops.show')} />
        </button>
      </div>
      <span role="status" className="mtc-visually-hidden">{announcement}</span>
      {open && (
        <>
          <ul id={listId} className="mtc-operations-list">
            {operations.map(operation => {
              const finished = FINISHED.has(operation.status)
              const percent = operation.progress === undefined ? undefined : Math.round(Math.min(1, Math.max(0, operation.progress)) * 100)
              return (
                <li key={operation.id} className="mtc-operation" data-status={operation.status}>
                  <Icon name={STATUS_ICON[operation.status]} className="mtc-operation-icon" label={t(`ops.status.${operation.status}`)} />
                  <div className="mtc-operation-main">
                    <span className="mtc-operation-label" title={operation.label}>{operation.label}</span>
                    {operation.detail != null && <span className="mtc-operation-detail">{operation.detail}</span>}
                    {operation.status === 'running' && (
                      <span
                        className="mtc-operation-progress"
                        role="progressbar"
                        aria-label={operation.label}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percent}
                      >
                        <span style={percent === undefined ? undefined : { width: `${percent}%` }} data-indeterminate={percent === undefined || undefined} />
                      </span>
                    )}
                  </div>
                  <div className="mtc-operation-actions">
                    {!finished && operation.cancellable && onCancel && (
                      <IconButton icon={<Icon name="close" />} variant="ghost" size="small" aria-label={t('ops.cancel', { label: operation.label })} onClick={() => onCancel(operation.id)} />
                    )}
                    {operation.status === 'failed' && operation.retryable && onRetry && (
                      <IconButton icon={<Icon name="refresh" />} variant="ghost" size="small" aria-label={t('ops.retry', { label: operation.label })} onClick={() => onRetry(operation.id)} />
                    )}
                    {finished && onDismiss && (
                      <IconButton icon={<Icon name="minus" />} variant="ghost" size="small" aria-label={t('ops.dismiss', { label: operation.label })} onClick={() => onDismiss(operation.id)} />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          {anyFinished && onClearFinished && (
            <div className="mtc-operations-footer">
              <Button size="small" variant="ghost" onClick={onClearFinished}>{t('ops.clear')}</Button>
            </div>
          )}
        </>
      )}
    </section>
  )
  return placement === 'floating' && container ? createPortal(tray, container) : tray
}
