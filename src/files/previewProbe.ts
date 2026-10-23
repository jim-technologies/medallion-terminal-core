/** Read a small Range prefix, cancelling its body even when Range is ignored. */
export async function probePreview(
  url: string,
  maxBytes: number,
  transport: typeof globalThis.fetch,
  signal?: AbortSignal,
): Promise<{ response: Response, bytes: Uint8Array<ArrayBuffer> }> {
  const controller = new AbortController()
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let cancel: () => void = () => {}
  const stopped = new Promise<never>((_, reject) => {
    cancel = () => {
      controller.abort()
      void reader?.cancel().catch(() => {})
      reject(signal?.reason ?? new DOMException('Preview cancelled', 'AbortError'))
    }
    signal?.addEventListener('abort', cancel, { once: true })
    timer = setTimeout(() => {
      controller.abort()
      void reader?.cancel().catch(() => {})
      reject(new DOMException('Preview probe timed out', 'TimeoutError'))
    }, 10_000)
    if (signal?.aborted) cancel()
  })
  const read = async () => {
    const response = await transport(url, {
      credentials: 'same-origin',
      headers: { Range: `bytes=0-${maxBytes - 1}` },
      signal: controller.signal,
    })
    if (controller.signal.aborted) {
      void response.body?.cancel().catch(() => {})
      throw new DOMException('Preview cancelled', 'AbortError')
    }
    const bytes = new Uint8Array(maxBytes)
    let length = 0
    if (response.body) {
      reader = response.body.getReader()
      if (response.ok) {
        while (length < maxBytes) {
          const { done, value } = await reader.read()
          if (controller.signal.aborted) throw new DOMException('Preview cancelled', 'AbortError')
          if (done) break
          const part = value.subarray(0, maxBytes - length)
          bytes.set(part, length)
          length += part.length
        }
      }
    }
    return { response, bytes: bytes.slice(0, length) }
  }
  try {
    return await Promise.race([read(), stopped])
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', cancel)
    void reader?.cancel().catch(() => {})
    controller.abort()
  }
}
