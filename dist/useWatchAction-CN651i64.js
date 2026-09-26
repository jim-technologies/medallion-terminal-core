import { Bt as e, Tt as t, Vt as n, xt as r } from "./MultiDashboard-BkknCTY4.js";
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
function p(o, s, c = {}, u) {
	let [d, p] = a([]), [m, h] = a(!1), [g, _] = a(null), [v, y] = a(""), b = s ? JSON.stringify([
		o,
		c,
		s.clientRequestId,
		s.id,
		s.actionId
	]) : "";
	return i(() => {
		if (o === void 0 || !s || !(s.clientRequestId || s.id || s.actionId)) return;
		p([]), h(!1), _(null), y(b);
		let i = new AbortController(), a = !1;
		return (async () => {
			try {
				let d = await (u ?? globalThis.fetch)(t(o), {
					method: "POST",
					headers: {
						...c,
						"Content-Type": e
					},
					body: JSON.stringify(r(s)),
					signal: i.signal
				});
				if (!d.ok) throw Error(`WatchAction: HTTP ${d.status}`);
				if (!d.body) throw Error("WatchAction: no response body");
				let m = d.body.getReader();
				await n(m, {
					onMessage: (e) => {
						let t = e;
						p((e) => e.length >= f ? [...e.slice(1), t] : [...e, t]), l(t.status) && h(!0);
					},
					onTrailer: (e) => {
						if (e.error) {
							let t = e.error.code ?? "unknown", n = e.error.message ?? "watch error";
							_(`${t}: ${n}`);
						}
						h(!0);
					},
					isDisposed: () => a
				}), m.releaseLock();
			} catch (e) {
				!a && e instanceof Error && e.name !== "AbortError" && (_(e.message), h(!0));
			} finally {
				a || h(!0);
			}
		})(), () => {
			a = !0, i.abort();
		};
	}, [
		o,
		b,
		s?.actionId,
		s?.clientRequestId,
		s?.id
	]), v === b ? {
		updates: d,
		latest: d.length > 0 ? d[d.length - 1] : null,
		done: m,
		error: g
	} : {
		updates: [],
		latest: null,
		done: !1,
		error: null
	};
}
//#endregion
export { p as i, d as n, l as r, u as t };
