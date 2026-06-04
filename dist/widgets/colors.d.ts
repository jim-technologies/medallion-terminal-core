export declare const SEMANTIC: Record<string, string>;
export declare const PALETTE: readonly string[];
export declare const TOOLTIP_STYLE: {
    readonly backgroundColor: "#18181b";
    readonly border: "1px solid #3f3f46";
    readonly borderRadius: 6;
    readonly fontSize: 12;
    readonly color: "#fafafa";
};
export declare function resolveColor(name: string | undefined, i: number): string;
