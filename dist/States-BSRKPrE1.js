import { t as e } from "./utils-B2QVXvLO.js";
import { forwardRef as t } from "react";
import { Fragment as n, jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/components/Icon.tsx
var a = t(function({ name: e, label: t, size: n = "1em", className: i, ...a }, s) {
	return /* @__PURE__ */ r("svg", {
		...a,
		ref: s,
		className: ["mtc-icon", i].filter(Boolean).join(" "),
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
		children: /* @__PURE__ */ r(o, { name: e })
	});
});
function o({ name: e }) {
	switch (e) {
		case "add": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("path", { d: "M12 5v14" }), /* @__PURE__ */ r("path", { d: "M5 12h14" })] });
		case "minus": return /* @__PURE__ */ r("path", { d: "M5 12h14" });
		case "check":
		case "success": return /* @__PURE__ */ r("path", { d: "m5 12 4 4L19 6" });
		case "close": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("path", { d: "m6 6 12 12" }), /* @__PURE__ */ r("path", { d: "m18 6-12 12" })] });
		case "chevron-down": return /* @__PURE__ */ r("path", { d: "m7 9 5 5 5-5" });
		case "chevron-left": return /* @__PURE__ */ r("path", { d: "m15 18-6-6 6-6" });
		case "chevron-right": return /* @__PURE__ */ r("path", { d: "m9 18 6-6-6-6" });
		case "search": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("circle", {
			cx: "11",
			cy: "11",
			r: "6.5"
		}), /* @__PURE__ */ r("path", { d: "m16 16 4 4" })] });
		case "more": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("circle", {
				cx: "5",
				cy: "12",
				r: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ r("circle", {
				cx: "12",
				cy: "12",
				r: "1",
				fill: "currentColor"
			}),
			/* @__PURE__ */ r("circle", {
				cx: "19",
				cy: "12",
				r: "1",
				fill: "currentColor"
			})
		] });
		case "info": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}),
			/* @__PURE__ */ r("path", { d: "M12 11v5" }),
			/* @__PURE__ */ r("path", { d: "M12 8h.01" })
		] });
		case "warning": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("path", { d: "M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" }),
			/* @__PURE__ */ r("path", { d: "M12 9v4" }),
			/* @__PURE__ */ r("path", { d: "M12 17h.01" })
		] });
		case "error": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("circle", {
				cx: "12",
				cy: "12",
				r: "9"
			}),
			/* @__PURE__ */ r("path", { d: "m9 9 6 6" }),
			/* @__PURE__ */ r("path", { d: "m15 9-6 6" })
		] });
		case "database": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("ellipse", {
				cx: "12",
				cy: "5",
				rx: "8",
				ry: "3"
			}),
			/* @__PURE__ */ r("path", { d: "M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }),
			/* @__PURE__ */ r("path", { d: "M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" })
		] });
		case "folder": return /* @__PURE__ */ r("path", { d: "M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" });
		case "file": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("path", { d: "M6 2h8l4 4v16H6Z" }), /* @__PURE__ */ r("path", { d: "M14 2v5h5" })] });
		case "panel-left": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "16",
			rx: "1.5"
		}), /* @__PURE__ */ r("path", { d: "M9 4v16" })] });
		case "panel-right": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("rect", {
			x: "3",
			y: "4",
			width: "18",
			height: "16",
			rx: "1.5"
		}), /* @__PURE__ */ r("path", { d: "M15 4v16" })] });
		case "menu": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("path", { d: "M4 7h16" }),
			/* @__PURE__ */ r("path", { d: "M4 12h16" }),
			/* @__PURE__ */ r("path", { d: "M4 17h16" })
		] });
		case "external-link": return /* @__PURE__ */ i(n, { children: [
			/* @__PURE__ */ r("path", { d: "M14 5h5v5" }),
			/* @__PURE__ */ r("path", { d: "m10 14 9-9" }),
			/* @__PURE__ */ r("path", { d: "M19 13v6H5V5h6" })
		] });
		case "settings": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ r("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" })] });
		case "spinner": return /* @__PURE__ */ i(n, { children: [/* @__PURE__ */ r("path", { d: "M12 3a9 9 0 1 0 9 9" }), /* @__PURE__ */ r("path", { d: "M21 3v6h-6" })] });
	}
}
//#endregion
//#region src/components/Button.tsx
var s = t(function({ intent: t = "neutral", variant: n = "outline", size: o = "medium", density: s, loading: c = !1, loadingLabel: l = "Working", startIcon: u, endIcon: d, disabled: f, className: p, children: m, type: h = "button", ...g }, _) {
	return /* @__PURE__ */ i("button", {
		...g,
		ref: _,
		type: h,
		disabled: f || c,
		"aria-busy": c || void 0,
		className: e("mtc-button", s && `mtc-density-${s}`, p),
		"data-intent": t,
		"data-variant": n,
		"data-size": o,
		children: [
			c ? /* @__PURE__ */ r(a, {
				name: "spinner",
				className: "mtc-button-spinner"
			}) : u,
			/* @__PURE__ */ r("span", {
				className: "mtc-button-label",
				children: c ? l : m
			}),
			!c && d
		]
	});
}), c = t(function({ icon: t, className: n, loading: i = !1, loadingLabel: a = "Working", "aria-label": o, ...c }, l) {
	return /* @__PURE__ */ r(s, {
		...c,
		ref: l,
		className: e("mtc-icon-button", n),
		"aria-label": i ? a : o,
		loading: i,
		loadingLabel: a,
		startIcon: t,
		children: /* @__PURE__ */ r("span", {
			className: "mtc-visually-hidden",
			children: i ? a : o
		})
	});
}), l = t(function({ label: t, density: n, className: i, children: a, ...o }, s) {
	return /* @__PURE__ */ r("div", {
		...o,
		ref: s,
		role: "group",
		"aria-label": t,
		className: e("mtc-button-group", n && `mtc-density-${n}`, i),
		children: a
	});
}), u = t(function({ title: t, description: n, icon: a, actions: o, compact: s, className: c, ...l }, u) {
	return /* @__PURE__ */ i("div", {
		...l,
		ref: u,
		className: e("mtc-state", c),
		"data-compact": s,
		children: [
			a && /* @__PURE__ */ r("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: a
			}),
			/* @__PURE__ */ r("div", {
				className: "mtc-state-title",
				children: t
			}),
			n && /* @__PURE__ */ r("div", {
				className: "mtc-state-description",
				children: n
			}),
			o && /* @__PURE__ */ r("div", {
				className: "mtc-state-actions",
				children: o
			})
		]
	});
}), d = t(function({ label: t = "Loading", description: n, variant: o = "spinner", lines: s = 3, compact: c, className: l, ...u }, d) {
	return /* @__PURE__ */ i("div", {
		...u,
		ref: d,
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		className: e("mtc-state mtc-loading-state", l),
		"data-compact": c,
		children: [
			o === "spinner" ? /* @__PURE__ */ r(a, {
				name: "spinner",
				className: "mtc-state-spinner"
			}) : /* @__PURE__ */ r("div", {
				className: "mtc-state-skeleton",
				"aria-hidden": "true",
				children: Array.from({ length: f(s) }).map((e, t) => /* @__PURE__ */ r("span", { style: { width: `${88 - t * 9}%` } }, t))
			}),
			/* @__PURE__ */ r("div", {
				className: "mtc-state-title",
				children: t
			}),
			n && /* @__PURE__ */ r("div", {
				className: "mtc-state-description",
				children: n
			})
		]
	});
});
function f(e) {
	return Number.isFinite(e) ? Math.max(1, Math.min(Math.trunc(e), 8)) : 3;
}
var p = t(function({ title: t = "Unable to load", message: n, onRetry: o, retryLabel: c = "Retry", actions: l, compact: u, intent: d = "danger", className: f, ...p }, m) {
	return /* @__PURE__ */ i("div", {
		...p,
		ref: m,
		role: "alert",
		className: e("mtc-state mtc-error-state", f),
		"data-compact": u,
		"data-intent": d,
		children: [
			/* @__PURE__ */ r("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ r(a, { name: d === "warning" ? "warning" : "error" })
			}),
			/* @__PURE__ */ r("div", {
				className: "mtc-state-title",
				children: t
			}),
			/* @__PURE__ */ r("div", {
				className: "mtc-state-description",
				children: n
			}),
			(o || l) && /* @__PURE__ */ i("div", {
				className: "mtc-state-actions",
				children: [o && /* @__PURE__ */ r(s, {
					size: "small",
					onClick: o,
					children: c
				}), l]
			})
		]
	});
});
//#endregion
export { l as a, s as i, p as n, c as o, d as r, a as s, u as t };
