import { T as e, _ as t, b as n, h as r, p as i, w as a, y as o } from "./States-Ds3cxTem.js";
import { r as s, t as c } from "./utils-j4lJ7S1v.js";
import { i as l, n as u, o as d, r as f } from "./types-Ds11x4VM.js";
import { s as p, t as m } from "./PropertyValue-BtibYjWJ.js";
import { h, x as g } from "./sourceError-BwpI_4dr.js";
import "./Pagination-tCTZ9nS0.js";
import { l as _, u as v } from "./FilePreview-UlYHT2ft.js";
import "./Overlays-_7OI9Emq.js";
import "./DataGrid-BVxWg9u8.js";
import "./NavRail-COtjELlH.js";
import { r as y } from "./LinkPanel-DfpnIAMt.js";
import { t as b } from "./layeredLayout-D0PMUE9A.js";
import { forwardRef as x, isValidElement as S, useEffect as C, useId as w, useLayoutEffect as T, useMemo as E, useRef as D, useState as O } from "react";
import { Fragment as k, jsx as A, jsxs as j } from "react/jsx-runtime";
//#region src/components/StatTile.tsx
var M = x(function({ label: t, value: n, unit: i, delta: a, status: o, description: s, icon: u, href: d, onNavigate: f, className: p, ...m }, h) {
	let _ = e(), v = /* @__PURE__ */ j(k, { children: [
		/* @__PURE__ */ j("div", {
			className: "mtc-stat-tile-top",
			children: [
				u,
				/* @__PURE__ */ A("span", {
					className: "mtc-stat-tile-label",
					children: t
				}),
				o && /* @__PURE__ */ A(g, {
					tone: o.tone,
					className: "mtc-stat-tile-status",
					children: o.label
				})
			]
		}),
		/* @__PURE__ */ j("div", {
			className: "mtc-stat-tile-value",
			children: [/* @__PURE__ */ A("span", { children: n }), i != null && /* @__PURE__ */ A("span", {
				className: "mtc-stat-tile-unit",
				children: i
			})]
		}),
		(a || s) && /* @__PURE__ */ j("div", {
			className: "mtc-stat-tile-foot",
			children: [a && /* @__PURE__ */ j("span", {
				className: "mtc-stat-tile-delta",
				"data-tone": a.tone ?? "neutral",
				children: [a.direction && /* @__PURE__ */ A(r, {
					name: "arrow-right",
					className: "mtc-stat-tile-arrow",
					"data-direction": a.direction,
					label: a.direction === "up" ? _("stat.increase") : _("stat.decrease")
				}), a.value]
			}), s && /* @__PURE__ */ A("span", {
				className: "mtc-stat-tile-description",
				children: s
			})]
		})
	] });
	return d ? /* @__PURE__ */ A("a", {
		...m,
		ref: h,
		href: d,
		className: c("mtc-stat-tile", p),
		"data-interactive": "true",
		onClick: l(f),
		children: v
	}) : /* @__PURE__ */ A("div", {
		...m,
		ref: h,
		className: c("mtc-stat-tile", p),
		children: v
	});
}), N = x(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ A("div", {
		...i,
		ref: a,
		className: c("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), P = x(function({ label: t, start: n, end: r, density: i, sticky: a, className: o, children: s, ...l }, u) {
	let d = e();
	return /* @__PURE__ */ j("div", {
		...l,
		ref: u,
		role: "toolbar",
		"aria-label": t ?? d("toolbar.label"),
		className: c("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			n && /* @__PURE__ */ A("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: n
			}),
			/* @__PURE__ */ A("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ A("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), F = x(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: l, ...u }, d) {
	let f = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...l
	};
	return /* @__PURE__ */ j("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: c("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: f,
		children: [
			t && /* @__PURE__ */ A("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ A("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ A("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), I = x(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: l, style: u, ...d }, f) {
	let p = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...u
	};
	return /* @__PURE__ */ j("aside", {
		...d,
		ref: f,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: c("mtc-inspector", s),
		"data-open": o,
		style: p,
		children: [
			(t || r) && /* @__PURE__ */ j("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ j("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ A("h2", { children: t }), n && /* @__PURE__ */ A("p", { children: n })]
				}), r && /* @__PURE__ */ A("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ A("div", {
				className: "mtc-inspector-content",
				children: l
			}),
			i && /* @__PURE__ */ A("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), ee = x(function({ primary: t, secondary: n, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: l, minSize: u = 15, maxSize: d = 85, step: f = 5, disabled: p, stackOnNarrow: m = !0, separatorLabel: h, className: g, style: _, ...v }, y) {
	let b = e(), x = D(null), S = D(!1), [C, w] = s({
		value: a,
		defaultValue: o,
		onChange: l
	}), T = Math.min(u, d), E = Math.max(u, d), O = Number.isFinite(f) && f !== 0 ? Math.abs(f) : 1, k = L(C, T, E), M = (e) => {
		x.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
	}, N = (e) => {
		if (!S.current || !x.current || p) return;
		let t = x.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		w(L(a, T, E));
	}, P = (e) => w(L(k + e, T, E)), F = i === "start" ? k : 100 - k, I = 100 - F;
	return /* @__PURE__ */ j("div", {
		...v,
		ref: M,
		className: c("mtc-split-pane", g),
		"data-orientation": r,
		"data-stack-narrow": m,
		style: {
			"--mtc-split-start": `${F}fr`,
			"--mtc-split-end": `${I}fr`,
			..._
		},
		children: [
			/* @__PURE__ */ A("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? t : n
			}),
			/* @__PURE__ */ A("div", {
				role: "separator",
				"aria-label": h ?? b("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": T,
				"aria-valuemax": E,
				"aria-valuenow": Math.round(k),
				"aria-disabled": p || void 0,
				tabIndex: p ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					p || (S.current = !0, e.currentTarget.setPointerCapture(e.pointerId), N(e));
				},
				onPointerMove: N,
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
						let t = e.key === n ? O : -O;
						P(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), w(T)) : e.key === "End" && (e.preventDefault(), w(E));
				},
				children: /* @__PURE__ */ A("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ A("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? n : t
			})
		]
	});
});
function L(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var te = x(function({ items: t, label: n, selectedId: i, onSelectionChange: a, expandedIds: o, onExpandedChange: s, density: l, className: u, ...d }, f) {
	let p = E(() => R(t, o), [t, o]), m = e(), h = D(/* @__PURE__ */ new Map()), [g, _] = O(i ?? p.find((e) => !e.item.disabled)?.item.id);
	C(() => {
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
	return /* @__PURE__ */ A("div", {
		...d,
		ref: f,
		role: "tree",
		"aria-label": n,
		"aria-multiselectable": !1,
		className: c("mtc-tree", l && `mtc-density-${l}`, u),
		children: p.map((e) => {
			let { item: t } = e, n = !!t.children?.length, s = o.has(t.id), c = i === t.id;
			return /* @__PURE__ */ j("div", {
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
					/* @__PURE__ */ A("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": n ? m(s ? "tree.collapse" : "tree.expand", { label: ne(t.label) }) : void 0,
						"aria-hidden": !n || void 0,
						disabled: !n || t.disabled,
						onClick: (e) => {
							e.stopPropagation(), n && y(t.id, !s);
						},
						children: n && /* @__PURE__ */ A(r, { name: "chevron-right" })
					}),
					t.icon && /* @__PURE__ */ A("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: t.icon
					}),
					/* @__PURE__ */ j("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ A("span", {
							className: "mtc-tree-label",
							children: t.label
						}), t.description && /* @__PURE__ */ A("span", {
							className: "mtc-tree-description",
							children: t.description
						})]
					})
				]
			}, t.id);
		})
	});
});
function R(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...R(o.children, t, n + 1, o.id, i)));
	}), a;
}
function ne(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/workbench/PageHeader.tsx
var z = x(function({ breadcrumbs: e, title: t, description: n, actions: r, tabs: i, sticky: a = !1, className: o, children: s, ...l }, u) {
	return /* @__PURE__ */ j("div", {
		...l,
		ref: u,
		className: c("mtc-page-header", o),
		"data-sticky": a || void 0,
		children: [
			e && e.length > 0 && /* @__PURE__ */ A(_, {
				items: e,
				className: "mtc-page-header-crumbs"
			}),
			/* @__PURE__ */ j("div", {
				className: "mtc-page-header-main",
				children: [/* @__PURE__ */ A("div", {
					className: "mtc-page-header-heading",
					children: s ?? /* @__PURE__ */ j(k, { children: [t && /* @__PURE__ */ A("h1", {
						className: "mtc-page-header-title",
						children: t
					}), n && /* @__PURE__ */ A("p", {
						className: "mtc-page-header-description",
						children: n
					})] })
				}), r && /* @__PURE__ */ A("div", {
					className: "mtc-page-header-actions",
					children: r
				})]
			}),
			i && /* @__PURE__ */ A("div", {
				className: "mtc-page-header-tabs",
				children: i
			})
		]
	});
}), B = x(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ A("dl", {
		...a,
		ref: o,
		className: c("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ j("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ j("dt", { children: [/* @__PURE__ */ A("span", { children: e.label }), e.description && /* @__PURE__ */ A("small", { children: e.description })] }), /* @__PURE__ */ A("dd", { children: S(e.value) ? e.value : /* @__PURE__ */ A(m, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), re = .4, ie = 3, V = 1.25, ae = .8, H = {
	x: 0,
	y: 0,
	zoom: 1
};
function U({ label: t, width: n, height: a, viewHeight: o, children: s }) {
	let c = e(), l = D(null), u = D(null), d = D(null), [f, p] = O(0), [m, h] = O(H);
	T(() => {
		let e = l.current;
		if (!e) return;
		let t = () => p(e.clientWidth);
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let g = f || n, _ = Math.min(1, Math.max(ae, Math.min(g / n, o / a))) * m.zoom, v = (g - n * _) / 2 + m.x, y = (o - a * _) / 2 + m.y, b = (e) => h((t) => ({
		...t,
		zoom: Math.min(ie, Math.max(re, t.zoom * e))
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
	return /* @__PURE__ */ j("div", {
		ref: l,
		className: "mtc-graph-canvas",
		style: { height: o },
		children: [/* @__PURE__ */ A("svg", {
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
				(e.ctrlKey || e.metaKey) && (e.preventDefault(), b(e.deltaY < 0 ? V : 1 / V));
			},
			onKeyDown: (e) => {
				if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
				let t = [...u.current?.querySelectorAll("[data-graph-node]") ?? []], n = t.indexOf(document.activeElement);
				n < 0 || (e.preventDefault(), t[(n + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length]?.focus());
			},
			children: /* @__PURE__ */ A("g", {
				transform: `translate(${W(v)} ${W(y)}) scale(${W(_)})`,
				children: s
			})
		}), /* @__PURE__ */ j("div", {
			className: "mtc-graph-controls",
			children: [
				/* @__PURE__ */ A(i, {
					icon: /* @__PURE__ */ A(r, { name: "add" }),
					"aria-label": c("graph.zoomIn"),
					size: "small",
					onClick: () => b(V)
				}),
				/* @__PURE__ */ A(i, {
					icon: /* @__PURE__ */ A(r, { name: "minus" }),
					"aria-label": c("graph.zoomOut"),
					size: "small",
					onClick: () => b(1 / V)
				}),
				/* @__PURE__ */ A(i, {
					icon: /* @__PURE__ */ A(r, { name: "refresh" }),
					"aria-label": c("graph.reset"),
					size: "small",
					onClick: () => h(H)
				})
			]
		})]
	});
}
function W(e) {
	return Math.round(e * 1e3) / 1e3;
}
//#endregion
//#region src/objects/linkGraphLayout.ts
function oe(e, t) {
	let n = e.map((e) => Math.min(e.items.length, Math.max(0, e.count))), r = (t) => t.reduce((t, n, r) => t + n + +(e[r].count > n), 0), i = [...n];
	for (; r(i) > t;) {
		let e = -1;
		for (let t = 0; t < i.length; t++) i[t] > 1 && (e < 0 || i[t] > i[e]) && (e = t);
		if (e < 0) break;
		--i[e];
	}
	return i;
}
var se = 40, G = 120, K = .6;
function ce(e, t = 40) {
	let n = oe(e, t), r = n.map((t, n) => t + +(e[n].count > t)), i = r.reduce((e, t) => e + t, 0);
	if (i === 0) return {
		nodes: [],
		labels: [],
		radius: G
	};
	let a = i + (e.length > 1 ? e.length * K : 0), o = Math.max(G, i * se / (2 * Math.PI)), s = 2 * Math.PI / a, c = [], l = [], u = Math.PI - (e.length > 1 ? K * s / 2 : 0);
	return e.forEach((t, i) => {
		let a = r[i];
		if (a === 0) return;
		let d = u + (e.length > 1 ? K * s / 2 : 0), f = (e) => d + (e + .5) * s, p = t.items.slice(0, n[i]);
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
		}), u = d + a * s + (e.length > 1 ? K * s / 2 : 0);
	}), {
		nodes: c,
		labels: l,
		radius: o
	};
}
//#endregion
//#region src/objects/LinkGraph.tsx
var q = 24, le = 40, ue = 150, de = 22, fe = 16;
function J(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Y({ x: e, y: t, size: n, color: r, icon: i, center: a }) {
	return /* @__PURE__ */ j("g", {
		className: "mtc-graph-glyph",
		"data-center": a || void 0,
		style: r ? { color: `var(--mtc-type-${r}-fg)` } : void 0,
		children: [/* @__PURE__ */ A("rect", {
			x: e - n / 2,
			y: t - n / 2,
			width: n,
			height: n,
			rx: 4,
			fill: r ? `var(--mtc-type-${r}-bg)` : "var(--mtc-panel)"
		}), i]
	});
}
function pe({ center: t, groups: n, label: i, maxNodes: a = 40, height: o = 320, onNavigate: s }) {
	let c = e(), l = E(() => ce(n, a), [n, a]), d = l.nodes.length > fe, p = l.radius + q + ue, m = l.radius + q + 16, h = p * 2, g = m * 2, _ = p, v = m, y = t.type ? u(t.type) : null, b = (e) => {
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
		if (!s || !f(n)) {
			t || n.preventDefault();
			return;
		}
		n.preventDefault(), s(e, n);
	};
	return /* @__PURE__ */ j(U, {
		label: i,
		width: h,
		height: g,
		viewHeight: o,
		children: [
			/* @__PURE__ */ A("g", {
				className: "mtc-graph-edges",
				children: l.nodes.map((e) => /* @__PURE__ */ A("line", {
					x1: _,
					y1: v,
					x2: _ + e.x,
					y2: v + e.y,
					className: "mtc-graph-edge",
					"data-direction": n[e.groupIndex]?.direction ?? "outgoing"
				}, `edge:${e.key}`))
			}),
			l.labels.map((e) => /* @__PURE__ */ A("text", {
				x: _ + e.x,
				y: v + e.y,
				textAnchor: "middle",
				dominantBaseline: "middle",
				className: "mtc-graph-edge-label",
				children: J(e.text, 18)
			}, `label:${e.groupIndex}`)),
			/* @__PURE__ */ A("g", {
				className: "mtc-graph-node",
				"data-center": "true",
				"aria-hidden": "true",
				children: /* @__PURE__ */ A(Y, {
					x: _,
					y: v,
					size: le,
					center: !0,
					color: y?.color ?? null,
					icon: /* @__PURE__ */ A(r, {
						name: y?.icon ?? "object",
						x: _ - 11,
						y: v - 11,
						width: 22,
						height: 22,
						size: 22
					})
				})
			}),
			l.nodes.map((e) => {
				let t = b(e);
				if (!t) return null;
				let i = n[e.groupIndex], a = u(i.targetType), o = _ + e.x, l = v + e.y, f = Math.cos(e.angle), p = f >= 0, m = d, h = m ? p ? "start" : "end" : f > .25 ? "start" : f < -.25 ? "end" : "middle", g = m ? o + Math.cos(e.angle) * 20 : h === "start" ? o + 20 : h === "end" ? o - 20 : o, y = m ? l + Math.sin(e.angle) * 20 : h === "middle" ? l + (Math.sin(e.angle) > 0 ? 26 : -20) : l, S = m ? e.angle * 180 / Math.PI + (p ? 0 : 180) : 0, C = e.kind === "more" ? c("graph.more", { count: e.moreCount ?? 0 }) : e.item?.title ?? "", w = e.kind === "more" ? c("graph.moreLabel", {
					count: e.moreCount ?? 0,
					relation: i.relation,
					type: i.targetType.label
				}) : `${C}, ${i.relation}`, T = !!(t.href || s);
				return /* @__PURE__ */ j("a", {
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
					children: [e.kind === "more" ? /* @__PURE__ */ j("g", {
						className: "mtc-graph-more",
						children: [/* @__PURE__ */ A("rect", {
							x: o - q / 2,
							y: l - q / 2,
							width: q,
							height: q,
							rx: q / 2
						}), /* @__PURE__ */ j("text", {
							x: o,
							y: l,
							textAnchor: "middle",
							dominantBaseline: "central",
							children: ["+", e.moreCount]
						})]
					}) : /* @__PURE__ */ A(Y, {
						x: o,
						y: l,
						size: q,
						color: a.color,
						icon: /* @__PURE__ */ A(r, {
							name: a.icon,
							x: o - 7,
							y: l - 7,
							width: 14,
							height: 14,
							size: 14,
							strokeWidth: 2
						})
					}), /* @__PURE__ */ A("text", {
						x: g,
						y,
						textAnchor: h,
						dominantBaseline: "middle",
						transform: S ? `rotate(${S.toFixed(2)} ${g.toFixed(2)} ${y.toFixed(2)})` : void 0,
						className: "mtc-graph-node-label",
						children: J(C, de)
					})]
				}, e.key);
			})
		]
	});
}
//#endregion
//#region src/objects/SchemaGraph.tsx
var X = 176, Z = 44, me = 20, Q = 56;
function he(e, t, n, r, i) {
	if (e === "right") {
		if (r > t) {
			let e = (r - t) / 2;
			return `M${t} ${n} C${t + e} ${n} ${r - e} ${i} ${r - 2} ${i}`;
		}
		let e = t - X, a = r + X;
		return `M${e} ${n} C${e - Q} ${n} ${a + Q} ${i} ${a + 2} ${i}`;
	}
	if (i > n) {
		let e = (i - n) / 2;
		return `M${t} ${n} C${t} ${n + e} ${r} ${i - e} ${r} ${i - 2}`;
	}
	let a = n - Z, o = i + Z;
	return `M${t} ${a} C${t} ${a - Q} ${r} ${o + Q} ${r} ${o + 2}`;
}
function $(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function ge({ types: e, relations: t, label: n, selectedId: i, onSelect: s, height: c = 360, direction: l = "right" }) {
	let { locale: d } = a(), p = `mtc-schema-arrow-${w().replace(/[^a-zA-Z0-9_-]/g, "")}`, m = E(() => b(e, t, {
		nodeWidth: X,
		nodeHeight: Z,
		rankGap: l === "right" ? 272 : 116,
		nodeGap: l === "right" ? 28 : 24,
		padding: 24,
		direction: l
	}), [
		e,
		t,
		l
	]);
	if (!m) return null;
	let h = (e) => (t) => {
		s && f(t) && (t.preventDefault(), s(e, t));
	};
	return /* @__PURE__ */ j(U, {
		label: n,
		width: m.width,
		height: m.height,
		viewHeight: c,
		children: [
			/* @__PURE__ */ A("defs", { children: /* @__PURE__ */ A("marker", {
				id: p,
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				markerUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ A("path", {
					d: "M0,0 L0,8 L8,4 z",
					className: "mtc-graph-arrow"
				})
			}) }),
			/* @__PURE__ */ A("g", {
				className: "mtc-graph-edges",
				children: m.edges.map(({ edge: e, x1: t, y1: n, x2: r, y2: a }, o) => {
					let s = he(l, t, n, r, a), c = i !== void 0 && (e.from === i || e.to === i);
					return /* @__PURE__ */ j("g", { children: [/* @__PURE__ */ A("path", {
						d: s,
						className: "mtc-graph-edge",
						"data-active": c || void 0,
						markerEnd: `url(#${p})`
					}), /* @__PURE__ */ A("text", {
						x: (t + r) / 2,
						y: (n + a) / 2 - 6,
						textAnchor: "middle",
						className: "mtc-graph-edge-label",
						children: $(e.label, 18)
					})] }, e.id ?? `${e.from}:${e.to}:${o}`);
				})
			}),
			m.nodes.map(({ node: e, x: t, y: n }) => {
				let { icon: a, color: c } = u(e), l = e.id === i, f = !!(e.href || s), p = e.count === void 0 ? e.label : `${e.label}, ${o(e.count, { locale: d })}`;
				return /* @__PURE__ */ j("a", {
					href: e.href,
					role: e.href ? void 0 : f ? "button" : "img",
					tabIndex: e.href ? void 0 : f ? 0 : void 0,
					"aria-label": p,
					"aria-current": l || void 0,
					"data-graph-node": f || void 0,
					"data-selected": l || void 0,
					className: "mtc-graph-node mtc-schema-node",
					onClick: h(e),
					onKeyDown: f ? (t) => {
						(t.key === "Enter" || t.key === " " && !e.href) && (t.preventDefault(), s ? s(e, t) : t.currentTarget.dispatchEvent(new MouseEvent("click", {
							bubbles: !0,
							cancelable: !0
						})));
					} : void 0,
					children: [
						/* @__PURE__ */ A("rect", {
							x: t,
							y: n,
							width: X,
							height: Z,
							rx: 4,
							className: "mtc-schema-node-box"
						}),
						/* @__PURE__ */ j("g", {
							style: { color: `var(--mtc-type-${c}-fg)` },
							children: [/* @__PURE__ */ A("rect", {
								x: t + 10,
								y: n + 10,
								width: 24,
								height: 24,
								rx: 4,
								fill: `var(--mtc-type-${c}-bg)`
							}), /* @__PURE__ */ A(r, {
								name: a,
								x: t + 15,
								y: n + 15,
								width: 14,
								height: 14,
								size: 14,
								strokeWidth: 2
							})]
						}),
						/* @__PURE__ */ A("text", {
							x: t + 44,
							y: e.count === void 0 ? n + Z / 2 : n + 18,
							dominantBaseline: "middle",
							className: "mtc-graph-node-label",
							"data-emphasis": "true",
							children: $(e.label, me)
						}),
						e.count !== void 0 && /* @__PURE__ */ A("text", {
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
function _e(e) {
	let t = e instanceof Date ? e : new Date(e);
	return Number.isNaN(t.getTime()) ? String(e) : t.toISOString();
}
var ve = x(function({ items: r, variant: i = "feed", now: o, onNavigate: s, emptyLabel: l, className: u, ...d }, f) {
	let m = e(), { locale: g, timeZone: _ } = a();
	return r.length === 0 ? /* @__PURE__ */ A("p", {
		className: "mtc-activity-empty",
		children: l ?? m("activity.empty")
	}) : /* @__PURE__ */ A("ol", {
		...d,
		ref: f,
		className: c("mtc-activity-feed", u),
		"data-variant": i,
		children: r.map((e) => {
			let r = _e(e.timestamp), a = t(e.timestamp, {
				locale: g,
				timeZone: _
			});
			return /* @__PURE__ */ j("li", {
				className: "mtc-activity-item",
				"data-tone": e.tone ?? "neutral",
				children: [
					i === "timeline" ? /* @__PURE__ */ A("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}) : e.actor ? /* @__PURE__ */ A(h, {
						name: e.actor.name,
						src: e.actor.avatarSrc,
						decorative: !0
					}) : /* @__PURE__ */ A("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ j("p", {
						className: "mtc-activity-text",
						children: [
							e.actor && /* @__PURE__ */ A("span", {
								className: "mtc-activity-actor",
								children: e.actor.name
							}),
							" ",
							/* @__PURE__ */ A("span", {
								className: "mtc-activity-verb",
								children: e.verb
							}),
							e.object && /* @__PURE__ */ j(k, { children: [" ", /* @__PURE__ */ A(p, {
								object: e.object,
								onNavigate: s
							})] }),
							e.summary != null && /* @__PURE__ */ j(k, { children: [" ", /* @__PURE__ */ A("span", {
								className: "mtc-activity-summary",
								children: e.summary
							})] })
						]
					}),
					/* @__PURE__ */ A("time", {
						className: "mtc-activity-time",
						dateTime: r,
						title: i === "timeline" ? r : a,
						children: i === "timeline" ? a : n(e.timestamp, {
							locale: g,
							now: o ?? Date.now()
						})
					})
				]
			}, e.id);
		})
	});
}), ye = x(function({ label: t, groups: n, onChange: i, onClear: s, className: l, ...f }, p) {
	let m = e(), { locale: h } = a(), [g, _] = O(/* @__PURE__ */ new Set()), v = n.some((e) => e.selected.length > 0);
	return /* @__PURE__ */ j("div", {
		...f,
		ref: p,
		role: "group",
		"aria-label": t,
		className: c("mtc-facet-list", l),
		children: [s && v && /* @__PURE__ */ A("div", {
			className: "mtc-facet-list-header",
			children: /* @__PURE__ */ A("button", {
				type: "button",
				className: "mtc-facet-clear",
				onClick: s,
				children: m("facet.clear")
			})
		}), n.map((e) => {
			let t = e.maxVisible ?? 8, n = g.has(e.id), a = e.options.length - t, s = n || a <= 0 ? e.options : e.options.slice(0, t), c = `mtc-facet-${e.id}`;
			return /* @__PURE__ */ j("fieldset", {
				className: "mtc-facet-group",
				children: [
					/* @__PURE__ */ A("legend", {
						className: "mtc-facet-legend",
						children: e.label
					}),
					/* @__PURE__ */ A("div", {
						className: "mtc-facet-options",
						children: s.map((t) => {
							let n = e.selected.includes(t.value), a = t.type ? u(t.type) : null;
							return /* @__PURE__ */ j("label", {
								className: "mtc-facet-option",
								"data-mode": e.mode,
								"data-checked": n || void 0,
								children: [
									/* @__PURE__ */ A("input", {
										type: e.mode === "single" ? "radio" : "checkbox",
										name: c,
										value: t.value,
										checked: n,
										className: e.mode === "single" ? "mtc-visually-hidden" : "mtc-facet-checkbox",
										onChange: () => {
											e.mode === "single" ? i(e.id, [t.value]) : i(e.id, n ? e.selected.filter((e) => e !== t.value) : [...e.selected, t.value]);
										}
									}),
									a ? /* @__PURE__ */ A(d, {
										icon: a.icon,
										color: a.color,
										size: 16
									}) : t.icon ? /* @__PURE__ */ A(r, {
										name: t.icon,
										className: "mtc-facet-icon"
									}) : null,
									/* @__PURE__ */ A("span", {
										className: "mtc-facet-label",
										children: t.label
									}),
									t.count !== void 0 && /* @__PURE__ */ A("span", {
										className: "mtc-facet-count",
										children: o(t.count, { locale: h })
									})
								]
							}, t.value);
						})
					}),
					a > 0 && /* @__PURE__ */ A("button", {
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
}), be = x(function({ header: t, breadcrumbs: n, tabs: r, tab: i, defaultTab: a, onTabChange: o, tabsLabel: l, className: u, ...d }, f) {
	let p = e(), [m, h] = s({
		value: i,
		defaultValue: a ?? r[0]?.id ?? "",
		onChange: o
	});
	return /* @__PURE__ */ j("div", {
		...d,
		ref: f,
		className: c("mtc-object-page", u),
		children: [/* @__PURE__ */ A(z, {
			breadcrumbs: n,
			className: "mtc-object-page-header",
			children: /* @__PURE__ */ A(y, {
				...t,
				headingLevel: 1
			})
		}), /* @__PURE__ */ A(v, {
			label: l ?? p("objectPage.sections"),
			value: m,
			onValueChange: h,
			items: r.map((e) => ({
				id: e.id,
				label: e.label,
				count: e.count,
				panel: e.panel
			})),
			className: "mtc-object-page-tabs"
		})]
	});
});
//#endregion
export { pe as a, te as c, I as d, F as f, ge as i, ee as l, M as m, ye as n, B as o, P as p, ve as r, z as s, be as t, N as u };
