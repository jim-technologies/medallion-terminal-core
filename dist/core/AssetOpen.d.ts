import { type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
export type AssetOpenIntent = 'view' | 'play' | 'edit' | 'inspect' | (string & {});
export interface AssetReference {
    id?: string;
    namespace?: string;
    path?: string;
    name: string;
    /** Semantic host object kind, independent of filename and MIME type. */
    kind?: string;
    contentType?: string;
    sizeBytes?: number;
    modifiedAt?: string;
    /** Passive presentation hints. Authorization remains a host responsibility. */
    capabilities?: readonly string[];
    /** Unresolved stable target identity when this asset is a symbolic link. */
    symlinkTargetId?: string;
    url?: string;
    metadata?: Readonly<Record<string, unknown>>;
}
export interface AssetOpenRequest {
    asset: AssetReference;
    intent: AssetOpenIntent;
    source?: {
        component?: string;
        widgetId?: string;
    };
}
export interface AssetApplication {
    id: string;
    name: string;
    description?: string;
    renderer: string;
    icon?: string;
    accepts?: readonly string[];
    /** Optional semantic object kinds accepted by this application. */
    acceptsKinds?: readonly string[];
    intents?: readonly AssetOpenIntent[];
    launchContext?: unknown;
}
export interface AssetOpenResolution {
    applications: readonly AssetApplication[];
    preferredApplicationId?: string;
}
export type ResolveAssetIntent = (request: AssetOpenRequest) => AssetOpenResolution | Promise<AssetOpenResolution>;
export interface AssetOpenFallbacks {
    native?: () => void | Promise<void>;
    nativeLabel?: string;
    download?: () => void | Promise<void>;
    downloadLabel?: string;
}
export interface AssetAppRendererProps {
    asset: AssetReference;
    intent: AssetOpenIntent;
    application: AssetApplication;
    launchContext?: unknown;
    close: () => void;
    chooseApplication: () => void;
}
export type AssetAppRenderer = ComponentType<AssetAppRendererProps> | LazyExoticComponent<ComponentType<AssetAppRendererProps>>;
export type AssetRendererRegistry = Readonly<Record<string, AssetAppRenderer>>;
/** Props supplied to the host-controlled frame around a resolved application. */
export interface AssetApplicationFrameProps {
    request: AssetOpenRequest;
    application: AssetApplication;
    Renderer: AssetAppRenderer;
    close: () => void;
    chooseApplication: () => void;
    onError: (error: Error) => void;
}
/**
 * Optional placement adapter. A host can render the application in its own
 * workspace, route, drawer, or portal; the default remains a fullscreen frame.
 */
export type AssetApplicationFrame = ComponentType<AssetApplicationFrameProps>;
export type AssetOpenPreferenceSelection = {
    kind: 'application';
    applicationId: string;
} | {
    kind: 'native';
};
export interface AssetOpenPreferenceChange {
    request: AssetOpenRequest;
    selection: AssetOpenPreferenceSelection;
}
export type SaveAssetOpenPreference = (change: AssetOpenPreferenceChange) => void | Promise<void>;
export type AssetOpenErrorHandler = (error: Error, request: AssetOpenRequest) => void;
export interface AssetOpenContextValue {
    available: boolean;
    openAsset: (request: AssetOpenRequest, fallbacks?: AssetOpenFallbacks) => Promise<void>;
    openWith: (request: AssetOpenRequest, fallbacks?: AssetOpenFallbacks) => Promise<void>;
}
export interface AssetOpenProviderProps {
    children: ReactNode;
    resolveAssetIntent?: ResolveAssetIntent;
    renderers?: AssetRendererRegistry;
    applicationFrame?: AssetApplicationFrame;
    savePreference?: SaveAssetOpenPreference;
    onError?: AssetOpenErrorHandler;
}
export declare function assetMimeMatches(accepts: readonly string[] | undefined, contentType: string | undefined): boolean;
/** Exact, case-insensitive semantic-kind matching with an optional wildcard. */
export declare function assetKindMatches(acceptsKinds: readonly string[] | undefined, kind: string | undefined): boolean;
export declare function assetApplicationSupports(application: AssetApplication, request: AssetOpenRequest): boolean;
export declare function normalizeAssetOpenResolution(value: unknown, request: AssetOpenRequest): AssetOpenResolution;
export type AssetOpenDecision = {
    kind: 'application';
    application: AssetApplication;
} | {
    kind: 'native';
} | {
    kind: 'download';
} | {
    kind: 'choose';
} | {
    kind: 'none';
};
export declare function defaultAssetOpenDecision(resolution: AssetOpenResolution, fallbacks?: AssetOpenFallbacks): AssetOpenDecision;
export declare function useAssetOpen(): AssetOpenContextValue;
export declare function AssetOpenProvider({ children, resolveAssetIntent, renderers, applicationFrame: ApplicationFrame, savePreference, onError, }: AssetOpenProviderProps): import("react").JSX.Element;
