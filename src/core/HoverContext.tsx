import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

// Cross-widget hover sync. Lives in its own provider AND owns its own
// state — so a hover update only re-renders this provider, not the
// surrounding Dashboard. Children passed through `children` keep stable
// element identity, so non-hover-consuming widgets don't re-render.
//
// Default value is a no-op so widgets used outside a Dashboard provider
// (Storybook) don't crash.
export interface HoverContextValue {
  hoverTime: string | null
  setHoverTime: (t: string | null) => void
}

export const HoverContext = createContext<HoverContextValue>({
  hoverTime: null,
  setHoverTime: () => {},
})

export function useHover(): HoverContextValue {
  return useContext(HoverContext)
}

// Owns the hover state and provides it. Crucially, the parent (Dashboard)
// does NOT see hoverTime — that's why charts firing 60Hz mouse-move
// updates don't cascade through the whole dashboard.
export function HoverProvider({ children }: { children: ReactNode }) {
  const [hoverTime, setHoverTime] = useState<string | null>(null)
  const value = useMemo(() => ({ hoverTime, setHoverTime }), [hoverTime])
  return <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
}
