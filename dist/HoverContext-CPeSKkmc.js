import { createContext as e, useContext as t, useMemo as n, useState as r } from "react";
import { jsx as i } from "react/jsx-runtime";
//#region src/core/HoverContext.tsx
var a = e({
	hoverTime: null,
	setHoverTime: () => {}
});
function o() {
	return t(a);
}
function s({ children: e }) {
	let [t, o] = r(null), s = n(() => ({
		hoverTime: t,
		setHoverTime: o
	}), [t]);
	return /* @__PURE__ */ i(a.Provider, {
		value: s,
		children: e
	});
}
//#endregion
export { s as n, o as r, a as t };
