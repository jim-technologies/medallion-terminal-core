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
	})), T = /* @__PURE__ */ new Map();
	for (let { rank: e, x: t, y: n } of C.values()) T.set(e, [...T.get(e) ?? [], s === "down" ? t : n]);
	for (let e of T.values()) e.sort((e, t) => e - t);
	let E = (e, t) => {
		let n = T.get(e);
		if (!n || n.length === 0) return t;
		let r = [n[0] - a / 2];
		return n.forEach((e, t) => {
			let i = n[t + 1];
			r.push(i === void 0 ? e + y + a / 2 : (e + y + i) / 2);
		}), r.reduce((e, n) => Math.abs(n - t) < Math.abs(e - t) ? n : e);
	}, D = [];
	for (let e of l) {
		let t = C.get(e.from), a = C.get(e.to);
		if (!t || !a) continue;
		let c = s === "down" ? {
			edge: e,
			x1: t.x + n / 2,
			y1: t.y + r,
			x2: a.x + n / 2,
			y2: a.y
		} : {
			edge: e,
			x1: t.x + n,
			y1: t.y + r / 2,
			x2: a.x,
			y2: a.y + r / 2
		}, l = a.rank - t.rank;
		if (Math.abs(l) >= 2) {
			let e = Math.sign(l), n = s === "down" ? c.x1 : c.y1, r = s === "down" ? c.x2 : c.y2, u = [];
			for (let c = t.rank + e; c !== a.rank; c += e) {
				let a = E(c, n + (r - n) * (c - t.rank) / l), d = o + c * i;
				for (let t of e > 0 ? [d, d + b] : [d + b, d]) u.push(s === "down" ? {
					x: a,
					y: t
				} : {
					x: t,
					y: a
				});
			}
			c.route = u;
		}
		D.push(c);
	}
	return s === "down" ? {
		nodes: w,
		edges: D,
		width: x,
		height: S
	} : {
		nodes: w,
		edges: D,
		width: S,
		height: x
	};
}
//#endregion
export { e as t };
