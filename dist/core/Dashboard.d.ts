import type { Template } from '../types/template';
import { type DashboardEvent } from './DashboardContext';
import { type PaletteSuggest } from './CommandPalette';
export declare function Dashboard({ template, backendUrl, onEvent, onCtxChange, paletteSuggest, chrome, onShare, }: {
    template: Template;
    backendUrl?: string;
    chrome?: 'full' | 'minimal';
    onEvent?: (event: DashboardEvent) => void;
    onCtxChange?: (ctx: Record<string, string>) => void;
    paletteSuggest?: PaletteSuggest;
    onShare?: (snapshot: Template) => void;
}): import("react/jsx-runtime").JSX.Element;
