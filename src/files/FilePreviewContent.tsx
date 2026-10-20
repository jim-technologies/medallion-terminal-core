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
import type { FilePreviewProps } from './FilePreview'
import { MediaPreview } from './MediaPreview'
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
  type RasterKind,
} from './previewPolicy'
import { probePreview } from './previewProbe'

type Loaded =
  | { state: 'loading' }
  | { state: 'error'; error: SourceError }
  | { state: 'blocked'; kind: string }
  | { state: 'unreadable'; kind: string }
  | { state: 'text'; text: string; truncated: boolean; total?: number }
  | { state: 'table'; table: DelimitedPreview; truncatedBytes: boolean }
  | { state: 'markdown'; html: string; truncated: boolean; total?: number }
  | { state: 'blob'; url: string }
  | { state: 'direct'; url: string }
  | { state: 'media' }
  | { state: 'unsupported' }

const RASTER_TYPE: Record<RasterKind, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
}

interface TableRow {
  id: number
  cells: string[]
}

export function FilePreviewContent({ file, fetch: transport, session, limits: overrides, onDownload, height = 480, markdown, className }: FilePreviewProps) {
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
          const expectedType = plan.kind === 'pdf' ? 'application/pdf' : RASTER_TYPE[plan.raster!]
          const blocked: Loaded = { state: 'blocked', kind: plan.kind === 'pdf' ? 'PDF' : plan.raster!.toUpperCase() }
          const safeDirect = (response: Response): Loaded => response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() === expectedType
            ? { state: 'direct', url: file.url }
            : blocked
          if (file.sizeBytes === undefined || file.sizeBytes > limit) {
            const probe = await probePreview(file.url, 16, read, controller.signal)
            if (!probe.response.ok) throw probe.response
            const valid = plan.kind === 'pdf' ? hasPdfSignature(probe.bytes) : hasRasterSignature(plan.raster!, probe.bytes)
            const total = contentRangeTotal(probe.response.headers.get('content-range'))
              ?? (probe.response.status === 200 ? Number(probe.response.headers.get('content-length')) || undefined : undefined)
              ?? file.sizeBytes
            if (total !== undefined && total > limit) return valid ? safeDirect(probe.response) : blocked
            // Compatible AVIF brands can follow the first 16 bytes. A bounded
            // Blob read can verify those, but a large direct preview cannot.
            if (!valid && !(plan.raster === 'avif' && String.fromCharCode(...probe.bytes.slice(4, 8)) === 'ftyp')) return blocked
          }
          const response = await read(file.url, { signal: controller.signal })
          if (!response.ok) throw response
          const { bytes, truncated } = await readBounded(response, limit)
          const fullValid = plan.kind === 'pdf' ? hasPdfSignature(bytes) : hasRasterSignature(plan.raster!, bytes)
          if (!fullValid) return { state: 'blocked', kind: plan.kind === 'pdf' ? 'PDF' : plan.raster!.toUpperCase() }
          if (truncated) return safeDirect(response)
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
            return { state: 'markdown', html: await renderMarkdown(text, markdown), truncated, total }
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
        else if (objectUrl) URL.revokeObjectURL(objectUrl)
      },
      async error => {
        if (controller.signal.aborted) return
        const typed = await toPreviewError(error)
        if (!controller.signal.aborted) setLoaded({ state: 'error', error: typed })
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
      body = <MediaPreview file={file} kind={plan.kind === 'video' ? 'video' : 'audio'} fetch={transport} session={session} onDownload={onDownload} />
      break
    case 'blob':
    case 'direct':
      body = plan.kind === 'pdf'
        ? <><iframe className="mtc-file-preview-pdf" src={loaded.url} title={file.name} sandbox="" style={{ height }} />{download}</>
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
