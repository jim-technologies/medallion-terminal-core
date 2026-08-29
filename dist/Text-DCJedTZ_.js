import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-B8rxYV_S.js";
import { n } from "./textNormalize-Ba1I6dwH.js";
import { useEffect as r, useRef as i, useState as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
//#region src/widgets/Text.tsx
var c = /* @__PURE__ */ e({ Text: () => u }), l = 1500;
function u({ data: e }) {
	let c = n(e), u = i(/* @__PURE__ */ new Set()), p = i(!1), [m, h] = a(/* @__PURE__ */ new Set());
	return r(() => {
		let e = c.map(d);
		if (!p.current) {
			p.current = !0;
			for (let t of e) u.current.add(t);
			return;
		}
		let t = e.filter((e) => !u.current.has(e));
		for (let t of e) u.current.add(t);
		if (t.length === 0) return;
		h((e) => {
			let n = new Set(e);
			for (let e of t) n.add(e);
			return n;
		});
		let n = setTimeout(() => {
			h((e) => {
				let n = new Set(e);
				for (let e of t) n.delete(e);
				return n;
			});
		}, l);
		return () => clearTimeout(n);
	}, [c]), c.length === 0 ? /* @__PURE__ */ o(t, { children: "No content" }) : /* @__PURE__ */ o("div", {
		className: "overflow-auto h-full space-y-3",
		tabIndex: 0,
		"aria-label": "Content feed",
		children: c.map((e, t) => {
			let n = d(e), r = m.has(n) ? "bg-sky-500/5" : "";
			return /* @__PURE__ */ s("article", {
				className: `flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${r}`,
				children: [/* @__PURE__ */ s("div", {
					className: "flex-1 min-w-0",
					children: [
						(e.title || e.url) && /* @__PURE__ */ o("h3", {
							className: "text-sm font-medium text-zinc-100 mb-1 leading-snug",
							children: e.url ? /* @__PURE__ */ s("a", {
								href: e.url,
								...e.url.startsWith("/") ? {} : {
									target: "_blank",
									rel: "noopener noreferrer"
								},
								className: "hover:text-sky-400 hover:underline",
								children: [e.title || f(e.url), /* @__PURE__ */ o("span", {
									className: "ml-1 text-xs text-zinc-500",
									"aria-hidden": "true",
									children: e.url.startsWith("/") ? "→" : "↗"
								})]
							}) : e.title
						}),
						e.meta && /* @__PURE__ */ o("div", {
							className: "text-xs text-zinc-500 mb-1.5",
							children: e.meta
						}),
						e.body && /* @__PURE__ */ o("p", {
							className: "text-sm text-zinc-300 leading-relaxed",
							children: e.body
						}),
						e.tags && e.tags.length > 0 && /* @__PURE__ */ o("div", {
							className: "flex gap-1.5 mt-2 flex-wrap",
							children: e.tags.map((e, t) => /* @__PURE__ */ o("span", {
								className: "text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400",
								children: e
							}, t))
						})
					]
				}), e.image && /* @__PURE__ */ o("img", {
					src: e.image,
					alt: "",
					className: "w-14 h-14 rounded object-cover shrink-0 bg-zinc-800",
					loading: "lazy"
				})]
			}, t);
		})
	});
}
function d(e) {
	return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function f(e) {
	try {
		return new URL(e).hostname;
	} catch {
		return e;
	}
}
//#endregion
export { c as n, u as t };
