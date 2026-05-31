// Pure helpers for the Select widget, split out so Select.tsx exports only
// its component (the WidgetRegistry types a widget module as a map of
// ComponentType, so a stray exported function would break that contract).

export interface Choice {
  value: string
  label?: string
}

// resolveSelection decides what value the dropdown shows and whether that
// value must be pushed back into ctx. Empty string counts as "unset": the
// URL serializes an unset ctx key as `?key=` (empty), and `??` would KEEP
// that empty string instead of falling through to a default — the bug that
// left dependent sources firing with an empty param. So when ctx is
// undefined OR empty, fall through to the explicit default, then the first
// choice, and flag it for sync. A non-empty ctx value always wins and never
// syncs (so a real user/URL selection is never overridden).
export function resolveSelection(
  ctxVal: string | undefined,
  defaultVal: string | undefined,
  choices: Choice[],
): { current: string; shouldSync: boolean } {
  if (ctxVal !== undefined && ctxVal !== '') {
    return { current: ctxVal, shouldSync: false }
  }
  const fallback = defaultVal || choices[0]?.value || ''
  return { current: fallback, shouldSync: fallback !== '' }
}
