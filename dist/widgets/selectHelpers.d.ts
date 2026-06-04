export interface Choice {
    value: string;
    label?: string;
}
export declare function resolveSelection(ctxVal: string | undefined, defaultVal: string | undefined, choices: Choice[]): {
    current: string;
    shouldSync: boolean;
};
