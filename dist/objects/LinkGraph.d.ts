import { type SyntheticEvent } from 'react';
import type { LinkGroup } from './LinkPanel';
import { type ObjectRef } from './types';
/** Props for a one-hop link graph around one object. */
export interface LinkGraphProps {
    /** The object in the centre. */
    center: ObjectRef;
    /** Its link groups (the same data as `LinkPanel`). */
    groups: readonly LinkGroup[];
    /** Accessible name, such as "Links of Northstar Labs". */
    label: string;
    /** Most linked objects drawn; each group's remainder becomes "+N". */
    maxNodes?: number;
    /** Height in pixels. */
    height?: number;
    /** Host navigation for a node. */
    onNavigate?: (object: ObjectRef, event: SyntheticEvent<Element>) => void;
}
/**
 * The object's links as a one-hop ego graph: the object in the centre, each
 * link type in its own sector of a ring with the relation labelled on its
 * middle edge, at most `maxNodes` nodes (the rest summarised as "+N"). The
 * layout is deterministic, plain SVG with no dependency. Nodes are links:
 * Tab or the arrow keys move between them and Enter opens one; the canvas
 * pans by dragging and zooms with its buttons.
 */
export declare function LinkGraph({ center, groups, label, maxNodes, height, onNavigate, }: LinkGraphProps): import("react").JSX.Element;
