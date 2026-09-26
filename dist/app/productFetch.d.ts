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
    /**
     * How long a request may wait for the server to start responding (its
     * response headers), in milliseconds; `0` or unset waits indefinitely.
     * Once the headers arrive the body is never cut, so a server stream or a
     * slow download runs for as long as it needs.
     *
     * Bounded: every request whose body is absent, a string, `URLSearchParams`,
     * an `ArrayBuffer` or a typed array / `DataView`. That includes every
     * connect-web call, which serialises its message (JSON or binary) to a
     * `Uint8Array`.
     *
     * Not bounded, because sending the body takes as long as the network
     * needs: a `Blob` or `File`, `FormData`, a `ReadableStream`, and a
     * `Request` object with a body (its body is always a stream). Also not
     * bounded by this setting: a call that sets its own wait
     * (`ProductRequestInit.timeoutMs`), and a Connect call that carries its
     * own deadline (`connect-timeout-ms`, from connect-web's per-call
     * `timeoutMs`), which connect-web enforces over the whole call.
     */
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
/**
 * `RequestInit` plus the one per-call setting of a product fetch.
 */
export interface ProductRequestInit extends RequestInit {
    /**
     * This call's wait for response headers, in milliseconds, in place of the
     * transport's `timeoutMs` and whatever the body is: `0` opts this call out
     * (it waits indefinitely), a positive value bounds it, even an upload.
     */
    timeoutMs?: number;
}
/** The `fetch` that `createProductFetch` returns. */
export type ProductFetch = (input: RequestInfo | URL, init?: ProductRequestInit) => Promise<Response>;
/** A random, sampled W3C trace context: `00-<trace id>-<span id>-01`. */
export declare function newTraceparent(): string;
/**
 * Wraps `fetch` for product UIs. It is a drop-in `fetch` (plain calls, and
 * connect-web's `createConnectTransport({ fetch })`), and every request:
 *
 * - carries `x-request-id` and a W3C `traceparent` unless it already has
 *   them, so a failure shown to a person can be traced to its server span;
 * - aborts on the caller's signal, or when the response headers have not
 *   arrived within `timeoutMs` (see that option for which requests it
 *   bounds; connect-web unary and streaming calls are bounded); a body that
 *   is already streaming is never cut by the timeout;
 * - reports a 401 to `onUnauthenticated` with its typed `SourceError`;
 * - rejects with a `SourceError` (`unavailable`) on a timeout or a network
 *   failure. A caller's own abort still rejects with the platform
 *   `AbortError`. connect-web wraps the rejection in a `ConnectError` whose
 *   `cause` is the `SourceError`; `toSourceError` returns it.
 *
 * One call opts out of the wait, or sets its own, with
 * `productFetch(url, { ...init, timeoutMs: 0 })`; a connect-web call does it
 * with its own `timeoutMs` call option.
 *
 * Responses, including error responses, are returned unchanged: transports
 * parse their own error bodies. Plain callers use `ensureOk` to turn a
 * non-2xx response into a `SourceError`.
 */
export declare function createProductFetch(options?: ProductFetchOptions): ProductFetch;
/**
 * Returns a 2xx response unchanged and rejects with its typed `SourceError`
 * otherwise, for callers that use `fetch` directly.
 */
export declare function ensureOk(response: Response): Promise<Response>;
