export declare function fetchText(url: string): Promise<string>;
export declare function prettyJSON(raw: string): string;
export declare function parseCSV(raw: string): string[][];
export declare function renderMarkdown(raw: string): Promise<string>;
export declare function decodeHeic(blob: Blob): Promise<Blob>;
export declare function remuxMkvToMp4(url: string, onProgress?: (msg: string) => void): Promise<Blob>;
