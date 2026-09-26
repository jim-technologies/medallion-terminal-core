import { type HTMLAttributes, type ReactNode } from 'react';
import type { ComponentSize } from '../foundations/types';
/** Props for page or cursor navigation. */
export interface PaginationProps extends HTMLAttributes<HTMLElement> {
    /** Accessible name of the navigation, such as "Record pages". */
    label?: string;
    /** Current page (1-based) in numbered mode. */
    page?: number;
    /** Number of pages in numbered mode; omit when the total is unknown. */
    pageCount?: number;
    /** Numbered mode: called with the requested page. */
    onPageChange?: (page: number) => void;
    /** Cursor mode: whether an earlier page exists. */
    hasPrevious?: boolean;
    /** Cursor mode: whether a later page exists (an opaque next cursor). */
    hasNext?: boolean;
    /** Cursor mode: go back one page. */
    onPrevious?: () => void;
    /** Cursor mode: follow the next cursor. */
    onNext?: () => void;
    /** Leading summary, such as "1–25 of 1,204". */
    summary?: ReactNode;
    /** Overrides "Previous". */
    previousLabel?: string;
    /** Overrides "Next". */
    nextLabel?: string;
    /** Button size. */
    size?: ComponentSize;
}
/**
 * Previous and Next with an optional summary: numbered (`page`,
 * `pageCount`, `onPageChange`) or cursor-based (`hasPrevious`, `hasNext`,
 * `onPrevious`, `onNext`) for opaque page tokens.
 */
export declare const Pagination: import("react").ForwardRefExoticComponent<PaginationProps & import("react").RefAttributes<HTMLElement>>;
