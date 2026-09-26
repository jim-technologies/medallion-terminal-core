import { T as e, h as t } from "./States-BRpBuveA.js";
import { t as n } from "./utils-BfYGx7e_.js";
import { cloneElement as r, forwardRef as i, isValidElement as a, useEffect as o, useId as s, useMemo as c, useRef as l, useState as u } from "react";
import { jsx as d, jsxs as f } from "react/jsx-runtime";
//#region src/components/FormControls.tsx
var p = i(function({ size: e = "medium", density: t, invalid: r, className: i, ...a }, o) {
	return /* @__PURE__ */ d("input", {
		...a,
		ref: o,
		"aria-invalid": r || a["aria-invalid"] || void 0,
		className: n("mtc-input", t && `mtc-density-${t}`, i),
		"data-size": e
	});
}), m = i(function({ size: e = "medium", density: t, invalid: r, className: i, ...a }, o) {
	return /* @__PURE__ */ d("textarea", {
		...a,
		ref: o,
		"aria-invalid": r || a["aria-invalid"] || void 0,
		className: n("mtc-input mtc-textarea", t && `mtc-density-${t}`, i),
		"data-size": e
	});
});
function h({ label: e, children: t, id: i, description: o, error: c, required: l, className: u }) {
	let p = s(), m = (a(t) && typeof t.props.id == "string" ? t.props.id : void 0) ?? i ?? `mtc-field-${p}`, h = o ? `${m}-description` : void 0, g = c ? `${m}-error` : void 0, _ = [
		a(t) && typeof t.props["aria-describedby"] == "string" ? t.props["aria-describedby"] : void 0,
		h,
		g
	].filter(Boolean).join(" ") || void 0, v = (a(t) && typeof t.props.required == "boolean" ? t.props.required : void 0) ?? l, y = a(t) ? r(t, {
		id: m,
		"aria-describedby": _,
		"aria-invalid": t.props["aria-invalid"] ?? (c ? !0 : void 0),
		required: v
	}) : t;
	return /* @__PURE__ */ f("div", {
		className: n("mtc-form-field", u),
		children: [
			/* @__PURE__ */ f("label", {
				className: "mtc-form-label",
				htmlFor: m,
				children: [e, v && /* @__PURE__ */ d("span", {
					"aria-hidden": "true",
					className: "mtc-form-required",
					children: " *"
				})]
			}),
			y,
			o && /* @__PURE__ */ d("div", {
				id: h,
				className: "mtc-form-description",
				children: o
			}),
			c && /* @__PURE__ */ d("div", {
				id: g,
				className: "mtc-form-error",
				role: "alert",
				children: c
			})
		]
	});
}
var g = i(function({ label: e, description: r, density: i, className: a, ...o }, s) {
	return /* @__PURE__ */ f("label", {
		className: n("mtc-choice", i && `mtc-density-${i}`, a),
		children: [
			/* @__PURE__ */ d("input", {
				...o,
				ref: s,
				type: "checkbox",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ d("span", {
				className: "mtc-choice-box",
				"aria-hidden": "true",
				children: /* @__PURE__ */ d(t, { name: "check" })
			}),
			/* @__PURE__ */ f("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ d("span", {
					className: "mtc-choice-label",
					children: e
				}), r && /* @__PURE__ */ d("span", {
					className: "mtc-choice-description",
					children: r
				})]
			})
		]
	});
}), _ = i(function({ label: e, description: t, density: r, className: i, ...a }, o) {
	return /* @__PURE__ */ f("label", {
		className: n("mtc-choice", r && `mtc-density-${r}`, i),
		children: [
			/* @__PURE__ */ d("input", {
				...a,
				ref: o,
				type: "radio",
				className: "mtc-choice-input"
			}),
			/* @__PURE__ */ d("span", {
				className: "mtc-choice-box mtc-radio-box",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ f("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ d("span", {
					className: "mtc-choice-label",
					children: e
				}), t && /* @__PURE__ */ d("span", {
					className: "mtc-choice-description",
					children: t
				})]
			})
		]
	});
}), v = i(function({ checked: e, onCheckedChange: t, label: r, description: i, density: a, className: o, ...s }, c) {
	return /* @__PURE__ */ f("label", {
		className: n("mtc-switch", a && `mtc-density-${a}`, o),
		children: [
			/* @__PURE__ */ d("input", {
				...s,
				ref: c,
				type: "checkbox",
				role: "switch",
				checked: e,
				onChange: (e) => t(e.currentTarget.checked),
				className: "mtc-switch-input"
			}),
			/* @__PURE__ */ d("span", {
				className: "mtc-switch-track",
				"aria-hidden": "true",
				children: /* @__PURE__ */ d("span", {})
			}),
			/* @__PURE__ */ f("span", {
				className: "mtc-choice-copy",
				children: [/* @__PURE__ */ d("span", {
					className: "mtc-choice-label",
					children: r
				}), i && /* @__PURE__ */ d("span", {
					className: "mtc-choice-description",
					children: i
				})]
			})
		]
	});
}), y = i(function({ value: r, onValueChange: i, options: a, placeholder: p, disabled: m, required: h, name: g, id: _, "aria-label": v, "aria-labelledby": y, "aria-describedby": b, "aria-invalid": x, invalid: S, size: C = "medium", density: w, className: T, emptyMessage: E }, D) {
	let O = e(), k = s(), A = _ ?? `mtc-combobox-${k}`, j = `${A}-listbox`, M = l(null), N = l(null), P = a.find((e) => e.value === r), [F, I] = u(P?.label ?? ""), [L, R] = u(!1), [z, B] = u(-1), V = c(() => {
		let e = F.trim().toLocaleLowerCase();
		return !e || P?.label === F ? [...a] : a.filter((t) => t.label.toLocaleLowerCase().includes(e) || t.description?.toLocaleLowerCase().includes(e));
	}, [
		a,
		F,
		P?.label
	]);
	o(() => {
		L || I(P?.label ?? "");
	}, [L, P?.label]), o(() => {
		N.current?.setCustomValidity(h && !P ? "Please select an option." : "");
	}, [h, P]), o(() => {
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
		e.disabled || (i(e.value), I(e.label), R(!1), B(-1));
	};
	return /* @__PURE__ */ f("div", {
		ref: M,
		className: n("mtc-combobox", w && `mtc-density-${w}`, T),
		"data-size": C,
		onBlurCapture: (e) => {
			e.currentTarget.contains(e.relatedTarget) || R(!1);
		},
		children: [
			g && /* @__PURE__ */ d("input", {
				type: "hidden",
				name: g,
				value: r ?? ""
			}),
			/* @__PURE__ */ d("input", {
				ref: (e) => {
					N.current = e, typeof D == "function" ? D(e) : D && (D.current = e);
				},
				id: A,
				value: F,
				disabled: m,
				required: h,
				placeholder: p ?? O("combobox.placeholder"),
				role: "combobox",
				"aria-label": v,
				"aria-labelledby": y,
				"aria-describedby": b,
				"aria-invalid": S || x || void 0,
				"aria-required": h || void 0,
				"aria-expanded": L,
				"aria-controls": L ? j : void 0,
				"aria-autocomplete": "list",
				"aria-activedescendant": L && z >= 0 ? `${A}-option-${z}` : void 0,
				className: "mtc-input mtc-combobox-input",
				onFocus: () => {
					R(!0), B(V.findIndex((e) => e.value === r && !e.disabled));
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
			/* @__PURE__ */ d(t, {
				name: "chevron-down",
				className: "mtc-combobox-chevron",
				"aria-hidden": "true"
			}),
			L && !m && /* @__PURE__ */ d("div", {
				id: j,
				role: "listbox",
				className: "mtc-combobox-list mtc-popover",
				children: V.length === 0 ? /* @__PURE__ */ d("div", {
					className: "mtc-combobox-empty",
					children: E ?? O("combobox.empty")
				}) : V.map((e, n) => /* @__PURE__ */ f("div", {
					id: `${A}-option-${n}`,
					role: "option",
					"aria-selected": e.value === r,
					"aria-disabled": e.disabled || void 0,
					className: "mtc-combobox-option",
					"data-active": z === n,
					"data-selected": e.value === r,
					onMouseDown: (e) => e.preventDefault(),
					onMouseMove: () => {
						e.disabled || B(n);
					},
					onClick: () => U(e),
					children: [/* @__PURE__ */ f("span", {
						className: "mtc-combobox-option-copy",
						children: [/* @__PURE__ */ d("span", { children: e.label }), e.description && /* @__PURE__ */ d("small", { children: e.description })]
					}), e.value === r && /* @__PURE__ */ d(t, { name: "check" })]
				}, e.value))
			})
		]
	});
});
//#endregion
export { _ as a, p as i, y as n, v as o, h as r, m as s, g as t };
