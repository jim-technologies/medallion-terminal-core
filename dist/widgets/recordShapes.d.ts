export type RecordFieldType = 'text' | 'long_text' | 'number' | 'currency' | 'percent' | 'boolean' | 'date' | 'datetime' | 'single_select' | 'multi_select' | 'user' | 'link' | 'attachment' | 'url' | 'email' | 'phone' | 'formula' | 'lookup' | 'rollup' | 'created_at' | 'updated_at';
export type RecordViewType = 'grid' | 'board' | 'calendar' | 'gallery' | 'list' | 'timeline' | 'form';
export interface RecordChoiceData {
    value: string;
    label: string;
    color?: string;
}
export interface RecordFieldData {
    key: string;
    label: string;
    type: RecordFieldType;
    description?: string;
    required: boolean;
    readOnly: boolean;
    choices: RecordChoiceData[];
    linkedTableId?: string;
    allowMultiple: boolean;
    format?: string;
    defaultValue?: unknown;
}
export interface WorkRecordData {
    id: string;
    values: Record<string, unknown>;
    createdAt?: string;
    updatedAt?: string;
    revision?: string;
    context: Record<string, string>;
}
export interface RecordSortData {
    field: string;
    descending: boolean;
}
export interface RecordFilterData {
    field: string;
    operator: string;
    value: unknown;
}
export interface RecordViewData {
    id: string;
    name: string;
    type: RecordViewType;
    visibleFields: string[];
    groupBy?: string;
    dateField?: string;
    titleField?: string;
    sorts: RecordSortData[];
    filters: RecordFilterData[];
}
export interface RecordCapabilitiesData {
    create: boolean;
    update: boolean;
    delete: boolean;
    createActionId: string;
    updateActionId: string;
    deleteActionId: string;
}
export interface RecordSetData {
    workspaceId: string;
    tableId: string;
    tableName: string;
    primaryField: string;
    fields: RecordFieldData[];
    records: WorkRecordData[];
    views: RecordViewData[];
    activeViewId?: string;
    total?: number;
    nextPageToken?: string;
    capabilities: RecordCapabilitiesData;
}
export declare function normalizeRecordSet(data: unknown): RecordSetData | null;
export declare function isRecordFieldEditable(field: RecordFieldData): boolean;
export declare function initialRecordValues(fields: RecordFieldData[], record?: WorkRecordData): Record<string, unknown>;
export declare function changedRecordValues(fields: RecordFieldData[], values: Record<string, unknown>, record?: WorkRecordData): Record<string, unknown>;
export declare function recordTitle(set: RecordSetData, record: WorkRecordData, titleField?: string): string;
export declare function recordValueLabel(value: unknown): string;
export declare function recordDateKey(value: unknown): string | null;
export declare function recordChoiceColor(field: RecordFieldData | undefined, value: unknown): string | undefined;
export declare function recordMatchesFilter(record: WorkRecordData, filter: RecordFilterData): boolean;
export declare function applyRecordView(records: WorkRecordData[], view?: RecordViewData): WorkRecordData[];
export declare function findRecordView(set: RecordSetData, type: RecordViewType, preferredId?: string): RecordViewData | undefined;
