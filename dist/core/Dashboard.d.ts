import type { Template } from '../types/template';
import { type DashboardEvent } from './DashboardContext';
import { type PaletteSuggest } from './CommandPalette';
import { type TemplateTrustPolicy } from './templateSecurity';
import { type AssetApplicationFrame, type AssetOpenErrorHandler, type AssetRendererRegistry, type ResolveAssetIntent, type SaveAssetOpenPreference } from './AssetOpen';
import type { PresentationTheme } from '../foundations/types';
import type { WidgetRegistry } from './WidgetRegistry';
import type { TerminalIntentHandler } from './TerminalIntent';
export type DashboardTheme = PresentationTheme;
export type DashboardTemplateTrust = 'untrusted' | 'trusted';
/** Public configuration for the dashboard renderer and its host bridges. */
export interface DashboardProps {
    /** Template rendered by this Dashboard instance. */
    template: Template;
    /** Connect/HTTP host used for source IDs, actions, and relative URLs. */
    backendUrl?: string;
    /**
     * Authentication headers supplied by trusted host code. Change the object
     * identity when credentials rotate so active transports refetch.
     */
    backendHeaders?: Record<string, string>;
    /**
     * `full` renders toolbar and status chrome; `minimal` leaves the title and
     * widget grid for embedding.
     */
    chrome?: 'full' | 'minimal';
    /** Receives alerts, widget errors, and action lifecycle events. */
    onEvent?: (event: DashboardEvent) => void;
    /**
     * Receives generic object and command intents. Terminal Core never
     * authorizes or executes the requested host operation.
     */
    onIntent?: TerminalIntentHandler;
    /** Receives the complete active context whenever it changes. */
    onCtxChange?: (ctx: Record<string, string>) => void;
    /** Supplies asynchronous command-palette context suggestions. */
    paletteSuggest?: PaletteSuggest;
    /**
     * Receives an in-memory static snapshot from Share. Without a handler, the
     * Dashboard downloads the snapshot JSON.
     */
    onShare?: (snapshot: Template) => void | Promise<void>;
    /** Scoped visual theme; defaults to `dark`. */
    theme?: DashboardTheme;
    /**
     * Template trust boundary. `untrusted` applies the SDK policy before any
     * widgets mount; `trusted` is for host-authored templates.
     */
    templateTrust?: DashboardTemplateTrust;
    /** Host policy applied to untrusted templates. */
    templateTrustPolicy?: TemplateTrustPolicy;
    /**
     * Host-scoped asset application resolver. Templates cannot provide or
     * replace this trusted callback.
     */
    resolveAssetIntent?: ResolveAssetIntent;
    /** Trusted asset renderers available only to this Dashboard instance. */
    assetRenderers?: AssetRendererRegistry;
    /** Optional host placement for resolved applications (route, pane, or modal). */
    assetApplicationFrame?: AssetApplicationFrame;
    /** Host persistence seam for asset-open preference changes. */
    saveAssetOpenPreference?: SaveAssetOpenPreference;
    /** Observability hook for asset resolver, renderer, and fallback failures. */
    onAssetOpenError?: AssetOpenErrorHandler;
    /**
     * Instance-local widget registry. Factory-created registries include
     * built-ins unless explicitly configured otherwise.
     */
    registry?: WidgetRegistry;
}
export declare function Dashboard({ template, backendUrl, backendHeaders, onEvent, onIntent, onCtxChange, paletteSuggest, chrome, onShare, theme, templateTrust, templateTrustPolicy, resolveAssetIntent, assetRenderers, assetApplicationFrame, saveAssetOpenPreference, onAssetOpenError, registry, }: DashboardProps): import("react").JSX.Element;
