/**
 * Typed property formatting shared by PropertyValue, PropertyPanel and
 * DataGrid cells: a value's kind decides its text, alignment and sort key.
 * Pure functions; the React rendering lives in PropertyValue.
 */
import { formatBytes, formatDateTime, formatNumber, formatRelativeTime } from '../foundations/intl'
import { isObjectRef } from './types'

/**
 * How a property value is presented. Formats refine kinds: `currency:EUR`,
 * `percent` (a 0-1 ratio), `bytes` (a byte count, `48.2 kB`), `date`,
 * `datetime`, `id`, `code`, `url`, `email`.
 */
export type PropertyKind =
  | 'string'
  | 'id'
  | 'code'
  | 'number'
  | 'integer'
  | 'currency'
  | 'percent'
  | 'bytes'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'enum'
  | 'list'
  | 'object'
  | 'link'
  | 'url'
  | 'email'

/** A kind with its format arguments resolved. */
export interface ResolvedKind {
  kind: PropertyKind
  /** ISO 4217 code for `currency`. */
  currency?: string
}

const KINDS = new Set<PropertyKind>([
  'string', 'id', 'code', 'number', 'integer', 'currency', 'percent', 'bytes', 'date', 'datetime',
  'boolean', 'enum', 'list', 'object', 'link', 'url', 'email',
])

/**
 * The kind a value renders as: an explicit `format` wins, then `kind`, then
 * the value's own JavaScript type.
 */
export function resolvePropertyKind(value: unknown, kind?: PropertyKind, format?: string): ResolvedKind {
  if (format) {
    const [name, argument] = format.split(':')
    if (name === 'currency') return { kind: 'currency', currency: (argument || 'USD').toUpperCase() }
    if (KINDS.has(name as PropertyKind)) return { kind: name as PropertyKind }
  }
  if (kind === 'currency') return { kind, currency: 'USD' }
  if (kind) return { kind }
  if (typeof value === 'boolean') return { kind: 'boolean' }
  if (typeof value === 'number' || typeof value === 'bigint') return { kind: 'number' }
  if (Array.isArray(value)) return { kind: 'list' }
  if (isObjectRef(value)) return { kind: 'link' }
  if (value && typeof value === 'object') return { kind: 'object' }
  return { kind: 'string' }
}

/** Null, undefined, an empty string and an empty list show as empty. */
export function isEmptyValue(value: unknown): boolean {
  return value == null || value === '' || (Array.isArray(value) && value.length === 0)
}

/** Kinds whose values align to the end of a grid column. */
export function isNumericKind(kind: PropertyKind): boolean {
  return kind === 'number' || kind === 'integer' || kind === 'currency' || kind === 'percent' || kind === 'bytes'
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
  return null
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * A date value. A bare `YYYY-MM-DD` is a calendar date, formatted in UTC so
 * it never shifts a day in the viewer's time zone.
 */
export function toPropertyDate(value: unknown): { date: Date; dateOnly: boolean } | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : { date: value, dateOnly: false }
  if (typeof value === 'number') return { date: new Date(value), dateOnly: false }
  if (typeof value !== 'string' || value.trim() === '') return null
  const dateOnly = DATE_ONLY.test(value.trim())
  const date = new Date(dateOnly ? `${value.trim()}T00:00:00Z` : value)
  return Number.isNaN(date.getTime()) ? null : { date, dateOnly }
}

/** An `http:` or `https:` URL, or null; no other scheme becomes a link. */
export function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

/** A plausible e-mail address (one `@`, a dotted domain, no spaces). */
export function isEmailAddress(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

/** Locale settings and localized words used for text output. */
export interface PropertyTextOptions {
  locale?: string
  timeZone?: string
  /** Word for `true`; defaults to "Yes". */
  yes?: string
  /** Word for `false`; defaults to "No". */
  no?: string
}

/** A number in the kind's format (grouped, currency, percent, bytes). */
export function formatNumericValue(amount: number, resolved: ResolvedKind, locale = 'en'): string {
  switch (resolved.kind) {
    case 'integer':
      return formatNumber(Math.round(amount), { locale, maximumFractionDigits: 0 })
    case 'currency':
      try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: resolved.currency ?? 'USD' }).format(amount)
      } catch {
        return `${formatNumber(amount, { locale })} ${resolved.currency ?? ''}`.trim()
      }
    case 'bytes':
      return formatBytes(amount, { locale })
    case 'percent':
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(amount)
    default:
      return formatNumber(amount, { locale })
  }
}

