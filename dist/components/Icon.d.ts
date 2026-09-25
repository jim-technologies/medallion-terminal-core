import { type SVGProps } from 'react';
/**
 * First-party glyphs on a 24-unit grid, drawn as 1.75-unit round strokes in
 * `currentColor`. Nouns double as object type icons inside `TypeGlyph`;
 * verbs label actions. None reproduces another product's icon set.
 */
declare const PATHS: {
    readonly add: 'M12 5v14M5 12h14';
    readonly minus: 'M5 12h14';
    readonly check: 'm5 12 4 4L19 6';
    readonly success: 'm5 12 4 4L19 6';
    readonly close: 'm6 6 12 12M18 6 6 18';
    readonly 'chevron-down': 'm7 9 5 5 5-5';
    readonly 'chevron-left': 'm15 18-6-6 6-6';
    readonly 'chevron-right': 'm9 18 6-6-6-6';
    readonly 'arrow-left': 'M19 12H5m6-6-6 6 6 6';
    readonly 'arrow-right': 'M5 12h14m-6-6 6 6-6 6';
    readonly search: `${string}M16 16l4 4`;
    readonly menu: 'M4 7h16M4 12h16M4 17h16';
    readonly 'panel-left': `${string}M9 4v16`;
    readonly 'panel-right': `${string}M15 4v16`;
    readonly 'external-link': 'M14 5h5v5m-9 4 9-9m0 8v6H5V5h6';
    readonly settings: `${string}M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z`;
    readonly spinner: 'M12 3a9 9 0 1 0 9 9M21 3v6h-6';
    readonly copy: `${string}M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3`;
    readonly filter: 'M4 5h16l-6 7.5V19l-4 2v-8.5z';
    readonly columns: `${string}M9 4v16M15 4v16`;
    readonly 'sort-asc': 'M7 20V4M3 8l4-4 4 4M13 7h3M13 12h5M13 17h8';
    readonly 'sort-desc': 'M7 4v16m-4-4 4 4 4-4M13 7h8M13 12h5M13 17h3';
    readonly refresh: 'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16m0 5v-5h-5';
    readonly history: 'M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 3.5v5h5M12 7.5V12l3 2';
    readonly download: 'M12 4v11m-5-5 5 5 5-5M5 20h14';
    readonly upload: 'M12 20V9m-5 5 5-5 5 5M5 4h14';
    readonly edit: 'M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zm10-13 3 3';
    readonly trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13';
    readonly eye: `M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z${string}`;
    readonly star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z';
    readonly bolt: 'M13 3 5 13h6l-1 8 8-10h-6z';
    readonly 'sign-in': 'M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M3 12h11m-4-4 4 4-4 4';
    readonly 'sign-out': 'M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m-1-8h12m-4-4 4 4-4 4';
    readonly hourglass: 'M7 3h10M7 21h10M8 3v2.5a4 4 0 0 0 1.6 3.2L12 11l2.4-2.3A4 4 0 0 0 16 5.5V3M8 21v-2.5a4 4 0 0 1 1.6-3.2L12 13l2.4 2.3a4 4 0 0 1 1.6 3.2V21';
    readonly terminal: `${string}M7 9l3 3-3 3M12 15h5`;
    readonly plug: 'M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0zm6 9v4';
    readonly info: `${string}M12 11v5M12 8h.01`;
    readonly warning: 'M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01';
    readonly error: `${string}M9 9l6 6M15 9l-6 6`;
    readonly home: 'M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z';
    readonly explore: `${string}M15.5 8.5l-2 5-5 2 2-5z`;
    readonly ontology: `${string}${string}M12 14l3.5 6h-7zM8.5 7h6.5M7.4 9.1l3.2 5M16.6 9.6 13.5 14`;
    readonly topology: `${string}${string}${string}${string}M12 7v4m-1.6 3.2-3.8 3.4m7-3.4 3.8 3.4`;
    readonly activity: 'M3 12h4l3-8 4 16 3-8h4';
    readonly object: `M12 3l8 4.5v9L12 21l-8-4.5v-9z${string}`;
    readonly person: `${string}M5 20a7 7 0 0 1 14 0`;
    readonly people: `${string}M3.5 19a5.5 5.5 0 0 1 11 0${string}M15.8 14.1A4.5 4.5 0 0 1 20.5 19`;
    readonly organization: `${string}${string}${string}M12 8v4M6 16v-4h12v4`;
    readonly building: 'M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3';
    readonly contract: 'M6 3h8l4 4v14H6zM14 3v4h4M9 11h6M9 16c1-1.5 2-1.5 2.5 0s1.5 1.5 3 0';
    readonly document: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15h6M9 18h3';
    readonly file: 'M6 2h8l4 4v16H6ZM14 2v5h5';
    readonly folder: 'M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z';
    readonly database: 'M4 5a8 3 0 1 0 16 0A8 3 0 1 0 4 5M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7';
    readonly dataset: 'M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5';
    readonly table: `${string}M3 9h18M3 14.5h18M9 9v11`;
    readonly column: `${string}M3 9h18M10 4v16M14 4v16`;
    readonly bucket: 'M4 6h16l-1.8 13.2a1 1 0 0 1-1 .8H6.8a1 1 0 0 1-1-.8zM4 6c0-1.1 3.6-2 8-2s8 .9 8 2';
    readonly link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1';
    readonly graph: `${string}${string}${string}M8 6.3l8 1.4M6.5 8l2 8M16.8 9.6l-6.6 6.8`;
    readonly event: `${string}M3 10h18M8 3v4m8-4v4M11 14h2v2h-2z`;
    readonly calendar: `${string}M3 10h18M8 3v4m8-4v4`;
    readonly clock: `${string}M12 7v5l3 2`;
    readonly currency: `${string}M14.5 9.5C14 8.5 13.1 8 12 8c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6.5V8m0 8v1.5`;
    readonly order: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6m-6 4h3';
    readonly package: 'M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4m-8 4v10';
    readonly truck: `M3 6h11v10H3zm11 4h4l3 3v3h-7z${string}${string}`;
    readonly location: `M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z${string}`;
    readonly tag: `M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z${string}`;
    readonly flag: 'M5 21V4h11l-2 4 2 4H5';
    readonly alert: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zm4 4.5a2 2 0 0 0 4 0';
    readonly shield: 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z';
    readonly key: `${string}M11 12l8-8M16 7l2 2M14 9l2 2`;
    readonly lock: `${string}M8 11V8a4 4 0 0 1 8 0v3`;
    readonly server: `${string}${string}M8 7.5h.01M8 16.5h.01`;
    readonly cloud: 'M7 19a4 4 0 0 1-.7-7.9 6 6 0 0 1 11.5-1.6A4.5 4.5 0 0 1 17.5 19z';
    readonly branch: `${string}${string}${string}M6 7v10m12-8v1a4 4 0 0 1-4 4H8a2 2 0 0 0-2 2`;
    readonly commit: `${string}M3 12h5.5m7 0H21`;
    readonly workflow: `${string}${string}M9 6h4a4 4 0 0 1 4 4v5m-2.5-2.5L17 15l2.5-2.5`;
    readonly play: 'M8 5v14l11-7z';
    readonly pause: 'M8 5v14M16 5v14';
    readonly film: `${string}M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4`;
    readonly music: `M9 18V5l11-2v13${string}${string}`;
    readonly image: `${string}${string}M21 16l-5-5-9 9`;
    readonly 'chart-line': 'M4 4v16h16M7 15l4-4 3 3 5-6';
    readonly 'chart-bar': 'M4 4v16h16M8 16v-4m4 4V8m4 8v-6';
    readonly globe: `${string}M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z`;
    readonly mail: `${string}M3.5 6.5 12 13l8.5-6.5`;
    readonly phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z';
    readonly ticket: 'M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4zm11 0v2m0 3v2m0 3v1';
    readonly tool: 'M14.7 4.3a4.5 4.5 0 0 0 5 5.9L10 20a2.1 2.1 0 0 1-3-3l9.8-9.8a4.5 4.5 0 0 1-2.1-2.9z';
    readonly badge: `${string}M9 13.5 8 21l4-2 4 2-1-7.5`;
};
/** Built-in, product-neutral symbols available to toolkit controls. */
export type IconName = keyof typeof PATHS | 'more';
/** Every built-in icon name, for pickers, stories, and host validation. */
export declare const ICON_NAMES: readonly IconName[];
/** Props for the stroke-based icon primitive. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
    name: IconName;
    /** Accessible label. Omit when an adjacent label already names the icon. */
    label?: string;
    /** CSS size value or numeric pixel size. */
    size?: string | number;
}
/**
 * First-party icon set used by the toolkit. Icons inherit `currentColor`
 * and never load external SVG or arbitrary markup.
 */
export declare const Icon: import("react").ForwardRefExoticComponent<Omit<IconProps, "ref"> & import("react").RefAttributes<SVGSVGElement>>;
export {};
