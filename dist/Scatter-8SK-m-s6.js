import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { n, r } from "./colors-DjPEDFCT.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
import { CartesianGrid as s, ResponsiveContainer as c, Scatter as l, ScatterChart as u, Tooltip as d, XAxis as f, YAxis as p, ZAxis as m } from "recharts";
//#region src/widgets/Scatter.tsx
var h = /* @__PURE__ */ e({ Scatter: () => b }), g = "var(--mtc-grid)", _ = "var(--mtc-border)", v = "var(--mtc-muted)", y = "var(--mtc-muted-subtle)";
function b({ data: e }) {
	let n = i(() => x(e), [e]);
	if (!n || n.length === 0) return /* @__PURE__ */ a(t, { children: "No data" });
	let h = n.some((e) => e.size != null);
	return /* @__PURE__ */ a(c, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ o(u, {
			margin: {
				top: 8,
				right: 8,
				bottom: 4,
				left: 0
			},
			children: [
				/* @__PURE__ */ a(s, {
					strokeDasharray: "3 3",
					stroke: g
				}),
				/* @__PURE__ */ a(f, {
					type: "number",
					dataKey: "x",
					stroke: _,
					tick: {
						fontSize: 11,
						fill: v
					}
				}),
				/* @__PURE__ */ a(p, {
					type: "number",
					dataKey: "y",
					stroke: _,
					tick: {
						fontSize: 11,
						fill: v
					},
					width: 50
				}),
				h && /* @__PURE__ */ a(m, {
					type: "number",
					dataKey: "size",
					range: [40, 280]
				}),
				/* @__PURE__ */ a(d, {
					cursor: {
						strokeDasharray: "3 3",
						stroke: y
					},
					contentStyle: r
				}),
				/* @__PURE__ */ a(l, {
					data: n,
					fill: "var(--mtc-accent)",
					shape: (e) => {
						let { cx: t, cy: n, payload: r } = e;
						if (t == null || n == null || !r) return /* @__PURE__ */ a("circle", {
							cx: 0,
							cy: 0,
							r: 0
						});
						let i = S(r);
						return /* @__PURE__ */ a("g", { children: /* @__PURE__ */ a("circle", {
							cx: t,
							cy: n,
							r: r.size == null ? 5 : Math.min(20, Math.max(3, Math.sqrt(r.size) * 2)),
							fill: i,
							fillOpacity: .7,
							stroke: i,
							strokeWidth: 1,
							children: r.label && /* @__PURE__ */ a("title", { children: r.label })
						}) });
					}
				})
			]
		})
	});
}
function x(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.points) && (t = n.points);
	}
	if (!t) return null;
	let n = t.map((e) => {
		let t = e;
		return {
			x: Number(t.x ?? 0),
			y: Number(t.y ?? 0),
			label: t.label == null ? void 0 : String(t.label),
			size: typeof t.size == "number" ? t.size : void 0,
			color: t.color == null ? void 0 : String(t.color)
		};
	}).filter((e) => Number.isFinite(e.x) && Number.isFinite(e.y));
	return n.length > 0 ? n : null;
}
function S(e) {
	return e.color && n[e.color] ? n[e.color] : e.color && e.color.startsWith("#") ? e.color : "var(--mtc-accent)";
}
//#endregion
export { h as n, b as t };
