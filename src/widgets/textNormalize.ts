export interface TextItem {
  id?: string
  title?: string
  meta?: string
  body?: string
  tags?: string[]
  image?: string
  url?: string
}

// Feed items come from third-party sources (RSS, scraped articles), so
// hrefs are restricted to web URLs — anything else is dropped.
export function safeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!/^https?:\/\//i.test(trimmed)) return undefined
  return trimmed
}

export function normalize(data: unknown): TextItem[] {
  if (!data) return []

  // Single string
  if (typeof data === 'string') return [{ body: data }]

  // Single object — unwrap a top-level `items` array first (matches the
  // proto's TextPayload.items field). Otherwise treat the whole object
  // as one item.
  if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.items)) return normalize(obj.items)
    return [normalizeItem(obj)]
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
    id: obj.id != null ? String(obj.id) : undefined,
    title: obj.title != null ? String(obj.title) : undefined,
    meta: obj.meta ?? obj.source ?? obj.date ?? obj.author
      ? [obj.source, obj.author, obj.date].filter(Boolean).map(String).join(' · ')
      : undefined,
    body: obj.body ?? obj.content ?? obj.summary ?? obj.text
      ? String(obj.body ?? obj.content ?? obj.summary ?? obj.text)
      : undefined,
    tags: Array.isArray(obj.tags) ? obj.tags.map(String) : undefined,
    image: obj.image != null ? String(obj.image) :
           obj.image_url != null ? String(obj.image_url) :
           obj.thumbnail != null ? String(obj.thumbnail) : undefined,
    url: safeUrl(obj.url ?? obj.uri ?? obj.link ?? obj.href),
  }
}
