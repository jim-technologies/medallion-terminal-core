import { type RecordFieldData } from './recordShapes';
interface RecordValueProps {
    field: RecordFieldData;
    value: unknown;
    /**
     * `grid` keeps a list on one line (a fixed-height row): its first two
     * chips, then "+N". `panel` (the default) wraps up to four.
     */
    context?: 'panel' | 'grid';
}
export declare function RecordValue({ field, value, context }: RecordValueProps): import("react").JSX.Element;
export interface RecordFieldInputProps {
    field: RecordFieldData;
    value: unknown;
    onChange: (value: unknown) => void;
    /** Accessible name when no visible label wraps the control (a grid cell). */
    label?: string;
    disabled?: boolean;
    compact?: boolean;
    autoFocus?: boolean;
    onCommit?: () => void;
    onCancel?: () => void;
}
export declare function RecordFieldInput({ field, value, onChange, label, disabled, compact, autoFocus, onCommit, onCancel, }: RecordFieldInputProps): import("react").JSX.Element;
export {};
