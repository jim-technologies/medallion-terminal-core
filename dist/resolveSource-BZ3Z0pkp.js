//#region src/core/resolveSource.ts
var e = "medallion.terminal.v1.TerminalService";
function t(t) {
	return `${t.replace(/\/$/, "")}/${e}/Generate`;
}
function n(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function r(t) {
	return `${t.replace(/\/$/, "")}/${e}/SubmitAction`;
}
function i(t) {
	return `${t.replace(/\/$/, "")}/${e}/WatchAction`;
}
function a(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function o(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function s() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var c = !1, l = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function u(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new l(r);
		return "";
	});
}
function d(t, n, r) {
	if (t.source_id) {
		if (r === void 0) return c ||= (console.warn(`[medallion] source_id "${t.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), t;
		let i = t.stream ? "Stream" : "Get", a = r.replace(/\/$/, ""), o = {};
		if (t.params) for (let [e, r] of Object.entries(t.params)) o[e] = u(r, n, { strict: !0 });
		return {
			url: `${a}/${e}/${i}`,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: {
				source_id: t.source_id,
				params: o
			},
			stream: t.stream ? "connect" : !1,
			refreshIntervalMs: t.refreshIntervalMs ?? t.refreshInterval
		};
	}
	if (!t.url && !t.params) return t;
	let i = { ...t };
	if (t.url) {
		let e = u(t.url, n, { strict: !0 });
		if (t.params && Object.keys(t.params).length > 0) {
			let r = Object.entries(t.params).map(([e, t]) => `${encodeURIComponent(e)}=${encodeURIComponent(u(t, n, { strict: !0 }))}`).join("&");
			e = e.includes("?") ? `${e}&${r}` : `${e}?${r}`;
		}
		i.url = e;
	}
	return i;
}
//#endregion
export { r as a, s as c, t as i, d as l, o as n, i as o, n as r, u as s, a as t };
