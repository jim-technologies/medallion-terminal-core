import { E as e, T as t, _ as n, b as r, g as i, h as a, w as o, y as s } from "./States-Ds3cxTem.js";
import { t as c } from "./utils-j4lJ7S1v.js";
import { i as l, n as u, o as d, t as f } from "./types-Ds11x4VM.js";
import { T as p, g as m, x as h } from "./sourceError-BwpI_4dr.js";
import { cloneElement as g, forwardRef as _, useCallback as v, useEffect as y, useId as b, useLayoutEffect as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
import { createPortal as O } from "react-dom";
//#region src/components/HoverCard.tsx
var k = 6, A = 320;
function j({ children: t, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = b(), s = e(), l = C(null), u = C(void 0), [d, f] = w(!1), [p, m] = w(null), h = v((e, t) => {
		clearTimeout(u.current), u.current = setTimeout(() => f(e), t);
	}, []);
	y(() => () => clearTimeout(u.current), []), x(() => {
		if (!d || !l.current || typeof window > "u") {
			m(null);
			return;
		}
		let e = l.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - A - 8));
		m({
			left: r,
			top: n === "below" ? e.bottom + k : e.top - k,
			placement: n
		});
	}, [d]), y(() => {
		if (!d) return;
		let e = (e) => {
			e.key === "Escape" && f(!1);
		}, t = () => f(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [d]);
	let _ = t, S = [_.props["aria-describedby"], d ? o : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ D("span", {
		ref: l,
		className: "mtc-hover-card-trigger",
		children: [g(_, {
			"aria-describedby": S,
			onMouseEnter: (e) => {
				_.props.onMouseEnter?.(e), h(!0, r);
			},
			onMouseLeave: (e) => {
				_.props.onMouseLeave?.(e), h(!1, i);
			},
			onFocus: (e) => {
				_.props.onFocus?.(e), h(!0, r);
			},
			onBlur: (e) => {
				_.props.onBlur?.(e), h(!1, 0);
			}
		}), d && s && p && O(/* @__PURE__ */ E("div", {
			id: o,
			role: "tooltip",
			className: c("mtc-hover-card", a),
			"data-placement": p.placement,
			style: {
				left: p.left,
				top: p.top,
				width: A,
				transform: p.placement === "above" ? "translateY(-100%)" : void 0
			},
			onMouseEnter: () => clearTimeout(u.current),
			onMouseLeave: () => h(!1, i),
			children: n
		}), s)]
	});
}
//#endregion
//#region src/objects/ObjectChip.tsx
var M = _(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? u(e.type) : null, s = /* @__PURE__ */ D(T, { children: [o && /* @__PURE__ */ E(d, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ E("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), f = t ? (n) => t(e, n) : void 0, p = c("mtc-object-chip", i), m;
	return m = e.href ? /* @__PURE__ */ E("a", {
		ref: a,
		href: e.href,
		className: p,
		"data-interactive": "true",
		onClick: l(f),
		children: s
	}) : f ? /* @__PURE__ */ E("button", {
		ref: a,
		type: "button",
		className: p,
		"data-interactive": "true",
		onClick: f,
		children: s
	}) : /* @__PURE__ */ E("span", {
		ref: a,
		className: p,
		children: s
	}), n ? /* @__PURE__ */ E(j, {
		content: n,
		children: m
	}) : m;
}), N = /* @__PURE__ */ new Set([
	"string",
	"id",
	"code",
	"number",
	"integer",
	"currency",
	"percent",
	"bytes",
	"date",
	"datetime",
	"boolean",
	"enum",
	"list",
	"object",
	"link",
	"url",
	"email"
]);
function P(e, t, n) {
	if (n) {
		let [e, t] = n.split(":");
		if (e === "currency") return {
			kind: "currency",
			currency: (t || "USD").toUpperCase()
		};
		if (N.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : f(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function F(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function I(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent" || e === "bytes";
}
function L(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var R = /^\d{4}-\d{2}-\d{2}$/;
function z(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = R.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function B(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function V(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function H(e, t, n = "en") {
	switch (t.kind) {
		case "integer": return s(Math.round(e), {
			locale: n,
			maximumFractionDigits: 0
		});
		case "currency": try {
			return new Intl.NumberFormat(n, {
				style: "currency",
				currency: t.currency ?? "USD"
			}).format(e);
		} catch {
			return `${s(e, { locale: n })} ${t.currency ?? ""}`.trim();
		}
		case "bytes": return i(e, { locale: n });
		case "percent": return new Intl.NumberFormat(n, {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(e);
		default: return s(e, { locale: n });
	}
}
function U(e, t, { locale: r = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return n(e.date, {
		locale: r,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var W = 864e5;
function G(e, t, n = "en") {
	if (!e.dateOnly) return r(e.date, {
		locale: n,
		now: t
	});
	let i = new Date(t), a = Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate()), o = Math.round((e.date.getTime() - a) / W);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : r(e.date, {
		locale: n,
		now: a
	});
}
function K(e, t, n = {}) {
	if (F(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent":
		case "bytes": {
			let n = L(e);
			return n == null ? String(e) : H(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = z(e);
			return r ? U(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => K(e, P(e), n)).join(", ");
		case "link": return f(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${K(t, P(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function q(e, t, n = {}) {
	return F(e) ? null : I(t.kind) ? L(e) ?? K(e, t, n) : t.kind === "date" || t.kind === "datetime" ? z(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : K(e, t, n);
}
var J = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function Y(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : J.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var X = 3;
function Z(e) {
	return /* @__PURE__ */ E(Q, {
		...e,
		depth: 0
	});
}
function Q({ value: e, kind: n, format: r, tones: i, context: s = "panel", emptyValue: c, now: l, onNavigate: u, maxListItems: d, depth: g }) {
	let { locale: _, timeZone: v } = o(), y = t(), b = S(() => P(e, n, r), [
		e,
		n,
		r
	]), x = {
		locale: _,
		timeZone: v,
		yes: y("value.yes"),
		no: y("value.no")
	}, C = s === "panel";
	if (F(e)) return /* @__PURE__ */ E("span", {
		className: "mtc-value-empty",
		children: c ?? "—"
	});
	switch (b.kind) {
		case "id":
		case "code": {
			let t = String(e);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-id",
				"data-context": s,
				children: [/* @__PURE__ */ E("code", { children: t }), C && /* @__PURE__ */ E(m, {
					value: t,
					label: y("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent":
		case "bytes": return /* @__PURE__ */ E($, {
			value: e,
			resolved: b,
			locale: _,
			panel: C
		});
		case "date":
		case "datetime": {
			let t = z(e);
			return t ? /* @__PURE__ */ D("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ E("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: U(t, b.kind, x)
				}), C && /* @__PURE__ */ E("span", {
					className: "mtc-value-secondary",
					children: G(t, l ?? Date.now(), _)
				})]
			}) : /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				children: String(e)
			});
		}
		case "boolean": {
			let t = e === !0 || e === "true";
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-boolean",
				"data-value": t,
				children: [/* @__PURE__ */ E(a, { name: t ? "check" : "close" }), y(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = i?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ E(h, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ E(p, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = d ?? (C ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-list",
				"data-context": s,
				children: [r.map((e, t) => f(e) ? /* @__PURE__ */ E(M, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ E(p, {
					className: "mtc-value-chip",
					children: K(e, P(e), x)
				}, t)), i.length > 0 && /* @__PURE__ */ E(p, {
					className: "mtc-value-chip",
					title: y("value.moreTitle", {
						count: i.length,
						items: i.map((e) => K(e, P(e), x)).join(", ")
					}),
					children: y("value.more", { count: i.length })
				})]
			});
		}
		case "link": return f(e) ? /* @__PURE__ */ E(M, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ E("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = B(e);
			if (!t) return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				children: String(e)
			});
			let n = String(e).trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
			return /* @__PURE__ */ D("a", {
				className: "mtc-value-link",
				href: t,
				target: "_blank",
				rel: "noopener noreferrer",
				children: [
					/* @__PURE__ */ E("span", {
						className: "mtc-value-link-text",
						children: n
					}),
					/* @__PURE__ */ E(a, { name: "external-link" }),
					/* @__PURE__ */ E("span", {
						className: "mtc-visually-hidden",
						children: y("value.newTab")
					})
				]
			});
		}
		case "email": return V(e) ? /* @__PURE__ */ E("a", {
			className: "mtc-value-link",
			href: `mailto:${e.trim()}`,
			children: /* @__PURE__ */ E("span", {
				className: "mtc-value-link-text",
				children: e.trim()
			})
		}) : /* @__PURE__ */ E("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "object": {
			if (g >= X || !e || typeof e != "object") return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				children: K(e, b, x)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ D("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ E("summary", { children: y("value.fields", { count: t.length }) }), /* @__PURE__ */ E("dl", { children: t.map(([e, t]) => /* @__PURE__ */ D("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ E("dt", { children: e }), /* @__PURE__ */ E("dd", { children: /* @__PURE__ */ E(Q, {
						value: t,
						context: s,
						now: l,
						onNavigate: u,
						depth: g + 1
					}) })]
				}, e)) })]
			});
		}
		default: {
			let t = String(e);
			return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				"data-context": s,
				title: t.length > 80 ? t : void 0,
				children: t
			});
		}
	}
}
function $({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ D("span", {
		className: "mtc-value-number",
		children: [H(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ D(T, { children: [" ", /* @__PURE__ */ E("span", {
			className: "mtc-value-secondary mtc-value-code",
			children: t.currency
		})] })]
	}) : /* @__PURE__ */ E("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
export { q as a, j as c, I as i, Y as n, P as o, K as r, M as s, Z as t };
