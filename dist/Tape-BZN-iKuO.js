import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { c as n } from "./format-V6rpoQ-_.js";
import { useEffect as r, useRef as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/widgets/Tape.tsx
var c = /* @__PURE__ */ e({ Tape: () => h }), l = 500, u = 800;
function d(e) {
	return e.id ? `id:${e.id}` : `t:${e.timestamp ?? ""}|p:${e.price ?? ""}|s:${e.size ?? ""}|x:${e.label ?? ""}`;
}
function f(e) {
	let t = (e ?? "").toLowerCase();
	return t === "buy" || t === "bid" ? {
		row: "bg-emerald-500/5",
		text: "text-emerald-400"
	} : t === "sell" || t === "ask" ? {
		row: "bg-red-500/5",
		text: "text-red-400"
	} : {
		row: "",
		text: "text-zinc-300"
	};
}
function p(e) {
	if (e == null) return [];
	if (Array.isArray(e)) return e.map(m);
	if (typeof e == "object") {
		let t = e;
		return Array.isArray(t.events) ? t.events.map(m) : Array.isArray(t.items) ? t.items.map(m) : [m(t)];
	}
	return [];
}
function m(e) {
	if (typeof e != "object" || !e) return {};
	let t = e;
	return {
		id: t.id == null ? void 0 : String(t.id),
		timestamp: t.timestamp == null ? t.time == null ? t.ts == null ? void 0 : t.ts : t.time : t.timestamp,
		price: typeof t.price == "number" ? t.price : void 0,
		size: typeof t.size == "number" ? t.size : typeof t.qty == "number" ? t.qty : typeof t.amount == "number" ? t.amount : void 0,
		side: t.side == null ? void 0 : String(t.side).toLowerCase(),
		label: t.label == null ? t.text == null ? t.title == null ? void 0 : String(t.title) : String(t.text) : String(t.label)
	};
}
function h({ data: e, options: n }) {
	let c = n?.cap || l, m = p(e), [h, y] = a([]), b = i(/* @__PURE__ */ new Set()), x = i(!1);
	if (r(() => {
		if (m.length === 0) return;
		let e = [];
		for (let t of m) {
			let n = d(t);
			b.current.has(n) || (b.current.add(n), e.push({
				...t,
				_key: n,
				_receivedAt: Date.now()
			}));
		}
		e.length !== 0 && (y((t) => {
			let n = [...e.reverse(), ...t];
			if (n.length <= c) return n;
			for (let e of n.slice(c)) b.current.delete(e._key);
			return n.slice(0, c);
		}), x.current ||= !0);
	}, [e, c]), h.length === 0) return /* @__PURE__ */ o(t, { children: "No prints yet" });
	let S = Date.now() - u;
	return /* @__PURE__ */ o("div", {
		className: "h-full overflow-auto text-xs font-mono",
		children: h.map((e) => {
			let t = f(e.side);
			return /* @__PURE__ */ s("div", {
				className: `grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${e._receivedAt > S && x.current ? "bg-sky-500/10" : t.row}`,
				children: [
					/* @__PURE__ */ o("span", {
						className: "text-zinc-500 tabular-nums truncate",
						children: e.timestamp == null ? "" : g(e.timestamp)
					}),
					/* @__PURE__ */ o("span", {
						className: `truncate ${t.text}`,
						children: e.label ?? e.side?.toUpperCase() ?? "·"
					}),
					/* @__PURE__ */ o("span", {
						className: `text-right tabular-nums ${t.text}`,
						children: e.price == null ? "" : _(e.price)
					}),
					/* @__PURE__ */ o("span", {
						className: "text-right tabular-nums text-zinc-400",
						children: e.size == null ? "" : v(e.size)
					})
				]
			}, e._key);
		})
	});
}
function g(e) {
	try {
		let t = new Date(e);
		return isNaN(t.getTime()) ? String(e) : `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
	} catch {
		return n(e);
	}
}
function _(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(Math.abs(e) < 1 ? 4 : 2);
}
function v(e) {
	return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
//#endregion
export { c as n, h as t };
