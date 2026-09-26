/**
 * Longest-path layered layout for directed graphs, shared by the `dag`
 * widget and `SchemaGraph`: rank(v) = max(rank(parents)) + 1, sources at 0,
 * nodes spaced evenly within their rank. Kahn traversal keeps it linear. A
 * cycle is broken where it blocks the traversal: the waiting node with the
 * fewest unmet incoming edges (input order on ties) is released as if it
 * were a source, and edges back into processed nodes do not raise ranks, so
 * ontologies with mutual links still lay out in layers. An edge that skips
 * ranks gets a route through the gaps between the nodes of each rank it
 * crosses, so it never runs through a node.
 */
export interface LayeredNodeInput {
    id: string;
}
export interface LayeredEdgeInput {
    from: string;
    to: string;
}
/** Node box and spacing, in SVG user units. */
export interface LayeredLayoutOptions {
    nodeWidth: number;
    nodeHeight: number;
    /** Distance between the starts of consecutive ranks. */
    rankGap: number;
    /** Gap between nodes of one rank. */
    nodeGap: number;
    padding: number;
    /** `down`: ranks are rows; `right`: ranks are columns. */
    direction?: 'down' | 'right';
}
export interface LaidOutNode<N> {
    node: N;
    x: number;
    y: number;
    rank: number;
}
export interface LayoutPoint {
    x: number;
    y: number;
}
export interface LaidOutEdge<E> {
    edge: E;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /**
     * For an edge that skips ranks (either way): where it enters and leaves
     * each rank in between, in order, through a gap between that rank's nodes.
     * Absent for edges between neighbouring ranks.
     */
    route?: LayoutPoint[];
}
export interface LayeredLayout<N, E> {
    nodes: LaidOutNode<N>[];
    edges: LaidOutEdge<E>[];
    width: number;
    height: number;
}
export declare function layeredLayout<N extends LayeredNodeInput, E extends LayeredEdgeInput>(nodes: readonly N[], edges: readonly E[], { nodeWidth, nodeHeight, rankGap, nodeGap, padding, direction }: LayeredLayoutOptions): LayeredLayout<N, E> | null;
