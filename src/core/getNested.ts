// Resolve a dot-separated path into nested objects/arrays.
//
// Used both by `useDataSource` (the `transform` config field, which
// dot-paths into a backend response) and by domain widgets that
// extract numeric values from a source payload (e.g. Kelly reading
// `rows.4.left.values.odds` off a paired_grid stream).
//
// Numeric path segments index into arrays; anything else is treated
// as an object key. Returns `undefined` for missing paths or
// non-traversable intermediates — never throws.
export function getNested(obj: unknown, path: string): unknown {
  if (!path) return obj
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null) return undefined
    if (Array.isArray(acc)) {
      const i = Number(key)
      return Number.isInteger(i) ? acc[i] : undefined
    }
    if (typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}
