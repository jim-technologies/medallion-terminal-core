import { useMemo, type MouseEvent, type ReactNode } from 'react'
import { CopyButton, StatusBadge } from '../components/Display'
import { Tag } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { useLocale, useMessage } from '../foundations/DesignSystemProvider'
import type { StatusTone } from '../foundations/types'
import { ObjectChip } from './ObjectChip'
import {
  formatDateValue,
  formatNumericValue,
  formatPropertyText,
  isEmailAddress,
  isEmptyValue,
  relativeDateText,
  resolvePropertyKind,
  safeHttpUrl,
  toPropertyDate,
  type PropertyKind,
  type ResolvedKind,
} from './propertyFormat'
import { isObjectRef, type ObjectRef } from './types'

/** Props for one typed property value. */
export interface PropertyValueProps {
  /** The raw value. */
  value: unknown
  /** How to present it; inferred from the value when unset. */
  kind?: PropertyKind
  /** Refines the kind: `currency:USD`, `percent`, `date`, `datetime`, `id`, `url`. */
  format?: string
  /** Status tones for enum values, e.g. `{ Churned: 'danger' }`. */
  tones?: Readonly<Record<string, StatusTone>>
  /**
   * `panel` (default) adds secondary detail such as a currency code, relative
   * time and a copy action; `grid` keeps one compact line per value.
   */
  context?: 'panel' | 'grid'
  /** Shown for null, undefined, empty strings and empty lists. */
  emptyValue?: ReactNode
  /** Anchor for relative times, for deterministic rendering. */
  now?: number
  /** Host navigation for object references. */
  onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void
  /** List items shown before "+N" (3 in panels, 2 in grid cells). */
  maxListItems?: number
}

const MAX_OBJECT_DEPTH = 3

/**
 * Renders a value by its kind: tabular numbers, formatted currency and
 * percentages, dates with relative time, Yes/No with an icon, enum chips and
 * status badges, object references as chips, safe links, and nested objects
 * in a disclosure. Monospace is for ids and code only; nothing is rendered as
 * HTML.
 */
export function PropertyValue(props: PropertyValueProps) {
  return <ValueView {...props} depth={0} />
}

