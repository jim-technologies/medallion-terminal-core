import { D as e, E as t, T as n, g as r, n as i, w as a } from "./States-CirXf8uQ.js";
import { n as o, r as s, t as c } from "./utils-BfYGx7e_.js";
import { i as ee } from "./types-9raK7bmK.js";
import { b as te } from "./sourceError-Cv8KoMhB.js";
import { a as l, i as ne, n as u, o as d, r as f, t as re } from "./PropertyValue-C4k8oWGv.js";
import { a as ie, c as ae } from "./Overlays-VaMRz4no.js";
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
function Ne({ label: l, columns: u, rows: S, rowKey: Ne, rowLabel: Pe, selection: C = "none", selectedKeys: Fe, defaultSelectedKeys: Ie, onSelectionChange: Le, sort: Re, defaultSort: ze = null, onSortChange: Be, sortMode: Ve = "client", onRowActivate: He, rowHref: Ue, onNavigate: We, contextActions: w, onCellEdit: T, editingCell: E, onEditCancel: Ge, onEndReached: Ke, totalRows: qe, loading: D = !1, empty: Je, scrollKey: Ye, density: O, rowHeight: Xe, height: Ze = "100%", virtualize: Qe = "auto", overscan: $e = 8, footer: et, rowProps: tt, className: nt }) {
	let k = t(), { locale: A, timeZone: rt } = n(), it = a(), j = e(), at = O ?? it?.density ?? "standard", M = Xe ?? he[at], ot = g(null), N = g(null), st = g(null), P = g(!1), F = g(null), ct = g(-1), [lt, ut] = _(ze), I = Re === void 0 ? lt : Re, [dt, ft] = _(Ie ?? []), L = Fe ?? dt, R = h(() => new Set(L), [L]), [pt, mt] = _({}), [ht, gt] = _({}), _t = g(ht);
	_t.current = ht;
	let vt = g(null), [yt, bt] = _(0), [z, B] = _(() => ({
		row: S.length > 0 ? 0 : -1,
		column: +(C === "multi")
	})), [V, xt] = _({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [H, St] = _(null), [U, W] = _(null), Ct = g(null), G = g(null), wt = g(Ge);
	wt.current = Ge;
	let K = h(() => Ve !== "client" || !I ? S : ce(S, u.find((e) => e.id === I.columnId), I.direction, A), [
		S,
		u,
		I,
		Ve,
		A
	]), q = h(() => K.map((e, t) => Ne(e, t)), [K, Ne]), Tt = K[0], J = h(() => {
		let e = [...C === "multi" ? [{
			kind: "select",
			width: Se
		}] : [], ...u.map((e) => ({
			kind: "data",
			column: e,
			contentSized: e.width === void 0 && pt[e.id] === void 0,
			width: pt[e.id] ?? e.width ?? ht[e.id] ?? ge
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
				shrink: e.contentSized && De(e.column, Tt === void 0 ? void 0 : b(e.column, Tt)),
				tier: +!!n
			};
		}), V.width);
		return e.map((e, t) => ({
			...e,
			width: n[t]
		}));
	}, [
		u,
		C,
		pt,
		ht,
		V.width,
		Tt
	]), Et = h(() => {
		let e = J.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : J.length - 1;
	}, [J]), Dt = J.map((e, t) => t === Et ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Ot = J.reduce((e, t) => e + t.width, 0), kt = h(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of J.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return J.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [J]), At = h(() => {
		let e = J.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : J.findIndex((e) => e.kind === "data");
	}, [J]), jt = Qe === "auto" ? K.length > 200 : Qe, Y = ue(K.length, V.scrollTop, V.height, M, $e, jt), Mt = D && K.length === 0, Nt = !D && K.length === 0 && Je !== null, Pt = Mt ? Te : D && K.length > 0 ? 1 : 0, Ft = Nt ? Ee : (K.length + Pt) * M, It = oe((e) => {
		if (Pe) return Pe(e);
		let t = u[0];
		if (!t) return "";
		let n = b(t, e);
		return f(n, d(n, t.kind, t.format), {
			locale: A,
			timeZone: rt
		});
	}, [
		Pe,
		u,
		A,
		rt
	]), X = oe((e) => {
		Fe === void 0 && ft(e), Le?.(e);
	}, [Fe, Le]), Lt = (e) => {
		let t = le(I, e);
		Re === void 0 && ut(t), Be?.(t);
	};
	p(() => {
		let e = N.current;
		e && Ye !== void 0 && (e.scrollTop = 0, xt((e) => e.scrollTop === 0 ? e : {
			...e,
			scrollTop: 0
		}));
	}, [Ye]), m(() => {
		let e = N.current;
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
	let Rt = J.map((e) => e.kind === "data" && e.contentSized ? `${e.column.id}*` : e.kind === "data" ? e.column.id : "").join("|");
	m(() => {
		let e = ot.current, t = N.current;
		if (!e || !t || !Rt.includes("*")) return;
		let n = vt.current, r = !n || n.rows !== S || n.columns !== u || n.key !== Rt || n.fonts !== yt;
		vt.current = {
			rows: S,
			columns: u,
			key: Rt,
			fonts: yt
		}, e.dataset.measuring = "true";
		let i = _t.current, a = {};
		J.forEach((e, n) => {
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
		(o.length !== Object.keys(i).length || o.some((e) => i[e] !== a[e])) && gt(a);
	}, [
		S,
		u,
		K,
		Rt,
		Y.start,
		Y.end,
		yt,
		J
	]), p(() => {
		let e = typeof document > "u" ? void 0 : document.fonts;
		if (!e?.addEventListener) return;
		let t = () => bt((e) => e + 1);
		return e.addEventListener("loadingdone", t), () => e.removeEventListener("loadingdone", t);
	}, []);
	let zt = (e) => (e - Math.max(1, Math.floor($e / 2))) * M, Bt = V.scrollTop + V.height >= zt(K.length), Vt = () => {
		let e = N.current;
		if (!e) return;
		U && W(null);
		let t = ue(K.length, e.scrollTop, e.clientHeight, M, $e, jt), n = e.scrollTop + e.clientHeight >= zt(K.length);
		(t.start !== Y.start || t.end !== Y.end || Ke && n !== Bt) && xt({
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
		if (!P.current) return;
		P.current = !1;
		let e = N.current, t = e?.querySelector(`[data-cell="${z.row}:${z.column}"]`);
		if (!e || !t || (t.focus({ preventScroll: !0 }), kt.has(z.column))) return;
		let n = [...kt].reduce((e, [t, n]) => Math.max(e, n + J[t].width), 0), r = e.getBoundingClientRect(), i = t.getBoundingClientRect(), a = r.left + n, o = r.left + e.clientWidth;
		i.right > o ? e.scrollLeft += i.right - o : i.left < a && i.right < o && (e.scrollLeft -= a - i.left);
	});
	let Z = E ? `${E.rowKey}\u0000${E.columnId}` : null, Ht = g(Z);
	p(() => {
		let e = Ht.current !== null && Z === null;
		if (Ht.current = Z, !e) return;
		let t = document.activeElement;
		(!t || t === document.body || N.current?.contains(t)) && N.current?.querySelector(`[data-cell="${z.row}:${z.column}"]`)?.focus({ preventScroll: !0 });
	}, [
		Z,
		z.row,
		z.column
	]);
	let Ut = E?.layout === "overlay" ? E : null, Q = Ut ? q.indexOf(Ut.rowKey) : -1, Wt = Ut ? J.findIndex((e) => e.kind === "data" && e.column.id === Ut.columnId) : -1, $ = J[Wt], Gt = Q >= 0 && $?.kind === "data" && $.column.cell !== void 0, Kt = () => {
		let e = G.current;
		if (!Gt || !e) return;
		let t = N.current?.querySelector(`[data-cell="${Q}:${Wt}"]`);
		if (!t) return;
		let n = t.getBoundingClientRect(), r = document.documentElement.clientWidth - x, i = document.documentElement.clientHeight - x, a = Math.min(Math.max(n.width, we), r - x);
		e.style.width = `${a}px`, e.style.left = `${Math.max(x, Math.min(n.left, r - a))}px`, e.style.top = `${Math.max(x, Math.min(n.top, i - e.offsetHeight))}px`;
	}, qt = g(Kt);
	qt.current = Kt, m(() => qt.current()), p(() => {
		let e = G.current;
		if (!Gt || !e) return;
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
		Gt,
		Q,
		Wt,
		j
	]), p(() => {
		Ke && !D && K.length !== 0 && (qe !== void 0 && K.length >= qe || Bt && ct.current !== K.length && (ct.current = K.length, Ke()));
	}, [
		Ke,
		D,
		K.length,
		qe,
		Bt
	]);
	let Jt = (e) => {
		let t = N.current;
		if (t && e.row >= 0) {
			let n = de(e.row, t.scrollTop, t.clientHeight, M, M);
			n !== t.scrollTop && (t.scrollTop = n, xt({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		P.current = !0, B(e);
	}, Yt = (e, t) => {
		if (C === "single") {
			X([e]), F.current = e;
			return;
		}
		if (C === "multi") {
			if (t && F.current) {
				X([.../* @__PURE__ */ new Set([...L, ...fe(q, F.current, e)])]);
				return;
			}
			X(R.has(e) ? L.filter((t) => t !== e) : [...L, e]), F.current = e;
		}
	}, Xt = (e) => {
		let t = K[e];
		if (t !== void 0) {
			if (He) {
				He(t);
				return;
			}
			N.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, Zt = (e, t, n) => {
		let r = K[e];
		r !== void 0 && w && w(r).length !== 0 && St({
			rowIndex: e,
			x: t,
			y: n
		});
	}, Qt = oe(() => {
		St(null), P.current = !0;
	}, []);
	ae(H !== null, st, Qt);
	let $t = (e, t) => {
		let n = J[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? be, n.width + t);
		mt((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, en = (e) => {
		if (je(e.target)) {
			e.key === "Escape" && !e.defaultPrevented && (e.preventDefault(), Ge?.());
			return;
		}
		if (Me(e.target) || H) return;
		if (e.key === "Escape" && U) {
			e.stopPropagation(), W(null);
			return;
		}
		let { row: t, column: n } = z, r = K.length, i = Math.max(1, Math.floor((N.current?.clientHeight ?? M * 10) / M) - 1), a = J[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), $t(n, e.key === "ArrowRight" ? Ce : -16);
			return;
		}
		let o = pe(z, e.key, {
			rowCount: r,
			columnCount: J.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && C === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = q[o.row];
				e && (F.current ||= q[Math.max(0, t)] ?? e, X([.../* @__PURE__ */ new Set([...L, ...fe(q, F.current, e)])]));
			}
			Jt(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), Lt(a.column.id)) : e.key === " " && a?.kind === "select" && C === "multi" && (e.preventDefault(), X(L.length === q.length ? [] : [...q]));
			return;
		}
		let s = q[t];
		if (e.key === "Enter") e.preventDefault(), Xt(t);
		else if (e.key === " " && s) e.preventDefault(), Yt(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && C === "multi") e.preventDefault(), X([...q]);
		else if (e.key === "F2" && T && a?.kind === "data") {
			e.preventDefault();
			let n = K[t];
			n !== void 0 && T(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			Zt(t, n.left + 12, n.bottom);
		}
	}, tn = (e, t) => {
		let n = q[t];
		n && C !== "none" && (e.target.closest("a, button, input, select, textarea") || (C === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Yt(n, e.shiftKey) : (X([n]), F.current = n)));
	}, nn = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = J[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? be, o = r.column.id, s = (e) => {
			mt((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, rn = (e, t) => {
		let n = z.row === e && z.column === t, r = kt.get(t), i = J[t];
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
				if (i?.kind === "data" && Ae(a) && Oe(a)) {
					let n = a.getBoundingClientRect();
					W({
						row: e,
						column: t,
						left: n.left,
						top: n.top,
						width: n.width,
						height: n.height
					});
				} else W(null);
			},
			onBlur: () => W(null),
			onPointerEnter: (e) => {
				let t = e.currentTarget;
				Oe(t) ? t.title = ke(t) : t.removeAttribute("title");
			}
		};
	};
	m(() => {
		let e = Ct.current;
		if (!e || !U) return;
		let t = document.documentElement.clientWidth - 8, n = U.left + e.offsetWidth - t;
		e.style.left = `${Math.max(8, n > 0 ? U.left - n : U.left)}px`;
	}, [U]);
	let an = (e, t, n, r, i = !1) => {
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
	}, on = [];
	for (let e = Y.start; e < Y.end; e++) on.push(e);
	z.row >= 0 && z.row < K.length && (z.row < Y.start || z.row >= Y.end) && on.push(z.row);
	let sn = C === "multi" && q.length > 0 && q.every((e) => R.has(e)), cn = C === "multi" && !sn && q.some((e) => R.has(e)), ln = H ? K[H.rowIndex] : void 0, un = {
		"--mtc-grid-template": Dt,
		"--mtc-grid-min-width": `${Ot}px`,
		"--mtc-grid-row-height": `${M}px`,
		"--mtc-grid-viewport-width": V.width > 0 ? `${V.width}px` : "100%"
	};
	return /* @__PURE__ */ y("div", {
		ref: ot,
		className: c("mtc-data-grid", O && `mtc-density-${O}`, nt),
		style: {
			...un,
			height: Ze
		},
		children: [
			/* @__PURE__ */ y("div", {
				ref: N,
				role: "grid",
				"aria-label": l,
				"aria-rowcount": (qe ?? K.length) + 1,
				"aria-colcount": J.length,
				"aria-multiselectable": C === "multi" || void 0,
				"aria-busy": D || void 0,
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
						children: J.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ v("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...rn(-1, t),
								children: /* @__PURE__ */ v("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": k("dataGrid.selectAll"),
									checked: sn,
									ref: (e) => {
										e && (e.indeterminate = cn);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => X(sn ? [] : [...q])
								})
							}, "__select");
							let { column: n } = e, i = I?.columnId === n.id ? I.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ne(d(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ y("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...rn(-1, t),
								onClick: o ? () => {
									Lt(n.id), B({
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
				}), /* @__PURE__ */ y("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: Ft },
					children: [
						on.map((e) => {
							let t = K[e], n = q[e], r = R.has(n), i = Ue?.(t);
							return /* @__PURE__ */ v("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": C === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * M },
								...tt?.(t),
								onClick: (t) => tn(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									T && i ? T(t, i) : Xt(e);
								},
								onContextMenu: w ? (t) => {
									t.preventDefault(), C !== "none" && !r && X([n]), B({
										row: e,
										column: z.column
									}), Zt(e, t.clientX, t.clientY);
								} : void 0,
								children: J.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ v("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...rn(e, o),
										children: /* @__PURE__ */ v("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": k("dataGrid.selectRow", { label: It(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Yt(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: s } = a, c = d(b(s, t), s.kind, s.format), te = s.align === "end" || !s.align && !s.cell && ne(c.kind), l = E?.rowKey === n && E.columnId === s.id && E.layout !== "overlay", u = an(s, t, e, r, l), f = rn(e, o);
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
											onClick: ee(We ? (e) => We(t, e) : void 0),
											children: u
										}) : u
									}, s.id);
								})
							}, n);
						}),
						Mt && Array.from({ length: Te }, (e, t) => /* @__PURE__ */ v("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * M },
							children: J.map((e, n) => /* @__PURE__ */ v("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ v(te, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Mt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								children: k("dataGrid.loading")
							})
						}),
						D && K.length > 0 && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: K.length * M },
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": J.length,
								className: "mtc-data-grid-cell",
								children: k("dataGrid.loadingMore")
							})
						}),
						Nt && /* @__PURE__ */ v("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: Ee
							},
							children: /* @__PURE__ */ v("div", {
								role: "gridcell",
								"aria-colspan": J.length,
								className: "mtc-data-grid-cell",
								children: Je ?? /* @__PURE__ */ v(i, {
									compact: !0,
									title: k("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			et && /* @__PURE__ */ v("div", {
				className: "mtc-data-grid-footer",
				children: et
			}),
			U && (() => {
				let e = J[U.column], t = U.row >= 0 ? K[U.row] : void 0;
				if (e?.kind !== "data" || U.row >= 0 && t === void 0) return null;
				let n = e.column.align === "end" || !e.column.align && !e.column.cell && ne(d(t === void 0 ? void 0 : b(e.column, t), e.column.kind, e.column.format).kind), r = /* @__PURE__ */ v("div", {
					ref: Ct,
					"aria-hidden": "true",
					inert: !0,
					className: c("mtc-data-grid-value-tip", O && `mtc-density-${O}`),
					"data-header": t === void 0 || void 0,
					"data-align": n ? "end" : "start",
					style: {
						left: U.left,
						top: U.top,
						minWidth: U.width,
						height: U.height
					},
					children: t === void 0 ? e.column.header : an(e.column, t, U.row, R.has(q[U.row] ?? ""))
				});
				return j ? se(r, j) : r;
			})(),
			Gt && $.kind === "data" && (() => {
				let e = K[Q], t = /* @__PURE__ */ v("div", {
					ref: G,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": k("dataGrid.editCell", { column: $.column.header }),
					tabIndex: -1,
					className: c("mtc-popover mtc-data-grid-overlay-editor", O && `mtc-density-${O}`),
					onKeyDown: (e) => {
						(e.key === "Escape" || e.key === "Tab") && (e.stopPropagation(), s(e, G, !0, () => wt.current?.()));
					},
					children: an($.column, e, Q, R.has(q[Q] ?? ""), !0)
				});
				return j ? se(t, j) : t;
			})(),
			H && ln !== void 0 && w && (() => {
				let e = /* @__PURE__ */ v("div", {
					ref: st,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ v(ie, {
						label: k("dataGrid.rowActions", { label: It(ln) }),
						items: w(ln),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: H.x,
							top: H.y
						},
						onClose: Qt
					})
				});
				return j ? se(e, j) : e;
			})()
		]
	});
}
//#endregion
export { Ne as t };
