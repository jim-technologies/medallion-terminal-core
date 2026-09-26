import { type InputHTMLAttributes, type ReactNode } from 'react';
import type { ComponentSize } from '../foundations/types';
/** A scope token shown inside the field, such as a type filter. */
export interface SearchToken {
    id: string;
    label: string;
    /** Leading visual, such as a `TypeGlyph`. */
    icon?: ReactNode;
}
/** Props for a search box with scope tokens. */
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'onSubmit'> {
    /** Current query. */
    value: string;
    /** Called on every edit. */
    onValueChange: (value: string) => void;
    /** Accessible name of the input. */
    label: string;
    /** Scope tokens before the query (a type pill, a folder). */
    tokens?: readonly SearchToken[];
    /** Removes a token (its × button, or Backspace in an empty field). */
    onRemoveToken?: (id: string) => void;
    /** Enter. */
    onSubmit?: (value: string) => void;
    /**
     * A key that focuses the field from anywhere outside another input, such
     * as `/`; shown as a hint while the field is empty.
     */
    shortcut?: string;
    /** Overrides "Clear search". */
    clearLabel?: string;
    /** Control size. */
    size?: ComponentSize;
}
/**
 * The search box of explorers and product shells: a search icon, scope
 * tokens, the query, a clear action and an optional focus shortcut.
 */
export declare const SearchField: import("react").ForwardRefExoticComponent<SearchFieldProps & import("react").RefAttributes<HTMLInputElement>>;
