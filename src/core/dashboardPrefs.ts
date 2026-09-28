// Dashboard preferences — the refresh interval, density and sound knobs a
// person sets for themselves. They persist per browser in localStorage under
// `medallion-terminal:`; ctx lives in the URL instead because it is shared.
//
// A store remembers the serialized value it last read or wrote for each key
// and skips a write that would store that same value again, so applying the
// stored preferences after hydration writes nothing, and neither does a
// first visit that keeps the defaults. Every storage access is guarded: a
// missing or denying storage reads the fallback and writes nothing.

const PREFIX = 'medallion-terminal:'

export interface PrefStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface PrefStore {
  read<T>(key: string, fallback: T): T
  write(key: string, value: unknown): void
}

export function createPrefStore(storage: PrefStorage | undefined): PrefStore {
  const stored = new Map<string, string>()
  return {
    read<T>(key: string, fallback: T): T {
      if (!storage) return fallback
      try {
        const raw = storage.getItem(PREFIX + key)
        const value = raw == null ? fallback : (JSON.parse(raw) as T)
        stored.set(key, JSON.stringify(value))
        return value
      } catch {
        // Unreadable or denied: the fallback stands, and the next write
        // replaces whatever is there.
        return fallback
      }
    },
    write(key: string, value: unknown): void {
      if (!storage) return
      const serialized = JSON.stringify(value)
      if (stored.get(key) === serialized) return
      try {
        storage.setItem(PREFIX + key, serialized)
        stored.set(key, serialized)
      } catch {
        // Quota or denied — leave silent. Defaults are fine.
      }
    },
  }
}

// The browser's localStorage, or undefined where there is none (server
// render) or where reading the property itself throws (storage blocked).
export function browserPrefStorage(): PrefStorage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}
