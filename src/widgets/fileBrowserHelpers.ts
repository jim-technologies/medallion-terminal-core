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

export function normalizeEntries(data: unknown): FileBrowserEntry[] {
  if (!data) return []
  if (Array.isArray(data)) return data as FileBrowserEntry[]
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>
    // Plain { entries: [...] } shape (URL source escape hatch).
    if (Array.isArray(obj.entries)) return obj.entries as FileBrowserEntry[]
    // TablePayload shape — what TerminalService.Get returns for a
    // SHAPE_TABLE source backed by a file listing.
    if (Array.isArray(obj.rows)) return obj.rows as FileBrowserEntry[]
  }
  return []
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

// previewKind classifies a (content_type, filename) pair into the inline-
// preview category the FileBrowser renders, or null for "not previewable,
// download instead".
//
// `heic` and `mkv` are intentionally NOT lumped into `image`/`video` —
// they need a client-side decode/remux step before the native element
// can render them. The PreviewOverlay loads the WASM helpers for those
// kinds on demand.
export type PreviewKind = 'video' | 'audio' | 'image' | 'pdf' | 'heic' | 'mkv' | null

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
