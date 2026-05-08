// Saved views — named snapshots of the current ctx, recallable via
// Cmd+K. Stored in localStorage so they survive reloads but stay
// per-browser. Intentionally **not** stored in the URL: the URL
// already carries one ctx state (the live one); saved views are a
// personal library of named stashes.

const PREFIX = 'medallion-terminal:view:'

export function saveView(name: string, ctx: Record<string, string>): void {
  if (!name || typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(ctx))
  } catch {
    // storage denied or quota exceeded — silently no-op
  }
}

export function loadView(name: string): Record<string, string> | null {
  if (!name || typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = window.localStorage.getItem(PREFIX + name)
    if (raw == null) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const out: Record<string, string> = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'string') out[k] = v
    }
    return out
  } catch {
    return null
  }
}

export function listViews(): string[] {
  if (typeof window === 'undefined' || !window.localStorage) return []
  const out: string[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key && key.startsWith(PREFIX)) out.push(key.slice(PREFIX.length))
  }
  return out.sort()
}

export function deleteView(name: string): void {
  if (!name || typeof window === 'undefined' || !window.localStorage) return
  try { window.localStorage.removeItem(PREFIX + name) } catch { /* ignore */ }
}
