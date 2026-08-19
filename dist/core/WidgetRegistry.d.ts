import { type ComponentType, type LazyExoticComponent } from 'react';
import type { WidgetProps } from '../types/template';
/** A synchronous or lazily loaded dashboard widget implementation. */
export type WidgetComponent = ComponentType<WidgetProps> | LazyExoticComponent<ComponentType<WidgetProps>>;
export declare const BUILTIN_KEYS: ReadonlySet<string>;
/** Options for an isolated registry instance. */
export interface CreateWidgetRegistryOptions {
    /** Seed the registry with every built-in widget. Defaults to true. */
    includeBuiltIns?: boolean;
}
/** Instance-local widget registry used by one or more explicit Dashboards. */
export interface WidgetRegistry {
    /** Registers or replaces a widget and returns this registry for chaining. */
    register(name: string, component: WidgetComponent): WidgetRegistry;
    /** Removes a widget from this registry only. */
    unregister(name: string): boolean;
    /** Returns the registered implementation without a placeholder fallback. */
    get(name: string): WidgetComponent | undefined;
    /** Reports whether this registry contains the widget name. */
    has(name: string): boolean;
    /** Returns an immutable snapshot of the currently registered names. */
    keys(): ReadonlySet<string>;
}
/**
 * Creates a widget registry with no shared mutable state. Built-ins are copied
 * into each instance by default; legacy global registrations are never copied.
 */
export declare function createWidgetRegistry(options?: CreateWidgetRegistryOptions): WidgetRegistry;
export declare function getWidget(name: string, scopedRegistry?: WidgetRegistry): WidgetComponent;
/** Registers a widget in the legacy process-global registry. */
export declare function registerWidget(name: string, component: WidgetComponent): void;
