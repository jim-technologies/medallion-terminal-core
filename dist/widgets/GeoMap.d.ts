import { type BasemapConfig } from '../maps/basemaps';
import type { WidgetProps } from '../types/template';
export interface GeoMapOptions {
    basemap?: BasemapConfig;
    style_url?: string;
    fit?: boolean;
    fit_on_update?: boolean;
    padding?: number;
    max_zoom?: number;
    center?: [number, number];
    zoom?: number;
    interactive?: boolean;
    feature_context?: {
        key?: string;
        label_key?: string;
    };
}
export declare function GeoMap({ data, options }: WidgetProps): import("react").JSX.Element;
