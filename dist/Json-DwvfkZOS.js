import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { useMemo as n } from "react";
import { jsx as r } from "react/jsx-runtime";
//#region src/widgets/Json.tsx
var i = /* @__PURE__ */ e({ Json: () => a });
function a({ data: e }) {
	let i = n(() => {
		if (e == null) return "";
		try {
			return JSON.stringify(e, null, 2);
		} catch {
			return String(e);
		}
	}, [e]);
	return i ? /* @__PURE__ */ r("pre", {
		className: "text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed",
		children: o(i)
	}) : /* @__PURE__ */ r(t, { children: "No data" });
}
function o(e) {
	let t = [], n = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, i = 0, a;
	for (; (a = n.exec(e)) != null;) a.index > i && t.push({ text: e.slice(i, a.index) }), a[1] ? (t.push({
		text: a[1],
		color: a[2] ? "var(--mtc-code-key)" : "var(--mtc-code-string)"
	}), a[2] && t.push({ text: a[2] })) : a[3] ? t.push({
		text: a[3],
		color: "var(--mtc-code-literal)"
	}) : a[4] && t.push({
		text: a[4],
		color: "var(--mtc-code-number)"
	}), i = n.lastIndex;
	return i < e.length && t.push({ text: e.slice(i) }), t.map((e, t) => e.color ? /* @__PURE__ */ r("span", {
		style: { color: e.color },
		children: e.text
	}, t) : e.text);
}
//#endregion
export { i as n, a as t };
