import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import {
  buildSubmitActionUrl,
  buildActionRequest,
  newClientRequestId,
} from '../core/resolveSource'
import { Empty } from './states'
import {
  isFolder,
  normalizeEntries,
  sortEntries,
  splitPath,
  humanSize,
  arrayBufferToBase64,
  parseConnectStream,
  readConnectErrorMessage,
  previewKind,
  buildMediaUrl,
  type FileBrowserEntry,
} from './fileBrowserHelpers'
import type { WidgetProps } from '../types/template'

// FileBrowser is the file-pane primitive: breadcrumb header + folder/file
// list + drag-drop upload zone. Designed for object-store fronts where
// users browse virtual folders, click in/out, drop files to upload, and
// click files to download.
//
// Data shape: { entries: [{ kind, name, object_id?, size_bytes?, ... }] }
// where `kind` is "folder" | "file" (case-insensitive; "KIND_FOLDER" /
// "KIND_FILE" enum strings also accepted).
//
// Backend contract: uploads go through SubmitAction with
// options.upload_action_id (default "upload") and payload
// { namespace, path, content_type, data_b64 }. Downloads POST to
// options.download_url (default the Connect server-streaming endpoint
// of FileService.Download).

interface FileBrowserOptions {
  path_ctx?: string
  namespace_ctx?: string
  upload_action_id?: string
  download_url?: string
  // URL template for the Range-supporting blob endpoint that backs inline
  // preview. {namespace} and {object_id} are substituted. Default matches
  // files's /media/{ns}/{oid} convention. Set to "" to disable preview
  // entirely (every file click triggers download).
  media_url_template?: string
}

