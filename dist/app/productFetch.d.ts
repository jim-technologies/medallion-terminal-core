import { SourceError } from '../core/sourceError';
/** One settled product request, for client telemetry. */
export interface ProductRequestEvent {
    method: string;
    url: string;
    /** Response status; absent when no response arrived. */
    status?: number;
    requestId: string;
    traceparent: string;
    durationMs: number;
    /** Set for failed requests (a non-2xx response or no response at all). */
    error?: SourceError;
}
/** Configuration for `createProductFetch`. */
export interface ProductFetchOptions {
    /**
     * The fetch to wrap. Defaults to the global `fetch`, looked up per call so
     * hosts and tests can supply their own.
     */
    fetch?: typeof globalThis.fetch;
    /**
     * Called for every 401 with its typed error, for example to show the
     * `SessionExpired` state and renew the session. The response is still
     * returned to the caller.
     */
    onUnauthenticated?: (error: SourceError) => void;
    /** Aborts a request after this many milliseconds; `0` or unset never does. */
    timeoutMs?: number;
    /** Request id generator for `x-request-id`. Defaults to a random UUID. */
    newRequestId?: () => string;
    /** W3C `traceparent` generator. Defaults to a random sampled context. */
    newTraceparent?: () => string;
    /** Observes every settled request. */
    onRequest?: (event: ProductRequestEvent) => void;
    /** Clock for durations; defaults to `performance.now`. */
    now?: () => number;
}
/** A random, sampled W3C trace context: `00-<trace id>-<span id>-01`. */
export declare function newTraceparent(): string;
/**
 * Wraps `fetch` for product UIs. It is a drop-in `fetch` (plain calls, and
 * connect-web's `createConnectTransport({ fetch })`), and every request:
 *
 * - carries `x-request-id` and a W3C `traceparent` unless it already has
 *   them, so a failure shown to a person can be traced to its server span;
 * - aborts on the caller's signal or after `timeoutMs`, whichever is first;
 * - reports a 401 to `onUnauthenticated` with its typed `SourceError`;
 * - rejects with a `SourceError` (`unavailable`) on a timeout or a network
 *   failure. A caller's own abort still rejects with the platform
 *   `AbortError`.
 *
 * Responses, including error responses, are returned unchanged: transports
 * parse their own error bodies. Plain callers use `ensureOk` to turn a
 * non-2xx response into a `SourceError`.
 */
export declare function createProductFetch(options?: ProductFetchOptions): typeof globalThis.fetch;
/**
 * Returns a 2xx response unchanged and rejects with its typed `SourceError`
 * otherwise, for callers that use `fetch` directly.
 */
export declare function ensureOk(response: Response): Promise<Response>;
