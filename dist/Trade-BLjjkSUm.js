import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { Et as t, Ft as n, Tt as r, kt as i } from "./MultiDashboard-CxdHnMBC.js";
import { r as a, t as o } from "./useWatchAction-hJOJQuAY.js";
import { t as s } from "./useSubmitAction-CGmn70RF.js";
import { useCallback as c, useEffect as l, useRef as u, useState as d } from "react";
import { jsx as f, jsxs as p } from "react/jsx-runtime";
//#region src/widgets/Trade.tsx
var m = /* @__PURE__ */ e({ Trade: () => h });
function h({ options: e, widgetId: m }) {
	let h = e ?? {}, { ctx: _, toast: v, backendUrl: y, emit: b } = i(), { submit: x, submitting: S, result: C } = s(m), w = h.symbol ? r(h.symbol, _) : _.symbol ?? "", T = h.quote_unit ? r(h.quote_unit, _) : void 0, E = h.url, D = h.action_id ?? "place_order", O = y === void 0 ? E ? "url" : null : "connect", [k, A] = d("buy"), [j, M] = d(""), [N, P] = d(""), F = u(_.price);
	l(() => {
		_.price !== F.current && (F.current = _.price, _.price != null && P(_.price));
	}, [_.price]);
	let I = u(_.side);
	l(() => {
		_.side !== I.current && (I.current = _.side, (_.side === "buy" || _.side === "sell") && A(_.side));
	}, [_.side]);
	let [L, R] = d(!1), z = u(!1), [B, V] = d(null), [H, U] = d(null), [W, G] = d(!1), K = O === "connect" ? S : L;
	l(() => {
		W && G(!1);
	}, [
		j,
		N,
		k
	]);
	let q = c(async () => {
		if (!O || K || O === "url" && z.current) return;
		let e = Number(j);
		if (!Number.isFinite(e) || e <= 0) {
			U("Amount must be a positive number");
			return;
		}
		let n = N ? Number(N) : void 0;
		if (N && (!Number.isFinite(n) || n <= 0)) {
			U("Price must be positive");
			return;
		}
		if (h.confirm && !W) {
			G(!0), U(null), V(null);
			return;
		}
		G(!1);
		let r = {
			symbol: w,
			side: k,
			amount: e,
			type: n == null ? "market" : "limit",
			...n != null && { price: n }
		};
		if (U(null), V(null), O === "connect") {
			await x({
				actionId: D,
				params: r,
				successMessage: "Order completed",
				refresh: !1,
				onComplete: (e) => {
					o(e.status) || (M(""), P(""), G(!1));
				}
			});
			return;
		}
		z.current = !0, R(!0);
		let i = t();
		try {
			let e = await fetch(E, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": i
				},
				body: JSON.stringify(r)
			});
			if (!e.ok) throw Error(`HTTP ${e.status}`);
			let t = await e.json().catch(() => ({})), n = typeof t.message == "string" ? t.message : "Order submitted", s = typeof t.status == "string" && t.status ? t.status : "ACTION_STATUS_OK";
			b({
				type: "action",
				actionId: D,
				clientRequestId: i,
				status: s,
				message: n,
				terminal: t.status == null || a(s)
			}), o(t.status) ? (U(n), v(n, "error")) : (V(n), v(n, "ok"), M(""), P(""), G(!1));
		} catch (e) {
			let t = e instanceof Error ? e.message : "Submit failed";
			U(t), v(t, "error"), b({
				type: "action",
				actionId: D,
				clientRequestId: i,
				status: "ACTION_STATUS_FAILED",
				message: t,
				terminal: !0
			});
		} finally {
			z.current = !1, R(!1);
		}
	}, [
		O,
		E,
		D,
		K,
		j,
		N,
		w,
		k,
		h.confirm,
		W,
		v,
		b,
		x
	]);
	if (l(() => {
		if (!W) return;
		let e = (e) => {
			e.key === "Escape" && G(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [W]), !O) return /* @__PURE__ */ f(n, { children: "Trade requires backendUrl or options.url" });
	let J = (e) => `flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${k === e ? e === "buy" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300" : "text-zinc-500 hover:text-zinc-300"}`, Y = k === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
	if (W) {
		let e = N ? Number(N) : null, t = `${k.toUpperCase()} ${j}${T ? ` ${T}` : ""} ${e ? `@ ${e.toLocaleString()}` : "at market"}`;
		return /* @__PURE__ */ p("div", {
			className: "flex flex-col gap-2 h-full justify-center",
			children: [
				/* @__PURE__ */ f("div", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500",
					children: "Confirm"
				}),
				/* @__PURE__ */ f("div", {
					className: `text-sm font-medium ${k === "buy" ? "text-emerald-300" : "text-red-300"}`,
					children: t
				}),
				w && /* @__PURE__ */ f("div", {
					className: "text-xs text-zinc-500",
					children: w
				}),
				/* @__PURE__ */ p("div", {
					className: "flex gap-2 mt-1",
					children: [/* @__PURE__ */ f("button", {
						onClick: () => G(!1),
						className: "flex-1 py-2 rounded text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
						children: "Cancel"
					}), /* @__PURE__ */ f("button", {
						onClick: q,
						disabled: K,
						className: `flex-1 py-2 rounded text-xs font-semibold disabled:opacity-30 ${Y}`,
						children: K ? "..." : "Confirm"
					})]
				}),
				H && /* @__PURE__ */ f("div", {
					className: "text-xs text-red-400",
					children: H
				})
			]
		});
	}
	return /* @__PURE__ */ p("div", {
		className: "flex flex-col gap-2 h-full",
		children: [
			/* @__PURE__ */ p("div", {
				className: "flex gap-1 bg-zinc-950 rounded p-1",
				children: [/* @__PURE__ */ f("button", {
					onClick: () => A("buy"),
					className: J("buy"),
					children: "Buy"
				}), /* @__PURE__ */ f("button", {
					onClick: () => A("sell"),
					className: J("sell"),
					children: "Sell"
				})]
			}),
			w && /* @__PURE__ */ p("div", {
				className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500",
				children: [w, h.available != null && /* @__PURE__ */ p("span", {
					className: "ml-2 text-zinc-400",
					children: [
						"avail ",
						/* @__PURE__ */ f("span", {
							className: "tabular-nums text-zinc-200",
							children: h.available.toLocaleString()
						}),
						T && /* @__PURE__ */ f("span", {
							className: "ml-1",
							children: T
						})
					]
				})]
			}),
			/* @__PURE__ */ f(g, {
				label: "Amount",
				unit: T,
				value: j,
				onChange: M,
				disabled: K
			}),
			h.quick_amounts && h.quick_amounts.length > 0 && h.available != null && /* @__PURE__ */ f("div", {
				className: "flex gap-1",
				children: h.quick_amounts.map((e, t) => {
					let n = (h.available * e).toFixed(6).replace(/\.?0+$/, "");
					return /* @__PURE__ */ p("button", {
						onClick: () => M(n),
						disabled: K,
						className: "flex-1 text-[length:var(--mtc-font-size-xs)] text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30",
						title: `${(e * 100).toFixed(0)}% of available`,
						children: [(e * 100).toFixed(0), "%"]
					}, t);
				})
			}),
			/* @__PURE__ */ f(g, {
				label: "Price",
				placeholder: "market",
				value: N,
				onChange: P,
				disabled: K
			}),
			/* @__PURE__ */ f("button", {
				onClick: q,
				disabled: K || !j,
				className: `mt-1 py-2 rounded text-sm font-semibold disabled:opacity-30 ${Y}`,
				children: K ? "..." : k === "buy" ? `Buy ${T ?? ""}`.trim() : `Sell ${T ?? ""}`.trim()
			}),
			(O === "connect" ? C && !o(C.status) ? C.message ?? C.status : null : B) && /* @__PURE__ */ f("div", {
				className: "text-xs text-emerald-400",
				children: O === "connect" ? C?.message ?? C?.status : B
			}),
			(O === "connect" && C && o(C.status) ? C.message ?? `${D} failed` : H) && /* @__PURE__ */ f("div", {
				className: "text-xs text-red-400",
				children: O === "connect" && C && o(C.status) ? C.message ?? `${D} failed` : H
			})
		]
	});
}
function g({ label: e, unit: t, placeholder: n, value: r, onChange: i, disabled: a }) {
	return /* @__PURE__ */ p("div", {
		className: "flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 focus-within:border-zinc-500",
		children: [
			/* @__PURE__ */ f("span", {
				className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 w-12 shrink-0",
				children: e
			}),
			/* @__PURE__ */ f("input", {
				type: "number",
				inputMode: "decimal",
				placeholder: n ?? "0.00",
				value: r,
				onChange: (e) => i(e.target.value),
				disabled: a,
				"aria-label": e,
				className: "min-w-0 flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
			}),
			t && /* @__PURE__ */ f("span", {
				className: "text-xs text-zinc-500 shrink-0",
				children: t
			})
		]
	});
}
//#endregion
export { m as n, h as t };
