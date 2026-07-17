import { createContext as e, useContext as t, useEffect as n, useMemo as r, useRef as i, useState as a } from "react";
import { jsx as o } from "react/jsx-runtime";
//#region src/core/NowContext.tsx
var s = e({
	now: 0,
	subscribe: () => () => {}
});
function c(e = !0) {
	let { now: r, subscribe: i } = t(s);
	return n(() => {
		if (e) return i();
	}, [e, i]), r;
}
function l({ children: e }) {
	let [t, c] = a(() => Date.now()), l = i(0), u = i(null), d = r(() => ({
		now: t,
		subscribe: () => (l.current += 1, u.current ??= setInterval(() => c(Date.now()), 1e3), () => {
			l.current = Math.max(0, l.current - 1), l.current === 0 && u.current != null && (clearInterval(u.current), u.current = null);
		})
	}), [t]);
	return n(() => () => {
		u.current != null && clearInterval(u.current);
	}, []), /* @__PURE__ */ o(s.Provider, {
		value: d,
		children: e
	});
}
//#endregion
export { l as n, c as r, s as t };
