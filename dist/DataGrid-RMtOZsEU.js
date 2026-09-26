import { C as e, E as t, T as n, h as r, n as i, w as a } from "./States-Ds3cxTem.js";
import { t as o } from "./utils-j4lJ7S1v.js";
import { i as s } from "./types-Ds11x4VM.js";
import { b as c } from "./sourceError-CQ2WzTbt.js";
import { a as l, i as ee, n as u, o as d, r as te, t as ne } from "./PropertyValue-DJabXWny.js";
import { a as re, c as ie } from "./Overlays-_7OI9Emq.js";
import { useCallback as ae, useEffect as oe, useLayoutEffect as f, useMemo as p, useRef as m, useState as h } from "react";
import { jsx as g, jsxs as _ } from "react/jsx-runtime";
import { createPortal as se } from "react-dom";
//#region src/workbench/dataGridModel.ts
function v(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function ce(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = v(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : l(i, d(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return u(e.key, t.key) || e.index - t.index;
		let r = u(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function le(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function ue(e, t, n, r, i, a) {
	if (!a || r <= 0) return {
		start: 0,
		end: e
	};
	let o = Math.floor(Math.max(0, t) / r), s = Math.ceil(Math.max(n, r) / r) + 1;
	return {
		start: Math.max(0, o - i),
		end: Math.min(e, o + s + i)
	};
}
function de(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function fe(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function pe(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
	let o = n - 1, s = r - 1, c = (e) => Math.max(-1, Math.min(o, e));
	switch (t) {
		case "ArrowDown": return {
			...e,
			row: c(e.row + 1)
		};
		case "ArrowUp": return {
			...e,
			row: c(e.row - 1)
		};
		case "ArrowRight": return {
			...e,
			column: Math.min(s, e.column + 1)
		};
		case "ArrowLeft": return {
			...e,
			column: Math.max(0, e.column - 1)
		};
		case "PageDown": return {
			...e,
			row: c(Math.max(0, e.row) + i)
		};
		case "PageUp": return {
			...e,
			row: Math.max(n > 0 ? 0 : -1, e.row - i)
		};
		case "Home": return a ? {
			row: n > 0 ? 0 : -1,
			column: 0
		} : {
			...e,
			column: 0
		};
		case "End": return a ? {
			row: o,
			column: s
		} : {
			...e,
			column: s
		};
		default: return null;
	}
}
function me(e, t) {
	let n = e.map((e) => Math.max(0, Math.round(e.width))), r = n.reduce((e, t) => e + t, 0) - Math.floor(t);
	if (t <= 0 || r <= 0 || e.reduce((e, t, r) => e + (t.shrink ? Math.max(0, n[r] - Math.round(t.min)) : 0), 0) < r) return n;
	let i = [...new Set(e.filter((e) => e.shrink).map((e) => e.tier ?? 0))].sort((e, t) => e - t);
	for (let t of i) {
		if (r <= 0) break;
		let i = e.map((e, r) => e.shrink && (e.tier ?? 0) === t ? Math.max(0, n[r] - Math.round(e.min)) : 0), a = i.reduce((e, t) => e + t, 0);
		if (a === 0) continue;
		let o = Math.min(r, a), s = i.map((e) => Math.floor(e * o / a)), c = o - s.reduce((e, t) => e + t, 0), l = i.map((e, t) => ({
			value: e,
			index: t
		})).sort((e, t) => t.value - e.value || e.index - t.index);
		for (let { index: e } of l) {
			if (c <= 0) break;
			s[e] < i[e] && (s[e] += 1, --c);
		}
		s.forEach((e, t) => {
			n[t] -= e;
		}), r -= o;
	}
	return n;
}
//#endregion
//#region src/workbench/DataGrid.tsx
var he = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, ge = 160, _e = 360, ve = 72, ye = 96, be = 48, xe = 20, Se = 40, Ce = 16, we = 8, Te = 160, y = /* @__PURE__ */ new Set([
	"number",
	"integer",
	"currency",
	"percent",
	"bytes",
	"date",
	"datetime",
	"boolean",
	"enum",
	"list",
	"link"
]);
function Ee(e, t) {
	return e.align === "end" ? !1 : e.cell && !e.kind && !e.format ? !0 : !y.has(d(t, e.kind, e.format).kind);
}
function De(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) if (t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).overflowX !== "visible") return !0;
	return !1;
}
function Oe(e) {
	return (e.innerText ?? e.textContent ?? "").split("\n").map((e) => e.trim()).filter(Boolean).join(", ");
}
function ke(e) {
	try {
		return e.matches(":focus-visible");
	} catch {
		return !1;
	}
}
function Ae(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function je({ label: l, columns: u, rows: y, rowKey: je, rowLabel: b, selection: x = "none", selectedKeys: Me, defaultSelectedKeys: Ne, onSelectionChange: Pe, sort: S, defaultSort: Fe = null, onSortChange: Ie, sortMode: Le = "client", onRowActivate: Re, rowHref: ze, onNavigate: Be, contextActions: C, onCellEdit: w, onEndReached: T, totalRows: E, loading: D = !1, empty: Ve, density: O, rowHeight: He, height: Ue = "100%", virtualize: We = "auto", overscan: Ge = 8, footer: Ke, rowProps: qe, className: Je }) {
	let k = n(), { locale: A, timeZone: Ye } = a(), Xe = e(), j = t(), Ze = O ?? Xe?.density ?? "standard", M = He ?? he[Ze], Qe = m(null), N = m(null), $e = m(null), P = m(!1), F = m(null), et = m(-1), [tt, nt] = h(Fe), I = S === void 0 ? tt : S, [rt, it] = h(Ne ?? []), L = Me ?? rt, R = p(() => new Set(L), [L]), [at, ot] = h({}), [z, st] = h({}), ct = m(z);
	ct.current = z;
	let lt = m(null), [B, ut] = h(0), [V, H] = h(() => ({
		row: y.length > 0 ? 0 : -1,
		column: +(x === "multi")
	})), [U, dt] = h({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [W, ft] = h(null), [G, K] = h(null), pt = m(null), q = p(() => Le !== "client" || !I ? y : ce(y, u.find((e) => e.id === I.columnId), I.direction, A), [
		y,
		u,
		I,
		Le,
		A
	]), J = p(() => q.map((e, t) => je(e, t)), [q, je]), mt = q[0], Y = p(() => {
		let e = [...x === "multi" ? [{
			kind: "select",
			width: Se
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && at[e.id] === void 0,
			width: at[e.id] ?? e.width ?? z[e.id] ?? ge
		}))], t = (u.find((e) => e.primary) ?? u[0])?.id, n = me(e.map((e) => {
			if (e.kind === "select") return {
				width: e.width,
				min: e.width,
				shrink: !1
			};
			let n = e.column.id === t;
			return {
				width: e.width,
				min: Math.min(e.width, e.column.minWidth ?? (n ? ye : ve)),
				shrink: e.contentSized && Ee(e.column, mt === void 0 ? void 0 : v(e.column, mt)),
				tier: +!!n
			};
		}), U.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		x,
		at,
		z,
		U.width,
		mt
	]), ht = p(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), gt = Y.map((e, t) => t === ht ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), _t = Y.reduce((e, t) => e + t.width, 0), vt = p(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), yt = p(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), bt = We === "auto" ? q.length > 200 : We, X = ue(q.length, U.scrollTop, U.height, M, Ge, bt), xt = D && q.length === 0, St = !D && q.length === 0, Ct = xt ? we : D && q.length > 0 ? 1 : 0, wt = St ? Te : (q.length + Ct) * M, Tt = ae((e) => {
		if (b) return b(e);
		let t = u[0];
		if (!t) return "";
		let n = v(t, e);
		return te(n, d(n, t.kind, t.format), {
			locale: A,
			timeZone: Ye
		});
	}, [
		b,
		u,
		A,
		Ye
	]), Z = ae((e) => {
		Me === void 0 && it(e), Pe?.(e);
	}, [Me, Pe]), Et = (e) => {
		let t = le(I, e);
		S === void 0 && nt(t), Ie?.(t);
	};
	f(() => {
		let e = N.current;
		if (!e) return;
		let t = () => dt((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let Q = Y.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	f(() => {
		let e = Qe.current, t = N.current;
		if (!e || !t || !Q.includes("*")) return;
		let n = lt.current, r = !n || n.rows !== y || n.columns !== u || n.key !== Q || n.fonts !== B;
		lt.current = {
			rows: y,
			columns: u,
			key: Q,
			fonts: B
		}, e.dataset.measuring = "true";
		let i = ct.current, a = {};
		Y.forEach((e, n) => {
			if (e.kind !== "data" || !e.contentSized) return;
			let o = 0;
			for (let r of t.querySelectorAll(`[aria-colindex="${n + 1}"]`)) {
				let t = r.getAttribute("role") === "columnheader", n = r.getAttribute("aria-sort") === "ascending" || r.getAttribute("aria-sort") === "descending", i = t && e.column.sortable !== !1 && !n ? xe : 0;
				o = Math.max(o, r.getBoundingClientRect().width + i);
			}
			if (o <= 0) {
				i[e.column.id] !== void 0 && (a[e.column.id] = i[e.column.id]);
				return;
			}
			let s = Math.min(_e, Math.ceil(o));
			a[e.column.id] = r ? s : Math.max(s, i[e.column.id] ?? 0);
		}), delete e.dataset.measuring;
		let o = Object.keys(a);
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && st(a);
	}, [
		y,
		u,
		q,
		Q,
		X.start,
		X.end,
		B,
		Y
	]), oe(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => ut((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let Dt = (e) => (e - Math.max(1, Math.floor(Ge / 2))) * M, Ot = U.scrollTop + U.height >= Dt(q.length), kt = () => {
		let e = N.current;
		if (!e) return;
		G && K(null);
		let t = ue(q.length, e.scrollTop, e.clientHeight, M, Ge, bt), n = e.scrollTop + e.clientHeight >= Dt(q.length);
		(t.start !== X.start || t.end !== X.end || T && n !== Ot) && dt({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	oe(() => {
		H((e) => {
			let t = e.row < 0 || q.length === 0 ? -1 : Math.min(e.row, q.length - 1), n = Math.max(0, Math.min(e.column, Y.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [q.length, Y.length]), f(() => {
		P.current && (P.current = !1, N.current?.querySelector(`[data-cell="${V.row}:${V.column}"]`)?.focus({ preventScroll: !0 }));
	}), oe(() => {
		T && !D && q.length !== 0 && (E !== void 0 && q.length >= E || Ot && et.current !== q.length && (et.current = q.length, T()));
	}, [
		T,
		D,
		q.length,
		E,
		Ot
	]);
	let At = (e) => {
		let t = N.current;
		if (t && e.row >= 0) {
			let n = de(e.row, t.scrollTop, t.clientHeight, M, M);
			n !== t.scrollTop && (t.scrollTop = n, dt({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		P.current = !0, H(e);
	}, jt = (e, t) => {
		if (x === "single") {
			Z([e]), F.current = e;
			return;
		}
		if (x === "multi") {
			if (t && F.current) {
				Z([.../* @__PURE__ */ new Set([...L, ...fe(J, F.current, e)])]);
				return;
			}
			Z(R.has(e) ? L.filter((t) => t !== e) : [...L, e]), F.current = e;
		}
	}, Mt = (e) => {
		let t = q[e];
		if (t !== void 0) {
			if (Re) {
				Re(t);
				return;
			}
			N.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Nt = (e, t, n) => {
		let r = q[e];
		r !== void 0 && C && C(r).length !== 0 && ft({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Pt = ae(() => {
		ft(null), P.current = !0;
	}, []);
	ie(W !== null, $e, Pt);
	let Ft = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? be, n.width + t);
		ot((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, It = (e) => {
		if (Ae(e.target) || W) return;
		if (e.key === "Escape" && G) {
			e.stopPropagation(), K(null);
			return;
		}
		let { row: t, column: n } = V, r = q.length, i = Math.max(1, Math.floor((N.current?.clientHeight ?? M * 10) / M) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), Ft(n, e.key === "ArrowRight" ? Ce : -16);
			return;
		}
		let o = pe(V, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && x === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = J[o.row];
				e && (F.current ||= J[Math.max(0, t)] ?? e, Z([.../* @__PURE__ */ new Set([...L, ...fe(J, F.current, e)])]));
			}
			At(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), Et(a.column.id)) : e.key === " " && a?.kind === "select" && x === "multi" && (e.preventDefault(), Z(L.length === J.length ? [] : [...J]));
			return;
		}
		let s = J[t];
		if (e.key === "Enter") e.preventDefault(), Mt(t);
		else if (e.key === " " && s) e.preventDefault(), jt(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && x === "multi") e.preventDefault(), Z([...J]);
		else if (e.key === "F2" && w && a?.kind === "data") {
			e.preventDefault();
			let n = q[t];
			n !== void 0 && w(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Nt(t, n.left + 12, n.bottom);
		}
	}, Lt = (e, t) => {
		let n = J[t];
		n && x !== "none" && (e.target.closest("a, button, input, select, textarea") || (x === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? jt(n, e.shiftKey) : (Z([n]), F.current = n)));
	}, Rt = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? be, o = r.column.id, s = (e) => {
			ot((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, $ = (e, t) => {
		let n = V.row === e && V.column === t, r = vt.get(t), i = Y[t];
		return {
			"data-cell": `${e}:${t}`,
			"data-fit": i?.kind === "data" && i.contentSized ? "content" : void 0,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: (r) => {
				n || H({
					row: e,
					column: t
				});
				let a = r.currentTarget;
				if (i?.kind === "data" && ke(a) && De(a)) {
					let n = a.getBoundingClientRect();
					K({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height
					});
				} else K(null);
			},
			onBlur: () => K(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				De(t) ? t.title = Oe(t) : t.removeAttribute("title");
			}
		};
	};
	f(() => {
		let e = pt.current;
		if (!e || !G) return;
		let t = document.documentElement.clientWidth - 8, n = G.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? G.left - n : G.left)}px`;
	}, [G]);
	let zt = (e, t, n, r) => {
		let i = v(e, t);
		return e.cell ? /* @__PURE__ */ g("span", {
			className: "mtc-data-grid-cell-text",
			children: e.cell(t, {
				value: i,
				rowIndex: n,
				selected: r
			})
		}) : /* @__PURE__ */ g(ne, {
			value: i,
			kind: e.kind,
			format: e.format,
			tones: e.tones,
			context: "grid"
		});
	}, Bt = [];
	for (let e = X.start; e < X.end; e++) Bt.push(e);
	V.row >= 0 && V.row < q.length && (V.row < X.start || V.row >= X.end) && Bt.push(V.row);
	let Vt = x === "multi" && J.length > 0 && J.every((e) => R.has(e)), Ht = x === "multi" && !Vt && J.some((e) => R.has(e)), Ut = W ? q[W.rowIndex] : void 0, Wt = {
		"--mtc-grid-template": gt,
		"--mtc-grid-min-width": `${_t}px`,
		"--mtc-grid-row-height": `${M}px`,
		"--mtc-grid-viewport-width": U.width > 0 ? `${U.width}px` : "100%"
	};
	return /* @__PURE__ */ _("div", {
		ref: Qe,
		className: o("mtc-data-grid", O && `mtc-density-${O}`, Je),
		style: {
			...Wt,
			height: Ue
		},
		children: [
			/* @__PURE__ */ _("div", {
				ref: N,
				role: "grid",
				"aria-label": l,
				"aria-rowcount": (E ?? q.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": x === "multi" || void 0,
				"aria-busy": D || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: It,
				onScroll: kt,
				children: [/* @__PURE__ */ g("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ g("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Y.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ g("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...$(-1, t),
								children: /* @__PURE__ */ g("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": k("dataGrid.selectAll"),
									checked: Vt,
									ref: (e) => {
										e && (e.indeterminate = Ht);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Z(Vt ? [] : [...J])
								})
							}, "__select");
							let { column: n } = e, i = I?.columnId === n.id ? I.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ee(d(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ _("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...$(-1, t),
								onClick: o ? () => {
									Et(n.id), H({
										row: -1,
										column: t
									});
								} : void 0,
								children: [
									/* @__PURE__ */ g("span", {
										className: "mtc-data-grid-header-label",
										children: n.header
									}),
									i && /* @__PURE__ */ g(r, {
										name: i === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ g("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => Rt(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ _("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: wt },
					children: [
						Bt.map((e) => {
							let t = q[e], n = J[e], r = R.has(n), i = ze?.(t);
							return /* @__PURE__ */ g("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": x === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * M },
								...qe?.(t),
								onClick: (t) => Lt(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									w && i ? w(t, i) : Mt(e);
								},
								onContextMenu: C ? (t) => {
									t.preventDefault(), x !== "none" && !r && Z([n]), H({
										row: e,
										column: V.column
									}), Nt(e, t.clientX, t.clientY);
								} : void 0,
								children: Y.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ g("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...$(e, o),
										children: /* @__PURE__ */ g("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": k("dataGrid.selectRow", { label: Tt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => jt(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: c } = a, l = d(v(c, t), c.kind, c.format), u = c.align === "end" || !c.align && !c.cell && ee(l.kind), te = zt(c, t, e, r);
									return /* @__PURE__ */ g("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": c.id,
										"data-align": u ? "end" : "start",
										...$(e, o),
										children: i && o === yt ? /* @__PURE__ */ g("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: s(Be ? (e) => Be(t, e) : void 0),
											children: te
										}) : te
									}, c.id);
								})
							}, n);
						}),
						xt && Array.from({ length: we }, (e, t) => /* @__PURE__ */ g("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * M },
							children: Y.map((e, n) => /* @__PURE__ */ g("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ g(c, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						xt && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								children: k("dataGrid.loading")
							})
						}),
						D && q.length > 0 && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: q.length * M },
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: k("dataGrid.loadingMore")
							})
						}),
						St && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Te
							},
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: Ve ?? /* @__PURE__ */ g(i, {
									compact: !0,
									title: k("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			Ke && /* @__PURE__ */ g("div", {
				className: "mtc-data-grid-footer",
				children: Ke
			}),
			G && (() => {
				let e = Y[G.column], t = G.row >= 0 ? q[G.row] : void 0;
				if (e?.kind !== "data" || G.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ee(d(t === void 0 ? void 0 : v(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ g("div", {
					ref: pt,
					"aria-hidden": "true",
					inert: !0,
					className: o("mtc-data-grid-value-tip", O && `mtc-density-${O}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					style: {
						left: G.left,
						top: G.top,
						minWidth: G.width,
						height: G.height
					},
					children: t === void 0 ? e.column.header : zt(e.column, t, G.row, R.has(J[G.row] ?? ""))
				});
				return j ? se(r, j) : r;
			})(),
			W && Ut !== void 0 && C && (() => {
				let e = /* @__PURE__ */ g("div", {
					ref: $e,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ g(re, {
						label: k("dataGrid.rowActions", { label: Tt(Ut) }),
						items: C(Ut),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: W.x,
							top: W.y
						},
						onClose: Pt
					})
				});
				return j ? se(e, j) : e;
			})()
		]
	});
}
//#endregion
export { je as t };
