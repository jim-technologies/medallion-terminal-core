//#region src/widgets/orderBookShape.ts
function e(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return null;
	let t = e, n = r(t.bids, "bid"), i = r(t.asks, "ask");
	if (n.length === 0 && i.length === 0) return null;
	let o = a(t.mid), s = a(t.spread);
	return {
		bids: n,
		asks: i,
		...o !== void 0 && { mid: o },
		...s !== void 0 && { spread: s },
		...typeof t.venue == "string" && t.venue !== "" && { venue: t.venue }
	};
}
function t(e, t = 100, r = "size") {
	let i = Number.isFinite(t) ? Math.max(1, Math.floor(t)) : 100, a = 0, o = e.bids.slice(0, i).map((e) => (a += n(e, r), {
		price: e.price,
		side: "bid",
		cumulative: a
	})), s = 0, c = e.asks.slice(0, i).map((e) => (s += n(e, r), {
		price: e.price,
		side: "ask",
		cumulative: s
	}));
	return [...o.reverse(), ...c];
}
function n(e, t) {
	return t === "notional" ? e.price * e.size : e.size;
}
function r(e, t) {
	if (!Array.isArray(e)) return [];
	let n = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = i(t);
		e && n.set(e.price, (n.get(e.price) ?? 0) + e.size);
	}
	return Array.from(n, ([e, t]) => ({
		price: e,
		size: t
	})).sort((e, n) => t === "bid" ? n.price - e.price : e.price - n.price);
}
function i(e) {
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
function a(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
//#endregion
export { e as n, t };
