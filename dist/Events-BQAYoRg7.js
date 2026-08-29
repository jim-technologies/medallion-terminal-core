import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-B8rxYV_S.js";
import { useMemo as n, useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/widgets/Events.tsx
var o = /* @__PURE__ */ e({ Events: () => c }), s = {
	EVENT_STATUS_OK: "bg-emerald-500",
	EVENT_STATUS_WARN: "bg-amber-500",
	EVENT_STATUS_ERROR: "bg-red-500",
	EVENT_STATUS_INFO: "bg-sky-500",
	EVENT_STATUS_PENDING: "bg-zinc-500 animate-pulse",
	ok: "bg-emerald-500",
	warn: "bg-amber-500",
	error: "bg-red-500",
	info: "bg-sky-500",
	pending: "bg-zinc-500 animate-pulse"
};
function c({ data: e, options: o }) {
	let c = n(() => l(e), [e]), u = o?.filter === !0, [d, f] = r(""), p = n(() => {
		if (!c) return null;
		if (!d.trim()) return c;
		let e = d.toLowerCase();
		return c.filter((t) => t.label.toLowerCase().includes(e) || (t.body?.toLowerCase().includes(e) ?? !1) || (t.source?.toLowerCase().includes(e) ?? !1) || (t.tags?.some((t) => t.toLowerCase().includes(e)) ?? !1));
	}, [c, d]);
	return !c || c.length === 0 ? /* @__PURE__ */ i(t, { children: "No events" }) : /* @__PURE__ */ a("div", {
		className: "h-full flex flex-col",
		children: [u && /* @__PURE__ */ i("input", {
			type: "text",
			placeholder: "Filter events…",
			value: d,
			onChange: (e) => f(e.target.value),
			className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 mb-2 shrink-0"
		}), /* @__PURE__ */ a("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: [p.length === 0 && /* @__PURE__ */ i("div", {
				className: "flex items-center justify-center h-full text-zinc-500 text-xs",
				children: "No matches"
			}), p.map((e, t) => /* @__PURE__ */ a("div", {
				className: "flex gap-3 px-1 py-2.5 border-b border-zinc-800 last:border-0",
				children: [/* @__PURE__ */ i("div", {
					className: "flex flex-col items-center pt-1.5 shrink-0",
					children: /* @__PURE__ */ i("span", { className: `w-2 h-2 rounded-full ${s[e.status ?? ""] ?? "bg-zinc-600"}` })
				}), /* @__PURE__ */ a("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ a("div", {
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ i("span", {
								className: "text-xs text-zinc-500 tabular-nums shrink-0 font-mono",
								children: e.timestamp
							}), /* @__PURE__ */ i("span", {
								className: "text-sm text-zinc-100 truncate",
								children: e.label
							})]
						}),
						e.body && /* @__PURE__ */ i("div", {
							className: "text-xs text-zinc-400 mt-0.5 line-clamp-2",
							children: e.body
						}),
						(e.source || e.tags && e.tags.length > 0) && /* @__PURE__ */ a("div", {
							className: "flex items-center gap-2 mt-1 text-[10px] text-zinc-500 flex-wrap",
							children: [e.source && /* @__PURE__ */ i("span", {
								className: "text-zinc-500",
								children: e.source
							}), e.tags?.map((e, t) => /* @__PURE__ */ i("span", {
								className: "px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
								children: e
							}, t))]
						})
					]
				})]
			}, t))]
		})]
	});
}
function l(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.events) && (t = n.events);
	}
	return t ? t.map((e) => {
		let t = e;
		return {
			timestamp: String(t.timestamp ?? ""),
			label: String(t.label ?? ""),
			status: t.status == null ? void 0 : String(t.status),
			body: t.body == null ? void 0 : String(t.body),
			source: t.source == null ? void 0 : String(t.source),
			tags: Array.isArray(t.tags) ? t.tags.map(String) : void 0
		};
	}) : null;
}
//#endregion
export { o as n, c as t };
