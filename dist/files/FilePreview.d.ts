import { type PreviewLimits } from './previewPolicy';
/** The file to preview. Bytes stay on the product origin that serves `url`. */
export interface FilePreviewFile {
    /** File name; its extension picks the preview. */
    name: string;
    /** Where the bytes are read (Range-capable for text). */
    url: string;
    /** Declared type; used only for files without an extension. */
    contentType?: string;
    /** Size, when known, to skip fetching files over the limits. */
    sizeBytes?: number;
}
/** Props for a bounded, safe file preview. */
export interface FilePreviewProps {
    file: FilePreviewFile;
    /** Transport for reads, such as a product fetch; the global `fetch` when unset. */
    fetch?: typeof globalThis.fetch;
    /** Overrides of the default limits. */
    limits?: Partial<PreviewLimits>;
    /** Offered when the file cannot be previewed. */
    onDownload?: () => void;
    /** Height of scrolling previews (CSS or pixels). */
    height?: number | string;
    className?: string;
}
/**
 * A file preview with the Terminal's Common Files policy: text, code, JSON
 * and Markdown read at most 1 MB (a Range request, and a bounded read if
 * the server ignores it); CSV and TSV parse at most 1,000 rows × 100
 * columns into a windowed grid; PNG, JPEG, GIF, WebP and PDF are fetched
 * only under their size limits and shown only when their bytes carry the
 * right signature (so a renamed SVG or HTML page never renders); audio and
 * video play natively; HTML, SVG and XML show as source; everything else
 * offers a download. Markdown is sanitised.
 */
export declare function FilePreview({ file, fetch: transport, limits: overrides, onDownload, height, className }: FilePreviewProps): import("react").JSX.Element;
