import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density } from '../foundations/types';
/** One named value in a PropertyList. */
export interface PropertyListItem {
    /** Stable row key. */
    id?: string;
    /** Human-readable property name. */
    label: ReactNode;
    /** Arbitrary value rendered safely without HTML interpretation. */
    value: unknown;
    /** Optional explanation shown with the property name. */
    description?: ReactNode;
}
/** Props for arbitrary object metadata. */
export interface PropertyListProps extends HTMLAttributes<HTMLDListElement> {
    /** Ordered property definitions. Takes precedence over `properties`. */
    items?: readonly PropertyListItem[];
    /** Convenience object converted to ordered entries with `Object.entries`. */
    properties?: Readonly<Record<string, unknown>>;
    /** Optional density override for property rows. */
    density?: Density;
    /** Content used for null, undefined, and empty-string values. */
    emptyValue?: ReactNode;
}
/** Generic definition list for arbitrary host-owned metadata. */
export declare const PropertyList: import("react").ForwardRefExoticComponent<PropertyListProps & import("react").RefAttributes<HTMLDListElement>>;
