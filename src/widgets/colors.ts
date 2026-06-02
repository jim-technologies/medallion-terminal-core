// Shared color tokens for widgets that fill / stroke / tint by category.
//
// `SEMANTIC` maps the well-known severity / category names to brand colors.
// Used wherever a payload field carries a string color name (gauge bands,
// distribution slices, treemap nodes, bar chart bars, scatter points).
// All hex; consumers wrap with opacity where needed.
//
// `PALETTE` is the cycling fallback for "give me distinct colors for N
// items" cases — same palette keeps cross-widget views feeling consistent.

export const SEMANTIC: Record<string, string> = {
  ok:     '#10b981',
  warn:   '#f59e0b',
  danger: '#ef4444',
  error:  '#ef4444',
  info:   '#0ea5e9',
  muted:  '#71717a',
}

export const PALETTE: readonly string[] = [
  '#0ea5e9', '#10b981', '#f59e0b', '#a78bfa',
  '#f472b6', '#fbbf24', '#22d3ee', '#fb7185',
]

// Shared Recharts tooltip styling. Every chart widget renders the same
// dark popover, so the inline `contentStyle` lived duplicated across each
// one — centralized here to keep them visually identical.
export const TOOLTIP_STYLE = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: 6,
  fontSize: 12,
  color: '#fafafa',
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
