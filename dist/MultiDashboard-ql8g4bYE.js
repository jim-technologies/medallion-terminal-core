import { C as e, S as t, l as n, n as r, r as i } from "./States-Ds3cxTem.js";
import { _ as a, c as o, f as s, m as c, n as l, s as u, t as d, u as f } from "./sourceError-BwpI_4dr.js";
import { c as p, t as m } from "./AssetOpen-CjGLA-3L.js";
import { o as h } from "./basemaps-BjEaZSH5.js";
import { Suspense as g, createContext as _, lazy as v, useCallback as y, useContext as b, useEffect as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as ee, jsx as T, jsxs as E } from "react/jsx-runtime";
//#region src/hooks/useBreakpoint.ts
function D() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function te() {
	let [e, t] = w(D);
	return x(() => {
		let e = () => t(D());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e;
}
//#endregion
//#region src/core/connectFraming.ts
var O = "application/connect+json", k = new TextDecoder();
async function ne(e, t) {
	let n = /* @__PURE__ */ new Uint8Array(), r = 0;
	for (; !t.isDisposed();) {
		let { done: i, value: a } = await e.read();
		if (i) break;
		if (a && a.length > 0) {
			let e = n.length - r, t = new Uint8Array(e + a.length);
			e > 0 && t.set(n.subarray(r), 0), t.set(a, e), n = t, r = 0;
		}
		for (; n.length - r >= 5;) {
			let e = n[r], i = new DataView(n.buffer, n.byteOffset + r + 1, 4).getUint32(0);
			if (n.length - r < 5 + i) break;
			if (e & 2) {
				let e = n.subarray(r + 5, r + 5 + i);
				r += 5 + i;
				let a = {};
				try {
					e.length > 0 && (a = JSON.parse(k.decode(e)));
				} catch {}
				t.isDisposed() || t.onTrailer?.(a);
				return;
			}
			let a = n.subarray(r + 5, r + 5 + i);
			r += 5 + i;
			try {
				let e = JSON.parse(k.decode(a));
				t.isDisposed() || t.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
//#region src/core/getNested.ts
function A(e, t) {
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
function re(e) {
	return e.inline ?? e.data;
}
function j(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function M(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function ie(e) {
	e.signal.aborted || e.abort();
}
var ae = 3e4, N = 1e3;
function P(e, t) {
	return t ? A(e, t) : e;
}
var F = /* @__PURE__ */ new Set([
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
	"records",
	"geo",
	"media",
	"conversation",
	"json"
]);
function oe(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = Object.keys(e);
	return t.length === 1 && F.has(t[0]) ? e[t[0]] : e;
}
function se(e, t = {}) {
	let n = t.fetch, [r, i] = w(null), [a, s] = w(!0), [c, p] = w(null), [m, h] = w(null), [g, _] = w(!1), [v, b] = w(null), [ee, T] = w(0), E = y(() => T((e) => e + 1), []), D = C(N), te = C(void 0), k = C(null), A = C(void 0), F = C(0), se = y((t) => {
		let n = P(oe(t), e?.transform);
		i(n), p(null), s(!1), h(Date.now()), F.current = Date.now();
	}, [e?.transform]), I = y((t) => {
		let n = e?.throttleMs ?? 0;
		if (n <= 0) {
			se(t);
			return;
		}
		let r = Date.now() - F.current;
		if (r >= n) {
			se(t);
			return;
		}
		k.current = t, A.current ||= setTimeout(() => {
			k.current !== null && se(k.current), k.current = null, A.current = void 0;
		}, n - r);
	}, [se, e?.throttleMs]), ce = S(() => e ? JSON.stringify([
		e.url,
		e.source_id,
		e.method,
		e.body,
		e.headers,
		e.stream,
		j(e),
		e.transform,
		e.throttleMs,
		e.inline !== void 0 || e.data !== void 0
	]) : "", [e]), le = e ? re(e) : void 0;
	return x(() => {
		if (!e) {
			s(!1);
			return;
		}
		if (le !== void 0) {
			I(le);
			return;
		}
		if (!e.url) {
			s(!1);
			return;
		}
		if (e.stream === "connect") {
			let t = !1, r = new AbortController(), i = async () => {
				if (!t) try {
					let i = await (n ?? globalThis.fetch)(e.url, {
						method: "POST",
						headers: {
							...e.headers,
							"Content-Type": O
						},
						body: JSON.stringify(e.body ?? {}),
						signal: r.signal
					});
					if (!i.ok) throw await u(i);
					if (!i.body) throw new d("Stream response has no body", { kind: "unavailable" });
					_(!0), b(null), p(null), D.current = N;
					let a = i.body.getReader();
					await ne(a, {
						onMessage: I,
						onTrailer: (e) => {
							if (e.error) {
								let n = e.error.code ?? "unknown", r = e.error.message ?? "stream error";
								t || p(new d(r, {
									kind: o(n),
									code: n
								}));
							}
						},
						isDisposed: () => t
					}), a.releaseLock();
				} catch (e) {
					!t && e instanceof Error && !M(e) && p(f(e));
				} finally {
					if (!t) {
						_(!1);
						let e = D.current;
						b(Date.now() + e), te.current = setTimeout(() => {
							D.current = Math.min(D.current * 2, ae), i();
						}, e);
					}
				}
			};
			return i(), () => {
				t = !0, ie(r), clearTimeout(te.current), _(!1), b(null);
			};
		}
		if (e.stream === !0) {
			let t = null, n = !1, r = () => {
				n || (t = new EventSource(e.url), t.onopen = () => {
					_(!0), b(null), p(null), D.current = N;
				}, t.onmessage = (e) => {
					try {
						I(JSON.parse(e.data));
					} catch {
						p(new d("Failed to parse stream", { kind: "unknown" }));
					}
				}, t.onerror = () => {
					if (t?.close(), _(!1), !n) {
						let e = D.current;
						b(Date.now() + e), te.current = setTimeout(() => {
							D.current = Math.min(D.current * 2, ae), r();
						}, e);
					}
				});
			};
			return r(), () => {
				n = !0, clearTimeout(te.current), t?.close(), _(!1), b(null);
			};
		}
		let t = !1, r = !1, i = new AbortController(), a = async () => {
			if (!(t || r)) {
				r = !0;
				try {
					let r = await (n ?? globalThis.fetch)(e.url, {
						method: e.method || "GET",
						headers: e.headers,
						body: e.body ? JSON.stringify(e.body) : void 0,
						signal: i.signal
					});
					if (!r.ok) throw await u(r);
					let a = await r.json();
					t || I(a);
				} catch (e) {
					!t && e instanceof Error && !M(e) && p(f(e));
				} finally {
					r = !1, t || s(!1);
				}
			}
		};
		a();
		let c, l = j(e);
		return l && l > 0 && (c = setInterval(() => void a(), l)), () => {
			t = !0, ie(i), c && clearInterval(c);
		};
	}, [
		ce,
		I,
		le,
		ee,
		n
	]), x(() => () => {
		A.current && clearTimeout(A.current);
	}, []), {
		data: r,
		loading: a,
		error: S(() => c ? l(c) : null, [c]),
		sourceError: c,
		lastUpdated: m,
		connected: g,
		nextRetryAt: v,
		refresh: E
	};
}
//#endregion
//#region src/widgets/states.tsx
var I = {
	timeseries: "chart",
	candlestick: "chart",
	table: "table",
	text: "list",
	conversation: "list",
	events: "list",
	metric: "single",
	gauge: "single",
	distribution: "donut",
	heatmap: "grid",
	prompt: "block",
	orderbook: "table",
	depth_chart: "chart",
	paired_grid: "table",
	catalog: "list",
	asset_catalog: "list",
	object_view: "list",
	code_browser: "table",
	record_grid: "table",
	record_board: "grid",
	record_calendar: "grid",
	record_form: "block",
	action_form: "block",
	trade: "block",
	ticker: "block",
	volume_profile: "list",
	stat_strip: "block",
	bar_chart: "chart",
	scatter: "chart",
	clock: "block",
	treemap: "grid",
	image: "block",
	iframe: "block",
	histogram: "chart",
	section: "block",
	area_chart: "chart",
	slider: "block",
	select: "block",
	boxplot: "chart",
	radar: "chart",
	dag: "grid",
	geo_map: "grid",
	media_gallery: "grid",
	multi_select: "block",
	json: "list",
	sparkline: "chart",
	action_log: "list",
	alert_log: "list",
	tape: "list",
	file_browser: "table"
};
function ce({ component: e }) {
	switch (e ? I[e] : "block") {
		case "chart": return /* @__PURE__ */ T(ue, {});
		case "table": return /* @__PURE__ */ T(de, {});
		case "list": return /* @__PURE__ */ T(fe, {});
		case "single": return /* @__PURE__ */ T(R, {});
		case "donut": return /* @__PURE__ */ T(pe, {});
		case "grid": return /* @__PURE__ */ T(me, {});
		default: return /* @__PURE__ */ T(he, {});
	}
}
function le({ children: e, padded: t }) {
	return /* @__PURE__ */ T(r, {
		title: e,
		compact: !0,
		icon: /* @__PURE__ */ T("span", {
			className: "text-xs uppercase tracking-[0.2em] leading-none",
			children: "·  ·  ·"
		}),
		className: `h-full${t ? " px-4" : ""}`
	});
}
var L = [
	40,
	60,
	35,
	75,
	55,
	85,
	50,
	70,
	90,
	45,
	65,
	80,
	55,
	95,
	60,
	50,
	75,
	65,
	80,
	70
];
function ue() {
	return /* @__PURE__ */ T("div", {
		className: "h-full flex items-end gap-1",
		children: L.map((e, t) => /* @__PURE__ */ T("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${e}%`,
				animationDelay: `${t * 40}ms`
			}
		}, t))
	});
}
function de() {
	let e = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ E("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ T("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: e.map((e, t) => /* @__PURE__ */ T("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: e }
			}, t))
		}), Array.from({ length: 5 }).map((t, n) => /* @__PURE__ */ T("div", {
			className: "flex gap-4",
			children: e.map((e, t) => /* @__PURE__ */ T("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: e,
					animationDelay: `${(n * 3 + t) * 50}ms`
				}
			}, t))
		}, n))]
	});
}
function fe() {
	return /* @__PURE__ */ T("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ E("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ T("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ E("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ T("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + t * 11 % 30}%`,
						animationDelay: `${t * 80}ms`
					}
				}), /* @__PURE__ */ T("div", {
					className: "h-2 bg-zinc-800/60 rounded animate-pulse",
					style: {
						width: `${35 + t * 7 % 25}%`,
						animationDelay: `${t * 80 + 40}ms`
					}
				})]
			})]
		}, t))
	});
}
function R() {
	return /* @__PURE__ */ E("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ T("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ T("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function pe() {
	return /* @__PURE__ */ E("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ T("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ T("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ T("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ T("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ E("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ T("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ T("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${t * 60}ms` }
				})]
			}, t))
		})]
	});
}
function me() {
	return /* @__PURE__ */ T("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ T("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${t * 25}ms` }
		}, t))
	});
}
function he() {
	return /* @__PURE__ */ T("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
//#region src/widgets/Placeholder.tsx
function ge(e) {
	return /* @__PURE__ */ T(le, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var z = (e, t) => v(() => e().then((e) => ({ default: e[t] }))), B = /* @__PURE__ */ new Map([
	["timeseries", z(() => import("./Timeseries-BMORR7nW.js").then((e) => e.n), "Timeseries")],
	["candlestick", z(() => import("./Candlestick-Bcb4MeOM.js").then((e) => e.n), "Candlestick")],
	["table", z(() => import("./DataTable-DuYY5g1d.js").then((e) => e.n), "DataTable")],
	["metric", z(() => import("./Metric-CsN3_xvB.js").then((e) => e.n), "Metric")],
	["text", z(() => import("./Text-efRarz2K.js").then((e) => e.n), "Text")],
	["conversation", z(() => import("./ConversationImpl-CgF50CDO.js"), "ConversationImpl")],
	["prompt", z(() => import("./Prompt-CPZaT9o1.js").then((e) => e.n), "Prompt")],
	["gauge", z(() => import("./Gauge-sKc-VMzU.js").then((e) => e.n), "Gauge")],
	["distribution", z(() => import("./Distribution-S6ZTfzLg.js").then((e) => e.n), "Distribution")],
	["heatmap", z(() => import("./Heatmap-grbM_rE9.js").then((e) => e.n), "Heatmap")],
	["events", z(() => import("./Events-D_3xhTeG.js").then((e) => e.n), "Events")],
	["catalog", z(() => import("./Catalog-CuvsxJ6A.js").then((e) => e.n), "Catalog")],
	["asset_catalog", z(() => import("./AssetCatalog-ClaTVe3W.js").then((e) => e.n), "AssetCatalog")],
	["object_view", z(() => import("./ObjectView-CKVVsj-m.js").then((e) => e.n), "ObjectView")],
	["code_browser", z(() => import("./CodeBrowser-aqchzOh0.js").then((e) => e.n), "CodeBrowser")],
	["record_grid", z(() => import("./RecordGrid-DLx7P9Tk.js").then((e) => e.n), "RecordGrid")],
	["record_board", z(() => import("./RecordBoard-CaJ20ViA.js").then((e) => e.n), "RecordBoard")],
	["record_calendar", z(() => import("./RecordCalendar-mHEdweWe.js").then((e) => e.n), "RecordCalendar")],
	["record_form", z(() => import("./RecordForm-BkP1CrI6.js").then((e) => e.n), "RecordForm")],
	["action_form", z(() => import("./ActionForm-DGGXK9_L.js").then((e) => e.n), "ActionForm")],
	["orderbook", z(() => import("./OrderBook-CJw5kCK_.js").then((e) => e.n), "OrderBook")],
	["depth_chart", z(() => import("./DepthChart-Cr_7WSDc.js").then((e) => e.n), "DepthChart")],
	["paired_grid", z(() => import("./PairedGrid-OdAi6XCV.js").then((e) => e.n), "PairedGrid")],
	["trade", z(() => import("./Trade-CF-N6YD3.js").then((e) => e.n), "Trade")],
	["ticker", z(() => import("./Ticker-C9Lgb2MF.js").then((e) => e.n), "Ticker")],
	["volume_profile", z(() => import("./VolumeProfile-Bci9HLVp.js").then((e) => e.n), "VolumeProfile")],
	["stat_strip", z(() => import("./StatStrip-DiwX_ZEA.js").then((e) => e.n), "StatStrip")],
	["bar_chart", z(() => import("./BarChart-acSco0aB.js").then((e) => e.n), "BarChart")],
	["scatter", z(() => import("./Scatter-9QXFoUUk.js").then((e) => e.n), "Scatter")],
	["clock", z(() => import("./Clock-Cc9ABoWJ.js").then((e) => e.n), "Clock")],
	["treemap", z(() => import("./Treemap-URpT1Cal.js").then((e) => e.n), "Treemap")],
	["image", z(() => import("./Image-B56lWN8B.js").then((e) => e.n), "Image")],
	["iframe", z(() => import("./Iframe-BhLdtub9.js").then((e) => e.n), "Iframe")],
	["histogram", z(() => import("./Histogram-BX1DANds.js").then((e) => e.n), "Histogram")],
	["section", z(() => import("./Section-Cpjr_7EV.js").then((e) => e.n), "Section")],
	["area_chart", z(() => import("./AreaChart-2l13rDmp.js").then((e) => e.n), "AreaChart")],
	["slider", z(() => import("./Slider-CvjPEk6E.js").then((e) => e.n), "Slider")],
	["select", z(() => import("./Select-DiPyp_AL.js").then((e) => e.n), "Select")],
	["boxplot", z(() => import("./Boxplot-Do_Chj8u.js").then((e) => e.n), "Boxplot")],
	["radar", z(() => import("./Radar-DP6KrFjV.js").then((e) => e.n), "Radar")],
	["dag", z(() => import("./Dag-DxmwL3KT.js").then((e) => e.n), "Dag")],
	["geo_map", z(() => import("./GeoMap-B0tMl925.js").then((e) => e.n), "GeoMap")],
	["media_gallery", z(() => import("./MediaGalleryImpl-DZ6WOCOz.js"), "MediaGalleryImpl")],
	["multi_select", z(() => import("./MultiSelect-DuNEpbHt.js").then((e) => e.n), "MultiSelect")],
	["json", z(() => import("./Json-WgUaOivy.js").then((e) => e.n), "Json")],
	["sparkline", z(() => import("./Sparkline-U5bMVTJv.js").then((e) => e.n), "Sparkline")],
	["action_log", z(() => import("./ActionLog-CPvrTb5z.js").then((e) => e.n), "ActionLog")],
	["alert_log", z(() => import("./AlertLog-dvQlozDS.js").then((e) => e.n), "AlertLog")],
	["tape", z(() => import("./Tape-BZGssqfs.js").then((e) => e.n), "Tape")],
	["file_browser", z(() => import("./FileBrowser-D9CcXAZw.js").then((e) => e.n), "FileBrowser")]
]), _e = new Set(B.keys()), V = class {
	#e;
	constructor(e = {}) {
		this.#e = e.includeBuiltIns === !1 ? /* @__PURE__ */ new Map() : new Map(B);
	}
	register(e, t) {
		return this.#e.set(e, t), this;
	}
	unregister(e) {
		return this.#e.delete(e);
	}
	get(e) {
		return this.#e.get(e);
	}
	has(e) {
		return this.#e.has(e);
	}
	keys() {
		return new Set(this.#e.keys());
	}
};
function ve(e = {}) {
	return new V(e);
}
var ye = new Map(B);
function be(e, t) {
	return (t ? t.get(e) : ye.get(e)) || ge;
}
function xe(e, t) {
	ye.set(e, t);
}
var Se = _({
	dispatch: () => {},
	ctx: {},
	setCtx: () => {},
	widgets: [],
	backendHeaders: {},
	toast: () => {},
	compact: !1,
	fullscreenId: null,
	setFullscreenId: () => {},
	focusedId: null,
	setFocusedId: () => {},
	refreshPulse: null,
	requestRefresh: () => {},
	emit: () => {},
	emitIntent: () => {},
	recentActions: [],
	clearRecentActions: () => {},
	recentAlerts: [],
	clearRecentAlerts: () => {},
	soundEnabled: !1,
	widgetHealth: {},
	reportWidgetHealth: () => {},
	registerWidgetData: () => () => {},
	snapshot: () => ({ widgets: [] })
});
function Ce() {
	return b(Se);
}
//#endregion
//#region src/core/resolveSource.ts
var we = "medallion.terminal.v1.TerminalService";
function Te(e) {
	return `${e.replace(/\/$/, "")}/${we}/Generate`;
}
function Ee(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function De(e) {
	return `${e.replace(/\/$/, "")}/${we}/SubmitAction`;
}
function Oe(e) {
	return `${e.replace(/\/$/, "")}/${we}/WatchAction`;
}
function ke(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function Ae(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function je() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var Me = !1, Ne = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function Pe(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new Ne(r);
		return "";
	});
}
function Fe(e, t, n, r = {}) {
	if (e.source_id) {
		if (n === void 0) return Me ||= (console.warn(`[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), e;
		let i = e.stream ? "Stream" : "Get", a = n.replace(/\/$/, ""), o = {};
		if (e.params) for (let [n, r] of Object.entries(e.params)) o[n] = Pe(r, t, { strict: !0 });
		return {
			url: `${a}/${we}/${i}`,
			method: "POST",
			headers: {
				...r,
				"Content-Type": "application/json"
			},
			body: {
				source_id: e.source_id,
				params: o
			},
			stream: e.stream ? "connect" : !1,
			refreshIntervalMs: e.refreshIntervalMs ?? e.refreshInterval
		};
	}
	if (!e.url && !e.params) return e;
	let i = { ...e };
	if (e.url) {
		let n = Pe(e.url, t, { strict: !0 });
		if (e.params && Object.keys(e.params).length > 0) {
			let r = Object.entries(e.params).map(([e, n]) => `${encodeURIComponent(e)}=${encodeURIComponent(Pe(n, t, { strict: !0 }))}`).join("&");
			n = n.includes("?") ? `${n}&${r}` : `${n}?${r}`;
		}
		i.url = n;
	}
	return i;
}
//#endregion
//#region src/core/NowContext.tsx
var Ie = _({
	now: 0,
	subscribe: () => () => {}
});
function Le(e = !0) {
	let { now: t, subscribe: n } = b(Ie);
	return x(() => {
		if (e) return n();
	}, [e, n]), t;
}
function Re({ children: e }) {
	let [t, n] = w(() => Date.now()), r = C(0), i = C(null), a = S(() => ({
		now: t,
		subscribe: () => (r.current += 1, i.current ??= setInterval(() => n(Date.now()), 1e3), () => {
			r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
		})
	}), [t]);
	return x(() => () => {
		i.current != null && clearInterval(i.current);
	}, []), /* @__PURE__ */ T(Ie.Provider, {
		value: a,
		children: e
	});
}
//#endregion
//#region src/core/alerts.ts
var ze = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Be(e, t) {
	let n = He(t);
	return n ? Ke(n, e) : !1;
}
function Ve(e) {
	return He(e) !== null;
}
function He(e) {
	let t = e.trim();
	if (!t) return null;
	let n = Ue(t, "||"), r = [];
	for (let e of n) {
		let t = Ue(e, "&&"), n = [];
		for (let e of t) {
			let t = We(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function Ue(e, t) {
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
function We(e) {
	let t = e.trim().match(ze);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: Ge(i.trim())
	};
}
function Ge(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function Ke(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!qe(A(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function qe(e, t, n) {
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
var H = {
	warn: 720,
	error: 480
}, Je = 160, Ye = .08, U = null;
function Xe() {
	if (typeof window > "u") return null;
	if (U) return U;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (U = new t(), U) : null;
}
function Ze(e) {
	let t = H[e];
	if (!t) return;
	let n = Xe();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime(Ye, a + .02), i.gain.linearRampToValueAtTime(0, a + Je / 1e3), r.start(a), r.stop(a + Je / 1e3 + .05);
}
//#endregion
//#region src/widgets/platformShapes.ts
function W(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function G(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function Qe(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function $e(e) {
	return W(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function et(e) {
	return W(e) ? e : {};
}
function tt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function nt(e) {
	let t = Array.isArray(e) ? { items: e } : et(e);
	return {
		items: (Array.isArray(t.items) ? t.items : []).filter(W).map((e) => ({
			id: String(e.id ?? ""),
			name: String(e.name ?? e.id ?? ""),
			kind: String(e.kind ?? "asset"),
			description: G(e.description),
			owner: G(e.owner),
			status: G(e.status),
			updatedAt: G(e.updatedAt ?? e.updated_at),
			tags: Qe(e.tags),
			url: G(e.url),
			metadata: et(e.metadata),
			context: $e(e.context)
		})).filter((e) => e.id && e.name),
		total: tt(t.total),
		nextPageToken: G(t.nextPageToken ?? t.next_page_token)
	};
}
function rt(e) {
	let t = et(e), n = String(t.objectType ?? t.object_type ?? ""), r = String(t.objectId ?? t.object_id ?? ""), i = String(t.title ?? t.name ?? r);
	if (!n && !r && !i) return null;
	let a = (Array.isArray(t.properties) ? t.properties : []).filter(W).map((e) => ({
		key: String(e.key ?? ""),
		label: String(e.label ?? e.key ?? ""),
		value: e.value,
		format: G(e.format),
		description: G(e.description),
		group: G(e.group)
	})).filter((e) => e.key), o = (Array.isArray(t.links) ? t.links : []).filter(W).map((e) => ({
		relation: String(e.relation ?? ""),
		targetType: String(e.targetType ?? e.target_type ?? ""),
		targetId: String(e.targetId ?? e.target_id ?? ""),
		label: String(e.label ?? e.targetId ?? e.target_id ?? ""),
		status: G(e.status),
		context: $e(e.context)
	})).filter((e) => e.targetId), s = (Array.isArray(t.actions) ? t.actions : []).filter(W).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		description: G(e.description),
		style: G(e.style),
		confirm: e.confirm === !0,
		params: et(e.params),
		disabled: e.disabled === !0
	})).filter((e) => e.id);
	return {
		objectType: n,
		objectId: r,
		title: i,
		description: G(t.description),
		status: G(t.status),
		updatedAt: G(t.updatedAt ?? t.updated_at),
		tags: Qe(t.tags),
		properties: a,
		links: o,
		actions: s
	};
}
function it(e) {
	let t = et(e);
	if (!Array.isArray(t.nodes)) return null;
	let n = t.nodes.filter(W).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		kind: G(e.kind),
		status: G(e.status),
		subtitle: G(e.subtitle),
		tags: Qe(e.tags),
		metadata: et(e.metadata),
		context: $e(e.context)
	})).filter((e) => e.id), r = (Array.isArray(t.edges) ? t.edges : []).filter(W).map((e) => ({
		from: String(e.from ?? ""),
		to: String(e.to ?? ""),
		label: G(e.label),
		kind: G(e.kind),
		status: G(e.status)
	})).filter((e) => e.from && e.to);
	return n.length > 0 ? {
		nodes: n,
		edges: r
	} : null;
}
function at(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "2" || t === "DIRECTORY" || t === "DIR" || t === "REPOSITORY_ENTRY_KIND_DIRECTORY" ? "directory" : t === "3" || t === "SYMLINK" || t === "REPOSITORY_ENTRY_KIND_SYMLINK" ? "symlink" : "file";
}
function ot(e) {
	let t = et(e), n = String(t.repository ?? t.name ?? "");
	if (!n && !Array.isArray(t.entries) && !W(t.file)) return null;
	let r = (Array.isArray(t.entries) ? t.entries : []).filter(W).map((e) => ({
		path: String(e.path ?? e.name ?? ""),
		name: String(e.name ?? String(e.path ?? "").split("/").pop() ?? ""),
		kind: at(e.kind),
		language: G(e.language),
		sizeBytes: tt(e.sizeBytes ?? e.size_bytes),
		updatedAt: G(e.updatedAt ?? e.updated_at)
	})).filter((e) => e.path && e.name), i = W(t.file) ? t.file : null, a = i ? {
		path: String(i.path ?? t.path ?? ""),
		content: String(i.content ?? ""),
		language: G(i.language),
		sizeBytes: tt(i.sizeBytes ?? i.size_bytes),
		truncated: i.truncated === !0,
		url: G(i.url)
	} : void 0;
	return {
		repository: n,
		ref: String(t.ref ?? ""),
		path: String(t.path ?? ""),
		refs: Qe(t.refs),
		entries: r,
		file: a,
		url: G(t.url)
	};
}
//#endregion
//#region src/widgets/recordShapes.ts
function K(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function st(e) {
	return K(e) ? e : {};
}
function q(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function ct(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function lt(e) {
	return K(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function ut(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
var dt = {
	1: "text",
	2: "long_text",
	3: "number",
	4: "currency",
	5: "percent",
	6: "boolean",
	7: "date",
	8: "datetime",
	9: "single_select",
	10: "multi_select",
	11: "user",
	12: "link",
	13: "attachment",
	14: "url",
	15: "email",
	16: "phone",
	17: "formula",
	18: "lookup",
	19: "rollup",
	20: "created_at",
	21: "updated_at"
}, ft = {
	1: "grid",
	2: "board",
	3: "calendar",
	4: "gallery",
	5: "list",
	6: "timeline",
	7: "form"
};
function pt(e, t) {
	return String(e ?? "").replace(t, "").toLowerCase();
}
function mt(e) {
	let t = dt[String(e)];
	if (t) return t;
	let n = pt(e, "RECORD_FIELD_TYPE_");
	return Object.values(dt).includes(n) ? n : "text";
}
function ht(e) {
	let t = ft[String(e)];
	if (t) return t;
	let n = pt(e, "RECORD_VIEW_TYPE_");
	return Object.values(ft).includes(n) ? n : "grid";
}
function gt(e) {
	return typeof e == "boolean" ? "boolean" : typeof e == "number" ? "number" : Array.isArray(e) ? "multi_select" : "text";
}
function _t(e) {
	return e === "formula" || e === "lookup" || e === "rollup" || e === "created_at" || e === "updated_at";
}
function vt(e, t) {
	let n = (Array.isArray(e.fields) ? e.fields : []).filter(K).map((e) => {
		let t = mt(e.type), n = (Array.isArray(e.choices) ? e.choices : []).filter(K).map((e) => ({
			value: String(e.value ?? ""),
			label: String(e.label ?? e.value ?? ""),
			color: q(e.color)
		})).filter((e) => e.value);
		return {
			key: String(e.key ?? ""),
			label: String(e.label ?? e.key ?? ""),
			type: t,
			description: q(e.description),
			required: e.required === !0,
			readOnly: e.readOnly === !0 || e.read_only === !0 || _t(t),
			choices: n,
			linkedTableId: q(e.linkedTableId ?? e.linked_table_id),
			allowMultiple: e.allowMultiple === !0 || e.allow_multiple === !0,
			format: q(e.format),
			defaultValue: e.defaultValue ?? e.default_value
		};
	}).filter((e) => e.key);
	return n.length > 0 ? n : [...new Set(t.flatMap((e) => Object.keys(e.values)))].map((e) => {
		let n = t.find((t) => t.values[e] != null)?.values[e];
		return {
			key: e,
			label: e,
			type: gt(n),
			required: !1,
			readOnly: !1,
			choices: [],
			allowMultiple: Array.isArray(n)
		};
	});
}
function yt(e) {
	let t = st(e), n = (Array.isArray(t.records) ? t.records : Array.isArray(t.rows) ? t.rows : []).filter(K).map((e, t) => {
		let n = K(e.values) ? e.values : Object.fromEntries(Object.entries(e).filter(([e]) => ![
			"id",
			"_id",
			"createdAt",
			"created_at",
			"updatedAt",
			"updated_at",
			"revision",
			"context"
		].includes(e)));
		return {
			id: String(e.id ?? e._id ?? `record-${t + 1}`),
			values: n,
			createdAt: q(e.createdAt ?? e.created_at),
			updatedAt: q(e.updatedAt ?? e.updated_at),
			revision: q(e.revision),
			context: lt(e.context)
		};
	}).filter((e) => e.id), r = vt(t, n), i = (Array.isArray(t.views) ? t.views : []).filter(K).map((e) => ({
		id: String(e.id ?? ""),
		name: String(e.name ?? e.id ?? ""),
		type: ht(e.type),
		visibleFields: ct(e.visibleFields ?? e.visible_fields),
		groupBy: q(e.groupBy ?? e.group_by),
		dateField: q(e.dateField ?? e.date_field),
		titleField: q(e.titleField ?? e.title_field),
		sorts: (Array.isArray(e.sorts) ? e.sorts : []).filter(K).map((e) => ({
			field: String(e.field ?? ""),
			descending: e.descending === !0
		})).filter((e) => e.field),
		filters: (Array.isArray(e.filters) ? e.filters : []).filter(K).map((e) => ({
			field: String(e.field ?? ""),
			operator: String(e.operator ?? "eq").toLowerCase(),
			value: e.value
		})).filter((e) => e.field)
	})).filter((e) => e.id), a = st(t.capabilities), o = String(t.tableId ?? t.table_id ?? ""), s = String(t.tableName ?? t.table_name ?? o);
	return !o && !s && r.length === 0 && n.length === 0 ? null : {
		workspaceId: String(t.workspaceId ?? t.workspace_id ?? ""),
		tableId: o,
		tableName: s,
		primaryField: String(t.primaryField ?? t.primary_field ?? r[0]?.key ?? "id"),
		fields: r,
		records: n,
		views: i,
		activeViewId: q(t.activeViewId ?? t.active_view_id),
		total: ut(t.total),
		nextPageToken: q(t.nextPageToken ?? t.next_page_token),
		capabilities: {
			create: a.create === !0,
			update: a.update === !0,
			delete: a.delete === !0,
			createActionId: String(a.createActionId ?? a.create_action_id ?? "record_create"),
			updateActionId: String(a.updateActionId ?? a.update_action_id ?? "record_update"),
			deleteActionId: String(a.deleteActionId ?? a.delete_action_id ?? "record_delete")
		}
	};
}
function bt(e) {
	return !e.readOnly && e.type !== "attachment";
}
function xt(e, t) {
	return Object.fromEntries(e.map((e) => [e.key, t ? t.values[e.key] : e.defaultValue ?? null]));
}
function St(e, t, n) {
	let r = e.filter(bt).filter((e) => JSON.stringify(t[e.key]) !== JSON.stringify(n?.values[e.key])).map((e) => [e.key, t[e.key]]);
	return Object.fromEntries(r);
}
function Ct(e, t, n = e.primaryField) {
	let r = t.values[n] ?? t.values[e.primaryField];
	return K(r) ? String(r.label ?? r.name ?? r.id ?? t.id) : Array.isArray(r) ? r.map(wt).join(", ") || t.id : r == null || r === "" ? t.id : String(r);
}
function wt(e) {
	return e == null ? "" : K(e) ? String(e.label ?? e.name ?? e.id ?? "") : Array.isArray(e) ? e.map(wt).filter(Boolean).join(", ") : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Tt(e) {
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)) return e;
	let t = e instanceof Date ? e : typeof e == "string" || typeof e == "number" ? new Date(e) : null;
	return !t || Number.isNaN(t.getTime()) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function Et(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function J(e) {
	return K(e) ? e.id ?? e.value ?? e.label ?? e.name ?? "" : e;
}
function Dt(e, t) {
	let n = J(e), r = J(t);
	return typeof n == "number" && typeof r == "number" ? n === r : String(n ?? "").toLowerCase() === String(r ?? "").toLowerCase();
}
function Ot(e, t) {
	if (e) return e.choices.find((e) => Dt(e.value, t))?.color;
}
function kt(e, t) {
	let n = e.values[t.field], r = t.value;
	switch (t.operator) {
		case "empty": return Et(n);
		case "not_empty": return !Et(n);
		case "neq": return !Dt(n, r);
		case "contains": return Array.isArray(n) ? n.some((e) => Dt(e, r)) : wt(n).toLowerCase().includes(wt(r).toLowerCase());
		case "in": {
			let e = Array.isArray(r) ? r : [r];
			return (Array.isArray(n) ? n : [n]).some((t) => e.some((e) => Dt(t, e)));
		}
		case "gt": return Number(J(n)) > Number(J(r));
		case "gte": return Number(J(n)) >= Number(J(r));
		case "lt": return Number(J(n)) < Number(J(r));
		case "lte": return Number(J(n)) <= Number(J(r));
		default: return Dt(n, r);
	}
}
function At(e, t) {
	if (!t) return e;
	let n = t.filters.length > 0 ? e.filter((e) => t.filters.every((t) => kt(e, t))) : e;
	return t.sorts.length === 0 ? n : n.map((e, t) => ({
		record: e,
		index: t
	})).sort((e, n) => {
		for (let r of t.sorts) {
			let t = J(e.record.values[r.field]), i = J(n.record.values[r.field]);
			if (t == null && i == null) continue;
			if (t == null) return 1;
			if (i == null) return -1;
			let a = typeof t == "number" && typeof i == "number" ? t - i : String(t).localeCompare(String(i), void 0, {
				numeric: !0,
				sensitivity: "base"
			});
			if (a !== 0) return r.descending ? -a : a;
		}
		return e.index - n.index;
	}).map((e) => e.record);
}
function jt(e, t, n) {
	return e.views.find((e) => e.id === n && e.type === t) ?? e.views.find((n) => n.id === e.activeViewId && n.type === t) ?? e.views.find((e) => e.type === t);
}
//#endregion
//#region src/widgets/mediaShape.ts
function Mt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Nt(e) {
	return Mt(e) ? e : {};
}
function Y(e) {
	if (e != null) return String(e).trim() || void 0;
}
function Pt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim()) {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function Ft(e) {
	let t = Pt(e);
	return t != null && t >= 0 ? t : void 0;
}
function It(e) {
	return Array.isArray(e) ? [...new Set(e.map(String).map((e) => e.trim()).filter(Boolean))] : [];
}
function Lt(e) {
	return Mt(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function Rt(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
function zt(e, t, n) {
	if (e === 2) return "video";
	if (e === 1) return "image";
	let r = String(e ?? "").toLowerCase();
	return r.includes("video") || r === "movie" ? "video" : r.includes("image") || r.includes("photo") ? "image" : t?.toLowerCase().startsWith("video/") || /\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(n) ? "video" : "image";
}
function Bt(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).pop();
	if (!t) return "Untitled media";
	try {
		return decodeURIComponent(t);
	} catch {
		return t;
	}
}
function Vt(e) {
	if (!Mt(e)) return null;
	let t = Rt(e.url ?? e.mediaUrl ?? e.media_url ?? e.src);
	if (!t) return null;
	let n = Y(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type);
	return {
		id: Y(e.id ?? e.mediaId ?? e.media_id) ?? t,
		title: Y(e.title ?? e.name ?? e.label ?? e.filename) ?? Bt(t),
		kind: zt(e.kind ?? e.type ?? e.mediaType ?? e.media_type, n, t),
		url: t,
		thumbnailUrl: Rt(e.thumbnailUrl ?? e.thumbnail_url ?? e.thumbnail ?? e.posterUrl ?? e.poster_url ?? e.poster),
		description: Y(e.description ?? e.caption),
		capturedAt: Y(e.capturedAt ?? e.captured_at ?? e.takenAt ?? e.taken_at ?? e.dateTaken ?? e.date_taken),
		createdAt: Y(e.createdAt ?? e.created_at ?? e.uploadedAt ?? e.uploaded_at),
		contentType: n,
		width: Ft(e.width),
		height: Ft(e.height),
		durationSeconds: Ft(e.durationSeconds ?? e.duration_seconds ?? e.duration),
		favorite: e.favorite === !0 || e.isFavorite === !0 || e.is_favorite === !0,
		tags: It(e.tags),
		collectionIds: It(e.collectionIds ?? e.collection_ids ?? e.albumIds ?? e.album_ids ?? e.albums),
		metadata: Nt(e.metadata),
		context: Lt(e.context)
	};
}
function Ht(e) {
	if (!Mt(e)) return null;
	let t = Y(e.id ?? e.collectionId ?? e.collection_id ?? e.albumId ?? e.album_id);
	return t ? {
		id: t,
		name: Y(e.name ?? e.title ?? e.label) ?? Zt(t),
		coverUrl: Rt(e.coverUrl ?? e.cover_url ?? e.thumbnailUrl ?? e.thumbnail_url),
		itemCount: Ft(e.itemCount ?? e.item_count ?? e.count),
		context: Lt(e.context)
	} : null;
}
function Ut(e) {
	let t = Array.isArray(e) ? { items: e } : Nt(e), n = (Array.isArray(t.items) ? t.items : Array.isArray(t.media) ? t.media : Array.isArray(t.assets) ? t.assets : []).map(Vt).filter((e) => e !== null), r = (Array.isArray(t.collections) ? t.collections : Array.isArray(t.albums) ? t.albums : []).map(Ht).filter((e) => e !== null), i = new Set(r.map((e) => e.id));
	for (let e of new Set(n.flatMap((e) => e.collectionIds))) i.has(e) || r.push({
		id: e,
		name: Zt(e),
		itemCount: n.filter((t) => t.collectionIds.includes(e)).length,
		context: {}
	});
	return {
		items: Wt(n),
		collections: r,
		total: Ft(t.total),
		nextPageToken: Y(t.nextPageToken ?? t.next_page_token)
	};
}
function Wt(e) {
	return [...e].sort((e, t) => {
		let n = Yt(t) - Yt(e);
		return n === 0 ? e.title.localeCompare(t.title) : n;
	});
}
function Gt(e, t) {
	let n = t.query?.trim().toLowerCase() ?? "", r = t.kind ?? "all", i = t.collectionId && t.collectionId !== "all" ? t.collectionId : void 0;
	return e.filter((e) => r === "favorite" && !e.favorite || r !== "all" && r !== "favorite" && e.kind !== r || i && !e.collectionIds.includes(i) ? !1 : !n || [
		e.id,
		e.title,
		e.description,
		e.contentType,
		...e.tags,
		...Object.values(e.metadata)
	].filter((e) => e != null).map(String).join(" ").toLowerCase().includes(n));
}
function Kt(e, t = "day") {
	let n = Wt(e);
	if (t === "none") return n.length > 0 ? [{
		key: "all",
		label: "All media",
		items: n
	}] : [];
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let n = (e.capturedAt ?? e.createdAt)?.match(/^(\d{4})-(\d{2})-(\d{2})/), i = n ? t === "month" ? `${n[1]}-${n[2]}` : `${n[1]}-${n[2]}-${n[3]}` : "undated", a = r.get(i) ?? [];
		a.push(e), r.set(i, a);
	}
	return [...r].map(([e, n]) => ({
		key: e,
		label: Xt(e, t),
		items: n
	}));
}
function qt(e) {
	if (e == null || !Number.isFinite(e) || e < 0) return;
	let t = Math.round(e), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
function Jt(e) {
	if (!e) return;
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(t);
}
function Yt(e) {
	let t = Date.parse(e.capturedAt ?? e.createdAt ?? "");
	return Number.isFinite(t) ? t : -Infinity;
}
function Xt(e, t) {
	if (e === "undated") return "Undated";
	let n = /* @__PURE__ */ new Date(`${e}${t === "month" ? "-01" : ""}T12:00:00Z`);
	return Number.isNaN(n.getTime()) ? e : new Intl.DateTimeFormat(void 0, t === "month" ? {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	} : {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	}).format(n);
}
function Zt(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
//#region src/widgets/geoShape.ts
var Qt = /* @__PURE__ */ new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]);
function $t(e) {
	let t = fn(e), n = t.geo ?? t.geojson ?? e, r = fn(n), i;
	if (r.type === "FeatureCollection" && Array.isArray(r.features)) i = r.features;
	else if (r.type === "Feature") i = [r];
	else if (Array.isArray(r.features)) i = r.features;
	else if (Array.isArray(r.points)) i = r.points;
	else if (Array.isArray(r.rows)) i = r.rows;
	else if (Array.isArray(n)) i = n;
	else return null;
	let a = i.map((e, t) => rn(e, t)).filter((e) => e !== null);
	return a.length > 0 ? {
		type: "FeatureCollection",
		features: a
	} : null;
}
function en(e) {
	let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity;
	for (let a of e.features) ln(a.geometry.coordinates, (e) => {
		t = Math.min(t, e[0]), r = Math.max(r, e[0]), n = Math.min(n, e[1]), i = Math.max(i, e[1]);
	});
	return [
		t,
		n,
		r,
		i
	].every(Number.isFinite) ? [[t, n], [r, i]] : null;
}
function tn(e) {
	let t = e.properties._mtc_context;
	if (typeof t != "string") return {};
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? {} : Object.fromEntries(Object.entries(e).filter((e) => typeof e[1] == "string"));
	} catch {
		return {};
	}
}
function nn(e) {
	let t = e.properties._mtc_label;
	return typeof t == "string" && t !== "" ? t : e.id;
}
function rn(e, t) {
	let n = fn(e), r = fn(n.properties), i = an(n.geometry) ?? on(n);
	if (!i) return null;
	let a = String(n.id ?? r.id ?? r.feature_id ?? r.object_id ?? `feature-${t + 1}`), o = hn(n.label, n.name, r.label, r.name, r.title, a), s = hn(n.status, r.status), c = mn(n.value ?? r.value), l = {
		...pn(r.context),
		...pn(n.context)
	}, u = {
		...fn(r.metadata),
		...fn(n.metadata)
	};
	return {
		type: "Feature",
		id: a,
		geometry: i,
		properties: {
			...dn(r),
			...dn(u),
			_mtc_id: a,
			_mtc_label: o,
			_mtc_tone: un(s),
			...s && { _mtc_status: s },
			...c !== void 0 && { _mtc_value: c },
			_mtc_context: JSON.stringify(l)
		}
	};
}
function an(e) {
	let t = fn(e), n = t.type;
	return typeof n != "string" || !Qt.has(n) || !sn(n, t.coordinates) ? null : {
		type: n,
		coordinates: t.coordinates
	};
}
function on(e) {
	let t = mn(e.latitude ?? e.lat), n = mn(e.longitude ?? e.lng ?? e.lon);
	return t === void 0 || n === void 0 || t < -90 || t > 90 || n < -180 || n > 180 ? null : {
		type: "Point",
		coordinates: [n, t]
	};
}
function sn(e, t) {
	return cn(t, {
		Point: 0,
		MultiPoint: 1,
		LineString: 1,
		MultiLineString: 2,
		Polygon: 2,
		MultiPolygon: 3
	}[e]);
}
function cn(e, t) {
	if (t === 0) {
		if (!Array.isArray(e) || e.length < 2) return !1;
		let t = Number(e[0]), n = Number(e[1]);
		return Number.isFinite(t) && Number.isFinite(n) && t >= -180 && t <= 180 && n >= -90 && n <= 90;
	}
	return Array.isArray(e) && e.length > 0 && e.every((e) => cn(e, t - 1));
}
function ln(e, t) {
	if (Array.isArray(e)) {
		if (e.length >= 2 && typeof e[0] == "number" && typeof e[1] == "number") {
			t(e);
			return;
		}
		for (let n of e) ln(n, t);
	}
}
function un(e) {
	switch (e?.toLowerCase()) {
		case "ok":
		case "healthy":
		case "active":
		case "online":
		case "complete":
		case "completed": return "ok";
		case "warn":
		case "warning":
		case "delayed":
		case "degraded":
		case "pending": return "warn";
		case "error":
		case "failed":
		case "offline":
		case "critical":
		case "danger": return "danger";
		case "info":
		case "running":
		case "selected": return "info";
		default: return "neutral";
	}
}
function dn(e) {
	return Object.fromEntries(Object.entries(e).filter((e) => e[1] === null || typeof e[1] == "string" || typeof e[1] == "number" || typeof e[1] == "boolean"));
}
function fn(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function pn(e) {
	let t = fn(e);
	return Object.fromEntries(Object.entries(t).filter((e) => typeof e[1] == "string"));
}
function mn(e) {
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function hn(...e) {
	return e.find((e) => typeof e == "string" && e !== "");
}
//#endregion
//#region src/widgets/orderBookShape.ts
function gn(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e, n = yn(t.bids, "bid"), r = yn(t.asks, "ask");
	if (n.length === 0 && r.length === 0) return null;
	let i = xn(t.mid), a = xn(t.spread);
	return {
		bids: n,
		asks: r,
		...i !== void 0 && { mid: i },
		...a !== void 0 && { spread: a },
		...typeof t.venue == "string" && t.venue !== "" && { venue: t.venue }
	};
}
function _n(e, t = 100, n = "size") {
	let r = Number.isFinite(t) ? Math.max(1, Math.floor(t)) : 100, i = 0, a = e.bids.slice(0, r).map((e) => (i += vn(e, n), {
		price: e.price,
		side: "bid",
		cumulative: i
	})), o = 0, s = e.asks.slice(0, r).map((e) => (o += vn(e, n), {
		price: e.price,
		side: "ask",
		cumulative: o
	}));
	return [...a.reverse(), ...s];
}
function vn(e, t) {
	return t === "notional" ? e.price * e.size : e.size;
}
function yn(e, t) {
	if (!Array.isArray(e)) return [];
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = bn(t);
		e && n.set(e.price, (n.get(e.price) ?? 0) + e.size);
	}
	return Array.from(n, ([e, t]) => ({
		price: e,
		size: t
	})).sort((e, n) => t === "bid" ? n.price - e.price : e.price - n.price);
}
function bn(e) {
	let t, n;
	if (Array.isArray(e)) t = Number(e[0]), n = Number(e[1]);
	else if (e && typeof e == "object") {
		let r = e;
		t = Number(r.price), n = Number(r.size ?? r.quantity ?? r.qty);
	} else return null;
	return !Number.isFinite(t) || !Number.isFinite(n) || t < 0 || n <= 0 ? null : {
		price: t,
		size: n
	};
}
function xn(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
//#endregion
//#region src/export/flatten.ts
var Sn = {
	columns: [],
	rows: []
};
function X(e) {
	if (e == null) return null;
	let t = typeof e;
	if (t === "number" || t === "boolean" || t === "string") return e;
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
function Z(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of Object.keys(r)) n.has(e) || (n.add(e), t.push(e));
	return {
		columns: t,
		rows: e.map((e) => {
			let n = {};
			for (let r of t) n[r] = X(e[r]);
			return n;
		})
	};
}
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Cn(e) {
	let t = (e) => Array.isArray(e) ? e : Q(e) && Array.isArray(e.points) ? e.points : null;
	if (Q(e) && Array.isArray(e.series)) {
		let t = e.series, n = /* @__PURE__ */ new Map(), r = [];
		for (let e = 0; e < t.length; e++) {
			let i = t[e], a = i.name ?? `series_${e + 1}`;
			r.push(a);
			let o = i.points ?? i.data ?? [];
			for (let e of o) {
				let t = String(e.timestamp ?? ""), r = n.get(t) ?? { timestamp: t };
				r[a] = X(e.value), n.set(t, r);
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
			timestamp: X(e.timestamp),
			value: X(e.value)
		}))
	} : null;
}
function wn(e) {
	return Q(e) && Array.isArray(e.bars) ? Z(e.bars) : null;
}
function Tn(e) {
	if (Array.isArray(e) && e.length > 0 && Q(e[0])) return Z(e);
	if (Q(e) && "rows" in e) {
		let t = e, n = Array.isArray(t.columns) ? t.columns : [];
		if (n.length > 0 && Q(n[0])) {
			let e = n.map((e) => e.key);
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, X(t[n])])) : En(t, e))
			};
		}
		if (n.length > 0 && typeof n[0] == "string") {
			let e = n;
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, X(t[n])])) : En(t, e))
			};
		}
		let r = t.rows;
		return r.length > 0 && Q(r[0]) ? Z(r) : Sn;
	}
	return null;
}
function En(e, t) {
	let n = {};
	for (let r of t) n[r] = X(e[r]);
	return n;
}
function Dn(e) {
	return Q(e) && Array.isArray(e.cells) ? Z(e.cells) : null;
}
function On(e) {
	return Q(e) && Array.isArray(e.slices) ? Z(e.slices) : null;
}
function kn(e) {
	return Q(e) && Array.isArray(e.events) ? Z(e.events) : null;
}
function An(e) {
	return Q(e) && Array.isArray(e.items) ? Z(e.items) : null;
}
function jn(e) {
	if (!Q(e) || !Array.isArray(e.messages)) return null;
	let t = e.id ?? e.conversation_id ?? e.conversationId;
	return Z(e.messages.filter(Q).map((e) => ({
		conversation_id: t,
		id: e.id ?? e.message_id ?? e.messageId,
		timestamp: e.timestamp ?? e.created_at ?? e.createdAt,
		sender_id: e.sender_id ?? e.senderId,
		sender_name: e.sender_name ?? e.senderName ?? e.author,
		kind: e.kind ?? e.type ?? e.role,
		body: e.body ?? e.text ?? e.content,
		reply_to_id: e.reply_to_id ?? e.replyToId,
		edited: e.edited ?? e.is_edited ?? e.isEdited,
		status: e.status ?? e.delivery_status ?? e.deliveryStatus,
		attachments: e.attachments,
		reactions: e.reactions,
		thread_reply_count: e.thread_reply_count ?? e.threadReplyCount,
		metadata: e.metadata,
		context: e.context
	})));
}
function Mn(e) {
	let t = gn(e);
	return t ? Z([...t.bids.map((e) => ({
		side: "bid",
		...e
	})), ...t.asks.map((e) => ({
		side: "ask",
		...e
	}))]) : null;
}
function Nn(e) {
	return typeof e == "number" ? {
		columns: ["value"],
		rows: [{ value: e }]
	} : Q(e) && "value" in e && typeof e.value != "object" ? Z([e]) : null;
}
function Pn(e) {
	if (Q(e) && "value" in e) {
		let { value: t, min: n, max: r } = e;
		return Z([{
			value: t,
			min: n,
			max: r
		}]);
	}
	return null;
}
function Fn(e) {
	let t = nt(e);
	return t.items.length === 0 ? null : Z(t.items.map((e) => ({
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
function In(e) {
	let t = rt(e);
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
	return t.links.length > 0 && (n.links = t.links), t.actions.length > 0 && (n.actions = t.actions), Z([n]);
}
function Ln(e) {
	let t = it(e);
	return t ? Z([...t.nodes.map((e) => ({
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
function Rn(e) {
	let t = ot(e);
	return t ? t.entries.length > 0 ? Z(t.entries.map((e) => ({
		repository: t.repository,
		ref: t.ref,
		path: e.path,
		name: e.name,
		kind: e.kind,
		language: e.language,
		size_bytes: e.sizeBytes,
		updated_at: e.updatedAt
	}))) : t.file ? Z([{
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
function zn(e) {
	let t = yt(e);
	return t ? Z(t.records.map((e) => ({
		id: e.id,
		...e.values,
		created_at: e.createdAt,
		updated_at: e.updatedAt,
		revision: e.revision
	}))) : null;
}
function Bn(e) {
	let t = $t(e);
	return t ? Z(t.features.map((e) => ({
		...Object.fromEntries(Object.entries(e.properties).filter(([e]) => !e.startsWith("_mtc_"))),
		id: e.id,
		label: nn(e),
		geometry_type: e.geometry.type,
		geometry: e.geometry,
		status: e.properties._mtc_status,
		value: e.properties._mtc_value,
		context: tn(e)
	}))) : null;
}
function Vn(e) {
	let t = Ut(e);
	return t.items.length === 0 ? null : Z(t.items.map((e) => ({
		id: e.id,
		title: e.title,
		kind: e.kind,
		url: e.url,
		thumbnail_url: e.thumbnailUrl,
		description: e.description,
		captured_at: e.capturedAt,
		created_at: e.createdAt,
		content_type: e.contentType,
		width: e.width,
		height: e.height,
		duration_seconds: e.durationSeconds,
		favorite: e.favorite,
		tags: e.tags,
		collection_ids: e.collectionIds,
		metadata: e.metadata,
		context: e.context
	})));
}
var Hn = {
	timeseries: Cn,
	area_chart: Cn,
	sparkline: Cn,
	candlestick: wn,
	table: Tn,
	heatmap: Dn,
	distribution: On,
	events: kn,
	tape: kn,
	action_log: kn,
	alert_log: kn,
	text: An,
	ticker: An,
	conversation: jn,
	orderbook: Mn,
	depth_chart: Mn,
	metric: Nn,
	gauge: Pn,
	asset_catalog: Fn,
	object_view: In,
	dag: Ln,
	code_browser: Rn,
	record_grid: zn,
	record_board: zn,
	record_calendar: zn,
	record_form: zn,
	geo_map: Bn,
	media_gallery: Vn,
	SHAPE_TIMESERIES: Cn,
	SHAPE_CANDLES: wn,
	SHAPE_TABLE: Tn,
	SHAPE_METRIC: Nn,
	SHAPE_GAUGE: Pn,
	SHAPE_HEATMAP: Dn,
	SHAPE_EVENTS: kn,
	SHAPE_DISTRIBUTION: On,
	SHAPE_TEXT: An,
	SHAPE_CONVERSATION: jn,
	SHAPE_ORDERBOOK: Mn,
	SHAPE_ASSET_CATALOG: Fn,
	SHAPE_OBJECT: In,
	SHAPE_GRAPH: Ln,
	SHAPE_REPOSITORY: Rn,
	SHAPE_RECORD_SET: zn,
	SHAPE_GEO: Bn,
	SHAPE_MEDIA: Vn
};
function Un(e) {
	if (e == null) return Sn;
	if (Array.isArray(e)) return e.length === 0 ? Sn : Q(e[0]) ? Z(e) : {
		columns: ["value"],
		rows: e.map((e) => ({ value: X(e) }))
	};
	if (Q(e)) {
		let t = Object.entries(e).find(([, e]) => Array.isArray(e));
		return t && Q(t[1][0]) ? Z(t[1]) : Z([e]);
	}
	return {
		columns: ["value"],
		rows: [{ value: X(e) }]
	};
}
function Wn(e, t) {
	if (e == null) return Sn;
	if (t) {
		let n = Hn[t];
		if (n) {
			let t = n(e);
			if (t) return t;
		}
	}
	for (let t of [
		Cn,
		wn,
		Dn,
		On,
		kn,
		jn,
		An,
		Mn,
		Vn,
		Fn,
		In,
		Ln,
		Rn,
		zn,
		Pn,
		Nn,
		Tn
	]) {
		let n = t(e);
		if (n && n.rows.length > 0) return n;
	}
	return Un(e);
}
//#endregion
//#region src/export/serializers.ts
var Gn = {
	csv: "text/csv;charset=utf-8",
	json: "application/json;charset=utf-8",
	ndjson: "application/x-ndjson;charset=utf-8",
	parquet: "application/vnd.apache.parquet"
}, Kn = {
	csv: "csv",
	json: "json",
	ndjson: "ndjson",
	parquet: "parquet"
}, qn = [
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
function Jn(e) {
	if (e == null) return "";
	let t = String(e);
	return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function Yn(e) {
	let { columns: t, rows: n } = e;
	return [t.map(Jn).join(","), ...n.map((e) => t.map((t) => Jn(e[t])).join(","))].join("\n");
}
function Xn(e) {
	return JSON.stringify(e.rows, null, 2);
}
function Zn(e) {
	return e.rows.map((e) => JSON.stringify(e)).join("\n");
}
function Qn(e) {
	return e.columns.map((t) => ({
		name: t,
		data: e.rows.map((e) => e[t] ?? null)
	}));
}
async function $n(e) {
	let { parquetWriteBuffer: t } = await import("./src-CjPDjqyY.js"), n = t({ columnData: e.columns.length > 0 ? Qn(e) : [{
		name: "value",
		data: []
	}] });
	return new Uint8Array(n);
}
function er(e, t) {
	switch (t) {
		case "csv": return Yn(e);
		case "json": return Xn(e);
		case "ndjson": return Zn(e);
	}
}
//#endregion
//#region src/export/exportView.ts
function tr(e) {
	return e.table ?? Wn(e.data, e.component);
}
async function nr(e, t) {
	let n = tr(e);
	if (t === "parquet") {
		let e = await $n(n);
		return new Blob([e.slice().buffer], { type: Gn.parquet });
	}
	let r = er(n, t);
	return new Blob([r], { type: Gn[t] });
}
function rr(e) {
	return tr(e).rows.length;
}
function ir(e, t) {
	return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${Kn[t]}`;
}
async function ar(e, t, n) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return !1;
	let r = await nr(e, t), i = URL.createObjectURL(r), a = document.createElement("a");
	return a.href = i, a.download = ir(n, t), document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 0), !0;
}
//#endregion
//#region src/widgets/WidgetShell.tsx
function or(e, t) {
	if (!t) return null;
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "just now";
	if (n < 60) return `${n}s ago`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function sr(e) {
	let { resolution: t, loading: r, error: a, data: o, options: s, component: c, widgetId: l, Component: u, onRenderError: d, onRetry: f } = e;
	return t.error ? /* @__PURE__ */ T(i, { message: t.error }) : r ? /* @__PURE__ */ T(ce, { component: c }) : a ? /* @__PURE__ */ T(n, {
		error: a,
		onRetry: f,
		compact: !0,
		className: "h-full"
	}) : /* @__PURE__ */ T("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ T(p, {
			onError: d,
			children: /* @__PURE__ */ T(g, {
				fallback: /* @__PURE__ */ T(ce, { component: c }),
				children: /* @__PURE__ */ T(u, {
					data: o,
					options: s,
					widgetId: l
				})
			})
		})
	});
}
function cr({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: a, fullscreenId: o, setFullscreenId: s } = Ce(), [c, l] = w(!1), [u, d] = w(!1), [f, p] = w(!1), m = C(null);
	x(() => {
		if (!c) return;
		let e = (e) => {
			m.current && !m.current.contains(e.target) && (l(!1), d(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [c]);
	let h = e.source, g = h?.data !== void 0 && !h.url && !h.source_id, _ = !!h && !g, v = !!e.id, y = !!e.id && o !== e.id, b = t == null ? 0 : rr({
		data: t,
		component: e.component
	}), S = b > 0, ee = async (n) => {
		p(!0);
		try {
			let r = await ar({
				data: t,
				component: e.component
			}, n, e.title ?? e.id ?? e.component);
			i(r ? `Exported ${b.toLocaleString()} rows as ${n.toUpperCase()}` : "Export failed", r ? "ok" : "warn");
		} catch {
			i("Export failed", "error");
		} finally {
			p(!1), l(!1), d(!1);
		}
	};
	return /* @__PURE__ */ E("div", {
		className: "relative",
		ref: m,
		children: [/* @__PURE__ */ T("button", {
			onClick: () => l((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			"aria-expanded": c,
			children: "⋮"
		}), c && /* @__PURE__ */ E("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				_ && /* @__PURE__ */ T("button", {
					onClick: () => {
						n(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ T("button", {
					onClick: async () => {
						await r(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				S && /* @__PURE__ */ E("div", { children: [/* @__PURE__ */ E("button", {
					onClick: () => d((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": u,
					children: [/* @__PURE__ */ E("span", { children: ["Export", f ? "…" : ""] }), /* @__PURE__ */ T("span", {
						className: "text-zinc-600",
						children: u ? "▾" : "▸"
					})]
				}), u && /* @__PURE__ */ T("div", {
					className: "bg-zinc-950/60",
					children: qn.map((e) => /* @__PURE__ */ T("button", {
						onClick: () => ee(e.key),
						disabled: f,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				y && /* @__PURE__ */ T("button", {
					onClick: () => {
						s(e.id), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				v && /* @__PURE__ */ T("button", {
					onClick: () => {
						a([{
							targetId: e.id,
							remove: !0
						}]), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800",
					children: "Remove"
				})
			]
		})]
	});
}
function lr({ config: e, contentHeight: t, snapshotKey: n, registry: r }) {
	let { ctx: i, backendUrl: a, backendHeaders: o, refreshIntervalMs: s, compact: c, toast: l, focusedId: u, setFocusedId: d, refreshPulse: f, emit: p, soundEnabled: m, reportWidgetHealth: h, registerWidgetData: g } = Ce(), _ = S(() => e.title ? Pe(e.title, i) : e.title, [e.title, i]), v = S(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = Fe(e.source, i, a, o);
			return s && s > 0 && !t.stream ? {
				source: {
					...t,
					refreshIntervalMs: s
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
		i,
		a,
		o,
		s
	]), y = v.source, { fetch: b } = Ce(), { data: w, loading: ee, error: D, sourceError: te, lastUpdated: O, connected: k, nextRetryAt: ne, refresh: A } = se(y, { fetch: e.source?.source_id ? b : void 0 }), re = be(e.component, r), j = C(w);
	j.current = w, x(() => {
		if (n) return g(n, () => j.current);
	}, [n, g]);
	let M = !!y?.stream || !!(y?.refreshIntervalMs ?? y?.refreshInterval), ie = y?.staleAfterMs, ae = Le(M && O != null || ne != null || !!ie && O != null), N = !!ie && O != null && ae - O > ie, P = C(0);
	x(() => {
		if (!f) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = f.id === "*";
		n && t === "self" || (n || f.id === e.id) && f.n > P.current && (P.current = f.n, A());
	}, [
		f,
		e.id,
		e.refresh_policy,
		A
	]);
	let F = C(!1);
	x(() => {
		let t = e.alert;
		if (!t || w == null) {
			F.current = !1;
			return;
		}
		let n = Be(w, t.when);
		if (n && !F.current) {
			let n = Pe(t.message, i), r = t.severity ?? "warn";
			l(n, r), p({
				type: "alert",
				widgetId: e.id,
				severity: r,
				message: n,
				predicate: t.when
			}), m && Ze(r);
		}
		F.current = n;
	}, [
		w,
		e.alert,
		i,
		l,
		p,
		e.id,
		m
	]);
	let oe = C(null);
	x(() => {
		let t = v.error ?? D, n = v.error ? "resolve" : "data";
		t && t !== oe.current ? (p({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), oe.current = t) : t || (oe.current = null);
	}, [
		v.error,
		D,
		p,
		e.id,
		e.component
	]), x(() => {
		if (!e.id) return;
		let t = !!y?.stream;
		return h(e.id, {
			title: _ || e.title || e.component,
			streaming: t,
			connected: !t || k,
			error: v.error ?? D,
			stale: N
		}), () => h(e.id, null);
	}, [
		e.id,
		_,
		e.title,
		e.component,
		y?.stream,
		k,
		v.error,
		D,
		N,
		h
	]);
	let I = !!e.id && u === e.id, ce = e.id ? () => d(e.id) : void 0;
	return /* @__PURE__ */ E("div", {
		onClick: ce,
		className: "mtc-widget overflow-hidden",
		"data-focused": I ? "true" : "false",
		children: [_ && /* @__PURE__ */ E("div", {
			className: `mtc-widget-header ${c ? "px-2 py-1" : "px-3 py-1.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ T("h2", {
				className: `${c ? "text-[length:var(--mtc-font-size-md)]" : "text-[length:var(--mtc-font-size-lg)]"} font-semibold text-zinc-100 truncate`,
				children: _
			}), /* @__PURE__ */ E("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					M && O && /* @__PURE__ */ E("span", {
						className: `text-[11px] ${N ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [N ? "stale · " : "", or(ae, O)]
					}),
					e.source?.stream && !k && ne != null && /* @__PURE__ */ E("span", {
						className: "text-[11px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((ne - ae) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ T("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${k ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: k ? "Connected" : ne ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ T(cr, {
						widget: e,
						data: w,
						onToast: l,
						onRefresh: A,
						onCopy: async () => {
							if (w == null) return l("No data to copy", "warn"), !1;
							if (typeof navigator > "u" || !navigator.clipboard) return l("Clipboard unavailable", "warn"), !1;
							try {
								return await navigator.clipboard.writeText(JSON.stringify(w, null, 2)), l(`${e.title ?? e.component} copied`, "ok"), !0;
							} catch {
								return l("Clipboard blocked", "warn"), !1;
							}
						}
					})
				]
			})]
		}), /* @__PURE__ */ T("div", {
			className: c ? "p-2.5" : "p-4",
			style: { height: c ? Math.round(t * .92) : t },
			children: sr({
				resolution: v,
				loading: ee,
				error: te,
				data: w,
				options: e.options,
				component: e.component,
				widgetId: e.id,
				Component: re,
				onRenderError: (t) => p({
					type: "widget_error",
					widgetId: e.id,
					component: e.component,
					message: t.message,
					source: "render"
				}),
				onRetry: y && y.inline === void 0 && y.data === void 0 ? A : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/HoverContext.tsx
var ur = _({
	hoverTime: null,
	setHoverTime: () => {}
});
function dr() {
	return b(ur);
}
function fr({ children: e }) {
	let [t, n] = w(null), r = S(() => ({
		hoverTime: t,
		setHoverTime: n
	}), [t]);
	return /* @__PURE__ */ T(ur.Provider, {
		value: r,
		children: e
	});
}
//#endregion
//#region src/core/applyActions.ts
function pr(e, t, n) {
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
var mr = "ctx.";
function hr(e) {
	let t = {}, n = new URLSearchParams(e);
	for (let [e, r] of n) e.startsWith(mr) && (t[e.slice(4)] = r);
	return t;
}
function gr(e, t) {
	let n = new URLSearchParams(e);
	for (let e of [...n.keys()]) e.startsWith(mr) && n.delete(e);
	for (let [e, r] of Object.entries(t)) n.set(`${mr}${e}`, r);
	return n.toString();
}
//#endregion
//#region src/core/savedViews.ts
var _r = "medallion-terminal:view:";
function vr(e, t) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(_r + e, JSON.stringify(t));
	} catch {}
}
function yr(e) {
	if (!e || typeof window > "u" || !window.localStorage) return null;
	try {
		let t = window.localStorage.getItem(_r + e);
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
function br() {
	if (typeof window > "u" || !window.localStorage) return [];
	let e = [];
	for (let t = 0; t < window.localStorage.length; t++) {
		let n = window.localStorage.key(t);
		n && n.startsWith(_r) && e.push(n.slice(24));
	}
	return e.sort();
}
function xr(e) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.removeItem(_r + e);
	} catch {}
}
//#endregion
//#region src/core/CommandPalette.tsx
var Sr = /* @__PURE__ */ new Set([
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
]), Cr = 150, wr = 8;
function Tr(e, t) {
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
	} : Sr.has(n.toLowerCase()) ? {
		kind: "set",
		key: "range",
		value: n.toLowerCase()
	} : {
		kind: "set",
		key: t,
		value: n
	};
}
function Er({ suggest: e } = {}) {
	let { ctx: t, setCtx: n, toast: r } = Ce(), [i, o] = w(!1), [s, l] = w(""), [u, d] = w([]), [f, p] = w([]), m = C(0);
	x(() => {
		i || (l(""), p([]));
	}, [i]), x(() => {
		if (!e || !i) return;
		let t = s.trim();
		if (!t) {
			p([]);
			return;
		}
		let n = ++m.current, r = setTimeout(async () => {
			try {
				let r = await e(t);
				if (n !== m.current) return;
				p(r.slice(0, wr));
			} catch {
				n === m.current && p([]);
			}
		}, Cr);
		return () => clearTimeout(r);
	}, [
		s,
		i,
		e
	]);
	let h = S(() => Object.keys(t)[0] ?? "symbol", [t]), g = S(() => i ? br() : [], [i, u]), _ = (e) => {
		let i = Tr(e, h);
		if (i && i.kind !== "noop") {
			if (i.kind === "save") vr(i.name, t), r(`Saved "${i.name}"`, "ok");
			else if (i.kind === "load") {
				let e = yr(i.name);
				if (!e) r(`No view named "${i.name}"`, "warn");
				else {
					for (let [t, r] of Object.entries(e)) n(t, r);
					r(`Loaded "${i.name}"`, "ok");
				}
			} else if (i.kind === "delete") xr(i.name), r(`Deleted "${i.name}"`, "ok");
			else if (i.kind === "set") n(i.key, i.value);
			else if (i.kind === "set_many") for (let [e, t] of i.pairs) n(e, t);
			d((t) => [e, ...t.filter((t) => t !== e)].slice(0, 5));
		}
	}, v = S(() => [
		{
			id: "suggestions",
			label: "Suggestions",
			items: f.map((e, t) => ({
				id: `suggestion:${t}`,
				label: e.label,
				description: e.hint ?? Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")
			}))
		},
		{
			id: "views",
			label: "Saved views",
			items: g.map((e) => ({
				id: `view:${e}`,
				label: e,
				description: `/load ${e}`
			}))
		},
		{
			id: "recent",
			label: "Recent",
			items: u.map((e) => ({
				id: `recent:${e}`,
				label: e
			}))
		}
	], [
		f,
		g,
		u
	]), y = (e) => {
		let [t, ...r] = e.id.split(":"), i = r.join(":");
		if (t === "suggestion") {
			let e = f[Number(i)];
			if (e) for (let [t, r] of Object.entries(e.ctx)) n(t, r);
		} else t === "view" ? _(`/load ${i}`) : t === "recent" && _(i);
	}, b = Object.entries(t);
	return /* @__PURE__ */ T(c, {
		open: i,
		onOpenChange: o,
		query: s,
		onQueryChange: l,
		groups: v,
		onSelect: y,
		onSubmit: _,
		autoHighlight: !1,
		label: "Dashboard commands",
		placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
		footer: /* @__PURE__ */ E(ee, { children: [
			/* @__PURE__ */ E("span", { children: [/* @__PURE__ */ T(a, { children: "↵" }), " apply"] }),
			/* @__PURE__ */ E("span", { children: [
				/* @__PURE__ */ T(a, { children: "↑" }),
				" ",
				/* @__PURE__ */ T(a, { children: "↓" }),
				" pick"
			] }),
			/* @__PURE__ */ E("span", { children: [/* @__PURE__ */ T(a, { children: "Esc" }), " close"] }),
			b.length > 0 && /* @__PURE__ */ T("span", {
				className: "mtc-command-context",
				children: b.map(([e, t]) => `${e}=${t}`).join(" · ")
			})
		] })
	});
}
//#endregion
//#region src/core/ShortcutsOverlay.tsx
var Dr = [
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
function Or(e) {
	return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")}`;
}
function kr({ templateShortcuts: e }) {
	let [t, n] = w(!1);
	return x(() => {
		let e = (e) => {
			let t = e.target?.tagName, r = t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable;
			e.key === "?" && !r ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ T("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ E("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ E("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ T("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ T("span", {
					className: "text-[10px] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ E("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [Dr.map((e, t) => /* @__PURE__ */ E("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ T("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ T("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ E(ee, { children: [/* @__PURE__ */ T("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ E("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ T("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ T("span", {
						className: "text-xs text-zinc-400",
						children: Or(e)
					})]
				}, `tpl-${t}`))] })]
			})]
		})
	}) : null;
}
//#endregion
//#region src/core/validateTemplate.ts
var Ar = /* @__PURE__ */ new Set(/* @__PURE__ */ "timeseries.candlestick.table.metric.text.conversation.prompt.gauge.distribution.heatmap.events.catalog.asset_catalog.object_view.code_browser.record_grid.record_board.record_calendar.record_form.action_form.orderbook.depth_chart.paired_grid.trade.ticker.volume_profile.stat_strip.bar_chart.scatter.clock.treemap.image.iframe.histogram.section.area_chart.slider.select.boxplot.radar.dag.geo_map.media_gallery.multi_select.json.sparkline.action_log.alert_log.tape.file_browser".split("."));
function jr(e, t, n = {}) {
	let r = [];
	if (!e || typeof e != "object") return r.push({
		path: "",
		severity: "error",
		message: "template is not an object"
	}), r;
	if (!Array.isArray(e.widgets)) return r.push({
		path: "widgets",
		severity: "error",
		message: "widgets must be an array"
	}), r;
	let i = n.includeBuiltIns === !1 ? new Set(t ?? []) : t ? /* @__PURE__ */ new Set([...Ar, ...t]) : Ar;
	return e.widgets.forEach((e, t) => {
		let n = `widgets[${t}]`;
		if (!e || typeof e != "object") {
			r.push({
				path: n,
				severity: "error",
				message: "widget is not an object"
			});
			return;
		}
		if (!e.component || typeof e.component != "string" ? r.push({
			path: `${n}.component`,
			severity: "error",
			message: "missing component"
		}) : i.has(e.component) || r.push({
			path: `${n}.component`,
			severity: "warn",
			message: `unknown component "${e.component}" — register it in the active widget registry or fix the spelling`
		}), e.span != null && (!Number.isInteger(e.span) || e.span < 1 || e.span > 12) && r.push({
			path: `${n}.span`,
			severity: "warn",
			message: `span ${e.span} out of range 1..12`
		}), e.refresh_policy != null && e.refresh_policy !== "global" && e.refresh_policy !== "self" && e.refresh_policy !== "manual" && r.push({
			path: `${n}.refresh_policy`,
			severity: "error",
			message: `refresh_policy ${JSON.stringify(e.refresh_policy)} must be "global" | "self" | "manual"`
		}), e.source) {
			let t = e.source, i = [];
			t.source_id && i.push("source_id"), t.url && i.push("url"), (t.inline !== void 0 || t.data !== void 0) && i.push("inline"), i.length > 1 ? r.push({
				path: `${n}.source`,
				severity: "error",
				message: `multiple source modes set (${i.join(", ")}); pick one`
			}) : i.length === 0 && r.push({
				path: `${n}.source`,
				severity: "warn",
				message: "source declared but no mode (source_id / url / inline)"
			}), t.stream && (t.refreshIntervalMs ?? t.refreshInterval) && r.push({
				path: `${n}.source`,
				severity: "warn",
				message: "stream + refreshIntervalMs both set; refresh is ignored on streaming sources"
			});
		}
		if (e.component === "geo_map" && e.options) try {
			h(e.options.basemap, e.options.style_url);
		} catch (t) {
			let i = e.options.basemap == null ? "style_url" : "basemap";
			r.push({
				path: `${n}.options.${i}`,
				severity: "error",
				message: t instanceof Error ? t.message : "invalid basemap configuration"
			});
		}
		e.alert && ((typeof e.alert.when != "string" || !Ve(e.alert.when)) && r.push({
			path: `${n}.alert.when`,
			severity: "error",
			message: `alert predicate ${JSON.stringify(e.alert.when)} does not parse`
		}), (typeof e.alert.message != "string" || !e.alert.message) && r.push({
			path: `${n}.alert.message`,
			severity: "warn",
			message: "alert has no message"
		}));
	}), r;
}
//#endregion
//#region src/core/templateSecurity.ts
var Mr = "", Nr = [
	"authorization",
	"cookie",
	"proxy-authorization",
	"set-cookie",
	"x-api-key",
	"x-auth-token",
	"x-csrf-token",
	"x-xsrf-token"
], Pr = [
	"allow-downloads",
	"allow-popups-to-escape-sandbox",
	"allow-top-navigation",
	"allow-top-navigation-by-user-activation"
], $ = {
	allowRelativeUrls: !0,
	allowedUrlOrigins: [],
	allowedBasemapPresets: [],
	disallowedHeaders: Nr,
	minRefreshIntervalMs: 1e3,
	iframeSandbox: {
		disallowedTokens: Pr,
		allowScriptsWithSameOrigin: !1
	}
}, Fr = [
	"url",
	"upload_url",
	"search_url",
	"ingest_url",
	"download_url",
	"media_url_template",
	"style_url"
];
function Ir(e, t = $) {
	let n = [], r = Lr(t);
	return !e || typeof e != "object" || !Array.isArray(e.widgets) ? [{
		path: "widgets",
		severity: "error",
		message: "template.widgets must be an array"
	}] : (e.widgets.forEach((e, t) => {
		if (!e || typeof e != "object") return;
		let i = `widgets[${t}]`;
		e.source && Br(e.source, `${i}.source`, r, n), Vr(e, i, r, n), e.component === "iframe" && Ur(e, i, r, n), e.component === "image" && Wr(e, i, r, n), e.component === "media_gallery" && Gr(e, i, r, n);
	}), n);
}
function Lr(e) {
	let t = $.iframeSandbox;
	return {
		allowedUrlOrigins: Rr(e.allowedUrlOrigins ?? $.allowedUrlOrigins),
		allowedIframeOrigins: Rr(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
		allowRelativeUrls: e.allowRelativeUrls ?? $.allowRelativeUrls,
		allowedBasemapPresets: new Set(e.allowedBasemapPresets ?? $.allowedBasemapPresets),
		allowedHeaders: e.allowedHeaders ? zr(e.allowedHeaders) : void 0,
		disallowedHeaders: zr(e.disallowedHeaders ?? $.disallowedHeaders),
		minRefreshIntervalMs: e.minRefreshIntervalMs ?? $.minRefreshIntervalMs,
		maxRefreshIntervalMs: e.maxRefreshIntervalMs,
		iframeSandbox: {
			requiredTokens: [...t.requiredTokens ?? [], ...e.iframeSandbox?.requiredTokens ?? []],
			disallowedTokens: [...t.disallowedTokens ?? [], ...e.iframeSandbox?.disallowedTokens ?? []],
			allowScriptsWithSameOrigin: e.iframeSandbox?.allowScriptsWithSameOrigin ?? t.allowScriptsWithSameOrigin ?? !1
		}
	};
}
function Rr(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) try {
		t.add(new URL(n).origin);
	} catch {}
	return t;
}
function zr(e) {
	return new Set(e.map((e) => e.trim().toLowerCase()).filter(Boolean));
}
function Br(e, t, n, r) {
	typeof e.url == "string" && Xr(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Jr(e.headers, `${t}.headers`, n, r), Yr(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Vr(e, t, n, r) {
	let i = e.options;
	if (i && typeof i == "object") {
		for (let a of Fr) {
			if (e.component === "iframe" && a === "url") continue;
			let o = i[a];
			typeof o == "string" && o !== "" && Xr(o, `${t}.options.${a}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		}
		e.component === "geo_map" && i.basemap != null && Hr(i.basemap, `${t}.options.basemap`, n, r);
	}
}
function Hr(e, t, n, r) {
	let i;
	try {
		i = h(e);
	} catch {
		return;
	}
	if (i.preset) {
		i.preset !== "analytical" && !n.allowedBasemapPresets.has(i.preset) && r.push({
			path: t,
			severity: "error",
			message: `basemap preset ${JSON.stringify(i.preset)} is not allowed by host policy`
		});
		return;
	}
	if (i.kind === "style") {
		Xr(i.style_url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		return;
	}
	i.kind === "raster" && i.tiles.forEach((e, i) => {
		Xr(e, `${t}.tiles[${i}]`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
	});
}
function Ur(e, t, n, r) {
	let { url: i, sandbox: a } = Kr(e);
	i && Xr(i, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), Zr(a, `${t}.iframe.sandbox`, n, r);
}
function Wr(e, t, n, r) {
	let i = qr(e.source), a = typeof i == "string" ? i : i && typeof i == "object" && typeof i.url == "string" ? i.url : void 0;
	a && Xr(a, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
}
function Gr(e, t, n, r) {
	let i = qr(e.source);
	if (!i || typeof i != "object") return;
	let a = Array.isArray(i) ? { items: i } : i;
	(Array.isArray(a.items) ? a.items : Array.isArray(a.media) ? a.media : Array.isArray(a.assets) ? a.assets : []).forEach((e, i) => {
		if (!e || typeof e != "object" || Array.isArray(e)) return;
		let a = e;
		for (let e of [
			"url",
			"mediaUrl",
			"media_url",
			"src",
			"thumbnailUrl",
			"thumbnail_url",
			"thumbnail",
			"posterUrl",
			"poster_url",
			"poster"
		]) {
			let o = a[e];
			typeof o == "string" && o && Xr(o, `${t}.media.items[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
		}
	}), (Array.isArray(a.collections) ? a.collections : Array.isArray(a.albums) ? a.albums : []).forEach((e, i) => {
		if (!e || typeof e != "object" || Array.isArray(e)) return;
		let a = e;
		for (let e of [
			"coverUrl",
			"cover_url",
			"thumbnailUrl",
			"thumbnail_url"
		]) {
			let o = a[e];
			typeof o == "string" && o && Xr(o, `${t}.media.collections[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
		}
	});
}
function Kr(e) {
	let t = e.options, n = qr(e.source), r, i = "";
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
function qr(e) {
	return e?.inline ?? e?.data;
}
function Jr(e, t, n, r) {
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
function Yr(e, t, n, r) {
	if (e != null && e !== 0) {
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
function Xr(e, t, n, r, i) {
	let a = e.trim();
	if (!a) {
		i.push({
			path: t,
			severity: "error",
			message: "URL must be non-empty"
		});
		return;
	}
	if (Qr(a)) {
		if ($r(a)) {
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
	if (ei(a).includes("${")) {
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
function Zr(e, t, n, r) {
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
function Qr(e) {
	return !e.startsWith("//") && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function $r(e) {
	let t = e.indexOf("${");
	if (t === -1) return !1;
	let n = e.slice(0, t);
	return !/[/?#]/.test(n) || /^\/+$/.test(n);
}
function ei(e) {
	if (e.startsWith("//")) {
		let t = e.slice(2).search(/[/?#]/);
		return t === -1 ? e : e.slice(0, t + 2);
	}
	let t = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/);
	return t ? t[0] : "";
}
//#endregion
//#region src/core/snapshot.ts
function ti(e, t) {
	return e.id || `__mt_idx_${t}`;
}
function ni(e) {
	let t = e?.widgets;
	return !Array.isArray(t) || t.length === 0 ? !1 : t.every((e) => {
		let t = e.source;
		if (!t) return !0;
		let n = t.inline !== void 0 || t.data !== void 0, r = !!(t.source_id || t.url);
		return n || !r;
	});
}
function ri(e, t, n, r, i) {
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
var ii = {
	metric: 120,
	timeseries: 300,
	candlestick: 400,
	table: 350,
	text: 350,
	conversation: 460,
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
	action_form: 460,
	orderbook: 380,
	depth_chart: 340,
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
	geo_map: 460,
	media_gallery: 560,
	multi_select: 100,
	json: 360,
	sparkline: 60,
	action_log: 320,
	alert_log: 320,
	tape: 320,
	file_browser: 520
}, ai = [
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
], oi = 200, si = 200, ci = 3500, li = {
	ok: "success",
	warn: "warning",
	error: "danger",
	info: "info"
};
function ui({ value: e, onChange: t }) {
	return /* @__PURE__ */ T("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: ai.map((n) => {
			let r = e.toLowerCase() === n;
			return /* @__PURE__ */ T("button", {
				onClick: () => t(n),
				className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				children: n
			}, n);
		})
	});
}
var di = [
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
function fi({ value: e, onChange: t }) {
	return /* @__PURE__ */ T("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: di.map((n) => {
			let r = e === n.ms;
			return /* @__PURE__ */ T("button", {
				onClick: () => t(n.ms),
				className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
				children: n.label
			}, n.label);
		})
	});
}
function pi() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ E("button", {
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
function mi(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}
function hi(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function gi() {
	let { recentActions: e, widgetHealth: t } = Ce(), n = Le(!0), r = e[0], i = Object.values(t), a = i.filter((e) => e.streaming), o = a.filter((e) => e.connected && !e.error).length, s = i.filter((e) => e.error).length, c = i.filter((e) => e.stale).length, l = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ E("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ T("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ E("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ T("span", {
							className: "tabular-nums w-7 shrink-0",
							children: hi(n, r.receivedAt)
						}),
						/* @__PURE__ */ T("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ T("span", {
							className: `uppercase tracking-wider shrink-0 ${l}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ T("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ T("span", {
					className: "text-zinc-500",
					children: "idle"
				})
			}),
			a.length > 0 && /* @__PURE__ */ E("span", {
				className: o === a.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${o} of ${a.length} streams connected`,
				children: [
					/* @__PURE__ */ E("span", {
						className: "tabular-nums",
						children: [
							o,
							"/",
							a.length
						]
					}),
					" ",
					/* @__PURE__ */ T("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			c > 0 && /* @__PURE__ */ E("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${c} widget(s) without recent updates`,
				children: [c, " stale"]
			}),
			s > 0 && /* @__PURE__ */ E("span", {
				className: "text-red-400 tabular-nums",
				children: [s, " err"]
			}),
			/* @__PURE__ */ T("span", {
				className: "tabular-nums text-zinc-300",
				children: mi(n)
			})
		]
	});
}
function _i({ health: e }) {
	let t = Object.values(e);
	if (t.length === 0) return null;
	let n = t.filter((e) => e.streaming), r = n.filter((e) => e.connected && !e.error).length, i = t.filter((e) => e.error);
	if (n.length === 0 && i.length === 0) return null;
	let a = i.map((e) => e.title).join("\n");
	return /* @__PURE__ */ E("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider",
		children: [n.length > 0 && /* @__PURE__ */ E("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ E("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ T("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ E("span", {
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
function vi({ onClick: e }) {
	return /* @__PURE__ */ T("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function yi({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ E("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function bi({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ T("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to standard density" : "Switch to compact density",
		children: e ? "Standard" : "Compact"
	});
}
function xi({ onCopied: e }) {
	return /* @__PURE__ */ T("button", {
		onClick: async () => {
			if (typeof navigator < "u" && navigator.clipboard) try {
				await navigator.clipboard.writeText(window.location.href), e();
			} catch {}
		},
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Copy current dashboard URL",
		children: "Copy link"
	});
}
function Si({ onClick: e, busy: t }) {
	return /* @__PURE__ */ T("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function Ci({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ E("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ T("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ E("span", {
				className: "text-zinc-600 normal-case tracking-normal",
				children: ["· ", n]
			}) : null
		]
	});
}
function wi(e) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
	let t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
var Ti = {};
function Ei({ template: n, backendUrl: r, backendHeaders: i = Ti, fetch: a, onEvent: o, onIntent: c, onCtxChange: l, paletteSuggest: u, chrome: d = "full", onShare: f, theme: p, templateTrust: h = "untrusted", templateTrustPolicy: g = $, resolveAssetIntent: _, assetRenderers: v, assetApplicationFrame: b, saveAssetOpenPreference: D, onAssetOpenError: O, registry: k }) {
	let ne = e(), A = p ?? ne?.theme ?? "dark", re = te(), j = n.columns || 12, [M, ie] = w(n.widgets), ae = k ? [...k.keys()].sort().join("\0") : "", N = S(() => jr(n, k?.keys(), { includeBuiltIns: k == null }), [
		n,
		k,
		ae
	]), P = S(() => h === "trusted" ? [] : Ir(n, g), [
		n,
		h,
		g
	]), F = S(() => [...N, ...P], [N, P]), oe = S(() => F.some((e) => e.severity === "error"), [F]), se = S(() => P.some((e) => e.severity === "error"), [P]), I = S(() => !!n.frozenAt || ni(n), [n]), [ce, le] = w(!1), [L, ue] = w(() => {
		let e = n.context?.values ?? {};
		return typeof window > "u" ? e : {
			...e,
			...hr(window.location.search)
		};
	}), [de, fe] = w(null), [R, pe] = w(!1), [me, he] = w(!1), [ge, z] = w(!1);
	x(() => {
		fe(ji("refreshIntervalMs", null)), pe(ji("compact", !1)), he(ji("soundEnabled", !1)), z(!0);
	}, []), x(() => {
		ge && Mi("refreshIntervalMs", de);
	}, [ge, de]), x(() => {
		ge && Mi("compact", R);
	}, [ge, R]), x(() => {
		ge && Mi("soundEnabled", me);
	}, [ge, me]);
	let [B, _e] = w(null), [V, ve] = w(null), [ye, be] = w(null), [xe, Ce] = w([]), [we, Te] = w(!1), Ee = C(0), De = C(!1), Oe = y((e) => {
		be((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), ke = C(o);
	x(() => {
		ke.current = o;
	}, [o]);
	let Ae = C(c);
	x(() => {
		Ae.current = c;
	}, [c]);
	let je = y((e) => {
		Ae.current?.(e);
	}, []), [Me, Ne] = w([]), Fe = y(() => Ne([]), []), [Ie, Le] = w([]), ze = y(() => Le([]), []), [Be, Ve] = w({}), He = y((e, t) => {
		Ve((n) => {
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
	}, []), Ue = C(/* @__PURE__ */ new Map()), We = y((e, t) => (Ue.current.set(e, t), () => {
		Ue.current.get(e) === t && Ue.current.delete(e);
	}), []), Ge = C({
		widgets: M,
		ctx: L,
		template: n
	});
	Ge.current = {
		widgets: M,
		ctx: L,
		template: n
	};
	let Ke = y(() => {
		let { widgets: e, ctx: t, template: n } = Ge.current;
		return ri(n, e, t, (e, t) => {
			let n = Ue.current.get(ti(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), qe = y((e) => {
		ke.current?.(e), e.type === "action" ? Ne((t) => [{
			receivedAt: Date.now(),
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}, ...t].slice(0, oi)) : e.type === "alert" && Le((t) => [{
			receivedAt: Date.now(),
			widgetId: e.widgetId,
			severity: e.severity,
			message: e.message,
			predicate: e.predicate
		}, ...t].slice(0, si));
	}, []), H = y((e, t = "info") => {
		Ee.current += 1;
		let n = Ee.current;
		Ce((r) => [...r, {
			id: n,
			title: e,
			intent: li[t],
			duration: ci
		}].slice(-4));
	}, []), Je = y(async () => {
		if (!De.current) {
			De.current = !0, Te(!0);
			try {
				let e = Ke();
				f ? await f(e) : wi(e), H(f ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				H(`Snapshot failed: ${t}`, "error");
			} finally {
				De.current = !1, Te(!1);
			}
		}
	}, [
		f,
		Ke,
		H
	]), Ye = y((e) => {
		Ce((t) => t.filter((t) => t.id !== e));
	}, []), U = y((e, t) => {
		ue((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	x(() => {
		if (typeof window > "u") return;
		let e = gr(window.location.search, L), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [L]);
	let Xe = C(l);
	x(() => {
		Xe.current = l;
	}, [l]), x(() => {
		Xe.current?.(L);
	}, [L]);
	let Ze = y((e, t) => {
		ie((n) => pr(n, e, t));
	}, []), W = (e) => re === "mobile" ? j : re === "tablet" ? Math.min(e, Math.floor(j / 2)) : Math.min(e, j), G = S(() => ({
		dispatch: Ze,
		ctx: L,
		setCtx: U,
		backendUrl: r,
		backendHeaders: i,
		fetch: a,
		widgets: M,
		refreshIntervalMs: de ?? void 0,
		toast: H,
		compact: R,
		fullscreenId: B,
		setFullscreenId: _e,
		focusedId: V,
		setFocusedId: ve,
		refreshPulse: ye,
		requestRefresh: Oe,
		emit: qe,
		emitIntent: je,
		recentActions: Me,
		clearRecentActions: Fe,
		recentAlerts: Ie,
		clearRecentAlerts: ze,
		soundEnabled: me,
		widgetHealth: Be,
		reportWidgetHealth: He,
		registerWidgetData: We,
		snapshot: Ke
	}), [
		Ze,
		L,
		U,
		r,
		i,
		a,
		M,
		de,
		H,
		R,
		B,
		V,
		ye,
		Oe,
		qe,
		je,
		Me,
		Fe,
		Ie,
		ze,
		me,
		Be,
		He,
		We,
		Ke
	]), Qe = y((e, t) => {
		H(`Could not ${t.intent} ${t.asset.name}: ${e.message}`, "error"), O?.(e, t);
	}, [O, H]);
	x(() => {
		if (!B) return;
		let e = (e) => {
			e.key === "Escape" && _e(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [B]), x(() => {
		V && typeof document < "u" && document.getElementById(`mt-widget-${V}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [V]), x(() => {
		let e = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			let t = e.target?.tagName;
			if (t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable) return;
			let r = n.shortcuts?.find((t) => t.key === e.key);
			if (r) {
				e.preventDefault();
				for (let [e, t] of Object.entries(r.ctx)) U(e, t);
				return;
			}
			let i = M.map((e) => e.id).filter((e) => !!e);
			if (i.length === 0) return;
			let a = (e) => {
				let t = V ? i.indexOf(V) : -1, n = i[(t + e + i.length) % i.length];
				ve(n);
			};
			switch (e.key) {
				case "j":
				case "ArrowDown":
					e.preventDefault(), a(1);
					break;
				case "k":
				case "ArrowUp":
					e.preventDefault(), a(-1);
					break;
				case "f":
					V && (e.preventDefault(), _e(V));
					break;
				case "r":
					V && (e.preventDefault(), Oe(V));
					break;
				case "Escape": V && ve(null);
			}
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		M,
		V,
		Oe,
		n.shortcuts,
		U
	]);
	let $e = !se && B ? M.find((e) => e.id === B) : null;
	return /* @__PURE__ */ T(Se.Provider, {
		value: G,
		children: /* @__PURE__ */ T("div", {
			className: `mtc-root mtc-theme-${A}`,
			"data-theme": A,
			"data-density": R ? "compact" : "standard",
			children: /* @__PURE__ */ T(t, {
				theme: A,
				density: R ? "compact" : "standard",
				children: /* @__PURE__ */ T(m, {
					resolveAssetIntent: _,
					renderers: v,
					applicationFrame: b,
					savePreference: D,
					onError: Qe,
					children: /* @__PURE__ */ T(Re, { children: /* @__PURE__ */ E(fr, { children: [
						/* @__PURE__ */ T(Er, { suggest: u }),
						/* @__PURE__ */ T(kr, { templateShortcuts: n.shortcuts }),
						/* @__PURE__ */ T(s, {
							toasts: xe,
							onDismiss: Ye
						}),
						F.length > 0 && (!ce || oe) && /* @__PURE__ */ T(Di, {
							issues: F,
							dismissible: !oe,
							onDismiss: () => le(!0)
						}),
						/* @__PURE__ */ E("div", {
							className: "mtc-workspace min-h-full flex flex-col",
							children: [/* @__PURE__ */ E("div", {
								className: "flex-1",
								children: [(n.title || d === "full") && /* @__PURE__ */ E("div", {
									className: "mtc-toolbar",
									children: [/* @__PURE__ */ E("div", {
										className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
										children: [n.title && /* @__PURE__ */ T("h1", {
											className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
											children: Pe(n.title, L)
										}), d === "full" && /* @__PURE__ */ E("div", {
											className: "ml-auto flex items-center gap-2 flex-wrap",
											children: [
												I ? /* @__PURE__ */ T(Ci, { frozenAt: n.frozenAt }) : /* @__PURE__ */ E(ee, { children: [
													/* @__PURE__ */ T(_i, { health: Be }),
													/* @__PURE__ */ T(fi, {
														value: de,
														onChange: fe
													}),
													/* @__PURE__ */ T(vi, { onClick: () => Oe("*") })
												] }),
												/* @__PURE__ */ T(yi, {
													enabled: me,
													onToggle: () => he((e) => !e)
												}),
												/* @__PURE__ */ T(bi, {
													compact: R,
													onToggle: () => pe((e) => !e)
												}),
												!I && /* @__PURE__ */ T(Si, {
													onClick: () => void Je(),
													busy: we
												}),
												/* @__PURE__ */ T(xi, { onCopied: () => H("URL copied", "ok") }),
												/* @__PURE__ */ T(pi, {})
											]
										})]
									}), d === "full" && Object.keys(L).length > 0 && /* @__PURE__ */ E("div", {
										className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ T("span", {
											className: "text-[9px] uppercase tracking-[0.14em] text-zinc-500 mr-1",
											children: "Context"
										}), Object.entries(L).map(([e, t]) => e === "range" ? /* @__PURE__ */ T(ui, {
											value: t,
											onChange: (t) => U(e, t)
										}, e) : /* @__PURE__ */ E("div", {
											className: "mtc-context-chip px-2 py-1 text-[11px]",
											children: [/* @__PURE__ */ T("span", {
												className: "text-zinc-500 uppercase tracking-wider mr-1",
												children: e
											}), /* @__PURE__ */ T("span", {
												className: "text-zinc-100 font-mono",
												children: t
											})]
										}, e))]
									})]
								}), /* @__PURE__ */ T("div", {
									className: "p-3 md:p-5",
									children: /* @__PURE__ */ T("div", {
										className: "grid gap-3 md:gap-4 items-start",
										style: { gridTemplateColumns: `repeat(${j}, 1fr)` },
										children: se ? /* @__PURE__ */ T(Oi, { issues: P }) : M.map((e, t) => /* @__PURE__ */ T("div", {
											id: e.id ? `mt-widget-${e.id}` : void 0,
											style: { gridColumn: `span ${W(e.span || 6)}` },
											children: /* @__PURE__ */ T(lr, {
												config: e,
												contentHeight: e.height || ii[e.component] || 280,
												snapshotKey: ti(e, t),
												registry: k
											})
										}, e.id || t))
									})
								})]
							}), d === "full" && /* @__PURE__ */ T(gi, {})]
						}),
						$e && /* @__PURE__ */ T(ki, {
							widget: $e,
							registry: k,
							onClose: () => _e(null)
						})
					] }) })
				})
			})
		})
	});
}
function Di({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ E("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ E("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ E("div", {
				className: "font-medium uppercase tracking-wider text-[10px] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ E("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ E("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ T("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ T("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ T("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ E("li", {
					className: "opacity-60 text-[10px]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ T("button", {
			onClick: n,
			className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function Oi({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ E("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ T("div", {
				className: "font-medium text-xs uppercase tracking-wider mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ T("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ E("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ E("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ T("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ T("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ T("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ E("li", {
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
function ki({ widget: e, registry: t, onClose: n }) {
	let r = typeof window < "u" ? Math.floor(window.innerHeight * .82) : 600;
	return /* @__PURE__ */ E("div", {
		className: "fixed inset-0 z-30 bg-zinc-950 p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: n,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Fullscreen ${e.title ?? e.id ?? e.component}`,
		children: [/* @__PURE__ */ E("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ T("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ T("button", {
				onClick: n,
				autoFocus: !0,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ T("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ T(lr, {
				config: e,
				contentHeight: r,
				registry: t
			})
		})]
	});
}
var Ai = "medallion-terminal:";
function ji(e, t) {
	if (typeof window > "u" || !window.localStorage) return t;
	try {
		let n = window.localStorage.getItem(Ai + e);
		return n == null ? t : JSON.parse(n);
	} catch {
		return t;
	}
}
function Mi(e, t) {
	if (typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(Ai + e, JSON.stringify(t));
	} catch {}
}
//#endregion
//#region src/core/MultiDashboard.tsx
function Ni(e, t) {
	x(() => {
		let n = (n) => {
			if (!(n.metaKey || n.ctrlKey)) return;
			let r = Number(n.key);
			Number.isFinite(r) && r >= 1 && r <= 9 && r <= e && (n.preventDefault(), t(r - 1));
		};
		return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
	}, [e, t]);
}
function Pi({ tabs: n, activeIndex: r, onSelect: i, backendUrl: a, backendHeaders: o, fetch: s, theme: c, templateTrust: l, templateTrustPolicy: u, resolveAssetIntent: d, assetRenderers: f, assetApplicationFrame: p, saveAssetOpenPreference: m, onAssetOpenError: h, onIntent: g, registry: _ }) {
	let v = e(), y = c ?? v?.theme ?? "dark", b = Math.max(0, Math.min(r, n.length - 1));
	Ni(n.length, i);
	let [S, C] = w(() => /* @__PURE__ */ new Set([b]));
	return x(() => {
		C((e) => e.has(b) ? e : /* @__PURE__ */ new Set([...e, b]));
	}, [b]), n.length === 0 ? null : /* @__PURE__ */ T("div", {
		className: `mtc-root mtc-theme-${y}`,
		"data-theme": y,
		children: /* @__PURE__ */ T(t, {
			theme: y,
			density: v?.density ?? "standard",
			children: /* @__PURE__ */ E("div", {
				className: "mtc-workspace min-h-full",
				children: [/* @__PURE__ */ T(Fi, {
					tabs: n,
					activeIndex: b,
					onSelect: i
				}), n.map((e, t) => /* @__PURE__ */ T("div", {
					style: { display: t === b ? "block" : "none" },
					children: S.has(t) && /* @__PURE__ */ T(Ei, {
						template: e.template,
						backendUrl: a,
						backendHeaders: o,
						fetch: s,
						theme: y,
						templateTrust: l,
						templateTrustPolicy: u,
						resolveAssetIntent: d,
						assetRenderers: f,
						assetApplicationFrame: p,
						saveAssetOpenPreference: m,
						onAssetOpenError: h,
						onIntent: g,
						registry: _
					})
				}, t))]
			})
		})
	});
}
function Fi({ tabs: e, activeIndex: t, onSelect: n }) {
	let r = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ T("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ E("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ T("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ T("span", {
					className: "text-[9px] text-zinc-500 font-mono uppercase tracking-wider",
					children: o
				})]
			}, i);
		})
	});
}
function Ii(e = 0) {
	let [t, n] = w(() => {
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
export { At as $, qn as A, _e as At, _n as B, ne as Bt, fr as C, De as Ct, ir as D, Fe as Dt, ar as E, je as Et, Yn as F, le as Ft, $t as G, en as H, Xn as I, ce as It, qt as J, Gt as K, Zn as L, se as Lt, Gn as M, be as Mt, Jn as N, xe as Nt, nr as O, Se as Ot, er as P, ge as Pt, Wt as Q, $n as R, A as Rt, ur as S, Te as St, lr as T, Pe as Tt, tn as U, gn as V, te as Vt, nn as W, Ut as X, Kt as Y, Rt as Z, yr as _, Re as _t, ni as a, Ot as at, gr as b, Ae as bt, Pr as c, Ct as ct, Ir as d, it as dt, St as et, Ar as f, rt as ft, br as g, Ie as gt, xr as h, Be as ht, ri as i, yt as it, Kn as j, ve as jt, rr as k, Ce as kt, Nr as l, wt as lt, kr as m, Ve as mt, Ii as n, xt as nt, ti as o, Tt as ot, jr as p, ot as pt, Jt as q, Ei as r, bt as rt, Mr as s, kt as st, Pi as t, jt as tt, $ as u, nt as ut, vr as v, Le as vt, dr as w, Oe as wt, pr as x, Ee as xt, hr as y, ke as yt, Wn as z, O as zt };
