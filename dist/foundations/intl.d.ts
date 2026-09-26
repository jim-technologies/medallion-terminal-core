/**
 * Locale-aware formatting on the platform `Intl` APIs. Every formatter takes
 * the locale (and, for dates, the time zone) explicitly, so server and client
 * render the same text when the host passes the same values; inside a
 * `DesignSystemProvider`, `useLocale()` supplies them.
 */
/** Locale inputs shared by the formatters. */
export interface LocaleOptions {
    /** BCP 47 locale; defaults to `en`. */
    locale?: string;
}
/** A date as a `Date`, epoch milliseconds, or an ISO-8601 string. */
export type DateInput = Date | number | string;
/** Grouped number: `1,234,567.8` in `en`, `1.234.567,8` in `de`. */
export declare function formatNumber(value: number, { locale, ...options }?: LocaleOptions & Intl.NumberFormatOptions): string;
/**
 * A byte count in SI units (1 kB = 1,000 bytes) with at most one decimal:
 * `532 bytes`, `2.3 MB`. Negative and non-finite input is shown as given.
 */
export declare function formatBytes(bytes: number, { locale }?: LocaleOptions): string;
/** Options for `formatDateTime`. */
export interface DateTimeOptions extends LocaleOptions {
    /** IANA zone such as `UTC`; defaults to the runtime's zone. */
    timeZone?: string;
    /** Defaults to `medium` (`Oct 18, 2026`). `none` omits the date. */
    dateStyle?: 'full' | 'long' | 'medium' | 'short' | 'none';
    /** Defaults to `short` (`3:04 PM`). `none` omits the time. */
    timeStyle?: 'full' | 'long' | 'medium' | 'short' | 'none';
}
/**
 * An absolute date and time: `Oct 18, 2026, 3:04 PM`. Unparseable input is
 * returned as written rather than shown as "Invalid Date".
 */
export declare function formatDateTime(value: DateInput, { locale, timeZone, dateStyle, timeStyle }?: DateTimeOptions): string;
/**
 * Time relative to `now`: `5 minutes ago`, `in 3 days`, `yesterday`.
 * Unparseable input is returned as written.
 */
export declare function formatRelativeTime(value: DateInput, { locale, now }?: LocaleOptions & {
    now?: number;
}): string;
/**
 * A wait or elapsed time in its largest whole unit, rounded up so a
 * countdown never reads shorter than it is: `30 seconds`, `2 minutes`.
 */
export declare function formatDuration(milliseconds: number, { locale }?: LocaleOptions): string;
