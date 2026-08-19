import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from 'react'
import {
  handleModalKeyDown,
  useModalFocus,
} from '../components/utils'
import { ErrorBoundary } from './ErrorBoundary'

// Asset opening is intentionally an intent, not a direct component or URL.
// The trusted host resolves the intent against the authenticated workspace
// and returns only applications installed and permitted there.
export type AssetOpenIntent =
  | 'view'
  | 'play'
  | 'edit'
  | 'inspect'
  | (string & {})

export interface AssetReference {
  // Stable backend identity when one exists. Path-based stores may omit it
  // and use namespace + path as their identity.
  id?: string
  namespace?: string
  path?: string
  name: string
  /** Semantic host object kind, independent of filename and MIME type. */
  kind?: string
  contentType?: string
  sizeBytes?: number
  modifiedAt?: string
  /** Passive presentation hints. Authorization remains a host responsibility. */
  capabilities?: readonly string[]
  /** Unresolved stable target identity when this asset is a symbolic link. */
  symlinkTargetId?: string
  // Authorized presentation URL. This is optional because a renderer may
  // exchange `id` for its own short-lived grant instead.
  url?: string
  metadata?: Readonly<Record<string, unknown>>
}

export interface AssetOpenRequest {
  asset: AssetReference
  intent: AssetOpenIntent
  // Informational origin for policy, audit, and analytics. Authorization must
  // still derive workspace/user identity from the host session.
  source?: {
    component?: string
    widgetId?: string
  }
}

export interface AssetApplication {
  // Treat this as the workspace installation id when installations can have
  // distinct configuration. The resolver owns its meaning.
  id: string
  name: string
  description?: string
  // Lookup key into the dashboard-scoped renderer registry. Resolver data
  // cannot import code; an unknown key is rejected by the provider.
  renderer: string
  icon?: string
  // Optional defense-in-depth declarations. The resolver should already
  // filter, and the frontend checks them again before presenting the app.
  accepts?: readonly string[]
  /** Optional semantic object kinds accepted by this application. */
  acceptsKinds?: readonly string[]
  intents?: readonly AssetOpenIntent[]
  // Ephemeral, non-executable data for the trusted renderer. It may carry a
  // short-lived launch grant, a template, or renderer-specific options.
  launchContext?: unknown
}

export interface AssetOpenResolution {
  applications: readonly AssetApplication[]
  // Missing means "use the native fallback". This lets a workspace install
  // applications without silently changing every user's double-click action.
  preferredApplicationId?: string
}

export type ResolveAssetIntent = (
  request: AssetOpenRequest,
) => AssetOpenResolution | Promise<AssetOpenResolution>

export interface AssetOpenFallbacks {
  native?: () => void | Promise<void>
  nativeLabel?: string
  download?: () => void | Promise<void>
  downloadLabel?: string
}

export interface AssetAppRendererProps {
  asset: AssetReference
  intent: AssetOpenIntent
  application: AssetApplication
  launchContext?: unknown
  close: () => void
  chooseApplication: () => void
}

export type AssetAppRenderer =
  | ComponentType<AssetAppRendererProps>
  | LazyExoticComponent<ComponentType<AssetAppRendererProps>>
export type AssetRendererRegistry = Readonly<Record<string, AssetAppRenderer>>

/** Props supplied to the host-controlled frame around a resolved application. */
export interface AssetApplicationFrameProps {
  request: AssetOpenRequest
  application: AssetApplication
  Renderer: AssetAppRenderer
  close: () => void
  chooseApplication: () => void
  onError: (error: Error) => void
}

/**
 * Optional placement adapter. A host can render the application in its own
 * workspace, route, drawer, or portal; the default remains a fullscreen frame.
 */
export type AssetApplicationFrame = ComponentType<AssetApplicationFrameProps>

export type AssetOpenPreferenceSelection =
  | { kind: 'application'; applicationId: string }
  | { kind: 'native' }

export interface AssetOpenPreferenceChange {
  request: AssetOpenRequest
  selection: AssetOpenPreferenceSelection
}

export type SaveAssetOpenPreference = (
  change: AssetOpenPreferenceChange,
) => void | Promise<void>

export type AssetOpenErrorHandler = (
  error: Error,
  request: AssetOpenRequest,
) => void

