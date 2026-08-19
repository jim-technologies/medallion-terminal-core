import { n as e, t } from "./States-BSRKPrE1.js";
import { c as n, t as r } from "./AssetOpen-miowZkWQ.js";
import { o as i } from "./basemaps-DoOvxEpO.js";
import { Suspense as a, createContext as o, lazy as s, useCallback as c, useContext as l, useEffect as u, useMemo as d, useRef as f, useState as p } from "react";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
//#region src/hooks/useBreakpoint.ts
function _() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function v() {
	let [e, t] = p(_);
	return u(() => {
		let e = () => t(_());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e;
}
//#endregion
//#region src/core/connectFraming.ts
var y = "application/connect+json", b = new TextDecoder();
async function x(e, t) {
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
					e.length > 0 && (a = JSON.parse(b.decode(e)));
				} catch {}
				t.isDisposed() || t.onTrailer?.(a);
				return;
			}
			let a = n.subarray(r + 5, r + 5 + i);
			r += 5 + i;
			try {
				let e = JSON.parse(b.decode(a));
				t.isDisposed() || t.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
//#region src/core/getNested.ts
function S(e, t) {
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
function C(e) {
	return e.inline ?? e.data;
}
function w(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function T(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function ee(e) {
	e.signal.aborted || e.abort();
}
var E = 3e4, D = 1e3;
function O(e, t) {
	return t ? S(e, t) : e;
}
var k = /* @__PURE__ */ new Set([
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
	"conversation"
]);
function te(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = Object.keys(e);
	return t.length === 1 && k.has(t[0]) ? e[t[0]] : e;
}
function A(e) {
	let [t, n] = p(null), [r, i] = p(!0), [a, o] = p(null), [s, l] = p(null), [m, h] = p(!1), [g, _] = p(null), [v, b] = p(0), S = c(() => b((e) => e + 1), []), k = f(D), A = f(void 0), j = f(null), M = f(void 0), N = f(0), P = c((t) => {
		let r = O(te(t), e?.transform);
		n(r), o(null), i(!1), l(Date.now()), N.current = Date.now();
	}, [e?.transform]), F = c((t) => {
		let n = e?.throttleMs ?? 0;
		if (n <= 0) {
			P(t);
			return;
		}
		let r = Date.now() - N.current;
		if (r >= n) {
			P(t);
			return;
		}
		j.current = t, M.current ||= setTimeout(() => {
			j.current !== null && P(j.current), j.current = null, M.current = void 0;
		}, n - r);
	}, [P, e?.throttleMs]), ne = d(() => e ? JSON.stringify([
		e.url,
		e.source_id,
		e.method,
		e.body,
		e.headers,
		e.stream,
		w(e),
		e.transform,
		e.throttleMs,
		e.inline !== void 0 || e.data !== void 0
	]) : "", [e]), re = e ? C(e) : void 0;
	return u(() => {
		if (!e) {
			i(!1);
			return;
		}
		if (re !== void 0) {
			F(re);
			return;
		}
		if (!e.url) {
			i(!1);
			return;
		}
		if (e.stream === "connect") {
			let t = !1, n = new AbortController(), r = async () => {
				if (!t) try {
					let r = await fetch(e.url, {
						method: "POST",
						headers: {
							...e.headers,
							"Content-Type": y
						},
						body: JSON.stringify(e.body ?? {}),
						signal: n.signal
					});
					if (!r.ok) throw Error(`ConnectRPC: HTTP ${r.status}`);
					if (!r.body) throw Error("ConnectRPC: no response body");
					h(!0), _(null), o(null), k.current = D;
					let i = r.body.getReader();
					await x(i, {
						onMessage: F,
						onTrailer: (e) => {
							if (e.error) {
								let n = e.error.code ?? "unknown", r = e.error.message ?? "stream error";
								t || o(`${n}: ${r}`);
							}
						},
						isDisposed: () => t
					}), i.releaseLock();
				} catch (e) {
					!t && e instanceof Error && !T(e) && o(e.message);
				} finally {
					if (!t) {
						h(!1);
						let e = k.current;
						_(Date.now() + e), A.current = setTimeout(() => {
							k.current = Math.min(k.current * 2, E), r();
						}, e);
					}
				}
			};
			return r(), () => {
				t = !0, ee(n), clearTimeout(A.current), h(!1), _(null);
			};
		}
		if (e.stream === !0) {
			let t = null, n = !1, r = () => {
				n || (t = new EventSource(e.url), t.onopen = () => {
					h(!0), _(null), o(null), k.current = D;
				}, t.onmessage = (e) => {
					try {
						F(JSON.parse(e.data));
					} catch {
						o("Failed to parse stream");
					}
				}, t.onerror = () => {
					if (t?.close(), h(!1), !n) {
						let e = k.current;
						_(Date.now() + e), A.current = setTimeout(() => {
							k.current = Math.min(k.current * 2, E), r();
						}, e);
					}
				});
			};
			return r(), () => {
				n = !0, clearTimeout(A.current), t?.close(), h(!1), _(null);
			};
		}
		let t = !1, n = !1, r = new AbortController(), a = async () => {
			if (!(t || n)) {
				n = !0;
				try {
					let n = await fetch(e.url, {
						method: e.method || "GET",
						headers: e.headers,
						body: e.body ? JSON.stringify(e.body) : void 0,
						signal: r.signal
					});
					if (!n.ok) throw Error(`HTTP ${n.status}`);
					let i = await n.json();
					t || F(i);
				} catch (e) {
					!t && e instanceof Error && !T(e) && o(e.message);
				} finally {
					n = !1, t || i(!1);
				}
			}
		};
		a();
		let s, c = w(e);
		return c && c > 0 && (s = setInterval(() => void a(), c)), () => {
			t = !0, ee(r), s && clearInterval(s);
		};
	}, [
		ne,
		F,
		re,
		v
	]), u(() => () => {
		M.current && clearTimeout(M.current);
	}, []), {
		data: t,
		loading: r,
		error: a,
		lastUpdated: s,
		connected: m,
		nextRetryAt: g,
		refresh: S
	};
}
//#endregion
//#region src/widgets/states.tsx
var j = {
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
function M({ component: e }) {
	switch (e ? j[e] : "block") {
		case "chart": return /* @__PURE__ */ h(F, {});
		case "table": return /* @__PURE__ */ h(ne, {});
		case "list": return /* @__PURE__ */ h(re, {});
		case "single": return /* @__PURE__ */ h(I, {});
		case "donut": return /* @__PURE__ */ h(ie, {});
		case "grid": return /* @__PURE__ */ h(ae, {});
		default: return /* @__PURE__ */ h(oe, {});
	}
}
function N({ children: e, padded: n }) {
	return /* @__PURE__ */ h(t, {
		title: e,
		compact: !0,
		icon: /* @__PURE__ */ h("span", {
			className: "text-xs uppercase tracking-[0.2em] leading-none",
			children: "·  ·  ·"
		}),
		className: `h-full${n ? " px-4" : ""}`
	});
}
var P = [
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
function F() {
	return /* @__PURE__ */ h("div", {
		className: "h-full flex items-end gap-1",
		children: P.map((e, t) => /* @__PURE__ */ h("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${e}%`,
				animationDelay: `${t * 40}ms`
			}
		}, t))
	});
}
function ne() {
	let e = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ g("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ h("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: e.map((e, t) => /* @__PURE__ */ h("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: e }
			}, t))
		}), Array.from({ length: 5 }).map((t, n) => /* @__PURE__ */ h("div", {
			className: "flex gap-4",
			children: e.map((e, t) => /* @__PURE__ */ h("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: e,
					animationDelay: `${(n * 3 + t) * 50}ms`
				}
			}, t))
		}, n))]
	});
}
function re() {
	return /* @__PURE__ */ h("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ g("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ h("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ g("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ h("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + t * 11 % 30}%`,
						animationDelay: `${t * 80}ms`
					}
				}), /* @__PURE__ */ h("div", {
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
function I() {
	return /* @__PURE__ */ g("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ h("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ h("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function ie() {
	return /* @__PURE__ */ g("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ h("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ h("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ h("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ h("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ g("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ h("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ h("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${t * 60}ms` }
				})]
			}, t))
		})]
	});
}
function ae() {
	return /* @__PURE__ */ h("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ h("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${t * 25}ms` }
		}, t))
	});
}
function oe() {
	return /* @__PURE__ */ h("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
//#region src/widgets/Placeholder.tsx
function se(e) {
	return /* @__PURE__ */ h(N, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var L = (e, t) => s(() => e().then((e) => ({ default: e[t] }))), ce = /* @__PURE__ */ new Map([
	["timeseries", L(() => import("./Timeseries-kFttlf7I.js").then((e) => e.n), "Timeseries")],
	["candlestick", L(() => import("./Candlestick-B9YwSQUw.js").then((e) => e.n), "Candlestick")],
	["table", L(() => import("./DataTable-CDXrFwzt.js").then((e) => e.n), "DataTable")],
	["metric", L(() => import("./Metric-Bnd59gUm.js").then((e) => e.n), "Metric")],
	["text", L(() => import("./Text-n1NWMQCb.js").then((e) => e.n), "Text")],
	["conversation", L(() => import("./ConversationImpl-x0IxGo5b.js"), "ConversationImpl")],
	["prompt", L(() => import("./Prompt-BnqtQDou.js").then((e) => e.n), "Prompt")],
	["gauge", L(() => import("./Gauge-B0SaMdRV.js").then((e) => e.n), "Gauge")],
	["distribution", L(() => import("./Distribution-CoNA4q9N.js").then((e) => e.n), "Distribution")],
	["heatmap", L(() => import("./Heatmap-ByAHiRqZ.js").then((e) => e.n), "Heatmap")],
	["events", L(() => import("./Events-B6P5X3-O.js").then((e) => e.n), "Events")],
	["catalog", L(() => import("./Catalog-BO1UENPf.js").then((e) => e.n), "Catalog")],
	["asset_catalog", L(() => import("./AssetCatalog-CcOZzL1d.js").then((e) => e.n), "AssetCatalog")],
	["object_view", L(() => import("./ObjectView-BoXBSLqS.js").then((e) => e.n), "ObjectView")],
	["code_browser", L(() => import("./CodeBrowser-B4PCoER9.js").then((e) => e.n), "CodeBrowser")],
	["record_grid", L(() => import("./RecordGrid-CxuA3t3X.js").then((e) => e.n), "RecordGrid")],
	["record_board", L(() => import("./RecordBoard-CixFEls8.js").then((e) => e.n), "RecordBoard")],
	["record_calendar", L(() => import("./RecordCalendar-Dv1Eb__Z.js").then((e) => e.n), "RecordCalendar")],
	["record_form", L(() => import("./RecordForm-BOMbNxOj.js").then((e) => e.n), "RecordForm")],
	["action_form", L(() => import("./ActionForm-B7fwHeZE.js").then((e) => e.n), "ActionForm")],
	["orderbook", L(() => import("./OrderBook-DCL-K_VP.js").then((e) => e.n), "OrderBook")],
	["depth_chart", L(() => import("./DepthChart-BA_P1YeQ.js").then((e) => e.n), "DepthChart")],
	["paired_grid", L(() => import("./PairedGrid-K63okfs3.js").then((e) => e.n), "PairedGrid")],
	["trade", L(() => import("./Trade-b4IMp2eX.js").then((e) => e.n), "Trade")],
	["ticker", L(() => import("./Ticker-C0qztfxq.js").then((e) => e.n), "Ticker")],
	["volume_profile", L(() => import("./VolumeProfile-CSGNBNyC.js").then((e) => e.n), "VolumeProfile")],
	["stat_strip", L(() => import("./StatStrip-Cd-ZHXbM.js").then((e) => e.n), "StatStrip")],
	["bar_chart", L(() => import("./BarChart-CSeD6Daz.js").then((e) => e.n), "BarChart")],
	["scatter", L(() => import("./Scatter-8SK-m-s6.js").then((e) => e.n), "Scatter")],
	["clock", L(() => import("./Clock-Cc9ABoWJ.js").then((e) => e.n), "Clock")],
	["treemap", L(() => import("./Treemap-IQ2sElqi.js").then((e) => e.n), "Treemap")],
	["image", L(() => import("./Image-VVFzJFdO.js").then((e) => e.n), "Image")],
	["iframe", L(() => import("./Iframe-CFZv4_XM.js").then((e) => e.n), "Iframe")],
	["histogram", L(() => import("./Histogram-BIsN9VMm.js").then((e) => e.n), "Histogram")],
	["section", L(() => import("./Section-Cpjr_7EV.js").then((e) => e.n), "Section")],
	["area_chart", L(() => import("./AreaChart-CejkW7-h.js").then((e) => e.n), "AreaChart")],
	["slider", L(() => import("./Slider-CMYZ93PI.js").then((e) => e.n), "Slider")],
	["select", L(() => import("./Select-CU-QJdhe.js").then((e) => e.n), "Select")],
	["boxplot", L(() => import("./Boxplot-xGA_8J8-.js").then((e) => e.n), "Boxplot")],
	["radar", L(() => import("./Radar-DjJW82nh.js").then((e) => e.n), "Radar")],
	["dag", L(() => import("./Dag-D5ol4un1.js").then((e) => e.n), "Dag")],
	["geo_map", L(() => import("./GeoMap-DIF9OaHT.js").then((e) => e.n), "GeoMap")],
	["media_gallery", L(() => import("./MediaGalleryImpl-BF1hEmMX.js"), "MediaGalleryImpl")],
	["multi_select", L(() => import("./MultiSelect-C6afEYiL.js").then((e) => e.n), "MultiSelect")],
	["json", L(() => import("./Json-DwvfkZOS.js").then((e) => e.n), "Json")],
	["sparkline", L(() => import("./Sparkline-Ceu2x3rA.js").then((e) => e.n), "Sparkline")],
	["action_log", L(() => import("./ActionLog-BcSPNPsd.js").then((e) => e.n), "ActionLog")],
	["alert_log", L(() => import("./AlertLog-BOgqA0yy.js").then((e) => e.n), "AlertLog")],
	["tape", L(() => import("./Tape-BZN-iKuO.js").then((e) => e.n), "Tape")],
	["file_browser", L(() => import("./FileBrowser-C_LuSDcI.js").then((e) => e.n), "FileBrowser")]
]), le = new Set(ce.keys()), ue = class {
	#e;
	constructor(e = {}) {
		this.#e = e.includeBuiltIns === !1 ? /* @__PURE__ */ new Map() : new Map(ce);
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
function de(e = {}) {
	return new ue(e);
}
var R = new Map(ce);
function fe(e, t) {
	return (t ? t.get(e) : R.get(e)) || se;
}
function z(e, t) {
	R.set(e, t);
}
var pe = o({
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
function B() {
	return l(pe);
}
//#endregion
//#region src/core/resolveSource.ts
var me = "medallion.terminal.v1.TerminalService";
function he(e) {
	return `${e.replace(/\/$/, "")}/${me}/Generate`;
}
function ge(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function _e(e) {
	return `${e.replace(/\/$/, "")}/${me}/SubmitAction`;
}
function ve(e) {
	return `${e.replace(/\/$/, "")}/${me}/WatchAction`;
}
function ye(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function be(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function xe() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var Se = !1, Ce = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function we(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new Ce(r);
		return "";
	});
}
function Te(e, t, n, r = {}) {
	if (e.source_id) {
		if (n === void 0) return Se ||= (console.warn(`[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), e;
		let i = e.stream ? "Stream" : "Get", a = n.replace(/\/$/, ""), o = {};
		if (e.params) for (let [n, r] of Object.entries(e.params)) o[n] = we(r, t, { strict: !0 });
		return {
			url: `${a}/${me}/${i}`,
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
		let n = we(e.url, t, { strict: !0 });
		if (e.params && Object.keys(e.params).length > 0) {
			let r = Object.entries(e.params).map(([e, n]) => `${encodeURIComponent(e)}=${encodeURIComponent(we(n, t, { strict: !0 }))}`).join("&");
			n = n.includes("?") ? `${n}&${r}` : `${n}?${r}`;
		}
		i.url = n;
	}
	return i;
}
//#endregion
//#region src/core/NowContext.tsx
var Ee = o({
	now: 0,
	subscribe: () => () => {}
});
function De(e = !0) {
	let { now: t, subscribe: n } = l(Ee);
	return u(() => {
		if (e) return n();
	}, [e, n]), t;
}
function Oe({ children: e }) {
	let [t, n] = p(() => Date.now()), r = f(0), i = f(null), a = d(() => ({
		now: t,
		subscribe: () => (r.current += 1, i.current ??= setInterval(() => n(Date.now()), 1e3), () => {
			r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
		})
	}), [t]);
	return u(() => () => {
		i.current != null && clearInterval(i.current);
	}, []), /* @__PURE__ */ h(Ee.Provider, {
		value: a,
		children: e
	});
}
//#endregion
//#region src/core/alerts.ts
var ke = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Ae(e, t) {
	let n = Me(t);
	return n ? Ie(n, e) : !1;
}
function je(e) {
	return Me(e) !== null;
}
function Me(e) {
	let t = e.trim();
	if (!t) return null;
	let n = Ne(t, "||"), r = [];
	for (let e of n) {
		let t = Ne(e, "&&"), n = [];
		for (let e of t) {
			let t = Pe(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function Ne(e, t) {
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
function Pe(e) {
	let t = e.trim().match(ke);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: Fe(i.trim())
	};
}
function Fe(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function Ie(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!Le(S(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function Le(e, t, n) {
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
var Re = {
	warn: 720,
	error: 480
}, ze = 160, Be = .08, Ve = null;
function V() {
	if (typeof window > "u") return null;
	if (Ve) return Ve;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (Ve = new t(), Ve) : null;
}
function He(e) {
	let t = Re[e];
	if (!t) return;
	let n = V();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime(Be, a + .02), i.gain.linearRampToValueAtTime(0, a + ze / 1e3), r.start(a), r.stop(a + ze / 1e3 + .05);
}
//#endregion
//#region src/widgets/platformShapes.ts
function H(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function U(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function Ue(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function We(e) {
	return H(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function W(e) {
	return H(e) ? e : {};
}
function Ge(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function Ke(e) {
	let t = Array.isArray(e) ? { items: e } : W(e);
	return {
		items: (Array.isArray(t.items) ? t.items : []).filter(H).map((e) => ({
			id: String(e.id ?? ""),
			name: String(e.name ?? e.id ?? ""),
			kind: String(e.kind ?? "asset"),
			description: U(e.description),
			owner: U(e.owner),
			status: U(e.status),
			updatedAt: U(e.updatedAt ?? e.updated_at),
			tags: Ue(e.tags),
			url: U(e.url),
			metadata: W(e.metadata),
			context: We(e.context)
		})).filter((e) => e.id && e.name),
		total: Ge(t.total),
		nextPageToken: U(t.nextPageToken ?? t.next_page_token)
	};
}
function qe(e) {
	let t = W(e), n = String(t.objectType ?? t.object_type ?? ""), r = String(t.objectId ?? t.object_id ?? ""), i = String(t.title ?? t.name ?? r);
	if (!n && !r && !i) return null;
	let a = (Array.isArray(t.properties) ? t.properties : []).filter(H).map((e) => ({
		key: String(e.key ?? ""),
		label: String(e.label ?? e.key ?? ""),
		value: e.value,
		format: U(e.format),
		description: U(e.description),
		group: U(e.group)
	})).filter((e) => e.key), o = (Array.isArray(t.links) ? t.links : []).filter(H).map((e) => ({
		relation: String(e.relation ?? ""),
		targetType: String(e.targetType ?? e.target_type ?? ""),
		targetId: String(e.targetId ?? e.target_id ?? ""),
		label: String(e.label ?? e.targetId ?? e.target_id ?? ""),
		status: U(e.status),
		context: We(e.context)
	})).filter((e) => e.targetId), s = (Array.isArray(t.actions) ? t.actions : []).filter(H).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		description: U(e.description),
		style: U(e.style),
		confirm: e.confirm === !0,
		params: W(e.params),
		disabled: e.disabled === !0
	})).filter((e) => e.id);
	return {
		objectType: n,
		objectId: r,
		title: i,
		description: U(t.description),
		status: U(t.status),
		updatedAt: U(t.updatedAt ?? t.updated_at),
		tags: Ue(t.tags),
		properties: a,
		links: o,
		actions: s
	};
}
function Je(e) {
	let t = W(e);
	if (!Array.isArray(t.nodes)) return null;
	let n = t.nodes.filter(H).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		kind: U(e.kind),
		status: U(e.status),
		subtitle: U(e.subtitle),
		tags: Ue(e.tags),
		metadata: W(e.metadata),
		context: We(e.context)
	})).filter((e) => e.id), r = (Array.isArray(t.edges) ? t.edges : []).filter(H).map((e) => ({
		from: String(e.from ?? ""),
		to: String(e.to ?? ""),
		label: U(e.label),
		kind: U(e.kind),
		status: U(e.status)
	})).filter((e) => e.from && e.to);
	return n.length > 0 ? {
		nodes: n,
		edges: r
	} : null;
}
function Ye(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "2" || t === "DIRECTORY" || t === "DIR" || t === "REPOSITORY_ENTRY_KIND_DIRECTORY" ? "directory" : t === "3" || t === "SYMLINK" || t === "REPOSITORY_ENTRY_KIND_SYMLINK" ? "symlink" : "file";
}
function Xe(e) {
	let t = W(e), n = String(t.repository ?? t.name ?? "");
	if (!n && !Array.isArray(t.entries) && !H(t.file)) return null;
	let r = (Array.isArray(t.entries) ? t.entries : []).filter(H).map((e) => ({
		path: String(e.path ?? e.name ?? ""),
		name: String(e.name ?? String(e.path ?? "").split("/").pop() ?? ""),
		kind: Ye(e.kind),
		language: U(e.language),
		sizeBytes: Ge(e.sizeBytes ?? e.size_bytes),
		updatedAt: U(e.updatedAt ?? e.updated_at)
	})).filter((e) => e.path && e.name), i = H(t.file) ? t.file : null, a = i ? {
		path: String(i.path ?? t.path ?? ""),
		content: String(i.content ?? ""),
		language: U(i.language),
		sizeBytes: Ge(i.sizeBytes ?? i.size_bytes),
		truncated: i.truncated === !0,
		url: U(i.url)
	} : void 0;
	return {
		repository: n,
		ref: String(t.ref ?? ""),
		path: String(t.path ?? ""),
		refs: Ue(t.refs),
		entries: r,
		file: a,
		url: U(t.url)
	};
}
//#endregion
//#region src/widgets/recordShapes.ts
function G(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Ze(e) {
	return G(e) ? e : {};
}
function K(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function Qe(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function $e(e) {
	return G(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function et(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
var tt = {
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
}, nt = {
	1: "grid",
	2: "board",
	3: "calendar",
	4: "gallery",
	5: "list",
	6: "timeline",
	7: "form"
};
function rt(e, t) {
	return String(e ?? "").replace(t, "").toLowerCase();
}
function it(e) {
	let t = tt[String(e)];
	if (t) return t;
	let n = rt(e, "RECORD_FIELD_TYPE_");
	return Object.values(tt).includes(n) ? n : "text";
}
function at(e) {
	let t = nt[String(e)];
	if (t) return t;
	let n = rt(e, "RECORD_VIEW_TYPE_");
	return Object.values(nt).includes(n) ? n : "grid";
}
function ot(e) {
	return typeof e == "boolean" ? "boolean" : typeof e == "number" ? "number" : Array.isArray(e) ? "multi_select" : "text";
}
function st(e) {
	return e === "formula" || e === "lookup" || e === "rollup" || e === "created_at" || e === "updated_at";
}
function ct(e, t) {
	let n = (Array.isArray(e.fields) ? e.fields : []).filter(G).map((e) => {
		let t = it(e.type), n = (Array.isArray(e.choices) ? e.choices : []).filter(G).map((e) => ({
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
			readOnly: e.readOnly === !0 || e.read_only === !0 || st(t),
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
			type: ot(n),
			required: !1,
			readOnly: !1,
			choices: [],
			allowMultiple: Array.isArray(n)
		};
	});
}
function lt(e) {
	let t = Ze(e), n = (Array.isArray(t.records) ? t.records : Array.isArray(t.rows) ? t.rows : []).filter(G).map((e, t) => {
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
			context: $e(e.context)
		};
	}).filter((e) => e.id), r = ct(t, n), i = (Array.isArray(t.views) ? t.views : []).filter(G).map((e) => ({
		id: String(e.id ?? ""),
		name: String(e.name ?? e.id ?? ""),
		type: at(e.type),
		visibleFields: Qe(e.visibleFields ?? e.visible_fields),
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
	})).filter((e) => e.id), a = Ze(t.capabilities), o = String(t.tableId ?? t.table_id ?? ""), s = String(t.tableName ?? t.table_name ?? o);
	return !o && !s && r.length === 0 && n.length === 0 ? null : {
		workspaceId: String(t.workspaceId ?? t.workspace_id ?? ""),
		tableId: o,
		tableName: s,
		primaryField: String(t.primaryField ?? t.primary_field ?? r[0]?.key ?? "id"),
		fields: r,
		records: n,
		views: i,
		activeViewId: K(t.activeViewId ?? t.active_view_id),
		total: et(t.total),
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
function ut(e) {
	return !e.readOnly && e.type !== "attachment";
}
function dt(e, t) {
	return Object.fromEntries(e.map((e) => [e.key, t ? t.values[e.key] : e.defaultValue ?? null]));
}
function ft(e, t, n) {
	let r = e.filter(ut).filter((e) => JSON.stringify(t[e.key]) !== JSON.stringify(n?.values[e.key])).map((e) => [e.key, t[e.key]]);
	return Object.fromEntries(r);
}
function pt(e, t, n = e.primaryField) {
	let r = t.values[n] ?? t.values[e.primaryField];
	return G(r) ? String(r.label ?? r.name ?? r.id ?? t.id) : Array.isArray(r) ? r.map(mt).join(", ") || t.id : r == null || r === "" ? t.id : String(r);
}
function mt(e) {
	return e == null ? "" : G(e) ? String(e.label ?? e.name ?? e.id ?? "") : Array.isArray(e) ? e.map(mt).filter(Boolean).join(", ") : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function ht(e) {
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)) return e;
	let t = e instanceof Date ? e : typeof e == "string" || typeof e == "number" ? new Date(e) : null;
	return !t || Number.isNaN(t.getTime()) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function gt(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function q(e) {
	return G(e) ? e.id ?? e.value ?? e.label ?? e.name ?? "" : e;
}
function _t(e, t) {
	let n = q(e), r = q(t);
	return typeof n == "number" && typeof r == "number" ? n === r : String(n ?? "").toLowerCase() === String(r ?? "").toLowerCase();
}
function vt(e, t) {
	if (e) return e.choices.find((e) => _t(e.value, t))?.color;
}
function yt(e, t) {
	let n = e.values[t.field], r = t.value;
	switch (t.operator) {
		case "empty": return gt(n);
		case "not_empty": return !gt(n);
		case "neq": return !_t(n, r);
		case "contains": return Array.isArray(n) ? n.some((e) => _t(e, r)) : mt(n).toLowerCase().includes(mt(r).toLowerCase());
		case "in": {
			let e = Array.isArray(r) ? r : [r];
			return (Array.isArray(n) ? n : [n]).some((t) => e.some((e) => _t(t, e)));
		}
		case "gt": return Number(q(n)) > Number(q(r));
		case "gte": return Number(q(n)) >= Number(q(r));
		case "lt": return Number(q(n)) < Number(q(r));
		case "lte": return Number(q(n)) <= Number(q(r));
		default: return _t(n, r);
	}
}
function bt(e, t) {
	if (!t) return e;
	let n = t.filters.length > 0 ? e.filter((e) => t.filters.every((t) => yt(e, t))) : e;
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
function xt(e, t, n) {
	return e.views.find((e) => e.id === n && e.type === t) ?? e.views.find((n) => n.id === e.activeViewId && n.type === t) ?? e.views.find((e) => e.type === t);
}
//#endregion
//#region src/widgets/mediaShape.ts
function St(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Ct(e) {
	return St(e) ? e : {};
}
function J(e) {
	if (e != null) return String(e).trim() || void 0;
}
function wt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim()) {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function Tt(e) {
	let t = wt(e);
	return t != null && t >= 0 ? t : void 0;
}
function Et(e) {
	return Array.isArray(e) ? [...new Set(e.map(String).map((e) => e.trim()).filter(Boolean))] : [];
}
function Dt(e) {
	return St(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function Ot(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
function kt(e, t, n) {
	if (e === 2) return "video";
	if (e === 1) return "image";
	let r = String(e ?? "").toLowerCase();
	return r.includes("video") || r === "movie" ? "video" : r.includes("image") || r.includes("photo") ? "image" : t?.toLowerCase().startsWith("video/") || /\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(n) ? "video" : "image";
}
function At(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).pop();
	if (!t) return "Untitled media";
	try {
		return decodeURIComponent(t);
	} catch {
		return t;
	}
}
function jt(e) {
	if (!St(e)) return null;
	let t = Ot(e.url ?? e.mediaUrl ?? e.media_url ?? e.src);
	if (!t) return null;
	let n = J(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type);
	return {
		id: J(e.id ?? e.mediaId ?? e.media_id) ?? t,
		title: J(e.title ?? e.name ?? e.label ?? e.filename) ?? At(t),
		kind: kt(e.kind ?? e.type ?? e.mediaType ?? e.media_type, n, t),
		url: t,
		thumbnailUrl: Ot(e.thumbnailUrl ?? e.thumbnail_url ?? e.thumbnail ?? e.posterUrl ?? e.poster_url ?? e.poster),
		description: J(e.description ?? e.caption),
		capturedAt: J(e.capturedAt ?? e.captured_at ?? e.takenAt ?? e.taken_at ?? e.dateTaken ?? e.date_taken),
		createdAt: J(e.createdAt ?? e.created_at ?? e.uploadedAt ?? e.uploaded_at),
		contentType: n,
		width: Tt(e.width),
		height: Tt(e.height),
		durationSeconds: Tt(e.durationSeconds ?? e.duration_seconds ?? e.duration),
		favorite: e.favorite === !0 || e.isFavorite === !0 || e.is_favorite === !0,
		tags: Et(e.tags),
		collectionIds: Et(e.collectionIds ?? e.collection_ids ?? e.albumIds ?? e.album_ids ?? e.albums),
		metadata: Ct(e.metadata),
		context: Dt(e.context)
	};
}
function Mt(e) {
	if (!St(e)) return null;
	let t = J(e.id ?? e.collectionId ?? e.collection_id ?? e.albumId ?? e.album_id);
	return t ? {
		id: t,
		name: J(e.name ?? e.title ?? e.label) ?? Vt(t),
		coverUrl: Ot(e.coverUrl ?? e.cover_url ?? e.thumbnailUrl ?? e.thumbnail_url),
		itemCount: Tt(e.itemCount ?? e.item_count ?? e.count),
		context: Dt(e.context)
	} : null;
}
function Nt(e) {
	let t = Array.isArray(e) ? { items: e } : Ct(e), n = (Array.isArray(t.items) ? t.items : Array.isArray(t.media) ? t.media : Array.isArray(t.assets) ? t.assets : []).map(jt).filter((e) => e !== null), r = (Array.isArray(t.collections) ? t.collections : Array.isArray(t.albums) ? t.albums : []).map(Mt).filter((e) => e !== null), i = new Set(r.map((e) => e.id));
	for (let e of new Set(n.flatMap((e) => e.collectionIds))) i.has(e) || r.push({
		id: e,
		name: Vt(e),
		itemCount: n.filter((t) => t.collectionIds.includes(e)).length,
		context: {}
	});
	return {
		items: Pt(n),
		collections: r,
		total: Tt(t.total),
		nextPageToken: J(t.nextPageToken ?? t.next_page_token)
	};
}
function Pt(e) {
	return [...e].sort((e, t) => {
		let n = zt(t) - zt(e);
		return n === 0 ? e.title.localeCompare(t.title) : n;
	});
}
function Ft(e, t) {
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
function It(e, t = "day") {
	let n = Pt(e);
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
		label: Bt(e, t),
		items: n
	}));
}
function Lt(e) {
	if (e == null || !Number.isFinite(e) || e < 0) return;
	let t = Math.round(e), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
function Rt(e) {
	if (!e) return;
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(t);
}
function zt(e) {
	let t = Date.parse(e.capturedAt ?? e.createdAt ?? "");
	return Number.isFinite(t) ? t : -Infinity;
}
function Bt(e, t) {
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
function Vt(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
//#region src/widgets/geoShape.ts
var Ht = /* @__PURE__ */ new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]);
function Ut(e) {
	let t = Y(e), n = t.geo ?? t.geojson ?? e, r = Y(n), i;
	if (r.type === "FeatureCollection" && Array.isArray(r.features)) i = r.features;
	else if (r.type === "Feature") i = [r];
	else if (Array.isArray(r.features)) i = r.features;
	else if (Array.isArray(r.points)) i = r.points;
	else if (Array.isArray(r.rows)) i = r.rows;
	else if (Array.isArray(n)) i = n;
	else return null;
	let a = i.map((e, t) => qt(e, t)).filter((e) => e !== null);
	return a.length > 0 ? {
		type: "FeatureCollection",
		features: a
	} : null;
}
function Wt(e) {
	let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity;
	for (let a of e.features) Qt(a.geometry.coordinates, (e) => {
		t = Math.min(t, e[0]), r = Math.max(r, e[0]), n = Math.min(n, e[1]), i = Math.max(i, e[1]);
	});
	return [
		t,
		n,
		r,
		i
	].every(Number.isFinite) ? [[t, n], [r, i]] : null;
}
function Gt(e) {
	let t = e.properties._mtc_context;
	if (typeof t != "string") return {};
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? {} : Object.fromEntries(Object.entries(e).filter((e) => typeof e[1] == "string"));
	} catch {
		return {};
	}
}
function Kt(e) {
	let t = e.properties._mtc_label;
	return typeof t == "string" && t !== "" ? t : e.id;
}
function qt(e, t) {
	let n = Y(e), r = Y(n.properties), i = Jt(n.geometry) ?? Yt(n);
	if (!i) return null;
	let a = String(n.id ?? r.id ?? r.feature_id ?? r.object_id ?? `feature-${t + 1}`), o = rn(n.label, n.name, r.label, r.name, r.title, a), s = rn(n.status, r.status), c = nn(n.value ?? r.value), l = {
		...tn(r.context),
		...tn(n.context)
	}, u = {
		...Y(r.metadata),
		...Y(n.metadata)
	};
	return {
		type: "Feature",
		id: a,
		geometry: i,
		properties: {
			...en(r),
			...en(u),
			_mtc_id: a,
			_mtc_label: o,
			_mtc_tone: $t(s),
			...s && { _mtc_status: s },
			...c !== void 0 && { _mtc_value: c },
			_mtc_context: JSON.stringify(l)
		}
	};
}
function Jt(e) {
	let t = Y(e), n = t.type;
	return typeof n != "string" || !Ht.has(n) || !Xt(n, t.coordinates) ? null : {
		type: n,
		coordinates: t.coordinates
	};
}
function Yt(e) {
	let t = nn(e.latitude ?? e.lat), n = nn(e.longitude ?? e.lng ?? e.lon);
	return t === void 0 || n === void 0 || t < -90 || t > 90 || n < -180 || n > 180 ? null : {
		type: "Point",
		coordinates: [n, t]
	};
}
function Xt(e, t) {
	return Zt(t, {
		Point: 0,
		MultiPoint: 1,
		LineString: 1,
		MultiLineString: 2,
		Polygon: 2,
		MultiPolygon: 3
	}[e]);
}
function Zt(e, t) {
	if (t === 0) {
		if (!Array.isArray(e) || e.length < 2) return !1;
		let t = Number(e[0]), n = Number(e[1]);
		return Number.isFinite(t) && Number.isFinite(n) && t >= -180 && t <= 180 && n >= -90 && n <= 90;
	}
	return Array.isArray(e) && e.length > 0 && e.every((e) => Zt(e, t - 1));
}
function Qt(e, t) {
	if (Array.isArray(e)) {
		if (e.length >= 2 && typeof e[0] == "number" && typeof e[1] == "number") {
			t(e);
			return;
		}
		for (let n of e) Qt(n, t);
	}
}
function $t(e) {
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
function en(e) {
	return Object.fromEntries(Object.entries(e).filter((e) => e[1] === null || typeof e[1] == "string" || typeof e[1] == "number" || typeof e[1] == "boolean"));
}
function Y(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function tn(e) {
	let t = Y(e);
	return Object.fromEntries(Object.entries(t).filter((e) => typeof e[1] == "string"));
}
function nn(e) {
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function rn(...e) {
	return e.find((e) => typeof e == "string" && e !== "");
}
//#endregion
//#region src/widgets/orderBookShape.ts
function an(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e, n = cn(t.bids, "bid"), r = cn(t.asks, "ask");
	if (n.length === 0 && r.length === 0) return null;
	let i = un(t.mid), a = un(t.spread);
	return {
		bids: n,
		asks: r,
		...i !== void 0 && { mid: i },
		...a !== void 0 && { spread: a },
		...typeof t.venue == "string" && t.venue !== "" && { venue: t.venue }
	};
}
function on(e, t = 100, n = "size") {
	let r = Number.isFinite(t) ? Math.max(1, Math.floor(t)) : 100, i = 0, a = e.bids.slice(0, r).map((e) => (i += sn(e, n), {
		price: e.price,
		side: "bid",
		cumulative: i
	})), o = 0, s = e.asks.slice(0, r).map((e) => (o += sn(e, n), {
		price: e.price,
		side: "ask",
		cumulative: o
	}));
	return [...a.reverse(), ...s];
}
function sn(e, t) {
	return t === "notional" ? e.price * e.size : e.size;
}
function cn(e, t) {
	if (!Array.isArray(e)) return [];
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = ln(t);
		e && n.set(e.price, (n.get(e.price) ?? 0) + e.size);
	}
	return Array.from(n, ([e, t]) => ({
		price: e,
		size: t
	})).sort((e, n) => t === "bid" ? n.price - e.price : e.price - n.price);
}
function ln(e) {
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
function un(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
//#endregion
//#region src/export/flatten.ts
var dn = {
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
function fn(e) {
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
function pn(e) {
	return Q(e) && Array.isArray(e.bars) ? Z(e.bars) : null;
}
function mn(e) {
	if (Array.isArray(e) && e.length > 0 && Q(e[0])) return Z(e);
	if (Q(e) && "rows" in e) {
		let t = e, n = Array.isArray(t.columns) ? t.columns : [];
		if (n.length > 0 && Q(n[0])) {
			let e = n.map((e) => e.key);
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, X(t[n])])) : hn(t, e))
			};
		}
		if (n.length > 0 && typeof n[0] == "string") {
			let e = n;
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, X(t[n])])) : hn(t, e))
			};
		}
		let r = t.rows;
		return r.length > 0 && Q(r[0]) ? Z(r) : dn;
	}
	return null;
}
function hn(e, t) {
	let n = {};
	for (let r of t) n[r] = X(e[r]);
	return n;
}
function gn(e) {
	return Q(e) && Array.isArray(e.cells) ? Z(e.cells) : null;
}
function _n(e) {
	return Q(e) && Array.isArray(e.slices) ? Z(e.slices) : null;
}
function vn(e) {
	return Q(e) && Array.isArray(e.events) ? Z(e.events) : null;
}
function yn(e) {
	return Q(e) && Array.isArray(e.items) ? Z(e.items) : null;
}
function bn(e) {
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
function xn(e) {
	let t = an(e);
	return t ? Z([...t.bids.map((e) => ({
		side: "bid",
		...e
	})), ...t.asks.map((e) => ({
		side: "ask",
		...e
	}))]) : null;
}
function Sn(e) {
	return typeof e == "number" ? {
		columns: ["value"],
		rows: [{ value: e }]
	} : Q(e) && "value" in e && typeof e.value != "object" ? Z([e]) : null;
}
function Cn(e) {
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
function wn(e) {
	let t = Ke(e);
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
function Tn(e) {
	let t = qe(e);
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
function En(e) {
	let t = Je(e);
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
function Dn(e) {
	let t = Xe(e);
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
function On(e) {
	let t = lt(e);
	return t ? Z(t.records.map((e) => ({
		id: e.id,
		...e.values,
		created_at: e.createdAt,
		updated_at: e.updatedAt,
		revision: e.revision
	}))) : null;
}
function kn(e) {
	let t = Ut(e);
	return t ? Z(t.features.map((e) => ({
		...Object.fromEntries(Object.entries(e.properties).filter(([e]) => !e.startsWith("_mtc_"))),
		id: e.id,
		label: Kt(e),
		geometry_type: e.geometry.type,
		geometry: e.geometry,
		status: e.properties._mtc_status,
		value: e.properties._mtc_value,
		context: Gt(e)
	}))) : null;
}
function An(e) {
	let t = Nt(e);
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
var jn = {
	timeseries: fn,
	area_chart: fn,
	sparkline: fn,
	candlestick: pn,
	table: mn,
	heatmap: gn,
	distribution: _n,
	events: vn,
	tape: vn,
	action_log: vn,
	alert_log: vn,
	text: yn,
	ticker: yn,
	conversation: bn,
	orderbook: xn,
	depth_chart: xn,
	metric: Sn,
	gauge: Cn,
	asset_catalog: wn,
	object_view: Tn,
	dag: En,
	code_browser: Dn,
	record_grid: On,
	record_board: On,
	record_calendar: On,
	record_form: On,
	geo_map: kn,
	media_gallery: An,
	SHAPE_TIMESERIES: fn,
	SHAPE_CANDLES: pn,
	SHAPE_TABLE: mn,
	SHAPE_METRIC: Sn,
	SHAPE_GAUGE: Cn,
	SHAPE_HEATMAP: gn,
	SHAPE_EVENTS: vn,
	SHAPE_DISTRIBUTION: _n,
	SHAPE_TEXT: yn,
	SHAPE_CONVERSATION: bn,
	SHAPE_ORDERBOOK: xn,
	SHAPE_ASSET_CATALOG: wn,
	SHAPE_OBJECT: Tn,
	SHAPE_GRAPH: En,
	SHAPE_REPOSITORY: Dn,
	SHAPE_RECORD_SET: On,
	SHAPE_GEO: kn,
	SHAPE_MEDIA: An
};
function Mn(e) {
	if (e == null) return dn;
	if (Array.isArray(e)) return e.length === 0 ? dn : Q(e[0]) ? Z(e) : {
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
function Nn(e, t) {
	if (e == null) return dn;
	if (t) {
		let n = jn[t];
		if (n) {
			let t = n(e);
			if (t) return t;
		}
	}
	for (let t of [
		fn,
		pn,
		gn,
		_n,
		vn,
		bn,
		yn,
		xn,
		An,
		wn,
		Tn,
		En,
		Dn,
		On,
		Cn,
		Sn,
		mn
	]) {
		let n = t(e);
		if (n && n.rows.length > 0) return n;
	}
	return Mn(e);
}
//#endregion
//#region src/export/serializers.ts
var Pn = {
	csv: "text/csv;charset=utf-8",
	json: "application/json;charset=utf-8",
	ndjson: "application/x-ndjson;charset=utf-8",
	parquet: "application/vnd.apache.parquet"
}, Fn = {
	csv: "csv",
	json: "json",
	ndjson: "ndjson",
	parquet: "parquet"
}, In = [
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
function Ln(e) {
	if (e == null) return "";
	let t = String(e);
	return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function Rn(e) {
	let { columns: t, rows: n } = e;
	return [t.map(Ln).join(","), ...n.map((e) => t.map((t) => Ln(e[t])).join(","))].join("\n");
}
function zn(e) {
	return JSON.stringify(e.rows, null, 2);
}
function Bn(e) {
	return e.rows.map((e) => JSON.stringify(e)).join("\n");
}
function Vn(e) {
	return e.columns.map((t) => ({
		name: t,
		data: e.rows.map((e) => e[t] ?? null)
	}));
}
async function Hn(e) {
	let { parquetWriteBuffer: t } = await import("./src-BZ5QG4y5.js"), n = t({ columnData: e.columns.length > 0 ? Vn(e) : [{
		name: "value",
		data: []
	}] });
	return new Uint8Array(n);
}
function Un(e, t) {
	switch (t) {
		case "csv": return Rn(e);
		case "json": return zn(e);
		case "ndjson": return Bn(e);
	}
}
//#endregion
//#region src/export/exportView.ts
function Wn(e) {
	return e.table ?? Nn(e.data, e.component);
}
async function Gn(e, t) {
	let n = Wn(e);
	if (t === "parquet") {
		let e = await Hn(n);
		return new Blob([e.slice().buffer], { type: Pn.parquet });
	}
	let r = Un(n, t);
	return new Blob([r], { type: Pn[t] });
}
function Kn(e) {
	return Wn(e).rows.length;
}
function qn(e, t) {
	return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${Fn[t]}`;
}
async function Jn(e, t, n) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return !1;
	let r = await Gn(e, t), i = URL.createObjectURL(r), a = document.createElement("a");
	return a.href = i, a.download = qn(n, t), document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(i), 0), !0;
}
//#endregion
//#region src/widgets/WidgetShell.tsx
function Yn(e, t) {
	if (!t) return null;
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "just now";
	if (n < 60) return `${n}s ago`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function Xn(t) {
	let { resolution: r, loading: i, error: o, data: s, options: c, component: l, widgetId: u, Component: d, onRenderError: f, onRetry: p } = t;
	return r.error ? /* @__PURE__ */ h(e, { message: r.error }) : i ? /* @__PURE__ */ h(M, { component: l }) : o ? /* @__PURE__ */ h(e, {
		message: o,
		onRetry: p
	}) : /* @__PURE__ */ h("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ h(n, {
			onError: f,
			children: /* @__PURE__ */ h(a, {
				fallback: /* @__PURE__ */ h(M, { component: l }),
				children: /* @__PURE__ */ h(d, {
					data: s,
					options: c,
					widgetId: u
				})
			})
		})
	});
}
function Zn({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: a, fullscreenId: o, setFullscreenId: s } = B(), [c, l] = p(!1), [d, m] = p(!1), [_, v] = p(!1), y = f(null);
	u(() => {
		if (!c) return;
		let e = (e) => {
			y.current && !y.current.contains(e.target) && (l(!1), m(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [c]);
	let b = e.source, x = b?.data !== void 0 && !b.url && !b.source_id, S = !!b && !x, C = !!e.id, w = !!e.id && o !== e.id, T = t == null ? 0 : Kn({
		data: t,
		component: e.component
	}), ee = T > 0, E = async (n) => {
		v(!0);
		try {
			let r = await Jn({
				data: t,
				component: e.component
			}, n, e.title ?? e.id ?? e.component);
			i(r ? `Exported ${T.toLocaleString()} rows as ${n.toUpperCase()}` : "Export failed", r ? "ok" : "warn");
		} catch {
			i("Export failed", "error");
		} finally {
			v(!1), l(!1), m(!1);
		}
	};
	return /* @__PURE__ */ g("div", {
		className: "relative",
		ref: y,
		children: [/* @__PURE__ */ h("button", {
			onClick: () => l((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			"aria-expanded": c,
			children: "⋮"
		}), c && /* @__PURE__ */ g("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				S && /* @__PURE__ */ h("button", {
					onClick: () => {
						n(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ h("button", {
					onClick: async () => {
						await r(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				ee && /* @__PURE__ */ g("div", { children: [/* @__PURE__ */ g("button", {
					onClick: () => m((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": d,
					children: [/* @__PURE__ */ g("span", { children: ["Export", _ ? "…" : ""] }), /* @__PURE__ */ h("span", {
						className: "text-zinc-600",
						children: d ? "▾" : "▸"
					})]
				}), d && /* @__PURE__ */ h("div", {
					className: "bg-zinc-950/60",
					children: In.map((e) => /* @__PURE__ */ h("button", {
						onClick: () => E(e.key),
						disabled: _,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				w && /* @__PURE__ */ h("button", {
					onClick: () => {
						s(e.id), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				C && /* @__PURE__ */ h("button", {
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
function Qn({ config: e, contentHeight: t, snapshotKey: n, registry: r }) {
	let { ctx: i, backendUrl: a, backendHeaders: o, refreshIntervalMs: s, compact: c, toast: l, focusedId: p, setFocusedId: m, refreshPulse: _, emit: v, soundEnabled: y, reportWidgetHealth: b, registerWidgetData: x } = B(), S = d(() => e.title ? we(e.title, i) : e.title, [e.title, i]), C = d(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = Te(e.source, i, a, o);
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
	]), w = C.source, { data: T, loading: ee, error: E, lastUpdated: D, connected: O, nextRetryAt: k, refresh: te } = A(w), j = fe(e.component, r), M = f(T);
	M.current = T, u(() => {
		if (n) return x(n, () => M.current);
	}, [n, x]);
	let N = !!w?.stream || !!(w?.refreshIntervalMs ?? w?.refreshInterval), P = w?.staleAfterMs, F = De(N && D != null || k != null || !!P && D != null), ne = !!P && D != null && F - D > P, re = f(0);
	u(() => {
		if (!_) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = _.id === "*";
		n && t === "self" || (n || _.id === e.id) && _.n > re.current && (re.current = _.n, te());
	}, [
		_,
		e.id,
		e.refresh_policy,
		te
	]);
	let I = f(!1);
	u(() => {
		let t = e.alert;
		if (!t || T == null) {
			I.current = !1;
			return;
		}
		let n = Ae(T, t.when);
		if (n && !I.current) {
			let n = we(t.message, i), r = t.severity ?? "warn";
			l(n, r), v({
				type: "alert",
				widgetId: e.id,
				severity: r,
				message: n,
				predicate: t.when
			}), y && He(r);
		}
		I.current = n;
	}, [
		T,
		e.alert,
		i,
		l,
		v,
		e.id,
		y
	]);
	let ie = f(null);
	u(() => {
		let t = C.error ?? E, n = C.error ? "resolve" : "data";
		t && t !== ie.current ? (v({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), ie.current = t) : t || (ie.current = null);
	}, [
		C.error,
		E,
		v,
		e.id,
		e.component
	]), u(() => {
		if (!e.id) return;
		let t = !!w?.stream;
		return b(e.id, {
			title: S || e.title || e.component,
			streaming: t,
			connected: !t || O,
			error: C.error ?? E,
			stale: ne
		}), () => b(e.id, null);
	}, [
		e.id,
		S,
		e.title,
		e.component,
		w?.stream,
		O,
		C.error,
		E,
		ne,
		b
	]);
	let ae = !!e.id && p === e.id;
	return /* @__PURE__ */ g("div", {
		onClick: e.id ? () => m(e.id) : void 0,
		className: "mtc-widget overflow-hidden",
		"data-focused": ae ? "true" : "false",
		children: [S && /* @__PURE__ */ g("div", {
			className: `mtc-widget-header ${c ? "px-2.5 py-1.5" : "px-4 py-2.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ h("h2", {
				className: `${c ? "text-[11px]" : "text-xs"} font-semibold tracking-[0.01em] text-zinc-100 truncate`,
				children: S
			}), /* @__PURE__ */ g("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					N && D && /* @__PURE__ */ g("span", {
						className: `text-[10px] ${ne ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [ne ? "stale · " : "", Yn(F, D)]
					}),
					e.source?.stream && !O && k != null && /* @__PURE__ */ g("span", {
						className: "text-[10px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((k - F) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ h("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${O ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: O ? "Connected" : k ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ h(Zn, {
						widget: e,
						data: T,
						onToast: l,
						onRefresh: te,
						onCopy: async () => {
							if (T == null) return l("No data to copy", "warn"), !1;
							if (typeof navigator > "u" || !navigator.clipboard) return l("Clipboard unavailable", "warn"), !1;
							try {
								return await navigator.clipboard.writeText(JSON.stringify(T, null, 2)), l(`${e.title ?? e.component} copied`, "ok"), !0;
							} catch {
								return l("Clipboard blocked", "warn"), !1;
							}
						}
					})
				]
			})]
		}), /* @__PURE__ */ h("div", {
			className: c ? "p-2.5" : "p-4",
			style: { height: c ? Math.round(t * .92) : t },
			children: Xn({
				resolution: C,
				loading: ee,
				error: E,
				data: T,
				options: e.options,
				component: e.component,
				widgetId: e.id,
				Component: j,
				onRenderError: (t) => v({
					type: "widget_error",
					widgetId: e.id,
					component: e.component,
					message: t.message,
					source: "render"
				}),
				onRetry: w && !(w.inline !== void 0 || w.data !== void 0) ? te : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/HoverContext.tsx
var $n = o({
	hoverTime: null,
	setHoverTime: () => {}
});
function er() {
	return l($n);
}
function tr({ children: e }) {
	let [t, n] = p(null), r = d(() => ({
		hoverTime: t,
		setHoverTime: n
	}), [t]);
	return /* @__PURE__ */ h($n.Provider, {
		value: r,
		children: e
	});
}
//#endregion
//#region src/core/applyActions.ts
function nr(e, t, n) {
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
var rr = "ctx.";
function ir(e) {
	let t = {}, n = new URLSearchParams(e);
	for (let [e, r] of n) e.startsWith(rr) && (t[e.slice(4)] = r);
	return t;
}
function ar(e, t) {
	let n = new URLSearchParams(e);
	for (let e of [...n.keys()]) e.startsWith(rr) && n.delete(e);
	for (let [e, r] of Object.entries(t)) n.set(`${rr}${e}`, r);
	return n.toString();
}
//#endregion
//#region src/core/savedViews.ts
var or = "medallion-terminal:view:";
function sr(e, t) {
	if (!(!e || typeof window > "u" || !window.localStorage)) try {
		window.localStorage.setItem(or + e, JSON.stringify(t));
	} catch {}
}
function cr(e) {
	if (!e || typeof window > "u" || !window.localStorage) return null;
	try {
		let t = window.localStorage.getItem(or + e);
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
function lr() {
	if (typeof window > "u" || !window.localStorage) return [];
	let e = [];
	for (let t = 0; t < window.localStorage.length; t++) {
		let n = window.localStorage.key(t);
		n && n.startsWith(or) && e.push(n.slice(24));
	}
	return e.sort();
}
function ur(e) {
	if (!(!e || typeof window > "u" || !window.localStorage)) try {
		window.localStorage.removeItem(or + e);
	} catch {}
}
//#endregion
//#region src/core/CommandPalette.tsx
var dr = /* @__PURE__ */ new Set([
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
]), fr = 150, pr = 8;
function mr(e, t) {
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
	} : dr.has(n.toLowerCase()) ? {
		kind: "set",
		key: "range",
		value: n.toLowerCase()
	} : {
		kind: "set",
		key: t,
		value: n
	};
}
function hr({ suggest: e } = {}) {
	let { ctx: t, setCtx: n, toast: r } = B(), [i, a] = p(!1), [o, s] = p(""), [c, l] = p([]), [m, _] = p(-1), v = f(null), [y, b] = p([]), x = f(0);
	u(() => {
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" ? (e.preventDefault(), a((e) => !e)) : e.key === "Escape" && a(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), u(() => {
		i ? v.current?.focus() : (s(""), _(-1), b([]));
	}, [i]), u(() => {
		if (!e || !i) return;
		let t = o.trim();
		if (!t) {
			b([]);
			return;
		}
		let n = ++x.current, r = setTimeout(async () => {
			try {
				let r = await e(t);
				if (n !== x.current) return;
				b(r.slice(0, pr));
			} catch {
				n === x.current && b([]);
			}
		}, fr);
		return () => clearTimeout(r);
	}, [
		o,
		i,
		e
	]);
	let S = d(() => Object.keys(t)[0] ?? "symbol", [t]), C = d(() => i ? lr() : [], [i, c]);
	if (!i) return null;
	let w = () => {
		let e = mr(o, S);
		if (!e || e.kind === "noop") {
			a(!1);
			return;
		}
		if (e.kind === "save") sr(e.name, t), r(`Saved "${e.name}"`, "ok");
		else if (e.kind === "load") {
			let t = cr(e.name);
			if (!t) r(`No view named "${e.name}"`, "warn");
			else {
				for (let [e, r] of Object.entries(t)) n(e, r);
				r(`Loaded "${e.name}"`, "ok");
			}
		} else if (e.kind === "delete") ur(e.name), r(`Deleted "${e.name}"`, "ok");
		else if (e.kind === "set") n(e.key, e.value);
		else if (e.kind === "set_many") for (let [t, r] of e.pairs) n(t, r);
		l((e) => [o, ...e.filter((e) => e !== o)].slice(0, 5)), a(!1);
	}, T = (e) => {
		if (c.length === 0) return;
		let t = Math.max(-1, Math.min(c.length - 1, m + e));
		_(t), s(t === -1 ? "" : c[t]);
	}, ee = (e) => {
		for (let [t, r] of Object.entries(e.ctx)) n(t, r);
		a(!1);
	};
	return /* @__PURE__ */ h("div", {
		className: "mtc-overlay fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4",
		onClick: () => a(!1),
		children: /* @__PURE__ */ g("div", {
			className: "mtc-popover w-full max-w-lg overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ h("input", {
					ref: v,
					type: "text",
					value: o,
					onChange: (e) => s(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" ? (e.preventDefault(), w()) : e.key === "ArrowUp" ? (e.preventDefault(), T(1)) : e.key === "ArrowDown" && (e.preventDefault(), T(-1));
					},
					placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
					className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
				}),
				y.length > 0 && /* @__PURE__ */ h("div", {
					className: "border-b border-zinc-800 max-h-72 overflow-auto",
					children: y.map((e, t) => /* @__PURE__ */ g("button", {
						onClick: () => ee(e),
						className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
						children: [
							/* @__PURE__ */ h("span", {
								className: "text-zinc-100",
								children: e.label
							}),
							e.hint && /* @__PURE__ */ h("span", {
								className: "ml-2 text-[10px] text-zinc-500 font-mono",
								children: e.hint
							}),
							/* @__PURE__ */ h("span", {
								className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100",
								children: Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")
							})
						]
					}, `${e.label}-${t}`))
				}),
				Object.entries(t).length > 0 && /* @__PURE__ */ g("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ h("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "current"
					}), Object.entries(t).map(([e, t]) => /* @__PURE__ */ g("span", {
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono",
						children: [
							e,
							"=",
							t
						]
					}, e))]
				}),
				C.length > 0 && /* @__PURE__ */ g("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ h("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "views"
					}), C.map((e) => /* @__PURE__ */ h("button", {
						onClick: () => s(`/load ${e}`),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-mono",
						title: `Load view "${e}"`,
						children: e
					}, e))]
				}),
				c.length > 0 && /* @__PURE__ */ g("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ h("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "recent"
					}), c.map((e, t) => /* @__PURE__ */ h("button", {
						onClick: () => s(e),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono",
						children: e
					}, t))]
				}),
				/* @__PURE__ */ g("div", {
					className: "px-4 py-2 text-[10px] text-zinc-600 flex justify-between",
					children: [/* @__PURE__ */ h("span", { children: "↵ apply  ·  ↑↓ recall" }), /* @__PURE__ */ h("span", { children: "esc close" })]
				})
			]
		})
	});
}
//#endregion
//#region src/core/ShortcutsOverlay.tsx
var gr = [
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
function _r(e) {
	return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")}`;
}
function vr({ templateShortcuts: e }) {
	let [t, n] = p(!1);
	return u(() => {
		let e = (e) => {
			let t = e.target?.tagName, r = t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable;
			e.key === "?" && !r ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ h("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ g("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ g("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ h("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ h("span", {
					className: "text-[10px] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ g("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [gr.map((e, t) => /* @__PURE__ */ g("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ h("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ h("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ g("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ h("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ h("span", {
						className: "text-xs text-zinc-400",
						children: _r(e)
					})]
				}, `tpl-${t}`))] })]
			})]
		})
	}) : null;
}
//#endregion
//#region src/core/Toaster.tsx
var yr = {
	ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
	warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
	error: "border-red-500/40     bg-red-500/10     text-red-200",
	info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, br = 3500;
function xr({ toasts: e, dismiss: t }) {
	return e.length === 0 ? null : /* @__PURE__ */ h("div", {
		className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none",
		children: e.map((e) => /* @__PURE__ */ h(Sr, {
			toast: e,
			dismiss: t
		}, e.id))
	});
}
function Sr({ toast: e, dismiss: t }) {
	return u(() => {
		let n = setTimeout(() => t(e.id), br);
		return () => clearTimeout(n);
	}, [e.id, t]), /* @__PURE__ */ h("div", {
		onClick: () => t(e.id),
		className: `mtc-popover pointer-events-auto cursor-pointer text-xs px-3 py-2 border ${yr[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
		children: e.message
	});
}
//#endregion
//#region src/core/validateTemplate.ts
var Cr = /* @__PURE__ */ new Set(/* @__PURE__ */ "timeseries.candlestick.table.metric.text.conversation.prompt.gauge.distribution.heatmap.events.catalog.asset_catalog.object_view.code_browser.record_grid.record_board.record_calendar.record_form.action_form.orderbook.depth_chart.paired_grid.trade.ticker.volume_profile.stat_strip.bar_chart.scatter.clock.treemap.image.iframe.histogram.section.area_chart.slider.select.boxplot.radar.dag.geo_map.media_gallery.multi_select.json.sparkline.action_log.alert_log.tape.file_browser".split("."));
function wr(e, t, n = {}) {
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
	let a = n.includeBuiltIns === !1 ? new Set(t ?? []) : t ? /* @__PURE__ */ new Set([...Cr, ...t]) : Cr;
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
		}) : a.has(e.component) || r.push({
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
			i(e.options.basemap, e.options.style_url);
		} catch (t) {
			let i = e.options.basemap == null ? "style_url" : "basemap";
			r.push({
				path: `${n}.options.${i}`,
				severity: "error",
				message: t instanceof Error ? t.message : "invalid basemap configuration"
			});
		}
		e.alert && ((typeof e.alert.when != "string" || !je(e.alert.when)) && r.push({
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
var Tr = "", Er = [
	"authorization",
	"cookie",
	"proxy-authorization",
	"set-cookie",
	"x-api-key",
	"x-auth-token",
	"x-csrf-token",
	"x-xsrf-token"
], Dr = [
	"allow-downloads",
	"allow-popups-to-escape-sandbox",
	"allow-top-navigation",
	"allow-top-navigation-by-user-activation"
], $ = {
	allowRelativeUrls: !0,
	allowedUrlOrigins: [],
	allowedBasemapPresets: [],
	disallowedHeaders: Er,
	minRefreshIntervalMs: 1e3,
	iframeSandbox: {
		disallowedTokens: Dr,
		allowScriptsWithSameOrigin: !1
	}
}, Or = [
	"url",
	"upload_url",
	"search_url",
	"ingest_url",
	"download_url",
	"media_url_template",
	"style_url"
];
function kr(e, t = $) {
	let n = [], r = Ar(t);
	return !e || typeof e != "object" || !Array.isArray(e.widgets) ? [{
		path: "widgets",
		severity: "error",
		message: "template.widgets must be an array"
	}] : (e.widgets.forEach((e, t) => {
		if (!e || typeof e != "object") return;
		let i = `widgets[${t}]`;
		e.source && Nr(e.source, `${i}.source`, r, n), Pr(e, i, r, n), e.component === "iframe" && Ir(e, i, r, n), e.component === "image" && Lr(e, i, r, n), e.component === "media_gallery" && Rr(e, i, r, n);
	}), n);
}
function Ar(e) {
	let t = $.iframeSandbox;
	return {
		allowedUrlOrigins: jr(e.allowedUrlOrigins ?? $.allowedUrlOrigins),
		allowedIframeOrigins: jr(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
		allowRelativeUrls: e.allowRelativeUrls ?? $.allowRelativeUrls,
		allowedBasemapPresets: new Set(e.allowedBasemapPresets ?? $.allowedBasemapPresets),
		allowedHeaders: e.allowedHeaders ? Mr(e.allowedHeaders) : void 0,
		disallowedHeaders: Mr(e.disallowedHeaders ?? $.disallowedHeaders),
		minRefreshIntervalMs: e.minRefreshIntervalMs ?? $.minRefreshIntervalMs,
		maxRefreshIntervalMs: e.maxRefreshIntervalMs,
		iframeSandbox: {
			requiredTokens: [...t.requiredTokens ?? [], ...e.iframeSandbox?.requiredTokens ?? []],
			disallowedTokens: [...t.disallowedTokens ?? [], ...e.iframeSandbox?.disallowedTokens ?? []],
			allowScriptsWithSameOrigin: e.iframeSandbox?.allowScriptsWithSameOrigin ?? t.allowScriptsWithSameOrigin ?? !1
		}
	};
}
function jr(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) try {
		t.add(new URL(n).origin);
	} catch {}
	return t;
}
function Mr(e) {
	return new Set(e.map((e) => e.trim().toLowerCase()).filter(Boolean));
}
function Nr(e, t, n, r) {
	typeof e.url == "string" && Ur(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Vr(e.headers, `${t}.headers`, n, r), Hr(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Pr(e, t, n, r) {
	let i = e.options;
	if (!(!i || typeof i != "object")) {
		for (let a of Or) {
			if (e.component === "iframe" && a === "url") continue;
			let o = i[a];
			typeof o != "string" || o === "" || Ur(o, `${t}.options.${a}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		}
		e.component === "geo_map" && i.basemap != null && Fr(i.basemap, `${t}.options.basemap`, n, r);
	}
}
function Fr(e, t, n, r) {
	let a;
	try {
		a = i(e);
	} catch {
		return;
	}
	if (a.preset) {
		a.preset !== "analytical" && !n.allowedBasemapPresets.has(a.preset) && r.push({
			path: t,
			severity: "error",
			message: `basemap preset ${JSON.stringify(a.preset)} is not allowed by host policy`
		});
		return;
	}
	if (a.kind === "style") {
		Ur(a.style_url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
		return;
	}
	a.kind === "raster" && a.tiles.forEach((e, i) => {
		Ur(e, `${t}.tiles[${i}]`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
	});
}
function Ir(e, t, n, r) {
	let { url: i, sandbox: a } = zr(e);
	i && Ur(i, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), Wr(a, `${t}.iframe.sandbox`, n, r);
}
function Lr(e, t, n, r) {
	let i = Br(e.source), a = typeof i == "string" ? i : i && typeof i == "object" && typeof i.url == "string" ? i.url : void 0;
	a && Ur(a, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
}
function Rr(e, t, n, r) {
	let i = Br(e.source);
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
			typeof o == "string" && o && Ur(o, `${t}.media.items[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
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
			typeof o == "string" && o && Ur(o, `${t}.media.collections[${i}].${e}`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
		}
	});
}
function zr(e) {
	let t = e.options, n = Br(e.source), r, i = "";
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
function Br(e) {
	return e?.inline ?? e?.data;
}
function Vr(e, t, n, r) {
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
function Hr(e, t, n, r) {
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
function Ur(e, t, n, r, i) {
	let a = e.trim();
	if (!a) {
		i.push({
			path: t,
			severity: "error",
			message: "URL must be non-empty"
		});
		return;
	}
	if (Gr(a)) {
		if (Kr(a)) {
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
	if (qr(a).includes("${")) {
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
function Wr(e, t, n, r) {
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
function Gr(e) {
	return !e.startsWith("//") && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function Kr(e) {
	let t = e.indexOf("${");
	if (t === -1) return !1;
	let n = e.slice(0, t);
	return !/[/?#]/.test(n) || /^\/+$/.test(n);
}
function qr(e) {
	if (e.startsWith("//")) {
		let t = e.slice(2).search(/[/?#]/);
		return t === -1 ? e : e.slice(0, t + 2);
	}
	let t = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/);
	return t ? t[0] : "";
}
//#endregion
//#region src/core/snapshot.ts
function Jr(e, t) {
	return e.id || `__mt_idx_${t}`;
}
function Yr(e) {
	let t = e?.widgets;
	return !Array.isArray(t) || t.length === 0 ? !1 : t.every((e) => {
		let t = e.source;
		if (!t) return !0;
		let n = t.inline !== void 0 || t.data !== void 0, r = !!(t.source_id || t.url);
		return n || !r;
	});
}
function Xr(e, t, n, r, i) {
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
var Zr = {
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
}, Qr = [
	"1d",
	"5d",
	"1m",
	"3m",
	"1y",
	"max"
], $r = 200, ei = 200;
function ti({ value: e, onChange: t }) {
	return /* @__PURE__ */ h("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: Qr.map((n) => /* @__PURE__ */ h("button", {
			onClick: () => t(n),
			className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${e.toLowerCase() === n ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
			children: n
		}, n))
	});
}
var ni = [
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
function ri({ value: e, onChange: t }) {
	return /* @__PURE__ */ h("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: ni.map((n) => /* @__PURE__ */ h("button", {
			onClick: () => t(n.ms),
			className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${e === n.ms ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
			title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
			children: n.label
		}, n.label))
	});
}
function ii() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ g("button", {
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
function ai(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}
function oi(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function si() {
	let { recentActions: e, widgetHealth: t } = B(), n = De(!0), r = e[0], i = Object.values(t), a = i.filter((e) => e.streaming), o = a.filter((e) => e.connected && !e.error).length, s = i.filter((e) => e.error).length, c = i.filter((e) => e.stale).length, l = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ g("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ h("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ g("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ h("span", {
							className: "tabular-nums w-7 shrink-0",
							children: oi(n, r.receivedAt)
						}),
						/* @__PURE__ */ h("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ h("span", {
							className: `uppercase tracking-wider shrink-0 ${l}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ h("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ h("span", {
					className: "text-zinc-500",
					children: "idle"
				})
			}),
			a.length > 0 && /* @__PURE__ */ g("span", {
				className: o === a.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${o} of ${a.length} streams connected`,
				children: [
					/* @__PURE__ */ g("span", {
						className: "tabular-nums",
						children: [
							o,
							"/",
							a.length
						]
					}),
					" ",
					/* @__PURE__ */ h("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			c > 0 && /* @__PURE__ */ g("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${c} widget(s) without recent updates`,
				children: [c, " stale"]
			}),
			s > 0 && /* @__PURE__ */ g("span", {
				className: "text-red-400 tabular-nums",
				children: [s, " err"]
			}),
			/* @__PURE__ */ h("span", {
				className: "tabular-nums text-zinc-300",
				children: ai(n)
			})
		]
	});
}
function ci({ health: e }) {
	let t = Object.values(e);
	if (t.length === 0) return null;
	let n = t.filter((e) => e.streaming), r = n.filter((e) => e.connected && !e.error).length, i = t.filter((e) => e.error);
	if (n.length === 0 && i.length === 0) return null;
	let a = i.map((e) => e.title).join("\n");
	return /* @__PURE__ */ g("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider",
		children: [n.length > 0 && /* @__PURE__ */ g("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ g("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ h("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ g("span", {
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
function li({ onClick: e }) {
	return /* @__PURE__ */ h("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function ui({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ g("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function di({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ h("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to comfortable density" : "Switch to compact density",
		children: e ? "Cozy" : "Compact"
	});
}
function fi({ onCopied: e }) {
	return /* @__PURE__ */ h("button", {
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
function pi({ onClick: e, busy: t }) {
	return /* @__PURE__ */ h("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function mi({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ g("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ h("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ g("span", {
				className: "text-zinc-600 normal-case tracking-normal",
				children: ["· ", n]
			}) : null
		]
	});
}
function hi(e) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
	let t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
var gi = {};
function _i({ template: e, backendUrl: t, backendHeaders: n = gi, onEvent: i, onIntent: a, onCtxChange: o, paletteSuggest: s, chrome: l = "full", onShare: _, theme: y = "dark", templateTrust: b = "untrusted", templateTrustPolicy: x = $, resolveAssetIntent: S, assetRenderers: C, assetApplicationFrame: w, saveAssetOpenPreference: T, onAssetOpenError: ee, registry: E }) {
	let D = v(), O = e.columns || 12, [k, te] = p(e.widgets), A = d(() => wr(e, E?.keys(), { includeBuiltIns: E == null }), [
		e,
		E,
		E ? [...E.keys()].sort().join("\0") : ""
	]), j = d(() => b === "trusted" ? [] : kr(e, x), [
		e,
		b,
		x
	]), M = d(() => [...A, ...j], [A, j]), N = d(() => M.some((e) => e.severity === "error"), [M]), P = d(() => j.some((e) => e.severity === "error"), [j]), F = d(() => !!e.frozenAt || Yr(e), [e]), [ne, re] = p(!1), [I, ie] = p(() => {
		let t = e.context?.values ?? {};
		return typeof window > "u" ? t : {
			...t,
			...ir(window.location.search)
		};
	}), [ae, oe] = p(null), [se, L] = p(!1), [ce, le] = p(!1), [ue, de] = p(!1);
	u(() => {
		oe(Si("refreshIntervalMs", null)), L(Si("compact", !1)), le(Si("soundEnabled", !1)), de(!0);
	}, []), u(() => {
		ue && Ci("refreshIntervalMs", ae);
	}, [ue, ae]), u(() => {
		ue && Ci("compact", se);
	}, [ue, se]), u(() => {
		ue && Ci("soundEnabled", ce);
	}, [ue, ce]);
	let [R, fe] = p(null), [z, B] = p(null), [me, he] = p(null), [ge, _e] = p([]), [ve, ye] = p(!1), be = f(0), xe = f(!1), Se = c((e) => {
		he((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), Ce = f(i);
	u(() => {
		Ce.current = i;
	}, [i]);
	let Te = f(a);
	u(() => {
		Te.current = a;
	}, [a]);
	let Ee = c((e) => {
		Te.current?.(e);
	}, []), [De, ke] = p([]), Ae = c(() => ke([]), []), [je, Me] = p([]), Ne = c(() => Me([]), []), [Pe, Fe] = p({}), Ie = c((e, t) => {
		Fe((n) => {
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
	}, []), Le = f(/* @__PURE__ */ new Map()), Re = c((e, t) => (Le.current.set(e, t), () => {
		Le.current.get(e) === t && Le.current.delete(e);
	}), []), ze = f({
		widgets: k,
		ctx: I,
		template: e
	});
	ze.current = {
		widgets: k,
		ctx: I,
		template: e
	};
	let Be = c(() => {
		let { widgets: e, ctx: t, template: n } = ze.current;
		return Xr(n, e, t, (e, t) => {
			let n = Le.current.get(Jr(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), Ve = c((e) => {
		Ce.current?.(e), e.type === "action" ? ke((t) => [{
			receivedAt: Date.now(),
			actionId: e.actionId,
			clientRequestId: e.clientRequestId,
			status: e.status,
			message: e.message,
			terminal: e.terminal
		}, ...t].slice(0, $r)) : e.type === "alert" && Me((t) => [{
			receivedAt: Date.now(),
			widgetId: e.widgetId,
			severity: e.severity,
			message: e.message,
			predicate: e.predicate
		}, ...t].slice(0, ei));
	}, []), V = c((e, t = "info") => {
		be.current += 1;
		let n = be.current;
		_e((r) => [...r, {
			id: n,
			message: e,
			severity: t
		}]);
	}, []), He = c(async () => {
		if (!xe.current) {
			xe.current = !0, ye(!0);
			try {
				let e = Be();
				_ ? await _(e) : hi(e), V(_ ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				V(`Snapshot failed: ${t}`, "error");
			} finally {
				xe.current = !1, ye(!1);
			}
		}
	}, [
		_,
		Be,
		V
	]), H = c((e) => {
		_e((t) => t.filter((t) => t.id !== e));
	}, []), U = c((e, t) => {
		ie((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	u(() => {
		if (typeof window > "u") return;
		let e = ar(window.location.search, I), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [I]);
	let Ue = f(o);
	u(() => {
		Ue.current = o;
	}, [o]), u(() => {
		Ue.current?.(I);
	}, [I]);
	let We = c((e, t) => {
		te((n) => nr(n, e, t));
	}, []), W = (e) => D === "mobile" ? O : D === "tablet" ? Math.min(e, Math.floor(O / 2)) : Math.min(e, O), Ge = d(() => ({
		dispatch: We,
		ctx: I,
		setCtx: U,
		backendUrl: t,
		backendHeaders: n,
		widgets: k,
		refreshIntervalMs: ae ?? void 0,
		toast: V,
		compact: se,
		fullscreenId: R,
		setFullscreenId: fe,
		focusedId: z,
		setFocusedId: B,
		refreshPulse: me,
		requestRefresh: Se,
		emit: Ve,
		emitIntent: Ee,
		recentActions: De,
		clearRecentActions: Ae,
		recentAlerts: je,
		clearRecentAlerts: Ne,
		soundEnabled: ce,
		widgetHealth: Pe,
		reportWidgetHealth: Ie,
		registerWidgetData: Re,
		snapshot: Be
	}), [
		We,
		I,
		U,
		t,
		n,
		k,
		ae,
		V,
		se,
		R,
		z,
		me,
		Se,
		Ve,
		Ee,
		De,
		Ae,
		je,
		Ne,
		ce,
		Pe,
		Ie,
		Re,
		Be
	]), Ke = c((e, t) => {
		V(`Could not ${t.intent} ${t.asset.name}: ${e.message}`, "error"), ee?.(e, t);
	}, [ee, V]);
	u(() => {
		if (!R) return;
		let e = (e) => {
			e.key === "Escape" && fe(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [R]), u(() => {
		!z || typeof document > "u" || document.getElementById(`mt-widget-${z}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [z]), u(() => {
		let t = (t) => {
			if (t.metaKey || t.ctrlKey || t.altKey) return;
			let n = t.target?.tagName;
			if (n === "INPUT" || n === "TEXTAREA" || t.target?.isContentEditable) return;
			let r = e.shortcuts?.find((e) => e.key === t.key);
			if (r) {
				t.preventDefault();
				for (let [e, t] of Object.entries(r.ctx)) U(e, t);
				return;
			}
			let i = k.map((e) => e.id).filter((e) => !!e);
			if (i.length === 0) return;
			let a = (e) => {
				let t = z ? i.indexOf(z) : -1, n = i[(t + e + i.length) % i.length];
				B(n);
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
					z && (t.preventDefault(), fe(z));
					break;
				case "r":
					z && (t.preventDefault(), Se(z));
					break;
				case "Escape":
					z && B(null);
					break;
			}
		};
		return document.addEventListener("keydown", t), () => document.removeEventListener("keydown", t);
	}, [
		k,
		z,
		Se,
		e.shortcuts,
		U
	]);
	let qe = !P && R ? k.find((e) => e.id === R) : null;
	return /* @__PURE__ */ h(pe.Provider, {
		value: Ge,
		children: /* @__PURE__ */ h("div", {
			className: `mtc-root mtc-theme-${y}`,
			"data-theme": y,
			"data-density": se ? "compact" : "comfortable",
			children: /* @__PURE__ */ h(r, {
				resolveAssetIntent: S,
				renderers: C,
				applicationFrame: w,
				savePreference: T,
				onError: Ke,
				children: /* @__PURE__ */ h(Oe, { children: /* @__PURE__ */ g(tr, { children: [
					/* @__PURE__ */ h(hr, { suggest: s }),
					/* @__PURE__ */ h(vr, { templateShortcuts: e.shortcuts }),
					/* @__PURE__ */ h(xr, {
						toasts: ge,
						dismiss: H
					}),
					M.length > 0 && (!ne || N) && /* @__PURE__ */ h(vi, {
						issues: M,
						dismissible: !N,
						onDismiss: () => re(!0)
					}),
					/* @__PURE__ */ g("div", {
						className: "mtc-workspace min-h-full flex flex-col",
						children: [/* @__PURE__ */ g("div", {
							className: "flex-1",
							children: [(e.title || l === "full") && /* @__PURE__ */ g("div", {
								className: "mtc-toolbar",
								children: [/* @__PURE__ */ g("div", {
									className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
									children: [e.title && /* @__PURE__ */ h("h1", {
										className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
										children: we(e.title, I)
									}), l === "full" && /* @__PURE__ */ g("div", {
										className: "ml-auto flex items-center gap-2 flex-wrap",
										children: [
											F ? /* @__PURE__ */ h(mi, { frozenAt: e.frozenAt }) : /* @__PURE__ */ g(m, { children: [
												/* @__PURE__ */ h(ci, { health: Pe }),
												/* @__PURE__ */ h(ri, {
													value: ae,
													onChange: oe
												}),
												/* @__PURE__ */ h(li, { onClick: () => Se("*") })
											] }),
											/* @__PURE__ */ h(ui, {
												enabled: ce,
												onToggle: () => le((e) => !e)
											}),
											/* @__PURE__ */ h(di, {
												compact: se,
												onToggle: () => L((e) => !e)
											}),
											!F && /* @__PURE__ */ h(pi, {
												onClick: () => void He(),
												busy: ve
											}),
											/* @__PURE__ */ h(fi, { onCopied: () => V("URL copied", "ok") }),
											/* @__PURE__ */ h(ii, {})
										]
									})]
								}), l === "full" && Object.keys(I).length > 0 && /* @__PURE__ */ g("div", {
									className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ h("span", {
										className: "text-[9px] uppercase tracking-[0.14em] text-zinc-500 mr-1",
										children: "Context"
									}), Object.entries(I).map(([e, t]) => e === "range" ? /* @__PURE__ */ h(ti, {
										value: t,
										onChange: (t) => U(e, t)
									}, e) : /* @__PURE__ */ g("div", {
										className: "mtc-context-chip px-2 py-1 text-[11px]",
										children: [/* @__PURE__ */ h("span", {
											className: "text-zinc-500 uppercase tracking-wider mr-1",
											children: e
										}), /* @__PURE__ */ h("span", {
											className: "text-zinc-100 font-mono",
											children: t
										})]
									}, e))]
								})]
							}), /* @__PURE__ */ h("div", {
								className: "p-3 md:p-5",
								children: /* @__PURE__ */ h("div", {
									className: "grid gap-3 md:gap-4 items-start",
									style: { gridTemplateColumns: `repeat(${O}, 1fr)` },
									children: P ? /* @__PURE__ */ h(yi, { issues: j }) : k.map((e, t) => /* @__PURE__ */ h("div", {
										id: e.id ? `mt-widget-${e.id}` : void 0,
										style: { gridColumn: `span ${W(e.span || 6)}` },
										children: /* @__PURE__ */ h(Qn, {
											config: e,
											contentHeight: e.height || Zr[e.component] || 280,
											snapshotKey: Jr(e, t),
											registry: E
										})
									}, e.id || t))
								})
							})]
						}), l === "full" && /* @__PURE__ */ h(si, {})]
					}),
					qe && /* @__PURE__ */ h(bi, {
						widget: qe,
						registry: E,
						onClose: () => fe(null)
					})
				] }) })
			})
		})
	});
}
function vi({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ g("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ g("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ g("div", {
				className: "font-medium uppercase tracking-wider text-[10px] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ g("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ g("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ h("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ h("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ h("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ g("li", {
					className: "opacity-60 text-[10px]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ h("button", {
			onClick: n,
			className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function yi({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ g("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ h("div", {
				className: "font-medium text-xs uppercase tracking-wider mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ h("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ g("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ g("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ h("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ h("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ h("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ g("li", {
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
function bi({ widget: e, registry: t, onClose: n }) {
	let r = typeof window < "u" ? Math.floor(window.innerHeight * .82) : 600;
	return /* @__PURE__ */ g("div", {
		className: "fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: n,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Fullscreen ${e.title ?? e.id ?? e.component}`,
		children: [/* @__PURE__ */ g("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ h("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ h("button", {
				onClick: n,
				autoFocus: !0,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ h("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ h(Qn, {
				config: e,
				contentHeight: r,
				registry: t
			})
		})]
	});
}
var xi = "medallion-terminal:";
function Si(e, t) {
	if (typeof window > "u" || !window.localStorage) return t;
	try {
		let n = window.localStorage.getItem(xi + e);
		return n == null ? t : JSON.parse(n);
	} catch {
		return t;
	}
}
function Ci(e, t) {
	if (!(typeof window > "u" || !window.localStorage)) try {
		window.localStorage.setItem(xi + e, JSON.stringify(t));
	} catch {}
}
//#endregion
//#region src/core/MultiDashboard.tsx
function wi(e, t) {
	u(() => {
		let n = (n) => {
			if (!(n.metaKey || n.ctrlKey)) return;
			let r = Number(n.key);
			Number.isFinite(r) && r >= 1 && r <= 9 && r <= e && (n.preventDefault(), t(r - 1));
		};
		return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
	}, [e, t]);
}
function Ti({ tabs: e, activeIndex: t, onSelect: n, backendUrl: r, backendHeaders: i, theme: a = "dark", templateTrust: o, templateTrustPolicy: s, resolveAssetIntent: c, assetRenderers: l, assetApplicationFrame: d, saveAssetOpenPreference: f, onAssetOpenError: m, onIntent: _, registry: v }) {
	let y = Math.max(0, Math.min(t, e.length - 1));
	wi(e.length, n);
	let [b, x] = p(() => /* @__PURE__ */ new Set([y]));
	return u(() => {
		x((e) => e.has(y) ? e : /* @__PURE__ */ new Set([...e, y]));
	}, [y]), e.length === 0 ? null : /* @__PURE__ */ h("div", {
		className: `mtc-root mtc-theme-${a}`,
		"data-theme": a,
		children: /* @__PURE__ */ g("div", {
			className: "mtc-workspace min-h-full",
			children: [/* @__PURE__ */ h(Ei, {
				tabs: e,
				activeIndex: y,
				onSelect: n
			}), e.map((e, t) => /* @__PURE__ */ h("div", {
				style: { display: t === y ? "block" : "none" },
				children: b.has(t) && /* @__PURE__ */ h(_i, {
					template: e.template,
					backendUrl: r,
					backendHeaders: i,
					theme: a,
					templateTrust: o,
					templateTrustPolicy: s,
					resolveAssetIntent: c,
					assetRenderers: l,
					assetApplicationFrame: d,
					saveAssetOpenPreference: f,
					onAssetOpenError: m,
					onIntent: _,
					registry: v
				})
			}, t))]
		})
	});
}
function Ei({ tabs: e, activeIndex: t, onSelect: n }) {
	let r = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ h("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ g("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ h("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ h("span", {
					className: "text-[9px] text-zinc-500 font-mono uppercase tracking-wider",
					children: o
				})]
			}, i);
		})
	});
}
function Di(e = 0) {
	let [t, n] = p(() => {
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
export { Pt as $, Kn as A, B as At, Nn as B, y as Bt, $n as C, he as Ct, Jn as D, xe as Dt, Qn as E, we as Et, Un as F, se as Ft, Kt as G, an as H, v as Ht, Rn as I, N as It, Rt as J, Ut as K, zn as L, M as Lt, Fn as M, de as Mt, Pn as N, fe as Nt, qn as O, Te as Ot, Ln as P, z as Pt, Ot as Q, Bn as R, A as Rt, nr as S, ge as St, er as T, ve as Tt, Wt as U, on as V, x as Vt, Gt as W, It as X, Lt as Y, Nt as Z, lr as _, Ee as _t, Yr as a, lt as at, ir as b, ye as bt, Dr as c, yt as ct, kr as d, Ke as dt, bt as et, Cr as f, Je as ft, ur as g, Ae as gt, hr as h, je as ht, Xr as i, ut as it, In as j, le as jt, Gn as k, pe as kt, Er as l, pt as lt, vr as m, Xe as mt, Di as n, xt as nt, Jr as o, vt as ot, wr as p, qe as pt, Ft as q, _i as r, dt as rt, Tr as s, ht as st, Ti as t, ft as tt, $ as u, mt as ut, cr as v, Oe as vt, tr as w, _e as wt, ar as x, be as xt, sr as y, De as yt, Hn as z, S as zt };
