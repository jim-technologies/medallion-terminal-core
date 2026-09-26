/**
 * Locale-aware formatting on the platform `Intl` APIs. Every formatter takes
 * the locale (and, for dates, the time zone) explicitly, so server and client
 * render the same text when the host passes the same values; inside a
 * `DesignSystemProvider`, `useLocale()` supplies them.
 */

/** Locale inputs shared by the formatters. */
export interface LocaleOptions {
  /** BCP 47 locale; defaults to `en`. */
  locale?: string
}

/** A date as a `Date`, epoch milliseconds, or an ISO-8601 string. */
export type DateInput = Date | number | string

function toDate(value: DateInput): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Grouped number: `1,234,567.8` in `en`, `1.234.567,8` in `de`. */
export function formatNumber(
  value: number,
  { locale = 'en', ...options }: LocaleOptions & Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

const BYTE_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'] as const

/**
 * A byte count in SI units (1 kB = 1,000 bytes) with at most one decimal:
 * `532 bytes`, `2.3 MB`. Negative and non-finite input is shown as given.
 */
export function formatBytes(bytes: number, { locale = 'en' }: LocaleOptions = {}): string {
  if (!Number.isFinite(bytes) || bytes < 0) return String(bytes)
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < BYTE_UNITS.length - 1) {
    value /= 1000
    unit += 1
  }
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: BYTE_UNITS[unit],
    unitDisplay: unit === 0 ? 'long' : 'short',
    maximumFractionDigits: unit === 0 ? 0 : 1,
  }).format(value)
}

/** Options for `formatDateTime`. */
export interface DateTimeOptions extends LocaleOptions {
  /** IANA zone such as `UTC`; defaults to the runtime's zone. */
  timeZone?: string
  /** Defaults to `medium` (`Oct 18, 2026`). `none` omits the date. */
  dateStyle?: 'full' | 'long' | 'medium' | 'short' | 'none'
  /** Defaults to `short` (`3:04 PM`). `none` omits the time. */
  timeStyle?: 'full' | 'long' | 'medium' | 'short' | 'none'
}

/**
 * An absolute date and time: `Oct 18, 2026, 3:04 PM`. Unparseable input is
 * returned as written rather than shown as "Invalid Date".
 */
export function formatDateTime(
  value: DateInput,
  { locale = 'en', timeZone, dateStyle = 'medium', timeStyle = 'short' }: DateTimeOptions = {},
): string {
  const date = toDate(value)
  if (!date) return String(value)
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: dateStyle === 'none' ? undefined : dateStyle,
    timeStyle: timeStyle === 'none' ? undefined : timeStyle,
  }).format(date)
}

// Thresholds in seconds at which relative time moves to a coarser unit.
const RELATIVE_UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 30],
  ['month', 12],
  ['year', Number.POSITIVE_INFINITY],
]

/**
 * Time relative to `now`: `5 minutes ago`, `in 3 days`, `yesterday`.
 * Unparseable input is returned as written.
 */
export function formatRelativeTime(
  value: DateInput,
  { locale = 'en', now = Date.now() }: LocaleOptions & { now?: number } = {},
): string {
  const date = toDate(value)
  if (!date) return String(value)
  let amount = (date.getTime() - now) / 1000
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(amount) < size) return format.format(Math.round(amount), unit)
    amount /= size
  }
  return format.format(Math.round(amount), 'year')
}

/**
 * A wait or elapsed time in its largest whole unit, rounded up so a
 * countdown never reads shorter than it is: `30 seconds`, `2 minutes`.
 */
export function formatDuration(milliseconds: number, { locale = 'en' }: LocaleOptions = {}): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000))
  const [unit, amount] = seconds < 60
    ? ['second', seconds] as const
    : seconds < 3600
      ? ['minute', Math.ceil(seconds / 60)] as const
      : ['hour', Math.ceil(seconds / 3600)] as const
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'long' }).format(amount)
}
