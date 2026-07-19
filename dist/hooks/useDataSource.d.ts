import type { DataSource } from '../types/template';
export declare function unwrapDataResponse(raw: unknown): unknown;
export interface DataSourceState {
    data: unknown;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
    connected: boolean;
    nextRetryAt: number | null;
    refresh: () => void;
}
export declare function useDataSource(source?: DataSource): DataSourceState;
