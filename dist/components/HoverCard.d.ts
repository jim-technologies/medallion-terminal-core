import { type ReactElement, type ReactNode } from 'react';
/** Props for a preview card shown while a trigger is hovered or focused. */
export interface HoverCardProps {
    /** One trigger element, usually a link such as an ObjectChip. */
    children: ReactElement;
    /** Preview content: a compact header, key properties, link counts. */
    content: ReactNode;
    /** Delay before opening, in milliseconds. */
    openDelay?: number;
    /** Delay before closing, so the pointer can travel onto the card. */
    closeDelay?: number;
    /** Additional class for the card. */
    className?: string;
}
/**
 * A non-modal preview of the object behind a link. It opens on hover and on
 * keyboard focus, closes on Escape, and is described to assistive
 * technology from its trigger. The card is supplementary: every action it
 * shows must also be reachable elsewhere. It renders into the scope's portal
 * container, so it keeps the theme and escapes clipping ancestors.
 */
export declare function HoverCard({ children, content, openDelay, closeDelay, className, }: HoverCardProps): import("react").JSX.Element;
