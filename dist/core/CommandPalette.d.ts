export interface PaletteSuggestion {
    label: string;
    hint?: string;
    ctx: Record<string, string>;
}
export type PaletteSuggest = (query: string) => Promise<PaletteSuggestion[]> | PaletteSuggestion[];
type Cmd = {
    kind: 'set';
    key: string;
    value: string;
} | {
    kind: 'set_many';
    pairs: Array<[string, string]>;
} | {
    kind: 'save';
    name: string;
} | {
    kind: 'load';
    name: string;
} | {
    kind: 'delete';
    name: string;
} | {
    kind: 'noop';
};
declare function parseCommand(input: string, dominantKey: string): Cmd | null;
export declare function CommandPalette({ suggest }?: {
    suggest?: PaletteSuggest;
}): import("react").JSX.Element | null;
export declare const _parseCommand: typeof parseCommand;
export {};
