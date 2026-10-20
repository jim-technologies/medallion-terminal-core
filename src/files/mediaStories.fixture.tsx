import { useMemo, useRef, useState } from 'react'
import type { SessionPort } from '../app/session'
import { Button } from '../components/Button'
import { FilePreview, type FilePreviewFile } from './FilePreview'

const MEDIA_FILES: FilePreviewFile[] = [
  { name: 'clip.webm', url: '/media-fixtures/clip.webm', contentType: 'video/webm; codecs="vp9,opus"' },
  { name: 'clip-h264.mp4', url: '/media-fixtures/clip-h264.mp4', contentType: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"' },
  { name: 'clip-tail.mp4', url: '/media-fixtures/clip-tail.mp4', contentType: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"' },
  { name: 'clip-hevc.mp4', url: '/media-fixtures/clip-hevc.mp4', contentType: 'video/mp4; codecs="hvc1"' },
  { name: 'clip.mkv', url: '/media-fixtures/clip.mkv', contentType: 'video/x-matroska' },
  { name: 'tone.opus.ogg', url: '/media-fixtures/tone.opus.ogg', contentType: 'audio/ogg; codecs="opus"' },
  { name: 'tone.flac', url: '/media-fixtures/tone.flac', contentType: 'audio/flac' },
  { name: 'tone.wav', url: '/media-fixtures/tone.wav', contentType: 'audio/wav' },
  { name: 'tone.mp3', url: '/media-fixtures/tone.mp3', contentType: 'audio/mpeg' },
  { name: 'next.wav', url: '/media-fixtures/tone.wav?sample=next', contentType: 'audio/wav' },
]

const LARGE_FILES: FilePreviewFile[] = [
  { name: 'large.png', url: '/media-fixtures/pixel.png?size=large', contentType: 'image/png', sizeBytes: 21_000_000 },
  { name: 'large.avif', url: '/media-fixtures/pixel.avif?size=large', contentType: 'image/avif', sizeBytes: 21_000_000 },
  { name: 'large.pdf', url: '/media-fixtures/sample.pdf?size=large', contentType: 'application/pdf', sizeBytes: 51_000_000 },
  { name: 'unsafe.png', url: '/media-fixtures/unsafe.svg', contentType: 'image/png', sizeBytes: 21_000_000 },
  { name: 'unsafe.pdf', url: '/media-fixtures/unsafe.html', contentType: 'application/pdf', sizeBytes: 51_000_000 },
  { name: 'source.svg', url: '/media-fixtures/unsafe.svg', contentType: 'image/svg+xml' },
  { name: 'source.html', url: '/media-fixtures/unsafe.html', contentType: 'text/html' },
  { name: 'pixel.avif', url: '/media-fixtures/pixel.avif', contentType: 'image/avif', sizeBytes: 906 },
  { name: 'small.pdf', url: '/media-fixtures/sample.pdf', contentType: 'application/pdf', sizeBytes: 597 },
]

const largeFileFetch: typeof globalThis.fetch = async (input, init) => {
  const response = await globalThis.fetch(input, init)
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url, globalThis.location.href)
  if (response.ok && url.searchParams.get('size') === 'large' && new Headers(init?.headers).get('range') === 'bytes=0-15') {
    const headers = new Headers(response.headers)
    headers.set('content-range', `bytes 0-15/${url.pathname.endsWith('.pdf') ? 51_000_000 : 21_000_000}`)
    return new Response(response.body, { status: response.status, headers })
  }
  return response
}

/** Small synthetic samples; the host supplies its own renewal and download actions. */
export function MediaPlaybackFixture() {
  const [selected, setSelected] = useState('tone.wav')
  const [renewals, setRenewals] = useState(0)
  const [downloads, setDownloads] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const file = MEDIA_FILES.find(item => item.name === selected)!
  const session = useMemo<SessionPort>(() => ({
    load: async () => ({ authenticated: true }),
    async renew() {
      setRenewals(count => count + 1)
      const response = await globalThis.fetch('/media-fixtures/renew', { method: 'POST' })
      if (!response.ok) throw new Error('The host could not renew the session.')
      return { authenticated: true }
    },
    signIn: () => false,
  }), [])
  return (
    <div ref={root} className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label>
          Preview file{' '}
          <select aria-label="Preview file" value={selected} onChange={event => setSelected(event.target.value)}>
            {MEDIA_FILES.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <Button onClick={() => { void root.current?.querySelector<HTMLMediaElement>('video, audio')?.play() }}>Play sample</Button>
        <Button onClick={() => root.current?.querySelector<HTMLMediaElement>('video, audio')?.pause()}>Pause sample</Button>
        <Button onClick={() => setSelected('next.wav')}>Next file</Button>
      </div>
      <FilePreview file={file} session={session} height={320} onDownload={() => setDownloads(count => count + 1)} />
      <div className="flex gap-4 text-[var(--mtc-muted)]">
        <span>Session renewals: <output aria-label="Session renewals">{renewals}</output></span>
        <span>Downloads: <output aria-label="Downloads">{downloads}</output></span>
      </div>
    </div>
  )
}

/** Declared sizes exceed the blob limits; the actual synthetic samples remain small. */
export function LargePreviewsFixture() {
  const [selected, setSelected] = useState('large.png')
  const [downloads, setDownloads] = useState(0)
  const file = LARGE_FILES.find(item => item.name === selected)!
  return (
    <div className="grid gap-4">
      <label>
        Preview file{' '}
        <select aria-label="Preview file" value={selected} onChange={event => setSelected(event.target.value)}>
          {LARGE_FILES.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </label>
      <FilePreview file={file} fetch={largeFileFetch} height={320} onDownload={() => setDownloads(count => count + 1)} />
      <span>Downloads: <output aria-label="Downloads">{downloads}</output></span>
    </div>
  )
}
