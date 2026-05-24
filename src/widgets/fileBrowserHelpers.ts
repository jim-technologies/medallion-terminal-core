// Pure helpers extracted from FileBrowser so the widget module exports
// only the component (WidgetRegistry's lazy loader requires homogeneous
// ComponentType<WidgetProps> module shape).

export interface FileBrowserEntry {
  kind?: string
  name?: string
  object_id?: string
  size_bytes?: number
  content_type?: string
  modified_at?: string
}

export function isFolder(e: FileBrowserEntry): boolean {
  const k = (e.kind ?? '').toString().toUpperCase()
  return k === 'FOLDER' || k === 'KIND_FOLDER'
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
}

// extractPagination plucks the optional `__meta__: true` row that the
// files TerminalService.getFiles handler folds into TablePayload.rows
// to carry pagination totals. Returns null when no meta row is present
// (raw inline arrays, non-paginated sources).
export function extractPagination(data: unknown): PaginationMeta | null {
  const rows = pickRows(data)
  if (!rows) return null
  for (const r of rows) {
    if (r && typeof r === 'object' && (r as Record<string, unknown>).__meta__ === true) {
      const m = r as Record<string, unknown>
      return {
        total: Number(m.total ?? 0),
        page: Number(m.page ?? 1),
        pageSize: Number(m.page_size ?? 0),
      }
    }
  }
  return null
}

