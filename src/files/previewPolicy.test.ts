import { describe, expect, it, vi } from 'vitest'
import { sourceErrorFromResponse } from '../core/sourceError'
import { hasRasterSignature, planPreview } from './previewPolicy'
import { probePreview } from './previewProbe'

function avif(major: string, compatible = ''): Uint8Array {
  const bytes = new Uint8Array(16 + compatible.length)
  new DataView(bytes.buffer).setUint32(0, bytes.length)
  bytes.set(new TextEncoder().encode(`ftyp${major}`), 4)
  bytes.set(new TextEncoder().encode(compatible), 16)
  return bytes
}

describe('AVIF admission', () => {
  it('checks an AVIF or AVIS ftyp brand and refuses truncated or renamed markup', () => {
    expect(planPreview('image.AVIF')).toEqual({ kind: 'image', raster: 'avif' })
    expect(planPreview('image', 'image/avif')).toEqual({ kind: 'image', raster: 'avif' })
    expect(hasRasterSignature('avif', avif('avif'))).toBe(true)
    expect(hasRasterSignature('avif', avif('avis'))).toBe(true)
    expect(hasRasterSignature('avif', avif('mif1', 'avif'))).toBe(true)
    expect(hasRasterSignature('avif', avif('heic'))).toBe(false)
    expect(hasRasterSignature('avif', avif('avif').slice(0, 15))).toBe(false)
    expect(hasRasterSignature('avif', new TextEncoder().encode('<svg onload="alert(1)">'))).toBe(false)
    expect(planPreview('clip.mkv', 'video/x-matroska')).toEqual({ kind: 'unsupported' })
    expect(planPreview('page.html')).toEqual({ kind: 'code', language: 'HTML' })
    expect(planPreview('logo.svg')).toEqual({ kind: 'code', language: 'SVG' })
    expect(planPreview('image.constructor')).toEqual({ kind: 'unsupported' })
    expect(planPreview('constructor')).toEqual({ kind: 'unsupported' })
  })
})

describe('bounded preview probes', () => {
  it('cancels an ignored Range immediately at the requested prefix without waiting for EOF', async () => {
    let cancelled = false
    const transport: typeof globalThis.fetch = async (_, init) => {
      expect(new Headers(init?.headers).get('Range')).toBe('bytes=0-15')
      expect(init?.credentials).toBe('same-origin')
      return new Response(new ReadableStream<Uint8Array>({
        start(controller) { controller.enqueue(new Uint8Array(64 * 1024).fill(65)) },
        cancel() { cancelled = true },
      }), { status: 200, headers: { 'content-type': 'image/png' } })
    }
    const result = await probePreview('/large.png', 16, transport)
    expect(result.bytes).toEqual(new Uint8Array(16).fill(65))
    expect(result.response.status).toBe(200)
    expect(cancelled).toBe(true)
  })

  it('does not read an error body and retains its status and retry headers', async () => {
    let cancelled = false
    const transport: typeof globalThis.fetch = async (_, init) => {
      expect(new Headers(init?.headers).get('range')).toBe('bytes=0-0')
      return new Response(new ReadableStream({
        cancel() { cancelled = true },
      }), { status: 429, headers: { 'retry-after': '10' } })
    }
    const result = await probePreview('/movie.webm', 1, transport)
    expect(result.bytes).toHaveLength(0)
    expect(result.response.status).toBe(429)
    expect(result.response.headers.get('retry-after')).toBe('10')
    expect(cancelled).toBe(true)
  })

  it.each([
    [401, 'unauthenticated'],
    [403, 'forbidden'],
    [503, 'unavailable'],
  ])('retains HTTP %s classification after cancelling its JSON body', async (status, kind) => {
    const transport: typeof globalThis.fetch = async () => new Response(new ReadableStream(), {
      status: Number(status),
      headers: { 'content-type': 'application/json', 'x-request-id': 'probe-request' },
    })
    const { response } = await probePreview('/movie.webm', 1, transport)
    const typed = await sourceErrorFromResponse(response)
    expect(typed.kind).toBe(kind)
    expect(typed.status).toBe(status)
    expect(typed.requestId).toBe('probe-request')
  })

  it('bounds a transport that ignores cancellation and cancels its late response', async () => {
    vi.useFakeTimers()
    try {
      let resolve!: (response: Response) => void
      let cancelled = false
      const transport: typeof globalThis.fetch = () => new Promise<Response>(done => { resolve = done })
      const pending = probePreview('/hung.webm', 1, transport)
      const rejected = expect(pending).rejects.toMatchObject({ name: 'TimeoutError' })
      await vi.advanceTimersByTimeAsync(10_000)
      await rejected
      resolve(new Response(new ReadableStream({ cancel() { cancelled = true } })))
      await Promise.resolve()
      await Promise.resolve()
      expect(cancelled).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('cancels a stalled prefix read when the caller leaves the file', async () => {
    const controller = new AbortController()
    let cancelled = false
    const transport: typeof globalThis.fetch = async () => new Response(new ReadableStream({
      cancel() { cancelled = true },
    }))
    const pending = probePreview('/stalled.pdf', 16, transport, controller.signal)
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    await Promise.resolve()
    controller.abort()
    await rejected
    expect(cancelled).toBe(true)
  })
})
