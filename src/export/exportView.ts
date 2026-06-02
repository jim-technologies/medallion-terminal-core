// exportView — the unified export surface.
//
//   const blob = await exportView({ data, component }, 'parquet')
//   downloadView({ data, component }, 'csv', 'positions')
//
// A "view" is any widget/table/timeseries payload plus an optional
// component/shape hint. exportView flattens it (flatten.ts) then
// serializes to the requested BI-standard format (serializers.ts),
// returning a Blob ready for download, upload, or fetch-Response body.
// downloadView is the thin browser-only wrapper that triggers a file
// save — it is the function the ExportMenu UI calls.

import { flatten, type FlatTable } from './flatten'
import {
  EXTENSION,
  MIME,
  serializeText,
  toParquet,
  type ExportFormat,
} from './serializers'

export type { ExportFormat } from './serializers'
export type { FlatTable, Cell } from './flatten'

export interface ExportableView {
  // The raw widget payload (any canonical shape, or already-flat data).
  data: unknown
  // Optional hint: the widget's component name or a canonical shape
  // name. Selects the exact flattener; omit to auto-detect.
  component?: string
  // Pre-flattened table. When supplied, `data`/`component` are ignored
  // and this table is serialized directly — lets a widget that already
  // computed its display rows export exactly what's on screen.
  table?: FlatTable
}

function resolveTable(view: ExportableView): FlatTable {
  return view.table ?? flatten(view.data, view.component)
}

// Serialize a view to a Blob in the requested format. Async because
// Parquet's writer is lazily imported; the text formats resolve
// immediately. The Blob carries the correct MIME type so a download or
// a fetch Response is well-formed.
export async function exportView(view: ExportableView, format: ExportFormat): Promise<Blob> {
  const table = resolveTable(view)
  if (format === 'parquet') {
    const bytes = await toParquet(table)
    // Copy into a fresh ArrayBuffer-backed view so BlobPart typing is
    // satisfied regardless of the underlying buffer kind.
    return new Blob([bytes.slice().buffer], { type: MIME.parquet })
  }
  const text = serializeText(table, format)
  return new Blob([text], { type: MIME[format] })
}

// Row count for a view without serializing — handy for a UI to show
// "Export 1,240 rows" or to disable the button when empty.
export function viewRowCount(view: ExportableView): number {
  return resolveTable(view).rows.length
}

// Build a download filename: `<base>.<ext>`. Sanitizes the base to
// filename-safe characters and falls back to "export".
export function exportFilename(base: string | undefined, format: ExportFormat): string {
  const safe = (base ?? 'export')
    .trim()
    .replace(/[^\w.-]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `${safe || 'export'}.${EXTENSION[format]}`
}

// Browser-only: serialize and trigger a file download. No-op (resolves
// false) when there's no DOM (SSR / node). Returns true once the
// download was initiated.
export async function downloadView(
  view: ExportableView,
  format: ExportFormat,
  filenameBase?: string,
): Promise<boolean> {
  if (typeof document === 'undefined' || typeof URL?.createObjectURL !== 'function') {
    return false
  }
  const blob = await exportView(view, format)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = exportFilename(filenameBase, format)
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoke on the next tick so the click has a chance to start the
  // download before the object URL is invalidated.
  setTimeout(() => URL.revokeObjectURL(url), 0)
  return true
}
