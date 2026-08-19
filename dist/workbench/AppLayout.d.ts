import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density } from '../foundations/types';
/** Props for the outer application work surface. */
export interface AppSurfaceProps extends HTMLAttributes<HTMLDivElement> {
    /** Optional density override for the composed surface. */
    density?: Density;
    /** Fills the available parent height when true. */
    fullHeight?: boolean;
}
/** Neutral application canvas for composing toolkit controls without Dashboard. */
export declare const AppSurface: import("react").ForwardRefExoticComponent<AppSurfaceProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a horizontally scrollable application toolbar. */
export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
    /** Accessible name for the toolbar landmark. */
    label?: string;
    /** Fixed leading content, such as a title or navigation control. */
    start?: ReactNode;
    /** Fixed trailing content, such as status or primary actions. */
    end?: ReactNode;
    /** Optional density override for this toolbar. */
    density?: Density;
    /** Pins the toolbar to the top of its nearest scrolling ancestor. */
    sticky?: boolean;
}
/** Application toolbar with independent start, overflow, and end regions. */
export declare const Toolbar: import("react").ForwardRefExoticComponent<ToolbarProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a routing-agnostic application sidebar. */
export interface SidebarProps extends HTMLAttributes<HTMLElement> {
    /** Accessible name for the complementary landmark. */
    label: string;
    /** Fixed content above the scrolling pane. */
    header?: ReactNode;
    /** Fixed content below the scrolling pane. */
    footer?: ReactNode;
    /** CSS width or numeric pixel width. */
    width?: number | string;
    /** Visually and semantically hides the sidebar. */
    collapsed?: boolean;
    /** Edge whose border separates the sidebar from adjacent content. */
    side?: 'left' | 'right';
}
/** Scroll-safe navigation or explorer sidebar. */
export declare const Sidebar: import("react").ForwardRefExoticComponent<SidebarProps & import("react").RefAttributes<HTMLElement>>;
/** Props for an arbitrary object or selection inspector. */
export interface InspectorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Accessible name for the complementary landmark. */
    label: string;
    /** Optional visible inspector heading. */
    title?: ReactNode;
    /** Secondary heading context. */
    subtitle?: ReactNode;
    /** Header actions. */
    actions?: ReactNode;
    /** Fixed content below the scrolling pane. */
    footer?: ReactNode;
    /** CSS width or numeric pixel width. */
    width?: number | string;
    /** Visually and semantically hides the inspector when false. */
    open?: boolean;
}
/** Generic details pane that owns presentation but no selection semantics. */
export declare const Inspector: import("react").ForwardRefExoticComponent<InspectorProps & import("react").RefAttributes<HTMLElement>>;
