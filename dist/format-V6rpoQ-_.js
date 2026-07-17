//#region src/widgets/format.ts
function e(e) {
	return typeof e == "number" ? Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 2) : String(e);
}
function t(e) {
	return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : Math.abs(e) < 1 ? e.toFixed(2) : e.toFixed(1);
}
function n(e) {
	return Math.abs(e) >= 0xe8d4a51000 ? (e / 0xe8d4a51000).toFixed(2) + "T" : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function r(e) {
	if (e == null) return "";
	try {
		let t = new Date(e);
		return isNaN(t.getTime()) ? String(e) : t.toLocaleDateString(void 0, {
			month: "short",
			day: "numeric"
		});
	} catch {
		return String(e);
	}
}
var i = 864e5;
function a(e) {
	let t = !1, n = Infinity, r = -Infinity;
	for (let i of e) {
		let e = String(i ?? "");
		!t && e.includes(":") && (t = !0);
		let a = new Date(e).getTime();
		isNaN(a) || (a < n && (n = a), a > r && (r = a));
	}
	return {
		hasTime: t,
		spanMs: r > n ? r - n : 0
	};
}
function o(e) {
	return e.hasTime ? e.spanMs <= 2 * i ? (e) => {
		try {
			let t = new Date(e);
			return isNaN(t.getTime()) ? String(e) : t.toLocaleTimeString(void 0, {
				hour: "2-digit",
				minute: "2-digit"
			});
		} catch {
			return String(e);
		}
	} : e.spanMs <= 14 * i ? c : r : r;
}
function s(e) {
	return e.hasTime ? c : r;
}
function c(e) {
	if (e == null) return "";
	try {
		let t = new Date(e);
		return isNaN(t.getTime()) ? String(e) : t.toLocaleString(void 0, {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	} catch {
		return String(e);
	}
}
function l(e, t = {}) {
	let { decimals: n = 2, as: r = "fraction", signed: i = !1 } = t, a = r === "fraction" ? e * 100 : e;
	return `${i && a > 0 ? "+" : ""}${a.toFixed(n)}%`;
}
function u(e, t = "USD", n = {}) {
	let { compact: r = !1, decimals: i } = n;
	try {
		return e.toLocaleString(void 0, {
			style: "currency",
			currency: t,
			maximumFractionDigits: i ?? (r ? 0 : Math.abs(e) >= 100 ? 2 : 4),
			minimumFractionDigits: i ?? (r || Math.abs(e) >= 100 ? 0 : 2)
		});
	} catch {
		return e.toLocaleString();
	}
}
function d(e, t = {}) {
	let { signed: n = !1, as: r = "fraction" } = t, i = r === "fraction" ? e * 1e4 : e * 100;
	return `${n && i > 0 ? "+" : ""}${Math.round(i)} bps`;
}
//#endregion
export { c as a, r as c, a as d, u as i, s as l, d as n, l as o, t as r, n as s, e as t, o as u };
