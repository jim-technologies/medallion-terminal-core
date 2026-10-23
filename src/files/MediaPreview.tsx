import { useEffect, useRef, useState } from 'react'
import type { SessionInfo, SessionPort } from '../app/session'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { SourceError, sourceErrorFromResponse, toSourceError } from '../core/sourceError'
import { useMessage } from '../foundations/DesignSystemProvider'
import { EmptyState, ErrorState, LoadingState } from '../workbench/States'
import type { FilePreviewFile } from './FilePreview'
import { extensionOf } from './previewPolicy'
import { probePreview } from './previewProbe'

interface MediaPreviewProps {
  file: FilePreviewFile
  kind: 'video' | 'audio'
  fetch?: typeof globalThis.fetch
  session?: SessionPort
  onDownload?: () => void
}

type MediaState = {
  source: string
  phase: 'checking' | 'ready' | 'recovering' | 'unsupported' | 'error'
  error?: SourceError
}

interface Recovery {
  controller: AbortController
  timer?: ReturnType<typeof setTimeout>
  generation: number
  metadata: boolean
  time: number
  playing: boolean
}

const MEDIA_TYPES: Record<string, string> = {
  mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
  mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav',
  ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', flac: 'audio/flac',
}

/** Native playback with a bounded status probe and host-owned session renewal. */
export function MediaPreview({ file, kind, fetch: transport, session, onDownload }: MediaPreviewProps) {
  const t = useMessage()
  const declared = file.contentType?.trim()
  const format = declared?.toLowerCase().startsWith(`${kind}/`)
    ? declared
    : MEDIA_TYPES[extensionOf(file.name)] ?? `${kind}/*`
  const source = JSON.stringify([file.url, file.name, format, kind])
  const [state, setState] = useState<MediaState>({ source, phase: 'checking' })
  const player = useRef<HTMLMediaElement | null>(null)
  const generation = useRef(0)
  const renewed = useRef({ url: file.url, done: false })
  const recovery = useRef<Recovery | null>(null)
  const bookmark = useRef({ time: 0, playing: false })
  const restored = useRef<{ generation: number, time: number } | null>(null)

  const cancelRecovery = () => {
    const current = recovery.current
    if (!current) return
    recovery.current = null
    clearTimeout(current.timer)
    current.controller.abort()
  }

  useEffect(() => {
    generation.current += 1
    if (renewed.current.url !== file.url) renewed.current = { url: file.url, done: false }
    bookmark.current = { time: 0, playing: false }
    restored.current = null
    const supported = document.createElement(kind).canPlayType(format) !== ''
    setState({ source, phase: supported ? 'ready' : 'unsupported' })
    return () => {
      generation.current += 1
      cancelRecovery()
    }
  }, [source, kind, format, file.url])

  const current = (attempt: Recovery) => recovery.current === attempt
    && attempt.generation === generation.current
    && !attempt.controller.signal.aborted

  const finish = (attempt: Recovery, next: Pick<MediaState, 'phase' | 'error'>) => {
    if (!current(attempt)) return
    cancelRecovery()
    setState({ source, ...next })
  }

  const timeoutError = () => new SourceError(t('preview.mediaProbeTimeout'), {
    kind: 'unavailable', code: 'deadline_exceeded',
  })

  const failed = async () => {
    const element = player.current
    if (!element) return
    if (recovery.current) {
      if (!recovery.current.metadata) return
      // A reload may itself fail before metadata; classify that response too.
      cancelRecovery()
    }
    if (Number.isFinite(element.currentTime) && element.currentTime > 0) {
      bookmark.current.time = element.currentTime
    }
    restored.current = null
    const attempt: Recovery = {
      controller: new AbortController(),
      generation: generation.current,
      metadata: false,
      ...bookmark.current,
    }
    attempt.timer = setTimeout(() => finish(attempt, { phase: 'error', error: timeoutError() }), 15_000)
    recovery.current = attempt
    setState({ source, phase: 'recovering' })
    try {
      const { response } = await probePreview(file.url, 1, transport ?? globalThis.fetch, attempt.controller.signal)
      if (!current(attempt)) return
      if (response.status === 401 && session && !renewed.current.done) {
        renewed.current.done = true
        let next: SessionInfo
        try {
          next = await session.renew()
        } catch (error) {
          finish(attempt, {
            phase: 'error',
            error: new SourceError(toSourceError(error).message, { kind: 'unauthenticated', status: 401 }),
          })
          return
        }
        if (!current(attempt)) return
        if (!next.authenticated) {
          finish(attempt, { phase: 'error', error: await sourceErrorFromResponse(response) })
          return
        }
        attempt.metadata = true
        element.load()
      } else if (response.ok) {
        finish(attempt, { phase: 'unsupported' })
      } else {
        finish(attempt, { phase: 'error', error: await sourceErrorFromResponse(response) })
      }
    } catch (error) {
      if (!current(attempt)) return
      finish(attempt, {
        phase: 'error',
        error: error instanceof DOMException && error.name === 'TimeoutError' ? timeoutError() : toSourceError(error),
      })
    }
  }

  const playbackRecovered = () => {
    const mark = restored.current
    const element = player.current
    if (!mark || !element || element.seeking || recovery.current || element.error || mark.generation !== generation.current) return
    if (element.readyState >= 3 || element.currentTime > mark.time + 0.01) {
      renewed.current.done = false
      restored.current = null
    }
  }

  const metadataLoaded = () => {
    const attempt = recovery.current
    const element = player.current
    if (!attempt || !element || !attempt.metadata || !current(attempt)) return
    try {
      const end = Number.isFinite(element.duration) ? Math.max(0, element.duration - 0.001) : attempt.time
      element.currentTime = Math.min(attempt.time, end)
      bookmark.current = { time: element.currentTime, playing: attempt.playing }
      restored.current = { generation: generation.current, time: element.currentTime }
      finish(attempt, { phase: 'ready' })
      if (attempt.playing) {
        const version = generation.current
        void element.play().catch(() => {
          if (version === generation.current) bookmark.current.playing = false
        })
      }
    } catch (error) {
      finish(attempt, { phase: 'error', error: toSourceError(error) })
    }
  }

  const download = onDownload && <Button startIcon={<Icon name="download" />} onClick={onDownload}>{t('preview.download')}</Button>
  if (state.source !== source || state.phase === 'checking') return <LoadingState label={t('preview.loading')} compact />
  if (state.phase === 'unsupported') return (
    <EmptyState compact icon={<Icon name="file" />} title={t('preview.cannotPlay.title', { format })} description={t('preview.cannotPlay.description')} actions={download} />
  )
  if (state.phase === 'error') return <ErrorState error={state.error} compact actions={download} />

  const props = {
    ref: (element: HTMLMediaElement | null) => { player.current = element },
    src: file.url,
    controls: true,
    preload: 'metadata',
    'aria-label': file.name,
    onError: () => { void failed() },
    onLoadedMetadata: metadataLoaded,
    onCanPlay: playbackRecovered,
    onTimeUpdate: () => {
      const element = player.current
      const attempt = recovery.current
      if (element && !element.error && !attempt?.metadata && Number.isFinite(element.currentTime)) {
        bookmark.current.time = element.currentTime
        if (attempt) attempt.time = element.currentTime
      }
      playbackRecovered()
    },
    onSeeking: () => {
      const element = player.current
      const attempt = recovery.current
      if (element && !element.error && !attempt?.metadata && Number.isFinite(element.currentTime)) {
        bookmark.current.time = element.currentTime
        if (attempt) attempt.time = element.currentTime
      }
    },
    onPlay: () => {
      const attempt = recovery.current
      if (!attempt?.metadata) {
        bookmark.current.playing = true
        if (attempt) attempt.playing = true
      }
    },
    onPause: () => {
      const attempt = recovery.current
      if (!attempt?.metadata && !player.current?.error) {
        bookmark.current.playing = false
        if (attempt) attempt.playing = false
      }
    },
  }
  return (
    <div aria-busy={state.phase === 'recovering' || undefined}>
      {state.phase === 'recovering' && <LoadingState label={t('preview.loading')} compact />}
      {kind === 'video'
        ? <video key="media" {...props} className="mtc-file-preview-media" playsInline />
        : <audio key="media" {...props} className="mtc-file-preview-audio" />}
    </div>
  )
}
