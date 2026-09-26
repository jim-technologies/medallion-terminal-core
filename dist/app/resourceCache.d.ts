/**
 * The cache behind `useResource`: product reads keyed by a string, shared by
 * every component that asks for the same key. Concurrent reads of a key make
 * one request; a read nobody waits for any more is aborted; failures are
 * typed `SourceError`s; data stays on screen while it is revalidated; and
 * unused entries are dropped oldest first. No React: `useResource` binds it.
 */
import { type SourceError } from '../core/sourceError';
/** What a component sees of one key. Replaced (never mutated) on change. */
export interface ResourceSnapshot<T = unknown> {
    data?: T;
    /** The last failure; cleared by the next success. */
    error?: SourceError;
    /** When `data` last arrived (or was set), in epoch milliseconds. */
    updatedAt?: number;
    /** A request for this key is in flight. */
    validating: boolean;
}
/** Loads a key's data; abort when `signal` fires. */
export type ResourceLoader<T> = (signal: AbortSignal) => Promise<T>;
/** A shared, bounded cache of product reads. */
export interface ResourceCache {
    read<T>(key: string): ResourceSnapshot<T>;
    /** Counts a reader; the returned function stops counting it. */
    subscribe(key: string, listener: () => void): () => void;
    /** Loads the key unless a load is already in flight (then joins it). */
    fetch<T>(key: string, load: ResourceLoader<T>): Promise<void>;
    /** Sets data locally, such as after a mutation; a load already in flight is ignored. */
    set<T>(key: string, next: T | ((current: T | undefined) => T)): void;
    /** Marks matching keys stale and reloads the ones on screen. */
    invalidate(match?: (key: string) => boolean): void;
}
/** Options for `createResourceCache`. */
export interface ResourceCacheOptions {
    /** Entries kept without a reader; the least recently used go first (100). */
    maxEntries?: number;
    now?: () => number;
}
/** A resource cache; products usually keep one per app (`ResourceCacheProvider`). */
export declare function createResourceCache({ maxEntries, now }?: ResourceCacheOptions): ResourceCache;
