import { t as e } from "./utils-j4lJ7S1v.js";
import { createContext as t, forwardRef as n, useContext as r, useMemo as i } from "react";
import { Fragment as a, jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/foundations/DesignSystemProvider.tsx
var c = t(null);
function l() {
	return r(c);
}
function u({ theme: e, density: t, children: n }) {
	let r = i(() => ({
		theme: e,
		density: t
	}), [e, t]);
	return /* @__PURE__ */ o(c.Provider, {
		value: r,
		children: n
	});
}
var d = n(function({ theme: e = "dark", density: t = "comfortable", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ o("div", {
		...i,
		ref: a,
		className: [
			"mtc-root",
			"mtc-design-system",
			`mtc-theme-${e}`,
			n
		].filter(Boolean).join(" "),
		"data-theme": e,
		"data-density": t,
		children: /* @__PURE__ */ o(u, {
			theme: e,
			density: t,
			children: r
		})
	});
}), f = n(function({ name: e, label: t, size: n = "1em", className: r, ...i }, a) {
	return /* @__PURE__ */ o("svg", {
		...i,
		ref: a,
		className: ["mtc-icon", r].filter(Boolean).join(" "),
		width: n,
		height: n,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		role: t ? "img" : void 0,
		"aria-label": t,
		"aria-hidden": !t || void 0,
		focusable: "false",
		children: /* @__PURE__ */ o(p, { name: e })
	});
});
function p({ name: e }) {
	switch (e) {
		case "add": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("path", { d: "M12 5v14" }), /* @__PURE__ */ o("path", { d: "M5 12h14" })] });
		case "minus": return /* @__PURE__ */ o("path", { d: "M5 12h14" });
		case "check":
		case "success": return /* @__PURE__ */ o("path", { d: "m5 12 4 4L19 6" });
		case "close": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("path", { d: "m6 6 12 12" }), /* @__PURE__ */ o("path", { d: "m18 6-12 12" })] });
		case "chevron-down": return /* @__PURE__ */ o("path", { d: "m7 9 5 5 5-5" });
		case "chevron-left": return /* @__PURE__ */ o("path", { d: "m15 18-6-6 6-6" });
		case "chevron-right": return /* @__PURE__ */ o("path", { d: "m9 18 6-6-6-6" });
		case "search": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("circle", {
			cx: "11",
			cy: "11",
			r: "6.5"
		}), /* @__PURE__ */ o("path", { d: "m16 16 4 4" })] });
		case "more": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("circle", {
				cx: "5",
				cy: "12",
				r: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ o("circle", {
				cx: "12",
				cy: "12",
				r: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ o("circle", {
				cx: "19",
				cy: "12",
				r: "1",
				fill: "currentColor"
			})
		] });
		case "info": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}),
			/* @__PURE__ */ o("path", { d: "M12 11v5" }),
			/* @__PURE__ */ o("path", { d: "M12 8h.01" })
		] });
		case "warning": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("path", { d: "M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" }),
			/* @__PURE__ */ o("path", { d: "M12 9v4" }),
			/* @__PURE__ */ o("path", { d: "M12 17h.01" })
		] });
		case "error": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}),
			/* @__PURE__ */ o("path", { d: "m9 9 6 6" }),
			/* @__PURE__ */ o("path", { d: "m15 9-6 6" })
		] });
		case "database": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("ellipse", {
				cx: "12",
				cy: "5",
				rx: "8",
				ry: "3"
			}),
			/* @__PURE__ */ o("path", { d: "M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }),
			/* @__PURE__ */ o("path", { d: "M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" })
		] });
		case "folder": return /* @__PURE__ */ o("path", { d: "M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" });
		case "file": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("path", { d: "M6 2h8l4 4v16H6Z" }), /* @__PURE__ */ o("path", { d: "M14 2v5h5" })] });
		case "panel-left": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "16",
			rx: "1.5"
		}), /* @__PURE__ */ o("path", { d: "M9 4v16" })] });
		case "panel-right": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "16",
			rx: "1.5"
		}), /* @__PURE__ */ o("path", { d: "M15 4v16" })] });
		case "menu": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("path", { d: "M4 7h16" }),
			/* @__PURE__ */ o("path", { d: "M4 12h16" }),
			/* @__PURE__ */ o("path", { d: "M4 17h16" })
		] });
		case "external-link": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o("path", { d: "M14 5h5v5" }),
			/* @__PURE__ */ o("path", { d: "m10 14 9-9" }),
			/* @__PURE__ */ o("path", { d: "M19 13v6H5V5h6" })
		] });
		case "settings": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ o("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" })] });
		case "spinner": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o("path", { d: "M12 3a9 9 0 1 0 9 9" }), /* @__PURE__ */ o("path", { d: "M21 3v6h-6" })] });
	}
}
//#endregion
//#region src/components/Button.tsx
var m = n(function({ intent: t = "neutral", variant: n = "outline", size: r = "medium", density: i, loading: a = !1, loadingLabel: c = "Working", startIcon: l, endIcon: u, disabled: d, className: p, children: m, type: h = "button", ...g }, _) {
	return /* @__PURE__ */ s("button", {
		...g,
		ref: _,
		type: h,
		disabled: d || a,
		"aria-busy": a || void 0,
		className: e("mtc-button", i && `mtc-density-${i}`, p),
		"data-intent": t,
		"data-variant": n,
		"data-size": r,
		children: [
			a ? /* @__PURE__ */ o(f, {
				name: "spinner",
				className: "mtc-button-spinner"
			}) : l,
			/* @__PURE__ */ o("span", {
				className: "mtc-button-label",
				children: a ? c : m
			}),
			!a && u
		]
	});
}), h = n(function({ icon: t, className: n, loading: r = !1, loadingLabel: i = "Working", "aria-label": a, ...s }, c) {
	return /* @__PURE__ */ o(m, {
		...s,
		ref: c,
		className: e("mtc-icon-button", n),
		"aria-label": r ? i : a,
		loading: r,
		loadingLabel: i,
		startIcon: t,
		children: /* @__PURE__ */ o("span", {
			className: "mtc-visually-hidden",
			children: r ? i : a
		})
	});
}), g = n(function({ label: t, density: n, className: r, children: i, ...a }, s) {
	return /* @__PURE__ */ o("div", {
		...a,
		ref: s,
		role: "group",
		"aria-label": t,
		className: e("mtc-button-group", n && `mtc-density-${n}`, r),
		children: i
	});
}), _ = n(function({ title: t, description: n, icon: r, actions: i, compact: a, className: c, ...l }, u) {
	return /* @__PURE__ */ s("div", {
		...l,
		ref: u,
		className: e("mtc-state", c),
		"data-compact": a,
		children: [
			r && /* @__PURE__ */ o("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: r
			}),
			/* @__PURE__ */ o("div", {
				className: "mtc-state-title",
				children: t
			}),
			n && /* @__PURE__ */ o("div", {
				className: "mtc-state-description",
				children: n
			}),
			i && /* @__PURE__ */ o("div", {
				className: "mtc-state-actions",
				children: i
			})
		]
	});
}), v = n(function({ label: t = "Loading", description: n, variant: r = "spinner", lines: i = 3, compact: a, className: c, ...l }, u) {
	return /* @__PURE__ */ s("div", {
		...l,
		ref: u,
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		className: e("mtc-state mtc-loading-state", c),
		"data-compact": a,
		children: [
			r === "spinner" ? /* @__PURE__ */ o(f, {
				name: "spinner",
				className: "mtc-state-spinner"
			}) : /* @__PURE__ */ o("div", {
				className: "mtc-state-skeleton",
				"aria-hidden": "true",
				children: Array.from({ length: y(i) }).map((e, t) => /* @__PURE__ */ o("span", { style: { width: `${88 - t * 9}%` } }, t))
			}),
			/* @__PURE__ */ o("div", {
				className: "mtc-state-title",
				children: t
			}),
			n && /* @__PURE__ */ o("div", {
				className: "mtc-state-description",
				children: n
			})
		]
	});
});
function y(e) {
	return Number.isFinite(e) ? Math.max(1, Math.min(Math.trunc(e), 8)) : 3;
}
var b = n(function({ title: t = "Unable to load", message: n, onRetry: r, retryLabel: i = "Retry", actions: a, compact: c, intent: l = "danger", className: u, ...d }, p) {
	return /* @__PURE__ */ s("div", {
		...d,
		ref: p,
		role: "alert",
		className: e("mtc-state mtc-error-state", u),
		"data-compact": c,
		"data-intent": l,
		children: [
			/* @__PURE__ */ o("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ o(f, { name: l === "warning" ? "warning" : "error" })
			}),
			/* @__PURE__ */ o("div", {
				className: "mtc-state-title",
				children: t
			}),
			/* @__PURE__ */ o("div", {
				className: "mtc-state-description",
				children: n
			}),
			(r || a) && /* @__PURE__ */ s("div", {
				className: "mtc-state-actions",
				children: [r && /* @__PURE__ */ o(m, {
					size: "small",
					onClick: r,
					children: i
				}), a]
			})
		]
	});
});
//#endregion
export { g as a, d as c, m as i, u as l, b as n, h as o, v as r, f as s, _ as t, l as u };
