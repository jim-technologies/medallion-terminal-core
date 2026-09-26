import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Button, IconButton } from '../components/Button'
import { CommandPalette, type CommandGroup, type CommandItem } from '../components/CommandPalette'
import { Avatar, Kbd } from '../components/Display'
import { Icon, type IconName } from '../components/Icon'
import { Dialog, Drawer, Menu, type MenuItem } from '../components/Overlays'
import { ToastProvider } from '../components/Toast'
import { DesignSystemProvider, useDesignSystem, useMessage } from '../foundations/DesignSystemProvider'
import type { MessageCatalog } from '../foundations/messages'
import type { Density, PresentationTheme } from '../foundations/types'
import { NavRail, type NavRailItem, type NavRailSection } from '../workbench/NavRail'
import { LoadingState, SignedOutState } from '../workbench/States'
import { createEmbedChannel, type EmbedChannel } from './embed'
import { OperationsTray, type Operation } from './OperationsTray'
import type { Router } from './router'
import { RouterProvider, useLocation } from './routing'
import type { SessionPort } from './session'
import type { TelemetryPort } from './telemetry'
import { useSessionController, type SessionController } from './useSessionController'

/** The product's identity in the top bar. */
export interface ProductIdentity {
  /** "Storage", "Tables", "Git". */
  name: string
  /** Neutral product glyph. */
  icon?: IconName
  /** App path of the product's home. */
  home?: string
}

/** Global search in the top bar, backed by the host's search. */
export interface ProductSearch {
  placeholder?: string
  query: string
  onQueryChange: (query: string) => void
  groups: readonly CommandGroup[]
  onSelect: (item: CommandItem) => void
  loading?: boolean
}

/** Props for the shared product shell. */
export interface ProductShellProps {
  product: ProductIdentity
  /** The routing port (`createHistoryRouter()` in the product SPA). */
  router: Router
  /** The session port; omit for a product without sign-in. */
  session?: SessionPort
  /** Where navigation, request and session summaries go. */
  telemetry?: TelemetryPort
  /** Rail sections; items' `href`s are app paths. */
  nav?: readonly NavRailSection[]
  /** The current rail item; by default the item whose path best matches the location. */
  activeNavId?: string
  /**
   * `standalone` draws the chrome; `embed` draws only the page for a host
   * frame and speaks the embed handshake with `embedOrigins`.
   */
  mode?: 'standalone' | 'embed'
  /** Host origins allowed to frame the product (embed mode). */
  embedOrigins?: readonly string[]
  /** Scope switcher after the product name (workspace, bucket, base). */
  scope?: ReactNode
  /** Global search; the palette opens from the top bar or Ctrl/⌘ K. */
  search?: ProductSearch
  /** Top-bar actions before the account menu. */
  actions?: ReactNode
  /** Account menu items; "Sign out" is added when the session can. */
  accountMenu?: readonly MenuItem[]
  /** Status bar content (freshness, environment, locale). */
  status?: ReactNode
  /** Inspector column for the current selection; hidden when absent. */
  inspector?: ReactNode
  /** Long-running operations for the tray. */
  operations?: readonly Operation[]
  onCancelOperation?: (id: string) => void
  onRetryOperation?: (id: string) => void
  onDismissOperation?: (id: string) => void
  /** Theme; an enclosing scope's (else dark) when unset, the host's when embedded. */
  theme?: PresentationTheme
  density?: Density
  locale?: string
  timeZone?: string
  messages?: Partial<MessageCatalog>
  /** The current page. */
  children: ReactNode
}

/** What pages read from the shell. */
export interface ProductShellContextValue {
  router: Router
  session: SessionController
  telemetry?: TelemetryPort
  embedded: boolean
}

const ShellContext = createContext<ProductShellContextValue | null>(null)

/** The shell's router, session controller and telemetry. */
export function useProductShell(): ProductShellContextValue {
  const value = useContext(ShellContext)
  if (!value) throw new Error('useProductShell must be used inside a ProductShell')
  return value
}

function currentPath(router: Router): string {
  const { pathname, search, hash } = router.location()
  return `${pathname}${search}${hash}`
}

/**
 * The frame every product UI shares (storage, tables, git, consoles): a
 * 44 px top bar (product, scope, search, actions, account), a navigation
 * rail (a drawer on phones), the page, an optional inspector, a 24 px
 * status bar, toasts and the operations tray. Session, routing and
 * telemetry are ports, so the same pages run standalone, framed by the
 * Terminal (`mode="embed"`, chrome-less, with the handshake), in tests and
 * in stories. A lapsed session keeps the page mounted under a "session
 * expired" dialog, so drafts and uploads survive the renewal.
 */
