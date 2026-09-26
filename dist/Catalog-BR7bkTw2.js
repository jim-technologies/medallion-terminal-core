import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n } from "./MultiDashboard-Az14iNfL.js";
import { useEffect as r, useState as i } from "react";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
//#region src/widgets/Catalog.tsx
var s = /* @__PURE__ */ e({ Catalog: () => u }), c = "medallion.terminal.v1.TerminalService", l = {
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
	SHAPE_RECORD_SET: "record_set",
	SHAPE_GEO: "geo",
	SHAPE_MEDIA: "media",
	SHAPE_CONVERSATION: "conversation",
	SHAPE_JSON: "json"
};
function u() {
	let { backendUrl: e, backendHeaders: s, fetch: u } = t(), [d, f] = i(null), [p, m] = i(!0), [h, g] = i(null);
	if (r(() => {
		if (e === void 0) {
			m(!1), f(null);
			return;
		}
		let t = !1;
		m(!0), g(null);
		let n = new AbortController();
		return (u ?? globalThis.fetch)(`${e.replace(/\/$/, "")}/${c}/ListSources`, {
			method: "POST",
			headers: {
				...s,
				"Content-Type": "application/json"
			},
			body: "{}",
			signal: n.signal
		}).then((e) => e.ok ? e.json() : Promise.reject(/* @__PURE__ */ Error(`HTTP ${e.status}`))).then((e) => {
			t || f(e.sources ?? []);
		}).catch((e) => {
			!t && e.name !== "AbortError" && g(e.message);
		}).finally(() => {
			t || m(!1);
		}), () => {
			t = !0, n.abort();
		};
	}, [
		e,
		s,
		u
	]), e === void 0) return /* @__PURE__ */ a(n, {
		padded: !0,
		children: "No backendUrl configured on Dashboard"
	});
	if (p) return /* @__PURE__ */ a(n, {
		padded: !0,
		children: "Loading catalog…"
	});
	if (h) return /* @__PURE__ */ o(n, {
		padded: !0,
		children: ["Failed to load: ", h]
	});
	if (!d || d.length === 0) return /* @__PURE__ */ a(n, {
		padded: !0,
		children: "No sources registered"
	});
	let _ = {};
	for (let e of d) {
		let t = e.shape && l[e.shape] || "other";
		_[t] || (_[t] = []), _[t].push(e);
	}
	return /* @__PURE__ */ a("div", {
		className: "h-full overflow-auto pr-1",
		tabIndex: 0,
		"aria-label": "Source catalog",
		children: Object.entries(_).map(([e, t]) => /* @__PURE__ */ o("div", {
			className: "mb-4 last:mb-0",
			children: [/* @__PURE__ */ o("div", {
				className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5",
				children: [
					e,
					" ",
					/* @__PURE__ */ o("span", {
						className: "text-zinc-500",
						children: ["— ", t.length]
					})
				]
			}), t.map((e) => /* @__PURE__ */ o("div", {
				className: "py-2 border-b border-zinc-800/60 last:border-0",
				children: [
					/* @__PURE__ */ o("div", {
						className: "flex items-baseline gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ a("span", {
								className: "text-sm text-zinc-100 font-mono",
								children: e.id
							}),
							e.streamable && /* @__PURE__ */ a("span", {
								className: "text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded",
								children: "live"
							}),
							e.name && /* @__PURE__ */ o("span", {
								className: "text-xs text-zinc-400",
								children: ["— ", e.name]
							})
						]
					}),
					e.description && /* @__PURE__ */ a("div", {
						className: "text-xs text-zinc-500 mt-0.5",
						children: e.description
					}),
					e.params && e.params.length > 0 && /* @__PURE__ */ o("div", {
						className: "text-[10px] text-zinc-500 mt-1 font-mono",
						children: [
							"params:",
							" ",
							e.params.map((e) => e.required ? `${e.key}*` : e.key).join(", ")
						]
					}),
					e.tags && e.tags.length > 0 && /* @__PURE__ */ a("div", {
						className: "flex gap-1 mt-1 flex-wrap",
						children: e.tags.map((e) => /* @__PURE__ */ a("span", {
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
export { s as n, u as t };
