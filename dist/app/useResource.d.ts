import { type ReactNode } from 'react';
import type { SourceError } from '../core/sourceError';
import { type ResourceCache, type ResourceLoader } from './resourceCache';
import type { VisibilitySource } from './useSessionController';
/** A cache key: a string, or parts such as `['objects', bucket, path]`. */
export type ResourceKey = string | readonly (string | number | boolean | null | undefined)[];
/** Options for `useResource`. */
export interface UseResourceOptions {
    /** Data younger than this is fresh: no reload on mount or return (0). */
    staleTimeMs?: number;
    /** Reloads on this interval while the page is visible; no timer while hidden. */
    refreshIntervalMs?: number;
    /** Reloads stale data when the page becomes visible again (true). */
    revalidateOnVisible?: boolean;
    /** Injectable page visibility, for tests. */
    document?: VisibilitySource;
}
/** What `useResource` returns. */
export interface ResourceState<T> {
    data: T | undefined;
    error: SourceError | undefined;
    /** `idle` without a key; `success` whenever there is data (even stale). */
    status: 'idle' | 'loading' | 'success' | 'error';
    /** A load is in flight: the first one, or a background revalidation. */
    validating: boolean;
    updatedAt: number | undefined;
    /** Reloads now (joins a load already in flight). */
    refresh: () => Promise<void>;
    /** Sets the data locally, such as after a successful mutation. */
    mutate: (next: T | ((current: T | undefined) => T)) => void;
}
/** Scopes `useResource` to one cache (one per app; a fresh one per test). */
export declare function ResourceCacheProvider({ cache, children }: {
    cache: ResourceCache;
    children?: ReactNode;
}): import("react").JSX.Element;
/** The cache in scope: the provider's, else one shared by the page. */
export declare function useResourceCache(): ResourceCache;
/** The string a key is cached under. */
export declare function resourceKey(key: ResourceKey): string;
/**
 * Reloads on an interval while the page is visible and when it becomes
 * visible again with stale data. One timer at most, none while hidden (a
 * product UI makes no requests from a hidden tab). Returns the cancel
 * function.
 */
export declare function revalidateWhileVisible({ document: doc, intervalMs, onVisible, isStale, revalidate, setTimeout: set, clearTimeout: clear, }: {
    document: VisibilitySource;
    intervalMs?: number;
    onVisible?: boolean;
    isStale: () => boolean;
    revalidate: () => void;
    setTimeout?: (callback: () => void, delay: number) => unknown;
    clearTimeout?: (handle: unknown) => void;
}): () => void;
/**
 * A cached read for product UIs: every component that asks for a key shares
 * its data and one request, a read nobody waits for any more is aborted,
 * failures are typed `SourceError`s, cached data shows at once while it is
 * revalidated (stale-while-revalidate), and nothing refreshes while the page
 * is hidden. Pass `null` as the key to wait, for example until a parameter
 * is known.
 */
export declare function useResource<T>(key: ResourceKey | null, load: ResourceLoader<T>, { staleTimeMs, refreshIntervalMs, revalidateOnVisible, document: injected }?: UseResourceOptions): ResourceState<T>;
