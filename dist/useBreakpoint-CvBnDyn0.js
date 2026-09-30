import { useEffect as e, useState as t } from "react";
//#region src/hooks/useBreakpoint.ts
function n() {
	if (typeof window > "u") return "desktop";
	let e = window.innerWidth;
	return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function r() {
	let [r, i] = t(n);
	return e(() => {
		let e = () => i(n());
		return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, []), r;
}
//#endregion
export { r as t };
