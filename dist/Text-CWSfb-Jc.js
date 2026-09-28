import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { t } from "./markdown-QS9UVuDa.js";
import { Ft as n } from "./MultiDashboard-CxdHnMBC.js";
import { n as r } from "./textNormalize-Ba1I6dwH.js";
import { useEffect as i, useRef as a, useState as o } from "react";
import { jsx as s, jsxs as c } from "react/jsx-runtime";
//#region src/widgets/Text.tsx
var l = /* @__PURE__ */ e({ Text: () => d }), u = 1500;
function d({ data: e, options: t }) {
	let l = r(e), d = t?.markdown !== !1, h = a(/* @__PURE__ */ new Set()), g = a(!1), [_, v] = o(/* @__PURE__ */ new Set());
	return i(() => {
		let e = l.map(p);
		if (!g.current) {
			g.current = !0;
			for (let t of e) h.current.add(t);
			return;
		}
		let t = e.filter((e) => !h.current.has(e));
		for (let t of e) h.current.add(t);
		if (t.length === 0) return;
		v((e) => {
			let n = new Set(e);
			for (let e of t) n.add(e);
			return n;
		});
		let n = setTimeout(() => {
			v((e) => {
				let n = new Set(e);
				for (let e of t) n.delete(e);
				return n;
			});
		}, u);
		return () => clearTimeout(n);
	}, [l]), l.length === 0 ? /* @__PURE__ */ s(n, { children: "No content" }) : /* @__PURE__ */ s("div", {
		className: "overflow-auto h-full space-y-3",
		tabIndex: 0,
		"aria-label": "Content feed",
		children: l.map((e, t) => {
			let n = p(e), r = _.has(n) ? "bg-sky-500/5" : "";
			return /* @__PURE__ */ c("article", {
				className: `flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${r}`,
				children: [/* @__PURE__ */ c("div", {
					className: "flex-1 min-w-0",
					children: [
						(e.title || e.url) && /* @__PURE__ */ s("h3", {
							className: "text-sm font-medium text-zinc-100 mb-1 leading-snug",
							children: e.url ? /* @__PURE__ */ c("a", {
								href: e.url,
								...e.url.startsWith("/") ? {} : {
									target: "_blank",
									rel: "noopener noreferrer"
								},
								className: "hover:text-sky-400 hover:underline",
								children: [e.title || m(e.url), /* @__PURE__ */ s("span", {
									className: "ml-1 text-xs text-zinc-500",
									"aria-hidden": "true",
									children: e.url.startsWith("/") ? "→" : "↗"
								})]
							}) : e.title
						}),
						e.meta && /* @__PURE__ */ s("div", {
							className: "text-xs text-zinc-500 mb-1.5",
							children: e.meta
						}),
						e.body && (d ? /* @__PURE__ */ s(f, { source: e.body }) : /* @__PURE__ */ s("p", {
							className: "text-sm text-zinc-300 leading-relaxed",
							children: e.body
						})),
						e.tags && e.tags.length > 0 && /* @__PURE__ */ s("div", {
							className: "flex gap-1.5 mt-2 flex-wrap",
							children: e.tags.map((e, t) => /* @__PURE__ */ s("span", {
								className: "text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400",
								children: e
							}, t))
						})
					]
				}), e.image && /* @__PURE__ */ s("img", {
					src: e.image,
					alt: "",
					className: "w-14 h-14 rounded object-cover shrink-0 bg-zinc-800",
					loading: "lazy"
				})]
			}, t);
		})
	});
}
function f({ source: e }) {
	let [n, r] = o(null);
	return i(() => {
		let n = !1;
		return t(e).then((e) => {
			n || r(e);
		}), () => {
			n = !0;
		};
	}, [e]), n === null ? /* @__PURE__ */ s("p", {
		className: "text-sm text-zinc-300 leading-relaxed",
		children: e
	}) : /* @__PURE__ */ s("div", {
		className: "mtc-markdown",
		"data-variant": "inline",
		dangerouslySetInnerHTML: { __html: n }
	});
}
function p(e) {
	return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function m(e) {
	try {
		return new URL(e).hostname;
	} catch {
		return e;
	}
}
//#endregion
export { l as n, d as t };
