import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Callout } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { cx } from '../components/utils'
import { sourceErrorFromResponse, toSourceError, type SourceError } from '../core/sourceError'
import { useLocale, useMessage } from '../foundations/DesignSystemProvider'
import { formatBytes } from '../foundations/intl'
import { DataGrid, type DataGridColumn } from '../workbench/DataGrid'
import { EmptyState, ErrorState, LoadingState } from '../workbench/States'
import { CodeView } from './CodeView'
import { renderMarkdown } from './markdown'
import {
  DEFAULT_PREVIEW_LIMITS,
  contentRangeTotal,
  decodeText,
  hasPdfSignature,
  hasRasterSignature,
  parseDelimited,
  planPreview,
  readBounded,
  type DelimitedPreview,
  type PreviewLimits,
  type RasterKind,
} from './previewPolicy'

/** The file to preview. Bytes stay on the product origin that serves `url`. */
export interface FilePreviewFile {
  /** File name; its extension picks the preview. */
  name: string
  /** Where the bytes are read (Range-capable for text). */
  url: string
  /** Declared type; used only for files without an extension. */
  contentType?: string
  /** Size, when known, to skip fetching files over the limits. */
  sizeBytes?: number
}

/** Props for a bounded, safe file preview. */
export interface FilePreviewProps {
  file: FilePreviewFile
  /** Transport for reads, such as a product fetch; the global `fetch` when unset. */
  fetch?: typeof globalThis.fetch
  /** Overrides of the default limits. */
  limits?: Partial<PreviewLimits>
  /** Offered when the file cannot be previewed. */
  onDownload?: () => void
  /** Height of scrolling previews (CSS or pixels). */
  height?: number | string
  className?: string
}

type Loaded =
  | { state: 'loading' }
  | { state: 'error'; error: SourceError }
  | { state: 'too-large'; size: number; limit: number }
  | { state: 'blocked'; kind: string }
  | { state: 'unreadable'; kind: string }
  | { state: 'text'; text: string; truncated: boolean; total?: number }
  | { state: 'table'; table: DelimitedPreview; truncatedBytes: boolean }
  | { state: 'markdown'; html: string; truncated: boolean; total?: number }
  | { state: 'blob'; url: string }
  | { state: 'media' }
  | { state: 'unsupported' }

const RASTER_TYPE: Record<RasterKind, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
}

interface TableRow {
  id: number
  cells: string[]
}

/**
 * A file preview with the Terminal's Common Files policy: text, code, JSON
 * and Markdown read at most 1 MB (a Range request, and a bounded read if
 * the server ignores it); CSV and TSV parse at most 1,000 rows × 100
 * columns into a windowed grid; PNG, JPEG, GIF, WebP and PDF are fetched
 * only under their size limits and shown only when their bytes carry the
 * right signature (so a renamed SVG or HTML page never renders); audio and
 * video play natively; HTML, SVG and XML show as source; everything else
 * offers a download. Markdown is sanitised.
 */
