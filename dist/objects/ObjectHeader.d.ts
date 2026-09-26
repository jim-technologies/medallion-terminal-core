import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import type { StatusTone } from '../foundations/types';
import { type ObjectTypeRef } from './types';
/** Props for an object's identity header. */
export interface ObjectHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** The object's type: its glyph, eyebrow label and colour. */
    type: ObjectTypeRef;
    /** The object's title. */
    title: ReactNode;
    /** Stable id, shown in monospace with a copy action. */
    objectId?: string;
    /** Current status, shown as a StatusBadge. */
    status?: {
        label: ReactNode;
        tone: StatusTone;
    };
    /** Metadata such as "Updated 18 min ago by Jamie Kim", "Revision 14". */
    meta?: readonly ReactNode[];
    /** Actions aligned to the end: a menu, the primary action, a more menu. */
    actions?: ReactNode;
    /** The inspector variant: a 24 px glyph, a 16 px title, no metadata row. */
    compact?: boolean;
    /** Heading level of the title (1 on an object page). */
    headingLevel?: 1 | 2 | 3;
    /** Link to the type's page. */
    typeHref?: string;
    /** Host navigation for the type link. */
    onTypeNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
}
/**
 * The object anatomy's first block: a 40 px type glyph, the type eyebrow in
 * the type's colour with the monospace id, the title, then status and
 * metadata. One header serves object pages, the explorer inspector
 * (`compact`) and hover cards.
 */
export declare const ObjectHeader: import("react").ForwardRefExoticComponent<ObjectHeaderProps & import("react").RefAttributes<HTMLElement>>;
