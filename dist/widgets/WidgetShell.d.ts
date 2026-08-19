import { type WidgetRegistry } from '../core/WidgetRegistry';
import type { WidgetConfig } from '../types/template';
export interface WidgetShellProps {
    config: WidgetConfig;
    contentHeight: number;
    snapshotKey?: string;
    registry?: WidgetRegistry;
}
export declare function WidgetShell({ config, contentHeight, snapshotKey, registry }: WidgetShellProps): import("react").JSX.Element;
