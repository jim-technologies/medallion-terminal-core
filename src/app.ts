/**
 * Product application entry point.
 *
 * What every product UI built on the toolkit shares (storage, tables, git,
 * consoles): the `ProductShell` frame with its session, routing, telemetry
 * and embed ports, the typed history router, the operations tray, the
 * product transport (`createProductFetch`: request ids, trace context, a
 * header timeout, a 401 hook, typed `SourceError`s) and `useResource`, the
 * cached, deduplicated, abortable read the pages build on. React is a peer
 * dependency; there are no runtime dependencies.
 */
export { createProductFetch, ensureOk, newTraceparent } from './app/productFetch'
export type {
  ProductFetch,
  ProductFetchOptions,
  ProductRequestEvent,
  ProductRequestInit,
} from './app/productFetch'
export {
  buildPath,
  createHistoryRouter,
  createMemoryRouter,
  matchPath,
  matchRoutes,
} from './app/router'
export type {
  HistoryRouterOptions,
  RouteMatch,
  RouteParams,
  RouteTable,
  Router,
  RouterLocation,
} from './app/router'
export { RouterLink, RouterProvider, useLocation, useRoute, useRouter } from './app/routing'
export type { RouterLinkProps } from './app/routing'
export {
  SESSION_RENEWED,
  SESSION_RENEW_FAILED,
  createHttpSessionPort,
  parseSessionBody,
  renewViaFrame,
} from './app/session'
export type {
  FrameRenewalOptions,
  HttpSessionPortOptions,
  SessionInfo,
  SessionPort,
} from './app/session'
export { RENEW_LEAD_MS, useSessionController } from './app/useSessionController'
export type { SessionController, SessionEnvironment, SessionStatus, VisibilitySource } from './app/useSessionController'
export { createResourceCache } from './app/resourceCache'
export type {
  ResourceCache,
  ResourceCacheOptions,
  ResourceLoader,
  ResourceSnapshot,
} from './app/resourceCache'
export { ResourceCacheProvider, resourceKey, useResource, useResourceCache } from './app/useResource'
export type { ResourceKey, ResourceState, UseResourceOptions } from './app/useResource'
export { requestTelemetry } from './app/telemetry'
export type { TelemetryEvent, TelemetryPort } from './app/telemetry'
export { createEmbedChannel, parseEmbedHostMessage } from './app/embed'
export type {
  EmbedChannel,
  EmbedChannelOptions,
  EmbedChildMessage,
  EmbedHostMessage,
} from './app/embed'
export { OperationsTray } from './app/OperationsTray'
export type { Operation, OperationStatus, OperationsTrayProps } from './app/OperationsTray'
export { ProductShell, useProductShell } from './app/ProductShell'
export type {
  ProductIdentity,
  ProductSearch,
  ProductShellContextValue,
  ProductShellProps,
} from './app/ProductShell'
export {
  SourceError,
  describeSourceError,
  isSourceError,
  parseRetryAfter,
  responseRequestId,
  sourceErrorFromResponse,
  sourceErrorKindForCode,
  sourceErrorKindForStatus,
  toSourceError,
} from './core/sourceError'
export type { SourceErrorInit, SourceErrorKind } from './core/sourceError'
