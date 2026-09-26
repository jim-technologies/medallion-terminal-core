import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from 'react'
import { IconButton } from '../components/Button'
import { Icon } from '../components/Icon'
import { useMessage } from '../foundations/DesignSystemProvider'

interface Offset {
  x: number
  y: number
  zoom: number
}

const MIN_ZOOM = 0.4
const MAX_ZOOM = 3
const STEP = 1.25
// Content is never drawn smaller than this on first render, so labels stay
// legible; larger graphs are cropped and panned instead.
const MIN_FIT = 0.8
const HOME: Offset = { x: 0, y: 0, zoom: 1 }

/** Props for the pan-and-zoom SVG frame shared by the graph components. */
export interface GraphCanvasProps {
  /** Accessible name of the graph. */
  label: string
  /** Content bounds in SVG user units (pixels at zoom 1). */
  width: number
  height: number
  /** Rendered height in pixels (the width follows the container). */
  viewHeight: number
  /** Graph content, drawn in content coordinates. */
  children: ReactNode
}

/**
 * A plain SVG canvas at one user unit per pixel. The content starts centred
 * and fitted (never below 80%, so labels stay legible); drag the background
 * to pan, zoom with the buttons or Ctrl/⌘ and the wheel, and reset to the
 * fitted view. Arrow keys move focus between elements marked
 * `data-graph-node`, in document order.
 */
export function GraphCanvas({ label, width, height, viewHeight, children }: GraphCanvasProps) {
  const t = useMessage()
  const frameRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ pointerId: number; x: number; y: number; offset: Offset } | null>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const [offset, setOffset] = useState<Offset>(HOME)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const measure = () => setFrameWidth(frame.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const viewWidth = frameWidth || width
  const fit = Math.min(1, Math.max(MIN_FIT, Math.min(viewWidth / width, viewHeight / height)))
  const scale = fit * offset.zoom
  const x = (viewWidth - width * scale) / 2 + offset.x
  const y = (viewHeight - height * scale) / 2 + offset.y

  const zoomBy = (factor: number) => setOffset(current => ({
    ...current,
    zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.zoom * factor)),
  }))

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest('[data-graph-node]')) return
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, offset }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const start = drag.current
    if (!start || start.pointerId !== event.pointerId) return
    setOffset({
      ...start.offset,
      x: start.offset.x + event.clientX - start.x,
      y: start.offset.y + event.clientY - start.y,
    })
  }
  const onPointerUp = () => {
    drag.current = null
  }
  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    zoomBy(event.deltaY < 0 ? STEP : 1 / STEP)
  }
  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!/^Arrow(Up|Down|Left|Right)$/.test(event.key)) return
    const nodes = [...(svgRef.current?.querySelectorAll<SVGElement>('[data-graph-node]') ?? [])]
    const index = nodes.indexOf(document.activeElement as SVGElement)
    if (index < 0) return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
    nodes[(index + delta + nodes.length) % nodes.length]?.focus()
  }

  return (
    <div ref={frameRef} className="mtc-graph-canvas" style={{ height: viewHeight }}>
      <svg
        ref={svgRef}
        role="group"
        aria-label={label}
        width={viewWidth}
        height={viewHeight}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="mtc-graph-svg"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
      >
        <g transform={`translate(${round(x)} ${round(y)}) scale(${round(scale)})`}>{children}</g>
      </svg>
      <div className="mtc-graph-controls">
        <IconButton icon={<Icon name="add" />} aria-label={t('graph.zoomIn')} size="small" onClick={() => zoomBy(STEP)} />
        <IconButton icon={<Icon name="minus" />} aria-label={t('graph.zoomOut')} size="small" onClick={() => zoomBy(1 / STEP)} />
        <IconButton icon={<Icon name="refresh" />} aria-label={t('graph.reset')} size="small" onClick={() => setOffset(HOME)} />
      </div>
    </div>
  )
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
