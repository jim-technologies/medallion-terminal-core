import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { i as t, n } from "./utils-j4lJ7S1v.js";
import { At as r, Dt as i, It as a, bt as o, wt as s } from "./MultiDashboard-BbyBoU3s.js";
import { s as c } from "./AssetOpen-CjGLA-3L.js";
import { r as ee, t as l } from "./useWatchAction-Fgir5QrK.js";
import { _ as u, a as d, b as f, c as p, d as m, f as h, g, h as _, i as v, l as te, m as ne, n as y, o as re, p as ie, r as ae, s as b, t as oe, u as se, v as x, x as S, y as C } from "./fileBrowserHelpers-Duhl_DbY.js";
import { useEffect as ce, useMemo as w, useRef as T, useState as E } from "react";
import { Fragment as D, jsx as O, jsxs as k } from "react/jsx-runtime";
//#region src/widgets/fileBrowserDecoders.ts
async function A(e) {
	let t = await fetch(e);
	if (!t.ok) throw Error(`fetch failed: ${t.status}`);
	return t.text();
}
function j(e) {
	try {
		return JSON.stringify(JSON.parse(e), null, 2);
	} catch {
		return e;
	}
}
function M(e) {
	let t = [], n = [], r = "", i = !1;
	for (let a = 0; a < e.length; a++) {
		let o = e[a];
		if (i) {
			if (o === "\"" && e[a + 1] === "\"") {
				r += "\"", a++;
				continue;
			}
			if (o === "\"") {
				i = !1;
				continue;
			}
			r += o;
			continue;
		}
		if (o === "\"") {
			i = !0;
			continue;
		}
		if (o === ",") {
			n.push(r), r = "";
			continue;
		}
		if (o === "\n" || o === "\r") {
			o === "\r" && e[a + 1] === "\n" && a++, n.push(r), r = "", t.push(n), n = [];
			continue;
		}
		r += o;
	}
	return (r !== "" || n.length > 0) && (n.push(r), t.push(n)), t;
}
async function N(e) {
	let [{ marked: t }, { default: n }] = await Promise.all([import("./marked.esm-B3MwSSSj.js"), import("./purify.es-B3aQ6p7I.js")]);
	try {
		let r = await t.parse(e, { async: !0 });
		return n.sanitize(r);
	} catch {
		return `<pre>${P(e)}</pre>`;
	}
}
function P(e) {
	return e.replace(/[&<>"']/g, (e) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[e]);
}
//#endregion
//#region src/widgets/FileBrowser.tsx
var F = /* @__PURE__ */ e({ FileBrowser: () => I });
function I({ data: e, options: t, widgetId: n }) {
	let m = t ?? {}, { ctx: _, setCtx: A, backendUrl: j, backendHeaders: M, fetch: N, toast: P, requestRefresh: F, emitIntent: I } = r(), { available: ue, openAsset: de, openWith: fe } = c(), R = m.path_ctx ?? "path", pe = m.bucket_ctx ?? "org", z = m.bucket_param ?? "org", me = m.page_ctx ?? "page", he = m.page_size_ctx ?? "page_size", ge = m.view_mode_ctx ?? "view_mode", _e = m.upload_action_id ?? "upload", ve = m.upload_url, B = m.ingest_url, V = _[pe] ?? "default", H = _[R] ?? "", U = parseInt(_[me] ?? "1", 10) || 1, ye = parseInt(_[he] ?? "50", 10) || 50, be = _[ge] === "gallery" ? "gallery" : "icons", [xe, Se] = E(!1), [Ce, we] = E(!1), W = T(!1), [G, Te] = E(null), [Ee, K] = E(!1), [De, Oe] = E("url"), [ke, Ae] = E(""), [je, Me] = E(""), [Ne, Pe] = E(""), [q, Fe] = E(!1), Ie = m.search_url, [Le, Re] = E(""), [J, ze] = E(null), [Be, Ve] = E(!1), Y = T(null);
	ce(() => () => Y.current?.abort(), []);
	let X = w(() => h(e), [e]), He = J ?? X, Z = w(() => J || C(X), [J, X]), Ue = w(() => f(H), [H]), We = !J && U > 1, Ge = !J && X.length >= ye, Ke = m.media_url_template ?? "/media?namespace={namespace}&path={path}", qe = ue && m.open_with !== !1;
	ce(() => {
		U !== 1 && A(me, "1");
	}, [V, H]);
	let Je = (e) => A(R, e), Ye = (e) => A(me, String(Math.max(1, e))), Xe = () => A(ge, be === "gallery" ? "icons" : "gallery"), Ze = async () => {
		if (!Ie) return;
		let e = Le.trim();
		if (e === "") {
			Q();
			return;
		}
		if (Y.current) return;
		let t = new AbortController();
		Y.current = t, Ve(!0);
		try {
			let n = x(j, Ie), r = await S(j, n, N)(n, {
				method: "POST",
				headers: {
					...y(j, n, M),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[z]: V,
					query: e
				}),
				signal: t.signal
			});
			if (!r.ok) {
				P(`Search failed: ${await u(r)}`, "error");
				return;
			}
			let i = await r.json();
			if (Y.current !== t) return;
			ze((i.hits ?? []).map((e) => ({
				...e,
				kind: "file"
			})));
		} catch (e) {
			t.signal.aborted || P(`Search failed: ${v(e)}`, "error");
		} finally {
			Y.current === t && (Y.current = null, Ve(!1));
		}
	}, Q = () => {
		Y.current?.abort(), Y.current = null, Ve(!1), Re(""), ze(null);
	}, Qe = (e) => {
		Q(), Je(e);
	}, $e = () => {
		Ae(H), Me(""), Pe(""), Oe(B ? "url" : "file"), K(!0);
	}, et = async () => {
		if (!B) return;
		let e = ke.trim(), t = je.trim(), n = Ne.trim();
		if (!e || !t || !n) {
			P("Need a folder (repo), a filename, and a URL", "error");
			return;
		}
		if (W.current) {
			P("Another file operation is already in progress", "warn");
			return;
		}
		W.current = !0, Fe(!0);
		try {
			let r = x(j, B), i = await S(j, r, N)(r, {
				method: "POST",
				headers: {
					...y(j, r, M),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[z]: V,
					repo: e,
					path: t,
					url: n
				})
			});
			if (!i.ok) throw Error(await u(i));
			P(`Fetching ${t} in the background — it'll appear when done.`, "ok"), K(!1);
		} catch (e) {
			P(`Ingest failed: ${v(e)}`, "error");
		} finally {
			W.current = !1, Fe(!1);
		}
	}, tt = async (e) => {
		let t = ke.trim(), r = je.trim() || e.name;
		if (!t) {
			P("Need a destination folder (repo)", "error");
			return;
		}
		if (W.current) {
			P("Another file operation is already in progress", "warn");
			return;
		}
		W.current = !0, Fe(!0);
		try {
			await lt(e, t, r), P(`Uploaded ${r}`, "ok"), K(!1), F(n ?? "*");
		} catch (e) {
			P(`Upload failed: ${v(e)}`, "error");
		} finally {
			W.current = !1, Fe(!1);
		}
	}, $ = (e) => e.path && e.path !== "" ? e.path : te(H, e.name ?? ""), nt = (e) => Ke && e.name ? x(j, ae(Ke, V, $(e))) : "", rt = (e) => {
		let t = g(e.content_type, e.name, e.kind), r = m.open_intent ?? (t === "video" || t === "audio" || t === "mkv" ? "play" : "view");
		return {
			asset: {
				id: e.id ?? e.object_id,
				namespace: V,
				path: $(e),
				name: e.name ?? ($(e) || "Untitled file"),
				kind: e.kind,
				contentType: e.content_type,
				sizeBytes: e.size_bytes,
				modifiedAt: e.modified_at,
				capabilities: e.capabilities,
				symlinkTargetId: e.symlink_target_id,
				url: nt(e) || void 0,
				metadata: { ...e.metadata }
			},
			intent: r,
			source: {
				component: "file_browser",
				widgetId: n
			}
		};
	}, it = (e) => {
		let t = g(e.content_type, e.name, e.kind), n = !!Ke && p(t);
		return {
			native: n ? () => Te(e) : void 0,
			nativeLabel: n ? "Native preview" : void 0,
			download: m.download_url ? () => ct(e) : void 0
		};
	}, at = (e) => {
		fe(rt(e), it(e));
	}, ot = (e) => {
		let t = e.id ?? e.object_id;
		t && I?.({
			type: "object.select",
			objectId: t
		});
	}, st = (e) => {
		let t = e.id ?? e.object_id;
		if (t && I?.({
			type: "object.open",
			objectId: t,
			mode: b(e) ? "browse" : m.open_intent ?? "preview"
		}), b(e)) {
			J ? Qe($(e)) : Je($(e));
			return;
		}
		if (ue && m.open_with !== !1) {
			de(rt(e), it(e));
			return;
		}
		if (Ke && p(g(e.content_type, e.name, e.kind))) {
			Te(e);
			return;
		}
		ct(e);
	};
	async function ct(e) {
		let t = m.download_url;
		if (!t) {
			P("Download not configured (set options.download_url)", "error");
			return;
		}
		if (!e.name) {
			P("File has no name", "error");
			return;
		}
		let n = $(e), r = x(j, t);
		try {
			let t = await S(j, r, N)(r, {
				method: "POST",
				headers: {
					...y(j, r, M),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[z]: V,
					path: n
				})
			});
			if (!t.ok) {
				let e = await u(t);
				P(`Download failed: ${e}`, "error");
				return;
			}
			let i = await ie(t, e.content_type), a = document.createElement("a");
			a.href = URL.createObjectURL(i), a.download = e.name, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
		} catch (e) {
			P(`Download failed: ${v(e)}`, "error");
		}
	}
	let lt = async (e, t, n) => {
		let r = e.type || "application/octet-stream";
		if (ve) {
			let i = new URLSearchParams({
				[z]: V,
				repo: t,
				path: n,
				content_type: r
			}), a = x(j, ve), o = a.includes("?") ? "&" : "?", s = await S(j, a, N)(`${a}${o}${i.toString()}`, {
				method: "POST",
				headers: y(j, a, M),
				body: e
			});
			if (!s.ok) throw Error(await s.text() || `HTTP ${s.status}`);
			return;
		}
		let a = await e.arrayBuffer(), c = s(j ?? ""), d = o({
			actionId: _e,
			params: {
				[z]: V,
				repo: t,
				path: n,
				content_type: r,
				data_b64: oe(a)
			},
			clientRequestId: i()
		}), f = await (N ?? globalThis.fetch)(c, {
			method: "POST",
			headers: {
				...M,
				"Content-Type": "application/json",
				"Connect-Protocol-Version": "1"
			},
			body: JSON.stringify(d)
		});
		if (!f.ok) throw Error(await u(f));
		let p = await f.json();
		if (!ee(p.status)) throw Error(p.message ?? "Upload action did not return a terminal status");
		if (l(p.status)) throw Error(p.message ?? "Upload action failed");
	}, ut = async (e) => {
		if (H === "") {
			P("Open a folder first, or use the Upload button to choose a folder.", "error");
			return;
		}
		if (W.current) {
			P("Another file operation is already in progress", "warn");
			return;
		}
		W.current = !0;
		let t = H;
		we(!0);
		let r = 0;
		try {
			for (let n of Array.from(e)) try {
				await lt(n, t, n.name), r++;
			} catch (e) {
				P(`Upload failed: ${n.name} — ${v(e)}`, "error");
			}
		} finally {
			W.current = !1, we(!1);
		}
		r > 0 && (P(`Uploaded ${r} file${r === 1 ? "" : "s"}`, "ok"), F(n ?? "*"));
	};
	return /* @__PURE__ */ k("div", {
		className: "h-full flex flex-col relative",
		onDragOver: (e) => {
			e.preventDefault(), Se(!0);
		},
		onDragLeave: () => Se(!1),
		onDrop: (e) => {
			e.preventDefault(), Se(!1), e.dataTransfer.files.length > 0 && ut(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ k("div", {
				className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0",
				children: [
					/* @__PURE__ */ O("button", {
						onClick: () => Je(""),
						className: "text-sky-400 hover:underline",
						children: "/"
					}),
					Ue.map((e, t) => {
						let n = Ue.slice(0, t + 1).join("/");
						return /* @__PURE__ */ k("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ O("span", {
								className: "text-zinc-600",
								children: "/"
							}), /* @__PURE__ */ O("button", {
								onClick: () => Je(n),
								className: "text-sky-400 hover:underline",
								children: e
							})]
						}, t);
					}),
					/* @__PURE__ */ k("div", {
						className: "ml-auto flex items-center gap-3 text-zinc-500",
						children: [
							Ie && /* @__PURE__ */ k("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ O("input", {
										type: "search",
										value: Le,
										onChange: (e) => Re(e.target.value),
										onKeyDown: (e) => {
											e.key === "Enter" && Ze(), e.key === "Escape" && Q();
										},
										placeholder: "Search files…",
										className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
									}),
									/* @__PURE__ */ O("button", {
										onClick: () => void Ze(),
										disabled: Be,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
										"aria-label": "Search",
										title: "Search this namespace",
										children: Be ? "…" : "🔍"
									}),
									J && /* @__PURE__ */ O("button", {
										onClick: Q,
										className: "text-zinc-400 hover:text-zinc-100 px-1",
										title: "Clear search, back to browsing",
										children: "✕"
									})
								]
							}),
							(ve || _e || B) && /* @__PURE__ */ O("button", {
								onClick: $e,
								className: "text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5",
								title: "Upload a file or fetch a media URL",
								children: "⬆ Upload"
							}),
							/* @__PURE__ */ O("button", {
								onClick: Xe,
								className: "text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5",
								title: be === "gallery" ? "Switch to icons (no thumbnails)" : "Switch to gallery (loads image thumbnails)",
								children: be === "gallery" ? "◫ Gallery" : "☰ Icons"
							}),
							/* @__PURE__ */ O("span", {
								className: "tabular-nums",
								children: J ? `${J.length} result${J.length === 1 ? "" : "s"}` : `${He.length} on page`
							}),
							(We || Ge) && /* @__PURE__ */ k("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ O("button", {
										onClick: () => Ye(U - 1),
										disabled: !We,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
										"aria-label": "Previous page",
										children: "‹"
									}),
									/* @__PURE__ */ k("span", {
										className: "tabular-nums text-zinc-400",
										children: ["Page ", U]
									}),
									/* @__PURE__ */ O("button", {
										onClick: () => Ye(U + 1),
										disabled: !Ge,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
										"aria-label": "Next page",
										children: "›"
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ k("div", {
				className: "flex-1 overflow-auto relative min-h-0",
				children: [
					xe && /* @__PURE__ */ O("div", {
						className: "absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none",
						children: /* @__PURE__ */ O("div", {
							className: "text-sky-300 text-sm",
							children: "Drop files to upload"
						})
					}),
					Z.length === 0 ? /* @__PURE__ */ O(a, { children: J ? "No files match your search." : "This folder is empty. Drop files to upload." }) : be === "gallery" ? /* @__PURE__ */ O(L, {
						entries: Z,
						onClick: st,
						onSelect: ot,
						onOpenWith: qe ? at : void 0,
						mediaUrlFor: nt,
						entryKey: (e) => d(e, H)
					}) : /* @__PURE__ */ k("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ O("thead", {
							className: "sticky top-0 bg-zinc-900 z-[1]",
							children: /* @__PURE__ */ k("tr", {
								className: "text-zinc-400 border-b border-zinc-800",
								children: [
									/* @__PURE__ */ O("th", {
										className: "text-left px-3 py-2 w-8",
										children: /* @__PURE__ */ O("span", {
											className: "sr-only",
											children: "Entry kind"
										})
									}),
									/* @__PURE__ */ O("th", {
										className: "text-left px-3 py-2",
										children: "Name"
									}),
									/* @__PURE__ */ O("th", {
										className: "text-right px-3 py-2 w-24",
										children: "Size"
									}),
									/* @__PURE__ */ O("th", {
										className: "text-left px-3 py-2 w-40",
										children: "Type"
									}),
									/* @__PURE__ */ O("th", {
										className: "text-left px-3 py-2 w-36",
										children: "Modified"
									}),
									qe && /* @__PURE__ */ O("th", {
										className: "w-10",
										children: /* @__PURE__ */ O("span", {
											className: "sr-only",
											children: "Actions"
										})
									})
								]
							})
						}), /* @__PURE__ */ O("tbody", { children: Z.map((e, t) => /* @__PURE__ */ k("tr", {
							tabIndex: 0,
							onClick: () => ot(e),
							onDoubleClick: () => st(e),
							onKeyDown: (t) => {
								t.key === "Enter" ? (t.preventDefault(), st(e)) : t.key === " " && (t.preventDefault(), ot(e));
							},
							className: "group border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none",
							children: [
								/* @__PURE__ */ O("td", {
									className: "px-3 py-1.5 select-none",
									children: b(e) ? "📁" : "📄"
								}),
								/* @__PURE__ */ O("td", {
									className: "px-3 py-1.5 text-zinc-100 truncate",
									children: e.name
								}),
								/* @__PURE__ */ O("td", {
									className: "px-3 py-1.5 text-right text-zinc-400",
									children: b(e) ? "—" : re(e.size_bytes ?? 0)
								}),
								/* @__PURE__ */ O("td", {
									className: "px-3 py-1.5 text-zinc-500 truncate",
									children: e.content_type ?? ""
								}),
								/* @__PURE__ */ O("td", {
									className: "px-3 py-1.5 text-zinc-500 truncate",
									children: e.modified_at ?? ""
								}),
								qe && /* @__PURE__ */ O("td", {
									className: "pr-2 text-right",
									children: !b(e) && /* @__PURE__ */ O("button", {
										type: "button",
										onClick: (t) => {
											t.stopPropagation(), at(e);
										},
										onDoubleClick: (e) => e.stopPropagation(),
										className: "size-7 rounded text-zinc-600 hover:text-zinc-100 hover:bg-zinc-700/70 opacity-60 group-hover:opacity-100 focus:opacity-100",
										"aria-label": `Open ${e.name ?? "file"} with another application`,
										title: "Open with…",
										children: "···"
									})
								})
							]
						}, d(e, H) || String(t))) })]
					}),
					Ce && /* @__PURE__ */ O("div", {
						className: "absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg",
						children: "Uploading…"
					})
				]
			}),
			G && /* @__PURE__ */ O(le, {
				entry: G,
				mediaUrl: nt(G),
				autoAdvanceQueue: ne(Z),
				navigableQueue: se(Z),
				onSelect: (e) => Te(e),
				onClose: () => Te(null),
				onDownload: () => {
					ct(G);
				},
				onOpenWith: qe ? () => at(G) : void 0
			}),
			Ee && /* @__PURE__ */ O("div", {
				className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60",
				onClick: () => {
					q || K(!1);
				},
				children: /* @__PURE__ */ k("div", {
					className: "flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ k("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ k("h2", {
								className: "text-sm font-medium text-zinc-100",
								children: ["Upload to ", V]
							}), /* @__PURE__ */ O("button", {
								onClick: () => {
									q || K(!1);
								},
								className: "text-zinc-500 hover:text-zinc-200",
								"aria-label": "Close",
								children: "✕"
							})]
						}),
						B && /* @__PURE__ */ k("div", {
							className: "flex gap-1 text-xs",
							children: [/* @__PURE__ */ O("button", {
								onClick: () => Oe("url"),
								className: `px-3 py-1 rounded border ${De === "url" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
								children: "From URL"
							}), /* @__PURE__ */ O("button", {
								onClick: () => Oe("file"),
								className: `px-3 py-1 rounded border ${De === "file" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
								children: "Local file"
							})]
						}),
						/* @__PURE__ */ k("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Folder (repo)",
								/* @__PURE__ */ O("input", {
									type: "text",
									value: ke,
									onChange: (e) => Ae(e.target.value),
									placeholder: "e.g. year=2026/name=avatar",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ O("span", {
									className: "text-zinc-600",
									children: "The repository partition. Becomes a source key."
								})
							]
						}),
						/* @__PURE__ */ k("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Filename ",
								De === "file" && "(optional — defaults to the file’s name)",
								/* @__PURE__ */ O("input", {
									type: "text",
									value: je,
									onChange: (e) => Me(e.target.value),
									placeholder: "e.g. avatar.mp4",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ O("span", {
									className: "text-zinc-600",
									children: "Location inside the repo (may include subfolders)."
								})
							]
						}),
						De === "url" ? /* @__PURE__ */ k(D, { children: [/* @__PURE__ */ k("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Media URL",
								/* @__PURE__ */ O("input", {
									type: "url",
									value: Ne,
									onChange: (e) => Pe(e.target.value),
									placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ O("span", {
									className: "text-zinc-600",
									children: "HTTP(S) media URL or raw HLS playlist. Fetched server-side."
								})
							]
						}), /* @__PURE__ */ O("button", {
							onClick: () => void et(),
							disabled: q,
							className: "self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm",
							children: q ? "Starting…" : "Fetch & store"
						})] }) : /* @__PURE__ */ k(D, { children: [/* @__PURE__ */ O("input", {
							type: "file",
							onChange: (e) => {
								let t = e.target.files?.[0];
								t && tt(t);
							},
							disabled: q,
							className: "text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
						}), q && /* @__PURE__ */ O("span", {
							className: "self-end text-xs text-zinc-400",
							children: "Uploading…"
						})] })
					]
				})
			})
		]
	});
}
function L({ entries: e, onClick: t, onSelect: n, onOpenWith: r, mediaUrlFor: i, entryKey: a }) {
	return /* @__PURE__ */ O("div", {
		className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3",
		children: e.map((e, o) => {
			let s = g(e.content_type, e.name, e.kind) === "image", c = b(e);
			return /* @__PURE__ */ k("div", {
				className: "group relative min-w-0",
				children: [/* @__PURE__ */ k("button", {
					type: "button",
					onClick: () => n?.(e),
					onDoubleClick: () => t(e),
					onKeyDown: (n) => {
						n.key === "Enter" && (n.preventDefault(), t(e));
					},
					className: "w-full flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left select-none",
					children: [/* @__PURE__ */ O("div", {
						className: "w-full aspect-square bg-zinc-950 rounded flex items-center justify-center overflow-hidden",
						children: c ? /* @__PURE__ */ O("span", {
							className: "text-4xl select-none",
							children: "📁"
						}) : s && e.name ? /* @__PURE__ */ O("img", {
							src: i(e),
							alt: e.name ?? "",
							loading: "lazy",
							decoding: "async",
							className: "w-full h-full object-cover"
						}) : /* @__PURE__ */ O("span", {
							className: "text-4xl select-none",
							children: "📄"
						})
					}), /* @__PURE__ */ O("span", {
						className: "w-full text-xs text-zinc-200 truncate",
						title: e.name,
						children: e.name
					})]
				}), r && !c && /* @__PURE__ */ O("button", {
					type: "button",
					onClick: () => r(e),
					onDoubleClick: (e) => e.stopPropagation(),
					className: "absolute top-3 right-3 size-7 rounded bg-zinc-950/85 border border-zinc-700 text-zinc-400 hover:text-white opacity-70 group-hover:opacity-100 focus:opacity-100 shadow",
					"aria-label": `Open ${e.name ?? "file"} with another application`,
					title: "Open with…",
					children: "···"
				})]
			}, a(e) || String(o));
		})
	});
}
function le({ entry: e, mediaUrl: r, autoAdvanceQueue: i, navigableQueue: a, onSelect: o, onClose: s, onDownload: c, onOpenWith: ee }) {
	let l = g(e.content_type, e.name, e.kind), u = l === "text" || l === "json" || l === "yaml" || l === "csv" || l === "markdown", [f, p] = E(l === "image" || l === "video" || l === "pdf" || u), [h, te] = E(!1), [ne, y] = E(null), [ie, ae] = E(null), [b, oe] = E(null), [se, x] = E(null), S = a.length > 1, C = d(e), w = a.findIndex((e) => d(e) === C), [D, P] = E(!1), [F, I] = E(!0), L = T(null), le = T(null);
	t(!0, L, le);
	let ue = () => {
		let e = m(a, C, D, F);
		e && o(e);
	}, de = () => {
		let e = _(a, C, F);
		e && o(e);
	}, fe = () => {
		let e = m(i, C, D, F);
		e && o(e);
	}, R = () => p(!1), pe = () => {
		p(!1), te(!0), y(null);
	}, z = (e) => {
		e.target === e.currentTarget && s();
	};
	return ce(() => {
		if (!u) return;
		let e = !1;
		return (async () => {
			try {
				let t = await A(r);
				if (e) return;
				l === "csv" ? oe(M(t)) : l === "json" ? ae(j(t)) : l === "markdown" ? x(await N(t)) : ae(t), p(!1);
			} catch (t) {
				if (e) return;
				y(v(t)), te(!0), p(!1);
			}
		})(), () => {
			e = !0;
		};
	}, [
		l,
		u,
		r
	]), /* @__PURE__ */ k("div", {
		ref: L,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Preview ${e.name ?? "file"}`,
		tabIndex: -1,
		className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
		onClick: z,
		onKeyDown: (e) => {
			if (n(e, L, !0, s), e.defaultPrevented) return;
			let t = e.target;
			if (!(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
				if (e.key === "ArrowRight") e.preventDefault(), ue();
				else if (e.key === "ArrowLeft") e.preventDefault(), de();
				else if (e.key === " ") {
					let t = L.current?.querySelector("video, audio");
					t && (e.preventDefault(), t.paused ? t.play() : t.pause());
				}
			}
		},
		children: [/* @__PURE__ */ k("div", {
			className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900",
			children: [
				/* @__PURE__ */ O("span", {
					className: "text-sm font-medium truncate flex-1",
					children: e.name
				}),
				/* @__PURE__ */ O("span", {
					className: "text-xs text-zinc-500 truncate max-w-[200px]",
					children: e.content_type
				}),
				typeof e.size_bytes == "number" && /* @__PURE__ */ O("span", {
					className: "text-xs text-zinc-600 tabular-nums",
					children: re(e.size_bytes)
				}),
				S && /* @__PURE__ */ k("div", {
					className: "flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2",
					children: [
						/* @__PURE__ */ O("button", {
							onClick: de,
							className: "hover:text-zinc-100 leading-none px-1",
							"aria-label": "Previous (←)",
							title: "Previous (←)",
							children: "⏮"
						}),
						/* @__PURE__ */ O("button", {
							onClick: ue,
							className: "hover:text-zinc-100 leading-none px-1",
							"aria-label": "Next (→)",
							title: "Next (→)",
							children: "⏭"
						}),
						/* @__PURE__ */ O("button", {
							onClick: () => P((e) => !e),
							className: `px-1 leading-none ${D ? "text-sky-400" : "hover:text-zinc-100"}`,
							"aria-label": "Toggle shuffle",
							title: D ? "Shuffle on" : "Shuffle off",
							children: "🔀"
						}),
						/* @__PURE__ */ O("button", {
							onClick: () => I((e) => !e),
							className: `px-1 leading-none ${F ? "text-sky-400" : "hover:text-zinc-100"}`,
							"aria-label": "Toggle repeat",
							title: F ? "Repeat on" : "Repeat off",
							children: "🔁"
						}),
						/* @__PURE__ */ k("span", {
							className: "text-xs text-zinc-500 tabular-nums",
							children: [
								w >= 0 ? w + 1 : "–",
								" / ",
								a.length
							]
						})
					]
				}),
				ee && /* @__PURE__ */ O("button", {
					type: "button",
					onClick: ee,
					className: "text-xs text-zinc-400 hover:text-zinc-100",
					children: "Open with…"
				}),
				/* @__PURE__ */ O("button", {
					onClick: c,
					className: "text-xs text-sky-400 hover:underline",
					children: "Download"
				}),
				/* @__PURE__ */ O("button", {
					ref: le,
					onClick: s,
					className: "text-zinc-400 hover:text-zinc-100 text-lg leading-none",
					"aria-label": "Close preview",
					children: "×"
				})
			]
		}), /* @__PURE__ */ k("div", {
			className: "flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative",
			onClick: z,
			children: [
				f && !h && /* @__PURE__ */ O("div", {
					className: "absolute inset-0 flex items-center justify-center pointer-events-none",
					children: /* @__PURE__ */ O("div", {
						className: "text-zinc-500 text-xs uppercase tracking-wider",
						children: "Loading…"
					})
				}),
				h && /* @__PURE__ */ k("div", {
					className: "flex flex-col items-center gap-3 text-zinc-300 text-sm max-w-md text-center",
					children: [
						/* @__PURE__ */ O("span", {
							className: "text-zinc-500",
							children: "⚠ Preview couldn't load."
						}),
						ne && /* @__PURE__ */ O("span", {
							className: "text-zinc-600 text-xs font-mono break-words",
							children: ne
						}),
						/* @__PURE__ */ O("button", {
							onClick: c,
							className: "text-sky-400 hover:underline text-xs",
							children: "Download instead"
						})
					]
				}),
				!h && l === "video" && /* @__PURE__ */ O("video", {
					src: r,
					controls: !0,
					autoPlay: !0,
					playsInline: !0,
					preload: "metadata",
					onLoadedMetadata: R,
					onEnded: fe,
					onError: pe,
					className: "max-h-full max-w-full bg-black rounded shadow-2xl"
				}),
				!h && l === "audio" && /* @__PURE__ */ k("div", {
					className: "flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl w-full max-w-md",
					children: [
						/* @__PURE__ */ O("div", {
							className: "text-3xl select-none",
							"aria-hidden": "true",
							children: "♪"
						}),
						/* @__PURE__ */ O("div", {
							className: "text-sm text-zinc-200 truncate max-w-full",
							title: e.name,
							children: e.name
						}),
						/* @__PURE__ */ O("audio", {
							src: r,
							controls: !0,
							autoPlay: !0,
							preload: "metadata",
							onEnded: fe,
							onError: pe,
							className: "w-full"
						})
					]
				}),
				!h && l === "image" && /* @__PURE__ */ O("img", {
					src: r,
					alt: e.name ?? "",
					decoding: "async",
					onLoad: R,
					onError: pe,
					className: "max-h-full max-w-full object-contain rounded shadow-2xl"
				}),
				!h && l === "pdf" && /* @__PURE__ */ O("iframe", {
					src: r,
					title: e.name ?? "PDF preview",
					onLoad: R,
					className: "w-full h-full bg-white rounded shadow-2xl border-0"
				}),
				!h && (l === "text" || l === "json" || l === "yaml") && ie !== null && /* @__PURE__ */ O("pre", {
					className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words",
					children: ie
				}),
				!h && l === "markdown" && se !== null && /* @__PURE__ */ O("div", {
					className: "w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none",
					dangerouslySetInnerHTML: { __html: se }
				}),
				!h && l === "csv" && b !== null && /* @__PURE__ */ O("div", {
					className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl",
					children: /* @__PURE__ */ k("table", {
						className: "border-collapse",
						children: [b.length > 0 && /* @__PURE__ */ O("thead", { children: /* @__PURE__ */ O("tr", { children: b[0].map((e, t) => /* @__PURE__ */ O("th", {
							className: "border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800",
							children: e
						}, t)) }) }), /* @__PURE__ */ O("tbody", { children: b.slice(1).map((e, t) => /* @__PURE__ */ O("tr", { children: e.map((e, t) => /* @__PURE__ */ O("td", {
							className: "border border-zinc-800 px-2 py-1 align-top",
							children: e
						}, t)) }, t)) })]
					})
				}),
				(l === null || l === "heic" || l === "mkv") && !h && /* @__PURE__ */ k("div", {
					className: "flex flex-col items-center gap-3 text-zinc-300 text-sm",
					children: [/* @__PURE__ */ k("span", {
						className: "text-zinc-500",
						children: [
							"No native preview for ",
							e.content_type ?? "this file type",
							"."
						]
					}), /* @__PURE__ */ O("button", {
						onClick: c,
						className: "text-sky-400 hover:underline text-xs",
						children: "Download instead"
					})]
				})
			]
		})]
	});
}
//#endregion
export { F as n, I as t };
