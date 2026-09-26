import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t, h as n, p as r } from "./States-Ds3cxTem.js";
import { i } from "./FormControls-Pb_YQOlN.js";
import { t as a } from "./Pagination-tCTZ9nS0.js";
import { t as o } from "./DataGrid-BDbxrayB.js";
import { $ as s, Ft as c, ct as l, it as u, kt as ee, lt as d, rt as te } from "./MultiDashboard-DiD1jLVR.js";
import { n as ne, t as f } from "./CursorPager--w4fA7Rf.js";
import { t as p } from "./useWatchAction-JON31hNk.js";
import { t as re } from "./useSubmitAction-CrMlXdpp.js";
import { n as m, t as h } from "./RecordFields-C7NwDw8b.js";
import { useEffect as ie, useMemo as ae, useState as g } from "react";
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
	let w = ae(() => u(e), [e]), T = y ?? {}, { backendUrl: E, ctx: D, setCtx: O } = ee(), k = re(S), [A, j] = g(""), [oe, M] = g(0), [N, P] = g(null), [F, I] = g(null), [L, R] = g(T.view_id ?? "");
	if (ie(() => {
		R(T.view_id ?? "");
	}, [T.view_id]), !w) return /* @__PURE__ */ _(c, { children: "No record set" });
	let z = b(w.views), B = z.find((e) => e.id === L) ?? z.find((e) => e.id === w.activeViewId) ?? z[0], V = (T.visible_fields?.length ? T.visible_fields : B?.visibleFields.length ? B.visibleFields : w.fields.map((e) => e.key)).map((e) => w.fields.find((t) => t.key === e)).filter((e) => !!e), H = Math.max(1, T.page_size ?? 25), U = ne(S, T), W = !!w.nextPageToken || !!D[U], G = T.record_id_key ?? "record_id", K = T.table_id_key ?? "table_id", q = w.capabilities.update && T.inline_edit !== !1 && E !== void 0, J = (() => {
		let e = s(w.records, B), t = A.trim().toLowerCase();
		return t && (e = e.filter((e) => V.some((n) => d(e.values[n.key]).toLowerCase().includes(t)))), N && (e = [...e].sort((e, t) => {
			let n = x(e.values[N.field], t.values[N.field]);
			return N.descending ? -n : n;
		})), e;
	})(), Y = W ? 1 : Math.max(1, Math.ceil(J.length / H)), X = Math.min(oe, Y - 1), Z = W ? J : J.slice(X * H, (X + 1) * H), Q = (e) => {
		O(K, w.tableId), O(G, e.id);
		for (let [t, n] of Object.entries(e.context)) O(t, n);
	}, se = () => {
		O(K, w.tableId), O(G, T.new_record_value ?? "new");
	}, $ = async () => {
		F && !k.submitting && await k.submit({
			actionId: w.capabilities.updateActionId,
			params: {
				workspace_id: w.workspaceId,
				table_id: w.tableId,
				record_id: F.record.id,
				revision: F.record.revision,
				values: { [F.field.key]: F.value }
			},
			successMessage: `${l(w, F.record)} updated`,
			refreshTarget: "*",
			onComplete: (e) => {
				p(e.status) || I(null);
			}
		});
	}, ce = V.map((e) => ({
		id: e.key,
		header: e.label,
		kind: C(e),
		grow: e.key === w.primaryField,
		primary: e.key === w.primaryField,
		accessor: (t) => t.values[e.key],
		align: e.type === "number" || e.type === "currency" || e.type === "percent" ? "end" : "start",
		cell: (t) => F?.record.id !== t.id || F.field.key !== e.key ? /* @__PURE__ */ _(m, {
			field: e,
			value: t.values[e.key],
			context: "grid"
		}) : /* @__PURE__ */ v("span", {
			className: "mtc-data-grid-editor",
			children: [
				/* @__PURE__ */ _(h, {
					field: e,
					value: F.value,
					onChange: (e) => I((t) => t && {
						...t,
						value: e
					}),
					label: e.label,
					compact: !0,
					autoFocus: !0,
					disabled: k.submitting,
					onCommit: () => void $(),
					onCancel: () => I(null)
				}),
				/* @__PURE__ */ _(r, {
					icon: /* @__PURE__ */ _(n, { name: "check" }),
					size: "small",
					variant: "ghost",
					"aria-label": `Save ${e.label}`,
					disabled: k.submitting,
					onClick: () => void $()
				}),
				/* @__PURE__ */ _(r, {
					icon: /* @__PURE__ */ _(n, { name: "close" }),
					size: "small",
					variant: "ghost",
					"aria-label": "Cancel edit",
					onClick: () => I(null)
				})
			]
		})
	}));
	return /* @__PURE__ */ v("div", {
		className: "h-full flex flex-col min-h-0 gap-2",
		children: [/* @__PURE__ */ v("div", {
			className: "flex items-center gap-2",
			children: [
				T.search !== !1 && /* @__PURE__ */ _(i, {
					type: "search",
					size: "small",
					value: A,
					onChange: (e) => {
						j(e.target.value), M(0);
					},
					"aria-label": `Search ${w.tableName || "records"}`,
					placeholder: `Search ${w.tableName || "records"}…`,
					className: "min-w-0 flex-1"
				}),
				z.length > 1 && /* @__PURE__ */ _("select", {
					value: B?.id ?? "",
					onChange: (e) => {
						R(e.target.value), M(0), P(null);
					},
					className: "mtc-input max-w-[12rem]",
					"data-size": "small",
					"aria-label": "Saved view",
					children: z.map((e) => /* @__PURE__ */ _("option", {
						value: e.id,
						children: e.name
					}, e.id))
				}),
				w.capabilities.create && /* @__PURE__ */ _(t, {
					size: "small",
					intent: "primary",
					startIcon: /* @__PURE__ */ _(n, { name: "add" }),
					onClick: se,
					children: "New"
				})
			]
		}), /* @__PURE__ */ _(o, {
			label: w.tableName || "Records",
			className: "min-h-0 flex-1",
			columns: ce,
			rows: Z,
			rowKey: (e) => e.id,
			rowLabel: (e) => l(w, e),
			selection: "single",
			selectedKeys: D[G] ? [D[G]] : [],
			onSelectionChange: (e) => {
				let t = Z.find((t) => t.id === e[0]);
				t && Q(t);
			},
			onRowActivate: Q,
			onCellEdit: q ? (e, t) => {
				let n = V.find((e) => e.key === t);
				n && q && te(n) && I({
					record: e,
					field: n,
					value: e.values[n.key]
				});
			} : void 0,
			editingCell: F ? {
				rowKey: F.record.id,
				columnId: F.field.key
			} : null,
			sort: N ? {
				columnId: N.field,
				direction: N.descending ? "descending" : "ascending"
			} : null,
			onSortChange: (e) => {
				P(e ? {
					field: e.columnId,
					descending: e.direction === "descending"
				} : null), M(0);
			},
			sortMode: "server",
			empty: /* @__PURE__ */ _(c, { children: "No matching records" }),
			rowProps: (e) => ({ "data-mtc-record-id": e.id }),
			footer: /* @__PURE__ */ v("div", {
				className: "flex w-full items-center justify-between gap-3",
				children: [/* @__PURE__ */ v("span", { children: [
					J.length,
					" shown",
					w.total != null && w.total !== J.length ? ` · ${w.total} total` : "",
					B ? ` · ${B.name}` : ""
				] }), W ? /* @__PURE__ */ _(f, {
					nextPageToken: w.nextPageToken,
					widgetId: S,
					options: T,
					ariaLabel: "Record pages"
				}) : Y > 1 && /* @__PURE__ */ _(a, {
					label: "Record pages",
					page: X + 1,
					pageCount: Y,
					onPageChange: (e) => M(e - 1)
				})]
			})
		})]
	});
}
function C(e) {
	let { type: t } = e;
	if (t === "date") return "date";
	if (t === "datetime" || t === "created_at" || t === "updated_at") return "datetime";
	if (t === "boolean") return "boolean";
	if (t === "multi_select" || e.allowMultiple) return "list";
	if (t === "single_select" || (t === "user" || t === "link") && e.choices.length > 0) return "enum";
}
//#endregion
export { y as n, S as t };