function ValueView({
  value,
  kind,
  format,
  tones,
  context = 'panel',
  emptyValue,
  now,
  onNavigate,
  maxListItems,
  depth,
}: PropertyValueProps & { depth: number }) {
  const { locale, timeZone } = useLocale()
  const t = useMessage()
  const resolved = useMemo(() => resolvePropertyKind(value, kind, format), [value, kind, format])
  const text = { locale, timeZone, yes: t('value.yes'), no: t('value.no') }
  const panel = context === 'panel'

  if (isEmptyValue(value)) {
    return <span className="mtc-value-empty">{emptyValue ?? '—'}</span>
  }

  switch (resolved.kind) {
    case 'id':
    case 'code': {
      const content = String(value)
      return (
        <span className="mtc-value-id" data-context={context}>
          <code>{content}</code>
          {panel && <CopyButton value={content} label={t('copy.label')} />}
        </span>
      )
    }
    case 'number':
    case 'integer':
    case 'currency':
    case 'percent':
    case 'bytes':
      return <NumericValue value={value} resolved={resolved} locale={locale} panel={panel} />
    case 'date':
    case 'datetime': {
      const parsed = toPropertyDate(value)
      if (!parsed) return <span className="mtc-value-text">{String(value)}</span>
      return (
        <span className="mtc-value-date">
          <time
            dateTime={parsed.dateOnly ? String(value).trim() : parsed.date.toISOString()}
            title={parsed.dateOnly ? String(value).trim() : parsed.date.toISOString()}
          >
            {formatDateValue(parsed, resolved.kind, text)}
          </time>
          {panel && (
            <span className="mtc-value-secondary">
              {relativeDateText(parsed, now ?? Date.now(), locale)}
            </span>
          )}
        </span>
      )
    }
    case 'boolean': {
      const truthy = value === true || value === 'true'
      return (
        <span className="mtc-value-boolean" data-value={truthy}>
          <Icon name={truthy ? 'check' : 'close'} />
          {truthy ? t('value.yes') : t('value.no')}
        </span>
      )
    }
    case 'enum': {
      const label = String(value)
      const tone = tones?.[label]
      if (tone && tone !== 'neutral') return <StatusBadge tone={tone}>{label}</StatusBadge>
      return <Tag className="mtc-value-chip">{label}</Tag>
    }
    case 'list': {
      const items = Array.isArray(value) ? value : [value]
      const limit = maxListItems ?? (panel ? 3 : 2)
      const shown = items.slice(0, limit)
      const rest = items.slice(limit)
      return (
        <span className="mtc-value-list" data-context={context}>
          {shown.map((item, index) => isObjectRef(item) ? (
            <ObjectChip key={`${item.id}:${index}`} object={item} onNavigate={onNavigate} />
          ) : (
            <Tag key={index} className="mtc-value-chip">
              {formatPropertyText(item, resolvePropertyKind(item), text)}
            </Tag>
          ))}
          {rest.length > 0 && (
            <Tag
              className="mtc-value-chip"
              title={t('value.moreTitle', {
                count: rest.length,
                items: rest.map(item => formatPropertyText(item, resolvePropertyKind(item), text)).join(', '),
              })}
            >
              {t('value.more', { count: rest.length })}
            </Tag>
          )}
        </span>
      )
    }
    case 'link':
      return isObjectRef(value)
        ? <ObjectChip object={value} onNavigate={onNavigate} />
        : <span className="mtc-value-text">{String(value)}</span>
    case 'url': {
      const href = safeHttpUrl(value)
      if (!href) return <span className="mtc-value-text">{String(value)}</span>
      const shown = String(value).trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
      return (
        <a className="mtc-value-link" href={href} target="_blank" rel="noopener noreferrer">
          <span className="mtc-value-link-text">{shown}</span>
          <Icon name="external-link" />
          <span className="mtc-visually-hidden">{t('value.newTab')}</span>
        </a>
      )
    }
    case 'email':
      return isEmailAddress(value)
        ? <a className="mtc-value-link" href={`mailto:${value.trim()}`}><span className="mtc-value-link-text">{value.trim()}</span></a>
        : <span className="mtc-value-text">{String(value)}</span>
    case 'object': {
      if (depth >= MAX_OBJECT_DEPTH || !value || typeof value !== 'object') {
        return <span className="mtc-value-text">{formatPropertyText(value, resolved, text)}</span>
      }
      const entries = Object.entries(value as Record<string, unknown>)
      return (
        <details className="mtc-value-object">
          <summary>{t('value.fields', { count: entries.length })}</summary>
          <dl>
            {entries.map(([key, item]) => (
              <div key={key} className="mtc-value-object-row">
                <dt>{key}</dt>
                <dd>
                  <ValueView value={item} context={context} now={now} onNavigate={onNavigate} depth={depth + 1} />
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )
    }
    default: {
      const content = String(value)
      return (
        <span className="mtc-value-text" data-context={context} title={content.length > 80 ? content : undefined}>
          {content}
        </span>
      )
    }
  }
}

function NumericValue({
  value,
  resolved,
  locale,
  panel,
}: {
  value: unknown
  resolved: ResolvedKind
  locale: string
  panel: boolean
}) {
  const amount = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(amount)) return <span className="mtc-value-text">{String(value)}</span>
  return (
    <span className="mtc-value-number">
      {formatNumericValue(amount, resolved, locale)}
      {panel && resolved.kind === 'currency' && (
        // The space keeps the code a separate word for assistive technology.
        <>{' '}<span className="mtc-value-secondary mtc-value-code">{resolved.currency}</span></>
      )}
    </span>
  )
}
