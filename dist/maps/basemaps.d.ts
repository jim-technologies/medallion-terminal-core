import type { StyleSpecification } from 'maplibre-gl';
export interface BasemapPresetDefinition {
    id: string;
    label: string;
    provider: string;
    description: string;
    style_url: string | null;
    network: boolean;
    documentation_url?: string;
    self_hostable: boolean;
}
export declare const BASEMAP_PRESETS: {
    readonly analytical: {
        readonly id: 'analytical';
        readonly label: 'Analytical grid';
        readonly provider: 'Built-in';
        readonly description: 'Network-free coordinate grid for private operational overlays.';
        readonly style_url: null;
        readonly network: false;
        readonly self_hostable: true;
    };
    readonly 'openfreemap-dark': {
        readonly id: 'openfreemap-dark';
        readonly label: 'OpenFreeMap Dark';
        readonly provider: 'OpenFreeMap';
        readonly description: 'Dark general-purpose OpenStreetMap basemap.';
        readonly style_url: 'https://tiles.openfreemap.org/styles/dark';
        readonly network: true;
        readonly documentation_url: 'https://openfreemap.org/quick_start/';
        readonly self_hostable: true;
    };
    readonly 'openfreemap-liberty': {
        readonly id: 'openfreemap-liberty';
        readonly label: 'OpenFreeMap Liberty';
        readonly provider: 'OpenFreeMap';
        readonly description: 'Balanced general-purpose OpenStreetMap basemap.';
        readonly style_url: 'https://tiles.openfreemap.org/styles/liberty';
        readonly network: true;
        readonly documentation_url: 'https://openfreemap.org/quick_start/';
        readonly self_hostable: true;
    };
    readonly 'openfreemap-positron': {
        readonly id: 'openfreemap-positron';
        readonly label: 'OpenFreeMap Positron';
        readonly provider: 'OpenFreeMap';
        readonly description: 'Low-contrast light basemap for data-heavy overlays.';
        readonly style_url: 'https://tiles.openfreemap.org/styles/positron';
        readonly network: true;
        readonly documentation_url: 'https://openfreemap.org/quick_start/';
        readonly self_hostable: true;
    };
    readonly 'versatiles-eclipse': {
        readonly id: 'versatiles-eclipse';
        readonly label: 'VersaTiles Eclipse';
        readonly provider: 'VersaTiles';
        readonly description: 'Dark OpenStreetMap basemap from the VersaTiles public stack.';
        readonly style_url: 'https://tiles.versatiles.org/assets/styles/eclipse/style.json';
        readonly network: true;
        readonly documentation_url: 'https://docs.versatiles.org/guides/use_tiles_versatiles_org';
        readonly self_hostable: true;
    };
    readonly 'versatiles-graybeard': {
        readonly id: 'versatiles-graybeard';
        readonly label: 'VersaTiles Graybeard';
        readonly provider: 'VersaTiles';
        readonly description: 'Neutral grayscale OpenStreetMap basemap for dense overlays.';
        readonly style_url: 'https://tiles.versatiles.org/assets/styles/graybeard/style.json';
        readonly network: true;
        readonly documentation_url: 'https://docs.versatiles.org/guides/use_tiles_versatiles_org';
        readonly self_hostable: true;
    };
};
export type BasemapPresetId = keyof typeof BASEMAP_PRESETS;
export declare const BASEMAP_PRESET_IDS: readonly ("analytical" | "openfreemap-dark" | "openfreemap-liberty" | "openfreemap-positron" | "versatiles-eclipse" | "versatiles-graybeard")[];
export interface PresetBasemapConfig {
    kind: 'preset';
    preset: BasemapPresetId;
}
export interface StyleBasemapConfig {
    kind: 'style';
    url: string;
}
export interface RasterBasemapConfig {
    kind: 'raster';
    tiles: string | string[];
    attribution?: string;
    tile_size?: 256 | 512;
    min_zoom?: number;
    max_zoom?: number;
    scheme?: 'xyz' | 'tms';
}
export type BasemapConfig = BasemapPresetId | PresetBasemapConfig | StyleBasemapConfig | RasterBasemapConfig;
interface NormalizedBasemapBase {
    id: string;
    provider: string;
    network: boolean;
    cache_key: string;
    preset?: BasemapPresetId;
}
export interface NormalizedAnalyticalBasemap extends NormalizedBasemapBase {
    kind: 'analytical';
    network: false;
}
export interface NormalizedStyleBasemap extends NormalizedBasemapBase {
    kind: 'style';
    network: true;
    style_url: string;
}
export interface NormalizedRasterBasemap extends NormalizedBasemapBase {
    kind: 'raster';
    network: true;
    tiles: string[];
    attribution?: string;
    tile_size: 256 | 512;
    min_zoom: number;
    max_zoom: number;
    scheme: 'xyz' | 'tms';
}
export type NormalizedBasemap = NormalizedAnalyticalBasemap | NormalizedStyleBasemap | NormalizedRasterBasemap;
export type MapLibreBasemapStyle = string | StyleSpecification;
export declare function isBasemapPresetId(value: string): value is BasemapPresetId;
export declare function normalizeBasemap(config?: unknown, legacyStyleUrl?: unknown): NormalizedBasemap;
export declare function basemapNetworkUrls(basemap: NormalizedBasemap): string[];
export declare function basemapStyle(basemap: NormalizedBasemap, backgroundColor?: string): MapLibreBasemapStyle;
export {};
