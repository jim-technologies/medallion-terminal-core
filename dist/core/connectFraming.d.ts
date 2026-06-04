export declare const CONNECT_JSON_CONTENT_TYPE = "application/connect+json";
export interface ConnectTrailer {
    metadata?: Record<string, unknown>;
    error?: {
        code?: string;
        message?: string;
    };
}
interface ParseHandlers {
    onMessage: (parsed: unknown) => void;
    onTrailer?: (trailer: ConnectTrailer) => void;
    isDisposed: () => boolean;
}
export declare function parseConnectEnvelopes(reader: ReadableStreamDefaultReader<Uint8Array>, handlers: ParseHandlers): Promise<void>;
export {};
