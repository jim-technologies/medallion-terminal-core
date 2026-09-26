import type { MouseEvent } from 'react';
/**
 * True for a plain primary-button click that a host router may handle in
 * place. Modified clicks (new tab, new window, download) and clicks another
 * handler already claimed keep the browser's default behaviour.
 */
export declare function isPlainClick(event: MouseEvent): boolean;
/**
 * Click handler for a routing-agnostic link: with `onNavigate`, a plain click
 * is handed to the host (which routes in place) and the anchor's `href`
 * still serves middle-click, copy-link and no-script navigation.
 */
export declare function navigateOnPlainClick<T extends HTMLElement>(onNavigate: ((event: MouseEvent<T>) => void) | undefined): ((event: MouseEvent<T>) => void) | undefined;
