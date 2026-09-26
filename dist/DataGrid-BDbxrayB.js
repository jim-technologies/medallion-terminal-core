import { C as e, E as t, T as n, h as r, n as i, w as a } from "./States-Ds3cxTem.js";
import { t as o } from "./utils-j4lJ7S1v.js";
import { i as s } from "./types-Ds11x4VM.js";
import { b as c } from "./sourceError-CQ2WzTbt.js";
import { a as l, i as ee, n as u, o as d, r as f, t as te } from "./PropertyValue-DJabXWny.js";
import { a as p, c as ne } from "./Overlays-_7OI9Emq.js";
import { useCallback as re, useEffect as m, useLayoutEffect as h, useMemo as g, useRef as _, useState as v } from "react";
import { jsx as y, jsxs as b } from "react/jsx-runtime";
import { createPortal as ie } from "react-dom";
//#region src/workbench/dataGridModel.ts
function x(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function ae(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = x(t, e);
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
function oe(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function se(e, t, n, r, i, a) {
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
function ce(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function le(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function ue(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
function de(e, t) {
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
var fe = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, pe = 160, me = 360, he = 72, ge = 96, _e = 48, ve = 20, ye = 40, be = 16, xe = 8, Se = 160, S = /* @__PURE__ */ new Set([
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
function Ce(e, t) {
	return e.align === "end" ? !1 : e.cell && !e.kind && !e.format ? !0 : !S.has(d(t, e.kind, e.format).kind);
}
function we(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) if (t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).overflowX !== "visible") return !0;
	return !1;
}
function Te(e) {
	return (e.innerText ?? e.textContent ?? "").split("\n").map((e) => e.trim()).filter(Boolean).join(", ");
}
function Ee(e) {
	try {
		return e.matches(":focus-visible");
	} catch {
		return !1;
	}
}
function De(e) {
	return e instanceof Element && e.closest("[data-editing=\"true\"]") !== null;
}
function Oe(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function ke({ label: l, columns: u, rows: S, rowKey: ke, rowLabel: Ae, selection: C = "none", selectedKeys: je, defaultSelectedKeys: Me, onSelectionChange: Ne, sort: Pe, defaultSort: Fe = null, onSortChange: Ie, sortMode: Le = "client", onRowActivate: Re, rowHref: ze, onNavigate: Be, contextActions: w, onCellEdit: T, editingCell: E, onEndReached: D, totalRows: O, loading: k = !1, empty: Ve, density: A, rowHeight: He, height: Ue = "100%", virtualize: We = "auto", overscan: Ge = 8, footer: Ke, rowProps: qe, className: Je }) {
	let j = n(), { locale: M, timeZone: Ye } = a(), Xe = e(), N = t(), Ze = A ?? Xe?.density ?? "standard", P = He ?? fe[Ze], Qe = _(null), F = _(null), $e = _(null), I = _(!1), L = _(null), et = _(-1), [tt, nt] = v(Fe), R = Pe === void 0 ? tt : Pe, [rt, it] = v(Me ?? []), z = je ?? rt, B = g(() => new Set(z), [z]), [at, ot] = v({}), [V, st] = v({}), ct = _(V);
	ct.current = V;
	let lt = _(null), [ut, dt] = v(0), [H, U] = v(() => ({
		row: S.length > 0 ? 0 : -1,
		column: +(C === "multi")
	})), [W, ft] = v({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [G, pt] = v(null), [K, q] = v(null), mt = _(null), J = g(() => Le !== "client" || !R ? S : ae(S, u.find((e) => e.id === R.columnId), R.direction, M), [
		S,
		u,
		R,
		Le,
		M
	]), Y = g(() => J.map((e, t) => ke(e, t)), [J, ke]), ht = J[0], X = g(() => {
		let e = [...C === "multi" ? [{
			kind: "select",
			width: ye
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && at[e.id] === void 0,
			width: at[e.id] ?? e.width ?? V[e.id] ?? pe
		}))], t = (u.find((e) => e.primary) ?? u[0])?.id, n = de(e.map((e) => {
			if (e.kind === "select") return {
				width: e.width,
				min: e.width,
				shrink: !1
			};
			let n = e.column.id === t;
			return {
				width: e.width,
				min: Math.min(e.width, e.column.minWidth ?? (n ? ge : he)),
				shrink: e.contentSized && Ce(e.column, ht === void 0 ? void 0 : x(e.column, ht)),
				tier: +!!n
			};
		}), W.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		C,
		at,
		V,
		W.width,
		ht
	]), gt = g(() => {
		let e = X.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : X.length - 1;
	}, [X]), _t = X.map((e, t) => t === gt ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), vt = X.reduce((e, t) => e + t.width, 0), yt = g(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of X.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return X.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [X]), bt = g(() => {
		let e = X.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : X.findIndex((e) => e.kind === "data");
	}, [X]), xt = We === "auto" ? J.length > 200 : We, Z = se(J.length, W.scrollTop, W.height, P, Ge, xt), St = k && J.length === 0, Ct = !k && J.length === 0, wt = St ? xe : k && J.length > 0 ? 1 : 0, Tt = Ct ? Se : (J.length + wt) * P, Et = re((e) => {
		if (Ae) return Ae(e);
		let t = u[0];
		if (!t) return "";
		let n = x(t, e);
		return f(n, d(n, t.kind, t.format), {
			locale: M,
			timeZone: Ye
		});
	}, [
		Ae,
		u,
		M,
		Ye
	]), Q = re((e) => {
		je === void 0 && it(e), Ne?.(e);
	}, [je, Ne]), Dt = (e) => {
		let t = oe(R, e);
		Pe === void 0 && nt(t), Ie?.(t);
	};
	h(() => {
		let e = F.current;
		if (!e) return;
		let t = () => ft((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let $ = X.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	h(() => {
		let e = Qe.current, t = F.current;
		if (!e || !t || !$.includes("*")) return;
		let n = lt.current, r = !n || n.rows !== S || n.columns !== u || n.key !== $ || n.fonts !== ut;
		lt.current = {
			rows: S,
			columns: u,
			key: $,
			fonts: ut
		}, e.dataset.measuring = "true";
		let i = ct.current, a = {};
		X.forEach((e, n) => {
			if (e.kind !== "data" || !e.contentSized) return;
			let o = 0;
			for (let r of t.querySelectorAll(`[aria-colindex="${n + 1}"]`)) {
				let t = r.getAttribute("role") === "columnheader", n = r.getAttribute("aria-sort") === "ascending" || r.getAttribute("aria-sort") === "descending", i = t && e.column.sortable !== !1 && !n ? ve : 0;
				o = Math.max(o, r.getBoundingClientRect().width + i);
			}
			if (o <= 0) {
				i[e.column.id] !== void 0 && (a[e.column.id] = i[e.column.id]);
				return;
			}
			let s = Math.min(me, Math.ceil(o));
			a[e.column.id] = r ? s : Math.max(s, i[e.column.id] ?? 0);
		}), delete e.dataset.measuring;
		let o = Object.keys(a);
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && st(a);
	}, [
		S,
		u,
		J,
		$,
		Z.start,
		Z.end,
		ut,
		X
	]), m(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => dt((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let Ot = (e) => (e - Math.max(1, Math.floor(Ge / 2))) * P, kt = W.scrollTop + W.height >= Ot(J.length), At = () => {
		let e = F.current;
		if (!e) return;
		K && q(null);
		let t = se(J.length, e.scrollTop, e.clientHeight, P, Ge, xt), n = e.scrollTop + e.clientHeight >= Ot(J.length);
		(t.start !== Z.start || t.end !== Z.end || D && n !== kt) && ft({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	m(() => {
		U((e) => {
			let t = e.row < 0 || J.length === 0 ? -1 : Math.min(e.row, J.length - 1), n = Math.max(0, Math.min(e.column, X.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [J.length, X.length]), h(() => {
		I.current && (I.current = !1, F.current?.querySelector(`[data-cell="${H.row}:${H.column}"]`)?.focus({ preventScroll: !0 }));
	});
	let jt = E ? `${E.rowKey}\u0000${E.columnId}` : null, Mt = _(jt);
	m(() => {
		let e = Mt.current !== null && jt === null;
		if (Mt.current = jt, !e) return;
		let t = document.activeElement;
		(!t || t === document.body || F.current?.contains(t)) && F.current?.querySelector(`[data-cell="${H.row}:${H.column}"]`)?.focus({ preventScroll: !0 });
	}, [
		jt,
		H.row,
		H.column
	]), m(() => {
		D && !k && J.length !== 0 && (O !== void 0 && J.length >= O || kt && et.current !== J.length && (et.current = J.length, D()));
	}, [
		D,
		k,
		J.length,
		O,
		kt
	]);
	let Nt = (e) => {
		let t = F.current;
		if (t && e.row >= 0) {
			let n = ce(e.row, t.scrollTop, t.clientHeight, P, P);
			n !== t.scrollTop && (t.scrollTop = n, ft({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		I.current = !0, U(e);
	}, Pt = (e, t) => {
		if (C === "single") {
			Q([e]), L.current = e;
			return;
		}
		if (C === "multi") {
			if (t && L.current) {
				Q([.../* @__PURE__ */ new Set([...z, ...le(Y, L.current, e)])]);
				return;
			}
			Q(B.has(e) ? z.filter((t) => t !== e) : [...z, e]), L.current = e;
		}
	}, Ft = (e) => {
		let t = J[e];
		if (t !== void 0) {
			if (Re) {
				Re(t);
				return;
			}
			F.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, It = (e, t, n) => {
		let r = J[e];
		r !== void 0 && w && w(r).length !== 0 && pt({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Lt = re(() => {
		pt(null), I.current = !0;
	}, []);
	ne(G !== null, $e, Lt);
	let Rt = (e, t) => {
		let n = X[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? _e, n.width + t);
		ot((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, zt = (e) => {
		if (Oe(e.target) || G || De(e.target)) return;
		if (e.key === "Escape" && K) {
			e.stopPropagation(), q(null);
			return;
		}
		let { row: t, column: n } = H, r = J.length, i = Math.max(1, Math.floor((F.current?.clientHeight ?? P * 10) / P) - 1), a = X[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), Rt(n, e.key === "ArrowRight" ? be : -16);
			return;
		}
		let o = ue(H, e.key, {
			rowCount: r,
			columnCount: X.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && C === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = Y[o.row];
				e && (L.current ||= Y[Math.max(0, t)] ?? e, Q([.../* @__PURE__ */ new Set([...z, ...le(Y, L.current, e)])]));
			}
			Nt(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), Dt(a.column.id)) : e.key === " " && a?.kind === "select" && C === "multi" && (e.preventDefault(), Q(z.length === Y.length ? [] : [...Y]));
			return;
		}
		let s = Y[t];
		if (e.key === "Enter") e.preventDefault(), Ft(t);
		else if (e.key === " " && s) e.preventDefault(), Pt(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && C === "multi") e.preventDefault(), Q([...Y]);
		else if (e.key === "F2" && T && a?.kind === "data") {
			e.preventDefault();
			let n = J[t];
			n !== void 0 && T(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			It(t, n.left + 12, n.bottom);
		}
	}, Bt = (e, t) => {
		let n = Y[t];
		n && C !== "none" && (e.target.closest("a, button, input, select, textarea") || (C === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Pt(n, e.shiftKey) : (Q([n]), L.current = n)));
	}, Vt = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = X[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? _e, o = r.column.id, s = (e) => {
			ot((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, Ht = (e, t) => {
		let n = H.row === e && H.column === t, r = yt.get(t), i = X[t];
		return {
			"data-cell": `${e}:${t}`,
			"data-fit": i?.kind === "data" && i.contentSized ? "content" : void 0,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: (r) => {
				n || U({
					row: e,
					column: t
				});
				let a = r.currentTarget;
				if (i?.kind === "data" && Ee(a) && we(a)) {
					let n = a.getBoundingClientRect();
					q({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height
					});
				} else q(null);
			},
			onBlur: () => q(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				we(t) ? t.title = Te(t) : t.removeAttribute("title");
			}
		};
	};
	h(() => {
		let e = mt.current;
		if (!e || !K) return;
		let t = document.documentElement.clientWidth - 8, n = K.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? K.left - n : K.left)}px`;
	}, [K]);
	let Ut = (e, t, n, r, i = !1) => {
		let a = x(e, t);
		return e.cell && i ? e.cell(t, {
			value: a,
			rowIndex: n,
			selected: r
		}) : e.cell ? /* @__PURE__ */ y("span", {
			className: "mtc-data-grid-cell-text",
			children: e.cell(t, {
				value: a,
				rowIndex: n,
				selected: r
			})
		}) : /* @__PURE__ */ y(te, {
			value: a,
			kind: e.kind,
			format: e.format,
			tones: e.tones,
			context: "grid"
		});
	}, Wt = [];
	for (let e = Z.start; e < Z.end; e++) Wt.push(e);
	H.row >= 0 && H.row < J.length && (H.row < Z.start || H.row >= Z.end) && Wt.push(H.row);
	let Gt = C === "multi" && Y.length > 0 && Y.every((e) => B.has(e)), Kt = C === "multi" && !Gt && Y.some((e) => B.has(e)), qt = G ? J[G.rowIndex] : void 0, Jt = {
		"--mtc-grid-template": _t,
		"--mtc-grid-min-width": `${vt}px`,
		"--mtc-grid-row-height": `${P}px`,
		"--mtc-grid-viewport-width": W.width > 0 ? `${W.width}px` : "100%"
	};
	return /* @__PURE__ */ b("div", {
		ref: Qe,
		className: o("mtc-data-grid", A && `mtc-density-${A}`, Je),
		style: {
			...Jt,
			height: Ue
		},
		children: [
			/* @__PURE__ */ b("div", {
				ref: F,
				role: "grid",
				"aria-label": l,
				"aria-rowcount": (O ?? J.length) + 1,
				"aria-colcount": X.length,
				"aria-multiselectable": C === "multi" || void 0,
				"aria-busy": k || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: zt,
				onScroll: At,
				children: [/* @__PURE__ */ y("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ y("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: X.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ y("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...Ht(-1, t),
								children: /* @__PURE__ */ y("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": j("dataGrid.selectAll"),
									checked: Gt,
									ref: (e) => {
										e && (e.indeterminate = Kt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Q(Gt ? [] : [...Y])
								})
							}, "__select");
							let { column: n } = e, i = R?.columnId === n.id ? R.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ee(d(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ b("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...Ht(-1, t),
								onClick: o ? () => {
									Dt(n.id), U({
										row: -1,
										column: t
									});
								} : void 0,
								children: [
									/* @__PURE__ */ y("span", {
										className: "mtc-data-grid-header-label",
										children: n.header
									}),
									i && /* @__PURE__ */ y(r, {
										name: i === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ y("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => Vt(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ b("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Tt },
					children: [
						Wt.map((e) => {
							let t = J[e], n = Y[e], r = B.has(n), i = ze?.(t);
							return /* @__PURE__ */ y("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": C === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * P },
								...qe?.(t),
								onClick: (t) => Bt(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									T && i ? T(t, i) : Ft(e);
								},
								onContextMenu: w ? (t) => {
									t.preventDefault(), C !== "none" && !r && Q([n]), U({
										row: e,
										column: H.column
									}), It(e, t.clientX, t.clientY);
								} : void 0,
								children: X.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ y("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...Ht(e, o),
										children: /* @__PURE__ */ y("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": j("dataGrid.selectRow", { label: Et(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Pt(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: c } = a, l = d(x(c, t), c.kind, c.format), u = c.align === "end" || !c.align && !c.cell && ee(l.kind), f = E?.rowKey === n && E.columnId === c.id, te = Ut(c, t, e, r, f), p = Ht(e, o);
									return /* @__PURE__ */ y("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": c.id,
										"data-align": u ? "end" : "start",
										...p,
										"data-editing": f || void 0,
										tabIndex: f ? void 0 : p.tabIndex,
										onPointerEnter: f ? void 0 : p.onPointerEnter,
										children: i && o === bt && !f ? /* @__PURE__ */ y("a", {
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
						St && Array.from({ length: xe }, (e, t) => /* @__PURE__ */ y("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * P },
							children: X.map((e, n) => /* @__PURE__ */ y("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ y(c, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						St && /* @__PURE__ */ y("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ y("div", {
								role: "gridcell",
								children: j("dataGrid.loading")
							})
						}),
						k && J.length > 0 && /* @__PURE__ */ y("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: J.length * P },
							children: /* @__PURE__ */ y("div", {
								role: "gridcell",
								"aria-colspan": X.length,
								className: "mtc-data-grid-cell",
								children: j("dataGrid.loadingMore")
							})
						}),
						Ct && /* @__PURE__ */ y("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Se
							},
							children: /* @__PURE__ */ y("div", {
								role: "gridcell",
								"aria-colspan": X.length,
								className: "mtc-data-grid-cell",
								children: Ve ?? /* @__PURE__ */ y(i, {
									compact: !0,
									title: j("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			Ke && /* @__PURE__ */ y("div", {
				className: "mtc-data-grid-footer",
				children: Ke
			}),
			K && (() => {
				let e = X[K.column], t = K.row >= 0 ? J[K.row] : void 0;
				if (e?.kind !== "data" || K.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ee(d(t === void 0 ? void 0 : x(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ y("div", {
					ref: mt,
					"aria-hidden": "true",
					inert: !0,
					className: o("mtc-data-grid-value-tip", A && `mtc-density-${A}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					style: {
						left: K.left,
						top: K.top,
						minWidth: K.width,
						height: K.height
					},
					children: t === void 0 ? e.column.header : Ut(e.column, t, K.row, B.has(Y[K.row] ?? ""))
				});
				return N ? ie(r, N) : r;
			})(),
			G && qt !== void 0 && w && (() => {
				let e = /* @__PURE__ */ y("div", {
					ref: $e,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ y(p, {
						label: j("dataGrid.rowActions", { label: Et(qt) }),
						items: w(qt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: G.x,
							top: G.y
						},
						onClose: Lt
					})
				});
				return N ? ie(e, N) : e;
			})()
		]
	});
}
//#endregion
export { ke as t };
