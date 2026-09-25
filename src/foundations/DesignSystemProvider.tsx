import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
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

const DesignSystemContext = createContext<DesignSystemContextValue | null>(null)

/**
 * Reads the nearest `DesignSystemProvider` (or Dashboard) settings. Returns
 * `null` outside any scoped root, so callers choose their own fallback.
 */
export function useDesignSystem(): DesignSystemContextValue | null {
  return useContext(DesignSystemContext)
}

/** Internal: lets framework-owned roots (Dashboard) publish their scope. */
export function DesignSystemScope({
  theme,
  density,
  children,
}: DesignSystemContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ theme, density }), [theme, density])
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
