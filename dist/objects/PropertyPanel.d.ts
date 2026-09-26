import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import type { Density, StatusTone } from '../foundations/types';
import { type PropertyKind } from './propertyFormat';
import type { ObjectRef } from './types';
/** One property of an object: its label, value and presentation. */
export interface PropertyDefinition {
    /** Stable property key. */
    id: string;
    /** Human-readable name. */
    label: string;
    /** The raw value. */
    value: unknown;
    /** Presentation kind; inferred from the value when unset. */
    kind?: PropertyKind;
    /** Kind refinement such as `currency:USD`. */
    format?: string;
    /** Status tones for enum values. */
    tones?: Readonly<Record<string, StatusTone>>;
    /** Group heading, such as "Commercial". Groups keep first-seen order. */
    group?: string;
    /** Explanation shown under the label. */
    description?: ReactNode;
}
/** Props for a grouped, filterable property panel. */
export interface PropertyPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Ordered properties. */
    properties: readonly PropertyDefinition[];
    /** Panel title; defaults to "Properties". */
    title?: ReactNode;
    /** Shows a filter action in the header. */
    filterable?: boolean;
    /** Extra header actions. */
    actions?: ReactNode;
    /** Shown for empty values. */
    emptyValue?: ReactNode;
    /** Anchor for relative times. */
    now?: number;
    /** Optional row density override. */
    density?: Density;
    /** Label column width in pixels (the value column takes the rest). */
    labelWidth?: number;
    /** Host navigation for object-reference values. */
    onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void;
    /** Heading level of the panel title. */
    headingLevel?: 2 | 3 | 4;
}
/**
 * An object's properties as a grouped definition list inside a panel: the
 * label column, then each value rendered by `PropertyValue`. The header
 * shows "n of m" and, when filterable, filters by label or value text.
 */
export declare const PropertyPanel: import("react").ForwardRefExoticComponent<PropertyPanelProps & import("react").RefAttributes<HTMLElement>>;
