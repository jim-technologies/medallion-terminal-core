import { C as e, E as t, T as n, c as r, d as i, h as a, i as o, p as s, x as c } from "./States-Ds3cxTem.js";
import { r as l } from "./utils-j4lJ7S1v.js";
import { r as u } from "./types-Ds11x4VM.js";
import { _ as d, a as f, c as p, d as m, h, i as g, l as _, m as v, n as y, o as b, r as x, s as S, t as C, u as w } from "./sourceError-BwpI_4dr.js";
import { i as T, n as E, r as D } from "./Overlays-_7OI9Emq.js";
import { t as O } from "./NavRail-COtjELlH.js";
import { createContext as k, forwardRef as A, useCallback as j, useContext as M, useEffect as N, useId as ee, useMemo as P, useRef as F, useState as I, useSyncExternalStore as te } from "react";
import { Fragment as L, jsx as R, jsxs as z } from "react/jsx-runtime";
import { createPortal as B } from "react-dom";
//#region src/app/productFetch.ts
var V = "x-request-id", H = "traceparent", ne = "connect-timeout-ms";
function U(e) {
	let t = new Uint8Array(e);
	return globalThis.crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function W() {
	return `00-${U(16)}-${U(8)}-01`;
}
function re() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : U(16);
}
function ie(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function ae(e, t) {
	return (t?.method ?? (e instanceof Request ? e.method : "GET")).toUpperCase();
}
function oe(e, t) {
	let n = t?.body ?? (e instanceof Request ? e.body : null);
	return n instanceof Blob || n instanceof FormData || n instanceof ReadableStream;
}
function se(e, t, n, r) {
	let i = r?.timeoutMs === void 0 ? t.has(ne) || oe(n, r) ? void 0 : e : r.timeoutMs;
	return i && i > 0 ? i : void 0;
}
function ce(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function le(e = {}) {
	let { onUnauthenticated: t, timeoutMs: n, onRequest: r, newRequestId: i = re, newTraceparent: a = W, now: o = () => performance.now() } = e;
	return async function(s, c) {
		let l = e.fetch ?? globalThis.fetch, u = new Headers(c?.headers ?? (s instanceof Request ? s.headers : void 0));
		u.has(V) || u.set(V, i()), u.has(H) || u.set(H, a());
		let d = u.get(V), p = u.get(H), m = c?.signal ?? (s instanceof Request ? s.signal : void 0), h = se(n, u, s, c), g = h ? new AbortController() : void 0, _ = g ? setTimeout(() => g.abort(new DOMException(`No response within ${h} ms`, "TimeoutError")), h) : void 0, v = ae(s, c), y = ie(s), b = o(), x = (e) => r?.({
			method: v,
			url: y,
			requestId: d,
			traceparent: p,
			durationMs: o() - b,
			...e
		}), { timeoutMs: T, ...E } = c ?? {}, D;
		try {
			D = await l(s, {
				...E,
				headers: u,
				signal: ce([m ?? void 0, g?.signal])
			});
		} catch (e) {
			if (m?.aborted) throw e;
			let t = g?.signal.aborted ? new C(`Request timed out after ${h} ms`, {
				kind: "unavailable",
				requestId: d
			}) : ue(w(e), d);
			throw x({ error: t }), t;
		} finally {
			clearTimeout(_);
		}
		if (f(D, d), D.ok) return x({ status: D.status }), D;
		let O = await S(D.clone(), { requestId: d });
		return x({
			status: D.status,
			error: O
		}), D.status === 401 && t?.(O), D;
	};
}
function ue(e, t) {
	return e.requestId ? e : new C(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function de(e) {
	if (e.ok) return e;
	throw await S(e);
}
//#endregion
//#region src/app/router.ts
function G(e) {
	let t = new URL(e, "http://app.local");
	return {
		pathname: t.pathname,
		search: t.search,
		hash: t.hash
	};
}
function fe(e) {
	let t = e.replace(/\/+$/, "");
	return t === "" || t.startsWith("/") ? t : `/${t}`;
}
function pe({ base: e = "", window: t = globalThis.window } = {}) {
	let n = fe(e), r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e()), a = (e) => n && (e === n || e.startsWith(`${n}/`)) ? e.slice(n.length) || "/" : e, o = () => i(), s = (e) => {
		let { pathname: t, search: r, hash: i } = G(e);
		return `${n}${t}${r}${i}`;
	};
	return {
		location() {
			let { pathname: e, search: n, hash: r } = t.location;
			return {
				pathname: a(e),
				search: n,
				hash: r
			};
		},
		navigate(e, n) {
			let r = s(e);
			n?.replace ? t.history.replaceState(null, "", r) : t.history.pushState(null, "", r), i();
		},
		back() {
			t.history.back();
		},
		subscribe(e) {
			return r.size === 0 && t.addEventListener("popstate", o), r.add(e), () => {
				r.delete(e), r.size === 0 && t.removeEventListener("popstate", o);
			};
		},
		href: s
	};
}
function me(e = "/") {
	let t = [G(e)], n = 0, r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e());
	return {
		location: () => t[n],
		navigate(e, r) {
			let a = G(e);
			r?.replace ? t[n] = a : (t.splice(n + 1, t.length, a), n = t.length - 1), i();
		},
		back() {
			n !== 0 && (--n, i());
		},
		subscribe(e) {
			return r.add(e), () => r.delete(e);
		},
		href: (e) => {
			let { pathname: t, search: n, hash: r } = G(e);
			return `${t}${n}${r}`;
		}
	};
}
function K(e, t) {
	let n = e.split("/").filter(Boolean), r = t.split("/").filter(Boolean), i = {};
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		if (t.startsWith("*")) return i[t.slice(1) || "splat"] = r.slice(e).map(decodeURIComponent).join("/"), i;
		let a = r[e];
		if (a === void 0) return null;
		if (t.startsWith(":")) i[t.slice(1)] = decodeURIComponent(a);
		else if (t !== a) return null;
	}
	return r.length === n.length ? i : null;
}
function he(e, t) {
	let n = t;
	return `/${e.split("/").filter(Boolean).map((e) => e.startsWith("*") ? (n[e.slice(1) || "splat"] ?? "").split("/").filter(Boolean).map(encodeURIComponent).join("/") : e.startsWith(":") ? encodeURIComponent(n[e.slice(1)] ?? "") : e).filter(Boolean).join("/")}`;
}
function q(e, t) {
	for (let [n, r] of Object.entries(e)) {
		let e = K(r, t);
		if (e) return {
			id: n,
			params: e
		};
	}
	return null;
}
//#endregion
//#region src/app/routing.tsx
var J = k(null);
function Y({ router: e, children: t }) {
	return /* @__PURE__ */ R(J.Provider, {
		value: e,
		children: t
	});
}
function X() {
	let e = M(J);
	if (!e) throw Error("useRouter must be used inside a RouterProvider or ProductShell");
	return e;
}
function ge(e, t) {
	return e.pathname === t.pathname && e.search === t.search && e.hash === t.hash;
}
function Z() {
	let e = X(), t = P(() => (t) => e.subscribe(t), [e]), n = P(() => {
		let t = e.location();
		return () => {
			let n = e.location();
			return ge(t, n) || (t = n), t;
		};
	}, [e]);
	return te(t, n, n);
}
function _e(e) {
	let { pathname: t } = Z();
	return P(() => q(e, t), [e, t]);
}
var ve = A(function({ to: e, replace: t, onClick: n, ...r }, i) {
	let a = X();
	return /* @__PURE__ */ R("a", {
		...r,
		ref: i,
		href: a.href(e),
		onClick: (i) => {
			n?.(i), !(!u(i) || r.target && r.target !== "_self") && (i.preventDefault(), a.navigate(e, { replace: t }));
		}
	});
});
//#endregion
//#region src/app/session.ts
function ye(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e < 0xe8d4a51000 ? e * 1e3 : e;
	if (typeof e == "string" && e !== "") {
		let t = Date.parse(e);
		return Number.isNaN(t) ? void 0 : t;
	}
}
function be(e) {
	let t = e && typeof e == "object" ? e : {}, n = (e, n) => {
		let r = t[e] ?? t[n];
		return typeof r == "string" && r !== "" ? r : void 0;
	};
	return {
		authenticated: t.authenticated === !0,
		subject: n("subject", "sub"),
		displayName: n("displayName", "display_name"),
		workspaceId: n("workspaceId", "workspace_id"),
		expiresAt: ye(t.expiresAt ?? t.expires_at),
		signInUrl: n("signInUrl", "sign_in_url")
	};
}
function xe({ sessionUrl: e = "/auth/session", fetch: t, renew: n, signInHref: r, assign: i = (e) => globalThis.location.assign(e), signOut: a }) {
	let o = async (n) => {
		let r = await (t ?? globalThis.fetch)(e, {
			credentials: "same-origin",
			headers: { accept: "application/json" },
			signal: n
		});
		if (r.status === 401) return { authenticated: !1 };
		if (!r.ok) throw Error(`Session check failed: HTTP ${r.status}`);
		return be(await r.json());
	};
	return {
		load: o,
		async renew() {
			await n();
			let e = await o();
			if (!e.authenticated) throw Error("Session renewal did not sign in");
			return e;
		},
		signIn(e, t) {
			let n = r ? r(e, t) : t?.signInUrl && `${t.signInUrl}${t.signInUrl.includes("?") ? "&" : "?"}return_to=${encodeURIComponent(e)}`;
			n && i(n);
		},
		signOut: a
	};
}
var Se = "mtc:session-renewed", Ce = "mtc:session-renew-failed";
function we({ url: e, origin: t, timeoutMs: n = 15e3, window: r = globalThis.window }) {
	let i = t ?? r.location.origin;
	return new Promise((t, a) => {
		let o = r.document.createElement("iframe");
		o.hidden = !0, o.title = "Session renewal", o.setAttribute("aria-hidden", "true");
		let s = (e) => {
			r.removeEventListener("message", c), clearTimeout(l), o.remove(), e ? a(e) : t();
		}, c = (e) => {
			if (e.origin !== i || e.source !== o.contentWindow) return;
			let t = e.data?.type;
			t === "mtc:session-renewed" ? s() : t === "mtc:session-renew-failed" && s(/* @__PURE__ */ Error("Session renewal was refused"));
		}, l = setTimeout(() => s(/* @__PURE__ */ Error("Session renewal timed out")), n);
		r.addEventListener("message", c), o.src = e, r.document.body.appendChild(o);
	});
}
//#endregion
//#region src/app/useSessionController.ts
var Te = 6e4;
function Ee(e, t = {}) {
	let n = t.now ?? Date.now, r = t.document ?? (typeof document > "u" ? void 0 : document), [i, a] = I(e ? "loading" : "authenticated"), [o, s] = I(null), c = F(null), l = j(() => {
		if (!e) return Promise.resolve(!0);
		if (c.current) return c.current;
		let t = e.renew().then((e) => (s(e), a("authenticated"), !0), () => (a("expired"), !1)).finally(() => {
			c.current = null;
		});
		return c.current = t, t;
	}, [e]);
	return N(() => {
		if (!e) return;
		let t = new AbortController();
		return e.load(t.signal).then((e) => {
			t.signal.aborted || (s(e), a(e.authenticated ? "authenticated" : "signed-out"));
		}, () => {
			t.signal.aborted || a("signed-out");
		}), () => t.abort();
	}, [e]), N(() => {
		if (!e || i !== "authenticated" || !o?.expiresAt || !r) return;
		let t = o.expiresAt, a, s = () => {
			if (clearTimeout(a), r.hidden) return;
			let e = t - Te - n();
			e <= 0 ? l() : a = setTimeout(() => void l(), e);
		};
		return s(), r.addEventListener("visibilitychange", s), () => {
			clearTimeout(a), r.removeEventListener("visibilitychange", s);
		};
	}, [
		e,
		i,
		o?.expiresAt,
		r,
		n,
		l
	]), {
		status: i,
		session: o,
		renew: l,
		reportUnauthenticated: j(() => {
			l();
		}, [l])
	};
}
//#endregion
//#region src/app/telemetry.ts
function De(e) {
	try {
		return new URL(e, "http://app.local").pathname;
	} catch {
		return e.split("?")[0] ?? e;
	}
}
function Oe(e) {
	return (t) => e.record({
		type: "request",
		method: t.method,
		path: De(t.url),
		status: t.status,
		code: t.error ? t.error.code ?? t.error.kind : void 0,
		requestId: t.requestId,
		durationMs: Math.round(t.durationMs)
	});
}
//#endregion
//#region src/app/embed.ts
var ke = /* @__PURE__ */ new Set([
	"dark",
	"light",
	"operator",
	"high-contrast"
]);
function Ae(e) {
	if (!e || typeof e != "object") return null;
	let t = e;
	return t.version === 1 ? t.type === "mtc:navigate" ? typeof t.path == "string" && t.path.startsWith("/") && !t.path.startsWith("//") ? {
		type: "mtc:navigate",
		version: 1,
		path: t.path
	} : null : t.type === "mtc:init" ? {
		type: "mtc:init",
		version: 1,
		theme: typeof t.theme == "string" && ke.has(t.theme) ? t.theme : void 0,
		locale: typeof t.locale == "string" ? t.locale : void 0,
		timeZone: typeof t.timeZone == "string" ? t.timeZone : void 0
	} : null : null;
}
function je({ allowedOrigins: e, window: t = globalThis.window }) {
	let n = null;
	try {
		n = t.document.referrer ? new URL(t.document.referrer).origin : null;
	} catch {
		n = null;
	}
	let r = t.parent !== t && n && e.includes(n) ? n : null;
	return {
		hostOrigin: r,
		post(e) {
			r && t.parent.postMessage(e, r);
		},
		subscribe(e) {
			let n = (n) => {
				if (!r || n.origin !== r || n.source !== t.parent) return;
				let i = Ae(n.data);
				i && e(i);
			};
			return t.addEventListener("message", n), () => t.removeEventListener("message", n);
		}
	};
}
//#endregion
//#region src/app/OperationsTray.tsx
var Me = {
	queued: "clock",
	running: "spinner",
	succeeded: "success",
	failed: "error",
	cancelled: "close"
}, Q = /* @__PURE__ */ new Set([
	"succeeded",
	"failed",
	"cancelled"
]);
function Ne({ operations: e, title: r, onCancel: o, onRetry: c, onDismiss: u, onClearFinished: d, open: f, defaultOpen: p = !0, onOpenChange: m, placement: h = "floating" }) {
	let g = n(), _ = ee(), v = t(), [y, b] = l({
		value: f,
		defaultValue: p,
		onChange: m
	}), x = F(/* @__PURE__ */ new Map()), [S, C] = I("");
	N(() => {
		let t = e.filter((e) => Q.has(e.status) && x.current.get(e.id) !== e.status);
		x.current = new Map(e.map((e) => [e.id, e.status])), t.length > 0 && C(t.map((e) => `${e.label}: ${g(`ops.status.${e.status}`)}`).join(". "));
	}, [e, g]);
	let w = P(() => {
		let t = {
			queued: 0,
			running: 0,
			succeeded: 0,
			failed: 0,
			cancelled: 0
		};
		for (let n of e) t[n.status] += 1;
		return t;
	}, [e]);
	if (e.length === 0) return null;
	let T = [
		w.running > 0 && g("ops.running", { count: w.running }),
		w.queued > 0 && g("ops.queued", { count: w.queued }),
		w.failed > 0 && g("ops.failed", { count: w.failed }),
		w.succeeded > 0 && g("ops.done", { count: w.succeeded })
	].filter(Boolean).join(" · "), E = e.some((e) => Q.has(e.status)), D = /* @__PURE__ */ z("section", {
		className: "mtc-operations-tray",
		"aria-label": r ?? g("ops.title"),
		"data-open": y || void 0,
		"data-placement": h,
		children: [
			/* @__PURE__ */ R("div", {
				className: "mtc-operations-header",
				children: /* @__PURE__ */ z("button", {
					type: "button",
					className: "mtc-operations-toggle",
					"aria-expanded": y,
					"aria-controls": _,
					onClick: () => b(!y),
					children: [
						/* @__PURE__ */ R(a, {
							name: w.running > 0 ? "spinner" : w.failed > 0 ? "error" : "success",
							className: "mtc-operations-header-icon",
							"data-status": w.running > 0 ? "running" : w.failed > 0 ? "failed" : "succeeded"
						}),
						/* @__PURE__ */ R("span", {
							className: "mtc-operations-title",
							children: r ?? g("ops.title")
						}),
						/* @__PURE__ */ R("span", {
							className: "mtc-operations-summary",
							children: T
						}),
						/* @__PURE__ */ R(a, {
							name: "chevron-down",
							className: "mtc-operations-chevron",
							label: g(y ? "ops.hide" : "ops.show")
						})
					]
				})
			}),
			/* @__PURE__ */ R("span", {
				role: "status",
				className: "mtc-visually-hidden",
				children: S
			}),
			y && /* @__PURE__ */ z(L, { children: [/* @__PURE__ */ R("ul", {
				id: _,
				className: "mtc-operations-list",
				children: e.map((e) => {
					let t = Q.has(e.status), n = e.progress === void 0 ? void 0 : Math.round(Math.min(1, Math.max(0, e.progress)) * 100);
					return /* @__PURE__ */ z("li", {
						className: "mtc-operation",
						"data-status": e.status,
						children: [
							/* @__PURE__ */ R(a, {
								name: Me[e.status],
								className: "mtc-operation-icon",
								label: g(`ops.status.${e.status}`)
							}),
							/* @__PURE__ */ z("div", {
								className: "mtc-operation-main",
								children: [
									/* @__PURE__ */ R("span", {
										className: "mtc-operation-label",
										title: e.label,
										children: e.label
									}),
									e.detail != null && /* @__PURE__ */ R("span", {
										className: "mtc-operation-detail",
										children: e.detail
									}),
									e.status === "running" && /* @__PURE__ */ R("span", {
										className: "mtc-operation-progress",
										role: "progressbar",
										"aria-label": e.label,
										"aria-valuemin": 0,
										"aria-valuemax": 100,
										"aria-valuenow": n,
										children: /* @__PURE__ */ R("span", {
											style: n === void 0 ? void 0 : { width: `${n}%` },
											"data-indeterminate": n === void 0 || void 0
										})
									})
								]
							}),
							/* @__PURE__ */ z("div", {
								className: "mtc-operation-actions",
								children: [
									!t && e.cancellable && o && /* @__PURE__ */ R(s, {
										icon: /* @__PURE__ */ R(a, { name: "close" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.cancel", { label: e.label }),
										onClick: () => o(e.id)
									}),
									e.status === "failed" && e.retryable && c && /* @__PURE__ */ R(s, {
										icon: /* @__PURE__ */ R(a, { name: "refresh" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.retry", { label: e.label }),
										onClick: () => c(e.id)
									}),
									t && u && /* @__PURE__ */ R(s, {
										icon: /* @__PURE__ */ R(a, { name: "minus" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.dismiss", { label: e.label }),
										onClick: () => u(e.id)
									})
								]
							})
						]
					}, e.id);
				})
			}), E && d && /* @__PURE__ */ R("div", {
				className: "mtc-operations-footer",
				children: /* @__PURE__ */ R(i, {
					size: "small",
					variant: "ghost",
					onClick: d,
					children: g("ops.clear")
				})
			})] })
		]
	});
	return h === "floating" && v ? B(D, v) : D;
}
//#endregion
//#region src/app/ProductShell.tsx
var Pe = k(null);
function Fe() {
	let e = M(Pe);
	if (!e) throw Error("useProductShell must be used inside a ProductShell");
	return e;
}
function $(e) {
	let { pathname: t, search: n, hash: r } = e.location();
	return `${t}${n}${r}`;
}
function Ie(t) {
	let { router: n, session: r, telemetry: i, mode: a = "standalone", embedOrigins: o = [], theme: s, density: l, locale: u, timeZone: d, messages: f } = t, p = a === "embed", h = P(() => p && typeof window < "u" ? je({ allowedOrigins: o }) : null, [p]), g = e(), [_, v] = I({}), y = Ee(r);
	N(() => n.subscribe(() => {
		let e = $(n);
		i?.record({
			type: "navigation",
			path: e,
			at: Date.now()
		}), h?.post({
			type: "mtc:navigated",
			version: 1,
			path: e
		});
	}), [
		n,
		i,
		h
	]), N(() => {
		y.status !== "loading" && (i?.record({
			type: "session",
			status: y.status,
			at: Date.now()
		}), y.status === "expired" && h?.post({
			type: "mtc:session-expired",
			version: 1
		}));
	}, [
		y.status,
		i,
		h
	]), N(() => {
		if (!h) return;
		let e = h.subscribe((e) => {
			e.type === "mtc:navigate" ? n.navigate(e.path) : v({
				theme: e.theme,
				locale: e.locale,
				timeZone: e.timeZone
			});
		});
		return h.post({
			type: "mtc:ready",
			version: 1,
			product: t.product.name,
			path: $(n)
		}), e;
	}, [
		h,
		n,
		t.product.name
	]);
	let b = P(() => ({
		router: n,
		session: y,
		telemetry: i,
		embedded: p
	}), [
		n,
		y,
		i,
		p
	]);
	return /* @__PURE__ */ R(c, {
		theme: _.theme ?? s ?? g?.theme ?? "dark",
		density: l ?? g?.density,
		locale: _.locale ?? u,
		timeZone: _.timeZone ?? d,
		messages: f,
		className: "mtc-product-shell-root",
		children: /* @__PURE__ */ R(Y, {
			router: n,
			children: /* @__PURE__ */ R(Pe.Provider, {
				value: b,
				children: /* @__PURE__ */ R(m, { children: p ? /* @__PURE__ */ R(Ve, {
					channel: h,
					...t,
					session: r,
					controller: y
				}) : /* @__PURE__ */ R(Be, {
					...t,
					session: r,
					controller: y
				}) })
			})
		})
	});
}
function Le({ controller: e, session: t, router: n, children: i }) {
	return e.status === "loading" ? /* @__PURE__ */ R(o, {}) : e.status === "signed-out" ? /* @__PURE__ */ R(r, { onSignIn: t ? () => t.signIn($(n), e.session ?? void 0) : void 0 }) : /* @__PURE__ */ R(L, { children: i });
}
function Re({ controller: e, session: t, router: r }) {
	let a = n(), [o, s] = I(!1);
	if (e.status !== "expired") return null;
	let c = async () => {
		s(!0);
		let n = await e.renew();
		s(!1), n || t?.signIn($(r), e.session ?? void 0);
	};
	return /* @__PURE__ */ R(E, {
		open: !0,
		onOpenChange: () => {},
		title: a("state.sessionExpired.title"),
		dismissible: !1,
		size: "small",
		footer: /* @__PURE__ */ R(i, {
			intent: "primary",
			variant: "solid",
			loading: o,
			onClick: () => void c(),
			children: a("state.sessionExpired.action")
		}),
		children: /* @__PURE__ */ R("p", {
			className: "mtc-shell-expired-text",
			children: a("state.sessionExpired.description")
		})
	});
}
function ze(e) {
	return /* @__PURE__ */ R(Ne, {
		operations: e.operations ?? [],
		onCancel: e.onCancelOperation,
		onRetry: e.onRetryOperation,
		onDismiss: e.onDismissOperation
	});
}
function Be(e) {
	let { product: t, nav: r, activeNavId: i, scope: o, search: c, actions: l, accountMenu: u, status: f, inspector: p, router: m, controller: g, session: _ } = e, y = n(), { pathname: b } = Z(), [x, S] = I(!1), [C, w] = I(!1), [E, k] = I(!1), A = F(null), M = j((e) => {
		e.href && (m.navigate(e.href), w(!1));
	}, [m]), N = P(() => (r ?? []).map((e) => ({
		...e,
		items: e.items.map((e) => ({
			...e,
			href: e.href ? m.href(e.href) : void 0
		}))
	})), [r, m]), ee = i ?? (r ?? []).flatMap((e) => e.items).filter((e) => e.href && (b === e.href || b.startsWith(e.href === "/" ? "/" : `${e.href}/`))).sort((e, t) => (t.href?.length ?? 0) - (e.href?.length ?? 0))[0]?.id, te = (e) => {
		let t = r?.flatMap((e) => e.items).find((t) => t.id === e.id);
		t && M(t);
	}, L = g.session, B = [...u ?? [], ..._?.signOut ? [{
		id: "sign-out",
		label: y("shell.signOut"),
		icon: /* @__PURE__ */ R(a, { name: "sign-out" }),
		onSelect: () => void _.signOut?.()
	}] : []], V = (e) => /* @__PURE__ */ R(O, {
		label: y("shell.navigation"),
		sections: N,
		activeId: ee,
		onNavigate: te,
		collapsed: !e && x,
		onCollapsedChange: e ? void 0 : S,
		className: e ? "mtc-shell-drawer-rail" : "mtc-shell-rail"
	});
	return /* @__PURE__ */ z("div", {
		className: "mtc-shell",
		"data-inspector": p ? "open" : void 0,
		"data-rail": r ? x ? "collapsed" : "expanded" : "none",
		children: [
			/* @__PURE__ */ R("a", {
				className: "mtc-shell-skip",
				href: "#mtc-main",
				onClick: (e) => {
					e.preventDefault(), A.current?.focus();
				},
				children: y("shell.skip")
			}),
			/* @__PURE__ */ z("header", {
				className: "mtc-shell-topbar",
				children: [
					r && /* @__PURE__ */ R(s, {
						icon: /* @__PURE__ */ R(a, { name: "menu" }),
						"aria-label": y("shell.menu"),
						variant: "ghost",
						className: "mtc-shell-menu",
						onClick: () => w(!0)
					}),
					/* @__PURE__ */ z("a", {
						className: "mtc-shell-product",
						href: m.href(t.home ?? "/"),
						onClick: (e) => {
							e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || (e.preventDefault(), m.navigate(t.home ?? "/"));
						},
						children: [/* @__PURE__ */ R("span", {
							className: "mtc-shell-mark",
							"aria-hidden": "true",
							children: /* @__PURE__ */ R(a, { name: t.icon ?? "object" })
						}), /* @__PURE__ */ R("span", { children: t.name })]
					}),
					o && /* @__PURE__ */ R("div", {
						className: "mtc-shell-scope",
						children: o
					}),
					c && /* @__PURE__ */ z("button", {
						type: "button",
						className: "mtc-shell-search",
						onClick: () => k(!0),
						children: [
							/* @__PURE__ */ R(a, { name: "search" }),
							/* @__PURE__ */ R("span", {
								className: "mtc-shell-search-text",
								children: c.placeholder ?? y("shell.search")
							}),
							/* @__PURE__ */ R(d, {
								"aria-hidden": "true",
								children: "Ctrl K"
							})
						]
					}),
					/* @__PURE__ */ z("div", {
						className: "mtc-shell-actions",
						children: [l, L?.authenticated && /* @__PURE__ */ R(T, {
							label: y("shell.account"),
							align: "end",
							trigger: /* @__PURE__ */ R(h, {
								name: L.displayName ?? L.subject ?? "?",
								decorative: !0
							}),
							items: B.length > 0 ? B : [{
								id: "who",
								label: L.displayName ?? L.subject ?? "",
								disabled: !0
							}]
						})]
					})
				]
			}),
			r && /* @__PURE__ */ R("div", {
				className: "mtc-shell-rail-slot",
				children: V(!1)
			}),
			/* @__PURE__ */ R("main", {
				id: "mtc-main",
				ref: A,
				tabIndex: -1,
				className: "mtc-shell-main",
				children: /* @__PURE__ */ R(Le, { ...e })
			}),
			p && /* @__PURE__ */ R("aside", {
				className: "mtc-shell-inspector",
				children: p
			}),
			/* @__PURE__ */ R("footer", {
				className: "mtc-shell-status",
				children: f
			}),
			r && /* @__PURE__ */ R(D, {
				open: C,
				onOpenChange: w,
				title: t.name,
				side: "left",
				width: 288,
				className: "mtc-shell-drawer",
				children: V(!0)
			}),
			c && /* @__PURE__ */ R(v, {
				open: E,
				onOpenChange: k,
				query: c.query,
				onQueryChange: c.onQueryChange,
				groups: c.groups,
				onSelect: c.onSelect,
				loading: c.loading,
				placeholder: c.placeholder
			}),
			/* @__PURE__ */ R(ze, { ...e }),
			/* @__PURE__ */ R(Re, { ...e })
		]
	});
}
function Ve(e) {
	let { channel: t } = e, n = F(null);
	return N(() => {
		let e = n.current;
		if (!e || !t || typeof ResizeObserver > "u") return;
		let r = -1, i = new ResizeObserver(() => {
			let n = Math.ceil(e.scrollHeight);
			n !== r && (r = n, t.post({
				type: "mtc:resize",
				version: 1,
				height: n
			}));
		});
		return i.observe(e), () => i.disconnect();
	}, [t]), /* @__PURE__ */ z("div", {
		ref: n,
		className: "mtc-shell-embedded",
		children: [
			/* @__PURE__ */ R("main", {
				id: "mtc-main",
				className: "mtc-shell-main",
				children: /* @__PURE__ */ R(Le, { ...e })
			}),
			/* @__PURE__ */ R(ze, { ...e }),
			/* @__PURE__ */ R(Re, { ...e })
		]
	});
}
//#endregion
export { Ne as OperationsTray, Ie as ProductShell, Te as RENEW_LEAD_MS, ve as RouterLink, Y as RouterProvider, Se as SESSION_RENEWED, Ce as SESSION_RENEW_FAILED, C as SourceError, he as buildPath, je as createEmbedChannel, pe as createHistoryRouter, xe as createHttpSessionPort, me as createMemoryRouter, le as createProductFetch, y as describeSourceError, de as ensureOk, x as isSourceError, K as matchPath, q as matchRoutes, W as newTraceparent, Ae as parseEmbedHostMessage, g as parseRetryAfter, be as parseSessionBody, we as renewViaFrame, Oe as requestTelemetry, b as responseRequestId, S as sourceErrorFromResponse, p as sourceErrorKindForCode, _ as sourceErrorKindForStatus, w as toSourceError, Z as useLocation, Fe as useProductShell, _e as useRoute, X as useRouter, Ee as useSessionController };
