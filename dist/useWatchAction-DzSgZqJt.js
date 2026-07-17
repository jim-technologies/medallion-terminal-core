import { n as e, t } from "./connectFraming-C7uFpPlK.js";
import { n, o as r } from "./resolveSource-BZ3Z0pkp.js";
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
function p(o, s) {
	let [c, u] = a([]), [d, p] = a(!1), [m, h] = a(null), [g, _] = a(""), v = s ? JSON.stringify([
		o,
		s.clientRequestId,
		s.id,
		s.actionId
	]) : "";
	return i(() => {
		if (o === void 0 || !s || !(s.clientRequestId || s.id || s.actionId)) return;
		u([]), p(!1), h(null), _(v);
		let i = new AbortController(), a = !1;
		return (async () => {
			try {
				let c = await fetch(r(o), {
					method: "POST",
					headers: { "Content-Type": t },
					body: JSON.stringify(n(s)),
					signal: i.signal
				});
				if (!c.ok) throw Error(`WatchAction: HTTP ${c.status}`);
				if (!c.body) throw Error("WatchAction: no response body");
				let d = c.body.getReader();
				await e(d, {
					onMessage: (e) => {
						let t = e;
						u((e) => e.length >= f ? [...e.slice(1), t] : [...e, t]), l(t.status) && p(!0);
					},
					onTrailer: (e) => {
						if (e.error) {
							let t = e.error.code ?? "unknown", n = e.error.message ?? "watch error";
							h(`${t}: ${n}`);
						}
						p(!0);
					},
					isDisposed: () => a
				}), d.releaseLock();
			} catch (e) {
				!a && e instanceof Error && e.name !== "AbortError" && (h(e.message), p(!0));
			} finally {
				a || p(!0);
			}
		})(), () => {
			a = !0, i.abort();
		};
	}, [
		o,
		v,
		s?.actionId,
		s?.clientRequestId,
		s?.id
	]), g === v ? {
		updates: c,
		latest: c.length > 0 ? c[c.length - 1] : null,
		done: d,
		error: m
	} : {
		updates: [],
		latest: null,
		done: !1,
		error: null
	};
}
//#endregion
export { p as i, d as n, l as r, u as t };
