import { T as e, d as t, h as n } from "./States-DM6NkR5E.js";
import { t as r } from "./utils-j4lJ7S1v.js";
import { forwardRef as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/components/Pagination.tsx
var s = i(function({ label: i, page: s, pageCount: c, onPageChange: l, hasPrevious: u, hasNext: d, onPrevious: f, onNext: p, summary: m, previousLabel: h, nextLabel: g, size: _ = "small", className: v, ...y }, b) {
	let x = e(), S = s !== void 0, C = S ? s > 1 : !!u, w = S ? c === void 0 ? !!d : s < c : !!d, T = () => S ? l?.(Math.max(1, s - 1)) : f?.(), E = () => S ? l?.(s + 1) : p?.();
	return /* @__PURE__ */ o("nav", {
		...y,
		ref: b,
		"aria-label": i ?? x("pagination.label"),
		className: r("mtc-pagination", v),
		children: [m != null && /* @__PURE__ */ a("span", {
			className: "mtc-pagination-summary",
			children: m
		}), /* @__PURE__ */ o("div", {
			className: "mtc-pagination-controls",
			children: [
				/* @__PURE__ */ a(t, {
					size: _,
					variant: "ghost",
					startIcon: /* @__PURE__ */ a(n, { name: "chevron-left" }),
					disabled: !C,
					onClick: T,
					children: h ?? x("pagination.previous")
				}),
				S && /* @__PURE__ */ a("span", {
					className: "mtc-pagination-page",
					"aria-live": "polite",
					children: c === void 0 ? x("pagination.pageOnly", { page: s }) : x("pagination.page", {
						page: s,
						count: c
					})
				}),
				/* @__PURE__ */ a(t, {
					size: _,
					variant: "ghost",
					endIcon: /* @__PURE__ */ a(n, { name: "chevron-right" }),
					disabled: !w,
					onClick: E,
					children: g ?? x("pagination.next")
				})
			]
		})]
	});
});
//#endregion
export { s as t };
