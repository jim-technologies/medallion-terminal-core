import { h as e } from "./States-Ds3cxTem.js";
import { t } from "./utils-j4lJ7S1v.js";
import { forwardRef as n } from "react";
import { jsx as r } from "react/jsx-runtime";
//#region src/components/TypeGlyph.tsx
var i = [
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
function a(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return t ^= t >>> 16, t = Math.imul(t, 2246822507), t ^= t >>> 13, t = Math.imul(t, 3266489909), t ^= t >>> 16, i[(t >>> 0) % i.length];
}
var o = {
	16: 11,
	20: 12,
	24: 14,
	40: 22
}, s = n(function({ icon: n = "object", color: i, size: a = 20, label: s, className: c, ...l }, u) {
	return /* @__PURE__ */ r("span", {
		...l,
		ref: u,
		className: t("mtc-type-glyph", c),
		"data-color": i,
		"data-size": a,
		role: s ? "img" : void 0,
		"aria-label": s,
		"aria-hidden": !s || void 0,
		children: /* @__PURE__ */ r(e, {
			name: n,
			size: o[a],
			strokeWidth: a <= 20 ? 2 : 1.75
		})
	});
});
//#endregion
//#region src/components/navigation.ts
function c(e) {
	return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}
function l(e) {
	if (e) return (t) => {
		c(t) && (t.preventDefault(), e(t));
	};
}
//#endregion
//#region src/objects/types.ts
function u(e) {
	return {
		icon: e.icon ?? "object",
		color: e.color ?? a(e.id ?? e.label)
	};
}
function d(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.id == "string" && typeof t.title == "string";
}
//#endregion
export { i as a, l as i, u as n, s as o, c as r, a as s, d as t };
