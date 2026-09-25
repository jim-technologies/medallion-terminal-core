import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density, PresentationTheme } from './types';
/** Presentation settings of the nearest scoped design-system root. */
export interface DesignSystemContextValue {
    /** Theme of the enclosing `.mtc-root`. */
    theme: PresentationTheme;
    /** Density of the enclosing `.mtc-root`. */
    density: Density;
}
/**
 * Reads the nearest `DesignSystemProvider` (or Dashboard) settings. Returns
 * `null` outside any scoped root, so callers choose their own fallback.
 */
export declare function useDesignSystem(): DesignSystemContextValue | null;
/** Internal: lets framework-owned roots (Dashboard) publish their scope. */
export declare function DesignSystemScope({ theme, density, children, }: DesignSystemContextValue & {
    children: ReactNode;
}): import("react").JSX.Element;
/** Props for the scoped design-system root. */
export interface DesignSystemProviderProps extends HTMLAttributes<HTMLDivElement> {
    /** Theme applied only to this subtree. */
    theme?: PresentationTheme;
    /** Control and workbench spacing for this subtree. */
    density?: Density;
    children: ReactNode;
}
/**
 * Establishes Terminal Core tokens for applications that compose the toolkit
 * without rendering a Dashboard. It renders deterministic attributes only,
 * so server and client markup remain identical. Dashboards rendered inside
 * inherit its theme unless they are given their own.
 */
export declare const DesignSystemProvider: import("react").ForwardRefExoticComponent<DesignSystemProviderProps & import("react").RefAttributes<HTMLDivElement>>;
