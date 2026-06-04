import type { Template, WidgetConfig } from '../types/template';
export declare function widgetSnapshotKey(widget: WidgetConfig, index: number): string;
export declare function isStaticTemplate(template: Template): boolean;
export declare function buildSnapshot(template: Template, widgets: WidgetConfig[], ctx: Record<string, string>, getData: (widget: WidgetConfig, index: number) => unknown, frozenAt?: string): Template;
