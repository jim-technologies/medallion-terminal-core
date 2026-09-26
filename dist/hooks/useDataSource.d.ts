import type { DataSource } from '../types/template';
import { SourceError } from '../core/sourceError';
export declare function unwrapDataResponse(raw: unknown): unknown;
export interface DataSourceState {
    data: unknown;
    loading: boolean;
    /**
     * One-line failure summary (`permission_denied: payroll:read scope
     * required`, `HTTP 503`). Kept for compatibility; read `sourceError`.
     * @deprecated since 0.6.0: use `sourceError`; removed in 0.7.0.
     */
    error: string | null;
    /**
     * The typed failure: kind, HTTP status, Connect code, the server's reason,
     * request id and `Retry-After`. `null` while healthy.
     */
    sourceError: SourceError | null;
    lastUpdated: number | null;
    connected: boolean;
    nextRetryAt: number | null;
    refresh: () => void;
}
/** Options for `useDataSource`. */
export interface UseDataSourceOptions {
    /**
     * Transport for this source's fetches (not SSE). Dashboards pass their
     * host transport for backend sources only. Keep its identity stable.
     */
    fetch?: typeof globalThis.fetch;
}
export declare function useDataSource(source?: DataSource, options?: UseDataSourceOptions): DataSourceState;
