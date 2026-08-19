import { type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react';
export declare function cx(...values: Array<string | false | null | undefined>): string;
export declare function useControllableState<T>({ value, defaultValue, onChange, }: {
    value: T | undefined;
    defaultValue: T;
    onChange?: (value: T) => void;
}): [T, (value: T) => void];
export declare function focusableElements(container: HTMLElement): HTMLElement[];
/**
 * Shared modal lifecycle for toolkit and framework-owned surfaces: focus the
 * layer, restore the invoker, and prevent background scrolling while any modal
 * remains mounted.
 */
export declare function useModalFocus(open: boolean, contentRef: RefObject<HTMLElement | null>, initialFocusRef?: RefObject<HTMLElement | null>): void;
/** Keyboard handling shared by every modal focus scope. */
export declare function handleModalKeyDown(event: ReactKeyboardEvent<HTMLElement>, contentRef: RefObject<HTMLElement | null>, dismissible: boolean, close: () => void): void;
