import { type HTMLAttributes, type ReactNode } from 'react';
import { type DateInput } from '../foundations/intl';
import type { Intent } from '../foundations/types';
import type { SourceError } from '../core/sourceError';
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
    /** Optional error heading. Defaults to the typed error's title. */
    title?: ReactNode;
    /**
     * Human-readable failure message. Defaults to product copy for the typed
     * error's kind; required when no `error` is given.
     */
    message?: ReactNode;
    /**
     * A typed transport failure. Chooses the title, copy and intent from its
     * kind and puts the server's reason, error code and request id in a
     * Details disclosure rather than the headline.
     */
    error?: SourceError;
    /** Adds a retry action when provided. */
    onRetry?: () => void;
    /** Label for the generated retry action. */
    retryLabel?: string;
    /** Additional host-owned recovery actions. */
    actions?: ReactNode;
    /** Uses the bounded compact presentation. */
    compact?: boolean;
    /** Error severity presentation. Defaults from the typed error's kind. */
    intent?: Extract<Intent, 'danger' | 'warning'>;
}
export declare const ErrorState: import("react").ForwardRefExoticComponent<ErrorStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props shared by the access, session, availability and freshness states. */
export interface StatusStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Replaces the default heading. */
    title?: ReactNode;
    /** Replaces the default explanation. */
    description?: ReactNode;
    /**
     * The typed failure behind the state. Its reason, code and request id go in
     * a Details disclosure.
     */
    error?: SourceError;
    /** Additional host-owned actions. */
    actions?: ReactNode;
    /** Uses the bounded compact presentation. */
    compact?: boolean;
}
/** Props for a denied scope. */
export interface AccessDeniedStateProps extends StatusStateProps {
    /** What was denied, in words: `bucket finance`. */
    resource?: string;
}
/**
 * A scope the person may not read (HTTP 403, `permission_denied`). Render it
 * where the denied scope would be, so the rest of the app stays usable.
 */
export declare const AccessDeniedState: import("react").ForwardRefExoticComponent<AccessDeniedStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a missing session. */
export interface SignedOutStateProps extends StatusStateProps {
    /** Starts sign-in; renders the primary action. */
    onSignIn?: () => void;
    /** Label for the sign-in action. */
    signInLabel?: string;
}
/** No session at all: the person has to sign in before anything loads. */
export declare const SignedOutState: import("react").ForwardRefExoticComponent<SignedOutStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for an expired session. */
export interface SessionExpiredStateProps extends StatusStateProps {
    /** Renews the session (and retries); renders the primary action. */
    onContinue?: () => void;
    /** Label for the renew action. */
    continueLabel?: string;
}
/**
 * The session ended mid-journey (HTTP 401). The page, its route and drafts
 * stay; continuing renews the session instead of starting over.
 */
export declare const SessionExpiredState: import("react").ForwardRefExoticComponent<SessionExpiredStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a missing object. */
export interface NotFoundStateProps extends StatusStateProps {
    /** What is missing, in words: `bucket finance`. */
    resource?: string;
}
/** The object does not exist or moved (HTTP 404, `not_found`). */
export declare const NotFoundState: import("react").ForwardRefExoticComponent<NotFoundStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a throttled request. */
export interface RateLimitedStateProps extends StatusStateProps {
    /** How long the server asked to wait; defaults to the error's `Retry-After`. */
    retryAfterMs?: number;
    /** Adds a retry action. */
    onRetry?: () => void;
    /** Label for the retry action. */
    retryLabel?: string;
}
/** Too many requests (HTTP 429, `resource_exhausted`), with the wait if known. */
export declare const RateLimitedState: import("react").ForwardRefExoticComponent<RateLimitedStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for a view whose data has stopped refreshing. */
export interface StaleStateProps extends StatusStateProps {
    /** When the data last refreshed. */
    lastUpdated?: DateInput;
    /** Clock for the relative time; defaults to now. */
    now?: number;
    /** Adds a refresh action. */
    onRefresh?: () => void;
}
/**
 * The data shown may be out of date (a stream dropped or polling stalled).
 * Use `compact` to show it beside the stale content rather than instead of it.
 */
export declare const StaleState: import("react").ForwardRefExoticComponent<StaleStateProps & import("react").RefAttributes<HTMLDivElement>>;
/** Props for rendering any typed failure as its state. */
export interface SourceErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** The failure to explain. */
    error: SourceError;
    /** What failed, in words, for the access and not-found copy. */
    resource?: string;
    /** Retries the failed request. */
    onRetry?: () => void;
    /** Renews an expired session; falls back to `onRetry`. */
    onRenewSession?: () => void;
    /** Uses the bounded compact presentation. */
    compact?: boolean;
}
/**
 * Picks the state a failure deserves from its kind: an expired session,
 * a denied or missing scope, a rate limit, or a typed error with retry.
 */
export declare const SourceErrorState: import("react").ForwardRefExoticComponent<SourceErrorStateProps & import("react").RefAttributes<HTMLDivElement>>;
