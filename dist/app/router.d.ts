/**
 * The Router port and a minimal typed history router. Product UIs read and
 * change the location only through a `Router`, so the same pages run on the
 * browser history (`createHistoryRouter`), in tests and stories
 * (`createMemoryRouter`), or under a host framework's router (an adapter
 * that implements the four methods).
 */
/** Where the product is. */
export interface RouterLocation {
    pathname: string;
    search: string;
    hash: string;
}
/** The routing port. */
export interface Router {
    /** The current location. */
    location(): RouterLocation;
    /** Goes to an app path such as `/b/finance/f/q3.csv?view=grid`. */
    navigate(to: string, options?: {
        replace?: boolean;
    }): void;
    /** Goes back one entry. */
    back(): void;
    /** Called after every location change; returns an unsubscribe function. */
    subscribe(listener: () => void): () => void;
    /** The `href` for an app path (with the router's base). */
    href(to: string): string;
}
/** Options for `createHistoryRouter`. */
export interface HistoryRouterOptions {
    /** Path prefix the app is served under, such as `/embed`. */
    base?: string;
    /** The window whose history is used; injectable for tests. */
    window?: Window;
}
/**
 * A router on the browser History API: `pushState` and `replaceState` for
 * navigation, `popstate` for back and forward. Paths are app paths; the
 * base is added to and removed from the URL.
 */
export declare function createHistoryRouter({ base, window: win }?: HistoryRouterOptions): Router;
/** A router over an in-memory history, for tests, stories and frames. */
export declare function createMemoryRouter(initial?: string): Router;
type Segments<P extends string> = P extends `${infer Head}/${infer Tail}` ? Head | Segments<Tail> : P;
type ParamName<S extends string> = S extends `:${infer Name}` ? Name : S extends `*${infer Name}` ? (Name extends '' ? 'splat' : Name) : never;
/**
 * The parameters of a route pattern: `/b/:bucket/f/*path` has `bucket` and
 * `path`. A bare `*` is named `splat`.
 */
export type RouteParams<P extends string> = {
    [K in ParamName<Segments<P>>]: string;
};
/**
 * Matches a pattern against a pathname. `:name` matches one segment, `*name`
 * the rest (possibly empty). Parameters are URL-decoded. Returns null when
 * the path does not match, including a parameter with a malformed percent
 * escape (a bad deep link is "not found", never a thrown error).
 */
export declare function matchPath<P extends string>(pattern: P, pathname: string): RouteParams<P> | null;
/** Builds a path from a pattern and its parameters, URL-encoding each segment. */
export declare function buildPath<P extends string>(pattern: P, params: RouteParams<P>): string;
/** A route table: id to pattern. */
export type RouteTable = Readonly<Record<string, string>>;
/** The first route of a table that matches, with its parameters. */
export type RouteMatch<T extends RouteTable> = {
    [K in keyof T & string]: {
        id: K;
        params: RouteParams<T[K]>;
    };
}[keyof T & string];
/** Finds the first matching route, in table order. */
export declare function matchRoutes<T extends RouteTable>(routes: T, pathname: string): RouteMatch<T> | null;
export {};
