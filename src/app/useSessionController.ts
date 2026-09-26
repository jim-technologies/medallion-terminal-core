import { useCallback, useEffect, useRef, useState } from 'react'
import type { SessionInfo, SessionPort } from './session'

/** Where the session stands. */
export type SessionStatus = 'loading' | 'authenticated' | 'signed-out' | 'expired'

/** Renew this long before the product token expires. */
export const RENEW_LEAD_MS = 60_000

// setTimeout fires at once for delays past 2^31 - 1 ms (about 24.8 days);
// longer waits are taken in steps.
const MAX_TIMER_MS = 2_147_483_647

/** The page visibility the scheduler reads. */
export type VisibilitySource = Pick<Document, 'hidden' | 'addEventListener' | 'removeEventListener'>

/** Injectable clock, timers and page visibility, for tests. */
export interface SessionEnvironment {
  now?: () => number
  document?: VisibilitySource
  setTimeout?: (callback: () => void, delay: number) => unknown
  clearTimeout?: (handle: unknown) => void
}

/**
 * Schedules one renewal a minute before `expiresAt`, with at most one timer
 * and none while the page is hidden (a product UI scales to zero: a hidden
 * tab makes no requests). When the page becomes visible again the timer is
 * set afresh, and a page that comes back at or past the renewal time renews
 * at once. Returns the cancel function.
 */
export function scheduleRenewal(
  expiresAt: number,
  renew: () => void,
  {
    now = Date.now,
    document: doc,
    setTimeout: set = (callback, delay) => globalThis.setTimeout(callback, delay),
    clearTimeout: clear = handle => globalThis.clearTimeout(handle as ReturnType<typeof globalThis.setTimeout>),
  }: SessionEnvironment & { document: VisibilitySource },
): () => void {
  let timer: unknown
  const cancel = () => {
    if (timer !== undefined) clear(timer)
    timer = undefined
  }
  const schedule = () => {
    cancel()
    if (doc.hidden) return
    const wait = expiresAt - RENEW_LEAD_MS - now()
    if (wait <= 0) {
      renew()
      return
    }
    timer = set(() => {
      timer = undefined
      if (wait > MAX_TIMER_MS) schedule()
      else renew()
    }, Math.min(wait, MAX_TIMER_MS))
  }
  schedule()
  doc.addEventListener('visibilitychange', schedule)
  return () => {
    cancel()
    doc.removeEventListener('visibilitychange', schedule)
  }
}

/** What the shell's session controller exposes. */
export interface SessionController {
  status: SessionStatus
  session: SessionInfo | null
  /** Renews now; resolves true when the session is good again. */
  renew: () => Promise<boolean>
  /** Call on any 401 (wire to `createProductFetch({ onUnauthenticated })`). */
  reportUnauthenticated: () => void
}

/**
 * Loads the session, renews it a minute before it expires and after any
 * 401, and never polls: no timer runs while the page is hidden, and a page
 * that comes back near or past expiry renews at once. A failed renewal
 * moves to `expired`, which the shell shows over the page (drafts kept).
 */
export function useSessionController(port: SessionPort | undefined, environment: SessionEnvironment = {}): SessionController {
  const now = environment.now ?? Date.now
  const doc = environment.document ?? (typeof document === 'undefined' ? undefined : document)
  const [status, setStatus] = useState<SessionStatus>(port ? 'loading' : 'authenticated')
  const [session, setSession] = useState<SessionInfo | null>(null)
  const inflight = useRef<Promise<boolean> | null>(null)

  const renew = useCallback(() => {
    if (!port) return Promise.resolve(true)
    if (inflight.current) return inflight.current
    const attempt = port.renew().then(
      next => {
        setSession(next)
        setStatus('authenticated')
        return true
      },
      () => {
        setStatus('expired')
        return false
      },
    ).finally(() => {
      inflight.current = null
    })
    inflight.current = attempt
    return attempt
  }, [port])

  useEffect(() => {
    if (!port) return
    const controller = new AbortController()
    port.load(controller.signal).then(
      next => {
        if (controller.signal.aborted) return
        setSession(next)
        setStatus(next.authenticated ? 'authenticated' : 'signed-out')
      },
      () => {
        if (!controller.signal.aborted) setStatus('signed-out')
      },
    )
    return () => controller.abort()
  }, [port])

  // One timer for the next renewal, only while the page is visible.
  const { setTimeout: set, clearTimeout: clear } = environment
  useEffect(() => {
    if (!port || status !== 'authenticated' || !session?.expiresAt || !doc) return
    return scheduleRenewal(session.expiresAt, () => void renew(), { now, document: doc, setTimeout: set, clearTimeout: clear })
  }, [port, status, session?.expiresAt, doc, now, renew, set, clear])

  const reportUnauthenticated = useCallback(() => {
    void renew()
  }, [renew])

  return { status, session, renew, reportUnauthenticated }
}
