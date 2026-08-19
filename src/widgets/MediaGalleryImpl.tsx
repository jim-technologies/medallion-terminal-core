import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import {
  useAssetOpen,
  type AssetOpenRequest,
} from '../core/AssetOpen'
import { handleModalKeyDown, useModalFocus } from '../components/utils'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'
import {
  CursorPager,
  cursorPageTokenKey,
  type CursorPaginationOptions,
} from './CursorPager'
import {
  filterMediaItems,
  formatMediaDate,
  formatMediaDuration,
  groupMediaItems,
  normalizeMediaLibrary,
  type MediaCollectionData,
  type MediaGroupMode,
  type MediaItemData,
  type MediaKind,
} from './mediaShape'

interface MediaGalleryOptions extends CursorPaginationOptions {
  search?: boolean
  kind_filter?: boolean
  collection_filter?: boolean
  group_by?: MediaGroupMode
  density?: 'compact' | 'comfortable'
  autoplay_videos?: boolean
  loop_videos?: boolean
  show_details?: boolean
  // Enabled automatically when Dashboard.resolveAssetIntent is present.
  // Set false when this gallery must remain native-viewer only.
  open_with?: boolean
  media_context?: {
    key?: string
    kind_key?: string
  }
}

type KindFilter = 'all' | MediaKind | 'favorite'

