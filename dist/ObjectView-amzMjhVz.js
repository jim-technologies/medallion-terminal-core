import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t } from "./States-BRpBuveA.js";
import { T as n, v as r } from "./sourceError-CTpw8oGk.js";
import { n as i, r as a, t as o } from "./LinkPanel-9rsuCQ-d.js";
import { Ft as s, ft as c, kt as l } from "./MultiDashboard-DqVJUr-r.js";
import { t as u } from "./textNormalize-Ba1I6dwH.js";
import { t as d } from "./useWatchAction-0LCFfVYs.js";
import { t as f } from "./useSubmitAction-SfLYRfms.js";
import { useMemo as p, useState as m } from "react";
import { jsx as h, jsxs as g } from "react/jsx-runtime";
//#region src/widgets/ObjectView.tsx
var _ = /* @__PURE__ */ e({ ObjectView: () => v });
function v({ data: e, options: _, widgetId: v }) {
	let C = p(() => c(e), [e]), w = _ ?? {}, { setCtx: T } = l(), E = f(v), [D, O] = m(null), [k, A] = m(null);
	if (!C) return /* @__PURE__ */ h(s, { children: "No object" });
	let j = w.link_context?.type_key ?? "object_type", M = w.link_context?.id_key ?? "object_id", N = (e) => {
		if (Object.keys(e.context).length > 0) for (let [t, n] of Object.entries(e.context)) T(t, n);
		else e.targetType && T(j, e.targetType), T(M, e.targetId);
	}, P = async (e) => {
		if (!(e.disabled || E.submitting || D)) {
			if (e.confirm && k !== e.id) {
				A(e.id);
				return;
			}
			O(e.id), A(null), await E.submit({
				actionId: e.id,
				params: {
					...e.params,
					object_type: C.objectType,
					object_id: C.objectId
				},
				successMessage: e.label,
				refreshTarget: v ?? "*",
				onComplete: () => O(null)
			}) || O(null);
		}
	}, F = b(C.links), I = /* @__PURE__ */ h(a, {
		compact: !0,
		headingLevel: 3,
		type: {
			id: C.objectType || "object",
			label: S(C.objectType)
		},
		title: C.title,
		objectId: C.objectId || void 0,
		status: C.status ? {
			label: S(C.status),
			tone: y(C.status)
		} : void 0
	}), L = [...C.tags.map((e) => /* @__PURE__ */ h(n, { children: e }, e)), C.updatedAt ? `Updated ${String(u(C.updatedAt))}` : null].filter(Boolean);
	return /* @__PURE__ */ g("div", {
		className: "mtc-object-view h-full overflow-auto",
		children: [
			I,
			C.description && /* @__PURE__ */ h("p", {
				className: "mtc-object-view-description",
				children: C.description
			}),
			L.length > 0 && /* @__PURE__ */ h(r, { items: L }),
			/* @__PURE__ */ h(i, {
				headingLevel: 4,
				filterable: C.properties.length > 8,
				properties: C.properties.map((e) => ({
					id: e.key,
					label: e.label,
					value: e.value,
					format: x(e.format),
					group: e.group ?? "General",
					description: e.description
				}))
			}),
			F.length > 0 && /* @__PURE__ */ h(o, {
				headingLevel: 4,
				title: "Relationships",
				groups: F,
				maxItems: 5,
				onNavigate: (e) => {
					let t = C.links.find((t) => `${t.relation}:${t.targetType}:${t.targetId}` === e.id);
					t && N(t);
				}
			}),
			w.enable_actions === !0 && C.actions.length > 0 && /* @__PURE__ */ g("section", {
				className: "grid gap-2",
				"aria-label": "Actions",
				children: [/* @__PURE__ */ g("div", {
					className: "flex flex-wrap gap-2",
					children: [C.actions.map((e) => {
						let n = k === e.id, r = D === e.id && E.submitting;
						return /* @__PURE__ */ h(t, {
							size: "small",
							intent: n || e.style === "danger" ? "danger" : e.style === "primary" ? "primary" : "neutral",
							variant: e.style === "primary" && !n ? "solid" : "outline",
							loading: r,
							onClick: () => void P(e),
							disabled: e.disabled || E.submitting || D != null,
							title: e.description,
							children: n ? `Confirm ${e.label}` : e.label
						}, e.id);
					}), k && /* @__PURE__ */ h(t, {
						size: "small",
						variant: "ghost",
						onClick: () => A(null),
						disabled: E.submitting,
						children: "Cancel"
					})]
				}), E.result && /* @__PURE__ */ h("p", {
					className: `text-xs ${d(E.result.status) ? "text-red-400" : "text-zinc-500"}`,
					role: "status",
					children: E.result.message ?? E.result.status
				})]
			})
		]
	});
}
function y(e) {
	let t = e.toLowerCase();
	return /(healthy|ready|active|ok|published|open)/.test(t) ? "ok" : /(warn|stale|draft|pending|review)/.test(t) ? "warning" : /(error|failed|deprecated|archived|blocked|closed)/.test(t) ? "danger" : "neutral";
}
function b(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = `${n.relation}:${n.targetType}`, r = t.get(e) ?? {
			id: e,
			relation: S(n.relation || "related"),
			targetType: {
				id: n.targetType || "object",
				label: S(n.targetType || "object")
			},
			count: 0,
			items: []
		};
		t.set(e, {
			...r,
			count: r.count + 1,
			items: [...r.items, {
				id: `${n.relation}:${n.targetType}:${n.targetId}`,
				title: n.label,
				type: r.targetType,
				detail: n.status ? S(n.status) : void 0
			}]
		});
	}
	return [...t.values()];
}
function x(e) {
	if (e) return e === "link" ? "url" : e === "compact" ? "number" : e;
}
function S(e) {
	let t = e.replace(/[_-]+/g, " ").trim();
	return t && t.charAt(0).toUpperCase() + t.slice(1);
}
//#endregion
export { _ as n, v as t };
