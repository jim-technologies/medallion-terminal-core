import { useEffect as e, useRef as t, useState as n } from "react";
//#region src/hooks/useAnimatedNumber.ts
var r = 400;
function i(i, a = r) {
	let [o, s] = n(i), c = t(i), l = t(0), u = t(void 0);
	return e(() => {
		if (typeof window > "u" || !Number.isFinite(i)) {
			s(i);
			return;
		}
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			s(i);
			return;
		}
		if (i === o) return;
		c.current = o, l.current = performance.now();
		let e = (t) => {
			let n = Math.min(1, (t - l.current) / a), r = 1 - (1 - n) ** 3, o = c.current + (i - c.current) * r;
			s(o), n < 1 && (u.current = requestAnimationFrame(e));
		};
		return u.current = requestAnimationFrame(e), () => {
			u.current && cancelAnimationFrame(u.current);
		};
	}, [i, a]), o;
}
//#endregion
export { i as t };
