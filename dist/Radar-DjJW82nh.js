import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { r as n, t as r } from "./colors-DjPEDFCT.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
import { Legend as s, PolarAngleAxis as c, PolarGrid as l, PolarRadiusAxis as u, Radar as d, RadarChart as f, ResponsiveContainer as p, Tooltip as m } from "recharts";
//#region src/widgets/Radar.tsx
var h = /* @__PURE__ */ e({ Radar: () => b }), g = "var(--mtc-grid)", _ = "var(--mtc-border)", v = "var(--mtc-muted)", y = "var(--mtc-muted-subtle)";
function b({ data: e }) {
	let h = i(() => x(e), [e]);
	return h ? /* @__PURE__ */ a(p, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ o(f, {
			data: h.rows,
			outerRadius: "75%",
			children: [
				/* @__PURE__ */ a(l, { stroke: g }),
				/* @__PURE__ */ a(c, {
					dataKey: "metric",
					stroke: _,
					tick: {
						fontSize: 11,
						fill: v
					}
				}),
				/* @__PURE__ */ a(u, {
					stroke: _,
					tick: {
						fontSize: 9,
						fill: y
					}
				}),
				/* @__PURE__ */ a(m, { contentStyle: n }),
				h.series.length > 1 && /* @__PURE__ */ a(s, { wrapperStyle: {
					fontSize: 11,
					color: v
				} }),
				h.series.map((e, t) => /* @__PURE__ */ a(d, {
					name: e,
					dataKey: e,
					stroke: r[t % r.length],
					fill: r[t % r.length],
					fillOpacity: .25,
					strokeWidth: 1.5
				}, e))
			]
		})
	}) : /* @__PURE__ */ a(t, { children: "No data" });
}
function x(e) {
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
		let t = e[0];
		if (typeof t.metric == "string") {
			let n = Object.keys(t).filter((e) => e !== "metric" && typeof t[e] == "number");
			return n.length === 0 ? null : {
				rows: e,
				series: n
			};
		}
	}
	if (e && typeof e == "object") {
		let t = e, n = Array.isArray(t.metrics) ? t.metrics.map(String) : null, r = Array.isArray(t.series) ? t.series : null;
		if (!n || !r) return null;
		let i = r.map((e) => String(e.name ?? "")).filter(Boolean);
		return {
			rows: n.map((e, t) => {
				let n = { metric: e };
				for (let e of r) {
					let r = e, i = String(r.name ?? ""), a = r.values;
					Array.isArray(a) && typeof a[t] == "number" && (n[i] = a[t]);
				}
				return n;
			}),
			series: i
		};
	}
	return null;
}
//#endregion
export { h as n, b as t };
