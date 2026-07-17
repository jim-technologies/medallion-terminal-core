import { n as e, t } from "./connectFraming-C7uFpPlK.js";
import { n, r, t as i } from "./states-DIrF7Fp0.js";
import { n as a, t as o } from "./DashboardContext-BKgLoCrb.js";
import { a as s, c, i as l, l as u, n as d, o as f, r as p, s as m, t as h } from "./resolveSource-BZ3Z0pkp.js";
import { n as g, r as _, t as v } from "./NowContext-9hD6X8q-.js";
import { i as y, n as b, r as x, t as S } from "./platformShapes-B_Kc4Hcr.js";
import { a as C, c as w, d as T, i as E, l as D, n as O, o as k, r as A, s as j, t as M, u as N } from "./recordShapes-wPKS5pGj.js";
import { n as P, r as F, t as I } from "./HoverContext-CPeSKkmc.js";
import { a as L, c as ee, d as te, i as ne, l as re, n as ie, o as ae, r as oe, s as se, t as ce, u as le } from "./format-V6rpoQ-_.js";
import { a as ue, i as de, n as R, r as z, t as B } from "./colors-DjPEDFCT.js";
import { n as fe, r as V, t as pe } from "./textNormalize-Ba1I6dwH.js";
import { t as me } from "./useAnimatedNumber-R8_seRAC.js";
import { i as he, n as ge, r as _e, t as H } from "./useWatchAction-DzSgZqJt.js";
import { t as ve } from "./useSubmitAction-DySSpR_6.js";
import { _ as ye, a as be, c as xe, d as Se, f as Ce, g as we, h as Te, i as Ee, l as De, m as Oe, n as ke, o as Ae, p as je, r as Me, s as Ne, t as Pe, u as Fe } from "./fileBrowserHelpers-BhGqOPPa.js";
import { n as Ie, t as Le } from "./RecordFields-D2lNy29U.js";
import { Component as Re, Suspense as ze, lazy as Be, useCallback as U, useEffect as W, useId as Ve, useMemo as G, useRef as K, useState as q } from "react";
import { Fragment as He, jsx as J, jsxs as Y } from "react/jsx-runtime";
import { Area as Ue, AreaChart as We, Bar as Ge, BarChart as Ke, Brush as qe, CartesianGrid as Je, Cell as Ye, Legend as Xe, Line as Ze, LineChart as Qe, Pie as $e, PieChart as et, PolarAngleAxis as tt, PolarGrid as nt, PolarRadiusAxis as rt, Radar as it, RadarChart as at, ReferenceArea as ot, ReferenceDot as st, ReferenceLine as ct, ResponsiveContainer as lt, Scatter as ut, ScatterChart as dt, Tooltip as ft, Treemap as pt, XAxis as mt, YAxis as ht, ZAxis as gt } from "recharts";
import { CandlestickSeries as _t, ColorType as vt, HistogramSeries as yt, createChart as bt, createSeriesMarkers as xt } from "lightweight-charts";
//#region \0rolldown/runtime.js
var St = Object.defineProperty, X = (e, t) => {
	let n = {};
	for (var r in e) St(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || St(n, Symbol.toStringTag, { value: "Module" }), n;
};
//#endregion
//#region src/hooks/useBreakpoint.ts
function Ct() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function wt() {
	let [e, t] = q(Ct);
	return W(() => {
		let e = () => t(Ct());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e;
}
//#endregion
//#region src/core/getNested.ts
function Tt(e, t) {
	return t ? t.split(".").reduce((e, t) => {
		if (e != null) {
			if (Array.isArray(e)) {
				let n = Number(t);
				return Number.isInteger(n) ? e[n] : void 0;
			}
			if (typeof e == "object") return e[t];
		}
	}, e) : e;
}
//#endregion
//#region src/hooks/useDataSource.ts
function Et(e) {
	return e.inline ?? e.data;
}
function Dt(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function Ot(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function kt(e) {
	e.signal.aborted || e.abort();
}
var At = 3e4, jt = 1e3;
function Mt(e, t) {
	return t ? Tt(e, t) : e;
}
var Nt = /* @__PURE__ */ new Set([
	"timeseries",
	"candles",
	"table",
	"metric",
	"gauge",
	"heatmap",
	"events",
	"distribution",
	"text",
	"orderbook",
	"paired_grid",
	"embed",
	"assets",
	"object",
	"graph",
	"repository",
	"records"
]);
function Pt(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = Object.keys(e);
	return t.length === 1 && Nt.has(t[0]) ? e[t[0]] : e;
}
function Ft(n) {
	let [r, i] = q(null), [a, o] = q(!0), [s, c] = q(null), [l, u] = q(null), [d, f] = q(!1), [p, m] = q(null), [h, g] = q(0), _ = U(() => g((e) => e + 1), []), v = K(jt), y = K(void 0), b = K(null), x = K(void 0), S = K(0), C = U((e) => {
		let t = Mt(Pt(e), n?.transform);
		i(t), c(null), o(!1), u(Date.now()), S.current = Date.now();
	}, [n?.transform]), w = U((e) => {
		let t = n?.throttleMs ?? 0;
		if (t <= 0) {
			C(e);
			return;
		}
		let r = Date.now() - S.current;
		if (r >= t) {
			C(e);
			return;
		}
		b.current = e, x.current ||= setTimeout(() => {
			b.current !== null && C(b.current), b.current = null, x.current = void 0;
		}, t - r);
	}, [C, n?.throttleMs]), T = G(() => n ? JSON.stringify([
		n.url,
		n.source_id,
		n.method,
		n.body,
		n.headers,
		n.stream,
		Dt(n),
		n.transform,
		n.throttleMs,
		n.inline !== void 0 || n.data !== void 0
	]) : "", [n]), E = n ? Et(n) : void 0;
	return W(() => {
		if (!n) {
			o(!1);
			return;
		}
		if (E !== void 0) {
			w(E);
			return;
		}
		if (!n.url) {
			o(!1);
			return;
		}
		if (n.stream === "connect") {
			let r = !1, i = new AbortController(), a = async () => {
				if (!r) try {
					let a = await fetch(n.url, {
						method: "POST",
						headers: {
							...n.headers,
							"Content-Type": t
						},
						body: JSON.stringify(n.body ?? {}),
						signal: i.signal
					});
					if (!a.ok) throw Error(`ConnectRPC: HTTP ${a.status}`);
					if (!a.body) throw Error("ConnectRPC: no response body");
					f(!0), m(null), c(null), v.current = jt;
					let o = a.body.getReader();
					await e(o, {
						onMessage: w,
						onTrailer: (e) => {
							if (e.error) {
								let t = e.error.code ?? "unknown", n = e.error.message ?? "stream error";
								r || c(`${t}: ${n}`);
							}
						},
						isDisposed: () => r
					}), o.releaseLock();
				} catch (e) {
					!r && e instanceof Error && !Ot(e) && c(e.message);
				} finally {
					if (!r) {
						f(!1);
						let e = v.current;
						m(Date.now() + e), y.current = setTimeout(() => {
							v.current = Math.min(v.current * 2, At), a();
						}, e);
					}
				}
			};
			return a(), () => {
				r = !0, kt(i), clearTimeout(y.current), f(!1), m(null);
			};
		}
		if (n.stream === !0) {
			let e = null, t = !1, r = () => {
				t || (e = new EventSource(n.url), e.onopen = () => {
					f(!0), m(null), c(null), v.current = jt;
				}, e.onmessage = (e) => {
					try {
						w(JSON.parse(e.data));
					} catch {
						c("Failed to parse stream");
					}
				}, e.onerror = () => {
					if (e?.close(), f(!1), !t) {
						let e = v.current;
						m(Date.now() + e), y.current = setTimeout(() => {
							v.current = Math.min(v.current * 2, At), r();
						}, e);
					}
				});
			};
			return r(), () => {
				t = !0, clearTimeout(y.current), e?.close(), f(!1), m(null);
			};
		}
		let r = !1, i = !1, a = new AbortController(), s = async () => {
			if (!(r || i)) {
				i = !0;
				try {
					let e = await fetch(n.url, {
						method: n.method || "GET",
						headers: n.headers,
						body: n.body ? JSON.stringify(n.body) : void 0,
						signal: a.signal
					});
					if (!e.ok) throw Error(`HTTP ${e.status}`);
					let t = await e.json();
					r || w(t);
				} catch (e) {
					!r && e instanceof Error && !Ot(e) && c(e.message);
				} finally {
					i = !1, r || o(!1);
				}
			}
		};
		s();
		let l, u = Dt(n);
		return u && u > 0 && (l = setInterval(() => void s(), u)), () => {
			r = !0, kt(a), l && clearInterval(l);
		};
	}, [
		T,
		w,
		E,
		h
	]), W(() => () => {
		x.current && clearTimeout(x.current);
	}, []), {
		data: r,
		loading: a,
		error: s,
		lastUpdated: l,
		connected: d,
		nextRetryAt: p,
		refresh: _
	};
}
//#endregion
//#region src/widgets/Placeholder.tsx
function It(e) {
	return /* @__PURE__ */ J(i, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var Z = (e, t) => Be(() => e().then((e) => ({ default: e[t] }))), Lt = /* @__PURE__ */ new Map([
	["timeseries", Z(() => Promise.resolve().then(() => mi), "Timeseries")],
	["candlestick", Z(() => Promise.resolve().then(() => Di), "Candlestick")],
	["table", Z(() => Promise.resolve().then(() => zi), "DataTable")],
	["metric", Z(() => Promise.resolve().then(() => Yi), "Metric")],
	["text", Z(() => Promise.resolve().then(() => ta), "Text")],
	["prompt", Z(() => Promise.resolve().then(() => oa), "Prompt")],
	["gauge", Z(() => Promise.resolve().then(() => ca), "Gauge")],
	["distribution", Z(() => Promise.resolve().then(() => ma), "Distribution")],
	["heatmap", Z(() => Promise.resolve().then(() => va), "Heatmap")],
	["events", Z(() => Promise.resolve().then(() => Ea), "Events")],
	["catalog", Z(() => Promise.resolve().then(() => Aa), "Catalog")],
	["asset_catalog", Z(() => Promise.resolve().then(() => Pa), "AssetCatalog")],
	["object_view", Z(() => Promise.resolve().then(() => za), "ObjectView")],
	["code_browser", Z(() => Promise.resolve().then(() => qa), "CodeBrowser")],
	["record_grid", Z(() => Promise.resolve().then(() => Xa), "RecordGrid")],
	["record_board", Z(() => Promise.resolve().then(() => eo), "RecordBoard")],
	["record_calendar", Z(() => Promise.resolve().then(() => ao), "RecordCalendar")],
	["record_form", Z(() => Promise.resolve().then(() => po), "RecordForm")],
	["orderbook", Z(() => Promise.resolve().then(() => go), "OrderBook")],
	["paired_grid", Z(() => Promise.resolve().then(() => wo), "PairedGrid")],
	["trade", Z(() => Promise.resolve().then(() => Mo), "Trade")],
	["ticker", Z(() => Promise.resolve().then(() => Fo), "Ticker")],
	["volume_profile", Z(() => Promise.resolve().then(() => Vo), "VolumeProfile")],
	["stat_strip", Z(() => Promise.resolve().then(() => Ko), "StatStrip")],
	["bar_chart", Z(() => Promise.resolve().then(() => $o), "BarChart")],
	["scatter", Z(() => Promise.resolve().then(() => ss), "Scatter")],
	["clock", Z(() => Promise.resolve().then(() => hs), "Clock")],
	["treemap", Z(() => Promise.resolve().then(() => Cs), "Treemap")],
	["image", Z(() => Promise.resolve().then(() => Os), "Image")],
	["iframe", Z(() => Promise.resolve().then(() => js), "Iframe")],
	["histogram", Z(() => Promise.resolve().then(() => Ps), "Histogram")],
	["section", Z(() => Promise.resolve().then(() => Us), "Section")],
	["area_chart", Z(() => Promise.resolve().then(() => Gs), "AreaChart")],
	["slider", Z(() => Promise.resolve().then(() => ec), "Slider")],
	["select", Z(() => Promise.resolve().then(() => ac), "Select")],
	["boxplot", Z(() => Promise.resolve().then(() => lc), "Boxplot")],
	["radar", Z(() => Promise.resolve().then(() => hc), "Radar")],
	["dag", Z(() => Promise.resolve().then(() => Sc), "Dag")],
	["multi_select", Z(() => Promise.resolve().then(() => Nc), "MultiSelect")],
	["json", Z(() => Promise.resolve().then(() => Fc), "Json")],
	["sparkline", Z(() => Promise.resolve().then(() => Rc), "Sparkline")],
	["action_log", Z(() => Promise.resolve().then(() => Vc), "ActionLog")],
	["alert_log", Z(() => Promise.resolve().then(() => Jc), "AlertLog")],
	["tape", Z(() => Promise.resolve().then(() => Qc), "Tape")],
	["file_browser", Z(() => Promise.resolve().then(() => yl), "FileBrowser")]
]), Rt = new Set(Lt.keys());
function zt(e) {
	return Lt.get(e) || It;
}
function Bt(e, t) {
	Lt.set(e, t);
}
//#endregion
//#region src/core/ErrorBoundary.tsx
var Vt = class extends Re {
	state = { error: null };
	static getDerivedStateFromError(e) {
		return { error: e };
	}
	componentDidCatch(e, t) {
		console.error("[MedallionTerminal] Widget error:", e, t.componentStack), this.props.onError?.(e);
	}
	render() {
		return this.state.error ? /* @__PURE__ */ J("div", {
			className: "flex items-center justify-center h-full text-red-400/80 text-sm p-4 text-center",
			children: /* @__PURE__ */ Y("div", { children: [/* @__PURE__ */ J("div", {
				className: "font-medium mb-1",
				children: "Widget Error"
			}), /* @__PURE__ */ J("div", {
				className: "text-zinc-500 text-xs",
				children: this.state.error.message
			})] })
		}) : this.props.children;
	}
}, Ht = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Ut(e, t) {
	let n = Gt(t);
	return n ? Yt(n, e) : !1;
}
function Wt(e) {
	return Gt(e) !== null;
}
function Gt(e) {
	let t = e.trim();
	if (!t) return null;
	let n = Kt(t, "||"), r = [];
	for (let e of n) {
		let t = Kt(e, "&&"), n = [];
		for (let e of t) {
			let t = qt(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function Kt(e, t) {
	let n = [], r = 0, i = 0, a = !1;
	for (let o = 0; o < e.length; o++) {
		let s = e[o];
		if (s === "\"" && (a = !a), !a) {
			if (!a && e.startsWith(t, o)) {
				n.push(e.slice(i, o)), i = o + t.length, o += t.length - 1;
				continue;
			}
			s === "(" && r++, s === ")" && r--;
		}
	}
	return n.push(e.slice(i)), n.map((e) => e.trim());
}
function qt(e) {
	let t = e.trim().match(Ht);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: Jt(i.trim())
	};
}
function Jt(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function Yt(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!Xt(Tt(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function Xt(e, t, n) {
	if (t === ">" || t === ">=" || t === "<" || t === "<=") {
		let r = Number(e), i = Number(n);
		if (!Number.isFinite(r) || !Number.isFinite(i)) return !1;
		switch (t) {
			case ">": return r > i;
			case ">=": return r >= i;
			case "<": return r < i;
			case "<=": return r <= i;
		}
	}
	return t === "==" ? e === n || typeof e == "number" && typeof n == "number" && e === n : t === "!=" && !(e === n || typeof e == "number" && typeof n == "number" && e === n);
}
//#endregion
//#region src/core/sound.ts
var Zt = {
	warn: 720,
	error: 480
}, Qt = 160, $t = .08, en = null;
function tn() {
	if (typeof window > "u") return null;
	if (en) return en;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (en = new t(), en) : null;
}
function nn(e) {
	let t = Zt[e];
	if (!t) return;
	let n = tn();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime($t, a + .02), i.gain.linearRampToValueAtTime(0, a + Qt / 1e3), r.start(a), r.stop(a + Qt / 1e3 + .05);
}
//#endregion
//#region src/export/flatten.ts
var rn = {
	columns: [],
	rows: []
};
function an(e) {
	if (e == null) return null;
	let t = typeof e;
	if (t === "number" || t === "boolean" || t === "string") return e;
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
function Q(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of Object.keys(r)) n.has(e) || (n.add(e), t.push(e));
	return {
		columns: t,
		rows: e.map((e) => {
			let n = {};
			for (let r of t) n[r] = an(e[r]);
			return n;
		})
	};
}
function $(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function on(e) {
	let t = (e) => Array.isArray(e) ? e : $(e) && Array.isArray(e.points) ? e.points : null;
	if ($(e) && Array.isArray(e.series)) {
		let t = e.series, n = /* @__PURE__ */ new Map(), r = [];
		for (let e = 0; e < t.length; e++) {
			let i = t[e], a = i.name ?? `series_${e + 1}`;
			r.push(a);
			let o = i.points ?? i.data ?? [];
			for (let e of o) {
				let t = String(e.timestamp ?? ""), r = n.get(t) ?? { timestamp: t };
				r[a] = an(e.value), n.set(t, r);
			}
		}
		return {
			columns: ["timestamp", ...r],
			rows: [...n.values()]
		};
	}
	let n = t(e);
	return n ? {
		columns: ["timestamp", "value"],
		rows: n.map((e) => ({
			timestamp: an(e.timestamp),
			value: an(e.value)
		}))
	} : null;
}
function sn(e) {
	return $(e) && Array.isArray(e.bars) ? Q(e.bars) : null;
}
function cn(e) {
	if (Array.isArray(e) && e.length > 0 && $(e[0])) return Q(e);
	if ($(e) && "rows" in e) {
		let t = e, n = Array.isArray(t.columns) ? t.columns : [];
		if (n.length > 0 && $(n[0])) {
			let e = n.map((e) => e.key);
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, an(t[n])])) : ln(t, e))
			};
		}
		if (n.length > 0 && typeof n[0] == "string") {
			let e = n;
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, an(t[n])])) : ln(t, e))
			};
		}
		let r = t.rows;
		return r.length > 0 && $(r[0]) ? Q(r) : rn;
	}
	return null;
}
function ln(e, t) {
	let n = {};
	for (let r of t) n[r] = an(e[r]);
	return n;
}
function un(e) {
	return $(e) && Array.isArray(e.cells) ? Q(e.cells) : null;
}
function dn(e) {
	return $(e) && Array.isArray(e.slices) ? Q(e.slices) : null;
}
function fn(e) {
	return $(e) && Array.isArray(e.events) ? Q(e.events) : null;
}
function pn(e) {
	return $(e) && Array.isArray(e.items) ? Q(e.items) : null;
}
function mn(e) {
	if ($(e) && (Array.isArray(e.bids) || Array.isArray(e.asks))) {
		let t = e.bids ?? [], n = e.asks ?? [];
		return Q([...t.map((e) => ({
			side: "bid",
			...e
		})), ...n.map((e) => ({
			side: "ask",
			...e
		}))]);
	}
	return null;
}
function hn(e) {
	return typeof e == "number" ? {
		columns: ["value"],
		rows: [{ value: e }]
	} : $(e) && "value" in e && typeof e.value != "object" ? Q([e]) : null;
}
function gn(e) {
	if ($(e) && "value" in e) {
		let { value: t, min: n, max: r } = e;
		return Q([{
			value: t,
			min: n,
			max: r
		}]);
	}
	return null;
}
function _n(e) {
	let t = S(e);
	return t.items.length === 0 ? null : Q(t.items.map((e) => ({
		id: e.id,
		name: e.name,
		kind: e.kind,
		description: e.description,
		owner: e.owner,
		status: e.status,
		updated_at: e.updatedAt,
		tags: e.tags,
		url: e.url,
		metadata: e.metadata,
		context: e.context
	})));
}
function vn(e) {
	let t = x(e);
	if (!t) return null;
	let n = {
		object_type: t.objectType,
		object_id: t.objectId,
		title: t.title,
		description: t.description,
		status: t.status,
		updated_at: t.updatedAt,
		tags: t.tags
	};
	for (let e of t.properties) n[e.key] = e.value;
	return t.links.length > 0 && (n.links = t.links), t.actions.length > 0 && (n.actions = t.actions), Q([n]);
}
function yn(e) {
	let t = b(e);
	return t ? Q([...t.nodes.map((e) => ({
		record_type: "node",
		id: e.id,
		label: e.label,
		kind: e.kind,
		status: e.status,
		subtitle: e.subtitle,
		tags: e.tags,
		metadata: e.metadata,
		context: e.context
	})), ...t.edges.map((e) => ({
		record_type: "edge",
		from: e.from,
		to: e.to,
		label: e.label,
		kind: e.kind,
		status: e.status
	}))]) : null;
}
function bn(e) {
	let t = y(e);
	return t ? t.entries.length > 0 ? Q(t.entries.map((e) => ({
		repository: t.repository,
		ref: t.ref,
		path: e.path,
		name: e.name,
		kind: e.kind,
		language: e.language,
		size_bytes: e.sizeBytes,
		updated_at: e.updatedAt
	}))) : t.file ? Q([{
		repository: t.repository,
		ref: t.ref,
		path: t.file.path,
		language: t.file.language,
		size_bytes: t.file.sizeBytes,
		truncated: t.file.truncated,
		content: t.file.content,
		url: t.file.url
	}]) : null : null;
}
function xn(e) {
	let t = k(e);
	return t ? Q(t.records.map((e) => ({
		id: e.id,
		...e.values,
		created_at: e.createdAt,
		updated_at: e.updatedAt,
		revision: e.revision
	}))) : null;
}
var Sn = {
	timeseries: on,
	area_chart: on,
	sparkline: on,
	candlestick: sn,
	table: cn,
	heatmap: un,
	distribution: dn,
	events: fn,
	tape: fn,
	action_log: fn,
	alert_log: fn,
	text: pn,
	ticker: pn,
	orderbook: mn,
	metric: hn,
	gauge: gn,
	asset_catalog: _n,
	object_view: vn,
	dag: yn,
	code_browser: bn,
	record_grid: xn,
	record_board: xn,
	record_calendar: xn,
	record_form: xn,
	SHAPE_TIMESERIES: on,
	SHAPE_CANDLES: sn,
	SHAPE_TABLE: cn,
	SHAPE_METRIC: hn,
	SHAPE_GAUGE: gn,
	SHAPE_HEATMAP: un,
	SHAPE_EVENTS: fn,
	SHAPE_DISTRIBUTION: dn,
	SHAPE_TEXT: pn,
	SHAPE_ORDERBOOK: mn,
	SHAPE_ASSET_CATALOG: _n,
	SHAPE_OBJECT: vn,
	SHAPE_GRAPH: yn,
	SHAPE_REPOSITORY: bn,
	SHAPE_RECORD_SET: xn
};
function Cn(e) {
	if (e == null) return rn;
	if (Array.isArray(e)) return e.length === 0 ? rn : $(e[0]) ? Q(e) : {
		columns: ["value"],
		rows: e.map((e) => ({ value: an(e) }))
	};
	if ($(e)) {
		let t = Object.entries(e).find(([, e]) => Array.isArray(e));
		return t && $(t[1][0]) ? Q(t[1]) : Q([e]);
	}
	return {
		columns: ["value"],
		rows: [{ value: an(e) }]
	};
}
function wn(e, t) {
	if (e == null) return rn;
	if (t) {
		let n = Sn[t];
		if (n) {
			let t = n(e);
			if (t) return t;
		}
	}
	for (let t of [
		on,
		sn,
		un,
		dn,
		fn,
		pn,
		mn,
		_n,
		vn,
		yn,
		bn,
		xn,
		gn,
		hn,
		cn
	]) {
		let n = t(e);
		if (n && n.rows.length > 0) return n;
	}
	return Cn(e);
}
//#endregion
//#region src/export/serializers.ts
var Tn = {
	csv: "text/csv;charset=utf-8",
	json: "application/json;charset=utf-8",
	ndjson: "application/x-ndjson;charset=utf-8",
	parquet: "application/vnd.apache.parquet"
}, En = {
	csv: "csv",
	json: "json",
	ndjson: "ndjson",
	parquet: "parquet"
}, Dn = [
	{
		key: "csv",
		label: "CSV"
	},
	{
		key: "parquet",
		label: "Parquet"
	},
	{
		key: "json",
		label: "JSON"
	},
	{
		key: "ndjson",
		label: "NDJSON"
	}
];
function On(e) {
	if (e == null) return "";
	let t = String(e);
	return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function kn(e) {
	let { columns: t, rows: n } = e;
	return [t.map(On).join(","), ...n.map((e) => t.map((t) => On(e[t])).join(","))].join("\n");
}
function An(e) {
	return JSON.stringify(e.rows, null, 2);
}
function jn(e) {
	return e.rows.map((e) => JSON.stringify(e)).join("\n");
}
function Mn(e) {
	return e.columns.map((t) => ({
		name: t,
		data: e.rows.map((e) => e[t] ?? null)
	}));
}
async function Nn(e) {
	let { parquetWriteBuffer: t } = await import("./src-BZ5QG4y5.js"), n = t({ columnData: e.columns.length > 0 ? Mn(e) : [{
		name: "value",
		data: []
	}] });
	return new Uint8Array(n);
}
function Pn(e, t) {
	switch (t) {
		case "csv": return kn(e);
		case "json": return An(e);
		case "ndjson": return jn(e);
	}
}
//#endregion
//#region src/export/exportView.ts
function Fn(e) {
	return e.table ?? wn(e.data, e.component);
}
async function In(e, t) {
	let n = Fn(e);
	if (t === "parquet") {
		let e = await Nn(n);
		return new Blob([e.slice().buffer], { type: Tn.parquet });
	}
	let r = Pn(n, t);
	return new Blob([r], { type: Tn[t] });
}
function Ln(e) {
	return Fn(e).rows.length;
}
function Rn(e, t) {
	return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${En[t]}`;
}
async function zn(e, t, n) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return !1;
	let r = await In(e, t), i = URL.createObjectURL(r), a = document.createElement("a");
	return a.href = i, a.download = Rn(n, t), document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 0), !0;
}
//#endregion
//#region src/widgets/WidgetShell.tsx
function Bn(e, t) {
	if (!t) return null;
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "just now";
	if (n < 60) return `${n}s ago`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function Vn(e) {
	let { resolution: t, loading: i, error: a, data: o, options: s, component: c, widgetId: l, Component: u, onRenderError: d, onRetry: f } = e;
	return t.error ? /* @__PURE__ */ J(n, { message: t.error }) : i ? /* @__PURE__ */ J(r, { component: c }) : a ? /* @__PURE__ */ J(n, {
		message: a,
		onRetry: f
	}) : /* @__PURE__ */ J("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ J(Vt, {
			onError: d,
			children: /* @__PURE__ */ J(ze, {
				fallback: /* @__PURE__ */ J(r, { component: c }),
				children: /* @__PURE__ */ J(u, {
					data: o,
					options: s,
					widgetId: l
				})
			})
		})
	});
}
function Hn({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: o, fullscreenId: s, setFullscreenId: c } = a(), [l, u] = q(!1), [d, f] = q(!1), [p, m] = q(!1), h = K(null);
	W(() => {
		if (!l) return;
		let e = (e) => {
			h.current && !h.current.contains(e.target) && (u(!1), f(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [l]);
	let g = e.source, _ = g?.data !== void 0 && !g.url && !g.source_id, v = !!g && !_, y = !!e.id, b = !!e.id && s !== e.id, x = t == null ? 0 : Ln({
		data: t,
		component: e.component
	}), S = x > 0, C = async (n) => {
		m(!0);
		try {
			let r = await zn({
				data: t,
				component: e.component
			}, n, e.title ?? e.id ?? e.component);
			i(r ? `Exported ${x.toLocaleString()} rows as ${n.toUpperCase()}` : "Export failed", r ? "ok" : "warn");
		} catch {
			i("Export failed", "error");
		} finally {
			m(!1), u(!1), f(!1);
		}
	};
	return /* @__PURE__ */ Y("div", {
		className: "relative",
		ref: h,
		children: [/* @__PURE__ */ J("button", {
			onClick: () => u((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			children: "⋮"
		}), l && /* @__PURE__ */ Y("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				v && /* @__PURE__ */ J("button", {
					onClick: () => {
						n(), u(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ J("button", {
					onClick: async () => {
						await r(), u(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				S && /* @__PURE__ */ Y("div", { children: [/* @__PURE__ */ Y("button", {
					onClick: () => f((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": d,
					children: [/* @__PURE__ */ Y("span", { children: ["Export", p ? "…" : ""] }), /* @__PURE__ */ J("span", {
						className: "text-zinc-600",
						children: d ? "▾" : "▸"
					})]
				}), d && /* @__PURE__ */ J("div", {
					className: "bg-zinc-950/60",
					children: Dn.map((e) => /* @__PURE__ */ J("button", {
						onClick: () => C(e.key),
						disabled: p,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				b && /* @__PURE__ */ J("button", {
					onClick: () => {
						c(e.id), u(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				y && /* @__PURE__ */ J("button", {
					onClick: () => {
						o([{
							targetId: e.id,
							remove: !0
						}]), u(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800",
					children: "Remove"
				})
			]
		})]
	});
}
function Un({ config: e, contentHeight: t, snapshotKey: n }) {
	let { ctx: r, backendUrl: i, refreshIntervalMs: o, compact: s, toast: c, focusedId: l, setFocusedId: d, refreshPulse: f, emit: p, soundEnabled: h, reportWidgetHealth: g, registerWidgetData: v } = a(), y = G(() => e.title ? m(e.title, r) : e.title, [e.title, r]), b = G(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = u(e.source, r, i);
			return o && o > 0 && !t.stream ? {
				source: {
					...t,
					refreshIntervalMs: o
				},
				error: null
			} : {
				source: t,
				error: null
			};
		} catch (e) {
			return {
				source: void 0,
				error: e instanceof Error ? e.message : "Resolution error"
			};
		}
	}, [
		e.source,
		r,
		i,
		o
	]), x = b.source, { data: S, loading: C, error: w, lastUpdated: T, connected: E, nextRetryAt: D, refresh: O } = Ft(x), k = zt(e.component), A = K(S);
	A.current = S, W(() => {
		if (n) return v(n, () => A.current);
	}, [n, v]);
	let j = !!x?.stream || !!(x?.refreshIntervalMs ?? x?.refreshInterval), M = x?.staleAfterMs, N = _(j && T != null || D != null || !!M && T != null), P = !!M && T != null && N - T > M, F = K(0);
	W(() => {
		if (!f) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = f.id === "*";
		n && t === "self" || (n || f.id === e.id) && f.n > F.current && (F.current = f.n, O());
	}, [
		f,
		e.id,
		e.refresh_policy,
		O
	]);
	let I = K(!1);
	W(() => {
		let t = e.alert;
		if (!t || S == null) {
			I.current = !1;
			return;
		}
		let n = Ut(S, t.when);
		if (n && !I.current) {
			let n = m(t.message, r), i = t.severity ?? "warn";
			c(n, i), p({
				type: "alert",
				widgetId: e.id,
				severity: i,
				message: n,
				predicate: t.when
			}), h && nn(i);
		}
		I.current = n;
	}, [
		S,
		e.alert,
		r,
		c,
		p,
		e.id,
		h
	]);
	let L = K(null);
	W(() => {
		let t = b.error ?? w, n = b.error ? "resolve" : "data";
		t && t !== L.current ? (p({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), L.current = t) : t || (L.current = null);
	}, [
		b.error,
		w,
		p,
		e.id,
		e.component
	]), W(() => {
		if (!e.id) return;
		let t = !!x?.stream;
		return g(e.id, {
			title: y || e.title || e.component,
			streaming: t,
			connected: !t || E,
			error: b.error ?? w,
			stale: P
		}), () => g(e.id, null);
	}, [
		e.id,
		y,
		e.title,
		e.component,
		x?.stream,
		E,
		b.error,
		w,
		P,
		g
	]);
	let ee = !!e.id && l === e.id;
	return /* @__PURE__ */ Y("div", {
		onClick: e.id ? () => d(e.id) : void 0,
		className: "mtc-widget overflow-hidden",
		"data-focused": ee ? "true" : "false",
		children: [y && /* @__PURE__ */ Y("div", {
			className: `mtc-widget-header ${s ? "px-2.5 py-1.5" : "px-4 py-2.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ J("h3", {
				className: `${s ? "text-[11px]" : "text-xs"} font-semibold tracking-[0.01em] text-zinc-100 truncate`,
				children: y
			}), /* @__PURE__ */ Y("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					j && T && /* @__PURE__ */ Y("span", {
						className: `text-[10px] ${P ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [P ? "stale · " : "", Bn(N, T)]
					}),
					e.source?.stream && !E && D != null && /* @__PURE__ */ Y("span", {
						className: "text-[10px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((D - N) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ J("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${E ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: E ? "Connected" : D ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ J(Hn, {
						widget: e,
						data: S,
						onToast: c,
						onRefresh: O,
						onCopy: async () => {
							if (S == null) return c("No data to copy", "warn"), !1;
							if (typeof navigator > "u" || !navigator.clipboard) return c("Clipboard unavailable", "warn"), !1;
							try {
								return await navigator.clipboard.writeText(JSON.stringify(S, null, 2)), c(`${e.title ?? e.component} copied`, "ok"), !0;
							} catch {
								return c("Clipboard blocked", "warn"), !1;
							}
						}
					})
				]
			})]
		}), /* @__PURE__ */ J("div", {
			className: s ? "p-2.5" : "p-4",
			style: { height: s ? Math.round(t * .92) : t },
			children: Vn({
				resolution: b,
				loading: C,
				error: w,
				data: S,
				options: e.options,
				component: e.component,
				widgetId: e.id,
				Component: k,
				onRenderError: (t) => p({
					type: "widget_error",
					widgetId: e.id,
					component: e.component,
					message: t.message,
					source: "render"
				}),
				onRetry: x && !(x.inline !== void 0 || x.data !== void 0) ? O : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/applyActions.ts
function Wn(e, t, n) {
	let r = n?.replaceAll ? [] : [...e];
	for (let e of t) {
		let t = r.findIndex((t) => t.id === e.targetId);
		if (e.remove) {
			t >= 0 && r.splice(t, 1);
			continue;
		}
		t >= 0 ? r[t] = {
			...r[t],
			...e.component !== void 0 && { component: e.component },
			...e.title !== void 0 && { title: e.title },
			...e.span !== void 0 && { span: e.span },
			...e.height !== void 0 && { height: e.height },
			...e.source !== void 0 && { source: e.source },
			...e.options !== void 0 && { options: e.options }
		} : r.push({
			id: e.targetId,
			component: e.component || "placeholder",
			title: e.title,
			span: e.span,
			height: e.height,
			source: e.source,
			options: e.options
		});
	}
	return r;
}
//#endregion
//#region src/core/urlState.ts
var Gn = "ctx.";
function Kn(e) {
	let t = {}, n = new URLSearchParams(e);
	for (let [e, r] of n) e.startsWith(Gn) && (t[e.slice(4)] = r);
	return t;
}
function qn(e, t) {
	let n = new URLSearchParams(e);
	for (let e of [...n.keys()]) e.startsWith(Gn) && n.delete(e);
	for (let [e, r] of Object.entries(t)) n.set(`${Gn}${e}`, r);
	return n.toString();
}
//#endregion
//#region src/core/savedViews.ts
var Jn = "medallion-terminal:view:";
function Yn(e, t) {
	if (!(!e || typeof window > "u" || !window.localStorage)) try {
		window.localStorage.setItem(Jn + e, JSON.stringify(t));
	} catch {}
}
function Xn(e) {
	if (!e || typeof window > "u" || !window.localStorage) return null;
	try {
		let t = window.localStorage.getItem(Jn + e);
		if (t == null) return null;
		let n = JSON.parse(t);
		if (!n || typeof n != "object") return null;
		let r = {};
		for (let [e, t] of Object.entries(n)) typeof t == "string" && (r[e] = t);
		return r;
	} catch {
		return null;
	}
}
function Zn() {
	if (typeof window > "u" || !window.localStorage) return [];
	let e = [];
	for (let t = 0; t < window.localStorage.length; t++) {
		let n = window.localStorage.key(t);
		n && n.startsWith(Jn) && e.push(n.slice(24));
	}
	return e.sort();
}
function Qn(e) {
	if (!(!e || typeof window > "u" || !window.localStorage)) try {
		window.localStorage.removeItem(Jn + e);
	} catch {}
}
//#endregion
//#region src/core/CommandPalette.tsx
var $n = /* @__PURE__ */ new Set([
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
]), er = 150, tr = 8;
function nr(e, t) {
	let n = e.trim();
	if (!n) return null;
	if (n.startsWith("/")) {
		let [e, ...t] = n.slice(1).split(/\s+/), r = t.join(" ").trim();
		switch (e.toLowerCase()) {
			case "save": return r ? {
				kind: "save",
				name: r
			} : null;
			case "load":
			case "open": return r ? {
				kind: "load",
				name: r
			} : null;
			case "delete":
			case "rm": return r ? {
				kind: "delete",
				name: r
			} : null;
			default: return { kind: "noop" };
		}
	}
	let r = n.split(/\s+/);
	if (r.length > 1) {
		let e = [], t = !0;
		for (let n of r) {
			let r = n.match(/^([a-zA-Z_][a-zA-Z0-9_]*)[:=](.+)$/);
			if (!r) {
				t = !1;
				break;
			}
			e.push([r[1].toLowerCase(), r[2]]);
		}
		if (t && e.length > 1) return {
			kind: "set_many",
			pairs: e
		};
	}
	let i = n.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/);
	if (i) return {
		kind: "set",
		key: i[1].toLowerCase(),
		value: i[2].trim()
	};
	let a = n.indexOf(" ");
	return a > 0 ? {
		kind: "set",
		key: n.slice(0, a).toLowerCase(),
		value: n.slice(a + 1).trim()
	} : $n.has(n.toLowerCase()) ? {
		kind: "set",
		key: "range",
		value: n.toLowerCase()
	} : {
		kind: "set",
		key: t,
		value: n
	};
}
function rr({ suggest: e } = {}) {
	let { ctx: t, setCtx: n, toast: r } = a(), [i, o] = q(!1), [s, c] = q(""), [l, u] = q([]), [d, f] = q(-1), p = K(null), [m, h] = q([]), g = K(0);
	W(() => {
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" ? (e.preventDefault(), o((e) => !e)) : e.key === "Escape" && o(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), W(() => {
		i ? p.current?.focus() : (c(""), f(-1), h([]));
	}, [i]), W(() => {
		if (!e || !i) return;
		let t = s.trim();
		if (!t) {
			h([]);
			return;
		}
		let n = ++g.current, r = setTimeout(async () => {
			try {
				let r = await e(t);
				if (n !== g.current) return;
				h(r.slice(0, tr));
			} catch {
				n === g.current && h([]);
			}
		}, er);
		return () => clearTimeout(r);
	}, [
		s,
		i,
		e
	]);
	let _ = G(() => Object.keys(t)[0] ?? "symbol", [t]), v = G(() => i ? Zn() : [], [i, l]);
	if (!i) return null;
	let y = () => {
		let e = nr(s, _);
		if (!e || e.kind === "noop") {
			o(!1);
			return;
		}
		if (e.kind === "save") Yn(e.name, t), r(`Saved "${e.name}"`, "ok");
		else if (e.kind === "load") {
			let t = Xn(e.name);
			if (!t) r(`No view named "${e.name}"`, "warn");
			else {
				for (let [e, r] of Object.entries(t)) n(e, r);
				r(`Loaded "${e.name}"`, "ok");
			}
		} else if (e.kind === "delete") Qn(e.name), r(`Deleted "${e.name}"`, "ok");
		else if (e.kind === "set") n(e.key, e.value);
		else if (e.kind === "set_many") for (let [t, r] of e.pairs) n(t, r);
		u((e) => [s, ...e.filter((e) => e !== s)].slice(0, 5)), o(!1);
	}, b = (e) => {
		if (l.length === 0) return;
		let t = Math.max(-1, Math.min(l.length - 1, d + e));
		f(t), c(t === -1 ? "" : l[t]);
	}, x = (e) => {
		for (let [t, r] of Object.entries(e.ctx)) n(t, r);
		o(!1);
	};
	return /* @__PURE__ */ J("div", {
		className: "mtc-overlay fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4",
		onClick: () => o(!1),
		children: /* @__PURE__ */ Y("div", {
			className: "mtc-popover w-full max-w-lg overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ J("input", {
					ref: p,
					type: "text",
					value: s,
					onChange: (e) => c(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" ? (e.preventDefault(), y()) : e.key === "ArrowUp" ? (e.preventDefault(), b(1)) : e.key === "ArrowDown" && (e.preventDefault(), b(-1));
					},
					placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
					className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
				}),
				m.length > 0 && /* @__PURE__ */ J("div", {
					className: "border-b border-zinc-800 max-h-72 overflow-auto",
					children: m.map((e, t) => /* @__PURE__ */ Y("button", {
						onClick: () => x(e),
						className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
						children: [
							/* @__PURE__ */ J("span", {
								className: "text-zinc-100",
								children: e.label
							}),
							e.hint && /* @__PURE__ */ J("span", {
								className: "ml-2 text-[10px] text-zinc-500 font-mono",
								children: e.hint
							}),
							/* @__PURE__ */ J("span", {
								className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100",
								children: Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")
							})
						]
					}, `${e.label}-${t}`))
				}),
				Object.entries(t).length > 0 && /* @__PURE__ */ Y("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ J("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "current"
					}), Object.entries(t).map(([e, t]) => /* @__PURE__ */ Y("span", {
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono",
						children: [
							e,
							"=",
							t
						]
					}, e))]
				}),
				v.length > 0 && /* @__PURE__ */ Y("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ J("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "views"
					}), v.map((e) => /* @__PURE__ */ J("button", {
						onClick: () => c(`/load ${e}`),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-mono",
						title: `Load view "${e}"`,
						children: e
					}, e))]
				}),
				l.length > 0 && /* @__PURE__ */ Y("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ J("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "recent"
					}), l.map((e, t) => /* @__PURE__ */ J("button", {
						onClick: () => c(e),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono",
						children: e
					}, t))]
				}),
				/* @__PURE__ */ Y("div", {
					className: "px-4 py-2 text-[10px] text-zinc-600 flex justify-between",
					children: [/* @__PURE__ */ J("span", { children: "↵ apply  ·  ↑↓ recall" }), /* @__PURE__ */ J("span", { children: "esc close" })]
				})
			]
		})
	});
}
//#endregion
//#region src/core/ShortcutsOverlay.tsx
var ir = [
	{
		keys: "⌘ K / Ctrl K",
		description: "Open command palette (set ctx, save/load views)"
	},
	{
		keys: "j / ↓",
		description: "Focus next widget"
	},
	{
		keys: "k / ↑",
		description: "Focus previous widget"
	},
	{
		keys: "f",
		description: "Fullscreen focused widget"
	},
	{
		keys: "r",
		description: "Refresh focused widget"
	},
	{
		keys: "↵",
		description: "In palette: apply current input"
	},
	{
		keys: "Esc",
		description: "Clear focus / close palette / close fullscreen"
	},
	{
		keys: "⌘ 1 — 9",
		description: "In multi-tab: jump to tab N"
	},
	{
		keys: "?",
		description: "Show this shortcuts cheat sheet"
	},
	{
		keys: "/save <name>",
		description: "In palette: save current ctx as a named view"
	},
	{
		keys: "/load <name>",
		description: "In palette: restore a saved view"
	},
	{
		keys: "/delete <name>",
		description: "In palette: delete a saved view"
	}
];
function ar(e) {
	return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")}`;
}
function or({ templateShortcuts: e }) {
	let [t, n] = q(!1);
	return W(() => {
		let e = (e) => {
			let t = e.target?.tagName, r = t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable;
			e.key === "?" && !r ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ J("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ Y("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ Y("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ J("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ J("span", {
					className: "text-[10px] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ Y("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [ir.map((e, t) => /* @__PURE__ */ Y("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ J("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ J("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ Y(He, { children: [/* @__PURE__ */ J("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ Y("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ J("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ J("span", {
						className: "text-xs text-zinc-400",
						children: ar(e)
					})]
				}, `tpl-${t}`))] })]
			})]
		})
	}) : null;
}
//#endregion
//#region src/core/Toaster.tsx
var sr = {
	ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
	warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
	error: "border-red-500/40     bg-red-500/10     text-red-200",
	info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, cr = 3500;
function lr({ toasts: e, dismiss: t }) {
	return e.length === 0 ? null : /* @__PURE__ */ J("div", {
		className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none",
		children: e.map((e) => /* @__PURE__ */ J(ur, {
			toast: e,
			dismiss: t
		}, e.id))
	});
}
function ur({ toast: e, dismiss: t }) {
	return W(() => {
		let n = setTimeout(() => t(e.id), cr);
		return () => clearTimeout(n);
	}, [e.id, t]), /* @__PURE__ */ J("div", {
		onClick: () => t(e.id),
		className: `mtc-popover pointer-events-auto cursor-pointer text-xs px-3 py-2 border ${sr[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
		children: e.message
	});
}
//#endregion
//#region src/core/validateTemplate.ts
var dr = /* @__PURE__ */ new Set(/* @__PURE__ */ "timeseries.candlestick.table.metric.text.prompt.gauge.distribution.heatmap.events.catalog.asset_catalog.object_view.code_browser.record_grid.record_board.record_calendar.record_form.orderbook.paired_grid.trade.ticker.volume_profile.stat_strip.bar_chart.scatter.clock.treemap.image.iframe.histogram.section.area_chart.slider.select.boxplot.radar.dag.multi_select.json.sparkline.action_log.alert_log.tape.file_browser".split("."));
function fr(e, t) {
	let n = [];
	if (!e || typeof e != "object") return n.push({
		path: "",
		severity: "error",
		message: "template is not an object"
	}), n;
	if (!Array.isArray(e.widgets)) return n.push({
		path: "widgets",
		severity: "error",
		message: "widgets must be an array"
	}), n;
	let r = t ? /* @__PURE__ */ new Set([...dr, ...t]) : dr;
	return e.widgets.forEach((e, t) => {
		let i = `widgets[${t}]`;
		if (!e || typeof e != "object") {
			n.push({
				path: i,
				severity: "error",
				message: "widget is not an object"
			});
			return;
		}
		if (!e.component || typeof e.component != "string" ? n.push({
			path: `${i}.component`,
			severity: "error",
			message: "missing component"
		}) : r.has(e.component) || n.push({
			path: `${i}.component`,
			severity: "warn",
			message: `unknown component "${e.component}" — register via registerWidget() or fix the spelling`
		}), e.span != null && (!Number.isInteger(e.span) || e.span < 1 || e.span > 12) && n.push({
			path: `${i}.span`,
			severity: "warn",
			message: `span ${e.span} out of range 1..12`
		}), e.refresh_policy != null && e.refresh_policy !== "global" && e.refresh_policy !== "self" && e.refresh_policy !== "manual" && n.push({
			path: `${i}.refresh_policy`,
			severity: "error",
			message: `refresh_policy ${JSON.stringify(e.refresh_policy)} must be "global" | "self" | "manual"`
		}), e.source) {
			let t = e.source, r = [];
			t.source_id && r.push("source_id"), t.url && r.push("url"), (t.inline !== void 0 || t.data !== void 0) && r.push("inline"), r.length > 1 ? n.push({
				path: `${i}.source`,
				severity: "error",
				message: `multiple source modes set (${r.join(", ")}); pick one`
			}) : r.length === 0 && n.push({
				path: `${i}.source`,
				severity: "warn",
				message: "source declared but no mode (source_id / url / inline)"
			}), t.stream && (t.refreshIntervalMs ?? t.refreshInterval) && n.push({
				path: `${i}.source`,
				severity: "warn",
				message: "stream + refreshIntervalMs both set; refresh is ignored on streaming sources"
			});
		}
		e.alert && ((typeof e.alert.when != "string" || !Wt(e.alert.when)) && n.push({
			path: `${i}.alert.when`,
			severity: "error",
			message: `alert predicate ${JSON.stringify(e.alert.when)} does not parse`
		}), (typeof e.alert.message != "string" || !e.alert.message) && n.push({
			path: `${i}.alert.message`,
			severity: "warn",
			message: "alert has no message"
		}));
	}), n;
}
//#endregion
//#region src/core/templateSecurity.ts
var pr = "", mr = [
	"authorization",
	"cookie",
	"proxy-authorization",
	"set-cookie",
	"x-api-key",
	"x-auth-token",
	"x-csrf-token",
	"x-xsrf-token"
], hr = [
	"allow-downloads",
	"allow-popups-to-escape-sandbox",
	"allow-top-navigation",
	"allow-top-navigation-by-user-activation"
], gr = {
	allowRelativeUrls: !0,
	allowedUrlOrigins: [],
	disallowedHeaders: mr,
	minRefreshIntervalMs: 1e3,
	iframeSandbox: {
		disallowedTokens: hr,
		allowScriptsWithSameOrigin: !1
	}
}, _r = [
	"url",
	"upload_url",
	"search_url",
	"ingest_url",
	"download_url",
	"media_url_template"
];
function vr(e, t = gr) {
	let n = [], r = yr(t);
	return !e || typeof e != "object" || !Array.isArray(e.widgets) ? [{
		path: "widgets",
		severity: "error",
		message: "template.widgets must be an array"
	}] : (e.widgets.forEach((e, t) => {
		if (!e || typeof e != "object") return;
		let i = `widgets[${t}]`;
		e.source && Sr(e.source, `${i}.source`, r, n), Cr(e, i, r, n), e.component === "iframe" && wr(e, i, r, n), e.component === "image" && Tr(e, i, r, n);
	}), n);
}
function yr(e) {
	let t = gr.iframeSandbox;
	return {
		allowedUrlOrigins: br(e.allowedUrlOrigins ?? gr.allowedUrlOrigins),
		allowedIframeOrigins: br(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
		allowRelativeUrls: e.allowRelativeUrls ?? gr.allowRelativeUrls,
		allowedHeaders: e.allowedHeaders ? xr(e.allowedHeaders) : void 0,
		disallowedHeaders: xr(e.disallowedHeaders ?? gr.disallowedHeaders),
		minRefreshIntervalMs: e.minRefreshIntervalMs ?? gr.minRefreshIntervalMs,
		maxRefreshIntervalMs: e.maxRefreshIntervalMs,
		iframeSandbox: {
			requiredTokens: [...t.requiredTokens ?? [], ...e.iframeSandbox?.requiredTokens ?? []],
			disallowedTokens: [...t.disallowedTokens ?? [], ...e.iframeSandbox?.disallowedTokens ?? []],
			allowScriptsWithSameOrigin: e.iframeSandbox?.allowScriptsWithSameOrigin ?? t.allowScriptsWithSameOrigin ?? !1
		}
	};
}
function br(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) try {
		t.add(new URL(n).origin);
	} catch {}
	return t;
}
function xr(e) {
	return new Set(e.map((e) => e.trim().toLowerCase()).filter(Boolean));
}
function Sr(e, t, n, r) {
	typeof e.url == "string" && Ar(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Or(e.headers, `${t}.headers`, n, r), kr(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Cr(e, t, n, r) {
	let i = e.options;
	if (!(!i || typeof i != "object")) for (let a of _r) {
		if (e.component === "iframe" && a === "url") continue;
		let o = i[a];
		typeof o != "string" || o === "" || Ar(o, `${t}.options.${a}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
	}
}
function wr(e, t, n, r) {
	let { url: i, sandbox: a } = Er(e);
	i && Ar(i, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), jr(a, `${t}.iframe.sandbox`, n, r);
}
function Tr(e, t, n, r) {
	let i = Dr(e.source), a = typeof i == "string" ? i : i && typeof i == "object" && typeof i.url == "string" ? i.url : void 0;
	a && Ar(a, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
}
function Er(e) {
	let t = e.options, n = Dr(e.source), r, i = "";
	if (typeof n == "string") r = n;
	else if (n && typeof n == "object") {
		let e = n;
		typeof e.url == "string" && (r = e.url), typeof e.sandbox == "string" && (i = e.sandbox);
	}
	return t && typeof t == "object" && (!r && typeof t.url == "string" && (r = t.url), typeof t.sandbox == "string" && (i = t.sandbox)), {
		url: r,
		sandbox: i
	};
}
function Dr(e) {
	return e?.inline ?? e?.data;
}
function Or(e, t, n, r) {
	for (let i of Object.keys(e)) {
		let e = i.trim().toLowerCase();
		if (!e) {
			r.push({
				path: t,
				severity: "error",
				message: "header names must be non-empty"
			});
			continue;
		}
		n.disallowedHeaders.has(e) && r.push({
			path: `${t}.${i}`,
			severity: "error",
			message: `header "${i}" is not allowed`
		}), n.allowedHeaders && !n.allowedHeaders.has(e) && r.push({
			path: `${t}.${i}`,
			severity: "error",
			message: `header "${i}" is not in the allow-list`
		});
	}
}
function kr(e, t, n, r) {
	if (!(e == null || e === 0)) {
		if (!Number.isFinite(e) || e < 0) {
			r.push({
				path: `${t}.refreshIntervalMs`,
				severity: "error",
				message: "refreshIntervalMs must be >= 0"
			});
			return;
		}
		n.minRefreshIntervalMs != null && e < n.minRefreshIntervalMs && r.push({
			path: `${t}.refreshIntervalMs`,
			severity: "error",
			message: `refreshIntervalMs ${e} is below host minimum ${n.minRefreshIntervalMs}`
		}), n.maxRefreshIntervalMs != null && e > n.maxRefreshIntervalMs && r.push({
			path: `${t}.refreshIntervalMs`,
			severity: "error",
			message: `refreshIntervalMs ${e} is above host maximum ${n.maxRefreshIntervalMs}`
		});
	}
}
function Ar(e, t, n, r, i) {
	let a = e.trim();
	if (!a) {
		i.push({
			path: t,
			severity: "error",
			message: "URL must be non-empty"
		});
		return;
	}
	if (Mr(a)) {
		if (Nr(a)) {
			i.push({
				path: t,
				severity: "error",
				message: "relative URL template substitution must appear after a path, query, or hash delimiter"
			});
			return;
		}
		r || i.push({
			path: t,
			severity: "error",
			message: "relative URLs are not allowed by host policy"
		});
		return;
	}
	if (Pr(a).includes("${")) {
		i.push({
			path: t,
			severity: "error",
			message: "URL origin may not contain template substitution"
		});
		return;
	}
	let o;
	try {
		o = new URL(a.replace(/\{[A-Za-z0-9_]+\}/g, "value"));
	} catch {
		i.push({
			path: t,
			severity: "error",
			message: `URL ${JSON.stringify(e)} does not parse`
		});
		return;
	}
	if (o.protocol !== "http:" && o.protocol !== "https:") {
		i.push({
			path: t,
			severity: "error",
			message: `URL protocol ${o.protocol} is not allowed`
		});
		return;
	}
	n.has(o.origin) || i.push({
		path: t,
		severity: "error",
		message: `URL origin ${o.origin} is not allowed`
	});
}
function jr(e, t, n, r) {
	let i = new Set(e.split(/\s+/).map((e) => e.trim()).filter(Boolean));
	for (let e of n.iframeSandbox.requiredTokens) i.has(e) || r.push({
		path: t,
		severity: "error",
		message: `iframe sandbox must include ${e}`
	});
	for (let e of n.iframeSandbox.disallowedTokens) i.has(e) && r.push({
		path: t,
		severity: "error",
		message: `iframe sandbox token ${e} is not allowed`
	});
	!n.iframeSandbox.allowScriptsWithSameOrigin && i.has("allow-scripts") && i.has("allow-same-origin") && r.push({
		path: t,
		severity: "error",
		message: "iframe sandbox may not combine allow-scripts and allow-same-origin"
	});
}
function Mr(e) {
	return !e.startsWith("//") && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function Nr(e) {
	let t = e.indexOf("${");
	if (t === -1) return !1;
	let n = e.slice(0, t);
	return !/[/?#]/.test(n) || /^\/+$/.test(n);
}
function Pr(e) {
	if (e.startsWith("//")) {
		let t = e.slice(2).search(/[/?#]/);
		return t === -1 ? e : e.slice(0, t + 2);
	}
	let t = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/);
	return t ? t[0] : "";
}
//#endregion
//#region src/core/snapshot.ts
function Fr(e, t) {
	return e.id || `__mt_idx_${t}`;
}
function Ir(e) {
	let t = e?.widgets;
	return !Array.isArray(t) || t.length === 0 ? !1 : t.every((e) => {
		let t = e.source;
		if (!t) return !0;
		let n = t.inline !== void 0 || t.data !== void 0, r = !!(t.source_id || t.url);
		return n || !r;
	});
}
function Lr(e, t, n, r, i) {
	let a = t.map((e, t) => {
		let n = r(e, t);
		if (n === void 0) {
			let t = e.source;
			return t && (t.source_id || t.url || t.stream) ? {
				...e,
				source: { inline: null }
			} : e;
		}
		return {
			...e,
			source: { inline: n }
		};
	}), o = {
		...e,
		context: { values: { ...n } },
		widgets: a
	};
	return i && (o.frozenAt = i), o;
}
//#endregion
//#region src/core/Dashboard.tsx
var Rr = {
	metric: 120,
	timeseries: 300,
	candlestick: 400,
	table: 350,
	text: 350,
	prompt: 60,
	gauge: 220,
	distribution: 280,
	heatmap: 320,
	events: 320,
	catalog: 480,
	asset_catalog: 520,
	object_view: 520,
	code_browser: 560,
	record_grid: 520,
	record_board: 520,
	record_calendar: 560,
	record_form: 520,
	orderbook: 380,
	paired_grid: 420,
	trade: 280,
	ticker: 56,
	volume_profile: 380,
	stat_strip: 90,
	bar_chart: 320,
	scatter: 360,
	clock: 100,
	treemap: 380,
	image: 320,
	iframe: 360,
	histogram: 280,
	section: 24,
	area_chart: 280,
	slider: 80,
	select: 80,
	boxplot: 360,
	radar: 380,
	dag: 420,
	multi_select: 100,
	json: 360,
	sparkline: 60,
	action_log: 320,
	alert_log: 320,
	tape: 320,
	file_browser: 520
}, zr = [
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
], Br = 200, Vr = 200;
function Hr({ value: e, onChange: t }) {
	return /* @__PURE__ */ J("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: zr.map((n) => /* @__PURE__ */ J("button", {
			onClick: () => t(n),
			className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${e.toLowerCase() === n ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
			children: n
		}, n))
	});
}
var Ur = [
	{
		label: "Off",
		ms: null
	},
	{
		label: "5s",
		ms: 5e3
	},
	{
		label: "30s",
		ms: 3e4
	},
	{
		label: "1m",
		ms: 6e4
	},
	{
		label: "5m",
		ms: 3e5
	}
];
function Wr({ value: e, onChange: t }) {
	return /* @__PURE__ */ J("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: Ur.map((n) => /* @__PURE__ */ J("button", {
			onClick: () => t(n.ms),
			className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${e === n.ms ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
			title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
			children: n.label
		}, n.label))
	});
}
function Gr() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ Y("button", {
		onClick: () => {
			document.dispatchEvent(new KeyboardEvent("keydown", {
				key: "k",
				metaKey: e,
				ctrlKey: !e,
				bubbles: !0
			}));
		},
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 font-mono",
		title: "Open command palette",
		children: [e ? "⌘" : "Ctrl", " K"]
	});
}
function Kr(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}
function qr(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Jr() {
	let { recentActions: e, widgetHealth: t } = a(), n = _(!0), r = e[0], i = Object.values(t), o = i.filter((e) => e.streaming), s = o.filter((e) => e.connected && !e.error).length, c = i.filter((e) => e.error).length, l = i.filter((e) => e.stale).length, u = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ Y("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ J("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ Y("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ J("span", {
							className: "tabular-nums w-7 shrink-0",
							children: qr(n, r.receivedAt)
						}),
						/* @__PURE__ */ J("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ J("span", {
							className: `uppercase tracking-wider shrink-0 ${u}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ J("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ J("span", {
					className: "text-zinc-600",
					children: "idle"
				})
			}),
			o.length > 0 && /* @__PURE__ */ Y("span", {
				className: s === o.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${s} of ${o.length} streams connected`,
				children: [
					/* @__PURE__ */ Y("span", {
						className: "tabular-nums",
						children: [
							s,
							"/",
							o.length
						]
					}),
					" ",
					/* @__PURE__ */ J("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			l > 0 && /* @__PURE__ */ Y("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${l} widget(s) without recent updates`,
				children: [l, " stale"]
			}),
			c > 0 && /* @__PURE__ */ Y("span", {
				className: "text-red-400 tabular-nums",
				children: [c, " err"]
			}),
			/* @__PURE__ */ J("span", {
				className: "tabular-nums text-zinc-300",
				children: Kr(n)
			})
		]
	});
}
function Yr({ health: e }) {
	let t = Object.values(e);
	if (t.length === 0) return null;
	let n = t.filter((e) => e.streaming), r = n.filter((e) => e.connected && !e.error).length, i = t.filter((e) => e.error);
	if (n.length === 0 && i.length === 0) return null;
	let a = i.map((e) => e.title).join("\n");
	return /* @__PURE__ */ Y("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider",
		children: [n.length > 0 && /* @__PURE__ */ Y("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ Y("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ J("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ Y("span", {
			className: "text-red-400 tabular-nums",
			title: a,
			children: [
				i.length,
				" err",
				i.length === 1 ? "" : "s"
			]
		})]
	});
}
function Xr({ onClick: e }) {
	return /* @__PURE__ */ J("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function Zr({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ Y("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function Qr({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ J("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to comfortable density" : "Switch to compact density",
		children: e ? "Cozy" : "Compact"
	});
}
function $r({ onCopied: e }) {
	return /* @__PURE__ */ J("button", {
		onClick: async () => {
			if (!(typeof navigator > "u" || !navigator.clipboard)) try {
				await navigator.clipboard.writeText(window.location.href), e();
			} catch {}
		},
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Copy current dashboard URL",
		children: "Copy link"
	});
}
function ei({ onClick: e, busy: t }) {
	return /* @__PURE__ */ J("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function ti({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ Y("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ J("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ Y("span", {
				className: "text-zinc-600 normal-case tracking-normal",
				children: ["· ", n]
			}) : null
		]
	});
}
function ni(e) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
	let t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
function ri({ template: e, backendUrl: t, onEvent: n, onCtxChange: r, paletteSuggest: i, chrome: a = "full", onShare: s, theme: c = "dark", templateTrust: l = "untrusted", templateTrustPolicy: u = gr }) {
	let d = wt(), f = e.columns || 12, [p, h] = q(e.widgets), _ = G(() => fr(e), [e]), v = G(() => l === "trusted" ? [] : vr(e, u), [
		e,
		l,
		u
	]), y = G(() => [..._, ...v], [_, v]), b = G(() => y.some((e) => e.severity === "error"), [y]), x = G(() => v.some((e) => e.severity === "error"), [v]), S = G(() => !!e.frozenAt || Ir(e), [e]), [C, w] = q(!1), [T, E] = q(() => {
		let t = e.context?.values ?? {};
		return typeof window > "u" ? t : {
			...t,
			...Kn(window.location.search)
		};
	}), [D, O] = q(() => ci("refreshIntervalMs", null)), [k, A] = q(() => ci("compact", !1)), [j, M] = q(() => ci("soundEnabled", !1));
	W(() => {
		li("refreshIntervalMs", D);
	}, [D]), W(() => {
		li("compact", k);
	}, [k]), W(() => {
		li("soundEnabled", j);
	}, [j]);
	let [N, F] = q(null), [I, L] = q(null), [ee, te] = q(null), [ne, re] = q([]), [ie, ae] = q(!1), oe = K(0), se = K(!1), ce = U((e) => {
		te((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), le = K(n);
	W(() => {
		le.current = n;
	}, [n]);
	let [ue, de] = q([]), R = U(() => de([]), []), [z, B] = q([]), fe = U(() => B([]), []), [V, pe] = q({}), me = U((e, t) => {
		pe((n) => {
			let r = n[e];
			if (t === null) {
				if (!r) return n;
				let t = { ...n };
				return delete t[e], t;
			}
			return r && r.streaming === t.streaming && r.connected === t.connected && r.error === t.error && r.title === t.title && r.stale === t.stale ? n : {
				...n,
				[e]: t
			};
		});
	}, []), he = K(/* @__PURE__ */ new Map()), ge = U((e, t) => (he.current.set(e, t), () => {
		he.current.get(e) === t && he.current.delete(e);
	}), []), _e = K({
		widgets: p,
		ctx: T,
		template: e
	});
	_e.current = {
		widgets: p,
		ctx: T,
		template: e
	};
	let H = U(() => {
		let { widgets: e, ctx: t, template: n } = _e.current;
		return Lr(n, e, t, (e, t) => {
			let n = he.current.get(Fr(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), ve = U((e) => {
		le.current?.(e), e.type === "action" ? de((t) => [{
			receivedAt: Date.now(),
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}, ...t].slice(0, Br)) : e.type === "alert" && B((t) => [{
			receivedAt: Date.now(),
			widgetId: e.widgetId,
			severity: e.severity,
			message: e.message,
			predicate: e.predicate
		}, ...t].slice(0, Vr));
	}, []), ye = U((e, t = "info") => {
		oe.current += 1;
		let n = oe.current;
		re((r) => [...r, {
			id: n,
			message: e,
			severity: t
		}]);
	}, []), be = U(async () => {
		if (!se.current) {
			se.current = !0, ae(!0);
			try {
				let e = H();
				s ? await s(e) : ni(e), ye(s ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				ye(`Snapshot failed: ${t}`, "error");
			} finally {
				se.current = !1, ae(!1);
			}
		}
	}, [
		s,
		H,
		ye
	]), xe = U((e) => {
		re((t) => t.filter((t) => t.id !== e));
	}, []), Se = U((e, t) => {
		E((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	W(() => {
		if (typeof window > "u") return;
		let e = qn(window.location.search, T), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [T]);
	let Ce = K(r);
	W(() => {
		Ce.current = r;
	}, [r]), W(() => {
		Ce.current?.(T);
	}, [T]);
	let we = U((e, t) => {
		h((n) => Wn(n, e, t));
	}, []), Te = (e) => d === "mobile" ? f : d === "tablet" ? Math.min(e, Math.floor(f / 2)) : Math.min(e, f), Ee = G(() => ({
		dispatch: we,
		ctx: T,
		setCtx: Se,
		backendUrl: t,
		widgets: p,
		refreshIntervalMs: D ?? void 0,
		toast: ye,
		compact: k,
		fullscreenId: N,
		setFullscreenId: F,
		focusedId: I,
		setFocusedId: L,
		refreshPulse: ee,
		requestRefresh: ce,
		emit: ve,
		recentActions: ue,
		clearRecentActions: R,
		recentAlerts: z,
		clearRecentAlerts: fe,
		soundEnabled: j,
		widgetHealth: V,
		reportWidgetHealth: me,
		registerWidgetData: ge,
		snapshot: H
	}), [
		we,
		T,
		Se,
		t,
		p,
		D,
		ye,
		k,
		N,
		I,
		ee,
		ce,
		ve,
		ue,
		R,
		z,
		fe,
		j,
		V,
		me,
		ge,
		H
	]);
	W(() => {
		if (!N) return;
		let e = (e) => {
			e.key === "Escape" && F(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [N]), W(() => {
		!I || typeof document > "u" || document.getElementById(`mt-widget-${I}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [I]), W(() => {
		let t = (t) => {
			if (t.metaKey || t.ctrlKey || t.altKey) return;
			let n = t.target?.tagName;
			if (n === "INPUT" || n === "TEXTAREA" || t.target?.isContentEditable) return;
			let r = e.shortcuts?.find((e) => e.key === t.key);
			if (r) {
				t.preventDefault();
				for (let [e, t] of Object.entries(r.ctx)) Se(e, t);
				return;
			}
			let i = p.map((e) => e.id).filter((e) => !!e);
			if (i.length === 0) return;
			let a = (e) => {
				let t = I ? i.indexOf(I) : -1, n = i[(t + e + i.length) % i.length];
				L(n);
			};
			switch (t.key) {
				case "j":
				case "ArrowDown":
					t.preventDefault(), a(1);
					break;
				case "k":
				case "ArrowUp":
					t.preventDefault(), a(-1);
					break;
				case "f":
					I && (t.preventDefault(), F(I));
					break;
				case "r":
					I && (t.preventDefault(), ce(I));
					break;
				case "Escape":
					I && L(null);
					break;
			}
		};
		return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
	}, [
		p,
		I,
		ce,
		e.shortcuts,
		Se
	]);
	let De = !x && N ? p.find((e) => e.id === N) : null;
	return /* @__PURE__ */ J(o.Provider, {
		value: Ee,
		children: /* @__PURE__ */ J("div", {
			className: `mtc-root mtc-theme-${c}`,
			"data-theme": c,
			children: /* @__PURE__ */ J(g, { children: /* @__PURE__ */ Y(P, { children: [
				/* @__PURE__ */ J(rr, { suggest: i }),
				/* @__PURE__ */ J(or, { templateShortcuts: e.shortcuts }),
				/* @__PURE__ */ J(lr, {
					toasts: ne,
					dismiss: xe
				}),
				y.length > 0 && (!C || b) && /* @__PURE__ */ J(ii, {
					issues: y,
					dismissible: !b,
					onDismiss: () => w(!0)
				}),
				/* @__PURE__ */ Y("div", {
					className: "mtc-workspace min-h-full flex flex-col",
					children: [/* @__PURE__ */ Y("div", {
						className: "flex-1",
						children: [(e.title || a === "full") && /* @__PURE__ */ Y("div", {
							className: "mtc-toolbar",
							children: [/* @__PURE__ */ Y("div", {
								className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
								children: [e.title && /* @__PURE__ */ J("h1", {
									className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
									children: m(e.title, T)
								}), a === "full" && /* @__PURE__ */ Y("div", {
									className: "ml-auto flex items-center gap-2 flex-wrap",
									children: [
										S ? /* @__PURE__ */ J(ti, { frozenAt: e.frozenAt }) : /* @__PURE__ */ Y(He, { children: [
											/* @__PURE__ */ J(Yr, { health: V }),
											/* @__PURE__ */ J(Wr, {
												value: D,
												onChange: O
											}),
											/* @__PURE__ */ J(Xr, { onClick: () => ce("*") })
										] }),
										/* @__PURE__ */ J(Zr, {
											enabled: j,
											onToggle: () => M((e) => !e)
										}),
										/* @__PURE__ */ J(Qr, {
											compact: k,
											onToggle: () => A((e) => !e)
										}),
										!S && /* @__PURE__ */ J(ei, {
											onClick: () => void be(),
											busy: ie
										}),
										/* @__PURE__ */ J($r, { onCopied: () => ye("URL copied", "ok") }),
										/* @__PURE__ */ J(Gr, {})
									]
								})]
							}), a === "full" && Object.keys(T).length > 0 && /* @__PURE__ */ Y("div", {
								className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ J("span", {
									className: "text-[9px] uppercase tracking-[0.14em] text-zinc-600 mr-1",
									children: "Context"
								}), Object.entries(T).map(([e, t]) => e === "range" ? /* @__PURE__ */ J(Hr, {
									value: t,
									onChange: (t) => Se(e, t)
								}, e) : /* @__PURE__ */ Y("div", {
									className: "mtc-context-chip px-2 py-1 text-[11px]",
									children: [/* @__PURE__ */ J("span", {
										className: "text-zinc-500 uppercase tracking-wider mr-1",
										children: e
									}), /* @__PURE__ */ J("span", {
										className: "text-zinc-100 font-mono",
										children: t
									})]
								}, e))]
							})]
						}), /* @__PURE__ */ J("div", {
							className: "p-3 md:p-5",
							children: /* @__PURE__ */ J("div", {
								className: "grid gap-3 md:gap-4 items-start",
								style: { gridTemplateColumns: `repeat(${f}, 1fr)` },
								children: x ? /* @__PURE__ */ J(ai, { issues: v }) : p.map((e, t) => /* @__PURE__ */ J("div", {
									id: e.id ? `mt-widget-${e.id}` : void 0,
									style: { gridColumn: `span ${Te(e.span || 6)}` },
									children: /* @__PURE__ */ J(Un, {
										config: e,
										contentHeight: e.height || Rr[e.component] || 280,
										snapshotKey: Fr(e, t)
									})
								}, e.id || t))
							})
						})]
					}), a === "full" && /* @__PURE__ */ J(Jr, {})]
				}),
				De && /* @__PURE__ */ J(oi, {
					widget: De,
					onClose: () => F(null)
				})
			] }) })
		})
	});
}
function ii({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ Y("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ Y("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ Y("div", {
				className: "font-medium uppercase tracking-wider text-[10px] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ Y("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ Y("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ J("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ J("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ J("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ Y("li", {
					className: "opacity-60 text-[10px]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ J("button", {
			onClick: n,
			className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function ai({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ Y("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ J("div", {
				className: "font-medium text-xs uppercase tracking-wider mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ J("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ Y("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ Y("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ J("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ J("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ J("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ Y("li", {
					className: "opacity-60 text-[10px]",
					children: [
						"… and ",
						t.length - 6,
						" more"
					]
				})]
			})
		]
	});
}
function oi({ widget: e, onClose: t }) {
	let n = typeof window < "u" ? Math.floor(window.innerHeight * .82) : 600;
	return /* @__PURE__ */ Y("div", {
		className: "fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: t,
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ J("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ J("button", {
				onClick: t,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ J("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ J(Un, {
				config: e,
				contentHeight: n
			})
		})]
	});
}
var si = "medallion-terminal:";
function ci(e, t) {
	if (typeof window > "u" || !window.localStorage) return t;
	try {
		let n = window.localStorage.getItem(si + e);
		return n == null ? t : JSON.parse(n);
	} catch {
		return t;
	}
}
function li(e, t) {
	if (!(typeof window > "u" || !window.localStorage)) try {
		window.localStorage.setItem(si + e, JSON.stringify(t));
	} catch {}
}
//#endregion
//#region src/core/MultiDashboard.tsx
function ui(e, t) {
	W(() => {
		let n = (n) => {
			if (!(n.metaKey || n.ctrlKey)) return;
			let r = Number(n.key);
			Number.isFinite(r) && r >= 1 && r <= 9 && r <= e && (n.preventDefault(), t(r - 1));
		};
		return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
	}, [e, t]);
}
function di({ tabs: e, activeIndex: t, onSelect: n, backendUrl: r, theme: i = "dark", templateTrust: a, templateTrustPolicy: o }) {
	let s = Math.max(0, Math.min(t, e.length - 1));
	ui(e.length, n);
	let [c, l] = q(() => /* @__PURE__ */ new Set([s]));
	return W(() => {
		l((e) => e.has(s) ? e : /* @__PURE__ */ new Set([...e, s]));
	}, [s]), e.length === 0 ? null : /* @__PURE__ */ J("div", {
		className: `mtc-root mtc-theme-${i}`,
		"data-theme": i,
		children: /* @__PURE__ */ Y("div", {
			className: "mtc-workspace min-h-full",
			children: [/* @__PURE__ */ J(fi, {
				tabs: e,
				activeIndex: s,
				onSelect: n
			}), e.map((e, t) => /* @__PURE__ */ J("div", {
				style: { display: t === s ? "block" : "none" },
				children: c.has(t) && /* @__PURE__ */ J(ri, {
					template: e.template,
					backendUrl: r,
					theme: i,
					templateTrust: a,
					templateTrustPolicy: o
				})
			}, t))]
		})
	});
}
function fi({ tabs: e, activeIndex: t, onSelect: n }) {
	let r = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ J("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ Y("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ J("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ J("span", {
					className: "text-[9px] text-zinc-600 font-mono uppercase tracking-wider",
					children: o
				})]
			}, i);
		})
	});
}
function pi(e = 0) {
	let [t, n] = q(() => {
		if (typeof window > "u") return e;
		let t = Number(new URLSearchParams(window.location.search).get("tab"));
		return Number.isFinite(t) && t >= 0 ? t : e;
	});
	return [t, (e) => {
		if (n(e), typeof window < "u") {
			let t = new URLSearchParams(window.location.search);
			t.set("tab", String(e)), window.history.replaceState(null, "", `${window.location.pathname}?${t.toString()}${window.location.hash}`);
		}
	}];
}
//#endregion
//#region src/widgets/Timeseries.tsx
var mi = /* @__PURE__ */ X({ Timeseries: () => xi }), hi = {
	buy: "var(--mtc-ok)",
	sell: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	warn: "var(--mtc-warning)"
}, gi = "var(--mtc-grid)", _i = "var(--mtc-border)", vi = "var(--mtc-muted)", yi = "var(--mtc-surface)", bi = "var(--mtc-muted-subtle)";
function xi({ data: e, options: t }) {
	let { hoverTime: n, setHoverTime: r } = F(), a = K(null), o = G(() => Ei(e), [e]), { tickFormatter: s, labelFormatter: c } = G(() => {
		let e = te(o?.points.map((e) => e._ts) ?? []);
		return {
			tickFormatter: le(e),
			labelFormatter: re(e)
		};
	}, [o]), l = G(() => de(o?.keys ?? [], B), [o]), u = t?.brush === !0;
	if (!o) return /* @__PURE__ */ J(i, { children: "No data" });
	let d = n != null && n !== a.current;
	return /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ Y(Qe, {
			data: o.points,
			onMouseMove: (e) => {
				let t = e?.activeLabel;
				if (t != null) {
					let e = String(t);
					a.current = e, r(e);
				}
			},
			onMouseLeave: () => {
				a.current = null, r(null);
			},
			children: [
				/* @__PURE__ */ J(Je, {
					strokeDasharray: "3 3",
					stroke: gi
				}),
				/* @__PURE__ */ J(mt, {
					dataKey: "_ts",
					stroke: _i,
					tick: {
						fontSize: 11,
						fill: vi
					},
					tickFormatter: s
				}),
				/* @__PURE__ */ J(ht, {
					stroke: _i,
					tick: {
						fontSize: 11,
						fill: vi
					},
					tickFormatter: ce,
					width: 60
				}),
				/* @__PURE__ */ J(ft, {
					contentStyle: z,
					labelStyle: { color: vi },
					labelFormatter: c
				}),
				o.keys.map((e, t) => /* @__PURE__ */ J(Ze, {
					type: "monotone",
					dataKey: e,
					stroke: l[t],
					dot: !1,
					strokeWidth: 2
				}, e)),
				u && o.points.length > 4 && /* @__PURE__ */ J(qe, {
					dataKey: "_ts",
					height: 20,
					stroke: _i,
					fill: yi,
					travellerWidth: 6,
					tickFormatter: s
				}),
				d && /* @__PURE__ */ J(ct, {
					x: n,
					stroke: bi,
					strokeDasharray: "3 3"
				}),
				o.annotations.map((e, t) => {
					let n = e.color ?? (e.kind ? hi[e.kind] : null) ?? vi;
					if (e.endTimestamp) {
						let [r, i] = e.timestamp <= e.endTimestamp ? [e.timestamp, e.endTimestamp] : [e.endTimestamp, e.timestamp];
						return /* @__PURE__ */ J(ot, {
							x1: r,
							x2: i,
							fill: n,
							fillOpacity: .1,
							stroke: n,
							strokeOpacity: .4,
							strokeDasharray: "3 3",
							label: {
								value: e.label,
								position: "insideTopLeft",
								fontSize: 10,
								fill: n
							}
						}, t);
					}
					return e.value === void 0 ? null : /* @__PURE__ */ J(st, {
						x: e.timestamp,
						y: e.value,
						r: 6,
						fill: n,
						stroke: yi,
						strokeWidth: 2,
						ifOverflow: "extendDomain",
						shape: (t) => /* @__PURE__ */ J(Si, {
							...t,
							kind: e.kind,
							color: n,
							label: e.label
						})
					}, t);
				})
			]
		})
	});
}
function Si({ cx: e, cy: t, kind: n, color: r, label: i }) {
	if (e == null || t == null) return null;
	let a;
	if (n === "buy") a = `M${e} ${t - 7} L${e + 6} ${t + 4} L${e - 6} ${t + 4} Z`;
	else if (n === "sell") a = `M${e} ${t + 7} L${e + 6} ${t - 4} L${e - 6} ${t - 4} Z`;
	else return /* @__PURE__ */ J("g", { children: /* @__PURE__ */ J("circle", {
		cx: e,
		cy: t,
		r: 5,
		fill: r,
		stroke: yi,
		strokeWidth: 2,
		children: /* @__PURE__ */ J("title", { children: i })
	}) });
	return /* @__PURE__ */ J("g", { children: /* @__PURE__ */ J("path", {
		d: a,
		fill: r,
		stroke: yi,
		strokeWidth: 1.5,
		children: /* @__PURE__ */ J("title", { children: i })
	}) });
}
var Ci = [
	"timestamp",
	"date",
	"time",
	"datetime",
	"ts",
	"x",
	"t"
];
function wi(e) {
	for (let t of Ci) if (t in e) return t;
	return null;
}
function Ti(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return [];
	let t = e.annotations;
	return Array.isArray(t) ? t.map((e) => {
		let t = e;
		return {
			timestamp: String(t.timestamp ?? ""),
			endTimestamp: t.end_timestamp == null ? t.endTimestamp == null ? void 0 : String(t.endTimestamp) : String(t.end_timestamp),
			value: typeof t.value == "number" ? t.value : void 0,
			label: String(t.label ?? ""),
			kind: t.kind == null ? void 0 : String(t.kind),
			color: t.color == null ? void 0 : String(t.color)
		};
	}) : [];
}
function Ei(e) {
	if (!e) return null;
	let t = Ti(e);
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
		let n = e[0], r = wi(n);
		if (!r) return null;
		let i = Object.keys(n).filter((e) => e !== r && typeof n[e] == "number");
		return i.length === 0 ? null : {
			points: e.map((e) => {
				let t = e, n = { _ts: t[r] };
				for (let e of i) n[e] = t[e];
				return n;
			}),
			keys: i,
			annotations: t
		};
	}
	if (typeof e == "object" && e && "points" in e) {
		let n = e.points;
		return !Array.isArray(n) || n.length === 0 ? null : {
			points: n.map((e) => {
				let t = e;
				return {
					_ts: t.timestamp ?? t.date ?? t.time ?? t.x,
					value: t.value ?? t.y ?? t.v
				};
			}),
			keys: ["value"],
			annotations: t
		};
	}
	if (typeof e == "object" && e && "series" in e) {
		let n = e.series;
		if (!Array.isArray(n)) return null;
		let r = /* @__PURE__ */ new Map(), i = [];
		for (let e of n) {
			let t = e, n = String(t.name || t.label || `s${i.length}`);
			i.push(n);
			let a = t.data ?? t.points;
			if (Array.isArray(a)) for (let e of a) {
				let t = String(e.timestamp ?? e.date ?? e.time ?? e.x ?? "");
				r.has(t) || r.set(t, { _ts: t }), r.get(t)[n] = e.value ?? e.y ?? e.v;
			}
		}
		return {
			points: Array.from(r.values()),
			keys: i,
			annotations: t
		};
	}
	return null;
}
//#endregion
//#region src/widgets/Candlestick.tsx
var Di = /* @__PURE__ */ X({ Candlestick: () => ji }), Oi = {
	buy: {
		shape: "arrowUp",
		position: "belowBar",
		color: "ok"
	},
	sell: {
		shape: "arrowDown",
		position: "aboveBar",
		color: "danger"
	},
	info: {
		shape: "circle",
		position: "aboveBar",
		color: "accent"
	},
	warn: {
		shape: "circle",
		position: "aboveBar",
		color: "warning"
	}
}, ki = {
	shape: "circle",
	position: "aboveBar",
	color: "muted"
}, Ai = {
	accent: "#5a8dee",
	danger: "#df6972",
	ok: "#4fb184",
	warning: "#d6a354",
	muted: "#87929e",
	mutedSubtle: "#596571",
	border: "#28313a",
	grid: "#20272e"
};
function ji({ data: e }) {
	let { hoverTime: t, setHoverTime: n } = F(), r = K(null), a = K(null), o = K(null), s = K(null), c = K(null), l = K(null), u = K(Ai);
	W(() => {
		if (!r.current) return;
		let e = Li(r.current);
		u.current = e;
		let t = bt(r.current, {
			layout: {
				background: {
					type: vt.Solid,
					color: "transparent"
				},
				textColor: e.muted,
				fontSize: 11
			},
			grid: {
				vertLines: { color: e.grid },
				horzLines: { color: e.grid }
			},
			crosshair: {
				vertLine: {
					color: e.mutedSubtle,
					width: 1,
					style: 2
				},
				horzLine: {
					color: e.mutedSubtle,
					width: 1,
					style: 2
				}
			},
			rightPriceScale: { borderColor: e.border },
			timeScale: {
				borderColor: e.border,
				timeVisible: !0
			},
			handleScroll: !0,
			handleScale: !0
		}), i = t.addSeries(_t, {
			upColor: e.ok,
			downColor: e.danger,
			borderDownColor: e.danger,
			borderUpColor: e.ok,
			wickDownColor: e.danger,
			wickUpColor: e.ok
		}), d = t.addSeries(yt, {
			priceFormat: { type: "volume" },
			priceScaleId: "volume"
		});
		t.priceScale("volume").applyOptions({ scaleMargins: {
			top: .8,
			bottom: 0
		} }), a.current = t, o.current = i, s.current = d, c.current = xt(i, []), t.subscribeCrosshairMove((e) => {
			if (e.time != null) {
				let t = String(e.time);
				l.current = t, n(t);
			} else l.current = null, n(null);
		});
		let f = new ResizeObserver((e) => {
			let { width: n, height: r } = e[0].contentRect;
			t.applyOptions({
				width: n,
				height: r
			});
		});
		return f.observe(r.current), () => {
			f.disconnect(), t.remove(), a.current = null, o.current = null, s.current = null, c.current = null;
		};
	}, []), W(() => {
		let e = a.current, n = o.current;
		if (!e || !n) return;
		if (t == null) {
			e.clearCrosshairPosition();
			return;
		}
		if (t === l.current) return;
		let r = n.data?.()[0]?.close ?? 0;
		e.setCrosshairPosition(r, t, n);
	}, [t]);
	let d = G(() => Ii(e), [e]);
	return W(() => {
		if (o.current && d.candles.length !== 0) {
			if (o.current.setData(d.candles), d.volumes.length > 0 && s.current) {
				let e = u.current;
				s.current.setData(d.volumes.map((t) => ({
					...t,
					color: t.direction === "down" ? Ri(e.danger, .3) : Ri(e.ok, .3)
				})));
			}
			c.current && c.current.setMarkers(Mi(d.annotations, u.current)), a.current?.timeScale().fitContent();
		}
	}, [d]), /* @__PURE__ */ Y("div", {
		className: "relative w-full h-full",
		children: [/* @__PURE__ */ J("div", {
			ref: r,
			className: "w-full h-full"
		}), d.candles.length === 0 && /* @__PURE__ */ J("div", {
			className: "absolute inset-0 flex items-center justify-center pointer-events-none",
			children: /* @__PURE__ */ J(i, { children: "No data" })
		})]
	});
}
function Mi(e, t) {
	return e.map((e) => {
		let n = e.kind ? Oi[e.kind] ?? ki : ki;
		return {
			time: Fi(e.timestamp),
			position: n.position,
			shape: n.shape,
			color: e.color ?? t[n.color],
			text: e.label
		};
	});
}
var Ni = [
	"timestamp",
	"date",
	"time",
	"datetime",
	"ts",
	"t"
];
function Pi(e, t) {
	for (let n of t) if (n in e) return n;
	let n = Object.keys(e).reduce((e, t) => (e[t.toLowerCase()] = t, e), {});
	for (let e of t) if (n[e]) return n[e];
	return null;
}
function Fi(e) {
	if (typeof e == "number") return e > 0xe8d4a51000 ? Math.floor(e / 1e3) : e;
	let t = String(e).trim();
	if (t.includes("T") || / \d/.test(t)) {
		let e = new Date(t.replace(" ", "T"));
		if (!isNaN(e.getTime())) return Math.floor(e.getTime() / 1e3);
	}
	return t.split(" ")[0].split("T")[0];
}
function Ii(e) {
	let t = {
		candles: [],
		volumes: [],
		annotations: []
	};
	if (!e) return t;
	let n, r = [];
	if (Array.isArray(e)) n = e;
	else if (typeof e == "object" && e) {
		let t = e;
		n = Array.isArray(t.bars) ? t.bars : [], Array.isArray(t.annotations) && (r = t.annotations.map((e) => {
			let t = e;
			return {
				timestamp: String(t.timestamp ?? ""),
				value: typeof t.value == "number" ? t.value : void 0,
				label: String(t.label ?? ""),
				kind: t.kind == null ? void 0 : String(t.kind),
				color: t.color == null ? void 0 : String(t.color)
			};
		}));
	} else n = [];
	if (n.length === 0 || typeof n[0] != "object" || n[0] === null) return {
		...t,
		annotations: r
	};
	let i = n[0], a = Pi(i, Ni), o = Pi(i, ["open", "o"]), s = Pi(i, ["high", "h"]), c = Pi(i, ["low", "l"]), l = Pi(i, ["close", "c"]), u = Pi(i, [
		"volume",
		"vol",
		"v"
	]);
	if (!a || !o || !s || !c || !l) return {
		...t,
		annotations: r
	};
	let d = [], f = [];
	for (let e of n) {
		let t = e, n = Fi(t[a]), r = Number(t[o]), i = Number(t[s]), p = Number(t[c]), m = Number(t[l]);
		d.push({
			time: n,
			open: r,
			high: i,
			low: p,
			close: m
		}), u && t[u] != null && f.push({
			time: n,
			value: Number(t[u]),
			direction: m >= r ? "up" : "down"
		});
	}
	return {
		candles: d,
		volumes: f,
		annotations: r
	};
}
function Li(e) {
	let t = getComputedStyle(e), n = (e, n) => t.getPropertyValue(e).trim() || n;
	return {
		accent: n("--mtc-accent", Ai.accent),
		danger: n("--mtc-danger", Ai.danger),
		ok: n("--mtc-ok", Ai.ok),
		warning: n("--mtc-warning", Ai.warning),
		muted: n("--mtc-muted", Ai.muted),
		mutedSubtle: n("--mtc-muted-subtle", Ai.mutedSubtle),
		border: n("--mtc-border", Ai.border),
		grid: n("--mtc-grid", Ai.grid)
	};
}
function Ri(e, t) {
	let n = e.trim().match(/^#([0-9a-f]{6})$/i);
	if (n) {
		let e = parseInt(n[1], 16);
		return `rgba(${e >> 16 & 255}, ${e >> 8 & 255}, ${e & 255}, ${t})`;
	}
	let r = e.trim().match(/^rgba?\(([^)]+)\)$/i);
	if (r) {
		let e = r[1].split(/[\s,\/]+/).map(Number).filter(Number.isFinite);
		if (e.length >= 3) return `rgba(${e[0]}, ${e[1]}, ${e[2]}, ${t})`;
	}
	return e;
}
//#endregion
//#region src/widgets/DataTable.tsx
var zi = /* @__PURE__ */ X({ DataTable: () => Hi }), Bi = 25, Vi = 600;
function Hi({ data: e, options: t }) {
	let { setCtx: n } = a(), r = t?.pageSize || Bi, o = t?.row_context, s = t?.heat_columns ?? [], c = t?.export === !0, l = t?.tick_flash === !0, u = t?.search === !0, d = t?.column_formats ?? {}, { columns: f, rows: p, labels: m, formats: h } = G(() => Ui(e), [e]), g = G(() => ({
		...h,
		...d
	}), [h, d]), [_, v] = q(null), [y, b] = q(!0), [x, S] = q(0), [C, w] = q(""), T = (e, t) => {
		let n = f[0] == null ? void 0 : e[f[0]];
		return n == null ? `_idx_${t}` : String(n);
	}, E = K(/* @__PURE__ */ new Map()), [D, O] = q(/* @__PURE__ */ new Map());
	W(() => {
		if (!l) return;
		let e = /* @__PURE__ */ new Map();
		for (let t = 0; t < p.length; t++) {
			let n = p[t], r = T(n, t), i = E.current.get(r), a = {}, o = null;
			for (let e of f) {
				let t = n[e];
				typeof t == "number" && (a[e] = t, o == null && i && i[e] != null && i[e] !== t && (o = t > i[e] ? "up" : "down"));
			}
			E.current.set(r, a), o && e.set(r, o);
		}
		if (e.size === 0) return;
		O((t) => {
			let n = new Map(t);
			for (let [t, r] of e) n.set(t, r);
			return n;
		});
		let t = setTimeout(() => {
			O((t) => {
				let n = new Map(t);
				for (let [t, r] of e) n.get(t) === r && n.delete(t);
				return n;
			});
		}, Vi);
		return () => clearTimeout(t);
	}, [p, l]);
	let k = G(() => {
		let e = {};
		for (let t of s) {
			let n = Infinity, r = -Infinity;
			for (let e of p) {
				let i = e[t];
				typeof i == "number" && Number.isFinite(i) && (i < n && (n = i), i > r && (r = i));
			}
			Number.isFinite(n) && Number.isFinite(r) && (e[t] = {
				min: n,
				max: r
			});
		}
		return e;
	}, [p, s]), A = (e) => {
		if (!o) return;
		let t = e[o.field ?? f[0]];
		t != null && n(o.key, String(t));
	}, j = G(() => {
		let e = C.trim().toLowerCase();
		return e ? p.filter((t) => f.some((n) => {
			let r = t[n];
			return r != null && String(r).toLowerCase().includes(e);
		})) : p;
	}, [
		p,
		f,
		C
	]), M = G(() => _ ? [...j].sort((e, t) => {
		let n = e[_], r = t[_];
		if (n == null && r == null) return 0;
		if (n == null) return 1;
		if (r == null) return -1;
		let i = typeof n == "number" && typeof r == "number" ? n - r : String(n).localeCompare(String(r));
		return y ? i : -i;
	}) : j, [
		j,
		_,
		y
	]), N = Math.max(1, Math.ceil(M.length / r)), P = Math.min(x, N - 1), F = M.slice(P * r, (P + 1) * r), I = M.length > r, L = (e) => {
		_ === e ? b(!y) : (v(e), b(!0)), S(0);
	};
	return f.length === 0 ? /* @__PURE__ */ J(i, { children: "No data" }) : /* @__PURE__ */ Y("div", {
		className: "flex flex-col h-full",
		children: [
			(u || c) && /* @__PURE__ */ Y("div", {
				className: "flex items-center gap-2 pb-1",
				children: [u && /* @__PURE__ */ J("input", {
					type: "text",
					value: C,
					onChange: (e) => {
						w(e.target.value), S(0);
					},
					placeholder: "filter…",
					className: "flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
				}), c && /* @__PURE__ */ J("button", {
					onClick: () => {
						let e = [f.map(Gi).join(","), ...M.map((e) => f.map((t) => Gi(e[t])).join(","))], t = new Blob([e.join("\n")], { type: "text/csv;charset=utf-8" }), n = URL.createObjectURL(t), r = document.createElement("a");
						r.href = n, r.download = "export.csv", r.click(), URL.revokeObjectURL(n);
					},
					className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0",
					title: "Download as CSV",
					children: "↓ CSV"
				})]
			}),
			/* @__PURE__ */ J("div", {
				className: "overflow-auto flex-1 min-h-0",
				children: /* @__PURE__ */ Y("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ J("thead", {
						className: "sticky top-0 bg-zinc-900",
						children: /* @__PURE__ */ J("tr", { children: f.map((e) => {
							let t = g[e];
							return /* @__PURE__ */ Y("th", {
								onClick: () => L(e),
								className: `px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${t && t !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(t) ? "text-right" : "text-left"}`,
								children: [m[e] ?? e, _ === e && /* @__PURE__ */ J("span", {
									className: "ml-1 text-zinc-500",
									children: y ? "↑" : "↓"
								})]
							}, e);
						}) })
					}), /* @__PURE__ */ J("tbody", { children: F.map((e, t) => {
						let n = D.get(T(e, t));
						return /* @__PURE__ */ J("tr", {
							onClick: o ? () => A(e) : void 0,
							className: `border-b border-zinc-800/60 transition-colors duration-300 ${n === "up" ? "bg-emerald-500/15" : n === "down" ? "bg-red-500/15" : ""} ${o ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/40"}`,
							children: f.map((t) => {
								let n = k[t], r = e[t], i = n && typeof r == "number" ? { backgroundColor: Wi(r, n.min, n.max) } : void 0, a = g[t];
								if (a === "link" && r != null) {
									let e = typeof r == "object" && !Array.isArray(r) ? r : {
										label: void 0,
										url: r
									}, n = V(e.url), a = e.label != null && e.label !== "" ? String(e.label) : n ?? "";
									return /* @__PURE__ */ J("td", {
										className: "px-3 py-2.5 whitespace-nowrap",
										style: i,
										children: n ? /* @__PURE__ */ Y("a", {
											href: n,
											...n.startsWith("/") ? {} : {
												target: "_blank",
												rel: "noopener noreferrer"
											},
											className: "text-sky-400 hover:underline",
											children: [a, /* @__PURE__ */ J("span", {
												className: "ml-1 text-xs text-zinc-500",
												"aria-hidden": "true",
												children: n.startsWith("/") ? "→" : "↗"
											})]
										}) : /* @__PURE__ */ J("span", {
											className: "text-zinc-100",
											children: a
										})
									}, t);
								}
								if (a === "sparkline" && Array.isArray(r)) return /* @__PURE__ */ J("td", {
									className: "px-3 py-2.5 whitespace-nowrap",
									style: i,
									children: /* @__PURE__ */ J(Ki, { values: r })
								}, t);
								let o = a ? Ji(r, a) : qi(r), s = a ? a.split(":").slice(1).includes("signed") : !1;
								return /* @__PURE__ */ J("td", {
									className: `px-3 py-2.5 whitespace-nowrap tabular-nums ${a && a !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(a) ? "text-right" : ""} ${s && typeof r == "number" ? r > 0 ? "text-emerald-400" : r < 0 ? "text-red-400" : "text-zinc-100" : "text-zinc-100"}`,
									style: i,
									children: o
								}, t);
							})
						}, t);
					}) })]
				})
			}),
			I && /* @__PURE__ */ Y("div", {
				className: "flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400",
				children: [/* @__PURE__ */ Y("span", { children: [M.length, " rows"] }), /* @__PURE__ */ Y("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ J("button", {
							onClick: () => S(0),
							disabled: P === 0,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "«"
						}),
						/* @__PURE__ */ J("button", {
							onClick: () => S((e) => e - 1),
							disabled: P === 0,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "‹"
						}),
						/* @__PURE__ */ Y("span", {
							className: "px-2 text-zinc-300",
							children: [
								P + 1,
								" / ",
								N
							]
						}),
						/* @__PURE__ */ J("button", {
							onClick: () => S((e) => e + 1),
							disabled: P >= N - 1,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "›"
						}),
						/* @__PURE__ */ J("button", {
							onClick: () => S(N - 1),
							disabled: P >= N - 1,
							className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30",
							children: "»"
						})
					]
				})]
			})
		]
	});
}
function Ui(e) {
	let t = {
		columns: [],
		rows: [],
		labels: {},
		formats: {}
	};
	if (!e) return t;
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object") {
		let n = [...new Set(e.flatMap((e) => Object.keys(e)))];
		return {
			...t,
			columns: n,
			rows: e
		};
	}
	if (typeof e == "object" && e && "rows" in e) {
		let n = e, r = Array.isArray(n.columns) ? n.columns : [];
		if (r.length > 0 && typeof r[0] == "object") {
			let e = r, t = e.map((e) => e.key), i = {}, a = {};
			for (let t of e) t.label && (i[t.key] = t.label), t.format && (a[t.key] = t.format);
			return {
				columns: t,
				rows: n.rows.map((e) => Array.isArray(e) ? Object.fromEntries(t.map((t, n) => [t, e[n]])) : e),
				labels: i,
				formats: a
			};
		}
		if (r.length > 0) {
			let e = r, i = n.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, t[n]])) : t);
			return {
				...t,
				columns: e,
				rows: i
			};
		}
		let i = n.rows;
		if (i.length > 0 && typeof i[0] == "object" && !Array.isArray(i[0])) {
			let e = [...new Set(i.flatMap((e) => Object.keys(e)))];
			return {
				...t,
				columns: e,
				rows: i
			};
		}
	}
	return t;
}
function Wi(e, t, n) {
	if (n === t) return "transparent";
	if (t < 0 && n > 0) {
		let r = Math.max(-1, Math.min(1, e / Math.max(Math.abs(t), Math.abs(n))));
		return r >= 0 ? `color-mix(in oklab, var(--mtc-ok) ${35 * r}%, transparent)` : `color-mix(in oklab, var(--mtc-danger) ${35 * -r}%, transparent)`;
	}
	return `color-mix(in oklab, var(--mtc-accent) ${35 * ((e - t) / (n - t))}%, transparent)`;
}
function Gi(e) {
	if (e == null) return "";
	if (typeof e == "object" && !Array.isArray(e) && "url" in e) return Gi(e.url);
	let t = String(e);
	return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function Ki({ values: e }) {
	let t = e.map((e) => Number(e)).filter((e) => Number.isFinite(e));
	if (t.length < 2) return /* @__PURE__ */ J("span", {
		className: "text-zinc-600",
		children: "—"
	});
	let n = Math.min(...t), r = Math.max(...t) - n || 1;
	return /* @__PURE__ */ J("svg", {
		viewBox: "0 0 100 16",
		className: "w-20 h-4",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ J("polyline", {
			fill: "none",
			stroke: t[t.length - 1] >= t[0] ? "var(--mtc-ok)" : "var(--mtc-danger)",
			strokeWidth: "1.5",
			points: t.map((e, i) => {
				let a = i / (t.length - 1) * 100, o = 16 - (e - n) / r * 14 - 1;
				return `${a.toFixed(1)},${o.toFixed(1)}`;
			}).join(" "),
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function qi(e) {
	return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	}) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Ji(e, t) {
	if (e == null) return "—";
	if (t.split(":")[0] === "datetime") return L(e);
	if (typeof e != "number") return qi(e);
	let [n, ...r] = t.split(":"), i = new Set(r), a = i.has("signed");
	switch (n) {
		case "currency": return ne(e, r.find((e) => e !== "signed") ?? "USD");
		case "percent": return ae(e, {
			signed: a,
			as: i.has("p") ? "percent" : "fraction"
		});
		case "bps": return ie(e, { signed: a });
		case "compact": return oe(e);
		default: return qi(e);
	}
}
//#endregion
//#region src/widgets/Metric.tsx
var Yi = /* @__PURE__ */ X({ Metric: () => Zi }), Xi = 600;
function Zi({ data: e }) {
	let { value: t, delta: n, unit: r, label: i, trend: a } = $i(e), o = me(t), s = K(null), [c, l] = q(null);
	return W(() => {
		let e = s.current;
		if (s.current = t, e == null || e === t) return;
		l(t > e ? "up" : "down");
		let n = setTimeout(() => l(null), Xi);
		return () => clearTimeout(n);
	}, [t]), /* @__PURE__ */ Y("div", {
		className: "flex flex-col items-center justify-center h-full gap-1",
		children: [
			/* @__PURE__ */ Y("div", {
				className: `text-3xl font-bold tabular-nums transition-colors duration-300 ${c === "up" ? "text-emerald-300" : c === "down" ? "text-red-300" : "text-white"}`,
				children: [se(o), r && /* @__PURE__ */ J("span", {
					className: "text-base font-normal text-zinc-400 ml-1",
					children: r
				})]
			}),
			n != null && /* @__PURE__ */ Y("div", {
				className: `text-sm font-medium ${n >= 0 ? "text-emerald-400" : "text-red-400"}`,
				children: [
					n >= 0 ? "▲" : "▼",
					" ",
					ea(n)
				]
			}),
			a && a.length >= 2 && /* @__PURE__ */ J(Qi, { values: a }),
			i && /* @__PURE__ */ J("div", {
				className: "text-xs text-zinc-500",
				children: i
			})
		]
	});
}
function Qi({ values: e }) {
	let t = Math.min(...e), n = Math.max(...e) - t || 1;
	return /* @__PURE__ */ J("svg", {
		viewBox: "0 0 100 18",
		className: "w-full max-w-[120px] h-5",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ J("polyline", {
			fill: "none",
			stroke: e[e.length - 1] >= e[0] ? "var(--mtc-ok)" : "var(--mtc-danger)",
			strokeWidth: "1.5",
			points: e.map((r, i) => {
				let a = i / (e.length - 1) * 100, o = 18 - (r - t) / n * 16 - 1;
				return `${a.toFixed(1)},${o.toFixed(1)}`;
			}).join(" "),
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function $i(e) {
	if (typeof e == "number") return { value: e };
	if (typeof e == "object" && e) {
		let t = e;
		return {
			value: Number(t.value ?? 0),
			delta: t.delta == null ? void 0 : Number(t.delta),
			unit: t.unit == null ? void 0 : String(t.unit),
			label: t.label == null ? void 0 : String(t.label),
			trend: Array.isArray(t.trend) && t.trend.every((e) => typeof e == "number") ? t.trend : void 0
		};
	}
	return { value: 0 };
}
function ea(e) {
	let t = Math.abs(e) <= 1 ? e * 100 : e;
	return `${Math.abs(t).toFixed(2)}%`;
}
//#endregion
//#region src/widgets/Text.tsx
var ta = /* @__PURE__ */ X({ Text: () => ra }), na = 1500;
function ra({ data: e }) {
	let t = fe(e), n = K(/* @__PURE__ */ new Set()), r = K(!1), [a, o] = q(/* @__PURE__ */ new Set());
	return W(() => {
		let e = t.map(ia);
		if (!r.current) {
			r.current = !0;
			for (let t of e) n.current.add(t);
			return;
		}
		let i = e.filter((e) => !n.current.has(e));
		for (let t of e) n.current.add(t);
		if (i.length === 0) return;
		o((e) => {
			let t = new Set(e);
			for (let e of i) t.add(e);
			return t;
		});
		let a = setTimeout(() => {
			o((e) => {
				let t = new Set(e);
				for (let e of i) t.delete(e);
				return t;
			});
		}, na);
		return () => clearTimeout(a);
	}, [t]), t.length === 0 ? /* @__PURE__ */ J(i, { children: "No content" }) : /* @__PURE__ */ J("div", {
		className: "overflow-auto h-full space-y-3",
		children: t.map((e, t) => {
			let n = ia(e);
			return /* @__PURE__ */ Y("article", {
				className: `flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${a.has(n) ? "bg-sky-500/5" : ""}`,
				children: [/* @__PURE__ */ Y("div", {
					className: "flex-1 min-w-0",
					children: [
						(e.title || e.url) && /* @__PURE__ */ J("h4", {
							className: "text-sm font-medium text-zinc-100 mb-1 leading-snug",
							children: e.url ? /* @__PURE__ */ Y("a", {
								href: e.url,
								...e.url.startsWith("/") ? {} : {
									target: "_blank",
									rel: "noopener noreferrer"
								},
								className: "hover:text-sky-400 hover:underline",
								children: [e.title || aa(e.url), /* @__PURE__ */ J("span", {
									className: "ml-1 text-xs text-zinc-500",
									"aria-hidden": "true",
									children: e.url.startsWith("/") ? "→" : "↗"
								})]
							}) : e.title
						}),
						e.meta && /* @__PURE__ */ J("div", {
							className: "text-xs text-zinc-500 mb-1.5",
							children: e.meta
						}),
						e.body && /* @__PURE__ */ J("p", {
							className: "text-sm text-zinc-300 leading-relaxed",
							children: e.body
						}),
						e.tags && e.tags.length > 0 && /* @__PURE__ */ J("div", {
							className: "flex gap-1.5 mt-2 flex-wrap",
							children: e.tags.map((e, t) => /* @__PURE__ */ J("span", {
								className: "text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400",
								children: e
							}, t))
						})
					]
				}), e.image && /* @__PURE__ */ J("img", {
					src: e.image,
					alt: "",
					className: "w-14 h-14 rounded object-cover shrink-0 bg-zinc-800",
					loading: "lazy"
				})]
			}, t);
		})
	});
}
function ia(e) {
	return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function aa(e) {
	try {
		return new URL(e).hostname;
	} catch {
		return e;
	}
}
//#endregion
//#region src/widgets/Prompt.tsx
var oa = /* @__PURE__ */ X({ Prompt: () => sa });
function sa({ options: e }) {
	let { dispatch: t, ctx: n, setCtx: r, backendUrl: o, widgets: s } = a(), [c, u] = q(""), [d, f] = q(!1), [m, h] = q(null), [g, _] = q(null), v = K(!1), y = e?.url, b = o !== void 0, x = U(async () => {
		let e = c.trim();
		if (!(!e || d || v.current) && !(!b && !y)) {
			v.current = !0, f(!0), _(null), h(null);
			try {
				let i = b ? await fetch(l(o), {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(p(e, n, s))
				}) : await fetch(y, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ query: e })
				});
				if (!i.ok) throw Error(`HTTP ${i.status}`);
				let a = await i.json(), c = a.text ?? a.dialogue?.text;
				if (c && h(c), a.context?.values) for (let [e, t] of Object.entries(a.context.values)) r(e, t);
				a.actions && a.actions.length > 0 && t(a.actions, { replaceAll: a.replace_all }), u("");
			} catch (e) {
				_(e instanceof Error ? e.message : "Request failed");
			} finally {
				v.current = !1, f(!1);
			}
		}
	}, [
		c,
		d,
		b,
		o,
		y,
		n,
		s,
		t,
		r
	]);
	return !b && !y ? /* @__PURE__ */ J(i, {
		padded: !0,
		children: "Set a backendUrl on Dashboard or options.url on this widget"
	}) : /* @__PURE__ */ Y("div", {
		className: "flex flex-col gap-2 h-full justify-center",
		children: [
			/* @__PURE__ */ Y("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ J("input", {
					type: "text",
					className: "flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100\n            placeholder-zinc-500 outline-none focus:border-zinc-500 disabled:opacity-50",
					placeholder: "Ask anything... (Enter to send)",
					value: c,
					onChange: (e) => u(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" && !e.shiftKey && (e.preventDefault(), x());
					},
					disabled: d
				}), /* @__PURE__ */ J("button", {
					onClick: x,
					disabled: d || !c.trim(),
					className: "px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default\n            rounded-lg text-sm text-zinc-200 font-medium shrink-0",
					children: d ? "..." : "Send"
				})]
			}),
			m && /* @__PURE__ */ J("div", {
				className: "text-xs text-zinc-400 leading-relaxed",
				children: m
			}),
			g && /* @__PURE__ */ J("div", {
				className: "text-xs text-red-400",
				children: g
			})
		]
	});
}
//#endregion
//#region src/widgets/Gauge.tsx
var ca = /* @__PURE__ */ X({ Gauge: () => da }), la = {
	ok: "var(--mtc-ok)",
	warn: "var(--mtc-warning)",
	danger: "var(--mtc-danger)",
	error: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	muted: "var(--mtc-muted)"
}, ua = "M 16 104 A 84 84 0 0 1 184 104";
function da({ data: e }) {
	let t = fa(e);
	if (!t) return /* @__PURE__ */ J(i, { children: "No data" });
	let n = t.max - t.min, r = n > 0 ? Math.max(0, Math.min(1, (t.value - t.min) / n)) : 0, a = la[t.bands.find((e) => t.value >= e.from && t.value <= e.to)?.color ?? "info"] ?? la.info;
	return /* @__PURE__ */ Y("div", {
		className: "flex flex-col items-center justify-center h-full gap-1",
		children: [/* @__PURE__ */ Y("svg", {
			viewBox: "0 0 200 120",
			className: "w-full max-w-[260px]",
			children: [
				/* @__PURE__ */ J("path", {
					d: ua,
					fill: "none",
					stroke: "var(--mtc-grid)",
					strokeWidth: "16",
					pathLength: "100"
				}),
				t.bands.map((e, r) => {
					let i = (e.from - t.min) / n, a = (e.to - t.min) / n;
					return /* @__PURE__ */ J("path", {
						d: ua,
						fill: "none",
						stroke: la[e.color] ?? la.muted,
						strokeWidth: "16",
						opacity: .22,
						pathLength: "100",
						strokeDasharray: `${(a - i) * 100} 100`,
						strokeDashoffset: -i * 100
					}, r);
				}),
				/* @__PURE__ */ J("path", {
					d: ua,
					fill: "none",
					stroke: a,
					strokeWidth: "16",
					strokeLinecap: "round",
					pathLength: "100",
					strokeDasharray: `${r * 100} 100`
				}),
				/* @__PURE__ */ J("text", {
					x: "100",
					y: "92",
					textAnchor: "middle",
					fill: "var(--mtc-fg)",
					style: {
						fontSize: 22,
						fontWeight: 700,
						fontVariantNumeric: "tabular-nums"
					},
					children: pa(t.value, t.min, t.max)
				})
			]
		}), t.label && /* @__PURE__ */ J("div", {
			className: "text-xs text-zinc-500 text-center px-2 truncate max-w-full",
			children: t.label
		})]
	});
}
function fa(e) {
	if (typeof e != "object" || !e) return null;
	let t = e;
	if (typeof t.value != "number") return null;
	let n = typeof t.min == "number" ? t.min : 0, r = typeof t.max == "number" ? t.max : 1, i = Array.isArray(t.bands) ? t.bands.map((e) => {
		let t = e;
		return {
			from: Number(t.from ?? 0),
			to: Number(t.to ?? 0),
			color: String(t.color ?? "info")
		};
	}) : [];
	return {
		value: t.value,
		min: n,
		max: r,
		bands: i,
		label: t.label == null ? void 0 : String(t.label)
	};
}
function pa(e, t, n) {
	return t === 0 && n === 1 ? `${(e * 100).toFixed(1)}%` : t === -1 && n === 1 ? e >= 0 ? `+${e.toFixed(2)}` : e.toFixed(2) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
//#endregion
//#region src/widgets/Distribution.tsx
var ma = /* @__PURE__ */ X({ Distribution: () => ha });
function ha({ data: e }) {
	let t = G(() => ga(e), [e]);
	if (!t) return /* @__PURE__ */ J(i, { children: "No data" });
	let { slices: n, total: r } = t, a = n.map((e, t) => ue(e.color, t)), o = n.reduce((e, t) => t.value > e.value ? t : e), s = o.value / r * 100;
	return /* @__PURE__ */ Y("div", {
		className: "flex flex-col h-full",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex-1 relative min-h-0",
			children: [/* @__PURE__ */ J(lt, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ Y(et, { children: [/* @__PURE__ */ J($e, {
					data: n,
					dataKey: "value",
					nameKey: "label",
					innerRadius: "60%",
					outerRadius: "92%",
					paddingAngle: 2,
					stroke: "none",
					isAnimationActive: !1,
					children: n.map((e, t) => /* @__PURE__ */ J(Ye, { fill: a[t] }, t))
				}), /* @__PURE__ */ J(ft, {
					contentStyle: z,
					formatter: (e) => {
						let t = Number(e) || 0;
						return [`${_a(t)} (${(t / r * 100).toFixed(1)}%)`, ""];
					}
				})] })
			}), /* @__PURE__ */ Y("div", {
				className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none",
				children: [/* @__PURE__ */ J("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate max-w-[60%]",
					children: o.label
				}), /* @__PURE__ */ Y("div", {
					className: "text-2xl font-bold text-white tabular-nums",
					children: [s.toFixed(1), "%"]
				})]
			})]
		}), /* @__PURE__ */ J("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs",
			children: n.map((e, t) => /* @__PURE__ */ Y("div", {
				className: "flex items-center gap-1.5 min-w-0",
				children: [
					/* @__PURE__ */ J("span", {
						className: "w-2 h-2 rounded-sm shrink-0",
						style: { backgroundColor: a[t] }
					}),
					/* @__PURE__ */ J("span", {
						className: "text-zinc-300 truncate",
						children: e.label
					}),
					/* @__PURE__ */ Y("span", {
						className: "text-zinc-500 ml-auto tabular-nums shrink-0",
						children: [(e.value / r * 100).toFixed(1), "%"]
					})
				]
			}, t))
		})]
	});
}
function ga(e) {
	if (typeof e != "object" || !e) return null;
	let t = e, n = Array.isArray(t.slices) ? t.slices : null;
	if (!n) return null;
	let r = n.map((e) => {
		let t = e;
		return {
			label: String(t.label ?? ""),
			value: Number(t.value ?? 0),
			color: t.color == null ? void 0 : String(t.color)
		};
	}).filter((e) => e.value > 0);
	return r.length === 0 ? null : {
		slices: r,
		total: (typeof t.total == "number" ? t.total : null) ?? r.reduce((e, t) => e + t.value, 0)
	};
}
function _a(e) {
	return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
//#endregion
//#region src/widgets/Heatmap.tsx
var va = /* @__PURE__ */ X({ Heatmap: () => xa }), ya = 96, ba = 22;
function xa({ data: e, options: t }) {
	let { setCtx: n } = a(), r = G(() => Ca(e), [e]);
	if (!r) return /* @__PURE__ */ J(i, { children: "No data" });
	let o = t?.row_context, s = t?.col_context, c = !!(o || s), l = (e, t) => {
		o && n(o.key, r.rows[e]), s && n(s.key, r.columns[t]);
	}, { rows: u, columns: d, cells: f, min: p, max: m, scale: h } = r, g = f.length <= 60, _ = G(() => {
		let e = u.map(() => Array(d.length).fill(void 0));
		for (let t of f) e[t.row][t.col] = t;
		return e;
	}, [
		u,
		d,
		f
	]);
	return /* @__PURE__ */ Y("div", {
		className: "h-full w-full overflow-auto flex flex-col",
		children: [/* @__PURE__ */ Y("div", {
			className: "inline-grid min-w-full",
			style: {
				gridTemplateColumns: `${ya}px repeat(${d.length}, minmax(28px, 1fr))`,
				gap: 2
			},
			children: [
				/* @__PURE__ */ J("div", { className: "sticky left-0 top-0 z-20 bg-zinc-900" }),
				d.map((e) => /* @__PURE__ */ J("div", {
					className: "text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900",
					style: { height: ba },
					children: e
				}, `c-${e}`)),
				u.flatMap((e, t) => [/* @__PURE__ */ J("div", {
					className: "text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900",
					style: { minHeight: 30 },
					children: e
				}, `rl-${t}`), ...d.map((n, r) => {
					let i = _[t][r];
					if (!i) return /* @__PURE__ */ J("div", { className: "bg-zinc-900 rounded-sm" }, `e-${t}-${r}`);
					let a = wa(i.value, p, m, h);
					return /* @__PURE__ */ J("div", {
						onClick: c ? () => l(t, r) : void 0,
						className: `rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${c ? "cursor-pointer hover:ring-1 hover:ring-zinc-400" : ""}`,
						style: {
							backgroundColor: a,
							minHeight: 30
						},
						title: `${e} × ${d[r]}: ${i.label ?? i.value.toFixed(2)}`,
						children: g && /* @__PURE__ */ J("span", {
							className: "text-white/90",
							children: i.label ?? Ta(i.value)
						})
					}, `cell-${t}-${r}`);
				})])
			]
		}), /* @__PURE__ */ J(Sa, {
			min: p,
			max: m,
			scale: h
		})]
	});
}
function Sa({ min: e, max: t, scale: n }) {
	let r = n === "diverging" ? [
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
	], i = t - e;
	return /* @__PURE__ */ Y("div", {
		className: "flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ J("span", {
				className: "tabular-nums",
				children: oe(e)
			}),
			/* @__PURE__ */ J("div", {
				className: "flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden",
				children: r.map((r, a) => /* @__PURE__ */ J("div", {
					className: "flex-1",
					style: { backgroundColor: wa(n === "diverging" ? r * Math.max(Math.abs(e), Math.abs(t)) : e + r * i, e, t, n) }
				}, a))
			}),
			/* @__PURE__ */ J("span", {
				className: "tabular-nums",
				children: oe(t)
			})
		]
	});
}
function Ca(e) {
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
function wa(e, t, n, r) {
	if (n === t) return "var(--mtc-panel)";
	if (r === "diverging") {
		let r = Math.max(-1, Math.min(1, e / (Math.max(Math.abs(t), Math.abs(n)) || 1)));
		return r >= 0 ? `color-mix(in oklab, var(--mtc-ok) ${85 * r}%, var(--mtc-panel))` : `color-mix(in oklab, var(--mtc-danger) ${85 * -r}%, var(--mtc-panel))`;
	}
	return `color-mix(in oklab, var(--mtc-accent) ${15 + 75 * Math.max(0, Math.min(1, (e - t) / (n - t)))}%, var(--mtc-panel))`;
}
function Ta(e) {
	return Math.abs(e) < 1 ? e.toFixed(2) : Math.abs(e) < 100 ? e.toFixed(1) : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : Math.round(e).toString();
}
//#endregion
//#region src/widgets/Events.tsx
var Ea = /* @__PURE__ */ X({ Events: () => Oa }), Da = {
	EVENT_STATUS_OK: "bg-emerald-500",
	EVENT_STATUS_WARN: "bg-amber-500",
	EVENT_STATUS_ERROR: "bg-red-500",
	EVENT_STATUS_INFO: "bg-sky-500",
	EVENT_STATUS_PENDING: "bg-zinc-500 animate-pulse",
	ok: "bg-emerald-500",
	warn: "bg-amber-500",
	error: "bg-red-500",
	info: "bg-sky-500",
	pending: "bg-zinc-500 animate-pulse"
};
function Oa({ data: e, options: t }) {
	let n = G(() => ka(e), [e]), r = t?.filter === !0, [a, o] = q(""), s = G(() => {
		if (!n) return null;
		if (!a.trim()) return n;
		let e = a.toLowerCase();
		return n.filter((t) => t.label.toLowerCase().includes(e) || (t.body?.toLowerCase().includes(e) ?? !1) || (t.source?.toLowerCase().includes(e) ?? !1) || (t.tags?.some((t) => t.toLowerCase().includes(e)) ?? !1));
	}, [n, a]);
	return !n || n.length === 0 ? /* @__PURE__ */ J(i, { children: "No events" }) : /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col",
		children: [r && /* @__PURE__ */ J("input", {
			type: "text",
			placeholder: "Filter events…",
			value: a,
			onChange: (e) => o(e.target.value),
			className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 mb-2 shrink-0"
		}), /* @__PURE__ */ Y("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: [s.length === 0 && /* @__PURE__ */ J("div", {
				className: "flex items-center justify-center h-full text-zinc-500 text-xs",
				children: "No matches"
			}), s.map((e, t) => /* @__PURE__ */ Y("div", {
				className: "flex gap-3 px-1 py-2.5 border-b border-zinc-800 last:border-0",
				children: [/* @__PURE__ */ J("div", {
					className: "flex flex-col items-center pt-1.5 shrink-0",
					children: /* @__PURE__ */ J("span", { className: `w-2 h-2 rounded-full ${Da[e.status ?? ""] ?? "bg-zinc-600"}` })
				}), /* @__PURE__ */ Y("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ Y("div", {
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ J("span", {
								className: "text-xs text-zinc-500 tabular-nums shrink-0 font-mono",
								children: e.timestamp
							}), /* @__PURE__ */ J("span", {
								className: "text-sm text-zinc-100 truncate",
								children: e.label
							})]
						}),
						e.body && /* @__PURE__ */ J("div", {
							className: "text-xs text-zinc-400 mt-0.5 line-clamp-2",
							children: e.body
						}),
						(e.source || e.tags && e.tags.length > 0) && /* @__PURE__ */ Y("div", {
							className: "flex items-center gap-2 mt-1 text-[10px] text-zinc-500 flex-wrap",
							children: [e.source && /* @__PURE__ */ J("span", {
								className: "text-zinc-500",
								children: e.source
							}), e.tags?.map((e, t) => /* @__PURE__ */ J("span", {
								className: "px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
								children: e
							}, t))]
						})
					]
				})]
			}, t))]
		})]
	});
}
function ka(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.events) && (t = n.events);
	}
	return t ? t.map((e) => {
		let t = e;
		return {
			timestamp: String(t.timestamp ?? ""),
			label: String(t.label ?? ""),
			status: t.status == null ? void 0 : String(t.status),
			body: t.body == null ? void 0 : String(t.body),
			source: t.source == null ? void 0 : String(t.source),
			tags: Array.isArray(t.tags) ? t.tags.map(String) : void 0
		};
	}) : null;
}
//#endregion
//#region src/widgets/Catalog.tsx
var Aa = /* @__PURE__ */ X({ Catalog: () => Na }), ja = "medallion.terminal.v1.TerminalService", Ma = {
	SHAPE_TIMESERIES: "timeseries",
	SHAPE_CANDLES: "candles",
	SHAPE_TABLE: "table",
	SHAPE_METRIC: "metric",
	SHAPE_GAUGE: "gauge",
	SHAPE_HEATMAP: "heatmap",
	SHAPE_EVENTS: "events",
	SHAPE_DISTRIBUTION: "distribution",
	SHAPE_TEXT: "text",
	SHAPE_ORDERBOOK: "orderbook",
	SHAPE_PAIRED_GRID: "paired_grid",
	SHAPE_EMBED: "embed",
	SHAPE_ASSET_CATALOG: "asset_catalog",
	SHAPE_OBJECT: "object",
	SHAPE_GRAPH: "graph",
	SHAPE_REPOSITORY: "repository",
	SHAPE_RECORD_SET: "record_set"
};
function Na() {
	let { backendUrl: e } = a(), [t, n] = q(null), [r, o] = q(!0), [s, c] = q(null);
	if (W(() => {
		if (e === void 0) {
			o(!1), n(null);
			return;
		}
		let t = !1;
		o(!0), c(null);
		let r = new AbortController();
		return fetch(`${e.replace(/\/$/, "")}/${ja}/ListSources`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}",
			signal: r.signal
		}).then((e) => e.ok ? e.json() : Promise.reject(/* @__PURE__ */ Error(`HTTP ${e.status}`))).then((e) => {
			t || n(e.sources ?? []);
		}).catch((e) => {
			!t && e.name !== "AbortError" && c(e.message);
		}).finally(() => {
			t || o(!1);
		}), () => {
			t = !0, r.abort();
		};
	}, [e]), e === void 0) return /* @__PURE__ */ J(i, {
		padded: !0,
		children: "No backendUrl configured on Dashboard"
	});
	if (r) return /* @__PURE__ */ J(i, {
		padded: !0,
		children: "Loading catalog…"
	});
	if (s) return /* @__PURE__ */ Y(i, {
		padded: !0,
		children: ["Failed to load: ", s]
	});
	if (!t || t.length === 0) return /* @__PURE__ */ J(i, {
		padded: !0,
		children: "No sources registered"
	});
	let l = {};
	for (let e of t) {
		let t = e.shape && Ma[e.shape] || "other";
		l[t] || (l[t] = []), l[t].push(e);
	}
	return /* @__PURE__ */ J("div", {
		className: "h-full overflow-auto pr-1",
		children: Object.entries(l).map(([e, t]) => /* @__PURE__ */ Y("div", {
			className: "mb-4 last:mb-0",
			children: [/* @__PURE__ */ Y("div", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5",
				children: [
					e,
					" ",
					/* @__PURE__ */ Y("span", {
						className: "text-zinc-700",
						children: ["— ", t.length]
					})
				]
			}), t.map((e) => /* @__PURE__ */ Y("div", {
				className: "py-2 border-b border-zinc-800/60 last:border-0",
				children: [
					/* @__PURE__ */ Y("div", {
						className: "flex items-baseline gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ J("span", {
								className: "text-sm text-zinc-100 font-mono",
								children: e.id
							}),
							e.streamable && /* @__PURE__ */ J("span", {
								className: "text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded",
								children: "live"
							}),
							e.name && /* @__PURE__ */ Y("span", {
								className: "text-xs text-zinc-400",
								children: ["— ", e.name]
							})
						]
					}),
					e.description && /* @__PURE__ */ J("div", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: e.description
					}),
					e.params && e.params.length > 0 && /* @__PURE__ */ Y("div", {
						className: "text-[10px] text-zinc-500 mt-1 font-mono",
						children: [
							"params:",
							" ",
							e.params.map((e) => e.required ? `${e.key}*` : e.key).join(", ")
						]
					}),
					e.tags && e.tags.length > 0 && /* @__PURE__ */ J("div", {
						className: "flex gap-1 mt-1 flex-wrap",
						children: e.tags.map((e) => /* @__PURE__ */ J("span", {
							className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
							children: e
						}, e))
					})
				]
			}, e.id))]
		}, e))
	});
}
//#endregion
//#region src/widgets/AssetCatalog.tsx
var Pa = /* @__PURE__ */ X({ AssetCatalog: () => Ia }), Fa = {
	dataset: "▦",
	object_type: "◇",
	object: "◆",
	pipeline: "⇢",
	model: "◈",
	repository: "⌘",
	dashboard: "▤",
	document: "≡"
};
function Ia({ data: e, options: t }) {
	let n = t ?? {}, { ctx: r, setCtx: o } = a(), s = G(() => S(e), [e]), [c, l] = q(""), [u, d] = q("all"), f = n.item_context?.key ?? "asset_id", p = n.item_context?.kind_key ?? "asset_kind", m = n.item_context?.owner_key, h = G(() => [...new Set(s.items.map((e) => e.kind))].sort(), [s.items]), g = G(() => {
		let e = c.trim().toLowerCase();
		return s.items.filter((t) => u !== "all" && t.kind !== u ? !1 : !e || [
			t.id,
			t.name,
			t.kind,
			t.description,
			t.owner,
			t.status,
			...t.tags,
			...Object.values(t.metadata)
		].filter(Boolean).join(" ").toLowerCase().includes(e));
	}, [
		s.items,
		u,
		c
	]), _ = (e) => {
		for (let [t, n] of Object.entries(e.context)) o(t, n);
		f in e.context || o(f, e.id), p in e.context || o(p, e.kind), m && e.owner && !(m in e.context) && o(m, e.owner);
	};
	return s.items.length === 0 ? /* @__PURE__ */ J(i, { children: "No assets" }) : /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col min-h-0",
		children: [
			(n.search !== !1 || n.kind_filter !== !1 && h.length > 1) && /* @__PURE__ */ Y("div", {
				className: "flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0",
				children: [n.search !== !1 && /* @__PURE__ */ J("input", {
					type: "search",
					value: c,
					onChange: (e) => l(e.target.value),
					placeholder: "Search assets…",
					className: "w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
				}), n.kind_filter !== !1 && h.length > 1 && /* @__PURE__ */ J("div", {
					className: "flex gap-1 overflow-x-auto pb-0.5",
					children: ["all", ...h].map((e) => /* @__PURE__ */ J("button", {
						onClick: () => d(e),
						className: `px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap ${u === e ? "bg-sky-500/15 text-sky-300 border border-sky-500/30" : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-200"}`,
						children: Ra(e)
					}, e))
				})]
			}),
			/* @__PURE__ */ Y("div", {
				className: "flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-600 shrink-0",
				children: [/* @__PURE__ */ Y("span", { children: [g.length.toLocaleString(), " shown"] }), s.total != null && /* @__PURE__ */ Y("span", { children: [s.total.toLocaleString(), " total"] })]
			}),
			/* @__PURE__ */ J("div", {
				className: "flex-1 overflow-auto min-h-0",
				children: g.length === 0 ? /* @__PURE__ */ J(i, { children: "No matching assets" }) : /* @__PURE__ */ J("div", {
					className: "divide-y divide-zinc-800/70",
					children: g.map((e) => {
						let t = V(e.url), n = r[f] === e.id, i = Object.entries(e.metadata).filter(([, e]) => e == null || [
							"string",
							"number",
							"boolean"
						].includes(typeof e)).slice(0, 3);
						return /* @__PURE__ */ Y("div", {
							className: `flex items-start gap-2 px-2 py-2.5 border-l-2 transition-colors ${n ? "border-sky-500 bg-sky-500/10" : "border-transparent hover:bg-zinc-800/30"}`,
							children: [/* @__PURE__ */ Y("button", {
								onClick: () => _(e),
								className: "flex-1 min-w-0 text-left group",
								title: `Select ${e.name}`,
								children: [
									/* @__PURE__ */ Y("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [
											/* @__PURE__ */ J("span", {
												className: "w-5 text-center text-zinc-500 shrink-0",
												"aria-hidden": "true",
												children: Fa[e.kind] ?? "·"
											}),
											/* @__PURE__ */ J("span", {
												className: "text-sm text-zinc-100 truncate group-hover:text-sky-300",
												children: e.name
											}),
											e.status && /* @__PURE__ */ J("span", {
												className: `text-[9px] uppercase tracking-wider shrink-0 ${La(e.status)}`,
												children: e.status
											})
										]
									}),
									/* @__PURE__ */ Y("div", {
										className: "ml-7 mt-0.5 flex items-center gap-2 text-[10px] text-zinc-600 min-w-0",
										children: [
											/* @__PURE__ */ J("span", {
												className: "font-mono truncate",
												children: e.id
											}),
											/* @__PURE__ */ J("span", {
												className: "shrink-0",
												children: Ra(e.kind)
											}),
											e.owner && /* @__PURE__ */ Y("span", {
												className: "truncate",
												children: ["owner ", e.owner]
											})
										]
									}),
									e.description && /* @__PURE__ */ J("div", {
										className: "ml-7 mt-1 text-xs text-zinc-500 line-clamp-2",
										children: e.description
									}),
									(i.length > 0 || e.updatedAt) && /* @__PURE__ */ Y("div", {
										className: "ml-7 mt-1 flex gap-x-3 gap-y-1 flex-wrap text-[10px] text-zinc-600",
										children: [i.map(([e, t]) => /* @__PURE__ */ Y("span", { children: [
											Ra(e),
											" ",
											/* @__PURE__ */ J("span", {
												className: "text-zinc-400",
												children: String(t)
											})
										] }, e)), e.updatedAt && /* @__PURE__ */ Y("span", { children: ["updated ", /* @__PURE__ */ J("span", {
											className: "text-zinc-400",
											children: String(pe(e.updatedAt))
										})] })]
									}),
									e.tags.length > 0 && /* @__PURE__ */ J("div", {
										className: "ml-7 mt-1.5 flex gap-1 flex-wrap",
										children: e.tags.map((e) => /* @__PURE__ */ J("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
											children: e
										}, e))
									})
								]
							}), t && /* @__PURE__ */ J("a", {
								href: t,
								...t.startsWith("/") ? {} : {
									target: "_blank",
									rel: "noopener noreferrer"
								},
								className: "text-xs text-zinc-600 hover:text-sky-300 px-1 shrink-0",
								title: "Open asset page",
								children: "↗"
							})]
						}, `${e.kind}:${e.id}`);
					})
				})
			})
		]
	});
}
function La(e) {
	let t = e.toLowerCase();
	return /(healthy|ready|active|ok|published)/.test(t) ? "text-emerald-400" : /(warn|stale|draft|pending)/.test(t) ? "text-amber-400" : /(error|failed|deprecated|archived|blocked)/.test(t) ? "text-red-400" : "text-zinc-500";
}
function Ra(e) {
	return e.replace(/_/g, " ");
}
//#endregion
//#region src/widgets/ObjectView.tsx
var za = /* @__PURE__ */ X({ ObjectView: () => Ba });
function Ba({ data: e, options: t, widgetId: n }) {
	let r = G(() => x(e), [e]), o = t ?? {}, { setCtx: s } = a(), c = ve(n), [l, u] = q(null), [d, f] = q(null);
	if (!r) return /* @__PURE__ */ J(i, { children: "No object" });
	let p = Va(r.properties), m = o.link_context?.type_key ?? "object_type", h = o.link_context?.id_key ?? "object_id", g = (e) => {
		if (Object.keys(e.context).length > 0) for (let [t, n] of Object.entries(e.context)) s(t, n);
		else e.targetType && s(m, e.targetType), s(h, e.targetId);
	}, _ = async (e) => {
		if (!(e.disabled || c.submitting || l)) {
			if (e.confirm && d !== e.id) {
				f(e.id);
				return;
			}
			u(e.id), f(null), await c.submit({
				actionId: e.id,
				params: {
					...e.params,
					object_type: r.objectType,
					object_id: r.objectId
				},
				successMessage: e.label,
				refreshTarget: n ?? "*",
				onComplete: () => u(null)
			}) || u(null);
		}
	};
	return /* @__PURE__ */ Y("div", {
		className: "h-full overflow-auto pr-1",
		children: [
			/* @__PURE__ */ Y("div", {
				className: "pb-3 border-b border-zinc-800",
				children: [
					/* @__PURE__ */ Y("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ Y("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ J("div", {
									className: "text-[10px] uppercase tracking-wider text-zinc-500",
									children: r.objectType || "object"
								}),
								/* @__PURE__ */ J("h4", {
									className: "text-base text-zinc-100 mt-0.5 truncate",
									children: r.title
								}),
								r.objectId && /* @__PURE__ */ J("div", {
									className: "text-[10px] font-mono text-zinc-600 mt-0.5 truncate",
									children: r.objectId
								})
							]
						}), r.status && /* @__PURE__ */ J("span", {
							className: `text-[10px] uppercase tracking-wider shrink-0 ${Ga(r.status)}`,
							children: r.status
						})]
					}),
					r.description && /* @__PURE__ */ J("p", {
						className: "text-xs text-zinc-500 leading-relaxed mt-2",
						children: r.description
					}),
					/* @__PURE__ */ Y("div", {
						className: "flex items-center gap-1.5 flex-wrap mt-2",
						children: [r.tags.map((e) => /* @__PURE__ */ J("span", {
							className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400",
							children: e
						}, e)), r.updatedAt && /* @__PURE__ */ Y("span", {
							className: "text-[10px] text-zinc-600 ml-auto",
							children: ["updated ", String(pe(r.updatedAt))]
						})]
					})
				]
			}),
			p.map(([e, t]) => /* @__PURE__ */ Y("section", {
				className: "py-3 border-b border-zinc-800/70 last:border-0",
				children: [/* @__PURE__ */ J("h5", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5",
					children: e
				}), /* @__PURE__ */ J("dl", { children: t.map((e) => /* @__PURE__ */ Y("div", {
					className: "grid grid-cols-[minmax(7rem,0.42fr)_minmax(0,1fr)] gap-3 py-1.5",
					children: [/* @__PURE__ */ J("dt", {
						className: "text-xs text-zinc-500",
						title: e.description,
						children: e.label
					}), /* @__PURE__ */ J("dd", {
						className: "text-xs text-zinc-200 min-w-0",
						children: /* @__PURE__ */ J(Ha, { property: e })
					})]
				}, e.key)) })]
			}, e)),
			r.links.length > 0 && /* @__PURE__ */ Y("section", {
				className: "py-3 border-b border-zinc-800/70",
				children: [/* @__PURE__ */ J("h5", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5",
					children: "Relationships"
				}), /* @__PURE__ */ J("div", {
					className: "space-y-1",
					children: r.links.map((e, t) => /* @__PURE__ */ Y("button", {
						onClick: () => g(e),
						className: "w-full flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-zinc-800/60 group",
						children: [
							/* @__PURE__ */ J("span", {
								className: "text-[10px] uppercase tracking-wider text-zinc-600 w-24 truncate shrink-0",
								children: e.relation || "related"
							}),
							/* @__PURE__ */ J("span", {
								className: "text-xs text-zinc-200 truncate group-hover:text-sky-300",
								children: e.label
							}),
							/* @__PURE__ */ J("span", {
								className: "text-[10px] font-mono text-zinc-600 truncate ml-auto",
								children: e.targetType
							}),
							e.status && /* @__PURE__ */ J("span", {
								className: Ga(e.status),
								children: "●"
							}),
							/* @__PURE__ */ J("span", {
								className: "text-zinc-600",
								children: "→"
							})
						]
					}, `${e.relation}:${e.targetType}:${e.targetId}:${t}`))
				})]
			}),
			o.enable_actions === !0 && r.actions.length > 0 && /* @__PURE__ */ Y("section", {
				className: "pt-3",
				children: [
					/* @__PURE__ */ J("h5", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-2",
						children: "Actions"
					}),
					/* @__PURE__ */ Y("div", {
						className: "flex gap-2 flex-wrap",
						children: [r.actions.map((e) => {
							let t = d === e.id, n = l === e.id && c.submitting;
							return /* @__PURE__ */ J("button", {
								onClick: () => void _(e),
								disabled: e.disabled || c.submitting || l != null,
								title: e.description,
								className: `px-3 py-1.5 rounded border text-xs disabled:opacity-40 ${Ka(e.style, t)}`,
								children: n ? "Working…" : t ? `Confirm ${e.label}` : e.label
							}, e.id);
						}), d && /* @__PURE__ */ J("button", {
							onClick: () => f(null),
							disabled: c.submitting,
							className: "px-3 py-1.5 rounded border border-zinc-700 text-xs text-zinc-400 hover:text-zinc-100",
							children: "Cancel"
						})]
					}),
					c.result && /* @__PURE__ */ J("div", {
						className: `mt-2 text-xs ${H(c.result.status) ? "text-red-400" : "text-zinc-500"}`,
						children: c.result.message ?? c.result.status
					})
				]
			})
		]
	});
}
function Va(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.group ?? "General", r = t.get(e) ?? [];
		r.push(n), t.set(e, r);
	}
	return [...t.entries()];
}
function Ha({ property: e }) {
	let t = e.format === "link" ? V(e.value) : void 0;
	return t ? /* @__PURE__ */ J("a", {
		href: t,
		...t.startsWith("/") ? {} : {
			target: "_blank",
			rel: "noopener noreferrer"
		},
		className: "text-sky-400 hover:underline break-all",
		children: t
	}) : e.value == null ? /* @__PURE__ */ J("span", {
		className: "text-zinc-600",
		children: "—"
	}) : typeof e.value == "object" ? /* @__PURE__ */ J("pre", {
		className: "font-mono text-[10px] whitespace-pre-wrap break-words text-zinc-400",
		children: Wa(e.value)
	}) : /* @__PURE__ */ J("span", {
		className: "break-words",
		children: Ua(e.value, e.format)
	});
}
function Ua(e, t) {
	return t?.startsWith("currency") && typeof e == "number" ? ne(e, t.split(":")[1] ?? "USD") : t?.startsWith("percent") && typeof e == "number" ? ae(e) : t === "compact" && typeof e == "number" ? oe(e) : (t === "datetime" || t === "date") && typeof e == "string" ? String(pe(e)) : typeof e == "boolean" ? e ? "true" : "false" : String(e);
}
function Wa(e) {
	try {
		return JSON.stringify(e, null, 2);
	} catch {
		return String(e);
	}
}
function Ga(e) {
	let t = e.toLowerCase();
	return /(healthy|ready|active|ok|published|open)/.test(t) ? "text-emerald-400" : /(warn|stale|draft|pending|review)/.test(t) ? "text-amber-400" : /(error|failed|deprecated|archived|blocked|closed)/.test(t) ? "text-red-400" : "text-zinc-500";
}
function Ka(e, t) {
	return t || e === "danger" ? "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20" : e === "primary" ? "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800";
}
//#endregion
//#region src/widgets/CodeBrowser.tsx
var qa = /* @__PURE__ */ X({ CodeBrowser: () => Ja });
function Ja({ data: e, options: t }) {
	let n = G(() => y(e), [e]), r = t ?? {}, { setCtx: o } = a(), [s, c] = q(!1);
	if (!n) return /* @__PURE__ */ J(i, { children: "No repository data" });
	let l = r.repository_ctx ?? "repository", u = r.ref_ctx ?? "repo_ref", d = r.path_ctx ?? "repo_path", f = [...n.entries].sort((e, t) => e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind === "directory" ? -1 : t.kind === "directory" ? 1 : e.name.localeCompare(t.name)), p = V(n.url), m = V(n.file?.url), h = n.path.split("/").filter(Boolean), g = () => {
		n.repository && o(l, n.repository);
	}, _ = (e) => {
		o(u, e), o(d, "");
	}, v = (e) => {
		o(d, e.path);
	}, b = async () => {
		if (!(!n.file || typeof navigator > "u" || !navigator.clipboard)) try {
			await navigator.clipboard.writeText(n.file.content), c(!0), setTimeout(() => c(!1), 1200);
		} catch {
			c(!1);
		}
	};
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col min-h-0",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs shrink-0 min-w-0",
			children: [
				/* @__PURE__ */ J("button", {
					onClick: g,
					className: "font-medium text-zinc-100 hover:text-sky-300 truncate",
					title: n.repository,
					children: n.repository || "repository"
				}),
				p && /* @__PURE__ */ J("a", {
					href: p,
					...p.startsWith("/") ? {} : {
						target: "_blank",
						rel: "noopener noreferrer"
					},
					className: "text-zinc-600 hover:text-sky-300 shrink-0",
					title: "Open repository",
					children: "↗"
				}),
				/* @__PURE__ */ J("span", {
					className: "text-zinc-700",
					children: "/"
				}),
				n.refs.length > 1 ? /* @__PURE__ */ J("select", {
					value: n.ref,
					onChange: (e) => _(e.target.value),
					className: "bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-zinc-600 shrink-0",
					"aria-label": "Repository ref",
					children: n.refs.map((e) => /* @__PURE__ */ J("option", {
						value: e,
						children: e
					}, e))
				}) : /* @__PURE__ */ J("span", {
					className: "font-mono text-[11px] text-zinc-500 shrink-0",
					children: n.ref || "HEAD"
				}),
				/* @__PURE__ */ Y("div", {
					className: "flex items-center gap-1 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ J("button", {
						onClick: () => o(d, ""),
						className: "text-sky-400 hover:underline shrink-0",
						children: "root"
					}), h.map((e, t) => {
						let n = h.slice(0, t + 1).join("/");
						return /* @__PURE__ */ Y("span", {
							className: "flex items-center gap-1 min-w-0",
							children: [/* @__PURE__ */ J("span", {
								className: "text-zinc-700",
								children: "/"
							}), /* @__PURE__ */ J("button", {
								onClick: () => o(d, n),
								className: "text-sky-400 hover:underline truncate",
								title: n,
								children: e
							})]
						}, n);
					})]
				})
			]
		}), /* @__PURE__ */ Y("div", {
			className: "flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(14rem,0.34fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ J("div", {
				className: "overflow-auto border-b md:border-b-0 md:border-r border-zinc-800 min-h-0",
				children: f.length === 0 ? /* @__PURE__ */ J(i, { children: n.file ? "No sibling entries" : "Empty directory" }) : /* @__PURE__ */ J("div", {
					className: "divide-y divide-zinc-800/50",
					children: f.map((e) => /* @__PURE__ */ Y("button", {
						onClick: () => v(e),
						className: `w-full grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-1.5 text-left text-xs hover:bg-zinc-800/50 ${n.file?.path === e.path ? "bg-sky-500/10 text-sky-300" : "text-zinc-300"}`,
						title: e.path,
						children: [
							/* @__PURE__ */ J("span", {
								className: "text-zinc-600",
								"aria-hidden": "true",
								children: e.kind === "directory" ? "▸" : e.kind === "symlink" ? "↗" : "·"
							}),
							/* @__PURE__ */ J("span", {
								className: "truncate",
								children: e.name
							}),
							/* @__PURE__ */ J("span", {
								className: "text-[9px] text-zinc-600 tabular-nums",
								children: e.kind === "file" && e.sizeBytes != null ? Ee(e.sizeBytes) : ""
							})
						]
					}, `${e.kind}:${e.path}`))
				})
			}), /* @__PURE__ */ J("div", {
				className: "min-h-0 flex flex-col overflow-hidden",
				children: n.file ? /* @__PURE__ */ Y(He, { children: [/* @__PURE__ */ Y("div", {
					className: "flex items-center gap-2 px-3 py-1.5 border-b border-zinc-800 text-[10px] text-zinc-500 shrink-0",
					children: [
						/* @__PURE__ */ J("span", {
							className: "font-mono truncate text-zinc-300",
							children: n.file.path
						}),
						n.file.language && /* @__PURE__ */ J("span", {
							className: "uppercase tracking-wider shrink-0",
							children: n.file.language
						}),
						n.file.sizeBytes != null && /* @__PURE__ */ J("span", {
							className: "tabular-nums shrink-0",
							children: Ee(n.file.sizeBytes)
						}),
						n.file.truncated && /* @__PURE__ */ J("span", {
							className: "text-amber-400 uppercase tracking-wider shrink-0",
							children: "truncated"
						}),
						/* @__PURE__ */ J("button", {
							onClick: () => void b(),
							className: "ml-auto text-zinc-500 hover:text-zinc-200 shrink-0",
							children: s ? "Copied" : "Copy"
						}),
						m && /* @__PURE__ */ J("a", {
							href: m,
							...m.startsWith("/") ? {} : {
								target: "_blank",
								rel: "noopener noreferrer"
							},
							className: "text-zinc-500 hover:text-sky-300 shrink-0",
							children: "Raw ↗"
						})
					]
				}), /* @__PURE__ */ J(Ya, {
					content: n.file.content,
					wrap: r.wrap === !0
				})] }) : /* @__PURE__ */ J(i, {
					padded: !0,
					children: "Select a file to inspect its source"
				})
			})]
		})]
	});
}
function Ya({ content: e, wrap: t }) {
	return /* @__PURE__ */ J("div", {
		className: "flex-1 overflow-auto min-h-0 bg-zinc-950/50",
		children: /* @__PURE__ */ J("table", {
			className: "w-full font-mono text-[11px] leading-5",
			children: /* @__PURE__ */ J("tbody", { children: e.split("\n").map((e, n) => /* @__PURE__ */ Y("tr", { children: [/* @__PURE__ */ J("td", {
				className: "sticky left-0 w-12 px-2 text-right align-top select-none text-zinc-700 bg-zinc-950/95 border-r border-zinc-900",
				children: n + 1
			}), /* @__PURE__ */ J("td", {
				className: `px-3 text-zinc-300 align-top ${t ? "whitespace-pre-wrap break-words" : "whitespace-pre"}`,
				children: e || " "
			})] }, n)) })
		})
	});
}
//#endregion
//#region src/widgets/RecordGrid.tsx
var Xa = /* @__PURE__ */ X({ RecordGrid: () => $a });
function Za(e) {
	return e.filter((e) => e.type === "grid" || e.type === "list");
}
function Qa(e, t) {
	return e == null && t == null ? 0 : e == null ? 1 : t == null ? -1 : typeof e == "number" && typeof t == "number" ? e - t : T(e).localeCompare(T(t), void 0, {
		numeric: !0,
		sensitivity: "base"
	});
}
function $a({ data: e, options: t, widgetId: n }) {
	let r = G(() => k(e), [e]), o = t ?? {}, { backendUrl: s, setCtx: c } = a(), l = ve(n), [u, d] = q(""), [f, p] = q(0), [m, h] = q(null), [g, _] = q(null), [v, y] = q(o.view_id ?? "");
	if (W(() => {
		y(o.view_id ?? "");
	}, [o.view_id]), !r) return /* @__PURE__ */ J(i, { children: "No record set" });
	let b = Za(r.views), x = b.find((e) => e.id === v) ?? b.find((e) => e.id === r.activeViewId) ?? b[0], S = (o.visible_fields?.length ? o.visible_fields : x?.visibleFields.length ? x.visibleFields : r.fields.map((e) => e.key)).map((e) => r.fields.find((t) => t.key === e)).filter((e) => !!e), w = Math.max(1, o.page_size ?? 25), E = o.record_id_key ?? "record_id", D = o.table_id_key ?? "table_id", O = r.capabilities.update && o.inline_edit !== !1 && s !== void 0, A = (() => {
		let e = M(r.records, x), t = u.trim().toLowerCase();
		return t && (e = e.filter((e) => S.some((n) => T(e.values[n.key]).toLowerCase().includes(t)))), m && (e = [...e].sort((e, t) => {
			let n = Qa(e.values[m.field], t.values[m.field]);
			return m.descending ? -n : n;
		})), e;
	})(), j = Math.max(1, Math.ceil(A.length / w)), P = Math.min(f, j - 1), F = A.slice(P * w, (P + 1) * w), I = (e) => {
		c(D, r.tableId), c(E, e.id);
		for (let [t, n] of Object.entries(e.context)) c(t, n);
	}, L = () => {
		c(D, r.tableId), c(E, o.new_record_value ?? "new");
	}, ee = (e) => {
		h((t) => t?.field === e ? {
			field: e,
			descending: !t.descending
		} : {
			field: e,
			descending: !1
		}), p(0);
	}, te = async () => {
		!g || l.submitting || await l.submit({
			actionId: r.capabilities.updateActionId,
			params: {
				workspace_id: r.workspaceId,
				table_id: r.tableId,
				record_id: g.record.id,
				revision: g.record.revision,
				values: { [g.field.key]: g.value }
			},
			successMessage: `${N(r, g.record)} updated`,
			refreshTarget: "*",
			onComplete: (e) => {
				H(e.status) || _(null);
			}
		});
	};
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col min-h-0",
		children: [
			/* @__PURE__ */ Y("div", {
				className: "flex items-center gap-2 pb-2",
				children: [
					o.search !== !1 && /* @__PURE__ */ J("input", {
						type: "search",
						value: u,
						onChange: (e) => {
							d(e.target.value), p(0);
						},
						placeholder: `Search ${r.tableName || "records"}…`,
						className: "mtc-control min-w-0 flex-1 px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500"
					}),
					b.length > 1 && /* @__PURE__ */ J("select", {
						value: x?.id ?? "",
						onChange: (e) => {
							y(e.target.value), p(0), h(null);
						},
						className: "mtc-control max-w-[12rem] px-2 py-1.5 text-xs text-zinc-300 outline-none",
						"aria-label": "Saved view",
						children: b.map((e) => /* @__PURE__ */ J("option", {
							value: e.id,
							children: e.name
						}, e.id))
					}),
					r.capabilities.create && /* @__PURE__ */ J("button", {
						type: "button",
						onClick: L,
						className: "mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/30 shrink-0",
						children: "+ New"
					})
				]
			}),
			/* @__PURE__ */ Y("div", {
				className: "overflow-auto flex-1 min-h-0 border border-zinc-800 rounded",
				children: [/* @__PURE__ */ Y("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ J("thead", {
						className: "sticky top-0 z-[1] bg-zinc-900",
						children: /* @__PURE__ */ J("tr", { children: S.map((e) => /* @__PURE__ */ J("th", {
							className: "border-b border-r last:border-r-0 border-zinc-800 px-2.5 py-2 text-left font-medium text-zinc-400 whitespace-nowrap",
							children: /* @__PURE__ */ Y("button", {
								type: "button",
								onClick: () => ee(e.key),
								className: "w-full flex items-center gap-1 text-left hover:text-zinc-100",
								children: [
									/* @__PURE__ */ J("span", { children: e.label }),
									e.required && /* @__PURE__ */ J("span", {
										className: "text-amber-400",
										title: "Required",
										children: "*"
									}),
									e.readOnly && /* @__PURE__ */ J("span", {
										className: "text-zinc-600",
										title: "Computed or read-only",
										children: "◇"
									}),
									m?.field === e.key && /* @__PURE__ */ J("span", {
										className: "ml-auto text-zinc-600",
										children: m.descending ? "↓" : "↑"
									})
								]
							})
						}, e.key)) })
					}), /* @__PURE__ */ J("tbody", { children: F.map((e) => /* @__PURE__ */ J("tr", {
						onClick: () => I(e),
						className: "border-b last:border-b-0 border-zinc-800/70 hover:bg-zinc-800/40 cursor-pointer",
						children: S.map((t) => {
							let n = g?.record.id === e.id && g.field.key === t.key, r = O && C(t);
							return /* @__PURE__ */ J("td", {
								className: "min-w-[9rem] max-w-[22rem] border-r last:border-r-0 border-zinc-800/70 px-2.5 py-2 text-zinc-200 align-top",
								onClick: (e) => {
									r && e.stopPropagation();
								},
								children: n ? /* @__PURE__ */ Y("div", {
									className: "min-w-[10rem]",
									children: [/* @__PURE__ */ J(Le, {
										field: t,
										value: g.value,
										onChange: (e) => _((t) => t && {
											...t,
											value: e
										}),
										compact: !0,
										autoFocus: !0,
										disabled: l.submitting,
										onCommit: () => void te(),
										onCancel: () => _(null)
									}), /* @__PURE__ */ Y("div", {
										className: "flex items-center justify-end gap-1 mt-1",
										children: [/* @__PURE__ */ J("button", {
											type: "button",
											onClick: () => _(null),
											className: "px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
											children: "Cancel"
										}), /* @__PURE__ */ J("button", {
											type: "button",
											onClick: () => void te(),
											disabled: l.submitting,
											className: "px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-sky-300 disabled:opacity-40",
											children: "Save"
										})]
									})]
								}) : /* @__PURE__ */ J("button", {
									type: "button",
									onClick: () => {
										r && _({
											record: e,
											field: t,
											value: e.values[t.key]
										});
									},
									className: `w-full min-h-5 text-left ${r ? "hover:text-sky-300" : "cursor-default"}`,
									title: r ? `Edit ${t.label}` : void 0,
									children: /* @__PURE__ */ J(Ie, {
										field: t,
										value: e.values[t.key]
									})
								})
							}, t.key);
						})
					}, e.id)) })]
				}), F.length === 0 && /* @__PURE__ */ J("div", {
					className: "h-40",
					children: /* @__PURE__ */ J(i, { children: "No matching records" })
				})]
			}),
			/* @__PURE__ */ Y("div", {
				className: "pt-2 flex items-center justify-between gap-3 text-[10px] text-zinc-500",
				children: [/* @__PURE__ */ Y("span", { children: [
					A.length,
					" shown",
					r.total != null && r.total !== A.length ? ` · ${r.total} total` : "",
					x ? ` · ${x.name}` : ""
				] }), j > 1 && /* @__PURE__ */ Y("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ J("button", {
							type: "button",
							onClick: () => p((e) => Math.max(0, e - 1)),
							disabled: P === 0,
							className: "mtc-control px-2 py-0.5 disabled:opacity-30",
							children: "Previous"
						}),
						/* @__PURE__ */ Y("span", {
							className: "px-1 tabular-nums",
							children: [
								P + 1,
								"/",
								j
							]
						}),
						/* @__PURE__ */ J("button", {
							type: "button",
							onClick: () => p((e) => Math.min(j - 1, e + 1)),
							disabled: P === j - 1,
							className: "mtc-control px-2 py-0.5 disabled:opacity-30",
							children: "Next"
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/widgets/RecordBoard.tsx
var eo = /* @__PURE__ */ X({ RecordBoard: () => io });
function to(e) {
	return e.filter((e) => e.type === "board");
}
function no(e) {
	if (e && typeof e == "object" && !Array.isArray(e)) {
		let t = e;
		return String(t.id ?? t.value ?? t.label ?? t.name ?? "");
	}
	return e == null ? "" : String(e);
}
function ro(e) {
	switch (e?.toLowerCase()) {
		case "ok":
		case "green":
		case "emerald": return "bg-emerald-400";
		case "warn":
		case "amber":
		case "yellow":
		case "orange": return "bg-amber-400";
		case "danger":
		case "red": return "bg-red-400";
		case "info":
		case "blue":
		case "cyan":
		case "purple": return "bg-sky-400";
		default: return "bg-zinc-500";
	}
}
function io({ data: e, options: t, widgetId: n }) {
	let r = G(() => k(e), [e]), o = t ?? {}, { backendUrl: s, setCtx: c } = a(), l = ve(n), [u, d] = q(""), [f, p] = q(o.view_id ?? ""), [m, h] = q(null);
	if (W(() => p(o.view_id ?? ""), [o.view_id]), !r) return /* @__PURE__ */ J(i, { children: "No record set" });
	let g = to(r.views), _ = g.find((e) => e.id === f) ?? g.find((e) => e.id === r.activeViewId) ?? g[0], v = o.group_by ?? _?.groupBy, y = r.fields.find((e) => e.key === v);
	if (!y) return /* @__PURE__ */ J(i, {
		padded: !0,
		children: "A board requires a group_by field or board view"
	});
	let b = o.record_id_key ?? "record_id", x = o.table_id_key ?? "table_id", S = o.allow_move !== !1 && r.capabilities.update && s !== void 0 && !y.readOnly, C = M(r.records, _), w = u.trim().toLowerCase(), E = w ? C.filter((e) => Object.values(e.values).some((e) => T(e).toLowerCase().includes(w))) : C, D = [...new Set(E.map((e) => no(e.values[y.key])))], O = [...y.choices.map((e) => e.value), ...D.filter((e) => !y.choices.some((t) => t.value === e))];
	O.includes("") || O.push("");
	let A = (o.card_fields?.length ? o.card_fields : _?.visibleFields.length ? _.visibleFields : r.fields.map((e) => e.key)).filter((e) => e !== (_?.titleField ?? r.primaryField) && e !== y.key).map((e) => r.fields.find((t) => t.key === e)).filter((e) => !!e).slice(0, 4), j = (e) => {
		c(x, r.tableId), c(b, e.id);
		for (let [t, n] of Object.entries(e.context)) c(t, n);
	}, P = async (e, t) => {
		!S || l.submitting || no(e.values[y.key]) === t || await l.submit({
			actionId: r.capabilities.updateActionId,
			params: {
				workspace_id: r.workspaceId,
				table_id: r.tableId,
				record_id: e.id,
				revision: e.revision,
				values: { [y.key]: t || null }
			},
			successMessage: `${N(r, e, _?.titleField)} moved`,
			refreshTarget: "*",
			announce: !1
		});
	};
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col min-h-0",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center gap-2 pb-2",
			children: [
				o.search !== !1 && /* @__PURE__ */ J("input", {
					type: "search",
					value: u,
					onChange: (e) => d(e.target.value),
					placeholder: `Search ${r.tableName || "records"}…`,
					className: "mtc-control flex-1 min-w-0 px-2 py-1.5 text-xs outline-none focus:border-sky-500"
				}),
				g.length > 1 && /* @__PURE__ */ J("select", {
					value: _?.id ?? "",
					onChange: (e) => p(e.target.value),
					className: "mtc-control max-w-[12rem] px-2 py-1.5 text-xs text-zinc-300 outline-none",
					"aria-label": "Saved board view",
					children: g.map((e) => /* @__PURE__ */ J("option", {
						value: e.id,
						children: e.name
					}, e.id))
				}),
				r.capabilities.create && /* @__PURE__ */ J("button", {
					type: "button",
					onClick: () => {
						c(x, r.tableId), c(b, o.new_record_value ?? "new");
					},
					className: "mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/30",
					children: "+ New"
				})
			]
		}), /* @__PURE__ */ J("div", {
			className: "flex-1 min-h-0 overflow-x-auto overflow-y-hidden",
			children: /* @__PURE__ */ J("div", {
				className: "h-full flex gap-3 min-w-max",
				children: O.map((e) => {
					let t = y.choices.find((t) => t.value === e), n = E.filter((t) => no(t.values[y.key]) === e);
					return /* @__PURE__ */ Y("section", {
						className: "w-64 h-full flex flex-col rounded border border-zinc-800 bg-zinc-950/25",
						onDragOver: (e) => {
							S && e.preventDefault();
						},
						onDrop: (t) => {
							t.preventDefault();
							let n = t.dataTransfer.getData("text/record-id") || m, r = E.find((e) => e.id === n);
							h(null), r && P(r, e);
						},
						children: [/* @__PURE__ */ Y("header", {
							className: "flex items-center gap-2 px-3 py-2 border-b border-zinc-800",
							children: [
								/* @__PURE__ */ J("span", { className: `w-1.5 h-1.5 rounded-full ${ro(t?.color)}` }),
								/* @__PURE__ */ J("span", {
									className: "text-[10px] uppercase tracking-wider text-zinc-400 truncate",
									children: (t?.label ?? e) || "Unassigned"
								}),
								/* @__PURE__ */ J("span", {
									className: "ml-auto text-[10px] tabular-nums text-zinc-600",
									children: n.length
								})
							]
						}), /* @__PURE__ */ Y("div", {
							className: "p-2 space-y-2 overflow-y-auto min-h-0",
							children: [n.map((e) => /* @__PURE__ */ Y("article", {
								draggable: S,
								onDragStart: (t) => {
									h(e.id), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/record-id", e.id);
								},
								onDragEnd: () => h(null),
								className: `mtc-landing-card p-3 ${m === e.id ? "opacity-50" : ""}`,
								children: [/* @__PURE__ */ Y("button", {
									type: "button",
									onClick: () => j(e),
									className: "block w-full text-left",
									children: [
										/* @__PURE__ */ J("h4", {
											className: "text-xs font-semibold text-zinc-100 leading-snug",
											children: N(r, e, _?.titleField)
										}),
										/* @__PURE__ */ J("span", {
											className: "text-[9px] font-mono text-zinc-600",
											children: e.id
										}),
										A.length > 0 && /* @__PURE__ */ J("dl", {
											className: "mt-2 space-y-1.5",
											children: A.map((t) => /* @__PURE__ */ Y("div", {
												className: "grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2",
												children: [/* @__PURE__ */ J("dt", {
													className: "text-[9px] uppercase tracking-wider text-zinc-600 truncate",
													children: t.label
												}), /* @__PURE__ */ J("dd", {
													className: "text-[10px] text-zinc-300 min-w-0 truncate",
													children: /* @__PURE__ */ J(Ie, {
														field: t,
														value: e.values[t.key]
													})
												})]
											}, t.key))
										})
									]
								}), S && /* @__PURE__ */ J("select", {
									value: no(e.values[y.key]),
									onChange: (t) => void P(e, t.target.value),
									disabled: l.submitting,
									className: "mtc-control mt-2 w-full px-2 py-1 text-[10px] text-zinc-400 outline-none disabled:opacity-40",
									"aria-label": `Move ${N(r, e, _?.titleField)} to lane`,
									children: O.map((e) => /* @__PURE__ */ J("option", {
										value: e,
										children: (y.choices.find((t) => t.value === e)?.label ?? e) || "Unassigned"
									}, e || "__unassigned"))
								})]
							}, e.id)), n.length === 0 && /* @__PURE__ */ J("div", {
								className: "py-8 text-center text-[10px] text-zinc-700",
								children: "No records"
							})]
						})]
					}, e || "__unassigned");
				})
			})
		})]
	});
}
//#endregion
//#region src/widgets/RecordCalendar.tsx
var ao = /* @__PURE__ */ X({ RecordCalendar: () => fo });
function oo(e) {
	return e.filter((e) => e.type === "calendar" || e.type === "timeline");
}
function so(e) {
	return new Date(e.getFullYear(), e.getMonth(), 1);
}
function co(e, t) {
	return new Date(e.getFullYear(), e.getMonth() + t, 1);
}
function lo(e, t) {
	let n = so(e), r = (n.getDay() - t + 7) % 7, i = new Date(n.getFullYear(), n.getMonth(), 1 - r);
	return Array.from({ length: 42 }, (e, t) => new Date(i.getFullYear(), i.getMonth(), i.getDate() + t));
}
function uo(e) {
	switch (e?.toLowerCase()) {
		case "ok":
		case "green":
		case "emerald": return "bg-emerald-400";
		case "warn":
		case "warning":
		case "amber":
		case "yellow":
		case "orange": return "bg-amber-400";
		case "danger":
		case "error":
		case "red": return "bg-red-400";
		case "neutral":
		case "muted":
		case "gray":
		case "grey": return "bg-zinc-500";
		default: return "bg-sky-400";
	}
}
function fo({ data: e, options: t }) {
	let n = G(() => k(e), [e]), r = t ?? {}, { setCtx: o } = a(), s = r.initial_month ? /* @__PURE__ */ new Date(`${r.initial_month}-01T12:00:00`) : /* @__PURE__ */ new Date(), [c, l] = q(so(Number.isNaN(s.getTime()) ? /* @__PURE__ */ new Date() : s)), [u, d] = q(r.view_id ?? "");
	if (W(() => d(r.view_id ?? ""), [r.view_id]), !n) return /* @__PURE__ */ J(i, { children: "No record set" });
	let f = oo(n.views), p = f.find((e) => e.id === u) ?? f.find((e) => e.id === n.activeViewId) ?? f[0], m = r.date_field ?? p?.dateField, h = n.fields.find((e) => e.key === m);
	if (!h) return /* @__PURE__ */ J(i, {
		padded: !0,
		children: "A calendar requires a date_field or calendar view"
	});
	let g = n.fields.find((e) => e.key === r.color_field), _ = r.week_starts_on ?? 1, v = lo(c, _), y = M(n.records, p), b = /* @__PURE__ */ new Map();
	for (let e of y) {
		let t = w(e.values[h.key]);
		if (!t) continue;
		let n = b.get(t) ?? [];
		n.push(e), b.set(t, n);
	}
	let x = _ === 1 ? [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat",
		"Sun"
	] : [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	], S = w(Date.now()), C = r.record_id_key ?? "record_id", T = r.table_id_key ?? "table_id", E = (e) => {
		o(T, n.tableId), o(C, e.id);
		for (let [t, n] of Object.entries(e.context)) o(t, n);
	};
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col min-h-0",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center gap-2 pb-2",
			children: [
				/* @__PURE__ */ J("button", {
					type: "button",
					onClick: () => l((e) => co(e, -1)),
					className: "mtc-control px-2 py-1 text-xs text-zinc-400",
					"aria-label": "Previous month",
					children: "←"
				}),
				/* @__PURE__ */ J("button", {
					type: "button",
					onClick: () => l(so(/* @__PURE__ */ new Date())),
					className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
					children: "Today"
				}),
				/* @__PURE__ */ J("h4", {
					className: "text-sm font-semibold text-zinc-100",
					children: c.toLocaleDateString(void 0, {
						month: "long",
						year: "numeric"
					})
				}),
				/* @__PURE__ */ J("button", {
					type: "button",
					onClick: () => l((e) => co(e, 1)),
					className: "mtc-control px-2 py-1 text-xs text-zinc-400",
					"aria-label": "Next month",
					children: "→"
				}),
				f.length > 1 && /* @__PURE__ */ J("select", {
					value: p?.id ?? "",
					onChange: (e) => d(e.target.value),
					className: "mtc-control ml-auto max-w-[12rem] px-2 py-1 text-xs text-zinc-300 outline-none",
					"aria-label": "Saved calendar view",
					children: f.map((e) => /* @__PURE__ */ J("option", {
						value: e.id,
						children: e.name
					}, e.id))
				})
			]
		}), /* @__PURE__ */ J("div", {
			className: "flex-1 min-h-0 overflow-x-auto",
			children: /* @__PURE__ */ Y("div", {
				className: "h-full min-w-[42rem] flex flex-col",
				children: [/* @__PURE__ */ J("div", {
					className: "grid grid-cols-7 border-t border-l border-zinc-800 text-[9px] uppercase tracking-wider text-zinc-600",
					children: x.map((e) => /* @__PURE__ */ J("div", {
						className: "border-r border-b border-zinc-800 px-2 py-1",
						children: e
					}, e))
				}), /* @__PURE__ */ J("div", {
					className: "grid grid-cols-7 grid-rows-6 flex-1 min-h-0 border-l border-zinc-800 overflow-hidden",
					children: v.map((e) => {
						let t = w(e), r = b.get(t) ?? [], i = e.getMonth() === c.getMonth();
						return /* @__PURE__ */ Y("div", {
							className: `min-w-0 min-h-0 border-r border-b border-zinc-800 p-1.5 overflow-y-auto ${i ? "bg-zinc-900/35" : "bg-zinc-950/45"}`,
							children: [/* @__PURE__ */ J("div", {
								className: `text-[10px] tabular-nums mb-1 ${t === S ? "w-5 h-5 grid place-items-center rounded-full bg-sky-500 text-zinc-100" : i ? "text-zinc-400" : "text-zinc-700"}`,
								children: e.getDate()
							}), /* @__PURE__ */ Y("div", {
								className: "space-y-1",
								children: [r.slice(0, 4).map((e) => /* @__PURE__ */ Y("button", {
									type: "button",
									onClick: () => E(e),
									className: "w-full flex items-start gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-1 text-left hover:border-zinc-600",
									title: N(n, e, p?.titleField),
									children: [/* @__PURE__ */ J("span", { className: `mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${uo(j(g, g ? e.values[g.key] : void 0))}` }), /* @__PURE__ */ J("span", {
										className: "text-[9px] leading-tight text-zinc-300 line-clamp-2",
										children: N(n, e, p?.titleField)
									})]
								}, e.id)), r.length > 4 && /* @__PURE__ */ Y("div", {
									className: "text-[9px] text-zinc-600 px-1",
									children: [
										"+",
										r.length - 4,
										" more"
									]
								})]
							})]
						}, t);
					})
				})]
			})
		})]
	});
}
//#endregion
//#region src/widgets/RecordForm.tsx
var po = /* @__PURE__ */ X({ RecordForm: () => ho });
function mo(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function ho({ data: e, options: t, widgetId: n }) {
	let r = G(() => k(e), [e]), o = t ?? {}, { backendUrl: s, ctx: c, setCtx: l, toast: u } = a(), d = ve(n), f = o.record_id_key ?? "record_id", p = o.table_id_key ?? "table_id", m = c[f], h = r?.records.find((e) => e.id === m), g = o.mode ?? "auto", _ = g === "edit" || g === "auto" && !!h, [v, y] = q({}), [b, x] = q({}), [S, w] = q(!1), T = r ? A(r, "form", o.view_id) : void 0, D = o.fields?.length ? o.fields : T?.visibleFields.length ? T.visibleFields : r?.fields.map((e) => e.key) ?? [], j = r ? D.map((e) => r.fields.find((t) => t.key === e)).filter((e) => !!e).filter((e) => o.show_read_only !== !1 || C(e)) : [];
	if (W(() => {
		y(E(j, _ ? h : void 0)), x({}), w(!1);
	}, [
		r?.tableId,
		h?.id,
		h?.revision,
		_,
		D.join("|")
	]), !r) return /* @__PURE__ */ J(i, { children: "No record set" });
	if (_ && !h) return /* @__PURE__ */ J(i, {
		padded: !0,
		children: "Select a record from a grid, board, or calendar to edit it"
	});
	let M = j.filter(C), P = s !== void 0 && (_ ? r.capabilities.update : r.capabilities.create), F = o.columns === 2 ? "md:grid-cols-2" : "grid-cols-1", I = (e, t) => {
		y((n) => ({
			...n,
			[e]: t
		})), x((t) => {
			if (!t[e]) return t;
			let n = { ...t };
			return delete n[e], n;
		});
	}, L = (e) => {
		if (H(e.status)) return;
		let t = e.data?.record_id ?? e.data?.recordId ?? e.id;
		!_ && t && (l(p, r.tableId), l(f, String(t)));
	}, ee = async () => {
		if (!P || d.submitting) return;
		let e = {};
		for (let t of M) t.required && mo(v[t.key]) && (e[t.key] = "Required");
		if (x(e), Object.keys(e).length > 0) {
			u("Complete the required fields", "warn");
			return;
		}
		let t = _ ? O(M, v, h) : Object.fromEntries(M.map((e) => [e.key, v[e.key]]));
		if (_ && Object.keys(t).length === 0) {
			u("No changes to save", "info");
			return;
		}
		await d.submit({
			actionId: _ ? r.capabilities.updateActionId : r.capabilities.createActionId,
			params: {
				workspace_id: r.workspaceId,
				table_id: r.tableId,
				..._ ? {
					record_id: h.id,
					revision: h.revision
				} : {},
				values: t
			},
			successMessage: _ ? `${N(r, h, T?.titleField)} updated` : `${r.tableName || "Record"} created`,
			refreshTarget: "*",
			onComplete: L
		});
	}, te = async () => {
		if (!(!h || !r.capabilities.delete || s === void 0 || d.submitting)) {
			if (!S) {
				w(!0);
				return;
			}
			await d.submit({
				actionId: r.capabilities.deleteActionId,
				params: {
					workspace_id: r.workspaceId,
					table_id: r.tableId,
					record_id: h.id,
					revision: h.revision
				},
				successMessage: `${N(r, h, T?.titleField)} deleted`,
				refreshTarget: "*",
				onComplete: (e) => {
					H(e.status) || (l(f, o.new_record_value ?? "new"), w(!1));
				}
			});
		}
	};
	return /* @__PURE__ */ Y("form", {
		className: "h-full flex flex-col min-h-0",
		onSubmit: (e) => {
			e.preventDefault(), ee();
		},
		children: [
			/* @__PURE__ */ Y("div", {
				className: "flex items-start justify-between gap-3 pb-3 border-b border-zinc-800",
				children: [/* @__PURE__ */ Y("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ Y("div", {
							className: "text-[10px] uppercase tracking-wider text-zinc-500",
							children: [
								_ ? "Edit record" : "New record",
								" · ",
								r.tableName || r.tableId
							]
						}),
						/* @__PURE__ */ J("h4", {
							className: "text-sm font-semibold text-zinc-100 mt-0.5 truncate",
							children: _ && h ? N(r, h, T?.titleField) : `Add to ${r.tableName || "table"}`
						}),
						_ && h && /* @__PURE__ */ Y("div", {
							className: "text-[9px] font-mono text-zinc-600 mt-0.5",
							children: [h.id, h.revision ? ` · rev ${h.revision}` : ""]
						})
					]
				}), g === "auto" && /* @__PURE__ */ J("button", {
					type: "button",
					onClick: () => {
						l(p, r.tableId), l(f, o.new_record_value ?? "new");
					},
					className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 shrink-0",
					children: "New"
				})]
			}),
			/* @__PURE__ */ J("div", {
				className: `grid ${F} gap-x-4 gap-y-3 py-3 overflow-y-auto flex-1 min-h-0 pr-1`,
				children: j.map((e) => /* @__PURE__ */ Y("label", {
					className: e.type === "long_text" ? "md:col-span-2" : "",
					children: [
						/* @__PURE__ */ Y("span", {
							className: "flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wider text-zinc-500",
							children: [
								e.label,
								e.required && /* @__PURE__ */ J("span", {
									className: "text-amber-400",
									children: "*"
								}),
								e.readOnly && /* @__PURE__ */ J("span", {
									className: "normal-case tracking-normal text-zinc-700",
									children: "computed"
								}),
								b[e.key] && /* @__PURE__ */ J("span", {
									className: "ml-auto text-red-400 normal-case tracking-normal",
									children: b[e.key]
								})
							]
						}),
						/* @__PURE__ */ J(Le, {
							field: e,
							value: v[e.key],
							onChange: (t) => I(e.key, t),
							disabled: d.submitting
						}),
						e.description && /* @__PURE__ */ J("span", {
							className: "block text-[9px] text-zinc-600 mt-1 leading-relaxed",
							children: e.description
						})
					]
				}, e.key))
			}),
			/* @__PURE__ */ Y("div", {
				className: "pt-3 border-t border-zinc-800 flex items-center gap-2",
				children: [
					_ && r.capabilities.delete && /* @__PURE__ */ J("button", {
						type: "button",
						onClick: () => void te(),
						disabled: d.submitting || s === void 0,
						className: `mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider disabled:opacity-40 ${S ? "text-red-300 border-red-500/40 bg-red-500/10" : "text-zinc-500"}`,
						children: S ? "Confirm delete" : "Delete"
					}),
					/* @__PURE__ */ J("button", {
						type: "button",
						onClick: () => {
							y(E(j, _ ? h : void 0)), x({}), w(!1);
						},
						disabled: d.submitting,
						className: "mtc-control ml-auto px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 disabled:opacity-40",
						children: "Reset"
					}),
					/* @__PURE__ */ J("button", {
						type: "submit",
						disabled: !P || d.submitting,
						className: "mtc-control px-3 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/40 bg-sky-500/10 disabled:opacity-40",
						title: P ? void 0 : "This record set is read-only or backendUrl is missing",
						children: d.submitting ? "Saving…" : o.submit_label ?? (_ ? "Save changes" : "Create record")
					})
				]
			})
		]
	});
}
//#endregion
//#region src/widgets/OrderBook.tsx
var go = /* @__PURE__ */ X({ OrderBook: () => vo }), _o = 10;
function vo({ data: e, options: t }) {
	let { setCtx: n } = a(), r = G(() => bo(e), [e]), o = t?.price_context, s = o ? (e, t) => {
		n(o.key, String(e)), o.side_key && n(o.side_key, t === "bid" ? "buy" : "sell");
	} : void 0;
	if (!r) return /* @__PURE__ */ J(i, { children: "No data" });
	let c = r.bids[0]?.price, l = r.asks[0]?.price, u = r.mid ?? (c != null && l != null ? (c + l) / 2 : 0), d = r.spread ?? (c != null && l != null ? l - c : 0), f = r.bids.slice(0, _o), p = r.asks.slice(0, _o).reverse(), m = Math.max(...r.bids.map((e) => e.size), ...r.asks.map((e) => e.size), 1);
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col text-xs font-mono",
		children: [
			/* @__PURE__ */ Y("div", {
				className: "grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800",
				children: [
					/* @__PURE__ */ J("span", { children: "Price" }),
					/* @__PURE__ */ J("span", {
						className: "text-right",
						children: "Size"
					}),
					/* @__PURE__ */ J("span", {
						className: "text-right",
						children: "Cum"
					})
				]
			}),
			/* @__PURE__ */ Y("div", {
				className: "flex-1 flex flex-col min-h-0",
				children: [
					/* @__PURE__ */ J("div", {
						className: "flex-1 overflow-auto",
						children: p.map((e, t) => /* @__PURE__ */ J(yo, {
							side: "ask",
							level: e,
							cum: p.slice(t).reduce((e, t) => e + t.size, 0),
							maxSize: m,
							onPrice: s
						}, `ask-${t}`))
					}),
					/* @__PURE__ */ Y("div", {
						className: "border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0",
						children: [/* @__PURE__ */ J("span", {
							className: "text-zinc-200 tabular-nums",
							children: So(u)
						}), /* @__PURE__ */ Y("span", {
							className: "text-zinc-500 text-[10px]",
							children: ["spread ", So(d)]
						})]
					}),
					/* @__PURE__ */ J("div", {
						className: "flex-1 overflow-auto",
						children: f.map((e, t) => /* @__PURE__ */ J(yo, {
							side: "bid",
							level: e,
							cum: f.slice(0, t + 1).reduce((e, t) => e + t.size, 0),
							maxSize: m,
							onPrice: s
						}, `bid-${t}`))
					})
				]
			}),
			r.venue && /* @__PURE__ */ J("div", {
				className: "text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0",
				children: r.venue
			})
		]
	});
}
function yo({ side: e, level: t, cum: n, maxSize: r, onPrice: i }) {
	let a = t.size / r * 100, o = e === "bid" ? "bg-emerald-500/10" : "bg-red-500/10", s = e === "bid" ? "text-emerald-400" : "text-red-400";
	return /* @__PURE__ */ Y("div", {
		onClick: i ? () => i(t.price, e) : void 0,
		className: `relative grid grid-cols-3 gap-2 px-2 py-0.5 ${i ? "cursor-pointer hover:bg-zinc-800/40" : ""}`,
		children: [
			/* @__PURE__ */ J("div", {
				className: `absolute inset-y-0 right-0 ${o}`,
				style: { width: `${a}%` }
			}),
			/* @__PURE__ */ J("span", {
				className: `relative ${s} tabular-nums`,
				children: So(t.price)
			}),
			/* @__PURE__ */ J("span", {
				className: "relative text-right text-zinc-200 tabular-nums",
				children: Co(t.size)
			}),
			/* @__PURE__ */ J("span", {
				className: "relative text-right text-zinc-500 tabular-nums",
				children: Co(n)
			})
		]
	});
}
function bo(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e, n = xo(t.bids), r = xo(t.asks);
	return n.length === 0 && r.length === 0 ? null : {
		bids: n,
		asks: r,
		mid: typeof t.mid == "number" ? t.mid : void 0,
		spread: typeof t.spread == "number" ? t.spread : void 0,
		venue: typeof t.venue == "string" ? t.venue : void 0
	};
}
function xo(e) {
	return Array.isArray(e) ? e.map((e) => {
		let t = e;
		return {
			price: Number(t.price ?? 0),
			size: Number(t.size ?? 0)
		};
	}).filter((e) => Number.isFinite(e.price) && Number.isFinite(e.size) && e.size > 0) : [];
}
function So(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(2);
}
function Co(e) {
	return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
//#endregion
//#region src/widgets/PairedGrid.tsx
var wo = /* @__PURE__ */ X({ PairedGrid: () => Eo }), To = 6;
function Eo({ data: e, options: t }) {
	let { setCtx: n } = a(), r = G(() => Do(e), [e]), o = G(() => r ? [...r.rows].sort((e, t) => e.key - t.key) : [], [r]);
	if (!r) return /* @__PURE__ */ J(i, { children: "No data" });
	let s = r.subject_value, c = o.length >= 2 ? o[1].key - o[0].key : 0, l = r.measures, u = t?.row_context;
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col text-xs",
		children: [/* @__PURE__ */ Y("div", {
			className: "px-3 py-2 border-b border-zinc-800 flex items-baseline gap-3 flex-wrap shrink-0",
			children: [
				/* @__PURE__ */ J("span", {
					className: "text-zinc-100 font-medium",
					children: r.subject
				}),
				r.dimension && /* @__PURE__ */ J("span", {
					className: "text-zinc-500",
					children: r.dimension
				}),
				s != null && /* @__PURE__ */ J("span", {
					className: "text-zinc-300 tabular-nums",
					children: s.toLocaleString()
				}),
				r.venue && /* @__PURE__ */ J("span", {
					className: "ml-auto text-zinc-500 text-[10px] uppercase tracking-wider",
					children: r.venue
				})
			]
		}), /* @__PURE__ */ J("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: /* @__PURE__ */ Y("table", {
				className: "w-full font-mono tabular-nums",
				children: [/* @__PURE__ */ Y("thead", {
					className: "sticky top-0 bg-zinc-900 z-10",
					children: [/* @__PURE__ */ Y("tr", {
						className: "text-[10px] text-zinc-600 border-b border-zinc-800/60",
						children: [
							/* @__PURE__ */ J("th", {
								colSpan: l.length,
								className: "text-center py-1 text-emerald-400 uppercase tracking-wider",
								children: r.left_label
							}),
							/* @__PURE__ */ J("th", { className: "bg-zinc-950" }),
							/* @__PURE__ */ J("th", {
								colSpan: l.length,
								className: "text-center py-1 text-red-400 uppercase tracking-wider",
								children: r.right_label
							})
						]
					}), /* @__PURE__ */ Y("tr", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800",
						children: [
							l.map((e) => /* @__PURE__ */ J("th", {
								className: "text-right px-2 py-1.5",
								children: e.label
							}, `l-${e.key}`)),
							/* @__PURE__ */ J("th", {
								className: "text-center px-2 py-1.5 bg-zinc-950",
								children: r.key_label
							}),
							l.map((e) => /* @__PURE__ */ J("th", {
								className: "text-right px-2 py-1.5",
								children: e.label
							}, `r-${e.key}`))
						]
					})]
				}), /* @__PURE__ */ J("tbody", { children: o.map((e, t) => {
					let r = s != null && c > 0 && Math.abs(e.key - s) < c, i = !!u;
					return /* @__PURE__ */ Y("tr", {
						onClick: i ? () => n(u.key, String(e.key)) : void 0,
						className: `border-b border-zinc-800/40 ${`${r ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"} ${i ? "cursor-pointer" : ""}`}`,
						children: [
							l.map((t) => /* @__PURE__ */ J("td", {
								className: "text-right px-2 py-1 text-zinc-300",
								children: jo(e.left?.values?.[t.key], t.format)
							}, `l-${t.key}`)),
							/* @__PURE__ */ J("td", {
								className: `text-center px-2 py-1 font-medium ${r ? "text-zinc-100 bg-zinc-950/60" : "text-zinc-300 bg-zinc-950/40"}`,
								children: e.key.toLocaleString()
							}),
							l.map((t) => /* @__PURE__ */ J("td", {
								className: "text-right px-2 py-1 text-zinc-300",
								children: jo(e.right?.values?.[t.key], t.format)
							}, `r-${t.key}`))
						]
					}, t);
				}) })]
			})
		})]
	});
}
function Do(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e;
	if (!Array.isArray(t.rows) || t.rows.length === 0) return null;
	let n = t.rows.map((e) => {
		let t = e;
		return {
			key: Number(t.key ?? t.strike ?? 0),
			left: Ao(t.left ?? t.call),
			right: Ao(t.right ?? t.put)
		};
	}), r = Oo(t.measures), i = r.length > 0 ? r : ko(n);
	return {
		subject: String(t.subject ?? t.underlying ?? ""),
		dimension: typeof t.dimension == "string" ? t.dimension : typeof t.expiry == "string" ? t.expiry : void 0,
		subject_value: typeof t.subject_value == "number" ? t.subject_value : typeof t.underlying_price == "number" ? t.underlying_price : void 0,
		venue: typeof t.venue == "string" ? t.venue : void 0,
		rows: n,
		left_label: String(t.left_label ?? "Left"),
		right_label: String(t.right_label ?? "Right"),
		key_label: String(t.key_label ?? "Key"),
		measures: i
	};
}
function Oo(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e) {
		if (!n || typeof n != "object") continue;
		let e = n;
		typeof e.key == "string" && t.push({
			key: e.key,
			label: typeof e.label == "string" && e.label ? e.label : e.key,
			format: typeof e.format == "string" ? e.format : void 0
		});
	}
	return t;
}
function ko(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of [n.left, n.right]) if (e?.values) for (let n of Object.keys(e.values)) t.add(n);
	return Array.from(t).slice(0, To).map((e) => ({
		key: e,
		label: e
	}));
}
function Ao(e) {
	if (!e || typeof e != "object") return;
	let t = e;
	if (t.values && typeof t.values == "object" && !Array.isArray(t.values)) {
		let e = {};
		for (let [n, r] of Object.entries(t.values)) typeof r == "number" && (e[n] = r);
		return Object.keys(e).length === 0 ? void 0 : { values: e };
	}
	let n = {};
	for (let [e, r] of Object.entries(t)) typeof r == "number" && (n[e] = r);
	return Object.keys(n).length === 0 ? void 0 : { values: n };
}
function jo(e, t) {
	if (e == null) return "·";
	if (t === "percent") return `${(e * 100).toFixed(0)}%`;
	if (t === "compact") return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
	if (t === "delta") return `${e > 0 ? "+" : ""}${e.toFixed(2)}`;
	if (t?.startsWith("currency")) {
		let n = t.split(":")[1] ?? "USD";
		return e.toLocaleString(void 0, {
			style: "currency",
			currency: n,
			maximumFractionDigits: 0
		});
	}
	return e.toFixed(2);
}
//#endregion
//#region src/widgets/Trade.tsx
var Mo = /* @__PURE__ */ X({ Trade: () => No });
function No({ options: e, widgetId: t }) {
	let n = e ?? {}, { ctx: r, toast: o, backendUrl: s, emit: l } = a(), { submit: u, submitting: d, result: f } = ve(t), p = n.symbol ?? r.symbol ?? "", m = n.url, h = n.action_id ?? "place_order", g = s === void 0 ? m ? "url" : null : "connect", [_, v] = q("buy"), [y, b] = q(""), [x, S] = q(""), C = K(r.price);
	W(() => {
		r.price !== C.current && (C.current = r.price, r.price != null && S(r.price));
	}, [r.price]);
	let w = K(r.side);
	W(() => {
		r.side !== w.current && (w.current = r.side, (r.side === "buy" || r.side === "sell") && v(r.side));
	}, [r.side]);
	let [T, E] = q(!1), D = K(!1), [O, k] = q(null), [A, j] = q(null), [M, N] = q(!1), P = g === "connect" ? d : T;
	W(() => {
		M && N(!1);
	}, [
		y,
		x,
		_
	]);
	let F = U(async () => {
		if (!g || P || g === "url" && D.current) return;
		let e = Number(y);
		if (!Number.isFinite(e) || e <= 0) {
			j("Amount must be a positive number");
			return;
		}
		let t = x ? Number(x) : void 0;
		if (x && (!Number.isFinite(t) || t <= 0)) {
			j("Price must be positive");
			return;
		}
		if (n.confirm && !M) {
			N(!0), j(null), k(null);
			return;
		}
		N(!1);
		let r = {
			symbol: p,
			side: _,
			amount: e,
			type: t == null ? "market" : "limit",
			...t != null && { price: t }
		};
		if (j(null), k(null), g === "connect") {
			await u({
				actionId: h,
				params: r,
				successMessage: "Order completed",
				refresh: !1,
				onComplete: (e) => {
					H(e.status) || (b(""), S(""), N(!1));
				}
			});
			return;
		}
		D.current = !0, E(!0);
		let i = c();
		try {
			let e = await fetch(m, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": i
				},
				body: JSON.stringify(r)
			});
			if (!e.ok) throw Error(`HTTP ${e.status}`);
			let t = await e.json().catch(() => ({})), n = typeof t.message == "string" ? t.message : "Order submitted", a = typeof t.status == "string" && t.status ? t.status : "ACTION_STATUS_OK";
			l({
				type: "action",
				actionId: h,
				clientRequestId: i,
				status: a,
				message: n,
				terminal: t.status == null || _e(a)
			}), H(t.status) ? (j(n), o(n, "error")) : (k(n), o(n, "ok"), b(""), S(""), N(!1));
		} catch (e) {
			let t = e instanceof Error ? e.message : "Submit failed";
			j(t), o(t, "error"), l({
				type: "action",
				actionId: h,
				clientRequestId: i,
				status: "ACTION_STATUS_FAILED",
				message: t,
				terminal: !0
			});
		} finally {
			D.current = !1, E(!1);
		}
	}, [
		g,
		m,
		h,
		P,
		y,
		x,
		p,
		_,
		n.confirm,
		M,
		o,
		l,
		u
	]);
	if (W(() => {
		if (!M) return;
		let e = (e) => {
			e.key === "Escape" && N(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [M]), !g) return /* @__PURE__ */ J(i, { children: "Trade requires backendUrl or options.url" });
	let I = (e) => `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${_ === e ? e === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"}`, L = _ === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
	if (M) {
		let e = x ? Number(x) : null, t = `${_.toUpperCase()} ${y}${n.quote_unit ? ` ${n.quote_unit}` : ""} ${e ? `@ ${e.toLocaleString()}` : "at market"}`;
		return /* @__PURE__ */ Y("div", {
			className: "flex flex-col gap-2 h-full justify-center",
			children: [
				/* @__PURE__ */ J("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500",
					children: "Confirm"
				}),
				/* @__PURE__ */ J("div", {
					className: `text-sm font-medium ${_ === "buy" ? "text-emerald-300" : "text-red-300"}`,
					children: t
				}),
				p && /* @__PURE__ */ J("div", {
					className: "text-xs text-zinc-500",
					children: p
				}),
				/* @__PURE__ */ Y("div", {
					className: "flex gap-2 mt-1",
					children: [/* @__PURE__ */ J("button", {
						onClick: () => N(!1),
						className: "flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
						children: "Cancel"
					}), /* @__PURE__ */ J("button", {
						onClick: F,
						disabled: P,
						className: `flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-30 ${L}`,
						children: P ? "..." : "Confirm"
					})]
				}),
				A && /* @__PURE__ */ J("div", {
					className: "text-xs text-red-400",
					children: A
				})
			]
		});
	}
	return /* @__PURE__ */ Y("div", {
		className: "flex flex-col gap-2 h-full",
		children: [
			/* @__PURE__ */ Y("div", {
				className: "flex gap-1 bg-zinc-950 rounded p-1",
				children: [/* @__PURE__ */ J("button", {
					onClick: () => v("buy"),
					className: I("buy"),
					children: "Buy"
				}), /* @__PURE__ */ J("button", {
					onClick: () => v("sell"),
					className: I("sell"),
					children: "Sell"
				})]
			}),
			p && /* @__PURE__ */ Y("div", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: [p, n.available != null && /* @__PURE__ */ Y("span", {
					className: "ml-2 text-zinc-400 normal-case",
					children: [
						"avail ",
						/* @__PURE__ */ J("span", {
							className: "tabular-nums text-zinc-200",
							children: n.available.toLocaleString()
						}),
						n.quote_unit && /* @__PURE__ */ J("span", {
							className: "ml-1",
							children: n.quote_unit
						})
					]
				})]
			}),
			/* @__PURE__ */ J(Po, {
				label: "Amount",
				unit: n.quote_unit,
				value: y,
				onChange: b,
				disabled: P
			}),
			n.quick_amounts && n.quick_amounts.length > 0 && n.available != null && /* @__PURE__ */ J("div", {
				className: "flex gap-1",
				children: n.quick_amounts.map((e, t) => {
					let r = (n.available * e).toFixed(6).replace(/\.?0+$/, "");
					return /* @__PURE__ */ Y("button", {
						onClick: () => b(r),
						disabled: P,
						className: "flex-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30",
						title: `${(e * 100).toFixed(0)}% of available`,
						children: [(e * 100).toFixed(0), "%"]
					}, t);
				})
			}),
			/* @__PURE__ */ J(Po, {
				label: "Price",
				placeholder: "market",
				value: x,
				onChange: S,
				disabled: P
			}),
			/* @__PURE__ */ J("button", {
				onClick: F,
				disabled: P || !y,
				className: `mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${L}`,
				children: P ? "..." : _ === "buy" ? `Buy ${n.quote_unit ?? ""}`.trim() : `Sell ${n.quote_unit ?? ""}`.trim()
			}),
			(g === "connect" ? f && !H(f.status) ? f.message ?? f.status : null : O) && /* @__PURE__ */ J("div", {
				className: "text-xs text-emerald-400",
				children: g === "connect" ? f?.message ?? f?.status : O
			}),
			(g === "connect" && f && H(f.status) ? f.message ?? `${h} failed` : A) && /* @__PURE__ */ J("div", {
				className: "text-xs text-red-400",
				children: g === "connect" && f && H(f.status) ? f.message ?? `${h} failed` : A
			})
		]
	});
}
function Po({ label: e, unit: t, placeholder: n, value: r, onChange: i, disabled: a }) {
	return /* @__PURE__ */ Y("div", {
		className: "flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 focus-within:border-zinc-500",
		children: [
			/* @__PURE__ */ J("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500 w-12 shrink-0",
				children: e
			}),
			/* @__PURE__ */ J("input", {
				type: "number",
				inputMode: "decimal",
				placeholder: n ?? "0.00",
				value: r,
				onChange: (e) => i(e.target.value),
				disabled: a,
				className: "flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
			}),
			t && /* @__PURE__ */ J("span", {
				className: "text-xs text-zinc-500 shrink-0",
				children: t
			})
		]
	});
}
//#endregion
//#region src/widgets/Ticker.tsx
var Fo = /* @__PURE__ */ X({ Ticker: () => Ro }), Io = {
	EVENT_STATUS_OK: "border-emerald-500/40 text-emerald-300",
	EVENT_STATUS_WARN: "border-amber-500/40   text-amber-300",
	EVENT_STATUS_ERROR: "border-red-500/40     text-red-300",
	EVENT_STATUS_INFO: "border-sky-500/40     text-sky-300",
	EVENT_STATUS_PENDING: "border-zinc-500/40    text-zinc-300",
	ok: "border-emerald-500/40 text-emerald-300",
	warn: "border-amber-500/40   text-amber-300",
	error: "border-red-500/40     text-red-300",
	info: "border-sky-500/40     text-sky-300",
	pending: "border-zinc-500/40    text-zinc-300"
}, Lo = "border-zinc-700 text-zinc-300";
function Ro({ data: e, options: t }) {
	let n = G(() => Bo(e), [e]);
	return !n || n.length === 0 ? /* @__PURE__ */ J(i, { children: "No items" }) : /* @__PURE__ */ J("div", {
		className: "h-full overflow-hidden flex items-center group",
		children: /* @__PURE__ */ Y("div", {
			className: "flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]",
			style: { animationDuration: `${Math.max(5, (t ?? {}).speed_seconds ?? 30)}s` },
			children: [n.map((e, t) => /* @__PURE__ */ J(zo, { item: e }, `a-${t}`)), n.map((e, t) => /* @__PURE__ */ J(zo, {
				item: e,
				"aria-hidden": !0
			}, `b-${t}`))]
		})
	});
}
function zo({ item: e, ...t }) {
	let n = Io[e.status ?? ""] ?? Lo;
	return /* @__PURE__ */ Y("div", {
		...t,
		className: `shrink-0 px-2.5 py-1 rounded border bg-zinc-900/40 text-xs flex items-center gap-2 font-mono ${n}`,
		children: [/* @__PURE__ */ J("span", {
			className: "text-[10px] text-zinc-500 tabular-nums",
			children: e.timestamp
		}), /* @__PURE__ */ J("span", { children: e.label })]
	});
}
function Bo(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.events) ? t = n.events : Array.isArray(n.items) && (t = n.items);
	}
	return t ? t.map((e) => {
		let t = e;
		return {
			timestamp: String(t.timestamp ?? ""),
			label: String(t.label ?? ""),
			status: t.status == null ? void 0 : String(t.status)
		};
	}) : null;
}
//#endregion
//#region src/widgets/VolumeProfile.tsx
var Vo = /* @__PURE__ */ X({ VolumeProfile: () => Ho });
function Ho({ data: e }) {
	let t = G(() => Uo(e), [e]);
	if (!t || t.length === 0) return /* @__PURE__ */ J(i, { children: "No data" });
	let n = Math.max(...t.map((e) => e.volume), 1);
	return /* @__PURE__ */ J("div", {
		className: "h-full overflow-auto",
		children: /* @__PURE__ */ J("div", {
			className: "flex flex-col gap-px font-mono text-[10px]",
			children: t.map((e, t) => {
				let r = e.volume / n * 100;
				return /* @__PURE__ */ Y("div", {
					className: "relative flex items-center px-2 py-0.5",
					title: `${e.price} — ${e.volume.toLocaleString()}`,
					children: [
						/* @__PURE__ */ J("div", {
							className: "absolute inset-y-0.5 left-16 bg-sky-500/20 rounded-sm",
							style: {
								width: `${r}%`,
								maxWidth: "calc(100% - 4.5rem)"
							}
						}),
						/* @__PURE__ */ J("span", {
							className: "relative w-14 shrink-0 text-zinc-300 tabular-nums",
							children: Wo(e.price)
						}),
						/* @__PURE__ */ J("span", {
							className: "relative ml-auto text-zinc-400 tabular-nums",
							children: Go(e.volume)
						})
					]
				}, t);
			})
		})
	});
}
function Uo(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.rows) ? t = n.rows : Array.isArray(n.levels) && (t = n.levels);
	}
	if (!t) return null;
	let n = t.map((e) => {
		let t = e;
		return {
			price: Number(t.price ?? 0),
			volume: Number(t.volume ?? t.size ?? 0)
		};
	}).filter((e) => Number.isFinite(e.price) && Number.isFinite(e.volume) && e.volume > 0);
	return n.length === 0 ? null : (n.sort((e, t) => t.price - e.price), n);
}
function Wo(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
}
function Go(e) {
	return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(0);
}
//#endregion
//#region src/widgets/StatStrip.tsx
var Ko = /* @__PURE__ */ X({ StatStrip: () => qo });
function qo({ data: e }) {
	let t = G(() => Xo(e), [e]);
	return !t || t.length === 0 ? /* @__PURE__ */ J(i, { children: "No data" }) : /* @__PURE__ */ J("div", {
		className: "h-full overflow-x-auto overflow-y-hidden",
		children: /* @__PURE__ */ J("div", {
			className: "flex items-stretch gap-3 h-full",
			children: t.map((e, t) => /* @__PURE__ */ J(Jo, { stat: e }, t))
		})
	});
}
function Jo({ stat: e }) {
	let t = me(e.value), n = e.delta == null ? "" : e.delta >= 0 ? "text-emerald-400" : "text-red-400";
	return /* @__PURE__ */ Y("div", {
		className: "shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0",
		children: [
			/* @__PURE__ */ J("div", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate",
				children: e.label
			}),
			/* @__PURE__ */ Y("div", {
				className: "flex items-baseline gap-1",
				children: [/* @__PURE__ */ J("span", {
					className: "text-base font-semibold text-zinc-100 tabular-nums truncate",
					children: se(t)
				}), e.unit && /* @__PURE__ */ J("span", {
					className: "text-[10px] text-zinc-500 shrink-0",
					children: e.unit
				})]
			}),
			/* @__PURE__ */ Y("div", {
				className: "flex items-center gap-2",
				children: [e.delta != null && /* @__PURE__ */ Y("span", {
					className: `text-[10px] font-medium tabular-nums ${n}`,
					children: [
						e.delta >= 0 ? "▲" : "▼",
						" ",
						Zo(e.delta)
					]
				}), e.trend && e.trend.length >= 2 && /* @__PURE__ */ J(Yo, { values: e.trend })]
			})
		]
	});
}
function Yo({ values: e }) {
	let t = Math.min(...e), n = Math.max(...e) - t || 1, r = e[e.length - 1] >= e[0], i = e.map((r, i) => {
		let a = i / (e.length - 1) * 100, o = 18 - (r - t) / n * 16 - 1;
		return `${a.toFixed(1)},${o.toFixed(1)}`;
	}).join(" ");
	return /* @__PURE__ */ J("svg", {
		viewBox: "0 0 100 18",
		className: "w-12 h-3.5",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ J("polyline", {
			fill: "none",
			stroke: r ? "var(--mtc-ok)" : "var(--mtc-danger)",
			strokeWidth: "1.5",
			points: i,
			vectorEffect: "non-scaling-stroke"
		})
	});
}
function Xo(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.stats) ? t = n.stats : Array.isArray(n.metrics) && (t = n.metrics);
	}
	if (!t) return null;
	let n = t.map((e) => {
		let t = e;
		return {
			label: String(t.label ?? ""),
			value: Number(t.value ?? 0),
			delta: typeof t.delta == "number" ? t.delta : void 0,
			unit: t.unit == null ? void 0 : String(t.unit),
			trend: Array.isArray(t.trend) && t.trend.every((e) => typeof e == "number") ? t.trend : void 0
		};
	}).filter((e) => Number.isFinite(e.value));
	return n.length > 0 ? n : null;
}
function Zo(e) {
	let t = Math.abs(e) <= 1 ? e * 100 : e;
	return `${Math.abs(t).toFixed(2)}%`;
}
//#endregion
//#region src/widgets/barNormalize.ts
function Qo(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.bars) ? t = n.bars : Array.isArray(n.rows) && (t = n.rows);
	}
	if (!t) return null;
	let n = t.filter((e) => typeof e == "object" && !!e);
	if (n.length === 0) return null;
	if (n.every((e) => "value" in e)) {
		let e = n.map((e) => ({
			label: String(e.label ?? e.name ?? ""),
			value: Number(e.value ?? 0),
			color: e.color == null ? void 0 : String(e.color)
		})).filter((e) => Number.isFinite(e.value));
		return e.length > 0 ? {
			kind: "single",
			bars: e
		} : null;
	}
	let r = [];
	for (let e of n) for (let [t, n] of Object.entries(e)) t === "label" || t === "name" || t === "color" || typeof n == "number" && Number.isFinite(n) && !r.includes(t) && r.push(t);
	return r.length === 0 ? null : {
		kind: "grouped",
		rows: n.map((e) => ({
			...e,
			label: String(e.label ?? e.name ?? "")
		})),
		series: r
	};
}
//#endregion
//#region src/widgets/BarChart.tsx
var $o = /* @__PURE__ */ X({ BarChart: () => is }), es = "var(--mtc-grid)", ts = "var(--mtc-border)", ns = "var(--mtc-muted)", rs = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function is({ data: e }) {
	let t = G(() => Qo(e), [e]);
	if (!t) return /* @__PURE__ */ J(i, { children: "No data" });
	if (t.kind === "grouped") {
		let e = de(t.series, B);
		return /* @__PURE__ */ J(lt, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ Y(Ke, {
				data: t.rows,
				margin: {
					top: 8,
					right: 8,
					bottom: 4,
					left: 0
				},
				children: [
					/* @__PURE__ */ J(Je, {
						strokeDasharray: "3 3",
						stroke: es
					}),
					/* @__PURE__ */ J(mt, {
						dataKey: "label",
						stroke: ts,
						tick: {
							fontSize: 11,
							fill: ns
						},
						interval: 0
					}),
					/* @__PURE__ */ J(ht, {
						stroke: ts,
						tick: {
							fontSize: 11,
							fill: ns
						},
						tickFormatter: os,
						width: 50
					}),
					/* @__PURE__ */ J(ft, {
						contentStyle: z,
						cursor: { fill: rs }
					}),
					/* @__PURE__ */ J(Xe, { wrapperStyle: { fontSize: 11 } }),
					t.series.map((t, n) => /* @__PURE__ */ J(Ge, {
						dataKey: t,
						fill: e[n],
						radius: [
							2,
							2,
							0,
							0
						]
					}, t))
				]
			})
		});
	}
	let n = t.bars;
	return /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ Y(Ke, {
			data: n,
			margin: {
				top: 8,
				right: 8,
				bottom: 4,
				left: 0
			},
			children: [
				/* @__PURE__ */ J(Je, {
					strokeDasharray: "3 3",
					stroke: es
				}),
				/* @__PURE__ */ J(mt, {
					dataKey: "label",
					stroke: ts,
					tick: {
						fontSize: 11,
						fill: ns
					},
					interval: 0
				}),
				/* @__PURE__ */ J(ht, {
					stroke: ts,
					tick: {
						fontSize: 11,
						fill: ns
					},
					tickFormatter: os,
					width: 50
				}),
				/* @__PURE__ */ J(ft, {
					contentStyle: z,
					cursor: { fill: rs }
				}),
				/* @__PURE__ */ J(Ge, {
					dataKey: "value",
					radius: [
						2,
						2,
						0,
						0
					],
					children: n.map((e, t) => /* @__PURE__ */ J(Ye, { fill: as(e) }, t))
				})
			]
		})
	});
}
function as(e) {
	return e.color && R[e.color] ? R[e.color] : e.color && e.color.startsWith("#") ? e.color : e.value < 0 ? "var(--mtc-danger)" : "var(--mtc-accent)";
}
function os(e) {
	return typeof e == "number" ? Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(+!Number.isInteger(e)) : String(e);
}
//#endregion
//#region src/widgets/Scatter.tsx
var ss = /* @__PURE__ */ X({ Scatter: () => fs }), cs = "var(--mtc-grid)", ls = "var(--mtc-border)", us = "var(--mtc-muted)", ds = "var(--mtc-muted-subtle)";
function fs({ data: e }) {
	let t = G(() => ps(e), [e]);
	if (!t || t.length === 0) return /* @__PURE__ */ J(i, { children: "No data" });
	let n = t.some((e) => e.size != null);
	return /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ Y(dt, {
			margin: {
				top: 8,
				right: 8,
				bottom: 4,
				left: 0
			},
			children: [
				/* @__PURE__ */ J(Je, {
					strokeDasharray: "3 3",
					stroke: cs
				}),
				/* @__PURE__ */ J(mt, {
					type: "number",
					dataKey: "x",
					stroke: ls,
					tick: {
						fontSize: 11,
						fill: us
					}
				}),
				/* @__PURE__ */ J(ht, {
					type: "number",
					dataKey: "y",
					stroke: ls,
					tick: {
						fontSize: 11,
						fill: us
					},
					width: 50
				}),
				n && /* @__PURE__ */ J(gt, {
					type: "number",
					dataKey: "size",
					range: [40, 280]
				}),
				/* @__PURE__ */ J(ft, {
					cursor: {
						strokeDasharray: "3 3",
						stroke: ds
					},
					contentStyle: z
				}),
				/* @__PURE__ */ J(ut, {
					data: t,
					fill: "var(--mtc-accent)",
					shape: (e) => {
						let { cx: t, cy: n, payload: r } = e;
						if (t == null || n == null || !r) return /* @__PURE__ */ J("circle", {
							cx: 0,
							cy: 0,
							r: 0
						});
						let i = ms(r);
						return /* @__PURE__ */ J("g", { children: /* @__PURE__ */ J("circle", {
							cx: t,
							cy: n,
							r: r.size == null ? 5 : Math.min(20, Math.max(3, Math.sqrt(r.size) * 2)),
							fill: i,
							fillOpacity: .7,
							stroke: i,
							strokeWidth: 1,
							children: r.label && /* @__PURE__ */ J("title", { children: r.label })
						}) });
					}
				})
			]
		})
	});
}
function ps(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.points) && (t = n.points);
	}
	if (!t) return null;
	let n = t.map((e) => {
		let t = e;
		return {
			x: Number(t.x ?? 0),
			y: Number(t.y ?? 0),
			label: t.label == null ? void 0 : String(t.label),
			size: typeof t.size == "number" ? t.size : void 0,
			color: t.color == null ? void 0 : String(t.color)
		};
	}).filter((e) => Number.isFinite(e.x) && Number.isFinite(e.y));
	return n.length > 0 ? n : null;
}
function ms(e) {
	return e.color && R[e.color] ? R[e.color] : e.color && e.color.startsWith("#") ? e.color : "var(--mtc-accent)";
}
//#endregion
//#region src/widgets/Clock.tsx
var hs = /* @__PURE__ */ X({ Clock: () => _s }), gs = [
	"America/New_York",
	"Europe/London",
	"Asia/Singapore"
];
function _s({ options: e }) {
	let t = e ?? {}, n = t.zones?.length ? t.zones : gs, r = t.format === "12h", [i, a] = q(() => /* @__PURE__ */ new Date());
	return W(() => {
		let e = setInterval(() => a(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(e);
	}, []), /* @__PURE__ */ J("div", {
		className: "h-full flex items-center justify-around gap-3",
		children: n.map((e) => {
			let t = bs(i, e, r), n = xs(i, e), a = ys(e), o = Ss(e, i);
			return /* @__PURE__ */ Y("div", {
				className: "flex flex-col items-center",
				children: [
					/* @__PURE__ */ Y("div", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5",
						children: [/* @__PURE__ */ J("span", { children: a }), /* @__PURE__ */ J("span", { className: `w-1.5 h-1.5 rounded-full ${o}` })]
					}),
					/* @__PURE__ */ J("div", {
						className: "text-base font-semibold text-zinc-100 tabular-nums",
						children: t
					}),
					/* @__PURE__ */ J("div", {
						className: "text-[10px] text-zinc-600 tabular-nums",
						children: n
					})
				]
			}, e);
		})
	});
}
var vs = {
	"America/New_York": "NY",
	"America/Los_Angeles": "LA",
	"America/Chicago": "CHI",
	"Europe/London": "LDN",
	"Europe/Frankfurt": "FRA",
	"Asia/Tokyo": "TYO",
	"Asia/Singapore": "SGP",
	"Asia/Hong_Kong": "HKG",
	"Asia/Shanghai": "SHA",
	"Australia/Sydney": "SYD",
	UTC: "UTC"
};
function ys(e) {
	return vs[e] ?? e.split("/").pop() ?? e;
}
function bs(e, t, n) {
	try {
		return new Intl.DateTimeFormat("en-US", {
			timeZone: t,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: n
		}).format(e);
	} catch {
		return "—";
	}
}
function xs(e, t) {
	try {
		return new Intl.DateTimeFormat("en-US", {
			timeZone: t,
			timeZoneName: "shortOffset"
		}).formatToParts(e).find((e) => e.type === "timeZoneName")?.value ?? "";
	} catch {
		return "";
	}
}
function Ss(e, t) {
	try {
		let n = new Intl.DateTimeFormat("en-US", {
			timeZone: e,
			hour: "2-digit",
			hour12: !1
		}).format(t), r = Number(n);
		return Number.isFinite(r) ? r >= 9 && r < 17 ? "bg-emerald-500" : r === 8 || r === 17 ? "bg-amber-500" : "bg-zinc-700" : "bg-zinc-700";
	} catch {
		return "bg-zinc-700";
	}
}
//#endregion
//#region src/widgets/Treemap.tsx
var Cs = /* @__PURE__ */ X({ Treemap: () => ws });
function ws({ data: e }) {
	let t = G(() => Ds(e), [e]);
	return !t || t.length === 0 ? /* @__PURE__ */ J(i, { children: "No data" }) : /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ J(pt, {
			data: t,
			dataKey: "value",
			nameKey: "name",
			stroke: "var(--mtc-surface)",
			isAnimationActive: !1,
			content: /* @__PURE__ */ J(Ts, {}),
			children: /* @__PURE__ */ J(ft, {
				contentStyle: z,
				formatter: (e) => [String(e), ""]
			})
		})
	});
}
function Ts(e) {
	let { x: t = 0, y: n = 0, width: r = 0, height: i = 0, index: a = 0, name: o, payload: s } = e;
	return /* @__PURE__ */ Y("g", { children: [/* @__PURE__ */ J("rect", {
		x: t,
		y: n,
		width: r,
		height: i,
		fill: Es(s, a),
		fillOpacity: .85,
		stroke: "var(--mtc-surface)",
		strokeWidth: 2
	}), r > 60 && i > 24 && o && /* @__PURE__ */ J("text", {
		x: t + 6,
		y: n + 16,
		fill: "var(--mtc-fg)",
		fontSize: 11,
		style: { pointerEvents: "none" },
		children: o
	})] });
}
function Es(e, t) {
	return e ? e.color && R[e.color] ? R[e.color] : e.color && e.color.startsWith("#") ? e.color : B[t % B.length] : B[t % B.length];
}
function Ds(e) {
	let t = null;
	if (Array.isArray(e)) t = e;
	else if (e && typeof e == "object") {
		let n = e;
		Array.isArray(n.slices) ? t = n.slices : Array.isArray(n.nodes) && (t = n.nodes);
	}
	if (!t) return null;
	let n = (e) => {
		if (!e || typeof e != "object") return null;
		let t = e, r = String(t.label ?? t.name ?? ""), i = typeof t.value == "number" ? t.value : void 0, a = t.color == null ? void 0 : String(t.color), o = Array.isArray(t.children) ? t.children : Array.isArray(t.slices) ? t.slices : null, s = o ? o.map(n).filter((e) => e != null) : void 0;
		return !s && (!Number.isFinite(i) || (i ?? 0) <= 0) ? null : {
			name: r,
			value: i,
			color: a,
			children: s
		};
	}, r = t.map(n).filter((e) => e != null);
	return r.length > 0 ? r : null;
}
//#endregion
//#region src/widgets/Image.tsx
var Os = /* @__PURE__ */ X({ Image: () => ks });
function ks({ data: e }) {
	let { url: t, alt: n } = As(e);
	return t ? /* @__PURE__ */ J("div", {
		className: "h-full w-full flex items-center justify-center",
		children: /* @__PURE__ */ J("img", {
			src: t,
			alt: n,
			loading: "lazy",
			className: "max-w-full max-h-full object-contain"
		})
	}) : /* @__PURE__ */ J(i, { children: "No image" });
}
function As(e) {
	if (typeof e == "string") return {
		url: e,
		alt: ""
	};
	if (e && typeof e == "object") {
		let t = e, n = typeof t.label == "string" ? t.label : typeof t.alt == "string" ? t.alt : "";
		return {
			url: typeof t.url == "string" ? t.url : void 0,
			alt: n
		};
	}
	return {
		url: void 0,
		alt: ""
	};
}
//#endregion
//#region src/widgets/Iframe.tsx
var js = /* @__PURE__ */ X({ Iframe: () => Ms });
function Ms({ data: e, options: t }) {
	let { url: n, title: r, sandbox: a } = Ns(e, t);
	return n ? /* @__PURE__ */ J("iframe", {
		src: n,
		title: r,
		sandbox: a,
		loading: "lazy",
		className: "w-full h-full border-0 rounded"
	}) : /* @__PURE__ */ J(i, { children: "No URL" });
}
function Ns(e, t) {
	let n, r = "embed", i = "";
	if (typeof e == "string") n = e;
	else if (e && typeof e == "object") {
		let t = e;
		typeof t.url == "string" && (n = t.url), typeof t.label == "string" ? r = t.label : typeof t.title == "string" && (r = t.title), typeof t.sandbox == "string" && (i = t.sandbox);
	}
	return t && (typeof t.url == "string" && !n && (n = t.url), typeof t.title == "string" && r === "embed" && (r = t.title), typeof t.sandbox == "string" && (i = t.sandbox)), {
		url: n,
		title: r,
		sandbox: i
	};
}
//#endregion
//#region src/widgets/Histogram.tsx
var Ps = /* @__PURE__ */ X({ Histogram: () => Bs }), Fs = 20, Is = "var(--mtc-grid)", Ls = "var(--mtc-border)", Rs = "var(--mtc-muted)", zs = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function Bs({ data: e, options: t }) {
	let n = G(() => Vs(e, t), [e, t]);
	return !n || n.length === 0 ? /* @__PURE__ */ J(i, { children: "No data" }) : /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ Y(Ke, {
			data: n,
			margin: {
				top: 8,
				right: 8,
				bottom: 4,
				left: 0
			},
			children: [
				/* @__PURE__ */ J(Je, {
					strokeDasharray: "3 3",
					stroke: Is
				}),
				/* @__PURE__ */ J(mt, {
					dataKey: "bin",
					stroke: Ls,
					tick: {
						fontSize: 10,
						fill: Rs
					},
					interval: "preserveStartEnd"
				}),
				/* @__PURE__ */ J(ht, {
					stroke: Ls,
					tick: {
						fontSize: 11,
						fill: Rs
					},
					allowDecimals: !1,
					width: 40
				}),
				/* @__PURE__ */ J(ft, {
					contentStyle: z,
					cursor: { fill: zs }
				}),
				/* @__PURE__ */ J(Ge, {
					dataKey: "count",
					fill: "var(--mtc-accent)",
					radius: [
						2,
						2,
						0,
						0
					]
				})
			]
		})
	});
}
function Vs(e, t) {
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null && "count" in e[0]) return e.map((e) => {
		let t = e, n = typeof t.rangeStart == "number" ? t.rangeStart : 0, r = typeof t.rangeEnd == "number" ? t.rangeEnd : 0;
		return {
			bin: String(t.bin ?? ""),
			count: Number(t.count ?? 0),
			rangeStart: n,
			rangeEnd: r
		};
	}).filter((e) => Number.isFinite(e.count));
	let n = null, r = Fs;
	if (Array.isArray(e) && e.every((e) => typeof e == "number")) n = e;
	else if (e && typeof e == "object") {
		let t = e;
		Array.isArray(t.values) && t.values.every((e) => typeof e == "number") && (n = t.values), typeof t.bins == "number" && (r = t.bins);
	}
	return typeof t?.bins == "number" && (r = t.bins), !n || (n = n.filter((e) => Number.isFinite(e)), n.length === 0) ? null : Hs(n, r);
}
function Hs(e, t) {
	let n = Math.min(...e), r = Math.max(...e);
	if (n === r) return [{
		bin: oe(n),
		count: e.length,
		rangeStart: n,
		rangeEnd: r
	}];
	let i = (r - n) / t, a = Array.from({ length: t }, (e, a) => {
		let o = n + a * i, s = a === t - 1 ? r : o + i;
		return {
			bin: oe((o + s) / 2),
			count: 0,
			rangeStart: o,
			rangeEnd: s
		};
	});
	for (let r of e) {
		let e = Math.floor((r - n) / i);
		e >= t && (e = t - 1), a[e].count += 1;
	}
	return a;
}
//#endregion
//#region src/widgets/Section.tsx
var Us = /* @__PURE__ */ X({ Section: () => Ws });
function Ws({ options: e }) {
	let t = typeof e?.label == "string" ? e.label : "";
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex items-center gap-3 px-1",
		children: [t && /* @__PURE__ */ J("span", {
			className: "text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0",
			children: t
		}), /* @__PURE__ */ J("div", { className: "flex-1 h-px bg-zinc-800" })]
	});
}
//#endregion
//#region src/widgets/AreaChart.tsx
var Gs = /* @__PURE__ */ X({ AreaChart: () => Zs }), Ks = "var(--mtc-grid)", qs = "var(--mtc-border)", Js = "var(--mtc-muted)", Ys = "var(--mtc-surface)", Xs = [
	"timestamp",
	"date",
	"time",
	"datetime",
	"ts",
	"x",
	"t"
];
function Zs({ data: e, options: t }) {
	let n = G(() => $s(e), [e]), r = t?.brush === !0;
	if (!n) return /* @__PURE__ */ J(i, { children: "No data" });
	let a = n.keys.length > 1;
	return /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ Y(We, {
			data: n.points,
			children: [
				/* @__PURE__ */ J(Je, {
					strokeDasharray: "3 3",
					stroke: Ks
				}),
				/* @__PURE__ */ J(mt, {
					dataKey: "_ts",
					stroke: qs,
					tick: {
						fontSize: 11,
						fill: Js
					},
					tickFormatter: ee
				}),
				/* @__PURE__ */ J(ht, {
					stroke: qs,
					tick: {
						fontSize: 11,
						fill: Js
					},
					tickFormatter: ce,
					width: 50
				}),
				/* @__PURE__ */ J(ft, {
					contentStyle: z,
					labelStyle: { color: Js },
					labelFormatter: ee
				}),
				n.keys.map((e, t) => /* @__PURE__ */ J(Ue, {
					type: "monotone",
					dataKey: e,
					stroke: B[t % B.length],
					fill: B[t % B.length],
					fillOpacity: .35,
					strokeWidth: 1.5,
					stackId: a ? "stack" : void 0
				}, e)),
				r && n.points.length > 4 && /* @__PURE__ */ J(qe, {
					dataKey: "_ts",
					height: 20,
					stroke: qs,
					fill: Ys,
					travellerWidth: 6,
					tickFormatter: ee
				})
			]
		})
	});
}
function Qs(e) {
	for (let t of Xs) if (t in e) return t;
	return null;
}
function $s(e) {
	if (!e) return null;
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
		let t = e[0], n = Qs(t);
		if (!n) return null;
		let r = Object.keys(t).filter((e) => e !== n && typeof t[e] == "number");
		return r.length === 0 ? null : {
			points: e.map((e) => {
				let t = e, i = { _ts: t[n] };
				for (let e of r) i[e] = t[e];
				return i;
			}),
			keys: r
		};
	}
	if (typeof e == "object" && e && "series" in e) {
		let t = e.series;
		if (!Array.isArray(t)) return null;
		let n = /* @__PURE__ */ new Map(), r = [];
		for (let e of t) {
			let t = e, i = String(t.name || t.label || `s${r.length}`);
			r.push(i);
			let a = t.data ?? t.points;
			if (Array.isArray(a)) for (let e of a) {
				let t = String(e.timestamp ?? e.date ?? e.time ?? e.x ?? "");
				n.has(t) || n.set(t, { _ts: t }), n.get(t)[i] = e.value ?? e.y ?? e.v;
			}
		}
		return {
			points: Array.from(n.values()),
			keys: r
		};
	}
	return null;
}
//#endregion
//#region src/widgets/Slider.tsx
var ec = /* @__PURE__ */ X({ Slider: () => nc }), tc = 100;
function nc({ options: e }) {
	let t = e ?? {}, { ctx: n, setCtx: r } = a(), o = t.min ?? 0, s = t.max ?? 100, c = t.step ?? 1, l = t.label ?? t.key ?? "value", [u, d] = q((() => {
		if (t.key && n[t.key] != null) {
			let e = Number(n[t.key]);
			if (Number.isFinite(e)) return e;
		}
		return t.default == null ? o : t.default;
	})()), f = K(null);
	if (W(() => {
		if (!t.key) return;
		let e = n[t.key];
		if (e == null) return;
		let r = Number(e);
		Number.isFinite(r) && r !== u && d(r);
	}, [t.key, n[t.key ?? ""]]), !t.key) return /* @__PURE__ */ J(i, { children: "Slider requires options.key" });
	let p = (e) => {
		d(e), f.current && clearTimeout(f.current), f.current = setTimeout(() => {
			r(t.key, String(e));
		}, tc);
	};
	return /* @__PURE__ */ Y("div", {
		className: "flex flex-col h-full justify-center gap-2 px-2",
		children: [
			/* @__PURE__ */ Y("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ J("span", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500",
					children: l
				}), /* @__PURE__ */ Y("span", {
					className: "text-sm font-semibold text-zinc-100 tabular-nums",
					children: [rc(u, c), t.unit && /* @__PURE__ */ J("span", {
						className: "text-zinc-500 ml-1",
						children: t.unit
					})]
				})]
			}),
			/* @__PURE__ */ J("input", {
				type: "range",
				min: o,
				max: s,
				step: c,
				value: u,
				onChange: (e) => p(Number(e.target.value)),
				className: "w-full accent-sky-500"
			}),
			/* @__PURE__ */ Y("div", {
				className: "flex justify-between text-[10px] text-zinc-600 tabular-nums",
				children: [/* @__PURE__ */ J("span", { children: rc(o, c) }), /* @__PURE__ */ J("span", { children: rc(s, c) })]
			})
		]
	});
}
function rc(e, t) {
	let n = t >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(t)));
	return e.toFixed(n);
}
//#endregion
//#region src/widgets/selectHelpers.ts
function ic(e, t, n) {
	if (e !== void 0 && e !== "") return {
		current: e,
		shouldSync: !1
	};
	let r = t || n[0]?.value || "";
	return {
		current: r,
		shouldSync: r !== ""
	};
}
//#endregion
//#region src/widgets/Select.tsx
var ac = /* @__PURE__ */ X({ Select: () => oc });
function oc({ data: e, options: t }) {
	let n = t ?? {}, { ctx: r, setCtx: o } = a(), s = n.key, c = sc(e, n), { current: l, shouldSync: u } = ic(s ? r[s] : void 0, n.default, c);
	return W(() => {
		s && u && o(s, l);
	}, [
		s,
		u,
		l,
		o
	]), s ? c.length === 0 ? /* @__PURE__ */ J(i, { children: "Select has no choices" }) : /* @__PURE__ */ Y("div", {
		className: "flex flex-col h-full justify-center gap-1.5 px-2",
		children: [/* @__PURE__ */ J("label", {
			className: "text-[10px] uppercase tracking-wider text-zinc-500",
			children: n.label ?? n.key
		}), /* @__PURE__ */ J("select", {
			value: l,
			onChange: (e) => o(n.key, e.target.value),
			className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500",
			children: c.map((e) => /* @__PURE__ */ J("option", {
				value: e.value,
				children: e.label
			}, e.value))
		})]
	}) : /* @__PURE__ */ J(i, { children: "Select requires options.key" });
}
function sc(e, t) {
	let n = cc(e);
	if (n.length > 0) {
		let e = t.value_field ?? "value", r = t.label_field ?? "label";
		return n.map((t) => {
			if (typeof t == "string") return {
				value: t,
				label: t
			};
			if (t && typeof t == "object") {
				let n = t, i = n[e];
				if (typeof i == "string") {
					let e = n[r];
					return {
						value: i,
						label: typeof e == "string" ? e : i
					};
				}
			}
			return null;
		}).filter((e) => e !== null);
	}
	return (t.choices ?? []).map((e) => typeof e == "string" ? {
		value: e,
		label: e
	} : {
		value: e.value,
		label: e.label ?? e.value
	});
}
function cc(e) {
	if (Array.isArray(e)) return e;
	if (e && typeof e == "object") {
		let t = e;
		if (Array.isArray(t.rows)) return t.rows;
		if (Array.isArray(t.entries)) return t.entries;
	}
	return [];
}
//#endregion
//#region src/widgets/Boxplot.tsx
var lc = /* @__PURE__ */ X({ Boxplot: () => dc }), uc = {
	top: 12,
	right: 12,
	bottom: 28,
	left: 44
};
function dc({ data: e }) {
	let t = G(() => pc(e), [e]);
	if (!t || t.length === 0) return /* @__PURE__ */ J(i, { children: "No data" });
	let n = t.flatMap((e) => [
		e.min,
		e.max,
		...e.outliers
	]), r = Math.min(...n), a = Math.max(...n), o = (a - r) * .05 || 1, s = r - o, c = a + o;
	return /* @__PURE__ */ J("svg", {
		viewBox: "0 0 600 320",
		className: "w-full h-full",
		preserveAspectRatio: "none",
		children: /* @__PURE__ */ J(fc, {
			boxes: t,
			yMin: s,
			yMax: c,
			ticks: Array.from({ length: 5 }, (e, t) => s + (c - s) * t / 4),
			width: 600,
			height: 320
		})
	});
}
function fc({ boxes: e, yMin: t, yMax: n, ticks: r, width: i, height: a }) {
	let o = i - uc.left - uc.right, s = a - uc.top - uc.bottom, c = o / e.length, l = Math.min(c * .5, 60), u = (e) => uc.top + (1 - (e - t) / (n - t)) * s;
	return /* @__PURE__ */ Y("g", { children: [r.map((e, t) => {
		let n = u(e);
		return /* @__PURE__ */ Y("g", { children: [/* @__PURE__ */ J("line", {
			x1: uc.left,
			x2: uc.left + o,
			y1: n,
			y2: n,
			stroke: "var(--mtc-grid)",
			strokeDasharray: "3 3"
		}), /* @__PURE__ */ J("text", {
			x: uc.left - 6,
			y: n + 3,
			textAnchor: "end",
			fontSize: 10,
			fill: "var(--mtc-muted)",
			fontFamily: "var(--mtc-font-sans)",
			children: oe(e)
		})] }, `g-${t}`);
	}), e.map((e, t) => {
		let n = uc.left + c * t + c / 2, r = n - l / 2, i = B[t % B.length], o = u(e.min), s = u(e.max), d = u(e.q1), f = u(e.q3), p = u(e.median);
		return /* @__PURE__ */ Y("g", { children: [
			/* @__PURE__ */ J("line", {
				x1: n,
				x2: n,
				y1: o,
				y2: s,
				stroke: i,
				strokeOpacity: .6
			}),
			/* @__PURE__ */ J("line", {
				x1: n - l / 4,
				x2: n + l / 4,
				y1: o,
				y2: o,
				stroke: i,
				strokeOpacity: .8
			}),
			/* @__PURE__ */ J("line", {
				x1: n - l / 4,
				x2: n + l / 4,
				y1: s,
				y2: s,
				stroke: i,
				strokeOpacity: .8
			}),
			/* @__PURE__ */ J("rect", {
				x: r,
				y: f,
				width: l,
				height: Math.max(1, d - f),
				fill: i,
				fillOpacity: .25,
				stroke: i,
				strokeWidth: 1.5
			}),
			/* @__PURE__ */ J("line", {
				x1: r,
				x2: r + l,
				y1: p,
				y2: p,
				stroke: i,
				strokeWidth: 2
			}),
			e.outliers.map((e, t) => /* @__PURE__ */ J("circle", {
				cx: n,
				cy: u(e),
				r: 2.5,
				fill: i,
				fillOpacity: .7
			}, t)),
			/* @__PURE__ */ J("text", {
				x: n,
				y: a - 8,
				textAnchor: "middle",
				fontSize: 11,
				fill: "var(--mtc-muted)",
				fontFamily: "var(--mtc-font-sans)",
				children: e.label
			})
		] }, t);
	})] });
}
function pc(e) {
	if (!Array.isArray(e) || e.length === 0) return null;
	let t = e.map((e) => {
		if (!e || typeof e != "object") return null;
		let t = e, n = String(t.label ?? "");
		if (typeof t.median == "number") return {
			label: n,
			min: Number(t.min ?? t.median),
			q1: Number(t.q1 ?? t.median),
			median: Number(t.median),
			q3: Number(t.q3 ?? t.median),
			max: Number(t.max ?? t.median),
			outliers: Array.isArray(t.outliers) ? t.outliers.filter((e) => typeof e == "number") : []
		};
		if (Array.isArray(t.values)) {
			let e = t.values.filter((e) => typeof e == "number" && Number.isFinite(e));
			return e.length === 0 ? null : mc(n, e);
		}
		return null;
	}).filter((e) => e != null);
	return t.length > 0 ? t : null;
}
function mc(e, t) {
	let n = [...t].sort((e, t) => e - t), r = (e) => {
		let t = (n.length - 1) * e, r = Math.floor(t), i = Math.ceil(t);
		return r === i ? n[r] : n[r] + (n[i] - n[r]) * (t - r);
	}, i = r(.25), a = r(.5), o = r(.75), s = o - i, c = i - 1.5 * s, l = o + 1.5 * s, u = [], d = Infinity, f = -Infinity;
	for (let e of n) e < c || e > l ? u.push(e) : (e < d && (d = e), e > f && (f = e));
	return Number.isFinite(d) || (d = n[0]), Number.isFinite(f) || (f = n[n.length - 1]), {
		label: e,
		min: d,
		q1: i,
		median: a,
		q3: o,
		max: f,
		outliers: u
	};
}
//#endregion
//#region src/widgets/Radar.tsx
var hc = /* @__PURE__ */ X({ Radar: () => bc }), gc = "var(--mtc-grid)", _c = "var(--mtc-border)", vc = "var(--mtc-muted)", yc = "var(--mtc-muted-subtle)";
function bc({ data: e }) {
	let t = G(() => xc(e), [e]);
	return t ? /* @__PURE__ */ J(lt, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ Y(at, {
			data: t.rows,
			outerRadius: "75%",
			children: [
				/* @__PURE__ */ J(nt, { stroke: gc }),
				/* @__PURE__ */ J(tt, {
					dataKey: "metric",
					stroke: _c,
					tick: {
						fontSize: 11,
						fill: vc
					}
				}),
				/* @__PURE__ */ J(rt, {
					stroke: _c,
					tick: {
						fontSize: 9,
						fill: yc
					}
				}),
				/* @__PURE__ */ J(ft, { contentStyle: z }),
				t.series.length > 1 && /* @__PURE__ */ J(Xe, { wrapperStyle: {
					fontSize: 11,
					color: vc
				} }),
				t.series.map((e, t) => /* @__PURE__ */ J(it, {
					name: e,
					dataKey: e,
					stroke: B[t % B.length],
					fill: B[t % B.length],
					fillOpacity: .25,
					strokeWidth: 1.5
				}, e))
			]
		})
	}) : /* @__PURE__ */ J(i, { children: "No data" });
}
function xc(e) {
	if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
		let t = e[0];
		if (typeof t.metric == "string") {
			let n = Object.keys(t).filter((e) => e !== "metric" && typeof t[e] == "number");
			return n.length === 0 ? null : {
				rows: e,
				series: n
			};
		}
	}
	if (e && typeof e == "object") {
		let t = e, n = Array.isArray(t.metrics) ? t.metrics.map(String) : null, r = Array.isArray(t.series) ? t.series : null;
		if (!n || !r) return null;
		let i = r.map((e) => String(e.name ?? "")).filter(Boolean);
		return {
			rows: n.map((e, t) => {
				let n = { metric: e };
				for (let e of r) {
					let r = e, i = String(r.name ?? ""), a = r.values;
					Array.isArray(a) && typeof a[t] == "number" && (n[i] = a[t]);
				}
				return n;
			}),
			series: i
		};
	}
	return null;
}
//#endregion
//#region src/widgets/Dag.tsx
var Sc = /* @__PURE__ */ X({ Dag: () => Ac }), Cc = {
	ok: "var(--mtc-ok)",
	EVENT_STATUS_OK: "var(--mtc-ok)",
	warn: "var(--mtc-warning)",
	EVENT_STATUS_WARN: "var(--mtc-warning)",
	error: "var(--mtc-danger)",
	EVENT_STATUS_ERROR: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	EVENT_STATUS_INFO: "var(--mtc-accent)",
	pending: "var(--mtc-muted)",
	EVENT_STATUS_PENDING: "var(--mtc-muted)",
	running: "var(--mtc-accent)"
}, wc = "var(--mtc-muted-subtle)", Tc = 130, Ec = 48, Dc = 80, Oc = 18, kc = 16;
function Ac({ data: e, options: t }) {
	let n = G(() => b(e), [e]), r = G(() => Mc(n), [n]), o = `dag-arrow-${Ve().replace(/[^a-zA-Z0-9_-]/g, "")}`, { ctx: s, setCtx: c } = a(), l = t ?? {}, u = l.node_context?.key ?? "asset_id";
	if (!r) return /* @__PURE__ */ J(i, { children: "No data" });
	let d = (e) => {
		if (Object.keys(e.context).length > 0) for (let [t, n] of Object.entries(e.context)) c(t, n);
		if (l.node_context) {
			let t = l.node_context.kind_key;
			u in e.context || c(u, e.id), t && e.kind && !(t in e.context) && c(t, e.kind);
		}
	};
	return /* @__PURE__ */ J("div", {
		className: "h-full w-full overflow-auto",
		children: /* @__PURE__ */ Y("svg", {
			viewBox: `0 0 ${r.width} ${r.height}`,
			width: r.width,
			height: r.height,
			style: { display: "block" },
			children: [
				/* @__PURE__ */ J("defs", { children: /* @__PURE__ */ J("marker", {
					id: o,
					markerWidth: "8",
					markerHeight: "8",
					refX: "7",
					refY: "4",
					orient: "auto",
					markerUnits: "strokeWidth",
					children: /* @__PURE__ */ J("path", {
						d: "M0,0 L0,8 L8,4 z",
						fill: "var(--mtc-muted-subtle)"
					})
				}) }),
				r.edges.map((e, t) => /* @__PURE__ */ Y("g", { children: [/* @__PURE__ */ J("line", {
					x1: e.x1,
					y1: e.y1,
					x2: e.x2,
					y2: e.y2,
					stroke: "var(--mtc-border-strong)",
					strokeWidth: 1.5,
					markerEnd: `url(#${o})`
				}), e.label && /* @__PURE__ */ J("text", {
					x: (e.x1 + e.x2) / 2,
					y: (e.y1 + e.y2) / 2 - 4,
					textAnchor: "middle",
					fontSize: 9,
					fill: "var(--mtc-muted)",
					fontFamily: "var(--mtc-font-sans)",
					children: jc(e.label, 18)
				})] }, `${e.from}:${e.to}:${t}`)),
				r.nodes.map((e) => {
					let t = e.status ? Cc[e.status] ?? wc : wc, n = !!l.node_context || Object.keys(e.context).length > 0, r = n && s[u] === e.id;
					return /* @__PURE__ */ Y("g", {
						onClick: n ? () => d(e) : void 0,
						onKeyDown: n ? (t) => {
							(t.key === "Enter" || t.key === " ") && (t.preventDefault(), d(e));
						} : void 0,
						role: n ? "button" : void 0,
						"aria-label": n ? `Select ${e.label}` : void 0,
						tabIndex: n ? 0 : void 0,
						style: { cursor: n ? "pointer" : "default" },
						children: [
							/* @__PURE__ */ J("rect", {
								x: e.x,
								y: e.y,
								width: Tc,
								height: Ec,
								rx: 4,
								ry: 4,
								fill: r ? "color-mix(in oklab, var(--mtc-accent) 12%, var(--mtc-surface-raised))" : "var(--mtc-surface-raised)",
								stroke: r ? "var(--mtc-accent)" : t,
								strokeWidth: r ? 2.5 : 1.5
							}),
							/* @__PURE__ */ J("text", {
								x: e.x + Tc / 2,
								y: e.y + (e.subtitle ? 21 : 28),
								textAnchor: "middle",
								fontSize: 11,
								fill: "var(--mtc-fg)",
								fontFamily: "var(--mtc-font-sans)",
								children: jc(e.label, 18)
							}),
							e.subtitle && /* @__PURE__ */ J("text", {
								x: e.x + Tc / 2,
								y: e.y + 36,
								textAnchor: "middle",
								fontSize: 9,
								fill: "var(--mtc-muted)",
								fontFamily: "var(--mtc-font-sans)",
								children: jc(e.subtitle, 22)
							}),
							/* @__PURE__ */ J("circle", {
								cx: e.x + 8,
								cy: e.y + 8,
								r: 3,
								fill: t
							})
						]
					}, e.id);
				})
			]
		})
	});
}
function jc(e, t) {
	return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function Mc(e) {
	if (!e || e.nodes.length === 0) return null;
	let { nodes: t, edges: n } = e, r = new Set(t.map((e) => e.id)), i = n.filter((e) => r.has(e.from) && r.has(e.to)), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
	for (let e of t) a.set(e.id, 0), o.set(e.id, []), s.set(e.id, 0);
	for (let e of i) a.set(e.to, (a.get(e.to) ?? 0) + 1), o.get(e.from)?.push(e.to);
	let c = t.filter((e) => (a.get(e.id) ?? 0) === 0).map((e) => e.id), l = /* @__PURE__ */ new Set();
	for (let e = 0; e < c.length; e++) {
		let t = c[e];
		l.add(t);
		for (let e of o.get(t) ?? []) {
			s.set(e, Math.max(s.get(e) ?? 0, (s.get(t) ?? 0) + 1));
			let n = (a.get(e) ?? 0) - 1;
			a.set(e, n), n === 0 && c.push(e);
		}
	}
	if (l.size < t.length) {
		let e = Math.max(0, ...[...l].map((e) => s.get(e) ?? 0)) + 1;
		for (let n of t) l.has(n.id) || s.set(n.id, e);
	}
	let u = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = s.get(e.id) ?? 0;
		u.has(t) || u.set(t, []), u.get(t).push(e.id);
	}
	let d = Math.max(0, ...s.values()), f = Math.max(...Array.from(u.values(), (e) => e.length)), p = kc * 2 + f * Tc + (f - 1) * Oc, m = kc * 2 + (d + 1) * Ec + d * (Dc - Ec), h = /* @__PURE__ */ new Map();
	for (let [e, t] of u) {
		let n = (p - (t.length * Tc + (t.length - 1) * Oc)) / 2;
		t.forEach((t, r) => {
			h.set(t, {
				x: n + r * 148,
				y: kc + e * Dc
			});
		});
	}
	return {
		nodes: t.map((e) => ({
			...e,
			...h.get(e.id)
		})),
		edges: i.map((e) => {
			let t = h.get(e.from), n = h.get(e.to);
			return !t || !n ? null : {
				from: e.from,
				to: e.to,
				label: e.label,
				x1: t.x + Tc / 2,
				y1: t.y + Ec,
				x2: n.x + Tc / 2,
				y2: n.y
			};
		}).filter((e) => e != null),
		width: p,
		height: m
	};
}
//#endregion
//#region src/widgets/MultiSelect.tsx
var Nc = /* @__PURE__ */ X({ MultiSelect: () => Pc });
function Pc({ options: e }) {
	let t = e ?? {}, { ctx: n, setCtx: r } = a();
	if (!t.key) return /* @__PURE__ */ J(i, { children: "MultiSelect requires options.key" });
	let o = t.choices ?? [];
	if (o.length === 0) return /* @__PURE__ */ J(i, { children: "MultiSelect requires options.choices" });
	let s = o.map((e) => typeof e == "string" ? {
		value: e,
		label: e
	} : {
		value: e.value,
		label: e.label ?? e.value
	}), c = n[t.key] == null ? t.default ?? [] : n[t.key].split(",").map((e) => e.trim()).filter(Boolean), l = new Set(c), u = (e) => {
		l.has(e) ? l.delete(e) : l.add(e), r(t.key, Array.from(l).join(","));
	};
	return /* @__PURE__ */ Y("div", {
		className: "flex flex-col h-full justify-center gap-2 px-2",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ J("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: t.label ?? t.key
			}), /* @__PURE__ */ Y("span", {
				className: "text-[10px] text-zinc-600",
				children: [
					l.size,
					" / ",
					s.length
				]
			})]
		}), /* @__PURE__ */ J("div", {
			className: "flex flex-wrap gap-1",
			children: s.map((e) => /* @__PURE__ */ J("button", {
				onClick: () => u(e.value),
				className: `px-2 py-0.5 text-xs rounded border ${l.has(e.value) ? "bg-sky-500/20 border-sky-500/40 text-sky-200" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"}`,
				children: e.label
			}, e.value))
		})]
	});
}
//#endregion
//#region src/widgets/Json.tsx
var Fc = /* @__PURE__ */ X({ Json: () => Ic });
function Ic({ data: e }) {
	let t = G(() => {
		if (e == null) return "";
		try {
			return JSON.stringify(e, null, 2);
		} catch {
			return String(e);
		}
	}, [e]);
	return t ? /* @__PURE__ */ J("pre", {
		className: "text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed",
		children: Lc(t)
	}) : /* @__PURE__ */ J(i, { children: "No data" });
}
function Lc(e) {
	let t = [], n = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, r = 0, i;
	for (; (i = n.exec(e)) != null;) i.index > r && t.push({ text: e.slice(r, i.index) }), i[1] ? (t.push({
		text: i[1],
		color: i[2] ? "var(--mtc-code-key)" : "var(--mtc-code-string)"
	}), i[2] && t.push({ text: i[2] })) : i[3] ? t.push({
		text: i[3],
		color: "var(--mtc-code-literal)"
	}) : i[4] && t.push({
		text: i[4],
		color: "var(--mtc-code-number)"
	}), r = n.lastIndex;
	return r < e.length && t.push({ text: e.slice(r) }), t.map((e, t) => e.color ? /* @__PURE__ */ J("span", {
		style: { color: e.color },
		children: e.text
	}, t) : e.text);
}
//#endregion
//#region src/widgets/Sparkline.tsx
var Rc = /* @__PURE__ */ X({ Sparkline: () => zc });
function zc({ data: e, options: t }) {
	let n = t ?? {}, r = G(() => Bc(e), [e]);
	if (!r || r.length < 2) return /* @__PURE__ */ J(i, { children: "No data" });
	let a = Math.min(...r), o = Math.max(...r) - a || 1, s = r[r.length - 1] >= r[0];
	return /* @__PURE__ */ J("div", {
		className: "h-full w-full flex items-center justify-center",
		children: /* @__PURE__ */ J("svg", {
			viewBox: "0 0 100 24",
			className: "w-full h-full",
			preserveAspectRatio: "none",
			children: /* @__PURE__ */ J("polyline", {
				fill: "none",
				stroke: n.color ?? (s ? "var(--mtc-ok)" : "var(--mtc-danger)"),
				strokeWidth: "1.5",
				points: r.map((e, t) => {
					let n = t / (r.length - 1) * 100, i = 22 - (e - a) / o * 20 - 1;
					return `${n.toFixed(1)},${i.toFixed(1)}`;
				}).join(" "),
				vectorEffect: "non-scaling-stroke"
			})
		})
	});
}
function Bc(e) {
	if (Array.isArray(e)) {
		if (e.every((e) => typeof e == "number")) return e;
		if (e.length > 0 && typeof e[0] == "object" && e[0] !== null) return e.map((e) => {
			let t = e;
			return typeof t.value == "number" ? t.value : Number(t.y ?? t.v ?? NaN);
		}).filter((e) => Number.isFinite(e));
	}
	if (e && typeof e == "object") {
		let t = e;
		if (Array.isArray(t.values) && t.values.every((e) => typeof e == "number")) return t.values;
	}
	return null;
}
//#endregion
//#region src/widgets/ActionLog.tsx
var Vc = /* @__PURE__ */ X({ ActionLog: () => qc }), Hc = {
	ACTION_STATUS_OK: {
		dot: "bg-emerald-400",
		text: "text-emerald-300"
	},
	ACTION_STATUS_ACCEPTED: {
		dot: "bg-amber-400",
		text: "text-amber-300"
	},
	ACTION_STATUS_PENDING: {
		dot: "bg-amber-400",
		text: "text-amber-300"
	},
	ACTION_STATUS_REJECTED: {
		dot: "bg-red-400",
		text: "text-red-300"
	},
	ACTION_STATUS_FAILED: {
		dot: "bg-red-400",
		text: "text-red-300"
	},
	ACTION_STATUS_CANCELLED: {
		dot: "bg-zinc-400",
		text: "text-zinc-300"
	}
}, Uc = {
	dot: "bg-zinc-500",
	text: "text-zinc-400"
};
function Wc(e) {
	return e.replace(/^ACTION_STATUS_/, "").toLowerCase();
}
function Gc(e) {
	return e ? e.length <= 8 ? e : e.slice(0, 6) + "…" : "";
}
function Kc(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function qc({ options: e }) {
	let { recentActions: t, clearRecentActions: n } = a(), r = e?.limit || 25, o = _(t.length > 0), s = t.slice(0, r);
	return s.length === 0 ? /* @__PURE__ */ J(i, { children: "No actions yet" }) : /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col text-xs font-mono",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0",
			children: [/* @__PURE__ */ Y("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: [
					t.length,
					" action",
					t.length === 1 ? "" : "s"
				]
			}), /* @__PURE__ */ J("button", {
				onClick: n,
				className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
				title: "Clear log",
				children: "Clear"
			})]
		}), /* @__PURE__ */ J("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: s.map((e, t) => {
				let n = Hc[e.status] ?? Uc;
				return /* @__PURE__ */ Y("div", {
					className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
					title: e.message ?? "",
					children: [
						/* @__PURE__ */ J("span", {
							className: "text-zinc-500 shrink-0 w-8 tabular-nums",
							children: Kc(o, e.receivedAt)
						}),
						/* @__PURE__ */ J("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${n.dot}` }),
						/* @__PURE__ */ J("span", {
							className: "text-zinc-200 shrink-0",
							children: e.actionId
						}),
						/* @__PURE__ */ J("span", {
							className: `uppercase tracking-wider text-[10px] shrink-0 ${n.text}`,
							children: Wc(e.status)
						}),
						e.message && /* @__PURE__ */ J("span", {
							className: "text-zinc-400 truncate flex-1 min-w-0",
							children: e.message
						}),
						/* @__PURE__ */ J("span", {
							className: "text-zinc-600 text-[10px] shrink-0",
							children: Gc(e.clientRequestId)
						})
					]
				}, `${e.clientRequestId}-${e.receivedAt}-${t}`);
			})
		})]
	});
}
//#endregion
//#region src/widgets/AlertLog.tsx
var Jc = /* @__PURE__ */ X({ AlertLog: () => Zc }), Yc = {
	error: {
		dot: "bg-red-400",
		text: "text-red-300"
	},
	warn: {
		dot: "bg-amber-400",
		text: "text-amber-300"
	},
	ok: {
		dot: "bg-emerald-400",
		text: "text-emerald-300"
	},
	info: {
		dot: "bg-sky-400",
		text: "text-sky-300"
	}
};
function Xc(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Zc({ options: e }) {
	let { recentAlerts: t, clearRecentAlerts: n } = a(), r = e?.limit || 50, o = _(t.length > 0), s = t.slice(0, r);
	return s.length === 0 ? /* @__PURE__ */ J(i, { children: "No alerts" }) : /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col text-xs font-mono",
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0",
			children: [/* @__PURE__ */ Y("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: [
					t.length,
					" alert",
					t.length === 1 ? "" : "s"
				]
			}), /* @__PURE__ */ J("button", {
				onClick: n,
				className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
				title: "Clear log",
				children: "Clear"
			})]
		}), /* @__PURE__ */ J("div", {
			className: "flex-1 overflow-auto min-h-0",
			children: s.map((e, t) => {
				let n = Yc[e.severity] ?? Yc.warn;
				return /* @__PURE__ */ Y("div", {
					className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
					title: e.predicate,
					children: [
						/* @__PURE__ */ J("span", {
							className: "text-zinc-500 shrink-0 w-8 tabular-nums",
							children: Xc(o, e.receivedAt)
						}),
						/* @__PURE__ */ J("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${n.dot}` }),
						/* @__PURE__ */ J("span", {
							className: `uppercase tracking-wider text-[10px] shrink-0 ${n.text}`,
							children: e.severity
						}),
						/* @__PURE__ */ J("span", {
							className: "text-zinc-200 truncate flex-1 min-w-0",
							children: e.message
						}),
						e.widgetId && /* @__PURE__ */ J("span", {
							className: "text-zinc-600 text-[10px] shrink-0",
							children: e.widgetId
						})
					]
				}, `${e.receivedAt}-${t}`);
			})
		})]
	});
}
//#endregion
//#region src/widgets/Tape.tsx
var Qc = /* @__PURE__ */ X({ Tape: () => al }), $c = 500, el = 800;
function tl(e) {
	return e.id ? `id:${e.id}` : `t:${e.timestamp ?? ""}|p:${e.price ?? ""}|s:${e.size ?? ""}|x:${e.label ?? ""}`;
}
function nl(e) {
	let t = (e ?? "").toLowerCase();
	return t === "buy" || t === "bid" ? {
		row: "bg-emerald-500/5",
		text: "text-emerald-400"
	} : t === "sell" || t === "ask" ? {
		row: "bg-red-500/5",
		text: "text-red-400"
	} : {
		row: "",
		text: "text-zinc-300"
	};
}
function rl(e) {
	if (e == null) return [];
	if (Array.isArray(e)) return e.map(il);
	if (typeof e == "object") {
		let t = e;
		return Array.isArray(t.events) ? t.events.map(il) : Array.isArray(t.items) ? t.items.map(il) : [il(t)];
	}
	return [];
}
function il(e) {
	if (typeof e != "object" || !e) return {};
	let t = e;
	return {
		id: t.id == null ? void 0 : String(t.id),
		timestamp: t.timestamp == null ? t.time == null ? t.ts == null ? void 0 : t.ts : t.time : t.timestamp,
		price: typeof t.price == "number" ? t.price : void 0,
		size: typeof t.size == "number" ? t.size : typeof t.qty == "number" ? t.qty : typeof t.amount == "number" ? t.amount : void 0,
		side: t.side == null ? void 0 : String(t.side).toLowerCase(),
		label: t.label == null ? t.text == null ? t.title == null ? void 0 : String(t.title) : String(t.text) : String(t.label)
	};
}
function al({ data: e, options: t }) {
	let n = t?.cap || $c, r = rl(e), [a, o] = q([]), s = K(/* @__PURE__ */ new Set()), c = K(!1);
	if (W(() => {
		if (r.length === 0) return;
		let e = [];
		for (let t of r) {
			let n = tl(t);
			s.current.has(n) || (s.current.add(n), e.push({
				...t,
				_key: n,
				_receivedAt: Date.now()
			}));
		}
		e.length !== 0 && (o((t) => {
			let r = [...e.reverse(), ...t];
			if (r.length <= n) return r;
			for (let e of r.slice(n)) s.current.delete(e._key);
			return r.slice(0, n);
		}), c.current ||= !0);
	}, [e, n]), a.length === 0) return /* @__PURE__ */ J(i, { children: "No prints yet" });
	let l = Date.now() - el;
	return /* @__PURE__ */ J("div", {
		className: "h-full overflow-auto text-xs font-mono",
		children: a.map((e) => {
			let t = nl(e.side);
			return /* @__PURE__ */ Y("div", {
				className: `grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${e._receivedAt > l && c.current ? "bg-sky-500/10" : t.row}`,
				children: [
					/* @__PURE__ */ J("span", {
						className: "text-zinc-500 tabular-nums truncate",
						children: e.timestamp == null ? "" : ol(e.timestamp)
					}),
					/* @__PURE__ */ J("span", {
						className: `truncate ${t.text}`,
						children: e.label ?? e.side?.toUpperCase() ?? "·"
					}),
					/* @__PURE__ */ J("span", {
						className: `text-right tabular-nums ${t.text}`,
						children: e.price == null ? "" : sl(e.price)
					}),
					/* @__PURE__ */ J("span", {
						className: "text-right tabular-nums text-zinc-400",
						children: e.size == null ? "" : cl(e.size)
					})
				]
			}, e._key);
		})
	});
}
function ol(e) {
	try {
		let t = new Date(e);
		return isNaN(t.getTime()) ? String(e) : `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
	} catch {
		return ee(e);
	}
}
function sl(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(Math.abs(e) < 1 ? 4 : 2);
}
function cl(e) {
	return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
//#endregion
//#region src/widgets/fileBrowserDecoders.ts
async function ll(e) {
	let t = await fetch(e);
	if (!t.ok) throw Error(`fetch failed: ${t.status}`);
	return t.text();
}
function ul(e) {
	try {
		return JSON.stringify(JSON.parse(e), null, 2);
	} catch {
		return e;
	}
}
function dl(e) {
	let t = [], n = [], r = "", i = !1;
	for (let a = 0; a < e.length; a++) {
		let o = e[a];
		if (i) {
			if (o === "\"" && e[a + 1] === "\"") {
				r += "\"", a++;
				continue;
			}
			if (o === "\"") {
				i = !1;
				continue;
			}
			r += o;
			continue;
		}
		if (o === "\"") {
			i = !0;
			continue;
		}
		if (o === ",") {
			n.push(r), r = "";
			continue;
		}
		if (o === "\n" || o === "\r") {
			o === "\r" && e[a + 1] === "\n" && a++, n.push(r), r = "", t.push(n), n = [];
			continue;
		}
		r += o;
	}
	return (r !== "" || n.length > 0) && (n.push(r), t.push(n)), t;
}
async function fl(e) {
	let [{ marked: t }, { default: n }] = await Promise.all([import("./marked.esm-COpZ1Aso.js"), import("./purify.es-Dq7sb9Gk.js")]);
	try {
		let r = await t.parse(e, { async: !0 });
		return n.sanitize(r);
	} catch {
		return `<pre>${pl(e)}</pre>`;
	}
}
function pl(e) {
	return e.replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
var ml = null;
function hl(e) {
	return import(
		/* @vite-ignore */
		/* webpackIgnore: true */
		e
);
}
async function gl(e) {
	let { default: t } = await hl("heic2any"), n = await t({
		blob: e,
		toType: "image/jpeg",
		quality: .92
	});
	return Array.isArray(n) ? n[0] : n;
}
async function _l(e, t) {
	t?.("Loading ffmpeg…");
	let n = await vl();
	t?.("Fetching file…");
	let r = await fetch(e);
	if (!r.ok) throw Error(`fetch failed: ${r.status}`);
	let i = new Uint8Array(await r.arrayBuffer());
	t?.("Remuxing…"), await n.writeFile("input.mkv", i);
	let a = await n.exec([
		"-i",
		"input.mkv",
		"-c",
		"copy",
		"-movflags",
		"+faststart",
		"output.mp4"
	]);
	if (a !== 0) throw Error("ffmpeg remux failed (code " + a + ") — codec inside MKV may not be browser-compatible");
	let o = await n.readFile("output.mp4");
	if (typeof o == "string") throw Error("ffmpeg readFile returned string");
	return new Blob([new Uint8Array(o)], { type: "video/mp4" });
}
async function vl() {
	if (ml) return ml;
	let { FFmpeg: e } = await hl("@ffmpeg/ffmpeg"), t = new e();
	return await t.load(), ml = t, t;
}
//#endregion
//#region src/widgets/FileBrowser.tsx
var yl = /* @__PURE__ */ X({ FileBrowser: () => bl });
function bl({ data: e, options: t, widgetId: n }) {
	let r = t ?? {}, { ctx: o, setCtx: l, backendUrl: u, toast: d, requestRefresh: f } = a(), p = r.path_ctx ?? "path", m = r.bucket_ctx ?? "org", g = r.bucket_param ?? "org", _ = r.page_ctx ?? "page", v = r.page_size_ctx ?? "page_size", y = r.view_mode_ctx ?? "view_mode", b = r.upload_action_id ?? "upload", x = r.upload_url, S = r.ingest_url, C = o[m] ?? "default", w = o[p] ?? "", T = parseInt(o[_] ?? "1", 10) || 1, E = parseInt(o[v] ?? "50", 10) || 50, D = o[y] === "gallery" ? "gallery" : "icons", [O, k] = q(!1), [A, j] = q(!1), M = K(!1), [N, P] = q(null), [F, I] = q(!1), [L, ee] = q("url"), [te, ne] = q(""), [re, ie] = q(""), [ae, oe] = q(""), [se, ce] = q(!1), le = r.search_url, [ue, de] = q(""), [R, z] = q(null), [B, fe] = q(!1), V = K(null);
	W(() => () => V.current?.abort(), []);
	let pe = G(() => De(e), [e]), me = R ?? pe, he = G(() => R || we(pe), [R, pe]), ge = G(() => ye(w), [w]), ve = !R && T > 1, xe = !R && pe.length >= E, Ce = r.media_url_template ?? "/media?namespace={namespace}&path={path}";
	W(() => {
		T !== 1 && l(_, "1");
	}, [C, w]);
	let Ie = (e) => l(p, e), Le = (e) => l(_, String(Math.max(1, e))), Re = () => l(y, D === "gallery" ? "icons" : "gallery"), ze = async () => {
		if (!le) return;
		let e = ue.trim();
		if (e === "") {
			Be();
			return;
		}
		if (V.current) return;
		let t = new AbortController();
		V.current = t, fe(!0);
		try {
			let n = await fetch(Te(u, le), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[g]: C,
					query: e
				}),
				signal: t.signal
			});
			if (!n.ok) {
				d(`Search failed: ${await Oe(n)}`, "error");
				return;
			}
			let r = await n.json();
			if (V.current !== t) return;
			z((r.hits ?? []).map((e) => ({
				...e,
				kind: "file"
			})));
		} catch (e) {
			t.signal.aborted || d(`Search failed: ${Me(e)}`, "error");
		} finally {
			V.current === t && (V.current = null, fe(!1));
		}
	}, Be = () => {
		V.current?.abort(), V.current = null, fe(!1), de(""), z(null);
	}, U = (e) => {
		Be(), Ie(e);
	}, Ve = () => {
		ne(w), ie(""), oe(""), ee(S ? "url" : "file"), I(!0);
	}, Ue = async () => {
		if (!S) return;
		let e = te.trim(), t = re.trim(), n = ae.trim();
		if (!e || !t || !n) {
			d("Need a folder (repo), a filename, and a URL", "error");
			return;
		}
		if (M.current) {
			d("Another file operation is already in progress", "warn");
			return;
		}
		M.current = !0, ce(!0);
		try {
			let r = await fetch(Te(u, S), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[g]: C,
					repo: e,
					path: t,
					url: n
				})
			});
			if (!r.ok) throw Error(await Oe(r));
			d(`Fetching ${t} in the background — it'll appear when done.`, "ok"), I(!1);
		} catch (e) {
			d(`Ingest failed: ${Me(e)}`, "error");
		} finally {
			M.current = !1, ce(!1);
		}
	}, We = async (e) => {
		let t = te.trim(), r = re.trim() || e.name;
		if (!t) {
			d("Need a destination folder (repo)", "error");
			return;
		}
		if (M.current) {
			d("Another file operation is already in progress", "warn");
			return;
		}
		M.current = !0, ce(!0);
		try {
			await Je(e, t, r), d(`Uploaded ${r}`, "ok"), I(!1), f(n ?? "*");
		} catch (e) {
			d(`Upload failed: ${Me(e)}`, "error");
		} finally {
			M.current = !1, ce(!1);
		}
	}, Ge = (e) => e.path && e.path !== "" ? e.path : Ae(w, e.name ?? ""), Ke = (e) => {
		if (be(e)) {
			R ? U(Ge(e)) : Ie(Ge(e));
			return;
		}
		if (Ce && je(e.content_type, e.name)) {
			P(e);
			return;
		}
		qe(e);
	};
	W(() => {
		if (!N) return;
		let e = (e) => {
			e.key === "Escape" && P(null);
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [N]);
	let qe = async (e) => {
		let t = r.download_url;
		if (!t) {
			d("Download not configured (set options.download_url)", "error");
			return;
		}
		if (!e.name) {
			d("File has no name", "error");
			return;
		}
		let n = Ge(e), i = Te(u, t);
		try {
			let t = await fetch(i, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[g]: C,
					path: n
				})
			});
			if (!t.ok) {
				let e = await Oe(t);
				d(`Download failed: ${e}`, "error");
				return;
			}
			let r = await Fe(t, e.content_type), a = document.createElement("a");
			a.href = URL.createObjectURL(r), a.download = e.name, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
		} catch (e) {
			d(`Download failed: ${Me(e)}`, "error");
		}
	}, Je = async (e, t, n) => {
		let r = e.type || "application/octet-stream";
		if (x) {
			let i = new URLSearchParams({
				[g]: C,
				repo: t,
				path: n,
				content_type: r
			}), a = Te(u, x), o = a.includes("?") ? "&" : "?", s = await fetch(`${a}${o}${i.toString()}`, {
				method: "POST",
				body: e
			});
			if (!s.ok) throw Error(await s.text() || `HTTP ${s.status}`);
			return;
		}
		let i = await e.arrayBuffer(), a = s(u ?? ""), o = h({
			actionId: b,
			params: {
				[g]: C,
				repo: t,
				path: n,
				content_type: r,
				data_b64: Pe(i)
			},
			clientRequestId: c()
		}), l = await fetch(a, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Connect-Protocol-Version": "1"
			},
			body: JSON.stringify(o)
		});
		if (!l.ok) throw Error(await Oe(l));
		let d = await l.json();
		if (!_e(d.status)) throw Error(d.message ?? "Upload action did not return a terminal status");
		if (H(d.status)) throw Error(d.message ?? "Upload action failed");
	}, Ye = async (e) => {
		if (w === "") {
			d("Open a folder first, or use the Upload button to choose a folder.", "error");
			return;
		}
		if (M.current) {
			d("Another file operation is already in progress", "warn");
			return;
		}
		M.current = !0;
		let t = w;
		j(!0);
		let r = 0;
		try {
			for (let n of Array.from(e)) try {
				await Je(n, t, n.name), r++;
			} catch (e) {
				d(`Upload failed: ${n.name} — ${Me(e)}`, "error");
			}
		} finally {
			M.current = !1, j(!1);
		}
		r > 0 && (d(`Uploaded ${r} file${r === 1 ? "" : "s"}`, "ok"), f(n ?? "*"));
	};
	return /* @__PURE__ */ Y("div", {
		className: "h-full flex flex-col relative",
		onDragOver: (e) => {
			e.preventDefault(), k(!0);
		},
		onDragLeave: () => k(!1),
		onDrop: (e) => {
			e.preventDefault(), k(!1), e.dataTransfer.files.length > 0 && Ye(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ Y("div", {
				className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0",
				children: [
					/* @__PURE__ */ J("button", {
						onClick: () => Ie(""),
						className: "text-sky-400 hover:underline",
						children: "/"
					}),
					ge.map((e, t) => {
						let n = ge.slice(0, t + 1).join("/");
						return /* @__PURE__ */ Y("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ J("span", {
								className: "text-zinc-600",
								children: "/"
							}), /* @__PURE__ */ J("button", {
								onClick: () => Ie(n),
								className: "text-sky-400 hover:underline",
								children: e
							})]
						}, t);
					}),
					/* @__PURE__ */ Y("div", {
						className: "ml-auto flex items-center gap-3 text-zinc-500",
						children: [
							le && /* @__PURE__ */ Y("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ J("input", {
										type: "search",
										value: ue,
										onChange: (e) => de(e.target.value),
										onKeyDown: (e) => {
											e.key === "Enter" && ze(), e.key === "Escape" && Be();
										},
										placeholder: "Search files…",
										className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
									}),
									/* @__PURE__ */ J("button", {
										onClick: () => void ze(),
										disabled: B,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
										"aria-label": "Search",
										title: "Search this namespace",
										children: B ? "…" : "🔍"
									}),
									R && /* @__PURE__ */ J("button", {
										onClick: Be,
										className: "text-zinc-400 hover:text-zinc-100 px-1",
										title: "Clear search, back to browsing",
										children: "✕"
									})
								]
							}),
							(x || b || S) && /* @__PURE__ */ J("button", {
								onClick: Ve,
								className: "text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5",
								title: "Upload a file or fetch a media URL",
								children: "⬆ Upload"
							}),
							/* @__PURE__ */ J("button", {
								onClick: Re,
								className: "text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5",
								title: D === "gallery" ? "Switch to icons (no thumbnails)" : "Switch to gallery (loads image thumbnails)",
								children: D === "gallery" ? "◫ Gallery" : "☰ Icons"
							}),
							/* @__PURE__ */ J("span", {
								className: "tabular-nums",
								children: R ? `${R.length} result${R.length === 1 ? "" : "s"}` : `${me.length} on page`
							}),
							(ve || xe) && /* @__PURE__ */ Y("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ J("button", {
										onClick: () => Le(T - 1),
										disabled: !ve,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
										"aria-label": "Previous page",
										children: "‹"
									}),
									/* @__PURE__ */ Y("span", {
										className: "tabular-nums text-zinc-400",
										children: ["Page ", T]
									}),
									/* @__PURE__ */ J("button", {
										onClick: () => Le(T + 1),
										disabled: !xe,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
										"aria-label": "Next page",
										children: "›"
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ Y("div", {
				className: "flex-1 overflow-auto relative min-h-0",
				children: [
					O && /* @__PURE__ */ J("div", {
						className: "absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none",
						children: /* @__PURE__ */ J("div", {
							className: "text-sky-300 text-sm",
							children: "Drop files to upload"
						})
					}),
					he.length === 0 ? /* @__PURE__ */ J(i, { children: R ? "No files match your search." : "This folder is empty. Drop files to upload." }) : D === "gallery" ? /* @__PURE__ */ J(xl, {
						entries: he,
						onClick: Ke,
						mediaUrlFor: (e) => e.name ? Te(u, ke(Ce, C, Ge(e))) : ""
					}) : /* @__PURE__ */ Y("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ J("thead", {
							className: "sticky top-0 bg-zinc-900 z-[1]",
							children: /* @__PURE__ */ Y("tr", {
								className: "text-zinc-400 border-b border-zinc-800",
								children: [
									/* @__PURE__ */ J("th", { className: "text-left px-3 py-2 w-8" }),
									/* @__PURE__ */ J("th", {
										className: "text-left px-3 py-2",
										children: "Name"
									}),
									/* @__PURE__ */ J("th", {
										className: "text-right px-3 py-2 w-24",
										children: "Size"
									}),
									/* @__PURE__ */ J("th", {
										className: "text-left px-3 py-2 w-40",
										children: "Type"
									}),
									/* @__PURE__ */ J("th", {
										className: "text-left px-3 py-2 w-36",
										children: "Modified"
									})
								]
							})
						}), /* @__PURE__ */ J("tbody", { children: he.map((e, t) => /* @__PURE__ */ Y("tr", {
							onDoubleClick: () => Ke(e),
							className: "border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none",
							children: [
								/* @__PURE__ */ J("td", {
									className: "px-3 py-1.5 select-none",
									children: be(e) ? "📁" : "📄"
								}),
								/* @__PURE__ */ J("td", {
									className: "px-3 py-1.5 text-zinc-100 truncate",
									children: e.name
								}),
								/* @__PURE__ */ J("td", {
									className: "px-3 py-1.5 text-right text-zinc-400",
									children: be(e) ? "—" : Ee(e.size_bytes ?? 0)
								}),
								/* @__PURE__ */ J("td", {
									className: "px-3 py-1.5 text-zinc-500 truncate",
									children: e.content_type ?? ""
								}),
								/* @__PURE__ */ J("td", {
									className: "px-3 py-1.5 text-zinc-500 truncate",
									children: e.modified_at ?? ""
								})
							]
						}, `${e.kind ?? ""}:${e.name ?? t}`)) })]
					}),
					A && /* @__PURE__ */ J("div", {
						className: "absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg",
						children: "Uploading…"
					})
				]
			}),
			N && /* @__PURE__ */ J(Sl, {
				entry: N,
				mediaUrl: Te(u, ke(Ce, C, Ge(N))),
				autoAdvanceQueue: Se(he),
				navigableQueue: Ne(he),
				onSelect: (e) => P(e),
				onClose: () => P(null),
				onDownload: () => {
					qe(N);
				}
			}),
			F && /* @__PURE__ */ J("div", {
				className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60",
				onClick: () => {
					se || I(!1);
				},
				children: /* @__PURE__ */ Y("div", {
					className: "flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ Y("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ Y("h2", {
								className: "text-sm font-medium text-zinc-100",
								children: ["Upload to ", C]
							}), /* @__PURE__ */ J("button", {
								onClick: () => {
									se || I(!1);
								},
								className: "text-zinc-500 hover:text-zinc-200",
								"aria-label": "Close",
								children: "✕"
							})]
						}),
						S && /* @__PURE__ */ Y("div", {
							className: "flex gap-1 text-xs",
							children: [/* @__PURE__ */ J("button", {
								onClick: () => ee("url"),
								className: `px-3 py-1 rounded border ${L === "url" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
								children: "From URL"
							}), /* @__PURE__ */ J("button", {
								onClick: () => ee("file"),
								className: `px-3 py-1 rounded border ${L === "file" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
								children: "Local file"
							})]
						}),
						/* @__PURE__ */ Y("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Folder (repo)",
								/* @__PURE__ */ J("input", {
									type: "text",
									value: te,
									onChange: (e) => ne(e.target.value),
									placeholder: "e.g. year=2026/name=avatar",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ J("span", {
									className: "text-zinc-600",
									children: "The repository partition. Becomes a source key."
								})
							]
						}),
						/* @__PURE__ */ Y("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Filename ",
								L === "file" && "(optional — defaults to the file’s name)",
								/* @__PURE__ */ J("input", {
									type: "text",
									value: re,
									onChange: (e) => ie(e.target.value),
									placeholder: "e.g. avatar.mp4",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ J("span", {
									className: "text-zinc-600",
									children: "Location inside the repo (may include subfolders)."
								})
							]
						}),
						L === "url" ? /* @__PURE__ */ Y(He, { children: [/* @__PURE__ */ Y("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Media URL",
								/* @__PURE__ */ J("input", {
									type: "url",
									value: ae,
									onChange: (e) => oe(e.target.value),
									placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ J("span", {
									className: "text-zinc-600",
									children: "HTTP(S) media URL or raw HLS playlist. Fetched server-side."
								})
							]
						}), /* @__PURE__ */ J("button", {
							onClick: () => void Ue(),
							disabled: se,
							className: "self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm",
							children: se ? "Starting…" : "Fetch & store"
						})] }) : /* @__PURE__ */ Y(He, { children: [/* @__PURE__ */ J("input", {
							type: "file",
							onChange: (e) => {
								let t = e.target.files?.[0];
								t && We(t);
							},
							disabled: se,
							className: "text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
						}), se && /* @__PURE__ */ J("span", {
							className: "self-end text-xs text-zinc-400",
							children: "Uploading…"
						})] })
					]
				})
			})
		]
	});
}
function xl({ entries: e, onClick: t, mediaUrlFor: n }) {
	return /* @__PURE__ */ J("div", {
		className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3",
		children: e.map((e, r) => {
			let i = je(e.content_type, e.name), a = i === "image" || i === "heic";
			return /* @__PURE__ */ Y("button", {
				onDoubleClick: () => t(e),
				className: "flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left select-none",
				children: [/* @__PURE__ */ J("div", {
					className: "w-full aspect-square bg-zinc-950 rounded flex items-center justify-center overflow-hidden",
					children: be(e) ? /* @__PURE__ */ J("span", {
						className: "text-4xl select-none",
						children: "📁"
					}) : a && e.name ? /* @__PURE__ */ J("img", {
						src: n(e),
						alt: e.name ?? "",
						loading: "lazy",
						decoding: "async",
						className: "w-full h-full object-cover"
					}) : /* @__PURE__ */ J("span", {
						className: "text-4xl select-none",
						children: "📄"
					})
				}), /* @__PURE__ */ J("span", {
					className: "w-full text-xs text-zinc-200 truncate",
					title: e.name,
					children: e.name
				})]
			}, `${e.kind ?? ""}:${e.name ?? r}`);
		})
	});
}
function Sl({ entry: e, mediaUrl: t, autoAdvanceQueue: n, navigableQueue: r, onSelect: i, onClose: a, onDownload: o }) {
	let s = je(e.content_type, e.name), c = s === "text" || s === "json" || s === "yaml" || s === "csv" || s === "markdown", [l, u] = q(s === "image" || s === "video" || s === "pdf" || s === "heic" || s === "mkv" || c), [d, f] = q(!1), [p, m] = q(null), [h, g] = q(null), [_, v] = q("Loading…"), [y, b] = q(null), [x, S] = q(null), [C, w] = q(null), T = r.length > 1, E = r.findIndex((t) => t.name === e.name), [D, O] = q(!1), [k, A] = q(!0), j = () => {
		let t = xe(r, e.name, D, k);
		t && i(t);
	}, M = () => {
		let t = Ce(r, e.name, k);
		t && i(t);
	}, N = () => {
		let t = xe(n, e.name, D, k);
		t && i(t);
	};
	W(() => {
		let e = (e) => {
			let t = e.target;
			if (!(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) {
				if (e.key === "ArrowRight") e.preventDefault(), j();
				else if (e.key === "ArrowLeft") e.preventDefault(), M();
				else if (e.key === " ") {
					let t = document.querySelector("video, audio");
					t && (e.preventDefault(), t.paused ? t.play() : t.pause());
				}
			}
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [
		e.name,
		r.length,
		D,
		k
	]);
	let P = () => u(!1), F = () => {
		u(!1), f(!0), m(null);
	}, I = (e) => {
		e.target === e.currentTarget && a();
	};
	return W(() => {
		if (s !== "heic" && s !== "mkv") return;
		let e = !1, n = null;
		return (async () => {
			try {
				let r;
				if (s === "heic") {
					v("Decoding HEIC…");
					let e = await fetch(t);
					if (!e.ok) throw Error(`fetch failed: ${e.status}`);
					r = await gl(await e.blob());
				} else r = await _l(t, (t) => {
					e || v(t);
				});
				if (e) return;
				n = URL.createObjectURL(r), g(n), u(!1);
			} catch (t) {
				if (e) return;
				m(Me(t)), f(!0), u(!1);
			}
		})(), () => {
			e = !0, n && URL.revokeObjectURL(n);
		};
	}, [s, t]), W(() => {
		if (!c) return;
		let e = !1;
		return (async () => {
			try {
				let n = await ll(t);
				if (e) return;
				s === "csv" ? S(dl(n)) : s === "json" ? b(ul(n)) : s === "markdown" ? w(await fl(n)) : b(n), u(!1);
			} catch (t) {
				if (e) return;
				m(Me(t)), f(!0), u(!1);
			}
		})(), () => {
			e = !0;
		};
	}, [
		s,
		c,
		t
	]), /* @__PURE__ */ Y("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
		onClick: I,
		children: [/* @__PURE__ */ Y("div", {
			className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900",
			children: [
				/* @__PURE__ */ J("span", {
					className: "text-sm font-medium truncate flex-1",
					children: e.name
				}),
				/* @__PURE__ */ J("span", {
					className: "text-xs text-zinc-500 truncate max-w-[200px]",
					children: e.content_type
				}),
				typeof e.size_bytes == "number" && /* @__PURE__ */ J("span", {
					className: "text-xs text-zinc-600 tabular-nums",
					children: Ee(e.size_bytes)
				}),
				T && /* @__PURE__ */ Y("div", {
					className: "flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2",
					children: [
						/* @__PURE__ */ J("button", {
							onClick: M,
							className: "hover:text-zinc-100 leading-none px-1",
							"aria-label": "Previous (←)",
							title: "Previous (←)",
							children: "⏮"
						}),
						/* @__PURE__ */ J("button", {
							onClick: j,
							className: "hover:text-zinc-100 leading-none px-1",
							"aria-label": "Next (→)",
							title: "Next (→)",
							children: "⏭"
						}),
						/* @__PURE__ */ J("button", {
							onClick: () => O((e) => !e),
							className: `px-1 leading-none ${D ? "text-sky-400" : "hover:text-zinc-100"}`,
							"aria-label": "Toggle shuffle",
							title: D ? "Shuffle on" : "Shuffle off",
							children: "🔀"
						}),
						/* @__PURE__ */ J("button", {
							onClick: () => A((e) => !e),
							className: `px-1 leading-none ${k ? "text-sky-400" : "hover:text-zinc-100"}`,
							"aria-label": "Toggle repeat",
							title: k ? "Repeat on" : "Repeat off",
							children: "🔁"
						}),
						/* @__PURE__ */ Y("span", {
							className: "text-xs text-zinc-500 tabular-nums",
							children: [
								E >= 0 ? E + 1 : "–",
								" / ",
								r.length
							]
						})
					]
				}),
				/* @__PURE__ */ J("button", {
					onClick: o,
					className: "text-xs text-sky-400 hover:underline",
					children: "Download"
				}),
				/* @__PURE__ */ J("button", {
					onClick: a,
					className: "text-zinc-400 hover:text-zinc-100 text-lg leading-none",
					"aria-label": "Close preview",
					children: "×"
				})
			]
		}), /* @__PURE__ */ Y("div", {
			className: "flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative",
			onClick: I,
			children: [
				l && !d && /* @__PURE__ */ J("div", {
					className: "absolute inset-0 flex items-center justify-center pointer-events-none",
					children: /* @__PURE__ */ J("div", {
						className: "text-zinc-500 text-xs uppercase tracking-wider",
						children: _
					})
				}),
				d && /* @__PURE__ */ Y("div", {
					className: "flex flex-col items-center gap-3 text-zinc-300 text-sm max-w-md text-center",
					children: [
						/* @__PURE__ */ J("span", {
							className: "text-zinc-500",
							children: "⚠ Preview couldn't load."
						}),
						p && /* @__PURE__ */ J("span", {
							className: "text-zinc-600 text-xs font-mono break-words",
							children: p
						}),
						/* @__PURE__ */ J("button", {
							onClick: o,
							className: "text-sky-400 hover:underline text-xs",
							children: "Download instead"
						})
					]
				}),
				!d && s === "video" && /* @__PURE__ */ J("video", {
					src: t,
					controls: !0,
					autoPlay: !0,
					playsInline: !0,
					preload: "metadata",
					onLoadedMetadata: P,
					onEnded: N,
					onError: F,
					className: "max-h-full max-w-full bg-black rounded shadow-2xl"
				}),
				!d && s === "audio" && /* @__PURE__ */ Y("div", {
					className: "flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl w-full max-w-md",
					children: [
						/* @__PURE__ */ J("div", {
							className: "text-3xl select-none",
							"aria-hidden": "true",
							children: "♪"
						}),
						/* @__PURE__ */ J("div", {
							className: "text-sm text-zinc-200 truncate max-w-full",
							title: e.name,
							children: e.name
						}),
						/* @__PURE__ */ J("audio", {
							src: t,
							controls: !0,
							autoPlay: !0,
							preload: "metadata",
							onEnded: N,
							onError: F,
							className: "w-full"
						})
					]
				}),
				!d && s === "image" && /* @__PURE__ */ J("img", {
					src: t,
					alt: e.name ?? "",
					decoding: "async",
					onLoad: P,
					onError: F,
					className: "max-h-full max-w-full object-contain rounded shadow-2xl"
				}),
				!d && s === "pdf" && /* @__PURE__ */ J("iframe", {
					src: t,
					title: e.name ?? "PDF preview",
					onLoad: P,
					className: "w-full h-full bg-white rounded shadow-2xl border-0"
				}),
				!d && s === "heic" && h && /* @__PURE__ */ J("img", {
					src: h,
					alt: e.name ?? "",
					decoding: "async",
					onError: F,
					className: "max-h-full max-w-full object-contain rounded shadow-2xl"
				}),
				!d && s === "mkv" && h && /* @__PURE__ */ J("video", {
					src: h,
					controls: !0,
					autoPlay: !0,
					playsInline: !0,
					preload: "metadata",
					onLoadedMetadata: P,
					onEnded: N,
					onError: F,
					className: "max-h-full max-w-full bg-black rounded shadow-2xl"
				}),
				!d && (s === "text" || s === "json" || s === "yaml") && y !== null && /* @__PURE__ */ J("pre", {
					className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words",
					children: y
				}),
				!d && s === "markdown" && C !== null && /* @__PURE__ */ J("div", {
					className: "w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none",
					dangerouslySetInnerHTML: { __html: C }
				}),
				!d && s === "csv" && x !== null && /* @__PURE__ */ J("div", {
					className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl",
					children: /* @__PURE__ */ Y("table", {
						className: "border-collapse",
						children: [x.length > 0 && /* @__PURE__ */ J("thead", { children: /* @__PURE__ */ J("tr", { children: x[0].map((e, t) => /* @__PURE__ */ J("th", {
							className: "border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800",
							children: e
						}, t)) }) }), /* @__PURE__ */ J("tbody", { children: x.slice(1).map((e, t) => /* @__PURE__ */ J("tr", { children: e.map((e, t) => /* @__PURE__ */ J("td", {
							className: "border border-zinc-800 px-2 py-1 align-top",
							children: e
						}, t)) }, t)) })]
					})
				}),
				s === null && !d && /* @__PURE__ */ Y("div", {
					className: "flex flex-col items-center gap-3 text-zinc-300 text-sm",
					children: [/* @__PURE__ */ Y("span", {
						className: "text-zinc-500",
						children: [
							"No inline preview for ",
							e.content_type ?? "this file type",
							"."
						]
					}), /* @__PURE__ */ J("button", {
						onClick: o,
						className: "text-sky-400 hover:underline text-xs",
						children: "Download instead"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/export/ExportMenu.tsx
function Cl({ view: e, filenameBase: t, onExport: n, variant: r = "button" }) {
	let [i, a] = q(!1), [o, s] = q(null), c = K(null);
	W(() => {
		if (!i) return;
		let e = (e) => {
			c.current && !c.current.contains(e.target) && a(!1);
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [i]);
	let l = Ln(e), u = l === 0, d = async (r) => {
		s(r);
		let i = !1;
		try {
			i = await zn(e, r, t);
		} catch {
			i = !1;
		} finally {
			s(null), a(!1), n?.(r, i);
		}
	};
	return /* @__PURE__ */ Y("div", {
		className: "relative",
		ref: c,
		children: [r === "row" ? /* @__PURE__ */ J("button", {
			onClick: () => a((e) => !e),
			disabled: u,
			className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-40",
			children: "Export…"
		}) : /* @__PURE__ */ J("button", {
			onClick: () => a((e) => !e),
			disabled: u,
			title: u ? "No data to export" : `Export ${l.toLocaleString()} rows`,
			className: "mtc-control text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 shrink-0 disabled:opacity-40",
			"aria-label": "Export data",
			children: "↓ Export"
		}), i && !u && /* @__PURE__ */ Y("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-30 min-w-[140px]",
			children: [/* @__PURE__ */ Y("div", {
				className: "px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600",
				children: [l.toLocaleString(), " rows"]
			}), Dn.map((e) => /* @__PURE__ */ Y("button", {
				onClick: () => d(e.key),
				disabled: o != null,
				className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-between",
				children: [/* @__PURE__ */ J("span", { children: e.label }), o === e.key && /* @__PURE__ */ J("span", {
					className: "text-zinc-500",
					children: "…"
				})]
			}, e.key))]
		})]
	});
}
//#endregion
//#region src/embed/EmbedView.tsx
function wl(e) {
	if (!e.widget) return null;
	let t = e.widget, n = {
		id: "embed",
		component: t.component,
		span: 12,
		title: e.title,
		source: t.sourceId ? {
			source_id: t.sourceId,
			stream: t.stream,
			refreshIntervalMs: t.refreshIntervalMs
		} : t.url ? {
			url: t.url,
			stream: t.stream,
			refreshIntervalMs: t.refreshIntervalMs
		} : void 0
	};
	return {
		title: e.title,
		columns: 12,
		context: Object.keys(e.ctx).length > 0 ? { values: e.ctx } : void 0,
		widgets: [n]
	};
}
function Tl({ config: e, onEvent: t, theme: n, templateTrust: r, templateTrustPolicy: i }) {
	let [a, o] = q({}), s = n ?? e.theme ?? "dark";
	W(() => {
		if (!e.templateUrl) return;
		let t = !1;
		return o({}), fetch(e.templateUrl).then((e) => {
			if (!e.ok) throw Error(`Template fetch failed: ${e.status}`);
			return e.json();
		}).then((n) => {
			if (t) return;
			let r = Object.keys(e.ctx).length > 0 ? {
				...n,
				context: { values: {
					...n.context?.values ?? {},
					...e.ctx
				} }
			} : n;
			o({ template: r });
		}).catch((e) => {
			t || o({ error: e instanceof Error ? e.message : "Template load error" });
		}), () => {
			t = !0;
		};
	}, [e.templateUrl, e.ctx]);
	let c = G(() => wl(e), [e]), l = e.templateUrl ? a.template : c;
	return e.templateUrl && a.error ? /* @__PURE__ */ J(El, {
		title: "Embed error",
		body: a.error,
		theme: s
	}) : e.templateUrl && !l ? /* @__PURE__ */ J(El, {
		title: "Loading…",
		body: "Fetching dashboard template",
		theme: s
	}) : l ? /* @__PURE__ */ J("div", {
		className: `mtc-root mtc-theme-${s}`,
		"data-theme": s,
		children: /* @__PURE__ */ J("div", {
			className: "mtc-workspace min-h-screen",
			children: /* @__PURE__ */ J(ri, {
				template: l,
				backendUrl: e.backendUrl,
				chrome: e.chrome === "full" ? "full" : "minimal",
				onEvent: t,
				theme: s,
				templateTrust: r,
				templateTrustPolicy: i
			})
		})
	}) : /* @__PURE__ */ J(El, {
		title: "Nothing to embed",
		body: "Pass a ?template= URL, or a ?src= source id (with &backend=), or a ?url= data URL.",
		theme: s
	});
}
function El({ title: e, body: t, theme: n }) {
	return /* @__PURE__ */ J("div", {
		className: `mtc-root mtc-theme-${n}`,
		"data-theme": n,
		children: /* @__PURE__ */ J("div", {
			className: "mtc-workspace min-h-screen flex items-center justify-center p-6",
			children: /* @__PURE__ */ Y("div", {
				className: "text-center max-w-md",
				children: [/* @__PURE__ */ J("div", {
					className: "text-sm font-medium text-zinc-200 mb-1",
					children: e
				}), /* @__PURE__ */ J("div", {
					className: "text-xs text-zinc-500",
					children: t
				})]
			})
		})
	});
}
//#endregion
//#region src/embed/embedConfig.ts
function Dl(e) {
	return e === "1" || e === "true" || e === "yes";
}
function Ol(e) {
	let t = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), n = {};
	for (let [e, r] of t.entries()) if (e.startsWith("ctx.")) {
		let t = e.slice(4);
		t && (n[t] = r);
	}
	let r = t.get("chrome") === "full" ? "full" : "none", i = t.get("theme"), a = i === "operator" || i === "light" ? i : "dark", o = t.get("title") ?? void 0, s = t.get("backend") ?? void 0, c = t.get("template") ?? void 0;
	if (c) return {
		templateUrl: c,
		title: o,
		backendUrl: s,
		ctx: n,
		chrome: r,
		theme: a
	};
	let l = t.get("src") ?? void 0, u = t.get("url") ?? void 0;
	if (l || u) {
		let e = t.get("refreshMs"), i = e == null ? NaN : Number(e);
		return {
			widget: {
				component: t.get("component") ?? "table",
				sourceId: l,
				url: u,
				stream: Dl(t.get("stream")),
				refreshIntervalMs: Number.isFinite(i) && i > 0 ? i : void 0
			},
			title: o,
			backendUrl: s,
			ctx: n,
			chrome: r,
			theme: a
		};
	}
	return {
		title: o,
		backendUrl: s,
		ctx: n,
		chrome: r,
		theme: a
	};
}
function kl(e, t) {
	let n = new URLSearchParams();
	t.templateUrl && n.set("template", t.templateUrl), t.widget && (t.widget.component && n.set("component", t.widget.component), t.widget.sourceId && n.set("src", t.widget.sourceId), t.widget.url && n.set("url", t.widget.url), t.widget.stream && n.set("stream", "1"), t.widget.refreshIntervalMs && n.set("refreshMs", String(t.widget.refreshIntervalMs))), t.title && n.set("title", t.title), t.backendUrl && n.set("backend", t.backendUrl), t.chrome === "full" && n.set("chrome", "full"), t.theme && t.theme !== "dark" && n.set("theme", t.theme);
	for (let [e, r] of Object.entries(t.ctx ?? {})) n.set(`ctx.${e}`, r);
	let r = n.toString();
	return r ? `${e}?${r}` : e;
}
//#endregion
//#region src/bi/connector.ts
var Al = [
	"SHAPE_UNSPECIFIED",
	"SHAPE_TIMESERIES",
	"SHAPE_CANDLES",
	"SHAPE_TABLE",
	"SHAPE_METRIC",
	"SHAPE_GAUGE",
	"SHAPE_HEATMAP",
	"SHAPE_EVENTS",
	"SHAPE_DISTRIBUTION",
	"SHAPE_TEXT",
	"SHAPE_ORDERBOOK",
	"SHAPE_PAIRED_GRID",
	"SHAPE_EMBED",
	"SHAPE_ASSET_CATALOG",
	"SHAPE_OBJECT",
	"SHAPE_GRAPH",
	"SHAPE_REPOSITORY",
	"SHAPE_RECORD_SET"
];
function jl(e) {
	if (typeof e == "number" && Number.isInteger(e)) return Al[e];
	if (typeof e == "string") {
		if (/^\d+$/.test(e)) return Al[Number(e)];
		if (Al.includes(e)) return e;
	}
}
var Ml = "medallion.terminal.v1.TerminalService";
function Nl(e) {
	switch (e) {
		case 2:
		case "PARAM_TYPE_NUMBER": return "number";
		case 3:
		case "PARAM_TYPE_BOOLEAN": return "boolean";
		case 4:
		case "PARAM_TYPE_TIMESTAMP": return "timestamp";
		case 7:
		case "PARAM_TYPE_INTEGER": return "integer";
		case 8:
		case "PARAM_TYPE_DATE": return "timestamp";
		default: return "string";
	}
}
function Pl(e) {
	let t = (e, t = !1) => ({
		name: e,
		type: "string",
		isTime: t
	}), n = (e) => ({
		name: e,
		type: "number"
	});
	switch (e) {
		case 1:
		case "SHAPE_TIMESERIES": return [t("timestamp", !0), n("value")];
		case 2:
		case "SHAPE_CANDLES": return [
			t("timestamp", !0),
			n("open"),
			n("high"),
			n("low"),
			n("close"),
			n("volume")
		];
		case 4:
		case "SHAPE_METRIC": return [
			n("value"),
			n("delta"),
			t("unit"),
			t("label")
		];
		case 5:
		case "SHAPE_GAUGE": return [
			n("value"),
			n("min"),
			n("max")
		];
		case 6:
		case "SHAPE_HEATMAP": return [
			t("row"),
			t("col"),
			n("value"),
			t("label")
		];
		case 7:
		case "SHAPE_EVENTS": return [
			t("timestamp", !0),
			t("label"),
			t("status")
		];
		case 8:
		case "SHAPE_DISTRIBUTION": return [t("label"), n("value")];
		case 9:
		case "SHAPE_TEXT": return [
			t("title"),
			t("body"),
			t("source"),
			t("date", !0)
		];
		case 10:
		case "SHAPE_ORDERBOOK": return [
			t("side"),
			n("price"),
			n("size")
		];
		case 13:
		case "SHAPE_ASSET_CATALOG": return [
			t("id"),
			t("name"),
			t("kind"),
			t("description"),
			t("owner"),
			t("status"),
			t("updated_at", !0),
			{
				name: "tags",
				type: "json"
			},
			t("url"),
			{
				name: "metadata",
				type: "json"
			},
			{
				name: "context",
				type: "json"
			}
		];
		case 14:
		case "SHAPE_OBJECT": return [
			t("object_type"),
			t("object_id"),
			t("title"),
			t("description"),
			t("status"),
			t("updated_at", !0),
			{
				name: "tags",
				type: "json"
			}
		];
		case 15:
		case "SHAPE_GRAPH": return [
			t("record_type"),
			t("id"),
			t("from"),
			t("to"),
			t("label"),
			t("kind"),
			t("status")
		];
		case 16:
		case "SHAPE_REPOSITORY": return [
			t("repository"),
			t("ref"),
			t("path"),
			t("name"),
			t("kind"),
			t("language"),
			{
				name: "size_bytes",
				type: "integer"
			},
			t("updated_at", !0)
		];
		default: return [];
	}
}
function Fl(e, t) {
	let n = t.protocol ?? "connect", r = t.endpoint.replace(/\/$/, ""), i = e.map((e) => {
		let t = jl(e.shape);
		return {
			id: e.id,
			name: e.name ?? e.id,
			description: e.description,
			shape: t,
			streamable: e.streamable,
			columns: Pl(t),
			params: (e.params ?? []).map((e) => ({
				key: e.key,
				required: e.required ?? !1,
				type: Nl(e.type),
				defaultValue: e.defaultValue ?? e.default_value,
				enumValues: e.enumValues ?? e.enum_values,
				description: e.description
			})),
			tags: e.tags
		};
	}), a = {
		version: 1,
		name: t.name,
		protocol: n,
		endpoint: r,
		auth: t.auth ?? { kind: "none" },
		tables: i
	};
	return n === "connect" && (a.service = Ml, a.getUrl = `${r}/${Ml}/Get`), a;
}
function Il(e) {
	return JSON.stringify(e, null, 2);
}
function Ll(e) {
	let t = [{
		label: "Protocol",
		value: e.protocol === "connect" ? "ConnectRPC (HTTP/JSON)" : "SQL gateway"
	}, {
		label: "Endpoint",
		value: e.endpoint
	}];
	return e.protocol === "connect" && e.getUrl && (t.push({
		label: "Get RPC URL",
		value: e.getUrl
	}), t.push({
		label: "Method",
		value: "POST"
	}), t.push({
		label: "Content-Type",
		value: "application/json"
	}), t.push({
		label: "Request body",
		value: "{ \"source_id\": \"<table id>\", \"params\": { ... } }"
	})), e.auth && e.auth.kind !== "none" && t.push({
		label: "Auth",
		value: e.auth.kind === "bearer" ? "Authorization: Bearer <token>" : `${e.auth.headerName ?? "X-Api-Key"}: <token>`
	}), t.push({
		label: "Tables",
		value: String(e.tables.length)
	}), t;
}
//#endregion
export { qc as ActionLog, Zc as AlertLog, Zs as AreaChart, Ia as AssetCatalog, dr as BUILTIN_COMPONENTS, Rt as BUILTIN_KEYS, is as BarChart, dc as Boxplot, ji as Candlestick, Na as Catalog, _s as Clock, Ja as CodeBrowser, rr as CommandPalette, pr as DEFAULT_IFRAME_SANDBOX, hr as DEFAULT_IFRAME_SANDBOX_DISALLOWED_TOKENS, mr as DEFAULT_SENSITIVE_TEMPLATE_HEADERS, gr as DEFAULT_UNTRUSTED_TEMPLATE_POLICY, Ac as Dag, ri as Dashboard, o as DashboardContext, Hi as DataTable, ha as Distribution, En as EXTENSION, Tl as EmbedView, i as Empty, Vt as ErrorBoundary, n as ErrorState, Oa as Events, Cl as ExportMenu, bl as FileBrowser, da as Gauge, xa as Heatmap, Bs as Histogram, I as HoverContext, P as HoverProvider, Ms as Iframe, ks as Image, Ic as Json, Tn as MIME, Zi as Metric, di as MultiDashboard, Pc as MultiSelect, v as NowContext, g as NowProvider, Ba as ObjectView, vo as OrderBook, B as PALETTE, Eo as PairedGrid, It as Placeholder, sa as Prompt, bc as Radar, io as RecordBoard, fo as RecordCalendar, ho as RecordForm, $a as RecordGrid, R as SEMANTIC, fs as Scatter, Ws as Section, oc as Select, or as ShortcutsOverlay, r as Skeleton, nc as Slider, zc as Sparkline, qo as StatStrip, al as Tape, ra as Text, Ro as Ticker, xi as Timeseries, No as Trade, ws as Treemap, Ho as VolumeProfile, Un as WidgetShell, ce as abbreviateAxis, Wn as applyActions, M as applyRecordView, h as buildActionRequest, d as buildActionWatchRequest, Fl as buildBiDescriptor, kl as buildEmbedUrl, p as buildGenerateRequest, l as buildGenerateUrl, Lr as buildSnapshot, s as buildSubmitActionUrl, f as buildWatchActionUrl, Wt as canParsePredicate, O as changedRecordValues, Ll as connectionFields, On as csvEscape, Qn as deleteView, Il as descriptorToJson, zn as downloadView, Ut as evaluateAlert, Rn as exportFilename, In as exportView, A as findRecordView, wn as flatten, ie as formatBps, oe as formatCompact, ne as formatCurrency, ae as formatPercent, se as formatStat, ee as formatTimestamp, Tt as getNested, zt as getWidget, E as initialRecordValues, m as interpolate, ge as isNonTerminalStatus, C as isRecordFieldEditable, Ir as isStaticTemplate, _e as isTerminalStatus, Zn as listViews, Xn as loadView, c as newClientRequestId, S as normalizeAssetCatalog, b as normalizeGraph, x as normalizeObject, k as normalizeRecordSet, y as normalizeRepository, Ol as parseEmbedConfig, Kn as readCtxFromUrl, j as recordChoiceColor, w as recordDateKey, D as recordMatchesFilter, N as recordTitle, T as recordValueLabel, Bt as registerWidget, ue as resolveColor, u as resolveSource, Yn as saveView, Pn as serializeText, kn as toCsv, An as toJson, jn as toNdjson, Nn as toParquet, me as useAnimatedNumber, wt as useBreakpoint, a as useDashboard, Ft as useDataSource, F as useHover, _ as useNow, ve as useSubmitAction, pi as useTabFromUrl, he as useWatchAction, fr as validateTemplate, vr as validateTemplateTrust, Ln as viewRowCount, Fr as widgetSnapshotKey, qn as writeCtxToUrl };
