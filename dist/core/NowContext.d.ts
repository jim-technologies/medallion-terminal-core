import { type ReactNode } from 'react';
interface NowContextValue {
    now: number;
    subscribe: () => () => void;
}
export declare const NowContext: import("react").Context<NowContextValue>;
export declare function useNow(enabled?: boolean): number;
export declare function NowProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
