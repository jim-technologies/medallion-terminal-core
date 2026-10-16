import { type ReactNode, type RefObject } from 'react';
/** UI-only scroll state for one location or history entry, retained for this browser tab. */
export interface ScrollRestorationProviderProps {
    /** Stable history-entry identity; host adapters may use pathname plus search. */
    storageKey: string;
    /** The host's existing scroll owner; its ref is never replaced. */
    mainRef?: RefObject<HTMLElement | null>;
    children: ReactNode;
}
/** Restores registered scroll owners as content arrives; real input cancels a pending restore. */
export declare function ScrollRestorationProvider({ storageKey, mainRef, children }: ScrollRestorationProviderProps): import("react").JSX.Element;
/** Registers a toolkit-owned scrolling element in the nearest restoration scope. */
export declare function useScrollRestoration(ref: RefObject<HTMLElement | null>, key: string, onRestore?: () => void): void;
