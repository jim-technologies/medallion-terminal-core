import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { r as n } from "./format-V6rpoQ-_.js";
import { r } from "./colors-DjPEDFCT.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
import { Bar as s, BarChart as c, CartesianGrid as l, ResponsiveContainer as u, Tooltip as d, XAxis as f, YAxis as p } from "recharts";
//#region src/widgets/Histogram.tsx
var m = /* @__PURE__ */ e({ Histogram: () => b }), h = 20, g = "var(--mtc-grid)", _ = "var(--mtc-border)", v = "var(--mtc-muted)", y = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function b({ data: e, options: n }) {
	let m = i(() => x(e, n), [e, n]);
	return !m || m.length === 0 ? /* @__PURE__ */ a(t, { children: "No data" }) : /* @__PURE__ */ a(u, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ o(c, {
			data: m,
			margin: {
				top: 8,
				right: 8,
				bottom: 4,
				left: 0
			},
			children: [
				/* @__PURE__ */ a(l, {
					strokeDasharray: "3 3",
					stroke: g
				}),
				/* @__PURE__ */ a(f, {
					dataKey: "bin",
					stroke: _,
					tick: {
						fontSize: 10,
						fill: v
					},
					interval: "preserveStartEnd"
				}),
				/* @__PURE__ */ a(p, {
					stroke: _,
					tick: {
						fontSize: 11,
						fill: v
					},
					allowDecimals: !1,
					width: 40
				}),
				/* @__PURE__ */ a(d, {
					contentStyle: r,
					cursor: { fill: y }
				}),
				/* @__PURE__ */ a(s, {
					dataKey: "count",
					fill: "var(--mtc-accent)",
					radius: [
						2,
						2,
						0,
						0
					]
				})
			]
		})
	});
}
function x(e, t) {
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null && "count" in e[0]) return e.map((e) => {
		let t = e, n = typeof t.rangeStart == "number" ? t.rangeStart : 0, r = typeof t.rangeEnd == "number" ? t.rangeEnd : 0;
		return {
			bin: String(t.bin ?? ""),
			count: Number(t.count ?? 0),
			rangeStart: n,
			rangeEnd: r
		};
	}).filter((e) => Number.isFinite(e.count));
	let n = null, r = h;
	if (Array.isArray(e) && e.every((e) => typeof e == "number")) n = e;
	else if (e && typeof e == "object") {
		let t = e;
		Array.isArray(t.values) && t.values.every((e) => typeof e == "number") && (n = t.values), typeof t.bins == "number" && (r = t.bins);
	}
	return typeof t?.bins == "number" && (r = t.bins), !n || (n = n.filter((e) => Number.isFinite(e)), n.length === 0) ? null : S(n, r);
}
function S(e, t) {
	let r = Math.min(...e), i = Math.max(...e);
	if (r === i) return [{
		bin: n(r),
		count: e.length,
		rangeStart: r,
		rangeEnd: i
	}];
	let a = (i - r) / t, o = Array.from({ length: t }, (e, o) => {
		let s = r + o * a, c = o === t - 1 ? i : s + a;
		return {
			bin: n((s + c) / 2),
			count: 0,
			rangeStart: s,
			rangeEnd: c
		};
	});
	for (let n of e) {
		let e = Math.floor((n - r) / a);
		e >= t && (e = t - 1), o[e].count += 1;
	}
	return o;
}
//#endregion
export { m as n, b as t };
