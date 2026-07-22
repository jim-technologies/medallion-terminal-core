import { useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import { localDate, safeUrl } from './textNormalize'
import { Empty } from './states'
import { normalizeAssetCatalog, type AssetCatalogItem } from './platformShapes'
import {
  CursorPager,
  cursorPageTokenKey,
  type CursorPaginationOptions,
} from './CursorPager'

interface AssetCatalogOptions extends CursorPaginationOptions {
  search?: boolean
  kind_filter?: boolean
  item_context?: {
    key?: string
    kind_key?: string
    owner_key?: string
  }
}

const KIND_ICON: Record<string, string> = {
  dataset: '▦',
  object_type: '◇',
  object: '◆',
  pipeline: '⇢',
  model: '◈',
  repository: '⌘',
  dashboard: '▤',
  document: '≡',
}

// Governed asset discovery for data-platform catalogs. Accepts the
// canonical AssetCatalogPayload and applies each item's context map on
// selection so detail, lineage, repository, and data widgets retarget
// together.
export function AssetCatalog({ data, options, widgetId }: WidgetProps) {
  const opts = (options ?? {}) as AssetCatalogOptions
  const { ctx, setCtx } = useDashboard()
  const catalog = useMemo(() => normalizeAssetCatalog(data), [data])
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<string>('all')
  const idKey = opts.item_context?.key ?? 'asset_id'
  const kindKey = opts.item_context?.kind_key ?? 'asset_kind'
  const ownerKey = opts.item_context?.owner_key
  const hasPagination = !!catalog.nextPageToken || !!ctx[cursorPageTokenKey(widgetId, opts)]

  const kinds = useMemo(
    () => [...new Set(catalog.items.map((item) => item.kind))].sort(),
    [catalog.items],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.items.filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false
      if (!q) return true
      const haystack = [
        item.id,
        item.name,
        item.kind,
        item.description,
        item.owner,
        item.status,
        ...item.tags,
        ...Object.values(item.metadata),
      ].filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [catalog.items, kind, query])

  const selectItem = (item: AssetCatalogItem) => {
    for (const [key, value] of Object.entries(item.context)) setCtx(key, value)

    if (!(idKey in item.context)) setCtx(idKey, item.id)
    if (!(kindKey in item.context)) setCtx(kindKey, item.kind)
    if (ownerKey && item.owner && !(ownerKey in item.context)) setCtx(ownerKey, item.owner)
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {(opts.search !== false || (opts.kind_filter !== false && kinds.length > 1)) && (
        <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0">
          {opts.search !== false && (
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assets…"
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
            />
          )}
          {opts.kind_filter !== false && kinds.length > 1 && (
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {['all', ...kinds].map((value) => (
                <button
                  key={value}
                  onClick={() => setKind(value)}
                  className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap ${
                    kind === value
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {humanize(value)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-600 shrink-0">
        <span>{filtered.length.toLocaleString()} shown</span>
        {catalog.total != null && <span>{catalog.total.toLocaleString()} total</span>}
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {catalog.items.length === 0 ? (
          <Empty>No assets</Empty>
        ) : filtered.length === 0 ? (
          <Empty>No matching assets</Empty>
        ) : (
          <div className="divide-y divide-zinc-800/70">
            {filtered.map((item) => {
              const url = safeUrl(item.url)
              const selected = ctx[idKey] === item.id
              const metadata = Object.entries(item.metadata)
                .filter(([, value]) => value == null || ['string', 'number', 'boolean'].includes(typeof value))
                .slice(0, 3)
              return (
                <div
                  key={`${item.kind}:${item.id}`}
                  className={`flex items-start gap-2 px-2 py-2.5 border-l-2 transition-colors ${
                    selected
                      ? 'border-sky-500 bg-sky-500/10'
                      : 'border-transparent hover:bg-zinc-800/30'
                  }`}
                >
                  <button
                    onClick={() => selectItem(item)}
                    className="flex-1 min-w-0 text-left group"
                    title={`Select ${item.name}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 text-center text-zinc-500 shrink-0" aria-hidden="true">
                        {KIND_ICON[item.kind] ?? '·'}
                      </span>
                      <span className="text-sm text-zinc-100 truncate group-hover:text-sky-300">
                        {item.name}
                      </span>
                      {item.status && (
                        <span className={`text-[9px] uppercase tracking-wider shrink-0 ${statusTone(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <div className="ml-7 mt-0.5 flex items-center gap-2 text-[10px] text-zinc-600 min-w-0">
                      <span className="font-mono truncate">{item.id}</span>
                      <span className="shrink-0">{humanize(item.kind)}</span>
                      {item.owner && <span className="truncate">owner {item.owner}</span>}
                    </div>
                    {item.description && (
                      <div className="ml-7 mt-1 text-xs text-zinc-500 line-clamp-2">
                        {item.description}
                      </div>
                    )}
                    {(metadata.length > 0 || item.updatedAt) && (
                      <div className="ml-7 mt-1 flex gap-x-3 gap-y-1 flex-wrap text-[10px] text-zinc-600">
                        {metadata.map(([key, value]) => (
                          <span key={key}>
                            {humanize(key)} <span className="text-zinc-400">{String(value)}</span>
                          </span>
                        ))}
                        {item.updatedAt && <span>updated <span className="text-zinc-400">{String(localDate(item.updatedAt))}</span></span>}
                      </div>
                    )}
                    {item.tags.length > 0 && (
                      <div className="ml-7 mt-1.5 flex gap-1 flex-wrap">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                  {url && (
                    <a
                      href={url}
                      {...(url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                      className="text-xs text-zinc-600 hover:text-sky-300 px-1 shrink-0"
                      title="Open asset page"
                    >
                      ↗
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {hasPagination && (
        <div className="pt-2 flex justify-end shrink-0">
          <CursorPager
            nextPageToken={catalog.nextPageToken}
            widgetId={widgetId}
            options={opts}
            ariaLabel="Asset catalog pages"
          />
        </div>
      )}
    </div>
  )
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase()
  if (/(healthy|ready|active|ok|published)/.test(normalized)) return 'text-emerald-400'
  if (/(warn|stale|draft|pending)/.test(normalized)) return 'text-amber-400'
  if (/(error|failed|deprecated|archived|blocked)/.test(normalized)) return 'text-red-400'
  return 'text-zinc-500'
}

function humanize(value: string): string {
  return value.replace(/_/g, ' ')
}
