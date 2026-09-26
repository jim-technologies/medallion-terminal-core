import { type MouseEvent, type ReactNode } from 'react';
import { type ObjectRef } from './types';
/** Props for an inline object reference. */
export interface ObjectChipProps {
    /** The referenced object. Its `href` makes the chip a link. */
    object: ObjectRef;
    /**
     * Host navigation for a plain click (the `href` still serves new-tab and
     * copy-link). Without an `href` the chip becomes a button.
     */
    onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void;
    /** Preview shown on hover and focus, such as a compact ObjectHeader. */
    hoverCard?: ReactNode;
    /** Renders the title in the monospace face (ids such as `ORD-4481`). */
    mono?: boolean;
    /** Additional class. */
    className?: string;
}
/**
 * An object reference: its type glyph and title in the link colour. Used in
 * property values, link panels, grids and activity feeds.
 */
export declare const ObjectChip: import("react").ForwardRefExoticComponent<ObjectChipProps & import("react").RefAttributes<HTMLElement>>;
