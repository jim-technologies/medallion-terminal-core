import { type ReactNode } from 'react';
import { type MenuItem } from '../components/Overlays';
import { type FileBrowserEntry } from './fileBrowserHelpers';
import type { WidgetProps } from '../types/template';
/**
 * Host extension points of the file browser. Register a wrapper to use
 * them: `registry.register('file_browser', props => <FileBrowser {...props}
 * entryHref={...} />)`. The widget's payload and options are unchanged.
 */
export interface FileBrowserExtensions {
    /** Leading icon for an entry; a folder or file glyph by default. */
    entryIcon?: (entry: FileBrowserEntry) => ReactNode;
    /** A link for an entry's name (one per row), such as a product route. */
    entryHref?: (entry: FileBrowserEntry, path: string) => string | undefined;
    /** Row selection; `single` by default. */
    selection?: 'none' | 'single' | 'multi';
    /** Controlled selection, by `fileEntryIdentity`. */
    selectedIds?: readonly string[];
    /** Called with the selected entries after every change. */
    onSelectionChange?: (entries: FileBrowserEntry[]) => void;
    /** Commands for an entry's context menu (right-click, Menu key, Shift+F10). */
    contextActions?: (entry: FileBrowserEntry, path: string) => readonly MenuItem[];
    /**
     * Called when an entry is opened (Enter, double-click, or a plain click on
     * its link); return `true` to handle it instead of the built-in behaviour
     * (navigate into folders, preview or download files).
     */
    onOpen?: (entry: FileBrowserEntry, path: string) => boolean | void;
}
/** Props of the file browser widget: the widget props plus extension points. */
export type FileBrowserProps = WidgetProps & FileBrowserExtensions;
export declare function FileBrowser({ data, options, widgetId, entryIcon, entryHref, selection, selectedIds, onSelectionChange, contextActions, onOpen, }: FileBrowserProps): import("react").JSX.Element;
