//#region src/graph/layeredLayout.ts
function e(e, t, { nodeWidth: n, nodeHeight: r, rankGap: i, nodeGap: a, padding: o, direction: s = "down" }) {
	if (e.length === 0) return null;
	let c = new Set(e.map((e) => e.id)), l = t.filter((e) => c.has(e.from) && c.has(e.to)), u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
	for (let t of e) u.set(t.id, 0), d.set(t.id, []), f.set(t.id, 0);
	for (let e of l) u.set(e.to, (u.get(e.to) ?? 0) + 1), d.get(e.from)?.push(e.to);
	let p = e.filter((e) => (u.get(e.id) ?? 0) === 0).map((e) => e.id), m = new Set(p), h = /* @__PURE__ */ new Set();
	for (let t = 0; h.size < e.length; t++) {
		if (t >= p.length) {
			let t;
			for (let n of e) m.has(n.id) || (t === void 0 || (u.get(n.id) ?? 0) < (u.get(t) ?? 0)) && (t = n.id);
			if (t === void 0) break;
			p.push(t), m.add(t);
		}
		let n = p[t];
		h.add(n);
		for (let e of d.get(n) ?? []) {
			if (h.has(e)) continue;
			f.set(e, Math.max(f.get(e) ?? 0, (f.get(n) ?? 0) + 1));
			let t = (u.get(e) ?? 0) - 1;
			u.set(e, t), t === 0 && !m.has(e) && (p.push(e), m.add(e));
		}
	}
	let g = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = f.get(t.id) ?? 0;
		g.set(e, [...g.get(e) ?? [], t.id]);
	}
	let _ = Math.max(0, ...f.values()), v = Math.max(...Array.from(g.values(), (e) => e.length)), y = s === "down" ? n : r, b = s === "down" ? r : n, x = o * 2 + v * y + (v - 1) * a, S = o * 2 + (_ + 1) * b + _ * (i - b), C = /* @__PURE__ */ new Map();
	for (let [e, t] of g) {
		let n = (x - (t.length * y + (t.length - 1) * a)) / 2;
		t.forEach((t, r) => {
			let c = n + r * (y + a), l = o + e * i;
			C.set(t, s === "down" ? {
				x: c,
				y: l,
				rank: e
			} : {
				x: l,
				y: c,
				rank: e
			});
		});
	}
	let w = e.map((e) => ({
		node: e,
		...C.get(e.id)
	})), T = [];
	for (let e of l) {
		let t = C.get(e.from), i = C.get(e.to);
		t && i && T.push(s === "down" ? {
			edge: e,
			x1: t.x + n / 2,
			y1: t.y + r,
			x2: i.x + n / 2,
			y2: i.y
		} : {
			edge: e,
			x1: t.x + n,
			y1: t.y + r / 2,
			x2: i.x,
			y2: i.y + r / 2
		});
	}
	return s === "down" ? {
		nodes: w,
		edges: T,
		width: x,
		height: S
	} : {
		nodes: w,
		edges: T,
		width: S,
		height: x
	};
}
//#endregion
export { e as t };
