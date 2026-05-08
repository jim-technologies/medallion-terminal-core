import { describe, expect, it } from 'vitest'
import { parseConnectEnvelopes, type ConnectTrailer } from '../core/connectFraming'

// Direct unit tests for the streaming envelope parser. The integration
// test boots a real backend; these tests run entirely in-memory using
// a fake reader so they're fast and isolated, and pin down edge cases
// that an integration test would hide.

function frame(obj: unknown, opts?: { end?: boolean }): Uint8Array {
  const payload = new TextEncoder().encode(JSON.stringify(obj))
  const buf = new Uint8Array(5 + payload.length)
  buf[0] = opts?.end ? 0x02 : 0
  new DataView(buf.buffer).setUint32(1, payload.length)
  buf.set(payload, 5)
  return buf
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((acc, p) => acc + p.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const p of parts) { out.set(p, offset); offset += p.length }
  return out
}

function makeReader(chunks: Uint8Array[]): ReadableStreamDefaultReader<Uint8Array> {
  let i = 0
  return {
    read: async () => i < chunks.length
      ? { done: false, value: chunks[i++] }
      : { done: true, value: undefined },
    releaseLock: () => {},
    cancel: async () => {},
    closed: Promise.resolve(undefined),
  } as unknown as ReadableStreamDefaultReader<Uint8Array>
}

describe('parseConnectEnvelopes', () => {
  it('decodes a single frame in a single chunk', async () => {
    const messages: unknown[] = []
    await parseConnectEnvelopes(makeReader([frame({ x: 1 })]), {
      onMessage: m => messages.push(m),
      isDisposed: () => false,
    })
    expect(messages).toEqual([{ x: 1 }])
  })

  it('decodes multiple frames concatenated in one chunk', async () => {
    const buf = concat(frame({ a: 1 }), frame({ a: 2 }), frame({ a: 3 }))
    const messages: unknown[] = []
    await parseConnectEnvelopes(makeReader([buf]), {
      onMessage: m => messages.push(m),
      isDisposed: () => false,
    })
    expect(messages).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
  })

  it('decodes a frame split across multiple chunks', async () => {
    const full = frame({ symbol: 'BTC', value: 67000 })
    // Split mid-payload AND mid-header to exercise both partial cases.
    const chunks = [full.slice(0, 3), full.slice(3, 8), full.slice(8)]
    const messages: unknown[] = []
    await parseConnectEnvelopes(makeReader(chunks), {
      onMessage: m => messages.push(m),
      isDisposed: () => false,
    })
    expect(messages).toEqual([{ symbol: 'BTC', value: 67000 }])
  })

  it('passes a clean trailer body to onTrailer', async () => {
    const trailers: ConnectTrailer[] = []
    await parseConnectEnvelopes(makeReader([frame({}, { end: true })]), {
      onMessage: () => {},
      onTrailer: t => trailers.push(t),
      isDisposed: () => false,
    })
    expect(trailers).toEqual([{}])
  })

  it('surfaces errors carried in the trailer body', async () => {
    const trailers: ConnectTrailer[] = []
    const errFrame = frame({ error: { code: 'unavailable', message: 'upstream down' } }, { end: true })
    await parseConnectEnvelopes(makeReader([frame({ ok: true }), errFrame]), {
      onMessage: () => {},
      onTrailer: t => trailers.push(t),
      isDisposed: () => false,
    })
    expect(trailers.length).toBe(1)
    expect(trailers[0].error?.code).toBe('unavailable')
    expect(trailers[0].error?.message).toBe('upstream down')
  })

  it('returns immediately after the trailer (no further messages emitted)', async () => {
    const messages: unknown[] = []
    // A data frame after the trailer must not be processed — the
    // parser returns at trailer per Connect spec.
    const buf = concat(frame({ a: 1 }), frame({}, { end: true }), frame({ a: 'never' }))
    await parseConnectEnvelopes(makeReader([buf]), {
      onMessage: m => messages.push(m),
      onTrailer: () => {},
      isDisposed: () => false,
    })
    expect(messages).toEqual([{ a: 1 }])
  })

  it('honors isDisposed mid-stream — skips remaining frames in the chunk', async () => {
    const buf = concat(frame({ a: 1 }), frame({ a: 2 }), frame({ a: 3 }))
    const messages: unknown[] = []
    let count = 0
    await parseConnectEnvelopes(makeReader([buf]), {
      onMessage: m => {
        messages.push(m)
        count++
      },
      isDisposed: () => count >= 2,
    })
    expect(messages.length).toBe(2)
  })

  it('skips malformed JSON without throwing or aborting the stream', async () => {
    // Hand-craft a frame with non-JSON payload, followed by a valid frame.
    const bad = (() => {
      const payload = new TextEncoder().encode('{not json')
      const buf = new Uint8Array(5 + payload.length)
      buf[0] = 0
      new DataView(buf.buffer).setUint32(1, payload.length)
      buf.set(payload, 5)
      return buf
    })()
    const messages: unknown[] = []
    await parseConnectEnvelopes(makeReader([concat(bad, frame({ ok: true }))]), {
      onMessage: m => messages.push(m),
      isDisposed: () => false,
    })
    expect(messages).toEqual([{ ok: true }])
  })

  it('handles an empty trailer body (zero-length payload)', async () => {
    // Trailer with length=0 — common shape from minimal backends.
    const buf = new Uint8Array(5)
    buf[0] = 0x02
    new DataView(buf.buffer).setUint32(1, 0)
    const trailers: ConnectTrailer[] = []
    await parseConnectEnvelopes(makeReader([buf]), {
      onMessage: () => {},
      onTrailer: t => trailers.push(t),
      isDisposed: () => false,
    })
    expect(trailers).toEqual([{}])
  })

  it('does not call onTrailer when the stream closes without a trailer frame', async () => {
    // Simulates the "server crashed mid-stream, reader closed" path —
    // the consumer (useWatchAction) handles this via its own finally.
    let trailerCalled = false
    await parseConnectEnvelopes(makeReader([frame({ a: 1 })]), {
      onMessage: () => {},
      onTrailer: () => { trailerCalled = true },
      isDisposed: () => false,
    })
    expect(trailerCalled).toBe(false)
  })
})
