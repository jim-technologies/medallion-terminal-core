import { Empty } from './states'
import type { WidgetProps } from '../types/template'

// Plain image renderer. Use for AI-generated visualisations
// (matplotlib SVG, model diagrams), external infographics, or
// any URL the dashboard wants to embed as a still image.
//
// Data forms accepted (all yield {url, alt}):
//   "https://..."                                    → bare URL
//   { url: "https://...", alt?: "..." }              → manual shape
//   { url: "https://...", label?: "..." }            → EmbedPayload (proto)
export function Image({ data }: WidgetProps) {
  const { url, alt } = parse(data)
  if (!url) return <Empty>No image</Empty>
  return (
    <div className="h-full w-full flex items-center justify-center">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  )
}

function parse(data: unknown): { url: string | undefined; alt: string } {
  if (typeof data === 'string') return { url: data, alt: '' }
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    // Prefer EmbedPayload's `label`; fall back to `alt` for the
    // hand-authored shape.
    const alt = typeof d.label === 'string' ? d.label
      : typeof d.alt === 'string' ? d.alt
      : ''
    return {
      url: typeof d.url === 'string' ? d.url : undefined,
      alt,
    }
  }
  return { url: undefined, alt: '' }
}

