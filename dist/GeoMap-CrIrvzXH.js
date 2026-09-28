import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { Ft as t, G as n, H as r, U as i, W as a, kt as o } from "./MultiDashboard-BPk9GlhF.js";
import { i as s, o as c } from "./basemaps-BjEaZSH5.js";
import { useEffect as l, useMemo as u, useRef as d, useState as f } from "react";
import { jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/widgets/GeoMap.tsx
var h = /* @__PURE__ */ e({ GeoMap: () => S }), g = "mtc-geo-features", _ = "mtc-geo-grid", v = "mtc-geo-fill", y = "mtc-geo-line", b = "mtc-geo-point", x = [
	b,
	y,
	v
];
function S({ data: e, options: r }) {
	let h = u(() => n(e), [e]), _ = r ?? {}, v = u(() => {
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
	}, [_.basemap, _.style_url]), { setCtx: y } = o(), b = h !== null, S = d(null), E = d(null), O = d(h), k = d(!1), [A, j] = f(!1), [M, N] = f(null), [P, F] = f(null);
	if (O.current = h, l(() => {
		let e = S.current, t = v.value;
		if (!e || !h || !t) return;
		let n = !1, r = null;
		return j(!1), N(null), k.current = !1, import("maplibre-gl").then((o) => {
			if (n) return;
			let c = D(e);
			r = new o.Map({
				container: e,
				style: s(t, c.bg),
				center: _.center ?? [0, 20],
				zoom: _.zoom ?? 1,
				attributionControl: { compact: !1 },
				interactive: _.interactive !== !1,
				cooperativeGestures: !0,
				renderWorldCopies: !1
			}), E.current = r, r.on("load", () => {
				if (n || !r) return;
				t.kind === "analytical" && C(r, c);
				let e = O.current;
				e && (w(r, e, c), _.fit !== !1 && (T(r, e, _), k.current = !0)), j(!0);
			});
			for (let e of x) r.on("click", e, (e) => {
				let t = e.features?.[0];
				if (!t) return;
				let n = O.current?.features.find((e) => e.id === String(t.id ?? t.properties?._mtc_id ?? ""));
				if (!n) return;
				F(n);
				let r = i(n);
				for (let [e, t] of Object.entries(r)) y(e, t);
				let o = _.feature_context, s = o?.key, c = o?.label_key;
				s && !(s in r) && y(s, n.id), c && !(c in r) && y(c, a(n));
			}), r.on("mouseenter", e, () => {
				r && (r.getCanvas().style.cursor = "pointer");
			}), r.on("mouseleave", e, () => {
				r && (r.getCanvas().style.cursor = "");
			});
			r.on("error", (e) => {
				if (!r?.loaded()) {
					let t = e.error instanceof Error ? e.error.message : "Map failed to load";
					N(t);
				}
			});
		}).catch((e) => {
			n || N(e instanceof Error ? e.message : "Map renderer failed to load");
		}), () => {
			n = !0, r?.remove(), E.current = null, j(!1);
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
	]), !h) return /* @__PURE__ */ p(t, { children: "No geospatial features" });
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
						className: "w-8 h-8 text-[length:var(--mtc-font-size-xs)] text-zinc-300 hover:bg-zinc-800",
						"aria-label": "Fit features",
						title: "Fit features",
						children: "⛶"
					})
				]
			}),
			/* @__PURE__ */ m("div", {
				className: "absolute left-2 top-2 rounded border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[length:var(--mtc-font-size-xs)] font-mono text-zinc-400",
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
					children: a(P)
				}), typeof P.properties._mtc_status == "string" && /* @__PURE__ */ p("span", {
					className: "mt-0.5 block text-[length:var(--mtc-font-size-xs)] text-zinc-500",
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
	let i = r(t);
	if (!i) return;
	let [[a, o], [s, c]] = i;
	if (a === s && o === c) {
		e.easeTo({
			center: [a, o],
			zoom: n.zoom ?? Math.min(n.max_zoom ?? 12, 8),
			duration: 300
		});
		return;
	}
	e.fitBounds(i, {
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
		bg: n("--mtc-bg", "#0b0f13"),
		surface: n("--mtc-surface", "#12151a"),
		grid: n("--mtc-grid", "#1c2024"),
		border: n("--mtc-border", "#2b2f36"),
		accent: n("--mtc-accent", "#61a1f0"),
		ok: n("--mtc-ok", "#57bc80"),
		warning: n("--mtc-warning", "#ebae51"),
		danger: n("--mtc-danger", "#e97170"),
		muted: n("--mtc-muted", "#969ca4"),
		fg: n("--mtc-fg", "#eef0f3")
	};
}
//#endregion
export { h as n, S as t };
