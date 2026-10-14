//#region src/files/markdown.ts
async function e(e, { resolveHref: n, resolveImage: r } = {}) {
	let [{ Marked: i }, { default: a }] = await Promise.all([import("./marked.esm-B3MwSSSj.js"), import("./purify.es-B3aQ6p7I.js")]);
	try {
		let t = await new i({ walkTokens(e) {
			e.type === "link" && n ? e.href = n(e.href) : e.type === "image" && r && (e.href = r(e.href));
		} }).parse(e, { async: !0 });
		return a.sanitize(t, {
			FORBID_TAGS: [
				"style",
				"form",
				"input",
				"button"
			],
			FORBID_ATTR: ["style"]
		});
	} catch {
		return `<pre>${t(e)}</pre>`;
	}
}
function t(e) {
	return e.replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
//#endregion
export { e as t };
