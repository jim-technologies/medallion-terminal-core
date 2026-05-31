import type { DataSource, WidgetConfig } from '../types/template'

const TERMINAL_SERVICE = 'medallion.terminal.v1.TerminalService'

export function buildGenerateUrl(backendUrl: string): string {
  return `${backendUrl.replace(/\/$/, '')}/${TERMINAL_SERVICE}/Generate`
}

// Build the body of a Generate request. Mirrors the proto's
// GenerateRequest message — JSON keys match the proto's snake_case.
export function buildGenerateRequest(
  prompt: string,
  ctx: Record<string, string>,
  currentWidgets: WidgetConfig[],
): { prompt: string; context: { values: Record<string, string> }; current_widgets: WidgetConfig[] } {
  return {
    prompt,
    context: { values: ctx },
    current_widgets: currentWidgets,
  }
}

export function buildSubmitActionUrl(backendUrl: string): string {
  return `${backendUrl.replace(/\/$/, '')}/${TERMINAL_SERVICE}/SubmitAction`
}

export function buildWatchActionUrl(backendUrl: string): string {
  return `${backendUrl.replace(/\/$/, '')}/${TERMINAL_SERVICE}/WatchAction`
}

// Build the body of a SubmitAction request. Mirrors the proto's
// ActionRequest message: a routing id, a free-form params struct,
// and a client-generated idempotency key. The backend MUST treat
// repeated requests with the same client_request_id as the same
// action (returning the original ActionResponse), so retry loops
// and double-clicks don't double-submit.
export function buildActionRequest(opts: {
  actionId: string
  params: Record<string, unknown>
  clientRequestId: string
}): { action_id: string; params: Record<string, unknown>; client_request_id: string } {
  return { action_id: opts.actionId, params: opts.params, client_request_id: opts.clientRequestId }
}

// Build the body of a WatchAction request. Identify the action by
// any of the three keys; client_request_id is the most useful for
// retry reconciliation since the client knows it before the backend
// responds. At least one identifier must be set.
export function buildActionWatchRequest(opts: {
  clientRequestId?: string
  id?: string
  actionId?: string
}): { action_id: string; id: string; client_request_id: string } {
  return {
    action_id: opts.actionId ?? '',
    id: opts.id ?? '',
    client_request_id: opts.clientRequestId ?? '',
  }
}

// Generate an idempotency key for ActionRequest.client_request_id.
// Uses crypto.randomUUID where available, falls back to a
// timestamp+random hybrid for older runtimes / non-secure contexts.
export function newClientRequestId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }
  return `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`
}

let warnedNoBackend = false

export class InterpolationError extends Error {
  constructor(public readonly key: string) {
    super(`Missing context key: \${ctx.${key}}`)
    this.name = 'InterpolationError'
  }
}

// Substitute "${ctx.<key>}" tokens in a string.
//
// Default (lenient): missing keys → empty string. Used for human-facing
// strings like widget titles where partial substitution is OK.
//
// Strict: missing keys throw InterpolationError. Used for source URLs
// and params where a missing token would silently produce a malformed
// request. resolveSource calls this in strict mode; WidgetShell catches.
export function interpolate(
  s: string,
  ctx: Record<string, string>,
  opts?: { strict?: boolean },
): string {
  return s.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (_, k) => {
    if (k in ctx) return ctx[k]
    if (opts?.strict) throw new InterpolationError(k)
    return ''
  })
}

// Translate a DataSource into something useDataSource can fetch.
//
// Handles:
//   - source_id  → POST <backendUrl>/<service>/<Get|Stream> + Connect framing for streams
//   - url        → existing URL with ${ctx.x} substitution and params merged into the query
//
// Inline (`source.data`) and unrecognized configs pass through unchanged.
export function resolveSource(
  source: DataSource,
  ctx: Record<string, string>,
  backendUrl?: string,
): DataSource {
  // Mode 1: source_id — translate to a Connect HTTP/JSON call
  if (source.source_id) {
    // undefined = no backend configured (bail). Empty string = SAME ORIGIN
    // (valid — the app is served from the same host as the API), so it must
    // NOT be treated as missing. Only `undefined` short-circuits.
    if (backendUrl === undefined) {
      if (!warnedNoBackend) {
        console.warn(
          `[medallion] source_id "${source.source_id}" requires a backendUrl on <Dashboard>; ` +
            'widget will not load until one is set.',
        )
        warnedNoBackend = true
      }
      return source
    }
    const method = source.stream ? 'Stream' : 'Get'
    const base = backendUrl.replace(/\/$/, '')
    const params: Record<string, string> = {}
    if (source.params) {
      for (const [k, v] of Object.entries(source.params)) {
        // Strict — a missing ctx key in a request param is a bug, not
        // empty-string substitution that silently sends a bad request.
        params[k] = interpolate(v, ctx, { strict: true })
      }
    }
    return {
      url: `${base}/${TERMINAL_SERVICE}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { source_id: source.source_id, params },
      stream: source.stream ? 'connect' : false,
      refreshIntervalMs: source.refreshIntervalMs ?? source.refreshInterval,
    }
  }

  // Mode 2: url — substitute tokens, merge params into query string
  if (!source.url && !source.params) return source
  const out: DataSource = { ...source }
  if (source.url) {
    let url = interpolate(source.url, ctx, { strict: true })
    if (source.params && Object.keys(source.params).length > 0) {
      const qs = Object.entries(source.params)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(interpolate(v, ctx, { strict: true }))}`)
        .join('&')
      url = url.includes('?') ? `${url}&${qs}` : `${url}?${qs}`
    }
    out.url = url
  }
  return out
}

// Test-only: reset the no-backend warning latch so tests can re-trigger it.
export function _resetWarnings() {
  warnedNoBackend = false
}
