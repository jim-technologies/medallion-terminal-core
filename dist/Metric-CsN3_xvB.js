import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { s as t } from "./format-V6rpoQ-_.js";
import { t as n } from "./useAnimatedNumber-R8_seRAC.js";
import { useEffect as r, useRef as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/widgets/Metric.tsx
var c = /* @__PURE__ */ e({ Metric: () => u }), l = 600;
function u({ data: e }) {
	let { value: c, delta: u, unit: m, label: h, trend: g } = f(e), _ = n(c), v = i(null), [y, b] = a(null);
	return r(() => {
		let e = v.current;
		if (v.current = c, e == null || e === c) return;
		b(c > e ? "up" : "down");
		let t = setTimeout(() => b(null), l);
		return () => clearTimeout(t);
	}, [c]), /* @__PURE__ */ s("div", {
		className: "flex flex-col items-center justify-center h-full gap-1",
		children: [
			/* @__PURE__ */ s("div", {
				className: `text-3xl font-bold tabular-nums transition-colors duration-300 ${y === "up" ? "text-emerald-300" : y === "down" ? "text-red-300" : "text-white"}`,
				children: [t(_), m && /* @__PURE__ */ o("span", {
					className: "text-base font-normal text-zinc-400 ml-1",
					children: m
				})]
			}),
			u != null && /* @__PURE__ */ s("div", {
				className: `text-sm font-medium ${u >= 0 ? "text-emerald-400" : "text-red-400"}`,
				children: [
					u >= 0 ? "▲" : "▼",
					" ",
					p(u)
				]
			}),
			g && g.length >= 2 && /* @__PURE__ */ o(d, { values: g }),
			h && /* @__PURE__ */ o("div", {
				className: "text-xs text-zinc-500",
				children: h
			})
		]
	});
}
function d({ values: e }) {
	let t = Math.min(...e), n = Math.max(...e) - t || 1, r = e[e.length - 1] >= e[0] ? "var(--mtc-ok)" : "var(--mtc-danger)", i = e.map((r, i) => {
		let a = i / (e.length - 1) * 100, o = 18 - (r - t) / n * 16 - 1;
		return `${a.toFixed(1)},${o.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ o("svg", {
		viewBox: "0 0 100 18",
		className: "w-full max-w-[120px] h-5",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ o("polyline", {
			fill: "none",
			stroke: r,
			strokeWidth: "1.5",
			points: i,
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function f(e) {
	if (typeof e == "number") return { value: e };
	if (typeof e == "object" && e) {
		let t = e;
		return {
			value: Number(t.value ?? 0),
			delta: t.delta == null ? void 0 : Number(t.delta),
			unit: t.unit == null ? void 0 : String(t.unit),
			label: t.label == null ? void 0 : String(t.label),
			trend: Array.isArray(t.trend) && t.trend.every((e) => typeof e == "number") ? t.trend : void 0
		};
	}
	return { value: 0 };
}
function p(e) {
	let t = Math.abs(e) <= 1 ? e * 100 : e;
	return `${Math.abs(t).toFixed(2)}%`;
}
//#endregion
export { c as n, u as t };
