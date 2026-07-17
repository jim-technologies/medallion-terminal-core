//#region src/widgets/colors.ts
var e = {
	ok: "var(--mtc-ok)",
	warn: "var(--mtc-warning)",
	danger: "var(--mtc-danger)",
	error: "var(--mtc-danger)",
	info: "var(--mtc-accent)",
	muted: "var(--mtc-muted)"
}, t = [
	"var(--mtc-chart-1)",
	"var(--mtc-chart-2)",
	"var(--mtc-chart-3)",
	"var(--mtc-chart-4)",
	"var(--mtc-chart-5)",
	"var(--mtc-chart-6)",
	"var(--mtc-chart-7)",
	"var(--mtc-chart-8)"
], n = {
	backgroundColor: "var(--mtc-surface-raised)",
	border: "1px solid var(--mtc-border-strong)",
	borderRadius: 4,
	boxShadow: "var(--mtc-shadow-raised)",
	fontSize: 12,
	color: "var(--mtc-fg)"
};
function r(n, r) {
	return n ? n in e ? e[n] : n.startsWith("#") ? n : t[r % t.length] : t[r % t.length];
}
function i(e, n = t) {
	return e.map((e, t) => n[t % n.length]);
}
//#endregion
export { r as a, i, e as n, n as r, t };
