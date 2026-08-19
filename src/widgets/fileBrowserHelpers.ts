// Pure helpers extracted from FileBrowser so the widget module exports
// only the component (WidgetRegistry's lazy loader requires homogeneous
// ComponentType<WidgetProps> module shape).
//
// medallion-terminal-core is intentionally generic — these helpers have no
// knowledge of any specific backend identifier format or protocol sentinel.
// Stable IDs are preferred when supplied; paths remain the compatibility
// identity for filesystem-shaped backends.

import { parseConnectEnvelopes } from '../core/connectFraming'

// errorMessage narrows an unknown thrown value to a printable string.
// Catch blocks in TypeScript receive `unknown`; this avoids the
// `(err as Error).message` cast that hides non-Error throws.
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

/** Generic object entry accepted by the FileBrowser widget. */
export interface FileBrowserEntry {
  /** Preferred stable host object ID. */
  id?: string
  /** Legacy stable-ID alias. New integrations should prefer `id`. */
  object_id?: string
  /** Semantic object kind. Authoritative when it names a known media kind. */
  kind?: string
  /** Human-readable entry name. */
  name?: string
  /** Content size in bytes. */
  size_bytes?: number
  /** Declared MIME content type. Preferred over filename extensions. */
  content_type?: string
  /** Last-modified timestamp supplied by the host. */
  modified_at?: string
  /** Explicit container status, preferred over `kind` inference. */
  is_container?: boolean
  /** Passive host capabilities for presentation and intent decisions. */
  capabilities?: string[]
  /** Passive link target metadata. Terminal Core never resolves the link. */
  symlink_target_id?: string
  /** Additional host metadata forwarded to asset-open resolution. */
  metadata?: Record<string, unknown>
  /**
   * Full path within the namespace. When omitted, FileBrowser derives a path
   * from the current directory and `name`.
   */
  path?: string
}

export function isFolder(e: FileBrowserEntry): boolean {
  if (typeof e.is_container === 'boolean') return e.is_container
  const k = (e.kind ?? '').toString().toUpperCase()
  return k === 'FOLDER'
    || k === 'KIND_FOLDER'
    || k === 'DIRECTORY'
    || k === 'KIND_DIRECTORY'
    || k === 'CONTAINER'
    || k === 'KIND_CONTAINER'
}

/**
 * Stable presentation identity. Object IDs win, then an authoritative entry
 * path, then the path derived from the current directory and name.
 */
export function fileEntryIdentity(e: FileBrowserEntry, parentPath = ''): string {
  const objectId = e.id ?? e.object_id
  if (objectId) return `id:${objectId}`
  const path = e.path || joinPath(parentPath, e.name ?? '')
  if (path) return `path:${path}`
  return `entry:${e.kind ?? ''}:${e.name ?? ''}`
}

export function normalizeEntries(data: unknown): FileBrowserEntry[] {
  const rows = pickRows(data)
  if (!rows) return []
  return rows as FileBrowserEntry[]
}

function pickRows(data: unknown): unknown[] | null {
  if (!data) return null
  if (Array.isArray(data)) return data
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.entries)) return obj.entries
    if (Array.isArray(obj.rows)) return obj.rows
  }
  return null
}

export function sortEntries(entries: FileBrowserEntry[]): FileBrowserEntry[] {
  const folders = entries.filter(isFolder).sort(byName)
  const files = entries.filter((e) => !isFolder(e)).sort(byName)
  return [...folders, ...files]
}

function byName(a: FileBrowserEntry, b: FileBrowserEntry): number {
  return (a.name ?? '').localeCompare(b.name ?? '')
}

export function splitPath(p: string): string[] {
  return p ? p.split('/').filter(Boolean) : []
}

