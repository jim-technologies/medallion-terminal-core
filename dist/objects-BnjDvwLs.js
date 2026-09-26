import { C as e, E as t, T as n, _ as r, b as i, h as a, n as o, p as s, w as c, y as l } from "./States-Dimd1TGw.js";
import { i as u, n as d, r as f, t as p } from "./utils-j4lJ7S1v.js";
import { t as m } from "./layeredLayout-D0PMUE9A.js";
import { cloneElement as h, forwardRef as g, isValidElement as _, useCallback as v, useEffect as y, useId as b, useLayoutEffect as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
import { createPortal as O } from "react-dom";
//#region src/components/TypeGlyph.tsx
var k = [
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
function A(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, k[(t >>> 0) % k.length];
}
var j = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, M = g(function({ icon: e = "object", color: t, size: n = 20, label: r, className: i, ...o }, s) {
	return /* @__PURE__ */ E("span", {
		...o,
		ref: s,
		className: p("mtc-type-glyph", i),
		"data-color": t,
		"data-size": n,
		role: r ? "img" : void 0,
		"aria-label": r,
		"aria-hidden": !r || void 0,
		children: /* @__PURE__ */ E(a, {
			name: e,
			size: j[n],
			strokeWidth: n <= 20 ? 2 : 1.75
		})
	});
}), ee = g(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: p("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), N = g(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ E("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: p("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function P({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = b(), c = (_(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, l = r ? `${c}-description` : void 0, u = i ? `${c}-error` : void 0, d = [
		_(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		l,
		u
	].filter(Boolean).join(" ") || void 0, f = (_(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, m = _(t) ? h(t, {
		id: c,
		"aria-describedby": d,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: f
	}) : t;
	return /* @__PURE__ */ D("div", {
		className: p("mtc-form-field", o),
		children: [
			/* @__PURE__ */ D("label", {
				className: "mtc-form-label",
				htmlFor: c,
				children: [e, f && /* @__PURE__ */ E("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			m,
			r && /* @__PURE__ */ E("div", {
				id: l,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ E("div", {
				id: u,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var F = g(function({ label: e, description: t, density: n, className: r, ...i }, o) {
	return /* @__PURE__ */ D("label", {
		className: p("mtc-choice", n && `mtc-density-${n}`, r),
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
}), I = g(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ D("label", {
		className: p("mtc-choice", n && `mtc-density-${n}`, r),
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
}), L = g(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ D("label", {
		className: p("mtc-switch", i && `mtc-density-${i}`, a),
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
}), te = g(function({ value: e, onValueChange: t, options: r, placeholder: i, disabled: o, required: s, name: c, id: l, "aria-label": u, "aria-labelledby": d, "aria-describedby": f, "aria-invalid": m, invalid: h, size: g = "medium", density: _, className: v, emptyMessage: x }, T) {
	let O = n(), k = b(), A = l ?? `mtc-combobox-${k}`, j = `${A}-listbox`, M = C(null), ee = C(null), N = r.find((t) => t.value === e), [P, F] = w(N?.label ?? ""), [I, L] = w(!1), [te, R] = w(-1), z = S(() => {
		let e = P.trim().toLocaleLowerCase();
		return !e || N?.label === P ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		P,
		N?.label
	]);
	y(() => {
		I || F(N?.label ?? "");
	}, [I, N?.label]), y(() => {
		ee.current?.setCustomValidity(s && !N ? "Please select an option." : "");
	}, [s, N]), y(() => {
		if (!I || typeof document > "u") return;
		let e = (e) => {
			M.current?.contains(e.target) || L(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [I]);
	let B = (e, t) => {
		if (z.length === 0) return -1;
		let n = e;
		for (let e = 0; e < z.length; e++) if (n = (n + t + z.length) % z.length, !z[n]?.disabled) return n;
		return -1;
	}, ne = (e) => {
		e.disabled || (t(e.value), F(e.label), L(!1), R(-1));
	};
	return /* @__PURE__ */ D("div", {
		ref: M,
		className: p("mtc-combobox", _ && `mtc-density-${_}`, v),
		"data-size": g,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || L(!1);
		},
		children: [
			c && /* @__PURE__ */ E("input", {
				type: "hidden",
				name: c,
				value: e ?? ""
			}),
			/* @__PURE__ */ E("input", {
				ref: (e) => {
					ee.current = e, typeof T == "function" ? T(e) : T && (T.current = e);
				},
				id: A,
				value: P,
				disabled: o,
				required: s,
				placeholder: i ?? O("combobox.placeholder"),
				role: "combobox",
				"aria-label": u,
				"aria-labelledby": d,
				"aria-describedby": f,
				"aria-invalid": h || m || void 0,
				"aria-required": s || void 0,
				"aria-expanded": I,
				"aria-controls": I ? j : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": I && te >= 0 ? `${A}-option-${te}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					L(!0), R(z.findIndex((t) => t.value === e && !t.disabled));
				},
				onChange: (e) => {
					F(e.currentTarget.value), L(!0), R(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), L(!0), R((e) => B(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), L(!0), R((e) => B(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && I) e.preventDefault(), R(B(-1, 1));
					else if (e.key === "End" && I) e.preventDefault(), R(B(0, -1));
					else if (e.key === "Enter" && I && te >= 0) {
						e.preventDefault();
						let t = z[te];
						t && ne(t);
					} else e.key === "Escape" && I ? (e.preventDefault(), e.stopPropagation(), L(!1), F(N?.label ?? "")) : e.key === "Tab" && L(!1);
				}
			}),
			/* @__PURE__ */ E(a, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			I && !o && /* @__PURE__ */ E("div", {
				id: j,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: z.length === 0 ? /* @__PURE__ */ E("div", {
					className: "mtc-combobox-empty",
					children: x ?? O("combobox.empty")
				}) : z.map((t, n) => /* @__PURE__ */ D("div", {
					id: `${A}-option-${n}`,
					role: "option",
					"aria-selected": t.value === e,
					"aria-disabled": t.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": te === n,
					"data-selected": t.value === e,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						t.disabled || R(n);
					},
					onClick: () => ne(t),
					children: [/* @__PURE__ */ D("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ E("span", { children: t.label }), t.description && /* @__PURE__ */ E("small", { children: t.description })]
					}), t.value === e && /* @__PURE__ */ E(a, { name: "check" })]
				}, t.value))
			})
		]
	});
}), R = g(function({ intent: e = "neutral", size: t = "small", onRemove: r, removeLabel: i, className: o, children: s, ...c }, l) {
	let u = n();
	return /* @__PURE__ */ D("span", {
		...c,
		ref: l,
		className: p("mtc-tag", o),
		"data-intent": e,
		"data-size": t,
		children: [/* @__PURE__ */ E("span", { children: s }), r && /* @__PURE__ */ E("button", {
			type: "button",
			onClick: r,
			"aria-label": i ?? u("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ E(a, { name: "close" })
		})]
	});
}), z = g(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ D("span", {
		...a,
		ref: o,
		className: p("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ E("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), i]
	});
}), B = g(function({ title: e, intent: t = "info", icon: n, actions: r, className: i, children: o, role: s, ...c }, l) {
	let u = t === "danger" ? "error" : t === "warning" ? "warning" : t === "success" ? "success" : "info";
	return /* @__PURE__ */ D("div", {
		...c,
		ref: l,
		role: s ?? (t === "danger" ? "alert" : "status"),
		className: p("mtc-callout", i),
		"data-intent": t,
		children: [/* @__PURE__ */ E("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: n ?? /* @__PURE__ */ E(a, { name: u })
		}), /* @__PURE__ */ D("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ E("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ E("div", {
					className: "mtc-callout-body",
					children: o
				}),
				r && /* @__PURE__ */ E("div", {
					className: "mtc-callout-actions",
					children: r
				})
			]
		})]
	});
}), ne = {
	ok: "success",
	warning: "warning",
	danger: "danger",
	info: "info",
	neutral: "neutral"
}, re = g(function({ tone: e = "neutral", size: t = "small", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ E(z, {
		...i,
		ref: a,
		dot: !0,
		intent: ne[e],
		size: t,
		"data-tone": e,
		className: p("mtc-status-badge", n),
		children: r
	});
}), ie = g(function({ className: e, ...t }, n) {
	return /* @__PURE__ */ E("kbd", {
		...t,
		ref: n,
		className: p("mtc-kbd", e)
	});
});
function V(e) {
	let t = e.split(/[\s·._@-]+/u).filter((e) => /\p{L}|\p{N}/u.test(e));
	if (t.length === 0) return "?";
	let n = [...t[0]];
	if (t.length === 1) return n.slice(0, 2).join("").toUpperCase();
	let r = [...t[t.length - 1]];
	return `${n[0] ?? ""}${r[0] ?? ""}`.toUpperCase();
}
var ae = g(function({ name: e, src: t, size: n = 24, decorative: r = !1, className: i, ...a }, o) {
	let [s, c] = w(!1);
	return y(() => c(!1), [t]), /* @__PURE__ */ E("span", {
		...a,
		ref: o,
		className: p("mtc-avatar", i),
		"data-size": n,
		role: r ? void 0 : "img",
		"aria-label": r ? void 0 : e,
		"aria-hidden": r || void 0,
		title: r ? void 0 : e,
		children: t && !s ? /* @__PURE__ */ E("img", {
			src: t,
			alt: "",
			onError: () => c(!0)
		}) : /* @__PURE__ */ E("span", {
			"aria-hidden": "true",
			children: V(e)
		})
	});
}), oe = g(function({ width: e, height: t, shape: n = "line", lines: r, className: i, style: a, ...o }, s) {
	let c = (e) => typeof e == "number" ? `${e}px` : e;
	return r && r > 1 ? /* @__PURE__ */ E("span", {
		...o,
		ref: s,
		"aria-hidden": "true",
		className: p("mtc-skeleton-lines", i),
		style: {
			width: c(e),
			...a
		},
		children: Array.from({ length: r }, (e, t) => /* @__PURE__ */ E("span", {
			className: "mtc-skeleton",
			"data-shape": "line",
			style: t === r - 1 ? { width: "60%" } : void 0
		}, t))
	}) : /* @__PURE__ */ E("span", {
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
}), se = 1500, ce = g(function({ value: e, label: t, copiedLabel: r, size: i = "small", clipboard: o, onCopied: c, className: l, ...u }, d) {
	let f = n(), [m, h] = w(!1), g = C(void 0);
	y(() => () => clearTimeout(g.current), []);
	let _ = async () => {
		let t = o ?? (typeof navigator < "u" ? navigator.clipboard : void 0);
		if (t) {
			try {
				await t.writeText(e);
			} catch {
				return;
			}
			h(!0), c?.(e), clearTimeout(g.current), g.current = setTimeout(() => h(!1), se);
		}
	};
	return /* @__PURE__ */ D("span", {
		className: p("mtc-copy-button", l),
		"data-copied": m || void 0,
		children: [/* @__PURE__ */ E(s, {
			...u,
			ref: d,
			variant: "ghost",
			size: i,
			icon: /* @__PURE__ */ E(a, { name: m ? "check" : "copy" }),
			"aria-label": t ?? f("copy.label"),
			onClick: () => void _()
		}), /* @__PURE__ */ E("span", {
			role: "status",
			className: "mtc-visually-hidden",
			children: m ? r ?? f("copy.copied") : ""
		})]
	});
}), le = g(function({ items: e, className: t, ...n }, r) {
	return /* @__PURE__ */ E("ul", {
		...n,
		ref: r,
		className: p("mtc-meta-row", t),
		children: e.filter((e) => e != null && e !== !1).map((e, t) => /* @__PURE__ */ E("li", {
			className: "mtc-meta-item",
			children: e
		}, t))
	});
}), ue = g(function({ title: e, subtitle: t, actions: n, footer: r, headingLevel: i = 2, padded: a = !1, className: o, children: s, ...c }, l) {
	let u = b(), d = `h${i}`;
	return /* @__PURE__ */ D("section", {
		...c,
		ref: l,
		"aria-labelledby": u,
		className: p("mtc-panel", o),
		children: [
			/* @__PURE__ */ D("header", {
				className: "mtc-panel-header",
				children: [
					/* @__PURE__ */ E(d, {
						id: u,
						className: "mtc-panel-title",
						children: e
					}),
					t != null && /* @__PURE__ */ E("span", {
						className: "mtc-panel-subtitle",
						children: t
					}),
					n && /* @__PURE__ */ E("div", {
						className: "mtc-panel-actions",
						children: n
					})
				]
			}),
			/* @__PURE__ */ E("div", {
				className: "mtc-panel-body",
				"data-padded": a || void 0,
				children: s
			}),
			r && /* @__PURE__ */ E("footer", {
				className: "mtc-panel-footer",
				children: r
			})
		]
	});
}), H = 6, U = 320;
function de({ children: e, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = b(), s = t(), c = C(null), l = C(void 0), [u, d] = w(!1), [f, m] = w(null), g = v((e, t) => {
		clearTimeout(l.current), l.current = setTimeout(() => d(e), t);
	}, []);
	y(() => () => clearTimeout(l.current), []), x(() => {
		if (!u || !c.current || typeof window > "u") {
			m(null);
			return;
		}
		let e = c.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - U - 8));
		m({
			left: r,
			top: n === "below" ? e.bottom + H : e.top - H,
			placement: n
		});
	}, [u]), y(() => {
		if (!u) return;
		let e = (e) => {
			e.key === "Escape" && d(!1);
		}, t = () => d(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [u]);
	let _ = e, S = [_.props["aria-describedby"], u ? o : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ D("span", {
		ref: c,
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
		}), u && s && f && O(/* @__PURE__ */ E("div", {
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
function fe({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let a = b(), [o, s] = f({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ E(T, { children: t });
	let c = t, l = [c.props["aria-describedby"], o ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ D("span", {
		className: p("mtc-tooltip-trigger", i),
		children: [h(c, {
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
		}), o && /* @__PURE__ */ E("span", {
			id: a,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function W({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", disabled: c, className: l }) {
	let u = b(), d = b(), m = C(null), h = C(null), [g, _] = f({
		value: i,
		defaultValue: a,
		onChange: o
	});
	return _e(g, m, () => {
		_(!1), h.current?.focus();
	}), /* @__PURE__ */ D("div", {
		ref: m,
		className: p("mtc-popover-root", l),
		children: [/* @__PURE__ */ E("button", {
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
		}), g && /* @__PURE__ */ D("div", {
			id: u,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? d : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": s,
			children: [r && /* @__PURE__ */ E("div", {
				id: d,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function pe({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: a, align: o = "start", disabled: s, className: c }) {
	let l = C(null), u = C(null), [d, m] = f({
		value: void 0,
		defaultValue: 0
	}), [h, g] = f({
		value: r,
		defaultValue: i,
		onChange: a
	}), _ = (e = !0) => {
		g(!1), e && u.current?.focus();
	};
	return _e(h, l, () => _(!1)), /* @__PURE__ */ D("div", {
		ref: l,
		className: p("mtc-menu-root", c),
		children: [/* @__PURE__ */ E("button", {
			ref: u,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": h,
			disabled: s,
			onClick: () => {
				m(ve(n, 1)), g(!h);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), m(ve(n, e.key === "ArrowDown" ? 1 : -1)), g(!0));
			},
			children: t
		}), h && /* @__PURE__ */ E(he, {
			label: e,
			items: n,
			initialIndex: d,
			align: o,
			onClose: _
		})]
	});
}
var me = g(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: a, onKeyDown: o, ...s }, c) {
	let l = C(null), u = C({
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
		}, g(ve(t, 1)), m(!0);
	};
	return /* @__PURE__ */ D("div", {
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
		children: [n, d && /* @__PURE__ */ E(he, {
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
function he({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = C(null);
	y(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = ye(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ E("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ E("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ D("button", {
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
				e.icon && /* @__PURE__ */ E("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ E("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ E("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var ge = g(function({ open: e, onOpenChange: t, title: r, description: i, children: o, footer: c, size: l = "medium", dismissible: f = !0, initialFocusRef: m, className: h }, g) {
	let _ = n(), v = b(), y = b(), x = C(null);
	return u(e, x, m), e ? /* @__PURE__ */ E("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			f && e.target === e.currentTarget && t(!1);
		},
		children: /* @__PURE__ */ D("div", {
			ref: (e) => {
				x.current = e, typeof g == "function" ? g(e) : g && (g.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": v,
			"aria-describedby": i ? y : void 0,
			tabIndex: -1,
			className: p("mtc-dialog", h),
			"data-size": l,
			onKeyDown: (e) => d(e, x, f, () => t(!1)),
			children: [
				/* @__PURE__ */ D("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ D("div", { children: [/* @__PURE__ */ E("h2", {
						id: v,
						className: "mtc-modal-title",
						children: r
					}), i && /* @__PURE__ */ E("p", {
						id: y,
						className: "mtc-modal-description",
						children: i
					})] }), f && /* @__PURE__ */ E(s, {
						icon: /* @__PURE__ */ E(a, { name: "close" }),
						"aria-label": _("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => t(!1)
					})]
				}),
				/* @__PURE__ */ E("div", {
					className: "mtc-modal-body",
					children: o
				}),
				c && /* @__PURE__ */ E("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
}), G = g(function({ open: e, onOpenChange: t, title: r, description: i, children: o, footer: c, side: l = "right", width: f = 420, dismissible: m = !0, initialFocusRef: h, className: g }, _) {
	let v = n(), y = b(), x = b(), S = C(null);
	return u(e, S, h), e ? /* @__PURE__ */ E("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			m && e.target === e.currentTarget && t(!1);
		},
		children: /* @__PURE__ */ D("div", {
			ref: (e) => {
				S.current = e, typeof _ == "function" ? _(e) : _ && (_.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": y,
			"aria-describedby": i ? x : void 0,
			tabIndex: -1,
			className: p("mtc-drawer", g),
			"data-side": l,
			style: { width: f },
			onKeyDown: (e) => d(e, S, m, () => t(!1)),
			children: [
				/* @__PURE__ */ D("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ D("div", { children: [/* @__PURE__ */ E("h2", {
						id: y,
						className: "mtc-modal-title",
						children: r
					}), i && /* @__PURE__ */ E("p", {
						id: x,
						className: "mtc-modal-description",
						children: i
					})] }), m && /* @__PURE__ */ E(s, {
						icon: /* @__PURE__ */ E(a, { name: "close" }),
						"aria-label": v("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => t(!1)
					})]
				}),
				/* @__PURE__ */ E("div", {
					className: "mtc-modal-body",
					children: o
				}),
				c && /* @__PURE__ */ E("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
});
function _e(e, t, n) {
	y(() => {
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
function ve(e, t) {
	return ye(e, t === 1 ? -1 : 0, t);
}
function ye(e, t, n) {
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
var be = g(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: o, keepMounted: s = !1, className: c, ...l }, u) {
	let d = b(), f = C(/* @__PURE__ */ new Map()), m = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), h = (t, r) => {
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
	return /* @__PURE__ */ D("div", {
		...l,
		ref: u,
		className: p("mtc-tabs", o && `mtc-density-${o}`, c),
		"data-orientation": i,
		children: [/* @__PURE__ */ E("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === m?.id, r = `${d}-tab-${e.id}`, i = `${d}-panel-${e.id}`;
				return /* @__PURE__ */ D("button", {
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
					children: [/* @__PURE__ */ E("span", { children: e.label }), e.count != null && /* @__PURE__ */ E("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ E("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === m?.id;
				return !t && !s ? null : /* @__PURE__ */ E("div", {
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
}), xe = g(function({ items: e, label: t, maxItems: r, className: i, ...o }, s) {
	let c = n(), l = Se(e, r);
	return /* @__PURE__ */ E("nav", {
		...o,
		ref: s,
		"aria-label": t ?? c("breadcrumbs.label"),
		className: p("mtc-breadcrumbs", i),
		children: /* @__PURE__ */ E("ol", { children: l.map((e, t) => {
			let n = t === l.length - 1;
			return /* @__PURE__ */ D("li", { children: [t > 0 && /* @__PURE__ */ E(a, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), n ? /* @__PURE__ */ E("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ E("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ E("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ E("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${t}`);
		}) })
	});
});
function Se(e, t) {
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
var Ce = g(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ E("div", {
		...i,
		ref: a,
		className: p("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), K = g(function({ label: e, start: t, end: r, density: i, sticky: a, className: o, children: s, ...c }, l) {
	let u = n();
	return /* @__PURE__ */ D("div", {
		...c,
		ref: l,
		role: "toolbar",
		"aria-label": e ?? u("toolbar.label"),
		className: p("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			t && /* @__PURE__ */ E("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: t
			}),
			/* @__PURE__ */ E("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ E("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), we = g(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: c, ...l }, u) {
	let d = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...c
	};
	return /* @__PURE__ */ D("aside", {
		...l,
		ref: u,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: p("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: d,
		children: [
			t && /* @__PURE__ */ E("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ E("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ E("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), Te = g(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: c, style: l, ...u }, d) {
	let f = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...l
	};
	return /* @__PURE__ */ D("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: p("mtc-inspector", s),
		"data-open": o,
		style: f,
		children: [
			(t || r) && /* @__PURE__ */ D("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ D("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ E("h2", { children: t }), n && /* @__PURE__ */ E("p", { children: n })]
				}), r && /* @__PURE__ */ E("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ E("div", {
				className: "mtc-inspector-content",
				children: c
			}),
			i && /* @__PURE__ */ E("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), Ee = g(function({ primary: e, secondary: t, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: s, minSize: c = 15, maxSize: l = 85, step: u = 5, disabled: d, stackOnNarrow: m = !0, separatorLabel: h, className: g, style: _, ...v }, y) {
	let b = n(), x = C(null), S = C(!1), [w, T] = f({
		value: a,
		defaultValue: o,
		onChange: s
	}), O = Math.min(c, l), k = Math.max(c, l), A = Number.isFinite(u) && u !== 0 ? Math.abs(u) : 1, j = q(w, O, k), M = (e) => {
		x.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
	}, ee = (e) => {
		if (!S.current || !x.current || d) return;
		let t = x.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		T(q(a, O, k));
	}, N = (e) => T(q(j + e, O, k)), P = i === "start" ? j : 100 - j, F = 100 - P;
	return /* @__PURE__ */ D("div", {
		...v,
		ref: M,
		className: p("mtc-split-pane", g),
		"data-orientation": r,
		"data-stack-narrow": m,
		style: {
			"--mtc-split-start": `${P}fr`,
			"--mtc-split-end": `${F}fr`,
			..._
		},
		children: [
			/* @__PURE__ */ E("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? e : t
			}),
			/* @__PURE__ */ E("div", {
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
					d || (S.current = !0, e.currentTarget.setPointerCapture(e.pointerId), ee(e));
				},
				onPointerMove: ee,
				onPointerUp: (e) => {
					S.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					S.current = !1;
				},
				onKeyDown: (e) => {
					if (d) return;
					let t = r === "horizontal" ? "ArrowLeft" : "ArrowUp", n = r === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === n) {
						e.preventDefault();
						let t = e.key === n ? A : -A;
						N(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), T(O)) : e.key === "End" && (e.preventDefault(), T(k));
				},
				children: /* @__PURE__ */ E("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ E("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? t : e
			})
		]
	});
});
function q(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var De = g(function({ items: e, label: t, selectedId: r, onSelectionChange: i, expandedIds: o, onExpandedChange: s, density: c, className: l, ...u }, d) {
	let f = S(() => J(e, o), [e, o]), m = n(), h = C(/* @__PURE__ */ new Map()), [g, _] = w(r ?? f.find((e) => !e.item.disabled)?.item.id);
	y(() => {
		g && f.some((e) => e.item.id === g && !e.item.disabled) || _(r ?? f.find((e) => !e.item.disabled)?.item.id);
	}, [
		g,
		r,
		f
	]);
	let v = (e) => {
		e && (_(e), h.current.get(e)?.focus());
	}, b = (e, t) => {
		let n = new Set(o);
		t ? n.add(e) : n.delete(e), s(n);
	}, x = f.filter((e) => !e.item.disabled), T = (e, t) => {
		let n = x.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, a = o.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = x[Math.min(x.length - 1, Math.max(0, n + t))];
			v(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !a ? b(t.item.id, !0) : r && v(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && a ? b(t.item.id, !1) : v(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? x[0] : x[x.length - 1];
			v(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), i?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(o);
			for (let e of f.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			s(n);
		}
	};
	return /* @__PURE__ */ E("div", {
		...u,
		ref: d,
		role: "tree",
		"aria-label": t,
		"aria-multiselectable": !1,
		className: p("mtc-tree", c && `mtc-density-${c}`, l),
		children: f.map((e) => {
			let { item: t } = e, n = !!t.children?.length, s = o.has(t.id), c = r === t.id;
			return /* @__PURE__ */ D("div", {
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
				onKeyDown: (t) => T(t, e),
				children: [
					/* @__PURE__ */ E("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": n ? m(s ? "tree.collapse" : "tree.expand", { label: Y(t.label) }) : void 0,
						"aria-hidden": !n || void 0,
						disabled: !n || t.disabled,
						onClick: (e) => {
							e.stopPropagation(), n && b(t.id, !s);
						},
						children: n && /* @__PURE__ */ E(a, { name: "chevron-right" })
					}),
					t.icon && /* @__PURE__ */ E("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: t.icon
					}),
					/* @__PURE__ */ D("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ E("span", {
							className: "mtc-tree-label",
							children: t.label
						}), t.description && /* @__PURE__ */ E("span", {
							className: "mtc-tree-description",
							children: t.description
						})]
					})
				]
			}, t.id);
		})
	});
});
function J(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...J(o.children, t, n + 1, o.id, i)));
	}), a;
}
function Y(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/components/navigation.ts
function X(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function Oe(e) {
	if (e) return (t) => {
		X(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/objects/types.ts
function ke(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? A(e.id ?? e.label)
	};
}
function Ae(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
//#region src/objects/ObjectChip.tsx
var je = g(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? ke(e.type) : null, s = /* @__PURE__ */ D(T, { children: [o && /* @__PURE__ */ E(M, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ E("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, l = p("mtc-object-chip", i), u;
	return u = e.href ? /* @__PURE__ */ E("a", {
		ref: a,
		href: e.href,
		className: l,
		"data-interactive": "true",
		onClick: Oe(c),
		children: s
	}) : c ? /* @__PURE__ */ E("button", {
		ref: a,
		type: "button",
		className: l,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ E("span", {
		ref: a,
		className: l,
		children: s
	}), n ? /* @__PURE__ */ E(de, {
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
function Z(e, t, n) {
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
function Le(e) {
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
function Re(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function ze(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function Be(e, t, n = "en") {
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
function Ve(e, t, { locale: n = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return r(e.date, {
		locale: n,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var Q = 864e5;
function He(e, t, n = "en") {
	if (!e.dateOnly) return i(e.date, {
		locale: n,
		now: t
	});
	let r = new Date(t), a = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()), o = Math.round((e.date.getTime() - a) / Q);
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
			return n == null ? String(e) : Be(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = Le(e);
			return r ? Ve(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => $(e, Z(e), n)).join(", ");
		case "link": return Ae(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${$(t, Z(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function Ue(e, t, n = {}) {
	return Ne(e) ? null : Pe(t.kind) ? Fe(e) ?? $(e, t, n) : t.kind === "date" || t.kind === "datetime" ? Le(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : $(e, t, n);
}
var We = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function Ge(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : We.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var Ke = 3;
function qe(e) {
	return /* @__PURE__ */ E(Je, {
		...e,
		depth: 0
	});
}
function Je({ value: e, kind: t, format: r, tones: i, context: o = "panel", emptyValue: s, now: l, onNavigate: u, maxListItems: d, depth: f }) {
	let { locale: p, timeZone: m } = c(), h = n(), g = S(() => Z(e, t, r), [
		e,
		t,
		r
	]), _ = {
		locale: p,
		timeZone: m,
		yes: h("value.yes"),
		no: h("value.no")
	}, v = o === "panel";
	if (Ne(e)) return /* @__PURE__ */ E("span", {
		className: "mtc-value-empty",
		children: s ?? "—"
	});
	switch (g.kind) {
		case "id":
		case "code": {
			let t = String(e);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-id",
				"data-context": o,
				children: [/* @__PURE__ */ E("code", { children: t }), v && /* @__PURE__ */ E(ce, {
					value: t,
					label: h("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ E(Ye, {
			value: e,
			resolved: g,
			locale: p,
			panel: v
		});
		case "date":
		case "datetime": {
			let t = Le(e);
			return t ? /* @__PURE__ */ D("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ E("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: Ve(t, g.kind, _)
				}), v && /* @__PURE__ */ E("span", {
					className: "mtc-value-secondary",
					children: He(t, l ?? Date.now(), p)
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
				children: [/* @__PURE__ */ E(a, { name: t ? "check" : "close" }), h(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = i?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ E(re, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ E(R, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = d ?? (v ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ D("span", {
				className: "mtc-value-list",
				"data-context": o,
				children: [r.map((e, t) => Ae(e) ? /* @__PURE__ */ E(je, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ E(R, {
					className: "mtc-value-chip",
					children: $(e, Z(e), _)
				}, t)), i.length > 0 && /* @__PURE__ */ E(R, {
					className: "mtc-value-chip",
					title: h("value.moreTitle", {
						count: i.length,
						items: i.map((e) => $(e, Z(e), _)).join(", ")
					}),
					children: h("value.more", { count: i.length })
				})]
			});
		}
		case "link": return Ae(e) ? /* @__PURE__ */ E(je, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ E("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = Re(e);
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
						children: h("value.newTab")
					})
				]
			});
		}
		case "email": return ze(e) ? /* @__PURE__ */ E("a", {
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
			if (f >= Ke || !e || typeof e != "object") return /* @__PURE__ */ E("span", {
				className: "mtc-value-text",
				children: $(e, g, _)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ D("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ E("summary", { children: h("value.fields", { count: t.length }) }), /* @__PURE__ */ E("dl", { children: t.map(([e, t]) => /* @__PURE__ */ D("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ E("dt", { children: e }), /* @__PURE__ */ E("dd", { children: /* @__PURE__ */ E(Je, {
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
function Ye({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ D("span", {
		className: "mtc-value-number",
		children: [Be(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ E("span", {
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
function Xe(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function Ze(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = Xe(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : Ue(i, Z(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return Ge(e.key, t.key) || e.index - t.index;
		let r = Ge(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function Qe(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function $e(e, t, n, r, i, a) {
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
function et(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function tt(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function nt(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
var rt = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, it = 160, at = 40, ot = 16, st = 8, ct = 160;
function lt(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function ut({ label: r, columns: i, rows: s, rowKey: l, rowLabel: u, selection: d = "none", selectedKeys: f, defaultSelectedKeys: m, onSelectionChange: h, sort: g, defaultSort: _ = null, onSortChange: b, sortMode: T = "client", onRowActivate: k, rowHref: A, onNavigate: j, contextActions: M, onCellEdit: ee, onEndReached: N, totalRows: P, loading: F = !1, empty: I, density: L, rowHeight: te, height: R = "100%", virtualize: z = "auto", overscan: B = 8, footer: ne, rowProps: re, className: ie }) {
	let V = n(), { locale: ae, timeZone: se } = c(), ce = e(), le = t(), ue = L ?? ce?.density ?? "standard", H = te ?? rt[ue], U = C(null), de = C(null), fe = C(!1), W = C(null), pe = C(-1), [me, ge] = w(_), G = g === void 0 ? me : g, [ve, ye] = w(m ?? []), be = f ?? ve, xe = S(() => new Set(be), [be]), [Se, Ce] = w({}), [K, we] = w(() => ({
		row: s.length > 0 ? 0 : -1,
		column: +(d === "multi")
	})), [Te, Ee] = w({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [q, De] = w(null), J = S(() => T !== "client" || !G ? s : Ze(s, i.find((e) => e.id === G.columnId), G.direction, ae), [
		s,
		i,
		G,
		T,
		ae
	]), Y = S(() => J.map((e, t) => l(e, t)), [J, l]), X = S(() => [...d === "multi" ? [{
		kind: "select",
		width: at
	}] : [], ...i.map((e) => ({
		kind: "data",
		column: e,
		width: Se[e.id] ?? e.width ?? it
	}))], [
		i,
		d,
		Se
	]), ke = S(() => {
		let e = X.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : X.length - 1;
	}, [X]), Ae = X.map((e, t) => t === ke ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), je = X.reduce((e, t) => e + t.width, 0), Me = S(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of X.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return X.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [X]), Ne = S(() => {
		let e = X.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : X.findIndex((e) => e.kind === "data");
	}, [X]), Fe = z === "auto" ? J.length > 200 : z, Ie = $e(J.length, Te.scrollTop, Te.height, H, B, Fe), Le = F && J.length === 0, Re = !F && J.length === 0, ze = Le ? st : F && J.length > 0 ? 1 : 0, Be = Re ? ct : (J.length + ze) * H, Ve = v((e) => {
		if (u) return u(e);
		let t = i[0];
		if (!t) return "";
		let n = Xe(t, e);
		return $(n, Z(n, t.kind, t.format), {
			locale: ae,
			timeZone: se
		});
	}, [
		u,
		i,
		ae,
		se
	]), Q = v((e) => {
		f === void 0 && ye(e), h?.(e);
	}, [f, h]), He = (e) => {
		let t = Qe(G, e);
		g === void 0 && ge(t), b?.(t);
	};
	x(() => {
		let e = U.current;
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
	let Ue = (e) => (e - Math.max(1, Math.floor(B / 2))) * H, We = Te.scrollTop + Te.height >= Ue(J.length), Ge = () => {
		let e = U.current;
		if (!e) return;
		let t = $e(J.length, e.scrollTop, e.clientHeight, H, B, Fe), n = e.scrollTop + e.clientHeight >= Ue(J.length);
		(t.start !== Ie.start || t.end !== Ie.end || N && n !== We) && Ee({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	y(() => {
		we((e) => {
			let t = e.row < 0 || J.length === 0 ? -1 : Math.min(e.row, J.length - 1), n = Math.max(0, Math.min(e.column, X.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [J.length, X.length]), x(() => {
		fe.current && (fe.current = !1, U.current?.querySelector(`[data-cell="${K.row}:${K.column}"]`)?.focus({ preventScroll: !0 }));
	}), y(() => {
		N && !F && J.length !== 0 && (P !== void 0 && J.length >= P || We && pe.current !== J.length && (pe.current = J.length, N()));
	}, [
		N,
		F,
		J.length,
		P,
		We
	]);
	let Ke = (e) => {
		let t = U.current;
		if (t && e.row >= 0) {
			let n = et(e.row, t.scrollTop, t.clientHeight, H, H);
			n !== t.scrollTop && (t.scrollTop = n, Ee({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		fe.current = !0, we(e);
	}, Je = (e, t) => {
		if (d === "single") {
			Q([e]), W.current = e;
			return;
		}
		if (d === "multi") {
			if (t && W.current) {
				Q([.../* @__PURE__ */ new Set([...be, ...tt(Y, W.current, e)])]);
				return;
			}
			Q(xe.has(e) ? be.filter((t) => t !== e) : [...be, e]), W.current = e;
		}
	}, Ye = (e) => {
		let t = J[e];
		if (t !== void 0) {
			if (k) {
				k(t);
				return;
			}
			U.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, ut = (e, t, n) => {
		let r = J[e];
		r !== void 0 && M && M(r).length !== 0 && De({
			rowIndex: e,
			x: t,
			y: n
		});
	}, dt = v(() => {
		De(null), fe.current = !0;
	}, []);
	_e(q !== null, de, dt);
	let ft = (e, t) => {
		let n = X[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		Ce((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, pt = (e) => {
		if (lt(e.target) || q) return;
		let { row: t, column: n } = K, r = J.length, i = Math.max(1, Math.floor((U.current?.clientHeight ?? H * 10) / H) - 1), a = X[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), ft(n, e.key === "ArrowRight" ? ot : -16);
			return;
		}
		let o = nt(K, e.key, {
			rowCount: r,
			columnCount: X.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && d === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = Y[o.row];
				e && (W.current ||= Y[Math.max(0, t)] ?? e, Q([.../* @__PURE__ */ new Set([...be, ...tt(Y, W.current, e)])]));
			}
			Ke(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), He(a.column.id)) : e.key === " " && a?.kind === "select" && d === "multi" && (e.preventDefault(), Q(be.length === Y.length ? [] : [...Y]));
			return;
		}
		let s = Y[t];
		if (e.key === "Enter") e.preventDefault(), Ye(t);
		else if (e.key === " " && s) e.preventDefault(), Je(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && d === "multi") e.preventDefault(), Q([...Y]);
		else if (e.key === "F2" && ee && a?.kind === "data") {
			e.preventDefault();
			let n = J[t];
			n !== void 0 && ee(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			ut(t, n.left + 12, n.bottom);
		}
	}, mt = (e, t) => {
		let n = Y[t];
		n && d !== "none" && (e.target.closest("a, button, input, select, textarea") || (d === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Je(n, e.shiftKey) : (Q([n]), W.current = n)));
	}, ht = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = X[t];
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
		let n = K.row === e && K.column === t, r = Me.get(t);
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
	for (let e = Ie.start; e < Ie.end; e++) _t.push(e);
	K.row >= 0 && K.row < J.length && (K.row < Ie.start || K.row >= Ie.end) && _t.push(K.row);
	let vt = d === "multi" && Y.length > 0 && Y.every((e) => xe.has(e)), yt = d === "multi" && !vt && Y.some((e) => xe.has(e)), bt = q ? J[q.rowIndex] : void 0, xt = {
		"--mtc-grid-template": Ae,
		"--mtc-grid-min-width": `${je}px`,
		"--mtc-grid-row-height": `${H}px`,
		"--mtc-grid-viewport-width": Te.width > 0 ? `${Te.width}px` : "100%"
	};
	return /* @__PURE__ */ D("div", {
		className: p("mtc-data-grid", L && `mtc-density-${L}`, ie),
		style: {
			...xt,
			height: R
		},
		children: [
			/* @__PURE__ */ D("div", {
				ref: U,
				role: "grid",
				"aria-label": r,
				"aria-rowcount": (P ?? J.length) + 1,
				"aria-colcount": X.length,
				"aria-multiselectable": d === "multi" || void 0,
				"aria-busy": F || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: pt,
				onScroll: Ge,
				children: [/* @__PURE__ */ E("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ E("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: X.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ E("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...gt(-1, t),
								children: /* @__PURE__ */ E("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": V("dataGrid.selectAll"),
									checked: vt,
									ref: (e) => {
										e && (e.indeterminate = yt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Q(vt ? [] : [...Y])
								})
							}, "__select");
							let { column: n } = e, r = G?.columnId === n.id ? G.direction : void 0, i = n.align === "end" || !n.align && !n.cell && Pe(Z(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ D("div", {
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
					style: { height: Be },
					children: [
						_t.map((e) => {
							let t = J[e], n = Y[e], r = xe.has(n), i = A?.(t);
							return /* @__PURE__ */ E("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": d === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * H },
								...re?.(t),
								onClick: (t) => mt(t, e),
								onDoubleClick: (t) => {
									t.target.closest("a, button, input, select, textarea") || Ye(e);
								},
								onContextMenu: M ? (t) => {
									t.preventDefault(), d !== "none" && !r && Q([n]), we({
										row: e,
										column: K.column
									}), ut(e, t.clientX, t.clientY);
								} : void 0,
								children: X.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ E("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...gt(e, o),
										children: /* @__PURE__ */ E("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": V("dataGrid.selectRow", { label: Ve(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Je(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = Xe(s, t), l = Z(c, s.kind, s.format), u = s.align === "end" || !s.align && !s.cell && Pe(l.kind), d = s.cell ? s.cell(t, {
										value: c,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ E(qe, {
										value: c,
										kind: s.kind,
										format: s.format,
										tones: s.tones,
										context: "grid"
									});
									return /* @__PURE__ */ E("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-align": u ? "end" : "start",
										...gt(e, o),
										children: i && o === Ne ? /* @__PURE__ */ E("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: Oe(j ? (e) => j(t, e) : void 0),
											children: d
										}) : d
									}, s.id);
								})
							}, n);
						}),
						Le && Array.from({ length: st }, (e, t) => /* @__PURE__ */ E("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * H },
							children: X.map((e, n) => /* @__PURE__ */ E("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ E(oe, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Le && /* @__PURE__ */ E("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ E("div", {
								role: "gridcell",
								children: V("dataGrid.loading")
							})
						}),
						F && J.length > 0 && /* @__PURE__ */ E("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: J.length * H },
							children: /* @__PURE__ */ E("div", {
								role: "gridcell",
								"aria-colspan": X.length,
								className: "mtc-data-grid-cell",
								children: V("dataGrid.loadingMore")
							})
						}),
						Re && /* @__PURE__ */ E("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: ct
							},
							children: /* @__PURE__ */ E("div", {
								role: "gridcell",
								"aria-colspan": X.length,
								className: "mtc-data-grid-cell",
								children: I ?? /* @__PURE__ */ E(o, {
									compact: !0,
									title: V("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			ne && /* @__PURE__ */ E("div", {
				className: "mtc-data-grid-footer",
				children: ne
			}),
			q && bt !== void 0 && M && (() => {
				let e = /* @__PURE__ */ E("div", {
					ref: de,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ E(he, {
						label: V("dataGrid.rowActions", { label: Ve(bt) }),
						items: M(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: q.x,
							top: q.y
						},
						onClose: dt
					})
				});
				return le ? O(e, le) : e;
			})()
		]
	});
}
//#endregion
//#region src/workbench/PropertyList.tsx
var dt = g(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ E("dl", {
		...a,
		ref: o,
		className: p("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ D("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ D("dt", { children: [/* @__PURE__ */ E("span", { children: e.label }), e.description && /* @__PURE__ */ E("small", { children: e.description })] }), /* @__PURE__ */ E("dd", { children: _(e.value) ? e.value : /* @__PURE__ */ E(qe, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), ft = g(function({ type: e, title: t, objectId: r, status: i, meta: a, actions: o, compact: s = !1, headingLevel: c = s ? 2 : 1, typeHref: l, onTypeNavigate: u, className: d, style: f, ...m }, h) {
	let g = n(), { icon: _, color: v } = ke(e), y = `h${c}`, b = !s && (i || a && a.length > 0);
	return /* @__PURE__ */ D("div", {
		...m,
		ref: h,
		className: p("mtc-object-header", d),
		"data-compact": s || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${v}-fg)`,
			...f
		},
		children: [
			/* @__PURE__ */ E(M, {
				icon: _,
				color: v,
				size: s ? 24 : 40
			}),
			/* @__PURE__ */ D("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ D("div", {
						className: "mtc-object-header-eyebrow",
						children: [l ? /* @__PURE__ */ E("a", {
							className: "mtc-object-header-type",
							href: l,
							onClick: Oe(u),
							children: e.label
						}) : /* @__PURE__ */ E("span", {
							className: "mtc-object-header-type",
							children: e.label
						}), r && /* @__PURE__ */ D(T, { children: [
							/* @__PURE__ */ E("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ E("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ E(ce, {
								value: r,
								label: g("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ E(y, {
						className: "mtc-object-header-title",
						children: t
					}),
					s && i && /* @__PURE__ */ E("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ E(re, {
							tone: i.tone,
							children: i.label
						})
					}),
					b && /* @__PURE__ */ D("div", {
						className: "mtc-object-header-meta",
						children: [i && /* @__PURE__ */ E(re, {
							tone: i.tone,
							children: i.label
						}), a && a.length > 0 && /* @__PURE__ */ E(le, { items: a })]
					})
				]
			}),
			o && /* @__PURE__ */ E("div", {
				className: "mtc-object-header-actions",
				children: o
			})
		]
	});
}), pt = g(function({ properties: e, title: t, filterable: r = !0, actions: i, emptyValue: o, now: l, density: u, labelWidth: d = 160, onNavigate: f, headingLevel: m, className: h, style: g, ..._ }, v) {
	let y = n(), { locale: x, timeZone: O } = c(), k = b(), A = C(null), [j, M] = w(!1), [N, P] = w(""), F = S(() => {
		let t = N.trim().toLowerCase();
		return t ? e.filter((e) => {
			let n = $(e.value, Z(e.value, e.kind, e.format), {
				locale: x,
				timeZone: O
			});
			return e.label.toLowerCase().includes(t) || n.toLowerCase().includes(t);
		}) : e;
	}, [
		e,
		N,
		x,
		O
	]), I = S(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of F) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [F]), L = () => {
		j ? (P(""), M(!1)) : (M(!0), requestAnimationFrame(() => A.current?.focus()));
	};
	return /* @__PURE__ */ D(ue, {
		..._,
		ref: v,
		title: t ?? y("propertyPanel.title"),
		subtitle: y("propertyPanel.count", {
			shown: F.length,
			total: e.length
		}),
		headingLevel: m,
		className: p("mtc-property-panel", u && `mtc-density-${u}`, h),
		style: {
			"--mtc-property-label-width": `${d}px`,
			...g
		},
		actions: (r || i) && /* @__PURE__ */ D(T, { children: [i, r && /* @__PURE__ */ E(s, {
			icon: /* @__PURE__ */ E(a, { name: "filter" }),
			"aria-label": y("propertyPanel.filter"),
			"aria-expanded": j,
			"aria-controls": j ? k : void 0,
			variant: j ? "outline" : "ghost",
			size: "small",
			onClick: L
		})] }),
		children: [j && /* @__PURE__ */ E("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ E(ee, {
				ref: A,
				id: k,
				type: "search",
				size: "small",
				value: N,
				"aria-label": y("propertyPanel.filter"),
				placeholder: y("propertyPanel.filter"),
				onChange: (e) => P(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), L());
				}
			})
		}), F.length === 0 ? /* @__PURE__ */ E("p", {
			className: "mtc-property-panel-empty",
			children: y("propertyPanel.noMatch", { query: N.trim() })
		}) : I.map(([e, t]) => /* @__PURE__ */ D("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ E("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ E("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ D("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ D("dt", { children: [/* @__PURE__ */ E("span", { children: e.label }), e.description && /* @__PURE__ */ E("small", { children: e.description })] }), /* @__PURE__ */ E("dd", { children: /* @__PURE__ */ E(qe, {
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
}), mt = .4, ht = 3, gt = 1.25, _t = .8, vt = {
	x: 0,
	y: 0,
	zoom: 1
};
function yt({ label: e, width: t, height: r, viewHeight: i, children: o }) {
	let c = n(), l = C(null), u = C(null), d = C(null), [f, p] = w(0), [m, h] = w(vt);
	x(() => {
		let e = l.current;
		if (!e) return;
		let t = () => p(e.clientWidth);
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let g = f || t, _ = Math.min(1, Math.max(_t, Math.min(g / t, i / r))) * m.zoom, v = (g - t * _) / 2 + m.x, y = (i - r * _) / 2 + m.y, b = (e) => h((t) => ({
		...t,
		zoom: Math.min(ht, Math.max(mt, t.zoom * e))
	})), S = (e) => {
		e.target.closest("[data-graph-node]") || (d.current = {
			pointerId: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			offset: m
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, T = (e) => {
		let t = d.current;
		t && t.pointerId === e.pointerId && h({
			...t.offset,
			x: t.offset.x + e.clientX - t.x,
			y: t.offset.y + e.clientY - t.y
		});
	}, O = () => {
		d.current = null;
	};
	return /* @__PURE__ */ D("div", {
		ref: l,
		className: "mtc-graph-canvas",
		style: { height: i },
		children: [/* @__PURE__ */ E("svg", {
			ref: u,
			role: "group",
			"aria-label": e,
			width: g,
			height: i,
			viewBox: `0 0 ${g} ${i}`,
			className: "mtc-graph-svg",
			onPointerDown: S,
			onPointerMove: T,
			onPointerUp: O,
			onPointerCancel: O,
			onWheel: (e) => {
				(e.ctrlKey || e.metaKey) && (e.preventDefault(), b(e.deltaY < 0 ? gt : 1 / gt));
			},
			onKeyDown: (e) => {
				if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
				let t = [...u.current?.querySelectorAll("[data-graph-node]") ?? []], n = t.indexOf(document.activeElement);
				n < 0 || (e.preventDefault(), t[(n + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length]?.focus());
			},
			children: /* @__PURE__ */ E("g", {
				transform: `translate(${bt(v)} ${bt(y)}) scale(${bt(_)})`,
				children: o
			})
		}), /* @__PURE__ */ D("div", {
			className: "mtc-graph-controls",
			children: [
				/* @__PURE__ */ E(s, {
					icon: /* @__PURE__ */ E(a, { name: "add" }),
					"aria-label": c("graph.zoomIn"),
					size: "small",
					onClick: () => b(gt)
				}),
				/* @__PURE__ */ E(s, {
					icon: /* @__PURE__ */ E(a, { name: "minus" }),
					"aria-label": c("graph.zoomOut"),
					size: "small",
					onClick: () => b(1 / gt)
				}),
				/* @__PURE__ */ E(s, {
					icon: /* @__PURE__ */ E(a, { name: "refresh" }),
					"aria-label": c("graph.reset"),
					size: "small",
					onClick: () => h(vt)
				})
			]
		})]
	});
}
function bt(e) {
	return Math.round(e * 1e3) / 1e3;
}
//#endregion
//#region src/objects/linkGraphLayout.ts
function xt(e, t) {
	let n = e.map((e) => Math.min(e.items.length, Math.max(0, e.count))), r = (t) => t.reduce((t, n, r) => t + n + +(e[r].count > n), 0), i = [...n];
	for (; r(i) > t;) {
		let e = -1;
		for (let t = 0; t < i.length; t++) i[t] > 1 && (e < 0 || i[t] > i[e]) && (e = t);
		if (e < 0) break;
		--i[e];
	}
	return i;
}
var St = 40, Ct = 120, wt = .6;
function Tt(e, t = 40) {
	let n = xt(e, t), r = n.map((t, n) => t + +(e[n].count > t)), i = r.reduce((e, t) => e + t, 0);
	if (i === 0) return {
		nodes: [],
		labels: [],
		radius: Ct
	};
	let a = i + (e.length > 1 ? e.length * wt : 0), o = Math.max(Ct, i * St / (2 * Math.PI)), s = 2 * Math.PI / a, c = [], l = [], u = Math.PI - (e.length > 1 ? wt * s / 2 : 0);
	return e.forEach((t, i) => {
		let a = r[i];
		if (a === 0) return;
		let d = u + (e.length > 1 ? wt * s / 2 : 0), f = (e) => d + (e + .5) * s, p = t.items.slice(0, n[i]);
		if (p.forEach((e, n) => {
			let r = f(n);
			c.push({
				key: `${t.id}:${e.id}`,
				kind: "item",
				groupIndex: i,
				x: Math.cos(r) * o,
				y: Math.sin(r) * o,
				angle: r,
				item: e
			});
		}), t.count > p.length) {
			let e = f(p.length);
			c.push({
				key: `${t.id}:more`,
				kind: "more",
				groupIndex: i,
				x: Math.cos(e) * o,
				y: Math.sin(e) * o,
				angle: e,
				moreCount: t.count - p.length
			});
		}
		let m = d + a / 2 * s;
		l.push({
			groupIndex: i,
			x: Math.cos(m) * o * .6,
			y: Math.sin(m) * o * .6,
			text: t.relation
		}), u = d + a * s + (e.length > 1 ? wt * s / 2 : 0);
	}), {
		nodes: c,
		labels: l,
		radius: o
	};
}
//#endregion
//#region src/objects/LinkGraph.tsx
var Et = 24, Dt = 40, Ot = 150, kt = 22, At = 16;
function jt(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Mt({ x: e, y: t, size: n, color: r, icon: i, center: a }) {
	return /* @__PURE__ */ D("g", {
		className: "mtc-graph-glyph",
		"data-center": a || void 0,
		style: r ? { color: `var(--mtc-type-${r}-fg)` } : void 0,
		children: [/* @__PURE__ */ E("rect", {
			x: e - n / 2,
			y: t - n / 2,
			width: n,
			height: n,
			rx: 4,
			fill: r ? `var(--mtc-type-${r}-bg)` : "var(--mtc-panel)"
		}), i]
	});
}
function Nt({ center: e, groups: t, label: r, maxNodes: i = 40, height: o = 320, onNavigate: s }) {
	let c = n(), l = S(() => Tt(t, i), [t, i]), u = l.nodes.length > At, d = l.radius + Et + Ot, f = l.radius + Et + 16, p = d * 2, m = f * 2, h = d, g = f, _ = e.type ? ke(e.type) : null, v = (e) => {
		if (e.kind === "item" && e.item) return {
			object: e.item,
			href: e.item.href
		};
		let n = t[e.groupIndex];
		return n ? {
			object: {
				id: `${n.id}:all`,
				title: n.relation,
				type: n.targetType
			},
			href: n.viewAllHref
		} : null;
	}, y = (e, t) => (n) => {
		if (!s || !X(n)) {
			t || n.preventDefault();
			return;
		}
		n.preventDefault(), s(e, n);
	};
	return /* @__PURE__ */ D(yt, {
		label: r,
		width: p,
		height: m,
		viewHeight: o,
		children: [
			/* @__PURE__ */ E("g", {
				className: "mtc-graph-edges",
				children: l.nodes.map((e) => /* @__PURE__ */ E("line", {
					x1: h,
					y1: g,
					x2: h + e.x,
					y2: g + e.y,
					className: "mtc-graph-edge",
					"data-direction": t[e.groupIndex]?.direction ?? "outgoing"
				}, `edge:${e.key}`))
			}),
			l.labels.map((e) => /* @__PURE__ */ E("text", {
				x: h + e.x,
				y: g + e.y,
				textAnchor: "middle",
				dominantBaseline: "middle",
				className: "mtc-graph-edge-label",
				children: jt(e.text, 18)
			}, `label:${e.groupIndex}`)),
			/* @__PURE__ */ E("g", {
				className: "mtc-graph-node",
				"data-center": "true",
				"aria-hidden": "true",
				children: /* @__PURE__ */ E(Mt, {
					x: h,
					y: g,
					size: Dt,
					center: !0,
					color: _?.color ?? null,
					icon: /* @__PURE__ */ E(a, {
						name: _?.icon ?? "object",
						x: h - 11,
						y: g - 11,
						width: 22,
						height: 22,
						size: 22
					})
				})
			}),
			l.nodes.map((e) => {
				let n = v(e);
				if (!n) return null;
				let r = t[e.groupIndex], i = ke(r.targetType), o = h + e.x, l = g + e.y, d = Math.cos(e.angle), f = d >= 0, p = u, m = p ? f ? "start" : "end" : d > .25 ? "start" : d < -.25 ? "end" : "middle", _ = p ? o + Math.cos(e.angle) * 20 : m === "start" ? o + 20 : m === "end" ? o - 20 : o, b = p ? l + Math.sin(e.angle) * 20 : m === "middle" ? l + (Math.sin(e.angle) > 0 ? 26 : -20) : l, x = p ? e.angle * 180 / Math.PI + (f ? 0 : 180) : 0, S = e.kind === "more" ? c("graph.more", { count: e.moreCount ?? 0 }) : e.item?.title ?? "", C = e.kind === "more" ? c("graph.moreLabel", {
					count: e.moreCount ?? 0,
					relation: r.relation,
					type: r.targetType.label
				}) : `${S}, ${r.relation}`, w = !!(n.href || s);
				return /* @__PURE__ */ D("a", {
					href: n.href,
					"data-graph-node": w || void 0,
					className: "mtc-graph-node",
					"data-kind": e.kind,
					"aria-label": C,
					role: n.href ? void 0 : w ? "link" : "img",
					tabIndex: n.href ? void 0 : w ? 0 : void 0,
					onClick: y(n.object, n.href),
					onKeyDown: w ? (e) => {
						e.key === "Enter" && (e.preventDefault(), s ? s(n.object, e) : e.currentTarget.dispatchEvent(new MouseEvent("click", {
							bubbles: !0,
							cancelable: !0
						})));
					} : void 0,
					children: [e.kind === "more" ? /* @__PURE__ */ D("g", {
						className: "mtc-graph-more",
						children: [/* @__PURE__ */ E("rect", {
							x: o - Et / 2,
							y: l - Et / 2,
							width: Et,
							height: Et,
							rx: Et / 2
						}), /* @__PURE__ */ D("text", {
							x: o,
							y: l,
							textAnchor: "middle",
							dominantBaseline: "central",
							children: ["+", e.moreCount]
						})]
					}) : /* @__PURE__ */ E(Mt, {
						x: o,
						y: l,
						size: Et,
						color: i.color,
						icon: /* @__PURE__ */ E(a, {
							name: i.icon,
							x: o - 7,
							y: l - 7,
							width: 14,
							height: 14,
							size: 14,
							strokeWidth: 2
						})
					}), /* @__PURE__ */ E("text", {
						x: _,
						y: b,
						textAnchor: m,
						dominantBaseline: "middle",
						transform: x ? `rotate(${x.toFixed(2)} ${_.toFixed(2)} ${b.toFixed(2)})` : void 0,
						className: "mtc-graph-node-label",
						children: jt(S, kt)
					})]
				}, e.key);
			})
		]
	});
}
//#endregion
//#region src/objects/LinkPanel.tsx
function Pt({ group: e }) {
	let t = n(), { icon: r, color: i } = ke(e.targetType), o = e.direction === "incoming";
	return /* @__PURE__ */ D("div", {
		className: "mtc-link-relation",
		children: [
			o && /* @__PURE__ */ E(a, {
				name: "arrow-left",
				label: t("linkPanel.incoming"),
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-link-relation-name",
				children: e.relation
			}),
			!o && /* @__PURE__ */ E(a, {
				name: "arrow-right",
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ E(M, {
				icon: r,
				color: i,
				size: 16
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-link-relation-type",
				children: e.targetType.label
			}),
			/* @__PURE__ */ E("span", {
				className: "mtc-link-relation-count",
				children: e.count
			})
		]
	});
}
var Ft = g(function({ groups: e, title: t, subtitle: r, maxItems: i = 3, actions: a, onNavigate: o, headingLevel: s, className: c, ...l }, u) {
	let d = n(), f = e.reduce((e, t) => e + t.count, 0);
	return /* @__PURE__ */ E(ue, {
		...l,
		ref: u,
		title: t ?? d("linkPanel.title"),
		subtitle: r ?? d("linkPanel.summary", {
			types: e.length,
			objects: f
		}),
		actions: a,
		headingLevel: s,
		className: p("mtc-link-panel", c),
		children: e.length === 0 ? /* @__PURE__ */ E("p", {
			className: "mtc-link-panel-empty",
			children: d("linkPanel.empty")
		}) : e.map((e) => {
			let t = e.items.slice(0, i), n = e.count > t.length;
			return /* @__PURE__ */ D("section", {
				className: "mtc-link-group",
				"aria-label": `${e.relation} ${e.targetType.label}`,
				children: [
					/* @__PURE__ */ E(Pt, { group: e }),
					t.length > 0 && /* @__PURE__ */ E("ul", {
						className: "mtc-link-items",
						children: t.map((e) => /* @__PURE__ */ D("li", {
							className: "mtc-link-item",
							children: [/* @__PURE__ */ E(je, {
								object: e,
								onNavigate: o,
								mono: e.mono,
								className: "mtc-link-item-chip"
							}), e.detail != null && /* @__PURE__ */ E("span", {
								className: "mtc-link-item-detail",
								children: e.detail
							})]
						}, e.id))
					}),
					n && (e.viewAllHref || e.onViewAll) && (e.viewAllHref ? /* @__PURE__ */ E("a", {
						className: "mtc-link-view-all",
						href: e.viewAllHref,
						onClick: Oe(e.onViewAll),
						children: e.viewAllLabel ?? d("linkPanel.viewAll", { count: e.count })
					}) : /* @__PURE__ */ E("button", {
						type: "button",
						className: "mtc-link-view-all",
						onClick: e.onViewAll,
						children: e.viewAllLabel ?? d("linkPanel.viewAll", { count: e.count })
					}))
				]
			}, e.id);
		})
	});
}), It = 176, Lt = 44, Rt = 20, zt = 56;
function Bt(e, t, n, r, i) {
	if (e === "right") {
		if (r > t) {
			let e = (r - t) / 2;
			return `M${t} ${n} C${t + e} ${n} ${r - e} ${i} ${r - 2} ${i}`;
		}
		let e = t - It, a = r + It;
		return `M${e} ${n} C${e - zt} ${n} ${a + zt} ${i} ${a + 2} ${i}`;
	}
	if (i > n) {
		let e = (i - n) / 2;
		return `M${t} ${n} C${t} ${n + e} ${r} ${i - e} ${r} ${i - 2}`;
	}
	let a = n - Lt, o = i + Lt;
	return `M${t} ${a} C${t} ${a - zt} ${r} ${o + zt} ${r} ${o + 2}`;
}
function Vt(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Ht({ types: e, relations: t, label: n, selectedId: r, onSelect: i, height: o = 360, direction: s = "right" }) {
	let { locale: u } = c(), d = `mtc-schema-arrow-${b().replace(/[^a-zA-Z0-9_-]/g, "")}`, f = S(() => m(e, t, {
		nodeWidth: It,
		nodeHeight: Lt,
		rankGap: s === "right" ? 272 : 116,
		nodeGap: s === "right" ? 28 : 24,
		padding: 24,
		direction: s
	}), [
		e,
		t,
		s
	]);
	if (!f) return null;
	let p = (e) => (t) => {
		i && X(t) && (t.preventDefault(), i(e, t));
	};
	return /* @__PURE__ */ D(yt, {
		label: n,
		width: f.width,
		height: f.height,
		viewHeight: o,
		children: [
			/* @__PURE__ */ E("defs", { children: /* @__PURE__ */ E("marker", {
				id: d,
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				markerUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ E("path", {
					d: "M0,0 L0,8 L8,4 z",
					className: "mtc-graph-arrow"
				})
			}) }),
			/* @__PURE__ */ E("g", {
				className: "mtc-graph-edges",
				children: f.edges.map(({ edge: e, x1: t, y1: n, x2: i, y2: a }, o) => {
					let c = Bt(s, t, n, i, a), l = r !== void 0 && (e.from === r || e.to === r);
					return /* @__PURE__ */ D("g", { children: [/* @__PURE__ */ E("path", {
						d: c,
						className: "mtc-graph-edge",
						"data-active": l || void 0,
						markerEnd: `url(#${d})`
					}), /* @__PURE__ */ E("text", {
						x: (t + i) / 2,
						y: (n + a) / 2 - 6,
						textAnchor: "middle",
						className: "mtc-graph-edge-label",
						children: Vt(e.label, 18)
					})] }, e.id ?? `${e.from}:${e.to}:${o}`);
				})
			}),
			f.nodes.map(({ node: e, x: t, y: n }) => {
				let { icon: o, color: s } = ke(e), c = e.id === r, d = !!(e.href || i), f = e.count === void 0 ? e.label : `${e.label}, ${l(e.count, { locale: u })}`;
				return /* @__PURE__ */ D("a", {
					href: e.href,
					role: e.href ? void 0 : d ? "button" : "img",
					tabIndex: e.href ? void 0 : d ? 0 : void 0,
					"aria-label": f,
					"aria-current": c || void 0,
					"data-graph-node": d || void 0,
					"data-selected": c || void 0,
					className: "mtc-graph-node mtc-schema-node",
					onClick: p(e),
					onKeyDown: d ? (t) => {
						(t.key === "Enter" || t.key === " " && !e.href) && (t.preventDefault(), i ? i(e, t) : t.currentTarget.dispatchEvent(new MouseEvent("click", {
							bubbles: !0,
							cancelable: !0
						})));
					} : void 0,
					children: [
						/* @__PURE__ */ E("rect", {
							x: t,
							y: n,
							width: It,
							height: Lt,
							rx: 4,
							className: "mtc-schema-node-box"
						}),
						/* @__PURE__ */ D("g", {
							style: { color: `var(--mtc-type-${s}-fg)` },
							children: [/* @__PURE__ */ E("rect", {
								x: t + 10,
								y: n + 10,
								width: 24,
								height: 24,
								rx: 4,
								fill: `var(--mtc-type-${s}-bg)`
							}), /* @__PURE__ */ E(a, {
								name: o,
								x: t + 15,
								y: n + 15,
								width: 14,
								height: 14,
								size: 14,
								strokeWidth: 2
							})]
						}),
						/* @__PURE__ */ E("text", {
							x: t + 44,
							y: e.count === void 0 ? n + Lt / 2 : n + 18,
							dominantBaseline: "middle",
							className: "mtc-graph-node-label",
							"data-emphasis": "true",
							children: Vt(e.label, Rt)
						}),
						e.count !== void 0 && /* @__PURE__ */ E("text", {
							x: t + 44,
							y: n + 32,
							dominantBaseline: "middle",
							className: "mtc-graph-node-meta",
							children: l(e.count, { locale: u })
						})
					]
				}, e.id);
			})
		]
	});
}
//#endregion
export { fe as A, z as B, xe as C, G as D, ge as E, le as F, P as G, R as H, ue as I, L as J, ee as K, oe as L, ae as M, ce as N, pe as O, ie as P, A as Q, re as R, K as S, me as T, F as U, B as V, te as W, k as X, N as Y, M as Z, De as _, ft as a, Te as b, qe as c, Pe as d, Ue as f, ke as g, Ae as h, pt as i, de as j, W as k, Ge as l, je as m, Ft as n, dt as o, Z as p, I as q, Nt as r, ut as s, Ht as t, $ as u, Ee as v, be as w, we as x, Ce as y, V as z };
