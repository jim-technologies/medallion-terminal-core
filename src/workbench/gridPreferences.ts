const STORAGE_KEY = 'mtc:grid-widths:v1'
const MAX_GRIDS = 100

type Widths = Record<string, number>

function entries(): [string, Widths][] {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(stored)) return []
    return stored.filter((entry): entry is [string, Widths] => Array.isArray(entry) && entry.length === 2
      && typeof entry[0] === 'string' && entry[1] !== null && typeof entry[1] === 'object'
      && !Array.isArray(entry[1]) && Object.keys(entry[1]).length <= 1000
      && Object.values(entry[1]).every(width => typeof width === 'number' && Number.isFinite(width) && width > 0))
      .slice(-MAX_GRIDS)
  } catch {
    return []
  }
}

export function readColumnWidths(stateKey: string | undefined): Widths {
  if (!stateKey || typeof window === 'undefined') return Object.create(null)
  return Object.assign(Object.create(null), entries().find(([key]) => key === stateKey)?.[1])
}

export function saveColumnWidths(stateKey: string | undefined, widths: Widths) {
  if (!stateKey || typeof window === 'undefined') return
  try {
    const stored = entries().filter(([key]) => key !== stateKey)
    stored.push([stateKey, Object.fromEntries(Object.entries(widths).slice(-1000))])
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(-MAX_GRIDS)))
  } catch {
    // Browser policy and quota can disable presentation-state persistence.
  }
}
