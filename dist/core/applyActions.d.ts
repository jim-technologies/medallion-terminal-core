import type { WidgetConfig } from '../types/template';
import type { DispatchOptions, WidgetAction } from './DashboardContext';
export declare function applyActions(prev: WidgetConfig[], actions: WidgetAction[], options?: DispatchOptions): WidgetConfig[];
