import type { Template } from '../types/template';
import { type DashboardEvent } from './DashboardContext';
import { type PaletteSuggest } from './CommandPalette';
import { type TemplateTrustPolicy } from './templateSecurity';
export type DashboardTheme = 'dark' | 'light';
export type DashboardTemplateTrust = 'untrusted' | 'trusted';
export declare function Dashboard({ template, backendUrl, onEvent, onCtxChange, paletteSuggest, chrome, onShare, theme, templateTrust, templateTrustPolicy, }: {
    template: Template;
    backendUrl?: string;
    chrome?: 'full' | 'minimal';
    onEvent?: (event: DashboardEvent) => void;
    onCtxChange?: (ctx: Record<string, string>) => void;
    paletteSuggest?: PaletteSuggest;
    onShare?: (snapshot: Template) => void;
    theme?: DashboardTheme;
    templateTrust?: DashboardTemplateTrust;
    templateTrustPolicy?: TemplateTrustPolicy;
}): import("react/jsx-runtime").JSX.Element;
