import { Bt as e, Tt as t, Vt as n, xt as r } from "./MultiDashboard-CwQKjnza.js";
import { useEffect as i, useState as a } from "react";
//#region src/hooks/useWatchAction.ts
var o = /* @__PURE__ */ new Set([
	"ACTION_STATUS_OK",
	"ACTION_STATUS_REJECTED",
	"ACTION_STATUS_FAILED",
	"ACTION_STATUS_CANCELLED"
]), s = /* @__PURE__ */ new Set(["ACTION_STATUS_ACCEPTED", "ACTION_STATUS_PENDING"]), c = /* @__PURE__ */ new Set([
	"ACTION_STATUS_REJECTED",
	"ACTION_STATUS_FAILED",
	"ACTION_STATUS_CANCELLED"
]);
function l(e) {
	return !!e && o.has(e);
}
function u(e) {
	return !!e && c.has(e);
}
function d(e) {
	return !!e && s.has(e);
}
var f = 64;
function p(o, s, c = {}) {
	let [u, d] = a([]), [p, m] = a(!1), [h, g] = a(null), [_, v] = a(""), y = s ? JSON.stringify([
		o,
		c,
		s.clientRequestId,
		s.id,
		s.actionId
	]) : "";
	return i(() => {
		if (o === void 0 || !s || !(s.clientRequestId || s.id || s.actionId)) return;
		d([]), m(!1), g(null), v(y);
		let i = new AbortController(), a = !1;
		return (async () => {
			try {
				let u = await fetch(t(o), {
					method: "POST",
					headers: {
						...c,
						"Content-Type": e
					},
					body: JSON.stringify(r(s)),
					signal: i.signal
				});
				if (!u.ok) throw Error(`WatchAction: HTTP ${u.status}`);
				if (!u.body) throw Error("WatchAction: no response body");
				let p = u.body.getReader();
				await n(p, {
					onMessage: (e) => {
						let t = e;
						d((e) => e.length >= f ? [...e.slice(1), t] : [...e, t]), l(t.status) && m(!0);
					},
					onTrailer: (e) => {
						if (e.error) {
							let t = e.error.code ?? "unknown", n = e.error.message ?? "watch error";
							g(`${t}: ${n}`);
						}
						m(!0);
					},
					isDisposed: () => a
				}), p.releaseLock();
			} catch (e) {
				!a && e instanceof Error && e.name !== "AbortError" && (g(e.message), m(!0));
			} finally {
				a || m(!0);
			}
		})(), () => {
			a = !0, i.abort();
		};
	}, [
		o,
		y,
		s?.actionId,
		s?.clientRequestId,
		s?.id
	]), _ === y ? {
		updates: u,
		latest: u.length > 0 ? u[u.length - 1] : null,
		done: p,
		error: h
	} : {
		updates: [],
		latest: null,
		done: !1,
		error: null
	};
}
//#endregion
export { p as i, d as n, l as r, u as t };
