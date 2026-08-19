import { type SVGProps } from 'react';
/** Built-in, product-neutral symbols available to toolkit controls. */
export type IconName = 'add' | 'check' | 'chevron-down' | 'chevron-left' | 'chevron-right' | 'close' | 'database' | 'error' | 'external-link' | 'file' | 'folder' | 'info' | 'menu' | 'minus' | 'more' | 'panel-left' | 'panel-right' | 'search' | 'settings' | 'spinner' | 'success' | 'warning';
/** Props for the stroke-based icon primitive. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: IconName;
    /** Accessible label. Omit when an adjacent label already names the icon. */
    label?: string;
    /** CSS size value or numeric pixel size. */
    size?: string | number;
}
/**
 * Small first-party icon set used by the toolkit. Icons inherit `currentColor`
 * and never load external SVG or arbitrary markup.
 */
export declare const Icon: import("react").ForwardRefExoticComponent<Omit<IconProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
