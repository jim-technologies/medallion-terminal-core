export interface AssetCatalogItem {
    id: string;
    name: string;
    kind: string;
    description?: string;
    owner?: string;
    status?: string;
    updatedAt?: string;
    tags: string[];
    url?: string;
    metadata: Record<string, unknown>;
    context: Record<string, string>;
}
export interface AssetCatalogData {
    items: AssetCatalogItem[];
    total?: number;
    nextPageToken?: string;
}
export interface ObjectProperty {
    key: string;
    label: string;
    value: unknown;
    format?: string;
    description?: string;
    group?: string;
}
export interface ObjectLink {
    relation: string;
    targetType: string;
    targetId: string;
    label: string;
    status?: string;
    context: Record<string, string>;
}
export interface ObjectAction {
    id: string;
    label: string;
    description?: string;
    style?: string;
    confirm: boolean;
    params: Record<string, unknown>;
    disabled: boolean;
}
export interface ObjectData {
    objectType: string;
    objectId: string;
    title: string;
    description?: string;
    status?: string;
    updatedAt?: string;
    tags: string[];
    properties: ObjectProperty[];
    links: ObjectLink[];
    actions: ObjectAction[];
}
export interface GraphNodeData {
    id: string;
    label: string;
    kind?: string;
    status?: string;
    subtitle?: string;
    tags: string[];
    metadata: Record<string, unknown>;
    context: Record<string, string>;
}
export interface GraphEdgeData {
    from: string;
    to: string;
    label?: string;
    kind?: string;
    status?: string;
}
export interface GraphData {
    nodes: GraphNodeData[];
    edges: GraphEdgeData[];
}
export type RepositoryEntryKind = 'file' | 'directory' | 'symlink';
export interface RepositoryEntryData {
    path: string;
    name: string;
    kind: RepositoryEntryKind;
    language?: string;
    sizeBytes?: number;
    updatedAt?: string;
}
export interface RepositoryFileData {
    path: string;
    content: string;
    language?: string;
    sizeBytes?: number;
    truncated: boolean;
    url?: string;
}
export interface RepositoryData {
    repository: string;
    ref: string;
    path: string;
    refs: string[];
    entries: RepositoryEntryData[];
    file?: RepositoryFileData;
    url?: string;
}
export declare function normalizeAssetCatalog(data: unknown): AssetCatalogData;
export declare function normalizeObject(data: unknown): ObjectData | null;
export declare function normalizeGraph(data: unknown): GraphData | null;
export declare function normalizeRepository(data: unknown): RepositoryData | null;
