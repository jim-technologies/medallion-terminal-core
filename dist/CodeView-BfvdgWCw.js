import { E as e, T as t, b as n } from "./States--oMl4ihu.js";
import { a as r, t as i } from "./utils-8rNbW-NI.js";
import { g as a } from "./sourceError-BA4fjwdn.js";
import { forwardRef as o, useMemo as s } from "react";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
var u = {
	json: "json",
	jsonc: "json",
	json5: "json",
	geojson: "json",
	jsonl: "json",
	ndjson: "json",
	yaml: "yaml",
	yml: "yaml",
	sql: "sql",
	postgresql: "sql",
	postgres: "sql",
	mysql: "sql",
	sqlite: "sql",
	duckdb: "sql",
	clickhouse: "sql"
};
function d(e) {
	return e ? u[e.trim().toLowerCase().replace(/^\./, "")] ?? null : null;
}
var f = /* @__PURE__ */ new Set(/* @__PURE__ */ "select.from.where.and.or.not.in.is.as.on.join.left.right.inner.outer.full.cross.group.by.order.having.limit.offset.union.all.distinct.insert.into.values.update.set.delete.create.table.view.index.drop.alter.with.case.when.then.else.end.between.like.ilike.exists.asc.desc.returning.primary.key.references.default.over.partition.window.cast.interval".split(".")), p = /* @__PURE__ */ new Set([
	"true",
	"false",
	"null"
]), m = {
	json: [
		[(e, t) => /^\s*:/.test(t) ? "key" : "string", /"(?:[^"\\]|\\.)*"?/y],
		["number", /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
		["literal", /\b(?:true|false|null)\b/y],
		["comment", /\/\/.*/y]
	],
	yaml: [
		["comment", /#.*/y],
		["key", /(?<=^\s*(?:-\s+)?)(?!-\s)[^\s#:'"{}[\],&*!|>][^#:]*?(?=\s*:(?:\s|$))/y],
		["string", /"(?:[^"\\]|\\.)*"?|'(?:[^']|'')*'?/y],
		["literal", /(?<=[\s:[,-]|^)(?:true|false|null|yes|no|on|off|~)(?=\s*(?:$|[,\]}#]))/iy],
		["number", /(?<=[\s:[,-]|^)-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?=\s*(?:$|[,\]}#]))/y]
	],
	sql: [
		["comment", /--.*|\/\*.*?(?:\*\/|$)/y],
		["string", /'(?:[^']|'')*'?/y],
		["key", /"(?:[^"]|"")*"?/y],
		["number", /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y],
		[(e) => p.has(e.toLowerCase()) ? "literal" : f.has(e.toLowerCase()) ? "keyword" : "plain", /\b[A-Za-z_][A-Za-z0-9_]*\b/y]
	]
};
function h(e, t) {
	if (e.length > 2e3) return [{
		kind: "plain",
		text: e
	}];
	let n = m[t], r = [], i = (e, t) => {
		let n = r[r.length - 1];
		e === "plain" && n?.kind === "plain" ? n.text += t : r.push({
			kind: e,
			text: t
		});
	}, a = 0;
	for (; a < e.length;) {
		let t = !1;
		for (let [r, o] of n) {
			o.lastIndex = a;
			let n = o.exec(e);
			if (!n || n[0].length === 0) continue;
			let s = n[0];
			i(typeof r == "function" ? r(s, e.slice(a + s.length)) : r, s), a += s.length, t = !0;
			break;
		}
		if (!t) {
			let t = e.slice(a + 1).search(/["'#\-/~\w]/), n = t < 0 ? e.length : a + 1 + t;
			i("plain", e.slice(a, n)), a = n;
		}
	}
	return r;
}
//#endregion
//#region src/files/CodeView.tsx
var g = o(function({ code: o, label: u, language: f, maxLines: p = 5e3, startLine: m = 1, highlightLines: g, wrap: _, defaultWrap: v = !1, onWrapChange: y, truncatedNotice: b, copyable: x = !0, height: S, className: C, style: w, ...T }, E) {
	let D = e(), { locale: O } = t(), [k, A] = r({
		value: _,
		defaultValue: v,
		onChange: y
	}), j = s(() => {
		let e = o.replace(/\r\n?/g, "\n").split("\n");
		return e.length > 1 && e[e.length - 1] === "" && e.pop(), e;
	}, [o]), M = s(() => j.length > p ? j.slice(0, p) : j, [j, p]), N = s(() => new Set(g), [g]), P = d(f), F = s(() => P ? M.map((e) => h(e, P)) : null, [M, P]);
	return /* @__PURE__ */ l("div", {
		...T,
		ref: E,
		className: i("mtc-code-view", C),
		style: w,
		children: [
			/* @__PURE__ */ l("div", {
				className: "mtc-code-view-toolbar",
				children: [
					f && /* @__PURE__ */ c("span", {
						className: "mtc-code-view-language",
						children: f
					}),
					/* @__PURE__ */ c("span", {
						className: "mtc-code-view-count",
						children: D("code.lines", { count: n(j.length, { locale: O }) })
					}),
					/* @__PURE__ */ l("label", {
						className: "mtc-code-view-wrap",
						children: [/* @__PURE__ */ c("input", {
							type: "checkbox",
							checked: k,
							onChange: (e) => A(e.target.checked)
						}), D("code.wrap")]
					}),
					x && /* @__PURE__ */ c(a, {
						value: o,
						label: D("code.copy")
					})
				]
			}),
			(b || M.length < j.length) && /* @__PURE__ */ c("p", {
				className: "mtc-code-view-notice",
				role: "note",
				children: b ?? D("code.truncated", {
					shown: n(M.length, { locale: O }),
					total: n(j.length, { locale: O })
				})
			}),
			/* @__PURE__ */ c("pre", {
				className: "mtc-code-view-body",
				"data-wrap": k || void 0,
				tabIndex: 0,
				"aria-label": u,
				style: {
					"--mtc-code-start": m - 1,
					"--mtc-code-gutter": `${String(m + M.length - 1).length + 1}ch`,
					maxHeight: S
				},
				children: /* @__PURE__ */ c("code", { children: M.map((e, t) => /* @__PURE__ */ c("span", {
					className: "mtc-code-line",
					"data-highlight": N.has(m + t) || void 0,
					children: F ? F[t].map((e, t) => e.kind === "plain" ? e.text : /* @__PURE__ */ c("span", {
						className: "mtc-code-token",
						"data-token": e.kind,
						children: e.text
					}, t)) : e
				}, t)) })
			})
		]
	});
});
//#endregion
export { g as t };
