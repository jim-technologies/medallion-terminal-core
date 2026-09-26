import { type ReactNode } from 'react';
/** One result or command. */
export interface CommandItem {
    id: string;
    label: string;
    /** Secondary text, such as a type name, id or path. */
    description?: ReactNode;
    /** Leading visual, such as a `TypeGlyph`. */
    icon?: ReactNode;
    /** Display-only shortcut hint. */
    shortcut?: string;
    disabled?: boolean;
}
/** A titled group of results, such as one object type. */
export interface CommandGroup {
    id: string;
    label: string;
    items: readonly CommandItem[];
}
/** Props for the global search and command palette. */
export interface CommandPaletteProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Current query. */
    query: string;
    onQueryChange: (query: string) => void;
    /** Results for the query, grouped. The host searches; the palette presents. */
    groups: readonly CommandGroup[];
    /** An item was chosen (Enter or click); the palette closes. */
    onSelect: (item: CommandItem) => void;
    /** Enter with no item highlighted, such as a free-text command. */
    onSubmit?: (query: string) => void;
    /**
     * Highlight the first item as results change (the default), so Enter
     * opens it. Off, Enter submits the query until an arrow key picks an item.
     */
    autoHighlight?: boolean;
    /** Accessible name; defaults to "Command palette". */
    label?: string;
    placeholder?: string;
    /** A search is in flight. */
    loading?: boolean;
    /** Shown when there are no results for a non-empty query. */
    emptyLabel?: ReactNode;
    /** Content under the results; defaults to the keyboard hints. */
    footer?: ReactNode;
    /** Toggle with Ctrl/⌘ K from anywhere on the page. */
    hotkey?: boolean;
}
/**
 * The global search and command palette: a modal combobox over grouped
 * results. Arrow keys move the highlight across groups, Enter chooses (or
 * submits the query), Escape closes and focus returns to where it was. The
 * host owns searching and navigation; the palette owns presentation and
 * keyboard. The Dashboard's `⌘K` palette is built on it.
 */
export declare function CommandPalette({ open, onOpenChange, query, onQueryChange, groups, onSelect, onSubmit, autoHighlight, label, placeholder, loading, emptyLabel, footer, hotkey, }: CommandPaletteProps): import("react").JSX.Element | null;
