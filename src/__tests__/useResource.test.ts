import { describe, expect, it, vi } from 'vitest'
import { createResourceCache } from '../app/resourceCache'
import { resourceKey, revalidateWhileVisible } from '../app/useResource'
import type { VisibilitySource } from '../app/useSessionController'
import { SourceError } from '../core/sourceError'

/** A promise the test settles by hand, recording the signal it was given. */
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

describe('resource cache', () => {
  it('makes one request for concurrent reads of a key and shares the result', async () => {
    const cache = createResourceCache()
    const pending = deferred<string[]>()
    const load = vi.fn(() => pending.promise)
    const seen: boolean[] = []
    cache.subscribe('buckets', () => seen.push(cache.read('buckets').validating))
    const first = cache.fetch('buckets', load)
    const second = cache.fetch('buckets', load)
    expect(load).toHaveBeenCalledTimes(1)
    expect(cache.read('buckets').validating).toBe(true)
    pending.resolve(['finance', 'media'])
    await Promise.all([first, second])
    expect(cache.read('buckets')).toMatchObject({ data: ['finance', 'media'], validating: false })
    expect(seen[seen.length - 1]).toBe(false)
  })

  it('keeps data on screen while it revalidates, and types failures as SourceError', async () => {
    const cache = createResourceCache()
    await cache.fetch('bucket:finance', async () => ({ objects: 12 }))
    const reload = deferred<{ objects: number }>()
    const revalidating = cache.fetch('bucket:finance', () => reload.promise)
    expect(cache.read('bucket:finance')).toMatchObject({ data: { objects: 12 }, validating: true })
    reload.reject(new SourceError('payroll:read scope required', { kind: 'forbidden', status: 403 }))
    await revalidating
    const after = cache.read<{ objects: number }>('bucket:finance')
    expect(after.data).toEqual({ objects: 12 })
    expect(after.error).toBeInstanceOf(SourceError)
    expect(after.error).toMatchObject({ kind: 'forbidden', status: 403 })
    // Anything else thrown is still a SourceError.
    await cache.fetch('broken', async () => { throw new TypeError('Failed to fetch') })
    expect(cache.read('broken').error).toBeInstanceOf(SourceError)
  })

  it('aborts a load once nobody reads the key, and starts afresh for a new reader', async () => {
    const cache = createResourceCache()
    const signals: AbortSignal[] = []
    const load = (signal: AbortSignal) => {
      signals.push(signal)
      return new Promise<string>((_, reject) => signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))))
    }
    const stop = cache.subscribe('objects', () => {})
    void cache.fetch('objects', load)
    stop()
    await flush()
    expect(signals[0]!.aborted).toBe(true)
    expect(cache.read('objects').error).toBeUndefined()
    // A remount in the same tick keeps the load.
    const again = cache.subscribe('objects', () => {})
    void cache.fetch('objects', load)
    again()
    cache.subscribe('objects', () => {})
    await flush()
    expect(signals).toHaveLength(2)
    expect(signals[1]!.aborted).toBe(false)
  })

  it('ignores a response to a load started before a local set', async () => {
    const cache = createResourceCache()
    const pending = deferred<number>()
    const loading = cache.fetch('count', () => pending.promise)
    cache.set<number>('count', 5)
    cache.set<number>('count', current => (current ?? 0) + 1)
    pending.resolve(1)
    await loading
    expect(cache.read('count').data).toBe(6)
  })

  it('reloads the invalidated keys that are on screen and marks the rest stale', async () => {
    const cache = createResourceCache()
    const shown = vi.fn(async () => 'shown')
    const hidden = vi.fn(async () => 'hidden')
    cache.subscribe('a', () => {})
    await cache.fetch('a', shown)
    await cache.fetch('b', hidden)
    cache.invalidate()
    await flush()
    expect(shown).toHaveBeenCalledTimes(2)
    expect(hidden).toHaveBeenCalledTimes(1)
    expect(cache.read('b').updatedAt).toBeUndefined()
    expect(cache.read('b').data).toBe('hidden')
  })

  it('drops unread entries oldest first beyond its bound', async () => {
    const cache = createResourceCache({ maxEntries: 2 })
    const kept = cache.subscribe('kept', () => {})
    await cache.fetch('kept', async () => 0)
    for (const key of ['one', 'two', 'three']) await cache.fetch(key, async () => key)
    expect(cache.read('one').data).toBeUndefined()
    expect(cache.read('two').data).toBe('two')
    expect(cache.read('three').data).toBe('three')
    expect(cache.read('kept').data).toBe(0)
    kept()
  })

  it('serialises array keys stably', () => {
    expect(resourceKey(['objects', 'finance', 'q3/'])).toBe('["objects","finance","q3/"]')
    expect(resourceKey('buckets')).toBe('buckets')
  })
})

describe('revalidateWhileVisible', () => {
  function page() {
    const listeners = new Set<() => void>()
    const timers = new Map<number, () => void>()
    let id = 0
    const doc = {
      hidden: false,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }
    return {
      doc: doc as unknown as VisibilitySource,
      timers,
      set: (callback: () => void) => { timers.set(++id, callback); return id },
      clear: (handle: unknown) => { timers.delete(handle as number) },
      fire() { for (const [key, callback] of [...timers]) { timers.delete(key); callback() } },
      setHidden(hidden: boolean) { doc.hidden = hidden; for (const listener of [...listeners]) listener() },
      get listeners() { return listeners.size },
    }
  }

  it('polls on its interval while visible and runs no timer while hidden', () => {
    const tab = page()
    const revalidate = vi.fn()
    const stop = revalidateWhileVisible({ document: tab.doc, intervalMs: 30_000, isStale: () => false, revalidate, setTimeout: tab.set, clearTimeout: tab.clear })
    expect(tab.timers.size).toBe(1)
    tab.fire()
    expect(revalidate).toHaveBeenCalledTimes(1)
    expect(tab.timers.size).toBe(1)
    tab.setHidden(true)
    expect(tab.timers.size).toBe(0)
    tab.fire()
    expect(revalidate).toHaveBeenCalledTimes(1)
    tab.setHidden(false)
    expect(tab.timers.size).toBe(1)
    stop()
    expect(tab.timers.size).toBe(0)
    expect(tab.listeners).toBe(0)
  })

  it('reloads stale data when the page comes back, and fresh data not at all', () => {
    const tab = page()
    let stale = false
    const revalidate = vi.fn()
    revalidateWhileVisible({ document: tab.doc, isStale: () => stale, revalidate, setTimeout: tab.set, clearTimeout: tab.clear })
    expect(tab.timers.size).toBe(0)
    tab.setHidden(true)
    tab.setHidden(false)
    expect(revalidate).not.toHaveBeenCalled()
    stale = true
    tab.setHidden(true)
    expect(revalidate).not.toHaveBeenCalled()
    tab.setHidden(false)
    expect(revalidate).toHaveBeenCalledTimes(1)
  })
})
