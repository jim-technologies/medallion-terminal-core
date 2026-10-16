import { D as e, E as t, T as n, g as r, n as i, w as a } from "./States-CiMJksHr.js";
import { n as o, r as s, t as c } from "./utils-8rNbW-NI.js";
import { i as ee, r as te } from "./types-Cx03_LqM.js";
import { b as l } from "./sourceError-CbVcdlUG.js";
import { a as u, i as ne, n as d, o as f, r as re, t as ie } from "./PropertyValue-WOZq0oSP.js";
import { n as ae, s as oe, u as se } from "./ScrollRestoration-CddgFXf-.js";
import { useCallback as ce, useEffect as p, useLayoutEffect as m, useMemo as h, useRef as g, useState as _ } from "react";
import { jsx as v, jsxs as le } from "react/jsx-runtime";
import { createPortal as ue } from "react-dom";
//#region src/workbench/dataGridModel.ts
function y(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function de(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = y(t, e);
		return {
			row: e,
			index: n,
			key: t.sortValue ? t.sortValue(e) : u(i, f(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return d(e.key, t.key) || e.index - t.index;
		let r = d(e.key, t.key);
		return (n === "ascending" ? r : -r) || e.index - t.index;
	}), i.map((e) => e.row);
}
function fe(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function pe(e, t, n, r, i, a) {
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
function me(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function he(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function ge(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
function _e(e, t) {
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
//#region src/workbench/gridPreferences.ts
var ve = "mtc:grid-widths:v1";
function b() {
	try {
		let e = JSON.parse(sessionStorage.getItem(ve) ?? "[]");
		return Array.isArray(e) ? e.filter((e) => Array.isArray(e) && e.length === 2 && typeof e[0] == "string" && e[1] !== null && typeof e[1] == "object" && !Array.isArray(e[1]) && Object.keys(e[1]).length <= 1e3 && Object.values(e[1]).every((e) => typeof e == "number" && Number.isFinite(e) && e > 0)).slice(-100) : [];
	} catch {
		return [];
	}
}
function ye(e) {
	return !e || typeof window > "u" ? Object.create(null) : Object.assign(Object.create(null), b().find(([t]) => t === e)?.[1]);
}
function be(e, t) {
	if (e && typeof window < "u") try {
		let n = b().filter(([t]) => t !== e);
		n.push([e, Object.fromEntries(Object.entries(t).slice(-1e3))]), sessionStorage.setItem(ve, JSON.stringify(n.slice(-100)));
	} catch {}
}
//#endregion
//#region src/workbench/DataGrid.tsx
var xe = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, Se = 160, Ce = 360, we = 72, Te = 96, Ee = 48, De = 20, Oe = 40, ke = 16, Ae = 320, x = 8, je = 8, Me = 160, S = /* @__PURE__ */ new Set([
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
function Ne(e, t) {
	return e.align === "end" ? !1 : e.cell && !e.kind && !e.format ? !0 : !S.has(f(t, e.kind, e.format).kind);
}
function Pe(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) if (t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).overflowX !== "visible") return !0;
	return !1;
}
function Fe(e) {
	return (e.innerText ?? e.textContent ?? "").split("\n").map((e) => e.trim()).filter(Boolean).join(", ");
}
function Ie(e) {
	try {
		return e.matches(":focus-visible");
	} catch {
		return !1;
	}
}
function Le(e) {
	return e instanceof Element && e.closest("[data-editing=\"true\"]") !== null;
}
function Re(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function ze(e) {
	let t = e.currentTarget.ownerDocument.getSelection();
	return e.detail > 0 && te(e) && t !== null && !t.isCollapsed && e.currentTarget.contains(t.anchorNode) && e.currentTarget.contains(t.focusNode);
}
function Be({ label: te, columns: u, rows: d, rowKey: ve, rowLabel: b, selection: S = "none", selectedKeys: Be, defaultSelectedKeys: Ve, onSelectionChange: He, sort: Ue, defaultSort: We = null, onSortChange: Ge, sortMode: Ke = "client", onRowActivate: qe, rowHref: Je, onNavigate: Ye, contextActions: C, onCellEdit: Xe, editingCell: w, onEditCancel: Ze, onEndReached: Qe, totalRows: T, loading: E = !1, empty: $e, scrollKey: et, stateKey: D, density: O, rowHeight: tt, height: nt = "100%", virtualize: rt = "auto", overscan: it = 8, footer: at, rowProps: ot, className: st }) {
	let k = t(), { locale: ct, timeZone: lt } = n(), ut = a(), A = e(), dt = O ?? ut?.density ?? "standard", j = tt ?? xe[dt], ft = g(null), M = g(null), pt = g(null), mt = g(!1), ht = g(!1), N = g(null), gt = g(-1), [_t, vt] = _(We), P = Ue === void 0 ? _t : Ue, [yt, bt] = _(Ve ?? []), F = Be ?? yt, I = h(() => new Set(F), [F]), [L, xt] = _(() => Object.create(null)), R = g(L);
	R.current = L, m(() => {
		let e = ye(D);
		R.current = e, xt(e);
	}, [D]);
	let [z, St] = _({}), Ct = g(z);
	Ct.current = z;
	let wt = g(null), [Tt, Et] = _(0), [B, V] = _(() => ({
		row: d.length > 0 ? 0 : -1,
		column: +(S === "multi")
	})), [H, U] = _({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [Dt, Ot] = _(!1), [W, kt] = _(null), [G, K] = _(null), At = g(null), jt = g(null), Mt = g(Ze);
	Mt.current = Ze;
	let q = h(() => Ke !== "client" || !P ? d : de(d, u.find((e) => e.id === P.columnId), P.direction, ct), [
		d,
		u,
		P,
		Ke,
		ct
	]), J = h(() => q.map((e, t) => ve(e, t)), [q, ve]), Nt = q[0], Y = h(() => {
		let e = [...S === "multi" ? [{
			kind: "select",
			width: Oe
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && L[e.id] === void 0,
			width: L[e.id] ?? e.width ?? z[e.id] ?? Se
		}))], t = (u.find((e) => e.primary) ?? u[0])?.id, n = _e(e.map((e) => {
			if (e.kind === "select") return {
				width: e.width,
				min: e.width,
				shrink: !1
			};
			let n = e.column.id === t;
			return {
				width: e.width,
				min: Math.min(e.width, e.column.minWidth ?? (n ? Te : we)),
				shrink: e.contentSized && Ne(e.column, Nt === void 0 ? void 0 : y(e.column, Nt)),
				tier: +!!n
			};
		}), H.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		S,
		L,
		z,
		H.width,
		Nt
	]), Pt = h(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : Y.length - 1;
	}, [Y]), Ft = Y.map((e, t) => t === Pt ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), It = Y.reduce((e, t) => e + t.width, 0), Lt = h(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of Y.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return Y.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [Y]), Rt = h(() => {
		let e = Y.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : Y.findIndex((e) => e.kind === "data");
	}, [Y]), zt = rt === "auto" ? q.length > 200 : rt, X = pe(q.length, H.scrollTop, H.height, j, it, zt), Bt = E && q.length === 0, Vt = !E && q.length === 0 && $e !== null, Ht = Bt ? je : E && q.length > 0 ? 1 : 0, Ut = Vt ? Me : (q.length + Ht) * j, Wt = ce((e) => {
		if (b) return b(e);
		let t = u[0];
		if (!t) return "";
		let n = y(t, e);
		return re(n, f(n, t.kind, t.format), {
			locale: ct,
			timeZone: lt
		});
	}, [
		b,
		u,
		ct,
		lt
	]), Z = ce((e) => {
		Be === void 0 && bt(e), He?.(e);
	}, [Be, He]), Gt = (e) => {
		let t = fe(P, e);
		Ue === void 0 && vt(t), Ge?.(t);
	};
	m(() => {
		let e = M.current;
		e && et !== void 0 && (e.scrollTop = 0, U((e) => e.scrollTop === 0 ? e : {
			...e,
			scrollTop: 0
		}));
	}, [et]), ae(M, `grid:${JSON.stringify([D ?? te, et ?? null])}`, () => {
		let e = M.current;
		e && U({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	}), m(() => {
		let e = M.current;
		if (!e) return;
		let t = () => {
			Ot(e.scrollHeight > e.clientHeight), U((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
				scrollTop: e.scrollTop,
				height: e.clientHeight,
				width: e.clientWidth
			});
		};
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, [Ut]);
	let Kt = Y.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	m(() => {
		let e = ft.current, t = M.current;
		if (!e || !t || !Kt.includes("*")) return;
		let n = wt.current, r = !n || n.rows !== d || n.columns !== u || n.key !== Kt || n.fonts !== Tt;
		wt.current = {
			rows: d,
			columns: u,
			key: Kt,
			fonts: Tt
		}, e.dataset.measuring = "true";
		let i = Ct.current, a = {};
		Y.forEach((e, n) => {
			if (e.kind !== "data" || !e.contentSized) return;
			let o = 0;
			for (let r of t.querySelectorAll(`[aria-colindex="${n + 1}"]`)) {
				let t = r.getAttribute("role") === "columnheader", n = r.getAttribute("aria-sort") === "ascending" || r.getAttribute("aria-sort") === "descending", i = t && e.column.sortable !== !1 && !n ? De : 0;
				o = Math.max(o, r.getBoundingClientRect().width + i);
			}
			if (o <= 0) {
				i[e.column.id] !== void 0 && (a[e.column.id] = i[e.column.id]);
				return;
			}
			let s = Math.min(Ce, Math.ceil(o));
			a[e.column.id] = r ? s : Math.max(s, i[e.column.id] ?? 0);
		}), delete e.dataset.measuring;
		let o = Object.keys(a);
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && St(a);
	}, [
		d,
		u,
		q,
		Kt,
		X.start,
		X.end,
		Tt,
		Y
	]), p(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => Et((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let qt = (e) => (e - Math.max(1, Math.floor(it / 2))) * j, Jt = H.scrollTop + H.height >= qt(q.length), Yt = () => {
		let e = M.current;
		if (!e) return;
		if (G) {
			let t = e.querySelector(`[data-cell="${G.row}:${G.column}"]`), n = t?.getBoundingClientRect(), r = e.getBoundingClientRect();
			!t || document.activeElement !== t || !n || n.bottom <= Math.max(0, r.top) || n.top >= Math.min(innerHeight, r.bottom) || n.right <= r.left || n.left >= r.right ? K(null) : K((e) => e?.row === G.row && e.column === G.column ? {
				...e,
				left: n.left,
				top: n.top,
				width: n.width,
				height: n.height
			} : e);
		}
		let t = pe(q.length, e.scrollTop, e.clientHeight, j, it, zt), n = e.scrollTop + e.clientHeight >= qt(q.length);
		(t.start !== X.start || t.end !== X.end || Qe && n !== Jt) && U({
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
		if (!mt.current) return;
		mt.current = !1;
		let e = M.current, t = e?.querySelector(`[data-cell="${B.row}:${B.column}"]`);
		if (!e || !t) return;
		if (t.focus({ preventScroll: !0 }), ht.current) {
			ht.current = !1;
			let n = e.parentElement;
			for (; n && !(n.scrollHeight > n.clientHeight && /auto|scroll|overlay/.test(getComputedStyle(n).overflowY));) n = n.parentElement;
			if (n ??= document.scrollingElement, n) {
				let e = t.getBoundingClientRect(), r = n.getBoundingClientRect(), i = n === document.scrollingElement ? 0 : Math.max(0, r.top + n.clientTop), a = n === document.scrollingElement ? document.documentElement.clientHeight : Math.min(document.documentElement.clientHeight, r.top + n.clientTop + n.clientHeight);
				e.top < i ? n.scrollTop += e.top - i : e.bottom > a && (n.scrollTop += e.bottom - a);
			}
		}
		if (Lt.has(B.column)) return;
		let n = [...Lt].reduce((e, [t, n]) => Math.max(e, n + Y[t].width), 0), r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = r.left + n, o = r.left + e.clientWidth;
		i.right > o ? e.scrollLeft += i.right - o : i.left < a && i.right < o && (e.scrollLeft -= a - i.left);
	});
	let Xt = w ? `${w.rowKey}\u0000${w.columnId}` : null, Zt = g(Xt);
	p(() => {
		let e = Zt.current !== null && Xt === null;
		if (Zt.current = Xt, !e) return;
		let t = document.activeElement;
		(!t || t === document.body || M.current?.contains(t)) && M.current?.querySelector(`[data-cell="${B.row}:${B.column}"]`)?.focus({ preventScroll: !0 });
	}, [
		Xt,
		B.row,
		B.column
	]);
	let Qt = w?.layout === "overlay" ? w : null, Q = Qt ? J.indexOf(Qt.rowKey) : -1, $t = Qt ? Y.findIndex((e) => e.kind === "data" && e.column.id === Qt.columnId) : -1, $ = Y[$t], en = Q >= 0 && $?.kind === "data" && $.column.cell !== void 0, tn = () => {
		let e = jt.current;
		if (!en || !e) return;
		let t = M.current?.querySelector(`[data-cell="${Q}:${$t}"]`);
		if (!t) return;
		let n = t.getBoundingClientRect(), r = document.documentElement.clientWidth - x, i = document.documentElement.clientHeight - x, a = Math.min(Math.max(n.width, Ae), r - x);
		e.style.width = `${a}px`, e.style.left = `${Math.max(x, Math.min(n.left, r - a))}px`, e.style.top = `${Math.max(x, Math.min(n.top, i - e.offsetHeight))}px`;
	}, nn = g(tn);
	nn.current = tn, m(() => nn.current()), p(() => {
		let e = jt.current;
		if (!en || !e) return;
		e.contains(document.activeElement) || (o(e)[0] ?? e).focus();
		let t = () => nn.current(), n = (t) => {
			e.contains(t.target) || Mt.current?.();
		};
		window.addEventListener("resize", t), document.addEventListener("scroll", t, !0), document.addEventListener("pointerdown", n);
		let r = typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(t);
		return r?.observe(e), () => {
			window.removeEventListener("resize", t), document.removeEventListener("scroll", t, !0), document.removeEventListener("pointerdown", n), r?.disconnect();
		};
	}, [
		en,
		Q,
		$t,
		A
	]), p(() => {
		if (!Qe || H.height <= 0 || E || q.length === 0 || T !== void 0 && q.length >= T || !Jt || gt.current === q.length) return;
		let e = M.current;
		if (!e || e.clientHeight <= 0) return;
		let t = e.style.flexBasis, n = e.clientHeight;
		e.style.flexBasis = `${e.scrollHeight + n}px`;
		let r = e.clientHeight <= n;
		e.style.flexBasis = t, r && (gt.current = q.length, Qe());
	}, [
		Qe,
		H.height,
		E,
		q.length,
		T,
		Jt
	]);
	let rn = (e) => {
		let t = M.current;
		if (t && e.row >= 0) {
			let n = me(e.row, t.scrollTop, t.clientHeight, j, j);
			n !== t.scrollTop && (t.scrollTop = n, U({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		mt.current = !0, ht.current = !0, V(e);
	}, an = (e, t) => {
		if (S === "single") {
			Z([e]), N.current = e;
			return;
		}
		if (S === "multi") {
			if (t && N.current) {
				Z([.../* @__PURE__ */ new Set([...F, ...he(J, N.current, e)])]);
				return;
			}
			Z(I.has(e) ? F.filter((t) => t !== e) : [...F, e]), N.current = e;
		}
	}, on = (e) => {
		let t = q[e];
		if (t !== void 0) {
			if (qe) {
				qe(t);
				return;
			}
			M.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, sn = (e, t, n) => {
		let r = q[e];
		r !== void 0 && C && C(r).length !== 0 && kt({
			rowIndex: e,
			x: t,
			y: n
		});
	}, cn = ce(() => {
		kt(null), mt.current = !0;
	}, []);
	se(W !== null, pt, cn);
	let ln = (e, t) => M.current?.querySelector(`[data-cell="-1:${e}"]`)?.getBoundingClientRect().width ?? t, un = (e, t) => {
		let n = Y[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? Ee, ln(e, n.width) + t), i = {
			...R.current,
			[n.column.id]: r
		};
		R.current = i, xt(i), be(D, i);
	}, dn = (e) => {
		if (Le(e.target)) {
			e.key === "Escape" && !e.defaultPrevented && (e.preventDefault(), Ze?.());
			return;
		}
		if (Re(e.target) || W) return;
		if (e.key === "Escape" && G) {
			e.stopPropagation(), K(null);
			return;
		}
		let { row: t, column: n } = B, r = q.length, i = Math.max(1, Math.floor((M.current?.clientHeight ?? j * 10) / j) - 1), a = Y[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), un(n, e.key === "ArrowRight" ? ke : -16);
			return;
		}
		let o = ge(B, e.key, {
			rowCount: r,
			columnCount: Y.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && S === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = J[o.row];
				e && (N.current ||= J[Math.max(0, t)] ?? e, Z([.../* @__PURE__ */ new Set([...F, ...he(J, N.current, e)])]));
			}
			rn(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), Gt(a.column.id)) : e.key === " " && a?.kind === "select" && S === "multi" && (e.preventDefault(), Z(F.length === J.length ? [] : [...J]));
			return;
		}
		let s = J[t];
		if (e.key === "Enter") e.preventDefault(), on(t);
		else if (e.key === " " && s) e.preventDefault(), an(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && S === "multi") e.preventDefault(), Z([...J]);
		else if (e.key === "F2" && Xe && a?.kind === "data") {
			e.preventDefault();
			let n = q[t];
			n !== void 0 && Xe(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			sn(t, n.left + 12, n.bottom);
		}
	}, fn = (e, t) => {
		let n = J[t];
		n && S !== "none" && !ze(e) && (e.target.closest("a, button, input, select, textarea") || (S === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? an(n, e.shiftKey) : (Z([n]), N.current = n)));
	}, pn = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = Y[t];
		if (!r || r.kind !== "data") return;
		let i = ln(t, r.width), a = r.column.minWidth ?? Ee, o = r.column.id, s = (e) => {
			let t = {
				...R.current,
				[o]: Math.max(a, i + e.clientX - n)
			};
			R.current = t, xt(t);
		}, c = () => {
			be(D, R.current), document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, mn = (e, t) => {
		let n = B.row === e && B.column === t, r = Lt.get(t), i = Y[t];
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
				if (i?.kind === "data" && Ie(a) && Pe(a)) {
					let n = a.getBoundingClientRect();
					K({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height,
						text: Fe(a)
					});
				} else K(null);
			},
			onBlur: () => K(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				Pe(t) ? t.title = Fe(t) : t.removeAttribute("title");
			}
		};
	};
	m(() => {
		let e = At.current;
		if (!e || !G) return;
		let t = document.documentElement.clientWidth - 8, n = G.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? G.left - n : G.left)}px`, e.style.top = `${Math.max(8, Math.min(G.top, document.documentElement.clientHeight - 8 - e.offsetHeight))}px`;
	}, [G]);
	let hn = (e, t, n, r, i = !1) => {
		let a = {
			value: y(e, t),
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
		}) : /* @__PURE__ */ v(ie, {
			value: a.value,
			kind: e.kind,
			format: e.format,
			tones: e.tones,
			context: "grid"
		});
	}, gn = [];
	for (let e = X.start; e < X.end; e++) gn.push(e);
	B.row >= 0 && B.row < q.length && (B.row < X.start || B.row >= X.end) && gn.push(B.row);
	let _n = S === "multi" && J.length > 0 && J.every((e) => I.has(e)), vn = S === "multi" && !_n && J.some((e) => I.has(e)), yn = W ? q[W.rowIndex] : void 0, bn = {
		"--mtc-grid-template": Ft,
		"--mtc-grid-min-width": `${It}px`,
		"--mtc-grid-row-height": `${j}px`,
		"--mtc-grid-viewport-width": H.width > 0 ? `${H.width}px` : "100%"
	};
	return /* @__PURE__ */ le("div", {
		ref: ft,
		className: c("mtc-data-grid", O && `mtc-density-${O}`, st),
		style: {
			...bn,
			height: nt
		},
		children: [
			/* @__PURE__ */ le("div", {
				ref: M,
				role: "grid",
				tabIndex: -1,
				"aria-label": te,
				"aria-rowcount": (T ?? q.length) + 1,
				"aria-colcount": Y.length,
				"aria-multiselectable": S === "multi" || void 0,
				"aria-busy": E || void 0,
				className: "mtc-data-grid-viewport",
				"data-scrollable-y": Dt || void 0,
				onKeyDown: dn,
				onScroll: Yt,
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
								...mn(-1, t),
								children: /* @__PURE__ */ v("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": k("dataGrid.selectAll"),
									checked: _n,
									ref: (e) => {
										e && (e.indeterminate = vn);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Z(_n ? [] : [...J])
								})
							}, "__select");
							let { column: n } = e, i = P?.columnId === n.id ? P.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ne(f(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ le("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...mn(-1, t),
								onClick: o ? () => {
									Gt(n.id), V({
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
										onPointerDown: (e) => pn(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ le("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Ut },
					children: [
						gn.map((e) => {
							let t = q[e], n = J[e], r = I.has(n), i = Je?.(t);
							return /* @__PURE__ */ v("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": S === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * j },
								...ot?.(t),
								onClick: (t) => fn(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									Xe && i ? Xe(t, i) : on(e);
								},
								onContextMenu: C ? (t) => {
									t.preventDefault(), S !== "none" && !r && Z([n]), V({
										row: e,
										column: B.column
									}), sn(e, t.clientX, t.clientY);
								} : void 0,
								children: Y.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...mn(e, o),
										children: /* @__PURE__ */ v("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": k("dataGrid.selectRow", { label: Wt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => an(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = f(y(s, t), s.kind, s.format), te = s.align === "end" || !s.align && !s.cell && ne(c.kind), l = w?.rowKey === n && w.columnId === s.id && w.layout !== "overlay", u = hn(s, t, e, r, l), d = mn(e, o);
									return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": s.id,
										"data-align": te ? "end" : "start",
										...d,
										"data-editing": l || void 0,
										tabIndex: l ? void 0 : d.tabIndex,
										onPointerEnter: l ? void 0 : d.onPointerEnter,
										children: i && o === Rt && !l ? /* @__PURE__ */ v("a", {
											href: i,
											draggable: !1,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: (e) => {
												if (ze(e)) {
													e.preventDefault();
													return;
												}
												ee(Ye ? (e) => Ye(t, e) : void 0)?.(e);
											},
											children: u
										}) : u
									}, s.id);
								})
							}, n);
						}),
						Bt && Array.from({ length: je }, (e, t) => /* @__PURE__ */ v("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * j },
							children: Y.map((e, n) => /* @__PURE__ */ v("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ v(l, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Bt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								children: k("dataGrid.loading")
							})
						}),
						E && q.length > 0 && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: q.length * j },
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: k("dataGrid.loadingMore")
							})
						}),
						Vt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Me
							},
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": Y.length,
								className: "mtc-data-grid-cell",
								children: $e ?? /* @__PURE__ */ v(i, {
									compact: !0,
									title: k("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			at && /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-footer",
				children: at
			}),
			G && (() => {
				let e = Y[G.column], t = G.row >= 0 ? q[G.row] : void 0;
				if (e?.kind !== "data" || G.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ne(f(t === void 0 ? void 0 : y(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ v("div", {
					ref: At,
					"aria-hidden": "true",
					inert: !0,
					className: c("mtc-data-grid-value-tip", O && `mtc-density-${O}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					"data-mono": e.column.kind === "id" || e.column.kind === "code" || void 0,
					style: {
						left: G.left,
						top: G.top,
						minWidth: `min(${G.width}px, calc(100vw - 16px))`,
						minHeight: G.height
					},
					children: G.text
				});
				return A ? ue(r, A) : r;
			})(),
			en && $.kind === "data" && (() => {
				let e = q[Q], t = /* @__PURE__ */ v("div", {
					ref: jt,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": k("dataGrid.editCell", { column: $.column.header }),
					tabIndex: -1,
					className: c("mtc-popover mtc-data-grid-overlay-editor", O && `mtc-density-${O}`),
					onKeyDown: (e) => {
						(e.key === "Escape" || e.key === "Tab") && (e.stopPropagation(), s(e, jt, !0, () => Mt.current?.()));
					},
					children: hn($.column, e, Q, I.has(J[Q] ?? ""), !0)
				});
				return A ? ue(t, A) : t;
			})(),
			W && yn !== void 0 && C && (() => {
				let e = /* @__PURE__ */ v("div", {
					ref: pt,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ v(oe, {
						label: k("dataGrid.rowActions", { label: Wt(yn) }),
						items: C(yn),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: W.x,
							top: W.y
						},
						onClose: cn
					})
				});
				return A ? ue(e, A) : e;
			})()
		]
	});
}
//#endregion
export { Be as t };
