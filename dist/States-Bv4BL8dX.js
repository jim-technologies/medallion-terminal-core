import { t as e } from "./utils-j4lJ7S1v.js";
import { createContext as t, forwardRef as n, useCallback as r, useContext as i, useEffect as a, useMemo as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/foundations/messages.ts
var u = {
	"button.working": "Working",
	"breadcrumbs.label": "Breadcrumbs",
	"combobox.placeholder": "Select…",
	"combobox.empty": "No matching options",
	"dialog.close": "Close dialog",
	"drawer.close": "Close drawer",
	"splitPane.resize": "Resize panes",
	"tag.remove": "Remove",
	"toolbar.label": "Toolbar",
	"tree.collapse": "Collapse {label}",
	"tree.expand": "Expand {label}",
	"state.loading": "Loading",
	"state.retry": "Retry",
	"state.error.title": "Unable to load"
}, d = {
	"button.working": "处理中",
	"breadcrumbs.label": "路径导航",
	"combobox.placeholder": "请选择…",
	"combobox.empty": "没有匹配的选项",
	"dialog.close": "关闭对话框",
	"drawer.close": "关闭抽屉",
	"splitPane.resize": "调整窗格大小",
	"tag.remove": "移除",
	"toolbar.label": "工具栏",
	"tree.collapse": "折叠 {label}",
	"tree.expand": "展开 {label}",
	"state.loading": "正在加载",
	"state.retry": "重试",
	"state.error.title": "无法加载"
}, f = {
	en: u,
	zh: d
};
function p(e) {
	return f[e.toLowerCase().split(/[-_]/)[0] ?? "en"] ?? u;
}
function m(e, t) {
	return t ? e.replace(/\{([a-zA-Z0-9_]+)\}/g, (e, n) => n in t ? String(t[n]) : e) : e;
}
//#endregion
//#region src/foundations/DesignSystemProvider.tsx
var h = "en", g = t(null);
function _(e, t) {
	let n = null, r = 0, i = {
		theme: e,
		density: t
	}, a = () => {
		n && (n.className = `mtc-root mtc-portal-root mtc-theme-${i.theme}`, n.dataset.theme = i.theme, n.dataset.density = i.density);
	};
	return {
		acquire() {
			return typeof document > "u" ? null : (n || (n = document.createElement("div"), a(), document.body.appendChild(n)), r += 1, n);
		},
		release() {
			r = Math.max(0, r - 1), r === 0 && n && (n.remove(), n = null);
		},
		update(e, t) {
			i = {
				theme: e,
				density: t
			}, a();
		}
	};
}
function v() {
	let e = i(g);
	return e ? {
		theme: e.theme,
		density: e.density
	} : null;
}
function y() {
	let e = i(g)?.portal, [t, n] = s(null);
	return a(() => {
		if (e) return n(e.acquire()), () => {
			e.release(), n(null);
		};
	}, [e]), t;
}
function b() {
	let e = i(g);
	return {
		locale: e?.locale ?? h,
		timeZone: e?.timeZone
	};
}
function x() {
	let e = i(g)?.messages ?? u;
	return r((t, n) => m(e[t], n), [e]);
}
function S({ theme: e, density: t, locale: n, timeZone: r, messages: l, children: u }) {
	let d = i(g), [f] = s(() => _(e, t));
	a(() => {
		f.update(e, t);
	}, [
		f,
		e,
		t
	]);
	let m = n ?? d?.locale ?? h, v = r ?? d?.timeZone, y = d?.messages, b = o(() => {
		let e = n === void 0 && y ? y : p(m);
		return l ? {
			...e,
			...l
		} : e;
	}, [
		n,
		m,
		y,
		l
	]), x = o(() => ({
		theme: e,
		density: t,
		portal: f,
		locale: m,
		timeZone: v,
		messages: b
	}), [
		e,
		t,
		f,
		m,
		v,
		b
	]);
	return /* @__PURE__ */ c(g.Provider, {
		value: x,
		children: u
	});
}
var C = n(function({ theme: e = "dark", density: t = "standard", locale: n, timeZone: r, messages: i, className: a, children: o, ...s }, l) {
	return /* @__PURE__ */ c("div", {
		...s,
		ref: l,
		className: [
			"mtc-root",
			"mtc-design-system",
			`mtc-theme-${e}`,
			a
		].filter(Boolean).join(" "),
		"data-theme": e,
		"data-density": t,
		lang: n ?? s.lang,
		children: /* @__PURE__ */ c(S, {
			theme: e,
			density: t,
			locale: n,
			timeZone: r,
			messages: i,
			children: o
		})
	});
});
//#endregion
//#region src/components/Icon.tsx
function w(e, t, n) {
	return `M${e - n} ${t}a${n} ${n} 0 1 0 ${2 * n} 0a${n} ${n} 0 1 0 ${-2 * n} 0`;
}
function T(e, t, n, r, i = 1.5) {
	return `M${e + i} ${t}h${n - 2 * i}a${i} ${i} 0 0 1 ${i} ${i}v${r - 2 * i}a${i} ${i} 0 0 1 ${-i} ${i}h${-(n - 2 * i)}a${i} ${i} 0 0 1 ${-i} ${-i}v${-(r - 2 * i)}a${i} ${i} 0 0 1 ${i} ${-i}z`;
}
var E = {
	add: "M12 5v14M5 12h14",
	minus: "M5 12h14",
	check: "m5 12 4 4L19 6",
	success: "m5 12 4 4L19 6",
	close: "m6 6 12 12M18 6 6 18",
	"chevron-down": "m7 9 5 5 5-5",
	"chevron-left": "m15 18-6-6 6-6",
	"chevron-right": "m9 18 6-6-6-6",
	"arrow-left": "M19 12H5m6-6-6 6 6 6",
	"arrow-right": "M5 12h14m-6-6 6 6-6 6",
	search: `${w(11, 11, 6.5)}M16 16l4 4`,
	menu: "M4 7h16M4 12h16M4 17h16",
	"panel-left": `${T(3, 4, 18, 16)}M9 4v16`,
	"panel-right": `${T(3, 4, 18, 16)}M15 4v16`,
	"external-link": "M14 5h5v5m-9 4 9-9m0 8v6H5V5h6",
	settings: `${w(12, 12, 3)}M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z`,
	spinner: "M12 3a9 9 0 1 0 9 9M21 3v6h-6",
	copy: `${T(8, 8, 12, 12)}M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3`,
	filter: "M4 5h16l-6 7.5V19l-4 2v-8.5z",
	columns: `${T(3, 4, 18, 16)}M9 4v16M15 4v16`,
	"sort-asc": "M7 20V4M3 8l4-4 4 4M13 7h3M13 12h5M13 17h8",
	"sort-desc": "M7 4v16m-4-4 4 4 4-4M13 7h8M13 12h5M13 17h3",
	refresh: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16m0 5v-5h-5",
	history: "M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 3.5v5h5M12 7.5V12l3 2",
	download: "M12 4v11m-5-5 5 5 5-5M5 20h14",
	upload: "M12 20V9m-5 5 5-5 5 5M5 4h14",
	edit: "M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zm10-13 3 3",
	trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
	eye: `M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z${w(12, 12, 3)}`,
	star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
	bolt: "M13 3 5 13h6l-1 8 8-10h-6z",
	"sign-in": "M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M3 12h11m-4-4 4 4-4 4",
	"sign-out": "M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m-1-8h12m-4-4 4 4-4 4",
	hourglass: "M7 3h10M7 21h10M8 3v2.5a4 4 0 0 0 1.6 3.2L12 11l2.4-2.3A4 4 0 0 0 16 5.5V3M8 21v-2.5a4 4 0 0 1 1.6-3.2L12 13l2.4 2.3a4 4 0 0 1 1.6 3.2V21",
	terminal: `${T(3, 4, 18, 16)}M7 9l3 3-3 3M12 15h5`,
	plug: "M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0zm6 9v4",
	info: `${w(12, 12, 9)}M12 11v5M12 8h.01`,
	warning: "M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01",
	error: `${w(12, 12, 9)}M9 9l6 6M15 9l-6 6`,
	home: "M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z",
	explore: `${w(12, 12, 9)}M15.5 8.5l-2 5-5 2 2-5z`,
	ontology: `${w(6, 7, 2.5)}${T(15, 4.5, 5, 5, 1)}M12 14l3.5 6h-7zM8.5 7h6.5M7.4 9.1l3.2 5M16.6 9.6 13.5 14`,
	topology: `${w(12, 5, 2)}${w(12, 13, 2)}${w(5, 19, 2)}${w(19, 19, 2)}M12 7v4m-1.6 3.2-3.8 3.4m7-3.4 3.8 3.4`,
	activity: "M3 12h4l3-8 4 16 3-8h4",
	object: `M12 3l8 4.5v9L12 21l-8-4.5v-9z${w(12, 12, 2.5)}`,
	person: `${w(12, 8, 3.5)}M5 20a7 7 0 0 1 14 0`,
	people: `${w(9, 8.5, 3)}M3.5 19a5.5 5.5 0 0 1 11 0${w(16.5, 9.5, 2.5)}M15.8 14.1A4.5 4.5 0 0 1 20.5 19`,
	organization: `${T(9, 3, 6, 5, 1)}${T(3, 16, 6, 5, 1)}${T(15, 16, 6, 5, 1)}M12 8v4M6 16v-4h12v4`,
	building: "M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3",
	contract: "M6 3h8l4 4v14H6zM14 3v4h4M9 11h6M9 16c1-1.5 2-1.5 2.5 0s1.5 1.5 3 0",
	document: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15h6M9 18h3",
	file: "M6 2h8l4 4v16H6ZM14 2v5h5",
	folder: "M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
	database: "M4 5a8 3 0 1 0 16 0A8 3 0 1 0 4 5M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7",
	dataset: "M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5",
	table: `${T(3, 4, 18, 16)}M3 9h18M3 14.5h18M9 9v11`,
	column: `${T(3, 4, 18, 16)}M3 9h18M10 4v16M14 4v16`,
	bucket: "M4 6h16l-1.8 13.2a1 1 0 0 1-1 .8H6.8a1 1 0 0 1-1-.8zM4 6c0-1.1 3.6-2 8-2s8 .9 8 2",
	link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
	graph: `${w(6, 6, 2)}${w(18, 8, 2)}${w(9, 18, 2)}M8 6.3l8 1.4M6.5 8l2 8M16.8 9.6l-6.6 6.8`,
	event: `${T(3, 5, 18, 16)}M3 10h18M8 3v4m8-4v4M11 14h2v2h-2z`,
	calendar: `${T(3, 5, 18, 16)}M3 10h18M8 3v4m8-4v4`,
	clock: `${w(12, 12, 9)}M12 7v5l3 2`,
	currency: `${w(12, 12, 9)}M14.5 9.5C14 8.5 13.1 8 12 8c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6.5V8m0 8v1.5`,
	order: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6m-6 4h3",
	package: "M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4m-8 4v10",
	truck: `M3 6h11v10H3zm11 4h4l3 3v3h-7z${w(7, 18, 2)}${w(17, 18, 2)}`,
	location: `M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z${w(12, 9.5, 2.5)}`,
	tag: `M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z${w(7.5, 7.5, 1.5)}`,
	flag: "M5 21V4h11l-2 4 2 4H5",
	alert: "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zm4 4.5a2 2 0 0 0 4 0",
	shield: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z",
	key: `${w(8, 15, 4)}M11 12l8-8M16 7l2 2M14 9l2 2`,
	lock: `${T(5, 11, 14, 10)}M8 11V8a4 4 0 0 1 8 0v3`,
	server: `${T(4, 4, 16, 7)}${T(4, 13, 16, 7)}M8 7.5h.01M8 16.5h.01`,
	cloud: "M7 19a4 4 0 0 1-.7-7.9 6 6 0 0 1 11.5-1.6A4.5 4.5 0 0 1 17.5 19z",
	branch: `${w(6, 5, 2)}${w(6, 19, 2)}${w(18, 7, 2)}M6 7v10m12-8v1a4 4 0 0 1-4 4H8a2 2 0 0 0-2 2`,
	commit: `${w(12, 12, 3.5)}M3 12h5.5m7 0H21`,
	workflow: `${T(3, 3, 6, 6, 1)}${T(15, 15, 6, 6, 1)}M9 6h4a4 4 0 0 1 4 4v5m-2.5-2.5L17 15l2.5-2.5`,
	play: "M8 5v14l11-7z",
	pause: "M8 5v14M16 5v14",
	film: `${T(3, 4, 18, 16)}M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4`,
	music: `M9 18V5l11-2v13${w(6, 18, 3)}${w(17, 16, 3)}`,
	image: `${T(3, 4, 18, 16)}${w(8.5, 9.5, 1.5)}M21 16l-5-5-9 9`,
	"chart-line": "M4 4v16h16M7 15l4-4 3 3 5-6",
	"chart-bar": "M4 4v16h16M8 16v-4m4 4V8m4 8v-6",
	globe: `${w(12, 12, 9)}M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z`,
	mail: `${T(3, 5, 18, 14)}M3.5 6.5 12 13l8.5-6.5`,
	phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
	ticket: "M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4zm11 0v2m0 3v2m0 3v1",
	tool: "M14.7 4.3a4.5 4.5 0 0 0 5 5.9L10 20a2.1 2.1 0 0 1-3-3l9.8-9.8a4.5 4.5 0 0 1-2.1-2.9z",
	badge: `${w(12, 9, 5)}M9 13.5 8 21l4-2 4 2-1-7.5`
}, D = [...Object.keys(E), "more"], O = n(function({ name: e, label: t, size: n = "1em", className: r, strokeWidth: i = 1.75, ...a }, o) {
	return /* @__PURE__ */ c("svg", {
		...a,
		ref: o,
		className: ["mtc-icon", r].filter(Boolean).join(" "),
		width: n,
		height: n,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: i,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		role: t ? "img" : void 0,
		"aria-label": t,
		"aria-hidden": !t || void 0,
		focusable: "false",
		children: e === "more" ? /* @__PURE__ */ c("path", {
			d: `${w(5, 12, 1)}${w(12, 12, 1)}${w(19, 12, 1)}`,
			fill: "currentColor"
		}) : /* @__PURE__ */ c("path", { d: E[e] })
	});
}), k = n(function({ intent: t = "neutral", variant: n = "outline", size: r = "medium", density: i, loading: a = !1, loadingLabel: o, startIcon: s, endIcon: u, disabled: d, className: f, children: p, type: m = "button", ...h }, g) {
	let _ = x();
	return /* @__PURE__ */ l("button", {
		...h,
		ref: g,
		type: m,
		disabled: d || a,
		"aria-busy": a || void 0,
		className: e("mtc-button", i && `mtc-density-${i}`, f),
		"data-intent": t,
		"data-variant": n,
		"data-size": r,
		children: [
			a ? /* @__PURE__ */ c(O, {
				name: "spinner",
				className: "mtc-button-spinner"
			}) : s,
			/* @__PURE__ */ c("span", {
				className: "mtc-button-label",
				children: a ? o ?? _("button.working") : p
			}),
			!a && u
		]
	});
}), A = n(function({ icon: t, className: n, loading: r = !1, loadingLabel: i, "aria-label": a, ...o }, s) {
	let l = x(), u = i ?? l("button.working");
	return /* @__PURE__ */ c(k, {
		...o,
		ref: s,
		className: e("mtc-icon-button", n),
		"aria-label": r ? u : a,
		loading: r,
		loadingLabel: u,
		startIcon: t,
		children: /* @__PURE__ */ c("span", {
			className: "mtc-visually-hidden",
			children: r ? u : a
		})
	});
}), j = n(function({ label: t, density: n, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ c("div", {
		...a,
		ref: o,
		role: "group",
		"aria-label": t,
		className: e("mtc-button-group", n && `mtc-density-${n}`, r),
		children: i
	});
}), M = n(function({ title: t, description: n, icon: r, actions: i, compact: a, className: o, ...s }, u) {
	return /* @__PURE__ */ l("div", {
		...s,
		ref: u,
		className: e("mtc-state", o),
		"data-compact": a,
		children: [
			r && /* @__PURE__ */ c("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: r
			}),
			/* @__PURE__ */ c("div", {
				className: "mtc-state-title",
				children: t
			}),
			n && /* @__PURE__ */ c("div", {
				className: "mtc-state-description",
				children: n
			}),
			i && /* @__PURE__ */ c("div", {
				className: "mtc-state-actions",
				children: i
			})
		]
	});
}), N = n(function({ label: t, description: n, variant: r = "spinner", lines: i = 3, compact: a, className: o, ...s }, u) {
	let d = x();
	return /* @__PURE__ */ l("div", {
		...s,
		ref: u,
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		className: e("mtc-state mtc-loading-state", o),
		"data-compact": a,
		children: [
			r === "spinner" ? /* @__PURE__ */ c(O, {
				name: "spinner",
				className: "mtc-state-spinner"
			}) : /* @__PURE__ */ c("div", {
				className: "mtc-state-skeleton",
				"aria-hidden": "true",
				children: Array.from({ length: P(i) }).map((e, t) => /* @__PURE__ */ c("span", { style: { width: `${88 - t * 9}%` } }, t))
			}),
			/* @__PURE__ */ c("div", {
				className: "mtc-state-title",
				children: t ?? d("state.loading")
			}),
			n && /* @__PURE__ */ c("div", {
				className: "mtc-state-description",
				children: n
			})
		]
	});
});
function P(e) {
	return Number.isFinite(e) ? Math.max(1, Math.min(Math.trunc(e), 8)) : 3;
}
var F = n(function({ title: t, message: n, onRetry: r, retryLabel: i, actions: a, compact: o, intent: s = "danger", className: u, ...d }, f) {
	let p = x();
	return /* @__PURE__ */ l("div", {
		...d,
		ref: f,
		role: "alert",
		className: e("mtc-state mtc-error-state", u),
		"data-compact": o,
		"data-intent": s,
		children: [
			/* @__PURE__ */ c("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ c(O, { name: s === "warning" ? "warning" : "error" })
			}),
			/* @__PURE__ */ c("div", {
				className: "mtc-state-title",
				children: t ?? p("state.error.title")
			}),
			/* @__PURE__ */ c("div", {
				className: "mtc-state-description",
				children: n
			}),
			(r || a) && /* @__PURE__ */ l("div", {
				className: "mtc-state-actions",
				children: [r && /* @__PURE__ */ c(k, {
					size: "small",
					onClick: r,
					children: i ?? p("state.retry")
				}), a]
			})
		]
	});
});
//#endregion
export { p as _, j as a, O as c, v as d, b as f, d as g, u as h, k as i, C as l, y as m, F as n, A as o, x as p, N as r, D as s, M as t, S as u, m as v };
