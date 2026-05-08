import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

// Shared 1Hz "now" tick for relative-time badges ("5s ago", "2m ago").
//
// Lives in its own provider so a tick re-renders only widgets that
// subscribed via `useNow()` — not the whole dashboard tree. The
// provider is ref-counted: the interval only runs while at least one
// consumer is mounted, so an idle dashboard doesn't pay for the timer.
//
// Default value is a no-op so widgets used outside a Dashboard provider
// (Storybook, tests) don't crash.
interface NowContextValue {
  now: number
  subscribe: () => () => void
}

export const NowContext = createContext<NowContextValue>({
  now: 0,
  subscribe: () => () => {},
})

// Subscribe to the shared 1Hz tick. Pass `enabled=false` to opt out
// without unmounting (e.g. a widget that's not currently `isLive`).
export function useNow(enabled = true): number {
  const { now, subscribe } = useContext(NowContext)
  useEffect(() => {
    if (!enabled) return
    return subscribe()
  }, [enabled, subscribe])
  return now
}

export function NowProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => Date.now())
  const subscribers = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const value = useMemo<NowContextValue>(() => ({
    now,
    subscribe: () => {
      subscribers.current += 1
      if (intervalRef.current == null) {
        intervalRef.current = setInterval(() => setNow(Date.now()), 1000)
      }
      return () => {
        subscribers.current = Math.max(0, subscribers.current - 1)
        if (subscribers.current === 0 && intervalRef.current != null) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    },
  }), [now])

  useEffect(() => () => {
    if (intervalRef.current != null) clearInterval(intervalRef.current)
  }, [])

  return <NowContext.Provider value={value}>{children}</NowContext.Provider>
}
