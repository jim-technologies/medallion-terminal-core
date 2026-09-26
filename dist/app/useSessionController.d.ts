import type { SessionInfo, SessionPort } from './session';
/** Where the session stands. */
export type SessionStatus = 'loading' | 'authenticated' | 'signed-out' | 'expired';
/** Renew this long before the product token expires. */
export declare const RENEW_LEAD_MS = 60000;
/** Injectable clock and page visibility, for tests. */
export interface SessionEnvironment {
    now?: () => number;
    document?: Pick<Document, 'hidden' | 'addEventListener' | 'removeEventListener'>;
}
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
