import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  type IChartApi,
  type CandlestickData,
  type HistogramData,
} from 'lightweight-charts'
import type { WidgetProps } from '../types/template'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySeries = any

export function Candlestick({ data }: WidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleRef = useRef<AnySeries>(null)
  const volumeRef = useRef<AnySeries>(null)

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
    }
  }, [])

  // Update data when it changes
  useEffect(() => {
    if (!candleRef.current) return

    const result = normalize(data)
    if (result.candles.length === 0) return

    candleRef.current.setData(result.candles)
    if (result.volumes.length > 0 && volumeRef.current) {
      volumeRef.current.setData(result.volumes)
    }

    chartRef.current?.timeScale().fitContent()
  }, [data])

  const result = normalize(data)
  if (result.candles.length === 0) {
    return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
  }

  return <div ref={containerRef} className="w-full h-full" />
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

function toTime(val: unknown): string {
  if (typeof val === 'number') {
    const d = val > 1e12 ? new Date(val) : new Date(val * 1000)
    return d.toISOString().split('T')[0]
  }
  return String(val).split('T')[0]
}

function normalize(data: unknown): { candles: CandlestickData[]; volumes: HistogramData[] } {
  const empty = { candles: [] as CandlestickData[], volumes: [] as HistogramData[] }
  if (!data) return empty

  const arr = Array.isArray(data) ? data : []
  if (arr.length === 0 || typeof arr[0] !== 'object' || arr[0] === null) return empty

  const sample = arr[0] as Record<string, unknown>
  const tsKey = findKey(sample, TS_KEYS)
  const openKey = findKey(sample, ['open', 'o'])
  const highKey = findKey(sample, ['high', 'h'])
  const lowKey = findKey(sample, ['low', 'l'])
  const closeKey = findKey(sample, ['close', 'c'])
  const volumeKey = findKey(sample, ['volume', 'vol', 'v'])

  if (!tsKey || !openKey || !highKey || !lowKey || !closeKey) return empty

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

  return { candles, volumes }
}
