//#region src/files/markdown.ts
async function e(e) {
	let [{ marked: n }, { default: r }] = await Promise.all([import("./marked.esm-B3MwSSSj.js"), import("./purify.es-B3aQ6p7I.js")]);
	try {
		let t = await n.parse(e, { async: !0 });
		return r.sanitize(t, {
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
