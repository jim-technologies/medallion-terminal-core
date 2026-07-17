export type BiShape = 'SHAPE_UNSPECIFIED' | 'SHAPE_TIMESERIES' | 'SHAPE_CANDLES' | 'SHAPE_TABLE' | 'SHAPE_METRIC' | 'SHAPE_GAUGE' | 'SHAPE_HEATMAP' | 'SHAPE_EVENTS' | 'SHAPE_DISTRIBUTION' | 'SHAPE_TEXT' | 'SHAPE_ORDERBOOK' | 'SHAPE_PAIRED_GRID' | 'SHAPE_EMBED' | 'SHAPE_ASSET_CATALOG' | 'SHAPE_OBJECT' | 'SHAPE_GRAPH' | 'SHAPE_REPOSITORY' | 'SHAPE_RECORD_SET';
export type BiProtocol = 'connect' | 'sql';
export type BiColumnType = 'string' | 'number' | 'integer' | 'boolean' | 'timestamp' | 'json';
export interface BiColumn {
    name: string;
    type: BiColumnType;
    label?: string;
    isTime?: boolean;
    description?: string;
}
export interface BiTable {
    id: string;
    name: string;
    description?: string;
    shape?: BiShape;
    streamable?: boolean;
    columns: BiColumn[];
    params?: BiParam[];
    tags?: string[];
}
export interface BiParam {
    key: string;
    required: boolean;
    type: BiColumnType;
    defaultValue?: string;
    enumValues?: string[];
    description?: string;
}
export interface BiConnectorDescriptor {
    version: 1;
    name: string;
    protocol: BiProtocol;
    endpoint: string;
    service?: string;
    getUrl?: string;
    auth?: {
        kind: 'none' | 'bearer' | 'header';
        headerName?: string;
    };
    tables: BiTable[];
}
export interface SourceLike {
    id: string;
    name?: string;
    description?: string;
    shape?: unknown;
    streamable?: boolean;
    tags?: string[];
    params?: {
        key: string;
        description?: string;
        required?: boolean;
        defaultValue?: string;
        default_value?: string;
        enumValues?: string[];
        enum_values?: string[];
        type?: unknown;
    }[];
}
export interface BuildDescriptorOptions {
    name: string;
    endpoint: string;
    protocol?: BiProtocol;
    auth?: BiConnectorDescriptor['auth'];
}
export declare function buildBiDescriptor(sources: SourceLike[], options: BuildDescriptorOptions): BiConnectorDescriptor;
export declare function descriptorToJson(descriptor: BiConnectorDescriptor): string;
export declare function connectionFields(descriptor: BiConnectorDescriptor): {
    label: string;
    value: string;
}[];
