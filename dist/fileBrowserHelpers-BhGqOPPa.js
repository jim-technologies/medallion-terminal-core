import { n as e } from "./connectFraming-C7uFpPlK.js";
//#region src/widgets/fileBrowserHelpers.ts
function t(e) {
	if (e instanceof Error) return e.message;
	if (typeof e == "string") return e;
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
function n(e) {
	let t = (e.kind ?? "").toString().toUpperCase();
	return t === "FOLDER" || t === "KIND_FOLDER";
}
function r(e) {
	return i(e) || [];
}
function i(e) {
	if (!e) return null;
	if (Array.isArray(e)) return e;
	if (typeof e == "object") {
		let t = e;
		if (Array.isArray(t.entries)) return t.entries;
		if (Array.isArray(t.rows)) return t.rows;
	}
	return null;
}
function a(e) {
	let t = e.filter(n).sort(o), r = e.filter((e) => !n(e)).sort(o);
	return [...t, ...r];
}
function o(e, t) {
	return (e.name ?? "").localeCompare(t.name ?? "");
}
function s(e) {
	return e ? e.split("/").filter(Boolean) : [];
}
function c(e, t) {
	let n = (e ?? "").replace(/^\/+|\/+$/g, ""), r = (t ?? "").replace(/^\/+|\/+$/g, "");
	return n ? r ? n + "/" + r : n : r;
}
function l(e) {
	let t = [
		"B",
		"KB",
		"MB",
		"GB",
		"TB"
	], n = 0, r = e;
	for (; r >= 1024 && n < t.length - 1;) r /= 1024, n++;
	return `${n === 0 ? r.toFixed(0) : r.toFixed(1)} ${t[n]}`;
}
var u = /* @__PURE__ */ new Set([
	"audio",
	"video",
	"mkv"
]), d = /* @__PURE__ */ new Set([
	"audio",
	"video",
	"mkv",
	"image",
	"heic"
]);
function f(e) {
	return e.filter((e) => {
		let t = g(e.content_type, e.name);
		return t !== null && u.has(t);
	});
}
function p(e) {
	return e.filter((e) => {
		let t = g(e.content_type, e.name);
		return t !== null && d.has(t);
	});
}
function m(e, t, n, r, i = Math.random) {
	if (e.length === 0) return null;
	if (e.length === 1) return r ? e[0] : null;
	let a = e.findIndex((e) => e.name === t);
	if (n) {
		for (let n = 0; n < 5; n++) {
			let n = e[Math.floor(i() * e.length)];
			if (n.name !== t) return n;
		}
		return e[(a + 1) % e.length];
	}
	return a < 0 ? e[0] : a + 1 < e.length ? e[a + 1] : r ? e[0] : null;
}
function h(e, t, n) {
	if (e.length === 0) return null;
	let r = e.findIndex((e) => e.name === t);
	return r > 0 ? e[r - 1] : n ? e[e.length - 1] : null;
}
function g(e, t) {
	let n = (t ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "", r = (e ?? "").toLowerCase().split(";")[0].trim();
	return r === "image/heic" || r === "image/heif" || n === "heic" || n === "heif" ? "heic" : r === "video/x-matroska" || r === "application/x-matroska" || n === "mkv" ? "mkv" : r.startsWith("video/") ? "video" : r.startsWith("audio/") ? "audio" : r.startsWith("image/") ? "image" : r === "application/pdf" || n === "pdf" ? "pdf" : r === "application/json" || r === "text/json" || n === "json" ? "json" : r === "application/yaml" || r === "text/yaml" || r === "application/x-yaml" || n === "yaml" || n === "yml" ? "yaml" : r === "text/markdown" || r === "text/x-markdown" || n === "md" || n === "markdown" ? "markdown" : r === "text/csv" || r === "application/csv" || n === "csv" ? "csv" : r.startsWith("text/") || n === "txt" || n === "log" || n === "ini" || n === "conf" ? "text" : null;
}
function _(e, t, n) {
	let r = encodeURIComponent(t);
	return e.replace("{bucket}", r).replace("{namespace}", r).replace("{path}", encodeURIComponent(n));
}
function v(e, t) {
	if (/^https?:\/\//i.test(t)) return t;
	let n = e ?? "";
	return n ? `${n.replace(/\/+$/, "")}/${t.replace(/^\/+/, "")}` : t;
}
function y(e) {
	let t = "", n = new Uint8Array(e);
	for (let e = 0; e < n.byteLength; e++) t += String.fromCharCode(n[e]);
	return btoa(t);
}
async function b(e) {
	try {
		return (await e.json()).message ?? `HTTP ${e.status}`;
	} catch {
		return `HTTP ${e.status}`;
	}
}
async function x(t, n) {
	if (!t.body) throw Error("parseConnectStream: response has no body");
	let r = t.body.getReader(), i = [], a = !1, o = null;
	try {
		await e(r, {
			onMessage: (e) => {
				if (!e || typeof e != "object" || typeof e.data != "string") {
					o ??= "Download stream contained a message without base64 data";
					return;
				}
				let t = e.data;
				try {
					let e = atob(t), n = new Uint8Array(e.length);
					for (let t = 0; t < e.length; t++) n[t] = e.charCodeAt(t);
					i.push(n);
				} catch {
					o ??= "Download stream contained invalid base64 data";
				}
			},
			onTrailer: (e) => {
				a = !0, e.error && (o = `${e.error.code ?? "unknown"}: ${e.error.message ?? "download failed"}`);
			},
			isDisposed: () => !1
		});
	} finally {
		try {
			r.releaseLock();
		} catch {}
	}
	if (o) throw Error(o);
	if (!a) throw Error("Download stream ended before its Connect trailer");
	return new Blob(i.map((e) => e.slice().buffer), { type: n ?? "application/octet-stream" });
}
//#endregion
export { s as _, n as a, m as c, f as d, h as f, a as g, v as h, l as i, r as l, b as m, _ as n, c as o, g as p, t as r, p as s, y as t, x as u };
