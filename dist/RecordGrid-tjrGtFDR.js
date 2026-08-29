import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, at as r, et as i, it as a, lt as o, ut as s } from "./MultiDashboard-B8rxYV_S.js";
import { n as c, t as l } from "./CursorPager-oL9LIbPr.js";
import { t as u } from "./useWatchAction-B2925xXY.js";
import { t as d } from "./useSubmitAction-vimZgsDR.js";
import { n as f, t as ee } from "./RecordFields-CYC16egg.js";
import { useEffect as p, useMemo as m, useState as h } from "react";
import { jsx as g, jsxs as _ } from "react/jsx-runtime";
//#region src/widgets/RecordGrid.tsx
var v = /* @__PURE__ */ e({ RecordGrid: () => x });
function y(e) {
	return e.filter((e) => e.type === "grid" || e.type === "list");
}
function b(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : s(e).localeCompare(s(t), void 0, {
		numeric: !0,
		sensitivity: "base"
	});
}
function x({ data: e, options: v, widgetId: x }) {
	let S = m(() => r(e), [e]), C = v ?? {}, { backendUrl: w, ctx: T, setCtx: E } = t(), D = d(x), [O, k] = h(""), [A, j] = h(0), [M, N] = h(null), [P, F] = h(null), [I, L] = h(C.view_id ?? "");
	if (p(() => {
		L(C.view_id ?? "");
	}, [C.view_id]), !S) return /* @__PURE__ */ g(n, { children: "No record set" });
	let R = y(S.views), z = R.find((e) => e.id === I) ?? R.find((e) => e.id === S.activeViewId) ?? R[0], B = (C.visible_fields?.length ? C.visible_fields : z?.visibleFields.length ? z.visibleFields : S.fields.map((e) => e.key)).map((e) => S.fields.find((t) => t.key === e)).filter((e) => !!e), V = Math.max(1, C.page_size ?? 25), H = c(x, C), U = !!S.nextPageToken || !!T[H], W = C.record_id_key ?? "record_id", G = C.table_id_key ?? "table_id", K = S.capabilities.update && C.inline_edit !== !1 && w !== void 0, q = (() => {
		let e = i(S.records, z), t = O.trim().toLowerCase();
		return t && (e = e.filter((e) => B.some((n) => s(e.values[n.key]).toLowerCase().includes(t)))), M && (e = [...e].sort((e, t) => {
			let n = b(e.values[M.field], t.values[M.field]);
			return M.descending ? -n : n;
		})), e;
	})(), J = U ? 1 : Math.max(1, Math.ceil(q.length / V)), Y = Math.min(A, J - 1), X = U ? q : q.slice(Y * V, (Y + 1) * V), Z = (e) => {
		E(G, S.tableId), E(W, e.id);
		for (let [t, n] of Object.entries(e.context)) E(t, n);
	}, Q = () => {
		E(G, S.tableId), E(W, C.new_record_value ?? "new");
	}, te = (e) => {
		N((t) => t?.field === e ? {
			field: e,
			descending: !t.descending
		} : {
			field: e,
			descending: !1
		}), j(0);
	}, $ = async () => {
		!P || D.submitting || await D.submit({
			actionId: S.capabilities.updateActionId,
			params: {
				workspace_id: S.workspaceId,
				table_id: S.tableId,
				record_id: P.record.id,
				revision: P.record.revision,
				values: { [P.field.key]: P.value }
			},
			successMessage: `${o(S, P.record)} updated`,
			refreshTarget: "*",
			onComplete: (e) => {
				u(e.status) || F(null);
			}
		});
	};
	return /* @__PURE__ */ _("div", {
		className: "h-full flex flex-col min-h-0",
		children: [
			/* @__PURE__ */ _("div", {
				className: "flex items-center gap-2 pb-2",
				children: [
					C.search !== !1 && /* @__PURE__ */ g("input", {
						type: "search",
						value: O,
						onChange: (e) => {
							k(e.target.value), j(0);
						},
						placeholder: `Search ${S.tableName || "records"}…`,
						className: "mtc-control min-w-0 flex-1 px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500"
					}),
					R.length > 1 && /* @__PURE__ */ g("select", {
						value: z?.id ?? "",
						onChange: (e) => {
							L(e.target.value), j(0), N(null);
						},
						className: "mtc-control max-w-[12rem] px-2 py-1.5 text-xs text-zinc-300 outline-none",
						"aria-label": "Saved view",
						children: R.map((e) => /* @__PURE__ */ g("option", {
							value: e.id,
							children: e.name
						}, e.id))
					}),
					S.capabilities.create && /* @__PURE__ */ g("button", {
						type: "button",
						onClick: Q,
						className: "mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/30 shrink-0",
						children: "+ New"
					})
				]
			}),
			/* @__PURE__ */ _("div", {
				className: "overflow-auto flex-1 min-h-0 border border-zinc-800 rounded",
				children: [/* @__PURE__ */ _("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ g("thead", {
						className: "sticky top-0 z-[1] bg-zinc-900",
						children: /* @__PURE__ */ g("tr", { children: B.map((e) => /* @__PURE__ */ g("th", {
							className: "border-b border-r last:border-r-0 border-zinc-800 px-2.5 py-2 text-left font-medium text-zinc-400 whitespace-nowrap",
							children: /* @__PURE__ */ _("button", {
								type: "button",
								onClick: () => te(e.key),
								className: "w-full flex items-center gap-1 text-left hover:text-zinc-100",
								children: [
									/* @__PURE__ */ g("span", { children: e.label }),
									e.required && /* @__PURE__ */ g("span", {
										className: "text-amber-400",
										title: "Required",
										children: "*"
									}),
									e.readOnly && /* @__PURE__ */ g("span", {
										className: "text-zinc-600",
										title: "Computed or read-only",
										children: "◇"
									}),
									M?.field === e.key && /* @__PURE__ */ g("span", {
										className: "ml-auto text-zinc-600",
										children: M.descending ? "↓" : "↑"
									})
								]
							})
						}, e.key)) })
					}), /* @__PURE__ */ g("tbody", { children: X.map((e) => /* @__PURE__ */ g("tr", {
						onClick: () => Z(e),
						className: "border-b last:border-b-0 border-zinc-800/70 hover:bg-zinc-800/40 cursor-pointer",
						children: B.map((t) => {
							let n = P?.record.id === e.id && P.field.key === t.key, r = K && a(t);
							return /* @__PURE__ */ g("td", {
								className: "min-w-[9rem] max-w-[22rem] border-r last:border-r-0 border-zinc-800/70 px-2.5 py-2 text-zinc-200 align-top",
								onClick: (e) => {
									r && e.stopPropagation();
								},
								children: n ? /* @__PURE__ */ _("div", {
									className: "min-w-[10rem]",
									children: [/* @__PURE__ */ g(ee, {
										field: t,
										value: P.value,
										onChange: (e) => F((t) => t && {
											...t,
											value: e
										}),
										compact: !0,
										autoFocus: !0,
										disabled: D.submitting,
										onCommit: () => void $(),
										onCancel: () => F(null)
									}), /* @__PURE__ */ _("div", {
										className: "flex items-center justify-end gap-1 mt-1",
										children: [/* @__PURE__ */ g("button", {
											type: "button",
											onClick: () => F(null),
											className: "px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
											children: "Cancel"
										}), /* @__PURE__ */ g("button", {
											type: "button",
											onClick: () => void $(),
											disabled: D.submitting,
											className: "px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-sky-300 disabled:opacity-40",
											children: "Save"
										})]
									})]
								}) : /* @__PURE__ */ g("button", {
									type: "button",
									onClick: () => {
										r && F({
											record: e,
											field: t,
											value: e.values[t.key]
										});
									},
									className: `w-full min-h-5 text-left ${r ? "hover:text-sky-300" : "cursor-default"}`,
									title: r ? `Edit ${t.label}` : void 0,
									children: /* @__PURE__ */ g(f, {
										field: t,
										value: e.values[t.key]
									})
								})
							}, t.key);
						})
					}, e.id)) })]
				}), X.length === 0 && /* @__PURE__ */ g("div", {
					className: "h-40",
					children: /* @__PURE__ */ g(n, { children: "No matching records" })
				})]
			}),
			/* @__PURE__ */ _("div", {
				className: "pt-2 flex items-center justify-between gap-3 text-[10px] text-zinc-500",
				children: [/* @__PURE__ */ _("span", { children: [
					q.length,
					" shown",
					S.total != null && S.total !== q.length ? ` · ${S.total} total` : "",
					z ? ` · ${z.name}` : ""
				] }), U ? /* @__PURE__ */ g(l, {
					nextPageToken: S.nextPageToken,
					widgetId: x,
					options: C,
					ariaLabel: "Record pages"
				}) : J > 1 && /* @__PURE__ */ _("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ g("button", {
							type: "button",
							onClick: () => j((e) => Math.max(0, e - 1)),
							disabled: Y === 0,
							className: "mtc-control px-2 py-0.5 disabled:opacity-30",
							children: "Previous"
						}),
						/* @__PURE__ */ _("span", {
							className: "px-1 tabular-nums",
							children: [
								Y + 1,
								"/",
								J
							]
						}),
						/* @__PURE__ */ g("button", {
							type: "button",
							onClick: () => j((e) => Math.min(J - 1, e + 1)),
							disabled: Y === J - 1,
							className: "mtc-control px-2 py-0.5 disabled:opacity-30",
							children: "Next"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { v as n, x as t };
