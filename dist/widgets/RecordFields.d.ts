import { type RecordFieldData } from './recordShapes';
interface RecordValueProps {
    field: RecordFieldData;
    value: unknown;
}
export declare function RecordValue({ field, value }: RecordValueProps): import("react").JSX.Element;
export interface RecordFieldInputProps {
    field: RecordFieldData;
    value: unknown;
    onChange: (value: unknown) => void;
    disabled?: boolean;
    compact?: boolean;
    autoFocus?: boolean;
    onCommit?: () => void;
    onCancel?: () => void;
}
export declare function RecordFieldInput({ field, value, onChange, disabled, compact, autoFocus, onCommit, onCancel, }: RecordFieldInputProps): import("react").JSX.Element;
export {};
