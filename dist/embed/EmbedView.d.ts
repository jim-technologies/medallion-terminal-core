import type { DashboardEvent } from '../core/DashboardContext';
import type { EmbedConfig } from './embedConfig';
export interface EmbedViewProps {
    config: EmbedConfig;
    onEvent?: (event: DashboardEvent) => void;
}
export declare function EmbedView({ config, onEvent }: EmbedViewProps): import("react/jsx-runtime").JSX.Element;
