import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'
import { isPlainClick } from '../components/navigation'
import { matchRoutes, type Router, type RouterLocation, type RouteMatch, type RouteTable } from './router'

const RouterContext = createContext<Router | null>(null)

/** Provides a `Router` to the product's pages. `ProductShell` does this. */
export function RouterProvider({ router, children }: { router: Router; children: ReactNode }) {
  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
}

/** The nearest router. */
export function useRouter(): Router {
  const router = useContext(RouterContext)
  if (!router) throw new Error('useRouter must be used inside a RouterProvider or ProductShell')
  return router
}

function sameLocation(a: RouterLocation, b: RouterLocation): boolean {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash
}

/** The current location; re-renders on every change. */
export function useLocation(): RouterLocation {
  const router = useRouter()
  const subscribe = useMemo(() => (listener: () => void) => router.subscribe(listener), [router])
  // Cache by value so useSyncExternalStore sees a stable snapshot.
  const snapshot = useMemo(() => {
    let last = router.location()
    return () => {
      const next = router.location()
      if (!sameLocation(last, next)) last = next
      return last
    }
  }, [router])
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

/** The first route of `routes` matching the current path, with typed params. */
export function useRoute<T extends RouteTable>(routes: T): RouteMatch<T> | null {
  const { pathname } = useLocation()
  return useMemo(() => matchRoutes(routes, pathname), [routes, pathname])
}

/** Props for an in-app link. */
export interface RouterLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** App path. */
  to: string
  /** Replace the current history entry instead of pushing one. */
  replace?: boolean
}

/**
 * An anchor for an app path: a plain click navigates through the router,
 * while new-tab, copy-link and modified clicks keep working.
 */
export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(function RouterLink(
  { to, replace, onClick, ...rest },
  ref,
) {
  const router = useRouter()
  return (
    <a
      {...rest}
      ref={ref}
      href={router.href(to)}
      onClick={event => {
        onClick?.(event)
        if (!isPlainClick(event) || (rest.target && rest.target !== '_self')) return
        event.preventDefault()
        router.navigate(to, { replace })
      }}
    />
  )
})
