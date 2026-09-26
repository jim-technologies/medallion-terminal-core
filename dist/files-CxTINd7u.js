import { T as e, _ as t, b as n, h as r, p as i, w as a, y as o } from "./States-ggbm0c4k.js";
import { r as s, t as c } from "./utils-j4lJ7S1v.js";
import { d as l, f as u, m as d, n as f } from "./types-Dt7zb-eN.js";
import { c as p, i as m, n as h, p as g, s as _ } from "./DataGrid-BuzhglbG.js";
import { g as v, h as y, v as b, x, y as S } from "./sourceError-BK-F_Rp5.js";
import "./Pagination-Ba4KG2jM.js";
import { l as C } from "./FilePreview--JYWYX_D.js";
import "./NavRail-Bih5f5OE.js";
import { t as w } from "./layeredLayout-D0PMUE9A.js";
import { forwardRef as T, isValidElement as E, useEffect as D, useId as O, useLayoutEffect as k, useMemo as A, useRef as j, useState as M } from "react";
import { Fragment as N, jsx as P, jsxs as F } from "react/jsx-runtime";
//#region src/components/StatTile.tsx
var I = T(function({ label: t, value: n, unit: i, delta: a, status: o, description: s, icon: l, href: d, onNavigate: f, className: p, ...m }, h) {
	let g = e(), _ = /* @__PURE__ */ F(N, { children: [
		/* @__PURE__ */ F("div", {
			className: "mtc-stat-tile-top",
			children: [
				l,
				/* @__PURE__ */ P("span", {
					className: "mtc-stat-tile-label",
					children: t
				}),
				o && /* @__PURE__ */ P(x, {
					tone: o.tone,
					className: "mtc-stat-tile-status",
					children: o.label
				})
			]
		}),
		/* @__PURE__ */ F("div", {
			className: "mtc-stat-tile-value",
			children: [/* @__PURE__ */ P("span", { children: n }), i != null && /* @__PURE__ */ P("span", {
				className: "mtc-stat-tile-unit",
				children: i
			})]
		}),
		(a || s) && /* @__PURE__ */ F("div", {
			className: "mtc-stat-tile-foot",
			children: [a && /* @__PURE__ */ F("span", {
				className: "mtc-stat-tile-delta",
				"data-tone": a.tone ?? "neutral",
				children: [a.direction && /* @__PURE__ */ P(r, {
					name: "arrow-right",
					className: "mtc-stat-tile-arrow",
					"data-direction": a.direction,
					label: a.direction === "up" ? g("stat.increase") : g("stat.decrease")
				}), a.value]
			}), s && /* @__PURE__ */ P("span", {
				className: "mtc-stat-tile-description",
				children: s
			})]
		})
	] });
	return d ? /* @__PURE__ */ P("a", {
		...m,
		ref: h,
		href: d,
		className: c("mtc-stat-tile", p),
		"data-interactive": "true",
		onClick: u(f),
		children: _
	}) : /* @__PURE__ */ P("div", {
		...m,
		ref: h,
		className: c("mtc-stat-tile", p),
		children: _
	});
}), L = T(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ P("div", {
		...i,
		ref: a,
		className: c("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), R = T(function({ label: t, start: n, end: r, density: i, sticky: a, className: o, children: s, ...l }, u) {
	let d = e();
	return /* @__PURE__ */ F("div", {
		...l,
		ref: u,
		role: "toolbar",
		"aria-label": t ?? d("toolbar.label"),
		className: c("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			n && /* @__PURE__ */ P("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: n
			}),
			/* @__PURE__ */ P("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ P("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), z = T(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: l, ...u }, d) {
	let f = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...l
	};
	return /* @__PURE__ */ F("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: c("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: f,
		children: [
			t && /* @__PURE__ */ P("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ P("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ P("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), B = T(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: l, style: u, ...d }, f) {
	let p = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...u
	};
	return /* @__PURE__ */ F("aside", {
		...d,
		ref: f,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: c("mtc-inspector", s),
		"data-open": o,
		style: p,
		children: [
			(t || r) && /* @__PURE__ */ F("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ F("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ P("h2", { children: t }), n && /* @__PURE__ */ P("p", { children: n })]
				}), r && /* @__PURE__ */ P("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ P("div", {
				className: "mtc-inspector-content",
				children: l
			}),
			i && /* @__PURE__ */ P("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), V = T(function({ primary: t, secondary: n, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: l, minSize: u = 15, maxSize: d = 85, step: f = 5, disabled: p, stackOnNarrow: m = !0, separatorLabel: h, className: g, style: _, ...v }, y) {
	let b = e(), x = j(null), S = j(!1), [C, w] = s({
		value: a,
		defaultValue: o,
		onChange: l
	}), T = Math.min(u, d), E = Math.max(u, d), D = Number.isFinite(f) && f !== 0 ? Math.abs(f) : 1, O = H(C, T, E), k = (e) => {
		x.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
	}, A = (e) => {
		if (!S.current || !x.current || p) return;
		let t = x.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		w(H(a, T, E));
	}, M = (e) => w(H(O + e, T, E)), N = i === "start" ? O : 100 - O, I = 100 - N;
	return /* @__PURE__ */ F("div", {
		...v,
		ref: k,
		className: c("mtc-split-pane", g),
		"data-orientation": r,
		"data-stack-narrow": m,
		style: {
			"--mtc-split-start": `${N}fr`,
			"--mtc-split-end": `${I}fr`,
			..._
		},
		children: [
			/* @__PURE__ */ P("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? t : n
			}),
			/* @__PURE__ */ P("div", {
				role: "separator",
				"aria-label": h ?? b("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": T,
				"aria-valuemax": E,
				"aria-valuenow": Math.round(O),
				"aria-disabled": p || void 0,
				tabIndex: p ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					p || (S.current = !0, e.currentTarget.setPointerCapture(e.pointerId), A(e));
				},
				onPointerMove: A,
				onPointerUp: (e) => {
					S.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					S.current = !1;
				},
				onKeyDown: (e) => {
					if (p) return;
					let t = r === "horizontal" ? "ArrowLeft" : "ArrowUp", n = r === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === n) {
						e.preventDefault();
						let t = e.key === n ? D : -D;
						M(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), w(T)) : e.key === "End" && (e.preventDefault(), w(E));
				},
				children: /* @__PURE__ */ P("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ P("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? n : t
			})
		]
	});
});
function H(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var ee = T(function({ items: t, label: n, selectedId: i, onSelectionChange: a, expandedIds: o, onExpandedChange: s, density: l, className: u, ...d }, f) {
	let p = A(() => U(t, o), [t, o]), m = e(), h = j(/* @__PURE__ */ new Map()), [g, _] = M(i ?? p.find((e) => !e.item.disabled)?.item.id);
	D(() => {
		g && p.some((e) => e.item.id === g && !e.item.disabled) || _(i ?? p.find((e) => !e.item.disabled)?.item.id);
	}, [
		g,
		i,
		p
	]);
	let v = (e) => {
		e && (_(e), h.current.get(e)?.focus());
	}, y = (e, t) => {
		let n = new Set(o);
		t ? n.add(e) : n.delete(e), s(n);
	}, b = p.filter((e) => !e.item.disabled), x = (e, t) => {
		let n = b.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, i = o.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = b[Math.min(b.length - 1, Math.max(0, n + t))];
			v(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !i ? y(t.item.id, !0) : r && v(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && i ? y(t.item.id, !1) : v(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? b[0] : b[b.length - 1];
			v(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), a?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(o);
			for (let e of p.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			s(n);
		}
	};
	return /* @__PURE__ */ P("div", {
		...d,
		ref: f,
		role: "tree",
		"aria-label": n,
		"aria-multiselectable": !1,
		className: c("mtc-tree", l && `mtc-density-${l}`, u),
		children: p.map((e) => {
			let { item: t } = e, n = !!t.children?.length, s = o.has(t.id), c = i === t.id;
			return /* @__PURE__ */ F("div", {
				ref: (e) => {
					e ? h.current.set(t.id, e) : h.current.delete(t.id);
				},
				role: "treeitem",
				"aria-level": e.level,
				"aria-posinset": e.position,
				"aria-setsize": e.setSize,
				"aria-expanded": n ? s : void 0,
				"aria-selected": c,
				"aria-disabled": t.disabled || void 0,
				tabIndex: !t.disabled && g === t.id ? 0 : -1,
				className: "mtc-tree-item",
				"data-selected": c,
				"data-disabled": t.disabled || void 0,
				style: { "--mtc-tree-level": e.level },
				onFocus: () => _(t.id),
				onClick: () => {
					t.disabled || a?.(t.id);
				},
				onDoubleClick: () => {
					!t.disabled && n && y(t.id, !s);
				},
				onKeyDown: (t) => x(t, e),
				children: [
					/* @__PURE__ */ P("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": n ? m(s ? "tree.collapse" : "tree.expand", { label: te(t.label) }) : void 0,
						"aria-hidden": !n || void 0,
						disabled: !n || t.disabled,
						onClick: (e) => {
							e.stopPropagation(), n && y(t.id, !s);
						},
						children: n && /* @__PURE__ */ P(r, { name: "chevron-right" })
					}),
					t.icon && /* @__PURE__ */ P("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: t.icon
					}),
					/* @__PURE__ */ F("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ P("span", {
							className: "mtc-tree-label",
							children: t.label
						}), t.description && /* @__PURE__ */ P("span", {
							className: "mtc-tree-description",
							children: t.description
						})]
					})
				]
			}, t.id);
		})
	});
});
function U(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...U(o.children, t, n + 1, o.id, i)));
	}), a;
}
function te(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/workbench/PageHeader.tsx
var ne = T(function({ breadcrumbs: e, title: t, description: n, actions: r, tabs: i, sticky: a = !1, className: o, children: s, ...l }, u) {
	return /* @__PURE__ */ F("div", {
		...l,
		ref: u,
		className: c("mtc-page-header", o),
		"data-sticky": a || void 0,
		children: [
			e && e.length > 0 && /* @__PURE__ */ P(C, {
				items: e,
				className: "mtc-page-header-crumbs"
			}),
			/* @__PURE__ */ F("div", {
				className: "mtc-page-header-main",
				children: [/* @__PURE__ */ P("div", {
					className: "mtc-page-header-heading",
					children: s ?? /* @__PURE__ */ F(N, { children: [t && /* @__PURE__ */ P("h1", {
						className: "mtc-page-header-title",
						children: t
					}), n && /* @__PURE__ */ P("p", {
						className: "mtc-page-header-description",
						children: n
					})] })
				}), r && /* @__PURE__ */ P("div", {
					className: "mtc-page-header-actions",
					children: r
				})]
			}),
			i && /* @__PURE__ */ P("div", {
				className: "mtc-page-header-tabs",
				children: i
			})
		]
	});
}), re = T(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ P("dl", {
		...a,
		ref: o,
		className: c("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ F("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ F("dt", { children: [/* @__PURE__ */ P("span", { children: e.label }), e.description && /* @__PURE__ */ P("small", { children: e.description })] }), /* @__PURE__ */ P("dd", { children: E(e.value) ? e.value : /* @__PURE__ */ P(h, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), ie = T(function({ type: t, title: n, objectId: r, status: i, meta: a, actions: o, compact: s = !1, headingLevel: l = s ? 2 : 1, typeHref: p, onTypeNavigate: m, className: h, style: g, ..._ }, y) {
	let S = e(), { icon: C, color: w } = f(t), T = `h${l}`, E = !s && (i || a && a.length > 0);
	return /* @__PURE__ */ F("div", {
		..._,
		ref: y,
		className: c("mtc-object-header", h),
		"data-compact": s || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${w}-fg)`,
			...g
		},
		children: [
			/* @__PURE__ */ P(d, {
				icon: C,
				color: w,
				size: s ? 24 : 40
			}),
			/* @__PURE__ */ F("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ F("div", {
						className: "mtc-object-header-eyebrow",
						children: [p ? /* @__PURE__ */ P("a", {
							className: "mtc-object-header-type",
							href: p,
							onClick: u(m),
							children: t.label
						}) : /* @__PURE__ */ P("span", {
							className: "mtc-object-header-type",
							children: t.label
						}), r && /* @__PURE__ */ F(N, { children: [
							/* @__PURE__ */ P("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ P("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ P(v, {
								value: r,
								label: S("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ P(T, {
						className: "mtc-object-header-title",
						children: n
					}),
					s && i && /* @__PURE__ */ P("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ P(x, {
							tone: i.tone,
							children: i.label
						})
					}),
					E && /* @__PURE__ */ F("div", {
						className: "mtc-object-header-meta",
						children: [i && /* @__PURE__ */ P(x, {
							tone: i.tone,
							children: i.label
						}), a && a.length > 0 && /* @__PURE__ */ P(b, { items: a })]
					})
				]
			}),
			o && /* @__PURE__ */ P("div", {
				className: "mtc-object-header-actions",
				children: o
			})
		]
	});
}), ae = T(function({ properties: t, title: n, filterable: o = !0, actions: s, emptyValue: l, now: u, density: d, labelWidth: f = 160, onNavigate: p, headingLevel: v, className: y, style: b, ...x }, C) {
	let w = e(), { locale: T, timeZone: E } = a(), D = O(), k = j(null), [I, L] = M(!1), [R, z] = M(""), B = A(() => {
		let e = R.trim().toLowerCase();
		return e ? t.filter((t) => {
			let n = m(t.value, _(t.value, t.kind, t.format), {
				locale: T,
				timeZone: E
			});
			return t.label.toLowerCase().includes(e) || n.toLowerCase().includes(e);
		}) : t;
	}, [
		t,
		R,
		T,
		E
	]), V = A(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of B) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [B]), H = () => {
		I ? (z(""), L(!1)) : (L(!0), requestAnimationFrame(() => k.current?.focus()));
	};
	return /* @__PURE__ */ F(S, {
		...x,
		ref: C,
		title: n ?? w("propertyPanel.title"),
		subtitle: w("propertyPanel.count", {
			shown: B.length,
			total: t.length
		}),
		headingLevel: v,
		className: c("mtc-property-panel", d && `mtc-density-${d}`, y),
		style: {
			"--mtc-property-label-width": `${f}px`,
			...b
		},
		actions: (o || s) && /* @__PURE__ */ F(N, { children: [s, o && /* @__PURE__ */ P(i, {
			icon: /* @__PURE__ */ P(r, { name: "filter" }),
			"aria-label": w("propertyPanel.filter"),
			"aria-expanded": I,
			"aria-controls": I ? D : void 0,
			variant: I ? "outline" : "ghost",
			size: "small",
			onClick: H
		})] }),
		children: [I && /* @__PURE__ */ P("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ P(g, {
				ref: k,
				id: D,
				type: "search",
				size: "small",
				value: R,
				"aria-label": w("propertyPanel.filter"),
				placeholder: w("propertyPanel.filter"),
				onChange: (e) => z(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), H());
				}
			})
		}), B.length === 0 ? /* @__PURE__ */ P("p", {
			className: "mtc-property-panel-empty",
			children: w("propertyPanel.noMatch", { query: R.trim() })
		}) : V.map(([e, t]) => /* @__PURE__ */ F("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ P("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ P("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ F("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ F("dt", { children: [/* @__PURE__ */ P("span", { children: e.label }), e.description && /* @__PURE__ */ P("small", { children: e.description })] }), /* @__PURE__ */ P("dd", { children: /* @__PURE__ */ P(h, {
						value: e.value,
						kind: e.kind,
						format: e.format,
						tones: e.tones,
						emptyValue: l,
						now: u,
						onNavigate: p
					}) })]
				}, e.id))
			})]
		}, e || "_"))]
	});
}), oe = .4, se = 3, W = 1.25, ce = .8, G = {
	x: 0,
	y: 0,
	zoom: 1
};
function K({ label: t, width: n, height: a, viewHeight: o, children: s }) {
	let c = e(), l = j(null), u = j(null), d = j(null), [f, p] = M(0), [m, h] = M(G);
	k(() => {
		let e = l.current;
		if (!e) return;
		let t = () => p(e.clientWidth);
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let g = f || n, _ = Math.min(1, Math.max(ce, Math.min(g / n, o / a))) * m.zoom, v = (g - n * _) / 2 + m.x, y = (o - a * _) / 2 + m.y, b = (e) => h((t) => ({
		...t,
		zoom: Math.min(se, Math.max(oe, t.zoom * e))
	})), x = (e) => {
		e.target.closest("[data-graph-node]") || (d.current = {
			pointerId: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			offset: m
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, S = (e) => {
		let t = d.current;
		t && t.pointerId === e.pointerId && h({
			...t.offset,
			x: t.offset.x + e.clientX - t.x,
			y: t.offset.y + e.clientY - t.y
		});
	}, C = () => {
		d.current = null;
	};
	return /* @__PURE__ */ F("div", {
		ref: l,
		className: "mtc-graph-canvas",
		style: { height: o },
		children: [/* @__PURE__ */ P("svg", {
			ref: u,
			role: "group",
			"aria-label": t,
			width: g,
			height: o,
			viewBox: `0 0 ${g} ${o}`,
			className: "mtc-graph-svg",
			onPointerDown: x,
			onPointerMove: S,
			onPointerUp: C,
			onPointerCancel: C,
			onWheel: (e) => {
				(e.ctrlKey || e.metaKey) && (e.preventDefault(), b(e.deltaY < 0 ? W : 1 / W));
			},
			onKeyDown: (e) => {
				if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
				let t = [...u.current?.querySelectorAll("[data-graph-node]") ?? []], n = t.indexOf(document.activeElement);
				n < 0 || (e.preventDefault(), t[(n + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length]?.focus());
			},
			children: /* @__PURE__ */ P("g", {
				transform: `translate(${q(v)} ${q(y)}) scale(${q(_)})`,
				children: s
			})
		}), /* @__PURE__ */ F("div", {
			className: "mtc-graph-controls",
			children: [
				/* @__PURE__ */ P(i, {
					icon: /* @__PURE__ */ P(r, { name: "add" }),
					"aria-label": c("graph.zoomIn"),
					size: "small",
					onClick: () => b(W)
				}),
				/* @__PURE__ */ P(i, {
					icon: /* @__PURE__ */ P(r, { name: "minus" }),
					"aria-label": c("graph.zoomOut"),
					size: "small",
					onClick: () => b(1 / W)
				}),
				/* @__PURE__ */ P(i, {
					icon: /* @__PURE__ */ P(r, { name: "refresh" }),
					"aria-label": c("graph.reset"),
					size: "small",
					onClick: () => h(G)
				})
			]
		})]
	});
}
function q(e) {
	return Math.round(e * 1e3) / 1e3;
}
//#endregion
//#region src/objects/linkGraphLayout.ts
function le(e, t) {
	let n = e.map((e) => Math.min(e.items.length, Math.max(0, e.count))), r = (t) => t.reduce((t, n, r) => t + n + +(e[r].count > n), 0), i = [...n];
	for (; r(i) > t;) {
		let e = -1;
		for (let t = 0; t < i.length; t++) i[t] > 1 && (e < 0 || i[t] > i[e]) && (e = t);
		if (e < 0) break;
		--i[e];
	}
	return i;
}
var ue = 40, J = 120, Y = .6;
function de(e, t = 40) {
	let n = le(e, t), r = n.map((t, n) => t + +(e[n].count > t)), i = r.reduce((e, t) => e + t, 0);
	if (i === 0) return {
		nodes: [],
		labels: [],
		radius: J
	};
	let a = i + (e.length > 1 ? e.length * Y : 0), o = Math.max(J, i * ue / (2 * Math.PI)), s = 2 * Math.PI / a, c = [], l = [], u = Math.PI - (e.length > 1 ? Y * s / 2 : 0);
	return e.forEach((t, i) => {
		let a = r[i];
		if (a === 0) return;
		let d = u + (e.length > 1 ? Y * s / 2 : 0), f = (e) => d + (e + .5) * s, p = t.items.slice(0, n[i]);
		if (p.forEach((e, n) => {
			let r = f(n);
			c.push({
				key: `${t.id}:${e.id}`,
				kind: "item",
				groupIndex: i,
				x: Math.cos(r) * o,
				y: Math.sin(r) * o,
				angle: r,
				item: e
			});
		}), t.count > p.length) {
			let e = f(p.length);
			c.push({
				key: `${t.id}:more`,
				kind: "more",
				groupIndex: i,
				x: Math.cos(e) * o,
				y: Math.sin(e) * o,
				angle: e,
				moreCount: t.count - p.length
			});
		}
		let m = d + a / 2 * s;
		l.push({
			groupIndex: i,
			x: Math.cos(m) * o * .6,
			y: Math.sin(m) * o * .6,
			text: t.relation
		}), u = d + a * s + (e.length > 1 ? Y * s / 2 : 0);
	}), {
		nodes: c,
		labels: l,
		radius: o
	};
}
//#endregion
//#region src/objects/LinkGraph.tsx
var X = 24, fe = 40, pe = 150, me = 22, he = 16;
function ge(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function _e({ x: e, y: t, size: n, color: r, icon: i, center: a }) {
	return /* @__PURE__ */ F("g", {
		className: "mtc-graph-glyph",
		"data-center": a || void 0,
		style: r ? { color: `var(--mtc-type-${r}-fg)` } : void 0,
		children: [/* @__PURE__ */ P("rect", {
			x: e - n / 2,
			y: t - n / 2,
			width: n,
			height: n,
			rx: 4,
			fill: r ? `var(--mtc-type-${r}-bg)` : "var(--mtc-panel)"
		}), i]
	});
}
function ve({ center: t, groups: n, label: i, maxNodes: a = 40, height: o = 320, onNavigate: s }) {
	let c = e(), u = A(() => de(n, a), [n, a]), d = u.nodes.length > he, p = u.radius + X + pe, m = u.radius + X + 16, h = p * 2, g = m * 2, _ = p, v = m, y = t.type ? f(t.type) : null, b = (e) => {
		if (e.kind === "item" && e.item) return {
			object: e.item,
			href: e.item.href
		};
		let t = n[e.groupIndex];
		return t ? {
			object: {
				id: `${t.id}:all`,
				title: t.relation,
				type: t.targetType
			},
			href: t.viewAllHref
		} : null;
	}, x = (e, t) => (n) => {
		if (!s || !l(n)) {
			t || n.preventDefault();
			return;
		}
		n.preventDefault(), s(e, n);
	};
	return /* @__PURE__ */ F(K, {
		label: i,
		width: h,
		height: g,
		viewHeight: o,
		children: [
			/* @__PURE__ */ P("g", {
				className: "mtc-graph-edges",
				children: u.nodes.map((e) => /* @__PURE__ */ P("line", {
					x1: _,
					y1: v,
					x2: _ + e.x,
					y2: v + e.y,
					className: "mtc-graph-edge",
					"data-direction": n[e.groupIndex]?.direction ?? "outgoing"
				}, `edge:${e.key}`))
			}),
			u.labels.map((e) => /* @__PURE__ */ P("text", {
				x: _ + e.x,
				y: v + e.y,
				textAnchor: "middle",
				dominantBaseline: "middle",
				className: "mtc-graph-edge-label",
				children: ge(e.text, 18)
			}, `label:${e.groupIndex}`)),
			/* @__PURE__ */ P("g", {
				className: "mtc-graph-node",
				"data-center": "true",
				"aria-hidden": "true",
				children: /* @__PURE__ */ P(_e, {
					x: _,
					y: v,
					size: fe,
					center: !0,
					color: y?.color ?? null,
					icon: /* @__PURE__ */ P(r, {
						name: y?.icon ?? "object",
						x: _ - 11,
						y: v - 11,
						width: 22,
						height: 22,
						size: 22
					})
				})
			}),
			u.nodes.map((e) => {
				let t = b(e);
				if (!t) return null;
				let i = n[e.groupIndex], a = f(i.targetType), o = _ + e.x, l = v + e.y, u = Math.cos(e.angle), p = u >= 0, m = d, h = m ? p ? "start" : "end" : u > .25 ? "start" : u < -.25 ? "end" : "middle", g = m ? o + Math.cos(e.angle) * 20 : h === "start" ? o + 20 : h === "end" ? o - 20 : o, y = m ? l + Math.sin(e.angle) * 20 : h === "middle" ? l + (Math.sin(e.angle) > 0 ? 26 : -20) : l, S = m ? e.angle * 180 / Math.PI + (p ? 0 : 180) : 0, C = e.kind === "more" ? c("graph.more", { count: e.moreCount ?? 0 }) : e.item?.title ?? "", w = e.kind === "more" ? c("graph.moreLabel", {
					count: e.moreCount ?? 0,
					relation: i.relation,
					type: i.targetType.label
				}) : `${C}, ${i.relation}`, T = !!(t.href || s);
				return /* @__PURE__ */ F("a", {
					href: t.href,
					"data-graph-node": T || void 0,
					className: "mtc-graph-node",
					"data-kind": e.kind,
					"aria-label": w,
					role: t.href ? void 0 : T ? "link" : "img",
					tabIndex: t.href ? void 0 : T ? 0 : void 0,
					onClick: x(t.object, t.href),
					onKeyDown: T ? (e) => {
						e.key === "Enter" && (e.preventDefault(), s ? s(t.object, e) : e.currentTarget.dispatchEvent(new MouseEvent("click", {
							bubbles: !0,
							cancelable: !0
						})));
					} : void 0,
					children: [e.kind === "more" ? /* @__PURE__ */ F("g", {
						className: "mtc-graph-more",
						children: [/* @__PURE__ */ P("rect", {
							x: o - X / 2,
							y: l - X / 2,
							width: X,
							height: X,
							rx: X / 2
						}), /* @__PURE__ */ F("text", {
							x: o,
							y: l,
							textAnchor: "middle",
							dominantBaseline: "central",
							children: ["+", e.moreCount]
						})]
					}) : /* @__PURE__ */ P(_e, {
						x: o,
						y: l,
						size: X,
						color: a.color,
						icon: /* @__PURE__ */ P(r, {
							name: a.icon,
							x: o - 7,
							y: l - 7,
							width: 14,
							height: 14,
							size: 14,
							strokeWidth: 2
						})
					}), /* @__PURE__ */ P("text", {
						x: g,
						y,
						textAnchor: h,
						dominantBaseline: "middle",
						transform: S ? `rotate(${S.toFixed(2)} ${g.toFixed(2)} ${y.toFixed(2)})` : void 0,
						className: "mtc-graph-node-label",
						children: ge(C, me)
					})]
				}, e.key);
			})
		]
	});
}
//#endregion
//#region src/objects/LinkPanel.tsx
function ye({ group: t }) {
	let n = e(), { icon: i, color: a } = f(t.targetType), o = t.direction === "incoming";
	return /* @__PURE__ */ F("div", {
		className: "mtc-link-relation",
		children: [
			o && /* @__PURE__ */ P(r, {
				name: "arrow-left",
				label: n("linkPanel.incoming"),
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ P("span", {
				className: "mtc-link-relation-name",
				children: t.relation
			}),
			!o && /* @__PURE__ */ P(r, {
				name: "arrow-right",
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ P(d, {
				icon: i,
				color: a,
				size: 16
			}),
			/* @__PURE__ */ P("span", {
				className: "mtc-link-relation-type",
				children: t.targetType.label
			}),
			/* @__PURE__ */ P("span", {
				className: "mtc-link-relation-count",
				children: t.count
			})
		]
	});
}
var be = T(function({ groups: t, title: n, subtitle: r, maxItems: i = 3, actions: a, onNavigate: o, headingLevel: s, className: l, ...d }, f) {
	let m = e(), h = t.reduce((e, t) => e + t.count, 0);
	return /* @__PURE__ */ P(S, {
		...d,
		ref: f,
		title: n ?? m("linkPanel.title"),
		subtitle: r ?? m("linkPanel.summary", {
			types: t.length,
			objects: h
		}),
		actions: a,
		headingLevel: s,
		className: c("mtc-link-panel", l),
		children: t.length === 0 ? /* @__PURE__ */ P("p", {
			className: "mtc-link-panel-empty",
			children: m("linkPanel.empty")
		}) : t.map((e) => {
			let t = e.items.slice(0, i), n = e.count > t.length;
			return /* @__PURE__ */ F("section", {
				className: "mtc-link-group",
				"aria-label": `${e.relation} ${e.targetType.label}`,
				children: [
					/* @__PURE__ */ P(ye, { group: e }),
					t.length > 0 && /* @__PURE__ */ P("ul", {
						className: "mtc-link-items",
						children: t.map((e) => /* @__PURE__ */ F("li", {
							className: "mtc-link-item",
							children: [/* @__PURE__ */ P(p, {
								object: e,
								onNavigate: o,
								mono: e.mono,
								className: "mtc-link-item-chip"
							}), e.detail != null && /* @__PURE__ */ P("span", {
								className: "mtc-link-item-detail",
								children: e.detail
							})]
						}, e.id))
					}),
					n && (e.viewAllHref || e.onViewAll) && (e.viewAllHref ? /* @__PURE__ */ P("a", {
						className: "mtc-link-view-all",
						href: e.viewAllHref,
						onClick: u(e.onViewAll),
						children: e.viewAllLabel ?? m("linkPanel.viewAll", { count: e.count })
					}) : /* @__PURE__ */ P("button", {
						type: "button",
						className: "mtc-link-view-all",
						onClick: e.onViewAll,
						children: e.viewAllLabel ?? m("linkPanel.viewAll", { count: e.count })
					}))
				]
			}, e.id);
		})
	});
}), Z = 176, Q = 44, xe = 20, $ = 56;
function Se(e, t, n, r, i) {
	if (e === "right") {
		if (r > t) {
			let e = (r - t) / 2;
			return `M${t} ${n} C${t + e} ${n} ${r - e} ${i} ${r - 2} ${i}`;
		}
		let e = t - Z, a = r + Z;
		return `M${e} ${n} C${e - $} ${n} ${a + $} ${i} ${a + 2} ${i}`;
	}
	if (i > n) {
		let e = (i - n) / 2;
		return `M${t} ${n} C${t} ${n + e} ${r} ${i - e} ${r} ${i - 2}`;
	}
	let a = n - Q, o = i + Q;
	return `M${t} ${a} C${t} ${a - $} ${r} ${o + $} ${r} ${o + 2}`;
}
function Ce(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function we({ types: e, relations: t, label: n, selectedId: i, onSelect: s, height: c = 360, direction: u = "right" }) {
	let { locale: d } = a(), p = `mtc-schema-arrow-${O().replace(/[^a-zA-Z0-9_-]/g, "")}`, m = A(() => w(e, t, {
		nodeWidth: Z,
		nodeHeight: Q,
		rankGap: u === "right" ? 272 : 116,
		nodeGap: u === "right" ? 28 : 24,
		padding: 24,
		direction: u
	}), [
		e,
		t,
		u
	]);
	if (!m) return null;
	let h = (e) => (t) => {
		s && l(t) && (t.preventDefault(), s(e, t));
	};
	return /* @__PURE__ */ F(K, {
		label: n,
		width: m.width,
		height: m.height,
		viewHeight: c,
		children: [
			/* @__PURE__ */ P("defs", { children: /* @__PURE__ */ P("marker", {
				id: p,
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				markerUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ P("path", {
					d: "M0,0 L0,8 L8,4 z",
					className: "mtc-graph-arrow"
				})
			}) }),
			/* @__PURE__ */ P("g", {
				className: "mtc-graph-edges",
				children: m.edges.map(({ edge: e, x1: t, y1: n, x2: r, y2: a }, o) => {
					let s = Se(u, t, n, r, a), c = i !== void 0 && (e.from === i || e.to === i);
					return /* @__PURE__ */ F("g", { children: [/* @__PURE__ */ P("path", {
						d: s,
						className: "mtc-graph-edge",
						"data-active": c || void 0,
						markerEnd: `url(#${p})`
					}), /* @__PURE__ */ P("text", {
						x: (t + r) / 2,
						y: (n + a) / 2 - 6,
						textAnchor: "middle",
						className: "mtc-graph-edge-label",
						children: Ce(e.label, 18)
					})] }, e.id ?? `${e.from}:${e.to}:${o}`);
				})
			}),
			m.nodes.map(({ node: e, x: t, y: n }) => {
				let { icon: a, color: c } = f(e), l = e.id === i, u = !!(e.href || s), p = e.count === void 0 ? e.label : `${e.label}, ${o(e.count, { locale: d })}`;
				return /* @__PURE__ */ F("a", {
					href: e.href,
					role: e.href ? void 0 : u ? "button" : "img",
					tabIndex: e.href ? void 0 : u ? 0 : void 0,
					"aria-label": p,
					"aria-current": l || void 0,
					"data-graph-node": u || void 0,
					"data-selected": l || void 0,
					className: "mtc-graph-node mtc-schema-node",
					onClick: h(e),
					onKeyDown: u ? (t) => {
						(t.key === "Enter" || t.key === " " && !e.href) && (t.preventDefault(), s ? s(e, t) : t.currentTarget.dispatchEvent(new MouseEvent("click", {
							bubbles: !0,
							cancelable: !0
						})));
					} : void 0,
					children: [
						/* @__PURE__ */ P("rect", {
							x: t,
							y: n,
							width: Z,
							height: Q,
							rx: 4,
							className: "mtc-schema-node-box"
						}),
						/* @__PURE__ */ F("g", {
							style: { color: `var(--mtc-type-${c}-fg)` },
							children: [/* @__PURE__ */ P("rect", {
								x: t + 10,
								y: n + 10,
								width: 24,
								height: 24,
								rx: 4,
								fill: `var(--mtc-type-${c}-bg)`
							}), /* @__PURE__ */ P(r, {
								name: a,
								x: t + 15,
								y: n + 15,
								width: 14,
								height: 14,
								size: 14,
								strokeWidth: 2
							})]
						}),
						/* @__PURE__ */ P("text", {
							x: t + 44,
							y: e.count === void 0 ? n + Q / 2 : n + 18,
							dominantBaseline: "middle",
							className: "mtc-graph-node-label",
							"data-emphasis": "true",
							children: Ce(e.label, xe)
						}),
						e.count !== void 0 && /* @__PURE__ */ P("text", {
							x: t + 44,
							y: n + 32,
							dominantBaseline: "middle",
							className: "mtc-graph-node-meta",
							children: o(e.count, { locale: d })
						})
					]
				}, e.id);
			})
		]
	});
}
//#endregion
//#region src/objects/ActivityFeed.tsx
function Te(e) {
	let t = e instanceof Date ? e : new Date(e);
	return Number.isNaN(t.getTime()) ? String(e) : t.toISOString();
}
var Ee = T(function({ items: r, variant: i = "feed", now: o, onNavigate: s, emptyLabel: l, className: u, ...d }, f) {
	let m = e(), { locale: h, timeZone: g } = a();
	return r.length === 0 ? /* @__PURE__ */ P("p", {
		className: "mtc-activity-empty",
		children: l ?? m("activity.empty")
	}) : /* @__PURE__ */ P("ol", {
		...d,
		ref: f,
		className: c("mtc-activity-feed", u),
		"data-variant": i,
		children: r.map((e) => {
			let r = Te(e.timestamp), a = t(e.timestamp, {
				locale: h,
				timeZone: g
			});
			return /* @__PURE__ */ F("li", {
				className: "mtc-activity-item",
				"data-tone": e.tone ?? "neutral",
				children: [
					i === "timeline" ? /* @__PURE__ */ P("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}) : e.actor ? /* @__PURE__ */ P(y, {
						name: e.actor.name,
						src: e.actor.avatarSrc,
						decorative: !0
					}) : /* @__PURE__ */ P("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ F("p", {
						className: "mtc-activity-text",
						children: [
							e.actor && /* @__PURE__ */ P("span", {
								className: "mtc-activity-actor",
								children: e.actor.name
							}),
							" ",
							/* @__PURE__ */ P("span", {
								className: "mtc-activity-verb",
								children: e.verb
							}),
							e.object && /* @__PURE__ */ F(N, { children: [" ", /* @__PURE__ */ P(p, {
								object: e.object,
								onNavigate: s
							})] }),
							e.summary != null && /* @__PURE__ */ F(N, { children: [" ", /* @__PURE__ */ P("span", {
								className: "mtc-activity-summary",
								children: e.summary
							})] })
						]
					}),
					/* @__PURE__ */ P("time", {
						className: "mtc-activity-time",
						dateTime: r,
						title: i === "timeline" ? r : a,
						children: i === "timeline" ? a : n(e.timestamp, {
							locale: h,
							now: o ?? Date.now()
						})
					})
				]
			}, e.id);
		})
	});
}), De = T(function({ label: t, groups: n, onChange: i, onClear: s, className: l, ...u }, p) {
	let m = e(), { locale: h } = a(), [g, _] = M(/* @__PURE__ */ new Set()), v = n.some((e) => e.selected.length > 0);
	return /* @__PURE__ */ F("div", {
		...u,
		ref: p,
		role: "group",
		"aria-label": t,
		className: c("mtc-facet-list", l),
		children: [s && v && /* @__PURE__ */ P("div", {
			className: "mtc-facet-list-header",
			children: /* @__PURE__ */ P("button", {
				type: "button",
				className: "mtc-facet-clear",
				onClick: s,
				children: m("facet.clear")
			})
		}), n.map((e) => {
			let t = e.maxVisible ?? 8, n = g.has(e.id), a = e.options.length - t, s = n || a <= 0 ? e.options : e.options.slice(0, t), c = `mtc-facet-${e.id}`;
			return /* @__PURE__ */ F("fieldset", {
				className: "mtc-facet-group",
				children: [
					/* @__PURE__ */ P("legend", {
						className: "mtc-facet-legend",
						children: e.label
					}),
					/* @__PURE__ */ P("div", {
						className: "mtc-facet-options",
						children: s.map((t) => {
							let n = e.selected.includes(t.value), a = t.type ? f(t.type) : null;
							return /* @__PURE__ */ F("label", {
								className: "mtc-facet-option",
								"data-mode": e.mode,
								"data-checked": n || void 0,
								children: [
									/* @__PURE__ */ P("input", {
										type: e.mode === "single" ? "radio" : "checkbox",
										name: c,
										value: t.value,
										checked: n,
										className: e.mode === "single" ? "mtc-visually-hidden" : "mtc-facet-checkbox",
										onChange: () => {
											e.mode === "single" ? i(e.id, [t.value]) : i(e.id, n ? e.selected.filter((e) => e !== t.value) : [...e.selected, t.value]);
										}
									}),
									a ? /* @__PURE__ */ P(d, {
										icon: a.icon,
										color: a.color,
										size: 16
									}) : t.icon ? /* @__PURE__ */ P(r, {
										name: t.icon,
										className: "mtc-facet-icon"
									}) : null,
									/* @__PURE__ */ P("span", {
										className: "mtc-facet-label",
										children: t.label
									}),
									t.count !== void 0 && /* @__PURE__ */ P("span", {
										className: "mtc-facet-count",
										children: o(t.count, { locale: h })
									})
								]
							}, t.value);
						})
					}),
					a > 0 && /* @__PURE__ */ P("button", {
						type: "button",
						className: "mtc-facet-more",
						"aria-expanded": n,
						onClick: () => _((t) => {
							let r = new Set(t);
							return n ? r.delete(e.id) : r.add(e.id), r;
						}),
						children: n ? m("facet.showLess") : m("facet.showMore", { count: a })
					})
				]
			}, e.id);
		})]
	});
});
//#endregion
export { ve as a, re as c, V as d, L as f, I as g, R as h, be as i, ne as l, z as m, Ee as n, ae as o, B as p, we as r, ie as s, De as t, ee as u };
