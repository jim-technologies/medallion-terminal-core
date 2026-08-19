import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, at as r, et as i, lt as a, ot as o, st as s } from "./MultiDashboard-CwQKjnza.js";
import { useEffect as c, useMemo as l, useState as u } from "react";
import { jsx as d, jsxs as f } from "react/jsx-runtime";
//#region src/widgets/RecordCalendar.tsx
var p = /* @__PURE__ */ e({ RecordCalendar: () => y });
function m(e) {
	return e.filter((e) => e.type === "calendar" || e.type === "timeline");
}
function h(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function g(e, t) {
	return new Date(e.getFullYear(), e.getMonth() + t, 1);
}
function _(e, t) {
	let n = h(e), r = (n.getDay() - t + 7) % 7, i = new Date(n.getFullYear(), n.getMonth(), 1 - r);
	return Array.from({ length: 42 }, (e, t) => new Date(i.getFullYear(), i.getMonth(), i.getDate() + t));
}
function v(e) {
	switch (e?.toLowerCase()) {
		case "ok":
		case "green":
		case "emerald": return "bg-emerald-400";
		case "warn":
		case "warning":
		case "amber":
		case "yellow":
		case "orange": return "bg-amber-400";
		case "danger":
		case "error":
		case "red": return "bg-red-400";
		case "neutral":
		case "muted":
		case "gray":
		case "grey": return "bg-zinc-500";
		default: return "bg-sky-400";
	}
}
function y({ data: e, options: p }) {
	let y = l(() => r(e), [e]), b = p ?? {}, { setCtx: x } = t(), S = b.initial_month ? /* @__PURE__ */ new Date(`${b.initial_month}-01T12:00:00`) : /* @__PURE__ */ new Date(), [C, w] = u(h(Number.isNaN(S.getTime()) ? /* @__PURE__ */ new Date() : S)), [T, E] = u(b.view_id ?? "");
	if (c(() => E(b.view_id ?? ""), [b.view_id]), !y) return /* @__PURE__ */ d(n, { children: "No record set" });
	let D = m(y.views), O = D.find((e) => e.id === T) ?? D.find((e) => e.id === y.activeViewId) ?? D[0], k = b.date_field ?? O?.dateField, A = y.fields.find((e) => e.key === k);
	if (!A) return /* @__PURE__ */ d(n, {
		padded: !0,
		children: "A calendar requires a date_field or calendar view"
	});
	let j = y.fields.find((e) => e.key === b.color_field), M = b.week_starts_on ?? 1, N = _(C, M), P = i(y.records, O), F = /* @__PURE__ */ new Map();
	for (let e of P) {
		let t = s(e.values[A.key]);
		if (!t) continue;
		let n = F.get(t) ?? [];
		n.push(e), F.set(t, n);
	}
	let I = M === 1 ? [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	] : [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], L = s(Date.now()), R = b.record_id_key ?? "record_id", z = b.table_id_key ?? "table_id", B = (e) => {
		x(z, y.tableId), x(R, e.id);
		for (let [t, n] of Object.entries(e.context)) x(t, n);
	};
	return /* @__PURE__ */ f("div", {
		className: "h-full flex flex-col min-h-0",
		children: [/* @__PURE__ */ f("div", {
			className: "flex items-center gap-2 pb-2",
			children: [
				/* @__PURE__ */ d("button", {
					type: "button",
					onClick: () => w((e) => g(e, -1)),
					className: "mtc-control px-2 py-1 text-xs text-zinc-400",
					"aria-label": "Previous month",
					children: "←"
				}),
				/* @__PURE__ */ d("button", {
					type: "button",
					onClick: () => w(h(/* @__PURE__ */ new Date())),
					className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
					children: "Today"
				}),
				/* @__PURE__ */ d("h4", {
					className: "text-sm font-semibold text-zinc-100",
					children: C.toLocaleDateString(void 0, {
						month: "long",
						year: "numeric"
					})
				}),
				/* @__PURE__ */ d("button", {
					type: "button",
					onClick: () => w((e) => g(e, 1)),
					className: "mtc-control px-2 py-1 text-xs text-zinc-400",
					"aria-label": "Next month",
					children: "→"
				}),
				D.length > 1 && /* @__PURE__ */ d("select", {
					value: O?.id ?? "",
					onChange: (e) => E(e.target.value),
					className: "mtc-control ml-auto max-w-[12rem] px-2 py-1 text-xs text-zinc-300 outline-none",
					"aria-label": "Saved calendar view",
					children: D.map((e) => /* @__PURE__ */ d("option", {
						value: e.id,
						children: e.name
					}, e.id))
				})
			]
		}), /* @__PURE__ */ d("div", {
			className: "flex-1 min-h-0 overflow-x-auto",
			children: /* @__PURE__ */ f("div", {
				className: "h-full min-w-[42rem] flex flex-col",
				children: [/* @__PURE__ */ d("div", {
					className: "grid grid-cols-7 border-t border-l border-zinc-800 text-[9px] uppercase tracking-wider text-zinc-600",
					children: I.map((e) => /* @__PURE__ */ d("div", {
						className: "border-r border-b border-zinc-800 px-2 py-1",
						children: e
					}, e))
				}), /* @__PURE__ */ d("div", {
					className: "grid grid-cols-7 grid-rows-6 flex-1 min-h-0 border-l border-zinc-800 overflow-hidden",
					children: N.map((e) => {
						let t = s(e), n = F.get(t) ?? [], r = e.getMonth() === C.getMonth();
						return /* @__PURE__ */ f("div", {
							className: `min-w-0 min-h-0 border-r border-b border-zinc-800 p-1.5 overflow-y-auto ${r ? "bg-zinc-900/35" : "bg-zinc-950/45"}`,
							children: [/* @__PURE__ */ d("div", {
								className: `text-[10px] tabular-nums mb-1 ${t === L ? "w-5 h-5 grid place-items-center rounded-full bg-sky-500 text-zinc-100" : r ? "text-zinc-400" : "text-zinc-700"}`,
								children: e.getDate()
							}), /* @__PURE__ */ f("div", {
								className: "space-y-1",
								children: [n.slice(0, 4).map((e) => /* @__PURE__ */ f("button", {
									type: "button",
									onClick: () => B(e),
									className: "w-full flex items-start gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-1 text-left hover:border-zinc-600",
									title: a(y, e, O?.titleField),
									children: [/* @__PURE__ */ d("span", { className: `mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${v(o(j, j ? e.values[j.key] : void 0))}` }), /* @__PURE__ */ d("span", {
										className: "text-[9px] leading-tight text-zinc-300 line-clamp-2",
										children: a(y, e, O?.titleField)
									})]
								}, e.id)), n.length > 4 && /* @__PURE__ */ f("div", {
									className: "text-[9px] text-zinc-600 px-1",
									children: [
										"+",
										n.length - 4,
										" more"
									]
								})]
							})]
						}, t);
					})
				})]
			})
		})]
	});
}
//#endregion
export { p as n, y as t };
