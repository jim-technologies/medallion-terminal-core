import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { n, r, t as i } from "./colors-DjPEDFCT.js";
import { useMemo as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
import { ResponsiveContainer as c, Tooltip as l, Treemap as u } from "recharts";
//#region src/widgets/Treemap.tsx
var d = /* @__PURE__ */ e({ Treemap: () => f });
function f({ data: e }) {
	let n = a(() => h(e), [e]);
	return !n || n.length === 0 ? /* @__PURE__ */ o(t, { children: "No data" }) : /* @__PURE__ */ o(c, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ o(u, {
			data: n,
			dataKey: "value",
			nameKey: "name",
			stroke: "var(--mtc-surface)",
			isAnimationActive: !1,
			content: /* @__PURE__ */ o(p, {}),
			children: /* @__PURE__ */ o(l, {
				contentStyle: r,
				formatter: (e) => [String(e), ""]
			})
		})
	});
}
function p(e) {
	let { x: t = 0, y: n = 0, width: r = 0, height: i = 0, index: a = 0, name: c, payload: l } = e;
	return /* @__PURE__ */ s("g", { children: [/* @__PURE__ */ o("rect", {
		x: t,
		y: n,
		width: r,
		height: i,
		fill: m(l, a),
		fillOpacity: .85,
		stroke: "var(--mtc-surface)",
		strokeWidth: 2
	}), r > 60 && i > 24 && c && /* @__PURE__ */ o("text", {
		x: t + 6,
		y: n + 16,
		fill: "var(--mtc-fg)",
		fontSize: 11,
		style: { pointerEvents: "none" },
		children: c
	})] });
}
function m(e, t) {
	return e ? e.color && n[e.color] ? n[e.color] : e.color && e.color.startsWith("#") ? e.color : i[t % i.length] : i[t % i.length];
}
function h(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.slices) ? t = n.slices : Array.isArray(n.nodes) && (t = n.nodes);
	}
	if (!t) return null;
	let n = (e) => {
		if (!e || typeof e != "object") return null;
		let t = e, r = String(t.label ?? t.name ?? ""), i = typeof t.value == "number" ? t.value : void 0, a = t.color == null ? void 0 : String(t.color), o = Array.isArray(t.children) ? t.children : Array.isArray(t.slices) ? t.slices : null, s = o ? o.map(n).filter((e) => e != null) : void 0;
		return !s && (!Number.isFinite(i) || (i ?? 0) <= 0) ? null : {
			name: r,
			value: i,
			color: a,
			children: s
		};
	}, r = t.map(n).filter((e) => e != null);
	return r.length > 0 ? r : null;
}
//#endregion
export { d as n, f as t };
