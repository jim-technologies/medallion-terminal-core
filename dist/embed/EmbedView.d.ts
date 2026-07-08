import { type DashboardTemplateTrust, type DashboardTheme } from '../core/Dashboard';
import type { DashboardEvent } from '../core/DashboardContext';
import type { TemplateTrustPolicy } from '../core/templateSecurity';
import type { EmbedConfig } from './embedConfig';
export interface EmbedViewProps {
    config: EmbedConfig;
    onEvent?: (event: DashboardEvent) => void;
    theme?: DashboardTheme;
    templateTrust?: DashboardTemplateTrust;
    templateTrustPolicy?: TemplateTrustPolicy;
}
export declare function EmbedView({ config, onEvent, theme, templateTrust, templateTrustPolicy, }: EmbedViewProps): import("react/jsx-runtime").JSX.Element;
