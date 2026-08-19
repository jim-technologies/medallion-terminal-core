import { type InputHTMLAttributes, type ReactElement, type ReactNode, type TextareaHTMLAttributes } from 'react';
import type { ComponentSize, Density } from '../foundations/types';
/** Props for a tokenized text input. */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Visual control size. */
    size?: ComponentSize;
    /** Optional density override for this control. */
    density?: Density;
    /** Marks the control invalid without replacing a supplied ARIA value. */
    invalid?: boolean;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
/** Props for a tokenized multiline input. */
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Visual control size. */
    size?: ComponentSize;
    /** Optional density override for this control. */
    density?: Density;
    /** Marks the control invalid without replacing a supplied ARIA value. */
    invalid?: boolean;
}
export declare const TextArea: import("react").ForwardRefExoticComponent<TextAreaProps & import("react").RefAttributes<HTMLTextAreaElement>>;
/** Props for labels, help text, and validation around one form control. */
export interface FormFieldProps {
    /** Visible field label. */
    label: ReactNode;
    /** One form control that accepts `id` and ARIA description props. */
    children: ReactElement;
    /** Stable control ID when the child does not already provide one. */
    id?: string;
    /** Non-error help text announced with the control. */
    description?: ReactNode;
    /** Validation message announced with the control. */
    error?: ReactNode;
    /** Marks the child as required and displays a required indicator. */
    required?: boolean;
    /** Additional class for the field wrapper. */
    className?: string;
}
/**
 * Connects a label and descriptive/error text to one child control. Explicit
 * child IDs and ARIA attributes are preserved.
 */
export declare function FormField({ label, children, id, description, error, required, className, }: FormFieldProps): import("react").JSX.Element;
interface ChoiceBaseProps {
    /** Visible label that also supplies the control's accessible name. */
    label: ReactNode;
    /** Optional supporting copy rendered with the label. */
    description?: ReactNode;
    /** Optional density override for this control. */
    density?: Density;
}
/** Props for a labeled native checkbox. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ChoiceBaseProps {
}
export declare const Checkbox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<HTMLInputElement>>;
/** Props for a labeled native radio button. */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ChoiceBaseProps {
}
export declare const Radio: import("react").ForwardRefExoticComponent<RadioProps & import("react").RefAttributes<HTMLInputElement>>;
/** Props for a controlled boolean switch. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'size'>, ChoiceBaseProps {
    /** Current checked state. */
    checked: boolean;
    /** Called with the next checked state after user interaction. */
    onCheckedChange: (checked: boolean) => void;
}
export declare const Switch: import("react").ForwardRefExoticComponent<SwitchProps & import("react").RefAttributes<HTMLInputElement>>;
/** One selectable value in a Combobox. */
export interface ComboboxOption {
    /** Stable submitted value. Values must be unique within the option set. */
    value: string;
    /** Human-readable option label. */
    label: string;
    /** Optional secondary text included in filtering. */
    description?: string;
    /** Prevents pointer and keyboard selection. */
    disabled?: boolean;
}
/** Props for the controlled searchable select. */
export interface ComboboxProps {
    /** Selected option value, or `null` when no option is selected. */
    value: string | null;
    /** Called when the user commits an enabled option. */
    onValueChange: (value: string) => void;
    /** Searchable options with unique values. */
    options: readonly ComboboxOption[];
    /** Input placeholder shown without a selected value. */
    placeholder?: string;
    /** Disables the input and prevents the listbox from opening. */
    disabled?: boolean;
    /** Participates in native form required validation. */
    required?: boolean;
    /** Optional form field name; a hidden input submits the selected value. */
    name?: string;
    /** Stable input ID used to associate labels and listbox options. */
    id?: string;
    /** Accessible name when no external label is used. */
    'aria-label'?: string;
    /** ID of an external element that labels the input. */
    'aria-labelledby'?: string;
    /** IDs of external descriptive elements. */
    'aria-describedby'?: string;
    /** Explicit ARIA invalid state, including grammar and spelling variants. */
    'aria-invalid'?: InputHTMLAttributes<HTMLInputElement>['aria-invalid'];
    /** Marks the input invalid. */
    invalid?: boolean;
    /** Visual control size. */
    size?: ComponentSize;
    /** Optional density override for this control. */
    density?: Density;
    /** Additional class for the combobox wrapper. */
    className?: string;
    /** Content rendered when filtering produces no options. */
    emptyMessage?: ReactNode;
}
/**
 * Searchable controlled select with combobox/listbox semantics and complete
 * arrow, Home/End, Enter, Tab, and Escape behavior.
 */
export declare const Combobox: import("react").ForwardRefExoticComponent<ComboboxProps & import("react").RefAttributes<HTMLInputElement>>;
export {};
