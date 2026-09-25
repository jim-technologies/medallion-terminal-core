import { type HTMLAttributes } from 'react';
import { type IconName } from './Icon';
/**
 * The twelve object type identity slots, in hue order. Each maps to the
 * `--mtc-type-{slot}-fg|bg` tokens and is used only for type chips, facet
 * dots, and graph nodes.
 */
export declare const TYPE_COLORS: readonly ['azure', 'cyan', 'teal', 'green', 'lime', 'olive', 'amber', 'orange', 'red', 'rose', 'magenta', 'violet'];
/** One object type identity slot. */
export type TypeColor = (typeof TYPE_COLORS)[number];
/**
 * Deterministic slot for a type without presentation hints: a 32-bit FNV-1a
 * hash of its id with a final avalanche step, so a type keeps its colour
 * across reloads and hosts.
 */
export declare function typeColorFor(typeId: string): TypeColor;
/** Glyph chip sizes in pixels. */
export type TypeGlyphSize = 16 | 20 | 24 | 40;
/** Props for an object type identity chip. */
export interface TypeGlyphProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
    /** Type icon; the generic `object` glyph when the type declares none. */
    icon?: IconName;
    /** Identity slot; use `typeColorFor(typeId)` when the type declares none. */
    color: TypeColor;
    /** Chip size in pixels. */
    size?: TypeGlyphSize;
    /**
     * Accessible type name. Omit when adjacent text already names the type;
     * the chip is then decorative.
     */
    label?: string;
}
/**
 * The object type chip: a type icon on its identity slot. It is the only
 * place type colour appears in chrome, and it never carries status.
 */
export declare const TypeGlyph: import("react").ForwardRefExoticComponent<TypeGlyphProps & import("react").RefAttributes<HTMLSpanElement>>;
