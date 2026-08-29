import { Vt as e } from "./MultiDashboard-B8rxYV_S.js";
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
	if (typeof e.is_container == "boolean") return e.is_container;
	let t = (e.kind ?? "").toString().toUpperCase();
	return t === "FOLDER" || t === "KIND_FOLDER" || t === "DIRECTORY" || t === "KIND_DIRECTORY" || t === "CONTAINER" || t === "KIND_CONTAINER";
}
function r(e, t = "") {
	let n = e.id ?? e.object_id;
	if (n) return `id:${n}`;
	let r = e.path || l(t, e.name ?? "");
	return r ? `path:${r}` : `entry:${e.kind ?? ""}:${e.name ?? ""}`;
}
function i(e) {
	return a(e) || [];
}
function a(e) {
	if (!e) return null;
	if (Array.isArray(e)) return e;
	if (typeof e == "object") {
		let t = e;
		if (Array.isArray(t.entries)) return t.entries;
		if (Array.isArray(t.rows)) return t.rows;
	}
	return null;
}
function o(e) {
	let t = e.filter(n).sort(s), r = e.filter((e) => !n(e)).sort(s);
	return [...t, ...r];
}
function s(e, t) {
	return (e.name ?? "").localeCompare(t.name ?? "");
}
function c(e) {
	return e ? e.split("/").filter(Boolean) : [];
}
function l(e, t) {
	let n = (e ?? "").replace(/^\/+|\/+$/g, ""), r = (t ?? "").replace(/^\/+|\/+$/g, "");
	return n ? r ? n + "/" + r : n : r;
}
function u(e) {
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
var d = /* @__PURE__ */ new Set(["audio", "video"]), f = /* @__PURE__ */ new Set([
	"audio",
	"video",
	"image"
]);
function p(e) {
	return e.filter((e) => {
		let t = _(e.content_type, e.name, e.kind);
		return t !== null && d.has(t);
	});
}
function m(e) {
	return e.filter((e) => {
		let t = _(e.content_type, e.name, e.kind);
		return t !== null && f.has(t);
	});
}
function h(e, t, n, r, i = Math.random) {
	if (e.length === 0) return null;
	if (e.length === 1) return r ? e[0] : null;
	let a = e.findIndex((e) => y(e, t));
	if (n) {
		for (let n = 0; n < 5; n++) {
			let n = e[Math.floor(i() * e.length)];
			if (!y(n, t)) return n;
		}
		return e[(a + 1) % e.length];
	}
	return a < 0 ? e[0] : a + 1 < e.length ? e[a + 1] : r ? e[0] : null;
}
function g(e, t, n) {
	if (e.length === 0) return null;
	let r = e.findIndex((e) => y(e, t));
	return r > 0 ? e[r - 1] : n ? e[e.length - 1] : null;
}
function _(e, t, n) {
	let r = (t ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "", i = (e ?? "").toLowerCase().split(";")[0].trim(), a = (n ?? "").toLowerCase().replace(/^kind_|^media_kind_/, "");
	return a === "video" ? "video" : a === "audio" ? "audio" : a === "image" || a === "photo" ? "image" : a === "heic" || a === "heif" ? "heic" : a === "mkv" || a === "matroska" ? "mkv" : a === "pdf" ? "pdf" : a === "json" ? "json" : a === "yaml" ? "yaml" : a === "markdown" ? "markdown" : a === "csv" ? "csv" : a === "text" ? "text" : i && i !== "application/octet-stream" && i !== "binary/octet-stream" ? i === "image/heic" || i === "image/heif" ? "heic" : i === "video/x-matroska" || i === "application/x-matroska" ? "mkv" : i.startsWith("video/") ? "video" : i.startsWith("audio/") ? "audio" : i.startsWith("image/") ? "image" : i === "application/pdf" ? "pdf" : i === "application/json" || i === "text/json" ? "json" : i === "application/yaml" || i === "text/yaml" || i === "application/x-yaml" ? "yaml" : i === "text/markdown" || i === "text/x-markdown" ? "markdown" : i === "text/csv" || i === "application/csv" ? "csv" : i.startsWith("text/") ? "text" : null : r === "heic" || r === "heif" ? "heic" : r === "mkv" ? "mkv" : [
		"mp4",
		"webm",
		"mov",
		"m4v"
	].includes(r) ? "video" : [
		"mp3",
		"wav",
		"m4a",
		"aac",
		"ogg",
		"flac"
	].includes(r) ? "audio" : [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"avif",
		"svg"
	].includes(r) ? "image" : r === "pdf" ? "pdf" : r === "json" ? "json" : r === "yaml" || r === "yml" ? "yaml" : r === "md" || r === "markdown" ? "markdown" : r === "csv" ? "csv" : r === "txt" || r === "log" || r === "ini" || r === "conf" ? "text" : null;
}
function v(e) {
	return e !== null && e !== "heic" && e !== "mkv";
}
function y(e, t) {
	return t ? r(e) === t || e.name === t || e.path === t || e.id === t || e.object_id === t : !1;
}
function b(e, t, n) {
	let r = encodeURIComponent(t);
	return e.replace("{bucket}", r).replace("{namespace}", r).replace("{path}", encodeURIComponent(n));
}
function x(e, t) {
	if (/^(?:https?:)?\/\//i.test(t)) return t;
	let n = e ?? "";
	return n ? `${n.replace(/\/+$/, "")}/${t.replace(/^\/+/, "")}` : t;
}
function S(e, t, n) {
	if (!/^(?:https?:)?\/\//i.test(t)) return n;
	let r;
	if (e && /^https?:\/\//i.test(e)) try {
		r = new URL(e).origin;
	} catch {
		return {};
	}
	else typeof window < "u" && (r = window.location.origin);
	if (!r) return {};
	try {
		return new URL(t, r).origin === r ? n : {};
	} catch {
		return {};
	}
}
function C(e) {
	let t = "", n = new Uint8Array(e);
	for (let e = 0; e < n.byteLength; e++) t += String.fromCharCode(n[e]);
	return btoa(t);
}
async function w(e) {
	try {
		return (await e.json()).message ?? `HTTP ${e.status}`;
	} catch {
		return `HTTP ${e.status}`;
	}
}
async function T(t, n) {
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
export { w as _, r as a, c as b, v as c, h as d, i as f, _ as g, g as h, t as i, l, p as m, S as n, u as o, T as p, b as r, n as s, C as t, m as u, x as v, o as y };
