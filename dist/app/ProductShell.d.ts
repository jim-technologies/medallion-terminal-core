import { type ReactNode } from 'react';
import { type CommandGroup, type CommandItem } from '../components/CommandPalette';
import { type IconName } from '../components/Icon';
import { type MenuItem } from '../components/Overlays';
import type { MessageCatalog } from '../foundations/messages';
import type { Density, PresentationTheme } from '../foundations/types';
import { type NavRailSection } from '../workbench/NavRail';
import { type Operation } from './OperationsTray';
import type { Router } from './router';
import type { SessionPort } from './session';
import type { TelemetryPort } from './telemetry';
import { type SessionController } from './useSessionController';
/** The product's identity in the top bar. */
export interface ProductIdentity {
    /** "Storage", "Tables", "Git". */
    name: string;
    /** Neutral product glyph. */
    icon?: IconName;
    /** App path of the product's home. */
    home?: string;
}
/** Global search in the top bar, backed by the host's search. */
export interface ProductSearch {
    placeholder?: string;
    query: string;
    onQueryChange: (query: string) => void;
    groups: readonly CommandGroup[];
    onSelect: (item: CommandItem) => void;
    loading?: boolean;
}
/** Props for the shared product shell. */
export interface ProductShellProps {
    product: ProductIdentity;
    /** The routing port (`createHistoryRouter()` in the product SPA). */
    router: Router;
    /** The session port; omit for a product without sign-in. */
    session?: SessionPort;
    /** Where navigation, request and session summaries go. */
    telemetry?: TelemetryPort;
    /** Rail sections; items' `href`s are app paths. */
    nav?: readonly NavRailSection[];
    /** The current rail item; by default the item whose path best matches the location. */
    activeNavId?: string;
    /**
     * `standalone` draws the chrome; `embed` draws only the page for a host
     * frame and speaks the embed handshake with `embedOrigins`.
     */
    mode?: 'standalone' | 'embed';
    /** Host origins allowed to frame the product (embed mode). */
    embedOrigins?: readonly string[];
    /** Scope switcher after the product name (workspace, bucket, base). */
    scope?: ReactNode;
    /** Global search; the palette opens from the top bar or Ctrl/⌘ K. */
    search?: ProductSearch;
    /** Top-bar actions before the account menu. */
    actions?: ReactNode;
    /** Account menu items; "Sign out" is added when the session can. */
    accountMenu?: readonly MenuItem[];
    /** Status bar content (freshness, environment, locale). */
    status?: ReactNode;
    /** Inspector column for the current selection; hidden when absent. */
    inspector?: ReactNode;
    /** Long-running operations for the tray. */
    operations?: readonly Operation[];
    onCancelOperation?: (id: string) => void;
    onRetryOperation?: (id: string) => void;
    onDismissOperation?: (id: string) => void;
    /** Theme; an enclosing scope's (else dark) when unset, the host's when embedded. */
    theme?: PresentationTheme;
    density?: Density;
    locale?: string;
    timeZone?: string;
    messages?: Partial<MessageCatalog>;
    /** The current page. */
    children: ReactNode;
}
/** What pages read from the shell. */
export interface ProductShellContextValue {
    router: Router;
    session: SessionController;
    telemetry?: TelemetryPort;
    embedded: boolean;
}
/** The shell's router, session controller and telemetry. */
export declare function useProductShell(): ProductShellContextValue;
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
export declare function ProductShell(props: ProductShellProps): import("react").JSX.Element;
