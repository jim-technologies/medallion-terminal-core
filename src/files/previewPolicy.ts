/**
 * The file preview policy shared by every product (the same allowlist and
 * limits as the Terminal's Common Files viewer): a conservative set of
 * formats, bounded reads, raster images and PDFs admitted only when their
 * bytes carry the right signature, and nothing interpreted as HTML, SVG or
 * XML. Pure functions; FilePreview renders the result.
 */

/** How a file is previewed. */
export type FilePreviewKind =
  | 'image'
  | 'pdf'
  | 'video'
  | 'audio'
  | 'csv'
  | 'tsv'
  | 'json'
  | 'markdown'
  | 'code'
  | 'text'
  | 'unsupported'

/** Raster formats a preview may show, each checked by signature. */
export type RasterKind = 'png' | 'jpeg' | 'gif' | 'webp'

/** Byte and size limits; every read is bounded by them. */
export interface PreviewLimits {
  /** Text, code, JSON and Markdown: bytes read (a Range request). */
  textBytes: number
  /** CSV and TSV: bytes read before parsing. */
  delimitedBytes: number
  /** Raster images: larger files are not fetched. */
  imageBytes: number
  /** PDFs: larger files are not fetched. */
  pdfBytes: number
  /** Delimited rows kept. */
  rows: number
  /** Delimited columns kept. */
  columns: number
  /** Characters kept per delimited cell. */
  cellCharacters: number
}

// Decimal megabytes, so the limits read as round numbers in the UI's SI
// byte formatting ("over the 50 MB preview limit").
export const DEFAULT_PREVIEW_LIMITS: PreviewLimits = {
  textBytes: 1_000_000,
  delimitedBytes: 2_000_000,
  imageBytes: 20_000_000,
  pdfBytes: 50_000_000,
  rows: 1_000,
  columns: 100,
  cellCharacters: 20_000,
}

const RASTER: Record<string, RasterKind> = {
  png: 'png',
  jpg: 'jpeg',
  jpeg: 'jpeg',
  gif: 'gif',
  webp: 'webp',
}
const VIDEO = new Set(['mp4', 'm4v', 'webm', 'mov'])
const AUDIO = new Set(['mp3', 'm4a', 'aac', 'wav', 'ogg', 'oga', 'opus', 'flac'])
const TEXT = new Set(['txt', 'log', 'text', 'env', 'gitignore'])
const MARKDOWN = new Set(['md', 'markdown'])

/** Source files shown as code, with the language named in the view. */
const CODE_LANGUAGES: Record<string, string> = {
  ts: 'TypeScript', tsx: 'TypeScript', mts: 'TypeScript', cts: 'TypeScript',
  js: 'JavaScript', jsx: 'JavaScript', mjs: 'JavaScript', cjs: 'JavaScript',
  py: 'Python', go: 'Go', rs: 'Rust', java: 'Java', kt: 'Kotlin', scala: 'Scala',
  c: 'C', h: 'C', cc: 'C++', cpp: 'C++', hpp: 'C++', cs: 'C#', swift: 'Swift',
  rb: 'Ruby', php: 'PHP', lua: 'Lua', r: 'R', sh: 'Shell', bash: 'Shell', zsh: 'Shell',
  sql: 'SQL', proto: 'Protocol Buffers', graphql: 'GraphQL', gql: 'GraphQL',
  yaml: 'YAML', yml: 'YAML', toml: 'TOML', ini: 'INI', cfg: 'INI', conf: 'Config',
  xml: 'XML', svg: 'SVG', html: 'HTML', htm: 'HTML', css: 'CSS', scss: 'SCSS',
  tf: 'Terraform', hcl: 'HCL', ndjson: 'NDJSON', jsonl: 'NDJSON',
  dockerfile: 'Dockerfile', makefile: 'Makefile',
}

/** The extension (lower case) or, for names like `Dockerfile`, the name. */
export function extensionOf(name: string): string {
  const base = name.split('/').pop()?.toLowerCase() ?? ''
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return base
  return base.slice(dot + 1)
}

/** What a file previews as, and its code language when it is source. */
export interface PreviewPlan {
  kind: FilePreviewKind
  raster?: RasterKind
  language?: string
}

/**
 * Picks the preview from the file name first. The declared content type is
 * consulted only for files without an extension, so `report.unknown`
 * labelled `text/plain` is not treated as text. HTML, SVG and XML are
 * shown as source, never rendered.
 */
export function planPreview(name: string, contentType?: string): PreviewPlan {
  const ext = extensionOf(name)
  const hasExtension = name.split('/').pop()?.includes('.') ?? false
  if (RASTER[ext]) return { kind: 'image', raster: RASTER[ext] }
  if (ext === 'pdf') return { kind: 'pdf' }
  if (VIDEO.has(ext)) return { kind: 'video' }
  if (AUDIO.has(ext)) return { kind: 'audio' }
  if (ext === 'csv') return { kind: 'csv' }
  if (ext === 'tsv') return { kind: 'tsv' }
  if (ext === 'json') return { kind: 'json', language: 'JSON' }
  if (MARKDOWN.has(ext)) return { kind: 'markdown' }
  if (CODE_LANGUAGES[ext]) return { kind: 'code', language: CODE_LANGUAGES[ext] }
  if (TEXT.has(ext)) return { kind: 'text' }
  if (hasExtension || !contentType) return { kind: 'unsupported' }
  const type = contentType.split(';')[0]!.trim().toLowerCase()
  if (type === 'image/png') return { kind: 'image', raster: 'png' }
  if (type === 'image/jpeg') return { kind: 'image', raster: 'jpeg' }
  if (type === 'image/gif') return { kind: 'image', raster: 'gif' }
  if (type === 'image/webp') return { kind: 'image', raster: 'webp' }
  if (type === 'application/pdf') return { kind: 'pdf' }
  if (type === 'application/json') return { kind: 'json', language: 'JSON' }
  if (type === 'text/csv') return { kind: 'csv' }
  if (type === 'text/markdown') return { kind: 'markdown' }
  if (type === 'text/plain') return { kind: 'text' }
  if (type.startsWith('video/')) return { kind: 'video' }
  if (type.startsWith('audio/')) return { kind: 'audio' }
  return { kind: 'unsupported' }
}

