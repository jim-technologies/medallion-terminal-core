import { Component, createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'

type Position = { top: number; left: number }
type Positions = Record<string, Position>
const STORAGE_KEY = 'mtc:scroll-restoration:v1'
const MAX_ENTRIES = 50
const MAX_OWNERS = 100
const RESTORE_TIMEOUT_MS = 10_000
// Retired effect cleanup must not overwrite a replacement with the same key.
const activeScopes = new Map<string, object>()

function isPosition(value: unknown): value is Position {
  if (!value || typeof value !== 'object') return false
  const position = value as Partial<Position>
  return typeof position.top === 'number' && Number.isFinite(position.top) && position.top >= 0
    && typeof position.left === 'number' && Number.isFinite(position.left) && position.left >= 0
}

function storedEntries(): [string, Positions][] {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(value)) return []
    return value.filter((entry): entry is [string, Positions] => {
      if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string') return false
      const positions: unknown = entry[1]
      return positions !== null && typeof positions === 'object' && !Array.isArray(positions)
        && Object.entries(positions).length <= MAX_OWNERS
        && Object.values(positions).every(isPosition)
    }).slice(-MAX_ENTRIES)
  } catch {
    return []
  }
}

function createScope(storageKey: string) {
  const positions: Positions = Object.create(null)
  const identity = {}
  let loaded = false
  const owners = new Map<string, { capture: () => void }>()
  let frozen = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const persist = () => {
    clearTimeout(timer)
    if (activeScopes.get(storageKey) !== identity) return
    for (const owner of owners.values()) owner.capture()
    try {
      const entries = storedEntries().filter(([key]) => key !== storageKey)
      entries.push([storageKey, positions])
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)))
    } catch {
      // Browser policy and quota can disable presentation-state persistence.
    }
  }
  const register = (key: string, element: HTMLElement, onRestore?: () => void) => {
    if (!loaded) {
      Object.assign(positions, storedEntries().find(([key]) => key === storageKey)?.[1])
      loaded = true
    }
    activeScopes.set(storageKey, identity)
    if (owners.has(key) || owners.size >= MAX_OWNERS) return () => {}
    if (!(key in positions) && Object.keys(positions).length >= MAX_OWNERS) delete positions[Object.keys(positions)[0]!]
    let pending: Position | null = positions[key] ?? { top: 0, left: 0 }
    let frame = 0
    let timeout: ReturnType<typeof setTimeout> | undefined
    const capture = () => {
      if (pending || frozen) return
      delete positions[key]
      positions[key] = { top: Math.max(0, element.scrollTop), left: Math.max(0, element.scrollLeft) }
      const savedKeys = Object.keys(positions)
      if (savedKeys.length > MAX_OWNERS) delete positions[savedKeys[0]!]
    }
    owners.set(key, { capture })
    const restore = () => {
      frame = 0
      if (!pending || !element.isConnected || element.clientHeight === 0) return
      const { scrollTop, scrollLeft } = element
      element.scrollTop = pending.top
      element.scrollLeft = pending.left
      if (scrollTop !== element.scrollTop || scrollLeft !== element.scrollLeft) onRestore?.()
      if (Math.abs(element.scrollTop - pending.top) <= 1 && Math.abs(element.scrollLeft - pending.left) <= 1) {
        pending = null
        mutations.disconnect()
        resize.disconnect()
        clearTimeout(timeout)
      }
    }
    const schedule = () => { if (pending && !frame) frame = requestAnimationFrame(restore) }
    const mutations = new MutationObserver(schedule)
    const resize = new ResizeObserver(schedule)
    mutations.observe(element, { childList: true, subtree: true, attributes: true })
    resize.observe(element)
    const cancel = () => {
      if (!pending) return
      pending = null
      mutations.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      capture()
      clearTimeout(timer)
      timer = setTimeout(persist, 100)
    }
    const onScroll = () => {
      capture()
      if (!pending) {
        clearTimeout(timer)
        timer = setTimeout(persist, 100)
      }
    }
    element.addEventListener('scroll', onScroll, { passive: true })
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) element.addEventListener(type, cancel, { capture: true, passive: true })
    timeout = setTimeout(cancel, RESTORE_TIMEOUT_MS)
    restore()
    return () => {
      capture()
      owners.delete(key)
      mutations.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
      element.removeEventListener('scroll', onScroll)
      for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) element.removeEventListener(type, cancel, { capture: true })
      persist()
      if (!owners.size && activeScopes.get(storageKey) === identity) activeScopes.delete(storageKey)
    }
  }
  return { register, persist, freeze: () => { persist(); frozen = true }, resume: () => { frozen = false } }
}

const ScrollContext = createContext<ReturnType<typeof createScope> | null>(null)

// Child removal can clamp a scroll owner before effect cleanup runs.
// Capture the outgoing entry in React's pre-mutation lifecycle instead.
class ScrollEntryBoundary extends Component<{ scope: ReturnType<typeof createScope>; children: ReactNode }> {
  getSnapshotBeforeUpdate(previous: Readonly<{ scope: ReturnType<typeof createScope> }>) {
    if (previous.scope !== this.props.scope) previous.scope.freeze()
    return null
  }
  componentDidMount() { this.props.scope.resume() }
  componentDidUpdate() { this.props.scope.resume() }
  componentWillUnmount() { this.props.scope.freeze() }
  render() { return this.props.children }
}

/** UI-only scroll state for one location or history entry, retained for this browser tab. */
export interface ScrollRestorationProviderProps {
  /** Stable history-entry identity; host adapters may use pathname plus search. */
  storageKey: string
  /** The host's existing scroll owner; its ref is never replaced. */
  mainRef?: RefObject<HTMLElement | null>
  children: ReactNode
}

/** Restores registered scroll owners as content arrives; real input cancels a pending restore. */
export function ScrollRestorationProvider({ storageKey, mainRef, children }: ScrollRestorationProviderProps) {
  const scope = useMemo(() => createScope(storageKey), [storageKey])
  useLayoutEffect(() => {
    if (mainRef?.current) return scope.register('main', mainRef.current)
  }, [scope, mainRef])
  useEffect(() => {
    window.addEventListener('pagehide', scope.persist)
    return () => {
      window.removeEventListener('pagehide', scope.persist)
      scope.persist()
    }
  }, [scope])
  return <ScrollEntryBoundary scope={scope}><ScrollContext.Provider value={scope}>{children}</ScrollContext.Provider></ScrollEntryBoundary>
}

/** Registers a toolkit-owned scrolling element in the nearest restoration scope. */
export function useScrollRestoration(ref: RefObject<HTMLElement | null>, key: string, onRestore?: () => void) {
  const scope = useContext(ScrollContext)
  const callback = useRef(onRestore)
  callback.current = onRestore
  useLayoutEffect(() => {
    if (ref.current) return scope?.register(key, ref.current, () => callback.current?.())
  }, [scope, ref, key])
}
