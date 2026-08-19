import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { useMemo as n } from "react";
import { jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/widgets/VolumeProfile.tsx
var a = /* @__PURE__ */ e({ VolumeProfile: () => o });
function o({ data: e }) {
	let a = n(() => s(e), [e]);
	if (!a || a.length === 0) return /* @__PURE__ */ r(t, { children: "No data" });
	let o = Math.max(...a.map((e) => e.volume), 1);
	return /* @__PURE__ */ r("div", {
		className: "h-full overflow-auto",
		children: /* @__PURE__ */ r("div", {
			className: "flex flex-col gap-px font-mono text-[10px]",
			children: a.map((e, t) => {
				let n = e.volume / o * 100;
				return /* @__PURE__ */ i("div", {
					className: "relative flex items-center px-2 py-0.5",
					title: `${e.price} — ${e.volume.toLocaleString()}`,
					children: [
						/* @__PURE__ */ r("div", {
							className: "absolute inset-y-0.5 left-16 bg-sky-500/20 rounded-sm",
							style: {
								width: `${n}%`,
								maxWidth: "calc(100% - 4.5rem)"
							}
						}),
						/* @__PURE__ */ r("span", {
							className: "relative w-14 shrink-0 text-zinc-300 tabular-nums",
							children: c(e.price)
						}),
						/* @__PURE__ */ r("span", {
							className: "relative ml-auto text-zinc-400 tabular-nums",
							children: l(e.volume)
						})
					]
				}, t);
			})
		})
	});
}
function s(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.rows) ? t = n.rows : Array.isArray(n.levels) && (t = n.levels);
	}
	if (!t) return null;
	let n = t.map((e) => {
		let t = e;
		return {
			price: Number(t.price ?? 0),
			volume: Number(t.volume ?? t.size ?? 0)
		};
	}).filter((e) => Number.isFinite(e.price) && Number.isFinite(e.volume) && e.volume > 0);
	return n.length === 0 ? null : (n.sort((e, t) => t.price - e.price), n);
}
function c(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
}
function l(e) {
	return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(0);
}
//#endregion
export { a as n, o as t };
