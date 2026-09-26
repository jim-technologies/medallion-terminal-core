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
/**
 * The Dashboard's Ctrl/⌘ K palette on the toolkit `CommandPalette`: typing
 * a command and pressing Enter applies it (`symbol:BTC range:1d`,
 * `/save name`, `/load name`, `/delete name`); arrow keys pick a backend
 * suggestion, a saved view or a recent command instead.
 */
export declare function DashboardCommandPalette({ suggest }?: {
    suggest?: PaletteSuggest;
}): import("react").JSX.Element;
export declare const _parseCommand: typeof parseCommand;
export {};
