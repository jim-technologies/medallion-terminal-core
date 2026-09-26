import { type ReactNode } from 'react';
/** A rectangle in content coordinates. */
export interface GraphRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
/** What a graph drawing needs to know about the current view. */
export interface GraphView {
    /** Content units to screen pixels: fit times zoom. */
    scale: number;
    /** Whether labels are drawn (they are hidden when zoomed far out). */
    labels: boolean;
}
export declare const LABEL_MIN_SCALE = 0.6;
/** Props for the pan-and-zoom SVG frame shared by the graph components. */
export interface GraphCanvasProps {
    /** Accessible name of the graph. */
    label: string;
    /** Content bounds in SVG user units (pixels at zoom 1). */
    width: number;
    height: number;
    /** Rendered height in pixels (the width follows the container). */
    viewHeight: number;
    /**
     * The part to keep in view, such as the selected node: when the content
     * is larger than the frame, the first view (and Reset) pans just enough to
     * show it.
     */
    focus?: GraphRect;
    /** Graph content in content coordinates, or a function of the view. */
    children: ReactNode | ((view: GraphView) => ReactNode);
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
export declare function GraphCanvas({ label, width, height, viewHeight, focus, children }: GraphCanvasProps): import("react").JSX.Element;
/**
 * The most characters of a label that fit `width` content units at a scale,
 * for text drawn at a fixed screen size (`charWidth` pixels per character).
 */
export declare function labelChars(width: number, scale: number, charWidth: number): number;
