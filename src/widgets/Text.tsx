import { useEffect, useRef, useState } from 'react'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

const FLASH_MS = 1500

export function Text({ data }: WidgetProps) {
  const items = normalize(data)

  // Flash-on-new-item. Tracks the set of identities we've rendered
  // before; items appearing for the first time get a brief sky tint.
  // Skips the first render so an initial fetch doesn't flash every
  // item at once — only deltas matter on a streaming news feed.
  const seenKeys = useRef<Set<string>>(new Set())
  const initialized = useRef(false)
  const [flashing, setFlashing] = useState<Set<string>>(new Set())
  useEffect(() => {
    const currentKeys = items.map(itemKey)
    if (!initialized.current) {
      initialized.current = true
      for (const k of currentKeys) seenKeys.current.add(k)
      return
    }
    const newKeys = currentKeys.filter(k => !seenKeys.current.has(k))
    for (const k of currentKeys) seenKeys.current.add(k)
    if (newKeys.length === 0) return
    setFlashing(prev => {
      const next = new Set(prev)
      for (const k of newKeys) next.add(k)
      return next
    })
    const t = setTimeout(() => {
      setFlashing(prev => {
        const next = new Set(prev)
        for (const k of newKeys) next.delete(k)
        return next
      })
    }, FLASH_MS)
    return () => clearTimeout(t)
  }, [items])

  if (items.length === 0) {
    return <Empty>No content</Empty>
  }

  return (
    <div className="overflow-auto h-full space-y-3">
      {items.map((item, i) => {
        const key = itemKey(item)
        const flashClass = flashing.has(key) ? 'bg-sky-500/5' : ''
        return (
          <article
            key={i}
            className={`flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${flashClass}`}
          >
            <div className="flex-1 min-w-0">
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
            </div>
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="w-14 h-14 rounded object-cover shrink-0 bg-zinc-800"
                loading="lazy"
              />
            )}
          </article>
        )
      })}
    </div>
  )
}

interface TextItem {
  id?: string
  title?: string
  meta?: string
  body?: string
  tags?: string[]
  image?: string
}

// Stable-ish identity for flash tracking. Prefer an explicit `id` from
// the backend; fall back to a title+body-prefix fingerprint that's
// almost always unique within a feed window.
function itemKey(item: TextItem): string {
  if (item.id) return `id:${item.id}`
  return `t:${item.title ?? ''}|b:${(item.body ?? '').slice(0, 60)}`
}

function normalize(data: unknown): TextItem[] {
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
  }
}