// joinPath builds a child path under `dir`. Strips leading/trailing
// slashes so callers don't have to be careful. Empty `dir` returns
// just `name` so root-level entries don't get a leading slash.
//
//   joinPath('', 'foo.txt')           → 'foo.txt'
//   joinPath('Photos', '2024')        → 'Photos/2024'
//   joinPath('/Photos/', '/birthday') → 'Photos/birthday'
export function joinPath(dir: string, name: string): string {
  const d = (dir ?? '').replace(/^\/+|\/+$/g, '')
  const n = (name ?? '').replace(/^\/+|\/+$/g, '')
  if (!d) return n
  if (!n) return d
  return d + '/' + n
}

export function humanSize(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let u = 0
  let v = n
  while (v >= 1024 && u < units.length - 1) {
    v /= 1024
    u++
  }
  return `${u === 0 ? v.toFixed(0) : v.toFixed(1)} ${units[u]}`
}

// playableKinds is the set of preview kinds that have a `ended` event and
// make sense in an auto-advancing playlist. Images, PDFs, plain text etc.
// don't time-out; they don't belong in the auto-advance queue.
const playablePreviewKinds = new Set(['audio', 'video'])

// navigablePreviewKinds is the superset used for keyboard ← → navigation
// in the overlay. Images join the queue so the user can flip through
// photos the same way they advance music tracks.
const navigablePreviewKinds = new Set(['audio', 'video', 'image'])

// playableQueue filters entries for the auto-advance path (audio/video
// onEnded). Same natural sort order as the file table.
export function playableQueue(entries: FileBrowserEntry[]): FileBrowserEntry[] {
  return entries.filter((e) => {
    const k = previewKind(e.content_type, e.name, e.kind)
    return k !== null && playablePreviewKinds.has(k)
  })
}

// navigableQueue is the queue keyboard arrows + the toolbar prev/next
// buttons walk. Includes images so the overlay doubles as a slideshow.
export function navigableQueue(entries: FileBrowserEntry[]): FileBrowserEntry[] {
  return entries.filter((e) => {
    const k = previewKind(e.content_type, e.name, e.kind)
    return k !== null && navigablePreviewKinds.has(k)
  })
}

// nextInQueue picks the next entry to play. `currentName` remains accepted for
// backward compatibility; callers may pass fileEntryIdentity(entry) to avoid
// path/name ambiguity when object IDs are available.
// `shuffle` returns a random other entry; otherwise advances linearly.
// When at the end:
//   - repeat = true  → wraps to start (shuffle: re-rolls)
//   - repeat = false → returns null (overlay stops auto-advancing)
// Returns null when the queue has zero or one playable items.
export function nextInQueue(
  queue: FileBrowserEntry[],
  currentName: string | undefined,
  shuffle: boolean,
  repeat: boolean,
  rand: () => number = Math.random,
): FileBrowserEntry | null {
  if (queue.length === 0) return null
  if (queue.length === 1) return repeat ? queue[0] : null
  const idx = queue.findIndex((e) => entryMatchesIdentity(e, currentName))
  if (shuffle) {
    for (let tries = 0; tries < 5; tries++) {
      const candidate = queue[Math.floor(rand() * queue.length)]
      if (!entryMatchesIdentity(candidate, currentName)) return candidate
    }
    return queue[(idx + 1) % queue.length]
  }
  if (idx < 0) return queue[0] // current not in queue (folder changed) → restart
  if (idx + 1 < queue.length) return queue[idx + 1]
  return repeat ? queue[0] : null
}

// prevInQueue is always linear — "previous" with shuffle on is
// ambiguous (no canonical history). Returns null when there's no
// earlier entry and repeat is off; with repeat, wraps to the last.
export function prevInQueue(
  queue: FileBrowserEntry[],
  currentName: string | undefined,
  repeat: boolean,
): FileBrowserEntry | null {
  if (queue.length === 0) return null
  const idx = queue.findIndex((e) => entryMatchesIdentity(e, currentName))
  if (idx > 0) return queue[idx - 1]
  return repeat ? queue[queue.length - 1] : null
}

