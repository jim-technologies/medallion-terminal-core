import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
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

/** A rectangle in content coordinates. */
export interface GraphRect {
  x: number
  y: number
  width: number
  height: number
}

/** What a graph drawing needs to know about the current view. */
export interface GraphView {
  /** Content units to screen pixels: fit times zoom. */
  scale: number
  /** Whether labels are drawn (they are hidden when zoomed far out). */
  labels: boolean
}

const MIN_ZOOM = 0.4
const MAX_ZOOM = 3
const STEP = 1.25
// Geometry is never fitted smaller than this; larger graphs are cropped
// (showing the focus) and panned instead.
const MIN_FIT = 0.8
// Below this scale the drawing is an overview: labels are hidden rather
// than drawn over each other (names stay in each node's accessible name).
export const LABEL_MIN_SCALE = 0.6
// Keeps the focus this far inside the frame.
const FOCUS_MARGIN = 16

/** Props for the pan-and-zoom SVG frame shared by the graph components. */
export interface GraphCanvasProps {
  /** Accessible name of the graph. */
  label: string
  /** Content bounds in SVG user units (pixels at zoom 1). */
  width: number
  height: number
  /** Rendered height in pixels (the width follows the container). */
  viewHeight: number
  /**
   * The part to keep in view, such as the selected node: when the content
   * is larger than the frame, the first view (and Reset) pans just enough to
   * show it.
   */
  focus?: GraphRect
  /** Graph content in content coordinates, or a function of the view. */
  children: ReactNode | ((view: GraphView) => ReactNode)
}

/**
 * A plain SVG canvas at one user unit per pixel. The content starts centred
 * and fitted (geometry never below 80%), with the focus in view; drag the
 * background to pan, zoom with the buttons or Ctrl/⌘ and the wheel, and
 * reset to the fitted view. Text never shrinks with the geometry: labels
 * keep their type size (11 px at the least) at every scale, and are hidden
 * when zoomed out to an overview. Arrow keys move focus between elements
 * marked `data-graph-node`, in document order.
 */
export function GraphCanvas({ label, width, height, viewHeight, focus, children }: GraphCanvasProps) {
  const t = useMessage()
  const frameRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ pointerId: number; x: number; y: number; offset: Offset } | null>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0, zoom: 1 })

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
  // Home: centred, then panned just enough to show the focus.
  const homeX = (viewWidth - width * fit) / 2
  const homeY = (viewHeight - height * fit) / 2
  const [anchor, setAnchor] = useState({ x: 0, y: 0 })
  const focusRef = useRef(focus)
  focusRef.current = focus
  const anchorFor = (current: GraphRect | undefined) => ({
    x: current ? keepInView(homeX + current.x * fit, current.width * fit, viewWidth) : 0,
    y: current ? keepInView(homeY + current.y * fit, current.height * fit, viewHeight) : 0,
  })
  // Anchor the first view on the focus, and again when the frame or the
  // content changes size; a new selection alone does not move the view.
  useLayoutEffect(() => {
    setAnchor(anchorFor(focusRef.current))
  }, [viewWidth, viewHeight, width, height, fit])
  const reset = () => {
    setAnchor(anchorFor(focus))
    setOffset({ x: 0, y: 0, zoom: 1 })
  }

  // Zoom about the frame's centre.
  const x = viewWidth / 2 + (homeX + anchor.x + offset.x - viewWidth / 2) * offset.zoom
  const y = viewHeight / 2 + (homeY + anchor.y + offset.y - viewHeight / 2) * offset.zoom
  const view: GraphView = { scale, labels: scale >= LABEL_MIN_SCALE }

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
      x: start.offset.x + (event.clientX - start.x) / start.offset.zoom,
      y: start.offset.y + (event.clientY - start.y) / start.offset.zoom,
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

  // Text is drawn in content units inside the scaled group; dividing its
  // size by the scale keeps it at its type size on screen.
  const textScale = { '--mtc-graph-text-scale': round(Math.max(1, 1 / scale)) } as CSSProperties

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
        data-labels={view.labels ? undefined : 'hidden'}
        style={textScale}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
      >
        <g transform={`translate(${round(x)} ${round(y)}) scale(${round(scale)})`}>
          {typeof children === 'function' ? children(view) : children}
        </g>
      </svg>
      <div className="mtc-graph-controls">
        <IconButton icon={<Icon name="add" />} aria-label={t('graph.zoomIn')} size="small" onClick={() => zoomBy(STEP)} />
        <IconButton icon={<Icon name="minus" />} aria-label={t('graph.zoomOut')} size="small" onClick={() => zoomBy(1 / STEP)} />
        <IconButton icon={<Icon name="refresh" />} aria-label={t('graph.reset')} size="small" onClick={reset} />
      </div>
    </div>
  )
}

/** The pan that brings a span [start, start + size) inside [margin, frame - margin]. */
function keepInView(start: number, size: number, frame: number): number {
  if (start < FOCUS_MARGIN) return FOCUS_MARGIN - start
  if (start + size > frame - FOCUS_MARGIN) return Math.max(FOCUS_MARGIN - start, frame - FOCUS_MARGIN - start - size)
  return 0
}

/**
 * The most characters of a label that fit `width` content units at a scale,
 * for text drawn at a fixed screen size (`charWidth` pixels per character).
 */
export function labelChars(width: number, scale: number, charWidth: number): number {
  return Math.max(4, Math.floor((width * Math.min(1, scale)) / charWidth))
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
