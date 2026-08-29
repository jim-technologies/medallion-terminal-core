//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/bytewriter.js
var e = class {
	constructor(e = 1024) {
		this.buffer = new ArrayBuffer(e), this.view = new DataView(this.buffer), this.offset = 0, this.index = 0;
	}
	ensure(e) {
		if (this.index + e > this.buffer.byteLength) {
			let t = Math.max(this.buffer.byteLength * 2, this.index + e), n = new ArrayBuffer(t);
			new Uint8Array(n).set(new Uint8Array(this.buffer)), this.buffer = n, this.view = new DataView(this.buffer);
		}
	}
	finish() {}
	getBuffer() {
		return this.buffer.slice(0, this.index);
	}
	getBytes() {
		return new Uint8Array(this.buffer, 0, this.index);
	}
	appendUint8(e) {
		this.ensure(1), this.view.setUint8(this.index, e), this.offset++, this.index++;
	}
	appendUint32(e) {
		this.ensure(4), this.view.setUint32(this.index, e, !0), this.offset += 4, this.index += 4;
	}
	appendInt32(e) {
		this.ensure(4), this.view.setInt32(this.index, e, !0), this.offset += 4, this.index += 4;
	}
	appendInt64(e) {
		this.ensure(8), this.view.setBigInt64(this.index, BigInt(e), !0), this.offset += 8, this.index += 8;
	}
	appendFloat32(e) {
		this.ensure(4), this.view.setFloat32(this.index, e, !0), this.offset += 4, this.index += 4;
	}
	appendFloat64(e) {
		this.ensure(8), this.view.setFloat64(this.index, e, !0), this.offset += 8, this.index += 8;
	}
	appendBuffer(e) {
		this.appendBytes(new Uint8Array(e));
	}
	appendBytes(e) {
		this.ensure(e.length), new Uint8Array(this.buffer, this.index, e.length).set(e), this.offset += e.length, this.index += e.length;
	}
	appendVarInt(e) {
		for (;;) if (e & -128) this.appendUint8(e & 127 | 128), e >>>= 7;
		else {
			this.appendUint8(e);
			return;
		}
	}
	appendVarBigInt(e) {
		for (;;) if ((e & -128n) == 0n) {
			this.appendUint8(Number(e));
			return;
		} else this.appendUint8(Number(e & 127n | 128n)), e >>= 7n;
	}
	appendZigZag(e) {
		typeof e == "number" ? this.appendVarInt(e << 1 ^ e >> 31) : this.appendVarBigInt(e << 1n ^ e >> 63n);
	}
};
//#endregion
//#region node_modules/.pnpm/hyparquet@1.29.2/node_modules/hyparquet/src/schema.js
function t(e, n, r) {
	let i = e[n], a = [], o = 1;
	if (i.num_children) for (; a.length < i.num_children;) {
		let i = e[n + o], s = t(e, n + o, [...r, i.name]);
		o += s.count, a.push(s);
	}
	return {
		count: o,
		element: i,
		children: a,
		path: r
	};
}
function n(e, n) {
	let r = t(e, 0, []), i = [r];
	for (let e of n) {
		let t = r.children.find((t) => t.element.name === e);
		if (!t) throw Error(`parquet schema element not found: ${n}`);
		i.push(t), r = t;
	}
	return i;
}
function r(e) {
	let t = 0;
	for (let { element: n } of e.slice(1)) n.repetition_type !== "REQUIRED" && t++;
	return t;
}
function i(e) {
	if (!e || e.element.converted_type !== "LIST" || e.children.length > 1) return !1;
	let t = e.children[0];
	return !(t.children.length > 1 || t.element.repetition_type !== "REPEATED");
}
function a(e) {
	if (!e || e.element.converted_type !== "MAP" || e.children.length > 1) return !1;
	let t = e.children[0];
	return t.children.length === 2 && t.element.repetition_type === "REPEATED" && t.children.find((e) => e.element.name === "key")?.element.repetition_type !== "REPEATED" && t.children.find((e) => e.element.name === "value")?.element.repetition_type !== "REPEATED";
}
//#endregion
//#region node_modules/.pnpm/hyparquet@1.29.2/node_modules/hyparquet/src/xxhash.js
var o = 18446744073709551615n, s = 11400714785074694791n, c = 14029467366897019727n, l = 1609587929392839161n, u = 9650029242287828579n, d = 2870177450012600261n;
function f(e, t) {
	return (e << t | e >> 64n - t) & o;
}
function p(e, t) {
	return e = e + t * c & o, e = f(e, 31n), e * s & o;
}
function m(e, t) {
	return e ^= p(0n, t), e * s + u & o;
}
function h(e, t = 0n) {
	let n = new DataView(e.buffer, e.byteOffset, e.byteLength), r = e.byteLength, i = 0, a;
	if (r >= 32) {
		let e = t + s + c & o, l = t + c & o, u = t, d = t - s & o;
		for (; i + 32 <= r;) e = p(e, n.getBigUint64(i, !0)), i += 8, l = p(l, n.getBigUint64(i, !0)), i += 8, u = p(u, n.getBigUint64(i, !0)), i += 8, d = p(d, n.getBigUint64(i, !0)), i += 8;
		a = f(e, 1n) + f(l, 7n) + f(u, 12n) + f(d, 18n) & o, a = m(a, e), a = m(a, l), a = m(a, u), a = m(a, d);
	} else a = t + d & o;
	for (a = a + BigInt(r) & o; i + 8 <= r;) a ^= p(0n, n.getBigUint64(i, !0)), a = f(a, 27n) * s + u & o, i += 8;
	for (i + 4 <= r && (a ^= BigInt(n.getUint32(i, !0)) * s & o, a = f(a, 23n) * c + l & o, i += 4); i < r;) a ^= BigInt(n.getUint8(i)) * d & o, a = f(a, 11n) * s & o, i += 1;
	return a ^= a >> 33n, a = a * c & o, a ^= a >> 29n, a = a * l & o, a ^= a >> 32n, a;
}
//#endregion
//#region node_modules/.pnpm/hyparquet@1.29.2/node_modules/hyparquet/src/bloom.js
var g = new TextEncoder();
new Uint32Array([
	1203114875,
	1150766481,
	2284105051,
	2729912477,
	1884591559,
	770785867,
	2667333959,
	1550580529
]);
function _(e, t) {
	if (e == null) return;
	let { type: n, converted_type: r, logical_type: i } = t;
	if (n === "BOOLEAN") return typeof e == "boolean" ? h(new Uint8Array([+!!e])) : void 0;
	if (n === "FLOAT") {
		if (typeof e != "number") return;
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setFloat32(0, e, !0), h(new Uint8Array(t));
	}
	if (n === "DOUBLE") {
		if (typeof e != "number") return;
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setFloat64(0, e, !0), h(new Uint8Array(t));
	}
	if (n === "INT32") {
		if (r === "DATE" || r === "DECIMAL" || r === "TIME_MILLIS" || i?.type === "DATE" || i?.type === "TIME" || i?.type === "DECIMAL" || typeof e != "number" || !Number.isInteger(e)) return;
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, e | 0, !0), h(new Uint8Array(t));
	}
	if (n === "INT64") {
		if (r === "TIMESTAMP_MILLIS" || r === "TIMESTAMP_MICROS" || r === "TIME_MICROS" || r === "DECIMAL" || i?.type === "TIMESTAMP" || i?.type === "TIME" || i?.type === "DECIMAL") return;
		let t;
		if (typeof e == "bigint") t = e;
		else if (typeof e == "number" && Number.isSafeInteger(e)) t = BigInt(e);
		else return;
		let n = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(n).setBigUint64(0, BigInt.asUintN(64, t), !0), h(new Uint8Array(n));
	}
	if (n === "BYTE_ARRAY") return r === "JSON" || r === "BSON" || r === "DECIMAL" || i?.type === "JSON" || i?.type === "BSON" || i?.type === "VARIANT" || i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY" ? void 0 : typeof e == "string" ? h(g.encode(e)) : e instanceof Uint8Array ? h(e) : void 0;
	if (n === "FIXED_LEN_BYTE_ARRAY") return r === "DECIMAL" || r === "INTERVAL" || i?.type === "DECIMAL" || i?.type === "UUID" || i?.type === "FLOAT16" || i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY" ? void 0 : e instanceof Uint8Array ? h(e) : void 0;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/thrift.js
