/**
 * Whether an enclosing `ProductShell` has a session port. A product without
 * sign-in renders a 401 as a plain error with Retry: there is no session to
 * renew. The shell provides it; nothing else sets it.
 */
export declare const SessionPortContext: import("react").Context<boolean>;
/** True inside a `ProductShell` given a `session` port. */
export declare function useHasSessionPort(): boolean;
