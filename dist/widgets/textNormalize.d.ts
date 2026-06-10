export interface TextItem {
    id?: string;
    title?: string;
    meta?: string;
    body?: string;
    tags?: string[];
    image?: string;
    url?: string;
}
export declare function safeUrl(value: unknown): string | undefined;
export declare function normalize(data: unknown): TextItem[];
