import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { useMessage } from '../foundations/DesignSystemProvider'
import type { StatusTone } from '../foundations/types'
import { StatusBadge } from './Display'
import { Icon } from './Icon'
import { navigateOnPlainClick } from './navigation'
import { cx } from './utils'

/** A change against a previous period. */
export interface StatDelta {
  /** Formatted change, such as "+4.2%" or "12". */
  value: ReactNode
  /** Direction of the change; draws an arrow. */
  direction?: 'up' | 'down'
  /** Whether the change is good (`ok`), bad (`danger`) or neither. */
  tone?: 'ok' | 'danger' | 'neutral'
}

/** Props for one headline number. */
export interface StatTileProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** What the number measures. */
  label: ReactNode
  /** The number, already formatted. */
  value: ReactNode
  /** Unit after the value, such as "ms" or "USD". */
  unit?: ReactNode
  /** Change against a previous period. */
  delta?: StatDelta
  /** A status badge, such as a service's health. */
  status?: { label: ReactNode; tone: StatusTone }
  /** One line of context under the value. */
  description?: ReactNode
  /** Leading visual beside the label, such as a `TypeGlyph`. */
  icon?: ReactNode
  /** Makes the whole tile a link. */
  href?: string
  /** Host navigation for a plain click on the link. */
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void
}

/**
 * A headline number with its label, unit, change, status and context: the
 * toolkit counterpart of the dashboard `metric` widget, for service health
 * grids, link counts and summary rows.
 */
export const StatTile = forwardRef<HTMLElement, StatTileProps>(function StatTile(
  { label, value, unit, delta, status, description, icon, href, onNavigate, className, ...rest },
  ref,
) {
  const t = useMessage()
  const body = (
    <>
      <div className="mtc-stat-tile-top">
        {icon}
        <span className="mtc-stat-tile-label">{label}</span>
        {status && <StatusBadge tone={status.tone} className="mtc-stat-tile-status">{status.label}</StatusBadge>}
      </div>
      <div className="mtc-stat-tile-value">
        <span>{value}</span>
        {unit != null && <span className="mtc-stat-tile-unit">{unit}</span>}
      </div>
      {(delta || description) && (
        <div className="mtc-stat-tile-foot">
          {delta && (
            <span className="mtc-stat-tile-delta" data-tone={delta.tone ?? 'neutral'}>
              {delta.direction && (
                <Icon
                  name="arrow-right"
                  className="mtc-stat-tile-arrow"
                  data-direction={delta.direction}
                  label={delta.direction === 'up' ? t('stat.increase') : t('stat.decrease')}
                />
              )}
              {delta.value}
            </span>
          )}
          {description && <span className="mtc-stat-tile-description">{description}</span>}
        </div>
      )}
    </>
  )
  if (href) {
    return (
      <a
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={cx('mtc-stat-tile', className)}
        data-interactive="true"
        onClick={navigateOnPlainClick(onNavigate)}
      >
        {body}
      </a>
    )
  }
  return (
    <div {...rest} ref={ref as Ref<HTMLDivElement>} className={cx('mtc-stat-tile', className)}>
      {body}
    </div>
  )
})
