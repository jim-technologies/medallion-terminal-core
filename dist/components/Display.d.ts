import { type HTMLAttributes, type ReactNode } from 'react';
import type { ComponentSize, StatusTone } from '../foundations/types';
/** Props for a status dot and label. */
export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Status tone; the label always carries the meaning too. */
    tone?: StatusTone;
    /** Visual size. */
    size?: ComponentSize;
}
/**
 * A status: a dot in the tone's colour plus a label, so meaning never rests
 * on colour alone.
 */
export declare const StatusBadge: import("react").ForwardRefExoticComponent<StatusBadgeProps & import("react").RefAttributes<HTMLSpanElement>>;
/** Props for a keyboard key. */
export type KbdProps = HTMLAttributes<HTMLElement>;
/** A keyboard key or shortcut hint, such as `Ctrl K` or `/`. */
export declare const Kbd: import("react").ForwardRefExoticComponent<KbdProps & import("react").RefAttributes<HTMLElement>>;
/** Avatar sizes in pixels. */
export type AvatarSize = 24 | 32;
/** Props for a person or service avatar. */
export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** Display name; its initials are shown and it names the avatar. */
    name: string;
    /** Optional image; initials remain the fallback if it fails to load. */
    src?: string;
    /** Size in pixels. */
    size?: AvatarSize;
    /**
     * Hide the avatar from assistive technology when adjacent text already
     * names the person.
     */
    decorative?: boolean;
}
/** Initials of a display name: the first letters of its first and last words. */
export declare function initialsOf(name: string): string;
/** A round avatar with the person's initials, or their image when given. */
export declare const Avatar: import("react").ForwardRefExoticComponent<AvatarProps & import("react").RefAttributes<HTMLSpanElement>>;
/** Props for a loading placeholder. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
    /** CSS width or pixels; lines default to the full width. */
    width?: number | string;
    /** CSS height or pixels; defaults to one text line. */
    height?: number | string;
    /** Line, block, or circle (avatars and glyphs). */
    shape?: 'line' | 'block' | 'circle';
    /** Renders a paragraph of this many lines, the last one shorter. */
    lines?: number;
}
/**
 * A loading placeholder in the shape of the content it stands in for. It is
 * hidden from assistive technology: announce loading with `LoadingState` or
 * `aria-busy` on the region.
 */
export declare const Skeleton: import("react").ForwardRefExoticComponent<SkeletonProps & import("react").RefAttributes<HTMLSpanElement>>;
/** The clipboard operation CopyButton needs; injectable for tests. */
export interface ClipboardWriter {
    writeText(text: string): Promise<void>;
}
/** Props for a copy-to-clipboard action. */
export interface CopyButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onCopy'> {
    /** Text written to the clipboard. */
    value: string;
    /** Accessible action name; defaults to "Copy". */
    label?: string;
    /** Announced after a successful copy; defaults to "Copied". */
    copiedLabel?: string;
    /** Visual size. */
    size?: ComponentSize;
    /** Clipboard to write to; defaults to `navigator.clipboard`. */
    clipboard?: ClipboardWriter;
    /** Called after the value reached the clipboard. */
    onCopied?: (value: string) => void;
}
/**
 * Copies a value such as an id, hash or path. The icon turns into a check and
 * a polite status announces the copy.
 */
export declare const CopyButton: import("react").ForwardRefExoticComponent<CopyButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
/** Props for a row of object metadata. */
export interface MetaRowProps extends HTMLAttributes<HTMLUListElement> {
    /** Metadata items, such as "Updated 18 min ago by Jamie Kim" or "Revision 14". */
    items: readonly ReactNode[];
}
/** A wrapping row of small, muted metadata items. */
export declare const MetaRow: import("react").ForwardRefExoticComponent<MetaRowProps & import("react").RefAttributes<HTMLUListElement>>;
/** Props for a titled content panel. */
export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** Panel title (14 px, semibold). */
    title: ReactNode;
    /** Muted text after the title, such as a count. */
    subtitle?: ReactNode;
    /** Header actions, aligned to the end. */
    actions?: ReactNode;
    /** Fixed content below the body. */
    footer?: ReactNode;
    /** Heading level of the title. */
    headingLevel?: 2 | 3 | 4;
    /** Pads the body; off for edge-to-edge rows and grids. */
    padded?: boolean;
}
/**
 * A flat bordered panel with a 36 px header: the frame for property panels,
 * link panels, feeds and graphs.
 */
export declare const Panel: import("react").ForwardRefExoticComponent<PanelProps & import("react").RefAttributes<HTMLElement>>;