export function FilePreview({ file, fetch: transport, limits: overrides, onDownload, height = 480, className }: FilePreviewProps) {
  const t = useMessage()
  const { locale } = useLocale()
  const limits = useMemo(() => ({ ...DEFAULT_PREVIEW_LIMITS, ...overrides }), [overrides])
  const plan = useMemo(() => planPreview(file.name, file.contentType), [file.name, file.contentType])
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl: string | undefined
    const run = async (): Promise<Loaded> => {
      const read = transport ?? globalThis.fetch
      switch (plan.kind) {
        case 'unsupported':
          return { state: 'unsupported' }
        case 'video':
        case 'audio':
          return { state: 'media' }
        case 'image':
        case 'pdf': {
          const limit = plan.kind === 'pdf' ? limits.pdfBytes : limits.imageBytes
          if (file.sizeBytes !== undefined && file.sizeBytes > limit) {
            return { state: 'too-large', size: file.sizeBytes, limit }
          }
          const response = await read(file.url, { signal: controller.signal })
          if (!response.ok) throw response
          const { bytes, truncated } = await readBounded(response, limit)
          if (truncated) return { state: 'too-large', size: file.sizeBytes ?? limit + 1, limit }
          const valid = plan.kind === 'pdf' ? hasPdfSignature(bytes) : hasRasterSignature(plan.raster!, bytes)
          if (!valid) return { state: 'blocked', kind: plan.kind === 'pdf' ? 'PDF' : plan.raster!.toUpperCase() }
          objectUrl = URL.createObjectURL(new Blob([bytes], {
            type: plan.kind === 'pdf' ? 'application/pdf' : RASTER_TYPE[plan.raster!],
          }))
          return { state: 'blob', url: objectUrl }
        }
        default: {
          const delimited = plan.kind === 'csv' || plan.kind === 'tsv'
          const limit = delimited ? limits.delimitedBytes : limits.textBytes
          const response = await read(file.url, {
            headers: { Range: `bytes=0-${limit - 1}` },
            signal: controller.signal,
          })
          if (!response.ok) throw response
          const total = contentRangeTotal(response.headers.get('content-range')) ?? file.sizeBytes
          const { bytes, truncated: cut } = await readBounded(response, limit)
          const truncated = cut || (total !== undefined && total > bytes.length)
          const text = decodeText(bytes, truncated)
          if (delimited) {
            try {
              // A cut file may end inside a quoted field: parse whole lines only.
              const whole = truncated ? text.slice(0, Math.max(0, text.lastIndexOf('\n'))) : text
              // The header row does not count against the row limit.
              return { state: 'table', table: parseDelimited(whole, plan.kind === 'tsv' ? '\t' : ',', { ...limits, rows: limits.rows + 1 }), truncatedBytes: truncated }
            } catch {
              return { state: 'unreadable', kind: plan.kind.toUpperCase() }
            }
          }
          if (plan.kind === 'markdown') {
            return { state: 'markdown', html: await renderMarkdown(text), truncated, total }
          }
          if (plan.kind === 'json' && !truncated) {
            try {
              return { state: 'text', text: JSON.stringify(JSON.parse(text), null, 2), truncated, total }
            } catch {
              return { state: 'text', text, truncated, total }
            }
          }
          return { state: 'text', text, truncated, total }
        }
      }
    }
    setLoaded({ state: 'loading' })
    run().then(
      result => {
        if (!controller.signal.aborted) setLoaded(result)
      },
      async error => {
        if (controller.signal.aborted) return
        setLoaded({ state: 'error', error: await toPreviewError(error) })
      },
    )
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file.url, file.name, file.sizeBytes, plan, limits, transport])

  const download = onDownload && (
    <Button startIcon={<Icon name="download" />} onClick={onDownload}>{t('preview.download')}</Button>
  )
  const size = (bytes: number) => formatBytes(bytes, { locale })
  const truncation = (truncated: boolean, shown: number, total?: number): ReactNode => truncated && (
    <Callout intent="neutral" className="mtc-file-preview-notice">
      {total !== undefined
        ? t('preview.truncatedBytes', { shown: size(shown), total: size(total) })
        : t('preview.truncatedStart', { shown: size(shown) })}
    </Callout>
  )

  let body: ReactNode
  switch (loaded.state) {
    case 'loading':
      body = <LoadingState label={t('preview.loading')} compact />
      break
    case 'error':
      body = <ErrorState error={loaded.error} compact actions={download} />
      break
    case 'too-large':
      body = (
        <EmptyState
          compact
          icon={<Icon name="file" />}
          title={t('preview.tooLarge.title')}
          description={t('preview.tooLarge.description', { size: size(loaded.size), limit: size(loaded.limit) })}
          actions={download}
        />
      )
      break
    case 'blocked':
      body = (
        <EmptyState
          compact
          icon={<Icon name="shield" />}
          title={t('preview.blocked.title')}
          description={t('preview.blocked.description', { kind: loaded.kind })}
          actions={download}
        />
      )
      break
    case 'unreadable':
      body = <EmptyState compact icon={<Icon name="file" />} title={t('preview.unreadable', { kind: loaded.kind })} actions={download} />
      break
    case 'unsupported':
      body = (
        <EmptyState
          compact
          icon={<Icon name="file" />}
          title={t('preview.unsupported.title')}
          description={t('preview.unsupported.description')}
          actions={download}
        />
      )
      break
    case 'media':
      body = plan.kind === 'video'
        ? <video className="mtc-file-preview-media" src={file.url} controls preload="metadata" playsInline aria-label={file.name} />
        : <audio className="mtc-file-preview-audio" src={file.url} controls preload="metadata" aria-label={file.name} />
      break
    case 'blob':
      body = plan.kind === 'pdf'
        ? <iframe className="mtc-file-preview-pdf" src={loaded.url} title={file.name} style={{ height }} />
        : <img className="mtc-file-preview-image" src={loaded.url} alt={file.name} />
      break
    case 'markdown':
      body = (
        <>
          {truncation(loaded.truncated, limits.textBytes, loaded.total)}
          <div
            className="mtc-markdown"
            style={{ maxHeight: height }}
            // Sanitised by DOMPurify in renderMarkdown.
            dangerouslySetInnerHTML={{ __html: loaded.html }}
          />
        </>
      )
      break
    case 'table':
      body = <DelimitedTable name={file.name} preview={loaded.table} truncatedBytes={loaded.truncatedBytes} height={height} />
      break
    case 'text':
      body = (
        <CodeView
          code={loaded.text}
          label={file.name}
          language={plan.language}
          height={height}
          truncatedNotice={loaded.truncated
            ? (loaded.total !== undefined
              ? t('preview.truncatedBytes', { shown: size(limits.textBytes), total: size(loaded.total) })
              : t('preview.truncatedStart', { shown: size(limits.textBytes) }))
            : undefined}
        />
      )
      break
  }
  return (
    <div className={cx('mtc-file-preview', className)} data-kind={plan.kind} data-state={loaded.state}>
      {body}
    </div>
  )
}