/** `%PDF-` */
export function hasPdfSignature(bytes: Uint8Array): boolean {
  return bytes.length >= 5
    && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d
}

/** Magic numbers of the admitted raster formats. */
export function hasRasterSignature(kind: RasterKind, bytes: Uint8Array): boolean {
  switch (kind) {
    case 'png':
      return bytes.length >= 8
        && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
        && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
    case 'jpeg':
      return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    case 'gif':
      return bytes.length >= 6
        && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38
        && (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61
    case 'webp':
      return bytes.length >= 12
        && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
        && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  }
}

/** The bytes read and whether the body had more. */
export interface BoundedRead {
  bytes: Uint8Array<ArrayBuffer>
  truncated: boolean
}

/**
 * Reads at most `maxBytes` of a response body, then cancels the rest. A
 * server that ignores a Range request cannot make the browser buffer the
 * whole file.
 */
export async function readBounded(response: Response, maxBytes: number): Promise<BoundedRead> {
  if (!response.body) {
    const all = new Uint8Array(await response.arrayBuffer())
    return { bytes: all.slice(0, maxBytes), truncated: all.length > maxBytes }
  }
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  let truncated = false
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    const room = maxBytes - length
    if (value.length > room) {
      chunks.push(value.slice(0, room))
      length += room
      truncated = true
      await reader.cancel()
      break
    }
    chunks.push(value)
    length += value.length
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return { bytes, truncated }
}

/** Total size from a `Content-Range: bytes 0-99/5000` header, if present. */
export function contentRangeTotal(header: string | null): number | undefined {
  const match = header ? /\/(\d+)\s*$/.exec(header) : null
  return match ? Number(match[1]) : undefined
}

/** UTF-8 text from bounded bytes; a character cut at the limit is dropped. */
export function decodeText(bytes: Uint8Array, truncated: boolean): string {
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes, { stream: truncated })
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/** A bounded delimited table and what was left out. */
export interface DelimitedPreview {
  rows: string[][]
  sourceRowCount: number
  sourceColumnCount: number
  truncatedRows: boolean
  truncatedColumns: boolean
  truncatedCells: boolean
}

/**
 * A bounded RFC 4180-style parser for CSV and TSV previews: quoted fields,
 * escaped quotes and quoted line breaks, no evaluation of cell contents.
 * Malformed quoting throws.
 */
export function parseDelimited(
  source: string,
  delimiter: ',' | '\t',
  { rows: maxRows, columns: maxColumns, cellCharacters }: Pick<PreviewLimits, 'rows' | 'columns' | 'cellCharacters'> = DEFAULT_PREVIEW_LIMITS,
): DelimitedPreview {
  const input = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source
  const rows: string[][] = []
  if (!input) {
    return { rows, sourceRowCount: 0, sourceColumnCount: 0, truncatedRows: false, truncatedColumns: false, truncatedCells: false }
  }
  let row: string[] = []
  let cell = ''
  let column = 0
  let sourceRowCount = 0
  let sourceColumnCount = 0
  let inQuotes = false
  let quotedField = false
  let closedQuote = false
  let endedWithRowBreak = false
  let truncatedColumns = false
  let truncatedCells = false

  const append = (value: string) => {
    if (cell.length < cellCharacters) {
      const room = cellCharacters - cell.length
      cell += value.slice(0, room)
      if (value.length > room) truncatedCells = true
    } else if (value.length > 0) {
      truncatedCells = true
    }
  }
  const finishCell = () => {
    if (column < maxColumns) row.push(cell)
    else truncatedColumns = true
    column += 1
    cell = ''
    quotedField = false
    closedQuote = false
  }
  const finishRow = () => {
    finishCell()
    sourceRowCount += 1
    sourceColumnCount = Math.max(sourceColumnCount, column)
    if (rows.length < maxRows) rows.push(row)
    row = []
    column = 0
  }

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]!
    endedWithRowBreak = false
    if (inQuotes) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          append('"')
          index += 1
        } else {
          inQuotes = false
          closedQuote = true
        }
      } else {
        append(character)
      }
      continue
    }
    if (closedQuote && character !== delimiter && character !== '\r' && character !== '\n') {
      throw new Error('Unexpected character after a closing quote.')
    }
    if (character === '"') {
      if (cell.length > 0 || quotedField) throw new Error('Unexpected quote in an unquoted field.')
      quotedField = true
      inQuotes = true
      continue
    }
    if (character === delimiter) {
      finishCell()
      continue
    }
    if (character === '\r' || character === '\n') {
      if (character === '\r' && input[index + 1] === '\n') index += 1
      finishRow()
      endedWithRowBreak = true
      continue
    }
    append(character)
  }
  if (inQuotes) throw new Error('The final quoted field is not closed.')
  if (!endedWithRowBreak) finishRow()
  return {
    rows,
    sourceRowCount,
    sourceColumnCount,
    truncatedRows: sourceRowCount > maxRows,
    truncatedColumns: truncatedColumns || sourceColumnCount > maxColumns,
    truncatedCells,
  }
}
