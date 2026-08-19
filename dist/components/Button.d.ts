import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import type { ComponentSize, Density, Intent } from '../foundations/types';
export type ButtonVariant = 'solid' | 'outline' | 'ghost';
/** Props shared by labeled action buttons. */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Semantic visual intent. */
    intent?: Intent;
    /** Surface treatment for the action. */
    variant?: ButtonVariant;
    /** Visual control size. */
    size?: ComponentSize;
    /** Optional density override for this action. */
    density?: Density;
    /** Disables interaction and replaces the contents with a busy state. */
    loading?: boolean;
    /** Accessible and visible text used while loading. */
    loadingLabel?: string;
    /** Decorative or labeled content before the button label. */
    startIcon?: ReactNode;
    /** Decorative or labeled content after the button label. */
    endIcon?: ReactNode;
}
/** Semantic, ref-forwarding action button with consistent busy handling. */
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
/** Props for a square action that must always have an accessible name. */
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'startIcon' | 'endIcon'> {
    /** Required accessible name for the icon-only action. */
    'aria-label': string;
    /** Icon or compact visual rendered inside the button. */
    icon: ReactNode;
}
/** Compact icon-only action. */
export declare const IconButton: import("react").ForwardRefExoticComponent<IconButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
/** Props for a visually connected set of related actions. */
export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Accessible name for the grouped actions. */
    label?: string;
    /** Optional density override inherited by the contained actions. */
    density?: Density;
}
/** Groups related buttons under a single accessible label. */
export declare const ButtonGroup: import("react").ForwardRefExoticComponent<ButtonGroupProps & import("react").RefAttributes<HTMLDivElement>>;
