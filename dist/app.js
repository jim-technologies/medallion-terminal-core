import { a as e, c as t, i as n, l as r, n as i, o as a, r as o, s, t as c, u as l } from "./sourceError-B1Q2JDlm.js";
//#region src/app/productFetch.ts
var u = "x-request-id", d = "traceparent", f = "connect-timeout-ms";
function p(e) {
	let t = new Uint8Array(e);
	return globalThis.crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function m() {
	return `00-${p(16)}-${p(8)}-01`;
}
function h() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : p(16);
}
function g(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function _(e, t) {
	return (t?.method ?? (e instanceof Request ? e.method : "GET")).toUpperCase();
}
function v(e, t) {
	let n = t?.body ?? (e instanceof Request ? e.body : null);
	return n instanceof Blob || n instanceof FormData || n instanceof ReadableStream;
}
function y(e, t, n, r) {
	let i = r?.timeoutMs === void 0 ? t.has(f) || v(n, r) ? void 0 : e : r.timeoutMs;
	return i && i > 0 ? i : void 0;
}
function b(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function x(t = {}) {
	let { onUnauthenticated: n, timeoutMs: r, onRequest: i, newRequestId: a = h, newTraceparent: o = m, now: f = () => performance.now() } = t;
	return async function(p, m) {
		let h = t.fetch ?? globalThis.fetch, v = new Headers(m?.headers ?? (p instanceof Request ? p.headers : void 0));
		v.has(u) || v.set(u, a()), v.has(d) || v.set(d, o());
		let x = v.get(u), C = v.get(d), w = m?.signal ?? (p instanceof Request ? p.signal : void 0), T = y(r, v, p, m), E = T ? new AbortController() : void 0, D = E ? setTimeout(() => E.abort(new DOMException(`No response within ${T} ms`, "TimeoutError")), T) : void 0, O = _(p, m), k = g(p), A = f(), j = (e) => i?.({
			method: O,
			url: k,
			requestId: x,
			traceparent: C,
			durationMs: f() - A,
			...e
		}), { timeoutMs: M, ...N } = m ?? {}, P;
		try {
			P = await h(p, {
				...N,
				headers: v,
				signal: b([w ?? void 0, E?.signal])
			});
		} catch (e) {
			if (w?.aborted) throw e;
			let t = E?.signal.aborted ? new c(`Request timed out after ${T} ms`, {
				kind: "unavailable",
				requestId: x
			}) : S(l(e), x);
			throw j({ error: t }), t;
		} finally {
			clearTimeout(D);
		}
		if (e(P, x), P.ok) return j({ status: P.status }), P;
		let F = await s(P.clone(), { requestId: x });
		return j({
			status: P.status,
			error: F
		}), P.status === 401 && n?.(F), P;
	};
}
function S(e, t) {
	return e.requestId ? e : new c(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function C(e) {
	if (e.ok) return e;
	throw await s(e);
}
//#endregion
export { c as SourceError, x as createProductFetch, i as describeSourceError, C as ensureOk, o as isSourceError, m as newTraceparent, n as parseRetryAfter, a as responseRequestId, s as sourceErrorFromResponse, t as sourceErrorKindForCode, r as sourceErrorKindForStatus, l as toSourceError };
