import { type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from 'react';
import type { Intent } from '../foundations/types';
/** Props for a text tooltip attached to one trigger. */
export interface TooltipProps {
    /** Text or compact explanatory content shown on hover and focus. */
    content: ReactNode;
    /** One trigger element whose event and ARIA props are composed. */
    children: ReactElement;
    /** Preferred side of the trigger. */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Suppresses tooltip behavior and renders the child unchanged. */
    disabled?: boolean;
    /** Additional class for the positioning wrapper. */
    className?: string;
}
/** Hover/focus tooltip. Escape dismisses while focus remains on the trigger. */
export declare function Tooltip({ content, children, placement, disabled, className, }: TooltipProps): import("react").JSX.Element;
/** Props for a controlled or uncontrolled anchored popover. */
export interface PopoverProps {
    /** Non-interactive visual content rendered inside the built-in button. */
    trigger: ReactNode;
    /** Accessible trigger name and fallback content label when no title exists. */
    triggerAriaLabel?: string;
    /** Popover body. */
    children: ReactNode;
    /** Optional visible title used to label the popover dialog. */
    title?: ReactNode;
    /** Controlled open state. */
    open?: boolean;
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean;
    /** Called whenever user interaction requests an open-state change. */
    onOpenChange?: (open: boolean) => void;
    /** Preferred anchor alignment. */
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    /** Disables the trigger. */
    disabled?: boolean;
    /** Additional class for the positioning wrapper. */
    className?: string;
}
/**
 * Non-modal anchored content. The built-in trigger keeps the API semantic and
 * avoids nested interactive elements.
 */
export declare function Popover({ trigger, triggerAriaLabel, children, title, open: controlledOpen, defaultOpen, onOpenChange, placement, disabled, className, }: PopoverProps): import("react").JSX.Element;
/** One command or separator in a Menu or ContextMenu. */
export interface MenuItem {
    /** Stable item key. */
    id: string;
    /** Visible command label. Omit only for separators. */
    label?: ReactNode;
    /** Optional leading visual. */
    icon?: ReactNode;
    /** Display-only keyboard shortcut hint. */
    shortcut?: string;
    /** Prevents command selection. */
    disabled?: boolean;
    /** Renders a non-interactive separator instead of a command. */
    separator?: boolean;
    /** Optional destructive emphasis. */
    intent?: Extract<Intent, 'neutral' | 'danger'>;
    /** Invoked once when the enabled command is selected. */
    onSelect?: () => void;
}
/** Props for an anchored application menu. */
export interface MenuProps {
    /** Accessible name for both the trigger and menu. */
    label: string;
    /** Non-interactive visual content rendered inside the built-in button. */
    trigger: ReactNode;
    /** Ordered commands and separators. */
    items: readonly MenuItem[];
    /** Controlled open state. */
    open?: boolean;
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean;
    /** Called whenever user interaction requests an open-state change. */
    onOpenChange?: (open: boolean) => void;
    /** Horizontal menu alignment relative to the trigger. */
    align?: 'start' | 'end';
    /** Disables the trigger. */
    disabled?: boolean;
    /** Additional class for the positioning wrapper. */
    className?: string;
}
/** Keyboard-navigable action menu with roving focus. */
export declare function Menu({ label, trigger, items, open: controlledOpen, defaultOpen, onOpenChange, align, disabled, className, }: MenuProps): import("react").JSX.Element;
/** Props for a contextual menu region. */
export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    /** Accessible name for the focusable region and its menu. */
    label: string;
    /** Commands available for the contextual target. */
    items: readonly MenuItem[];
    /** Contextual target content. */
    children: ReactNode;
}
/** Pointer and Shift+F10 accessible contextual menu. */
export declare const ContextMenu: import("react").ForwardRefExoticComponent<ContextMenuProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props shared by modal dialog surfaces. */
export interface DialogProps {
    /** Controlled visibility. */
    open: boolean;
    /** Called when dismissal or host actions request a visibility change. */
    onOpenChange: (open: boolean) => void;
    /** Required visible dialog heading. */
    title: ReactNode;
    /** Optional text associated with the dialog through `aria-describedby`. */
    description?: ReactNode;
    /** Scrollable dialog body. */
    children: ReactNode;
    /** Optional fixed action footer. */
    footer?: ReactNode;
    /** Maximum dialog width preset. */
    size?: 'small' | 'medium' | 'large';
    /** Enables Escape, backdrop, and close-button dismissal. */
    dismissible?: boolean;
    /** Preferred initial focus target inside the dialog. */
    initialFocusRef?: RefObject<HTMLElement | null>;
    /** Additional class for the dialog surface. */
    className?: string;
}
/** Modal dialog with focus trapping, Escape dismissal, and focus restoration. */
export declare const Dialog: import("react").ForwardRefExoticComponent<DialogProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a modal edge-attached drawer. */
export interface DrawerProps extends Omit<DialogProps, 'size'> {
    /** Viewport edge to which the drawer attaches. */
    side?: 'left' | 'right';
    /** CSS width or numeric pixel width. */
    width?: number | string;
}
/** Modal drawer with the same keyboard and focus contract as Dialog. */
export declare const Drawer: import("react").ForwardRefExoticComponent<DrawerProps & import("react").RefAttributes<HTMLDivElement>>;