export interface AssetOpenContextValue {
  // True when a host resolver is present. Widgets use this to avoid showing
  // an "Open with…" affordance in zero-configuration/native-only setups.
  available: boolean
  openAsset: (
    request: AssetOpenRequest,
    fallbacks?: AssetOpenFallbacks,
  ) => Promise<void>
  openWith: (
    request: AssetOpenRequest,
    fallbacks?: AssetOpenFallbacks,
  ) => Promise<void>
}

export interface AssetOpenProviderProps {
  children: ReactNode
  resolveAssetIntent?: ResolveAssetIntent
  renderers?: AssetRendererRegistry
  applicationFrame?: AssetApplicationFrame
  savePreference?: SaveAssetOpenPreference
  onError?: AssetOpenErrorHandler
}

const EMPTY_RENDERERS: AssetRendererRegistry = Object.freeze({})
const MAX_APPLICATIONS = 32
const MAX_SCANNED_APPLICATIONS = 128

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cleanString(value: unknown, maxLength = 256): string | undefined {
  if (typeof value !== 'string') return undefined
  const clean = value.trim()
  return clean ? clean.slice(0, maxLength) : undefined
}

function cleanStringArray(value: unknown, maxItems = 64): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const entries = [
    ...new Set(
      value
        .map(entry => cleanString(entry, 128))
        .filter((entry): entry is string => !!entry),
    ),
  ].slice(0, maxItems)
  return entries.length > 0 ? entries : undefined
}

function normalizedContentType(contentType: string | undefined): string {
  return (contentType ?? '').split(';', 1)[0].trim().toLowerCase()
}

function normalizedKind(kind: string | undefined): string {
  return (kind ?? '').trim().toLowerCase()
}

// MIME matching supports exact values, type wildcards (`video/*`), and the
// universal wildcard. Missing/empty declarations mean the app accepts any
// type and leave the final decision to the host resolver.
export function assetMimeMatches(
  accepts: readonly string[] | undefined,
  contentType: string | undefined,
): boolean {
  if (!accepts || accepts.length === 0) return true
  const actual = normalizedContentType(contentType)
  if (!actual) return false
  return accepts.some(entry => {
    const candidate = normalizedContentType(entry)
    if (candidate === '*/*' || candidate === '*') return true
    if (candidate.endsWith('/*')) {
      return actual.startsWith(candidate.slice(0, -1))
    }
    return candidate === actual
  })
}

/** Exact, case-insensitive semantic-kind matching with an optional wildcard. */
export function assetKindMatches(
  acceptsKinds: readonly string[] | undefined,
  kind: string | undefined,
): boolean {
  if (!acceptsKinds || acceptsKinds.length === 0) return true
  const actual = normalizedKind(kind)
  if (!actual) return false
  return acceptsKinds.some(entry => {
    const candidate = normalizedKind(entry)
    return candidate === '*' || candidate === actual
  })
}

export function assetApplicationSupports(
  application: AssetApplication,
  request: AssetOpenRequest,
): boolean {
  const supportsIntent = !application.intents
    || application.intents.length === 0
    || application.intents.includes(request.intent)
  return supportsIntent
    && assetMimeMatches(application.accepts, request.asset.contentType)
    && assetKindMatches(application.acceptsKinds, request.asset.kind)
}

// Resolver output commonly crosses a JSON boundary. Normalize it before any
// UI uses it: cap candidate count, reject incomplete records, de-duplicate ids,
// and re-check MIME/intent declarations. `launchContext` remains opaque data.
export function normalizeAssetOpenResolution(
  value: unknown,
  request: AssetOpenRequest,
): AssetOpenResolution {
  const root = isRecord(value) ? value : {}
  const rawApplications = Array.isArray(root.applications) ? root.applications : []
  const applications: AssetApplication[] = []
  const ids = new Set<string>()

  for (const raw of rawApplications.slice(0, MAX_SCANNED_APPLICATIONS)) {
    if (applications.length >= MAX_APPLICATIONS) break
    if (!isRecord(raw)) continue
    const id = cleanString(raw.id, 128)
    const name = cleanString(raw.name, 128)
    const renderer = cleanString(raw.renderer, 128)
    if (!id || !name || !renderer || ids.has(id)) continue

    const application: AssetApplication = {
      id,
      name,
      renderer,
      description: cleanString(raw.description, 512),
      icon: cleanString(raw.icon, 8),
      accepts: cleanStringArray(raw.accepts),
      acceptsKinds: cleanStringArray(raw.acceptsKinds ?? raw.accepts_kinds),
      intents: cleanStringArray(raw.intents) as AssetOpenIntent[] | undefined,
      launchContext: raw.launchContext,
    }
    if (!assetApplicationSupports(application, request)) continue
    ids.add(id)
    applications.push(application)
  }

  const preferred = cleanString(root.preferredApplicationId, 128)
  return {
    applications,
    preferredApplicationId: preferred && ids.has(preferred) ? preferred : undefined,
  }
}

