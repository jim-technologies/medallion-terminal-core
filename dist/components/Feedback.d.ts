import { type HTMLAttributes, type ReactNode } from 'react';
import type { ComponentSize, Intent } from '../foundations/types';
/** Props for a removable or static categorical tag. */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    /** Semantic color intent. */
    intent?: Intent;
    /** Visual tag size. */
    size?: ComponentSize;
    /** Adds a remove action and receives removal requests. */
    onRemove?: () => void;
    /** Accessible name for the remove action. */
    removeLabel?: string;
}
export declare const Tag: import("react").ForwardRefExoticComponent<TagProps & import("react").RefAttributes<HTMLSpanElement>>;
/** Props for a compact status or count badge. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Semantic color intent. */
    intent?: Intent;
    /** Visual badge size. */
    size?: ComponentSize;
    /** Displays a status dot before the badge contents. */
    dot?: boolean;
}
export declare const Badge: import("react").ForwardRefExoticComponent<BadgeProps & import("react").RefAttributes<HTMLSpanElement>>;
/** Props for a prominent inline informational or status message. */
export interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Optional prominent message heading. */
    title?: ReactNode;
    /** Semantic status intent. */
    intent?: Exclude<Intent, 'primary'>;
    /** Visual shown before the message; defaults to an intent icon. */
    icon?: ReactNode;
    /** Optional action controls shown below the message. */
    actions?: ReactNode;
}
/** Tokenized callout that never relies on color alone for status meaning. */
export declare const Callout: import("react").ForwardRefExoticComponent<CalloutProps & import("react").RefAttributes<HTMLDivElement>>;
