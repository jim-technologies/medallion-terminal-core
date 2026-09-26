import { C as e, E as t, T as n, c as r, d as i, h as a, i as o, p as s, x as c } from "./States-Ds3cxTem.js";
import { r as l } from "./utils-j4lJ7S1v.js";
import { a as u, d, i as f, o as p } from "./types-DjTHxOgh.js";
import { _ as m, a as h, c as g, d as _, h as v, i as y, l as b, m as x, n as S, o as C, r as w, s as T, t as E, u as D } from "./sourceError-BwpI_4dr.js";
import { t as O } from "./NavRail-CJR5DthP.js";
import { createContext as k, forwardRef as A, useCallback as j, useContext as M, useEffect as N, useId as ee, useMemo as P, useRef as F, useState as I, useSyncExternalStore as L } from "react";
import { Fragment as R, jsx as z, jsxs as B } from "react/jsx-runtime";
import { createPortal as V } from "react-dom";
//#region src/app/productFetch.ts
var H = "x-request-id", U = "traceparent", te = "connect-timeout-ms";
function W(e) {
	let t = new Uint8Array(e);
	return globalThis.crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function G() {
	return `00-${W(16)}-${W(8)}-01`;
}
function ne() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : W(16);
}
function re(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function ie(e, t) {
	return (t?.method ?? (e instanceof Request ? e.method : "GET")).toUpperCase();
}
function ae(e, t) {
	let n = t?.body ?? (e instanceof Request ? e.body : null);
	return n instanceof Blob || n instanceof FormData || n instanceof ReadableStream;
}
function oe(e, t, n, r) {
	let i = r?.timeoutMs === void 0 ? t.has(te) || ae(n, r) ? void 0 : e : r.timeoutMs;
	return i && i > 0 ? i : void 0;
}
function se(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function ce(e = {}) {
	let { onUnauthenticated: t, timeoutMs: n, onRequest: r, newRequestId: i = ne, newTraceparent: a = G, now: o = () => performance.now() } = e;
	return async function(s, c) {
		let l = e.fetch ?? globalThis.fetch, u = new Headers(c?.headers ?? (s instanceof Request ? s.headers : void 0));
		u.has(H) || u.set(H, i()), u.has(U) || u.set(U, a());
		let d = u.get(H), f = u.get(U), p = c?.signal ?? (s instanceof Request ? s.signal : void 0), m = oe(n, u, s, c), g = m ? new AbortController() : void 0, _ = g ? setTimeout(() => g.abort(new DOMException(`No response within ${m} ms`, "TimeoutError")), m) : void 0, v = ie(s, c), y = re(s), b = o(), x = (e) => r?.({
			method: v,
			url: y,
			requestId: d,
			traceparent: f,
			durationMs: o() - b,
			...e
		}), { timeoutMs: S, ...C } = c ?? {}, w;
		try {
			w = await l(s, {
				...C,
				headers: u,
				signal: se([p ?? void 0, g?.signal])
			});
		} catch (e) {
			if (p?.aborted) throw e;
			let t = g?.signal.aborted ? new E(`Request timed out after ${m} ms`, {
				kind: "unavailable",
				requestId: d
			}) : le(D(e), d);
			throw x({ error: t }), t;
		} finally {
			clearTimeout(_);
		}
		if (h(w, d), w.ok) return x({ status: w.status }), w;
		let O = await T(w.clone(), { requestId: d });
		return x({
			status: w.status,
			error: O
		}), w.status === 401 && t?.(O), w;
	};
}
function le(e, t) {
	return e.requestId ? e : new E(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function ue(e) {
	if (e.ok) return e;
	throw await T(e);
}
//#endregion
//#region src/app/router.ts
function K(e) {
	let t = new URL(e, "http://app.local");
	return {
		pathname: t.pathname,
		search: t.search,
		hash: t.hash
	};
}
function de(e) {
	let t = e.replace(/\/+$/, "");
	return t === "" || t.startsWith("/") ? t : `/${t}`;
}
function fe({ base: e = "", window: t = globalThis.window } = {}) {
	let n = de(e), r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e()), a = (e) => n && (e === n || e.startsWith(`${n}/`)) ? e.slice(n.length) || "/" : e, o = () => i(), s = (e) => {
		let { pathname: t, search: r, hash: i } = K(e);
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
function pe(e = "/") {
	let t = [K(e)], n = 0, r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e());
	return {
		location: () => t[n],
		navigate(e, r) {
			let a = K(e);
			r?.replace ? t[n] = a : (t.splice(n + 1, t.length, a), n = t.length - 1), i();
		},
		back() {
			n !== 0 && (--n, i());
		},
		subscribe(e) {
			return r.add(e), () => r.delete(e);
		},
		href: (e) => {
			let { pathname: t, search: n, hash: r } = K(e);
			return `${t}${n}${r}`;
		}
	};
}
function q(e, t) {
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
function me(e, t) {
	let n = t;
	return `/${e.split("/").filter(Boolean).map((e) => e.startsWith("*") ? (n[e.slice(1) || "splat"] ?? "").split("/").filter(Boolean).map(encodeURIComponent).join("/") : e.startsWith(":") ? encodeURIComponent(n[e.slice(1)] ?? "") : e).filter(Boolean).join("/")}`;
}
function J(e, t) {
	for (let [n, r] of Object.entries(e)) {
		let e = q(r, t);
		if (e) return {
			id: n,
			params: e
		};
	}
	return null;
}
//#endregion
//#region src/app/routing.tsx
var Y = k(null);
function he({ router: e, children: t }) {
	return /* @__PURE__ */ z(Y.Provider, {
		value: e,
		children: t
	});
}
function X() {
	let e = M(Y);
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
	return L(t, n, n);
}
function _e(e) {
	let { pathname: t } = Z();
	return P(() => J(e, t), [e, t]);
}
var ve = A(function({ to: e, replace: t, onClick: n, ...r }, i) {
	let a = X();
	return /* @__PURE__ */ z("a", {
		...r,
		ref: i,
		href: a.href(e),
		onClick: (i) => {
			n?.(i), !(!d(i) || r.target && r.target !== "_self") && (i.preventDefault(), a.navigate(e, { replace: t }));
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
	].filter(Boolean).join(" · "), E = e.some((e) => Q.has(e.status)), D = /* @__PURE__ */ B("section", {
		className: "mtc-operations-tray",
		"aria-label": r ?? g("ops.title"),
		"data-open": y || void 0,
		"data-placement": h,
		children: [
			/* @__PURE__ */ z("div", {
				className: "mtc-operations-header",
				children: /* @__PURE__ */ B("button", {
					type: "button",
					className: "mtc-operations-toggle",
					"aria-expanded": y,
					"aria-controls": _,
					onClick: () => b(!y),
					children: [
						/* @__PURE__ */ z(a, {
							name: w.running > 0 ? "spinner" : w.failed > 0 ? "error" : "success",
							className: "mtc-operations-header-icon",
							"data-status": w.running > 0 ? "running" : w.failed > 0 ? "failed" : "succeeded"
						}),
						/* @__PURE__ */ z("span", {
							className: "mtc-operations-title",
							children: r ?? g("ops.title")
						}),
						/* @__PURE__ */ z("span", {
							className: "mtc-operations-summary",
							children: T
						}),
						/* @__PURE__ */ z(a, {
							name: "chevron-down",
							className: "mtc-operations-chevron",
							label: g(y ? "ops.hide" : "ops.show")
						})
					]
				})
			}),
			/* @__PURE__ */ z("span", {
				role: "status",
				className: "mtc-visually-hidden",
				children: S
			}),
			y && /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z("ul", {
				id: _,
				className: "mtc-operations-list",
				children: e.map((e) => {
					let t = Q.has(e.status), n = e.progress === void 0 ? void 0 : Math.round(Math.min(1, Math.max(0, e.progress)) * 100);
					return /* @__PURE__ */ B("li", {
						className: "mtc-operation",
						"data-status": e.status,
						children: [
							/* @__PURE__ */ z(a, {
								name: Me[e.status],
								className: "mtc-operation-icon",
								label: g(`ops.status.${e.status}`)
							}),
							/* @__PURE__ */ B("div", {
								className: "mtc-operation-main",
								children: [
									/* @__PURE__ */ z("span", {
										className: "mtc-operation-label",
										title: e.label,
										children: e.label
									}),
									e.detail != null && /* @__PURE__ */ z("span", {
										className: "mtc-operation-detail",
										children: e.detail
									}),
									e.status === "running" && /* @__PURE__ */ z("span", {
										className: "mtc-operation-progress",
										role: "progressbar",
										"aria-label": e.label,
										"aria-valuemin": 0,
										"aria-valuemax": 100,
										"aria-valuenow": n,
										children: /* @__PURE__ */ z("span", {
											style: n === void 0 ? void 0 : { width: `${n}%` },
											"data-indeterminate": n === void 0 || void 0
										})
									})
								]
							}),
							/* @__PURE__ */ B("div", {
								className: "mtc-operation-actions",
								children: [
									!t && e.cancellable && o && /* @__PURE__ */ z(s, {
										icon: /* @__PURE__ */ z(a, { name: "close" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.cancel", { label: e.label }),
										onClick: () => o(e.id)
									}),
									e.status === "failed" && e.retryable && c && /* @__PURE__ */ z(s, {
										icon: /* @__PURE__ */ z(a, { name: "refresh" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.retry", { label: e.label }),
										onClick: () => c(e.id)
									}),
									t && u && /* @__PURE__ */ z(s, {
										icon: /* @__PURE__ */ z(a, { name: "minus" }),
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
			}), E && d && /* @__PURE__ */ z("div", {
				className: "mtc-operations-footer",
				children: /* @__PURE__ */ z(i, {
					size: "small",
					variant: "ghost",
					onClick: d,
					children: g("ops.clear")
				})
			})] })
		]
	});
	return h === "floating" && v ? V(D, v) : D;
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
	let { router: n, session: r, telemetry: i, mode: a = "standalone", embedOrigins: o = [], theme: s, density: l, locale: u, timeZone: d, messages: f } = t, p = a === "embed", m = P(() => p && typeof window < "u" ? je({ allowedOrigins: o }) : null, [p]), h = e(), [g, v] = I({}), y = Ee(r);
	N(() => n.subscribe(() => {
		let e = $(n);
		i?.record({
			type: "navigation",
			path: e,
			at: Date.now()
		}), m?.post({
			type: "mtc:navigated",
			version: 1,
			path: e
		});
	}), [
		n,
		i,
		m
	]), N(() => {
		y.status !== "loading" && (i?.record({
			type: "session",
			status: y.status,
			at: Date.now()
		}), y.status === "expired" && m?.post({
			type: "mtc:session-expired",
			version: 1
		}));
	}, [
		y.status,
		i,
		m
	]), N(() => {
		if (!m) return;
		let e = m.subscribe((e) => {
			e.type === "mtc:navigate" ? n.navigate(e.path) : v({
				theme: e.theme,
				locale: e.locale,
				timeZone: e.timeZone
			});
		});
		return m.post({
			type: "mtc:ready",
			version: 1,
			product: t.product.name,
			path: $(n)
		}), e;
	}, [
		m,
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
	return /* @__PURE__ */ z(c, {
		theme: g.theme ?? s ?? h?.theme ?? "dark",
		density: l ?? h?.density,
		locale: g.locale ?? u,
		timeZone: g.timeZone ?? d,
		messages: f,
		className: "mtc-product-shell-root",
		children: /* @__PURE__ */ z(he, {
			router: n,
			children: /* @__PURE__ */ z(Pe.Provider, {
				value: b,
				children: /* @__PURE__ */ z(_, { children: p ? /* @__PURE__ */ z(Ve, {
					channel: m,
					...t,
					session: r,
					controller: y
				}) : /* @__PURE__ */ z(Be, {
					...t,
					session: r,
					controller: y
				}) })
			})
		})
	});
}
function Le({ controller: e, session: t, router: n, children: i }) {
	return e.status === "loading" ? /* @__PURE__ */ z(o, {}) : e.status === "signed-out" ? /* @__PURE__ */ z(r, { onSignIn: t ? () => t.signIn($(n), e.session ?? void 0) : void 0 }) : /* @__PURE__ */ z(R, { children: i });
}
function Re({ controller: e, session: t, router: r }) {
	let a = n(), [o, s] = I(!1);
	if (e.status !== "expired") return null;
	let c = async () => {
		s(!0);
		let n = await e.renew();
		s(!1), n || t?.signIn($(r), e.session ?? void 0);
	};
	return /* @__PURE__ */ z(f, {
		open: !0,
		onOpenChange: () => {},
		title: a("state.sessionExpired.title"),
		dismissible: !1,
		size: "small",
		footer: /* @__PURE__ */ z(i, {
			intent: "primary",
			variant: "solid",
			loading: o,
			onClick: () => void c(),
			children: a("state.sessionExpired.action")
		}),
		children: /* @__PURE__ */ z("p", {
			className: "mtc-shell-expired-text",
			children: a("state.sessionExpired.description")
		})
	});
}
function ze(e) {
	return /* @__PURE__ */ z(Ne, {
		operations: e.operations ?? [],
		onCancel: e.onCancelOperation,
		onRetry: e.onRetryOperation,
		onDismiss: e.onDismissOperation
	});
}
function Be(e) {
	let { product: t, nav: r, activeNavId: i, scope: o, search: c, actions: l, accountMenu: d, status: f, inspector: h, router: g, controller: _, session: y } = e, b = n(), { pathname: S } = Z(), [C, w] = I(!1), [T, E] = I(!1), [D, k] = I(!1), A = F(null), M = j((e) => {
		e.href && (g.navigate(e.href), E(!1));
	}, [g]), N = P(() => (r ?? []).map((e) => ({
		...e,
		items: e.items.map((e) => ({
			...e,
			href: e.href ? g.href(e.href) : void 0
		}))
	})), [r, g]), ee = i ?? (r ?? []).flatMap((e) => e.items).filter((e) => e.href && (S === e.href || S.startsWith(e.href === "/" ? "/" : `${e.href}/`))).sort((e, t) => (t.href?.length ?? 0) - (e.href?.length ?? 0))[0]?.id, L = (e) => {
		let t = r?.flatMap((e) => e.items).find((t) => t.id === e.id);
		t && M(t);
	}, R = _.session, V = [...d ?? [], ...y?.signOut ? [{
		id: "sign-out",
		label: b("shell.signOut"),
		icon: /* @__PURE__ */ z(a, { name: "sign-out" }),
		onSelect: () => void y.signOut?.()
	}] : []], H = (e) => /* @__PURE__ */ z(O, {
		label: b("shell.navigation"),
		sections: N,
		activeId: ee,
		onNavigate: L,
		collapsed: !e && C,
		onCollapsedChange: e ? void 0 : w,
		className: e ? "mtc-shell-drawer-rail" : "mtc-shell-rail"
	});
	return /* @__PURE__ */ B("div", {
		className: "mtc-shell",
		"data-inspector": h ? "open" : void 0,
		"data-rail": r ? C ? "collapsed" : "expanded" : "none",
		children: [
			/* @__PURE__ */ z("a", {
				className: "mtc-shell-skip",
				href: "#mtc-main",
				onClick: (e) => {
					e.preventDefault(), A.current?.focus();
				},
				children: b("shell.skip")
			}),
			/* @__PURE__ */ B("header", {
				className: "mtc-shell-topbar",
				children: [
					r && /* @__PURE__ */ z(s, {
						icon: /* @__PURE__ */ z(a, { name: "menu" }),
						"aria-label": b("shell.menu"),
						variant: "ghost",
						className: "mtc-shell-menu",
						onClick: () => E(!0)
					}),
					/* @__PURE__ */ B("a", {
						className: "mtc-shell-product",
						href: g.href(t.home ?? "/"),
						onClick: (e) => {
							e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || (e.preventDefault(), g.navigate(t.home ?? "/"));
						},
						children: [/* @__PURE__ */ z("span", {
							className: "mtc-shell-mark",
							"aria-hidden": "true",
							children: /* @__PURE__ */ z(a, { name: t.icon ?? "object" })
						}), /* @__PURE__ */ z("span", { children: t.name })]
					}),
					o && /* @__PURE__ */ z("div", {
						className: "mtc-shell-scope",
						children: o
					}),
					c && /* @__PURE__ */ B("button", {
						type: "button",
						className: "mtc-shell-search",
						onClick: () => k(!0),
						children: [
							/* @__PURE__ */ z(a, { name: "search" }),
							/* @__PURE__ */ z("span", {
								className: "mtc-shell-search-text",
								children: c.placeholder ?? b("shell.search")
							}),
							/* @__PURE__ */ z(m, {
								"aria-hidden": "true",
								children: "Ctrl K"
							})
						]
					}),
					/* @__PURE__ */ B("div", {
						className: "mtc-shell-actions",
						children: [l, R?.authenticated && /* @__PURE__ */ z(p, {
							label: b("shell.account"),
							align: "end",
							trigger: /* @__PURE__ */ z(v, {
								name: R.displayName ?? R.subject ?? "?",
								decorative: !0
							}),
							items: V.length > 0 ? V : [{
								id: "who",
								label: R.displayName ?? R.subject ?? "",
								disabled: !0
							}]
						})]
					})
				]
			}),
			r && /* @__PURE__ */ z("div", {
				className: "mtc-shell-rail-slot",
				children: H(!1)
			}),
			/* @__PURE__ */ z("main", {
				id: "mtc-main",
				ref: A,
				tabIndex: -1,
				className: "mtc-shell-main",
				children: /* @__PURE__ */ z(Le, { ...e })
			}),
			h && /* @__PURE__ */ z("aside", {
				className: "mtc-shell-inspector",
				children: h
			}),
			/* @__PURE__ */ z("footer", {
				className: "mtc-shell-status",
				children: f
			}),
			r && /* @__PURE__ */ z(u, {
				open: T,
				onOpenChange: E,
				title: t.name,
				side: "left",
				width: 288,
				className: "mtc-shell-drawer",
				children: H(!0)
			}),
			c && /* @__PURE__ */ z(x, {
				open: D,
				onOpenChange: k,
				query: c.query,
				onQueryChange: c.onQueryChange,
				groups: c.groups,
				onSelect: c.onSelect,
				loading: c.loading,
				placeholder: c.placeholder
			}),
			/* @__PURE__ */ z(ze, { ...e }),
			/* @__PURE__ */ z(Re, { ...e })
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
	}, [t]), /* @__PURE__ */ B("div", {
		ref: n,
		className: "mtc-shell-embedded",
		children: [
			/* @__PURE__ */ z("main", {
				id: "mtc-main",
				className: "mtc-shell-main",
				children: /* @__PURE__ */ z(Le, { ...e })
			}),
			/* @__PURE__ */ z(ze, { ...e }),
			/* @__PURE__ */ z(Re, { ...e })
		]
	});
}
//#endregion
export { Ne as OperationsTray, Ie as ProductShell, Te as RENEW_LEAD_MS, ve as RouterLink, he as RouterProvider, Se as SESSION_RENEWED, Ce as SESSION_RENEW_FAILED, E as SourceError, me as buildPath, je as createEmbedChannel, fe as createHistoryRouter, xe as createHttpSessionPort, pe as createMemoryRouter, ce as createProductFetch, S as describeSourceError, ue as ensureOk, w as isSourceError, q as matchPath, J as matchRoutes, G as newTraceparent, Ae as parseEmbedHostMessage, y as parseRetryAfter, be as parseSessionBody, we as renewViaFrame, Oe as requestTelemetry, C as responseRequestId, T as sourceErrorFromResponse, g as sourceErrorKindForCode, b as sourceErrorKindForStatus, D as toSourceError, Z as useLocation, Fe as useProductShell, _e as useRoute, X as useRouter, Ee as useSessionController };
