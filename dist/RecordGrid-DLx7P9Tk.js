import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t, h as n, p as r } from "./States-Ds3cxTem.js";
import { p as i, t as a } from "./DataGrid-JBkDnOnI.js";
import { t as o } from "./Pagination-tCTZ9nS0.js";
import { $ as ee, Ft as s, ct as c, it as l, kt as u, lt as d, rt as f } from "./MultiDashboard-ql8g4bYE.js";
import { n as p, t as m } from "./CursorPager-ChPDQwnq.js";
import { t as h } from "./useWatchAction-DN4hMMcm.js";
import { t as g } from "./useSubmitAction-CJ-SSm3f.js";
import { n as te, t as _ } from "./RecordFields-VfuCcjCx.js";
import { useEffect as v, useMemo as y, useState as b } from "react";
import { jsx as x, jsxs as S } from "react/jsx-runtime";
//#region src/widgets/RecordGrid.tsx
var C = /* @__PURE__ */ e({ RecordGrid: () => w });
function ne(e) {
	return e.filter((e) => e.type === "grid" || e.type === "list");
}
function re(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : d(e).localeCompare(d(t), void 0, {
		numeric: !0,
		sensitivity: "base"
	});
}
function w({ data: e, options: C, widgetId: w }) {
	let T = y(() => l(e), [e]), E = C ?? {}, { backendUrl: D, ctx: O, setCtx: k } = u(), A = g(w), [j, ie] = b(""), [ae, M] = b(0), [N, P] = b(null), [F, I] = b(null), [L, R] = b(E.view_id ?? "");
	if (v(() => {
		R(E.view_id ?? "");
	}, [E.view_id]), !T) return /* @__PURE__ */ x(s, { children: "No record set" });
	let z = ne(T.views), B = z.find((e) => e.id === L) ?? z.find((e) => e.id === T.activeViewId) ?? z[0], V = (E.visible_fields?.length ? E.visible_fields : B?.visibleFields.length ? B.visibleFields : T.fields.map((e) => e.key)).map((e) => T.fields.find((t) => t.key === e)).filter((e) => !!e), H = Math.max(1, E.page_size ?? 25), U = p(w, E), W = !!T.nextPageToken || !!O[U], G = E.record_id_key ?? "record_id", K = E.table_id_key ?? "table_id", q = T.capabilities.update && E.inline_edit !== !1 && D !== void 0, J = (() => {
		let e = ee(T.records, B), t = j.trim().toLowerCase();
		return t && (e = e.filter((e) => V.some((n) => d(e.values[n.key]).toLowerCase().includes(t)))), N && (e = [...e].sort((e, t) => {
			let n = re(e.values[N.field], t.values[N.field]);
			return N.descending ? -n : n;
		})), e;
	})(), Y = W ? 1 : Math.max(1, Math.ceil(J.length / H)), X = Math.min(ae, Y - 1), Z = W ? J : J.slice(X * H, (X + 1) * H), Q = (e) => {
		k(K, T.tableId), k(G, e.id);
		for (let [t, n] of Object.entries(e.context)) k(t, n);
	}, oe = () => {
		k(K, T.tableId), k(G, E.new_record_value ?? "new");
	}, $ = async () => {
		F && !A.submitting && await A.submit({
			actionId: T.capabilities.updateActionId,
			params: {
				workspace_id: T.workspaceId,
				table_id: T.tableId,
				record_id: F.record.id,
				revision: F.record.revision,
				values: { [F.field.key]: F.value }
			},
			successMessage: `${c(T, F.record)} updated`,
			refreshTarget: "*",
			onComplete: (e) => {
				h(e.status) || I(null);
			}
		});
	}, se = V.map((e) => ({
		id: e.key,
		header: e.label,
		width: e.type === "boolean" ? 96 : 176,
		accessor: (t) => t.values[e.key],
		align: e.type === "number" || e.type === "currency" || e.type === "percent" ? "end" : "start",
		cell: (t) => F?.record.id !== t.id || F.field.key !== e.key ? /* @__PURE__ */ x(te, {
			field: e,
			value: t.values[e.key]
		}) : /* @__PURE__ */ S("span", {
			className: "mtc-data-grid-editor",
			children: [
				/* @__PURE__ */ x(_, {
					field: e,
					value: F.value,
					onChange: (e) => I((t) => t && {
						...t,
						value: e
					}),
					compact: !0,
					autoFocus: !0,
					disabled: A.submitting,
					onCommit: () => void $(),
					onCancel: () => I(null)
				}),
				/* @__PURE__ */ x(r, {
					icon: /* @__PURE__ */ x(n, { name: "check" }),
					size: "small",
					variant: "ghost",
					"aria-label": `Save ${e.label}`,
					disabled: A.submitting,
					onClick: () => void $()
				}),
				/* @__PURE__ */ x(r, {
					icon: /* @__PURE__ */ x(n, { name: "close" }),
					size: "small",
					variant: "ghost",
					"aria-label": "Cancel edit",
					onClick: () => I(null)
				})
			]
		})
	}));
	return /* @__PURE__ */ S("div", {
		className: "h-full flex flex-col min-h-0 gap-2",
		children: [/* @__PURE__ */ S("div", {
			className: "flex items-center gap-2",
			children: [
				E.search !== !1 && /* @__PURE__ */ x(i, {
					type: "search",
					size: "small",
					value: j,
					onChange: (e) => {
						ie(e.target.value), M(0);
					},
					"aria-label": `Search ${T.tableName || "records"}`,
					placeholder: `Search ${T.tableName || "records"}…`,
					className: "min-w-0 flex-1"
				}),
				z.length > 1 && /* @__PURE__ */ x("select", {
					value: B?.id ?? "",
					onChange: (e) => {
						R(e.target.value), M(0), P(null);
					},
					className: "mtc-input max-w-[12rem]",
					"data-size": "small",
					"aria-label": "Saved view",
					children: z.map((e) => /* @__PURE__ */ x("option", {
						value: e.id,
						children: e.name
					}, e.id))
				}),
				T.capabilities.create && /* @__PURE__ */ x(t, {
					size: "small",
					intent: "primary",
					startIcon: /* @__PURE__ */ x(n, { name: "add" }),
					onClick: oe,
					children: "New"
				})
			]
		}), /* @__PURE__ */ x(a, {
			label: T.tableName || "Records",
			className: "min-h-0 flex-1",
			columns: se,
			rows: Z,
			rowKey: (e) => e.id,
			rowLabel: (e) => c(T, e),
			selection: "single",
			selectedKeys: O[G] ? [O[G]] : [],
			onSelectionChange: (e) => {
				let t = Z.find((t) => t.id === e[0]);
				t && Q(t);
			},
			onRowActivate: Q,
			onCellEdit: q ? (e, t) => {
				let n = V.find((e) => e.key === t);
				n && q && f(n) && I({
					record: e,
					field: n,
					value: e.values[n.key]
				});
			} : void 0,
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
			empty: /* @__PURE__ */ x(s, { children: "No matching records" }),
			rowProps: (e) => ({ "data-mtc-record-id": e.id }),
			footer: /* @__PURE__ */ S("div", {
				className: "flex w-full items-center justify-between gap-3",
				children: [/* @__PURE__ */ S("span", { children: [
					J.length,
					" shown",
					T.total != null && T.total !== J.length ? ` · ${T.total} total` : "",
					B ? ` · ${B.name}` : ""
				] }), W ? /* @__PURE__ */ x(m, {
					nextPageToken: T.nextPageToken,
					widgetId: w,
					options: E,
					ariaLabel: "Record pages"
				}) : Y > 1 && /* @__PURE__ */ x(o, {
					label: "Record pages",
					page: X + 1,
					pageCount: Y,
					onPageChange: (e) => M(e - 1)
				})]
			})
		})]
	});
}
//#endregion
export { C as n, w as t };
