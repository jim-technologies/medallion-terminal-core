import type { Template } from '../types/template';
interface Tab {
    label: string;
    template: Template;
}
export declare function MultiDashboard({ tabs, activeIndex, onSelect, backendUrl, }: {
    tabs: Tab[];
    activeIndex: number;
    onSelect: (index: number) => void;
    backendUrl?: string;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function useTabFromUrl(defaultIndex?: number): [number, (i: number) => void];
export {};
