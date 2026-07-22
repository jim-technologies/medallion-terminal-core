import type { Template } from '../types/template';
import { type DashboardEvent } from './DashboardContext';
import { type PaletteSuggest } from './CommandPalette';
import { type TemplateTrustPolicy } from './templateSecurity';
export type DashboardTheme = 'dark' | 'operator' | 'light';
export type DashboardTemplateTrust = 'untrusted' | 'trusted';
export declare function Dashboard({ template, backendUrl, backendHeaders, onEvent, onCtxChange, paletteSuggest, chrome, onShare, theme, templateTrust, templateTrustPolicy, }: {
    template: Template;
    backendUrl?: string;
    backendHeaders?: Record<string, string>;
    chrome?: 'full' | 'minimal';
    onEvent?: (event: DashboardEvent) => void;
    onCtxChange?: (ctx: Record<string, string>) => void;
    paletteSuggest?: PaletteSuggest;
    onShare?: (snapshot: Template) => void | Promise<void>;
    theme?: DashboardTheme;
    templateTrust?: DashboardTemplateTrust;
    templateTrustPolicy?: TemplateTrustPolicy;
}): import("react").JSX.Element;
