import { At as e, Dt as t, bt as n, wt as r } from "./MultiDashboard-Bjz3MEGT.js";
import { i, n as a, r as o, t as s } from "./useWatchAction-DQl9DGJs.js";
import { useCallback as c, useEffect as l, useRef as u, useState as d } from "react";
//#region src/hooks/useSubmitAction.ts
function f(f) {
	let { backendUrl: p, backendHeaders: m, fetch: h, emit: g, requestRefresh: _, toast: v } = e(), [y, b] = d(!1), [x, S] = d(null), [C, w] = d(null), T = u(""), E = u(!1), D = i(p, x ? { clientRequestId: x.clientRequestId } : null, m, h), O = c((e, t) => {
		if (w(e), g({
			type: "action",
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}), !e.terminal) return;
		let n = s(e.status);
		(n || t.announce) && v(e.message ?? (n ? `${e.actionId} failed` : t.successMessage ?? `${e.actionId} completed`), n ? "error" : "ok"), !n && t.refresh && _(t.refreshTarget), S(null), b(!1), E.current = !1, t.onComplete?.(e);
	}, [
		g,
		_,
		v
	]);
	return l(() => {
		if (!x) return;
		if (D.error) {
			let e = `${x.clientRequestId}:error:${D.error}`;
			if (e === T.current) return;
			T.current = e, O({
				id: D.latest?.id ?? "",
				actionId: D.latest?.action_id || x.actionId,
				clientRequestId: D.latest?.client_request_id || x.clientRequestId,
				status: "ACTION_STATUS_FAILED",
				message: D.error,
				terminal: !0
			}, x);
			return;
		}
		let e = D.latest;
		if (e) {
			let t = `${x.clientRequestId}:${e.sequence}:${e.status}`;
			if (t !== T.current) {
				T.current = t;
				let n = o(e.status) || a(e.status), r = !a(e.status);
				if (O({
					id: e.id,
					actionId: e.action_id || x.actionId,
					clientRequestId: e.client_request_id || x.clientRequestId,
					status: n ? e.status : "ACTION_STATUS_FAILED",
					message: n ? e.message ?? e.status_detail : `WatchAction returned invalid status ${JSON.stringify(e.status)}`,
					data: e.data,
					terminal: r
				}, x), r) return;
			} else if (!a(e.status)) return;
		}
		if (!D.done) return;
		let t = `${x.clientRequestId}:ended-without-terminal`;
		t !== T.current && (T.current = t, O({
			id: e?.id ?? "",
			actionId: e?.action_id || x.actionId,
			clientRequestId: e?.client_request_id || x.clientRequestId,
			status: "ACTION_STATUS_FAILED",
			message: "WatchAction ended before a terminal status",
			terminal: !0
		}, x));
	}, [
		x,
		O,
		D.done,
		D.error,
		D.latest
	]), {
		submit: c(async (e) => {
			if (E.current) return null;
			let i = e.actionId.trim();
			if (!i) return v("actionId is required", "error"), null;
			if (p === void 0) return v("This action requires backendUrl", "error"), null;
			E.current = !0;
			let s = t(), c = {
				actionId: i,
				clientRequestId: s,
				successMessage: e.successMessage,
				refresh: e.refresh !== !1,
				refreshTarget: e.refreshTarget ?? f ?? "*",
				announce: e.announce !== !1,
				onComplete: e.onComplete
			};
			b(!0), w(null), T.current = "";
			try {
				let t = await (h ?? globalThis.fetch)(r(p), {
					method: "POST",
					headers: {
						...m,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(n({
						actionId: i,
						params: e.params,
						clientRequestId: s
					}))
				});
				if (!t.ok) throw Error(`SubmitAction: HTTP ${t.status}`);
				let l = await t.json(), u = l.status || "ACTION_STATUS_FAILED", d = o(u) || a(u), f = {
					id: l.id ?? "",
					actionId: i,
					clientRequestId: s,
					status: d ? u : "ACTION_STATUS_FAILED",
					message: d ? l.message : l.message ?? `SubmitAction returned invalid status ${JSON.stringify(u)}`,
					data: l.data,
					terminal: !a(u)
				};
				return f.terminal ? O(f, c) : (w(f), g({
					type: "action",
					actionId: f.actionId,
					clientRequestId: s,
					status: u,
					message: f.message,
					terminal: !1
				}), S(c)), f;
			} catch (e) {
				let t = {
					id: "",
					actionId: i,
					clientRequestId: s,
					status: "ACTION_STATUS_FAILED",
					message: e instanceof Error ? e.message : "Action failed",
					terminal: !0
				};
				return O(t, c), t;
			}
		}, [
			p,
			m,
			h,
			g,
			O,
			v,
			f
		]),
		submitting: y || x != null,
		activeActionId: x?.actionId ?? null,
		result: C
	};
}
//#endregion
export { f as t };
