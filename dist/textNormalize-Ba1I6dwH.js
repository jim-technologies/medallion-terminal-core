//#region src/widgets/textNormalize.ts
function e(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
var t = /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:?\d{2})$/;
function n(e) {
	if (typeof e != "string" || !t.test(e.trim())) return e;
	let n = new Date(e);
	return isNaN(n.getTime()) ? e : n.toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function r(e) {
	if (!e) return [];
	if (typeof e == "string") return [{ body: e }];
	if (!Array.isArray(e) && typeof e == "object" && e) {
		let t = e;
		return Array.isArray(t.items) ? r(t.items) : [i(t)];
	}
	return Array.isArray(e) ? e.map((e) => typeof e == "string" ? { body: e } : typeof e == "object" && e ? i(e) : { body: String(e) }) : [];
}
function i(t) {
	return {
		id: t.id == null ? void 0 : String(t.id),
		title: t.title == null ? void 0 : String(t.title),
		meta: t.meta ?? t.source ?? t.date ?? t.author ? [
			t.source,
			t.author,
			n(t.date)
		].filter(Boolean).map(String).join(" · ") : void 0,
		body: t.body ?? t.content ?? t.summary ?? t.text ? String(t.body ?? t.content ?? t.summary ?? t.text) : void 0,
		tags: Array.isArray(t.tags) ? t.tags.map(String) : void 0,
		image: t.image == null ? t.image_url == null ? t.thumbnail == null ? void 0 : String(t.thumbnail) : String(t.image_url) : String(t.image),
		url: e(t.url ?? t.uri ?? t.link ?? t.href)
	};
}
//#endregion
export { r as n, e as r, n as t };
