import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, Ct as n, It as r, St as i } from "./MultiDashboard-Az14iNfL.js";
import { useCallback as a, useRef as o, useState as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/widgets/Prompt.tsx
var u = /* @__PURE__ */ e({ Prompt: () => d });
function d({ options: e }) {
	let { dispatch: u, ctx: d, setCtx: f, backendUrl: p, backendHeaders: m, fetch: h, widgets: g } = t(), [_, v] = s(""), [y, b] = s(!1), [x, S] = s(null), [C, w] = s(null), T = o(!1), E = e?.url, D = p !== void 0, O = a(async () => {
		let e = _.trim();
		if (!(!e || y || T.current) && (D || E)) {
			T.current = !0, b(!0), w(null), S(null);
			try {
				let t = D ? await (h ?? globalThis.fetch)(n(p), {
					method: "POST",
					headers: {
						...m,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(i(e, d, g))
				}) : await fetch(E, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query: e })
				});
				if (!t.ok) throw Error(`HTTP ${t.status}`);
				let r = await t.json(), a = r.text ?? r.dialogue?.text;
				if (a && S(a), r.context?.values) for (let [e, t] of Object.entries(r.context.values)) f(e, t);
				r.actions && r.actions.length > 0 && u(r.actions, { replaceAll: r.replace_all }), v("");
			} catch (e) {
				w(e instanceof Error ? e.message : "Request failed");
			} finally {
				T.current = !1, b(!1);
			}
		}
	}, [
		_,
		y,
		D,
		p,
		m,
		h,
		E,
		d,
		g,
		u,
		f
	]);
	return !D && !E ? /* @__PURE__ */ c(r, {
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
					value: _,
					onChange: (e) => v(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && !e.shiftKey && (e.preventDefault(), O());
					},
					disabled: y
				}), /* @__PURE__ */ c("button", {
					onClick: O,
					disabled: y || !_.trim(),
					className: "px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default\n            rounded-lg text-sm text-zinc-200 font-medium shrink-0",
					children: y ? "..." : "Send"
				})]
			}),
			x && /* @__PURE__ */ c("div", {
				className: "text-xs text-zinc-400 leading-relaxed",
				children: x
			}),
			C && /* @__PURE__ */ c("div", {
				className: "text-xs text-red-400",
				children: C
			})
		]
	});
}
//#endregion
export { u as n, d as t };
