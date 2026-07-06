import { type DashboardTheme } from '../core/Dashboard';
import type { DashboardEvent } from '../core/DashboardContext';
import type { EmbedConfig } from './embedConfig';
export interface EmbedViewProps {
    config: EmbedConfig;
    onEvent?: (event: DashboardEvent) => void;
    theme?: DashboardTheme;
}
export declare function EmbedView({ config, onEvent, theme }: EmbedViewProps): import("react/jsx-runtime").JSX.Element;
