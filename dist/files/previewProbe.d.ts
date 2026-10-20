/** Read a small Range prefix, cancelling its body even when Range is ignored. */
export declare function probePreview(url: string, maxBytes: number, transport: typeof globalThis.fetch, signal?: AbortSignal): Promise<{
    response: Response;
    bytes: Uint8Array<ArrayBuffer>;
}>;
