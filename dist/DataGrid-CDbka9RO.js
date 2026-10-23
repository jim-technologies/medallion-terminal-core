import { D as e, E as t, T as n, g as r, n as i, w as a } from "./States-9MUuKqo7.js";
import { n as o, r as s, t as c } from "./utils-lOoEiIAx.js";
import { i as ee, r as te } from "./types-BsWMEPD5.js";
import { b as l } from "./sourceError-Z6tApgGs.js";
import { a as u, i as ne, n as d, o as f, r as re, t as ie } from "./PropertyValue-CBz43wpI.js";
import { n as ae, s as oe, u as se } from "./ScrollRestoration-DNZ0AOnD.js";
import { useCallback as ce, useEffect as p, useLayoutEffect as m, useMemo as h, useRef as g, useState as _ } from "react";
import { jsx as v, jsxs as le } from "react/jsx-runtime";
import { createPortal as ue } from "react-dom";
// src/workbench/dataGridModel.ts
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
// src/workbench/gridPreferences.ts
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
// src/workbench/DataGrid.tsx
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
function Be({ label: te, columns: u, rows: d, rowKey: ve, rowLabel: b, selection: S = "none", selectedKeys: Be, defaultSelectedKeys: Ve, onSelectionChange: He, sort: Ue, defaultSort: We = null, onSortChange: Ge, sortMode: Ke = "client", onRowActivate: qe, rowHref: Je, onNavigate: Ye, contextActions: C, onCellEdit: Xe, editingCell: w, onEditCancel: Ze, onEndReached: Qe, pagingKey: $e, totalRows: et, loading: T = !1, empty: tt, scrollKey: E, stateKey: D, density: O, rowHeight: nt, height: rt = "100%", virtualize: it = "auto", overscan: at = 8, footer: ot, rowProps: st, className: ct }) {
	let k = t(), { locale: lt, timeZone: ut } = n(), dt = a(), A = e(), ft = O ?? dt?.density ?? "standard", j = nt ?? xe[ft], pt = g(null), M = g(null), mt = g(null), ht = g(!1), gt = g(!1), N = g(null), _t = g(null), [vt, yt] = _(We), P = Ue === void 0 ? vt : Ue, [bt, xt] = _(Ve ?? []), F = Be ?? bt, I = h(() => new Set(F), [F]), [L, St] = _(() => Object.create(null)), R = g(L);
	R.current = L, m(() => {
		let e = ye(D);
		R.current = e, St(e);
	}, [D]);
	let [Ct, wt] = _({}), Tt = g(Ct);
	Tt.current = Ct;
	let Et = g(null), [Dt, Ot] = _(0), [z, B] = _(() => ({
		row: d.length > 0 ? 0 : -1,
		column: +(S === "multi")
	})), [V, H] = _({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [kt, At] = _(!1), [U, jt] = _(null), [W, G] = _(null), Mt = g(null), Nt = g(null), Pt = g(Ze);
	Pt.current = Ze;
	let K = h(() => Ke !== "client" || !P ? d : de(d, u.find((e) => e.id === P.columnId), P.direction, lt), [
		d,
		u,
		P,
		Ke,
		lt
	]), q = h(() => K.map((e, t) => ve(e, t)), [K, ve]), Ft = K[0], J = h(() => {
		let e = [...S === "multi" ? [{
			kind: "select",
			width: Oe
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && L[e.id] === void 0,
			width: L[e.id] ?? e.width ?? Ct[e.id] ?? Se
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
				shrink: e.contentSized && Ne(e.column, Ft === void 0 ? void 0 : y(e.column, Ft)),
				tier: +!!n
			};
		}), V.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		S,
		L,
		Ct,
		V.width,
		Ft
	]), It = h(() => {
		let e = J.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : J.length - 1;
	}, [J]), Lt = J.map((e, t) => t === It ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Rt = J.reduce((e, t) => e + t.width, 0), zt = h(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of J.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return J.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [J]), Bt = h(() => {
		let e = J.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : J.findIndex((e) => e.kind === "data");
	}, [J]), Vt = it === "auto" ? K.length > 200 : it, Y = pe(K.length, V.scrollTop, V.height, j, at, Vt), Ht = T && K.length === 0, Ut = !T && K.length === 0 && tt !== null, Wt = Ht ? je : T && K.length > 0 ? 1 : 0, Gt = Ut ? Me : (K.length + Wt) * j, Kt = ce((e) => {
		if (b) return b(e);
		let t = u[0];
		if (!t) return "";
		let n = y(t, e);
		return re(n, f(n, t.kind, t.format), {
			locale: lt,
			timeZone: ut
		});
	}, [
		b,
		u,
		lt,
		ut
	]), X = ce((e) => {
		Be === void 0 && xt(e), He?.(e);
	}, [Be, He]), qt = (e) => {
		let t = fe(P, e);
		Ue === void 0 && yt(t), Ge?.(t);
	};
	m(() => {
		let e = M.current;
		e && E !== void 0 && (e.scrollTop = 0, H((e) => e.scrollTop === 0 ? e : {
			...e,
			scrollTop: 0
		}));
	}, [E]), ae(M, `grid:${JSON.stringify([D ?? te, E ?? null])}`, () => {
		let e = M.current;
		e && H({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	}), m(() => {
		let e = M.current;
		if (!e) return;
		let t = () => {
			At(e.scrollHeight > e.clientHeight), H((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
				scrollTop: e.scrollTop,
				height: e.clientHeight,
				width: e.clientWidth
			});
		};
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, [Gt]);
	let Jt = J.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	m(() => {
		let e = pt.current, t = M.current;
		if (!e || !t || !Jt.includes("*")) return;
		let n = Et.current, r = !n || n.rows !== d || n.columns !== u || n.key !== Jt || n.fonts !== Dt;
		Et.current = {
			rows: d,
			columns: u,
			key: Jt,
			fonts: Dt
		}, e.dataset.measuring = "true";
		let i = Tt.current, a = {};
		J.forEach((e, n) => {
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
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && wt(a);
	}, [
		d,
		u,
		K,
		Jt,
		Y.start,
		Y.end,
		Dt,
		J
	]), p(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => Ot((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let Yt = (e) => (e - Math.max(1, Math.floor(at / 2))) * j, Xt = V.scrollTop + V.height >= Yt(K.length), Z = ce(() => G((e) => {
		let t = e && M.current?.querySelector(`[data-cell="${e.row}:${e.column}"]`);
		if (!e || !t || document.activeElement !== t) return null;
		let { left: n, top: r, width: i, height: a } = t.getBoundingClientRect();
		return t.contains(document.elementFromPoint(n + i / 2, r + a / 2)) ? n === e.left && r === e.top && i === e.width && a === e.height ? e : {
			...e,
			left: n,
			top: r,
			width: i,
			height: a
		} : null;
	}), []), Zt = W !== null;
	p(() => {
		if (!Zt) return;
		let e = {
			capture: !0,
			passive: !0
		};
		return document.addEventListener("scroll", Z, e), window.addEventListener("resize", Z, e), () => {
			document.removeEventListener("scroll", Z, e), window.removeEventListener("resize", Z, e);
		};
	}, [Zt, Z]);
	let Qt = () => {
		let e = M.current;
		if (!e) return;
		let t = pe(K.length, e.scrollTop, e.clientHeight, j, at, Vt), n = e.scrollTop + e.clientHeight >= Yt(K.length);
		(t.start !== Y.start || t.end !== Y.end || Qe && n !== Xt) && H({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	p(() => {
		B((e) => {
			let t = e.row < 0 || K.length === 0 ? -1 : Math.min(e.row, K.length - 1), n = Math.max(0, Math.min(e.column, J.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [K.length, J.length]), m(() => {
		if (!ht.current) return;
		ht.current = !1;
		let e = M.current, t = e?.querySelector(`[data-cell="${z.row}:${z.column}"]`);
		if (e && t) {
			if (t.focus({ preventScroll: !0 }), gt.current) {
				gt.current = !1;
				let n = e.parentElement;
				for (; n && !(n.scrollHeight > n.clientHeight && /auto|scroll|overlay/.test(getComputedStyle(n).overflowY));) n = n.parentElement;
				if (n ??= document.scrollingElement, n) {
					let e = t.getBoundingClientRect(), r = n.getBoundingClientRect(), i = n === document.scrollingElement ? 0 : Math.max(0, r.top + n.clientTop), a = n === document.scrollingElement ? document.documentElement.clientHeight : Math.min(document.documentElement.clientHeight, r.top + n.clientTop + n.clientHeight);
					e.top < i ? n.scrollTop += Math.floor(e.top - i) : e.bottom > a && (n.scrollTop += Math.ceil(e.bottom - a));
				}
			}
			if (!zt.has(z.column)) {
				let n = [...zt].reduce((e, [t, n]) => Math.max(e, n + J[t].width), 0), r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = r.left + n, o = r.left + e.clientWidth;
				i.right > o ? e.scrollLeft += i.right - o : i.left < a && i.right < o && (e.scrollLeft -= a - i.left);
			}
			Z();
		}
	});
	let $t = w ? `${w.rowKey}\u0000${w.columnId}` : null, en = g($t);
	p(() => {
		let e = en.current !== null && $t === null;
		if (en.current = $t, !e) return;
		let t = document.activeElement;
		(!t || t === document.body || M.current?.contains(t)) && M.current?.querySelector(`[data-cell="${z.row}:${z.column}"]`)?.focus({ preventScroll: !0 });
	}, [
		$t,
		z.row,
		z.column
	]);
	let tn = w?.layout === "overlay" ? w : null, Q = tn ? q.indexOf(tn.rowKey) : -1, nn = tn ? J.findIndex((e) => e.kind === "data" && e.column.id === tn.columnId) : -1, $ = J[nn], rn = Q >= 0 && $?.kind === "data" && $.column.cell !== void 0, an = () => {
		let e = Nt.current;
		if (!rn || !e) return;
		let t = M.current?.querySelector(`[data-cell="${Q}:${nn}"]`);
		if (!t) return;
		let n = t.getBoundingClientRect(), r = document.documentElement.clientWidth - x, i = document.documentElement.clientHeight - x, a = Math.min(Math.max(n.width, Ae), r - x);
		e.style.width = `${a}px`, e.style.left = `${Math.max(x, Math.min(n.left, r - a))}px`, e.style.top = `${Math.max(x, Math.min(n.top, i - e.offsetHeight))}px`;
	}, on = g(an);
	on.current = an, m(() => on.current()), p(() => {
		let e = Nt.current;
		if (!rn || !e) return;
		e.contains(document.activeElement) || (o(e)[0] ?? e).focus();
		let t = () => on.current(), n = (t) => {
			e.contains(t.target) || Pt.current?.();
		};
		window.addEventListener("resize", t), document.addEventListener("scroll", t, !0), document.addEventListener("pointerdown", n);
		let r = typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(t);
		return r?.observe(e), () => {
			window.removeEventListener("resize", t), document.removeEventListener("scroll", t, !0), document.removeEventListener("pointerdown", n), r?.disconnect();
		};
	}, [
		rn,
		Q,
		nn,
		A
	]), p(() => {
		let e = K.length;
		if (!Qe || V.height <= 0 || T || e === 0 || et !== void 0 && e >= et) return;
		let t = [
			E,
			$e,
			e
		];
		if (!Xt || _t.current?.every((e, n) => Object.is(e, t[n]))) return;
		let n = M.current;
		if (!n) return;
		let r = n.clientHeight;
		if (r <= 0 || n.scrollTop + r < Yt(e)) return;
		let i = n.style, a = i.cssText, o = !1;
		try {
			i.flexBasis = `${n.scrollHeight + r}px`, o = n.clientHeight <= r + 1;
		} finally {
			i.cssText = a;
		}
		o && (_t.current = t, Qe());
	}, [
		Qe,
		V.height,
		T,
		K.length,
		et,
		Xt,
		E,
		$e
	]);
	let sn = (e) => {
		let t = M.current;
		if (t && e.row >= 0) {
			let n = me(e.row, t.scrollTop, t.clientHeight, j, j);
			n !== t.scrollTop && (t.scrollTop = n, H({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		ht.current = !0, gt.current = !0, B(e);
	}, cn = (e, t) => {
		S === "single" ? (X([e]), N.current = e) : S === "multi" && (t && N.current ? X([.../* @__PURE__ */ new Set([...F, ...he(q, N.current, e)])]) : (X(I.has(e) ? F.filter((t) => t !== e) : [...F, e]), N.current = e));
	}, ln = (e) => {
		let t = K[e];
		t !== void 0 && (qe ? qe(t) : M.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click());
	}, un = (e, t, n) => {
		let r = K[e];
		r !== void 0 && C && C(r).length !== 0 && jt({
			rowIndex: e,
			x: t,
			y: n
		});
	}, dn = ce(() => {
		jt(null), ht.current = !0;
	}, []);
	se(U !== null, mt, dn);
	let fn = (e, t) => M.current?.querySelector(`[data-cell="-1:${e}"]`)?.getBoundingClientRect().width ?? t, pn = (e, t) => {
		let n = J[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? Ee, fn(e, n.width) + t), i = {
			...R.current,
			[n.column.id]: r
		};
		R.current = i, St(i), be(D, i);
	}, mn = (e) => {
		if (Le(e.target)) {
			e.key === "Escape" && !e.defaultPrevented && (e.preventDefault(), Ze?.());
			return;
		}
		if (Re(e.target) || U) return;
		if (e.key === "Escape" && W) {
			e.stopPropagation(), G(null);
			return;
		}
		let { row: t, column: n } = z, r = K.length, i = Math.max(1, Math.floor((M.current?.clientHeight ?? j * 10) / j) - 1), a = J[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), pn(n, e.key === "ArrowRight" ? ke : -16);
			return;
		}
		let o = ge(z, e.key, {
			rowCount: r,
			columnCount: J.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && S === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = q[o.row];
				e && (N.current ||= q[Math.max(0, t)] ?? e, X([.../* @__PURE__ */ new Set([...F, ...he(q, N.current, e)])]));
			}
			sn(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), qt(a.column.id)) : e.key === " " && a?.kind === "select" && S === "multi" && (e.preventDefault(), X(F.length === q.length ? [] : [...q]));
			return;
		}
		let s = q[t];
		if (e.key === "Enter") e.preventDefault(), ln(t);
		else if (e.key === " " && s) e.preventDefault(), cn(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && S === "multi") e.preventDefault(), X([...q]);
		else if (e.key === "F2" && Xe && a?.kind === "data") {
			e.preventDefault();
			let n = K[t];
			n !== void 0 && Xe(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			un(t, n.left + 12, n.bottom);
		}
	}, hn = (e, t) => {
		let n = q[t];
		n && S !== "none" && !ze(e) && (e.target.closest("a, button, input, select, textarea") || (S === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? cn(n, e.shiftKey) : (X([n]), N.current = n)));
	}, gn = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = J[t];
		if (!r || r.kind !== "data") return;
		let i = fn(t, r.width), a = r.column.minWidth ?? Ee, o = r.column.id, s = (e) => {
			let t = {
				...R.current,
				[o]: Math.max(a, i + e.clientX - n)
			};
			R.current = t, St(t);
		}, c = () => {
			be(D, R.current), document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, _n = (e, t) => {
		let n = z.row === e && z.column === t, r = zt.get(t), i = J[t];
		return {
			"data-cell": `${e}:${t}`,
			"data-fit": i?.kind === "data" && i.contentSized ? "content" : void 0,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: (r) => {
				n || B({
					row: e,
					column: t
				});
				let a = r.currentTarget;
				if (i?.kind === "data" && Ie(a) && Pe(a)) {
					let n = a.getBoundingClientRect();
					G({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height,
						text: Fe(a)
					});
				} else G(null);
			},
			onBlur: () => G(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				Pe(t) ? t.title = Fe(t) : t.removeAttribute("title");
			}
		};
	};
	m(() => {
		let e = Mt.current;
		if (!e || !W) return;
		let t = document.documentElement.clientWidth - 8, n = W.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? W.left - n : W.left)}px`, e.style.top = `${Math.max(8, Math.min(W.top, document.documentElement.clientHeight - 8 - e.offsetHeight))}px`;
	}, [W]);
	let vn = (e, t, n, r, i = !1) => {
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
	}, yn = [];
	for (let e = Y.start; e < Y.end; e++) yn.push(e);
	z.row >= 0 && z.row < K.length && (z.row < Y.start || z.row >= Y.end) && yn.push(z.row);
	let bn = S === "multi" && q.length > 0 && q.every((e) => I.has(e)), xn = S === "multi" && !bn && q.some((e) => I.has(e)), Sn = U ? K[U.rowIndex] : void 0, Cn = {
		"--mtc-grid-template": Lt,
		"--mtc-grid-min-width": `${Rt}px`,
		"--mtc-grid-row-height": `${j}px`,
		"--mtc-grid-viewport-width": V.width > 0 ? `${V.width}px` : "100%"
	};
	return /* @__PURE__ */ le("div", {
		ref: pt,
		className: c("mtc-data-grid", O && `mtc-density-${O}`, ct),
		style: {
			...Cn,
			height: rt
		},
		children: [
			/* @__PURE__ */ le("div", {
				ref: M,
				role: "grid",
				tabIndex: -1,
				"aria-label": te,
				"aria-rowcount": (et ?? K.length) + 1,
				"aria-colcount": J.length,
				"aria-multiselectable": S === "multi" || void 0,
				"aria-busy": T || void 0,
				className: "mtc-data-grid-viewport",
				"data-scrollable-y": kt || void 0,
				onKeyDown: mn,
				onScroll: Qt,
				children: [/* @__PURE__ */ v("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ v("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: J.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ v("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								..._n(-1, t),
								children: /* @__PURE__ */ v("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": k("dataGrid.selectAll"),
									checked: bn,
									ref: (e) => {
										e && (e.indeterminate = xn);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => X(bn ? [] : [...q])
								})
							}, "__select");
							let { column: n } = e, i = P?.columnId === n.id ? P.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ne(f(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ le("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								..._n(-1, t),
								onClick: o ? () => {
									qt(n.id), B({
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
										onPointerDown: (e) => gn(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ le("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Gt },
					children: [
						yn.map((e) => {
							let t = K[e], n = q[e], r = I.has(n), i = Je?.(t);
							return /* @__PURE__ */ v("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": S === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * j },
								...st?.(t),
								onClick: (t) => hn(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									Xe && i ? Xe(t, i) : ln(e);
								},
								onContextMenu: C ? (t) => {
									t.preventDefault(), S !== "none" && !r && X([n]), B({
										row: e,
										column: z.column
									}), un(e, t.clientX, t.clientY);
								} : void 0,
								children: J.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										..._n(e, o),
										children: /* @__PURE__ */ v("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": k("dataGrid.selectRow", { label: Kt(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => cn(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = f(y(s, t), s.kind, s.format), te = s.align === "end" || !s.align && !s.cell && ne(c.kind), l = w?.rowKey === n && w.columnId === s.id && w.layout !== "overlay", u = vn(s, t, e, r, l), d = _n(e, o);
									return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": s.id,
										"data-align": te ? "end" : "start",
										...d,
										"data-editing": l || void 0,
										tabIndex: l ? void 0 : d.tabIndex,
										onPointerEnter: l ? void 0 : d.onPointerEnter,
										children: i && o === Bt && !l ? /* @__PURE__ */ v("a", {
											href: i,
											draggable: !1,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: (e) => {
												ze(e) ? e.preventDefault() : ee(Ye ? (e) => Ye(t, e) : void 0)?.(e);
											},
											children: u
										}) : u
									}, s.id);
								})
							}, n);
						}),
						Ht && Array.from({ length: je }, (e, t) => /* @__PURE__ */ v("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * j },
							children: J.map((e, n) => /* @__PURE__ */ v("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ v(l, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Ht && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								children: k("dataGrid.loading")
							})
						}),
						T && K.length > 0 && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: K.length * j },
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": J.length,
								className: "mtc-data-grid-cell",
								children: k("dataGrid.loadingMore")
							})
						}),
						Ut && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Me
							},
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": J.length,
								className: "mtc-data-grid-cell",
								children: tt ?? /* @__PURE__ */ v(i, {
									compact: !0,
									title: k("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			ot && /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-footer",
				children: ot
			}),
			W && (() => {
				let e = J[W.column], t = W.row >= 0 ? K[W.row] : void 0;
				if (e?.kind !== "data" || W.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ne(f(t === void 0 ? void 0 : y(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ v("div", {
					ref: Mt,
					"aria-hidden": "true",
					inert: !0,
					className: c("mtc-data-grid-value-tip", O && `mtc-density-${O}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					"data-mono": e.column.kind === "id" || e.column.kind === "code" || void 0,
					style: {
						left: W.left,
						top: W.top,
						minWidth: `min(${W.width}px, calc(100vw - 16px))`,
						minHeight: W.height
					},
					children: W.text
				});
				return A ? ue(r, A) : r;
			})(),
			rn && $.kind === "data" && (() => {
				let e = K[Q], t = /* @__PURE__ */ v("div", {
					ref: Nt,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": k("dataGrid.editCell", { column: $.column.header }),
					tabIndex: -1,
					className: c("mtc-popover mtc-data-grid-overlay-editor", O && `mtc-density-${O}`),
					onKeyDown: (e) => {
						(e.key === "Escape" || e.key === "Tab") && (e.stopPropagation(), s(e, Nt, !0, () => Pt.current?.()));
					},
					children: vn($.column, e, Q, I.has(q[Q] ?? ""), !0)
				});
				return A ? ue(t, A) : t;
			})(),
			U && Sn !== void 0 && C && (() => {
				let e = /* @__PURE__ */ v("div", {
					ref: mt,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ v(oe, {
						label: k("dataGrid.rowActions", { label: Kt(Sn) }),
						items: C(Sn),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: U.x,
							top: U.y
						},
						onClose: dn
					})
				});
				return A ? ue(e, A) : e;
			})()
		]
	});
}
export { Be as t };
