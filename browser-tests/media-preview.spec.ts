import { readFile } from 'node:fs/promises'
import { expect, test, type Locator, type Page, type Request, type TestInfo } from '@playwright/test'

const MEDIA: Record<string, { type: string, kind: 'audio' | 'video', optional?: boolean }> = {
  'clip.webm': { type: 'video/webm; codecs="vp9,opus"', kind: 'video' },
  'clip-h264.mp4': { type: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"', kind: 'video' },
  'clip-tail.mp4': { type: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"', kind: 'video' },
  'clip-hevc.mp4': { type: 'video/mp4; codecs="hvc1"', kind: 'video', optional: true },
  'tone.opus.ogg': { type: 'audio/ogg; codecs="opus"', kind: 'audio' },
  'tone.flac': { type: 'audio/flac', kind: 'audio' },
  'tone.wav': { type: 'audio/wav', kind: 'audio' },
  'tone.mp3': { type: 'audio/mpeg', kind: 'audio' },
}

// Bundled Chromium omits proprietary codecs; Firefox and Linux WebKit rely
// on host media libraries for H.264/AAC. HEVC is optional in every project.
const OPTIONAL_MISSING_CODECS: Record<string, readonly string[]> = {
  chromium: ['clip-h264.mp4', 'clip-tail.mp4', 'clip-hevc.mp4'],
  firefox: ['clip-h264.mp4', 'clip-tail.mp4', 'clip-hevc.mp4'],
  webkit: ['clip-h264.mp4', 'clip-tail.mp4', 'clip-hevc.mp4'],
}

interface RequestRecord {
  file: string
  url: string
  resource: string
  destination?: string
  nativeMedia: boolean
  range?: string
  status?: number
  bytes?: number
  contentLength?: number
  contentRange?: string
  failure?: string
}

interface FixtureObservations {
  requests: RequestRecord[]
  renewals: number
  probes: number
  observationSource?: 'real-static-http'
  droppedRequests?: number
}

interface FixtureState extends FixtureObservations {
  probeStatus: number
  corruptMedia: boolean
  failedReload: boolean
  htmlAfterPdfProbe: boolean
  wrongRasterMime: boolean
  probeBarrier?: Promise<void>
  renewalBarrier?: Promise<void>
}

interface NativeTimelineEvent {
  elapsedMs: number
  event: string
  label: string | null
  duration: number | string
  currentTime: number
  readyState: number
  paused: boolean
  error: { code: number, message: string } | null
}

function isNativeMediaRequest(file: string, resource: string, destination: string | undefined, range: string | undefined) {
  const probe = resource === 'fetch' && range === 'bytes=0-0'
  return !probe && (
    destination === 'audio' || destination === 'video'
    || Boolean(MEDIA[file] && resource !== 'fetch' && resource !== 'xhr')
  )
}

async function observeStaticFixtures(page: Page): Promise<FixtureObservations> {
  const state: FixtureObservations = {
    requests: [], renewals: 0, probes: 0,
    observationSource: 'real-static-http', droppedRequests: 0,
  }
  const records = new Map<Request, RequestRecord>()
  page.on('request', request => {
    const url = new URL(request.url())
    if (!url.pathname.startsWith('/media-fixtures/')) return
    if (state.requests.length >= 128) {
      state.droppedRequests! += 1
      return
    }
    const file = url.pathname.split('/').pop()!
    const resource = request.resourceType()
    const destination = request.headers()['sec-fetch-dest']
    const range = request.headers()['range']
    if (file === 'renew') state.renewals += 1
    if (resource === 'fetch' && range === 'bytes=0-0') state.probes += 1
    const record: RequestRecord = {
      file, url: url.href, resource, destination, range,
      nativeMedia: isNativeMediaRequest(file, resource, destination, range),
    }
    records.set(request, record)
    state.requests.push(record)
  })
  page.on('response', response => {
    const record = records.get(response.request())
    if (!record) return
    const headers = response.headers()
    record.status = response.status()
    record.contentRange = headers['content-range']
    const length = headers['content-length']
    if (length !== undefined && /^\d+$/.test(length)) record.contentLength = Number(length)
  })
  page.on('requestfailed', request => {
    const record = records.get(request)
    if (record) record.failure = request.failure()?.errorText
  })
  await page.addInitScript(() => {
    const record = window as unknown as { mediaPreviewNativeTimeline: NativeTimelineEvent[] }
    record.mediaPreviewNativeTimeline = []
    const started = performance.now()
    for (const event of ['loadedmetadata', 'durationchange', 'canplay', 'playing', 'pause', 'seeking', 'seeked', 'error']) {
      document.addEventListener(event, observed => {
        const player = observed.target
        if (!(player instanceof HTMLMediaElement) || record.mediaPreviewNativeTimeline.length >= 64) return
        record.mediaPreviewNativeTimeline.push({
          elapsedMs: performance.now() - started,
          event,
          label: player.getAttribute('aria-label'),
          duration: Number.isFinite(player.duration) ? player.duration : String(player.duration),
          currentTime: player.currentTime,
          readyState: player.readyState,
          paused: player.paused,
          error: player.error ? { code: player.error.code, message: player.error.message } : null,
        })
      }, true)
    }
  })
  return state
}

function barrier() {
  let release!: () => void
  const promise = new Promise<void>(resolve => { release = resolve })
  return { promise, release }
}

async function serveFixtures(page: Page): Promise<FixtureState> {
  const state: FixtureState = {
    requests: [], renewals: 0, probes: 0, probeStatus: 206,
    corruptMedia: false, failedReload: false, htmlAfterPdfProbe: false, wrongRasterMime: false,
  }
  await page.route('**/media-fixtures/**', async route => {
    const request = route.request()
    const url = new URL(request.url())
    const file = url.pathname.split('/').pop()!
    if (file === 'renew') {
      state.renewals += 1
      await state.renewalBarrier
      state.probeStatus = 206
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"authenticated":true}' })
      return
    }
    const range = request.headers()['range']
    const resource = request.resourceType()
    const destination = request.headers()['sec-fetch-dest']
    const probe = resource === 'fetch' && range === 'bytes=0-0'
    if (probe) {
      state.probes += 1
      await state.probeBarrier
    }
    let status = probe ? state.probeStatus : 200
    const nativeMedia = isNativeMediaRequest(file, resource, destination, range)
    if (state.failedReload && state.renewals > 0 && (nativeMedia || probe)) status = 401
    let type = MEDIA[file]?.type.split(';')[0] ?? ({
      'pixel.png': 'image/png', 'pixel.avif': 'image/avif',
      'sample.pdf': 'application/pdf', 'unsafe.svg': 'image/svg+xml',
      'unsafe.html': 'text/html',
    } as Record<string, string>)[file] ?? 'application/octet-stream'
    let bytes = status >= 400
      ? Buffer.from('{"message":"synthetic HTTP failure"}')
      : await readFile(new URL(`../public/media-fixtures/${file}`, import.meta.url))
    if (file === 'pixel.png' && state.wrongRasterMime) type = 'image/svg+xml'
    if (nativeMedia && state.corruptMedia) bytes = Buffer.from('not a valid WAV audio fixture')
    if (file === 'sample.pdf' && resource === 'document' && state.htmlAfterPdfProbe) {
      type = 'text/html'
      bytes = Buffer.from('<!doctype html><html><body>Changed response<script>parent.postMessage("media-preview-script-executed", "*")</script></body></html>')
    }
    const headers: Record<string, string> = { 'content-type': type, 'accept-ranges': 'bytes' }
    const match = range && /^bytes=(\d+)-(\d*)$/.exec(range)
    if (status < 400 && match && !(nativeMedia && state.corruptMedia)) {
      const start = Number(match[1])
      const end = Math.min(bytes.length - 1, match[2] ? Number(match[2]) : bytes.length - 1)
      if (start > end) {
        status = 416
        headers['content-range'] = `bytes */${bytes.length}`
        bytes = Buffer.alloc(0)
      } else {
        status = 206
        headers['content-range'] = `bytes ${start}-${end}/${bytes.length}`
        bytes = bytes.subarray(start, end + 1)
      }
    }
    if (status >= 400) headers['content-type'] = 'application/json'
    headers['content-length'] = String(bytes.length)
    state.requests.push({ file, url: url.href, resource, destination, nativeMedia, range, status, bytes: bytes.length })
    try {
      await route.fulfill({ status, headers, body: bytes })
    } catch (error) {
      // Navigation aborts held probes; any other route failure remains a failure.
      if (!page.isClosed() && !request.failure()) throw error
    }
  })
  return state
}

async function openPlayback(page: Page, name = 'tone.wav') {
  await page.goto('/iframe.html?id=toolkit-files--media-playback&viewMode=story')
  await page.getByRole('combobox', { name: 'Preview file' }).selectOption(name)
  return page.locator('video, audio').and(page.getByLabel(name, { exact: true }))
}

async function ready(media: Locator) {
  await expect.poll(() => media.evaluate(element => {
    const player = element as HTMLMediaElement
    return player.readyState >= 1 && Number.isFinite(player.duration) && player.duration > 0
  })).toBe(true)
}

async function seek(media: Locator, time: number) {
  await media.evaluate((element, target) => new Promise<void>((resolve, reject) => {
    const player = element as HTMLMediaElement
    const timer = setTimeout(() => reject(new Error('native seeked event did not arrive')), 5_000)
    player.addEventListener('seeked', () => { clearTimeout(timer); resolve() }, { once: true })
    player.currentTime = target
  }), time)
}

async function attachCodec(testInfo: TestInfo, details: Record<string, unknown>) {
  await testInfo.attach('media-codec-result.json', {
    body: JSON.stringify({ project: testInfo.project.name, ...details }, null, 2),
    contentType: 'application/json',
  })
}

async function attachNativeDiagnostics(page: Page, state: FixtureObservations, testInfo: TestInfo) {
  const native = await page.locator('video, audio').evaluateAll(elements => elements.map(element => {
    const player = element as HTMLMediaElement
    return {
      label: player.getAttribute('aria-label'),
      source: player.currentSrc,
      duration: Number.isFinite(player.duration) ? player.duration : String(player.duration),
      readyState: player.readyState,
      networkState: player.networkState,
      error: player.error ? { code: player.error.code, message: player.error.message } : null,
      currentTime: player.currentTime,
      paused: player.paused,
      seeking: player.seeking,
    }
  })).catch(error => ({ unavailable: String(error) }))
  const nativeTimeline = await page.evaluate(() => (window as unknown as { mediaPreviewNativeTimeline?: NativeTimelineEvent[] }).mediaPreviewNativeTimeline ?? [])
    .catch(error => ({ unavailable: String(error) }))
  await testInfo.attach('native-player-diagnostics.json', {
    body: JSON.stringify({
      project: testInfo.project.name, observedAt: new Date().toISOString(),
      native, requests: state.requests, probes: state.probes, renewals: state.renewals,
      observationSource: state.observationSource ?? 'controlled-route',
      droppedRequests: state.droppedRequests ?? 0,
      nativeTimeline,
    }, null, 2),
    contentType: 'application/json',
  })
}

for (const [file, format] of Object.entries(MEDIA)) {
  test(`${file}: native metadata, duration and seek, or explicit missing codec`, async ({ page }, testInfo) => {
    const state = await observeStaticFixtures(page)
    try {
    const media = await openPlayback(page, file)
    const capability = await page.evaluate(({ kind, type }) => document.createElement(kind).canPlayType(type), format)
    if (!capability) {
      await expect(page.getByText(/^This browser can't play/)).toBeVisible()
      await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
      await attachCodec(testInfo, { file, capability, outcome: 'unsupported-before-mount' })
      const optional = OPTIONAL_MISSING_CODECS[testInfo.project.name]?.includes(file) === true
      test.skip(optional, `${testInfo.project.name} has no advertised decoder for optional ${format.type}; fallback was verified, playback was not qualified`)
      expect(capability, `HOLD: ${testInfo.project.name} is missing the required baseline decoder for ${format.type}`).not.toBe('')
    }
    if (format.optional) {
      await expect.poll(async () => {
        if (await page.getByText(/^This browser can't play/).isVisible()) return 'codec-fallback'
        if (!await media.count()) return 'pending'
        return await media.evaluate(element => (element as HTMLMediaElement).readyState >= 1) ? 'metadata' : 'pending'
      }).not.toBe('pending')
      if (await page.getByText(/^This browser can't play/).isVisible()) {
        await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
        await attachCodec(testInfo, { file, capability, outcome: 'advertised-but-actual-decoder-unavailable', probes: state.probes })
        test.skip(true, `${testInfo.project.name} rejected the actual HEVC sample; codec fallback was verified`)
      }
    }
    await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).readyState >= 1)).toBe(true)
    const startedAt = await media.evaluate(element => (element as HTMLMediaElement).currentTime)
    await page.getByRole('button', { name: 'Play sample' }).click()
    try {
      await ready(media)
      await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).currentTime)).toBeGreaterThan(startedAt + 0.1)
    } catch (error) {
      if (format.optional && await page.getByText(/^This browser can't play/).isVisible()) {
        await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
        await attachCodec(testInfo, { file, capability, outcome: 'actual-decoder-rejected-on-play', probes: state.probes })
        test.skip(true, `${testInfo.project.name} rejected HEVC during native Play; codec fallback was verified`)
      }
      throw error
    }
    await page.getByRole('button', { name: 'Pause sample' }).click()
    await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(true)
    const duration = await media.evaluate(element => (element as HTMLMediaElement).duration)
    expect(duration).toBeGreaterThanOrEqual(3.8)
    expect(duration).toBeLessThan(4.3)
    try {
      await seek(media, 1.5)
    } catch (error) {
      if (format.optional && await page.getByText(/^This browser can't play/).isVisible()) {
        await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible()
        await attachCodec(testInfo, { file, capability, duration, outcome: 'actual-decoder-rejected-on-seek', probes: state.probes })
        test.skip(true, `${testInfo.project.name} rejected HEVC while seeking; codec fallback was verified`)
      }
      throw error
    }
    expect(await media.evaluate(element => (element as HTMLMediaElement).currentTime)).toBeCloseTo(1.5, 1)
    await attachCodec(testInfo, { file, capability, duration, outcome: 'native-playback-advancement-pause-and-seek', requests: state.requests })
    } finally {
      await attachNativeDiagnostics(page, state, testInfo)
    }
  })
}

test('MKV keeps the unsupported state and existing Download action', async ({ page }) => {
  const state = await serveFixtures(page)
  await openPlayback(page, 'clip.mkv')
  await expect(page.getByText('No preview for this file type')).toBeVisible()
  await expect(page.locator('video, audio')).toHaveCount(0)
  await page.getByRole('button', { name: 'Download', exact: true }).click()
  await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
  expect(state.requests.filter(request => request.file === 'clip.mkv')).toEqual([])
})

for (const playing of [false, true]) {
  test(`two independent 401 renewals restore ${playing ? 'playing' : 'paused'} state and time on the same URL`, async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'scope',
      description: 'The error event and 401 probe response are synthetic; reload, metadata, seek, pause/play state and subsequent playback advancement use the real native media element.',
    })
    const state = await serveFixtures(page)
    const media = await openPlayback(page)
    await ready(media)
    for (let cycle = 1; cycle <= 2; cycle += 1) {
      await page.getByRole('button', { name: 'Pause sample' }).click()
      await seek(media, playing ? 0.5 : 1.25)
      if (playing) {
        await page.getByRole('button', { name: 'Play sample' }).click()
        await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(false)
      }
      state.probeStatus = 401
      await media.evaluate(element => {
        element.dispatchEvent(new Event('error'))
        element.dispatchEvent(new Event('error'))
      })
      await expect.poll(() => state.renewals).toBe(cycle)
      await expect(page.locator('.mtc-file-preview [aria-busy="true"]')).toHaveCount(0)
      await ready(media)
      await expect.poll(() => media.evaluate(element => {
        const player = element as HTMLMediaElement
        return player.readyState >= 3 && !player.seeking
      })).toBe(true)
      await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(!playing)
      const restored = await media.evaluate(element => (element as HTMLMediaElement).currentTime)
      if (playing) {
        expect(restored).toBeGreaterThanOrEqual(0.4)
        expect(restored).toBeLessThan(3.5)
        await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).currentTime)).toBeGreaterThan(restored + 0.1)
      } else expect(restored).toBeCloseTo(1.25, 1)
      await expect(page.getByLabel('Session renewals', { exact: true })).toHaveText(String(cycle))
    }
    expect(state.probes).toBe(2)
  })
}

