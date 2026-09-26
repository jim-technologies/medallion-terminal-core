import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { type IconName } from '../components/Icon';
import { type ObjectTypeRef } from '../objects/types';
/** One destination in the navigation rail. */
export interface NavRailItem {
    id: string;
    label: string;
    /** Destination; without it the item is a button for `onNavigate`. */
    href?: string;
    /** Area icon (Home, Explore, Files). */
    icon?: IconName;
    /** Object type glyph instead of an icon (pinned object types). */
    type?: ObjectTypeRef;
    /** Count after the label, such as objects of a type. */
    count?: ReactNode;
    disabled?: boolean;
}
/** A titled group of destinations, such as "Operate" or "Platform". */
export interface NavRailSection {
    id: string;
    /** Section label; the first section usually has none. */
    label?: string;
    items: readonly NavRailItem[];
}
/** Props for the application navigation rail. */
export interface NavRailProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
    /** Accessible name of the navigation landmark. */
    label: string;
    sections: readonly NavRailSection[];
    /** The current destination (`aria-current="page"`). */
    activeId?: string;
    /** Host navigation for a plain click (links keep their `href`). */
    onNavigate?: (item: NavRailItem, event: MouseEvent<HTMLElement>) => void;
    /** Icons only, 48 px wide; labels become tooltips and accessible names. */
    collapsed?: boolean;
    /** Shows the collapse toggle and receives its requests. */
    onCollapsedChange?: (collapsed: boolean) => void;
    /** Content above the sections, such as a scope switcher. */
    header?: ReactNode;
    /** Content below the sections. */
    footer?: ReactNode;
}
/**
 * The shell's left rail: sections of destinations with an icon or type
 * glyph, a label and an optional count, the current one marked with the
 * selection fill and a 2 px accent bar. It collapses to 48 px icons; on
 * phones the product shell shows it inside a drawer.
 */
export declare const NavRail: import("react").ForwardRefExoticComponent<NavRailProps & import("react").RefAttributes<HTMLElement>>;
