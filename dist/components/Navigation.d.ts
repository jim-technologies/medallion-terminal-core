import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density } from '../foundations/types';
/** One controlled tab and its associated panel. */
export interface TabItem {
    /** Stable ID used for selection and ARIA relationships. */
    id: string;
    /** Visible tab label. */
    label: ReactNode;
    /** Content associated with this tab. */
    panel: ReactNode;
    /** Removes the tab from keyboard and pointer interaction. */
    disabled?: boolean;
}
/** Props for an accessible controlled tab set. */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Ordered tab definitions with unique IDs. */
    items: readonly TabItem[];
    /** ID of the selected tab. */
    value: string;
    /** Called when user interaction selects a tab. */
    onValueChange: (value: string) => void;
    /** Accessible name for the tab list. */
    label: string;
    /** Layout and matching arrow-key axis. */
    orientation?: 'horizontal' | 'vertical';
    /** Whether arrow navigation immediately selects or waits for Enter/Space. */
    activationMode?: 'automatic' | 'manual';
    /** Optional density override for this tab set. */
    density?: Density;
    /** Keeps inactive panels mounted with the native `hidden` attribute. */
    keepMounted?: boolean;
}
/** Controlled tabs with roving focus and arrow/Home/End navigation. */
export declare const Tabs: import("react").ForwardRefExoticComponent<TabsProps & import("react").RefAttributes<HTMLDivElement>>;
/** One location in a breadcrumb trail. */
export interface BreadcrumbItem {
    /** Stable key for this location. */
    id?: string;
    /** Human-readable location label. */
    label: ReactNode;
    /** Link destination when navigation is URL-based. */
    href?: string;
    /** Callback when navigation is host-managed. */
    onSelect?: () => void;
}
/** Props for a semantic breadcrumb trail. */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
    /** Ordered locations from the root to the current page. */
    items: readonly BreadcrumbItem[];
    /** Accessible name for the navigation landmark. */
    label?: string;
    /** Maximum visible locations; middle items collapse to an ellipsis. */
    maxItems?: number;
}
/** Responsive semantic breadcrumbs using links or buttons where actionable. */
export declare const Breadcrumbs: import("react").ForwardRefExoticComponent<BreadcrumbsProps & import("react").RefAttributes<HTMLElement>>;
