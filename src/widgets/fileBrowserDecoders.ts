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
