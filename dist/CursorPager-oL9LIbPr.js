import { At as e } from "./MultiDashboard-B8rxYV_S.js";
import { useEffect as t, useMemo as n, useState as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/widgets/CursorPager.tsx
function o(e, t) {
	return t?.page_token_key ?? (e ? `${e}_page_token` : "page_token");
}
function s({ nextPageToken: s, widgetId: c, options: l, ariaLabel: u = "Result pages" }) {
	let { ctx: d, setCtx: f } = e(), p = o(c, l), m = d[p] ?? "", [h, g] = r([]);
	t(() => {
		g([]);
	}, [p]), t(() => {
		m || g([]);
	}, [m]);
	let _ = s && s !== m ? s : void 0, v = h.length > 0 || m.length > 0, y = n(() => h[h.length - 1] ?? "", [h]);
	return !v && !_ ? null : /* @__PURE__ */ a("nav", {
		className: "flex items-center gap-1",
		"aria-label": u,
		"data-page-token-key": p,
		children: [/* @__PURE__ */ i("button", {
			type: "button",
			onClick: () => {
				v && (g((e) => e.slice(0, -1)), f(p, y));
			},
			disabled: !v,
			className: "mtc-control px-2 py-0.5 disabled:opacity-30",
			children: l?.previous_label ?? "Previous"
		}), /* @__PURE__ */ i("button", {
			type: "button",
			onClick: () => {
				_ && (g((e) => [...e, m]), f(p, _));
			},
			disabled: !_,
			className: "mtc-control px-2 py-0.5 disabled:opacity-30",
			children: l?.next_label ?? "Next"
		})]
	});
}
//#endregion
export { o as n, s as t };
