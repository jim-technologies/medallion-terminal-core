import { E as e, T as t, _ as n, b as r, h as i, w as a, y as o } from "./States-Ds3cxTem.js";
import { t as s } from "./utils-j4lJ7S1v.js";
import { i as c, n as l, o as u, t as d } from "./types-Ds11x4VM.js";
import { T as f, g as p, x as m } from "./sourceError-BwpI_4dr.js";
import { cloneElement as h, forwardRef as g, isValidElement as _, useCallback as v, useEffect as y, useId as b, useLayoutEffect as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
import { createPortal as O } from "react-dom";
//#region src/components/FormControls.tsx
var k = g(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: s("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), A = g(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: s("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function j({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let c = b(), l = (_(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${c}`, u = r ? `${l}-description` : void 0, d = i ? `${l}-error` : void 0, f = [
		_(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		u,
		d
	].filter(Boolean).join(" ") || void 0, p = (_(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, m = _(t) ? h(t, {
		id: l,
		"aria-describedby": f,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: p
	}) : t;
	return /* @__PURE__ */ D("div", {
		className: s("mtc-form-field", o),
		children: [
			/* @__PURE__ */ D("label", {
				className: "mtc-form-label",
				htmlFor: l,
				children: [e, p && /* @__PURE__ */ E("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			m,
			r && /* @__PURE__ */ E("div", {
				id: u,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ E("div", {
				id: d,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var M = g(function({ label: e, description: t, density: n, className: r, ...a }, o) {
	return /* @__PURE__ */ D("label", {
		className: s("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ E("input", {
				...a,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ E(i, { name: "check" })
			}),
			/* @__PURE__ */ D("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ E("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ E("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), N = g(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ D("label", {
		className: s("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ E("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ D("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ E("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ E("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), P = g(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, c) {
	return /* @__PURE__ */ D("label", {
		className: s("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ E("input", {
				...o,
				ref: c,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ E("span", {})
			}),
			/* @__PURE__ */ D("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ E("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ E("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), F = g(function({ value: e, onValueChange: n, options: r, placeholder: a, disabled: o, required: c, name: l, id: u, "aria-label": d, "aria-labelledby": f, "aria-describedby": p, "aria-invalid": m, invalid: h, size: g = "medium", density: _, className: v, emptyMessage: x }, T) {
	let O = t(), k = b(), A = u ?? `mtc-combobox-${k}`, j = `${A}-listbox`, M = C(null), N = C(null), P = r.find((t) => t.value === e), [F, I] = w(P?.label ?? ""), [L, R] = w(!1), [z, B] = w(-1), V = S(() => {
		let e = F.trim().toLocaleLowerCase();
		return !e || P?.label === F ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		F,
		P?.label
	]);
	y(() => {
		L || I(P?.label ?? "");
	}, [L, P?.label]), y(() => {
		N.current?.setCustomValidity(c && !P ? "Please select an option." : "");
	}, [c, P]), y(() => {
		if (!L || typeof document > "u") return;
		let e = (e) => {
			M.current?.contains(e.target) || R(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [L]);
	let H = (e, t) => {
		if (V.length === 0) return -1;
		let n = e;
		for (let e = 0; e < V.length; e++) if (n = (n + t + V.length) % V.length, !V[n]?.disabled) return n;
		return -1;
	}, U = (e) => {
		e.disabled || (n(e.value), I(e.label), R(!1), B(-1));
	};
	return /* @__PURE__ */ D("div", {
		ref: M,
		className: s("mtc-combobox", _ && `mtc-density-${_}`, v),
		"data-size": g,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(!1);
		},
		children: [
			l && /* @__PURE__ */ E("input", {
				type: "hidden",
				name: l,
				value: e ?? ""
			}),
			/* @__PURE__ */ E("input", {
				ref: (e) => {
					N.current = e, typeof T == "function" ? T(e) : T && (T.current = e);
				},
				id: A,
				value: F,
				disabled: o,
				required: c,
				placeholder: a ?? O("combobox.placeholder"),
				role: "combobox",
				"aria-label": d,
				"aria-labelledby": f,
				"aria-describedby": p,
				"aria-invalid": h || m || void 0,
				"aria-required": c || void 0,
				"aria-expanded": L,
				"aria-controls": L ? j : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": L && z >= 0 ? `${A}-option-${z}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					R(!0), B(V.findIndex((t) => t.value === e && !t.disabled));
				},
				onChange: (e) => {
					I(e.currentTarget.value), R(!0), B(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), R(!0), B((e) => H(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), R(!0), B((e) => H(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && L) e.preventDefault(), B(H(-1, 1));
					else if (e.key === "End" && L) e.preventDefault(), B(H(0, -1));
					else if (e.key === "Enter" && L && z >= 0) {
						e.preventDefault();
						let t = V[z];
						t && U(t);
					} else e.key === "Escape" && L ? (e.preventDefault(), e.stopPropagation(), R(!1), I(P?.label ?? "")) : e.key === "Tab" && R(!1);
				}
			}),
			/* @__PURE__ */ E(i, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			L && !o && /* @__PURE__ */ E("div", {
				id: j,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: V.length === 0 ? /* @__PURE__ */ E("div", {
					className: "mtc-combobox-empty",
					children: x ?? O("combobox.empty")
				}) : V.map((t, n) => /* @__PURE__ */ D("div", {
					id: `${A}-option-${n}`,
					role: "option",
					"aria-selected": t.value === e,
					"aria-disabled": t.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": z === n,
					"data-selected": t.value === e,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						t.disabled || B(n);
					},
					onClick: () => U(t),
					children: [/* @__PURE__ */ D("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ E("span", { children: t.label }), t.description && /* @__PURE__ */ E("small", { children: t.description })]
					}), t.value === e && /* @__PURE__ */ E(i, { name: "check" })]
				}, t.value))
			})
		]
	});
}), I = 6, L = 320;
function R({ children: t, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = b(), c = e(), l = C(null), u = C(void 0), [d, f] = w(!1), [p, m] = w(null), g = v((e, t) => {
		clearTimeout(u.current), u.current = setTimeout(() => f(e), t);
	}, []);
	y(() => () => clearTimeout(u.current), []), x(() => {
		if (!d || !l.current || typeof window > "u") {
			m(null);
			return;
		}
		let e = l.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - L - 8));
		m({
			left: r,
			top: n === "below" ? e.bottom + I : e.top - I,
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
		children: [h(_, {
			"aria-describedby": S,
			onMouseEnter: (e) => {
				_.props.onMouseEnter?.(e), g(!0, r);
			},
			onMouseLeave: (e) => {
				_.props.onMouseLeave?.(e), g(!1, i);
			},
			onFocus: (e) => {
				_.props.onFocus?.(e), g(!0, r);
			},
			onBlur: (e) => {
				_.props.onBlur?.(e), g(!1, 0);
			}
		}), d && c && p && O(/* @__PURE__ */ E("div", {
			id: o,
			role: "tooltip",
			className: s("mtc-hover-card", a),
			"data-placement": p.placement,
			style: {
				left: p.left,
				top: p.top,
				width: L,
				transform: p.placement === "above" ? "translateY(-100%)" : void 0
			},
			onMouseEnter: () => clearTimeout(u.current),
			onMouseLeave: () => g(!1, i),
			children: n
		}), c)]
	});
}
//#endregion
//#region src/objects/ObjectChip.tsx
var z = g(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? l(e.type) : null, d = /* @__PURE__ */ D(T, { children: [o && /* @__PURE__ */ E(u, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ E("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), f = t ? (n) => t(e, n) : void 0, p = s("mtc-object-chip", i), m;
	return m = e.href ? /* @__PURE__ */ E("a", {
		ref: a,
		href: e.href,
		className: p,
		"data-interactive": "true",
		onClick: c(f),
		children: d
	}) : f ? /* @__PURE__ */ E("button", {
		ref: a,
		type: "button",
		className: p,
		"data-interactive": "true",
		onClick: f,
		children: d
	}) : /* @__PURE__ */ E("span", {
		ref: a,
		className: p,
		children: d
	}), n ? /* @__PURE__ */ E(R, {
		content: n,
		children: m
	}) : m;
}), B = /* @__PURE__ */ new Set([
	"string",
	"id",
	"code",
	"number",
	"integer",
	"currency",
	"percent",
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
function V(e, t, n) {
	if (n) {
		let [e, t] = n.split(":");
		if (e === "currency") return {
			kind: "currency",
			currency: (t || "USD").toUpperCase()
		};
		if (B.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : d(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function H(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function U(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function W(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var G = /^\d{4}-\d{2}-\d{2}$/;
function K(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = G.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function q(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function J(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function Y(e, t, n = "en") {
	switch (t.kind) {
		case "integer": return o(Math.round(e), {
			locale: n,
			maximumFractionDigits: 0
		});
		case "currency": try {
			return new Intl.NumberFormat(n, {
				style: "currency",
				currency: t.currency ?? "USD"
			}).format(e);
		} catch {
			return `${o(e, { locale: n })} ${t.currency ?? ""}`.trim();
		}
		case "percent": return new Intl.NumberFormat(n, {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(e);
		default: return o(e, { locale: n });
	}
}
function X(e, t, { locale: r = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return n(e.date, {
		locale: r,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var Z = 864e5;
function ee(e, t, n = "en") {
	if (!e.dateOnly) return r(e.date, {
		locale: n,
		now: t
	});
	let i = new Date(t), a = Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate()), o = Math.round((e.date.getTime() - a) / Z);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : r(e.date, {
		locale: n,
		now: a
	});
}
function Q(e, t, n = {}) {
	if (H(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = W(e);
			return n == null ? String(e) : Y(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = K(e);
			return r ? X(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => Q(e, V(e), n)).join(", ");
		case "link": return d(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${Q(t, V(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function te(e, t, n = {}) {
	return H(e) ? null : U(t.kind) ? W(e) ?? Q(e, t, n) : t.kind === "date" || t.kind === "datetime" ? K(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : Q(e, t, n);
}
var ne = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function re(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : ne.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var ie = 3;
function ae(e) {
	return /* @__PURE__ */ E($, {
		...e,
		depth: 0
	});
}
function $({ value: e, kind: n, format: r, tones: o, context: s = "panel", emptyValue: c, now: l, onNavigate: u, maxListItems: h, depth: g }) {
	let { locale: _, timeZone: v } = a(), y = t(), b = S(() => V(e, n, r), [
		e,
		n,
		r
	]), x = {
		locale: _,
		timeZone: v,
		yes: y("value.yes"),
		no: y("value.no")
	}, C = s === "panel";
	if (H(e)) return /* @__PURE__ */ E("span", {
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
				children: [/* @__PURE__ */ E("code", { children: t }), C && /* @__PURE__ */ E(p, {
					value: t,
					label: y("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ E(oe, {
			value: e,
			resolved: b,
			locale: _,
			panel: C
		});
		case "date":
		case "datetime": {
			let t = K(e);
			return t ? /* @__PURE__ */ D("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ E("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: X(t, b.kind, x)
				}), C && /* @__PURE__ */ E("span", {
					className: "mtc-value-secondary",
					children: ee(t, l ?? Date.now(), _)
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
				children: [/* @__PURE__ */ E(i, { name: t ? "check" : "close" }), y(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = o?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ E(m, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ E(f, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = h ?? (C ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-list",
				"data-context": s,
				children: [r.map((e, t) => d(e) ? /* @__PURE__ */ E(z, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ E(f, {
					className: "mtc-value-chip",
					children: Q(e, V(e), x)
				}, t)), i.length > 0 && /* @__PURE__ */ E(f, {
					className: "mtc-value-chip",
					title: y("value.moreTitle", {
						count: i.length,
						items: i.map((e) => Q(e, V(e), x)).join(", ")
					}),
					children: y("value.more", { count: i.length })
				})]
			});
		}
		case "link": return d(e) ? /* @__PURE__ */ E(z, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ E("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = q(e);
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
					/* @__PURE__ */ E(i, { name: "external-link" }),
					/* @__PURE__ */ E("span", {
						className: "mtc-visually-hidden",
						children: y("value.newTab")
					})
				]
			});
		}
		case "email": return J(e) ? /* @__PURE__ */ E("a", {
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
			if (g >= ie || !e || typeof e != "object") return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				children: Q(e, b, x)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ D("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ E("summary", { children: y("value.fields", { count: t.length }) }), /* @__PURE__ */ E("dl", { children: t.map(([e, t]) => /* @__PURE__ */ D("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ E("dt", { children: e }), /* @__PURE__ */ E("dd", { children: /* @__PURE__ */ E($, {
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
function oe({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ D("span", {
		className: "mtc-value-number",
		children: [Y(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ D(T, { children: [" ", /* @__PURE__ */ E("span", {
			className: "mtc-value-secondary mtc-value-code",
			children: t.currency
		})] })]
	}) : /* @__PURE__ */ E("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
export { te as a, R as c, j as d, k as f, A as h, U as i, M as l, P as m, re as n, V as o, N as p, Q as r, z as s, ae as t, F as u };
