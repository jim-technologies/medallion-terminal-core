import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density } from '../foundations/types';
/** One stable node in a generic hierarchy. */
export interface TreeItem {
    /** Required unique ID used for selection, expansion, focus, and React keys. */
    id: string;
    /** Visible item label. */
    label: ReactNode;
    /** Optional secondary item text. */
    description?: ReactNode;
    /** Optional leading visual. */
    icon?: ReactNode;
    /** Removes the item from selection and keyboard navigation. */
    disabled?: boolean;
    /** Nested child items. */
    children?: readonly TreeItem[];
}
/** Props for the controlled hierarchy explorer. */
export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    /** Root hierarchy items. IDs must be unique across the full tree. */
    items: readonly TreeItem[];
    /** Accessible name for the tree. */
    label: string;
    /** ID of the selected item. */
    selectedId?: string;
    /** Called when pointer or keyboard interaction selects an enabled item. */
    onSelectionChange?: (id: string) => void;
    /** IDs of expanded branch items. */
    expandedIds: ReadonlySet<string>;
    /** Called with a fresh set after user expansion or collapse. */
    onExpandedChange: (ids: ReadonlySet<string>) => void;
    /** Optional density override for tree rows. */
    density?: Density;
}
/** Controlled tree with selection, expansion, and WAI-style keyboard navigation. */
export declare const Tree: import("react").ForwardRefExoticComponent<TreeProps & import("react").RefAttributes<HTMLDivElement>>;
