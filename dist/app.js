import { C as e, E as t, T as n, c as r, d as i, h as a, i as o, p as s, x as c } from "./States-BRpBuveA.js";
import { i as l } from "./utils-BfYGx7e_.js";
import { r as u } from "./types-DZxjyhu_.js";
import { _ as d, a as f, c as p, d as m, h, i as g, l as _, m as v, n as y, o as b, r as x, s as S, t as C, u as w } from "./sourceError-CTpw8oGk.js";
import { i as T, n as E, r as D } from "./Overlays-BqanRm2f.js";
import { t as O } from "./NavRail-DwdEw9a-.js";
import { t as ee } from "./useBreakpoint-CvBnDyn0.js";
import { createContext as k, forwardRef as te, useCallback as A, useContext as j, useEffect as M, useId as N, useMemo as P, useRef as F, useState as I, useSyncExternalStore as L } from "react";
import { Fragment as R, jsx as z, jsxs as B } from "react/jsx-runtime";
import { createPortal as ne } from "react-dom";
//#region src/app/productFetch.ts
var V = "x-request-id", H = "traceparent", re = "connect-timeout-ms";
function U(e) {
	let t = new Uint8Array(e);
	return globalThis.crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function W() {
	return `00-${U(16)}-${U(8)}-01`;
}
function G() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : U(16);
}
function K(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function q(e, t) {
	return (t?.method ?? (e instanceof Request ? e.method : "GET")).toUpperCase();
}
function J(e, t) {
	let n = t?.body ?? (e instanceof Request ? e.body : null);
	return n instanceof Blob || n instanceof FormData || n instanceof ReadableStream;
}
function ie(e, t, n, r) {
	let i = r?.timeoutMs === void 0 ? t.has(re) || J(n, r) ? void 0 : e : r.timeoutMs;
	return i && i > 0 ? i : void 0;
}
function ae(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function oe(e = {}) {
	let { onUnauthenticated: t, timeoutMs: n, onRequest: r, newRequestId: i = G, newTraceparent: a = W, now: o = () => performance.now() } = e;
	return async function(s, c) {
		let l = e.fetch ?? globalThis.fetch, u = new Headers(c?.headers ?? (s instanceof Request ? s.headers : void 0));
		u.has(V) || u.set(V, i()), u.has(H) || u.set(H, a());
		let d = u.get(V), p = u.get(H), m = c?.signal ?? (s instanceof Request ? s.signal : void 0), h = ie(n, u, s, c), g = h ? new AbortController() : void 0, _ = g ? setTimeout(() => g.abort(new DOMException(`No response within ${h} ms`, "TimeoutError")), h) : void 0, v = q(s, c), y = K(s), b = o(), x = (e) => r?.({
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
				signal: ae([m ?? void 0, g?.signal])
			});
		} catch (e) {
			if (m?.aborted) throw e;
			let t = g?.signal.aborted ? new C(`Request timed out after ${h} ms`, {
				kind: "unavailable",
				requestId: d
			}) : se(w(e), d);
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
function se(e, t) {
	return e.requestId ? e : new C(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function ce(e) {
	if (e.ok) return e;
	throw await S(e);
}
//#endregion
//#region src/app/router.ts
function Y(e) {
	let t = new URL(e, "http://app.local");
	return {
		pathname: t.pathname,
		search: t.search,
		hash: t.hash
	};
}
function le(e) {
	let t = e.replace(/\/+$/, "");
	return t === "" || t.startsWith("/") ? t : `/${t}`;
}
function ue({ base: e = "", window: t = globalThis.window } = {}) {
	let n = le(e), r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e()), a = (e) => n && (e === n || e.startsWith(`${n}/`)) ? e.slice(n.length) || "/" : e, o = () => i(), s = (e) => {
		let { pathname: t, search: r, hash: i } = Y(e);
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
function de(e = "/") {
	let t = [Y(e)], n = 0, r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e());
	return {
		location: () => t[n],
		navigate(e, r) {
			let a = Y(e);
			r?.replace ? t[n] = a : (t.splice(n + 1, t.length, a), n = t.length - 1), i();
		},
		back() {
			n !== 0 && (--n, i());
		},
		subscribe(e) {
			return r.add(e), () => r.delete(e);
		},
		href: (e) => {
			let { pathname: t, search: n, hash: r } = Y(e);
			return `${t}${n}${r}`;
		}
	};
}
function fe(e) {
	try {
		return decodeURIComponent(e);
	} catch {
		return null;
	}
}
function pe(e, t) {
	let n = e.split("/").filter(Boolean), r = t.split("/").filter(Boolean), i = {};
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		if (t.startsWith("*")) {
			let n = r.slice(e).map(fe);
			return n.some((e) => e === null) ? null : (i[t.slice(1) || "splat"] = n.join("/"), i);
		}
		let a = r[e];
		if (a === void 0) return null;
		if (t.startsWith(":")) {
			let e = fe(a);
			if (e === null) return null;
			i[t.slice(1)] = e;
		} else if (t !== a) return null;
	}
	return r.length === n.length ? i : null;
}
function me(e, t) {
	let n = t;
	return `/${e.split("/").filter(Boolean).map((e) => e.startsWith("*") ? (n[e.slice(1) || "splat"] ?? "").split("/").filter(Boolean).map(encodeURIComponent).join("/") : e.startsWith(":") ? encodeURIComponent(n[e.slice(1)] ?? "") : e).filter(Boolean).join("/")}`;
}
function he(e, t) {
	for (let [n, r] of Object.entries(e)) {
		let e = pe(r, t);
		if (e) return {
			id: n,
			params: e
		};
	}
	return null;
}
//#endregion
//#region src/app/routing.tsx
var ge = k(null);
function _e({ router: e, children: t }) {
	return /* @__PURE__ */ z(ge.Provider, {
		value: e,
		children: t
	});
}
function X() {
	let e = j(ge);
	if (!e) throw Error("useRouter must be used inside a RouterProvider or ProductShell");
	return e;
}
function ve(e, t) {
	return e.pathname === t.pathname && e.search === t.search && e.hash === t.hash;
}
function Z() {
	let e = X(), t = P(() => (t) => e.subscribe(t), [e]), n = P(() => {
		let t = e.location();
		return () => {
			let n = e.location();
			return ve(t, n) || (t = n), t;
		};
	}, [e]);
	return L(t, n, n);
}
function ye(e) {
	let { pathname: t } = Z();
	return P(() => he(e, t), [e, t]);
}
var be = te(function({ to: e, replace: t, onClick: n, ...r }, i) {
	let a = X();
	return /* @__PURE__ */ z("a", {
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
function xe(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e < 0xe8d4a51000 ? e * 1e3 : e;
	if (typeof e == "string" && e !== "") {
		let t = Date.parse(e);
		return Number.isNaN(t) ? void 0 : t;
	}
}
function Se(e) {
	let t = e && typeof e == "object" ? e : {}, n = (e, n) => {
		let r = t[e] ?? t[n];
		return typeof r == "string" && r !== "" ? r : void 0;
	};
	return {
		authenticated: t.authenticated === !0,
		subject: n("subject", "sub"),
		displayName: n("displayName", "display_name"),
		workspaceId: n("workspaceId", "workspace_id"),
		expiresAt: xe(t.expiresAt ?? t.expires_at),
		signInUrl: n("signInUrl", "sign_in_url")
	};
}
function Ce({ sessionUrl: e = "/auth/session", fetch: t, renew: n, signInHref: r, assign: i = (e) => globalThis.location.assign(e), signOut: a }) {
	let o = async (n) => {
		let r = await (t ?? globalThis.fetch)(e, {
			credentials: "same-origin",
			headers: { accept: "application/json" },
			signal: n
		});
		if (r.status === 401) return { authenticated: !1 };
		if (!r.ok) throw Error(`Session check failed: HTTP ${r.status}`);
		return Se(await r.json());
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
var we = "mtc:session-renewed", Te = "mtc:session-renew-failed";
function Ee({ url: e, origin: t, timeoutMs: n = 15e3, window: r = globalThis.window }) {
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
var De = 6e4, Oe = 2147483647;
function ke(e, t, { now: n = Date.now, document: r, setTimeout: i = (e, t) => globalThis.setTimeout(e, t), clearTimeout: a = (e) => globalThis.clearTimeout(e) }) {
	let o, s = () => {
		o !== void 0 && a(o), o = void 0;
	}, c = () => {
		if (s(), r.hidden) return;
		let a = e - De - n();
		if (a <= 0) {
			t();
			return;
		}
		o = i(() => {
			o = void 0, a > Oe ? c() : t();
		}, Math.min(a, Oe));
	};
	return c(), r.addEventListener("visibilitychange", c), () => {
		s(), r.removeEventListener("visibilitychange", c);
	};
}
function Ae(e, t = {}) {
	let n = t.now ?? Date.now, r = t.document ?? (typeof document > "u" ? void 0 : document), [i, a] = I(e ? "loading" : "authenticated"), [o, s] = I(null), c = F(null), l = A(() => {
		if (!e) return Promise.resolve(!0);
		if (c.current) return c.current;
		let t = e.renew().then((e) => (s(e), a("authenticated"), !0), () => (a("expired"), !1)).finally(() => {
			c.current = null;
		});
		return c.current = t, t;
	}, [e]);
	M(() => {
		if (!e) return;
		let t = new AbortController();
		return e.load(t.signal).then((e) => {
			t.signal.aborted || (s(e), a(e.authenticated ? "authenticated" : "signed-out"));
		}, () => {
			t.signal.aborted || a("signed-out");
		}), () => t.abort();
	}, [e]);
	let { setTimeout: u, clearTimeout: d } = t;
	return M(() => {
		if (e && i === "authenticated" && o?.expiresAt && r) return ke(o.expiresAt, () => void l(), {
			now: n,
			document: r,
			setTimeout: u,
			clearTimeout: d
		});
	}, [
		e,
		i,
		o?.expiresAt,
		r,
		n,
		l,
		u,
		d
	]), {
		status: i,
		session: o,
		renew: l,
		reportUnauthenticated: A(() => {
			l();
		}, [l])
	};
}
//#endregion
//#region src/app/resourceCache.ts
var je = Object.freeze({ validating: !1 });
function Me({ maxEntries: e = 100, now: t = Date.now } = {}) {
	let n = /* @__PURE__ */ new Map(), r = (e) => {
		let t = n.get(e);
		return t ? n.delete(e) : t = {
			snapshot: je,
			listeners: /* @__PURE__ */ new Set(),
			version: 0
		}, n.set(e, t), t;
	}, i = (e, t) => {
		e.snapshot = {
			...e.snapshot,
			...t
		};
		for (let t of [...e.listeners]) t();
	}, a = () => {
		let t = [...n.values()].filter((e) => e.listeners.size === 0 && !e.inflight).length;
		for (let [r, i] of n) {
			if (t <= e) break;
			i.listeners.size > 0 || i.inflight || (n.delete(r), --t);
		}
	}, o = (e, n) => {
		let o = r(e);
		if (o.load = n, o.inflight && !o.inflight.controller.signal.aborted) return o.inflight.promise;
		let s = new AbortController(), c = o.version, l = (async () => {
			try {
				let e = await n(s.signal);
				if (s.signal.aborted || o.version !== c) return;
				i(o, {
					data: e,
					error: void 0,
					updatedAt: t()
				});
			} catch (e) {
				s.signal.aborted || i(o, { error: w(e) });
			} finally {
				o.inflight?.controller === s && (o.inflight = void 0, i(o, { validating: !1 })), a();
			}
		})();
		return o.inflight = {
			promise: l,
			controller: s
		}, i(o, { validating: !0 }), l;
	};
	return {
		read: (e) => n.get(e)?.snapshot ?? je,
		subscribe(e, t) {
			let n = r(e);
			return n.listeners.add(t), () => {
				n.listeners.delete(t), queueMicrotask(() => {
					n.listeners.size === 0 && n.inflight?.controller.abort(), a();
				});
			};
		},
		fetch: o,
		set(e, n) {
			let a = r(e), o = typeof n == "function" ? n(a.snapshot.data) : n;
			a.version += 1, i(a, {
				data: o,
				error: void 0,
				updatedAt: t()
			});
		},
		invalidate(e = () => !0) {
			for (let [t, r] of [...n]) e(t) && (i(r, { updatedAt: void 0 }), r.listeners.size > 0 && r.load && o(t, r.load));
		}
	};
}
//#endregion
//#region src/app/useResource.tsx
var Ne = k(null), Pe;
function Fe({ cache: e, children: t }) {
	return /* @__PURE__ */ z(Ne.Provider, {
		value: e,
		children: t
	});
}
function Ie() {
	return j(Ne) ?? (Pe ??= Me());
}
function Le(e) {
	return typeof e == "string" ? e : JSON.stringify(e);
}
function Re({ document: e, intervalMs: t, onVisible: n = !0, isStale: r, revalidate: i, setTimeout: a = (e, t) => globalThis.setTimeout(e, t), clearTimeout: o = (e) => globalThis.clearTimeout(e) }) {
	let s, c = () => {
		s !== void 0 && o(s), s = void 0;
	}, l = () => {
		c(), !(e.hidden || !t || t <= 0) && (s = a(() => {
			s = void 0, i(), l();
		}, t));
	}, u = () => {
		!e.hidden && n && r() && i(), l();
	};
	return l(), e.addEventListener("visibilitychange", u), () => {
		c(), e.removeEventListener("visibilitychange", u);
	};
}
var ze = { validating: !1 }, Be = () => () => {};
function Ve(e, t, { staleTimeMs: n = 0, refreshIntervalMs: r, revalidateOnVisible: i = !0, document: a } = {}) {
	let o = Ie(), s = e === null ? null : Le(e), c = F(t);
	c.current = t;
	let l = A((e) => s === null ? Be() : o.subscribe(s, e), [o, s]), u = L(l, () => s === null ? ze : o.read(s), () => s === null ? ze : o.read(s)), d = A(() => s === null ? Promise.resolve() : o.fetch(s, (e) => c.current(e)), [o, s]), f = A(() => {
		if (s === null) return !1;
		let { updatedAt: e } = o.read(s);
		return e === void 0 || Date.now() - e >= n;
	}, [
		o,
		s,
		n
	]);
	M(() => {
		s !== null && f() && d();
	}, [
		s,
		f,
		d
	]);
	let p = a ?? (typeof document > "u" ? void 0 : document);
	M(() => {
		if (s !== null && p) return Re({
			document: p,
			intervalMs: r,
			onVisible: i,
			isStale: f,
			revalidate: () => void d()
		});
	}, [
		s,
		p,
		r,
		i,
		f,
		d
	]);
	let m = A((e) => {
		s !== null && o.set(s, e);
	}, [o, s]), h = s === null ? "idle" : u.data === void 0 ? u.error ? "error" : "loading" : "success";
	return {
		data: u.data,
		error: u.error,
		status: h,
		validating: u.validating,
		updatedAt: u.updatedAt,
		refresh: d,
		mutate: m
	};
}
//#endregion
//#region src/app/telemetry.ts
function He(e) {
	try {
		return new URL(e, "http://app.local").pathname;
	} catch {
		return e.split("?")[0] ?? e;
	}
}
function Ue(e) {
	return (t) => e.record({
		type: "request",
		method: t.method,
		path: He(t.url),
		status: t.status,
		code: t.error ? t.error.code ?? t.error.kind : void 0,
		requestId: t.requestId,
		durationMs: Math.round(t.durationMs)
	});
}
//#endregion
//#region src/app/embed.ts
var We = /* @__PURE__ */ new Set([
	"dark",
	"light",
	"operator",
	"high-contrast"
]);
function Ge(e) {
	if (!e || typeof e != "object") return null;
	let t = e;
	return t.version === 1 ? t.type === "mtc:navigate" ? typeof t.path == "string" && /^\/(?![/\\])/.test(t.path) ? {
		type: "mtc:navigate",
		version: 1,
		path: t.path
	} : null : t.type === "mtc:init" ? {
		type: "mtc:init",
		version: 1,
		theme: typeof t.theme == "string" && We.has(t.theme) ? t.theme : void 0,
		locale: typeof t.locale == "string" ? t.locale : void 0,
		timeZone: typeof t.timeZone == "string" ? t.timeZone : void 0
	} : null : null;
}
function Ke({ allowedOrigins: e, window: t = globalThis.window }) {
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
				let i = Ge(n.data);
				i && e(i);
			};
			return t.addEventListener("message", n), () => t.removeEventListener("message", n);
		}
	};
}
//#endregion
//#region src/app/OperationsTray.tsx
var qe = {
	queued: "clock",
	running: "spinner",
	succeeded: "success",
	failed: "error",
	cancelled: "close"
}, Q = /* @__PURE__ */ new Set([
	"succeeded",
	"failed",
	"cancelled"
]), Je = "(max-width: 720px)";
function Ye() {
	return typeof window > "u" || typeof window.matchMedia != "function" || !window.matchMedia(Je).matches;
}
function Xe({ operations: e, title: r, onCancel: o, onRetry: c, onDismiss: u, onClearFinished: d, open: f, defaultOpen: p, onOpenChange: m, placement: h = "floating" }) {
	let g = n(), _ = N(), v = t(), [y] = I(() => p ?? Ye()), [b, x] = l({
		value: f,
		defaultValue: y,
		onChange: m
	}), S = F(/* @__PURE__ */ new Map()), [C, w] = I("");
	M(() => {
		let t = e.filter((e) => Q.has(e.status) && S.current.get(e.id) !== e.status);
		S.current = new Map(e.map((e) => [e.id, e.status])), t.length > 0 && w(t.map((e) => `${e.label}: ${g(`ops.status.${e.status}`)}`).join(". "));
	}, [e, g]);
	let T = P(() => {
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
	let E = [
		T.running > 0 && g("ops.running", { count: T.running }),
		T.queued > 0 && g("ops.queued", { count: T.queued }),
		T.failed > 0 && g("ops.failed", { count: T.failed }),
		T.succeeded > 0 && g("ops.done", { count: T.succeeded })
	].filter(Boolean).join(" · "), D = e.some((e) => Q.has(e.status)), O = /* @__PURE__ */ B("section", {
		className: "mtc-operations-tray",
		"aria-label": r ?? g("ops.title"),
		"data-open": b || void 0,
		"data-placement": h,
		children: [
			/* @__PURE__ */ z("div", {
				className: "mtc-operations-header",
				children: /* @__PURE__ */ B("button", {
					type: "button",
					className: "mtc-operations-toggle",
					"aria-expanded": b,
					"aria-controls": _,
					onClick: () => x(!b),
					children: [
						/* @__PURE__ */ z(a, {
							name: T.running > 0 ? "spinner" : T.failed > 0 ? "error" : "success",
							className: "mtc-operations-header-icon",
							"data-status": T.running > 0 ? "running" : T.failed > 0 ? "failed" : "succeeded"
						}),
						/* @__PURE__ */ z("span", {
							className: "mtc-operations-title",
							children: r ?? g("ops.title")
						}),
						/* @__PURE__ */ z("span", {
							className: "mtc-operations-summary",
							children: E
						}),
						/* @__PURE__ */ z(a, {
							name: "chevron-down",
							className: "mtc-operations-chevron",
							label: g(b ? "ops.hide" : "ops.show")
						})
					]
				})
			}),
			/* @__PURE__ */ z("span", {
				role: "status",
				className: "mtc-visually-hidden",
				children: C
			}),
			b && /* @__PURE__ */ B(R, { children: [/* @__PURE__ */ z("ul", {
				id: _,
				className: "mtc-operations-list",
				children: e.map((e) => {
					let t = Q.has(e.status), n = e.progress === void 0 ? void 0 : Math.round(Math.min(1, Math.max(0, e.progress)) * 100);
					return /* @__PURE__ */ B("li", {
						className: "mtc-operation",
						"data-status": e.status,
						children: [
							/* @__PURE__ */ z(a, {
								name: qe[e.status],
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
			}), D && d && /* @__PURE__ */ z("div", {
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
	return h === "floating" && v ? ne(O, v) : O;
}
//#endregion
//#region src/app/ProductShell.tsx
var Ze = k(null);
function Qe() {
	let e = j(Ze);
	if (!e) throw Error("useProductShell must be used inside a ProductShell");
	return e;
}
function $(e) {
	let { pathname: t, search: n, hash: r } = e.location();
	return `${t}${n}${r}`;
}
function $e(t) {
	let { router: n, session: r, telemetry: i, mode: a = "standalone", embedOrigins: o = [], theme: s, density: l, locale: u, timeZone: d, messages: f } = t, p = a === "embed", h = P(() => p && typeof window < "u" ? Ke({ allowedOrigins: o }) : null, [p]), g = e(), [_, v] = I({}), y = Ae(r);
	M(() => n.subscribe(() => {
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
	]), M(() => {
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
	]), M(() => {
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
	return /* @__PURE__ */ z(c, {
		theme: _.theme ?? s ?? g?.theme ?? "dark",
		density: l ?? g?.density,
		locale: _.locale ?? u,
		timeZone: _.timeZone ?? d,
		messages: f,
		className: "mtc-product-shell-root",
		children: /* @__PURE__ */ z(_e, {
			router: n,
			children: /* @__PURE__ */ z(Ze.Provider, {
				value: b,
				children: /* @__PURE__ */ z(m, { children: p ? /* @__PURE__ */ z(it, {
					channel: h,
					...t,
					session: r,
					controller: y
				}) : /* @__PURE__ */ z(rt, {
					...t,
					session: r,
					controller: y
				}) })
			})
		})
	});
}
function et({ controller: e, session: t, router: n, children: i }) {
	return e.status === "loading" ? /* @__PURE__ */ z(o, {}) : e.status === "signed-out" ? /* @__PURE__ */ z(r, { onSignIn: t ? () => t.signIn($(n), e.session ?? void 0) : void 0 }) : /* @__PURE__ */ z(R, { children: i });
}
function tt({ controller: e, session: t, router: r }) {
	let a = n(), [o, s] = I(!1);
	if (e.status !== "expired") return null;
	let c = async () => {
		s(!0);
		let n = await e.renew();
		s(!1), n || t?.signIn($(r), e.session ?? void 0);
	};
	return /* @__PURE__ */ z(E, {
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
function nt(e) {
	return /* @__PURE__ */ z(Xe, {
		operations: e.operations ?? [],
		onCancel: e.onCancelOperation,
		onRetry: e.onRetryOperation,
		onDismiss: e.onDismissOperation
	});
}
function rt(e) {
	let { product: t, nav: r, activeNavId: i, scope: o, search: c, actions: l, accountMenu: u, status: f, inspector: p, router: m, controller: g, session: _ } = e, y = n(), { pathname: b } = Z(), x = ee() === "mobile", [S, C] = I(!1), [w, E] = I(!1), [k, te] = I(!1), j = F(null), N = F(null), L = F(!1), R = F(!1), ne = A((e) => {
		e || (L.current = N.current === document.activeElement), N.current = e, e && L.current && (L.current = !1, e.focus());
	}, []), V = A((e) => {
		e && (R.current = N.current === document.activeElement), te(e), !e && R.current && N.current?.focus();
	}, []);
	M(() => {
		c || (L.current = !1);
	}, [c]);
	let H = A((e) => {
		e.href && (m.navigate(e.href), E(!1));
	}, [m]), re = P(() => (r ?? []).map((e) => ({
		...e,
		items: e.items.map((e) => ({
			...e,
			href: e.href ? m.href(e.href) : void 0
		}))
	})), [r, m]), U = i ?? (r ?? []).flatMap((e) => e.items).filter((e) => e.href && (b === e.href || b.startsWith(e.href === "/" ? "/" : `${e.href}/`))).sort((e, t) => (t.href?.length ?? 0) - (e.href?.length ?? 0))[0]?.id, W = (e) => {
		let t = r?.flatMap((e) => e.items).find((t) => t.id === e.id);
		t && H(t);
	}, G = g.session, K = [...u ?? [], ..._?.signOut ? [{
		id: "sign-out",
		label: y("shell.signOut"),
		icon: /* @__PURE__ */ z(a, { name: "sign-out" }),
		onSelect: () => void _.signOut?.()
	}] : []], q = (e) => /* @__PURE__ */ z(O, {
		label: y("shell.navigation"),
		sections: re,
		activeId: U,
		onNavigate: W,
		collapsed: !e && S,
		onCollapsedChange: e ? void 0 : C,
		className: e ? "mtc-shell-drawer-rail" : "mtc-shell-rail"
	}), J = c && /* @__PURE__ */ B("button", {
		ref: ne,
		type: "button",
		className: "mtc-shell-search",
		"aria-label": c.placeholder ?? y("shell.search"),
		onClick: (e) => {
			e.currentTarget.focus(), V(!0);
		},
		children: [
			/* @__PURE__ */ z(a, { name: "search" }),
			/* @__PURE__ */ z("span", {
				className: "mtc-shell-search-text",
				children: c.placeholder ?? y("shell.search")
			}),
			/* @__PURE__ */ z(d, {
				"aria-hidden": "true",
				children: "Ctrl K"
			})
		]
	});
	return /* @__PURE__ */ B("div", {
		className: "mtc-shell",
		"data-inspector": p ? "open" : void 0,
		"data-operations": e.operations?.length ? "true" : void 0,
		"data-rail": r ? S ? "collapsed" : "expanded" : "none",
		children: [
			/* @__PURE__ */ z("a", {
				className: "mtc-shell-skip",
				href: "#mtc-main",
				onClick: (e) => {
					e.preventDefault(), j.current?.focus();
				},
				children: y("shell.skip")
			}),
			/* @__PURE__ */ B("header", {
				className: "mtc-shell-topbar",
				"data-search": c ? "true" : void 0,
				children: [
					/* @__PURE__ */ B("div", {
						className: "mtc-shell-identity",
						children: [
							r && /* @__PURE__ */ z(s, {
								icon: /* @__PURE__ */ z(a, { name: "menu" }),
								"aria-label": y("shell.menu"),
								variant: "ghost",
								className: "mtc-shell-menu",
								onClick: () => E(!0)
							}),
							/* @__PURE__ */ B("a", {
								className: "mtc-shell-product",
								title: t.name,
								href: m.href(t.home ?? "/"),
								onClick: (e) => {
									e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || (e.preventDefault(), m.navigate(t.home ?? "/"));
								},
								children: [/* @__PURE__ */ z("span", {
									className: "mtc-shell-mark",
									"aria-hidden": "true",
									children: /* @__PURE__ */ z(a, { name: t.icon ?? "object" })
								}), /* @__PURE__ */ z("span", {
									className: "mtc-shell-product-name",
									children: t.name
								})]
							}),
							o && /* @__PURE__ */ z("div", {
								className: "mtc-shell-scope",
								children: o
							})
						]
					}),
					!x && J,
					/* @__PURE__ */ B("div", {
						className: "mtc-shell-actions",
						children: [
							l && /* @__PURE__ */ z("div", {
								className: "mtc-shell-product-actions",
								children: l
							}),
							x && J,
							/* @__PURE__ */ z("div", {
								className: "mtc-shell-account",
								"aria-hidden": !G?.authenticated || void 0,
								children: G?.authenticated && /* @__PURE__ */ z(T, {
									label: y("shell.account"),
									align: "end",
									trigger: /* @__PURE__ */ z(h, {
										name: G.displayName ?? G.subject ?? "?",
										decorative: !0
									}),
									items: K.length > 0 ? K : [{
										id: "who",
										label: G.displayName ?? G.subject ?? "",
										disabled: !0
									}]
								})
							})
						]
					})
				]
			}),
			r && /* @__PURE__ */ z("div", {
				className: "mtc-shell-rail-slot",
				children: q(!1)
			}),
			/* @__PURE__ */ z("main", {
				id: "mtc-main",
				ref: j,
				tabIndex: -1,
				className: "mtc-shell-main",
				children: /* @__PURE__ */ z(et, { ...e })
			}),
			p && /* @__PURE__ */ z("aside", {
				className: "mtc-shell-inspector",
				children: p
			}),
			/* @__PURE__ */ z("footer", {
				className: "mtc-shell-status",
				children: f
			}),
			r && /* @__PURE__ */ z(D, {
				open: w,
				onOpenChange: E,
				title: t.name,
				side: "left",
				width: 288,
				className: "mtc-shell-drawer",
				children: q(!0)
			}),
			c && /* @__PURE__ */ z(v, {
				open: k,
				onOpenChange: V,
				query: c.query,
				onQueryChange: c.onQueryChange,
				groups: c.groups,
				onSelect: c.onSelect,
				loading: c.loading,
				placeholder: c.placeholder
			}),
			/* @__PURE__ */ z(nt, { ...e }),
			/* @__PURE__ */ z(tt, { ...e })
		]
	});
}
function it(e) {
	let { channel: t } = e, n = F(null);
	return M(() => {
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
				children: /* @__PURE__ */ z(et, { ...e })
			}),
			/* @__PURE__ */ z(nt, { ...e }),
			/* @__PURE__ */ z(tt, { ...e })
		]
	});
}
//#endregion
export { Xe as OperationsTray, $e as ProductShell, De as RENEW_LEAD_MS, Fe as ResourceCacheProvider, be as RouterLink, _e as RouterProvider, we as SESSION_RENEWED, Te as SESSION_RENEW_FAILED, C as SourceError, me as buildPath, Ke as createEmbedChannel, ue as createHistoryRouter, Ce as createHttpSessionPort, de as createMemoryRouter, oe as createProductFetch, Me as createResourceCache, y as describeSourceError, ce as ensureOk, x as isSourceError, pe as matchPath, he as matchRoutes, W as newTraceparent, Ge as parseEmbedHostMessage, g as parseRetryAfter, Se as parseSessionBody, Ee as renewViaFrame, Ue as requestTelemetry, Le as resourceKey, b as responseRequestId, S as sourceErrorFromResponse, p as sourceErrorKindForCode, _ as sourceErrorKindForStatus, w as toSourceError, Z as useLocation, Qe as useProductShell, Ve as useResource, Ie as useResourceCache, ye as useRoute, X as useRouter, Ae as useSessionController };
