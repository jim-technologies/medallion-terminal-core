import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-CwQKjnza.js";
import { jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/widgets/MultiSelect.tsx
var a = /* @__PURE__ */ e({ MultiSelect: () => o });
function o({ options: e }) {
	let a = e ?? {}, { ctx: o, setCtx: s } = t();
	if (!a.key) return /* @__PURE__ */ r(n, { children: "MultiSelect requires options.key" });
	let c = a.choices ?? [];
	if (c.length === 0) return /* @__PURE__ */ r(n, { children: "MultiSelect requires options.choices" });
	let l = c.map((e) => typeof e == "string" ? {
		value: e,
		label: e
	} : {
		value: e.value,
		label: e.label ?? e.value
	}), u = o[a.key] == null ? a.default ?? [] : o[a.key].split(",").map((e) => e.trim()).filter(Boolean), d = new Set(u), f = (e) => {
		d.has(e) ? d.delete(e) : d.add(e), s(a.key, Array.from(d).join(","));
	};
	return /* @__PURE__ */ i("div", {
		className: "flex flex-col h-full justify-center gap-2 px-2",
		children: [/* @__PURE__ */ i("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ r("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: a.label ?? a.key
			}), /* @__PURE__ */ i("span", {
				className: "text-[10px] text-zinc-600",
				children: [
					d.size,
					" / ",
					l.length
				]
			})]
		}), /* @__PURE__ */ r("div", {
			className: "flex flex-wrap gap-1",
			children: l.map((e) => /* @__PURE__ */ r("button", {
				onClick: () => f(e.value),
				className: `px-2 py-0.5 text-xs rounded border ${d.has(e.value) ? "bg-sky-500/20 border-sky-500/40 text-sky-200" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"}`,
				children: e.label
			}, e.value))
		})]
	});
}
//#endregion
export { a as n, o as t };
