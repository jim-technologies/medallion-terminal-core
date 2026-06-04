export interface EmbedConfig {
    templateUrl?: string;
    widget?: {
        component: string;
        sourceId?: string;
        url?: string;
        stream: boolean;
        refreshIntervalMs?: number;
    };
    title?: string;
    backendUrl?: string;
    ctx: Record<string, string>;
    chrome: 'none' | 'full';
}
export declare function parseEmbedConfig(search: string): EmbedConfig;
export declare function buildEmbedUrl(base: string, config: Partial<EmbedConfig>): string;
