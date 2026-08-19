import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { i as n, n as r, r as i, t as a } from "./colors-DjPEDFCT.js";
import { useMemo as o } from "react";
import { jsx as s, jsxs as c } from "react/jsx-runtime";
import { Bar as l, BarChart as u, CartesianGrid as d, Cell as f, Legend as p, ResponsiveContainer as m, Tooltip as h, XAxis as g, YAxis as _ } from "recharts";
//#region src/widgets/barNormalize.ts
function v(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.bars) ? t = n.bars : Array.isArray(n.rows) && (t = n.rows);
	}
	if (!t) return null;
	let n = t.filter((e) => typeof e == "object" && !!e);
	if (n.length === 0) return null;
	if (n.every((e) => "value" in e)) {
		let e = n.map((e) => ({
			label: String(e.label ?? e.name ?? ""),
			value: Number(e.value ?? 0),
			color: e.color == null ? void 0 : String(e.color)
		})).filter((e) => Number.isFinite(e.value));
		return e.length > 0 ? {
			kind: "single",
			bars: e
		} : null;
	}
	let r = [];
	for (let e of n) for (let [t, n] of Object.entries(e)) t === "label" || t === "name" || t === "color" || typeof n == "number" && Number.isFinite(n) && !r.includes(t) && r.push(t);
	return r.length === 0 ? null : {
		kind: "grouped",
		rows: n.map((e) => ({
			...e,
			label: String(e.label ?? e.name ?? "")
		})),
		series: r
	};
}
//#endregion
//#region src/widgets/BarChart.tsx
var y = /* @__PURE__ */ e({ BarChart: () => w }), b = "var(--mtc-grid)", x = "var(--mtc-border)", S = "var(--mtc-muted)", C = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function w({ data: e }) {
	let r = o(() => v(e), [e]);
	if (!r) return /* @__PURE__ */ s(t, { children: "No data" });
	if (r.kind === "grouped") {
		let e = n(r.series, a);
		return /* @__PURE__ */ s(m, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ c(u, {
				data: r.rows,
				margin: {
					top: 8,
					right: 8,
					bottom: 4,
					left: 0
				},
				children: [
					/* @__PURE__ */ s(d, {
						strokeDasharray: "3 3",
						stroke: b
					}),
					/* @__PURE__ */ s(g, {
						dataKey: "label",
						stroke: x,
						tick: {
							fontSize: 11,
							fill: S
						},
						interval: 0
					}),
					/* @__PURE__ */ s(_, {
						stroke: x,
						tick: {
							fontSize: 11,
							fill: S
						},
						tickFormatter: E,
						width: 50
					}),
					/* @__PURE__ */ s(h, {
						contentStyle: i,
						cursor: { fill: C }
					}),
					/* @__PURE__ */ s(p, { wrapperStyle: { fontSize: 11 } }),
					r.series.map((t, n) => /* @__PURE__ */ s(l, {
						dataKey: t,
						fill: e[n],
						radius: [
							2,
							2,
							0,
							0
						]
					}, t))
				]
			})
		});
	}
	let y = r.bars;
	return /* @__PURE__ */ s(m, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ c(u, {
			data: y,
			margin: {
				top: 8,
				right: 8,
				bottom: 4,
				left: 0
			},
			children: [
				/* @__PURE__ */ s(d, {
					strokeDasharray: "3 3",
					stroke: b
				}),
				/* @__PURE__ */ s(g, {
					dataKey: "label",
					stroke: x,
					tick: {
						fontSize: 11,
						fill: S
					},
					interval: 0
				}),
				/* @__PURE__ */ s(_, {
					stroke: x,
					tick: {
						fontSize: 11,
						fill: S
					},
					tickFormatter: E,
					width: 50
				}),
				/* @__PURE__ */ s(h, {
					contentStyle: i,
					cursor: { fill: C }
				}),
				/* @__PURE__ */ s(l, {
					dataKey: "value",
					radius: [
						2,
						2,
						0,
						0
					],
					children: y.map((e, t) => /* @__PURE__ */ s(f, { fill: T(e) }, t))
				})
			]
		})
	});
}
function T(e) {
	return e.color && r[e.color] ? r[e.color] : e.color && e.color.startsWith("#") ? e.color : e.value < 0 ? "var(--mtc-danger)" : "var(--mtc-accent)";
}
function E(e) {
	return typeof e == "number" ? Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(+!Number.isInteger(e)) : String(e);
}
//#endregion
export { y as n, w as t };
