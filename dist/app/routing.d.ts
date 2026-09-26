import { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { type Router, type RouterLocation, type RouteMatch, type RouteTable } from './router';
/** Provides a `Router` to the product's pages. `ProductShell` does this. */
export declare function RouterProvider({ router, children }: {
    router: Router;
    children: ReactNode;
}): import("react").JSX.Element;
/** The nearest router. */
export declare function useRouter(): Router;
/** The current location; re-renders on every change. */
export declare function useLocation(): RouterLocation;
/** The first route of `routes` matching the current path, with typed params. */
export declare function useRoute<T extends RouteTable>(routes: T): RouteMatch<T> | null;
/** Props for an in-app link. */
export interface RouterLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    /** App path. */
    to: string;
    /** Replace the current history entry instead of pushing one. */
    replace?: boolean;
}
/**
 * An anchor for an app path: a plain click navigates through the router,
 * while new-tab, copy-link and modified clicks keep working.
 */
export declare const RouterLink: import("react").ForwardRefExoticComponent<RouterLinkProps & import("react").RefAttributes<HTMLAnchorElement>>;
