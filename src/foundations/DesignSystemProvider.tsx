import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Density, PresentationTheme } from './types'

/** Presentation settings of the nearest scoped design-system root. */
export interface DesignSystemContextValue {
  /** Theme of the enclosing `.mtc-root`. */
  theme: PresentationTheme
  /** Density of the enclosing `.mtc-root`. */
  density: Density
}

/** Lazily created body-level host that carries the scope's theme. */
interface PortalRegistry {
  acquire(): HTMLElement | null
  release(): void
  update(theme: PresentationTheme, density: Density): void
}

interface ScopeValue extends DesignSystemContextValue {
  portal: PortalRegistry
}

const DesignSystemContext = createContext<ScopeValue | null>(null)

function createPortalRegistry(theme: PresentationTheme, density: Density): PortalRegistry {
  let host: HTMLElement | null = null
  let users = 0
  let current = { theme, density }
  const apply = () => {
    if (!host) return
    host.className = `mtc-root mtc-portal-root mtc-theme-${current.theme}`
    host.dataset.theme = current.theme
    host.dataset.density = current.density
  }
  return {
    acquire() {
      if (typeof document === 'undefined') return null
      if (!host) {
        host = document.createElement('div')
        apply()
        document.body.appendChild(host)
      }
      users += 1
      return host
    },
    release() {
      users = Math.max(0, users - 1)
      if (users === 0 && host) {
        host.remove()
        host = null
      }
    },
    update(nextTheme, nextDensity) {
      current = { theme: nextTheme, density: nextDensity }
      apply()
    },
  }
}

/**
 * Reads the nearest `DesignSystemProvider` (or Dashboard) settings. Returns
 * `null` outside any scoped root, so callers choose their own fallback.
 */
export function useDesignSystem(): DesignSystemContextValue | null {
  const scope = useContext(DesignSystemContext)
  if (!scope) return null
  return { theme: scope.theme, density: scope.density }
}

/**
 * A body-level element inside the nearest scoped theme, for portalled
 * menus, popovers, trays and toasts. Content portalled there keeps the
 * scope's tokens, fonts and density instead of falling back to host styles.
 * Returns `null` outside a provider and until mounted (server render and the
 * first client render), so render inline or nothing until it is set.
 */
export function usePortalContainer(): HTMLElement | null {
  const portal = useContext(DesignSystemContext)?.portal
  const [host, setHost] = useState<HTMLElement | null>(null)
  useEffect(() => {
    if (!portal) return
    setHost(portal.acquire())
    return () => {
      portal.release()
      setHost(null)
    }
  }, [portal])
  return host
}

/** Props shared by every scoped root. */
interface ScopeProps {
  theme: PresentationTheme
  density: Density
  children: ReactNode
}

/**
 * Publishes a scope to descendants. Framework roots (Dashboard) use it with
 * their own theme and density.
 */
export function DesignSystemScope({ theme, density, children }: ScopeProps) {
  // One registry per scope; the host follows later theme/density changes.
  const [portal] = useState(() => createPortalRegistry(theme, density))
  useEffect(() => { portal.update(theme, density) }, [portal, theme, density])
  const value = useMemo<ScopeValue>(() => ({ theme, density, portal }), [theme, density, portal])
  return <DesignSystemContext.Provider value={value}>{children}</DesignSystemContext.Provider>
}

/** Props for the scoped design-system root. */
export interface DesignSystemProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** Theme applied only to this subtree. */
  theme?: PresentationTheme
  /** Control and workbench spacing for this subtree. */
  density?: Density
  children: ReactNode
}

/**
 * Establishes Terminal Core tokens for applications that compose the toolkit
 * without rendering a Dashboard. It renders deterministic attributes only,
 * so server and client markup remain identical. Dashboards rendered inside
 * inherit its theme unless they are given their own.
 */
export const DesignSystemProvider = forwardRef<HTMLDivElement, DesignSystemProviderProps>(
  function DesignSystemProvider(
    {
      theme = 'dark',
      density = 'standard',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        className={[
          'mtc-root',
          'mtc-design-system',
          `mtc-theme-${theme}`,
          className,
        ].filter(Boolean).join(' ')}
        data-theme={theme}
        data-density={density}
      >
        <DesignSystemScope theme={theme} density={density}>{children}</DesignSystemScope>
      </div>
    )
  },
)