function DelimitedTable({ name, preview, truncatedBytes, height }: { name: string; preview: DelimitedPreview; truncatedBytes: boolean; height: number | string }) {
  const t = useMessage()
  const { locale } = useLocale()
  const [header = [], ...body] = preview.rows
  const width = Math.max(header.length, ...body.map(row => row.length))
  const columns = useMemo<DataGridColumn<TableRow>[]>(() => Array.from({ length: width }, (_, index) => ({
    id: String(index),
    header: header[index]?.trim() || t('preview.column', { index: index + 1 }),
    accessor: row => row.cells[index] ?? '',
    kind: 'string' as const,
    width: 160,
  })), [header, width, t])
  const rows = useMemo(() => body.map((cells, id) => ({ id, cells })), [body])
  const cut = preview.truncatedRows || preview.truncatedColumns || truncatedBytes
  const number = (value: number) => new Intl.NumberFormat(locale).format(value)
  return (
    <>
      {cut && (
        <Callout intent="neutral" className="mtc-file-preview-notice">
          {t('preview.truncatedTable', {
            rows: number(body.length),
            totalRows: truncatedBytes ? `${number(preview.sourceRowCount - 1)}+` : number(preview.sourceRowCount - 1),
            columns: number(width),
            totalColumns: number(preview.sourceColumnCount),
          })}
        </Callout>
      )}
      <DataGrid label={name} columns={columns} rows={rows} rowKey={row => String(row.id)} height={height} />
    </>
  )
}

async function toPreviewError(error: unknown): Promise<SourceError> {
  return error instanceof Response ? sourceErrorFromResponse(error) : toSourceError(error)
}