export type AssetOpenDecision =
  | { kind: 'application'; application: AssetApplication }
  | { kind: 'native' }
  | { kind: 'download' }
  | { kind: 'choose' }
  | { kind: 'none' }

// Deterministic default-open policy:
//   1. explicit workspace/user preference;
//   2. native viewer when one exists;
//   3. the only installed app when native is unavailable;
//   4. chooser when several apps are possible;
//   5. download fallback.
export function defaultAssetOpenDecision(
  resolution: AssetOpenResolution,
  fallbacks: AssetOpenFallbacks = {},
): AssetOpenDecision {
  const preferred = resolution.preferredApplicationId
    ? resolution.applications.find(app => app.id === resolution.preferredApplicationId)
    : undefined
  if (preferred) return { kind: 'application', application: preferred }
  if (fallbacks.native) return { kind: 'native' }
  if (resolution.applications.length === 1) {
    return { kind: 'application', application: resolution.applications[0] }
  }
  if (resolution.applications.length > 1) return { kind: 'choose' }
  if (fallbacks.download) return { kind: 'download' }
  return { kind: 'none' }
}

interface AssetOpenSession {
  request: AssetOpenRequest
  resolution: AssetOpenResolution
  fallbacks: AssetOpenFallbacks
}

type AssetOpenState =
  | { kind: 'resolving'; request: AssetOpenRequest }
  | { kind: 'choosing'; session: AssetOpenSession }
  | {
      kind: 'running'
      session: AssetOpenSession
      application: AssetApplication
      renderer: AssetAppRenderer
    }

function rendererFromRegistry(
  renderers: AssetRendererRegistry,
  key: string,
): AssetAppRenderer | undefined {
  return Object.prototype.hasOwnProperty.call(renderers, key)
    ? renderers[key]
    : undefined
}

async function invokeFallback(fallbacks: AssetOpenFallbacks): Promise<void> {
  if (fallbacks.native) {
    await fallbacks.native()
  } else if (fallbacks.download) {
    await fallbacks.download()
  }
}

const DEFAULT_ASSET_OPEN_CONTEXT: AssetOpenContextValue = {
  available: false,
  openAsset: async (_request, fallbacks = {}) => invokeFallback(fallbacks),
  openWith: async (_request, fallbacks = {}) => invokeFallback(fallbacks),
}

const AssetOpenContext = createContext<AssetOpenContextValue>(DEFAULT_ASSET_OPEN_CONTEXT)

export function useAssetOpen(): AssetOpenContextValue {
  return useContext(AssetOpenContext)
}

