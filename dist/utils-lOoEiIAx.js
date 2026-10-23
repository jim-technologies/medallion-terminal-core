import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
// src/components/utils.ts
function i(...e) {
	return e.filter(Boolean).join(" ");
}
function a(e) {
	return e instanceof HTMLElement && (e.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName) || e.closest("[role=\"textbox\"]") !== null);
}
function o({ value: t, defaultValue: n, onChange: i }) {
	let [a, o] = r(n), s = t !== void 0;
	return [s ? t : a, e((e) => {
		s || o(e), i?.(e);
	}, [s, i])];
}
function s(e) {
	return [...e.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"]):not([disabled])")].filter((e) => !e.hidden && e.getAttribute("aria-hidden") !== "true");
}
var c = 0, l = "";
function u(e, r, i) {
	let a = n(null);
	t(() => {
		if (e && typeof document < "u") return a.current = document.activeElement, c === 0 && (l = document.body.style.overflow, document.body.style.overflow = "hidden"), c += 1, (i?.current ?? (r.current ? s(r.current)[0] : void 0) ?? r.current)?.focus(), () => {
			c = Math.max(0, c - 1), c === 0 && (document.body.style.overflow = l), a.current?.isConnected && a.current.focus();
		};
	}, [
		e,
		r,
		i
	]);
}
function d(e, t, n, r) {
	if (e.key === "Escape" && n) {
		e.preventDefault(), e.stopPropagation(), r();
		return;
	}
	if (e.key !== "Tab" || !t.current) return;
	let i = s(t.current);
	if (i.length === 0) {
		e.preventDefault(), t.current.focus();
		return;
	}
	let a = i[0], o = i[i.length - 1];
	e.shiftKey && document.activeElement === a ? (e.preventDefault(), o.focus()) : !e.shiftKey && document.activeElement === o && (e.preventDefault(), a.focus());
}
export { o as a, a as i, s as n, u as o, d as r, i as t };