export function ProductShell(props: ProductShellProps) {
  const {
    router,
    session: sessionPort,
    telemetry,
    mode = 'standalone',
    embedOrigins = [],
    theme,
    density,
    locale,
    timeZone,
    messages,
  } = props
  const embedded = mode === 'embed'
  const channel = useMemo<EmbedChannel | null>(
    // The allow-list is configuration, read once when the shell mounts.
    () => (embedded && typeof window !== 'undefined' ? createEmbedChannel({ allowedOrigins: embedOrigins }) : null),
    [embedded],
  )
  // Without its own theme the shell follows an enclosing scope, else dark.
  const enclosing = useDesignSystem()
  const [hostSettings, setHostSettings] = useState<{ theme?: PresentationTheme; locale?: string; timeZone?: string }>({})
  const session = useSessionController(sessionPort)

  // Navigation summaries, and the host kept in step with the product path.
  useEffect(() => router.subscribe(() => {
    const path = currentPath(router)
    telemetry?.record({ type: 'navigation', path, at: Date.now() })
    channel?.post({ type: 'mtc:navigated', version: 1, path })
  }), [router, telemetry, channel])

  useEffect(() => {
    if (session.status === 'loading') return
    telemetry?.record({ type: 'session', status: session.status, at: Date.now() })
    if (session.status === 'expired') channel?.post({ type: 'mtc:session-expired', version: 1 })
  }, [session.status, telemetry, channel])

  useEffect(() => {
    if (!channel) return
    const unsubscribe = channel.subscribe(message => {
      if (message.type === 'mtc:navigate') router.navigate(message.path)
      else setHostSettings({ theme: message.theme, locale: message.locale, timeZone: message.timeZone })
    })
    channel.post({ type: 'mtc:ready', version: 1, product: props.product.name, path: currentPath(router) })
    return unsubscribe
  }, [channel, router, props.product.name])

  const context = useMemo<ProductShellContextValue>(
    () => ({ router, session, telemetry, embedded }),
    [router, session, telemetry, embedded],
  )
  return (
    <DesignSystemProvider
      theme={hostSettings.theme ?? theme ?? enclosing?.theme ?? 'dark'}
      density={density ?? enclosing?.density}
      locale={hostSettings.locale ?? locale}
      timeZone={hostSettings.timeZone ?? timeZone}
      messages={messages}
      className="mtc-product-shell-root"
    >
      <RouterProvider router={router}>
        <ShellContext.Provider value={context}>
          <ToastProvider>
            {embedded
              ? <EmbeddedFrame channel={channel} {...props} session={sessionPort} controller={session} />
              : <StandaloneFrame {...props} session={sessionPort} controller={session} />}
          </ToastProvider>
        </ShellContext.Provider>
      </RouterProvider>
    </DesignSystemProvider>
  )
}

interface FrameProps extends ProductShellProps {
  controller: SessionController
}

function PageContent({ controller, session: port, router, children }: FrameProps) {
  if (controller.status === 'loading') return <LoadingState />
  if (controller.status === 'signed-out') {
    return <SignedOutState onSignIn={port ? () => port.signIn(currentPath(router), controller.session ?? undefined) : undefined} />
  }
  return <>{children}</>
}

// The page stays mounted underneath, so drafts and uploads survive. Continue
// renews in place; when renewal is refused it leaves for sign-in.
function ExpiredDialog({ controller, session: port, router }: FrameProps) {
  const t = useMessage()
  const [working, setWorking] = useState(false)
  if (controller.status !== 'expired') return null
  const resume = async () => {
    setWorking(true)
    const renewed = await controller.renew()
    setWorking(false)
    if (!renewed) port?.signIn(currentPath(router), controller.session ?? undefined)
  }
  return (
    <Dialog
      open
      onOpenChange={() => {}}
      title={t('state.sessionExpired.title')}
      dismissible={false}
      size="small"
      footer={(
        <Button intent="primary" variant="solid" loading={working} onClick={() => void resume()}>
          {t('state.sessionExpired.action')}
        </Button>
      )}
    >
      <p className="mtc-shell-expired-text">{t('state.sessionExpired.description')}</p>
    </Dialog>
  )
}

function Tray(props: FrameProps) {
  return (
    <OperationsTray
      operations={props.operations ?? []}
      onCancel={props.onCancelOperation}
      onRetry={props.onRetryOperation}
      onDismiss={props.onDismissOperation}
    />
  )
}

