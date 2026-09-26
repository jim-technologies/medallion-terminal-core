import { T as e, h as t, p as n } from "./States-Bt1VXklN.js";
import { i as r, n as i, r as a, t as o } from "./utils-j4lJ7S1v.js";
import { cloneElement as s, forwardRef as c, isValidElement as l, useEffect as u, useId as d, useMemo as f, useRef as p, useState as m } from "react";
import { Fragment as h, jsx as g, jsxs as _ } from "react/jsx-runtime";
//#region src/components/TypeGlyph.tsx
var v = [
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
function y(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, v[(t >>> 0) % v.length];
}
var b = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, x = c(function({ icon: e = "object", color: n, size: r = 20, label: i, className: a, ...s }, c) {
	return /* @__PURE__ */ g("span", {
		...s,
		ref: c,
		className: o("mtc-type-glyph", a),
		"data-color": n,
		"data-size": r,
		role: i ? "img" : void 0,
		"aria-label": i,
		"aria-hidden": !i || void 0,
		children: /* @__PURE__ */ g(t, {
			name: e,
			size: b[r],
			strokeWidth: r <= 20 ? 2 : 1.75
		})
	});
}), S = c(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ g("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: o("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), C = c(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ g("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: o("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function w({ label: e, children: t, id: n, description: r, error: i, required: a, className: c }) {
	let u = d(), f = (l(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${u}`, p = r ? `${f}-description` : void 0, m = i ? `${f}-error` : void 0, h = [
		l(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		p,
		m
	].filter(Boolean).join(" ") || void 0, v = (l(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, y = l(t) ? s(t, {
		id: f,
		"aria-describedby": h,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: v
	}) : t;
	return /* @__PURE__ */ _("div", {
		className: o("mtc-form-field", c),
		children: [
			/* @__PURE__ */ _("label", {
				className: "mtc-form-label",
				htmlFor: f,
				children: [e, v && /* @__PURE__ */ g("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			y,
			r && /* @__PURE__ */ g("div", {
				id: p,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ g("div", {
				id: m,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var T = c(function({ label: e, description: n, density: r, className: i, ...a }, s) {
	return /* @__PURE__ */ _("label", {
		className: o("mtc-choice", r && `mtc-density-${r}`, i),
		children: [
			/* @__PURE__ */ g("input", {
				...a,
				ref: s,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ g("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ g(t, { name: "check" })
			}),
			/* @__PURE__ */ _("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ g("span", {
					className: "mtc-choice-label",
					children: e
				}), n && /* @__PURE__ */ g("span", {
					className: "mtc-choice-description",
					children: n
				})]
			})
		]
	});
}), E = c(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ _("label", {
		className: o("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ g("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ g("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ _("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ g("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ g("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), D = c(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...s }, c) {
	return /* @__PURE__ */ _("label", {
		className: o("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ g("input", {
				...s,
				ref: c,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ g("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ g("span", {})
			}),
			/* @__PURE__ */ _("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ g("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ g("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), O = c(function({ value: n, onValueChange: r, options: i, placeholder: a, disabled: s, required: c, name: l, id: h, "aria-label": v, "aria-labelledby": y, "aria-describedby": b, "aria-invalid": x, invalid: S, size: C = "medium", density: w, className: T, emptyMessage: E }, D) {
	let O = e(), k = d(), A = h ?? `mtc-combobox-${k}`, j = `${A}-listbox`, M = p(null), N = p(null), P = i.find((e) => e.value === n), [F, I] = m(P?.label ?? ""), [L, R] = m(!1), [z, B] = m(-1), V = f(() => {
		let e = F.trim().toLocaleLowerCase();
		return !e || P?.label === F ? [...i] : i.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		i,
		F,
		P?.label
	]);
	u(() => {
		L || I(P?.label ?? "");
	}, [L, P?.label]), u(() => {
		N.current?.setCustomValidity(c && !P ? "Please select an option." : "");
	}, [c, P]), u(() => {
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
		e.disabled || (r(e.value), I(e.label), R(!1), B(-1));
	};
	return /* @__PURE__ */ _("div", {
		ref: M,
		className: o("mtc-combobox", w && `mtc-density-${w}`, T),
		"data-size": C,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(!1);
		},
		children: [
			l && /* @__PURE__ */ g("input", {
				type: "hidden",
				name: l,
				value: n ?? ""
			}),
			/* @__PURE__ */ g("input", {
				ref: (e) => {
					N.current = e, typeof D == "function" ? D(e) : D && (D.current = e);
				},
				id: A,
				value: F,
				disabled: s,
				required: c,
				placeholder: a ?? O("combobox.placeholder"),
				role: "combobox",
				"aria-label": v,
				"aria-labelledby": y,
				"aria-describedby": b,
				"aria-invalid": S || x || void 0,
				"aria-required": c || void 0,
				"aria-expanded": L,
				"aria-controls": L ? j : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": L && z >= 0 ? `${A}-option-${z}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					R(!0), B(V.findIndex((e) => e.value === n && !e.disabled));
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
			/* @__PURE__ */ g(t, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			L && !s && /* @__PURE__ */ g("div", {
				id: j,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: V.length === 0 ? /* @__PURE__ */ g("div", {
					className: "mtc-combobox-empty",
					children: E ?? O("combobox.empty")
				}) : V.map((e, r) => /* @__PURE__ */ _("div", {
					id: `${A}-option-${r}`,
					role: "option",
					"aria-selected": e.value === n,
					"aria-disabled": e.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": z === r,
					"data-selected": e.value === n,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						e.disabled || B(r);
					},
					onClick: () => U(e),
					children: [/* @__PURE__ */ _("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ g("span", { children: e.label }), e.description && /* @__PURE__ */ g("small", { children: e.description })]
					}), e.value === n && /* @__PURE__ */ g(t, { name: "check" })]
				}, e.value))
			})
		]
	});
}), k = c(function({ intent: n = "neutral", size: r = "small", onRemove: i, removeLabel: a, className: s, children: c, ...l }, u) {
	let d = e();
	return /* @__PURE__ */ _("span", {
		...l,
		ref: u,
		className: o("mtc-tag", s),
		"data-intent": n,
		"data-size": r,
		children: [/* @__PURE__ */ g("span", { children: c }), i && /* @__PURE__ */ g("button", {
			type: "button",
			onClick: i,
			"aria-label": a ?? d("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ g(t, { name: "close" })
		})]
	});
}), A = c(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...a }, s) {
	return /* @__PURE__ */ _("span", {
		...a,
		ref: s,
		className: o("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ g("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), i]
	});
}), j = c(function({ title: e, intent: n = "info", icon: r, actions: i, className: a, children: s, role: c, ...l }, u) {
	let d = n === "danger" ? "error" : n === "warning" ? "warning" : n === "success" ? "success" : "info";
	return /* @__PURE__ */ _("div", {
		...l,
		ref: u,
		role: c ?? (n === "danger" ? "alert" : "status"),
		className: o("mtc-callout", a),
		"data-intent": n,
		children: [/* @__PURE__ */ g("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: r ?? /* @__PURE__ */ g(t, { name: d })
		}), /* @__PURE__ */ _("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ g("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ g("div", {
					className: "mtc-callout-body",
					children: s
				}),
				i && /* @__PURE__ */ g("div", {
					className: "mtc-callout-actions",
					children: i
				})
			]
		})]
	});
});
//#endregion
//#region src/components/Overlays.tsx
function M({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let c = d(), [l, u] = a({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ g(h, { children: t });
	let f = t, p = [f.props["aria-describedby"], l ? c : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ _("span", {
		className: o("mtc-tooltip-trigger", i),
		children: [s(f, {
			"aria-describedby": p,
			onMouseEnter: (e) => {
				f.props.onMouseEnter?.(e), u(!0);
			},
			onMouseLeave: (e) => {
				f.props.onMouseLeave?.(e), u(!1);
			},
			onFocus: (e) => {
				f.props.onFocus?.(e), u(!0);
			},
			onBlur: (e) => {
				f.props.onBlur?.(e), u(!1);
			},
			onKeyDown: (e) => {
				f.props.onKeyDown?.(e), e.key === "Escape" && l && (e.stopPropagation(), u(!1));
			}
		}), l && /* @__PURE__ */ g("span", {
			id: c,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function N({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: s = !1, onOpenChange: c, placement: l = "bottom-start", disabled: u, className: f }) {
	let m = d(), h = d(), v = p(null), y = p(null), [b, x] = a({
		value: i,
		defaultValue: s,
		onChange: c
	});
	return z(b, v, () => {
		x(!1), y.current?.focus();
	}), /* @__PURE__ */ _("div", {
		ref: v,
		className: o("mtc-popover-root", f),
		children: [/* @__PURE__ */ g("button", {
			ref: y,
			type: "button",
			className: "mtc-popover-trigger",
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": b,
			"aria-controls": b ? m : void 0,
			disabled: u,
			onClick: () => x(!b),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !b && (e.preventDefault(), x(!0));
			},
			children: e
		}), b && /* @__PURE__ */ _("div", {
			id: m,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? h : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": l,
			children: [r && /* @__PURE__ */ g("div", {
				id: h,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function P({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: s, align: c = "start", disabled: l, className: u }) {
	let d = p(null), f = p(null), [m, h] = a({
		value: void 0,
		defaultValue: 0
	}), [v, y] = a({
		value: r,
		defaultValue: i,
		onChange: s
	}), b = (e = !0) => {
		y(!1), e && f.current?.focus();
	};
	return z(v, d, () => b(!1)), /* @__PURE__ */ _("div", {
		ref: d,
		className: o("mtc-menu-root", u),
		children: [/* @__PURE__ */ g("button", {
			ref: f,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": v,
			disabled: l,
			onClick: () => {
				h(B(n, 1)), y(!v);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), h(B(n, e.key === "ArrowDown" ? 1 : -1)), y(!0));
			},
			children: t
		}), v && /* @__PURE__ */ g(I, {
			label: e,
			items: n,
			initialIndex: m,
			align: c,
			onClose: b
		})]
	});
}
var F = c(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: s, onKeyDown: c, ...l }, u) {
	let d = p(null), f = p({
		x: 0,
		y: 0
	}), [m, h] = a({
		value: void 0,
		defaultValue: !1
	}), [v, y] = a({
		value: void 0,
		defaultValue: 0
	}), b = (e) => {
		d.current = e, typeof u == "function" ? u(e) : u && (u.current = e);
	};
	z(m, d, () => h(!1));
	let x = (e, n) => {
		f.current = {
			x: e,
			y: n
		}, y(B(t, 1)), h(!0);
	};
	return /* @__PURE__ */ _("div", {
		...l,
		ref: b,
		className: o("mtc-context-menu-region", r),
		tabIndex: i,
		"aria-label": e,
		onContextMenu: (e) => {
			s?.(e), !e.defaultPrevented && (e.preventDefault(), x(e.clientX, e.clientY));
		},
		onKeyDown: (e) => {
			if (c?.(e), !e.defaultPrevented && (e.key === "ContextMenu" || e.shiftKey && e.key === "F10")) {
				e.preventDefault();
				let t = e.currentTarget.getBoundingClientRect();
				x(t.left + 12, t.top + 12);
			}
		},
		children: [n, m && /* @__PURE__ */ g(I, {
			label: e,
			items: t,
			initialIndex: v,
			style: {
				position: "fixed",
				left: f.current.x,
				top: f.current.y
			},
			onClose: () => {
				h(!1), d.current?.focus();
			}
		})]
	});
});
function I({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = p(null);
	u(() => {
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
	return /* @__PURE__ */ g("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ g("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ _("button", {
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
				e.icon && /* @__PURE__ */ g("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ g("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ g("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var L = c(function({ open: a, onOpenChange: s, title: c, description: l, children: u, footer: f, size: m = "medium", dismissible: h = !0, initialFocusRef: v, className: y }, b) {
	let x = e(), S = d(), C = d(), w = p(null);
	return r(a, w, v), a ? /* @__PURE__ */ g("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			h && e.target === e.currentTarget && s(!1);
		},
		children: /* @__PURE__ */ _("div", {
			ref: (e) => {
				w.current = e, typeof b == "function" ? b(e) : b && (b.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": S,
			"aria-describedby": l ? C : void 0,
			tabIndex: -1,
			className: o("mtc-dialog", y),
			"data-size": m,
			onKeyDown: (e) => i(e, w, h, () => s(!1)),
			children: [
				/* @__PURE__ */ _("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ _("div", { children: [/* @__PURE__ */ g("h2", {
						id: S,
						className: "mtc-modal-title",
						children: c
					}), l && /* @__PURE__ */ g("p", {
						id: C,
						className: "mtc-modal-description",
						children: l
					})] }), h && /* @__PURE__ */ g(n, {
						icon: /* @__PURE__ */ g(t, { name: "close" }),
						"aria-label": x("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => s(!1)
					})]
				}),
				/* @__PURE__ */ g("div", {
					className: "mtc-modal-body",
					children: u
				}),
				f && /* @__PURE__ */ g("div", {
					className: "mtc-modal-footer",
					children: f
				})
			]
		})
	}) : null;
}), R = c(function({ open: a, onOpenChange: s, title: c, description: l, children: u, footer: f, side: m = "right", width: h = 420, dismissible: v = !0, initialFocusRef: y, className: b }, x) {
	let S = e(), C = d(), w = d(), T = p(null);
	return r(a, T, y), a ? /* @__PURE__ */ g("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			v && e.target === e.currentTarget && s(!1);
		},
		children: /* @__PURE__ */ _("div", {
			ref: (e) => {
				T.current = e, typeof x == "function" ? x(e) : x && (x.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": C,
			"aria-describedby": l ? w : void 0,
			tabIndex: -1,
			className: o("mtc-drawer", b),
			"data-side": m,
			style: { width: h },
			onKeyDown: (e) => i(e, T, v, () => s(!1)),
			children: [
				/* @__PURE__ */ _("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ _("div", { children: [/* @__PURE__ */ g("h2", {
						id: C,
						className: "mtc-modal-title",
						children: c
					}), l && /* @__PURE__ */ g("p", {
						id: w,
						className: "mtc-modal-description",
						children: l
					})] }), v && /* @__PURE__ */ g(n, {
						icon: /* @__PURE__ */ g(t, { name: "close" }),
						"aria-label": S("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => s(!1)
					})]
				}),
				/* @__PURE__ */ g("div", {
					className: "mtc-modal-body",
					children: u
				}),
				f && /* @__PURE__ */ g("div", {
					className: "mtc-modal-footer",
					children: f
				})
			]
		})
	}) : null;
});
function z(e, t, n) {
	u(() => {
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
//#region src/components/Navigation.tsx
var H = c(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: s, keepMounted: c = !1, className: l, ...u }, f) {
	let m = d(), h = p(/* @__PURE__ */ new Map()), v = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), y = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let o = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		o && (h.current.get(o.id)?.focus(), a === "automatic" && n(o.id));
	}, b = (t, r) => {
		let o = i === "horizontal" ? "ArrowLeft" : "ArrowUp", s = i === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === o || t.key === s) t.preventDefault(), y(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (h.current.get(i.id)?.focus(), a === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && a === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ _("div", {
		...u,
		ref: f,
		className: o("mtc-tabs", s && `mtc-density-${s}`, l),
		"data-orientation": i,
		children: [/* @__PURE__ */ g("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === v?.id, r = `${m}-tab-${e.id}`, i = `${m}-panel-${e.id}`;
				return /* @__PURE__ */ _("button", {
					ref: (t) => {
						t ? h.current.set(e.id, t) : h.current.delete(e.id);
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
					onKeyDown: (t) => b(t, e),
					children: [/* @__PURE__ */ g("span", { children: e.label }), e.count != null && /* @__PURE__ */ g("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ g("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === v?.id;
				return !t && !c ? null : /* @__PURE__ */ g("div", {
					role: "tabpanel",
					id: `${m}-panel-${e.id}`,
					"aria-labelledby": `${m}-tab-${e.id}`,
					tabIndex: 0,
					hidden: !t,
					className: "mtc-tab-panel",
					children: e.panel
				}, e.id);
			})
		})]
	});
}), U = c(function({ items: n, label: r, maxItems: i, className: a, ...s }, c) {
	let l = e(), u = W(n, i);
	return /* @__PURE__ */ g("nav", {
		...s,
		ref: c,
		"aria-label": r ?? l("breadcrumbs.label"),
		className: o("mtc-breadcrumbs", a),
		children: /* @__PURE__ */ g("ol", { children: u.map((e, n) => {
			let r = n === u.length - 1;
			return /* @__PURE__ */ _("li", { children: [n > 0 && /* @__PURE__ */ g(t, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), r ? /* @__PURE__ */ g("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ g("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ g("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ g("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${n}`);
		}) })
	});
});
function W(e, t) {
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
var G = c(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ g("div", {
		...i,
		ref: a,
		className: o("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), K = c(function({ label: t, start: n, end: r, density: i, sticky: a, className: s, children: c, ...l }, u) {
	let d = e();
	return /* @__PURE__ */ _("div", {
		...l,
		ref: u,
		role: "toolbar",
		"aria-label": t ?? d("toolbar.label"),
		className: o("mtc-app-toolbar", i && `mtc-density-${i}`, s),
		"data-sticky": a || void 0,
		children: [
			n && /* @__PURE__ */ g("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: n
			}),
			/* @__PURE__ */ g("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: c
			}),
			r && /* @__PURE__ */ g("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), q = c(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: s, children: c, style: l, ...u }, d) {
	let f = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...l
	};
	return /* @__PURE__ */ _("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: o("mtc-sidebar", s),
		"data-collapsed": i,
		"data-side": a,
		style: f,
		children: [
			t && /* @__PURE__ */ g("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ g("div", {
				className: "mtc-sidebar-content",
				children: c
			}),
			n && /* @__PURE__ */ g("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), J = c(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: s = !0, className: c, children: l, style: u, ...d }, f) {
	let p = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...u
	};
	return /* @__PURE__ */ _("aside", {
		...d,
		ref: f,
		"aria-label": e,
		"aria-hidden": !s || void 0,
		className: o("mtc-inspector", c),
		"data-open": s,
		style: p,
		children: [
			(t || r) && /* @__PURE__ */ _("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ _("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ g("h2", { children: t }), n && /* @__PURE__ */ g("p", { children: n })]
				}), r && /* @__PURE__ */ g("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ g("div", {
				className: "mtc-inspector-content",
				children: l
			}),
			i && /* @__PURE__ */ g("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), ee = c(function({ primary: t, secondary: n, orientation: r = "horizontal", primaryPane: i = "start", size: s, defaultSize: c = 30, onSizeChange: l, minSize: u = 15, maxSize: d = 85, step: f = 5, disabled: m, stackOnNarrow: h = !0, separatorLabel: v, className: y, style: b, ...x }, S) {
	let C = e(), w = p(null), T = p(!1), [E, D] = a({
		value: s,
		defaultValue: c,
		onChange: l
	}), O = Math.min(u, d), k = Math.max(u, d), A = Number.isFinite(f) && f !== 0 ? Math.abs(f) : 1, j = Y(E, O, k), M = (e) => {
		w.current = e, typeof S == "function" ? S(e) : S && (S.current = e);
	}, N = (e) => {
		if (!T.current || !w.current || m) return;
		let t = w.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		D(Y(a, O, k));
	}, P = (e) => D(Y(j + e, O, k)), F = i === "start" ? j : 100 - j, I = 100 - F;
	return /* @__PURE__ */ _("div", {
		...x,
		ref: M,
		className: o("mtc-split-pane", y),
		"data-orientation": r,
		"data-stack-narrow": h,
		style: {
			"--mtc-split-start": `${F}fr`,
			"--mtc-split-end": `${I}fr`,
			...b
		},
		children: [
			/* @__PURE__ */ g("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? t : n
			}),
			/* @__PURE__ */ g("div", {
				role: "separator",
				"aria-label": v ?? C("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": O,
				"aria-valuemax": k,
				"aria-valuenow": Math.round(j),
				"aria-disabled": m || void 0,
				tabIndex: m ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					m || (T.current = !0, e.currentTarget.setPointerCapture(e.pointerId), N(e));
				},
				onPointerMove: N,
				onPointerUp: (e) => {
					T.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					T.current = !1;
				},
				onKeyDown: (e) => {
					if (m) return;
					let t = r === "horizontal" ? "ArrowLeft" : "ArrowUp", n = r === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === n) {
						e.preventDefault();
						let t = e.key === n ? A : -A;
						P(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), D(O)) : e.key === "End" && (e.preventDefault(), D(k));
				},
				children: /* @__PURE__ */ g("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ g("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? n : t
			})
		]
	});
});
function Y(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var te = c(function({ items: n, label: r, selectedId: i, onSelectionChange: a, expandedIds: s, onExpandedChange: c, density: l, className: d, ...h }, v) {
	let y = f(() => X(n, s), [n, s]), b = e(), x = p(/* @__PURE__ */ new Map()), [S, C] = m(i ?? y.find((e) => !e.item.disabled)?.item.id);
	u(() => {
		S && y.some((e) => e.item.id === S && !e.item.disabled) || C(i ?? y.find((e) => !e.item.disabled)?.item.id);
	}, [
		S,
		i,
		y
	]);
	let w = (e) => {
		e && (C(e), x.current.get(e)?.focus());
	}, T = (e, t) => {
		let n = new Set(s);
		t ? n.add(e) : n.delete(e), c(n);
	}, E = y.filter((e) => !e.item.disabled), D = (e, t) => {
		let n = E.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, i = s.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = E[Math.min(E.length - 1, Math.max(0, n + t))];
			w(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !i ? T(t.item.id, !0) : r && w(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && i ? T(t.item.id, !1) : w(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? E[0] : E[E.length - 1];
			w(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), a?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(s);
			for (let e of y.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			c(n);
		}
	};
	return /* @__PURE__ */ g("div", {
		...h,
		ref: v,
		role: "tree",
		"aria-label": r,
		"aria-multiselectable": !1,
		className: o("mtc-tree", l && `mtc-density-${l}`, d),
		children: y.map((e) => {
			let { item: n } = e, r = !!n.children?.length, o = s.has(n.id), c = i === n.id;
			return /* @__PURE__ */ _("div", {
				ref: (e) => {
					e ? x.current.set(n.id, e) : x.current.delete(n.id);
				},
				role: "treeitem",
				"aria-level": e.level,
				"aria-posinset": e.position,
				"aria-setsize": e.setSize,
				"aria-expanded": r ? o : void 0,
				"aria-selected": c,
				"aria-disabled": n.disabled || void 0,
				tabIndex: !n.disabled && S === n.id ? 0 : -1,
				className: "mtc-tree-item",
				"data-selected": c,
				"data-disabled": n.disabled || void 0,
				style: { "--mtc-tree-level": e.level },
				onFocus: () => C(n.id),
				onClick: () => {
					n.disabled || a?.(n.id);
				},
				onDoubleClick: () => {
					!n.disabled && r && T(n.id, !o);
				},
				onKeyDown: (t) => D(t, e),
				children: [
					/* @__PURE__ */ g("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": r ? b(o ? "tree.collapse" : "tree.expand", { label: ne(n.label) }) : void 0,
						"aria-hidden": !r || void 0,
						disabled: !r || n.disabled,
						onClick: (e) => {
							e.stopPropagation(), r && T(n.id, !o);
						},
						children: r && /* @__PURE__ */ g(t, { name: "chevron-right" })
					}),
					n.icon && /* @__PURE__ */ g("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: n.icon
					}),
					/* @__PURE__ */ _("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ g("span", {
							className: "mtc-tree-label",
							children: n.label
						}), n.description && /* @__PURE__ */ g("span", {
							className: "mtc-tree-description",
							children: n.description
						})]
					})
				]
			}, n.id);
		})
	});
});
function X(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...X(o.children, t, n + 1, o.id, i)));
	}), a;
}
function ne(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/workbench/PropertyList.tsx
var re = c(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, s) {
	let c = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ g("dl", {
		...a,
		ref: s,
		className: o("mtc-property-list", n && `mtc-density-${n}`, i),
		children: c.map((e, t) => /* @__PURE__ */ _("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ _("dt", { children: [/* @__PURE__ */ g("span", { children: e.label }), e.description && /* @__PURE__ */ g("small", { children: e.description })] }), /* @__PURE__ */ g("dd", { children: ie(e.value, r) })]
		}, e.id ?? t))
	});
}), Z = 5e3;
function Q(e) {
	return typeof e == "string" || typeof e == "number" || typeof e == "bigint" || typeof e == "boolean";
}
function $(e) {
	return typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function ie(e, t) {
	if (e == null || e === "") return t;
	if (l(e)) return e;
	if (Q(e)) return $(e);
	if (Array.isArray(e) && e.every(Q)) {
		if (e.length === 0) return t;
		let n = e.map($).join(", ");
		return n.length > Z ? `${n.slice(0, Z)}…` : n;
	}
	try {
		let t = JSON.stringify(e);
		return typeof t == "string" ? /* @__PURE__ */ g("code", { children: t.length > Z ? `${t.slice(0, Z)}…` : t }) : String(e);
	} catch {
		return String(e);
	}
}
//#endregion
export { E as C, x as D, v as E, y as O, S, C as T, j as _, J as a, O as b, U as c, L as d, R as f, A as g, M as h, G as i, H as l, N as m, te as n, q as o, P as p, ee as r, K as s, re as t, F as u, k as v, D as w, w as x, T as y };
