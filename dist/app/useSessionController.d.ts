import type { SessionInfo, SessionPort } from './session';
/** Where the session stands. */
export type SessionStatus = 'loading' | 'authenticated' | 'signed-out' | 'expired';
/** Renew this long before the product token expires. */
export declare const RENEW_LEAD_MS = 60000;
/** The page visibility the scheduler reads. */
export type VisibilitySource = Pick<Document, 'hidden' | 'addEventListener' | 'removeEventListener'>;
/** Injectable clock, timers and page visibility, for tests. */
export interface SessionEnvironment {
    now?: () => number;
    document?: VisibilitySource;
    setTimeout?: (callback: () => void, delay: number) => unknown;
    clearTimeout?: (handle: unknown) => void;
}
/**
 * Schedules one renewal a minute before `expiresAt`, with at most one timer
 * and none while the page is hidden (a product UI scales to zero: a hidden
 * tab makes no requests). When the page becomes visible again the timer is
 * set afresh, and a page that comes back at or past the renewal time renews
 * at once. Returns the cancel function.
 */
export declare function scheduleRenewal(expiresAt: number, renew: () => void, { now, document: doc, setTimeout: set, clearTimeout: clear, }: SessionEnvironment & {
    document: VisibilitySource;
}): () => void;
/** What the shell's session controller exposes. */
export interface SessionController {
    status: SessionStatus;
    session: SessionInfo | null;
    /** Renews now; resolves true when the session is good again. */
    renew: () => Promise<boolean>;
    /** Call on any 401 (wire to `createProductFetch({ onUnauthenticated })`). */
    reportUnauthenticated: () => void;
}
/**
 * Loads the session, renews it a minute before it expires and after any
 * 401, and never polls: no timer runs while the page is hidden, and a page
 * that comes back near or past expiry renews at once. A failed renewal
 * moves to `expired`, which the shell shows over the page (drafts kept).
 */
export declare function useSessionController(port: SessionPort | undefined, environment?: SessionEnvironment): SessionController;
