import { type HTMLAttributes, type ReactNode } from 'react';
import type { BreadcrumbItem } from '../components/Navigation';
import { type ObjectHeaderProps } from './ObjectHeader';
/** One section of an object page: Overview, Properties, Links, Activity. */
export interface ObjectPageTab {
    id: string;
    label: ReactNode;
    /** Count after the label, such as the number of links. */
    count?: ReactNode;
    panel: ReactNode;
}
/** Props for an object's page. */
export interface ObjectPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** The object's identity (type, title, id, status, metadata, actions). */
    header: ObjectHeaderProps;
    /** Location trail: where the object sits, ending with the object itself. */
    breadcrumbs?: readonly BreadcrumbItem[];
    /** Sections in order; the first is shown by default. */
    tabs: readonly ObjectPageTab[];
    /** Controlled section. */
    tab?: string;
    defaultTab?: string;
    onTabChange?: (id: string) => void;
    /** Accessible name of the section list; defaults to "Object sections". */
    tabsLabel?: string;
}
/**
 * The object anatomy as a page: breadcrumbs, the `ObjectHeader`, then
 * sections as tabs (typically Overview, Properties, Links, Activity) whose
 * panels compose `PropertyPanel`, `LinkPanel`, `LinkGraph` and
 * `ActivityFeed`. Routing-agnostic: drive `tab` from the URL to deep-link a
 * section.
 */
export declare const ObjectPage: import("react").ForwardRefExoticComponent<ObjectPageProps & import("react").RefAttributes<HTMLDivElement>>;
