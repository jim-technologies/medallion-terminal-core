import { useEffect, useRef, useState } from 'react'

const DEFAULT_DURATION_MS = 400

// Smoothly animate a numeric value toward a moving target. Used by Metric
// and StatStrip so live ticks read as a transition rather than a jarring
// snap. Cubic ease-out feels lively without overshooting.
//
// Respects `prefers-reduced-motion`: returns the target value verbatim
// (no animation) when the user prefers reduced motion.
//
// Re-targets cleanly mid-animation: a new target value picks up from the
// currently-displayed value, not from the previous start.
export function useAnimatedNumber(target: number, duration = DEFAULT_DURATION_MS): number {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const startRef = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined' || !Number.isFinite(target)) {
      setValue(target)
      return
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    if (target === value) return

    fromRef.current = value
    startRef.current = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = fromRef.current + (target - fromRef.current) * eased
      setValue(next)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}
