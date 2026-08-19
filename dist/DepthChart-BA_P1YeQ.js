import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, H as n, It as r, V as i } from "./MultiDashboard-CwQKjnza.js";
import { r as a, t as o } from "./format-V6rpoQ-_.js";
import { useId as s, useMemo as c } from "react";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
import { Area as d, AreaChart as f, CartesianGrid as p, ReferenceLine as m, ResponsiveContainer as h, Tooltip as g, XAxis as _, YAxis as v } from "recharts";
//#region src/widgets/DepthChart.tsx
var y = /* @__PURE__ */ e({ DepthChart: () => C }), b = "var(--mtc-grid)", x = "var(--mtc-border)", S = "var(--mtc-muted)";
function C({ data: e, options: y }) {
	let { setCtx: C } = t(), T = y ?? {}, E = c(() => n(e), [e]), D = c(() => E ? i(E, T.max_levels, T.cumulative).map((e) => ({
		price: e.price,
		side: e.side,
		...e.side === "bid" ? { bid: e.cumulative } : { ask: e.cumulative }
	})) : [], [
		E,
		T.max_levels,
		T.cumulative
	]), O = `depth-${s().replace(/[^a-zA-Z0-9_-]/g, "")}`;
	if (!E || D.length === 0) return /* @__PURE__ */ l(r, { children: "No data" });
	let k = E.bids[0]?.price, A = E.asks[0]?.price, j = E.mid ?? (k !== void 0 && A !== void 0 ? (k + A) / 2 : void 0), M = E.spread ?? (k !== void 0 && A !== void 0 ? A - k : void 0), N = T.price_context, P = (e) => {
		if (!N || !e || typeof e != "object") return;
		let t = e.activePayload?.[0]?.payload;
		t && (C(N.key, String(t.price)), N.side_key && C(N.side_key, t.side === "bid" ? "buy" : "sell"));
	}, F = Math.max(0, ...D.flatMap((e) => e.bid === void 0 ? [] : [e.bid])), I = Math.max(0, ...D.flatMap((e) => e.ask === void 0 ? [] : [e.ask])), L = T.cumulative === "notional" ? T.quote_unit : void 0;
	return /* @__PURE__ */ u("div", {
		className: "h-full min-h-0 flex flex-col",
		children: [/* @__PURE__ */ l("div", {
			className: N ? "flex-1 min-h-0 cursor-crosshair" : "flex-1 min-h-0",
			role: "img",
			"aria-label": `Market depth with ${E.bids.length} bid levels and ${E.asks.length} ask levels`,
			children: /* @__PURE__ */ l(h, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ u(f, {
					data: D,
					margin: {
						top: 8,
						right: 10,
						bottom: 0,
						left: 0
					},
					onClick: P,
					children: [
						/* @__PURE__ */ u("defs", { children: [/* @__PURE__ */ u("linearGradient", {
							id: `${O}-bid`,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ l("stop", {
								offset: "0%",
								stopColor: "var(--mtc-ok)",
								stopOpacity: .42
							}), /* @__PURE__ */ l("stop", {
								offset: "100%",
								stopColor: "var(--mtc-ok)",
								stopOpacity: .04
							})]
						}), /* @__PURE__ */ u("linearGradient", {
							id: `${O}-ask`,
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ l("stop", {
								offset: "0%",
								stopColor: "var(--mtc-danger)",
								stopOpacity: .42
							}), /* @__PURE__ */ l("stop", {
								offset: "100%",
								stopColor: "var(--mtc-danger)",
								stopOpacity: .04
							})]
						})] }),
						/* @__PURE__ */ l(p, {
							strokeDasharray: "3 3",
							stroke: b,
							vertical: !1
						}),
						/* @__PURE__ */ l(_, {
							type: "number",
							dataKey: "price",
							domain: ["dataMin", "dataMax"],
							stroke: x,
							tick: {
								fontSize: 10,
								fill: S
							},
							tickFormatter: w,
							minTickGap: 28
						}),
						/* @__PURE__ */ l(v, {
							stroke: x,
							tick: {
								fontSize: 10,
								fill: S
							},
							tickFormatter: o,
							width: 48
						}),
						/* @__PURE__ */ l(g, {
							contentStyle: {
								background: "var(--mtc-surface-raised)",
								border: "1px solid var(--mtc-border-strong)",
								borderRadius: 4,
								color: "var(--mtc-fg)",
								fontSize: 11
							},
							labelFormatter: (e) => `Price ${w(Number(e))}`,
							formatter: (e, t) => [`${a(Number(e))}${L ? ` ${L}` : ""}`, t === "bid" ? "Bid depth" : "Ask depth"]
						}),
						j !== void 0 && /* @__PURE__ */ l(m, {
							x: j,
							stroke: "var(--mtc-muted-subtle)",
							strokeDasharray: "4 4",
							label: {
								value: "mid",
								fill: S,
								fontSize: 9,
								position: "insideTopRight"
							}
						}),
						/* @__PURE__ */ l(d, {
							type: "stepAfter",
							dataKey: "bid",
							stroke: "var(--mtc-ok)",
							fill: `url(#${O}-bid)`,
							strokeWidth: 1.5,
							connectNulls: !1,
							isAnimationActive: !1
						}),
						/* @__PURE__ */ l(d, {
							type: "stepBefore",
							dataKey: "ask",
							stroke: "var(--mtc-danger)",
							fill: `url(#${O}-ask)`,
							strokeWidth: 1.5,
							connectNulls: !1,
							isAnimationActive: !1
						})
					]
				})
			})
		}), /* @__PURE__ */ u("div", {
			className: "grid grid-cols-3 items-center gap-2 px-2 pt-1 text-[10px] font-mono text-zinc-500 shrink-0",
			children: [
				/* @__PURE__ */ u("span", {
					className: "text-emerald-400/90",
					children: ["bid ", a(F)]
				}),
				/* @__PURE__ */ l("span", {
					className: "text-center",
					children: M === void 0 ? "—" : `spread ${w(M)}`
				}),
				/* @__PURE__ */ u("span", {
					className: "text-right text-red-400/90",
					children: ["ask ", a(I)]
				})
			]
		})]
	});
}
function w(e) {
	return Number.isFinite(e) ? Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : Math.abs(e) >= 1 ? e.toFixed(2) : e.toPrecision(4) : "—";
}
//#endregion
export { y as n, C as t };
