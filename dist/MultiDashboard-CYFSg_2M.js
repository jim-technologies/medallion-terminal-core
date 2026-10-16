import { C as e, l as t, n, r, w as i } from "./States-CiMJksHr.js";
import { i as a } from "./utils-8rNbW-NI.js";
import { _ as o, c as s, f as c, m as l, n as u, s as d, t as f, u as p } from "./sourceError-CbVcdlUG.js";
import { t as m } from "./useBreakpoint-CvBnDyn0.js";
import { c as h, t as g } from "./AssetOpen-BBXywwal.js";
import { o as _ } from "./basemaps-BjEaZSH5.js";
import { Suspense as v, createContext as y, lazy as b, useCallback as x, useContext as S, useEffect as C, useMemo as w, useRef as T, useState as E } from "react";
import { Fragment as D, jsx as O, jsxs as k } from "react/jsx-runtime";
//#region src/core/connectFraming.ts
var A = "application/connect+json", j = new TextDecoder();
async function M(e, t) {
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
					e.length > 0 && (a = JSON.parse(j.decode(e)));
				} catch {}
				t.isDisposed() || t.onTrailer?.(a);
				return;
			}
			let a = n.subarray(r + 5, r + 5 + i);
			r += 5 + i;
			try {
				let e = JSON.parse(j.decode(a));
				t.isDisposed() || t.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
//#region src/core/getNested.ts
function N(e, t) {
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
function ee(e) {
	return e.inline ?? e.data;
}
function te(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function ne(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function P(e) {
	e.signal.aborted || e.abort();
}
var re = 3e4, ie = 1e3;
function ae(e, t) {
	return t ? N(e, t) : e;
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
function I(e, t = {}) {
	let n = t.fetch, [r, i] = E(null), [a, o] = E(!0), [c, l] = E(null), [u, m] = E(null), [h, g] = E(!1), [_, v] = E(null), [y, b] = E(0), S = x(() => b((e) => e + 1), []), D = T(ie), O = T(void 0), k = T(null), j = T(void 0), N = T(0), F = x((t) => {
		let n = ae(oe(t), e?.transform);
		i(n), l(null), o(!1), m(Date.now()), N.current = Date.now();
	}, [e?.transform]), I = x((t) => {
		let n = e?.throttleMs ?? 0;
		if (n <= 0) {
			F(t);
			return;
		}
		let r = Date.now() - N.current;
		if (r >= n) {
			F(t);
			return;
		}
		k.current = t, j.current ||= setTimeout(() => {
			k.current !== null && F(k.current), k.current = null, j.current = void 0;
		}, n - r);
	}, [F, e?.throttleMs]), se = w(() => e ? JSON.stringify([
		e.url,
		e.source_id,
		e.method,
		e.body,
		e.headers,
		e.stream,
		te(e),
		e.transform,
		e.throttleMs,
		e.inline !== void 0 || e.data !== void 0
	]) : "", [e]), L = e ? ee(e) : void 0;
	return C(() => {
		if (!e) {
			o(!1);
			return;
		}
		if (L !== void 0) {
			I(L);
			return;
		}
		if (!e.url) {
			o(!1);
			return;
		}
		if (e.stream === "connect") {
			let t = !1, r = new AbortController(), i = async () => {
				if (!t) try {
					let i = await (n ?? globalThis.fetch)(e.url, {
						method: "POST",
						headers: {
							...e.headers,
							"Content-Type": A
						},
						body: JSON.stringify(e.body ?? {}),
						signal: r.signal
					});
					if (!i.ok) throw await d(i);
					if (!i.body) throw new f("Stream response has no body", { kind: "unavailable" });
					g(!0), v(null), l(null), D.current = ie;
					let a = i.body.getReader();
					await M(a, {
						onMessage: I,
						onTrailer: (e) => {
							if (e.error) {
								let n = e.error.code ?? "unknown", r = e.error.message ?? "stream error";
								t || l(new f(r, {
									kind: s(n),
									code: n
								}));
							}
						},
						isDisposed: () => t
					}), a.releaseLock();
				} catch (e) {
					!t && e instanceof Error && !ne(e) && l(p(e));
				} finally {
					if (!t) {
						g(!1);
						let e = D.current;
						v(Date.now() + e), O.current = setTimeout(() => {
							D.current = Math.min(D.current * 2, re), i();
						}, e);
					}
				}
			};
			return i(), () => {
				t = !0, P(r), clearTimeout(O.current), g(!1), v(null);
			};
		}
		if (e.stream === !0) {
			let t = null, n = !1, r = () => {
				n || (t = new EventSource(e.url), t.onopen = () => {
					g(!0), v(null), l(null), D.current = ie;
				}, t.onmessage = (e) => {
					try {
						I(JSON.parse(e.data));
					} catch {
						l(new f("Failed to parse stream", { kind: "unknown" }));
					}
				}, t.onerror = () => {
					if (t?.close(), g(!1), !n) {
						let e = D.current;
						v(Date.now() + e), O.current = setTimeout(() => {
							D.current = Math.min(D.current * 2, re), r();
						}, e);
					}
				});
			};
			return r(), () => {
				n = !0, clearTimeout(O.current), t?.close(), g(!1), v(null);
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
					if (!r.ok) throw await d(r);
					let a = await r.json();
					t || I(a);
				} catch (e) {
					!t && e instanceof Error && !ne(e) && l(p(e));
				} finally {
					r = !1, t || o(!1);
				}
			}
		};
		a();
		let c, u = te(e);
		return u && u > 0 && (c = setInterval(() => void a(), u)), () => {
			t = !0, P(i), c && clearInterval(c);
		};
	}, [
		se,
		I,
		L,
		y,
		n
	]), C(() => () => {
		j.current && clearTimeout(j.current);
	}, []), {
		data: r,
		loading: a,
		sourceError: c,
		lastUpdated: u,
		connected: h,
		nextRetryAt: _,
		refresh: S
	};
}
//#endregion
//#region src/core/WidgetStates.tsx
var se = {
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
function L({ component: e }) {
	switch (e ? se[e] : "block") {
		case "chart": return /* @__PURE__ */ O(R, {});
		case "table": return /* @__PURE__ */ O(ue, {});
		case "list": return /* @__PURE__ */ O(z, {});
		case "single": return /* @__PURE__ */ O(de, {});
		case "donut": return /* @__PURE__ */ O(fe, {});
		case "grid": return /* @__PURE__ */ O(pe, {});
		default: return /* @__PURE__ */ O(me, {});
	}
}
function ce({ children: e, padded: t }) {
	return /* @__PURE__ */ O(n, {
		title: e,
		compact: !0,
		icon: /* @__PURE__ */ O("span", {
			className: "text-xs leading-none",
			children: "· ·  ·"
		}),
		className: `h-full${t ? " px-4" : ""}`
	});
}
var le = [
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
function R() {
	return /* @__PURE__ */ O("div", {
		className: "h-full flex items-end gap-1",
		children: le.map((e, t) => /* @__PURE__ */ O("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${e}%`,
				animationDelay: `${t * 40}ms`
			}
		}, t))
	});
}
function ue() {
	let e = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ k("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ O("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: e.map((e, t) => /* @__PURE__ */ O("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: e }
			}, t))
		}), Array.from({ length: 5 }).map((t, n) => /* @__PURE__ */ O("div", {
			className: "flex gap-4",
			children: e.map((e, t) => /* @__PURE__ */ O("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: e,
					animationDelay: `${(n * 3 + t) * 50}ms`
				}
			}, t))
		}, n))]
	});
}
function z() {
	return /* @__PURE__ */ O("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ k("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ O("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ k("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ O("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + t * 11 % 30}%`,
						animationDelay: `${t * 80}ms`
					}
				}), /* @__PURE__ */ O("div", {
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
function de() {
	return /* @__PURE__ */ k("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ O("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ O("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function fe() {
	return /* @__PURE__ */ k("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ O("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ O("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ O("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ O("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ k("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ O("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ O("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${t * 60}ms` }
				})]
			}, t))
		})]
	});
}
function pe() {
	return /* @__PURE__ */ O("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ O("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${t * 25}ms` }
		}, t))
	});
}
function me() {
	return /* @__PURE__ */ O("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
//#region src/core/Placeholder.tsx
function he(e) {
	return /* @__PURE__ */ O(ce, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var B = (e, t) => b(() => e().then((e) => ({ default: e[t] }))), V = /* @__PURE__ */ new Map([
	["timeseries", B(() => import("./Timeseries-C6zCf_eE.js").then((e) => e.n), "Timeseries")],
	["candlestick", B(() => import("./Candlestick-BT38jOIC.js").then((e) => e.n), "Candlestick")],
	["table", B(() => import("./DataTable-DRwCwdOf.js").then((e) => e.n), "DataTable")],
	["metric", B(() => import("./Metric-CsN3_xvB.js").then((e) => e.n), "Metric")],
	["text", B(() => import("./Text-BuT-DQpX.js").then((e) => e.n), "Text")],
	["conversation", B(() => import("./ConversationImpl-Ci9vdL7C.js"), "ConversationImpl")],
	["prompt", B(() => import("./Prompt-GZ8TFTYm.js").then((e) => e.n), "Prompt")],
	["gauge", B(() => import("./Gauge-CAmtofYw.js").then((e) => e.n), "Gauge")],
	["distribution", B(() => import("./Distribution-Cj_bjxhN.js").then((e) => e.n), "Distribution")],
	["heatmap", B(() => import("./Heatmap-DZ4LXvRw.js").then((e) => e.n), "Heatmap")],
	["events", B(() => import("./Events-mLy1oLtu.js").then((e) => e.n), "Events")],
	["catalog", B(() => import("./Catalog-BLmMntS1.js").then((e) => e.n), "Catalog")],
	["asset_catalog", B(() => import("./AssetCatalog-CrIM_gEu.js").then((e) => e.n), "AssetCatalog")],
	["object_view", B(() => import("./ObjectView-ChGrf5xc.js").then((e) => e.n), "ObjectView")],
	["code_browser", B(() => import("./CodeBrowser-CkWnWgt9.js").then((e) => e.n), "CodeBrowser")],
	["record_grid", B(() => import("./RecordGrid-DjKMFnMI.js").then((e) => e.n), "RecordGrid")],
	["record_board", B(() => import("./RecordBoard-1jZXgu1t.js").then((e) => e.n), "RecordBoard")],
	["record_calendar", B(() => import("./RecordCalendar-xGhkh-5j.js").then((e) => e.n), "RecordCalendar")],
	["record_form", B(() => import("./RecordForm-DPnhYyuI.js").then((e) => e.n), "RecordForm")],
	["action_form", B(() => import("./ActionForm-Db_7Eys4.js").then((e) => e.n), "ActionForm")],
	["orderbook", B(() => import("./OrderBook-CJfmpoW4.js").then((e) => e.n), "OrderBook")],
	["depth_chart", B(() => import("./DepthChart-CKybQMhc.js").then((e) => e.n), "DepthChart")],
	["paired_grid", B(() => import("./PairedGrid-BVTFGDJs.js").then((e) => e.n), "PairedGrid")],
	["trade", B(() => import("./Trade-CxoEPrK9.js").then((e) => e.n), "Trade")],
	["ticker", B(() => import("./Ticker-BlhdXGYw.js").then((e) => e.n), "Ticker")],
	["volume_profile", B(() => import("./VolumeProfile-DgTQetfH.js").then((e) => e.n), "VolumeProfile")],
	["stat_strip", B(() => import("./StatStrip-DJTwdzxE.js").then((e) => e.n), "StatStrip")],
	["bar_chart", B(() => import("./BarChart-GOwnoatx.js").then((e) => e.n), "BarChart")],
	["scatter", B(() => import("./Scatter-CyHbrI3s.js").then((e) => e.n), "Scatter")],
	["clock", B(() => import("./Clock-DA6Mrw0W.js").then((e) => e.n), "Clock")],
	["treemap", B(() => import("./Treemap-D0GrjokB.js").then((e) => e.n), "Treemap")],
	["image", B(() => import("./Image-UKWOw58k.js").then((e) => e.n), "Image")],
	["iframe", B(() => import("./Iframe-BAFM6byB.js").then((e) => e.n), "Iframe")],
	["histogram", B(() => import("./Histogram-DdxBhfUj.js").then((e) => e.n), "Histogram")],
	["section", B(() => import("./Section-CxTsBmHT.js").then((e) => e.n), "Section")],
	["area_chart", B(() => import("./AreaChart-DpfWD1lh.js").then((e) => e.n), "AreaChart")],
	["slider", B(() => import("./Slider-DjSwTrdX.js").then((e) => e.n), "Slider")],
	["select", B(() => import("./Select-BPrdg1AH.js").then((e) => e.n), "Select")],
	["boxplot", B(() => import("./Boxplot-CB1r8LUb.js").then((e) => e.n), "Boxplot")],
	["radar", B(() => import("./Radar-B6G-ASg4.js").then((e) => e.n), "Radar")],
	["dag", B(() => import("./Dag-XUXwuUqw.js").then((e) => e.n), "Dag")],
	["geo_map", B(() => import("./GeoMap-DXiqUFf_.js").then((e) => e.n), "GeoMap")],
	["media_gallery", B(() => import("./MediaGalleryImpl-BBeF1ro7.js"), "MediaGalleryImpl")],
	["multi_select", B(() => import("./MultiSelect-ZMhu0j3J.js").then((e) => e.n), "MultiSelect")],
	["json", B(() => import("./Json-CqBfqu8z.js").then((e) => e.n), "Json")],
	["sparkline", B(() => import("./Sparkline-c7_6FNPK.js").then((e) => e.n), "Sparkline")],
	["action_log", B(() => import("./ActionLog-evybB4bd.js").then((e) => e.n), "ActionLog")],
	["alert_log", B(() => import("./AlertLog-BK8hyge0.js").then((e) => e.n), "AlertLog")],
	["tape", B(() => import("./Tape-Tt7PdIGI.js").then((e) => e.n), "Tape")],
	["file_browser", B(() => import("./FileBrowser-DE6PB6GI.js").then((e) => e.n), "FileBrowser")]
]), ge = new Set(V.keys()), _e = class {
	#e;
	constructor(e = {}) {
		this.#e = e.includeBuiltIns === !1 ? /* @__PURE__ */ new Map() : new Map(V);
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
	return new _e(e);
}
var H = new Map(V);
function ye(e, t) {
	return (t ? t.get(e) : H.get(e)) || he;
}
function be(e, t) {
	H.set(e, t);
}
var xe = y({
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
function Se() {
	return S(xe);
}
//#endregion
//#region src/core/resolveSource.ts
var Ce = "medallion.terminal.v1.TerminalService";
function we(e) {
	return `${e.replace(/\/$/, "")}/${Ce}/Generate`;
}
function Te(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function Ee(e) {
	return `${e.replace(/\/$/, "")}/${Ce}/SubmitAction`;
}
function De(e) {
	return `${e.replace(/\/$/, "")}/${Ce}/WatchAction`;
}
function Oe(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function ke(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function Ae() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var je = !1, Me = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function Ne(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new Me(r);
		return "";
	});
}
function Pe(e, t, n, r = {}) {
	if (e.source_id) {
		if (n === void 0) return je ||= (console.warn(`[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), e;
		let i = e.stream ? "Stream" : "Get", a = n.replace(/\/$/, ""), o = {};
		if (e.params) for (let [n, r] of Object.entries(e.params)) o[n] = Ne(r, t, { strict: !0 });
		return {
			url: `${a}/${Ce}/${i}`,
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
		let n = Ne(e.url, t, { strict: !0 });
		if (e.params && Object.keys(e.params).length > 0) {
			let r = Object.entries(e.params).map(([e, n]) => `${encodeURIComponent(e)}=${encodeURIComponent(Ne(n, t, { strict: !0 }))}`).join("&");
			n = n.includes("?") ? `${n}&${r}` : `${n}?${r}`;
		}
		i.url = n;
	}
	return i;
}
//#endregion
//#region src/core/NowContext.tsx
var Fe = y({
	now: 0,
	subscribe: () => () => {}
});
function Ie(e = !0) {
	let { now: t, subscribe: n } = S(Fe);
	return C(() => {
		if (e) return n();
	}, [e, n]), t;
}
function Le({ children: e }) {
	let [t, n] = E(() => Date.now()), r = T(0), i = T(null), a = w(() => ({
		now: t,
		subscribe: () => (r.current += 1, i.current ??= setInterval(() => n(Date.now()), 1e3), () => {
			r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
		})
	}), [t]);
	return C(() => () => {
		i.current != null && clearInterval(i.current);
	}, []), /* @__PURE__ */ O(Fe.Provider, {
		value: a,
		children: e
	});
}
//#endregion
//#region src/core/alerts.ts
var Re = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function ze(e, t) {
	let n = Ve(t);
	return n ? Ge(n, e) : !1;
}
function Be(e) {
	return Ve(e) !== null;
}
function Ve(e) {
	let t = e.trim();
	if (!t) return null;
	let n = He(t, "||"), r = [];
	for (let e of n) {
		let t = He(e, "&&"), n = [];
		for (let e of t) {
			let t = Ue(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function He(e, t) {
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
function Ue(e) {
	let t = e.trim().match(Re);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: We(i.trim())
	};
}
function We(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function Ge(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!Ke(N(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function Ke(e, t, n) {
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
var qe = {
	warn: 720,
	error: 480
}, Je = 160, U = .08, Ye = null;
function Xe() {
	if (typeof window > "u") return null;
	if (Ye) return Ye;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (Ye = new t(), Ye) : null;
}
function Ze(e) {
	let t = qe[e];
	if (!t) return;
	let n = Xe();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime(U, a + .02), i.gain.linearRampToValueAtTime(0, a + Je / 1e3), r.start(a), r.stop(a + Je / 1e3 + .05);
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
//#region src/core/WidgetShell.tsx
function or(e, t) {
	if (!t) return null;
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "just now";
	if (n < 60) return `${n}s ago`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function sr(e) {
	let { resolution: n, loading: i, error: a, data: o, options: s, component: c, widgetId: l, Component: u, onRenderError: d, onRetry: f } = e;
	return n.error ? /* @__PURE__ */ O(r, { message: n.error }) : i ? /* @__PURE__ */ O(L, { component: c }) : a ? /* @__PURE__ */ O(t, {
		error: a,
		onRetry: f,
		compact: !0,
		className: "h-full"
	}) : /* @__PURE__ */ O("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ O(h, {
			onError: d,
			children: /* @__PURE__ */ O(v, {
				fallback: /* @__PURE__ */ O(L, { component: c }),
				children: /* @__PURE__ */ O(u, {
					data: o,
					options: s,
					widgetId: l
				})
			})
		})
	});
}
function cr({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: a, fullscreenId: o, setFullscreenId: s } = Se(), [c, l] = E(!1), [u, d] = E(!1), [f, p] = E(!1), m = T(null);
	C(() => {
		if (!c) return;
		let e = (e) => {
			m.current && !m.current.contains(e.target) && (l(!1), d(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [c]);
	let h = e.source, g = h?.data !== void 0 && !h.url && !h.source_id, _ = !!h && !g, v = !!e.id, y = !!e.id && o !== e.id, b = t == null ? 0 : rr({
		data: t,
		component: e.component
	}), x = b > 0, S = async (n) => {
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
	return /* @__PURE__ */ k("div", {
		className: "relative",
		ref: m,
		children: [/* @__PURE__ */ O("button", {
			onClick: () => l((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			"aria-expanded": c,
			children: "⋮"
		}), c && /* @__PURE__ */ k("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				_ && /* @__PURE__ */ O("button", {
					onClick: () => {
						n(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ O("button", {
					onClick: async () => {
						await r(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				x && /* @__PURE__ */ k("div", { children: [/* @__PURE__ */ k("button", {
					onClick: () => d((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": u,
					children: [/* @__PURE__ */ k("span", { children: ["Export", f ? "…" : ""] }), /* @__PURE__ */ O("span", {
						className: "text-zinc-600",
						children: u ? "▾" : "▸"
					})]
				}), u && /* @__PURE__ */ O("div", {
					className: "bg-zinc-950/60",
					children: qn.map((e) => /* @__PURE__ */ O("button", {
						onClick: () => S(e.key),
						disabled: f,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				y && /* @__PURE__ */ O("button", {
					onClick: () => {
						s(e.id), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				v && /* @__PURE__ */ O("button", {
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
	let { ctx: i, backendUrl: a, backendHeaders: o, refreshIntervalMs: s, compact: c, toast: l, focusedId: d, setFocusedId: f, refreshPulse: p, emit: m, soundEnabled: h, reportWidgetHealth: g, registerWidgetData: _ } = Se(), v = w(() => e.title ? Ne(e.title, i) : e.title, [e.title, i]), y = w(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = Pe(e.source, i, a, o);
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
	]), b = y.source, { fetch: x } = Se(), { data: S, loading: E, sourceError: D, lastUpdated: A, connected: j, nextRetryAt: M, refresh: N } = I(b, { fetch: e.source?.source_id ? x : void 0 }), ee = ye(e.component, r), te = T(S);
	te.current = S, C(() => {
		if (n) return _(n, () => te.current);
	}, [n, _]);
	let ne = !!b?.stream || !!(b?.refreshIntervalMs ?? b?.refreshInterval), P = b?.staleAfterMs, re = Ie(ne && A != null || M != null || !!P && A != null), ie = !!P && A != null && re - A > P, ae = T(0);
	C(() => {
		if (!p) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = p.id === "*";
		n && t === "self" || (n || p.id === e.id) && p.n > ae.current && (ae.current = p.n, N());
	}, [
		p,
		e.id,
		e.refresh_policy,
		N
	]);
	let F = T(!1);
	C(() => {
		let t = e.alert;
		if (!t || S == null) {
			F.current = !1;
			return;
		}
		let n = ze(S, t.when);
		if (n && !F.current) {
			let n = Ne(t.message, i), r = t.severity ?? "warn";
			l(n, r), m({
				type: "alert",
				widgetId: e.id,
				severity: r,
				message: n,
				predicate: t.when
			}), h && Ze(r);
		}
		F.current = n;
	}, [
		S,
		e.alert,
		i,
		l,
		m,
		e.id,
		h
	]);
	let oe = T(null), se = w(() => D ? u(D) : null, [D]);
	C(() => {
		let t = y.error ?? se, n = y.error ? "resolve" : "data";
		t && t !== oe.current ? (m({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), oe.current = t) : t || (oe.current = null);
	}, [
		y.error,
		se,
		m,
		e.id,
		e.component
	]), C(() => {
		if (!e.id) return;
		let t = !!b?.stream;
		return g(e.id, {
			title: v || e.title || e.component,
			streaming: t,
			connected: !t || j,
			error: y.error ?? se,
			stale: ie
		}), () => g(e.id, null);
	}, [
		e.id,
		v,
		e.title,
		e.component,
		b?.stream,
		j,
		y.error,
		se,
		ie,
		g
	]);
	let L = !!e.id && d === e.id, ce = e.id ? () => f(e.id) : void 0;
	return /* @__PURE__ */ k("div", {
		onClick: ce,
		className: "mtc-widget overflow-hidden",
		"data-focused": L ? "true" : "false",
		children: [v && /* @__PURE__ */ k("div", {
			className: `mtc-widget-header ${c ? "px-2 py-1" : "px-3 py-1.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ O("h2", {
				className: `${c ? "text-[length:var(--mtc-font-size-md)]" : "text-[length:var(--mtc-font-size-lg)]"} font-semibold text-zinc-100 truncate`,
				children: v
			}), /* @__PURE__ */ k("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					ne && A && /* @__PURE__ */ k("span", {
						className: `text-[11px] ${ie ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [ie ? "stale · " : "", or(re, A)]
					}),
					e.source?.stream && !j && M != null && /* @__PURE__ */ k("span", {
						className: "text-[11px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((M - re) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ O("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${j ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: j ? "Connected" : M ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ O(cr, {
						widget: e,
						data: S,
						onToast: l,
						onRefresh: N,
						onCopy: async () => {
							if (S == null) return l("No data to copy", "warn"), !1;
							if (typeof navigator > "u" || !navigator.clipboard) return l("Clipboard unavailable", "warn"), !1;
							try {
								return await navigator.clipboard.writeText(JSON.stringify(S, null, 2)), l(`${e.title ?? e.component} copied`, "ok"), !0;
							} catch {
								return l("Clipboard blocked", "warn"), !1;
							}
						}
					})
				]
			})]
		}), /* @__PURE__ */ O("div", {
			className: c ? "p-2.5" : "p-4",
			style: { height: c ? Math.round(t * .92) : t },
			children: sr({
				resolution: y,
				loading: E,
				error: D,
				data: S,
				options: e.options,
				component: e.component,
				widgetId: e.id,
				Component: ee,
				onRenderError: (t) => m({
					type: "widget_error",
					widgetId: e.id,
					component: e.component,
					message: t.message,
					source: "render"
				}),
				onRetry: b && b.inline === void 0 && b.data === void 0 ? N : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/HoverContext.tsx
var ur = y({
	hoverTime: null,
	setHoverTime: () => {}
});
function dr() {
	return S(ur);
}
function fr({ children: e }) {
	let [t, n] = E(null), r = w(() => ({
		hoverTime: t,
		setHoverTime: n
	}), [t]);
	return /* @__PURE__ */ O(ur.Provider, {
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
//#region src/core/dashboardPrefs.ts
var _r = "medallion-terminal:";
function vr(e) {
	let t = /* @__PURE__ */ new Map();
	return {
		read(n, r) {
			if (!e) return r;
			try {
				let i = e.getItem(_r + n), a = i == null ? r : JSON.parse(i);
				return t.set(n, JSON.stringify(a)), a;
			} catch {
				return r;
			}
		},
		write(n, r) {
			if (!e) return;
			let i = JSON.stringify(r);
			if (t.get(n) !== i) try {
				e.setItem(_r + n, i), t.set(n, i);
			} catch {}
		}
	};
}
function yr() {
	try {
		return typeof window > "u" ? void 0 : window.localStorage;
	} catch {
		return;
	}
}
//#endregion
//#region src/core/savedViews.ts
var br = "medallion-terminal:view:";
function xr(e, t) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(br + e, JSON.stringify(t));
	} catch {}
}
function Sr(e) {
	if (!e || typeof window > "u" || !window.localStorage) return null;
	try {
		let t = window.localStorage.getItem(br + e);
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
function Cr() {
	if (typeof window > "u" || !window.localStorage) return [];
	let e = [];
	for (let t = 0; t < window.localStorage.length; t++) {
		let n = window.localStorage.key(t);
		n && n.startsWith(br) && e.push(n.slice(24));
	}
	return e.sort();
}
function wr(e) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.removeItem(br + e);
	} catch {}
}
//#endregion
//#region src/core/CommandPalette.tsx
var Tr = /* @__PURE__ */ new Set([
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
]), Er = 150, Dr = 8;
function Or(e, t) {
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
	} : Tr.has(n.toLowerCase()) ? {
		kind: "set",
		key: "range",
		value: n.toLowerCase()
	} : {
		kind: "set",
		key: t,
		value: n
	};
}
function kr({ suggest: e } = {}) {
	let { ctx: t, setCtx: n, toast: r } = Se(), [i, a] = E(!1), [s, c] = E(""), [u, d] = E([]), [f, p] = E([]), m = T(0);
	C(() => {
		i || (c(""), p([]));
	}, [i]), C(() => {
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
				p(r.slice(0, Dr));
			} catch {
				n === m.current && p([]);
			}
		}, Er);
		return () => clearTimeout(r);
	}, [
		s,
		i,
		e
	]);
	let h = w(() => Object.keys(t)[0] ?? "symbol", [t]), g = w(() => i ? Cr() : [], [i, u]), _ = (e) => {
		let i = Or(e, h);
		if (i && i.kind !== "noop") {
			if (i.kind === "save") xr(i.name, t), r(`Saved "${i.name}"`, "ok");
			else if (i.kind === "load") {
				let e = Sr(i.name);
				if (!e) r(`No view named "${i.name}"`, "warn");
				else {
					for (let [t, r] of Object.entries(e)) n(t, r);
					r(`Loaded "${i.name}"`, "ok");
				}
			} else if (i.kind === "delete") wr(i.name), r(`Deleted "${i.name}"`, "ok");
			else if (i.kind === "set") n(i.key, i.value);
			else if (i.kind === "set_many") for (let [e, t] of i.pairs) n(e, t);
			d((t) => [e, ...t.filter((t) => t !== e)].slice(0, 5));
		}
	}, v = w(() => [
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
	return /* @__PURE__ */ O(l, {
		open: i,
		onOpenChange: a,
		query: s,
		onQueryChange: c,
		groups: v,
		onSelect: y,
		onSubmit: _,
		autoHighlight: !1,
		label: "Dashboard commands",
		placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
		footer: /* @__PURE__ */ k(D, { children: [
			/* @__PURE__ */ k("span", { children: [/* @__PURE__ */ O(o, { children: "↵" }), " apply"] }),
			/* @__PURE__ */ k("span", { children: [
				/* @__PURE__ */ O(o, { children: "↑" }),
				" ",
				/* @__PURE__ */ O(o, { children: "↓" }),
				" pick"
			] }),
			/* @__PURE__ */ k("span", { children: [/* @__PURE__ */ O(o, { children: "Esc" }), " close"] }),
			b.length > 0 && /* @__PURE__ */ O("span", {
				className: "mtc-command-context",
				children: b.map(([e, t]) => `${e}=${t}`).join(" · ")
			})
		] })
	});
}
//#endregion
//#region src/core/ShortcutsOverlay.tsx
var Ar = [
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
function jr(e) {
	return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")}`;
}
function Mr({ templateShortcuts: e }) {
	let [t, n] = E(!1);
	return C(() => {
		let e = (e) => {
			e.defaultPrevented || e.isComposing || (e.key === "?" && !a(e.target) ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1));
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ O("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ k("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ k("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ O("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ O("span", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ k("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [Ar.map((e, t) => /* @__PURE__ */ k("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ O("kbd", {
						className: "text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ O("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ k(D, { children: [/* @__PURE__ */ O("div", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ k("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ O("kbd", {
						className: "text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ O("span", {
						className: "text-xs text-zinc-400",
						children: jr(e)
					})]
				}, `tpl-${t}`))] })]
			})]
		})
	}) : null;
}
//#endregion
//#region src/core/validateTemplate.ts
var Nr = /* @__PURE__ */ new Set(/* @__PURE__ */ "timeseries.candlestick.table.metric.text.conversation.prompt.gauge.distribution.heatmap.events.catalog.asset_catalog.object_view.code_browser.record_grid.record_board.record_calendar.record_form.action_form.orderbook.depth_chart.paired_grid.trade.ticker.volume_profile.stat_strip.bar_chart.scatter.clock.treemap.image.iframe.histogram.section.area_chart.slider.select.boxplot.radar.dag.geo_map.media_gallery.multi_select.json.sparkline.action_log.alert_log.tape.file_browser".split("."));
function Pr(e, t, n = {}) {
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
	let i = n.includeBuiltIns === !1 ? new Set(t ?? []) : t ? /* @__PURE__ */ new Set([...Nr, ...t]) : Nr;
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
			_(e.options.basemap, e.options.style_url);
		} catch (t) {
			let i = e.options.basemap == null ? "style_url" : "basemap";
			r.push({
				path: `${n}.options.${i}`,
				severity: "error",
				message: t instanceof Error ? t.message : "invalid basemap configuration"
			});
		}
		e.alert && ((typeof e.alert.when != "string" || !Be(e.alert.when)) && r.push({
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
var Fr = "", Ir = [
	"authorization",
	"cookie",
	"proxy-authorization",
	"set-cookie",
	"x-api-key",
	"x-auth-token",
	"x-csrf-token",
	"x-xsrf-token"
], Lr = [
	"allow-downloads",
	"allow-popups-to-escape-sandbox",
	"allow-top-navigation",
	"allow-top-navigation-by-user-activation"
], $ = {
	allowRelativeUrls: !0,
	allowedUrlOrigins: [],
	allowedBasemapPresets: [],
	disallowedHeaders: Ir,
	minRefreshIntervalMs: 1e3,
	iframeSandbox: {
		disallowedTokens: Lr,
		allowScriptsWithSameOrigin: !1
	}
}, Rr = [
	"url",
	"upload_url",
	"search_url",
	"ingest_url",
	"download_url",
	"media_url_template",
	"style_url"
];
function zr(e, t = $) {
	let n = [], r = Br(t);
	return !e || typeof e != "object" || !Array.isArray(e.widgets) ? [{
		path: "widgets",
		severity: "error",
		message: "template.widgets must be an array"
	}] : (e.widgets.forEach((e, t) => {
		if (!e || typeof e != "object") return;
		let i = `widgets[${t}]`;
		e.source && Ur(e.source, `${i}.source`, r, n), Wr(e, i, r, n), e.component === "iframe" && Kr(e, i, r, n), e.component === "image" && qr(e, i, r, n), e.component === "media_gallery" && Jr(e, i, r, n);
	}), n);
}
function Br(e) {
	let t = $.iframeSandbox;
	return {
		allowedUrlOrigins: Vr(e.allowedUrlOrigins ?? $.allowedUrlOrigins),
		allowedIframeOrigins: Vr(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
		allowRelativeUrls: e.allowRelativeUrls ?? $.allowRelativeUrls,
		allowedBasemapPresets: new Set(e.allowedBasemapPresets ?? $.allowedBasemapPresets),
		allowedHeaders: e.allowedHeaders ? Hr(e.allowedHeaders) : void 0,
		disallowedHeaders: Hr(e.disallowedHeaders ?? $.disallowedHeaders),
		minRefreshIntervalMs: e.minRefreshIntervalMs ?? $.minRefreshIntervalMs,
		maxRefreshIntervalMs: e.maxRefreshIntervalMs,
		iframeSandbox: {
			requiredTokens: [...t.requiredTokens ?? [], ...e.iframeSandbox?.requiredTokens ?? []],
			disallowedTokens: [...t.disallowedTokens ?? [], ...e.iframeSandbox?.disallowedTokens ?? []],
			allowScriptsWithSameOrigin: e.iframeSandbox?.allowScriptsWithSameOrigin ?? t.allowScriptsWithSameOrigin ?? !1
		}
	};
}
function Vr(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) try {
		t.add(new URL(n).origin);
	} catch {}
	return t;
}
function Hr(e) {
	return new Set(e.map((e) => e.trim().toLowerCase()).filter(Boolean));
}
function Ur(e, t, n, r) {
	typeof e.url == "string" && $r(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Zr(e.headers, `${t}.headers`, n, r), Qr(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Wr(e, t, n, r) {
	let i = e.options;
	if (i && typeof i == "object") {
		for (let a of Rr) {
			if (e.component === "iframe" && a === "url") continue;
			let o = i[a];
			typeof o == "string" && o !== "" && $r(o, `${t}.options.${a}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		}
		e.component === "geo_map" && i.basemap != null && Gr(i.basemap, `${t}.options.basemap`, n, r);
	}
}
function Gr(e, t, n, r) {
	let i;
	try {
		i = _(e);
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
		$r(i.style_url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		return;
	}
	i.kind === "raster" && i.tiles.forEach((e, i) => {
		$r(e, `${t}.tiles[${i}]`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
	});
}
function Kr(e, t, n, r) {
	let { url: i, sandbox: a } = Yr(e);
	i && $r(i, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), ei(a, `${t}.iframe.sandbox`, n, r);
}
function qr(e, t, n, r) {
	let i = Xr(e.source), a = typeof i == "string" ? i : i && typeof i == "object" && typeof i.url == "string" ? i.url : void 0;
	a && $r(a, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
}
function Jr(e, t, n, r) {
	let i = Xr(e.source);
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
			typeof o == "string" && o && $r(o, `${t}.media.items[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
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
			typeof o == "string" && o && $r(o, `${t}.media.collections[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
		}
	});
}
function Yr(e) {
	let t = e.options, n = Xr(e.source), r, i = "";
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
function Xr(e) {
	return e?.inline ?? e?.data;
}
function Zr(e, t, n, r) {
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
function Qr(e, t, n, r) {
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
function $r(e, t, n, r, i) {
	let a = e.trim();
	if (!a) {
		i.push({
			path: t,
			severity: "error",
			message: "URL must be non-empty"
		});
		return;
	}
	if (ti(a)) {
		if (ni(a)) {
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
	if (ri(a).includes("${")) {
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
function ei(e, t, n, r) {
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
function ti(e) {
	return !e.startsWith("//") && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function ni(e) {
	let t = e.indexOf("${");
	if (t === -1) return !1;
	let n = e.slice(0, t);
	return !/[/?#]/.test(n) || /^\/+$/.test(n);
}
function ri(e) {
	if (e.startsWith("//")) {
		let t = e.slice(2).search(/[/?#]/);
		return t === -1 ? e : e.slice(0, t + 2);
	}
	let t = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/);
	return t ? t[0] : "";
}
//#endregion
//#region src/core/snapshot.ts
function ii(e, t) {
	return e.id || `__mt_idx_${t}`;
}
function ai(e) {
	let t = e?.widgets;
	return !Array.isArray(t) || t.length === 0 ? !1 : t.every((e) => {
		let t = e.source;
		if (!t) return !0;
		let n = t.inline !== void 0 || t.data !== void 0, r = !!(t.source_id || t.url);
		return n || !r;
	});
}
function oi(e, t, n, r, i) {
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
var si = {
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
}, ci = [
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
], li = 200, ui = 200, di = 3500, fi = {
	ok: "success",
	warn: "warning",
	error: "danger",
	info: "info"
};
function pi({ value: e, onChange: t }) {
	return /* @__PURE__ */ O("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: ci.map((n) => {
			let r = e.toLowerCase() === n;
			return /* @__PURE__ */ O("button", {
				onClick: () => t(n),
				className: `px-2 py-0.5 text-[length:var(--mtc-font-size-xs)] font-medium rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				children: n
			}, n);
		})
	});
}
var mi = [
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
function hi({ value: e, onChange: t }) {
	return /* @__PURE__ */ O("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: mi.map((n) => {
			let r = e === n.ms;
			return /* @__PURE__ */ O("button", {
				onClick: () => t(n.ms),
				className: `px-2 py-0.5 text-[length:var(--mtc-font-size-xs)] font-medium rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
				children: n.label
			}, n.label);
		})
	});
}
function gi() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ k("button", {
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
function _i(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}
function vi(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function yi() {
	let { recentActions: e, widgetHealth: t } = Se(), n = Ie(!0), r = e[0], i = Object.values(t), a = i.filter((e) => e.streaming), o = a.filter((e) => e.connected && !e.error).length, s = i.filter((e) => e.error).length, c = i.filter((e) => e.stale).length, l = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ k("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ O("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ k("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ O("span", {
							className: "tabular-nums w-7 shrink-0",
							children: vi(n, r.receivedAt)
						}),
						/* @__PURE__ */ O("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ O("span", {
							className: `shrink-0 ${l}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ O("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ O("span", {
					className: "text-zinc-500",
					children: "idle"
				})
			}),
			a.length > 0 && /* @__PURE__ */ k("span", {
				className: o === a.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${o} of ${a.length} streams connected`,
				children: [
					/* @__PURE__ */ k("span", {
						className: "tabular-nums",
						children: [
							o,
							"/",
							a.length
						]
					}),
					" ",
					/* @__PURE__ */ O("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			c > 0 && /* @__PURE__ */ k("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${c} widget(s) without recent updates`,
				children: [c, " stale"]
			}),
			s > 0 && /* @__PURE__ */ k("span", {
				className: "text-red-400 tabular-nums",
				children: [s, " err"]
			}),
			/* @__PURE__ */ O("span", {
				className: "tabular-nums text-zinc-300",
				children: _i(n)
			})
		]
	});
}
function bi({ health: e }) {
	let t = Object.values(e);
	if (t.length === 0) return null;
	let n = t.filter((e) => e.streaming), r = n.filter((e) => e.connected && !e.error).length, i = t.filter((e) => e.error);
	if (n.length === 0 && i.length === 0) return null;
	let a = i.map((e) => e.title).join("\n");
	return /* @__PURE__ */ k("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[length:var(--mtc-font-size-xs)] ",
		children: [n.length > 0 && /* @__PURE__ */ k("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ k("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ O("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ k("span", {
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
function xi({ onClick: e }) {
	return /* @__PURE__ */ O("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function Si({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ k("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function Ci({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ O("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to standard density" : "Switch to compact density",
		children: e ? "Standard" : "Compact"
	});
}
function wi({ onCopied: e }) {
	return /* @__PURE__ */ O("button", {
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
function Ti({ onClick: e, busy: t }) {
	return /* @__PURE__ */ O("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function Ei({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ k("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[length:var(--mtc-font-size-xs)] text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ O("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ k("span", {
				className: "text-zinc-600",
				children: ["· ", n]
			}) : null
		]
	});
}
function Di(e) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
	let t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
var Oi = {};
function ki({ template: t, backendUrl: n, backendHeaders: r = Oi, fetch: o, onEvent: s, onIntent: l, onCtxChange: u, paletteSuggest: d, chrome: f = "full", onShare: p, theme: h, templateTrust: _ = "untrusted", templateTrustPolicy: v = $, resolveAssetIntent: y, assetRenderers: b, assetApplicationFrame: S, saveAssetOpenPreference: A, onAssetOpenError: j, registry: M }) {
	let N = i(), ee = h ?? N?.theme ?? "dark", te = m(), ne = t.columns || 12, [P, re] = E(t.widgets), ie = M ? [...M.keys()].sort().join("\0") : "", ae = w(() => Pr(t, M?.keys(), { includeBuiltIns: M == null }), [
		t,
		M,
		ie
	]), F = w(() => _ === "trusted" ? [] : zr(t, v), [
		t,
		_,
		v
	]), oe = w(() => [...ae, ...F], [ae, F]), I = w(() => oe.some((e) => e.severity === "error"), [oe]), se = w(() => F.some((e) => e.severity === "error"), [F]), L = w(() => !!t.frozenAt || ai(t), [t]), [ce, le] = E(!1), [R, ue] = E(() => {
		let e = t.context?.values ?? {};
		return typeof window > "u" ? e : {
			...e,
			...hr(window.location.search)
		};
	}), [z] = E(() => vr(yr())), [de, fe] = E(null), [pe, me] = E(!1), [he, B] = E(!1), [V, ge] = E(!1);
	C(() => {
		fe(z.read("refreshIntervalMs", null)), me(z.read("compact", !1)), B(z.read("soundEnabled", !1)), ge(!0);
	}, [z]), C(() => {
		V && z.write("refreshIntervalMs", de);
	}, [
		z,
		V,
		de
	]), C(() => {
		V && z.write("compact", pe);
	}, [
		z,
		V,
		pe
	]), C(() => {
		V && z.write("soundEnabled", he);
	}, [
		z,
		V,
		he
	]);
	let [_e, ve] = E(null), [H, ye] = E(null), [be, Se] = E(null), [Ce, we] = E([]), [Te, Ee] = E(!1), De = T(0), Oe = T(!1), ke = x((e) => {
		Se((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), Ae = T(s);
	C(() => {
		Ae.current = s;
	}, [s]);
	let je = T(l);
	C(() => {
		je.current = l;
	}, [l]);
	let Me = x((e) => {
		je.current?.(e);
	}, []), [Pe, Fe] = E([]), Ie = x(() => Fe([]), []), [Re, ze] = E([]), Be = x(() => ze([]), []), [Ve, He] = E({}), Ue = x((e, t) => {
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
	}, []), We = T(/* @__PURE__ */ new Map()), Ge = x((e, t) => (We.current.set(e, t), () => {
		We.current.get(e) === t && We.current.delete(e);
	}), []), Ke = T({
		widgets: P,
		ctx: R,
		template: t
	});
	Ke.current = {
		widgets: P,
		ctx: R,
		template: t
	};
	let qe = x(() => {
		let { widgets: e, ctx: t, template: n } = Ke.current;
		return oi(n, e, t, (e, t) => {
			let n = We.current.get(ii(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), Je = x((e) => {
		Ae.current?.(e), e.type === "action" ? Fe((t) => [{
			receivedAt: Date.now(),
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}, ...t].slice(0, li)) : e.type === "alert" && ze((t) => [{
			receivedAt: Date.now(),
			widgetId: e.widgetId,
			severity: e.severity,
			message: e.message,
			predicate: e.predicate
		}, ...t].slice(0, ui));
	}, []), U = x((e, t = "info") => {
		De.current += 1;
		let n = De.current;
		we((r) => [...r, {
			id: n,
			title: e,
			intent: fi[t],
			duration: di
		}].slice(-4));
	}, []), Ye = x(async () => {
		if (!Oe.current) {
			Oe.current = !0, Ee(!0);
			try {
				let e = qe();
				p ? await p(e) : Di(e), U(p ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				U(`Snapshot failed: ${t}`, "error");
			} finally {
				Oe.current = !1, Ee(!1);
			}
		}
	}, [
		p,
		qe,
		U
	]), Xe = x((e) => {
		we((t) => t.filter((t) => t.id !== e));
	}, []), Ze = x((e, t) => {
		ue((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	C(() => {
		if (typeof window > "u") return;
		let e = gr(window.location.search, R), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [R]);
	let W = T(u);
	C(() => {
		W.current = u;
	}, [u]), C(() => {
		W.current?.(R);
	}, [R]);
	let G = x((e, t) => {
		re((n) => pr(n, e, t));
	}, []), Qe = (e) => te === "mobile" ? ne : te === "tablet" ? Math.min(e, Math.floor(ne / 2)) : Math.min(e, ne), $e = w(() => ({
		dispatch: G,
		ctx: R,
		setCtx: Ze,
		backendUrl: n,
		backendHeaders: r,
		fetch: o,
		widgets: P,
		refreshIntervalMs: de ?? void 0,
		toast: U,
		compact: pe,
		fullscreenId: _e,
		setFullscreenId: ve,
		focusedId: H,
		setFocusedId: ye,
		refreshPulse: be,
		requestRefresh: ke,
		emit: Je,
		emitIntent: Me,
		recentActions: Pe,
		clearRecentActions: Ie,
		recentAlerts: Re,
		clearRecentAlerts: Be,
		soundEnabled: he,
		widgetHealth: Ve,
		reportWidgetHealth: Ue,
		registerWidgetData: Ge,
		snapshot: qe
	}), [
		G,
		R,
		Ze,
		n,
		r,
		o,
		P,
		de,
		U,
		pe,
		_e,
		H,
		be,
		ke,
		Je,
		Me,
		Pe,
		Ie,
		Re,
		Be,
		he,
		Ve,
		Ue,
		Ge,
		qe
	]), et = x((e, t) => {
		U(`Could not ${t.intent} ${t.asset.name}: ${e.message}`, "error"), j?.(e, t);
	}, [j, U]);
	C(() => {
		if (!_e) return;
		let e = (e) => {
			e.key === "Escape" && ve(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [_e]), C(() => {
		H && typeof document < "u" && document.getElementById(`mt-widget-${H}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [H]), C(() => {
		let e = (e) => {
			if (e.defaultPrevented || e.isComposing || e.metaKey || e.ctrlKey || e.altKey || a(e.target)) return;
			let n = t.shortcuts?.find((t) => t.key === e.key);
			if (n) {
				e.preventDefault();
				for (let [e, t] of Object.entries(n.ctx)) Ze(e, t);
				return;
			}
			let r = P.map((e) => e.id).filter((e) => !!e);
			if (r.length === 0) return;
			let i = (e) => {
				let t = H ? r.indexOf(H) : -1, n = r[(t + e + r.length) % r.length];
				ye(n);
			};
			switch (e.key) {
				case "j":
				case "ArrowDown":
					e.preventDefault(), i(1);
					break;
				case "k":
				case "ArrowUp":
					e.preventDefault(), i(-1);
					break;
				case "f":
					H && (e.preventDefault(), ve(H));
					break;
				case "r":
					H && (e.preventDefault(), ke(H));
					break;
				case "Escape": H && ye(null);
			}
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		P,
		H,
		ke,
		t.shortcuts,
		Ze
	]);
	let tt = !se && _e ? P.find((e) => e.id === _e) : null;
	return /* @__PURE__ */ O(xe.Provider, {
		value: $e,
		children: /* @__PURE__ */ O("div", {
			className: `mtc-root mtc-theme-${ee}`,
			"data-theme": ee,
			"data-density": pe ? "compact" : "standard",
			children: /* @__PURE__ */ O(e, {
				theme: ee,
				density: pe ? "compact" : "standard",
				children: /* @__PURE__ */ O(g, {
					resolveAssetIntent: y,
					renderers: b,
					applicationFrame: S,
					savePreference: A,
					onError: et,
					children: /* @__PURE__ */ O(Le, { children: /* @__PURE__ */ k(fr, { children: [
						/* @__PURE__ */ O(kr, { suggest: d }),
						/* @__PURE__ */ O(Mr, { templateShortcuts: t.shortcuts }),
						/* @__PURE__ */ O(c, {
							toasts: Ce,
							onDismiss: Xe
						}),
						oe.length > 0 && (!ce || I) && /* @__PURE__ */ O(Ai, {
							issues: oe,
							dismissible: !I,
							onDismiss: () => le(!0)
						}),
						/* @__PURE__ */ k("div", {
							className: "mtc-workspace min-h-full flex flex-col",
							children: [/* @__PURE__ */ k("div", {
								className: "flex-1",
								children: [(t.title || f === "full") && /* @__PURE__ */ k("div", {
									className: "mtc-toolbar",
									children: [/* @__PURE__ */ k("div", {
										className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
										children: [t.title && /* @__PURE__ */ O("h1", {
											className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
											children: Ne(t.title, R)
										}), f === "full" && /* @__PURE__ */ k("div", {
											className: "ml-auto flex items-center gap-2 flex-wrap",
											children: [
												L ? /* @__PURE__ */ O(Ei, { frozenAt: t.frozenAt }) : /* @__PURE__ */ k(D, { children: [
													/* @__PURE__ */ O(bi, { health: Ve }),
													/* @__PURE__ */ O(hi, {
														value: de,
														onChange: fe
													}),
													/* @__PURE__ */ O(xi, { onClick: () => ke("*") })
												] }),
												/* @__PURE__ */ O(Si, {
													enabled: he,
													onToggle: () => B((e) => !e)
												}),
												/* @__PURE__ */ O(Ci, {
													compact: pe,
													onToggle: () => me((e) => !e)
												}),
												!L && /* @__PURE__ */ O(Ti, {
													onClick: () => void Ye(),
													busy: Te
												}),
												/* @__PURE__ */ O(wi, { onCopied: () => U("URL copied", "ok") }),
												/* @__PURE__ */ O(gi, {})
											]
										})]
									}), f === "full" && Object.keys(R).length > 0 && /* @__PURE__ */ k("div", {
										className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ O("span", {
											className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 mr-1",
											children: "Context"
										}), Object.entries(R).map(([e, t]) => e === "range" ? /* @__PURE__ */ O(pi, {
											value: t,
											onChange: (t) => Ze(e, t)
										}, e) : /* @__PURE__ */ k("div", {
											className: "mtc-context-chip px-2 py-1 text-[11px]",
											children: [/* @__PURE__ */ O("span", {
												className: "text-zinc-500 mr-1",
												children: e
											}), /* @__PURE__ */ O("span", {
												className: "text-zinc-100 font-mono",
												children: t
											})]
										}, e))]
									})]
								}), /* @__PURE__ */ O("div", {
									className: "p-3 md:p-5",
									children: /* @__PURE__ */ O("div", {
										className: "grid gap-3 md:gap-4 items-start",
										style: { gridTemplateColumns: `repeat(${ne}, 1fr)` },
										children: se ? /* @__PURE__ */ O(ji, { issues: F }) : P.map((e, t) => /* @__PURE__ */ O("div", {
											id: e.id ? `mt-widget-${e.id}` : void 0,
											style: { gridColumn: `span ${Qe(e.span || 6)}` },
											children: /* @__PURE__ */ O(lr, {
												config: e,
												contentHeight: e.height || si[e.component] || 280,
												snapshotKey: ii(e, t),
												registry: M
											})
										}, e.id || t))
									})
								})]
							}), f === "full" && /* @__PURE__ */ O(yi, {})]
						}),
						tt && /* @__PURE__ */ O(Mi, {
							widget: tt,
							registry: M,
							onClose: () => ve(null)
						})
					] }) })
				})
			})
		})
	});
}
function Ai({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ k("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ k("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ k("div", {
				className: "font-medium text-[length:var(--mtc-font-size-xs)] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ k("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ k("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ O("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ O("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ O("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ k("li", {
					className: "opacity-60 text-[length:var(--mtc-font-size-xs)]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ O("button", {
			onClick: n,
			className: "text-[length:var(--mtc-font-size-xs)] opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function ji({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ k("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ O("div", {
				className: "font-medium text-xs mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ O("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ k("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ k("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ O("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ O("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ O("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ k("li", {
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
function Mi({ widget: e, registry: t, onClose: n }) {
	let r = typeof window < "u" ? Math.floor(window.innerHeight * .82) : 600;
	return /* @__PURE__ */ k("div", {
		className: "fixed inset-0 z-30 bg-zinc-950 p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: n,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Fullscreen ${e.title ?? e.id ?? e.component}`,
		children: [/* @__PURE__ */ k("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ O("span", {
				className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ O("button", {
				onClick: n,
				autoFocus: !0,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ O("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ O(lr, {
				config: e,
				contentHeight: r,
				registry: t
			})
		})]
	});
}
//#endregion
//#region src/core/MultiDashboard.tsx
function Ni(e, t) {
	C(() => {
		let n = (n) => {
			if (n.defaultPrevented || n.isComposing || a(n.target) || !(n.metaKey || n.ctrlKey)) return;
			let r = Number(n.key);
			Number.isFinite(r) && r >= 1 && r <= 9 && r <= e && (n.preventDefault(), t(r - 1));
		};
		return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
	}, [e, t]);
}
function Pi({ tabs: t, activeIndex: n, onSelect: r, backendUrl: a, backendHeaders: o, fetch: s, theme: c, templateTrust: l, templateTrustPolicy: u, resolveAssetIntent: d, assetRenderers: f, assetApplicationFrame: p, saveAssetOpenPreference: m, onAssetOpenError: h, onIntent: g, registry: _ }) {
	let v = i(), y = c ?? v?.theme ?? "dark", b = Math.max(0, Math.min(n, t.length - 1));
	Ni(t.length, r);
	let [x, S] = E(() => /* @__PURE__ */ new Set([b]));
	return C(() => {
		S((e) => e.has(b) ? e : /* @__PURE__ */ new Set([...e, b]));
	}, [b]), t.length === 0 ? null : /* @__PURE__ */ O("div", {
		className: `mtc-root mtc-theme-${y}`,
		"data-theme": y,
		children: /* @__PURE__ */ O(e, {
			theme: y,
			density: v?.density ?? "standard",
			children: /* @__PURE__ */ k("div", {
				className: "mtc-workspace min-h-full",
				children: [/* @__PURE__ */ O(Fi, {
					tabs: t,
					activeIndex: b,
					onSelect: r
				}), t.map((e, t) => /* @__PURE__ */ O("div", {
					style: { display: t === b ? "block" : "none" },
					children: x.has(t) && /* @__PURE__ */ O(ki, {
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
	return /* @__PURE__ */ O("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ k("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ O("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ O("span", {
					className: "text-[length:var(--mtc-font-size-xs)] text-zinc-500 font-mono ",
					children: o
				})]
			}, i);
		})
	});
}
function Ii(e = 0) {
	let [t, n] = E(() => {
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
export { At as $, qn as A, ge as At, _n as B, M as Bt, fr as C, Ee as Ct, ir as D, Pe as Dt, ar as E, Ae as Et, Yn as F, ce as Ft, $t as G, en as H, Xn as I, L as It, qt as J, Gt as K, Zn as L, I as Lt, Gn as M, ye as Mt, Jn as N, be as Nt, nr as O, xe as Ot, er as P, he as Pt, Wt as Q, $n as R, N as Rt, ur as S, we as St, lr as T, Ne as Tt, tn as U, gn as V, nn as W, Ut as X, Kt as Y, Rt as Z, Sr as _, Le as _t, ai as a, Ot as at, gr as b, ke as bt, Lr as c, Ct as ct, zr as d, it as dt, St as et, Nr as f, rt as ft, Cr as g, Fe as gt, wr as h, ze as ht, oi as i, yt as it, Kn as j, ve as jt, rr as k, Se as kt, Ir as l, wt as lt, Mr as m, Be as mt, Ii as n, xt as nt, ii as o, Tt as ot, Pr as p, ot as pt, Jt as q, ki as r, bt as rt, Fr as s, kt as st, Pi as t, jt as tt, $ as u, nt as ut, xr as v, Ie as vt, dr as w, De as wt, pr as x, Te as xt, hr as y, Oe as yt, Wn as z, A as zt };
