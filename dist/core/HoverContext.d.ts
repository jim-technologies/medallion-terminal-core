import { type ReactNode } from 'react';
export interface HoverContextValue {
    hoverTime: string | null;
    setHoverTime: (t: string | null) => void;
}
export declare const HoverContext: import("react").Context<HoverContextValue>;
export declare function useHover(): HoverContextValue;
export declare function HoverProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
