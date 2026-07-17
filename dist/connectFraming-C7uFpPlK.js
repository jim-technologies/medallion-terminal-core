//#region src/core/connectFraming.ts
var e = "application/connect+json", t = new TextDecoder();
async function n(e, n) {
	let r = /* @__PURE__ */ new Uint8Array(), i = 0;
	for (; !n.isDisposed();) {
		let { done: a, value: o } = await e.read();
		if (a) break;
		if (o && o.length > 0) {
			let e = r.length - i, t = new Uint8Array(e + o.length);
			e > 0 && t.set(r.subarray(i), 0), t.set(o, e), r = t, i = 0;
		}
		for (; r.length - i >= 5;) {
			let e = r[i], a = new DataView(r.buffer, r.byteOffset + i + 1, 4).getUint32(0);
			if (r.length - i < 5 + a) break;
			if (e & 2) {
				let e = r.subarray(i + 5, i + 5 + a);
				i += 5 + a;
				let o = {};
				try {
					e.length > 0 && (o = JSON.parse(t.decode(e)));
				} catch {}
				n.isDisposed() || n.onTrailer?.(o);
				return;
			}
			let o = r.subarray(i + 5, i + 5 + a);
			i += 5 + a;
			try {
				let e = JSON.parse(t.decode(o));
				n.isDisposed() || n.onMessage(e);
			} catch {}
		}
	}
}
//#endregion
export { n, e as t };