// previewKind classifies a (content_type, filename) pair into the
// inline-preview category the FileBrowser renders, or null for "not
// previewable, download instead".
//
// HEIC and MKV remain distinct classifications so a host application resolver
// can match them, but they are not native FileBrowser previews.
export type PreviewKind =
  | 'video'
  | 'audio'
  | 'image'
  | 'pdf'
  | 'heic'
  | 'mkv'
  | 'text'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'csv'
  | null

export function previewKind(
  contentType?: string,
  filename?: string,
  semanticKind?: string,
): PreviewKind {
  const ext = (filename ?? '').toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? ''
  const ct = (contentType ?? '').toLowerCase().split(';')[0].trim()
  const semantic = (semanticKind ?? '').toLowerCase().replace(/^kind_|^media_kind_/, '')

  // A semantic kind is authoritative when it carries media/document meaning.
  if (semantic === 'video') return 'video'
  if (semantic === 'audio') return 'audio'
  if (semantic === 'image' || semantic === 'photo') return 'image'
  if (semantic === 'heic' || semantic === 'heif') return 'heic'
  if (semantic === 'mkv' || semantic === 'matroska') return 'mkv'
  if (semantic === 'pdf') return 'pdf'
  if (semantic === 'json') return 'json'
  if (semantic === 'yaml') return 'yaml'
  if (semantic === 'markdown') return 'markdown'
  if (semantic === 'csv') return 'csv'
  if (semantic === 'text') return 'text'

  // A declared content type wins over the filename extension.
  const hasInformativeContentType = !!ct
    && ct !== 'application/octet-stream'
    && ct !== 'binary/octet-stream'
  if (hasInformativeContentType) {
    if (ct === 'image/heic' || ct === 'image/heif') return 'heic'
    if (ct === 'video/x-matroska' || ct === 'application/x-matroska') return 'mkv'
    if (ct.startsWith('video/')) return 'video'
    if (ct.startsWith('audio/')) return 'audio'
    if (ct.startsWith('image/')) return 'image'
    if (ct === 'application/pdf') return 'pdf'
    if (ct === 'application/json' || ct === 'text/json') return 'json'
    if (ct === 'application/yaml' || ct === 'text/yaml' || ct === 'application/x-yaml') return 'yaml'
    if (ct === 'text/markdown' || ct === 'text/x-markdown') return 'markdown'
    if (ct === 'text/csv' || ct === 'application/csv') return 'csv'
    if (ct.startsWith('text/')) return 'text'
    return null
  }

  // Extension is a compatibility fallback only when no semantic metadata is
  // available.
  if (ext === 'heic' || ext === 'heif') return 'heic'
  if (ext === 'mkv') return 'mkv'
  if (['mp4', 'webm', 'mov', 'm4v'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].includes(ext)) return 'audio'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'].includes(ext)) return 'image'
  if (ext === 'pdf') return 'pdf'
  if (ext === 'json') return 'json'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  if (ext === 'md' || ext === 'markdown') return 'markdown'
  if (ext === 'csv') return 'csv'
  if (ext === 'txt' || ext === 'log' || ext === 'ini' || ext === 'conf') return 'text'
  return null
}

/** Whether FileBrowser can render this kind without an installed application. */
export function isNativePreviewKind(
  kind: PreviewKind,
): kind is Exclude<PreviewKind, 'heic' | 'mkv' | null> {
  return kind !== null && kind !== 'heic' && kind !== 'mkv'
}

function entryMatchesIdentity(entry: FileBrowserEntry, identity: string | undefined): boolean {
  if (!identity) return false
  return fileEntryIdentity(entry) === identity
    || entry.name === identity
    || entry.path === identity
    || entry.id === identity
    || entry.object_id === identity
}

// buildMediaUrl substitutes the bucket + path tokens in the configured
// template. Both substituted values are URL-encoded. `{bucket}` is the
// preferred token (matches the FileBrowser's bucket_param vocabulary);
// `{namespace}` is accepted as a back-compat alias for the same value.
// Generic: the template format is the consumer's choice — e.g.
//   "/media?org={bucket}&path={path}"                 (query)
//   "/files/{bucket}/{path}"                          (path)
//   "https://cdn.example/{bucket}/objects/{path}"     (CDN)
export function buildMediaUrl(template: string, bucket: string, path: string): string {
  const enc = encodeURIComponent(bucket)
  return template
    .replace('{bucket}', enc)
    .replace('{namespace}', enc)
    .replace('{path}', encodeURIComponent(path))
}

