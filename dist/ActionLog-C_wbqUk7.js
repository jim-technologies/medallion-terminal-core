import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, yt as r } from "./MultiDashboard-B8rxYV_S.js";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/widgets/ActionLog.tsx
var o = /* @__PURE__ */ e({ ActionLog: () => f }), s = {
	ACTION_STATUS_OK: {
		dot: "bg-emerald-400",
		text: "text-emerald-300"
	},
	ACTION_STATUS_ACCEPTED: {
		dot: "bg-amber-400",
		text: "text-amber-300"
	},
	ACTION_STATUS_PENDING: {
		dot: "bg-amber-400",
		text: "text-amber-300"
	},
	ACTION_STATUS_REJECTED: {
		dot: "bg-red-400",
		text: "text-red-300"
	},
	ACTION_STATUS_FAILED: {
		dot: "bg-red-400",
		text: "text-red-300"
	},
	ACTION_STATUS_CANCELLED: {
		dot: "bg-zinc-400",
		text: "text-zinc-300"
	}
}, c = {
	dot: "bg-zinc-500",
	text: "text-zinc-400"
};
function l(e) {
	return e.replace(/^ACTION_STATUS_/, "").toLowerCase();
}
function u(e) {
	return e ? e.length <= 8 ? e : e.slice(0, 6) + "…" : "";
}
function d(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function f({ options: e }) {
	let { recentActions: o, clearRecentActions: f } = t(), p = e?.limit || 25, m = r(o.length > 0), h = o.slice(0, p);
	return h.length === 0 ? /* @__PURE__ */ i(n, { children: "No actions yet" }) : /* @__PURE__ */ a("div", {
		className: "h-full flex flex-col text-xs font-mono",
		children: [/* @__PURE__ */ a("div", {
			className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0",
			children: [/* @__PURE__ */ a("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: [
					o.length,
					" action",
					o.length === 1 ? "" : "s"
				]
			}), /* @__PURE__ */ i("button", {
				onClick: f,
				className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
				title: "Clear log",
				children: "Clear"
			})]
		}), /* @__PURE__ */ i("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: h.map((e, t) => {
				let n = s[e.status] ?? c;
				return /* @__PURE__ */ a("div", {
					className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
					title: e.message ?? "",
					children: [
						/* @__PURE__ */ i("span", {
							className: "text-zinc-500 shrink-0 w-8 tabular-nums",
							children: d(m, e.receivedAt)
						}),
						/* @__PURE__ */ i("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${n.dot}` }),
						/* @__PURE__ */ i("span", {
							className: "text-zinc-200 shrink-0",
							children: e.actionId
						}),
						/* @__PURE__ */ i("span", {
							className: `uppercase tracking-wider text-[10px] shrink-0 ${n.text}`,
							children: l(e.status)
						}),
						e.message && /* @__PURE__ */ i("span", {
							className: "text-zinc-400 truncate flex-1 min-w-0",
							children: e.message
						}),
						/* @__PURE__ */ i("span", {
							className: "text-zinc-500 text-[10px] shrink-0",
							children: u(e.clientRequestId)
						})
					]
				}, `${e.clientRequestId}-${e.receivedAt}-${t}`);
			})
		})]
	});
}
//#endregion
export { o as n, f as t };
