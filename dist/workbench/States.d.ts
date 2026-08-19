import { type HTMLAttributes, type ReactNode } from 'react';
import type { Intent } from '../foundations/types';
/** Props for a neutral no-content state. */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Primary empty-state message. */
    title: ReactNode;
    /** Optional explanation or next-step guidance. */
    description?: ReactNode;
    /** Optional decorative visual. */
    icon?: ReactNode;
    /** Optional recovery or creation actions. */
    actions?: ReactNode;
    /** Uses the bounded compact presentation. */
    compact?: boolean;
}
export declare const EmptyState: import("react").ForwardRefExoticComponent<EmptyStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a bounded loading placeholder. */
export interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
    /** Accessible and visible loading message. */
    label?: ReactNode;
    /** Optional detail about the pending operation. */
    description?: ReactNode;
    /** Spinner or bounded skeleton presentation. */
    variant?: 'spinner' | 'skeleton';
    /** Number of skeleton lines, clamped from one to eight. */
    lines?: number;
    /** Uses the bounded compact presentation. */
    compact?: boolean;
}
export declare const LoadingState: import("react").ForwardRefExoticComponent<LoadingStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a recoverable application error state. */
export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Optional error heading. */
    title?: ReactNode;
    /** Human-readable failure message. */
    message: ReactNode;
    /** Adds a retry action when provided. */
    onRetry?: () => void;
    /** Label for the generated retry action. */
    retryLabel?: string;
    /** Additional host-owned recovery actions. */
    actions?: ReactNode;
    /** Uses the bounded compact presentation. */
    compact?: boolean;
    /** Error severity presentation. */
    intent?: Extract<Intent, 'danger' | 'warning'>;
}
export declare const ErrorState: import("react").ForwardRefExoticComponent<ErrorStateProps & import("react").RefAttributes<HTMLDivElement>>;
