// Shared Connect server-streaming envelope parser. Used by both
// useDataSource (data sources) and useWatchAction (action lifecycles).
//
// Frame format: [flags(1)][length(4 BE)][payload N].
// flags bit 0x02 marks the trailers / end-of-stream frame.

export const CONNECT_JSON_CONTENT_TYPE = 'application/connect+json'

const decoder = new TextDecoder()

// Connect end-stream-frame body. Per the protocol spec, the trailer
// body is JSON with optional `metadata` and optional `error`. A
// non-null `error` means the stream errored before clean close.
export interface ConnectTrailer {
  metadata?: Record<string, unknown>
  error?: { code?: string; message?: string }
}

interface ParseHandlers {
  onMessage: (parsed: unknown) => void
  onTrailer?: (trailer: ConnectTrailer) => void
  isDisposed: () => boolean
}

// Drains a ReadableStreamDefaultReader of Connect-framed JSON
// messages until the stream closes or `isDisposed()` returns true.
// Returns when the stream is done; callers handle abort/reconnect.
//
// Performance: uses an advancing `cursor` instead of `buffer.slice()`
// inside the parse loop, so a 1MB read draining 10k envelopes is
// linear rather than quadratic in buffer length. The consumed prefix
// is dropped when each new chunk arrives, keeping the buffer
// proportional to "unparsed bytes," not "ever-received bytes."
export async function parseConnectEnvelopes(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  handlers: ParseHandlers,
): Promise<void> {
  let buffer = new Uint8Array(0)
  let cursor = 0

  while (!handlers.isDisposed()) {
    const { done, value } = await reader.read()
    if (done) break
    if (value && value.length > 0) {
      // Drop the consumed prefix when appending — keeps the buffer
      // proportional to "unparsed bytes", not "ever-received bytes".
      const remaining = buffer.length - cursor
      const next = new Uint8Array(remaining + value.length)
      if (remaining > 0) next.set(buffer.subarray(cursor), 0)
      next.set(value, remaining)
      buffer = next
      cursor = 0
    }

    while (buffer.length - cursor >= 5) {
      const flags = buffer[cursor]
      const length = new DataView(buffer.buffer, buffer.byteOffset + cursor + 1, 4).getUint32(0)
      if (buffer.length - cursor < 5 + length) break
      if (flags & 0x02) {
        const trailerPayload = buffer.subarray(cursor + 5, cursor + 5 + length)
        cursor += 5 + length
        let trailer: ConnectTrailer = {}
        try {
          if (trailerPayload.length > 0) {
            trailer = JSON.parse(decoder.decode(trailerPayload)) as ConnectTrailer
          }
        } catch { /* malformed trailer → treat as clean close */ }
        if (!handlers.isDisposed()) handlers.onTrailer?.(trailer)
        return
      }
      const payload = buffer.subarray(cursor + 5, cursor + 5 + length)
      cursor += 5 + length
      try {
        const parsed = JSON.parse(decoder.decode(payload))
        if (!handlers.isDisposed()) handlers.onMessage(parsed)
      } catch { /* skip malformed */ }
    }
  }
}
