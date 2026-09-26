import { C as e, E as t, T as n, h as r, n as i, w as a } from "./States-BRpBuveA.js";
import { n as o, r as s, t as c } from "./utils-BfYGx7e_.js";
import { i as ee } from "./types-DZxjyhu_.js";
import { b as te } from "./sourceError-CTpw8oGk.js";
import { a as l, i as ne, n as u, o as d, r as f, t as re } from "./PropertyValue-pJrg2xQi.js";
import { a as ie, c as ae } from "./Overlays-BqanRm2f.js";
import { useCallback as oe, useEffect as p, useLayoutEffect as m, useMemo as h, useRef as g, useState as _ } from "react";
import { jsx as v, jsxs as y } from "react/jsx-runtime";
import { createPortal as se } from "react-dom";
//#region src/workbench/dataGridModel.ts
function b(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function ce(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = b(t, e);
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
		let o = Math.min(r, a), s = i.map((e) => Math.floor(e * o / a)), c = o - s.reduce((e, t) => e + t, 0), ee = i.map((e, t) => ({
			value: e,
			index: t
		})).sort((e, t) => t.value - e.value || e.index - t.index);
		for (let { index: e } of ee) {
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
}, ge = 160, _e = 360, ve = 72, ye = 96, be = 48, xe = 20, Se = 40, Ce = 16, we = 320, x = 8, Te = 8, Ee = 160, S = /* @__PURE__ */ new Set([
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
function De(e, t) {
	return e.align === "end" ? !1 : e.cell && !e.kind && !e.format ? !0 : !S.has(d(t, e.kind, e.format).kind);
}
function Oe(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) if (t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).overflowX !== "visible") return !0;
	return !1;
}
function ke(e) {
	return (e.innerText ?? e.textContent ?? "").split("\n").map((e) => e.trim()).filter(Boolean).join(", ");
}
function Ae(e) {
	try {
		return e.matches(":focus-visible");
	} catch {
		return !1;
	}
}
function je(e) {
	return e instanceof Element && e.closest("[data-editing=\"true\"]") !== null;
}
function Me(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function Ne({ label: l, columns: u, rows: S, rowKey: Ne, rowLabel: Pe, selection: C = "none", selectedKeys: Fe, defaultSelectedKeys: Ie, onSelectionChange: Le, sort: Re, defaultSort: ze = null, onSortChange: Be, sortMode: Ve = "client", onRowActivate: He, rowHref: Ue, onNavigate: We, contextActions: w, onCellEdit: Ge, editingCell: T, onEditCancel: Ke, onEndReached: E, totalRows: D, loading: O = !1, empty: qe, density: k, rowHeight: Je, height: Ye = "100%", virtualize: Xe = "auto", overscan: Ze = 8, footer: Qe, rowProps: $e, className: et }) {
	let A = n(), { locale: tt, timeZone: nt } = a(), rt = e(), j = t(), it = k ?? rt?.density ?? "standard", M = Je ?? he[it], at = g(null), N = g(null), ot = g(null), P = g(!1), F = g(null), st = g(-1), [ct, lt] = _(ze), I = Re === void 0 ? ct : Re, [ut, dt] = _(Ie ?? []), L = Fe ?? ut, R = h(() => new Set(L), [L]), [ft, pt] = _({}), [z, mt] = _({}), ht = g(z);
	ht.current = z;
	let gt = g(null), [_t, vt] = _(0), [B, V] = _(() => ({
		row: S.length > 0 ? 0 : -1,
		column: +(C === "multi")
	})), [H, yt] = _({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [U, bt] = _(null), [W, G] = _(null), xt = g(null), K = g(null), St = g(Ke);
	St.current = Ke;
	let q = h(() => Ve !== "client" || !I ? S : ce(S, u.find((e) => e.id === I.columnId), I.direction, tt), [
		S,
		u,
		I,
		Ve,
		tt
	]), J = h(() => q.map((e, t) => Ne(e, t)), [q, Ne]), Ct = q[0], Y = h(() => {
		let e = [...C === "multi" ? [{
			kind: "select",
			width: Se
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && ft[e.id] === void 0,
			width: ft[e.id] ?? e.width ?? z[e.id] ?? ge
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
				shrink: e.contentSized && De(e.column, Ct === void 0 ? void 0 : b(e.column, Ct)),
				tier: +!!n
			};
		}), H.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		C,
		ft,
		z,
		H.width,
		Ct
	]), wt = h(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), Tt = Y.map((e, t) => t === wt ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Et = Y.reduce((e, t) => e + t.width, 0), Dt = h(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), Ot = h(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), kt = Xe === "auto" ? q.length > 200 : Xe, X = ue(q.length, H.scrollTop, H.height, M, Ze, kt), At = O && q.length === 0, jt = !O && q.length === 0, Mt = At ? Te : O && q.length > 0 ? 1 : 0, Nt = jt ? Ee : (q.length + Mt) * M, Pt = oe((e) => {
		if (Pe) return Pe(e);
		let t = u[0];
		if (!t) return "";
		let n = b(t, e);
		return f(n, d(n, t.kind, t.format), {
			locale: tt,
			timeZone: nt
		});
	}, [
		Pe,
		u,
		tt,
		nt
	]), Z = oe((e) => {
		Fe === void 0 && dt(e), Le?.(e);
	}, [Fe, Le]), Ft = (e) => {
		let t = le(I, e);
		Re === void 0 && lt(t), Be?.(t);
	};
	m(() => {
		let e = N.current;
		if (!e) return;
		let t = () => yt((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let It = Y.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	m(() => {
		let e = at.current, t = N.current;
		if (!e || !t || !It.includes("*")) return;
		let n = gt.current, r = !n || n.rows !== S || n.columns !== u || n.key !== It || n.fonts !== _t;
		gt.current = {
			rows: S,
			columns: u,
			key: It,
			fonts: _t
		}, e.dataset.measuring = "true";
		let i = ht.current, a = {};
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
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && mt(a);
	}, [
		S,
		u,
		q,
		It,
		X.start,
		X.end,
		_t,
		Y
	]), p(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => vt((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let Lt = (e) => (e - Math.max(1, Math.floor(Ze / 2))) * M, Rt = H.scrollTop + H.height >= Lt(q.length), zt = () => {
		let e = N.current;
		if (!e) return;
		W && G(null);
		let t = ue(q.length, e.scrollTop, e.clientHeight, M, Ze, kt), n = e.scrollTop + e.clientHeight >= Lt(q.length);
		(t.start !== X.start || t.end !== X.end || E && n !== Rt) && yt({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	p(() => {
		V((e) => {
			let t = e.row < 0 || q.length === 0 ? -1 : Math.min(e.row, q.length - 1), n = Math.max(0, Math.min(e.column, Y.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [q.length, Y.length]), m(() => {
		P.current && (P.current = !1, N.current?.querySelector(`[data-cell="${B.row}:${B.column}"]`)?.focus({ preventScroll: !0 }));
	});
	let Bt = T ? `${T.rowKey}\u0000${T.columnId}` : null, Vt = g(Bt);
	p(() => {
		let e = Vt.current !== null && Bt === null;
		if (Vt.current = Bt, !e) return;
		let t = document.activeElement;
		(!t || t === document.body || N.current?.contains(t)) && N.current?.querySelector(`[data-cell="${B.row}:${B.column}"]`)?.focus({ preventScroll: !0 });
	}, [
		Bt,
		B.row,
		B.column
	]);
	let Ht = T?.layout === "overlay" ? T : null, Q = Ht ? J.indexOf(Ht.rowKey) : -1, Ut = Ht ? Y.findIndex((e) => e.kind === "data" && e.column.id === Ht.columnId) : -1, $ = Y[Ut], Wt = Q >= 0 && $?.kind === "data" && $.column.cell !== void 0, Gt = () => {
		let e = K.current;
		if (!Wt || !e) return;
		let t = N.current?.querySelector(`[data-cell="${Q}:${Ut}"]`);
		if (!t) return;
		let n = t.getBoundingClientRect(), r = document.documentElement.clientWidth - x, i = document.documentElement.clientHeight - x, a = Math.min(Math.max(n.width, we), r - x);
		e.style.width = `${a}px`, e.style.left = `${Math.max(x, Math.min(n.left, r - a))}px`, e.style.top = `${Math.max(x, Math.min(n.top, i - e.offsetHeight))}px`;
	}, Kt = g(Gt);
	Kt.current = Gt, m(() => Kt.current()), p(() => {
		let e = K.current;
		if (!Wt || !e) return;
		e.contains(document.activeElement) || (o(e)[0] ?? e).focus();
		let t = () => Kt.current(), n = (t) => {
			e.contains(t.target) || St.current?.();
		};
		window.addEventListener("resize", t), document.addEventListener("scroll", t, !0), document.addEventListener("pointerdown", n);
		let r = typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(t);
		return r?.observe(e), () => {
			window.removeEventListener("resize", t), document.removeEventListener("scroll", t, !0), document.removeEventListener("pointerdown", n), r?.disconnect();
		};
	}, [
		Wt,
		Q,
		Ut,
		j
	]), p(() => {
		E && !O && q.length !== 0 && (D !== void 0 && q.length >= D || Rt && st.current !== q.length && (st.current = q.length, E()));
	}, [
		E,
		O,
		q.length,
		D,
		Rt
	]);
	let qt = (e) => {
		let t = N.current;
		if (t && e.row >= 0) {
			let n = de(e.row, t.scrollTop, t.clientHeight, M, M);
			n !== t.scrollTop && (t.scrollTop = n, yt({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		P.current = !0, V(e);
	}, Jt = (e, t) => {
		if (C === "single") {
			Z([e]), F.current = e;
			return;
		}
		if (C === "multi") {
			if (t && F.current) {
				Z([.../* @__PURE__ */ new Set([...L, ...fe(J, F.current, e)])]);
				return;
			}
			Z(R.has(e) ? L.filter((t) => t !== e) : [...L, e]), F.current = e;
		}
	}, Yt = (e) => {
		let t = q[e];
		if (t !== void 0) {
			if (He) {
				He(t);
				return;
			}
			N.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Xt = (e, t, n) => {
		let r = q[e];
		r !== void 0 && w && w(r).length !== 0 && bt({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Zt = oe(() => {
		bt(null), P.current = !0;
	}, []);
	ae(U !== null, ot, Zt);
	let Qt = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? be, n.width + t);
		pt((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, $t = (e) => {
		if (je(e.target)) {
			e.key === "Escape" && !e.defaultPrevented && (e.preventDefault(), Ke?.());
			return;
		}
		if (Me(e.target) || U) return;
		if (e.key === "Escape" && W) {
			e.stopPropagation(), G(null);
			return;
		}
		let { row: t, column: n } = B, r = q.length, i = Math.max(1, Math.floor((N.current?.clientHeight ?? M * 10) / M) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), Qt(n, e.key === "ArrowRight" ? Ce : -16);
			return;
		}
		let o = pe(B, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && C === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = J[o.row];
				e && (F.current ||= J[Math.max(0, t)] ?? e, Z([.../* @__PURE__ */ new Set([...L, ...fe(J, F.current, e)])]));
			}
			qt(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), Ft(a.column.id)) : e.key === " " && a?.kind === "select" && C === "multi" && (e.preventDefault(), Z(L.length === J.length ? [] : [...J]));
			return;
		}
		let s = J[t];
		if (e.key === "Enter") e.preventDefault(), Yt(t);
		else if (e.key === " " && s) e.preventDefault(), Jt(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && C === "multi") e.preventDefault(), Z([...J]);
		else if (e.key === "F2" && Ge && a?.kind === "data") {
			e.preventDefault();
			let n = q[t];
			n !== void 0 && Ge(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Xt(t, n.left + 12, n.bottom);
		}
	}, en = (e, t) => {
		let n = J[t];
		n && C !== "none" && (e.target.closest("a, button, input, select, textarea") || (C === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Jt(n, e.shiftKey) : (Z([n]), F.current = n)));
	}, tn = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? be, o = r.column.id, s = (e) => {
			pt((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, nn = (e, t) => {
		let n = B.row === e && B.column === t, r = Dt.get(t), i = Y[t];
		return {
			"data-cell": `${e}:${t}`,
			"data-fit": i?.kind === "data" && i.contentSized ? "content" : void 0,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: (r) => {
				n || V({
					row: e,
					column: t
				});
				let a = r.currentTarget;
				if (i?.kind === "data" && Ae(a) && Oe(a)) {
					let n = a.getBoundingClientRect();
					G({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height
					});
				} else G(null);
			},
			onBlur: () => G(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				Oe(t) ? t.title = ke(t) : t.removeAttribute("title");
			}
		};
	};
	m(() => {
		let e = xt.current;
		if (!e || !W) return;
		let t = document.documentElement.clientWidth - 8, n = W.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? W.left - n : W.left)}px`;
	}, [W]);
	let rn = (e, t, n, r, i = !1) => {
		let a = {
			value: b(e, t),
			rowIndex: n,
			selected: r,
			editing: i
		};
		return e.cell && i ? e.cell(t, a) : e.cell ? /* @__PURE__ */ v("span", {
			className: "mtc-data-grid-cell-text",
			children: e.cell(t, {
				...a,
				editing: !1
			})
		}) : /* @__PURE__ */ v(re, {
			value: a.value,
			kind: e.kind,
			format: e.format,
			tones: e.tones,
			context: "grid"
		});
	}, an = [];
	for (let e = X.start; e < X.end; e++) an.push(e);
	B.row >= 0 && B.row < q.length && (B.row < X.start || B.row >= X.end) && an.push(B.row);
	let on = C === "multi" && J.length > 0 && J.every((e) => R.has(e)), sn = C === "multi" && !on && J.some((e) => R.has(e)), cn = U ? q[U.rowIndex] : void 0, ln = {
		"--mtc-grid-template": Tt,
		"--mtc-grid-min-width": `${Et}px`,
		"--mtc-grid-row-height": `${M}px`,
		"--mtc-grid-viewport-width": H.width > 0 ? `${H.width}px` : "100%"
	};
	return /* @__PURE__ */ y("div", {
		ref: at,
		className: c("mtc-data-grid", k && `mtc-density-${k}`, et),
		style: {
			...ln,
			height: Ye
		},
		children: [
			/* @__PURE__ */ y("div", {
				ref: N,
				role: "grid",
				"aria-label": l,
				"aria-rowcount": (D ?? q.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": C === "multi" || void 0,
				"aria-busy": O || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: $t,
				onScroll: zt,
				children: [/* @__PURE__ */ v("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ v("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: Y.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ v("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...nn(-1, t),
								children: /* @__PURE__ */ v("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": A("dataGrid.selectAll"),
									checked: on,
									ref: (e) => {
										e && (e.indeterminate = sn);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Z(on ? [] : [...J])
								})
							}, "__select");
							let { column: n } = e, i = I?.columnId === n.id ? I.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ne(d(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ y("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...nn(-1, t),
								onClick: o ? () => {
									Ft(n.id), V({
										row: -1,
										column: t
									});
								} : void 0,
								children: [
									/* @__PURE__ */ v("span", {
										className: "mtc-data-grid-header-label",
										children: n.header
									}),
									i && /* @__PURE__ */ v(r, {
										name: i === "ascending" ? "sort-asc" : "sort-desc",
										className: "mtc-data-grid-sort-icon"
									}),
									/* @__PURE__ */ v("span", {
										"aria-hidden": "true",
										className: "mtc-data-grid-resize",
										onPointerDown: (e) => tn(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ y("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Nt },
					children: [
						an.map((e) => {
							let t = q[e], n = J[e], r = R.has(n), i = Ue?.(t);
							return /* @__PURE__ */ v("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": C === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * M },
								...$e?.(t),
								onClick: (t) => en(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									Ge && i ? Ge(t, i) : Yt(e);
								},
								onContextMenu: w ? (t) => {
									t.preventDefault(), C !== "none" && !r && Z([n]), V({
										row: e,
										column: B.column
									}), Xt(e, t.clientX, t.clientY);
								} : void 0,
								children: Y.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...nn(e, o),
										children: /* @__PURE__ */ v("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": A("dataGrid.selectRow", { label: Pt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Jt(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = d(b(s, t), s.kind, s.format), te = s.align === "end" || !s.align && !s.cell && ne(c.kind), l = T?.rowKey === n && T.columnId === s.id && T.layout !== "overlay", u = rn(s, t, e, r, l), f = nn(e, o);
									return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": s.id,
										"data-align": te ? "end" : "start",
										...f,
										"data-editing": l || void 0,
										tabIndex: l ? void 0 : f.tabIndex,
										onPointerEnter: l ? void 0 : f.onPointerEnter,
										children: i && o === Ot && !l ? /* @__PURE__ */ v("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: ee(We ? (e) => We(t, e) : void 0),
											children: u
										}) : u
									}, s.id);
								})
							}, n);
						}),
						At && Array.from({ length: Te }, (e, t) => /* @__PURE__ */ v("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * M },
							children: Y.map((e, n) => /* @__PURE__ */ v("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ v(te, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						At && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								children: A("dataGrid.loading")
							})
						}),
						O && q.length > 0 && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: q.length * M },
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: A("dataGrid.loadingMore")
							})
						}),
						jt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Ee
							},
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: qe ?? /* @__PURE__ */ v(i, {
									compact: !0,
									title: A("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			Qe && /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-footer",
				children: Qe
			}),
			W && (() => {
				let e = Y[W.column], t = W.row >= 0 ? q[W.row] : void 0;
				if (e?.kind !== "data" || W.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ne(d(t === void 0 ? void 0 : b(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ v("div", {
					ref: xt,
					"aria-hidden": "true",
					inert: !0,
					className: c("mtc-data-grid-value-tip", k && `mtc-density-${k}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					style: {
						left: W.left,
						top: W.top,
						minWidth: W.width,
						height: W.height
					},
					children: t === void 0 ? e.column.header : rn(e.column, t, W.row, R.has(J[W.row] ?? ""))
				});
				return j ? se(r, j) : r;
			})(),
			Wt && $.kind === "data" && (() => {
				let e = q[Q], t = /* @__PURE__ */ v("div", {
					ref: K,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": A("dataGrid.editCell", { column: $.column.header }),
					tabIndex: -1,
					className: c("mtc-popover mtc-data-grid-overlay-editor", k && `mtc-density-${k}`),
					onKeyDown: (e) => {
						(e.key === "Escape" || e.key === "Tab") && (e.stopPropagation(), s(e, K, !0, () => St.current?.()));
					},
					children: rn($.column, e, Q, R.has(J[Q] ?? ""), !0)
				});
				return j ? se(t, j) : t;
			})(),
			U && cn !== void 0 && w && (() => {
				let e = /* @__PURE__ */ v("div", {
					ref: ot,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ v(ie, {
						label: A("dataGrid.rowActions", { label: Pt(cn) }),
						items: w(cn),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: U.x,
							top: U.y
						},
						onClose: Zt
					})
				});
				return j ? se(e, j) : e;
			})()
		]
	});
}
//#endregion
export { Ne as t };
