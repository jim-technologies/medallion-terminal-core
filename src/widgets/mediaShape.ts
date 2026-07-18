// Canonical media-library normalization. Connect JSON uses lowerCamelCase,
// while hand-authored templates and simple HTTP backends often use proto
// snake_case (or familiar photo-library aliases). Keep that tolerance here so
// the renderer can operate on one small, predictable model.

export type MediaKind = 'image' | 'video'
export type MediaGroupMode = 'day' | 'month' | 'none'

export interface MediaItemData {
  id: string
  title: string
  kind: MediaKind
  url: string
  thumbnailUrl?: string
  description?: string
  capturedAt?: string
  createdAt?: string
  contentType?: string
  width?: number
  height?: number
  durationSeconds?: number
  favorite: boolean
  tags: string[]
  collectionIds: string[]
  metadata: Record<string, unknown>
  context: Record<string, string>
}

export interface MediaCollectionData {
  id: string
  name: string
  coverUrl?: string
  itemCount?: number
  context: Record<string, string>
}

export interface MediaLibraryData {
  items: MediaItemData[]
  collections: MediaCollectionData[]
  total?: number
  nextPageToken?: string
}

export interface MediaFilter {
  query?: string
  kind?: 'all' | MediaKind | 'favorite'
  collectionId?: string
}

export interface MediaGroup {
  key: string
  label: string
  items: MediaItemData[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function record(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

function optionalString(value: unknown): string | undefined {
  if (value == null) return undefined
  const text = String(value).trim()
  return text || undefined
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function positiveNumber(value: unknown): number | undefined {
  const number = finiteNumber(value)
  return number != null && number >= 0 ? number : undefined
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.map(String).map(entry => entry.trim()).filter(Boolean))]
}

function stringMap(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry != null)
      .map(([key, entry]) => [key, String(entry)]),
  )
}

// Media URLs are rendered directly by native image/video elements. Restrict
// them to web or host-relative locations so malformed data cannot introduce
// javascript:, file:, or protocol-relative URLs.
export function safeMediaUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const url = value.trim()
  if (/^https?:\/\//i.test(url)) return url
  if (/^\/(?!\/)/.test(url)) return url
  return undefined
}

function mediaKind(value: unknown, contentType: string | undefined, url: string): MediaKind {
  if (value === 2) return 'video'
  if (value === 1) return 'image'

  const explicit = String(value ?? '').toLowerCase()
  if (explicit.includes('video') || explicit === 'movie') return 'video'
  if (explicit.includes('image') || explicit.includes('photo')) return 'image'
  if (contentType?.toLowerCase().startsWith('video/')) return 'video'
  if (/\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(url)) return 'video'
  return 'image'
}

