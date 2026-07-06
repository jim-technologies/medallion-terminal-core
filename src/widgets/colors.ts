// Shared color tokens for widgets that fill / stroke / tint by category.
// `SEMANTIC` maps well-known status/category names to the public theme
// variables. `PALETTE` is the neutral cycling fallback for "give me
// distinct colors for N items" cases.

export const SEMANTIC: Record<string, string> = {
  ok:     'var(--mtc-ok)',
  warn:   'var(--mtc-warning)',
  danger: 'var(--mtc-danger)',
  error:  'var(--mtc-danger)',
  info:   'var(--mtc-accent)',
  muted:  'var(--mtc-muted)',
}

export const PALETTE: readonly string[] = [
  '#38bdf8', '#34d399', '#fbbf24', '#f87171',
  '#a78bfa', '#f472b6', '#22d3ee', '#94a3b8',
]

// Shared Recharts tooltip styling. Every chart widget renders the same
// dark popover, so the inline `contentStyle` lived duplicated across each
// one — centralized here to keep them visually identical.
export const TOOLTIP_STYLE = {
  backgroundColor: 'var(--mtc-surface)',
  border: '1px solid var(--mtc-border)',
  borderRadius: 6,
  fontSize: 12,
  color: 'var(--mtc-fg)',
} as const

// Standard "name → color, fall back to palette[i]" resolution. Names
// recognised: any SEMANTIC key, or a literal `#hex`. Anything else
// rotates the palette by index.
export function resolveColor(name: string | undefined, i: number): string {
  if (!name) return PALETTE[i % PALETTE.length]
  if (name in SEMANTIC) return SEMANTIC[name]
  if (name.startsWith('#')) return name
  return PALETTE[i % PALETTE.length]
}

// Stable colors for a chart's series: palette by original index. This is
// deliberately data-label agnostic so public SDK output does not imply
// knowledge of proprietary products or vendors.
export function assignSeriesColors(
  names: readonly string[],
  fallback: readonly string[] = PALETTE,
): string[] {
  return names.map((_, i) => fallback[i % fallback.length])
}
