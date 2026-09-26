import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { Avatar } from '../components/Display'
import { cx } from '../components/utils'
import { useLocale, useMessage } from '../foundations/DesignSystemProvider'
import { formatDateTime, formatRelativeTime, type DateInput } from '../foundations/intl'
import type { StatusTone } from '../foundations/types'
import { ObjectChip } from './ObjectChip'
import type { ObjectRef } from './types'

/** One event: who did what to which object, and when. */
export interface ActivityItem {
  id: string
  /** Person or service; omit for system events. */
  actor?: { name: string; avatarSrc?: string }
  /** What happened: "updated", "linked", "Run started". */
  verb: ReactNode
  /** The object acted on. */
  object?: ObjectRef
  /** Detail after the object: "Churn risk 12.0% → 18.0%". */
  summary?: ReactNode
  timestamp: DateInput
  /** Timeline dot tone (status of the event). */
  tone?: StatusTone
}

/** Props for an activity feed or timeline. */
export interface ActivityFeedProps extends HTMLAttributes<HTMLOListElement> {
  items: readonly ActivityItem[]
  /**
   * `feed`: avatar, sentence and relative time (object pages, home).
   * `timeline`: a dotted line with tones and absolute times (run and event
   * histories, audit trails).
   */
  variant?: 'feed' | 'timeline'
  /** Anchor for relative times. */
  now?: number
  /** Host navigation for object chips. */
  onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void
  /** Shown when there are no items. */
  emptyLabel?: ReactNode
}

function isoOf(value: DateInput): string {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString()
}

/**
 * Who did what, when: each entry names the actor, the verb, the object (as
 * an `ObjectChip`) and a summary. Times are `<time>` elements with the
 * absolute instant in their title. The timeline variant serves event
 * histories: a status dot per event and absolute times.
 */
export const ActivityFeed = forwardRef<HTMLOListElement, ActivityFeedProps>(function ActivityFeed(
  { items, variant = 'feed', now, onNavigate, emptyLabel, className, ...rest },
  ref,
) {
  const t = useMessage()
  const { locale, timeZone } = useLocale()
  if (items.length === 0) {
    return <p className="mtc-activity-empty">{emptyLabel ?? t('activity.empty')}</p>
  }
  return (
    <ol {...rest} ref={ref} className={cx('mtc-activity-feed', className)} data-variant={variant}>
      {items.map(item => {
        const iso = isoOf(item.timestamp)
        const absolute = formatDateTime(item.timestamp, { locale, timeZone })
        return (
          <li key={item.id} className="mtc-activity-item" data-tone={item.tone ?? 'neutral'}>
            {variant === 'timeline'
              ? <span className="mtc-activity-dot" aria-hidden="true" />
              : item.actor
                ? <Avatar name={item.actor.name} src={item.actor.avatarSrc} decorative />
                : <span className="mtc-activity-dot" aria-hidden="true" />}
            <p className="mtc-activity-text">
              {item.actor && <span className="mtc-activity-actor">{item.actor.name}</span>}
              {' '}
              <span className="mtc-activity-verb">{item.verb}</span>
              {item.object && (
                <>
                  {' '}
                  <ObjectChip object={item.object} onNavigate={onNavigate} />
                </>
              )}
              {item.summary != null && (
                <>
                  {' '}
                  <span className="mtc-activity-summary">{item.summary}</span>
                </>
              )}
            </p>
            <time className="mtc-activity-time" dateTime={iso} title={variant === 'timeline' ? iso : absolute}>
              {variant === 'timeline' ? absolute : formatRelativeTime(item.timestamp, { locale, now: now ?? Date.now() })}
            </time>
          </li>
        )
      })}
    </ol>
  )
})
