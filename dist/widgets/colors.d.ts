export declare const SEMANTIC: Record<string, string>;
export declare const PALETTE: readonly string[];
export declare const TOOLTIP_STYLE: {
    readonly backgroundColor: 'var(--mtc-surface-raised)';
    readonly border: '1px solid var(--mtc-border-strong)';
    readonly borderRadius: 4;
    readonly boxShadow: 'var(--mtc-shadow-raised)';
    readonly fontSize: 12;
    readonly color: 'var(--mtc-fg)';
};
export declare function resolveColor(name: string | undefined, i: number): string;
export declare function assignSeriesColors(names: readonly string[], fallback?: readonly string[]): string[];
