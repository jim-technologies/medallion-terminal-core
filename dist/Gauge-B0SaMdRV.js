import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
//#region src/widgets/Gauge.tsx
var i = /* @__PURE__ */ e({ Gauge: () => s }), a = {
	ok: "var(--mtc-ok)",
	warn: "var(--mtc-warning)",
	danger: "var(--mtc-danger)",
	error: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	muted: "var(--mtc-muted)"
}, o = "M 16 104 A 84 84 0 0 1 184 104";
function s({ data: e }) {
	let i = c(e);
	if (!i) return /* @__PURE__ */ n(t, { children: "No data" });
	let s = i.max - i.min, u = s > 0 ? Math.max(0, Math.min(1, (i.value - i.min) / s)) : 0, d = a[i.bands.find((e) => i.value >= e.from && i.value <= e.to)?.color ?? "info"] ?? a.info;
	return /* @__PURE__ */ r("div", {
		className: "flex flex-col items-center justify-center h-full gap-1",
		children: [/* @__PURE__ */ r("svg", {
			viewBox: "0 0 200 120",
			className: "w-full max-w-[260px]",
			children: [
				/* @__PURE__ */ n("path", {
					d: o,
					fill: "none",
					stroke: "var(--mtc-grid)",
					strokeWidth: "16",
					pathLength: "100"
				}),
				i.bands.map((e, t) => {
					let r = (e.from - i.min) / s, c = (e.to - i.min) / s;
					return /* @__PURE__ */ n("path", {
						d: o,
						fill: "none",
						stroke: a[e.color] ?? a.muted,
						strokeWidth: "16",
						opacity: .22,
						pathLength: "100",
						strokeDasharray: `${(c - r) * 100} 100`,
						strokeDashoffset: -r * 100
					}, t);
				}),
				/* @__PURE__ */ n("path", {
					d: o,
					fill: "none",
					stroke: d,
					strokeWidth: "16",
					strokeLinecap: "round",
					pathLength: "100",
					strokeDasharray: `${u * 100} 100`
				}),
				/* @__PURE__ */ n("text", {
					x: "100",
					y: "92",
					textAnchor: "middle",
					fill: "var(--mtc-fg)",
					style: {
						fontSize: 22,
						fontWeight: 700,
						fontVariantNumeric: "tabular-nums"
					},
					children: l(i.value, i.min, i.max)
				})
			]
		}), i.label && /* @__PURE__ */ n("div", {
			className: "text-xs text-zinc-500 text-center px-2 truncate max-w-full",
			children: i.label
		})]
	});
}
function c(e) {
	if (typeof e != "object" || !e) return null;
	let t = e;
	if (typeof t.value != "number") return null;
	let n = typeof t.min == "number" ? t.min : 0, r = typeof t.max == "number" ? t.max : 1, i = Array.isArray(t.bands) ? t.bands.map((e) => {
		let t = e;
		return {
			from: Number(t.from ?? 0),
			to: Number(t.to ?? 0),
			color: String(t.color ?? "info")
		};
	}) : [];
	return {
		value: t.value,
		min: n,
		max: r,
		bands: i,
		label: t.label == null ? void 0 : String(t.label)
	};
}
function l(e, t, n) {
	return t === 0 && n === 1 ? `${(e * 100).toFixed(1)}%` : t === -1 && n === 1 ? e >= 0 ? `+${e.toFixed(2)}` : e.toFixed(2) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
//#endregion
export { i as n, s as t };
