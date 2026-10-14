import { createContext, useContext } from 'react'

/**
 * Whether an enclosing `ProductShell` has a session port. A product without
 * sign-in renders a 401 as a plain error with Retry: there is no session to
 * renew. The shell provides it; nothing else sets it.
 */
export const SessionPortContext = createContext(false)

/** True inside a `ProductShell` given a `session` port. */
export function useHasSessionPort(): boolean {
  return useContext(SessionPortContext)
}
