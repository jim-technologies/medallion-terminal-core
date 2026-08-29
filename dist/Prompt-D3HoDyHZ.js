import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, Ct as n, It as r, St as i } from "./MultiDashboard-B8rxYV_S.js";
import { useCallback as a, useRef as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/widgets/Prompt.tsx
var u = /* @__PURE__ */ e({ Prompt: () => d });
function d({ options: e }) {
	let { dispatch: u, ctx: d, setCtx: f, backendUrl: p, backendHeaders: m, widgets: h } = t(), [g, _] = s(""), [v, y] = s(!1), [b, x] = s(null), [S, C] = s(null), w = o(!1), T = e?.url, E = p !== void 0, D = a(async () => {
		let e = g.trim();
		if (!(!e || v || w.current) && !(!E && !T)) {
			w.current = !0, y(!0), C(null), x(null);
			try {
				let t = E ? await fetch(n(p), {
					method: "POST",
					headers: {
						...m,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(i(e, d, h))
				}) : await fetch(T, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query: e })
				});
				if (!t.ok) throw Error(`HTTP ${t.status}`);
				let r = await t.json(), a = r.text ?? r.dialogue?.text;
				if (a && x(a), r.context?.values) for (let [e, t] of Object.entries(r.context.values)) f(e, t);
				r.actions && r.actions.length > 0 && u(r.actions, { replaceAll: r.replace_all }), _("");
			} catch (e) {
				C(e instanceof Error ? e.message : "Request failed");
			} finally {
				w.current = !1, y(!1);
			}
		}
	}, [
		g,
		v,
		E,
		p,
		m,
		T,
		d,
		h,
		u,
		f
	]);
	return !E && !T ? /* @__PURE__ */ c(r, {
		padded: !0,
		children: "Set a backendUrl on Dashboard or options.url on this widget"
	}) : /* @__PURE__ */ l("div", {
		className: "flex flex-col gap-2 h-full justify-center",
		children: [
			/* @__PURE__ */ l("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ c("input", {
					type: "text",
					className: "flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100\n            placeholder-zinc-500 outline-none focus:border-zinc-500 disabled:opacity-50",
					placeholder: "Ask anything... (Enter to send)",
					value: g,
					onChange: (e) => _(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && !e.shiftKey && (e.preventDefault(), D());
					},
					disabled: v
				}), /* @__PURE__ */ c("button", {
					onClick: D,
					disabled: v || !g.trim(),
					className: "px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default\n            rounded-lg text-sm text-zinc-200 font-medium shrink-0",
					children: v ? "..." : "Send"
				})]
			}),
			b && /* @__PURE__ */ c("div", {
				className: "text-xs text-zinc-400 leading-relaxed",
				children: b
			}),
			S && /* @__PURE__ */ c("div", {
				className: "text-xs text-red-400",
				children: S
			})
		]
	});
}
//#endregion
export { u as n, d as t };
