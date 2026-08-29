import { o as e, s as t } from "./States-BSRKPrE1.js";
import { i as n, n as r, r as i, t as a } from "./utils-B2QVXvLO.js";
import { cloneElement as o, forwardRef as s, isValidElement as c, useEffect as l, useId as u, useMemo as d, useRef as f, useState as p } from "react";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
//#region src/foundations/DesignSystemProvider.tsx
var _ = s(function({ theme: e = "dark", density: t = "comfortable", className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ h("div", {
		...i,
		ref: a,
		className: [
			"mtc-root",
			"mtc-design-system",
			`mtc-theme-${e}`,
			n
		].filter(Boolean).join(" "),
		"data-theme": e,
		"data-density": t,
		children: r
	});
}), v = s(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, o) {
	return /* @__PURE__ */ h("input", {
		...i,
		ref: o,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: a("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), y = s(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, o) {
	return /* @__PURE__ */ h("textarea", {
		...i,
		ref: o,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: a("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function b({ label: e, children: t, id: n, description: r, error: i, required: s, className: l }) {
	let d = u(), f = (c(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${d}`, p = r ? `${f}-description` : void 0, m = i ? `${f}-error` : void 0, _ = [
		c(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		p,
		m
	].filter(Boolean).join(" ") || void 0, v = (c(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? s, y = c(t) ? o(t, {
		id: f,
		"aria-describedby": _,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: v
	}) : t;
	return /* @__PURE__ */ g("div", {
		className: a("mtc-form-field", l),
		children: [
			/* @__PURE__ */ g("label", {
				className: "mtc-form-label",
				htmlFor: f,
				children: [e, v && /* @__PURE__ */ h("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			y,
			r && /* @__PURE__ */ h("div", {
				id: p,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ h("div", {
				id: m,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var x = s(function({ label: e, description: n, density: r, className: i, ...o }, s) {
	return /* @__PURE__ */ g("label", {
		className: a("mtc-choice", r && `mtc-density-${r}`, i),
		children: [
			/* @__PURE__ */ h("input", {
				...o,
				ref: s,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ h("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h(t, { name: "check" })
			}),
			/* @__PURE__ */ g("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ h("span", {
					className: "mtc-choice-label",
					children: e
				}), n && /* @__PURE__ */ h("span", {
					className: "mtc-choice-description",
					children: n
				})]
			})
		]
	});
}), S = s(function({ label: e, description: t, density: n, className: r, ...i }, o) {
	return /* @__PURE__ */ g("label", {
		className: a("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ h("input", {
				...i,
				ref: o,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ h("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ g("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ h("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ h("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), C = s(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: o, ...s }, c) {
	return /* @__PURE__ */ g("label", {
		className: a("mtc-switch", i && `mtc-density-${i}`, o),
		children: [
			/* @__PURE__ */ h("input", {
				...s,
				ref: c,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ h("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ h("span", {})
			}),
			/* @__PURE__ */ g("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ h("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ h("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), w = s(function({ value: e, onValueChange: n, options: r, placeholder: i = "Select…", disabled: o, required: s, name: c, id: m, "aria-label": _, "aria-labelledby": v, "aria-describedby": y, "aria-invalid": b, invalid: x, size: S = "medium", density: C, className: w, emptyMessage: T = "No matching options" }, E) {
	let D = u(), O = m ?? `mtc-combobox-${D}`, k = `${O}-listbox`, A = f(null), j = f(null), M = r.find((t) => t.value === e), [N, P] = p(M?.label ?? ""), [F, I] = p(!1), [L, R] = p(-1), z = d(() => {
		let e = N.trim().toLocaleLowerCase();
		return !e || M?.label === N ? [...r] : r.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		r,
		N,
		M?.label
	]);
	l(() => {
		F || P(M?.label ?? "");
	}, [F, M?.label]), l(() => {
		j.current?.setCustomValidity(s && !M ? "Please select an option." : "");
	}, [s, M]), l(() => {
		if (!F || typeof document > "u") return;
		let e = (e) => {
			A.current?.contains(e.target) || I(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [F]);
	let B = (e, t) => {
		if (z.length === 0) return -1;
		let n = e;
		for (let e = 0; e < z.length; e++) if (n = (n + t + z.length) % z.length, !z[n]?.disabled) return n;
		return -1;
	}, V = (e) => {
		e.disabled || (n(e.value), P(e.label), I(!1), R(-1));
	};
	return /* @__PURE__ */ g("div", {
		ref: A,
		className: a("mtc-combobox", C && `mtc-density-${C}`, w),
		"data-size": S,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || I(!1);
		},
		children: [
			c && /* @__PURE__ */ h("input", {
				type: "hidden",
				name: c,
				value: e ?? ""
			}),
			/* @__PURE__ */ h("input", {
				ref: (e) => {
					j.current = e, typeof E == "function" ? E(e) : E && (E.current = e);
				},
				id: O,
				value: N,
				disabled: o,
				required: s,
				placeholder: i,
				role: "combobox",
				"aria-label": _,
				"aria-labelledby": v,
				"aria-describedby": y,
				"aria-invalid": x || b || void 0,
				"aria-required": s || void 0,
				"aria-expanded": F,
				"aria-controls": F ? k : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": F && L >= 0 ? `${O}-option-${L}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					I(!0), R(z.findIndex((t) => t.value === e && !t.disabled));
				},
				onChange: (e) => {
					P(e.currentTarget.value), I(!0), R(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), I(!0), R((e) => B(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), I(!0), R((e) => B(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && F) e.preventDefault(), R(B(-1, 1));
					else if (e.key === "End" && F) e.preventDefault(), R(B(0, -1));
					else if (e.key === "Enter" && F && L >= 0) {
						e.preventDefault();
						let t = z[L];
						t && V(t);
					} else e.key === "Escape" && F ? (e.preventDefault(), e.stopPropagation(), I(!1), P(M?.label ?? "")) : e.key === "Tab" && I(!1);
				}
			}),
			/* @__PURE__ */ h(t, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			F && !o && /* @__PURE__ */ h("div", {
				id: k,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: z.length === 0 ? /* @__PURE__ */ h("div", {
					className: "mtc-combobox-empty",
					children: T
				}) : z.map((n, r) => /* @__PURE__ */ g("div", {
					id: `${O}-option-${r}`,
					role: "option",
					"aria-selected": n.value === e,
					"aria-disabled": n.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": L === r,
					"data-selected": n.value === e,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						n.disabled || R(r);
					},
					onClick: () => V(n),
					children: [/* @__PURE__ */ g("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ h("span", { children: n.label }), n.description && /* @__PURE__ */ h("small", { children: n.description })]
					}), n.value === e && /* @__PURE__ */ h(t, { name: "check" })]
				}, n.value))
			})
		]
	});
}), T = s(function({ intent: e = "neutral", size: n = "small", onRemove: r, removeLabel: i = "Remove", className: o, children: s, ...c }, l) {
	return /* @__PURE__ */ g("span", {
		...c,
		ref: l,
		className: a("mtc-tag", o),
		"data-intent": e,
		"data-size": n,
		children: [/* @__PURE__ */ h("span", { children: s }), r && /* @__PURE__ */ h("button", {
			type: "button",
			onClick: r,
			"aria-label": i,
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ h(t, { name: "close" })
		})]
	});
}), E = s(function({ intent: e = "neutral", size: t = "small", dot: n, className: r, children: i, ...o }, s) {
	return /* @__PURE__ */ g("span", {
		...o,
		ref: s,
		className: a("mtc-badge", r),
		"data-intent": e,
		"data-size": t,
		children: [n && /* @__PURE__ */ h("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), i]
	});
}), D = s(function({ title: e, intent: n = "info", icon: r, actions: i, className: o, children: s, role: c, ...l }, u) {
	let d = n === "danger" ? "error" : n === "warning" ? "warning" : n === "success" ? "success" : "info";
	return /* @__PURE__ */ g("div", {
		...l,
		ref: u,
		role: c ?? (n === "danger" ? "alert" : "status"),
		className: a("mtc-callout", o),
		"data-intent": n,
		children: [/* @__PURE__ */ h("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: r ?? /* @__PURE__ */ h(t, { name: d })
		}), /* @__PURE__ */ g("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ h("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ h("div", {
					className: "mtc-callout-body",
					children: s
				}),
				i && /* @__PURE__ */ h("div", {
					className: "mtc-callout-actions",
					children: i
				})
			]
		})]
	});
});
//#endregion
//#region src/components/Overlays.tsx
function O({ content: e, children: t, placement: n = "top", disabled: r, className: s }) {
	let c = u(), [l, d] = i({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ h(m, { children: t });
	let f = t, p = [f.props["aria-describedby"], l ? c : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ g("span", {
		className: a("mtc-tooltip-trigger", s),
		children: [o(f, {
			"aria-describedby": p,
			onMouseEnter: (e) => {
				f.props.onMouseEnter?.(e), d(!0);
			},
			onMouseLeave: (e) => {
				f.props.onMouseLeave?.(e), d(!1);
			},
			onFocus: (e) => {
				f.props.onFocus?.(e), d(!0);
			},
			onBlur: (e) => {
				f.props.onBlur?.(e), d(!1);
			},
			onKeyDown: (e) => {
				f.props.onKeyDown?.(e), e.key === "Escape" && l && (e.stopPropagation(), d(!1));
			}
		}), l && /* @__PURE__ */ h("span", {
			id: c,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function k({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: o, defaultOpen: s = !1, onOpenChange: c, placement: l = "bottom-start", disabled: d, className: p }) {
	let m = u(), _ = u(), v = f(null), y = f(null), [b, x] = i({
		value: o,
		defaultValue: s,
		onChange: c
	});
	return F(b, v, () => {
		x(!1), y.current?.focus();
	}), /* @__PURE__ */ g("div", {
		ref: v,
		className: a("mtc-popover-root", p),
		children: [/* @__PURE__ */ h("button", {
			ref: y,
			type: "button",
			className: "mtc-popover-trigger",
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": b,
			"aria-controls": b ? m : void 0,
			disabled: d,
			onClick: () => x(!b),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !b && (e.preventDefault(), x(!0));
			},
			children: e
		}), b && /* @__PURE__ */ g("div", {
			id: m,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? _ : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": l,
			children: [r && /* @__PURE__ */ h("div", {
				id: _,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function A({ label: e, trigger: t, items: n, open: r, defaultOpen: o = !1, onOpenChange: s, align: c = "start", disabled: l, className: u }) {
	let d = f(null), p = f(null), [m, _] = i({
		value: void 0,
		defaultValue: 0
	}), [v, y] = i({
		value: r,
		defaultValue: o,
		onChange: s
	}), b = (e = !0) => {
		y(!1), e && p.current?.focus();
	};
	return F(v, d, () => b(!1)), /* @__PURE__ */ g("div", {
		ref: d,
		className: a("mtc-menu-root", u),
		children: [/* @__PURE__ */ h("button", {
			ref: p,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": v,
			disabled: l,
			onClick: () => {
				_(I(n, 1)), y(!v);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), _(I(n, e.key === "ArrowDown" ? 1 : -1)), y(!0));
			},
			children: t
		}), v && /* @__PURE__ */ h(M, {
			label: e,
			items: n,
			initialIndex: m,
			align: c,
			onClose: b
		})]
	});
}
var j = s(function({ label: e, items: t, children: n, className: r, tabIndex: o = 0, onContextMenu: s, onKeyDown: c, ...l }, u) {
	let d = f(null), p = f({
		x: 0,
		y: 0
	}), [m, _] = i({
		value: void 0,
		defaultValue: !1
	}), [v, y] = i({
		value: void 0,
		defaultValue: 0
	}), b = (e) => {
		d.current = e, typeof u == "function" ? u(e) : u && (u.current = e);
	};
	F(m, d, () => _(!1));
	let x = (e, n) => {
		p.current = {
			x: e,
			y: n
		}, y(I(t, 1)), _(!0);
	};
	return /* @__PURE__ */ g("div", {
		...l,
		ref: b,
		className: a("mtc-context-menu-region", r),
		tabIndex: o,
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
		children: [n, m && /* @__PURE__ */ h(M, {
			label: e,
			items: t,
			initialIndex: v,
			style: {
				position: "fixed",
				left: p.current.x,
				top: p.current.y
			},
			onClose: () => {
				_(!1), d.current?.focus();
			}
		})]
	});
});
function M({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = f(null);
	l(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = L(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ h("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ h("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ g("button", {
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
				e.icon && /* @__PURE__ */ h("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ h("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ h("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var N = s(function({ open: i, onOpenChange: o, title: s, description: c, children: l, footer: d, size: p = "medium", dismissible: m = !0, initialFocusRef: _, className: v }, y) {
	let b = u(), x = u(), S = f(null);
	return n(i, S, _), i ? /* @__PURE__ */ h("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			m && e.target === e.currentTarget && o(!1);
		},
		children: /* @__PURE__ */ g("div", {
			ref: (e) => {
				S.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": b,
			"aria-describedby": c ? x : void 0,
			tabIndex: -1,
			className: a("mtc-dialog", v),
			"data-size": p,
			onKeyDown: (e) => r(e, S, m, () => o(!1)),
			children: [
				/* @__PURE__ */ g("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ g("div", { children: [/* @__PURE__ */ h("h2", {
						id: b,
						className: "mtc-modal-title",
						children: s
					}), c && /* @__PURE__ */ h("p", {
						id: x,
						className: "mtc-modal-description",
						children: c
					})] }), m && /* @__PURE__ */ h(e, {
						icon: /* @__PURE__ */ h(t, { name: "close" }),
						"aria-label": "Close dialog",
						variant: "ghost",
						size: "small",
						onClick: () => o(!1)
					})]
				}),
				/* @__PURE__ */ h("div", {
					className: "mtc-modal-body",
					children: l
				}),
				d && /* @__PURE__ */ h("div", {
					className: "mtc-modal-footer",
					children: d
				})
			]
		})
	}) : null;
}), P = s(function({ open: i, onOpenChange: o, title: s, description: c, children: l, footer: d, side: p = "right", width: m = 420, dismissible: _ = !0, initialFocusRef: v, className: y }, b) {
	let x = u(), S = u(), C = f(null);
	return n(i, C, v), i ? /* @__PURE__ */ h("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			_ && e.target === e.currentTarget && o(!1);
		},
		children: /* @__PURE__ */ g("div", {
			ref: (e) => {
				C.current = e, typeof b == "function" ? b(e) : b && (b.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": x,
			"aria-describedby": c ? S : void 0,
			tabIndex: -1,
			className: a("mtc-drawer", y),
			"data-side": p,
			style: { width: m },
			onKeyDown: (e) => r(e, C, _, () => o(!1)),
			children: [
				/* @__PURE__ */ g("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ g("div", { children: [/* @__PURE__ */ h("h2", {
						id: x,
						className: "mtc-modal-title",
						children: s
					}), c && /* @__PURE__ */ h("p", {
						id: S,
						className: "mtc-modal-description",
						children: c
					})] }), _ && /* @__PURE__ */ h(e, {
						icon: /* @__PURE__ */ h(t, { name: "close" }),
						"aria-label": "Close drawer",
						variant: "ghost",
						size: "small",
						onClick: () => o(!1)
					})]
				}),
				/* @__PURE__ */ h("div", {
					className: "mtc-modal-body",
					children: l
				}),
				d && /* @__PURE__ */ h("div", {
					className: "mtc-modal-footer",
					children: d
				})
			]
		})
	}) : null;
});
function F(e, t, n) {
	l(() => {
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
function I(e, t) {
	return L(e, t === 1 ? -1 : 0, t);
}
function L(e, t, n) {
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
var R = s(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: o = "automatic", density: s, keepMounted: c = !1, className: l, ...d }, p) {
	let m = u(), _ = f(/* @__PURE__ */ new Map()), v = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), y = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let a = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		a && (_.current.get(a.id)?.focus(), o === "automatic" && n(a.id));
	}, b = (t, r) => {
		let a = i === "horizontal" ? "ArrowLeft" : "ArrowUp", s = i === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === a || t.key === s) t.preventDefault(), y(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (_.current.get(i.id)?.focus(), o === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && o === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ g("div", {
		...d,
		ref: p,
		className: a("mtc-tabs", s && `mtc-density-${s}`, l),
		"data-orientation": i,
		children: [/* @__PURE__ */ h("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === v?.id, r = `${m}-tab-${e.id}`, i = `${m}-panel-${e.id}`;
				return /* @__PURE__ */ h("button", {
					ref: (t) => {
						t ? _.current.set(e.id, t) : _.current.delete(e.id);
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
					children: e.label
				}, e.id);
			})
		}), /* @__PURE__ */ h("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === v?.id;
				return !t && !c ? null : /* @__PURE__ */ h("div", {
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
}), z = s(function({ items: e, label: n = "Breadcrumbs", maxItems: r, className: i, ...o }, s) {
	let c = B(e, r);
	return /* @__PURE__ */ h("nav", {
		...o,
		ref: s,
		"aria-label": n,
		className: a("mtc-breadcrumbs", i),
		children: /* @__PURE__ */ h("ol", { children: c.map((e, n) => {
			let r = n === c.length - 1;
			return /* @__PURE__ */ g("li", { children: [n > 0 && /* @__PURE__ */ h(t, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), r ? /* @__PURE__ */ h("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: e.label
			}) : e.href ? /* @__PURE__ */ h("a", {
				href: e.href,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : e.onSelect ? /* @__PURE__ */ h("button", {
				type: "button",
				onClick: e.onSelect,
				className: "mtc-breadcrumb-action",
				children: e.label
			}) : /* @__PURE__ */ h("span", {
				className: "mtc-breadcrumb-muted",
				children: e.label
			})] }, `${e.id ?? "item"}:${n}`);
		}) })
	});
});
function B(e, t) {
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
var V = s(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, o) {
	return /* @__PURE__ */ h("div", {
		...i,
		ref: o,
		className: a("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), H = s(function({ label: e = "Toolbar", start: t, end: n, density: r, sticky: i, className: o, children: s, ...c }, l) {
	return /* @__PURE__ */ g("div", {
		...c,
		ref: l,
		role: "toolbar",
		"aria-label": e,
		className: a("mtc-app-toolbar", r && `mtc-density-${r}`, o),
		"data-sticky": i || void 0,
		children: [
			t && /* @__PURE__ */ h("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: t
			}),
			/* @__PURE__ */ h("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			n && /* @__PURE__ */ h("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: n
			})
		]
	});
}), U = s(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: o = "left", className: s, children: c, style: l, ...u }, d) {
	let f = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...l
	};
	return /* @__PURE__ */ g("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: a("mtc-sidebar", s),
		"data-collapsed": i,
		"data-side": o,
		style: f,
		children: [
			t && /* @__PURE__ */ h("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ h("div", {
				className: "mtc-sidebar-content",
				children: c
			}),
			n && /* @__PURE__ */ h("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), W = s(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: o = 320, open: s = !0, className: c, children: l, style: u, ...d }, f) {
	let p = {
		"--mtc-inspector-width": typeof o == "number" ? `${o}px` : o,
		...u
	};
	return /* @__PURE__ */ g("aside", {
		...d,
		ref: f,
		"aria-label": e,
		"aria-hidden": !s || void 0,
		className: a("mtc-inspector", c),
		"data-open": s,
		style: p,
		children: [
			(t || r) && /* @__PURE__ */ g("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ g("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ h("h2", { children: t }), n && /* @__PURE__ */ h("p", { children: n })]
				}), r && /* @__PURE__ */ h("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ h("div", {
				className: "mtc-inspector-content",
				children: l
			}),
			i && /* @__PURE__ */ h("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), G = s(function({ primary: e, secondary: t, orientation: n = "horizontal", primaryPane: r = "start", size: o, defaultSize: s = 30, onSizeChange: c, minSize: l = 15, maxSize: u = 85, step: d = 5, disabled: p, stackOnNarrow: m = !0, separatorLabel: _ = "Resize panes", className: v, style: y, ...b }, x) {
	let S = f(null), C = f(!1), [w, T] = i({
		value: o,
		defaultValue: s,
		onChange: c
	}), E = Math.min(l, u), D = Math.max(l, u), O = Number.isFinite(d) && d !== 0 ? Math.abs(d) : 1, k = K(w, E, D), A = (e) => {
		S.current = e, typeof x == "function" ? x(e) : x && (x.current = e);
	}, j = (e) => {
		if (!C.current || !S.current || p) return;
		let t = S.current.getBoundingClientRect(), i = n === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = r === "start" ? i : 100 - i;
		T(K(a, E, D));
	}, M = (e) => T(K(k + e, E, D)), N = r === "start" ? k : 100 - k, P = 100 - N;
	return /* @__PURE__ */ g("div", {
		...b,
		ref: A,
		className: a("mtc-split-pane", v),
		"data-orientation": n,
		"data-stack-narrow": m,
		style: {
			"--mtc-split-start": `${N}fr`,
			"--mtc-split-end": `${P}fr`,
			...y
		},
		children: [
			/* @__PURE__ */ h("div", {
				className: "mtc-split-content mtc-split-start",
				children: r === "start" ? e : t
			}),
			/* @__PURE__ */ h("div", {
				role: "separator",
				"aria-label": _,
				"aria-orientation": n === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": E,
				"aria-valuemax": D,
				"aria-valuenow": Math.round(k),
				"aria-disabled": p || void 0,
				tabIndex: p ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					p || (C.current = !0, e.currentTarget.setPointerCapture(e.pointerId), j(e));
				},
				onPointerMove: j,
				onPointerUp: (e) => {
					C.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					C.current = !1;
				},
				onKeyDown: (e) => {
					if (p) return;
					let t = n === "horizontal" ? "ArrowLeft" : "ArrowUp", i = n === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === i) {
						e.preventDefault();
						let t = e.key === i ? O : -O;
						M(r === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), T(E)) : e.key === "End" && (e.preventDefault(), T(D));
				},
				children: /* @__PURE__ */ h("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ h("div", {
				className: "mtc-split-content mtc-split-end",
				children: r === "start" ? t : e
			})
		]
	});
});
function K(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var q = s(function({ items: e, label: n, selectedId: r, onSelectionChange: i, expandedIds: o, onExpandedChange: s, density: c, className: u, ...m }, _) {
	let v = d(() => J(e, o), [e, o]), y = f(/* @__PURE__ */ new Map()), [b, x] = p(r ?? v.find((e) => !e.item.disabled)?.item.id);
	l(() => {
		b && v.some((e) => e.item.id === b && !e.item.disabled) || x(r ?? v.find((e) => !e.item.disabled)?.item.id);
	}, [
		b,
		r,
		v
	]);
	let S = (e) => {
		e && (x(e), y.current.get(e)?.focus());
	}, C = (e, t) => {
		let n = new Set(o);
		t ? n.add(e) : n.delete(e), s(n);
	}, w = v.filter((e) => !e.item.disabled), T = (e, t) => {
		let n = w.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, a = o.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = w[Math.min(w.length - 1, Math.max(0, n + t))];
			S(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !a ? C(t.item.id, !0) : r && S(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && a ? C(t.item.id, !1) : S(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? w[0] : w[w.length - 1];
			S(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), i?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(o);
			for (let e of v.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			s(n);
		}
	};
	return /* @__PURE__ */ h("div", {
		...m,
		ref: _,
		role: "tree",
		"aria-label": n,
		"aria-multiselectable": !1,
		className: a("mtc-tree", c && `mtc-density-${c}`, u),
		children: v.map((e) => {
			let { item: n } = e, a = !!n.children?.length, s = o.has(n.id), c = r === n.id;
			return /* @__PURE__ */ g("div", {
				ref: (e) => {
					e ? y.current.set(n.id, e) : y.current.delete(n.id);
				},
				role: "treeitem",
				"aria-level": e.level,
				"aria-posinset": e.position,
				"aria-setsize": e.setSize,
				"aria-expanded": a ? s : void 0,
				"aria-selected": c,
				"aria-disabled": n.disabled || void 0,
				tabIndex: !n.disabled && b === n.id ? 0 : -1,
				className: "mtc-tree-item",
				"data-selected": c,
				"data-disabled": n.disabled || void 0,
				style: { "--mtc-tree-level": e.level },
				onFocus: () => x(n.id),
				onClick: () => {
					n.disabled || i?.(n.id);
				},
				onDoubleClick: () => {
					!n.disabled && a && C(n.id, !s);
				},
				onKeyDown: (t) => T(t, e),
				children: [
					/* @__PURE__ */ h("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": a ? `${s ? "Collapse" : "Expand"} ${Y(n.label)}` : void 0,
						"aria-hidden": !a || void 0,
						disabled: !a || n.disabled,
						onClick: (e) => {
							e.stopPropagation(), a && C(n.id, !s);
						},
						children: a && /* @__PURE__ */ h(t, { name: "chevron-right" })
					}),
					n.icon && /* @__PURE__ */ h("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: n.icon
					}),
					/* @__PURE__ */ g("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ h("span", {
							className: "mtc-tree-label",
							children: n.label
						}), n.description && /* @__PURE__ */ h("span", {
							className: "mtc-tree-description",
							children: n.description
						})]
					})
				]
			}, n.id);
		})
	});
});
function J(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		!o.id || i.has(o.id) || (i.add(o.id), a.push({
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
//#region src/workbench/PropertyList.tsx
var X = s(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...o }, s) {
	let c = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ h("dl", {
		...o,
		ref: s,
		className: a("mtc-property-list", n && `mtc-density-${n}`, i),
		children: c.map((e, t) => /* @__PURE__ */ g("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ g("dt", { children: [/* @__PURE__ */ h("span", { children: e.label }), e.description && /* @__PURE__ */ h("small", { children: e.description })] }), /* @__PURE__ */ h("dd", { children: Z(e.value, r) })]
		}, e.id ?? t))
	});
});
function Z(e, t) {
	if (e == null || e === "") return t;
	if (c(e)) return e;
	if (typeof e == "boolean") return e ? "Yes" : "No";
	if (typeof e == "string" || typeof e == "number" || typeof e == "bigint") return String(e);
	try {
		let t = JSON.stringify(e);
		return typeof t == "string" ? t.length > 5e3 ? `${t.slice(0, 5e3)}…` : t : String(e);
	} catch {
		return String(e);
	}
}
//#endregion
export { S as C, _ as E, v as S, y as T, D as _, W as a, w as b, z as c, N as d, P as f, E as g, O as h, V as i, R as l, k as m, q as n, U as o, A as p, G as r, H as s, X as t, j as u, T as v, C as w, b as x, x as y };
