export type ActionFieldType = 'text' | 'long_text' | 'number' | 'currency' | 'percent' | 'boolean' | 'select' | 'multi_select' | 'date' | 'datetime' | 'email' | 'url' | 'password';
export interface ActionChoice {
    value: string;
    label: string;
}
export interface ActionField {
    key: string;
    label: string;
    type: ActionFieldType;
    description?: string;
    placeholder?: string;
    required: boolean;
    readOnly: boolean;
    choices: ActionChoice[];
    defaultValue?: unknown;
    contextKey?: string;
    min?: number;
    max?: number;
    step?: number;
}
export interface ActionFormData {
    actionId: string;
    submitLabel: string;
    successMessage?: string;
    description?: string;
    confirm: boolean;
    tone: 'primary' | 'danger' | 'neutral';
    columns: 1 | 2;
    fields: ActionField[];
    params: Record<string, unknown>;
    values: Record<string, unknown>;
}
export declare function normalizeActionForm(data: unknown, options?: Record<string, unknown>): ActionFormData | null;
export declare function initialActionValues(form: ActionFormData, ctx: Record<string, string>): Record<string, unknown>;
export declare function validateActionValues(fields: ActionField[], values: Record<string, unknown>): Record<string, string>;
export declare function actionParams(form: ActionFormData, values: Record<string, unknown>): Record<string, unknown>;
