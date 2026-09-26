import { T as e, d as t, l as n, n as r, o as i, s as a, t as o, u as s, w as c } from "./sourceError-BjoiCId1.js";
import { c as l, t as u } from "./AssetOpen-CjGLA-3L.js";
import { o as d } from "./basemaps-BjEaZSH5.js";
import { Suspense as f, createContext as p, lazy as m, useCallback as h, useContext as g, useEffect as _, useMemo as v, useRef as y, useState as b } from "react";
import { Fragment as x, jsx as S, jsxs as C } from "react/jsx-runtime";
//#region src/hooks/useBreakpoint.ts
function w() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function T() {
	let [e, t] = b(w);
	return _(() => {
		let e = () => t(w());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), e;
}
//#endregion
//#region src/core/connectFraming.ts
var ee = "application/connect+json", E = new TextDecoder();
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
					e.length > 0 && (a = JSON.parse(E.decode(e)));
				} catch {}
				t.isDisposed() || t.onTrailer?.(a);
				return;
			}
			let a = n.subarray(r + 5, r + 5 + i);
			r += 5 + i;
			try {
				let e = JSON.parse(E.decode(a));
				t.isDisposed() || t.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
//#region src/core/getNested.ts
function D(e, t) {
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
function O(e) {
	return e.refreshIntervalMs ?? e.refreshInterval;
}
function k(e) {
	return e instanceof Error ? e.name === "AbortError" || /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function re(e) {
	e.signal.aborted || e.abort();
}
var A = 3e4, ie = 1e3;
function ae(e, t) {
	return t ? D(e, t) : e;
}
var j = /* @__PURE__ */ new Set([
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
function M(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = Object.keys(e);
	return t.length === 1 && j.has(t[0]) ? e[t[0]] : e;
}
function N(e) {
	let [t, s] = b(null), [c, l] = b(!0), [u, d] = b(null), [f, p] = b(null), [m, g] = b(!1), [x, S] = b(null), [C, w] = b(0), T = h(() => w((e) => e + 1), []), E = y(ie), D = y(void 0), j = y(null), N = y(void 0), oe = y(0), P = h((t) => {
		let n = ae(M(t), e?.transform);
		s(n), d(null), l(!1), p(Date.now()), oe.current = Date.now();
	}, [e?.transform]), F = h((t) => {
		let n = e?.throttleMs ?? 0;
		if (n <= 0) {
			P(t);
			return;
		}
		let r = Date.now() - oe.current;
		if (r >= n) {
			P(t);
			return;
		}
		j.current = t, N.current ||= setTimeout(() => {
			j.current !== null && P(j.current), j.current = null, N.current = void 0;
		}, n - r);
	}, [P, e?.throttleMs]), se = v(() => e ? JSON.stringify([
		e.url,
		e.source_id,
		e.method,
		e.body,
		e.headers,
		e.stream,
		O(e),
		e.transform,
		e.throttleMs,
		e.inline !== void 0 || e.data !== void 0
	]) : "", [e]), ce = e ? ne(e) : void 0;
	return _(() => {
		if (!e) {
			l(!1);
			return;
		}
		if (ce !== void 0) {
			F(ce);
			return;
		}
		if (!e.url) {
			l(!1);
			return;
		}
		if (e.stream === "connect") {
			let t = !1, r = new AbortController(), s = async () => {
				if (!t) try {
					let n = await fetch(e.url, {
						method: "POST",
						headers: {
							...e.headers,
							"Content-Type": ee
						},
						body: JSON.stringify(e.body ?? {}),
						signal: r.signal
					});
					if (!n.ok) throw await i(n);
					if (!n.body) throw new o("Stream response has no body", { kind: "unavailable" });
					g(!0), S(null), d(null), E.current = ie;
					let s = n.body.getReader();
					await te(s, {
						onMessage: F,
						onTrailer: (e) => {
							if (e.error) {
								let n = e.error.code ?? "unknown", r = e.error.message ?? "stream error";
								t || d(new o(r, {
									kind: a(n),
									code: n
								}));
							}
						},
						isDisposed: () => t
					}), s.releaseLock();
				} catch (e) {
					!t && e instanceof Error && !k(e) && d(n(e));
				} finally {
					if (!t) {
						g(!1);
						let e = E.current;
						S(Date.now() + e), D.current = setTimeout(() => {
							E.current = Math.min(E.current * 2, A), s();
						}, e);
					}
				}
			};
			return s(), () => {
				t = !0, re(r), clearTimeout(D.current), g(!1), S(null);
			};
		}
		if (e.stream === !0) {
			let t = null, n = !1, r = () => {
				n || (t = new EventSource(e.url), t.onopen = () => {
					g(!0), S(null), d(null), E.current = ie;
				}, t.onmessage = (e) => {
					try {
						F(JSON.parse(e.data));
					} catch {
						d(new o("Failed to parse stream", { kind: "unknown" }));
					}
				}, t.onerror = () => {
					if (t?.close(), g(!1), !n) {
						let e = E.current;
						S(Date.now() + e), D.current = setTimeout(() => {
							E.current = Math.min(E.current * 2, A), r();
						}, e);
					}
				});
			};
			return r(), () => {
				n = !0, clearTimeout(D.current), t?.close(), g(!1), S(null);
			};
		}
		let t = !1, r = !1, s = new AbortController(), c = async () => {
			if (!(t || r)) {
				r = !0;
				try {
					let n = await fetch(e.url, {
						method: e.method || "GET",
						headers: e.headers,
						body: e.body ? JSON.stringify(e.body) : void 0,
						signal: s.signal
					});
					if (!n.ok) throw await i(n);
					let r = await n.json();
					t || F(r);
				} catch (e) {
					!t && e instanceof Error && !k(e) && d(n(e));
				} finally {
					r = !1, t || l(!1);
				}
			}
		};
		c();
		let u, f = O(e);
		return f && f > 0 && (u = setInterval(() => void c(), f)), () => {
			t = !0, re(s), u && clearInterval(u);
		};
	}, [
		se,
		F,
		ce,
		C
	]), _(() => () => {
		N.current && clearTimeout(N.current);
	}, []), {
		data: t,
		loading: c,
		error: v(() => u ? r(u) : null, [u]),
		sourceError: u,
		lastUpdated: f,
		connected: m,
		nextRetryAt: x,
		refresh: T
	};
}
//#endregion
//#region src/widgets/states.tsx
var oe = {
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
function P({ component: e }) {
	switch (e ? oe[e] : "block") {
		case "chart": return /* @__PURE__ */ S(ce, {});
		case "table": return /* @__PURE__ */ S(I, {});
		case "list": return /* @__PURE__ */ S(le, {});
		case "single": return /* @__PURE__ */ S(ue, {});
		case "donut": return /* @__PURE__ */ S(de, {});
		case "grid": return /* @__PURE__ */ S(fe, {});
		default: return /* @__PURE__ */ S(pe, {});
	}
}
function F({ children: e, padded: t }) {
	return /* @__PURE__ */ S(s, {
		title: e,
		compact: !0,
		icon: /* @__PURE__ */ S("span", {
			className: "text-xs uppercase tracking-[0.2em] leading-none",
			children: "·  ·  ·"
		}),
		className: `h-full${t ? " px-4" : ""}`
	});
}
var se = [
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
function ce() {
	return /* @__PURE__ */ S("div", {
		className: "h-full flex items-end gap-1",
		children: se.map((e, t) => /* @__PURE__ */ S("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${e}%`,
				animationDelay: `${t * 40}ms`
			}
		}, t))
	});
}
function I() {
	let e = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ C("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ S("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: e.map((e, t) => /* @__PURE__ */ S("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: e }
			}, t))
		}), Array.from({ length: 5 }).map((t, n) => /* @__PURE__ */ S("div", {
			className: "flex gap-4",
			children: e.map((e, t) => /* @__PURE__ */ S("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: e,
					animationDelay: `${(n * 3 + t) * 50}ms`
				}
			}, t))
		}, n))]
	});
}
function le() {
	return /* @__PURE__ */ S("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ C("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ S("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ C("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ S("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + t * 11 % 30}%`,
						animationDelay: `${t * 80}ms`
					}
				}), /* @__PURE__ */ S("div", {
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
function ue() {
	return /* @__PURE__ */ C("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ S("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ S("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function de() {
	return /* @__PURE__ */ C("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ S("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ S("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ S("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ S("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ C("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ S("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ S("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${t * 60}ms` }
				})]
			}, t))
		})]
	});
}
function fe() {
	return /* @__PURE__ */ S("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((e, t) => /* @__PURE__ */ S("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${t * 25}ms` }
		}, t))
	});
}
function pe() {
	return /* @__PURE__ */ S("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
//#region src/widgets/Placeholder.tsx
function me(e) {
	return /* @__PURE__ */ S(F, { children: "Unknown widget type" });
}
//#endregion
//#region src/core/WidgetRegistry.ts
var L = (e, t) => m(() => e().then((e) => ({ default: e[t] }))), R = /* @__PURE__ */ new Map([
	["timeseries", L(() => import("./Timeseries-CBBn_k7c.js").then((e) => e.n), "Timeseries")],
	["candlestick", L(() => import("./Candlestick-DQXa5g0n.js").then((e) => e.n), "Candlestick")],
	["table", L(() => import("./DataTable-Bt4RWL8s.js").then((e) => e.n), "DataTable")],
	["metric", L(() => import("./Metric-CsN3_xvB.js").then((e) => e.n), "Metric")],
	["text", L(() => import("./Text-C6iVbA9c.js").then((e) => e.n), "Text")],
	["conversation", L(() => import("./ConversationImpl-bMzQjsHH.js"), "ConversationImpl")],
	["prompt", L(() => import("./Prompt-S4EiVxMV.js").then((e) => e.n), "Prompt")],
	["gauge", L(() => import("./Gauge-CX4vcPsM.js").then((e) => e.n), "Gauge")],
	["distribution", L(() => import("./Distribution-BE_IPErT.js").then((e) => e.n), "Distribution")],
	["heatmap", L(() => import("./Heatmap-Dhlo4ZRA.js").then((e) => e.n), "Heatmap")],
	["events", L(() => import("./Events-d9JS6WbD.js").then((e) => e.n), "Events")],
	["catalog", L(() => import("./Catalog-DPgbC9va.js").then((e) => e.n), "Catalog")],
	["asset_catalog", L(() => import("./AssetCatalog-Dxoh5IV6.js").then((e) => e.n), "AssetCatalog")],
	["object_view", L(() => import("./ObjectView-DMy4bBQi.js").then((e) => e.n), "ObjectView")],
	["code_browser", L(() => import("./CodeBrowser-CFjKoh_T.js").then((e) => e.n), "CodeBrowser")],
	["record_grid", L(() => import("./RecordGrid-C3a9BRk2.js").then((e) => e.n), "RecordGrid")],
	["record_board", L(() => import("./RecordBoard-B0FKi5qP.js").then((e) => e.n), "RecordBoard")],
	["record_calendar", L(() => import("./RecordCalendar-vZdtfsBN.js").then((e) => e.n), "RecordCalendar")],
	["record_form", L(() => import("./RecordForm-ChqqVh_S.js").then((e) => e.n), "RecordForm")],
	["action_form", L(() => import("./ActionForm-DN1X4VCg.js").then((e) => e.n), "ActionForm")],
	["orderbook", L(() => import("./OrderBook-BCi0M4bB.js").then((e) => e.n), "OrderBook")],
	["depth_chart", L(() => import("./DepthChart-DAWAGsYJ.js").then((e) => e.n), "DepthChart")],
	["paired_grid", L(() => import("./PairedGrid-D7WjdVxS.js").then((e) => e.n), "PairedGrid")],
	["trade", L(() => import("./Trade-BrpFjG8j.js").then((e) => e.n), "Trade")],
	["ticker", L(() => import("./Ticker-eZ4ei1m0.js").then((e) => e.n), "Ticker")],
	["volume_profile", L(() => import("./VolumeProfile-BnJQyXqj.js").then((e) => e.n), "VolumeProfile")],
	["stat_strip", L(() => import("./StatStrip-Cmuz6U-E.js").then((e) => e.n), "StatStrip")],
	["bar_chart", L(() => import("./BarChart-Bt_at-K9.js").then((e) => e.n), "BarChart")],
	["scatter", L(() => import("./Scatter-Bk3arKcu.js").then((e) => e.n), "Scatter")],
	["clock", L(() => import("./Clock-Cc9ABoWJ.js").then((e) => e.n), "Clock")],
	["treemap", L(() => import("./Treemap-Od7Cfd3Z.js").then((e) => e.n), "Treemap")],
	["image", L(() => import("./Image-F4NO-h1Z.js").then((e) => e.n), "Image")],
	["iframe", L(() => import("./Iframe-C7DLDEh6.js").then((e) => e.n), "Iframe")],
	["histogram", L(() => import("./Histogram-DPyMCgX5.js").then((e) => e.n), "Histogram")],
	["section", L(() => import("./Section-Cpjr_7EV.js").then((e) => e.n), "Section")],
	["area_chart", L(() => import("./AreaChart-wPefxkPF.js").then((e) => e.n), "AreaChart")],
	["slider", L(() => import("./Slider-Sgw1qnLi.js").then((e) => e.n), "Slider")],
	["select", L(() => import("./Select-BKXWm5XP.js").then((e) => e.n), "Select")],
	["boxplot", L(() => import("./Boxplot-fj79mXP3.js").then((e) => e.n), "Boxplot")],
	["radar", L(() => import("./Radar-B01wfCjq.js").then((e) => e.n), "Radar")],
	["dag", L(() => import("./Dag-KVPSAwt1.js").then((e) => e.n), "Dag")],
	["geo_map", L(() => import("./GeoMap-CXcmh8VA.js").then((e) => e.n), "GeoMap")],
	["media_gallery", L(() => import("./MediaGalleryImpl-BTKkniXG.js"), "MediaGalleryImpl")],
	["multi_select", L(() => import("./MultiSelect-vTfxmWIu.js").then((e) => e.n), "MultiSelect")],
	["json", L(() => import("./Json-D__pL-pS.js").then((e) => e.n), "Json")],
	["sparkline", L(() => import("./Sparkline-BtGALYDQ.js").then((e) => e.n), "Sparkline")],
	["action_log", L(() => import("./ActionLog-XI-kdkq4.js").then((e) => e.n), "ActionLog")],
	["alert_log", L(() => import("./AlertLog-UUjiMV90.js").then((e) => e.n), "AlertLog")],
	["tape", L(() => import("./Tape-B0Hy07gI.js").then((e) => e.n), "Tape")],
	["file_browser", L(() => import("./FileBrowser-BV0YogZH.js").then((e) => e.n), "FileBrowser")]
]), he = new Set(R.keys()), ge = class {
	#e;
	constructor(e = {}) {
		this.#e = e.includeBuiltIns === !1 ? /* @__PURE__ */ new Map() : new Map(R);
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
function _e(e = {}) {
	return new ge(e);
}
var z = new Map(R);
function ve(e, t) {
	return (t ? t.get(e) : z.get(e)) || me;
}
function ye(e, t) {
	z.set(e, t);
}
var be = p({
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
function xe() {
	return g(be);
}
//#endregion
//#region src/core/resolveSource.ts
var Se = "medallion.terminal.v1.TerminalService";
function Ce(e) {
	return `${e.replace(/\/$/, "")}/${Se}/Generate`;
}
function we(e, t, n) {
	return {
		prompt: e,
		context: { values: t },
		current_widgets: n
	};
}
function Te(e) {
	return `${e.replace(/\/$/, "")}/${Se}/SubmitAction`;
}
function Ee(e) {
	return `${e.replace(/\/$/, "")}/${Se}/WatchAction`;
}
function De(e) {
	return {
		action_id: e.actionId,
		params: e.params,
		client_request_id: e.clientRequestId
	};
}
function Oe(e) {
	return {
		action_id: e.actionId ?? "",
		id: e.id ?? "",
		client_request_id: e.clientRequestId ?? ""
	};
}
function ke() {
	return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
var Ae = !1, je = class extends Error {
	key;
	constructor(e) {
		super(`Missing context key: \${ctx.${e}}`), this.key = e, this.name = "InterpolationError";
	}
};
function Me(e, t, n) {
	return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (e, r) => {
		if (r in t) return t[r];
		if (n?.strict) throw new je(r);
		return "";
	});
}
function Ne(e, t, n, r = {}) {
	if (e.source_id) {
		if (n === void 0) return Ae ||= (console.warn(`[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`), !0), e;
		let i = e.stream ? "Stream" : "Get", a = n.replace(/\/$/, ""), o = {};
		if (e.params) for (let [n, r] of Object.entries(e.params)) o[n] = Me(r, t, { strict: !0 });
		return {
			url: `${a}/${Se}/${i}`,
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
		let n = Me(e.url, t, { strict: !0 });
		if (e.params && Object.keys(e.params).length > 0) {
			let r = Object.entries(e.params).map(([e, n]) => `${encodeURIComponent(e)}=${encodeURIComponent(Me(n, t, { strict: !0 }))}`).join("&");
			n = n.includes("?") ? `${n}&${r}` : `${n}?${r}`;
		}
		i.url = n;
	}
	return i;
}
//#endregion
//#region src/core/NowContext.tsx
var Pe = p({
	now: 0,
	subscribe: () => () => {}
});
function Fe(e = !0) {
	let { now: t, subscribe: n } = g(Pe);
	return _(() => {
		if (e) return n();
	}, [e, n]), t;
}
function Ie({ children: e }) {
	let [t, n] = b(() => Date.now()), r = y(0), i = y(null), a = v(() => ({
		now: t,
		subscribe: () => (r.current += 1, i.current ??= setInterval(() => n(Date.now()), 1e3), () => {
			r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
		})
	}), [t]);
	return _(() => () => {
		i.current != null && clearInterval(i.current);
	}, []), /* @__PURE__ */ S(Pe.Provider, {
		value: a,
		children: e
	});
}
//#endregion
//#region src/core/alerts.ts
var Le = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Re(e, t) {
	let n = Be(t);
	return n ? We(n, e) : !1;
}
function ze(e) {
	return Be(e) !== null;
}
function Be(e) {
	let t = e.trim();
	if (!t) return null;
	let n = Ve(t, "||"), r = [];
	for (let e of n) {
		let t = Ve(e, "&&"), n = [];
		for (let e of t) {
			let t = He(e);
			if (!t) return null;
			n.push(t);
		}
		if (n.length === 0) return null;
		r.push(n);
	}
	return r.length === 0 ? null : r;
}
function Ve(e, t) {
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
function He(e) {
	let t = e.trim().match(Le);
	if (!t) return null;
	let [, n, r, i] = t;
	return {
		path: n.trim(),
		op: r,
		rhs: Ue(i.trim())
	};
}
function Ue(e) {
	if (e === "true") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e.length >= 2 && e.startsWith("\"") && e.endsWith("\"")) return e.slice(1, -1);
	let t = Number(e);
	return Number.isNaN(t) ? e : t;
}
function We(e, t) {
	for (let n of e) {
		let e = !0;
		for (let r of n) if (!Ge(D(t, r.path), r.op, r.rhs)) {
			e = !1;
			break;
		}
		if (e) return !0;
	}
	return !1;
}
function Ge(e, t, n) {
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
var Ke = {
	warn: 720,
	error: 480
}, qe = 160, B = .08, Je = null;
function Ye() {
	if (typeof window > "u") return null;
	if (Je) return Je;
	let e = window, t = window.AudioContext || e.webkitAudioContext;
	return t ? (Je = new t(), Je) : null;
}
function Xe(e) {
	let t = Ke[e];
	if (!t) return;
	let n = Ye();
	if (!n) return;
	n.state === "suspended" && n.resume().catch(() => {});
	let r = n.createOscillator(), i = n.createGain();
	r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
	let a = n.currentTime;
	i.gain.linearRampToValueAtTime(B, a + .02), i.gain.linearRampToValueAtTime(0, a + qe / 1e3), r.start(a), r.stop(a + qe / 1e3 + .05);
}
//#endregion
//#region src/widgets/platformShapes.ts
function V(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function H(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function Ze(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function Qe(e) {
	return V(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function U(e) {
	return V(e) ? e : {};
}
function $e(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function et(e) {
	let t = Array.isArray(e) ? { items: e } : U(e);
	return {
		items: (Array.isArray(t.items) ? t.items : []).filter(V).map((e) => ({
			id: String(e.id ?? ""),
			name: String(e.name ?? e.id ?? ""),
			kind: String(e.kind ?? "asset"),
			description: H(e.description),
			owner: H(e.owner),
			status: H(e.status),
			updatedAt: H(e.updatedAt ?? e.updated_at),
			tags: Ze(e.tags),
			url: H(e.url),
			metadata: U(e.metadata),
			context: Qe(e.context)
		})).filter((e) => e.id && e.name),
		total: $e(t.total),
		nextPageToken: H(t.nextPageToken ?? t.next_page_token)
	};
}
function tt(e) {
	let t = U(e), n = String(t.objectType ?? t.object_type ?? ""), r = String(t.objectId ?? t.object_id ?? ""), i = String(t.title ?? t.name ?? r);
	if (!n && !r && !i) return null;
	let a = (Array.isArray(t.properties) ? t.properties : []).filter(V).map((e) => ({
		key: String(e.key ?? ""),
		label: String(e.label ?? e.key ?? ""),
		value: e.value,
		format: H(e.format),
		description: H(e.description),
		group: H(e.group)
	})).filter((e) => e.key), o = (Array.isArray(t.links) ? t.links : []).filter(V).map((e) => ({
		relation: String(e.relation ?? ""),
		targetType: String(e.targetType ?? e.target_type ?? ""),
		targetId: String(e.targetId ?? e.target_id ?? ""),
		label: String(e.label ?? e.targetId ?? e.target_id ?? ""),
		status: H(e.status),
		context: Qe(e.context)
	})).filter((e) => e.targetId), s = (Array.isArray(t.actions) ? t.actions : []).filter(V).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		description: H(e.description),
		style: H(e.style),
		confirm: e.confirm === !0,
		params: U(e.params),
		disabled: e.disabled === !0
	})).filter((e) => e.id);
	return {
		objectType: n,
		objectId: r,
		title: i,
		description: H(t.description),
		status: H(t.status),
		updatedAt: H(t.updatedAt ?? t.updated_at),
		tags: Ze(t.tags),
		properties: a,
		links: o,
		actions: s
	};
}
function nt(e) {
	let t = U(e);
	if (!Array.isArray(t.nodes)) return null;
	let n = t.nodes.filter(V).map((e) => ({
		id: String(e.id ?? ""),
		label: String(e.label ?? e.id ?? ""),
		kind: H(e.kind),
		status: H(e.status),
		subtitle: H(e.subtitle),
		tags: Ze(e.tags),
		metadata: U(e.metadata),
		context: Qe(e.context)
	})).filter((e) => e.id), r = (Array.isArray(t.edges) ? t.edges : []).filter(V).map((e) => ({
		from: String(e.from ?? ""),
		to: String(e.to ?? ""),
		label: H(e.label),
		kind: H(e.kind),
		status: H(e.status)
	})).filter((e) => e.from && e.to);
	return n.length > 0 ? {
		nodes: n,
		edges: r
	} : null;
}
function rt(e) {
	let t = String(e ?? "").toUpperCase();
	return t === "2" || t === "DIRECTORY" || t === "DIR" || t === "REPOSITORY_ENTRY_KIND_DIRECTORY" ? "directory" : t === "3" || t === "SYMLINK" || t === "REPOSITORY_ENTRY_KIND_SYMLINK" ? "symlink" : "file";
}
function it(e) {
	let t = U(e), n = String(t.repository ?? t.name ?? "");
	if (!n && !Array.isArray(t.entries) && !V(t.file)) return null;
	let r = (Array.isArray(t.entries) ? t.entries : []).filter(V).map((e) => ({
		path: String(e.path ?? e.name ?? ""),
		name: String(e.name ?? String(e.path ?? "").split("/").pop() ?? ""),
		kind: rt(e.kind),
		language: H(e.language),
		sizeBytes: $e(e.sizeBytes ?? e.size_bytes),
		updatedAt: H(e.updatedAt ?? e.updated_at)
	})).filter((e) => e.path && e.name), i = V(t.file) ? t.file : null, a = i ? {
		path: String(i.path ?? t.path ?? ""),
		content: String(i.content ?? ""),
		language: H(i.language),
		sizeBytes: $e(i.sizeBytes ?? i.size_bytes),
		truncated: i.truncated === !0,
		url: H(i.url)
	} : void 0;
	return {
		repository: n,
		ref: String(t.ref ?? ""),
		path: String(t.path ?? ""),
		refs: Ze(t.refs),
		entries: r,
		file: a,
		url: H(t.url)
	};
}
//#endregion
//#region src/widgets/recordShapes.ts
function W(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function at(e) {
	return W(e) ? e : {};
}
function G(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function ot(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function st(e) {
	return W(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function ct(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
var lt = {
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
}, ut = {
	1: "grid",
	2: "board",
	3: "calendar",
	4: "gallery",
	5: "list",
	6: "timeline",
	7: "form"
};
function dt(e, t) {
	return String(e ?? "").replace(t, "").toLowerCase();
}
function ft(e) {
	let t = lt[String(e)];
	if (t) return t;
	let n = dt(e, "RECORD_FIELD_TYPE_");
	return Object.values(lt).includes(n) ? n : "text";
}
function pt(e) {
	let t = ut[String(e)];
	if (t) return t;
	let n = dt(e, "RECORD_VIEW_TYPE_");
	return Object.values(ut).includes(n) ? n : "grid";
}
function mt(e) {
	return typeof e == "boolean" ? "boolean" : typeof e == "number" ? "number" : Array.isArray(e) ? "multi_select" : "text";
}
function ht(e) {
	return e === "formula" || e === "lookup" || e === "rollup" || e === "created_at" || e === "updated_at";
}
function gt(e, t) {
	let n = (Array.isArray(e.fields) ? e.fields : []).filter(W).map((e) => {
		let t = ft(e.type), n = (Array.isArray(e.choices) ? e.choices : []).filter(W).map((e) => ({
			value: String(e.value ?? ""),
			label: String(e.label ?? e.value ?? ""),
			color: G(e.color)
		})).filter((e) => e.value);
		return {
			key: String(e.key ?? ""),
			label: String(e.label ?? e.key ?? ""),
			type: t,
			description: G(e.description),
			required: e.required === !0,
			readOnly: e.readOnly === !0 || e.read_only === !0 || ht(t),
			choices: n,
			linkedTableId: G(e.linkedTableId ?? e.linked_table_id),
			allowMultiple: e.allowMultiple === !0 || e.allow_multiple === !0,
			format: G(e.format),
			defaultValue: e.defaultValue ?? e.default_value
		};
	}).filter((e) => e.key);
	return n.length > 0 ? n : [...new Set(t.flatMap((e) => Object.keys(e.values)))].map((e) => {
		let n = t.find((t) => t.values[e] != null)?.values[e];
		return {
			key: e,
			label: e,
			type: mt(n),
			required: !1,
			readOnly: !1,
			choices: [],
			allowMultiple: Array.isArray(n)
		};
	});
}
function _t(e) {
	let t = at(e), n = (Array.isArray(t.records) ? t.records : Array.isArray(t.rows) ? t.rows : []).filter(W).map((e, t) => {
		let n = W(e.values) ? e.values : Object.fromEntries(Object.entries(e).filter(([e]) => ![
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
			createdAt: G(e.createdAt ?? e.created_at),
			updatedAt: G(e.updatedAt ?? e.updated_at),
			revision: G(e.revision),
			context: st(e.context)
		};
	}).filter((e) => e.id), r = gt(t, n), i = (Array.isArray(t.views) ? t.views : []).filter(W).map((e) => ({
		id: String(e.id ?? ""),
		name: String(e.name ?? e.id ?? ""),
		type: pt(e.type),
		visibleFields: ot(e.visibleFields ?? e.visible_fields),
		groupBy: G(e.groupBy ?? e.group_by),
		dateField: G(e.dateField ?? e.date_field),
		titleField: G(e.titleField ?? e.title_field),
		sorts: (Array.isArray(e.sorts) ? e.sorts : []).filter(W).map((e) => ({
			field: String(e.field ?? ""),
			descending: e.descending === !0
		})).filter((e) => e.field),
		filters: (Array.isArray(e.filters) ? e.filters : []).filter(W).map((e) => ({
			field: String(e.field ?? ""),
			operator: String(e.operator ?? "eq").toLowerCase(),
			value: e.value
		})).filter((e) => e.field)
	})).filter((e) => e.id), a = at(t.capabilities), o = String(t.tableId ?? t.table_id ?? ""), s = String(t.tableName ?? t.table_name ?? o);
	return !o && !s && r.length === 0 && n.length === 0 ? null : {
		workspaceId: String(t.workspaceId ?? t.workspace_id ?? ""),
		tableId: o,
		tableName: s,
		primaryField: String(t.primaryField ?? t.primary_field ?? r[0]?.key ?? "id"),
		fields: r,
		records: n,
		views: i,
		activeViewId: G(t.activeViewId ?? t.active_view_id),
		total: ct(t.total),
		nextPageToken: G(t.nextPageToken ?? t.next_page_token),
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
function vt(e) {
	return !e.readOnly && e.type !== "attachment";
}
function yt(e, t) {
	return Object.fromEntries(e.map((e) => [e.key, t ? t.values[e.key] : e.defaultValue ?? null]));
}
function bt(e, t, n) {
	let r = e.filter(vt).filter((e) => JSON.stringify(t[e.key]) !== JSON.stringify(n?.values[e.key])).map((e) => [e.key, t[e.key]]);
	return Object.fromEntries(r);
}
function xt(e, t, n = e.primaryField) {
	let r = t.values[n] ?? t.values[e.primaryField];
	return W(r) ? String(r.label ?? r.name ?? r.id ?? t.id) : Array.isArray(r) ? r.map(St).join(", ") || t.id : r == null || r === "" ? t.id : String(r);
}
function St(e) {
	return e == null ? "" : W(e) ? String(e.label ?? e.name ?? e.id ?? "") : Array.isArray(e) ? e.map(St).filter(Boolean).join(", ") : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Ct(e) {
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)) return e;
	let t = e instanceof Date ? e : typeof e == "string" || typeof e == "number" ? new Date(e) : null;
	return !t || Number.isNaN(t.getTime()) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function wt(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function K(e) {
	return W(e) ? e.id ?? e.value ?? e.label ?? e.name ?? "" : e;
}
function Tt(e, t) {
	let n = K(e), r = K(t);
	return typeof n == "number" && typeof r == "number" ? n === r : String(n ?? "").toLowerCase() === String(r ?? "").toLowerCase();
}
function Et(e, t) {
	if (e) return e.choices.find((e) => Tt(e.value, t))?.color;
}
function Dt(e, t) {
	let n = e.values[t.field], r = t.value;
	switch (t.operator) {
		case "empty": return wt(n);
		case "not_empty": return !wt(n);
		case "neq": return !Tt(n, r);
		case "contains": return Array.isArray(n) ? n.some((e) => Tt(e, r)) : St(n).toLowerCase().includes(St(r).toLowerCase());
		case "in": {
			let e = Array.isArray(r) ? r : [r];
			return (Array.isArray(n) ? n : [n]).some((t) => e.some((e) => Tt(t, e)));
		}
		case "gt": return Number(K(n)) > Number(K(r));
		case "gte": return Number(K(n)) >= Number(K(r));
		case "lt": return Number(K(n)) < Number(K(r));
		case "lte": return Number(K(n)) <= Number(K(r));
		default: return Tt(n, r);
	}
}
function Ot(e, t) {
	if (!t) return e;
	let n = t.filters.length > 0 ? e.filter((e) => t.filters.every((t) => Dt(e, t))) : e;
	return t.sorts.length === 0 ? n : n.map((e, t) => ({
		record: e,
		index: t
	})).sort((e, n) => {
		for (let r of t.sorts) {
			let t = K(e.record.values[r.field]), i = K(n.record.values[r.field]);
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
function kt(e, t, n) {
	return e.views.find((e) => e.id === n && e.type === t) ?? e.views.find((n) => n.id === e.activeViewId && n.type === t) ?? e.views.find((e) => e.type === t);
}
//#endregion
//#region src/widgets/mediaShape.ts
function At(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function jt(e) {
	return At(e) ? e : {};
}
function q(e) {
	if (e != null) return String(e).trim() || void 0;
}
function Mt(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim()) {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
function Nt(e) {
	let t = Mt(e);
	return t != null && t >= 0 ? t : void 0;
}
function Pt(e) {
	return Array.isArray(e) ? [...new Set(e.map(String).map((e) => e.trim()).filter(Boolean))] : [];
}
function Ft(e) {
	return At(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function It(e) {
	if (typeof e != "string") return;
	let t = e.trim();
	if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
function Lt(e, t, n) {
	if (e === 2) return "video";
	if (e === 1) return "image";
	let r = String(e ?? "").toLowerCase();
	return r.includes("video") || r === "movie" ? "video" : r.includes("image") || r.includes("photo") ? "image" : t?.toLowerCase().startsWith("video/") || /\.(mp4|m4v|mov|webm|ogv)(?:[?#].*)?$/i.test(n) ? "video" : "image";
}
function Rt(e) {
	let t = e.split(/[?#]/, 1)[0].split("/").filter(Boolean).pop();
	if (!t) return "Untitled media";
	try {
		return decodeURIComponent(t);
	} catch {
		return t;
	}
}
function zt(e) {
	if (!At(e)) return null;
	let t = It(e.url ?? e.mediaUrl ?? e.media_url ?? e.src);
	if (!t) return null;
	let n = q(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type);
	return {
		id: q(e.id ?? e.mediaId ?? e.media_id) ?? t,
		title: q(e.title ?? e.name ?? e.label ?? e.filename) ?? Rt(t),
		kind: Lt(e.kind ?? e.type ?? e.mediaType ?? e.media_type, n, t),
		url: t,
		thumbnailUrl: It(e.thumbnailUrl ?? e.thumbnail_url ?? e.thumbnail ?? e.posterUrl ?? e.poster_url ?? e.poster),
		description: q(e.description ?? e.caption),
		capturedAt: q(e.capturedAt ?? e.captured_at ?? e.takenAt ?? e.taken_at ?? e.dateTaken ?? e.date_taken),
		createdAt: q(e.createdAt ?? e.created_at ?? e.uploadedAt ?? e.uploaded_at),
		contentType: n,
		width: Nt(e.width),
		height: Nt(e.height),
		durationSeconds: Nt(e.durationSeconds ?? e.duration_seconds ?? e.duration),
		favorite: e.favorite === !0 || e.isFavorite === !0 || e.is_favorite === !0,
		tags: Pt(e.tags),
		collectionIds: Pt(e.collectionIds ?? e.collection_ids ?? e.albumIds ?? e.album_ids ?? e.albums),
		metadata: jt(e.metadata),
		context: Ft(e.context)
	};
}
function Bt(e) {
	if (!At(e)) return null;
	let t = q(e.id ?? e.collectionId ?? e.collection_id ?? e.albumId ?? e.album_id);
	return t ? {
		id: t,
		name: q(e.name ?? e.title ?? e.label) ?? Yt(t),
		coverUrl: It(e.coverUrl ?? e.cover_url ?? e.thumbnailUrl ?? e.thumbnail_url),
		itemCount: Nt(e.itemCount ?? e.item_count ?? e.count),
		context: Ft(e.context)
	} : null;
}
function Vt(e) {
	let t = Array.isArray(e) ? { items: e } : jt(e), n = (Array.isArray(t.items) ? t.items : Array.isArray(t.media) ? t.media : Array.isArray(t.assets) ? t.assets : []).map(zt).filter((e) => e !== null), r = (Array.isArray(t.collections) ? t.collections : Array.isArray(t.albums) ? t.albums : []).map(Bt).filter((e) => e !== null), i = new Set(r.map((e) => e.id));
	for (let e of new Set(n.flatMap((e) => e.collectionIds))) i.has(e) || r.push({
		id: e,
		name: Yt(e),
		itemCount: n.filter((t) => t.collectionIds.includes(e)).length,
		context: {}
	});
	return {
		items: Ht(n),
		collections: r,
		total: Nt(t.total),
		nextPageToken: q(t.nextPageToken ?? t.next_page_token)
	};
}
function Ht(e) {
	return [...e].sort((e, t) => {
		let n = qt(t) - qt(e);
		return n === 0 ? e.title.localeCompare(t.title) : n;
	});
}
function Ut(e, t) {
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
function Wt(e, t = "day") {
	let n = Ht(e);
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
		label: Jt(e, t),
		items: n
	}));
}
function Gt(e) {
	if (e == null || !Number.isFinite(e) || e < 0) return;
	let t = Math.round(e), n = Math.floor(t / 3600), r = Math.floor(t % 3600 / 60), i = t % 60;
	return n > 0 ? `${n}:${String(r).padStart(2, "0")}:${String(i).padStart(2, "0")}` : `${r}:${String(i).padStart(2, "0")}`;
}
function Kt(e) {
	if (!e) return;
	let t = new Date(e);
	return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(t);
}
function qt(e) {
	let t = Date.parse(e.capturedAt ?? e.createdAt ?? "");
	return Number.isFinite(t) ? t : -Infinity;
}
function Jt(e, t) {
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
function Yt(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase());
}
//#endregion
//#region src/widgets/geoShape.ts
var Xt = /* @__PURE__ */ new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]);
function Zt(e) {
	let t = J(e), n = t.geo ?? t.geojson ?? e, r = J(n), i;
	if (r.type === "FeatureCollection" && Array.isArray(r.features)) i = r.features;
	else if (r.type === "Feature") i = [r];
	else if (Array.isArray(r.features)) i = r.features;
	else if (Array.isArray(r.points)) i = r.points;
	else if (Array.isArray(r.rows)) i = r.rows;
	else if (Array.isArray(n)) i = n;
	else return null;
	let a = i.map((e, t) => tn(e, t)).filter((e) => e !== null);
	return a.length > 0 ? {
		type: "FeatureCollection",
		features: a
	} : null;
}
function Qt(e) {
	let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity;
	for (let a of e.features) sn(a.geometry.coordinates, (e) => {
		t = Math.min(t, e[0]), r = Math.max(r, e[0]), n = Math.min(n, e[1]), i = Math.max(i, e[1]);
	});
	return [
		t,
		n,
		r,
		i
	].every(Number.isFinite) ? [[t, n], [r, i]] : null;
}
function $t(e) {
	let t = e.properties._mtc_context;
	if (typeof t != "string") return {};
	try {
		let e = JSON.parse(t);
		return !e || typeof e != "object" || Array.isArray(e) ? {} : Object.fromEntries(Object.entries(e).filter((e) => typeof e[1] == "string"));
	} catch {
		return {};
	}
}
function en(e) {
	let t = e.properties._mtc_label;
	return typeof t == "string" && t !== "" ? t : e.id;
}
function tn(e, t) {
	let n = J(e), r = J(n.properties), i = nn(n.geometry) ?? rn(n);
	if (!i) return null;
	let a = String(n.id ?? r.id ?? r.feature_id ?? r.object_id ?? `feature-${t + 1}`), o = fn(n.label, n.name, r.label, r.name, r.title, a), s = fn(n.status, r.status), c = dn(n.value ?? r.value), l = {
		...un(r.context),
		...un(n.context)
	}, u = {
		...J(r.metadata),
		...J(n.metadata)
	};
	return {
		type: "Feature",
		id: a,
		geometry: i,
		properties: {
			...ln(r),
			...ln(u),
			_mtc_id: a,
			_mtc_label: o,
			_mtc_tone: cn(s),
			...s && { _mtc_status: s },
			...c !== void 0 && { _mtc_value: c },
			_mtc_context: JSON.stringify(l)
		}
	};
}
function nn(e) {
	let t = J(e), n = t.type;
	return typeof n != "string" || !Xt.has(n) || !an(n, t.coordinates) ? null : {
		type: n,
		coordinates: t.coordinates
	};
}
function rn(e) {
	let t = dn(e.latitude ?? e.lat), n = dn(e.longitude ?? e.lng ?? e.lon);
	return t === void 0 || n === void 0 || t < -90 || t > 90 || n < -180 || n > 180 ? null : {
		type: "Point",
		coordinates: [n, t]
	};
}
function an(e, t) {
	return on(t, {
		Point: 0,
		MultiPoint: 1,
		LineString: 1,
		MultiLineString: 2,
		Polygon: 2,
		MultiPolygon: 3
	}[e]);
}
function on(e, t) {
	if (t === 0) {
		if (!Array.isArray(e) || e.length < 2) return !1;
		let t = Number(e[0]), n = Number(e[1]);
		return Number.isFinite(t) && Number.isFinite(n) && t >= -180 && t <= 180 && n >= -90 && n <= 90;
	}
	return Array.isArray(e) && e.length > 0 && e.every((e) => on(e, t - 1));
}
function sn(e, t) {
	if (Array.isArray(e)) {
		if (e.length >= 2 && typeof e[0] == "number" && typeof e[1] == "number") {
			t(e);
			return;
		}
		for (let n of e) sn(n, t);
	}
}
function cn(e) {
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
function ln(e) {
	return Object.fromEntries(Object.entries(e).filter((e) => e[1] === null || typeof e[1] == "string" || typeof e[1] == "number" || typeof e[1] == "boolean"));
}
function J(e) {
	return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
function un(e) {
	let t = J(e);
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
function bn(e) {
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
function xn(e) {
	return Z(e) && Array.isArray(e.bars) ? X(e.bars) : null;
}
function Sn(e) {
	if (Array.isArray(e) && e.length > 0 && Z(e[0])) return X(e);
	if (Z(e) && "rows" in e) {
		let t = e, n = Array.isArray(t.columns) ? t.columns : [];
		if (n.length > 0 && Z(n[0])) {
			let e = n.map((e) => e.key);
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, Y(t[n])])) : Cn(t, e))
			};
		}
		if (n.length > 0 && typeof n[0] == "string") {
			let e = n;
			return {
				columns: e,
				rows: t.rows.map((t) => Array.isArray(t) ? Object.fromEntries(e.map((e, n) => [e, Y(t[n])])) : Cn(t, e))
			};
		}
		let r = t.rows;
		return r.length > 0 && Z(r[0]) ? X(r) : yn;
	}
	return null;
}
function Cn(e, t) {
	let n = {};
	for (let r of t) n[r] = Y(e[r]);
	return n;
}
function wn(e) {
	return Z(e) && Array.isArray(e.cells) ? X(e.cells) : null;
}
function Tn(e) {
	return Z(e) && Array.isArray(e.slices) ? X(e.slices) : null;
}
function En(e) {
	return Z(e) && Array.isArray(e.events) ? X(e.events) : null;
}
function Dn(e) {
	return Z(e) && Array.isArray(e.items) ? X(e.items) : null;
}
function On(e) {
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
function kn(e) {
	let t = pn(e);
	return t ? X([...t.bids.map((e) => ({
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
	} : Z(e) && "value" in e && typeof e.value != "object" ? X([e]) : null;
}
function jn(e) {
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
function Mn(e) {
	let t = et(e);
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
function Nn(e) {
	let t = tt(e);
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
function Pn(e) {
	let t = nt(e);
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
function Fn(e) {
	let t = it(e);
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
function In(e) {
	let t = _t(e);
	return t ? X(t.records.map((e) => ({
		id: e.id,
		...e.values,
		created_at: e.createdAt,
		updated_at: e.updatedAt,
		revision: e.revision
	}))) : null;
}
function Ln(e) {
	let t = Zt(e);
	return t ? X(t.features.map((e) => ({
		...Object.fromEntries(Object.entries(e.properties).filter(([e]) => !e.startsWith("_mtc_"))),
		id: e.id,
		label: en(e),
		geometry_type: e.geometry.type,
		geometry: e.geometry,
		status: e.properties._mtc_status,
		value: e.properties._mtc_value,
		context: $t(e)
	}))) : null;
}
function Rn(e) {
	let t = Vt(e);
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
	if (Array.isArray(e)) return e.length === 0 ? yn : Z(e[0]) ? X(e) : {
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
	let { resolution: n, loading: r, error: i, data: a, options: o, component: s, widgetId: c, Component: u, onRenderError: d, onRetry: p } = e;
	return n.error ? /* @__PURE__ */ S(t, { message: n.error }) : r ? /* @__PURE__ */ S(P, { component: s }) : i ? /* @__PURE__ */ S(t, {
		error: i,
		onRetry: p,
		compact: !0
	}) : /* @__PURE__ */ S("div", {
		className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]",
		children: /* @__PURE__ */ S(l, {
			onError: d,
			children: /* @__PURE__ */ S(f, {
				fallback: /* @__PURE__ */ S(P, { component: s }),
				children: /* @__PURE__ */ S(u, {
					data: a,
					options: o,
					widgetId: c
				})
			})
		})
	});
}
function ar({ widget: e, data: t, onRefresh: n, onCopy: r, onToast: i }) {
	let { dispatch: a, fullscreenId: o, setFullscreenId: s } = xe(), [c, l] = b(!1), [u, d] = b(!1), [f, p] = b(!1), m = y(null);
	_(() => {
		if (!c) return;
		let e = (e) => {
			m.current && !m.current.contains(e.target) && (l(!1), d(!1));
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [c]);
	let h = e.source, g = h?.data !== void 0 && !h.url && !h.source_id, v = !!h && !g, x = !!e.id, w = !!e.id && o !== e.id, T = t == null ? 0 : er({
		data: t,
		component: e.component
	}), ee = T > 0, E = async (n) => {
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
	return /* @__PURE__ */ C("div", {
		className: "relative",
		ref: m,
		children: [/* @__PURE__ */ S("button", {
			onClick: () => l((e) => !e),
			className: "text-zinc-600 hover:text-zinc-300 px-1.5 py-0.5 text-base leading-none rounded",
			"aria-label": "Widget actions",
			"aria-expanded": c,
			children: "⋮"
		}), c && /* @__PURE__ */ C("div", {
			className: "mtc-popover absolute right-0 top-full mt-1 py-1 z-20 min-w-[140px]",
			children: [
				v && /* @__PURE__ */ S("button", {
					onClick: () => {
						n(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Refresh"
				}),
				/* @__PURE__ */ S("button", {
					onClick: async () => {
						await r(), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Copy data"
				}),
				ee && /* @__PURE__ */ C("div", { children: [/* @__PURE__ */ C("button", {
					onClick: () => d((e) => !e),
					className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
					"aria-expanded": u,
					children: [/* @__PURE__ */ C("span", { children: ["Export", f ? "…" : ""] }), /* @__PURE__ */ S("span", {
						className: "text-zinc-600",
						children: u ? "▾" : "▸"
					})]
				}), u && /* @__PURE__ */ S("div", {
					className: "bg-zinc-950/60",
					children: Wn.map((e) => /* @__PURE__ */ S("button", {
						onClick: () => E(e.key),
						disabled: f,
						className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
						children: e.label
					}, e.key))
				})] }),
				w && /* @__PURE__ */ S("button", {
					onClick: () => {
						s(e.id), l(!1);
					},
					className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
					children: "Fullscreen"
				}),
				x && /* @__PURE__ */ S("button", {
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
	let { ctx: i, backendUrl: a, backendHeaders: o, refreshIntervalMs: s, compact: c, toast: l, focusedId: u, setFocusedId: d, refreshPulse: f, emit: p, soundEnabled: m, reportWidgetHealth: h, registerWidgetData: g } = xe(), b = v(() => e.title ? Me(e.title, i) : e.title, [e.title, i]), x = v(() => {
		if (!e.source) return {
			source: void 0,
			error: null
		};
		try {
			let t = Ne(e.source, i, a, o);
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
	]), w = x.source, { data: T, loading: ee, error: E, sourceError: te, lastUpdated: D, connected: ne, nextRetryAt: O, refresh: k } = N(w), re = ve(e.component, r), A = y(T);
	A.current = T, _(() => {
		if (n) return g(n, () => A.current);
	}, [n, g]);
	let ie = !!w?.stream || !!(w?.refreshIntervalMs ?? w?.refreshInterval), ae = w?.staleAfterMs, j = Fe(ie && D != null || O != null || !!ae && D != null), M = !!ae && D != null && j - D > ae, oe = y(0);
	_(() => {
		if (!f) return;
		let t = e.refresh_policy ?? "global";
		if (t === "manual") return;
		let n = f.id === "*";
		n && t === "self" || (n || f.id === e.id) && f.n > oe.current && (oe.current = f.n, k());
	}, [
		f,
		e.id,
		e.refresh_policy,
		k
	]);
	let P = y(!1);
	_(() => {
		let t = e.alert;
		if (!t || T == null) {
			P.current = !1;
			return;
		}
		let n = Re(T, t.when);
		if (n && !P.current) {
			let n = Me(t.message, i), r = t.severity ?? "warn";
			l(n, r), p({
				type: "alert",
				widgetId: e.id,
				severity: r,
				message: n,
				predicate: t.when
			}), m && Xe(r);
		}
		P.current = n;
	}, [
		T,
		e.alert,
		i,
		l,
		p,
		e.id,
		m
	]);
	let F = y(null);
	_(() => {
		let t = x.error ?? E, n = x.error ? "resolve" : "data";
		t && t !== F.current ? (p({
			type: "widget_error",
			widgetId: e.id,
			component: e.component,
			message: t,
			source: n
		}), F.current = t) : t || (F.current = null);
	}, [
		x.error,
		E,
		p,
		e.id,
		e.component
	]), _(() => {
		if (!e.id) return;
		let t = !!w?.stream;
		return h(e.id, {
			title: b || e.title || e.component,
			streaming: t,
			connected: !t || ne,
			error: x.error ?? E,
			stale: M
		}), () => h(e.id, null);
	}, [
		e.id,
		b,
		e.title,
		e.component,
		w?.stream,
		ne,
		x.error,
		E,
		M,
		h
	]);
	let se = !!e.id && u === e.id, ce = e.id ? () => d(e.id) : void 0;
	return /* @__PURE__ */ C("div", {
		onClick: ce,
		className: "mtc-widget overflow-hidden",
		"data-focused": se ? "true" : "false",
		children: [b && /* @__PURE__ */ C("div", {
			className: `mtc-widget-header ${c ? "px-2 py-1" : "px-3 py-1.5"} flex items-center justify-between`,
			children: [/* @__PURE__ */ S("h2", {
				className: `${c ? "text-[length:var(--mtc-font-size-md)]" : "text-[length:var(--mtc-font-size-lg)]"} font-semibold text-zinc-100 truncate`,
				children: b
			}), /* @__PURE__ */ C("div", {
				className: "flex items-center gap-2 shrink-0 ml-2",
				children: [
					ie && D && /* @__PURE__ */ C("span", {
						className: `text-[11px] ${M ? "text-amber-400/80" : "text-zinc-600"}`,
						children: [M ? "stale · " : "", rr(j, D)]
					}),
					e.source?.stream && !ne && O != null && /* @__PURE__ */ C("span", {
						className: "text-[11px] text-amber-400/80 tabular-nums",
						title: "Reconnecting",
						children: [
							"retry ",
							Math.max(0, Math.ceil((O - j) / 1e3)),
							"s"
						]
					}),
					e.source?.stream && /* @__PURE__ */ S("span", {
						className: `w-2 h-2 rounded-full shrink-0 ${ne ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
						title: ne ? "Connected" : O ? "Reconnecting" : "Disconnected"
					}),
					/* @__PURE__ */ S(ar, {
						widget: e,
						data: T,
						onToast: l,
						onRefresh: k,
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
		}), /* @__PURE__ */ S("div", {
			className: c ? "p-2.5" : "p-4",
			style: { height: c ? Math.round(t * .92) : t },
			children: ir({
				resolution: x,
				loading: ee,
				error: te,
				data: T,
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
				onRetry: w && w.inline === void 0 && w.data === void 0 ? k : void 0
			})
		})]
	});
}
//#endregion
//#region src/core/HoverContext.tsx
var sr = p({
	hoverTime: null,
	setHoverTime: () => {}
});
function cr() {
	return g(sr);
}
function lr({ children: e }) {
	let [t, n] = b(null), r = v(() => ({
		hoverTime: t,
		setHoverTime: n
	}), [t]);
	return /* @__PURE__ */ S(sr.Provider, {
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
	let { ctx: t, setCtx: n, toast: r } = xe(), [i, a] = b(!1), [o, s] = b(""), [c, l] = b([]), [u, d] = b(-1), f = y(null), [p, m] = b([]), h = y(0);
	_(() => {
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" ? (e.preventDefault(), a((e) => !e)) : e.key === "Escape" && a(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), _(() => {
		i ? f.current?.focus() : (s(""), d(-1), m([]));
	}, [i]), _(() => {
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
	let g = v(() => Object.keys(t)[0] ?? "symbol", [t]), x = v(() => i ? _r() : [], [i, c]);
	if (!i) return null;
	let w = () => {
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
	}, ee = (e) => {
		for (let [t, r] of Object.entries(e.ctx)) n(t, r);
		a(!1);
	};
	return /* @__PURE__ */ S("div", {
		className: "mtc-overlay fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4",
		onClick: () => a(!1),
		children: /* @__PURE__ */ C("div", {
			className: "mtc-popover w-full max-w-lg overflow-hidden",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ S("input", {
					ref: f,
					type: "text",
					value: o,
					onChange: (e) => s(e.target.value),
					onKeyDown: (e) => {
						e.key === "Enter" ? (e.preventDefault(), w()) : e.key === "ArrowUp" ? (e.preventDefault(), T(1)) : e.key === "ArrowDown" && (e.preventDefault(), T(-1));
					},
					placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
					className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
				}),
				p.length > 0 && /* @__PURE__ */ S("div", {
					className: "border-b border-zinc-800 max-h-72 overflow-auto",
					children: p.map((e, t) => /* @__PURE__ */ C("button", {
						onClick: () => ee(e),
						className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
						children: [
							/* @__PURE__ */ S("span", {
								className: "text-zinc-100",
								children: e.label
							}),
							e.hint && /* @__PURE__ */ S("span", {
								className: "ml-2 text-[10px] text-zinc-500 font-mono",
								children: e.hint
							}),
							/* @__PURE__ */ S("span", {
								className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100",
								children: Object.entries(e.ctx).map(([e, t]) => `${e}=${t}`).join(" · ")
							})
						]
					}, `${e.label}-${t}`))
				}),
				Object.entries(t).length > 0 && /* @__PURE__ */ C("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ S("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "current"
					}), Object.entries(t).map(([e, t]) => /* @__PURE__ */ C("span", {
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono",
						children: [
							e,
							"=",
							t
						]
					}, e))]
				}),
				x.length > 0 && /* @__PURE__ */ C("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ S("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "views"
					}), x.map((e) => /* @__PURE__ */ S("button", {
						onClick: () => s(`/load ${e}`),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-mono",
						title: `Load view "${e}"`,
						children: e
					}, e))]
				}),
				c.length > 0 && /* @__PURE__ */ C("div", {
					className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap",
					children: [/* @__PURE__ */ S("span", {
						className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center",
						children: "recent"
					}), c.map((e, t) => /* @__PURE__ */ S("button", {
						onClick: () => s(e),
						className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono",
						children: e
					}, t))]
				}),
				/* @__PURE__ */ C("div", {
					className: "px-4 py-2 text-[10px] text-zinc-600 flex justify-between",
					children: [/* @__PURE__ */ S("span", { children: "↵ apply  ·  ↑↓ recall" }), /* @__PURE__ */ S("span", { children: "esc close" })]
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
	let [t, n] = b(!1);
	return _(() => {
		let e = (e) => {
			let t = e.target?.tagName, r = t === "INPUT" || t === "TEXTAREA" || e.target?.isContentEditable;
			e.key === "?" && !r ? (e.preventDefault(), n((e) => !e)) : e.key === "Escape" && n(!1);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, []), t ? /* @__PURE__ */ S("div", {
		className: "mtc-overlay fixed inset-0 z-40 flex items-center justify-center px-4",
		onClick: () => n(!1),
		children: /* @__PURE__ */ C("div", {
			className: "mtc-popover w-full max-w-md overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ C("div", {
				className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ S("h3", {
					className: "text-sm font-medium text-zinc-100",
					children: "Keyboard shortcuts"
				}), /* @__PURE__ */ S("span", {
					className: "text-[10px] text-zinc-500",
					children: "esc to close"
				})]
			}), /* @__PURE__ */ C("div", {
				className: "px-4 py-3 flex flex-col gap-1.5",
				children: [wr.map((e, t) => /* @__PURE__ */ C("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ S("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.keys
					}), /* @__PURE__ */ S("span", {
						className: "text-xs text-zinc-400",
						children: e.description
					})]
				}, t)), e && e.length > 0 && /* @__PURE__ */ C(x, { children: [/* @__PURE__ */ S("div", {
					className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1",
					children: "Dashboard shortcuts"
				}), e.map((e, t) => /* @__PURE__ */ C("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ S("kbd", {
						className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0",
						children: e.key
					}), /* @__PURE__ */ S("span", {
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
	return e.length === 0 ? null : /* @__PURE__ */ S("div", {
		className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none",
		children: e.map((e) => /* @__PURE__ */ S(Ar, {
			toast: e,
			dismiss: t
		}, e.id))
	});
}
function Ar({ toast: e, dismiss: t }) {
	return _(() => {
		let n = setTimeout(() => t(e.id), Or);
		return () => clearTimeout(n);
	}, [e.id, t]), /* @__PURE__ */ S("div", {
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
			d(e.options.basemap, e.options.style_url);
		} catch (t) {
			let i = e.options.basemap == null ? "style_url" : "basemap";
			r.push({
				path: `${n}.options.${i}`,
				severity: "error",
				message: t instanceof Error ? t.message : "invalid basemap configuration"
			});
		}
		e.alert && ((typeof e.alert.when != "string" || !ze(e.alert.when)) && r.push({
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
		i = d(e);
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
], oi = 200, si = 200;
function ci({ value: e, onChange: t }) {
	return /* @__PURE__ */ S("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: ai.map((n) => {
			let r = e.toLowerCase() === n;
			return /* @__PURE__ */ S("button", {
				onClick: () => t(n),
				className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				children: n
			}, n);
		})
	});
}
var li = [
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
function ui({ value: e, onChange: t }) {
	return /* @__PURE__ */ S("div", {
		className: "mtc-segmented flex p-0.5 gap-0.5",
		children: li.map((n) => {
			let r = e === n.ms;
			return /* @__PURE__ */ S("button", {
				onClick: () => t(n.ms),
				className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-sky-500/20 text-sky-200" : "text-zinc-400 hover:text-zinc-200"}`,
				title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
				children: n.label
			}, n.label);
		})
	});
}
function di() {
	let e = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ C("button", {
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
function fi(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
}
function pi(e, t) {
	let n = Math.floor((e - t) / 1e3);
	if (n < 5) return "now";
	if (n < 60) return `${n}s`;
	let r = Math.floor(n / 60);
	return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function mi() {
	let { recentActions: e, widgetHealth: t } = xe(), n = Fe(!0), r = e[0], i = Object.values(t), a = i.filter((e) => e.streaming), o = a.filter((e) => e.connected && !e.error).length, s = i.filter((e) => e.error).length, c = i.filter((e) => e.stale).length, l = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
	return /* @__PURE__ */ C("div", {
		className: "mtc-statusbar px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0",
		children: [
			/* @__PURE__ */ S("div", {
				className: "flex-1 min-w-0 truncate",
				children: r ? /* @__PURE__ */ C("span", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ S("span", {
							className: "tabular-nums w-7 shrink-0",
							children: pi(n, r.receivedAt)
						}),
						/* @__PURE__ */ S("span", {
							className: "text-zinc-300 shrink-0",
							children: r.actionId
						}),
						/* @__PURE__ */ S("span", {
							className: `uppercase tracking-wider shrink-0 ${l}`,
							children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase()
						}),
						r.message && /* @__PURE__ */ S("span", {
							className: "truncate text-zinc-400",
							children: r.message
						})
					]
				}) : /* @__PURE__ */ S("span", {
					className: "text-zinc-500",
					children: "idle"
				})
			}),
			a.length > 0 && /* @__PURE__ */ C("span", {
				className: o === a.length ? "text-emerald-400/80" : "text-amber-400/80",
				title: `${o} of ${a.length} streams connected`,
				children: [
					/* @__PURE__ */ C("span", {
						className: "tabular-nums",
						children: [
							o,
							"/",
							a.length
						]
					}),
					" ",
					/* @__PURE__ */ S("span", {
						className: "opacity-60",
						children: "↑"
					})
				]
			}),
			c > 0 && /* @__PURE__ */ C("span", {
				className: "text-amber-400/80 tabular-nums",
				title: `${c} widget(s) without recent updates`,
				children: [c, " stale"]
			}),
			s > 0 && /* @__PURE__ */ C("span", {
				className: "text-red-400 tabular-nums",
				children: [s, " err"]
			}),
			/* @__PURE__ */ S("span", {
				className: "tabular-nums text-zinc-300",
				children: fi(n)
			})
		]
	});
}
function hi({ health: e }) {
	let t = Object.values(e);
	if (t.length === 0) return null;
	let n = t.filter((e) => e.streaming), r = n.filter((e) => e.connected && !e.error).length, i = t.filter((e) => e.error);
	if (n.length === 0 && i.length === 0) return null;
	let a = i.map((e) => e.title).join("\n");
	return /* @__PURE__ */ C("div", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider",
		children: [n.length > 0 && /* @__PURE__ */ C("span", {
			className: r === n.length ? "text-emerald-400" : "text-amber-400",
			title: `${r} of ${n.length} streams connected`,
			children: [/* @__PURE__ */ C("span", {
				className: "tabular-nums",
				children: [
					r,
					"/",
					n.length
				]
			}), /* @__PURE__ */ S("span", {
				className: "ml-0.5",
				children: "↑"
			})]
		}), i.length > 0 && /* @__PURE__ */ C("span", {
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
function gi({ onClick: e }) {
	return /* @__PURE__ */ S("button", {
		onClick: e,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: "Refresh every widget",
		children: "Refresh"
	});
}
function _i({ enabled: e, onToggle: t }) {
	return /* @__PURE__ */ C("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
		children: ["Sound ", e ? "on" : "off"]
	});
}
function vi({ compact: e, onToggle: t }) {
	return /* @__PURE__ */ S("button", {
		onClick: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200",
		title: e ? "Switch to standard density" : "Switch to compact density",
		children: e ? "Standard" : "Compact"
	});
}
function yi({ onCopied: e }) {
	return /* @__PURE__ */ S("button", {
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
function bi({ onClick: e, busy: t }) {
	return /* @__PURE__ */ S("button", {
		onClick: e,
		disabled: t,
		className: "mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-sky-300 hover:text-sky-200 border-sky-500/40",
		title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
		children: t ? "Sharing…" : "Share view"
	});
}
function xi({ frozenAt: e }) {
	let t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, {
		dateStyle: "medium",
		timeStyle: "short"
	}) : null;
	return /* @__PURE__ */ C("span", {
		className: "mtc-control flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400",
		title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static view — data does not refresh",
		children: [
			/* @__PURE__ */ S("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
			n ? "Snapshot" : "Static view",
			n ? /* @__PURE__ */ C("span", {
				className: "text-zinc-600 normal-case tracking-normal",
				children: ["· ", n]
			}) : null
		]
	});
}
function Si(e) {
	if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
	let t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
var Ci = {};
function wi({ template: t, backendUrl: n, backendHeaders: r = Ci, onEvent: i, onIntent: a, onCtxChange: o, paletteSuggest: s, chrome: l = "full", onShare: d, theme: f, templateTrust: p = "untrusted", templateTrustPolicy: m = Q, resolveAssetIntent: g, assetRenderers: w, assetApplicationFrame: ee, saveAssetOpenPreference: E, onAssetOpenError: te, registry: D }) {
	let ne = e(), O = f ?? ne?.theme ?? "dark", k = T(), re = t.columns || 12, [A, ie] = b(t.widgets), ae = D ? [...D.keys()].sort().join("\0") : "", j = v(() => Mr(t, D?.keys(), { includeBuiltIns: D == null }), [
		t,
		D,
		ae
	]), M = v(() => p === "trusted" ? [] : Lr(t, m), [
		t,
		p,
		m
	]), N = v(() => [...j, ...M], [j, M]), oe = v(() => N.some((e) => e.severity === "error"), [N]), P = v(() => M.some((e) => e.severity === "error"), [M]), F = v(() => !!t.frozenAt || ni(t), [t]), [se, ce] = b(!1), [I, le] = b(() => {
		let e = t.context?.values ?? {};
		return typeof window > "u" ? e : {
			...e,
			...fr(window.location.search)
		};
	}), [ue, de] = b(null), [fe, pe] = b(!1), [me, L] = b(!1), [R, he] = b(!1);
	_(() => {
		de(ki("refreshIntervalMs", null)), pe(ki("compact", !1)), L(ki("soundEnabled", !1)), he(!0);
	}, []), _(() => {
		R && Ai("refreshIntervalMs", ue);
	}, [R, ue]), _(() => {
		R && Ai("compact", fe);
	}, [R, fe]), _(() => {
		R && Ai("soundEnabled", me);
	}, [R, me]);
	let [ge, _e] = b(null), [z, ve] = b(null), [ye, xe] = b(null), [Se, Ce] = b([]), [we, Te] = b(!1), Ee = y(0), De = y(!1), Oe = h((e) => {
		xe((t) => ({
			id: e,
			n: (t?.n ?? 0) + 1
		}));
	}, []), ke = y(i);
	_(() => {
		ke.current = i;
	}, [i]);
	let Ae = y(a);
	_(() => {
		Ae.current = a;
	}, [a]);
	let je = h((e) => {
		Ae.current?.(e);
	}, []), [Ne, Pe] = b([]), Fe = h(() => Pe([]), []), [Le, Re] = b([]), ze = h(() => Re([]), []), [Be, Ve] = b({}), He = h((e, t) => {
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
	}, []), Ue = y(/* @__PURE__ */ new Map()), We = h((e, t) => (Ue.current.set(e, t), () => {
		Ue.current.get(e) === t && Ue.current.delete(e);
	}), []), Ge = y({
		widgets: A,
		ctx: I,
		template: t
	});
	Ge.current = {
		widgets: A,
		ctx: I,
		template: t
	};
	let Ke = h(() => {
		let { widgets: e, ctx: t, template: n } = Ge.current;
		return ri(n, e, t, (e, t) => {
			let n = Ue.current.get(ti(e, t));
			return n ? n() : void 0;
		}, (/* @__PURE__ */ new Date()).toISOString());
	}, []), qe = h((e) => {
		ke.current?.(e), e.type === "action" ? Pe((t) => [{
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
	}, []), B = h((e, t = "info") => {
		Ee.current += 1;
		let n = Ee.current;
		Ce((r) => [...r, {
			id: n,
			message: e,
			severity: t
		}]);
	}, []), Je = h(async () => {
		if (!De.current) {
			De.current = !0, Te(!0);
			try {
				let e = Ke();
				d ? await d(e) : Si(e), B(d ? "Snapshot shared" : "Snapshot downloaded", "ok");
			} catch (e) {
				let t = e instanceof Error ? e.message : "Snapshot sharing failed";
				B(`Snapshot failed: ${t}`, "error");
			} finally {
				De.current = !1, Te(!1);
			}
		}
	}, [
		d,
		Ke,
		B
	]), Ye = h((e) => {
		Ce((t) => t.filter((t) => t.id !== e));
	}, []), Xe = h((e, t) => {
		le((n) => n[e] === t ? n : {
			...n,
			[e]: t
		});
	}, []);
	_(() => {
		if (typeof window > "u") return;
		let e = pr(window.location.search, I), t = `${window.location.pathname}${e ? `?${e}` : ""}${window.location.hash}`;
		window.history.replaceState(null, "", t);
	}, [I]);
	let V = y(o);
	_(() => {
		V.current = o;
	}, [o]), _(() => {
		V.current?.(I);
	}, [I]);
	let H = h((e, t) => {
		ie((n) => ur(n, e, t));
	}, []), Ze = (e) => k === "mobile" ? re : k === "tablet" ? Math.min(e, Math.floor(re / 2)) : Math.min(e, re), Qe = v(() => ({
		dispatch: H,
		ctx: I,
		setCtx: Xe,
		backendUrl: n,
		backendHeaders: r,
		widgets: A,
		refreshIntervalMs: ue ?? void 0,
		toast: B,
		compact: fe,
		fullscreenId: ge,
		setFullscreenId: _e,
		focusedId: z,
		setFocusedId: ve,
		refreshPulse: ye,
		requestRefresh: Oe,
		emit: qe,
		emitIntent: je,
		recentActions: Ne,
		clearRecentActions: Fe,
		recentAlerts: Le,
		clearRecentAlerts: ze,
		soundEnabled: me,
		widgetHealth: Be,
		reportWidgetHealth: He,
		registerWidgetData: We,
		snapshot: Ke
	}), [
		H,
		I,
		Xe,
		n,
		r,
		A,
		ue,
		B,
		fe,
		ge,
		z,
		ye,
		Oe,
		qe,
		je,
		Ne,
		Fe,
		Le,
		ze,
		me,
		Be,
		He,
		We,
		Ke
	]), U = h((e, t) => {
		B(`Could not ${t.intent} ${t.asset.name}: ${e.message}`, "error"), te?.(e, t);
	}, [te, B]);
	_(() => {
		if (!ge) return;
		let e = (e) => {
			e.key === "Escape" && _e(null);
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [ge]), _(() => {
		z && typeof document < "u" && document.getElementById(`mt-widget-${z}`)?.scrollIntoView({
			block: "nearest",
			behavior: "smooth"
		});
	}, [z]), _(() => {
		let e = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			let n = e.target?.tagName;
			if (n === "INPUT" || n === "TEXTAREA" || e.target?.isContentEditable) return;
			let r = t.shortcuts?.find((t) => t.key === e.key);
			if (r) {
				e.preventDefault();
				for (let [e, t] of Object.entries(r.ctx)) Xe(e, t);
				return;
			}
			let i = A.map((e) => e.id).filter((e) => !!e);
			if (i.length === 0) return;
			let a = (e) => {
				let t = z ? i.indexOf(z) : -1, n = i[(t + e + i.length) % i.length];
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
					z && (e.preventDefault(), _e(z));
					break;
				case "r":
					z && (e.preventDefault(), Oe(z));
					break;
				case "Escape": z && ve(null);
			}
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		A,
		z,
		Oe,
		t.shortcuts,
		Xe
	]);
	let $e = !P && ge ? A.find((e) => e.id === ge) : null;
	return /* @__PURE__ */ S(be.Provider, {
		value: Qe,
		children: /* @__PURE__ */ S("div", {
			className: `mtc-root mtc-theme-${O}`,
			"data-theme": O,
			"data-density": fe ? "compact" : "standard",
			children: /* @__PURE__ */ S(c, {
				theme: O,
				density: fe ? "compact" : "standard",
				children: /* @__PURE__ */ S(u, {
					resolveAssetIntent: g,
					renderers: w,
					applicationFrame: ee,
					savePreference: E,
					onError: U,
					children: /* @__PURE__ */ S(Ie, { children: /* @__PURE__ */ C(lr, { children: [
						/* @__PURE__ */ S(Cr, { suggest: s }),
						/* @__PURE__ */ S(Er, { templateShortcuts: t.shortcuts }),
						/* @__PURE__ */ S(kr, {
							toasts: Se,
							dismiss: Ye
						}),
						N.length > 0 && (!se || oe) && /* @__PURE__ */ S(Ti, {
							issues: N,
							dismissible: !oe,
							onDismiss: () => ce(!0)
						}),
						/* @__PURE__ */ C("div", {
							className: "mtc-workspace min-h-full flex flex-col",
							children: [/* @__PURE__ */ C("div", {
								className: "flex-1",
								children: [(t.title || l === "full") && /* @__PURE__ */ C("div", {
									className: "mtc-toolbar",
									children: [/* @__PURE__ */ C("div", {
										className: "px-3 md:px-5 py-3 flex items-center gap-3 flex-wrap",
										children: [t.title && /* @__PURE__ */ S("h1", {
											className: "mtc-dashboard-title text-base font-semibold text-zinc-100 mr-1",
											children: Me(t.title, I)
										}), l === "full" && /* @__PURE__ */ C("div", {
											className: "ml-auto flex items-center gap-2 flex-wrap",
											children: [
												F ? /* @__PURE__ */ S(xi, { frozenAt: t.frozenAt }) : /* @__PURE__ */ C(x, { children: [
													/* @__PURE__ */ S(hi, { health: Be }),
													/* @__PURE__ */ S(ui, {
														value: ue,
														onChange: de
													}),
													/* @__PURE__ */ S(gi, { onClick: () => Oe("*") })
												] }),
												/* @__PURE__ */ S(_i, {
													enabled: me,
													onToggle: () => L((e) => !e)
												}),
												/* @__PURE__ */ S(vi, {
													compact: fe,
													onToggle: () => pe((e) => !e)
												}),
												!F && /* @__PURE__ */ S(bi, {
													onClick: () => void Je(),
													busy: we
												}),
												/* @__PURE__ */ S(yi, { onCopied: () => B("URL copied", "ok") }),
												/* @__PURE__ */ S(di, {})
											]
										})]
									}), l === "full" && Object.keys(I).length > 0 && /* @__PURE__ */ C("div", {
										className: "px-3 md:px-5 pb-3 flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ S("span", {
											className: "text-[9px] uppercase tracking-[0.14em] text-zinc-500 mr-1",
											children: "Context"
										}), Object.entries(I).map(([e, t]) => e === "range" ? /* @__PURE__ */ S(ci, {
											value: t,
											onChange: (t) => Xe(e, t)
										}, e) : /* @__PURE__ */ C("div", {
											className: "mtc-context-chip px-2 py-1 text-[11px]",
											children: [/* @__PURE__ */ S("span", {
												className: "text-zinc-500 uppercase tracking-wider mr-1",
												children: e
											}), /* @__PURE__ */ S("span", {
												className: "text-zinc-100 font-mono",
												children: t
											})]
										}, e))]
									})]
								}), /* @__PURE__ */ S("div", {
									className: "p-3 md:p-5",
									children: /* @__PURE__ */ S("div", {
										className: "grid gap-3 md:gap-4 items-start",
										style: { gridTemplateColumns: `repeat(${re}, 1fr)` },
										children: P ? /* @__PURE__ */ S(Ei, { issues: M }) : A.map((e, t) => /* @__PURE__ */ S("div", {
											id: e.id ? `mt-widget-${e.id}` : void 0,
											style: { gridColumn: `span ${Ze(e.span || 6)}` },
											children: /* @__PURE__ */ S(or, {
												config: e,
												contentHeight: e.height || ii[e.component] || 280,
												snapshotKey: ti(e, t),
												registry: D
											})
										}, e.id || t))
									})
								})]
							}), l === "full" && /* @__PURE__ */ S(mi, {})]
						}),
						$e && /* @__PURE__ */ S(Di, {
							widget: $e,
							registry: D,
							onClose: () => _e(null)
						})
					] }) })
				})
			})
		})
	});
}
function Ti({ issues: e, dismissible: t, onDismiss: n }) {
	let r = e.filter((e) => e.severity === "error"), i = e.filter((e) => e.severity === "warn"), a = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", o = r.length > 0 ? "Template errors" : "Template warnings";
	return /* @__PURE__ */ C("div", {
		className: `border-b ${a} px-3 md:px-5 py-2 text-xs flex items-start gap-3`,
		children: [/* @__PURE__ */ C("div", {
			className: "flex-1 min-w-0",
			children: [/* @__PURE__ */ C("div", {
				className: "font-medium uppercase tracking-wider text-[10px] mb-1",
				children: [
					o,
					" (",
					r.length + i.length,
					")"
				]
			}), /* @__PURE__ */ C("ul", {
				className: "space-y-0.5",
				children: [[...r, ...i].slice(0, 8).map((e, t) => /* @__PURE__ */ C("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ S("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ S("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ S("span", { children: e.message })
					]
				}, t)), e.length > 8 && /* @__PURE__ */ C("li", {
					className: "opacity-60 text-[10px]",
					children: [
						"… and ",
						e.length - 8,
						" more"
					]
				})]
			})]
		}), t && /* @__PURE__ */ S("button", {
			onClick: n,
			className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
			children: "Dismiss"
		})]
	});
}
function Ei({ issues: e }) {
	let t = e.filter((e) => e.severity === "error");
	return /* @__PURE__ */ C("div", {
		className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100",
		children: [
			/* @__PURE__ */ S("div", {
				className: "font-medium text-xs uppercase tracking-wider mb-2",
				children: "Template blocked"
			}),
			/* @__PURE__ */ S("p", {
				className: "text-red-200/80 mb-3",
				children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected."
			}),
			/* @__PURE__ */ C("ul", {
				className: "space-y-1",
				children: [t.slice(0, 6).map((e, t) => /* @__PURE__ */ C("li", {
					className: "font-mono text-[11px] leading-tight",
					children: [
						/* @__PURE__ */ S("span", {
							className: "opacity-60",
							children: e.path || "<root>"
						}),
						/* @__PURE__ */ S("span", {
							className: "mx-1.5 opacity-40",
							children: "·"
						}),
						/* @__PURE__ */ S("span", { children: e.message })
					]
				}, t)), t.length > 6 && /* @__PURE__ */ C("li", {
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
function Di({ widget: e, registry: t, onClose: n }) {
	let r = typeof window < "u" ? Math.floor(window.innerHeight * .82) : 600;
	return /* @__PURE__ */ C("div", {
		className: "fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
		onClick: n,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Fullscreen ${e.title ?? e.id ?? e.component}`,
		children: [/* @__PURE__ */ C("div", {
			className: "flex items-center justify-between mb-3 shrink-0",
			children: [/* @__PURE__ */ S("span", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500",
				children: "Fullscreen — esc to close"
			}), /* @__PURE__ */ S("button", {
				onClick: n,
				autoFocus: !0,
				className: "mtc-control text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs",
				children: "Close"
			})]
		}), /* @__PURE__ */ S("div", {
			onClick: (e) => e.stopPropagation(),
			className: "flex-1 min-h-0",
			children: /* @__PURE__ */ S(or, {
				config: e,
				contentHeight: r,
				registry: t
			})
		})]
	});
}
var Oi = "medallion-terminal:";
function ki(e, t) {
	if (typeof window > "u" || !window.localStorage) return t;
	try {
		let n = window.localStorage.getItem(Oi + e);
		return n == null ? t : JSON.parse(n);
	} catch {
		return t;
	}
}
function Ai(e, t) {
	if (typeof window < "u" && window.localStorage) try {
		window.localStorage.setItem(Oi + e, JSON.stringify(t));
	} catch {}
}
//#endregion
//#region src/core/MultiDashboard.tsx
function ji(e, t) {
	_(() => {
		let n = (n) => {
			if (!(n.metaKey || n.ctrlKey)) return;
			let r = Number(n.key);
			Number.isFinite(r) && r >= 1 && r <= 9 && r <= e && (n.preventDefault(), t(r - 1));
		};
		return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
	}, [e, t]);
}
function Mi({ tabs: t, activeIndex: n, onSelect: r, backendUrl: i, backendHeaders: a, theme: o, templateTrust: s, templateTrustPolicy: l, resolveAssetIntent: u, assetRenderers: d, assetApplicationFrame: f, saveAssetOpenPreference: p, onAssetOpenError: m, onIntent: h, registry: g }) {
	let v = e(), y = o ?? v?.theme ?? "dark", x = Math.max(0, Math.min(n, t.length - 1));
	ji(t.length, r);
	let [w, T] = b(() => /* @__PURE__ */ new Set([x]));
	return _(() => {
		T((e) => e.has(x) ? e : /* @__PURE__ */ new Set([...e, x]));
	}, [x]), t.length === 0 ? null : /* @__PURE__ */ S("div", {
		className: `mtc-root mtc-theme-${y}`,
		"data-theme": y,
		children: /* @__PURE__ */ S(c, {
			theme: y,
			density: v?.density ?? "standard",
			children: /* @__PURE__ */ C("div", {
				className: "mtc-workspace min-h-full",
				children: [/* @__PURE__ */ S(Ni, {
					tabs: t,
					activeIndex: x,
					onSelect: r
				}), t.map((e, t) => /* @__PURE__ */ S("div", {
					style: { display: t === x ? "block" : "none" },
					children: w.has(t) && /* @__PURE__ */ S(wi, {
						template: e.template,
						backendUrl: i,
						backendHeaders: a,
						theme: y,
						templateTrust: s,
						templateTrustPolicy: l,
						resolveAssetIntent: u,
						assetRenderers: d,
						assetApplicationFrame: f,
						saveAssetOpenPreference: p,
						onAssetOpenError: m,
						onIntent: h,
						registry: g
					})
				}, t))]
			})
		})
	});
}
function Ni({ tabs: e, activeIndex: t, onSelect: n }) {
	let r = typeof navigator < "u" && /mac/i.test(navigator.platform);
	return /* @__PURE__ */ S("div", {
		className: "mtc-tabstrip flex gap-0.5 px-3 md:px-5 pt-3 overflow-x-auto items-end",
		children: e.map((e, i) => {
			let a = i === t, o = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
			return /* @__PURE__ */ C("button", {
				onClick: () => n(i),
				className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${a ? "mtc-tab-active text-zinc-100 border-x border-t" : "text-zinc-500 hover:text-zinc-300"}`,
				title: o ? `Switch with ${o}` : void 0,
				children: [/* @__PURE__ */ S("span", { children: e.label || `Tab ${i + 1}` }), o && /* @__PURE__ */ S("span", {
					className: "text-[9px] text-zinc-500 font-mono uppercase tracking-wider",
					children: o
				})]
			}, i);
		})
	});
}
function Pi(e = 0) {
	let [t, n] = b(() => {
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
export { Ht as $, er as A, xe as At, Vn as B, ee as Bt, sr as C, Ce as Ct, nr as D, ke as Dt, or as E, Me as Et, Zn as F, me as Ft, en as G, pn as H, T as Ht, Kn as I, F as It, Kt as J, Zt as K, qn as L, P as Lt, Un as M, _e as Mt, Hn as N, ve as Nt, tr as O, Ne as Ot, Gn as P, ye as Pt, It as Q, Jn as R, N as Rt, ur as S, we as St, cr as T, Ee as Tt, Qt as U, mn as V, te as Vt, $t as W, Wt as X, Gt as Y, Vt as Z, _r as _, Pe as _t, ni as a, _t as at, fr as b, De as bt, Fr as c, Dt as ct, Lr as d, et as dt, Ot as et, jr as f, nt as ft, vr as g, Re as gt, Cr as h, ze as ht, ri as i, vt as it, Wn as j, he as jt, $n as k, be as kt, Pr as l, xt as lt, Er as m, it as mt, Pi as n, kt as nt, ti as o, Et as ot, Mr as p, tt as pt, Ut as q, wi as r, yt as rt, Nr as s, Ct as st, Mi as t, bt as tt, Q as u, St as ut, gr as v, Ie as vt, lr as w, Te as wt, pr as x, Oe as xt, hr as y, Fe as yt, Xn as z, D as zt };