// Resolve a configured FileBrowser endpoint against Dashboard.backendUrl.
// Absolute HTTP(S) endpoints remain untouched (CDN/federated storage);
// relative endpoints join cleanly to the backend, including same-origin "".
export function resolveEndpointUrl(backendUrl: string | undefined, endpoint: string): string {
  if (/^(?:https?:)?\/\//i.test(endpoint)) return endpoint
  const base = backendUrl ?? ''
  if (!base) return endpoint
  return `${base.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`
}

// Host credentials are scoped to Dashboard.backendUrl. FileBrowser endpoint
// options may deliberately point at a CDN or federated service, so never copy
// backend headers across an origin boundary. Relative endpoints are backend-
// relative by definition. A same-origin absolute URL is also safe when its
// origin can be established from backendUrl (or from window for same-origin
// deployments).
export function backendHeadersForEndpoint(
  backendUrl: string | undefined,
  endpoint: string,
  headers: Record<string, string>,
): Record<string, string> {
  if (!/^(?:https?:)?\/\//i.test(endpoint)) return headers

  let trustedOrigin: string | undefined
  if (backendUrl && /^https?:\/\//i.test(backendUrl)) {
    try { trustedOrigin = new URL(backendUrl).origin } catch { return {} }
  } else if (typeof window !== 'undefined') {
    trustedOrigin = window.location.origin
  }
  if (!trustedOrigin) return {}

  try {
    return new URL(endpoint, trustedOrigin).origin === trustedOrigin ? headers : {}
  } catch {
    return {}
  }
}

export function arrayBufferToBase64(buf: ArrayBuffer): string {
  let s = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

export async function readConnectErrorMessage(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { message?: string }
    return j.message ?? `HTTP ${res.status}`
  } catch {
    return `HTTP ${res.status}`
  }
}

// parseConnectStream walks a Connect server-streaming response body and
// assembles a Blob from the JSON envelopes' base64 `data` field. Each
// envelope is `[flag:1 byte][len:4 bytes BE][JSON payload]`; the end-
// stream envelope sets flag bit 1.
//
// Lives here because Connect is the wire-format invariant that this and
// many other Connect-based services project to. NOT backend-specific —
// any Connect server-streaming RPC produces these envelopes.
export async function parseConnectStream(res: Response, mime?: string): Promise<Blob> {
  if (!res.body) {
    throw new Error('parseConnectStream: response has no body')
  }
  const reader = res.body.getReader()
  const pieces: Uint8Array[] = []
  let trailerSeen = false
  let streamError: string | null = null
  try {
    await parseConnectEnvelopes(reader, {
      onMessage: raw => {
        if (!raw || typeof raw !== 'object' || typeof (raw as { data?: unknown }).data !== 'string') {
          streamError ??= 'Download stream contained a message without base64 data'
          return
        }
        const data = (raw as { data: string }).data
        try {
          const bin = atob(data)
          const out = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
          pieces.push(out)
        } catch {
          streamError ??= 'Download stream contained invalid base64 data'
        }
      },
      onTrailer: trailer => {
        trailerSeen = true
        if (trailer.error) {
          const code = trailer.error.code ?? 'unknown'
          const message = trailer.error.message ?? 'download failed'
          streamError = `${code}: ${message}`
        }
      },
      isDisposed: () => false,
    })
  } finally {
    try {
      reader.releaseLock()
    } catch {
      // A cancelled/errored stream may already have released its lock.
    }
  }
  if (streamError) throw new Error(streamError)
  if (!trailerSeen) throw new Error('Download stream ended before its Connect trailer')
  return new Blob(
    pieces.map(piece => piece.slice().buffer),
    { type: mime ?? 'application/octet-stream' },
  )
}
