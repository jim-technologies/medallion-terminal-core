import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, ft as r } from "./MultiDashboard-B8rxYV_S.js";
import { useId as i, useMemo as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/widgets/Dag.tsx
var c = /* @__PURE__ */ e({ Dag: () => g }), l = {
	ok: "var(--mtc-ok)",
	EVENT_STATUS_OK: "var(--mtc-ok)",
	warn: "var(--mtc-warning)",
	EVENT_STATUS_WARN: "var(--mtc-warning)",
	error: "var(--mtc-danger)",
	EVENT_STATUS_ERROR: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	EVENT_STATUS_INFO: "var(--mtc-accent)",
	pending: "var(--mtc-muted)",
	EVENT_STATUS_PENDING: "var(--mtc-muted)",
	running: "var(--mtc-accent)"
}, u = "var(--mtc-muted-subtle)", d = 130, f = 48, p = 80, m = 18, h = 16;
function g({ data: e, options: c }) {
	let p = a(() => r(e), [e]), m = a(() => v(p), [p]), h = `dag-arrow-${i().replace(/[^a-zA-Z0-9_-]/g, "")}`, { ctx: g, setCtx: y } = t(), b = c ?? {}, x = b.node_context?.key ?? "asset_id";
	if (!m) return /* @__PURE__ */ o(n, { children: "No data" });
	let S = (e) => {
		if (Object.keys(e.context).length > 0) for (let [t, n] of Object.entries(e.context)) y(t, n);
		if (b.node_context) {
			let t = b.node_context.kind_key;
			x in e.context || y(x, e.id), t && e.kind && !(t in e.context) && y(t, e.kind);
		}
	};
	return /* @__PURE__ */ o("div", {
		className: "h-full w-full overflow-auto",
		children: /* @__PURE__ */ s("svg", {
			viewBox: `0 0 ${m.width} ${m.height}`,
			width: m.width,
			height: m.height,
			style: { display: "block" },
			children: [
				/* @__PURE__ */ o("defs", { children: /* @__PURE__ */ o("marker", {
					id: h,
					markerWidth: "8",
					markerHeight: "8",
					refX: "7",
					refY: "4",
					orient: "auto",
					markerUnits: "strokeWidth",
					children: /* @__PURE__ */ o("path", {
						d: "M0,0 L0,8 L8,4 z",
						fill: "var(--mtc-muted-subtle)"
					})
				}) }),
				m.edges.map((e, t) => /* @__PURE__ */ s("g", { children: [/* @__PURE__ */ o("line", {
					x1: e.x1,
					y1: e.y1,
					x2: e.x2,
					y2: e.y2,
					stroke: "var(--mtc-border-strong)",
					strokeWidth: 1.5,
					markerEnd: `url(#${h})`
				}), e.label && /* @__PURE__ */ o("text", {
					x: (e.x1 + e.x2) / 2,
					y: (e.y1 + e.y2) / 2 - 4,
					textAnchor: "middle",
					fontSize: 9,
					fill: "var(--mtc-muted)",
					fontFamily: "var(--mtc-font-sans)",
					children: _(e.label, 18)
				})] }, `${e.from}:${e.to}:${t}`)),
				m.nodes.map((e) => {
					let t = e.status ? l[e.status] ?? u : u, n = !!b.node_context || Object.keys(e.context).length > 0, r = n && g[x] === e.id;
					return /* @__PURE__ */ s("g", {
						onClick: n ? () => S(e) : void 0,
						onKeyDown: n ? (t) => {
							(t.key === "Enter" || t.key === " ") && (t.preventDefault(), S(e));
						} : void 0,
						role: n ? "button" : void 0,
						"aria-label": n ? `Select ${e.label}` : void 0,
						tabIndex: n ? 0 : void 0,
						style: { cursor: n ? "pointer" : "default" },
						children: [
							/* @__PURE__ */ o("rect", {
								x: e.x,
								y: e.y,
								width: d,
								height: f,
								rx: 4,
								ry: 4,
								fill: r ? "color-mix(in oklab, var(--mtc-accent) 12%, var(--mtc-surface-raised))" : "var(--mtc-surface-raised)",
								stroke: r ? "var(--mtc-accent)" : t,
								strokeWidth: r ? 2.5 : 1.5
							}),
							/* @__PURE__ */ o("text", {
								x: e.x + d / 2,
								y: e.y + (e.subtitle ? 21 : 28),
								textAnchor: "middle",
								fontSize: 11,
								fill: "var(--mtc-fg)",
								fontFamily: "var(--mtc-font-sans)",
								children: _(e.label, 18)
							}),
							e.subtitle && /* @__PURE__ */ o("text", {
								x: e.x + d / 2,
								y: e.y + 36,
								textAnchor: "middle",
								fontSize: 9,
								fill: "var(--mtc-muted)",
								fontFamily: "var(--mtc-font-sans)",
								children: _(e.subtitle, 22)
							}),
							/* @__PURE__ */ o("circle", {
								cx: e.x + 8,
								cy: e.y + 8,
								r: 3,
								fill: t
							})
						]
					}, e.id);
				})
			]
		})
	});
}
function _(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function v(e) {
	if (!e || e.nodes.length === 0) return null;
	let { nodes: t, edges: n } = e, r = new Set(t.map((e) => e.id)), i = n.filter((e) => r.has(e.from) && r.has(e.to)), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
	for (let e of t) a.set(e.id, 0), o.set(e.id, []), s.set(e.id, 0);
	for (let e of i) a.set(e.to, (a.get(e.to) ?? 0) + 1), o.get(e.from)?.push(e.to);
	let c = t.filter((e) => (a.get(e.id) ?? 0) === 0).map((e) => e.id), l = /* @__PURE__ */ new Set();
	for (let e = 0; e < c.length; e++) {
		let t = c[e];
		l.add(t);
		for (let e of o.get(t) ?? []) {
			s.set(e, Math.max(s.get(e) ?? 0, (s.get(t) ?? 0) + 1));
			let n = (a.get(e) ?? 0) - 1;
			a.set(e, n), n === 0 && c.push(e);
		}
	}
	if (l.size < t.length) {
		let e = Math.max(0, ...[...l].map((e) => s.get(e) ?? 0)) + 1;
		for (let n of t) l.has(n.id) || s.set(n.id, e);
	}
	let u = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = s.get(e.id) ?? 0;
		u.has(t) || u.set(t, []), u.get(t).push(e.id);
	}
	let g = Math.max(0, ...s.values()), _ = Math.max(...Array.from(u.values(), (e) => e.length)), v = 32 + _ * d + (_ - 1) * m, y = 32 + (g + 1) * f + g * 32, b = /* @__PURE__ */ new Map();
	for (let [e, t] of u) {
		let n = (v - (t.length * d + (t.length - 1) * m)) / 2;
		t.forEach((t, r) => {
			b.set(t, {
				x: n + r * 148,
				y: h + e * p
			});
		});
	}
	return {
		nodes: t.map((e) => ({
			...e,
			...b.get(e.id)
		})),
		edges: i.map((e) => {
			let t = b.get(e.from), n = b.get(e.to);
			return !t || !n ? null : {
				from: e.from,
				to: e.to,
				label: e.label,
				x1: t.x + d / 2,
				y1: t.y + f,
				x2: n.x + d / 2,
				y2: n.y
			};
		}).filter((e) => e != null),
		width: v,
		height: y
	};
}
//#endregion
export { c as n, g as t };
