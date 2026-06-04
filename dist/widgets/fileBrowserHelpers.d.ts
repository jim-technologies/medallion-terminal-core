export declare function errorMessage(err: unknown): string;
export interface FileBrowserEntry {
    kind?: string;
    name?: string;
    size_bytes?: number;
    content_type?: string;
    modified_at?: string;
    path?: string;
}
export declare function isFolder(e: FileBrowserEntry): boolean;
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
export declare function previewKind(contentType?: string, filename?: string): PreviewKind;
export declare function buildMediaUrl(template: string, bucket: string, path: string): string;
export declare function arrayBufferToBase64(buf: ArrayBuffer): string;
export declare function readConnectErrorMessage(res: Response): Promise<string>;
export declare function parseConnectStream(res: Response, mime?: string): Promise<Blob>;
