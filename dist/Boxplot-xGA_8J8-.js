import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { r as n } from "./format-V6rpoQ-_.js";
import { t as r } from "./colors-DjPEDFCT.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/widgets/Boxplot.tsx
var s = /* @__PURE__ */ e({ Boxplot: () => l }), c = {
	top: 12,
	right: 12,
	bottom: 28,
	left: 44
};
function l({ data: e }) {
	let n = i(() => d(e), [e]);
	if (!n || n.length === 0) return /* @__PURE__ */ a(t, { children: "No data" });
	let r = n.flatMap((e) => [
		e.min,
		e.max,
		...e.outliers
	]), o = Math.min(...r), s = Math.max(...r), c = (s - o) * .05 || 1, l = o - c, f = s + c;
	return /* @__PURE__ */ a("svg", {
		viewBox: "0 0 600 320",
		className: "w-full h-full",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ a(u, {
			boxes: n,
			yMin: l,
			yMax: f,
			ticks: Array.from({ length: 5 }, (e, t) => l + (f - l) * t / 4),
			width: 600,
			height: 320
		})
	});
}
function u({ boxes: e, yMin: t, yMax: i, ticks: s, width: l, height: u }) {
	let d = l - c.left - c.right, f = u - c.top - c.bottom, p = d / e.length, m = Math.min(p * .5, 60), h = (e) => c.top + (1 - (e - t) / (i - t)) * f;
	return /* @__PURE__ */ o("g", { children: [s.map((e, t) => {
		let r = h(e);
		return /* @__PURE__ */ o("g", { children: [/* @__PURE__ */ a("line", {
			x1: c.left,
			x2: c.left + d,
			y1: r,
			y2: r,
			stroke: "var(--mtc-grid)",
			strokeDasharray: "3 3"
		}), /* @__PURE__ */ a("text", {
			x: c.left - 6,
			y: r + 3,
			textAnchor: "end",
			fontSize: 10,
			fill: "var(--mtc-muted)",
			fontFamily: "var(--mtc-font-sans)",
			children: n(e)
		})] }, `g-${t}`);
	}), e.map((e, t) => {
		let n = c.left + p * t + p / 2, i = n - m / 2, s = r[t % r.length], l = h(e.min), d = h(e.max), f = h(e.q1), g = h(e.q3), _ = h(e.median);
		return /* @__PURE__ */ o("g", { children: [
			/* @__PURE__ */ a("line", {
				x1: n,
				x2: n,
				y1: l,
				y2: d,
				stroke: s,
				strokeOpacity: .6
			}),
			/* @__PURE__ */ a("line", {
				x1: n - m / 4,
				x2: n + m / 4,
				y1: l,
				y2: l,
				stroke: s,
				strokeOpacity: .8
			}),
			/* @__PURE__ */ a("line", {
				x1: n - m / 4,
				x2: n + m / 4,
				y1: d,
				y2: d,
				stroke: s,
				strokeOpacity: .8
			}),
			/* @__PURE__ */ a("rect", {
				x: i,
				y: g,
				width: m,
				height: Math.max(1, f - g),
				fill: s,
				fillOpacity: .25,
				stroke: s,
				strokeWidth: 1.5
			}),
			/* @__PURE__ */ a("line", {
				x1: i,
				x2: i + m,
				y1: _,
				y2: _,
				stroke: s,
				strokeWidth: 2
			}),
			e.outliers.map((e, t) => /* @__PURE__ */ a("circle", {
				cx: n,
				cy: h(e),
				r: 2.5,
				fill: s,
				fillOpacity: .7
			}, t)),
			/* @__PURE__ */ a("text", {
				x: n,
				y: u - 8,
				textAnchor: "middle",
				fontSize: 11,
				fill: "var(--mtc-muted)",
				fontFamily: "var(--mtc-font-sans)",
				children: e.label
			})
		] }, t);
	})] });
}
function d(e) {
	if (!Array.isArray(e) || e.length === 0) return null;
	let t = e.map((e) => {
		if (!e || typeof e != "object") return null;
		let t = e, n = String(t.label ?? "");
		if (typeof t.median == "number") return {
			label: n,
			min: Number(t.min ?? t.median),
			q1: Number(t.q1 ?? t.median),
			median: Number(t.median),
			q3: Number(t.q3 ?? t.median),
			max: Number(t.max ?? t.median),
			outliers: Array.isArray(t.outliers) ? t.outliers.filter((e) => typeof e == "number") : []
		};
		if (Array.isArray(t.values)) {
			let e = t.values.filter((e) => typeof e == "number" && Number.isFinite(e));
			return e.length === 0 ? null : f(n, e);
		}
		return null;
	}).filter((e) => e != null);
	return t.length > 0 ? t : null;
}
function f(e, t) {
	let n = [...t].sort((e, t) => e - t), r = (e) => {
		let t = (n.length - 1) * e, r = Math.floor(t), i = Math.ceil(t);
		return r === i ? n[r] : n[r] + (n[i] - n[r]) * (t - r);
	}, i = r(.25), a = r(.5), o = r(.75), s = o - i, c = i - 1.5 * s, l = o + 1.5 * s, u = [], d = Infinity, f = -Infinity;
	for (let e of n) e < c || e > l ? u.push(e) : (e < d && (d = e), e > f && (f = e));
	return Number.isFinite(d) || (d = n[0]), Number.isFinite(f) || (f = n[n.length - 1]), {
		label: e,
		min: d,
		q1: i,
		median: a,
		q3: o,
		max: f,
		outliers: u
	};
}
//#endregion
export { s as n, l as t };