function titleFromUrl(url: string): string {
  const path = url.split(/[?#]/, 1)[0]
  const tail = path.split('/').filter(Boolean).pop()
  if (!tail) return 'Untitled media'
  try {
    return decodeURIComponent(tail)
  } catch {
    return tail
  }
}

function normalizeItem(value: unknown): MediaItemData | null {
  if (!isRecord(value)) return null
  const url = safeMediaUrl(value.url ?? value.mediaUrl ?? value.media_url ?? value.src)
  if (!url) return null

  const contentType = optionalString(value.contentType ?? value.content_type ?? value.mimeType ?? value.mime_type)
  const id = optionalString(value.id ?? value.mediaId ?? value.media_id) ?? url
  const title = optionalString(value.title ?? value.name ?? value.label ?? value.filename) ?? titleFromUrl(url)

  return {
    id,
    title,
    kind: mediaKind(value.kind ?? value.type ?? value.mediaType ?? value.media_type, contentType, url),
    url,
    thumbnailUrl: safeMediaUrl(
      value.thumbnailUrl ?? value.thumbnail_url ?? value.thumbnail ?? value.posterUrl ?? value.poster_url ?? value.poster,
    ),
    description: optionalString(value.description ?? value.caption),
    capturedAt: optionalString(
      value.capturedAt ?? value.captured_at ?? value.takenAt ?? value.taken_at ?? value.dateTaken ?? value.date_taken,
    ),
    createdAt: optionalString(value.createdAt ?? value.created_at ?? value.uploadedAt ?? value.uploaded_at),
    contentType,
    width: positiveNumber(value.width),
    height: positiveNumber(value.height),
    durationSeconds: positiveNumber(
      value.durationSeconds ?? value.duration_seconds ?? value.duration,
    ),
    favorite: value.favorite === true || value.isFavorite === true || value.is_favorite === true,
    tags: stringArray(value.tags),
    collectionIds: stringArray(
      value.collectionIds ?? value.collection_ids ?? value.albumIds ?? value.album_ids ?? value.albums,
    ),
    metadata: record(value.metadata),
    context: stringMap(value.context),
  }
}

function normalizeCollection(value: unknown): MediaCollectionData | null {
  if (!isRecord(value)) return null
  const id = optionalString(value.id ?? value.collectionId ?? value.collection_id ?? value.albumId ?? value.album_id)
  if (!id) return null
  return {
    id,
    name: optionalString(value.name ?? value.title ?? value.label) ?? humanize(id),
    coverUrl: safeMediaUrl(value.coverUrl ?? value.cover_url ?? value.thumbnailUrl ?? value.thumbnail_url),
    itemCount: positiveNumber(value.itemCount ?? value.item_count ?? value.count),
    context: stringMap(value.context),
  }
}

export function normalizeMediaLibrary(data: unknown): MediaLibraryData {
  const root = Array.isArray(data) ? { items: data } : record(data)
  const rawItems = Array.isArray(root.items)
    ? root.items
    : Array.isArray(root.media)
      ? root.media
      : Array.isArray(root.assets)
        ? root.assets
        : []
  const items = rawItems.map(normalizeItem).filter((item): item is MediaItemData => item !== null)

  const rawCollections = Array.isArray(root.collections)
    ? root.collections
    : Array.isArray(root.albums)
      ? root.albums
      : []
  const collections = rawCollections
    .map(normalizeCollection)
    .filter((collection): collection is MediaCollectionData => collection !== null)
  const declared = new Set(collections.map(collection => collection.id))

  // Simple backends can place collection ids directly on items without
  // declaring a separate catalog. Surface those ids with readable labels.
  for (const id of new Set(items.flatMap(item => item.collectionIds))) {
    if (!declared.has(id)) {
      collections.push({
        id,
        name: humanize(id),
        itemCount: items.filter(item => item.collectionIds.includes(id)).length,
        context: {},
      })
    }
  }

  return {
    items: sortMediaItems(items),
    collections,
    total: positiveNumber(root.total),
    nextPageToken: optionalString(root.nextPageToken ?? root.next_page_token),
  }
}

export function sortMediaItems(items: readonly MediaItemData[]): MediaItemData[] {
  return [...items].sort((left, right) => {
    const time = mediaTimestamp(right) - mediaTimestamp(left)
    if (time !== 0) return time
    return left.title.localeCompare(right.title)
  })
}

export function filterMediaItems(
  items: readonly MediaItemData[],
  filter: MediaFilter,
): MediaItemData[] {
  const query = filter.query?.trim().toLowerCase() ?? ''
  const kind = filter.kind ?? 'all'
  const collectionId = filter.collectionId && filter.collectionId !== 'all'
    ? filter.collectionId
    : undefined

  return items.filter((item) => {
    if (kind === 'favorite' && !item.favorite) return false
    if (kind !== 'all' && kind !== 'favorite' && item.kind !== kind) return false
    if (collectionId && !item.collectionIds.includes(collectionId)) return false
    if (!query) return true

    return [
      item.id,
      item.title,
      item.description,
      item.contentType,
      ...item.tags,
      ...Object.values(item.metadata),
    ]
      .filter(value => value != null)
      .map(String)
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
}

export function groupMediaItems(
  items: readonly MediaItemData[],
  mode: MediaGroupMode = 'day',
): MediaGroup[] {
  const sorted = sortMediaItems(items)
  if (mode === 'none') {
    return sorted.length > 0 ? [{ key: 'all', label: 'All media', items: sorted }] : []
  }

  const groups = new Map<string, MediaItemData[]>()
  for (const item of sorted) {
    const date = item.capturedAt ?? item.createdAt
    const match = date?.match(/^(\d{4})-(\d{2})-(\d{2})/)
    const key = !match
      ? 'undated'
      : mode === 'month'
        ? `${match[1]}-${match[2]}`
        : `${match[1]}-${match[2]}-${match[3]}`
    const group = groups.get(key) ?? []
    group.push(item)
    groups.set(key, group)
  }

  return [...groups].map(([key, groupedItems]) => ({
    key,
    label: mediaGroupLabel(key, mode),
    items: groupedItems,
  }))
}

export function formatMediaDuration(seconds: number | undefined): string | undefined {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return undefined
  const rounded = Math.round(seconds)
  const hours = Math.floor(rounded / 3600)
  const minutes = Math.floor((rounded % 3600) / 60)
  const remainder = rounded % 60
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${minutes}:${String(remainder).padStart(2, '0')}`
}

export function formatMediaDate(value: string | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function mediaTimestamp(item: MediaItemData): number {
  const parsed = Date.parse(item.capturedAt ?? item.createdAt ?? '')
  return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY
}

function mediaGroupLabel(key: string, mode: MediaGroupMode): string {
  if (key === 'undated') return 'Undated'
  const date = new Date(`${key}${mode === 'month' ? '-01' : ''}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return key
  return new Intl.DateTimeFormat(undefined, mode === 'month'
    ? { month: 'long', year: 'numeric', timeZone: 'UTC' }
    : { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
  ).format(date)
}

function humanize(value: string): string {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}
