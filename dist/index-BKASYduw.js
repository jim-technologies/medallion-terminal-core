function A(e = 1024) {
  return this.buffer = new ArrayBuffer(e), this.view = new DataView(this.buffer), this.offset = 0, this.index = 0, this;
}
A.prototype.ensure = function(e) {
  if (this.index + e > this.buffer.byteLength) {
    const t = Math.max(this.buffer.byteLength * 2, this.index + e), n = new ArrayBuffer(t);
    new Uint8Array(n).set(new Uint8Array(this.buffer)), this.buffer = n, this.view = new DataView(this.buffer);
  }
};
A.prototype.finish = function() {
};
A.prototype.getBuffer = function() {
  return this.buffer.slice(0, this.index);
};
A.prototype.getBytes = function() {
  return new Uint8Array(this.buffer, 0, this.index);
};
A.prototype.appendUint8 = function(e) {
  this.ensure(this.index + 1), this.view.setUint8(this.index, e), this.offset++, this.index++;
};
A.prototype.appendUint32 = function(e) {
  this.ensure(this.index + 4), this.view.setUint32(this.index, e, !0), this.offset += 4, this.index += 4;
};
A.prototype.appendInt32 = function(e) {
  this.ensure(this.index + 4), this.view.setInt32(this.index, e, !0), this.offset += 4, this.index += 4;
};
A.prototype.appendInt64 = function(e) {
  this.ensure(this.index + 8), this.view.setBigInt64(this.index, BigInt(e), !0), this.offset += 8, this.index += 8;
};
A.prototype.appendFloat32 = function(e) {
  this.ensure(this.index + 8), this.view.setFloat32(this.index, e, !0), this.offset += 4, this.index += 4;
};
A.prototype.appendFloat64 = function(e) {
  this.ensure(this.index + 8), this.view.setFloat64(this.index, e, !0), this.offset += 8, this.index += 8;
};
A.prototype.appendBuffer = function(e) {
  this.appendBytes(new Uint8Array(e));
};
A.prototype.appendBytes = function(e) {
  this.ensure(this.index + e.length), new Uint8Array(this.buffer, this.index, e.length).set(e), this.offset += e.length, this.index += e.length;
};
A.prototype.appendVarInt = function(e) {
  for (; ; )
    if ((e & -128) === 0) {
      this.appendUint8(e);
      return;
    } else
      this.appendUint8(e & 127 | 128), e >>>= 7;
};
A.prototype.appendVarBigInt = function(e) {
  for (; ; )
    if ((e & ~0x7fn) === 0n) {
      this.appendUint8(Number(e));
      return;
    } else
      this.appendUint8(Number(e & 0x7fn | 0x80n)), e >>= 7n;
};
A.prototype.appendZigZag = function(e) {
  typeof e == "number" ? this.appendVarInt(e << 1 ^ e >> 31) : this.appendVarBigInt(e << 1n ^ e >> 63n);
};
function Je(e, t, n) {
  const i = e[t], o = [];
  let r = 1;
  if (i.num_children)
    for (; o.length < i.num_children; ) {
      const f = e[t + r], s = Je(e, t + r, [...n, f.name]);
      r += s.count, o.push(s);
    }
  return { count: r, element: i, children: o, path: n };
}
function Qe(e, t) {
  let n = Je(e, 0, []);
  const i = [n];
  for (const o of t) {
    const r = n.children.find((f) => f.element.name === o);
    if (!r) throw new Error(`parquet schema element not found: ${t}`);
    i.push(r), n = r;
  }
  return i;
}
function Tt(e) {
  let t = 0;
  for (const { element: n } of e.slice(1))
    n.repetition_type !== "REQUIRED" && t++;
  return t;
}
function Se(e) {
  if (!e || e.element.converted_type !== "LIST" || e.children.length > 1) return !1;
  const t = e.children[0];
  return !(t.children.length > 1 || t.element.repetition_type !== "REPEATED");
}
function me(e) {
  if (!e || e.element.converted_type !== "MAP" || e.children.length > 1) return !1;
  const t = e.children[0];
  return !(t.children.length !== 2 || t.element.repetition_type !== "REPEATED" || t.children.find((o) => o.element.name === "key")?.element.repetition_type === "REPEATED" || t.children.find((o) => o.element.name === "value")?.element.repetition_type === "REPEATED");
}
const w = 0xffffffffffffffffn, S = 0x9e3779b185ebca87n, Q = 0xc2b2ae3d27d4eb4fn, Pe = 0x165667b19e3779f9n, ve = 0x85ebca77c2b2ae63n, Ye = 0x27d4eb2f165667c5n;
function x(e, t) {
  return (e << t | e >> 64n - t) & w;
}
function V(e, t) {
  return e = e + t * Q & w, e = x(e, 31n), e * S & w;
}
function fe(e, t) {
  return e ^= V(0n, t), e * S + ve & w;
}
function O(e, t = 0n) {
  const n = new DataView(e.buffer, e.byteOffset, e.byteLength), i = e.byteLength;
  let o = 0, r;
  if (i >= 32) {
    let f = t + S + Q & w, s = t + Q & w, a = t, u = t - S & w;
    for (; o + 32 <= i; )
      f = V(f, n.getBigUint64(o, !0)), o += 8, s = V(s, n.getBigUint64(o, !0)), o += 8, a = V(a, n.getBigUint64(o, !0)), o += 8, u = V(u, n.getBigUint64(o, !0)), o += 8;
    r = x(f, 1n) + x(s, 7n) + x(a, 12n) + x(u, 18n) & w, r = fe(r, f), r = fe(r, s), r = fe(r, a), r = fe(r, u);
  } else
    r = t + Ye & w;
  for (r = r + BigInt(i) & w; o + 8 <= i; )
    r ^= V(0n, n.getBigUint64(o, !0)), r = x(r, 27n) * S + ve & w, o += 8;
  for (o + 4 <= i && (r ^= BigInt(n.getUint32(o, !0)) * S & w, r = x(r, 23n) * Q + Pe & w, o += 4); o < i; )
    r ^= BigInt(n.getUint8(o)) * Ye & w, r = x(r, 11n) * S & w, o += 1;
  return r ^= r >> 33n, r = r * Q & w, r ^= r >> 29n, r = r * Pe & w, r ^= r >> 32n, r;
}
const wt = new TextEncoder();
function bt(e, t) {
  if (e == null) return;
  const { type: n, converted_type: i, logical_type: o } = t;
  if (n === "BOOLEAN")
    return typeof e != "boolean" ? void 0 : O(new Uint8Array([e ? 1 : 0]));
  if (n === "FLOAT") {
    if (typeof e != "number") return;
    const r = new ArrayBuffer(4);
    return new DataView(r).setFloat32(0, e, !0), O(new Uint8Array(r));
  }
  if (n === "DOUBLE") {
    if (typeof e != "number") return;
    const r = new ArrayBuffer(8);
    return new DataView(r).setFloat64(0, e, !0), O(new Uint8Array(r));
  }
  if (n === "INT32") {
    if (i === "DATE" || i === "DECIMAL" || i === "TIME_MILLIS" || o?.type === "DATE" || o?.type === "TIME" || o?.type === "DECIMAL" || typeof e != "number" || !Number.isInteger(e)) return;
    const r = new ArrayBuffer(4);
    return new DataView(r).setInt32(0, e | 0, !0), O(new Uint8Array(r));
  }
  if (n === "INT64") {
    if (i === "TIMESTAMP_MILLIS" || i === "TIMESTAMP_MICROS" || i === "TIME_MICROS" || i === "DECIMAL" || o?.type === "TIMESTAMP" || o?.type === "TIME" || o?.type === "DECIMAL") return;
    let r;
    if (typeof e == "bigint") r = e;
    else if (typeof e == "number" && Number.isSafeInteger(e)) r = BigInt(e);
    else return;
    const f = new ArrayBuffer(8);
    return new DataView(f).setBigUint64(0, BigInt.asUintN(64, r), !0), O(new Uint8Array(f));
  }
  if (n === "BYTE_ARRAY")
    return i === "JSON" || i === "BSON" || i === "DECIMAL" || o?.type === "JSON" || o?.type === "BSON" || o?.type === "VARIANT" || o?.type === "GEOMETRY" || o?.type === "GEOGRAPHY" ? void 0 : typeof e == "string" ? O(wt.encode(e)) : e instanceof Uint8Array ? O(e) : void 0;
  if (n === "FIXED_LEN_BYTE_ARRAY")
    return i === "DECIMAL" || i === "INTERVAL" || o?.type === "DECIMAL" || o?.type === "UUID" || o?.type === "FLOAT16" || o?.type === "GEOMETRY" || o?.type === "GEOGRAPHY" ? void 0 : e instanceof Uint8Array ? O(e) : void 0;
}
const Bt = 0, Ne = 1, de = 2, et = 3, ue = 5, tt = 6, G = 7, ce = 8, nt = 9, Oe = 12;
function ee(e, t) {
  Te(e, Oe, t);
}
function Te(e, t, n) {
  if (t !== Ne && t !== de)
    if (t === et && typeof n == "number")
      e.appendUint8(n);
    else if (t === ue && typeof n == "number")
      e.appendZigZag(n);
    else if (t === tt && typeof n == "bigint")
      e.appendZigZag(n);
    else if (t === G && typeof n == "number")
      e.appendFloat64(n);
    else if (t === ce && typeof n == "string") {
      const i = new TextEncoder().encode(n);
      e.appendVarInt(i.length), e.appendBytes(i);
    } else if (t === ce && n instanceof Uint8Array)
      e.appendVarInt(n.byteLength), e.appendBytes(n);
    else if (t === nt && Array.isArray(n)) {
      const i = Ut(n);
      if (n.length > 14 ? (e.appendUint8(240 | i), e.appendVarInt(n.length)) : e.appendUint8(n.length << 4 | i), i === de)
        for (const o of n)
          e.appendUint8(o ? 1 : 0);
      else
        for (const o of n)
          Te(e, i, o);
    } else if (t === Oe && typeof n == "object") {
      let i = 0;
      for (const [o, r] of Object.entries(n)) {
        if (r === void 0) continue;
        const f = parseInt(o.replace(/^field_/, ""), 10);
        if (Number.isNaN(f))
          throw new Error(`thrift invalid field name: ${o}. Expected "field_###"`);
        const s = it(r), a = f - i;
        if (a <= 0)
          throw new Error(`thrift non-monotonic field id: fid=${f}, lastFid=${i}`);
        a > 15 ? (e.appendUint8(s), e.appendZigZag(f)) : e.appendUint8(a << 4 | s), Te(e, s, r), i = f;
      }
      e.appendUint8(Bt);
    } else
      throw new Error(`thrift invalid type ${t} for value ${n}`);
}
function it(e) {
  if (e === !0) return Ne;
  if (e === !1) return de;
  if (Number.isInteger(e)) return ue;
  if (typeof e == "number") return G;
  if (typeof e == "bigint") return tt;
  if (typeof e == "string" || e instanceof Uint8Array) return ce;
  if (Array.isArray(e)) return nt;
  if (e && typeof e == "object") return Oe;
  throw new Error(`Cannot determine thrift compact type for: ${e}`);
}
function Ut(e) {
  let t = 0;
  for (const n of e) {
    let i = it(n);
    if (i === Ne && (i = de), t || (t = i), t === G && i === ue && (i = G), t === ue && i === G && (t = G), i !== t)
      throw new Error(`thrift invalid type for list element: ${n} (expected type ${t})`);
  }
  return t ?? et;
}
const Rt = new Uint32Array([
  1203114875,
  1150766481,
  2284105051,
  2729912477,
  1884591559,
  770785867,
  2667333959,
  1550580529
]), Nt = 32, Ce = 32, Fe = 128 * 1024 * 1024;
function Ot(e, t) {
  return Number((e >> 32n) * BigInt(t) >> 32n);
}
function xt(e) {
  const t = new Uint32Array(8), n = Number(e & 0xffffffffn) | 0;
  for (let i = 0; i < 8; i++)
    t[i] = 1 << (Math.imul(n, Rt[i]) >>> 27);
  return t;
}
function Lt(e, t) {
  const n = Ot(t, e.length >> 3) << 3, i = xt(t);
  for (let o = 0; o < 8; o++)
    e[n + o] |= i[o];
}
function Dt(e) {
  let t = 1;
  for (; t < e; ) t <<= 1;
  return t;
}
function Mt(e, t) {
  if (!(t > 0 && t < 1)) throw new Error(`bloom filter fpp must be in (0, 1), got ${t}`);
  if (!(e >= 0)) throw new Error(`bloom filter ndv must be >= 0, got ${e}`);
  const n = -8 * e / Math.log(1 - t ** (1 / 8));
  let i = Math.ceil(n);
  (!isFinite(i) || i > Fe << 3) && (i = Fe << 3);
  const o = Nt << 3;
  i = Math.ceil(i / o) * o;
  let r = i >> 3;
  return r < Ce && (r = Ce), r < 1024 && (r = Dt(r)), r;
}
class St {
  /**
   * @param {SchemaElement} element
   * @param {{ fpp?: number, maxBytes?: number }} [options]
   */
  constructor(t, { fpp: n = 0.01, maxBytes: i = 1024 * 1024 } = {}) {
    this.element = t, this.fpp = n, this.maxBytes = i, this.hashes = /* @__PURE__ */ new Set(), this.skipped = 0;
  }
  /** @param {any} value */
  insert(t) {
    if (t == null) return;
    const n = bt(t, this.element);
    if (n === void 0) {
      this.skipped++;
      return;
    }
    this.hashes.add(n);
  }
  /** @returns {Uint32Array | undefined} */
  finalize() {
    if (this.skipped > 0 || this.hashes.size === 0) return;
    const t = Mt(this.hashes.size, this.fpp);
    if (t > this.maxBytes) return;
    const n = new Uint32Array(t >> 2);
    for (const i of this.hashes) Lt(n, i);
    return n;
  }
}
function Pt(e, t) {
  if (t.length % 8 !== 0)
    throw new Error(`bloom filter block count must be a multiple of 8 uint32 words, got ${t.length}`);
  ee(e, {
    field_1: t.byteLength,
    // numBytes
    field_2: { field_1: {} },
    // algorithm: SplitBlockAlgorithm
    field_3: { field_1: {} },
    // hash: XxHash
    field_4: { field_1: {} }
    // compression: Uncompressed
  });
  for (let n = 0; n < t.length; n++)
    e.appendUint32(t[n]);
}
function Yt(e, t) {
  for (const { chunk: n, bloomFilter: i } of t) {
    if (!i || !n.meta_data) continue;
    const o = e.offset;
    Pt(e, i), n.meta_data.bloom_filter_offset = BigInt(o), n.meta_data.bloom_filter_length = e.offset - o;
  }
}
const Ve = [
  "BOOLEAN",
  "INT32",
  "INT64",
  "INT96",
  // deprecated
  "FLOAT",
  "DOUBLE",
  "BYTE_ARRAY",
  "FIXED_LEN_BYTE_ARRAY"
], P = [
  "PLAIN",
  "GROUP_VAR_INT",
  // deprecated
  "PLAIN_DICTIONARY",
  "RLE",
  "BIT_PACKED",
  // deprecated
  "DELTA_BINARY_PACKED",
  "DELTA_LENGTH_BYTE_ARRAY",
  "DELTA_BYTE_ARRAY",
  "RLE_DICTIONARY",
  "BYTE_STREAM_SPLIT"
], Ct = [
  "REQUIRED",
  "OPTIONAL",
  "REPEATED"
], Ft = [
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
], Vt = [
  "UNCOMPRESSED",
  "SNAPPY",
  "GZIP",
  "LZO",
  "BROTLI",
  "LZ4",
  "ZSTD",
  "LZ4_RAW"
], rt = [
  "DATA_PAGE",
  "INDEX_PAGE",
  "DICTIONARY_PAGE",
  "DATA_PAGE_V2"
], kt = [
  "UNORDERED",
  "ASCENDING",
  "DESCENDING"
], Gt = [
  "SPHERICAL",
  "VINCENTY",
  "THOMAS",
  "ANDOYER",
  "KARNEY"
], ae = 128, k = 4, K = ae / k;
function q(e, t) {
  const n = t.length;
  if (n === 0) {
    e.appendVarInt(ae), e.appendVarInt(k), e.appendVarInt(0), e.appendVarInt(0);
    return;
  }
  if (typeof t[0] != "number" && typeof t[0] != "bigint")
    throw new Error("deltaBinaryPack only supports number or bigint arrays");
  e.appendVarInt(ae), e.appendVarInt(k), e.appendVarInt(n), e.appendZigZag(t[0]);
  let i = 1;
  for (; i < n; ) {
    const o = Math.min(i + ae, n), r = o - i, f = new BigInt64Array(r);
    let s = BigInt(t[i]) - BigInt(t[i - 1]);
    f[0] = s;
    for (let u = 1; u < r; u++) {
      const c = BigInt(t[i + u]) - BigInt(t[i + u - 1]);
      f[u] = c, c < s && (s = c);
    }
    e.appendZigZag(s);
    const a = new Uint8Array(k);
    for (let u = 0; u < k; u++) {
      const c = u * K, d = Math.min(c + K, r);
      let l = 0n;
      for (let _ = c; _ < d; _++) {
        const p = f[_] - s;
        p > l && (l = p);
      }
      a[u] = jt(l);
    }
    e.appendBytes(a);
    for (let u = 0; u < k; u++) {
      const c = a[u];
      if (c === 0) continue;
      const d = u * K, l = Math.min(d + K, r);
      let _ = 0n, p = 0;
      for (let m = 0; m < K; m++) {
        const E = d + m < l ? f[d + m] - s : 0n;
        for (_ |= E << BigInt(p), p += c; p >= 8; )
          e.appendUint8(Number(_ & 0xffn)), _ >>= 8n, p -= 8;
      }
    }
    i = o;
  }
}
function qt(e, t) {
  const n = new Int32Array(t.length);
  for (let i = 0; i < t.length; i++) {
    const o = t[i];
    if (!(o instanceof Uint8Array))
      throw new Error("deltaLengthByteArray expects Uint8Array values");
    n[i] = o.length;
  }
  q(e, n);
  for (const i of t)
    e.appendBytes(i);
}
function $t(e, t) {
  if (t.length === 0) {
    q(e, []), q(e, []);
    return;
  }
  const n = new Int32Array(t.length), i = new Int32Array(t.length), o = new Array(t.length);
  if (!(t[0] instanceof Uint8Array))
    throw new Error("deltaByteArray expects Uint8Array values");
  n[0] = 0, i[0] = t[0].length, o[0] = t[0];
  for (let f = 1; f < t.length; f++) {
    const s = t[f - 1], a = t[f];
    if (!(a instanceof Uint8Array))
      throw new Error("deltaByteArray expects Uint8Array values");
    let u = 0;
    const c = Math.min(s.length, a.length);
    for (; u < c && s[u] === a[u]; )
      u++;
    n[f] = u, i[f] = a.length - u, o[f] = a.subarray(u);
  }
  q(e, n), q(e, i);
  for (const f of o)
    e.appendBytes(f);
}
function jt(e) {
  if (e === 0n) return 0;
  let t = 0;
  for (; e > 0n; )
    t++, e >>= 1n;
  return t;
}
function le(e, t, n) {
  const i = e.offset;
  let o = 0, r = 0, f = 0;
  for (; f < t.length; ) {
    let s = 1;
    const a = t[f];
    for (; f + s < t.length && t[f + s] === a; )
      s++;
    s >= 8 ? (o && (ke(e, t, r, o, n), o = 0), zt(e, a, s, n), f += s) : (o === 0 && (r = f), o++, f += 8);
  }
  return o && ke(e, t, r, o, n), e.offset - i;
}
function zt(e, t, n, i) {
  e.appendVarInt(n << 1);
  const o = i + 7 >> 3;
  for (let r = 0; r < o; r++)
    e.appendUint8(t >> (r << 3) & 255);
}
function ke(e, t, n, i, o) {
  if (e.appendVarInt(i << 1 | 1), o === 0) return;
  const r = (1 << o) - 1;
  let f = 0, s = 0;
  const a = i * 8;
  for (let u = 0; u < a; u++) {
    const c = n + u, d = c < t.length ? t[c] & r : 0;
    for (f |= d << s, s += o; s >= 8; )
      e.appendUint8(f & 255), f >>>= 8, s -= 8;
  }
  s > 0 && e.appendUint8(f & 255);
}
function ot(e, t, n, i) {
  if (n === "BOOLEAN")
    Ht(e, t);
  else if (n === "INT32")
    Xt(e, t);
  else if (n === "INT64")
    Zt(e, t);
  else if (n === "FLOAT")
    Kt(e, t);
  else if (n === "DOUBLE")
    Wt(e, t);
  else if (n === "BYTE_ARRAY")
    Jt(e, t);
  else if (n === "FIXED_LEN_BYTE_ARRAY") {
    if (!i) throw new Error("parquet FIXED_LEN_BYTE_ARRAY expected type_length");
    Qt(e, t, i);
  } else
    throw new Error(`parquet unsupported type: ${n}`);
}
function Ht(e, t) {
  let n = 0;
  for (let i = 0; i < t.length; i++) {
    const o = t[i];
    if (typeof o != "boolean") throw new Error("parquet expected boolean value, got " + o);
    const r = i % 8;
    o && (n |= 1 << r), r === 7 && (e.appendUint8(n), n = 0);
  }
  t.length % 8 && e.appendUint8(n);
}
function Xt(e, t) {
  for (const n of t) {
    if (!Number.isSafeInteger(n)) throw new Error("parquet expected integer value, got " + n);
    if (n < -2147483648 || n > 2147483647) throw new Error("parquet expected int32 value, got " + n);
    e.appendInt32(n);
  }
}
function Zt(e, t) {
  for (const n of t) {
    if (typeof n != "bigint") throw new Error("parquet expected bigint value, got " + n);
    e.appendInt64(n);
  }
}
function Kt(e, t) {
  for (const n of t) {
    if (typeof n != "number") throw new Error("parquet expected number value, got " + n);
    e.appendFloat32(n);
  }
}
function Wt(e, t) {
  for (const n of t) {
    if (typeof n != "number") throw new Error("parquet expected number value, got " + n);
    e.appendFloat64(n);
  }
}
function Jt(e, t) {
  for (const n of t) {
    let i = n;
    if (typeof i == "string" && (i = new TextEncoder().encode(n)), !(i instanceof Uint8Array))
      throw new Error("parquet expected Uint8Array value, got " + typeof i);
    e.appendUint32(i.length), e.appendBytes(i);
  }
}
function Qt(e, t, n) {
  for (const i of t) {
    if (!(i instanceof Uint8Array)) throw new Error("parquet expected Uint8Array value, got " + typeof i);
    if (i.length !== n) throw new Error(`parquet expected Uint8Array of length ${n}`);
    e.appendBytes(i);
  }
}
const ft = new TextEncoder(), st = -(2n ** 63n), at = 2n ** 63n - 1n, vt = new Uint8Array([0]), en = /* @__PURE__ */ new Set(["value", "typed_value"]), tn = /* @__PURE__ */ new Map(), nn = xe([]);
function rn(e, t, n) {
  if (n?.required) {
    for (let s = 0; s < e.length; s++)
      if (e[s] === void 0)
        throw new Error(`required variant column ${n.name} has undefined value at index ${s}`);
  }
  const i = t && j(t);
  if (i) {
    const s = /* @__PURE__ */ new Map();
    return e.map((a) => {
      if (a === void 0) return null;
      const u = /* @__PURE__ */ new Set();
      pe(a, u);
      const { metadata: c, keyIndex: d } = on(u, s);
      return { metadata: c, ...we(a, i, d, !0) };
    });
  }
  const o = un(e), r = xe(o), f = /* @__PURE__ */ new Map();
  for (let s = 0; s < o.length; s++)
    f.set(o[s], s);
  return e.map((s) => s === void 0 ? null : { metadata: r, value: M(s, f) });
}
function we(e, t, n, i) {
  if (e == null)
    return { value: vt, typed_value: null };
  if (Array.isArray(t)) {
    if (!Array.isArray(e))
      return { value: M(e, n), typed_value: null };
    const o = t[0];
    return { value: null, typed_value: e.map((r) => we(r, o, n, !1)) };
  }
  if (typeof t == "object") {
    if (typeof e != "object" || Array.isArray(e) || e instanceof Date || e instanceof Uint8Array)
      return { value: M(e, n), typed_value: null };
    const o = {};
    let r = !1;
    for (const c of Object.keys(e))
      c in t || e[c] === void 0 || (o[c] = e[c], r = !0);
    if (r && !i)
      return { value: M(e, n), typed_value: null };
    const f = Object.keys(t);
    if (f.some(
      (c) => (!Object.prototype.hasOwnProperty.call(e, c) || e[c] === void 0) && n.has(c)
    ))
      return { value: M(e, n), typed_value: null };
    const a = {};
    for (const c of f)
      !Object.prototype.hasOwnProperty.call(e, c) || e[c] === void 0 || (a[c] = we(e[c], t[c], n, !1));
    return { value: r ? M(o, n) : null, typed_value: a };
  }
  return fn(e, t) ? { value: null, typed_value: e } : { value: M(e, n), typed_value: null };
}
function on(e, t) {
  if (e.size === 0)
    return { metadata: nn, keyIndex: tn };
  const n = [...e].sort(), i = n.join("\0"), o = t.get(i);
  if (o)
    return o;
  const r = xe(n), f = /* @__PURE__ */ new Map();
  for (let a = 0; a < n.length; a++) f.set(n[a], a);
  const s = { metadata: r, keyIndex: f };
  return t.set(i, s), s;
}
function fn(e, t) {
  if (e == null) return !1;
  switch (t) {
    case "BOOLEAN":
      return typeof e == "boolean";
    case "INT32":
      return typeof e == "number" && Number.isInteger(e) && e >= -2147483648 && e <= 2147483647;
    case "INT64":
      return typeof e == "bigint" && e >= st && e <= at;
    case "FLOAT":
      return typeof e == "number";
    case "DOUBLE":
      return typeof e == "number";
    case "STRING":
      return typeof e == "string";
    case "TIMESTAMP":
      return e instanceof Date;
    default:
      return !1;
  }
}
const Ge = 3, sn = 256;
function an(e) {
  const t = Be(e, 0);
  if (t === void 0 || typeof t != "object") return;
  const n = j(t);
  if (!(n === void 0 || be(n) > sn))
    return n;
}
function be(e) {
  if (Array.isArray(e)) return e.length ? be(e[0]) : 0;
  if (e && typeof e == "object") {
    let t = 0;
    for (const n of Object.keys(e)) t += be(e[n]);
    return t;
  }
  return 1;
}
function Be(e, t) {
  const n = [];
  for (const o of e)
    o != null && n.push(o);
  if (!n.length) return;
  if (n.some(qe)) {
    if (t >= Ge) return;
    const o = /* @__PURE__ */ new Map();
    for (const f of n)
      if (qe(f))
        for (const [s, a] of Object.entries(f)) {
          if (a === void 0) continue;
          const u = o.get(s);
          u ? u.push(a) : o.set(s, [a]);
        }
    const r = {};
    for (const [f, s] of o) {
      const a = Be(s, t + 1);
      a !== void 0 && (r[f] = a);
    }
    return Object.keys(r).length > 0 ? r : void 0;
  }
  if (n.every(Array.isArray)) {
    if (t >= Ge) return;
    const o = [];
    for (const f of n) for (const s of f) o.push(s);
    const r = Be(o, t + 1);
    return r === void 0 ? void 0 : [r];
  }
  let i;
  for (const o of n) {
    if (Array.isArray(o)) return;
    const r = o instanceof Date ? "date" : typeof o;
    if (i === void 0) i = r;
    else if (i !== r) return;
  }
  return i ? dn(i) : void 0;
}
function qe(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e) && !(e instanceof Date) && !(e instanceof Uint8Array);
}
function j(e) {
  if (Array.isArray(e)) {
    const t = e.length ? j(e[0]) : void 0;
    return t === void 0 ? void 0 : [t];
  }
  if (typeof e == "object") {
    const t = {};
    for (const [n, i] of Object.entries(e)) {
      if (en.has(n)) continue;
      const o = j(i);
      o !== void 0 && (t[n] = o);
    }
    return Object.keys(t).length > 0 ? t : void 0;
  }
  return e;
}
function dn(e) {
  switch (e) {
    case "boolean":
      return "BOOLEAN";
    case "string":
      return "STRING";
    case "number":
      return "DOUBLE";
    case "bigint":
      return "INT64";
    case "date":
      return "TIMESTAMP";
    default:
      return;
  }
}
function un(e) {
  const t = /* @__PURE__ */ new Set();
  return pe(e, t), [...t].sort();
}
function pe(e, t) {
  if (e != null) {
    if (Array.isArray(e)) {
      for (const n of e)
        pe(n, t);
      return;
    }
    if (!(e instanceof Date || e instanceof Uint8Array) && typeof e == "object")
      for (const n of Object.keys(e))
        t.add(n), pe(e[n], t);
  }
}
function xe(e) {
  const t = e.length, n = new Array(t);
  let i = 0;
  for (let c = 0; c < t; c++) {
    const d = ft.encode(e[c]);
    n[c] = d, i += d.length;
  }
  const o = _e(i), r = 17 | o - 1 << 6, f = 1 + o + (t + 1) * o + i, s = new Uint8Array(f);
  let a = 0;
  s[a++] = r;
  for (let c = 0; c < o; c++) s[a++] = t >> c * 8 & 255;
  let u = 0;
  for (let c = 0; c < t; c++) {
    for (let d = 0; d < o; d++) s[a++] = u >> d * 8 & 255;
    u += n[c].length;
  }
  for (let c = 0; c < o; c++) s[a++] = u >> c * 8 & 255;
  for (let c = 0; c < t; c++)
    s.set(n[c], a), a += n[c].length;
  return s;
}
function M(e, t) {
  const n = new A(8);
  return Le(e, n, t), n.getBytes();
}
function Le(e, t, n) {
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
    if (e < st || e > at)
      throw new RangeError(`variant bigint out of int64 range: ${e}`);
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
        t.appendUint8(16), ye(t, e, 2);
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
    const i = ft.encode(e);
    i.length <= 63 ? (t.appendUint8(i.length << 2 | 1), t.appendBytes(i)) : (t.appendUint8(64), t.appendUint32(i.length), t.appendBytes(i));
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
    ln(e, t, n);
    return;
  }
  if (typeof e == "object") {
    cn(e, t, n);
    return;
  }
  throw new Error(`variant cannot encode value: ${e}`);
}
function cn(e, t, n) {
  const i = Object.keys(e).filter((d) => e[d] !== void 0).map((d) => {
    const l = n.get(d);
    if (l === void 0) throw new Error(`variant key not in dictionary: ${d}`);
    return { id: l, key: d };
  });
  i.sort((d, l) => d.id - l.id);
  const o = i.length, r = o > 0 ? i[o - 1].id : 0, f = _e(r), s = new A(8), a = new Array(o + 1);
  a[0] = 0;
  for (let d = 0; d < o; d++)
    Le(e[i[d].key], s, n), a[d + 1] = s.index;
  const u = _e(a[o]), c = o > 255 ? 1 : 0;
  t.appendUint8((u - 1 | f - 1 << 2 | c << 4) << 2 | 2), c ? t.appendUint32(o) : t.appendUint8(o);
  for (const { id: d } of i) ye(t, d, f);
  for (const d of a) ye(t, d, u);
  t.appendBytes(s.getBytes());
}
function ln(e, t, n) {
  const i = e.length, o = new A(8), r = new Array(i + 1);
  r[0] = 0;
  for (let a = 0; a < i; a++)
    Le(e[a], o, n), r[a + 1] = o.index;
  const f = _e(r[i]), s = i > 255 ? 1 : 0;
  t.appendUint8((f - 1 | s << 2) << 2 | 3), s ? t.appendUint32(i) : t.appendUint8(i);
  for (const a of r) ye(t, a, f);
  t.appendBytes(o.getBytes());
}
function _e(e) {
  return e <= 255 ? 1 : e <= 65535 ? 2 : e <= 16777215 ? 3 : 4;
}
function ye(e, t, n) {
  for (let i = 0; i < n; i++)
    e.appendUint8(t >> i * 8 & 255);
}
function pn({ columnData: e, schemaOverrides: t }) {
  const n = [{
    name: "root",
    num_children: e.length
  }];
  for (const { name: i, data: o, type: r, nullable: f, shredding: s } of e)
    if (t?.[i]) {
      const a = t[i];
      if (r || f !== void 0)
        throw new Error(`cannot provide both type and schema override for column ${i}`);
      if (a.name !== i)
        throw new Error(`schema override for column ${i} must have matching name, got ${a.name}`);
      if (a.type === "FIXED_LEN_BYTE_ARRAY" && !a.type_length)
        throw new Error("schema override for FIXED_LEN_BYTE_ARRAY must include type_length");
      if (a.num_children)
        throw new Error("schema override does not support nested types");
      n.push(a);
    } else if (r === "VARIANT") {
      const a = f === !1 ? "REQUIRED" : "OPTIONAL", u = s && s !== !0 ? j(s) : void 0;
      u ? n.push(
        { name: i, repetition_type: a, num_children: 3, logical_type: { type: "VARIANT" } },
        { name: "metadata", type: "BYTE_ARRAY", repetition_type: "REQUIRED" },
        { name: "value", type: "BYTE_ARRAY", repetition_type: "OPTIONAL" },
        ...Ue(u)
      ) : n.push(
        { name: i, repetition_type: a, num_children: 2, logical_type: { type: "VARIANT" } },
        { name: "metadata", type: "BYTE_ARRAY", repetition_type: "REQUIRED" },
        { name: "value", type: "BYTE_ARRAY", repetition_type: "OPTIONAL" }
      );
    } else r ? n.push(yn(i, r, f)) : n.push(hn(i, o.slice(0, 1e3)));
  return n;
}
function Ue(e) {
  if (Array.isArray(e))
    return [
      { name: "typed_value", repetition_type: "OPTIONAL", converted_type: "LIST", num_children: 1 },
      { name: "list", repetition_type: "REPEATED", num_children: 1 },
      { name: "element", repetition_type: "REQUIRED", num_children: 2 },
      { name: "value", type: "BYTE_ARRAY", repetition_type: "OPTIONAL" },
      ...Ue(e[0])
    ];
  if (typeof e == "object") {
    const t = Object.keys(e), n = [
      { name: "typed_value", repetition_type: "OPTIONAL", num_children: t.length }
    ];
    for (const i of t)
      n.push(
        { name: i, repetition_type: "OPTIONAL", num_children: 2 },
        { name: "value", type: "BYTE_ARRAY", repetition_type: "OPTIONAL" },
        ...Ue(e[i])
      );
    return n;
  }
  return [_n(e)];
}
function _n(e) {
  switch (e) {
    case "STRING":
      return { name: "typed_value", type: "BYTE_ARRAY", converted_type: "UTF8", repetition_type: "OPTIONAL" };
    case "INT32":
      return { name: "typed_value", type: "INT32", repetition_type: "OPTIONAL" };
    case "INT64":
      return { name: "typed_value", type: "INT64", repetition_type: "OPTIONAL" };
    case "DOUBLE":
      return { name: "typed_value", type: "DOUBLE", repetition_type: "OPTIONAL" };
    case "FLOAT":
      return { name: "typed_value", type: "FLOAT", repetition_type: "OPTIONAL" };
    case "BOOLEAN":
      return { name: "typed_value", type: "BOOLEAN", repetition_type: "OPTIONAL" };
    case "TIMESTAMP":
      return { name: "typed_value", type: "INT64", converted_type: "TIMESTAMP_MICROS", repetition_type: "OPTIONAL" };
    default:
      throw new Error(`unsupported shredded field type: ${e}`);
  }
}
function yn(e, t, n) {
  const i = n === !1 ? "REQUIRED" : "OPTIONAL";
  return t === "STRING" ? { name: e, type: "BYTE_ARRAY", converted_type: "UTF8", repetition_type: i } : t === "JSON" ? { name: e, type: "BYTE_ARRAY", converted_type: "JSON", repetition_type: i } : t === "TIMESTAMP" ? { name: e, type: "INT64", converted_type: "TIMESTAMP_MILLIS", repetition_type: i } : t === "UUID" ? { name: e, type: "FIXED_LEN_BYTE_ARRAY", type_length: 16, logical_type: { type: "UUID" }, repetition_type: i } : t === "FLOAT16" ? { name: e, type: "FIXED_LEN_BYTE_ARRAY", type_length: 2, logical_type: { type: "FLOAT16" }, repetition_type: i } : t === "GEOMETRY" ? { name: e, type: "BYTE_ARRAY", logical_type: { type: "GEOMETRY" }, repetition_type: i } : t === "GEOGRAPHY" ? { name: e, type: "BYTE_ARRAY", logical_type: { type: "GEOGRAPHY" }, repetition_type: i } : { name: e, type: t, repetition_type: i };
}
function hn(e, t) {
  let n, i = "REQUIRED", o;
  if (t instanceof Int32Array) return { name: e, type: "INT32", repetition_type: i };
  if (t instanceof BigInt64Array) return { name: e, type: "INT64", repetition_type: i };
  if (t instanceof Float32Array) return { name: e, type: "FLOAT", repetition_type: i };
  if (t instanceof Float64Array) return { name: e, type: "DOUBLE", repetition_type: i };
  for (const r of t)
    if (r == null)
      i = "OPTIONAL";
    else {
      let f, s;
      if (typeof r == "boolean") f = "BOOLEAN";
      else if (typeof r == "bigint") f = "INT64";
      else if (Number.isInteger(r)) f = "INT32";
      else if (typeof r == "number") f = "DOUBLE";
      else if (r instanceof Uint8Array) f = "BYTE_ARRAY";
      else if (typeof r == "string")
        f = "BYTE_ARRAY", s = "UTF8";
      else if (r instanceof Date)
        f = "INT64", s = "TIMESTAMP_MILLIS";
      else if (typeof r == "object")
        f = "BYTE_ARRAY", s = "JSON";
      else throw new Error(`cannot determine parquet type for: ${r}`);
      if (n === void 0)
        n = f, o = s;
      else if (n === "INT32" && f === "DOUBLE")
        n = "DOUBLE";
      else if (n === "DOUBLE" && f === "INT32")
        f = "DOUBLE";
      else if (n !== f || o !== s)
        throw new Error(`parquet cannot write mixed types: ${o ?? n} and ${s ?? f}`);
    }
  return n || (n = "BYTE_ARRAY", i = "OPTIONAL"), { name: e, type: n, repetition_type: i, converted_type: o };
}
function gn(e) {
  let t = 0;
  for (const n of e)
    n.repetition_type === "REPEATED" && t++;
  return t;
}
function An(e, t, n, i) {
  const o = t.length;
  let r, f;
  if (n === "FLOAT") {
    const s = t instanceof Float32Array ? t : new Float32Array(Ee(t));
    r = new Uint8Array(s.buffer, s.byteOffset, s.byteLength), f = 4;
  } else if (n === "DOUBLE") {
    const s = t instanceof Float64Array ? t : new Float64Array(Ee(t));
    r = new Uint8Array(s.buffer, s.byteOffset, s.byteLength), f = 8;
  } else if (n === "INT32") {
    const s = t instanceof Int32Array ? t : new Int32Array(Ee(t));
    r = new Uint8Array(s.buffer, s.byteOffset, s.byteLength), f = 4;
  } else if (n === "INT64") {
    const s = mn(t);
    r = new Uint8Array(s.buffer, s.byteOffset, s.byteLength), f = 8;
  } else if (n === "FIXED_LEN_BYTE_ARRAY") {
    if (!i) throw new Error("parquet byte_stream_split missing type_length");
    f = i, r = new Uint8Array(o * f);
    for (let s = 0; s < o; s++)
      r.set(t[s], s * f);
  } else
    throw new Error(`parquet byte_stream_split unsupported type: ${n}`);
  for (let s = 0; s < f; s++)
    for (let a = 0; a < o; a++)
      e.appendUint8(r[a * f + s]);
}
function Ee(e) {
  if (Array.isArray(e) && e.every((t) => typeof t == "number"))
    return e;
  throw new Error("Expected number array for BYTE_STREAM_SPLIT encoding");
}
function mn(e) {
  if (e instanceof BigInt64Array) return e;
  if (Array.isArray(e) && e.every((t) => typeof t == "bigint"))
    return new BigInt64Array(e);
  throw new Error("Expected bigint array for BYTE_STREAM_SPLIT encoding");
}
function En({ writer: e, column: t, encoding: n, pageData: i }) {
  const { columnName: o, element: r, codec: f, compressors: s } = t, { type: a, type_length: u, repetition_type: c } = r;
  if (!a) throw new Error(`column ${o} cannot determine type`);
  if (c === "REPEATED") throw new Error(`column ${o} repeated types not supported`);
  const d = new A(), {
    definition_levels_byte_length: l,
    repetition_levels_byte_length: _,
    num_nulls: p,
    num_values: m,
    num_rows: E
  } = In(d, t, i), g = p ? i.values.filter((h) => h != null) : i.values, y = new A();
  if (n === "PLAIN")
    ot(y, g, a, u);
  else if (n === "RLE") {
    if (a !== "BOOLEAN") throw new Error("RLE encoding only supported for BOOLEAN type");
    const h = new A();
    le(h, g, 1), y.appendUint32(h.offset), y.appendBytes(h.getBytes());
  } else if (n === "PLAIN_DICTIONARY" || n === "RLE_DICTIONARY") {
    let h = 0;
    for (const R of g) R > h && (h = R);
    const T = Math.ceil(Math.log2(h + 1));
    y.appendUint8(T), le(y, g, T);
  } else if (n === "DELTA_BINARY_PACKED") {
    if (a !== "INT32" && a !== "INT64")
      throw new Error("DELTA_BINARY_PACKED encoding only supported for INT32 and INT64 types");
    q(y, g);
  } else if (n === "DELTA_LENGTH_BYTE_ARRAY") {
    if (a !== "BYTE_ARRAY")
      throw new Error("DELTA_LENGTH_BYTE_ARRAY encoding only supported for BYTE_ARRAY type");
    qt(y, g);
  } else if (n === "DELTA_BYTE_ARRAY") {
    if (a !== "BYTE_ARRAY")
      throw new Error("DELTA_BYTE_ARRAY encoding only supported for BYTE_ARRAY type");
    $t(y, g);
  } else if (n === "BYTE_STREAM_SPLIT")
    An(y, g, a, u);
  else
    throw new Error(`parquet unsupported encoding: ${n}`);
  const b = y.getBytes(), I = s[f]?.(b) ?? b;
  dt(e, {
    type: "DATA_PAGE_V2",
    uncompressed_page_size: d.offset + y.offset,
    compressed_page_size: d.offset + I.length,
    data_page_header_v2: {
      num_values: m,
      num_nulls: p,
      num_rows: E,
      encoding: n,
      definition_levels_byte_length: l,
      repetition_levels_byte_length: _,
      is_compressed: !!f
      // is there benefit to page statistics here?
    }
  }), e.appendBytes(d.getBytes()), e.appendBytes(I);
}
function dt(e, t) {
  const n = {
    field_1: rt.indexOf(t.type),
    field_2: t.uncompressed_page_size,
    field_3: t.compressed_page_size,
    field_4: t.crc,
    field_5: t.data_page_header && {
      field_1: t.data_page_header.num_values,
      field_2: P.indexOf(t.data_page_header.encoding),
      field_3: P.indexOf(t.data_page_header.definition_level_encoding),
      field_4: P.indexOf(t.data_page_header.repetition_level_encoding)
      // field_5: header.data_page_header.statistics,
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
      // default true
    }
  };
  ee(e, n);
}
function In(e, t, n) {
  const { schemaPath: i } = t, { values: o, definitionLevels: r, repetitionLevels: f, maxDefinitionLevel: s } = n, a = r.length || o.length;
  let u = 0, c = 0;
  if (f.length)
    for (let p = 0; p < f.length; p++)
      f[p] === 0 && c++;
  else
    c = o.length;
  if (r.length)
    for (let p = 0; p < r.length; p++)
      r[p] < s && u++;
  const d = gn(i);
  let l = 0;
  if (d) {
    const p = Math.ceil(Math.log2(d + 1));
    l = le(e, f, p);
  }
  let _ = 0;
  if (s) {
    const p = Math.ceil(Math.log2(s + 1));
    _ = le(e, r, p);
  }
  return { definition_levels_byte_length: _, repetition_levels_byte_length: l, num_values: a, num_nulls: u, num_rows: c };
}
function ut(e, t, n) {
  if (e == null) return 0;
  if (t === "BOOLEAN") return 0.125;
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
function $e(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++)
    t ^= e[n], t = Math.imul(t, 16777619);
  return t >>> 0;
}
function Tn(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++)
    if (e[n] !== t[n]) return !1;
  return !0;
}
function wn(e, t, n, i, o) {
  if (i && i !== "RLE_DICTIONARY") return {};
  if (t === "BOOLEAN") return {};
  const r = e.slice(0, 1e3), f = /* @__PURE__ */ new Set();
  for (const l of r)
    f.add(l instanceof Uint8Array ? $e(l) : l);
  if (f.size === 0 || f.size / r.length > 0.5) return {};
  const s = [], a = new Array(e.length), u = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map();
  let d = 0;
  for (let l = 0; l < e.length; l++) {
    const _ = e[l];
    if (_ == null) continue;
    let p;
    if (_ instanceof Uint8Array) {
      const m = $e(_), E = c.get(m);
      if (E) {
        for (const g of E)
          if (Tn(s[g], _)) {
            p = g;
            break;
          }
      }
      if (p === void 0) {
        if (d += _.byteLength, o && d > o) return {};
        p = s.length, s.push(_), E ? E.push(p) : c.set(m, [p]);
      }
    } else if (p = u.get(_), p === void 0) {
      if (d += ut(_, t, n), o && d > o) return {};
      p = s.length, s.push(_), u.set(_, p);
    }
    a[l] = p;
  }
  return { dictionary: s, indexes: a };
}
function bn(e, t, n) {
  const { element: i, codec: o, compressors: r } = t, { type: f, type_length: s } = i;
  if (!f) throw new Error(`column ${t.columnName} cannot determine type`);
  const a = new A();
  ot(a, n, f, s);
  const u = a.getBytes(), c = r[o]?.(u) ?? u;
  dt(e, {
    type: "DICTIONARY_PAGE",
    uncompressed_page_size: u.byteLength,
    compressed_page_size: c.byteLength,
    dictionary_page_header: {
      num_values: n.length,
      encoding: "PLAIN"
    }
  }), e.appendBytes(c);
}
function Bn(e) {
  const t = /* @__PURE__ */ new Set();
  let n;
  for (const a of e)
    if (a != null) {
      if (typeof a != "object")
        throw new Error("geospatial column expects GeoJSON geometries");
      n = ct(n, a), t.add(Un(a));
    }
  let i;
  const { xmin: o, ymin: r, xmax: f, ymax: s } = n ?? {};
  if (o !== void 0 && r !== void 0 && f !== void 0 && s !== void 0 && (i = { ...n, xmin: o, ymin: r, xmax: f, ymax: s }), t.size || i)
    return {
      bbox: i,
      // Geospatial type codes of all instances, or an empty list if not known
      geospatial_types: t.size ? Array.from(t).sort((a, u) => a - u) : []
    };
}
function ct(e, t) {
  if (t.type === "GeometryCollection") {
    for (const n of t.geometries || [])
      e = ct(e, n);
    return e;
  }
  return lt(e, t.coordinates);
}
function lt(e, t) {
  if (typeof t[0] == "number")
    return e = se(e, "xmin", "xmax", t[0]), e = se(e, "ymin", "ymax", t[1]), t.length > 2 && (e = se(e, "zmin", "zmax", t[2])), t.length > 3 && (e = se(e, "mmin", "mmax", t[3])), e;
  for (const n of t)
    e = lt(e, n);
  return e;
}
function se(e, t, n, i) {
  if (i === void 0 || !Number.isFinite(i)) return e;
  e || (e = {});
  const o = e[t], r = e[n];
  return (o === void 0 || i < o) && (e[t] = i), (r === void 0 || i > r) && (e[n] = i), e;
}
function Un(e) {
  const t = Rn[e.type];
  if (t === void 0) throw new Error(`unknown geometry type: ${e.type}`);
  const n = pt(e);
  if (n === 2) return t;
  if (n === 3) return t + 1e3;
  if (n === 4) return t + 3e3;
  throw new Error(`unsupported geometry dimensions: ${n}`);
}
const Rn = {
  Point: 1,
  LineString: 2,
  Polygon: 3,
  MultiPoint: 4,
  MultiLineString: 5,
  MultiPolygon: 6,
  GeometryCollection: 7
};
function pt(e) {
  if (e.type === "GeometryCollection") {
    let t = 0;
    for (const n of e.geometries || [])
      t = Math.max(t, pt(n));
    return t || 2;
  }
  return _t(e.coordinates);
}
function _t(e) {
  if (!e.length) return 2;
  if (typeof e[0] == "number") return e.length;
  let t = 0;
  for (const n of e)
    t = Math.max(t, _t(n));
  return t || 2;
}
function Re(e) {
  if (e === void 0) return null;
  if (typeof e == "bigint") return Number(e);
  if (Object.is(e, -0)) return 0;
  if (Array.isArray(e)) return e.map(Re);
  if (e instanceof Uint8Array) return Array.from(e);
  if (e instanceof Date) return e.toISOString();
  if (e instanceof Object) {
    const t = {};
    for (const n of Object.keys(e))
      e[n] !== void 0 && (t[n] = Re(e[n]));
    return t;
  }
  return e;
}
function Nn(e) {
  const t = new A();
  return v(t, e), t.getBytes();
}
function v(e, t) {
  if (typeof t != "object")
    throw new Error("geometry values must be GeoJSON geometries");
  const n = On(t.type), i = ht(t);
  let o = 0;
  if (i === 3) o = 1;
  else if (i === 4) o = 3;
  else if (i > 4) throw new Error(`unsupported geometry dimensions: ${i}`);
  if (e.appendUint8(1), e.appendUint32(n + o * 1e3), t.type === "Point")
    yt(e, t.coordinates, i);
  else if (t.type === "LineString")
    je(e, t.coordinates, i);
  else if (t.type === "Polygon") {
    e.appendUint32(t.coordinates.length);
    for (const r of t.coordinates)
      je(e, r, i);
  } else if (t.type === "MultiPoint") {
    e.appendUint32(t.coordinates.length);
    for (const r of t.coordinates)
      v(e, { type: "Point", coordinates: r });
  } else if (t.type === "MultiLineString") {
    e.appendUint32(t.coordinates.length);
    for (const r of t.coordinates)
      v(e, { type: "LineString", coordinates: r });
  } else if (t.type === "MultiPolygon") {
    e.appendUint32(t.coordinates.length);
    for (const r of t.coordinates)
      v(e, { type: "Polygon", coordinates: r });
  } else if (t.type === "GeometryCollection") {
    e.appendUint32(t.geometries.length);
    for (const r of t.geometries)
      v(e, r);
  } else
    throw new Error("unsupported geometry type");
}
function yt(e, t, n) {
  if (t.length < n)
    throw new Error("geometry position dimensions mismatch");
  for (let i = 0; i < n; i++)
    e.appendFloat64(t[i]);
}
function je(e, t, n) {
  e.appendUint32(t.length);
  for (const i of t)
    yt(e, i, n);
}
function On(e) {
  if (e === "Point") return 1;
  if (e === "LineString") return 2;
  if (e === "Polygon") return 3;
  if (e === "MultiPoint") return 4;
  if (e === "MultiLineString") return 5;
  if (e === "MultiPolygon") return 6;
  if (e === "GeometryCollection") return 7;
  throw new Error(`unknown geometry type: ${e}`);
}
function ht(e) {
  if (e.type === "GeometryCollection") {
    let t = 0;
    for (const n of e.geometries)
      t = Math.max(t, ht(n));
    return t || 2;
  }
  return gt(e.coordinates);
}
function gt(e) {
  if (!Array.isArray(e) || !e.length) return 2;
  if (typeof e[0] == "number") return e.length;
  let t = 0;
  for (const n of e)
    t = Math.max(t, gt(n));
  return t || 2;
}
const At = 864e5;
function ze(e, t) {
  const { type: n, converted_type: i, logical_type: o } = e;
  if (i === "DECIMAL") {
    const r = 10 ** (e.scale || 0);
    return t.map((f) => {
      if (f == null) return f;
      if (typeof f != "number") throw new Error("DECIMAL must be a number");
      return mt(e, BigInt(Math.round(f * r)));
    });
  }
  if (i === "DATE")
    return Array.from(t).map((r) => r instanceof Date ? Math.floor(r.getTime() / At) : r);
  if (i === "TIMESTAMP_MILLIS")
    return Array.from(t).map((r) => r == null ? r : r instanceof Date ? BigInt(r.getTime()) : BigInt(r));
  if (i === "TIMESTAMP_MICROS")
    return Array.from(t).map((r) => r == null ? r : r instanceof Date ? BigInt(r.getTime() * 1e3) : BigInt(r));
  if (i === "JSON") {
    if (!Array.isArray(t)) throw new Error("JSON must be an array");
    const r = new TextEncoder();
    return t.map((f) => f === void 0 ? void 0 : r.encode(JSON.stringify(Re(f))));
  }
  if (i === "UTF8") {
    if (!Array.isArray(t)) throw new Error("strings must be an array");
    const r = new TextEncoder();
    return t.map((f) => typeof f == "string" ? r.encode(f) : f);
  }
  if (i === "UINT_32" || o?.type === "INTEGER" && o.bitWidth === 32 && !o.isSigned)
    return t instanceof Uint32Array ? t : t instanceof Int32Array ? new Uint32Array(t.buffer, t.byteOffset, t.length) : Array.from(t).map((r) => {
      if (r == null) return r;
      if (!Number.isSafeInteger(r)) throw new Error("expected integer value, got " + r);
      if (r < 0 || r > 4294967295) throw new Error("expected uint32 value, got " + r);
      return r > 2147483647 ? r - 4294967296 : r;
    });
  if (o?.type === "FLOAT16") {
    if (n !== "FIXED_LEN_BYTE_ARRAY") throw new Error("FLOAT16 must be FIXED_LEN_BYTE_ARRAY type");
    if (e.type_length !== 2) throw new Error("FLOAT16 expected type_length to be 2 bytes");
    return Array.from(t).map(Dn);
  }
  if (o?.type === "UUID") {
    if (!Array.isArray(t)) throw new Error("UUID must be an array");
    if (n !== "FIXED_LEN_BYTE_ARRAY") throw new Error("UUID must be FIXED_LEN_BYTE_ARRAY type");
    if (e.type_length !== 16) throw new Error("UUID expected type_length to be 16 bytes");
    return t.map(xn);
  }
  if (o?.type === "TIMESTAMP")
    return Array.from(t).map((r) => {
      if (r == null) return r;
      if (r instanceof Date) {
        const f = BigInt(r.getTime());
        return o.unit === "NANOS" ? f * 1000000n : o.unit === "MICROS" ? f * 1000n : f;
      }
      return BigInt(r);
    });
  if (o?.type === "GEOMETRY" || o?.type === "GEOGRAPHY") {
    if (!Array.isArray(t)) throw new Error("geometry must be an array");
    return t.map((r) => r == null ? r : Nn(r));
  }
  return t;
}
function xn(e) {
  if (e != null) {
    if (e instanceof Uint8Array) return e;
    if (typeof e == "string") {
      if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(e))
        throw new Error("UUID must be a valid UUID string");
      e = e.replace(/-/g, "").toLowerCase();
      const n = new Uint8Array(16);
      for (let i = 0; i < 16; i++)
        n[i] = parseInt(e.slice(i * 2, i * 2 + 2), 16);
      return n;
    }
    throw new Error("UUID must be a string or Uint8Array");
  }
}
function $(e, t) {
  if (e == null) return;
  const { type: n, converted_type: i } = t;
  if (n === "BOOLEAN") return new Uint8Array([e ? 1 : 0]);
  if (i === "DECIMAL") {
    if (typeof e != "number") throw new Error("DECIMAL must be a number");
    const o = 10 ** (t.scale || 0), r = mt(t, BigInt(Math.round(e * o)));
    if (r instanceof Uint8Array) return r;
    if (typeof r == "number") {
      const f = new ArrayBuffer(4);
      return new DataView(f).setFloat32(0, r, !0), new Uint8Array(f);
    }
    if (typeof r == "bigint") {
      const f = new ArrayBuffer(8);
      return new DataView(f).setBigInt64(0, r, !0), new Uint8Array(f);
    }
  }
  if (n === "BYTE_ARRAY" || n === "FIXED_LEN_BYTE_ARRAY")
    return e instanceof Uint8Array ? e.slice(0, 16) : new TextEncoder().encode(e.toString().slice(0, 16));
  if (n === "FLOAT" && typeof e == "number") {
    const o = new ArrayBuffer(4);
    return new DataView(o).setFloat32(0, e, !0), new Uint8Array(o);
  }
  if (n === "DOUBLE" && typeof e == "number") {
    const o = new ArrayBuffer(8);
    return new DataView(o).setFloat64(0, e, !0), new Uint8Array(o);
  }
  if (n === "INT32" && typeof e == "number") {
    const o = new ArrayBuffer(4);
    return new DataView(o).setInt32(0, e, !0), new Uint8Array(o);
  }
  if (n === "INT64" && typeof e == "bigint") {
    const o = new ArrayBuffer(8);
    return new DataView(o).setBigInt64(0, e, !0), new Uint8Array(o);
  }
  if (n === "INT32" && i === "DATE" && e instanceof Date) {
    const o = new ArrayBuffer(4);
    return new DataView(o).setInt32(0, Math.floor(e.getTime() / At), !0), new Uint8Array(o);
  }
  if (n === "INT64" && i === "TIMESTAMP_MILLIS" && e instanceof Date) {
    const o = new ArrayBuffer(8);
    return new DataView(o).setBigInt64(0, BigInt(e.getTime()), !0), new Uint8Array(o);
  }
  if (n === "INT64" && i === "TIMESTAMP_MICROS" && e instanceof Date) {
    const o = new ArrayBuffer(8);
    return new DataView(o).setBigInt64(0, BigInt(e.getTime() * 1e3), !0), new Uint8Array(o);
  }
  if (n === "INT64" && t.logical_type?.type === "TIMESTAMP" && e instanceof Date) {
    const o = BigInt(e.getTime()), { unit: r } = t.logical_type;
    let f = o;
    r === "NANOS" ? f = o * 1000000n : r === "MICROS" && (f = o * 1000n);
    const s = new ArrayBuffer(8);
    return new DataView(s).setBigInt64(0, f, !0), new Uint8Array(s);
  }
  throw new Error(`unsupported type for statistics: ${n} with value ${e}`);
}
function Ln(e, t) {
  return {
    field_1: $(e.max, t),
    field_2: $(e.min, t),
    field_3: e.null_count,
    field_4: e.distinct_count,
    field_5: $(e.max_value, t),
    field_6: $(e.min_value, t),
    field_7: e.is_max_value_exact,
    field_8: e.is_min_value_exact
  };
}
function mt({ type: e, type_length: t }, n) {
  if (e === "INT32") return Number(n);
  if (e === "INT64") return n;
  if (e === "FIXED_LEN_BYTE_ARRAY" && !t)
    throw new Error("fixed length byte array type_length is required");
  if (!t && !n) return new Uint8Array();
  const i = [];
  for (; ; ) {
    const o = Number(n & 0xffn);
    if (i.unshift(o), n >>= 8n, t) {
      if (i.length >= t) break;
    } else {
      const r = o & 128;
      if (!r && n === 0n || r && n === -1n)
        break;
    }
  }
  return new Uint8Array(i);
}
function Dn(e) {
  if (e == null) return;
  if (typeof e != "number") throw new Error("parquet float16 expected number value");
  if (Number.isNaN(e)) return new Uint8Array([0, 126]);
  const t = e < 0 || Object.is(e, -0) ? 1 : 0, n = Math.abs(e);
  if (!isFinite(n)) return new Uint8Array([0, t << 7 | 124]);
  if (n === 0) return new Uint8Array([0, t << 7]);
  const i = new ArrayBuffer(4);
  new Float32Array(i)[0] = n;
  const o = new Uint32Array(i)[0];
  let r = o >>> 23 & 255, f = o & 8388607;
  if (r -= 127, r < -14) {
    const u = -14 - r;
    f = (f | 8388608) >> u + 13, f & 1 && (f += 1);
    const c = t << 15 | f;
    return new Uint8Array([c & 255, c >> 8]);
  }
  if (r > 15) return new Uint8Array([0, t << 7 | 124]);
  let s = r + 15;
  if (f = f + 4096, f & 8388608 && (f = 0, ++s === 31))
    return new Uint8Array([0, t << 7 | 124]);
  const a = t << 15 | s << 10 | f >> 13;
  return new Uint8Array([a & 255, a >> 8]);
}
function Mn({ writer: e, column: t, pageData: n }) {
  const { columnName: i, element: o, schemaPath: r, stats: f, pageSize: s, encoding: a } = t, { type: u, type_length: c } = o;
  if (!u) throw new Error(`column ${i} cannot determine type`);
  const { values: d, definitionLevels: l, repetitionLevels: _, maxDefinitionLevel: p } = n, m = e.offset, E = [], g = o?.logical_type?.type === "GEOMETRY" || o?.logical_type?.type === "GEOGRAPHY", y = f ? He(d) : void 0, b = f && g ? Bn(d) : void 0;
  let I;
  if (t.bloomFilter) {
    const U = typeof t.bloomFilter == "object" ? t.bloomFilter : void 0, N = new St(o, U);
    for (const oe of d) N.insert(oe);
    I = N.finalize();
  }
  let h;
  const { dictionary: T, indexes: R } = wn(d, u, c, a, s);
  let L, Y, te = u;
  if (T && R) {
    Y = R, te = "INT32", L = "RLE_DICTIONARY", h = BigInt(e.offset);
    const U = ze(o, T);
    bn(e, t, U);
  } else
    Y = ze(o, d), L = a ?? (u === "BOOLEAN" && d.length > 16 ? "RLE" : "PLAIN");
  E.push(L);
  const D = Sn(Y, te, c, s), B = t.columnIndex && D.length > 1 ? {
    null_pages: [],
    min_values: [],
    max_values: [],
    boundary_order: "UNORDERED",
    null_counts: []
  } : void 0, z = t.offsetIndex && D.length > 1 ? {
    page_locations: []
  } : void 0, he = BigInt(e.offset);
  let C = 0n, F = 0, ne, ie, ge = !0, Ae = !0;
  for (const { start: U, end: N } of D) {
    const oe = e.offset, It = {
      values: Y.slice(U, N),
      definitionLevels: l.slice(U, N),
      repetitionLevels: _.slice(U, N),
      maxDefinitionLevel: p
    };
    if (En({ writer: e, column: t, encoding: L, pageData: It }), B) {
      const H = d.slice(U, N), { min_value: X, max_value: Z, null_count: Me = 0n } = He(H);
      B.null_pages.push(Me === BigInt(N - U)), B.min_values.push($(X, o) ?? new Uint8Array()), B.max_values.push($(Z, o) ?? new Uint8Array()), B.null_counts?.push(Me), ne !== void 0 && X !== void 0 && (ne > X && (ge = !1), ne < X && (Ae = !1)), ie !== void 0 && Z !== void 0 && (ie > Z && (ge = !1), ie < Z && (Ae = !1)), ne = X, ie = Z;
    }
    if (z) {
      if (_.length)
        for (let H = F + 1; H <= U; H++)
          _[H] === 0 && C++;
      else
        C = BigInt(U);
      z.page_locations.push({
        offset: BigInt(oe),
        compressed_page_size: e.offset - oe,
        first_row_index: C
      });
    }
    F = U;
  }
  B && (ge ? B.boundary_order = "ASCENDING" : Ae && (B.boundary_order = "DESCENDING"));
  let re;
  return f && (re = [], h !== void 0 && re.push({ page_type: "DICTIONARY_PAGE", encoding: "PLAIN", count: 1 }), re.push({ page_type: "DATA_PAGE_V2", encoding: L, count: D.length })), {
    chunk: {
      meta_data: {
        type: u,
        encodings: E,
        path_in_schema: r.slice(1).map((U) => U.name),
        codec: t.codec ?? "UNCOMPRESSED",
        num_values: BigInt(d.length),
        total_compressed_size: BigInt(e.offset - m),
        total_uncompressed_size: BigInt(e.offset - m),
        // TODO: uncompressed pages + headers
        data_page_offset: he,
        dictionary_page_offset: h,
        statistics: y,
        encoding_stats: re,
        geospatial_statistics: b
      },
      file_offset: BigInt(m)
    },
    columnIndex: B,
    offsetIndex: z,
    bloomFilter: I
  };
}
function Sn(e, t, n, i) {
  if (!i)
    return [{ start: 0, end: e.length }];
  const o = [];
  let r = 0, f = 0;
  for (let s = 0; s < e.length; s++) {
    const a = ut(e[s], t, n);
    f += a, f >= i && s > r && (o.push({ start: r, end: s }), r = s, f = a);
  }
  return r < e.length && o.push({ start: r, end: e.length }), o;
}
function He(e) {
  let t, n, i = 0n;
  for (const o of e) {
    if (o == null) {
      i++;
      continue;
    }
    typeof o != "object" && (typeof o == "number" && Number.isNaN(o) || ((t === void 0 || o < t) && (t = o), (n === void 0 || o > n) && (n = o)));
  }
  return t === 0 && (t = -0), n === 0 && (n = 0), { min_value: t, max_value: n, null_count: i };
}
function Pn(e, t) {
  const n = e.map((d) => d.element);
  if (e.length < 2) throw new Error("parquet schema path must include column");
  const i = [], o = [], r = Tt(e);
  if (e.length === 2 && r === 0)
    return { values: t, definitionLevels: i, repetitionLevels: o, maxDefinitionLevel: r };
  if (e.length === 2 && r === 1) {
    const d = new Array(t.length);
    for (let l = 0; l < t.length; l++)
      d[l] = t[l] === null || t[l] === void 0 ? 0 : 1;
    return { values: t, definitionLevels: d, repetitionLevels: o, maxDefinitionLevel: r };
  }
  const f = new Array(e.length);
  let s = 0;
  for (let d = 0; d < e.length; d++)
    f[d] = s, n[d].repetition_type === "REPEATED" && s++;
  const a = [];
  for (const d of t)
    u(1, d, 0, 0, !1);
  return { values: a, definitionLevels: i, repetitionLevels: o, maxDefinitionLevel: r };
  function u(d, l, _, p, m) {
    const E = n[d], g = E.repetition_type || "REQUIRED";
    if (d === e.length - 1) {
      if (l == null) {
        if (g === "REQUIRED" && !m)
          throw new Error("parquet required value is undefined");
        i.push(_);
      } else
        i.push(g === "REQUIRED" ? _ : _ + 1);
      o.push(p), a.push(l);
      return;
    }
    if (g === "REPEATED") {
      if (l == null) {
        if (!m) throw new Error("parquet required value is undefined");
        u(d + 1, void 0, _, p, !0);
        return;
      }
      if (!Array.isArray(l))
        throw new Error(`parquet repeated field ${E.name} must be an array`);
      if (!l.length) {
        u(d + 1, void 0, _, p, !0);
        return;
      }
      const y = me(e[d - 1]), b = n[d + 1];
      for (let I = 0; I < l.length; I++) {
        let h = l[I];
        y && h && typeof h == "object" && b && (h = h[b.name]);
        const T = I === 0 ? p : f[d] + 1;
        u(d + 1, h, _ + 1, T, !1);
      }
      return;
    }
    if (g === "OPTIONAL") {
      if (l == null)
        u(d + 1, void 0, _, p, !0);
      else {
        const y = c(d, l), b = y == null, I = Se(e[d]) || me(e[d]), T = E.num_children && !E.type && !I || !b ? _ + 1 : _;
        u(d + 1, y, T, p, b);
      }
      return;
    }
    if (l == null) {
      if (!m) throw new Error("parquet required value is undefined");
      u(d + 1, void 0, _, p, !0);
    } else
      u(d + 1, c(d, l), _, p, !1);
  }
  function c(d, l) {
    if (l == null) return;
    const _ = n[d + 1];
    if (_) {
      if (Se(e[d])) return l;
      if (me(e[d]))
        return Yn(l, n[d]);
      if (typeof l == "object" && !Array.isArray(l))
        return l[_.name];
      throw new Error(`parquet expected struct, got ${l}`);
    }
  }
}
function Yn(e, t) {
  if (e instanceof Map)
    return Array.from(e.entries(), ([n, i]) => ({ key: n, value: i }));
  if (Array.isArray(e))
    return e.map((n) => {
      if (n && typeof n == "object" && "key" in n && "value" in n)
        return n;
      if (Array.isArray(n) && n.length === 2)
        return { key: n[0], value: n[1] };
      throw new Error("parquet map entry must provide key and value");
    });
  if (typeof e == "object")
    return Object.entries(e).map(([n, i]) => ({ key: n, value: i }));
  throw new Error(`parquet map field ${t.name} must be Map, array, or object`);
}
function Cn(e, t) {
  for (const { chunk: n, columnIndex: i } of t)
    Fn(e, n, i);
  for (const { chunk: n, offsetIndex: i } of t)
    Vn(e, n, i);
}
function Fn(e, t, n) {
  if (!n || n.min_values.length <= 1) return;
  const i = e.offset;
  ee(e, {
    field_1: n.null_pages,
    field_2: n.min_values,
    field_3: n.max_values,
    field_4: kt.indexOf(n.boundary_order),
    field_5: n.null_counts
  }), t.column_index_offset = BigInt(i), t.column_index_length = e.offset - i;
}
function Vn(e, t, n) {
  if (!n || n.page_locations.length <= 1) return;
  const i = e.offset;
  ee(e, {
    field_1: n.page_locations.map((o) => ({
      field_1: o.offset,
      field_2: o.compressed_page_size,
      field_3: o.first_row_index
    }))
  }), t.offset_index_offset = BigInt(i), t.offset_index_length = e.offset - i;
}
function kn(e, t) {
  const n = {
    field_1: t.version,
    field_2: t.schema.map((r) => ({
      field_1: r.type && Ve.indexOf(r.type),
      field_2: r.type_length,
      field_3: r.repetition_type && Ct.indexOf(r.repetition_type),
      field_4: r.name,
      field_5: r.num_children,
      field_6: r.converted_type && Ft.indexOf(r.converted_type),
      field_7: r.scale,
      field_8: r.precision,
      field_9: r.field_id,
      field_10: qn(r.logical_type)
    })),
    field_3: t.num_rows,
    field_4: t.row_groups.map((r) => ({
      field_1: r.columns.map((f) => ({
        field_1: f.file_path,
        field_2: f.file_offset,
        field_3: f.meta_data && {
          field_1: Ve.indexOf(f.meta_data.type),
          field_2: f.meta_data.encodings.map((s) => P.indexOf(s)),
          field_3: f.meta_data.path_in_schema,
          field_4: Vt.indexOf(f.meta_data.codec),
          field_5: f.meta_data.num_values,
          field_6: f.meta_data.total_uncompressed_size,
          field_7: f.meta_data.total_compressed_size,
          field_8: f.meta_data.key_value_metadata && f.meta_data.key_value_metadata.map((s) => ({
            field_1: s.key,
            field_2: s.value
          })),
          field_9: f.meta_data.data_page_offset,
          field_10: f.meta_data.index_page_offset,
          field_11: f.meta_data.dictionary_page_offset,
          field_12: f.meta_data.statistics && Ln(
            f.meta_data.statistics,
            Gn(t.schema, f.meta_data.path_in_schema)
          ),
          field_13: f.meta_data.encoding_stats && f.meta_data.encoding_stats.map((s) => ({
            field_1: rt.indexOf(s.page_type),
            field_2: P.indexOf(s.encoding),
            field_3: s.count
          })),
          field_14: f.meta_data.bloom_filter_offset,
          field_15: f.meta_data.bloom_filter_length,
          field_16: f.meta_data.size_statistics && {
            field_1: f.meta_data.size_statistics.unencoded_byte_array_data_bytes,
            field_2: f.meta_data.size_statistics.repetition_level_histogram,
            field_3: f.meta_data.size_statistics.definition_level_histogram
          },
          field_17: f.meta_data.geospatial_statistics && {
            field_1: f.meta_data.geospatial_statistics.bbox && {
              field_1: f.meta_data.geospatial_statistics.bbox.xmin,
              field_2: f.meta_data.geospatial_statistics.bbox.xmax,
              field_3: f.meta_data.geospatial_statistics.bbox.ymin,
              field_4: f.meta_data.geospatial_statistics.bbox.ymax,
              field_5: f.meta_data.geospatial_statistics.bbox.zmin,
              field_6: f.meta_data.geospatial_statistics.bbox.zmax,
              field_7: f.meta_data.geospatial_statistics.bbox.mmin,
              field_8: f.meta_data.geospatial_statistics.bbox.mmax
            },
            field_2: f.meta_data.geospatial_statistics.geospatial_types
          }
        },
        field_4: f.offset_index_offset,
        field_5: f.offset_index_length,
        field_6: f.column_index_offset,
        field_7: f.column_index_length,
        // field_8: c.crypto_metadata,
        field_9: f.encrypted_column_metadata
      })),
      field_2: r.total_byte_size,
      field_3: r.num_rows,
      field_4: r.sorting_columns && r.sorting_columns.map((f) => ({
        field_1: f.column_idx,
        field_2: f.descending,
        field_3: f.nulls_first
      })),
      field_5: r.file_offset,
      field_6: r.total_compressed_size
      // field_7: rg.ordinal, // should be int16
    })),
    field_5: t.key_value_metadata && t.key_value_metadata.map((r) => ({
      field_1: r.key,
      field_2: r.value
    })),
    field_6: t.created_by
  }, i = e.offset;
  ee(e, n);
  const o = e.offset - i;
  e.appendUint32(o);
}
function Gn(e, t) {
  const n = Qe(e, t);
  return n[n.length - 1].element;
}
function qn(e) {
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
      field_2: Xe(e.unit)
    } };
    if (e.type === "TIMESTAMP") return { field_8: {
      field_1: e.isAdjustedToUTC,
      field_2: Xe(e.unit)
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
    if (e.type === "GEOMETRY") return { field_17: {
      field_1: e.crs
    } };
    if (e.type === "GEOGRAPHY") return { field_18: {
      field_1: e.crs,
      field_2: e.algorithm && Gt.indexOf(e.algorithm)
    } };
  }
}
function Xe(e) {
  return e === "NANOS" ? { field_3: {} } : e === "MICROS" ? { field_2: {} } : { field_1: {} };
}
const $n = 16, jn = 1 << $n, Et = 14, Ze = new Array(Et + 1);
function zn(e) {
  const t = new A();
  t.appendVarInt(e.length);
  let n = 0;
  for (; n < e.length; ) {
    const i = Math.min(e.length - n, jn);
    Xn(t, e, n, i), n += i;
  }
  return t.getBytes();
}
function W(e, t) {
  return e * 506832829 >>> t;
}
function J(e, t) {
  return e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
}
function Ke(e, t, n) {
  return e[t] === e[n] && e[t + 1] === e[n + 1] && e[t + 2] === e[n + 2] && e[t + 3] === e[n + 3];
}
function We(e, t, n, i) {
  i <= 60 ? e.appendUint8(i - 1 << 2) : i < 256 ? (e.appendUint8(240), e.appendUint8(i - 1)) : (e.appendUint8(244), e.appendUint8(i - 1 & 255), e.appendUint8(i - 1 >>> 8)), e.appendBytes(t.subarray(n, n + i));
}
function Ie(e, t, n) {
  n < 12 && t < 2048 ? (e.appendUint8(1 + (n - 4 << 2) + (t >>> 8 << 5)), e.appendUint8(t & 255)) : (e.appendUint8(2 + (n - 1 << 2)), e.appendUint8(t & 255), e.appendUint8(t >>> 8));
}
function Hn(e, t, n) {
  for (; n >= 68; )
    Ie(e, t, 64), n -= 64;
  n > 64 && (Ie(e, t, 60), n -= 60), Ie(e, t, n);
}
function Xn(e, t, n, i) {
  let o = 1;
  for (; 1 << o <= i && o <= Et; )
    o++;
  o--;
  const r = 32 - o;
  Ze[o] ??= new Uint16Array(1 << o);
  const f = Ze[o];
  f.fill(0);
  const s = n + i;
  let a;
  const u = n;
  let c = n, d, l, _, p, m, E, g, y, b, I, h, T = !0;
  const R = 15;
  if (i >= R)
    for (a = s - R, n++, l = W(J(t, n), r); T; ) {
      m = 32, _ = n;
      do {
        if (n = _, d = l, E = m >>> 5, m++, _ = n + E, n > a) {
          T = !1;
          break;
        }
        l = W(J(t, _), r), p = u + f[d], f[d] = n - u;
      } while (!Ke(t, n, p));
      if (!T)
        break;
      We(e, t, c, n - c);
      do {
        for (g = n, y = 4; n + y < s && t[n + y] === t[p + y]; )
          y++;
        if (n += y, b = g - p, Hn(e, b, y), c = n, n >= a) {
          T = !1;
          break;
        }
        I = W(J(t, n - 1), r), f[I] = n - 1 - u, h = W(J(t, n), r), p = u + f[h], f[h] = n - u;
      } while (Ke(t, n, p));
      if (!T)
        break;
      n++, l = W(J(t, n), r);
    }
  c < s && We(e, t, c, s - c);
}
function De({ writer: e, schema: t, codec: n = "SNAPPY", compressors: i, statistics: o = !0, kvMetadata: r }) {
  this.writer = e, this.schema = t, this.codec = n, this.compressors = { SNAPPY: zn, ...i }, this.statistics = o, this.kvMetadata = r, this.row_groups = [], this.num_rows = 0n, this.pendingIndexes = [], this.writer.appendUint32(827474256);
}
De.prototype.write = function({ columnData: e, rowGroupSize: t = [1e3, 1e5], pageSize: n = 1048576 }) {
  const i = e[0]?.data?.length || 0;
  let o;
  for (const { groupStartIndex: r, groupSize: f } of Zn({ columnDataRows: i, rowGroupSize: t })) {
    const s = () => {
      const a = this.writer.offset, u = [];
      for (let c = 0; c < e.length; c++) {
        const { name: d, data: l, encoding: _, codec: p = this.codec, columnIndex: m = !1, offsetIndex: E = !0, shredding: g, bloomFilter: y } = e[c];
        if (m && !E)
          throw new Error("parquet ColumnIndex cannot be present without OffsetIndex");
        if (l.length !== i)
          throw new Error("parquet columns must have the same length");
        const b = l.slice(r, r + f), I = Qe(this.schema, [d]), h = Kn(I), T = I.at(-1)?.element, R = g && g !== !0 ? g : void 0, L = T?.logical_type?.type === "VARIANT", Y = T?.repetition_type === "REQUIRED", te = L ? rn(Array.from(b), R, { name: d, required: Y }) : b;
        for (const D of h) {
          const B = D.map((F) => F.element), z = {
            columnName: B.slice(1).map((F) => F.name).join("."),
            element: B[B.length - 1],
            schemaPath: B,
            codec: p,
            compressors: this.compressors,
            stats: this.statistics,
            pageSize: n,
            columnIndex: m,
            offsetIndex: E,
            encoding: _,
            bloomFilter: y
          }, he = Pn(D, te), C = Mn({
            writer: this.writer,
            column: z,
            pageData: he
          });
          u.push(C.chunk), this.pendingIndexes.push(C);
        }
      }
      return this.num_rows += BigInt(f), this.row_groups.push({
        columns: u,
        total_byte_size: BigInt(this.writer.offset - a),
        num_rows: BigInt(f)
      }), this.writer.flush?.();
    };
    if (o)
      o = o.then(s);
    else {
      const a = s();
      a && (o = Promise.resolve(a));
    }
  }
  return o;
};
De.prototype.finish = function() {
  Cn(this.writer, this.pendingIndexes), Yt(this.writer, this.pendingIndexes);
  const e = {
    version: 2,
    created_by: "hyparquet",
    schema: this.schema,
    num_rows: this.num_rows,
    row_groups: this.row_groups,
    metadata_length: 0,
    key_value_metadata: this.kvMetadata
  };
  return delete e.metadata_length, kn(this.writer, e), this.writer.appendUint32(827474256), this.writer.finish();
};
function Zn({ columnDataRows: e, rowGroupSize: t }) {
  if (Array.isArray(t) && !t.length)
    throw new Error("rowGroupSize array cannot be empty");
  const n = [];
  let i = 0, o = 0;
  for (; o < e; ) {
    const r = Array.isArray(t) ? t[Math.min(i, t.length - 1)] : t, f = Math.min(r, e - o);
    n.push({ groupStartIndex: o, groupSize: f }), o += r, i++;
  }
  return n;
}
function Kn(e) {
  const t = [];
  return n(e), t;
  function n(i) {
    const o = i[i.length - 1];
    if (!o.children.length) {
      t.push(i);
      return;
    }
    for (const r of o.children)
      n([...i, r]);
  }
}
function Wn({
  writer: e,
  columnData: t,
  schema: n,
  codec: i = "SNAPPY",
  compressors: o,
  statistics: r = !0,
  rowGroupSize: f = [1e3, 1e5],
  kvMetadata: s,
  pageSize: a = 1048576
}) {
  if (t = t.map((d) => {
    if (d.shredding === !0 && d.type === "VARIANT") {
      const l = an(Array.from(d.data));
      return l ? { ...d, shredding: l } : { ...d, shredding: void 0 };
    }
    if (d.shredding !== void 0 && d.shredding !== !0 && d.type === "VARIANT") {
      const l = j(d.shredding);
      return l ? { ...d, shredding: l } : { ...d, shredding: void 0 };
    }
    return d;
  }), !n)
    n = pn({ columnData: t });
  else if (t.some(({ type: d }) => d))
    throw new Error("cannot provide both schema and columnData type");
  const u = new De({
    writer: e,
    schema: n,
    codec: i,
    compressors: o,
    statistics: r,
    kvMetadata: s
  }), c = u.write({
    columnData: t,
    rowGroupSize: f,
    pageSize: a
  });
  return c ? c.then(() => u.finish()) : u.finish();
}
function Jn(e) {
  const t = new A();
  return Wn({ ...e, writer: t }), t.getBuffer();
}
export {
  A as ByteWriter,
  De as ParquetWriter,
  hn as autoSchemaElement,
  Nn as geojsonToWkb,
  Wn as parquetWrite,
  Jn as parquetWriteBuffer,
  pn as schemaFromColumnData
};