var v = 0, y = 1, b = 2, x = 3, S = 5, C = 6, w = 8, T = 9, E = 12, D = class {
	constructor(e) {
		this.fields = e;
	}
};
function O(e, t) {
	k(e, E, t);
}
function k(e, t, n) {
	if (t !== y && t !== b) {
		if (t === x && typeof n == "number") e.appendUint8(n);
		else if (t === S && typeof n == "number") e.appendZigZag(n);
		else if (t === C && typeof n == "bigint") e.appendZigZag(n);
		else if (t === 7 && typeof n == "number") e.appendFloat64(n);
		else if (t === w && typeof n == "string") {
			let t = new TextEncoder().encode(n);
			e.appendVarInt(t.length), e.appendBytes(t);
		} else if (t === w && n instanceof Uint8Array) e.appendVarInt(n.byteLength), e.appendBytes(n);
		else if (t === T && Array.isArray(n)) {
			let t = M(n);
			if (n.length > 14 ? (e.appendUint8(240 | t), e.appendVarInt(n.length)) : e.appendUint8(n.length << 4 | t), t === b) for (let t of n) e.appendUint8(+!!t);
			else for (let r of n) k(e, t, r);
		} else if (t === E && n instanceof D) {
			let t = 0;
			for (let [r, i, a] of n.fields) a !== void 0 && (t = A(e, t, r, i, a));
			e.appendUint8(v);
		} else if (t === E && typeof n == "object") {
			let t = 0;
			for (let [r, i] of Object.entries(n)) {
				if (i === void 0) continue;
				let n = parseInt(r.replace(/^field_/, ""), 10);
				if (Number.isNaN(n)) throw Error(`thrift invalid field name: ${r}. Expected "field_###"`);
				let a = j(i);
				t = A(e, t, n, a, i);
			}
			e.appendUint8(v);
		} else throw Error(`thrift invalid type ${t} for value ${n}`);
	}
}
function A(e, t, n, r, i) {
	let a = n - t;
	if (a <= 0) throw Error(`thrift non-monotonic field id: fid=${n}, lastFid=${t}`);
	return a > 15 ? (e.appendUint8(r), e.appendZigZag(n)) : e.appendUint8(a << 4 | r), k(e, r, i), n;
}
function j(e) {
	if (e === !0) return y;
	if (e === !1) return b;
	if (Number.isInteger(e)) return S;
	if (typeof e == "number") return 7;
	if (typeof e == "bigint") return C;
	if (typeof e == "string" || e instanceof Uint8Array) return w;
	if (Array.isArray(e)) return T;
	if (e && typeof e == "object") return E;
	throw Error(`Cannot determine thrift compact type for: ${e}`);
}
function M(e) {
	let t = 0;
	for (let n of e) {
		let e = j(n);
		if (e === y && (e = b), t ||= e, t === 7 && e === S && (e = 7), t === S && e === 7 && (t = 7), e !== t) throw Error(`thrift invalid type for list element: ${n} (expected type ${t})`);
	}
	return t ?? x;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/bloom.js
var ee = new Uint32Array([
	1203114875,
	1150766481,
	2284105051,
	2729912477,
	1884591559,
	770785867,
	2667333959,
	1550580529
]), N = 32;
function te(e, t) {
	return Number((e >> 32n) * BigInt(t) >> 32n);
}
function P(e) {
	let t = /* @__PURE__ */ new Uint32Array(8), n = Number(e & 4294967295n) | 0;
	for (let e = 0; e < 8; e++) t[e] = 1 << (Math.imul(n, ee[e]) >>> 27);
	return t;
}
function F(e, t) {
	let n = te(t, e.length >> 3) << 3, r = P(t);
	for (let t = 0; t < 8; t++) e[n + t] |= r[t];
}
function I(e) {
	let t = 1;
	for (; t < e;) t <<= 1;
	return t;
}
function L(e, t) {
	if (!(t > 0 && t < 1)) throw Error(`bloom filter fpp must be in (0, 1), got ${t}`);
	if (!(e >= 0)) throw Error(`bloom filter ndv must be >= 0, got ${e}`);
	let n = -8 * e / Math.log(1 - t ** (1 / 8)), r = Math.ceil(n);
	(!isFinite(r) || r > 1073741824) && (r = 1073741824), r = Math.ceil(r / 256) * 256;
	let i = r >> 3;
	return i < N && (i = N), i < 1024 && (i = I(i)), i;
}
var ne = class {
	constructor(e, { fpp: t = .01, maxBytes: n = 1048576 } = {}) {
		this.element = e, this.fpp = t, this.maxBytes = n, this.hashes = /* @__PURE__ */ new Set(), this.skipped = 0;
	}
	insert(e) {
		if (e == null) return;
		let t = _(e, this.element);
		if (t === void 0) {
			this.skipped++;
			return;
		}
		this.hashes.add(t);
	}
	finalize() {
		if (this.skipped > 0 || this.hashes.size === 0) return;
		let e = L(this.hashes.size, this.fpp);
		if (e > this.maxBytes) return;
		let t = new Uint32Array(e >> 2);
		for (let e of this.hashes) F(t, e);
		return t;
	}
};
function R(e, t) {
	if (t.length % 8 != 0) throw Error(`bloom filter block count must be a multiple of 8 uint32 words, got ${t.length}`);
	O(e, {
		field_1: t.byteLength,
		field_2: { field_1: {} },
		field_3: { field_1: {} },
		field_4: { field_1: {} }
	});
	for (let n = 0; n < t.length; n++) e.appendUint32(t[n]);
}
function re(e, t) {
	for (let { chunk: n, bloomFilter: r } of t) {
		if (!r || !n.meta_data) continue;
		let t = e.offset;
		R(e, r), n.meta_data.bloom_filter_offset = BigInt(t), n.meta_data.bloom_filter_length = e.offset - t;
	}
}
//#endregion
//#region node_modules/.pnpm/hyparquet@1.29.2/node_modules/hyparquet/src/constants.js
var ie = [
	"BOOLEAN",
	"INT32",
	"INT64",
	"INT96",
	"FLOAT",
	"DOUBLE",
	"BYTE_ARRAY",
	"FIXED_LEN_BYTE_ARRAY"
], z = [
	"PLAIN",
	"GROUP_VAR_INT",
	"PLAIN_DICTIONARY",
	"RLE",
	"BIT_PACKED",
	"DELTA_BINARY_PACKED",
	"DELTA_LENGTH_BYTE_ARRAY",
	"DELTA_BYTE_ARRAY",
	"RLE_DICTIONARY",
	"BYTE_STREAM_SPLIT"
], ae = [
	"REQUIRED",
	"OPTIONAL",
	"REPEATED"
], oe = [
	"UTF8",
	"MAP",
	"MAP_KEY_VALUE",
	"LIST",
	"ENUM",
	"DECIMAL",
	"DATE",
	"TIME_MILLIS",
	"TIME_MICROS",
	"TIMESTAMP_MILLIS",
	"TIMESTAMP_MICROS",
	"UINT_8",
	"UINT_16",
	"UINT_32",
	"UINT_64",
	"INT_8",
	"INT_16",
	"INT_32",
	"INT_64",
	"JSON",
	"BSON",
	"INTERVAL"
], se = [
	"UNCOMPRESSED",
	"SNAPPY",
	"GZIP",
	"LZO",
	"BROTLI",
	"LZ4",
	"ZSTD",
	"LZ4_RAW"
], ce = [
	"DATA_PAGE",
	"INDEX_PAGE",
	"DICTIONARY_PAGE",
	"DATA_PAGE_V2"
], le = [
	"UNORDERED",
	"ASCENDING",
	"DESCENDING"
], ue = [
	"SPHERICAL",
	"VINCENTY",
	"THOMAS",
	"ANDOYER",
	"KARNEY"
], B = 128, V = 4, H = B / V;
function U(e, t) {
	if (t.length === 0) {
		e.appendVarInt(B), e.appendVarInt(V), e.appendVarInt(0), e.appendVarInt(0);
		return;
	}
	if (typeof t[0] != "number" && typeof t[0] != "bigint") throw Error("deltaBinaryPack only supports number or bigint arrays");
	de(t) ? fe(e, t) : pe(e, t);
}
function de(e) {
	if (e instanceof Int32Array) return !0;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (typeof n != "number" || !Number.isInteger(n) || n < -2147483648 || n > 2147483647) return !1;
	}
	return !0;
}
function fe(e, t) {
	let n = t.length;
	e.appendVarInt(B), e.appendVarInt(V), e.appendVarInt(n), me(e, Number(t[0]));
	let r = [], i = new Float64Array(B), a = new Uint8Array(V), o = 1;
	for (; o < n;) {
		let s = Math.min(o + B, n), c = s - o, l = Number(t[o]) - Number(t[o - 1]);
		i[0] = l;
		for (let e = 1; e < c; e++) {
			let n = Number(t[o + e]) - Number(t[o + e - 1]);
			i[e] = n, n < l && (l = n);
		}
		me(e, l);
		for (let e = 0; e < V; e++) {
			let t = e * H, n = Math.min(t + H, c), r = 0;
			for (let e = t; e < n; e++) {
				let t = i[e] - l;
				t > r && (r = t);
			}
			a[e] = he(r);
		}
		e.appendBytes(a);
		for (let t = 0; t < V; t++) {
			let n = a[t];
			if (n === 0) continue;
			let o = t * H, s = Math.min(o + H, c), u = r[n] ??= new Uint8Array(n * 4), d = 0, f = 0, p = 0;
			if (n <= 25) for (let e = 0; e < H; e++) {
				let t = o + e < s ? i[o + e] - l : 0;
				for (f |= t << p, p += n; p >= 8;) u[d++] = f & 255, f >>>= 8, p -= 8;
			}
			else for (let e = 0; e < H; e++) {
				let t = o + e < s ? i[o + e] - l : 0;
				for (f += t * 2 ** p, p += n; p >= 8;) u[d++] = f % 256, f = Math.floor(f / 256), p -= 8;
			}
			e.appendBytes(u);
		}
		o = s;
	}
}
function pe(e, t) {
	let n = t.length;
	e.appendVarInt(B), e.appendVarInt(V), e.appendVarInt(n), e.appendZigZag(t[0]);
	let r = 1;
	for (; r < n;) {
		let i = Math.min(r + B, n), a = i - r, o = new BigInt64Array(a), s = BigInt(t[r]) - BigInt(t[r - 1]);
		o[0] = s;
		for (let e = 1; e < a; e++) {
			let n = BigInt(t[r + e]) - BigInt(t[r + e - 1]);
			o[e] = n, n < s && (s = n);
		}
		e.appendZigZag(s);
		let c = new Uint8Array(V);
		for (let e = 0; e < V; e++) {
			let t = e * H, n = Math.min(t + H, a), r = 0n;
			for (let e = t; e < n; e++) {
				let t = o[e] - s;
				t > r && (r = t);
			}
			c[e] = ve(r);
		}
		e.appendBytes(c);
		for (let t = 0; t < V; t++) {
			let n = c[t];
			if (n === 0) continue;
			let r = t * H, i = Math.min(r + H, a), l = 0n, u = 0;
			for (let t = 0; t < H; t++) {
				let a = r + t < i ? o[r + t] - s : 0n;
				for (l |= a << BigInt(u), u += n; u >= 8;) e.appendUint8(Number(l & 255n)), l >>= 8n, u -= 8;
			}
		}
		r = i;
	}
}
function me(e, t) {
	let n = t < 0 ? -t * 2 - 1 : t * 2;
	for (; n >= 128;) e.appendUint8(n % 128 + 128), n = Math.floor(n / 128);
	e.appendUint8(n);
}
function he(e) {
	return e === 0 ? 0 : e > 4294967295 ? 33 : 32 - Math.clz32(e);
}
function ge(e, t) {
	let n = new Int32Array(t.length);
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (!(r instanceof Uint8Array)) throw Error("deltaLengthByteArray expects Uint8Array values");
		n[e] = r.length;
	}
	U(e, n);
	for (let n of t) e.appendBytes(n);
}
function _e(e, t) {
	if (t.length === 0) {
		U(e, []), U(e, []);
		return;
	}
	let n = new Int32Array(t.length), r = new Int32Array(t.length), i = t[0];
	if (!(i instanceof Uint8Array)) throw Error("deltaByteArray expects Uint8Array values");
	n[0] = 0, r[0] = i.length;
	for (let e = 1; e < t.length; e++) {
		let i = t[e - 1], a = t[e], o;
		if (a === i) o = a.length;
		else {
			if (!(a instanceof Uint8Array)) throw Error("deltaByteArray expects Uint8Array values");
			o = 0;
			let e = Math.min(i.length, a.length);
			for (; o < e && i[o] === a[o];) o++;
		}
		n[e] = o, r[e] = a.length - o;
	}
	U(e, n), U(e, r);
	for (let i = 0; i < t.length; i++) r[i] > 0 && e.appendBytes(t[i].subarray(n[i]));
}
function ve(e) {
	if (e === 0n) return 0;
	let t = 0;
	for (; e > 0n;) t++, e >>= 1n;
	return t;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/encoding.js
function W(e, t, n) {
	let r = e.offset, i = 0, a = 0, o = 0;
	for (; o < t.length;) {
		let r = 1, s = t[o];
		for (; o + r < t.length && t[o + r] === s;) r++;
		r >= 8 ? (i &&= (be(e, t, a, i, n), 0), ye(e, s, r, n), o += r) : (i === 0 && (a = o), i++, o += 8);
	}
	return i && be(e, t, a, i, n), e.offset - r;
}
function ye(e, t, n, r) {
	e.appendVarInt(n << 1);
	let i = r + 7 >> 3;
	for (let n = 0; n < i; n++) e.appendUint8(t >> (n << 3) & 255);
}
function be(e, t, n, r, i) {
	if (e.appendVarInt(r << 1 | 1), i === 0) return;
	let a = (1 << i) - 1, o = 0, s = 0, c = r * 8;
	for (let r = 0; r < c; r++) {
		let c = n + r, l = c < t.length ? t[c] & a : 0;
		for (o |= l << s, s += i; s >= 8;) e.appendUint8(o & 255), o >>>= 8, s -= 8;
	}
	s > 0 && e.appendUint8(o & 255);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/plain.js
function xe(e, t, n, r) {
	if (n === "BOOLEAN") Se(e, t);
	else if (n === "INT32") Ce(e, t);
	else if (n === "INT64") we(e, t);
	else if (n === "FLOAT") Te(e, t);
	else if (n === "DOUBLE") Ee(e, t);
	else if (n === "BYTE_ARRAY") De(e, t);
	else if (n === "FIXED_LEN_BYTE_ARRAY") {
		if (!r) throw Error("parquet FIXED_LEN_BYTE_ARRAY expected type_length");
		Oe(e, t, r);
	} else throw Error(`parquet unsupported type: ${n}`);
}
function Se(e, t) {
	let n = 0;
	for (let r = 0; r < t.length; r++) {
		let i = t[r];
		if (typeof i != "boolean") throw Error("parquet expected boolean value, got " + i);
		let a = r % 8;
		i && (n |= 1 << a), a === 7 && (e.appendUint8(n), n = 0);
	}
	t.length % 8 && e.appendUint8(n);
}
function Ce(e, t) {
	for (let n of t) {
		if (!Number.isSafeInteger(n)) throw Error("parquet expected integer value, got " + n);
		if (n < -2147483648 || n > 2147483647) throw Error("parquet expected int32 value, got " + n);
		e.appendInt32(n);
	}
}
function we(e, t) {
	for (let n of t) {
		if (typeof n != "bigint") throw Error("parquet expected bigint value, got " + n);
		e.appendInt64(n);
	}
}
function Te(e, t) {
	for (let n of t) {
		if (typeof n != "number") throw Error("parquet expected number value, got " + n);
		e.appendFloat32(n);
	}
}
function Ee(e, t) {
	for (let n of t) {
		if (typeof n != "number") throw Error("parquet expected number value, got " + n);
		e.appendFloat64(n);
	}
}
function De(e, t) {
	for (let n of t) {
		let t = n;
		if (typeof t == "string" && (t = new TextEncoder().encode(n)), !(t instanceof Uint8Array)) throw Error("parquet expected Uint8Array value, got " + typeof t);
		e.appendUint32(t.length), e.appendBytes(t);
	}
}
function Oe(e, t, n) {
	for (let r of t) {
		if (!(r instanceof Uint8Array)) throw Error("parquet expected Uint8Array value, got " + typeof r);
		if (r.length !== n) throw Error(`parquet expected Uint8Array of length ${n}`);
		e.appendBytes(r);
	}
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/variant.js
var ke = new TextEncoder(), Ae = -(2n ** 63n), je = 2n ** 63n - 1n, Me = new Uint8Array([0]), Ne = /* @__PURE__ */ new Set(["value", "typed_value"]), Pe = /* @__PURE__ */ new Map(), Fe = Je([]);
function Ie(e, t, n) {
	if (n?.required) {
		for (let t = 0; t < e.length; t++) if (e[t] === void 0) throw Error(`required variant column ${n.name} has undefined value at index ${t}`);
	}
	let r = [], i = t && G(t);
	if (i) {
		let t = /* @__PURE__ */ new Map();
		return e.map((e) => {
			if (e === void 0) return null;
			let n = /* @__PURE__ */ new Set();
			K(e, n);
			let { metadata: a, keyIndex: o } = Re(n, t);
			return {
				metadata: a,
				...Le(e, i, o, !0, r)
			};
		});
	}
	let a = qe(e), o = Je(a), s = /* @__PURE__ */ new Map();
	for (let e = 0; e < a.length; e++) s.set(a[e], e);
	return e.map((e) => e === void 0 ? null : {
		metadata: o,
		value: q(e, s, r)
	});
}
function Le(e, t, n, r, i) {
	if (e == null) return {
		value: Me,
		typed_value: null
	};
	if (Array.isArray(t)) {
		if (!Array.isArray(e)) return {
			value: q(e, n, i),
			typed_value: null
		};
		let r = t[0];
		return {
			value: null,
			typed_value: e.map((e) => Le(e, r, n, !1, i))
		};
	}
	if (typeof t == "object") {
		if (typeof e != "object" || Array.isArray(e) || e instanceof Date || e instanceof Uint8Array) return {
			value: q(e, n, i),
			typed_value: null
		};
		let a = {}, o = !1;
		for (let n of Object.keys(e)) n in t || e[n] === void 0 || (a[n] = e[n], o = !0);
		if (o && !r) return {
			value: q(e, n, i),
			typed_value: null
		};
		let s = Object.keys(t);
		if (s.some((t) => (!Object.prototype.hasOwnProperty.call(e, t) || e[t] === void 0) && n.has(t))) return {
			value: q(e, n, i),
			typed_value: null
		};
		let c = {};
		for (let r of s) !Object.prototype.hasOwnProperty.call(e, r) || e[r] === void 0 || (c[r] = Le(e[r], t[r], n, !1, i));
		return {
			value: o ? q(a, n, i) : null,
			typed_value: c
		};
	}
	return ze(e, t) ? {
		value: null,
		typed_value: e
	} : {
		value: q(e, n, i),
		typed_value: null
	};
}
function Re(e, t) {
	if (e.size === 0) return {
		metadata: Fe,
		keyIndex: Pe
	};
	let n = [...e].sort(), r = n.join("\0"), i = t.get(r);
	if (i) return i;
	let a = Je(n), o = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e++) o.set(n[e], e);
	let s = {
		metadata: a,
		keyIndex: o
	};
	return t.set(r, s), s;
}
function ze(e, t) {
	if (e == null) return !1;
	switch (t) {
		case "BOOLEAN": return typeof e == "boolean";
		case "INT32": return typeof e == "number" && Number.isInteger(e) && e >= -2147483648 && e <= 2147483647;
		case "INT64": return typeof e == "bigint" && e >= Ae && e <= je;
		case "FLOAT": return typeof e == "number";
		case "DOUBLE": return typeof e == "number";
		case "STRING": return typeof e == "string";
		case "TIMESTAMP": return e instanceof Date;
		default: return !1;
	}
}
var Be = 3, Ve = 256;
function He(e) {
	let t = We(e, 0);
	if (t === void 0 || typeof t != "object") return;
	let n = G(t);
	if (!(n === void 0 || Ue(n) > Ve)) return n;
}
function Ue(e) {
	if (Array.isArray(e)) return e.length ? Ue(e[0]) : 0;
	if (e && typeof e == "object") {
		let t = 0;
		for (let n of Object.keys(e)) t += Ue(e[n]);
		return t;
	}
	return 1;
}
function We(e, t) {
	let n = [];
	for (let t of e) t != null && n.push(t);
	if (!n.length) return;
	if (n.some(Ge)) {
		if (t >= Be) return;
		let e = /* @__PURE__ */ new Map();
		for (let t of n) if (Ge(t)) for (let [n, r] of Object.entries(t)) {
			if (r === void 0) continue;
			let t = e.get(n);
			t ? t.push(r) : e.set(n, [r]);
		}
		let r = {};
		for (let [n, i] of e) {
			let e = We(i, t + 1);
			e !== void 0 && (r[n] = e);
		}
		return Object.keys(r).length > 0 ? r : void 0;
	}
	if (n.every(Array.isArray)) {
		if (t >= Be) return;
		let e = [];
		for (let t of n) for (let n of t) e.push(n);
		let r = We(e, t + 1);
		return r === void 0 ? void 0 : [r];
	}
	let r;
	for (let e of n) {
		if (Array.isArray(e)) return;
		let t = e instanceof Date ? "date" : typeof e;
		if (r === void 0) r = t;
		else if (r !== t) return;
	}
	return r ? Ke(r) : void 0;
}
function Ge(e) {
	return typeof e == "object" && !!e && !Array.isArray(e) && !(e instanceof Date) && !(e instanceof Uint8Array);
}
function G(e) {
	if (Array.isArray(e)) {
		let t = e.length ? G(e[0]) : void 0;
		return t === void 0 ? void 0 : [t];
	}
	if (typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) {
			if (Ne.has(n)) continue;
			let e = G(r);
			e !== void 0 && (t[n] = e);
		}
		return Object.keys(t).length > 0 ? t : void 0;
	}
	return e;
}
function Ke(e) {
	switch (e) {
		case "boolean": return "BOOLEAN";
		case "string": return "STRING";
		case "number": return "DOUBLE";
		case "bigint": return "INT64";
		case "date": return "TIMESTAMP";
		default: return;
	}
}
function qe(e) {
	let t = /* @__PURE__ */ new Set();
	return K(e, t), [...t].sort();
}
function K(e, t) {
	if (e != null) {
		if (Array.isArray(e)) {
			for (let n of e) K(n, t);
			return;
		}
		if (!(e instanceof Date || e instanceof Uint8Array) && typeof e == "object") for (let n of Object.keys(e)) t.add(n), K(e[n], t);
	}
}
function Je(e) {
	let t = e.length, n = Array(t), r = 0;
	for (let i = 0; i < t; i++) {
		let t = ke.encode(e[i]);
		n[i] = t, r += t.length;
	}
	let i = J(r), a = 17 | i - 1 << 6, o = 1 + i + (t + 1) * i + r, s = new Uint8Array(o), c = 0;
	s[c++] = a;
	for (let e = 0; e < i; e++) s[c++] = t >> e * 8 & 255;
	let l = 0;
	for (let e = 0; e < t; e++) {
		for (let e = 0; e < i; e++) s[c++] = l >> e * 8 & 255;
		l += n[e].length;
	}
	for (let e = 0; e < i; e++) s[c++] = l >> e * 8 & 255;
	for (let e = 0; e < t; e++) s.set(n[e], c), c += n[e].length;
	return s;
}
function q(t, n, r) {
	let i = new e(8);
	return Ye(t, i, n, r), i.getBytes();
}
function Ye(e, t, n, r) {
	if (e == null) {
		t.appendUint8(0);
		return;
	}
	if (e === !0) {
		t.appendUint8(4);
		return;
	}
	if (e === !1) {
		t.appendUint8(8);
		return;
	}
	if (typeof e == "bigint") {
		if (e < Ae || e > je) throw RangeError(`variant bigint out of int64 range: ${e}`);
		t.appendUint8(24), t.appendInt64(e);
		return;
	}
	if (typeof e == "number") {
		if (Number.isInteger(e)) {
			if (e >= -128 && e <= 127) {
				t.appendUint8(12), t.appendUint8(e & 255);
				return;
			}
			if (e >= -32768 && e <= 32767) {
				t.appendUint8(16), Y(t, e, 2);
				return;
			}
			if (e >= -2147483648 && e <= 2147483647) {
				t.appendUint8(20), t.appendInt32(e);
				return;
			}
		}
		t.appendUint8(28), t.appendFloat64(e);
		return;
	}
	if (typeof e == "string") {
		let n = ke.encode(e);
		n.length <= 63 ? (t.appendUint8(n.length << 2 | 1), t.appendBytes(n)) : (t.appendUint8(64), t.appendUint32(n.length), t.appendBytes(n));
		return;
	}
	if (e instanceof Date) {
		t.appendUint8(52), t.appendInt64(BigInt(e.getTime()) * 1000n);
		return;
	}
	if (e instanceof Uint8Array) {
		t.appendUint8(60), t.appendUint32(e.length), t.appendBytes(e);
		return;
	}
	if (Array.isArray(e)) {
		Ze(e, t, n, r);
		return;
	}
	if (typeof e == "object") {
		Xe(e, t, n, r);
		return;
	}
	throw Error(`variant cannot encode value: ${e}`);
}
function Xe(t, n, r, i) {
	let a = Object.keys(t).filter((e) => t[e] !== void 0).map((e) => {
		let t = r.get(e);
		if (t === void 0) throw Error(`variant key not in dictionary: ${e}`);
		return {
			id: t,
			key: e
		};
	});
	a.sort((e, t) => e.id - t.id);
	let o = a.length, s = J(o > 0 ? a[o - 1].id : 0), c = i.pop() ?? new e(8), l = Array(o + 1);
	l[0] = 0;
	for (let e = 0; e < o; e++) Ye(t[a[e].key], c, r, i), l[e + 1] = c.index;
	let u = J(l[o]), d = +(o > 255);
	n.appendUint8((u - 1 | s - 1 << 2 | d << 4) << 2 | 2), d ? n.appendUint32(o) : n.appendUint8(o);
	for (let { id: e } of a) Y(n, e, s);
	for (let e of l) Y(n, e, u);
	n.appendBytes(c.getBytes()), c.index = 0, c.offset = 0, i.push(c);
}
function Ze(t, n, r, i) {
	let a = t.length, o = i.pop() ?? new e(8), s = Array(a + 1);
	s[0] = 0;
	for (let e = 0; e < a; e++) Ye(t[e], o, r, i), s[e + 1] = o.index;
	let c = J(s[a]), l = +(a > 255);
	n.appendUint8((c - 1 | l << 2) << 2 | 3), l ? n.appendUint32(a) : n.appendUint8(a);
	for (let e of s) Y(n, e, c);
	n.appendBytes(o.getBytes()), o.index = 0, o.offset = 0, i.push(o);
}
function J(e) {
	return e <= 255 ? 1 : e <= 65535 ? 2 : e <= 16777215 ? 3 : 4;
}
function Y(e, t, n) {
	for (let r = 0; r < n; r++) e.appendUint8(t >> r * 8 & 255);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/schema.js
function Qe({ columnData: e, schemaOverrides: t }) {
	let n = [{
		name: "root",
		num_children: e.length
	}];
	for (let { name: r, data: i, type: a, nullable: o, shredding: s } of e) if (t?.[r]) {
		let e = t[r];
		if (a || o !== void 0) throw Error(`cannot provide both type and schema override for column ${r}`);
		if (e.name !== r) throw Error(`schema override for column ${r} must have matching name, got ${e.name}`);
		if (e.type === "FIXED_LEN_BYTE_ARRAY" && !e.type_length) throw Error("schema override for FIXED_LEN_BYTE_ARRAY must include type_length");
		if (e.num_children) throw Error("schema override does not support nested types");
		n.push(e);
	} else if (a === "VARIANT") {
		let e = o === !1 ? "REQUIRED" : "OPTIONAL", t = s && s !== !0 ? G(s) : void 0;
		t ? n.push({
			name: r,
			repetition_type: e,
			num_children: 3,
			logical_type: { type: "VARIANT" }
		}, {
			name: "metadata",
			type: "BYTE_ARRAY",
			repetition_type: "REQUIRED"
		}, {
			name: "value",
			type: "BYTE_ARRAY",
			repetition_type: "OPTIONAL"
		}, ...$e(t)) : n.push({
			name: r,
			repetition_type: e,
			num_children: 2,
			logical_type: { type: "VARIANT" }
		}, {
			name: "metadata",
			type: "BYTE_ARRAY",
			repetition_type: "REQUIRED"
		}, {
			name: "value",
			type: "BYTE_ARRAY",
			repetition_type: "OPTIONAL"
		});
	} else a ? n.push(tt(r, a, o)) : n.push(nt(r, i.slice(0, 1e3)));
	return n;
}
function $e(e) {
	if (Array.isArray(e)) return [
		{
			name: "typed_value",
			repetition_type: "OPTIONAL",
			converted_type: "LIST",
			num_children: 1
		},
		{
			name: "list",
			repetition_type: "REPEATED",
			num_children: 1
		},
		{
			name: "element",
			repetition_type: "REQUIRED",
			num_children: 2
		},
		{
			name: "value",
			type: "BYTE_ARRAY",
			repetition_type: "OPTIONAL"
		},
		...$e(e[0])
	];
	if (typeof e == "object") {
		let t = Object.keys(e), n = [{
			name: "typed_value",
			repetition_type: "OPTIONAL",
			num_children: t.length
		}];
		for (let r of t) n.push({
			name: r,
			repetition_type: "OPTIONAL",
			num_children: 2
		}, {
			name: "value",
			type: "BYTE_ARRAY",
			repetition_type: "OPTIONAL"
		}, ...$e(e[r]));
		return n;
	}
	return [et(e)];
}
function et(e) {
	switch (e) {
		case "STRING": return {
			name: "typed_value",
			type: "BYTE_ARRAY",
			converted_type: "UTF8",
			repetition_type: "OPTIONAL"
		};
		case "INT32": return {
			name: "typed_value",
			type: "INT32",
			repetition_type: "OPTIONAL"
		};
		case "INT64": return {
			name: "typed_value",
			type: "INT64",
			repetition_type: "OPTIONAL"
		};
		case "DOUBLE": return {
			name: "typed_value",
			type: "DOUBLE",
			repetition_type: "OPTIONAL"
		};
		case "FLOAT": return {
			name: "typed_value",
			type: "FLOAT",
			repetition_type: "OPTIONAL"
		};
		case "BOOLEAN": return {
			name: "typed_value",
			type: "BOOLEAN",
			repetition_type: "OPTIONAL"
		};
		case "TIMESTAMP": return {
			name: "typed_value",
			type: "INT64",
			converted_type: "TIMESTAMP_MICROS",
			repetition_type: "OPTIONAL"
		};
		default: throw Error(`unsupported shredded field type: ${e}`);
	}
}
function tt(e, t, n) {
	let r = n === !1 ? "REQUIRED" : "OPTIONAL";
	return t === "STRING" ? {
		name: e,
		type: "BYTE_ARRAY",
		converted_type: "UTF8",
		repetition_type: r
	} : t === "JSON" ? {
		name: e,
		type: "BYTE_ARRAY",
		converted_type: "JSON",
		repetition_type: r
	} : t === "TIMESTAMP" ? {
		name: e,
		type: "INT64",
		converted_type: "TIMESTAMP_MILLIS",
		repetition_type: r
	} : t === "UUID" ? {
		name: e,
		type: "FIXED_LEN_BYTE_ARRAY",
		type_length: 16,
		logical_type: { type: "UUID" },
		repetition_type: r
	} : t === "FLOAT16" ? {
		name: e,
		type: "FIXED_LEN_BYTE_ARRAY",
		type_length: 2,
		logical_type: { type: "FLOAT16" },
		repetition_type: r
	} : t === "GEOMETRY" ? {
		name: e,
		type: "BYTE_ARRAY",
		logical_type: { type: "GEOMETRY" },
		repetition_type: r
	} : t === "GEOGRAPHY" ? {
		name: e,
		type: "BYTE_ARRAY",
		logical_type: { type: "GEOGRAPHY" },
		repetition_type: r
	} : {
		name: e,
		type: t,
		repetition_type: r
	};
}
function nt(e, t) {
	let n, r = "REQUIRED", i;
	if (t instanceof Int32Array) return {
		name: e,
		type: "INT32",
		repetition_type: r
	};
	if (t instanceof BigInt64Array) return {
		name: e,
		type: "INT64",
		repetition_type: r
	};
	if (t instanceof Float32Array) return {
		name: e,
		type: "FLOAT",
		repetition_type: r
	};
	if (t instanceof Float64Array) return {
		name: e,
		type: "DOUBLE",
		repetition_type: r
	};
	for (let e of t) if (e == null) r = "OPTIONAL";
	else {
		let t, r;
		if (typeof e == "boolean") t = "BOOLEAN";
		else if (typeof e == "bigint") t = "INT64";
		else if (Number.isInteger(e)) t = "INT32";
		else if (typeof e == "number") t = "DOUBLE";
		else if (e instanceof Uint8Array) t = "BYTE_ARRAY";
		else if (typeof e == "string") t = "BYTE_ARRAY", r = "UTF8";
		else if (e instanceof Date) t = "INT64", r = "TIMESTAMP_MILLIS";
		else if (typeof e == "object") t = "BYTE_ARRAY", r = "JSON";
		else throw Error(`cannot determine parquet type for: ${e}`);
		if (n === void 0) n = t, i = r;
		else if (n === "INT32" && t === "DOUBLE") n = "DOUBLE";
		else if (n === "DOUBLE" && t === "INT32") continue;
		else if (n !== t || i !== r) throw Error(`parquet cannot write mixed types: ${i ?? n} and ${r ?? t}`);
	}
	return n || (n = "BYTE_ARRAY", r = "OPTIONAL"), {
		name: e,
		type: n,
		repetition_type: r,
		converted_type: i
	};
}
function rt(e) {
	let t = 0;
	for (let n of e) n.repetition_type === "REPEATED" && t++;
	return t;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/splitstream.js
function it(e, t, n, r) {
	let i = t.length, a, o;
	if (n === "FLOAT") {
		let e = t instanceof Float32Array ? t : new Float32Array(at(t));
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 4;
	} else if (n === "DOUBLE") {
		let e = t instanceof Float64Array ? t : new Float64Array(at(t));
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 8;
	} else if (n === "INT32") {
		let e = t instanceof Int32Array ? t : new Int32Array(at(t));
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 4;
	} else if (n === "INT64") {
		let e = ot(t);
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 8;
	} else if (n === "FIXED_LEN_BYTE_ARRAY") {
		if (!r) throw Error("parquet byte_stream_split missing type_length");
		o = r, a = new Uint8Array(i * o);
		for (let e = 0; e < i; e++) a.set(t[e], e * o);
	} else throw Error(`parquet byte_stream_split unsupported type: ${n}`);
	for (let t = 0; t < o; t++) for (let n = 0; n < i; n++) e.appendUint8(a[n * o + t]);
}
function at(e) {
	if (Array.isArray(e) && e.every((e) => typeof e == "number")) return e;
	throw Error("Expected number array for BYTE_STREAM_SPLIT encoding");
}
function ot(e) {
	if (e instanceof BigInt64Array) return e;
	if (Array.isArray(e) && e.every((e) => typeof e == "bigint")) return new BigInt64Array(e);
	throw Error("Expected bigint array for BYTE_STREAM_SPLIT encoding");
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/datapage.js
function st({ writer: t, column: n, encoding: r, pageData: i }) {
	let { columnName: a, element: o, codec: s, compressors: c } = n, { type: l, type_length: u, repetition_type: d } = o;
	if (!l) throw Error(`column ${a} cannot determine type`);
	if (d === "REPEATED") throw Error(`column ${a} repeated types not supported`);
	let f = new e(), { definition_levels_byte_length: p, repetition_levels_byte_length: m, num_nulls: h, num_values: g, num_rows: _ } = lt(f, n, i), v = h ? i.values.filter((e) => e != null) : i.values, y = new e();
	if (r === "PLAIN") xe(y, v, l, u);
	else if (r === "RLE") {
		if (l !== "BOOLEAN") throw Error("RLE encoding only supported for BOOLEAN type");
		let t = new e();
		W(t, v, 1), y.appendUint32(t.offset), y.appendBytes(t.getBytes());
	} else if (r === "PLAIN_DICTIONARY" || r === "RLE_DICTIONARY") {
		let e = 0;
		for (let t of v) t > e && (e = t);
		let t = Math.ceil(Math.log2(e + 1));
		y.appendUint8(t), W(y, v, t);
	} else if (r === "DELTA_BINARY_PACKED") {
		if (l !== "INT32" && l !== "INT64") throw Error("DELTA_BINARY_PACKED encoding only supported for INT32 and INT64 types");
		U(y, v);
	} else if (r === "DELTA_LENGTH_BYTE_ARRAY") {
		if (l !== "BYTE_ARRAY") throw Error("DELTA_LENGTH_BYTE_ARRAY encoding only supported for BYTE_ARRAY type");
		ge(y, v);
	} else if (r === "DELTA_BYTE_ARRAY") {
		if (l !== "BYTE_ARRAY") throw Error("DELTA_BYTE_ARRAY encoding only supported for BYTE_ARRAY type");
		_e(y, v);
	} else if (r === "BYTE_STREAM_SPLIT") it(y, v, l, u);
	else throw Error(`parquet unsupported encoding: ${r}`);
	let b = y.getBytes(), x = c[s]?.(b) ?? b;
	ct(t, {
		type: "DATA_PAGE_V2",
		uncompressed_page_size: f.offset + y.offset,
		compressed_page_size: f.offset + x.length,
		data_page_header_v2: {
			num_values: g,
			num_nulls: h,
			num_rows: _,
			encoding: r,
			definition_levels_byte_length: p,
			repetition_levels_byte_length: m,
			is_compressed: !!s
		}
	}), t.appendBytes(f.getBytes()), t.appendBytes(x);
}
function ct(e, t) {
	O(e, {
		field_1: ce.indexOf(t.type),
		field_2: t.uncompressed_page_size,
		field_3: t.compressed_page_size,
		field_4: t.crc,
		field_5: t.data_page_header && {
			field_1: t.data_page_header.num_values,
			field_2: z.indexOf(t.data_page_header.encoding),
			field_3: z.indexOf(t.data_page_header.definition_level_encoding),
			field_4: z.indexOf(t.data_page_header.repetition_level_encoding)
		},
		field_7: t.dictionary_page_header && {
			field_1: t.dictionary_page_header.num_values,
			field_2: z.indexOf(t.dictionary_page_header.encoding)
		},
		field_8: t.data_page_header_v2 && {
			field_1: t.data_page_header_v2.num_values,
			field_2: t.data_page_header_v2.num_nulls,
			field_3: t.data_page_header_v2.num_rows,
			field_4: z.indexOf(t.data_page_header_v2.encoding),
			field_5: t.data_page_header_v2.definition_levels_byte_length,
			field_6: t.data_page_header_v2.repetition_levels_byte_length,
			field_7: t.data_page_header_v2.is_compressed ? void 0 : !1
		}
	});
}
function lt(e, t, n) {
	let { schemaPath: r } = t, { values: i, definitionLevels: a, repetitionLevels: o, maxDefinitionLevel: s } = n, c = a.length || i.length, l = 0, u = 0;
	if (o.length) for (let e = 0; e < o.length; e++) o[e] === 0 && u++;
	else u = i.length;
	if (a.length) for (let e = 0; e < a.length; e++) a[e] < s && l++;
	let d = rt(r), f = 0;
	d && (f = W(e, o, Math.ceil(Math.log2(d + 1))));
	let p = 0;
	return s && (p = W(e, a, Math.ceil(Math.log2(s + 1)))), {
		definition_levels_byte_length: p,
		repetition_levels_byte_length: f,
		num_values: c,
		num_nulls: l,
		num_rows: u
	};
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/dictionary.js
var ut = new TextEncoder();
function dt(e, t, n) {
	if (e == null) return 0;
	if (t === "BOOLEAN") return .125;
	if (t === "INT32" || t === "FLOAT") return 4;
	if (t === "INT64" || t === "DOUBLE") return 8;
	if (t === "INT96") return 12;
	if (t === "FIXED_LEN_BYTE_ARRAY") return n ?? 0;
	if (t === "BYTE_ARRAY") {
		if (e instanceof Uint8Array) return e.byteLength;
		if (typeof e == "string") return e.length;
	}
	return 0;
}
function ft(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e[n], t = Math.imul(t, 16777619);
	return t >>> 0;
}
function pt(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
var mt = .9;
function ht(e, t, n, r, i, a) {
	if (r && r !== "RLE_DICTIONARY" || t === "BOOLEAN") return {};
	let o = r === "RLE_DICTIONARY", s = t === "BYTE_ARRAY" ? 4 : 0;
	if (!o) {
		let r = Math.min(e.length, 1e3), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = 0, c = 0;
		for (let l = 0; l < r; l++) {
			let u = e[r === 1 ? 0 : Math.floor(l * (e.length - 1) / (r - 1))], d = u;
			u instanceof Uint8Array && (d = a.get(u), d === void 0 && (d = ft(u), a.set(u, d)));
			let f = i.get(d);
			f === void 0 && (f = dt(u, t, n) + (u == null ? 0 : s), i.set(d, f), o += f), c += f;
		}
		if (!c || o / c > mt) return {};
	}
	let c = [], l = Array(e.length), u = /* @__PURE__ */ new Map(), d = [], f = /* @__PURE__ */ new Map(), p = 0, m = 0, h = 0, g = 0;
	for (let r = 0; r < e.length; r++) {
		let s = e[r];
		if (s == null) {
			if (a) throw Error("parquet required value is undefined");
			continue;
		}
		g++;
		let _;
		if (s instanceof Uint8Array) {
			if (h += s.byteLength, _ = u.get(s), _ !== void 0) {
				l[r] = _;
				continue;
			}
			let e = ft(s), t = f.get(e);
			if (t) {
				for (let e of t) if (pt(c[e], s)) {
					_ = e;
					break;
				}
			}
			if (_ === void 0) {
				if (p += s.byteLength, !o && i && (m += s.byteLength, m > i)) return {};
				_ = c.length, c.push(s), t ? t.push(_) : f.set(e, [_]);
			}
			u.set(s, _);
		} else {
			_ = u.get(s);
			let e = _ === void 0 ? dt(s, t, n) : d[_];
			if (h += e, _ === void 0) {
				if (p += e, !o && i && (m += typeof s == "string" ? ut.encode(s).byteLength : e, m > i)) return {};
				_ = c.length, c.push(s), d[_] = e, u.set(s, _);
			}
		}
		l[r] = _;
	}
	let _ = Math.ceil(Math.log2(c.length)), v = Math.ceil(g * _ / 8), y = h + g * s, b = p + c.length * s;
	return !o && 2 * (b + v) > y ? {} : {
		dictionary: c,
		indexes: l
	};
}
function gt(t, n, r) {
	let { element: i, codec: a, compressors: o } = n, { type: s, type_length: c } = i;
	if (!s) throw Error(`column ${n.columnName} cannot determine type`);
	let l = new e();
	xe(l, r, s, c);
	let u = l.getBytes(), d = o[a]?.(u) ?? u;
	ct(t, {
		type: "DICTIONARY_PAGE",
		uncompressed_page_size: u.byteLength,
		compressed_page_size: d.byteLength,
		dictionary_page_header: {
			num_values: r.length,
			encoding: "PLAIN"
		}
	}), t.appendBytes(d);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/geospatial.js
function _t(e) {
	let t = /* @__PURE__ */ new Set(), n;
	for (let r of e) if (r != null) {
		if (typeof r != "object") throw Error("geospatial column expects GeoJSON geometries");
		n = vt(n, r), t.add(xt(r));
	}
	let r, { xmin: i, ymin: a, xmax: o, ymax: s } = n ?? {};
	if (i !== void 0 && a !== void 0 && o !== void 0 && s !== void 0 && (r = {
		...n,
		xmin: i,
		ymin: a,
		xmax: o,
		ymax: s
	}), t.size || r) return {
		bbox: r,
		geospatial_types: t.size ? Array.from(t).sort((e, t) => e - t) : []
	};
}
function vt(e, t) {
	if (t.type === "GeometryCollection") {
		for (let n of t.geometries || []) e = vt(e, n);
		return e;
	}
	return yt(e, t.coordinates);
}
function yt(e, t) {
	if (typeof t[0] == "number") return e = bt(e, "xmin", "xmax", t[0]), e = bt(e, "ymin", "ymax", t[1]), t.length > 2 && (e = bt(e, "zmin", "zmax", t[2])), t.length > 3 && (e = bt(e, "mmin", "mmax", t[3])), e;
	for (let n of t) e = yt(e, n);
	return e;
}
function bt(e, t, n, r) {
	if (r === void 0 || !Number.isFinite(r)) return e;
	e ||= {};
	let i = e[t], a = e[n];
	return (i === void 0 || r < i) && (e[t] = r), (a === void 0 || r > a) && (e[n] = r), e;
}
function xt(e) {
	let t = St[e.type];
	if (t === void 0) throw Error(`unknown geometry type: ${e.type}`);
	let n = Ct(e);
	if (n === 2) return t;
	if (n === 3) return t + 1e3;
	if (n === 4) return t + 3e3;
	throw Error(`unsupported geometry dimensions: ${n}`);
}
var St = {
	Point: 1,
	LineString: 2,
	Polygon: 3,
	MultiPoint: 4,
	MultiLineString: 5,
	MultiPolygon: 6,
	GeometryCollection: 7
};
function Ct(e) {
	if (e.type === "GeometryCollection") {
		let t = 0;
		for (let n of e.geometries || []) t = Math.max(t, Ct(n));
		return t || 2;
	}
	return wt(e.coordinates);
}
function wt(e) {
	if (!e.length) return 2;
	if (typeof e[0] == "number") return e.length;
	let t = 0;
	for (let n of e) t = Math.max(t, wt(n));
	return t || 2;
}
//#endregion
//#region node_modules/.pnpm/hyparquet@1.29.2/node_modules/hyparquet/src/utils.js
function Tt(e) {
	if (e === void 0) return null;
	if (typeof e == "bigint") return Number(e);
	if (Object.is(e, -0)) return 0;
	if (Array.isArray(e)) return e.map(Tt);
	if (e instanceof Uint8Array) return Array.from(e);
	if (e instanceof Date) return e.toISOString();
	if (e instanceof Object) {
		let t = {};
		for (let n of Object.keys(e)) e[n] !== void 0 && (t[n] = Tt(e[n]));
		return t;
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/wkb.js
function Et(t) {
	let n = new e();
	return X(n, t), n.getBytes();
}
function X(e, t) {
	if (typeof t != "object") throw Error("geometry values must be GeoJSON geometries");
	let n = kt(t.type), r = At(t), i = 0;
	if (r === 3) i = 1;
	else if (r === 4) i = 3;
	else if (r > 4) throw Error(`unsupported geometry dimensions: ${r}`);
	if (e.appendUint8(1), e.appendUint32(n + i * 1e3), t.type === "Point") Dt(e, t.coordinates, r);
	else if (t.type === "LineString") Ot(e, t.coordinates, r);
	else if (t.type === "Polygon") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) Ot(e, n, r);
	} else if (t.type === "MultiPoint") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) X(e, {
			type: "Point",
			coordinates: n
		});
	} else if (t.type === "MultiLineString") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) X(e, {
			type: "LineString",
			coordinates: n
		});
	} else if (t.type === "MultiPolygon") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) X(e, {
			type: "Polygon",
			coordinates: n
		});
	} else if (t.type === "GeometryCollection") {
		e.appendUint32(t.geometries.length);
		for (let n of t.geometries) X(e, n);
	} else throw Error("unsupported geometry type");
}
function Dt(e, t, n) {
	if (t.length < n) throw Error("geometry position dimensions mismatch");
	for (let r = 0; r < n; r++) e.appendFloat64(t[r]);
}
function Ot(e, t, n) {
	e.appendUint32(t.length);
	for (let r of t) Dt(e, r, n);
}
function kt(e) {
	if (e === "Point") return 1;
	if (e === "LineString") return 2;
	if (e === "Polygon") return 3;
	if (e === "MultiPoint") return 4;
	if (e === "MultiLineString") return 5;
	if (e === "MultiPolygon") return 6;
	if (e === "GeometryCollection") return 7;
	throw Error(`unknown geometry type: ${e}`);
}
function At(e) {
	if (e.type === "GeometryCollection") {
		let t = 0;
		for (let n of e.geometries) t = Math.max(t, At(n));
		return t || 2;
	}
	return jt(e.coordinates);
}
function jt(e) {
	if (!Array.isArray(e) || !e.length) return 2;
	if (typeof e[0] == "number") return e.length;
	let t = 0;
	for (let n of e) t = Math.max(t, jt(n));
	return t || 2;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/unconvert.js
var Mt = 864e5;
function Nt(e, t) {
	let n = /* @__PURE__ */ new Map();
	return Array.from(e, (e) => {
		if (n.has(e)) return n.get(e);
		let r = t(e);
		return n.set(e, r), r;
	});
}
function Pt(e, t) {
	let { type: n, converted_type: r, logical_type: i } = e;
	if (r === "DECIMAL") {
		let n = 10 ** (e.scale || 0);
		return Array.from(t, (t) => {
			if (t == null) return t;
			if (typeof t == "bigint") return Bt(e, t);
			if (typeof t != "number") throw Error("DECIMAL must be a number or bigint");
			return Bt(e, BigInt(Math.round(t * n)));
		});
	}
	if (r === "DATE") return Array.from(t).map((e) => e instanceof Date ? Math.floor(e.getTime() / Mt) : e);
	if (r === "TIMESTAMP_MILLIS") return Array.from(t).map((e) => e == null ? e : e instanceof Date ? BigInt(e.getTime()) : BigInt(e));
	if (r === "TIMESTAMP_MICROS") return Array.from(t).map((e) => e == null ? e : e instanceof Date ? BigInt(e.getTime() * 1e3) : BigInt(e));
	if (r === "JSON") {
		if (!Array.isArray(t)) throw Error("JSON must be an array");
		let e = new TextEncoder();
		return Nt(t, (t) => t == null ? t : e.encode(JSON.stringify(Tt(t))));
	}
	if (r === "UTF8") {
		if (!Array.isArray(t)) throw Error("strings must be an array");
		let e = new TextEncoder();
		return t.map((t) => typeof t == "string" ? e.encode(t) : t);
	}
	if (r === "UINT_32" || i?.type === "INTEGER" && i.bitWidth === 32 && !i.isSigned) return t instanceof Uint32Array ? t : t instanceof Int32Array ? new Uint32Array(t.buffer, t.byteOffset, t.length) : Array.from(t).map((e) => {
		if (e == null) return e;
		if (!Number.isSafeInteger(e)) throw Error("expected integer value, got " + e);
		if (e < 0 || e > 4294967295) throw Error("expected uint32 value, got " + e);
		return e > 2147483647 ? e - 4294967296 : e;
	});
	if (i?.type === "FLOAT16") {
		if (n !== "FIXED_LEN_BYTE_ARRAY") throw Error("FLOAT16 must be FIXED_LEN_BYTE_ARRAY type");
		if (e.type_length !== 2) throw Error("FLOAT16 expected type_length to be 2 bytes");
		return Array.from(t).map(Vt);
	}
	if (i?.type === "UUID") {
		if (!Array.isArray(t)) throw Error("UUID must be an array");
		if (n !== "FIXED_LEN_BYTE_ARRAY") throw Error("UUID must be FIXED_LEN_BYTE_ARRAY type");
		if (e.type_length !== 16) throw Error("UUID expected type_length to be 16 bytes");
		return t.map(Ft);
	}
	if (i?.type === "TIMESTAMP") return Array.from(t).map((e) => {
		if (e == null) return e;
		if (e instanceof Date) {
			let t = BigInt(e.getTime());
			return i.unit === "NANOS" ? t * 1000000n : i.unit === "MICROS" ? t * 1000n : t;
		}
		return BigInt(e);
	});
	if (i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY") {
		if (!Array.isArray(t)) throw Error("geometry must be an array");
		return Nt(t, (e) => e == null ? e : Et(e));
	}
	return t;
}
function Ft(e) {
	if (e != null) {
		if (e instanceof Uint8Array) return e;
		if (typeof e == "string") {
			if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(e)) throw Error("UUID must be a valid UUID string");
			e = e.replace(/-/g, "").toLowerCase();
			let t = /* @__PURE__ */ new Uint8Array(16);
			for (let n = 0; n < 16; n++) t[n] = parseInt(e.slice(n * 2, n * 2 + 2), 16);
			return t;
		}
		throw Error("UUID must be a string or Uint8Array");
	}
}
var It = 16;
function Lt(e, t) {
	if (e.length <= It) return e;
	let n = e.slice(0, It);
	if (!t) return n;
	let r = n.length - 1;
	for (; r >= 0 && n[r] === 255;) r--;
	if (r < 0) return;
	let i = n.slice(0, r + 1);
	return i[r] += 1, i;
}
function Rt(e, t) {
	if (e == null) return;
	let { type: n } = t;
	if ((n === "BYTE_ARRAY" || n === "FIXED_LEN_BYTE_ARRAY") && t.logical_type?.type !== "UUID" && t.converted_type !== "DECIMAL") return (e instanceof Uint8Array ? e : new TextEncoder().encode(e.toString())).length > It ? !1 : void 0;
}
function Z(e, t, n) {
	if (e == null) return;
	let { type: r, converted_type: i } = t;
	if (r === "BOOLEAN") return new Uint8Array([+!!e]);
	if (t.logical_type?.type === "UUID" && (typeof e == "string" || e instanceof Uint8Array)) return Ft(e);
	if (i === "DECIMAL") {
		if (typeof e != "number" && typeof e != "bigint") throw Error("DECIMAL must be a number or bigint");
		let n = 10 ** (t.scale || 0), r = Bt(t, typeof e == "bigint" ? e : BigInt(Math.round(e * n)));
		if (r instanceof Uint8Array) return r;
		if (typeof r == "number") {
			let e = /* @__PURE__ */ new ArrayBuffer(4);
			return new DataView(e).setFloat32(0, r, !0), new Uint8Array(e);
		}
		if (typeof r == "bigint") {
			let e = /* @__PURE__ */ new ArrayBuffer(8);
			return new DataView(e).setBigInt64(0, r, !0), new Uint8Array(e);
		}
	}
	if (r === "BYTE_ARRAY" || r === "FIXED_LEN_BYTE_ARRAY") return Lt(e instanceof Uint8Array ? e : new TextEncoder().encode(e.toString()), n);
	if (r === "FLOAT" && typeof e == "number") {
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setFloat32(0, e, !0), new Uint8Array(t);
	}
	if (r === "DOUBLE" && typeof e == "number") {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setFloat64(0, e, !0), new Uint8Array(t);
	}
	if (r === "INT32" && typeof e == "number") {
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, e, !0), new Uint8Array(t);
	}
	if (r === "INT64" && typeof e == "bigint") {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setBigInt64(0, e, !0), new Uint8Array(t);
	}
	if (r === "INT32" && i === "DATE" && e instanceof Date) {
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, Math.floor(e.getTime() / Mt), !0), new Uint8Array(t);
	}
	if (r === "INT64" && i === "TIMESTAMP_MILLIS" && e instanceof Date) {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setBigInt64(0, BigInt(e.getTime()), !0), new Uint8Array(t);
	}
	if (r === "INT64" && i === "TIMESTAMP_MICROS" && e instanceof Date) {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setBigInt64(0, BigInt(e.getTime() * 1e3), !0), new Uint8Array(t);
	}
	if (r === "INT64" && t.logical_type?.type === "TIMESTAMP" && e instanceof Date) {
		let n = BigInt(e.getTime()), { unit: r } = t.logical_type, i = n;
		r === "NANOS" ? i = n * 1000000n : r === "MICROS" && (i = n * 1000n);
		let a = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(a).setBigInt64(0, i, !0), new Uint8Array(a);
	}
	throw Error(`unsupported type for statistics: ${r} with value ${e}`);
}
function zt(e, t) {
	return {
		field_1: Z(e.max, t, !0),
		field_2: Z(e.min, t, !1),
		field_3: e.null_count,
		field_4: e.distinct_count,
		field_5: Z(e.max_value, t, !0),
		field_6: Z(e.min_value, t, !1),
		field_7: e.is_max_value_exact ?? Rt(e.max_value ?? e.max, t),
		field_8: e.is_min_value_exact ?? Rt(e.min_value ?? e.min, t)
	};
}
function Bt({ type: e, type_length: t }, n) {
	if (e === "INT32") return Number(n);
	if (e === "INT64") return n;
	if (e === "FIXED_LEN_BYTE_ARRAY" && !t) throw Error("fixed length byte array type_length is required");
	if (!t && !n) return /* @__PURE__ */ new Uint8Array();
	let r = [];
	for (;;) {
		let e = Number(n & 255n);
		if (r.unshift(e), n >>= 8n, t) {
			if (r.length >= t) break;
		} else {
			let t = e & 128;
			if (!t && n === 0n || t && n === -1n) break;
		}
	}
	return new Uint8Array(r);
}
function Vt(e) {
	if (e == null) return;
	if (typeof e != "number") throw Error("parquet float16 expected number value");
	if (Number.isNaN(e)) return new Uint8Array([0, 126]);
	let t = e < 0 || Object.is(e, -0) ? 1 : 0, n = Math.abs(e);
	if (!isFinite(n)) return new Uint8Array([0, t << 7 | 124]);
	if (n === 0) return new Uint8Array([0, t << 7]);
	let r = /* @__PURE__ */ new ArrayBuffer(4);
	new Float32Array(r)[0] = n;
	let i = new Uint32Array(r)[0], a = i >>> 23 & 255, o = i & 8388607;
	if (a -= 127, a < -14) {
		let e = -14 - a;
		o = (o | 8388608) >> e + 13, o & 1 && (o += 1);
		let n = t << 15 | o;
		return new Uint8Array([n & 255, n >> 8]);
	}
	if (a > 15) return new Uint8Array([0, t << 7 | 124]);
	let s = a + 15;
	if (o += 4096, o & 8388608 && (o = 0, ++s === 31)) return new Uint8Array([0, t << 7 | 124]);
	let c = t << 15 | s << 10 | o >> 13;
	return new Uint8Array([c & 255, c >> 8]);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/column.js
function Ht({ writer: e, column: t, pageData: n }) {
	let { columnName: r, element: i, schemaPath: a, stats: o, pageSize: s, dictionarySize: c, encoding: l } = t, { type: u, type_length: d } = i;
	if (!u) throw Error(`column ${r} cannot determine type`);
	let { values: f, definitionLevels: p, repetitionLevels: m, maxDefinitionLevel: h } = n, g = e.offset, _ = [], v = i?.logical_type?.type === "GEOMETRY" || i?.logical_type?.type === "GEOGRAPHY", y = o ? Wt(f, i) : void 0, b = o && v ? _t(f) : void 0, x;
	if (t.bloomFilter) {
		let e = new ne(i, typeof t.bloomFilter == "object" ? t.bloomFilter : void 0);
		for (let t of f) e.insert(t);
		x = e.finalize();
	}
	let S, C = i.converted_type !== "UTF8", w = C ? Pt(i, f) : f, { dictionary: T, indexes: E } = ht(w, u, d, l, c, h === 0), D, O, k = u;
	T && E ? (O = E, k = "INT32", D = "RLE_DICTIONARY", S = BigInt(e.offset), gt(e, t, C ? T : Pt(i, T))) : (O = C ? w : Pt(i, f), D = l && l !== "RLE_DICTIONARY" ? l : u === "BOOLEAN" && f.length > 16 ? "RLE" : "PLAIN"), _.push(D);
	let A = Ut(O, k, d, s), j = t.columnIndex && A.length > 1 ? {
		null_pages: [],
		min_values: [],
		max_values: [],
		boundary_order: "UNORDERED",
		null_counts: []
	} : void 0, M = t.offsetIndex && A.length > 1 ? { page_locations: [] } : void 0, ee = BigInt(e.offset), N = 0n, te = 0, P, F, I = !0, L = !0;
	for (let { start: n, end: r } of A) {
		let a = e.offset, o = {
			values: O.slice(n, r),
			definitionLevels: p.slice(n, r),
			repetitionLevels: m.slice(n, r),
			maxDefinitionLevel: h
		};
		if (st({
			writer: e,
			column: t,
			encoding: D,
			pageData: o
		}), j) {
			let { min_value: e, max_value: t, null_count: a = 0n } = Wt(f.slice(n, r), i);
			if (j.null_pages.push(a === BigInt(r - n)), j.min_values.push(Z(e, i, !1) ?? /* @__PURE__ */ new Uint8Array()), j.max_values.push(Z(t, i, !0) ?? /* @__PURE__ */ new Uint8Array()), j.null_counts?.push(a), P !== void 0 && e !== void 0) {
				let t = Gt(P, e);
				t > 0 && (I = !1), t < 0 && (L = !1);
			}
			if (F !== void 0 && t !== void 0) {
				let e = Gt(F, t);
				e > 0 && (I = !1), e < 0 && (L = !1);
			}
			P = e, F = t;
		}
		if (M) {
			if (m.length) for (let e = te + 1; e <= n; e++) m[e] === 0 && N++;
			else N = BigInt(n);
			M.page_locations.push({
				offset: BigInt(a),
				compressed_page_size: e.offset - a,
				first_row_index: N
			});
		}
		te = n;
	}
	j && (I ? j.boundary_order = "ASCENDING" : L && (j.boundary_order = "DESCENDING"));
	let R;
	return o && (R = [], S !== void 0 && R.push({
		page_type: "DICTIONARY_PAGE",
		encoding: "PLAIN",
		count: 1
	}), R.push({
		page_type: "DATA_PAGE_V2",
		encoding: D,
		count: A.length
	})), {
		chunk: {
			meta_data: {
				type: u,
				encodings: _,
				path_in_schema: a.slice(1).map((e) => e.name),
				codec: t.codec ?? "UNCOMPRESSED",
				num_values: BigInt(f.length),
				total_compressed_size: BigInt(e.offset - g),
				total_uncompressed_size: BigInt(e.offset - g),
				data_page_offset: ee,
				dictionary_page_offset: S,
				statistics: y,
				encoding_stats: R,
				geospatial_statistics: b
			},
			file_offset: BigInt(g)
		},
		columnIndex: j,
		offsetIndex: M,
		bloomFilter: x
	};
}
function Ut(e, t, n, r) {
	if (!r) return [{
		start: 0,
		end: e.length
	}];
	let i = [], a = 0, o = 0;
	for (let s = 0; s < e.length; s++) {
		let c = dt(e[s], t, n);
		o += c, o >= r && s > a && (i.push({
			start: a,
			end: s
		}), a = s, o = c);
	}
	return a < e.length && i.push({
		start: a,
		end: e.length
	}), i;
}
function Wt(e, t) {
	let n, r, i = 0n;
	for (let a of e) {
		if (a == null) {
			i++;
			continue;
		}
		if (typeof a == "object" && !(a instanceof Uint8Array) || typeof a == "number" && Number.isNaN(a)) continue;
		let e = t.converted_type === "DECIMAL" && typeof a == "number" ? BigInt(Math.round(a * 10 ** (t.scale || 0))) : a;
		(n === void 0 || Gt(e, n) < 0) && (n = e), (r === void 0 || Gt(e, r) > 0) && (r = e);
	}
	return n === 0 && (n = -0), r === 0 && (r = 0), {
		min_value: n,
		max_value: r,
		null_count: i
	};
}
function Gt(e, t) {
	if (e instanceof Uint8Array && t instanceof Uint8Array) {
		let n = Math.min(e.length, t.length);
		for (let r = 0; r < n; r += 1) if (e[r] !== t[r]) return e[r] - t[r];
		return e.length - t.length;
	}
	return e < t ? -1 : +(e > t);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/dremel.js
function Kt(e, t) {
	let n = e.map((e) => e.element);
	if (e.length < 2) throw Error("parquet schema path must include column");
	let o = [], s = [], c = r(e);
	if (e.length === 2 && c === 0) return {
		values: t,
		definitionLevels: o,
		repetitionLevels: s,
		maxDefinitionLevel: c
	};
	if (e.length === 2 && c === 1) {
		let e = Array(t.length);
		for (let n = 0; n < t.length; n++) e[n] = t[n] === null || t[n] === void 0 ? 0 : 1;
		return {
			values: t,
			definitionLevels: e,
			repetitionLevels: s,
			maxDefinitionLevel: c
		};
	}
	let l = Array(e.length), u = 0;
	for (let t = 0; t < e.length; t++) l[t] = u, n[t].repetition_type === "REPEATED" && u++;
	let d = [];
	for (let e of t) f(1, e, 0, 0, !1);
	return {
		values: d,
		definitionLevels: o,
		repetitionLevels: s,
		maxDefinitionLevel: c
	};
	function f(t, r, c, u, m) {
		let h = n[t], g = h.repetition_type || "REQUIRED";
		if (t === e.length - 1) {
			if (r == null) {
				if (g === "REQUIRED" && !m) throw Error("parquet required value is undefined");
				o.push(c);
			} else o.push(g === "REQUIRED" ? c : c + 1);
			s.push(u), d.push(r);
			return;
		}
		if (g === "REPEATED") {
			if (r == null) {
				if (!m) throw Error("parquet required value is undefined");
				f(t + 1, void 0, c, u, !0);
				return;
			}
			if (!Array.isArray(r)) throw Error(`parquet repeated field ${h.name} must be an array`);
			if (!r.length) {
				f(t + 1, void 0, c, u, !0);
				return;
			}
			let i = a(e[t - 1]), o = n[t + 1];
			for (let e = 0; e < r.length; e++) {
				let n = r[e];
				i && n && typeof n == "object" && o && (n = n[o.name]);
				let a = e === 0 ? u : l[t] + 1;
				f(t + 1, n, c + 1, a, !1);
			}
			return;
		}
		if (g === "OPTIONAL") {
			if (r == null) f(t + 1, void 0, c, u, !0);
			else {
				let n = p(t, r), o = n == null, s = i(e[t]) || a(e[t]), l = h.num_children && !h.type && !s || !o ? c + 1 : c;
				f(t + 1, n, l, u, o);
			}
			return;
		}
		if (r == null) {
			if (!m) throw Error("parquet required value is undefined");
			f(t + 1, void 0, c, u, !0);
		} else f(t + 1, p(t, r), c, u, !1);
	}
	function p(t, r) {
		if (r == null) return;
		let o = n[t + 1];
		if (o) {
			if (i(e[t])) return r;
			if (a(e[t])) return qt(r, n[t]);
			if (typeof r == "object" && !Array.isArray(r)) return r[o.name];
			throw Error(`parquet expected struct, got ${r}`);
		}
	}
}
function qt(e, t) {
	if (e instanceof Map) return Array.from(e.entries(), ([e, t]) => ({
		key: e,
		value: t
	}));
	if (Array.isArray(e)) return e.map((e) => {
		if (e && typeof e == "object" && "key" in e && "value" in e) return e;
		if (Array.isArray(e) && e.length === 2) return {
			key: e[0],
			value: e[1]
		};
		throw Error("parquet map entry must provide key and value");
	});
	if (typeof e == "object") return Object.entries(e).map(([e, t]) => ({
		key: e,
		value: t
	}));
	throw Error(`parquet map field ${t.name} must be Map, array, or object`);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/indexes.js
function Jt(e, t) {
	for (let { chunk: n, columnIndex: r } of t) Yt(e, n, r);
	for (let { chunk: n, offsetIndex: r } of t) Xt(e, n, r);
}
function Yt(e, t, n) {
	if (!n || n.min_values.length <= 1) return;
	let r = e.offset;
	O(e, {
		field_1: n.null_pages,
		field_2: n.min_values,
		field_3: n.max_values,
		field_4: le.indexOf(n.boundary_order),
		field_5: n.null_counts
	}), t.column_index_offset = BigInt(r), t.column_index_length = e.offset - r;
}
function Xt(e, t, n) {
	if (!n || n.page_locations.length <= 1) return;
	let r = e.offset;
	O(e, { field_1: n.page_locations.map((e) => ({
		field_1: e.offset,
		field_2: e.compressed_page_size,
		field_3: e.first_row_index
	})) }), t.offset_index_offset = BigInt(r), t.offset_index_length = e.offset - r;
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/metadata.js
function Zt(e, t) {
	let n = {
		field_1: t.version,
		field_2: t.schema.map((e) => ({
			field_1: e.type && ie.indexOf(e.type),
			field_2: e.type_length,
			field_3: e.repetition_type && ae.indexOf(e.repetition_type),
			field_4: e.name,
			field_5: e.num_children,
			field_6: e.converted_type && oe.indexOf(e.converted_type),
			field_7: e.scale,
			field_8: e.precision,
			field_9: e.field_id,
			field_10: en(e.logical_type)
		})),
		field_3: t.num_rows,
		field_4: t.row_groups.map((e) => ({
			field_1: e.columns.map((e) => ({
				field_1: e.file_path,
				field_2: e.file_offset,
				field_3: e.meta_data && {
					field_1: ie.indexOf(e.meta_data.type),
					field_2: e.meta_data.encodings.map((e) => z.indexOf(e)),
					field_3: e.meta_data.path_in_schema,
					field_4: se.indexOf(e.meta_data.codec),
					field_5: e.meta_data.num_values,
					field_6: e.meta_data.total_uncompressed_size,
					field_7: e.meta_data.total_compressed_size,
					field_8: e.meta_data.key_value_metadata && e.meta_data.key_value_metadata.map((e) => ({
						field_1: e.key,
						field_2: e.value
					})),
					field_9: e.meta_data.data_page_offset,
					field_10: e.meta_data.index_page_offset,
					field_11: e.meta_data.dictionary_page_offset,
					field_12: e.meta_data.statistics && zt(e.meta_data.statistics, $t(t.schema, e.meta_data.path_in_schema)),
					field_13: e.meta_data.encoding_stats && e.meta_data.encoding_stats.map((e) => ({
						field_1: ce.indexOf(e.page_type),
						field_2: z.indexOf(e.encoding),
						field_3: e.count
					})),
					field_14: e.meta_data.bloom_filter_offset,
					field_15: e.meta_data.bloom_filter_length,
					field_16: e.meta_data.size_statistics && {
						field_1: e.meta_data.size_statistics.unencoded_byte_array_data_bytes,
						field_2: e.meta_data.size_statistics.repetition_level_histogram,
						field_3: e.meta_data.size_statistics.definition_level_histogram
					},
					field_17: e.meta_data.geospatial_statistics && {
						field_1: e.meta_data.geospatial_statistics.bbox && Qt(e.meta_data.geospatial_statistics.bbox),
						field_2: e.meta_data.geospatial_statistics.geospatial_types
					}
				},
				field_4: e.offset_index_offset,
				field_5: e.offset_index_length,
				field_6: e.column_index_offset,
				field_7: e.column_index_length,
				field_9: e.encrypted_column_metadata
			})),
			field_2: e.total_byte_size,
			field_3: e.num_rows,
			field_4: e.sorting_columns && e.sorting_columns.map((e) => ({
				field_1: e.column_idx,
				field_2: e.descending,
				field_3: e.nulls_first
			})),
			field_5: e.file_offset,
			field_6: e.total_compressed_size
		})),
		field_5: t.key_value_metadata && t.key_value_metadata.map((e) => ({
			field_1: e.key,
			field_2: e.value
		})),
		field_6: t.created_by
	}, r = e.offset;
	O(e, n);
	let i = e.offset - r;
	e.appendUint32(i);
}
function Qt(e) {
	return new D([
		[
			1,
			7,
			e.xmin
		],
		[
			2,
			7,
			e.xmax
		],
		[
			3,
			7,
			e.ymin
		],
		[
			4,
			7,
			e.ymax
		],
		[
			5,
			7,
			e.zmin
		],
		[
			6,
			7,
			e.zmax
		],
		[
			7,
			7,
			e.mmin
		],
		[
			8,
			7,
			e.mmax
		]
	]);
}
function $t(e, t) {
	let r = n(e, t);
	return r[r.length - 1].element;
}
function en(e) {
	if (e) {
		if (e.type === "STRING") return { field_1: {} };
		if (e.type === "MAP") return { field_2: {} };
		if (e.type === "LIST") return { field_3: {} };
		if (e.type === "ENUM") return { field_4: {} };
		if (e.type === "DECIMAL") return { field_5: {
			field_1: e.scale,
			field_2: e.precision
		} };
		if (e.type === "DATE") return { field_6: {} };
		if (e.type === "TIME") return { field_7: {
			field_1: e.isAdjustedToUTC,
			field_2: tn(e.unit)
		} };
		if (e.type === "TIMESTAMP") return { field_8: {
			field_1: e.isAdjustedToUTC,
			field_2: tn(e.unit)
		} };
		if (e.type === "INTEGER") return { field_10: {
			field_1: e.bitWidth,
			field_2: e.isSigned
		} };
		if (e.type === "NULL") return { field_11: {} };
		if (e.type === "JSON") return { field_12: {} };
		if (e.type === "BSON") return { field_13: {} };
		if (e.type === "UUID") return { field_14: {} };
		if (e.type === "FLOAT16") return { field_15: {} };
		if (e.type === "VARIANT") return { field_16: {} };
		if (e.type === "GEOMETRY") return { field_17: { field_1: e.crs } };
		if (e.type === "GEOGRAPHY") return { field_18: {
			field_1: e.crs,
			field_2: e.algorithm && ue.indexOf(e.algorithm)
		} };
	}
}
function tn(e) {
	return e === "NANOS" ? { field_3: {} } : e === "MICROS" ? { field_2: {} } : { field_1: {} };
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/snappy.js
var nn = 65536, rn = 14, an = Array(15);
function on(t) {
	let n = new e();
	n.appendVarInt(t.length);
	let r = 0;
	for (; r < t.length;) {
		let e = Math.min(t.length - r, nn);
		dn(n, t, r, e), r += e;
	}
	return n.getBytes();
}
function Q(e, t) {
	return e * 506832829 >>> t;
}
function $(e, t) {
	return e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
}
function sn(e, t, n) {
	return e[t] === e[n] && e[t + 1] === e[n + 1] && e[t + 2] === e[n + 2] && e[t + 3] === e[n + 3];
}
function cn(e, t, n, r) {
	r <= 60 ? e.appendUint8(r - 1 << 2) : r < 256 ? (e.appendUint8(240), e.appendUint8(r - 1)) : (e.appendUint8(244), e.appendUint8(r - 1 & 255), e.appendUint8(r - 1 >>> 8)), e.appendBytes(t.subarray(n, n + r));
}
function ln(e, t, n) {
	n < 12 && t < 2048 ? (e.appendUint8(1 + (n - 4 << 2) + (t >>> 8 << 5)), e.appendUint8(t & 255)) : (e.appendUint8(2 + (n - 1 << 2)), e.appendUint8(t & 255), e.appendUint8(t >>> 8));
}
function un(e, t, n) {
	for (; n >= 68;) ln(e, t, 64), n -= 64;
	n > 64 && (ln(e, t, 60), n -= 60), ln(e, t, n);
}
function dn(e, t, n, r) {
	let i = 1;
	for (; 1 << i <= r && i <= rn;) i++;
	i--;
	let a = 32 - i;
	an[i] ??= new Uint16Array(1 << i);
	let o = an[i];
	o.fill(0);
	let s = n + r, c, l = n, u = n, d, f, p, m, h, g, _, v, y, b, x, S = !0;
	if (r >= 15) for (c = s - 15, n++, f = Q($(t, n), a); S;) {
		h = 32, p = n;
		do {
			if (n = p, d = f, g = h >>> 5, h++, p = n + g, n > c) {
				S = !1;
				break;
			}
			f = Q($(t, p), a), m = l + o[d], o[d] = n - l;
		} while (!sn(t, n, m));
		if (!S) break;
		cn(e, t, u, n - u);
		do {
			for (_ = n, v = 4; n + v < s && t[n + v] === t[m + v];) v++;
			if (n += v, y = _ - m, un(e, y, v), u = n, n >= c) {
				S = !1;
				break;
			}
			b = Q($(t, n - 1), a), o[b] = n - 1 - l, x = Q($(t, n), a), m = l + o[x], o[x] = n - l;
		} while (sn(t, n, m));
		if (!S) break;
		n++, f = Q($(t, n), a);
	}
	u < s && cn(e, t, u, s - u);
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/parquet-writer.js
var fn = class {
	constructor({ writer: e, schema: t, codec: n = "SNAPPY", compressors: r, statistics: i = !0, kvMetadata: a }) {
		this.writer = e, this.schema = t, this.codec = n, this.compressors = {
			SNAPPY: on,
			...r
		}, this.statistics = i, this.kvMetadata = a, this.row_groups = [], this.num_rows = 0n, this.pendingIndexes = [], this.writer.appendUint32(827474256);
	}
	write({ columnData: e, rowGroupSize: t = [1e3, 1e5], pageSize: r = 1048576, dictionarySize: i }) {
		let a = e[0]?.data?.length || 0, o;
		for (let { groupStartIndex: s, groupSize: c } of mn({
			columnDataRows: a,
			rowGroupSize: t
		})) {
			let t = () => {
				let t = this.writer.offset, o = [];
				for (let t = 0; t < e.length; t++) {
					let { name: l, data: u, encoding: d, codec: f = this.codec, columnIndex: p = !1, offsetIndex: m = !0, shredding: h, bloomFilter: g } = e[t];
					if (p && !m) throw Error("parquet ColumnIndex cannot be present without OffsetIndex");
					if (u.length !== a) throw Error("parquet columns must have the same length");
					let _ = u.slice(s, s + c), v = n(this.schema, [l]), y = hn(v), b = v.at(-1)?.element, x = h && h !== !0 ? h : void 0, S = b?.logical_type?.type === "VARIANT", C = b?.repetition_type === "REQUIRED", w = S ? Ie(Array.from(_), x, {
						name: l,
						required: C
					}) : _;
					for (let e of y) {
						let t = e.map((e) => e.element), n = {
							columnName: t.slice(1).map((e) => e.name).join("."),
							element: t[t.length - 1],
							schemaPath: t,
							codec: f,
							compressors: this.compressors,
							stats: this.statistics,
							pageSize: r,
							dictionarySize: i,
							columnIndex: p,
							offsetIndex: m,
							encoding: d,
							bloomFilter: g
						}, a = Kt(e, w), s = Ht({
							writer: this.writer,
							column: n,
							pageData: a
						});
						o.push(s.chunk), this.pendingIndexes.push(s);
					}
				}
				return this.num_rows += BigInt(c), this.row_groups.push({
					columns: o,
					total_byte_size: BigInt(this.writer.offset - t),
					num_rows: BigInt(c)
				}), this.writer.flush?.();
			};
			if (o) o = o.then(t);
			else {
				let e = t();
				e && (o = Promise.resolve(e));
			}
		}
		return o;
	}
	finish() {
		Jt(this.writer, this.pendingIndexes), re(this.writer, this.pendingIndexes);
		let e = {
			version: 2,
			created_by: "hyparquet",
			schema: this.schema,
			num_rows: this.num_rows,
			row_groups: this.row_groups,
			metadata_length: 0,
			key_value_metadata: this.kvMetadata
		};
		return delete e.metadata_length, Zt(this.writer, e), this.writer.appendUint32(827474256), this.writer.finish();
	}
};
function pn(e, t) {
	return Array.isArray(e) ? e[Math.min(t, e.length - 1)] : e;
}
function mn({ columnDataRows: e, rowGroupSize: t }) {
	if (Array.isArray(t) && !t.length) throw Error("rowGroupSize array cannot be empty");
	let n = [], r = 0, i = 0;
	for (; i < e;) {
		let a = pn(t, r);
		n.push({
			groupStartIndex: i,
			groupSize: Math.min(a, e - i)
		}), i += a, r++;
	}
	return n;
}
function hn(e) {
	let t = [];
	return n(e), t;
	function n(e) {
		let r = e[e.length - 1];
		if (!r.children.length) {
			t.push(e);
			return;
		}
		for (let t of r.children) n([...e, t]);
	}
}
//#endregion
//#region node_modules/.pnpm/hyparquet-writer@0.16.8/node_modules/hyparquet-writer/src/write.js
function gn({ writer: e, columnData: t, schema: n, codec: r = "SNAPPY", compressors: i, statistics: a = !0, rowGroupSize: o = [1e3, 1e5], kvMetadata: s, pageSize: c = 1048576, dictionarySize: l }) {
	if (t = t.map((e) => {
		if (e.shredding === !0 && e.type === "VARIANT") {
			let t = He(Array.from(e.data));
			return t ? {
				...e,
				shredding: t
			} : {
				...e,
				shredding: void 0
			};
		}
		if (e.shredding !== void 0 && e.shredding !== !0 && e.type === "VARIANT") {
			let t = G(e.shredding);
			return t ? {
				...e,
				shredding: t
			} : {
				...e,
				shredding: void 0
			};
		}
		return e;
	}), !n) n = Qe({ columnData: t });
	else if (t.some(({ type: e }) => e)) throw Error("cannot provide both schema and columnData type");
	let u = new fn({
		writer: e,
		schema: n,
		codec: r,
		compressors: i,
		statistics: a,
		kvMetadata: s
	}), d = u.write({
		columnData: t,
		rowGroupSize: o,
		pageSize: c,
		dictionarySize: l
	});
	return d ? d.then(() => u.finish()) : u.finish();
}
function _n(t) {
	let n = new e();
	return gn({
		...t,
		writer: n
	}), n.getBuffer();
}
//#endregion
export { _n as parquetWriteBuffer };
