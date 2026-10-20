import { E as e, T as t, _ as n, f as r, g as i, i as a, n as o, r as s } from "./States--oMl4ihu.js";
import { t as c } from "./utils-8rNbW-NI.js";
import { E as l, s as u, t as d, u as f } from "./sourceError-BA4fjwdn.js";
import { a as p, c as m, i as h, l as g, n as _, o as v, r as y, s as b, u as x } from "./FilePreview-DorV-7lk.js";
import { t as S } from "./DataGrid-B0UGRZIN.js";
import { t as C } from "./CodeView-BfvdgWCw.js";
import { t as w } from "./markdown-CzW38sfu.js";
import { useEffect as T, useMemo as E, useRef as D, useState as O } from "react";
import { Fragment as k, jsx as A, jsxs as j } from "react/jsx-runtime";
//#region src/files/previewProbe.ts
async function M(e, t, n, r) {
	let i = new AbortController(), a, o, s = () => {}, c = new Promise((e, t) => {
		s = () => {
			i.abort(), a?.cancel().catch(() => {}), t(r?.reason ?? new DOMException("Preview cancelled", "AbortError"));
		}, r?.addEventListener("abort", s, { once: !0 }), o = setTimeout(() => {
			i.abort(), a?.cancel().catch(() => {}), t(new DOMException("Preview probe timed out", "TimeoutError"));
		}, 1e4), r?.aborted && s();
	}), l = async () => {
		let r = await n(e, {
			credentials: "same-origin",
			headers: { Range: `bytes=0-${t - 1}` },
			signal: i.signal
		});
		if (i.signal.aborted) throw r.body?.cancel().catch(() => {}), new DOMException("Preview cancelled", "AbortError");
		let o = new Uint8Array(t), s = 0;
		if (r.body && (a = r.body.getReader(), r.ok)) for (; s < t;) {
			let { done: e, value: n } = await a.read();
			if (i.signal.aborted) throw new DOMException("Preview cancelled", "AbortError");
			if (e) break;
			let r = n.subarray(0, t - s);
			o.set(r, s), s += r.length;
		}
		return {
			response: r,
			bytes: o.slice(0, s)
		};
	};
	try {
		return await Promise.race([l(), c]);
	} finally {
		clearTimeout(o), r?.removeEventListener("abort", s), a?.cancel().catch(() => {}), i.abort();
	}
}
//#endregion
//#region src/files/MediaPreview.tsx
var N = {
	mp4: "video/mp4",
	m4v: "video/mp4",
	webm: "video/webm",
	mov: "video/quicktime",
	mp3: "audio/mpeg",
	m4a: "audio/mp4",
	aac: "audio/aac",
	wav: "audio/wav",
	ogg: "audio/ogg",
	oga: "audio/ogg",
	opus: "audio/ogg",
	flac: "audio/flac"
};
function P({ file: t, kind: n, fetch: c, session: l, onDownload: m }) {
	let h = e(), g = t.contentType?.trim(), _ = g?.toLowerCase().startsWith(`${n}/`) ? g : N[p(t.name)] ?? `${n}/*`, v = JSON.stringify([
		t.url,
		t.name,
		_,
		n
	]), [y, b] = O({
		source: v,
		phase: "checking"
	}), x = D(null), S = D(0), C = D({
		url: t.url,
		done: !1
	}), w = D(null), E = D({
		time: 0,
		playing: !1
	}), k = D(null), P = () => {
		let e = w.current;
		e && (w.current = null, clearTimeout(e.timer), e.controller.abort());
	};
	T(() => {
		S.current += 1, C.current.url !== t.url && (C.current = {
			url: t.url,
			done: !1
		}), E.current = {
			time: 0,
			playing: !1
		}, k.current = null;
		let e = document.createElement(n).canPlayType(_) !== "";
		return b({
			source: v,
			phase: e ? "ready" : "unsupported"
		}), () => {
			S.current += 1, P();
		};
	}, [
		v,
		n,
		_,
		t.url
	]);
	let F = (e) => w.current === e && e.generation === S.current && !e.controller.signal.aborted, I = (e, t) => {
		F(e) && (P(), b({
			source: v,
			...t
		}));
	}, L = () => new d(h("preview.mediaProbeTimeout"), {
		kind: "unavailable",
		code: "deadline_exceeded"
	}), R = async () => {
		let e = x.current;
		if (!e) return;
		if (w.current) {
			if (!w.current.metadata) return;
			P();
		}
		Number.isFinite(e.currentTime) && e.currentTime > 0 && (E.current.time = e.currentTime), k.current = null;
		let n = {
			controller: new AbortController(),
			generation: S.current,
			metadata: !1,
			...E.current
		};
		n.timer = setTimeout(() => I(n, {
			phase: "error",
			error: L()
		}), 15e3), w.current = n, b({
			source: v,
			phase: "recovering"
		});
		try {
			let { response: r } = await M(t.url, 1, c ?? globalThis.fetch, n.controller.signal);
			if (!F(n)) return;
			if (r.status === 401 && l && !C.current.done) {
				C.current.done = !0;
				let t;
				try {
					t = await l.renew();
				} catch (e) {
					I(n, {
						phase: "error",
						error: new d(f(e).message, {
							kind: "unauthenticated",
							status: 401
						})
					});
					return;
				}
				if (!F(n)) return;
				if (!t.authenticated) {
					I(n, {
						phase: "error",
						error: await u(r)
					});
					return;
				}
				n.metadata = !0, e.load();
			} else r.ok ? I(n, { phase: "unsupported" }) : I(n, {
				phase: "error",
				error: await u(r)
			});
		} catch (e) {
			if (!F(n)) return;
			I(n, {
				phase: "error",
				error: e instanceof DOMException && e.name === "TimeoutError" ? L() : f(e)
			});
		}
	}, z = () => {
		let e = k.current, t = x.current;
		!e || !t || t.seeking || w.current || t.error || e.generation !== S.current || (t.readyState >= 3 || t.currentTime > e.time + .01) && (C.current.done = !1, k.current = null);
	}, B = () => {
		let e = w.current, t = x.current;
		if (e && t && e.metadata && F(e)) try {
			let n = Number.isFinite(t.duration) ? Math.max(0, t.duration - .001) : e.time;
			if (t.currentTime = Math.min(e.time, n), E.current = {
				time: t.currentTime,
				playing: e.playing
			}, k.current = {
				generation: S.current,
				time: t.currentTime
			}, I(e, { phase: "ready" }), e.playing) {
				let e = S.current;
				t.play().catch(() => {
					e === S.current && (E.current.playing = !1);
				});
			}
		} catch (t) {
			I(e, {
				phase: "error",
				error: f(t)
			});
		}
	}, V = m && /* @__PURE__ */ A(r, {
		startIcon: /* @__PURE__ */ A(i, { name: "download" }),
		onClick: m,
		children: h("preview.download")
	});
	if (y.source !== v || y.phase === "checking") return /* @__PURE__ */ A(a, {
		label: h("preview.loading"),
		compact: !0
	});
	if (y.phase === "unsupported") return /* @__PURE__ */ A(o, {
		compact: !0,
		icon: /* @__PURE__ */ A(i, { name: "file" }),
		title: h("preview.cannotPlay.title", { format: _ }),
		description: h("preview.cannotPlay.description"),
		actions: V
	});
	if (y.phase === "error") return /* @__PURE__ */ A(s, {
		error: y.error,
		compact: !0,
		actions: V
	});
	let H = {
		ref: (e) => {
			x.current = e;
		},
		src: t.url,
		controls: !0,
		preload: "metadata",
		"aria-label": t.name,
		onError: () => {
			R();
		},
		onLoadedMetadata: B,
		onCanPlay: z,
		onTimeUpdate: () => {
			let e = x.current, t = w.current;
			e && !e.error && !t?.metadata && Number.isFinite(e.currentTime) && (E.current.time = e.currentTime, t && (t.time = e.currentTime)), z();
		},
		onSeeking: () => {
			let e = x.current, t = w.current;
			e && !e.error && !t?.metadata && Number.isFinite(e.currentTime) && (E.current.time = e.currentTime, t && (t.time = e.currentTime));
		},
		onPlay: () => {
			let e = w.current;
			e?.metadata || (E.current.playing = !0, e && (e.playing = !0));
		},
		onPause: () => {
			let e = w.current;
			!e?.metadata && !x.current?.error && (E.current.playing = !1, e && (e.playing = !1));
		}
	};
	return /* @__PURE__ */ j("div", {
		"aria-busy": y.phase === "recovering" || void 0,
		children: [y.phase === "recovering" && /* @__PURE__ */ A(a, {
			label: h("preview.loading"),
			compact: !0
		}), n === "video" ? /* @__PURE__ */ A("video", {
			...H,
			className: "mtc-file-preview-media",
			playsInline: !0
		}, "media") : /* @__PURE__ */ A("audio", {
			...H,
			className: "mtc-file-preview-audio"
		}, "media")]
	});
}
//#endregion
//#region src/files/FilePreviewContent.tsx
var F = {
	png: "image/png",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp",
	avif: "image/avif"
};
function I({ file: u, fetch: d, session: f, limits: p, onDownload: S, height: D = 480, markdown: N, className: I }) {
	let z = e(), { locale: B } = t(), V = E(() => ({
		..._,
		...p
	}), [p]), H = E(() => g(u.name, u.contentType), [u.name, u.contentType]), [U, W] = O({ state: "loading" });
	T(() => {
		let e = new AbortController(), t;
		return W({ state: "loading" }), (async () => {
			let n = d ?? globalThis.fetch;
			switch (H.kind) {
				case "unsupported": return { state: "unsupported" };
				case "video":
				case "audio": return { state: "media" };
				case "image":
				case "pdf": {
					let r = H.kind === "pdf" ? V.pdfBytes : V.imageBytes, i = H.kind === "pdf" ? "application/pdf" : F[H.raster], a = {
						state: "blocked",
						kind: H.kind === "pdf" ? "PDF" : H.raster.toUpperCase()
					}, o = (e) => e.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() === i ? {
						state: "direct",
						url: u.url
					} : a;
					if (u.sizeBytes === void 0 || u.sizeBytes > r) {
						let t = await M(u.url, 16, n, e.signal);
						if (!t.response.ok) throw t.response;
						let i = H.kind === "pdf" ? v(t.bytes) : b(H.raster, t.bytes), s = y(t.response.headers.get("content-range")) ?? (t.response.status === 200 && Number(t.response.headers.get("content-length")) || void 0) ?? u.sizeBytes;
						if (s !== void 0 && s > r) return i ? o(t.response) : a;
						if (!i && (H.raster !== "avif" || String.fromCharCode(...t.bytes.slice(4, 8)) !== "ftyp")) return a;
					}
					let s = await n(u.url, { signal: e.signal });
					if (!s.ok) throw s;
					let { bytes: c, truncated: l } = await x(s, r);
					return (H.kind === "pdf" ? v(c) : b(H.raster, c)) ? l ? o(s) : (t = URL.createObjectURL(new Blob([c], { type: H.kind === "pdf" ? "application/pdf" : F[H.raster] })), {
						state: "blob",
						url: t
					}) : {
						state: "blocked",
						kind: H.kind === "pdf" ? "PDF" : H.raster.toUpperCase()
					};
				}
				default: {
					let t = H.kind === "csv" || H.kind === "tsv", r = t ? V.delimitedBytes : V.textBytes, i = await n(u.url, {
						headers: { Range: `bytes=0-${r - 1}` },
						signal: e.signal
					});
					if (!i.ok) throw i;
					let a = y(i.headers.get("content-range")) ?? u.sizeBytes, { bytes: o, truncated: s } = await x(i, r), c = s || a !== void 0 && a > o.length, l = h(o, c);
					if (t) try {
						let e = c ? l.slice(0, Math.max(0, l.lastIndexOf("\n"))) : l;
						return {
							state: "table",
							table: m(e, H.kind === "tsv" ? "	" : ",", {
								...V,
								rows: V.rows + 1
							}),
							truncatedBytes: c
						};
					} catch {
						return {
							state: "unreadable",
							kind: H.kind.toUpperCase()
						};
					}
					if (H.kind === "markdown") return {
						state: "markdown",
						html: await w(l, N),
						truncated: c,
						total: a
					};
					if (H.kind === "json" && !c) try {
						return {
							state: "text",
							text: JSON.stringify(JSON.parse(l), null, 2),
							truncated: c,
							total: a
						};
					} catch {
						return {
							state: "text",
							text: l,
							truncated: c,
							total: a
						};
					}
					return {
						state: "text",
						text: l,
						truncated: c,
						total: a
					};
				}
			}
		})().then((n) => {
			e.signal.aborted ? t && URL.revokeObjectURL(t) : W(n);
		}, async (t) => {
			if (e.signal.aborted) return;
			let n = await R(t);
			e.signal.aborted || W({
				state: "error",
				error: n
			});
		}), () => {
			e.abort(), t && URL.revokeObjectURL(t);
		};
	}, [
		u.url,
		u.name,
		u.sizeBytes,
		H,
		V,
		d
	]);
	let G = S && /* @__PURE__ */ A(r, {
		startIcon: /* @__PURE__ */ A(i, { name: "download" }),
		onClick: S,
		children: z("preview.download")
	}), K = (e) => n(e, { locale: B }), q = (e, t, n) => e && /* @__PURE__ */ A(l, {
		intent: "neutral",
		className: "mtc-file-preview-notice",
		children: n === void 0 ? z("preview.truncatedStart", { shown: K(t) }) : z("preview.truncatedBytes", {
			shown: K(t),
			total: K(n)
		})
	}), J;
	switch (U.state) {
		case "loading":
			J = /* @__PURE__ */ A(a, {
				label: z("preview.loading"),
				compact: !0
			});
			break;
		case "error":
			J = /* @__PURE__ */ A(s, {
				error: U.error,
				compact: !0,
				actions: G
			});
			break;
		case "blocked":
			J = /* @__PURE__ */ A(o, {
				compact: !0,
				icon: /* @__PURE__ */ A(i, { name: "shield" }),
				title: z("preview.blocked.title"),
				description: z("preview.blocked.description", { kind: U.kind }),
				actions: G
			});
			break;
		case "unreadable":
			J = /* @__PURE__ */ A(o, {
				compact: !0,
				icon: /* @__PURE__ */ A(i, { name: "file" }),
				title: z("preview.unreadable", { kind: U.kind }),
				actions: G
			});
			break;
		case "unsupported":
			J = /* @__PURE__ */ A(o, {
				compact: !0,
				icon: /* @__PURE__ */ A(i, { name: "file" }),
				title: z("preview.unsupported.title"),
				description: z("preview.unsupported.description"),
				actions: G
			});
			break;
		case "media":
			J = /* @__PURE__ */ A(P, {
				file: u,
				kind: H.kind === "video" ? "video" : "audio",
				fetch: d,
				session: f,
				onDownload: S
			});
			break;
		case "blob":
		case "direct":
			J = H.kind === "pdf" ? /* @__PURE__ */ j(k, { children: [/* @__PURE__ */ A("iframe", {
				className: "mtc-file-preview-pdf",
				src: U.url,
				title: u.name,
				sandbox: "",
				style: { height: D }
			}), G] }) : /* @__PURE__ */ A("img", {
				className: "mtc-file-preview-image",
				src: U.url,
				alt: u.name
			});
			break;
		case "markdown":
			J = /* @__PURE__ */ j(k, { children: [q(U.truncated, V.textBytes, U.total), /* @__PURE__ */ A("div", {
				className: "mtc-markdown",
				style: { maxHeight: D },
				dangerouslySetInnerHTML: { __html: U.html }
			})] });
			break;
		case "table":
			J = /* @__PURE__ */ A(L, {
				name: u.name,
				preview: U.table,
				truncatedBytes: U.truncatedBytes,
				height: D
			});
			break;
		case "text": J = /* @__PURE__ */ A(C, {
			code: U.text,
			label: u.name,
			language: H.language,
			height: D,
			truncatedNotice: U.truncated ? U.total === void 0 ? z("preview.truncatedStart", { shown: K(V.textBytes) }) : z("preview.truncatedBytes", {
				shown: K(V.textBytes),
				total: K(U.total)
			}) : void 0
		});
	}
	return /* @__PURE__ */ A("div", {
		className: c("mtc-file-preview", I),
		"data-kind": H.kind,
		"data-state": U.state,
		children: J
	});
}
function L({ name: n, preview: r, truncatedBytes: i, height: a }) {
	let o = e(), { locale: s } = t(), [c = [], ...u] = r.rows, d = Math.max(c.length, ...u.map((e) => e.length)), f = E(() => Array.from({ length: d }, (e, t) => ({
		id: String(t),
		header: c[t]?.trim() || o("preview.column", { index: t + 1 }),
		accessor: (e) => e.cells[t] ?? "",
		kind: "string"
	})), [
		c,
		d,
		o
	]), p = E(() => u.map((e, t) => ({
		id: t,
		cells: e
	})), [u]), m = r.truncatedRows || r.truncatedColumns || i, h = (e) => new Intl.NumberFormat(s).format(e);
	return /* @__PURE__ */ j(k, { children: [m && /* @__PURE__ */ A(l, {
		intent: "neutral",
		className: "mtc-file-preview-notice",
		children: o("preview.truncatedTable", {
			rows: h(u.length),
			totalRows: i ? `${h(r.sourceRowCount - 1)}+` : h(r.sourceRowCount - 1),
			columns: h(d),
			totalColumns: h(r.sourceColumnCount)
		})
	}), /* @__PURE__ */ A(S, {
		label: n,
		columns: f,
		rows: p,
		rowKey: (e) => String(e.id),
		height: a
	})] });
}
async function R(e) {
	return e instanceof Response ? u(e) : f(e);
}
//#endregion
export { I as FilePreviewContent };
