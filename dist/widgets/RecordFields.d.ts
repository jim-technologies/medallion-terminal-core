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
    /** Id of text that describes the control, such as a key hint. */
    describedBy?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    /**
     * Enter commits (Shift+Enter still adds a line to long text); without it,
     * Enter adds a line to long text and does nothing in other fields.
     */
    onCommit?: () => void;
    onCancel?: () => void;
}
/**
 * Where a grid opens a field's editor: one-line controls (text, numbers,
 * dates, a single choice, Yes/No) edit in their cell; a list of choices and
 * long text are taller than a row, so they open over it.
 */
export declare function recordEditorLayout(field: RecordFieldData): 'inline' | 'overlay';
export declare function RecordFieldInput({ field, value, onChange, label, describedBy, disabled, autoFocus, onCommit, onCancel, }: RecordFieldInputProps): import("react").JSX.Element;
export {};
