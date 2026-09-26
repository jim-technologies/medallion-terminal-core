import { T as e, h as t } from "./States-BRpBuveA.js";
import { T as n } from "./sourceError-CTpw8oGk.js";
import { t as r } from "./PropertyValue-pJrg2xQi.js";
import { lt as i, rt as a } from "./MultiDashboard-DqVJUr-r.js";
import { i as o, o as s, r as c } from "./format-V6rpoQ-_.js";
import { r as l } from "./textNormalize-Ba1I6dwH.js";
import { jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/widgets/RecordFields.tsx
function f(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = e;
		return String(t.id ?? t.value ?? t.label ?? t.name ?? "");
	}
	return e == null ? "" : String(e);
}
function p(e, t) {
	return e.choices.find((e) => e.value === f(t));
}
function m(e) {
	switch (e?.toLowerCase()) {
		case "info":
		case "blue":
		case "cyan":
		case "purple": return "info";
		case "ok":
		case "green":
		case "emerald": return "ok";
		case "warn":
		case "amber":
		case "yellow":
		case "orange": return "warning";
		case "danger":
		case "red": return "danger";
		default: return "neutral";
	}
}
function h({ field: e, value: t }) {
	let n = g(e, t);
	return /* @__PURE__ */ u(r, {
		value: n,
		kind: "enum",
		tones: { [n]: m(p(e, t)?.color) },
		context: "grid"
	});
}
function g(e, t) {
	return p(e, t)?.label ?? i(t);
}
function _(e, t) {
	if (e.type === "currency" || e.format?.startsWith("currency")) {
		let n = e.format?.startsWith("currency:") ? e.format.slice(9) : "USD";
		return o(t, n);
	}
	return e.type === "percent" || e.format === "percent" ? s(t) : e.format === "compact" ? c(t) : t.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function v({ field: a, value: o, context: s = "panel" }) {
	let c = e();
	if (o == null || o === "") return /* @__PURE__ */ u("span", {
		className: "mtc-value-empty",
		children: "—"
	});
	if (a.type === "boolean") return /* @__PURE__ */ u(r, {
		value: o === !0 || o === "true",
		kind: "boolean",
		context: "grid"
	});
	if (Array.isArray(o)) {
		if (o.length === 0) return /* @__PURE__ */ u("span", {
			className: "mtc-value-empty",
			children: "—"
		});
		let e = o.slice(0, s === "grid" ? 2 : 4), t = o.slice(e.length);
		return /* @__PURE__ */ d("span", {
			className: "mtc-value-list",
			"data-context": s,
			children: [e.map((e, t) => /* @__PURE__ */ u(h, {
				field: a,
				value: e
			}, `${i(e)}:${t}`)), t.length > 0 && /* @__PURE__ */ u(n, {
				className: "mtc-value-chip mtc-value-more",
				title: c("value.moreTitle", {
					count: t.length,
					items: t.map((e) => g(a, e)).join(", ")
				}),
				children: c("value.more", { count: t.length })
			})]
		});
	}
	if (a.type === "single_select" || a.type === "user" && a.choices.length > 0 || a.type === "link" && p(a, o)) return /* @__PURE__ */ u(h, {
		field: a,
		value: o
	});
	if (typeof o == "number") return /* @__PURE__ */ u("span", {
		className: "tabular-nums",
		children: _(a, o)
	});
	if (a.type === "date" || a.type === "datetime" || a.type === "created_at" || a.type === "updated_at") return /* @__PURE__ */ u(r, {
		value: o,
		kind: a.type === "date" ? "date" : "datetime",
		context: "grid"
	});
	if (a.type === "url") {
		let e = l(o);
		if (e) return /* @__PURE__ */ d("a", {
			href: e,
			...e.startsWith("/") ? {} : {
				target: "_blank",
				rel: "noopener noreferrer"
			},
			className: "mtc-value-link",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ u("span", {
				className: "mtc-value-link-text",
				children: e
			}), !e.startsWith("/") && /* @__PURE__ */ u(t, { name: "external-link" })]
		});
	}
	return /* @__PURE__ */ u("span", { children: i(o) });
}
var y = "mtc-control w-full px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500";
function b(e) {
	return e && typeof e == "object" ? f(e) : e == null ? "" : String(e);
}
function x(e) {
	if (typeof e != "string") return "";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e.slice(0, 16) : (/* @__PURE__ */ new Date(t.getTime() - t.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}
function S(e, t, n) {
	if (e.key === "Escape") e.preventDefault(), n?.();
	else if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
		if (e.currentTarget.tagName === "TEXTAREA" && !t) return;
		e.preventDefault(), t?.();
	}
}
function C(e) {
	if (e.type === "boolean") return "boolean";
	let t = (e.type === "user" || e.type === "link") && e.choices.length > 0;
	return e.type === "single_select" || t && !e.allowMultiple ? "choice" : e.type === "multi_select" || t && e.allowMultiple ? "choices" : e.type === "long_text" ? "long_text" : "field";
}
function w(e) {
	let t = C(e);
	return t === "choices" || t === "long_text" ? "overlay" : "inline";
}
function T({ field: e, value: t, onChange: n, label: r, describedBy: i, disabled: o, autoFocus: s, onCommit: c, onCancel: l }) {
	let p = o || !a(e), m = C(e);
	if (p) return /* @__PURE__ */ u("div", {
		className: "flex items-center min-h-7 px-2 py-1.5 border border-zinc-800 rounded bg-zinc-950/30 text-xs text-zinc-400",
		children: /* @__PURE__ */ u(v, {
			field: e,
			value: t
		})
	});
	if (m === "boolean") return /* @__PURE__ */ d("label", {
		className: "flex items-center gap-2 min-h-7 text-xs text-zinc-300",
		children: [/* @__PURE__ */ u("input", {
			type: "checkbox",
			checked: t === !0,
			onChange: (e) => n(e.target.checked),
			disabled: o,
			autoFocus: s,
			"aria-label": r,
			"aria-describedby": i,
			onKeyDown: (e) => S(e, c, l),
			className: "w-4 h-4"
		}), t === !0 ? "Yes" : "No"]
	});
	if (m === "choice") return /* @__PURE__ */ d("select", {
		value: f(t),
		onChange: (e) => n(e.target.value || null),
		disabled: o,
		autoFocus: s,
		"aria-label": r,
		"aria-describedby": i,
		onKeyDown: (e) => S(e, c, l),
		className: y,
		children: [/* @__PURE__ */ u("option", {
			value: "",
			children: "Select…"
		}), e.choices.map((e) => /* @__PURE__ */ u("option", {
			value: e.value,
			children: e.label
		}, e.value))]
	});
	if (m === "choices") {
		let a = Array.isArray(t) ? t.map(f) : [];
		return /* @__PURE__ */ u("select", {
			multiple: !0,
			value: a,
			onChange: (e) => n([...e.target.selectedOptions].map((e) => e.value)),
			disabled: o,
			autoFocus: s,
			"aria-label": r,
			"aria-describedby": i,
			onKeyDown: (e) => S(e, c, l),
			className: `${y} min-h-24`,
			children: e.choices.map((e) => /* @__PURE__ */ u("option", {
				value: e.value,
				children: e.label
			}, e.value))
		});
	}
	if (m === "long_text") return /* @__PURE__ */ u("textarea", {
		value: b(t),
		onChange: (e) => n(e.target.value),
		disabled: o,
		autoFocus: s,
		"aria-label": r,
		"aria-describedby": i,
		onKeyDown: (e) => S(e, c, l),
		rows: 4,
		className: `${y} resize-y`
	});
	let h = e.type === "number" || e.type === "currency" || e.type === "percent", g = h ? "number" : e.type === "date" ? "date" : e.type === "datetime" ? "datetime-local" : e.type === "email" ? "email" : e.type === "phone" ? "tel" : e.type === "url" ? "url" : "text", _ = e.type === "datetime" ? x(t) : b(t);
	return /* @__PURE__ */ u("input", {
		type: g,
		value: _,
		onChange: (t) => {
			if (h) {
				let e = Number(t.target.value);
				n(t.target.value === "" || !Number.isFinite(e) ? null : e);
			} else e.type === "datetime" ? n(t.target.value ? new Date(t.target.value).toISOString() : null) : n(t.target.value);
		},
		disabled: o,
		autoFocus: s,
		"aria-label": r,
		"aria-describedby": i,
		onKeyDown: (e) => S(e, c, l),
		className: y
	});
}
//#endregion
export { v as n, w as r, T as t };
