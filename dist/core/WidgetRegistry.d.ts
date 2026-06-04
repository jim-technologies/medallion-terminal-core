import { type ComponentType, type LazyExoticComponent } from 'react';
import type { WidgetProps } from '../types/template';
type AnyWidget = ComponentType<WidgetProps> | LazyExoticComponent<ComponentType<WidgetProps>>;
export declare const BUILTIN_KEYS: ReadonlySet<string>;
export declare function getWidget(name: string): AnyWidget;
export declare function registerWidget(name: string, component: AnyWidget): void;
export {};
