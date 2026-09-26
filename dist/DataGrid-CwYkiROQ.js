import { C as e, E as t, T as n, _ as r, b as i, h as a, n as o, p as s, w as c, y as l } from "./States-DM6NkR5E.js";
import { i as u, n as d, r as f, t as p } from "./utils-j4lJ7S1v.js";
import { d as m, h, o as g, u as _ } from "./Toast-CunWBlT5.js";
import { cloneElement as v, forwardRef as y, isValidElement as b, useCallback as x, useEffect as S, useId as C, useLayoutEffect as ee, useMemo as w, useRef as T, useState as E } from "react";
import { Fragment as D, jsx as O, jsxs as k } from "react/jsx-runtime";
import { createPortal as te } from "react-dom";
//#region src/components/TypeGlyph.tsx
var ne = [
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
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, ne[(t >>> 0) % ne.length];
}
var j = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, M = y(function({ icon: e = "object", color: t, size: n = 20, label: r, className: i, ...o }, s) {
	return /* @__PURE__ */ O("span", {
		...o,
		ref: s,
		className: p("mtc-type-glyph", i),
		"data-color": t,
		"data-size": n,
		role: r ? "img" : void 0,
		"aria-label": r,
		"aria-hidden": !r || void 0,
		children: /* @__PURE__ */ O(a, {
			name: e,
			size: j[n],
			strokeWidth: n <= 20 ? 2 : 1.75
		})
	});
}), N = y(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ O("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: p("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), P = y(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ O("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: p("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function F({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = C(), c = (b(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, l = r ? `${c}-description` : void 0, u = i ? `${c}-error` : void 0, d = [
		b(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		l,
		u
	].filter(Boolean).join(" ") || void 0, f = (b(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, m = b(t) ? v(t, {
		id: c,
		"aria-describedby": d,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: f
	}) : t;
	return /* @__PURE__ */ k("div", {
		className: p("mtc-form-field", o),
		children: [
			/* @__PURE__ */ k("label", {
				className: "mtc-form-label",
				htmlFor: c,
				children: [e, f && /* @__PURE__ */ O("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			m,
			r && /* @__PURE__ */ O("div", {
				id: l,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ O("div", {
				id: u,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var I = y(function({ label: e, description: t, density: n, className: r, ...i }, o) {
	return /* @__PURE__ */ k("label", {
		className: p("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ O("input", {
				...i,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ O("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ O(a, { name: "check" })
			}),
			/* @__PURE__ */ k("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ O("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ O("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), L = y(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ k("label", {
		className: p("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ O("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ O("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ k("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ O("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ O("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), R = y(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ k("label", {
		className: p("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ O("input", {
				...o,
				ref: s,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ O("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ O("span", {})
			}),
			/* @__PURE__ */ k("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ O("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ O("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), z = y(function({ value: e, onValueChange: t, options: r, placeholder: i, disabled: o, required: s, name: c, id: l, "aria-label": u, "aria-labelledby": d, "aria-describedby": f, "aria-invalid": m, invalid: h, size: g = "medium", density: _, className: v, emptyMessage: y }, b) {
	let x = n(), ee = C(), D = l ?? `mtc-combobox-${ee}`, te = `${D}-listbox`, ne = T(null), A = T(null), j = r.find((t) => t.value === e), [M, N] = E(j?.label ?? ""), [P, F] = E(!1), [I, L] = E(-1), R = w(() => {
		let e = M.trim().toLocaleLowerCase();
		return !e || j?.label === M ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		M,
		j?.label
	]);
	S(() => {
		P || N(j?.label ?? "");
	}, [P, j?.label]), S(() => {
		A.current?.setCustomValidity(s && !j ? "Please select an option." : "");
	}, [s, j]), S(() => {
		if (!P || typeof document > "u") return;
		let e = (e) => {
			ne.current?.contains(e.target) || F(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [P]);
	let z = (e, t) => {
		if (R.length === 0) return -1;
		let n = e;
		for (let e = 0; e < R.length; e++) if (n = (n + t + R.length) % R.length, !R[n]?.disabled) return n;
		return -1;
	}, re = (e) => {
		e.disabled || (t(e.value), N(e.label), F(!1), L(-1));
	};
	return /* @__PURE__ */ k("div", {
		ref: ne,
		className: p("mtc-combobox", _ && `mtc-density-${_}`, v),
		"data-size": g,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || F(!1);
		},
		children: [
			c && /* @__PURE__ */ O("input", {
				type: "hidden",
				name: c,
				value: e ?? ""
			}),
			/* @__PURE__ */ O("input", {
				ref: (e) => {
					A.current = e, typeof b == "function" ? b(e) : b && (b.current = e);
				},
				id: D,
				value: M,
				disabled: o,
				required: s,
				placeholder: i ?? x("combobox.placeholder"),
				role: "combobox",
				"aria-label": u,
				"aria-labelledby": d,
				"aria-describedby": f,
				"aria-invalid": h || m || void 0,
				"aria-required": s || void 0,
				"aria-expanded": P,
				"aria-controls": P ? te : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": P && I >= 0 ? `${D}-option-${I}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					F(!0), L(R.findIndex((t) => t.value === e && !t.disabled));
				},
				onChange: (e) => {
					N(e.currentTarget.value), F(!0), L(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), F(!0), L((e) => z(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), F(!0), L((e) => z(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && P) e.preventDefault(), L(z(-1, 1));
					else if (e.key === "End" && P) e.preventDefault(), L(z(0, -1));
					else if (e.key === "Enter" && P && I >= 0) {
						e.preventDefault();
						let t = R[I];
						t && re(t);
					} else e.key === "Escape" && P ? (e.preventDefault(), e.stopPropagation(), F(!1), N(j?.label ?? "")) : e.key === "Tab" && F(!1);
				}
			}),
			/* @__PURE__ */ O(a, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			P && !o && /* @__PURE__ */ O("div", {
				id: te,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: R.length === 0 ? /* @__PURE__ */ O("div", {
					className: "mtc-combobox-empty",
					children: y ?? x("combobox.empty")
				}) : R.map((t, n) => /* @__PURE__ */ k("div", {
					id: `${D}-option-${n}`,
					role: "option",
					"aria-selected": t.value === e,
					"aria-disabled": t.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": I === n,
					"data-selected": t.value === e,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						t.disabled || L(n);
					},
					onClick: () => re(t),
					children: [/* @__PURE__ */ k("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ O("span", { children: t.label }), t.description && /* @__PURE__ */ O("small", { children: t.description })]
					}), t.value === e && /* @__PURE__ */ O(a, { name: "check" })]
				}, t.value))
			})
		]
	});
}), re = 6, ie = 320;
function ae({ children: e, content: n, openDelay: r = 350, closeDelay: i = 150, className: a }) {
	let o = C(), s = t(), c = T(null), l = T(void 0), [u, d] = E(!1), [f, m] = E(null), h = x((e, t) => {
		clearTimeout(l.current), l.current = setTimeout(() => d(e), t);
	}, []);
	S(() => () => clearTimeout(l.current), []), ee(() => {
		if (!u || !c.current || typeof window > "u") {
			m(null);
			return;
		}
		let e = c.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - ie - 8));
		m({
			left: r,
			top: n === "below" ? e.bottom + re : e.top - re,
			placement: n
		});
	}, [u]), S(() => {
		if (!u) return;
		let e = (e) => {
			e.key === "Escape" && d(!1);
		}, t = () => d(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [u]);
	let g = e, _ = [g.props["aria-describedby"], u ? o : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ k("span", {
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
		}), u && s && f && te(/* @__PURE__ */ O("div", {
			id: o,
			role: "tooltip",
			className: p("mtc-hover-card", a),
			"data-placement": f.placement,
			style: {
				left: f.left,
				top: f.top,
				width: ie,
				transform: f.placement === "above" ? "translateY(-100%)" : void 0
			},
			onMouseEnter: () => clearTimeout(l.current),
			onMouseLeave: () => h(!1, i),
			children: n
		}), s)]
	});
}
//#endregion
//#region src/components/navigation.ts
function oe(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function se(e) {
	if (e) return (t) => {
		oe(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/components/Overlays.tsx
function ce({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let a = C(), [o, s] = f({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ O(D, { children: t });
	let c = t, l = [c.props["aria-describedby"], o ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ k("span", {
		className: p("mtc-tooltip-trigger", i),
		children: [v(c, {
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
		}), o && /* @__PURE__ */ O("span", {
			id: a,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function le({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", disabled: c, className: l }) {
	let u = C(), d = C(), m = T(null), h = T(null), [g, _] = f({
		value: i,
		defaultValue: a,
		onChange: o
	});
	return he(g, m, () => {
		_(!1), h.current?.focus();
	}), /* @__PURE__ */ k("div", {
		ref: m,
		className: p("mtc-popover-root", l),
		children: [/* @__PURE__ */ O("button", {
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
		}), g && /* @__PURE__ */ k("div", {
			id: u,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? d : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": s,
			children: [r && /* @__PURE__ */ O("div", {
				id: d,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function ue({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: a, align: o = "start", disabled: s, className: c }) {
	let l = T(null), u = T(null), [d, m] = f({
		value: void 0,
		defaultValue: 0
	}), [h, g] = f({
		value: r,
		defaultValue: i,
		onChange: a
	}), _ = (e = !0) => {
		g(!1), e && u.current?.focus();
	};
	return he(h, l, () => _(!1)), /* @__PURE__ */ k("div", {
		ref: l,
		className: p("mtc-menu-root", c),
		children: [/* @__PURE__ */ O("button", {
			ref: u,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": h,
			disabled: s,
			onClick: () => {
				m(B(n, 1)), g(!h);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), m(B(n, e.key === "ArrowDown" ? 1 : -1)), g(!0));
			},
			children: t
		}), h && /* @__PURE__ */ O(fe, {
			label: e,
			items: n,
			initialIndex: d,
			align: o,
			onClose: _
		})]
	});
}
var de = y(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: a, onKeyDown: o, ...s }, c) {
	let l = T(null), u = T({
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
	he(d, l, () => m(!1));
	let v = (e, n) => {
		u.current = {
			x: e,
			y: n
		}, g(B(t, 1)), m(!0);
	};
	return /* @__PURE__ */ k("div", {
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
		children: [n, d && /* @__PURE__ */ O(fe, {
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
function fe({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = T(null);
	S(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = V(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ O("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ O("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ k("button", {
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
				e.icon && /* @__PURE__ */ O("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ O("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ O("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var pe = y(function({ open: e, onOpenChange: t, title: r, description: i, children: o, footer: c, size: l = "medium", dismissible: f = !0, initialFocusRef: m, className: h }, g) {
	let _ = n(), v = C(), y = C(), b = T(null);
	return u(e, b, m), e ? /* @__PURE__ */ O("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			f && e.target === e.currentTarget && t(!1);
		},
		children: /* @__PURE__ */ k("div", {
			ref: (e) => {
				b.current = e, typeof g == "function" ? g(e) : g && (g.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": v,
			"aria-describedby": i ? y : void 0,
			tabIndex: -1,
			className: p("mtc-dialog", h),
			"data-size": l,
			onKeyDown: (e) => d(e, b, f, () => t(!1)),
			children: [
				/* @__PURE__ */ k("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ k("div", { children: [/* @__PURE__ */ O("h2", {
						id: v,
						className: "mtc-modal-title",
						children: r
					}), i && /* @__PURE__ */ O("p", {
						id: y,
						className: "mtc-modal-description",
						children: i
					})] }), f && /* @__PURE__ */ O(s, {
						icon: /* @__PURE__ */ O(a, { name: "close" }),
						"aria-label": _("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => t(!1)
					})]
				}),
				/* @__PURE__ */ O("div", {
					className: "mtc-modal-body",
					children: o
				}),
				c && /* @__PURE__ */ O("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
}), me = y(function({ open: e, onOpenChange: t, title: r, description: i, children: o, footer: c, side: l = "right", width: f = 420, dismissible: m = !0, initialFocusRef: h, className: g }, _) {
	let v = n(), y = C(), b = C(), x = T(null);
	return u(e, x, h), e ? /* @__PURE__ */ O("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			m && e.target === e.currentTarget && t(!1);
		},
		children: /* @__PURE__ */ k("div", {
			ref: (e) => {
				x.current = e, typeof _ == "function" ? _(e) : _ && (_.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": y,
			"aria-describedby": i ? b : void 0,
			tabIndex: -1,
			className: p("mtc-drawer", g),
			"data-side": l,
			style: { width: f },
			onKeyDown: (e) => d(e, x, m, () => t(!1)),
			children: [
				/* @__PURE__ */ k("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ k("div", { children: [/* @__PURE__ */ O("h2", {
						id: y,
						className: "mtc-modal-title",
						children: r
					}), i && /* @__PURE__ */ O("p", {
						id: b,
						className: "mtc-modal-description",
						children: i
					})] }), m && /* @__PURE__ */ O(s, {
						icon: /* @__PURE__ */ O(a, { name: "close" }),
						"aria-label": v("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => t(!1)
					})]
				}),
				/* @__PURE__ */ O("div", {
					className: "mtc-modal-body",
					children: o
				}),
				c && /* @__PURE__ */ O("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
});
function he(e, t, n) {
	S(() => {
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
function B(e, t) {
	return V(e, t === 1 ? -1 : 0, t);
}
function V(e, t, n) {
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
//#region src/objects/types.ts
function ge(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? A(e.id ?? e.label)
	};
}
function H(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
//#region src/objects/ObjectChip.tsx
var U = y(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? ge(e.type) : null, s = /* @__PURE__ */ k(D, { children: [o && /* @__PURE__ */ O(M, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ O("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, l = p("mtc-object-chip", i), u;
	return u = e.href ? /* @__PURE__ */ O("a", {
		ref: a,
		href: e.href,
		className: l,
		"data-interactive": "true",
		onClick: se(c),
		children: s
	}) : c ? /* @__PURE__ */ O("button", {
		ref: a,
		type: "button",
		className: l,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ O("span", {
		ref: a,
		className: l,
		children: s
	}), n ? /* @__PURE__ */ O(ae, {
		content: n,
		children: u
	}) : u;
}), _e = /* @__PURE__ */ new Set([
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
function W(e, t, n) {
	if (n) {
		let [e, t] = n.split(":");
		if (e === "currency") return {
			kind: "currency",
			currency: (t || "USD").toUpperCase()
		};
		if (_e.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : H(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function ve(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function ye(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function be(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var G = /^\d{4}-\d{2}-\d{2}$/;
function xe(e) {
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
function Se(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function K(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function Ce(e, t, n = "en") {
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
function we(e, t, { locale: n = "en", timeZone: i } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return r(e.date, {
		locale: n,
		timeZone: e.dateOnly ? "UTC" : i,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var Te = 864e5;
function q(e, t, n = "en") {
	if (!e.dateOnly) return i(e.date, {
		locale: n,
		now: t
	});
	let r = new Date(t), a = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()), o = Math.round((e.date.getTime() - a) / Te);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : i(e.date, {
		locale: n,
		now: a
	});
}
function J(e, t, n = {}) {
	if (ve(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = be(e);
			return n == null ? String(e) : Ce(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = xe(e);
			return r ? we(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => J(e, W(e), n)).join(", ");
		case "link": return H(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${J(t, W(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function Ee(e, t, n = {}) {
	return ve(e) ? null : ye(t.kind) ? be(e) ?? J(e, t, n) : t.kind === "date" || t.kind === "datetime" ? xe(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : J(e, t, n);
}
var De = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function Oe(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : De.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var Y = 3;
function ke(e) {
	return /* @__PURE__ */ O(Ae, {
		...e,
		depth: 0
	});
}
function Ae({ value: e, kind: t, format: r, tones: i, context: o = "panel", emptyValue: s, now: l, onNavigate: u, maxListItems: d, depth: f }) {
	let { locale: p, timeZone: _ } = c(), v = n(), y = w(() => W(e, t, r), [
		e,
		t,
		r
	]), b = {
		locale: p,
		timeZone: _,
		yes: v("value.yes"),
		no: v("value.no")
	}, x = o === "panel";
	if (ve(e)) return /* @__PURE__ */ O("span", {
		className: "mtc-value-empty",
		children: s ?? "—"
	});
	switch (y.kind) {
		case "id":
		case "code": {
			let t = String(e);
			return /* @__PURE__ */ k("span", {
				className: "mtc-value-id",
				"data-context": o,
				children: [/* @__PURE__ */ O("code", { children: t }), x && /* @__PURE__ */ O(g, {
					value: t,
					label: v("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ O(X, {
			value: e,
			resolved: y,
			locale: p,
			panel: x
		});
		case "date":
		case "datetime": {
			let t = xe(e);
			return t ? /* @__PURE__ */ k("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ O("time", {
					dateTime: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					title: t.dateOnly ? String(e).trim() : t.date.toISOString(),
					children: we(t, y.kind, b)
				}), x && /* @__PURE__ */ O("span", {
					className: "mtc-value-secondary",
					children: q(t, l ?? Date.now(), p)
				})]
			}) : /* @__PURE__ */ O("span", {
				className: "mtc-value-text",
				children: String(e)
			});
		}
		case "boolean": {
			let t = e === !0 || e === "true";
			return /* @__PURE__ */ k("span", {
				className: "mtc-value-boolean",
				"data-value": t,
				children: [/* @__PURE__ */ O(a, { name: t ? "check" : "close" }), v(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let t = String(e), n = i?.[t];
			return n && n !== "neutral" ? /* @__PURE__ */ O(m, {
				tone: n,
				children: t
			}) : /* @__PURE__ */ O(h, {
				className: "mtc-value-chip",
				children: t
			});
		}
		case "list": {
			let t = Array.isArray(e) ? e : [e], n = d ?? (x ? 3 : 2), r = t.slice(0, n), i = t.slice(n);
			return /* @__PURE__ */ k("span", {
				className: "mtc-value-list",
				"data-context": o,
				children: [r.map((e, t) => H(e) ? /* @__PURE__ */ O(U, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ O(h, {
					className: "mtc-value-chip",
					children: J(e, W(e), b)
				}, t)), i.length > 0 && /* @__PURE__ */ O(h, {
					className: "mtc-value-chip",
					title: v("value.moreTitle", {
						count: i.length,
						items: i.map((e) => J(e, W(e), b)).join(", ")
					}),
					children: v("value.more", { count: i.length })
				})]
			});
		}
		case "link": return H(e) ? /* @__PURE__ */ O(U, {
			object: e,
			onNavigate: u
		}) : /* @__PURE__ */ O("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "url": {
			let t = Se(e);
			if (!t) return /* @__PURE__ */ O("span", {
				className: "mtc-value-text",
				children: String(e)
			});
			let n = String(e).trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
			return /* @__PURE__ */ k("a", {
				className: "mtc-value-link",
				href: t,
				target: "_blank",
				rel: "noopener noreferrer",
				children: [
					/* @__PURE__ */ O("span", {
						className: "mtc-value-link-text",
						children: n
					}),
					/* @__PURE__ */ O(a, { name: "external-link" }),
					/* @__PURE__ */ O("span", {
						className: "mtc-visually-hidden",
						children: v("value.newTab")
					})
				]
			});
		}
		case "email": return K(e) ? /* @__PURE__ */ O("a", {
			className: "mtc-value-link",
			href: `mailto:${e.trim()}`,
			children: /* @__PURE__ */ O("span", {
				className: "mtc-value-link-text",
				children: e.trim()
			})
		}) : /* @__PURE__ */ O("span", {
			className: "mtc-value-text",
			children: String(e)
		});
		case "object": {
			if (f >= Y || !e || typeof e != "object") return /* @__PURE__ */ O("span", {
				className: "mtc-value-text",
				children: J(e, y, b)
			});
			let t = Object.entries(e);
			return /* @__PURE__ */ k("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ O("summary", { children: v("value.fields", { count: t.length }) }), /* @__PURE__ */ O("dl", { children: t.map(([e, t]) => /* @__PURE__ */ k("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ O("dt", { children: e }), /* @__PURE__ */ O("dd", { children: /* @__PURE__ */ O(Ae, {
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
			return /* @__PURE__ */ O("span", {
				className: "mtc-value-text",
				"data-context": o,
				title: t.length > 80 ? t : void 0,
				children: t
			});
		}
	}
}
function X({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ k("span", {
		className: "mtc-value-number",
		children: [Ce(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ O("span", {
			className: "mtc-value-secondary",
			children: t.currency
		})]
	}) : /* @__PURE__ */ O("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
//#region src/workbench/dataGridModel.ts
function je(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function Me(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = je(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : Ee(i, W(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return Oe(e.key, t.key) || e.index - t.index;
		let r = Oe(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function Ne(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function Pe(e, t, n, r, i, a) {
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
function Fe(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function Ie(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function Le(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
var Re = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, ze = 160, Be = 40, Ve = 16, He = 8, Ue = 160;
function We(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function Z({ label: r, columns: i, rows: s, rowKey: l, rowLabel: u, selection: d = "none", selectedKeys: f, defaultSelectedKeys: m, onSelectionChange: h, sort: g, defaultSort: v = null, onSortChange: y, sortMode: b = "client", onRowActivate: C, rowHref: D, onNavigate: ne, contextActions: A, onCellEdit: j, onEndReached: M, totalRows: N, loading: P = !1, empty: F, density: I, rowHeight: L, height: R = "100%", virtualize: z = "auto", overscan: re = 8, footer: ie, rowProps: ae, className: oe }) {
	let ce = n(), { locale: le, timeZone: ue } = c(), de = e(), pe = t(), me = I ?? de?.density ?? "standard", B = L ?? Re[me], V = T(null), ge = T(null), H = T(!1), U = T(null), _e = T(-1), [ve, be] = E(v), G = g === void 0 ? ve : g, [xe, Se] = E(m ?? []), K = f ?? xe, Ce = w(() => new Set(K), [K]), [we, Te] = E({}), [q, Ee] = E(() => ({
		row: s.length > 0 ? 0 : -1,
		column: +(d === "multi")
	})), [De, Oe] = E({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [Y, Ae] = E(null), X = w(() => b !== "client" || !G ? s : Me(s, i.find((e) => e.id === G.columnId), G.direction, le), [
		s,
		i,
		G,
		b,
		le
	]), Z = w(() => X.map((e, t) => l(e, t)), [X, l]), Q = w(() => [...d === "multi" ? [{
		kind: "select",
		width: Be
	}] : [], ...i.map((e) => ({
		kind: "data",
		column: e,
		width: we[e.id] ?? e.width ?? ze
	}))], [
		i,
		d,
		we
	]), Ge = w(() => {
		let e = Q.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Q.length - 1;
	}, [Q]), Ke = Q.map((e, t) => t === Ge ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), qe = Q.reduce((e, t) => e + t.width, 0), Je = w(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Q.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Q.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Q]), Ye = w(() => {
		let e = Q.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Q.findIndex((e) => e.kind === "data");
	}, [Q]), Xe = z === "auto" ? X.length > 200 : z, Ze = Pe(X.length, De.scrollTop, De.height, B, re, Xe), Qe = P && X.length === 0, $e = !P && X.length === 0, et = Qe ? He : P && X.length > 0 ? 1 : 0, tt = $e ? Ue : (X.length + et) * B, nt = x((e) => {
		if (u) return u(e);
		let t = i[0];
		if (!t) return "";
		let n = je(t, e);
		return J(n, W(n, t.kind, t.format), {
			locale: le,
			timeZone: ue
		});
	}, [
		u,
		i,
		le,
		ue
	]), $ = x((e) => {
		f === void 0 && Se(e), h?.(e);
	}, [f, h]), rt = (e) => {
		let t = Ne(G, e);
		g === void 0 && be(t), y?.(t);
	};
	ee(() => {
		let e = V.current;
		if (!e) return;
		let t = () => Oe((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let it = (e) => (e - Math.max(1, Math.floor(re / 2))) * B, at = De.scrollTop + De.height >= it(X.length), ot = () => {
		let e = V.current;
		if (!e) return;
		let t = Pe(X.length, e.scrollTop, e.clientHeight, B, re, Xe), n = e.scrollTop + e.clientHeight >= it(X.length);
		(t.start !== Ze.start || t.end !== Ze.end || M && n !== at) && Oe({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	S(() => {
		Ee((e) => {
			let t = e.row < 0 || X.length === 0 ? -1 : Math.min(e.row, X.length - 1), n = Math.max(0, Math.min(e.column, Q.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [X.length, Q.length]), ee(() => {
		H.current && (H.current = !1, V.current?.querySelector(`[data-cell="${q.row}:${q.column}"]`)?.focus({ preventScroll: !0 }));
	}), S(() => {
		M && !P && X.length !== 0 && (N !== void 0 && X.length >= N || at && _e.current !== X.length && (_e.current = X.length, M()));
	}, [
		M,
		P,
		X.length,
		N,
		at
	]);
	let st = (e) => {
		let t = V.current;
		if (t && e.row >= 0) {
			let n = Fe(e.row, t.scrollTop, t.clientHeight, B, B);
			n !== t.scrollTop && (t.scrollTop = n, Oe({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		H.current = !0, Ee(e);
	}, ct = (e, t) => {
		if (d === "single") {
			$([e]), U.current = e;
			return;
		}
		if (d === "multi") {
			if (t && U.current) {
				$([.../* @__PURE__ */ new Set([...K, ...Ie(Z, U.current, e)])]);
				return;
			}
			$(Ce.has(e) ? K.filter((t) => t !== e) : [...K, e]), U.current = e;
		}
	}, lt = (e) => {
		let t = X[e];
		if (t !== void 0) {
			if (C) {
				C(t);
				return;
			}
			V.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, ut = (e, t, n) => {
		let r = X[e];
		r !== void 0 && A && A(r).length !== 0 && Ae({
			rowIndex: e,
			x: t,
			y: n
		});
	}, dt = x(() => {
		Ae(null), H.current = !0;
	}, []);
	he(Y !== null, ge, dt);
	let ft = (e, t) => {
		let n = Q[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		Te((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, pt = (e) => {
		if (We(e.target) || Y) return;
		let { row: t, column: n } = q, r = X.length, i = Math.max(1, Math.floor((V.current?.clientHeight ?? B * 10) / B) - 1), a = Q[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), ft(n, e.key === "ArrowRight" ? Ve : -16);
			return;
		}
		let o = Le(q, e.key, {
			rowCount: r,
			columnCount: Q.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && d === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = Z[o.row];
				e && (U.current ||= Z[Math.max(0, t)] ?? e, $([.../* @__PURE__ */ new Set([...K, ...Ie(Z, U.current, e)])]));
			}
			st(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), rt(a.column.id)) : e.key === " " && a?.kind === "select" && d === "multi" && (e.preventDefault(), $(K.length === Z.length ? [] : [...Z]));
			return;
		}
		let s = Z[t];
		if (e.key === "Enter") e.preventDefault(), lt(t);
		else if (e.key === " " && s) e.preventDefault(), ct(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && d === "multi") e.preventDefault(), $([...Z]);
		else if (e.key === "F2" && j && a?.kind === "data") {
			e.preventDefault();
			let n = X[t];
			n !== void 0 && j(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			ut(t, n.left + 12, n.bottom);
		}
	}, mt = (e, t) => {
		let n = Z[t];
		n && d !== "none" && (e.target.closest("a, button, input, select, textarea") || (d === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? ct(n, e.shiftKey) : ($([n]), U.current = n)));
	}, ht = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Q[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? 48, o = r.column.id, s = (e) => {
			Te((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, gt = (e, t) => {
		let n = q.row === e && q.column === t, r = Je.get(t);
		return {
			"data-cell": `${e}:${t}`,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: () => {
				n || Ee({
					row: e,
					column: t
				});
			}
		};
	}, _t = [];
	for (let e = Ze.start; e < Ze.end; e++) _t.push(e);
	q.row >= 0 && q.row < X.length && (q.row < Ze.start || q.row >= Ze.end) && _t.push(q.row);
	let vt = d === "multi" && Z.length > 0 && Z.every((e) => Ce.has(e)), yt = d === "multi" && !vt && Z.some((e) => Ce.has(e)), bt = Y ? X[Y.rowIndex] : void 0, xt = {
		"--mtc-grid-template": Ke,
		"--mtc-grid-min-width": `${qe}px`,
		"--mtc-grid-row-height": `${B}px`,
		"--mtc-grid-viewport-width": De.width > 0 ? `${De.width}px` : "100%"
	};
	return /* @__PURE__ */ k("div", {
		className: p("mtc-data-grid", I && `mtc-density-${I}`, oe),
		style: {
			...xt,
			height: R
		},
		children: [
			/* @__PURE__ */ k("div", {
				ref: V,
				role: "grid",
				"aria-label": r,
				"aria-rowcount": (N ?? X.length) + 1,
				"aria-colcount": Q.length,
				"aria-multiselectable": d === "multi" || void 0,
				"aria-busy": P || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: pt,
				onScroll: ot,
				children: [/* @__PURE__ */ O("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ O("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Q.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ O("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...gt(-1, t),
								children: /* @__PURE__ */ O("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": ce("dataGrid.selectAll"),
									checked: vt,
									ref: (e) => {
										e && (e.indeterminate = yt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => $(vt ? [] : [...Z])
								})
							}, "__select");
							let { column: n } = e, r = G?.columnId === n.id ? G.direction : void 0, i = n.align === "end" || !n.align && !n.cell && ye(W(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ k("div", {
								role: "columnheader",
								"aria-sort": r ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": i ? "end" : "start",
								"data-sortable": o || void 0,
								...gt(-1, t),
								onClick: o ? () => {
									rt(n.id), Ee({
										row: -1,
										column: t
									});
								} : void 0,
								children: [
									/* @__PURE__ */ O("span", {
										className: "mtc-data-grid-header-label",
										children: n.header
									}),
									r && /* @__PURE__ */ O(a, {
										name: r === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ O("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => ht(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ k("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: tt },
					children: [
						_t.map((e) => {
							let t = X[e], n = Z[e], r = Ce.has(n), i = D?.(t);
							return /* @__PURE__ */ O("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": d === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * B },
								...ae?.(t),
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
									t.preventDefault(), d !== "none" && !r && $([n]), Ee({
										row: e,
										column: q.column
									}), ut(e, t.clientX, t.clientY);
								} : void 0,
								children: Q.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ O("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...gt(e, o),
										children: /* @__PURE__ */ O("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": ce("dataGrid.selectRow", { label: nt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => ct(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = je(s, t), l = W(c, s.kind, s.format), u = s.align === "end" || !s.align && !s.cell && ye(l.kind), d = s.cell ? s.cell(t, {
										value: c,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ O(ke, {
										value: c,
										kind: s.kind,
										format: s.format,
										tones: s.tones,
										context: "grid"
									});
									return /* @__PURE__ */ O("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": s.id,
										"data-align": u ? "end" : "start",
										...gt(e, o),
										children: i && o === Ye ? /* @__PURE__ */ O("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: se(ne ? (e) => ne(t, e) : void 0),
											children: d
										}) : d
									}, s.id);
								})
							}, n);
						}),
						Qe && Array.from({ length: He }, (e, t) => /* @__PURE__ */ O("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * B },
							children: Q.map((e, n) => /* @__PURE__ */ O("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ O(_, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Qe && /* @__PURE__ */ O("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ O("div", {
								role: "gridcell",
								children: ce("dataGrid.loading")
							})
						}),
						P && X.length > 0 && /* @__PURE__ */ O("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: X.length * B },
							children: /* @__PURE__ */ O("div", {
								role: "gridcell",
								"aria-colspan": Q.length,
								className: "mtc-data-grid-cell",
								children: ce("dataGrid.loadingMore")
							})
						}),
						$e && /* @__PURE__ */ O("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Ue
							},
							children: /* @__PURE__ */ O("div", {
								role: "gridcell",
								"aria-colspan": Q.length,
								className: "mtc-data-grid-cell",
								children: F ?? /* @__PURE__ */ O(o, {
									compact: !0,
									title: ce("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			ie && /* @__PURE__ */ O("div", {
				className: "mtc-data-grid-footer",
				children: ie
			}),
			Y && bt !== void 0 && A && (() => {
				let e = /* @__PURE__ */ O("div", {
					ref: ge,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ O(fe, {
						label: ce("dataGrid.rowActions", { label: nt(bt) }),
						items: A(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: Y.x,
							top: Y.y
						},
						onClose: dt
					})
				});
				return pe ? te(e, pe) : e;
			})()
		]
	});
}
//#endregion
export { N as C, ne as D, P as E, M as O, F as S, R as T, oe as _, ye as a, I as b, U as c, de as d, pe as f, ce as g, le as h, J as i, A as k, H as l, ue as m, ke as n, Ee as o, me as p, Oe as r, W as s, Z as t, ge as u, se as v, L as w, z as x, ae as y };
