import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { type DateInput } from '../foundations/intl';
import type { StatusTone } from '../foundations/types';
import type { ObjectRef } from './types';
/** One event: who did what to which object, and when. */
export interface ActivityItem {
    id: string;
    /** Person or service; omit for system events. */
    actor?: {
        name: string;
        avatarSrc?: string;
    };
    /** What happened: "updated", "linked", "Run started". */
    verb: ReactNode;
    /** The object acted on. */
    object?: ObjectRef;
    /** Detail after the object: "Churn risk 12.0% → 18.0%". */
    summary?: ReactNode;
    timestamp: DateInput;
    /** Timeline dot tone (status of the event). */
    tone?: StatusTone;
}
/** Props for an activity feed or timeline. */
export interface ActivityFeedProps extends HTMLAttributes<HTMLOListElement> {
    items: readonly ActivityItem[];
    /**
     * `feed`: avatar, sentence and relative time (object pages, home).
     * `timeline`: a dotted line with tones and absolute times (run and event
     * histories, audit trails).
     */
    variant?: 'feed' | 'timeline';
    /** Anchor for relative times. */
    now?: number;
    /** Host navigation for object chips. */
    onNavigate?: (object: ObjectRef, event: MouseEvent<HTMLElement>) => void;
    /** Shown when there are no items. */
    emptyLabel?: ReactNode;
}
/**
 * Who did what, when: each entry names the actor, the verb, the object (as
 * an `ObjectChip`) and a summary. Times are `<time>` elements with the
 * absolute instant in their title. The timeline variant serves event
 * histories: a status dot per event and absolute times.
 */
export declare const ActivityFeed: import("react").ForwardRefExoticComponent<ActivityFeedProps & import("react").RefAttributes<HTMLOListElement>>;
