import { T as e, h as t, p as n, w as r } from "./States-BRpBuveA.js";
import { t as i } from "./utils-BfYGx7e_.js";
import { i as a, n as o, o as s } from "./types-DZxjyhu_.js";
import { i as c } from "./FormControls-DtyFD-nE.js";
import { g as l, v as u, x as d, y as f } from "./sourceError-CTpw8oGk.js";
import { o as p, r as m, s as h, t as g } from "./PropertyValue-pJrg2xQi.js";
import { forwardRef as _, useId as v, useMemo as y, useRef as b, useState as x } from "react";
import { Fragment as S, jsx as C, jsxs as w } from "react/jsx-runtime";
//#region src/objects/ObjectHeader.tsx
var T = _(function({ type: t, title: n, objectId: r, status: c, meta: f, actions: p, compact: m = !1, headingLevel: h = m ? 2 : 1, typeHref: g, onTypeNavigate: _, className: v, style: y, ...b }, x) {
	let T = e(), { icon: E, color: D } = o(t), O = `h${h}`, k = !m && (c || f && f.length > 0);
	return /* @__PURE__ */ w("div", {
		...b,
		ref: x,
		className: i("mtc-object-header", v),
		"data-compact": m || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${D}-fg)`,
			...y
		},
		children: [
			/* @__PURE__ */ C(s, {
				icon: E,
				color: D,
				size: m ? 24 : 40
			}),
			/* @__PURE__ */ w("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ w("div", {
						className: "mtc-object-header-eyebrow",
						children: [g ? /* @__PURE__ */ C("a", {
							className: "mtc-object-header-type",
							href: g,
							onClick: a(_),
							children: t.label
						}) : /* @__PURE__ */ C("span", {
							className: "mtc-object-header-type",
							children: t.label
						}), r && /* @__PURE__ */ w(S, { children: [
							/* @__PURE__ */ C("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ C("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ C(l, {
								value: r,
								label: T("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ C(O, {
						className: "mtc-object-header-title",
						children: n
					}),
					m && c && /* @__PURE__ */ C("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ C(d, {
							tone: c.tone,
							children: c.label
						})
					}),
					k && /* @__PURE__ */ w("div", {
						className: "mtc-object-header-meta",
						children: [c && /* @__PURE__ */ C(d, {
							tone: c.tone,
							children: c.label
						}), f && f.length > 0 && /* @__PURE__ */ C(u, { items: f })]
					})
				]
			}),
			p && /* @__PURE__ */ C("div", {
				className: "mtc-object-header-actions",
				children: p
			})
		]
	});
}), E = _(function({ properties: a, title: o, filterable: s = !0, actions: l, emptyValue: u, now: d, density: h, labelWidth: _ = 160, onNavigate: T, headingLevel: E, className: D, style: O, ...k }, A) {
	let j = e(), { locale: M, timeZone: N } = r(), P = v(), F = b(null), [I, L] = x(!1), [R, z] = x(""), B = y(() => {
		let e = R.trim().toLowerCase();
		return e ? a.filter((t) => {
			let n = m(t.value, p(t.value, t.kind, t.format), {
				locale: M,
				timeZone: N
			});
			return t.label.toLowerCase().includes(e) || n.toLowerCase().includes(e);
		}) : a;
	}, [
		a,
		R,
		M,
		N
	]), V = y(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of B) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [B]), H = () => {
		I ? (z(""), L(!1)) : (L(!0), requestAnimationFrame(() => F.current?.focus()));
	};
	return /* @__PURE__ */ w(f, {
		...k,
		ref: A,
		title: o ?? j("propertyPanel.title"),
		subtitle: j("propertyPanel.count", {
			shown: B.length,
			total: a.length
		}),
		headingLevel: E,
		className: i("mtc-property-panel", h && `mtc-density-${h}`, D),
		style: {
			"--mtc-property-label-width": `${_}px`,
			...O
		},
		actions: (s || l) && /* @__PURE__ */ w(S, { children: [l, s && /* @__PURE__ */ C(n, {
			icon: /* @__PURE__ */ C(t, { name: "filter" }),
			"aria-label": j("propertyPanel.filter"),
			"aria-expanded": I,
			"aria-controls": I ? P : void 0,
			variant: I ? "outline" : "ghost",
			size: "small",
			onClick: H
		})] }),
		children: [I && /* @__PURE__ */ C("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ C(c, {
				ref: F,
				id: P,
				type: "search",
				size: "small",
				value: R,
				"aria-label": j("propertyPanel.filter"),
				placeholder: j("propertyPanel.filter"),
				onChange: (e) => z(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), H());
				}
			})
		}), B.length === 0 ? /* @__PURE__ */ C("p", {
			className: "mtc-property-panel-empty",
			children: j("propertyPanel.noMatch", { query: R.trim() })
		}) : V.map(([e, t]) => /* @__PURE__ */ w("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ C("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ C("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ w("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ w("dt", { children: [/* @__PURE__ */ C("span", { children: e.label }), e.description && /* @__PURE__ */ C("small", { children: e.description })] }), /* @__PURE__ */ C("dd", { children: /* @__PURE__ */ C(g, {
						value: e.value,
						kind: e.kind,
						format: e.format,
						tones: e.tones,
						emptyValue: u,
						now: d,
						onNavigate: T
					}) })]
				}, e.id))
			})]
		}, e || "_"))]
	});
});
//#endregion
//#region src/objects/LinkPanel.tsx
function D({ group: n }) {
	let r = e(), { icon: i, color: a } = o(n.targetType), c = n.direction === "incoming";
	return /* @__PURE__ */ w("div", {
		className: "mtc-link-relation",
		children: [
			c && /* @__PURE__ */ C(t, {
				name: "arrow-left",
				label: r("linkPanel.incoming"),
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ C("span", {
				className: "mtc-link-relation-name",
				children: n.relation
			}),
			!c && /* @__PURE__ */ C(t, {
				name: "arrow-right",
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ C(s, {
				icon: i,
				color: a,
				size: 16
			}),
			/* @__PURE__ */ C("span", {
				className: "mtc-link-relation-type",
				children: n.targetType.label
			}),
			/* @__PURE__ */ C("span", {
				className: "mtc-link-relation-count",
				children: n.count
			})
		]
	});
}
var O = _(function({ groups: t, title: n, subtitle: r, maxItems: o = 3, actions: s, onNavigate: c, headingLevel: l, className: u, ...d }, p) {
	let m = e(), g = t.reduce((e, t) => e + t.count, 0);
	return /* @__PURE__ */ C(f, {
		...d,
		ref: p,
		title: n ?? m("linkPanel.title"),
		subtitle: r ?? m("linkPanel.summary", {
			types: t.length,
			objects: g
		}),
		actions: s,
		headingLevel: l,
		className: i("mtc-link-panel", u),
		children: t.length === 0 ? /* @__PURE__ */ C("p", {
			className: "mtc-link-panel-empty",
			children: m("linkPanel.empty")
		}) : t.map((e) => {
			let t = e.items.slice(0, o), n = e.count > t.length;
			return /* @__PURE__ */ w("section", {
				className: "mtc-link-group",
				"aria-label": `${e.relation} ${e.targetType.label}`,
				children: [
					/* @__PURE__ */ C(D, { group: e }),
					t.length > 0 && /* @__PURE__ */ C("ul", {
						className: "mtc-link-items",
						children: t.map((e) => /* @__PURE__ */ w("li", {
							className: "mtc-link-item",
							children: [/* @__PURE__ */ C(h, {
								object: e,
								onNavigate: c,
								mono: e.mono,
								className: "mtc-link-item-chip"
							}), e.detail != null && /* @__PURE__ */ C("span", {
								className: "mtc-link-item-detail",
								children: e.detail
							})]
						}, e.id))
					}),
					n && (e.viewAllHref || e.onViewAll) && (e.viewAllHref ? /* @__PURE__ */ C("a", {
						className: "mtc-link-view-all",
						href: e.viewAllHref,
						onClick: a(e.onViewAll),
						children: e.viewAllLabel ?? m("linkPanel.viewAll", { count: e.count })
					}) : /* @__PURE__ */ C("button", {
						type: "button",
						className: "mtc-link-view-all",
						onClick: e.onViewAll,
						children: e.viewAllLabel ?? m("linkPanel.viewAll", { count: e.count })
					}))
				]
			}, e.id);
		})
	});
});
//#endregion
export { E as n, T as r, O as t };