// Timeline/album presentation for photos and videos. Storage, upload,
// sharing, deletion, face recognition, and policy remain backend concerns;
// this widget consumes authorized media URLs and provides the reusable
// browsing/viewing projection.
export function MediaGalleryImpl({ data, options, widgetId }: WidgetProps) {
  const opts = (options ?? {}) as MediaGalleryOptions
  const { ctx, setCtx } = useDashboard()
  const {
    available: assetApplicationsAvailable,
    openAsset,
    openWith,
  } = useAssetOpen()
  const library = useMemo(() => normalizeMediaLibrary(data), [data])
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('all')
  const [collectionId, setCollectionId] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => filterMediaItems(library.items, { query, kind, collectionId }),
    [collectionId, kind, library.items, query],
  )
  const groups = useMemo(
    () => groupMediaItems(filtered, opts.group_by ?? 'day'),
    [filtered, opts.group_by],
  )
  const selectedIndex = selectedId == null
    ? -1
    : filtered.findIndex(item => item.id === selectedId)
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : undefined
  const selectedContextKey = opts.media_context?.key ?? 'media_id'
  const selectedKindKey = opts.media_context?.kind_key ?? 'media_kind'
  const hasPagination = !!library.nextPageToken || !!ctx[cursorPageTokenKey(widgetId, opts)]
  const openWithEnabled = assetApplicationsAvailable && opts.open_with !== false

  const requestFor = useCallback((item: MediaItemData): AssetOpenRequest => ({
    asset: {
      id: item.id,
      name: item.title,
      kind: item.kind,
      contentType: item.contentType ?? (item.kind === 'video' ? 'video/*' : 'image/*'),
      url: item.url,
      metadata: {
        ...item.metadata,
        capturedAt: item.capturedAt,
        createdAt: item.createdAt,
        width: item.width,
        height: item.height,
        durationSeconds: item.durationSeconds,
        collectionIds: item.collectionIds,
      },
    },
    intent: item.kind === 'video' ? 'play' : 'view',
    source: { component: 'media_gallery', widgetId },
  }), [widgetId])

  const openItem = useCallback((item: MediaItemData) => {
    for (const [key, value] of Object.entries(item.context)) setCtx(key, value)
    if (!(selectedContextKey in item.context)) setCtx(selectedContextKey, item.id)
    if (!(selectedKindKey in item.context)) setCtx(selectedKindKey, item.kind)
    if (openWithEnabled) {
      void openAsset(
        requestFor(item),
        {
          native: () => setSelectedId(item.id),
          nativeLabel: item.kind === 'video' ? 'Native video player' : 'Native photo viewer',
        },
      )
    } else {
      setSelectedId(item.id)
    }
  }, [
    openAsset,
    openWithEnabled,
    requestFor,
    selectedContextKey,
    selectedKindKey,
    setCtx,
  ])

  const moveSelection = useCallback((delta: number) => {
    if (filtered.length < 2 || selectedIndex < 0) return
    const next = (selectedIndex + delta + filtered.length) % filtered.length
    openItem(filtered[next])
  }, [filtered, openItem, selectedIndex])

  useEffect(() => {
    if (selectedId && !library.items.some(item => item.id === selectedId)) {
      setSelectedId(null)
    }
  }, [library.items, selectedId])

  const hasFavorites = library.items.some(item => item.favorite)
  const showFilters = opts.kind_filter !== false
  const tileMinimum = opts.density === 'compact' ? 104 : 142

  return (
    <div className="h-full min-h-0 flex flex-col relative">
      <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {opts.search !== false && (
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search media…"
              aria-label="Search media"
              className="min-w-0 flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
            />
          )}
          {opts.collection_filter !== false && library.collections.length > 0 && (
            <select
              value={collectionId}
              onChange={event => setCollectionId(event.target.value)}
              aria-label="Filter by collection"
              className="max-w-[12rem] bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-600"
            >
              <option value="all">All collections</option>
              {library.collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}{collection.itemCount != null ? ` (${collection.itemCount})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {showFilters && (
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {([
              ['all', 'All'],
              ['image', 'Photos'],
              ['video', 'Videos'],
              ...(hasFavorites ? [['favorite', 'Favorites']] : []),
            ] as Array<[KindFilter, string]>).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setKind(value)}
                aria-pressed={kind === value}
                className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap border ${
                  kind === value
                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-600 shrink-0">
        <span>{filtered.length.toLocaleString()} shown</span>
        {library.total != null && <span>{library.total.toLocaleString()} total</span>}
      </div>

      <div className="flex-1 min-h-0 overflow-auto pr-1">
        {library.items.length === 0 ? (
          <Empty>No photos or videos</Empty>
        ) : filtered.length === 0 ? (
          <Empty>No matching media</Empty>
        ) : (
          <div className="space-y-4 pb-1">
            {groups.map(group => (
              <section key={group.key} aria-labelledby={`media-group-${cssId(group.key)}`}>
                {(opts.group_by ?? 'day') !== 'none' && (
                  <div
                    id={`media-group-${cssId(group.key)}`}
                    className="sticky top-0 z-10 py-1.5 bg-zinc-950/95 backdrop-blur-sm text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500"
                  >
                    {group.label}
                  </div>
                )}
                <div
                  className="grid gap-1.5"
                  style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${tileMinimum}px, 1fr))` }}
                >
                  {group.items.map(item => (
                    <MediaTile
                      key={item.id}
                      item={item}
                      selected={ctx[selectedContextKey] === item.id}
                      onOpen={() => openItem(item)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {hasPagination && (
        <div className="pt-2 flex justify-end shrink-0">
          <CursorPager
            nextPageToken={library.nextPageToken}
            widgetId={widgetId}
            options={opts}
            ariaLabel="Media pages"
          />
        </div>
      )}

      {selected && (
        <MediaViewer
          key={selected.id}
          item={selected}
          collections={library.collections}
          index={selectedIndex}
          count={filtered.length}
          autoplay={opts.autoplay_videos === true}
          loop={opts.loop_videos === true}
          showDetails={opts.show_details !== false}
          onClose={() => setSelectedId(null)}
          onPrevious={() => moveSelection(-1)}
          onNext={() => moveSelection(1)}
          onOpenWith={openWithEnabled
            ? () => {
                void openWith(
                  requestFor(selected),
                  {
                    native: () => {},
                    nativeLabel: selected.kind === 'video'
                      ? 'Native video player'
                      : 'Native photo viewer',
                  },
                )
              }
            : undefined}
        />
      )}
    </div>
  )
}

function MediaTile({
  item,
  selected,
  onOpen,
}: {
  item: MediaItemData
  selected: boolean
  onOpen: () => void
}) {
  const duration = formatMediaDuration(item.durationSeconds)
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative aspect-square overflow-hidden rounded-sm border text-left bg-zinc-900 ${
        selected
          ? 'border-sky-400 ring-1 ring-sky-400/50'
          : 'border-zinc-800 hover:border-zinc-600'
      }`}
      aria-label={`Open ${item.kind === 'video' ? 'video' : 'photo'} ${item.title}`}
      title={item.title}
    >
      <MediaThumbnail item={item} />
      <div className="absolute inset-x-0 bottom-0 pt-8 pb-1.5 px-2 bg-gradient-to-t from-black/85 to-transparent">
        <div className="text-[11px] font-medium text-zinc-100 truncate">{item.title}</div>
      </div>
      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
        {item.kind === 'video' && (
          <span className="px-1.5 py-0.5 rounded-sm bg-black/70 text-[9px] uppercase tracking-wider text-zinc-100">
            ▶{duration ? ` ${duration}` : ''}
          </span>
        )}
      </div>
      {item.favorite && (
        <span
          className="absolute top-1.5 right-1.5 text-amber-300 drop-shadow"
          aria-label="Favorite"
          title="Favorite"
        >
          ★
        </span>
      )}
    </button>
  )
}

function MediaThumbnail({ item }: { item: MediaItemData }) {
  const [failed, setFailed] = useState(false)
  const src = item.thumbnailUrl ?? (item.kind === 'image' ? item.url : undefined)

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(63_63_70/0.55),transparent_45%),linear-gradient(135deg,rgb(24_24_27),rgb(9_9_11))]">
        <span className="text-xl text-zinc-600" aria-hidden="true">
          {item.kind === 'video' ? '▶' : '▧'}
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  )
}

function MediaViewer({
  item,
  collections,
  index,
  count,
  autoplay,
  loop,
  showDetails,
  onClose,
  onPrevious,
  onNext,
  onOpenWith,
}: {
  item: MediaItemData
  collections: MediaCollectionData[]
  index: number
  count: number
  autoplay: boolean
  loop: boolean
  showDetails: boolean
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onOpenWith?: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const collectionNames = item.collectionIds
    .map(id => collections.find(collection => collection.id === id)?.name ?? id)
  const details = Object.entries(item.metadata)
    .filter(([, value]) => value == null || ['string', 'number', 'boolean'].includes(typeof value))
    .slice(0, 10)

  useModalFocus(true, dialogRef, closeRef)

  const closeFromBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/98 text-zinc-100"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      tabIndex={-1}
      onClick={closeFromBackdrop}
      onKeyDown={(event) => {
        handleModalKeyDown(event, dialogRef, true, onClose)
        if (event.defaultPrevented) return
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          onNext()
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          onPrevious()
        }
      }}
    >
      <div className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900/95 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{item.title}</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            {item.kind}{item.favorite ? ' · favorite' : ''}
          </div>
        </div>
        <span className="text-xs tabular-nums text-zinc-500">
          {index + 1} / {count}
        </span>
        {onOpenWith && (
          <button
            type="button"
            onClick={onOpenWith}
            className="text-xs text-zinc-400 hover:text-zinc-100"
          >
            Open with…
          </button>
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-sky-400 hover:text-sky-300"
        >
          Open original
        </a>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="text-xl leading-none text-zinc-400 hover:text-zinc-100 px-1"
          aria-label="Close media viewer"
        >
          ×
        </button>
      </div>

      <div className="flex-1 min-h-0 flex" onClick={closeFromBackdrop}>
        <div className="relative flex-1 min-w-0 flex items-center justify-center p-4 bg-black/40 overflow-hidden">
          {loading && !failed && (
            <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-wider text-zinc-600">
              Loading media…
            </div>
          )}
          {failed ? (
            <div className="flex flex-col items-center gap-2 text-sm text-zinc-500">
              <span>Preview unavailable</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                Open original
              </a>
            </div>
          ) : item.kind === 'video' ? (
            <video
              src={item.url}
              poster={item.thumbnailUrl}
              controls
              autoPlay={autoplay}
              loop={loop}
              playsInline
              preload="metadata"
              onLoadedMetadata={() => setLoading(false)}
              onError={() => { setLoading(false); setFailed(true) }}
              className="max-w-full max-h-full bg-black shadow-2xl"
            />
          ) : (
            <img
              src={item.url}
              alt={item.title}
              decoding="async"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setFailed(true) }}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          )}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={onPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white"
                aria-label="Previous media"
                title="Previous (←)"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white"
                aria-label="Next media"
                title="Next (→)"
              >
                ›
              </button>
            </>
          )}
        </div>

        {showDetails && (
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 border-l border-zinc-800 bg-zinc-900/70 p-4 overflow-auto">
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-4">Details</div>
            <dl className="space-y-3 text-xs">
              <Detail label="Captured" value={formatMediaDate(item.capturedAt ?? item.createdAt)} />
              <Detail label="Type" value={item.contentType ?? item.kind} />
              <Detail
                label="Dimensions"
                value={item.width && item.height ? `${item.width.toLocaleString()} × ${item.height.toLocaleString()}` : undefined}
              />
              <Detail label="Duration" value={formatMediaDuration(item.durationSeconds)} />
              <Detail label="Collections" value={collectionNames.length > 0 ? collectionNames.join(', ') : undefined} />
              {details.map(([key, value]) => (
                <Detail key={key} label={humanize(key)} value={value == null ? '—' : String(value)} />
              ))}
            </dl>
            {item.description && (
              <p className="mt-5 text-xs leading-relaxed text-zinc-400">{item.description}</p>
            )}
            {item.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-wider text-zinc-600">{label}</dt>
      <dd className="mt-0.5 text-zinc-300 break-words">{value}</dd>
    </div>
  )
}

function cssId(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-')
}

function humanize(value: string): string {
  return value.replace(/[_-]+/g, ' ')
}
