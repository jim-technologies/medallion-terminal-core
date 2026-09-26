import { E as e, T as t, d as n, h as r, p as i } from "./States-Ds3cxTem.js";
import { i as a, n as o, t as s } from "./utils-j4lJ7S1v.js";
import { createContext as c, forwardRef as l, useCallback as u, useContext as d, useEffect as f, useId as p, useMemo as m, useRef as h, useState as g } from "react";
import { Fragment as _, jsx as v, jsxs as y } from "react/jsx-runtime";
import { createPortal as b } from "react-dom";
//#region src/components/Feedback.tsx
var x = l(function({ intent: e = "neutral", size: n = "small", onRemove: i, removeLabel: a, className: o, children: c, ...l }, u) {
	let d = t();
	return /* @__PURE__ */ y("span", {
		...l,
		ref: u,
		className: s("mtc-tag", o),
		"data-intent": e,
		"data-size": n,
		children: [/* @__PURE__ */ v("span", { children: c }), i && /* @__PURE__ */ v("button", {
			type: "button",
			onClick: i,
			"aria-label": a ?? d("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ v(r, { name: "close" })
		})]
	});
}), S = l(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ y("span", {
		...a,
		ref: o,
		className: s("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ v("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), i]
	});
}), C = l(function({ title: e, intent: t = "info", icon: n, actions: i, className: a, children: o, role: c, ...l }, u) {
	let d = t === "danger" ? "error" : t === "warning" ? "warning" : t === "success" ? "success" : "info";
	return /* @__PURE__ */ y("div", {
		...l,
		ref: u,
		role: c ?? (t === "danger" ? "alert" : "status"),
		className: s("mtc-callout", a),
		"data-intent": t,
		children: [/* @__PURE__ */ v("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: n ?? /* @__PURE__ */ v(r, { name: d })
		}), /* @__PURE__ */ y("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ v("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ v("div", {
					className: "mtc-callout-body",
					children: o
				}),
				i && /* @__PURE__ */ v("div", {
					className: "mtc-callout-actions",
					children: i
				})
			]
		})]
	});
}), w = {
	ok: "success",
	warning: "warning",
	danger: "danger",
	info: "info",
	neutral: "neutral"
}, T = l(function({ tone: e = "neutral", size: t = "small", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ v(S, {
		...i,
		ref: a,
		dot: !0,
		intent: w[e],
		size: t,
		"data-tone": e,
		className: s("mtc-status-badge", n),
		children: r
	});
}), E = l(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ v("kbd", {
		...t,
		ref: n,
		className: s("mtc-kbd", e)
	});
});
function D(e) {
	let t = e.split(/[\s·._@-]+/u).filter((e) => /\p{L}|\p{N}/u.test(e));
	if (t.length === 0) return "?";
	let n = [...t[0]];
	if (t.length === 1) return n.slice(0, 2).join("").toUpperCase();
	let r = [...t[t.length - 1]];
	return `${n[0] ?? ""}${r[0] ?? ""}`.toUpperCase();
}
var O = l(function({ name: e, src: t, size: n = 24, decorative: r = !1, className: i, ...a }, o) {
	let [c, l] = g(!1);
	return f(() => l(!1), [t]), /* @__PURE__ */ v("span", {
		...a,
		ref: o,
		className: s("mtc-avatar", i),
		"data-size": n,
		role: r ? void 0 : "img",
		"aria-label": r ? void 0 : e,
		"aria-hidden": r || void 0,
		title: r ? void 0 : e,
		children: t && !c ? /* @__PURE__ */ v("img", {
			src: t,
			alt: "",
			onError: () => l(!0)
		}) : /* @__PURE__ */ v("span", {
			"aria-hidden": "true",
			children: D(e)
		})
	});
}), k = l(function({ width: e, height: t, shape: n = "line", lines: r, className: i, style: a, ...o }, c) {
	let l = (e) => typeof e == "number" ? `${e}px` : e;
	return r && r > 1 ? /* @__PURE__ */ v("span", {
		...o,
		ref: c,
		"aria-hidden": "true",
		className: s("mtc-skeleton-lines", i),
		style: {
			width: l(e),
			...a
		},
		children: Array.from({ length: r }, (e, t) => /* @__PURE__ */ v("span", {
			className: "mtc-skeleton",
			"data-shape": "line",
			style: t === r - 1 ? { width: "60%" } : void 0
		}, t))
	}) : /* @__PURE__ */ v("span", {
		...o,
		ref: c,
		"aria-hidden": "true",
		className: s("mtc-skeleton", i),
		"data-shape": n,
		style: {
			width: l(e),
			height: l(t),
			...a
		}
	});
}), A = 1500, j = l(function({ value: e, label: n, copiedLabel: a, size: o = "small", clipboard: c, onCopied: l, className: u, ...d }, p) {
	let m = t(), [_, b] = g(!1), x = h(void 0);
	f(() => () => clearTimeout(x.current), []);
	let S = async () => {
		let t = c ?? (typeof navigator < "u" ? navigator.clipboard : void 0);
		if (t) {
			try {
				await t.writeText(e);
			} catch {
				return;
			}
			b(!0), l?.(e), clearTimeout(x.current), x.current = setTimeout(() => b(!1), A);
		}
	};
	return /* @__PURE__ */ y("span", {
		className: s("mtc-copy-button", u),
		"data-copied": _ || void 0,
		children: [/* @__PURE__ */ v(i, {
			...d,
			ref: p,
			variant: "ghost",
			size: o,
			icon: /* @__PURE__ */ v(r, { name: _ ? "check" : "copy" }),
			"aria-label": n ?? m("copy.label"),
			onClick: () => void S()
		}), /* @__PURE__ */ v("span", {
			role: "status",
			className: "mtc-visually-hidden",
			children: _ ? a ?? m("copy.copied") : ""
		})]
	});
}), M = l(function({ items: e, className: t, ...n }, r) {
	return /* @__PURE__ */ v("ul", {
		...n,
		ref: r,
		className: s("mtc-meta-row", t),
		children: e.filter((e) => e != null && e !== !1).map((e, t) => /* @__PURE__ */ v("li", {
			className: "mtc-meta-item",
			children: e
		}, t))
	});
}), N = l(function({ title: e, subtitle: t, actions: n, footer: r, headingLevel: i = 2, padded: a = !1, className: o, children: c, ...l }, u) {
	let d = p(), f = `h${i}`;
	return /* @__PURE__ */ y("section", {
		...l,
		ref: u,
		"aria-labelledby": d,
		className: s("mtc-panel", o),
		children: [
			/* @__PURE__ */ y("header", {
				className: "mtc-panel-header",
				children: [
					/* @__PURE__ */ v(f, {
						id: d,
						className: "mtc-panel-title",
						children: e
					}),
					t != null && /* @__PURE__ */ v("span", {
						className: "mtc-panel-subtitle",
						children: t
					}),
					n && /* @__PURE__ */ v("div", {
						className: "mtc-panel-actions",
						children: n
					})
				]
			}),
			/* @__PURE__ */ v("div", {
				className: "mtc-panel-body",
				"data-padded": a || void 0,
				children: c
			}),
			r && /* @__PURE__ */ v("footer", {
				className: "mtc-panel-footer",
				children: r
			})
		]
	});
});
//#endregion
//#region src/components/CommandPalette.tsx
function P({ open: n, onOpenChange: i, query: s, onQueryChange: c, groups: l, onSelect: u, onSubmit: d, autoHighlight: x = !0, label: S, placeholder: C, loading: w = !1, emptyLabel: T, footer: D, hotkey: O = !0 }) {
	let k = t(), A = e(), j = p(), M = h(null), N = h(null), P = h(null), F = m(() => l.flatMap((e) => e.items.filter((e) => !e.disabled)), [l]), [I, L] = g(null);
	if (a(n, M, N), f(() => {
		L(x ? F[0]?.id ?? null : null);
	}, [F, x]), f(() => {
		if (!O) return;
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && (e.preventDefault(), i(!n));
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		O,
		n,
		i
	]), f(() => {
		I && P.current?.querySelector(`[data-command-id="${CSS.escape(I)}"]`)?.scrollIntoView({ block: "nearest" });
	}, [I]), !n) return null;
	let R = (e) => `${j}-option-${e}`, z = (e) => {
		if (F.length === 0) return;
		let t = I ? F.findIndex((e) => e.id === I) : -1, n = t < 0 ? e === 1 ? 0 : F.length - 1 : (t + e + F.length) % F.length;
		L(F[n].id);
	}, B = (e) => {
		e.disabled || (u(e), i(!1));
	}, V = /* @__PURE__ */ v("div", {
		className: "mtc-modal-backdrop mtc-overlay mtc-command-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && i(!1);
		},
		children: /* @__PURE__ */ y("div", {
			ref: M,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": S ?? k("palette.label"),
			tabIndex: -1,
			className: "mtc-command-palette",
			onKeyDown: (e) => o(e, M, !0, () => i(!1)),
			children: [
				/* @__PURE__ */ y("div", {
					className: "mtc-command-input-row",
					children: [
						/* @__PURE__ */ v(r, {
							name: "search",
							className: "mtc-command-input-icon"
						}),
						/* @__PURE__ */ v("input", {
							ref: N,
							type: "text",
							role: "combobox",
							"aria-expanded": "true",
							"aria-controls": `${j}-listbox`,
							"aria-activedescendant": I ? R(I) : void 0,
							"aria-autocomplete": "list",
							"aria-label": S ?? k("palette.label"),
							placeholder: C ?? k("palette.placeholder"),
							className: "mtc-command-input",
							value: s,
							onChange: (e) => c(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault(), z(e.key === "ArrowDown" ? 1 : -1);
								else if (e.key === "Enter") {
									e.preventDefault();
									let t = I ? F.find((e) => e.id === I) : void 0;
									t ? B(t) : d && (d(s), i(!1));
								}
							}
						}),
						w && /* @__PURE__ */ v(r, {
							name: "spinner",
							className: "mtc-command-spinner",
							label: k("palette.loading")
						})
					]
				}),
				/* @__PURE__ */ y("div", {
					ref: P,
					id: `${j}-listbox`,
					role: "listbox",
					"aria-label": k("palette.results"),
					className: "mtc-command-list",
					children: [l.map((e) => e.items.length > 0 && /* @__PURE__ */ y("div", {
						role: "group",
						"aria-labelledby": `${j}-group-${e.id}`,
						className: "mtc-command-group",
						children: [/* @__PURE__ */ v("div", {
							id: `${j}-group-${e.id}`,
							className: "mtc-command-group-label",
							role: "presentation",
							children: e.label
						}), e.items.map((e) => /* @__PURE__ */ y("div", {
							id: R(e.id),
							role: "option",
							"aria-selected": e.id === I,
							"aria-disabled": e.disabled || void 0,
							"data-command-id": e.id,
							className: "mtc-command-item",
							onMouseMove: () => {
								!e.disabled && e.id !== I && L(e.id);
							},
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => B(e),
							children: [
								e.icon && /* @__PURE__ */ v("span", {
									className: "mtc-command-item-icon",
									children: e.icon
								}),
								/* @__PURE__ */ y("span", {
									className: "mtc-command-item-copy",
									children: [/* @__PURE__ */ v("span", {
										className: "mtc-command-item-label",
										children: e.label
									}), e.description && /* @__PURE__ */ v("span", {
										className: "mtc-command-item-description",
										children: e.description
									})]
								}),
								e.shortcut && /* @__PURE__ */ v(E, { children: e.shortcut })
							]
						}, e.id))]
					}, e.id)), F.length === 0 && s.trim() !== "" && !w && /* @__PURE__ */ v("div", {
						className: "mtc-command-empty",
						role: "presentation",
						children: T ?? k("palette.empty")
					})]
				}),
				/* @__PURE__ */ v("div", {
					className: "mtc-command-footer",
					children: D ?? /* @__PURE__ */ y(_, { children: [
						/* @__PURE__ */ y("span", { children: [
							/* @__PURE__ */ v(E, { children: "↑" }),
							" ",
							/* @__PURE__ */ v(E, { children: "↓" }),
							" ",
							k("palette.navigate")
						] }),
						/* @__PURE__ */ y("span", { children: [
							/* @__PURE__ */ v(E, { children: "↵" }),
							" ",
							k("palette.select")
						] }),
						/* @__PURE__ */ y("span", { children: [
							/* @__PURE__ */ v(E, { children: "Esc" }),
							" ",
							k("palette.close")
						] })
					] })
				})
			]
		})
	});
	return A ? b(V, A) : V;
}
//#endregion
//#region src/components/Toast.tsx
var F = {
	neutral: "info",
	info: "info",
	success: "success",
	warning: "warning",
	danger: "error"
}, I = 5e3, L = 8e3;
function R({ toast: e, onDismiss: a }) {
	let o = t(), s = e.intent ?? "neutral", c = e.duration ?? (s === "danger" ? L : I), [l, u] = g(!1), d = h(c);
	return f(() => {
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
	]), /* @__PURE__ */ y("li", {
		className: "mtc-toast",
		"data-intent": s,
		role: s === "danger" ? "alert" : "status",
		onMouseEnter: () => u(!0),
		onMouseLeave: () => u(!1),
		onFocus: () => u(!0),
		onBlur: () => u(!1),
		children: [
			/* @__PURE__ */ v(r, {
				name: F[s],
				className: "mtc-toast-icon"
			}),
			/* @__PURE__ */ y("div", {
				className: "mtc-toast-content",
				children: [
					/* @__PURE__ */ v("div", {
						className: "mtc-toast-title",
						children: e.title
					}),
					e.description && /* @__PURE__ */ v("div", {
						className: "mtc-toast-description",
						children: e.description
					}),
					e.action && /* @__PURE__ */ v(n, {
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
			/* @__PURE__ */ v(i, {
				icon: /* @__PURE__ */ v(r, { name: "close" }),
				"aria-label": o("toast.dismiss"),
				variant: "ghost",
				size: "small",
				onClick: () => a(e.id)
			})
		]
	});
}
function z({ toasts: n, onDismiss: r, placement: i = "bottom-end" }) {
	let a = t(), o = e();
	if (n.length === 0) return null;
	let s = /* @__PURE__ */ v("section", {
		"aria-label": a("toast.region"),
		className: "mtc-toaster",
		"data-placement": i,
		children: /* @__PURE__ */ v("ol", { children: n.map((e) => /* @__PURE__ */ v(R, {
			toast: e,
			onDismiss: r
		}, e.id)) })
	});
	return o ? b(s, o) : s;
}
var B = c(null);
function V({ children: e, limit: t = 4, placement: n }) {
	let [r, i] = g([]), a = h(0), o = u((e) => {
		i((t) => t.filter((t) => t.id !== e));
	}, []), s = u(({ id: e, ...n }) => {
		a.current += 1;
		let r = e ?? `toast-${a.current}`;
		return i((e) => [...e.filter((e) => e.id !== r), {
			...n,
			id: r
		}].slice(-t)), r;
	}, [t]), c = m(() => ({
		toast: s,
		dismiss: o
	}), [s, o]);
	return /* @__PURE__ */ y(B.Provider, {
		value: c,
		children: [e, /* @__PURE__ */ v(z, {
			toasts: r,
			onDismiss: o,
			placement: n
		})]
	});
}
function H() {
	let e = d(B);
	if (!e) throw Error("useToast must be used inside a ToastProvider");
	return e;
}
//#endregion
//#region src/core/sourceError.ts
var U = class extends Error {
	kind;
	status;
	code;
	requestId;
	retryAfterMs;
	constructor(e, t) {
		super(e), this.name = "SourceError", this.kind = t.kind, this.status = t.status, this.code = t.code, this.requestId = t.requestId, this.retryAfterMs = t.retryAfterMs;
	}
};
function W(e) {
	return e instanceof U || e instanceof Error && e.name === "SourceError" && typeof e.kind == "string";
}
var G = [
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
], K = {
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
function q(e) {
	return K[e] ?? "unknown";
}
function J(e) {
	return e === 401 ? "unauthenticated" : e === 403 ? "forbidden" : e === 404 || e === 410 ? "not_found" : e === 429 ? "rate_limited" : e === 408 || e === 502 || e === 503 || e === 504 ? "unavailable" : e === 400 || e === 409 || e === 412 || e === 422 ? "invalid" : "unknown";
}
var Y = [
	"x-request-id",
	"request-id",
	"x-correlation-id"
];
function X(e) {
	for (let t of Y) {
		let n = e.get(t)?.trim();
		if (n) return n;
	}
}
function Z(e, t = Date.now()) {
	if (!e) return;
	let n = e.trim();
	if (/^\d+$/.test(n)) return Number(n) * 1e3;
	let r = Date.parse(n);
	if (!(Number.isNaN(r) || r <= t)) return r - t;
}
var Q = 16384, $ = /* @__PURE__ */ new WeakMap();
function ee(e, t) {
	$.set(e, t);
}
async function te(e, t) {
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
async function ne(e, t = {}) {
	let n, r, i = e.headers.get("content-type") ?? "";
	if (/\bjson\b/i.test(i)) try {
		let t = await te(e, Q), i = JSON.parse(t);
		typeof i?.code == "string" && i.code && (n = i.code), typeof i?.message == "string" && i.message.trim() && (r = i.message.trim());
	} catch {}
	return new U(r ?? `HTTP ${e.status}`, {
		kind: n ? q(n) : J(e.status),
		status: e.status,
		code: n,
		requestId: X(e.headers) ?? t.requestId ?? $.get(e),
		retryAfterMs: Z(e.headers.get("retry-after"), t.now)
	});
}
function re(e) {
	if (W(e)) return e;
	let t = e instanceof Error ? e.cause : void 0;
	if (W(t)) return t;
	let n = e, r = typeof n?.code == "number" ? G[n.code] : typeof n?.code == "string" && G.includes(n.code) ? n.code : void 0, i = typeof n?.rawMessage == "string" && n.rawMessage ? n.rawMessage : e instanceof Error ? e.message : String(e);
	if (r && r !== "ok") {
		let e = n?.metadata instanceof Headers ? n.metadata : void 0;
		return new U(i, {
			kind: q(r),
			code: r,
			requestId: e ? X(e) : void 0
		});
	}
	return e instanceof Error && (e.name === "TimeoutError" || e.name === "TypeError") ? new U(i, { kind: "unavailable" }) : new U(i, { kind: "unknown" });
}
function ie(e) {
	return e.code ? `${e.code}: ${e.message}` : e.message;
}
//#endregion
export { S as C, D as S, x as T, E as _, ee as a, k as b, q as c, V as d, z as f, j as g, O as h, Z as i, J as l, P as m, ie as n, X as o, H as p, W as r, ne as s, U as t, re as u, M as v, C as w, T as x, N as y };
