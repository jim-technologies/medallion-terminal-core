import { type DashboardProps, type DashboardTemplateTrust, type DashboardTheme } from './Dashboard';
import type { TemplateTrustPolicy } from './templateSecurity';
import type { Template } from '../types/template';
interface Tab {
    label: string;
    template: Template;
}
export declare function MultiDashboard({ tabs, activeIndex, onSelect, backendUrl, backendHeaders, theme, templateTrust, templateTrustPolicy, resolveAssetIntent, assetRenderers, assetApplicationFrame, saveAssetOpenPreference, onAssetOpenError, onIntent, registry, }: {
    tabs: Tab[];
    activeIndex: number;
    onSelect: (index: number) => void;
    backendUrl?: string;
    backendHeaders?: Record<string, string>;
    theme?: DashboardTheme;
    templateTrust?: DashboardTemplateTrust;
    templateTrustPolicy?: TemplateTrustPolicy;
    resolveAssetIntent?: DashboardProps['resolveAssetIntent'];
    assetRenderers?: DashboardProps['assetRenderers'];
    assetApplicationFrame?: DashboardProps['assetApplicationFrame'];
    saveAssetOpenPreference?: DashboardProps['saveAssetOpenPreference'];
    onAssetOpenError?: DashboardProps['onAssetOpenError'];
    onIntent?: DashboardProps['onIntent'];
    registry?: DashboardProps['registry'];
}): import("react").JSX.Element | null;
export declare function useTabFromUrl(defaultIndex?: number): [number, (i: number) => void];
export {};
