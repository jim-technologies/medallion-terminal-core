import { lazy, Suspense } from 'react'
import type { SessionPort } from '../app/session'
import { cx } from '../components/utils'
import { useMessage } from '../foundations/DesignSystemProvider'
import { LoadingState } from '../workbench/States'
import type { MarkdownOptions } from './markdown'
import { planPreview, type PreviewLimits } from './previewPolicy'

/** The file to preview. Bytes stay on the product origin that serves `url`. */
export interface FilePreviewFile {
  /** File name; its extension picks the preview. */
  name: string
  /** Where the bytes are read (Range-capable for text). */
  url: string
  /** Type fallback without an extension, and native media MIME/codec hint. */
  contentType?: string
  /** Size, when known, to choose a bounded Blob or signature-checked direct preview. */
  sizeBytes?: number
}

/** Props for a bounded, safe file preview. */
export interface FilePreviewProps {
  file: FilePreviewFile
  /** Transport for reads, such as a product fetch; the global `fetch` when unset. */
  fetch?: typeof globalThis.fetch
  /** Host session renewal for an expired native media request. */
  session?: SessionPort
  /** Overrides of the default limits. */
  limits?: Partial<PreviewLimits>
  /** Offered when the file cannot be previewed. */
  onDownload?: () => void
  /** Height of scrolling previews (CSS or pixels). */
  height?: number | string
  /** Link and image resolvers for Markdown files (`renderMarkdown`). */
  markdown?: MarkdownOptions
  className?: string
}

const FilePreviewContent = lazy(() => import('./FilePreviewContent').then(module => ({ default: module.FilePreviewContent })))

/**
 * A file preview with the Terminal's Common Files policy: text, code, JSON
 * and Markdown read at most 1 MB (a Range request, and a bounded read if
 * the server ignores it); CSV and TSV parse at most 1,000 rows × 100
 * columns into a windowed grid; raster images and PDFs require a valid
 * signature and use direct URLs above their Blob limits with a matching
 * safe response MIME type; audio and video play natively with host session
 * renewal; HTML, SVG and XML show as source; everything else
 * offers a download. Markdown is sanitised.
 */
export function FilePreview(props: FilePreviewProps) {
  const t = useMessage()
  return (
    <Suspense fallback={(
      <div className={cx('mtc-file-preview', props.className)} data-kind={planPreview(props.file.name, props.file.contentType).kind} data-state="loading">
        <LoadingState label={t('preview.loading')} compact />
      </div>
    )}>
      <FilePreviewContent {...props} />
    </Suspense>
  )
}
