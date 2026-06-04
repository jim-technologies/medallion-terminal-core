export type Cell = string | number | boolean | null;
export interface FlatTable {
    columns: string[];
    rows: Record<string, Cell>[];
}
export declare function flatten(data: unknown, componentOrShape?: string): FlatTable;
