import type { Cell, FlatTable } from './flatten';
export type ExportFormat = 'csv' | 'json' | 'ndjson' | 'parquet';
export declare const MIME: Record<ExportFormat, string>;
export declare const EXTENSION: Record<ExportFormat, string>;
export declare const EXPORT_FORMATS: {
    key: ExportFormat;
    label: string;
}[];
export declare function csvEscape(v: Cell): string;
export declare function toCsv(table: FlatTable): string;
export declare function toJson(table: FlatTable): string;
export declare function toNdjson(table: FlatTable): string;
export declare function toParquet(table: FlatTable): Promise<Uint8Array>;
export declare function serializeText(table: FlatTable, format: Exclude<ExportFormat, 'parquet'>): string;
