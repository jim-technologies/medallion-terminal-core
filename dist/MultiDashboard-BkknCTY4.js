import { C as e, S as t, l as n, n as r, r as i } from "./States-Bt1VXklN.js";
import { c as a, n as o, s, t as c, u as l } from "./sourceError-B1Q2JDlm.js";
import { c as u, t as d } from "./AssetOpen-CjGLA-3L.js";
import { o as f } from "./basemaps-BjEaZSH5.js";
import { Suspense as p, createContext as m, lazy as h, useCallback as g, useContext as _, useEffect as v, useMemo as y, useRef as b, useState as x } from "react";
import { Fragment as S, jsx as C, jsxs as w } from "react/jsx-runtime";
//#region src/hooks/useBreakpoint.ts
function T() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function E() {
	let [e, t] = x(T);
	return v(() => {
		let e = () => t(T());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e;
}
//#endregion
//#region src/core/connectFraming.ts
var ee = "application/connect+json", D = new TextDecoder();
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
					e.length > 0 && (a = JSON.parse(D.decode(e)));
				} catch {}
				t.isDisposed() || t.onTrailer?.(a);
				return;
			}
			let a = n.subarray(r + 5, r + 5 + i);
			r += 5 + i;
			try {
				let e = JSON.parse(D.decode(a));
				t.isDisposed() || t.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
//#region src/core/getNested.ts
function O(e, t) {
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
function k(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function A(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function re(e) {
	e.signal.aborted || e.abort();
}
var j = 3e4, ie = 1e3;
function ae(e, t) {
	return t ? O(e, t) : e;
}
var M = /* @__PURE__ */ new Set([
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
function N(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = Object.keys(e);
	return t.length === 1 && M.has(t[0]) ? e[t[0]] : e;
}
function P(e, t = {}) {
	let n = t.fetch, [r, i] = x(null), [u, d] = x(!0), [f, p] = x(null), [m, h] = x(null), [_, S] = x(!1), [C, w] = x(null), [T, E] = x(0), D = g(() => E((e) => e + 1), []), O = b(ie), M = b(void 0), P = b(null), F = b(void 0), I = b(0), L = g((t) => {
		let n = ae(N(t), e?.transform);
		i(n), p(null), d(!1), h(Date.now()), I.current = Date.now();
	}, [e?.transform]), oe = g((t) => {
		let n = e?.throttleMs ?? 0;
		if (n <= 0) {
			L(t);
			return;
		}
		let r = Date.now() - I.current;
		if (r >= n) {
			L(t);
			return;
		}
		P.current = t, F.current ||= setTimeout(() => {
			P.current !== null && L(P.current), P.current = null, F.current = void 0;
		}, n - r);
	}, [L, e?.throttleMs]), se = y(() => e ? JSON.stringify([
		e.url,
		e.source_id,
		e.method,
		e.body,
		e.headers,
		e.stream,
		k(e),
		e.transform,
		e.throttleMs,
		e.inline !== void 0 || e.data !== void 0
	]) : "", [e]), R = e ? ne(e) : void 0;
	return v(() => {
		if (!e) {
			d(!1);
			return;
		}
		if (R !== void 0) {
			oe(R);
			return;
		}
		if (!e.url) {
			d(!1);
			return;
		}
		if (e.stream === "connect") {
			let t = !1, r = new AbortController(), i = async () => {
				if (!t) try {
					let i = await (n ?? globalThis.fetch)(e.url, {
						method: "POST",
						headers: {
							...e.headers,
							"Content-Type": ee
						},
						body: JSON.stringify(e.body ?? {}),
						signal: r.signal
					});
					if (!i.ok) throw await s(i);
					if (!i.body) throw new c("Stream response has no body", { kind: "unavailable" });
					S(!0), w(null), p(null), O.current = ie;
					let o = i.body.getReader();
					await te(o, {
						onMessage: oe,
						onTrailer: (e) => {
							if (e.error) {
								let n = e.error.code ?? "unknown", r = e.error.message ?? "stream error";
								t || p(new c(r, {
									kind: a(n),
									code: n
								}));
							}
						},
						isDisposed: () => t
					}), o.releaseLock();
				} catch (e) {
					!t && e instanceof Error && !A(e) && p(l(e));
				} finally {
					if (!t) {
						S(!1);
						let e = O.current;
						w(Date.now() + e), M.current = setTimeout(() => {
							O.current = Math.min(O.current * 2, j), i();
						}, e);
					}
				}
			};
			return i(), () => {
				t = !0, re(r), clearTimeout(M.current), S(!1), w(null);
			};
		}
		if (e.stream === !0) {
			let t = null, n = !1, r = () => {
				n || (t = new EventSource(e.url), t.onopen = () => {
					S(!0), w(null), p(null), O.current = ie;
				}, t.onmessage = (e) => {
					try {
						oe(JSON.parse(e.data));
					} catch {
						p(new c("Failed to parse stream", { kind: "unknown" }));
					}
				}, t.onerror = () => {
					if (t?.close(), S(!1), !n) {
						let e = O.current;
						w(Date.now() + e), M.current = setTimeout(() => {
							O.current = Math.min(O.current * 2, j), r();
						}, e);
					}
				});
			};
			return r(), () => {
				n = !0, clearTimeout(M.current), t?.close(), S(!1), w(null);
			};
		}
		let t = !1, r = !1, i = new AbortController(), o = async () => {
			if (!(t || r)) {
				r = !0;
				try {
					let r = await (n ?? globalThis.fetch)(e.url, {
						method: e.method || "GET",
						headers: e.headers,
						body: e.body ? JSON.stringify(e.body) : void 0,
						signal: i.signal
					});
					if (!r.ok) throw await s(r);
					let a = await r.json();
					t || oe(a);
				} catch (e) {
					!t && e instanceof Error && !A(e) && p(l(e));
				} finally {
					r = !1, t || d(!1);
				}
			}
		};
		o();
		let u, f = k(e);
		return f && f > 0 && (u = setInterval(() => void o(), f)), () => {
			t = !0, re(i), u && clearInterval(u);
		};
	}, [
		se,
		oe,
		R,
		T,
		n
	]), v(() => () => {
		F.current && clearTimeout(F.current);
	}, []), {
		data: r,
		loading: u,
		error: y(() => f ? o(f) : null, [f]),
		sourceError: f,
		lastUpdated: m,
		connected: _,
		nextRetryAt: C,
		refresh: D
	};
}
//#endregion
//#region src/widgets/states.tsx
var F = {
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
function I({ component: e }) {
	switch (e ? F[e] : "block") {
		case "chart": return /* @__PURE__ */ C(se, {});
		case "table": return /* @__PURE__ */ C(R, {});
		case "list": return /* @__PURE__ */ C(ce, {});
		case "single": return /* @__PURE__ */ C(le, {});
		case "donut": return /* @__PURE__ */ C(ue, {});
		case "grid": return /* @__PURE__ */ C(de, {});
		default: return /* @__PURE__ */ C(fe, {});
	}
}
function L({ children: e, padded: t }) {
	return /* @__PURE__ */ C(r, {
		title: e,
		compact: !0,
		icon: /* @__PURE__ */ C("span", {
			className: "text-xs uppercase tracking-[0.2em] leading-none",
			children: "·  ·  ·"
		}),
		className: `h-full${t ? " px-4" : ""}`
	});
}
var oe = [
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
function se() {
	return /* @__PURE__ */ C("div", {
		className: "h-full flex items-end gap-1",
		children: oe.map((e, t) => /* @__PURE__ */ C("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${e}%`,
				animationDelay: `${t * 40}ms`
			}
		}, t))
	});
}
function R() {
	let e = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ w("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ C("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: e.map((e, t) => /* @__PURE__ */ C("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: e }
			}, t))
		}), Array.from({ length: 5 }).map((t, n) => /* @__PURE__ */ C("div", {
			className: "flex gap-4",
			children: e.map((e, t) => /* @__PURE__ */ C("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: e,
					animationDelay: `${(n * 3 + t) * 50}ms`
				}
			}, t))
		}, n))]
	});
}
function ce() {
	return /* @__PURE__ */ C("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ w("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ C("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ w("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ C("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + t * 11 % 30}%`,
						animationDelay: `${t * 80}ms`
					}
				}), /* @__PURE__ */ C("div", {
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
function le() {
	return /* @__PURE__ */ w("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ C("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ C("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function ue() {
	return /* @__PURE__ */ w("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ C("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ C("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ C("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ C("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ w("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ C("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ C("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${t * 60}ms` }
				})]
			}, t))
		})]
	});
}
function de() {
	return /* @__PURE__ */ C("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ C("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${t * 25}ms` }
		}, t))
	});
}
function fe() {
	return /* @__PURE__ */ C("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
//#region src/widgets/Placeholder.tsx
function pe(e) {
	return /* @__PURE__ */ C(L, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var z = (e, t) => h(() => e().then((e) => ({ default: e[t] }))), B = /* @__PURE__ */ new Map([
	["timeseries", z(() => import("./Timeseries-CdEoMGdC.js").then((e) => e.n), "Timeseries")],
	["candlestick", z(() => import("./Candlestick-DCN08cCm.js").then((e) => e.n), "Candlestick")],
	["table", z(() => import("./DataTable-EaH5ix7D.js").then((e) => e.n), "DataTable")],
	["metric", z(() => import("./Metric-CsN3_xvB.js").then((e) => e.n), "Metric")],
	["text", z(() => import("./Text-bDEfaqJm.js").then((e) => e.n), "Text")],
	["conversation", z(() => import("./ConversationImpl-CklDNifi.js"), "ConversationImpl")],
	["prompt", z(() => import("./Prompt-tmv6HJ9F.js").then((e) => e.n), "Prompt")],
	["gauge", z(() => import("./Gauge-BgI9WBEf.js").then((e) => e.n), "Gauge")],
	["distribution", z(() => import("./Distribution-DoSCexcB.js").then((e) => e.n), "Distribution")],
	["heatmap", z(() => import("./Heatmap-DmiWtFLk.js").then((e) => e.n), "Heatmap")],
	["events", z(() => import("./Events-BMEnG36N.js").then((e) => e.n), "Events")],
	["catalog", z(() => import("./Catalog-DDQoZz05.js").then((e) => e.n), "Catalog")],
	["asset_catalog", z(() => import("./AssetCatalog-CRjdTs88.js").then((e) => e.n), "AssetCatalog")],
	["object_view", z(() => import("./ObjectView-BBY2fxzt.js").then((e) => e.n), "ObjectView")],
	["code_browser", z(() => import("./CodeBrowser-BICTWgxK.js").then((e) => e.n), "CodeBrowser")],
	["record_grid", z(() => import("./RecordGrid-D1bG13mG.js").then((e) => e.n), "RecordGrid")],
	["record_board", z(() => import("./RecordBoard-D5RN970c.js").then((e) => e.n), "RecordBoard")],
	["record_calendar", z(() => import("./RecordCalendar-Bu-1WYzm.js").then((e) => e.n), "RecordCalendar")],
	["record_form", z(() => import("./RecordForm-BZ89HlbA.js").then((e) => e.n), "RecordForm")],
	["action_form", z(() => import("./ActionForm-QCZlOfbR.js").then((e) => e.n), "ActionForm")],
	["orderbook", z(() => import("./OrderBook-CY3w8Bn5.js").then((e) => e.n), "OrderBook")],
	["depth_chart", z(() => import("./DepthChart-CynAV7xM.js").then((e) => e.n), "DepthChart")],
	["paired_grid", z(() => import("./PairedGrid-BT8LM1jF.js").then((e) => e.n), "PairedGrid")],
	["trade", z(() => import("./Trade-CGj6YYb8.js").then((e) => e.n), "Trade")],
	["ticker", z(() => import("./Ticker-B2jNXmEP.js").then((e) => e.n), "Ticker")],
	["volume_profile", z(() => import("./VolumeProfile-BHR3-H_S.js").then((e) => e.n), "VolumeProfile")],
	["stat_strip", z(() => import("./StatStrip-D1Z1LBsh.js").then((e) => e.n), "StatStrip")],
	["bar_chart", z(() => import("./BarChart-BmHjlC4n.js").then((e) => e.n), "BarChart")],
	["scatter", z(() => import("./Scatter-CicMeQ3H.js").then((e) => e.n), "Scatter")],
	["clock", z(() => import("./Clock-Cc9ABoWJ.js").then((e) => e.n), "Clock")],
	["treemap", z(() => import("./Treemap-B9NyRjl4.js").then((e) => e.n), "Treemap")],
	["image", z(() => import("./Image-CrdadDon.js").then((e) => e.n), "Image")],
	["iframe", z(() => import("./Iframe-CtNkNGPr.js").then((e) => e.n), "Iframe")],
	["histogram", z(() => import("./Histogram-DbuxH5rI.js").then((e) => e.n), "Histogram")],
	["section", z(() => import("./Section-Cpjr_7EV.js").then((e) => e.n), "Section")],
	["area_chart", z(() => import("./AreaChart-CgeMI7pK.js").then((e) => e.n), "AreaChart")],
	["slider", z(() => import("./Slider-DftCKpMD.js").then((e) => e.n), "Slider")],
	["select", z(() => import("./Select-CuAo5AXz.js").then((e) => e.n), "Select")],
	["boxplot", z(() => import("./Boxplot-CqP_0bRV.js").then((e) => e.n), "Boxplot")],
	["radar", z(() => import("./Radar-KlMTj0Gp.js").then((e) => e.n), "Radar")],
	["dag", z(() => import("./Dag-DMpdrPyI.js").then((e) => e.n), "Dag")],
	["geo_map", z(() => import("./GeoMap-5CnQBZCH.js").then((e) => e.n), "GeoMap")],
	["media_gallery", z(() => import("./MediaGalleryImpl-B2BgxRoB.js"), "MediaGalleryImpl")],
	["multi_select", z(() => import("./MultiSelect-CnlxFvvu.js").then((e) => e.n), "MultiSelect")],
	["json", z(() => import("./Json-DAWrdLEi.js").then((e) => e.n), "Json")],
	["sparkline", z(() => import("./Sparkline-DYkzMNfh.js").then((e) => e.n), "Sparkline")],
	["action_log", z(() => import("./ActionLog-CAHOMqfY.js").then((e) => e.n), "ActionLog")],
	["alert_log", z(() => import("./AlertLog-DyHq5Zx7.js").then((e) => e.n), "AlertLog")],
	["tape", z(() => import("./Tape-C50W6Frn.js").then((e) => e.n), "Tape")],
	["file_browser", z(() => import("./FileBrowser-DFKHrjBX.js").then((e) => e.n), "FileBrowser")]
]), me = new Set(B.keys()), he = class {
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
function ge(e = {}) {
	return new he(e);
}
var V = new Map(B);
function _e(e, t) {
	return (t ? t.get(e) : V.get(e)) || pe;
}
function ve(e, t) {
	V.set(e, t);
}
var ye = m({
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
function be() {
	return _(ye);
}
//#endregion
//#region src/core/resolveSource.ts
var xe = "medallion.terminal.v1.TerminalService";
function Se(e) {
	return `${e.replace(/\/$/, "")}/${xe}/Generate`;
}
function Ce(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function we(e) {
	return `${e.replace(/\/$/, "")}/${xe}/SubmitAction`;
}
function Te(e) {
	return `${e.replace(/\/$/, "")}/${xe}/WatchAction`;
}
function Ee(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function De(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function Oe() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var ke = !1, Ae = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function je(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new Ae(r);
		return "";
	});
}
function Me(e, t, n, r = {}) {
	if (e.source_id) {
		if (n === void 0) return ke ||= (console.warn(`[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), e;
		let i = e.stream ? "Stream" : "Get", a = n.replace(/\/$/, ""), o = {};
		if (e.params) for (let [n, r] of Object.entries(e.params)) o[n] = je(r, t, { strict: !0 });
		return {
			url: `${a}/${xe}/${i}`,
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
		let n = je(e.url, t, { strict: !0 });
		if (e.params && Object.keys(e.params).length > 0) {
			let r = Object.entries(e.params).map(([e, n]) => `${encodeURIComponent(e)}=${encodeURIComponent(je(n, t, { strict: !0 }))}`).join("&");
			n = n.includes("?") ? `${n}&${r}` : `${n}?${r}`;
		}
		i.url = n;
	}
	return i;
}
//#endregion
//#region src/core/NowContext.tsx
var Ne = m({
	now: 0,
	subscribe: () => () => {}
});
function Pe(e = !0) {
	let { now: t, subscribe: n } = _(Ne);
	return v(() => {
		if (e) return n();
	}, [e, n]), t;
}
function Fe({ children: e }) {
	let [t, n] = x(() => Date.now()), r = b(0), i = b(null), a = y(() => ({
		now: t,
		subscribe: () => (r.current += 1, i.current ??= setInterval(() => n(Date.now()), 1e3), () => {
			r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
		})
	}), [t]);
	return v(() => () => {
		i.current != null && clearInterval(i.current);
	}, []), /* @__PURE__ */ C(Ne.Provider, {
		value: a,
		children: e
	});
}
//#endregion
//#region src/core/alerts.ts
var Ie = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Le(e, t) {
	let n = ze(t);
	return n ? Ue(n, e) : !1;
}
function Re(e) {
	return ze(e) !== null;
}
function ze(e) {
	let t = e.trim();
	if (!t) return null;
	let n = Be(t, "||"), r = [];
	for (let e of n) {
		let t = Be(e, "&&"), n = [];
		for (let e of t) {
			let t = Ve(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function Be(e, t) {
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
function Ve(e) {
	let t = e.trim().match(Ie);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: He(i.trim())
	};
}
function He(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function Ue(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!We(O(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function We(e, t, n) {
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
var Ge = {
	warn: 720,
	error: 480
}, Ke = 160, H = .08, qe = null;
function Je() {
	if (typeof window > "u") return null;
	if (qe) return qe;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (qe = new t(), qe) : null;
}
function Ye(e) {
	let t = Ge[e];
	if (!t) return;
	let n = Je();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime(H, a + .02), i.gain.linearRampToValueAtTime(0, a + Ke / 1e3), r.start(a), r.stop(a + Ke / 1e3 + .05);
}
//#endregion
//#region src/widgets/platformShapes.ts
function U(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function W(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function Xe(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function Ze(e) {
	return U(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function G(e) {
	return U(e) ? e : {};
}
function Qe(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function $e(e) {
	let t = Array.isArray(e) ? { items: e } : G(e);
	return {
		items: (Array.isArray(t.items) ? t.items : []).filter(U).map((e) => ({
			id: String(e.id ?? ""),
			name: String(e.name ?? e.id ?? ""),
			kind: String(e.kind ?? "asset"),
			description: W(e.description),
			owner: W(e.owner),
			status: W(e.status),
			updatedAt: W(e.updatedAt ?? e.updated_at),
			tags: Xe(e.tags),
			url: W(e.url),
			metadata: G(e.metadata),
			context: Ze(e.context)
		})).filter((e) => e.id && e.name),
		total: Qe(t.total),
		nextPageToken: W(t.nextPageToken ?? t.next_page_token)
	};
}
function et(e) {
	let t = G(e), n = String(t.objectType ?? t.object_type ?? ""), r = String(t.objectId ?? t.object_id ?? ""), i = String(t.title ?? t.name ?? r);
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
		context: Ze(e.context)
	})).filter((e) => e.targetId), s = (Array.isArray(t.actions) ? t.actions : []).filter(U).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		description: W(e.description),
		style: W(e.style),
		confirm: e.confirm === !0,
		params: G(e.params),
		disabled: e.disabled === !0
	})).filter((e) => e.id);
	return {
		objectType: n,
		objectId: r,
		title: i,
		description: W(t.description),
		status: W(t.status),
		updatedAt: W(t.updatedAt ?? t.updated_at),
		tags: Xe(t.tags),
		properties: a,
		links: o,
		actions: s
	};
}
function tt(e) {
	let t = G(e);
	if (!Array.isArray(t.nodes)) return null;
	let n = t.nodes.filter(U).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		kind: W(e.kind),
		status: W(e.status),
		subtitle: W(e.subtitle),
		tags: Xe(e.tags),
		metadata: G(e.metadata),
		context: Ze(e.context)
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
function nt(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "2" || t === "DIRECTORY" || t === "DIR" || t === "REPOSITORY_ENTRY_KIND_DIRECTORY" ? "directory" : t === "3" || t === "SYMLINK" || t === "REPOSITORY_ENTRY_KIND_SYMLINK" ? "symlink" : "file";
}
function rt(e) {
	let t = G(e), n = String(t.repository ?? t.name ?? "");
	if (!n && !Array.isArray(t.entries) && !U(t.file)) return null;
	let r = (Array.isArray(t.entries) ? t.entries : []).filter(U).map((e) => ({
		path: String(e.path ?? e.name ?? ""),
		name: String(e.name ?? String(e.path ?? "").split("/").pop() ?? ""),
		kind: nt(e.kind),
		language: W(e.language),
		sizeBytes: Qe(e.sizeBytes ?? e.size_bytes),
		updatedAt: W(e.updatedAt ?? e.updated_at)
	})).filter((e) => e.path && e.name), i = U(t.file) ? t.file : null, a = i ? {
		path: String(i.path ?? t.path ?? ""),
		content: String(i.content ?? ""),
		language: W(i.language),
		sizeBytes: Qe(i.sizeBytes ?? i.size_bytes),
		truncated: i.truncated === !0,
		url: W(i.url)
	} : void 0;
	return {
		repository: n,
		ref: String(t.ref ?? ""),
		path: String(t.path ?? ""),
		refs: Xe(t.refs),
		entries: r,
		file: a,
		url: W(t.url)
	};
}
//#endregion
//#region src/widgets/recordShapes.ts
function K(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function it(e) {
	return K(e) ? e : {};
}
function q(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function at(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function ot(e) {
	return K(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function st(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
var ct = {
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
}, lt = {
	1: "grid",
	2: "board",
	3: "calendar",
	4: "gallery",
	5: "list",
	6: "timeline",
	7: "form"
};
function ut(e, t) {
	return String(e ?? "").replace(t, "").toLowerCase();
}
function dt(e) {
	let t = ct[String(e)];
	if (t) return t;
	let n = ut(e, "RECORD_FIELD_TYPE_");
	return Object.values(ct).includes(n) ? n : "text";
}
function ft(e) {
	let t = lt[String(e)];
	if (t) return t;
	let n = ut(e, "RECORD_VIEW_TYPE_");
	return Object.values(lt).includes(n) ? n : "grid";
}
function pt(e) {
	return typeof e == "boolean" ? "boolean" : typeof e == "number" ? "number" : Array.isArray(e) ? "multi_select" : "text";
}
function mt(e) {
	return e === "formula" || e === "lookup" || e === "rollup" || e === "created_at" || e === "updated_at";
}
function ht(e, t) {
	let n = (Array.isArray(e.fields) ? e.fields : []).filter(K).map((e) => {
		let t = dt(e.type), n = (Array.isArray(e.choices) ? e.choices : []).filter(K).map((e) => ({
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
			readOnly: e.readOnly === !0 || e.read_only === !0 || mt(t),
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
			type: pt(n),
			required: !1,
			readOnly: !1,
			choices: [],
			allowMultiple: Array.isArray(n)
		};
	});
}
function gt(e) {
	let t = it(e), n = (Array.isArray(t.records) ? t.records : Array.isArray(t.rows) ? t.rows : []).filter(K).map((e, t) => {
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
			context: ot(e.context)
		};
	}).filter((e) => e.id), r = ht(t, n), i = (Array.isArray(t.views) ? t.views : []).filter(K).map((e) => ({
		id: String(e.id ?? ""),
		name: String(e.name ?? e.id ?? ""),
		type: ft(e.type),
		visibleFields: at(e.visibleFields ?? e.visible_fields),
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
	})).filter((e) => e.id), a = it(t.capabilities), o = String(t.tableId ?? t.table_id ?? ""), s = String(t.tableName ?? t.table_name ?? o);
	return !o && !s && r.length === 0 && n.length === 0 ? null : {
		workspaceId: String(t.workspaceId ?? t.workspace_id ?? ""),
		tableId: o,
		tableName: s,
		primaryField: String(t.primaryField ?? t.primary_field ?? r[0]?.key ?? "id"),
		fields: r,
		records: n,
		views: i,
		activeViewId: q(t.activeViewId ?? t.active_view_id),
		total: st(t.total),
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
function _t(e) {
	return !e.readOnly && e.type !== "attachment";
}
function vt(e, t) {
	return Object.fromEntries(e.map((e) => [e.key, t ? t.values[e.key] : e.defaultValue ?? null]));
}
function yt(e, t, n) {
	let r = e.filter(_t).filter((e) => JSON.stringify(t[e.key]) !== JSON.stringify(n?.values[e.key])).map((e) => [e.key, t[e.key]]);
	return Object.fromEntries(r);
}
function bt(e, t, n = e.primaryField) {
	let r = t.values[n] ?? t.values[e.primaryField];
	return K(r) ? String(r.label ?? r.name ?? r.id ?? t.id) : Array.isArray(r) ? r.map(xt).join(", ") || t.id : r == null || r === "" ? t.id : String(r);
}
function xt(e) {
	return e == null ? "" : K(e) ? String(e.label ?? e.name ?? e.id ?? "") : Array.isArray(e) ? e.map(xt).filter(Boolean).join(", ") : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function St(e) {
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)) return e;
	let t = e instanceof Date ? e : typeof e == "string" || typeof e == "number" ? new Date(e) : null;
	return !t || Number.isNaN(t.getTime()) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function Ct(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function J(e) {
	return K(e) ? e.id ?? e.value ?? e.label ?? e.name ?? "" : e;
}
function wt(e, t) {
	let n = J(e), r = J(t);
	return typeof n == "number" && typeof r == "number" ? n === r : String(n ?? "").toLowerCase() === String(r ?? "").toLowerCase();
}
function Tt(e, t) {
	if (e) return e.choices.find((e) => wt(e.value, t))?.color;
}
function Et(e, t) {
	let n = e.values[t.field], r = t.value;
	switch (t.operator) {
		case "empty": return Ct(n);
		case "not_empty": return !Ct(n);
		case "neq": return !wt(n, r);
		case "contains": return Array.isArray(n) ? n.some((e) => wt(e, r)) : xt(n).toLowerCase().includes(xt(r).toLowerCase());
		case "in": {
			let e = Array.isArray(r) ? r : [r];
			return (Array.isArray(n) ? n : [n]).some((t) => e.some((e) => wt(t, e)));
		}
		case "gt": return Number(J(n)) > Number(J(r));
		case "gte": return Number(J(n)) >= Number(J(r));
		case "lt": return Number(J(n)) < Number(J(r));
		case "lte": return Number(J(n)) <= Number(J(r));
		default: return wt(n, r);
	}
}
function Dt(e, t) {
	if (!t) return e;
	let n = t.filters.length > 0 ? e.filter((e) => t.filters.every((t) => Et(e, t))) : e;
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
function Ot(e, t, n) {
	return e.views.find((e) => e.id === n && e.type === t) ?? e.views.find((n) => n.id === e.activeViewId && n.type === t) ?? e.views.find((e) => e.type === t);
}
//#endregion
//#region src/widgets/mediaShape.ts
function kt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function At(e) {
	return kt(e) ? e : {};
}
function Y(e) {
	if (e != null) return String(e).trim() || void 0;
}
function jt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim()) {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function Mt(e) {
	let t = jt(e);
	return t != null && t >= 0 ? t : void 0;
}
function Nt(e) {
	return Array.isArray(e) ? [...new Set(e.map(String).map((e) => e.trim()).filter(Boolean))] : [];
}
function Pt(e) {
	return kt(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function Ft(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
function It(e, t, n) {
	if (e === 2) return "video";
	if (e === 1) return "image";
	let r = String(e ?? "").toLowerCase();
	return r.includes("video") || r === "movie" ? "video" : r.includes("image") || r.includes("photo") ? "image" : t?.toLowerCase().startsWith("video/") || /\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(n) ? "video" : "image";
}
function Lt(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).pop();
	if (!t) return "Untitled media";
	try {
		return decodeURIComponent(t);
	} catch {
		return t;
	}
}
function Rt(e) {
	if (!kt(e)) return null;
	let t = Ft(e.url ?? e.mediaUrl ?? e.media_url ?? e.src);
	if (!t) return null;
	let n = Y(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type);
	return {
		id: Y(e.id ?? e.mediaId ?? e.media_id) ?? t,
		title: Y(e.title ?? e.name ?? e.label ?? e.filename) ?? Lt(t),
		kind: It(e.kind ?? e.type ?? e.mediaType ?? e.media_type, n, t),
		url: t,
		thumbnailUrl: Ft(e.thumbnailUrl ?? e.thumbnail_url ?? e.thumbnail ?? e.posterUrl ?? e.poster_url ?? e.poster),
		description: Y(e.description ?? e.caption),
		capturedAt: Y(e.capturedAt ?? e.captured_at ?? e.takenAt ?? e.taken_at ?? e.dateTaken ?? e.date_taken),
		createdAt: Y(e.createdAt ?? e.created_at ?? e.uploadedAt ?? e.uploaded_at),
		contentType: n,
		width: Mt(e.width),
		height: Mt(e.height),
		durationSeconds: Mt(e.durationSeconds ?? e.duration_seconds ?? e.duration),
		favorite: e.favorite === !0 || e.isFavorite === !0 || e.is_favorite === !0,
		tags: Nt(e.tags),
		collectionIds: Nt(e.collectionIds ?? e.collection_ids ?? e.albumIds ?? e.album_ids ?? e.albums),
		metadata: At(e.metadata),
		context: Pt(e.context)
	};
}
function zt(e) {
	if (!kt(e)) return null;
	let t = Y(e.id ?? e.collectionId ?? e.collection_id ?? e.albumId ?? e.album_id);
	return t ? {
		id: t,
		name: Y(e.name ?? e.title ?? e.label) ?? Jt(t),
		coverUrl: Ft(e.coverUrl ?? e.cover_url ?? e.thumbnailUrl ?? e.thumbnail_url),
		itemCount: Mt(e.itemCount ?? e.item_count ?? e.count),
		context: Pt(e.context)
	} : null;
}
function Bt(e) {
	let t = Array.isArray(e) ? { items: e } : At(e), n = (Array.isArray(t.items) ? t.items : Array.isArray(t.media) ? t.media : Array.isArray(t.assets) ? t.assets : []).map(Rt).filter((e) => e !== null), r = (Array.isArray(t.collections) ? t.collections : Array.isArray(t.albums) ? t.albums : []).map(zt).filter((e) => e !== null), i = new Set(r.map((e) => e.id));
	for (let e of new Set(n.flatMap((e) => e.collectionIds))) i.has(e) || r.push({
		id: e,
		name: Jt(e),
		itemCount: n.filter((t) => t.collectionIds.includes(e)).length,
		context: {}
	});
	return {
		items: Vt(n),
		collections: r,
		total: Mt(t.total),
		nextPageToken: Y(t.nextPageToken ?? t.next_page_token)
	};
}
function Vt(e) {
	return [...e].sort((e, t) => {
		let n = Kt(t) - Kt(e);
		return n === 0 ? e.title.localeCompare(t.title) : n;
	});
}
function Ht(e, t) {
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
function Ut(e, t = "day") {
	let n = Vt(e);
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
		label: qt(e, t),
		items: n
	}));
}
function Wt(e) {
	if (e == null || !Number.isFinite(e) || e < 0) return;
	let t = Math.round(e), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
function Gt(e) {
	if (!e) return;
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(t);
}
function Kt(e) {
	let t = Date.parse(e.capturedAt ?? e.createdAt ?? "");
	return Number.isFinite(t) ? t : -Infinity;
}
function qt(e, t) {
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
function Jt(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
//#region src/widgets/geoShape.ts
var Yt = /* @__PURE__ */ new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]);
function Xt(e) {
	let t = ln(e), n = t.geo ?? t.geojson ?? e, r = ln(n), i;
	if (r.type === "FeatureCollection" && Array.isArray(r.features)) i = r.features;
	else if (r.type === "Feature") i = [r];
	else if (Array.isArray(r.features)) i = r.features;
	else if (Array.isArray(r.points)) i = r.points;
	else if (Array.isArray(r.rows)) i = r.rows;
	else if (Array.isArray(n)) i = n;
	else return null;
	let a = i.map((e, t) => en(e, t)).filter((e) => e !== null);
	return a.length > 0 ? {
		type: "FeatureCollection",
		features: a
	} : null;
}
function Zt(e) {
	let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity;
	for (let a of e.features) on(a.geometry.coordinates, (e) => {
		t = Math.min(t, e[0]), r = Math.max(r, e[0]), n = Math.min(n, e[1]), i = Math.max(i, e[1]);
	});
	return [
		t,
		n,
		r,
		i
	].every(Number.isFinite) ? [[t, n], [r, i]] : null;
}
function Qt(e) {
	let t = e.properties._mtc_context;
	if (typeof t != "string") return {};
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? {} : Object.fromEntries(Object.entries(e).filter((e) => typeof e[1] == "string"));
	} catch {
		return {};
	}
}
function $t(e) {
	let t = e.properties._mtc_label;
	return typeof t == "string" && t !== "" ? t : e.id;
}
function en(e, t) {
	let n = ln(e), r = ln(n.properties), i = tn(n.geometry) ?? nn(n);
	if (!i) return null;
	let a = String(n.id ?? r.id ?? r.feature_id ?? r.object_id ?? `feature-${t + 1}`), o = fn(n.label, n.name, r.label, r.name, r.title, a), s = fn(n.status, r.status), c = dn(n.value ?? r.value), l = {
		...un(r.context),
		...un(n.context)
	}, u = {
		...ln(r.metadata),
		...ln(n.metadata)
	};
	return {
		type: "Feature",
		id: a,
		geometry: i,
		properties: {
			...cn(r),
			...cn(u),
			_mtc_id: a,
			_mtc_label: o,
			_mtc_tone: sn(s),
			...s && { _mtc_status: s },
			...c !== void 0 && { _mtc_value: c },
			_mtc_context: JSON.stringify(l)
		}
	};
}
function tn(e) {
	let t = ln(e), n = t.type;
	return typeof n != "string" || !Yt.has(n) || !rn(n, t.coordinates) ? null : {
		type: n,
		coordinates: t.coordinates
	};
}
function nn(e) {
	let t = dn(e.latitude ?? e.lat), n = dn(e.longitude ?? e.lng ?? e.lon);
	return t === void 0 || n === void 0 || t < -90 || t > 90 || n < -180 || n > 180 ? null : {
		type: "Point",
		coordinates: [n, t]
	};
}
function rn(e, t) {
	return an(t, {
		Point: 0,
		MultiPoint: 1,
		LineString: 1,
		MultiLineString: 2,
		Polygon: 2,
		MultiPolygon: 3
	}[e]);
}
function an(e, t) {
	if (t === 0) {
		if (!Array.isArray(e) || e.length < 2) return !1;
		let t = Number(e[0]), n = Number(e[1]);
		return Number.isFinite(t) && Number.isFinite(n) && t >= -180 && t <= 180 && n >= -90 && n <= 90;
	}
	return Array.isArray(e) && e.length > 0 && e.every((e) => an(e, t - 1));
}
function on(e, t) {
	if (Array.isArray(e)) {
		if (e.length >= 2 && typeof e[0] == "number" && typeof e[1] == "number") {
			t(e);
			return;
		}
		for (let n of e) on(n, t);
	}
}
function sn(e) {
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
function cn(e) {
	return Object.fromEntries(Object.entries(e).filter((e) => e[1] === null || typeof e[1] == "string" || typeof e[1] == "number" || typeof e[1] == "boolean"));
}
function ln(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function un(e) {
	let t = ln(e);
	return Object.fromEntries(Object.entries(t).filter((e) => typeof e[1] == "string"));
}
function dn(e) {
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function fn(...e) {
	return e.find((e) => typeof e == "string" && e !== "");
}
//#endregion
//#region src/widgets/orderBookShape.ts
function pn(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e, n = gn(t.bids, "bid"), r = gn(t.asks, "ask");
	if (n.length === 0 && r.length === 0) return null;
	let i = vn(t.mid), a = vn(t.spread);
	return {
		bids: n,
		asks: r,
		...i !== void 0 && { mid: i },
		...a !== void 0 && { spread: a },
		...typeof t.venue == "string" && t.venue !== "" && { venue: t.venue }
	};
}
function mn(e, t = 100, n = "size") {
	let r = Number.isFinite(t) ? Math.max(1, Math.floor(t)) : 100, i = 0, a = e.bids.slice(0, r).map((e) => (i += hn(e, n), {
		price: e.price,
		side: "bid",
		cumulative: i
	})), o = 0, s = e.asks.slice(0, r).map((e) => (o += hn(e, n), {
		price: e.price,
		side: "ask",
		cumulative: o
	}));
	return [...a.reverse(), ...s];
}
function hn(e, t) {
	return t === "notional" ? e.price * e.size : e.size;
}
function gn(e, t) {
	if (!Array.isArray(e)) return [];
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = _n(t);
		e && n.set(e.price, (n.get(e.price) ?? 0) + e.size);
	}
	return Array.from(n, ([e, t]) => ({
		price: e,
		size: t
	})).sort((e, n) => t === "bid" ? n.price - e.price : e.price - n.price);
}
function _n(e) {
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
function vn(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
//#endregion
//#region src/export/flatten.ts
var yn = {
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
function bn(e) {
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
function xn(e) {
	return Q(e) && Array.isArray(e.bars) ? Z(e.bars) : null;
}
function Sn(e) {
	if (Array.isArray(e) && e.length > 0 && Q(e[0])) return Z(e);
	if (Q(e) && "rows" in e) {
		let t = e, n = Array.isArray(t.columns) ? t.columns : [];
		if (n.length > 0 && Q(n[0])) {
			let e = n.map((e) => e.key);
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, X(t[n])])) : Cn(t, e))
			};
		}
		if (n.length > 0 && typeof n[0] == "string") {
			let e = n;
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, X(t[n])])) : Cn(t, e))
			};
		}
		let r = t.rows;
		return r.length > 0 && Q(r[0]) ? Z(r) : yn;
	}
	return null;
}
function Cn(e, t) {
	let n = {};
	for (let r of t) n[r] = X(e[r]);
	return n;
}
function wn(e) {
	return Q(e) && Array.isArray(e.cells) ? Z(e.cells) : null;
}
function Tn(e) {
	return Q(e) && Array.isArray(e.slices) ? Z(e.slices) : null;
}
function En(e) {
	return Q(e) && Array.isArray(e.events) ? Z(e.events) : null;
}
function Dn(e) {
	return Q(e) && Array.isArray(e.items) ? Z(e.items) : null;
}
function On(e) {
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
function kn(e) {
	let t = pn(e);
	return t ? Z([...t.bids.map((e) => ({
		side: "bid",
		...e
	})), ...t.asks.map((e) => ({
		side: "ask",
		...e
	}))]) : null;
}
function An(e) {
	return typeof e == "number" ? {
		columns: ["value"],
		rows: [{ value: e }]
	} : Q(e) && "value" in e && typeof e.value != "object" ? Z([e]) : null;
}
function jn(e) {
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
function Mn(e) {
	let t = $e(e);
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
function Nn(e) {
	let t = et(e);
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
function Pn(e) {
	let t = tt(e);
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
function Fn(e) {
	let t = rt(e);
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
function In(e) {
	let t = gt(e);
	return t ? Z(t.records.map((e) => ({
		id: e.id,
		...e.values,
		created_at: e.createdAt,
		updated_at: e.updatedAt,
		revision: e.revision
	}))) : null;
}
function Ln(e) {
	let t = Xt(e);
	return t ? Z(t.features.map((e) => ({
		...Object.fromEntries(Object.entries(e.properties).filter(([e]) => !e.startsWith("_mtc_"))),
		id: e.id,
		label: $t(e),
		geometry_type: e.geometry.type,
		geometry: e.geometry,
		status: e.properties._mtc_status,
		value: e.properties._mtc_value,
		context: Qt(e)
	}))) : null;
}
function Rn(e) {
	let t = Bt(e);
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
var zn = {
	timeseries: bn,
	area_chart: bn,
	sparkline: bn,
	candlestick: xn,
	table: Sn,
	heatmap: wn,
	distribution: Tn,
	events: En,
	tape: En,
	action_log: En,
	alert_log: En,
	text: Dn,
	ticker: Dn,
	conversation: On,
	orderbook: kn,
	depth_chart: kn,
	metric: An,
	gauge: jn,
	asset_catalog: Mn,
	object_view: Nn,
	dag: Pn,
	code_browser: Fn,
	record_grid: In,
	record_board: In,
	record_calendar: In,
	record_form: In,
	geo_map: Ln,
	media_gallery: Rn,
	SHAPE_TIMESERIES: bn,
	SHAPE_CANDLES: xn,
	SHAPE_TABLE: Sn,
	SHAPE_METRIC: An,
	SHAPE_GAUGE: jn,
	SHAPE_HEATMAP: wn,
	SHAPE_EVENTS: En,
	SHAPE_DISTRIBUTION: Tn,
	SHAPE_TEXT: Dn,
	SHAPE_CONVERSATION: On,
	SHAPE_ORDERBOOK: kn,
	SHAPE_ASSET_CATALOG: Mn,
	SHAPE_OBJECT: Nn,
	SHAPE_GRAPH: Pn,
	SHAPE_REPOSITORY: Fn,
	SHAPE_RECORD_SET: In,
	SHAPE_GEO: Ln,
	SHAPE_MEDIA: Rn
};
function Bn(e) {
	if (e == null) return yn;
	if (Array.isArray(e)) return e.length === 0 ? yn : Q(e[0]) ? Z(e) : {
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
function Vn(e, t) {
	if (e == null) return yn;
	if (t) {
		let n = zn[t];
		if (n) {
			let t = n(e);
			if (t) return t;
		}
	}
	for (let t of [
		bn,
		xn,
		wn,
		Tn,
		En,
		On,
		Dn,
		kn,
		Rn,
		Mn,
		Nn,
		Pn,
		Fn,
		In,
		jn,
		An,
		Sn
	]) {
		let n = t(e);
		if (n && n.rows.length > 0) return n;
	}
	return Bn(e);
}
//#endregion
//#region src/export/serializers.ts
var Hn = {
	csv: "text/csv;charset=utf-8",
	json: "application/json;charset=utf-8",
	ndjson: "application/x-ndjson;charset=utf-8",
	parquet: "application/vnd.apache.parquet"
}, Un = {
	csv: "csv",
	json: "json",
	ndjson: "ndjson",
	parquet: "parquet"
}, Wn = [
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
function Gn(e) {
	if (e == null) return "";
	let t = String(e);
	return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function Kn(e) {
	let { columns: t, rows: n } = e;
	return [t.map(Gn).join(","), ...n.map((e) => t.map((t) => Gn(e[t])).join(","))].join("\n");
}
function qn(e) {
	return JSON.stringify(e.rows, null, 2);
}
function Jn(e) {
	return e.rows.map((e) => JSON.stringify(e)).join("\n");
}
function Yn(e) {
	return e.columns.map((t) => ({
		name: t,
		data: e.rows.map((e) => e[t] ?? null)
	}));
}
async function Xn(e) {
	let { parquetWriteBuffer: t } = await import("./src-CjPDjqyY.js"), n = t({ columnData: e.columns.length > 0 ? Yn(e) : [{
		name: "value",
		data: []
	}] });
	return new Uint8Array(n);
}
function Zn(e, t) {
	switch (t) {
		case "csv": return Kn(e);
		case "json": return qn(e);
		case "ndjson": return Jn(e);
	}
}
//#endregion
//#region src/export/exportView.ts
function Qn(e) {
	return e.table ?? Vn(e.data, e.component);
}
async function $n(e, t) {
	let n = Qn(e);
	if (t === "parquet") {
		let e = await Xn(n);
		return new Blob([e.slice().buffer], { type: Hn.parquet });
	}
	let r = Zn(n, t);
	return new Blob([r], { type: Hn[t] });
}
function er(e) {
	return Qn(e).rows.length;
}
function tr(e, t) {
	return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${Un[t]}`;
}
async function nr(e, t, n) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return !1;
	let r = await $n(e, t), i = URL.createObjectURL(r), a = document.createElement("a");
	return a.href = i, a.download = tr(n, t), document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 0), !0;
}
//#endregion
//#region src/widgets/WidgetShell.tsx
function rr(e, t) {
	if (!t) return null;
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "just now";
	if (n < 60) return `${n}s ago`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function ir(e) {
	let { resolution: t, loading: r, error: a, data: o, options: s, component: c, widgetId: l, Component: d, onRenderError: f, onRetry: m } = e;
	return t.error ? /* @__PURE__ */ C(i, { message: t.error }) : r ? /* @__PURE__ */ C(I, { component: c }) : a ? /* @__PURE__ */ C(n, {
		error: a,
		onRetry: m,
		compact: !0,
		className: "h-full"
	}) : /* @__PURE__ */ C("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ C(u, {
			onError: f,
			children: /* @__PURE__ */ C(p, {
				fallback: /* @__PURE__ */ C(I, { component: c }),
				children: /* @__PURE__ */ C(d, {
					data: o,
					options: s,
					widgetId: l
				})
			})
		})
	});
}
function ar({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: a, fullscreenId: o, setFullscreenId: s } = be(), [c, l] = x(!1), [u, d] = x(!1), [f, p] = x(!1), m = b(null);
	v(() => {
		if (!c) return;
		let e = (e) => {
			m.current && !m.current.contains(e.target) && (l(!1), d(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [c]);
	let h = e.source, g = h?.data !== void 0 && !h.url && !h.source_id, _ = !!h && !g, y = !!e.id, S = !!e.id && o !== e.id, T = t == null ? 0 : er({
		data: t,
		component: e.component
	}), E = T > 0, ee = async (n) => {
		p(!0);
		try {
			let r = await nr({
				data: t,
				component: e.component
			}, n, e.title ?? e.id ?? e.component);
			i(r ? `Exported ${T.toLocaleString()} rows as ${n.toUpperCase()}` : "Export failed", r ? "ok" : "warn");
		} catch {
			i("Export failed", "error");
		} finally {
			p(!1), l(!1), d(!1);
		}
	};
	return /* @__PURE__ */ w("div", {
		className: "relative",
		ref: m,
		children: [/* @__PURE__ */ C("button", {
			onClick: () => l((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			"aria-expanded": c,
			children: "⋮"
		}), c && /* @__PURE__ */ w("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				_ && /* @__PURE__ */ C("button", {
					onClick: () => {
						n(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ C("button", {
					onClick: async () => {
						await r(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				E && /* @__PURE__ */ w("div", { children: [/* @__PURE__ */ w("button", {
					onClick: () => d((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": u,
					children: [/* @__PURE__ */ w("span", { children: ["Export", f ? "…" : ""] }), /* @__PURE__ */ C("span", {
						className: "text-zinc-600",
						children: u ? "▾" : "▸"
					})]
				}), u && /* @__PURE__ */ C("div", {
					className: "bg-zinc-950/60",
					children: Wn.map((e) => /* @__PURE__ */ C("button", {
						onClick: () => ee(e.key),
						disabled: f,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				S && /* @__PURE__ */ C("button", {
					onClick: () => {
						s(e.id), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				y && /* @__PURE__ */ C("button", {
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
function or({ config: e, contentHeight: t, snapshotKey: n, registry: r }) {
	let { ctx: i, backendUrl: a, backendHeaders: o, refreshIntervalMs: s, compact: c, toast: l, focusedId: u, setFocusedId: d, refreshPulse: f, emit: p, soundEnabled: m, reportWidgetHealth: h, registerWidgetData: g } = be(), _ = y(() => e.title ? je(e.title, i) : e.title, [e.title, i]), x = y(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = Me(e.source, i, a, o);
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
	]), S = x.source, { fetch: T } = be(), { data: E, loading: ee, error: D, sourceError: te, lastUpdated: O, connected: ne, nextRetryAt: k, refresh: A } = P(S, { fetch: e.source?.source_id ? T : void 0 }), re = _e(e.component, r), j = b(E);
	j.current = E, v(() => {
		if (n) return g(n, () => j.current);
	}, [n, g]);
	let ie = !!S?.stream || !!(S?.refreshIntervalMs ?? S?.refreshInterval), ae = S?.staleAfterMs, M = Pe(ie && O != null || k != null || !!ae && O != null), N = !!ae && O != null && M - O > ae, F = b(0);
	v(() => {
		if (!f) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = f.id === "*";
		n && t === "self" || (n || f.id === e.id) && f.n > F.current && (F.current = f.n, A());
	}, [
		f,
		e.id,
		e.refresh_policy,
		A
	]);
	let I = b(!1);
	v(() => {
		let t = e.alert;
		if (!t || E == null) {
			I.current = !1;
			return;
		}
		let n = Le(E, t.when);
		if (n && !I.current) {
			let n = je(t.message, i), r = t.severity ?? "warn";
			l(n, r), p({
				type: "alert",
				widgetId: e.id,
				severity: r,
				message: n,
				predicate: t.when
			}), m && Ye(r);
		}
		I.current = n;
	}, [
		E,
		e.alert,
		i,
		l,
		p,
		e.id,
		m
	]);
	let L = b(null);
	v(() => {
		let t = x.error ?? D, n = x.error ? "resolve" : "data";
		t && t !== L.current ? (p({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), L.current = t) : t || (L.current = null);
	}, [
		x.error,
		D,
		p,
		e.id,
		e.component
	]), v(() => {
		if (!e.id) return;
		let t = !!S?.stream;
		return h(e.id, {
			title: _ || e.title || e.component,
			streaming: t,
			connected: !t || ne,
			error: x.error ?? D,
			stale: N
		}), () => h(e.id, null);
	}, [
		e.id,
		_,
		e.title,
		e.component,
		S?.stream,
		ne,
		x.error,
		D,
		N,
		h
	]);
	let oe = !!e.id && u === e.id, se = e.id ? () => d(e.id) : void 0;
	return /* @__PURE__ */ w("div", {
		onClick: se,
		className: "mtc-widget overflow-hidden",
		"data-focused": oe ? "true" : "false",
		children: [_ && /* @__PURE__ */ w("div", {
			className: `mtc-widget-header ${c ? "px-2 py-1" : "px-3 py-1.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ C("h2", {
				className: `${c ? "text-[length:var(--mtc-font-size-md)]" : "text-[length:var(--mtc-font-size-lg)]"} font-semibold text-zinc-100 truncate`,
				children: _
			}), /* @__PURE__ */ w("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					ie && O && /* @__PURE__ */ w("span", {
						className: `text-[11px] ${N ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [N ? "stale · " : "", rr(M, O)]
					}),
					e.source?.stream && !ne && k != null && /* @__PURE__ */ w("span", {
						className: "text-[11px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((k - M) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ C("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${ne ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: ne ? "Connected" : k ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ C(ar, {
						widget: e,
						data: E,
						onToast: l,
						onRefresh: A,
						onCopy: async () => {
							if (E == null) return l("No data to copy", "warn"), !1;
							if (typeof navigator > "u" || !navigator.clipboard) return l("Clipboard unavailable", "warn"), !1;
							try {
								return await navigator.clipboard.writeText(JSON.stringify(E, null, 2)), l(`${e.title ?? e.component} copied`, "ok"), !0;
							} catch {
								return l("Clipboard blocked", "warn"), !1;
							}
						}
					})
				]
			})]
		}), /* @__PURE__ */ C("div", {
			className: c ? "p-2.5" : "p-4",
			style: { height: c ? Math.round(t * .92) : t },
			children: ir({
				resolution: x,
				loading: ee,
				error: te,
				data: E,
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
				onRetry: S && S.inline === void 0 && S.data === void 0 ? A : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/HoverContext.tsx
var sr = m({
	hoverTime: null,
	setHoverTime: () => {}
});
function cr() {
	return _(sr);
}
function lr({ children: e }) {
	let [t, n] = x(null), r = y(() => ({
		hoverTime: t,
		setHoverTime: n
	}), [t]);
	return /* @__PURE__ */ C(sr.Provider, {
		value: r,
		children: e
	});
}
//#endregion
//#region src/core/applyActions.ts
function ur(e, t, n) {
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
var dr = "ctx.";
function fr(e) {
	let t = {}, n = new URLSearchParams(e);
	for (let [e, r] of n) e.startsWith(dr) && (t[e.slice(4)] = r);
	return t;
}
function pr(e, t) {
	let n = new URLSearchParams(e);
	for (let e of [...n.keys()]) e.startsWith(dr) && n.delete(e);
	for (let [e, r] of Object.entries(t)) n.set(`${dr}${e}`, r);
	return n.toString();
}
//#endregion
//#region src/core/savedViews.ts
var mr = "medallion-terminal:view:";
function hr(e, t) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(mr + e, JSON.stringify(t));
	} catch {}
}
function gr(e) {
	if (!e || typeof window > "u" || !window.localStorage) return null;
	try {
		let t = window.localStorage.getItem(mr + e);
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
function _r() {
	if (typeof window > "u" || !window.localStorage) return [];
	let e = [];
	for (let t = 0; t < window.localStorage.length; t++) {
		let n = window.localStorage.key(t);
		n && n.startsWith(mr) && e.push(n.slice(24));
	}
	return e.sort();
}
function vr(e) {
	if (e && typeof window < "u" && window.localStorage) try {
		window.localStorage.removeItem(mr + e);
	} catch {}
}
//#endregion
//#region src/core/CommandPalette.tsx
var yr = /* @__PURE__ */ new Set([
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
]), br = 150, xr = 8;
function Sr(e, t) {
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
	} : yr.has(n.toLowerCase()) ? {
		kind: "set",
		key: "range",
		value: n.toLowerCase()
	} : {
		kind: "set",
		key: t,
		value: n
	};
}
function Cr({ suggest: e } = {}) {
	let { ctx: t, setCtx: n, toast: r } = be(), [i, a] = x(!1), [o, s] = x(""), [c, l] = x([]), [u, d] = x(-1), f = b(null), [p, m] = x([]), h = b(0);
	v(() => {
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" ? (e.preventDefault(), a((e) => !e)) : e.key === "Escape" && a(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), v(() => {
		i ? f.current?.focus() : (s(""), d(-1), m([]));
	}, [i]), v(() => {
		if (!e || !i) return;
		let t = o.trim();
		if (!t) {
			m([]);
			return;
		}
		let n = ++h.current, r = setTimeout(async () => {
			try {
				let r = await e(t);
				if (n !== h.current) return;
				m(r.slice(0, xr));
			} catch {
				n === h.current && m([]);
			}
		}, br);
		return () => clearTimeout(r);
	}, [
		o,
		i,
		e
	]);
	let g = y(() => Object.keys(t)[0] ?? "symbol", [t]), _ = y(() => i ? _r() : [], [i, c]);
	if (!i) return null;
	let S = () => {
		let e = Sr(o, g);
		if (!e || e.kind === "noop") {
			a(!1);
			return;
		}
		if (e.kind === "save") hr(e.name, t), r(`Saved "${e.name}"`, "ok");
		else if (e.kind === "load") {
			let t = gr(e.name);
			if (!t) r(`No view named "${e.name}"`, "warn");
			else {
				for (let [e, r] of Object.entries(t)) n(e, r);
				r(`Loaded "${e.name}"`, "ok");
			}
		} else if (e.kind === "delete") vr(e.name), r(`Deleted "${e.name}"`, "ok");
		else if (e.kind === "set") n(e.key, e.value);
		else if (e.kind === "set_many") for (let [t, r] of e.pairs) n(t, r);
		l((e) => [o, ...e.filter((e) => e !== o)].slice(0, 5)), a(!1);
	}, T = (e) => {
		if (c.length === 0) return;
		let t = Math.max(-1, Math.min(c.length - 1, u + e));
		d(t), s(t === -1 ? "" : c[t]);
	}, E = (e) => {
		for (let [t, r] of Object.entries(e.ctx)) n(t, r);
		a(!1);
	};
	return /* @__PURE__ */ C("div", {
		className: "mtc-overlay fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4",
		onClick: () => a(!1),
		children: /* @__PURE__ */ w("div", {
			className: "mtc-popover w-full max-w-lg overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ C("input", {
					ref: f,
					type: "text",
					value: o,
					onChange: (e) => s(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" ? (e.preventDefault(), S()) : e.key === "ArrowUp" ? (e.preventDefault(), T(1)) : e.key === "ArrowDown" && (e.preventDefault(), T(-1));
					},
					placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
					className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
				}),
				p.length > 0 && /* @__PURE__ */ C("div", {
					className: "border-b border-zinc-800 max-h-72 overflow-auto",
					children: p.map((e, t) => /* @__PURE__ */ w("button", {
						onClick: () => E(e),
						className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
						children: [
							/* @__PURE__ */ C("span", {
								className: "text-zinc-100",
								children: e.label
							}),
							e.hint && /* @__PURE__ */ C("span", {
								className: "ml-2 text-[10px] text-zinc-500 font-mono",
								children: e.hint
							}),
							/* @__PURE__ */ C("span", {
								className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100",
								children: Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")
							})
						]
					}, `${e.label}-${t}`))
				}),
				Object.entries(t).length > 0 && /* @__PURE__ */ w("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ C("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "current"
					}), Object.entries(t).map(([e, t]) => /* @__PURE__ */ w("span", {
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono",
						children: [
							e,
							"=",
							t
						]
					}, e))]
				}),
				_.length > 0 && /* @__PURE__ */ w("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ C("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "views"
					}), _.map((e) => /* @__PURE__ */ C("button", {
						onClick: () => s(`/load ${e}`),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-mono",
						title: `Load view "${e}"`,
						children: e
					}, e))]
				}),
				c.length > 0 && /* @__PURE__ */ w("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ C("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "recent"
					}), c.map((e, t) => /* @__PURE__ */ C("button", {
						onClick: () => s(e),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono",
						children: e
					}, t))]
				}),
				/* @__PURE__ */ w("div", {
					className: "px-4 py-2 text-[10px] text-zinc-600 flex justify-between",
					children: [/* @__PURE__ */ C("span", { children: "↵ apply  ·  ↑↓ recall" }), /* @__PURE__ */ C("span", { children: "esc close" })]
				})
			]
		})
	});
}
//#endregion
//#region src/core/ShortcutsOverlay.tsx
var wr = [
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
function Tr(e) {
	return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")}`;
}
function Er({ templateShortcuts: e }) {
	let [t, n] = x(!1);
	return v(() => {
		let e = (e) => {
			let t = e.target?.tagName, r = t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable;
			e.key === "?" && !r ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ C("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ w("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ w("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ C("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ C("span", {
					className: "text-[10px] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ w("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [wr.map((e, t) => /* @__PURE__ */ w("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ C("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ C("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ w(S, { children: [/* @__PURE__ */ C("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ w("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ C("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ C("span", {
						className: "text-xs text-zinc-400",
						children: Tr(e)
					})]
				}, `tpl-${t}`))] })]
			})]
		})
	}) : null;
}
//#endregion
//#region src/core/Toaster.tsx
var Dr = {
	ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
	warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
	error: "border-red-500/40     bg-red-500/10     text-red-200",
	info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, Or = 3500;
function kr({ toasts: e, dismiss: t }) {
	return e.length === 0 ? null : /* @__PURE__ */ C("div", {
		className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none",
		children: e.map((e) => /* @__PURE__ */ C(Ar, {
			toast: e,
			dismiss: t
		}, e.id))
	});
}
function Ar({ toast: e, dismiss: t }) {
	return v(() => {
		let n = setTimeout(() => t(e.id), Or);
		return () => clearTimeout(n);
	}, [e.id, t]), /* @__PURE__ */ C("div", {
		onClick: () => t(e.id),
		className: `mtc-popover pointer-events-auto cursor-pointer text-xs px-3 py-2 border ${Dr[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
		children: e.message
	});
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
			f(e.options.basemap, e.options.style_url);
		} catch (t) {
			let i = e.options.basemap == null ? "style_url" : "basemap";
			r.push({
				path: `${n}.options.${i}`,
				severity: "error",
				message: t instanceof Error ? t.message : "invalid basemap configuration"
			});
		}
		e.alert && ((typeof e.alert.when != "string" || !Re(e.alert.when)) && r.push({
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
], $ = {
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
function Lr(e, t = $) {
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
	let t = $.iframeSandbox;
	return {
		allowedUrlOrigins: zr(e.allowedUrlOrigins ?? $.allowedUrlOrigins),
		allowedIframeOrigins: zr(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
		allowRelativeUrls: e.allowRelativeUrls ?? $.allowRelativeUrls,
		allowedBasemapPresets: new Set(e.allowedBasemapPresets ?? $.allowedBasemapPresets),
		allowedHeaders: e.allowedHeaders ? Br(e.allowedHeaders) : void 0,
		disallowedHeaders: Br(e.disallowedHeaders ?? $.disallowedHeaders),
		minRefreshIntervalMs: e.minRefreshIntervalMs ?? $.minRefreshIntervalMs,
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
	typeof e.url == "string" && Zr(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Yr(e.headers, `${t}.headers`, n, r), Xr(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Hr(e, t, n, r) {
	let i = e.options;
	if (i && typeof i == "object") {
		for (let a of Ir) {
			if (e.component === "iframe" && a === "url") continue;
			let o = i[a];
			typeof o == "string" && o !== "" && Zr(o, `${t}.options.${a}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		}
		e.component === "geo_map" && i.basemap != null && Ur(i.basemap, `${t}.options.basemap`, n, r);
	}
}
function Ur(e, t, n, r) {
	let i;
	try {
		i = f(e);
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
		Zr(i.style_url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		return;
	}
	i.kind === "raster" && i.tiles.forEach((e, i) => {
		Zr(e, `${t}.tiles[${i}]`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
	});
}
function Wr(e, t, n, r) {
	let { url: i, sandbox: a } = qr(e);
	i && Zr(i, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), Qr(a, `${t}.iframe.sandbox`, n, r);
}
function Gr(e, t, n, r) {
	let i = Jr(e.source), a = typeof i == "string" ? i : i && typeof i == "object" && typeof i.url == "string" ? i.url : void 0;
	a && Zr(a, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
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
			typeof o == "string" && o && Zr(o, `${t}.media.items[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
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
			typeof o == "string" && o && Zr(o, `${t}.media.collections[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
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
function Zr(e, t, n, r, i) {
	let a = e.trim();
	if (!a) {
		i.push({
			path: t,
			severity: "error",
			message: "URL must be non-empty"
		});
		return;
	}
	if ($r(a)) {
		if (ei(a)) {
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
	if (ti(a).includes("${")) {
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
function Qr(e, t, n, r) {
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
function $r(e) {
	return !e.startsWith("//") && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function ei(e) {
	let t = e.indexOf("${");
	if (t === -1) return !1;
	let n = e.slice(0, t);
	return !/[/?#]/.test(n) || /^\/+$/.test(n);
}
function ti(e) {
	if (e.startsWith("//")) {
		let t = e.slice(2).search(/[/?#]/);
		return t === -1 ? e : e.slice(0, t + 2);
	}
	let t = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/);
	return t ? t[0] : "";
}
//#endregion
//#region src/core/snapshot.ts
function ni(e, t) {
	return e.id || `__mt_idx_${t}`;
}
function ri(e) {
	let t = e?.widgets;
	return !Array.isArray(t) || t.length === 0 ? !1 : t.every((e) => {
		let t = e.source;
		if (!t) return !0;
		let n = t.inline !== void 0 || t.data !== void 0, r = !!(t.source_id || t.url);
		return n || !r;
	});
}
function ii(e, t, n, r, i) {
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
var ai = {
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
}, oi = [
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
], si = 200, ci = 200;
function li({ value: e, onChange: t }) {
	return /* @__PURE__ */ C("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: oi.map((n) => {
			let r = e.toLowerCase() === n;
			return /* @__PURE__ */ C("button", {
				onClick: () => t(n),
				className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				children: n
			}, n);
		})
	});
}
var ui = [
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
function di({ value: e, onChange: t }) {
	return /* @__PURE__ */ C("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: ui.map((n) => {
			let r = e === n.ms;
			return /* @__PURE__ */ C("button", {
				onClick: () => t(n.ms),
				className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
				children: n.label
			}, n.label);
		})
	});
}
function fi() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ w("button", {
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
function pi(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}
function mi(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function hi() {
	let { recentActions: e, widgetHealth: t } = be(), n = Pe(!0), r = e[0], i = Object.values(t), a = i.filter((e) => e.streaming), o = a.filter((e) => e.connected && !e.error).length, s = i.filter((e) => e.error).length, c = i.filter((e) => e.stale).length, l = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ w("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ C("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ w("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ C("span", {
							className: "tabular-nums w-7 shrink-0",
							children: mi(n, r.receivedAt)
						}),
						/* @__PURE__ */ C("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ C("span", {
							className: `uppercase tracking-wider shrink-0 ${l}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ C("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ C("span", {
					className: "text-zinc-500",
					children: "idle"
				})
			}),
			a.length > 0 && /* @__PURE__ */ w("span", {
				className: o === a.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${o} of ${a.length} streams connected`,
				children: [
					/* @__PURE__ */ w("span", {
						className: "tabular-nums",
						children: [
							o,
							"/",
							a.length
						]
					}),
					" ",
					/* @__PURE__ */ C("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			c > 0 && /* @__PURE__ */ w("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${c} widget(s) without recent updates`,
				children: [c, " stale"]
			}),
			s > 0 && /* @__PURE__ */ w("span", {
				className: "text-red-400 tabular-nums",
				children: [s, " err"]
			}),
			/* @__PURE__ */ C("span", {
				className: "tabular-nums text-zinc-300",
				children: pi(n)
			})
		]
	});
}
function gi({ health: e }) {
	let t = Object.values(e);
	if (t.length === 0) return null;
	let n = t.filter((e) => e.streaming), r = n.filter((e) => e.connected && !e.error).length, i = t.filter((e) => e.error);
	if (n.length === 0 && i.length === 0) return null;
	let a = i.map((e) => e.title).join("\n");
	return /* @__PURE__ */ w("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider",
		children: [n.length > 0 && /* @__PURE__ */ w("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ w("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ C("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ w("span", {
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
function _i({ onClick: e }) {
	return /* @__PURE__ */ C("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function vi({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ w("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function yi({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ C("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to standard density" : "Switch to compact density",
		children: e ? "Standard" : "Compact"
	});
}
function bi({ onCopied: e }) {
	return /* @__PURE__ */ C("button", {
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
function xi({ onClick: e, busy: t }) {
	return /* @__PURE__ */ C("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function Si({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ w("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ C("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ w("span", {
				className: "text-zinc-600 normal-case tracking-normal",
				children: ["· ", n]
			}) : null
		]
	});
}
function Ci(e) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
	let t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
var wi = {};
function Ti({ template: n, backendUrl: r, backendHeaders: i = wi, fetch: a, onEvent: o, onIntent: s, onCtxChange: c, paletteSuggest: l, chrome: u = "full", onShare: f, theme: p, templateTrust: m = "untrusted", templateTrustPolicy: h = $, resolveAssetIntent: _, assetRenderers: T, assetApplicationFrame: ee, saveAssetOpenPreference: D, onAssetOpenError: te, registry: O }) {
	let ne = e(), k = p ?? ne?.theme ?? "dark", A = E(), re = n.columns || 12, [j, ie] = x(n.widgets), ae = O ? [...O.keys()].sort().join("\0") : "", M = y(() => Mr(n, O?.keys(), { includeBuiltIns: O == null }), [
		n,
		O,
		ae
	]), N = y(() => m === "trusted" ? [] : Lr(n, h), [
		n,
		m,
		h
	]), P = y(() => [...M, ...N], [M, N]), F = y(() => P.some((e) => e.severity === "error"), [P]), I = y(() => N.some((e) => e.severity === "error"), [N]), L = y(() => !!n.frozenAt || ri(n), [n]), [oe, se] = x(!1), [R, ce] = x(() => {
		let e = n.context?.values ?? {};
		return typeof window > "u" ? e : {
			...e,
			...fr(window.location.search)
		};
	}), [le, ue] = x(null), [de, fe] = x(!1), [pe, z] = x(!1), [B, me] = x(!1);
	v(() => {
		ue(Ai("refreshIntervalMs", null)), fe(Ai("compact", !1)), z(Ai("soundEnabled", !1)), me(!0);
	}, []), v(() => {
		B && ji("refreshIntervalMs", le);
	}, [B, le]), v(() => {
		B && ji("compact", de);
	}, [B, de]), v(() => {
		B && ji("soundEnabled", pe);
	}, [B, pe]);
	let [he, ge] = x(null), [V, _e] = x(null), [ve, be] = x(null), [xe, Se] = x([]), [Ce, we] = x(!1), Te = b(0), Ee = b(!1), De = g((e) => {
		be((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), Oe = b(o);
	v(() => {
		Oe.current = o;
	}, [o]);
	let ke = b(s);
	v(() => {
		ke.current = s;
	}, [s]);
	let Ae = g((e) => {
		ke.current?.(e);
	}, []), [Me, Ne] = x([]), Pe = g(() => Ne([]), []), [Ie, Le] = x([]), Re = g(() => Le([]), []), [ze, Be] = x({}), Ve = g((e, t) => {
		Be((n) => {
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
	}, []), He = b(/* @__PURE__ */ new Map()), Ue = g((e, t) => (He.current.set(e, t), () => {
		He.current.get(e) === t && He.current.delete(e);
	}), []), We = b({
		widgets: j,
		ctx: R,
		template: n
	});
	We.current = {
		widgets: j,
		ctx: R,
		template: n
	};
	let Ge = g(() => {
		let { widgets: e, ctx: t, template: n } = We.current;
		return ii(n, e, t, (e, t) => {
			let n = He.current.get(ni(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), Ke = g((e) => {
		Oe.current?.(e), e.type === "action" ? Ne((t) => [{
			receivedAt: Date.now(),
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}, ...t].slice(0, si)) : e.type === "alert" && Le((t) => [{
			receivedAt: Date.now(),
			widgetId: e.widgetId,
			severity: e.severity,
			message: e.message,
			predicate: e.predicate
		}, ...t].slice(0, ci));
	}, []), H = g((e, t = "info") => {
		Te.current += 1;
		let n = Te.current;
		Se((r) => [...r, {
			id: n,
			message: e,
			severity: t
		}]);
	}, []), qe = g(async () => {
		if (!Ee.current) {
			Ee.current = !0, we(!0);
			try {
				let e = Ge();
				f ? await f(e) : Ci(e), H(f ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				H(`Snapshot failed: ${t}`, "error");
			} finally {
				Ee.current = !1, we(!1);
			}
		}
	}, [
		f,
		Ge,
		H
	]), Je = g((e) => {
		Se((t) => t.filter((t) => t.id !== e));
	}, []), Ye = g((e, t) => {
		ce((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	v(() => {
		if (typeof window > "u") return;
		let e = pr(window.location.search, R), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [R]);
	let U = b(c);
	v(() => {
		U.current = c;
	}, [c]), v(() => {
		U.current?.(R);
	}, [R]);
	let W = g((e, t) => {
		ie((n) => ur(n, e, t));
	}, []), Xe = (e) => A === "mobile" ? re : A === "tablet" ? Math.min(e, Math.floor(re / 2)) : Math.min(e, re), Ze = y(() => ({
		dispatch: W,
		ctx: R,
		setCtx: Ye,
		backendUrl: r,
		backendHeaders: i,
		fetch: a,
		widgets: j,
		refreshIntervalMs: le ?? void 0,
		toast: H,
		compact: de,
		fullscreenId: he,
		setFullscreenId: ge,
		focusedId: V,
		setFocusedId: _e,
		refreshPulse: ve,
		requestRefresh: De,
		emit: Ke,
		emitIntent: Ae,
		recentActions: Me,
		clearRecentActions: Pe,
		recentAlerts: Ie,
		clearRecentAlerts: Re,
		soundEnabled: pe,
		widgetHealth: ze,
		reportWidgetHealth: Ve,
		registerWidgetData: Ue,
		snapshot: Ge
	}), [
		W,
		R,
		Ye,
		r,
		i,
		a,
		j,
		le,
		H,
		de,
		he,
		V,
		ve,
		De,
		Ke,
		Ae,
		Me,
		Pe,
		Ie,
		Re,
		pe,
		ze,
		Ve,
		Ue,
		Ge
	]), G = g((e, t) => {
		H(`Could not ${t.intent} ${t.asset.name}: ${e.message}`, "error"), te?.(e, t);
	}, [te, H]);
	v(() => {
		if (!he) return;
		let e = (e) => {
			e.key === "Escape" && ge(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [he]), v(() => {
		V && typeof document < "u" && document.getElementById(`mt-widget-${V}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [V]), v(() => {
		let e = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			let t = e.target?.tagName;
			if (t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable) return;
			let r = n.shortcuts?.find((t) => t.key === e.key);
			if (r) {
				e.preventDefault();
				for (let [e, t] of Object.entries(r.ctx)) Ye(e, t);
				return;
			}
			let i = j.map((e) => e.id).filter((e) => !!e);
			if (i.length === 0) return;
			let a = (e) => {
				let t = V ? i.indexOf(V) : -1, n = i[(t + e + i.length) % i.length];
				_e(n);
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
					V && (e.preventDefault(), ge(V));
					break;
				case "r":
					V && (e.preventDefault(), De(V));
					break;
				case "Escape": V && _e(null);
			}
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		j,
		V,
		De,
		n.shortcuts,
		Ye
	]);
	let Qe = !I && he ? j.find((e) => e.id === he) : null;
	return /* @__PURE__ */ C(ye.Provider, {
		value: Ze,
		children: /* @__PURE__ */ C("div", {
			className: `mtc-root mtc-theme-${k}`,
			"data-theme": k,
			"data-density": de ? "compact" : "standard",
			children: /* @__PURE__ */ C(t, {
				theme: k,
				density: de ? "compact" : "standard",
				children: /* @__PURE__ */ C(d, {
					resolveAssetIntent: _,
					renderers: T,
					applicationFrame: ee,
					savePreference: D,
					onError: G,
					children: /* @__PURE__ */ C(Fe, { children: /* @__PURE__ */ w(lr, { children: [
						/* @__PURE__ */ C(Cr, { suggest: l }),
						/* @__PURE__ */ C(Er, { templateShortcuts: n.shortcuts }),
						/* @__PURE__ */ C(kr, {
							toasts: xe,
							dismiss: Je
						}),
						P.length > 0 && (!oe || F) && /* @__PURE__ */ C(Ei, {
							issues: P,
							dismissible: !F,
							onDismiss: () => se(!0)
						}),
						/* @__PURE__ */ w("div", {
							className: "mtc-workspace min-h-full flex flex-col",
							children: [/* @__PURE__ */ w("div", {
								className: "flex-1",
								children: [(n.title || u === "full") && /* @__PURE__ */ w("div", {
									className: "mtc-toolbar",
									children: [/* @__PURE__ */ w("div", {
										className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
										children: [n.title && /* @__PURE__ */ C("h1", {
											className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
											children: je(n.title, R)
										}), u === "full" && /* @__PURE__ */ w("div", {
											className: "ml-auto flex items-center gap-2 flex-wrap",
											children: [
												L ? /* @__PURE__ */ C(Si, { frozenAt: n.frozenAt }) : /* @__PURE__ */ w(S, { children: [
													/* @__PURE__ */ C(gi, { health: ze }),
													/* @__PURE__ */ C(di, {
														value: le,
														onChange: ue
													}),
													/* @__PURE__ */ C(_i, { onClick: () => De("*") })
												] }),
												/* @__PURE__ */ C(vi, {
													enabled: pe,
													onToggle: () => z((e) => !e)
												}),
												/* @__PURE__ */ C(yi, {
													compact: de,
													onToggle: () => fe((e) => !e)
												}),
												!L && /* @__PURE__ */ C(xi, {
													onClick: () => void qe(),
													busy: Ce
												}),
												/* @__PURE__ */ C(bi, { onCopied: () => H("URL copied", "ok") }),
												/* @__PURE__ */ C(fi, {})
											]
										})]
									}), u === "full" && Object.keys(R).length > 0 && /* @__PURE__ */ w("div", {
										className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ C("span", {
											className: "text-[9px] uppercase tracking-[0.14em] text-zinc-500 mr-1",
											children: "Context"
										}), Object.entries(R).map(([e, t]) => e === "range" ? /* @__PURE__ */ C(li, {
											value: t,
											onChange: (t) => Ye(e, t)
										}, e) : /* @__PURE__ */ w("div", {
											className: "mtc-context-chip px-2 py-1 text-[11px]",
											children: [/* @__PURE__ */ C("span", {
												className: "text-zinc-500 uppercase tracking-wider mr-1",
												children: e
											}), /* @__PURE__ */ C("span", {
												className: "text-zinc-100 font-mono",
												children: t
											})]
										}, e))]
									})]
								}), /* @__PURE__ */ C("div", {
									className: "p-3 md:p-5",
									children: /* @__PURE__ */ C("div", {
										className: "grid gap-3 md:gap-4 items-start",
										style: { gridTemplateColumns: `repeat(${re}, 1fr)` },
										children: I ? /* @__PURE__ */ C(Di, { issues: N }) : j.map((e, t) => /* @__PURE__ */ C("div", {
											id: e.id ? `mt-widget-${e.id}` : void 0,
											style: { gridColumn: `span ${Xe(e.span || 6)}` },
											children: /* @__PURE__ */ C(or, {
												config: e,
												contentHeight: e.height || ai[e.component] || 280,
												snapshotKey: ni(e, t),
												registry: O
											})
										}, e.id || t))
									})
								})]
							}), u === "full" && /* @__PURE__ */ C(hi, {})]
						}),
						Qe && /* @__PURE__ */ C(Oi, {
							widget: Qe,
							registry: O,
							onClose: () => ge(null)
						})
					] }) })
				})
			})
		})
	});
}
function Ei({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ w("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ w("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ w("div", {
				className: "font-medium uppercase tracking-wider text-[10px] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ w("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ w("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ C("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ C("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ C("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ w("li", {
					className: "opacity-60 text-[10px]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ C("button", {
			onClick: n,
			className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function Di({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ w("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ C("div", {
				className: "font-medium text-xs uppercase tracking-wider mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ C("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ w("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ w("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ C("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ C("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ C("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ w("li", {
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
function Oi({ widget: e, registry: t, onClose: n }) {
	let r = typeof window < "u" ? Math.floor(window.innerHeight * .82) : 600;
	return /* @__PURE__ */ w("div", {
		className: "fixed inset-0 z-30 bg-zinc-950 p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: n,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Fullscreen ${e.title ?? e.id ?? e.component}`,
		children: [/* @__PURE__ */ w("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ C("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ C("button", {
				onClick: n,
				autoFocus: !0,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ C("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ C(or, {
				config: e,
				contentHeight: r,
				registry: t
			})
		})]
	});
}
var ki = "medallion-terminal:";
function Ai(e, t) {
	if (typeof window > "u" || !window.localStorage) return t;
	try {
		let n = window.localStorage.getItem(ki + e);
		return n == null ? t : JSON.parse(n);
	} catch {
		return t;
	}
}
function ji(e, t) {
	if (typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(ki + e, JSON.stringify(t));
	} catch {}
}
//#endregion
//#region src/core/MultiDashboard.tsx
function Mi(e, t) {
	v(() => {
		let n = (n) => {
			if (!(n.metaKey || n.ctrlKey)) return;
			let r = Number(n.key);
			Number.isFinite(r) && r >= 1 && r <= 9 && r <= e && (n.preventDefault(), t(r - 1));
		};
		return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
	}, [e, t]);
}
function Ni({ tabs: n, activeIndex: r, onSelect: i, backendUrl: a, backendHeaders: o, fetch: s, theme: c, templateTrust: l, templateTrustPolicy: u, resolveAssetIntent: d, assetRenderers: f, assetApplicationFrame: p, saveAssetOpenPreference: m, onAssetOpenError: h, onIntent: g, registry: _ }) {
	let y = e(), b = c ?? y?.theme ?? "dark", S = Math.max(0, Math.min(r, n.length - 1));
	Mi(n.length, i);
	let [T, E] = x(() => /* @__PURE__ */ new Set([S]));
	return v(() => {
		E((e) => e.has(S) ? e : /* @__PURE__ */ new Set([...e, S]));
	}, [S]), n.length === 0 ? null : /* @__PURE__ */ C("div", {
		className: `mtc-root mtc-theme-${b}`,
		"data-theme": b,
		children: /* @__PURE__ */ C(t, {
			theme: b,
			density: y?.density ?? "standard",
			children: /* @__PURE__ */ w("div", {
				className: "mtc-workspace min-h-full",
				children: [/* @__PURE__ */ C(Pi, {
					tabs: n,
					activeIndex: S,
					onSelect: i
				}), n.map((e, t) => /* @__PURE__ */ C("div", {
					style: { display: t === S ? "block" : "none" },
					children: T.has(t) && /* @__PURE__ */ C(Ti, {
						template: e.template,
						backendUrl: a,
						backendHeaders: o,
						fetch: s,
						theme: b,
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
function Pi({ tabs: e, activeIndex: t, onSelect: n }) {
	let r = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ C("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ w("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ C("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ C("span", {
					className: "text-[9px] text-zinc-500 font-mono uppercase tracking-wider",
					children: o
				})]
			}, i);
		})
	});
}
function Fi(e = 0) {
	let [t, n] = x(() => {
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
export { Vt as $, er as A, be as At, Vn as B, ee as Bt, sr as C, Se as Ct, nr as D, Oe as Dt, or as E, je as Et, Zn as F, pe as Ft, $t as G, pn as H, E as Ht, Kn as I, L as It, Gt as J, Xt as K, qn as L, I as Lt, Un as M, ge as Mt, Hn as N, _e as Nt, tr as O, Me as Ot, Gn as P, ve as Pt, Ft as Q, Jn as R, P as Rt, ur as S, Ce as St, cr as T, Te as Tt, Zt as U, mn as V, te as Vt, Qt as W, Ut as X, Wt as Y, Bt as Z, _r as _, Ne as _t, ri as a, gt as at, fr as b, Ee as bt, Fr as c, Et as ct, Lr as d, $e as dt, Dt as et, jr as f, tt as ft, vr as g, Le as gt, Cr as h, Re as ht, ii as i, _t as it, Wn as j, me as jt, $n as k, ye as kt, Pr as l, bt as lt, Er as m, rt as mt, Fi as n, Ot as nt, ni as o, Tt as ot, Mr as p, et as pt, Ht as q, Ti as r, vt as rt, Nr as s, St as st, Ni as t, yt as tt, $ as u, xt as ut, gr as v, Fe as vt, lr as w, we as wt, pr as x, De as xt, hr as y, Pe as yt, Xn as z, O as zt };
