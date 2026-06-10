import { useEffect, useRef, useState } from 'react'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'
import { normalize, type TextItem } from './textNormalize'

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
              {(item.title || item.url) && (
                <h4 className="text-sm font-medium text-zinc-100 mb-1 leading-snug">
                  {item.url ? (
                    <a
                      href={item.url}
                      {...(item.url.startsWith('/')
                        ? {}
                        : { target: '_blank', rel: 'noopener noreferrer' })}
                      className="hover:text-sky-400 hover:underline"
                    >
                      {item.title || hostLabel(item.url)}
                      <span className="ml-1 text-xs text-zinc-500" aria-hidden="true">{item.url.startsWith('/') ? '→' : '↗'}</span>
                    </a>
                  ) : (
                    item.title
                  )}
                </h4>
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

// Stable-ish identity for flash tracking. Prefer an explicit `id` from
// the backend; fall back to a title+body-prefix fingerprint that's
// almost always unique within a feed window.
function itemKey(item: TextItem): string {
  if (item.id) return `id:${item.id}`
  return `t:${item.title ?? ''}|b:${(item.body ?? '').slice(0, 60)}`
}

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
