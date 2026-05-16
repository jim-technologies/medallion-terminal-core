import { useMemo, useState } from 'react'
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
}

export function FileBrowser({ data, options }: WidgetProps) {
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

  const navigateTo = (p: string) => setCtx(pathKey, p)

  const onRowClick = (e: FileBrowserEntry) => {
    if (isFolder(e)) {
      const next = currentPath ? `${currentPath}/${e.name ?? ''}` : (e.name ?? '')
      navigateTo(next)
    } else {
      void downloadFile(e)
    }
  }

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
      requestRefresh('*')
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
    </div>
  )
}
