/**
 * Pure model for DataGrid: the rendered window, client sorting, range
 * selection and keyboard movement. The React component owns state and DOM;
 * these functions are unit-tested without a browser.
 */
import { type PropertyKind } from '../objects/propertyFormat';
/** The sort a grid applies (or a server applied). */
export interface DataGridSort {
    columnId: string;
    direction: 'ascending' | 'descending';
}
/** The part of a column the model needs. */
export interface SortableColumn<Row> {
    id: string;
    accessor?: (row: Row) => unknown;
    sortValue?: (row: Row) => string | number | null;
    kind?: PropertyKind;
    format?: string;
}
/** A column's value for a row: its accessor, else the row's own field. */
export declare function cellValue<Row>(column: SortableColumn<Row>, row: Row): unknown;
/**
 * Rows sorted by a column. Stable, and empty values stay last in both
 * directions.
 */
export declare function sortRows<Row>(rows: readonly Row[], column: SortableColumn<Row> | undefined, direction: DataGridSort['direction'], locale?: string): readonly Row[];
/** The next sort after activating a column header: ascending, descending, off. */
export declare function nextSort(current: DataGridSort | null, columnId: string): DataGridSort | null;
/** First and last (exclusive) row index to render. */
export interface RowWindow {
    start: number;
    end: number;
}
/**
 * The rows intersecting the viewport plus `overscan` rows on each side.
 * With virtualisation off every row is in the window.
 */
export declare function rowWindow(rowCount: number, scrollTop: number, viewportHeight: number, rowHeight: number, overscan: number, virtualize: boolean): RowWindow;
/** The scroll offset that brings a row fully into view below a sticky header. */
export declare function scrollOffsetFor(rowIndex: number, scrollTop: number, viewportHeight: number, rowHeight: number, headerHeight: number): number;
/** Keys between an anchor and a target, inclusive, in row order. */
export declare function rangeKeys(orderedKeys: readonly string[], anchor: string, target: string): string[];
/** The focused cell: row -1 is the header row. */
export interface GridPosition {
    row: number;
    column: number;
}
/**
 * The cell a navigation key moves to, or null for keys the grid does not
 * handle. Rows run from -1 (header) to `rowCount - 1`.
 */
export declare function moveFocus(position: GridPosition, key: string, { rowCount, columnCount, pageRows, ctrl }: {
    rowCount: number;
    columnCount: number;
    pageRows: number;
    ctrl: boolean;
}): GridPosition | null;
/** A column as the width fit sees it. */
export interface FitColumn {
    /** Its natural width: set, resized, or measured from its content. */
    width: number;
    /** The narrowest it may give way to. */
    min: number;
    /** Whether it gives way when the grid is too narrow (content-sized text). */
    shrink: boolean;
    /** Columns of a higher tier give way only once lower tiers are at their minimum. */
    tier?: number;
}
/**
 * Column widths that fit the available width. Columns keep their natural
 * width when they all fit. When they do not, the columns that may shrink
 * give way, lowest tier first, each in proportion to how far it can (never
 * below its minimum), but only if that makes every column fit: when even
 * their minimums leave the grid too wide, every column keeps its natural
 * width and the grid scrolls, so no column gives way on a grid that has to
 * scroll anyway. Numbers, dates, chips and set widths never shrink.
 */
export declare function fitColumnWidths(columns: readonly FitColumn[], available: number): number[];
