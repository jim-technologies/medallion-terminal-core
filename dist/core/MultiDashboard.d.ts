import { type DashboardTheme } from './Dashboard';
import type { Template } from '../types/template';
interface Tab {
    label: string;
    template: Template;
}
export declare function MultiDashboard({ tabs, activeIndex, onSelect, backendUrl, theme, }: {
    tabs: Tab[];
    activeIndex: number;
    onSelect: (index: number) => void;
    backendUrl?: string;
    theme?: DashboardTheme;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function useTabFromUrl(defaultIndex?: number): [number, (i: number) => void];
export {};
