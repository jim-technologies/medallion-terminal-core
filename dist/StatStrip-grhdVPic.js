import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-B8rxYV_S.js";
import { s as n } from "./format-V6rpoQ-_.js";
import { t as r } from "./useAnimatedNumber-R8_seRAC.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/widgets/StatStrip.tsx
var s = /* @__PURE__ */ e({ StatStrip: () => c });
function c({ data: e }) {
	let n = i(() => d(e), [e]);
	return !n || n.length === 0 ? /* @__PURE__ */ a(t, { children: "No data" }) : /* @__PURE__ */ a("div", {
		className: "h-full overflow-x-auto overflow-y-hidden",
		children: /* @__PURE__ */ a("div", {
			className: "flex items-stretch gap-3 h-full",
			children: n.map((e, t) => /* @__PURE__ */ a(l, { stat: e }, t))
		})
	});
}
function l({ stat: e }) {
	let t = r(e.value), i = e.delta == null ? "" : e.delta >= 0 ? "text-emerald-400" : "text-red-400";
	return /* @__PURE__ */ o("div", {
		className: "shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0",
		children: [
			/* @__PURE__ */ a("div", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate",
				children: e.label
			}),
			/* @__PURE__ */ o("div", {
				className: "flex items-baseline gap-1",
				children: [/* @__PURE__ */ a("span", {
					className: "text-base font-semibold text-zinc-100 tabular-nums truncate",
					children: n(t)
				}), e.unit && /* @__PURE__ */ a("span", {
					className: "text-[10px] text-zinc-500 shrink-0",
					children: e.unit
				})]
			}),
			/* @__PURE__ */ o("div", {
				className: "flex items-center gap-2",
				children: [e.delta != null && /* @__PURE__ */ o("span", {
					className: `text-[10px] font-medium tabular-nums ${i}`,
					children: [
						e.delta >= 0 ? "▲" : "▼",
						" ",
						f(e.delta)
					]
				}), e.trend && e.trend.length >= 2 && /* @__PURE__ */ a(u, { values: e.trend })]
			})
		]
	});
}
function u({ values: e }) {
	let t = Math.min(...e), n = Math.max(...e) - t || 1, r = e[e.length - 1] >= e[0], i = e.map((r, i) => {
		let a = i / (e.length - 1) * 100, o = 18 - (r - t) / n * 16 - 1;
		return `${a.toFixed(1)},${o.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ a("svg", {
		viewBox: "0 0 100 18",
		className: "w-12 h-3.5",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ a("polyline", {
			fill: "none",
			stroke: r ? "var(--mtc-ok)" : "var(--mtc-danger)",
			strokeWidth: "1.5",
			points: i,
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function d(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.stats) ? t = n.stats : Array.isArray(n.metrics) && (t = n.metrics);
	}
	if (!t) return null;
	let n = t.map((e) => {
		let t = e;
		return {
			label: String(t.label ?? ""),
			value: Number(t.value ?? 0),
			delta: typeof t.delta == "number" ? t.delta : void 0,
			unit: t.unit == null ? void 0 : String(t.unit),
			trend: Array.isArray(t.trend) && t.trend.every((e) => typeof e == "number") ? t.trend : void 0
		};
	}).filter((e) => Number.isFinite(e.value));
	return n.length > 0 ? n : null;
}
function f(e) {
	let t = Math.abs(e) <= 1 ? e * 100 : e;
	return `${Math.abs(t).toFixed(2)}%`;
}
//#endregion
export { s as n, c as t };
