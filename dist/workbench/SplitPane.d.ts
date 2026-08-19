import { type HTMLAttributes, type ReactNode } from 'react';
/** Props for a keyboard- and pointer-resizable two-pane layout. */
export interface SplitPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /** Content assigned to the logical primary pane. */
    primary: ReactNode;
    /** Content assigned to the remaining pane. */
    secondary: ReactNode;
    /** Horizontal lays panes left/right; vertical lays them top/bottom. */
    orientation?: 'horizontal' | 'vertical';
    /** Edge occupied by the primary pane. */
    primaryPane?: 'start' | 'end';
    /** Controlled primary-pane size as a percentage. */
    size?: number;
    /** Initial primary-pane percentage when uncontrolled. */
    defaultSize?: number;
    /** Called with a clamped primary-pane percentage after resizing. */
    onSizeChange?: (size: number) => void;
    /** Minimum primary-pane percentage. */
    minSize?: number;
    /** Maximum primary-pane percentage. */
    maxSize?: number;
    /** Keyboard resize increment in percentage points. */
    step?: number;
    /** Disables pointer and keyboard resizing. */
    disabled?: boolean;
    /** Stacks panes and removes the separator below the toolkit breakpoint. */
    stackOnNarrow?: boolean;
    /** Accessible name for the resize separator. */
    separatorLabel?: string;
}
/**
 * Two-pane percentage layout. The separator supports pointer capture,
 * arrows, Home, and End; narrow layouts can stack without a pointer.
 */
export declare const SplitPane: import("react").ForwardRefExoticComponent<SplitPaneProps & import("react").RefAttributes<HTMLDivElement>>;
