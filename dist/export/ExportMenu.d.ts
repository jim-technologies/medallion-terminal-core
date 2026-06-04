import { type ExportableView, type ExportFormat } from './exportView';
export interface ExportMenuProps {
    view: ExportableView;
    filenameBase?: string;
    onExport?: (format: ExportFormat, ok: boolean) => void;
    variant?: 'button' | 'row';
}
export declare function ExportMenu({ view, filenameBase, onExport, variant }: ExportMenuProps): import("react/jsx-runtime").JSX.Element;
