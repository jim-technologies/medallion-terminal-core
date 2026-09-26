import { type HTMLAttributes, type ReactNode } from 'react';
import { type MessageCatalog, type MessageKey, type MessageValues } from './messages';
import type { Density, PresentationTheme } from './types';
/** Presentation settings of the nearest scoped design-system root. */
export interface DesignSystemContextValue {
    /** Theme of the enclosing `.mtc-root`. */
    theme: PresentationTheme;
    /** Density of the enclosing `.mtc-root`. */
    density: Density;
}
/** Locale settings of the nearest scope. */
export interface LocaleSettings {
    /** BCP 47 locale; `en` outside any scope. */
    locale: string;
    /** IANA time zone for dates; the runtime's zone when unset. */
    timeZone?: string;
}
/**
 * Reads the nearest `DesignSystemProvider` (or Dashboard) settings. Returns
 * `null` outside any scoped root, so callers choose their own fallback.
 */
export declare function useDesignSystem(): DesignSystemContextValue | null;
/**
 * A body-level element inside the nearest scoped theme, for portalled
 * menus, popovers, trays and toasts. Content portalled there keeps the
 * scope's tokens, fonts and density instead of falling back to host styles.
 * Returns `null` outside a provider and until mounted (server render and the
 * first client render), so render inline or nothing until it is set.
 */
export declare function usePortalContainer(): HTMLElement | null;
/** Locale of the nearest scope, for the `Intl` formatters. */
export declare function useLocale(): LocaleSettings;
/** Looks up a toolkit message and fills its `{name}` placeholders. */
export type Translate = (key: MessageKey, values?: MessageValues) => string;
/**
 * The nearest scope's message catalog as a lookup function. Outside a scope
 * it reads the English defaults.
 */
export declare function useMessage(): Translate;
/** Locale inputs a scope accepts; unset values inherit the enclosing scope. */
interface LocaleProps {
    /**
     * BCP 47 locale. Selects the built-in catalog (`en`, or `zh-CN` for any
     * Chinese locale) and the formatting locale.
     */
    locale?: string;
    /** IANA time zone for formatted dates, e.g. `UTC`. */
    timeZone?: string;
    /** Per-key overrides layered over the built-in catalog. */
    messages?: Partial<MessageCatalog>;
}
/** Props shared by every scoped root. */
interface ScopeProps extends LocaleProps {
    theme: PresentationTheme;
    density: Density;
    children: ReactNode;
}
/**
 * Publishes a scope to descendants. Framework roots (Dashboard) use it with
 * their own theme and density; locale settings they do not set are
 * inherited from the enclosing scope.
 */
export declare function DesignSystemScope({ theme, density, locale, timeZone, messages, children, }: ScopeProps): import("react").JSX.Element;
/** Props for the scoped design-system root. */
export interface DesignSystemProviderProps extends HTMLAttributes<HTMLDivElement>, LocaleProps {
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
export {};
