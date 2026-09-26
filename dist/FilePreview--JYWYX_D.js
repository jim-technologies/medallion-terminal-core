import { T as e, d as t, g as n, h as r, i, n as a, p as o, r as s, w as c, y as l } from "./States-ggbm0c4k.js";
import { r as u, t as d } from "./utils-j4lJ7S1v.js";
import { t as f } from "./DataGrid-BuzhglbG.js";
import { _ as p, g as m, s as h, u as g, w as _ } from "./sourceError-BK-F_Rp5.js";
import { forwardRef as v, useEffect as y, useId as b, useImperativeHandle as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
//#region src/components/SearchField.tsx
function O(e) {
	return e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));
}
var k = v(function({ value: t, onValueChange: n, label: i, tokens: a = [], onRemoveToken: s, onSubmit: c, shortcut: l, clearLabel: u, size: f = "medium", className: m, placeholder: h, onKeyDown: g, ..._ }, v) {
	let b = e(), S = C(null);
	return x(v, () => S.current), y(() => {
		if (!l) return;
		let e = (e) => {
			e.key !== l || e.metaKey || e.ctrlKey || e.altKey || O(e.target) || (e.preventDefault(), S.current?.focus());
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [l]), /* @__PURE__ */ D("form", {
		role: "search",
		"aria-label": i,
		className: d("mtc-search-field", m),
		"data-size": f,
		onSubmit: (e) => {
			e.preventDefault(), c?.(t);
		},
		children: [
			/* @__PURE__ */ E(r, {
				name: "search",
				className: "mtc-search-field-icon"
			}),
			a.map((e) => /* @__PURE__ */ D("span", {
				className: "mtc-search-token",
				children: [
					e.icon,
					/* @__PURE__ */ E("span", { children: e.label }),
					s && /* @__PURE__ */ E("button", {
						type: "button",
						className: "mtc-search-token-remove",
						"aria-label": b("search.removeToken", { label: e.label }),
						onClick: () => {
							s(e.id), S.current?.focus();
						},
						children: /* @__PURE__ */ E(r, { name: "close" })
					})
				]
			}, e.id)),
			/* @__PURE__ */ E("input", {
				..._,
				ref: S,
				type: "search",
				"aria-label": i,
				placeholder: h,
				value: t,
				className: "mtc-search-field-input",
				onChange: (e) => n(e.target.value),
				onKeyDown: (e) => {
					g?.(e), !e.defaultPrevented && (e.key === "Backspace" && t === "" && a.length > 0 && s ? (e.preventDefault(), s(a[a.length - 1].id)) : e.key === "Escape" && t !== "" && (e.preventDefault(), n("")));
				}
			}),
			t === "" ? l ? /* @__PURE__ */ E(p, {
				"aria-hidden": "true",
				className: "mtc-search-field-hint",
				children: l
			}) : null : /* @__PURE__ */ E(o, {
				icon: /* @__PURE__ */ E(r, { name: "close" }),
				"aria-label": u ?? b("search.clear"),
				variant: "ghost",
				size: "small",
				onClick: () => {
					n(""), S.current?.focus();
				}
			})
		]
	});
}), A = v(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: o, keepMounted: s = !1, className: c, ...l }, u) {
	let f = b(), p = C(/* @__PURE__ */ new Map()), m = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), h = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let o = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		o && (p.current.get(o.id)?.focus(), a === "automatic" && n(o.id));
	}, g = (t, r) => {
		let o = i === "horizontal" ? "ArrowLeft" : "ArrowUp", s = i === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === o || t.key === s) t.preventDefault(), h(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (p.current.get(i.id)?.focus(), a === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && a === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ D("div", {
		...l,
		ref: u,
		className: d("mtc-tabs", o && `mtc-density-${o}`, c),
		"data-orientation": i,
		children: [/* @__PURE__ */ E("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === m?.id, r = `${f}-tab-${e.id}`, i = `${f}-panel-${e.id}`;
				return /* @__PURE__ */ D("button", {
					ref: (t) => {
						t ? p.current.set(e.id, t) : p.current.delete(e.id);
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
					onKeyDown: (t) => g(t, e),
					children: [/* @__PURE__ */ E("span", { children: e.label }), e.count != null && /* @__PURE__ */ E("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ E("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === m?.id;
				return !t && !s ? null : /* @__PURE__ */ E("div", {
					role: "tabpanel",
					id: `${f}-panel-${e.id}`,
					"aria-labelledby": `${f}-tab-${e.id}`,
					tabIndex: 0,
					hidden: !t,
					className: "mtc-tab-panel",
					children: e.panel
				}, e.id);
			})
		})]
	});
}), j = v(function({ items: t, label: n, maxItems: i, className: a, ...o }, s) {
	let c = e(), l = M(t, i);
	return /* @__PURE__ */ E("nav", {
		...o,
		ref: s,
		"aria-label": n ?? c("breadcrumbs.label"),
		className: d("mtc-breadcrumbs", a),
		children: /* @__PURE__ */ E("ol", { children: l.map((e, t) => {
			let n = t === l.length - 1;
			return /* @__PURE__ */ D("li", { children: [t > 0 && /* @__PURE__ */ E(r, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), n ? /* @__PURE__ */ E("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ E("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ E("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ E("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${t}`);
		}) })
	});
});
function M(e, t) {
	if (t == null || !Number.isFinite(t)) return e;
	let n = Math.max(1, Math.floor(t));
	return e.length <= n ? e : n === 1 ? e.slice(-1) : n === 2 ? [e[0], e[e.length - 1]] : [
		e[0],
		{ label: "…" },
		...e.slice(-(n - 2))
	];
}
//#endregion
//#region src/files/CodeView.tsx
var N = v(function({ code: t, label: n, language: r, maxLines: i = 5e3, startLine: a = 1, highlightLines: o, wrap: s, defaultWrap: f = !1, onWrapChange: p, truncatedNotice: h, copyable: g = !0, height: _, className: v, style: y, ...b }, x) {
	let C = e(), { locale: w } = c(), [T, O] = u({
		value: s,
		defaultValue: f,
		onChange: p
	}), k = S(() => {
		let e = t.replace(/\r\n?/g, "\n").split("\n");
		return e.length > 1 && e[e.length - 1] === "" && e.pop(), e;
	}, [t]), A = k.length > i ? k.slice(0, i) : k, j = S(() => new Set(o), [o]);
	return /* @__PURE__ */ D("div", {
		...b,
		ref: x,
		className: d("mtc-code-view", v),
		style: y,
		children: [
			/* @__PURE__ */ D("div", {
				className: "mtc-code-view-toolbar",
				children: [
					r && /* @__PURE__ */ E("span", {
						className: "mtc-code-view-language",
						children: r
					}),
					/* @__PURE__ */ E("span", {
						className: "mtc-code-view-count",
						children: C("code.lines", { count: l(k.length, { locale: w }) })
					}),
					/* @__PURE__ */ D("label", {
						className: "mtc-code-view-wrap",
						children: [/* @__PURE__ */ E("input", {
							type: "checkbox",
							checked: T,
							onChange: (e) => O(e.target.checked)
						}), C("code.wrap")]
					}),
					g && /* @__PURE__ */ E(m, {
						value: t,
						label: C("code.copy")
					})
				]
			}),
			(h || A.length < k.length) && /* @__PURE__ */ E("p", {
				className: "mtc-code-view-notice",
				role: "note",
				children: h ?? C("code.truncated", {
					shown: l(A.length, { locale: w }),
					total: l(k.length, { locale: w })
				})
			}),
			/* @__PURE__ */ E("pre", {
				className: "mtc-code-view-body",
				"data-wrap": T || void 0,
				tabIndex: 0,
				"aria-label": n,
				style: {
					"--mtc-code-start": a - 1,
					"--mtc-code-gutter": `${String(a + A.length - 1).length + 1}ch`,
					maxHeight: _
				},
				children: /* @__PURE__ */ E("code", { children: A.map((e, t) => /* @__PURE__ */ E("span", {
					className: "mtc-code-line",
					"data-highlight": j.has(a + t) || void 0,
					children: e
				}, t)) })
			})
		]
	});
});
//#endregion
//#region src/files/markdown.ts
async function P(e) {
	let [{ marked: t }, { default: n }] = await Promise.all([import("./marked.esm-B3MwSSSj.js"), import("./purify.es-B3aQ6p7I.js")]);
	try {
		let r = await t.parse(e, { async: !0 });
		return n.sanitize(r, {
			FORBID_TAGS: [
				"style",
				"form",
				"input",
				"button"
			],
			FORBID_ATTR: ["style"]
		});
	} catch {
		return `<pre>${F(e)}</pre>`;
	}
}
function F(e) {
	return e.replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
//#endregion
//#region src/files/previewPolicy.ts
var I = {
	textBytes: 1e6,
	delimitedBytes: 2e6,
	imageBytes: 2e7,
	pdfBytes: 5e7,
	rows: 1e3,
	columns: 100,
	cellCharacters: 2e4
}, L = {
	png: "png",
	jpg: "jpeg",
	jpeg: "jpeg",
	gif: "gif",
	webp: "webp"
}, R = /* @__PURE__ */ new Set([
	"mp4",
	"m4v",
	"webm",
	"mov"
]), z = /* @__PURE__ */ new Set([
	"mp3",
	"m4a",
	"aac",
	"wav",
	"ogg",
	"oga",
	"opus",
	"flac"
]), B = /* @__PURE__ */ new Set([
	"txt",
	"log",
	"text",
	"env",
	"gitignore"
]), V = /* @__PURE__ */ new Set(["md", "markdown"]), H = {
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
function U(e) {
	let t = e.split("/").pop()?.toLowerCase() ?? "", n = t.lastIndexOf(".");
	return n <= 0 ? t : t.slice(n + 1);
}
function W(e, t) {
	let n = U(e), r = e.split("/").pop()?.includes(".") ?? !1;
	if (L[n]) return {
		kind: "image",
		raster: L[n]
	};
	if (n === "pdf") return { kind: "pdf" };
	if (R.has(n)) return { kind: "video" };
	if (z.has(n)) return { kind: "audio" };
	if (n === "csv") return { kind: "csv" };
	if (n === "tsv") return { kind: "tsv" };
	if (n === "json") return {
		kind: "json",
		language: "JSON"
	};
	if (V.has(n)) return { kind: "markdown" };
	if (H[n]) return {
		kind: "code",
		language: H[n]
	};
	if (B.has(n)) return { kind: "text" };
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
	} : i === "application/pdf" ? { kind: "pdf" } : i === "application/json" ? {
		kind: "json",
		language: "JSON"
	} : i === "text/csv" ? { kind: "csv" } : i === "text/markdown" ? { kind: "markdown" } : i === "text/plain" ? { kind: "text" } : i.startsWith("video/") ? { kind: "video" } : i.startsWith("audio/") ? { kind: "audio" } : { kind: "unsupported" };
}
function G(e) {
	return e.length >= 5 && e[0] === 37 && e[1] === 80 && e[2] === 68 && e[3] === 70 && e[4] === 45;
}
function K(e, t) {
	switch (e) {
		case "png": return t.length >= 8 && t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 && t[4] === 13 && t[5] === 10 && t[6] === 26 && t[7] === 10;
		case "jpeg": return t.length >= 3 && t[0] === 255 && t[1] === 216 && t[2] === 255;
		case "gif": return t.length >= 6 && t[0] === 71 && t[1] === 73 && t[2] === 70 && t[3] === 56 && (t[4] === 55 || t[4] === 57) && t[5] === 97;
		case "webp": return t.length >= 12 && t[0] === 82 && t[1] === 73 && t[2] === 70 && t[3] === 70 && t[8] === 87 && t[9] === 69 && t[10] === 66 && t[11] === 80;
	}
}
async function q(e, t) {
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
function J(e) {
	let t = e ? /\/(\d+)\s*$/.exec(e) : null;
	return t ? Number(t[1]) : void 0;
}
function Y(e, t) {
	let n = new TextDecoder("utf-8", { fatal: !1 }).decode(e, { stream: t });
	return n.charCodeAt(0) === 65279 ? n.slice(1) : n;
}
function X(e, t, { rows: n, columns: r, cellCharacters: i } = I) {
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
	}, b = () => {
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
			n === "\r" && a[e + 1] === "\n" && (e += 1), b(), h = !0;
			continue;
		}
		v(n);
	}
	if (f) throw Error("The final quoted field is not closed.");
	return h || b(), {
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
var Z = {
	png: "image/png",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp"
};
function Q({ file: o, fetch: l, limits: u, onDownload: f, height: p = 480, className: m }) {
	let h = e(), { locale: g } = c(), v = S(() => ({
		...I,
		...u
	}), [u]), b = S(() => W(o.name, o.contentType), [o.name, o.contentType]), [x, C] = w({ state: "loading" });
	y(() => {
		let e = new AbortController(), t;
		return C({ state: "loading" }), (async () => {
			let n = l ?? globalThis.fetch;
			switch (b.kind) {
				case "unsupported": return { state: "unsupported" };
				case "video":
				case "audio": return { state: "media" };
				case "image":
				case "pdf": {
					let r = b.kind === "pdf" ? v.pdfBytes : v.imageBytes;
					if (o.sizeBytes !== void 0 && o.sizeBytes > r) return {
						state: "too-large",
						size: o.sizeBytes,
						limit: r
					};
					let i = await n(o.url, { signal: e.signal });
					if (!i.ok) throw i;
					let { bytes: a, truncated: s } = await q(i, r);
					return s ? {
						state: "too-large",
						size: o.sizeBytes ?? r + 1,
						limit: r
					} : (b.kind === "pdf" ? G(a) : K(b.raster, a)) ? (t = URL.createObjectURL(new Blob([a], { type: b.kind === "pdf" ? "application/pdf" : Z[b.raster] })), {
						state: "blob",
						url: t
					}) : {
						state: "blocked",
						kind: b.kind === "pdf" ? "PDF" : b.raster.toUpperCase()
					};
				}
				default: {
					let t = b.kind === "csv" || b.kind === "tsv", r = t ? v.delimitedBytes : v.textBytes, i = await n(o.url, {
						headers: { Range: `bytes=0-${r - 1}` },
						signal: e.signal
					});
					if (!i.ok) throw i;
					let a = J(i.headers.get("content-range")) ?? o.sizeBytes, { bytes: s, truncated: c } = await q(i, r), l = c || a !== void 0 && a > s.length, u = Y(s, l);
					if (t) try {
						return {
							state: "table",
							table: X(l ? u.slice(0, Math.max(0, u.lastIndexOf("\n"))) : u, b.kind === "tsv" ? "	" : ",", {
								...v,
								rows: v.rows + 1
							}),
							truncatedBytes: l
						};
					} catch {
						return {
							state: "unreadable",
							kind: b.kind.toUpperCase()
						};
					}
					if (b.kind === "markdown") return {
						state: "markdown",
						html: await P(u),
						truncated: l,
						total: a
					};
					if (b.kind === "json" && !l) try {
						return {
							state: "text",
							text: JSON.stringify(JSON.parse(u), null, 2),
							truncated: l,
							total: a
						};
					} catch {
						return {
							state: "text",
							text: u,
							truncated: l,
							total: a
						};
					}
					return {
						state: "text",
						text: u,
						truncated: l,
						total: a
					};
				}
			}
		})().then((t) => {
			e.signal.aborted || C(t);
		}, async (t) => {
			e.signal.aborted || C({
				state: "error",
				error: await ee(t)
			});
		}), () => {
			e.abort(), t && URL.revokeObjectURL(t);
		};
	}, [
		o.url,
		o.name,
		o.sizeBytes,
		b,
		v,
		l
	]);
	let O = f && /* @__PURE__ */ E(t, {
		startIcon: /* @__PURE__ */ E(r, { name: "download" }),
		onClick: f,
		children: h("preview.download")
	}), k = (e) => n(e, { locale: g }), A = (e, t, n) => e && /* @__PURE__ */ E(_, {
		intent: "neutral",
		className: "mtc-file-preview-notice",
		children: n === void 0 ? h("preview.truncatedStart", { shown: k(t) }) : h("preview.truncatedBytes", {
			shown: k(t),
			total: k(n)
		})
	}), j;
	switch (x.state) {
		case "loading":
			j = /* @__PURE__ */ E(i, {
				label: h("preview.loading"),
				compact: !0
			});
			break;
		case "error":
			j = /* @__PURE__ */ E(s, {
				error: x.error,
				compact: !0,
				actions: O
			});
			break;
		case "too-large":
			j = /* @__PURE__ */ E(a, {
				compact: !0,
				icon: /* @__PURE__ */ E(r, { name: "file" }),
				title: h("preview.tooLarge.title"),
				description: h("preview.tooLarge.description", {
					size: k(x.size),
					limit: k(x.limit)
				}),
				actions: O
			});
			break;
		case "blocked":
			j = /* @__PURE__ */ E(a, {
				compact: !0,
				icon: /* @__PURE__ */ E(r, { name: "shield" }),
				title: h("preview.blocked.title"),
				description: h("preview.blocked.description", { kind: x.kind }),
				actions: O
			});
			break;
		case "unreadable":
			j = /* @__PURE__ */ E(a, {
				compact: !0,
				icon: /* @__PURE__ */ E(r, { name: "file" }),
				title: h("preview.unreadable", { kind: x.kind }),
				actions: O
			});
			break;
		case "unsupported":
			j = /* @__PURE__ */ E(a, {
				compact: !0,
				icon: /* @__PURE__ */ E(r, { name: "file" }),
				title: h("preview.unsupported.title"),
				description: h("preview.unsupported.description"),
				actions: O
			});
			break;
		case "media":
			j = b.kind === "video" ? /* @__PURE__ */ E("video", {
				className: "mtc-file-preview-media",
				src: o.url,
				controls: !0,
				preload: "metadata",
				playsInline: !0,
				"aria-label": o.name
			}) : /* @__PURE__ */ E("audio", {
				className: "mtc-file-preview-audio",
				src: o.url,
				controls: !0,
				preload: "metadata",
				"aria-label": o.name
			});
			break;
		case "blob":
			j = b.kind === "pdf" ? /* @__PURE__ */ E("iframe", {
				className: "mtc-file-preview-pdf",
				src: x.url,
				title: o.name,
				style: { height: p }
			}) : /* @__PURE__ */ E("img", {
				className: "mtc-file-preview-image",
				src: x.url,
				alt: o.name
			});
			break;
		case "markdown":
			j = /* @__PURE__ */ D(T, { children: [A(x.truncated, v.textBytes, x.total), /* @__PURE__ */ E("div", {
				className: "mtc-markdown",
				style: { maxHeight: p },
				dangerouslySetInnerHTML: { __html: x.html }
			})] });
			break;
		case "table":
			j = /* @__PURE__ */ E($, {
				name: o.name,
				preview: x.table,
				truncatedBytes: x.truncatedBytes,
				height: p
			});
			break;
		case "text": j = /* @__PURE__ */ E(N, {
			code: x.text,
			label: o.name,
			language: b.language,
			height: p,
			truncatedNotice: x.truncated ? x.total === void 0 ? h("preview.truncatedStart", { shown: k(v.textBytes) }) : h("preview.truncatedBytes", {
				shown: k(v.textBytes),
				total: k(x.total)
			}) : void 0
		});
	}
	return /* @__PURE__ */ E("div", {
		className: d("mtc-file-preview", m),
		"data-kind": b.kind,
		"data-state": x.state,
		children: j
	});
}
function $({ name: t, preview: n, truncatedBytes: r, height: i }) {
	let a = e(), { locale: o } = c(), [s = [], ...l] = n.rows, u = Math.max(s.length, ...l.map((e) => e.length)), d = S(() => Array.from({ length: u }, (e, t) => ({
		id: String(t),
		header: s[t]?.trim() || a("preview.column", { index: t + 1 }),
		accessor: (e) => e.cells[t] ?? "",
		kind: "string",
		width: 160
	})), [
		s,
		u,
		a
	]), p = S(() => l.map((e, t) => ({
		id: t,
		cells: e
	})), [l]), m = n.truncatedRows || n.truncatedColumns || r, h = (e) => new Intl.NumberFormat(o).format(e);
	return /* @__PURE__ */ D(T, { children: [m && /* @__PURE__ */ E(_, {
		intent: "neutral",
		className: "mtc-file-preview-notice",
		children: a("preview.truncatedTable", {
			rows: h(l.length),
			totalRows: r ? `${h(n.sourceRowCount - 1)}+` : h(n.sourceRowCount - 1),
			columns: h(u),
			totalColumns: h(n.sourceColumnCount)
		})
	}), /* @__PURE__ */ E(f, {
		label: t,
		columns: d,
		rows: p,
		rowKey: (e) => String(e.id),
		height: i
	})] });
}
async function ee(e) {
	return e instanceof Response ? h(e) : g(e);
}
//#endregion
export { X as a, N as c, k as d, K as i, j as l, I as n, W as o, G as r, q as s, Q as t, A as u };
