import { E as e, g as t, m as n } from "./States-BUjeBrSp.js";
import { a as r, o as i, r as a, t as o } from "./utils-8rNbW-NI.js";
import { Component as s, cloneElement as c, createContext as l, forwardRef as u, useContext as d, useEffect as f, useId as p, useLayoutEffect as m, useMemo as h, useRef as g } from "react";
import { Fragment as _, jsx as v, jsxs as y } from "react/jsx-runtime";
//#region src/components/Overlays.tsx
function b({ content: e, children: t, placement: n = "top", disabled: i, className: a }) {
	let s = p(), [l, u] = r({
		value: void 0,
		defaultValue: !1
	});
	if (i) return /* @__PURE__ */ v(_, { children: t });
	let d = t, f = [d.props["aria-describedby"], l ? s : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ y("span", {
		className: o("mtc-tooltip-trigger", a),
		children: [c(d, {
			"aria-describedby": f,
			onMouseEnter: (e) => {
				d.props.onMouseEnter?.(e), u(!0);
			},
			onMouseLeave: (e) => {
				d.props.onMouseLeave?.(e), u(!1);
			},
			onFocus: (e) => {
				d.props.onFocus?.(e), u(!0);
			},
			onBlur: (e) => {
				d.props.onBlur?.(e), u(!1);
			},
			onKeyDown: (e) => {
				d.props.onKeyDown?.(e), e.key === "Escape" && l && (e.stopPropagation(), u(!1));
			}
		}), l && /* @__PURE__ */ v("span", {
			id: s,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function x({ trigger: e, triggerAriaLabel: t, children: n, title: i, open: a, defaultOpen: s = !1, onOpenChange: c, placement: l = "bottom-start", disabled: u, triggerVariant: d, triggerSize: f = "medium", className: m }) {
	let h = p(), _ = p(), b = g(null), x = g(null), [S, C] = r({
		value: a,
		defaultValue: s,
		onChange: c
	});
	return D(S, b, () => {
		C(!1), x.current?.focus();
	}), /* @__PURE__ */ y("div", {
		ref: b,
		className: o("mtc-popover-root", m),
		children: [/* @__PURE__ */ v("button", {
			ref: x,
			type: "button",
			className: o("mtc-popover-trigger", d && "mtc-button"),
			"data-intent": d && "neutral",
			"data-variant": d,
			"data-size": d && f,
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": S,
			"aria-controls": S ? h : void 0,
			disabled: u,
			onClick: () => C(!S),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !S && (e.preventDefault(), C(!0));
			},
			children: d ? /* @__PURE__ */ v("span", {
				className: "mtc-button-label",
				children: e
			}) : e
		}), S && /* @__PURE__ */ y("div", {
			id: h,
			role: "dialog",
			"aria-label": i ? void 0 : t,
			"aria-labelledby": i ? _ : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": l,
			children: [i && /* @__PURE__ */ v("div", {
				id: _,
				className: "mtc-popover-title",
				children: i
			}), n]
		})]
	});
}
function S({ label: e, trigger: t, items: n, open: i, defaultOpen: a = !1, onOpenChange: s, align: c = "start", disabled: l, className: u }) {
	let d = g(null), f = g(null), [p, m] = r({
		value: void 0,
		defaultValue: 0
	}), [h, _] = r({
		value: i,
		defaultValue: a,
		onChange: s
	}), b = (e = !0) => {
		_(!1), e && f.current?.focus();
	};
	return D(h, d, () => b(!1)), /* @__PURE__ */ y("div", {
		ref: d,
		className: o("mtc-menu-root", u),
		children: [/* @__PURE__ */ v("button", {
			ref: f,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": h,
			disabled: l,
			onClick: () => {
				m(O(n, 1)), _(!h);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), m(O(n, e.key === "ArrowDown" ? 1 : -1)), _(!0));
			},
			children: t
		}), h && /* @__PURE__ */ v(w, {
			label: e,
			items: n,
			initialIndex: p,
			align: c,
			onClose: b
		})]
	});
}
var C = u(function({ label: e, items: t, children: n, className: i, tabIndex: a = 0, onContextMenu: s, onKeyDown: c, ...l }, u) {
	let d = g(null), f = g({
		x: 0,
		y: 0
	}), [p, m] = r({
		value: void 0,
		defaultValue: !1
	}), [h, _] = r({
		value: void 0,
		defaultValue: 0
	}), b = (e) => {
		d.current = e, typeof u == "function" ? u(e) : u && (u.current = e);
	};
	D(p, d, () => m(!1));
	let x = (e, n) => {
		f.current = {
			x: e,
			y: n
		}, _(O(t, 1)), m(!0);
	};
	return /* @__PURE__ */ y("div", {
		...l,
		ref: b,
		className: o("mtc-context-menu-region", i),
		tabIndex: a,
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
		children: [n, p && /* @__PURE__ */ v(w, {
			label: e,
			items: t,
			initialIndex: h,
			style: {
				position: "fixed",
				left: f.current.x,
				top: f.current.y
			},
			onClose: () => {
				m(!1), d.current?.focus();
			}
		})]
	});
});
function w({ label: e, items: n, initialIndex: r, onClose: i, align: a = "start", style: o }) {
	let s = g(null), c = n.some((e) => e.checked !== void 0);
	f(() => {
		let e = requestAnimationFrame(() => {
			let e = s.current?.querySelectorAll(".mtc-menu-item:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === r) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [r]);
	let l = (e, t) => {
		let r = k(n, e, t);
		s.current?.querySelector(`.mtc-menu-item[data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ v("div", {
		ref: s,
		role: "menu",
		"aria-label": e,
		className: "mtc-menu mtc-popover",
		"data-align": a,
		style: o,
		onKeyDown: (e) => {
			let t = Number(e.target.dataset.index ?? -1);
			e.key === "ArrowDown" ? (e.preventDefault(), l(t, 1)) : e.key === "ArrowUp" ? (e.preventDefault(), l(t, -1)) : e.key === "Home" ? (e.preventDefault(), l(-1, 1)) : e.key === "End" ? (e.preventDefault(), l(0, -1)) : e.key === "Escape" ? (e.preventDefault(), e.stopPropagation(), i(!0)) : e.key === "Tab" && i(!1);
		},
		children: n.map((e, n) => e.separator ? /* @__PURE__ */ v("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ y("button", {
			type: "button",
			role: e.checked === void 0 ? "menuitem" : "menuitemradio",
			"aria-checked": e.checked,
			disabled: e.disabled,
			"data-index": n,
			"data-intent": e.intent ?? "neutral",
			className: "mtc-menu-item",
			onClick: () => {
				e.disabled || (e.onSelect?.(), i(!0));
			},
			children: [
				c && /* @__PURE__ */ v("span", {
					className: "mtc-menu-check",
					"aria-hidden": "true",
					children: e.checked && /* @__PURE__ */ v(t, { name: "check" })
				}),
				e.icon && /* @__PURE__ */ v("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ v("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ v("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var T = u(function({ open: r, onOpenChange: s, title: c, description: l, children: u, footer: d, size: f = "medium", dismissible: m = !0, initialFocusRef: h, className: _ }, b) {
	let x = e(), S = p(), C = p(), w = g(null);
	return i(r, w, h), r ? /* @__PURE__ */ v("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			m && e.target === e.currentTarget && s(!1);
		},
		children: /* @__PURE__ */ y("div", {
			ref: (e) => {
				w.current = e, typeof b == "function" ? b(e) : b && (b.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": S,
			"aria-describedby": l ? C : void 0,
			tabIndex: -1,
			className: o("mtc-dialog", _),
			"data-size": f,
			onKeyDown: (e) => a(e, w, m, () => s(!1)),
			children: [
				/* @__PURE__ */ y("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ y("div", { children: [/* @__PURE__ */ v("h2", {
						id: S,
						className: "mtc-modal-title",
						children: c
					}), l && /* @__PURE__ */ v("p", {
						id: C,
						className: "mtc-modal-description",
						children: l
					})] }), m && /* @__PURE__ */ v(n, {
						icon: /* @__PURE__ */ v(t, { name: "close" }),
						"aria-label": x("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => s(!1)
					})]
				}),
				/* @__PURE__ */ v("div", {
					className: "mtc-modal-body",
					children: u
				}),
				d && /* @__PURE__ */ v("div", {
					className: "mtc-modal-footer",
					children: d
				})
			]
		})
	}) : null;
}), E = u(function({ open: r, onOpenChange: s, title: c, description: l, children: u, footer: d, side: f = "right", width: m = 420, dismissible: h = !0, initialFocusRef: _, className: b }, x) {
	let S = e(), C = p(), w = p(), T = g(null);
	return i(r, T, _), r ? /* @__PURE__ */ v("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			h && e.target === e.currentTarget && s(!1);
		},
		children: /* @__PURE__ */ y("div", {
			ref: (e) => {
				T.current = e, typeof x == "function" ? x(e) : x && (x.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": C,
			"aria-describedby": l ? w : void 0,
			tabIndex: -1,
			className: o("mtc-drawer", b),
			"data-side": f,
			style: { width: m },
			onKeyDown: (e) => a(e, T, h, () => s(!1)),
			children: [
				/* @__PURE__ */ y("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ y("div", { children: [/* @__PURE__ */ v("h2", {
						id: C,
						className: "mtc-modal-title",
						children: c
					}), l && /* @__PURE__ */ v("p", {
						id: w,
						className: "mtc-modal-description",
						children: l
					})] }), h && /* @__PURE__ */ v(n, {
						icon: /* @__PURE__ */ v(t, { name: "close" }),
						"aria-label": S("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => s(!1)
					})]
				}),
				/* @__PURE__ */ v("div", {
					className: "mtc-modal-body",
					children: u
				}),
				d && /* @__PURE__ */ v("div", {
					className: "mtc-modal-footer",
					children: d
				})
			]
		})
	}) : null;
});
function D(e, t, n) {
	f(() => {
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
function O(e, t) {
	return k(e, t === 1 ? -1 : 0, t);
}
function k(e, t, n) {
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
//#region src/workbench/ScrollRestoration.tsx
var A = "mtc:scroll-restoration:v1", j = 100, M = 1e4, N = /* @__PURE__ */ new Map();
function P(e) {
	if (!e || typeof e != "object") return !1;
	let t = e;
	return typeof t.top == "number" && Number.isFinite(t.top) && t.top >= 0 && typeof t.left == "number" && Number.isFinite(t.left) && t.left >= 0;
}
function F() {
	try {
		let e = JSON.parse(sessionStorage.getItem(A) ?? "[]");
		return Array.isArray(e) ? e.filter((e) => {
			if (!Array.isArray(e) || e.length !== 2 || typeof e[0] != "string") return !1;
			let t = e[1];
			return typeof t == "object" && !!t && !Array.isArray(t) && Object.entries(t).length <= j && Object.values(t).every(P);
		}).slice(-50) : [];
	} catch {
		return [];
	}
}
function I(e, t) {
	let n = Object.create(null), r = {}, i = !1, a = /* @__PURE__ */ new Map(), o = !1, s, c = () => {
		if (clearTimeout(s), N.get(e) === r) {
			for (let e of a.values()) e.capture();
			try {
				let t = F().filter(([t]) => t !== e);
				t.push([e, n]), sessionStorage.setItem(A, JSON.stringify(t.slice(-50)));
			} catch {}
		}
	};
	return {
		register: (l, u, d) => {
			if (i ||= (Object.assign(n, F().find(([t]) => t === e)?.[1]), !0), N.set(e, r), a.has(l) || a.size >= j) return () => {};
			!(l in n) && Object.keys(n).length >= j && delete n[Object.keys(n)[0]];
			let f = n[l] ?? (t ? {
				top: u.scrollTop,
				left: u.scrollLeft
			} : {
				top: 0,
				left: 0
			}), p = 0, m, h = () => {
				if (f || o) return;
				delete n[l], n[l] = {
					top: Math.max(0, u.scrollTop),
					left: Math.max(0, u.scrollLeft)
				};
				let e = Object.keys(n);
				e.length > j && delete n[e[0]];
			};
			a.set(l, { capture: h });
			let g = () => {
				if (p = 0, !f || !u.isConnected || u.clientHeight === 0) return;
				let { scrollTop: e, scrollLeft: t } = u;
				u.scrollTop = f.top, u.scrollLeft = f.left, (e !== u.scrollTop || t !== u.scrollLeft) && d?.(), Math.abs(u.scrollTop - f.top) <= 1 && Math.abs(u.scrollLeft - f.left) <= 1 && (f = null, v.disconnect(), y.disconnect(), clearTimeout(m));
			}, _ = () => {
				f && !p && (p = requestAnimationFrame(g));
			}, v = new MutationObserver(_), y = new ResizeObserver(_);
			v.observe(u, {
				childList: !0,
				subtree: !0,
				attributes: !0
			}), y.observe(u);
			let b = () => {
				f && (f = null, v.disconnect(), y.disconnect(), cancelAnimationFrame(p), clearTimeout(m), h(), clearTimeout(s), s = setTimeout(c, 100));
			}, x = () => {
				h(), f || (clearTimeout(s), s = setTimeout(c, 100));
			};
			u.addEventListener("scroll", x, { passive: !0 });
			for (let e of [
				"wheel",
				"touchstart",
				"pointerdown",
				"keydown"
			]) u.addEventListener(e, b, {
				capture: !0,
				passive: !0
			});
			return m = setTimeout(b, M), g(), () => {
				h(), a.delete(l), v.disconnect(), y.disconnect(), cancelAnimationFrame(p), clearTimeout(m), u.removeEventListener("scroll", x);
				for (let e of [
					"wheel",
					"touchstart",
					"pointerdown",
					"keydown"
				]) u.removeEventListener(e, b, { capture: !0 });
				c(), !a.size && N.get(e) === r && N.delete(e);
			};
		},
		persist: c,
		fragmentMove: t,
		freeze: (e = !0) => {
			o = !e, c(), o = !0;
		},
		resume: () => {
			o = !1;
		}
	};
}
var L = l(null), R = class extends s {
	getSnapshotBeforeUpdate(e) {
		return e.scope !== this.props.scope && e.scope.freeze(!this.props.scope.fragmentMove), null;
	}
	componentDidMount() {
		this.props.scope.resume();
	}
	componentDidUpdate() {
		this.props.scope.resume();
	}
	componentWillUnmount() {
		this.props.scope.freeze();
	}
	render() {
		return this.props.children;
	}
};
function z({ storageKey: e, href: t, mainRef: n, children: r }) {
	let i = g(t), a = h(() => I(e, i.current !== t && i.current?.split("#")[0] === t?.split("#")[0]), [e]);
	return f(() => {
		i.current = t;
	}, [t]), m(() => {
		if (n?.current) return a.register("main", n.current);
	}, [a, n]), f(() => (window.addEventListener("pagehide", a.persist), () => {
		window.removeEventListener("pagehide", a.persist), a.persist();
	}), [a]), /* @__PURE__ */ v(R, {
		scope: a,
		children: /* @__PURE__ */ v(L.Provider, {
			value: a,
			children: r
		})
	});
}
function B(e, t, n) {
	let r = d(L), i = g(n);
	i.current = n, m(() => {
		if (e.current) return r?.register(t, e.current, () => i.current?.());
	}, [
		r,
		e,
		t
	]);
}
//#endregion
export { E as a, x as c, T as i, b as l, B as n, S as o, C as r, w as s, z as t, D as u };