for (const initiallyPlaying of [true, false]) {
  test(`user ${initiallyPlaying ? 'Pause' : 'Play'} and latest seek during held renewal survive native reload`, async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'scope',
      description: 'Only the error event and 401 response are synthetic; user Play/Pause, both seeks, reload, restoration and playback advancement use native media operations and events.',
    })
    const state = await serveFixtures(page)
    const hold = barrier()
    const media = await openPlayback(page)
    await ready(media)
    await seek(media, 1.25)
    if (initiallyPlaying) {
      await page.getByRole('button', { name: 'Play sample' }).click()
      await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(false)
    }
    state.probeStatus = 401
    state.renewalBarrier = hold.promise
    try {
      await media.evaluate(element => {
        const player = element as HTMLMediaElement
        const nativeTime = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime')!
        const ownTime = Object.getOwnPropertyDescriptor(player, 'currentTime')
        const ownLoad = Object.getOwnPropertyDescriptor(player, 'load')
        const nativeLoad = player.load
        const bookmark = { time: nativeTime.get!.call(player) as number, paused: player.paused }
        let pending = true
        let observingTimeEvent = false
        const trackTime = () => {
          if (!pending || player.error) return
          bookmark.time = nativeTime.get!.call(player) as number
          observingTimeEvent = true
          queueMicrotask(() => { observingTimeEvent = false })
        }
        const trackPlay = () => { if (pending) bookmark.paused = false }
        const trackPause = () => { if (pending && !player.error) bookmark.paused = true }
        const recovered = () => {
          if (pending) return
          player.setAttribute('data-recovery-seek-time', String(nativeTime.get!.call(player)))
          player.removeEventListener('timeupdate', trackTime, true)
          player.removeEventListener('seeking', trackTime, true)
          player.removeEventListener('play', trackPlay, true)
          player.removeEventListener('pause', trackPause, true)
          player.removeEventListener('seeked', recovered)
          if (ownTime) Object.defineProperty(player, 'currentTime', ownTime)
          else Reflect.deleteProperty(player, 'currentTime')
          if (ownLoad) Object.defineProperty(player, 'load', ownLoad)
          else Reflect.deleteProperty(player, 'load')
        }
        Object.defineProperty(player, 'currentTime', {
          configurable: true,
          enumerable: nativeTime.enumerable,
          get() {
            const time = nativeTime.get!.call(player) as number
            // Observe the exact native value read by a bookmark event handler.
            if (pending && observingTimeEvent && Number.isFinite(time)) bookmark.time = time
            return time
          },
          set(time: number) {
            player.setAttribute(pending ? 'data-pending-seek-target' : 'data-recovery-target', String(time))
            nativeTime.set!.call(player, time)
          },
        })
        Object.defineProperty(player, 'load', {
          configurable: true,
          writable: true,
          value() {
            player.setAttribute('data-recovery-bookmark-time', String(bookmark.time))
            player.setAttribute('data-recovery-bookmark-paused', String(bookmark.paused))
            pending = false
            return nativeLoad.call(player)
          },
        })
        player.addEventListener('timeupdate', trackTime, true)
        player.addEventListener('seeking', trackTime, true)
        player.addEventListener('play', trackPlay, true)
        player.addEventListener('pause', trackPause, true)
        player.addEventListener('seeked', recovered)
      })
      await media.dispatchEvent('error')
      await expect.poll(() => state.renewals).toBe(1)
      expect(state.probes).toBe(1)
      await page.getByRole('button', { name: initiallyPlaying ? 'Pause sample' : 'Play sample' }).click()
      await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(initiallyPlaying)
      await seek(media, initiallyPlaying ? 2.25 : 0.5)
      hold.release()
      await expect.poll(() => media.getAttribute('data-recovery-seek-time')).not.toBeNull()
      const recovery = await media.evaluate(element => ({
        requestedSeek: Number(element.getAttribute('data-pending-seek-target')),
        target: Number(element.getAttribute('data-recovery-target')),
        bookmark: Number(element.getAttribute('data-recovery-bookmark-time')),
        paused: element.getAttribute('data-recovery-bookmark-paused'),
      }))
      expect(recovery.requestedSeek).toBe(initiallyPlaying ? 2.25 : 0.5)
      expect(recovery.target).toBe(recovery.bookmark)
      expect(recovery.paused).toBe(String(initiallyPlaying))
      await expect(page.locator('.mtc-file-preview [aria-busy="true"]')).toHaveCount(0)
      await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(initiallyPlaying)
      if (initiallyPlaying) {
        expect(await media.evaluate(element => (element as HTMLMediaElement).currentTime)).toBeCloseTo(recovery.bookmark, 1)
      } else {
        const restored = await media.evaluate(element => (element as HTMLMediaElement).currentTime)
        await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).currentTime)).toBeGreaterThan(restored + 0.1)
      }
      expect(state.renewals).toBe(1)
      expect(state.probes).toBe(1)
      await expect(page.getByLabel('Session renewals', { exact: true })).toHaveText('1')
    } finally {
      hold.release()
      await attachNativeDiagnostics(page, state, testInfo)
    }
  })
}

