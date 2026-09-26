/**
 * How a property value is presented. Formats refine kinds: `currency:EUR`,
 * `percent` (a 0-1 ratio), `date`, `datetime`, `id`, `code`, `url`, `email`.
 */
export type PropertyKind = 'string' | 'id' | 'code' | 'number' | 'integer' | 'currency' | 'percent' | 'date' | 'datetime' | 'boolean' | 'enum' | 'list' | 'object' | 'link' | 'url' | 'email';
/** A kind with its format arguments resolved. */
export interface ResolvedKind {
    kind: PropertyKind;
    /** ISO 4217 code for `currency`. */
    currency?: string;
}
/**
 * The kind a value renders as: an explicit `format` wins, then `kind`, then
 * the value's own JavaScript type.
 */
export declare function resolvePropertyKind(value: unknown, kind?: PropertyKind, format?: string): ResolvedKind;
/** Null, undefined, an empty string and an empty list show as empty. */
export declare function isEmptyValue(value: unknown): boolean;
/** Kinds whose values align to the end of a grid column. */
export declare function isNumericKind(kind: PropertyKind): boolean;
/**
 * A date value. A bare `YYYY-MM-DD` is a calendar date, formatted in UTC so
 * it never shifts a day in the viewer's time zone.
 */
export declare function toPropertyDate(value: unknown): {
    date: Date;
    dateOnly: boolean;
} | null;
/** An `http:` or `https:` URL, or null; no other scheme becomes a link. */
export declare function safeHttpUrl(value: unknown): string | null;
/** A plausible e-mail address (one `@`, a dotted domain, no spaces). */
export declare function isEmailAddress(value: unknown): value is string;
/** Locale settings and localized words used for text output. */
export interface PropertyTextOptions {
    locale?: string;
    timeZone?: string;
    /** Word for `true`; defaults to "Yes". */
    yes?: string;
    /** Word for `false`; defaults to "No". */
    no?: string;
}
/** A number in the kind's format (grouped, currency, percent). */
export declare function formatNumericValue(amount: number, resolved: ResolvedKind, locale?: string): string;
/** A date in the kind's format: `Oct 18, 2026`, or with the time. */
export declare function formatDateValue(parsed: {
    date: Date;
    dateOnly: boolean;
}, kind: PropertyKind, { locale, timeZone }?: PropertyTextOptions): string;
/**
 * Relative wording for a date (`in 23 days`, `5 minutes ago`). A calendar
 * date counts whole days from today (in UTC, like its formatting), so
 * tomorrow is "tomorrow" at any hour.
 */
export declare function relativeDateText(parsed: {
    date: Date;
    dateOnly: boolean;
}, now: number, locale?: string): string;
/**
 * The value as one line of plain text, for filtering, titles, exports and
 * screen-reader-only summaries.
 */
export declare function formatPropertyText(value: unknown, resolved: ResolvedKind, options?: PropertyTextOptions): string;
/**
 * A comparable key for sorting: numbers for numeric and date kinds, text
 * otherwise, `null` for empty values (which sort last).
 */
export declare function propertySortKey(value: unknown, resolved: ResolvedKind, options?: PropertyTextOptions): number | string | null;
/** Compares two sort keys; empty values sort last in both directions. */
export declare function compareSortKeys(left: number | string | null, right: number | string | null): number;
