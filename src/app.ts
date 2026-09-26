/**
 * Product application entry point.
 *
 * Transport shared by product UIs built on the toolkit (storage, table, git,
 * consoles): a `fetch` wrapper that adds request ids and trace context,
 * composes timeouts, reports expired sessions, and types failures as
 * `SourceError`. No React and no runtime dependencies.
 */
export { createProductFetch, ensureOk, newTraceparent } from './app/productFetch'
export type { ProductFetchOptions, ProductRequestEvent } from './app/productFetch'
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
