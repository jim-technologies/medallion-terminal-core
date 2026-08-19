import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { It as t } from "./MultiDashboard-CwQKjnza.js";
import { jsx as n } from "react/jsx-runtime";
//#region src/widgets/Iframe.tsx
var r = /* @__PURE__ */ e({ Iframe: () => i });
function i({ data: e, options: r }) {
	let { url: i, title: o, sandbox: s } = a(e, r);
	return i ? /* @__PURE__ */ n("iframe", {
		src: i,
		title: o,
		sandbox: s,
		loading: "lazy",
		className: "w-full h-full border-0 rounded"
	}) : /* @__PURE__ */ n(t, { children: "No URL" });
}
function a(e, t) {
	let n, r = "embed", i = "";
	if (typeof e == "string") n = e;
	else if (e && typeof e == "object") {
		let t = e;
		typeof t.url == "string" && (n = t.url), typeof t.label == "string" ? r = t.label : typeof t.title == "string" && (r = t.title), typeof t.sandbox == "string" && (i = t.sandbox);
	}
	return t && (typeof t.url == "string" && !n && (n = t.url), typeof t.title == "string" && r === "embed" && (r = t.title), typeof t.sandbox == "string" && (i = t.sandbox)), {
		url: n,
		title: r,
		sandbox: i
	};
}
//#endregion
export { r as n, i as t };
