import { A as e, B as t, E as n, F as r, M as i, O as a, P as o, R as s, T as c, V as l, _ as u, b as d, g as f, h as p, n as m, v as h, x as g, y as _, z as v } from "./States-F9wT_eg6.js";
import { i as y, n as b, r as x, t as S } from "./utils-j4lJ7S1v.js";
import { t as C } from "./layeredLayout-D0PMUE9A.js";
import { cloneElement as w, forwardRef as T, isValidElement as E, useCallback as D, useEffect as O, useId as k, useImperativeHandle as A, useLayoutEffect as j, useMemo as M, useRef as N, useState as P } from "react";
import { Fragment as F, jsx as I, jsxs as L } from "react/jsx-runtime";
import { createPortal as R } from "react-dom";
//#region src/components/TypeGlyph.tsx
var z = [
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
function B(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, z[(t >>> 0) % z.length];
}
var V = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, H = T(function({ icon: t = "object", color: n, size: r = 20, label: i, className: a, ...o }, s) {
	return /* @__PURE__ */ I("span", {
		...o,
		ref: s,
		className: S("mtc-type-glyph", a),
		"data-color": n,
		"data-size": r,
		role: i ? "img" : void 0,
		"aria-label": i,
		"aria-hidden": !i || void 0,
		children: /* @__PURE__ */ I(e, {
			name: t,
			size: V[r],
			strokeWidth: r <= 20 ? 2 : 1.75
		})
	});
}), ee = T(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ I("input", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: S("mtc-input", t && `mtc-density-${t}`, r),
		"data-size": e
	});
}), te = T(function({ size: e = "medium", density: t, invalid: n, className: r, ...i }, a) {
	return /* @__PURE__ */ I("textarea", {
		...i,
		ref: a,
		"aria-invalid": n || i["aria-invalid"] || void 0,
		className: S("mtc-input mtc-textarea", t && `mtc-density-${t}`, r),
		"data-size": e
	});
});
function ne({ label: e, children: t, id: n, description: r, error: i, required: a, className: o }) {
	let s = k(), c = (E(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? n ?? `mtc-field-${s}`, l = r ? `${c}-description` : void 0, u = i ? `${c}-error` : void 0, d = [
		E(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		l,
		u
	].filter(Boolean).join(" ") || void 0, f = (E(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? a, p = E(t) ? w(t, {
		id: c,
		"aria-describedby": d,
		"aria-invalid": t.props["aria-invalid"] ?? (i ? !0 : void 0),
		required: f
	}) : t;
	return /* @__PURE__ */ L("div", {
		className: S("mtc-form-field", o),
		children: [
			/* @__PURE__ */ L("label", {
				className: "mtc-form-label",
				htmlFor: c,
				children: [e, f && /* @__PURE__ */ I("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			p,
			r && /* @__PURE__ */ I("div", {
				id: l,
				className: "mtc-form-description",
				children: r
			}),
			i && /* @__PURE__ */ I("div", {
				id: u,
				className: "mtc-form-error",
				role: "alert",
				children: i
			})
		]
	});
}
var re = T(function({ label: t, description: n, density: r, className: i, ...a }, o) {
	return /* @__PURE__ */ L("label", {
		className: S("mtc-choice", r && `mtc-density-${r}`, i),
		children: [
			/* @__PURE__ */ I("input", {
				...a,
				ref: o,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ I("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ I(e, { name: "check" })
			}),
			/* @__PURE__ */ L("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ I("span", {
					className: "mtc-choice-label",
					children: t
				}), n && /* @__PURE__ */ I("span", {
					className: "mtc-choice-description",
					children: n
				})]
			})
		]
	});
}), ie = T(function({ label: e, description: t, density: n, className: r, ...i }, a) {
	return /* @__PURE__ */ L("label", {
		className: S("mtc-choice", n && `mtc-density-${n}`, r),
		children: [
			/* @__PURE__ */ I("input", {
				...i,
				ref: a,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ I("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ L("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ I("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ I("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), ae = T(function({ checked: e, onCheckedChange: t, label: n, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ L("label", {
		className: S("mtc-switch", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ I("input", {
				...o,
				ref: s,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ I("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ I("span", {})
			}),
			/* @__PURE__ */ L("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ I("span", {
					className: "mtc-choice-label",
					children: n
				}), r && /* @__PURE__ */ I("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), oe = T(function({ value: n, onValueChange: r, options: i, placeholder: a, disabled: o, required: s, name: c, id: l, "aria-label": u, "aria-labelledby": d, "aria-describedby": f, "aria-invalid": p, invalid: m, size: h = "medium", density: g, className: _, emptyMessage: v }, y) {
	let b = t(), x = k(), C = l ?? `mtc-combobox-${x}`, w = `${C}-listbox`, T = N(null), E = N(null), D = i.find((e) => e.value === n), [A, j] = P(D?.label ?? ""), [F, R] = P(!1), [z, B] = P(-1), V = M(() => {
		let e = A.trim().toLocaleLowerCase();
		return !e || D?.label === A ? [...i] : i.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		i,
		A,
		D?.label
	]);
	O(() => {
		F || j(D?.label ?? "");
	}, [F, D?.label]), O(() => {
		E.current?.setCustomValidity(s && !D ? "Please select an option." : "");
	}, [s, D]), O(() => {
		if (!F || typeof document > "u") return;
		let e = (e) => {
			T.current?.contains(e.target) || R(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [F]);
	let H = (e, t) => {
		if (V.length === 0) return -1;
		let n = e;
		for (let e = 0; e < V.length; e++) if (n = (n + t + V.length) % V.length, !V[n]?.disabled) return n;
		return -1;
	}, ee = (e) => {
		e.disabled || (r(e.value), j(e.label), R(!1), B(-1));
	};
	return /* @__PURE__ */ L("div", {
		ref: T,
		className: S("mtc-combobox", g && `mtc-density-${g}`, _),
		"data-size": h,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(!1);
		},
		children: [
			c && /* @__PURE__ */ I("input", {
				type: "hidden",
				name: c,
				value: n ?? ""
			}),
			/* @__PURE__ */ I("input", {
				ref: (e) => {
					E.current = e, typeof y == "function" ? y(e) : y && (y.current = e);
				},
				id: C,
				value: A,
				disabled: o,
				required: s,
				placeholder: a ?? b("combobox.placeholder"),
				role: "combobox",
				"aria-label": u,
				"aria-labelledby": d,
				"aria-describedby": f,
				"aria-invalid": m || p || void 0,
				"aria-required": s || void 0,
				"aria-expanded": F,
				"aria-controls": F ? w : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": F && z >= 0 ? `${C}-option-${z}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					R(!0), B(V.findIndex((e) => e.value === n && !e.disabled));
				},
				onChange: (e) => {
					j(e.currentTarget.value), R(!0), B(-1);
				},
				onKeyDown: (e) => {
					if (e.key === "ArrowDown") e.preventDefault(), R(!0), B((e) => H(e, 1));
					else if (e.key === "ArrowUp") e.preventDefault(), R(!0), B((e) => H(e < 0 ? 0 : e, -1));
					else if (e.key === "Home" && F) e.preventDefault(), B(H(-1, 1));
					else if (e.key === "End" && F) e.preventDefault(), B(H(0, -1));
					else if (e.key === "Enter" && F && z >= 0) {
						e.preventDefault();
						let t = V[z];
						t && ee(t);
					} else e.key === "Escape" && F ? (e.preventDefault(), e.stopPropagation(), R(!1), j(D?.label ?? "")) : e.key === "Tab" && R(!1);
				}
			}),
			/* @__PURE__ */ I(e, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			F && !o && /* @__PURE__ */ I("div", {
				id: w,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: V.length === 0 ? /* @__PURE__ */ I("div", {
					className: "mtc-combobox-empty",
					children: v ?? b("combobox.empty")
				}) : V.map((t, r) => /* @__PURE__ */ L("div", {
					id: `${C}-option-${r}`,
					role: "option",
					"aria-selected": t.value === n,
					"aria-disabled": t.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": z === r,
					"data-selected": t.value === n,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						t.disabled || B(r);
					},
					onClick: () => ee(t),
					children: [/* @__PURE__ */ L("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ I("span", { children: t.label }), t.description && /* @__PURE__ */ I("small", { children: t.description })]
					}), t.value === n && /* @__PURE__ */ I(e, { name: "check" })]
				}, t.value))
			})
		]
	});
}), se = 6, ce = 320;
function le({ children: e, content: t, openDelay: n = 350, closeDelay: r = 150, className: i }) {
	let a = k(), o = l(), s = N(null), c = N(void 0), [u, d] = P(!1), [f, p] = P(null), m = D((e, t) => {
		clearTimeout(c.current), c.current = setTimeout(() => d(e), t);
	}, []);
	O(() => () => clearTimeout(c.current), []), j(() => {
		if (!u || !s.current || typeof window > "u") {
			p(null);
			return;
		}
		let e = s.current.getBoundingClientRect(), t = window.innerHeight - e.bottom, n = t < 220 && e.top > t ? "above" : "below", r = Math.max(8, Math.min(e.left, window.innerWidth - ce - 8));
		p({
			left: r,
			top: n === "below" ? e.bottom + se : e.top - se,
			placement: n
		});
	}, [u]), O(() => {
		if (!u) return;
		let e = (e) => {
			e.key === "Escape" && d(!1);
		}, t = () => d(!1);
		return document.addEventListener("keydown", e), window.addEventListener("scroll", t, !0), () => {
			document.removeEventListener("keydown", e), window.removeEventListener("scroll", t, !0);
		};
	}, [u]);
	let h = e, g = [h.props["aria-describedby"], u ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ L("span", {
		ref: s,
		className: "mtc-hover-card-trigger",
		children: [w(h, {
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
		}), u && o && f && R(/* @__PURE__ */ I("div", {
			id: a,
			role: "tooltip",
			className: S("mtc-hover-card", i),
			"data-placement": f.placement,
			style: {
				left: f.left,
				top: f.top,
				width: ce,
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
var U = T(function({ label: r, page: i, pageCount: a, onPageChange: o, hasPrevious: s, hasNext: c, onPrevious: l, onNext: u, summary: d, previousLabel: f, nextLabel: p, size: m = "small", className: h, ...g }, _) {
	let v = t(), y = i !== void 0, b = y ? i > 1 : !!s, x = y ? a === void 0 ? !!c : i < a : !!c, C = () => y ? o?.(Math.max(1, i - 1)) : l?.(), w = () => y ? o?.(i + 1) : u?.();
	return /* @__PURE__ */ L("nav", {
		...g,
		ref: _,
		"aria-label": r ?? v("pagination.label"),
		className: S("mtc-pagination", h),
		children: [d != null && /* @__PURE__ */ I("span", {
			className: "mtc-pagination-summary",
			children: d
		}), /* @__PURE__ */ L("div", {
			className: "mtc-pagination-controls",
			children: [
				/* @__PURE__ */ I(n, {
					size: m,
					variant: "ghost",
					startIcon: /* @__PURE__ */ I(e, { name: "chevron-left" }),
					disabled: !b,
					onClick: C,
					children: f ?? v("pagination.previous")
				}),
				y && /* @__PURE__ */ I("span", {
					className: "mtc-pagination-page",
					"aria-live": "polite",
					children: a === void 0 ? v("pagination.pageOnly", { page: i }) : v("pagination.page", {
						page: i,
						count: a
					})
				}),
				/* @__PURE__ */ I(n, {
					size: m,
					variant: "ghost",
					endIcon: /* @__PURE__ */ I(e, { name: "chevron-right" }),
					disabled: !x,
					onClick: w,
					children: p ?? v("pagination.next")
				})
			]
		})]
	});
});
//#endregion
//#region src/components/SearchField.tsx
function W(e) {
	return e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName));
}
var ue = T(function({ value: n, onValueChange: r, label: i, tokens: o = [], onRemoveToken: s, onSubmit: c, shortcut: l, clearLabel: d, size: f = "medium", className: p, placeholder: m, onKeyDown: h, ...g }, _) {
	let v = t(), y = N(null);
	return A(_, () => y.current), O(() => {
		if (!l) return;
		let e = (e) => {
			e.key !== l || e.metaKey || e.ctrlKey || e.altKey || W(e.target) || (e.preventDefault(), y.current?.focus());
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [l]), /* @__PURE__ */ L("form", {
		role: "search",
		"aria-label": i,
		className: S("mtc-search-field", p),
		"data-size": f,
		onSubmit: (e) => {
			e.preventDefault(), c?.(n);
		},
		children: [
			/* @__PURE__ */ I(e, {
				name: "search",
				className: "mtc-search-field-icon"
			}),
			o.map((t) => /* @__PURE__ */ L("span", {
				className: "mtc-search-token",
				children: [
					t.icon,
					/* @__PURE__ */ I("span", { children: t.label }),
					s && /* @__PURE__ */ I("button", {
						type: "button",
						className: "mtc-search-token-remove",
						"aria-label": v("search.removeToken", { label: t.label }),
						onClick: () => {
							s(t.id), y.current?.focus();
						},
						children: /* @__PURE__ */ I(e, { name: "close" })
					})
				]
			}, t.id)),
			/* @__PURE__ */ I("input", {
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
			n === "" ? l ? /* @__PURE__ */ I(u, {
				"aria-hidden": "true",
				className: "mtc-search-field-hint",
				children: l
			}) : null : /* @__PURE__ */ I(a, {
				icon: /* @__PURE__ */ I(e, { name: "close" }),
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
function de(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function fe(e) {
	if (e) return (t) => {
		de(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/components/StatTile.tsx
var pe = T(function({ label: n, value: r, unit: i, delta: a, status: o, description: s, icon: c, href: l, onNavigate: u, className: d, ...f }, p) {
	let m = t(), h = /* @__PURE__ */ L(F, { children: [
		/* @__PURE__ */ L("div", {
			className: "mtc-stat-tile-top",
			children: [
				c,
				/* @__PURE__ */ I("span", {
					className: "mtc-stat-tile-label",
					children: n
				}),
				o && /* @__PURE__ */ I(g, {
					tone: o.tone,
					className: "mtc-stat-tile-status",
					children: o.label
				})
			]
		}),
		/* @__PURE__ */ L("div", {
			className: "mtc-stat-tile-value",
			children: [/* @__PURE__ */ I("span", { children: r }), i != null && /* @__PURE__ */ I("span", {
				className: "mtc-stat-tile-unit",
				children: i
			})]
		}),
		(a || s) && /* @__PURE__ */ L("div", {
			className: "mtc-stat-tile-foot",
			children: [a && /* @__PURE__ */ L("span", {
				className: "mtc-stat-tile-delta",
				"data-tone": a.tone ?? "neutral",
				children: [a.direction && /* @__PURE__ */ I(e, {
					name: "arrow-right",
					className: "mtc-stat-tile-arrow",
					"data-direction": a.direction,
					label: a.direction === "up" ? m("stat.increase") : m("stat.decrease")
				}), a.value]
			}), s && /* @__PURE__ */ I("span", {
				className: "mtc-stat-tile-description",
				children: s
			})]
		})
	] });
	return l ? /* @__PURE__ */ I("a", {
		...f,
		ref: p,
		href: l,
		className: S("mtc-stat-tile", d),
		"data-interactive": "true",
		onClick: fe(u),
		children: h
	}) : /* @__PURE__ */ I("div", {
		...f,
		ref: p,
		className: S("mtc-stat-tile", d),
		children: h
	});
});
//#endregion
//#region src/components/Overlays.tsx
function me({ content: e, children: t, placement: n = "top", disabled: r, className: i }) {
	let a = k(), [o, s] = x({
		value: void 0,
		defaultValue: !1
	});
	if (r) return /* @__PURE__ */ I(F, { children: t });
	let c = t, l = [c.props["aria-describedby"], o ? a : void 0].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ L("span", {
		className: S("mtc-tooltip-trigger", i),
		children: [w(c, {
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
		}), o && /* @__PURE__ */ I("span", {
			id: a,
			role: "tooltip",
			className: "mtc-tooltip",
			"data-placement": n,
			children: e
		})]
	});
}
function he({ trigger: e, triggerAriaLabel: t, children: n, title: r, open: i, defaultOpen: a = !1, onOpenChange: o, placement: s = "bottom-start", disabled: c, className: l }) {
	let u = k(), d = k(), f = N(null), p = N(null), [m, h] = x({
		value: i,
		defaultValue: a,
		onChange: o
	});
	return xe(m, f, () => {
		h(!1), p.current?.focus();
	}), /* @__PURE__ */ L("div", {
		ref: f,
		className: S("mtc-popover-root", l),
		children: [/* @__PURE__ */ I("button", {
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
		}), m && /* @__PURE__ */ L("div", {
			id: u,
			role: "dialog",
			"aria-label": r ? void 0 : t,
			"aria-labelledby": r ? d : void 0,
			className: "mtc-popover mtc-popover-content",
			"data-placement": s,
			children: [r && /* @__PURE__ */ I("div", {
				id: d,
				className: "mtc-popover-title",
				children: r
			}), n]
		})]
	});
}
function ge({ label: e, trigger: t, items: n, open: r, defaultOpen: i = !1, onOpenChange: a, align: o = "start", disabled: s, className: c }) {
	let l = N(null), u = N(null), [d, f] = x({
		value: void 0,
		defaultValue: 0
	}), [p, m] = x({
		value: r,
		defaultValue: i,
		onChange: a
	}), h = (e = !0) => {
		m(!1), e && u.current?.focus();
	};
	return xe(p, l, () => h(!1)), /* @__PURE__ */ L("div", {
		ref: l,
		className: S("mtc-menu-root", c),
		children: [/* @__PURE__ */ I("button", {
			ref: u,
			type: "button",
			className: "mtc-menu-trigger",
			"aria-label": e,
			"aria-haspopup": "menu",
			"aria-expanded": p,
			disabled: s,
			onClick: () => {
				f(G(n, 1)), m(!p);
			},
			onKeyDown: (e) => {
				(e.key === "ArrowDown" || e.key === "ArrowUp") && (e.preventDefault(), f(G(n, e.key === "ArrowDown" ? 1 : -1)), m(!0));
			},
			children: t
		}), p && /* @__PURE__ */ I(ve, {
			label: e,
			items: n,
			initialIndex: d,
			align: o,
			onClose: h
		})]
	});
}
var _e = T(function({ label: e, items: t, children: n, className: r, tabIndex: i = 0, onContextMenu: a, onKeyDown: o, ...s }, c) {
	let l = N(null), u = N({
		x: 0,
		y: 0
	}), [d, f] = x({
		value: void 0,
		defaultValue: !1
	}), [p, m] = x({
		value: void 0,
		defaultValue: 0
	}), h = (e) => {
		l.current = e, typeof c == "function" ? c(e) : c && (c.current = e);
	};
	xe(d, l, () => f(!1));
	let g = (e, n) => {
		u.current = {
			x: e,
			y: n
		}, m(G(t, 1)), f(!0);
	};
	return /* @__PURE__ */ L("div", {
		...s,
		ref: h,
		className: S("mtc-context-menu-region", r),
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
		children: [n, d && /* @__PURE__ */ I(ve, {
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
function ve({ label: e, items: t, initialIndex: n, onClose: r, align: i = "start", style: a }) {
	let o = N(null);
	O(() => {
		let e = requestAnimationFrame(() => {
			let e = o.current?.querySelectorAll("[role=\"menuitem\"]:not([disabled])");
			([...e ?? []].find((e) => Number(e.dataset.index) === n) ?? e?.[0])?.focus();
		});
		return () => cancelAnimationFrame(e);
	}, [n]);
	let s = (e, n) => {
		let r = Se(t, e, n);
		o.current?.querySelector(`[role="menuitem"][data-index="${r}"]`)?.focus();
	};
	return /* @__PURE__ */ I("div", {
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
		children: t.map((e, t) => e.separator ? /* @__PURE__ */ I("div", {
			role: "separator",
			className: "mtc-menu-separator"
		}, e.id) : /* @__PURE__ */ L("button", {
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
				e.icon && /* @__PURE__ */ I("span", {
					className: "mtc-menu-icon",
					"aria-hidden": "true",
					children: e.icon
				}),
				/* @__PURE__ */ I("span", {
					className: "mtc-menu-label",
					children: e.label
				}),
				e.shortcut && /* @__PURE__ */ I("kbd", {
					className: "mtc-menu-shortcut",
					children: e.shortcut
				})
			]
		}, e.id))
	});
}
var ye = T(function({ open: n, onOpenChange: r, title: i, description: o, children: s, footer: c, size: l = "medium", dismissible: u = !0, initialFocusRef: d, className: f }, p) {
	let m = t(), h = k(), g = k(), _ = N(null);
	return y(n, _, d), n ? /* @__PURE__ */ I("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			u && e.target === e.currentTarget && r(!1);
		},
		children: /* @__PURE__ */ L("div", {
			ref: (e) => {
				_.current = e, typeof p == "function" ? p(e) : p && (p.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": h,
			"aria-describedby": o ? g : void 0,
			tabIndex: -1,
			className: S("mtc-dialog", f),
			"data-size": l,
			onKeyDown: (e) => b(e, _, u, () => r(!1)),
			children: [
				/* @__PURE__ */ L("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ L("div", { children: [/* @__PURE__ */ I("h2", {
						id: h,
						className: "mtc-modal-title",
						children: i
					}), o && /* @__PURE__ */ I("p", {
						id: g,
						className: "mtc-modal-description",
						children: o
					})] }), u && /* @__PURE__ */ I(a, {
						icon: /* @__PURE__ */ I(e, { name: "close" }),
						"aria-label": m("dialog.close"),
						variant: "ghost",
						size: "small",
						onClick: () => r(!1)
					})]
				}),
				/* @__PURE__ */ I("div", {
					className: "mtc-modal-body",
					children: s
				}),
				c && /* @__PURE__ */ I("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
}), be = T(function({ open: n, onOpenChange: r, title: i, description: o, children: s, footer: c, side: l = "right", width: u = 420, dismissible: d = !0, initialFocusRef: f, className: p }, m) {
	let h = t(), g = k(), _ = k(), v = N(null);
	return y(n, v, f), n ? /* @__PURE__ */ I("div", {
		className: "mtc-modal-backdrop mtc-overlay",
		onMouseDown: (e) => {
			d && e.target === e.currentTarget && r(!1);
		},
		children: /* @__PURE__ */ L("div", {
			ref: (e) => {
				v.current = e, typeof m == "function" ? m(e) : m && (m.current = e);
			},
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": g,
			"aria-describedby": o ? _ : void 0,
			tabIndex: -1,
			className: S("mtc-drawer", p),
			"data-side": l,
			style: { width: u },
			onKeyDown: (e) => b(e, v, d, () => r(!1)),
			children: [
				/* @__PURE__ */ L("div", {
					className: "mtc-modal-header",
					children: [/* @__PURE__ */ L("div", { children: [/* @__PURE__ */ I("h2", {
						id: g,
						className: "mtc-modal-title",
						children: i
					}), o && /* @__PURE__ */ I("p", {
						id: _,
						className: "mtc-modal-description",
						children: o
					})] }), d && /* @__PURE__ */ I(a, {
						icon: /* @__PURE__ */ I(e, { name: "close" }),
						"aria-label": h("drawer.close"),
						variant: "ghost",
						size: "small",
						onClick: () => r(!1)
					})]
				}),
				/* @__PURE__ */ I("div", {
					className: "mtc-modal-body",
					children: s
				}),
				c && /* @__PURE__ */ I("div", {
					className: "mtc-modal-footer",
					children: c
				})
			]
		})
	}) : null;
});
function xe(e, t, n) {
	O(() => {
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
	return Se(e, t === 1 ? -1 : 0, t);
}
function Se(e, t, n) {
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
var Ce = T(function({ items: e, value: t, onValueChange: n, label: r, orientation: i = "horizontal", activationMode: a = "automatic", density: o, keepMounted: s = !1, className: c, ...l }, u) {
	let d = k(), f = N(/* @__PURE__ */ new Map()), p = e.find((e) => e.id === t && !e.disabled) ?? e.find((e) => !e.disabled), m = (t, r) => {
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
	return /* @__PURE__ */ L("div", {
		...l,
		ref: u,
		className: S("mtc-tabs", o && `mtc-density-${o}`, c),
		"data-orientation": i,
		children: [/* @__PURE__ */ I("div", {
			role: "tablist",
			"aria-label": r,
			"aria-orientation": i,
			className: "mtc-tabs-list",
			children: e.map((e) => {
				let t = e.id === p?.id, r = `${d}-tab-${e.id}`, i = `${d}-panel-${e.id}`;
				return /* @__PURE__ */ L("button", {
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
					children: [/* @__PURE__ */ I("span", { children: e.label }), e.count != null && /* @__PURE__ */ I("span", {
						className: "mtc-tab-count",
						children: e.count
					})]
				}, e.id);
			})
		}), /* @__PURE__ */ I("div", {
			className: "mtc-tabs-panels",
			children: e.map((e) => {
				let t = e.id === p?.id;
				return !t && !s ? null : /* @__PURE__ */ I("div", {
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
}), we = T(function({ items: n, label: r, maxItems: i, className: a, ...o }, s) {
	let c = t(), l = K(n, i);
	return /* @__PURE__ */ I("nav", {
		...o,
		ref: s,
		"aria-label": r ?? c("breadcrumbs.label"),
		className: S("mtc-breadcrumbs", a),
		children: /* @__PURE__ */ I("ol", { children: l.map((t, n) => {
			let r = n === l.length - 1;
			return /* @__PURE__ */ L("li", { children: [n > 0 && /* @__PURE__ */ I(e, {
				name: "chevron-right",
				className: "mtc-breadcrumb-separator"
			}), r ? /* @__PURE__ */ I("span", {
				"aria-current": "page",
				className: "mtc-breadcrumb-current",
				children: t.label
			}) : t.href ? /* @__PURE__ */ I("a", {
				href: t.href,
				className: "mtc-breadcrumb-action",
				children: t.label
			}) : t.onSelect ? /* @__PURE__ */ I("button", {
				type: "button",
				onClick: t.onSelect,
				className: "mtc-breadcrumb-action",
				children: t.label
			}) : /* @__PURE__ */ I("span", {
				className: "mtc-breadcrumb-muted",
				children: t.label
			})] }, `${t.id ?? "item"}:${n}`);
		}) })
	});
});
function K(e, t) {
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
var Te = T(function({ density: e, fullHeight: t = !0, className: n, children: r, ...i }, a) {
	return /* @__PURE__ */ I("div", {
		...i,
		ref: a,
		className: S("mtc-app-surface", e && `mtc-density-${e}`, n),
		"data-full-height": t,
		children: r
	});
}), Ee = T(function({ label: e, start: n, end: r, density: i, sticky: a, className: o, children: s, ...c }, l) {
	let u = t();
	return /* @__PURE__ */ L("div", {
		...c,
		ref: l,
		role: "toolbar",
		"aria-label": e ?? u("toolbar.label"),
		className: S("mtc-app-toolbar", i && `mtc-density-${i}`, o),
		"data-sticky": a || void 0,
		children: [
			n && /* @__PURE__ */ I("div", {
				className: "mtc-toolbar-region mtc-toolbar-start",
				children: n
			}),
			/* @__PURE__ */ I("div", {
				className: "mtc-toolbar-region mtc-toolbar-main",
				children: s
			}),
			r && /* @__PURE__ */ I("div", {
				className: "mtc-toolbar-region mtc-toolbar-end",
				children: r
			})
		]
	});
}), De = T(function({ label: e, header: t, footer: n, width: r = 280, collapsed: i = !1, side: a = "left", className: o, children: s, style: c, ...l }, u) {
	let d = {
		"--mtc-sidebar-width": typeof r == "number" ? `${r}px` : r,
		...c
	};
	return /* @__PURE__ */ L("aside", {
		...l,
		ref: u,
		"aria-label": e,
		"aria-hidden": i || void 0,
		className: S("mtc-sidebar", o),
		"data-collapsed": i,
		"data-side": a,
		style: d,
		children: [
			t && /* @__PURE__ */ I("div", {
				className: "mtc-sidebar-header",
				children: t
			}),
			/* @__PURE__ */ I("div", {
				className: "mtc-sidebar-content",
				children: s
			}),
			n && /* @__PURE__ */ I("div", {
				className: "mtc-sidebar-footer",
				children: n
			})
		]
	});
}), Oe = T(function({ label: e, title: t, subtitle: n, actions: r, footer: i, width: a = 320, open: o = !0, className: s, children: c, style: l, ...u }, d) {
	let f = {
		"--mtc-inspector-width": typeof a == "number" ? `${a}px` : a,
		...l
	};
	return /* @__PURE__ */ L("aside", {
		...u,
		ref: d,
		"aria-label": e,
		"aria-hidden": !o || void 0,
		className: S("mtc-inspector", s),
		"data-open": o,
		style: f,
		children: [
			(t || r) && /* @__PURE__ */ L("div", {
				className: "mtc-inspector-header",
				children: [/* @__PURE__ */ L("div", {
					className: "mtc-inspector-heading",
					children: [t && /* @__PURE__ */ I("h2", { children: t }), n && /* @__PURE__ */ I("p", { children: n })]
				}), r && /* @__PURE__ */ I("div", {
					className: "mtc-inspector-actions",
					children: r
				})]
			}),
			/* @__PURE__ */ I("div", {
				className: "mtc-inspector-content",
				children: c
			}),
			i && /* @__PURE__ */ I("div", {
				className: "mtc-inspector-footer",
				children: i
			})
		]
	});
}), ke = T(function({ primary: e, secondary: n, orientation: r = "horizontal", primaryPane: i = "start", size: a, defaultSize: o = 30, onSizeChange: s, minSize: c = 15, maxSize: l = 85, step: u = 5, disabled: d, stackOnNarrow: f = !0, separatorLabel: p, className: m, style: h, ...g }, _) {
	let v = t(), y = N(null), b = N(!1), [C, w] = x({
		value: a,
		defaultValue: o,
		onChange: s
	}), T = Math.min(c, l), E = Math.max(c, l), D = Number.isFinite(u) && u !== 0 ? Math.abs(u) : 1, O = q(C, T, E), k = (e) => {
		y.current = e, typeof _ == "function" ? _(e) : _ && (_.current = e);
	}, A = (e) => {
		if (!b.current || !y.current || d) return;
		let t = y.current.getBoundingClientRect(), n = r === "horizontal" ? (e.clientX - t.left) / t.width * 100 : (e.clientY - t.top) / t.height * 100, a = i === "start" ? n : 100 - n;
		w(q(a, T, E));
	}, j = (e) => w(q(O + e, T, E)), M = i === "start" ? O : 100 - O, P = 100 - M;
	return /* @__PURE__ */ L("div", {
		...g,
		ref: k,
		className: S("mtc-split-pane", m),
		"data-orientation": r,
		"data-stack-narrow": f,
		style: {
			"--mtc-split-start": `${M}fr`,
			"--mtc-split-end": `${P}fr`,
			...h
		},
		children: [
			/* @__PURE__ */ I("div", {
				className: "mtc-split-content mtc-split-start",
				children: i === "start" ? e : n
			}),
			/* @__PURE__ */ I("div", {
				role: "separator",
				"aria-label": p ?? v("splitPane.resize"),
				"aria-orientation": r === "horizontal" ? "vertical" : "horizontal",
				"aria-valuemin": T,
				"aria-valuemax": E,
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
					} else e.key === "Home" ? (e.preventDefault(), w(T)) : e.key === "End" && (e.preventDefault(), w(E));
				},
				children: /* @__PURE__ */ I("span", { "aria-hidden": "true" })
			}),
			/* @__PURE__ */ I("div", {
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
var J = T(function({ items: n, label: r, selectedId: i, onSelectionChange: a, expandedIds: o, onExpandedChange: s, density: c, className: l, ...u }, d) {
	let f = M(() => Y(n, o), [n, o]), p = t(), m = N(/* @__PURE__ */ new Map()), [h, g] = P(i ?? f.find((e) => !e.item.disabled)?.item.id);
	O(() => {
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
	return /* @__PURE__ */ I("div", {
		...u,
		ref: d,
		role: "tree",
		"aria-label": r,
		"aria-multiselectable": !1,
		className: S("mtc-tree", c && `mtc-density-${c}`, l),
		children: f.map((t) => {
			let { item: n } = t, r = !!n.children?.length, s = o.has(n.id), c = i === n.id;
			return /* @__PURE__ */ L("div", {
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
					/* @__PURE__ */ I("button", {
						type: "button",
						className: "mtc-tree-toggle",
						tabIndex: -1,
						"aria-label": r ? p(s ? "tree.collapse" : "tree.expand", { label: Ae(n.label) }) : void 0,
						"aria-hidden": !r || void 0,
						disabled: !r || n.disabled,
						onClick: (e) => {
							e.stopPropagation(), r && v(n.id, !s);
						},
						children: r && /* @__PURE__ */ I(e, { name: "chevron-right" })
					}),
					n.icon && /* @__PURE__ */ I("span", {
						className: "mtc-tree-icon",
						"aria-hidden": "true",
						children: n.icon
					}),
					/* @__PURE__ */ L("span", {
						className: "mtc-tree-copy",
						children: [/* @__PURE__ */ I("span", {
							className: "mtc-tree-label",
							children: n.label
						}), n.description && /* @__PURE__ */ I("span", {
							className: "mtc-tree-description",
							children: n.description
						})]
					})
				]
			}, n.id);
		})
	});
});
function Y(e, t, n = 1, r, i = /* @__PURE__ */ new Set()) {
	let a = [];
	return e.forEach((o, s) => {
		o.id && !i.has(o.id) && (i.add(o.id), a.push({
			item: o,
			level: n,
			parentId: r,
			position: s + 1,
			setSize: e.length
		}), o.children?.length && t.has(o.id) && a.push(...Y(o.children, t, n + 1, o.id, i)));
	}), a;
}
function Ae(e) {
	return typeof e == "string" || typeof e == "number" ? String(e) : "item";
}
//#endregion
//#region src/objects/types.ts
function X(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? B(e.id ?? e.label)
	};
}
function je(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
//#region src/objects/ObjectChip.tsx
var Me = T(function({ object: e, onNavigate: t, hoverCard: n, mono: r, className: i }, a) {
	let o = e.type ? X(e.type) : null, s = /* @__PURE__ */ L(F, { children: [o && /* @__PURE__ */ I(H, {
		icon: o.icon,
		color: o.color,
		size: 16
	}), /* @__PURE__ */ I("span", {
		className: "mtc-object-chip-title",
		"data-mono": r || void 0,
		children: e.title
	})] }), c = t ? (n) => t(e, n) : void 0, l = S("mtc-object-chip", i), u;
	return u = e.href ? /* @__PURE__ */ I("a", {
		ref: a,
		href: e.href,
		className: l,
		"data-interactive": "true",
		onClick: fe(c),
		children: s
	}) : c ? /* @__PURE__ */ I("button", {
		ref: a,
		type: "button",
		className: l,
		"data-interactive": "true",
		onClick: c,
		children: s
	}) : /* @__PURE__ */ I("span", {
		ref: a,
		className: l,
		children: s
	}), n ? /* @__PURE__ */ I(le, {
		content: n,
		children: u
	}) : u;
}), Ne = /* @__PURE__ */ new Set([
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
		if (Ne.has(e)) return { kind: e };
	}
	return t === "currency" ? {
		kind: t,
		currency: "USD"
	} : t ? { kind: t } : typeof e == "boolean" ? { kind: "boolean" } : typeof e == "number" || typeof e == "bigint" ? { kind: "number" } : Array.isArray(e) ? { kind: "list" } : je(e) ? { kind: "link" } : e && typeof e == "object" ? { kind: "object" } : { kind: "string" };
}
function Pe(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function Fe(e) {
	return e === "number" || e === "integer" || e === "currency" || e === "percent";
}
function Ie(e) {
	return typeof e == "number" ? Number.isFinite(e) ? e : null : typeof e == "bigint" || typeof e == "string" && e.trim() !== "" && Number.isFinite(Number(e)) ? Number(e) : null;
}
var Le = /^\d{4}-\d{2}-\d{2}$/;
function Re(e) {
	if (e instanceof Date) return Number.isNaN(e.getTime()) ? null : {
		date: e,
		dateOnly: !1
	};
	if (typeof e == "number") return {
		date: new Date(e),
		dateOnly: !1
	};
	if (typeof e != "string" || e.trim() === "") return null;
	let t = Le.test(e.trim()), n = new Date(t ? `${e.trim()}T00:00:00Z` : e);
	return Number.isNaN(n.getTime()) ? null : {
		date: n,
		dateOnly: t
	};
}
function ze(e) {
	if (typeof e != "string") return null;
	try {
		let t = new URL(e.trim());
		return t.protocol === "http:" || t.protocol === "https:" ? t.href : null;
	} catch {
		return null;
	}
}
function Be(e) {
	return typeof e == "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}
function Ve(e, t, n = "en") {
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
function Q(e, t, { locale: n = "en", timeZone: r } = {}) {
	let a = t === "datetime" && !e.dateOnly;
	return i(e.date, {
		locale: n,
		timeZone: e.dateOnly ? "UTC" : r,
		dateStyle: "medium",
		timeStyle: a ? "short" : "none"
	});
}
var He = 864e5;
function Ue(e, t, n = "en") {
	if (!e.dateOnly) return r(e.date, {
		locale: n,
		now: t
	});
	let i = new Date(t), a = Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), i.getUTCDate()), o = Math.round((e.date.getTime() - a) / He);
	return Math.abs(o) < 30 ? new Intl.RelativeTimeFormat(n, { numeric: "auto" }).format(o, "day") : r(e.date, {
		locale: n,
		now: a
	});
}
function $(e, t, n = {}) {
	if (Pe(e)) return "";
	let { locale: r = "en" } = n;
	switch (t.kind) {
		case "number":
		case "integer":
		case "currency":
		case "percent": {
			let n = Ie(e);
			return n == null ? String(e) : Ve(n, t, r);
		}
		case "date":
		case "datetime": {
			let r = Re(e);
			return r ? Q(r, t.kind, n) : String(e);
		}
		case "boolean": return e === !0 || e === "true" ? n.yes ?? "Yes" : n.no ?? "No";
		case "list": return (Array.isArray(e) ? e : [e]).map((e) => $(e, Z(e), n)).join(", ");
		case "link": return je(e) ? e.title : String(e);
		case "object": try {
			return Object.entries(e).map(([e, t]) => `${e}: ${$(t, Z(t), n)}`).join(", ");
		} catch {
			return String(e);
		}
		default: return String(e);
	}
}
function We(e, t, n = {}) {
	return Pe(e) ? null : Fe(t.kind) ? Ie(e) ?? $(e, t, n) : t.kind === "date" || t.kind === "datetime" ? Re(e)?.date.getTime() ?? String(e) : t.kind === "boolean" ? +(e === !0 || e === "true") : $(e, t, n);
}
var Ge = new Intl.Collator(void 0, {
	numeric: !0,
	sensitivity: "base"
});
function Ke(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : Ge.compare(String(e), String(t));
}
//#endregion
//#region src/objects/PropertyValue.tsx
var qe = 3;
function Je(e) {
	return /* @__PURE__ */ I(Ye, {
		...e,
		depth: 0
	});
}
function Ye({ value: n, kind: r, format: i, tones: a, context: o = "panel", emptyValue: s, now: l, onNavigate: u, maxListItems: d, depth: p }) {
	let { locale: m, timeZone: h } = v(), _ = t(), y = M(() => Z(n, r, i), [
		n,
		r,
		i
	]), b = {
		locale: m,
		timeZone: h,
		yes: _("value.yes"),
		no: _("value.no")
	}, x = o === "panel";
	if (Pe(n)) return /* @__PURE__ */ I("span", {
		className: "mtc-value-empty",
		children: s ?? "—"
	});
	switch (y.kind) {
		case "id":
		case "code": {
			let e = String(n);
			return /* @__PURE__ */ L("span", {
				className: "mtc-value-id",
				"data-context": o,
				children: [/* @__PURE__ */ I("code", { children: e }), x && /* @__PURE__ */ I(f, {
					value: e,
					label: _("copy.label")
				})]
			});
		}
		case "number":
		case "integer":
		case "currency":
		case "percent": return /* @__PURE__ */ I(Xe, {
			value: n,
			resolved: y,
			locale: m,
			panel: x
		});
		case "date":
		case "datetime": {
			let e = Re(n);
			return e ? /* @__PURE__ */ L("span", {
				className: "mtc-value-date",
				children: [/* @__PURE__ */ I("time", {
					dateTime: e.dateOnly ? String(n).trim() : e.date.toISOString(),
					title: e.dateOnly ? String(n).trim() : e.date.toISOString(),
					children: Q(e, y.kind, b)
				}), x && /* @__PURE__ */ I("span", {
					className: "mtc-value-secondary",
					children: Ue(e, l ?? Date.now(), m)
				})]
			}) : /* @__PURE__ */ I("span", {
				className: "mtc-value-text",
				children: String(n)
			});
		}
		case "boolean": {
			let t = n === !0 || n === "true";
			return /* @__PURE__ */ L("span", {
				className: "mtc-value-boolean",
				"data-value": t,
				children: [/* @__PURE__ */ I(e, { name: t ? "check" : "close" }), _(t ? "value.yes" : "value.no")]
			});
		}
		case "enum": {
			let e = String(n), t = a?.[e];
			return t && t !== "neutral" ? /* @__PURE__ */ I(g, {
				tone: t,
				children: e
			}) : /* @__PURE__ */ I(c, {
				className: "mtc-value-chip",
				children: e
			});
		}
		case "list": {
			let e = Array.isArray(n) ? n : [n], t = d ?? (x ? 3 : 2), r = e.slice(0, t), i = e.slice(t);
			return /* @__PURE__ */ L("span", {
				className: "mtc-value-list",
				"data-context": o,
				children: [r.map((e, t) => je(e) ? /* @__PURE__ */ I(Me, {
					object: e,
					onNavigate: u
				}, `${e.id}:${t}`) : /* @__PURE__ */ I(c, {
					className: "mtc-value-chip",
					children: $(e, Z(e), b)
				}, t)), i.length > 0 && /* @__PURE__ */ I(c, {
					className: "mtc-value-chip",
					title: _("value.moreTitle", {
						count: i.length,
						items: i.map((e) => $(e, Z(e), b)).join(", ")
					}),
					children: _("value.more", { count: i.length })
				})]
			});
		}
		case "link": return je(n) ? /* @__PURE__ */ I(Me, {
			object: n,
			onNavigate: u
		}) : /* @__PURE__ */ I("span", {
			className: "mtc-value-text",
			children: String(n)
		});
		case "url": {
			let t = ze(n);
			if (!t) return /* @__PURE__ */ I("span", {
				className: "mtc-value-text",
				children: String(n)
			});
			let r = String(n).trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
			return /* @__PURE__ */ L("a", {
				className: "mtc-value-link",
				href: t,
				target: "_blank",
				rel: "noopener noreferrer",
				children: [
					/* @__PURE__ */ I("span", {
						className: "mtc-value-link-text",
						children: r
					}),
					/* @__PURE__ */ I(e, { name: "external-link" }),
					/* @__PURE__ */ I("span", {
						className: "mtc-visually-hidden",
						children: _("value.newTab")
					})
				]
			});
		}
		case "email": return Be(n) ? /* @__PURE__ */ I("a", {
			className: "mtc-value-link",
			href: `mailto:${n.trim()}`,
			children: /* @__PURE__ */ I("span", {
				className: "mtc-value-link-text",
				children: n.trim()
			})
		}) : /* @__PURE__ */ I("span", {
			className: "mtc-value-text",
			children: String(n)
		});
		case "object": {
			if (p >= qe || !n || typeof n != "object") return /* @__PURE__ */ I("span", {
				className: "mtc-value-text",
				children: $(n, y, b)
			});
			let e = Object.entries(n);
			return /* @__PURE__ */ L("details", {
				className: "mtc-value-object",
				children: [/* @__PURE__ */ I("summary", { children: _("value.fields", { count: e.length }) }), /* @__PURE__ */ I("dl", { children: e.map(([e, t]) => /* @__PURE__ */ L("div", {
					className: "mtc-value-object-row",
					children: [/* @__PURE__ */ I("dt", { children: e }), /* @__PURE__ */ I("dd", { children: /* @__PURE__ */ I(Ye, {
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
			return /* @__PURE__ */ I("span", {
				className: "mtc-value-text",
				"data-context": o,
				title: e.length > 80 ? e : void 0,
				children: e
			});
		}
	}
}
function Xe({ value: e, resolved: t, locale: n, panel: r }) {
	let i = typeof e == "number" ? e : Number(e);
	return Number.isFinite(i) ? /* @__PURE__ */ L("span", {
		className: "mtc-value-number",
		children: [Ve(i, t, n), r && t.kind === "currency" && /* @__PURE__ */ I("span", {
			className: "mtc-value-secondary",
			children: t.currency
		})]
	}) : /* @__PURE__ */ I("span", {
		className: "mtc-value-text",
		children: String(e)
	});
}
//#endregion
//#region src/workbench/dataGridModel.ts
function Ze(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function Qe(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = Ze(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : We(i, Z(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return Ke(e.key, t.key) || e.index - t.index;
		let r = Ke(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function $e(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function et(e, t, n, r, i, a) {
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
function tt(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function nt(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function rt(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
var it = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, at = 160, ot = 40, st = 16, ct = 8, lt = 160;
function ut(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function dt({ label: n, columns: r, rows: i, rowKey: a, rowLabel: o, selection: c = "none", selectedKeys: u, defaultSelectedKeys: f, onSelectionChange: p, sort: h, defaultSort: g = null, onSortChange: _, sortMode: y = "client", onRowActivate: b, rowHref: x, onNavigate: C, contextActions: w, onCellEdit: T, onEndReached: E, totalRows: k, loading: A = !1, empty: F, density: z, rowHeight: B, height: V = "100%", virtualize: H = "auto", overscan: ee = 8, footer: te, rowProps: ne, className: re }) {
	let ie = t(), { locale: ae, timeZone: oe } = v(), se = s(), ce = l(), le = z ?? se?.density ?? "standard", U = B ?? it[le], W = N(null), ue = N(null), de = N(!1), pe = N(null), me = N(-1), [he, ge] = P(g), _e = h === void 0 ? he : h, [ye, be] = P(f ?? []), G = u ?? ye, Se = M(() => new Set(G), [G]), [Ce, we] = P({}), [K, Te] = P(() => ({
		row: i.length > 0 ? 0 : -1,
		column: +(c === "multi")
	})), [Ee, De] = P({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [Oe, ke] = P(null), q = M(() => y !== "client" || !_e ? i : Qe(i, r.find((e) => e.id === _e.columnId), _e.direction, ae), [
		i,
		r,
		_e,
		y,
		ae
	]), J = M(() => q.map((e, t) => a(e, t)), [q, a]), Y = M(() => [...c === "multi" ? [{
		kind: "select",
		width: ot
	}] : [], ...r.map((e) => ({
		kind: "data",
		column: e,
		width: Ce[e.id] ?? e.width ?? at
	}))], [
		r,
		c,
		Ce
	]), Ae = M(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), X = Y.map((e, t) => t === Ae ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), je = Y.reduce((e, t) => e + t.width, 0), Me = M(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), Ne = M(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), Pe = H === "auto" ? q.length > 200 : H, Ie = et(q.length, Ee.scrollTop, Ee.height, U, ee, Pe), Le = A && q.length === 0, Re = !A && q.length === 0, ze = Le ? ct : A && q.length > 0 ? 1 : 0, Be = Re ? lt : (q.length + ze) * U, Ve = D((e) => {
		if (o) return o(e);
		let t = r[0];
		if (!t) return "";
		let n = Ze(t, e);
		return $(n, Z(n, t.kind, t.format), {
			locale: ae,
			timeZone: oe
		});
	}, [
		o,
		r,
		ae,
		oe
	]), Q = D((e) => {
		u === void 0 && be(e), p?.(e);
	}, [u, p]), He = (e) => {
		let t = $e(_e, e);
		h === void 0 && ge(t), _?.(t);
	};
	j(() => {
		let e = W.current;
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
	let Ue = (e) => (e - Math.max(1, Math.floor(ee / 2))) * U, We = Ee.scrollTop + Ee.height >= Ue(q.length), Ge = () => {
		let e = W.current;
		if (!e) return;
		let t = et(q.length, e.scrollTop, e.clientHeight, U, ee, Pe), n = e.scrollTop + e.clientHeight >= Ue(q.length);
		(t.start !== Ie.start || t.end !== Ie.end || E && n !== We) && De({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	O(() => {
		Te((e) => {
			let t = e.row < 0 || q.length === 0 ? -1 : Math.min(e.row, q.length - 1), n = Math.max(0, Math.min(e.column, Y.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [q.length, Y.length]), j(() => {
		de.current && (de.current = !1, W.current?.querySelector(`[data-cell="${K.row}:${K.column}"]`)?.focus({ preventScroll: !0 }));
	}), O(() => {
		E && !A && q.length !== 0 && (k !== void 0 && q.length >= k || We && me.current !== q.length && (me.current = q.length, E()));
	}, [
		E,
		A,
		q.length,
		k,
		We
	]);
	let Ke = (e) => {
		let t = W.current;
		if (t && e.row >= 0) {
			let n = tt(e.row, t.scrollTop, t.clientHeight, U, U);
			n !== t.scrollTop && (t.scrollTop = n, De({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		de.current = !0, Te(e);
	}, qe = (e, t) => {
		if (c === "single") {
			Q([e]), pe.current = e;
			return;
		}
		if (c === "multi") {
			if (t && pe.current) {
				Q([.../* @__PURE__ */ new Set([...G, ...nt(J, pe.current, e)])]);
				return;
			}
			Q(Se.has(e) ? G.filter((t) => t !== e) : [...G, e]), pe.current = e;
		}
	}, Ye = (e) => {
		let t = q[e];
		if (t !== void 0) {
			if (b) {
				b(t);
				return;
			}
			W.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Xe = (e, t, n) => {
		let r = q[e];
		r !== void 0 && w && w(r).length !== 0 && ke({
			rowIndex: e,
			x: t,
			y: n
		});
	}, dt = D(() => {
		ke(null), de.current = !0;
	}, []);
	xe(Oe !== null, ue, dt);
	let ft = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		we((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, pt = (e) => {
		if (ut(e.target) || Oe) return;
		let { row: t, column: n } = K, r = q.length, i = Math.max(1, Math.floor((W.current?.clientHeight ?? U * 10) / U) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), ft(n, e.key === "ArrowRight" ? st : -16);
			return;
		}
		let o = rt(K, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && c === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = J[o.row];
				e && (pe.current ||= J[Math.max(0, t)] ?? e, Q([.../* @__PURE__ */ new Set([...G, ...nt(J, pe.current, e)])]));
			}
			Ke(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), He(a.column.id)) : e.key === " " && a?.kind === "select" && c === "multi" && (e.preventDefault(), Q(G.length === J.length ? [] : [...J]));
			return;
		}
		let s = J[t];
		if (e.key === "Enter") e.preventDefault(), Ye(t);
		else if (e.key === " " && s) e.preventDefault(), qe(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && c === "multi") e.preventDefault(), Q([...J]);
		else if (e.key === "F2" && T && a?.kind === "data") {
			e.preventDefault();
			let n = q[t];
			n !== void 0 && T(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Xe(t, n.left + 12, n.bottom);
		}
	}, mt = (e, t) => {
		let n = J[t];
		n && c !== "none" && (e.target.closest("a, button, input, select, textarea") || (c === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? qe(n, e.shiftKey) : (Q([n]), pe.current = n)));
	}, ht = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? 48, o = r.column.id, s = (e) => {
			we((t) => ({
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
				n || Te({
					row: e,
					column: t
				});
			}
		};
	}, _t = [];
	for (let e = Ie.start; e < Ie.end; e++) _t.push(e);
	K.row >= 0 && K.row < q.length && (K.row < Ie.start || K.row >= Ie.end) && _t.push(K.row);
	let vt = c === "multi" && J.length > 0 && J.every((e) => Se.has(e)), yt = c === "multi" && !vt && J.some((e) => Se.has(e)), bt = Oe ? q[Oe.rowIndex] : void 0, xt = {
		"--mtc-grid-template": X,
		"--mtc-grid-min-width": `${je}px`,
		"--mtc-grid-row-height": `${U}px`,
		"--mtc-grid-viewport-width": Ee.width > 0 ? `${Ee.width}px` : "100%"
	};
	return /* @__PURE__ */ L("div", {
		className: S("mtc-data-grid", z && `mtc-density-${z}`, re),
		style: {
			...xt,
			height: V
		},
		children: [
			/* @__PURE__ */ L("div", {
				ref: W,
				role: "grid",
				"aria-label": n,
				"aria-rowcount": (k ?? q.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": c === "multi" || void 0,
				"aria-busy": A || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: pt,
				onScroll: Ge,
				children: [/* @__PURE__ */ I("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ I("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Y.map((t, n) => {
							if (t.kind === "select") return /* @__PURE__ */ I("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...gt(-1, n),
								children: /* @__PURE__ */ I("input", {
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
							let { column: r } = t, i = _e?.columnId === r.id ? _e.direction : void 0, a = r.align === "end" || !r.align && !r.cell && Fe(Z(void 0, r.kind, r.format).kind), o = r.sortable !== !1;
							return /* @__PURE__ */ L("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...gt(-1, n),
								onClick: o ? () => {
									He(r.id), Te({
										row: -1,
										column: n
									});
								} : void 0,
								children: [
									/* @__PURE__ */ I("span", {
										className: "mtc-data-grid-header-label",
										children: r.header
									}),
									i && /* @__PURE__ */ I(e, {
										name: i === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ I("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => ht(e, n),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, r.id);
						})
					})
				}), /* @__PURE__ */ L("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Be },
					children: [
						_t.map((e) => {
							let t = q[e], n = J[e], r = Se.has(n), i = x?.(t);
							return /* @__PURE__ */ I("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": c === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * U },
								...ne?.(t),
								onClick: (t) => mt(t, e),
								onDoubleClick: (t) => {
									t.target.closest("a, button, input, select, textarea") || Ye(e);
								},
								onContextMenu: w ? (t) => {
									t.preventDefault(), c !== "none" && !r && Q([n]), Te({
										row: e,
										column: K.column
									}), Xe(e, t.clientX, t.clientY);
								} : void 0,
								children: Y.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ I("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...gt(e, o),
										children: /* @__PURE__ */ I("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": ie("dataGrid.selectRow", { label: Ve(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => qe(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = Ze(s, t), l = Z(c, s.kind, s.format), u = s.align === "end" || !s.align && !s.cell && Fe(l.kind), d = s.cell ? s.cell(t, {
										value: c,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ I(Je, {
										value: c,
										kind: s.kind,
										format: s.format,
										tones: s.tones,
										context: "grid"
									});
									return /* @__PURE__ */ I("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-align": u ? "end" : "start",
										...gt(e, o),
										children: i && o === Ne ? /* @__PURE__ */ I("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: fe(C ? (e) => C(t, e) : void 0),
											children: d
										}) : d
									}, s.id);
								})
							}, n);
						}),
						Le && Array.from({ length: ct }, (e, t) => /* @__PURE__ */ I("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * U },
							children: Y.map((e, n) => /* @__PURE__ */ I("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ I(d, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Le && /* @__PURE__ */ I("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ I("div", {
								role: "gridcell",
								children: ie("dataGrid.loading")
							})
						}),
						A && q.length > 0 && /* @__PURE__ */ I("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: q.length * U },
							children: /* @__PURE__ */ I("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: ie("dataGrid.loadingMore")
							})
						}),
						Re && /* @__PURE__ */ I("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: lt
							},
							children: /* @__PURE__ */ I("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: F ?? /* @__PURE__ */ I(m, {
									compact: !0,
									title: ie("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			te && /* @__PURE__ */ I("div", {
				className: "mtc-data-grid-footer",
				children: te
			}),
			Oe && bt !== void 0 && w && (() => {
				let e = /* @__PURE__ */ I("div", {
					ref: ue,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ I(ve, {
						label: ie("dataGrid.rowActions", { label: Ve(bt) }),
						items: w(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: Oe.x,
							top: Oe.y
						},
						onClose: dt
					})
				});
				return ce ? R(e, ce) : e;
			})()
		]
	});
}
//#endregion
//#region src/workbench/NavRail.tsx
var ft = T(function({ label: n, sections: r, activeId: i, onNavigate: o, collapsed: s = !1, onCollapsedChange: c, header: l, footer: u, className: d, ...f }, p) {
	let m = t();
	return /* @__PURE__ */ L("nav", {
		...f,
		ref: p,
		"aria-label": n,
		className: S("mtc-nav-rail", d),
		"data-collapsed": s || void 0,
		children: [
			l && /* @__PURE__ */ I("div", {
				className: "mtc-nav-rail-header",
				children: l
			}),
			/* @__PURE__ */ I("div", {
				className: "mtc-nav-rail-sections",
				children: r.map((t) => /* @__PURE__ */ L("div", {
					className: "mtc-nav-rail-section",
					children: [t.label && /* @__PURE__ */ I("div", {
						className: "mtc-nav-rail-section-label",
						"aria-hidden": s || void 0,
						children: t.label
					}), /* @__PURE__ */ I("ul", {
						"aria-label": t.label,
						children: t.items.map((t) => {
							let n = t.id === i, r = t.type ? (() => {
								let { icon: e, color: n } = X(t.type);
								return /* @__PURE__ */ I(H, {
									icon: e,
									color: n,
									size: 16
								});
							})() : t.icon ? /* @__PURE__ */ I(e, {
								name: t.icon,
								className: "mtc-nav-rail-icon"
							}) : null, a = /* @__PURE__ */ L(F, { children: [
								r,
								/* @__PURE__ */ I("span", {
									className: "mtc-nav-rail-label",
									children: t.label
								}),
								t.count != null && /* @__PURE__ */ I("span", {
									className: "mtc-nav-rail-count",
									children: t.count
								})
							] }), c = {
								className: "mtc-nav-rail-item",
								"data-active": n || void 0,
								"aria-current": n ? "page" : void 0,
								title: s ? t.label : void 0
							};
							return /* @__PURE__ */ I("li", { children: t.href && !t.disabled ? /* @__PURE__ */ I("a", {
								...c,
								href: t.href,
								onClick: fe(o ? (e) => o(t, e) : void 0),
								children: a
							}) : /* @__PURE__ */ I("button", {
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
			(u || c) && /* @__PURE__ */ L("div", {
				className: "mtc-nav-rail-footer",
				children: [u, c && /* @__PURE__ */ I(a, {
					icon: /* @__PURE__ */ I(e, { name: "panel-left" }),
					"aria-label": m(s ? "navRail.expand" : "navRail.collapse"),
					"aria-expanded": !s,
					variant: "ghost",
					size: "small",
					onClick: () => c(!s)
				})]
			})
		]
	});
}), pt = T(function({ breadcrumbs: e, title: t, description: n, actions: r, tabs: i, sticky: a = !1, className: o, children: s, ...c }, l) {
	return /* @__PURE__ */ L("div", {
		...c,
		ref: l,
		className: S("mtc-page-header", o),
		"data-sticky": a || void 0,
		children: [
			e && e.length > 0 && /* @__PURE__ */ I(we, {
				items: e,
				className: "mtc-page-header-crumbs"
			}),
			/* @__PURE__ */ L("div", {
				className: "mtc-page-header-main",
				children: [/* @__PURE__ */ I("div", {
					className: "mtc-page-header-heading",
					children: s ?? /* @__PURE__ */ L(F, { children: [t && /* @__PURE__ */ I("h1", {
						className: "mtc-page-header-title",
						children: t
					}), n && /* @__PURE__ */ I("p", {
						className: "mtc-page-header-description",
						children: n
					})] })
				}), r && /* @__PURE__ */ I("div", {
					className: "mtc-page-header-actions",
					children: r
				})]
			}),
			i && /* @__PURE__ */ I("div", {
				className: "mtc-page-header-tabs",
				children: i
			})
		]
	});
}), mt = T(function({ items: e, properties: t, density: n, emptyValue: r = "—", className: i, ...a }, o) {
	let s = e ?? Object.entries(t ?? {}).map(([e, t]) => ({
		id: e,
		label: e,
		value: t
	}));
	return /* @__PURE__ */ I("dl", {
		...a,
		ref: o,
		className: S("mtc-property-list", n && `mtc-density-${n}`, i),
		children: s.map((e, t) => /* @__PURE__ */ L("div", {
			className: "mtc-property-row",
			children: [/* @__PURE__ */ L("dt", { children: [/* @__PURE__ */ I("span", { children: e.label }), e.description && /* @__PURE__ */ I("small", { children: e.description })] }), /* @__PURE__ */ I("dd", { children: E(e.value) ? e.value : /* @__PURE__ */ I(Je, {
				value: e.value,
				kind: e.kind,
				format: e.format,
				emptyValue: r
			}) })]
		}, e.id ?? t))
	});
}), ht = T(function({ type: e, title: n, objectId: r, status: i, meta: a, actions: o, compact: s = !1, headingLevel: c = s ? 2 : 1, typeHref: l, onTypeNavigate: u, className: d, style: p, ...m }, _) {
	let v = t(), { icon: y, color: b } = X(e), x = `h${c}`, C = !s && (i || a && a.length > 0);
	return /* @__PURE__ */ L("div", {
		...m,
		ref: _,
		className: S("mtc-object-header", d),
		"data-compact": s || void 0,
		style: {
			"--mtc-object-type-fg": `var(--mtc-type-${b}-fg)`,
			...p
		},
		children: [
			/* @__PURE__ */ I(H, {
				icon: y,
				color: b,
				size: s ? 24 : 40
			}),
			/* @__PURE__ */ L("div", {
				className: "mtc-object-header-main",
				children: [
					/* @__PURE__ */ L("div", {
						className: "mtc-object-header-eyebrow",
						children: [l ? /* @__PURE__ */ I("a", {
							className: "mtc-object-header-type",
							href: l,
							onClick: fe(u),
							children: e.label
						}) : /* @__PURE__ */ I("span", {
							className: "mtc-object-header-type",
							children: e.label
						}), r && /* @__PURE__ */ L(F, { children: [
							/* @__PURE__ */ I("span", {
								"aria-hidden": "true",
								className: "mtc-object-header-dot",
								children: "·"
							}),
							/* @__PURE__ */ I("code", {
								className: "mtc-object-header-id",
								children: r
							}),
							/* @__PURE__ */ I(f, {
								value: r,
								label: v("objectHeader.copyId")
							})
						] })]
					}),
					/* @__PURE__ */ I(x, {
						className: "mtc-object-header-title",
						children: n
					}),
					s && i && /* @__PURE__ */ I("div", {
						className: "mtc-object-header-status",
						children: /* @__PURE__ */ I(g, {
							tone: i.tone,
							children: i.label
						})
					}),
					C && /* @__PURE__ */ L("div", {
						className: "mtc-object-header-meta",
						children: [i && /* @__PURE__ */ I(g, {
							tone: i.tone,
							children: i.label
						}), a && a.length > 0 && /* @__PURE__ */ I(h, { items: a })]
					})
				]
			}),
			o && /* @__PURE__ */ I("div", {
				className: "mtc-object-header-actions",
				children: o
			})
		]
	});
}), gt = T(function({ properties: n, title: r, filterable: i = !0, actions: o, emptyValue: s, now: c, density: l, labelWidth: u = 160, onNavigate: d, headingLevel: f, className: p, style: m, ...h }, g) {
	let y = t(), { locale: b, timeZone: x } = v(), C = k(), w = N(null), [T, E] = P(!1), [D, O] = P(""), A = M(() => {
		let e = D.trim().toLowerCase();
		return e ? n.filter((t) => {
			let n = $(t.value, Z(t.value, t.kind, t.format), {
				locale: b,
				timeZone: x
			});
			return t.label.toLowerCase().includes(e) || n.toLowerCase().includes(e);
		}) : n;
	}, [
		n,
		D,
		b,
		x
	]), j = M(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of A) {
			let n = t.group ?? "";
			e.set(n, [...e.get(n) ?? [], t]);
		}
		return [...e.entries()];
	}, [A]), R = () => {
		T ? (O(""), E(!1)) : (E(!0), requestAnimationFrame(() => w.current?.focus()));
	};
	return /* @__PURE__ */ L(_, {
		...h,
		ref: g,
		title: r ?? y("propertyPanel.title"),
		subtitle: y("propertyPanel.count", {
			shown: A.length,
			total: n.length
		}),
		headingLevel: f,
		className: S("mtc-property-panel", l && `mtc-density-${l}`, p),
		style: {
			"--mtc-property-label-width": `${u}px`,
			...m
		},
		actions: (i || o) && /* @__PURE__ */ L(F, { children: [o, i && /* @__PURE__ */ I(a, {
			icon: /* @__PURE__ */ I(e, { name: "filter" }),
			"aria-label": y("propertyPanel.filter"),
			"aria-expanded": T,
			"aria-controls": T ? C : void 0,
			variant: T ? "outline" : "ghost",
			size: "small",
			onClick: R
		})] }),
		children: [T && /* @__PURE__ */ I("div", {
			className: "mtc-property-panel-filter",
			children: /* @__PURE__ */ I(ee, {
				ref: w,
				id: C,
				type: "search",
				size: "small",
				value: D,
				"aria-label": y("propertyPanel.filter"),
				placeholder: y("propertyPanel.filter"),
				onChange: (e) => O(e.target.value),
				onKeyDown: (e) => {
					e.key === "Escape" && (e.preventDefault(), R());
				}
			})
		}), A.length === 0 ? /* @__PURE__ */ I("p", {
			className: "mtc-property-panel-empty",
			children: y("propertyPanel.noMatch", { query: D.trim() })
		}) : j.map(([e, t]) => /* @__PURE__ */ L("div", {
			className: "mtc-property-group",
			role: "group",
			"aria-label": e || void 0,
			children: [e && /* @__PURE__ */ I("div", {
				className: "mtc-property-group-label",
				"aria-hidden": "true",
				children: e
			}), /* @__PURE__ */ I("dl", {
				className: "mtc-property-rows",
				children: t.map((e) => /* @__PURE__ */ L("div", {
					className: "mtc-property-row",
					children: [/* @__PURE__ */ L("dt", { children: [/* @__PURE__ */ I("span", { children: e.label }), e.description && /* @__PURE__ */ I("small", { children: e.description })] }), /* @__PURE__ */ I("dd", { children: /* @__PURE__ */ I(Je, {
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
}), _t = .4, vt = 3, yt = 1.25, bt = .8, xt = {
	x: 0,
	y: 0,
	zoom: 1
};
function St({ label: n, width: r, height: i, viewHeight: o, children: s }) {
	let c = t(), l = N(null), u = N(null), d = N(null), [f, p] = P(0), [m, h] = P(xt);
	j(() => {
		let e = l.current;
		if (!e) return;
		let t = () => p(e.clientWidth);
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let g = f || r, _ = Math.min(1, Math.max(bt, Math.min(g / r, o / i))) * m.zoom, v = (g - r * _) / 2 + m.x, y = (o - i * _) / 2 + m.y, b = (e) => h((t) => ({
		...t,
		zoom: Math.min(vt, Math.max(_t, t.zoom * e))
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
	return /* @__PURE__ */ L("div", {
		ref: l,
		className: "mtc-graph-canvas",
		style: { height: o },
		children: [/* @__PURE__ */ I("svg", {
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
				(e.ctrlKey || e.metaKey) && (e.preventDefault(), b(e.deltaY < 0 ? yt : 1 / yt));
			},
			onKeyDown: (e) => {
				if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
				let t = [...u.current?.querySelectorAll("[data-graph-node]") ?? []], n = t.indexOf(document.activeElement);
				n < 0 || (e.preventDefault(), t[(n + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + t.length) % t.length]?.focus());
			},
			children: /* @__PURE__ */ I("g", {
				transform: `translate(${Ct(v)} ${Ct(y)}) scale(${Ct(_)})`,
				children: s
			})
		}), /* @__PURE__ */ L("div", {
			className: "mtc-graph-controls",
			children: [
				/* @__PURE__ */ I(a, {
					icon: /* @__PURE__ */ I(e, { name: "add" }),
					"aria-label": c("graph.zoomIn"),
					size: "small",
					onClick: () => b(yt)
				}),
				/* @__PURE__ */ I(a, {
					icon: /* @__PURE__ */ I(e, { name: "minus" }),
					"aria-label": c("graph.zoomOut"),
					size: "small",
					onClick: () => b(1 / yt)
				}),
				/* @__PURE__ */ I(a, {
					icon: /* @__PURE__ */ I(e, { name: "refresh" }),
					"aria-label": c("graph.reset"),
					size: "small",
					onClick: () => h(xt)
				})
			]
		})]
	});
}
function Ct(e) {
	return Math.round(e * 1e3) / 1e3;
}
//#endregion
//#region src/objects/linkGraphLayout.ts
function wt(e, t) {
	let n = e.map((e) => Math.min(e.items.length, Math.max(0, e.count))), r = (t) => t.reduce((t, n, r) => t + n + +(e[r].count > n), 0), i = [...n];
	for (; r(i) > t;) {
		let e = -1;
		for (let t = 0; t < i.length; t++) i[t] > 1 && (e < 0 || i[t] > i[e]) && (e = t);
		if (e < 0) break;
		--i[e];
	}
	return i;
}
var Tt = 40, Et = 120, Dt = .6;
function Ot(e, t = 40) {
	let n = wt(e, t), r = n.map((t, n) => t + +(e[n].count > t)), i = r.reduce((e, t) => e + t, 0);
	if (i === 0) return {
		nodes: [],
		labels: [],
		radius: Et
	};
	let a = i + (e.length > 1 ? e.length * Dt : 0), o = Math.max(Et, i * Tt / (2 * Math.PI)), s = 2 * Math.PI / a, c = [], l = [], u = Math.PI - (e.length > 1 ? Dt * s / 2 : 0);
	return e.forEach((t, i) => {
		let a = r[i];
		if (a === 0) return;
		let d = u + (e.length > 1 ? Dt * s / 2 : 0), f = (e) => d + (e + .5) * s, p = t.items.slice(0, n[i]);
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
		}), u = d + a * s + (e.length > 1 ? Dt * s / 2 : 0);
	}), {
		nodes: c,
		labels: l,
		radius: o
	};
}
//#endregion
//#region src/objects/LinkGraph.tsx
var kt = 24, At = 40, jt = 150, Mt = 22, Nt = 16;
function Pt(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Ft({ x: e, y: t, size: n, color: r, icon: i, center: a }) {
	return /* @__PURE__ */ L("g", {
		className: "mtc-graph-glyph",
		"data-center": a || void 0,
		style: r ? { color: `var(--mtc-type-${r}-fg)` } : void 0,
		children: [/* @__PURE__ */ I("rect", {
			x: e - n / 2,
			y: t - n / 2,
			width: n,
			height: n,
			rx: 4,
			fill: r ? `var(--mtc-type-${r}-bg)` : "var(--mtc-panel)"
		}), i]
	});
}
function It({ center: n, groups: r, label: i, maxNodes: a = 40, height: o = 320, onNavigate: s }) {
	let c = t(), l = M(() => Ot(r, a), [r, a]), u = l.nodes.length > Nt, d = l.radius + kt + jt, f = l.radius + kt + 16, p = d * 2, m = f * 2, h = d, g = f, _ = n.type ? X(n.type) : null, v = (e) => {
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
		if (!s || !de(n)) {
			t || n.preventDefault();
			return;
		}
		n.preventDefault(), s(e, n);
	};
	return /* @__PURE__ */ L(St, {
		label: i,
		width: p,
		height: m,
		viewHeight: o,
		children: [
			/* @__PURE__ */ I("g", {
				className: "mtc-graph-edges",
				children: l.nodes.map((e) => /* @__PURE__ */ I("line", {
					x1: h,
					y1: g,
					x2: h + e.x,
					y2: g + e.y,
					className: "mtc-graph-edge",
					"data-direction": r[e.groupIndex]?.direction ?? "outgoing"
				}, `edge:${e.key}`))
			}),
			l.labels.map((e) => /* @__PURE__ */ I("text", {
				x: h + e.x,
				y: g + e.y,
				textAnchor: "middle",
				dominantBaseline: "middle",
				className: "mtc-graph-edge-label",
				children: Pt(e.text, 18)
			}, `label:${e.groupIndex}`)),
			/* @__PURE__ */ I("g", {
				className: "mtc-graph-node",
				"data-center": "true",
				"aria-hidden": "true",
				children: /* @__PURE__ */ I(Ft, {
					x: h,
					y: g,
					size: At,
					center: !0,
					color: _?.color ?? null,
					icon: /* @__PURE__ */ I(e, {
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
				return /* @__PURE__ */ L("a", {
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
					children: [t.kind === "more" ? /* @__PURE__ */ L("g", {
						className: "mtc-graph-more",
						children: [/* @__PURE__ */ I("rect", {
							x: o - kt / 2,
							y: l - kt / 2,
							width: kt,
							height: kt,
							rx: kt / 2
						}), /* @__PURE__ */ L("text", {
							x: o,
							y: l,
							textAnchor: "middle",
							dominantBaseline: "central",
							children: ["+", t.moreCount]
						})]
					}) : /* @__PURE__ */ I(Ft, {
						x: o,
						y: l,
						size: kt,
						color: a.color,
						icon: /* @__PURE__ */ I(e, {
							name: a.icon,
							x: o - 7,
							y: l - 7,
							width: 14,
							height: 14,
							size: 14,
							strokeWidth: 2
						})
					}), /* @__PURE__ */ I("text", {
						x: _,
						y: b,
						textAnchor: m,
						dominantBaseline: "middle",
						transform: x ? `rotate(${x.toFixed(2)} ${_.toFixed(2)} ${b.toFixed(2)})` : void 0,
						className: "mtc-graph-node-label",
						children: Pt(S, Mt)
					})]
				}, t.key);
			})
		]
	});
}
//#endregion
//#region src/objects/LinkPanel.tsx
function Lt({ group: n }) {
	let r = t(), { icon: i, color: a } = X(n.targetType), o = n.direction === "incoming";
	return /* @__PURE__ */ L("div", {
		className: "mtc-link-relation",
		children: [
			o && /* @__PURE__ */ I(e, {
				name: "arrow-left",
				label: r("linkPanel.incoming"),
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ I("span", {
				className: "mtc-link-relation-name",
				children: n.relation
			}),
			!o && /* @__PURE__ */ I(e, {
				name: "arrow-right",
				className: "mtc-link-arrow"
			}),
			/* @__PURE__ */ I(H, {
				icon: i,
				color: a,
				size: 16
			}),
			/* @__PURE__ */ I("span", {
				className: "mtc-link-relation-type",
				children: n.targetType.label
			}),
			/* @__PURE__ */ I("span", {
				className: "mtc-link-relation-count",
				children: n.count
			})
		]
	});
}
var Rt = T(function({ groups: e, title: n, subtitle: r, maxItems: i = 3, actions: a, onNavigate: o, headingLevel: s, className: c, ...l }, u) {
	let d = t(), f = e.reduce((e, t) => e + t.count, 0);
	return /* @__PURE__ */ I(_, {
		...l,
		ref: u,
		title: n ?? d("linkPanel.title"),
		subtitle: r ?? d("linkPanel.summary", {
			types: e.length,
			objects: f
		}),
		actions: a,
		headingLevel: s,
		className: S("mtc-link-panel", c),
		children: e.length === 0 ? /* @__PURE__ */ I("p", {
			className: "mtc-link-panel-empty",
			children: d("linkPanel.empty")
		}) : e.map((e) => {
			let t = e.items.slice(0, i), n = e.count > t.length;
			return /* @__PURE__ */ L("section", {
				className: "mtc-link-group",
				"aria-label": `${e.relation} ${e.targetType.label}`,
				children: [
					/* @__PURE__ */ I(Lt, { group: e }),
					t.length > 0 && /* @__PURE__ */ I("ul", {
						className: "mtc-link-items",
						children: t.map((e) => /* @__PURE__ */ L("li", {
							className: "mtc-link-item",
							children: [/* @__PURE__ */ I(Me, {
								object: e,
								onNavigate: o,
								mono: e.mono,
								className: "mtc-link-item-chip"
							}), e.detail != null && /* @__PURE__ */ I("span", {
								className: "mtc-link-item-detail",
								children: e.detail
							})]
						}, e.id))
					}),
					n && (e.viewAllHref || e.onViewAll) && (e.viewAllHref ? /* @__PURE__ */ I("a", {
						className: "mtc-link-view-all",
						href: e.viewAllHref,
						onClick: fe(e.onViewAll),
						children: e.viewAllLabel ?? d("linkPanel.viewAll", { count: e.count })
					}) : /* @__PURE__ */ I("button", {
						type: "button",
						className: "mtc-link-view-all",
						onClick: e.onViewAll,
						children: e.viewAllLabel ?? d("linkPanel.viewAll", { count: e.count })
					}))
				]
			}, e.id);
		})
	});
}), zt = 176, Bt = 44, Vt = 20, Ht = 56;
function Ut(e, t, n, r, i) {
	if (e === "right") {
		if (r > t) {
			let e = (r - t) / 2;
			return `M${t} ${n} C${t + e} ${n} ${r - e} ${i} ${r - 2} ${i}`;
		}
		let e = t - zt, a = r + zt;
		return `M${e} ${n} C${e - Ht} ${n} ${a + Ht} ${i} ${a + 2} ${i}`;
	}
	if (i > n) {
		let e = (i - n) / 2;
		return `M${t} ${n} C${t} ${n + e} ${r} ${i - e} ${r} ${i - 2}`;
	}
	let a = n - Bt, o = i + Bt;
	return `M${t} ${a} C${t} ${a - Ht} ${r} ${o + Ht} ${r} ${o + 2}`;
}
function Wt(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Gt({ types: t, relations: n, label: r, selectedId: i, onSelect: a, height: s = 360, direction: c = "right" }) {
	let { locale: l } = v(), u = `mtc-schema-arrow-${k().replace(/[^a-zA-Z0-9_-]/g, "")}`, d = M(() => C(t, n, {
		nodeWidth: zt,
		nodeHeight: Bt,
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
		a && de(t) && (t.preventDefault(), a(e, t));
	};
	return /* @__PURE__ */ L(St, {
		label: r,
		width: d.width,
		height: d.height,
		viewHeight: s,
		children: [
			/* @__PURE__ */ I("defs", { children: /* @__PURE__ */ I("marker", {
				id: u,
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				markerUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ I("path", {
					d: "M0,0 L0,8 L8,4 z",
					className: "mtc-graph-arrow"
				})
			}) }),
			/* @__PURE__ */ I("g", {
				className: "mtc-graph-edges",
				children: d.edges.map(({ edge: e, x1: t, y1: n, x2: r, y2: a }, o) => {
					let s = Ut(c, t, n, r, a), l = i !== void 0 && (e.from === i || e.to === i);
					return /* @__PURE__ */ L("g", { children: [/* @__PURE__ */ I("path", {
						d: s,
						className: "mtc-graph-edge",
						"data-active": l || void 0,
						markerEnd: `url(#${u})`
					}), /* @__PURE__ */ I("text", {
						x: (t + r) / 2,
						y: (n + a) / 2 - 6,
						textAnchor: "middle",
						className: "mtc-graph-edge-label",
						children: Wt(e.label, 18)
					})] }, e.id ?? `${e.from}:${e.to}:${o}`);
				})
			}),
			d.nodes.map(({ node: t, x: n, y: r }) => {
				let { icon: s, color: c } = X(t), u = t.id === i, d = !!(t.href || a), p = t.count === void 0 ? t.label : `${t.label}, ${o(t.count, { locale: l })}`;
				return /* @__PURE__ */ L("a", {
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
						/* @__PURE__ */ I("rect", {
							x: n,
							y: r,
							width: zt,
							height: Bt,
							rx: 4,
							className: "mtc-schema-node-box"
						}),
						/* @__PURE__ */ L("g", {
							style: { color: `var(--mtc-type-${c}-fg)` },
							children: [/* @__PURE__ */ I("rect", {
								x: n + 10,
								y: r + 10,
								width: 24,
								height: 24,
								rx: 4,
								fill: `var(--mtc-type-${c}-bg)`
							}), /* @__PURE__ */ I(e, {
								name: s,
								x: n + 15,
								y: r + 15,
								width: 14,
								height: 14,
								size: 14,
								strokeWidth: 2
							})]
						}),
						/* @__PURE__ */ I("text", {
							x: n + 44,
							y: t.count === void 0 ? r + Bt / 2 : r + 18,
							dominantBaseline: "middle",
							className: "mtc-graph-node-label",
							"data-emphasis": "true",
							children: Wt(t.label, Vt)
						}),
						t.count !== void 0 && /* @__PURE__ */ I("text", {
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
function Kt(e) {
	let t = e instanceof Date ? e : new Date(e);
	return Number.isNaN(t.getTime()) ? String(e) : t.toISOString();
}
var qt = T(function({ items: e, variant: n = "feed", now: a, onNavigate: o, emptyLabel: s, className: c, ...l }, u) {
	let d = t(), { locale: f, timeZone: m } = v();
	return e.length === 0 ? /* @__PURE__ */ I("p", {
		className: "mtc-activity-empty",
		children: s ?? d("activity.empty")
	}) : /* @__PURE__ */ I("ol", {
		...l,
		ref: u,
		className: S("mtc-activity-feed", c),
		"data-variant": n,
		children: e.map((e) => {
			let t = Kt(e.timestamp), s = i(e.timestamp, {
				locale: f,
				timeZone: m
			});
			return /* @__PURE__ */ L("li", {
				className: "mtc-activity-item",
				"data-tone": e.tone ?? "neutral",
				children: [
					n === "timeline" ? /* @__PURE__ */ I("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}) : e.actor ? /* @__PURE__ */ I(p, {
						name: e.actor.name,
						src: e.actor.avatarSrc,
						decorative: !0
					}) : /* @__PURE__ */ I("span", {
						className: "mtc-activity-dot",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ L("p", {
						className: "mtc-activity-text",
						children: [
							e.actor && /* @__PURE__ */ I("span", {
								className: "mtc-activity-actor",
								children: e.actor.name
							}),
							" ",
							/* @__PURE__ */ I("span", {
								className: "mtc-activity-verb",
								children: e.verb
							}),
							e.object && /* @__PURE__ */ L(F, { children: [" ", /* @__PURE__ */ I(Me, {
								object: e.object,
								onNavigate: o
							})] }),
							e.summary != null && /* @__PURE__ */ L(F, { children: [" ", /* @__PURE__ */ I("span", {
								className: "mtc-activity-summary",
								children: e.summary
							})] })
						]
					}),
					/* @__PURE__ */ I("time", {
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
}), Jt = T(function({ label: n, groups: r, onChange: i, onClear: a, className: s, ...c }, l) {
	let u = t(), { locale: d } = v(), [f, p] = P(/* @__PURE__ */ new Set()), m = r.some((e) => e.selected.length > 0);
	return /* @__PURE__ */ L("div", {
		...c,
		ref: l,
		role: "group",
		"aria-label": n,
		className: S("mtc-facet-list", s),
		children: [a && m && /* @__PURE__ */ I("div", {
			className: "mtc-facet-list-header",
			children: /* @__PURE__ */ I("button", {
				type: "button",
				className: "mtc-facet-clear",
				onClick: a,
				children: u("facet.clear")
			})
		}), r.map((t) => {
			let n = t.maxVisible ?? 8, r = f.has(t.id), a = t.options.length - n, s = r || a <= 0 ? t.options : t.options.slice(0, n), c = `mtc-facet-${t.id}`;
			return /* @__PURE__ */ L("fieldset", {
				className: "mtc-facet-group",
				children: [
					/* @__PURE__ */ I("legend", {
						className: "mtc-facet-legend",
						children: t.label
					}),
					/* @__PURE__ */ I("div", {
						className: "mtc-facet-options",
						children: s.map((n) => {
							let r = t.selected.includes(n.value), a = n.type ? X(n.type) : null;
							return /* @__PURE__ */ L("label", {
								className: "mtc-facet-option",
								"data-mode": t.mode,
								"data-checked": r || void 0,
								children: [
									/* @__PURE__ */ I("input", {
										type: t.mode === "single" ? "radio" : "checkbox",
										name: c,
										value: n.value,
										checked: r,
										className: t.mode === "single" ? "mtc-visually-hidden" : "mtc-facet-checkbox",
										onChange: () => {
											t.mode === "single" ? i(t.id, [n.value]) : i(t.id, r ? t.selected.filter((e) => e !== n.value) : [...t.selected, n.value]);
										}
									}),
									a ? /* @__PURE__ */ I(H, {
										icon: a.icon,
										color: a.color,
										size: 16
									}) : n.icon ? /* @__PURE__ */ I(e, {
										name: n.icon,
										className: "mtc-facet-icon"
									}) : null,
									/* @__PURE__ */ I("span", {
										className: "mtc-facet-label",
										children: n.label
									}),
									n.count !== void 0 && /* @__PURE__ */ I("span", {
										className: "mtc-facet-count",
										children: o(n.count, { locale: d })
									})
								]
							}, n.value);
						})
					}),
					a > 0 && /* @__PURE__ */ I("button", {
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
});
//#endregion
export { ye as A, oe as B, Te as C, we as D, Ee as E, pe as F, te as G, ee as H, ue as I, B as J, z as K, U as L, ge as M, he as N, Ce as O, me as P, le as R, ke as S, De as T, ie as U, ne as V, ae as W, Z as _, It as a, X as b, mt as c, dt as d, Je as f, We as g, Fe as h, Rt as i, be as j, _e as k, pt as l, $ as m, qt as n, gt as o, Ke as p, H as q, Gt as r, ht as s, Jt as t, ft as u, Me as v, Oe as w, J as x, je as y, re as z };
