// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/bytewriter.js
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
}, t = 18446744073709551615n, n = 11400714785074694791n, r = 14029467366897019727n, i = 1609587929392839161n, a = 9650029242287828579n, o = 2870177450012600261n;
function s(e, n) {
	return (e << n | e >> 64n - n) & t;
}
function c(e, i) {
	return e = e + i * r & t, e = s(e, 31n), e * n & t;
}
function l(e, r) {
	return e ^= c(0n, r), e * n + a & t;
}
function u(e, u = 0n) {
	let d = new DataView(e.buffer, e.byteOffset, e.byteLength), f = e.byteLength, p = 0, m;
	if (f >= 32) {
		let e = u + n + r & t, i = u + r & t, a = u, o = u - n & t;
		for (; p + 32 <= f;) e = c(e, d.getBigUint64(p, !0)), p += 8, i = c(i, d.getBigUint64(p, !0)), p += 8, a = c(a, d.getBigUint64(p, !0)), p += 8, o = c(o, d.getBigUint64(p, !0)), p += 8;
		m = s(e, 1n) + s(i, 7n) + s(a, 12n) + s(o, 18n) & t, m = l(m, e), m = l(m, i), m = l(m, a), m = l(m, o);
	} else m = u + o & t;
	for (m = m + BigInt(f) & t; p + 8 <= f;) m ^= c(0n, d.getBigUint64(p, !0)), m = s(m, 27n) * n + a & t, p += 8;
	for (p + 4 <= f && (m ^= BigInt(d.getUint32(p, !0)) * n & t, m = s(m, 23n) * r + i & t, p += 4); p < f;) m ^= BigInt(d.getUint8(p)) * o & t, m = s(m, 11n) * n & t, p += 1;
	return m ^= m >> 33n, m = m * r & t, m ^= m >> 29n, m = m * i & t, m ^= m >> 32n, m;
}
// node_modules/.pnpm/hyparquet@1.31.5/node_modules/hyparquet/src/bloom.js
var d = new TextEncoder();
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
function f(e, t) {
	if (e == null) return;
	let { type: n, converted_type: r, logical_type: i } = t;
	if (n === "BOOLEAN") return typeof e == "boolean" ? u(new Uint8Array([+!!e])) : void 0;
	if (n === "FLOAT") {
		if (typeof e != "number") return;
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setFloat32(0, e, !0), u(new Uint8Array(t));
	}
	if (n === "DOUBLE") {
		if (typeof e != "number") return;
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setFloat64(0, e, !0), u(new Uint8Array(t));
	}
	if (n === "INT32") {
		if (r === "DATE" || r === "DECIMAL" || r === "TIME_MILLIS" || i?.type === "DATE" || i?.type === "TIME" || i?.type === "DECIMAL" || typeof e != "number" || !Number.isInteger(e)) return;
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, e | 0, !0), u(new Uint8Array(t));
	}
	if (n === "INT64") {
		if (r === "TIMESTAMP_MILLIS" || r === "TIMESTAMP_MICROS" || r === "TIME_MICROS" || r === "DECIMAL" || i?.type === "TIMESTAMP" || i?.type === "TIME" || i?.type === "DECIMAL") return;
		let t;
		if (typeof e == "bigint") t = e;
		else if (typeof e == "number" && Number.isSafeInteger(e)) t = BigInt(e);
		else return;
		let n = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(n).setBigUint64(0, BigInt.asUintN(64, t), !0), u(new Uint8Array(n));
	}
	if (n === "BYTE_ARRAY") return r === "JSON" || r === "BSON" || r === "DECIMAL" || i?.type === "JSON" || i?.type === "BSON" || i?.type === "VARIANT" || i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY" ? void 0 : typeof e == "string" ? u(d.encode(e)) : e instanceof Uint8Array ? u(e) : void 0;
	if (n === "FIXED_LEN_BYTE_ARRAY") return r === "DECIMAL" || r === "INTERVAL" || i?.type === "DECIMAL" || i?.type === "UUID" || i?.type === "FLOAT16" || i?.type === "GEOMETRY" || i?.type === "GEOGRAPHY" ? void 0 : e instanceof Uint8Array ? u(e) : void 0;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/thrift.js
