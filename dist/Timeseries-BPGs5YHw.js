import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t, T as n } from "./MultiDashboard-B8rxYV_S.js";
import { d as r, l as i, t as a, u as o } from "./format-V6rpoQ-_.js";
import { i as s, r as c, t as l } from "./colors-DjPEDFCT.js";
import { useMemo as u, useRef as d } from "react";
import { jsx as f, jsxs as p } from "react/jsx-runtime";
import { Brush as m, CartesianGrid as h, Line as g, LineChart as _, ReferenceArea as v, ReferenceDot as y, ReferenceLine as b, ResponsiveContainer as x, Tooltip as S, XAxis as C, YAxis as w } from "recharts";
//#region src/widgets/Timeseries.tsx
var T = /* @__PURE__ */ e({ Timeseries: () => M }), E = {
	buy: "var(--mtc-ok)",
	sell: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	warn: "var(--mtc-warning)"
}, D = "var(--mtc-grid)", O = "var(--mtc-border)", k = "var(--mtc-muted)", A = "var(--mtc-surface)", j = "var(--mtc-muted-subtle)";
function M({ data: e, options: T }) {
	let { hoverTime: M, setHoverTime: P } = n(), F = d(null), I = u(() => L(e), [e]), { tickFormatter: R, labelFormatter: z } = u(() => {
		let e = r(I?.points.map((e) => e._ts) ?? []);
		return {
			tickFormatter: o(e),
			labelFormatter: i(e)
		};
	}, [I]), B = u(() => s(I?.keys ?? [], l), [I]), V = T?.brush === !0;
	if (!I) return /* @__PURE__ */ f(t, { children: "No data" });
	let H = M != null && M !== F.current;
	return /* @__PURE__ */ f(x, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ p(_, {
			data: I.points,
			onMouseMove: (e) => {
				let t = e?.activeLabel;
				if (t != null) {
					let e = String(t);
					F.current = e, P(e);
				}
			},
			onMouseLeave: () => {
				F.current = null, P(null);
			},
			children: [
				/* @__PURE__ */ f(h, {
					strokeDasharray: "3 3",
					stroke: D
				}),
				/* @__PURE__ */ f(C, {
					dataKey: "_ts",
					stroke: O,
					tick: {
						fontSize: 11,
						fill: k
					},
					tickFormatter: R
				}),
				/* @__PURE__ */ f(w, {
					stroke: O,
					tick: {
						fontSize: 11,
						fill: k
					},
					tickFormatter: a,
					width: 60
				}),
				/* @__PURE__ */ f(S, {
					contentStyle: c,
					labelStyle: { color: k },
					labelFormatter: z
				}),
				I.keys.map((e, t) => /* @__PURE__ */ f(g, {
					type: "monotone",
					dataKey: e,
					stroke: B[t],
					dot: !1,
					strokeWidth: 2
				}, e)),
				V && I.points.length > 4 && /* @__PURE__ */ f(m, {
					dataKey: "_ts",
					height: 20,
					stroke: O,
					fill: A,
					travellerWidth: 6,
					tickFormatter: R
				}),
				H && /* @__PURE__ */ f(b, {
					x: M,
					stroke: j,
					strokeDasharray: "3 3"
				}),
				I.annotations.map((e, t) => {
					let n = e.color ?? (e.kind ? E[e.kind] : null) ?? k;
					if (e.endTimestamp) {
						let [r, i] = e.timestamp <= e.endTimestamp ? [e.timestamp, e.endTimestamp] : [e.endTimestamp, e.timestamp];
						return /* @__PURE__ */ f(v, {
							x1: r,
							x2: i,
							fill: n,
							fillOpacity: .1,
							stroke: n,
							strokeOpacity: .4,
							strokeDasharray: "3 3",
							label: {
								value: e.label,
								position: "insideTopLeft",
								fontSize: 10,
								fill: n
							}
						}, t);
					}
					return e.value === void 0 ? null : /* @__PURE__ */ f(y, {
						x: e.timestamp,
						y: e.value,
						r: 6,
						fill: n,
						stroke: A,
						strokeWidth: 2,
						ifOverflow: "extendDomain",
						shape: (t) => /* @__PURE__ */ f(N, {
							...t,
							kind: e.kind,
							color: n,
							label: e.label
						})
					}, t);
				})
			]
		})
	});
}
function N({ cx: e, cy: t, kind: n, color: r, label: i }) {
	if (e == null || t == null) return null;
	let a;
	if (n === "buy") a = `M${e} ${t - 7} L${e + 6} ${t + 4} L${e - 6} ${t + 4} Z`;
	else if (n === "sell") a = `M${e} ${t + 7} L${e + 6} ${t - 4} L${e - 6} ${t - 4} Z`;
	else return /* @__PURE__ */ f("g", { children: /* @__PURE__ */ f("circle", {
		cx: e,
		cy: t,
		r: 5,
		fill: r,
		stroke: A,
		strokeWidth: 2,
		children: /* @__PURE__ */ f("title", { children: i })
	}) });
	return /* @__PURE__ */ f("g", { children: /* @__PURE__ */ f("path", {
		d: a,
		fill: r,
		stroke: A,
		strokeWidth: 1.5,
		children: /* @__PURE__ */ f("title", { children: i })
	}) });
}
var P = [
	"timestamp",
	"date",
	"time",
	"datetime",
	"ts",
	"x",
	"t"
];
function F(e) {
	for (let t of P) if (t in e) return t;
	return null;
}
function I(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return [];
	let t = e.annotations;
	return Array.isArray(t) ? t.map((e) => {
		let t = e;
		return {
			timestamp: String(t.timestamp ?? ""),
			endTimestamp: t.end_timestamp == null ? t.endTimestamp == null ? void 0 : String(t.endTimestamp) : String(t.end_timestamp),
			value: typeof t.value == "number" ? t.value : void 0,
			label: String(t.label ?? ""),
			kind: t.kind == null ? void 0 : String(t.kind),
			color: t.color == null ? void 0 : String(t.color)
		};
	}) : [];
}
function L(e) {
	if (!e) return null;
	let t = I(e);
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
		let n = e[0], r = F(n);
		if (!r) return null;
		let i = Object.keys(n).filter((e) => e !== r && typeof n[e] == "number");
		return i.length === 0 ? null : {
			points: e.map((e) => {
				let t = e, n = { _ts: t[r] };
				for (let e of i) n[e] = t[e];
				return n;
			}),
			keys: i,
			annotations: t
		};
	}
	if (typeof e == "object" && e && "points" in e) {
		let n = e.points;
		return !Array.isArray(n) || n.length === 0 ? null : {
			points: n.map((e) => {
				let t = e;
				return {
					_ts: t.timestamp ?? t.date ?? t.time ?? t.x,
					value: t.value ?? t.y ?? t.v
				};
			}),
			keys: ["value"],
			annotations: t
		};
	}
	if (typeof e == "object" && e && "series" in e) {
		let n = e.series;
		if (!Array.isArray(n)) return null;
		let r = /* @__PURE__ */ new Map(), i = [];
		for (let e of n) {
			let t = e, n = String(t.name || t.label || `s${i.length}`);
			i.push(n);
			let a = t.data ?? t.points;
			if (Array.isArray(a)) for (let e of a) {
				let t = String(e.timestamp ?? e.date ?? e.time ?? e.x ?? "");
				r.has(t) || r.set(t, { _ts: t }), r.get(t)[n] = e.value ?? e.y ?? e.v;
			}
		}
		return {
			points: Array.from(r.values()),
			keys: i,
			annotations: t
		};
	}
	return null;
}
//#endregion
export { T as n, M as t };
