import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { Density, PresentationTheme } from './types'

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
 * so server and client markup remain identical.
 */
export const DesignSystemProvider = forwardRef<HTMLDivElement, DesignSystemProviderProps>(
  function DesignSystemProvider(
    {
      theme = 'dark',
      density = 'comfortable',
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
        {children}
      </div>
    )
  },
)

