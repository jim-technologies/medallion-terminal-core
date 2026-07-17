import { useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import { humanSize } from './fileBrowserHelpers'
import { normalizeRepository, type RepositoryEntryData } from './platformShapes'
import { Empty } from './states'
import { safeUrl } from './textNormalize'

interface CodeBrowserOptions {
  repository_ctx?: string
  ref_ctx?: string
  path_ctx?: string
  wrap?: boolean
}

// Branch/ref-aware source repository browser. Navigation is context-
// driven so the backend remains authoritative for permissions, refs,
// directory listings, large-file truncation, and raw download URLs.
export function CodeBrowser({ data, options }: WidgetProps) {
  const repository = useMemo(() => normalizeRepository(data), [data])
  const opts = (options ?? {}) as CodeBrowserOptions
  const { setCtx } = useDashboard()
  const [copied, setCopied] = useState(false)

  if (!repository) return <Empty>No repository data</Empty>

  const repositoryKey = opts.repository_ctx ?? 'repository'
  const refKey = opts.ref_ctx ?? 'repo_ref'
  const pathKey = opts.path_ctx ?? 'repo_path'
  const entries = [...repository.entries].sort((a, b) => {
    if (a.kind === b.kind) return a.name.localeCompare(b.name)
    if (a.kind === 'directory') return -1
    if (b.kind === 'directory') return 1
    return a.name.localeCompare(b.name)
  })
  const repositoryUrl = safeUrl(repository.url)
  const fileUrl = safeUrl(repository.file?.url)
  const segments = repository.path.split('/').filter(Boolean)

  const selectRepository = () => {
    if (repository.repository) setCtx(repositoryKey, repository.repository)
  }

  const selectRef = (ref: string) => {
    setCtx(refKey, ref)
    setCtx(pathKey, '')
  }

  const selectEntry = (entry: RepositoryEntryData) => {
    setCtx(pathKey, entry.path)
  }

  const copyFile = async () => {
    if (!repository.file || typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(repository.file.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs shrink-0 min-w-0">
        <button
          onClick={selectRepository}
          className="font-medium text-zinc-100 hover:text-sky-300 truncate"
          title={repository.repository}
        >
          {repository.repository || 'repository'}
        </button>
        {repositoryUrl && (
          <a
            href={repositoryUrl}
            {...(repositoryUrl.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="text-zinc-600 hover:text-sky-300 shrink-0"
            title="Open repository"
          >
            ↗
          </a>
        )}
        <span className="text-zinc-700">/</span>
        {repository.refs.length > 1 ? (
          <select
            value={repository.ref}
            onChange={(event) => selectRef(event.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-zinc-600 shrink-0"
            aria-label="Repository ref"
          >
            {repository.refs.map((ref) => <option key={ref} value={ref}>{ref}</option>)}
          </select>
        ) : (
          <span className="font-mono text-[11px] text-zinc-500 shrink-0">{repository.ref || 'HEAD'}</span>
        )}
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          <button onClick={() => setCtx(pathKey, '')} className="text-sky-400 hover:underline shrink-0">root</button>
          {segments.map((segment, index) => {
            const path = segments.slice(0, index + 1).join('/')
            return (
              <span key={path} className="flex items-center gap-1 min-w-0">
                <span className="text-zinc-700">/</span>
                <button
                  onClick={() => setCtx(pathKey, path)}
                  className="text-sky-400 hover:underline truncate"
                  title={path}
                >
                  {segment}
                </button>
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(14rem,0.34fr)_minmax(0,1fr)]">
        <div className="overflow-auto border-b md:border-b-0 md:border-r border-zinc-800 min-h-0">
          {entries.length === 0 ? (
            <Empty>{repository.file ? 'No sibling entries' : 'Empty directory'}</Empty>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {entries.map((entry) => (
                <button
                  key={`${entry.kind}:${entry.path}`}
                  onClick={() => selectEntry(entry)}
                  className={`w-full grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-1.5 text-left text-xs hover:bg-zinc-800/50 ${
                    repository.file?.path === entry.path ? 'bg-sky-500/10 text-sky-300' : 'text-zinc-300'
                  }`}
                  title={entry.path}
                >
                  <span className="text-zinc-600" aria-hidden="true">
                    {entry.kind === 'directory' ? '▸' : entry.kind === 'symlink' ? '↗' : '·'}
                  </span>
                  <span className="truncate">{entry.name}</span>
                  <span className="text-[9px] text-zinc-600 tabular-nums">
                    {entry.kind === 'file' && entry.sizeBytes != null ? humanSize(entry.sizeBytes) : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-0 flex flex-col overflow-hidden">
          {repository.file ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 border-b border-zinc-800 text-[10px] text-zinc-500 shrink-0">
                <span className="font-mono truncate text-zinc-300">{repository.file.path}</span>
                {repository.file.language && (
                  <span className="uppercase tracking-wider shrink-0">{repository.file.language}</span>
                )}
                {repository.file.sizeBytes != null && (
                  <span className="tabular-nums shrink-0">{humanSize(repository.file.sizeBytes)}</span>
                )}
                {repository.file.truncated && (
                  <span className="text-amber-400 uppercase tracking-wider shrink-0">truncated</span>
                )}
                <button
                  onClick={() => void copyFile()}
                  className="ml-auto text-zinc-500 hover:text-zinc-200 shrink-0"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    {...(fileUrl.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="text-zinc-500 hover:text-sky-300 shrink-0"
                  >
                    Raw ↗
                  </a>
                )}
              </div>
              <Code content={repository.file.content} wrap={opts.wrap === true} />
            </>
          ) : (
            <Empty padded>Select a file to inspect its source</Empty>
          )}
        </div>
      </div>
    </div>
  )
}

function Code({ content, wrap }: { content: string; wrap: boolean }) {
  const lines = content.split('\n')
  return (
    <div className="flex-1 overflow-auto min-h-0 bg-zinc-950/50">
      <table className="w-full font-mono text-[11px] leading-5">
        <tbody>
          {lines.map((line, index) => (
            <tr key={index}>
              <td className="sticky left-0 w-12 px-2 text-right align-top select-none text-zinc-700 bg-zinc-950/95 border-r border-zinc-900">
                {index + 1}
              </td>
              <td className={`px-3 text-zinc-300 align-top ${wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
                {line || ' '}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
