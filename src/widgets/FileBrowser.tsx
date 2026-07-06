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
  joinPath,
  humanSize,
  arrayBufferToBase64,
  parseConnectStream,
  readConnectErrorMessage,
  previewKind,
  buildMediaUrl,
  playableQueue,
  navigableQueue,
  nextInQueue,
  prevInQueue,
  errorMessage,
  type FileBrowserEntry,
} from './fileBrowserHelpers'
import {
  decodeHeic,
  remuxMkvToMp4,
  fetchText,
  prettyJSON,
  parseCSV,
  renderMarkdown,
} from './fileBrowserDecoders'
import type { WidgetProps } from '../types/template'

// FileBrowser is a generic file-pane primitive: breadcrumb header +
// folder/file list + drag-drop upload zone + preview overlay. Designed
// for object-store-shaped backends — the widget knows nothing about
// any specific protocol or backend; it composes paths, fires
// configured URLs, and surfaces the data the source returned.
//
// Entry shape: { kind, name, size_bytes?, content_type?, modified_at? }.
// `kind` is "folder" | "file" (case-insensitive; "KIND_FOLDER" /
// "KIND_FILE" enum strings also accepted). The widget identifies an
// entry by its `name` within the current directory — backends must
// guarantee unique names per directory (which any filesystem-shaped
// store does).
//
// Backend contract:
//   - Listing: returned via the dashboard source mechanism. Pagination
//     is driven through the ctx keys named in `page_ctx` / `page_size_ctx`.
//   - Upload: SubmitAction with options.upload_action_id (default
//     "upload") and payload { namespace, path, content_type, data_b64 }.
//   - Download: POST to options.download_url with body
//     { namespace, path }; response is parsed as a Connect
//     server-streaming envelope. Override for non-Connect backends.
//   - Inline preview: GET against the URL produced by `media_url_template`
//     with {namespace} and {path} substituted. Must serve HTTP Range.

interface FileBrowserOptions {
  path_ctx?: string
  // ctx key holding the top-level "bucket" the widget browses (e.g. the
  // org or account). Sent to the backend as the `bucket_param` field (default "org").
  bucket_ctx?: string
  bucket_param?: string
  // ctx keys driving pagination + view mode. The backend source reads
  // `page` and `page_size` from its DataRequest params; the widget
  // pushes them through ctx so a click on Next triggers a refresh.
  page_ctx?: string
  page_size_ctx?: string
  view_mode_ctx?: string
  upload_action_id?: string
  // Optional streaming upload endpoint. When set, files are POSTed
  // directly (raw body, no base64) to
  //   `${upload_url}?<bucket>=&repo=&path=&content_type=`
  // which lets large files upload without buffering/encoding them in a
  // JSON RPC. Falls back to the upload_action_id RPC path when unset.
  // Upload splits the destination: `repo` = the folder you're viewing (the
  // clone unit), `path` = the filename. Dropping at the root is rejected
  // (a repo is required) — navigate into a folder first.
  upload_url?: string
  // Optional search endpoint. When set, a search box appears; submitting
  // POSTs `{<bucket>, query}` to `${search_url}` and the results replace
  // the listing until the box is cleared. Hits carry their own full path,
  // so clicking one previews/downloads it wherever it lives.
  search_url?: string
  // Optional URL-ingest endpoint. When set, the upload dialog gains a "From
  // URL" tab: POSTs `{<bucket>, repo, path, url}` and the backend fetches
  // the media server-side (no local file needed). Returns a task id the
  // backend processes async; the dialog reports "started".
  ingest_url?: string
  download_url?: string
  // URL template for the Range-supporting blob endpoint that backs inline
  // preview. {namespace} (the bucket) and {path} are substituted (both
  // URL-encoded). Set to "" to disable preview entirely.
  media_url_template?: string
}

