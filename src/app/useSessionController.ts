import { useCallback, useEffect, useRef, useState } from 'react'
import type { SessionInfo, SessionPort } from './session'

/** Where the session stands. */
export type SessionStatus = 'loading' | 'authenticated' | 'signed-out' | 'expired'

/** Renew this long before the product token expires. */
export const RENEW_LEAD_MS = 60_000

/** Injectable clock and page visibility, for tests. */
export interface SessionEnvironment {
  now?: () => number
  document?: Pick<Document, 'hidden' | 'addEventListener' | 'removeEventListener'>
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
  useEffect(() => {
    if (!port || status !== 'authenticated' || !session?.expiresAt || !doc) return
    const expiresAt = session.expiresAt
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      clearTimeout(timer)
      if (doc.hidden) return
      const wait = expiresAt - RENEW_LEAD_MS - now()
      if (wait <= 0) void renew()
      else timer = setTimeout(() => void renew(), wait)
    }
    schedule()
    doc.addEventListener('visibilitychange', schedule)
    return () => {
      clearTimeout(timer)
      doc.removeEventListener('visibilitychange', schedule)
    }
  }, [port, status, session?.expiresAt, doc, now, renew])

  const reportUnauthenticated = useCallback(() => {
    void renew()
  }, [renew])

  return { status, session, renew, reportUnauthenticated }
}
