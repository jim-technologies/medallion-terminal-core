import type { SessionPort } from '../app/session';
import type { FilePreviewFile } from './FilePreview';
interface MediaPreviewProps {
    file: FilePreviewFile;
    kind: 'video' | 'audio';
    fetch?: typeof globalThis.fetch;
    session?: SessionPort;
    onDownload?: () => void;
}
/** Native playback with a bounded status probe and host-owned session renewal. */
export declare function MediaPreview({ file, kind, fetch: transport, session, onDownload }: MediaPreviewProps): import("react").JSX.Element;
export {};
