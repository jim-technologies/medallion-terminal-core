import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { SourceError } from '../core/sourceError'
import {
  createResourceCache,
  type ResourceCache,
  type ResourceLoader,
  type ResourceSnapshot,
} from './resourceCache'
import type { VisibilitySource } from './useSessionController'

/** A cache key: a string, or parts such as `['objects', bucket, path]`. */
export type ResourceKey = string | readonly (string | number | boolean | null | undefined)[]

/** Options for `useResource`. */
export interface UseResourceOptions {
  /** Data younger than this is fresh: no reload on mount or return (0). */
  staleTimeMs?: number
  /** Reloads on this interval while the page is visible; no timer while hidden. */
  refreshIntervalMs?: number
  /** Reloads stale data when the page becomes visible again (true). */
  revalidateOnVisible?: boolean
  /** Injectable page visibility, for tests. */
  document?: VisibilitySource
}

/** What `useResource` returns. */
export interface ResourceState<T> {
  data: T | undefined
  error: SourceError | undefined
  /** `idle` without a key; `success` whenever there is data (even stale). */
  status: 'idle' | 'loading' | 'success' | 'error'
  /** A load is in flight: the first one, or a background revalidation. */
  validating: boolean
  updatedAt: number | undefined
  /** Reloads now (joins a load already in flight). */
  refresh: () => Promise<void>
  /** Sets the data locally, such as after a successful mutation. */
  mutate: (next: T | ((current: T | undefined) => T)) => void
}

const ResourceCacheContext = createContext<ResourceCache | null>(null)
let defaultCache: ResourceCache | undefined

/** Scopes `useResource` to one cache (one per app; a fresh one per test). */
export function ResourceCacheProvider({ cache, children }: { cache: ResourceCache; children?: ReactNode }) {
  return <ResourceCacheContext.Provider value={cache}>{children}</ResourceCacheContext.Provider>
}

/** The cache in scope: the provider's, else one shared by the page. */
export function useResourceCache(): ResourceCache {
  return useContext(ResourceCacheContext) ?? (defaultCache ??= createResourceCache())
}

/** The string a key is cached under. */
export function resourceKey(key: ResourceKey): string {
  return typeof key === 'string' ? key : JSON.stringify(key)
}

/**
 * Reloads on an interval while the page is visible and when it becomes
 * visible again with stale data. One timer at most, none while hidden (a
 * product UI makes no requests from a hidden tab). Returns the cancel
 * function.
 */
export function revalidateWhileVisible({
  document: doc,
  intervalMs,
  onVisible = true,
  isStale,
  revalidate,
  setTimeout: set = (callback, delay) => globalThis.setTimeout(callback, delay),
  clearTimeout: clear = handle => globalThis.clearTimeout(handle as ReturnType<typeof globalThis.setTimeout>),
}: {
  document: VisibilitySource
  intervalMs?: number
  onVisible?: boolean
  isStale: () => boolean
  revalidate: () => void
  setTimeout?: (callback: () => void, delay: number) => unknown
  clearTimeout?: (handle: unknown) => void
}): () => void {
  let timer: unknown
  const stop = () => {
    if (timer !== undefined) clear(timer)
    timer = undefined
  }
  const tick = () => {
    stop()
    if (doc.hidden || !intervalMs || intervalMs <= 0) return
    timer = set(() => {
      timer = undefined
      revalidate()
      tick()
    }, intervalMs)
  }
  const onChange = () => {
    if (!doc.hidden && onVisible && isStale()) revalidate()
    tick()
  }
  tick()
  doc.addEventListener('visibilitychange', onChange)
  return () => {
    stop()
    doc.removeEventListener('visibilitychange', onChange)
  }
}

const IDLE: ResourceSnapshot = { validating: false }
const noop = () => () => {}

/**
 * A cached read for product UIs: every component that asks for a key shares
 * its data and one request, a read nobody waits for any more is aborted,
 * failures are typed `SourceError`s, cached data shows at once while it is
 * revalidated (stale-while-revalidate), and nothing refreshes while the page
 * is hidden. Pass `null` as the key to wait, for example until a parameter
 * is known.
 */
export function useResource<T>(
  key: ResourceKey | null,
  load: ResourceLoader<T>,
  { staleTimeMs = 0, refreshIntervalMs, revalidateOnVisible = true, document: injected }: UseResourceOptions = {},
): ResourceState<T> {
  const cache = useResourceCache()
  const id = key === null ? null : resourceKey(key)
  const loadRef = useRef(load)
  loadRef.current = load

  const subscribe = useCallback((listener: () => void) => (id === null ? noop() : cache.subscribe(id, listener)), [cache, id])
  const snapshot = useSyncExternalStore(
    subscribe,
    () => (id === null ? IDLE : cache.read<T>(id)),
    () => (id === null ? IDLE : cache.read<T>(id)),
  ) as ResourceSnapshot<T>

  const refresh = useCallback(
    () => (id === null ? Promise.resolve() : cache.fetch<T>(id, signal => loadRef.current(signal))),
    [cache, id],
  )
  const isStale = useCallback(() => {
    if (id === null) return false
    const { updatedAt } = cache.read(id)
    return updatedAt === undefined || Date.now() - updatedAt >= staleTimeMs
  }, [cache, id, staleTimeMs])

  // Load on mount and on a new key, unless the cached data is fresh.
  useEffect(() => {
    if (id !== null && isStale()) void refresh()
  }, [id, isStale, refresh])

  const doc = injected ?? (typeof document === 'undefined' ? undefined : document)
  useEffect(() => {
    if (id === null || !doc) return
    return revalidateWhileVisible({
      document: doc,
      intervalMs: refreshIntervalMs,
      onVisible: revalidateOnVisible,
      isStale,
      revalidate: () => void refresh(),
    })
  }, [id, doc, refreshIntervalMs, revalidateOnVisible, isStale, refresh])

  const mutate = useCallback((next: T | ((current: T | undefined) => T)) => {
    if (id !== null) cache.set<T>(id, next)
  }, [cache, id])

  const status = id === null
    ? 'idle'
    : snapshot.data !== undefined ? 'success' : snapshot.error ? 'error' : 'loading'
  return {
    data: snapshot.data,
    error: snapshot.error,
    status,
    validating: snapshot.validating,
    updatedAt: snapshot.updatedAt,
    refresh,
    mutate,
  }
}
