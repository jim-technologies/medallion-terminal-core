import { type HTMLAttributes, type ReactNode } from 'react';
import { type BreadcrumbItem } from '../components/Navigation';
/** Props for a page's header block. */
export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Location trail from the root to this page. */
    breadcrumbs?: readonly BreadcrumbItem[];
    /** Page title (an `h1`); omit when `children` supplies the heading. */
    title?: ReactNode;
    /** One line under the title. */
    description?: ReactNode;
    /** Page actions, aligned to the end. */
    actions?: ReactNode;
    /** A tab strip under the heading, such as route tabs. */
    tabs?: ReactNode;
    /** Sticks to the top of the scrolling page. */
    sticky?: boolean;
}
/**
 * The top of every page: breadcrumbs, the title (or custom heading content
 * such as an `ObjectHeader`), a description, actions, and an optional tab
 * strip. Sticky when asked, flat always.
 */
export declare const PageHeader: import("react").ForwardRefExoticComponent<PageHeaderProps & import("react").RefAttributes<HTMLDivElement>>;
