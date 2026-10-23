import { D as e, E as t, f as n, g as r, m as i } from "./States-9MUuKqo7.js";
import { i as a, o, r as s, t as c } from "./utils-lOoEiIAx.js";
import { createContext as l, forwardRef as u, useCallback as d, useContext as f, useEffect as p, useId as m, useMemo as h, useRef as g, useState as _ } from "react";
import { Fragment as v, jsx as y, jsxs as b } from "react/jsx-runtime";
import { createPortal as x } from "react-dom";
// src/components/Feedback.tsx
var S = u(function({ intent: e = "neutral", size: n = "small", onRemove: i, removeLabel: a, className: o, children: s, ...l }, u) {
	let d = t();
	return /* @__PURE__ */ b("span", {
		...l,
		ref: u,
		className: c("mtc-tag", o),
		"data-intent": e,
		"data-size": n,
		children: [/* @__PURE__ */ y("span", {
			className: "mtc-tag-label",
			children: s
		}), i && /* @__PURE__ */ y("button", {
			type: "button",
			onClick: i,
			"aria-label": a ?? d("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ y(r, { name: "close" })
		})]
	});
}), C = u(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ b("span", {
		...a,
		ref: o,
		className: c("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ y("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), /* @__PURE__ */ y("span", {
			className: "mtc-badge-label",
			children: i
		})]
	});
}), w = u(function({ title: e, intent: t = "info", icon: n, actions: i, className: a, children: o, role: s, ...l }, u) {
	let d = t === "danger" ? "error" : t === "warning" ? "warning" : t === "success" ? "success" : "info";
	return /* @__PURE__ */ b("div", {
		...l,
		ref: u,
		role: s ?? (t === "danger" ? "alert" : "status"),
		className: c("mtc-callout", a),
		"data-intent": t,
		children: [/* @__PURE__ */ y("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: n ?? /* @__PURE__ */ y(r, { name: d })
		}), /* @__PURE__ */ b("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ y("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ y("div", {
					className: "mtc-callout-body",
					children: o
				}),
				i && /* @__PURE__ */ y("div", {
					className: "mtc-callout-actions",
					children: i
				})
			]
		})]
	});
}), T = {
	ok: "success",
	warning: "warning",
	danger: "danger",
	info: "info",
	neutral: "neutral"
}, E = u(function({ tone: e = "neutral", size: t = "small", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ y(C, {
		...i,
		ref: a,
		dot: !0,
		intent: T[e],
		size: t,
		"data-tone": e,
		className: c("mtc-status-badge", n),
		children: r
	});
}), D = u(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ y("kbd", {
		...t,
		ref: n,
		className: c("mtc-kbd", e)
	});
});
function O(e) {
	let t = e.split(/[\s·._@-]+/u).filter((e) => /\p{L}|\p{N}/u.test(e));
	if (t.length === 0) return "?";
	let n = [...t[0]];
	if (t.length === 1) return n.slice(0, 2).join("").toUpperCase();
	let r = [...t[t.length - 1]];
	return `${n[0] ?? ""}${r[0] ?? ""}`.toUpperCase();
}
var k = u(function({ name: e, src: t, size: n = 24, decorative: r = !1, className: i, ...a }, o) {
	let [s, l] = _(!1);
	return p(() => l(!1), [t]), /* @__PURE__ */ y("span", {
		...a,
		ref: o,
		className: c("mtc-avatar", i),
		"data-size": n,
		role: r ? void 0 : "img",
		"aria-label": r ? void 0 : e,
		"aria-hidden": r || void 0,
		title: r ? void 0 : e,
		children: t && !s ? /* @__PURE__ */ y("img", {
			src: t,
			alt: "",
			onError: () => l(!0)
		}) : /* @__PURE__ */ y("span", {
			"aria-hidden": "true",
			children: O(e)
		})
	});
}), A = u(function({ width: e, height: t, shape: n = "line", lines: r, className: i, style: a, ...o }, s) {
	let l = (e) => typeof e == "number" ? `${e}px` : e;
	return r && r > 1 ? /* @__PURE__ */ y("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: c("mtc-skeleton-lines", i),
		style: {
			width: l(e),
			...a
		},
		children: Array.from({ length: r }, (e, t) => /* @__PURE__ */ y("span", {
			className: "mtc-skeleton",
			"data-shape": "line",
			style: t === r - 1 ? { width: "60%" } : void 0
		}, t))
	}) : /* @__PURE__ */ y("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: c("mtc-skeleton", i),
		"data-shape": n,
		style: {
			width: l(e),
			height: l(t),
			...a
		}
	});
}), j = 1500, M = u(function({ value: e, label: n, copiedLabel: a, size: o = "small", clipboard: s, onCopied: l, className: u, ...d }, f) {
	let m = t(), [h, v] = _(!1), x = g(void 0);
	p(() => () => clearTimeout(x.current), []);
	let S = async () => {
		let t = s ?? (typeof navigator < "u" ? navigator.clipboard : void 0);
		if (t) {
			try {
				await t.writeText(e);
			} catch {
				return;
			}
			v(!0), l?.(e), clearTimeout(x.current), x.current = setTimeout(() => v(!1), j);
		}
	};
	return /* @__PURE__ */ b("span", {
		className: c("mtc-copy-button", u),
		"data-copied": h || void 0,
		children: [/* @__PURE__ */ y(i, {
			...d,
			ref: f,
			variant: "ghost",
			size: o,
			icon: /* @__PURE__ */ y(r, { name: h ? "check" : "copy" }),
			"aria-label": n ?? m("copy.label"),
			onClick: () => void S()
		}), /* @__PURE__ */ y("span", {
			role: "status",
			className: "mtc-visually-hidden",
			children: h ? a ?? m("copy.copied") : ""
		})]
	});
}), N = u(function({ items: e, className: t, ...n }, r) {
	return /* @__PURE__ */ y("ul", {
		...n,
		ref: r,
		className: c("mtc-meta-row", t),
		children: e.filter((e) => e != null && e !== !1).map((e, t) => /* @__PURE__ */ y("li", {
			className: "mtc-meta-item",
			children: e
		}, t))
	});
}), P = u(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ y("span", {
		...t,
		ref: n,
		className: c("mtc-visually-hidden", e)
	});
}), F = u(function({ as: e = "p", tone: t = "default", size: n = "md", className: r, ...i }, a) {
	return /* @__PURE__ */ y(e, {
		...i,
		ref: a,
		className: c("mtc-text", r),
		"data-tone": t === "muted" ? t : void 0,
		"data-size": n === "sm" ? n : void 0
	});
}), I = u(function({ title: e, subtitle: t, actions: n, footer: r, headingLevel: i = 2, padded: a = !1, className: o, children: s, ...l }, u) {
	let d = m(), f = `h${i}`;
	return /* @__PURE__ */ b("section", {
		...l,
		ref: u,
		"aria-labelledby": d,
		className: c("mtc-panel", o),
		children: [
			/* @__PURE__ */ b("header", {
				className: "mtc-panel-header",
				children: [
					/* @__PURE__ */ y(f, {
						id: d,
						className: "mtc-panel-title",
						children: e
					}),
					t != null && /* @__PURE__ */ y("span", {
						className: "mtc-panel-subtitle",
						children: t
					}),
					n && /* @__PURE__ */ y("div", {
						className: "mtc-panel-actions",
						children: n
					})
				]
			}),
			/* @__PURE__ */ y("div", {
				className: "mtc-panel-body",
				"data-padded": a || void 0,
				children: s
			}),
			r && /* @__PURE__ */ y("footer", {
				className: "mtc-panel-footer",
				children: r
			})
		]
	});
});
// src/components/CommandPalette.tsx
function L({ open: n, onOpenChange: i, query: c, onQueryChange: l, groups: u, onSelect: d, onSubmit: f, autoHighlight: S = !0, label: C, placeholder: w, loading: T = !1, emptyLabel: E, footer: O, hotkey: k = !0 }) {
	let A = t(), j = e(), M = m(), N = g(null), P = g(null), F = g(null), I = h(() => u.flatMap((e) => e.items.filter((e) => !e.disabled)), [u]), [L, R] = _(null);
	if (o(n, N, P), p(() => {
		R(S ? I[0]?.id ?? null : null);
	}, [I, S]), p(() => {
		if (!k) return;
		let e = (e) => {
			e.defaultPrevented || e.isComposing || a(e.target) && !N.current?.contains(e.target) || (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && (e.preventDefault(), i(!n));
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		k,
		n,
		i
	]), p(() => {
		L && F.current?.querySelector(`[data-command-id="${CSS.escape(L)}"]`)?.scrollIntoView({ block: "nearest" });
	}, [L]), !n) return null;
	let z = (e) => `${M}-option-${e}`, B = (e) => {
		if (I.length === 0) return;
		let t = L ? I.findIndex((e) => e.id === L) : -1, n = t < 0 ? e === 1 ? 0 : I.length - 1 : (t + e + I.length) % I.length;
		R(I[n].id);
	}, V = (e) => {
		e.disabled || (d(e), i(!1));
	}, H = /* @__PURE__ */ y("div", {
		className: "mtc-modal-backdrop mtc-overlay mtc-command-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && i(!1);
		},
		children: /* @__PURE__ */ b("div", {
			ref: N,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": C ?? A("palette.label"),
			tabIndex: -1,
			className: "mtc-command-palette",
			onKeyDown: (e) => s(e, N, !0, () => i(!1)),
			children: [
				/* @__PURE__ */ b("div", {
					className: "mtc-command-input-row",
					children: [
						/* @__PURE__ */ y(r, {
							name: "search",
							className: "mtc-command-input-icon"
						}),
						/* @__PURE__ */ y("input", {
							ref: P,
							type: "text",
							role: "combobox",
							"aria-expanded": "true",
							"aria-controls": `${M}-listbox`,
							"aria-activedescendant": L ? z(L) : void 0,
							"aria-autocomplete": "list",
							"aria-label": C ?? A("palette.label"),
							placeholder: w ?? A("palette.placeholder"),
							className: "mtc-command-input",
							value: c,
							onChange: (e) => l(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault(), B(e.key === "ArrowDown" ? 1 : -1);
								else if (e.key === "Enter") {
									e.preventDefault();
									let t = L ? I.find((e) => e.id === L) : void 0;
									t ? V(t) : f && (f(c), i(!1));
								}
							}
						}),
						T && /* @__PURE__ */ y(r, {
							name: "spinner",
							className: "mtc-command-spinner",
							label: A("palette.loading")
						})
					]
				}),
				/* @__PURE__ */ b("div", {
					ref: F,
					id: `${M}-listbox`,
					role: "listbox",
					"aria-label": A("palette.results"),
					className: "mtc-command-list",
					children: [u.map((e) => e.items.length > 0 && /* @__PURE__ */ b("div", {
						role: "group",
						"aria-labelledby": `${M}-group-${e.id}`,
						className: "mtc-command-group",
						children: [/* @__PURE__ */ y("div", {
							id: `${M}-group-${e.id}`,
							className: "mtc-command-group-label",
							role: "presentation",
							children: e.label
						}), e.items.map((e) => /* @__PURE__ */ b("div", {
							id: z(e.id),
							role: "option",
							"aria-selected": e.id === L,
							"aria-disabled": e.disabled || void 0,
							"data-command-id": e.id,
							className: "mtc-command-item",
							onMouseMove: () => {
								!e.disabled && e.id !== L && R(e.id);
							},
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => V(e),
							children: [
								e.icon && /* @__PURE__ */ y("span", {
									className: "mtc-command-item-icon",
									children: e.icon
								}),
								/* @__PURE__ */ b("span", {
									className: "mtc-command-item-copy",
									children: [/* @__PURE__ */ y("span", {
										className: "mtc-command-item-label",
										children: e.label
									}), e.description && /* @__PURE__ */ y("span", {
										className: "mtc-command-item-description",
										children: e.description
									})]
								}),
								e.shortcut && /* @__PURE__ */ y(D, { children: e.shortcut })
							]
						}, e.id))]
					}, e.id)), I.length === 0 && c.trim() !== "" && !T && /* @__PURE__ */ y("div", {
						className: "mtc-command-empty",
						role: "presentation",
						children: E ?? A("palette.empty")
					})]
				}),
				/* @__PURE__ */ y("div", {
					className: "mtc-command-footer",
					children: O ?? /* @__PURE__ */ b(v, { children: [
						/* @__PURE__ */ b("span", { children: [
							/* @__PURE__ */ y(D, { children: "↑" }),
							" ",
							/* @__PURE__ */ y(D, { children: "↓" }),
							" ",
							A("palette.navigate")
						] }),
						/* @__PURE__ */ b("span", { children: [
							/* @__PURE__ */ y(D, { children: "↵" }),
							" ",
							A("palette.select")
						] }),
						/* @__PURE__ */ b("span", { children: [
							/* @__PURE__ */ y(D, { children: "Esc" }),
							" ",
							A("palette.close")
						] })
					] })
				})
			]
		})
	});
	return j ? x(H, j) : H;
}
// src/components/Toast.tsx
var R = {
	neutral: "info",
	info: "info",
	success: "success",
	warning: "warning",
	danger: "error"
}, z = 5e3, B = 8e3;
function V({ toast: e, onDismiss: a }) {
	let o = t(), s = e.intent ?? "neutral", c = e.duration ?? (s === "danger" ? B : z), [l, u] = _(!1), d = g(c);
	return p(() => {
		if (c <= 0 || l) return;
		let t = Date.now(), n = setTimeout(() => a(e.id), d.current);
		return () => {
			clearTimeout(n), d.current = Math.max(0, d.current - (Date.now() - t));
		};
	}, [
		c,
		l,
		a,
		e.id
	]), /* @__PURE__ */ b("li", {
		className: "mtc-toast",
		"data-intent": s,
		role: s === "danger" ? "alert" : "status",
		onMouseEnter: () => u(!0),
		onMouseLeave: () => u(!1),
		onFocus: () => u(!0),
		onBlur: () => u(!1),
		children: [
			/* @__PURE__ */ y(r, {
				name: R[s],
				className: "mtc-toast-icon"
			}),
			/* @__PURE__ */ b("div", {
				className: "mtc-toast-content",
				children: [
					/* @__PURE__ */ y("div", {
						className: "mtc-toast-title",
						children: e.title
					}),
					e.description && /* @__PURE__ */ y("div", {
						className: "mtc-toast-description",
						children: e.description
					}),
					e.action && /* @__PURE__ */ y(n, {
						size: "small",
						variant: "ghost",
						intent: "primary",
						className: "mtc-toast-action",
						onClick: () => {
							e.action?.onClick(), a(e.id);
						},
						children: e.action.label
					})
				]
			}),
			/* @__PURE__ */ y(i, {
				icon: /* @__PURE__ */ y(r, { name: "close" }),
				"aria-label": o("toast.dismiss"),
				variant: "ghost",
				size: "small",
				onClick: () => a(e.id)
			})
		]
	});
}
function H({ toasts: n, onDismiss: r, placement: i = "bottom-end" }) {
	let a = t(), o = e();
	if (n.length === 0) return null;
	let s = /* @__PURE__ */ y("section", {
		"aria-label": a("toast.region"),
		className: "mtc-toaster",
		"data-placement": i,
		children: /* @__PURE__ */ y("ol", { children: n.map((e) => /* @__PURE__ */ y(V, {
			toast: e,
			onDismiss: r
		}, e.id)) })
	});
	return o ? x(s, o) : s;
}
var U = l(null);
function W({ children: e, limit: t = 4, placement: n }) {
	let [r, i] = _([]), a = g(0), o = d((e) => {
		i((t) => t.filter((t) => t.id !== e));
	}, []), s = d(({ id: e, ...n }) => {
		a.current += 1;
		let r = e ?? `toast-${a.current}`;
		return i((e) => [...e.filter((e) => e.id !== r), {
			...n,
			id: r
		}].slice(-t)), r;
	}, [t]), c = h(() => ({
		toast: s,
		dismiss: o
	}), [s, o]);
	return /* @__PURE__ */ b(U.Provider, {
		value: c,
		children: [e, /* @__PURE__ */ y(H, {
			toasts: r,
			onDismiss: o,
			placement: n
		})]
	});
}
function G() {
	let e = f(U);
	if (!e) throw Error("useToast must be used inside a ToastProvider");
	return e;
}
// src/core/sourceError.ts
var K = class extends Error {
	kind;
	status;
	code;
	requestId;
	retryAfterMs;
	constructor(e, t) {
		super(e), this.name = "SourceError", this.kind = t.kind, this.status = t.status, this.code = t.code, this.requestId = t.requestId, this.retryAfterMs = t.retryAfterMs;
	}
};
function q(e) {
	return e instanceof K || e instanceof Error && e.name === "SourceError" && typeof e.kind == "string";
}
var J = [
	"ok",
	"canceled",
	"unknown",
	"invalid_argument",
	"deadline_exceeded",
	"not_found",
	"already_exists",
	"permission_denied",
	"resource_exhausted",
	"failed_precondition",
	"aborted",
	"out_of_range",
	"unimplemented",
	"internal",
	"unavailable",
	"data_loss",
	"unauthenticated"
], ee = {
	unauthenticated: "unauthenticated",
	permission_denied: "forbidden",
	not_found: "not_found",
	resource_exhausted: "rate_limited",
	unavailable: "unavailable",
	deadline_exceeded: "unavailable",
	invalid_argument: "invalid",
	failed_precondition: "invalid",
	out_of_range: "invalid",
	already_exists: "invalid"
};
function Y(e) {
	return ee[e] ?? "unknown";
}
function X(e) {
	return e === 401 ? "unauthenticated" : e === 403 ? "forbidden" : e === 404 || e === 410 ? "not_found" : e === 429 ? "rate_limited" : e === 408 || e === 502 || e === 503 || e === 504 ? "unavailable" : e === 400 || e === 409 || e === 412 || e === 422 ? "invalid" : "unknown";
}
var te = [
	"x-request-id",
	"request-id",
	"x-correlation-id"
];
function Z(e) {
	for (let t of te) {
		let n = e.get(t)?.trim();
		if (n) return n;
	}
}
function Q(e, t = Date.now()) {
	if (!e) return;
	let n = e.trim();
	if (/^\d+$/.test(n)) return Number(n) * 1e3;
	let r = Date.parse(n);
	if (!(Number.isNaN(r) || r <= t)) return r - t;
}
var ne = 16384, $ = /* @__PURE__ */ new WeakMap();
function re(e, t) {
	$.set(e, t);
}
async function ie(e, t) {
	if (!e.body) return "";
	let n = e.body.getReader(), r = new TextDecoder(), i = "";
	try {
		for (; i.length < t;) {
			let { done: e, value: t } = await n.read();
			if (e) return i + r.decode();
			i += r.decode(t, { stream: !0 });
		}
	} finally {
		n.cancel().catch(() => {});
	}
	return i.slice(0, t);
}
async function ae(e, t = {}) {
	let n, r, i = e.headers.get("content-type") ?? "";
	if (/\bjson\b/i.test(i)) try {
		let t = await ie(e, ne), i = JSON.parse(t);
		typeof i?.code == "string" && i.code && (n = i.code), typeof i?.message == "string" && i.message.trim() && (r = i.message.trim());
	} catch {}
	return new K(r ?? `HTTP ${e.status}`, {
		kind: n ? Y(n) : X(e.status),
		status: e.status,
		code: n,
		requestId: Z(e.headers) ?? t.requestId ?? $.get(e),
		retryAfterMs: Q(e.headers.get("retry-after"), t.now)
	});
}
function oe(e) {
	if (q(e)) return e;
	let t = e instanceof Error ? e.cause : void 0;
	if (q(t)) return t;
	let n = e, r = typeof n?.code == "number" ? J[n.code] : typeof n?.code == "string" && J.includes(n.code) ? n.code : void 0, i = typeof n?.rawMessage == "string" && n.rawMessage ? n.rawMessage : e instanceof Error ? e.message : String(e);
	if (r && r !== "ok") {
		let e = n?.metadata instanceof Headers ? n.metadata : void 0;
		return new K(i, {
			kind: Y(r),
			code: r,
			requestId: e ? Z(e) : void 0
		});
	}
	return e instanceof Error && (e.name === "TimeoutError" || e.name === "TypeError") ? new K(i, { kind: "unavailable" }) : new K(i, { kind: "unknown" });
}
function se(e) {
	return e.code ? `${e.code}: ${e.message}` : e.message;
}
export { P as C, S as D, w as E, F as S, C as T, D as _, re as a, A as b, Y as c, W as d, H as f, M as g, k as h, Q as i, X as l, L as m, se as n, Z as o, G as p, q as r, ae as s, K as t, oe as u, N as v, O as w, E as x, I as y };
