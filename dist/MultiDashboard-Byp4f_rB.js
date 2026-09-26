import { C as e, S as t, l as n, n as r, r as i } from "./States-Ds3cxTem.js";
import { _ as a, c as o, f as s, m as c, n as l, s as u, t as d, u as f } from "./sourceError-BwpI_4dr.js";
import { c as p, t as m } from "./AssetOpen-B2zlxvNf.js";
import { o as h } from "./basemaps-BjEaZSH5.js";
import { Suspense as g, createContext as _, lazy as v, useCallback as y, useContext as b, useEffect as x, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
//#region src/hooks/useBreakpoint.ts
function ee() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function O() {
	let [e, t] = w(ee);
	return x(() => {
		let e = () => t(ee());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e;
}
//#endregion
//#region src/core/connectFraming.ts
var k = "application/connect+json", A = new TextDecoder();
async function te(e, t) {
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
					e.length > 0 && (a = JSON.parse(A.decode(e)));
				} catch {}
				t.isDisposed() || t.onTrailer?.(a);
				return;
			}
			let a = n.subarray(r + 5, r + 5 + i);
			r += 5 + i;
			try {
				let e = JSON.parse(A.decode(a));
				t.isDisposed() || t.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
//#region src/core/getNested.ts
function j(e, t) {
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
function ne(e) {
	return e.inline ?? e.data;
}
function re(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function M(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function ie(e) {
	e.signal.aborted || e.abort();
}
var ae = 3e4, N = 1e3;
function oe(e, t) {
	return t ? j(e, t) : e;
}
var P = /* @__PURE__ */ new Set([
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
function se(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = Object.keys(e);
	return t.length === 1 && P.has(t[0]) ? e[t[0]] : e;
}
function F(e, t = {}) {
	let n = t.fetch, [r, i] = w(null), [a, s] = w(!0), [c, l] = w(null), [p, m] = w(null), [h, g] = w(!1), [_, v] = w(null), [b, T] = w(0), E = y(() => T((e) => e + 1), []), D = C(N), ee = C(void 0), O = C(null), A = C(void 0), j = C(0), P = y((t) => {
		let n = oe(se(t), e?.transform);
		i(n), l(null), s(!1), m(Date.now()), j.current = Date.now();
	}, [e?.transform]), F = y((t) => {
		let n = e?.throttleMs ?? 0;
		if (n <= 0) {
			P(t);
			return;
		}
		let r = Date.now() - j.current;
		if (r >= n) {
			P(t);
			return;
		}
		O.current = t, A.current ||= setTimeout(() => {
			O.current !== null && P(O.current), O.current = null, A.current = void 0;
		}, n - r);
	}, [P, e?.throttleMs]), ce = S(() => e ? JSON.stringify([
		e.url,
		e.source_id,
		e.method,
		e.body,
		e.headers,
		e.stream,
		re(e),
		e.transform,
		e.throttleMs,
		e.inline !== void 0 || e.data !== void 0
	]) : "", [e]), le = e ? ne(e) : void 0;
	return x(() => {
		if (!e) {
			s(!1);
			return;
		}
		if (le !== void 0) {
			F(le);
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
							"Content-Type": k
						},
						body: JSON.stringify(e.body ?? {}),
						signal: r.signal
					});
					if (!i.ok) throw await u(i);
					if (!i.body) throw new d("Stream response has no body", { kind: "unavailable" });
					g(!0), v(null), l(null), D.current = N;
					let a = i.body.getReader();
					await te(a, {
						onMessage: F,
						onTrailer: (e) => {
							if (e.error) {
								let n = e.error.code ?? "unknown", r = e.error.message ?? "stream error";
								t || l(new d(r, {
									kind: o(n),
									code: n
								}));
							}
						},
						isDisposed: () => t
					}), a.releaseLock();
				} catch (e) {
					!t && e instanceof Error && !M(e) && l(f(e));
				} finally {
					if (!t) {
						g(!1);
						let e = D.current;
						v(Date.now() + e), ee.current = setTimeout(() => {
							D.current = Math.min(D.current * 2, ae), i();
						}, e);
					}
				}
			};
			return i(), () => {
				t = !0, ie(r), clearTimeout(ee.current), g(!1), v(null);
			};
		}
		if (e.stream === !0) {
			let t = null, n = !1, r = () => {
				n || (t = new EventSource(e.url), t.onopen = () => {
					g(!0), v(null), l(null), D.current = N;
				}, t.onmessage = (e) => {
					try {
						F(JSON.parse(e.data));
					} catch {
						l(new d("Failed to parse stream", { kind: "unknown" }));
					}
				}, t.onerror = () => {
					if (t?.close(), g(!1), !n) {
						let e = D.current;
						v(Date.now() + e), ee.current = setTimeout(() => {
							D.current = Math.min(D.current * 2, ae), r();
						}, e);
					}
				});
			};
			return r(), () => {
				n = !0, clearTimeout(ee.current), t?.close(), g(!1), v(null);
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
					t || F(a);
				} catch (e) {
					!t && e instanceof Error && !M(e) && l(f(e));
				} finally {
					r = !1, t || s(!1);
				}
			}
		};
		a();
		let c, p = re(e);
		return p && p > 0 && (c = setInterval(() => void a(), p)), () => {
			t = !0, ie(i), c && clearInterval(c);
		};
	}, [
		ce,
		F,
		le,
		b,
		n
	]), x(() => () => {
		A.current && clearTimeout(A.current);
	}, []), {
		data: r,
		loading: a,
		sourceError: c,
		lastUpdated: p,
		connected: h,
		nextRetryAt: _,
		refresh: E
	};
}
//#endregion
//#region src/widgets/states.tsx
var ce = {
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
function le({ component: e }) {
	switch (e ? ce[e] : "block") {
		case "chart": return /* @__PURE__ */ E(de, {});
		case "table": return /* @__PURE__ */ E(fe, {});
		case "list": return /* @__PURE__ */ E(pe, {});
		case "single": return /* @__PURE__ */ E(L, {});
		case "donut": return /* @__PURE__ */ E(me, {});
		case "grid": return /* @__PURE__ */ E(he, {});
		default: return /* @__PURE__ */ E(ge, {});
	}
}
function ue({ children: e, padded: t }) {
	return /* @__PURE__ */ E(r, {
		title: e,
		compact: !0,
		icon: /* @__PURE__ */ E("span", {
			className: "text-xs leading-none",
			children: "· ·  ·"
		}),
		className: `h-full${t ? " px-4" : ""}`
	});
}
var I = [
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
function de() {
	return /* @__PURE__ */ E("div", {
		className: "h-full flex items-end gap-1",
		children: I.map((e, t) => /* @__PURE__ */ E("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${e}%`,
				animationDelay: `${t * 40}ms`
			}
		}, t))
	});
}
function fe() {
	let e = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ D("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ E("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: e.map((e, t) => /* @__PURE__ */ E("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: e }
			}, t))
		}), Array.from({ length: 5 }).map((t, n) => /* @__PURE__ */ E("div", {
			className: "flex gap-4",
			children: e.map((e, t) => /* @__PURE__ */ E("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: e,
					animationDelay: `${(n * 3 + t) * 50}ms`
				}
			}, t))
		}, n))]
	});
}
function pe() {
	return /* @__PURE__ */ E("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ D("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ E("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ D("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ E("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + t * 11 % 30}%`,
						animationDelay: `${t * 80}ms`
					}
				}), /* @__PURE__ */ E("div", {
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
function L() {
	return /* @__PURE__ */ D("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ E("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ E("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function me() {
	return /* @__PURE__ */ D("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ E("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ E("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ E("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ E("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ D("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ E("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ E("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${t * 60}ms` }
				})]
			}, t))
		})]
	});
}
function he() {
	return /* @__PURE__ */ E("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ E("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${t * 25}ms` }
		}, t))
	});
}
function ge() {
	return /* @__PURE__ */ E("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
//#region src/widgets/Placeholder.tsx
function _e(e) {
	return /* @__PURE__ */ E(ue, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var R = (e, t) => v(() => e().then((e) => ({ default: e[t] }))), z = /* @__PURE__ */ new Map([
	["timeseries", R(() => import("./Timeseries-DDoqBbm2.js").then((e) => e.n), "Timeseries")],
	["candlestick", R(() => import("./Candlestick-RFomAk4R.js").then((e) => e.n), "Candlestick")],
	["table", R(() => import("./DataTable-C8kaxZ5m.js").then((e) => e.n), "DataTable")],
	["metric", R(() => import("./Metric-CsN3_xvB.js").then((e) => e.n), "Metric")],
	["text", R(() => import("./Text-Cef7icGA.js").then((e) => e.n), "Text")],
	["conversation", R(() => import("./ConversationImpl-D2B5g1Nh.js"), "ConversationImpl")],
	["prompt", R(() => import("./Prompt-E8rPYmIm.js").then((e) => e.n), "Prompt")],
	["gauge", R(() => import("./Gauge-CpdsXypI.js").then((e) => e.n), "Gauge")],
	["distribution", R(() => import("./Distribution-lGyEnvMO.js").then((e) => e.n), "Distribution")],
	["heatmap", R(() => import("./Heatmap-CQ9W9gZ4.js").then((e) => e.n), "Heatmap")],
	["events", R(() => import("./Events-BuCED1mo.js").then((e) => e.n), "Events")],
	["catalog", R(() => import("./Catalog-Z5W6chpV.js").then((e) => e.n), "Catalog")],
	["asset_catalog", R(() => import("./AssetCatalog-B_vMgIX8.js").then((e) => e.n), "AssetCatalog")],
	["object_view", R(() => import("./ObjectView-8EgfaSKF.js").then((e) => e.n), "ObjectView")],
	["code_browser", R(() => import("./CodeBrowser-DpEREv7R.js").then((e) => e.n), "CodeBrowser")],
	["record_grid", R(() => import("./RecordGrid-DJHma8pS.js").then((e) => e.n), "RecordGrid")],
	["record_board", R(() => import("./RecordBoard-D6obDjBz.js").then((e) => e.n), "RecordBoard")],
	["record_calendar", R(() => import("./RecordCalendar-BMxjyRcp.js").then((e) => e.n), "RecordCalendar")],
	["record_form", R(() => import("./RecordForm-72V4MKmI.js").then((e) => e.n), "RecordForm")],
	["action_form", R(() => import("./ActionForm-DyeAbe2X.js").then((e) => e.n), "ActionForm")],
	["orderbook", R(() => import("./OrderBook-BW4NO1bY.js").then((e) => e.n), "OrderBook")],
	["depth_chart", R(() => import("./DepthChart-DZV6mdH8.js").then((e) => e.n), "DepthChart")],
	["paired_grid", R(() => import("./PairedGrid-D_ItWr_Y.js").then((e) => e.n), "PairedGrid")],
	["trade", R(() => import("./Trade-BLocxtlM.js").then((e) => e.n), "Trade")],
	["ticker", R(() => import("./Ticker-Cv0G9OOi.js").then((e) => e.n), "Ticker")],
	["volume_profile", R(() => import("./VolumeProfile-Cufxbm-2.js").then((e) => e.n), "VolumeProfile")],
	["stat_strip", R(() => import("./StatStrip-D5irysew.js").then((e) => e.n), "StatStrip")],
	["bar_chart", R(() => import("./BarChart-B9JQ_mCj.js").then((e) => e.n), "BarChart")],
	["scatter", R(() => import("./Scatter-BZI9nt3U.js").then((e) => e.n), "Scatter")],
	["clock", R(() => import("./Clock-DA6Mrw0W.js").then((e) => e.n), "Clock")],
	["treemap", R(() => import("./Treemap-BYxnmsvJ.js").then((e) => e.n), "Treemap")],
	["image", R(() => import("./Image-BHh0o2OP.js").then((e) => e.n), "Image")],
	["iframe", R(() => import("./Iframe-BzKveWTm.js").then((e) => e.n), "Iframe")],
	["histogram", R(() => import("./Histogram-CpqejdDK.js").then((e) => e.n), "Histogram")],
	["section", R(() => import("./Section-CxTsBmHT.js").then((e) => e.n), "Section")],
	["area_chart", R(() => import("./AreaChart-DjM6dnJ5.js").then((e) => e.n), "AreaChart")],
	["slider", R(() => import("./Slider-DywMPJ2L.js").then((e) => e.n), "Slider")],
	["select", R(() => import("./Select-Cq9Ov-Dw.js").then((e) => e.n), "Select")],
	["boxplot", R(() => import("./Boxplot-CXkFjq7n.js").then((e) => e.n), "Boxplot")],
	["radar", R(() => import("./Radar-B9AdiaVm.js").then((e) => e.n), "Radar")],
	["dag", R(() => import("./Dag-D4BVRAT4.js").then((e) => e.n), "Dag")],
	["geo_map", R(() => import("./GeoMap-Dms9BuyA.js").then((e) => e.n), "GeoMap")],
	["media_gallery", R(() => import("./MediaGalleryImpl-DiKv-A-y.js"), "MediaGalleryImpl")],
	["multi_select", R(() => import("./MultiSelect-BlQ94qI0.js").then((e) => e.n), "MultiSelect")],
	["json", R(() => import("./Json-CRyUqvM2.js").then((e) => e.n), "Json")],
	["sparkline", R(() => import("./Sparkline-CXn1sa4A.js").then((e) => e.n), "Sparkline")],
	["action_log", R(() => import("./ActionLog-Dmq9YeAv.js").then((e) => e.n), "ActionLog")],
	["alert_log", R(() => import("./AlertLog-Clf-xavG.js").then((e) => e.n), "AlertLog")],
	["tape", R(() => import("./Tape-Cm5xvGq8.js").then((e) => e.n), "Tape")],
	["file_browser", R(() => import("./FileBrowser-BqchfZNP.js").then((e) => e.n), "FileBrowser")]
]), ve = new Set(z.keys()), B = class {
	#e;
	constructor(e = {}) {
		this.#e = e.includeBuiltIns === !1 ? /* @__PURE__ */ new Map() : new Map(z);
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
function ye(e = {}) {
	return new B(e);
}
var be = new Map(z);
function xe(e, t) {
	return (t ? t.get(e) : be.get(e)) || _e;
}
function Se(e, t) {
	be.set(e, t);
}
var Ce = _({
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
function we() {
	return b(Ce);
}
//#endregion
//#region src/core/resolveSource.ts
var Te = "medallion.terminal.v1.TerminalService";
function Ee(e) {
	return `${e.replace(/\/$/, "")}/${Te}/Generate`;
}
function De(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function Oe(e) {
	return `${e.replace(/\/$/, "")}/${Te}/SubmitAction`;
}
function ke(e) {
	return `${e.replace(/\/$/, "")}/${Te}/WatchAction`;
}
function Ae(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function je(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function Me() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var Ne = !1, Pe = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function Fe(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new Pe(r);
		return "";
	});
}
function Ie(e, t, n, r = {}) {
	if (e.source_id) {
		if (n === void 0) return Ne ||= (console.warn(`[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), e;
		let i = e.stream ? "Stream" : "Get", a = n.replace(/\/$/, ""), o = {};
		if (e.params) for (let [n, r] of Object.entries(e.params)) o[n] = Fe(r, t, { strict: !0 });
		return {
			url: `${a}/${Te}/${i}`,
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
			refreshIntervalMs: e.refreshIntervalMs ?? e.refreshInterval,
			throttleMs: e.throttleMs,
			staleAfterMs: e.staleAfterMs
		};
	}
	if (!e.url && !e.params) return e;
	let i = { ...e };
	if (e.url) {
		let n = Fe(e.url, t, { strict: !0 });
		if (e.params && Object.keys(e.params).length > 0) {
			let r = Object.entries(e.params).map(([e, n]) => `${encodeURIComponent(e)}=${encodeURIComponent(Fe(n, t, { strict: !0 }))}`).join("&");
			n = n.includes("?") ? `${n}&${r}` : `${n}?${r}`;
		}
		i.url = n;
	}
	return i;
}
//#endregion
//#region src/core/NowContext.tsx
var Le = _({
	now: 0,
	subscribe: () => () => {}
});
function Re(e = !0) {
	let { now: t, subscribe: n } = b(Le);
	return x(() => {
		if (e) return n();
	}, [e, n]), t;
}
function ze({ children: e }) {
	let [t, n] = w(() => Date.now()), r = C(0), i = C(null), a = S(() => ({
		now: t,
		subscribe: () => (r.current += 1, i.current ??= setInterval(() => n(Date.now()), 1e3), () => {
			r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
		})
	}), [t]);
	return x(() => () => {
		i.current != null && clearInterval(i.current);
	}, []), /* @__PURE__ */ E(Le.Provider, {
		value: a,
		children: e
	});
}
//#endregion
//#region src/core/alerts.ts
var Be = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Ve(e, t) {
	let n = Ue(t);
	return n ? qe(n, e) : !1;
}
function He(e) {
	return Ue(e) !== null;
}
function Ue(e) {
	let t = e.trim();
	if (!t) return null;
	let n = We(t, "||"), r = [];
	for (let e of n) {
		let t = We(e, "&&"), n = [];
		for (let e of t) {
			let t = Ge(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function We(e, t) {
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
function Ge(e) {
	let t = e.trim().match(Be);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: Ke(i.trim())
	};
}
function Ke(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function qe(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!Je(j(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function Je(e, t, n) {
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
var V = {
	warn: 720,
	error: 480
}, Ye = 160, Xe = .08, H = null;
function Ze() {
	if (typeof window > "u") return null;
	if (H) return H;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (H = new t(), H) : null;
}
function Qe(e) {
	let t = V[e];
	if (!t) return;
	let n = Ze();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime(Xe, a + .02), i.gain.linearRampToValueAtTime(0, a + Ye / 1e3), r.start(a), r.stop(a + Ye / 1e3 + .05);
}
//#endregion
//#region src/widgets/platformShapes.ts
function U(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function W(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function $e(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function et(e) {
	return U(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function tt(e) {
	return U(e) ? e : {};
}
function nt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function rt(e) {
	let t = Array.isArray(e) ? { items: e } : tt(e);
	return {
		items: (Array.isArray(t.items) ? t.items : []).filter(U).map((e) => ({
			id: String(e.id ?? ""),
			name: String(e.name ?? e.id ?? ""),
			kind: String(e.kind ?? "asset"),
			description: W(e.description),
			owner: W(e.owner),
			status: W(e.status),
			updatedAt: W(e.updatedAt ?? e.updated_at),
			tags: $e(e.tags),
			url: W(e.url),
			metadata: tt(e.metadata),
			context: et(e.context)
		})).filter((e) => e.id && e.name),
		total: nt(t.total),
		nextPageToken: W(t.nextPageToken ?? t.next_page_token)
	};
}
function it(e) {
	let t = tt(e), n = String(t.objectType ?? t.object_type ?? ""), r = String(t.objectId ?? t.object_id ?? ""), i = String(t.title ?? t.name ?? r);
	if (!n && !r && !i) return null;
	let a = (Array.isArray(t.properties) ? t.properties : []).filter(U).map((e) => ({
		key: String(e.key ?? ""),
		label: String(e.label ?? e.key ?? ""),
		value: e.value,
		format: W(e.format),
		description: W(e.description),
		group: W(e.group)
	})).filter((e) => e.key), o = (Array.isArray(t.links) ? t.links : []).filter(U).map((e) => ({
		relation: String(e.relation ?? ""),
		targetType: String(e.targetType ?? e.target_type ?? ""),
		targetId: String(e.targetId ?? e.target_id ?? ""),
		label: String(e.label ?? e.targetId ?? e.target_id ?? ""),
		status: W(e.status),
		context: et(e.context)
	})).filter((e) => e.targetId), s = (Array.isArray(t.actions) ? t.actions : []).filter(U).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		description: W(e.description),
		style: W(e.style),
		confirm: e.confirm === !0,
		params: tt(e.params),
		disabled: e.disabled === !0
	})).filter((e) => e.id);
	return {
		objectType: n,
		objectId: r,
		title: i,
		description: W(t.description),
		status: W(t.status),
		updatedAt: W(t.updatedAt ?? t.updated_at),
		tags: $e(t.tags),
		properties: a,
		links: o,
		actions: s
	};
}
function at(e) {
	let t = tt(e);
	if (!Array.isArray(t.nodes)) return null;
	let n = t.nodes.filter(U).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		kind: W(e.kind),
		status: W(e.status),
		subtitle: W(e.subtitle),
		tags: $e(e.tags),
		metadata: tt(e.metadata),
		context: et(e.context)
	})).filter((e) => e.id), r = (Array.isArray(t.edges) ? t.edges : []).filter(U).map((e) => ({
		from: String(e.from ?? ""),
		to: String(e.to ?? ""),
		label: W(e.label),
		kind: W(e.kind),
		status: W(e.status)
	})).filter((e) => e.from && e.to);
	return n.length > 0 ? {
		nodes: n,
		edges: r
	} : null;
}
function ot(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "2" || t === "DIRECTORY" || t === "DIR" || t === "REPOSITORY_ENTRY_KIND_DIRECTORY" ? "directory" : t === "3" || t === "SYMLINK" || t === "REPOSITORY_ENTRY_KIND_SYMLINK" ? "symlink" : "file";
}
function st(e) {
	let t = tt(e), n = String(t.repository ?? t.name ?? "");
	if (!n && !Array.isArray(t.entries) && !U(t.file)) return null;
	let r = (Array.isArray(t.entries) ? t.entries : []).filter(U).map((e) => ({
		path: String(e.path ?? e.name ?? ""),
		name: String(e.name ?? String(e.path ?? "").split("/").pop() ?? ""),
		kind: ot(e.kind),
		language: W(e.language),
		sizeBytes: nt(e.sizeBytes ?? e.size_bytes),
		updatedAt: W(e.updatedAt ?? e.updated_at)
	})).filter((e) => e.path && e.name), i = U(t.file) ? t.file : null, a = i ? {
		path: String(i.path ?? t.path ?? ""),
		content: String(i.content ?? ""),
		language: W(i.language),
		sizeBytes: nt(i.sizeBytes ?? i.size_bytes),
		truncated: i.truncated === !0,
		url: W(i.url)
	} : void 0;
	return {
		repository: n,
		ref: String(t.ref ?? ""),
		path: String(t.path ?? ""),
		refs: $e(t.refs),
		entries: r,
		file: a,
		url: W(t.url)
	};
}
//#endregion
//#region src/widgets/recordShapes.ts
function G(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function ct(e) {
	return G(e) ? e : {};
}
function K(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function lt(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function ut(e) {
	return G(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function dt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
var ft = {
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
}, pt = {
	1: "grid",
	2: "board",
	3: "calendar",
	4: "gallery",
	5: "list",
	6: "timeline",
	7: "form"
};
function mt(e, t) {
	return String(e ?? "").replace(t, "").toLowerCase();
}
function ht(e) {
	let t = ft[String(e)];
	if (t) return t;
	let n = mt(e, "RECORD_FIELD_TYPE_");
	return Object.values(ft).includes(n) ? n : "text";
}
function gt(e) {
	let t = pt[String(e)];
	if (t) return t;
	let n = mt(e, "RECORD_VIEW_TYPE_");
	return Object.values(pt).includes(n) ? n : "grid";
}
function _t(e) {
	return typeof e == "boolean" ? "boolean" : typeof e == "number" ? "number" : Array.isArray(e) ? "multi_select" : "text";
}
function vt(e) {
	return e === "formula" || e === "lookup" || e === "rollup" || e === "created_at" || e === "updated_at";
}
function yt(e, t) {
	let n = (Array.isArray(e.fields) ? e.fields : []).filter(G).map((e) => {
		let t = ht(e.type), n = (Array.isArray(e.choices) ? e.choices : []).filter(G).map((e) => ({
			value: String(e.value ?? ""),
			label: String(e.label ?? e.value ?? ""),
			color: K(e.color)
		})).filter((e) => e.value);
		return {
			key: String(e.key ?? ""),
			label: String(e.label ?? e.key ?? ""),
			type: t,
			description: K(e.description),
			required: e.required === !0,
			readOnly: e.readOnly === !0 || e.read_only === !0 || vt(t),
			choices: n,
			linkedTableId: K(e.linkedTableId ?? e.linked_table_id),
			allowMultiple: e.allowMultiple === !0 || e.allow_multiple === !0,
			format: K(e.format),
			defaultValue: e.defaultValue ?? e.default_value
		};
	}).filter((e) => e.key);
	return n.length > 0 ? n : [...new Set(t.flatMap((e) => Object.keys(e.values)))].map((e) => {
		let n = t.find((t) => t.values[e] != null)?.values[e];
		return {
			key: e,
			label: e,
			type: _t(n),
			required: !1,
			readOnly: !1,
			choices: [],
			allowMultiple: Array.isArray(n)
		};
	});
}
function bt(e) {
	let t = ct(e), n = (Array.isArray(t.records) ? t.records : Array.isArray(t.rows) ? t.rows : []).filter(G).map((e, t) => {
		let n = G(e.values) ? e.values : Object.fromEntries(Object.entries(e).filter(([e]) => ![
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
			createdAt: K(e.createdAt ?? e.created_at),
			updatedAt: K(e.updatedAt ?? e.updated_at),
			revision: K(e.revision),
			context: ut(e.context)
		};
	}).filter((e) => e.id), r = yt(t, n), i = (Array.isArray(t.views) ? t.views : []).filter(G).map((e) => ({
		id: String(e.id ?? ""),
		name: String(e.name ?? e.id ?? ""),
		type: gt(e.type),
		visibleFields: lt(e.visibleFields ?? e.visible_fields),
		groupBy: K(e.groupBy ?? e.group_by),
		dateField: K(e.dateField ?? e.date_field),
		titleField: K(e.titleField ?? e.title_field),
		sorts: (Array.isArray(e.sorts) ? e.sorts : []).filter(G).map((e) => ({
			field: String(e.field ?? ""),
			descending: e.descending === !0
		})).filter((e) => e.field),
		filters: (Array.isArray(e.filters) ? e.filters : []).filter(G).map((e) => ({
			field: String(e.field ?? ""),
			operator: String(e.operator ?? "eq").toLowerCase(),
			value: e.value
		})).filter((e) => e.field)
	})).filter((e) => e.id), a = ct(t.capabilities), o = String(t.tableId ?? t.table_id ?? ""), s = String(t.tableName ?? t.table_name ?? o);
	return !o && !s && r.length === 0 && n.length === 0 ? null : {
		workspaceId: String(t.workspaceId ?? t.workspace_id ?? ""),
		tableId: o,
		tableName: s,
		primaryField: String(t.primaryField ?? t.primary_field ?? r[0]?.key ?? "id"),
		fields: r,
		records: n,
		views: i,
		activeViewId: K(t.activeViewId ?? t.active_view_id),
		total: dt(t.total),
		nextPageToken: K(t.nextPageToken ?? t.next_page_token),
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
function xt(e) {
	return !e.readOnly && e.type !== "attachment";
}
function St(e, t) {
	return Object.fromEntries(e.map((e) => [e.key, t ? t.values[e.key] : e.defaultValue ?? null]));
}
function Ct(e, t, n) {
	let r = e.filter(xt).filter((e) => JSON.stringify(t[e.key]) !== JSON.stringify(n?.values[e.key])).map((e) => [e.key, t[e.key]]);
	return Object.fromEntries(r);
}
function wt(e, t, n = e.primaryField) {
	let r = t.values[n] ?? t.values[e.primaryField];
	return G(r) ? String(r.label ?? r.name ?? r.id ?? t.id) : Array.isArray(r) ? r.map(Tt).join(", ") || t.id : r == null || r === "" ? t.id : String(r);
}
function Tt(e) {
	return e == null ? "" : G(e) ? String(e.label ?? e.name ?? e.id ?? "") : Array.isArray(e) ? e.map(Tt).filter(Boolean).join(", ") : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Et(e) {
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)) return e;
	let t = e instanceof Date ? e : typeof e == "string" || typeof e == "number" ? new Date(e) : null;
	return !t || Number.isNaN(t.getTime()) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function Dt(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function q(e) {
	return G(e) ? e.id ?? e.value ?? e.label ?? e.name ?? "" : e;
}
function Ot(e, t) {
	let n = q(e), r = q(t);
	return typeof n == "number" && typeof r == "number" ? n === r : String(n ?? "").toLowerCase() === String(r ?? "").toLowerCase();
}
function kt(e, t) {
	if (e) return e.choices.find((e) => Ot(e.value, t))?.color;
}
function At(e, t) {
	let n = e.values[t.field], r = t.value;
	switch (t.operator) {
		case "empty": return Dt(n);
		case "not_empty": return !Dt(n);
		case "neq": return !Ot(n, r);
		case "contains": return Array.isArray(n) ? n.some((e) => Ot(e, r)) : Tt(n).toLowerCase().includes(Tt(r).toLowerCase());
		case "in": {
			let e = Array.isArray(r) ? r : [r];
			return (Array.isArray(n) ? n : [n]).some((t) => e.some((e) => Ot(t, e)));
		}
		case "gt": return Number(q(n)) > Number(q(r));
		case "gte": return Number(q(n)) >= Number(q(r));
		case "lt": return Number(q(n)) < Number(q(r));
		case "lte": return Number(q(n)) <= Number(q(r));
		default: return Ot(n, r);
	}
}
function jt(e, t) {
	if (!t) return e;
	let n = t.filters.length > 0 ? e.filter((e) => t.filters.every((t) => At(e, t))) : e;
	return t.sorts.length === 0 ? n : n.map((e, t) => ({
		record: e,
		index: t
	})).sort((e, n) => {
		for (let r of t.sorts) {
			let t = q(e.record.values[r.field]), i = q(n.record.values[r.field]);
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
function Mt(e, t, n) {
	return e.views.find((e) => e.id === n && e.type === t) ?? e.views.find((n) => n.id === e.activeViewId && n.type === t) ?? e.views.find((e) => e.type === t);
}
//#endregion
//#region src/widgets/mediaShape.ts
function Nt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Pt(e) {
	return Nt(e) ? e : {};
}
function J(e) {
	if (e != null) return String(e).trim() || void 0;
}
function Ft(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim()) {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function It(e) {
	let t = Ft(e);
	return t != null && t >= 0 ? t : void 0;
}
function Lt(e) {
	return Array.isArray(e) ? [...new Set(e.map(String).map((e) => e.trim()).filter(Boolean))] : [];
}
function Rt(e) {
	return Nt(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function zt(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
function Bt(e, t, n) {
	if (e === 2) return "video";
	if (e === 1) return "image";
	let r = String(e ?? "").toLowerCase();
	return r.includes("video") || r === "movie" ? "video" : r.includes("image") || r.includes("photo") ? "image" : t?.toLowerCase().startsWith("video/") || /\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(n) ? "video" : "image";
}
function Vt(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).pop();
	if (!t) return "Untitled media";
	try {
		return decodeURIComponent(t);
	} catch {
		return t;
	}
}
function Ht(e) {
	if (!Nt(e)) return null;
	let t = zt(e.url ?? e.mediaUrl ?? e.media_url ?? e.src);
	if (!t) return null;
	let n = J(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type);
	return {
		id: J(e.id ?? e.mediaId ?? e.media_id) ?? t,
		title: J(e.title ?? e.name ?? e.label ?? e.filename) ?? Vt(t),
		kind: Bt(e.kind ?? e.type ?? e.mediaType ?? e.media_type, n, t),
		url: t,
		thumbnailUrl: zt(e.thumbnailUrl ?? e.thumbnail_url ?? e.thumbnail ?? e.posterUrl ?? e.poster_url ?? e.poster),
		description: J(e.description ?? e.caption),
		capturedAt: J(e.capturedAt ?? e.captured_at ?? e.takenAt ?? e.taken_at ?? e.dateTaken ?? e.date_taken),
		createdAt: J(e.createdAt ?? e.created_at ?? e.uploadedAt ?? e.uploaded_at),
		contentType: n,
		width: It(e.width),
		height: It(e.height),
		durationSeconds: It(e.durationSeconds ?? e.duration_seconds ?? e.duration),
		favorite: e.favorite === !0 || e.isFavorite === !0 || e.is_favorite === !0,
		tags: Lt(e.tags),
		collectionIds: Lt(e.collectionIds ?? e.collection_ids ?? e.albumIds ?? e.album_ids ?? e.albums),
		metadata: Pt(e.metadata),
		context: Rt(e.context)
	};
}
function Ut(e) {
	if (!Nt(e)) return null;
	let t = J(e.id ?? e.collectionId ?? e.collection_id ?? e.albumId ?? e.album_id);
	return t ? {
		id: t,
		name: J(e.name ?? e.title ?? e.label) ?? Qt(t),
		coverUrl: zt(e.coverUrl ?? e.cover_url ?? e.thumbnailUrl ?? e.thumbnail_url),
		itemCount: It(e.itemCount ?? e.item_count ?? e.count),
		context: Rt(e.context)
	} : null;
}
function Wt(e) {
	let t = Array.isArray(e) ? { items: e } : Pt(e), n = (Array.isArray(t.items) ? t.items : Array.isArray(t.media) ? t.media : Array.isArray(t.assets) ? t.assets : []).map(Ht).filter((e) => e !== null), r = (Array.isArray(t.collections) ? t.collections : Array.isArray(t.albums) ? t.albums : []).map(Ut).filter((e) => e !== null), i = new Set(r.map((e) => e.id));
	for (let e of new Set(n.flatMap((e) => e.collectionIds))) i.has(e) || r.push({
		id: e,
		name: Qt(e),
		itemCount: n.filter((t) => t.collectionIds.includes(e)).length,
		context: {}
	});
	return {
		items: Gt(n),
		collections: r,
		total: It(t.total),
		nextPageToken: J(t.nextPageToken ?? t.next_page_token)
	};
}
function Gt(e) {
	return [...e].sort((e, t) => {
		let n = Xt(t) - Xt(e);
		return n === 0 ? e.title.localeCompare(t.title) : n;
	});
}
function Kt(e, t) {
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
function qt(e, t = "day") {
	let n = Gt(e);
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
		label: Zt(e, t),
		items: n
	}));
}
function Jt(e) {
	if (e == null || !Number.isFinite(e) || e < 0) return;
	let t = Math.round(e), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
function Yt(e) {
	if (!e) return;
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(t);
}
function Xt(e) {
	let t = Date.parse(e.capturedAt ?? e.createdAt ?? "");
	return Number.isFinite(t) ? t : -Infinity;
}
function Zt(e, t) {
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
function Qt(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
//#region src/widgets/geoShape.ts
var $t = /* @__PURE__ */ new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]);
function en(e) {
	let t = pn(e), n = t.geo ?? t.geojson ?? e, r = pn(n), i;
	if (r.type === "FeatureCollection" && Array.isArray(r.features)) i = r.features;
	else if (r.type === "Feature") i = [r];
	else if (Array.isArray(r.features)) i = r.features;
	else if (Array.isArray(r.points)) i = r.points;
	else if (Array.isArray(r.rows)) i = r.rows;
	else if (Array.isArray(n)) i = n;
	else return null;
	let a = i.map((e, t) => an(e, t)).filter((e) => e !== null);
	return a.length > 0 ? {
		type: "FeatureCollection",
		features: a
	} : null;
}
function tn(e) {
	let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity;
	for (let a of e.features) un(a.geometry.coordinates, (e) => {
		t = Math.min(t, e[0]), r = Math.max(r, e[0]), n = Math.min(n, e[1]), i = Math.max(i, e[1]);
	});
	return [
		t,
		n,
		r,
		i
	].every(Number.isFinite) ? [[t, n], [r, i]] : null;
}
function nn(e) {
	let t = e.properties._mtc_context;
	if (typeof t != "string") return {};
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? {} : Object.fromEntries(Object.entries(e).filter((e) => typeof e[1] == "string"));
	} catch {
		return {};
	}
}
function rn(e) {
	let t = e.properties._mtc_label;
	return typeof t == "string" && t !== "" ? t : e.id;
}
function an(e, t) {
	let n = pn(e), r = pn(n.properties), i = on(n.geometry) ?? sn(n);
	if (!i) return null;
	let a = String(n.id ?? r.id ?? r.feature_id ?? r.object_id ?? `feature-${t + 1}`), o = gn(n.label, n.name, r.label, r.name, r.title, a), s = gn(n.status, r.status), c = hn(n.value ?? r.value), l = {
		...mn(r.context),
		...mn(n.context)
	}, u = {
		...pn(r.metadata),
		...pn(n.metadata)
	};
	return {
		type: "Feature",
		id: a,
		geometry: i,
		properties: {
			...fn(r),
			...fn(u),
			_mtc_id: a,
			_mtc_label: o,
			_mtc_tone: dn(s),
			...s && { _mtc_status: s },
			...c !== void 0 && { _mtc_value: c },
			_mtc_context: JSON.stringify(l)
		}
	};
}
function on(e) {
	let t = pn(e), n = t.type;
	return typeof n != "string" || !$t.has(n) || !cn(n, t.coordinates) ? null : {
		type: n,
		coordinates: t.coordinates
	};
}
function sn(e) {
	let t = hn(e.latitude ?? e.lat), n = hn(e.longitude ?? e.lng ?? e.lon);
	return t === void 0 || n === void 0 || t < -90 || t > 90 || n < -180 || n > 180 ? null : {
		type: "Point",
		coordinates: [n, t]
	};
}
function cn(e, t) {
	return ln(t, {
		Point: 0,
		MultiPoint: 1,
		LineString: 1,
		MultiLineString: 2,
		Polygon: 2,
		MultiPolygon: 3
	}[e]);
}
function ln(e, t) {
	if (t === 0) {
		if (!Array.isArray(e) || e.length < 2) return !1;
		let t = Number(e[0]), n = Number(e[1]);
		return Number.isFinite(t) && Number.isFinite(n) && t >= -180 && t <= 180 && n >= -90 && n <= 90;
	}
	return Array.isArray(e) && e.length > 0 && e.every((e) => ln(e, t - 1));
}
function un(e, t) {
	if (Array.isArray(e)) {
		if (e.length >= 2 && typeof e[0] == "number" && typeof e[1] == "number") {
			t(e);
			return;
		}
		for (let n of e) un(n, t);
	}
}
function dn(e) {
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
function fn(e) {
	return Object.fromEntries(Object.entries(e).filter((e) => e[1] === null || typeof e[1] == "string" || typeof e[1] == "number" || typeof e[1] == "boolean"));
}
function pn(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function mn(e) {
	let t = pn(e);
	return Object.fromEntries(Object.entries(t).filter((e) => typeof e[1] == "string"));
}
function hn(e) {
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function gn(...e) {
	return e.find((e) => typeof e == "string" && e !== "");
}
//#endregion
//#region src/widgets/orderBookShape.ts
function _n(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e, n = bn(t.bids, "bid"), r = bn(t.asks, "ask");
	if (n.length === 0 && r.length === 0) return null;
	let i = Sn(t.mid), a = Sn(t.spread);
	return {
		bids: n,
		asks: r,
		...i !== void 0 && { mid: i },
		...a !== void 0 && { spread: a },
		...typeof t.venue == "string" && t.venue !== "" && { venue: t.venue }
	};
}
function vn(e, t = 100, n = "size") {
	let r = Number.isFinite(t) ? Math.max(1, Math.floor(t)) : 100, i = 0, a = e.bids.slice(0, r).map((e) => (i += yn(e, n), {
		price: e.price,
		side: "bid",
		cumulative: i
	})), o = 0, s = e.asks.slice(0, r).map((e) => (o += yn(e, n), {
		price: e.price,
		side: "ask",
		cumulative: o
	}));
	return [...a.reverse(), ...s];
}
function yn(e, t) {
	return t === "notional" ? e.price * e.size : e.size;
}
function bn(e, t) {
	if (!Array.isArray(e)) return [];
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = xn(t);
		e && n.set(e.price, (n.get(e.price) ?? 0) + e.size);
	}
	return Array.from(n, ([e, t]) => ({
		price: e,
		size: t
	})).sort((e, n) => t === "bid" ? n.price - e.price : e.price - n.price);
}
function xn(e) {
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
function Sn(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
//#endregion
//#region src/export/flatten.ts
var Cn = {
	columns: [],
	rows: []
};
function Y(e) {
	if (e == null) return null;
	let t = typeof e;
	if (t === "number" || t === "boolean" || t === "string") return e;
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
function X(e) {
	let t = [], n = /* @__PURE__ */ new Set();
	for (let r of e) for (let e of Object.keys(r)) n.has(e) || (n.add(e), t.push(e));
	return {
		columns: t,
		rows: e.map((e) => {
			let n = {};
			for (let r of t) n[r] = Y(e[r]);
			return n;
		})
	};
}
function Z(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function wn(e) {
	let t = (e) => Array.isArray(e) ? e : Z(e) && Array.isArray(e.points) ? e.points : null;
	if (Z(e) && Array.isArray(e.series)) {
		let t = e.series, n = /* @__PURE__ */ new Map(), r = [];
		for (let e = 0; e < t.length; e++) {
			let i = t[e], a = i.name ?? `series_${e + 1}`;
			r.push(a);
			let o = i.points ?? i.data ?? [];
			for (let e of o) {
				let t = String(e.timestamp ?? ""), r = n.get(t) ?? { timestamp: t };
				r[a] = Y(e.value), n.set(t, r);
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
			timestamp: Y(e.timestamp),
			value: Y(e.value)
		}))
	} : null;
}
function Tn(e) {
	return Z(e) && Array.isArray(e.bars) ? X(e.bars) : null;
}
function En(e) {
	if (Array.isArray(e) && e.length > 0 && Z(e[0])) return X(e);
	if (Z(e) && "rows" in e) {
		let t = e, n = Array.isArray(t.columns) ? t.columns : [];
		if (n.length > 0 && Z(n[0])) {
			let e = n.map((e) => e.key);
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, Y(t[n])])) : Dn(t, e))
			};
		}
		if (n.length > 0 && typeof n[0] == "string") {
			let e = n;
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, Y(t[n])])) : Dn(t, e))
			};
		}
		let r = t.rows;
		return r.length > 0 && Z(r[0]) ? X(r) : Cn;
	}
	return null;
}
function Dn(e, t) {
	let n = {};
	for (let r of t) n[r] = Y(e[r]);
	return n;
}
function On(e) {
	return Z(e) && Array.isArray(e.cells) ? X(e.cells) : null;
}
function kn(e) {
	return Z(e) && Array.isArray(e.slices) ? X(e.slices) : null;
}
function An(e) {
	return Z(e) && Array.isArray(e.events) ? X(e.events) : null;
}
function jn(e) {
	return Z(e) && Array.isArray(e.items) ? X(e.items) : null;
}
function Mn(e) {
	if (!Z(e) || !Array.isArray(e.messages)) return null;
	let t = e.id ?? e.conversation_id ?? e.conversationId;
	return X(e.messages.filter(Z).map((e) => ({
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
function Nn(e) {
	let t = _n(e);
	return t ? X([...t.bids.map((e) => ({
		side: "bid",
		...e
	})), ...t.asks.map((e) => ({
		side: "ask",
		...e
	}))]) : null;
}
function Pn(e) {
	return typeof e == "number" ? {
		columns: ["value"],
		rows: [{ value: e }]
	} : Z(e) && "value" in e && typeof e.value != "object" ? X([e]) : null;
}
function Fn(e) {
	if (Z(e) && "value" in e) {
		let { value: t, min: n, max: r } = e;
		return X([{
			value: t,
			min: n,
			max: r
		}]);
	}
	return null;
}
function In(e) {
	let t = rt(e);
	return t.items.length === 0 ? null : X(t.items.map((e) => ({
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
function Ln(e) {
	let t = it(e);
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
	return t.links.length > 0 && (n.links = t.links), t.actions.length > 0 && (n.actions = t.actions), X([n]);
}
function Rn(e) {
	let t = at(e);
	return t ? X([...t.nodes.map((e) => ({
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
function zn(e) {
	let t = st(e);
	return t ? t.entries.length > 0 ? X(t.entries.map((e) => ({
		repository: t.repository,
		ref: t.ref,
		path: e.path,
		name: e.name,
		kind: e.kind,
		language: e.language,
		size_bytes: e.sizeBytes,
		updated_at: e.updatedAt
	}))) : t.file ? X([{
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
function Bn(e) {
	let t = bt(e);
	return t ? X(t.records.map((e) => ({
		id: e.id,
		...e.values,
		created_at: e.createdAt,
		updated_at: e.updatedAt,
		revision: e.revision
	}))) : null;
}
function Vn(e) {
	let t = en(e);
	return t ? X(t.features.map((e) => ({
		...Object.fromEntries(Object.entries(e.properties).filter(([e]) => !e.startsWith("_mtc_"))),
		id: e.id,
		label: rn(e),
		geometry_type: e.geometry.type,
		geometry: e.geometry,
		status: e.properties._mtc_status,
		value: e.properties._mtc_value,
		context: nn(e)
	}))) : null;
}
function Hn(e) {
	let t = Wt(e);
	return t.items.length === 0 ? null : X(t.items.map((e) => ({
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
var Un = {
	timeseries: wn,
	area_chart: wn,
	sparkline: wn,
	candlestick: Tn,
	table: En,
	heatmap: On,
	distribution: kn,
	events: An,
	tape: An,
	action_log: An,
	alert_log: An,
	text: jn,
	ticker: jn,
	conversation: Mn,
	orderbook: Nn,
	depth_chart: Nn,
	metric: Pn,
	gauge: Fn,
	asset_catalog: In,
	object_view: Ln,
	dag: Rn,
	code_browser: zn,
	record_grid: Bn,
	record_board: Bn,
	record_calendar: Bn,
	record_form: Bn,
	geo_map: Vn,
	media_gallery: Hn,
	SHAPE_TIMESERIES: wn,
	SHAPE_CANDLES: Tn,
	SHAPE_TABLE: En,
	SHAPE_METRIC: Pn,
	SHAPE_GAUGE: Fn,
	SHAPE_HEATMAP: On,
	SHAPE_EVENTS: An,
	SHAPE_DISTRIBUTION: kn,
	SHAPE_TEXT: jn,
	SHAPE_CONVERSATION: Mn,
	SHAPE_ORDERBOOK: Nn,
	SHAPE_ASSET_CATALOG: In,
	SHAPE_OBJECT: Ln,
	SHAPE_GRAPH: Rn,
	SHAPE_REPOSITORY: zn,
	SHAPE_RECORD_SET: Bn,
	SHAPE_GEO: Vn,
	SHAPE_MEDIA: Hn
};
function Wn(e) {
	if (e == null) return Cn;
	if (Array.isArray(e)) return e.length === 0 ? Cn : Z(e[0]) ? X(e) : {
		columns: ["value"],
		rows: e.map((e) => ({ value: Y(e) }))
	};
	if (Z(e)) {
		let t = Object.entries(e).find(([, e]) => Array.isArray(e));
		return t && Z(t[1][0]) ? X(t[1]) : X([e]);
	}
	return {
		columns: ["value"],
		rows: [{ value: Y(e) }]
	};
}
function Gn(e, t) {
	if (e == null) return Cn;
	if (t) {
		let n = Un[t];
		if (n) {
			let t = n(e);
			if (t) return t;
		}
	}
	for (let t of [
		wn,
		Tn,
		On,
		kn,
		An,
		Mn,
		jn,
		Nn,
		Hn,
		In,
		Ln,
		Rn,
		zn,
		Bn,
		Fn,
		Pn,
		En
	]) {
		let n = t(e);
		if (n && n.rows.length > 0) return n;
	}
	return Wn(e);
}
//#endregion
//#region src/export/serializers.ts
var Kn = {
	csv: "text/csv;charset=utf-8",
	json: "application/json;charset=utf-8",
	ndjson: "application/x-ndjson;charset=utf-8",
	parquet: "application/vnd.apache.parquet"
}, qn = {
	csv: "csv",
	json: "json",
	ndjson: "ndjson",
	parquet: "parquet"
}, Jn = [
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
function Yn(e) {
	if (e == null) return "";
	let t = String(e);
	return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function Xn(e) {
	let { columns: t, rows: n } = e;
	return [t.map(Yn).join(","), ...n.map((e) => t.map((t) => Yn(e[t])).join(","))].join("\n");
}
function Zn(e) {
	return JSON.stringify(e.rows, null, 2);
}
function Qn(e) {
	return e.rows.map((e) => JSON.stringify(e)).join("\n");
}
function $n(e) {
	return e.columns.map((t) => ({
		name: t,
		data: e.rows.map((e) => e[t] ?? null)
	}));
}
async function er(e) {
	let { parquetWriteBuffer: t } = await import("./src-CjPDjqyY.js"), n = t({ columnData: e.columns.length > 0 ? $n(e) : [{
		name: "value",
		data: []
	}] });
	return new Uint8Array(n);
}
function tr(e, t) {
	switch (t) {
		case "csv": return Xn(e);
		case "json": return Zn(e);
		case "ndjson": return Qn(e);
	}
}
//#endregion
//#region src/export/exportView.ts
function nr(e) {
	return e.table ?? Gn(e.data, e.component);
}
async function rr(e, t) {
	let n = nr(e);
	if (t === "parquet") {
		let e = await er(n);
		return new Blob([e.slice().buffer], { type: Kn.parquet });
	}
	let r = tr(n, t);
	return new Blob([r], { type: Kn[t] });
}
function ir(e) {
	return nr(e).rows.length;
}
function ar(e, t) {
	return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${qn[t]}`;
}
async function or(e, t, n) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return !1;
	let r = await rr(e, t), i = URL.createObjectURL(r), a = document.createElement("a");
	return a.href = i, a.download = ar(n, t), document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 0), !0;
}
//#endregion
//#region src/widgets/WidgetShell.tsx
function sr(e, t) {
	if (!t) return null;
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "just now";
	if (n < 60) return `${n}s ago`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function cr(e) {
	let { resolution: t, loading: r, error: a, data: o, options: s, component: c, widgetId: l, Component: u, onRenderError: d, onRetry: f } = e;
	return t.error ? /* @__PURE__ */ E(i, { message: t.error }) : r ? /* @__PURE__ */ E(le, { component: c }) : a ? /* @__PURE__ */ E(n, {
		error: a,
		onRetry: f,
		compact: !0,
		className: "h-full"
	}) : /* @__PURE__ */ E("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ E(p, {
			onError: d,
			children: /* @__PURE__ */ E(g, {
				fallback: /* @__PURE__ */ E(le, { component: c }),
				children: /* @__PURE__ */ E(u, {
					data: o,
					options: s,
					widgetId: l
				})
			})
		})
	});
}
function lr({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: a, fullscreenId: o, setFullscreenId: s } = we(), [c, l] = w(!1), [u, d] = w(!1), [f, p] = w(!1), m = C(null);
	x(() => {
		if (!c) return;
		let e = (e) => {
			m.current && !m.current.contains(e.target) && (l(!1), d(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [c]);
	let h = e.source, g = h?.data !== void 0 && !h.url && !h.source_id, _ = !!h && !g, v = !!e.id, y = !!e.id && o !== e.id, b = t == null ? 0 : ir({
		data: t,
		component: e.component
	}), S = b > 0, T = async (n) => {
		p(!0);
		try {
			let r = await or({
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
	return /* @__PURE__ */ D("div", {
		className: "relative",
		ref: m,
		children: [/* @__PURE__ */ E("button", {
			onClick: () => l((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			"aria-expanded": c,
			children: "⋮"
		}), c && /* @__PURE__ */ D("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				_ && /* @__PURE__ */ E("button", {
					onClick: () => {
						n(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ E("button", {
					onClick: async () => {
						await r(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				S && /* @__PURE__ */ D("div", { children: [/* @__PURE__ */ D("button", {
					onClick: () => d((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": u,
					children: [/* @__PURE__ */ D("span", { children: ["Export", f ? "…" : ""] }), /* @__PURE__ */ E("span", {
						className: "text-zinc-600",
						children: u ? "▾" : "▸"
					})]
				}), u && /* @__PURE__ */ E("div", {
					className: "bg-zinc-950/60",
					children: Jn.map((e) => /* @__PURE__ */ E("button", {
						onClick: () => T(e.key),
						disabled: f,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				y && /* @__PURE__ */ E("button", {
					onClick: () => {
						s(e.id), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				v && /* @__PURE__ */ E("button", {
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
function ur({ config: e, contentHeight: t, snapshotKey: n, registry: r }) {
	let { ctx: i, backendUrl: a, backendHeaders: o, refreshIntervalMs: s, compact: c, toast: u, focusedId: d, setFocusedId: f, refreshPulse: p, emit: m, soundEnabled: h, reportWidgetHealth: g, registerWidgetData: _ } = we(), v = S(() => e.title ? Fe(e.title, i) : e.title, [e.title, i]), y = S(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = Ie(e.source, i, a, o);
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
	]), b = y.source, { fetch: w } = we(), { data: T, loading: ee, sourceError: O, lastUpdated: k, connected: A, nextRetryAt: te, refresh: j } = F(b, { fetch: e.source?.source_id ? w : void 0 }), ne = xe(e.component, r), re = C(T);
	re.current = T, x(() => {
		if (n) return _(n, () => re.current);
	}, [n, _]);
	let M = !!b?.stream || !!(b?.refreshIntervalMs ?? b?.refreshInterval), ie = b?.staleAfterMs, ae = Re(M && k != null || te != null || !!ie && k != null), N = !!ie && k != null && ae - k > ie, oe = C(0);
	x(() => {
		if (!p) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = p.id === "*";
		n && t === "self" || (n || p.id === e.id) && p.n > oe.current && (oe.current = p.n, j());
	}, [
		p,
		e.id,
		e.refresh_policy,
		j
	]);
	let P = C(!1);
	x(() => {
		let t = e.alert;
		if (!t || T == null) {
			P.current = !1;
			return;
		}
		let n = Ve(T, t.when);
		if (n && !P.current) {
			let n = Fe(t.message, i), r = t.severity ?? "warn";
			u(n, r), m({
				type: "alert",
				widgetId: e.id,
				severity: r,
				message: n,
				predicate: t.when
			}), h && Qe(r);
		}
		P.current = n;
	}, [
		T,
		e.alert,
		i,
		u,
		m,
		e.id,
		h
	]);
	let se = C(null), ce = S(() => O ? l(O) : null, [O]);
	x(() => {
		let t = y.error ?? ce, n = y.error ? "resolve" : "data";
		t && t !== se.current ? (m({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), se.current = t) : t || (se.current = null);
	}, [
		y.error,
		ce,
		m,
		e.id,
		e.component
	]), x(() => {
		if (!e.id) return;
		let t = !!b?.stream;
		return g(e.id, {
			title: v || e.title || e.component,
			streaming: t,
			connected: !t || A,
			error: y.error ?? ce,
			stale: N
		}), () => g(e.id, null);
	}, [
		e.id,
		v,
		e.title,
		e.component,
		b?.stream,
		A,
		y.error,
		ce,
		N,
		g
	]);
	let le = !!e.id && d === e.id, ue = e.id ? () => f(e.id) : void 0;
	return /* @__PURE__ */ D("div", {
		onClick: ue,
		className: "mtc-widget overflow-hidden",
		"data-focused": le ? "true" : "false",
		children: [v && /* @__PURE__ */ D("div", {
			className: `mtc-widget-header ${c ? "px-2 py-1" : "px-3 py-1.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ E("h2", {
				className: `${c ? "text-[length:var(--mtc-font-size-md)]" : "text-[length:var(--mtc-font-size-lg)]"} font-semibold text-zinc-100 truncate`,
				children: v
			}), /* @__PURE__ */ D("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					M && k && /* @__PURE__ */ D("span", {
						className: `text-[11px] ${N ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [N ? "stale · " : "", sr(ae, k)]
					}),
					e.source?.stream && !A && te != null && /* @__PURE__ */ D("span", {
						className: "text-[11px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((te - ae) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ E("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${A ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: A ? "Connected" : te ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ E(lr, {
						widget: e,
						data: T,
						onToast: u,
						onRefresh: j,
						onCopy: async () => {
							if (T == null) return u("No data to copy", "warn"), !1;
							if (typeof navigator > "u" || !navigator.clipboard) return u("Clipboard unavailable", "warn"), !1;
							try {
								return await navigator.clipboard.writeText(JSON.stringify(T, null, 2)), u(`${e.title ?? e.component} copied`, "ok"), !0;
							} catch {
								return u("Clipboard blocked", "warn"), !1;
							}
						}
					})
				]
			})]
		}), /* @__PURE__ */ E("div", {
			className: c ? "p-2.5" : "p-4",
			style: { height: c ? Math.round(t * .92) : t },
			children: cr({
				resolution: y,
				loading: ee,
				error: O,
				data: T,
				options: e.options,
				component: e.component,
				widgetId: e.id,
				Component: ne,
				onRenderError: (t) => m({
					type: "widget_error",
					widgetId: e.id,
					component: e.component,
					message: t.message,
					source: "render"
				}),
				onRetry: b && b.inline === void 0 && b.data === void 0 ? j : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/HoverContext.tsx
var dr = _({
	hoverTime: null,
	setHoverTime: () => {}
});
function fr() {
	return b(dr);
}
function pr({ children: e }) {
	let [t, n] = w(null), r = S(() => ({
		hoverTime: t,
		setHoverTime: n
	}), [t]);
	return /* @__PURE__ */ E(dr.Provider, {
		value: r,
		children: e
	});
}
//#endregion
//#region src/core/applyActions.ts
function mr(e, t, n) {
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
var hr = "ctx.";
function gr(e) {
	let t = {}, n = new URLSearchParams(e);
	for (let [e, r] of n) e.startsWith(hr) && (t[e.slice(4)] = r);
	return t;
}
function _r(e, t) {
	let n = new URLSearchParams(e);
	for (let e of [...n.keys()]) e.startsWith(hr) && n.delete(e);
	for (let [e, r] of Object.entries(t)) n.set(`${hr}${e}`, r);
	return n.toString();
}
//#endregion
//#region src/core/savedViews.ts
var vr = "medallion-terminal:view:";
function yr(e, t) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(vr + e, JSON.stringify(t));
	} catch {}
}
function br(e) {
	if (!e || typeof window > "u" || !window.localStorage) return null;
	try {
		let t = window.localStorage.getItem(vr + e);
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
function xr() {
	if (typeof window > "u" || !window.localStorage) return [];
	let e = [];
	for (let t = 0; t < window.localStorage.length; t++) {
		let n = window.localStorage.key(t);
		n && n.startsWith(vr) && e.push(n.slice(24));
	}
	return e.sort();
}
function Sr(e) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.removeItem(vr + e);
	} catch {}
}
//#endregion
//#region src/core/CommandPalette.tsx
var Cr = /* @__PURE__ */ new Set([
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
]), wr = 150, Tr = 8;
function Er(e, t) {
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
	} : Cr.has(n.toLowerCase()) ? {
		kind: "set",
		key: "range",
		value: n.toLowerCase()
	} : {
		kind: "set",
		key: t,
		value: n
	};
}
function Dr({ suggest: e } = {}) {
	let { ctx: t, setCtx: n, toast: r } = we(), [i, o] = w(!1), [s, l] = w(""), [u, d] = w([]), [f, p] = w([]), m = C(0);
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
				p(r.slice(0, Tr));
			} catch {
				n === m.current && p([]);
			}
		}, wr);
		return () => clearTimeout(r);
	}, [
		s,
		i,
		e
	]);
	let h = S(() => Object.keys(t)[0] ?? "symbol", [t]), g = S(() => i ? xr() : [], [i, u]), _ = (e) => {
		let i = Er(e, h);
		if (i && i.kind !== "noop") {
			if (i.kind === "save") yr(i.name, t), r(`Saved "${i.name}"`, "ok");
			else if (i.kind === "load") {
				let e = br(i.name);
				if (!e) r(`No view named "${i.name}"`, "warn");
				else {
					for (let [t, r] of Object.entries(e)) n(t, r);
					r(`Loaded "${i.name}"`, "ok");
				}
			} else if (i.kind === "delete") Sr(i.name), r(`Deleted "${i.name}"`, "ok");
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
	return /* @__PURE__ */ E(c, {
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
		footer: /* @__PURE__ */ D(T, { children: [
			/* @__PURE__ */ D("span", { children: [/* @__PURE__ */ E(a, { children: "↵" }), " apply"] }),
			/* @__PURE__ */ D("span", { children: [
				/* @__PURE__ */ E(a, { children: "↑" }),
				" ",
				/* @__PURE__ */ E(a, { children: "↓" }),
				" pick"
			] }),
			/* @__PURE__ */ D("span", { children: [/* @__PURE__ */ E(a, { children: "Esc" }), " close"] }),
			b.length > 0 && /* @__PURE__ */ E("span", {
				className: "mtc-command-context",
				children: b.map(([e, t]) => `${e}=${t}`).join(" · ")
			})
		] })
	});
}
//#endregion
//#region src/core/ShortcutsOverlay.tsx
var Or = [
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
function kr(e) {
	return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")}`;
}
function Ar({ templateShortcuts: e }) {
	let [t, n] = w(!1);
	return x(() => {
		let e = (e) => {
			let t = e.target?.tagName, r = t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable;
			e.key === "?" && !r ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ E("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ D("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ D("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ E("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ E("span", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ D("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [Or.map((e, t) => /* @__PURE__ */ D("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ E("kbd", {
						className: "text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ E("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ E("div", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ D("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ E("kbd", {
						className: "text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ E("span", {
						className: "text-xs text-zinc-400",
						children: kr(e)
					})]
				}, `tpl-${t}`))] })]
			})]
		})
	}) : null;
}
//#endregion
//#region src/core/validateTemplate.ts
var jr = /* @__PURE__ */ new Set(/* @__PURE__ */ "timeseries.candlestick.table.metric.text.conversation.prompt.gauge.distribution.heatmap.events.catalog.asset_catalog.object_view.code_browser.record_grid.record_board.record_calendar.record_form.action_form.orderbook.depth_chart.paired_grid.trade.ticker.volume_profile.stat_strip.bar_chart.scatter.clock.treemap.image.iframe.histogram.section.area_chart.slider.select.boxplot.radar.dag.geo_map.media_gallery.multi_select.json.sparkline.action_log.alert_log.tape.file_browser".split("."));
function Mr(e, t, n = {}) {
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
	let i = n.includeBuiltIns === !1 ? new Set(t ?? []) : t ? /* @__PURE__ */ new Set([...jr, ...t]) : jr;
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
		e.alert && ((typeof e.alert.when != "string" || !He(e.alert.when)) && r.push({
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
var Nr = "", Pr = [
	"authorization",
	"cookie",
	"proxy-authorization",
	"set-cookie",
	"x-api-key",
	"x-auth-token",
	"x-csrf-token",
	"x-xsrf-token"
], Fr = [
	"allow-downloads",
	"allow-popups-to-escape-sandbox",
	"allow-top-navigation",
	"allow-top-navigation-by-user-activation"
], Q = {
	allowRelativeUrls: !0,
	allowedUrlOrigins: [],
	allowedBasemapPresets: [],
	disallowedHeaders: Pr,
	minRefreshIntervalMs: 1e3,
	iframeSandbox: {
		disallowedTokens: Fr,
		allowScriptsWithSameOrigin: !1
	}
}, Ir = [
	"url",
	"upload_url",
	"search_url",
	"ingest_url",
	"download_url",
	"media_url_template",
	"style_url"
];
function Lr(e, t = Q) {
	let n = [], r = Rr(t);
	return !e || typeof e != "object" || !Array.isArray(e.widgets) ? [{
		path: "widgets",
		severity: "error",
		message: "template.widgets must be an array"
	}] : (e.widgets.forEach((e, t) => {
		if (!e || typeof e != "object") return;
		let i = `widgets[${t}]`;
		e.source && Vr(e.source, `${i}.source`, r, n), Hr(e, i, r, n), e.component === "iframe" && Wr(e, i, r, n), e.component === "image" && Gr(e, i, r, n), e.component === "media_gallery" && Kr(e, i, r, n);
	}), n);
}
function Rr(e) {
	let t = Q.iframeSandbox;
	return {
		allowedUrlOrigins: zr(e.allowedUrlOrigins ?? Q.allowedUrlOrigins),
		allowedIframeOrigins: zr(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
		allowRelativeUrls: e.allowRelativeUrls ?? Q.allowRelativeUrls,
		allowedBasemapPresets: new Set(e.allowedBasemapPresets ?? Q.allowedBasemapPresets),
		allowedHeaders: e.allowedHeaders ? Br(e.allowedHeaders) : void 0,
		disallowedHeaders: Br(e.disallowedHeaders ?? Q.disallowedHeaders),
		minRefreshIntervalMs: e.minRefreshIntervalMs ?? Q.minRefreshIntervalMs,
		maxRefreshIntervalMs: e.maxRefreshIntervalMs,
		iframeSandbox: {
			requiredTokens: [...t.requiredTokens ?? [], ...e.iframeSandbox?.requiredTokens ?? []],
			disallowedTokens: [...t.disallowedTokens ?? [], ...e.iframeSandbox?.disallowedTokens ?? []],
			allowScriptsWithSameOrigin: e.iframeSandbox?.allowScriptsWithSameOrigin ?? t.allowScriptsWithSameOrigin ?? !1
		}
	};
}
function zr(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) try {
		t.add(new URL(n).origin);
	} catch {}
	return t;
}
function Br(e) {
	return new Set(e.map((e) => e.trim().toLowerCase()).filter(Boolean));
}
function Vr(e, t, n, r) {
	typeof e.url == "string" && $(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Yr(e.headers, `${t}.headers`, n, r), Xr(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Hr(e, t, n, r) {
	let i = e.options;
	if (i && typeof i == "object") {
		for (let a of Ir) {
			if (e.component === "iframe" && a === "url") continue;
			let o = i[a];
			typeof o == "string" && o !== "" && $(o, `${t}.options.${a}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		}
		e.component === "geo_map" && i.basemap != null && Ur(i.basemap, `${t}.options.basemap`, n, r);
	}
}
function Ur(e, t, n, r) {
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
		$(i.style_url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		return;
	}
	i.kind === "raster" && i.tiles.forEach((e, i) => {
		$(e, `${t}.tiles[${i}]`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
	});
}
function Wr(e, t, n, r) {
	let { url: i, sandbox: a } = qr(e);
	i && $(i, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), Zr(a, `${t}.iframe.sandbox`, n, r);
}
function Gr(e, t, n, r) {
	let i = Jr(e.source), a = typeof i == "string" ? i : i && typeof i == "object" && typeof i.url == "string" ? i.url : void 0;
	a && $(a, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
}
function Kr(e, t, n, r) {
	let i = Jr(e.source);
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
			typeof o == "string" && o && $(o, `${t}.media.items[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
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
			typeof o == "string" && o && $(o, `${t}.media.collections[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
		}
	});
}
function qr(e) {
	let t = e.options, n = Jr(e.source), r, i = "";
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
function Jr(e) {
	return e?.inline ?? e?.data;
}
function Yr(e, t, n, r) {
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
function Xr(e, t, n, r) {
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
function $(e, t, n, r, i) {
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
	return /* @__PURE__ */ E("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: ai.map((n) => {
			let r = e.toLowerCase() === n;
			return /* @__PURE__ */ E("button", {
				onClick: () => t(n),
				className: `px-2 py-0.5 text-[length:var(--mtc-font-size-xs)] font-medium rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
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
	return /* @__PURE__ */ E("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: di.map((n) => {
			let r = e === n.ms;
			return /* @__PURE__ */ E("button", {
				onClick: () => t(n.ms),
				className: `px-2 py-0.5 text-[length:var(--mtc-font-size-xs)] font-medium rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
				children: n.label
			}, n.label);
		})
	});
}
function pi() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ D("button", {
		onClick: () => {
			document.dispatchEvent(new KeyboardEvent("keydown", {
				key: "k",
				metaKey: e,
				ctrlKey: !e,
				bubbles: !0
			}));
		},
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200 font-mono",
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
	let { recentActions: e, widgetHealth: t } = we(), n = Re(!0), r = e[0], i = Object.values(t), a = i.filter((e) => e.streaming), o = a.filter((e) => e.connected && !e.error).length, s = i.filter((e) => e.error).length, c = i.filter((e) => e.stale).length, l = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ D("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ E("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ D("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ E("span", {
							className: "tabular-nums w-7 shrink-0",
							children: hi(n, r.receivedAt)
						}),
						/* @__PURE__ */ E("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ E("span", {
							className: `shrink-0 ${l}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ E("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ E("span", {
					className: "text-zinc-500",
					children: "idle"
				})
			}),
			a.length > 0 && /* @__PURE__ */ D("span", {
				className: o === a.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${o} of ${a.length} streams connected`,
				children: [
					/* @__PURE__ */ D("span", {
						className: "tabular-nums",
						children: [
							o,
							"/",
							a.length
						]
					}),
					" ",
					/* @__PURE__ */ E("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			c > 0 && /* @__PURE__ */ D("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${c} widget(s) without recent updates`,
				children: [c, " stale"]
			}),
			s > 0 && /* @__PURE__ */ D("span", {
				className: "text-red-400 tabular-nums",
				children: [s, " err"]
			}),
			/* @__PURE__ */ E("span", {
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
	return /* @__PURE__ */ D("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[length:var(--mtc-font-size-xs)] ",
		children: [n.length > 0 && /* @__PURE__ */ D("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ D("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ E("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ D("span", {
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
	return /* @__PURE__ */ E("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function yi({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ D("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function bi({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ E("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to standard density" : "Switch to compact density",
		children: e ? "Standard" : "Compact"
	});
}
function xi({ onCopied: e }) {
	return /* @__PURE__ */ E("button", {
		onClick: async () => {
			if (typeof navigator < "u" && navigator.clipboard) try {
				await navigator.clipboard.writeText(window.location.href), e();
			} catch {}
		},
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: "Copy current dashboard URL",
		children: "Copy link"
	});
}
function Si({ onClick: e, busy: t }) {
	return /* @__PURE__ */ E("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function Ci({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ D("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ E("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ D("span", {
				className: "text-zinc-600",
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
function Ei({ template: n, backendUrl: r, backendHeaders: i = Ti, fetch: a, onEvent: o, onIntent: c, onCtxChange: l, paletteSuggest: u, chrome: d = "full", onShare: f, theme: p, templateTrust: h = "untrusted", templateTrustPolicy: g = Q, resolveAssetIntent: _, assetRenderers: v, assetApplicationFrame: b, saveAssetOpenPreference: ee, onAssetOpenError: k, registry: A }) {
	let te = e(), j = p ?? te?.theme ?? "dark", ne = O(), re = n.columns || 12, [M, ie] = w(n.widgets), ae = A ? [...A.keys()].sort().join("\0") : "", N = S(() => Mr(n, A?.keys(), { includeBuiltIns: A == null }), [
		n,
		A,
		ae
	]), oe = S(() => h === "trusted" ? [] : Lr(n, g), [
		n,
		h,
		g
	]), P = S(() => [...N, ...oe], [N, oe]), se = S(() => P.some((e) => e.severity === "error"), [P]), F = S(() => oe.some((e) => e.severity === "error"), [oe]), ce = S(() => !!n.frozenAt || ni(n), [n]), [le, ue] = w(!1), [I, de] = w(() => {
		let e = n.context?.values ?? {};
		return typeof window > "u" ? e : {
			...e,
			...gr(window.location.search)
		};
	}), [fe, pe] = w(null), [L, me] = w(!1), [he, ge] = w(!1), [_e, R] = w(!1);
	x(() => {
		pe(ji("refreshIntervalMs", null)), me(ji("compact", !1)), ge(ji("soundEnabled", !1)), R(!0);
	}, []), x(() => {
		_e && Mi("refreshIntervalMs", fe);
	}, [_e, fe]), x(() => {
		_e && Mi("compact", L);
	}, [_e, L]), x(() => {
		_e && Mi("soundEnabled", he);
	}, [_e, he]);
	let [z, ve] = w(null), [B, ye] = w(null), [be, xe] = w(null), [Se, we] = w([]), [Te, Ee] = w(!1), De = C(0), Oe = C(!1), ke = y((e) => {
		xe((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), Ae = C(o);
	x(() => {
		Ae.current = o;
	}, [o]);
	let je = C(c);
	x(() => {
		je.current = c;
	}, [c]);
	let Me = y((e) => {
		je.current?.(e);
	}, []), [Ne, Pe] = w([]), Ie = y(() => Pe([]), []), [Le, Re] = w([]), Be = y(() => Re([]), []), [Ve, He] = w({}), Ue = y((e, t) => {
		He((n) => {
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
	}, []), We = C(/* @__PURE__ */ new Map()), Ge = y((e, t) => (We.current.set(e, t), () => {
		We.current.get(e) === t && We.current.delete(e);
	}), []), Ke = C({
		widgets: M,
		ctx: I,
		template: n
	});
	Ke.current = {
		widgets: M,
		ctx: I,
		template: n
	};
	let qe = y(() => {
		let { widgets: e, ctx: t, template: n } = Ke.current;
		return ri(n, e, t, (e, t) => {
			let n = We.current.get(ti(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), Je = y((e) => {
		Ae.current?.(e), e.type === "action" ? Pe((t) => [{
			receivedAt: Date.now(),
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}, ...t].slice(0, oi)) : e.type === "alert" && Re((t) => [{
			receivedAt: Date.now(),
			widgetId: e.widgetId,
			severity: e.severity,
			message: e.message,
			predicate: e.predicate
		}, ...t].slice(0, si));
	}, []), V = y((e, t = "info") => {
		De.current += 1;
		let n = De.current;
		we((r) => [...r, {
			id: n,
			title: e,
			intent: li[t],
			duration: ci
		}].slice(-4));
	}, []), Ye = y(async () => {
		if (!Oe.current) {
			Oe.current = !0, Ee(!0);
			try {
				let e = qe();
				f ? await f(e) : wi(e), V(f ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				V(`Snapshot failed: ${t}`, "error");
			} finally {
				Oe.current = !1, Ee(!1);
			}
		}
	}, [
		f,
		qe,
		V
	]), Xe = y((e) => {
		we((t) => t.filter((t) => t.id !== e));
	}, []), H = y((e, t) => {
		de((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	x(() => {
		if (typeof window > "u") return;
		let e = _r(window.location.search, I), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [I]);
	let Ze = C(l);
	x(() => {
		Ze.current = l;
	}, [l]), x(() => {
		Ze.current?.(I);
	}, [I]);
	let Qe = y((e, t) => {
		ie((n) => mr(n, e, t));
	}, []), U = (e) => ne === "mobile" ? re : ne === "tablet" ? Math.min(e, Math.floor(re / 2)) : Math.min(e, re), W = S(() => ({
		dispatch: Qe,
		ctx: I,
		setCtx: H,
		backendUrl: r,
		backendHeaders: i,
		fetch: a,
		widgets: M,
		refreshIntervalMs: fe ?? void 0,
		toast: V,
		compact: L,
		fullscreenId: z,
		setFullscreenId: ve,
		focusedId: B,
		setFocusedId: ye,
		refreshPulse: be,
		requestRefresh: ke,
		emit: Je,
		emitIntent: Me,
		recentActions: Ne,
		clearRecentActions: Ie,
		recentAlerts: Le,
		clearRecentAlerts: Be,
		soundEnabled: he,
		widgetHealth: Ve,
		reportWidgetHealth: Ue,
		registerWidgetData: Ge,
		snapshot: qe
	}), [
		Qe,
		I,
		H,
		r,
		i,
		a,
		M,
		fe,
		V,
		L,
		z,
		B,
		be,
		ke,
		Je,
		Me,
		Ne,
		Ie,
		Le,
		Be,
		he,
		Ve,
		Ue,
		Ge,
		qe
	]), $e = y((e, t) => {
		V(`Could not ${t.intent} ${t.asset.name}: ${e.message}`, "error"), k?.(e, t);
	}, [k, V]);
	x(() => {
		if (!z) return;
		let e = (e) => {
			e.key === "Escape" && ve(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [z]), x(() => {
		B && typeof document < "u" && document.getElementById(`mt-widget-${B}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [B]), x(() => {
		let e = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			let t = e.target?.tagName;
			if (t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable) return;
			let r = n.shortcuts?.find((t) => t.key === e.key);
			if (r) {
				e.preventDefault();
				for (let [e, t] of Object.entries(r.ctx)) H(e, t);
				return;
			}
			let i = M.map((e) => e.id).filter((e) => !!e);
			if (i.length === 0) return;
			let a = (e) => {
				let t = B ? i.indexOf(B) : -1, n = i[(t + e + i.length) % i.length];
				ye(n);
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
					B && (e.preventDefault(), ve(B));
					break;
				case "r":
					B && (e.preventDefault(), ke(B));
					break;
				case "Escape": B && ye(null);
			}
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		M,
		B,
		ke,
		n.shortcuts,
		H
	]);
	let et = !F && z ? M.find((e) => e.id === z) : null;
	return /* @__PURE__ */ E(Ce.Provider, {
		value: W,
		children: /* @__PURE__ */ E("div", {
			className: `mtc-root mtc-theme-${j}`,
			"data-theme": j,
			"data-density": L ? "compact" : "standard",
			children: /* @__PURE__ */ E(t, {
				theme: j,
				density: L ? "compact" : "standard",
				children: /* @__PURE__ */ E(m, {
					resolveAssetIntent: _,
					renderers: v,
					applicationFrame: b,
					savePreference: ee,
					onError: $e,
					children: /* @__PURE__ */ E(ze, { children: /* @__PURE__ */ D(pr, { children: [
						/* @__PURE__ */ E(Dr, { suggest: u }),
						/* @__PURE__ */ E(Ar, { templateShortcuts: n.shortcuts }),
						/* @__PURE__ */ E(s, {
							toasts: Se,
							onDismiss: Xe
						}),
						P.length > 0 && (!le || se) && /* @__PURE__ */ E(Di, {
							issues: P,
							dismissible: !se,
							onDismiss: () => ue(!0)
						}),
						/* @__PURE__ */ D("div", {
							className: "mtc-workspace min-h-full flex flex-col",
							children: [/* @__PURE__ */ D("div", {
								className: "flex-1",
								children: [(n.title || d === "full") && /* @__PURE__ */ D("div", {
									className: "mtc-toolbar",
									children: [/* @__PURE__ */ D("div", {
										className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
										children: [n.title && /* @__PURE__ */ E("h1", {
											className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
											children: Fe(n.title, I)
										}), d === "full" && /* @__PURE__ */ D("div", {
											className: "ml-auto flex items-center gap-2 flex-wrap",
											children: [
												ce ? /* @__PURE__ */ E(Ci, { frozenAt: n.frozenAt }) : /* @__PURE__ */ D(T, { children: [
													/* @__PURE__ */ E(_i, { health: Ve }),
													/* @__PURE__ */ E(fi, {
														value: fe,
														onChange: pe
													}),
													/* @__PURE__ */ E(vi, { onClick: () => ke("*") })
												] }),
												/* @__PURE__ */ E(yi, {
													enabled: he,
													onToggle: () => ge((e) => !e)
												}),
												/* @__PURE__ */ E(bi, {
													compact: L,
													onToggle: () => me((e) => !e)
												}),
												!ce && /* @__PURE__ */ E(Si, {
													onClick: () => void Ye(),
													busy: Te
												}),
												/* @__PURE__ */ E(xi, { onCopied: () => V("URL copied", "ok") }),
												/* @__PURE__ */ E(pi, {})
											]
										})]
									}), d === "full" && Object.keys(I).length > 0 && /* @__PURE__ */ D("div", {
										className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ E("span", {
											className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 mr-1",
											children: "Context"
										}), Object.entries(I).map(([e, t]) => e === "range" ? /* @__PURE__ */ E(ui, {
											value: t,
											onChange: (t) => H(e, t)
										}, e) : /* @__PURE__ */ D("div", {
											className: "mtc-context-chip px-2 py-1 text-[11px]",
											children: [/* @__PURE__ */ E("span", {
												className: "text-zinc-500 mr-1",
												children: e
											}), /* @__PURE__ */ E("span", {
												className: "text-zinc-100 font-mono",
												children: t
											})]
										}, e))]
									})]
								}), /* @__PURE__ */ E("div", {
									className: "p-3 md:p-5",
									children: /* @__PURE__ */ E("div", {
										className: "grid gap-3 md:gap-4 items-start",
										style: { gridTemplateColumns: `repeat(${re}, 1fr)` },
										children: F ? /* @__PURE__ */ E(Oi, { issues: oe }) : M.map((e, t) => /* @__PURE__ */ E("div", {
											id: e.id ? `mt-widget-${e.id}` : void 0,
											style: { gridColumn: `span ${U(e.span || 6)}` },
											children: /* @__PURE__ */ E(ur, {
												config: e,
												contentHeight: e.height || ii[e.component] || 280,
												snapshotKey: ti(e, t),
												registry: A
											})
										}, e.id || t))
									})
								})]
							}), d === "full" && /* @__PURE__ */ E(gi, {})]
						}),
						et && /* @__PURE__ */ E(ki, {
							widget: et,
							registry: A,
							onClose: () => ve(null)
						})
					] }) })
				})
			})
		})
	});
}
function Di({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ D("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ D("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ D("div", {
				className: "font-medium text-[length:var(--mtc-font-size-xs)] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ D("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ D("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ E("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ E("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ E("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ D("li", {
					className: "opacity-60 text-[length:var(--mtc-font-size-xs)]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ E("button", {
			onClick: n,
			className: "text-[length:var(--mtc-font-size-xs)] opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function Oi({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ D("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ E("div", {
				className: "font-medium text-xs mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ E("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ D("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ D("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ E("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ E("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ E("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ D("li", {
					className: "opacity-60 text-[length:var(--mtc-font-size-xs)]",
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
	return /* @__PURE__ */ D("div", {
		className: "fixed inset-0 z-30 bg-zinc-950 p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: n,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Fullscreen ${e.title ?? e.id ?? e.component}`,
		children: [/* @__PURE__ */ D("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ E("span", {
				className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ E("button", {
				onClick: n,
				autoFocus: !0,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ E("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ E(ur, {
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
	}, [b]), n.length === 0 ? null : /* @__PURE__ */ E("div", {
		className: `mtc-root mtc-theme-${y}`,
		"data-theme": y,
		children: /* @__PURE__ */ E(t, {
			theme: y,
			density: v?.density ?? "standard",
			children: /* @__PURE__ */ D("div", {
				className: "mtc-workspace min-h-full",
				children: [/* @__PURE__ */ E(Fi, {
					tabs: n,
					activeIndex: b,
					onSelect: i
				}), n.map((e, t) => /* @__PURE__ */ E("div", {
					style: { display: t === b ? "block" : "none" },
					children: S.has(t) && /* @__PURE__ */ E(Ei, {
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
	return /* @__PURE__ */ E("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ D("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ E("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ E("span", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 font-mono ",
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
export { jt as $, Jn as A, ve as At, vn as B, te as Bt, pr as C, Oe as Ct, ar as D, Ie as Dt, or as E, Me as Et, Xn as F, ue as Ft, en as G, tn as H, Zn as I, le as It, Jt as J, Kt as K, Qn as L, F as Lt, Kn as M, xe as Mt, Yn as N, Se as Nt, rr as O, Ce as Ot, tr as P, _e as Pt, Gt as Q, er as R, j as Rt, dr as S, Ee as St, ur as T, Fe as Tt, nn as U, _n as V, O as Vt, rn as W, Wt as X, qt as Y, zt as Z, br as _, ze as _t, ni as a, kt as at, _r as b, je as bt, Fr as c, wt as ct, Lr as d, at as dt, Ct as et, jr as f, it as ft, xr as g, Le as gt, Sr as h, Ve as ht, ri as i, bt as it, qn as j, ye as jt, ir as k, we as kt, Pr as l, Tt as lt, Ar as m, He as mt, Ii as n, St as nt, ti as o, Et as ot, Mr as p, st as pt, Yt as q, Ei as r, xt as rt, Nr as s, At as st, Pi as t, Mt as tt, Q as u, rt as ut, yr as v, Re as vt, fr as w, ke as wt, mr as x, De as xt, gr as y, Ae as yt, Gn as z, k as zt };
