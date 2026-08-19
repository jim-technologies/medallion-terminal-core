import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { useMemo as n } from "react";
import { jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/widgets/Ticker.tsx
var a = /* @__PURE__ */ e({ Ticker: () => c }), o = {
	EVENT_STATUS_OK: "border-emerald-500/40 text-emerald-300",
	EVENT_STATUS_WARN: "border-amber-500/40   text-amber-300",
	EVENT_STATUS_ERROR: "border-red-500/40     text-red-300",
	EVENT_STATUS_INFO: "border-sky-500/40     text-sky-300",
	EVENT_STATUS_PENDING: "border-zinc-500/40    text-zinc-300",
	ok: "border-emerald-500/40 text-emerald-300",
	warn: "border-amber-500/40   text-amber-300",
	error: "border-red-500/40     text-red-300",
	info: "border-sky-500/40     text-sky-300",
	pending: "border-zinc-500/40    text-zinc-300"
}, s = "border-zinc-700 text-zinc-300";
function c({ data: e, options: a }) {
	let o = n(() => u(e), [e]);
	return !o || o.length === 0 ? /* @__PURE__ */ r(t, { children: "No items" }) : /* @__PURE__ */ r("div", {
		className: "h-full overflow-hidden flex items-center group",
		children: /* @__PURE__ */ i("div", {
			className: "flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]",
			style: { animationDuration: `${Math.max(5, (a ?? {}).speed_seconds ?? 30)}s` },
			children: [o.map((e, t) => /* @__PURE__ */ r(l, { item: e }, `a-${t}`)), o.map((e, t) => /* @__PURE__ */ r(l, {
				item: e,
				"aria-hidden": !0
			}, `b-${t}`))]
		})
	});
}
function l({ item: e, ...t }) {
	let n = o[e.status ?? ""] ?? s;
	return /* @__PURE__ */ i("div", {
		...t,
		className: `shrink-0 px-2.5 py-1 rounded border bg-zinc-900/40 text-xs flex items-center gap-2 font-mono ${n}`,
		children: [/* @__PURE__ */ r("span", {
			className: "text-[10px] text-zinc-500 tabular-nums",
			children: e.timestamp
		}), /* @__PURE__ */ r("span", { children: e.label })]
	});
}
function u(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.events) ? t = n.events : Array.isArray(n.items) && (t = n.items);
	}
	return t ? t.map((e) => {
		let t = e;
		return {
			timestamp: String(t.timestamp ?? ""),
			label: String(t.label ?? ""),
			status: t.status == null ? void 0 : String(t.status)
		};
	}) : null;
}
//#endregion
export { a as n, c as t };
