import { type SyntheticEvent } from 'react';
import { type ObjectTypeRef } from './types';
/** An object type drawn as a schema node. */
export interface SchemaGraphType extends ObjectTypeRef {
    id: string;
    /** Number of objects of this type, shown under the name. */
    count?: number;
    /** The type's page. */
    href?: string;
}
/** A link type between two object types. */
export interface SchemaGraphRelation {
    id?: string;
    /** Source type id. */
    from: string;
    /** Target type id. */
    to: string;
    /** The relation's name, such as "Places". */
    label: string;
}
/** Props for the ontology's type graph. */
export interface SchemaGraphProps {
    types: readonly SchemaGraphType[];
    relations: readonly SchemaGraphRelation[];
    /** Accessible name, such as "Ontology graph". */
    label: string;
    /** The highlighted type. */
    selectedId?: string;
    /** Called when a type is chosen (click or Enter); a plain click on an `href` goes to the host instead of navigating. */
    onSelect?: (type: SchemaGraphType, event: SyntheticEvent<Element>) => void;
    /** Height in pixels. */
    height?: number;
    /** Ranks run left to right (default) or top to bottom. */
    direction?: 'right' | 'down';
}
/**
 * Object types as nodes (type glyph, name, object count) and link types as
 * labelled, directed edges, on the same layered layout as the `dag` widget.
 * Plain SVG with pan and zoom; types are focusable, and Enter or a click
 * selects one.
 */
export declare function SchemaGraph({ types, relations, label, selectedId, onSelect, height, direction, }: SchemaGraphProps): import("react").JSX.Element | null;
