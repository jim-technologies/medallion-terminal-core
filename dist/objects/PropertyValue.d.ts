import { type MouseEvent, type ReactNode } from 'react';
import type { StatusTone } from '../foundations/types';
import { type PropertyKind } from './propertyFormat';
import { type ObjectRef } from './types';
/** Props for one typed property value. */
export interface PropertyValueProps {
    /** The raw value. */
    value: unknown;
    /** How to present it; inferred from the value when unset. */
    kind?: PropertyKind;
    /** Refines the kind: `currency:USD`, `percent`, `date`, `datetime`, `id`, `url`. */
    format?: string;
    /** Status tones for enum values, e.g. `{ Churned: 'danger' }`. */
    tones?: Readonly<Record<string, StatusTone>>;
    /**
     * `panel` (default) adds secondary detail such as a currency code, relative
     * time and a copy action; `grid` keeps one compact line per value.
     */
    context?: 'panel' | 'grid';
    /** Shown for null, undefined, empty strings and empty lists. */
    emptyValue?: ReactNode;
    /** Anchor for relative times, for deterministic rendering. */
    now?: number;
    /** Host navigation for object references. */
    onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void;
    /** List items shown before "+N" (3 in panels, 2 in grid cells). */
    maxListItems?: number;
}
/**
 * Renders a value by its kind: tabular numbers, formatted currency and
 * percentages, dates with relative time, Yes/No with an icon, enum chips and
 * status badges, object references as chips, safe links, and nested objects
 * in a disclosure. Monospace is for ids and code only; nothing is rendered as
 * HTML.
 */
export declare function PropertyValue(props: PropertyValueProps): import("react").JSX.Element;
