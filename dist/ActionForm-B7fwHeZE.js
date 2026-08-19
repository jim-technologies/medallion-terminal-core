import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, Dt as n, It as r } from "./MultiDashboard-CwQKjnza.js";
import { t as i } from "./useWatchAction-BphC_EHJ.js";
import { t as a } from "./useSubmitAction-N_8gfZqY.js";
import { useEffect as o, useMemo as s, useRef as c, useState as l } from "react";
import { jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/widgets/actionFormShape.ts
var f = /* @__PURE__ */ new Set([
	"text",
	"long_text",
	"number",
	"currency",
	"percent",
	"boolean",
	"select",
	"multi_select",
	"date",
	"datetime",
	"email",
	"url",
	"password"
]);
function p(e, t) {
	let n = C(e), r = t ?? {}, i = T(r.fields) ?? T(n.fields);
	if (!i) return null;
	let a = i.map(_).filter((e) => e !== null);
	if (a.length === 0) return null;
	let o = E(r.action_id) ?? E(n.action_id) ?? "", s = E(r.tone) ?? E(n.tone), c = D(r.columns) ?? D(n.columns);
	return {
		actionId: o,
		submitLabel: E(r.submit_label) ?? E(n.submit_label) ?? "Submit",
		successMessage: E(r.success_message) ?? E(n.success_message),
		description: E(r.description) ?? E(n.description),
		confirm: O(r.confirm) ?? O(n.confirm) ?? !1,
		tone: s === "danger" || s === "neutral" ? s : "primary",
		columns: c === 2 ? 2 : 1,
		fields: a,
		params: {
			...w(n.params),
			...w(r.params)
		},
		values: {
			...w(n.values),
			...w(r.values)
		}
	};
}
function m(e, t) {
	let n = {};
	for (let r of e.fields) {
		let i = e.values[r.key], a = r.contextKey ? t[r.contextKey] : void 0;
		n[r.key] = i === void 0 ? a === void 0 ? r.defaultValue === void 0 ? r.type === "boolean" ? !1 : r.type === "multi_select" ? [] : "" : r.defaultValue : y(r, a) : i;
	}
	return n;
}
function h(e, t) {
	let n = {};
	for (let r of e) {
		let e = t[r.key];
		if (r.required && x(e)) {
			n[r.key] = "Required";
			continue;
		}
		if (!x(e)) {
			if (b(r.type)) {
				let t = typeof e == "number" ? e : Number(e);
				Number.isFinite(t) ? r.min !== void 0 && t < r.min ? n[r.key] = `Minimum ${r.min}` : r.max !== void 0 && t > r.max && (n[r.key] = `Maximum ${r.max}`) : n[r.key] = "Enter a number";
			}
			r.type === "url" && typeof e == "string" && !S(e) && (n[r.key] = "Enter an http(s) or relative URL");
		}
	}
	return n;
}
function g(e, t) {
	return {
		...e.params,
		...Object.fromEntries(e.fields.filter((e) => !e.readOnly || t[e.key] !== void 0).map((e) => [e.key, t[e.key]]))
	};
}
function _(e) {
	let t = C(e), n = E(t.key);
	if (!n) return null;
	let r = E(t.type), i = r && f.has(r) ? r : "text";
	return {
		key: n,
		label: E(t.label) ?? k(n),
		type: i,
		description: E(t.description),
		placeholder: E(t.placeholder),
		required: O(t.required) ?? !1,
		readOnly: O(t.read_only) ?? !1,
		choices: v(t.choices),
		...t.default_value !== void 0 && { defaultValue: t.default_value },
		contextKey: E(t.context_key),
		min: D(t.min),
		max: D(t.max),
		step: D(t.step)
	};
}
function v(e) {
	return Array.isArray(e) ? e.flatMap((e) => {
		if (typeof e == "string" || typeof e == "number") {
			let t = String(e);
			return [{
				value: t,
				label: t
			}];
		}
		let t = C(e), n = E(t.value);
		return n ? [{
			value: n,
			label: E(t.label) ?? n
		}] : [];
	}) : [];
}
function y(e, t) {
	if (b(e.type)) {
		let e = Number(t);
		return Number.isFinite(e) ? e : t;
	}
	return e.type === "boolean" ? t === "true" : e.type === "multi_select" ? t.split(",").map((e) => e.trim()).filter(Boolean) : t;
}
function b(e) {
	return e === "number" || e === "currency" || e === "percent";
}
function x(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function S(e) {
	let t = e.trim();
	if (t.startsWith("/") || t.startsWith("./") || t.startsWith("../")) return !0;
	try {
		let e = new URL(t);
		return e.protocol === "http:" || e.protocol === "https:";
	} catch {
		return !1;
	}
}
function C(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function w(e) {
	return C(e);
}
function T(e) {
	return Array.isArray(e) ? e : null;
}
function E(e) {
	return typeof e == "string" && e !== "" ? e : void 0;
}
function D(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
function O(e) {
	return typeof e == "boolean" ? e : void 0;
}
function k(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
//#region src/widgets/ActionForm.tsx
var A = /* @__PURE__ */ e({ ActionForm: () => j });
function j({ data: e, options: f, widgetId: _ }) {
	let { backendUrl: v, ctx: y, emit: b, requestRefresh: x, toast: S } = t(), C = s(() => p(e, f), [e, f]), w = f ?? {}, { submit: T, submitting: E, result: D } = a(_), O = s(() => C ? m(C, y) : {}, [C, C ? JSON.stringify(C.fields.map((e) => e.contextKey ? [e.contextKey, y[e.contextKey]] : null)) : ""]), [k, A] = l(O), [j, P] = l({}), [F, I] = l(!1), [L, R] = l(!1), z = c(!1), [B, V] = l(null), [H, U] = l(null);
	if (o(() => {
		A(O), P({}), I(!1), V(null), U(null);
	}, [O]), !C) return /* @__PURE__ */ u(r, { children: "Action form requires fields" });
	let W = v === void 0 ? w.url ? "url" : null : "connect";
	if (!W) return /* @__PURE__ */ u(r, { children: "Action form requires backendUrl or options.url" });
	if (!C.actionId) return /* @__PURE__ */ u(r, { children: "Action form requires action_id" });
	let G = W === "connect" ? E : L, K = (e, t) => {
		A((n) => ({
			...n,
			[e]: t
		})), P((t) => {
			if (!(e in t)) return t;
			let n = { ...t };
			return delete n[e], n;
		}), I(!1), V(null), U(null);
	}, q = () => {
		A(O), P({}), I(!1);
	}, J = () => {
		w.reset_on_success !== !1 && q();
	}, Y = async () => {
		if (G || z.current) return;
		let e = h(C.fields, k);
		if (Object.keys(e).length > 0) {
			P(e);
			return;
		}
		if (C.confirm && !F) {
			I(!0);
			return;
		}
		let t = g(C, k);
		if (I(!1), V(null), U(null), W === "connect") {
			await T({
				actionId: C.actionId,
				params: t,
				successMessage: C.successMessage,
				refresh: w.refresh !== !1,
				refreshTarget: w.refresh_target,
				onComplete: (e) => {
					i(e.status) || J();
				}
			});
			return;
		}
		z.current = !0, R(!0);
		let r = n();
		try {
			let e = await fetch(w.url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": r
				},
				body: JSON.stringify(t)
			});
			if (!e.ok) throw Error(`HTTP ${e.status}`);
			let n = await e.json().catch(() => ({})), a = n.status ?? "ACTION_STATUS_OK", o = i(a), s = n.message ?? (o ? `${C.actionId} failed` : C.successMessage ?? `${C.actionId} completed`);
			b({
				type: "action",
				actionId: C.actionId,
				clientRequestId: r,
				status: a,
				message: s,
				terminal: !0
			}), o ? (U(s), S(s, "error")) : (V(s), S(s, "ok"), w.refresh !== !1 && x(w.refresh_target ?? _ ?? "*"), J());
		} catch (e) {
			let t = e instanceof Error ? e.message : "Action failed";
			U(t), S(t, "error"), b({
				type: "action",
				actionId: C.actionId,
				clientRequestId: r,
				status: "ACTION_STATUS_FAILED",
				message: t,
				terminal: !0
			});
		} finally {
			z.current = !1, R(!1);
		}
	}, X = D?.message ?? D?.status, Z = D && i(D.status) ? X : null, Q = D && !i(D.status) ? X : null;
	return /* @__PURE__ */ d("form", {
		className: "h-full min-h-0 flex flex-col gap-3",
		onSubmit: (e) => {
			e.preventDefault(), Y();
		},
		children: [
			C.description && /* @__PURE__ */ u("p", {
				className: "text-xs leading-relaxed text-zinc-400",
				children: C.description
			}),
			/* @__PURE__ */ u("div", {
				className: `grid gap-3 overflow-auto pr-1 ${C.columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`,
				children: C.fields.map((e) => /* @__PURE__ */ u(M, {
					field: e,
					value: k[e.key],
					error: j[e.key],
					disabled: G || F,
					onChange: (t) => K(e.key, t)
				}, e.key))
			}),
			F && /* @__PURE__ */ d("div", {
				className: "mtc-callout border border-amber-500/30 bg-amber-500/5 rounded px-3 py-2",
				children: [/* @__PURE__ */ u("div", {
					className: "text-[10px] uppercase tracking-wider text-amber-300",
					children: "Confirm action"
				}), /* @__PURE__ */ d("div", {
					className: "mt-1 text-xs text-zinc-300",
					children: [
						"Submit ",
						/* @__PURE__ */ u("span", {
							className: "font-mono text-zinc-100",
							children: C.actionId
						}),
						" with the values above?"
					]
				})]
			}),
			/* @__PURE__ */ d("div", {
				className: "mt-auto flex items-center gap-2 shrink-0",
				children: [F && /* @__PURE__ */ u("button", {
					type: "button",
					onClick: () => I(!1),
					disabled: G,
					className: "mtc-control px-3 py-2 text-xs text-zinc-300",
					children: "Back"
				}), /* @__PURE__ */ u("button", {
					type: "submit",
					disabled: G,
					className: `flex-1 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-40 ${N(C.tone)}`,
					children: G ? "Working…" : F ? `Confirm ${C.submitLabel}` : C.submitLabel
				})]
			}),
			(W === "connect" ? Q : B) && /* @__PURE__ */ u("div", {
				className: "text-xs text-emerald-400",
				children: W === "connect" ? Q : B
			}),
			(W === "connect" ? Z : H) && /* @__PURE__ */ u("div", {
				className: "text-xs text-red-400",
				children: W === "connect" ? Z : H
			})
		]
	});
}
function M({ field: e, value: t, error: n, disabled: r, onChange: i }) {
	let a = /* @__PURE__ */ d("div", {
		className: "flex items-center justify-between gap-2",
		children: [/* @__PURE__ */ d("span", {
			className: "text-[10px] uppercase tracking-wider text-zinc-400",
			children: [e.label, e.required && /* @__PURE__ */ u("span", {
				className: "ml-1 text-red-400",
				children: "*"
			})]
		}), n && /* @__PURE__ */ u("span", {
			className: "text-[10px] text-red-400",
			children: n
		})]
	});
	if (e.type === "boolean") return /* @__PURE__ */ d("label", {
		className: "flex flex-col gap-1",
		children: [
			a,
			/* @__PURE__ */ d("span", {
				className: "mtc-control min-h-9 flex items-center gap-2 px-2 text-xs text-zinc-300",
				children: [/* @__PURE__ */ u("input", {
					type: "checkbox",
					checked: t === !0,
					onChange: (e) => i(e.target.checked),
					disabled: r || e.readOnly,
					className: "w-4 h-4"
				}), t === !0 ? "Yes" : "No"]
			}),
			e.description && /* @__PURE__ */ u("span", {
				className: "text-[10px] text-zinc-600",
				children: e.description
			})
		]
	});
	if (e.type === "select" || e.type === "multi_select") {
		let n = e.type === "multi_select" ? Array.isArray(t) ? t.map(String) : [] : t == null ? "" : String(t);
		return /* @__PURE__ */ d("label", {
			className: "flex flex-col gap-1",
			children: [
				a,
				/* @__PURE__ */ d("select", {
					multiple: e.type === "multi_select",
					value: n,
					onChange: (t) => i(e.type === "multi_select" ? [...t.target.selectedOptions].map((e) => e.value) : t.target.value),
					disabled: r || e.readOnly,
					className: `mtc-control px-2 py-2 text-xs text-zinc-100 outline-none ${e.type === "multi_select" ? "min-h-20" : "min-h-9"}`,
					children: [e.type === "select" && /* @__PURE__ */ u("option", {
						value: "",
						children: "Select…"
					}), e.choices.map((e) => /* @__PURE__ */ u("option", {
						value: e.value,
						children: e.label
					}, e.value))]
				}),
				e.description && /* @__PURE__ */ u("span", {
					className: "text-[10px] text-zinc-600",
					children: e.description
				})
			]
		});
	}
	let o = e.type === "number" || e.type === "currency" || e.type === "percent", s = o ? "number" : e.type === "date" ? "date" : e.type === "datetime" ? "datetime-local" : e.type === "email" ? "email" : e.type === "url" ? "url" : e.type === "password" ? "password" : "text", c = t == null ? "" : String(t), l = `mtc-control w-full min-h-9 px-2 py-2 text-xs text-zinc-100 outline-none ${n ? "border-red-500/60" : ""}`;
	return /* @__PURE__ */ d("label", {
		className: "flex flex-col gap-1",
		children: [
			a,
			e.type === "long_text" ? /* @__PURE__ */ u("textarea", {
				value: c,
				placeholder: e.placeholder,
				onChange: (e) => i(e.target.value),
				disabled: r || e.readOnly,
				rows: 3,
				className: `${l} resize-y`
			}) : /* @__PURE__ */ u("input", {
				type: s,
				value: c,
				placeholder: e.placeholder,
				min: e.min,
				max: e.max,
				step: e.step ?? (o ? "any" : void 0),
				onChange: (e) => {
					if (!o) {
						i(e.target.value);
						return;
					}
					let t = Number(e.target.value);
					i(e.target.value === "" || !Number.isFinite(t) ? "" : t);
				},
				disabled: r || e.readOnly,
				className: l
			}),
			e.description && /* @__PURE__ */ u("span", {
				className: "text-[10px] text-zinc-600",
				children: e.description
			})
		]
	});
}
function N(e) {
	return e === "danger" ? "bg-red-500/85 hover:bg-red-500 text-zinc-950" : e === "neutral" ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-100" : "bg-sky-500/85 hover:bg-sky-500 text-zinc-950";
}
//#endregion
export { p as a, m as i, A as n, h as o, g as r, j as t };
