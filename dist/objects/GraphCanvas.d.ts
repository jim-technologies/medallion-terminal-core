import { type ReactNode } from 'react';
/** Props for the pan-and-zoom SVG frame shared by the graph components. */
export interface GraphCanvasProps {
    /** Accessible name of the graph. */
    label: string;
    /** Content bounds in SVG user units (pixels at zoom 1). */
    width: number;
    height: number;
    /** Rendered height in pixels (the width follows the container). */
    viewHeight: number;
    /** Graph content, drawn in content coordinates. */
    children: ReactNode;
}
/**
 * A plain SVG canvas at one user unit per pixel. The content starts centred
 * and fitted (never below 80%, so labels stay legible); drag the background
 * to pan, zoom with the buttons or Ctrl/⌘ and the wheel, and reset to the
 * fitted view. Arrow keys move focus between elements marked
 * `data-graph-node`, in document order.
 */
export declare function GraphCanvas({ label, width, height, viewHeight, children }: GraphCanvasProps): import("react").JSX.Element;
