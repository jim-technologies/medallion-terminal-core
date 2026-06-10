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

// Brand colors for series named after AI models (and the two reference
// series on model-comparison charts). Grok's brand black is invisible on
// the dark chart background, so it gets the x.ai inverse (white).
const BRAND_SERIES: readonly [RegExp, string][] = [
  [/claude|anthropic|opus|sonnet|haiku|fable/i, '#d97757'], // Anthropic orange
  [/chatgpt|openai|gpt/i, '#10a37f'],                       // OpenAI green
  [/gemini/i, '#4285f4'],                                   // Google blue
  [/grok|xai/i, '#fafafa'],                                 // x.ai (inverted)
  [/deepseek/i, '#4d6bfe'],
  [/qwen/i, '#8b5cf6'],
  [/kimi|moonshot/i, '#f472b6'],
  [/glm|zhipu/i, '#22d3ee'],
  [/llama|meta ai/i, '#0668e1'],
  [/mistral/i, '#ff7000'],
  [/market/i, '#38bdf8'],                                   // site accent
  [/\belo\b/i, '#71717a'],                                  // muted baseline
]

export function brandSeriesColor(name: string | undefined): string | null {
  if (!name) return null
  for (const [pattern, color] of BRAND_SERIES) {
    if (pattern.test(name)) return color
  }
  return null
}

// Shift a hex color toward white (factor > 0) or black (factor < 0).
function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16)
  const channel = (c: number) =>
    Math.round(
      factor >= 0 ? c + (255 - c) * factor : c * (1 + factor),
    )
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(channel)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// Stable colors for a chart's series: brand colors for recognised model
// names (duplicates of the same brand get progressive shade variants so
// e.g. two Claude entrants stay distinguishable), fallback palette by
// original index for everything else.
export function assignSeriesColors(
  names: readonly string[],
  fallback: readonly string[] = PALETTE,
): string[] {
  const seen = new Map<string, number>()
  return names.map((name, i) => {
    const brand = brandSeriesColor(name)
    if (!brand) return fallback[i % fallback.length]
    const dupes = seen.get(brand) ?? 0
    seen.set(brand, dupes + 1)
    if (dupes === 0) return brand
    // Light bases step darker; dark bases step lighter.
    const luminous = parseInt(brand.slice(1, 3), 16) > 0xb0
    return shade(brand, (luminous ? -0.22 : 0.25) * dupes)
  })
}
