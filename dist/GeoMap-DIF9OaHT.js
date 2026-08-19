import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, G as n, It as r, K as i, U as a, W as o } from "./MultiDashboard-CwQKjnza.js";
import { i as s, o as c } from "./basemaps-DoOvxEpO.js";
import { useEffect as l, useMemo as u, useRef as d, useState as f } from "react";
import { jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/widgets/GeoMap.tsx
var h = /* @__PURE__ */ e({ GeoMap: () => S }), g = "mtc-geo-features", _ = "mtc-geo-grid", v = "mtc-geo-fill", y = "mtc-geo-line", b = "mtc-geo-point", x = [
	b,
	y,
	v
];
function S({ data: e, options: a }) {
	let h = u(() => i(e), [e]), _ = a ?? {}, v = u(() => {
		try {
			return {
				value: c(_.basemap, _.style_url),
				error: null
			};
		} catch (e) {
			return {
				value: null,
				error: e instanceof Error ? e.message : "Invalid basemap configuration"
			};
		}
	}, [_.basemap, _.style_url]), { setCtx: y } = t(), b = h !== null, S = d(null), E = d(null), O = d(h), k = d(!1), [A, j] = f(!1), [M, N] = f(null), [P, F] = f(null);
	if (O.current = h, l(() => {
		let e = S.current, t = v.value;
		if (!e || !h || !t) return;
		let r = !1, i = null;
		return j(!1), N(null), k.current = !1, import("maplibre-gl").then((a) => {
			if (r) return;
			let c = D(e);
			i = new a.Map({
				container: e,
				style: s(t, c.bg),
				center: _.center ?? [0, 20],
				zoom: _.zoom ?? 1,
				attributionControl: { compact: !1 },
				interactive: _.interactive !== !1,
				cooperativeGestures: !0,
				renderWorldCopies: !1
			}), E.current = i, i.on("load", () => {
				if (r || !i) return;
				t.kind === "analytical" && C(i, c);
				let e = O.current;
				e && (w(i, e, c), _.fit !== !1 && (T(i, e, _), k.current = !0)), j(!0);
			});
			for (let e of x) i.on("click", e, (e) => {
				let t = e.features?.[0];
				if (!t) return;
				let r = O.current?.features.find((e) => e.id === String(t.id ?? t.properties?._mtc_id ?? ""));
				if (!r) return;
				F(r);
				let i = o(r);
				for (let [e, t] of Object.entries(i)) y(e, t);
				let a = _.feature_context, s = a?.key, c = a?.label_key;
				s && !(s in i) && y(s, r.id), c && !(c in i) && y(c, n(r));
			}), i.on("mouseenter", e, () => {
				i && (i.getCanvas().style.cursor = "pointer");
			}), i.on("mouseleave", e, () => {
				i && (i.getCanvas().style.cursor = "");
			});
			i.on("error", (e) => {
				if (!i?.loaded()) {
					let t = e.error instanceof Error ? e.error.message : "Map failed to load";
					N(t);
				}
			});
		}).catch((e) => {
			r || N(e instanceof Error ? e.message : "Map renderer failed to load");
		}), () => {
			r = !0, i?.remove(), E.current = null, j(!1);
		};
	}, [
		v.value?.cache_key,
		_.center?.[0],
		_.center?.[1],
		_.zoom,
		_.interactive,
		b
	]), l(() => {
		let e = E.current;
		if (!h || !e || !e.loaded()) return;
		let t = e.getSource(g);
		t && (t.setData(h), (_.fit_on_update || !k.current && _.fit !== !1) && (T(e, h, _), k.current = !0));
	}, [
		h,
		_.fit,
		_.fit_on_update,
		_.padding,
		_.max_zoom
	]), !h) return /* @__PURE__ */ p(r, { children: "No geospatial features" });
	let I = v.error ?? M;
	return /* @__PURE__ */ m("div", {
		className: "relative h-full w-full overflow-hidden rounded bg-zinc-950",
		role: "region",
		"aria-label": "Geospatial map",
		children: [
			/* @__PURE__ */ p("div", {
				ref: S,
				className: "mtc-geo-map absolute inset-0"
			}),
			!A && !I && /* @__PURE__ */ p("div", {
				className: "absolute inset-0 grid place-items-center bg-zinc-950/60 text-xs text-zinc-500",
				children: "Loading map…"
			}),
			I && /* @__PURE__ */ p("div", {
				className: "absolute inset-0 grid place-items-center bg-zinc-950/85 px-6 text-center text-xs text-red-400",
				children: I
			}),
			/* @__PURE__ */ m("div", {
				className: "absolute right-2 top-2 flex flex-col overflow-hidden rounded border border-zinc-700 bg-zinc-950/85 shadow",
				children: [
					/* @__PURE__ */ p("button", {
						type: "button",
						onClick: () => E.current?.zoomIn(),
						className: "w-8 h-8 text-sm text-zinc-300 hover:bg-zinc-800 border-b border-zinc-700",
						"aria-label": "Zoom in",
						children: "+"
					}),
					/* @__PURE__ */ p("button", {
						type: "button",
						onClick: () => E.current?.zoomOut(),
						className: "w-8 h-8 text-sm text-zinc-300 hover:bg-zinc-800 border-b border-zinc-700",
						"aria-label": "Zoom out",
						children: "−"
					}),
					/* @__PURE__ */ p("button", {
						type: "button",
						onClick: () => {
							let e = E.current;
							e && T(e, h, _);
						},
						className: "w-8 h-8 text-[10px] text-zinc-300 hover:bg-zinc-800",
						"aria-label": "Fit features",
						title: "Fit features",
						children: "⛶"
					})
				]
			}),
			/* @__PURE__ */ m("div", {
				className: "absolute left-2 top-2 rounded border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[10px] font-mono text-zinc-400",
				children: [
					h.features.length.toLocaleString(),
					" feature",
					h.features.length === 1 ? "" : "s"
				]
			}),
			P && /* @__PURE__ */ m("button", {
				type: "button",
				onClick: () => F(null),
				className: "absolute bottom-2 left-2 max-w-[70%] rounded border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-left shadow",
				"aria-label": "Close selected feature detail",
				children: [/* @__PURE__ */ p("span", {
					className: "block truncate text-xs font-medium text-zinc-100",
					children: n(P)
				}), typeof P.properties._mtc_status == "string" && /* @__PURE__ */ p("span", {
					className: "mt-0.5 block text-[10px] uppercase tracking-wider text-zinc-500",
					children: P.properties._mtc_status
				})]
			})
		]
	});
}
function C(e, t) {
	e.getSource(_) || (e.addSource(_, {
		type: "geojson",
		data: E()
	}), e.addLayer({
		id: "mtc-geo-grid-lines",
		type: "line",
		source: _,
		paint: {
			"line-color": t.grid,
			"line-opacity": .65,
			"line-width": 1
		}
	}));
}
function w(e, t, n) {
	e.addSource(g, {
		type: "geojson",
		data: t,
		promoteId: "_mtc_id"
	});
	let r = [
		"match",
		["get", "_mtc_tone"],
		"ok",
		n.ok,
		"warn",
		n.warning,
		"danger",
		n.danger,
		"info",
		n.accent,
		n.muted
	], i = t.features.map((e) => e.properties._mtc_value).filter((e) => typeof e == "number" && Number.isFinite(e)), a = i.length > 0 ? Math.min(...i) : 0, o = i.length > 0 ? Math.max(...i) : 1, s = o > a ? [
		"interpolate",
		["linear"],
		[
			"coalesce",
			["get", "_mtc_value"],
			a
		],
		a,
		4.5,
		o,
		13
	] : 6;
	e.addLayer({
		id: v,
		type: "fill",
		source: g,
		filter: [
			"in",
			["geometry-type"],
			["literal", ["Polygon", "MultiPolygon"]]
		],
		paint: {
			"fill-color": r,
			"fill-opacity": .22
		}
	}), e.addLayer({
		id: y,
		type: "line",
		source: g,
		filter: [
			"in",
			["geometry-type"],
			["literal", [
				"LineString",
				"MultiLineString",
				"Polygon",
				"MultiPolygon"
			]]
		],
		paint: {
			"line-color": r,
			"line-opacity": .9,
			"line-width": 2
		}
	}), e.addLayer({
		id: b,
		type: "circle",
		source: g,
		filter: [
			"in",
			["geometry-type"],
			["literal", ["Point", "MultiPoint"]]
		],
		paint: {
			"circle-color": r,
			"circle-radius": s,
			"circle-opacity": .9,
			"circle-stroke-color": n.surface,
			"circle-stroke-width": 1.5
		}
	});
}
function T(e, t, n) {
	let r = a(t);
	if (!r) return;
	let [[i, o], [s, c]] = r;
	if (i === s && o === c) {
		e.easeTo({
			center: [i, o],
			zoom: n.zoom ?? Math.min(n.max_zoom ?? 12, 8),
			duration: 300
		});
		return;
	}
	e.fitBounds(r, {
		padding: n.padding ?? 36,
		maxZoom: n.max_zoom ?? 12,
		duration: 300
	});
}
function E() {
	let e = [];
	for (let t = -150; t <= 150; t += 30) e.push({
		type: "Feature",
		id: `lng-${t}`,
		properties: {
			_mtc_id: `lng-${t}`,
			_mtc_label: "",
			_mtc_tone: "neutral",
			_mtc_context: "{}"
		},
		geometry: {
			type: "LineString",
			coordinates: [[t, -80], [t, 80]]
		}
	});
	for (let t = -60; t <= 60; t += 30) e.push({
		type: "Feature",
		id: `lat-${t}`,
		properties: {
			_mtc_id: `lat-${t}`,
			_mtc_label: "",
			_mtc_tone: "neutral",
			_mtc_context: "{}"
		},
		geometry: {
			type: "LineString",
			coordinates: [[-180, t], [180, t]]
		}
	});
	return {
		type: "FeatureCollection",
		features: e
	};
}
function D(e) {
	let t = getComputedStyle(e), n = (e, n) => t.getPropertyValue(e).trim() || n;
	return {
		bg: n("--mtc-bg", "#0a0d10"),
		surface: n("--mtc-surface", "#11151a"),
		grid: n("--mtc-grid", "#20272e"),
		border: n("--mtc-border", "#28313a"),
		accent: n("--mtc-accent", "#5a8dee"),
		ok: n("--mtc-ok", "#4fb184"),
		warning: n("--mtc-warning", "#d6a354"),
		danger: n("--mtc-danger", "#df6972"),
		muted: n("--mtc-muted", "#87929e"),
		fg: n("--mtc-fg", "#f1f4f6")
	};
}
//#endregion
export { h as n, S as t };
