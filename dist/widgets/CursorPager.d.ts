export interface CursorPaginationOptions {
    /** Context key mirrored into source.params.page_token by the template. */
    page_token_key?: string;
    previous_label?: string;
    next_label?: string;
}
interface CursorPagerProps {
    nextPageToken?: string;
    widgetId?: string;
    options?: CursorPaginationOptions;
    ariaLabel?: string;
}
export declare function cursorPageTokenKey(widgetId?: string, options?: CursorPaginationOptions): string;
export declare function CursorPager({ nextPageToken, widgetId, options, ariaLabel, }: CursorPagerProps): import("react").JSX.Element | null;
export {};
