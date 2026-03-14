import { useState, useEffect, useRef, useCallback } from 'react'
import type { DataSource } from '../types/template'

const MAX_RECONNECT_DELAY = 30000
const INITIAL_RECONNECT_DELAY = 1000

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: Record<string, unknown>, key) => {
    if (acc && typeof acc === 'object' && key in acc) return acc[key] as Record<string, unknown>
    return undefined as unknown as Record<string, unknown>
  }, obj as Record<string, unknown>)
}

function applyTransform(data: unknown, transform?: string): unknown {
  return transform ? getNestedValue(data, transform) : data
}

export interface DataSourceState {
  data: unknown
  loading: boolean
  error: string | null
  lastUpdated: number | null
  connected: boolean
}

export function useDataSource(source?: DataSource): DataSourceState {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)
  const reconnectDelay = useRef(INITIAL_RECONNECT_DELAY)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleData = useCallback((raw: unknown) => {
    const result = applyTransform(raw, source?.transform)
    setData(result)
    setError(null)
    setLoading(false)
    setLastUpdated(Date.now())
  }, [source?.transform])

  useEffect(() => {
    if (!source) {
      setLoading(false)
      return
    }

    // Inline data
    if (source.data !== undefined) {
      handleData(source.data)
      return
    }

    if (!source.url) {
      setLoading(false)
      return
    }

    // --- ConnectRPC server-streaming ---
    if (source.stream === 'connect') {
      let disposed = false

      const connect = async () => {
        if (disposed) return
        try {
          const res = await fetch(source.url!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/connect+json', ...source.headers },
            body: JSON.stringify(source.body ?? {}),
          })
          if (!res.ok) throw new Error(`ConnectRPC: HTTP ${res.status}`)
          if (!res.body) throw new Error('ConnectRPC: no response body')

          setConnected(true)
          setError(null)
          reconnectDelay.current = INITIAL_RECONNECT_DELAY

          const reader = res.body.getReader()
          let buffer = new Uint8Array(0)

          while (!disposed) {
            const { done, value } = await reader.read()
            if (done) break
            if (value) {
              const newBuf = new Uint8Array(buffer.length + value.length)
              newBuf.set(buffer)
              newBuf.set(value, buffer.length)
              buffer = newBuf
            }

            // Parse envelopes: [flags(1) + length(4) + payload(N)]
            while (buffer.length >= 5) {
              const flags = buffer[0]
              const length = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength).getUint32(1)
              if (buffer.length < 5 + length) break
              if (flags & 0x02) { buffer = buffer.slice(5 + length); break } // trailers

              const payload = buffer.slice(5, 5 + length)
              buffer = buffer.slice(5 + length)
              try {
                const parsed = JSON.parse(new TextDecoder().decode(payload))
                if (!disposed) handleData(parsed)
              } catch { /* skip malformed */ }
            }
          }
          reader.releaseLock()
        } catch (err: unknown) {
          if (!disposed && err instanceof Error) setError(err.message)
        } finally {
          if (!disposed) {
            setConnected(false)
            reconnectTimer.current = setTimeout(() => {
              reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY)
              connect()
            }, reconnectDelay.current)
          }
        }
      }

      connect()
      return () => { disposed = true; clearTimeout(reconnectTimer.current); setConnected(false) }
    }

    // --- SSE ---
    if (source.stream === true) {
      let es: EventSource | null = null
      let disposed = false

      const connect = () => {
        if (disposed) return
        es = new EventSource(source.url!)
        es.onopen = () => { setConnected(true); setError(null); reconnectDelay.current = INITIAL_RECONNECT_DELAY }
        es.onmessage = (e) => { try { handleData(JSON.parse(e.data)) } catch { setError('Failed to parse stream') } }
        es.onerror = () => {
          es?.close(); setConnected(false)
          if (!disposed) {
            reconnectTimer.current = setTimeout(() => {
              reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY)
              connect()
            }, reconnectDelay.current)
          }
        }
      }

      connect()
      return () => { disposed = true; clearTimeout(reconnectTimer.current); es?.close(); setConnected(false) }
    }

    // --- Regular fetch (+ polling) ---
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        const res = await fetch(source.url!, {
          method: source.method || 'GET',
          headers: source.headers,
          body: source.body ? JSON.stringify(source.body) : undefined,
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        handleData(await res.json())
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    let interval: ReturnType<typeof setInterval> | undefined
    if (source.refreshInterval && source.refreshInterval > 0) {
      interval = setInterval(fetchData, source.refreshInterval)
    }

    return () => { controller.abort(); if (interval) clearInterval(interval) }
  }, [source?.url, source?.data, source?.stream, source?.refreshInterval, source?.method, source?.transform, handleData])

  return { data, loading, error, lastUpdated, connected }
}
