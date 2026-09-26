/**
 * The Router port and a minimal typed history router. Product UIs read and
 * change the location only through a `Router`, so the same pages run on the
 * browser history (`createHistoryRouter`), in tests and stories
 * (`createMemoryRouter`), or under a host framework's router (an adapter
 * that implements the four methods).
 */

/** Where the product is. */
export interface RouterLocation {
  pathname: string
  search: string
  hash: string
}

/** The routing port. */
export interface Router {
  /** The current location. */
  location(): RouterLocation
  /** Goes to an app path such as `/b/finance/f/q3.csv?view=grid`. */
  navigate(to: string, options?: { replace?: boolean }): void
  /** Goes back one entry. */
  back(): void
  /** Called after every location change; returns an unsubscribe function. */
  subscribe(listener: () => void): () => void
  /** The `href` for an app path (with the router's base). */
  href(to: string): string
}

function parse(path: string): RouterLocation {
  const url = new URL(path, 'http://app.local')
  return { pathname: url.pathname, search: url.search, hash: url.hash }
}

function normaliseBase(base: string): string {
  const trimmed = base.replace(/\/+$/, '')
  return trimmed === '' || trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

/** Options for `createHistoryRouter`. */
export interface HistoryRouterOptions {
  /** Path prefix the app is served under, such as `/embed`. */
  base?: string
  /** The window whose history is used; injectable for tests. */
  window?: Window
}

/**
 * A router on the browser History API: `pushState` and `replaceState` for
 * navigation, `popstate` for back and forward. Paths are app paths; the
 * base is added to and removed from the URL.
 */
export function createHistoryRouter({ base = '', window: win = globalThis.window }: HistoryRouterOptions = {}): Router {
  const prefix = normaliseBase(base)
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach(listener => listener())
  const strip = (pathname: string) => (
    prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`))
      ? pathname.slice(prefix.length) || '/'
      : pathname
  )
  const onPopState = () => notify()
  const href = (to: string) => {
    const { pathname, search, hash } = parse(to)
    return `${prefix}${pathname}${search}${hash}`
  }
  return {
    location() {
      const { pathname, search, hash } = win.location
      return { pathname: strip(pathname), search, hash }
    },
    navigate(to, options) {
      const target = href(to)
      if (options?.replace) win.history.replaceState(null, '', target)
      else win.history.pushState(null, '', target)
      notify()
    },
    back() {
      win.history.back()
    },
    subscribe(listener) {
      if (listeners.size === 0) win.addEventListener('popstate', onPopState)
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) win.removeEventListener('popstate', onPopState)
      }
    },
    href,
  }
}

/** A router over an in-memory history, for tests, stories and frames. */
export function createMemoryRouter(initial = '/'): Router {
  const entries: RouterLocation[] = [parse(initial)]
  let index = 0
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach(listener => listener())
  return {
    location: () => entries[index]!,
    navigate(to, options) {
      const next = parse(to)
      if (options?.replace) entries[index] = next
      else {
        entries.splice(index + 1, entries.length, next)
        index = entries.length - 1
      }
      notify()
    },
    back() {
      if (index === 0) return
      index -= 1
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    href: to => {
      const { pathname, search, hash } = parse(to)
      return `${pathname}${search}${hash}`
    },
  }
}

type Segments<P extends string> = P extends `${infer Head}/${infer Tail}` ? Head | Segments<Tail> : P
type ParamName<S extends string> = S extends `:${infer Name}` ? Name : S extends `*${infer Name}` ? (Name extends '' ? 'splat' : Name) : never

/**
 * The parameters of a route pattern: `/b/:bucket/f/*path` has `bucket` and
 * `path`. A bare `*` is named `splat`.
 */
export type RouteParams<P extends string> = { [K in ParamName<Segments<P>>]: string }

// A segment's decoded value, or null for a malformed escape such as `%E0`.
function decodeSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment)
  } catch {
    return null
  }
}

/**
 * Matches a pattern against a pathname. `:name` matches one segment, `*name`
 * the rest (possibly empty). Parameters are URL-decoded. Returns null when
 * the path does not match, including a parameter with a malformed percent
 * escape (a bad deep link is "not found", never a thrown error).
 */
export function matchPath<P extends string>(pattern: P, pathname: string): RouteParams<P> | null {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  const params: Record<string, string> = {}
  for (let index = 0; index < patternParts.length; index++) {
    const part = patternParts[index]!
    if (part.startsWith('*')) {
      const rest = pathParts.slice(index).map(decodeSegment)
      if (rest.some(segment => segment === null)) return null
      params[part.slice(1) || 'splat'] = rest.join('/')
      return params as RouteParams<P>
    }
    const value = pathParts[index]
    if (value === undefined) return null
    if (part.startsWith(':')) {
      const decoded = decodeSegment(value)
      if (decoded === null) return null
      params[part.slice(1)] = decoded
    } else if (part !== value) return null
  }
  return pathParts.length === patternParts.length ? params as RouteParams<P> : null
}

/** Builds a path from a pattern and its parameters, URL-encoding each segment. */
export function buildPath<P extends string>(pattern: P, params: RouteParams<P>): string {
  const values = params as Record<string, string>
  const parts = pattern.split('/').filter(Boolean).map(part => {
    if (part.startsWith('*')) {
      return (values[part.slice(1) || 'splat'] ?? '').split('/').filter(Boolean).map(encodeURIComponent).join('/')
    }
    return part.startsWith(':') ? encodeURIComponent(values[part.slice(1)] ?? '') : part
  })
  return `/${parts.filter(Boolean).join('/')}`
}

/** A route table: id to pattern. */
export type RouteTable = Readonly<Record<string, string>>

/** The first route of a table that matches, with its parameters. */
export type RouteMatch<T extends RouteTable> = {
  [K in keyof T & string]: { id: K; params: RouteParams<T[K]> }
}[keyof T & string]

/** Finds the first matching route, in table order. */
export function matchRoutes<T extends RouteTable>(routes: T, pathname: string): RouteMatch<T> | null {
  for (const [id, pattern] of Object.entries(routes)) {
    const params = matchPath(pattern, pathname)
    if (params) return { id, params } as RouteMatch<T>
  }
  return null
}
