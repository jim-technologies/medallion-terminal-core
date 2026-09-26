/**
 * The cache behind `useResource`: product reads keyed by a string, shared by
 * every component that asks for the same key. Concurrent reads of a key make
 * one request; a read nobody waits for any more is aborted; failures are
 * typed `SourceError`s; data stays on screen while it is revalidated; and
 * unused entries are dropped oldest first. No React: `useResource` binds it.
 */
import { toSourceError, type SourceError } from '../core/sourceError'

/** What a component sees of one key. Replaced (never mutated) on change. */
export interface ResourceSnapshot<T = unknown> {
  data?: T
  /** The last failure; cleared by the next success. */
  error?: SourceError
  /** When `data` last arrived (or was set), in epoch milliseconds. */
  updatedAt?: number
  /** A request for this key is in flight. */
  validating: boolean
}

/** Loads a key's data; abort when `signal` fires. */
export type ResourceLoader<T> = (signal: AbortSignal) => Promise<T>

/** A shared, bounded cache of product reads. */
export interface ResourceCache {
  read<T>(key: string): ResourceSnapshot<T>
  /** Counts a reader; the returned function stops counting it. */
  subscribe(key: string, listener: () => void): () => void
  /** Loads the key unless a load is already in flight (then joins it). */
  fetch<T>(key: string, load: ResourceLoader<T>): Promise<void>
  /** Sets data locally, such as after a mutation; a load already in flight is ignored. */
  set<T>(key: string, next: T | ((current: T | undefined) => T)): void
  /** Marks matching keys stale and reloads the ones on screen. */
  invalidate(match?: (key: string) => boolean): void
}

/** Options for `createResourceCache`. */
export interface ResourceCacheOptions {
  /** Entries kept without a reader; the least recently used go first (100). */
  maxEntries?: number
  now?: () => number
}

interface Entry {
  snapshot: ResourceSnapshot
  listeners: Set<() => void>
  load?: ResourceLoader<unknown>
  inflight?: { promise: Promise<void>; controller: AbortController }
  /** Counts local `set`s, to ignore responses to requests started before one. */
  version: number
}

const IDLE: ResourceSnapshot = Object.freeze({ validating: false })

/** A resource cache; products usually keep one per app (`ResourceCacheProvider`). */
export function createResourceCache({ maxEntries = 100, now = Date.now }: ResourceCacheOptions = {}): ResourceCache {
  const entries = new Map<string, Entry>()

  const entry = (key: string): Entry => {
    let found = entries.get(key)
    if (found) {
      // Most recently used last, so eviction takes the oldest first.
      entries.delete(key)
    } else {
      found = { snapshot: IDLE, listeners: new Set(), version: 0 }
    }
    entries.set(key, found)
    return found
  }
  const update = (current: Entry, patch: Partial<ResourceSnapshot>) => {
    current.snapshot = { ...current.snapshot, ...patch }
    for (const listener of [...current.listeners]) listener()
  }
  const evict = () => {
    let idle = [...entries.values()].filter(item => item.listeners.size === 0 && !item.inflight).length
    for (const [key, item] of entries) {
      if (idle <= maxEntries) break
      if (item.listeners.size > 0 || item.inflight) continue
      entries.delete(key)
      idle -= 1
    }
  }

  const fetch = <T>(key: string, load: ResourceLoader<T>): Promise<void> => {
    const current = entry(key)
    current.load = load as ResourceLoader<unknown>
    if (current.inflight && !current.inflight.controller.signal.aborted) return current.inflight.promise
    const controller = new AbortController()
    const version = current.version
    const promise = (async () => {
      try {
        const data = await load(controller.signal)
        if (controller.signal.aborted || current.version !== version) return
        update(current, { data, error: undefined, updatedAt: now() })
      } catch (error) {
        if (!controller.signal.aborted) update(current, { error: toSourceError(error) })
      } finally {
        if (current.inflight?.controller === controller) current.inflight = undefined
        update(current, { validating: false })
        evict()
      }
    })()
    current.inflight = { promise, controller }
    update(current, { validating: true })
    return promise
  }

  return {
    read: <T>(key: string) => (entries.get(key)?.snapshot ?? IDLE) as ResourceSnapshot<T>,
    subscribe(key, listener) {
      const current = entry(key)
      current.listeners.add(listener)
      return () => {
        current.listeners.delete(listener)
        // Abort a load nobody reads any more, unless a reader comes straight
        // back (a remount, or a key switched away and back).
        queueMicrotask(() => {
          if (current.listeners.size === 0) current.inflight?.controller.abort()
          evict()
        })
      }
    },
    fetch,
    set(key, next) {
      const current = entry(key)
      const data = typeof next === 'function'
        ? (next as (value: unknown) => unknown)(current.snapshot.data)
        : next
      current.version += 1
      update(current, { data, error: undefined, updatedAt: now() })
    },
    invalidate(match = () => true) {
      // A snapshot: reloading a key moves it to the end of the map.
      for (const [key, current] of [...entries]) {
        if (!match(key)) continue
        update(current, { updatedAt: undefined })
        if (current.listeners.size > 0 && current.load) void fetch(key, current.load)
      }
    },
  }
}
