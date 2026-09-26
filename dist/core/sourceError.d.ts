/**
 * Typed transport failures.
 *
 * Every fetch the framework makes (data sources, and product calls through
 * `createProductFetch`) turns a failed request into a `SourceError` that
 * keeps what the server said: its HTTP status, its Connect error code and
 * reason, the request id that correlates it with a server span, and how long
 * the server asked the client to wait. UIs choose a state from `kind`
 * (`AccessDenied` for `forbidden`, `SessionExpired` for `unauthenticated`,
 * and so on) instead of printing "HTTP 403".
 *
 * Pure TypeScript: no React, safe for every entry point.
 */
/** What a failure means to the person looking at it. */
export type SourceErrorKind = 'unauthenticated' | 'forbidden' | 'not_found' | 'rate_limited' | 'unavailable' | 'invalid' | 'unknown';
/** Fields a `SourceError` carries besides its message. */
export interface SourceErrorInit {
    kind: SourceErrorKind;
    /** HTTP status of the failed response, when there was one. */
    status?: number;
    /** Connect error code in its wire spelling, e.g. `permission_denied`. */
    code?: string;
    /** Server-side correlation id: the response's request id, else the one sent. */
    requestId?: string;
    /** How long the server asked the client to wait (`Retry-After`), in ms. */
    retryAfterMs?: number;
}
/**
 * A failed request, typed. `message` is the server's reason when it sent one
 * (raw detail: show it in a disclosure, not as the headline) and otherwise a
 * short transport description such as `HTTP 503`.
 */
export declare class SourceError extends Error {
    readonly kind: SourceErrorKind;
    readonly status?: number;
    readonly code?: string;
    readonly requestId?: string;
    readonly retryAfterMs?: number;
    constructor(message: string, init: SourceErrorInit);
}
/**
 * True for a `SourceError`, including one created by another copy of this
 * package (hosts can bundle more than one).
 */
export declare function isSourceError(value: unknown): value is SourceError;
/** Kind for a Connect error code (`permission_denied` → `forbidden`). */
export declare function sourceErrorKindForCode(code: string): SourceErrorKind;
/** Kind for an HTTP status (403 → `forbidden`, 503 → `unavailable`). */
export declare function sourceErrorKindForStatus(status: number): SourceErrorKind;
/** The request id a response carries, if any. */
export declare function responseRequestId(headers: Headers): string | undefined;
/**
 * `Retry-After` in milliseconds: delta-seconds or an HTTP date, measured
 * from `now`. Absent, malformed or past values give `undefined`.
 */
export declare function parseRetryAfter(value: string | null, now?: number): number | undefined;
/**
 * Types a failed HTTP response. Reads the Connect JSON error body
 * (`{"code":"permission_denied","message":"…"}`) when there is one; the
 * body is consumed, so pass a clone if the caller still needs it.
 */
export declare function sourceErrorFromResponse(response: Response, options?: {
    requestId?: string;
    now?: number;
}): Promise<SourceError>;
/**
 * Types any thrown value: a `SourceError` passes through; an error from a
 * generated Connect client (numeric or string `code`, `rawMessage`,
 * `metadata` headers) keeps its code and request id; a timeout or network
 * failure is `unavailable`; anything else is `unknown`.
 */
export declare function toSourceError(value: unknown): SourceError;
/**
 * One-line summary for logs and the legacy string `error` fields:
 * `permission_denied: bucket finance is private`, or `HTTP 503`.
 */
export declare function describeSourceError(error: SourceError): string;
