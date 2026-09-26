/**
 * The file preview policy shared by every product (the same allowlist and
 * limits as the Terminal's Common Files viewer): a conservative set of
 * formats, bounded reads, raster images and PDFs admitted only when their
 * bytes carry the right signature, and nothing interpreted as HTML, SVG or
 * XML. Pure functions; FilePreview renders the result.
 */
/** How a file is previewed. */
export type FilePreviewKind = 'image' | 'pdf' | 'video' | 'audio' | 'csv' | 'tsv' | 'json' | 'markdown' | 'code' | 'text' | 'unsupported';
/** Raster formats a preview may show, each checked by signature. */
export type RasterKind = 'png' | 'jpeg' | 'gif' | 'webp';
/** Byte and size limits; every read is bounded by them. */
export interface PreviewLimits {
    /** Text, code, JSON and Markdown: bytes read (a Range request). */
    textBytes: number;
    /** CSV and TSV: bytes read before parsing. */
    delimitedBytes: number;
    /** Raster images: larger files are not fetched. */
    imageBytes: number;
    /** PDFs: larger files are not fetched. */
    pdfBytes: number;
    /** Delimited rows kept. */
    rows: number;
    /** Delimited columns kept. */
    columns: number;
    /** Characters kept per delimited cell. */
    cellCharacters: number;
}
export declare const DEFAULT_PREVIEW_LIMITS: PreviewLimits;
/** The extension (lower case) or, for names like `Dockerfile`, the name. */
export declare function extensionOf(name: string): string;
/** What a file previews as, and its code language when it is source. */
export interface PreviewPlan {
    kind: FilePreviewKind;
    raster?: RasterKind;
    language?: string;
}
/**
 * Picks the preview from the file name first. The declared content type is
 * consulted only for files without an extension, so `report.unknown`
 * labelled `text/plain` is not treated as text. HTML, SVG and XML are
 * shown as source, never rendered.
 */
export declare function planPreview(name: string, contentType?: string): PreviewPlan;
/** `%PDF-` */
export declare function hasPdfSignature(bytes: Uint8Array): boolean;
/** Magic numbers of the admitted raster formats. */
export declare function hasRasterSignature(kind: RasterKind, bytes: Uint8Array): boolean;
/** The bytes read and whether the body had more. */
export interface BoundedRead {
    bytes: Uint8Array<ArrayBuffer>;
    truncated: boolean;
}
/**
 * Reads at most `maxBytes` of a response body, then cancels the rest. A
 * server that ignores a Range request cannot make the browser buffer the
 * whole file.
 */
export declare function readBounded(response: Response, maxBytes: number): Promise<BoundedRead>;
/** Total size from a `Content-Range: bytes 0-99/5000` header, if present. */
export declare function contentRangeTotal(header: string | null): number | undefined;
/** UTF-8 text from bounded bytes; a character cut at the limit is dropped. */
export declare function decodeText(bytes: Uint8Array, truncated: boolean): string;
/** A bounded delimited table and what was left out. */
export interface DelimitedPreview {
    rows: string[][];
    sourceRowCount: number;
    sourceColumnCount: number;
    truncatedRows: boolean;
    truncatedColumns: boolean;
    truncatedCells: boolean;
}
/**
 * A bounded RFC 4180-style parser for CSV and TSV previews: quoted fields,
 * escaped quotes and quoted line breaks, no evaluation of cell contents.
 * Malformed quoting throws.
 */
export declare function parseDelimited(source: string, delimiter: ',' | '\t', { rows: maxRows, columns: maxColumns, cellCharacters }?: Pick<PreviewLimits, 'rows' | 'columns' | 'cellCharacters'>): DelimitedPreview;
