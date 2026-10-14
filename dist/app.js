import { D as e, E as t, S as n, c as r, d as i, f as a, g as o, i as s, m as c, r as l, w as u } from "./States-CirXf8uQ.js";
import { i as d } from "./utils-BfYGx7e_.js";
import { r as f } from "./types-9raK7bmK.js";
import { _ as p, a as m, c as h, d as g, h as _, i as v, l as y, m as b, n as x, o as S, r as C, s as w, t as T, u as E } from "./sourceError-Cv8KoMhB.js";
import { i as D, n as O, r as ee } from "./Overlays-VaMRz4no.js";
import { t as te } from "./NavRail-CbUtMVih.js";
import { t as ne } from "./useBreakpoint-CvBnDyn0.js";
import { createContext as k, forwardRef as A, useCallback as j, useContext as M, useEffect as N, useId as P, useMemo as F, useRef as I, useState as L, useSyncExternalStore as R } from "react";
import { Fragment as z, jsx as B, jsxs as V } from "react/jsx-runtime";
import { createPortal as re } from "react-dom";
//#region src/app/productFetch.ts
var H = "x-request-id", U = "traceparent", ie = "connect-timeout-ms";
function W(e) {
	let t = new Uint8Array(e);
	return globalThis.crypto.getRandomValues(t), Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
}
function G() {
	return `00-${W(16)}-${W(8)}-01`;
}
function K() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : W(16);
}
function q(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function ae(e, t) {
	return (t?.method ?? (e instanceof Request ? e.method : "GET")).toUpperCase();
}
function J(e, t) {
	let n = t?.body ?? (e instanceof Request ? e.body : null);
	return n instanceof Blob || n instanceof FormData || n instanceof ReadableStream;
}
function Y(e, t, n, r) {
	let i = r?.timeoutMs === void 0 ? t.has(ie) || J(n, r) ? void 0 : e : r.timeoutMs;
	return i && i > 0 ? i : void 0;
}
function oe(e) {
	let t = e.filter((e) => !!e);
	return t.length <= 1 ? t[0] : AbortSignal.any(t);
}
function se(e = {}) {
	let { onUnauthenticated: t, timeoutMs: n, onRequest: r, newRequestId: i = K, newTraceparent: a = G, now: o = () => performance.now() } = e;
	return async function(s, c) {
		let l = e.fetch ?? globalThis.fetch, u = new Headers(c?.headers ?? (s instanceof Request ? s.headers : void 0));
		u.has(H) || u.set(H, i()), u.has(U) || u.set(U, a());
		let d = u.get(H), f = u.get(U), p = c?.signal ?? (s instanceof Request ? s.signal : void 0), h = Y(n, u, s, c), g = h ? new AbortController() : void 0, _ = g ? setTimeout(() => g.abort(new DOMException(`No response within ${h} ms`, "TimeoutError")), h) : void 0, v = ae(s, c), y = q(s), b = o(), x = (e) => r?.({
			method: v,
			url: y,
			requestId: d,
			traceparent: f,
			durationMs: o() - b,
			...e
		}), { timeoutMs: S, ...C } = c ?? {}, D;
		try {
			D = await l(s, {
				...C,
				headers: u,
				signal: oe([p ?? void 0, g?.signal])
			});
		} catch (e) {
			if (p?.aborted) throw e;
			let t = g?.signal.aborted ? new T(`Request timed out after ${h} ms`, {
				kind: "unavailable",
				requestId: d
			}) : ce(E(e), d);
			throw x({ error: t }), t;
		} finally {
			clearTimeout(_);
		}
		if (m(D, d), D.ok) return x({ status: D.status }), D;
		let O = await w(D.clone(), { requestId: d });
		return x({
			status: D.status,
			error: O
		}), D.status === 401 && t?.(O), D;
	};
}
function ce(e, t) {
	return e.requestId ? e : new T(e.message, {
		kind: e.kind,
		status: e.status,
		code: e.code,
		retryAfterMs: e.retryAfterMs,
		requestId: t
	});
}
async function le(e) {
	if (e.ok) return e;
	throw await w(e);
}
//#endregion
//#region src/app/router.ts
function X(e) {
	let t = new URL(e, "http://app.local");
	return {
		pathname: t.pathname,
		search: t.search,
		hash: t.hash
	};
}
function ue(e) {
	let t = e.replace(/\/+$/, "");
	return t === "" || t.startsWith("/") ? t : `/${t}`;
}
function de({ base: e = "", window: t = globalThis.window } = {}) {
	let n = ue(e), r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e()), a = (e) => n && (e === n || e.startsWith(`${n}/`)) ? e.slice(n.length) || "/" : e, o = () => i(), s = (e) => {
		let { pathname: t, search: r, hash: i } = X(e);
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
function fe(e = "/") {
	let t = [X(e)], n = 0, r = /* @__PURE__ */ new Set(), i = () => r.forEach((e) => e());
	return {
		location: () => t[n],
		navigate(e, r) {
			let a = X(e);
			r?.replace ? t[n] = a : (t.splice(n + 1, t.length, a), n = t.length - 1), i();
		},
		back() {
			n !== 0 && (--n, i());
		},
		subscribe(e) {
			return r.add(e), () => r.delete(e);
		},
		href: (e) => {
			let { pathname: t, search: n, hash: r } = X(e);
			return `${t}${n}${r}`;
		}
	};
}
function pe(e) {
	try {
		return decodeURIComponent(e);
	} catch {
		return null;
	}
}
function me(e, t) {
	let n = e.split("/").filter(Boolean), r = t.split("/").filter(Boolean), i = {};
	for (let e = 0; e < n.length; e++) {
		let t = n[e];
		if (t.startsWith("*")) {
			let n = r.slice(e).map(pe);
			return n.some((e) => e === null) ? null : (i[t.slice(1) || "splat"] = n.join("/"), i);
		}
		let a = r[e];
		if (a === void 0) return null;
		if (t.startsWith(":")) {
			let e = pe(a);
			if (e === null) return null;
			i[t.slice(1)] = e;
		} else if (t !== a) return null;
	}
	return r.length === n.length ? i : null;
}
function he(e, t) {
	let n = t;
	return `/${e.split("/").filter(Boolean).map((e) => e.startsWith("*") ? (n[e.slice(1) || "splat"] ?? "").split("/").filter(Boolean).map(encodeURIComponent).join("/") : e.startsWith(":") ? encodeURIComponent(n[e.slice(1)] ?? "") : e).filter(Boolean).join("/")}`;
}
function ge(e, t) {
	for (let [n, r] of Object.entries(e)) {
		let e = me(r, t);
		if (e) return {
			id: n,
			params: e
		};
	}
	return null;
}
//#endregion
//#region src/app/routing.tsx
var _e = k(null);
function ve({ router: e, children: t }) {
	return /* @__PURE__ */ B(_e.Provider, {
		value: e,
		children: t
	});
}
function Z() {
	let e = M(_e);
	if (!e) throw Error("useRouter must be used inside a RouterProvider or ProductShell");
	return e;
}
function ye(e, t) {
	return e.pathname === t.pathname && e.search === t.search && e.hash === t.hash;
}
function Q() {
	let e = Z(), t = F(() => (t) => e.subscribe(t), [e]), n = F(() => {
		let t = e.location();
		return () => {
			let n = e.location();
			return ye(t, n) || (t = n), t;
		};
	}, [e]);
	return R(t, n, n);
}
function be(e) {
	let { pathname: t } = Q();
	return F(() => ge(e, t), [e, t]);
}
var xe = A(function({ to: e, replace: t, onClick: n, ...r }, i) {
	let a = Z();
	return /* @__PURE__ */ B("a", {
		...r,
		ref: i,
		href: a.href(e),
		onClick: (i) => {
			n?.(i), !(!f(i) || r.target && r.target !== "_self") && (i.preventDefault(), a.navigate(e, { replace: t }));
		}
	});
});
//#endregion
//#region src/app/session.ts
function Se(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e < 0xe8d4a51000 ? e * 1e3 : e;
	if (typeof e == "string" && e !== "") {
		let t = Date.parse(e);
		return Number.isNaN(t) ? void 0 : t;
	}
}
function Ce(e) {
	let t = e && typeof e == "object" ? e : {}, n = (e, n) => {
		let r = t[e] ?? t[n];
		return typeof r == "string" && r !== "" ? r : void 0;
	};
	return {
		authenticated: t.authenticated === !0,
		subject: n("subject", "sub"),
		displayName: n("displayName", "display_name"),
		workspaceId: n("workspaceId", "workspace_id"),
		expiresAt: Se(t.expiresAt ?? t.expires_at),
		signInUrl: n("signInUrl", "sign_in_url")
	};
}
function we({ sessionUrl: e = "/auth/session", fetch: t, renew: n, signInHref: r, assign: i = (e) => globalThis.location.assign(e), signOut: a }) {
	let o = async (n) => {
		let r = await (t ?? globalThis.fetch)(e, {
			credentials: "same-origin",
			headers: { accept: "application/json" },
			signal: n
		});
		if (r.status === 401) return { authenticated: !1 };
		if (!r.ok) throw Error(`Session check failed: HTTP ${r.status}`);
		return Ce(await r.json());
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
			return n ? (i(n), !0) : !1;
		},
		canSignIn: (e) => r !== void 0 || !!e?.signInUrl,
		signOut: a
	};
}
var Te = "mtc:session-renewed", Ee = "mtc:session-renew-failed";
function De({ url: e, origin: t, timeoutMs: n = 15e3, window: r = globalThis.window }) {
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
var Oe = 6e4, ke = 2147483647;
function Ae(e, t, { now: n = Date.now, document: r, setTimeout: i = (e, t) => globalThis.setTimeout(e, t), clearTimeout: a = (e) => globalThis.clearTimeout(e) }) {
	let o, s = () => {
		o !== void 0 && a(o), o = void 0;
	}, c = () => {
		if (s(), r.hidden) return;
		let a = e - Oe - n();
		if (a <= 0) {
			t();
			return;
		}
		o = i(() => {
			o = void 0, a > ke ? c() : t();
		}, Math.min(a, ke));
	};
	return c(), r.addEventListener("visibilitychange", c), () => {
		s(), r.removeEventListener("visibilitychange", c);
	};
}
function je(e, t = {}) {
	let n = t.now ?? Date.now, r = t.document ?? (typeof document > "u" ? void 0 : document), [i, a] = L(e ? "loading" : "authenticated"), [o, s] = L(null), [c, l] = L(null), [u, d] = L(0), f = I(null), p = j(() => {
		if (!e) return Promise.resolve(!0);
		if (f.current) return f.current;
		let t = e.renew().then((e) => (s(e), a("authenticated"), !0), () => (a("expired"), !1)).finally(() => {
			f.current = null;
		});
		return f.current = t, t;
	}, [e]);
	N(() => {
		if (!e) return;
		let t = new AbortController();
		return a((e) => e === "error" ? "loading" : e), e.load(t.signal).then((e) => {
			t.signal.aborted || (s(e), l(null), a(e.authenticated ? "authenticated" : "signed-out"));
		}, (e) => {
			t.signal.aborted || (l(E(e)), a("error"));
		}), () => t.abort();
	}, [e, u]);
	let m = j(() => {
		d((e) => e + 1);
	}, []), { setTimeout: h, clearTimeout: g } = t;
	return N(() => {
		if (e && i === "authenticated" && o?.expiresAt && r) return Ae(o.expiresAt, () => void p(), {
			now: n,
			document: r,
			setTimeout: h,
			clearTimeout: g
		});
	}, [
		e,
		i,
		o?.expiresAt,
		r,
		n,
		p,
		h,
		g
	]), {
		status: i,
		session: o,
		error: c,
		renew: p,
		reload: m,
		reportUnauthenticated: j(() => {
			p();
		}, [p])
	};
}
//#endregion
//#region src/app/resourceCache.ts
var Me = Object.freeze({ validating: !1 });
function Ne({ maxEntries: e = 100, now: t = Date.now } = {}) {
	let n = /* @__PURE__ */ new Map(), r = (e) => {
		let t = n.get(e);
		return t ? n.delete(e) : t = {
			snapshot: Me,
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
				s.signal.aborted || i(o, { error: E(e) });
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
		read: (e) => n.get(e)?.snapshot ?? Me,
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
var Pe = k(null), Fe;
function Ie({ cache: e, children: t }) {
	return /* @__PURE__ */ B(Pe.Provider, {
		value: e,
		children: t
	});
}
function Le() {
	return M(Pe) ?? (Fe ??= Ne());
}
function Re(e) {
	return typeof e == "string" ? e : JSON.stringify(e);
}
function ze({ document: e, intervalMs: t, onVisible: n = !0, isStale: r, revalidate: i, setTimeout: a = (e, t) => globalThis.setTimeout(e, t), clearTimeout: o = (e) => globalThis.clearTimeout(e) }) {
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
var Be = { validating: !1 }, Ve = () => () => {};
function He(e, t, { staleTimeMs: n = 0, refreshIntervalMs: r, revalidateOnVisible: i = !0, document: a } = {}) {
	let o = Le(), s = e === null ? null : Re(e), c = I(t);
	c.current = t;
	let l = j((e) => s === null ? Ve() : o.subscribe(s, e), [o, s]), u = R(l, () => s === null ? Be : o.read(s), () => s === null ? Be : o.read(s)), d = j(() => s === null ? Promise.resolve() : o.fetch(s, (e) => c.current(e)), [o, s]), f = j(() => {
		if (s === null) return !1;
		let { updatedAt: e } = o.read(s);
		return e === void 0 || Date.now() - e >= n;
	}, [
		o,
		s,
		n
	]);
	N(() => {
		s !== null && f() && d();
	}, [
		s,
		f,
		d
	]);
	let p = a ?? (typeof document > "u" ? void 0 : document);
	N(() => {
		if (s !== null && p) return ze({
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
	let m = j((e) => {
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
function Ue(e) {
	try {
		return new URL(e, "http://app.local").pathname;
	} catch {
		return e.split("?")[0] ?? e;
	}
}
function We(e) {
	return (t) => e.record({
		type: "request",
		method: t.method,
		path: Ue(t.url),
		status: t.status,
		code: t.error ? t.error.code ?? t.error.kind : void 0,
		requestId: t.requestId,
		durationMs: Math.round(t.durationMs)
	});
}
//#endregion
//#region src/app/embed.ts
var Ge = /* @__PURE__ */ new Set([
	"dark",
	"light",
	"operator",
	"high-contrast"
]);
function Ke(e) {
	if (!e || typeof e != "object") return null;
	let t = e;
	return t.version === 1 ? t.type === "mtc:navigate" ? typeof t.path == "string" && /^\/(?![/\\])/.test(t.path) ? {
		type: "mtc:navigate",
		version: 1,
		path: t.path
	} : null : t.type === "mtc:init" ? {
		type: "mtc:init",
		version: 1,
		theme: typeof t.theme == "string" && Ge.has(t.theme) ? t.theme : void 0,
		locale: typeof t.locale == "string" ? t.locale : void 0,
		timeZone: typeof t.timeZone == "string" ? t.timeZone : void 0
	} : null : null;
}
function qe({ allowedOrigins: e, window: t = globalThis.window }) {
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
				let i = Ke(n.data);
				i && e(i);
			};
			return t.addEventListener("message", n), () => t.removeEventListener("message", n);
		}
	};
}
//#endregion
//#region src/app/OperationsTray.tsx
var Je = {
	queued: "clock",
	running: "spinner",
	succeeded: "success",
	failed: "error",
	cancelled: "close"
}, Ye = /* @__PURE__ */ new Set([
	"succeeded",
	"failed",
	"cancelled"
]), Xe = "(max-width: 767px)";
function Ze() {
	return typeof window > "u" || typeof window.matchMedia != "function" || !window.matchMedia(Xe).matches;
}
function Qe({ operations: n, title: r, onCancel: i, onRetry: s, onDismiss: l, onClearFinished: u, open: f, defaultOpen: p, onOpenChange: m, placement: h = "floating" }) {
	let g = t(), _ = P(), v = e(), [y] = L(() => p ?? Ze()), [b, x] = d({
		value: f,
		defaultValue: y,
		onChange: m
	}), S = I(/* @__PURE__ */ new Map()), [C, w] = L("");
	N(() => {
		let e = n.filter((e) => Ye.has(e.status) && S.current.get(e.id) !== e.status);
		S.current = new Map(n.map((e) => [e.id, e.status])), e.length > 0 && w(e.map((e) => `${e.label}: ${g(`ops.status.${e.status}`)}`).join(". "));
	}, [n, g]);
	let T = F(() => {
		let e = {
			queued: 0,
			running: 0,
			succeeded: 0,
			failed: 0,
			cancelled: 0
		};
		for (let t of n) e[t.status] += 1;
		return e;
	}, [n]);
	if (n.length === 0) return null;
	let E = [
		T.running > 0 && g("ops.running", { count: T.running }),
		T.queued > 0 && g("ops.queued", { count: T.queued }),
		T.failed > 0 && g("ops.failed", { count: T.failed }),
		T.succeeded > 0 && g("ops.done", { count: T.succeeded })
	].filter(Boolean).join(" · "), D = n.some((e) => Ye.has(e.status)), O = /* @__PURE__ */ V("section", {
		className: "mtc-operations-tray",
		"aria-label": r ?? g("ops.title"),
		"data-open": b || void 0,
		"data-placement": h,
		children: [
			/* @__PURE__ */ B("div", {
				className: "mtc-operations-header",
				children: /* @__PURE__ */ V("button", {
					type: "button",
					className: "mtc-operations-toggle",
					"aria-expanded": b,
					"aria-controls": _,
					onClick: () => x(!b),
					children: [
						/* @__PURE__ */ B(o, {
							name: T.running > 0 ? "spinner" : T.failed > 0 ? "error" : "success",
							className: "mtc-operations-header-icon",
							"data-status": T.running > 0 ? "running" : T.failed > 0 ? "failed" : "succeeded"
						}),
						/* @__PURE__ */ B("span", {
							className: "mtc-operations-title",
							children: r ?? g("ops.title")
						}),
						/* @__PURE__ */ B("span", {
							className: "mtc-operations-summary",
							children: E
						}),
						/* @__PURE__ */ B(o, {
							name: "chevron-down",
							className: "mtc-operations-chevron",
							label: g(b ? "ops.hide" : "ops.show")
						})
					]
				})
			}),
			/* @__PURE__ */ B("span", {
				role: "status",
				className: "mtc-visually-hidden",
				children: C
			}),
			b && /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B("ul", {
				id: _,
				className: "mtc-operations-list",
				children: n.map((e) => {
					let t = Ye.has(e.status), n = e.progress === void 0 ? void 0 : Math.round(Math.min(1, Math.max(0, e.progress)) * 100);
					return /* @__PURE__ */ V("li", {
						className: "mtc-operation",
						"data-status": e.status,
						children: [
							/* @__PURE__ */ B(o, {
								name: Je[e.status],
								className: "mtc-operation-icon",
								label: g(`ops.status.${e.status}`)
							}),
							/* @__PURE__ */ V("div", {
								className: "mtc-operation-main",
								children: [
									/* @__PURE__ */ B("span", {
										className: "mtc-operation-label",
										title: e.label,
										children: e.label
									}),
									e.detail != null && /* @__PURE__ */ B("span", {
										className: "mtc-operation-detail",
										children: e.detail
									}),
									e.status === "running" && /* @__PURE__ */ B("span", {
										className: "mtc-operation-progress",
										role: "progressbar",
										"aria-label": e.label,
										"aria-valuemin": 0,
										"aria-valuemax": 100,
										"aria-valuenow": n,
										children: /* @__PURE__ */ B("span", {
											style: n === void 0 ? void 0 : { width: `${n}%` },
											"data-indeterminate": n === void 0 || void 0
										})
									})
								]
							}),
							/* @__PURE__ */ V("div", {
								className: "mtc-operation-actions",
								children: [
									!t && e.cancellable && i && /* @__PURE__ */ B(c, {
										icon: /* @__PURE__ */ B(o, { name: "close" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.cancel", { label: e.label }),
										onClick: () => i(e.id)
									}),
									e.status === "failed" && e.retryable && s && /* @__PURE__ */ B(c, {
										icon: /* @__PURE__ */ B(o, { name: "refresh" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.retry", { label: e.label }),
										onClick: () => s(e.id)
									}),
									t && l && /* @__PURE__ */ B(c, {
										icon: /* @__PURE__ */ B(o, { name: "minus" }),
										variant: "ghost",
										size: "small",
										"aria-label": g("ops.dismiss", { label: e.label }),
										onClick: () => l(e.id)
									})
								]
							})
						]
					}, e.id);
				})
			}), D && u && /* @__PURE__ */ B("div", {
				className: "mtc-operations-footer",
				children: /* @__PURE__ */ B(a, {
					size: "small",
					variant: "ghost",
					onClick: u,
					children: g("ops.clear")
				})
			})] })
		]
	});
	return h === "floating" && v ? re(O, v) : O;
}
//#endregion
//#region src/app/ProductShell.tsx
var $e = k(null);
function et() {
	let e = M($e);
	if (!e) throw Error("useProductShell must be used inside a ProductShell");
	return e;
}
function $(e) {
	let { pathname: t, search: n, hash: r } = e.location();
	return `${t}${n}${r}`;
}
function tt() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform ?? navigator.platform;
	return /Mac|iPhone|iPad|iPod/i.test(e ?? "");
}
function nt(e) {
	let { router: t, session: r, telemetry: a, mode: o = "standalone", embedOrigins: s = [], theme: c, density: l, locale: d, timeZone: f, messages: p } = e, m = o === "embed", h = F(() => m && typeof window < "u" ? qe({ allowedOrigins: s }) : null, [m]), _ = u(), [v, y] = L({}), b = je(r);
	N(() => t.subscribe(() => {
		let e = $(t);
		a?.record({
			type: "navigation",
			path: e,
			at: Date.now()
		}), h?.post({
			type: "mtc:navigated",
			version: 1,
			path: e
		});
	}), [
		t,
		a,
		h
	]), N(() => {
		r && b.status !== "loading" && (a?.record({
			type: "session",
			status: b.status,
			at: Date.now()
		}), b.status === "expired" && h?.post({
			type: "mtc:session-expired",
			version: 1
		}));
	}, [
		r,
		b.status,
		a,
		h
	]);
	let { pageTitle: x, product: { name: S } } = e;
	N(() => {
		typeof document < "u" && x !== void 0 && (document.title = `${x} · ${S}`);
	}, [x, S]), N(() => {
		if (!h) return;
		let n = h.subscribe((e) => {
			e.type === "mtc:navigate" ? t.navigate(e.path) : y({
				theme: e.theme,
				locale: e.locale,
				timeZone: e.timeZone
			});
		});
		return h.post({
			type: "mtc:ready",
			version: 1,
			product: e.product.name,
			path: $(t)
		}), n;
	}, [
		h,
		t,
		e.product.name
	]);
	let C = F(() => ({
		router: t,
		session: b,
		telemetry: a,
		embedded: m
	}), [
		t,
		b,
		a,
		m
	]);
	return /* @__PURE__ */ B(n, {
		theme: v.theme ?? c ?? _?.theme ?? "dark",
		density: l ?? _?.density,
		locale: d ?? v.locale,
		timeZone: v.timeZone ?? f,
		messages: p,
		className: "mtc-product-shell-root",
		children: /* @__PURE__ */ B(ve, {
			router: t,
			children: /* @__PURE__ */ B($e.Provider, {
				value: C,
				children: /* @__PURE__ */ B(i.Provider, {
					value: r !== void 0,
					children: /* @__PURE__ */ B(g, { children: m ? /* @__PURE__ */ B(st, {
						channel: h,
						...e,
						session: r,
						controller: b
					}) : /* @__PURE__ */ B(ot, {
						...e,
						session: r,
						controller: b
					}) })
				})
			})
		})
	});
}
function rt({ controller: e, session: t, router: n, children: i }) {
	if (e.status === "loading") return /* @__PURE__ */ B(s, {});
	if (e.status === "error") return /* @__PURE__ */ B(l, {
		error: e.error ?? void 0,
		onRetry: e.reload
	});
	if (e.status === "signed-out") {
		let i = e.session ?? void 0, a = t !== void 0 && (t.canSignIn?.(i) ?? !0);
		return /* @__PURE__ */ B(r, { onSignIn: a ? () => t.signIn($(n), i) : void 0 });
	}
	return /* @__PURE__ */ B(z, { children: i });
}
function it({ controller: e, session: n, router: r }) {
	let i = t(), [o, s] = L(!1);
	if (e.status !== "expired") return null;
	let c = async () => {
		s(!0);
		let t = await e.renew();
		s(!1), t || n?.signIn($(r), e.session ?? void 0);
	};
	return /* @__PURE__ */ B(O, {
		open: !0,
		onOpenChange: () => {},
		title: i("state.sessionExpired.title"),
		dismissible: !1,
		size: "small",
		footer: /* @__PURE__ */ B(a, {
			intent: "primary",
			variant: "solid",
			loading: o,
			onClick: () => void c(),
			children: i("state.sessionExpired.action")
		}),
		children: /* @__PURE__ */ B("p", {
			className: "mtc-shell-expired-text",
			children: i("state.sessionExpired.description")
		})
	});
}
function at(e) {
	return /* @__PURE__ */ B(Qe, {
		operations: e.operations ?? [],
		onCancel: e.onCancelOperation,
		onRetry: e.onRetryOperation,
		onDismiss: e.onDismissOperation
	});
}
function ot(e) {
	let { product: n, nav: r, activeNavId: i, scope: a, search: s, actions: l, accountMenu: u, status: d, inspector: f, router: m, controller: h, session: g } = e, v = t(), { pathname: y } = Q(), x = ne() === "mobile", [S, C] = L(!1), [w, T] = L(!1), [E, O] = L(!1), k = I(null), A = I(null), M = I(!1), P = I(!1), R = j((e) => {
		e || (M.current = A.current === document.activeElement), A.current = e, e && M.current && (M.current = !1, e.focus());
	}, []), z = j((e) => {
		e && (P.current = A.current === document.activeElement), O(e), !e && P.current && A.current?.focus();
	}, []);
	N(() => {
		s || (M.current = !1);
	}, [s]);
	let [re] = L(() => tt() ? "⌘ K" : "Ctrl K"), H = j((e) => {
		e.href && (m.navigate(e.href), T(!1));
	}, [m]), U = F(() => (r ?? []).map((e) => ({
		...e,
		items: e.items.map((e) => ({
			...e,
			href: e.href ? m.href(e.href) : void 0
		}))
	})), [r, m]), ie = i ?? (r ?? []).flatMap((e) => e.items).filter((e) => e.href && (y === e.href || y.startsWith(e.href === "/" ? "/" : `${e.href}/`))).sort((e, t) => (t.href?.length ?? 0) - (e.href?.length ?? 0))[0]?.id, W = (e) => {
		let t = r?.flatMap((e) => e.items).find((t) => t.id === e.id);
		t && H(t);
	}, G = h.session, K = [...u ?? [], ...g?.signOut ? [{
		id: "sign-out",
		label: v("shell.signOut"),
		icon: /* @__PURE__ */ B(o, { name: "sign-out" }),
		onSelect: () => void g.signOut?.()
	}] : []], q = G?.displayName ?? G?.subject, ae = !!(G?.authenticated && (q || K.length > 0)), J = (e) => /* @__PURE__ */ B(te, {
		label: v("shell.navigation"),
		sections: U,
		activeId: ie,
		onNavigate: W,
		collapsed: !e && S,
		onCollapsedChange: e ? void 0 : C,
		className: e ? "mtc-shell-drawer-rail" : "mtc-shell-rail"
	}), Y = s && /* @__PURE__ */ V("button", {
		ref: R,
		type: "button",
		className: "mtc-shell-search",
		"aria-label": s.placeholder ?? v("shell.search"),
		onClick: (e) => {
			e.currentTarget.focus(), z(!0);
		},
		children: [
			/* @__PURE__ */ B(o, { name: "search" }),
			/* @__PURE__ */ B("span", {
				className: "mtc-shell-search-text",
				children: s.placeholder ?? v("shell.search")
			}),
			/* @__PURE__ */ B(p, {
				"aria-hidden": "true",
				children: re
			})
		]
	});
	return /* @__PURE__ */ V("div", {
		className: "mtc-shell",
		"data-operations": e.operations?.length ? "true" : void 0,
		children: [
			/* @__PURE__ */ B("a", {
				className: "mtc-shell-skip",
				href: "#mtc-main",
				onClick: (e) => {
					e.preventDefault(), k.current?.focus();
				},
				children: v("shell.skip")
			}),
			/* @__PURE__ */ V("header", {
				className: "mtc-shell-topbar",
				"data-search": s ? "true" : void 0,
				children: [
					/* @__PURE__ */ V("div", {
						className: "mtc-shell-identity",
						children: [
							r && /* @__PURE__ */ B(c, {
								icon: /* @__PURE__ */ B(o, { name: "menu" }),
								"aria-label": v("shell.menu"),
								variant: "ghost",
								className: "mtc-shell-menu",
								onClick: () => T(!0)
							}),
							/* @__PURE__ */ V("a", {
								className: "mtc-shell-product",
								title: n.name,
								href: m.href(n.home ?? "/"),
								onClick: (e) => {
									e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || (e.preventDefault(), m.navigate(n.home ?? "/"));
								},
								children: [/* @__PURE__ */ B("span", {
									className: "mtc-shell-mark",
									"aria-hidden": "true",
									children: /* @__PURE__ */ B(o, { name: n.icon ?? "object" })
								}), /* @__PURE__ */ B("span", {
									className: "mtc-shell-product-name",
									children: n.name
								})]
							}),
							a && /* @__PURE__ */ B("div", {
								className: "mtc-shell-scope",
								children: a
							})
						]
					}),
					!x && Y,
					/* @__PURE__ */ V("div", {
						className: "mtc-shell-actions",
						children: [
							l && /* @__PURE__ */ B("div", {
								className: "mtc-shell-product-actions",
								children: l
							}),
							x && Y,
							ae && /* @__PURE__ */ B("div", {
								className: "mtc-shell-account",
								children: K.length > 0 ? /* @__PURE__ */ B(D, {
									label: v("shell.account"),
									align: "end",
									trigger: /* @__PURE__ */ B(_, {
										name: q ?? v("shell.account"),
										decorative: !0
									}),
									items: K
								}) : /* @__PURE__ */ B(_, { name: q ?? "" })
							})
						]
					})
				]
			}),
			r && /* @__PURE__ */ B("div", {
				className: "mtc-shell-rail-slot",
				children: J(!1)
			}),
			/* @__PURE__ */ B("main", {
				id: "mtc-main",
				ref: k,
				tabIndex: -1,
				className: "mtc-shell-main",
				children: /* @__PURE__ */ B(rt, { ...e })
			}),
			f && /* @__PURE__ */ B("aside", {
				className: "mtc-shell-inspector",
				"aria-label": v("shell.inspector"),
				children: f
			}),
			d && /* @__PURE__ */ B("footer", {
				className: "mtc-shell-status",
				children: d
			}),
			r && /* @__PURE__ */ B(ee, {
				open: w,
				onOpenChange: T,
				title: n.name,
				side: "left",
				width: 288,
				className: "mtc-shell-drawer",
				children: J(!0)
			}),
			s && /* @__PURE__ */ B(b, {
				open: E,
				onOpenChange: z,
				query: s.query,
				onQueryChange: s.onQueryChange,
				groups: s.groups,
				onSelect: s.onSelect,
				loading: s.loading,
				placeholder: s.placeholder
			}),
			/* @__PURE__ */ B(at, { ...e }),
			/* @__PURE__ */ B(it, { ...e })
		]
	});
}
function st(e) {
	let { channel: t } = e, n = I(null);
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
	}, [t]), /* @__PURE__ */ V("div", {
		ref: n,
		className: "mtc-shell-embedded",
		children: [
			/* @__PURE__ */ B("main", {
				id: "mtc-main",
				className: "mtc-shell-main",
				children: /* @__PURE__ */ B(rt, { ...e })
			}),
			/* @__PURE__ */ B(at, { ...e }),
			/* @__PURE__ */ B(it, { ...e })
		]
	});
}
//#endregion
export { Qe as OperationsTray, nt as ProductShell, Oe as RENEW_LEAD_MS, Ie as ResourceCacheProvider, xe as RouterLink, ve as RouterProvider, Te as SESSION_RENEWED, Ee as SESSION_RENEW_FAILED, T as SourceError, he as buildPath, qe as createEmbedChannel, de as createHistoryRouter, we as createHttpSessionPort, fe as createMemoryRouter, se as createProductFetch, Ne as createResourceCache, x as describeSourceError, le as ensureOk, C as isSourceError, me as matchPath, ge as matchRoutes, G as newTraceparent, Ke as parseEmbedHostMessage, v as parseRetryAfter, Ce as parseSessionBody, De as renewViaFrame, We as requestTelemetry, Re as resourceKey, S as responseRequestId, w as sourceErrorFromResponse, h as sourceErrorKindForCode, y as sourceErrorKindForStatus, E as toSourceError, Q as useLocation, et as useProductShell, He as useResource, Le as useResourceCache, be as useRoute, Z as useRouter, je as useSessionController };
