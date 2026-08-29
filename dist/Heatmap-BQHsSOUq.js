import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-B8rxYV_S.js";
import { r } from "./format-V6rpoQ-_.js";
import { useMemo as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/widgets/Heatmap.tsx
var s = /* @__PURE__ */ e({ Heatmap: () => u }), c = 96, l = 22;
function u({ data: e, options: r }) {
	let { setCtx: s } = t(), u = i(() => f(e), [e]);
	if (!u) return /* @__PURE__ */ a(n, { children: "No data" });
	let h = r?.row_context, g = r?.col_context, _ = !!(h || g), v = (e, t) => {
		h && s(h.key, u.rows[e]), g && s(g.key, u.columns[t]);
	}, { rows: y, columns: b, cells: x, min: S, max: C, scale: w } = u, T = x.length <= 60, E = i(() => {
		let e = y.map(() => Array(b.length).fill(void 0));
		for (let t of x) e[t.row][t.col] = t;
		return e;
	}, [
		y,
		b,
		x
	]);
	return /* @__PURE__ */ o("div", {
		className: "h-full w-full overflow-auto flex flex-col",
		children: [/* @__PURE__ */ o("div", {
			className: "inline-grid min-w-full",
			style: {
				gridTemplateColumns: `${c}px repeat(${b.length}, minmax(28px, 1fr))`,
				gap: 2
			},
			children: [
				/* @__PURE__ */ a("div", { className: "sticky left-0 top-0 z-20 bg-zinc-900" }),
				b.map((e) => /* @__PURE__ */ a("div", {
					className: "text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900",
					style: { height: l },
					children: e
				}, `c-${e}`)),
				y.flatMap((e, t) => [/* @__PURE__ */ a("div", {
					className: "text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900",
					style: { minHeight: 30 },
					children: e
				}, `rl-${t}`), ...b.map((n, r) => {
					let i = E[t][r];
					if (!i) return /* @__PURE__ */ a("div", { className: "bg-zinc-900 rounded-sm" }, `e-${t}-${r}`);
					let o = p(i.value, S, C, w);
					return /* @__PURE__ */ a("div", {
						onClick: _ ? () => v(t, r) : void 0,
						className: `rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${_ ? "cursor-pointer hover:ring-1 hover:ring-zinc-400" : ""}`,
						style: {
							backgroundColor: o,
							minHeight: 30
						},
						title: `${e} × ${b[r]}: ${i.label ?? i.value.toFixed(2)}`,
						children: T && /* @__PURE__ */ a("span", {
							className: "text-white/90",
							children: i.label ?? m(i.value)
						})
					}, `cell-${t}-${r}`);
				})])
			]
		}), /* @__PURE__ */ a(d, {
			min: S,
			max: C,
			scale: w
		})]
	});
}
function d({ min: e, max: t, scale: n }) {
	let i = n === "diverging" ? [
		-1,
		-.5,
		0,
		.5,
		1
	] : [
		0,
		.25,
		.5,
		.75,
		1
	], s = t - e;
	return /* @__PURE__ */ o("div", {
		className: "flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ a("span", {
				className: "tabular-nums",
				children: r(e)
			}),
			/* @__PURE__ */ a("div", {
				className: "flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden",
				children: i.map((r, i) => {
					let o = n === "diverging" ? r * Math.max(Math.abs(e), Math.abs(t)) : e + r * s;
					return /* @__PURE__ */ a("div", {
						className: "flex-1",
						style: { backgroundColor: p(o, e, t, n) }
					}, i);
				})
			}),
			/* @__PURE__ */ a("span", {
				className: "tabular-nums",
				children: r(t)
			})
		]
	});
}
function f(e) {
	if (typeof e != "object" || !e) return null;
	let t = e, n = Array.isArray(t.rows) ? t.rows.map(String) : null, r = Array.isArray(t.columns) ? t.columns.map(String) : null, i = Array.isArray(t.cells) ? t.cells : null;
	if (!n || !r || !i) return null;
	let a = i.map((e) => {
		let t = e;
		return {
			row: Number(t.row ?? 0),
			col: Number(t.col ?? 0),
			value: Number(t.value ?? 0),
			label: t.label == null ? void 0 : String(t.label)
		};
	}).filter((e) => e.row >= 0 && e.row < n.length && e.col >= 0 && e.col < r.length);
	if (a.length === 0) return null;
	let o = a.map((e) => e.value);
	return {
		rows: n,
		columns: r,
		cells: a,
		min: typeof t.min == "number" ? t.min : Math.min(...o),
		max: typeof t.max == "number" ? t.max : Math.max(...o),
		scale: t.scale === "diverging" ? "diverging" : "sequential"
	};
}
function p(e, t, n, r) {
	if (n === t) return "var(--mtc-panel)";
	if (r === "diverging") {
		let r = Math.max(-1, Math.min(1, e / (Math.max(Math.abs(t), Math.abs(n)) || 1)));
		return r >= 0 ? `color-mix(in oklab, var(--mtc-ok) ${85 * r}%, var(--mtc-panel))` : `color-mix(in oklab, var(--mtc-danger) ${85 * -r}%, var(--mtc-panel))`;
	}
	return `color-mix(in oklab, var(--mtc-accent) ${15 + 75 * Math.max(0, Math.min(1, (e - t) / (n - t)))}%, var(--mtc-panel))`;
}
function m(e) {
	return Math.abs(e) < 1 ? e.toFixed(2) : Math.abs(e) < 100 ? e.toFixed(1) : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : Math.round(e).toString();
}
//#endregion
export { s as n, u as t };
