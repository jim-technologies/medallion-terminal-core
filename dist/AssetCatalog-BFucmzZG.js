import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, dt as r } from "./MultiDashboard-B8rxYV_S.js";
import { r as i, t as a } from "./textNormalize-Ba1I6dwH.js";
import { n as o, t as s } from "./CursorPager-oL9LIbPr.js";
import { useMemo as c, useState as l } from "react";
import { jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/widgets/AssetCatalog.tsx
var f = /* @__PURE__ */ e({ AssetCatalog: () => m }), p = {
	dataset: "▦",
	object_type: "◇",
	object: "◆",
	pipeline: "⇢",
	model: "◈",
	repository: "⌘",
	dashboard: "▤",
	document: "≡"
};
function m({ data: e, options: f, widgetId: m }) {
	let _ = f ?? {}, { ctx: v, setCtx: y } = t(), b = c(() => r(e), [e]), [x, S] = l(""), [C, w] = l("all"), T = _.item_context?.key ?? "asset_id", E = _.item_context?.kind_key ?? "asset_kind", D = _.item_context?.owner_key, O = !!b.nextPageToken || !!v[o(m, _)], k = c(() => [...new Set(b.items.map((e) => e.kind))].sort(), [b.items]), A = c(() => {
		let e = x.trim().toLowerCase();
		return b.items.filter((t) => C !== "all" && t.kind !== C ? !1 : !e || [
			t.id,
			t.name,
			t.kind,
			t.description,
			t.owner,
			t.status,
			...t.tags,
			...Object.values(t.metadata)
		].filter(Boolean).join(" ").toLowerCase().includes(e));
	}, [
		b.items,
		C,
		x
	]), j = (e) => {
		for (let [t, n] of Object.entries(e.context)) y(t, n);
		T in e.context || y(T, e.id), E in e.context || y(E, e.kind), D && e.owner && !(D in e.context) && y(D, e.owner);
	};
	return /* @__PURE__ */ d("div", {
		className: "h-full flex flex-col min-h-0",
		children: [
			(_.search !== !1 || _.kind_filter !== !1 && k.length > 1) && /* @__PURE__ */ d("div", {
				className: "flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0",
				children: [_.search !== !1 && /* @__PURE__ */ u("input", {
					type: "search",
					value: x,
					onChange: (e) => S(e.target.value),
					placeholder: "Search assets…",
					className: "w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
				}), _.kind_filter !== !1 && k.length > 1 && /* @__PURE__ */ u("div", {
					className: "flex gap-1 overflow-x-auto pb-0.5",
					children: ["all", ...k].map((e) => /* @__PURE__ */ u("button", {
						onClick: () => w(e),
						className: `px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap ${C === e ? "bg-sky-500/15 text-sky-300 border border-sky-500/30" : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-200"}`,
						children: g(e)
					}, e))
				})]
			}),
			/* @__PURE__ */ d("div", {
				className: "flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 shrink-0",
				children: [/* @__PURE__ */ d("span", { children: [A.length.toLocaleString(), " shown"] }), b.total != null && /* @__PURE__ */ d("span", { children: [b.total.toLocaleString(), " total"] })]
			}),
			/* @__PURE__ */ u("div", {
				className: "flex-1 overflow-auto min-h-0",
				children: b.items.length === 0 ? /* @__PURE__ */ u(n, { children: "No assets" }) : A.length === 0 ? /* @__PURE__ */ u(n, { children: "No matching assets" }) : /* @__PURE__ */ u("div", {
					className: "divide-y divide-zinc-800/70",
					children: A.map((e) => {
						let t = i(e.url), n = v[T] === e.id, r = Object.entries(e.metadata).filter(([, e]) => e == null || [
							"string",
							"number",
							"boolean"
						].includes(typeof e)).slice(0, 3);
						return /* @__PURE__ */ d("div", {
							className: `flex items-start gap-2 px-2 py-2.5 border-l-2 transition-colors ${n ? "border-sky-500 bg-sky-500/10" : "border-transparent hover:bg-zinc-800/30"}`,
							children: [/* @__PURE__ */ d("button", {
								onClick: () => j(e),
								className: "flex-1 min-w-0 text-left group",
								title: `Select ${e.name}`,
								children: [
									/* @__PURE__ */ d("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [
											/* @__PURE__ */ u("span", {
												className: "w-5 text-center text-zinc-500 shrink-0",
												"aria-hidden": "true",
												children: p[e.kind] ?? "·"
											}),
											/* @__PURE__ */ u("span", {
												className: "text-sm text-zinc-100 truncate group-hover:text-sky-300",
												children: e.name
											}),
											e.status && /* @__PURE__ */ u("span", {
												className: `text-[9px] uppercase tracking-wider shrink-0 ${h(e.status)}`,
												children: e.status
											})
										]
									}),
									/* @__PURE__ */ d("div", {
										className: "ml-7 mt-0.5 flex items-center gap-2 text-[10px] text-zinc-500 min-w-0",
										children: [
											/* @__PURE__ */ u("span", {
												className: "font-mono truncate",
												children: e.id
											}),
											/* @__PURE__ */ u("span", {
												className: "shrink-0",
												children: g(e.kind)
											}),
											e.owner && /* @__PURE__ */ d("span", {
												className: "truncate",
												children: ["owner ", e.owner]
											})
										]
									}),
									e.description && /* @__PURE__ */ u("div", {
										className: "ml-7 mt-1 text-xs text-zinc-500 line-clamp-2",
										children: e.description
									}),
									(r.length > 0 || e.updatedAt) && /* @__PURE__ */ d("div", {
										className: "ml-7 mt-1 flex gap-x-3 gap-y-1 flex-wrap text-[10px] text-zinc-500",
										children: [r.map(([e, t]) => /* @__PURE__ */ d("span", { children: [
											g(e),
											" ",
											/* @__PURE__ */ u("span", {
												className: "text-zinc-400",
												children: String(t)
											})
										] }, e)), e.updatedAt && /* @__PURE__ */ d("span", { children: ["updated ", /* @__PURE__ */ u("span", {
											className: "text-zinc-400",
											children: String(a(e.updatedAt))
										})] })]
									}),
									e.tags.length > 0 && /* @__PURE__ */ u("div", {
										className: "ml-7 mt-1.5 flex gap-1 flex-wrap",
										children: e.tags.map((e) => /* @__PURE__ */ u("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
											children: e
										}, e))
									})
								]
							}), t && /* @__PURE__ */ u("a", {
								href: t,
								...t.startsWith("/") ? {} : {
									target: "_blank",
									rel: "noopener noreferrer"
								},
								className: "text-xs text-zinc-500 hover:text-sky-300 px-1 shrink-0",
								title: "Open asset page",
								children: "↗"
							})]
						}, `${e.kind}:${e.id}`);
					})
				})
			}),
			O && /* @__PURE__ */ u("div", {
				className: "pt-2 flex justify-end shrink-0",
				children: /* @__PURE__ */ u(s, {
					nextPageToken: b.nextPageToken,
					widgetId: m,
					options: _,
					ariaLabel: "Asset catalog pages"
				})
			})
		]
	});
}
function h(e) {
	let t = e.toLowerCase();
	return /(healthy|ready|active|ok|published)/.test(t) ? "text-emerald-400" : /(warn|stale|draft|pending)/.test(t) ? "text-amber-400" : /(error|failed|deprecated|archived|blocked)/.test(t) ? "text-red-400" : "text-zinc-500";
}
function g(e) {
	return e.replace(/_/g, " ");
}
//#endregion
export { f as n, m as t };
