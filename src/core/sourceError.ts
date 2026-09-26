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
export type SourceErrorKind =
  | 'unauthenticated'
  | 'forbidden'
  | 'not_found'
  | 'rate_limited'
  | 'unavailable'
  | 'invalid'
  | 'unknown'

/** Fields a `SourceError` carries besides its message. */
export interface SourceErrorInit {
  kind: SourceErrorKind
  /** HTTP status of the failed response, when there was one. */
  status?: number
  /** Connect error code in its wire spelling, e.g. `permission_denied`. */
  code?: string
  /** Server-side correlation id: the response's request id, else the one sent. */
  requestId?: string
  /** How long the server asked the client to wait (`Retry-After`), in ms. */
  retryAfterMs?: number
}

/**
 * A failed request, typed. `message` is the server's reason when it sent one
 * (raw detail: show it in a disclosure, not as the headline) and otherwise a
 * short transport description such as `HTTP 503`.
 */
export class SourceError extends Error {
  readonly kind: SourceErrorKind
  readonly status?: number
  readonly code?: string
  readonly requestId?: string
  readonly retryAfterMs?: number

  constructor(message: string, init: SourceErrorInit) {
    super(message)
    this.name = 'SourceError'
    this.kind = init.kind
    this.status = init.status
    this.code = init.code
    this.requestId = init.requestId
    this.retryAfterMs = init.retryAfterMs
  }
}

/**
 * True for a `SourceError`, including one created by another copy of this
 * package (hosts can bundle more than one).
 */
export function isSourceError(value: unknown): value is SourceError {
  return value instanceof SourceError || (
    value instanceof Error
    && value.name === 'SourceError'
    && typeof (value as { kind?: unknown }).kind === 'string'
  )
}

// Connect's error codes in wire spelling, indexed by their numeric value
// (connect-web's `Code` enum), so errors thrown by generated clients map
// without a dependency on the Connect runtime.
const CONNECT_CODES = [
  'ok',
  'canceled',
  'unknown',
  'invalid_argument',
  'deadline_exceeded',
  'not_found',
  'already_exists',
  'permission_denied',
  'resource_exhausted',
  'failed_precondition',
  'aborted',
  'out_of_range',
  'unimplemented',
  'internal',
  'unavailable',
  'data_loss',
  'unauthenticated',
] as const

const KIND_BY_CONNECT_CODE: Readonly<Record<string, SourceErrorKind>> = {
  unauthenticated: 'unauthenticated',
  permission_denied: 'forbidden',
  not_found: 'not_found',
  resource_exhausted: 'rate_limited',
  unavailable: 'unavailable',
  deadline_exceeded: 'unavailable',
  invalid_argument: 'invalid',
  failed_precondition: 'invalid',
  out_of_range: 'invalid',
  already_exists: 'invalid',
}

/** Kind for a Connect error code (`permission_denied` → `forbidden`). */
export function sourceErrorKindForCode(code: string): SourceErrorKind {
  return KIND_BY_CONNECT_CODE[code] ?? 'unknown'
}

/** Kind for an HTTP status (403 → `forbidden`, 503 → `unavailable`). */
export function sourceErrorKindForStatus(status: number): SourceErrorKind {
  if (status === 401) return 'unauthenticated'
  if (status === 403) return 'forbidden'
  if (status === 404 || status === 410) return 'not_found'
  if (status === 429) return 'rate_limited'
  if (status === 408 || status === 502 || status === 503 || status === 504) return 'unavailable'
  if (status === 400 || status === 409 || status === 412 || status === 422) return 'invalid'
  return 'unknown'
}

const REQUEST_ID_HEADERS = ['x-request-id', 'request-id', 'x-correlation-id']

/** The request id a response carries, if any. */
export function responseRequestId(headers: Headers): string | undefined {
  for (const name of REQUEST_ID_HEADERS) {
    const value = headers.get(name)?.trim()
    if (value) return value
  }
  return undefined
}

/**
 * `Retry-After` in milliseconds: delta-seconds or an HTTP date, measured
 * from `now`. Absent, malformed or past values give `undefined`.
 */
export function parseRetryAfter(value: string | null, now = Date.now()): number | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1000
  const at = Date.parse(trimmed)
  if (Number.isNaN(at) || at <= now) return undefined
  return at - now
}

// Error bodies are read to find the server's reason, never rendered raw,
// so a runaway body is cut off rather than buffered whole.
const MAX_ERROR_BODY_CHARS = 16 * 1024

interface ConnectErrorBody {
  code?: unknown
  message?: unknown
}

/**
 * Types a failed HTTP response. Reads the Connect JSON error body
 * (`{"code":"permission_denied","message":"…"}`) when there is one; the
 * body is consumed, so pass a clone if the caller still needs it.
 */
export async function sourceErrorFromResponse(
  response: Response,
  options: { requestId?: string; now?: number } = {},
): Promise<SourceError> {
  let code: string | undefined
  let reason: string | undefined
  const contentType = response.headers.get('content-type') ?? ''
  if (/\bjson\b/i.test(contentType)) {
    try {
      const text = (await response.text()).slice(0, MAX_ERROR_BODY_CHARS)
      const body = JSON.parse(text) as ConnectErrorBody
      if (typeof body?.code === 'string' && body.code) code = body.code
      if (typeof body?.message === 'string' && body.message.trim()) reason = body.message.trim()
    } catch {
      // A malformed or truncated body leaves the status to speak for itself.
    }
  }
  return new SourceError(reason ?? `HTTP ${response.status}`, {
    kind: code ? sourceErrorKindForCode(code) : sourceErrorKindForStatus(response.status),
    status: response.status,
    code,
    requestId: responseRequestId(response.headers) ?? options.requestId,
    retryAfterMs: parseRetryAfter(response.headers.get('retry-after'), options.now),
  })
}

interface ConnectLikeError {
  code?: unknown
  rawMessage?: unknown
  message?: unknown
  metadata?: unknown
}

/**
 * Types any thrown value: a `SourceError` passes through; an error from a
 * generated Connect client (numeric or string `code`, `rawMessage`,
 * `metadata` headers) keeps its code and request id; a timeout or network
 * failure is `unavailable`; anything else is `unknown`.
 */
export function toSourceError(value: unknown): SourceError {
  if (isSourceError(value)) return value
  const error = value as ConnectLikeError | null
  const code = typeof error?.code === 'number'
    ? CONNECT_CODES[error.code]
    : typeof error?.code === 'string' && (CONNECT_CODES as readonly string[]).includes(error.code)
      ? error.code
      : undefined
  const message = typeof error?.rawMessage === 'string' && error.rawMessage
    ? error.rawMessage
    : value instanceof Error
      ? value.message
      : String(value)
  if (code && code !== 'ok') {
    const metadata = error?.metadata instanceof Headers ? error.metadata : undefined
    return new SourceError(message, {
      kind: sourceErrorKindForCode(code),
      code,
      requestId: metadata ? responseRequestId(metadata) : undefined,
    })
  }
  if (value instanceof Error && (value.name === 'TimeoutError' || value.name === 'TypeError')) {
    return new SourceError(message, { kind: 'unavailable' })
  }
  return new SourceError(message, { kind: 'unknown' })
}

/**
 * One-line summary for logs and the legacy string `error` fields:
 * `permission_denied: bucket finance is private`, or `HTTP 503`.
 */
export function describeSourceError(error: SourceError): string {
  return error.code ? `${error.code}: ${error.message}` : error.message
}
