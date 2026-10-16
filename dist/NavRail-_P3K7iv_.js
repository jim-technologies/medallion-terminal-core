import { E as e, g as t, m as n } from "./States-BUjeBrSp.js";
import { t as r } from "./utils-8rNbW-NI.js";
import { i, n as a, o } from "./types-C1HPXTFC.js";
import { forwardRef as s } from "react";
import { Fragment as c, jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/workbench/NavRail.tsx
var d = s(function({ label: s, sections: d, activeId: f, onNavigate: p, collapsed: m = !1, onCollapsedChange: h, header: g, footer: _, variant: v = "standalone", className: y, ...b }, x) {
	let S = e();
	return /* @__PURE__ */ u("nav", {
		...b,
		ref: x,
		"aria-label": s,
		className: r("mtc-nav-rail", y),
		"data-collapsed": m || void 0,
		"data-variant": v === "embedded" ? v : void 0,
		children: [
			g && /* @__PURE__ */ l("div", {
				className: "mtc-nav-rail-header",
				children: g
			}),
			/* @__PURE__ */ l("div", {
				className: "mtc-nav-rail-sections",
				children: d.map((e) => /* @__PURE__ */ u("div", {
					className: "mtc-nav-rail-section",
					children: [e.label && /* @__PURE__ */ l("div", {
						className: "mtc-nav-rail-section-label",
						"aria-hidden": m || void 0,
						children: e.label
					}), /* @__PURE__ */ l("ul", {
						"aria-label": e.label,
						children: e.items.map((e) => {
							let n = e.id === f, r = e.type ? (() => {
								let { icon: t, color: n } = a(e.type);
								return /* @__PURE__ */ l(o, {
									icon: t,
									color: n,
									size: 16
								});
							})() : e.icon ? /* @__PURE__ */ l(t, {
								name: e.icon,
								className: "mtc-nav-rail-icon"
							}) : null, s = /* @__PURE__ */ u(c, { children: [
								r,
								/* @__PURE__ */ l("span", {
									className: "mtc-nav-rail-label",
									children: e.label
								}),
								e.count != null && /* @__PURE__ */ l("span", {
									className: "mtc-nav-rail-count",
									children: e.count
								})
							] }), d = {
								className: "mtc-nav-rail-item",
								"data-active": n || void 0,
								"aria-current": n ? "page" : void 0,
								title: m ? e.label : void 0
							};
							return /* @__PURE__ */ l("li", { children: e.href && !e.disabled ? /* @__PURE__ */ l("a", {
								...d,
								href: e.href,
								onClick: i(p ? (t) => p(e, t) : void 0),
								children: s
							}) : /* @__PURE__ */ l("button", {
								...d,
								type: "button",
								disabled: e.disabled,
								onClick: (t) => p?.(e, t),
								children: s
							}) }, e.id);
						})
					})]
				}, e.id))
			}),
			(_ || h) && /* @__PURE__ */ u("div", {
				className: "mtc-nav-rail-footer",
				children: [_, h && /* @__PURE__ */ l(n, {
					icon: /* @__PURE__ */ l(t, { name: "panel-left" }),
					"aria-label": S(m ? "navRail.expand" : "navRail.collapse"),
					"aria-expanded": !m,
					variant: "ghost",
					size: "small",
					onClick: () => h(!m)
				})]
			})
		]
	});
});
//#endregion
export { d as t };
