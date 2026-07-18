//#region src/maps/basemaps.ts
var e = {
	analytical: {
		id: "analytical",
		label: "Analytical grid",
		provider: "Built-in",
		description: "Network-free coordinate grid for private operational overlays.",
		style_url: null,
		network: !1,
		self_hostable: !0
	},
	"openfreemap-dark": {
		id: "openfreemap-dark",
		label: "OpenFreeMap Dark",
		provider: "OpenFreeMap",
		description: "Dark general-purpose OpenStreetMap basemap.",
		style_url: "https://tiles.openfreemap.org/styles/dark",
		network: !0,
		documentation_url: "https://openfreemap.org/quick_start/",
		self_hostable: !0
	},
	"openfreemap-liberty": {
		id: "openfreemap-liberty",
		label: "OpenFreeMap Liberty",
		provider: "OpenFreeMap",
		description: "Balanced general-purpose OpenStreetMap basemap.",
		style_url: "https://tiles.openfreemap.org/styles/liberty",
		network: !0,
		documentation_url: "https://openfreemap.org/quick_start/",
		self_hostable: !0
	},
	"openfreemap-positron": {
		id: "openfreemap-positron",
		label: "OpenFreeMap Positron",
		provider: "OpenFreeMap",
		description: "Low-contrast light basemap for data-heavy overlays.",
		style_url: "https://tiles.openfreemap.org/styles/positron",
		network: !0,
		documentation_url: "https://openfreemap.org/quick_start/",
		self_hostable: !0
	},
	"versatiles-eclipse": {
		id: "versatiles-eclipse",
		label: "VersaTiles Eclipse",
		provider: "VersaTiles",
		description: "Dark OpenStreetMap basemap from the VersaTiles public stack.",
		style_url: "https://tiles.versatiles.org/assets/styles/eclipse/style.json",
		network: !0,
		documentation_url: "https://docs.versatiles.org/guides/use_tiles_versatiles_org",
		self_hostable: !0
	},
	"versatiles-graybeard": {
		id: "versatiles-graybeard",
		label: "VersaTiles Graybeard",
		provider: "VersaTiles",
		description: "Neutral grayscale OpenStreetMap basemap for dense overlays.",
		style_url: "https://tiles.versatiles.org/assets/styles/graybeard/style.json",
		network: !0,
		documentation_url: "https://docs.versatiles.org/guides/use_tiles_versatiles_org",
		self_hostable: !0
	}
}, t = Object.freeze(Object.keys(e));
function n(t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
function r(e, r) {
	if (e != null && r != null) throw Error("geo_map options.basemap and options.style_url are mutually exclusive");
	if (e == null && r != null) {
		if (typeof r != "string" || !r.trim()) throw Error("geo_map options.style_url must be a non-empty string");
		return s(r.trim(), "legacy-style");
	}
	if (e == null) return o("analytical");
	if (typeof e == "string") {
		if (!n(e)) throw Error(`unknown basemap preset ${JSON.stringify(e)}; expected one of ${t.join(", ")}`);
		return o(e);
	}
	if (!f(e) || typeof e.kind != "string") throw Error("geo_map options.basemap must be a preset name or basemap configuration object");
	if (e.kind === "preset") {
		if (typeof e.preset != "string" || !n(e.preset)) throw Error(`unknown basemap preset ${JSON.stringify(e.preset)}; expected one of ${t.join(", ")}`);
		return o(e.preset);
	}
	if (e.kind === "style") {
		if (typeof e.url != "string" || !e.url.trim()) throw Error("style basemap url must be a non-empty string");
		return s(e.url.trim(), "custom-style");
	}
	if (e.kind === "raster") return c(e);
	throw Error(`unknown basemap kind ${JSON.stringify(e.kind)}; expected "preset", "style", or "raster"`);
}
function i(e) {
	return e.kind === "style" ? [e.style_url] : e.kind === "raster" ? [...e.tiles] : [];
}
function a(e, t = "#0a0d10") {
	return e.kind === "style" ? e.style_url : e.kind === "raster" ? d(e, t) : u(t);
}
function o(t) {
	let n = e[t];
	return n.style_url ? {
		id: t,
		kind: "style",
		provider: n.provider,
		network: !0,
		style_url: n.style_url,
		cache_key: `preset:${t}`,
		preset: t
	} : {
		id: t,
		kind: "analytical",
		provider: n.provider,
		network: !1,
		cache_key: `preset:${t}`,
		preset: t
	};
}
function s(e, t) {
	return {
		id: t,
		kind: "style",
		provider: "custom",
		network: !0,
		style_url: e,
		cache_key: `style:${e}`
	};
}
function c(e) {
	let t = typeof e.tiles == "string" ? [e.tiles] : Array.isArray(e.tiles) ? e.tiles : [];
	if (t.length === 0 || t.some((e) => typeof e != "string" || !e.trim())) throw Error("raster basemap tiles must be a non-empty URL string or string array");
	let n = e.tile_size ?? 256;
	if (n !== 256 && n !== 512) throw Error("raster basemap tile_size must be 256 or 512");
	let r = l(e.min_zoom, 0, "min_zoom"), i = l(e.max_zoom, 22, "max_zoom");
	if (r > i) throw Error("raster basemap min_zoom must be less than or equal to max_zoom");
	let a = e.scheme ?? "xyz";
	if (a !== "xyz" && a !== "tms") throw Error("raster basemap scheme must be \"xyz\" or \"tms\"");
	if (e.attribution != null && typeof e.attribution != "string") throw Error("raster basemap attribution must be a string");
	let o = t.map((e) => e.trim()), s = typeof e.attribution == "string" ? e.attribution.trim() : void 0;
	return {
		id: "custom-raster",
		kind: "raster",
		provider: "custom",
		network: !0,
		tiles: o,
		...s ? { attribution: s } : {},
		tile_size: n,
		min_zoom: r,
		max_zoom: i,
		scheme: a,
		cache_key: JSON.stringify([
			"raster",
			o,
			s ?? "",
			n,
			r,
			i,
			a
		])
	};
}
function l(e, t, n) {
	if (e == null) return t;
	if (!Number.isInteger(e) || e < 0 || e > 24) throw Error(`raster basemap ${n} must be an integer from 0 to 24`);
	return e;
}
function u(e) {
	return {
		version: 8,
		sources: {},
		layers: [{
			id: "mtc-background",
			type: "background",
			paint: { "background-color": e }
		}]
	};
}
function d(e, t) {
	return {
		version: 8,
		sources: { "mtc-basemap-raster": {
			type: "raster",
			tiles: e.tiles,
			tileSize: e.tile_size,
			minzoom: e.min_zoom,
			maxzoom: e.max_zoom,
			scheme: e.scheme,
			...e.attribution ? { attribution: e.attribution } : {}
		} },
		layers: [{
			id: "mtc-background",
			type: "background",
			paint: { "background-color": t }
		}, {
			id: "mtc-basemap-raster",
			type: "raster",
			source: "mtc-basemap-raster",
			minzoom: e.min_zoom,
			maxzoom: e.max_zoom
		}]
	};
}
function f(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
//#endregion
export { n as a, a as i, t as n, r as o, i as r, e as t };
