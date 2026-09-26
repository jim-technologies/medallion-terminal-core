/**
 * Deterministic radial layout for a one-hop link graph: the object in the
 * centre, its linked objects on a ring, each link type in its own sector.
 * No physics, so the same links always draw the same picture.
 */
import type { LinkGroup, LinkItem } from './LinkPanel';
/** A node on the ring: a linked object, or "+N" for a group's remainder. */
export interface EgoNode {
    key: string;
    kind: 'item' | 'more';
    groupIndex: number;
    /** Position relative to the centre object. */
    x: number;
    y: number;
    /** Angle in radians (0 points right, clockwise in SVG). */
    angle: number;
    item?: LinkItem;
    /** For `more` nodes: links not drawn. */
    moreCount?: number;
}
/** A link type's label, drawn on its sector's middle edge. */
export interface EgoLabel {
    groupIndex: number;
    x: number;
    y: number;
    text: string;
}
export interface EgoLayout {
    nodes: EgoNode[];
    labels: EgoLabel[];
    radius: number;
}
/** Nodes per group within `maxNodes`: at least one each, "+N" included. */
export declare function allocateNodes(groups: readonly LinkGroup[], maxNodes: number): number[];
/**
 * Places the allocated nodes. Sectors are proportional to their node count
 * with a small gap between link types, starting on the left and running
 * clockwise over the top.
 */
export declare function egoLayout(groups: readonly LinkGroup[], maxNodes?: number): EgoLayout;
