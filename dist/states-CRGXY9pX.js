import { jsx as e, jsxs as t } from "react/jsx-runtime";
//#region src/widgets/states.tsx
var n = {
	timeseries: "chart",
	candlestick: "chart",
	table: "table",
	text: "list",
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
	multi_select: "block",
	json: "list",
	sparkline: "chart",
	action_log: "list",
	alert_log: "list",
	tape: "list",
	file_browser: "table"
};
function r({ component: t }) {
	switch (t ? n[t] : "block") {
		case "chart": return /* @__PURE__ */ e(s, {});
		case "table": return /* @__PURE__ */ e(c, {});
		case "list": return /* @__PURE__ */ e(l, {});
		case "single": return /* @__PURE__ */ e(u, {});
		case "donut": return /* @__PURE__ */ e(d, {});
		case "grid": return /* @__PURE__ */ e(f, {});
		default: return /* @__PURE__ */ e(p, {});
	}
}
function i({ children: n, padded: r }) {
	return /* @__PURE__ */ t("div", {
		className: `flex flex-col items-center justify-center h-full gap-1.5 text-zinc-500 text-sm${r ? " px-4 text-center" : ""}`,
		children: [/* @__PURE__ */ e("span", {
			className: "text-zinc-700 text-xs uppercase tracking-[0.2em] leading-none",
			children: "·  ·  ·"
		}), n]
	});
}
function a({ message: n, onRetry: r }) {
	return /* @__PURE__ */ t("div", {
		className: "h-full flex flex-col items-center justify-center gap-2 px-2",
		children: [/* @__PURE__ */ t("div", {
			className: "flex items-center gap-2 text-sm max-w-full",
			children: [/* @__PURE__ */ e("span", {
				className: "text-red-400 shrink-0",
				children: "⚠"
			}), /* @__PURE__ */ e("span", {
				className: "text-zinc-400 font-mono text-xs truncate",
				children: n
			})]
		}), r && /* @__PURE__ */ e("button", {
			onClick: r,
			className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800",
			children: "Retry"
		})]
	});
}
var o = [
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
function s() {
	return /* @__PURE__ */ e("div", {
		className: "h-full flex items-end gap-1",
		children: o.map((t, n) => /* @__PURE__ */ e("div", {
			className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
			style: {
				height: `${t}%`,
				animationDelay: `${n * 40}ms`
			}
		}, n))
	});
}
function c() {
	let n = [
		80,
		64,
		96
	];
	return /* @__PURE__ */ t("div", {
		className: "h-full flex flex-col gap-2.5",
		children: [/* @__PURE__ */ e("div", {
			className: "flex gap-4 pb-2 border-b border-zinc-800",
			children: n.map((t, n) => /* @__PURE__ */ e("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: { width: t }
			}, n))
		}), Array.from({ length: 5 }).map((t, r) => /* @__PURE__ */ e("div", {
			className: "flex gap-4",
			children: n.map((t, n) => /* @__PURE__ */ e("div", {
				className: "h-3 bg-zinc-800 rounded animate-pulse",
				style: {
					width: t,
					animationDelay: `${(r * 3 + n) * 50}ms`
				}
			}, n))
		}, r))]
	});
}
function l() {
	return /* @__PURE__ */ e("div", {
		className: "h-full flex flex-col gap-3.5",
		children: Array.from({ length: 5 }).map((n, r) => /* @__PURE__ */ t("div", {
			className: "flex gap-3 items-start pt-1",
			children: [/* @__PURE__ */ e("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }), /* @__PURE__ */ t("div", {
				className: "flex-1 flex flex-col gap-1.5 min-w-0",
				children: [/* @__PURE__ */ e("div", {
					className: "h-2.5 bg-zinc-800 rounded animate-pulse",
					style: {
						width: `${55 + r * 11 % 30}%`,
						animationDelay: `${r * 80}ms`
					}
				}), /* @__PURE__ */ e("div", {
					className: "h-2 bg-zinc-800/60 rounded animate-pulse",
					style: {
						width: `${35 + r * 7 % 25}%`,
						animationDelay: `${r * 80 + 40}ms`
					}
				})]
			})]
		}, r))
	});
}
function u() {
	return /* @__PURE__ */ t("div", {
		className: "h-full flex flex-col items-center justify-center gap-2",
		children: [/* @__PURE__ */ e("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }), /* @__PURE__ */ e("div", {
			className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse",
			style: { animationDelay: "120ms" }
		})]
	});
}
function d() {
	return /* @__PURE__ */ t("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ e("div", {
			className: "flex-1 flex items-center justify-center min-h-0",
			children: /* @__PURE__ */ e("svg", {
				viewBox: "0 0 100 100",
				className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse",
				children: /* @__PURE__ */ e("circle", {
					cx: "50",
					cy: "50",
					r: "40",
					fill: "none",
					stroke: "var(--mtc-panel)",
					strokeWidth: "14"
				})
			})
		}), /* @__PURE__ */ e("div", {
			className: "grid grid-cols-2 gap-2 mt-2",
			children: Array.from({ length: 4 }).map((n, r) => /* @__PURE__ */ t("div", {
				className: "flex gap-2 items-center",
				children: [/* @__PURE__ */ e("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }), /* @__PURE__ */ e("div", {
					className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
					style: { animationDelay: `${r * 60}ms` }
				})]
			}, r))
		})]
	});
}
function f() {
	return /* @__PURE__ */ e("div", {
		className: "h-full grid gap-1",
		style: {
			gridTemplateColumns: "repeat(8, 1fr)",
			gridTemplateRows: "repeat(5, 1fr)"
		},
		children: Array.from({ length: 40 }).map((t, n) => /* @__PURE__ */ e("div", {
			className: "bg-zinc-800 rounded-sm animate-pulse",
			style: { animationDelay: `${n * 25}ms` }
		}, n))
	});
}
function p() {
	return /* @__PURE__ */ e("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
//#endregion
export { a as n, r, i as t };