export function FileBrowser({ data, options, widgetId }: WidgetProps) {
  const opts = (options ?? {}) as FileBrowserOptions
  const { ctx, setCtx, backendUrl, toast, requestRefresh } = useDashboard()

  const pathKey = opts.path_ctx ?? 'path'
  const nsKey = opts.namespace_ctx ?? 'namespace'
  const uploadActionId = opts.upload_action_id ?? 'upload'

  const namespace = ctx[nsKey] ?? 'default'
  const currentPath = ctx[pathKey] ?? ''

  const entries = useMemo(() => normalizeEntries(data), [data])
  const sorted = useMemo(() => sortEntries(entries), [entries])
  const segments = useMemo(() => splitPath(currentPath), [currentPath])

  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<FileBrowserEntry | null>(null)

  const mediaTemplate = opts.media_url_template ?? '/media/{namespace}/{object_id}'

  const navigateTo = (p: string) => setCtx(pathKey, p)

  const onRowClick = (e: FileBrowserEntry) => {
    if (isFolder(e)) {
      const next = currentPath ? `${currentPath}/${e.name ?? ''}` : (e.name ?? '')
      navigateTo(next)
      return
    }
    // Previewable types open in the overlay; everything else downloads.
    if (mediaTemplate && previewKind(e.content_type)) {
      setPreview(e)
      return
    }
    void downloadFile(e)
  }

  // Esc closes the preview overlay. Bound globally while open.
  useEffect(() => {
    if (!preview) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreview(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  const downloadFile = async (e: FileBrowserEntry) => {
    if (!e.object_id) {
      toast('File has no object_id', 'error')
      return
    }
    const url = (backendUrl ?? '') + (opts.download_url ?? '/files.v1.FileService/Download')
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        },
        body: JSON.stringify({ namespace, objectId: e.object_id }),
      })
      if (!res.ok) {
        const msg = await readConnectErrorMessage(res)
        toast(`Download failed: ${msg}`, 'error')
        return
      }
      const blob = await parseConnectStream(res, e.content_type)
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = e.name ?? e.object_id
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 5000)
    } catch (err) {
      toast(`Download failed: ${(err as Error).message}`, 'error')
    }
  }

  const handleFiles = async (files: FileList | File[]) => {
    setUploading(true)
    let okCount = 0
    for (const f of Array.from(files)) {
      try {
        const buf = await f.arrayBuffer()
        const b64 = arrayBufferToBase64(buf)
        const payload = {
          namespace,
          path: currentPath ? `${currentPath}/${f.name}` : f.name,
          content_type: f.type || 'application/octet-stream',
          data_b64: b64,
        }
        const url = buildSubmitActionUrl(backendUrl ?? '')
        const req = buildActionRequest({
          actionId: uploadActionId,
          params: payload,
          clientRequestId: newClientRequestId(),
        })
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Connect-Protocol-Version': '1',
          },
          body: JSON.stringify(req),
        })
        if (!res.ok) {
          const msg = await readConnectErrorMessage(res)
          throw new Error(msg)
        }
        okCount++
      } catch (err) {
        toast(`Upload failed: ${f.name} — ${(err as Error).message}`, 'error')
      }
    }
    setUploading(false)
    if (okCount > 0) {
      toast(`Uploaded ${okCount} file${okCount === 1 ? '' : 's'}`, 'ok')
      // Refresh just this widget so the new file appears. Falling back
      // to '*' only when the template didn't give us an id — bare
      // best-effort behavior over silent stalemate.
      requestRefresh(widgetId ?? '*')
    }
  }

  return (
    <div
      className="h-full flex flex-col"
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files)
      }}
    >
      <div className="flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0">
        <button onClick={() => navigateTo('')} className="text-sky-400 hover:underline">/</button>
        {segments.map((seg, i) => {
          const fullPath = segments.slice(0, i + 1).join('/')
          return (
            <span key={i} className="flex items-center gap-1">
              <span className="text-zinc-600">/</span>
              <button
                onClick={() => navigateTo(fullPath)}
                className="text-sky-400 hover:underline"
              >
                {seg}
              </button>
            </span>
          )
        })}
        <span className="ml-auto text-zinc-500">
          {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="flex-1 overflow-auto relative min-h-0">
        {dragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none">
            <div className="text-sky-300 text-sm">Drop files to upload</div>
          </div>
        )}
        {sorted.length === 0 ? (
          <Empty>This folder is empty. Drop files to upload.</Empty>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-zinc-900 z-[1]">
              <tr className="text-zinc-400 border-b border-zinc-800">
                <th className="text-left px-3 py-2 w-8"></th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-right px-3 py-2 w-24">Size</th>
                <th className="text-left px-3 py-2 w-40">Type</th>
                <th className="text-left px-3 py-2 w-36">Modified</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e, i) => (
                <tr
                  key={`${e.kind ?? ''}:${e.name ?? i}`}
                  onClick={() => onRowClick(e)}
                  className="border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer"
                >
                  <td className="px-3 py-1.5 select-none">{isFolder(e) ? '📁' : '📄'}</td>
                  <td className="px-3 py-1.5 text-zinc-100 truncate">{e.name}</td>
                  <td className="px-3 py-1.5 text-right text-zinc-400">
                    {isFolder(e) ? '—' : humanSize(e.size_bytes ?? 0)}
                  </td>
                  <td className="px-3 py-1.5 text-zinc-500 truncate">{e.content_type ?? ''}</td>
                  <td className="px-3 py-1.5 text-zinc-500 truncate">{e.modified_at ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {uploading && (
          <div className="absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg">
            Uploading…
          </div>
        )}
      </div>

      {preview && (
        <PreviewOverlay
          entry={preview}
          mediaUrl={(backendUrl ?? '') + buildMediaUrl(mediaTemplate, namespace, preview.object_id ?? '')}
          onClose={() => setPreview(null)}
          onDownload={() => { void downloadFile(preview) }}
        />
      )}
    </div>
  )
}

// PreviewOverlay covers the FileBrowser area with a dim backdrop and renders
// the appropriate native media element for the file's content_type. Browsers
// drive the byte loads via Range requests against `mediaUrl`, so the backend
// only has to fetch the chunks overlapping the visible portion (or the
// scrubbed-to position for video/audio).
//
// Design rules so the four kinds feel uniform:
//   • Same rounded shadow card for every kind (audio gets a tagged card,
//     others inherit theirs from the media element itself).
//   • Loading sentinel under the media until the element fires its first
//     load event — no black-screen-while-fetching for big files.
//   • onError → fall back to a "preview failed, try Download" pane
//     instead of a silently-broken element.
//   • Backdrop click (anywhere in the dim area) closes; click on the
//     media itself does not, so scrubbing/selecting text works.
//   • playsInline + preload="metadata" on video to keep iOS sane and
//     avoid pulling the whole file before the user even hits play.
function PreviewOverlay({
  entry,
  mediaUrl,
  onClose,
  onDownload,
}: {
  entry: FileBrowserEntry
  mediaUrl: string
  onClose: () => void
  onDownload: () => void
}) {
  const kind = previewKind(entry.content_type)
  // image/video/pdf show a loading sentinel until the element loads.
  // audio is rendered inside its own card with the native player's spinner.
  const [loading, setLoading] = useState(kind === 'image' || kind === 'video' || kind === 'pdf')
  const [failed, setFailed] = useState(false)

  const onMediaLoad = () => setLoading(false)
  const onMediaError = () => { setLoading(false); setFailed(true) }
  const backdropClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95"
      onClick={backdropClose}
    >
      <div className="flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900">
        <span className="text-sm font-medium truncate flex-1">{entry.name}</span>
        <span className="text-xs text-zinc-500 truncate max-w-[200px]">{entry.content_type}</span>
        {typeof entry.size_bytes === 'number' && (
          <span className="text-xs text-zinc-600 tabular-nums">{humanSize(entry.size_bytes)}</span>
        )}
        <button
          onClick={onDownload}
          className="text-xs text-sky-400 hover:underline"
        >
          Download
        </button>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-100 text-lg leading-none"
          aria-label="Close preview"
        >
          ×
        </button>
      </div>
      <div
        className="flex-1 flex items-center justify-center overflow-auto p-4 relative"
        onClick={backdropClose}
      >
        {loading && !failed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-zinc-500 text-xs uppercase tracking-wider">Loading…</div>
          </div>
        )}
        {failed && (
          <div className="flex flex-col items-center gap-3 text-zinc-300 text-sm">
            <span className="text-zinc-500">⚠ Preview couldn't load.</span>
            <button onClick={onDownload} className="text-sky-400 hover:underline text-xs">
              Download instead
            </button>
          </div>
        )}
        {!failed && kind === 'video' && (
          <video
            src={mediaUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onLoadedMetadata={onMediaLoad}
            onError={onMediaError}
            className="max-h-full max-w-full bg-black rounded shadow-2xl"
          />
        )}
        {!failed && kind === 'audio' && (
          <div className="flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl w-full max-w-md">
            <div className="text-3xl select-none" aria-hidden="true">♪</div>
            <div className="text-sm text-zinc-200 truncate max-w-full" title={entry.name}>{entry.name}</div>
            <audio
              src={mediaUrl}
              controls
              autoPlay
              preload="metadata"
              onError={onMediaError}
              className="w-full"
            />
          </div>
        )}
        {!failed && kind === 'image' && (
          <img
            src={mediaUrl}
            alt={entry.name ?? ''}
            decoding="async"
            onLoad={onMediaLoad}
            onError={onMediaError}
            className="max-h-full max-w-full object-contain rounded shadow-2xl"
          />
        )}
        {!failed && kind === 'pdf' && (
          // iframe is more reliably rendered than <embed> across browsers
          // (some refuse <embed> for security reasons; iframe with a
          // direct PDF src gets the native viewer with toolbar/scrub).
          <iframe
            src={mediaUrl}
            title={entry.name ?? 'PDF preview'}
            onLoad={onMediaLoad}
            className="w-full h-full bg-white rounded shadow-2xl border-0"
          />
        )}
        {kind === null && !failed && (
          <div className="flex flex-col items-center gap-3 text-zinc-300 text-sm">
            <span className="text-zinc-500">No inline preview for {entry.content_type ?? 'this file type'}.</span>
            <button onClick={onDownload} className="text-sky-400 hover:underline text-xs">
              Download instead
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
