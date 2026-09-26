import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button, IconButton } from '../components/Button'
import { Tag } from '../components/Feedback'
import { FormField, Input } from '../components/FormControls'
import { Icon } from '../components/Icon'
import { Breadcrumbs } from '../components/Navigation'
import { Dialog, type MenuItem } from '../components/Overlays'
import { Pagination } from '../components/Pagination'
import { SearchField } from '../components/SearchField'
import { FilePreview } from '../files/FilePreview'
import { useLocale } from '../foundations/DesignSystemProvider'
import { formatBytes, formatDateTime } from '../foundations/intl'
import { DataGrid, type DataGridColumn } from '../workbench/DataGrid'
import { useDashboard } from '../core/DashboardContext'
import {
  useAssetOpen,
  type AssetOpenFallbacks,
  type AssetOpenRequest,
} from '../core/AssetOpen'
import {
  buildSubmitActionUrl,
  buildActionRequest,
  newClientRequestId,
} from '../core/resolveSource'
import { Empty } from './states'
import {
  isFolder,
  fileEntryIdentity,
  normalizeEntries,
  sortEntries,
  splitPath,
  joinPath,
  humanSize,
  arrayBufferToBase64,
  parseConnectStream,
  readConnectErrorMessage,
  previewKind,
  isNativePreviewKind,
  buildMediaUrl,
  playableQueue,
  navigableQueue,
  nextInQueue,
  prevInQueue,
  errorMessage,
  resolveEndpointUrl,
  backendHeadersForEndpoint,
  transportForEndpoint,
  type FileBrowserEntry,
} from './fileBrowserHelpers'
import { isErrorStatus, isTerminalStatus } from '../hooks/useWatchAction'
import { cx, handleModalKeyDown, useModalFocus } from '../components/utils'
import type { WidgetProps } from '../types/template'

// FileBrowser is a generic file-pane primitive: breadcrumb header +
// folder/file list + drag-drop upload zone + preview overlay. Designed
// for object-store-shaped backends — the widget knows nothing about
// any specific protocol or backend; it composes paths, fires
// configured URLs, and surfaces the data the source returned.
//
// Entry shape remains path-compatible while optionally accepting stable
// object identity, semantic kind/capabilities, and unresolved link metadata.
//
// Backend contract:
//   - Listing: returned via the dashboard source mechanism. Pagination
//     is driven through the ctx keys named in `page_ctx` / `page_size_ctx`.
//   - Upload: SubmitAction with options.upload_action_id (default
//     "upload") and payload
//     { [bucket_param], repo, path, content_type, data_b64 }.
//   - Download: POST to options.download_url with body
//     { [bucket_param], path }; response is parsed as a Connect
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
  // Workspace application integration. Enabled automatically when the host
  // provides Dashboard.resolveAssetIntent; set false for a native-only pane.
  open_with?: boolean
  // Optional intent override. By default video/audio use "play" and every
  // other file uses "view".
  open_intent?: string
}

/**
 * Host extension points of the file browser. Register a wrapper to use
 * them: `registry.register('file_browser', props => <FileBrowser {...props}
 * entryHref={...} />)`. The widget's payload and options are unchanged.
 */
export interface FileBrowserExtensions {
  /** Leading icon for an entry; a folder or file glyph by default. */
  entryIcon?: (entry: FileBrowserEntry) => ReactNode
  /** A link for an entry's name (one per row), such as a product route. */
  entryHref?: (entry: FileBrowserEntry, path: string) => string | undefined
  /** Row selection; `single` by default. */
  selection?: 'none' | 'single' | 'multi'
  /** Controlled selection, by `fileEntryIdentity`. */
  selectedIds?: readonly string[]
  /** Called with the selected entries after every change. */
  onSelectionChange?: (entries: FileBrowserEntry[]) => void
  /** Commands for an entry's context menu (right-click, Menu key, Shift+F10). */
  contextActions?: (entry: FileBrowserEntry, path: string) => readonly MenuItem[]
  /**
   * Called when an entry is opened (Enter, double-click, or a plain click on
   * its link); return `true` to handle it instead of the built-in behaviour
   * (navigate into folders, preview or download files).
   */
  onOpen?: (entry: FileBrowserEntry, path: string) => boolean | void
}

