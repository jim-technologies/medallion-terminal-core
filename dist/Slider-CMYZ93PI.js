import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-CwQKjnza.js";
import { useEffect as r, useRef as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/widgets/Slider.tsx
var c = /* @__PURE__ */ e({ Slider: () => u }), l = 100;
function u({ options: e }) {
	let c = e ?? {}, { ctx: u, setCtx: f } = t(), p = c.min ?? 0, m = c.max ?? 100, h = c.step ?? 1, g = c.label ?? c.key ?? "value", [_, v] = a((() => {
		if (c.key && u[c.key] != null) {
			let e = Number(u[c.key]);
			if (Number.isFinite(e)) return e;
		}
		return c.default == null ? p : c.default;
	})()), y = i(null);
	if (r(() => {
		if (!c.key) return;
		let e = u[c.key];
		if (e == null) return;
		let t = Number(e);
		Number.isFinite(t) && t !== _ && v(t);
	}, [c.key, u[c.key ?? ""]]), !c.key) return /* @__PURE__ */ o(n, { children: "Slider requires options.key" });
	let b = (e) => {
		v(e), y.current && clearTimeout(y.current), y.current = setTimeout(() => {
			f(c.key, String(e));
		}, l);
	};
	return /* @__PURE__ */ s("div", {
		className: "flex flex-col h-full justify-center gap-2 px-2",
		children: [
			/* @__PURE__ */ s("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ o("span", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500",
					children: g
				}), /* @__PURE__ */ s("span", {
					className: "text-sm font-semibold text-zinc-100 tabular-nums",
					children: [d(_, h), c.unit && /* @__PURE__ */ o("span", {
						className: "text-zinc-500 ml-1",
						children: c.unit
					})]
				})]
			}),
			/* @__PURE__ */ o("input", {
				type: "range",
				min: p,
				max: m,
				step: h,
				value: _,
				onChange: (e) => b(Number(e.target.value)),
				className: "w-full accent-sky-500"
			}),
			/* @__PURE__ */ s("div", {
				className: "flex justify-between text-[10px] text-zinc-600 tabular-nums",
				children: [/* @__PURE__ */ o("span", { children: d(p, h) }), /* @__PURE__ */ o("span", { children: d(m, h) })]
			})
		]
	});
}
function d(e, t) {
	let n = t >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(t)));
	return e.toFixed(n);
}
//#endregion
export { c as n, u as t };
