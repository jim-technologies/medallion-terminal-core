import { n as e } from "./DashboardContext-BKgLoCrb.js";
import { a as t, c as n, t as r } from "./resolveSource-BZ3Z0pkp.js";
import { i, n as a, r as o, t as s } from "./useWatchAction-DzSgZqJt.js";
import { useCallback as c, useEffect as l, useRef as u, useState as d } from "react";
//#region src/hooks/useSubmitAction.ts
function f(f) {
	let { backendUrl: p, emit: m, requestRefresh: h, toast: g } = e(), [_, v] = d(!1), [y, b] = d(null), [x, S] = d(null), C = u(""), w = u(!1), T = i(p, y ? { clientRequestId: y.clientRequestId } : null), E = c((e, t) => {
		if (S(e), m({
			type: "action",
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}), !e.terminal) return;
		let n = s(e.status);
		(n || t.announce) && g(e.message ?? (n ? `${e.actionId} failed` : t.successMessage ?? `${e.actionId} completed`), n ? "error" : "ok"), !n && t.refresh && h(t.refreshTarget), b(null), v(!1), w.current = !1, t.onComplete?.(e);
	}, [
		m,
		h,
		g
	]);
	return l(() => {
		if (!y) return;
		if (T.error) {
			let e = `${y.clientRequestId}:error:${T.error}`;
			if (e === C.current) return;
			C.current = e, E({
				id: T.latest?.id ?? "",
				actionId: T.latest?.action_id || y.actionId,
				clientRequestId: T.latest?.client_request_id || y.clientRequestId,
				status: "ACTION_STATUS_FAILED",
				message: T.error,
				terminal: !0
			}, y);
			return;
		}
		let e = T.latest;
		if (e) {
			let t = `${y.clientRequestId}:${e.sequence}:${e.status}`;
			if (t !== C.current) {
				C.current = t;
				let n = o(e.status) || a(e.status), r = !a(e.status);
				if (E({
					id: e.id,
					actionId: e.action_id || y.actionId,
					clientRequestId: e.client_request_id || y.clientRequestId,
					status: n ? e.status : "ACTION_STATUS_FAILED",
					message: n ? e.message ?? e.status_detail : `WatchAction returned invalid status ${JSON.stringify(e.status)}`,
					data: e.data,
					terminal: r
				}, y), r) return;
			} else if (!a(e.status)) return;
		}
		if (!T.done) return;
		let t = `${y.clientRequestId}:ended-without-terminal`;
		t !== C.current && (C.current = t, E({
			id: e?.id ?? "",
			actionId: e?.action_id || y.actionId,
			clientRequestId: e?.client_request_id || y.clientRequestId,
			status: "ACTION_STATUS_FAILED",
			message: "WatchAction ended before a terminal status",
			terminal: !0
		}, y));
	}, [
		y,
		E,
		T.done,
		T.error,
		T.latest
	]), {
		submit: c(async (e) => {
			if (w.current) return null;
			let i = e.actionId.trim();
			if (!i) return g("actionId is required", "error"), null;
			if (p === void 0) return g("This action requires backendUrl", "error"), null;
			w.current = !0;
			let s = n(), c = {
				actionId: i,
				clientRequestId: s,
				successMessage: e.successMessage,
				refresh: e.refresh !== !1,
				refreshTarget: e.refreshTarget ?? f ?? "*",
				announce: e.announce !== !1,
				onComplete: e.onComplete
			};
			v(!0), S(null), C.current = "";
			try {
				let n = await fetch(t(p), {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(r({
						actionId: i,
						params: e.params,
						clientRequestId: s
					}))
				});
				if (!n.ok) throw Error(`SubmitAction: HTTP ${n.status}`);
				let l = await n.json(), u = l.status || "ACTION_STATUS_FAILED", d = o(u) || a(u), f = {
					id: l.id ?? "",
					actionId: i,
					clientRequestId: s,
					status: d ? u : "ACTION_STATUS_FAILED",
					message: d ? l.message : l.message ?? `SubmitAction returned invalid status ${JSON.stringify(u)}`,
					data: l.data,
					terminal: !a(u)
				};
				return f.terminal ? E(f, c) : (S(f), m({
					type: "action",
					actionId: f.actionId,
					clientRequestId: s,
					status: u,
					message: f.message,
					terminal: !1
				}), b(c)), f;
			} catch (e) {
				let t = {
					id: "",
					actionId: i,
					clientRequestId: s,
					status: "ACTION_STATUS_FAILED",
					message: e instanceof Error ? e.message : "Action failed",
					terminal: !0
				};
				return E(t, c), t;
			}
		}, [
			p,
			m,
			E,
			g,
			f
		]),
		submitting: _ || y != null,
		activeActionId: y?.actionId ?? null,
		result: x
	};
}
//#endregion
export { f as t };
