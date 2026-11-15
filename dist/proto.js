// src/extensions/validateManifest.ts
var e = /^[a-z0-9][a-z0-9.-]{2,63}$/, t = "(?:0|[1-9][0-9]*)", n = "(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)", r = RegExp(`^${t}\\.${t}\\.${t}(?:-${n}(?:\\.${n})*)?(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?$`);
function i(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function a(e) {
	return typeof e == "string" && e.length > 0 && e.length <= 128 && e.trim() === e && !/[\u0000-\u001f\u007f]/.test(e);
}
function o(e) {
	return a(e) && /^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(e);
}
function s(t, n = { allowedLinkHosts: [] }) {
	let s = [], c = (e, t) => s.push({
		path: e,
		message: t
	}), l = (e, t, n) => {
		for (let r of Object.keys(e)) t.includes(r) || c(n ? `${n}.${r}` : r, "field is not supported by manifest v1");
	};
	if (!i(t)) return c("", "manifest must be an object"), s;
	l(t, [
		"id",
		"version",
		"title",
		"icon",
		"kind",
		"entitlementKey",
		"contributes",
		"link"
	], "");
	let u = typeof t.id == "string" ? t.id : "";
	if (e.test(u) || c("id", "id must match ^[a-z0-9][a-z0-9.-]{2,63}$"), (typeof t.version != "string" || t.version.length > 128 || !r.test(t.version)) && c("version", "version must be an exact semantic version"), a(t.title) || c("title", "a nonblank title of at most 128 characters is required"), o(t.icon) || c("icon", "a host icon identifier of at most 128 characters is required"), a(t.entitlementKey) && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(t.entitlementKey) || c("entitlementKey", "a stable workspace entitlement key is required"), t.kind !== "EXTENSION_KIND_NATIVE" && t.kind !== "EXTENSION_KIND_LINK" && c("kind", "kind must be EXTENSION_KIND_NATIVE or EXTENSION_KIND_LINK"), !i(t.contributes)) c("contributes", "contributions must declare the module routes");
	else {
		let e = t.contributes;
		l(e, [
			"nav",
			"routes",
			"homeTiles"
		], "contributes");
		let n = /* @__PURE__ */ new Set(), r = `/w/{workspace}/m/${u}`;
		!Array.isArray(e.routes) || e.routes.length === 0 ? c("contributes.routes", "at least one route is required") : e.routes.forEach((e, t) => {
			let i = `contributes.routes[${t}]`;
			if (typeof e != "string" || e.length > 2048 || e !== r && !e.startsWith(`${r}/`)) {
				c(i, "route must be inside /w/{workspace}/m/<manifest-id>");
				return;
			}
			let a = e.slice(r.length);
			a && a.slice(1).split("/").some((e) => !/^[a-zA-Z0-9._~-]+$/.test(e) || e === "." || e === "..") ? c(i, "route contains an unsafe or unsupported child segment") : (n.has(e) && c(i, "duplicate route"), n.add(e));
		});
		for (let t of ["nav", "homeTiles"]) {
			let r = e[t];
			if (r === void 0) continue;
			if (!Array.isArray(r)) {
				c(`contributes.${t}`, "entries must be an array");
				continue;
			}
			let s = /* @__PURE__ */ new Set();
			r.forEach((e, r) => {
				let u = `contributes.${t}[${r}]`;
				i(e) ? (l(e, [
					"title",
					"path",
					"icon"
				], u), a(e.title) || c(`${u}.title`, "a nonblank title of at most 128 characters is required"), e.icon !== void 0 && !o(e.icon) && c(`${u}.icon`, "icon must be a host icon identifier"), typeof e.path != "string" || !n.has(e.path) ? c(`${u}.path`, "entry must point at a declared route") : (s.has(e.path) && c(`${u}.path`, "duplicate entry route"), s.add(e.path))) : c(u, "entry must be an object");
			});
		}
	}
	if (t.kind === "EXTENSION_KIND_LINK") {
		if (!i(t.link)) c("link", "link modules require a destination and relation");
		else {
			l(t.link, ["urlTemplate", "requiredRelation"], "link");
			let e = t.link.urlTemplate;
			if (typeof e != "string" || e.length > 2048 || /\s|[\u0000-\u001f\u007f\\]/.test(e)) c("link.urlTemplate", "link must be an absolute HTTP(S) template without whitespace or backslashes");
			else try {
				let t = e.match(/^https?:\/\/([^/?#]*)/i)?.[1], r = e.replace(/\{workspace\}/g, "workspace"), i = new URL(r);
				(!t || /[{}@]/.test(t) || /[{}]/.test(r) || !["http:", "https:"].includes(i.protocol) || i.username || i.password || i.hash || !n.allowedLinkHosts.some((e) => e.toLowerCase() === i.host.toLowerCase())) && c("link.urlTemplate", "link authority must be explicitly allowed; only {workspace} in path/query is supported");
			} catch {
				c("link.urlTemplate", "link must be an absolute HTTP(S) URL");
			}
			typeof t.link.requiredRelation == "string" && /^[a-z][a-z0-9_]{0,63}$/.test(t.link.requiredRelation) || c("link.requiredRelation", "a valid required relation is mandatory");
		}
	} else t.link !== void 0 && c("link", "only link modules may declare a destination");
	return s;
}
export { s as validateExtensionManifest };
