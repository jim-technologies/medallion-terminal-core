import { t as e } from "./Pagination-6D1ZC47_.js";
import { kt as t } from "./MultiDashboard-D3p5lDCz.js";
import { useEffect as n, useMemo as r, useState as i } from "react";
import { jsx as a } from "react/jsx-runtime";
//#region src/widgets/CursorPager.tsx
function o(e, t) {
	return t?.page_token_key ?? (e ? `${e}_page_token` : "page_token");
}
function s({ nextPageToken: s, widgetId: c, options: l, ariaLabel: u = "Result pages" }) {
	let { ctx: d, setCtx: f } = t(), p = o(c, l), m = d[p] ?? "", [h, g] = i([]);
	n(() => {
		g([]);
	}, [p]), n(() => {
		m || g([]);
	}, [m]);
	let _ = s && s !== m ? s : void 0, v = h.length > 0 || m.length > 0, y = r(() => h[h.length - 1] ?? "", [h]);
	return !v && !_ ? null : /* @__PURE__ */ a(e, {
		label: u,
		"data-page-token-key": p,
		hasPrevious: v,
		hasNext: !!_,
		onPrevious: () => {
			v && (g((e) => e.slice(0, -1)), f(p, y));
		},
		onNext: () => {
			_ && (g((e) => [...e, m]), f(p, _));
		},
		previousLabel: l?.previous_label,
		nextLabel: l?.next_label
	});
}
//#endregion
export { o as n, s as t };
