import { it as e, ut as t } from "./MultiDashboard-CwQKjnza.js";
import { i as n, o as r, r as i } from "./format-V6rpoQ-_.js";
import { r as a, t as o } from "./textNormalize-Ba1I6dwH.js";
import { jsx as s, jsxs as c } from "react/jsx-runtime";
//#region src/widgets/RecordFields.tsx
function l(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = e;
		return String(t.id ?? t.value ?? t.label ?? t.name ?? "");
	}
	return e == null ? "" : String(e);
}
function u(e, t) {
	return e.choices.find((e) => e.value === l(t));
}
function d(e) {
	switch (e?.toLowerCase()) {
		case "info":
		case "blue":
		case "cyan":
		case "purple": return "bg-sky-500/15 text-sky-300 border-sky-500/30";
		case "ok":
		case "green":
		case "emerald": return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
		case "warn":
		case "amber":
		case "yellow":
		case "orange": return "bg-amber-500/15 text-amber-300 border-amber-500/30";
		case "danger":
		case "red": return "bg-red-500/15 text-red-300 border-red-500/30";
		default: return "bg-zinc-800 text-zinc-300 border-zinc-700";
	}
}
function f({ field: e, value: n }) {
	let r = u(e, n);
	return /* @__PURE__ */ s("span", {
		className: `inline-flex max-w-full items-center border rounded px-1.5 py-0.5 text-[10px] ${d(r?.color)}`,
		children: /* @__PURE__ */ s("span", {
			className: "truncate",
			children: r?.label ?? t(n)
		})
	});
}
function p(e, t) {
	return e.type === "currency" || e.format?.startsWith("currency") ? n(t, e.format?.startsWith("currency:") ? e.format.slice(9) : "USD") : e.type === "percent" || e.format === "percent" ? r(t) : e.format === "compact" ? i(t) : t.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function m({ field: e, value: n }) {
	if (n == null || n === "") return /* @__PURE__ */ s("span", {
		className: "text-zinc-700",
		children: "—"
	});
	if (e.type === "boolean") return /* @__PURE__ */ s("span", {
		className: n ? "text-emerald-400" : "text-zinc-600",
		children: n ? "✓" : "—"
	});
	if (e.type === "single_select" || e.type === "user" && e.choices.length > 0 || e.type === "link" && u(e, n)) return /* @__PURE__ */ s(f, {
		field: e,
		value: n
	});
	if (Array.isArray(n)) return n.length === 0 ? /* @__PURE__ */ s("span", {
		className: "text-zinc-700",
		children: "—"
	}) : /* @__PURE__ */ c("span", {
		className: "flex items-center gap-1 flex-wrap",
		children: [n.slice(0, 4).map((n, r) => /* @__PURE__ */ s(f, {
			field: e,
			value: n
		}, `${t(n)}:${r}`)), n.length > 4 && /* @__PURE__ */ c("span", {
			className: "text-[10px] text-zinc-500",
			children: ["+", n.length - 4]
		})]
	});
	if (typeof n == "number") return /* @__PURE__ */ s("span", {
		className: "tabular-nums",
		children: p(e, n)
	});
	if (e.type === "date" || e.type === "datetime" || e.type === "created_at" || e.type === "updated_at") return /* @__PURE__ */ s("span", {
		className: "tabular-nums",
		children: String(o(n))
	});
	if (e.type === "url") {
		let e = a(n);
		if (e) return /* @__PURE__ */ c("a", {
			href: e,
			...e.startsWith("/") ? {} : {
				target: "_blank",
				rel: "noopener noreferrer"
			},
			className: "text-sky-400 hover:underline",
			onClick: (e) => e.stopPropagation(),
			children: [
				e,
				" ",
				/* @__PURE__ */ s("span", {
					"aria-hidden": "true",
					children: "↗"
				})
			]
		});
	}
	return /* @__PURE__ */ s("span", { children: t(n) });
}
var h = "mtc-control w-full px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500";
function g(e) {
	return e && typeof e == "object" ? l(e) : e == null ? "" : String(e);
}
function _(e) {
	if (typeof e != "string") return "";
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e.slice(0, 16) : (/* @__PURE__ */ new Date(t.getTime() - t.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}
function v(e, t, n) {
	e.key === "Escape" ? (e.preventDefault(), n?.()) : e.key === "Enter" && !e.shiftKey && e.currentTarget.tagName !== "TEXTAREA" && (e.preventDefault(), t?.());
}
function y({ field: t, value: n, onChange: r, disabled: i, compact: a, autoFocus: o, onCommit: u, onCancel: d }) {
	if (i || !e(t)) return /* @__PURE__ */ s("div", {
		className: "min-h-7 px-2 py-1.5 border border-zinc-800 rounded bg-zinc-950/30 text-xs text-zinc-400",
		children: /* @__PURE__ */ s(m, {
			field: t,
			value: n
		})
	});
	if (t.type === "boolean") return /* @__PURE__ */ c("label", {
		className: "flex items-center gap-2 min-h-7 text-xs text-zinc-300",
		children: [/* @__PURE__ */ s("input", {
			type: "checkbox",
			checked: n === !0,
			onChange: (e) => r(e.target.checked),
			disabled: i,
			autoFocus: o,
			onKeyDown: (e) => v(e, u, d),
			className: "w-4 h-4"
		}), n === !0 ? "Yes" : "No"]
	});
	if (t.type === "single_select" || (t.type === "user" || t.type === "link") && t.choices.length > 0 && !t.allowMultiple) return /* @__PURE__ */ c("select", {
		value: l(n),
		onChange: (e) => r(e.target.value || null),
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => v(e, u, d),
		className: h,
		children: [/* @__PURE__ */ s("option", {
			value: "",
			children: "Select…"
		}), t.choices.map((e) => /* @__PURE__ */ s("option", {
			value: e.value,
			children: e.label
		}, e.value))]
	});
	if (t.type === "multi_select" || (t.type === "user" || t.type === "link") && t.choices.length > 0 && t.allowMultiple) return /* @__PURE__ */ s("select", {
		multiple: !0,
		value: Array.isArray(n) ? n.map(l) : [],
		onChange: (e) => r([...e.target.selectedOptions].map((e) => e.value)),
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => v(e, u, d),
		className: `${h} ${a ? "min-h-16" : "min-h-24"}`,
		children: t.choices.map((e) => /* @__PURE__ */ s("option", {
			value: e.value,
			children: e.label
		}, e.value))
	});
	if (t.type === "long_text") return /* @__PURE__ */ s("textarea", {
		value: g(n),
		onChange: (e) => r(e.target.value),
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => v(e, u, d),
		rows: a ? 2 : 4,
		className: `${h} resize-y`
	});
	let f = t.type === "number" || t.type === "currency" || t.type === "percent";
	return /* @__PURE__ */ s("input", {
		type: f ? "number" : t.type === "date" ? "date" : t.type === "datetime" ? "datetime-local" : t.type === "email" ? "email" : t.type === "phone" ? "tel" : t.type === "url" ? "url" : "text",
		value: t.type === "datetime" ? _(n) : g(n),
		onChange: (e) => {
			if (f) {
				let t = Number(e.target.value);
				r(e.target.value === "" || !Number.isFinite(t) ? null : t);
			} else t.type === "datetime" ? r(e.target.value ? new Date(e.target.value).toISOString() : null) : r(e.target.value);
		},
		disabled: i,
		autoFocus: o,
		onKeyDown: (e) => v(e, u, d),
		className: h
	});
}
//#endregion
export { m as n, y as t };