var p = 0, m = 1, h = 2, g = 3, _ = 5, v = 6, y = 8, b = 9, x = 12, S = class {
	constructor(e) {
		this.fields = e;
	}
};
function C(e, t) {
	w(e, x, t);
}
function w(e, t, n) {
	if (t !== m && t !== h) {
		if (t === g && typeof n == "number") e.appendUint8(n);
		else if (t === _ && typeof n == "number") e.appendZigZag(n);
		else if (t === v && typeof n == "bigint") e.appendZigZag(n);
		else if (t === 7 && typeof n == "number") e.appendFloat64(n);
		else if (t === y && typeof n == "string") {
			let t = new TextEncoder().encode(n);
			e.appendVarInt(t.length), e.appendBytes(t);
		} else if (t === y && n instanceof Uint8Array) e.appendVarInt(n.byteLength), e.appendBytes(n);
		else if (t === b && Array.isArray(n)) {
			let t = E(n);
			if (n.length > 14 ? (e.appendUint8(240 | t), e.appendVarInt(n.length)) : e.appendUint8(n.length << 4 | t), t === h) for (let t of n) e.appendUint8(+!!t);
			else for (let r of n) w(e, t, r);
		} else if (t === x && n instanceof S) {
			let t = 0;
			for (let [r, i, a] of n.fields) a !== void 0 && (t = T(e, t, r, i, a));
			e.appendUint8(p);
		} else if (t === x && typeof n == "object") {
			let t = 0;
			for (let [r, i] of Object.entries(n)) {
				if (i === void 0) continue;
				let n = parseInt(r.replace(/^field_/, ""), 10);
				if (Number.isNaN(n)) throw Error(`thrift invalid field name: ${r}. Expected "field_###"`);
				let a = ee(i);
				t = T(e, t, n, a, i);
			}
			e.appendUint8(p);
		} else throw Error(`thrift invalid type ${t} for value ${n}`);
	}
}
function T(e, t, n, r, i) {
	let a = n - t;
	if (a <= 0) throw Error(`thrift non-monotonic field id: fid=${n}, lastFid=${t}`);
	return a > 15 ? (e.appendUint8(r), e.appendZigZag(n)) : e.appendUint8(a << 4 | r), w(e, r, i), n;
}
function ee(e) {
	if (e === !0) return m;
	if (e === !1) return h;
	if (Number.isInteger(e)) return _;
	if (typeof e == "number") return 7;
	if (typeof e == "bigint") return v;
	if (typeof e == "string" || e instanceof Uint8Array) return y;
	if (Array.isArray(e)) return b;
	if (e && typeof e == "object") return x;
	throw Error(`Cannot determine thrift compact type for: ${e}`);
}
function E(e) {
	let t = 0;
	for (let n of e) {
		let e = ee(n);
		if (e === m && (e = h), t ||= e, t === 7 && e === _ && (e = 7), t === _ && e === 7 && (t = 7), e !== t) throw Error(`thrift invalid type for list element: ${n} (expected type ${t})`);
	}
	return t ?? g;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/bloom.js
var te = new Uint32Array([
	1203114875,
	1150766481,
	2284105051,
	2729912477,
	1884591559,
	770785867,
	2667333959,
	1550580529
]), D = 32, O = 134217728;
function ne(e, t) {
	return Number((e >> 32n) * BigInt(t) >> 32n);
}
function k(e) {
	let t = /* @__PURE__ */ new Uint32Array(8), n = Number(e & 4294967295n) | 0;
	for (let e = 0; e < 8; e++) t[e] = 1 << (Math.imul(n, te[e]) >>> 27);
	return t;
}
function A(e, t) {
	let n = ne(t, e.length >> 3) << 3, r = k(t);
	for (let t = 0; t < 8; t++) e[n + t] |= r[t];
}
function j(e) {
	let t = 1;
	for (; t < e;) t <<= 1;
	return t;
}
function re(e, t) {
	if (!(t > 0 && t < 1)) throw Error(`bloom filter fpp must be in (0, 1), got ${t}`);
	if (!(e >= 0)) throw Error(`bloom filter ndv must be >= 0, got ${e}`);
	let n = -8 * e / Math.log(1 - t ** (1 / 8)), r = Math.ceil(n / 8);
	return r <= O ? j(Math.max(r, D)) : O;
}
var ie = class {
	constructor(e, { fpp: t = .01, maxBytes: n = 1048576 } = {}) {
		this.element = e, this.fpp = t, this.maxBytes = n, this.hashes = /* @__PURE__ */ new Set(), this.skipped = 0;
	}
	insert(e) {
		if (e == null) return;
		let t = f(e, this.element);
		t === void 0 ? this.skipped++ : this.hashes.add(t);
	}
	finalize() {
		if (this.skipped > 0 || this.hashes.size === 0) return;
		let e = re(this.hashes.size, this.fpp);
		for (; e > this.maxBytes && e > D;) e >>= 1;
		if (e > this.maxBytes) return;
		let t = new Uint32Array(e >> 2);
		for (let e of this.hashes) A(t, e);
		return t;
	}
};
function M(e, t) {
	if (t.length % 8 != 0) throw Error(`bloom filter block count must be a multiple of 8 uint32 words, got ${t.length}`);
	C(e, {
		field_1: t.byteLength,
		field_2: { field_1: {} },
		field_3: { field_1: {} },
		field_4: { field_1: {} }
	});
	for (let n = 0; n < t.length; n++) e.appendUint32(t[n]);
}
function ae(e, t) {
	for (let { chunk: n, bloomFilter: r } of t) {
		if (!r || !n.meta_data) continue;
		let t = e.offset;
		M(e, r), n.meta_data.bloom_filter_offset = BigInt(t), n.meta_data.bloom_filter_length = e.offset - t;
	}
}
// node_modules/.pnpm/hyparquet@1.31.5/node_modules/hyparquet/src/constants.js
var N = [
	"BOOLEAN",
	"INT32",
	"INT64",
	"INT96",
	"FLOAT",
	"DOUBLE",
	"BYTE_ARRAY",
	"FIXED_LEN_BYTE_ARRAY"
], P = [
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
], F = [
	"REQUIRED",
	"OPTIONAL",
	"REPEATED"
], I = [
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
], L = [
	"UNCOMPRESSED",
	"SNAPPY",
	"GZIP",
	"LZO",
	"BROTLI",
	"LZ4",
	"ZSTD",
	"LZ4_RAW"
], oe = [
	"DATA_PAGE",
	"INDEX_PAGE",
	"DICTIONARY_PAGE",
	"DATA_PAGE_V2"
], se = [
	"UNORDERED",
	"ASCENDING",
	"DESCENDING"
], ce = [
	"SPHERICAL",
	"VINCENTY",
	"THOMAS",
	"ANDOYER",
	"KARNEY"
], R = 128, z = 4, B = R / z;
function V(e, t, n) {
	if (t.length === 0) e.appendVarInt(R), e.appendVarInt(z), e.appendVarInt(0), e.appendVarInt(0);
	else {
		if (typeof t[0] != "number" && typeof t[0] != "bigint") throw Error("deltaBinaryPack only supports number or bigint arrays");
		le(t) ? ue(e, t, n === "INT32") : de(e, t, n === "INT32" ? 32 : 64);
	}
}
function le(e) {
	if (e instanceof Int32Array) return !0;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (typeof n != "number" || n !== (n | 0)) return !1;
	}
	return !0;
}
function ue(e, t, n) {
	let r = t.length;
	e.appendVarInt(R), e.appendVarInt(z), e.appendVarInt(r), fe(e, t[0]);
	let i = [], a = new Float64Array(R), o = new Uint8Array(z), s = 1;
	for (; s < r;) {
		let c = Math.min(s + R, r), l = c - s, u = n ? t[s] - t[s - 1] | 0 : t[s] - t[s - 1], d = t[s], f = s + 1;
		for (; f < c;) {
			let e = t[f];
			if ((n ? e - d | 0 : e - d) !== u) break;
			d = e, f++;
		}
		if (f === c) {
			fe(e, u), e.appendUint32(0), s = c;
			continue;
		}
		let p = u;
		a[0] = p;
		for (let e = 1; e < l; e++) {
			let r = n ? t[s + e] - t[s + e - 1] | 0 : t[s + e] - t[s + e - 1];
			a[e] = r, r < p && (p = r);
		}
		fe(e, p);
		for (let e = 0; e < z; e++) {
			let t = e * B, n = Math.min(t + B, l), r = 0;
			for (let e = t; e < n; e++) {
				let t = a[e] - p;
				t > r && (r = t);
			}
			o[e] = pe(r);
		}
		e.appendBytes(o);
		for (let t = 0; t < z; t++) {
			let n = o[t];
			if (n === 0) continue;
			let r = t * B, s = Math.min(r + B, l), c = i[n] ??= new Uint8Array(n * 4), u = 0, d = 0, f = 0;
			if (n <= 25) for (let e = 0; e < B; e++) {
				let t = r + e < s ? a[r + e] - p : 0;
				for (d |= t << f, f += n; f >= 8;) c[u++] = d & 255, d >>>= 8, f -= 8;
			}
			else for (let e = 0; e < B; e++) {
				let t = r + e < s ? a[r + e] - p : 0;
				for (d += t * 2 ** f, f += n; f >= 8;) c[u++] = d % 256, d = Math.floor(d / 256), f -= 8;
			}
			e.appendBytes(c);
		}
		s = c;
	}
}
function de(e, t, n) {
	let r = t.length;
	e.appendVarInt(R), e.appendVarInt(z), e.appendVarInt(r), e.appendZigZag(BigInt.asIntN(n, BigInt(t[0])));
	let i = new BigInt64Array(R), a = new Uint8Array(z), o = 1;
	for (; o < r;) {
		let s = Math.min(o + R, r), c = s - o, l = 0n;
		for (let e = 0; e < c; e++) {
			i[e] = BigInt(t[o + e]) - BigInt(t[o + e - 1]), n === 32 && (i[e] = BigInt.asIntN(32, i[e]));
			let r = i[e];
			(e === 0 || r < l) && (l = r);
		}
		e.appendZigZag(l);
		for (let e = 0; e < z; e++) {
			let t = e * B, n = Math.min(t + B, c), r = 0n;
			for (let e = t; e < n; e++) {
				let t = i[e] - l;
				t > r && (r = t);
			}
			a[e] = ge(r);
		}
		e.appendBytes(a);
		for (let t = 0; t < z; t++) {
			let n = a[t];
			if (n === 0) continue;
			let r = t * B, o = Math.min(r + B, c), s = 0n, u = 0;
			for (let t = 0; t < B; t++) {
				let a = r + t < o ? i[r + t] - l : 0n;
				for (s |= a << BigInt(u), u += n; u >= 8;) e.appendUint8(Number(s & 255n)), s >>= 8n, u -= 8;
			}
		}
		o = s;
	}
}
function fe(e, t) {
	let n = t < 0 ? -t * 2 - 1 : t * 2;
	for (; n >= 128;) e.appendUint8(n % 128 + 128), n = Math.floor(n / 128);
	e.appendUint8(n);
}
function pe(e) {
	return e === 0 ? 0 : e > 4294967295 ? 33 : 32 - Math.clz32(e);
}
function me(e, t) {
	let n = new Int32Array(t.length);
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (!(r instanceof Uint8Array)) throw Error("deltaLengthByteArray expects Uint8Array values");
		n[e] = r.length;
	}
	V(e, n, "INT32");
	for (let n of t) e.appendBytes(n);
}
function he(e, t) {
	if (t.length === 0) {
		V(e, [], "INT32"), V(e, [], "INT32");
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
	V(e, n, "INT32"), V(e, r, "INT32");
	for (let i = 0; i < t.length; i++) r[i] > 0 && e.appendBytes(t[i].subarray(n[i]));
}
function ge(e) {
	if (e === 0n) return 0;
	let t = 0;
	for (; e > 0n;) t++, e >>= 1n;
	return t;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/encoding.js
function H(e, t, n) {
	let r = e.offset, i = 0, a = 0, o = 0;
	for (; o < t.length;) {
		let r = 1, s = t[o];
		for (; o + r < t.length && t[o + r] === s;) r++;
		r >= 8 ? (i &&= (ve(e, t, a, i, n), 0), _e(e, s, r, n), o += r) : (i === 0 && (a = o), i++, o += 8);
	}
	return i && ve(e, t, a, i, n), e.offset - r;
}
function _e(e, t, n, r) {
	e.appendVarInt(n << 1);
	let i = r + 7 >> 3;
	for (let n = 0; n < i; n++) e.appendUint8(t >> (n << 3) & 255);
}
function ve(e, t, n, r, i) {
	if (e.appendVarInt(r << 1 | 1), i === 0) return;
	let a = (1 << i) - 1, o = 0, s = 0, c = r * 8;
	for (let r = 0; r < c; r++) {
		let c = n + r, l = c < t.length ? t[c] & a : 0;
		for (o |= l << s, s += i; s >= 8;) e.appendUint8(o & 255), o >>>= 8, s -= 8;
	}
	s > 0 && e.appendUint8(o & 255);
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/plain.js
function ye(e, t, n, r) {
	if (n === "BOOLEAN") be(e, t);
	else if (n === "INT32") xe(e, t);
	else if (n === "INT64") Se(e, t);
	else if (n === "FLOAT") Ce(e, t);
	else if (n === "DOUBLE") we(e, t);
	else if (n === "BYTE_ARRAY") Te(e, t);
	else if (n === "FIXED_LEN_BYTE_ARRAY") {
		if (!r) throw Error("parquet FIXED_LEN_BYTE_ARRAY expected type_length");
		Ee(e, t, r);
	} else throw Error(`parquet unsupported type: ${n}`);
}
function be(e, t) {
	let n = 0;
	for (let r = 0; r < t.length; r++) {
		let i = t[r];
		if (typeof i != "boolean") throw Error("parquet expected boolean value, got " + i);
		let a = r % 8;
		i && (n |= 1 << a), a === 7 && (e.appendUint8(n), n = 0);
	}
	t.length % 8 && e.appendUint8(n);
}
function xe(e, t) {
	for (let n of t) {
		if (!Number.isSafeInteger(n)) throw Error("parquet expected integer value, got " + n);
		if (n < -2147483648 || n > 2147483647) throw Error("parquet expected int32 value, got " + n);
		e.appendInt32(n);
	}
}
function Se(e, t) {
	for (let n of t) {
		if (typeof n != "bigint") throw Error("parquet expected bigint value, got " + n);
		e.appendInt64(n);
	}
}
function Ce(e, t) {
	for (let n of t) {
		if (typeof n != "number") throw Error("parquet expected number value, got " + n);
		e.appendFloat32(n);
	}
}
function we(e, t) {
	for (let n of t) {
		if (typeof n != "number") throw Error("parquet expected number value, got " + n);
		e.appendFloat64(n);
	}
}
function Te(e, t) {
	for (let n of t) {
		let t = n;
		if (typeof t == "string" && (t = new TextEncoder().encode(n)), !(t instanceof Uint8Array)) throw Error("parquet expected Uint8Array value, got " + typeof t);
		e.appendUint32(t.length), e.appendBytes(t);
	}
}
function Ee(e, t, n) {
	for (let r of t) {
		if (!(r instanceof Uint8Array)) throw Error("parquet expected Uint8Array value, got " + typeof r);
		if (r.length !== n) throw Error(`parquet expected Uint8Array of length ${n}`);
		e.appendBytes(r);
	}
}
// node_modules/.pnpm/hyparquet@1.31.5/node_modules/hyparquet/src/schema.js
function De(e, t, n) {
	let r = e[t], i = [], a = 1;
	if (r.num_children) for (; i.length < r.num_children;) {
		let r = e[t + a], o = De(e, t + a, [...n, r.name]);
		a += o.count, i.push(o);
	}
	return {
		count: a,
		element: r,
		children: i,
		path: n
	};
}
function Oe(e, t) {
	return ke(De(e, 0, []), t);
}
function ke(e, t) {
	let n = [e];
	for (let r of t) {
		let i = e.children.find((e) => e.element.name === r);
		if (!i) throw Error(`parquet schema element not found: ${t}`);
		n.push(i), e = i;
	}
	return n;
}
function Ae(e) {
	let t = 0;
	for (let { element: n } of e.slice(1)) n.repetition_type !== "REQUIRED" && t++;
	return t;
}
function je(e) {
	if (!e || e.element.converted_type !== "LIST" || e.children.length > 1) return !1;
	let t = e.children[0];
	return !(t.children.length > 1 || t.element.repetition_type !== "REPEATED");
}
function Me(e) {
	if (!e || e.element.converted_type !== "MAP" || e.children.length > 1) return !1;
	let t = e.children[0];
	return t.children.length === 2 && t.element.repetition_type === "REPEATED" && t.children.find((e) => e.element.name === "key")?.element.repetition_type !== "REPEATED" && t.children.find((e) => e.element.name === "value")?.element.repetition_type !== "REPEATED";
}
new TextDecoder();
function Ne({ schema: e }) {
	return Oe(e, [])[0];
}
// node_modules/.pnpm/hyparquet@1.31.5/node_modules/hyparquet/src/utils.js
function Pe(e) {
	if (e === void 0) return null;
	if (typeof e == "bigint") return Number(e);
	if (Object.is(e, -0)) return 0;
	if (Array.isArray(e)) return e.map(Pe);
	if (e instanceof Uint8Array) return Array.from(e);
	if (e instanceof Date) return e.toISOString();
	if (e instanceof Object) {
		let t = {};
		for (let n of Object.keys(e)) e[n] !== void 0 && (t[n] = Pe(e[n]));
		return t;
	}
	return e;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/variant.js
var Fe = new TextEncoder(), Ie = -(2n ** 63n), Le = 2n ** 63n - 1n, Re = new Uint8Array([0]), ze = /* @__PURE__ */ new Set(["value", "typed_value"]), Be = /* @__PURE__ */ new Map(), Ve = et([]);
function He(e, t, n) {
	if (n?.required) {
		for (let t = 0; t < e.length; t++) if (e[t] === void 0) throw Error(`required variant column ${n.name} has undefined value at index ${t}`);
	}
	let r = [], i = t && U(t);
	if (i) {
		let t = /* @__PURE__ */ new Map();
		return e.map((e) => {
			if (e === void 0) return null;
			let n = /* @__PURE__ */ new Set();
			W(e, n);
			let { metadata: a, keyIndex: o } = We(n, t);
			return {
				metadata: a,
				...Ue(e, i, o, !0, r)
			};
		});
	}
	let a = $e(e), o = et(a), s = /* @__PURE__ */ new Map();
	for (let e = 0; e < a.length; e++) s.set(a[e], e);
	return e.map((e) => e === void 0 ? null : {
		metadata: o,
		value: G(e, s, r)
	});
}
function Ue(e, t, n, r, i) {
	if (e == null) return {
		value: Re,
		typed_value: null
	};
	if (Array.isArray(t)) {
		if (!Array.isArray(e)) return {
			value: G(e, n, i),
			typed_value: null
		};
		let r = t[0];
		return {
			value: null,
			typed_value: e.map((e) => Ue(e, r, n, !1, i))
		};
	}
	if (typeof t == "object") {
		if (typeof e != "object" || Array.isArray(e) || e instanceof Date || e instanceof Uint8Array) return {
			value: G(e, n, i),
			typed_value: null
		};
		let a = {}, o = !1;
		for (let n of Object.keys(e)) n in t || e[n] === void 0 || (a[n] = e[n], o = !0);
		if (o && !r) return {
			value: G(e, n, i),
			typed_value: null
		};
		let s = Object.keys(t);
		if (s.some((t) => (!Object.prototype.hasOwnProperty.call(e, t) || e[t] === void 0) && n.has(t))) return {
			value: G(e, n, i),
			typed_value: null
		};
		let c = {};
		for (let r of s) Object.prototype.hasOwnProperty.call(e, r) && e[r] !== void 0 && (c[r] = Ue(e[r], t[r], n, !1, i));
		return {
			value: o ? G(a, n, i) : null,
			typed_value: c
		};
	}
	return Ge(e, t) ? {
		value: null,
		typed_value: e
	} : {
		value: G(e, n, i),
		typed_value: null
	};
}
function We(e, t) {
	if (e.size === 0) return {
		metadata: Ve,
		keyIndex: Be
	};
	let n = [...e].sort(), r = n.join("\0"), i = t.get(r);
	if (i) return i;
	let a = et(n), o = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e++) o.set(n[e], e);
	let s = {
		metadata: a,
		keyIndex: o
	};
	return t.set(r, s), s;
}
function Ge(e, t) {
	if (e == null) return !1;
	switch (t) {
		case "BOOLEAN": return typeof e == "boolean";
		case "INT32": return typeof e == "number" && Number.isInteger(e) && e >= -2147483648 && e <= 2147483647;
		case "INT64": return typeof e == "bigint" && e >= Ie && e <= Le;
		case "FLOAT": return typeof e == "number";
		case "DOUBLE": return typeof e == "number";
		case "STRING": return typeof e == "string";
		case "TIMESTAMP": return e instanceof Date;
		default: return !1;
	}
}
var Ke = 3, qe = 256;
function Je(e) {
	let t = Xe(e, 0);
	if (t === void 0 || typeof t != "object") return;
	let n = U(t);
	if (!(n === void 0 || Ye(n) > qe)) return n;
}
function Ye(e) {
	if (Array.isArray(e)) return e.length ? Ye(e[0]) : 0;
	if (e && typeof e == "object") {
		let t = 0;
		for (let n of Object.keys(e)) t += Ye(e[n]);
		return t;
	}
	return 1;
}
function Xe(e, t) {
	let n = [];
	for (let t of e) t != null && n.push(t);
	if (!n.length) return;
	if (n.some(Ze)) {
		if (t >= Ke) return;
		let e = /* @__PURE__ */ new Map();
		for (let t of n) if (Ze(t)) for (let [n, r] of Object.entries(t)) {
			if (r === void 0) continue;
			let t = e.get(n);
			t ? t.push(r) : e.set(n, [r]);
		}
		let r = {};
		for (let [n, i] of e) {
			let e = Xe(i, t + 1);
			e !== void 0 && (r[n] = e);
		}
		return Object.keys(r).length > 0 ? r : void 0;
	}
	if (n.every(Array.isArray)) {
		if (t >= Ke) return;
		let e = [];
		for (let t of n) for (let n of t) e.push(n);
		let r = Xe(e, t + 1);
		return r === void 0 ? void 0 : [r];
	}
	let r;
	for (let e of n) {
		if (Array.isArray(e)) return;
		let t = e instanceof Date ? "date" : typeof e;
		if (r === void 0) r = t;
		else if (r !== t) return;
	}
	return r ? Qe(r) : void 0;
}
function Ze(e) {
	return typeof e == "object" && !!e && !Array.isArray(e) && !(e instanceof Date) && !(e instanceof Uint8Array);
}
function U(e) {
	if (Array.isArray(e)) {
		let t = e.length ? U(e[0]) : void 0;
		return t === void 0 ? void 0 : [t];
	}
	if (typeof e == "object") {
		let t = {};
		for (let [n, r] of Object.entries(e)) {
			if (ze.has(n)) continue;
			let e = U(r);
			e !== void 0 && (t[n] = e);
		}
		return Object.keys(t).length > 0 ? t : void 0;
	}
	return e;
}
function Qe(e) {
	switch (e) {
		case "boolean": return "BOOLEAN";
		case "string": return "STRING";
		case "number": return "DOUBLE";
		case "bigint": return "INT64";
		case "date": return "TIMESTAMP";
		default: return;
	}
}
function $e(e) {
	let t = /* @__PURE__ */ new Set();
	return W(e, t), [...t].sort();
}
function W(e, t) {
	if (e != null) {
		if (Array.isArray(e)) for (let n of e) W(n, t);
		else if (!(e instanceof Date || e instanceof Uint8Array) && typeof e == "object") for (let n of Object.keys(e)) t.add(n), W(e[n], t);
	}
}
function et(e) {
	let t = e.length, n = Array(t), r = 0;
	for (let i = 0; i < t; i++) {
		let t = Fe.encode(e[i]);
		n[i] = t, r += t.length;
	}
	let i = K(r), a = 17 | i - 1 << 6, o = 1 + i + (t + 1) * i + r, s = new Uint8Array(o), c = 0;
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
function G(t, n, r) {
	let i = new e(8);
	return tt(t, i, n, r), i.getBytes();
}
function tt(e, t, n, r) {
	if (e == null) t.appendUint8(0);
	else if (e === !0) t.appendUint8(4);
	else if (e === !1) t.appendUint8(8);
	else if (typeof e == "bigint") {
		if (e < Ie || e > Le) throw RangeError(`variant bigint out of int64 range: ${e}`);
		t.appendUint8(24), t.appendInt64(e);
	} else if (typeof e == "number") {
		if (Number.isInteger(e)) {
			if (e >= -128 && e <= 127) {
				t.appendUint8(12), t.appendUint8(e & 255);
				return;
			}
			if (e >= -32768 && e <= 32767) {
				t.appendUint8(16), q(t, e, 2);
				return;
			}
			if (e >= -2147483648 && e <= 2147483647) {
				t.appendUint8(20), t.appendInt32(e);
				return;
			}
		}
		t.appendUint8(28), t.appendFloat64(e);
	} else if (typeof e == "string") {
		let n = Fe.encode(e);
		n.length <= 63 ? (t.appendUint8(n.length << 2 | 1), t.appendBytes(n)) : (t.appendUint8(64), t.appendUint32(n.length), t.appendBytes(n));
	} else if (e instanceof Date) t.appendUint8(52), t.appendInt64(BigInt(e.getTime()) * 1000n);
	else if (e instanceof Uint8Array) t.appendUint8(60), t.appendUint32(e.length), t.appendBytes(e);
	else if (Array.isArray(e)) rt(e, t, n, r);
	else if (typeof e == "object") nt(e, t, n, r);
	else throw Error(`variant cannot encode value: ${e}`);
}
function nt(t, n, r, i) {
	let a = Object.keys(t).filter((e) => t[e] !== void 0).map((e) => {
		let t = r.get(e);
		if (t === void 0) throw Error(`variant key not in dictionary: ${e}`);
		return {
			id: t,
			key: e
		};
	});
	a.sort((e, t) => e.id - t.id);
	let o = a.length, s = K(o > 0 ? a[o - 1].id : 0), c = i.pop() ?? new e(8), l = Array(o + 1);
	l[0] = 0;
	for (let e = 0; e < o; e++) tt(t[a[e].key], c, r, i), l[e + 1] = c.index;
	let u = K(l[o]), d = +(o > 255);
	n.appendUint8((u - 1 | s - 1 << 2 | d << 4) << 2 | 2), d ? n.appendUint32(o) : n.appendUint8(o);
	for (let { id: e } of a) q(n, e, s);
	for (let e of l) q(n, e, u);
	n.appendBytes(c.getBytes()), c.index = 0, c.offset = 0, i.push(c);
}
function rt(t, n, r, i) {
	let a = t.length, o = i.pop() ?? new e(8), s = Array(a + 1);
	s[0] = 0;
	for (let e = 0; e < a; e++) tt(t[e], o, r, i), s[e + 1] = o.index;
	let c = K(s[a]), l = +(a > 255);
	n.appendUint8((c - 1 | l << 2) << 2 | 3), l ? n.appendUint32(a) : n.appendUint8(a);
	for (let e of s) q(n, e, c);
	n.appendBytes(o.getBytes()), o.index = 0, o.offset = 0, i.push(o);
}
function K(e) {
	return e <= 255 ? 1 : e <= 65535 ? 2 : e <= 16777215 ? 3 : 4;
}
function q(e, t, n) {
	for (let r = 0; r < n; r++) e.appendUint8(t >> r * 8 & 255);
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/schema.js
function it({ columnData: e, schemaOverrides: t }) {
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
		let e = o === !1 ? "REQUIRED" : "OPTIONAL", t = s && s !== !0 ? U(s) : void 0;
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
		}, ...at(t)) : n.push({
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
	} else a ? n.push(st(r, a, o)) : n.push(ct(r, i.slice(0, 1e3)));
	return n;
}
function at(e) {
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
		...at(e[0])
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
		}, ...at(e[r]));
		return n;
	}
	return [ot(e)];
}
function ot(e) {
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
function st(e, t, n) {
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
function ct(e, t) {
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
function lt(e) {
	let t = 0;
	for (let n of e) n.repetition_type === "REPEATED" && t++;
	return t;
}
function ut(e) {
	let t = Ne({ schema: e }), n = /* @__PURE__ */ new Map();
	return (e) => {
		let r = t, i = [r];
		for (let t of e) {
			let a = n.get(r);
			if (!a) {
				a = /* @__PURE__ */ new Map();
				for (let e of r.children) a.has(e.element.name) || a.set(e.element.name, e);
				n.set(r, a);
			}
			let o = a.get(t);
			if (!o) throw Error(`parquet schema element not found: ${e}`);
			i.push(o), r = o;
		}
		return i;
	};
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/splitstream.js
function dt(e, t, n, r) {
	let i = t.length, a, o;
	if (n === "FLOAT") {
		let e = t instanceof Float32Array ? t : new Float32Array(ft(t));
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 4;
	} else if (n === "DOUBLE") {
		let e = t instanceof Float64Array ? t : new Float64Array(ft(t));
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 8;
	} else if (n === "INT32") {
		let e = t instanceof Int32Array ? t : new Int32Array(ft(t));
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 4;
	} else if (n === "INT64") {
		let e = pt(t);
		a = new Uint8Array(e.buffer, e.byteOffset, e.byteLength), o = 8;
	} else if (n === "FIXED_LEN_BYTE_ARRAY") {
		if (!r) throw Error("parquet byte_stream_split missing type_length");
		o = r, a = new Uint8Array(i * o);
		for (let e = 0; e < i; e++) a.set(t[e], e * o);
	} else throw Error(`parquet byte_stream_split unsupported type: ${n}`);
	for (let t = 0; t < o; t++) for (let n = 0; n < i; n++) e.appendUint8(a[n * o + t]);
}
function ft(e) {
	if (Array.isArray(e) && e.every((e) => typeof e == "number")) return e;
	throw Error("Expected number array for BYTE_STREAM_SPLIT encoding");
}
function pt(e) {
	if (e instanceof BigInt64Array) return e;
	if (Array.isArray(e) && e.every((e) => typeof e == "bigint")) return new BigInt64Array(e);
	throw Error("Expected bigint array for BYTE_STREAM_SPLIT encoding");
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/datapage.js
function mt({ writer: t, column: n, encoding: r, pageData: i }) {
	let { columnName: a, element: o, codec: s, compressors: c } = n, { type: l, type_length: u, repetition_type: d } = o;
	if (!l) throw Error(`column ${a} cannot determine type`);
	if (d === "REPEATED") throw Error(`column ${a} repeated types not supported`);
	let f = new e(), { definition_levels_byte_length: p, repetition_levels_byte_length: m, num_nulls: h, num_values: g, num_rows: _ } = gt(f, n, i), v = h ? i.values.filter((e) => e != null) : i.values, y = new e();
	if (r === "PLAIN") ye(y, v, l, u);
	else if (r === "RLE") {
		if (l !== "BOOLEAN") throw Error("RLE encoding only supported for BOOLEAN type");
		let t = new e();
		H(t, v, 1), y.appendUint32(t.offset), y.appendBytes(t.getBytes());
	} else if (r === "PLAIN_DICTIONARY" || r === "RLE_DICTIONARY") {
		let e = 0;
		for (let t of v) t > e && (e = t);
		let t = Math.ceil(Math.log2(e + 1));
		y.appendUint8(t), H(y, v, t);
	} else if (r === "DELTA_BINARY_PACKED") {
		if (l !== "INT32" && l !== "INT64") throw Error("DELTA_BINARY_PACKED encoding only supported for INT32 and INT64 types");
		V(y, v, l);
	} else if (r === "DELTA_LENGTH_BYTE_ARRAY") {
		if (l !== "BYTE_ARRAY") throw Error("DELTA_LENGTH_BYTE_ARRAY encoding only supported for BYTE_ARRAY type");
		me(y, v);
	} else if (r === "DELTA_BYTE_ARRAY") {
		if (l !== "BYTE_ARRAY") throw Error("DELTA_BYTE_ARRAY encoding only supported for BYTE_ARRAY type");
		he(y, v);
	} else if (r === "BYTE_STREAM_SPLIT") dt(y, v, l, u);
	else throw Error(`parquet unsupported encoding: ${r}`);
	let b = y.getBytes(), x = c[s]?.(b) ?? b, S = t.offset;
	ht(t, {
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
	});
	let C = t.offset - S;
	return t.appendBytes(f.getBytes()), t.appendBytes(x), C + f.offset + y.offset;
}
function ht(e, t) {
	C(e, {
		field_1: oe.indexOf(t.type),
		field_2: t.uncompressed_page_size,
		field_3: t.compressed_page_size,
		field_4: t.crc,
		field_5: t.data_page_header && {
			field_1: t.data_page_header.num_values,
			field_2: P.indexOf(t.data_page_header.encoding),
			field_3: P.indexOf(t.data_page_header.definition_level_encoding),
			field_4: P.indexOf(t.data_page_header.repetition_level_encoding)
		},
		field_7: t.dictionary_page_header && {
			field_1: t.dictionary_page_header.num_values,
			field_2: P.indexOf(t.dictionary_page_header.encoding)
		},
		field_8: t.data_page_header_v2 && {
			field_1: t.data_page_header_v2.num_values,
			field_2: t.data_page_header_v2.num_nulls,
			field_3: t.data_page_header_v2.num_rows,
			field_4: P.indexOf(t.data_page_header_v2.encoding),
			field_5: t.data_page_header_v2.definition_levels_byte_length,
			field_6: t.data_page_header_v2.repetition_levels_byte_length,
			field_7: t.data_page_header_v2.is_compressed ? void 0 : !1
		}
	});
}
function gt(e, t, n) {
	let { schemaPath: r } = t, { values: i, definitionLevels: a, repetitionLevels: o, maxDefinitionLevel: s } = n, c = a.length || i.length, l = 0, u = 0;
	if (o.length) for (let e = 0; e < o.length; e++) o[e] === 0 && u++;
	else u = i.length;
	if (a.length) for (let e = 0; e < a.length; e++) a[e] < s && l++;
	let d = lt(r), f = 0;
	d && (f = H(e, o, Math.ceil(Math.log2(d + 1))));
	let p = 0;
	return s && (p = H(e, a, Math.ceil(Math.log2(s + 1)))), {
		definition_levels_byte_length: p,
		repetition_levels_byte_length: f,
		num_values: c,
		num_nulls: l,
		num_rows: u
	};
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/dictionary.js
var _t = new TextEncoder();
function vt(e, t, n) {
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
function yt(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e[n], t = Math.imul(t, 16777619);
	return t >>> 0;
}
function bt(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
var xt = .9;
function St(e, t, n, r, i, a) {
	if (r && r !== "RLE_DICTIONARY" || t === "BOOLEAN") return {};
	let o = r === "RLE_DICTIONARY", s = t === "BYTE_ARRAY" ? 4 : 0;
	if (!o) {
		let r = Math.min(e.length, 1e3), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = 0, c = 0;
		for (let l = 0; l < r; l++) {
			let u = e[r === 1 ? 0 : Math.floor(l * (e.length - 1) / (r - 1))], d = u;
			u instanceof Uint8Array && (d = a.get(u), d === void 0 && (d = yt(u), a.set(u, d)));
			let f = i.get(d);
			f === void 0 && (f = vt(u, t, n) + (u == null ? 0 : s), i.set(d, f), o += f), c += f;
		}
		if (!c || o / c > xt) return {};
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
			let e = yt(s), t = f.get(e);
			if (t) {
				for (let e of t) if (bt(c[e], s)) {
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
			let e = _ === void 0 ? vt(s, t, n) : d[_];
			if (h += e, _ === void 0) {
				if (p += e, !o && i && (m += typeof s == "string" ? _t.encode(s).byteLength : e, m > i)) return {};
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
function Ct(t, n, r) {
	let { element: i, codec: a, compressors: o } = n, { type: s, type_length: c } = i;
	if (!s) throw Error(`column ${n.columnName} cannot determine type`);
	let l = new e();
	ye(l, r, s, c);
	let u = l.getBytes(), d = o[a]?.(u) ?? u, f = t.offset;
	ht(t, {
		type: "DICTIONARY_PAGE",
		uncompressed_page_size: u.byteLength,
		compressed_page_size: d.byteLength,
		dictionary_page_header: {
			num_values: r.length,
			encoding: "PLAIN"
		}
	});
	let p = t.offset - f;
	return t.appendBytes(d), p + u.byteLength;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/geospatial.js
function wt(e) {
	let t = /* @__PURE__ */ new Set(), n;
	for (let r of e) if (r != null) {
		if (typeof r != "object") throw Error("geospatial column expects GeoJSON geometries");
		n = Tt(n, r), t.add(Dt(r));
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
function Tt(e, t) {
	if (t.type === "GeometryCollection") {
		for (let n of t.geometries || []) e = Tt(e, n);
		return e;
	}
	return Et(e, t.coordinates);
}
function Et(e, t) {
	if (typeof t[0] == "number") return e = J(e, "xmin", "xmax", t[0]), e = J(e, "ymin", "ymax", t[1]), t.length > 2 && (e = J(e, "zmin", "zmax", t[2])), t.length > 3 && (e = J(e, "mmin", "mmax", t[3])), e;
	for (let n of t) e = Et(e, n);
	return e;
}
function J(e, t, n, r) {
	if (r === void 0 || !Number.isFinite(r)) return e;
	e ||= {};
	let i = e[t], a = e[n];
	return (i === void 0 || r < i) && (e[t] = r), (a === void 0 || r > a) && (e[n] = r), e;
}
function Dt(e) {
	let t = Ot[e.type];
	if (t === void 0) throw Error(`unknown geometry type: ${e.type}`);
	let n = kt(e);
	if (n === 2) return t;
	if (n === 3) return t + 1e3;
	if (n === 4) return t + 3e3;
	throw Error(`unsupported geometry dimensions: ${n}`);
}
var Ot = {
	Point: 1,
	LineString: 2,
	Polygon: 3,
	MultiPoint: 4,
	MultiLineString: 5,
	MultiPolygon: 6,
	GeometryCollection: 7
};
function kt(e) {
	if (e.type === "GeometryCollection") {
		let t = 0;
		for (let n of e.geometries || []) t = Math.max(t, kt(n));
		return t || 2;
	}
	return At(e.coordinates);
}
function At(e) {
	if (!e.length) return 2;
	if (typeof e[0] == "number") return e.length;
	let t = 0;
	for (let n of e) t = Math.max(t, At(n));
	return t || 2;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/wkb.js
function jt(t) {
	let n = new e();
	return Y(n, t), n.getBytes();
}
function Y(e, t) {
	if (typeof t != "object") throw Error("geometry values must be GeoJSON geometries");
	let n = Pt(t.type), r = Ft(t), i = 0;
	if (r === 3) i = 1;
	else if (r === 4) i = 3;
	else if (r > 4) throw Error(`unsupported geometry dimensions: ${r}`);
	if (e.appendUint8(1), e.appendUint32(n + i * 1e3), t.type === "Point") Mt(e, t.coordinates, r);
	else if (t.type === "LineString") Nt(e, t.coordinates, r);
	else if (t.type === "Polygon") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) Nt(e, n, r);
	} else if (t.type === "MultiPoint") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) Y(e, {
			type: "Point",
			coordinates: n
		});
	} else if (t.type === "MultiLineString") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) Y(e, {
			type: "LineString",
			coordinates: n
		});
	} else if (t.type === "MultiPolygon") {
		e.appendUint32(t.coordinates.length);
		for (let n of t.coordinates) Y(e, {
			type: "Polygon",
			coordinates: n
		});
	} else if (t.type === "GeometryCollection") {
		e.appendUint32(t.geometries.length);
		for (let n of t.geometries) Y(e, n);
	} else throw Error("unsupported geometry type");
}
function Mt(e, t, n) {
	if (t.length < n) throw Error("geometry position dimensions mismatch");
	for (let r = 0; r < n; r++) e.appendFloat64(t[r]);
}
function Nt(e, t, n) {
	e.appendUint32(t.length);
	for (let r of t) Mt(e, r, n);
}
function Pt(e) {
	if (e === "Point") return 1;
	if (e === "LineString") return 2;
	if (e === "Polygon") return 3;
	if (e === "MultiPoint") return 4;
	if (e === "MultiLineString") return 5;
	if (e === "MultiPolygon") return 6;
	if (e === "GeometryCollection") return 7;
	throw Error(`unknown geometry type: ${e}`);
}
function Ft(e) {
	if (e.type === "GeometryCollection") {
		let t = 0;
		for (let n of e.geometries) t = Math.max(t, Ft(n));
		return t || 2;
	}
	return It(e.coordinates);
}
function It(e) {
	if (!Array.isArray(e) || !e.length) return 2;
	if (typeof e[0] == "number") return e.length;
	let t = 0;
	for (let n of e) t = Math.max(t, It(n));
	return t || 2;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/unconvert.js
var Lt = 864e5;
function Rt(e, t) {
	let n = /* @__PURE__ */ new Map();
	return Array.from(e, (e) => {
		if (n.has(e)) return n.get(e);
		let r = t(e);
		return n.set(e, r), r;
	});
}
function X(e, t) {
	let { type: n, converted_type: r, logical_type: i } = e;
	if (r === "DECIMAL") {
		let n = 10 ** (e.scale || 0);
		return Array.from(t, (t) => {
			if (t == null) return t;
			if (typeof t == "bigint") return Yt(e, t);
			if (typeof t != "number") throw Error("DECIMAL must be a number or bigint");
			return Yt(e, BigInt(Math.round(t * n)));
		});
	}
	if (r === "DATE") return Array.from(t).map((e) => e instanceof Date ? Math.floor(e.getTime() / Lt) : e);
	if (r === "TIMESTAMP_MILLIS") return Array.from(t).map((e) => e == null ? e : e instanceof Date ? BigInt(e.getTime()) : BigInt(e));
	if (r === "TIMESTAMP_MICROS") return Array.from(t).map((e) => e == null ? e : e instanceof Date ? BigInt(e.getTime() * 1e3) : BigInt(e));
	if (r === "JSON") {
		if (!Array.isArray(t)) throw Error("JSON must be an array");
		let e = new TextEncoder();
		return Rt(t, (t) => t == null ? t : e.encode(JSON.stringify(Pe(t))));
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
		return Array.from(t).map(Xt);
	}
	if (i?.type === "UUID") {
		if (!Array.isArray(t)) throw Error("UUID must be an array");
		if (n !== "FIXED_LEN_BYTE_ARRAY") throw Error("UUID must be FIXED_LEN_BYTE_ARRAY type");
		if (e.type_length !== 16) throw Error("UUID expected type_length to be 16 bytes");
		return t.map(zt);
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
		return Rt(t, (e) => e == null ? e : jt(e));
	}
	return t;
}
function zt(e) {
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
var Bt = 16, Vt = new TextDecoder("utf-8", {
	fatal: !0,
	ignoreBOM: !0
});
function Ht(e, t, n, r) {
	return e.length <= r || !Ut(t) ? e : (Wt(t) ? Kt(e, n, r) : Gt(e, n, r)) ?? e;
}
function Ut({ type: e, converted_type: t, logical_type: n }) {
	return e !== "BYTE_ARRAY" || t === "DECIMAL" || t === "JSON" || t === "BSON" ? !1 : n?.type !== "JSON" && n?.type !== "BSON";
}
function Wt({ converted_type: e, logical_type: t }) {
	return e === "UTF8" || e === "ENUM" || t?.type === "STRING" || t?.type === "ENUM";
}
function Gt(e, t, n) {
	let r = new Uint8Array(e.subarray(0, n));
	if (!t) return r;
	let i = r.length - 1;
	for (; i >= 0 && r[i] === 255;) i--;
	if (i < 0) return;
	let a = r.slice(0, i + 1);
	return a[i] += 1, a;
}
function Kt(e, t, n) {
	let r = n;
	for (; r > 0 && (e[r] & 192) == 128;) r--;
	if (!t) return new Uint8Array(e.subarray(0, r));
	let i;
	try {
		i = Vt.decode(e.subarray(0, r));
	} catch {
		return Gt(e, t, n);
	}
	let a = Array.from(i, (e) => e.codePointAt(0) ?? 0), o = new TextEncoder();
	for (let t = a.length - 1; t >= 0; t--) {
		for (r--; r > 0 && (e[r] & 192) == 128;) r--;
		let i = a[t];
		if (i === 1114111) continue;
		let s = i === 55295 ? 57344 : i + 1, c = o.encode(String.fromCodePoint(s));
		if (r + c.length > n) continue;
		let l = new Uint8Array(r + c.length);
		return l.set(e.subarray(0, r)), l.set(c, r), l;
	}
}
function qt(e, t, n, r) {
	if (e == null || !Ut(t)) return;
	let i = e instanceof Uint8Array ? e : new TextEncoder().encode(e.toString());
	return Ht(i, t, n, r) === i && void 0;
}
function Z(e, t, n, r = Bt) {
	if (e == null) return;
	let { type: i, converted_type: a } = t;
	if (i === "BOOLEAN") return new Uint8Array([+!!e]);
	if (t.logical_type?.type === "UUID" && (typeof e == "string" || e instanceof Uint8Array)) return zt(e);
	if (a === "DECIMAL") {
		if (typeof e != "number" && typeof e != "bigint") throw Error("DECIMAL must be a number or bigint");
		let n = 10 ** (t.scale || 0), r = Yt(t, typeof e == "bigint" ? e : BigInt(Math.round(e * n)));
		if (r instanceof Uint8Array) return r;
		if (typeof r == "number") {
			let e = /* @__PURE__ */ new ArrayBuffer(4);
			return new DataView(e).setInt32(0, r, !0), new Uint8Array(e);
		}
		if (typeof r == "bigint") {
			let e = /* @__PURE__ */ new ArrayBuffer(8);
			return new DataView(e).setBigInt64(0, r, !0), new Uint8Array(e);
		}
	}
	if (t.logical_type?.type === "FLOAT16" && typeof e == "number") return Xt(e);
	if (i === "BYTE_ARRAY" || i === "FIXED_LEN_BYTE_ARRAY") return Ht(e instanceof Uint8Array ? e : new TextEncoder().encode(e.toString()), t, n, r);
	if (i === "FLOAT" && typeof e == "number") {
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setFloat32(0, e, !0), new Uint8Array(t);
	}
	if (i === "DOUBLE" && typeof e == "number") {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setFloat64(0, e, !0), new Uint8Array(t);
	}
	if (i === "INT32" && typeof e == "number") {
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, e, !0), new Uint8Array(t);
	}
	if (i === "INT64" && (typeof e == "bigint" || typeof e == "number" && Number.isInteger(e))) {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setBigInt64(0, BigInt(e), !0), new Uint8Array(t);
	}
	if (i === "INT32" && a === "DATE" && e instanceof Date) {
		let t = /* @__PURE__ */ new ArrayBuffer(4);
		return new DataView(t).setInt32(0, Math.floor(e.getTime() / Lt), !0), new Uint8Array(t);
	}
	if (i === "INT64" && a === "TIMESTAMP_MILLIS" && e instanceof Date) {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setBigInt64(0, BigInt(e.getTime()), !0), new Uint8Array(t);
	}
	if (i === "INT64" && a === "TIMESTAMP_MICROS" && e instanceof Date) {
		let t = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(t).setBigInt64(0, BigInt(e.getTime() * 1e3), !0), new Uint8Array(t);
	}
	if (i === "INT64" && t.logical_type?.type === "TIMESTAMP" && e instanceof Date) {
		let n = BigInt(e.getTime()), { unit: r } = t.logical_type, i = n;
		r === "NANOS" ? i = n * 1000000n : r === "MICROS" && (i = n * 1000n);
		let a = /* @__PURE__ */ new ArrayBuffer(8);
		return new DataView(a).setBigInt64(0, i, !0), new Uint8Array(a);
	}
	throw Error(`unsupported type for statistics: ${i} with value ${e}`);
}
function Jt(e, t, n = Bt) {
	return {
		field_1: Z(e.max, t, !0, n),
		field_2: Z(e.min, t, !1, n),
		field_3: e.null_count,
		field_4: e.distinct_count,
		field_5: Z(e.max_value, t, !0, n),
		field_6: Z(e.min_value, t, !1, n),
		field_7: e.is_max_value_exact ?? qt(e.max_value ?? e.max, t, !0, n),
		field_8: e.is_min_value_exact ?? qt(e.min_value ?? e.min, t, !1, n),
		field_9: e.nan_count
	};
}
function Yt({ type: e, type_length: t }, n) {
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
function Xt(e) {
	if (e == null) return;
	if (typeof e != "number") throw Error("parquet float16 expected number value");
	if (Number.isNaN(e)) return new Uint8Array([0, 126]);
	let t = e < 0 || Object.is(e, -0) ? 1 : 0, n = Math.abs(e);
	if (!isFinite(n)) return new Uint8Array([0, t << 7 | 124]);
	if (n === 0) return new Uint8Array([0, t << 7]);
	if (n >= 65520) return new Uint8Array([0, t << 7 | 124]);
	let r = -14;
	if (n >= 2 ** -14) {
		let e = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
		e.setFloat64(0, n), r = (e.getUint32(0) >>> 20 & 2047) - 1023;
	}
	let i = n / 2 ** (r - 10), a = Math.floor(i), o = i - a;
	(o > .5 || o === .5 && a % 2) && a++;
	let s = n < 2 ** -14 ? a : (r + 14) * 1024 + a, c = t << 15 | s;
	return new Uint8Array([c & 255, c >> 8]);
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/column.js
function Zt({ writer: e, column: t, pageData: n }) {
	let { columnName: r, element: i, schemaPath: a, stats: o, pageSize: s, dictionarySize: c, encoding: l } = t, { type: u, type_length: d } = i;
	if (!u) throw Error(`column ${r} cannot determine type`);
	let { values: f, definitionLevels: p, repetitionLevels: m, maxDefinitionLevel: h } = n, g = e.offset, _ = 0, v = [], y = i?.logical_type?.type === "GEOMETRY" || i?.logical_type?.type === "GEOGRAPHY", b = o && y ? wt(f) : void 0, x;
	if (t.bloomFilter) {
		let e = new ie(i, typeof t.bloomFilter == "object" ? t.bloomFilter : void 0);
		for (let t of f) e.insert(t);
		x = e.finalize();
	}
	let S, C = i.converted_type !== "UTF8", w = C ? X(i, f) : f;
	if (u === "INT64") {
		let e = i.converted_type === "UINT_64" || i.logical_type?.type === "INTEGER" && !i.logical_type.isSigned, t = e ? 0n : -(2n ** 63n), n = e ? 2n ** 64n - 1n : 2n ** 63n - 1n;
		for (let e of w) if (e != null && (e < t || e > n)) throw RangeError(`parquet INT64 value out of range: ${e}`);
	}
	let T = i.converted_type === "JSON" ? w : f, ee = o ? $t(T, i) : void 0, { dictionary: E, indexes: te } = St(w, u, d, l, c, h === 0), D, O, ne = u;
	if (E && te) {
		O = te, ne = "INT32", D = "RLE_DICTIONARY", S = BigInt(e.offset);
		let n = C ? E : X(i, E);
		_ += Ct(e, t, n), v.push("PLAIN");
	} else O = C ? w : X(i, f), D = l && l !== "RLE_DICTIONARY" ? l : u === "BOOLEAN" && f.length > 16 ? "RLE" : "PLAIN";
	v.push(D);
	let k = Qt(O, ne, d, s, m), A = t.columnIndex && k.length > 1 ? {
		null_pages: [],
		min_values: [],
		max_values: [],
		boundary_order: "UNORDERED",
		null_counts: [],
		nan_counts: en(i) ? [] : void 0
	} : void 0, j = t.offsetIndex && k.length > 1 ? { page_locations: [] } : void 0, re = BigInt(e.offset), M = 0n, ae = 0, N, P, F = !0, I = !0;
	for (let { start: n, end: r } of k) {
		let a = e.offset, o = {
			values: O.slice(n, r),
			definitionLevels: p.slice(n, r),
			repetitionLevels: m.slice(n, r),
			maxDefinitionLevel: h
		};
		if (_ += mt({
			writer: e,
			column: t,
			encoding: D,
			pageData: o
		}), A) {
			let { min_value: e, max_value: a, null_count: o = 0n, nan_count: s } = $t(T.slice(n, r), i), c = o === BigInt(r - n), l = Z(e, i, !1, t.statisticsTruncateLength), u = Z(a, i, !0, t.statisticsTruncateLength);
			if (!c && (!l || !u)) A = void 0;
			else {
				if (A.null_pages.push(c), A.min_values.push(l ?? /* @__PURE__ */ new Uint8Array()), A.max_values.push(u ?? /* @__PURE__ */ new Uint8Array()), A.null_counts?.push(o), s !== void 0 && A.nan_counts?.push(s), N !== void 0 && e !== void 0) {
					let t = nn(N, e);
					t > 0 && (F = !1), t < 0 && (I = !1);
				}
				if (P !== void 0 && a !== void 0) {
					let e = nn(P, a);
					e > 0 && (F = !1), e < 0 && (I = !1);
				}
				N = e, P = a;
			}
		}
		if (j) {
			if (m.length) for (let e = ae + 1; e <= n; e++) m[e] === 0 && M++;
			else M = BigInt(n);
			j.page_locations.push({
				offset: BigInt(a),
				compressed_page_size: e.offset - a,
				first_row_index: M
			});
		}
		ae = n;
	}
	A && (F ? A.boundary_order = "ASCENDING" : I && (A.boundary_order = "DESCENDING"));
	let L;
	return o && (L = [], S !== void 0 && L.push({
		page_type: "DICTIONARY_PAGE",
		encoding: "PLAIN",
		count: 1
	}), L.push({
		page_type: "DATA_PAGE_V2",
		encoding: D,
		count: k.length
	})), {
		chunk: {
			meta_data: {
				type: u,
				encodings: v,
				path_in_schema: a.slice(1).map((e) => e.name),
				codec: t.codec ?? "UNCOMPRESSED",
				num_values: BigInt(f.length),
				total_compressed_size: BigInt(e.offset - g),
				total_uncompressed_size: BigInt(_),
				data_page_offset: re,
				dictionary_page_offset: S,
				statistics: ee,
				encoding_stats: L,
				geospatial_statistics: b
			},
			file_offset: BigInt(g)
		},
		columnIndex: A,
		offsetIndex: j,
		bloomFilter: x
	};
}
function Qt(e, t, n, r, i = []) {
	if (!r) return [{
		start: 0,
		end: e.length
	}];
	let a = [], o = 0, s = 0;
	for (let c = 0; c < e.length; c++) {
		let l = vt(e[c], t, n);
		s += l;
		let u = !i.length || i[c] === 0;
		s >= r && c > o && u && (a.push({
			start: o,
			end: c
		}), o = c, s = l);
	}
	return o < e.length && a.push({
		start: o,
		end: e.length
	}), a;
}
function $t(e, t) {
	let n, r, i = 0n, a = en(t) ? 0n : void 0;
	for (let o of e) {
		if (o == null) {
			i++;
			continue;
		}
		let e = tn(o, t);
		(typeof e != "object" || e instanceof Uint8Array) && (typeof e == "number" && Number.isNaN(e) ? a !== void 0 && a++ : ((n === void 0 || nn(e, n) < 0) && (n = e), (r === void 0 || nn(e, r) > 0) && (r = e)));
	}
	return n === 0 && (n = -0), r === 0 && (r = 0), {
		min_value: n,
		max_value: r,
		null_count: i,
		nan_count: a
	};
}
function en({ type: e, logical_type: t }) {
	return e === "FLOAT" || e === "DOUBLE" || t?.type === "FLOAT16";
}
function tn(e, t) {
	return t.converted_type === "DECIMAL" && typeof e == "number" ? BigInt(Math.round(e * 10 ** (t.scale || 0))) : e instanceof Date && (t.type === "INT32" || t.type === "INT64") ? X(t, [e])[0] : e;
}
function nn(e, t) {
	if (e instanceof Uint8Array && t instanceof Uint8Array) {
		let n = Math.min(e.length, t.length);
		for (let r = 0; r < n; r += 1) if (e[r] !== t[r]) return e[r] - t[r];
		return e.length - t.length;
	}
	return typeof e == "string" && typeof t == "string" ? rn(e, t) : e < t ? -1 : +(e > t);
}
function rn(e, t) {
	if (e === t) return 0;
	let n = Math.min(e.length, t.length), r = 0;
	for (; r < n && e.charCodeAt(r) === t.charCodeAt(r);) r++;
	if (r > 0) {
		let t = e.charCodeAt(r - 1);
		t >= 55296 && t <= 56319 && r--;
	}
	for (; r < e.length && r < t.length;) {
		let n = an(e, r), i = an(t, r);
		if (n !== i) return n - i;
		r += n > 65535 ? 2 : 1;
	}
	return e.length - t.length;
}
function an(e, t) {
	let n = e.codePointAt(t) ?? 65533;
	return n >= 55296 && n <= 57343 ? 65533 : n;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/dremel.js
function on(e, t) {
	let n = e.map((e) => e.element);
	if (e.length < 2) throw Error("parquet schema path must include column");
	let r = [], i = [], a = Ae(e);
	if (e.length === 2 && a === 0) return {
		values: t,
		definitionLevels: r,
		repetitionLevels: i,
		maxDefinitionLevel: a
	};
	if (e.length === 2 && a === 1) {
		let e = Array(t.length);
		for (let n = 0; n < t.length; n++) e[n] = t[n] === null || t[n] === void 0 ? 0 : 1;
		return {
			values: t,
			definitionLevels: e,
			repetitionLevels: i,
			maxDefinitionLevel: a
		};
	}
	let o = Array(e.length), s = 0;
	for (let t = 0; t < e.length; t++) o[t] = s, n[t].repetition_type === "REPEATED" && s++;
	let c = [];
	for (let e of t) l(1, e, 0, 0, !1);
	return {
		values: c,
		definitionLevels: r,
		repetitionLevels: i,
		maxDefinitionLevel: a
	};
	function l(t, a, s, d, f) {
		let p = n[t], m = p.repetition_type || "REQUIRED";
		if (t === e.length - 1) {
			if (a == null) {
				if (m === "REQUIRED" && !f) throw Error("parquet required value is undefined");
				r.push(s);
			} else r.push(m === "REQUIRED" ? s : s + 1);
			i.push(d), c.push(a);
		} else if (m === "REPEATED") {
			if (a == null) {
				if (!f) throw Error("parquet required value is undefined");
				l(t + 1, void 0, s, d, !0);
				return;
			}
			if (!Array.isArray(a)) throw Error(`parquet repeated field ${p.name} must be an array`);
			if (!a.length) {
				l(t + 1, void 0, s, d, !0);
				return;
			}
			let r = Me(e[t - 1]), i = n[t + 1];
			for (let e = 0; e < a.length; e++) {
				let n = a[e];
				r && n && typeof n == "object" && i && (n = n[i.name]);
				let c = e === 0 ? d : o[t] + 1;
				l(t + 1, n, s + 1, c, !1);
			}
		} else if (m === "OPTIONAL") {
			if (a == null) l(t + 1, void 0, s, d, !0);
			else {
				let n = u(t, a), r = n == null, i = je(e[t]) || Me(e[t]), o = p.num_children && !p.type && !i || !r ? s + 1 : s;
				l(t + 1, n, o, d, r);
			}
		} else if (a == null) {
			if (!f) throw Error("parquet required value is undefined");
			l(t + 1, void 0, s, d, !0);
		} else l(t + 1, u(t, a), s, d, !1);
	}
	function u(t, r) {
		if (r == null) return;
		let i = n[t + 1];
		if (i) {
			if (je(e[t])) return r;
			if (Me(e[t])) return sn(r, n[t]);
			if (typeof r == "object" && !Array.isArray(r)) return r[i.name];
			throw Error(`parquet expected struct, got ${r}`);
		}
	}
}
function sn(e, t) {
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
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/indexes.js
function cn(e, t) {
	for (let { chunk: n, columnIndex: r } of t) ln(e, n, r);
	for (let { chunk: n, offsetIndex: r } of t) un(e, n, r);
}
function ln(e, t, n) {
	if (!n || n.min_values.length <= 1) return;
	let r = e.offset;
	C(e, {
		field_1: n.null_pages,
		field_2: n.min_values,
		field_3: n.max_values,
		field_4: se.indexOf(n.boundary_order),
		field_5: n.null_counts,
		field_8: n.nan_counts
	}), t.column_index_offset = BigInt(r), t.column_index_length = e.offset - r;
}
function un(e, t, n) {
	if (!n || n.page_locations.length <= 1) return;
	let r = e.offset;
	C(e, { field_1: n.page_locations.map((e) => ({
		field_1: e.offset,
		field_2: e.compressed_page_size,
		field_3: e.first_row_index
	})) }), t.offset_index_offset = BigInt(r), t.offset_index_length = e.offset - r;
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/metadata.js
function dn(e, t, n) {
	let r = ut(t.schema), i = {
		field_1: t.version,
		field_2: t.schema.map((e) => ({
			field_1: e.type && N.indexOf(e.type),
			field_2: e.type_length,
			field_3: e.repetition_type && F.indexOf(e.repetition_type),
			field_4: e.name,
			field_5: e.num_children,
			field_6: e.converted_type && I.indexOf(e.converted_type),
			field_7: e.scale,
			field_8: e.precision,
			field_9: e.field_id,
			field_10: pn(e.logical_type)
		})),
		field_3: t.num_rows,
		field_4: t.row_groups.map((e) => ({
			field_1: e.columns.map((e) => ({
				field_1: e.file_path,
				field_2: e.file_offset,
				field_3: e.meta_data && {
					field_1: N.indexOf(e.meta_data.type),
					field_2: e.meta_data.encodings.map((e) => P.indexOf(e)),
					field_3: e.meta_data.path_in_schema,
					field_4: L.indexOf(e.meta_data.codec),
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
					field_12: e.meta_data.statistics && Jt(e.meta_data.statistics, s(e.meta_data.path_in_schema), n),
					field_13: e.meta_data.encoding_stats && e.meta_data.encoding_stats.map((e) => ({
						field_1: oe.indexOf(e.page_type),
						field_2: P.indexOf(e.encoding),
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
						field_1: e.meta_data.geospatial_statistics.bbox && fn(e.meta_data.geospatial_statistics.bbox),
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
		field_6: t.created_by,
		field_7: t.schema.filter((e) => e.type).map(() => ({ field_1: {} }))
	}, a = e.offset;
	C(e, i);
	let o = e.offset - a;
	e.appendUint32(o);
	function s(e) {
		let t = r(e);
		return t[t.length - 1].element;
	}
}
function fn(e) {
	return new S([
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
function pn(e) {
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
			field_2: mn(e.unit)
		} };
		if (e.type === "TIMESTAMP") return { field_8: {
			field_1: e.isAdjustedToUTC,
			field_2: mn(e.unit)
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
			field_2: e.algorithm && ce.indexOf(e.algorithm)
		} };
	}
}
function mn(e) {
	return e === "NANOS" ? { field_3: {} } : e === "MICROS" ? { field_2: {} } : { field_1: {} };
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/snappy.js
var hn = 14, gn = 65535, _n = Array(15);
function vn(t) {
	let n = new e();
	return n.appendVarInt(t.length), Cn(n, t), n.getBytes();
}
function Q(e, t) {
	return Math.imul(e, 506832829) >>> t;
}
function $(e, t) {
	return e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
}
function yn(e, t, n) {
	return e[t] === e[n] && e[t + 1] === e[n + 1] && e[t + 2] === e[n + 2] && e[t + 3] === e[n + 3];
}
function bn(e, t, n, r) {
	if (r <= 60) e.appendUint8(r - 1 << 2);
	else {
		let t = r - 1, n = t < 256 ? 1 : t < 65536 ? 2 : t < 16777216 ? 3 : 4;
		e.appendUint8(59 + n << 2);
		for (let r = 0; r < n; r++) e.appendUint8(t >>> r * 8);
	}
	e.appendBytes(t.subarray(n, n + r));
}
function xn(e, t, n) {
	n < 12 && t < 2048 ? (e.appendUint8(1 + (n - 4 << 2) + (t >>> 8 << 5)), e.appendUint8(t & 255)) : (e.appendUint8(2 + (n - 1 << 2)), e.appendUint8(t & 255), e.appendUint8(t >>> 8));
}
function Sn(e, t, n) {
	for (; n >= 68;) xn(e, t, 64), n -= 64;
	n > 64 && (xn(e, t, 60), n -= 60), xn(e, t, n);
}
function Cn(e, t) {
	let n = t.length, r = 1;
	for (; 1 << r <= n && r <= hn;) r++;
	r--;
	let i = 32 - r;
	_n[r] ??= new Uint32Array(1 << r);
	let a = _n[r];
	a.fill(0);
	let o = n, s, c = 0, l = 0, u, d, f, p, m, h, g, _, v, y, b, x = !0;
	if (n >= 15) for (s = o - 15, c++, d = Q($(t, c), i); x;) {
		m = 32, f = c;
		do {
			if (c = f, u = d, h = m >>> 5, m++, f = c + h, c > s) {
				x = !1;
				break;
			}
			d = Q($(t, f), i), p = a[u], a[u] = c;
		} while (c - p > gn || !yn(t, c, p));
		if (!x) break;
		bn(e, t, l, c - l);
		do {
			for (g = c, _ = 4; c + _ < o && t[c + _] === t[p + _];) _++;
			if (c += _, v = g - p, Sn(e, v, _), l = c, c >= s) {
				x = !1;
				break;
			}
			y = Q($(t, c - 1), i), a[y] = c - 1, b = Q($(t, c), i), p = a[b], a[b] = c;
		} while (c - p <= gn && yn(t, c, p));
		if (!x) break;
		c++, d = Q($(t, c), i);
	}
	l < o && bn(e, t, l, o - l);
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/parquet-writer.js
var wn = class {
	constructor({ writer: e, schema: t, codec: n = "SNAPPY", compressors: r, statistics: i = !0, statisticsTruncateLength: a, kvMetadata: o, createdBy: s = "hyparquet" }) {
		if (a !== void 0 && a !== Infinity && !(Number.isInteger(a) && a > 0)) throw Error("statisticsTruncateLength must be a positive integer or Infinity");
		this.writer = e, this.schema = t, this.codec = n, this.compressors = {
			SNAPPY: vn,
			...r
		}, this.statistics = i, this.statisticsTruncateLength = a, this.kvMetadata = o, this.createdBy = s, this.row_groups = [], this.num_rows = 0n, this.pendingIndexes = [], this.writer.appendUint32(827474256);
	}
	write({ columnData: e, rowGroupSize: t = [1e3, 1e5], pageSize: n = 1048576, dictionarySize: r }) {
		for (let { codec: t = this.codec } of e) if (t !== "UNCOMPRESSED" && !this.compressors[t]) throw Error(`parquet no compressor for codec ${t}`);
		let i = e[0]?.data?.length || 0, a = ut(this.schema), o;
		for (let { groupStartIndex: s, groupSize: c } of En({
			columnDataRows: i,
			rowGroupSize: t
		})) {
			let t = () => {
				let t = this.writer.offset, o = [];
				for (let t = 0; t < e.length; t++) {
					let { name: l, data: u, encoding: d, codec: f = this.codec, columnIndex: p = !1, offsetIndex: m = !0, shredding: h, bloomFilter: g, statistics: _ = this.statistics } = e[t];
					if (p && !m) throw Error("parquet ColumnIndex cannot be present without OffsetIndex");
					if (u.length !== i) throw Error("parquet columns must have the same length");
					let v = u.slice(s, s + c), y = a([l]), b = Dn(y), x = y.at(-1)?.element, S = h && h !== !0 ? h : void 0, C = x?.logical_type?.type === "VARIANT", w = x?.repetition_type === "REQUIRED", T = C ? He(Array.from(v), S, {
						name: l,
						required: w
					}) : v;
					for (let e of b) {
						let t = e.map((e) => e.element), i = {
							columnName: t.slice(1).map((e) => e.name).join("."),
							element: t[t.length - 1],
							schemaPath: t,
							codec: f,
							compressors: this.compressors,
							stats: _,
							statisticsTruncateLength: this.statisticsTruncateLength,
							pageSize: n,
							dictionarySize: r,
							columnIndex: p,
							offsetIndex: m,
							encoding: d,
							bloomFilter: g
						}, a = on(e, T), s = Zt({
							writer: this.writer,
							column: i,
							pageData: a
						});
						o.push(s.chunk), this.pendingIndexes.push(s);
					}
				}
				let l = 0n;
				for (let { meta_data: e } of o) l += e?.total_uncompressed_size ?? 0n;
				return this.num_rows += BigInt(c), this.row_groups.push({
					columns: o,
					total_byte_size: l,
					num_rows: BigInt(c),
					total_compressed_size: BigInt(this.writer.offset - t)
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
		cn(this.writer, this.pendingIndexes), ae(this.writer, this.pendingIndexes);
		let e = {
			version: 2,
			created_by: this.createdBy,
			schema: this.schema,
			num_rows: this.num_rows,
			row_groups: this.row_groups,
			metadata_length: 0,
			key_value_metadata: this.kvMetadata
		};
		return delete e.metadata_length, dn(this.writer, e, this.statisticsTruncateLength), this.writer.appendUint32(827474256), this.writer.finish();
	}
};
function Tn(e, t) {
	return Array.isArray(e) ? e[Math.min(t, e.length - 1)] : e;
}
function En({ columnDataRows: e, rowGroupSize: t }) {
	if (Array.isArray(t) && !t.length) throw Error("rowGroupSize array cannot be empty");
	let n = [], r = 0, i = 0;
	for (; i < e;) {
		let a = Tn(t, r);
		n.push({
			groupStartIndex: i,
			groupSize: Math.min(a, e - i)
		}), i += a, r++;
	}
	return n;
}
function Dn(e) {
	let t = [];
	return n(e), t;
	function n(e) {
		let r = e[e.length - 1];
		if (!r.children.length) t.push(e);
		else for (let t of r.children) n([...e, t]);
	}
}
// node_modules/.pnpm/hyparquet-writer@0.17.0/node_modules/hyparquet-writer/src/write.js
function On({ writer: e, columnData: t, schema: n, codec: r = "SNAPPY", compressors: i, statistics: a = !0, statisticsTruncateLength: o, rowGroupSize: s = [1e3, 1e5], kvMetadata: c, createdBy: l, pageSize: u = 1048576, dictionarySize: d }) {
	if (t = t.map((e) => {
		if (e.shredding === !0 && e.type === "VARIANT") {
			let t = Je(Array.from(e.data));
			return t ? {
				...e,
				shredding: t
			} : {
				...e,
				shredding: void 0
			};
		}
		if (e.shredding !== void 0 && e.shredding !== !0 && e.type === "VARIANT") {
			let t = U(e.shredding);
			return t ? {
				...e,
				shredding: t
			} : {
				...e,
				shredding: void 0
			};
		}
		return e;
	}), !n) n = it({ columnData: t });
	else if (t.some(({ type: e }) => e)) throw Error("cannot provide both schema and columnData type");
	let f = new wn({
		writer: e,
		schema: n,
		codec: r,
		compressors: i,
		statistics: a,
		statisticsTruncateLength: o,
		kvMetadata: c,
		createdBy: l
	}), p = f.write({
		columnData: t,
		rowGroupSize: s,
		pageSize: u,
		dictionarySize: d
	});
	return p ? p.then(() => f.finish()) : f.finish();
}
function kn(t) {
	let n = new e();
	return On({
		...t,
		writer: n
	}), n.getBuffer();
}
export { kn as parquetWriteBuffer };
