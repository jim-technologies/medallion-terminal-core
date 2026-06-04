import { type FlatTable } from './flatten';
import { type ExportFormat } from './serializers';
export type { ExportFormat } from './serializers';
export type { FlatTable, Cell } from './flatten';
export interface ExportableView {
    data: unknown;
    component?: string;
    table?: FlatTable;
}
export declare function exportView(view: ExportableView, format: ExportFormat): Promise<Blob>;
export declare function viewRowCount(view: ExportableView): number;
export declare function exportFilename(base: string | undefined, format: ExportFormat): string;
export declare function downloadView(view: ExportableView, format: ExportFormat, filenameBase?: string): Promise<boolean>;
