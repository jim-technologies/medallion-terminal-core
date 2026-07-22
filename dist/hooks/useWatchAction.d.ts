export interface ActionUpdate {
    id: string;
    action_id: string;
    client_request_id: string;
    status: string;
    status_detail?: string;
    message?: string;
    data?: Record<string, unknown>;
    timestamp: string;
    sequence: number;
}
export declare const TERMINAL_ACTION_STATUSES: Set<string>;
export declare const NON_TERMINAL_ACTION_STATUSES: Set<string>;
export declare function isTerminalStatus(s: string | undefined): boolean;
export declare function isErrorStatus(s: string | undefined): boolean;
export declare function isNonTerminalStatus(s: string | undefined): boolean;
interface UseWatchActionState {
    updates: ActionUpdate[];
    latest: ActionUpdate | null;
    done: boolean;
    error: string | null;
}
interface WatchTarget {
    clientRequestId?: string;
    id?: string;
    actionId?: string;
}
export declare function useWatchAction(backendUrl: string | undefined, target: WatchTarget | null, backendHeaders?: Record<string, string>): UseWatchActionState;
export {};