export function AssetOpenProvider({
  children,
  resolveAssetIntent,
  renderers = EMPTY_RENDERERS,
  applicationFrame: ApplicationFrame = DefaultAssetApplicationFrame,
  savePreference,
  onError,
}: AssetOpenProviderProps) {
  const [state, setState] = useState<AssetOpenState | null>(null)
  const generation = useRef(0)
  const selectionInFlight = useRef(false)

  const reportError = useCallback((reason: unknown, request: AssetOpenRequest) => {
    const error = reason instanceof Error ? reason : new Error(String(reason))
    if (onError) onError(error, request)
    else console.error('[MedallionTerminal] Asset open error:', error)
  }, [onError])

  const close = useCallback(() => {
    generation.current += 1
    selectionInFlight.current = false
    setState(null)
  }, [])

  const registeredResolution = useCallback((
    raw: unknown,
    request: AssetOpenRequest,
  ): AssetOpenResolution => {
    const normalized = normalizeAssetOpenResolution(raw, request)
    const applications = normalized.applications.filter(application => {
      if (rendererFromRegistry(renderers, application.renderer)) return true
      reportError(
        new Error(
          `Asset application "${application.name}" requested unregistered renderer `
          + `"${application.renderer}"`,
        ),
        request,
      )
      return false
    })
    const preferredApplicationId = applications.some(
      application => application.id === normalized.preferredApplicationId,
    )
      ? normalized.preferredApplicationId
      : undefined
    return { applications, preferredApplicationId }
  }, [renderers, reportError])

  const runFallback = useCallback(async (
    kind: 'native' | 'download',
    request: AssetOpenRequest,
    fallbacks: AssetOpenFallbacks,
  ) => {
    setState(null)
    try {
      if (kind === 'native') await fallbacks.native?.()
      else await fallbacks.download?.()
    } catch (error) {
      reportError(error, request)
    }
  }, [reportError])

  const begin = useCallback(async (
    mode: 'default' | 'choose',
    request: AssetOpenRequest,
    fallbacks: AssetOpenFallbacks = {},
  ) => {
    const token = ++generation.current
    selectionInFlight.current = false

    if (!resolveAssetIntent) {
      if (mode === 'choose') {
        setState({
          kind: 'choosing',
          session: {
            request,
            resolution: { applications: [] },
            fallbacks,
          },
        })
      } else {
        try {
          await invokeFallback(fallbacks)
        } catch (error) {
          reportError(error, request)
        }
      }
      return
    }

    setState({ kind: 'resolving', request })
    let resolution: AssetOpenResolution
    try {
      resolution = registeredResolution(
        await resolveAssetIntent(request),
        request,
      )
    } catch (error) {
      if (token !== generation.current) return
      reportError(error, request)
      if (mode === 'choose') {
        setState({
          kind: 'choosing',
          session: { request, resolution: { applications: [] }, fallbacks },
        })
      } else {
        setState(null)
        try {
          await invokeFallback(fallbacks)
        } catch (fallbackError) {
          reportError(fallbackError, request)
        }
      }
      return
    }
    if (token !== generation.current) return

    const session = { request, resolution, fallbacks }
    if (mode === 'choose') {
      setState({ kind: 'choosing', session })
      return
    }

    const decision = defaultAssetOpenDecision(resolution, fallbacks)
    if (decision.kind === 'application') {
      const renderer = rendererFromRegistry(renderers, decision.application.renderer)
      if (!renderer) {
        setState(null)
        reportError(
          new Error(`Renderer "${decision.application.renderer}" is no longer registered`),
          request,
        )
        return
      }
      setState({
        kind: 'running',
        session,
        application: decision.application,
        renderer,
      })
    } else if (decision.kind === 'choose') {
      setState({ kind: 'choosing', session })
    } else if (decision.kind === 'native' || decision.kind === 'download') {
      await runFallback(decision.kind, request, fallbacks)
    } else {
      setState(null)
      reportError(new Error(`No application can ${request.intent} "${request.asset.name}"`), request)
    }
  }, [
    registeredResolution,
    reportError,
    renderers,
    resolveAssetIntent,
    runFallback,
  ])

  const openAsset = useCallback<AssetOpenContextValue['openAsset']>(
    (request, fallbacks) => begin('default', request, fallbacks),
    [begin],
  )
  const openWith = useCallback<AssetOpenContextValue['openWith']>(
    (request, fallbacks) => begin('choose', request, fallbacks),
    [begin],
  )

  const select = useCallback(async (
    session: AssetOpenSession,
    selection:
      | { kind: 'application'; application: AssetApplication }
      | { kind: 'native' }
      | { kind: 'download' },
    remember: boolean,
  ) => {
    if (selectionInFlight.current) return
    selectionInFlight.current = true

    if (remember && savePreference && selection.kind !== 'download') {
      const preferenceSelection: AssetOpenPreferenceSelection = selection.kind === 'native'
        ? { kind: 'native' }
        : { kind: 'application', applicationId: selection.application.id }
      try {
        void Promise.resolve(savePreference({
          request: session.request,
          selection: preferenceSelection,
        })).catch(error => reportError(error, session.request))
      } catch (error) {
        reportError(error, session.request)
      }
    }

    if (selection.kind === 'application') {
      const renderer = rendererFromRegistry(renderers, selection.application.renderer)
      if (!renderer) {
        setState(null)
        reportError(
          new Error(`Renderer "${selection.application.renderer}" is no longer registered`),
          session.request,
        )
        return
      }
      setState({
        kind: 'running',
        session,
        application: selection.application,
        renderer,
      })
    } else {
      await runFallback(selection.kind, session.request, session.fallbacks)
    }
  }, [renderers, reportError, runFallback, savePreference])

  const value = useMemo<AssetOpenContextValue>(() => ({
    available: !!resolveAssetIntent,
    openAsset,
    openWith,
  }), [openAsset, openWith, resolveAssetIntent])

  return (
    <AssetOpenContext.Provider value={value}>
      {children}
      {state?.kind === 'resolving' && (
        <ResolvingAssetOpen
          request={state.request}
          onClose={close}
        />
      )}
      {state?.kind === 'choosing' && (
        <AssetApplicationChooser
          session={state.session}
          canRemember={!!savePreference}
          onSelect={(selection, remember) => {
            void select(state.session, selection, remember)
          }}
          onClose={close}
        />
      )}
      {state?.kind === 'running' && (
        <ErrorBoundary
          key={`${state.application.id}:${state.session.request.asset.id ?? state.session.request.asset.path ?? state.session.request.asset.name}`}
          onError={error => reportError(error, state.session.request)}
        >
          <ApplicationFrame
            request={state.session.request}
            application={state.application}
            Renderer={state.renderer}
            chooseApplication={() => {
              selectionInFlight.current = false
              setState({ kind: 'choosing', session: state.session })
            }}
            close={close}
            onError={error => reportError(error, state.session.request)}
          />
        </ErrorBoundary>
      )}
    </AssetOpenContext.Provider>
  )
}

