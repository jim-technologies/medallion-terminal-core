import { C as e, E as t, T as n, h as r, n as i, w as a } from "./States-Ds3cxTem.js";
import { t as o } from "./utils-j4lJ7S1v.js";
import { i as s } from "./types-Ds11x4VM.js";
import { a as c, i as ee, n as l, o as u, r as te, t as ne } from "./PropertyValue-BtibYjWJ.js";
import { b as re } from "./sourceError-BwpI_4dr.js";
import { a as d, c as ie } from "./Overlays-_7OI9Emq.js";
import { useCallback as f, useEffect as ae, useLayoutEffect as oe, useMemo as p, useRef as m, useState as h } from "react";
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
			key: t.sortValue ? t.sortValue(e) : c(i, u(i, t.kind, t.format), { locale: r })
		};
	});
	return i.sort((e, t) => {
		if (e.key == null || t.key == null) return l(e.key, t.key) || e.index - t.index;
		let r = l(e.key, t.key);
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
//#endregion
//#region src/workbench/DataGrid.tsx
var me = {
	compact: 28,
	standard: 32,
	comfortable: 40
}, he = 160, ge = 40, _e = 16, ve = 8, ye = 160;
function be(e) {
	return !(e instanceof HTMLElement) || e.dataset.gridSelect === "true" ? !1 : e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName);
}
function y({ label: c, columns: l, rows: y, rowKey: xe, rowLabel: b, selection: x = "none", selectedKeys: S, defaultSelectedKeys: Se, onSelectionChange: Ce, sort: C, defaultSort: we = null, onSortChange: Te, sortMode: Ee = "client", onRowActivate: De, rowHref: Oe, onNavigate: ke, contextActions: w, onCellEdit: T, onEndReached: E, totalRows: D, loading: O = !1, empty: Ae, density: k, rowHeight: je, height: Me = "100%", virtualize: Ne = "auto", overscan: A = 8, footer: Pe, rowProps: Fe, className: Ie }) {
	let j = n(), { locale: M, timeZone: Le } = a(), Re = e(), ze = t(), Be = k ?? Re?.density ?? "standard", N = je ?? me[Be], P = m(null), Ve = m(null), F = m(!1), I = m(null), He = m(-1), [Ue, We] = h(we), L = C === void 0 ? Ue : C, [Ge, Ke] = h(Se ?? []), R = S ?? Ge, z = p(() => new Set(R), [R]), [qe, Je] = h({}), [B, V] = h(() => ({
		row: y.length > 0 ? 0 : -1,
		column: +(x === "multi")
	})), [H, U] = h({
		scrollTop: 0,
		height: 600,
		width: 0
	}), [W, Ye] = h(null), G = p(() => Ee !== "client" || !L ? y : ce(y, l.find((e) => e.id === L.columnId), L.direction, M), [
		y,
		l,
		L,
		Ee,
		M
	]), K = p(() => G.map((e, t) => xe(e, t)), [G, xe]), q = p(() => [...x === "multi" ? [{
		kind: "select",
		width: ge
	}] : [], ...l.map((e) => ({
		kind: "data",
		column: e,
		width: qe[e.id] ?? e.width ?? he
	}))], [
		l,
		x,
		qe
	]), Xe = p(() => {
		let e = q.findIndex((e) => e.kind === "data" && e.column.grow);
		return e >= 0 ? e : q.length - 1;
	}, [q]), Ze = q.map((e, t) => t === Xe ? `minmax(${e.width}px, 1fr)` : `${e.width}px`).join(" "), Qe = q.reduce((e, t) => e + t.width, 0), $e = p(() => {
		let e = /* @__PURE__ */ new Map(), t = 0;
		for (let [n, r] of q.entries()) {
			if (!(r.kind === "select" || r.column.pinned)) break;
			e.set(n, t), t += r.width;
		}
		return q.some((e) => e.kind === "data" && e.column.pinned) ? e : /* @__PURE__ */ new Map();
	}, [q]), et = p(() => {
		let e = q.findIndex((e) => e.kind === "data" && e.column.primary);
		return e >= 0 ? e : q.findIndex((e) => e.kind === "data");
	}, [q]), tt = Ne === "auto" ? G.length > 200 : Ne, J = ue(G.length, H.scrollTop, H.height, N, A, tt), Y = O && G.length === 0, nt = !O && G.length === 0, rt = Y ? ve : O && G.length > 0 ? 1 : 0, it = nt ? ye : (G.length + rt) * N, at = f((e) => {
		if (b) return b(e);
		let t = l[0];
		if (!t) return "";
		let n = v(t, e);
		return te(n, u(n, t.kind, t.format), {
			locale: M,
			timeZone: Le
		});
	}, [
		b,
		l,
		M,
		Le
	]), X = f((e) => {
		S === void 0 && Ke(e), Ce?.(e);
	}, [S, Ce]), ot = (e) => {
		let t = le(L, e);
		C === void 0 && We(t), Te?.(t);
	};
	oe(() => {
		let e = P.current;
		if (!e) return;
		let t = () => U((t) => t.height === e.clientHeight && t.scrollTop === e.scrollTop && t.width === e.clientWidth ? t : {
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
		if (t(), typeof ResizeObserver > "u") return;
		let n = new ResizeObserver(t);
		return n.observe(e), () => n.disconnect();
	}, []);
	let st = (e) => (e - Math.max(1, Math.floor(A / 2))) * N, Z = H.scrollTop + H.height >= st(G.length), ct = () => {
		let e = P.current;
		if (!e) return;
		let t = ue(G.length, e.scrollTop, e.clientHeight, N, A, tt), n = e.scrollTop + e.clientHeight >= st(G.length);
		(t.start !== J.start || t.end !== J.end || E && n !== Z) && U({
			scrollTop: e.scrollTop,
			height: e.clientHeight,
			width: e.clientWidth
		});
	};
	ae(() => {
		V((e) => {
			let t = e.row < 0 || G.length === 0 ? -1 : Math.min(e.row, G.length - 1), n = Math.max(0, Math.min(e.column, q.length - 1));
			return t === e.row && n === e.column ? e : {
				row: t,
				column: n
			};
		});
	}, [G.length, q.length]), oe(() => {
		F.current && (F.current = !1, P.current?.querySelector(`[data-cell="${B.row}:${B.column}"]`)?.focus({ preventScroll: !0 }));
	}), ae(() => {
		E && !O && G.length !== 0 && (D !== void 0 && G.length >= D || Z && He.current !== G.length && (He.current = G.length, E()));
	}, [
		E,
		O,
		G.length,
		D,
		Z
	]);
	let lt = (e) => {
		let t = P.current;
		if (t && e.row >= 0) {
			let n = de(e.row, t.scrollTop, t.clientHeight, N, N);
			n !== t.scrollTop && (t.scrollTop = n, U({
				scrollTop: n,
				height: t.clientHeight,
				width: t.clientWidth
			}));
		}
		F.current = !0, V(e);
	}, Q = (e, t) => {
		if (x === "single") {
			X([e]), I.current = e;
			return;
		}
		if (x === "multi") {
			if (t && I.current) {
				X([.../* @__PURE__ */ new Set([...R, ...fe(K, I.current, e)])]);
				return;
			}
			X(z.has(e) ? R.filter((t) => t !== e) : [...R, e]), I.current = e;
		}
	}, ut = (e) => {
		let t = G[e];
		if (t !== void 0) {
			if (De) {
				De(t);
				return;
			}
			P.current?.querySelector(`[data-row-index="${e}"] a[data-row-link]`)?.click();
		}
	}, dt = (e, t, n) => {
		let r = G[e];
		r !== void 0 && w && w(r).length !== 0 && Ye({
			rowIndex: e,
			x: t,
			y: n
		});
	}, ft = f(() => {
		Ye(null), F.current = !0;
	}, []);
	ie(W !== null, Ve, ft);
	let pt = (e, t) => {
		let n = q[e];
		if (!n || n.kind !== "data") return;
		let r = Math.max(n.column.minWidth ?? 48, n.width + t);
		Je((e) => ({
			...e,
			[n.column.id]: r
		}));
	}, mt = (e) => {
		if (be(e.target) || W) return;
		let { row: t, column: n } = B, r = G.length, i = Math.max(1, Math.floor((P.current?.clientHeight ?? N * 10) / N) - 1), a = q[n];
		if (t < 0 && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			e.preventDefault(), pt(n, e.key === "ArrowRight" ? _e : -16);
			return;
		}
		let o = pe(B, e.key, {
			rowCount: r,
			columnCount: q.length,
			pageRows: i,
			ctrl: e.ctrlKey || e.metaKey
		});
		if (o) {
			if (e.preventDefault(), e.shiftKey && x === "multi" && o.row >= 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				let e = K[o.row];
				e && (I.current ||= K[Math.max(0, t)] ?? e, X([.../* @__PURE__ */ new Set([...R, ...fe(K, I.current, e)])]));
			}
			lt(o);
			return;
		}
		if (t < 0) {
			(e.key === "Enter" || e.key === " ") && a?.kind === "data" && a.column.sortable !== !1 ? (e.preventDefault(), ot(a.column.id)) : e.key === " " && a?.kind === "select" && x === "multi" && (e.preventDefault(), X(R.length === K.length ? [] : [...K]));
			return;
		}
		let s = K[t];
		if (e.key === "Enter") e.preventDefault(), ut(t);
		else if (e.key === " " && s) e.preventDefault(), Q(s, e.shiftKey);
		else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && x === "multi") e.preventDefault(), X([...K]);
		else if (e.key === "F2" && T && a?.kind === "data") {
			e.preventDefault();
			let n = G[t];
			n !== void 0 && T(n, a.column.id);
		} else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
			e.preventDefault();
			let n = e.target.getBoundingClientRect();
			dt(t, n.left + 12, n.bottom);
		}
	}, ht = (e, t) => {
		let n = K[t];
		n && x !== "none" && (e.target.closest("a, button, input, select, textarea") || (x === "multi" && (e.shiftKey || e.metaKey || e.ctrlKey) ? Q(n, e.shiftKey) : (X([n]), I.current = n)));
	}, gt = (e, t) => {
		e.preventDefault(), e.stopPropagation();
		let n = e.clientX, r = q[t];
		if (!r || r.kind !== "data") return;
		let i = r.width, a = r.column.minWidth ?? 48, o = r.column.id, s = (e) => {
			Je((t) => ({
				...t,
				[o]: Math.max(a, i + e.clientX - n)
			}));
		}, c = () => {
			document.removeEventListener("pointermove", s), document.removeEventListener("pointerup", c);
		};
		document.addEventListener("pointermove", s), document.addEventListener("pointerup", c);
	}, $ = (e, t) => {
		let n = B.row === e && B.column === t, r = $e.get(t);
		return {
			"data-cell": `${e}:${t}`,
			tabIndex: n ? 0 : -1,
			"aria-colindex": t + 1,
			"data-pinned": r !== void 0 || void 0,
			style: r === void 0 ? void 0 : { left: r },
			onFocus: () => {
				n || V({
					row: e,
					column: t
				});
			}
		};
	}, _t = [];
	for (let e = J.start; e < J.end; e++) _t.push(e);
	B.row >= 0 && B.row < G.length && (B.row < J.start || B.row >= J.end) && _t.push(B.row);
	let vt = x === "multi" && K.length > 0 && K.every((e) => z.has(e)), yt = x === "multi" && !vt && K.some((e) => z.has(e)), bt = W ? G[W.rowIndex] : void 0, xt = {
		"--mtc-grid-template": Ze,
		"--mtc-grid-min-width": `${Qe}px`,
		"--mtc-grid-row-height": `${N}px`,
		"--mtc-grid-viewport-width": H.width > 0 ? `${H.width}px` : "100%"
	};
	return /* @__PURE__ */ _("div", {
		className: o("mtc-data-grid", k && `mtc-density-${k}`, Ie),
		style: {
			...xt,
			height: Me
		},
		children: [
			/* @__PURE__ */ _("div", {
				ref: P,
				role: "grid",
				"aria-label": c,
				"aria-rowcount": (D ?? G.length) + 1,
				"aria-colcount": q.length,
				"aria-multiselectable": x === "multi" || void 0,
				"aria-busy": O || void 0,
				className: "mtc-data-grid-viewport",
				onKeyDown: mt,
				onScroll: ct,
				children: [/* @__PURE__ */ g("div", {
					role: "rowgroup",
					className: "mtc-data-grid-head",
					children: /* @__PURE__ */ g("div", {
						role: "row",
						"aria-rowindex": 1,
						className: "mtc-data-grid-row mtc-data-grid-header-row",
						children: q.map((e, t) => {
							if (e.kind === "select") return /* @__PURE__ */ g("div", {
								role: "columnheader",
								className: "mtc-data-grid-cell mtc-data-grid-select",
								...$(-1, t),
								children: /* @__PURE__ */ g("input", {
									type: "checkbox",
									tabIndex: -1,
									"data-grid-select": "true",
									"aria-label": j("dataGrid.selectAll"),
									checked: vt,
									ref: (e) => {
										e && (e.indeterminate = yt);
									},
									onMouseDown: (e) => e.preventDefault(),
									onChange: () => X(vt ? [] : [...K])
								})
							}, "__select");
							let { column: n } = e, i = L?.columnId === n.id ? L.direction : void 0, a = n.align === "end" || !n.align && !n.cell && ee(u(void 0, n.kind, n.format).kind), o = n.sortable !== !1;
							return /* @__PURE__ */ _("div", {
								role: "columnheader",
								"aria-sort": i ?? (o ? "none" : void 0),
								className: "mtc-data-grid-cell mtc-data-grid-header-cell",
								"data-align": a ? "end" : "start",
								"data-sortable": o || void 0,
								...$(-1, t),
								onClick: o ? () => {
									ot(n.id), V({
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
										onPointerDown: (e) => gt(e, t),
										onClick: (e) => e.stopPropagation()
									})
								]
							}, n.id);
						})
					})
				}), /* @__PURE__ */ _("div", {
					role: "rowgroup",
					className: "mtc-data-grid-body",
					style: { height: it },
					children: [
						_t.map((e) => {
							let t = G[e], n = K[e], r = z.has(n), i = Oe?.(t);
							return /* @__PURE__ */ g("div", {
								role: "row",
								"aria-rowindex": e + 2,
								"aria-selected": x === "none" ? void 0 : r,
								"data-row-index": e,
								"data-selected": r || void 0,
								className: "mtc-data-grid-row",
								style: { top: e * N },
								...Fe?.(t),
								onClick: (t) => ht(t, e),
								onMouseDown: (e) => {
									e.detail > 1 && e.preventDefault();
								},
								onDoubleClick: (n) => {
									let r = n.target;
									if (r.closest("a, button, input, select, textarea")) return;
									let i = r.closest("[data-column-id]")?.dataset.columnId;
									T && i ? T(t, i) : ut(e);
								},
								onContextMenu: w ? (t) => {
									t.preventDefault(), x !== "none" && !r && X([n]), V({
										row: e,
										column: B.column
									}), dt(e, t.clientX, t.clientY);
								} : void 0,
								children: q.map((a, o) => {
									if (a.kind === "select") return /* @__PURE__ */ g("div", {
										role: "gridcell",
										className: "mtc-data-grid-cell mtc-data-grid-select",
										...$(e, o),
										children: /* @__PURE__ */ g("input", {
											type: "checkbox",
											tabIndex: -1,
											"data-grid-select": "true",
											"aria-label": j("dataGrid.selectRow", { label: at(t) }),
											checked: r,
											onMouseDown: (e) => e.preventDefault(),
											onChange: (e) => Q(n, e.nativeEvent.shiftKey === !0)
										})
									}, "__select");
									let { column: c } = a, l = v(c, t), te = u(l, c.kind, c.format), re = c.align === "end" || !c.align && !c.cell && ee(te.kind), d = c.cell ? c.cell(t, {
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
										"data-align": re ? "end" : "start",
										...$(e, o),
										children: i && o === et ? /* @__PURE__ */ g("a", {
											href: i,
											tabIndex: -1,
											"data-row-link": "true",
											className: "mtc-data-grid-row-link",
											onClick: s(ke ? (e) => ke(t, e) : void 0),
											children: d
										}) : d
									}, c.id);
								})
							}, n);
						}),
						Y && Array.from({ length: ve }, (e, t) => /* @__PURE__ */ g("div", {
							role: "row",
							"aria-hidden": "true",
							className: "mtc-data-grid-row",
							"data-skeleton": "true",
							style: { top: t * N },
							children: q.map((e, n) => /* @__PURE__ */ g("div", {
								className: "mtc-data-grid-cell",
								children: /* @__PURE__ */ g(re, { width: `${50 + (t * 7 + n * 13) % 40}%` })
							}, n))
						}, `__skeleton-${t}`)),
						Y && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-visually-hidden",
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								children: j("dataGrid.loading")
							})
						}),
						O && G.length > 0 && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-status-row",
							style: { top: G.length * N },
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								"aria-colspan": q.length,
								className: "mtc-data-grid-cell",
								children: j("dataGrid.loadingMore")
							})
						}),
						nt && /* @__PURE__ */ g("div", {
							role: "row",
							className: "mtc-data-grid-row mtc-data-grid-empty-row",
							style: {
								top: 0,
								height: ye
							},
							children: /* @__PURE__ */ g("div", {
								role: "gridcell",
								"aria-colspan": q.length,
								className: "mtc-data-grid-cell",
								children: Ae ?? /* @__PURE__ */ g(i, {
									compact: !0,
									title: j("dataGrid.empty")
								})
							})
						})
					]
				})]
			}),
			Pe && /* @__PURE__ */ g("div", {
				className: "mtc-data-grid-footer",
				children: Pe
			}),
			W && bt !== void 0 && w && (() => {
				let e = /* @__PURE__ */ g("div", {
					ref: Ve,
					className: "mtc-data-grid-menu-layer",
					children: /* @__PURE__ */ g(d, {
						label: j("dataGrid.rowActions", { label: at(bt) }),
						items: w(bt),
						initialIndex: 0,
						style: {
							position: "fixed",
							left: W.x,
							top: W.y
						},
						onClose: ft
					})
				});
				return ze ? se(e, ze) : e;
			})()
		]
	});
}
//#endregion
export { y as t };
