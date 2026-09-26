/**
 * The embed handshake between a product frame and its host (the Terminal).
 * Messages are versioned, only exchanged with allow-listed origins, and
 * never posted to `*`.
 */
import type { PresentationTheme } from '../foundations/types';
/** Host to product. */
export type EmbedHostMessage = {
    type: 'mtc:init';
    version: 1;
    theme?: PresentationTheme;
    locale?: string;
    timeZone?: string;
} | {
    type: 'mtc:navigate';
    version: 1;
    path: string;
};
/** Product to host. */
export type EmbedChildMessage = {
    type: 'mtc:ready';
    version: 1;
    product: string;
    path: string;
} | {
    type: 'mtc:resize';
    version: 1;
    height: number;
} | {
    type: 'mtc:navigated';
    version: 1;
    path: string;
} | {
    type: 'mtc:session-expired';
    version: 1;
};
/** Validates a host message; anything else is ignored. */
export declare function parseEmbedHostMessage(data: unknown): EmbedHostMessage | null;
/** Options for `createEmbedChannel`. */
export interface EmbedChannelOptions {
    /** Host origins allowed to frame the product and talk to it. */
    allowedOrigins: readonly string[];
    /** Injectable for tests. */
    window?: Window;
}
/** A channel to the framing host. */
export interface EmbedChannel {
    /** The host's origin, or null when the product is not framed by an allowed host. */
    readonly hostOrigin: string | null;
    post(message: EmbedChildMessage): void;
    subscribe(listener: (message: EmbedHostMessage) => void): () => void;
}
/**
 * Opens the channel to the parent frame. The host origin comes from the
 * document referrer and must be allow-listed; messages from any other
 * origin or window are ignored, and nothing is posted without a host.
 */
export declare function createEmbedChannel({ allowedOrigins, window: win }: EmbedChannelOptions): EmbedChannel;
