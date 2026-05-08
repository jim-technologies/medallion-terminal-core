import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import type { DataSource } from '../types/template'
import { parseConnectEnvelopes, CONNECT_JSON_CONTENT_TYPE } from '../core/connectFraming'
import { getNested } from '../core/getNested'

// Resolve the proto-canonical inline / refresh names with the legacy
// camelCase aliases that pre-rename templates emit. Removes once all
// authored templates migrate.
function getInline(s: DataSource): unknown {
  return s.inline ?? s.data
}
function getRefreshMs(s: DataSource): number | undefined {
  return s.refreshIntervalMs ?? s.refreshInterval
}

const MAX_RECONNECT_DELAY = 30000
const INITIAL_RECONNECT_DELAY = 1000

function applyTransform(data: unknown, transform?: string): unknown {
  return transform ? getNested(data, transform) : data
}

// Names of the oneof cases in DataResponse.payload. If a backend
// response is shaped exactly { <case>: <payload> }, unwrap it so
// widgets see the payload directly. Anything else is passed through
// unchanged — backends that don't speak the contract still work.
const DATA_RESPONSE_CASES = new Set([
  'timeseries',
  'candles',
  'table',
  'metric',
  'gauge',
  'heatmap',
  'events',
  'distribution',
  'text',
  'orderbook',
  'paired_grid',
  'embed',
])

function unwrapDataResponse(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw
  const keys = Object.keys(raw as Record<string, unknown>)
  if (keys.length === 1 && DATA_RESPONSE_CASES.has(keys[0])) {
    return (raw as Record<string, unknown>)[keys[0]]
  }
  return raw
}

export interface DataSourceState {
  data: unknown
  loading: boolean
  error: string | null
  lastUpdated: number | null
  connected: boolean
  // Manually trigger a refetch. No-op for inline sources.
  refresh: () => void
}

export function useDataSource(source?: DataSource): DataSourceState {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)
  const [refreshTick, setRefreshTick] = useState(0)
  const refresh = useCallback(() => setRefreshTick(t => t + 1), [])
  const reconnectDelay = useRef(INITIAL_RECONNECT_DELAY)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Throttling: leading-edge immediate, then at most one trailing
  // render per `throttleMs` window. Drops intermediate ticks but
  // always renders the latest.
  const throttleQueue = useRef<unknown>(null)
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastApplied = useRef(0)

  const apply = useCallback((raw: unknown) => {
    const result = applyTransform(unwrapDataResponse(raw), source?.transform)
    setData(result)
    setError(null)
    setLoading(false)
    setLastUpdated(Date.now())
    lastApplied.current = Date.now()
  }, [source?.transform])

  const handleData = useCallback((raw: unknown) => {
    const throttle = source?.throttleMs ?? 0
    if (throttle <= 0) { apply(raw); return }

    const elapsed = Date.now() - lastApplied.current
    if (elapsed >= throttle) {
      apply(raw)
      return
    }
    throttleQueue.current = raw
    if (!throttleTimer.current) {
      throttleTimer.current = setTimeout(() => {
        if (throttleQueue.current !== null) apply(throttleQueue.current)
        throttleQueue.current = null
        throttleTimer.current = undefined
      }, throttle - elapsed)
    }
  }, [apply, source?.throttleMs])

  // A stable string key that captures every field that should trigger a
  // refetch. Crucially this includes `body` and `headers` — without them,
  // params changing via ${ctx.x} substitution would build a new POST body
  // but the effect would never re-run because the URL stays identical.
  const fetchKey = useMemo(() => {
    if (!source) return ''
    return JSON.stringify([
      source.url,
      source.source_id,
      source.method,
      source.body,
      source.headers,
      source.stream,
      getRefreshMs(source),
      source.transform,
      source.throttleMs,
      // Inline gets a separate key (truncated to keep the dep stable for
      // payload-identity changes only when the value itself mutates).
      source.inline !== undefined || source.data !== undefined,
    ])
  }, [source])

  useEffect(() => {
    if (!source) {
      setLoading(false)
      return
    }

    // Inline data — fire and forget.
    const inline = getInline(source)
    if (inline !== undefined) {
      handleData(inline)
      return
    }

    if (!source.url) {
      setLoading(false)
      return
    }

    // --- ConnectRPC server-streaming ---
    if (source.stream === 'connect') {
      let disposed = false
      const ctrl = new AbortController()

      const connect = async () => {
        if (disposed) return
        try {
          const res = await fetch(source.url!, {
            method: 'POST',
            // Spread author headers first so the protocol Content-Type
            // wins. Otherwise a stray Content-Type header on the source
            // overrides the connect+json marker.
            headers: { ...source.headers, 'Content-Type': CONNECT_JSON_CONTENT_TYPE },
            body: JSON.stringify(source.body ?? {}),
            signal: ctrl.signal,
          })
          if (!res.ok) throw new Error(`ConnectRPC: HTTP ${res.status}`)
          if (!res.body) throw new Error('ConnectRPC: no response body')

          setConnected(true)
          setError(null)
          reconnectDelay.current = INITIAL_RECONNECT_DELAY

          const reader = res.body.getReader()
          await parseConnectEnvelopes(reader, {
            onMessage: handleData,
            onTrailer: trailer => {
              // A non-null `error` means the stream errored before
              // clean close — surface it as the widget's error so
              // reconnect/backoff can react.
              if (trailer.error) {
                const code = trailer.error.code ?? 'unknown'
                const msg = trailer.error.message ?? 'stream error'
                if (!disposed) setError(`${code}: ${msg}`)
              }
            },
            isDisposed: () => disposed,
          })
          reader.releaseLock()
        } catch (err: unknown) {
          // AbortError on cleanup is expected; surface anything else.
          if (!disposed && err instanceof Error && err.name !== 'AbortError') setError(err.message)
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
      return () => {
        disposed = true
        ctrl.abort()
        clearTimeout(reconnectTimer.current)
        setConnected(false)
      }
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
    const refreshMs = getRefreshMs(source)
    if (refreshMs && refreshMs > 0) {
      interval = setInterval(fetchData, refreshMs)
    }

    return () => { controller.abort(); if (interval) clearInterval(interval) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey, handleData, refreshTick])

  // Drain pending throttled update on unmount so we don't leak timers.
  useEffect(() => () => {
    if (throttleTimer.current) clearTimeout(throttleTimer.current)
  }, [])

  return { data, loading, error, lastUpdated, connected, refresh }
}
