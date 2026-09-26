/**
 * The telemetry port: a host forwards short summaries of what the product
 * did (navigations, requests, session changes) to its own logger or a
 * beacon on the product's server. No third-party collector, no bodies, no
 * query strings.
 */
import type { ProductRequestEvent } from './productFetch';
/** One summary. */
export type TelemetryEvent = {
    type: 'navigation';
    path: string;
    at: number;
} | {
    type: 'request';
    method: string;
    /** Path only: the query string is dropped. */
    path: string;
    status?: number;
    /** Connect code or error kind of a failure. */
    code?: string;
    requestId: string;
    durationMs: number;
} | {
    type: 'session';
    status: 'authenticated' | 'signed-out' | 'expired' | 'renewed';
    at: number;
};
/** Where summaries go. */
export interface TelemetryPort {
    record(event: TelemetryEvent): void;
}
/**
 * An `onRequest` handler for `createProductFetch` that records every settled
 * request as a `request` summary.
 */
export declare function requestTelemetry(port: TelemetryPort): (event: ProductRequestEvent) => void;
