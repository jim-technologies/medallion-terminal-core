import { type HTMLAttributes, type ReactNode } from 'react';
import type { Density } from '../foundations/types';
import type { PropertyKind } from '../objects/propertyFormat';
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
    /** Presentation kind; inferred from the value when unset. */
    kind?: PropertyKind;
    /** Kind refinement such as `currency:USD` or `datetime`. */
    format?: string;
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
/**
 * Generic definition list for arbitrary host-owned metadata. Each value is
 * rendered by `PropertyValue`: numbers grouped, booleans as Yes/No, lists as
 * chips and nested objects in a disclosure, never as raw JSON. Pass `kind`
 * or `format` on an item for typed rendering (currency, dates, ids).
 */
export declare const PropertyList: import("react").ForwardRefExoticComponent<PropertyListProps & import("react").RefAttributes<HTMLDListElement>>;
