export declare function abbreviateAxis(n: unknown): string;
export declare function formatCompact(n: number): string;
export declare function formatStat(n: number): string;
export declare function formatTimestamp(ts: unknown): string;
export declare function formatDateTime(ts: unknown): string;
export declare function formatPercent(n: number, options?: {
    decimals?: number;
    as?: 'fraction' | 'percent';
    signed?: boolean;
}): string;
export declare function formatCurrency(n: number, code?: string, options?: {
    compact?: boolean;
    decimals?: number;
}): string;
export declare function formatBps(n: number, options?: {
    signed?: boolean;
    as?: 'fraction' | 'percent';
}): string;
