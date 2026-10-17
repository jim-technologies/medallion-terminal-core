import { type ReactNode, type RefObject } from 'react';
/** UI-only scroll state for one location or history entry, retained for this browser tab. */
export interface ScrollRestorationProviderProps {
    /** Stable history-entry identity; host adapters may use pathname plus search. */
    storageKey: string;
    /**
     * The entry's location, such as pathname, search and hash. A new entry
     * that changes only the fragment (an in-page `#anchor` link) keeps the
     * browser's scroll; any other new entry starts at the top.
     */
    href?: string;
    /** The host's existing scroll owner; its ref is never replaced. */
    mainRef?: RefObject<HTMLElement | null>;
    children: ReactNode;
}
/** Restores registered scroll owners as content arrives; real input cancels a pending restore. */
export declare function ScrollRestorationProvider({ storageKey, href, mainRef, children }: ScrollRestorationProviderProps): import("react").JSX.Element;
/** Registers a toolkit-owned scrolling element in the nearest restoration scope. */
export declare function useScrollRestoration(ref: RefObject<HTMLElement | null>, key: string, onRestore?: () => void): void;
