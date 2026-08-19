import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t, T as n } from "./MultiDashboard-CwQKjnza.js";
import { useEffect as r, useMemo as i, useRef as a } from "react";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
import { CandlestickSeries as c, ColorType as l, HistogramSeries as u, createChart as d, createSeriesMarkers as f } from "lightweight-charts";
//#region src/widgets/Candlestick.tsx
var p = /* @__PURE__ */ e({ Candlestick: () => _ }), m = {
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
}, h = {
	shape: "circle",
	position: "aboveBar",
	color: "muted"
}, g = {
	accent: "#5a8dee",
	danger: "#df6972",
	ok: "#4fb184",
	warning: "#d6a354",
	muted: "#87929e",
	mutedSubtle: "#596571",
	border: "#28313a",
	grid: "#20272e"
};
function _({ data: e }) {
	let { hoverTime: p, setHoverTime: m } = n(), h = a(null), _ = a(null), y = a(null), b = a(null), x = a(null), T = a(null), E = a(g);
	r(() => {
		if (!h.current) return;
		let e = C(h.current);
		E.current = e;
		let t = d(h.current, {
			layout: {
				background: {
					type: l.Solid,
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
		}), n = t.addSeries(c, {
			upColor: e.ok,
			downColor: e.danger,
			borderDownColor: e.danger,
			borderUpColor: e.ok,
			wickDownColor: e.danger,
			wickUpColor: e.ok
		}), r = t.addSeries(u, {
			priceFormat: { type: "volume" },
			priceScaleId: "volume"
		});
		t.priceScale("volume").applyOptions({ scaleMargins: {
			top: .8,
			bottom: 0
		} }), _.current = t, y.current = n, b.current = r, x.current = f(n, []), t.subscribeCrosshairMove((e) => {
			if (e.time != null) {
				let t = String(e.time);
				T.current = t, m(t);
			} else T.current = null, m(null);
		});
		let i = new ResizeObserver((e) => {
			let { width: n, height: r } = e[0].contentRect;
			t.applyOptions({
				width: n,
				height: r
			});
		});
		return i.observe(h.current), () => {
			i.disconnect(), t.remove(), _.current = null, y.current = null, b.current = null, x.current = null;
		};
	}, []), r(() => {
		let e = _.current, t = y.current;
		if (!e || !t) return;
		if (p == null) {
			e.clearCrosshairPosition();
			return;
		}
		if (p === T.current) return;
		let n = t.data?.()[0]?.close ?? 0;
		e.setCrosshairPosition(n, p, t);
	}, [p]);
	let D = i(() => S(e), [e]);
	return r(() => {
		if (y.current && D.candles.length !== 0) {
			if (y.current.setData(D.candles), D.volumes.length > 0 && b.current) {
				let e = E.current;
				b.current.setData(D.volumes.map((t) => ({
					...t,
					color: t.direction === "down" ? w(e.danger, .3) : w(e.ok, .3)
				})));
			}
			x.current && x.current.setMarkers(v(D.annotations, E.current)), _.current?.timeScale().fitContent();
		}
	}, [D]), /* @__PURE__ */ s("div", {
		className: "relative w-full h-full",
		children: [/* @__PURE__ */ o("div", {
			ref: h,
			className: "w-full h-full"
		}), D.candles.length === 0 && /* @__PURE__ */ o("div", {
			className: "absolute inset-0 flex items-center justify-center pointer-events-none",
			children: /* @__PURE__ */ o(t, { children: "No data" })
		})]
	});
}
function v(e, t) {
	return e.map((e) => {
		let n = e.kind ? m[e.kind] ?? h : h;
		return {
			time: x(e.timestamp),
			position: n.position,
			shape: n.shape,
			color: e.color ?? t[n.color],
			text: e.label
		};
	});
}
var y = [
	"timestamp",
	"date",
	"time",
	"datetime",
	"ts",
	"t"
];
function b(e, t) {
	for (let n of t) if (n in e) return n;
	let n = Object.keys(e).reduce((e, t) => (e[t.toLowerCase()] = t, e), {});
	for (let e of t) if (n[e]) return n[e];
	return null;
}
function x(e) {
	if (typeof e == "number") return e > 0xe8d4a51000 ? Math.floor(e / 1e3) : e;
	let t = String(e).trim();
	if (t.includes("T") || / \d/.test(t)) {
		let e = new Date(t.replace(" ", "T"));
		if (!isNaN(e.getTime())) return Math.floor(e.getTime() / 1e3);
	}
	return t.split(" ")[0].split("T")[0];
}
function S(e) {
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
	let i = n[0], a = b(i, y), o = b(i, ["open", "o"]), s = b(i, ["high", "h"]), c = b(i, ["low", "l"]), l = b(i, ["close", "c"]), u = b(i, [
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
		let t = e, n = x(t[a]), r = Number(t[o]), i = Number(t[s]), p = Number(t[c]), m = Number(t[l]);
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
function C(e) {
	let t = getComputedStyle(e), n = (e, n) => t.getPropertyValue(e).trim() || n;
	return {
		accent: n("--mtc-accent", g.accent),
		danger: n("--mtc-danger", g.danger),
		ok: n("--mtc-ok", g.ok),
		warning: n("--mtc-warning", g.warning),
		muted: n("--mtc-muted", g.muted),
		mutedSubtle: n("--mtc-muted-subtle", g.mutedSubtle),
		border: n("--mtc-border", g.border),
		grid: n("--mtc-grid", g.grid)
	};
}
function w(e, t) {
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
export { p as n, _ as t };
