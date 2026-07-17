export type GeoPosition = [number, number, ...number[]];
export type GeoGeometry = {
    type: 'Point';
    coordinates: GeoPosition;
} | {
    type: 'MultiPoint';
    coordinates: GeoPosition[];
} | {
    type: 'LineString';
    coordinates: GeoPosition[];
} | {
    type: 'MultiLineString';
    coordinates: GeoPosition[][];
} | {
    type: 'Polygon';
    coordinates: GeoPosition[][];
} | {
    type: 'MultiPolygon';
    coordinates: GeoPosition[][][];
};
export interface GeoFeatureData {
    type: 'Feature';
    id: string;
    geometry: GeoGeometry;
    properties: Record<string, string | number | boolean | null>;
}
export interface GeoFeatureCollection {
    type: 'FeatureCollection';
    features: GeoFeatureData[];
}
export type GeoBounds = [[number, number], [number, number]];
export declare function normalizeGeoData(data: unknown): GeoFeatureCollection | null;
export declare function geoBounds(collection: GeoFeatureCollection): GeoBounds | null;
export declare function geoFeatureContext(feature: GeoFeatureData): Record<string, string>;
export declare function geoFeatureLabel(feature: GeoFeatureData): string;
