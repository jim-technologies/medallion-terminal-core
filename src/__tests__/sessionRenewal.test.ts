import { describe, expect, it } from 'vitest'
import { RENEW_LEAD_MS, scheduleRenewal, type VisibilitySource } from '../app/useSessionController'

// A deterministic clock with timers, and a page whose visibility the test
// flips: the scheduler gets both by injection, so no global is patched.
function harness(start = 1_000_000) {
  let time = start
  let nextId = 1
  const timers = new Map<number, { at: number; callback: () => void }>()
  const listeners = new Set<() => void>()
  const page = {
    hidden: false,
    addEventListener: (type: string, listener: () => void) => {
      if (type === 'visibilitychange') listeners.add(listener)
    },
    removeEventListener: (type: string, listener: () => void) => {
      if (type === 'visibilitychange') listeners.delete(listener)
    },
  }
  let renewals = 0
  return {
    renew: () => { renewals += 1 },
    get renewals() { return renewals },
    get pendingTimers() { return timers.size },
    get listeners() { return listeners.size },
    environment: {
      now: () => time,
      document: page as unknown as VisibilitySource,
      setTimeout: (callback: () => void, delay: number) => {
        const id = nextId++
        timers.set(id, { at: time + delay, callback })
        return id
      },
      clearTimeout: (id: unknown) => { timers.delete(id as number) },
    },
    /** Moves the clock, firing timers that come due in order. */
    advance(ms: number) {
      const until = time + ms
      for (;;) {
        const due = [...timers.entries()].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0]
        if (!due) break
        timers.delete(due[0])
        time = due[1].at
        due[1].callback()
      }
      time = until
    },
    setHidden(hidden: boolean) {
      page.hidden = hidden
      for (const listener of [...listeners]) listener()
    },
    get now() { return time },
  }
}

describe('scheduleRenewal', () => {
  it('renews one minute before the product token expires, not earlier', () => {
    const page = harness()
    const expiresAt = page.now + 5 * 60_000
    scheduleRenewal(expiresAt, page.renew, page.environment)
    expect(page.pendingTimers).toBe(1)
    page.advance(expiresAt - RENEW_LEAD_MS - page.now - 1)
    expect(page.renewals).toBe(0)
    page.advance(1)
    expect(page.renewals).toBe(1)
    expect(RENEW_LEAD_MS).toBe(60_000)
  })

  it('renews at once when the token is already inside the last minute', () => {
    const page = harness()
    scheduleRenewal(page.now + 30_000, page.renew, page.environment)
    expect(page.renewals).toBe(1)
    expect(page.pendingTimers).toBe(0)
  })

  it('runs no timer while the page is hidden and renews on return when due', () => {
    const page = harness()
    const expiresAt = page.now + 5 * 60_000
    page.setHidden(true)
    scheduleRenewal(expiresAt, page.renew, page.environment)
    expect(page.pendingTimers).toBe(0)
    // Hidden past the renewal time: still nothing runs.
    page.advance(10 * 60_000)
    expect(page.renewals).toBe(0)
    expect(page.pendingTimers).toBe(0)
    page.setHidden(false)
    expect(page.renewals).toBe(1)
  })

  it('drops its timer when the page hides and sets it afresh when it shows', () => {
    const page = harness()
    const expiresAt = page.now + 5 * 60_000
    scheduleRenewal(expiresAt, page.renew, page.environment)
    expect(page.pendingTimers).toBe(1)
    page.setHidden(true)
    expect(page.pendingTimers).toBe(0)
    page.advance(60_000)
    page.setHidden(false)
    expect(page.pendingTimers).toBe(1)
    expect(page.renewals).toBe(0)
    page.advance(expiresAt - RENEW_LEAD_MS - page.now)
    expect(page.renewals).toBe(1)
  })

  it('waits out a far expiry in steps instead of firing an overflowed timer at once', () => {
    const page = harness()
    const expiresAt = page.now + 40 * 86_400_000
    scheduleRenewal(expiresAt, page.renew, page.environment)
    page.advance(25 * 86_400_000)
    expect(page.renewals).toBe(0)
    expect(page.pendingTimers).toBe(1)
    page.advance(expiresAt - RENEW_LEAD_MS - page.now)
    expect(page.renewals).toBe(1)
  })

  it('cancels its timer and its visibility listener', () => {
    const page = harness()
    const cancel = scheduleRenewal(page.now + 5 * 60_000, page.renew, page.environment)
    expect(page.listeners).toBe(1)
    cancel()
    expect(page.pendingTimers).toBe(0)
    expect(page.listeners).toBe(0)
    page.advance(10 * 60_000)
    expect(page.renewals).toBe(0)
  })
})
