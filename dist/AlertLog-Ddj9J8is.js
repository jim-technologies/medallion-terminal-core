import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, yt as r } from "./MultiDashboard-B8rxYV_S.js";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/widgets/AlertLog.tsx
var o = /* @__PURE__ */ e({ AlertLog: () => l }), s = {
	error: {
		dot: "bg-red-400",
		text: "text-red-300"
	},
	warn: {
		dot: "bg-amber-400",
		text: "text-amber-300"
	},
	ok: {
		dot: "bg-emerald-400",
		text: "text-emerald-300"
	},
	info: {
		dot: "bg-sky-400",
		text: "text-sky-300"
	}
};
function c(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function l({ options: e }) {
	let { recentAlerts: o, clearRecentAlerts: l } = t(), u = e?.limit || 50, d = r(o.length > 0), f = o.slice(0, u);
	return f.length === 0 ? /* @__PURE__ */ i(n, { children: "No alerts" }) : /* @__PURE__ */ a("div", {
		className: "h-full flex flex-col text-xs font-mono",
		children: [/* @__PURE__ */ a("div", {
			className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0",
			children: [/* @__PURE__ */ a("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: [
					o.length,
					" alert",
					o.length === 1 ? "" : "s"
				]
			}), /* @__PURE__ */ i("button", {
				onClick: l,
				className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
				title: "Clear log",
				children: "Clear"
			})]
		}), /* @__PURE__ */ i("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: f.map((e, t) => {
				let n = s[e.severity] ?? s.warn;
				return /* @__PURE__ */ a("div", {
					className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
					title: e.predicate,
					children: [
						/* @__PURE__ */ i("span", {
							className: "text-zinc-500 shrink-0 w-8 tabular-nums",
							children: c(d, e.receivedAt)
						}),
						/* @__PURE__ */ i("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${n.dot}` }),
						/* @__PURE__ */ i("span", {
							className: `uppercase tracking-wider text-[10px] shrink-0 ${n.text}`,
							children: e.severity
						}),
						/* @__PURE__ */ i("span", {
							className: "text-zinc-200 truncate flex-1 min-w-0",
							children: e.message
						}),
						e.widgetId && /* @__PURE__ */ i("span", {
							className: "text-zinc-600 text-[10px] shrink-0",
							children: e.widgetId
						})
					]
				}, `${e.receivedAt}-${t}`);
			})
		})]
	});
}
//#endregion
export { o as n, l as t };
