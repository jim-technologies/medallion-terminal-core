import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { a as n, r } from "./colors-DjPEDFCT.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
import { Cell as s, Pie as c, PieChart as l, ResponsiveContainer as u, Tooltip as d } from "recharts";
//#region src/widgets/Distribution.tsx
var f = /* @__PURE__ */ e({ Distribution: () => p });
function p({ data: e }) {
	let f = i(() => m(e), [e]);
	if (!f) return /* @__PURE__ */ a(t, { children: "No data" });
	let { slices: p, total: g } = f, _ = p.map((e, t) => n(e.color, t)), v = p.reduce((e, t) => t.value > e.value ? t : e), y = v.value / g * 100;
	return /* @__PURE__ */ o("div", {
		className: "flex flex-col h-full",
		children: [/* @__PURE__ */ o("div", {
			className: "flex-1 relative min-h-0",
			children: [/* @__PURE__ */ a(u, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ o(l, { children: [/* @__PURE__ */ a(c, {
					data: p,
					dataKey: "value",
					nameKey: "label",
					innerRadius: "60%",
					outerRadius: "92%",
					paddingAngle: 2,
					stroke: "none",
					isAnimationActive: !1,
					children: p.map((e, t) => /* @__PURE__ */ a(s, { fill: _[t] }, t))
				}), /* @__PURE__ */ a(d, {
					contentStyle: r,
					formatter: (e) => {
						let t = Number(e) || 0;
						return [`${h(t)} (${(t / g * 100).toFixed(1)}%)`, ""];
					}
				})] })
			}), /* @__PURE__ */ o("div", {
				className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
				children: [/* @__PURE__ */ a("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate max-w-[60%]",
					children: v.label
				}), /* @__PURE__ */ o("div", {
					className: "text-2xl font-bold text-white tabular-nums",
					children: [y.toFixed(1), "%"]
				})]
			})]
		}), /* @__PURE__ */ a("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs",
			children: p.map((e, t) => /* @__PURE__ */ o("div", {
				className: "flex items-center gap-1.5 min-w-0",
				children: [
					/* @__PURE__ */ a("span", {
						className: "w-2 h-2 rounded-sm shrink-0",
						style: { backgroundColor: _[t] }
					}),
					/* @__PURE__ */ a("span", {
						className: "text-zinc-300 truncate",
						children: e.label
					}),
					/* @__PURE__ */ o("span", {
						className: "text-zinc-500 ml-auto tabular-nums shrink-0",
						children: [(e.value / g * 100).toFixed(1), "%"]
					})
				]
			}, t))
		})]
	});
}
function m(e) {
	if (typeof e != "object" || !e) return null;
	let t = e, n = Array.isArray(t.slices) ? t.slices : null;
	if (!n) return null;
	let r = n.map((e) => {
		let t = e;
		return {
			label: String(t.label ?? ""),
			value: Number(t.value ?? 0),
			color: t.color == null ? void 0 : String(t.color)
		};
	}).filter((e) => e.value > 0);
	return r.length === 0 ? null : {
		slices: r,
		total: (typeof t.total == "number" ? t.total : null) ?? r.reduce((e, t) => e + t.value, 0)
	};
}
function h(e) {
	return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
//#endregion
export { f as n, p as t };
