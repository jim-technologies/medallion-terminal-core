import { useEffect, useMemo, useRef } from 'react'
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  type IChartApi,
  type CandlestickData,
  type HistogramData,
  type SeriesMarker,
  type Time,
} from 'lightweight-charts'
import { useHover } from '../core/HoverContext'
import type { WidgetProps } from '../types/template'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySeries = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarkersPrimitive = any

interface Annotation {
  timestamp: string
  value?: number
  label: string
  kind?: string
  color?: string
}

// kind → (lightweight-charts marker shape, bar position, color).
// Bar positions only — keeps the shape simple. Backends that want a
// specific price-anchor can use the Timeseries widget which supports
// arbitrary y values.
const MARKER_STYLE: Record<string, { shape: SeriesMarkerShape; position: SeriesMarkerBarPosition; color: string }> = {
  buy:  { shape: 'arrowUp',   position: 'belowBar', color: '#10b981' },
  sell: { shape: 'arrowDown', position: 'aboveBar', color: '#ef4444' },
  info: { shape: 'circle',    position: 'aboveBar', color: '#0ea5e9' },
  warn: { shape: 'circle',    position: 'aboveBar', color: '#f59e0b' },
}
const DEFAULT_MARKER: { shape: SeriesMarkerShape; position: SeriesMarkerBarPosition; color: string } = {
  shape: 'circle',
  position: 'aboveBar',
  color: '#71717a',
}

type SeriesMarkerShape = 'arrowUp' | 'arrowDown' | 'circle' | 'square'
type SeriesMarkerBarPosition = 'aboveBar' | 'belowBar'

export function Candlestick({ data }: WidgetProps) {
  const { hoverTime, setHoverTime } = useHover()
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleRef = useRef<AnySeries>(null)
  const volumeRef = useRef<AnySeries>(null)
  const markersRef = useRef<MarkersPrimitive>(null)
  const lastEmitted = useRef<string | null>(null)

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      crosshair: {
        vertLine: { color: '#52525b', width: 1, style: 2 },
        horzLine: { color: '#52525b', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: '#3f3f46',
      },
      timeScale: {
        borderColor: '#3f3f46',
        timeVisible: true,
      },
      handleScroll: true,
      handleScale: true,
    })

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#34d399',
      downColor: '#f87171',
      borderDownColor: '#f87171',
      borderUpColor: '#34d399',
      wickDownColor: '#f87171',
      wickUpColor: '#34d399',
    })

    const volumes = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    chartRef.current = chart
    candleRef.current = candles
    volumeRef.current = volumes
    markersRef.current = createSeriesMarkers(candles, [])

    // Emit hover changes for cross-widget sync. We only react to events
    // from this chart; sync from elsewhere flows through hoverTime in the
    // separate effect below.
    chart.subscribeCrosshairMove(param => {
      if (param.time != null) {
        const s = String(param.time)
        lastEmitted.current = s
        setHoverTime(s)
      } else {
        lastEmitted.current = null
        setHoverTime(null)
      }
    })

    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      chart.applyOptions({ width, height })
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
      candleRef.current = null
      volumeRef.current = null
      markersRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply external hover sync. Skip when the change originated here
  // (lastEmitted matches) to avoid feedback.
  useEffect(() => {
    const chart = chartRef.current
    const series = candleRef.current
    if (!chart || !series) return
    if (hoverTime == null) {
      chart.clearCrosshairPosition()
      return
    }
    if (hoverTime === lastEmitted.current) return
    // Use the candle's last close as the y position — y is required
    // by the API but visually anchors to nearest bar via the crosshair.
    const close = series.data?.()[0]?.close ?? 0
    chart.setCrosshairPosition(close, hoverTime as unknown as Time, series)
  }, [hoverTime])

  // Memoise once per data change so the effect below and the empty-state
  // check at the bottom share the same parsed value.
  const result = useMemo(() => normalize(data), [data])

  useEffect(() => {
    if (!candleRef.current) return
    if (result.candles.length === 0) return

    candleRef.current.setData(result.candles)
    if (result.volumes.length > 0 && volumeRef.current) {
      volumeRef.current.setData(result.volumes)
    }
    if (markersRef.current) {
      markersRef.current.setMarkers(toMarkers(result.annotations))
    }

    chartRef.current?.timeScale().fitContent()
  }, [result])

  if (result.candles.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  return <div ref={containerRef} className="w-full h-full" />
}

