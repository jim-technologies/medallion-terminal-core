import { E as e, T as t, _ as n, b as r, h as i, p as a, w as o, y as s } from "./States-C2XVn7Rw.js";
import { i as c, n as l, r as u, t as d } from "./utils-j4lJ7S1v.js";
import { cloneElement as f, forwardRef as p, isValidElement as m, useCallback as h, useEffect as g, useId as _, useLayoutEffect as v, useMemo as y, useRef as b, useState as x } from "react";
import { Fragment as S, jsx as C, jsxs as w } from "react/jsx-runtime";
import { createPortal as T } from "react-dom";
//#region src/components/TypeGlyph.tsx
var E = [
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
function D(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, E[(t >>> 0) % E.length];
}
var O = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, k = p(function({ icon: e = "object", color: t, size: n = 20, label: r, className: a, ...o }, s) {
	return /* @__PURE__ */ C("span", {
		...o,
		ref: s,
		className: d("mtc-type-glyph", a),
		"data-color": t,
		"data-size": n,
		role: r ? "img" : void 0,
		"aria-label": r,
		"aria-hidden": !r || void 0,
		children: /* @__PURE__ */ C(i, {
			name: e,
			size: O[n],
			strokeWidth: n <= 20 ? 2 : 1.75
		})
	});
}), A = p(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ C("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: d("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), j = p(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ C("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: d("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function M({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = _(), c = (m(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, l = r ? `${c}-description` : void 0, u = i ? `${c}-error` : void 0, p = [
		m(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		l,
		u
	].filter(Boolean).join(" ") || void 0, h = (m(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, g = m(t) ? f(t, {
		id: c,
		"aria-describedby": p,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: h
	}) : t;
	return /* @__PURE__ */ w("div", {
		className: d("mtc-form-field", o),
		children: [
			/* @__PURE__ */ w("label", {
				className: "mtc-form-label",
				htmlFor: c,
				children: [e, h && /* @__PURE__ */ C("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			g,
			r && /* @__PURE__ */ C("div", {
				id: l,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ C("div", {
				id: u,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var N = p(function({ label: e, description: t, density: n, className: r, ...a }, o) {
	return /* @__PURE__ */ w("label", {
		className: d("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ C("input", {
				...a,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ C("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ C(i, { name: "check" })
			}),
			/* @__PURE__ */ w("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ C("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ C("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), P = p(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ w("label", {
		className: d("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ C("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ C("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ w("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ C("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ C("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), F = p(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ w("label", {
		className: d("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ C("input", {
				...o,
				ref: s,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ C("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ C("span", {})
			}),
			/* @__PURE__ */ w("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ C("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ C("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), I = p(function({ value: e, onValueChange: n, options: r, placeholder: a, disabled: o, required: s, name: c, id: l, "aria-label": u, "aria-labelledby": f, "aria-describedby": p, "aria-invalid": m, invalid: h, size: v = "medium", density: S, className: T, emptyMessage: E }, D) {
	let O = t(), k = _(), A = l ?? `mtc-combobox-${k}`, j = `${A}-listbox`, M = b(null), N = b(null), P = r.find((t) => t.value === e), [F, I] = x(P?.label ?? ""), [L, R] = x(!1), [z, B] = x(-1), V = y(() => {
		let e = F.trim().toLocaleLowerCase();
		return !e || P?.label === F ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		F,
		P?.label
	]);
	g(() => {
		L || I(P?.label ?? "");
	}, [L, P?.label]), g(() => {
		N.current?.setCustomValidity(s && !P ? "Please select an option." : "");
	}, [s, P]), g(() => {
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
	return /* @__PURE__ */ w("div", {
		ref: M,
		className: d("mtc-combobox", S && `mtc-density-${S}`, T),
		"data-size": v,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(!1);
		},
		children: [
			c && /* @__PURE__ */ C("input", {
				type: "hidden",
				name: c,
				value: e ?? ""
			}),
			/* @__PURE__ */ C("input", {
				ref: (e) => {
					N.current = e, typeof D == "function" ? D(e) : D && (D.current = e);
				},
				id: A,
				value: F,
				disabled: o,
				required: s,
				placeholder: a ?? O("combobox.placeholder"),
				role: "combobox",
				"aria-label": u,
				"aria-labelledby": f,
				"aria-describedby": p,
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
			/* @__PURE__ */ C(i, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			L && !o && /* @__PURE__ */ C("div", {
				id: j,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: V.length === 0 ? /* @__PURE__ */ C("div", {
					className: "mtc-combobox-empty",
					children: E ?? O("combobox.empty")
				}) : V.map((t, n) => /* @__PURE__ */ w("div", {
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
					children: [/* @__PURE__ */ w("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ C("span", { children: t.label }), t.description && /* @__PURE__ */ C("small", { children: t.description })]
					}), t.value === e && /* @__PURE__ */ C(i, { name: "check" })]
				}, t.value))
			})
		]
	});
}), L = p(function({ intent: e = "neutral", size: n = "small", onRemove: r, removeLabel: a, className: o, children: s, ...c }, l) {
	let u = t();
	return /* @__PURE__ */ w("span", {
		...c,
		ref: l,
		className: d("mtc-tag", o),
		"data-intent": e,
		"data-size": n,
		children: [/* @__PURE__ */ C("span", { children: s }), r && /* @__PURE__ */ C("button", {
			type: "button",
			onClick: r,
			"aria-label": a ?? u("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ C(i, { name: "close" })
		})]
	});
}), R = p(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ w("span", {
		...a,
		ref: o,
		className: d("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ C("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), i]
	});
}), z = p(function({ title: e, intent: t = "info", icon: n, actions: r, className: a, children: o, role: s, ...c }, l) {
	let u = t === "danger" ? "error" : t === "warning" ? "warning" : t === "success" ? "success" : "info";
	return /* @__PURE__ */ w("div", {
		...c,
		ref: l,
		role: s ?? (t === "danger" ? "alert" : "status"),
		className: d("mtc-callout", a),
		"data-intent": t,
		children: [/* @__PURE__ */ C("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: n ?? /* @__PURE__ */ C(i, { name: u })
		}), /* @__PURE__ */ w("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ C("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ C("div", {
					className: "mtc-callout-body",
					children: o
				}),
				r && /* @__PURE__ */ C("div", {
					className: "mtc-callout-actions",
					children: r
				})
			]
		})]
	});
}), B = {
	ok: "success",
	warning: "warning",
	danger: "danger",
	info: "info",
	neutral: "neutral"
}, V = p(function({ tone: e = "neutral", size: t = "small", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ C(R, {
		...i,
		ref: a,
		dot: !0,
		intent: B[e],
		size: t,
		"data-tone": e,
		className: d("mtc-status-badge", n),
		children: r
	});
}), H = p(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ C("kbd", {
		...t,
		ref: n,
		className: d("mtc-kbd", e)
	});
});
function U(e) {
	let t = e.split(/[\s·._@-]+/u).filter((e) => /\p{L}|\p{N}/u.test(e));
	if (t.length === 0) return "?";
	let n = [...t[0]];
	if (t.length === 1) return n.slice(0, 2).join("").toUpperCase();
	let r = [...t[t.length - 1]];
	return `${n[0] ?? ""}${r[0] ?? ""}`.toUpperCase();
}
var ee = p(function({ name: e, src: t, size: n = 24, decorative: r = !1, className: i, ...a }, o) {
	let [s, c] = x(!1);
	return g(() => c(!1), [t]), /* @__PURE__ */ C("span", {
		...a,
		ref: o,
		className: d("mtc-avatar", i),
		"data-size": n,
		role: r ? void 0 : "img",
		"aria-label": r ? void 0 : e,
		"aria-hidden": r || void 0,
		title: r ? void 0 : e,
		children: t && !s ? /* @__PURE__ */ C("img", {
			src: t,
			alt: "",
			onError: () => c(!0)
		}) : /* @__PURE__ */ C("span", {
			"aria-hidden": "true",
			children: U(e)
		})
	});
}), te = p(function({ width: e, height: t, shape: n = "line", lines: r, className: i, style: a, ...o }, s) {
	let c = (e) => typeof e == "number" ? `${e}px` : e;
	return r && r > 1 ? /* @__PURE__ */ C("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: d("mtc-skeleton-lines", i),
		style: {
			width: c(e),
			...a
		},
		children: Array.from({ length: r }, (e, t) => /* @__PURE__ */ C("span", {
			className: "mtc-skeleton",
			"data-shape": "line",
			style: t === r - 1 ? { width: "60%" } : void 0
		}, t))
	}) : /* @__PURE__ */ C("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: d("mtc-skeleton", i),
		"data-shape": n,
		style: {
			width: c(e),
			height: c(t),
			...a
		}
	});
}), ne = 1500, W = p(function({ value: e, label: n, copiedLabel: r, size: o = "small", clipboard: s, onCopied: c, className: l, ...u }, f) {
	let p = t(), [m, h] = x(!1), _ = b(void 0);
	g(() => () => clearTimeout(_.current), []);
	let v = async () => {
		let t = s ?? (typeof navigator < "u" ? navigator.clipboard : void 0);
		if (t) {
			try {
				await t.writeText(e);
			} catch {
				return;
			}
			h(!0), c?.(e), clearTimeout(_.current), _.current = setTimeout(() => h(!1), ne);
		}
	};
	return /* @__PURE__ */ w("span", {
		className: d("mtc-copy-button", l),
		"data-copied": m || void 0,
		children: [/* @__PURE__ */ C(a, {
			...u,
			ref: f,
			variant: "ghost",
			size: o,
			icon: /* @__PURE__ */ C(i, { name: m ? "check" : "copy" }),
			"aria-label": n ?? p("copy.label"),
			onClick: () => void v()
		}), /* @__PURE__ */ C("span", {
			role: "status",
			className: "mtc-visually-hidden",
			children: m ? r ?? p("copy.copied") : ""
		})]
	});
}), re = p(function({ items: e, className: t, ...n }, r) {
	return /* @__PURE__ */ C("ul", {
		...n,
		ref: r,
		className: d("mtc-meta-row", t),
		children: e.filter((e) => e != null && e !== !1).map((e, t) => /* @__PURE__ */ C("li", {
			className: "mtc-meta-item",
			children: e
		}, t))
	});
}), ie = p(function({ title: e, subtitle: t, actions: n, footer: r, headingLevel: i = 2, padded: a = !1, className: o, children: s, ...c }, l) {
	let u = _(), f = `h${i}`;
	return /* @__PURE__ */ w("section", {
		...c,
		ref: l,
		"aria-labelledby": u,
		className: d("mtc-panel", o),
		children: [
			/* @__PURE__ */ w("header", {
				className: "mtc-panel-header",
				children: [
					/* @__PURE__ */ C(f, {
						id: u,
						className: "mtc-panel-title",
						children: e
					}),
					t != null && /* @__PURE__ */ C("span", {
						className: "mtc-panel-subtitle",
						children: t
					}),
					n && /* @__PURE__ */ C("div", {
						className: "mtc-panel-actions",
						children: n
					})
				]
			}),
			/* @__PURE__ */ C("div", {
				className: "mtc-panel-body",
				"data-padded": a || void 0,
				children: s
			}),
			r && /* @__PURE__ */ C("footer", {
				className: "mtc-panel-footer",
				children: r
			})
		]
	});
}), ae = 6, oe = 320;
function se({ children: t, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = _(), s = e(), c = b(null), l = b(void 0), [u, p] = x(!1), [m, y] = x(null), S = h((e, t) => {
		clearTimeout(l.current), l.current = setTimeout(() => p(e), t);
	}, []);
	g(() => () => clearTimeout(l.current), []), v(() => {
		if (!u || !c.current || typeof window > "u") {
			y(null);
			return;
		}
		let e = c.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - oe - 8));
		y({
			left: r,
			top: n === "below" ? e.bottom + ae : e.top - ae,
			placement: n
		});
	}, [u]), g(() => {
		if (!u) return;
		let e = (e) => {
			e.key === "Escape" && p(!1);
		}, t = () => p(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [u]);
	let E = t, D = [E.props["aria-describedby"], u ? o : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ w("span", {
		ref: c,
		className: "mtc-hover-card-trigger",
		children: [f(E, {
			"aria-describedby": D,
			onMouseEnter: (e) => {
				E.props.onMouseEnter?.(e), S(!0, r);
			},
			onMouseLeave: (e) => {
				E.props.onMouseLeave?.(e), S(!1, i);
			},
			onFocus: (e) => {
				E.props.onFocus?.(e), S(!0, r);
			},
			onBlur: (e) => {
				E.props.onBlur?.(e), S(!1, 0);
			}
		}), u && s && m && T(/* @__PURE__ */ C("div", {
			id: o,
			role: "tooltip",
			className: d("mtc-hover-card", a),
			"data-placement": m.placement,
			style: {
				left: m.left,
				top: m.top,
				width: oe,
				transform: m.placement === "above" ? "translateY(-100%)" : void 0
			},
			onMouseEnter: () => clearTimeout(l.current),
			onMouseLeave: () => S(!1, i),
			children: n
		}), s)]
	});
}
//#endregion
//#region src/components/Overlays.tsx
function ce({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let a = _(), [o, s] = u({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ C(S, { children: t });
	let c = t, l = [c.props["aria-describedby"], o ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ w("span", {
		className: d("mtc-tooltip-trigger", i),
		children: [f(c, {
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
		}), o && /* @__PURE__ */ C("span", {
			id: a,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function le({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", disabled: c, className: l }) {
	let f = _(), p = _(), m = b(null), h = b(null), [g, v] = u({
		value: i,
		defaultValue: a,
		onChange: o
	});
	return G(g, m, () => {
		v(!1), h.current?.focus();
	}), /* @__PURE__ */ w("div", {
		ref: m,
		className: d("mtc-popover-root", l),
		children: [/* @__PURE__ */ C("button", {
			ref: h,
			type: "button",
			className: "mtc-popover-trigger",
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": g,
			"aria-controls": g ? f : void 0,
			disabled: c,
			onClick: () => v(!g),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !g && (e.preventDefault(), v(!0));
			},
			children: e
		}), g && /* @__PURE__ */ w("div", {
			id: f,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? p : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": s,
			children: [r && /* @__PURE__ */ C("div", {
				id: p,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function ue({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: a, align: o = "start", disabled: s, className: c }) {
	let l = b(null), f = b(null), [p, m] = u({
		value: void 0,
		defaultValue: 0
	}), [h, g] = u({
		value: r,
		defaultValue: i,
		onChange: a
	}), _ = (e = !0) => {
		g(!1), e && f.current?.focus();
	};
	return G(h, l, () => _(!1)), /* @__PURE__ */ w("div", {
		ref: l,
		className: d("mtc-menu-root", c),
		children: [/* @__PURE__ */ C("button", {
			ref: f,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": h,
			disabled: s,
			onClick: () => {
				m(K(n, 1)), g(!h);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), m(K(n, e.key === "ArrowDown" ? 1 : -1)), g(!0));
			},
			children: t
		}), h && /* @__PURE__ */ C(fe, {
			label: e,
			items: n,
			initialIndex: p,
			align: o,
			onClose: _
		})]
	});
}
var de = p(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: a, onKeyDown: o, ...s }, c) {
	let l = b(null), f = b({
		x: 0,
		y: 0
	}), [p, m] = u({
		value: void 0,
		defaultValue: !1
	}), [h, g] = u({
		value: void 0,
		defaultValue: 0
	}), _ = (e) => {
		l.current = e, typeof c == "function" ? c(e) : c && (c.current = e);
	};
	G(p, l, () => m(!1));
	let v = (e, n) => {
		f.current = {
			x: e,
			y: n
		}, g(K(t, 1)), m(!0);
	};
	return /* @__PURE__ */ w("div", {
		...s,
		ref: _,
		className: d("mtc-context-menu-region", r),
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
		children: [n, p && /* @__PURE__ */ C(fe, {
			label: e,
			items: t,
			initialIndex: h,
			style: {
				position: "fixed",
				left: f.current.x,
				top: f.current.y
			},
			onClose: () => {
				m(!1), l.current?.focus();
			}
		})]
	});
});
function fe({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = b(null);
	g(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = he(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ C("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ C("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ w("button", {
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
				e.icon && /* @__PURE__ */ C("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ C("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ C("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var pe = p(function({ open: e, onOpenChange: n, title: r, description: o, children: s, footer: u, size: f = "medium", dismissible: p = !0, initialFocusRef: m, className: h }, g) {
	let v = t(), y = _(), x = _(), S = b(null);
	return c(e, S, m), e ? /* @__PURE__ */ C("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			p && e.target === e.currentTarget && n(!1);
		},
		children: /* @__PURE__ */ w("div", {
			ref: (e) => {
				S.current = e, typeof g == "function" ? g(e) : g && (g.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": y,
			"aria-describedby": o ? x : void 0,
			tabIndex: -1,
			className: d("mtc-dialog", h),
			"data-size": f,
			onKeyDown: (e) => l(e, S, p, () => n(!1)),
			children: [
				/* @__PURE__ */ w("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ w("div", { children: [/* @__PURE__ */ C("h2", {
						id: y,
						className: "mtc-modal-title",
						children: r
					}), o && /* @__PURE__ */ C("p", {
						id: x,
						className: "mtc-modal-description",
						children: o
					})] }), p && /* @__PURE__ */ C(a, {
						icon: /* @__PURE__ */ C(i, { name: "close" }),
						"aria-label": v("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => n(!1)
					})]
				}),
				/* @__PURE__ */ C("div", {
					className: "mtc-modal-body",
					children: s
				}),
				u && /* @__PURE__ */ C("div", {
					className: "mtc-modal-footer",
					children: u
				})
			]
		})
	}) : null;
}), me = p(function({ open: e, onOpenChange: n, title: r, description: o, children: s, footer: u, side: f = "right", width: p = 420, dismissible: m = !0, initialFocusRef: h, className: g }, v) {
	let y = t(), x = _(), S = _(), T = b(null);
	return c(e, T, h), e ? /* @__PURE__ */ C("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			m && e.target === e.currentTarget && n(!1);
		},
		children: /* @__PURE__ */ w("div", {
			ref: (e) => {
				T.current = e, typeof v == "function" ? v(e) : v && (v.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": x,
			"aria-describedby": o ? S : void 0,
			tabIndex: -1,
			className: d("mtc-drawer", g),
			"data-side": f,
			style: { width: p },
			onKeyDown: (e) => l(e, T, m, () => n(!1)),
			children: [
				/* @__PURE__ */ w("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ w("div", { children: [/* @__PURE__ */ C("h2", {
						id: x,
						className: "mtc-modal-title",
						children: r
					}), o && /* @__PURE__ */ C("p", {
						id: S,
						className: "mtc-modal-description",
						children: o
					})] }), m && /* @__PURE__ */ C(a, {
						icon: /* @__PURE__ */ C(i, { name: "close" }),
						"aria-label": y("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => n(!1)
					})]
				}),
				/* @__PURE__ */ C("div", {
					className: "mtc-modal-body",
					children: s
				}),
				u && /* @__PURE__ */ C("div", {
					className: "mtc-modal-footer",
					children: u
				})
			]
		})
	}) : null;
});
function G(e, t, n) {
	g(() => {
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
function K(e, t) {
	return he(e, t === 1 ? -1 : 0, t);
}
function he(e, t, n) {
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
var ge = p(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: o, keepMounted: s = !1, className: c, ...l }, u) {
	let f = _(), p = b(/* @__PURE__ */ new Map()), m = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), h = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let o = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		o && (p.current.get(o.id)?.focus(), a === "automatic" && n(o.id));
	}, g = (t, r) => {
		let o = i === "horizontal" ? "ArrowLeft" : "ArrowUp", s = i === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === o || t.key === s) t.preventDefault(), h(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (p.current.get(i.id)?.focus(), a === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && a === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ w("div", {
		...l,
		ref: u,
		className: d("mtc-tabs", o && `mtc-density-${o}`, c),
		"data-orientation": i,
		children: [/* @__PURE__ */ C("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === m?.id, r = `${f}-tab-${e.id}`, i = `${f}-panel-${e.id}`;
				return /* @__PURE__ */ w("button", {
					ref: (t) => {
						t ? p.current.set(e.id, t) : p.current.delete(e.id);
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
					children: [/* @__PURE__ */ C("span", { children: e.label }), e.count != null && /* @__PURE__ */ C("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ C("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === m?.id;
				return !t && !s ? null : /* @__PURE__ */ C("div", {
					role: "tabpanel",
					id: `${f}-panel-${e.id}`,
					"aria-labelledby": `${f}-tab-${e.id}`,
					tabIndex: 0,
					hidden: !t,
					className: "mtc-tab-panel",
					children: e.panel
				}, e.id);
			})
		})]
	});
}), _e = p(function({ items: e, label: n, maxItems: r, className: a, ...o }, s) {
	let c = t(), l = ve(e, r);
	return /* @__PURE__ */ C("nav", {
		...o,
		ref: s,
		"aria-label": n ?? c("breadcrumbs.label"),
		className: d("mtc-breadcrumbs", a),
		children: /* @__PURE__ */ C("ol", { children: l.map((e, t) => {
			let n = t === l.length - 1;
			return /* @__PURE__ */ w("li", { children: [t > 0 && /* @__PURE__ */ C(i, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), n ? /* @__PURE__ */ C("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ C("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ C("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ C("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${t}`);
		}) })
	});
});
function ve(e, t) {
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
var ye = p(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ C("div", {
		...i,
		ref: a,
		className: d("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), be = p(function({ label: e, start: n, end: r, density: i, sticky: a, className: o, children: s, ...c }, l) {
	let u = t();
	return /* @__PURE__ */ w("div", {
		...c,
		ref: l,
		role: "toolbar",
		"aria-label": e ?? u("toolbar.label"),
		className: d("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			n && /* @__PURE__ */ C("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: n
			}),
			/* @__PURE__ */ C("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ C("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), xe = p(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: c, ...l }, u) {
	let f = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...c
	};
	return /* @__PURE__ */ w("aside", {
		...l,
		ref: u,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: d("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: f,
		children: [
			t && /* @__PURE__ */ C("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ C("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ C("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), Se = p(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: c, style: l, ...u }, f) {
	let p = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...l
	};
	return /* @__PURE__ */ w("aside", {
		...u,
		ref: f,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: d("mtc-inspector", s),
		"data-open": o,
		style: p,
		children: [
			(t || r) && /* @__PURE__ */ w("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ w("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ C("h2", { children: t }), n && /* @__PURE__ */ C("p", { children: n })]
				}), r && /* @__PURE__ */ C("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ C("div", {
				className: "mtc-inspector-content",
				children: c
			}),
			i && /* @__PURE__ */ C("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), Ce = p(function({ primary: e, secondary: n, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: s, minSize: c = 15, maxSize: l = 85, step: f = 5, disabled: p, stackOnNarrow: m = !0, separatorLabel: h, className: g, style: _, ...v }, y) {
	let x = t(), S = b(null), T = b(!1), [E, D] = u({
		value: a,
		defaultValue: o,
		onChange: s
	}), O = Math.min(c, l), k = Math.max(c, l), A = Number.isFinite(f) && f !== 0 ? Math.abs(f) : 1, j = q(E, O, k), M = (e) => {
		S.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
	}, N = (e) => {
		if (!T.current || !S.current || p) return;
		let t = S.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		D(q(a, O, k));
	}, P = (e) => D(q(j + e, O, k)), F = i === "start" ? j : 100 - j, I = 100 - F;
	return /* @__PURE__ */ w("div", {
		...v,
		ref: M,
		className: d("mtc-split-pane", g),
		"data-orientation": r,
		"data-stack-narrow": m,
		style: {
			"--mtc-split-start": `${F}fr`,
			"--mtc-split-end": `${I}fr`,
			..._
		},
		children: [
			/* @__PURE__ */ C("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? e : n
			}),
			/* @__PURE__ */ C("div", {
				role: "separator",
				"aria-label": h ?? x("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": O,
				"aria-valuemax": k,
				"aria-valuenow": Math.round(j),
				"aria-disabled": p || void 0,
				tabIndex: p ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					p || (T.current = !0, e.currentTarget.setPointerCapture(e.pointerId), N(e));
				},
				onPointerMove: N,
				onPointerUp: (e) => {
					T.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					T.current = !1;
				},
				onKeyDown: (e) => {
					if (p) return;
					let t = r === "horizontal" ? "ArrowLeft" : "ArrowUp", n = r === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === n) {
						e.preventDefault();
						let t = e.key === n ? A : -A;
						P(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), D(O)) : e.key === "End" && (e.preventDefault(), D(k));
				},
				children: /* @__PURE__ */ C("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ C("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? n : e
			})
		]
	});
});
function q(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var we = p(function({ items: e, label: n, selectedId: r, onSelectionChange: a, expandedIds: o, onExpandedChange: s, density: c, className: l, ...u }, f) {
	let p = y(() => Te(e, o), [e, o]), m = t(), h = b(/* @__PURE__ */ new Map()), [_, v] = x(r ?? p.find((e) => !e.item.disabled)?.item.id);
	g(() => {
		_ && p.some((e) => e.item.id === _ && !e.item.disabled) || v(r ?? p.find((e) => !e.item.disabled)?.item.id);
	}, [
		_,
		r,
		p
	]);
	let S = (e) => {
		e && (v(e), h.current.get(e)?.focus());
	}, T = (e, t) => {
		let n = new Set(o);
		t ? n.add(e) : n.delete(e), s(n);
	}, E = p.filter((e) => !e.item.disabled), D = (e, t) => {
		let n = E.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, i = o.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = E[Math.min(E.length - 1, Math.max(0, n + t))];
			S(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !i ? T(t.item.id, !0) : r && S(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && i ? T(t.item.id, !1) : S(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? E[0] : E[E.length - 1];
			S(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), a?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(o);
			for (let e of p.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			s(n);
		}
	};
	return /* @__PURE__ */ C("div", {
		...u,
		ref: f,
		role: "tree",
		"aria-label": n,
		"aria-multiselectable": !1,
		className: d("mtc-tree", c && `mtc-density-${c}`, l),
		children: p.map((e) => {
			let { item: t } = e, n = !!t.children?.length, s = o.has(t.id), c = r === t.id;
			return /* @__PURE__ */ w("div", {
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
				tabIndex: !t.disabled && _ === t.id ? 0 : -1,
				className: "mtc-tree-item",
				"data-selected": c,
				"data-disabled": t.disabled || void 0,
				style: { "--mtc-tree-level": e.level },
				onFocus: () => v(t.id),
				onClick: () => {
					t.disabled || a?.(t.id);
				},
				onDoubleClick: () => {
					!t.disabled && n && T(t.id, !s);
				},
				onKeyDown: (t) => D(t, e),
				children: [
					/* @__PURE__ */ C("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": n ? m(s ? "tree.collapse" : "tree.expand", { label: Ee(t.label) }) : void 0,
						"aria-hidden": !n || void 0,
						disabled: !n || t.disabled,
						onClick: (e) => {
							e.stopPropagation(), n && T(t.id, !s);
						},
						children: n && /* @__PURE__ */ C(i, { name: "chevron-right" })
					}),
					t.icon && /* @__PURE__ */ C("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: t.icon
					}),
					/* @__PURE__ */ w("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ C("span", {
							className: "mtc-tree-label",
							children: t.label
						}), t.description && /* @__PURE__ */ C("span", {
							className: "mtc-tree-description",
							children: t.description
						})]
					})
				]
			}, t.id);
		})
	});
});
function Te(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...Te(o.children, t, n + 1, o.id, i)));
	}), a;
}
function Ee(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/components/navigation.ts
function De(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function Oe(e) {
	if (e) return (t) => {
		De(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/objects/types.ts
function J(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? D(e.id ?? e.label)
	};
}
function Y(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
//#region src/objects/ObjectChip.tsx
var X = p(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? J(e.type) : null, s = /* @__PURE__ */ w(S, { children: [o && /* @__PURE__ */ C(k, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ C("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, l = d("mtc-object-chip", i), u;
	return u = e.href ? /* @__PURE__ */ C("a", {
		ref: a,
		href: e.href,
		className: l,
		"data-interactive": "true",
		onClick: Oe(c),
		children: s
	}) : c ? /* @__PURE__ */ C("button", {
		ref: a,
		type: "button",
		className: l,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ C("span", {
		ref: a,
		className: l,
		children: s
	}), n ? /* @__PURE__ */ C(se, {
		content: n,
		children: u
	}) : u;
}), ke = /* @__PURE__ */ new Set([
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
function Z(e, t, n) {
	if (n) {
		let [e, t] = n.split(":");
		if (e === "currency") return {
			kind: "currency",
			currency: (t || "USD").toUpperCase()
		};
		if (ke.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : Y(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function Q(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Ae(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function je(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var Me = /^\d{4}-\d{2}-\d{2}$/;
function Ne(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = Me.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function Pe(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function Fe(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function Ie(e, t, n = "en") {
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
		case "percent": return new Intl.NumberFormat(n, {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		}).format(e);
		default: return s(e, { locale: n });
	}
}
function Le(e, t, { locale: r = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return n(e.date, {
		locale: r,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var Re = 864e5;
function ze(e, t, n = "en") {
	if (!e.dateOnly) return r(e.date, {
		locale: n,
		now: t
	});
	let i = new Date(t), a = Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate()), o = Math.round((e.date.getTime() - a) / Re);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : r(e.date, {
		locale: n,
		now: a
	});
}
function $(e, t, n = {}) {
	if (Q(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = je(e);
			return n == null ? String(e) : Ie(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = Ne(e);
			return r ? Le(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => $(e, Z(e), n)).join(", ");
		case "link": return Y(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${$(t, Z(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function Be(e, t, n = {}) {
	return Q(e) ? null : Ae(t.kind) ? je(e) ?? $(e, t, n) : t.kind === "date" || t.kind === "datetime" ? Ne(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : $(e, t, n);
}
function Ve(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : String(e).localeCompare(String(t), void 0, {
		numeric: !0,
		sensitivity: "base"
	});
}
//#endregion
//#region src/objects/PropertyValue.tsx
var He = 3;
function Ue(e) {
	return /* @__PURE__ */ C(We, {
		...e,
		depth: 0
	});
}
function We({ value: e, kind: n, format: r, tones: a, context: s = "panel", emptyValue: c, now: l, onNavigate: u, maxListItems: d, depth: f }) {
	let { locale: p, timeZone: m } = o(), h = t(), g = y(() => Z(e, n, r), [
		e,
		n,
		r
	]), _ = {
		locale: p,
		timeZone: m,
		yes: h("value.yes"),
		no: h("value.no")
	}, v = s === "panel";
	if (Q(e)) return /* @__PURE__ */ C("span", {
		className: "mtc-value-empty",
		children: c ?? "—"
	});
	switch (g.kind) {
		case "id":
		case "code": {
			let t = String(e);
			return /* @__PURE__ */ w("span", {
				className: "mtc-value-id",
				"data-context": s,
				children: [/* @__PURE__ */ C("code", { children: t }), v && /* @__PURE__ */ C(W, {
					value: t,
					label: h("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ C(Ge, {
			value: e,
			resolved: g,
			locale: p,
			panel: v
		});
		case "date":
		case "datetime": {
			let t = Ne(e);
			return t ? /* @__PURE__ */ w("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ C("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: Le(t, g.kind, _)
				}), v && /* @__PURE__ */ C("span", {
					className: "mtc-value-secondary",
					children: ze(t, l ?? Date.now(), p)
				})]
			}) : /* @__PURE__ */ C("span", {
				className: "mtc-value-text",
				children: String(e)
			});
		}
		case "boolean": {
			let t = e === !0 || e === "true";
			return /* @__PURE__ */ w("span", {
				className: "mtc-value-boolean",
				"data-value": t,
				children: [/* @__PURE__ */ C(i, { name: t ? "check" : "close" }), h(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = a?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ C(V, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ C(L, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = d ?? (v ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ w("span", {
				className: "mtc-value-list",
				"data-context": s,
				children: [r.map((e, t) => Y(e) ? /* @__PURE__ */ C(X, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ C(L, {
					className: "mtc-value-chip",
					children: $(e, Z(e), _)
				}, t)), i.length > 0 && /* @__PURE__ */ C(L, {
					className: "mtc-value-chip",
					title: h("value.moreTitle", {
						count: i.length,
						items: i.map((e) => $(e, Z(e), _)).join(", ")
					}),
					children: h("value.more", { count: i.length })
				})]
			});
		}
		case "link": return Y(e) ? /* @__PURE__ */ C(X, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ C("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = Pe(e);
			if (!t) return /* @__PURE__ */ C("span", {
				className: "mtc-value-text",
				children: String(e)
			});
			let n = String(e).trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
			return /* @__PURE__ */ w("a", {
				className: "mtc-value-link",
				href: t,
				target: "_blank",
				rel: "noopener noreferrer",
				children: [
					/* @__PURE__ */ C("span", {
						className: "mtc-value-link-text",
						children: n
					}),
					/* @__PURE__ */ C(i, { name: "external-link" }),
					/* @__PURE__ */ C("span", {
						className: "mtc-visually-hidden",
						children: h("value.newTab")
					})
				]
			});
		}
		case "email": return Fe(e) ? /* @__PURE__ */ C("a", {
			className: "mtc-value-link",
			href: `mailto:${e.trim()}`,
			children: /* @__PURE__ */ C("span", {
				className: "mtc-value-link-text",
				children: e.trim()
			})
		}) : /* @__PURE__ */ C("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "object": {
			if (f >= He || !e || typeof e != "object") return /* @__PURE__ */ C("span", {
				className: "mtc-value-text",
				children: $(e, g, _)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ w("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ C("summary", { children: h("value.fields", { count: t.length }) }), /* @__PURE__ */ C("dl", { children: t.map(([e, t]) => /* @__PURE__ */ w("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ C("dt", { children: e }), /* @__PURE__ */ C("dd", { children: /* @__PURE__ */ C(We, {
						value: t,
						context: s,
						now: l,
						onNavigate: u,
						depth: f + 1
					}) })]
				}, e)) })]
			});
		}
		default: {
			let t = String(e);
			return /* @__PURE__ */ C("span", {
				className: "mtc-value-text",
				"data-context": s,
				title: t.length > 80 ? t : void 0,
				children: t
			});
		}
	}
}
function Ge({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ w("span", {
		className: "mtc-value-number",
		children: [Ie(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ C("span", {
			className: "mtc-value-secondary",
			children: t.currency
		})]
	}) : /* @__PURE__ */ C("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
//#region src/workbench/PropertyList.tsx
var Ke = p(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ C("dl", {
		...a,
		ref: o,
		className: d("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ w("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ w("dt", { children: [/* @__PURE__ */ C("span", { children: e.label }), e.description && /* @__PURE__ */ C("small", { children: e.description })] }), /* @__PURE__ */ C("dd", { children: m(e.value) ? e.value : /* @__PURE__ */ C(Ue, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), qe = p(function({ type: e, title: n, objectId: r, status: i, meta: a, actions: o, compact: s = !1, headingLevel: c = s ? 2 : 1, typeHref: l, onTypeNavigate: u, className: f, style: p, ...m }, h) {
	let g = t(), { icon: _, color: v } = J(e), y = `h${c}`, b = !s && (i || a && a.length > 0);
	return /* @__PURE__ */ w("div", {
		...m,
		ref: h,
		className: d("mtc-object-header", f),
		"data-compact": s || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${v}-fg)`,
			...p
		},
		children: [
			/* @__PURE__ */ C(k, {
				icon: _,
				color: v,
				size: s ? 24 : 40
			}),
			/* @__PURE__ */ w("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ w("div", {
						className: "mtc-object-header-eyebrow",
						children: [l ? /* @__PURE__ */ C("a", {
							className: "mtc-object-header-type",
							href: l,
							onClick: Oe(u),
							children: e.label
						}) : /* @__PURE__ */ C("span", {
							className: "mtc-object-header-type",
							children: e.label
						}), r && /* @__PURE__ */ w(S, { children: [
							/* @__PURE__ */ C("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ C("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ C(W, {
								value: r,
								label: g("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ C(y, {
						className: "mtc-object-header-title",
						children: n
					}),
					s && i && /* @__PURE__ */ C("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ C(V, {
							tone: i.tone,
							children: i.label
						})
					}),
					b && /* @__PURE__ */ w("div", {
						className: "mtc-object-header-meta",
						children: [i && /* @__PURE__ */ C(V, {
							tone: i.tone,
							children: i.label
						}), a && a.length > 0 && /* @__PURE__ */ C(re, { items: a })]
					})
				]
			}),
			o && /* @__PURE__ */ C("div", {
				className: "mtc-object-header-actions",
				children: o
			})
		]
	});
}), Je = p(function({ properties: e, title: n, filterable: r = !0, actions: s, emptyValue: c, now: l, density: u, labelWidth: f = 160, onNavigate: p, headingLevel: m, className: h, style: g, ...v }, T) {
	let E = t(), { locale: D, timeZone: O } = o(), k = _(), j = b(null), [M, N] = x(!1), [P, F] = x(""), I = y(() => {
		let t = P.trim().toLowerCase();
		return t ? e.filter((e) => {
			let n = $(e.value, Z(e.value, e.kind, e.format), {
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
	]), L = y(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of I) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [I]), R = () => {
		M ? (F(""), N(!1)) : (N(!0), requestAnimationFrame(() => j.current?.focus()));
	};
	return /* @__PURE__ */ w(ie, {
		...v,
		ref: T,
		title: n ?? E("propertyPanel.title"),
		subtitle: E("propertyPanel.count", {
			shown: I.length,
			total: e.length
		}),
		headingLevel: m,
		className: d("mtc-property-panel", u && `mtc-density-${u}`, h),
		style: {
			"--mtc-property-label-width": `${f}px`,
			...g
		},
		actions: (r || s) && /* @__PURE__ */ w(S, { children: [s, r && /* @__PURE__ */ C(a, {
			icon: /* @__PURE__ */ C(i, { name: "filter" }),
			"aria-label": E("propertyPanel.filter"),
			"aria-expanded": M,
			"aria-controls": M ? k : void 0,
			variant: M ? "outline" : "ghost",
			size: "small",
			onClick: R
		})] }),
		children: [M && /* @__PURE__ */ C("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ C(A, {
				ref: j,
				id: k,
				type: "search",
				size: "small",
				value: P,
				"aria-label": E("propertyPanel.filter"),
				placeholder: E("propertyPanel.filter"),
				onChange: (e) => F(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), R());
				}
			})
		}), I.length === 0 ? /* @__PURE__ */ C("p", {
			className: "mtc-property-panel-empty",
			children: E("propertyPanel.noMatch", { query: P.trim() })
		}) : L.map(([e, t]) => /* @__PURE__ */ w("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ C("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ C("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ w("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ w("dt", { children: [/* @__PURE__ */ C("span", { children: e.label }), e.description && /* @__PURE__ */ C("small", { children: e.description })] }), /* @__PURE__ */ C("dd", { children: /* @__PURE__ */ C(Ue, {
						value: e.value,
						kind: e.kind,
						format: e.format,
						tones: e.tones,
						emptyValue: c,
						now: l,
						onNavigate: p
					}) })]
				}, e.id))
			})]
		}, e || "_"))]
	});
});
//#endregion
export { H as A, I as B, me as C, se as D, ce as E, U as F, j as G, A as H, R as I, D as J, E as K, z as L, ie as M, te as N, ee as O, V as P, L as R, pe as S, le as T, P as U, M as V, F as W, xe as _, Ve as a, ge as b, Be as c, Y as d, J as f, Se as g, ye as h, Ue as i, re as j, W as k, Z as l, Ce as m, qe as n, $ as o, we as p, k as q, Ke as r, Ae as s, Je as t, X as u, be as v, ue as w, de as x, _e as y, N as z };
