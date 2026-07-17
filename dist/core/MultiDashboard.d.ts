import { type DashboardTemplateTrust, type DashboardTheme } from './Dashboard';
import type { TemplateTrustPolicy } from './templateSecurity';
import type { Template } from '../types/template';
interface Tab {
    label: string;
    template: Template;
}
export declare function MultiDashboard({ tabs, activeIndex, onSelect, backendUrl, theme, templateTrust, templateTrustPolicy, }: {
    tabs: Tab[];
    activeIndex: number;
    onSelect: (index: number) => void;
    backendUrl?: string;
    theme?: DashboardTheme;
    templateTrust?: DashboardTemplateTrust;
    templateTrustPolicy?: TemplateTrustPolicy;
}): import("react").JSX.Element | null;
export declare function useTabFromUrl(defaultIndex?: number): [number, (i: number) => void];
export {};
