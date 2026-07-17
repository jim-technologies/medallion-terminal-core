//#region src/widgets/platformShapes.ts
function e(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function t(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function n(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function r(t) {
	return e(t) ? Object.fromEntries(Object.entries(t).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function i(t) {
	return e(t) ? t : {};
}
function a(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function o(o) {
	let s = Array.isArray(o) ? { items: o } : i(o);
	return {
		items: (Array.isArray(s.items) ? s.items : []).filter(e).map((e) => ({
			id: String(e.id ?? ""),
			name: String(e.name ?? e.id ?? ""),
			kind: String(e.kind ?? "asset"),
			description: t(e.description),
			owner: t(e.owner),
			status: t(e.status),
			updatedAt: t(e.updatedAt ?? e.updated_at),
			tags: n(e.tags),
			url: t(e.url),
			metadata: i(e.metadata),
			context: r(e.context)
		})).filter((e) => e.id && e.name),
		total: a(s.total),
		nextPageToken: t(s.nextPageToken ?? s.next_page_token)
	};
}
function s(a) {
	let o = i(a), s = String(o.objectType ?? o.object_type ?? ""), c = String(o.objectId ?? o.object_id ?? ""), l = String(o.title ?? o.name ?? c);
	if (!s && !c && !l) return null;
	let u = (Array.isArray(o.properties) ? o.properties : []).filter(e).map((e) => ({
		key: String(e.key ?? ""),
		label: String(e.label ?? e.key ?? ""),
		value: e.value,
		format: t(e.format),
		description: t(e.description),
		group: t(e.group)
	})).filter((e) => e.key), d = (Array.isArray(o.links) ? o.links : []).filter(e).map((e) => ({
		relation: String(e.relation ?? ""),
		targetType: String(e.targetType ?? e.target_type ?? ""),
		targetId: String(e.targetId ?? e.target_id ?? ""),
		label: String(e.label ?? e.targetId ?? e.target_id ?? ""),
		status: t(e.status),
		context: r(e.context)
	})).filter((e) => e.targetId), f = (Array.isArray(o.actions) ? o.actions : []).filter(e).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		description: t(e.description),
		style: t(e.style),
		confirm: e.confirm === !0,
		params: i(e.params),
		disabled: e.disabled === !0
	})).filter((e) => e.id);
	return {
		objectType: s,
		objectId: c,
		title: l,
		description: t(o.description),
		status: t(o.status),
		updatedAt: t(o.updatedAt ?? o.updated_at),
		tags: n(o.tags),
		properties: u,
		links: d,
		actions: f
	};
}
function c(a) {
	let o = i(a);
	if (!Array.isArray(o.nodes)) return null;
	let s = o.nodes.filter(e).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		kind: t(e.kind),
		status: t(e.status),
		subtitle: t(e.subtitle),
		tags: n(e.tags),
		metadata: i(e.metadata),
		context: r(e.context)
	})).filter((e) => e.id), c = (Array.isArray(o.edges) ? o.edges : []).filter(e).map((e) => ({
		from: String(e.from ?? ""),
		to: String(e.to ?? ""),
		label: t(e.label),
		kind: t(e.kind),
		status: t(e.status)
	})).filter((e) => e.from && e.to);
	return s.length > 0 ? {
		nodes: s,
		edges: c
	} : null;
}
function l(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "2" || t === "DIRECTORY" || t === "DIR" || t === "REPOSITORY_ENTRY_KIND_DIRECTORY" ? "directory" : t === "3" || t === "SYMLINK" || t === "REPOSITORY_ENTRY_KIND_SYMLINK" ? "symlink" : "file";
}
function u(r) {
	let o = i(r), s = String(o.repository ?? o.name ?? "");
	if (!s && !Array.isArray(o.entries) && !e(o.file)) return null;
	let c = (Array.isArray(o.entries) ? o.entries : []).filter(e).map((e) => ({
		path: String(e.path ?? e.name ?? ""),
		name: String(e.name ?? String(e.path ?? "").split("/").pop() ?? ""),
		kind: l(e.kind),
		language: t(e.language),
		sizeBytes: a(e.sizeBytes ?? e.size_bytes),
		updatedAt: t(e.updatedAt ?? e.updated_at)
	})).filter((e) => e.path && e.name), u = e(o.file) ? o.file : null, d = u ? {
		path: String(u.path ?? o.path ?? ""),
		content: String(u.content ?? ""),
		language: t(u.language),
		sizeBytes: a(u.sizeBytes ?? u.size_bytes),
		truncated: u.truncated === !0,
		url: t(u.url)
	} : void 0;
	return {
		repository: s,
		ref: String(o.ref ?? ""),
		path: String(o.path ?? ""),
		refs: n(o.refs),
		entries: c,
		file: d,
		url: t(o.url)
	};
}
//#endregion
export { u as i, c as n, s as r, o as t };
