import { C as e, E as t, T as n, h as r, n as i, w as a } from "./States-BRpBuveA.js";
import { n as o, r as s, t as c } from "./utils-BfYGx7e_.js";
import { i as ee } from "./types-DZxjyhu_.js";
import { b as te } from "./sourceError-CTpw8oGk.js";
import { a as l, i as ne, n as u, o as d, r as f, t as re } from "./PropertyValue-pJrg2xQi.js";
import { a as ie, c as ae } from "./Overlays-BqanRm2f.js";
import { useCallback as oe, useEffect as p, useLayoutEffect as m, useMemo as h, useRef as g, useState as _ } from "react";
import { jsx as v, jsxs as se } from "react/jsx-runtime";
import { createPortal as ce } from "react-dom";
//#region src/workbench/dataGridModel.ts
function y(e, t) {
	return e.accessor ? e.accessor(t) : t && typeof t == "object" ? t[e.id] : void 0;
}
function le(e, t, n, r = "en") {
	if (!t) return e;
	let i = e.map((e, n) => {
		let i = y(t, e);
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
function ue(e, t) {
	return e?.columnId === t ? e.direction === "ascending" ? {
		columnId: t,
		direction: "descending"
	} : null : {
		columnId: t,
		direction: "ascending"
	};
}
function de(e, t, n, r, i, a) {
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
function fe(e, t, n, r, i) {
	let a = e * r, o = a + r, s = Math.max(r, n - i);
	return a < t ? a : o > t + s ? o - s : t;
}
function pe(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	if (r < 0 || i < 0) return [n];
	let [a, o] = r <= i ? [r, i] : [i, r];
	return e.slice(a, o + 1);
}
function me(e, t, { rowCount: n, columnCount: r, pageRows: i, ctrl: a }) {
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
function he(e, t) {
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
var ge = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, _e = 160, ve = 360, ye = 72, be = 96, xe = 48, Se = 20, Ce = 40, we = 16, Te = 320, b = 8, Ee = 8, De = 160, x = /* @__PURE__ */ new Set([
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
function Oe(e, t) {
	return e.align === "end" ? !1 : e.cell && !e.kind && !e.format ? !0 : !x.has(d(t, e.kind, e.format).kind);
}
function ke(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) if (t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).overflowX !== "visible") return !0;
	return !1;
}
function Ae(e) {
	return (e.innerText ?? e.textContent ?? "").split("\n").map((e) => e.trim()).filter(Boolean).join(", ");
}
function je(e) {
	try {
		return e.matches(":focus-visible");
	} catch {
		return !1;
	}
}
function Me(e) {
	return e instanceof Element && e.closest("[data-editing=\"true\"]") !== null;
}
function Ne(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function Pe({ label: l, columns: u, rows: x, rowKey: Pe, rowLabel: Fe, selection: S = "none", selectedKeys: Ie, defaultSelectedKeys: Le, onSelectionChange: Re, sort: ze, defaultSort: Be = null, onSortChange: Ve, sortMode: He = "client", onRowActivate: Ue, rowHref: We, onNavigate: Ge, contextActions: C, onCellEdit: Ke, editingCell: w, onEditCancel: qe, onEndReached: Je, totalRows: Ye, loading: T = !1, empty: Xe, density: E, rowHeight: Ze, height: Qe = "100%", virtualize: $e = "auto", overscan: et = 8, footer: tt, rowProps: nt, className: rt }) {
	let D = n(), { locale: O, timeZone: it } = a(), at = e(), k = t(), ot = E ?? at?.density ?? "standard", A = Ze ?? ge[ot], st = g(null), j = g(null), ct = g(null), M = g(!1), N = g(null), lt = g(-1), [ut, dt] = _(Be), P = ze === void 0 ? ut : ze, [ft, pt] = _(Le ?? []), F = Ie ?? ft, I = h(() => new Set(F), [F]), [mt, ht] = _({}), [L, gt] = _({}), _t = g(L);
	_t.current = L;
	let vt = g(null), [yt, bt] = _(0), [R, z] = _(() => ({
		row: x.length > 0 ? 0 : -1,
		column: +(S === "multi")
	})), [B, xt] = _({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [V, St] = _(null), [H, U] = _(null), Ct = g(null), W = g(null), wt = g(qe);
	wt.current = qe;
	let G = h(() => He !== "client" || !P ? x : le(x, u.find((e) => e.id === P.columnId), P.direction, O), [
		x,
		u,
		P,
		He,
		O
	]), K = h(() => G.map((e, t) => Pe(e, t)), [G, Pe]), Tt = G[0], q = h(() => {
		let e = [...S === "multi" ? [{
			kind: "select",
			width: Ce
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && mt[e.id] === void 0,
			width: mt[e.id] ?? e.width ?? L[e.id] ?? _e
		}))], t = (u.find((e) => e.primary) ?? u[0])?.id, n = he(e.map((e) => {
			if (e.kind === "select") return {
				width: e.width,
				min: e.width,
				shrink: !1
			};
			let n = e.column.id === t;
			return {
				width: e.width,
				min: Math.min(e.width, e.column.minWidth ?? (n ? be : ye)),
				shrink: e.contentSized && Oe(e.column, Tt === void 0 ? void 0 : y(e.column, Tt)),
				tier: +!!n
			};
		}), B.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		S,
		mt,
		L,
		B.width,
		Tt
	]), Et = h(() => {
		let e = q.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : q.length - 1;
	}, [q]), Dt = q.map((e, t) => t === Et ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Ot = q.reduce((e, t) => e + t.width, 0), kt = h(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of q.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return q.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [q]), At = h(() => {
		let e = q.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : q.findIndex((e) => e.kind === "data");
	}, [q]), jt = $e === "auto" ? G.length > 200 : $e, J = de(G.length, B.scrollTop, B.height, A, et, jt), Mt = T && G.length === 0, Nt = !T && G.length === 0, Pt = Mt ? Ee : T && G.length > 0 ? 1 : 0, Ft = Nt ? De : (G.length + Pt) * A, It = oe((e) => {
		if (Fe) return Fe(e);
		let t = u[0];
		if (!t) return "";
		let n = y(t, e);
		return f(n, d(n, t.kind, t.format), {
			locale: O,
			timeZone: it
		});
	}, [
		Fe,
		u,
		O,
		it
	]), Y = oe((e) => {
		Ie === void 0 && pt(e), Re?.(e);
	}, [Ie, Re]), Lt = (e) => {
		let t = ue(P, e);
		ze === void 0 && dt(t), Ve?.(t);
	};
	m(() => {
		let e = j.current;
		if (!e) return;
		let t = () => xt((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let Rt = q.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	m(() => {
		let e = st.current, t = j.current;
		if (!e || !t || !Rt.includes("*")) return;
		let n = vt.current, r = !n || n.rows !== x || n.columns !== u || n.key !== Rt || n.fonts !== yt;
		vt.current = {
			rows: x,
			columns: u,
			key: Rt,
			fonts: yt
		}, e.dataset.measuring = "true";
		let i = _t.current, a = {};
		q.forEach((e, n) => {
			if (e.kind !== "data" || !e.contentSized) return;
			let o = 0;
			for (let r of t.querySelectorAll(`[aria-colindex="${n + 1}"]`)) {
				let t = r.getAttribute("role") === "columnheader", n = r.getAttribute("aria-sort") === "ascending" || r.getAttribute("aria-sort") === "descending", i = t && e.column.sortable !== !1 && !n ? Se : 0;
				o = Math.max(o, r.getBoundingClientRect().width + i);
			}
			if (o <= 0) {
				i[e.column.id] !== void 0 && (a[e.column.id] = i[e.column.id]);
				return;
			}
			let s = Math.min(ve, Math.ceil(o));
			a[e.column.id] = r ? s : Math.max(s, i[e.column.id] ?? 0);
		}), delete e.dataset.measuring;
		let o = Object.keys(a);
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && gt(a);
	}, [
		x,
		u,
		G,
		Rt,
		J.start,
		J.end,
		yt,
		q
	]), p(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => bt((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let zt = (e) => (e - Math.max(1, Math.floor(et / 2))) * A, Bt = B.scrollTop + B.height >= zt(G.length), Vt = () => {
		let e = j.current;
		if (!e) return;
		H && U(null);
		let t = de(G.length, e.scrollTop, e.clientHeight, A, et, jt), n = e.scrollTop + e.clientHeight >= zt(G.length);
		(t.start !== J.start || t.end !== J.end || Je && n !== Bt) && xt({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	p(() => {
		z((e) => {
			let t = e.row < 0 || G.length === 0 ? -1 : Math.min(e.row, G.length - 1), n = Math.max(0, Math.min(e.column, q.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [G.length, q.length]), m(() => {
		if (!M.current) return;
		M.current = !1;
		let e = j.current, t = e?.querySelector(`[data-cell="${R.row}:${R.column}"]`);
		if (!e || !t || (t.focus({ preventScroll: !0 }), kt.has(R.column))) return;
		let n = [...kt].reduce((e, [t, n]) => Math.max(e, n + q[t].width), 0), r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = r.left + n, o = r.left + e.clientWidth;
		i.right > o ? e.scrollLeft += i.right - o : i.left < a && i.right < o && (e.scrollLeft -= a - i.left);
	});
	let Ht = w ? `${w.rowKey}\u0000${w.columnId}` : null, Ut = g(Ht);
	p(() => {
		let e = Ut.current !== null && Ht === null;
		if (Ut.current = Ht, !e) return;
		let t = document.activeElement;
		(!t || t === document.body || j.current?.contains(t)) && j.current?.querySelector(`[data-cell="${R.row}:${R.column}"]`)?.focus({ preventScroll: !0 });
	}, [
		Ht,
		R.row,
		R.column
	]);
	let Wt = w?.layout === "overlay" ? w : null, X = Wt ? K.indexOf(Wt.rowKey) : -1, Gt = Wt ? q.findIndex((e) => e.kind === "data" && e.column.id === Wt.columnId) : -1, Z = q[Gt], Q = X >= 0 && Z?.kind === "data" && Z.column.cell !== void 0, Kt = () => {
		let e = W.current;
		if (!Q || !e) return;
		let t = j.current?.querySelector(`[data-cell="${X}:${Gt}"]`);
		if (!t) return;
		let n = t.getBoundingClientRect(), r = document.documentElement.clientWidth - b, i = document.documentElement.clientHeight - b, a = Math.min(Math.max(n.width, Te), r - b);
		e.style.width = `${a}px`, e.style.left = `${Math.max(b, Math.min(n.left, r - a))}px`, e.style.top = `${Math.max(b, Math.min(n.top, i - e.offsetHeight))}px`;
	}, qt = g(Kt);
	qt.current = Kt, m(() => qt.current()), p(() => {
		let e = W.current;
		if (!Q || !e) return;
		e.contains(document.activeElement) || (o(e)[0] ?? e).focus();
		let t = () => qt.current(), n = (t) => {
			e.contains(t.target) || wt.current?.();
		};
		window.addEventListener("resize", t), document.addEventListener("scroll", t, !0), document.addEventListener("pointerdown", n);
		let r = typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(t);
		return r?.observe(e), () => {
			window.removeEventListener("resize", t), document.removeEventListener("scroll", t, !0), document.removeEventListener("pointerdown", n), r?.disconnect();
		};
	}, [
		Q,
		X,
		Gt,
		k
	]), p(() => {
		Je && !T && G.length !== 0 && (Ye !== void 0 && G.length >= Ye || Bt && lt.current !== G.length && (lt.current = G.length, Je()));
	}, [
		Je,
		T,
		G.length,
		Ye,
		Bt
	]);
	let Jt = (e) => {
		let t = j.current;
		if (t && e.row >= 0) {
			let n = fe(e.row, t.scrollTop, t.clientHeight, A, A);
			n !== t.scrollTop && (t.scrollTop = n, xt({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		M.current = !0, z(e);
	}, Yt = (e, t) => {
		if (S === "single") {
			Y([e]), N.current = e;
			return;
		}
		if (S === "multi") {
			if (t && N.current) {
				Y([.../* @__PURE__ */ new Set([...F, ...pe(K, N.current, e)])]);
				return;
			}
			Y(I.has(e) ? F.filter((t) => t !== e) : [...F, e]), N.current = e;
		}
	}, Xt = (e) => {
		let t = G[e];
		if (t !== void 0) {
			if (Ue) {
				Ue(t);
				return;
			}
			j.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Zt = (e, t, n) => {
		let r = G[e];
		r !== void 0 && C && C(r).length !== 0 && St({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Qt = oe(() => {
		St(null), M.current = !0;
	}, []);
	ae(V !== null, ct, Qt);
	let $t = (e, t) => {
		let n = q[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? xe, n.width + t);
		ht((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, en = (e) => {
		if (Me(e.target)) {
			e.key === "Escape" && !e.defaultPrevented && (e.preventDefault(), qe?.());
			return;
		}
		if (Ne(e.target) || V) return;
		if (e.key === "Escape" && H) {
			e.stopPropagation(), U(null);
			return;
		}
		let { row: t, column: n } = R, r = G.length, i = Math.max(1, Math.floor((j.current?.clientHeight ?? A * 10) / A) - 1), a = q[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), $t(n, e.key === "ArrowRight" ? we : -16);
			return;
		}
		let o = me(R, e.key, {
			rowCount: r,
			columnCount: q.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && S === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = K[o.row];
				e && (N.current ||= K[Math.max(0, t)] ?? e, Y([.../* @__PURE__ */ new Set([...F, ...pe(K, N.current, e)])]));
			}
			Jt(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), Lt(a.column.id)) : e.key === " " && a?.kind === "select" && S === "multi" && (e.preventDefault(), Y(F.length === K.length ? [] : [...K]));
			return;
		}
		let s = K[t];
		if (e.key === "Enter") e.preventDefault(), Xt(t);
		else if (e.key === " " && s) e.preventDefault(), Yt(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && S === "multi") e.preventDefault(), Y([...K]);
		else if (e.key === "F2" && Ke && a?.kind === "data") {
			e.preventDefault();
			let n = G[t];
			n !== void 0 && Ke(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Zt(t, n.left + 12, n.bottom);
		}
	}, tn = (e, t) => {
		let n = K[t];
		n && S !== "none" && (e.target.closest("a, button, input, select, textarea") || (S === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Yt(n, e.shiftKey) : (Y([n]), N.current = n)));
	}, nn = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = q[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? xe, o = r.column.id, s = (e) => {
			ht((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, $ = (e, t) => {
		let n = R.row === e && R.column === t, r = kt.get(t), i = q[t];
		return {
			"data-cell": `${e}:${t}`,
			"data-fit": i?.kind === "data" && i.contentSized ? "content" : void 0,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: (r) => {
				n || z({
					row: e,
					column: t
				});
				let a = r.currentTarget;
				if (i?.kind === "data" && je(a) && ke(a)) {
					let n = a.getBoundingClientRect();
					U({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height
					});
				} else U(null);
			},
			onBlur: () => U(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				ke(t) ? t.title = Ae(t) : t.removeAttribute("title");
			}
		};
	};
	m(() => {
		let e = Ct.current;
		if (!e || !H) return;
		let t = document.documentElement.clientWidth - 8, n = H.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? H.left - n : H.left)}px`;
	}, [H]);
	let rn = (e, t, n, r, i = !1) => {
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
		}) : /* @__PURE__ */ v(re, {
			value: a.value,
			kind: e.kind,
			format: e.format,
			tones: e.tones,
			context: "grid"
		});
	}, an = [];
	for (let e = J.start; e < J.end; e++) an.push(e);
	R.row >= 0 && R.row < G.length && (R.row < J.start || R.row >= J.end) && an.push(R.row);
	let on = S === "multi" && K.length > 0 && K.every((e) => I.has(e)), sn = S === "multi" && !on && K.some((e) => I.has(e)), cn = V ? G[V.rowIndex] : void 0, ln = {
		"--mtc-grid-template": Dt,
		"--mtc-grid-min-width": `${Ot}px`,
		"--mtc-grid-row-height": `${A}px`,
		"--mtc-grid-viewport-width": B.width > 0 ? `${B.width}px` : "100%"
	};
	return /* @__PURE__ */ se("div", {
		ref: st,
		className: c("mtc-data-grid", E && `mtc-density-${E}`, rt),
		style: {
			...ln,
			height: Qe
		},
		children: [
			/* @__PURE__ */ se("div", {
				ref: j,
				role: "grid",
				"aria-label": l,
				"aria-rowcount": (Ye ?? G.length) + 1,
				"aria-colcount": q.length,
				"aria-multiselectable": S === "multi" || void 0,
				"aria-busy": T || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: en,
				onScroll: Vt,
				children: [/* @__PURE__ */ v("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ v("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: q.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ v("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...$(-1, t),
								children: /* @__PURE__ */ v("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": D("dataGrid.selectAll"),
									checked: on,
									ref: (e) => {
										e && (e.indeterminate = sn);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => Y(on ? [] : [...K])
								})
							}, "__select");
							let { column: n } = e, i = P?.columnId === n.id ? P.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ne(d(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ se("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...$(-1, t),
								onClick: o ? () => {
									Lt(n.id), z({
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
										onPointerDown: (e) => nn(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ se("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Ft },
					children: [
						an.map((e) => {
							let t = G[e], n = K[e], r = I.has(n), i = We?.(t);
							return /* @__PURE__ */ v("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": S === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * A },
								...nt?.(t),
								onClick: (t) => tn(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									Ke && i ? Ke(t, i) : Xt(e);
								},
								onContextMenu: C ? (t) => {
									t.preventDefault(), S !== "none" && !r && Y([n]), z({
										row: e,
										column: R.column
									}), Zt(e, t.clientX, t.clientY);
								} : void 0,
								children: q.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...$(e, o),
										children: /* @__PURE__ */ v("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": D("dataGrid.selectRow", { label: It(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Yt(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = d(y(s, t), s.kind, s.format), te = s.align === "end" || !s.align && !s.cell && ne(c.kind), l = w?.rowKey === n && w.columnId === s.id && w.layout !== "overlay", u = rn(s, t, e, r, l), f = $(e, o);
									return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell",
										"data-column-id": s.id,
										"data-align": te ? "end" : "start",
										...f,
										"data-editing": l || void 0,
										tabIndex: l ? void 0 : f.tabIndex,
										onPointerEnter: l ? void 0 : f.onPointerEnter,
										children: i && o === At && !l ? /* @__PURE__ */ v("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: ee(Ge ? (e) => Ge(t, e) : void 0),
											children: u
										}) : u
									}, s.id);
								})
							}, n);
						}),
						Mt && Array.from({ length: Ee }, (e, t) => /* @__PURE__ */ v("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * A },
							children: q.map((e, n) => /* @__PURE__ */ v("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ v(te, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Mt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								children: D("dataGrid.loading")
							})
						}),
						T && G.length > 0 && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: G.length * A },
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": q.length,
								className: "mtc-data-grid-cell",
								children: D("dataGrid.loadingMore")
							})
						}),
						Nt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: De
							},
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": q.length,
								className: "mtc-data-grid-cell",
								children: Xe ?? /* @__PURE__ */ v(i, {
									compact: !0,
									title: D("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			tt && /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-footer",
				children: tt
			}),
			H && (() => {
				let e = q[H.column], t = H.row >= 0 ? G[H.row] : void 0;
				if (e?.kind !== "data" || H.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ne(d(t === void 0 ? void 0 : y(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ v("div", {
					ref: Ct,
					"aria-hidden": "true",
					inert: !0,
					className: c("mtc-data-grid-value-tip", E && `mtc-density-${E}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					style: {
						left: H.left,
						top: H.top,
						minWidth: H.width,
						height: H.height
					},
					children: t === void 0 ? e.column.header : rn(e.column, t, H.row, I.has(K[H.row] ?? ""))
				});
				return k ? ce(r, k) : r;
			})(),
			Q && Z.kind === "data" && (() => {
				let e = G[X], t = /* @__PURE__ */ v("div", {
					ref: W,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": D("dataGrid.editCell", { column: Z.column.header }),
					tabIndex: -1,
					className: c("mtc-popover mtc-data-grid-overlay-editor", E && `mtc-density-${E}`),
					onKeyDown: (e) => {
						(e.key === "Escape" || e.key === "Tab") && (e.stopPropagation(), s(e, W, !0, () => wt.current?.()));
					},
					children: rn(Z.column, e, X, I.has(K[X] ?? ""), !0)
				});
				return k ? ce(t, k) : t;
			})(),
			V && cn !== void 0 && C && (() => {
				let e = /* @__PURE__ */ v("div", {
					ref: ct,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ v(ie, {
						label: D("dataGrid.rowActions", { label: It(cn) }),
						items: C(cn),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: V.x,
							top: V.y
						},
						onClose: Qt
					})
				});
				return k ? ce(e, k) : e;
			})()
		]
	});
}
//#endregion
export { Pe as t };
