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
  lastUpdated: number | null // epoch ms
  connected: boolean // true when streaming connection is active
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

    // Inline data — no fetch needed
    if (source.data !== undefined) {
      handleData(source.data)
      return
    }

    if (!source.url) {
      setLoading(false)
      return
    }

    const streamType = source.stream === true ? 'sse'
      : source.stream === 'ws' ? 'ws'
      : source.stream === 'sse' ? 'sse'
      : null

    // --- WebSocket ---
    if (streamType === 'ws') {
      let ws: WebSocket | null = null
      let disposed = false

      const connect = () => {
        if (disposed) return
        ws = new WebSocket(source.url!)

        ws.onopen = () => {
          setConnected(true)
          setError(null)
          reconnectDelay.current = INITIAL_RECONNECT_DELAY
        }

        ws.onmessage = (e) => {
          try {
            const parsed = JSON.parse(e.data)
            handleData(parsed)
          } catch {
            setError('Failed to parse WebSocket data')
          }
        }

        ws.onerror = () => {
          setError('WebSocket error')
        }

        ws.onclose = () => {
          setConnected(false)
          if (!disposed) {
            // Auto-reconnect with exponential backoff
            reconnectTimer.current = setTimeout(() => {
              reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY)
              connect()
            }, reconnectDelay.current)
          }
        }
      }

      connect()

      return () => {
        disposed = true
        clearTimeout(reconnectTimer.current)
        ws?.close()
        setConnected(false)
      }
    }

    // --- SSE (Server-Sent Events) ---
    if (streamType === 'sse') {
      let es: EventSource | null = null
      let disposed = false

      const connect = () => {
        if (disposed) return
        es = new EventSource(source.url!)

        es.onopen = () => {
          setConnected(true)
          setError(null)
          reconnectDelay.current = INITIAL_RECONNECT_DELAY
        }

        es.onmessage = (e) => {
          try {
            const parsed = JSON.parse(e.data)
            handleData(parsed)
          } catch {
            setError('Failed to parse stream data')
          }
        }

        es.onerror = () => {
          es?.close()
          setConnected(false)
          if (!disposed) {
            setError('Stream disconnected, reconnecting...')
            reconnectTimer.current = setTimeout(() => {
              reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY)
              connect()
            }, reconnectDelay.current)
          }
        }
      }

      connect()

      return () => {
        disposed = true
        clearTimeout(reconnectTimer.current)
        es?.close()
        setConnected(false)
      }
    }

    // --- Regular fetch (+ optional polling) ---
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
        const json = await res.json()
        handleData(json)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    let interval: ReturnType<typeof setInterval> | undefined
    if (source.refreshInterval && source.refreshInterval > 0) {
      interval = setInterval(fetchData, source.refreshInterval)
    }

    return () => {
      controller.abort()
      if (interval) clearInterval(interval)
    }
  }, [source?.url, source?.data, source?.stream, source?.refreshInterval, source?.method, source?.transform, handleData])

  return { data, loading, error, lastUpdated, connected }
}