/** A date in the kind's format: `Oct 18, 2026`, or with the time. */
export function formatDateValue(
  parsed: { date: Date; dateOnly: boolean },
  kind: PropertyKind,
  { locale = 'en', timeZone }: PropertyTextOptions = {},
): string {
  const withTime = kind === 'datetime' && !parsed.dateOnly
  return formatDateTime(parsed.date, {
    locale,
    timeZone: parsed.dateOnly ? 'UTC' : timeZone,
    dateStyle: 'medium',
    timeStyle: withTime ? 'short' : 'none',
  })
}

const DAY_MS = 86_400_000

/**
 * Relative wording for a date (`in 23 days`, `5 minutes ago`). A calendar
 * date counts whole days from today (in UTC, like its formatting), so
 * tomorrow is "tomorrow" at any hour.
 */
export function relativeDateText(parsed: { date: Date; dateOnly: boolean }, now: number, locale = 'en'): string {
  if (!parsed.dateOnly) return formatRelativeTime(parsed.date, { locale, now })
  const today = new Date(now)
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const days = Math.round((parsed.date.getTime() - startOfToday) / DAY_MS)
  if (Math.abs(days) < 30) {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day')
  }
  return formatRelativeTime(parsed.date, { locale, now: startOfToday })
}

/**
 * The value as one line of plain text, for filtering, titles, exports and
 * screen-reader-only summaries.
 */
export function formatPropertyText(value: unknown, resolved: ResolvedKind, options: PropertyTextOptions = {}): string {
  if (isEmptyValue(value)) return ''
  const { locale = 'en' } = options
  switch (resolved.kind) {
    case 'number':
    case 'integer':
    case 'currency':
    case 'percent':
    case 'bytes': {
      const amount = toNumber(value)
      return amount == null ? String(value) : formatNumericValue(amount, resolved, locale)
    }
    case 'date':
    case 'datetime': {
      const parsed = toPropertyDate(value)
      return parsed ? formatDateValue(parsed, resolved.kind, options) : String(value)
    }
    case 'boolean':
      return value === true || value === 'true' ? options.yes ?? 'Yes' : options.no ?? 'No'
    case 'list':
      return (Array.isArray(value) ? value : [value])
        .map(item => formatPropertyText(item, resolvePropertyKind(item), options))
        .join(', ')
    case 'link':
      return isObjectRef(value) ? value.title : String(value)
    case 'object':
      try {
        return Object.entries(value as Record<string, unknown>)
          .map(([key, item]) => `${key}: ${formatPropertyText(item, resolvePropertyKind(item), options)}`)
          .join(', ')
      } catch {
        return String(value)
      }
    default:
      return String(value)
  }
}

/**
 * A comparable key for sorting: numbers for numeric and date kinds, text
 * otherwise, `null` for empty values (which sort last).
 */
export function propertySortKey(value: unknown, resolved: ResolvedKind, options: PropertyTextOptions = {}): number | string | null {
  if (isEmptyValue(value)) return null
  if (isNumericKind(resolved.kind)) return toNumber(value) ?? formatPropertyText(value, resolved, options)
  if (resolved.kind === 'date' || resolved.kind === 'datetime') {
    return toPropertyDate(value)?.date.getTime() ?? String(value)
  }
  if (resolved.kind === 'boolean') return value === true || value === 'true' ? 1 : 0
  return formatPropertyText(value, resolved, options)
}

// One collator for every comparison: constructing one per `localeCompare`
// call made a 10,000-row text sort take half a second.
const COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

/** Compares two sort keys; empty values sort last in both directions. */
export function compareSortKeys(left: number | string | null, right: number | string | null): number {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return COLLATOR.compare(String(left), String(right))
}