export function FileBrowser({ data, options, widgetId }: WidgetProps) {
  const opts = (options ?? {}) as FileBrowserOptions
  const { ctx, setCtx, backendUrl, toast, requestRefresh } = useDashboard()

  const pathKey = opts.path_ctx ?? 'path'
  const bucketKey = opts.bucket_ctx ?? 'org'
  const bucketParam = opts.bucket_param ?? 'org'
  const pageKey = opts.page_ctx ?? 'page'
  const pageSizeKey = opts.page_size_ctx ?? 'page_size'
  const viewModeKey = opts.view_mode_ctx ?? 'view_mode'
  const uploadActionId = opts.upload_action_id ?? 'upload'
  const uploadUrl = opts.upload_url
  const ingestUrl = opts.ingest_url

  // `bucket` is the top-level container (e.g. the org or account). Named
  // generically so the widget isn't backend-specific; sent to the backend as bucketParam.
  const bucket = ctx[bucketKey] ?? 'default'
  const currentPath = ctx[pathKey] ?? ''
  const page = parseInt(ctx[pageKey] ?? '1', 10) || 1
  const pageSize = parseInt(ctx[pageSizeKey] ?? '50', 10) || 50
  const viewMode = (ctx[viewModeKey] === 'gallery' ? 'gallery' : 'icons') as 'icons' | 'gallery'

  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<FileBrowserEntry | null>(null)

  // Upload dialog state. Opened by the toolbar "Upload" button; offers a
  // File tab and (when ingest_url is set) a From-URL tab. `dlgRepo`
  // defaults to the current folder so the common case is one click.
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dlgMode, setDlgMode] = useState<'url' | 'file'>('url')
  const [dlgRepo, setDlgRepo] = useState('')
  const [dlgName, setDlgName] = useState('')
  const [dlgSrcURL, setDlgSrcURL] = useState('')
  const [dlgBusy, setDlgBusy] = useState(false)

  // Search state. When `searchHits` is non-null the widget shows results
  // instead of the directory listing; clearing the box returns to browsing.
  const searchUrl = opts.search_url
  const [searchText, setSearchText] = useState('')
  const [searchHits, setSearchHits] = useState<FileBrowserEntry[] | null>(null)
  const [searching, setSearching] = useState(false)

  const listing = useMemo(() => normalizeEntries(data), [data])
  // The active entry set: search results (flat, already files) when a
  // search is in effect, else the sorted directory listing.
  const entries = searchHits ?? listing
  const sorted = useMemo(
    () => (searchHits ? searchHits : sortEntries(listing)),
    [searchHits, listing],
  )
  const segments = useMemo(() => splitPath(currentPath), [currentPath])

  // Simple paging without a total: Next is enabled when the current
  // page came back full (entries.length === pageSize), implying there
  // MIGHT be more. A partial page means "we're on the last page."
  // Backends that want a strict page count can publish it themselves
  // via their own widget; the generic widget stays protocol-agnostic.
  // Paging applies to directory listings only, not search results.
  const hasPrev = !searchHits && page > 1
  const hasNext = !searchHits && listing.length >= pageSize

  const mediaTemplate = opts.media_url_template ?? '/media?namespace={namespace}&path={path}'

  // Reset to page 1 whenever the directory or namespace changes — the
  // current page number is meaningless against the new directory's
  // entry count, and "Photos page 7" after navigating into an empty
  // subfolder is jarring.
  useEffect(() => {
    if (page !== 1) setCtx(pageKey, '1')
    // pageKey/setCtx are stable; only fire on path or bucket change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket, currentPath])

  const navigateTo = (p: string) => setCtx(pathKey, p)
  const goToPage = (n: number) => setCtx(pageKey, String(Math.max(1, n)))
  const toggleViewMode = () => setCtx(viewModeKey, viewMode === 'gallery' ? 'icons' : 'gallery')

  // runSearch POSTs {namespace, query} to search_url and shows the hits.
  // An empty query clears search and returns to the directory listing.
  const runSearch = async () => {
    if (!searchUrl) return
    const q = searchText.trim()
    if (q === '') {
      setSearchHits(null)
      return
    }
    setSearching(true)
    try {
      const res = await fetch((backendUrl ?? '') + searchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Connect-Protocol-Version': '1' },
        body: JSON.stringify({ [bucketParam]: bucket, query: q }),
      })
      if (!res.ok) {
        toast(`Search failed: ${await readConnectErrorMessage(res)}`, 'error')
        return
      }
      const body = (await res.json()) as { hits?: FileBrowserEntry[] }
      // Hits arrive as files with a `path`; tag kind so isFolder/preview work.
      setSearchHits((body.hits ?? []).map((h) => ({ ...h, kind: 'file' })))
    } catch (err) {
      toast(`Search failed: ${errorMessage(err)}`, 'error')
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchText('')
    setSearchHits(null)
  }

  // Leaving search when the user navigates into a folder from a hit.
  const navigateAndClearSearch = (p: string) => {
    clearSearch()
    navigateTo(p)
  }

  // openDialog seeds the repo field from the folder you're in (the common
  // case) and the filename guessed from a URL later. Picks the URL tab when
  // ingest is available, else File.
  const openDialog = () => {
    setDlgRepo(currentPath)
    setDlgName('')
    setDlgSrcURL('')
    setDlgMode(ingestUrl ? 'url' : 'file')
    setDialogOpen(true)
  }

  // submitIngest POSTs {bucket, repo, path, url} to ingest_url; the backend
  // fetches the media server-side (async). Reports "started" and closes.
  const submitIngest = async () => {
    if (!ingestUrl) return
    const repo = dlgRepo.trim()
    const name = dlgName.trim()
    const src = dlgSrcURL.trim()
    if (!repo || !name || !src) {
      toast('Need a folder (repo), a filename, and a URL', 'error')
      return
    }
    setDlgBusy(true)
    try {
      const res = await fetch((backendUrl ?? '') + ingestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Connect-Protocol-Version': '1' },
        body: JSON.stringify({ [bucketParam]: bucket, repo, path: name, url: src }),
      })
      if (!res.ok) {
        throw new Error(await readConnectErrorMessage(res))
      }
      toast(`Fetching ${name} in the background — it'll appear when done.`, 'ok')
      setDialogOpen(false)
    } catch (err) {
      toast(`Ingest failed: ${errorMessage(err)}`, 'error')
    } finally {
      setDlgBusy(false)
    }
  }

  // submitDialogFile uploads a picked file to the chosen repo + filename
  // (so you can target any repo, including from the root, unlike drag-drop
  // which uses the current folder).
  const submitDialogFile = async (file: File) => {
    const repo = dlgRepo.trim()
    const name = (dlgName.trim() || file.name)
    if (!repo) {
      toast('Need a destination folder (repo)', 'error')
      return
    }
    setDlgBusy(true)
    try {
      await uploadOne(file, repo, name)
      toast(`Uploaded ${name}`, 'ok')
      setDialogOpen(false)
      requestRefresh(widgetId ?? '*')
    } catch (err) {
      toast(`Upload failed: ${errorMessage(err)}`, 'error')
    } finally {
      setDlgBusy(false)
    }
  }

  // entryFullPath computes the slash-joined full path for an entry in
  // the current directory. Used everywhere the widget needs a stable
  // identifier (URLs, downloads, queue keys) without depending on any
  // backend-specific id field.
  // Prefer an entry's own `path` (search hits carry it) over deriving it
  // from the current directory (normal listings).
  const entryFullPath = (e: FileBrowserEntry): string =>
    e.path && e.path !== '' ? e.path : joinPath(currentPath, e.name ?? '')

  // Row activation is bound to double-click (not single) so a stray click never
  // opens/downloads a file by accident. Folders navigate; previewable files open
  // the overlay; everything else downloads.
  const onRowClick = (e: FileBrowserEntry) => {
    if (isFolder(e)) {
      // From a search result, jumping into a folder leaves search mode.
      if (searchHits) navigateAndClearSearch(entryFullPath(e))
      else navigateTo(entryFullPath(e))
      return
    }
    // Previewable types open in the overlay; everything else downloads.
    if (mediaTemplate && previewKind(e.content_type, e.name)) {
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
    const downloadURL = opts.download_url
    if (!downloadURL) {
      toast('Download not configured (set options.download_url)', 'error')
      return
    }
    if (!e.name) {
      toast('File has no name', 'error')
      return
    }
    const fullPath = entryFullPath(e)
    const url = (backendUrl ?? '') + downloadURL
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        },
        body: JSON.stringify({ [bucketParam]: bucket, path: fullPath }),
      })
      if (!res.ok) {
        const msg = await readConnectErrorMessage(res)
        toast(`Download failed: ${msg}`, 'error')
        return
      }
      const blob = await parseConnectStream(res, e.content_type)
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = e.name
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 5000)
    } catch (err) {
      toast(`Download failed: ${errorMessage(err)}`, 'error')
    }
  }

  // uploadOne sends a single file to (repo, path). Streaming endpoint when
  // configured (no base64, no full buffering — large files OK), else the
  // base64 SubmitAction fallback. Throws on failure.
  const uploadOne = async (file: File, repo: string, path: string) => {
    const contentType = file.type || 'application/octet-stream'
    if (uploadUrl) {
      const qs = new URLSearchParams({ [bucketParam]: bucket, repo, path, content_type: contentType })
      const res = await fetch(`${backendUrl ?? ''}${uploadUrl}?${qs.toString()}`, { method: 'POST', body: file })
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`)
      return
    }
    const buf = await file.arrayBuffer()
    const url = buildSubmitActionUrl(backendUrl ?? '')
    const req = buildActionRequest({
      actionId: uploadActionId,
      params: { [bucketParam]: bucket, repo, path, content_type: contentType, data_b64: arrayBufferToBase64(buf) },
      clientRequestId: newClientRequestId(),
    })
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connect-Protocol-Version': '1' },
      body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error(await readConnectErrorMessage(res))
  }

  // handleFiles is the drag-drop path: repo = the folder you're viewing,
  // filename = the file's name. Root drops are rejected (no repo). Use the
  // Upload dialog to target an arbitrary repo or upload from the root.
  const handleFiles = async (files: FileList | File[]) => {
    if (currentPath === '') {
      toast('Open a folder first, or use the Upload button to choose a folder.', 'error')
      return
    }
    const repo = currentPath
    setUploading(true)
    let okCount = 0
    for (const f of Array.from(files)) {
      try {
        await uploadOne(f, repo, f.name)
        okCount++
      } catch (err) {
        toast(`Upload failed: ${f.name} — ${errorMessage(err)}`, 'error')
      }
    }
    setUploading(false)
    if (okCount > 0) {
      toast(`Uploaded ${okCount} file${okCount === 1 ? '' : 's'}`, 'ok')
      requestRefresh(widgetId ?? '*')
    }
  }

  return (
    <div
      className="h-full flex flex-col relative"
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
        <div className="ml-auto flex items-center gap-3 text-zinc-500">
          {searchUrl && (
            <div className="flex items-center gap-1">
              <input
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void runSearch()
                  if (e.key === 'Escape') clearSearch()
                }}
                placeholder="Search files…"
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
              />
              <button
                onClick={() => void runSearch()}
                disabled={searching}
                className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1"
                aria-label="Search"
                title="Search this namespace"
              >
                {searching ? '…' : '🔍'}
              </button>
              {searchHits && (
                <button
                  onClick={clearSearch}
                  className="text-zinc-400 hover:text-zinc-100 px-1"
                  title="Clear search, back to browsing"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          {/* Upload: opens a dialog to pick a destination repo + filename,
              and either choose a local file or paste a media URL (HTTP(S) /
              .m3u8) the server fetches itself. Distinct from drag-drop,
              which always targets the current folder. */}
          {(uploadUrl || uploadActionId || ingestUrl) && (
            <button
              onClick={openDialog}
              className="text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5"
              title="Upload a file or fetch a media URL"
            >
              ⬆ Upload
            </button>
          )}
          {/* View-mode toggle. Icons (default) sends ZERO image bytes — the
              row icon is just an emoji. Gallery loads inline thumbnails
              via <img loading="lazy">, browser-cached aggressively by the
              /media handler's Cache-Control for image types. */}
          <button
            onClick={toggleViewMode}
            className="text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5"
            title={viewMode === 'gallery' ? 'Switch to icons (no thumbnails)' : 'Switch to gallery (loads image thumbnails)'}
          >
            {viewMode === 'gallery' ? '◫ Gallery' : '☰ Icons'}
          </button>
          <span className="tabular-nums">
            {searchHits ? `${searchHits.length} result${searchHits.length === 1 ? '' : 's'}` : `${entries.length} on page`}
          </span>
          {(hasPrev || hasNext) && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={!hasPrev}
                className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1"
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className="tabular-nums text-zinc-400">Page {page}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasNext}
                className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative min-h-0">
        {dragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none">
            <div className="text-sky-300 text-sm">Drop files to upload</div>
          </div>
        )}
        {sorted.length === 0 ? (
          <Empty>{searchHits ? 'No files match your search.' : 'This folder is empty. Drop files to upload.'}</Empty>
        ) : viewMode === 'gallery' ? (
          <GalleryGrid
            entries={sorted}
            onClick={onRowClick}
            mediaUrlFor={(e) => (e.name ? (backendUrl ?? '') + buildMediaUrl(mediaTemplate, bucket, entryFullPath(e)) : '')}
          />
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
                  onDoubleClick={() => onRowClick(e)}
                  className="border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none"
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
          mediaUrl={(backendUrl ?? '') + buildMediaUrl(mediaTemplate, bucket, entryFullPath(preview))}
          autoAdvanceQueue={playableQueue(sorted)}
          navigableQueue={navigableQueue(sorted)}
          onSelect={(e) => setPreview(e)}
          onClose={() => setPreview(null)}
          onDownload={() => { void downloadFile(preview) }}
        />
      )}

      {dialogOpen && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/60"
          onClick={() => { if (!dlgBusy) setDialogOpen(false) }}
        >
          <div
            className="flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-100">Upload to {bucket}</h2>
              <button
                onClick={() => { if (!dlgBusy) setDialogOpen(false) }}
                className="text-zinc-500 hover:text-zinc-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Mode tabs: a local File, or a media URL the server fetches.
                The URL tab only shows when ingest_url is configured. */}
            {ingestUrl && (
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => setDlgMode('url')}
                  className={`px-3 py-1 rounded border ${dlgMode === 'url' ? 'border-sky-500 text-sky-300 bg-sky-500/10' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
                >
                  From URL
                </button>
                <button
                  onClick={() => setDlgMode('file')}
                  className={`px-3 py-1 rounded border ${dlgMode === 'file' ? 'border-sky-500 text-sky-300 bg-sky-500/10' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
                >
                  Local file
                </button>
              </div>
            )}

            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Folder (repo)
              <input
                type="text"
                value={dlgRepo}
                onChange={(e) => setDlgRepo(e.target.value)}
                placeholder="e.g. year=2026/name=avatar"
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
              />
              <span className="text-zinc-600">The repository partition. Becomes a source key.</span>
            </label>

            <label className="flex flex-col gap-1 text-xs text-zinc-400">
              Filename {dlgMode === 'file' && '(optional — defaults to the file’s name)'}
              <input
                type="text"
                value={dlgName}
                onChange={(e) => setDlgName(e.target.value)}
                placeholder="e.g. avatar.mp4"
                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
              />
              <span className="text-zinc-600">Location inside the repo (may include subfolders).</span>
            </label>

            {dlgMode === 'url' ? (
              <>
                <label className="flex flex-col gap-1 text-xs text-zinc-400">
                  Media URL
                  <input
                    type="url"
                    value={dlgSrcURL}
                    onChange={(e) => setDlgSrcURL(e.target.value)}
                    placeholder="https://example.com/media.mp4 or https://example.com/playlist.m3u8"
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                  />
                  <span className="text-zinc-600">HTTP(S) media URL or raw HLS playlist. Fetched server-side.</span>
                </label>
                <button
                  onClick={() => void submitIngest()}
                  disabled={dlgBusy}
                  className="self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm"
                >
                  {dlgBusy ? 'Starting…' : 'Fetch & store'}
                </button>
              </>
            ) : (
              <>
                <input
                  type="file"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void submitDialogFile(f)
                  }}
                  disabled={dlgBusy}
                  className="text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
                />
                {dlgBusy && <span className="self-end text-xs text-zinc-400">Uploading…</span>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// GalleryGrid renders entries as a tile grid. Images inside the visible
// area lazy-load their bytes via <img loading="lazy">; off-screen images
// don't fetch until scrolled to. Non-image files (and folders) just show
// an emoji icon — no /media call.
function GalleryGrid({
  entries,
  onClick,
  mediaUrlFor,
}: {
  entries: FileBrowserEntry[]
  onClick: (e: FileBrowserEntry) => void
  mediaUrlFor: (e: FileBrowserEntry) => string
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3">
      {entries.map((e, i) => {
        const kind = previewKind(e.content_type, e.name)
        const isImage = kind === 'image' || kind === 'heic'
        const folder = isFolder(e)
        return (
          <button
            key={`${e.kind ?? ''}:${e.name ?? i}`}
            onDoubleClick={() => onClick(e)}
            className="flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left select-none"
          >
            <div className="w-full aspect-square bg-zinc-950 rounded flex items-center justify-center overflow-hidden">
              {folder ? (
                <span className="text-4xl select-none">📁</span>
              ) : isImage && e.name ? (
                <img
                  src={mediaUrlFor(e)}
                  alt={e.name ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl select-none">📄</span>
              )}
            </div>
            <span className="w-full text-xs text-zinc-200 truncate" title={e.name}>{e.name}</span>
          </button>
        )
      })}
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
  autoAdvanceQueue,
  navigableQueue: navQueue,
  onSelect,
  onClose,
  onDownload,
}: {
  entry: FileBrowserEntry
  mediaUrl: string
  // autoAdvanceQueue is what onEnded (audio/video) walks. Excludes
  // images so finishing track 3 doesn't jump to a photo with no audio
  // playing — the queue dead-ends gracefully.
  autoAdvanceQueue: FileBrowserEntry[]
  // navigableQueue is what arrow-keys + toolbar prev/next walk.
  // Includes images so the overlay doubles as a slideshow.
  navigableQueue: FileBrowserEntry[]
  onSelect: (e: FileBrowserEntry) => void
  onClose: () => void
  onDownload: () => void
}) {
  const kind = previewKind(entry.content_type, entry.name)
  const isTextLike = kind === 'text' || kind === 'json' || kind === 'yaml' || kind === 'csv' || kind === 'markdown'
  // image/video/pdf show a loading sentinel until the element loads.
  // text-family previews fetch the bytes asynchronously.
  const [loading, setLoading] = useState(
    kind === 'image' || kind === 'video' || kind === 'pdf' || kind === 'heic' || kind === 'mkv' || isTextLike,
  )
  const [failed, setFailed] = useState(false)
  const [failedMsg, setFailedMsg] = useState<string | null>(null)
  // For HEIC + MKV the inline element renders a transcoded Blob URL produced
  // client-side. `transcoded` holds it once the WASM helper finishes.
  const [transcoded, setTranscoded] = useState<string | null>(null)
  // Coarse progress text shown for MKV remux (ffmpeg load → fetch → remux).
  const [progress, setProgress] = useState<string>('Loading…')
  // Text-family preview state.
  const [textBody, setTextBody] = useState<string | null>(null)
  const [csvRows, setCsvRows] = useState<string[][] | null>(null)
  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null)

  // Playlist controls (only meaningful when navQueue has > 1 entries
  // and the current kind is part of it — image/audio/video/mkv/heic).
  const queueVisible = navQueue.length > 1
  const queueIndex = navQueue.findIndex((q) => q.name === entry.name)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(true) // sensible default for "play folder"

  // Toolbar prev/next + arrow keys walk navQueue. onEnded (audio/video)
  // uses autoAdvanceQueue so a music playlist doesn't jump to an image
  // at the end of a track.
  const advanceNext = () => {
    const next = nextInQueue(navQueue, entry.name, shuffle, repeat)
    if (next) onSelect(next)
  }
  const advancePrev = () => {
    const prev = prevInQueue(navQueue, entry.name, repeat)
    if (prev) onSelect(prev)
  }
  const autoAdvance = () => {
    const next = nextInQueue(autoAdvanceQueue, entry.name, shuffle, repeat)
    if (next) onSelect(next)
  }

  // Keyboard nav. ← prev, → next, Space toggles play (audio/video only;
  // images shrug it off). Esc is handled by the parent's effect.
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      // Skip when focus is in an input/textarea so the user can type.
      const t = ev.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (ev.key === 'ArrowRight') { ev.preventDefault(); advanceNext() }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); advancePrev() }
      else if (ev.key === ' ') {
        const el = document.querySelector('video, audio') as HTMLMediaElement | null
        if (el) {
          ev.preventDefault()
          if (el.paused) void el.play(); else el.pause()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.name, navQueue.length, shuffle, repeat])
  const onMediaLoad = () => setLoading(false)
  const onMediaError = () => { setLoading(false); setFailed(true); setFailedMsg(null) }
  const backdropClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Drive the HEIC decode / MKV remux off the same `mediaUrl`. Both helpers
  // are dynamic-imported on first use so the WASM cost (~1.5 MB heic, ~30 MB
  // ffmpeg) doesn't land in the FileBrowser's initial bundle. Cleanup
  // revokes the object URL when the overlay closes or the file changes.
  useEffect(() => {
    if (kind !== 'heic' && kind !== 'mkv') return undefined
    let cancelled = false
    let url: string | null = null
    void (async () => {
      try {
        let blob: Blob
        if (kind === 'heic') {
          setProgress('Decoding HEIC…')
          const res = await fetch(mediaUrl)
          if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
          blob = await decodeHeic(await res.blob())
        } else {
          blob = await remuxMkvToMp4(mediaUrl, (m) => { if (!cancelled) setProgress(m) })
        }
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setTranscoded(url)
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        setFailedMsg(errorMessage(err))
        setFailed(true)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [kind, mediaUrl])

  // Text-family previews: fetch + transform. CSV → table rows, JSON →
  // pretty-printed string, markdown → HTML (lazy-loaded `marked`),
  // text/yaml → raw with monospace.
  useEffect(() => {
    if (!isTextLike) return undefined
    let cancelled = false
    void (async () => {
      try {
        const raw = await fetchText(mediaUrl)
        if (cancelled) return
        if (kind === 'csv') {
          setCsvRows(parseCSV(raw))
        } else if (kind === 'json') {
          setTextBody(prettyJSON(raw))
        } else if (kind === 'markdown') {
          setMarkdownHtml(await renderMarkdown(raw))
        } else {
          setTextBody(raw)
        }
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        setFailedMsg(errorMessage(err))
        setFailed(true)
        setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [kind, isTextLike, mediaUrl])

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
        {queueVisible && (
          <div className="flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2">
            <button
              onClick={advancePrev}
              className="hover:text-zinc-100 leading-none px-1"
              aria-label="Previous (←)"
              title="Previous (←)"
            >
              ⏮
            </button>
            <button
              onClick={advanceNext}
              className="hover:text-zinc-100 leading-none px-1"
              aria-label="Next (→)"
              title="Next (→)"
            >
              ⏭
            </button>
            <button
              onClick={() => setShuffle((v) => !v)}
              className={`px-1 leading-none ${shuffle ? 'text-sky-400' : 'hover:text-zinc-100'}`}
              aria-label="Toggle shuffle"
              title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            >
              🔀
            </button>
            <button
              onClick={() => setRepeat((v) => !v)}
              className={`px-1 leading-none ${repeat ? 'text-sky-400' : 'hover:text-zinc-100'}`}
              aria-label="Toggle repeat"
              title={repeat ? 'Repeat on' : 'Repeat off'}
            >
              🔁
            </button>
            <span className="text-xs text-zinc-500 tabular-nums">
              {queueIndex >= 0 ? queueIndex + 1 : '–'} / {navQueue.length}
            </span>
          </div>
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
        className="flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative"
        onClick={backdropClose}
      >
        {loading && !failed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-zinc-500 text-xs uppercase tracking-wider">{progress}</div>
          </div>
        )}
        {failed && (
          <div className="flex flex-col items-center gap-3 text-zinc-300 text-sm max-w-md text-center">
            <span className="text-zinc-500">⚠ Preview couldn't load.</span>
            {failedMsg && (
              <span className="text-zinc-600 text-xs font-mono break-words">{failedMsg}</span>
            )}
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
            onEnded={autoAdvance}
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
              onEnded={autoAdvance}
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
        {!failed && kind === 'heic' && transcoded && (
          <img
            src={transcoded}
            alt={entry.name ?? ''}
            decoding="async"
            onError={onMediaError}
            className="max-h-full max-w-full object-contain rounded shadow-2xl"
          />
        )}
        {!failed && kind === 'mkv' && transcoded && (
          <video
            src={transcoded}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onLoadedMetadata={onMediaLoad}
            onEnded={autoAdvance}
            onError={onMediaError}
            className="max-h-full max-w-full bg-black rounded shadow-2xl"
          />
        )}
        {!failed && (kind === 'text' || kind === 'json' || kind === 'yaml') && textBody !== null && (
          <pre className="w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words">
            {textBody}
          </pre>
        )}
        {!failed && kind === 'markdown' && markdownHtml !== null && (
          <div
            className="w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none"
            // marked is the trust boundary; v18+ sanitises by default.
            dangerouslySetInnerHTML={{ __html: markdownHtml }}
          />
        )}
        {!failed && kind === 'csv' && csvRows !== null && (
          <div className="w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl">
            <table className="border-collapse">
              {csvRows.length > 0 && (
                <thead>
                  <tr>
                    {csvRows[0].map((h, i) => (
                      <th key={i} className="border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800">{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {csvRows.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-zinc-800 px-2 py-1 align-top">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
