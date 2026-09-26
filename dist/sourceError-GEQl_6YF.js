//#region src/core/sourceError.ts
var e = class extends Error {
	kind;
	status;
	code;
	requestId;
	retryAfterMs;
	constructor(e, t) {
		super(e), this.name = "SourceError", this.kind = t.kind, this.status = t.status, this.code = t.code, this.requestId = t.requestId, this.retryAfterMs = t.retryAfterMs;
	}
};
function t(t) {
	return t instanceof e || t instanceof Error && t.name === "SourceError" && typeof t.kind == "string";
}
var n = [
	"ok",
	"canceled",
	"unknown",
	"invalid_argument",
	"deadline_exceeded",
	"not_found",
	"already_exists",
	"permission_denied",
	"resource_exhausted",
	"failed_precondition",
	"aborted",
	"out_of_range",
	"unimplemented",
	"internal",
	"unavailable",
	"data_loss",
	"unauthenticated"
], r = {
	unauthenticated: "unauthenticated",
	permission_denied: "forbidden",
	not_found: "not_found",
	resource_exhausted: "rate_limited",
	unavailable: "unavailable",
	deadline_exceeded: "unavailable",
	invalid_argument: "invalid",
	failed_precondition: "invalid",
	out_of_range: "invalid",
	already_exists: "invalid"
};
function i(e) {
	return r[e] ?? "unknown";
}
function a(e) {
	return e === 401 ? "unauthenticated" : e === 403 ? "forbidden" : e === 404 || e === 410 ? "not_found" : e === 429 ? "rate_limited" : e === 408 || e === 502 || e === 503 || e === 504 ? "unavailable" : e === 400 || e === 409 || e === 412 || e === 422 ? "invalid" : "unknown";
}
var o = [
	"x-request-id",
	"request-id",
	"x-correlation-id"
];
function s(e) {
	for (let t of o) {
		let n = e.get(t)?.trim();
		if (n) return n;
	}
}
function c(e, t = Date.now()) {
	if (!e) return;
	let n = e.trim();
	if (/^\d+$/.test(n)) return Number(n) * 1e3;
	let r = Date.parse(n);
	if (!(Number.isNaN(r) || r <= t)) return r - t;
}
var l = 16384;
async function u(t, n = {}) {
	let r, o, u = t.headers.get("content-type") ?? "";
	if (/\bjson\b/i.test(u)) try {
		let e = (await t.text()).slice(0, l), n = JSON.parse(e);
		typeof n?.code == "string" && n.code && (r = n.code), typeof n?.message == "string" && n.message.trim() && (o = n.message.trim());
	} catch {}
	return new e(o ?? `HTTP ${t.status}`, {
		kind: r ? i(r) : a(t.status),
		status: t.status,
		code: r,
		requestId: s(t.headers) ?? n.requestId,
		retryAfterMs: c(t.headers.get("retry-after"), n.now)
	});
}
function d(r) {
	if (t(r)) return r;
	let a = r, o = typeof a?.code == "number" ? n[a.code] : typeof a?.code == "string" && n.includes(a.code) ? a.code : void 0, c = typeof a?.rawMessage == "string" && a.rawMessage ? a.rawMessage : r instanceof Error ? r.message : String(r);
	if (o && o !== "ok") {
		let t = a?.metadata instanceof Headers ? a.metadata : void 0;
		return new e(c, {
			kind: i(o),
			code: o,
			requestId: t ? s(t) : void 0
		});
	}
	return r instanceof Error && (r.name === "TimeoutError" || r.name === "TypeError") ? new e(c, { kind: "unavailable" }) : new e(c, { kind: "unknown" });
}
function f(e) {
	return e.code ? `${e.code}: ${e.message}` : e.message;
}
//#endregion
export { s as a, a as c, c as i, d as l, f as n, u as o, t as r, i as s, e as t };
