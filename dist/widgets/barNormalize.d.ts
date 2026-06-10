export interface SingleBar {
    label: string;
    value: number;
    color?: string;
}
export type BarData = {
    kind: 'single';
    bars: SingleBar[];
} | {
    kind: 'grouped';
    rows: Record<string, unknown>[];
    series: string[];
} | null;
export declare function normalizeBars(data: unknown): BarData;
