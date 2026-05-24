// Client-side decoders for file types browsers can't render natively.
// Both modules are loaded via dynamic import so the FileBrowser bundle
// stays small — the heavy WASM only lands when the user actually opens a
// HEIC or MKV file.
//
//   decodeHeic — HEIC/HEIF → JPEG Blob via libheif (heic2any wraps it).
//                ~1.5 MB extra chunk, downloaded on first HEIC preview.
//   remuxMkvToMp4 — MKV container → MP4 container via ffmpeg.wasm.
//                Lossless `-c copy` remux; works when the codec inside the
//                MKV is one the browser already decodes (H.264/H.265/AV1).
//                ~30 MB wasm, downloaded on first MKV preview, cached by
//                the browser thereafter.

// fetchText pulls the raw bytes from a URL as UTF-8 text. Used by the
// text-family previews (json/yaml/markdown/csv/text). Throws on
// non-2xx so the overlay can surface the error.
export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  return res.text()
}

// prettyJSON parses + re-serialises with 2-space indent. Returns the
// original input unchanged if it isn't valid JSON, so a malformed file
// still shows readable contents instead of erroring out.
export function prettyJSON(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

// parseCSV is a deliberately tiny splitter — handles quoted fields with
// embedded commas and CRLF line endings. RFC-4180-ish. Good enough for
// preview; users who need real CSV parsing in their dashboards can do
// it server-side.
export function parseCSV(raw: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i]
    if (inQuotes) {
      if (c === '"' && raw[i + 1] === '"') { cur += '"'; i++; continue }
      if (c === '"') { inQuotes = false; continue }
      cur += c
      continue
    }
    if (c === '"') { inQuotes = true; continue }
    if (c === ',') { row.push(cur); cur = ''; continue }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && raw[i + 1] === '\n') i++
      row.push(cur); cur = ''
      rows.push(row); row = []
      continue
    }
    cur += c
  }
  if (cur !== '' || row.length > 0) { row.push(cur); rows.push(row) }
  return rows
}

// renderMarkdown lazy-loads marked (~30 KB) and renders the input to
// HTML. Sanitisation is the marked default for v18+ (no script tags
// pass through). Returns the original text wrapped in <pre> on parse
// failure so the user still sees something.
export async function renderMarkdown(raw: string): Promise<string> {
  const { marked } = await import('marked')
  try {
    return (await marked.parse(raw, { async: true })) as string
  } catch {
    return `<pre>${escapeHtml(raw)}</pre>`
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

let ffmpegInstance: FFmpegLike | null = null

interface FFmpegLike {
  load: (opts?: unknown) => Promise<void>
  writeFile: (name: string, data: Uint8Array) => Promise<void>
  readFile: (name: string) => Promise<Uint8Array | string>
  exec: (args: string[]) => Promise<number>
}

export async function decodeHeic(blob: Blob): Promise<Blob> {
  const { default: heic2any } = await import('heic2any')
  const out = await heic2any({ blob, toType: 'image/jpeg', quality: 0.92 })
  // heic2any returns Blob OR Blob[] for multi-image containers; take the first.
  return Array.isArray(out) ? out[0] : out
}

// remuxMkvToMp4 downloads the full MKV bytes from `url` and runs ffmpeg
// `-c copy` to swap the container without re-encoding. The ArrayBuffer is
// held in memory for the duration of the remux, which is the practical
// size ceiling for this path. For very large files (multi-GB), the user
// should download and play locally.
export async function remuxMkvToMp4(url: string, onProgress?: (msg: string) => void): Promise<Blob> {
  onProgress?.('Loading ffmpeg…')
  const ffmpeg = await loadFFmpeg()
  onProgress?.('Fetching file…')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  const bytes = new Uint8Array(await res.arrayBuffer())
  onProgress?.('Remuxing…')
  await ffmpeg.writeFile('input.mkv', bytes)
  const rc = await ffmpeg.exec(['-i', 'input.mkv', '-c', 'copy', '-movflags', '+faststart', 'output.mp4'])
  if (rc !== 0) {
    throw new Error('ffmpeg remux failed (code ' + rc + ') — codec inside MKV may not be browser-compatible')
  }
  const out = await ffmpeg.readFile('output.mp4')
  if (typeof out === 'string') {
    throw new Error('ffmpeg readFile returned string')
  }
  return new Blob([new Uint8Array(out)], { type: 'video/mp4' })
}

async function loadFFmpeg(): Promise<FFmpegLike> {
  if (ffmpegInstance) return ffmpegInstance
  const { FFmpeg } = await import('@ffmpeg/ffmpeg')
  const ffmpeg = new FFmpeg() as unknown as FFmpegLike
  await ffmpeg.load()
  ffmpegInstance = ffmpeg
  return ffmpeg
}