test('a failed reload cannot renew the same recovery chain forever', async ({ page }, testInfo) => {
  const state = await serveFixtures(page)
  try {
    const media = await openPlayback(page)
    await ready(media)
    await seek(media, 1.25)
    state.probeStatus = 401
    state.failedReload = true
    await media.dispatchEvent('error')
    await expect.poll(() => state.renewals).toBe(1)
    await expect.poll(() => state.requests.some(request => request.file === 'tone.wav' && request.nativeMedia && request.status === 401)).toBe(true)
    await expect(page.getByText('Sign-in required', { exact: true })).toBeVisible()
    expect(state.renewals).toBe(1)
    await page.getByRole('button', { name: 'Download', exact: true }).click()
    await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
  } finally {
    await attachNativeDiagnostics(page, state, testInfo)
  }
})

for (const status of [403, 404, 503]) {
  test(`a native media error probes HTTP ${status} without calling it a codec failure`, async ({ page }) => {
    const state = await serveFixtures(page)
    const media = await openPlayback(page)
    await ready(media)
    state.probeStatus = status
    await media.dispatchEvent('error')
    const title = ({ 403: 'You don’t have access', 404: 'Not found', 503: 'Service unavailable' } as Record<number, string>)[status]!
    await expect(page.getByText(title, { exact: true })).toBeVisible()
    await expect(page.getByText(/^This browser can't play/)).toHaveCount(0)
    expect(state.probes).toBe(1)
    expect(state.renewals).toBe(0)
    await page.getByRole('button', { name: 'Download', exact: true }).click()
    await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
  })
}

test('an actual decode failure with a successful one-byte probe shows codec fallback', async ({ page }, testInfo) => {
  const state = await serveFixtures(page)
  try {
    state.corruptMedia = true
    await openPlayback(page)
    await expect.poll(() => state.requests.some(request => request.file === 'tone.wav' && request.nativeMedia && request.status === 200 && request.bytes === 29)).toBe(true)
    await expect(page.getByText(/^This browser can't play audio\/wav/)).toBeVisible()
    expect(state.probes).toBe(1)
    expect(state.renewals).toBe(0)
    const probe = state.requests.find(request => request.resource === 'fetch' && request.range === 'bytes=0-0')
    expect(probe).toMatchObject({ status: 206, bytes: 1 })
    await page.getByRole('button', { name: 'Download', exact: true }).click()
    await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
  } finally {
    await attachNativeDiagnostics(page, state, testInfo)
  }
})

for (const pending of ['probe', 'renewal'] as const) {
  test(`navigating during pending ${pending} cannot mutate or resume the next file`, async ({ page }) => {
    const state = await serveFixtures(page)
    const wait = barrier()
    const media = await openPlayback(page)
    await ready(media)
    await seek(media, 1.25)
    await page.getByRole('button', { name: 'Play sample' }).click()
    await expect.poll(() => media.evaluate(element => (element as HTMLMediaElement).paused)).toBe(false)
    state.probeStatus = 401
    if (pending === 'probe') state.probeBarrier = wait.promise
    else state.renewalBarrier = wait.promise
    try {
      await media.dispatchEvent('error')
      await expect.poll(() => pending === 'probe' ? state.probes : state.renewals).toBe(1)
      await page.getByRole('button', { name: 'Next file' }).click()
      const next = page.getByLabel('next.wav', { exact: true })
      await ready(next)
      wait.release()
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
      await expect(next).toHaveAttribute('src', /tone\.wav\?sample=next$/)
      expect(await next.evaluate(element => (element as HTMLMediaElement).paused)).toBe(true)
      expect(await next.evaluate(element => (element as HTMLMediaElement).currentTime)).toBe(0)
      await expect(page.getByText(/^This browser can't play/)).toHaveCount(0)
      await expect(page.getByText('Sign-in required', { exact: true })).toHaveCount(0)
      expect(state.renewals).toBe(pending === 'probe' ? 0 : 1)
    } finally {
      wait.release()
    }
  })
}

for (const sample of [
  { name: 'large.png', file: 'pixel.png', tag: 'img' },
  { name: 'large.avif', file: 'pixel.avif', tag: 'img' },
  { name: 'large.pdf', file: 'sample.pdf', tag: 'iframe' },
]) {
  test(`${sample.name}: a 16-byte signature probe admits a direct source`, async ({ page }, testInfo) => {
    const state = await serveFixtures(page)
    await page.goto('/iframe.html?id=toolkit-files--large-previews&viewMode=story')
    await page.getByRole('combobox', { name: 'Preview file' }).selectOption(sample.name)
    const preview = sample.tag === 'img'
      ? page.getByRole('img', { name: sample.name, exact: true })
      : page.getByTitle(sample.name, { exact: true })
    await expect(preview).toHaveAttribute('src', `/media-fixtures/${sample.file}?size=large`)
    const probes = state.requests.filter(request => request.file === sample.file && request.resource === 'fetch')
    expect(probes).toHaveLength(1)
    expect(probes[0]).toMatchObject({ range: 'bytes=0-15', status: 206, bytes: 16 })
    if (sample.tag === 'img') {
      const decoded = await preview.evaluate(element => (element as HTMLImageElement).decode().then(() => true, () => false))
      await attachCodec(testInfo, { file: sample.file, decoded, scope: 'native raster decoding after direct-source signature gate' })
      test.skip(!decoded && sample.file === 'pixel.avif', `${testInfo.project.name} cannot decode the actual AVIF fixture; signature/direct-source policy was verified`)
      expect(decoded).toBe(true)
    } else {
      await expect(preview).toHaveAttribute('sandbox', /^(?!.*allow-scripts).*$/)
      await page.getByRole('button', { name: 'Download', exact: true }).click()
      await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
      testInfo.annotations.push({ type: 'scope', description: 'PDF signature, direct source, sandbox and Download verified; native PDF viewer support is not inferred from iframe mounting.' })
    }
  })
}

test('AVIF under the blob limit validates its signature before native image decoding', async ({ page }, testInfo) => {
  const state = await serveFixtures(page)
  await page.goto('/iframe.html?id=toolkit-files--large-previews&viewMode=story')
  await page.getByRole('combobox', { name: 'Preview file' }).selectOption('pixel.avif')
  const image = page.getByRole('img', { name: 'pixel.avif', exact: true })
  await expect(image).toHaveAttribute('src', /^blob:/)
  const decoded = await image.evaluate(element => (element as HTMLImageElement).decode().then(() => true, () => false))
  const reads = state.requests.filter(request => request.file === 'pixel.avif' && request.resource === 'fetch')
  expect(reads).toHaveLength(1)
  expect(reads[0]?.range).toBeUndefined()
  await attachCodec(testInfo, { file: 'pixel.avif', decoded, scope: 'validated blob AVIF' })
  test.skip(!decoded, `${testInfo.project.name} cannot decode the actual AVIF fixture; signature/blob policy was verified`)
  expect(decoded).toBe(true)
})

test('a known small PDF needs one bounded fetch and keeps sandbox plus Download', async ({ page }) => {
  const state = await serveFixtures(page)
  await page.goto('/iframe.html?id=toolkit-files--large-previews&viewMode=story')
  await page.getByRole('combobox', { name: 'Preview file' }).selectOption('small.pdf')
  const frame = page.getByTitle('small.pdf', { exact: true })
  await expect(frame).toHaveAttribute('src', /^blob:/)
  await expect(frame).toHaveAttribute('sandbox', /^(?!.*allow-scripts).*$/)
  const reads = state.requests.filter(request => request.file === 'sample.pdf' && request.resource === 'fetch')
  expect(reads).toHaveLength(1)
  expect(reads[0]?.range).toBeUndefined()
  await page.getByRole('button', { name: 'Download', exact: true }).click()
  await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
})

test('a valid large PNG signature with an unsafe response MIME never mounts a direct image', async ({ page }) => {
  const state = await serveFixtures(page)
  state.wrongRasterMime = true
  await page.goto('/iframe.html?id=toolkit-files--large-previews&viewMode=story')
  await expect(page.getByText('Preview blocked', { exact: true })).toBeVisible()
  await expect(page.locator('.mtc-file-preview img, .mtc-file-preview iframe')).toHaveCount(0)
  expect(state.requests.filter(request => request.file === 'pixel.png')).toHaveLength(1)
  await page.getByRole('button', { name: 'Download', exact: true }).click()
  await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
})

test('renamed SVG and HTML bytes are blocked and source files are never rendered as active content', async ({ page }) => {
  await serveFixtures(page)
  await page.goto('/iframe.html?id=toolkit-files--large-previews&viewMode=story')
  for (const name of ['unsafe.png', 'unsafe.pdf']) {
    await page.getByRole('combobox', { name: 'Preview file' }).selectOption(name)
    await expect(page.getByText('Preview blocked', { exact: true })).toBeVisible()
    await expect(page.locator('.mtc-file-preview img, .mtc-file-preview iframe, .mtc-file-preview object')).toHaveCount(0)
    await page.getByRole('button', { name: 'Download', exact: true }).click()
  }
  for (const name of ['source.svg', 'source.html']) {
    await page.getByRole('combobox', { name: 'Preview file' }).selectOption(name)
    await expect(page.getByLabel(name, { exact: true })).toBeVisible()
    await expect(page.locator('.mtc-file-preview img, .mtc-file-preview iframe, .mtc-file-preview object, .mtc-file-preview svg title, .mtc-file-preview [data-media-active-content]')).toHaveCount(0)
  }
  await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('2')
})

test('a PDF source that changes to active HTML after its probe stays sandboxed', async ({ page }) => {
  const state = await serveFixtures(page)
  state.htmlAfterPdfProbe = true
  await page.addInitScript(() => {
    const record = window as unknown as { mediaPreviewScriptExecuted: boolean }
    record.mediaPreviewScriptExecuted = false
    window.addEventListener('message', event => {
      if (event.data === 'media-preview-script-executed') record.mediaPreviewScriptExecuted = true
    })
  })
  await page.goto('/iframe.html?id=toolkit-files--large-previews&viewMode=story')
  const changed = page.waitForResponse(response => response.url().includes('/media-fixtures/sample.pdf') && response.request().resourceType() === 'document')
  await page.getByRole('combobox', { name: 'Preview file' }).selectOption('large.pdf')
  await changed
  const frame = page.getByTitle('large.pdf', { exact: true })
  await expect(frame).toHaveAttribute('sandbox', /^(?!.*allow-scripts).*$/)
  await expect(page.frameLocator('iframe[title="large.pdf"]').locator('body')).toContainText('Changed response')
  expect(await page.evaluate(() => (window as unknown as { mediaPreviewScriptExecuted: boolean }).mediaPreviewScriptExecuted)).toBe(false)
  expect(state.requests.find(request => request.file === 'sample.pdf' && request.resource === 'fetch')).toMatchObject({ range: 'bytes=0-15', bytes: 16 })
  await page.getByRole('button', { name: 'Download', exact: true }).click()
  await expect(page.getByLabel('Downloads', { exact: true })).toHaveText('1')
})
