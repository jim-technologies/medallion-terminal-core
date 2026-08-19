import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
//#region src/components/utils.ts
function i(...e) {
	return e.filter(Boolean).join(" ");
}
function a({ value: t, defaultValue: n, onChange: i }) {
	let [a, o] = r(n), s = t !== void 0;
	return [s ? t : a, e((e) => {
		s || o(e), i?.(e);
	}, [s, i])];
}
function o(e) {
	return [...e.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"]):not([disabled])")].filter((e) => !e.hidden && e.getAttribute("aria-hidden") !== "true");
}
var s = 0, c = "";
function l(e, r, i) {
	let a = n(null);
	t(() => {
		if (!(!e || typeof document > "u")) return a.current = document.activeElement, s === 0 && (c = document.body.style.overflow, document.body.style.overflow = "hidden"), s += 1, (i?.current ?? (r.current ? o(r.current)[0] : void 0) ?? r.current)?.focus(), () => {
			s = Math.max(0, s - 1), s === 0 && (document.body.style.overflow = c), a.current?.isConnected && a.current.focus();
		};
	}, [
		e,
		r,
		i
	]);
}
function u(e, t, n, r) {
	if (e.key === "Escape" && n) {
		e.preventDefault(), e.stopPropagation(), r();
		return;
	}
	if (e.key !== "Tab" || !t.current) return;
	let i = o(t.current);
	if (i.length === 0) {
		e.preventDefault(), t.current.focus();
		return;
	}
	let a = i[0], s = i[i.length - 1];
	e.shiftKey && document.activeElement === a ? (e.preventDefault(), s.focus()) : !e.shiftKey && document.activeElement === s && (e.preventDefault(), a.focus());
}
//#endregion
export { l as i, u as n, a as r, i as t };
