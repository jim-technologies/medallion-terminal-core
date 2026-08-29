import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, at as r, it as i, lt as a, nt as o, rt as s, tt as c } from "./MultiDashboard-B8rxYV_S.js";
import { t as l } from "./useWatchAction-B2925xXY.js";
import { t as u } from "./useSubmitAction-vimZgsDR.js";
import { t as d } from "./RecordFields-CYC16egg.js";
import { useEffect as f, useMemo as p, useState as m } from "react";
import { jsx as h, jsxs as g } from "react/jsx-runtime";
//#region src/widgets/RecordForm.tsx
var _ = /* @__PURE__ */ e({ RecordForm: () => y });
function v(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function y({ data: e, options: _, widgetId: y }) {
	let b = p(() => r(e), [e]), x = _ ?? {}, { backendUrl: S, ctx: C, setCtx: w, toast: T } = t(), E = u(y), D = x.record_id_key ?? "record_id", O = x.table_id_key ?? "table_id", k = C[D], A = b?.records.find((e) => e.id === k), j = x.mode ?? "auto", M = j === "edit" || j === "auto" && !!A, [N, P] = m({}), [F, I] = m({}), [L, R] = m(!1), z = b ? o(b, "form", x.view_id) : void 0, B = x.fields?.length ? x.fields : z?.visibleFields.length ? z.visibleFields : b?.fields.map((e) => e.key) ?? [], V = b ? B.map((e) => b.fields.find((t) => t.key === e)).filter((e) => !!e).filter((e) => x.show_read_only !== !1 || i(e)) : [];
	if (f(() => {
		P(s(V, M ? A : void 0)), I({}), R(!1);
	}, [
		b?.tableId,
		A?.id,
		A?.revision,
		M,
		B.join("|")
	]), !b) return /* @__PURE__ */ h(n, { children: "No record set" });
	if (M && !A) return /* @__PURE__ */ h(n, {
		padded: !0,
		children: "Select a record from a grid, board, or calendar to edit it"
	});
	let H = V.filter(i), U = S !== void 0 && (M ? b.capabilities.update : b.capabilities.create), W = x.columns === 2 ? "md:grid-cols-2" : "grid-cols-1", G = (e, t) => {
		P((n) => ({
			...n,
			[e]: t
		})), I((t) => {
			if (!t[e]) return t;
			let n = { ...t };
			return delete n[e], n;
		});
	}, K = (e) => {
		if (l(e.status)) return;
		let t = e.data?.record_id ?? e.data?.recordId ?? e.id;
		!M && t && (w(O, b.tableId), w(D, String(t)));
	}, q = async () => {
		if (!U || E.submitting) return;
		let e = {};
		for (let t of H) t.required && v(N[t.key]) && (e[t.key] = "Required");
		if (I(e), Object.keys(e).length > 0) {
			T("Complete the required fields", "warn");
			return;
		}
		let t = M ? c(H, N, A) : Object.fromEntries(H.map((e) => [e.key, N[e.key]]));
		if (M && Object.keys(t).length === 0) {
			T("No changes to save", "info");
			return;
		}
		await E.submit({
			actionId: M ? b.capabilities.updateActionId : b.capabilities.createActionId,
			params: {
				workspace_id: b.workspaceId,
				table_id: b.tableId,
				...M ? {
					record_id: A.id,
					revision: A.revision
				} : {},
				values: t
			},
			successMessage: M ? `${a(b, A, z?.titleField)} updated` : `${b.tableName || "Record"} created`,
			refreshTarget: "*",
			onComplete: K
		});
	}, J = async () => {
		if (!(!A || !b.capabilities.delete || S === void 0 || E.submitting)) {
			if (!L) {
				R(!0);
				return;
			}
			await E.submit({
				actionId: b.capabilities.deleteActionId,
				params: {
					workspace_id: b.workspaceId,
					table_id: b.tableId,
					record_id: A.id,
					revision: A.revision
				},
				successMessage: `${a(b, A, z?.titleField)} deleted`,
				refreshTarget: "*",
				onComplete: (e) => {
					l(e.status) || (w(D, x.new_record_value ?? "new"), R(!1));
				}
			});
		}
	};
	return /* @__PURE__ */ g("form", {
		className: "h-full flex flex-col min-h-0",
		onSubmit: (e) => {
			e.preventDefault(), q();
		},
		children: [
			/* @__PURE__ */ g("div", {
				className: "flex items-start justify-between gap-3 pb-3 border-b border-zinc-800",
				children: [/* @__PURE__ */ g("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ g("div", {
							className: "text-[10px] uppercase tracking-wider text-zinc-500",
							children: [
								M ? "Edit record" : "New record",
								" · ",
								b.tableName || b.tableId
							]
						}),
						/* @__PURE__ */ h("h4", {
							className: "text-sm font-semibold text-zinc-100 mt-0.5 truncate",
							children: M && A ? a(b, A, z?.titleField) : `Add to ${b.tableName || "table"}`
						}),
						M && A && /* @__PURE__ */ g("div", {
							className: "text-[9px] font-mono text-zinc-600 mt-0.5",
							children: [A.id, A.revision ? ` · rev ${A.revision}` : ""]
						})
					]
				}), j === "auto" && /* @__PURE__ */ h("button", {
					type: "button",
					onClick: () => {
						w(O, b.tableId), w(D, x.new_record_value ?? "new");
					},
					className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 shrink-0",
					children: "New"
				})]
			}),
			/* @__PURE__ */ h("div", {
				className: `grid ${W} gap-x-4 gap-y-3 py-3 overflow-y-auto flex-1 min-h-0 pr-1`,
				children: V.map((e) => /* @__PURE__ */ g("label", {
					className: e.type === "long_text" ? "md:col-span-2" : "",
					children: [
						/* @__PURE__ */ g("span", {
							className: "flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wider text-zinc-500",
							children: [
								e.label,
								e.required && /* @__PURE__ */ h("span", {
									className: "text-amber-400",
									children: "*"
								}),
								e.readOnly && /* @__PURE__ */ h("span", {
									className: "normal-case tracking-normal text-zinc-700",
									children: "computed"
								}),
								F[e.key] && /* @__PURE__ */ h("span", {
									className: "ml-auto text-red-400 normal-case tracking-normal",
									children: F[e.key]
								})
							]
						}),
						/* @__PURE__ */ h(d, {
							field: e,
							value: N[e.key],
							onChange: (t) => G(e.key, t),
							disabled: E.submitting
						}),
						e.description && /* @__PURE__ */ h("span", {
							className: "block text-[9px] text-zinc-600 mt-1 leading-relaxed",
							children: e.description
						})
					]
				}, e.key))
			}),
			/* @__PURE__ */ g("div", {
				className: "pt-3 border-t border-zinc-800 flex items-center gap-2",
				children: [
					M && b.capabilities.delete && /* @__PURE__ */ h("button", {
						type: "button",
						onClick: () => void J(),
						disabled: E.submitting || S === void 0,
						className: `mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider disabled:opacity-40 ${L ? "text-red-300 border-red-500/40 bg-red-500/10" : "text-zinc-500"}`,
						children: L ? "Confirm delete" : "Delete"
					}),
					/* @__PURE__ */ h("button", {
						type: "button",
						onClick: () => {
							P(s(V, M ? A : void 0)), I({}), R(!1);
						},
						disabled: E.submitting,
						className: "mtc-control ml-auto px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 disabled:opacity-40",
						children: "Reset"
					}),
					/* @__PURE__ */ h("button", {
						type: "submit",
						disabled: !U || E.submitting,
						className: "mtc-control px-3 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/40 bg-sky-500/10 disabled:opacity-40",
						title: U ? void 0 : "This record set is read-only or backendUrl is missing",
						children: E.submitting ? "Saving…" : x.submit_label ?? (M ? "Save changes" : "Create record")
					})
				]
			})
		]
	});
}
//#endregion
export { _ as n, y as t };
