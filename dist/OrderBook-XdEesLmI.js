import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, H as n, It as r } from "./MultiDashboard-B8rxYV_S.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/widgets/OrderBook.tsx
var s = /* @__PURE__ */ e({ OrderBook: () => l }), c = 10;
function l({ data: e, options: s }) {
	let { setCtx: l } = t(), f = i(() => n(e), [e]), p = s?.price_context, m = p ? (e, t) => {
		l(p.key, String(e)), p.side_key && l(p.side_key, t === "bid" ? "buy" : "sell");
	} : void 0;
	if (!f) return /* @__PURE__ */ a(r, { children: "No data" });
	let h = f.bids[0]?.price, g = f.asks[0]?.price, _ = f.mid ?? (h != null && g != null ? (h + g) / 2 : 0), v = f.spread ?? (h != null && g != null ? g - h : 0), y = f.bids.slice(0, c), b = f.asks.slice(0, c).reverse(), x = Math.max(...f.bids.map((e) => e.size), ...f.asks.map((e) => e.size), 1);
	return /* @__PURE__ */ o("div", {
		className: "h-full flex flex-col text-xs font-mono",
		children: [
			/* @__PURE__ */ o("div", {
				className: "grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800",
				children: [
					/* @__PURE__ */ a("span", { children: "Price" }),
					/* @__PURE__ */ a("span", {
						className: "text-right",
						children: "Size"
					}),
					/* @__PURE__ */ a("span", {
						className: "text-right",
						children: "Cum"
					})
				]
			}),
			/* @__PURE__ */ o("div", {
				className: "flex-1 flex flex-col min-h-0",
				children: [
					/* @__PURE__ */ a("div", {
						className: "flex-1 overflow-auto",
						children: b.map((e, t) => {
							let n = b.slice(t).reduce((e, t) => e + t.size, 0);
							return /* @__PURE__ */ a(u, {
								side: "ask",
								level: e,
								cum: n,
								maxSize: x,
								onPrice: m
							}, `ask-${t}`);
						})
					}),
					/* @__PURE__ */ o("div", {
						className: "border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0",
						children: [/* @__PURE__ */ a("span", {
							className: "text-zinc-200 tabular-nums",
							children: d(_)
						}), /* @__PURE__ */ o("span", {
							className: "text-zinc-500 text-[10px]",
							children: ["spread ", d(v)]
						})]
					}),
					/* @__PURE__ */ a("div", {
						className: "flex-1 overflow-auto",
						children: y.map((e, t) => {
							let n = y.slice(0, t + 1).reduce((e, t) => e + t.size, 0);
							return /* @__PURE__ */ a(u, {
								side: "bid",
								level: e,
								cum: n,
								maxSize: x,
								onPrice: m
							}, `bid-${t}`);
						})
					})
				]
			}),
			f.venue && /* @__PURE__ */ a("div", {
				className: "text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0",
				children: f.venue
			})
		]
	});
}
function u({ side: e, level: t, cum: n, maxSize: r, onPrice: i }) {
	let s = t.size / r * 100, c = e === "bid" ? "bg-emerald-500/10" : "bg-red-500/10", l = e === "bid" ? "text-emerald-400" : "text-red-400";
	return /* @__PURE__ */ o("div", {
		onClick: i ? () => i(t.price, e) : void 0,
		className: `relative grid grid-cols-3 gap-2 px-2 py-0.5 ${i ? "cursor-pointer hover:bg-zinc-800/40" : ""}`,
		children: [
			/* @__PURE__ */ a("div", {
				className: `absolute inset-y-0 right-0 ${c}`,
				style: { width: `${s}%` }
			}),
			/* @__PURE__ */ a("span", {
				className: `relative ${l} tabular-nums`,
				children: d(t.price)
			}),
			/* @__PURE__ */ a("span", {
				className: "relative text-right text-zinc-200 tabular-nums",
				children: f(t.size)
			}),
			/* @__PURE__ */ a("span", {
				className: "relative text-right text-zinc-500 tabular-nums",
				children: f(n)
			})
		]
	});
}
function d(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(2);
}
function f(e) {
	return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
//#endregion
export { s as n, l as t };
