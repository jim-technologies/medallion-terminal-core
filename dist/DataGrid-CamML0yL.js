import { C as e, E as t, T as n, h as r, n as i, w as a } from "./States-Ds3cxTem.js";
import { t as o } from "./utils-j4lJ7S1v.js";
import { i as s } from "./types-Ds11x4VM.js";
import { b as c } from "./sourceError-BwpI_4dr.js";
import { a as l, i as ee, n as u, o as d, r as te, t as ne } from "./PropertyValue-BVLSKEmT.js";
import { a as f, c as re } from "./Overlays-_7OI9Emq.js";
import { useCallback as ie, useEffect as ae, useLayoutEffect as oe, useMemo as p, useRef as m, useState as h } from "react";
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
	if (t <= 0 || r <= 0) return n;
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
	"boolean"
]);
function Ee(e, t) {
	return e.align === "end" ? !1 : e.cell && !e.kind && !e.format ? !0 : !y.has(d(t, e.kind, e.format).kind);
}
function De(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function Oe({ label: l, columns: u, rows: y, rowKey: Oe, rowLabel: ke, selection: b = "none", selectedKeys: x, defaultSelectedKeys: Ae, onSelectionChange: je, sort: S, defaultSort: Me = null, onSortChange: Ne, sortMode: Pe = "client", onRowActivate: Fe, rowHref: Ie, onNavigate: Le, contextActions: C, onCellEdit: w, onEndReached: T, totalRows: E, loading: D = !1, empty: Re, density: O, rowHeight: ze, height: Be = "100%", virtualize: Ve = "auto", overscan: He = 8, footer: Ue, rowProps: We, className: Ge }) {
	let k = n(), { locale: A, timeZone: Ke } = a(), qe = e(), Je = t(), Ye = O ?? qe?.density ?? "standard", j = ze ?? he[Ye], Xe = m(null), M = m(null), Ze = m(null), N = m(!1), P = m(null), Qe = m(-1), [$e, et] = h(Me), F = S === void 0 ? $e : S, [tt, nt] = h(Ae ?? []), I = x ?? tt, L = p(() => new Set(I), [I]), [R, rt] = h({}), [z, it] = h({}), at = m(z);
	at.current = z;
	let ot = m(null), [B, st] = h(0), [V, H] = h(() => ({
		row: y.length > 0 ? 0 : -1,
		column: +(b === "multi")
	})), [U, W] = h({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [G, ct] = h(null), K = p(() => Pe !== "client" || !F ? y : ce(y, u.find((e) => e.id === F.columnId), F.direction, A), [
		y,
		u,
		F,
		Pe,
		A
	]), q = p(() => K.map((e, t) => Oe(e, t)), [K, Oe]), J = K[0], Y = p(() => {
		let e = [...b === "multi" ? [{
			kind: "select",
			width: Se
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && R[e.id] === void 0,
			width: R[e.id] ?? e.width ?? z[e.id] ?? ge
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
				shrink: e.contentSized && Ee(e.column, J === void 0 ? void 0 : v(e.column, J)),
				tier: +!!n
			};
		}), U.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		b,
		R,
		z,
		U.width,
		J
	]), lt = p(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), ut = Y.map((e, t) => t === lt ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), dt = Y.reduce((e, t) => e + t.width, 0), ft = p(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), pt = p(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), mt = Ve === "auto" ? K.length > 200 : Ve, X = ue(K.length, U.scrollTop, U.height, j, He, mt), ht = D && K.length === 0, gt = !D && K.length === 0, _t = ht ? we : D && K.length > 0 ? 1 : 0, vt = gt ? Te : (K.length + _t) * j, yt = ie((e) => {
		if (ke) return ke(e);
		let t = u[0];
		if (!t) return "";
		let n = v(t, e);
		return te(n, d(n, t.kind, t.format), {
			locale: A,
			timeZone: Ke
		});
	}, [
		ke,
		u,
		A,
		Ke
	]), Z = ie((e) => {
		x === void 0 && nt(e), je?.(e);
	}, [x, je]), bt = (e) => {
		let t = le(F, e);
		S === void 0 && et(t), Ne?.(t);
	};
	oe(() => {
		let e = M.current;
		if (!e) return;
		let t = () => W((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let Q = Y.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	oe(() => {
		let e = Xe.current, t = M.current;
		if (!e || !t || !Q.includes("*")) return;
		let n = ot.current, r = !n || n.rows !== y || n.columns !== u || n.key !== Q || n.fonts !== B;
		ot.current = {
			rows: y,
			columns: u,
			key: Q,
			fonts: B
		}, e.dataset.measuring = "true";
		let i = at.current, a = {};
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
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && it(a);
	}, [
		y,
		u,
		K,
		Q,
		X.start,
		X.end,
		B,
		Y
	]), ae(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => st((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let xt = (e) => (e - Math.max(1, Math.floor(He / 2))) * j, St = U.scrollTop + U.height >= xt(K.length), Ct = () => {
		let e = M.current;
		if (!e) return;
		let t = ue(K.length, e.scrollTop, e.clientHeight, j, He, mt), n = e.scrollTop + e.clientHeight >= xt(K.length);
		(t.start !== X.start || t.end !== X.end || T && n !== St) && W({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	ae(() => {
		H((e) => {
			let t = e.row < 0 || K.length === 0 ? -1 : Math.min(e.row, K.length - 1), n = Math.max(0, Math.min(e.column, Y.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [K.length, Y.length]), oe(() => {
		N.current && (N.current = !1, M.current?.querySelector(`[data-cell="${V.row}:${V.column}"]`)?.focus({ preventScroll: !0 }));
	}), ae(() => {
		T && !D && K.length !== 0 && (E !== void 0 && K.length >= E || St && Qe.current !== K.length && (Qe.current = K.length, T()));
	}, [
		T,
		D,
		K.length,
		E,
		St
	]);
	let wt = (e) => {
		let t = M.current;
		if (t && e.row >= 0) {
			let n = de(e.row, t.scrollTop, t.clientHeight, j, j);
			n !== t.scrollTop && (t.scrollTop = n, W({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		N.current = !0, H(e);
	}, Tt = (e, t) => {
		if (b === "single") {
			Z([e]), P.current = e;
			return;
		}
		if (b === "multi") {
			if (t && P.current) {
				Z([.../* @__PURE__ */ new Set([...I, ...fe(q, P.current, e)])]);
				return;
			}
			Z(L.has(e) ? I.filter((t) => t !== e) : [...I, e]), P.current = e;
		}
	}, Et = (e) => {
		let t = K[e];
		if (t !== void 0) {
			if (Fe) {
				Fe(t);
				return;
			}
			M.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Dt = (e, t, n) => {
		let r = K[e];
		r !== void 0 && C && C(r).length !== 0 && ct({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Ot = ie(() => {
		ct(null), N.current = !0;
	}, []);
	re(G !== null, Ze, Ot);
	let kt = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? be, n.width + t);
		rt((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, At = (e) => {
		if (De(e.target) || G) return;
		let { row: t, column: n } = V, r = K.length, i = Math.max(1, Math.floor((M.current?.clientHeight ?? j * 10) / j) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), kt(n, e.key === "ArrowRight" ? Ce : -16);
			return;
		}
		let o = pe(V, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && b === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = q[o.row];
				e && (P.current ||= q[Math.max(0, t)] ?? e, Z([.../* @__PURE__ */ new Set([...I, ...fe(q, P.current, e)])]));
			}
			wt(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), bt(a.column.id)) : e.key === " " && a?.kind === "select" && b === "multi" && (e.preventDefault(), Z(I.length === q.length ? [] : [...q]));
			return;
		}
		let s = q[t];
		if (e.key === "Enter") e.preventDefault(), Et(t);
		else if (e.key === " " && s) e.preventDefault(), Tt(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && b === "multi") e.preventDefault(), Z([...q]);
		else if (e.key === "F2" && w && a?.kind === "data") {
			e.preventDefault();
			let n = K[t];
			n !== void 0 && w(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Dt(t, n.left + 12, n.bottom);
		}
	}, jt = (e, t) => {
		let n = q[t];
		n && b !== "none" && (e.target.closest("a, button, input, select, textarea") || (b === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Tt(n, e.shiftKey) : (Z([n]), P.current = n)));
	}, Mt = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? be, o = r.column.id, s = (e) => {
			rt((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, $ = (e, t) => {
		let n = V.row === e && V.column === t, r = ft.get(t), i = Y[t];
		return {
			"data-cell": `${e}:${t}`,
			"data-fit": i?.kind === "data" && i.contentSized ? "content" : void 0,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: () => {
				n || H({
					row: e,
					column: t
				});
			}
		};
	}, Nt = [];
	for (let e = X.start; e < X.end; e++) Nt.push(e);
	V.row >= 0 && V.row < K.length && (V.row < X.start || V.row >= X.end) && Nt.push(V.row);
	let Pt = b === "multi" && q.length > 0 && q.every((e) => L.has(e)), Ft = b === "multi" && !Pt && q.some((e) => L.has(e)), It = G ? K[G.rowIndex] : void 0, Lt = {
		"--mtc-grid-template": ut,
		"--mtc-grid-min-width": `${dt}px`,
		"--mtc-grid-row-height": `${j}px`,
		"--mtc-grid-viewport-width": U.width > 0 ? `${U.width}px` : "100%"
	};
	return /* @__PURE__ */ _("div", {
		ref: Xe,
		className: o("mtc-data-grid", O && `mtc-density-${O}`, Ge),
		style: {
			...Lt,
			height: Be
		},
		children: [
			/* @__PURE__ */ _("div", {
				ref: M,
				role: "grid",
				"aria-label": l,
				"aria-rowcount": (E ?? K.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": b === "multi" || void 0,
				"aria-busy": D || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: At,
				onScroll: Ct,
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
									checked: Pt,
									ref: (e) => {
										e && (e.indeterminate = Ft);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Z(Pt ? [] : [...q])
								})
							}, "__select");
							let { column: n } = e, i = F?.columnId === n.id ? F.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ee(d(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ _("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...$(-1, t),
								onClick: o ? () => {
									bt(n.id), H({
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
										onPointerDown: (e) => Mt(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ _("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: vt },
					children: [
						Nt.map((e) => {
							let t = K[e], n = q[e], r = L.has(n), i = Ie?.(t);
							return /* @__PURE__ */ g("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": b === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * j },
								...We?.(t),
								onClick: (t) => jt(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									w && i ? w(t, i) : Et(e);
								},
								onContextMenu: C ? (t) => {
									t.preventDefault(), b !== "none" && !r && Z([n]), H({
										row: e,
										column: V.column
									}), Dt(e, t.clientX, t.clientY);
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
											"aria-label": k("dataGrid.selectRow", { label: yt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Tt(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: c } = a, l = v(c, t), u = d(l, c.kind, c.format), te = c.align === "end" || !c.align && !c.cell && ee(u.kind), f = c.cell ? c.cell(t, {
										value: l,
										rowIndex: e,
										selected: r
									}) : /* @__PURE__ */ g(ne, {
										value: l,
										kind: c.kind,
										format: c.format,
										tones: c.tones,
										context: "grid"
									});
									return /* @__PURE__ */ g("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": c.id,
										"data-align": te ? "end" : "start",
										...$(e, o),
										children: i && o === pt ? /* @__PURE__ */ g("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: s(Le ? (e) => Le(t, e) : void 0),
											children: f
										}) : f
									}, c.id);
								})
							}, n);
						}),
						ht && Array.from({ length: we }, (e, t) => /* @__PURE__ */ g("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * j },
							children: Y.map((e, n) => /* @__PURE__ */ g("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ g(c, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						ht && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								children: k("dataGrid.loading")
							})
						}),
						D && K.length > 0 && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: K.length * j },
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: k("dataGrid.loadingMore")
							})
						}),
						gt && /* @__PURE__ */ g("div", {
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
								children: Re ?? /* @__PURE__ */ g(i, {
									compact: !0,
									title: k("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			Ue && /* @__PURE__ */ g("div", {
				className: "mtc-data-grid-footer",
				children: Ue
			}),
			G && It !== void 0 && C && (() => {
				let e = /* @__PURE__ */ g("div", {
					ref: Ze,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ g(f, {
						label: k("dataGrid.rowActions", { label: yt(It) }),
						items: C(It),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: G.x,
							top: G.y
						},
						onClose: Ot
					})
				});
				return Je ? se(e, Je) : e;
			})()
		]
	});
}
//#endregion
export { Oe as t };
