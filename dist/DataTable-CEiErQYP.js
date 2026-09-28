import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t, h as n } from "./States-BRpBuveA.js";
import { i as r } from "./FormControls-DtyFD-nE.js";
import { t as i } from "./Pagination-6D1ZC47_.js";
import { t as a } from "./DataGrid-Bo8lPqJT.js";
import { Ft as o, kt as s } from "./MultiDashboard-CxdHnMBC.js";
import { a as c, i as l, n as u, o as d, r as f } from "./format-V6rpoQ-_.js";
import { r as p } from "./textNormalize-Ba1I6dwH.js";
import { useEffect as m, useMemo as h, useRef as g, useState as _ } from "react";
import { Fragment as v, jsx as y, jsxs as b } from "react/jsx-runtime";
//#region src/widgets/DataTable.tsx
var x = /* @__PURE__ */ e({ DataTable: () => w }), ee = 25, S = 104, C = 600;
function w({ data: e, options: c }) {
	let { ctx: l, setCtx: u } = s(), d = c?.pageSize || ee, f = c?.row_context, p = c?.heat_columns ?? [], v = c?.export === !0, x = c?.tick_flash === !0, w = c?.search === !0, T = c?.column_formats ?? {}, E = h(() => ne(e), [e]), { columns: O, rows: k, labels: A, formats: j } = E, re = h(() => ({
		...j,
		...T
	}), [j, T]), [M, ie] = _(null), [N, P] = _(!0), [F, I] = _(0), [L, R] = _(""), z = f?.field ?? O[0], B = f ? l[f.key] : void 0, [V, H] = _({
		table: E,
		epoch: 0,
		contextKey: f?.key,
		contextField: z,
		contextValue: B,
		rowKey: null
	});
	(V.table !== E || V.contextKey !== f?.key || V.contextField !== z || V.contextValue !== B) && H({
		table: E,
		epoch: V.epoch + Number(V.table !== E),
		contextKey: f?.key,
		contextField: z,
		contextValue: B,
		rowKey: null
	});
	let U = h(() => {
		let e = k.map((e) => {
			let t = e[O[0]];
			return typeof t == "string" || typeof t == "boolean" || typeof t == "number" && Number.isFinite(t) ? JSON.stringify([
				O[0],
				typeof t,
				t
			]) : void 0;
		}), t = /* @__PURE__ */ new Map();
		for (let n of e) n !== void 0 && t.set(n, (t.get(n) ?? 0) + 1);
		return k.map((n, r) => ({
			values: n,
			key: `${V.epoch}:${r}`,
			flashKey: t.get(e[r]) === 1 ? e[r] : void 0
		}));
	}, [
		k,
		O,
		V.epoch
	]), W = g(/* @__PURE__ */ new Map()), [G, K] = _(/* @__PURE__ */ new Map());
	m(() => {
		let e = W.current, t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = Date.now();
		if (x) for (let i of U) {
			if (i.flashKey === void 0) continue;
			let a = e.get(i.flashKey), o = {}, s;
			for (let e of O) {
				let t = i.values[e];
				typeof t == "number" && (o[e] = t, s === void 0 && a && a[e] != null && a[e] !== t && (s = t > a[e] ? "up" : "down"));
			}
			t.set(i.flashKey, o), s && n.set(i.flashKey, {
				direction: s,
				expires: r + C
			});
		}
		W.current = t, K((i) => {
			let a = new Map([...i].filter(([n, i]) => e.has(n) && t.has(n) && i.expires > r));
			for (let [e, t] of n) a.set(e, t);
			return a.size === 0 && i.size === 0 ? i : a;
		});
	}, [
		U,
		O,
		x
	]), m(() => {
		if (G.size === 0) return;
		let e = Infinity;
		for (let t of G.values()) e = Math.min(e, t.expires);
		let t = setTimeout(() => {
			K((e) => new Map([...e].filter(([, e]) => e.expires > Date.now())));
		}, Math.max(0, e - Date.now()));
		return () => clearTimeout(t);
	}, [G]);
	let ae = h(() => {
		let e = {};
		for (let t of p) {
			let n = Infinity, r = -Infinity;
			for (let e of k) {
				let i = e[t];
				typeof i == "number" && Number.isFinite(i) && (i < n && (n = i), i > r && (r = i));
			}
			Number.isFinite(n) && Number.isFinite(r) && (e[t] = {
				min: n,
				max: r
			});
		}
		return e;
	}, [k, p]), oe = (e) => {
		if (!f) return;
		let t = e.values[z];
		t != null && (H({
			...V,
			rowKey: e.key,
			contextValue: String(t)
		}), u(f.key, String(t)));
	}, q = h(() => {
		let e = L.trim().toLowerCase();
		return e ? U.filter((t) => O.some((n) => {
			let r = t.values[n];
			return r != null && String(r).toLowerCase().includes(e);
		})) : U;
	}, [
		U,
		O,
		L
	]), J = h(() => M ? [...q].sort((e, t) => {
		let n = e.values[M], r = t.values[M];
		if (n == null && r == null) return 0;
		if (n == null) return 1;
		if (r == null) return -1;
		let i = typeof n == "number" && typeof r == "number" ? n - r : String(n).localeCompare(String(r));
		return N ? i : -i;
	}) : q, [
		q,
		M,
		N
	]), Y = Math.max(1, Math.ceil(J.length / d)), X = Math.min(F, Y - 1), Z = J.slice(X * d, (X + 1) * d), se = J.length > d;
	if (O.length === 0) return /* @__PURE__ */ y(o, { children: "No data" });
	let ce = () => {
		let e = [O.map(D).join(","), ...J.map((e) => O.map((t) => D(e.values[t])).join(","))], t = new Blob([e.join("\n")], { type: "text/csv;charset=utf-8" }), n = URL.createObjectURL(t), r = document.createElement("a");
		r.href = n, r.download = "export.csv", r.click(), URL.revokeObjectURL(n);
	}, le = O.map((e, t) => {
		let n = re[e], r = !!n && n !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(n);
		return {
			id: e,
			header: A[e] ?? e,
			width: n === "sparkline" ? S : void 0,
			grow: t === 0,
			align: r || !n && k.some((t) => typeof t[e] == "number") ? "end" : "start",
			cell: (t) => /* @__PURE__ */ y(te, {
				value: t.values[e],
				format: n,
				heat: ae[e]
			})
		};
	}), Q = f ? U.filter((e) => {
		let t = e.values[z];
		return t != null && String(t) === B;
	}) : [], $ = Q.find((e) => e.key === V.rowKey)?.key ?? (Q.length === 1 ? Q[0].key : void 0);
	return /* @__PURE__ */ b("div", {
		className: "flex flex-col h-full gap-2 mtc-data-table",
		children: [(w || v) && /* @__PURE__ */ b("div", {
			className: "flex items-center gap-2",
			children: [w && /* @__PURE__ */ y(r, {
				type: "search",
				size: "small",
				value: L,
				"aria-label": "Filter rows",
				onChange: (e) => {
					R(e.target.value), I(0);
				},
				placeholder: "Filter…",
				className: "min-w-0 flex-1"
			}), v && /* @__PURE__ */ y(t, {
				size: "small",
				variant: "ghost",
				startIcon: /* @__PURE__ */ y(n, { name: "download" }),
				onClick: ce,
				title: "Download as CSV",
				children: "CSV"
			})]
		}), /* @__PURE__ */ y(a, {
			label: "Table data",
			className: "min-h-0 flex-1",
			columns: le,
			rows: Z,
			rowKey: (e) => e.key,
			rowLabel: (e) => String(e.values[O[0]] ?? ""),
			selection: f ? "single" : "none",
			selectedKeys: $ ? [$] : [],
			onSelectionChange: (e) => {
				let t = Z.find((t) => t.key === e[0]);
				t && oe(t);
			},
			sort: M ? {
				columnId: M,
				direction: N ? "ascending" : "descending"
			} : null,
			onSortChange: (e) => {
				ie(e?.columnId ?? null), P(e?.direction !== "descending"), I(0);
			},
			sortMode: "server",
			rowProps: (e) => ({ "data-flash": (e.flashKey === void 0 ? void 0 : G.get(e.flashKey))?.direction }),
			footer: se ? /* @__PURE__ */ y(i, {
				label: "Table pages",
				summary: `${J.length} rows`,
				page: X + 1,
				pageCount: Y,
				onPageChange: (e) => I(e - 1)
			}) : void 0
		})]
	});
}
function te({ value: e, format: t, heat: r }) {
	let i = r && typeof e == "number" ? { "--mtc-heat": E(e, r.min, r.max) } : void 0, a;
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
	} else if (t === "sparkline" && Array.isArray(e)) a = /* @__PURE__ */ y(O, { values: e });
	else {
		let n = t ? A(e, t) : k(e), r = t && t.split(":").slice(1).includes("signed") && typeof e == "number" ? e > 0 ? "ok" : e < 0 ? "danger" : void 0 : void 0;
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
function ne(e) {
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
var T = 25;
function E(e, t, n) {
	if (n === t) return "transparent";
	if (t < 0 && n > 0) {
		let r = Math.max(-1, Math.min(1, e / Math.max(Math.abs(t), Math.abs(n))));
		return r >= 0 ? `color-mix(in oklab, var(--mtc-ok) ${T * r}%, transparent)` : `color-mix(in oklab, var(--mtc-danger) ${T * -r}%, transparent)`;
	}
	return `color-mix(in oklab, var(--mtc-accent) ${T * ((e - t) / (n - t))}%, transparent)`;
}
function D(e) {
	if (e == null) return "";
	if (typeof e == "object" && !Array.isArray(e) && "url" in e) return D(e.url);
	let t = String(e);
	return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function O({ values: e }) {
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
function k(e) {
	return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	}) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function A(e, t) {
	if (e == null) return "—";
	if (t.split(":")[0] === "datetime") return c(e);
	if (typeof e != "number") return k(e);
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
		default: return k(e);
	}
}
//#endregion
export { x as n, w as t };
