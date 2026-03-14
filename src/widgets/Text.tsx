import type { WidgetProps } from '../types/template'

export function Text({ data }: WidgetProps) {
  const items = normalize(data)

  if (items.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No content</div>
  }

  return (
    <div className="overflow-auto h-full space-y-3">
      {items.map((item, i) => (
        <article key={i} className="border-b border-zinc-800/60 pb-3 last:border-0">
          {item.title && (
            <h4 className="text-sm font-medium text-zinc-100 mb-1 leading-snug">{item.title}</h4>
          )}
          {item.meta && (
            <div className="text-xs text-zinc-500 mb-1.5">{item.meta}</div>
          )}
          {item.body && (
            <p className="text-sm text-zinc-300 leading-relaxed">{item.body}</p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {item.tags.map((tag, j) => (
                <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

interface TextItem {
  title?: string
  meta?: string
  body?: string
  tags?: string[]
}

function normalize(data: unknown): TextItem[] {
  if (!data) return []

  // Single string
  if (typeof data === 'string') return [{ body: data }]

  // Single object
  if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
    return [normalizeItem(data as Record<string, unknown>)]
  }

  // Array
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') return { body: item }
      if (typeof item === 'object' && item !== null) return normalizeItem(item as Record<string, unknown>)
      return { body: String(item) }
    })
  }

  return []
}

function normalizeItem(obj: Record<string, unknown>): TextItem {
  return {
    title: obj.title != null ? String(obj.title) : undefined,
    meta: obj.meta ?? obj.source ?? obj.date ?? obj.author
      ? [obj.source, obj.author, obj.date].filter(Boolean).map(String).join(' \u00B7 ')
      : undefined,
    body: obj.body ?? obj.content ?? obj.summary ?? obj.text
      ? String(obj.body ?? obj.content ?? obj.summary ?? obj.text)
      : undefined,
    tags: Array.isArray(obj.tags) ? obj.tags.map(String) : undefined,
  }
}
