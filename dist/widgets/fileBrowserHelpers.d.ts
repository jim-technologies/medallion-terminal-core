export declare function errorMessage(err: unknown): string;
/** Generic object entry accepted by the FileBrowser widget. */
export interface FileBrowserEntry {
    /** Preferred stable host object ID. */
    id?: string;
    /** Legacy stable-ID alias. New integrations should prefer `id`. */
    object_id?: string;
    /** Semantic object kind. Authoritative when it names a known media kind. */
    kind?: string;
    /** Human-readable entry name. */
    name?: string;
    /** Content size in bytes. */
    size_bytes?: number;
    /** Declared MIME content type. Preferred over filename extensions. */
    content_type?: string;
    /** Last-modified timestamp supplied by the host. */
    modified_at?: string;
    /** Explicit container status, preferred over `kind` inference. */
    is_container?: boolean;
    /** Passive host capabilities for presentation and intent decisions. */
    capabilities?: string[];
    /** Passive link target metadata. Terminal Core never resolves the link. */
    symlink_target_id?: string;
    /** Additional host metadata forwarded to asset-open resolution. */
    metadata?: Record<string, unknown>;
    /**
     * Full path within the namespace. When omitted, FileBrowser derives a path
     * from the current directory and `name`.
     */
    path?: string;
}
export declare function isFolder(e: FileBrowserEntry): boolean;
/**
 * Stable presentation identity. Object IDs win, then an authoritative entry
 * path, then the path derived from the current directory and name.
 */
export declare function fileEntryIdentity(e: FileBrowserEntry, parentPath?: string): string;
export declare function normalizeEntries(data: unknown): FileBrowserEntry[];
export declare function sortEntries(entries: FileBrowserEntry[]): FileBrowserEntry[];
export declare function splitPath(p: string): string[];
export declare function joinPath(dir: string, name: string): string;
export declare function humanSize(n: number): string;
export declare function playableQueue(entries: FileBrowserEntry[]): FileBrowserEntry[];
export declare function navigableQueue(entries: FileBrowserEntry[]): FileBrowserEntry[];
export declare function nextInQueue(queue: FileBrowserEntry[], currentName: string | undefined, shuffle: boolean, repeat: boolean, rand?: () => number): FileBrowserEntry | null;
export declare function prevInQueue(queue: FileBrowserEntry[], currentName: string | undefined, repeat: boolean): FileBrowserEntry | null;
export type PreviewKind = 'video' | 'audio' | 'image' | 'pdf' | 'heic' | 'mkv' | 'text' | 'json' | 'yaml' | 'markdown' | 'csv' | null;
export declare function previewKind(contentType?: string, filename?: string, semanticKind?: string): PreviewKind;
/** Whether FileBrowser can render this kind without an installed application. */
export declare function isNativePreviewKind(kind: PreviewKind): kind is Exclude<PreviewKind, 'heic' | 'mkv' | null>;
export declare function buildMediaUrl(template: string, bucket: string, path: string): string;
export declare function resolveEndpointUrl(backendUrl: string | undefined, endpoint: string): string;
export declare function backendHeadersForEndpoint(backendUrl: string | undefined, endpoint: string, headers: Record<string, string>): Record<string, string>;
export declare function arrayBufferToBase64(buf: ArrayBuffer): string;
export declare function readConnectErrorMessage(res: Response): Promise<string>;
export declare function parseConnectStream(res: Response, mime?: string): Promise<Blob>;
