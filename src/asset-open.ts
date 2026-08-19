/**
 * Workspace-scoped asset-application bridge.
 *
 * This entry is separate from Dashboard so a host file browser can use the
 * same trusted resolver and renderer contract without loading chart widgets.
 */
export {
  AssetOpenProvider,
  useAssetOpen,
  assetMimeMatches,
  assetKindMatches,
  assetApplicationSupports,
  normalizeAssetOpenResolution,
  defaultAssetOpenDecision,
} from './core/AssetOpen'
export type {
  AssetOpenIntent,
  AssetReference,
  AssetOpenRequest,
  AssetApplication,
  AssetOpenResolution,
  ResolveAssetIntent,
  AssetOpenFallbacks,
  AssetAppRendererProps,
  AssetAppRenderer,
  AssetRendererRegistry,
  AssetApplicationFrameProps,
  AssetApplicationFrame,
  AssetOpenPreferenceSelection,
  AssetOpenPreferenceChange,
  SaveAssetOpenPreference,
  AssetOpenErrorHandler,
  AssetOpenContextValue,
  AssetOpenProviderProps,
  AssetOpenDecision,
} from './core/AssetOpen'
