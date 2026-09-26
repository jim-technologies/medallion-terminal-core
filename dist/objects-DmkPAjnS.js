import { C as e, E as t, T as n, _ as r, b as i, h as a, n as o, p as s, w as c, y as l } from "./States-BYZUi7cX.js";
import { i as u, n as d, r as f, t as p } from "./utils-j4lJ7S1v.js";
import { cloneElement as m, forwardRef as h, isValidElement as g, useCallback as _, useEffect as v, useId as y, useLayoutEffect as b, useMemo as x, useRef as S, useState as C } from "react";
import { Fragment as w, jsx as T, jsxs as E } from "react/jsx-runtime";
import { createPortal as D } from "react-dom";
//#region src/components/TypeGlyph.tsx
var O = [
	"azure",
	"cyan",
	"teal",
	"green",
	"lime",
	"olive",
	"amber",
	"orange",
	"red",
	"rose",
	"magenta",
	"violet"
];
function k(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, O[(t >>> 0) % O.length];
}
var A = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, j = h(function({ icon: e = "object", color: t, size: n = 20, label: r, className: i, ...o }, s) {
	return /* @__PURE__ */ T("span", {
		...o,
		ref: s,
		className: p("mtc-type-glyph", i),
		"data-color": t,
		"data-size": n,
		role: r ? "img" : void 0,
		"aria-label": r,
		"aria-hidden": !r || void 0,
		children: /* @__PURE__ */ T(a, {
			name: e,
			size: A[n],
			strokeWidth: n <= 20 ? 2 : 1.75
		})
	});
}), M = h(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ T("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: p("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), N = h(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ T("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: p("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function P({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = y(), c = (g(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, l = r ? `${c}-description` : void 0, u = i ? `${c}-error` : void 0, d = [
		g(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		l,
		u
	].filter(Boolean).join(" ") || void 0, f = (g(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, h = g(t) ? m(t, {
		id: c,
		"aria-describedby": d,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: f
	}) : t;
	return /* @__PURE__ */ E("div", {
		className: p("mtc-form-field", o),
		children: [
			/* @__PURE__ */ E("label", {
				className: "mtc-form-label",
				htmlFor: c,
				children: [e, f && /* @__PURE__ */ T("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			h,
			r && /* @__PURE__ */ T("div", {
				id: l,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ T("div", {
				id: u,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var F = h(function({ label: e, description: t, density: n, className: r, ...i }, o) {
	return /* @__PURE__ */ E("label", {
		className: p("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ T("input", {
				...i,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ T("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ T(a, { name: "check" })
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ T("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ T("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), I = h(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("label", {
		className: p("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ T("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ T("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ T("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ T("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), L = h(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ E("label", {
		className: p("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ T("input", {
				...o,
				ref: s,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ T("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ T("span", {})
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ T("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ T("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), R = h(function({ value: e, onValueChange: t, options: r, placeholder: i, disabled: o, required: s, name: c, id: l, "aria-label": u, "aria-labelledby": d, "aria-describedby": f, "aria-invalid": m, invalid: h, size: g = "medium", density: _, className: b, emptyMessage: w }, D) {
	let O = n(), k = y(), A = l ?? `mtc-combobox-${k}`, j = `${A}-listbox`, M = S(null), N = S(null), P = r.find((t) => t.value === e), [F, I] = C(P?.label ?? ""), [L, R] = C(!1), [z, B] = C(-1), V = x(() => {
		let e = F.trim().toLocaleLowerCase();
		return !e || P?.label === F ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		F,
		P?.label
	]);
	v(() => {
		L || I(P?.label ?? "");
	}, [L, P?.label]), v(() => {
		N.current?.setCustomValidity(s && !P ? "Please select an option." : "");
	}, [s, P]), v(() => {
		if (!L || typeof document > "u") return;
		let e = (e) => {
			M.current?.contains(e.target) || R(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [L]);
	let ee = (e, t) => {
		if (V.length === 0) return -1;
		let n = e;
		for (let e = 0; e < V.length; e++) if (n = (n + t + V.length) % V.length, !V[n]?.disabled) return n;
		return -1;
	}, H = (e) => {
		e.disabled || (t(e.value), I(e.label), R(!1), B(-1));
	};
	return /* @__PURE__ */ E("div", {
		ref: M,
		className: p("mtc-combobox", _ && `mtc-density-${_}`, b),
		"data-size": g,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(!1);
		},
		children: [
			c && /* @__PURE__ */ T("input", {
				type: "hidden",
				name: c,
				value: e ?? ""
			}),
			/* @__PURE__ */ T("input", {
				ref: (e) => {
					N.current = e, typeof D == "function" ? D(e) : D && (D.current = e);
				},
				id: A,
				value: F,
				disabled: o,
				required: s,
				placeholder: i ?? O("combobox.placeholder"),
				role: "combobox",
				"aria-label": u,
				"aria-labelledby": d,
				"aria-describedby": f,
				"aria-invalid": h || m || void 0,
				"aria-required": s || void 0,
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
					if (e.key === "ArrowDown") e.preventDefault(), R(!0), B((e) => ee(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), R(!0), B((e) => ee(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && L) e.preventDefault(), B(ee(-1, 1));
					else if (e.key === "End" && L) e.preventDefault(), B(ee(0, -1));
					else if (e.key === "Enter" && L && z >= 0) {
						e.preventDefault();
						let t = V[z];
						t && H(t);
					} else e.key === "Escape" && L ? (e.preventDefault(), e.stopPropagation(), R(!1), I(P?.label ?? "")) : e.key === "Tab" && R(!1);
				}
			}),
			/* @__PURE__ */ T(a, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			L && !o && /* @__PURE__ */ T("div", {
				id: j,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: V.length === 0 ? /* @__PURE__ */ T("div", {
					className: "mtc-combobox-empty",
					children: w ?? O("combobox.empty")
				}) : V.map((t, n) => /* @__PURE__ */ E("div", {
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
					onClick: () => H(t),
					children: [/* @__PURE__ */ E("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ T("span", { children: t.label }), t.description && /* @__PURE__ */ T("small", { children: t.description })]
					}), t.value === e && /* @__PURE__ */ T(a, { name: "check" })]
				}, t.value))
			})
		]
	});
}), z = h(function({ intent: e = "neutral", size: t = "small", onRemove: r, removeLabel: i, className: o, children: s, ...c }, l) {
	let u = n();
	return /* @__PURE__ */ E("span", {
		...c,
		ref: l,
		className: p("mtc-tag", o),
		"data-intent": e,
		"data-size": t,
		children: [/* @__PURE__ */ T("span", { children: s }), r && /* @__PURE__ */ T("button", {
			type: "button",
			onClick: r,
			"aria-label": i ?? u("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ T(a, { name: "close" })
		})]
	});
}), B = h(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ E("span", {
		...a,
		ref: o,
		className: p("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ T("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), i]
	});
}), V = h(function({ title: e, intent: t = "info", icon: n, actions: r, className: i, children: o, role: s, ...c }, l) {
	let u = t === "danger" ? "error" : t === "warning" ? "warning" : t === "success" ? "success" : "info";
	return /* @__PURE__ */ E("div", {
		...c,
		ref: l,
		role: s ?? (t === "danger" ? "alert" : "status"),
		className: p("mtc-callout", i),
		"data-intent": t,
		children: [/* @__PURE__ */ T("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: n ?? /* @__PURE__ */ T(a, { name: u })
		}), /* @__PURE__ */ E("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ T("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ T("div", {
					className: "mtc-callout-body",
					children: o
				}),
				r && /* @__PURE__ */ T("div", {
					className: "mtc-callout-actions",
					children: r
				})
			]
		})]
	});
}), ee = {
	ok: "success",
	warning: "warning",
	danger: "danger",
	info: "info",
	neutral: "neutral"
}, H = h(function({ tone: e = "neutral", size: t = "small", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ T(B, {
		...i,
		ref: a,
		dot: !0,
		intent: ee[e],
		size: t,
		"data-tone": e,
		className: p("mtc-status-badge", n),
		children: r
	});
}), te = h(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ T("kbd", {
		...t,
		ref: n,
		className: p("mtc-kbd", e)
	});
});
function ne(e) {
	let t = e.split(/[\s·._@-]+/u).filter((e) => /\p{L}|\p{N}/u.test(e));
	if (t.length === 0) return "?";
	let n = [...t[0]];
	if (t.length === 1) return n.slice(0, 2).join("").toUpperCase();
	let r = [...t[t.length - 1]];
	return `${n[0] ?? ""}${r[0] ?? ""}`.toUpperCase();
}
var re = h(function({ name: e, src: t, size: n = 24, decorative: r = !1, className: i, ...a }, o) {
	let [s, c] = C(!1);
	return v(() => c(!1), [t]), /* @__PURE__ */ T("span", {
		...a,
		ref: o,
		className: p("mtc-avatar", i),
		"data-size": n,
		role: r ? void 0 : "img",
		"aria-label": r ? void 0 : e,
		"aria-hidden": r || void 0,
		title: r ? void 0 : e,
		children: t && !s ? /* @__PURE__ */ T("img", {
			src: t,
			alt: "",
			onError: () => c(!0)
		}) : /* @__PURE__ */ T("span", {
			"aria-hidden": "true",
			children: ne(e)
		})
	});
}), ie = h(function({ width: e, height: t, shape: n = "line", lines: r, className: i, style: a, ...o }, s) {
	let c = (e) => typeof e == "number" ? `${e}px` : e;
	return r && r > 1 ? /* @__PURE__ */ T("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: p("mtc-skeleton-lines", i),
		style: {
			width: c(e),
			...a
		},
		children: Array.from({ length: r }, (e, t) => /* @__PURE__ */ T("span", {
			className: "mtc-skeleton",
			"data-shape": "line",
			style: t === r - 1 ? { width: "60%" } : void 0
		}, t))
	}) : /* @__PURE__ */ T("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: p("mtc-skeleton", i),
		"data-shape": n,
		style: {
			width: c(e),
			height: c(t),
			...a
		}
	});
}), ae = 1500, oe = h(function({ value: e, label: t, copiedLabel: r, size: i = "small", clipboard: o, onCopied: c, className: l, ...u }, d) {
	let f = n(), [m, h] = C(!1), g = S(void 0);
	v(() => () => clearTimeout(g.current), []);
	let _ = async () => {
		let t = o ?? (typeof navigator < "u" ? navigator.clipboard : void 0);
		if (t) {
			try {
				await t.writeText(e);
			} catch {
				return;
			}
			h(!0), c?.(e), clearTimeout(g.current), g.current = setTimeout(() => h(!1), ae);
		}
	};
	return /* @__PURE__ */ E("span", {
		className: p("mtc-copy-button", l),
		"data-copied": m || void 0,
		children: [/* @__PURE__ */ T(s, {
			...u,
			ref: d,
			variant: "ghost",
			size: i,
			icon: /* @__PURE__ */ T(a, { name: m ? "check" : "copy" }),
			"aria-label": t ?? f("copy.label"),
			onClick: () => void _()
		}), /* @__PURE__ */ T("span", {
			role: "status",
			className: "mtc-visually-hidden",
			children: m ? r ?? f("copy.copied") : ""
		})]
	});
}), se = h(function({ items: e, className: t, ...n }, r) {
	return /* @__PURE__ */ T("ul", {
		...n,
		ref: r,
		className: p("mtc-meta-row", t),
		children: e.filter((e) => e != null && e !== !1).map((e, t) => /* @__PURE__ */ T("li", {
			className: "mtc-meta-item",
			children: e
		}, t))
	});
}), ce = h(function({ title: e, subtitle: t, actions: n, footer: r, headingLevel: i = 2, padded: a = !1, className: o, children: s, ...c }, l) {
	let u = y(), d = `h${i}`;
	return /* @__PURE__ */ E("section", {
		...c,
		ref: l,
		"aria-labelledby": u,
		className: p("mtc-panel", o),
		children: [
			/* @__PURE__ */ E("header", {
				className: "mtc-panel-header",
				children: [
					/* @__PURE__ */ T(d, {
						id: u,
						className: "mtc-panel-title",
						children: e
					}),
					t != null && /* @__PURE__ */ T("span", {
						className: "mtc-panel-subtitle",
						children: t
					}),
					n && /* @__PURE__ */ T("div", {
						className: "mtc-panel-actions",
						children: n
					})
				]
			}),
			/* @__PURE__ */ T("div", {
				className: "mtc-panel-body",
				"data-padded": a || void 0,
				children: s
			}),
			r && /* @__PURE__ */ T("footer", {
				className: "mtc-panel-footer",
				children: r
			})
		]
	});
}), le = 6, U = 320;
function W({ children: e, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = y(), s = t(), c = S(null), l = S(void 0), [u, d] = C(!1), [f, h] = C(null), g = _((e, t) => {
		clearTimeout(l.current), l.current = setTimeout(() => d(e), t);
	}, []);
	v(() => () => clearTimeout(l.current), []), b(() => {
		if (!u || !c.current || typeof window > "u") {
			h(null);
			return;
		}
		let e = c.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - U - 8));
		h({
			left: r,
			top: n === "below" ? e.bottom + le : e.top - le,
			placement: n
		});
	}, [u]), v(() => {
		if (!u) return;
		let e = (e) => {
			e.key === "Escape" && d(!1);
		}, t = () => d(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [u]);
	let x = e, w = [x.props["aria-describedby"], u ? o : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ E("span", {
		ref: c,
		className: "mtc-hover-card-trigger",
		children: [m(x, {
			"aria-describedby": w,
			onMouseEnter: (e) => {
				x.props.onMouseEnter?.(e), g(!0, r);
			},
			onMouseLeave: (e) => {
				x.props.onMouseLeave?.(e), g(!1, i);
			},
			onFocus: (e) => {
				x.props.onFocus?.(e), g(!0, r);
			},
			onBlur: (e) => {
				x.props.onBlur?.(e), g(!1, 0);
			}
		}), u && s && f && D(/* @__PURE__ */ T("div", {
			id: o,
			role: "tooltip",
			className: p("mtc-hover-card", a),
			"data-placement": f.placement,
			style: {
				left: f.left,
				top: f.top,
				width: U,
				transform: f.placement === "above" ? "translateY(-100%)" : void 0
			},
			onMouseEnter: () => clearTimeout(l.current),
			onMouseLeave: () => g(!1, i),
			children: n
		}), s)]
	});
}
//#endregion
//#region src/components/Overlays.tsx
function ue({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let a = y(), [o, s] = f({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ T(w, { children: t });
	let c = t, l = [c.props["aria-describedby"], o ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ E("span", {
		className: p("mtc-tooltip-trigger", i),
		children: [m(c, {
			"aria-describedby": l,
			onMouseEnter: (e) => {
				c.props.onMouseEnter?.(e), s(!0);
			},
			onMouseLeave: (e) => {
				c.props.onMouseLeave?.(e), s(!1);
			},
			onFocus: (e) => {
				c.props.onFocus?.(e), s(!0);
			},
			onBlur: (e) => {
				c.props.onBlur?.(e), s(!1);
			},
			onKeyDown: (e) => {
				c.props.onKeyDown?.(e), e.key === "Escape" && o && (e.stopPropagation(), s(!1));
			}
		}), o && /* @__PURE__ */ T("span", {
			id: a,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function de({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", disabled: c, className: l }) {
	let u = y(), d = y(), m = S(null), h = S(null), [g, _] = f({
		value: i,
		defaultValue: a,
		onChange: o
	});
	return _e(g, m, () => {
		_(!1), h.current?.focus();
	}), /* @__PURE__ */ E("div", {
		ref: m,
		className: p("mtc-popover-root", l),
		children: [/* @__PURE__ */ T("button", {
			ref: h,
			type: "button",
			className: "mtc-popover-trigger",
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": g,
			"aria-controls": g ? u : void 0,
			disabled: c,
			onClick: () => _(!g),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !g && (e.preventDefault(), _(!0));
			},
			children: e
		}), g && /* @__PURE__ */ E("div", {
			id: u,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? d : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": s,
			children: [r && /* @__PURE__ */ T("div", {
				id: d,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function fe({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: a, align: o = "start", disabled: s, className: c }) {
	let l = S(null), u = S(null), [d, m] = f({
		value: void 0,
		defaultValue: 0
	}), [h, g] = f({
		value: r,
		defaultValue: i,
		onChange: a
	}), _ = (e = !0) => {
		g(!1), e && u.current?.focus();
	};
	return _e(h, l, () => _(!1)), /* @__PURE__ */ E("div", {
		ref: l,
		className: p("mtc-menu-root", c),
		children: [/* @__PURE__ */ T("button", {
			ref: u,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": h,
			disabled: s,
			onClick: () => {
				m(G(n, 1)), g(!h);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), m(G(n, e.key === "ArrowDown" ? 1 : -1)), g(!0));
			},
			children: t
		}), h && /* @__PURE__ */ T(me, {
			label: e,
			items: n,
			initialIndex: d,
			align: o,
			onClose: _
		})]
	});
}
var pe = h(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: a, onKeyDown: o, ...s }, c) {
	let l = S(null), u = S({
		x: 0,
		y: 0
	}), [d, m] = f({
		value: void 0,
		defaultValue: !1
	}), [h, g] = f({
		value: void 0,
		defaultValue: 0
	}), _ = (e) => {
		l.current = e, typeof c == "function" ? c(e) : c && (c.current = e);
	};
	_e(d, l, () => m(!1));
	let v = (e, n) => {
		u.current = {
			x: e,
			y: n
		}, g(G(t, 1)), m(!0);
	};
	return /* @__PURE__ */ E("div", {
		...s,
		ref: _,
		className: p("mtc-context-menu-region", r),
		tabIndex: i,
		"aria-label": e,
		onContextMenu: (e) => {
			a?.(e), !e.defaultPrevented && (e.preventDefault(), v(e.clientX, e.clientY));
		},
		onKeyDown: (e) => {
			if (o?.(e), !e.defaultPrevented && (e.key === "ContextMenu" || e.shiftKey && e.key === "F10")) {
				e.preventDefault();
				let t = e.currentTarget.getBoundingClientRect();
				v(t.left + 12, t.top + 12);
			}
		},
		children: [n, d && /* @__PURE__ */ T(me, {
			label: e,
			items: t,
			initialIndex: h,
			style: {
				position: "fixed",
				left: u.current.x,
				top: u.current.y
			},
			onClose: () => {
				m(!1), l.current?.focus();
			}
		})]
	});
});
function me({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = S(null);
	v(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = ve(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ T("div", {
		ref: o,
		role: "menu",
		"aria-label": e,
		className: "mtc-menu mtc-popover",
		"data-align": i,
		style: a,
		onKeyDown: (e) => {
			let t = Number(e.target.dataset.index ?? -1);
			e.key === "ArrowDown" ? (e.preventDefault(), s(t, 1)) : e.key === "ArrowUp" ? (e.preventDefault(), s(t, -1)) : e.key === "Home" ? (e.preventDefault(), s(-1, 1)) : e.key === "End" ? (e.preventDefault(), s(0, -1)) : e.key === "Escape" ? (e.preventDefault(), e.stopPropagation(), r(!0)) : e.key === "Tab" && r(!1);
		},
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ T("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ E("button", {
			type: "button",
			role: "menuitem",
			disabled: e.disabled,
			"data-index": t,
			"data-intent": e.intent ?? "neutral",
			className: "mtc-menu-item",
			onClick: () => {
				e.disabled || (e.onSelect?.(), r(!0));
			},
			children: [
				e.icon && /* @__PURE__ */ T("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ T("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ T("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var he = h(function({ open: e, onOpenChange: t, title: r, description: i, children: o, footer: c, size: l = "medium", dismissible: f = !0, initialFocusRef: m, className: h }, g) {
	let _ = n(), v = y(), b = y(), x = S(null);
	return u(e, x, m), e ? /* @__PURE__ */ T("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			f && e.target === e.currentTarget && t(!1);
		},
		children: /* @__PURE__ */ E("div", {
			ref: (e) => {
				x.current = e, typeof g == "function" ? g(e) : g && (g.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": v,
			"aria-describedby": i ? b : void 0,
			tabIndex: -1,
			className: p("mtc-dialog", h),
			"data-size": l,
			onKeyDown: (e) => d(e, x, f, () => t(!1)),
			children: [
				/* @__PURE__ */ E("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ E("div", { children: [/* @__PURE__ */ T("h2", {
						id: v,
						className: "mtc-modal-title",
						children: r
					}), i && /* @__PURE__ */ T("p", {
						id: b,
						className: "mtc-modal-description",
						children: i
					})] }), f && /* @__PURE__ */ T(s, {
						icon: /* @__PURE__ */ T(a, { name: "close" }),
						"aria-label": _("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => t(!1)
					})]
				}),
				/* @__PURE__ */ T("div", {
					className: "mtc-modal-body",
					children: o
				}),
				c && /* @__PURE__ */ T("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
}), ge = h(function({ open: e, onOpenChange: t, title: r, description: i, children: o, footer: c, side: l = "right", width: f = 420, dismissible: m = !0, initialFocusRef: h, className: g }, _) {
	let v = n(), b = y(), x = y(), C = S(null);
	return u(e, C, h), e ? /* @__PURE__ */ T("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			m && e.target === e.currentTarget && t(!1);
		},
		children: /* @__PURE__ */ E("div", {
			ref: (e) => {
				C.current = e, typeof _ == "function" ? _(e) : _ && (_.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": b,
			"aria-describedby": i ? x : void 0,
			tabIndex: -1,
			className: p("mtc-drawer", g),
			"data-side": l,
			style: { width: f },
			onKeyDown: (e) => d(e, C, m, () => t(!1)),
			children: [
				/* @__PURE__ */ E("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ E("div", { children: [/* @__PURE__ */ T("h2", {
						id: b,
						className: "mtc-modal-title",
						children: r
					}), i && /* @__PURE__ */ T("p", {
						id: x,
						className: "mtc-modal-description",
						children: i
					})] }), m && /* @__PURE__ */ T(s, {
						icon: /* @__PURE__ */ T(a, { name: "close" }),
						"aria-label": v("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => t(!1)
					})]
				}),
				/* @__PURE__ */ T("div", {
					className: "mtc-modal-body",
					children: o
				}),
				c && /* @__PURE__ */ T("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
});
function _e(e, t, n) {
	v(() => {
		if (!e || typeof document > "u") return;
		let r = (e) => {
			t.current?.contains(e.target) || n();
		}, i = (e) => {
			e.key === "Escape" && (e.stopPropagation(), n());
		};
		return document.addEventListener("pointerdown", r), document.addEventListener("keydown", i), () => {
			document.removeEventListener("pointerdown", r), document.removeEventListener("keydown", i);
		};
	}, [
		e,
		t,
		n
	]);
}
function G(e, t) {
	return ve(e, t === 1 ? -1 : 0, t);
}
function ve(e, t, n) {
	if (e.length === 0) return -1;
	let r = t;
	for (let t = 0; t < e.length; t++) {
		r = (r + n + e.length) % e.length;
		let t = e[r];
		if (t && !t.separator && !t.disabled) return r;
	}
	return -1;
}
//#endregion
//#region src/components/Navigation.tsx
var ye = h(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: o, keepMounted: s = !1, className: c, ...l }, u) {
	let d = y(), f = S(/* @__PURE__ */ new Map()), m = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), h = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let o = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		o && (f.current.get(o.id)?.focus(), a === "automatic" && n(o.id));
	}, g = (t, r) => {
		let o = i === "horizontal" ? "ArrowLeft" : "ArrowUp", s = i === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === o || t.key === s) t.preventDefault(), h(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (f.current.get(i.id)?.focus(), a === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && a === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ E("div", {
		...l,
		ref: u,
		className: p("mtc-tabs", o && `mtc-density-${o}`, c),
		"data-orientation": i,
		children: [/* @__PURE__ */ T("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === m?.id, r = `${d}-tab-${e.id}`, i = `${d}-panel-${e.id}`;
				return /* @__PURE__ */ E("button", {
					ref: (t) => {
						t ? f.current.set(e.id, t) : f.current.delete(e.id);
					},
					type: "button",
					role: "tab",
					id: r,
					"aria-controls": i,
					"aria-selected": t,
					disabled: e.disabled,
					tabIndex: t ? 0 : -1,
					className: "mtc-tab",
					onClick: () => n(e.id),
					onKeyDown: (t) => g(t, e),
					children: [/* @__PURE__ */ T("span", { children: e.label }), e.count != null && /* @__PURE__ */ T("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ T("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === m?.id;
				return !t && !s ? null : /* @__PURE__ */ T("div", {
					role: "tabpanel",
					id: `${d}-panel-${e.id}`,
					"aria-labelledby": `${d}-tab-${e.id}`,
					tabIndex: 0,
					hidden: !t,
					className: "mtc-tab-panel",
					children: e.panel
				}, e.id);
			})
		})]
	});
}), be = h(function({ items: e, label: t, maxItems: r, className: i, ...o }, s) {
	let c = n(), l = xe(e, r);
	return /* @__PURE__ */ T("nav", {
		...o,
		ref: s,
		"aria-label": t ?? c("breadcrumbs.label"),
		className: p("mtc-breadcrumbs", i),
		children: /* @__PURE__ */ T("ol", { children: l.map((e, t) => {
			let n = t === l.length - 1;
			return /* @__PURE__ */ E("li", { children: [t > 0 && /* @__PURE__ */ T(a, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), n ? /* @__PURE__ */ T("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ T("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ T("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ T("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${t}`);
		}) })
	});
});
function xe(e, t) {
	if (t == null || !Number.isFinite(t)) return e;
	let n = Math.max(1, Math.floor(t));
	return e.length <= n ? e : n === 1 ? e.slice(-1) : n === 2 ? [e[0], e[e.length - 1]] : [
		e[0],
		{ label: "…" },
		...e.slice(-(n - 2))
	];
}
//#endregion
//#region src/workbench/AppLayout.tsx
var Se = h(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ T("div", {
		...i,
		ref: a,
		className: p("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), Ce = h(function({ label: e, start: t, end: r, density: i, sticky: a, className: o, children: s, ...c }, l) {
	let u = n();
	return /* @__PURE__ */ E("div", {
		...c,
		ref: l,
		role: "toolbar",
		"aria-label": e ?? u("toolbar.label"),
		className: p("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			t && /* @__PURE__ */ T("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: t
			}),
			/* @__PURE__ */ T("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ T("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), K = h(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: c, ...l }, u) {
	let d = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...c
	};
	return /* @__PURE__ */ E("aside", {
		...l,
		ref: u,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: p("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: d,
		children: [
			t && /* @__PURE__ */ T("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ T("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ T("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), we = h(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: c, style: l, ...u }, d) {
	let f = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...l
	};
	return /* @__PURE__ */ E("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: p("mtc-inspector", s),
		"data-open": o,
		style: f,
		children: [
			(t || r) && /* @__PURE__ */ E("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ E("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ T("h2", { children: t }), n && /* @__PURE__ */ T("p", { children: n })]
				}), r && /* @__PURE__ */ T("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ T("div", {
				className: "mtc-inspector-content",
				children: c
			}),
			i && /* @__PURE__ */ T("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), Te = h(function({ primary: e, secondary: t, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: s, minSize: c = 15, maxSize: l = 85, step: u = 5, disabled: d, stackOnNarrow: m = !0, separatorLabel: h, className: g, style: _, ...v }, y) {
	let b = n(), x = S(null), C = S(!1), [w, D] = f({
		value: a,
		defaultValue: o,
		onChange: s
	}), O = Math.min(c, l), k = Math.max(c, l), A = Number.isFinite(u) && u !== 0 ? Math.abs(u) : 1, j = Ee(w, O, k), M = (e) => {
		x.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
	}, N = (e) => {
		if (!C.current || !x.current || d) return;
		let t = x.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		D(Ee(a, O, k));
	}, P = (e) => D(Ee(j + e, O, k)), F = i === "start" ? j : 100 - j, I = 100 - F;
	return /* @__PURE__ */ E("div", {
		...v,
		ref: M,
		className: p("mtc-split-pane", g),
		"data-orientation": r,
		"data-stack-narrow": m,
		style: {
			"--mtc-split-start": `${F}fr`,
			"--mtc-split-end": `${I}fr`,
			..._
		},
		children: [
			/* @__PURE__ */ T("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? e : t
			}),
			/* @__PURE__ */ T("div", {
				role: "separator",
				"aria-label": h ?? b("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": O,
				"aria-valuemax": k,
				"aria-valuenow": Math.round(j),
				"aria-disabled": d || void 0,
				tabIndex: d ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					d || (C.current = !0, e.currentTarget.setPointerCapture(e.pointerId), N(e));
				},
				onPointerMove: N,
				onPointerUp: (e) => {
					C.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					C.current = !1;
				},
				onKeyDown: (e) => {
					if (d) return;
					let t = r === "horizontal" ? "ArrowLeft" : "ArrowUp", n = r === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === n) {
						e.preventDefault();
						let t = e.key === n ? A : -A;
						P(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), D(O)) : e.key === "End" && (e.preventDefault(), D(k));
				},
				children: /* @__PURE__ */ T("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ T("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? t : e
			})
		]
	});
});
function Ee(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var De = h(function({ items: e, label: t, selectedId: r, onSelectionChange: i, expandedIds: o, onExpandedChange: s, density: c, className: l, ...u }, d) {
	let f = x(() => Oe(e, o), [e, o]), m = n(), h = S(/* @__PURE__ */ new Map()), [g, _] = C(r ?? f.find((e) => !e.item.disabled)?.item.id);
	v(() => {
		g && f.some((e) => e.item.id === g && !e.item.disabled) || _(r ?? f.find((e) => !e.item.disabled)?.item.id);
	}, [
		g,
		r,
		f
	]);
	let y = (e) => {
		e && (_(e), h.current.get(e)?.focus());
	}, b = (e, t) => {
		let n = new Set(o);
		t ? n.add(e) : n.delete(e), s(n);
	}, w = f.filter((e) => !e.item.disabled), D = (e, t) => {
		let n = w.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, a = o.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = w[Math.min(w.length - 1, Math.max(0, n + t))];
			y(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !a ? b(t.item.id, !0) : r && y(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && a ? b(t.item.id, !1) : y(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? w[0] : w[w.length - 1];
			y(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), i?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(o);
			for (let e of f.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			s(n);
		}
	};
	return /* @__PURE__ */ T("div", {
		...u,
		ref: d,
		role: "tree",
		"aria-label": t,
		"aria-multiselectable": !1,
		className: p("mtc-tree", c && `mtc-density-${c}`, l),
		children: f.map((e) => {
			let { item: t } = e, n = !!t.children?.length, s = o.has(t.id), c = r === t.id;
			return /* @__PURE__ */ E("div", {
				ref: (e) => {
					e ? h.current.set(t.id, e) : h.current.delete(t.id);
				},
				role: "treeitem",
				"aria-level": e.level,
				"aria-posinset": e.position,
				"aria-setsize": e.setSize,
				"aria-expanded": n ? s : void 0,
				"aria-selected": c,
				"aria-disabled": t.disabled || void 0,
				tabIndex: !t.disabled && g === t.id ? 0 : -1,
				className: "mtc-tree-item",
				"data-selected": c,
				"data-disabled": t.disabled || void 0,
				style: { "--mtc-tree-level": e.level },
				onFocus: () => _(t.id),
				onClick: () => {
					t.disabled || i?.(t.id);
				},
				onDoubleClick: () => {
					!t.disabled && n && b(t.id, !s);
				},
				onKeyDown: (t) => D(t, e),
				children: [
					/* @__PURE__ */ T("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": n ? m(s ? "tree.collapse" : "tree.expand", { label: q(t.label) }) : void 0,
						"aria-hidden": !n || void 0,
						disabled: !n || t.disabled,
						onClick: (e) => {
							e.stopPropagation(), n && b(t.id, !s);
						},
						children: n && /* @__PURE__ */ T(a, { name: "chevron-right" })
					}),
					t.icon && /* @__PURE__ */ T("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: t.icon
					}),
					/* @__PURE__ */ E("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ T("span", {
							className: "mtc-tree-label",
							children: t.label
						}), t.description && /* @__PURE__ */ T("span", {
							className: "mtc-tree-description",
							children: t.description
						})]
					})
				]
			}, t.id);
		})
	});
});
function Oe(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...Oe(o.children, t, n + 1, o.id, i)));
	}), a;
}
function q(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/components/navigation.ts
function J(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function ke(e) {
	if (e) return (t) => {
		J(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/objects/types.ts
function Y(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? k(e.id ?? e.label)
	};
}
function Ae(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
//#region src/objects/ObjectChip.tsx
var je = h(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? Y(e.type) : null, s = /* @__PURE__ */ E(w, { children: [o && /* @__PURE__ */ T(j, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ T("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, l = p("mtc-object-chip", i), u;
	return u = e.href ? /* @__PURE__ */ T("a", {
		ref: a,
		href: e.href,
		className: l,
		"data-interactive": "true",
		onClick: ke(c),
		children: s
	}) : c ? /* @__PURE__ */ T("button", {
		ref: a,
		type: "button",
		className: l,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ T("span", {
		ref: a,
		className: l,
		children: s
	}), n ? /* @__PURE__ */ T(W, {
		content: n,
		children: u
	}) : u;
}), Me = /* @__PURE__ */ new Set([
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
function X(e, t, n) {
	if (n) {
		let [e, t] = n.split(":");
		if (e === "currency") return {
			kind: "currency",
			currency: (t || "USD").toUpperCase()
		};
		if (Me.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : Ae(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function Ne(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Pe(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function Fe(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var Ie = /^\d{4}-\d{2}-\d{2}$/;
function Z(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = Ie.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function Le(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function Re(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function ze(e, t, n = "en") {
	switch (t.kind) {
		case "integer": return l(Math.round(e), {
			locale: n,
			maximumFractionDigits: 0
		});
		case "currency": try {
			return new Intl.NumberFormat(n, {
				style: "currency",
				currency: t.currency ?? "USD"
			}).format(e);
		} catch {
			return `${l(e, { locale: n })} ${t.currency ?? ""}`.trim();
		}
		case "percent": return new Intl.NumberFormat(n, {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(e);
		default: return l(e, { locale: n });
	}
}
function Be(e, t, { locale: n = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return r(e.date, {
		locale: n,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var Ve = 864e5;
function Q(e, t, n = "en") {
	if (!e.dateOnly) return i(e.date, {
		locale: n,
		now: t
	});
	let r = new Date(t), a = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()), o = Math.round((e.date.getTime() - a) / Ve);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : i(e.date, {
		locale: n,
		now: a
	});
}
function $(e, t, n = {}) {
	if (Ne(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = Fe(e);
			return n == null ? String(e) : ze(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = Z(e);
			return r ? Be(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => $(e, X(e), n)).join(", ");
		case "link": return Ae(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${$(t, X(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function He(e, t, n = {}) {
	return Ne(e) ? null : Pe(t.kind) ? Fe(e) ?? $(e, t, n) : t.kind === "date" || t.kind === "datetime" ? Z(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : $(e, t, n);
}
var Ue = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function We(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : Ue.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var Ge = 3;
function Ke(e) {
	return /* @__PURE__ */ T(qe, {
		...e,
		depth: 0
	});
}
function qe({ value: e, kind: t, format: r, tones: i, context: o = "panel", emptyValue: s, now: l, onNavigate: u, maxListItems: d, depth: f }) {
	let { locale: p, timeZone: m } = c(), h = n(), g = x(() => X(e, t, r), [
		e,
		t,
		r
	]), _ = {
		locale: p,
		timeZone: m,
		yes: h("value.yes"),
		no: h("value.no")
	}, v = o === "panel";
	if (Ne(e)) return /* @__PURE__ */ T("span", {
		className: "mtc-value-empty",
		children: s ?? "—"
	});
	switch (g.kind) {
		case "id":
		case "code": {
			let t = String(e);
			return /* @__PURE__ */ E("span", {
				className: "mtc-value-id",
				"data-context": o,
				children: [/* @__PURE__ */ T("code", { children: t }), v && /* @__PURE__ */ T(oe, {
					value: t,
					label: h("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ T(Je, {
			value: e,
			resolved: g,
			locale: p,
			panel: v
		});
		case "date":
		case "datetime": {
			let t = Z(e);
			return t ? /* @__PURE__ */ E("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ T("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: Be(t, g.kind, _)
				}), v && /* @__PURE__ */ T("span", {
					className: "mtc-value-secondary",
					children: Q(t, l ?? Date.now(), p)
				})]
			}) : /* @__PURE__ */ T("span", {
				className: "mtc-value-text",
				children: String(e)
			});
		}
		case "boolean": {
			let t = e === !0 || e === "true";
			return /* @__PURE__ */ E("span", {
				className: "mtc-value-boolean",
				"data-value": t,
				children: [/* @__PURE__ */ T(a, { name: t ? "check" : "close" }), h(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = i?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ T(H, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ T(z, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = d ?? (v ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ E("span", {
				className: "mtc-value-list",
				"data-context": o,
				children: [r.map((e, t) => Ae(e) ? /* @__PURE__ */ T(je, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ T(z, {
					className: "mtc-value-chip",
					children: $(e, X(e), _)
				}, t)), i.length > 0 && /* @__PURE__ */ T(z, {
					className: "mtc-value-chip",
					title: h("value.moreTitle", {
						count: i.length,
						items: i.map((e) => $(e, X(e), _)).join(", ")
					}),
					children: h("value.more", { count: i.length })
				})]
			});
		}
		case "link": return Ae(e) ? /* @__PURE__ */ T(je, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ T("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = Le(e);
			if (!t) return /* @__PURE__ */ T("span", {
				className: "mtc-value-text",
				children: String(e)
			});
			let n = String(e).trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
			return /* @__PURE__ */ E("a", {
				className: "mtc-value-link",
				href: t,
				target: "_blank",
				rel: "noopener noreferrer",
				children: [
					/* @__PURE__ */ T("span", {
						className: "mtc-value-link-text",
						children: n
					}),
					/* @__PURE__ */ T(a, { name: "external-link" }),
					/* @__PURE__ */ T("span", {
						className: "mtc-visually-hidden",
						children: h("value.newTab")
					})
				]
			});
		}
		case "email": return Re(e) ? /* @__PURE__ */ T("a", {
			className: "mtc-value-link",
			href: `mailto:${e.trim()}`,
			children: /* @__PURE__ */ T("span", {
				className: "mtc-value-link-text",
				children: e.trim()
			})
		}) : /* @__PURE__ */ T("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "object": {
			if (f >= Ge || !e || typeof e != "object") return /* @__PURE__ */ T("span", {
				className: "mtc-value-text",
				children: $(e, g, _)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ E("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ T("summary", { children: h("value.fields", { count: t.length }) }), /* @__PURE__ */ T("dl", { children: t.map(([e, t]) => /* @__PURE__ */ E("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ T("dt", { children: e }), /* @__PURE__ */ T("dd", { children: /* @__PURE__ */ T(qe, {
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
			return /* @__PURE__ */ T("span", {
				className: "mtc-value-text",
				"data-context": o,
				title: t.length > 80 ? t : void 0,
				children: t
			});
		}
	}
}
function Je({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ E("span", {
		className: "mtc-value-number",
		children: [ze(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ T("span", {
			className: "mtc-value-secondary",
			children: t.currency
		})]
	}) : /* @__PURE__ */ T("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
//#region src/workbench/dataGridModel.ts
function Ye(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function Xe(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = Ye(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : He(i, X(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return We(e.key, t.key) || e.index - t.index;
		let r = We(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function Ze(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function Qe(e, t, n, r, i, a) {
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
function $e(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function et(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function tt(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
var nt = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, rt = 160, it = 40, at = 16, ot = 8, st = 160;
function ct(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function lt({ label: r, columns: i, rows: s, rowKey: l, rowLabel: u, selection: d = "none", selectedKeys: f, defaultSelectedKeys: m, onSelectionChange: h, sort: g, defaultSort: y = null, onSortChange: w, sortMode: O = "client", onRowActivate: k, rowHref: A, onNavigate: j, contextActions: M, onCellEdit: N, onEndReached: P, totalRows: F, loading: I = !1, empty: L, density: R, rowHeight: z, height: B = "100%", virtualize: V = "auto", overscan: ee = 8, footer: H, rowProps: te, className: ne }) {
	let re = n(), { locale: ae, timeZone: oe } = c(), se = e(), ce = t(), le = R ?? se?.density ?? "standard", U = z ?? nt[le], W = S(null), ue = S(null), de = S(!1), fe = S(null), pe = S(-1), [he, ge] = C(y), G = g === void 0 ? he : g, [ve, ye] = C(m ?? []), be = f ?? ve, xe = x(() => new Set(be), [be]), [Se, Ce] = C({}), [K, we] = C(() => ({
		row: s.length > 0 ? 0 : -1,
		column: +(d === "multi")
	})), [Te, Ee] = C({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [De, Oe] = C(null), q = x(() => O !== "client" || !G ? s : Xe(s, i.find((e) => e.id === G.columnId), G.direction, ae), [
		s,
		i,
		G,
		O,
		ae
	]), J = x(() => q.map((e, t) => l(e, t)), [q, l]), Y = x(() => [...d === "multi" ? [{
		kind: "select",
		width: it
	}] : [], ...i.map((e) => ({
		kind: "data",
		column: e,
		width: Se[e.id] ?? e.width ?? rt
	}))], [
		i,
		d,
		Se
	]), Ae = x(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), je = Y.map((e, t) => t === Ae ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Me = Y.reduce((e, t) => e + t.width, 0), Ne = x(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), Fe = x(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), Ie = V === "auto" ? q.length > 200 : V, Z = Qe(q.length, Te.scrollTop, Te.height, U, ee, Ie), Le = I && q.length === 0, Re = !I && q.length === 0, ze = Le ? ot : I && q.length > 0 ? 1 : 0, Be = Re ? st : (q.length + ze) * U, Ve = _((e) => {
		if (u) return u(e);
		let t = i[0];
		if (!t) return "";
		let n = Ye(t, e);
		return $(n, X(n, t.kind, t.format), {
			locale: ae,
			timeZone: oe
		});
	}, [
		u,
		i,
		ae,
		oe
	]), Q = _((e) => {
		f === void 0 && ye(e), h?.(e);
	}, [f, h]), He = (e) => {
		let t = Ze(G, e);
		g === void 0 && ge(t), w?.(t);
	};
	b(() => {
		let e = W.current;
		if (!e) return;
		let t = () => Ee((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let Ue = (e) => (e - Math.max(1, Math.floor(ee / 2))) * U, We = Te.scrollTop + Te.height >= Ue(q.length), Ge = () => {
		let e = W.current;
		if (!e) return;
		let t = Qe(q.length, e.scrollTop, e.clientHeight, U, ee, Ie), n = e.scrollTop + e.clientHeight >= Ue(q.length);
		(t.start !== Z.start || t.end !== Z.end || P && n !== We) && Ee({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	v(() => {
		we((e) => {
			let t = e.row < 0 || q.length === 0 ? -1 : Math.min(e.row, q.length - 1), n = Math.max(0, Math.min(e.column, Y.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [q.length, Y.length]), b(() => {
		de.current && (de.current = !1, W.current?.querySelector(`[data-cell="${K.row}:${K.column}"]`)?.focus({ preventScroll: !0 }));
	}), v(() => {
		P && !I && q.length !== 0 && (F !== void 0 && q.length >= F || We && pe.current !== q.length && (pe.current = q.length, P()));
	}, [
		P,
		I,
		q.length,
		F,
		We
	]);
	let qe = (e) => {
		let t = W.current;
		if (t && e.row >= 0) {
			let n = $e(e.row, t.scrollTop, t.clientHeight, U, U);
			n !== t.scrollTop && (t.scrollTop = n, Ee({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		de.current = !0, we(e);
	}, Je = (e, t) => {
		if (d === "single") {
			Q([e]), fe.current = e;
			return;
		}
		if (d === "multi") {
			if (t && fe.current) {
				Q([.../* @__PURE__ */ new Set([...be, ...et(J, fe.current, e)])]);
				return;
			}
			Q(xe.has(e) ? be.filter((t) => t !== e) : [...be, e]), fe.current = e;
		}
	}, lt = (e) => {
		let t = q[e];
		if (t !== void 0) {
			if (k) {
				k(t);
				return;
			}
			W.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, ut = (e, t, n) => {
		let r = q[e];
		r !== void 0 && M && M(r).length !== 0 && Oe({
			rowIndex: e,
			x: t,
			y: n
		});
	}, dt = _(() => {
		Oe(null), de.current = !0;
	}, []);
	_e(De !== null, ue, dt);
	let ft = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		Ce((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, pt = (e) => {
		if (ct(e.target) || De) return;
		let { row: t, column: n } = K, r = q.length, i = Math.max(1, Math.floor((W.current?.clientHeight ?? U * 10) / U) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), ft(n, e.key === "ArrowRight" ? at : -16);
			return;
		}
		let o = tt(K, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && d === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = J[o.row];
				e && (fe.current ||= J[Math.max(0, t)] ?? e, Q([.../* @__PURE__ */ new Set([...be, ...et(J, fe.current, e)])]));
			}
			qe(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), He(a.column.id)) : e.key === " " && a?.kind === "select" && d === "multi" && (e.preventDefault(), Q(be.length === J.length ? [] : [...J]));
			return;
		}
		let s = J[t];
		if (e.key === "Enter") e.preventDefault(), lt(t);
		else if (e.key === " " && s) e.preventDefault(), Je(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && d === "multi") e.preventDefault(), Q([...J]);
		else if (e.key === "F2" && N && a?.kind === "data") {
			e.preventDefault();
			let n = q[t];
			n !== void 0 && N(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			ut(t, n.left + 12, n.bottom);
		}
	}, mt = (e, t) => {
		let n = J[t];
		n && d !== "none" && (e.target.closest("a, button, input, select, textarea") || (d === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Je(n, e.shiftKey) : (Q([n]), fe.current = n)));
	}, ht = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? 48, o = r.column.id, s = (e) => {
			Ce((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, gt = (e, t) => {
		let n = K.row === e && K.column === t, r = Ne.get(t);
		return {
			"data-cell": `${e}:${t}`,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: () => {
				n || we({
					row: e,
					column: t
				});
			}
		};
	}, _t = [];
	for (let e = Z.start; e < Z.end; e++) _t.push(e);
	K.row >= 0 && K.row < q.length && (K.row < Z.start || K.row >= Z.end) && _t.push(K.row);
	let vt = d === "multi" && J.length > 0 && J.every((e) => xe.has(e)), yt = d === "multi" && !vt && J.some((e) => xe.has(e)), bt = De ? q[De.rowIndex] : void 0, xt = {
		"--mtc-grid-template": je,
		"--mtc-grid-min-width": `${Me}px`,
		"--mtc-grid-row-height": `${U}px`,
		"--mtc-grid-viewport-width": Te.width > 0 ? `${Te.width}px` : "100%"
	};
	return /* @__PURE__ */ E("div", {
		className: p("mtc-data-grid", R && `mtc-density-${R}`, ne),
		style: {
			...xt,
			height: B
		},
		children: [
			/* @__PURE__ */ E("div", {
				ref: W,
				role: "grid",
				"aria-label": r,
				"aria-rowcount": (F ?? q.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": d === "multi" || void 0,
				"aria-busy": I || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: pt,
				onScroll: Ge,
				children: [/* @__PURE__ */ T("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ T("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Y.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ T("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...gt(-1, t),
								children: /* @__PURE__ */ T("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": re("dataGrid.selectAll"),
									checked: vt,
									ref: (e) => {
										e && (e.indeterminate = yt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Q(vt ? [] : [...J])
								})
							}, "__select");
							let { column: n } = e, r = G?.columnId === n.id ? G.direction : void 0, i = n.align === "end" || !n.align && !n.cell && Pe(X(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ E("div", {
								role: "columnheader",
								"aria-sort": r ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": i ? "end" : "start",
								"data-sortable": o || void 0,
								...gt(-1, t),
								onClick: o ? () => {
									He(n.id), we({
										row: -1,
										column: t
									});
								} : void 0,
								children: [
									/* @__PURE__ */ T("span", {
										className: "mtc-data-grid-header-label",
										children: n.header
									}),
									r && /* @__PURE__ */ T(a, {
										name: r === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ T("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => ht(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ E("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Be },
					children: [
						_t.map((e) => {
							let t = q[e], n = J[e], r = xe.has(n), i = A?.(t);
							return /* @__PURE__ */ T("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": d === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * U },
								...te?.(t),
								onClick: (t) => mt(t, e),
								onDoubleClick: (t) => {
									t.target.closest("a, button, input, select, textarea") || lt(e);
								},
								onContextMenu: M ? (t) => {
									t.preventDefault(), d !== "none" && !r && Q([n]), we({
										row: e,
										column: K.column
									}), ut(e, t.clientX, t.clientY);
								} : void 0,
								children: Y.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ T("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...gt(e, o),
										children: /* @__PURE__ */ T("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": re("dataGrid.selectRow", { label: Ve(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Je(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = Ye(s, t), l = X(c, s.kind, s.format), u = s.align === "end" || !s.align && !s.cell && Pe(l.kind), d = s.cell ? s.cell(t, {
										value: c,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ T(Ke, {
										value: c,
										kind: s.kind,
										format: s.format,
										tones: s.tones,
										context: "grid"
									});
									return /* @__PURE__ */ T("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-align": u ? "end" : "start",
										...gt(e, o),
										children: i && o === Fe ? /* @__PURE__ */ T("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: ke(j ? (e) => j(t, e) : void 0),
											children: d
										}) : d
									}, s.id);
								})
							}, n);
						}),
						Le && Array.from({ length: ot }, (e, t) => /* @__PURE__ */ T("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * U },
							children: Y.map((e, n) => /* @__PURE__ */ T("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ T(ie, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Le && /* @__PURE__ */ T("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ T("div", {
								role: "gridcell",
								children: re("dataGrid.loading")
							})
						}),
						I && q.length > 0 && /* @__PURE__ */ T("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: q.length * U },
							children: /* @__PURE__ */ T("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: re("dataGrid.loadingMore")
							})
						}),
						Re && /* @__PURE__ */ T("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: st
							},
							children: /* @__PURE__ */ T("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: L ?? /* @__PURE__ */ T(o, {
									compact: !0,
									title: re("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			H && /* @__PURE__ */ T("div", {
				className: "mtc-data-grid-footer",
				children: H
			}),
			De && bt !== void 0 && M && (() => {
				let e = /* @__PURE__ */ T("div", {
					ref: ue,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ T(me, {
						label: re("dataGrid.rowActions", { label: Ve(bt) }),
						items: M(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: De.x,
							top: De.y
						},
						onClose: dt
					})
				});
				return ce ? D(e, ce) : e;
			})()
		]
	});
}
//#endregion
//#region src/workbench/PropertyList.tsx
var ut = h(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ T("dl", {
		...a,
		ref: o,
		className: p("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ E("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ E("dt", { children: [/* @__PURE__ */ T("span", { children: e.label }), e.description && /* @__PURE__ */ T("small", { children: e.description })] }), /* @__PURE__ */ T("dd", { children: g(e.value) ? e.value : /* @__PURE__ */ T(Ke, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), dt = h(function({ type: e, title: t, objectId: r, status: i, meta: a, actions: o, compact: s = !1, headingLevel: c = s ? 2 : 1, typeHref: l, onTypeNavigate: u, className: d, style: f, ...m }, h) {
	let g = n(), { icon: _, color: v } = Y(e), y = `h${c}`, b = !s && (i || a && a.length > 0);
	return /* @__PURE__ */ E("div", {
		...m,
		ref: h,
		className: p("mtc-object-header", d),
		"data-compact": s || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${v}-fg)`,
			...f
		},
		children: [
			/* @__PURE__ */ T(j, {
				icon: _,
				color: v,
				size: s ? 24 : 40
			}),
			/* @__PURE__ */ E("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ E("div", {
						className: "mtc-object-header-eyebrow",
						children: [l ? /* @__PURE__ */ T("a", {
							className: "mtc-object-header-type",
							href: l,
							onClick: ke(u),
							children: e.label
						}) : /* @__PURE__ */ T("span", {
							className: "mtc-object-header-type",
							children: e.label
						}), r && /* @__PURE__ */ E(w, { children: [
							/* @__PURE__ */ T("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ T("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ T(oe, {
								value: r,
								label: g("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ T(y, {
						className: "mtc-object-header-title",
						children: t
					}),
					s && i && /* @__PURE__ */ T("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ T(H, {
							tone: i.tone,
							children: i.label
						})
					}),
					b && /* @__PURE__ */ E("div", {
						className: "mtc-object-header-meta",
						children: [i && /* @__PURE__ */ T(H, {
							tone: i.tone,
							children: i.label
						}), a && a.length > 0 && /* @__PURE__ */ T(se, { items: a })]
					})
				]
			}),
			o && /* @__PURE__ */ T("div", {
				className: "mtc-object-header-actions",
				children: o
			})
		]
	});
}), ft = h(function({ properties: e, title: t, filterable: r = !0, actions: i, emptyValue: o, now: l, density: u, labelWidth: d = 160, onNavigate: f, headingLevel: m, className: h, style: g, ..._ }, v) {
	let b = n(), { locale: D, timeZone: O } = c(), k = y(), A = S(null), [j, N] = C(!1), [P, F] = C(""), I = x(() => {
		let t = P.trim().toLowerCase();
		return t ? e.filter((e) => {
			let n = $(e.value, X(e.value, e.kind, e.format), {
				locale: D,
				timeZone: O
			});
			return e.label.toLowerCase().includes(t) || n.toLowerCase().includes(t);
		}) : e;
	}, [
		e,
		P,
		D,
		O
	]), L = x(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of I) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [I]), R = () => {
		j ? (F(""), N(!1)) : (N(!0), requestAnimationFrame(() => A.current?.focus()));
	};
	return /* @__PURE__ */ E(ce, {
		..._,
		ref: v,
		title: t ?? b("propertyPanel.title"),
		subtitle: b("propertyPanel.count", {
			shown: I.length,
			total: e.length
		}),
		headingLevel: m,
		className: p("mtc-property-panel", u && `mtc-density-${u}`, h),
		style: {
			"--mtc-property-label-width": `${d}px`,
			...g
		},
		actions: (r || i) && /* @__PURE__ */ E(w, { children: [i, r && /* @__PURE__ */ T(s, {
			icon: /* @__PURE__ */ T(a, { name: "filter" }),
			"aria-label": b("propertyPanel.filter"),
			"aria-expanded": j,
			"aria-controls": j ? k : void 0,
			variant: j ? "outline" : "ghost",
			size: "small",
			onClick: R
		})] }),
		children: [j && /* @__PURE__ */ T("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ T(M, {
				ref: A,
				id: k,
				type: "search",
				size: "small",
				value: P,
				"aria-label": b("propertyPanel.filter"),
				placeholder: b("propertyPanel.filter"),
				onChange: (e) => F(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), R());
				}
			})
		}), I.length === 0 ? /* @__PURE__ */ T("p", {
			className: "mtc-property-panel-empty",
			children: b("propertyPanel.noMatch", { query: P.trim() })
		}) : L.map(([e, t]) => /* @__PURE__ */ E("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ T("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ T("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ E("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ E("dt", { children: [/* @__PURE__ */ T("span", { children: e.label }), e.description && /* @__PURE__ */ T("small", { children: e.description })] }), /* @__PURE__ */ T("dd", { children: /* @__PURE__ */ T(Ke, {
						value: e.value,
						kind: e.kind,
						format: e.format,
						tones: e.tones,
						emptyValue: o,
						now: l,
						onNavigate: f
					}) })]
				}, e.id))
			})]
		}, e || "_"))]
	});
});
//#endregion
export { oe as A, F as B, he as C, ue as D, de as E, H as F, L as G, P as H, ne as I, j as J, N as K, B as L, se as M, ce as N, W as O, ie as P, V as R, pe as S, fe as T, M as U, R as V, I as W, k as Y, we as _, Ke as a, be as b, Pe as c, je as d, Ae as f, Se as g, Te as h, lt as i, te as j, re as k, He as l, De as m, dt as n, We as o, Y as p, O as q, ut as r, $ as s, ft as t, X as u, K as v, ge as w, ye as x, Ce as y, z };
