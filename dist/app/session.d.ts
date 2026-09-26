/**
 * The session port of a product UI. A product's browser session is a short
 * product token in an HttpOnly cookie (at most five minutes); the shell
 * renews it before it expires and after any 401, without a new long-lived
 * credential: a hidden frame follows the Terminal's launch URL, whose IAM
 * handoff sets a fresh cookie and reports back.
 */
/** What `/auth/session` reports. */
export interface SessionInfo {
    authenticated: boolean;
    /** The signed-in principal. */
    subject?: string;
    /** A display name for the account menu. */
    displayName?: string;
    workspaceId?: string;
    /** When the product token expires, in epoch milliseconds. */
    expiresAt?: number;
    /** Where to sign in (from runtime config, never a constant). */
    signInUrl?: string;
}
/** The session port a product implements (or builds with the helpers below). */
export interface SessionPort {
    /** Reads the current session. */
    load(signal?: AbortSignal): Promise<SessionInfo>;
    /** Renews silently and returns the renewed session; rejects when it cannot. */
    renew(): Promise<SessionInfo>;
    /** Leaves for sign-in, returning to `returnTo` (an app path) afterwards. */
    signIn(returnTo: string, session?: SessionInfo): void;
    /** Ends the session. */
    signOut?(): Promise<void> | void;
}
/** Reads a `/auth/session` JSON body (snake or camel case) into `SessionInfo`. */
export declare function parseSessionBody(body: unknown): SessionInfo;
/** Options for `createHttpSessionPort`. */
export interface HttpSessionPortOptions {
    /** The product's session endpoint. */
    sessionUrl?: string;
    /** Transport; a `createProductFetch` in products. */
    fetch?: typeof globalThis.fetch;
    /** Performs the renewal (for example `renewViaFrame`); `load` follows it. */
    renew: () => Promise<void>;
    /** Builds the sign-in destination; defaults to `signInUrl?return_to=`. */
    signInHref?: (returnTo: string, session?: SessionInfo) => string | undefined;
    /** Leaves the page; `location.assign` by default. */
    assign?: (url: string) => void;
    /** Ends the session, such as a POST to `/auth/sign-out`. */
    signOut?: () => Promise<void>;
}
/** A `SessionPort` over a product's `/auth/session` endpoint. */
export declare function createHttpSessionPort({ sessionUrl, fetch: transport, renew, signInHref, assign, signOut, }: HttpSessionPortOptions): SessionPort;
/** Messages the renewal callback page posts to its parent frame. */
export declare const SESSION_RENEWED = "mtc:session-renewed";
export declare const SESSION_RENEW_FAILED = "mtc:session-renew-failed";
/** Options for `renewViaFrame`. */
export interface FrameRenewalOptions {
    /** The Terminal launch URL in renew mode (it redirects through IAM). */
    url: string;
    /** The product's own origin, which the callback page posts from. */
    origin?: string;
    /** Gives up after this long. */
    timeoutMs?: number;
    /** Injectable for tests. */
    window?: Window;
}
/**
 * Renews the product cookie in a hidden same-site frame: the frame follows
 * the Terminal's launch URL, the product's callback sets the fresh cookie
 * and its `/auth/renewed` page posts `mtc:session-renewed` to this window.
 * Nothing navigates the visible page, so uploads and drafts survive.
 */
export declare function renewViaFrame({ url, origin, timeoutMs, window: win, }: FrameRenewalOptions): Promise<void>;
