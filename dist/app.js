import { a as e, c as t, i as n, l as r, n as i, o as a, r as o, s, t as c, u as l } from "./sourceError-Bi7hpvaI.js";
//#region src/app/productFetch.ts
var u = "x-request-id", d = "traceparent";
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
function _(e, t) {
	let n = t?.body ?? (e instanceof Request ? e.body : null);
	return n instanceof Blob || n instanceof FormData || n instanceof ArrayBuffer || ArrayBuffer.isView(n) || n instanceof ReadableStream;
}
function v(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function y(t = {}) {
	let { onUnauthenticated: n, timeoutMs: r, onRequest: i, newRequestId: a = m, newTraceparent: o = p, now: f = () => performance.now() } = t;
	return async function(p, m) {
		let y = t.fetch ?? globalThis.fetch, x = new Headers(m?.headers ?? (p instanceof Request ? p.headers : void 0));
		x.has(u) || x.set(u, a()), x.has(d) || x.set(d, o());
		let S = x.get(u), C = x.get(d), w = m?.signal ?? (p instanceof Request ? p.signal : void 0), T = r && r > 0 && !_(p, m) ? new AbortController() : void 0, E = T ? setTimeout(() => T.abort(new DOMException(`No response within ${r} ms`, "TimeoutError")), r) : void 0, D = g(p, m), O = h(p), k = f(), A = (e) => i?.({
			method: D,
			url: O,
			requestId: S,
			traceparent: C,
			durationMs: f() - k,
			...e
		}), j;
		try {
			j = await y(p, {
				...m,
				headers: x,
				signal: v([w ?? void 0, T?.signal])
			});
		} catch (e) {
			if (w?.aborted) throw e;
			let t = T?.signal.aborted ? new c(`Request timed out after ${r} ms`, {
				kind: "unavailable",
				requestId: S
			}) : b(l(e), S);
			throw A({ error: t }), t;
		} finally {
			clearTimeout(E);
		}
		if (e(j, S), j.ok) return A({ status: j.status }), j;
		let M = await s(j.clone(), { requestId: S });
		return A({
			status: j.status,
			error: M
		}), j.status === 401 && n?.(M), j;
	};
}
function b(e, t) {
	return e.requestId ? e : new c(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function x(e) {
	if (e.ok) return e;
	throw await s(e);
}
//#endregion
export { c as SourceError, y as createProductFetch, i as describeSourceError, x as ensureOk, o as isSourceError, p as newTraceparent, n as parseRetryAfter, a as responseRequestId, s as sourceErrorFromResponse, t as sourceErrorKindForCode, r as sourceErrorKindForStatus, l as toSourceError };