/** Props of the file browser widget: the widget props plus extension points. */
export type FileBrowserProps = WidgetProps & FileBrowserExtensions

export function FileBrowser({
  data,
  options,
  widgetId,
  entryIcon,
  entryHref,
  selection = 'single',
  selectedIds,
  onSelectionChange,
  contextActions,
  onOpen,
}: FileBrowserProps) {
  const { locale, timeZone } = useLocale()
  const opts = (options ?? {}) as FileBrowserOptions
  const {
    ctx,
    setCtx,
    backendUrl,
    backendHeaders,
    fetch: backendFetch,
    toast,
    requestRefresh,
    emitIntent,
  } = useDashboard()
  const {
    available: assetApplicationsAvailable,
    openAsset,
    openWith,
  } = useAssetOpen()

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
  const uploadInFlight = useRef(false)
  const [preview, setPreview] = useState<FileBrowserEntry | null>(null)
  const [internalSelection, setInternalSelection] = useState<string[]>([])

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
  const searchController = useRef<AbortController | null>(null)

  useEffect(() => () => searchController.current?.abort(), [])

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
  const openWithEnabled = assetApplicationsAvailable && opts.open_with !== false

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
      clearSearch()
      return
    }
    // State-backed `disabled` props do not close the same-turn double-submit
    // window. Keep a synchronous transport guard, and let clearSearch abort
    // the request so a stale response cannot restore results after Escape.
    if (searchController.current) return
    const controller = new AbortController()
    searchController.current = controller
    setSearching(true)
    try {
      const endpoint = resolveEndpointUrl(backendUrl, searchUrl)
      const res = await transportForEndpoint(backendUrl, endpoint, backendFetch)(endpoint, {
        method: 'POST',
        headers: {
          ...backendHeadersForEndpoint(backendUrl, endpoint, backendHeaders),
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        },
        body: JSON.stringify({ [bucketParam]: bucket, query: q }),
        signal: controller.signal,
      })
      if (!res.ok) {
        toast(`Search failed: ${await readConnectErrorMessage(res)}`, 'error')
        return
      }
      const body = (await res.json()) as { hits?: FileBrowserEntry[] }
      if (searchController.current !== controller) return
      // Hits arrive as files with a `path`; tag kind so isFolder/preview work.
      setSearchHits((body.hits ?? []).map((h) => ({ ...h, kind: 'file' })))
    } catch (err) {
      if (!controller.signal.aborted) toast(`Search failed: ${errorMessage(err)}`, 'error')
    } finally {
      if (searchController.current === controller) {
        searchController.current = null
        setSearching(false)
      }
    }
  }

  const clearSearch = () => {
    searchController.current?.abort()
    searchController.current = null
    setSearching(false)
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
    if (uploadInFlight.current) {
      toast('Another file operation is already in progress', 'warn')
      return
    }
    uploadInFlight.current = true
    setDlgBusy(true)
    try {
      const endpoint = resolveEndpointUrl(backendUrl, ingestUrl)
      const res = await transportForEndpoint(backendUrl, endpoint, backendFetch)(endpoint, {
        method: 'POST',
        headers: {
          ...backendHeadersForEndpoint(backendUrl, endpoint, backendHeaders),
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        },
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
      uploadInFlight.current = false
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
    if (uploadInFlight.current) {
      toast('Another file operation is already in progress', 'warn')
      return
    }
    uploadInFlight.current = true
    setDlgBusy(true)
    try {
      await uploadOne(file, repo, name)
      toast(`Uploaded ${name}`, 'ok')
      setDialogOpen(false)
      requestRefresh(widgetId ?? '*')
    } catch (err) {
      toast(`Upload failed: ${errorMessage(err)}`, 'error')
    } finally {
      uploadInFlight.current = false
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

  const mediaUrlFor = (e: FileBrowserEntry): string => (
    mediaTemplate && e.name
      ? resolveEndpointUrl(
          backendUrl,
          buildMediaUrl(mediaTemplate, bucket, entryFullPath(e)),
        )
      : ''
  )

  const assetRequestFor = (e: FileBrowserEntry): AssetOpenRequest => {
    const kind = previewKind(e.content_type, e.name, e.kind)
    const intent = opts.open_intent
      ?? (kind === 'video' || kind === 'audio' || kind === 'mkv' ? 'play' : 'view')
    return {
      asset: {
        id: e.id ?? e.object_id,
        namespace: bucket,
        path: entryFullPath(e),
        name: e.name ?? (entryFullPath(e) || 'Untitled file'),
        kind: e.kind,
        contentType: e.content_type,
        sizeBytes: e.size_bytes,
        modifiedAt: e.modified_at,
        capabilities: e.capabilities,
        symlinkTargetId: e.symlink_target_id,
        url: mediaUrlFor(e) || undefined,
        metadata: {
          ...e.metadata,
        },
      },
      intent,
      source: { component: 'file_browser', widgetId },
    }
  }

  const fallbacksFor = (e: FileBrowserEntry): AssetOpenFallbacks => {
    const kind = previewKind(e.content_type, e.name, e.kind)
    const canPreview = !!mediaTemplate && isNativePreviewKind(kind)
    return {
      native: canPreview ? () => setPreview(e) : undefined,
      nativeLabel: canPreview ? 'Native preview' : undefined,
      download: opts.download_url ? () => downloadFile(e) : undefined,
    }
  }

  const openWithApplications = (e: FileBrowserEntry) => {
    void openWith(assetRequestFor(e), fallbacksFor(e))
  }

  const selectEntry = (e: FileBrowserEntry) => {
    const objectId = e.id ?? e.object_id
    if (objectId) emitIntent?.({ type: 'object.select', objectId })
  }

  // Row activation is bound to double-click (not single) so a stray click never
  // opens/downloads a file by accident. Folders navigate; files first resolve
  // the workspace's preferred application and retain native preview/download as
  // zero-configuration fallbacks.
  const onRowClick = (e: FileBrowserEntry) => {
    if (onOpen?.(e, entryFullPath(e)) === true) return
    const objectId = e.id ?? e.object_id
    if (objectId) {
      emitIntent?.({
        type: 'object.open',
        objectId,
        mode: isFolder(e) ? 'browse' : (opts.open_intent ?? 'preview'),
      })
    }
    if (isFolder(e)) {
      // From a search result, jumping into a folder leaves search mode.
      if (searchHits) navigateAndClearSearch(entryFullPath(e))
      else navigateTo(entryFullPath(e))
      return
    }
    if (assetApplicationsAvailable && opts.open_with !== false) {
      void openAsset(assetRequestFor(e), fallbacksFor(e))
      return
    }
    // Previewable types open in the overlay; everything else downloads.
    if (
      mediaTemplate
      && isNativePreviewKind(previewKind(e.content_type, e.name, e.kind))
    ) {
      setPreview(e)
      return
    }
    void downloadFile(e)
  }

  async function downloadFile(e: FileBrowserEntry) {
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
    const url = resolveEndpointUrl(backendUrl, downloadURL)
    try {
      const res = await transportForEndpoint(backendUrl, url, backendFetch)(url, {
        method: 'POST',
        headers: {
          ...backendHeadersForEndpoint(backendUrl, url, backendHeaders),
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
      const endpoint = resolveEndpointUrl(backendUrl, uploadUrl)
      const separator = endpoint.includes('?') ? '&' : '?'
      const res = await transportForEndpoint(backendUrl, endpoint, backendFetch)(`${endpoint}${separator}${qs.toString()}`, {
        method: 'POST',
        headers: backendHeadersForEndpoint(backendUrl, endpoint, backendHeaders),
        body: file,
      })
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
    const res = await (backendFetch ?? globalThis.fetch)(url, {
      method: 'POST',
      headers: { ...backendHeaders, 'Content-Type': 'application/json', 'Connect-Protocol-Version': '1' },
      body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error(await readConnectErrorMessage(res))
    const reply = await res.json() as { status?: string; message?: string }
    if (!isTerminalStatus(reply.status)) {
      throw new Error(reply.message ?? 'Upload action did not return a terminal status')
    }
    if (isErrorStatus(reply.status)) {
      throw new Error(reply.message ?? 'Upload action failed')
    }
  }

  // handleFiles is the drag-drop path: repo = the folder you're viewing,
  // filename = the file's name. Root drops are rejected (no repo). Use the
  // Upload dialog to target an arbitrary repo or upload from the root.
  const handleFiles = async (files: FileList | File[]) => {
    if (currentPath === '') {
      toast('Open a folder first, or use the Upload button to choose a folder.', 'error')
      return
    }
    if (uploadInFlight.current) {
      toast('Another file operation is already in progress', 'warn')
      return
    }
    uploadInFlight.current = true
    const repo = currentPath
    setUploading(true)
    let okCount = 0
    try {
      for (const f of Array.from(files)) {
        try {
          await uploadOne(f, repo, f.name)
          okCount++
        } catch (err) {
          toast(`Upload failed: ${f.name} — ${errorMessage(err)}`, 'error')
        }
      }
    } finally {
      uploadInFlight.current = false
      setUploading(false)
    }
    if (okCount > 0) {
      toast(`Uploaded ${okCount} file${okCount === 1 ? '' : 's'}`, 'ok')
      requestRefresh(widgetId ?? '*')
    }
  }

  const identity = (entry: FileBrowserEntry) => fileEntryIdentity(entry, currentPath) || entryFullPath(entry)
  const columns: DataGridColumn<FileBrowserEntry>[] = [
    {
      id: 'name',
      header: 'Name',
      width: 280,
      grow: true,
      sortValue: entry => `${isFolder(entry) ? 0 : 1}${(entry.name ?? '').toLowerCase()}`,
      cell: entry => (
        <span className="mtc-file-name">
          <span className="mtc-file-icon" aria-hidden="true">
            {entryIcon?.(entry) ?? <Icon name={isFolder(entry) ? 'folder' : 'file'} />}
          </span>
          <span className="mtc-file-name-text">{entry.name}</span>
        </span>
      ),
    },
    {
      id: 'size',
      header: 'Size',
      width: 104,
      align: 'end',
      sortValue: entry => (isFolder(entry) ? null : entry.size_bytes ?? null),
      cell: entry => (isFolder(entry) || entry.size_bytes == null
        ? <span className="mtc-value-empty">—</span>
        : formatBytes(entry.size_bytes, { locale })),
    },
    {
      id: 'type',
      header: 'Type',
      width: 160,
      accessor: entry => (isFolder(entry) ? 'Folder' : entry.content_type ?? ''),
    },
    {
      id: 'modified',
      header: 'Modified',
      width: 176,
      sortValue: entry => (entry.modified_at ? Date.parse(entry.modified_at) || entry.modified_at : null),
      cell: entry => (entry.modified_at
        ? <time dateTime={entry.modified_at}>{formatDateTime(entry.modified_at, { locale, timeZone })}</time>
        : <span className="mtc-value-empty">—</span>),
    },
    ...(openWithEnabled ? [{
      id: 'actions',
      header: 'Actions',
      width: 72,
      sortable: false,
      cell: (entry: FileBrowserEntry) => (isFolder(entry) ? null : (
        <IconButton
          icon={<Icon name="more" />}
          variant="ghost"
          size="small"
          tabIndex={-1}
          aria-label={`Open ${entry.name ?? 'file'} with another application`}
          onClick={event => {
            event.stopPropagation()
            openWithApplications(entry)
          }}
        />
      )),
    } satisfies DataGridColumn<FileBrowserEntry>] : []),
  ]
  const selectedKeys = selectedIds ?? internalSelection
  const changeSelection = (keys: string[]) => {
    if (!selectedIds) setInternalSelection(keys)
    const chosen = sorted.filter(entry => keys.includes(identity(entry)))
    onSelectionChange?.(chosen)
    if (chosen.length === 1) selectEntry(chosen[0]!)
  }

  return (
    <div
      className="mtc-file-browser h-full flex flex-col relative"
      data-mtc-file-browser=""
      data-mtc-path={currentPath}
      data-mtc-view={viewMode}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (e.dataTransfer.files.length > 0) void handleFiles(e.dataTransfer.files)
      }}
    >
      <div className="mtc-file-browser-toolbar" data-mtc-part="toolbar">
        <Breadcrumbs
          label="Folder path"
          items={[
            { id: '/', label: bucket, onSelect: () => navigateTo('') },
            ...segments.map((segment, index) => ({
              id: segments.slice(0, index + 1).join('/'),
              label: segment,
              onSelect: () => navigateTo(segments.slice(0, index + 1).join('/')),
            })),
          ]}
        />
        <div className="mtc-file-browser-actions">
          {searchUrl && (
            <SearchField
              label="Search files"
              placeholder="Search files"
              size="small"
              value={searchText}
              onValueChange={value => {
                setSearchText(value)
                if (value === '' && searchHits) clearSearch()
              }}
              onSubmit={() => void runSearch()}
              aria-busy={searching || undefined}
              className="mtc-file-browser-search"
            />
          )}
          {searchHits && <Tag onRemove={clearSearch} removeLabel="Clear search, back to browsing">Search results</Tag>}
          {/* Upload: pick a destination repo and filename, then a local file
              or a media URL the server fetches itself. Drag-drop always
              targets the current folder. */}
          {(uploadUrl || uploadActionId || ingestUrl) && (
            <Button size="small" startIcon={<Icon name="upload" />} onClick={openDialog} title="Upload a file or fetch a media URL">
              Upload
            </Button>
          )}
          {/* List sends no image bytes; the gallery loads lazy thumbnails. */}
          <Button
            size="small"
            variant="ghost"
            startIcon={<Icon name={viewMode === 'gallery' ? 'table' : 'image'} />}
            onClick={toggleViewMode}
            aria-pressed={viewMode === 'gallery'}
            title={viewMode === 'gallery' ? 'Switch to the list (no thumbnails)' : 'Switch to the gallery (loads image thumbnails)'}
          >
            Gallery
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative min-h-0 flex flex-col" data-mtc-part={viewMode === 'gallery' ? 'gallery' : 'list'}>
        {dragging && (
          <div className="mtc-file-browser-drop" aria-hidden="true">
            <Icon name="upload" /> Drop files to upload
          </div>
        )}
        {sorted.length === 0 ? (
          <Empty>{searchHits ? 'No files match your search.' : 'This folder is empty. Drop files to upload.'}</Empty>
        ) : viewMode === 'gallery' ? (
          <div className="flex-1 overflow-auto">
            <GalleryGrid
              entries={sorted}
              onClick={onRowClick}
              onSelect={selectEntry}
              onOpenWith={openWithEnabled ? openWithApplications : undefined}
              mediaUrlFor={mediaUrlFor}
              entryKey={identity}
              entryIcon={entryIcon}
            />
          </div>
        ) : (
          <DataGrid
            label={searchHits ? 'Search results' : `Files in ${currentPath || bucket}`}
            className="mtc-file-browser-grid"
            columns={columns}
            rows={sorted}
            rowKey={identity}
            rowLabel={entry => entry.name ?? entryFullPath(entry)}
            selection={selection}
            selectedKeys={selectedKeys}
            onSelectionChange={changeSelection}
            onRowActivate={onRowClick}
            rowHref={entryHref ? entry => entryHref(entry, entryFullPath(entry)) : undefined}
            onNavigate={entryHref && onOpen ? (entry => {
              if (onOpen(entry, entryFullPath(entry)) !== true) onRowClick(entry)
            }) : undefined}
            contextActions={contextActions ? entry => contextActions(entry, entryFullPath(entry)) : undefined}
            rowProps={entry => ({
              'data-mtc-entry-kind': isFolder(entry) ? 'folder' : 'file',
              'data-mtc-entry-id': entry.id ?? entry.object_id,
              'data-mtc-entry-path': entryFullPath(entry),
            })}
            footer={searchHits
              ? <span>{searchHits.length} result{searchHits.length === 1 ? '' : 's'}</span>
              : (hasPrev || hasNext)
                ? <Pagination label="File pages" summary={`${entries.length} on page`} page={page} hasNext={hasNext} onPageChange={goToPage} />
                : <span>{entries.length} on page</span>}
          />
        )}

        {uploading && (
          <div className="mtc-file-browser-uploading" role="status">
            Uploading…
          </div>
        )}
      </div>

      {preview && (
        <PreviewOverlay
          entry={preview}
          mediaUrl={mediaUrlFor(preview)}
          fetch={transportForEndpoint(backendUrl, mediaUrlFor(preview), backendFetch)}
          autoAdvanceQueue={playableQueue(sorted)}
          navigableQueue={navigableQueue(sorted)}
          onSelect={(e) => setPreview(e)}
          onClose={() => setPreview(null)}
          onDownload={() => { void downloadFile(preview) }}
          onOpenWith={openWithEnabled ? () => openWithApplications(preview) : undefined}
        />
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={open => { if (!dlgBusy) setDialogOpen(open) }}
        title={`Upload to ${bucket}`}
        dismissible={!dlgBusy}
        className="mtc-file-browser-upload"
        footer={dlgMode === 'url' ? (
          <Button intent="primary" variant="solid" loading={dlgBusy} loadingLabel="Starting…" onClick={() => void submitIngest()}>
            Fetch and store
          </Button>
        ) : undefined}
      >
        <div className="grid gap-3" data-mtc-part="upload-dialog">
          {/* A local file, or a media URL the server fetches (only with ingest_url). */}
          {ingestUrl && (
            <div role="group" aria-label="Upload source" className="flex gap-1">
              <Button size="small" variant={dlgMode === 'url' ? 'solid' : 'outline'} intent={dlgMode === 'url' ? 'primary' : 'neutral'} aria-pressed={dlgMode === 'url'} onClick={() => setDlgMode('url')}>
                From URL
              </Button>
              <Button size="small" variant={dlgMode === 'file' ? 'solid' : 'outline'} intent={dlgMode === 'file' ? 'primary' : 'neutral'} aria-pressed={dlgMode === 'file'} onClick={() => setDlgMode('file')}>
                Local file
              </Button>
            </div>
          )}
          <FormField label="Folder (repo)" description="The repository partition. Becomes a source key.">
            <Input value={dlgRepo} onChange={(e) => setDlgRepo(e.target.value)} placeholder="e.g. year=2026/name=avatar" />
          </FormField>
          <FormField
            label={dlgMode === 'file' ? 'Filename (optional; defaults to the file’s name)' : 'Filename'}
            description="Location inside the repo (may include subfolders)."
          >
            <Input value={dlgName} onChange={(e) => setDlgName(e.target.value)} placeholder="e.g. avatar.mp4" />
          </FormField>
          {dlgMode === 'url' ? (
            <FormField label="Media URL" description="HTTP(S) media URL or raw HLS playlist. Fetched server-side.">
              <Input
                type="url"
                value={dlgSrcURL}
                onChange={(e) => setDlgSrcURL(e.target.value)}
                placeholder="https://example.com/media.mp4 or https://example.com/playlist.m3u8"
              />
            </FormField>
          ) : (
            <FormField label="File">
              <Input
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void submitDialogFile(f)
                }}
                disabled={dlgBusy}
              />
            </FormField>
          )}
          {dlgBusy && dlgMode === 'file' && <p className="text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]" role="status">Uploading…</p>}
        </div>
      </Dialog>
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
  onSelect,
  onOpenWith,
  mediaUrlFor,
  entryKey,
  entryIcon,
}: {
  entries: FileBrowserEntry[]
  onClick: (e: FileBrowserEntry) => void
  onSelect?: (e: FileBrowserEntry) => void
  onOpenWith?: (e: FileBrowserEntry) => void
  mediaUrlFor: (e: FileBrowserEntry) => string
  entryKey: (e: FileBrowserEntry) => string
  entryIcon?: (e: FileBrowserEntry) => ReactNode
}) {
  return (
    <div className="mtc-file-gallery">
      {entries.map((e, i) => {
        const kind = previewKind(e.content_type, e.name, e.kind)
        const isImage = kind === 'image'
        const folder = isFolder(e)
        return (
          <div
            key={entryKey(e) || String(i)}
            className="mtc-file-tile"
            data-mtc-entry-kind={folder ? 'folder' : 'file'}
            data-mtc-entry-id={e.id ?? e.object_id}
          >
            <button
              type="button"
              onClick={() => onSelect?.(e)}
              onDoubleClick={() => onClick(e)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  onClick(e)
                }
              }}
              className="mtc-file-tile-button"
            >
              <span className="mtc-file-tile-media">
                {isImage && e.name ? (
                  <img src={mediaUrlFor(e)} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="mtc-file-tile-icon" aria-hidden="true">
                    {entryIcon?.(e) ?? <Icon name={folder ? 'folder' : 'file'} size={32} strokeWidth={1.5} />}
                  </span>
                )}
              </span>
              <span className="mtc-file-tile-name" title={e.name}>{e.name}</span>
            </button>
            {onOpenWith && !folder && (
              <IconButton
                icon={<Icon name="more" />}
                size="small"
                className="mtc-file-tile-more"
                aria-label={`Open ${e.name ?? 'file'} with another application`}
                title="Open with…"
                onClick={() => onOpenWith(e)}
                onDoubleClick={event => event.stopPropagation()}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// PreviewOverlay covers the FileBrowser area with a modal preview. Audio and
// video play natively (the browser drives Range requests, and finishing a
// track advances the queue); everything else goes through the toolkit
// FilePreview, so previews are bounded and signature-checked: text reads at
// most 1 MB, CSV at most 1,000 rows, a renamed SVG never renders as an
// image, and HTML is shown as source.
function PreviewOverlay({
  entry,
  mediaUrl,
  fetch: transport,
  autoAdvanceQueue,
  navigableQueue: navQueue,
  onSelect,
  onClose,
  onDownload,
  onOpenWith,
}: {
  entry: FileBrowserEntry
  mediaUrl: string
  fetch?: typeof globalThis.fetch
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
  onOpenWith?: () => void
}) {
  const kind = previewKind(entry.content_type, entry.name, entry.kind)
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [mediaUrl])

  // Playlist controls (only meaningful when navQueue has > 1 entries
  // and the current kind is part of it — image/audio/video).
  const queueVisible = navQueue.length > 1
  const entryIdentity = fileEntryIdentity(entry)
  const queueIndex = navQueue.findIndex((q) => fileEntryIdentity(q) === entryIdentity)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(true) // sensible default for "play folder"
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useModalFocus(true, overlayRef, closeRef)

  // Toolbar prev/next + arrow keys walk navQueue. onEnded (audio/video)
  // uses autoAdvanceQueue so a music playlist doesn't jump to an image
  // at the end of a track.
  const advanceNext = () => {
    const next = nextInQueue(navQueue, entryIdentity, shuffle, repeat)
    if (next) onSelect(next)
  }
  const advancePrev = () => {
    const prev = prevInQueue(navQueue, entryIdentity, repeat)
    if (prev) onSelect(prev)
  }
  const autoAdvance = () => {
    const next = nextInQueue(autoAdvanceQueue, entryIdentity, shuffle, repeat)
    if (next) onSelect(next)
  }

  const media = kind === 'video' || kind === 'audio'
  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${entry.name ?? 'file'}`}
      tabIndex={-1}
      className="mtc-file-preview-overlay"
      data-mtc-part="preview"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        handleModalKeyDown(event, overlayRef, true, onClose)
        if (event.defaultPrevented) return
        const target = event.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
        if (target.closest('[role="grid"], pre')) return
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          advanceNext()
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          advancePrev()
        } else if (event.key === ' ') {
          const element = overlayRef.current?.querySelector('video, audio') as HTMLMediaElement | null
          if (element) {
            event.preventDefault()
            if (element.paused) void element.play()
            else element.pause()
          }
        }
      }}
    >
      <div className="mtc-file-preview-bar">
        <span className="mtc-file-preview-name">{entry.name}</span>
        {entry.content_type && <span className="mtc-file-preview-meta">{entry.content_type}</span>}
        {typeof entry.size_bytes === 'number' && (
          <span className="mtc-file-preview-meta">{humanSize(entry.size_bytes)}</span>
        )}
        {queueVisible && (
          <div className="mtc-file-preview-queue" role="group" aria-label="Queue">
            <IconButton icon={<Icon name="chevron-left" />} variant="ghost" size="small" aria-label="Previous (←)" onClick={advancePrev} />
            <IconButton icon={<Icon name="chevron-right" />} variant="ghost" size="small" aria-label="Next (→)" onClick={advanceNext} />
            <Button size="small" variant="ghost" aria-pressed={shuffle} onClick={() => setShuffle((v) => !v)}>Shuffle</Button>
            <Button size="small" variant="ghost" aria-pressed={repeat} onClick={() => setRepeat((v) => !v)}>Repeat</Button>
            <span className="mtc-file-preview-meta">
              {queueIndex >= 0 ? queueIndex + 1 : '–'} / {navQueue.length}
            </span>
          </div>
        )}
        {onOpenWith && (
          <Button size="small" variant="ghost" onClick={onOpenWith}>Open with…</Button>
        )}
        <Button size="small" startIcon={<Icon name="download" />} onClick={onDownload}>Download</Button>
        <IconButton ref={closeRef} icon={<Icon name="close" />} variant="ghost" size="small" aria-label="Close preview" onClick={onClose} />
      </div>
      <div
        className={cx('mtc-file-preview-stage', media && 'mtc-file-preview-stage-media')}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        {media && failed ? (
          <Empty>Preview could not load. Use Download instead.</Empty>
        ) : kind === 'video' ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onEnded={autoAdvance}
            onError={() => setFailed(true)}
            className="mtc-file-preview-media"
          />
        ) : kind === 'audio' ? (
          <div className="mtc-file-preview-audio-card">
            <Icon name="music" size={32} />
            <span className="mtc-file-preview-name" title={entry.name}>{entry.name}</span>
            <audio
              src={mediaUrl}
              controls
              autoPlay
              preload="metadata"
              onEnded={autoAdvance}
              onError={() => setFailed(true)}
              className="mtc-file-preview-audio"
            />
          </div>
        ) : (
          <FilePreview
            key={mediaUrl}
            file={{ name: entry.name ?? '', url: mediaUrl, contentType: entry.content_type, sizeBytes: entry.size_bytes }}
            fetch={transport}
            onDownload={onDownload}
            height="calc(100vh - 8rem)"
            className="mtc-file-preview-body"
          />
        )}
      </div>
    </div>
  )
}
