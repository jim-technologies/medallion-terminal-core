import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, Dt as n, It as r } from "./MultiDashboard-CwQKjnza.js";
import { r as i, t as a } from "./useWatchAction-BphC_EHJ.js";
import { t as o } from "./useSubmitAction-N_8gfZqY.js";
import { useCallback as s, useEffect as c, useRef as l, useState as u } from "react";
import { jsx as d, jsxs as f } from "react/jsx-runtime";
//#region src/widgets/Trade.tsx
var p = /* @__PURE__ */ e({ Trade: () => m });
function m({ options: e, widgetId: p }) {
	let m = e ?? {}, { ctx: g, toast: _, backendUrl: v, emit: y } = t(), { submit: b, submitting: x, result: S } = o(p), C = m.symbol ?? g.symbol ?? "", w = m.url, T = m.action_id ?? "place_order", E = v === void 0 ? w ? "url" : null : "connect", [D, O] = u("buy"), [k, A] = u(""), [j, M] = u(""), N = l(g.price);
	c(() => {
		g.price !== N.current && (N.current = g.price, g.price != null && M(g.price));
	}, [g.price]);
	let P = l(g.side);
	c(() => {
		g.side !== P.current && (P.current = g.side, (g.side === "buy" || g.side === "sell") && O(g.side));
	}, [g.side]);
	let [F, I] = u(!1), L = l(!1), [R, z] = u(null), [B, V] = u(null), [H, U] = u(!1), W = E === "connect" ? x : F;
	c(() => {
		H && U(!1);
	}, [
		k,
		j,
		D
	]);
	let G = s(async () => {
		if (!E || W || E === "url" && L.current) return;
		let e = Number(k);
		if (!Number.isFinite(e) || e <= 0) {
			V("Amount must be a positive number");
			return;
		}
		let t = j ? Number(j) : void 0;
		if (j && (!Number.isFinite(t) || t <= 0)) {
			V("Price must be positive");
			return;
		}
		if (m.confirm && !H) {
			U(!0), V(null), z(null);
			return;
		}
		U(!1);
		let r = {
			symbol: C,
			side: D,
			amount: e,
			type: t == null ? "market" : "limit",
			...t != null && { price: t }
		};
		if (V(null), z(null), E === "connect") {
			await b({
				actionId: T,
				params: r,
				successMessage: "Order completed",
				refresh: !1,
				onComplete: (e) => {
					a(e.status) || (A(""), M(""), U(!1));
				}
			});
			return;
		}
		L.current = !0, I(!0);
		let o = n();
		try {
			let e = await fetch(w, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": o
				},
				body: JSON.stringify(r)
			});
			if (!e.ok) throw Error(`HTTP ${e.status}`);
			let t = await e.json().catch(() => ({})), n = typeof t.message == "string" ? t.message : "Order submitted", s = typeof t.status == "string" && t.status ? t.status : "ACTION_STATUS_OK";
			y({
				type: "action",
				actionId: T,
				clientRequestId: o,
				status: s,
				message: n,
				terminal: t.status == null || i(s)
			}), a(t.status) ? (V(n), _(n, "error")) : (z(n), _(n, "ok"), A(""), M(""), U(!1));
		} catch (e) {
			let t = e instanceof Error ? e.message : "Submit failed";
			V(t), _(t, "error"), y({
				type: "action",
				actionId: T,
				clientRequestId: o,
				status: "ACTION_STATUS_FAILED",
				message: t,
				terminal: !0
			});
		} finally {
			L.current = !1, I(!1);
		}
	}, [
		E,
		w,
		T,
		W,
		k,
		j,
		C,
		D,
		m.confirm,
		H,
		_,
		y,
		b
	]);
	if (c(() => {
		if (!H) return;
		let e = (e) => {
			e.key === "Escape" && U(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [H]), !E) return /* @__PURE__ */ d(r, { children: "Trade requires backendUrl or options.url" });
	let K = (e) => `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${D === e ? e === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"}`, q = D === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
	if (H) {
		let e = j ? Number(j) : null, t = `${D.toUpperCase()} ${k}${m.quote_unit ? ` ${m.quote_unit}` : ""} ${e ? `@ ${e.toLocaleString()}` : "at market"}`;
		return /* @__PURE__ */ f("div", {
			className: "flex flex-col gap-2 h-full justify-center",
			children: [
				/* @__PURE__ */ d("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500",
					children: "Confirm"
				}),
				/* @__PURE__ */ d("div", {
					className: `text-sm font-medium ${D === "buy" ? "text-emerald-300" : "text-red-300"}`,
					children: t
				}),
				C && /* @__PURE__ */ d("div", {
					className: "text-xs text-zinc-500",
					children: C
				}),
				/* @__PURE__ */ f("div", {
					className: "flex gap-2 mt-1",
					children: [/* @__PURE__ */ d("button", {
						onClick: () => U(!1),
						className: "flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
						children: "Cancel"
					}), /* @__PURE__ */ d("button", {
						onClick: G,
						disabled: W,
						className: `flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-30 ${q}`,
						children: W ? "..." : "Confirm"
					})]
				}),
				B && /* @__PURE__ */ d("div", {
					className: "text-xs text-red-400",
					children: B
				})
			]
		});
	}
	return /* @__PURE__ */ f("div", {
		className: "flex flex-col gap-2 h-full",
		children: [
			/* @__PURE__ */ f("div", {
				className: "flex gap-1 bg-zinc-950 rounded p-1",
				children: [/* @__PURE__ */ d("button", {
					onClick: () => O("buy"),
					className: K("buy"),
					children: "Buy"
				}), /* @__PURE__ */ d("button", {
					onClick: () => O("sell"),
					className: K("sell"),
					children: "Sell"
				})]
			}),
			C && /* @__PURE__ */ f("div", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: [C, m.available != null && /* @__PURE__ */ f("span", {
					className: "ml-2 text-zinc-400 normal-case",
					children: [
						"avail ",
						/* @__PURE__ */ d("span", {
							className: "tabular-nums text-zinc-200",
							children: m.available.toLocaleString()
						}),
						m.quote_unit && /* @__PURE__ */ d("span", {
							className: "ml-1",
							children: m.quote_unit
						})
					]
				})]
			}),
			/* @__PURE__ */ d(h, {
				label: "Amount",
				unit: m.quote_unit,
				value: k,
				onChange: A,
				disabled: W
			}),
			m.quick_amounts && m.quick_amounts.length > 0 && m.available != null && /* @__PURE__ */ d("div", {
				className: "flex gap-1",
				children: m.quick_amounts.map((e, t) => {
					let n = (m.available * e).toFixed(6).replace(/\.?0+$/, "");
					return /* @__PURE__ */ f("button", {
						onClick: () => A(n),
						disabled: W,
						className: "flex-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30",
						title: `${(e * 100).toFixed(0)}% of available`,
						children: [(e * 100).toFixed(0), "%"]
					}, t);
				})
			}),
			/* @__PURE__ */ d(h, {
				label: "Price",
				placeholder: "market",
				value: j,
				onChange: M,
				disabled: W
			}),
			/* @__PURE__ */ d("button", {
				onClick: G,
				disabled: W || !k,
				className: `mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${q}`,
				children: W ? "..." : D === "buy" ? `Buy ${m.quote_unit ?? ""}`.trim() : `Sell ${m.quote_unit ?? ""}`.trim()
			}),
			(E === "connect" ? S && !a(S.status) ? S.message ?? S.status : null : R) && /* @__PURE__ */ d("div", {
				className: "text-xs text-emerald-400",
				children: E === "connect" ? S?.message ?? S?.status : R
			}),
			(E === "connect" && S && a(S.status) ? S.message ?? `${T} failed` : B) && /* @__PURE__ */ d("div", {
				className: "text-xs text-red-400",
				children: E === "connect" && S && a(S.status) ? S.message ?? `${T} failed` : B
			})
		]
	});
}
function h({ label: e, unit: t, placeholder: n, value: r, onChange: i, disabled: a }) {
	return /* @__PURE__ */ f("div", {
		className: "flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 focus-within:border-zinc-500",
		children: [
			/* @__PURE__ */ d("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500 w-12 shrink-0",
				children: e
			}),
			/* @__PURE__ */ d("input", {
				type: "number",
				inputMode: "decimal",
				placeholder: n ?? "0.00",
				value: r,
				onChange: (e) => i(e.target.value),
				disabled: a,
				className: "flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
			}),
			t && /* @__PURE__ */ d("span", {
				className: "text-xs text-zinc-500 shrink-0",
				children: t
			})
		]
	});
}
//#endregion
export { p as n, m as t };
