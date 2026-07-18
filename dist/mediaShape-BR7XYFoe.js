//#region src/widgets/mediaShape.ts
function e(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function t(t) {
	return e(t) ? t : {};
}
function n(e) {
	if (e != null) return String(e).trim() || void 0;
}
function r(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim()) {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function i(e) {
	let t = r(e);
	return t != null && t >= 0 ? t : void 0;
}
function a(e) {
	return Array.isArray(e) ? [...new Set(e.map(String).map((e) => e.trim()).filter(Boolean))] : [];
}
function o(t) {
	return e(t) ? Object.fromEntries(Object.entries(t).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function s(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
function c(e, t, n) {
	if (e === 2) return "video";
	if (e === 1) return "image";
	let r = String(e ?? "").toLowerCase();
	return r.includes("video") || r === "movie" ? "video" : r.includes("image") || r.includes("photo") ? "image" : t?.toLowerCase().startsWith("video/") || /\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(n) ? "video" : "image";
}
function l(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).pop();
	if (!t) return "Untitled media";
	try {
		return decodeURIComponent(t);
	} catch {
		return t;
	}
}
function u(r) {
	if (!e(r)) return null;
	let u = s(r.url ?? r.mediaUrl ?? r.media_url ?? r.src);
	if (!u) return null;
	let d = n(r.contentType ?? r.content_type ?? r.mimeType ?? r.mime_type);
	return {
		id: n(r.id ?? r.mediaId ?? r.media_id) ?? u,
		title: n(r.title ?? r.name ?? r.label ?? r.filename) ?? l(u),
		kind: c(r.kind ?? r.type ?? r.mediaType ?? r.media_type, d, u),
		url: u,
		thumbnailUrl: s(r.thumbnailUrl ?? r.thumbnail_url ?? r.thumbnail ?? r.posterUrl ?? r.poster_url ?? r.poster),
		description: n(r.description ?? r.caption),
		capturedAt: n(r.capturedAt ?? r.captured_at ?? r.takenAt ?? r.taken_at ?? r.dateTaken ?? r.date_taken),
		createdAt: n(r.createdAt ?? r.created_at ?? r.uploadedAt ?? r.uploaded_at),
		contentType: d,
		width: i(r.width),
		height: i(r.height),
		durationSeconds: i(r.durationSeconds ?? r.duration_seconds ?? r.duration),
		favorite: r.favorite === !0 || r.isFavorite === !0 || r.is_favorite === !0,
		tags: a(r.tags),
		collectionIds: a(r.collectionIds ?? r.collection_ids ?? r.albumIds ?? r.album_ids ?? r.albums),
		metadata: t(r.metadata),
		context: o(r.context)
	};
}
function d(t) {
	if (!e(t)) return null;
	let r = n(t.id ?? t.collectionId ?? t.collection_id ?? t.albumId ?? t.album_id);
	return r ? {
		id: r,
		name: n(t.name ?? t.title ?? t.label) ?? b(r),
		coverUrl: s(t.coverUrl ?? t.cover_url ?? t.thumbnailUrl ?? t.thumbnail_url),
		itemCount: i(t.itemCount ?? t.item_count ?? t.count),
		context: o(t.context)
	} : null;
}
function f(e) {
	let r = Array.isArray(e) ? { items: e } : t(e), a = (Array.isArray(r.items) ? r.items : Array.isArray(r.media) ? r.media : Array.isArray(r.assets) ? r.assets : []).map(u).filter((e) => e !== null), o = (Array.isArray(r.collections) ? r.collections : Array.isArray(r.albums) ? r.albums : []).map(d).filter((e) => e !== null), s = new Set(o.map((e) => e.id));
	for (let e of new Set(a.flatMap((e) => e.collectionIds))) s.has(e) || o.push({
		id: e,
		name: b(e),
		itemCount: a.filter((t) => t.collectionIds.includes(e)).length,
		context: {}
	});
	return {
		items: p(a),
		collections: o,
		total: i(r.total),
		nextPageToken: n(r.nextPageToken ?? r.next_page_token)
	};
}
function p(e) {
	return [...e].sort((e, t) => {
		let n = v(t) - v(e);
		return n === 0 ? e.title.localeCompare(t.title) : n;
	});
}
function m(e, t) {
	let n = t.query?.trim().toLowerCase() ?? "", r = t.kind ?? "all", i = t.collectionId && t.collectionId !== "all" ? t.collectionId : void 0;
	return e.filter((e) => r === "favorite" && !e.favorite || r !== "all" && r !== "favorite" && e.kind !== r || i && !e.collectionIds.includes(i) ? !1 : !n || [
		e.id,
		e.title,
		e.description,
		e.contentType,
		...e.tags,
		...Object.values(e.metadata)
	].filter((e) => e != null).map(String).join(" ").toLowerCase().includes(n));
}
function h(e, t = "day") {
	let n = p(e);
	if (t === "none") return n.length > 0 ? [{
		key: "all",
		label: "All media",
		items: n
	}] : [];
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let n = (e.capturedAt ?? e.createdAt)?.match(/^(\d{4})-(\d{2})-(\d{2})/), i = n ? t === "month" ? `${n[1]}-${n[2]}` : `${n[1]}-${n[2]}-${n[3]}` : "undated", a = r.get(i) ?? [];
		a.push(e), r.set(i, a);
	}
	return [...r].map(([e, n]) => ({
		key: e,
		label: y(e, t),
		items: n
	}));
}
function g(e) {
	if (e == null || !Number.isFinite(e) || e < 0) return;
	let t = Math.round(e), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
function _(e) {
	if (!e) return;
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(t);
}
function v(e) {
	let t = Date.parse(e.capturedAt ?? e.createdAt ?? "");
	return Number.isFinite(t) ? t : -Infinity;
}
function y(e, t) {
	if (e === "undated") return "Undated";
	let n = /* @__PURE__ */ new Date(`${e}${t === "month" ? "-01" : ""}T12:00:00Z`);
	return Number.isNaN(n.getTime()) ? e : new Intl.DateTimeFormat(void 0, t === "month" ? {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	} : {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	}).format(n);
}
function b(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
export { f as a, h as i, _ as n, s as o, g as r, p as s, m as t };
