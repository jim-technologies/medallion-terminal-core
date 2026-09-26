import { C as e, E as t, T as n, _ as r, b as i, h as a, n as o, w as s, y as c } from "./States-ggbm0c4k.js";
import { t as l } from "./utils-j4lJ7S1v.js";
import { f as u, m as d, n as f, s as p, t as m, u as h } from "./types-Dt7zb-eN.js";
import { T as g, b as _, g as ee, x as te } from "./sourceError-BK-F_Rp5.js";
import { cloneElement as v, forwardRef as y, isValidElement as b, useCallback as x, useEffect as S, useId as ne, useLayoutEffect as re, useMemo as C, useRef as w, useState as T } from "react";
import { Fragment as ie, jsx as E, jsxs as D } from "react/jsx-runtime";
import { createPortal as ae } from "react-dom";
//#region src/components/FormControls.tsx
var O = y(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: l("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), k = y(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: l("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function A({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = ne(), c = (b(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, u = r ? `${c}-description` : void 0, d = i ? `${c}-error` : void 0, f = [
		b(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		u,
		d
	].filter(Boolean).join(" ") || void 0, p = (b(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, m = b(t) ? v(t, {
		id: c,
		"aria-describedby": f,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: p
	}) : t;
	return /* @__PURE__ */ D("div", {
		className: l("mtc-form-field", o),
		children: [
			/* @__PURE__ */ D("label", {
				className: "mtc-form-label",
				htmlFor: c,
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
var j = y(function({ label: e, description: t, density: n, className: r, ...i }, o) {
	return /* @__PURE__ */ D("label", {
		className: l("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ E("input", {
				...i,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ E(a, { name: "check" })
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
}), M = y(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ D("label", {
		className: l("mtc-choice", n && `mtc-density-${n}`, r),
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
}), N = y(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ D("label", {
		className: l("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ E("input", {
				...o,
				ref: s,
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
}), P = y(function({ value: e, onValueChange: t, options: r, placeholder: i, disabled: o, required: s, name: c, id: u, "aria-label": d, "aria-labelledby": f, "aria-describedby": p, "aria-invalid": m, invalid: h, size: g = "medium", density: _, className: ee, emptyMessage: te }, v) {
	let y = n(), b = ne(), x = u ?? `mtc-combobox-${b}`, re = `${x}-listbox`, ie = w(null), ae = w(null), O = r.find((t) => t.value === e), [k, A] = T(O?.label ?? ""), [j, M] = T(!1), [N, P] = T(-1), F = C(() => {
		let e = k.trim().toLocaleLowerCase();
		return !e || O?.label === k ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		k,
		O?.label
	]);
	S(() => {
		j || A(O?.label ?? "");
	}, [j, O?.label]), S(() => {
		ae.current?.setCustomValidity(s && !O ? "Please select an option." : "");
	}, [s, O]), S(() => {
		if (!j || typeof document > "u") return;
		let e = (e) => {
			ie.current?.contains(e.target) || M(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [j]);
	let I = (e, t) => {
		if (F.length === 0) return -1;
		let n = e;
		for (let e = 0; e < F.length; e++) if (n = (n + t + F.length) % F.length, !F[n]?.disabled) return n;
		return -1;
	}, oe = (e) => {
		e.disabled || (t(e.value), A(e.label), M(!1), P(-1));
	};
	return /* @__PURE__ */ D("div", {
		ref: ie,
		className: l("mtc-combobox", _ && `mtc-density-${_}`, ee),
		"data-size": g,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || M(!1);
		},
		children: [
			c && /* @__PURE__ */ E("input", {
				type: "hidden",
				name: c,
				value: e ?? ""
			}),
			/* @__PURE__ */ E("input", {
				ref: (e) => {
					ae.current = e, typeof v == "function" ? v(e) : v && (v.current = e);
				},
				id: x,
				value: k,
				disabled: o,
				required: s,
				placeholder: i ?? y("combobox.placeholder"),
				role: "combobox",
				"aria-label": d,
				"aria-labelledby": f,
				"aria-describedby": p,
				"aria-invalid": h || m || void 0,
				"aria-required": s || void 0,
				"aria-expanded": j,
				"aria-controls": j ? re : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": j && N >= 0 ? `${x}-option-${N}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					M(!0), P(F.findIndex((t) => t.value === e && !t.disabled));
				},
				onChange: (e) => {
					A(e.currentTarget.value), M(!0), P(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), M(!0), P((e) => I(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), M(!0), P((e) => I(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && j) e.preventDefault(), P(I(-1, 1));
					else if (e.key === "End" && j) e.preventDefault(), P(I(0, -1));
					else if (e.key === "Enter" && j && N >= 0) {
						e.preventDefault();
						let t = F[N];
						t && oe(t);
					} else e.key === "Escape" && j ? (e.preventDefault(), e.stopPropagation(), M(!1), A(O?.label ?? "")) : e.key === "Tab" && M(!1);
				}
			}),
			/* @__PURE__ */ E(a, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			j && !o && /* @__PURE__ */ E("div", {
				id: re,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: F.length === 0 ? /* @__PURE__ */ E("div", {
					className: "mtc-combobox-empty",
					children: te ?? y("combobox.empty")
				}) : F.map((t, n) => /* @__PURE__ */ D("div", {
					id: `${x}-option-${n}`,
					role: "option",
					"aria-selected": t.value === e,
					"aria-disabled": t.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": N === n,
					"data-selected": t.value === e,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						t.disabled || P(n);
					},
					onClick: () => oe(t),
					children: [/* @__PURE__ */ D("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ E("span", { children: t.label }), t.description && /* @__PURE__ */ E("small", { children: t.description })]
					}), t.value === e && /* @__PURE__ */ E(a, { name: "check" })]
				}, t.value))
			})
		]
	});
}), F = 6, I = 320;
function oe({ children: e, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = ne(), s = t(), c = w(null), u = w(void 0), [d, f] = T(!1), [p, m] = T(null), h = x((e, t) => {
		clearTimeout(u.current), u.current = setTimeout(() => f(e), t);
	}, []);
	S(() => () => clearTimeout(u.current), []), re(() => {
		if (!d || !c.current || typeof window > "u") {
			m(null);
			return;
		}
		let e = c.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - I - 8));
		m({
			left: r,
			top: n === "below" ? e.bottom + F : e.top - F,
			placement: n
		});
	}, [d]), S(() => {
		if (!d) return;
		let e = (e) => {
			e.key === "Escape" && f(!1);
		}, t = () => f(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [d]);
	let g = e, _ = [g.props["aria-describedby"], d ? o : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ D("span", {
		ref: c,
		className: "mtc-hover-card-trigger",
		children: [v(g, {
			"aria-describedby": _,
			onMouseEnter: (e) => {
				g.props.onMouseEnter?.(e), h(!0, r);
			},
			onMouseLeave: (e) => {
				g.props.onMouseLeave?.(e), h(!1, i);
			},
			onFocus: (e) => {
				g.props.onFocus?.(e), h(!0, r);
			},
			onBlur: (e) => {
				g.props.onBlur?.(e), h(!1, 0);
			}
		}), d && s && p && ae(/* @__PURE__ */ E("div", {
			id: o,
			role: "tooltip",
			className: l("mtc-hover-card", a),
			"data-placement": p.placement,
			style: {
				left: p.left,
				top: p.top,
				width: I,
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
var se = y(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? f(e.type) : null, s = /* @__PURE__ */ D(ie, { children: [o && /* @__PURE__ */ E(d, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ E("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, p = l("mtc-object-chip", i), m;
	return m = e.href ? /* @__PURE__ */ E("a", {
		ref: a,
		href: e.href,
		className: p,
		"data-interactive": "true",
		onClick: u(c),
		children: s
	}) : c ? /* @__PURE__ */ E("button", {
		ref: a,
		type: "button",
		className: p,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ E("span", {
		ref: a,
		className: p,
		children: s
	}), n ? /* @__PURE__ */ E(oe, {
		content: n,
		children: m
	}) : m;
}), ce = /* @__PURE__ */ new Set([
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
function L(e, t, n) {
	if (n) {
		let [e, t] = n.split(":");
		if (e === "currency") return {
			kind: "currency",
			currency: (t || "USD").toUpperCase()
		};
		if (ce.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : m(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function R(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function le(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function ue(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var de = /^\d{4}-\d{2}-\d{2}$/;
function fe(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = de.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function z(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function pe(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function me(e, t, n = "en") {
	switch (t.kind) {
		case "integer": return c(Math.round(e), {
			locale: n,
			maximumFractionDigits: 0
		});
		case "currency": try {
			return new Intl.NumberFormat(n, {
				style: "currency",
				currency: t.currency ?? "USD"
			}).format(e);
		} catch {
			return `${c(e, { locale: n })} ${t.currency ?? ""}`.trim();
		}
		case "percent": return new Intl.NumberFormat(n, {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(e);
		default: return c(e, { locale: n });
	}
}
function he(e, t, { locale: n = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return r(e.date, {
		locale: n,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var ge = 864e5;
function _e(e, t, n = "en") {
	if (!e.dateOnly) return i(e.date, {
		locale: n,
		now: t
	});
	let r = new Date(t), a = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()), o = Math.round((e.date.getTime() - a) / ge);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : i(e.date, {
		locale: n,
		now: a
	});
}
function B(e, t, n = {}) {
	if (R(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = ue(e);
			return n == null ? String(e) : me(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = fe(e);
			return r ? he(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => B(e, L(e), n)).join(", ");
		case "link": return m(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${B(t, L(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function V(e, t, n = {}) {
	return R(e) ? null : le(t.kind) ? ue(e) ?? B(e, t, n) : t.kind === "date" || t.kind === "datetime" ? fe(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : B(e, t, n);
}
var H = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function ve(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : H.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var ye = 3;
function be(e) {
	return /* @__PURE__ */ E(U, {
		...e,
		depth: 0
	});
}
function U({ value: e, kind: t, format: r, tones: i, context: o = "panel", emptyValue: c, now: l, onNavigate: u, maxListItems: d, depth: f }) {
	let { locale: p, timeZone: h } = s(), _ = n(), v = C(() => L(e, t, r), [
		e,
		t,
		r
	]), y = {
		locale: p,
		timeZone: h,
		yes: _("value.yes"),
		no: _("value.no")
	}, b = o === "panel";
	if (R(e)) return /* @__PURE__ */ E("span", {
		className: "mtc-value-empty",
		children: c ?? "—"
	});
	switch (v.kind) {
		case "id":
		case "code": {
			let t = String(e);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-id",
				"data-context": o,
				children: [/* @__PURE__ */ E("code", { children: t }), b && /* @__PURE__ */ E(ee, {
					value: t,
					label: _("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ E(xe, {
			value: e,
			resolved: v,
			locale: p,
			panel: b
		});
		case "date":
		case "datetime": {
			let t = fe(e);
			return t ? /* @__PURE__ */ D("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ E("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: he(t, v.kind, y)
				}), b && /* @__PURE__ */ E("span", {
					className: "mtc-value-secondary",
					children: _e(t, l ?? Date.now(), p)
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
				children: [/* @__PURE__ */ E(a, { name: t ? "check" : "close" }), _(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = i?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ E(te, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ E(g, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = d ?? (b ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-list",
				"data-context": o,
				children: [r.map((e, t) => m(e) ? /* @__PURE__ */ E(se, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ E(g, {
					className: "mtc-value-chip",
					children: B(e, L(e), y)
				}, t)), i.length > 0 && /* @__PURE__ */ E(g, {
					className: "mtc-value-chip",
					title: _("value.moreTitle", {
						count: i.length,
						items: i.map((e) => B(e, L(e), y)).join(", ")
					}),
					children: _("value.more", { count: i.length })
				})]
			});
		}
		case "link": return m(e) ? /* @__PURE__ */ E(se, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ E("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = z(e);
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
						children: _("value.newTab")
					})
				]
			});
		}
		case "email": return pe(e) ? /* @__PURE__ */ E("a", {
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
			if (f >= ye || !e || typeof e != "object") return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				children: B(e, v, y)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ D("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ E("summary", { children: _("value.fields", { count: t.length }) }), /* @__PURE__ */ E("dl", { children: t.map(([e, t]) => /* @__PURE__ */ D("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ E("dt", { children: e }), /* @__PURE__ */ E("dd", { children: /* @__PURE__ */ E(U, {
						value: t,
						context: o,
						now: l,
						onNavigate: u,
						depth: f + 1
					}) })]
				}, e)) })]
			});
		}
		default: {
			let t = String(e);
			return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				"data-context": o,
				title: t.length > 80 ? t : void 0,
				children: t
			});
		}
	}
}
function xe({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ D("span", {
		className: "mtc-value-number",
		children: [me(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ E("span", {
			className: "mtc-value-secondary",
			children: t.currency
		})]
	}) : /* @__PURE__ */ E("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
//#region src/workbench/dataGridModel.ts
function Se(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function Ce(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = Se(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : V(i, L(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return ve(e.key, t.key) || e.index - t.index;
		let r = ve(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function we(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function Te(e, t, n, r, i, a) {
	if (!a || r <= 0) return {
		start: 0,
		end: e
	};
	let o = Math.floor(Math.max(0, t) / r), s = Math.ceil(Math.max(n, r) / r) + 1;
	return {
		start: Math.max(0, o - i),
		end: Math.min(e, o + s + i)
	};
}
function Ee(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function De(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function Oe(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
	let o = n - 1, s = r - 1, c = (e) => Math.max(-1, Math.min(o, e));
	switch (t) {
		case "ArrowDown": return {
			...e,
			row: c(e.row + 1)
		};
		case "ArrowUp": return {
			...e,
			row: c(e.row - 1)
		};
		case "ArrowRight": return {
			...e,
			column: Math.min(s, e.column + 1)
		};
		case "ArrowLeft": return {
			...e,
			column: Math.max(0, e.column - 1)
		};
		case "PageDown": return {
			...e,
			row: c(Math.max(0, e.row) + i)
		};
		case "PageUp": return {
			...e,
			row: Math.max(n > 0 ? 0 : -1, e.row - i)
		};
		case "Home": return a ? {
			row: n > 0 ? 0 : -1,
			column: 0
		} : {
			...e,
			column: 0
		};
		case "End": return a ? {
			row: o,
			column: s
		} : {
			...e,
			column: s
		};
		default: return null;
	}
}
//#endregion
//#region src/workbench/DataGrid.tsx
var ke = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, Ae = 160, je = 40, Me = 16, Ne = 8, Pe = 160;
function Fe(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function Ie({ label: r, columns: i, rows: c, rowKey: d, rowLabel: f, selection: m = "none", selectedKeys: g, defaultSelectedKeys: ee, onSelectionChange: te, sort: v, defaultSort: y = null, onSortChange: b, sortMode: ne = "client", onRowActivate: ie, rowHref: O, onNavigate: k, contextActions: A, onCellEdit: j, onEndReached: M, totalRows: N, loading: P = !1, empty: F, density: I, rowHeight: oe, height: se = "100%", virtualize: ce = "auto", overscan: R = 8, footer: ue, rowProps: de, className: fe }) {
	let z = n(), { locale: pe, timeZone: me } = s(), he = e(), ge = t(), _e = I ?? he?.density ?? "standard", V = oe ?? ke[_e], H = w(null), ve = w(null), ye = w(!1), U = w(null), xe = w(-1), [Ie, Le] = T(y), W = v === void 0 ? Ie : v, [Re, ze] = T(ee ?? []), G = g ?? Re, Be = C(() => new Set(G), [G]), [Ve, He] = T({}), [K, Ue] = T(() => ({
		row: c.length > 0 ? 0 : -1,
		column: +(m === "multi")
	})), [q, We] = T({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [J, Ge] = T(null), Y = C(() => ne !== "client" || !W ? c : Ce(c, i.find((e) => e.id === W.columnId), W.direction, pe), [
		c,
		i,
		W,
		ne,
		pe
	]), X = C(() => Y.map((e, t) => d(e, t)), [Y, d]), Z = C(() => [...m === "multi" ? [{
		kind: "select",
		width: je
	}] : [], ...i.map((e) => ({
		kind: "data",
		column: e,
		width: Ve[e.id] ?? e.width ?? Ae
	}))], [
		i,
		m,
		Ve
	]), Ke = C(() => {
		let e = Z.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Z.length - 1;
	}, [Z]), qe = Z.map((e, t) => t === Ke ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Je = Z.reduce((e, t) => e + t.width, 0), Ye = C(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Z.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Z.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Z]), Xe = C(() => {
		let e = Z.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Z.findIndex((e) => e.kind === "data");
	}, [Z]), Ze = ce === "auto" ? Y.length > 200 : ce, Q = Te(Y.length, q.scrollTop, q.height, V, R, Ze), Qe = P && Y.length === 0, $e = !P && Y.length === 0, et = Qe ? Ne : P && Y.length > 0 ? 1 : 0, tt = $e ? Pe : (Y.length + et) * V, nt = x((e) => {
		if (f) return f(e);
		let t = i[0];
		if (!t) return "";
		let n = Se(t, e);
		return B(n, L(n, t.kind, t.format), {
			locale: pe,
			timeZone: me
		});
	}, [
		f,
		i,
		pe,
		me
	]), $ = x((e) => {
		g === void 0 && ze(e), te?.(e);
	}, [g, te]), rt = (e) => {
		let t = we(W, e);
		v === void 0 && Le(t), b?.(t);
	};
	re(() => {
		let e = H.current;
		if (!e) return;
		let t = () => We((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let it = (e) => (e - Math.max(1, Math.floor(R / 2))) * V, at = q.scrollTop + q.height >= it(Y.length), ot = () => {
		let e = H.current;
		if (!e) return;
		let t = Te(Y.length, e.scrollTop, e.clientHeight, V, R, Ze), n = e.scrollTop + e.clientHeight >= it(Y.length);
		(t.start !== Q.start || t.end !== Q.end || M && n !== at) && We({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	S(() => {
		Ue((e) => {
			let t = e.row < 0 || Y.length === 0 ? -1 : Math.min(e.row, Y.length - 1), n = Math.max(0, Math.min(e.column, Z.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [Y.length, Z.length]), re(() => {
		ye.current && (ye.current = !1, H.current?.querySelector(`[data-cell="${K.row}:${K.column}"]`)?.focus({ preventScroll: !0 }));
	}), S(() => {
		M && !P && Y.length !== 0 && (N !== void 0 && Y.length >= N || at && xe.current !== Y.length && (xe.current = Y.length, M()));
	}, [
		M,
		P,
		Y.length,
		N,
		at
	]);
	let st = (e) => {
		let t = H.current;
		if (t && e.row >= 0) {
			let n = Ee(e.row, t.scrollTop, t.clientHeight, V, V);
			n !== t.scrollTop && (t.scrollTop = n, We({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		ye.current = !0, Ue(e);
	}, ct = (e, t) => {
		if (m === "single") {
			$([e]), U.current = e;
			return;
		}
		if (m === "multi") {
			if (t && U.current) {
				$([.../* @__PURE__ */ new Set([...G, ...De(X, U.current, e)])]);
				return;
			}
			$(Be.has(e) ? G.filter((t) => t !== e) : [...G, e]), U.current = e;
		}
	}, lt = (e) => {
		let t = Y[e];
		if (t !== void 0) {
			if (ie) {
				ie(t);
				return;
			}
			H.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, ut = (e, t, n) => {
		let r = Y[e];
		r !== void 0 && A && A(r).length !== 0 && Ge({
			rowIndex: e,
			x: t,
			y: n
		});
	}, dt = x(() => {
		Ge(null), ye.current = !0;
	}, []);
	h(J !== null, ve, dt);
	let ft = (e, t) => {
		let n = Z[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		He((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, pt = (e) => {
		if (Fe(e.target) || J) return;
		let { row: t, column: n } = K, r = Y.length, i = Math.max(1, Math.floor((H.current?.clientHeight ?? V * 10) / V) - 1), a = Z[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), ft(n, e.key === "ArrowRight" ? Me : -16);
			return;
		}
		let o = Oe(K, e.key, {
			rowCount: r,
			columnCount: Z.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && m === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = X[o.row];
				e && (U.current ||= X[Math.max(0, t)] ?? e, $([.../* @__PURE__ */ new Set([...G, ...De(X, U.current, e)])]));
			}
			st(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), rt(a.column.id)) : e.key === " " && a?.kind === "select" && m === "multi" && (e.preventDefault(), $(G.length === X.length ? [] : [...X]));
			return;
		}
		let s = X[t];
		if (e.key === "Enter") e.preventDefault(), lt(t);
		else if (e.key === " " && s) e.preventDefault(), ct(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && m === "multi") e.preventDefault(), $([...X]);
		else if (e.key === "F2" && j && a?.kind === "data") {
			e.preventDefault();
			let n = Y[t];
			n !== void 0 && j(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			ut(t, n.left + 12, n.bottom);
		}
	}, mt = (e, t) => {
		let n = X[t];
		n && m !== "none" && (e.target.closest("a, button, input, select, textarea") || (m === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? ct(n, e.shiftKey) : ($([n]), U.current = n)));
	}, ht = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Z[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? 48, o = r.column.id, s = (e) => {
			He((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, gt = (e, t) => {
		let n = K.row === e && K.column === t, r = Ye.get(t);
		return {
			"data-cell": `${e}:${t}`,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: () => {
				n || Ue({
					row: e,
					column: t
				});
			}
		};
	}, _t = [];
	for (let e = Q.start; e < Q.end; e++) _t.push(e);
	K.row >= 0 && K.row < Y.length && (K.row < Q.start || K.row >= Q.end) && _t.push(K.row);
	let vt = m === "multi" && X.length > 0 && X.every((e) => Be.has(e)), yt = m === "multi" && !vt && X.some((e) => Be.has(e)), bt = J ? Y[J.rowIndex] : void 0, xt = {
		"--mtc-grid-template": qe,
		"--mtc-grid-min-width": `${Je}px`,
		"--mtc-grid-row-height": `${V}px`,
		"--mtc-grid-viewport-width": q.width > 0 ? `${q.width}px` : "100%"
	};
	return /* @__PURE__ */ D("div", {
		className: l("mtc-data-grid", I && `mtc-density-${I}`, fe),
		style: {
			...xt,
			height: se
		},
		children: [
			/* @__PURE__ */ D("div", {
				ref: H,
				role: "grid",
				"aria-label": r,
				"aria-rowcount": (N ?? Y.length) + 1,
				"aria-colcount": Z.length,
				"aria-multiselectable": m === "multi" || void 0,
				"aria-busy": P || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: pt,
				onScroll: ot,
				children: [/* @__PURE__ */ E("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ E("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Z.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ E("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...gt(-1, t),
								children: /* @__PURE__ */ E("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": z("dataGrid.selectAll"),
									checked: vt,
									ref: (e) => {
										e && (e.indeterminate = yt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => $(vt ? [] : [...X])
								})
							}, "__select");
							let { column: n } = e, r = W?.columnId === n.id ? W.direction : void 0, i = n.align === "end" || !n.align && !n.cell && le(L(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ D("div", {
								role: "columnheader",
								"aria-sort": r ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": i ? "end" : "start",
								"data-sortable": o || void 0,
								...gt(-1, t),
								onClick: o ? () => {
									rt(n.id), Ue({
										row: -1,
										column: t
									});
								} : void 0,
								children: [
									/* @__PURE__ */ E("span", {
										className: "mtc-data-grid-header-label",
										children: n.header
									}),
									r && /* @__PURE__ */ E(a, {
										name: r === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ E("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => ht(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ D("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: tt },
					children: [
						_t.map((e) => {
							let t = Y[e], n = X[e], r = Be.has(n), i = O?.(t);
							return /* @__PURE__ */ E("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": m === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * V },
								...de?.(t),
								onClick: (t) => mt(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									j && i ? j(t, i) : lt(e);
								},
								onContextMenu: A ? (t) => {
									t.preventDefault(), m !== "none" && !r && $([n]), Ue({
										row: e,
										column: K.column
									}), ut(e, t.clientX, t.clientY);
								} : void 0,
								children: Z.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ E("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...gt(e, o),
										children: /* @__PURE__ */ E("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": z("dataGrid.selectRow", { label: nt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => ct(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = Se(s, t), l = L(c, s.kind, s.format), d = s.align === "end" || !s.align && !s.cell && le(l.kind), f = s.cell ? s.cell(t, {
										value: c,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ E(be, {
										value: c,
										kind: s.kind,
										format: s.format,
										tones: s.tones,
										context: "grid"
									});
									return /* @__PURE__ */ E("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": s.id,
										"data-align": d ? "end" : "start",
										...gt(e, o),
										children: i && o === Xe ? /* @__PURE__ */ E("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: u(k ? (e) => k(t, e) : void 0),
											children: f
										}) : f
									}, s.id);
								})
							}, n);
						}),
						Qe && Array.from({ length: Ne }, (e, t) => /* @__PURE__ */ E("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * V },
							children: Z.map((e, n) => /* @__PURE__ */ E("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ E(_, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Qe && /* @__PURE__ */ E("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ E("div", {
								role: "gridcell",
								children: z("dataGrid.loading")
							})
						}),
						P && Y.length > 0 && /* @__PURE__ */ E("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: Y.length * V },
							children: /* @__PURE__ */ E("div", {
								role: "gridcell",
								"aria-colspan": Z.length,
								className: "mtc-data-grid-cell",
								children: z("dataGrid.loadingMore")
							})
						}),
						$e && /* @__PURE__ */ E("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Pe
							},
							children: /* @__PURE__ */ E("div", {
								role: "gridcell",
								"aria-colspan": Z.length,
								className: "mtc-data-grid-cell",
								children: F ?? /* @__PURE__ */ E(o, {
									compact: !0,
									title: z("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			ue && /* @__PURE__ */ E("div", {
				className: "mtc-data-grid-footer",
				children: ue
			}),
			J && bt !== void 0 && A && (() => {
				let e = /* @__PURE__ */ E("div", {
					ref: ve,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ E(p, {
						label: z("dataGrid.rowActions", { label: nt(bt) }),
						items: A(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: J.x,
							top: J.y
						},
						onClose: dt
					})
				});
				return ge ? ae(e, ge) : e;
			})()
		]
	});
}
//#endregion
export { le as a, se as c, P as d, A as f, k as g, N as h, B as i, oe as l, M as m, be as n, V as o, O as p, ve as r, L as s, Ie as t, j as u };
