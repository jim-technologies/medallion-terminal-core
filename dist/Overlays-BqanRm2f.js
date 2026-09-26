import { T as e, h as t, p as n } from "./States-BRpBuveA.js";
import { a as r, i, r as a, t as o } from "./utils-BfYGx7e_.js";
import { cloneElement as s, forwardRef as c, useEffect as l, useId as u, useRef as d } from "react";
import { Fragment as f, jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/components/Overlays.tsx
function h({ content: e, children: t, placement: n = "top", disabled: r, className: a }) {
	let c = u(), [l, d] = i({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ p(f, { children: t });
	let h = t, g = [h.props["aria-describedby"], l ? c : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ m("span", {
		className: o("mtc-tooltip-trigger", a),
		children: [s(h, {
			"aria-describedby": g,
			onMouseEnter: (e) => {
				h.props.onMouseEnter?.(e), d(!0);
			},
			onMouseLeave: (e) => {
				h.props.onMouseLeave?.(e), d(!1);
			},
			onFocus: (e) => {
				h.props.onFocus?.(e), d(!0);
			},
			onBlur: (e) => {
				h.props.onBlur?.(e), d(!1);
			},
			onKeyDown: (e) => {
				h.props.onKeyDown?.(e), e.key === "Escape" && l && (e.stopPropagation(), d(!1));
			}
		}), l && /* @__PURE__ */ p("span", {
			id: c,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function g({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: a, defaultOpen: s = !1, onOpenChange: c, placement: l = "bottom-start", disabled: f, className: h }) {
	let g = u(), _ = u(), v = d(null), y = d(null), [b, x] = i({
		value: a,
		defaultValue: s,
		onChange: c
	});
	return S(b, v, () => {
		x(!1), y.current?.focus();
	}), /* @__PURE__ */ m("div", {
		ref: v,
		className: o("mtc-popover-root", h),
		children: [/* @__PURE__ */ p("button", {
			ref: y,
			type: "button",
			className: "mtc-popover-trigger",
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": b,
			"aria-controls": b ? g : void 0,
			disabled: f,
			onClick: () => x(!b),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !b && (e.preventDefault(), x(!0));
			},
			children: e
		}), b && /* @__PURE__ */ m("div", {
			id: g,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? _ : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": l,
			children: [r && /* @__PURE__ */ p("div", {
				id: _,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function _({ label: e, trigger: t, items: n, open: r, defaultOpen: a = !1, onOpenChange: s, align: c = "start", disabled: l, className: u }) {
	let f = d(null), h = d(null), [g, _] = i({
		value: void 0,
		defaultValue: 0
	}), [v, b] = i({
		value: r,
		defaultValue: a,
		onChange: s
	}), x = (e = !0) => {
		b(!1), e && h.current?.focus();
	};
	return S(v, f, () => x(!1)), /* @__PURE__ */ m("div", {
		ref: f,
		className: o("mtc-menu-root", u),
		children: [/* @__PURE__ */ p("button", {
			ref: h,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": v,
			disabled: l,
			onClick: () => {
				_(C(n, 1)), b(!v);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), _(C(n, e.key === "ArrowDown" ? 1 : -1)), b(!0));
			},
			children: t
		}), v && /* @__PURE__ */ p(y, {
			label: e,
			items: n,
			initialIndex: g,
			align: c,
			onClose: x
		})]
	});
}
var v = c(function({ label: e, items: t, children: n, className: r, tabIndex: a = 0, onContextMenu: s, onKeyDown: c, ...l }, u) {
	let f = d(null), h = d({
		x: 0,
		y: 0
	}), [g, _] = i({
		value: void 0,
		defaultValue: !1
	}), [v, b] = i({
		value: void 0,
		defaultValue: 0
	}), x = (e) => {
		f.current = e, typeof u == "function" ? u(e) : u && (u.current = e);
	};
	S(g, f, () => _(!1));
	let w = (e, n) => {
		h.current = {
			x: e,
			y: n
		}, b(C(t, 1)), _(!0);
	};
	return /* @__PURE__ */ m("div", {
		...l,
		ref: x,
		className: o("mtc-context-menu-region", r),
		tabIndex: a,
		"aria-label": e,
		onContextMenu: (e) => {
			s?.(e), !e.defaultPrevented && (e.preventDefault(), w(e.clientX, e.clientY));
		},
		onKeyDown: (e) => {
			if (c?.(e), !e.defaultPrevented && (e.key === "ContextMenu" || e.shiftKey && e.key === "F10")) {
				e.preventDefault();
				let t = e.currentTarget.getBoundingClientRect();
				w(t.left + 12, t.top + 12);
			}
		},
		children: [n, g && /* @__PURE__ */ p(y, {
			label: e,
			items: t,
			initialIndex: v,
			style: {
				position: "fixed",
				left: h.current.x,
				top: h.current.y
			},
			onClose: () => {
				_(!1), f.current?.focus();
			}
		})]
	});
});
function y({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = d(null);
	l(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = w(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ p("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ p("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ m("button", {
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
				e.icon && /* @__PURE__ */ p("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ p("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ p("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var b = c(function({ open: i, onOpenChange: s, title: c, description: l, children: f, footer: h, size: g = "medium", dismissible: _ = !0, initialFocusRef: v, className: y }, b) {
	let x = e(), S = u(), C = u(), w = d(null);
	return r(i, w, v), i ? /* @__PURE__ */ p("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			_ && e.target === e.currentTarget && s(!1);
		},
		children: /* @__PURE__ */ m("div", {
			ref: (e) => {
				w.current = e, typeof b == "function" ? b(e) : b && (b.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": S,
			"aria-describedby": l ? C : void 0,
			tabIndex: -1,
			className: o("mtc-dialog", y),
			"data-size": g,
			onKeyDown: (e) => a(e, w, _, () => s(!1)),
			children: [
				/* @__PURE__ */ m("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ m("div", { children: [/* @__PURE__ */ p("h2", {
						id: S,
						className: "mtc-modal-title",
						children: c
					}), l && /* @__PURE__ */ p("p", {
						id: C,
						className: "mtc-modal-description",
						children: l
					})] }), _ && /* @__PURE__ */ p(n, {
						icon: /* @__PURE__ */ p(t, { name: "close" }),
						"aria-label": x("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => s(!1)
					})]
				}),
				/* @__PURE__ */ p("div", {
					className: "mtc-modal-body",
					children: f
				}),
				h && /* @__PURE__ */ p("div", {
					className: "mtc-modal-footer",
					children: h
				})
			]
		})
	}) : null;
}), x = c(function({ open: i, onOpenChange: s, title: c, description: l, children: f, footer: h, side: g = "right", width: _ = 420, dismissible: v = !0, initialFocusRef: y, className: b }, x) {
	let S = e(), C = u(), w = u(), T = d(null);
	return r(i, T, y), i ? /* @__PURE__ */ p("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			v && e.target === e.currentTarget && s(!1);
		},
		children: /* @__PURE__ */ m("div", {
			ref: (e) => {
				T.current = e, typeof x == "function" ? x(e) : x && (x.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": C,
			"aria-describedby": l ? w : void 0,
			tabIndex: -1,
			className: o("mtc-drawer", b),
			"data-side": g,
			style: { width: _ },
			onKeyDown: (e) => a(e, T, v, () => s(!1)),
			children: [
				/* @__PURE__ */ m("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ m("div", { children: [/* @__PURE__ */ p("h2", {
						id: C,
						className: "mtc-modal-title",
						children: c
					}), l && /* @__PURE__ */ p("p", {
						id: w,
						className: "mtc-modal-description",
						children: l
					})] }), v && /* @__PURE__ */ p(n, {
						icon: /* @__PURE__ */ p(t, { name: "close" }),
						"aria-label": S("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => s(!1)
					})]
				}),
				/* @__PURE__ */ p("div", {
					className: "mtc-modal-body",
					children: f
				}),
				h && /* @__PURE__ */ p("div", {
					className: "mtc-modal-footer",
					children: h
				})
			]
		})
	}) : null;
});
function S(e, t, n) {
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
function C(e, t) {
	return w(e, t === 1 ? -1 : 0, t);
}
function w(e, t, n) {
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
export { y as a, S as c, _ as i, b as n, g as o, x as r, h as s, v as t };