function toMarkers(annotations: Annotation[]): SeriesMarker<Time>[] {
  return annotations.map(a => {
    const style = a.kind ? MARKER_STYLE[a.kind] ?? DEFAULT_MARKER : DEFAULT_MARKER
    return {
      time: toTime(a.timestamp) as Time,
      position: style.position,
      shape: style.shape,
      color: a.color ?? style.color,
      text: a.label,
    }
  })
}

// --- normalization ---

const TS_KEYS = ['timestamp', 'date', 'time', 'datetime', 'ts', 't']

function findKey(obj: Record<string, unknown>, candidates: string[]): string | null {
  for (const k of candidates) {
    if (k in obj) return k
  }
  const lower = Object.keys(obj).reduce((map, k) => { map[k.toLowerCase()] = k; return map }, {} as Record<string, string>)
  for (const k of candidates) {
    if (lower[k]) return lower[k]
  }
  return null
}

// lightweight-charts requires uniform time format per series:
//   - daily bars  → "yyyy-mm-dd"
//   - intraday    → Unix epoch seconds
//
// We detect intraday-ness from the input. Anything carrying a time
// component (ISO 'T' or "yyyy-mm-dd HH:MM" with a space) becomes epoch
// seconds; pure-date strings stay as "yyyy-mm-dd".
function toTime(val: unknown): string | number {
  if (typeof val === 'number') {
    // Already epoch — assume seconds unless it looks like ms.
    return val > 1e12 ? Math.floor(val / 1000) : val
  }
  const s = String(val).trim()
  if (s.includes('T') || / \d/.test(s)) {
    const d = new Date(s.replace(' ', 'T'))
    if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000)
  }
  return s.split(' ')[0].split('T')[0]
}

function normalize(data: unknown): { candles: CandlestickData[]; volumes: HistogramData[]; annotations: Annotation[] } {
  const empty = { candles: [] as CandlestickData[], volumes: [] as HistogramData[], annotations: [] as Annotation[] }
  if (!data) return empty

  // Accept either [bar, bar, ...] (shorthand) or { bars, annotations } (canonical CandlePayload).
  let arr: unknown[]
  let annotations: Annotation[] = []
  if (Array.isArray(data)) {
    arr = data
  } else if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    arr = Array.isArray(d.bars) ? d.bars : []
    if (Array.isArray(d.annotations)) {
      annotations = d.annotations.map(a => {
        const aa = a as Record<string, unknown>
        return {
          timestamp: String(aa.timestamp ?? ''),
          value: typeof aa.value === 'number' ? aa.value : undefined,
          label: String(aa.label ?? ''),
          kind: aa.kind != null ? String(aa.kind) : undefined,
          color: aa.color != null ? String(aa.color) : undefined,
        }
      })
    }
  } else {
    arr = []
  }
  if (arr.length === 0 || typeof arr[0] !== 'object' || arr[0] === null) {
    return { ...empty, annotations }
  }

  const sample = arr[0] as Record<string, unknown>
  const tsKey = findKey(sample, TS_KEYS)
  const openKey = findKey(sample, ['open', 'o'])
  const highKey = findKey(sample, ['high', 'h'])
  const lowKey = findKey(sample, ['low', 'l'])
  const closeKey = findKey(sample, ['close', 'c'])
  const volumeKey = findKey(sample, ['volume', 'vol', 'v'])

  if (!tsKey || !openKey || !highKey || !lowKey || !closeKey) return { ...empty, annotations }

  const candles: CandlestickData[] = []
  const volumes: HistogramData[] = []

  for (const item of arr) {
    const row = item as Record<string, unknown>
    const time = toTime(row[tsKey]) as CandlestickData['time']
    const open = Number(row[openKey])
    const high = Number(row[highKey])
    const low = Number(row[lowKey])
    const close = Number(row[closeKey])

    candles.push({ time, open, high, low, close })

    if (volumeKey && row[volumeKey] != null) {
      volumes.push({
        time,
        value: Number(row[volumeKey]),
        color: close >= open ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)',
      })
    }
  }

  return { candles, volumes, annotations }
}
