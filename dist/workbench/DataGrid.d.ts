import { type MouseEvent, type ReactNode } from 'react';
import { type MenuItem } from '../components/Overlays';
import type { Density, StatusTone } from '../foundations/types';
import { type PropertyKind } from '../objects/propertyFormat';
import { type DataGridSort } from './dataGridModel';
export type { DataGridSort } from './dataGridModel';
/** What a custom cell renderer receives besides the row. */
export interface DataGridCellContext {
    /** The column's value for this row. */
    value: unknown;
    /** Position in the displayed (sorted) rows. */
    rowIndex: number;
    /** Whether the row is selected. */
    selected: boolean;
}
/** One grid column. */
export interface DataGridColumn<Row> {
    /** Stable id; also the row field read when there is no accessor. */
    id: string;
    /** Header text and the column's accessible name. */
    header: string;
    /** Reads the value; defaults to `row[id]`. */
    accessor?: (row: Row) => unknown;
    /** Typed rendering and alignment when there is no custom `cell`. */
    kind?: PropertyKind;
    /** Kind refinement such as `currency:USD`. */
    format?: string;
    /** Status tones for enum values. */
    tones?: Readonly<Record<string, StatusTone>>;
    /** Custom cell content. Keep it one line; rows have a fixed height. */
    cell?: (row: Row, context: DataGridCellContext) => ReactNode;
    /** Initial width in pixels (160 when unset). */
    width?: number;
    /** Narrowest width a resize may reach (48 when unset). */
    minWidth?: number;
    /** Takes the remaining width; the last column grows when none does. */
    grow?: boolean;
    /** Alignment; numeric kinds align to the end. */
    align?: 'start' | 'end';
    /** Allows sorting by this column (true when unset). */
    sortable?: boolean;
    /** Sort key; defaults to the typed value. */
    sortValue?: (row: Row) => string | number | null;
    /** Sticks to the start while scrolling horizontally (leading columns only). */
    pinned?: boolean;
    /** Carries the row link; the first column does when none is primary. */
    primary?: boolean;
}
/** Props for the windowed data grid. */
export interface DataGridProps<Row> {
    /** Accessible name of the grid. */
    label: string;
    /** Column definitions. */
    columns: readonly DataGridColumn<Row>[];
    /** Rows, in order (or already sorted, with `sortMode="server"`). */
    rows: readonly Row[];
    /** Stable row identity. */
    rowKey: (row: Row, index: number) => string;
    /** Row name for selection checkboxes and menus; defaults to the first column's text. */
    rowLabel?: (row: Row) => string;
    /** `multi` adds a checkbox column and range selection. */
    selection?: 'none' | 'single' | 'multi';
    /** Controlled selection. */
    selectedKeys?: readonly string[];
    /** Initial selection when uncontrolled. */
    defaultSelectedKeys?: readonly string[];
    /** Called with the full selection after every change. */
    onSelectionChange?: (keys: string[]) => void;
    /** Controlled sort; `null` is unsorted. */
    sort?: DataGridSort | null;
    /** Initial sort when uncontrolled. */
    defaultSort?: DataGridSort | null;
    /** Called when a header asks for a new sort. */
    onSortChange?: (sort: DataGridSort | null) => void;
    /** `server` shows rows as given and only reports the requested sort. */
    sortMode?: 'client' | 'server';
    /** Enter or double-click on a row. Without it, a row link is followed. */
    onRowActivate?: (row: Row) => void;
    /** One link per row, on the primary column. */
    rowHref?: (row: Row) => string | undefined;
    /** Host navigation for a plain click on the row link. */
    onNavigate?: (row: Row, event: MouseEvent<HTMLAnchorElement>) => void;
    /** Commands for the context menu (right-click, the Menu key, Shift+F10). */
    contextActions?: (row: Row) => readonly MenuItem[];
    /** F2 on a cell: rename or edit it. */
    onCellEdit?: (row: Row, columnId: string) => void;
    /** Called once per page when the last rows come into view. */
    onEndReached?: () => void;
    /** Known total, when larger than the rows loaded so far. */
    totalRows?: number;
    /** Shows skeleton rows (no rows yet) or a loading-more row. */
    loading?: boolean;
    /** Shown when there are no rows and nothing is loading. */
    empty?: ReactNode;
    /** Row density; the scope's when unset. */
    density?: Density;
    /** Fixed row height in pixels; the density's when unset. */
    rowHeight?: number;
    /** Viewport height (CSS or pixels); fills the parent by default. */
    height?: number | string;
    /** Renders only the rows in view (`auto`: above 200 rows). */
    virtualize?: boolean | 'auto';
    /** Rows rendered beyond each edge of the viewport. */
    overscan?: number;
    /** Content under the grid, such as Pagination. */
    footer?: ReactNode;
    /** Stable `data-*` hooks per row, such as the entry kind. */
    rowProps?: (row: Row) => Readonly<Record<`data-${string}`, string | undefined>>;
    /** Additional class for the outer element. */
    className?: string;
}
/**
 * A dense, windowed data grid on the WAI-ARIA grid pattern: one tab stop,
 * arrows, Home/End (Ctrl for the corners), PageUp/PageDown, Enter to open,
 * Space to select, Shift for ranges, the Menu key or Shift+F10 for row
 * actions and F2 to edit. Headers sort and resize (drag, or Alt+arrows).
 * Above 200 rows only the rows in view are rendered, so ten thousand rows
 * stay under 1,500 DOM nodes. Cells render typed values with
 * `PropertyValue` unless a column supplies its own content.
 */
export declare function DataGrid<Row>({ label, columns, rows, rowKey, rowLabel, selection, selectedKeys, defaultSelectedKeys, onSelectionChange, sort, defaultSort, onSortChange, sortMode, onRowActivate, rowHref, onNavigate, contextActions, onCellEdit, onEndReached, totalRows, loading, empty, density, rowHeight, height, virtualize, overscan, footer, rowProps, className, }: DataGridProps<Row>): import("react").JSX.Element;
