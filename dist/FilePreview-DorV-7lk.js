import { E as e, g as t, i as n, m as r } from "./States--oMl4ihu.js";
import { t as i } from "./utils-8rNbW-NI.js";
import { _ as a } from "./sourceError-BA4fjwdn.js";
import { Suspense as o, forwardRef as s, lazy as c, useEffect as l, useId as u, useImperativeHandle as d, useRef as f } from "react";
import { jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/components/SearchField.tsx
function h(e) {
	return e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));
}
var g = s(function({ value: n, onValueChange: o, label: s, tokens: c = [], onRemoveToken: u, onSubmit: g, shortcut: _, clearLabel: v, size: y = "medium", className: b, placeholder: x, onKeyDown: S, ...C }, w) {
	let T = e(), E = f(null);
	return d(w, () => E.current), l(() => {
		if (!_) return;
		let e = (e) => {
			e.key !== _ || e.metaKey || e.ctrlKey || e.altKey || h(e.target) || (e.preventDefault(), E.current?.focus());
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [_]), /* @__PURE__ */ m("form", {
		role: "search",
		"aria-label": s,
		className: i("mtc-search-field", b),
		"data-size": y,
		onSubmit: (e) => {
			e.preventDefault(), g?.(n);
		},
		children: [
			/* @__PURE__ */ p(t, {
				name: "search",
				className: "mtc-search-field-icon"
			}),
			c.map((e) => /* @__PURE__ */ m("span", {
				className: "mtc-search-token",
				children: [
					e.icon,
					/* @__PURE__ */ p("span", { children: e.label }),
					u && /* @__PURE__ */ p("button", {
						type: "button",
						className: "mtc-search-token-remove",
						"aria-label": T("search.removeToken", { label: e.label }),
						onClick: () => {
							u(e.id), E.current?.focus();
						},
						children: /* @__PURE__ */ p(t, { name: "close" })
					})
				]
			}, e.id)),
			/* @__PURE__ */ p("input", {
				...C,
				ref: E,
				type: "search",
				"aria-label": s,
				placeholder: x,
				value: n,
				className: "mtc-search-field-input",
				onChange: (e) => o(e.target.value),
				onKeyDown: (e) => {
					S?.(e), !e.defaultPrevented && (e.key === "Backspace" && n === "" && c.length > 0 && u ? (e.preventDefault(), u(c[c.length - 1].id)) : e.key === "Escape" && n !== "" && (e.preventDefault(), o("")));
				}
			}),
			n === "" ? _ ? /* @__PURE__ */ p(a, {
				"aria-hidden": "true",
				className: "mtc-search-field-hint",
				children: _
			}) : null : /* @__PURE__ */ p(r, {
				icon: /* @__PURE__ */ p(t, { name: "close" }),
				"aria-label": v ?? T("search.clear"),
				variant: "ghost",
				size: "small",
				onClick: () => {
					o(""), E.current?.focus();
				}
			})
		]
	});
}), _ = s(function({ items: e, value: t, onValueChange: n, label: r, orientation: a = "horizontal", activationMode: o = "automatic", density: s, keepMounted: c = !1, className: l, ...d }, h) {
	let g = u(), _ = f(/* @__PURE__ */ new Map()), v = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), y = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let a = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		a && (_.current.get(a.id)?.focus(), _.current.get(a.id)?.scrollIntoView({
			block: "nearest",
			inline: "nearest"
		}), o === "automatic" && n(a.id));
	}, b = (t, r) => {
		let i = a === "horizontal" ? "ArrowLeft" : "ArrowUp", s = a === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === i || t.key === s) t.preventDefault(), y(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (_.current.get(i.id)?.focus(), _.current.get(i.id)?.scrollIntoView({
				block: "nearest",
				inline: "nearest"
			}), o === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && o === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ m("div", {
		...d,
		ref: h,
		className: i("mtc-tabs", s && `mtc-density-${s}`, l),
		"data-orientation": a,
		children: [/* @__PURE__ */ p("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": a,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === v?.id, r = `${g}-tab-${e.id}`, i = `${g}-panel-${e.id}`;
				return /* @__PURE__ */ m("button", {
					ref: (t) => {
						t ? _.current.set(e.id, t) : _.current.delete(e.id);
					},
					type: "button",
					role: "tab",
					id: r,
					"aria-controls": i,
					"aria-selected": t,
					disabled: e.disabled,
					tabIndex: t ? 0 : -1,
					className: "mtc-tab",
					onClick: () => n(e.id),
					onKeyDown: (t) => b(t, e),
					children: [/* @__PURE__ */ p("span", { children: e.label }), e.count != null && /* @__PURE__ */ p("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ p("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === v?.id;
				return !t && !c ? null : /* @__PURE__ */ p("div", {
					role: "tabpanel",
					id: `${g}-panel-${e.id}`,
					"aria-labelledby": `${g}-tab-${e.id}`,
					tabIndex: 0,
					hidden: !t,
					className: "mtc-tab-panel",
					children: e.panel
				}, e.id);
			})
		})]
	});
}), v = s(function({ items: n, label: r, maxItems: a, className: o, ...s }, c) {
	let l = e(), u = y(n, a);
	return /* @__PURE__ */ p("nav", {
		...s,
		ref: c,
		"aria-label": r ?? l("breadcrumbs.label"),
		className: i("mtc-breadcrumbs", o),
		children: /* @__PURE__ */ p("ol", { children: u.map((e, n) => {
			let r = n === u.length - 1;
			return /* @__PURE__ */ m("li", { children: [n > 0 && /* @__PURE__ */ p(t, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), r ? /* @__PURE__ */ p("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ p("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ p("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ p("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${n}`);
		}) })
	});
});
function y(e, t) {
	if (t == null || !Number.isFinite(t)) return e;
	let n = Math.max(1, Math.floor(t));
	return e.length <= n ? e : n === 1 ? e.slice(-1) : n === 2 ? [e[0], e[e.length - 1]] : [
		e[0],
		{ label: "…" },
		...e.slice(-(n - 2))
	];
}
//#endregion
//#region src/files/previewPolicy.ts
var b = {
	textBytes: 1e6,
	delimitedBytes: 2e6,
	imageBytes: 2e7,
	pdfBytes: 5e7,
	rows: 1e3,
	columns: 100,
	cellCharacters: 2e4
}, x = {
	png: "png",
	jpg: "jpeg",
	jpeg: "jpeg",
	gif: "gif",
	webp: "webp",
	avif: "avif"
}, S = /* @__PURE__ */ new Set([
	"mp4",
	"m4v",
	"webm",
	"mov"
]), C = /* @__PURE__ */ new Set([
	"mp3",
	"m4a",
	"aac",
	"wav",
	"ogg",
	"oga",
	"opus",
	"flac"
]), w = /* @__PURE__ */ new Set([
	"txt",
	"log",
	"text",
	"env",
	"gitignore"
]), T = /* @__PURE__ */ new Set(["md", "markdown"]), E = {
	ts: "TypeScript",
	tsx: "TypeScript",
	mts: "TypeScript",
	cts: "TypeScript",
	js: "JavaScript",
	jsx: "JavaScript",
	mjs: "JavaScript",
	cjs: "JavaScript",
	py: "Python",
	go: "Go",
	rs: "Rust",
	java: "Java",
	kt: "Kotlin",
	scala: "Scala",
	c: "C",
	h: "C",
	cc: "C++",
	cpp: "C++",
	hpp: "C++",
	cs: "C#",
	swift: "Swift",
	rb: "Ruby",
	php: "PHP",
	lua: "Lua",
	r: "R",
	sh: "Shell",
	bash: "Shell",
	zsh: "Shell",
	sql: "SQL",
	proto: "Protocol Buffers",
	graphql: "GraphQL",
	gql: "GraphQL",
	yaml: "YAML",
	yml: "YAML",
	toml: "TOML",
	ini: "INI",
	cfg: "INI",
	conf: "Config",
	xml: "XML",
	svg: "SVG",
	html: "HTML",
	htm: "HTML",
	css: "CSS",
	scss: "SCSS",
	tf: "Terraform",
	hcl: "HCL",
	ndjson: "NDJSON",
	jsonl: "NDJSON",
	dockerfile: "Dockerfile",
	makefile: "Makefile"
};
function D(e) {
	let t = e.split("/").pop()?.toLowerCase() ?? "", n = t.lastIndexOf(".");
	return n <= 0 ? t : t.slice(n + 1);
}
function O(e, t) {
	let n = D(e), r = e.split("/").pop()?.includes(".") ?? !1;
	if (Object.prototype.hasOwnProperty.call(x, n)) return {
		kind: "image",
		raster: x[n]
	};
	if (n === "pdf") return { kind: "pdf" };
	if (S.has(n)) return { kind: "video" };
	if (C.has(n)) return { kind: "audio" };
	if (n === "csv") return { kind: "csv" };
	if (n === "tsv") return { kind: "tsv" };
	if (n === "json") return {
		kind: "json",
		language: "JSON"
	};
	if (T.has(n)) return { kind: "markdown" };
	if (Object.prototype.hasOwnProperty.call(E, n)) return {
		kind: "code",
		language: E[n]
	};
	if (w.has(n)) return { kind: "text" };
	if (r || !t) return { kind: "unsupported" };
	let i = t.split(";")[0].trim().toLowerCase();
	return i === "image/png" ? {
		kind: "image",
		raster: "png"
	} : i === "image/jpeg" ? {
		kind: "image",
		raster: "jpeg"
	} : i === "image/gif" ? {
		kind: "image",
		raster: "gif"
	} : i === "image/webp" ? {
		kind: "image",
		raster: "webp"
	} : i === "image/avif" ? {
		kind: "image",
		raster: "avif"
	} : i === "application/pdf" ? { kind: "pdf" } : i === "application/json" ? {
		kind: "json",
		language: "JSON"
	} : i === "text/csv" ? { kind: "csv" } : i === "text/markdown" ? { kind: "markdown" } : i === "text/plain" ? { kind: "text" } : i.startsWith("video/") ? { kind: "video" } : i.startsWith("audio/") ? { kind: "audio" } : { kind: "unsupported" };
}
function k(e) {
	return e.length >= 5 && e[0] === 37 && e[1] === 80 && e[2] === 68 && e[3] === 70 && e[4] === 45;
}
function A(e, t) {
	switch (e) {
		case "png": return t.length >= 8 && t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 && t[4] === 13 && t[5] === 10 && t[6] === 26 && t[7] === 10;
		case "jpeg": return t.length >= 3 && t[0] === 255 && t[1] === 216 && t[2] === 255;
		case "gif": return t.length >= 6 && t[0] === 71 && t[1] === 73 && t[2] === 70 && t[3] === 56 && (t[4] === 55 || t[4] === 57) && t[5] === 97;
		case "webp": return t.length >= 12 && t[0] === 82 && t[1] === 73 && t[2] === 70 && t[3] === 70 && t[8] === 87 && t[9] === 69 && t[10] === 66 && t[11] === 80;
		case "avif": {
			if (t.length < 16 || String.fromCharCode(...t.slice(4, 8)) !== "ftyp") return !1;
			let e = new DataView(t.buffer, t.byteOffset, t.byteLength).getUint32(0);
			if (e < 16) return !1;
			let n = (e) => ["avif", "avis"].includes(String.fromCharCode(...t.slice(e, e + 4)));
			if (n(8)) return !0;
			for (let r = 16; r + 4 <= Math.min(e, t.length); r += 4) if (n(r)) return !0;
			return !1;
		}
	}
}
async function j(e, t) {
	if (!e.body) {
		let n = new Uint8Array(await e.arrayBuffer());
		return {
			bytes: n.slice(0, t),
			truncated: n.length > t
		};
	}
	let n = e.body.getReader(), r = [], i = 0, a = !1;
	for (;;) {
		let { done: e, value: o } = await n.read();
		if (e) break;
		let s = t - i;
		if (o.length > s) {
			r.push(o.slice(0, s)), i += s, a = !0, await n.cancel();
			break;
		}
		r.push(o), i += o.length;
	}
	let o = new Uint8Array(i), s = 0;
	for (let e of r) o.set(e, s), s += e.length;
	return {
		bytes: o,
		truncated: a
	};
}
function M(e) {
	let t = e ? /\/(\d+)\s*$/.exec(e) : null;
	return t ? Number(t[1]) : void 0;
}
function N(e, t) {
	let n = new TextDecoder("utf-8", { fatal: !1 }).decode(e, { stream: t });
	return n.charCodeAt(0) === 65279 ? n.slice(1) : n;
}
function P(e, t, { rows: n, columns: r, cellCharacters: i } = b) {
	let a = e.charCodeAt(0) === 65279 ? e.slice(1) : e, o = [];
	if (!a) return {
		rows: o,
		sourceRowCount: 0,
		sourceColumnCount: 0,
		truncatedRows: !1,
		truncatedColumns: !1,
		truncatedCells: !1
	};
	let s = [], c = "", l = 0, u = 0, d = 0, f = !1, p = !1, m = !1, h = !1, g = !1, _ = !1, v = (e) => {
		if (c.length < i) {
			let t = i - c.length;
			c += e.slice(0, t), e.length > t && (_ = !0);
		} else e.length > 0 && (_ = !0);
	}, y = () => {
		l < r ? s.push(c) : g = !0, l += 1, c = "", p = !1, m = !1;
	}, x = () => {
		y(), u += 1, d = Math.max(d, l), o.length < n && o.push(s), s = [], l = 0;
	};
	for (let e = 0; e < a.length; e += 1) {
		let n = a[e];
		if (h = !1, f) {
			n === "\"" ? a[e + 1] === "\"" ? (v("\""), e += 1) : (f = !1, m = !0) : v(n);
			continue;
		}
		if (m && n !== t && n !== "\r" && n !== "\n") throw Error("Unexpected character after a closing quote.");
		if (n === "\"") {
			if (c.length > 0 || p) throw Error("Unexpected quote in an unquoted field.");
			p = !0, f = !0;
			continue;
		}
		if (n === t) {
			y();
			continue;
		}
		if (n === "\r" || n === "\n") {
			n === "\r" && a[e + 1] === "\n" && (e += 1), x(), h = !0;
			continue;
		}
		v(n);
	}
	if (f) throw Error("The final quoted field is not closed.");
	return h || x(), {
		rows: o,
		sourceRowCount: u,
		sourceColumnCount: d,
		truncatedRows: u > n,
		truncatedColumns: g || d > r,
		truncatedCells: _
	};
}
//#endregion
//#region src/files/FilePreview.tsx
var F = c(() => import("./FilePreviewContent-B-rI_WIZ.js").then((e) => ({ default: e.FilePreviewContent })));
function I(t) {
	let r = e();
	return /* @__PURE__ */ p(o, {
		fallback: /* @__PURE__ */ p("div", {
			className: i("mtc-file-preview", t.className),
			"data-kind": O(t.file.name, t.file.contentType).kind,
			"data-state": "loading",
			children: /* @__PURE__ */ p(n, {
				label: r("preview.loading"),
				compact: !0
			})
		}),
		children: /* @__PURE__ */ p(F, { ...t })
	});
}
//#endregion
export { D as a, P as c, v as d, _ as f, N as i, O as l, b as n, k as o, g as p, M as r, A as s, I as t, j as u };
