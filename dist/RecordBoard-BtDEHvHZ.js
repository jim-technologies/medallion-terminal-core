import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, at as r, et as i, lt as a, ut as o } from "./MultiDashboard-B8rxYV_S.js";
import { t as s } from "./useSubmitAction-vimZgsDR.js";
import { n as c } from "./RecordFields-CYC16egg.js";
import { useEffect as l, useMemo as u, useState as d } from "react";
import { jsx as f, jsxs as p } from "react/jsx-runtime";
//#region src/widgets/RecordBoard.tsx
var m = /* @__PURE__ */ e({ RecordBoard: () => v });
function h(e) {
	return e.filter((e) => e.type === "board");
}
function g(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = e;
		return String(t.id ?? t.value ?? t.label ?? t.name ?? "");
	}
	return e == null ? "" : String(e);
}
function _(e) {
	switch (e?.toLowerCase()) {
		case "ok":
		case "green":
		case "emerald": return "bg-emerald-400";
		case "warn":
		case "amber":
		case "yellow":
		case "orange": return "bg-amber-400";
		case "danger":
		case "red": return "bg-red-400";
		case "info":
		case "blue":
		case "cyan":
		case "purple": return "bg-sky-400";
		default: return "bg-zinc-500";
	}
}
function v({ data: e, options: m, widgetId: v }) {
	let y = u(() => r(e), [e]), b = m ?? {}, { backendUrl: x, setCtx: S } = t(), C = s(v), [w, T] = d(""), [E, D] = d(b.view_id ?? ""), [O, k] = d(null);
	if (l(() => D(b.view_id ?? ""), [b.view_id]), !y) return /* @__PURE__ */ f(n, { children: "No record set" });
	let A = h(y.views), j = A.find((e) => e.id === E) ?? A.find((e) => e.id === y.activeViewId) ?? A[0], M = b.group_by ?? j?.groupBy, N = y.fields.find((e) => e.key === M);
	if (!N) return /* @__PURE__ */ f(n, {
		padded: !0,
		children: "A board requires a group_by field or board view"
	});
	let P = b.record_id_key ?? "record_id", F = b.table_id_key ?? "table_id", I = b.allow_move !== !1 && y.capabilities.update && x !== void 0 && !N.readOnly, L = i(y.records, j), R = w.trim().toLowerCase(), z = R ? L.filter((e) => Object.values(e.values).some((e) => o(e).toLowerCase().includes(R))) : L, B = [...new Set(z.map((e) => g(e.values[N.key])))], V = [...N.choices.map((e) => e.value), ...B.filter((e) => !N.choices.some((t) => t.value === e))];
	V.includes("") || V.push("");
	let H = (b.card_fields?.length ? b.card_fields : j?.visibleFields.length ? j.visibleFields : y.fields.map((e) => e.key)).filter((e) => e !== (j?.titleField ?? y.primaryField) && e !== N.key).map((e) => y.fields.find((t) => t.key === e)).filter((e) => !!e).slice(0, 4), U = (e) => {
		S(F, y.tableId), S(P, e.id);
		for (let [t, n] of Object.entries(e.context)) S(t, n);
	}, W = async (e, t) => {
		!I || C.submitting || g(e.values[N.key]) === t || await C.submit({
			actionId: y.capabilities.updateActionId,
			params: {
				workspace_id: y.workspaceId,
				table_id: y.tableId,
				record_id: e.id,
				revision: e.revision,
				values: { [N.key]: t || null }
			},
			successMessage: `${a(y, e, j?.titleField)} moved`,
			refreshTarget: "*",
			announce: !1
		});
	};
	return /* @__PURE__ */ p("div", {
		className: "h-full flex flex-col min-h-0",
		children: [/* @__PURE__ */ p("div", {
			className: "flex items-center gap-2 pb-2",
			children: [
				b.search !== !1 && /* @__PURE__ */ f("input", {
					type: "search",
					value: w,
					onChange: (e) => T(e.target.value),
					placeholder: `Search ${y.tableName || "records"}…`,
					className: "mtc-control flex-1 min-w-0 px-2 py-1.5 text-xs outline-none focus:border-sky-500"
				}),
				A.length > 1 && /* @__PURE__ */ f("select", {
					value: j?.id ?? "",
					onChange: (e) => D(e.target.value),
					className: "mtc-control max-w-[12rem] px-2 py-1.5 text-xs text-zinc-300 outline-none",
					"aria-label": "Saved board view",
					children: A.map((e) => /* @__PURE__ */ f("option", {
						value: e.id,
						children: e.name
					}, e.id))
				}),
				y.capabilities.create && /* @__PURE__ */ f("button", {
					type: "button",
					onClick: () => {
						S(F, y.tableId), S(P, b.new_record_value ?? "new");
					},
					className: "mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/30",
					children: "+ New"
				})
			]
		}), /* @__PURE__ */ f("div", {
			className: "flex-1 min-h-0 overflow-x-auto overflow-y-hidden",
			children: /* @__PURE__ */ f("div", {
				className: "h-full flex gap-3 min-w-max",
				children: V.map((e) => {
					let t = N.choices.find((t) => t.value === e), n = z.filter((t) => g(t.values[N.key]) === e);
					return /* @__PURE__ */ p("section", {
						className: "w-64 h-full flex flex-col rounded border border-zinc-800 bg-zinc-950/25",
						onDragOver: (e) => {
							I && e.preventDefault();
						},
						onDrop: (t) => {
							t.preventDefault();
							let n = t.dataTransfer.getData("text/record-id") || O, r = z.find((e) => e.id === n);
							k(null), r && W(r, e);
						},
						children: [/* @__PURE__ */ p("header", {
							className: "flex items-center gap-2 px-3 py-2 border-b border-zinc-800",
							children: [
								/* @__PURE__ */ f("span", { className: `w-1.5 h-1.5 rounded-full ${_(t?.color)}` }),
								/* @__PURE__ */ f("span", {
									className: "text-[10px] uppercase tracking-wider text-zinc-400 truncate",
									children: (t?.label ?? e) || "Unassigned"
								}),
								/* @__PURE__ */ f("span", {
									className: "ml-auto text-[10px] tabular-nums text-zinc-600",
									children: n.length
								})
							]
						}), /* @__PURE__ */ p("div", {
							className: "p-2 space-y-2 overflow-y-auto min-h-0",
							children: [n.map((e) => /* @__PURE__ */ p("article", {
								draggable: I,
								onDragStart: (t) => {
									k(e.id), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/record-id", e.id);
								},
								onDragEnd: () => k(null),
								className: `mtc-landing-card p-3 ${O === e.id ? "opacity-50" : ""}`,
								children: [/* @__PURE__ */ p("button", {
									type: "button",
									onClick: () => U(e),
									className: "block w-full text-left",
									children: [
										/* @__PURE__ */ f("h4", {
											className: "text-xs font-semibold text-zinc-100 leading-snug",
											children: a(y, e, j?.titleField)
										}),
										/* @__PURE__ */ f("span", {
											className: "text-[9px] font-mono text-zinc-600",
											children: e.id
										}),
										H.length > 0 && /* @__PURE__ */ f("dl", {
											className: "mt-2 space-y-1.5",
											children: H.map((t) => /* @__PURE__ */ p("div", {
												className: "grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2",
												children: [/* @__PURE__ */ f("dt", {
													className: "text-[9px] uppercase tracking-wider text-zinc-600 truncate",
													children: t.label
												}), /* @__PURE__ */ f("dd", {
													className: "text-[10px] text-zinc-300 min-w-0 truncate",
													children: /* @__PURE__ */ f(c, {
														field: t,
														value: e.values[t.key]
													})
												})]
											}, t.key))
										})
									]
								}), I && /* @__PURE__ */ f("select", {
									value: g(e.values[N.key]),
									onChange: (t) => void W(e, t.target.value),
									disabled: C.submitting,
									className: "mtc-control mt-2 w-full px-2 py-1 text-[10px] text-zinc-400 outline-none disabled:opacity-40",
									"aria-label": `Move ${a(y, e, j?.titleField)} to lane`,
									children: V.map((e) => {
										let t = N.choices.find((t) => t.value === e);
										return /* @__PURE__ */ f("option", {
											value: e,
											children: (t?.label ?? e) || "Unassigned"
										}, e || "__unassigned");
									})
								})]
							}, e.id)), n.length === 0 && /* @__PURE__ */ f("div", {
								className: "py-8 text-center text-[10px] text-zinc-700",
								children: "No records"
							})]
						})]
					}, e || "__unassigned");
				})
			})
		})]
	});
}
//#endregion
export { m as n, v as t };
