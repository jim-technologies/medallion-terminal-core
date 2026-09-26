import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t, h as n } from "./States-Ds3cxTem.js";
import { i as r } from "./FormControls-Pb_YQOlN.js";
import { t as i } from "./Pagination-tCTZ9nS0.js";
import { t as a } from "./DataGrid-RMtOZsEU.js";
import { Ft as o, kt as s } from "./MultiDashboard-CZgQlq5z.js";
import { a as c, i as l, n as u, o as d, r as f } from "./format-V6rpoQ-_.js";
import { r as p } from "./textNormalize-Ba1I6dwH.js";
import { useEffect as m, useMemo as h, useRef as g, useState as _ } from "react";
import { Fragment as v, jsx as y, jsxs as b } from "react/jsx-runtime";
//#region src/widgets/DataTable.tsx
var x = /* @__PURE__ */ e({ DataTable: () => T }), S = 25, C = 104, w = 600;
function T({ data: e, options: c }) {
	let { ctx: l, setCtx: u } = s(), d = c?.pageSize || S, f = c?.row_context, p = c?.heat_columns ?? [], v = c?.export === !0, x = c?.tick_flash === !0, T = c?.search === !0, O = c?.column_formats ?? {}, { columns: k, rows: j, labels: M, formats: N } = h(() => D(e), [e]), P = h(() => ({
		...N,
		...O
	}), [N, O]), [F, I] = _(null), [L, R] = _(!0), [ee, z] = _(0), [B, V] = _(""), H = (e, t) => {
		let n = k[0] == null ? void 0 : e[k[0]];
		return n == null ? `_idx_${t}` : String(n);
	}, U = g(/* @__PURE__ */ new Map()), [W, G] = _(/* @__PURE__ */ new Map());
	m(() => {
		if (!x) return;
		let e = /* @__PURE__ */ new Map();
		for (let t = 0; t < j.length; t++) {
			let n = j[t], r = H(n, t), i = U.current.get(r), a = {}, o = null;
			for (let e of k) {
				let t = n[e];
				typeof t == "number" && (a[e] = t, o == null && i && i[e] != null && i[e] !== t && (o = t > i[e] ? "up" : "down"));
			}
			U.current.set(r, a), o && e.set(r, o);
		}
		if (e.size === 0) return;
		G((t) => {
			let n = new Map(t);
			for (let [t, r] of e) n.set(t, r);
			return n;
		});
		let t = setTimeout(() => {
			G((t) => {
				let n = new Map(t);
				for (let [t, r] of e) n.get(t) === r && n.delete(t);
				return n;
			});
		}, w);
		return () => clearTimeout(t);
	}, [j, x]);
	let K = h(() => {
		let e = {};
		for (let t of p) {
			let n = Infinity, r = -Infinity;
			for (let e of j) {
				let i = e[t];
				typeof i == "number" && Number.isFinite(i) && (i < n && (n = i), i > r && (r = i));
			}
			Number.isFinite(n) && Number.isFinite(r) && (e[t] = {
				min: n,
				max: r
			});
		}
		return e;
	}, [j, p]), q = (e) => {
		if (!f) return;
		let t = e[f.field ?? k[0]];
		t != null && u(f.key, String(t));
	}, J = h(() => {
		let e = B.trim().toLowerCase();
		return e ? j.filter((t) => k.some((n) => {
			let r = t[n];
			return r != null && String(r).toLowerCase().includes(e);
		})) : j;
	}, [
		j,
		k,
		B
	]), Y = h(() => F ? [...J].sort((e, t) => {
		let n = e[F], r = t[F];
		if (n == null && r == null) return 0;
		if (n == null) return 1;
		if (r == null) return -1;
		let i = typeof n == "number" && typeof r == "number" ? n - r : String(n).localeCompare(String(r));
		return L ? i : -i;
	}) : J, [
		J,
		F,
		L
	]), X = Math.max(1, Math.ceil(Y.length / d)), Z = Math.min(ee, X - 1), Q = Y.slice(Z * d, (Z + 1) * d), te = Y.length > d;
	if (k.length === 0) return /* @__PURE__ */ y(o, { children: "No data" });
	let ne = () => {
		let e = [k.map(A).join(","), ...Y.map((e) => k.map((t) => A(e[t])).join(","))], t = new Blob([e.join("\n")], { type: "text/csv;charset=utf-8" }), n = URL.createObjectURL(t), r = document.createElement("a");
		r.href = n, r.download = "export.csv", r.click(), URL.revokeObjectURL(n);
	}, re = k.map((e, t) => {
		let n = P[e], r = !!n && n !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(n);
		return {
			id: e,
			header: M[e] ?? e,
			width: n === "sparkline" ? C : void 0,
			grow: t === 0,
			align: r || !n && j.some((t) => typeof t[e] == "number") ? "end" : "start",
			cell: (t) => /* @__PURE__ */ y(E, {
				value: t[e],
				format: n,
				heat: K[e]
			})
		};
	}), $ = f ? Q.find((e) => {
		let t = e[f.field ?? k[0]];
		return t != null && String(t) === l[f.key];
	}) : void 0;
	return /* @__PURE__ */ b("div", {
		className: "flex flex-col h-full gap-2 mtc-data-table",
		children: [(T || v) && /* @__PURE__ */ b("div", {
			className: "flex items-center gap-2",
			children: [T && /* @__PURE__ */ y(r, {
				type: "search",
				size: "small",
				value: B,
				"aria-label": "Filter rows",
				onChange: (e) => {
					V(e.target.value), z(0);
				},
				placeholder: "Filter…",
				className: "min-w-0 flex-1"
			}), v && /* @__PURE__ */ y(t, {
				size: "small",
				variant: "ghost",
				startIcon: /* @__PURE__ */ y(n, { name: "download" }),
				onClick: ne,
				title: "Download as CSV",
				children: "CSV"
			})]
		}), /* @__PURE__ */ y(a, {
			label: "Table data",
			className: "min-h-0 flex-1",
			columns: re,
			rows: Q,
			rowKey: (e, t) => H(e, t),
			rowLabel: (e) => String(e[k[0]] ?? ""),
			selection: f ? "single" : "none",
			selectedKeys: $ ? [H($, Q.indexOf($))] : [],
			onSelectionChange: (e) => {
				let t = Q.findIndex((t, n) => H(t, n) === e[0]);
				t >= 0 && q(Q[t]);
			},
			sort: F ? {
				columnId: F,
				direction: L ? "ascending" : "descending"
			} : null,
			onSortChange: (e) => {
				I(e?.columnId ?? null), R(e?.direction !== "descending"), z(0);
			},
			sortMode: "server",
			rowProps: (e) => ({ "data-flash": W.get(H(e, Q.indexOf(e))) }),
			footer: te ? /* @__PURE__ */ y(i, {
				label: "Table pages",
				summary: `${Y.length} rows`,
				page: Z + 1,
				pageCount: X,
				onPageChange: (e) => z(e - 1)
			}) : void 0
		})]
	});
}
function E({ value: e, format: t, heat: r }) {
	let i = r && typeof e == "number" ? { "--mtc-heat": k(e, r.min, r.max) } : void 0, a;
	if (t === "link" && e != null) {
		let t = typeof e == "object" && !Array.isArray(e) ? e : {
			label: void 0,
			url: e
		}, r = p(t.url), i = t.label != null && t.label !== "" ? String(t.label) : r ?? "";
		a = r ? /* @__PURE__ */ b("a", {
			href: r,
			tabIndex: -1,
			...r.startsWith("/") ? {} : {
				target: "_blank",
				rel: "noopener noreferrer"
			},
			className: "mtc-value-link",
			children: [/* @__PURE__ */ y("span", {
				className: "mtc-value-link-text",
				children: i
			}), !r.startsWith("/") && /* @__PURE__ */ y(n, { name: "external-link" })]
		}) : /* @__PURE__ */ y("span", { children: i });
	} else if (t === "sparkline" && Array.isArray(e)) a = /* @__PURE__ */ y(j, { values: e });
	else {
		let n = t ? N(e, t) : M(e), r = t && t.split(":").slice(1).includes("signed") && typeof e == "number" ? e > 0 ? "ok" : e < 0 ? "danger" : void 0 : void 0;
		a = /* @__PURE__ */ y("span", {
			className: "mtc-data-table-value",
			"data-tone": r,
			children: n
		});
	}
	return /* @__PURE__ */ b(v, { children: [i && /* @__PURE__ */ y("span", {
		className: "mtc-data-table-heat",
		style: i,
		"aria-hidden": "true"
	}), a] });
}
function D(e) {
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
var O = 25;
function k(e, t, n) {
	if (n === t) return "transparent";
	if (t < 0 && n > 0) {
		let r = Math.max(-1, Math.min(1, e / Math.max(Math.abs(t), Math.abs(n))));
		return r >= 0 ? `color-mix(in oklab, var(--mtc-ok) ${O * r}%, transparent)` : `color-mix(in oklab, var(--mtc-danger) ${O * -r}%, transparent)`;
	}
	return `color-mix(in oklab, var(--mtc-accent) ${O * ((e - t) / (n - t))}%, transparent)`;
}
function A(e) {
	if (e == null) return "";
	if (typeof e == "object" && !Array.isArray(e) && "url" in e) return A(e.url);
	let t = String(e);
	return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function j({ values: e }) {
	let t = e.map((e) => Number(e)).filter((e) => Number.isFinite(e));
	if (t.length < 2) return /* @__PURE__ */ y("span", {
		className: "mtc-value-empty",
		children: "—"
	});
	let n = Math.min(...t), r = Math.max(...t) - n || 1, i = t[t.length - 1] >= t[0] ? "var(--mtc-ok)" : "var(--mtc-danger)", a = t.map((e, i) => {
		let a = i / (t.length - 1) * 100, o = 16 - (e - n) / r * 14 - 1;
		return `${a.toFixed(1)},${o.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ y("svg", {
		viewBox: "0 0 100 16",
		className: "w-20 h-4",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ y("polyline", {
			fill: "none",
			stroke: i,
			strokeWidth: "1.5",
			points: a,
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function M(e) {
	return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	}) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function N(e, t) {
	if (e == null) return "—";
	if (t.split(":")[0] === "datetime") return c(e);
	if (typeof e != "number") return M(e);
	let [n, ...r] = t.split(":"), i = new Set(r), a = i.has("signed");
	switch (n) {
		case "currency": {
			let t = r.find((e) => e !== "signed") ?? "USD";
			return l(e, t);
		}
		case "percent": {
			let t = i.has("p") ? "percent" : "fraction";
			return d(e, {
				signed: a,
				as: t
			});
		}
		case "bps": return u(e, { signed: a });
		case "compact": return f(e);
		default: return M(e);
	}
}
//#endregion
export { x as n, T as t };
