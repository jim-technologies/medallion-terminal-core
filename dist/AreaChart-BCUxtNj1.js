import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-B8rxYV_S.js";
import { c as n, t as r } from "./format-V6rpoQ-_.js";
import { r as i, t as a } from "./colors-DjPEDFCT.js";
import { useMemo as o } from "react";
import { jsx as s, jsxs as c } from "react/jsx-runtime";
import { Area as l, AreaChart as u, Brush as d, CartesianGrid as f, ResponsiveContainer as p, Tooltip as m, XAxis as h, YAxis as g } from "recharts";
//#region src/widgets/AreaChart.tsx
var _ = /* @__PURE__ */ e({ AreaChart: () => C }), v = "var(--mtc-grid)", y = "var(--mtc-border)", b = "var(--mtc-muted)", x = "var(--mtc-surface)", S = [
	"timestamp",
	"date",
	"time",
	"datetime",
	"ts",
	"x",
	"t"
];
function C({ data: e, options: _ }) {
	let S = o(() => T(e), [e]), C = _?.brush === !0;
	if (!S) return /* @__PURE__ */ s(t, { children: "No data" });
	let w = S.keys.length > 1;
	return /* @__PURE__ */ s(p, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ c(u, {
			data: S.points,
			children: [
				/* @__PURE__ */ s(f, {
					strokeDasharray: "3 3",
					stroke: v
				}),
				/* @__PURE__ */ s(h, {
					dataKey: "_ts",
					stroke: y,
					tick: {
						fontSize: 11,
						fill: b
					},
					tickFormatter: n
				}),
				/* @__PURE__ */ s(g, {
					stroke: y,
					tick: {
						fontSize: 11,
						fill: b
					},
					tickFormatter: r,
					width: 50
				}),
				/* @__PURE__ */ s(m, {
					contentStyle: i,
					labelStyle: { color: b },
					labelFormatter: n
				}),
				S.keys.map((e, t) => /* @__PURE__ */ s(l, {
					type: "monotone",
					dataKey: e,
					stroke: a[t % a.length],
					fill: a[t % a.length],
					fillOpacity: .35,
					strokeWidth: 1.5,
					stackId: w ? "stack" : void 0
				}, e)),
				C && S.points.length > 4 && /* @__PURE__ */ s(d, {
					dataKey: "_ts",
					height: 20,
					stroke: y,
					fill: x,
					travellerWidth: 6,
					tickFormatter: n
				})
			]
		})
	});
}
function w(e) {
	for (let t of S) if (t in e) return t;
	return null;
}
function T(e) {
	if (!e) return null;
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
		let t = e[0], n = w(t);
		if (!n) return null;
		let r = Object.keys(t).filter((e) => e !== n && typeof t[e] == "number");
		return r.length === 0 ? null : {
			points: e.map((e) => {
				let t = e, i = { _ts: t[n] };
				for (let e of r) i[e] = t[e];
				return i;
			}),
			keys: r
		};
	}
	if (typeof e == "object" && e && "series" in e) {
		let t = e.series;
		if (!Array.isArray(t)) return null;
		let n = /* @__PURE__ */ new Map(), r = [];
		for (let e of t) {
			let t = e, i = String(t.name || t.label || `s${r.length}`);
			r.push(i);
			let a = t.data ?? t.points;
			if (Array.isArray(a)) for (let e of a) {
				let t = String(e.timestamp ?? e.date ?? e.time ?? e.x ?? "");
				n.has(t) || n.set(t, { _ts: t }), n.get(t)[i] = e.value ?? e.y ?? e.v;
			}
		}
		return {
			points: Array.from(n.values()),
			keys: r
		};
	}
	return null;
}
//#endregion
export { _ as n, C as t };