function ResolvingAssetOpen({
  request,
  onClose,
}: {
  request: AssetOpenRequest
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useModalFocus(true, dialogRef)

  return (
    <div
      className="mtc-overlay fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Finding applications for ${request.asset.name}`}
        tabIndex={-1}
        className="mtc-popover w-full max-w-sm px-5 py-4"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => handleModalKeyDown(event, dialogRef, true, onClose)}
      >
        <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
          Open asset
        </div>
        <div className="mt-1 text-sm font-medium text-zinc-100 truncate">
          {request.asset.name}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span
            className="inline-block size-2 rounded-full border border-sky-400 border-t-transparent animate-spin"
            aria-hidden="true"
          />
          Checking workspace applications…
        </div>
      </div>
    </div>
  )
}

function AssetApplicationChooser({
  session,
  canRemember,
  onSelect,
  onClose,
}: {
  session: AssetOpenSession
  canRemember: boolean
  onSelect: (
    selection:
      | { kind: 'application'; application: AssetApplication }
      | { kind: 'native' }
      | { kind: 'download' },
    remember: boolean,
  ) => void
  onClose: () => void
}) {
  const [remember, setRemember] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useModalFocus(true, dialogRef, closeRef)

  const { request, resolution, fallbacks } = session
  const hasChoices = resolution.applications.length > 0
    || !!fallbacks.native
    || !!fallbacks.download
  const typeLabel = request.asset.contentType || request.asset.kind || 'this file type'

  return (
    <div
      className="mtc-overlay fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Open ${request.asset.name} with`}
        tabIndex={-1}
        className="mtc-popover w-full max-w-lg overflow-hidden motion-safe:animate-[fadeIn_160ms_ease-out]"
        onClick={event => event.stopPropagation()}
        onKeyDown={event => handleModalKeyDown(event, dialogRef, true, onClose)}
      >
        <div className="px-4 py-3 border-b border-zinc-800 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Open with
            </div>
            <h2 className="mt-0.5 text-sm font-medium text-zinc-100 truncate">
              {request.asset.name}
            </h2>
            <div className="mt-0.5 text-[10px] text-zinc-600 font-mono truncate">
              {typeLabel} · {request.intent}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="text-lg leading-none text-zinc-500 hover:text-zinc-100 px-1"
            aria-label="Close application chooser"
          >
            ×
          </button>
        </div>

        <div className="max-h-[26rem] overflow-auto p-2">
          {resolution.applications.length > 0 && (
            <div className="px-2 pt-1 pb-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              Workspace applications
            </div>
          )}
          {resolution.applications.map(application => (
            <ApplicationChoice
              key={application.id}
              icon={application.icon ?? appInitials(application.name)}
              name={application.name}
              description={application.description ?? 'Available in this workspace'}
              preferred={application.id === resolution.preferredApplicationId}
              onClick={() => onSelect({ kind: 'application', application }, remember)}
            />
          ))}

          {(fallbacks.native || fallbacks.download) && (
            <div className="px-2 pt-3 pb-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
              Built in
            </div>
          )}
          {fallbacks.native && (
            <ApplicationChoice
              icon="NP"
              name={fallbacks.nativeLabel ?? 'Native preview'}
              description="Open with the framework’s built-in viewer"
              preferred={!resolution.preferredApplicationId}
              onClick={() => onSelect({ kind: 'native' }, remember)}
            />
          )}
          {fallbacks.download && (
            <ApplicationChoice
              icon="DL"
              name={fallbacks.downloadLabel ?? 'Download'}
              description="Save the original file to this device"
              onClick={() => onSelect({ kind: 'download' }, false)}
            />
          )}

          {!hasChoices && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No permitted application supports {typeLabel}.
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between gap-3">
          {canRemember ? (
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={event => setRemember(event.target.checked)}
                className="accent-sky-500"
              />
              Always use my choice for {typeLabel}
            </label>
          ) : (
            <span className="text-[10px] text-zinc-600">
              Apps are filtered by workspace policy
            </span>
          )}
          <span className="text-[10px] text-zinc-600 shrink-0">esc close</span>
        </div>
      </div>
    </div>
  )
}

function ApplicationChoice({
  icon,
  name,
  description,
  preferred = false,
  onClick,
}: {
  icon: string
  name: string
  description: string
  preferred?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-zinc-800/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
    >
      <span className="size-9 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 flex items-center justify-center text-[10px] font-semibold tracking-wide text-zinc-300">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm text-zinc-100 truncate">{name}</span>
          {preferred && (
            <span className="text-[8px] uppercase tracking-wider text-sky-300 border border-sky-500/30 bg-sky-500/10 rounded px-1 py-0.5">
              Default
            </span>
          )}
        </span>
        <span className="block text-[10px] text-zinc-500 truncate">{description}</span>
      </span>
      <span className="text-zinc-600" aria-hidden="true">›</span>
    </button>
  )
}

function DefaultAssetApplicationFrame({
  request,
  application,
  Renderer,
  chooseApplication,
  close,
}: AssetApplicationFrameProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useModalFocus(true, dialogRef, closeRef)

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[60] flex flex-col bg-zinc-950 text-zinc-100"
      role="dialog"
      aria-modal="true"
      aria-label={`${application.name}: ${request.asset.name}`}
      tabIndex={-1}
      onKeyDown={event => handleModalKeyDown(event, dialogRef, true, close)}
    >
      <div className="h-11 shrink-0 flex items-center gap-3 px-4 border-b border-zinc-800 bg-zinc-900/95">
        <span className="size-6 rounded border border-zinc-700 bg-zinc-950 flex items-center justify-center text-[8px] font-semibold text-zinc-300">
          {application.icon ?? appInitials(application.name)}
        </span>
        <div className="min-w-0 flex-1 flex items-baseline gap-2">
          <span className="text-xs font-medium text-zinc-200 truncate">{application.name}</span>
          <span className="text-[10px] text-zinc-600 truncate">{request.asset.name}</span>
        </div>
        <button
          type="button"
          onClick={chooseApplication}
          className="text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-1"
        >
          Open with…
        </button>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          className="text-lg leading-none text-zinc-500 hover:text-zinc-100 px-1"
          aria-label="Close application"
        >
          ×
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <Suspense fallback={<ApplicationLoading />}>
          <Renderer
            asset={request.asset}
            intent={request.intent}
            application={application}
            launchContext={application.launchContext}
            close={close}
            chooseApplication={chooseApplication}
          />
        </Suspense>
      </div>
    </div>
  )
}

function ApplicationLoading() {
  return (
    <div className="h-full min-h-48 flex items-center justify-center gap-2 text-xs text-zinc-500">
      <span
        className="inline-block size-2 rounded-full border border-sky-400 border-t-transparent animate-spin"
        aria-hidden="true"
      />
      Loading application…
    </div>
  )
}

function appInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'APP'
}
