import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
//#region src/widgets/Section.tsx
var r = /* @__PURE__ */ e({ Section: () => i });
function i({ options: e }) {
	let r = typeof e?.label == "string" ? e.label : "";
	return /* @__PURE__ */ n("div", {
		className: "h-full flex items-center gap-3 px-1",
		children: [r && /* @__PURE__ */ t("span", {
			className: "text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0",
			children: r
		}), /* @__PURE__ */ t("div", { className: "flex-1 h-px bg-zinc-800" })]
	});
}
//#endregion
export { r as n, i as t };
