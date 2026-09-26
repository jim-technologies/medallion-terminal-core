import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { t } from "./layeredLayout-D0PMUE9A.js";
import { Ft as n, dt as r, kt as i } from "./MultiDashboard-BKNPp3yn.js";
import { useId as a, useMemo as o } from "react";
import { jsx as s, jsxs as c } from "react/jsx-runtime";
//#region src/widgets/Dag.tsx
var l = /* @__PURE__ */ e({ Dag: () => _ }), u = {
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
}, d = "var(--mtc-muted-subtle)", f = 130, p = 48, m = 80, h = 18, g = 16;
function _({ data: e, options: t }) {
	let l = o(() => r(e), [e]), m = o(() => y(l), [l]), h = `dag-arrow-${a().replace(/[^a-zA-Z0-9_-]/g, "")}`, { ctx: g, setCtx: _ } = i(), b = t ?? {}, x = b.node_context?.key ?? "asset_id";
	if (!m) return /* @__PURE__ */ s(n, { children: "No data" });
	let S = (e) => {
		if (Object.keys(e.context).length > 0) for (let [t, n] of Object.entries(e.context)) _(t, n);
		if (b.node_context) {
			let t = b.node_context.kind_key;
			x in e.context || _(x, e.id), t && e.kind && !(t in e.context) && _(t, e.kind);
		}
	};
	return /* @__PURE__ */ s("div", {
		className: "h-full w-full overflow-auto",
		children: /* @__PURE__ */ c("svg", {
			viewBox: `0 0 ${m.width} ${m.height}`,
			width: m.width,
			height: m.height,
			style: { display: "block" },
			children: [
				/* @__PURE__ */ s("defs", { children: /* @__PURE__ */ s("marker", {
					id: h,
					markerWidth: "8",
					markerHeight: "8",
					refX: "7",
					refY: "4",
					orient: "auto",
					markerUnits: "strokeWidth",
					children: /* @__PURE__ */ s("path", {
						d: "M0,0 L0,8 L8,4 z",
						fill: "var(--mtc-muted-subtle)"
					})
				}) }),
				m.edges.map(({ edge: e, x1: t, y1: n, x2: r, y2: i }, a) => {
					let o = {
						...e,
						x1: t,
						y1: n,
						x2: r,
						y2: i
					};
					return /* @__PURE__ */ c("g", { children: [/* @__PURE__ */ s("line", {
						x1: o.x1,
						y1: o.y1,
						x2: o.x2,
						y2: o.y2,
						stroke: "var(--mtc-border-strong)",
						strokeWidth: 1.5,
						markerEnd: `url(#${h})`
					}), o.label && /* @__PURE__ */ s("text", {
						x: (o.x1 + o.x2) / 2,
						y: (o.y1 + o.y2) / 2 - 4,
						textAnchor: "middle",
						fontSize: 11,
						fill: "var(--mtc-muted)",
						fontFamily: "var(--mtc-font-sans)",
						children: v(o.label, 18)
					})] }, `${o.from}:${o.to}:${a}`);
				}),
				m.nodes.map(({ node: e, x: t, y: n }) => {
					let r = {
						...e,
						x: t,
						y: n
					}, i = r.status ? u[r.status] ?? d : d, a = !!b.node_context || Object.keys(r.context).length > 0, o = a && g[x] === r.id;
					return /* @__PURE__ */ c("g", {
						onClick: a ? () => S(r) : void 0,
						onKeyDown: a ? (e) => {
							(e.key === "Enter" || e.key === " ") && (e.preventDefault(), S(r));
						} : void 0,
						role: a ? "button" : void 0,
						"aria-label": a ? `Select ${r.label}` : void 0,
						tabIndex: a ? 0 : void 0,
						style: { cursor: a ? "pointer" : "default" },
						children: [
							/* @__PURE__ */ s("rect", {
								x: r.x,
								y: r.y,
								width: f,
								height: p,
								rx: 4,
								ry: 4,
								fill: o ? "color-mix(in oklab, var(--mtc-accent) 12%, var(--mtc-surface-raised))" : "var(--mtc-surface-raised)",
								stroke: o ? "var(--mtc-accent)" : i,
								strokeWidth: o ? 2.5 : 1.5
							}),
							/* @__PURE__ */ s("text", {
								x: r.x + f / 2,
								y: r.y + (r.subtitle ? 21 : 28),
								textAnchor: "middle",
								fontSize: 11,
								fill: "var(--mtc-fg)",
								fontFamily: "var(--mtc-font-sans)",
								children: v(r.label, 18)
							}),
							r.subtitle && /* @__PURE__ */ s("text", {
								x: r.x + f / 2,
								y: r.y + 36,
								textAnchor: "middle",
								fontSize: 11,
								fill: "var(--mtc-muted)",
								fontFamily: "var(--mtc-font-sans)",
								children: v(r.subtitle, 22)
							}),
							/* @__PURE__ */ s("circle", {
								cx: r.x + 8,
								cy: r.y + 8,
								r: 3,
								fill: i
							})
						]
					}, r.id);
				})
			]
		})
	});
}
function v(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function y(e) {
	return e ? t(e.nodes, e.edges, {
		nodeWidth: f,
		nodeHeight: p,
		rankGap: m,
		nodeGap: h,
		padding: g
	}) : null;
}
//#endregion
export { l as n, _ as t };
