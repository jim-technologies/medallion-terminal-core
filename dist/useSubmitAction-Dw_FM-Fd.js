import { n as e } from "./DashboardContext-65LG4CII.js";
import { a as t, c as n, t as r } from "./resolveSource-D7AiNCce.js";
import { i, n as a, r as o, t as s } from "./useWatchAction-BA_2h6mG.js";
import { useCallback as c, useEffect as l, useRef as u, useState as d } from "react";
//#region src/hooks/useSubmitAction.ts
function f(f) {
	let { backendUrl: p, backendHeaders: m, emit: h, requestRefresh: g, toast: _ } = e(), [v, y] = d(!1), [b, x] = d(null), [S, C] = d(null), w = u(""), T = u(!1), E = i(p, b ? { clientRequestId: b.clientRequestId } : null, m), D = c((e, t) => {
		if (C(e), h({
			type: "action",
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}), !e.terminal) return;
		let n = s(e.status);
		(n || t.announce) && _(e.message ?? (n ? `${e.actionId} failed` : t.successMessage ?? `${e.actionId} completed`), n ? "error" : "ok"), !n && t.refresh && g(t.refreshTarget), x(null), y(!1), T.current = !1, t.onComplete?.(e);
	}, [
		h,
		g,
		_
	]);
	return l(() => {
		if (!b) return;
		if (E.error) {
			let e = `${b.clientRequestId}:error:${E.error}`;
			if (e === w.current) return;
			w.current = e, D({
				id: E.latest?.id ?? "",
				actionId: E.latest?.action_id || b.actionId,
				clientRequestId: E.latest?.client_request_id || b.clientRequestId,
				status: "ACTION_STATUS_FAILED",
				message: E.error,
				terminal: !0
			}, b);
			return;
		}
		let e = E.latest;
		if (e) {
			let t = `${b.clientRequestId}:${e.sequence}:${e.status}`;
			if (t !== w.current) {
				w.current = t;
				let n = o(e.status) || a(e.status), r = !a(e.status);
				if (D({
					id: e.id,
					actionId: e.action_id || b.actionId,
					clientRequestId: e.client_request_id || b.clientRequestId,
					status: n ? e.status : "ACTION_STATUS_FAILED",
					message: n ? e.message ?? e.status_detail : `WatchAction returned invalid status ${JSON.stringify(e.status)}`,
					data: e.data,
					terminal: r
				}, b), r) return;
			} else if (!a(e.status)) return;
		}
		if (!E.done) return;
		let t = `${b.clientRequestId}:ended-without-terminal`;
		t !== w.current && (w.current = t, D({
			id: e?.id ?? "",
			actionId: e?.action_id || b.actionId,
			clientRequestId: e?.client_request_id || b.clientRequestId,
			status: "ACTION_STATUS_FAILED",
			message: "WatchAction ended before a terminal status",
			terminal: !0
		}, b));
	}, [
		b,
		D,
		E.done,
		E.error,
		E.latest
	]), {
		submit: c(async (e) => {
			if (T.current) return null;
			let i = e.actionId.trim();
			if (!i) return _("actionId is required", "error"), null;
			if (p === void 0) return _("This action requires backendUrl", "error"), null;
			T.current = !0;
			let s = n(), c = {
				actionId: i,
				clientRequestId: s,
				successMessage: e.successMessage,
				refresh: e.refresh !== !1,
				refreshTarget: e.refreshTarget ?? f ?? "*",
				announce: e.announce !== !1,
				onComplete: e.onComplete
			};
			y(!0), C(null), w.current = "";
			try {
				let n = await fetch(t(p), {
					method: "POST",
					headers: {
						...m,
						"Content-Type": "application/json"
					},
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
				return f.terminal ? D(f, c) : (C(f), h({
					type: "action",
					actionId: f.actionId,
					clientRequestId: s,
					status: u,
					message: f.message,
					terminal: !1
				}), x(c)), f;
			} catch (e) {
				let t = {
					id: "",
					actionId: i,
					clientRequestId: s,
					status: "ACTION_STATUS_FAILED",
					message: e instanceof Error ? e.message : "Action failed",
					terminal: !0
				};
				return D(t, c), t;
			}
		}, [
			p,
			m,
			h,
			D,
			_,
			f
		]),
		submitting: v || b != null,
		activeActionId: b?.actionId ?? null,
		result: S
	};
}
//#endregion
export { f as t };
