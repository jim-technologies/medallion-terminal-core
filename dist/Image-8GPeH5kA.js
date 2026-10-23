import { t as e } from "./rolldown-runtime-CGnMp29N.js";
import { Ft as t } from "./MultiDashboard-BDuKPDoC.js";
import { jsx as n } from "react/jsx-runtime";
// src/widgets/Image.tsx
var r = /* @__PURE__ */ e({ Image: () => i });
function i({ data: e }) {
	let { url: r, alt: i } = a(e);
	return r ? /* @__PURE__ */ n("div", {
		className: "h-full w-full flex items-center justify-center",
		children: /* @__PURE__ */ n("img", {
			src: r,
			alt: i,
			loading: "lazy",
			className: "max-w-full max-h-full object-contain"
		})
	}) : /* @__PURE__ */ n(t, { children: "No image" });
}
function a(e) {
	if (typeof e == "string") return {
		url: e,
		alt: ""
	};
	if (e && typeof e == "object") {
		let t = e, n = typeof t.label == "string" ? t.label : typeof t.alt == "string" ? t.alt : "";
		return {
			url: typeof t.url == "string" ? t.url : void 0,
			alt: n
		};
	}
	return {
		url: void 0,
		alt: ""
	};
}
export { r as n, i as t };
