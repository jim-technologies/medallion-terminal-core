export interface SubmitActionReply {
    id: string;
    actionId: string;
    clientRequestId: string;
    status: string;
    message?: string;
    data?: Record<string, unknown>;
    terminal: boolean;
}
export interface SubmitActionInput {
    actionId: string;
    params: Record<string, unknown>;
    successMessage?: string;
    refresh?: boolean;
    refreshTarget?: string;
    announce?: boolean;
    onComplete?: (reply: SubmitActionReply) => void;
}
export declare function useSubmitAction(widgetId?: string): {
    submit: (input: SubmitActionInput) => Promise<SubmitActionReply | null>;
    submitting: boolean;
    activeActionId: string | null;
    result: SubmitActionReply | null;
};
