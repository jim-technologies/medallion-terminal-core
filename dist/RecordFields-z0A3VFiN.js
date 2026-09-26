import { h as e } from "./States-Ds3cxTem.js";
import { t } from "./PropertyValue-BVLSKEmT.js";
import { lt as n, rt as r } from "./MultiDashboard-Byp4f_rB.js";
import { i, o as a, r as o } from "./format-V6rpoQ-_.js";
import { r as s } from "./textNormalize-Ba1I6dwH.js";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/widgets/RecordFields.tsx
function u(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = e;
		return String(t.id ?? t.value ?? t.label ?? t.name ?? "");
	}
	return e == null ? "" : String(e);
}
function d(e, t) {
	return e.choices.find((e) => e.value === u(t));
}
function f(e) {
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
function p({ field: e, value: r }) {
	let i = d(e, r), a = i?.label ?? n(r);
	return /* @__PURE__ */ c(t, {
		value: a,
		kind: "enum",
		tones: { [a]: f(i?.color) },
		context: "grid"
	});
}
function m(e, t) {
	if (e.type === "currency" || e.format?.startsWith("currency")) {
		let n = e.format?.startsWith("currency:") ? e.format.slice(9) : "USD";
		return i(t, n);
	}
	return e.type === "percent" || e.format === "percent" ? a(t) : e.format === "compact" ? o(t) : t.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function h({ field: r, value: i }) {
	if (i == null || i === "") return /* @__PURE__ */ c("span", {
		className: "mtc-value-empty",
		children: "—"
	});
	if (r.type === "boolean") return /* @__PURE__ */ c(t, {
		value: i === !0 || i === "true",
		kind: "boolean",
		context: "grid"
	});
	if (r.type === "single_select" || r.type === "user" && r.choices.length > 0 || r.type === "link" && d(r, i)) return /* @__PURE__ */ c(p, {
		field: r,
		value: i
	});
	if (Array.isArray(i)) return i.length === 0 ? /* @__PURE__ */ c("span", {
		className: "mtc-value-empty",
		children: "—"
	}) : /* @__PURE__ */ l("span", {
		className: "flex items-center gap-1 flex-wrap",
		children: [i.slice(0, 4).map((e, t) => /* @__PURE__ */ c(p, {
			field: r,
			value: e
		}, `${n(e)}:${t}`)), i.length > 4 && /* @__PURE__ */ l("span", {
			className: "mtc-value-secondary",
			children: ["+", i.length - 4]
		})]
	});
	if (typeof i == "number") return /* @__PURE__ */ c("span", {
		className: "tabular-nums",
		children: m(r, i)
	});
	if (r.type === "date" || r.type === "datetime" || r.type === "created_at" || r.type === "updated_at") return /* @__PURE__ */ c(t, {
		value: i,
		kind: r.type === "date" ? "date" : "datetime",
		context: "grid"
	});
	if (r.type === "url") {
		let t = s(i);
		if (t) return /* @__PURE__ */ l("a", {
			href: t,
			...t.startsWith("/") ? {} : {
				target: "_blank",
				rel: "noopener noreferrer"
			},
			className: "mtc-value-link",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ c("span", {
				className: "mtc-value-link-text",
				children: t
			}), !t.startsWith("/") && /* @__PURE__ */ c(e, { name: "external-link" })]
		});
	}
	return /* @__PURE__ */ c("span", { children: n(i) });
}
var g = "mtc-control w-full px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500";
function _(e) {
	return e && typeof e == "object" ? u(e) : e == null ? "" : String(e);
}
function v(e) {
	if (typeof e != "string") return "";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e.slice(0, 16) : (/* @__PURE__ */ new Date(t.getTime() - t.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}
function y(e, t, n) {
	e.key === "Escape" ? (e.preventDefault(), n?.()) : e.key === "Enter" && !e.shiftKey && e.currentTarget.tagName !== "TEXTAREA" && (e.preventDefault(), t?.());
}
function b({ field: e, value: t, onChange: n, disabled: i, compact: a, autoFocus: o, onCommit: s, onCancel: d }) {
	if (i || !r(e)) return /* @__PURE__ */ c("div", {
		className: "min-h-7 px-2 py-1.5 border border-zinc-800 rounded bg-zinc-950/30 text-xs text-zinc-400",
		children: /* @__PURE__ */ c(h, {
			field: e,
			value: t
		})
	});
	if (e.type === "boolean") return /* @__PURE__ */ l("label", {
		className: "flex items-center gap-2 min-h-7 text-xs text-zinc-300",
		children: [/* @__PURE__ */ c("input", {
			type: "checkbox",
			checked: t === !0,
			onChange: (e) => n(e.target.checked),
			disabled: i,
			autoFocus: o,
			onKeyDown: (e) => y(e, s, d),
			className: "w-4 h-4"
		}), t === !0 ? "Yes" : "No"]
	});
	if (e.type === "single_select" || (e.type === "user" || e.type === "link") && e.choices.length > 0 && !e.allowMultiple) return /* @__PURE__ */ l("select", {
		value: u(t),
		onChange: (e) => n(e.target.value || null),
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => y(e, s, d),
		className: g,
		children: [/* @__PURE__ */ c("option", {
			value: "",
			children: "Select…"
		}), e.choices.map((e) => /* @__PURE__ */ c("option", {
			value: e.value,
			children: e.label
		}, e.value))]
	});
	if (e.type === "multi_select" || (e.type === "user" || e.type === "link") && e.choices.length > 0 && e.allowMultiple) {
		let r = Array.isArray(t) ? t.map(u) : [];
		return /* @__PURE__ */ c("select", {
			multiple: !0,
			value: r,
			onChange: (e) => n([...e.target.selectedOptions].map((e) => e.value)),
			disabled: i,
			autoFocus: o,
			onKeyDown: (e) => y(e, s, d),
			className: `${g} ${a ? "min-h-16" : "min-h-24"}`,
			children: e.choices.map((e) => /* @__PURE__ */ c("option", {
				value: e.value,
				children: e.label
			}, e.value))
		});
	}
	if (e.type === "long_text") return /* @__PURE__ */ c("textarea", {
		value: _(t),
		onChange: (e) => n(e.target.value),
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => y(e, s, d),
		rows: a ? 2 : 4,
		className: `${g} resize-y`
	});
	let f = e.type === "number" || e.type === "currency" || e.type === "percent", p = f ? "number" : e.type === "date" ? "date" : e.type === "datetime" ? "datetime-local" : e.type === "email" ? "email" : e.type === "phone" ? "tel" : e.type === "url" ? "url" : "text", m = e.type === "datetime" ? v(t) : _(t);
	return /* @__PURE__ */ c("input", {
		type: p,
		value: m,
		onChange: (t) => {
			if (f) {
				let e = Number(t.target.value);
				n(t.target.value === "" || !Number.isFinite(e) ? null : e);
			} else e.type === "datetime" ? n(t.target.value ? new Date(t.target.value).toISOString() : null) : n(t.target.value);
		},
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => y(e, s, d),
		className: g
	});
}
//#endregion
export { h as n, b as t };
