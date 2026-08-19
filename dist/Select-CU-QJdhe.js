import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-CwQKjnza.js";
import { useEffect as r, useId as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/widgets/selectHelpers.ts
function s(e, t, n) {
	if (e !== void 0 && e !== "") return {
		current: e,
		shouldSync: !1
	};
	let r = t || n[0]?.value || "";
	return {
		current: r,
		shouldSync: r !== ""
	};
}
//#endregion
//#region src/widgets/Select.tsx
var c = /* @__PURE__ */ e({ Select: () => l });
function l({ data: e, options: c }) {
	let l = c ?? {}, { ctx: d, setCtx: f } = t(), p = i(), m = l.key, h = u(e, l), { current: g, shouldSync: _ } = s(m ? d[m] : void 0, l.default, h);
	return r(() => {
		m && _ && f(m, g);
	}, [
		m,
		_,
		g,
		f
	]), m ? h.length === 0 ? /* @__PURE__ */ a(n, { children: "Select has no choices" }) : /* @__PURE__ */ o("div", {
		className: "flex flex-col h-full justify-center gap-1.5 px-2",
		children: [/* @__PURE__ */ a("label", {
			htmlFor: p,
			className: "text-[10px] uppercase tracking-wider text-zinc-500",
			children: l.label ?? l.key
		}), /* @__PURE__ */ a("select", {
			id: p,
			value: g,
			onChange: (e) => f(l.key, e.target.value),
			className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500",
			children: h.map((e) => /* @__PURE__ */ a("option", {
				value: e.value,
				children: e.label
			}, e.value))
		})]
	}) : /* @__PURE__ */ a(n, { children: "Select requires options.key" });
}
function u(e, t) {
	let n = d(e);
	if (n.length > 0) {
		let e = t.value_field ?? "value", r = t.label_field ?? "label";
		return n.map((t) => {
			if (typeof t == "string") return {
				value: t,
				label: t
			};
			if (t && typeof t == "object") {
				let n = t, i = n[e];
				if (typeof i == "string") {
					let e = n[r];
					return {
						value: i,
						label: typeof e == "string" ? e : i
					};
				}
			}
			return null;
		}).filter((e) => e !== null);
	}
	return (t.choices ?? []).map((e) => typeof e == "string" ? {
		value: e,
		label: e
	} : {
		value: e.value,
		label: e.label ?? e.value
	});
}
function d(e) {
	if (Array.isArray(e)) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (Array.isArray(t.rows)) return t.rows;
		if (Array.isArray(t.entries)) return t.entries;
	}
	return [];
}
//#endregion
export { c as n, l as t };
