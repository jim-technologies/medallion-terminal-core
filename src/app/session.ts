/**
 * The session port of a product UI. A product's browser session is a short
 * product token in an HttpOnly cookie (at most five minutes); the shell
 * renews it before it expires and after any 401, without a new long-lived
 * credential: a hidden frame follows the Terminal's launch URL, whose IAM
 * handoff sets a fresh cookie and reports back.
 */

/** What `/auth/session` reports. */
export interface SessionInfo {
  authenticated: boolean
  /** The signed-in principal. */
  subject?: string
  /** A display name for the account menu. */
  displayName?: string
  workspaceId?: string
  /** When the product token expires, in epoch milliseconds. */
  expiresAt?: number
  /** Where to sign in (from runtime config, never a constant). */
  signInUrl?: string
}

/** The session port a product implements (or builds with the helpers below). */
export interface SessionPort {
  /** Reads the current session. */
  load(signal?: AbortSignal): Promise<SessionInfo>
  /** Renews silently and returns the renewed session; rejects when it cannot. */
  renew(): Promise<SessionInfo>
  /** Leaves for sign-in, returning to `returnTo` (an app path) afterwards. */
  signIn(returnTo: string, session?: SessionInfo): void
  /** Ends the session. */
  signOut?(): Promise<void> | void
}

function parseExpiry(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value < 1e12 ? value * 1000 : value
  if (typeof value === 'string' && value !== '') {
    const time = Date.parse(value)
    return Number.isNaN(time) ? undefined : time
  }
  return undefined
}

/** Reads a `/auth/session` JSON body (snake or camel case) into `SessionInfo`. */
export function parseSessionBody(body: unknown): SessionInfo {
  const value = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const text = (key: string, alternate: string) => {
    const found = value[key] ?? value[alternate]
    return typeof found === 'string' && found !== '' ? found : undefined
  }
  return {
    authenticated: value.authenticated === true,
    subject: text('subject', 'sub'),
    displayName: text('displayName', 'display_name'),
    workspaceId: text('workspaceId', 'workspace_id'),
    expiresAt: parseExpiry(value.expiresAt ?? value.expires_at),
    signInUrl: text('signInUrl', 'sign_in_url'),
  }
}

/** Options for `createHttpSessionPort`. */
export interface HttpSessionPortOptions {
  /** The product's session endpoint. */
  sessionUrl?: string
  /** Transport; a `createProductFetch` in products. */
  fetch?: typeof globalThis.fetch
  /** Performs the renewal (for example `renewViaFrame`); `load` follows it. */
  renew: () => Promise<void>
  /** Builds the sign-in destination; defaults to `signInUrl?return_to=`. */
  signInHref?: (returnTo: string, session?: SessionInfo) => string | undefined
  /** Leaves the page; `location.assign` by default. */
  assign?: (url: string) => void
  /** Ends the session, such as a POST to `/auth/sign-out`. */
  signOut?: () => Promise<void>
}

/** A `SessionPort` over a product's `/auth/session` endpoint. */
export function createHttpSessionPort({
  sessionUrl = '/auth/session',
  fetch: transport,
  renew,
  signInHref,
  assign = url => globalThis.location.assign(url),
  signOut,
}: HttpSessionPortOptions): SessionPort {
  const load = async (signal?: AbortSignal) => {
    const response = await (transport ?? globalThis.fetch)(sessionUrl, {
      credentials: 'same-origin',
      headers: { accept: 'application/json' },
      signal,
    })
    if (response.status === 401) return { authenticated: false }
    if (!response.ok) throw new Error(`Session check failed: HTTP ${response.status}`)
    return parseSessionBody(await response.json())
  }
  return {
    load,
    async renew() {
      await renew()
      const session = await load()
      if (!session.authenticated) throw new Error('Session renewal did not sign in')
      return session
    },
    signIn(returnTo, session) {
      const href = signInHref
        ? signInHref(returnTo, session)
        : session?.signInUrl && `${session.signInUrl}${session.signInUrl.includes('?') ? '&' : '?'}return_to=${encodeURIComponent(returnTo)}`
      if (href) assign(href)
    },
    signOut,
  }
}

/** Messages the renewal callback page posts to its parent frame. */
export const SESSION_RENEWED = 'mtc:session-renewed'
export const SESSION_RENEW_FAILED = 'mtc:session-renew-failed'

/** Options for `renewViaFrame`. */
export interface FrameRenewalOptions {
  /** The Terminal launch URL in renew mode (it redirects through IAM). */
  url: string
  /** The product's own origin, which the callback page posts from. */
  origin?: string
  /** Gives up after this long. */
  timeoutMs?: number
  /** Injectable for tests. */
  window?: Window
}

/**
 * Renews the product cookie in a hidden same-site frame: the frame follows
 * the Terminal's launch URL, the product's callback sets the fresh cookie
 * and its `/auth/renewed` page posts `mtc:session-renewed` to this window.
 * Nothing navigates the visible page, so uploads and drafts survive.
 */
export function renewViaFrame({
  url,
  origin,
  timeoutMs = 15_000,
  window: win = globalThis.window,
}: FrameRenewalOptions): Promise<void> {
  const expected = origin ?? win.location.origin
  return new Promise((resolve, reject) => {
    const frame = win.document.createElement('iframe')
    frame.hidden = true
    frame.title = 'Session renewal'
    frame.setAttribute('aria-hidden', 'true')
    const finish = (error?: Error) => {
      win.removeEventListener('message', onMessage)
      clearTimeout(timer)
      frame.remove()
      if (error) reject(error)
      else resolve()
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== expected || event.source !== frame.contentWindow) return
      const type = (event.data as { type?: unknown } | null)?.type
      if (type === SESSION_RENEWED) finish()
      else if (type === SESSION_RENEW_FAILED) finish(new Error('Session renewal was refused'))
    }
    const timer = setTimeout(() => finish(new Error('Session renewal timed out')), timeoutMs)
    win.addEventListener('message', onMessage)
    frame.src = url
    win.document.body.appendChild(frame)
  })
}
