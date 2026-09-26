import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { type ObjectRef, type ObjectTypeRef } from './types';
/** One linked object and its secondary detail (a role, a date, an amount). */
export interface LinkItem extends ObjectRef {
    /** Right-aligned detail, such as "Technical lead" or "$18,240.00". */
    detail?: ReactNode;
    /** Monospace title, for ids such as `ORD-4481`. */
    mono?: boolean;
}
/** All links of one link type from (or to) an object. */
export interface LinkGroup {
    /** Stable id of the link type. */
    id: string;
    /** The relation as read from this object: "Employs", "Placed". */
    relation: string;
    /** `incoming` links point at this object ("Subject of"). */
    direction?: 'outgoing' | 'incoming';
    /** The type at the other end. */
    targetType: ObjectTypeRef;
    /** Total links of this type; may exceed the items shown. */
    count: number;
    /** The first few linked objects. */
    items: readonly LinkItem[];
    /** Link to the full set. */
    viewAllHref?: string;
    /** Host navigation for "View all". */
    onViewAll?: (event: MouseEvent<HTMLElement>) => void;
    /** Overrides "View all {count}". */
    viewAllLabel?: ReactNode;
}
/** Props for an object's link panel. */
export interface LinkPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Link groups in display order. */
    groups: readonly LinkGroup[];
    /** Panel title; defaults to "Links". */
    title?: ReactNode;
    /** Header detail; defaults to "n link types · m objects". */
    subtitle?: ReactNode;
    /** Items shown per group before "View all". */
    maxItems?: number;
    /** Header actions, such as opening the link graph. */
    actions?: ReactNode;
    /** Host navigation for linked objects. */
    onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void;
    /** Heading level of the panel title. */
    headingLevel?: 2 | 3 | 4;
}
/** Relation header of a link group: "Employs → [glyph] Person … 3". */
export declare function LinkRelation({ group }: {
    group: LinkGroup;
}): import("react").JSX.Element;
/**
 * An object's relationships grouped by link type: each group names the
 * relation and the type at the other end with its count, lists the first
 * few objects with their detail, and offers "View all".
 */
export declare const LinkPanel: import("react").ForwardRefExoticComponent<LinkPanelProps & import("react").RefAttributes<HTMLElement>>;
