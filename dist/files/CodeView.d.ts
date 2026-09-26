import { type HTMLAttributes } from 'react';
/** Props for a read-only source view. */
export interface CodeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** The source text. */
    code: string;
    /** Accessible name of the code region, such as the file path. */
    label: string;
    /** Language name shown in the toolbar. */
    language?: string;
    /** Lines rendered at most; the rest is summarised (5,000 when unset). */
    maxLines?: number;
    /** Number of the first line (for excerpts). */
    startLine?: number;
    /** Lines to highlight, by number. */
    highlightLines?: readonly number[];
    /** Controlled wrapping. */
    wrap?: boolean;
    /** Initial wrapping when uncontrolled. */
    defaultWrap?: boolean;
    onWrapChange?: (wrap: boolean) => void;
    /** The source itself was cut before it got here (a bounded read). */
    truncatedNotice?: string;
    /** Shows the copy action. */
    copyable?: boolean;
    /** Height of the scrolling area (CSS or pixels). */
    height?: number | string;
}
/**
 * Read-only source with line numbers (CSS counters, so selecting and copying
 * text never picks them up), a wrap toggle with a hanging indent, a copy
 * action for the whole source, and a bounded line count. Text renders as
 * React text nodes; nothing is interpreted.
 */
export declare const CodeView: import("react").ForwardRefExoticComponent<CodeViewProps & import("react").RefAttributes<HTMLDivElement>>;
