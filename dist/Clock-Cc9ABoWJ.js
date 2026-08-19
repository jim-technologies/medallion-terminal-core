import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { useEffect as t, useState as n } from "react";
import { jsx as r, jsxs as i } from "react/jsx-runtime";
//#region src/widgets/Clock.tsx
var a = /* @__PURE__ */ e({ Clock: () => s }), o = [
	"America/New_York",
	"Europe/London",
	"Asia/Singapore"
];
function s({ options: e }) {
	let a = e ?? {}, s = a.zones?.length ? a.zones : o, c = a.format === "12h", [p, m] = n(() => /* @__PURE__ */ new Date());
	return t(() => {
		let e = setInterval(() => m(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(e);
	}, []), /* @__PURE__ */ r("div", {
		className: "h-full flex items-center justify-around gap-3",
		children: s.map((e) => {
			let t = u(p, e, c), n = d(p, e), a = l(e), o = f(e, p);
			return /* @__PURE__ */ i("div", {
				className: "flex flex-col items-center",
				children: [
					/* @__PURE__ */ i("div", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5",
						children: [/* @__PURE__ */ r("span", { children: a }), /* @__PURE__ */ r("span", { className: `w-1.5 h-1.5 rounded-full ${o}` })]
					}),
					/* @__PURE__ */ r("div", {
						className: "text-base font-semibold text-zinc-100 tabular-nums",
						children: t
					}),
					/* @__PURE__ */ r("div", {
						className: "text-[10px] text-zinc-600 tabular-nums",
						children: n
					})
				]
			}, e);
		})
	});
}
var c = {
	"America/New_York": "NY",
	"America/Los_Angeles": "LA",
	"America/Chicago": "CHI",
	"Europe/London": "LDN",
	"Europe/Frankfurt": "FRA",
	"Asia/Tokyo": "TYO",
	"Asia/Singapore": "SGP",
	"Asia/Hong_Kong": "HKG",
	"Asia/Shanghai": "SHA",
	"Australia/Sydney": "SYD",
	UTC: "UTC"
};
function l(e) {
	return c[e] ?? e.split("/").pop() ?? e;
}
function u(e, t, n) {
	try {
		return new Intl.DateTimeFormat("en-US", {
			timeZone: t,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: n
		}).format(e);
	} catch {
		return "—";
	}
}
function d(e, t) {
	try {
		return new Intl.DateTimeFormat("en-US", {
			timeZone: t,
			timeZoneName: "shortOffset"
		}).formatToParts(e).find((e) => e.type === "timeZoneName")?.value ?? "";
	} catch {
		return "";
	}
}
function f(e, t) {
	try {
		let n = new Intl.DateTimeFormat("en-US", {
			timeZone: e,
			hour: "2-digit",
			hour12: !1
		}).format(t), r = Number(n);
		return Number.isFinite(r) ? r >= 9 && r < 17 ? "bg-emerald-500" : r === 8 || r === 17 ? "bg-amber-500" : "bg-zinc-700" : "bg-zinc-700";
	} catch {
		return "bg-zinc-700";
	}
}
//#endregion
export { a as n, s as t };
