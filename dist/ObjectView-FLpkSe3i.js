import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, pt as r } from "./MultiDashboard-B8rxYV_S.js";
import { i, o as a, r as o } from "./format-V6rpoQ-_.js";
import { r as s, t as c } from "./textNormalize-Ba1I6dwH.js";
import { t as l } from "./useWatchAction-B2925xXY.js";
import { t as u } from "./useSubmitAction-vimZgsDR.js";
import { useMemo as d, useState as f } from "react";
import { jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/widgets/ObjectView.tsx
var h = /* @__PURE__ */ e({ ObjectView: () => g });
function g({ data: e, options: i, widgetId: a }) {
	let o = d(() => r(e), [e]), s = i ?? {}, { setCtx: h } = t(), g = u(a), [y, b] = f(null), [C, w] = f(null);
	if (!o) return /* @__PURE__ */ p(n, { children: "No object" });
	let T = _(o.properties), E = s.link_context?.type_key ?? "object_type", D = s.link_context?.id_key ?? "object_id", O = (e) => {
		if (Object.keys(e.context).length > 0) for (let [t, n] of Object.entries(e.context)) h(t, n);
		else e.targetType && h(E, e.targetType), h(D, e.targetId);
	}, k = async (e) => {
		if (!(e.disabled || g.submitting || y)) {
			if (e.confirm && C !== e.id) {
				w(e.id);
				return;
			}
			b(e.id), w(null), await g.submit({
				actionId: e.id,
				params: {
					...e.params,
					object_type: o.objectType,
					object_id: o.objectId
				},
				successMessage: e.label,
				refreshTarget: a ?? "*",
				onComplete: () => b(null)
			}) || b(null);
		}
	};
	return /* @__PURE__ */ m("div", {
		className: "h-full overflow-auto pr-1",
		children: [
			/* @__PURE__ */ m("div", {
				className: "pb-3 border-b border-zinc-800",
				children: [
					/* @__PURE__ */ m("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ m("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ p("div", {
									className: "text-[10px] uppercase tracking-wider text-zinc-500",
									children: o.objectType || "object"
								}),
								/* @__PURE__ */ p("h3", {
									className: "text-base text-zinc-100 mt-0.5 truncate",
									children: o.title
								}),
								o.objectId && /* @__PURE__ */ p("div", {
									className: "text-[10px] font-mono text-zinc-500 mt-0.5 truncate",
									children: o.objectId
								})
							]
						}), o.status && /* @__PURE__ */ p("span", {
							className: `text-[10px] uppercase tracking-wider shrink-0 ${x(o.status)}`,
							children: o.status
						})]
					}),
					o.description && /* @__PURE__ */ p("p", {
						className: "text-xs text-zinc-500 leading-relaxed mt-2",
						children: o.description
					}),
					/* @__PURE__ */ m("div", {
						className: "flex items-center gap-1.5 flex-wrap mt-2",
						children: [o.tags.map((e) => /* @__PURE__ */ p("span", {
							className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
							children: e
						}, e)), o.updatedAt && /* @__PURE__ */ m("span", {
							className: "text-[10px] text-zinc-500 ml-auto",
							children: ["updated ", String(c(o.updatedAt))]
						})]
					})
				]
			}),
			T.map(([e, t]) => /* @__PURE__ */ m("section", {
				className: "py-3 border-b border-zinc-800/70 last:border-0",
				children: [/* @__PURE__ */ p("h4", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5",
					children: e
				}), /* @__PURE__ */ p("dl", { children: t.map((e) => /* @__PURE__ */ m("div", {
					className: "grid grid-cols-[minmax(7rem,0.42fr)_minmax(0,1fr)] gap-3 py-1.5",
					children: [/* @__PURE__ */ p("dt", {
						className: "text-xs text-zinc-500",
						title: e.description,
						children: e.label
					}), /* @__PURE__ */ p("dd", {
						className: "text-xs text-zinc-200 min-w-0",
						children: /* @__PURE__ */ p(v, { property: e })
					})]
				}, e.key)) })]
			}, e)),
			o.links.length > 0 && /* @__PURE__ */ m("section", {
				className: "py-3 border-b border-zinc-800/70",
				children: [/* @__PURE__ */ p("h4", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5",
					children: "Relationships"
				}), /* @__PURE__ */ p("div", {
					className: "space-y-1",
					children: o.links.map((e, t) => /* @__PURE__ */ m("button", {
						onClick: () => O(e),
						className: "w-full flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-zinc-800/60 group",
						children: [
							/* @__PURE__ */ p("span", {
								className: "text-[10px] uppercase tracking-wider text-zinc-500 w-24 truncate shrink-0",
								children: e.relation || "related"
							}),
							/* @__PURE__ */ p("span", {
								className: "text-xs text-zinc-200 truncate group-hover:text-sky-300",
								children: e.label
							}),
							/* @__PURE__ */ p("span", {
								className: "text-[10px] font-mono text-zinc-500 truncate ml-auto",
								children: e.targetType
							}),
							e.status && /* @__PURE__ */ p("span", {
								className: x(e.status),
								children: "●"
							}),
							/* @__PURE__ */ p("span", {
								"aria-hidden": "true",
								className: "text-zinc-600",
								children: "→"
							})
						]
					}, `${e.relation}:${e.targetType}:${e.targetId}:${t}`))
				})]
			}),
			s.enable_actions === !0 && o.actions.length > 0 && /* @__PURE__ */ m("section", {
				className: "pt-3",
				children: [
					/* @__PURE__ */ p("h4", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-2",
						children: "Actions"
					}),
					/* @__PURE__ */ m("div", {
						className: "flex gap-2 flex-wrap",
						children: [o.actions.map((e) => {
							let t = C === e.id, n = y === e.id && g.submitting;
							return /* @__PURE__ */ p("button", {
								onClick: () => void k(e),
								disabled: e.disabled || g.submitting || y != null,
								title: e.description,
								className: `px-3 py-1.5 rounded border text-xs disabled:opacity-40 ${S(e.style, t)}`,
								children: n ? "Working…" : t ? `Confirm ${e.label}` : e.label
							}, e.id);
						}), C && /* @__PURE__ */ p("button", {
							onClick: () => w(null),
							disabled: g.submitting,
							className: "px-3 py-1.5 rounded border border-zinc-700 text-xs text-zinc-400 hover:text-zinc-100",
							children: "Cancel"
						})]
					}),
					g.result && /* @__PURE__ */ p("div", {
						className: `mt-2 text-xs ${l(g.result.status) ? "text-red-400" : "text-zinc-500"}`,
						children: g.result.message ?? g.result.status
					})
				]
			})
		]
	});
}
function _(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.group ?? "General", r = t.get(e) ?? [];
		r.push(n), t.set(e, r);
	}
	return [...t.entries()];
}
function v({ property: e }) {
	let t = e.format === "link" ? s(e.value) : void 0;
	return t ? /* @__PURE__ */ p("a", {
		href: t,
		...t.startsWith("/") ? {} : {
			target: "_blank",
			rel: "noopener noreferrer"
		},
		className: "text-sky-400 hover:underline break-all",
		children: t
	}) : e.value == null ? /* @__PURE__ */ p("span", {
		className: "text-zinc-500",
		children: "—"
	}) : typeof e.value == "object" ? /* @__PURE__ */ p("pre", {
		className: "font-mono text-[10px] whitespace-pre-wrap break-words text-zinc-400",
		children: b(e.value)
	}) : /* @__PURE__ */ p("span", {
		className: "break-words",
		children: y(e.value, e.format)
	});
}
function y(e, t) {
	return t?.startsWith("currency") && typeof e == "number" ? i(e, t.split(":")[1] ?? "USD") : t?.startsWith("percent") && typeof e == "number" ? a(e) : t === "compact" && typeof e == "number" ? o(e) : (t === "datetime" || t === "date") && typeof e == "string" ? String(c(e)) : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function b(e) {
	try {
		return JSON.stringify(e, null, 2);
	} catch {
		return String(e);
	}
}
function x(e) {
	let t = e.toLowerCase();
	return /(healthy|ready|active|ok|published|open)/.test(t) ? "text-emerald-400" : /(warn|stale|draft|pending|review)/.test(t) ? "text-amber-400" : /(error|failed|deprecated|archived|blocked|closed)/.test(t) ? "text-red-400" : "text-zinc-500";
}
function S(e, t) {
	return t || e === "danger" ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20" : e === "primary" ? "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800";
}
//#endregion
export { h as n, g as t };
