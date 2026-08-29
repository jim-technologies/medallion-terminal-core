import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-B8rxYV_S.js";
import { useMemo as r } from "react";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
//#region src/widgets/PairedGrid.tsx
var o = /* @__PURE__ */ e({ PairedGrid: () => c }), s = 6;
function c({ data: e, options: o }) {
	let { setCtx: s } = t(), c = r(() => l(e), [e]), u = r(() => c ? [...c.rows].sort((e, t) => e.key - t.key) : [], [c]);
	if (!c) return /* @__PURE__ */ i(n, { children: "No data" });
	let d = c.subject_value, f = u.length >= 2 ? u[1].key - u[0].key : 0, m = c.measures, h = o?.row_context;
	return /* @__PURE__ */ a("div", {
		className: "h-full flex flex-col text-xs",
		children: [/* @__PURE__ */ a("div", {
			className: "px-3 py-2 border-b border-zinc-800 flex items-baseline gap-3 flex-wrap shrink-0",
			children: [
				/* @__PURE__ */ i("span", {
					className: "text-zinc-100 font-medium",
					children: c.subject
				}),
				c.dimension && /* @__PURE__ */ i("span", {
					className: "text-zinc-500",
					children: c.dimension
				}),
				d != null && /* @__PURE__ */ i("span", {
					className: "text-zinc-300 tabular-nums",
					children: d.toLocaleString()
				}),
				c.venue && /* @__PURE__ */ i("span", {
					className: "ml-auto text-zinc-500 text-[10px] uppercase tracking-wider",
					children: c.venue
				})
			]
		}), /* @__PURE__ */ i("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: /* @__PURE__ */ a("table", {
				className: "w-full font-mono tabular-nums",
				children: [/* @__PURE__ */ a("thead", {
					className: "sticky top-0 bg-zinc-900 z-10",
					children: [/* @__PURE__ */ a("tr", {
						className: "text-[10px] text-zinc-600 border-b border-zinc-800/60",
						children: [
							/* @__PURE__ */ i("th", {
								colSpan: m.length,
								className: "text-center py-1 text-emerald-400 uppercase tracking-wider",
								children: c.left_label
							}),
							/* @__PURE__ */ i("th", { className: "bg-zinc-950" }),
							/* @__PURE__ */ i("th", {
								colSpan: m.length,
								className: "text-center py-1 text-red-400 uppercase tracking-wider",
								children: c.right_label
							})
						]
					}), /* @__PURE__ */ a("tr", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800",
						children: [
							m.map((e) => /* @__PURE__ */ i("th", {
								className: "text-right px-2 py-1.5",
								children: e.label
							}, `l-${e.key}`)),
							/* @__PURE__ */ i("th", {
								className: "text-center px-2 py-1.5 bg-zinc-950",
								children: c.key_label
							}),
							m.map((e) => /* @__PURE__ */ i("th", {
								className: "text-right px-2 py-1.5",
								children: e.label
							}, `r-${e.key}`))
						]
					})]
				}), /* @__PURE__ */ i("tbody", { children: u.map((e, t) => {
					let n = d != null && f > 0 && Math.abs(e.key - d) < f, r = !!h;
					return /* @__PURE__ */ a("tr", {
						onClick: r ? () => s(h.key, String(e.key)) : void 0,
						className: `border-b border-zinc-800/40 ${`${n ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"} ${r ? "cursor-pointer" : ""}`}`,
						children: [
							m.map((t) => /* @__PURE__ */ i("td", {
								className: "text-right px-2 py-1 text-zinc-300",
								children: p(e.left?.values?.[t.key], t.format)
							}, `l-${t.key}`)),
							/* @__PURE__ */ i("td", {
								className: `text-center px-2 py-1 font-medium ${n ? "text-zinc-100 bg-zinc-950/60" : "text-zinc-300 bg-zinc-950/40"}`,
								children: e.key.toLocaleString()
							}),
							m.map((t) => /* @__PURE__ */ i("td", {
								className: "text-right px-2 py-1 text-zinc-300",
								children: p(e.right?.values?.[t.key], t.format)
							}, `r-${t.key}`))
						]
					}, t);
				}) })]
			})
		})]
	});
}
function l(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e;
	if (!Array.isArray(t.rows) || t.rows.length === 0) return null;
	let n = t.rows.map((e) => {
		let t = e;
		return {
			key: Number(t.key ?? t.strike ?? 0),
			left: f(t.left ?? t.call),
			right: f(t.right ?? t.put)
		};
	}), r = u(t.measures), i = r.length > 0 ? r : d(n);
	return {
		subject: String(t.subject ?? t.underlying ?? ""),
		dimension: typeof t.dimension == "string" ? t.dimension : typeof t.expiry == "string" ? t.expiry : void 0,
		subject_value: typeof t.subject_value == "number" ? t.subject_value : typeof t.underlying_price == "number" ? t.underlying_price : void 0,
		venue: typeof t.venue == "string" ? t.venue : void 0,
		rows: n,
		left_label: String(t.left_label ?? "Left"),
		right_label: String(t.right_label ?? "Right"),
		key_label: String(t.key_label ?? "Key"),
		measures: i
	};
}
function u(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e) {
		if (!n || typeof n != "object") continue;
		let e = n;
		typeof e.key == "string" && t.push({
			key: e.key,
			label: typeof e.label == "string" && e.label ? e.label : e.key,
			format: typeof e.format == "string" ? e.format : void 0
		});
	}
	return t;
}
function d(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of [n.left, n.right]) if (e?.values) for (let n of Object.keys(e.values)) t.add(n);
	return Array.from(t).slice(0, s).map((e) => ({
		key: e,
		label: e
	}));
}
function f(e) {
	if (!e || typeof e != "object") return;
	let t = e;
	if (t.values && typeof t.values == "object" && !Array.isArray(t.values)) {
		let e = {};
		for (let [n, r] of Object.entries(t.values)) typeof r == "number" && (e[n] = r);
		return Object.keys(e).length === 0 ? void 0 : { values: e };
	}
	let n = {};
	for (let [e, r] of Object.entries(t)) typeof r == "number" && (n[e] = r);
	return Object.keys(n).length === 0 ? void 0 : { values: n };
}
function p(e, t) {
	if (e == null) return "·";
	if (t === "percent") return `${(e * 100).toFixed(0)}%`;
	if (t === "compact") return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
	if (t === "delta") return `${e > 0 ? "+" : ""}${e.toFixed(2)}`;
	if (t?.startsWith("currency")) {
		let n = t.split(":")[1] ?? "USD";
		return e.toLocaleString(void 0, {
			style: "currency",
			currency: n,
			maximumFractionDigits: 0
		});
	}
	return e.toFixed(2);
}
//#endregion
export { o as n, c as t };
