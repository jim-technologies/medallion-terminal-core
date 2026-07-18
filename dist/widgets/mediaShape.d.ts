export type MediaKind = 'image' | 'video';
export type MediaGroupMode = 'day' | 'month' | 'none';
export interface MediaItemData {
    id: string;
    title: string;
    kind: MediaKind;
    url: string;
    thumbnailUrl?: string;
    description?: string;
    capturedAt?: string;
    createdAt?: string;
    contentType?: string;
    width?: number;
    height?: number;
    durationSeconds?: number;
    favorite: boolean;
    tags: string[];
    collectionIds: string[];
    metadata: Record<string, unknown>;
    context: Record<string, string>;
}
export interface MediaCollectionData {
    id: string;
    name: string;
    coverUrl?: string;
    itemCount?: number;
    context: Record<string, string>;
}
export interface MediaLibraryData {
    items: MediaItemData[];
    collections: MediaCollectionData[];
    total?: number;
    nextPageToken?: string;
}
export interface MediaFilter {
    query?: string;
    kind?: 'all' | MediaKind | 'favorite';
    collectionId?: string;
}
export interface MediaGroup {
    key: string;
    label: string;
    items: MediaItemData[];
}
export declare function safeMediaUrl(value: unknown): string | undefined;
export declare function normalizeMediaLibrary(data: unknown): MediaLibraryData;
export declare function sortMediaItems(items: readonly MediaItemData[]): MediaItemData[];
export declare function filterMediaItems(items: readonly MediaItemData[], filter: MediaFilter): MediaItemData[];
export declare function groupMediaItems(items: readonly MediaItemData[], mode?: MediaGroupMode): MediaGroup[];
export declare function formatMediaDuration(seconds: number | undefined): string | undefined;
export declare function formatMediaDate(value: string | undefined): string | undefined;
