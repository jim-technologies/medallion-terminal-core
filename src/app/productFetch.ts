import {
  SourceError,
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
  /** Aborts a request after this many milliseconds; `0` or unset never does. */
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

const REQUEST_ID_HEADER = 'x-request-id'
const TRACEPARENT_HEADER = 'traceparent'

// The id sent with each response this wrapper returned, so `ensureOk` can
// report it when the server echoes none. Weak: responses are never retained.
const sentRequestIds = new WeakMap<Response, string>()

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
export function createProductFetch(options: ProductFetchOptions = {}): typeof globalThis.fetch {
  const {
    onUnauthenticated,
    timeoutMs,
    onRequest,
    newRequestId: requestIdFor = newRequestId,
    newTraceparent: traceparentFor = newTraceparent,
    now = () => performance.now(),
  } = options

  return async function productFetch(input: RequestInfo | URL, init?: RequestInit) {
    const baseFetch = options.fetch ?? globalThis.fetch
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
    if (!headers.has(REQUEST_ID_HEADER)) headers.set(REQUEST_ID_HEADER, requestIdFor())
    if (!headers.has(TRACEPARENT_HEADER)) headers.set(TRACEPARENT_HEADER, traceparentFor())
    const requestId = headers.get(REQUEST_ID_HEADER)!
    const traceparent = headers.get(TRACEPARENT_HEADER)!
    const callerSignal = init?.signal ?? (input instanceof Request ? input.signal : undefined)
    const timeoutSignal = timeoutMs && timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined
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

    let response: Response
    try {
      response = await baseFetch(input, {
        ...init,
        headers,
        signal: composeSignals([callerSignal ?? undefined, timeoutSignal]),
      })
    } catch (thrown) {
      // The caller cancelled: keep the platform's AbortError semantics.
      if (callerSignal?.aborted) throw thrown
      const error = timeoutSignal?.aborted
        ? new SourceError(`Request timed out after ${timeoutMs} ms`, { kind: 'unavailable', requestId })
        : withRequestId(toSourceError(thrown), requestId)
      report({ error })
      throw error
    }

    sentRequestIds.set(response, requestId)
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
  throw await sourceErrorFromResponse(response, { requestId: sentRequestIds.get(response) })
}
