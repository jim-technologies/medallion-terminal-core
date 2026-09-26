import {
  SourceError,
  rememberSentRequestId,
  sourceErrorFromResponse,
  toSourceError,
} from '../core/sourceError'

/** One settled product request, for client telemetry. */
export interface ProductRequestEvent {
  method: string
  url: string
  /** Response status; absent when no response arrived. */
  status?: number
  requestId: string
  traceparent: string
  durationMs: number
  /** Set for failed requests (a non-2xx response or no response at all). */
  error?: SourceError
}

/** Configuration for `createProductFetch`. */
export interface ProductFetchOptions {
  /**
   * The fetch to wrap. Defaults to the global `fetch`, looked up per call so
   * hosts and tests can supply their own.
   */
  fetch?: typeof globalThis.fetch
  /**
   * Called for every 401 with its typed error, for example to show the
   * `SessionExpired` state and renew the session. The response is still
   * returned to the caller.
   */
  onUnauthenticated?: (error: SourceError) => void
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
  timeoutMs?: number
  /** Request id generator for `x-request-id`. Defaults to a random UUID. */
  newRequestId?: () => string
  /** W3C `traceparent` generator. Defaults to a random sampled context. */
  newTraceparent?: () => string
  /** Observes every settled request. */
  onRequest?: (event: ProductRequestEvent) => void
  /** Clock for durations; defaults to `performance.now`. */
  now?: () => number
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
  timeoutMs?: number
}

/** The `fetch` that `createProductFetch` returns. */
export type ProductFetch = (input: RequestInfo | URL, init?: ProductRequestInit) => Promise<Response>

const REQUEST_ID_HEADER = 'x-request-id'
const TRACEPARENT_HEADER = 'traceparent'
// Sent by connect-web when a call sets its own `timeoutMs`; connect-web then
// aborts the call at that deadline itself.
const CONNECT_TIMEOUT_HEADER = 'connect-timeout-ms'

function randomHex(bytes: number): string {
  const values = new Uint8Array(bytes)
  globalThis.crypto.getRandomValues(values)
  return Array.from(values, value => value.toString(16).padStart(2, '0')).join('')
}

/** A random, sampled W3C trace context: `00-<trace id>-<span id>-01`. */
export function newTraceparent(): string {
  return `00-${randomHex(16)}-${randomHex(8)}-01`
}

function newRequestId(): string {
  return typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : randomHex(16)
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

function requestMethod(input: RequestInfo | URL, init?: RequestInit): string {
  return (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
}

// Open-ended bodies, whose send time grows with a size the caller does not
// bound: a fixed wait for the response headers would cut a large upload
// partway. Buffered bodies (strings, `ArrayBuffer`s and typed arrays, which
// is what connect-web sends for every call) are already in memory and stay
// bounded. A `Request`'s body is always a stream, whatever built it.
function hasOpenEndedBody(input: RequestInfo | URL, init?: RequestInit): boolean {
  const body = init?.body ?? (input instanceof Request ? input.body : null)
  return body instanceof Blob
    || body instanceof FormData
    || body instanceof ReadableStream
}

// The wait for response headers this call gets, in ms; undefined waits
// indefinitely.
function headerWaitFor(
  timeoutMs: number | undefined,
  headers: Headers,
  input: RequestInfo | URL,
  init?: ProductRequestInit,
): number | undefined {
  const wait = init?.timeoutMs !== undefined
    ? init.timeoutMs
    : headers.has(CONNECT_TIMEOUT_HEADER) || hasOpenEndedBody(input, init)
      ? undefined
      : timeoutMs
  return wait && wait > 0 ? wait : undefined
}

function composeSignals(signals: readonly (AbortSignal | undefined)[]): AbortSignal | undefined {
  const present = signals.filter((signal): signal is AbortSignal => !!signal)
  if (present.length <= 1) return present[0]
  return AbortSignal.any(present)
}

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
 * `productFetch(url, { ...init, timeoutMs: 0 })`. A connect-web call can set
 * its own positive deadline with its `timeoutMs` call option (sent as
 * `connect-timeout-ms`, which replaces this wait); it cannot opt out, because
 * connect-web sends no deadline for `timeoutMs: 0`.
 *
 * Responses, including error responses, are returned unchanged: transports
 * parse their own error bodies. Plain callers use `ensureOk` to turn a
 * non-2xx response into a `SourceError`.
 */
export function createProductFetch(options: ProductFetchOptions = {}): ProductFetch {
  const {
    onUnauthenticated,
    timeoutMs,
    onRequest,
    newRequestId: requestIdFor = newRequestId,
    newTraceparent: traceparentFor = newTraceparent,
    now = () => performance.now(),
  } = options

  return async function productFetch(input: RequestInfo | URL, init?: ProductRequestInit) {
    const baseFetch = options.fetch ?? globalThis.fetch
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
    if (!headers.has(REQUEST_ID_HEADER)) headers.set(REQUEST_ID_HEADER, requestIdFor())
    if (!headers.has(TRACEPARENT_HEADER)) headers.set(TRACEPARENT_HEADER, traceparentFor())
    const requestId = headers.get(REQUEST_ID_HEADER)!
    const traceparent = headers.get(TRACEPARENT_HEADER)!
    const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined)
    // Bounds only the wait for the response headers: the timer is cleared as
    // soon as they arrive, so the signal handed to fetch (which also governs
    // reading the body) aborts afterwards only on the caller's own abort.
    const waitMs = headerWaitFor(timeoutMs, headers, input, init)
    const deadline = waitMs ? new AbortController() : undefined
    const timer = deadline
      ? setTimeout(() => deadline.abort(new DOMException(`No response within ${waitMs} ms`, 'TimeoutError')), waitMs)
      : undefined
    const method = requestMethod(input, init)
    const url = requestUrl(input)
    const started = now()
    const report = (event: Pick<ProductRequestEvent, 'status' | 'error'>) => onRequest?.({
      method,
      url,
      requestId,
      traceparent,
      durationMs: now() - started,
      ...event,
    })

    // The per-call setting is the transport's, not the platform fetch's.
    const { timeoutMs: _callTimeoutMs, ...fetchInit } = init ?? {}
    let response: Response
    try {
      response = await baseFetch(input, {
        ...fetchInit,
        headers,
        signal: composeSignals([callerSignal ?? undefined, deadline?.signal]),
      })
    } catch (thrown) {
      // The caller cancelled: keep the platform's AbortError semantics.
      if (callerSignal?.aborted) throw thrown
      const error = deadline?.signal.aborted
        ? new SourceError(`Request timed out after ${waitMs} ms`, { kind: 'unavailable', requestId })
        : withRequestId(toSourceError(thrown), requestId)
      report({ error })
      throw error
    } finally {
      clearTimeout(timer)
    }

    rememberSentRequestId(response, requestId)
    if (response.ok) {
      report({ status: response.status })
      return response
    }
    const error = await sourceErrorFromResponse(response.clone(), { requestId })
    report({ status: response.status, error })
    if (response.status === 401) onUnauthenticated?.(error)
    return response
  }
}

function withRequestId(error: SourceError, requestId: string): SourceError {
  if (error.requestId) return error
  return new SourceError(error.message, {
    kind: error.kind,
    status: error.status,
    code: error.code,
    retryAfterMs: error.retryAfterMs,
    requestId,
  })
}

/**
 * Returns a 2xx response unchanged and rejects with its typed `SourceError`
 * otherwise, for callers that use `fetch` directly.
 */
export async function ensureOk(response: Response): Promise<Response> {
  if (response.ok) return response
  throw await sourceErrorFromResponse(response)
}
