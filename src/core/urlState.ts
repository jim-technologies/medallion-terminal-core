// URL ↔ ctx serialization. Keeps ctx values bookmarkable as plain
// query params (`?ctx.symbol=BTC&ctx.range=1d`).
//
// Used by Dashboard to:
//   - initialize ctx state on mount (URL wins over template defaults)
//   - replaceState on every ctx change so the URL stays in sync
//
// Other URL params (e.g. `?template=...`) are preserved.

const PREFIX = 'ctx.'

export function readCtxFromUrl(search: string): Record<string, string> {
  const out: Record<string, string> = {}
  const params = new URLSearchParams(search)
  for (const [k, v] of params) {
    if (k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = v
  }
  return out
}

export function writeCtxToUrl(search: string, ctx: Record<string, string>): string {
  const params = new URLSearchParams(search)
  // Drop any existing ctx.* keys first so removed values don't linger.
  for (const k of [...params.keys()]) {
    if (k.startsWith(PREFIX)) params.delete(k)
  }
  for (const [k, v] of Object.entries(ctx)) {
    params.set(`${PREFIX}${k}`, v)
  }
  return params.toString()
}
