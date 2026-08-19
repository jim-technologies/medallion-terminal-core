import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { useMemo as n } from "react";
import { jsx as r } from "react/jsx-runtime";
//#region src/widgets/Sparkline.tsx
var i = /* @__PURE__ */ e({ Sparkline: () => a });
function a({ data: e, options: i }) {
	let a = i ?? {}, s = n(() => o(e), [e]);
	if (!s || s.length < 2) return /* @__PURE__ */ r(t, { children: "No data" });
	let c = Math.min(...s), l = Math.max(...s) - c || 1, u = s[s.length - 1] >= s[0];
	return /* @__PURE__ */ r("div", {
		className: "h-full w-full flex items-center justify-center",
		children: /* @__PURE__ */ r("svg", {
			viewBox: "0 0 100 24",
			className: "w-full h-full",
			preserveAspectRatio: "none",
			children: /* @__PURE__ */ r("polyline", {
				fill: "none",
				stroke: a.color ?? (u ? "var(--mtc-ok)" : "var(--mtc-danger)"),
				strokeWidth: "1.5",
				points: s.map((e, t) => {
					let n = t / (s.length - 1) * 100, r = 22 - (e - c) / l * 20 - 1;
					return `${n.toFixed(1)},${r.toFixed(1)}`;
				}).join(" "),
				vectorEffect: "non-scaling-stroke"
			})
		})
	});
}
function o(e) {
	if (Array.isArray(e)) {
		if (e.every((e) => typeof e == "number")) return e;
		if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) return e.map((e) => {
			let t = e;
			return typeof t.value == "number" ? t.value : Number(t.y ?? t.v ?? NaN);
		}).filter((e) => Number.isFinite(e));
	}
	if (e && typeof e == "object") {
		let t = e;
		if (Array.isArray(t.values) && t.values.every((e) => typeof e == "number")) return t.values;
	}
	return null;
}
//#endregion
export { i as n, a as t };
