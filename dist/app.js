import { a as e, c as t, i as n, l as r, n as i, o as a, r as o, s, t as c } from "./sourceError-GEQl_6YF.js";
//#region src/app/productFetch.ts
var l = "x-request-id", u = "traceparent", d = /* @__PURE__ */ new WeakMap();
function f(e) {
	let t = new Uint8Array(e);
	return globalThis.crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function p() {
	return `00-${f(16)}-${f(8)}-01`;
}
function m() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : f(16);
}
function h(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function g(e, t) {
	return (t?.method ?? (e instanceof Request ? e.method : "GET")).toUpperCase();
}
function _(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function v(e = {}) {
	let { onUnauthenticated: t, timeoutMs: n, onRequest: i, newRequestId: o = m, newTraceparent: s = p, now: f = () => performance.now() } = e;
	return async function(p, m) {
		let v = e.fetch ?? globalThis.fetch, b = new Headers(m?.headers ?? (p instanceof Request ? p.headers : void 0));
		b.has(l) || b.set(l, o()), b.has(u) || b.set(u, s());
		let x = b.get(l), S = b.get(u), C = m?.signal ?? (p instanceof Request ? p.signal : void 0), w = n && n > 0 ? AbortSignal.timeout(n) : void 0, T = g(p, m), E = h(p), D = f(), O = (e) => i?.({
			method: T,
			url: E,
			requestId: x,
			traceparent: S,
			durationMs: f() - D,
			...e
		}), k;
		try {
			k = await v(p, {
				...m,
				headers: b,
				signal: _([C ?? void 0, w])
			});
		} catch (e) {
			if (C?.aborted) throw e;
			let t = w?.aborted ? new c(`Request timed out after ${n} ms`, {
				kind: "unavailable",
				requestId: x
			}) : y(r(e), x);
			throw O({ error: t }), t;
		}
		if (d.set(k, x), k.ok) return O({ status: k.status }), k;
		let A = await a(k.clone(), { requestId: x });
		return O({
			status: k.status,
			error: A
		}), k.status === 401 && t?.(A), k;
	};
}
function y(e, t) {
	return e.requestId ? e : new c(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function b(e) {
	if (e.ok) return e;
	throw await a(e, { requestId: d.get(e) });
}
//#endregion
export { c as SourceError, v as createProductFetch, i as describeSourceError, b as ensureOk, o as isSourceError, p as newTraceparent, n as parseRetryAfter, e as responseRequestId, a as sourceErrorFromResponse, s as sourceErrorKindForCode, t as sourceErrorKindForStatus, r as toSourceError };
