import { A as e, B as t, E as n, F as r, M as i, O as a, P as o, R as s, T as c, V as l, _ as u, b as d, g as f, h as p, i as m, j as h, n as g, r as _, v, w as y, x as b, y as x, z as S } from "./States-CAp0YT3C.js";
import { i as C, n as w, r as T, t as E } from "./utils-j4lJ7S1v.js";
import { t as D } from "./layeredLayout-D0PMUE9A.js";
import { s as O, u as k } from "./sourceError-B1Q2JDlm.js";
import { cloneElement as A, forwardRef as j, isValidElement as M, useCallback as N, useEffect as P, useId as F, useImperativeHandle as I, useLayoutEffect as ee, useMemo as L, useRef as R, useState as z } from "react";
import { Fragment as B, jsx as V, jsxs as H } from "react/jsx-runtime";
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
function re(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, ne[(t >>> 0) % ne.length];
}
var ie = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, U = j(function({ icon: t = "object", color: n, size: r = 20, label: i, className: a, ...o }, s) {
	return /* @__PURE__ */ V("span", {
		...o,
		ref: s,
		className: E("mtc-type-glyph", a),
		"data-color": n,
		"data-size": r,
		role: i ? "img" : void 0,
		"aria-label": i,
		"aria-hidden": !i || void 0,
		children: /* @__PURE__ */ V(e, {
			name: t,
			size: ie[r],
			strokeWidth: r <= 20 ? 2 : 1.75
		})
	});
}), ae = j(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ V("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: E("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), oe = j(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ V("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: E("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function se({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = F(), c = (M(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, l = r ? `${c}-description` : void 0, u = i ? `${c}-error` : void 0, d = [
		M(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		l,
		u
	].filter(Boolean).join(" ") || void 0, f = (M(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, p = M(t) ? A(t, {
		id: c,
		"aria-describedby": d,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: f
	}) : t;
	return /* @__PURE__ */ H("div", {
		className: E("mtc-form-field", o),
		children: [
			/* @__PURE__ */ H("label", {
				className: "mtc-form-label",
				htmlFor: c,
				children: [e, f && /* @__PURE__ */ V("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			p,
			r && /* @__PURE__ */ V("div", {
				id: l,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ V("div", {
				id: u,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var ce = j(function({ label: t, description: n, density: r, className: i, ...a }, o) {
	return /* @__PURE__ */ H("label", {
		className: E("mtc-choice", r && `mtc-density-${r}`, i),
		children: [
			/* @__PURE__ */ V("input", {
				...a,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ V("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ V(e, { name: "check" })
			}),
			/* @__PURE__ */ H("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ V("span", {
					className: "mtc-choice-label",
					children: t
				}), n && /* @__PURE__ */ V("span", {
					className: "mtc-choice-description",
					children: n
				})]
			})
		]
	});
}), W = j(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ H("label", {
		className: E("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ V("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ V("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ H("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ V("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ V("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), le = j(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ H("label", {
		className: E("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ V("input", {
				...o,
				ref: s,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ V("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ V("span", {})
			}),
			/* @__PURE__ */ H("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ V("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ V("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), ue = j(function({ value: n, onValueChange: r, options: i, placeholder: a, disabled: o, required: s, name: c, id: l, "aria-label": u, "aria-labelledby": d, "aria-describedby": f, "aria-invalid": p, invalid: m, size: h = "medium", density: g, className: _, emptyMessage: v }, y) {
	let b = t(), x = F(), S = l ?? `mtc-combobox-${x}`, C = `${S}-listbox`, w = R(null), T = R(null), D = i.find((e) => e.value === n), [O, k] = z(D?.label ?? ""), [A, j] = z(!1), [M, N] = z(-1), I = L(() => {
		let e = O.trim().toLocaleLowerCase();
		return !e || D?.label === O ? [...i] : i.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		i,
		O,
		D?.label
	]);
	P(() => {
		A || k(D?.label ?? "");
	}, [A, D?.label]), P(() => {
		T.current?.setCustomValidity(s && !D ? "Please select an option." : "");
	}, [s, D]), P(() => {
		if (!A || typeof document > "u") return;
		let e = (e) => {
			w.current?.contains(e.target) || j(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [A]);
	let ee = (e, t) => {
		if (I.length === 0) return -1;
		let n = e;
		for (let e = 0; e < I.length; e++) if (n = (n + t + I.length) % I.length, !I[n]?.disabled) return n;
		return -1;
	}, B = (e) => {
		e.disabled || (r(e.value), k(e.label), j(!1), N(-1));
	};
	return /* @__PURE__ */ H("div", {
		ref: w,
		className: E("mtc-combobox", g && `mtc-density-${g}`, _),
		"data-size": h,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || j(!1);
		},
		children: [
			c && /* @__PURE__ */ V("input", {
				type: "hidden",
				name: c,
				value: n ?? ""
			}),
			/* @__PURE__ */ V("input", {
				ref: (e) => {
					T.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
				},
				id: S,
				value: O,
				disabled: o,
				required: s,
				placeholder: a ?? b("combobox.placeholder"),
				role: "combobox",
				"aria-label": u,
				"aria-labelledby": d,
				"aria-describedby": f,
				"aria-invalid": m || p || void 0,
				"aria-required": s || void 0,
				"aria-expanded": A,
				"aria-controls": A ? C : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": A && M >= 0 ? `${S}-option-${M}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					j(!0), N(I.findIndex((e) => e.value === n && !e.disabled));
				},
				onChange: (e) => {
					k(e.currentTarget.value), j(!0), N(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), j(!0), N((e) => ee(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), j(!0), N((e) => ee(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && A) e.preventDefault(), N(ee(-1, 1));
					else if (e.key === "End" && A) e.preventDefault(), N(ee(0, -1));
					else if (e.key === "Enter" && A && M >= 0) {
						e.preventDefault();
						let t = I[M];
						t && B(t);
					} else e.key === "Escape" && A ? (e.preventDefault(), e.stopPropagation(), j(!1), k(D?.label ?? "")) : e.key === "Tab" && j(!1);
				}
			}),
			/* @__PURE__ */ V(e, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			A && !o && /* @__PURE__ */ V("div", {
				id: C,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: I.length === 0 ? /* @__PURE__ */ V("div", {
					className: "mtc-combobox-empty",
					children: v ?? b("combobox.empty")
				}) : I.map((t, r) => /* @__PURE__ */ H("div", {
					id: `${S}-option-${r}`,
					role: "option",
					"aria-selected": t.value === n,
					"aria-disabled": t.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": M === r,
					"data-selected": t.value === n,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						t.disabled || N(r);
					},
					onClick: () => B(t),
					children: [/* @__PURE__ */ H("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ V("span", { children: t.label }), t.description && /* @__PURE__ */ V("small", { children: t.description })]
					}), t.value === n && /* @__PURE__ */ V(e, { name: "check" })]
				}, t.value))
			})
		]
	});
}), de = 6, G = 320;
function fe({ children: e, content: t, openDelay: n = 350, closeDelay: r = 150, className: i }) {
	let a = F(), o = l(), s = R(null), c = R(void 0), [u, d] = z(!1), [f, p] = z(null), m = N((e, t) => {
		clearTimeout(c.current), c.current = setTimeout(() => d(e), t);
	}, []);
	P(() => () => clearTimeout(c.current), []), ee(() => {
		if (!u || !s.current || typeof window > "u") {
			p(null);
			return;
		}
		let e = s.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - G - 8));
		p({
			left: r,
			top: n === "below" ? e.bottom + de : e.top - de,
			placement: n
		});
	}, [u]), P(() => {
		if (!u) return;
		let e = (e) => {
			e.key === "Escape" && d(!1);
		}, t = () => d(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [u]);
	let h = e, g = [h.props["aria-describedby"], u ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ H("span", {
		ref: s,
		className: "mtc-hover-card-trigger",
		children: [A(h, {
			"aria-describedby": g,
			onMouseEnter: (e) => {
				h.props.onMouseEnter?.(e), m(!0, n);
			},
			onMouseLeave: (e) => {
				h.props.onMouseLeave?.(e), m(!1, r);
			},
			onFocus: (e) => {
				h.props.onFocus?.(e), m(!0, n);
			},
			onBlur: (e) => {
				h.props.onBlur?.(e), m(!1, 0);
			}
		}), u && o && f && te(/* @__PURE__ */ V("div", {
			id: a,
			role: "tooltip",
			className: E("mtc-hover-card", i),
			"data-placement": f.placement,
			style: {
				left: f.left,
				top: f.top,
				width: G,
				transform: f.placement === "above" ? "translateY(-100%)" : void 0
			},
			onMouseEnter: () => clearTimeout(c.current),
			onMouseLeave: () => m(!1, r),
			children: t
		}), o)]
	});
}
//#endregion
//#region src/components/Pagination.tsx
var pe = j(function({ label: r, page: i, pageCount: a, onPageChange: o, hasPrevious: s, hasNext: c, onPrevious: l, onNext: u, summary: d, previousLabel: f, nextLabel: p, size: m = "small", className: h, ...g }, _) {
	let v = t(), y = i !== void 0, b = y ? i > 1 : !!s, x = y ? a === void 0 ? !!c : i < a : !!c, S = () => y ? o?.(Math.max(1, i - 1)) : l?.(), C = () => y ? o?.(i + 1) : u?.();
	return /* @__PURE__ */ H("nav", {
		...g,
		ref: _,
		"aria-label": r ?? v("pagination.label"),
		className: E("mtc-pagination", h),
		children: [d != null && /* @__PURE__ */ V("span", {
			className: "mtc-pagination-summary",
			children: d
		}), /* @__PURE__ */ H("div", {
			className: "mtc-pagination-controls",
			children: [
				/* @__PURE__ */ V(n, {
					size: m,
					variant: "ghost",
					startIcon: /* @__PURE__ */ V(e, { name: "chevron-left" }),
					disabled: !b,
					onClick: S,
					children: f ?? v("pagination.previous")
				}),
				y && /* @__PURE__ */ V("span", {
					className: "mtc-pagination-page",
					"aria-live": "polite",
					children: a === void 0 ? v("pagination.pageOnly", { page: i }) : v("pagination.page", {
						page: i,
						count: a
					})
				}),
				/* @__PURE__ */ V(n, {
					size: m,
					variant: "ghost",
					endIcon: /* @__PURE__ */ V(e, { name: "chevron-right" }),
					disabled: !x,
					onClick: C,
					children: p ?? v("pagination.next")
				})
			]
		})]
	});
});
//#endregion
//#region src/components/SearchField.tsx
function me(e) {
	return e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));
}
var he = j(function({ value: n, onValueChange: r, label: i, tokens: o = [], onRemoveToken: s, onSubmit: c, shortcut: l, clearLabel: d, size: f = "medium", className: p, placeholder: m, onKeyDown: h, ...g }, _) {
	let v = t(), y = R(null);
	return I(_, () => y.current), P(() => {
		if (!l) return;
		let e = (e) => {
			e.key !== l || e.metaKey || e.ctrlKey || e.altKey || me(e.target) || (e.preventDefault(), y.current?.focus());
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [l]), /* @__PURE__ */ H("form", {
		role: "search",
		"aria-label": i,
		className: E("mtc-search-field", p),
		"data-size": f,
		onSubmit: (e) => {
			e.preventDefault(), c?.(n);
		},
		children: [
			/* @__PURE__ */ V(e, {
				name: "search",
				className: "mtc-search-field-icon"
			}),
			o.map((t) => /* @__PURE__ */ H("span", {
				className: "mtc-search-token",
				children: [
					t.icon,
					/* @__PURE__ */ V("span", { children: t.label }),
					s && /* @__PURE__ */ V("button", {
						type: "button",
						className: "mtc-search-token-remove",
						"aria-label": v("search.removeToken", { label: t.label }),
						onClick: () => {
							s(t.id), y.current?.focus();
						},
						children: /* @__PURE__ */ V(e, { name: "close" })
					})
				]
			}, t.id)),
			/* @__PURE__ */ V("input", {
				...g,
				ref: y,
				type: "search",
				"aria-label": i,
				placeholder: m,
				value: n,
				className: "mtc-search-field-input",
				onChange: (e) => r(e.target.value),
				onKeyDown: (e) => {
					h?.(e), !e.defaultPrevented && (e.key === "Backspace" && n === "" && o.length > 0 && s ? (e.preventDefault(), s(o[o.length - 1].id)) : e.key === "Escape" && n !== "" && (e.preventDefault(), r("")));
				}
			}),
			n === "" ? l ? /* @__PURE__ */ V(u, {
				"aria-hidden": "true",
				className: "mtc-search-field-hint",
				children: l
			}) : null : /* @__PURE__ */ V(a, {
				icon: /* @__PURE__ */ V(e, { name: "close" }),
				"aria-label": d ?? v("search.clear"),
				variant: "ghost",
				size: "small",
				onClick: () => {
					r(""), y.current?.focus();
				}
			})
		]
	});
});
//#endregion
//#region src/components/navigation.ts
function ge(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function _e(e) {
	if (e) return (t) => {
		ge(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/components/StatTile.tsx
var ve = j(function({ label: n, value: r, unit: i, delta: a, status: o, description: s, icon: c, href: l, onNavigate: u, className: d, ...f }, p) {
	let m = t(), h = /* @__PURE__ */ H(B, { children: [
		/* @__PURE__ */ H("div", {
			className: "mtc-stat-tile-top",
			children: [
				c,
				/* @__PURE__ */ V("span", {
					className: "mtc-stat-tile-label",
					children: n
				}),
				o && /* @__PURE__ */ V(b, {
					tone: o.tone,
					className: "mtc-stat-tile-status",
					children: o.label
				})
			]
		}),
		/* @__PURE__ */ H("div", {
			className: "mtc-stat-tile-value",
			children: [/* @__PURE__ */ V("span", { children: r }), i != null && /* @__PURE__ */ V("span", {
				className: "mtc-stat-tile-unit",
				children: i
			})]
		}),
		(a || s) && /* @__PURE__ */ H("div", {
			className: "mtc-stat-tile-foot",
			children: [a && /* @__PURE__ */ H("span", {
				className: "mtc-stat-tile-delta",
				"data-tone": a.tone ?? "neutral",
				children: [a.direction && /* @__PURE__ */ V(e, {
					name: "arrow-right",
					className: "mtc-stat-tile-arrow",
					"data-direction": a.direction,
					label: a.direction === "up" ? m("stat.increase") : m("stat.decrease")
				}), a.value]
			}), s && /* @__PURE__ */ V("span", {
				className: "mtc-stat-tile-description",
				children: s
			})]
		})
	] });
	return l ? /* @__PURE__ */ V("a", {
		...f,
		ref: p,
		href: l,
		className: E("mtc-stat-tile", d),
		"data-interactive": "true",
		onClick: _e(u),
		children: h
	}) : /* @__PURE__ */ V("div", {
		...f,
		ref: p,
		className: E("mtc-stat-tile", d),
		children: h
	});
});
//#endregion
//#region src/components/Overlays.tsx
function ye({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let a = F(), [o, s] = T({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ V(B, { children: t });
	let c = t, l = [c.props["aria-describedby"], o ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ H("span", {
		className: E("mtc-tooltip-trigger", i),
		children: [A(c, {
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
		}), o && /* @__PURE__ */ V("span", {
			id: a,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function be({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", disabled: c, className: l }) {
	let u = F(), d = F(), f = R(null), p = R(null), [m, h] = T({
		value: i,
		defaultValue: a,
		onChange: o
	});
	return Te(m, f, () => {
		h(!1), p.current?.focus();
	}), /* @__PURE__ */ H("div", {
		ref: f,
		className: E("mtc-popover-root", l),
		children: [/* @__PURE__ */ V("button", {
			ref: p,
			type: "button",
			className: "mtc-popover-trigger",
			"aria-label": t,
			"aria-haspopup": "dialog",
			"aria-expanded": m,
			"aria-controls": m ? u : void 0,
			disabled: c,
			onClick: () => h(!m),
			onKeyDown: (e) => {
				e.key === "ArrowDown" && !m && (e.preventDefault(), h(!0));
			},
			children: e
		}), m && /* @__PURE__ */ H("div", {
			id: u,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? d : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": s,
			children: [r && /* @__PURE__ */ V("div", {
				id: d,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function xe({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: a, align: o = "start", disabled: s, className: c }) {
	let l = R(null), u = R(null), [d, f] = T({
		value: void 0,
		defaultValue: 0
	}), [p, m] = T({
		value: r,
		defaultValue: i,
		onChange: a
	}), h = (e = !0) => {
		m(!1), e && u.current?.focus();
	};
	return Te(p, l, () => h(!1)), /* @__PURE__ */ H("div", {
		ref: l,
		className: E("mtc-menu-root", c),
		children: [/* @__PURE__ */ V("button", {
			ref: u,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": p,
			disabled: s,
			onClick: () => {
				f(Ee(n, 1)), m(!p);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), f(Ee(n, e.key === "ArrowDown" ? 1 : -1)), m(!0));
			},
			children: t
		}), p && /* @__PURE__ */ V(Ce, {
			label: e,
			items: n,
			initialIndex: d,
			align: o,
			onClose: h
		})]
	});
}
var Se = j(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: a, onKeyDown: o, ...s }, c) {
	let l = R(null), u = R({
		x: 0,
		y: 0
	}), [d, f] = T({
		value: void 0,
		defaultValue: !1
	}), [p, m] = T({
		value: void 0,
		defaultValue: 0
	}), h = (e) => {
		l.current = e, typeof c == "function" ? c(e) : c && (c.current = e);
	};
	Te(d, l, () => f(!1));
	let g = (e, n) => {
		u.current = {
			x: e,
			y: n
		}, m(Ee(t, 1)), f(!0);
	};
	return /* @__PURE__ */ H("div", {
		...s,
		ref: h,
		className: E("mtc-context-menu-region", r),
		tabIndex: i,
		"aria-label": e,
		onContextMenu: (e) => {
			a?.(e), !e.defaultPrevented && (e.preventDefault(), g(e.clientX, e.clientY));
		},
		onKeyDown: (e) => {
			if (o?.(e), !e.defaultPrevented && (e.key === "ContextMenu" || e.shiftKey && e.key === "F10")) {
				e.preventDefault();
				let t = e.currentTarget.getBoundingClientRect();
				g(t.left + 12, t.top + 12);
			}
		},
		children: [n, d && /* @__PURE__ */ V(Ce, {
			label: e,
			items: t,
			initialIndex: p,
			style: {
				position: "fixed",
				left: u.current.x,
				top: u.current.y
			},
			onClose: () => {
				f(!1), l.current?.focus();
			}
		})]
	});
});
function Ce({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = R(null);
	P(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = De(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ V("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ V("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ H("button", {
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
				e.icon && /* @__PURE__ */ V("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ V("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ V("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var K = j(function({ open: n, onOpenChange: r, title: i, description: o, children: s, footer: c, size: l = "medium", dismissible: u = !0, initialFocusRef: d, className: f }, p) {
	let m = t(), h = F(), g = F(), _ = R(null);
	return C(n, _, d), n ? /* @__PURE__ */ V("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			u && e.target === e.currentTarget && r(!1);
		},
		children: /* @__PURE__ */ H("div", {
			ref: (e) => {
				_.current = e, typeof p == "function" ? p(e) : p && (p.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": h,
			"aria-describedby": o ? g : void 0,
			tabIndex: -1,
			className: E("mtc-dialog", f),
			"data-size": l,
			onKeyDown: (e) => w(e, _, u, () => r(!1)),
			children: [
				/* @__PURE__ */ H("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ H("div", { children: [/* @__PURE__ */ V("h2", {
						id: h,
						className: "mtc-modal-title",
						children: i
					}), o && /* @__PURE__ */ V("p", {
						id: g,
						className: "mtc-modal-description",
						children: o
					})] }), u && /* @__PURE__ */ V(a, {
						icon: /* @__PURE__ */ V(e, { name: "close" }),
						"aria-label": m("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => r(!1)
					})]
				}),
				/* @__PURE__ */ V("div", {
					className: "mtc-modal-body",
					children: s
				}),
				c && /* @__PURE__ */ V("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
}), we = j(function({ open: n, onOpenChange: r, title: i, description: o, children: s, footer: c, side: l = "right", width: u = 420, dismissible: d = !0, initialFocusRef: f, className: p }, m) {
	let h = t(), g = F(), _ = F(), v = R(null);
	return C(n, v, f), n ? /* @__PURE__ */ V("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			d && e.target === e.currentTarget && r(!1);
		},
		children: /* @__PURE__ */ H("div", {
			ref: (e) => {
				v.current = e, typeof m == "function" ? m(e) : m && (m.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": g,
			"aria-describedby": o ? _ : void 0,
			tabIndex: -1,
			className: E("mtc-drawer", p),
			"data-side": l,
			style: { width: u },
			onKeyDown: (e) => w(e, v, d, () => r(!1)),
			children: [
				/* @__PURE__ */ H("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ H("div", { children: [/* @__PURE__ */ V("h2", {
						id: g,
						className: "mtc-modal-title",
						children: i
					}), o && /* @__PURE__ */ V("p", {
						id: _,
						className: "mtc-modal-description",
						children: o
					})] }), d && /* @__PURE__ */ V(a, {
						icon: /* @__PURE__ */ V(e, { name: "close" }),
						"aria-label": h("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => r(!1)
					})]
				}),
				/* @__PURE__ */ V("div", {
					className: "mtc-modal-body",
					children: s
				}),
				c && /* @__PURE__ */ V("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
});
function Te(e, t, n) {
	P(() => {
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
function Ee(e, t) {
	return De(e, t === 1 ? -1 : 0, t);
}
function De(e, t, n) {
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
var Oe = j(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: o, keepMounted: s = !1, className: c, ...l }, u) {
	let d = F(), f = R(/* @__PURE__ */ new Map()), p = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), m = (t, r) => {
		let i = e.filter((e) => !e.disabled);
		if (i.length === 0) return;
		let o = i[(i.findIndex((e) => e.id === t) + r + i.length) % i.length];
		o && (f.current.get(o.id)?.focus(), a === "automatic" && n(o.id));
	}, h = (t, r) => {
		let o = i === "horizontal" ? "ArrowLeft" : "ArrowUp", s = i === "horizontal" ? "ArrowRight" : "ArrowDown";
		if (t.key === o || t.key === s) t.preventDefault(), m(r.id, t.key === s ? 1 : -1);
		else if (t.key === "Home" || t.key === "End") {
			t.preventDefault();
			let r = e.filter((e) => !e.disabled), i = t.key === "Home" ? r[0] : r[r.length - 1];
			i && (f.current.get(i.id)?.focus(), a === "automatic" && n(i.id));
		} else (t.key === "Enter" || t.key === " ") && a === "manual" && (t.preventDefault(), n(r.id));
	};
	return /* @__PURE__ */ H("div", {
		...l,
		ref: u,
		className: E("mtc-tabs", o && `mtc-density-${o}`, c),
		"data-orientation": i,
		children: [/* @__PURE__ */ V("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === p?.id, r = `${d}-tab-${e.id}`, i = `${d}-panel-${e.id}`;
				return /* @__PURE__ */ H("button", {
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
					onKeyDown: (t) => h(t, e),
					children: [/* @__PURE__ */ V("span", { children: e.label }), e.count != null && /* @__PURE__ */ V("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ V("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === p?.id;
				return !t && !s ? null : /* @__PURE__ */ V("div", {
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
}), ke = j(function({ items: n, label: r, maxItems: i, className: a, ...o }, s) {
	let c = t(), l = q(n, i);
	return /* @__PURE__ */ V("nav", {
		...o,
		ref: s,
		"aria-label": r ?? c("breadcrumbs.label"),
		className: E("mtc-breadcrumbs", a),
		children: /* @__PURE__ */ V("ol", { children: l.map((t, n) => {
			let r = n === l.length - 1;
			return /* @__PURE__ */ H("li", { children: [n > 0 && /* @__PURE__ */ V(e, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), r ? /* @__PURE__ */ V("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: t.label
			}) : t.href ? /* @__PURE__ */ V("a", {
				href: t.href,
				className: "mtc-breadcrumb-action",
				children: t.label
			}) : t.onSelect ? /* @__PURE__ */ V("button", {
				type: "button",
				onClick: t.onSelect,
				className: "mtc-breadcrumb-action",
				children: t.label
			}) : /* @__PURE__ */ V("span", {
				className: "mtc-breadcrumb-muted",
				children: t.label
			})] }, `${t.id ?? "item"}:${n}`);
		}) })
	});
});
function q(e, t) {
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
var J = j(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ V("div", {
		...i,
		ref: a,
		className: E("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), Y = j(function({ label: e, start: n, end: r, density: i, sticky: a, className: o, children: s, ...c }, l) {
	let u = t();
	return /* @__PURE__ */ H("div", {
		...c,
		ref: l,
		role: "toolbar",
		"aria-label": e ?? u("toolbar.label"),
		className: E("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			n && /* @__PURE__ */ V("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: n
			}),
			/* @__PURE__ */ V("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ V("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), Ae = j(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: c, ...l }, u) {
	let d = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...c
	};
	return /* @__PURE__ */ H("aside", {
		...l,
		ref: u,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: E("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: d,
		children: [
			t && /* @__PURE__ */ V("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ V("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ V("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), je = j(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: c, style: l, ...u }, d) {
	let f = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...l
	};
	return /* @__PURE__ */ H("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: E("mtc-inspector", s),
		"data-open": o,
		style: f,
		children: [
			(t || r) && /* @__PURE__ */ H("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ H("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ V("h2", { children: t }), n && /* @__PURE__ */ V("p", { children: n })]
				}), r && /* @__PURE__ */ V("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ V("div", {
				className: "mtc-inspector-content",
				children: c
			}),
			i && /* @__PURE__ */ V("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), Me = j(function({ primary: e, secondary: n, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: s, minSize: c = 15, maxSize: l = 85, step: u = 5, disabled: d, stackOnNarrow: f = !0, separatorLabel: p, className: m, style: h, ...g }, _) {
	let v = t(), y = R(null), b = R(!1), [x, S] = T({
		value: a,
		defaultValue: o,
		onChange: s
	}), C = Math.min(c, l), w = Math.max(c, l), D = Number.isFinite(u) && u !== 0 ? Math.abs(u) : 1, O = Ne(x, C, w), k = (e) => {
		y.current = e, typeof _ == "function" ? _(e) : _ && (_.current = e);
	}, A = (e) => {
		if (!b.current || !y.current || d) return;
		let t = y.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		S(Ne(a, C, w));
	}, j = (e) => S(Ne(O + e, C, w)), M = i === "start" ? O : 100 - O, N = 100 - M;
	return /* @__PURE__ */ H("div", {
		...g,
		ref: k,
		className: E("mtc-split-pane", m),
		"data-orientation": r,
		"data-stack-narrow": f,
		style: {
			"--mtc-split-start": `${M}fr`,
			"--mtc-split-end": `${N}fr`,
			...h
		},
		children: [
			/* @__PURE__ */ V("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? e : n
			}),
			/* @__PURE__ */ V("div", {
				role: "separator",
				"aria-label": p ?? v("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": C,
				"aria-valuemax": w,
				"aria-valuenow": Math.round(O),
				"aria-disabled": d || void 0,
				tabIndex: d ? -1 : 0,
				className: "mtc-split-separator",
				onPointerDown: (e) => {
					d || (b.current = !0, e.currentTarget.setPointerCapture(e.pointerId), A(e));
				},
				onPointerMove: A,
				onPointerUp: (e) => {
					b.current = !1, e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
				},
				onPointerCancel: () => {
					b.current = !1;
				},
				onKeyDown: (e) => {
					if (d) return;
					let t = r === "horizontal" ? "ArrowLeft" : "ArrowUp", n = r === "horizontal" ? "ArrowRight" : "ArrowDown";
					if (e.key === t || e.key === n) {
						e.preventDefault();
						let t = e.key === n ? D : -D;
						j(i === "start" ? t : -t);
					} else e.key === "Home" ? (e.preventDefault(), S(C)) : e.key === "End" && (e.preventDefault(), S(w));
				},
				children: /* @__PURE__ */ V("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ V("div", {
				className: "mtc-split-content mtc-split-end",
				children: i === "start" ? n : e
			})
		]
	});
});
function Ne(e, t, n) {
	return Number.isFinite(e) ? Math.min(Math.max(e, t), n) : t;
}
//#endregion
//#region src/workbench/Tree.tsx
var Pe = j(function({ items: n, label: r, selectedId: i, onSelectionChange: a, expandedIds: o, onExpandedChange: s, density: c, className: l, ...u }, d) {
	let f = L(() => Fe(n, o), [n, o]), p = t(), m = R(/* @__PURE__ */ new Map()), [h, g] = z(i ?? f.find((e) => !e.item.disabled)?.item.id);
	P(() => {
		h && f.some((e) => e.item.id === h && !e.item.disabled) || g(i ?? f.find((e) => !e.item.disabled)?.item.id);
	}, [
		h,
		i,
		f
	]);
	let _ = (e) => {
		e && (g(e), m.current.get(e)?.focus());
	}, v = (e, t) => {
		let n = new Set(o);
		t ? n.add(e) : n.delete(e), s(n);
	}, y = f.filter((e) => !e.item.disabled), b = (e, t) => {
		let n = y.findIndex((e) => e.item.id === t.item.id), r = !!t.item.children?.length, i = o.has(t.item.id);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let t = e.key === "ArrowDown" ? 1 : -1, r = y[Math.min(y.length - 1, Math.max(0, n + t))];
			_(r?.item.id);
		} else if (e.key === "ArrowRight") e.preventDefault(), r && !i ? v(t.item.id, !0) : r && _(t.item.children?.find((e) => !e.disabled)?.id);
		else if (e.key === "ArrowLeft") e.preventDefault(), r && i ? v(t.item.id, !1) : _(t.parentId);
		else if (e.key === "Home" || e.key === "End") {
			e.preventDefault();
			let t = e.key === "Home" ? y[0] : y[y.length - 1];
			_(t?.item.id);
		} else if (e.key === "Enter" || e.key === " ") e.preventDefault(), a?.(t.item.id);
		else if (e.key === "*" && t.parentId) {
			e.preventDefault();
			let n = new Set(o);
			for (let e of f.filter((e) => e.parentId === t.parentId)) e.item.children?.length && n.add(e.item.id);
			s(n);
		}
	};
	return /* @__PURE__ */ V("div", {
		...u,
		ref: d,
		role: "tree",
		"aria-label": r,
		"aria-multiselectable": !1,
		className: E("mtc-tree", c && `mtc-density-${c}`, l),
		children: f.map((t) => {
			let { item: n } = t, r = !!n.children?.length, s = o.has(n.id), c = i === n.id;
			return /* @__PURE__ */ H("div", {
				ref: (e) => {
					e ? m.current.set(n.id, e) : m.current.delete(n.id);
				},
				role: "treeitem",
				"aria-level": t.level,
				"aria-posinset": t.position,
				"aria-setsize": t.setSize,
				"aria-expanded": r ? s : void 0,
				"aria-selected": c,
				"aria-disabled": n.disabled || void 0,
				tabIndex: !n.disabled && h === n.id ? 0 : -1,
				className: "mtc-tree-item",
				"data-selected": c,
				"data-disabled": n.disabled || void 0,
				style: { "--mtc-tree-level": t.level },
				onFocus: () => g(n.id),
				onClick: () => {
					n.disabled || a?.(n.id);
				},
				onDoubleClick: () => {
					!n.disabled && r && v(n.id, !s);
				},
				onKeyDown: (e) => b(e, t),
				children: [
					/* @__PURE__ */ V("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": r ? p(s ? "tree.collapse" : "tree.expand", { label: Ie(n.label) }) : void 0,
						"aria-hidden": !r || void 0,
						disabled: !r || n.disabled,
						onClick: (e) => {
							e.stopPropagation(), r && v(n.id, !s);
						},
						children: r && /* @__PURE__ */ V(e, { name: "chevron-right" })
					}),
					n.icon && /* @__PURE__ */ V("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: n.icon
					}),
					/* @__PURE__ */ H("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ V("span", {
							className: "mtc-tree-label",
							children: n.label
						}), n.description && /* @__PURE__ */ V("span", {
							className: "mtc-tree-description",
							children: n.description
						})]
					})
				]
			}, n.id);
		})
	});
});
function Fe(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...Fe(o.children, t, n + 1, o.id, i)));
	}), a;
}
function Ie(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/objects/types.ts
function X(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? re(e.id ?? e.label)
	};
}
function Le(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
//#region src/objects/ObjectChip.tsx
var Re = j(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? X(e.type) : null, s = /* @__PURE__ */ H(B, { children: [o && /* @__PURE__ */ V(U, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ V("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, l = E("mtc-object-chip", i), u;
	return u = e.href ? /* @__PURE__ */ V("a", {
		ref: a,
		href: e.href,
		className: l,
		"data-interactive": "true",
		onClick: _e(c),
		children: s
	}) : c ? /* @__PURE__ */ V("button", {
		ref: a,
		type: "button",
		className: l,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ V("span", {
		ref: a,
		className: l,
		children: s
	}), n ? /* @__PURE__ */ V(fe, {
		content: n,
		children: u
	}) : u;
}), ze = /* @__PURE__ */ new Set([
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
		if (ze.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : Le(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function Be(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Ve(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function Q(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var He = /^\d{4}-\d{2}-\d{2}$/;
function Ue(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = He.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function We(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function Ge(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function Ke(e, t, n = "en") {
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
function qe(e, t, { locale: n = "en", timeZone: r } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return i(e.date, {
		locale: n,
		timeZone: e.dateOnly ? "UTC" : r,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var Je = 864e5;
function Ye(e, t, n = "en") {
	if (!e.dateOnly) return r(e.date, {
		locale: n,
		now: t
	});
	let i = new Date(t), a = Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate()), o = Math.round((e.date.getTime() - a) / Je);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : r(e.date, {
		locale: n,
		now: a
	});
}
function $(e, t, n = {}) {
	if (Be(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = Q(e);
			return n == null ? String(e) : Ke(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = Ue(e);
			return r ? qe(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => $(e, Z(e), n)).join(", ");
		case "link": return Le(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${$(t, Z(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function Xe(e, t, n = {}) {
	return Be(e) ? null : Ve(t.kind) ? Q(e) ?? $(e, t, n) : t.kind === "date" || t.kind === "datetime" ? Ue(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : $(e, t, n);
}
var Ze = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function Qe(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : Ze.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var $e = 3;
function et(e) {
	return /* @__PURE__ */ V(tt, {
		...e,
		depth: 0
	});
}
function tt({ value: n, kind: r, format: i, tones: a, context: o = "panel", emptyValue: s, now: l, onNavigate: u, maxListItems: d, depth: p }) {
	let { locale: m, timeZone: h } = S(), g = t(), _ = L(() => Z(n, r, i), [
		n,
		r,
		i
	]), v = {
		locale: m,
		timeZone: h,
		yes: g("value.yes"),
		no: g("value.no")
	}, y = o === "panel";
	if (Be(n)) return /* @__PURE__ */ V("span", {
		className: "mtc-value-empty",
		children: s ?? "—"
	});
	switch (_.kind) {
		case "id":
		case "code": {
			let e = String(n);
			return /* @__PURE__ */ H("span", {
				className: "mtc-value-id",
				"data-context": o,
				children: [/* @__PURE__ */ V("code", { children: e }), y && /* @__PURE__ */ V(f, {
					value: e,
					label: g("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ V(nt, {
			value: n,
			resolved: _,
			locale: m,
			panel: y
		});
		case "date":
		case "datetime": {
			let e = Ue(n);
			return e ? /* @__PURE__ */ H("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ V("time", {
					dateTime: e.dateOnly ? String(n).trim() : e.date.toISOString(),
					title: e.dateOnly ? String(n).trim() : e.date.toISOString(),
					children: qe(e, _.kind, v)
				}), y && /* @__PURE__ */ V("span", {
					className: "mtc-value-secondary",
					children: Ye(e, l ?? Date.now(), m)
				})]
			}) : /* @__PURE__ */ V("span", {
				className: "mtc-value-text",
				children: String(n)
			});
		}
		case "boolean": {
			let t = n === !0 || n === "true";
			return /* @__PURE__ */ H("span", {
				className: "mtc-value-boolean",
				"data-value": t,
				children: [/* @__PURE__ */ V(e, { name: t ? "check" : "close" }), g(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let e = String(n), t = a?.[e];
			return t && t !== "neutral" ? /* @__PURE__ */ V(b, {
				tone: t,
				children: e
			}) : /* @__PURE__ */ V(c, {
				className: "mtc-value-chip",
				children: e
			});
		}
		case "list": {
			let e = Array.isArray(n) ? n : [n], t = d ?? (y ? 3 : 2), r = e.slice(0, t), i = e.slice(t);
			return /* @__PURE__ */ H("span", {
				className: "mtc-value-list",
				"data-context": o,
				children: [r.map((e, t) => Le(e) ? /* @__PURE__ */ V(Re, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ V(c, {
					className: "mtc-value-chip",
					children: $(e, Z(e), v)
				}, t)), i.length > 0 && /* @__PURE__ */ V(c, {
					className: "mtc-value-chip",
					title: g("value.moreTitle", {
						count: i.length,
						items: i.map((e) => $(e, Z(e), v)).join(", ")
					}),
					children: g("value.more", { count: i.length })
				})]
			});
		}
		case "link": return Le(n) ? /* @__PURE__ */ V(Re, {
			object: n,
			onNavigate: u
		}) : /* @__PURE__ */ V("span", {
			className: "mtc-value-text",
			children: String(n)
		});
		case "url": {
			let t = We(n);
			if (!t) return /* @__PURE__ */ V("span", {
				className: "mtc-value-text",
				children: String(n)
			});
			let r = String(n).trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
			return /* @__PURE__ */ H("a", {
				className: "mtc-value-link",
				href: t,
				target: "_blank",
				rel: "noopener noreferrer",
				children: [
					/* @__PURE__ */ V("span", {
						className: "mtc-value-link-text",
						children: r
					}),
					/* @__PURE__ */ V(e, { name: "external-link" }),
					/* @__PURE__ */ V("span", {
						className: "mtc-visually-hidden",
						children: g("value.newTab")
					})
				]
			});
		}
		case "email": return Ge(n) ? /* @__PURE__ */ V("a", {
			className: "mtc-value-link",
			href: `mailto:${n.trim()}`,
			children: /* @__PURE__ */ V("span", {
				className: "mtc-value-link-text",
				children: n.trim()
			})
		}) : /* @__PURE__ */ V("span", {
			className: "mtc-value-text",
			children: String(n)
		});
		case "object": {
			if (p >= $e || !n || typeof n != "object") return /* @__PURE__ */ V("span", {
				className: "mtc-value-text",
				children: $(n, _, v)
			});
			let e = Object.entries(n);
			return /* @__PURE__ */ H("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ V("summary", { children: g("value.fields", { count: e.length }) }), /* @__PURE__ */ V("dl", { children: e.map(([e, t]) => /* @__PURE__ */ H("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ V("dt", { children: e }), /* @__PURE__ */ V("dd", { children: /* @__PURE__ */ V(tt, {
						value: t,
						context: o,
						now: l,
						onNavigate: u,
						depth: p + 1
					}) })]
				}, e)) })]
			});
		}
		default: {
			let e = String(n);
			return /* @__PURE__ */ V("span", {
				className: "mtc-value-text",
				"data-context": o,
				title: e.length > 80 ? e : void 0,
				children: e
			});
		}
	}
}
function nt({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ H("span", {
		className: "mtc-value-number",
		children: [Ke(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ V("span", {
			className: "mtc-value-secondary",
			children: t.currency
		})]
	}) : /* @__PURE__ */ V("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
//#region src/workbench/dataGridModel.ts
function rt(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function it(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = rt(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : Xe(i, Z(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return Qe(e.key, t.key) || e.index - t.index;
		let r = Qe(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function at(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function ot(e, t, n, r, i, a) {
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
function st(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function ct(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function lt(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
var ut = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, dt = 160, ft = 40, pt = 16, mt = 8, ht = 160;
function gt(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function _t({ label: n, columns: r, rows: i, rowKey: a, rowLabel: o, selection: c = "none", selectedKeys: u, defaultSelectedKeys: f, onSelectionChange: p, sort: m, defaultSort: h = null, onSortChange: _, sortMode: v = "client", onRowActivate: y, rowHref: b, onNavigate: x, contextActions: C, onCellEdit: w, onEndReached: T, totalRows: D, loading: O = !1, empty: k, density: A, rowHeight: j, height: M = "100%", virtualize: F = "auto", overscan: I = 8, footer: B, rowProps: ne, className: re }) {
	let ie = t(), { locale: U, timeZone: ae } = S(), oe = s(), se = l(), ce = A ?? oe?.density ?? "standard", W = j ?? ut[ce], le = R(null), ue = R(null), de = R(!1), G = R(null), fe = R(-1), [pe, me] = z(h), he = m === void 0 ? pe : m, [ge, ve] = z(f ?? []), ye = u ?? ge, be = L(() => new Set(ye), [ye]), [xe, Se] = z({}), [K, we] = z(() => ({
		row: i.length > 0 ? 0 : -1,
		column: +(c === "multi")
	})), [Ee, De] = z({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [Oe, ke] = z(null), q = L(() => v !== "client" || !he ? i : it(i, r.find((e) => e.id === he.columnId), he.direction, U), [
		i,
		r,
		he,
		v,
		U
	]), J = L(() => q.map((e, t) => a(e, t)), [q, a]), Y = L(() => [...c === "multi" ? [{
		kind: "select",
		width: ft
	}] : [], ...r.map((e) => ({
		kind: "data",
		column: e,
		width: xe[e.id] ?? e.width ?? dt
	}))], [
		r,
		c,
		xe
	]), Ae = L(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), je = Y.map((e, t) => t === Ae ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Me = Y.reduce((e, t) => e + t.width, 0), Ne = L(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), Pe = L(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), Fe = F === "auto" ? q.length > 200 : F, Ie = ot(q.length, Ee.scrollTop, Ee.height, W, I, Fe), X = O && q.length === 0, Le = !O && q.length === 0, Re = X ? mt : O && q.length > 0 ? 1 : 0, ze = Le ? ht : (q.length + Re) * W, Be = N((e) => {
		if (o) return o(e);
		let t = r[0];
		if (!t) return "";
		let n = rt(t, e);
		return $(n, Z(n, t.kind, t.format), {
			locale: U,
			timeZone: ae
		});
	}, [
		o,
		r,
		U,
		ae
	]), Q = N((e) => {
		u === void 0 && ve(e), p?.(e);
	}, [u, p]), He = (e) => {
		let t = at(he, e);
		m === void 0 && me(t), _?.(t);
	};
	ee(() => {
		let e = le.current;
		if (!e) return;
		let t = () => De((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let Ue = (e) => (e - Math.max(1, Math.floor(I / 2))) * W, We = Ee.scrollTop + Ee.height >= Ue(q.length), Ge = () => {
		let e = le.current;
		if (!e) return;
		let t = ot(q.length, e.scrollTop, e.clientHeight, W, I, Fe), n = e.scrollTop + e.clientHeight >= Ue(q.length);
		(t.start !== Ie.start || t.end !== Ie.end || T && n !== We) && De({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	P(() => {
		we((e) => {
			let t = e.row < 0 || q.length === 0 ? -1 : Math.min(e.row, q.length - 1), n = Math.max(0, Math.min(e.column, Y.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [q.length, Y.length]), ee(() => {
		de.current && (de.current = !1, le.current?.querySelector(`[data-cell="${K.row}:${K.column}"]`)?.focus({ preventScroll: !0 }));
	}), P(() => {
		T && !O && q.length !== 0 && (D !== void 0 && q.length >= D || We && fe.current !== q.length && (fe.current = q.length, T()));
	}, [
		T,
		O,
		q.length,
		D,
		We
	]);
	let Ke = (e) => {
		let t = le.current;
		if (t && e.row >= 0) {
			let n = st(e.row, t.scrollTop, t.clientHeight, W, W);
			n !== t.scrollTop && (t.scrollTop = n, De({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		de.current = !0, we(e);
	}, qe = (e, t) => {
		if (c === "single") {
			Q([e]), G.current = e;
			return;
		}
		if (c === "multi") {
			if (t && G.current) {
				Q([.../* @__PURE__ */ new Set([...ye, ...ct(J, G.current, e)])]);
				return;
			}
			Q(be.has(e) ? ye.filter((t) => t !== e) : [...ye, e]), G.current = e;
		}
	}, Je = (e) => {
		let t = q[e];
		if (t !== void 0) {
			if (y) {
				y(t);
				return;
			}
			le.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Ye = (e, t, n) => {
		let r = q[e];
		r !== void 0 && C && C(r).length !== 0 && ke({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Xe = N(() => {
		ke(null), de.current = !0;
	}, []);
	Te(Oe !== null, ue, Xe);
	let Ze = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		Se((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, Qe = (e) => {
		if (gt(e.target) || Oe) return;
		let { row: t, column: n } = K, r = q.length, i = Math.max(1, Math.floor((le.current?.clientHeight ?? W * 10) / W) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), Ze(n, e.key === "ArrowRight" ? pt : -16);
			return;
		}
		let o = lt(K, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && c === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = J[o.row];
				e && (G.current ||= J[Math.max(0, t)] ?? e, Q([.../* @__PURE__ */ new Set([...ye, ...ct(J, G.current, e)])]));
			}
			Ke(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), He(a.column.id)) : e.key === " " && a?.kind === "select" && c === "multi" && (e.preventDefault(), Q(ye.length === J.length ? [] : [...J]));
			return;
		}
		let s = J[t];
		if (e.key === "Enter") e.preventDefault(), Je(t);
		else if (e.key === " " && s) e.preventDefault(), qe(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && c === "multi") e.preventDefault(), Q([...J]);
		else if (e.key === "F2" && w && a?.kind === "data") {
			e.preventDefault();
			let n = q[t];
			n !== void 0 && w(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Ye(t, n.left + 12, n.bottom);
		}
	}, $e = (e, t) => {
		let n = J[t];
		n && c !== "none" && (e.target.closest("a, button, input, select, textarea") || (c === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? qe(n, e.shiftKey) : (Q([n]), G.current = n)));
	}, tt = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? 48, o = r.column.id, s = (e) => {
			Se((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, nt = (e, t) => {
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
	for (let e = Ie.start; e < Ie.end; e++) _t.push(e);
	K.row >= 0 && K.row < q.length && (K.row < Ie.start || K.row >= Ie.end) && _t.push(K.row);
	let vt = c === "multi" && J.length > 0 && J.every((e) => be.has(e)), yt = c === "multi" && !vt && J.some((e) => be.has(e)), bt = Oe ? q[Oe.rowIndex] : void 0, xt = {
		"--mtc-grid-template": je,
		"--mtc-grid-min-width": `${Me}px`,
		"--mtc-grid-row-height": `${W}px`,
		"--mtc-grid-viewport-width": Ee.width > 0 ? `${Ee.width}px` : "100%"
	};
	return /* @__PURE__ */ H("div", {
		className: E("mtc-data-grid", A && `mtc-density-${A}`, re),
		style: {
			...xt,
			height: M
		},
		children: [
			/* @__PURE__ */ H("div", {
				ref: le,
				role: "grid",
				"aria-label": n,
				"aria-rowcount": (D ?? q.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": c === "multi" || void 0,
				"aria-busy": O || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: Qe,
				onScroll: Ge,
				children: [/* @__PURE__ */ V("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ V("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Y.map((t, n) => {
							if (t.kind === "select") return /* @__PURE__ */ V("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...nt(-1, n),
								children: /* @__PURE__ */ V("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": ie("dataGrid.selectAll"),
									checked: vt,
									ref: (e) => {
										e && (e.indeterminate = yt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Q(vt ? [] : [...J])
								})
							}, "__select");
							let { column: r } = t, i = he?.columnId === r.id ? he.direction : void 0, a = r.align === "end" || !r.align && !r.cell && Ve(Z(void 0, r.kind, r.format).kind), o = r.sortable !== !1;
							return /* @__PURE__ */ H("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...nt(-1, n),
								onClick: o ? () => {
									He(r.id), we({
										row: -1,
										column: n
									});
								} : void 0,
								children: [
									/* @__PURE__ */ V("span", {
										className: "mtc-data-grid-header-label",
										children: r.header
									}),
									i && /* @__PURE__ */ V(e, {
										name: i === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ V("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => tt(e, n),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, r.id);
						})
					})
				}), /* @__PURE__ */ H("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: ze },
					children: [
						_t.map((e) => {
							let t = q[e], n = J[e], r = be.has(n), i = b?.(t);
							return /* @__PURE__ */ V("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": c === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * W },
								...ne?.(t),
								onClick: (t) => $e(t, e),
								onDoubleClick: (t) => {
									t.target.closest("a, button, input, select, textarea") || Je(e);
								},
								onContextMenu: C ? (t) => {
									t.preventDefault(), c !== "none" && !r && Q([n]), we({
										row: e,
										column: K.column
									}), Ye(e, t.clientX, t.clientY);
								} : void 0,
								children: Y.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ V("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...nt(e, o),
										children: /* @__PURE__ */ V("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": ie("dataGrid.selectRow", { label: Be(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => qe(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = rt(s, t), l = Z(c, s.kind, s.format), u = s.align === "end" || !s.align && !s.cell && Ve(l.kind), d = s.cell ? s.cell(t, {
										value: c,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ V(et, {
										value: c,
										kind: s.kind,
										format: s.format,
										tones: s.tones,
										context: "grid"
									});
									return /* @__PURE__ */ V("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-align": u ? "end" : "start",
										...nt(e, o),
										children: i && o === Pe ? /* @__PURE__ */ V("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: _e(x ? (e) => x(t, e) : void 0),
											children: d
										}) : d
									}, s.id);
								})
							}, n);
						}),
						X && Array.from({ length: mt }, (e, t) => /* @__PURE__ */ V("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * W },
							children: Y.map((e, n) => /* @__PURE__ */ V("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ V(d, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						X && /* @__PURE__ */ V("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ V("div", {
								role: "gridcell",
								children: ie("dataGrid.loading")
							})
						}),
						O && q.length > 0 && /* @__PURE__ */ V("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: q.length * W },
							children: /* @__PURE__ */ V("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: ie("dataGrid.loadingMore")
							})
						}),
						Le && /* @__PURE__ */ V("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: ht
							},
							children: /* @__PURE__ */ V("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: k ?? /* @__PURE__ */ V(g, {
									compact: !0,
									title: ie("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			B && /* @__PURE__ */ V("div", {
				className: "mtc-data-grid-footer",
				children: B
			}),
			Oe && bt !== void 0 && C && (() => {
				let e = /* @__PURE__ */ V("div", {
					ref: ue,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ V(Ce, {
						label: ie("dataGrid.rowActions", { label: Be(bt) }),
						items: C(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: Oe.x,
							top: Oe.y
						},
						onClose: Xe
					})
				});
				return se ? te(e, se) : e;
			})()
		]
	});
}
//#endregion
//#region src/workbench/NavRail.tsx
var vt = j(function({ label: n, sections: r, activeId: i, onNavigate: o, collapsed: s = !1, onCollapsedChange: c, header: l, footer: u, className: d, ...f }, p) {
	let m = t();
	return /* @__PURE__ */ H("nav", {
		...f,
		ref: p,
		"aria-label": n,
		className: E("mtc-nav-rail", d),
		"data-collapsed": s || void 0,
		children: [
			l && /* @__PURE__ */ V("div", {
				className: "mtc-nav-rail-header",
				children: l
			}),
			/* @__PURE__ */ V("div", {
				className: "mtc-nav-rail-sections",
				children: r.map((t) => /* @__PURE__ */ H("div", {
					className: "mtc-nav-rail-section",
					children: [t.label && /* @__PURE__ */ V("div", {
						className: "mtc-nav-rail-section-label",
						"aria-hidden": s || void 0,
						children: t.label
					}), /* @__PURE__ */ V("ul", {
						"aria-label": t.label,
						children: t.items.map((t) => {
							let n = t.id === i, r = t.type ? (() => {
								let { icon: e, color: n } = X(t.type);
								return /* @__PURE__ */ V(U, {
									icon: e,
									color: n,
									size: 16
								});
							})() : t.icon ? /* @__PURE__ */ V(e, {
								name: t.icon,
								className: "mtc-nav-rail-icon"
							}) : null, a = /* @__PURE__ */ H(B, { children: [
								r,
								/* @__PURE__ */ V("span", {
									className: "mtc-nav-rail-label",
									children: t.label
								}),
								t.count != null && /* @__PURE__ */ V("span", {
									className: "mtc-nav-rail-count",
									children: t.count
								})
							] }), c = {
								className: "mtc-nav-rail-item",
								"data-active": n || void 0,
								"aria-current": n ? "page" : void 0,
								title: s ? t.label : void 0
							};
							return /* @__PURE__ */ V("li", { children: t.href && !t.disabled ? /* @__PURE__ */ V("a", {
								...c,
								href: t.href,
								onClick: _e(o ? (e) => o(t, e) : void 0),
								children: a
							}) : /* @__PURE__ */ V("button", {
								...c,
								type: "button",
								disabled: t.disabled,
								onClick: (e) => o?.(t, e),
								children: a
							}) }, t.id);
						})
					})]
				}, t.id))
			}),
			(u || c) && /* @__PURE__ */ H("div", {
				className: "mtc-nav-rail-footer",
				children: [u, c && /* @__PURE__ */ V(a, {
					icon: /* @__PURE__ */ V(e, { name: "panel-left" }),
					"aria-label": m(s ? "navRail.expand" : "navRail.collapse"),
					"aria-expanded": !s,
					variant: "ghost",
					size: "small",
					onClick: () => c(!s)
				})]
			})
		]
	});
}), yt = j(function({ breadcrumbs: e, title: t, description: n, actions: r, tabs: i, sticky: a = !1, className: o, children: s, ...c }, l) {
	return /* @__PURE__ */ H("div", {
		...c,
		ref: l,
		className: E("mtc-page-header", o),
		"data-sticky": a || void 0,
		children: [
			e && e.length > 0 && /* @__PURE__ */ V(ke, {
				items: e,
				className: "mtc-page-header-crumbs"
			}),
			/* @__PURE__ */ H("div", {
				className: "mtc-page-header-main",
				children: [/* @__PURE__ */ V("div", {
					className: "mtc-page-header-heading",
					children: s ?? /* @__PURE__ */ H(B, { children: [t && /* @__PURE__ */ V("h1", {
						className: "mtc-page-header-title",
						children: t
					}), n && /* @__PURE__ */ V("p", {
						className: "mtc-page-header-description",
						children: n
					})] })
				}), r && /* @__PURE__ */ V("div", {
					className: "mtc-page-header-actions",
					children: r
				})]
			}),
			i && /* @__PURE__ */ V("div", {
				className: "mtc-page-header-tabs",
				children: i
			})
		]
	});
}), bt = j(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ V("dl", {
		...a,
		ref: o,
		className: E("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ H("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ H("dt", { children: [/* @__PURE__ */ V("span", { children: e.label }), e.description && /* @__PURE__ */ V("small", { children: e.description })] }), /* @__PURE__ */ V("dd", { children: M(e.value) ? e.value : /* @__PURE__ */ V(et, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), xt = j(function({ type: e, title: n, objectId: r, status: i, meta: a, actions: o, compact: s = !1, headingLevel: c = s ? 2 : 1, typeHref: l, onTypeNavigate: u, className: d, style: p, ...m }, h) {
	let g = t(), { icon: _, color: y } = X(e), x = `h${c}`, S = !s && (i || a && a.length > 0);
	return /* @__PURE__ */ H("div", {
		...m,
		ref: h,
		className: E("mtc-object-header", d),
		"data-compact": s || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${y}-fg)`,
			...p
		},
		children: [
			/* @__PURE__ */ V(U, {
				icon: _,
				color: y,
				size: s ? 24 : 40
			}),
			/* @__PURE__ */ H("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ H("div", {
						className: "mtc-object-header-eyebrow",
						children: [l ? /* @__PURE__ */ V("a", {
							className: "mtc-object-header-type",
							href: l,
							onClick: _e(u),
							children: e.label
						}) : /* @__PURE__ */ V("span", {
							className: "mtc-object-header-type",
							children: e.label
						}), r && /* @__PURE__ */ H(B, { children: [
							/* @__PURE__ */ V("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ V("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ V(f, {
								value: r,
								label: g("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ V(x, {
						className: "mtc-object-header-title",
						children: n
					}),
					s && i && /* @__PURE__ */ V("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ V(b, {
							tone: i.tone,
							children: i.label
						})
					}),
					S && /* @__PURE__ */ H("div", {
						className: "mtc-object-header-meta",
						children: [i && /* @__PURE__ */ V(b, {
							tone: i.tone,
							children: i.label
						}), a && a.length > 0 && /* @__PURE__ */ V(v, { items: a })]
					})
				]
			}),
			o && /* @__PURE__ */ V("div", {
				className: "mtc-object-header-actions",
				children: o
			})
		]
	});
}), St = j(function({ properties: n, title: r, filterable: i = !0, actions: o, emptyValue: s, now: c, density: l, labelWidth: u = 160, onNavigate: d, headingLevel: f, className: p, style: m, ...h }, g) {
	let _ = t(), { locale: v, timeZone: y } = S(), b = F(), C = R(null), [w, T] = z(!1), [D, O] = z(""), k = L(() => {
		let e = D.trim().toLowerCase();
		return e ? n.filter((t) => {
			let n = $(t.value, Z(t.value, t.kind, t.format), {
				locale: v,
				timeZone: y
			});
			return t.label.toLowerCase().includes(e) || n.toLowerCase().includes(e);
		}) : n;
	}, [
		n,
		D,
		v,
		y
	]), A = L(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of k) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [k]), j = () => {
		w ? (O(""), T(!1)) : (T(!0), requestAnimationFrame(() => C.current?.focus()));
	};
	return /* @__PURE__ */ H(x, {
		...h,
		ref: g,
		title: r ?? _("propertyPanel.title"),
		subtitle: _("propertyPanel.count", {
			shown: k.length,
			total: n.length
		}),
		headingLevel: f,
		className: E("mtc-property-panel", l && `mtc-density-${l}`, p),
		style: {
			"--mtc-property-label-width": `${u}px`,
			...m
		},
		actions: (i || o) && /* @__PURE__ */ H(B, { children: [o, i && /* @__PURE__ */ V(a, {
			icon: /* @__PURE__ */ V(e, { name: "filter" }),
			"aria-label": _("propertyPanel.filter"),
			"aria-expanded": w,
			"aria-controls": w ? b : void 0,
			variant: w ? "outline" : "ghost",
			size: "small",
			onClick: j
		})] }),
		children: [w && /* @__PURE__ */ V("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ V(ae, {
				ref: C,
				id: b,
				type: "search",
				size: "small",
				value: D,
				"aria-label": _("propertyPanel.filter"),
				placeholder: _("propertyPanel.filter"),
				onChange: (e) => O(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), j());
				}
			})
		}), k.length === 0 ? /* @__PURE__ */ V("p", {
			className: "mtc-property-panel-empty",
			children: _("propertyPanel.noMatch", { query: D.trim() })
		}) : A.map(([e, t]) => /* @__PURE__ */ H("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ V("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ V("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ H("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ H("dt", { children: [/* @__PURE__ */ V("span", { children: e.label }), e.description && /* @__PURE__ */ V("small", { children: e.description })] }), /* @__PURE__ */ V("dd", { children: /* @__PURE__ */ V(et, {
						value: e.value,
						kind: e.kind,
						format: e.format,
						tones: e.tones,
						emptyValue: s,
						now: c,
						onNavigate: d
					}) })]
				}, e.id))
			})]
		}, e || "_"))]
	});
}), Ct = .4, wt = 3, Tt = 1.25, Et = .8, Dt = {
	x: 0,
	y: 0,
	zoom: 1
};
function Ot({ label: n, width: r, height: i, viewHeight: o, children: s }) {
	let c = t(), l = R(null), u = R(null), d = R(null), [f, p] = z(0), [m, h] = z(Dt);
	ee(() => {
		let e = l.current;
		if (!e) return;
		let t = () => p(e.clientWidth);
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let g = f || r, _ = Math.min(1, Math.max(Et, Math.min(g / r, o / i))) * m.zoom, v = (g - r * _) / 2 + m.x, y = (o - i * _) / 2 + m.y, b = (e) => h((t) => ({
		...t,
		zoom: Math.min(wt, Math.max(Ct, t.zoom * e))
	})), x = (e) => {
		e.target.closest("[data-graph-node]") || (d.current = {
			pointerId: e.pointerId,
			x: e.clientX,
			y: e.clientY,
			offset: m
		}, e.currentTarget.setPointerCapture?.(e.pointerId));
	}, S = (e) => {
		let t = d.current;
		t && t.pointerId === e.pointerId && h({
			...t.offset,
			x: t.offset.x + e.clientX - t.x,
			y: t.offset.y + e.clientY - t.y
		});
	}, C = () => {
		d.current = null;
	};
	return /* @__PURE__ */ H("div", {
		ref: l,
		className: "mtc-graph-canvas",
		style: { height: o },
		children: [/* @__PURE__ */ V("svg", {
			ref: u,
			role: "group",
			"aria-label": n,
			width: g,
			height: o,
			viewBox: `0 0 ${g} ${o}`,
			className: "mtc-graph-svg",
			onPointerDown: x,
			onPointerMove: S,
			onPointerUp: C,
			onPointerCancel: C,
			onWheel: (e) => {
				(e.ctrlKey || e.metaKey) && (e.preventDefault(), b(e.deltaY < 0 ? Tt : 1 / Tt));
			},
			onKeyDown: (e) => {
				if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
				let t = [...u.current?.querySelectorAll("[data-graph-node]") ?? []], n = t.indexOf(document.activeElement);
				n < 0 || (e.preventDefault(), t[(n + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length]?.focus());
			},
			children: /* @__PURE__ */ V("g", {
				transform: `translate(${kt(v)} ${kt(y)}) scale(${kt(_)})`,
				children: s
			})
		}), /* @__PURE__ */ H("div", {
			className: "mtc-graph-controls",
			children: [
				/* @__PURE__ */ V(a, {
					icon: /* @__PURE__ */ V(e, { name: "add" }),
					"aria-label": c("graph.zoomIn"),
					size: "small",
					onClick: () => b(Tt)
				}),
				/* @__PURE__ */ V(a, {
					icon: /* @__PURE__ */ V(e, { name: "minus" }),
					"aria-label": c("graph.zoomOut"),
					size: "small",
					onClick: () => b(1 / Tt)
				}),
				/* @__PURE__ */ V(a, {
					icon: /* @__PURE__ */ V(e, { name: "refresh" }),
					"aria-label": c("graph.reset"),
					size: "small",
					onClick: () => h(Dt)
				})
			]
		})]
	});
}
function kt(e) {
	return Math.round(e * 1e3) / 1e3;
}
//#endregion
//#region src/objects/linkGraphLayout.ts
function At(e, t) {
	let n = e.map((e) => Math.min(e.items.length, Math.max(0, e.count))), r = (t) => t.reduce((t, n, r) => t + n + +(e[r].count > n), 0), i = [...n];
	for (; r(i) > t;) {
		let e = -1;
		for (let t = 0; t < i.length; t++) i[t] > 1 && (e < 0 || i[t] > i[e]) && (e = t);
		if (e < 0) break;
		--i[e];
	}
	return i;
}
var jt = 40, Mt = 120, Nt = .6;
function Pt(e, t = 40) {
	let n = At(e, t), r = n.map((t, n) => t + +(e[n].count > t)), i = r.reduce((e, t) => e + t, 0);
	if (i === 0) return {
		nodes: [],
		labels: [],
		radius: Mt
	};
	let a = i + (e.length > 1 ? e.length * Nt : 0), o = Math.max(Mt, i * jt / (2 * Math.PI)), s = 2 * Math.PI / a, c = [], l = [], u = Math.PI - (e.length > 1 ? Nt * s / 2 : 0);
	return e.forEach((t, i) => {
		let a = r[i];
		if (a === 0) return;
		let d = u + (e.length > 1 ? Nt * s / 2 : 0), f = (e) => d + (e + .5) * s, p = t.items.slice(0, n[i]);
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
		}), u = d + a * s + (e.length > 1 ? Nt * s / 2 : 0);
	}), {
		nodes: c,
		labels: l,
		radius: o
	};
}
//#endregion
//#region src/objects/LinkGraph.tsx
var Ft = 24, It = 40, Lt = 150, Rt = 22, zt = 16;
function Bt(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Vt({ x: e, y: t, size: n, color: r, icon: i, center: a }) {
	return /* @__PURE__ */ H("g", {
		className: "mtc-graph-glyph",
		"data-center": a || void 0,
		style: r ? { color: `var(--mtc-type-${r}-fg)` } : void 0,
		children: [/* @__PURE__ */ V("rect", {
			x: e - n / 2,
			y: t - n / 2,
			width: n,
			height: n,
			rx: 4,
			fill: r ? `var(--mtc-type-${r}-bg)` : "var(--mtc-panel)"
		}), i]
	});
}
function Ht({ center: n, groups: r, label: i, maxNodes: a = 40, height: o = 320, onNavigate: s }) {
	let c = t(), l = L(() => Pt(r, a), [r, a]), u = l.nodes.length > zt, d = l.radius + Ft + Lt, f = l.radius + Ft + 16, p = d * 2, m = f * 2, h = d, g = f, _ = n.type ? X(n.type) : null, v = (e) => {
		if (e.kind === "item" && e.item) return {
			object: e.item,
			href: e.item.href
		};
		let t = r[e.groupIndex];
		return t ? {
			object: {
				id: `${t.id}:all`,
				title: t.relation,
				type: t.targetType
			},
			href: t.viewAllHref
		} : null;
	}, y = (e, t) => (n) => {
		if (!s || !ge(n)) {
			t || n.preventDefault();
			return;
		}
		n.preventDefault(), s(e, n);
	};
	return /* @__PURE__ */ H(Ot, {
		label: i,
		width: p,
		height: m,
		viewHeight: o,
		children: [
			/* @__PURE__ */ V("g", {
				className: "mtc-graph-edges",
				children: l.nodes.map((e) => /* @__PURE__ */ V("line", {
					x1: h,
					y1: g,
					x2: h + e.x,
					y2: g + e.y,
					className: "mtc-graph-edge",
					"data-direction": r[e.groupIndex]?.direction ?? "outgoing"
				}, `edge:${e.key}`))
			}),
			l.labels.map((e) => /* @__PURE__ */ V("text", {
				x: h + e.x,
				y: g + e.y,
				textAnchor: "middle",
				dominantBaseline: "middle",
				className: "mtc-graph-edge-label",
				children: Bt(e.text, 18)
			}, `label:${e.groupIndex}`)),
			/* @__PURE__ */ V("g", {
				className: "mtc-graph-node",
				"data-center": "true",
				"aria-hidden": "true",
				children: /* @__PURE__ */ V(Vt, {
					x: h,
					y: g,
					size: It,
					center: !0,
					color: _?.color ?? null,
					icon: /* @__PURE__ */ V(e, {
						name: _?.icon ?? "object",
						x: h - 11,
						y: g - 11,
						width: 22,
						height: 22,
						size: 22
					})
				})
			}),
			l.nodes.map((t) => {
				let n = v(t);
				if (!n) return null;
				let i = r[t.groupIndex], a = X(i.targetType), o = h + t.x, l = g + t.y, d = Math.cos(t.angle), f = d >= 0, p = u, m = p ? f ? "start" : "end" : d > .25 ? "start" : d < -.25 ? "end" : "middle", _ = p ? o + Math.cos(t.angle) * 20 : m === "start" ? o + 20 : m === "end" ? o - 20 : o, b = p ? l + Math.sin(t.angle) * 20 : m === "middle" ? l + (Math.sin(t.angle) > 0 ? 26 : -20) : l, x = p ? t.angle * 180 / Math.PI + (f ? 0 : 180) : 0, S = t.kind === "more" ? c("graph.more", { count: t.moreCount ?? 0 }) : t.item?.title ?? "", C = t.kind === "more" ? c("graph.moreLabel", {
					count: t.moreCount ?? 0,
					relation: i.relation,
					type: i.targetType.label
				}) : `${S}, ${i.relation}`, w = !!(n.href || s);
				return /* @__PURE__ */ H("a", {
					href: n.href,
					"data-graph-node": w || void 0,
					className: "mtc-graph-node",
					"data-kind": t.kind,
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
					children: [t.kind === "more" ? /* @__PURE__ */ H("g", {
						className: "mtc-graph-more",
						children: [/* @__PURE__ */ V("rect", {
							x: o - Ft / 2,
							y: l - Ft / 2,
							width: Ft,
							height: Ft,
							rx: Ft / 2
						}), /* @__PURE__ */ H("text", {
							x: o,
							y: l,
							textAnchor: "middle",
							dominantBaseline: "central",
							children: ["+", t.moreCount]
						})]
					}) : /* @__PURE__ */ V(Vt, {
						x: o,
						y: l,
						size: Ft,
						color: a.color,
						icon: /* @__PURE__ */ V(e, {
							name: a.icon,
							x: o - 7,
							y: l - 7,
							width: 14,
							height: 14,
							size: 14,
							strokeWidth: 2
						})
					}), /* @__PURE__ */ V("text", {
						x: _,
						y: b,
						textAnchor: m,
						dominantBaseline: "middle",
						transform: x ? `rotate(${x.toFixed(2)} ${_.toFixed(2)} ${b.toFixed(2)})` : void 0,
						className: "mtc-graph-node-label",
						children: Bt(S, Rt)
					})]
				}, t.key);
			})
		]
	});
}
//#endregion
//#region src/objects/LinkPanel.tsx
function Ut({ group: n }) {
	let r = t(), { icon: i, color: a } = X(n.targetType), o = n.direction === "incoming";
	return /* @__PURE__ */ H("div", {
		className: "mtc-link-relation",
		children: [
			o && /* @__PURE__ */ V(e, {
				name: "arrow-left",
				label: r("linkPanel.incoming"),
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ V("span", {
				className: "mtc-link-relation-name",
				children: n.relation
			}),
			!o && /* @__PURE__ */ V(e, {
				name: "arrow-right",
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ V(U, {
				icon: i,
				color: a,
				size: 16
			}),
			/* @__PURE__ */ V("span", {
				className: "mtc-link-relation-type",
				children: n.targetType.label
			}),
			/* @__PURE__ */ V("span", {
				className: "mtc-link-relation-count",
				children: n.count
			})
		]
	});
}
var Wt = j(function({ groups: e, title: n, subtitle: r, maxItems: i = 3, actions: a, onNavigate: o, headingLevel: s, className: c, ...l }, u) {
	let d = t(), f = e.reduce((e, t) => e + t.count, 0);
	return /* @__PURE__ */ V(x, {
		...l,
		ref: u,
		title: n ?? d("linkPanel.title"),
		subtitle: r ?? d("linkPanel.summary", {
			types: e.length,
			objects: f
		}),
		actions: a,
		headingLevel: s,
		className: E("mtc-link-panel", c),
		children: e.length === 0 ? /* @__PURE__ */ V("p", {
			className: "mtc-link-panel-empty",
			children: d("linkPanel.empty")
		}) : e.map((e) => {
			let t = e.items.slice(0, i), n = e.count > t.length;
			return /* @__PURE__ */ H("section", {
				className: "mtc-link-group",
				"aria-label": `${e.relation} ${e.targetType.label}`,
				children: [
					/* @__PURE__ */ V(Ut, { group: e }),
					t.length > 0 && /* @__PURE__ */ V("ul", {
						className: "mtc-link-items",
						children: t.map((e) => /* @__PURE__ */ H("li", {
							className: "mtc-link-item",
							children: [/* @__PURE__ */ V(Re, {
								object: e,
								onNavigate: o,
								mono: e.mono,
								className: "mtc-link-item-chip"
							}), e.detail != null && /* @__PURE__ */ V("span", {
								className: "mtc-link-item-detail",
								children: e.detail
							})]
						}, e.id))
					}),
					n && (e.viewAllHref || e.onViewAll) && (e.viewAllHref ? /* @__PURE__ */ V("a", {
						className: "mtc-link-view-all",
						href: e.viewAllHref,
						onClick: _e(e.onViewAll),
						children: e.viewAllLabel ?? d("linkPanel.viewAll", { count: e.count })
					}) : /* @__PURE__ */ V("button", {
						type: "button",
						className: "mtc-link-view-all",
						onClick: e.onViewAll,
						children: e.viewAllLabel ?? d("linkPanel.viewAll", { count: e.count })
					}))
				]
			}, e.id);
		})
	});
}), Gt = 176, Kt = 44, qt = 20, Jt = 56;
function Yt(e, t, n, r, i) {
	if (e === "right") {
		if (r > t) {
			let e = (r - t) / 2;
			return `M${t} ${n} C${t + e} ${n} ${r - e} ${i} ${r - 2} ${i}`;
		}
		let e = t - Gt, a = r + Gt;
		return `M${e} ${n} C${e - Jt} ${n} ${a + Jt} ${i} ${a + 2} ${i}`;
	}
	if (i > n) {
		let e = (i - n) / 2;
		return `M${t} ${n} C${t} ${n + e} ${r} ${i - e} ${r} ${i - 2}`;
	}
	let a = n - Kt, o = i + Kt;
	return `M${t} ${a} C${t} ${a - Jt} ${r} ${o + Jt} ${r} ${o + 2}`;
}
function Xt(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Zt({ types: t, relations: n, label: r, selectedId: i, onSelect: a, height: s = 360, direction: c = "right" }) {
	let { locale: l } = S(), u = `mtc-schema-arrow-${F().replace(/[^a-zA-Z0-9_-]/g, "")}`, d = L(() => D(t, n, {
		nodeWidth: Gt,
		nodeHeight: Kt,
		rankGap: c === "right" ? 272 : 116,
		nodeGap: c === "right" ? 28 : 24,
		padding: 24,
		direction: c
	}), [
		t,
		n,
		c
	]);
	if (!d) return null;
	let f = (e) => (t) => {
		a && ge(t) && (t.preventDefault(), a(e, t));
	};
	return /* @__PURE__ */ H(Ot, {
		label: r,
		width: d.width,
		height: d.height,
		viewHeight: s,
		children: [
			/* @__PURE__ */ V("defs", { children: /* @__PURE__ */ V("marker", {
				id: u,
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				markerUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ V("path", {
					d: "M0,0 L0,8 L8,4 z",
					className: "mtc-graph-arrow"
				})
			}) }),
			/* @__PURE__ */ V("g", {
				className: "mtc-graph-edges",
				children: d.edges.map(({ edge: e, x1: t, y1: n, x2: r, y2: a }, o) => {
					let s = Yt(c, t, n, r, a), l = i !== void 0 && (e.from === i || e.to === i);
					return /* @__PURE__ */ H("g", { children: [/* @__PURE__ */ V("path", {
						d: s,
						className: "mtc-graph-edge",
						"data-active": l || void 0,
						markerEnd: `url(#${u})`
					}), /* @__PURE__ */ V("text", {
						x: (t + r) / 2,
						y: (n + a) / 2 - 6,
						textAnchor: "middle",
						className: "mtc-graph-edge-label",
						children: Xt(e.label, 18)
					})] }, e.id ?? `${e.from}:${e.to}:${o}`);
				})
			}),
			d.nodes.map(({ node: t, x: n, y: r }) => {
				let { icon: s, color: c } = X(t), u = t.id === i, d = !!(t.href || a), p = t.count === void 0 ? t.label : `${t.label}, ${o(t.count, { locale: l })}`;
				return /* @__PURE__ */ H("a", {
					href: t.href,
					role: t.href ? void 0 : d ? "button" : "img",
					tabIndex: t.href ? void 0 : d ? 0 : void 0,
					"aria-label": p,
					"aria-current": u || void 0,
					"data-graph-node": d || void 0,
					"data-selected": u || void 0,
					className: "mtc-graph-node mtc-schema-node",
					onClick: f(t),
					onKeyDown: d ? (e) => {
						(e.key === "Enter" || e.key === " " && !t.href) && (e.preventDefault(), a ? a(t, e) : e.currentTarget.dispatchEvent(new MouseEvent("click", {
							bubbles: !0,
							cancelable: !0
						})));
					} : void 0,
					children: [
						/* @__PURE__ */ V("rect", {
							x: n,
							y: r,
							width: Gt,
							height: Kt,
							rx: 4,
							className: "mtc-schema-node-box"
						}),
						/* @__PURE__ */ H("g", {
							style: { color: `var(--mtc-type-${c}-fg)` },
							children: [/* @__PURE__ */ V("rect", {
								x: n + 10,
								y: r + 10,
								width: 24,
								height: 24,
								rx: 4,
								fill: `var(--mtc-type-${c}-bg)`
							}), /* @__PURE__ */ V(e, {
								name: s,
								x: n + 15,
								y: r + 15,
								width: 14,
								height: 14,
								size: 14,
								strokeWidth: 2
							})]
						}),
						/* @__PURE__ */ V("text", {
							x: n + 44,
							y: t.count === void 0 ? r + Kt / 2 : r + 18,
							dominantBaseline: "middle",
							className: "mtc-graph-node-label",
							"data-emphasis": "true",
							children: Xt(t.label, qt)
						}),
						t.count !== void 0 && /* @__PURE__ */ V("text", {
							x: n + 44,
							y: r + 32,
							dominantBaseline: "middle",
							className: "mtc-graph-node-meta",
							children: o(t.count, { locale: l })
						})
					]
				}, t.id);
			})
		]
	});
}
//#endregion
//#region src/objects/ActivityFeed.tsx
function Qt(e) {
	let t = e instanceof Date ? e : new Date(e);
	return Number.isNaN(t.getTime()) ? String(e) : t.toISOString();
}
var $t = j(function({ items: e, variant: n = "feed", now: a, onNavigate: o, emptyLabel: s, className: c, ...l }, u) {
	let d = t(), { locale: f, timeZone: m } = S();
	return e.length === 0 ? /* @__PURE__ */ V("p", {
		className: "mtc-activity-empty",
		children: s ?? d("activity.empty")
	}) : /* @__PURE__ */ V("ol", {
		...l,
		ref: u,
		className: E("mtc-activity-feed", c),
		"data-variant": n,
		children: e.map((e) => {
			let t = Qt(e.timestamp), s = i(e.timestamp, {
				locale: f,
				timeZone: m
			});
			return /* @__PURE__ */ H("li", {
				className: "mtc-activity-item",
				"data-tone": e.tone ?? "neutral",
				children: [
					n === "timeline" ? /* @__PURE__ */ V("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}) : e.actor ? /* @__PURE__ */ V(p, {
						name: e.actor.name,
						src: e.actor.avatarSrc,
						decorative: !0
					}) : /* @__PURE__ */ V("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ H("p", {
						className: "mtc-activity-text",
						children: [
							e.actor && /* @__PURE__ */ V("span", {
								className: "mtc-activity-actor",
								children: e.actor.name
							}),
							" ",
							/* @__PURE__ */ V("span", {
								className: "mtc-activity-verb",
								children: e.verb
							}),
							e.object && /* @__PURE__ */ H(B, { children: [" ", /* @__PURE__ */ V(Re, {
								object: e.object,
								onNavigate: o
							})] }),
							e.summary != null && /* @__PURE__ */ H(B, { children: [" ", /* @__PURE__ */ V("span", {
								className: "mtc-activity-summary",
								children: e.summary
							})] })
						]
					}),
					/* @__PURE__ */ V("time", {
						className: "mtc-activity-time",
						dateTime: t,
						title: n === "timeline" ? t : s,
						children: n === "timeline" ? s : r(e.timestamp, {
							locale: f,
							now: a ?? Date.now()
						})
					})
				]
			}, e.id);
		})
	});
}), en = j(function({ label: n, groups: r, onChange: i, onClear: a, className: s, ...c }, l) {
	let u = t(), { locale: d } = S(), [f, p] = z(/* @__PURE__ */ new Set()), m = r.some((e) => e.selected.length > 0);
	return /* @__PURE__ */ H("div", {
		...c,
		ref: l,
		role: "group",
		"aria-label": n,
		className: E("mtc-facet-list", s),
		children: [a && m && /* @__PURE__ */ V("div", {
			className: "mtc-facet-list-header",
			children: /* @__PURE__ */ V("button", {
				type: "button",
				className: "mtc-facet-clear",
				onClick: a,
				children: u("facet.clear")
			})
		}), r.map((t) => {
			let n = t.maxVisible ?? 8, r = f.has(t.id), a = t.options.length - n, s = r || a <= 0 ? t.options : t.options.slice(0, n), c = `mtc-facet-${t.id}`;
			return /* @__PURE__ */ H("fieldset", {
				className: "mtc-facet-group",
				children: [
					/* @__PURE__ */ V("legend", {
						className: "mtc-facet-legend",
						children: t.label
					}),
					/* @__PURE__ */ V("div", {
						className: "mtc-facet-options",
						children: s.map((n) => {
							let r = t.selected.includes(n.value), a = n.type ? X(n.type) : null;
							return /* @__PURE__ */ H("label", {
								className: "mtc-facet-option",
								"data-mode": t.mode,
								"data-checked": r || void 0,
								children: [
									/* @__PURE__ */ V("input", {
										type: t.mode === "single" ? "radio" : "checkbox",
										name: c,
										value: n.value,
										checked: r,
										className: t.mode === "single" ? "mtc-visually-hidden" : "mtc-facet-checkbox",
										onChange: () => {
											t.mode === "single" ? i(t.id, [n.value]) : i(t.id, r ? t.selected.filter((e) => e !== n.value) : [...t.selected, n.value]);
										}
									}),
									a ? /* @__PURE__ */ V(U, {
										icon: a.icon,
										color: a.color,
										size: 16
									}) : n.icon ? /* @__PURE__ */ V(e, {
										name: n.icon,
										className: "mtc-facet-icon"
									}) : null,
									/* @__PURE__ */ V("span", {
										className: "mtc-facet-label",
										children: n.label
									}),
									n.count !== void 0 && /* @__PURE__ */ V("span", {
										className: "mtc-facet-count",
										children: o(n.count, { locale: d })
									})
								]
							}, n.value);
						})
					}),
					a > 0 && /* @__PURE__ */ V("button", {
						type: "button",
						className: "mtc-facet-more",
						"aria-expanded": r,
						onClick: () => p((e) => {
							let n = new Set(e);
							return r ? n.delete(t.id) : n.add(t.id), n;
						}),
						children: r ? u("facet.showLess") : u("facet.showMore", { count: a })
					})
				]
			}, t.id);
		})]
	});
}), tn = j(function({ code: e, label: n, language: r, maxLines: i = 5e3, startLine: a = 1, highlightLines: s, wrap: c, defaultWrap: l = !1, onWrapChange: u, truncatedNotice: d, copyable: p = !0, height: m, className: h, style: g, ..._ }, v) {
	let y = t(), { locale: b } = S(), [x, C] = T({
		value: c,
		defaultValue: l,
		onChange: u
	}), w = L(() => {
		let t = e.replace(/\r\n?/g, "\n").split("\n");
		return t.length > 1 && t[t.length - 1] === "" && t.pop(), t;
	}, [e]), D = w.length > i ? w.slice(0, i) : w, O = L(() => new Set(s), [s]);
	return /* @__PURE__ */ H("div", {
		..._,
		ref: v,
		className: E("mtc-code-view", h),
		style: g,
		children: [
			/* @__PURE__ */ H("div", {
				className: "mtc-code-view-toolbar",
				children: [
					r && /* @__PURE__ */ V("span", {
						className: "mtc-code-view-language",
						children: r
					}),
					/* @__PURE__ */ V("span", {
						className: "mtc-code-view-count",
						children: y("code.lines", { count: o(w.length, { locale: b }) })
					}),
					/* @__PURE__ */ H("label", {
						className: "mtc-code-view-wrap",
						children: [/* @__PURE__ */ V("input", {
							type: "checkbox",
							checked: x,
							onChange: (e) => C(e.target.checked)
						}), y("code.wrap")]
					}),
					p && /* @__PURE__ */ V(f, {
						value: e,
						label: y("code.copy")
					})
				]
			}),
			(d || D.length < w.length) && /* @__PURE__ */ V("p", {
				className: "mtc-code-view-notice",
				role: "note",
				children: d ?? y("code.truncated", {
					shown: o(D.length, { locale: b }),
					total: o(w.length, { locale: b })
				})
			}),
			/* @__PURE__ */ V("pre", {
				className: "mtc-code-view-body",
				"data-wrap": x || void 0,
				tabIndex: 0,
				"aria-label": n,
				style: {
					"--mtc-code-start": a - 1,
					"--mtc-code-gutter": `${String(a + D.length - 1).length + 1}ch`,
					maxHeight: m
				},
				children: /* @__PURE__ */ V("code", { children: D.map((e, t) => /* @__PURE__ */ V("span", {
					className: "mtc-code-line",
					"data-highlight": O.has(a + t) || void 0,
					children: e
				}, t)) })
			})
		]
	});
});
//#endregion
//#region src/files/markdown.ts
async function nn(e) {
	let [{ marked: t }, { default: n }] = await Promise.all([import("./marked.esm-B3MwSSSj.js"), import("./purify.es-B3aQ6p7I.js")]);
	try {
		let r = await t.parse(e, { async: !0 });
		return n.sanitize(r, {
			FORBID_TAGS: [
				"style",
				"form",
				"input",
				"button"
			],
			FORBID_ATTR: ["style"]
		});
	} catch {
		return `<pre>${rn(e)}</pre>`;
	}
}
function rn(e) {
	return e.replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
//#endregion
//#region src/files/previewPolicy.ts
var an = {
	textBytes: 1e6,
	delimitedBytes: 2e6,
	imageBytes: 2e7,
	pdfBytes: 5e7,
	rows: 1e3,
	columns: 100,
	cellCharacters: 2e4
}, on = {
	png: "png",
	jpg: "jpeg",
	jpeg: "jpeg",
	gif: "gif",
	webp: "webp"
}, sn = /* @__PURE__ */ new Set([
	"mp4",
	"m4v",
	"webm",
	"mov"
]), cn = /* @__PURE__ */ new Set([
	"mp3",
	"m4a",
	"aac",
	"wav",
	"ogg",
	"oga",
	"opus",
	"flac"
]), ln = /* @__PURE__ */ new Set([
	"txt",
	"log",
	"text",
	"env",
	"gitignore"
]), un = /* @__PURE__ */ new Set(["md", "markdown"]), dn = {
	ts: "TypeScript",
	tsx: "TypeScript",
	mts: "TypeScript",
	cts: "TypeScript",
	js: "JavaScript",
	jsx: "JavaScript",
	mjs: "JavaScript",
	cjs: "JavaScript",
	py: "Python",
	go: "Go",
	rs: "Rust",
	java: "Java",
	kt: "Kotlin",
	scala: "Scala",
	c: "C",
	h: "C",
	cc: "C++",
	cpp: "C++",
	hpp: "C++",
	cs: "C#",
	swift: "Swift",
	rb: "Ruby",
	php: "PHP",
	lua: "Lua",
	r: "R",
	sh: "Shell",
	bash: "Shell",
	zsh: "Shell",
	sql: "SQL",
	proto: "Protocol Buffers",
	graphql: "GraphQL",
	gql: "GraphQL",
	yaml: "YAML",
	yml: "YAML",
	toml: "TOML",
	ini: "INI",
	cfg: "INI",
	conf: "Config",
	xml: "XML",
	svg: "SVG",
	html: "HTML",
	htm: "HTML",
	css: "CSS",
	scss: "SCSS",
	tf: "Terraform",
	hcl: "HCL",
	ndjson: "NDJSON",
	jsonl: "NDJSON",
	dockerfile: "Dockerfile",
	makefile: "Makefile"
};
function fn(e) {
	let t = e.split("/").pop()?.toLowerCase() ?? "", n = t.lastIndexOf(".");
	return n <= 0 ? t : t.slice(n + 1);
}
function pn(e, t) {
	let n = fn(e), r = e.split("/").pop()?.includes(".") ?? !1;
	if (on[n]) return {
		kind: "image",
		raster: on[n]
	};
	if (n === "pdf") return { kind: "pdf" };
	if (sn.has(n)) return { kind: "video" };
	if (cn.has(n)) return { kind: "audio" };
	if (n === "csv") return { kind: "csv" };
	if (n === "tsv") return { kind: "tsv" };
	if (n === "json") return {
		kind: "json",
		language: "JSON"
	};
	if (un.has(n)) return { kind: "markdown" };
	if (dn[n]) return {
		kind: "code",
		language: dn[n]
	};
	if (ln.has(n)) return { kind: "text" };
	if (r || !t) return { kind: "unsupported" };
	let i = t.split(";")[0].trim().toLowerCase();
	return i === "image/png" ? {
		kind: "image",
		raster: "png"
	} : i === "image/jpeg" ? {
		kind: "image",
		raster: "jpeg"
	} : i === "image/gif" ? {
		kind: "image",
		raster: "gif"
	} : i === "image/webp" ? {
		kind: "image",
		raster: "webp"
	} : i === "application/pdf" ? { kind: "pdf" } : i === "application/json" ? {
		kind: "json",
		language: "JSON"
	} : i === "text/csv" ? { kind: "csv" } : i === "text/markdown" ? { kind: "markdown" } : i === "text/plain" ? { kind: "text" } : i.startsWith("video/") ? { kind: "video" } : i.startsWith("audio/") ? { kind: "audio" } : { kind: "unsupported" };
}
function mn(e) {
	return e.length >= 5 && e[0] === 37 && e[1] === 80 && e[2] === 68 && e[3] === 70 && e[4] === 45;
}
function hn(e, t) {
	switch (e) {
		case "png": return t.length >= 8 && t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 && t[4] === 13 && t[5] === 10 && t[6] === 26 && t[7] === 10;
		case "jpeg": return t.length >= 3 && t[0] === 255 && t[1] === 216 && t[2] === 255;
		case "gif": return t.length >= 6 && t[0] === 71 && t[1] === 73 && t[2] === 70 && t[3] === 56 && (t[4] === 55 || t[4] === 57) && t[5] === 97;
		case "webp": return t.length >= 12 && t[0] === 82 && t[1] === 73 && t[2] === 70 && t[3] === 70 && t[8] === 87 && t[9] === 69 && t[10] === 66 && t[11] === 80;
	}
}
async function gn(e, t) {
	if (!e.body) {
		let n = new Uint8Array(await e.arrayBuffer());
		return {
			bytes: n.slice(0, t),
			truncated: n.length > t
		};
	}
	let n = e.body.getReader(), r = [], i = 0, a = !1;
	for (;;) {
		let { done: e, value: o } = await n.read();
		if (e) break;
		let s = t - i;
		if (o.length > s) {
			r.push(o.slice(0, s)), i += s, a = !0, await n.cancel();
			break;
		}
		r.push(o), i += o.length;
	}
	let o = new Uint8Array(i), s = 0;
	for (let e of r) o.set(e, s), s += e.length;
	return {
		bytes: o,
		truncated: a
	};
}
function _n(e) {
	let t = e ? /\/(\d+)\s*$/.exec(e) : null;
	return t ? Number(t[1]) : void 0;
}
function vn(e, t) {
	let n = new TextDecoder("utf-8", { fatal: !1 }).decode(e, { stream: t });
	return n.charCodeAt(0) === 65279 ? n.slice(1) : n;
}
function yn(e, t, { rows: n, columns: r, cellCharacters: i } = an) {
	let a = e.charCodeAt(0) === 65279 ? e.slice(1) : e, o = [];
	if (!a) return {
		rows: o,
		sourceRowCount: 0,
		sourceColumnCount: 0,
		truncatedRows: !1,
		truncatedColumns: !1,
		truncatedCells: !1
	};
	let s = [], c = "", l = 0, u = 0, d = 0, f = !1, p = !1, m = !1, h = !1, g = !1, _ = !1, v = (e) => {
		if (c.length < i) {
			let t = i - c.length;
			c += e.slice(0, t), e.length > t && (_ = !0);
		} else e.length > 0 && (_ = !0);
	}, y = () => {
		l < r ? s.push(c) : g = !0, l += 1, c = "", p = !1, m = !1;
	}, b = () => {
		y(), u += 1, d = Math.max(d, l), o.length < n && o.push(s), s = [], l = 0;
	};
	for (let e = 0; e < a.length; e += 1) {
		let n = a[e];
		if (h = !1, f) {
			n === "\"" ? a[e + 1] === "\"" ? (v("\""), e += 1) : (f = !1, m = !0) : v(n);
			continue;
		}
		if (m && n !== t && n !== "\r" && n !== "\n") throw Error("Unexpected character after a closing quote.");
		if (n === "\"") {
			if (c.length > 0 || p) throw Error("Unexpected quote in an unquoted field.");
			p = !0, f = !0;
			continue;
		}
		if (n === t) {
			y();
			continue;
		}
		if (n === "\r" || n === "\n") {
			n === "\r" && a[e + 1] === "\n" && (e += 1), b(), h = !0;
			continue;
		}
		v(n);
	}
	if (f) throw Error("The final quoted field is not closed.");
	return h || b(), {
		rows: o,
		sourceRowCount: u,
		sourceColumnCount: d,
		truncatedRows: u > n,
		truncatedColumns: g || d > r,
		truncatedCells: _
	};
}
//#endregion
//#region src/files/FilePreview.tsx
var bn = {
	png: "image/png",
	jpeg: "image/jpeg",
	gif: "image/gif",
	webp: "image/webp"
};
function xn({ file: r, fetch: i, limits: a, onDownload: o, height: s = 480, className: c }) {
	let l = t(), { locale: u } = S(), d = L(() => ({
		...an,
		...a
	}), [a]), f = L(() => pn(r.name, r.contentType), [r.name, r.contentType]), [p, v] = z({ state: "loading" });
	P(() => {
		let e = new AbortController(), t;
		return v({ state: "loading" }), (async () => {
			let n = i ?? globalThis.fetch;
			switch (f.kind) {
				case "unsupported": return { state: "unsupported" };
				case "video":
				case "audio": return { state: "media" };
				case "image":
				case "pdf": {
					let i = f.kind === "pdf" ? d.pdfBytes : d.imageBytes;
					if (r.sizeBytes !== void 0 && r.sizeBytes > i) return {
						state: "too-large",
						size: r.sizeBytes,
						limit: i
					};
					let a = await n(r.url, { signal: e.signal });
					if (!a.ok) throw a;
					let { bytes: o, truncated: s } = await gn(a, i);
					return s ? {
						state: "too-large",
						size: r.sizeBytes ?? i + 1,
						limit: i
					} : (f.kind === "pdf" ? mn(o) : hn(f.raster, o)) ? (t = URL.createObjectURL(new Blob([o], { type: f.kind === "pdf" ? "application/pdf" : bn[f.raster] })), {
						state: "blob",
						url: t
					}) : {
						state: "blocked",
						kind: f.kind === "pdf" ? "PDF" : f.raster.toUpperCase()
					};
				}
				default: {
					let t = f.kind === "csv" || f.kind === "tsv", i = t ? d.delimitedBytes : d.textBytes, a = await n(r.url, {
						headers: { Range: `bytes=0-${i - 1}` },
						signal: e.signal
					});
					if (!a.ok) throw a;
					let o = _n(a.headers.get("content-range")) ?? r.sizeBytes, { bytes: s, truncated: c } = await gn(a, i), l = c || o !== void 0 && o > s.length, u = vn(s, l);
					if (t) try {
						return {
							state: "table",
							table: yn(l ? u.slice(0, Math.max(0, u.lastIndexOf("\n"))) : u, f.kind === "tsv" ? "	" : ",", {
								...d,
								rows: d.rows + 1
							}),
							truncatedBytes: l
						};
					} catch {
						return {
							state: "unreadable",
							kind: f.kind.toUpperCase()
						};
					}
					if (f.kind === "markdown") return {
						state: "markdown",
						html: await nn(u),
						truncated: l,
						total: o
					};
					if (f.kind === "json" && !l) try {
						return {
							state: "text",
							text: JSON.stringify(JSON.parse(u), null, 2),
							truncated: l,
							total: o
						};
					} catch {
						return {
							state: "text",
							text: u,
							truncated: l,
							total: o
						};
					}
					return {
						state: "text",
						text: u,
						truncated: l,
						total: o
					};
				}
			}
		})().then((t) => {
			e.signal.aborted || v(t);
		}, async (t) => {
			e.signal.aborted || v({
				state: "error",
				error: await Cn(t)
			});
		}), () => {
			e.abort(), t && URL.revokeObjectURL(t);
		};
	}, [
		r.url,
		r.name,
		r.sizeBytes,
		f,
		d,
		i
	]);
	let b = o && /* @__PURE__ */ V(n, {
		startIcon: /* @__PURE__ */ V(e, { name: "download" }),
		onClick: o,
		children: l("preview.download")
	}), x = (e) => h(e, { locale: u }), C = (e, t, n) => e && /* @__PURE__ */ V(y, {
		intent: "neutral",
		className: "mtc-file-preview-notice",
		children: n === void 0 ? l("preview.truncatedStart", { shown: x(t) }) : l("preview.truncatedBytes", {
			shown: x(t),
			total: x(n)
		})
	}), w;
	switch (p.state) {
		case "loading":
			w = /* @__PURE__ */ V(m, {
				label: l("preview.loading"),
				compact: !0
			});
			break;
		case "error":
			w = /* @__PURE__ */ V(_, {
				error: p.error,
				compact: !0,
				actions: b
			});
			break;
		case "too-large":
			w = /* @__PURE__ */ V(g, {
				compact: !0,
				icon: /* @__PURE__ */ V(e, { name: "file" }),
				title: l("preview.tooLarge.title"),
				description: l("preview.tooLarge.description", {
					size: x(p.size),
					limit: x(p.limit)
				}),
				actions: b
			});
			break;
		case "blocked":
			w = /* @__PURE__ */ V(g, {
				compact: !0,
				icon: /* @__PURE__ */ V(e, { name: "shield" }),
				title: l("preview.blocked.title"),
				description: l("preview.blocked.description", { kind: p.kind }),
				actions: b
			});
			break;
		case "unreadable":
			w = /* @__PURE__ */ V(g, {
				compact: !0,
				icon: /* @__PURE__ */ V(e, { name: "file" }),
				title: l("preview.unreadable", { kind: p.kind }),
				actions: b
			});
			break;
		case "unsupported":
			w = /* @__PURE__ */ V(g, {
				compact: !0,
				icon: /* @__PURE__ */ V(e, { name: "file" }),
				title: l("preview.unsupported.title"),
				description: l("preview.unsupported.description"),
				actions: b
			});
			break;
		case "media":
			w = f.kind === "video" ? /* @__PURE__ */ V("video", {
				className: "mtc-file-preview-media",
				src: r.url,
				controls: !0,
				preload: "metadata",
				playsInline: !0,
				"aria-label": r.name
			}) : /* @__PURE__ */ V("audio", {
				className: "mtc-file-preview-audio",
				src: r.url,
				controls: !0,
				preload: "metadata",
				"aria-label": r.name
			});
			break;
		case "blob":
			w = f.kind === "pdf" ? /* @__PURE__ */ V("iframe", {
				className: "mtc-file-preview-pdf",
				src: p.url,
				title: r.name,
				style: { height: s }
			}) : /* @__PURE__ */ V("img", {
				className: "mtc-file-preview-image",
				src: p.url,
				alt: r.name
			});
			break;
		case "markdown":
			w = /* @__PURE__ */ H(B, { children: [C(p.truncated, d.textBytes, p.total), /* @__PURE__ */ V("div", {
				className: "mtc-markdown",
				style: { maxHeight: s },
				dangerouslySetInnerHTML: { __html: p.html }
			})] });
			break;
		case "table":
			w = /* @__PURE__ */ V(Sn, {
				name: r.name,
				preview: p.table,
				truncatedBytes: p.truncatedBytes,
				height: s
			});
			break;
		case "text": w = /* @__PURE__ */ V(tn, {
			code: p.text,
			label: r.name,
			language: f.language,
			height: s,
			truncatedNotice: p.truncated ? p.total === void 0 ? l("preview.truncatedStart", { shown: x(d.textBytes) }) : l("preview.truncatedBytes", {
				shown: x(d.textBytes),
				total: x(p.total)
			}) : void 0
		});
	}
	return /* @__PURE__ */ V("div", {
		className: E("mtc-file-preview", c),
		"data-kind": f.kind,
		"data-state": p.state,
		children: w
	});
}
function Sn({ name: e, preview: n, truncatedBytes: r, height: i }) {
	let a = t(), { locale: o } = S(), [s = [], ...c] = n.rows, l = Math.max(s.length, ...c.map((e) => e.length)), u = L(() => Array.from({ length: l }, (e, t) => ({
		id: String(t),
		header: s[t]?.trim() || a("preview.column", { index: t + 1 }),
		accessor: (e) => e.cells[t] ?? "",
		kind: "string",
		width: 160
	})), [
		s,
		l,
		a
	]), d = L(() => c.map((e, t) => ({
		id: t,
		cells: e
	})), [c]), f = n.truncatedRows || n.truncatedColumns || r, p = (e) => new Intl.NumberFormat(o).format(e);
	return /* @__PURE__ */ H(B, { children: [f && /* @__PURE__ */ V(y, {
		intent: "neutral",
		className: "mtc-file-preview-notice",
		children: a("preview.truncatedTable", {
			rows: p(c.length),
			totalRows: r ? `${p(n.sourceRowCount - 1)}+` : p(n.sourceRowCount - 1),
			columns: p(l),
			totalColumns: p(n.sourceColumnCount)
		})
	}), /* @__PURE__ */ V(_t, {
		label: e,
		columns: u,
		rows: d,
		rowKey: (e) => String(e.id),
		height: i
	})] });
}
async function Cn(e) {
	return e instanceof Response ? O(e) : k(e);
}
//#endregion
export { oe as $, Me as A, xe as B, Ve as C, Le as D, Re as E, ke as F, pe as G, ye as H, Oe as I, ue as J, fe as K, Se as L, je as M, Ae as N, X as O, Y as P, le as Q, K as R, $ as S, Z as T, ve as U, be as V, he as W, ae as X, se as Y, W as Z, yt as _, yn as a, et as b, tn as c, Zt as d, ne as et, Wt as f, bt as g, xt as h, hn as i, J as j, Pe as k, en as l, St as m, an as n, re as nt, pn as o, Ht as p, ce as q, mn as r, gn as s, xn as t, U as tt, $t as u, vt as v, Xe as w, Qe as x, _t as y, we as z };