function StandaloneFrame(props: FrameProps) {
  const {
    product,
    nav,
    activeNavId,
    scope,
    search,
    actions,
    accountMenu,
    status,
    inspector,
    router,
    controller,
    session: port,
  } = props
  const t = useMessage()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const navigate = useCallback((item: NavRailItem) => {
    if (!item.href) return
    router.navigate(item.href)
    setDrawerOpen(false)
  }, [router])
  const sections = useMemo(() => (nav ?? []).map(section => ({
    ...section,
    items: section.items.map(item => ({ ...item, href: item.href ? router.href(item.href) : undefined })),
  })), [nav, router])
  // Without an explicit active item, the rail marks the item whose path is
  // the longest prefix of the current path.
  const activeId = activeNavId ?? (nav ?? [])
    .flatMap(section => section.items)
    .filter(item => item.href && (pathname === item.href || pathname.startsWith(item.href === '/' ? '/' : `${item.href}/`)))
    .sort((left, right) => (right.href?.length ?? 0) - (left.href?.length ?? 0))[0]?.id
  const routeTo = (item: NavRailItem) => {
    const original = nav?.flatMap(section => section.items).find(candidate => candidate.id === item.id)
    if (original) navigate(original)
  }
  const account = controller.session
  const menuItems: MenuItem[] = [
    ...(accountMenu ?? []),
    ...(port?.signOut ? [{ id: 'sign-out', label: t('shell.signOut'), icon: <Icon name="sign-out" />, onSelect: () => void port.signOut?.() }] : []),
  ]
  const rail = (drawer: boolean) => (
    <NavRail
      label={t('shell.navigation')}
      sections={sections}
      activeId={activeId}
      onNavigate={routeTo}
      collapsed={drawer ? false : collapsed}
      onCollapsedChange={drawer ? undefined : setCollapsed}
      className={drawer ? 'mtc-shell-drawer-rail' : 'mtc-shell-rail'}
    />
  )

  return (
    <div className="mtc-shell" data-inspector={inspector ? 'open' : undefined} data-rail={nav ? (collapsed ? 'collapsed' : 'expanded') : 'none'}>
      <a className="mtc-shell-skip" href="#mtc-main" onClick={event => {
        event.preventDefault()
        mainRef.current?.focus()
      }}>
        {t('shell.skip')}
      </a>
      <header className="mtc-shell-topbar">
        {nav && (
          <IconButton
            icon={<Icon name="menu" />}
            aria-label={t('shell.menu')}
            variant="ghost"
            className="mtc-shell-menu"
            onClick={() => setDrawerOpen(true)}
          />
        )}
        <a
          className="mtc-shell-product"
          href={router.href(product.home ?? '/')}
          onClick={event => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
            event.preventDefault()
            router.navigate(product.home ?? '/')
          }}
        >
          <span className="mtc-shell-mark" aria-hidden="true"><Icon name={product.icon ?? 'object'} /></span>
          <span>{product.name}</span>
        </a>
        {scope && <div className="mtc-shell-scope">{scope}</div>}
        {search && (
          <button type="button" className="mtc-shell-search" onClick={() => setPaletteOpen(true)}>
            <Icon name="search" />
            <span className="mtc-shell-search-text">{search.placeholder ?? t('shell.search')}</span>
            <Kbd aria-hidden="true">Ctrl K</Kbd>
          </button>
        )}
        <div className="mtc-shell-actions">
          {actions}
          {account?.authenticated && (
            <Menu
              label={t('shell.account')}
              align="end"
              trigger={<Avatar name={account.displayName ?? account.subject ?? '?'} decorative />}
              items={menuItems.length > 0 ? menuItems : [{ id: 'who', label: account.displayName ?? account.subject ?? '', disabled: true }]}
            />
          )}
        </div>
      </header>
      {nav && <div className="mtc-shell-rail-slot">{rail(false)}</div>}
      <main id="mtc-main" ref={mainRef} tabIndex={-1} className="mtc-shell-main">
        <PageContent {...props} />
      </main>
      {inspector && <aside className="mtc-shell-inspector">{inspector}</aside>}
      <footer className="mtc-shell-status">{status}</footer>
      {nav && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title={product.name} side="left" width={288} className="mtc-shell-drawer">
          {rail(true)}
        </Drawer>
      )}
      {search && (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          query={search.query}
          onQueryChange={search.onQueryChange}
          groups={search.groups}
          onSelect={search.onSelect}
          loading={search.loading}
          placeholder={search.placeholder}
        />
      )}
      <Tray {...props} />
      <ExpiredDialog {...props} />
    </div>
  )
}

function EmbeddedFrame(props: FrameProps & { channel: EmbedChannel | null }) {
  const { channel } = props
  const rootRef = useRef<HTMLDivElement>(null)
  // Report the content height so the host can size the frame.
  useEffect(() => {
    const element = rootRef.current
    if (!element || !channel || typeof ResizeObserver === 'undefined') return
    let last = -1
    const observer = new ResizeObserver(() => {
      const height = Math.ceil(element.scrollHeight)
      if (height === last) return
      last = height
      channel.post({ type: 'mtc:resize', version: 1, height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [channel])
  return (
    <div ref={rootRef} className="mtc-shell-embedded">
      <main id="mtc-main" className="mtc-shell-main">
        <PageContent {...props} />
      </main>
      <Tray {...props} />
      <ExpiredDialog {...props} />
    </div>
  )
}
