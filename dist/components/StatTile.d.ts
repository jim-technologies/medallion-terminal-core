import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import type { StatusTone } from '../foundations/types';
/** A change against a previous period. */
export interface StatDelta {
    /** Formatted change, such as "+4.2%" or "12". */
    value: ReactNode;
    /** Direction of the change; draws an arrow. */
    direction?: 'up' | 'down';
    /** Whether the change is good (`ok`), bad (`danger`) or neither. */
    tone?: 'ok' | 'danger' | 'neutral';
}
/** Props for one headline number. */
export interface StatTileProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** What the number measures. */
    label: ReactNode;
    /** The number, already formatted. */
    value: ReactNode;
    /** Unit after the value, such as "ms" or "USD". */
    unit?: ReactNode;
    /** Change against a previous period. */
    delta?: StatDelta;
    /** A status badge, such as a service's health. */
    status?: {
        label: ReactNode;
        tone: StatusTone;
    };
    /** One line of context under the value. */
    description?: ReactNode;
    /** Leading visual beside the label, such as a `TypeGlyph`. */
    icon?: ReactNode;
    /** Makes the whole tile a link. */
    href?: string;
    /** Host navigation for a plain click on the link. */
    onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
}
/**
 * A headline number with its label, unit, change, status and context: the
 * toolkit counterpart of the dashboard `metric` widget, for service health
 * grids, link counts and summary rows.
 */
export declare const StatTile: import("react").ForwardRefExoticComponent<StatTileProps & import("react").RefAttributes<HTMLElement>>;
