import type { Template } from '../types/template';
import { type DashboardEvent } from './DashboardContext';
import { type PaletteSuggest } from './CommandPalette';
export type DashboardTheme = 'dark' | 'light';
export declare function Dashboard({ template, backendUrl, onEvent, onCtxChange, paletteSuggest, chrome, onShare, theme, }: {
    template: Template;
    backendUrl?: string;
    chrome?: 'full' | 'minimal';
    onEvent?: (event: DashboardEvent) => void;
    onCtxChange?: (ctx: Record<string, string>) => void;
    paletteSuggest?: PaletteSuggest;
    onShare?: (snapshot: Template) => void;
    theme?: DashboardTheme;
}): import("react/jsx-runtime").JSX.Element;
