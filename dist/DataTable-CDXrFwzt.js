import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-CwQKjnza.js";
import { a as r, i, n as a, o, r as s } from "./format-V6rpoQ-_.js";
import { r as c } from "./textNormalize-Ba1I6dwH.js";
import { useEffect as l, useMemo as u, useRef as d, useState as f } from "react";
import { jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/widgets/DataTable.tsx
var h = /* @__PURE__ */ e({ DataTable: () => v }), g = 25, _ = 600;
function v({ data: e, options: r }) {
	let { setCtx: i } = t(), a = r?.pageSize || g, o = r?.row_context, s = r?.heat_columns ?? [], h = r?.export === !0, v = r?.tick_flash === !0, T = r?.search === !0, E = r?.column_formats ?? {}, { columns: D, rows: O, labels: k, formats: A } = u(() => y(e), [e]), j = u(() => ({
		...A,
		...E
	}), [A, E]), [M, N] = f(null), [P, F] = f(!0), [I, L] = f(0), [R, z] = f(""), B = (e, t) => {
		let n = D[0] == null ? void 0 : e[D[0]];
		return n == null ? `_idx_${t}` : String(n);
	}, V = d(/* @__PURE__ */ new Map()), [H, U] = f(/* @__PURE__ */ new Map());
	l(() => {
		if (!v) return;
		let e = /* @__PURE__ */ new Map();
		for (let t = 0; t < O.length; t++) {
			let n = O[t], r = B(n, t), i = V.current.get(r), a = {}, o = null;
			for (let e of D) {
				let t = n[e];
				typeof t == "number" && (a[e] = t, o == null && i && i[e] != null && i[e] !== t && (o = t > i[e] ? "up" : "down"));
			}
			V.current.set(r, a), o && e.set(r, o);
		}
		if (e.size === 0) return;
		U((t) => {
			let n = new Map(t);
			for (let [t, r] of e) n.set(t, r);
			return n;
		});
		let t = setTimeout(() => {
			U((t) => {
				let n = new Map(t);
				for (let [t, r] of e) n.get(t) === r && n.delete(t);
				return n;
			});
		}, _);
		return () => clearTimeout(t);
	}, [O, v]);
	let W = u(() => {
		let e = {};
		for (let t of s) {
			let n = Infinity, r = -Infinity;
			for (let e of O) {
				let i = e[t];
				typeof i == "number" && Number.isFinite(i) && (i < n && (n = i), i > r && (r = i));
			}
			Number.isFinite(n) && Number.isFinite(r) && (e[t] = {
				min: n,
				max: r
			});
		}
		return e;
	}, [O, s]), G = (e) => {
		if (!o) return;
		let t = e[o.field ?? D[0]];
		t != null && i(o.key, String(t));
	}, K = u(() => {
		let e = R.trim().toLowerCase();
		return e ? O.filter((t) => D.some((n) => {
			let r = t[n];
			return r != null && String(r).toLowerCase().includes(e);
		})) : O;
	}, [
		O,
		D,
		R
	]), q = u(() => M ? [...K].sort((e, t) => {
		let n = e[M], r = t[M];
		if (n == null && r == null) return 0;
		if (n == null) return 1;
		if (r == null) return -1;
		let i = typeof n == "number" && typeof r == "number" ? n - r : String(n).localeCompare(String(r));
		return P ? i : -i;
	}) : K, [
		K,
		M,
		P
	]), J = Math.max(1, Math.ceil(q.length / a)), Y = Math.min(I, J - 1), X = q.slice(Y * a, (Y + 1) * a), Z = q.length > a, Q = (e) => {
		M === e ? F(!P) : (N(e), F(!0)), L(0);
	};
	return D.length === 0 ? /* @__PURE__ */ p(n, { children: "No data" }) : /* @__PURE__ */ m("div", {
		className: "flex flex-col h-full",
		children: [
			(T || h) && /* @__PURE__ */ m("div", {
				className: "flex items-center gap-2 pb-1",
				children: [T && /* @__PURE__ */ p("input", {
					type: "text",
					value: R,
					onChange: (e) => {
						z(e.target.value), L(0);
					},
					placeholder: "filter…",
					className: "flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
				}), h && /* @__PURE__ */ p("button", {
					onClick: () => {
						let e = [D.map(x).join(","), ...q.map((e) => D.map((t) => x(e[t])).join(","))], t = new Blob([e.join("\n")], { type: "text/csv;charset=utf-8" }), n = URL.createObjectURL(t), r = document.createElement("a");
						r.href = n, r.download = "export.csv", r.click(), URL.revokeObjectURL(n);
					},
					className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0",
					title: "Download as CSV",
					children: "↓ CSV"
				})]
			}),
			/* @__PURE__ */ p("div", {
				className: "overflow-auto flex-1 min-h-0",
				tabIndex: 0,
				"aria-label": "Table data",
				children: /* @__PURE__ */ m("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ p("thead", {
						className: "sticky top-0 bg-zinc-900",
						children: /* @__PURE__ */ p("tr", { children: D.map((e) => {
							let t = j[e];
							return /* @__PURE__ */ m("th", {
								onClick: () => Q(e),
								className: `px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${t && t !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(t) ? "text-right" : "text-left"}`,
								children: [k[e] ?? e, M === e && /* @__PURE__ */ p("span", {
									className: "ml-1 text-zinc-500",
									children: P ? "↑" : "↓"
								})]
							}, e);
						}) })
					}), /* @__PURE__ */ p("tbody", { children: X.map((e, t) => {
						let n = H.get(B(e, t));
						return /* @__PURE__ */ p("tr", {
							onClick: o ? () => G(e) : void 0,
							className: `border-b border-zinc-800/60 transition-colors duration-300 ${n === "up" ? "bg-emerald-500/15" : n === "down" ? "bg-red-500/15" : ""} ${o ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/40"}`,
							children: D.map((t) => {
								let n = W[t], r = e[t], i = n && typeof r == "number" ? { backgroundColor: b(r, n.min, n.max) } : void 0, a = j[t];
								if (a === "link" && r != null) {
									let e = typeof r == "object" && !Array.isArray(r) ? r : {
										label: void 0,
										url: r
									}, n = c(e.url), a = e.label != null && e.label !== "" ? String(e.label) : n ?? "";
									return /* @__PURE__ */ p("td", {
										className: "px-3 py-2.5 whitespace-nowrap",
										style: i,
										children: n ? /* @__PURE__ */ m("a", {
											href: n,
											...n.startsWith("/") ? {} : {
												target: "_blank",
												rel: "noopener noreferrer"
											},
											className: "text-sky-400 hover:underline",
											children: [a, /* @__PURE__ */ p("span", {
												className: "ml-1 text-xs text-zinc-500",
												"aria-hidden": "true",
												children: n.startsWith("/") ? "→" : "↗"
											})]
										}) : /* @__PURE__ */ p("span", {
											className: "text-zinc-100",
											children: a
										})
									}, t);
								}
								if (a === "sparkline" && Array.isArray(r)) return /* @__PURE__ */ p("td", {
									className: "px-3 py-2.5 whitespace-nowrap",
									style: i,
									children: /* @__PURE__ */ p(S, { values: r })
								}, t);
								let o = a ? w(r, a) : C(r), s = a ? a.split(":").slice(1).includes("signed") : !1;
								return /* @__PURE__ */ p("td", {
									className: `px-3 py-2.5 whitespace-nowrap tabular-nums ${a && a !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(a) ? "text-right" : ""} ${s && typeof r == "number" ? r > 0 ? "text-emerald-400" : r < 0 ? "text-red-400" : "text-zinc-100" : "text-zinc-100"}`,
									style: i,
									children: o
								}, t);
							})
						}, t);
					}) })]
				})
			}),
			Z && /* @__PURE__ */ m("div", {
				className: "flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400",
				children: [/* @__PURE__ */ m("span", { children: [q.length, " rows"] }), /* @__PURE__ */ m("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ p("button", {
							onClick: () => L(0),
							disabled: Y === 0,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "«"
						}),
						/* @__PURE__ */ p("button", {
							onClick: () => L((e) => e - 1),
							disabled: Y === 0,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "‹"
						}),
						/* @__PURE__ */ m("span", {
							className: "px-2 text-zinc-300",
							children: [
								Y + 1,
								" / ",
								J
							]
						}),
						/* @__PURE__ */ p("button", {
							onClick: () => L((e) => e + 1),
							disabled: Y >= J - 1,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "›"
						}),
						/* @__PURE__ */ p("button", {
							onClick: () => L(J - 1),
							disabled: Y >= J - 1,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "»"
						})
					]
				})]
			})
		]
	});
}
function y(e) {
	let t = {
		columns: [],
		rows: [],
		labels: {},
		formats: {}
	};
	if (!e) return t;
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object") {
		let n = [...new Set(e.flatMap((e) => Object.keys(e)))];
		return {
			...t,
			columns: n,
			rows: e
		};
	}
	if (typeof e == "object" && e && "rows" in e) {
		let n = e, r = Array.isArray(n.columns) ? n.columns : [];
		if (r.length > 0 && typeof r[0] == "object") {
			let e = r, t = e.map((e) => e.key), i = {}, a = {};
			for (let t of e) t.label && (i[t.key] = t.label), t.format && (a[t.key] = t.format);
			return {
				columns: t,
				rows: n.rows.map((e) => Array.isArray(e) ? Object.fromEntries(t.map((t, n) => [t, e[n]])) : e),
				labels: i,
				formats: a
			};
		}
		if (r.length > 0) {
			let e = r, i = n.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, t[n]])) : t);
			return {
				...t,
				columns: e,
				rows: i
			};
		}
		let i = n.rows;
		if (i.length > 0 && typeof i[0] == "object" && !Array.isArray(i[0])) {
			let e = [...new Set(i.flatMap((e) => Object.keys(e)))];
			return {
				...t,
				columns: e,
				rows: i
			};
		}
	}
	return t;
}
function b(e, t, n) {
	if (n === t) return "transparent";
	if (t < 0 && n > 0) {
		let r = Math.max(-1, Math.min(1, e / Math.max(Math.abs(t), Math.abs(n))));
		return r >= 0 ? `color-mix(in oklab, var(--mtc-ok) ${35 * r}%, transparent)` : `color-mix(in oklab, var(--mtc-danger) ${35 * -r}%, transparent)`;
	}
	return `color-mix(in oklab, var(--mtc-accent) ${35 * ((e - t) / (n - t))}%, transparent)`;
}
function x(e) {
	if (e == null) return "";
	if (typeof e == "object" && !Array.isArray(e) && "url" in e) return x(e.url);
	let t = String(e);
	return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function S({ values: e }) {
	let t = e.map((e) => Number(e)).filter((e) => Number.isFinite(e));
	if (t.length < 2) return /* @__PURE__ */ p("span", {
		className: "text-zinc-600",
		children: "—"
	});
	let n = Math.min(...t), r = Math.max(...t) - n || 1;
	return /* @__PURE__ */ p("svg", {
		viewBox: "0 0 100 16",
		className: "w-20 h-4",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ p("polyline", {
			fill: "none",
			stroke: t[t.length - 1] >= t[0] ? "var(--mtc-ok)" : "var(--mtc-danger)",
			strokeWidth: "1.5",
			points: t.map((e, i) => {
				let a = i / (t.length - 1) * 100, o = 16 - (e - n) / r * 14 - 1;
				return `${a.toFixed(1)},${o.toFixed(1)}`;
			}).join(" "),
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function C(e) {
	return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	}) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function w(e, t) {
	if (e == null) return "—";
	if (t.split(":")[0] === "datetime") return r(e);
	if (typeof e != "number") return C(e);
	let [n, ...c] = t.split(":"), l = new Set(c), u = l.has("signed");
	switch (n) {
		case "currency": return i(e, c.find((e) => e !== "signed") ?? "USD");
		case "percent": return o(e, {
			signed: u,
			as: l.has("p") ? "percent" : "fraction"
		});
		case "bps": return a(e, { signed: u });
		case "compact": return s(e);
		default: return C(e);
	}
}
//#endregion
export { h as n, v as t };
