import { type HTMLAttributes } from 'react';
import { type IconName } from '../components/Icon';
import { type ObjectTypeRef } from './types';
/** One value of a facet. */
export interface FacetOption {
    value: string;
    label: string;
    /** Matching results. */
    count?: number;
    /** Type glyph for object type facets. */
    type?: ObjectTypeRef;
    /** Icon for other facets. */
    icon?: IconName;
}
/** One facet: object type, a property's values, status. */
export interface FacetGroup {
    id: string;
    label: string;
    /** `single` behaves like radio buttons (object type); `multi` like checkboxes. */
    mode: 'single' | 'multi';
    options: readonly FacetOption[];
    /** Selected option values. */
    selected: readonly string[];
    /** Options shown before "Show more" (8 when unset). */
    maxVisible?: number;
}
/** Props for the explorer's facet rail. */
export interface FacetListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Accessible name, such as "Filters". */
    label: string;
    groups: readonly FacetGroup[];
    /** Called with a group's full selection after each change. */
    onChange: (groupId: string, values: string[]) => void;
    /** Shows "Clear" while anything is selected. */
    onClear?: () => void;
}
/**
 * The explorer's facet rail: groups of options with counts, the object type
 * facet single-select with type glyphs, value facets as checkboxes. Native
 * radio and checkbox inputs carry the semantics; long groups fold behind
 * "Show more".
 */
export declare const FacetList: import("react").ForwardRefExoticComponent<FacetListProps & import("react").RefAttributes<HTMLDivElement>>;