export function normalizeEntries(data: unknown): FileBrowserEntry[] {
  const rows = pickRows(data)
  if (!rows) return []
  // Strip the pagination meta row produced by the files backend.
  return rows.filter(
    (r) => !(r && typeof r === 'object' && (r as Record<string, unknown>).__meta__ === true),
  ) as FileBrowserEntry[]
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
const playablePreviewKinds = new Set(['audio', 'video', 'mkv'])

// navigablePreviewKinds is the superset used for keyboard ← → navigation
// in the overlay. Images join the queue so the user can flip through
// photos the same way they advance music tracks.
const navigablePreviewKinds = new Set(['audio', 'video', 'mkv', 'image', 'heic'])

// playableQueue filters entries for the auto-advance path (audio/video
// onEnded). Same natural sort order as the file table.
export function playableQueue(entries: FileBrowserEntry[]): FileBrowserEntry[] {
  return entries.filter((e) => {
    const k = previewKind(e.content_type, e.name)
    return k !== null && playablePreviewKinds.has(k)
  })
}

// navigableQueue is the queue keyboard arrows + the toolbar prev/next
// buttons walk. Includes images so the overlay turns into a slideshow.
export function navigableQueue(entries: FileBrowserEntry[]): FileBrowserEntry[] {
  return entries.filter((e) => {
    const k = previewKind(e.content_type, e.name)
    return k !== null && navigablePreviewKinds.has(k)
  })
}

// nextInQueue picks the next entry to play. `shuffle` returns a random
// other entry; otherwise advances linearly. When at the end:
//   - repeat = true  → wraps to start (shuffle: re-rolls)
//   - repeat = false → returns null (overlay stops auto-advancing)
// Returns null when the queue has zero or one playable items.
export function nextInQueue(
  queue: FileBrowserEntry[],
  currentObjectID: string | undefined,
  shuffle: boolean,
  repeat: boolean,
  rand: () => number = Math.random,
): FileBrowserEntry | null {
  if (queue.length === 0) return null
  if (queue.length === 1) return repeat ? queue[0] : null
  const idx = queue.findIndex((e) => e.object_id === currentObjectID)
  if (shuffle) {
    // Pick a random different entry. If we can't find one (unlikely
    // given length ≥ 2) fall back to linear.
    for (let tries = 0; tries < 5; tries++) {
      const candidate = queue[Math.floor(rand() * queue.length)]
      if (candidate.object_id !== currentObjectID) return candidate
    }
    return queue[(idx + 1) % queue.length]
  }
  if (idx < 0) return queue[0] // current not in queue (folder changed) → restart
  if (idx + 1 < queue.length) return queue[idx + 1]
  return repeat ? queue[0] : null
}

// prevInQueue is always linear — "previous" with shuffle on is ambiguous
// (no canonical history). Returns null when there's no earlier entry and
// repeat is off; with repeat, wraps to the last entry.
export function prevInQueue(
  queue: FileBrowserEntry[],
  currentObjectID: string | undefined,
  repeat: boolean,
): FileBrowserEntry | null {
  if (queue.length === 0) return null
  const idx = queue.findIndex((e) => e.object_id === currentObjectID)
  if (idx > 0) return queue[idx - 1]
  return repeat ? queue[queue.length - 1] : null
}

// previewKind classifies a (content_type, filename) pair into the inline-
// preview category the FileBrowser renders, or null for "not previewable,
// download instead".
//
// Special kinds (`heic`, `mkv`, `markdown`) need client-side decode /
// remux / render before the native element can show them — the
// PreviewOverlay loads the helpers for those on demand.
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

export function previewKind(contentType?: string, filename?: string): PreviewKind {
  const ext = (filename ?? '').toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? ''
  const ct = (contentType ?? '').toLowerCase().split(';')[0].trim()

  // Decode-required image format. Treat extension-based detection as the
  // hint of last resort — some uploads come in as application/octet-stream.
  if (ct === 'image/heic' || ct === 'image/heif' || ext === 'heic' || ext === 'heif') {
    return 'heic'
  }
  // Remux-required container. matroska MIME variants + the ubiquitous
  // .mkv extension. Same uploader-doesn't-set-mime fallback applies.
  if (ct === 'video/x-matroska' || ct === 'application/x-matroska' || ext === 'mkv') {
    return 'mkv'
  }
  if (ct.startsWith('video/')) return 'video'
  if (ct.startsWith('audio/')) return 'audio'
  if (ct.startsWith('image/')) return 'image'
  if (ct === 'application/pdf' || ext === 'pdf') return 'pdf'

  // Text-family kinds. MIME wins; extension is the fallback.
  if (ct === 'application/json' || ct === 'text/json' || ext === 'json') return 'json'
  if (ct === 'application/yaml' || ct === 'text/yaml' || ct === 'application/x-yaml' || ext === 'yaml' || ext === 'yml') return 'yaml'
  if (ct === 'text/markdown' || ct === 'text/x-markdown' || ext === 'md' || ext === 'markdown') return 'markdown'
  if (ct === 'text/csv' || ct === 'application/csv' || ext === 'csv') return 'csv'
  // Generic text MIME OR text-like extensions we want to render inline.
  if (ct.startsWith('text/') || ext === 'txt' || ext === 'log' || ext === 'ini' || ext === 'conf') return 'text'
  return null
}

// buildMediaUrl substitutes {namespace} and {object_id} in the configured
// template. Default template matches files's /media/{ns}/{oid} endpoint.
export function buildMediaUrl(template: string, namespace: string, objectID: string): string {
  return template
    .replace('{namespace}', encodeURIComponent(namespace))
    .replace('{object_id}', encodeURIComponent(objectID))
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
export async function parseConnectStream(res: Response, mime?: string): Promise<Blob> {
  const reader = res.body!.getReader()
  const chunks: Uint8Array[] = []
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  let total = 0
  for (const c of chunks) total += c.length
  const buf = new Uint8Array(total)
  let off = 0
  for (const c of chunks) {
    buf.set(c, off)
    off += c.length
  }
  const pieces: ArrayBuffer[] = []
  let i = 0
  while (i + 5 <= buf.length) {
    const flag = buf[i]
    const len = (buf[i + 1] << 24) | (buf[i + 2] << 16) | (buf[i + 3] << 8) | buf[i + 4]
    i += 5
    if (i + len > buf.length) break
    const payload = buf.subarray(i, i + len)
    i += len
    if ((flag & 0x02) !== 0) break
    try {
      const obj = JSON.parse(new TextDecoder().decode(payload)) as { data?: string }
      if (obj.data) {
        const bin = atob(obj.data)
        const out = new Uint8Array(bin.length)
        for (let k = 0; k < bin.length; k++) out[k] = bin.charCodeAt(k)
        pieces.push(out.buffer as ArrayBuffer)
      }
    } catch {
      // skip non-JSON or end-stream envelope
    }
  }
  return new Blob(pieces, { type: mime ?? 'application/octet-stream' })
}
