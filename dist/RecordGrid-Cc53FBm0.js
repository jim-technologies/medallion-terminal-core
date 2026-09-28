import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t, h as n, p as r } from "./States-BRpBuveA.js";
import { i } from "./FormControls-DtyFD-nE.js";
import { t as a } from "./Pagination-6D1ZC47_.js";
import { t as o } from "./DataGrid-Bo8lPqJT.js";
import { $ as s, Ft as c, ct as l, it as u, kt as ee, lt as d, rt as te } from "./MultiDashboard-CxdHnMBC.js";
import { n as ne, t as re } from "./CursorPager-D_9d32pA.js";
import { t as f } from "./useWatchAction-hJOJQuAY.js";
import { t as p } from "./useSubmitAction-CGmn70RF.js";
import { n as ie, r as m, t as ae } from "./RecordFields-CG_XYJmA.js";
import { useEffect as h, useId as oe, useMemo as se, useState as g } from "react";
import { jsx as _, jsxs as v } from "react/jsx-runtime";
//#region src/widgets/RecordGrid.tsx
var y = /* @__PURE__ */ e({ RecordGrid: () => S });
function b(e) {
	return e.filter((e) => e.type === "grid" || e.type === "list");
}
function x(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : d(e).localeCompare(d(t), void 0, {
		numeric: !0,
		sensitivity: "base"
	});
}
function S({ data: e, options: y, widgetId: S }) {
	let C = se(() => u(e), [e]), w = y ?? {}, { backendUrl: T, ctx: E, setCtx: D } = ee(), O = p(S), [k, le] = g(""), [A, j] = g(0), [M, N] = g(null), [P, F] = g(null), [I, L] = g(w.view_id ?? ""), R = oe();
	if (h(() => {
		L(w.view_id ?? "");
	}, [w.view_id]), !C) return /* @__PURE__ */ _(c, { children: "No record set" });
	let z = b(C.views), B = z.find((e) => e.id === I) ?? z.find((e) => e.id === C.activeViewId) ?? z[0], V = (w.visible_fields?.length ? w.visible_fields : B?.visibleFields.length ? B.visibleFields : C.fields.map((e) => e.key)).map((e) => C.fields.find((t) => t.key === e)).filter((e) => !!e), H = Math.max(1, w.page_size ?? 25), U = ne(S, w), W = !!C.nextPageToken || !!E[U], G = w.record_id_key ?? "record_id", K = w.table_id_key ?? "table_id", q = C.capabilities.update && w.inline_edit !== !1 && T !== void 0, J = (() => {
		let e = s(C.records, B), t = k.trim().toLowerCase();
		return t && (e = e.filter((e) => V.some((n) => d(e.values[n.key]).toLowerCase().includes(t)))), M && (e = [...e].sort((e, t) => {
			let n = x(e.values[M.field], t.values[M.field]);
			return M.descending ? -n : n;
		})), e;
	})(), Y = W ? 1 : Math.max(1, Math.ceil(J.length / H)), X = Math.min(A, Y - 1), Z = W ? J : J.slice(X * H, (X + 1) * H), Q = (e) => {
		D(K, C.tableId), D(G, e.id);
		for (let [t, n] of Object.entries(e.context)) D(t, n);
	}, ue = () => {
		D(K, C.tableId), D(G, w.new_record_value ?? "new");
	}, $ = async () => {
		P && !O.submitting && await O.submit({
			actionId: C.capabilities.updateActionId,
			params: {
				workspace_id: C.workspaceId,
				table_id: C.tableId,
				record_id: P.record.id,
				revision: P.record.revision,
				values: { [P.field.key]: P.value }
			},
			successMessage: `${l(C, P.record)} updated`,
			refreshTarget: "*",
			onComplete: (e) => {
				f(e.status) || F(null);
			}
		});
	}, de = V.map((e) => ({
		id: e.key,
		header: e.label,
		kind: ce(e),
		grow: e.key === C.primaryField,
		primary: e.key === C.primaryField,
		accessor: (t) => t.values[e.key],
		align: e.type === "number" || e.type === "currency" || e.type === "percent" ? "end" : "start",
		cell: (i, { editing: a }) => {
			if (!a || !P) return /* @__PURE__ */ _(ie, {
				field: e,
				value: i.values[e.key],
				context: "grid"
			});
			let o = m(e) === "overlay", s = /* @__PURE__ */ _(ae, {
				field: e,
				value: P.value,
				onChange: (e) => F((t) => t && {
					...t,
					value: e
				}),
				label: e.label,
				describedBy: o && e.type === "long_text" ? R : void 0,
				autoFocus: !0,
				disabled: O.submitting,
				onCommit: () => void $(),
				onCancel: () => F(null)
			});
			return o ? /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-editor",
				children: [s, /* @__PURE__ */ v("div", {
					className: "mtc-data-grid-editor-actions",
					children: [
						e.type === "long_text" && /* @__PURE__ */ _("span", {
							id: R,
							className: "mtc-data-grid-editor-hint",
							children: "Shift+Enter adds a line"
						}),
						/* @__PURE__ */ _(t, {
							size: "small",
							variant: "ghost",
							"aria-label": "Cancel edit",
							onClick: () => F(null),
							children: "Cancel"
						}),
						/* @__PURE__ */ _(t, {
							size: "small",
							intent: "primary",
							variant: "solid",
							"aria-label": `Save ${e.label}`,
							disabled: O.submitting,
							onClick: () => void $(),
							children: "Save"
						})
					]
				})]
			}) : /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-editor",
				children: [
					s,
					/* @__PURE__ */ _(r, {
						icon: /* @__PURE__ */ _(n, { name: "check" }),
						size: "small",
						variant: "ghost",
						"aria-label": `Save ${e.label}`,
						disabled: O.submitting,
						onClick: () => void $()
					}),
					/* @__PURE__ */ _(r, {
						icon: /* @__PURE__ */ _(n, { name: "close" }),
						size: "small",
						variant: "ghost",
						"aria-label": "Cancel edit",
						onClick: () => F(null)
					})
				]
			});
		}
	}));
	return /* @__PURE__ */ v("div", {
		className: "h-full flex flex-col min-h-0 gap-2",
		children: [/* @__PURE__ */ v("div", {
			className: "flex items-center gap-2",
			children: [
				w.search !== !1 && /* @__PURE__ */ _(i, {
					type: "search",
					size: "small",
					value: k,
					onChange: (e) => {
						le(e.target.value), j(0);
					},
					"aria-label": `Search ${C.tableName || "records"}`,
					placeholder: `Search ${C.tableName || "records"}…`,
					className: "min-w-0 flex-1"
				}),
				z.length > 1 && /* @__PURE__ */ _("select", {
					value: B?.id ?? "",
					onChange: (e) => {
						L(e.target.value), j(0), N(null);
					},
					className: "mtc-input max-w-[12rem]",
					"data-size": "small",
					"aria-label": "Saved view",
					children: z.map((e) => /* @__PURE__ */ _("option", {
						value: e.id,
						children: e.name
					}, e.id))
				}),
				C.capabilities.create && /* @__PURE__ */ _(t, {
					size: "small",
					intent: "primary",
					startIcon: /* @__PURE__ */ _(n, { name: "add" }),
					onClick: ue,
					children: "New"
				})
			]
		}), /* @__PURE__ */ _(o, {
			label: C.tableName || "Records",
			className: "min-h-0 flex-1",
			columns: de,
			rows: Z,
			rowKey: (e) => e.id,
			rowLabel: (e) => l(C, e),
			selection: "single",
			selectedKeys: E[G] ? [E[G]] : [],
			onSelectionChange: (e) => {
				let t = Z.find((t) => t.id === e[0]);
				t && Q(t);
			},
			onRowActivate: Q,
			onCellEdit: q ? (e, t) => {
				let n = V.find((e) => e.key === t);
				n && q && te(n) && F({
					record: e,
					field: n,
					value: e.values[n.key]
				});
			} : void 0,
			editingCell: P ? {
				rowKey: P.record.id,
				columnId: P.field.key,
				layout: m(P.field)
			} : null,
			onEditCancel: () => F(null),
			sort: M ? {
				columnId: M.field,
				direction: M.descending ? "descending" : "ascending"
			} : null,
			onSortChange: (e) => {
				N(e ? {
					field: e.columnId,
					descending: e.direction === "descending"
				} : null), j(0);
			},
			sortMode: "server",
			empty: /* @__PURE__ */ _(c, { children: "No matching records" }),
			rowProps: (e) => ({ "data-mtc-record-id": e.id }),
			footer: /* @__PURE__ */ v("div", {
				className: "flex w-full items-center justify-between gap-3",
				children: [/* @__PURE__ */ v("span", { children: [
					J.length,
					" shown",
					C.total != null && C.total !== J.length ? ` · ${C.total} total` : "",
					B ? ` · ${B.name}` : ""
				] }), W ? /* @__PURE__ */ _(re, {
					nextPageToken: C.nextPageToken,
					widgetId: S,
					options: w,
					ariaLabel: "Record pages"
				}) : Y > 1 && /* @__PURE__ */ _(a, {
					label: "Record pages",
					page: X + 1,
					pageCount: Y,
					onPageChange: (e) => j(e - 1)
				})]
			})
		})]
	});
}
function ce(e) {
	let { type: t } = e;
	if (t === "date") return "date";
	if (t === "datetime" || t === "created_at" || t === "updated_at") return "datetime";
	if (t === "boolean") return "boolean";
	if (t === "multi_select" || e.allowMultiple) return "list";
	if (t === "single_select" || (t === "user" || t === "link") && e.choices.length > 0) return "enum";
}
//#endregion
export { y as n, S as t };
