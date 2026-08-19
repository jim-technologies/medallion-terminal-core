import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density, PresentationTheme } from './types';
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
 * so server and client markup remain identical.
 */
export declare const DesignSystemProvider: import("react").ForwardRefExoticComponent<DesignSystemProviderProps & import("react").RefAttributes<HTMLDivElement>>;
