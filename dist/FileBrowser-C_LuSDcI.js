import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { i as t, n } from "./utils-B2QVXvLO.js";
import { At as r, Dt as i, It as a, bt as o, wt as s } from "./MultiDashboard-CwQKjnza.js";
import { s as c } from "./AssetOpen-miowZkWQ.js";
import { r as ee, t as l } from "./useWatchAction-BphC_EHJ.js";
import { _ as u, a as d, b as f, c as p, d as m, f as h, g, h as _, i as v, l as te, m as ne, n as y, o as re, p as ie, r as ae, s as b, t as oe, u as se, v as x, y as ce } from "./fileBrowserHelpers-ekbsT_V4.js";
import { useEffect as le, useMemo as S, useRef as C, useState as w } from "react";
import { Fragment as T, jsx as E, jsxs as D } from "react/jsx-runtime";
//#region src/widgets/fileBrowserDecoders.ts
async function O(e) {
	let t = await fetch(e);
	if (!t.ok) throw Error(`fetch failed: ${t.status}`);
	return t.text();
}
function k(e) {
	try {
		return JSON.stringify(JSON.parse(e), null, 2);
	} catch {
		return e;
	}
}
function A(e) {
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
async function j(e) {
	let [{ marked: t }, { default: n }] = await Promise.all([import("./marked.esm-DQt3cMCg.js"), import("./purify.es-Dq7sb9Gk.js")]);
	try {
		let r = await t.parse(e, { async: !0 });
		return n.sanitize(r);
	} catch {
		return `<pre>${M(e)}</pre>`;
	}
}
function M(e) {
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
var ue = /* @__PURE__ */ e({ FileBrowser: () => N });
function N({ data: e, options: t, widgetId: n }) {
	let m = t ?? {}, { ctx: _, setCtx: O, backendUrl: k, backendHeaders: A, toast: j, requestRefresh: M, emitIntent: ue } = r(), { available: N, openAsset: fe, openWith: pe } = c(), me = m.path_ctx ?? "path", he = m.bucket_ctx ?? "org", F = m.bucket_param ?? "org", I = m.page_ctx ?? "page", ge = m.page_size_ctx ?? "page_size", _e = m.view_mode_ctx ?? "view_mode", ve = m.upload_action_id ?? "upload", ye = m.upload_url, L = m.ingest_url, R = _[he] ?? "default", z = _[me] ?? "", B = parseInt(_[I] ?? "1", 10) || 1, be = parseInt(_[ge] ?? "50", 10) || 50, V = _[_e] === "gallery" ? "gallery" : "icons", [xe, Se] = w(!1), [Ce, we] = w(!1), H = C(!1), [U, W] = w(null), [Te, G] = w(!1), [K, Ee] = w("url"), [De, Oe] = w(""), [ke, Ae] = w(""), [je, Me] = w(""), [q, Ne] = w(!1), Pe = m.search_url, [Fe, Ie] = w(""), [J, Le] = w(null), [Re, ze] = w(!1), Y = C(null);
	le(() => () => Y.current?.abort(), []);
	let Be = S(() => h(e), [e]), Ve = J ?? Be, X = S(() => J || ce(Be), [J, Be]), He = S(() => f(z), [z]), Ue = !J && B > 1, We = !J && Be.length >= be, Ge = m.media_url_template ?? "/media?namespace={namespace}&path={path}", Ke = N && m.open_with !== !1;
	le(() => {
		B !== 1 && O(I, "1");
	}, [R, z]);
	let Z = (e) => O(me, e), qe = (e) => O(I, String(Math.max(1, e))), Je = () => O(_e, V === "gallery" ? "icons" : "gallery"), Ye = async () => {
		if (!Pe) return;
		let e = Fe.trim();
		if (e === "") {
			Q();
			return;
		}
		if (Y.current) return;
		let t = new AbortController();
		Y.current = t, ze(!0);
		try {
			let n = x(k, Pe), r = await fetch(n, {
				method: "POST",
				headers: {
					...y(k, n, A),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[F]: R,
					query: e
				}),
				signal: t.signal
			});
			if (!r.ok) {
				j(`Search failed: ${await u(r)}`, "error");
				return;
			}
			let i = await r.json();
			if (Y.current !== t) return;
			Le((i.hits ?? []).map((e) => ({
				...e,
				kind: "file"
			})));
		} catch (e) {
			t.signal.aborted || j(`Search failed: ${v(e)}`, "error");
		} finally {
			Y.current === t && (Y.current = null, ze(!1));
		}
	}, Q = () => {
		Y.current?.abort(), Y.current = null, ze(!1), Ie(""), Le(null);
	}, Xe = (e) => {
		Q(), Z(e);
	}, Ze = () => {
		Oe(z), Ae(""), Me(""), Ee(L ? "url" : "file"), G(!0);
	}, Qe = async () => {
		if (!L) return;
		let e = De.trim(), t = ke.trim(), n = je.trim();
		if (!e || !t || !n) {
			j("Need a folder (repo), a filename, and a URL", "error");
			return;
		}
		if (H.current) {
			j("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0, Ne(!0);
		try {
			let r = x(k, L), i = await fetch(r, {
				method: "POST",
				headers: {
					...y(k, r, A),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[F]: R,
					repo: e,
					path: t,
					url: n
				})
			});
			if (!i.ok) throw Error(await u(i));
			j(`Fetching ${t} in the background — it'll appear when done.`, "ok"), G(!1);
		} catch (e) {
			j(`Ingest failed: ${v(e)}`, "error");
		} finally {
			H.current = !1, Ne(!1);
		}
	}, $e = async (e) => {
		let t = De.trim(), r = ke.trim() || e.name;
		if (!t) {
			j("Need a destination folder (repo)", "error");
			return;
		}
		if (H.current) {
			j("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0, Ne(!0);
		try {
			await st(e, t, r), j(`Uploaded ${r}`, "ok"), G(!1), M(n ?? "*");
		} catch (e) {
			j(`Upload failed: ${v(e)}`, "error");
		} finally {
			H.current = !1, Ne(!1);
		}
	}, $ = (e) => e.path && e.path !== "" ? e.path : te(z, e.name ?? ""), et = (e) => Ge && e.name ? x(k, ae(Ge, R, $(e))) : "", tt = (e) => {
		let t = g(e.content_type, e.name, e.kind), r = m.open_intent ?? (t === "video" || t === "audio" || t === "mkv" ? "play" : "view");
		return {
			asset: {
				id: e.id ?? e.object_id,
				namespace: R,
				path: $(e),
				name: e.name ?? ($(e) || "Untitled file"),
				kind: e.kind,
				contentType: e.content_type,
				sizeBytes: e.size_bytes,
				modifiedAt: e.modified_at,
				capabilities: e.capabilities,
				symlinkTargetId: e.symlink_target_id,
				url: et(e) || void 0,
				metadata: { ...e.metadata }
			},
			intent: r,
			source: {
				component: "file_browser",
				widgetId: n
			}
		};
	}, nt = (e) => {
		let t = g(e.content_type, e.name, e.kind), n = !!Ge && p(t);
		return {
			native: n ? () => W(e) : void 0,
			nativeLabel: n ? "Native preview" : void 0,
			download: m.download_url ? () => ot(e) : void 0
		};
	}, rt = (e) => {
		pe(tt(e), nt(e));
	}, it = (e) => {
		let t = e.id ?? e.object_id;
		t && ue?.({
			type: "object.select",
			objectId: t
		});
	}, at = (e) => {
		let t = e.id ?? e.object_id;
		if (t && ue?.({
			type: "object.open",
			objectId: t,
			mode: b(e) ? "browse" : m.open_intent ?? "preview"
		}), b(e)) {
			J ? Xe($(e)) : Z($(e));
			return;
		}
		if (N && m.open_with !== !1) {
			fe(tt(e), nt(e));
			return;
		}
		if (Ge && p(g(e.content_type, e.name, e.kind))) {
			W(e);
			return;
		}
		ot(e);
	};
	async function ot(e) {
		let t = m.download_url;
		if (!t) {
			j("Download not configured (set options.download_url)", "error");
			return;
		}
		if (!e.name) {
			j("File has no name", "error");
			return;
		}
		let n = $(e), r = x(k, t);
		try {
			let t = await fetch(r, {
				method: "POST",
				headers: {
					...y(k, r, A),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[F]: R,
					path: n
				})
			});
			if (!t.ok) {
				let e = await u(t);
				j(`Download failed: ${e}`, "error");
				return;
			}
			let i = await ie(t, e.content_type), a = document.createElement("a");
			a.href = URL.createObjectURL(i), a.download = e.name, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
		} catch (e) {
			j(`Download failed: ${v(e)}`, "error");
		}
	}
	let st = async (e, t, n) => {
		let r = e.type || "application/octet-stream";
		if (ye) {
			let i = new URLSearchParams({
				[F]: R,
				repo: t,
				path: n,
				content_type: r
			}), a = x(k, ye), o = a.includes("?") ? "&" : "?", s = await fetch(`${a}${o}${i.toString()}`, {
				method: "POST",
				headers: y(k, a, A),
				body: e
			});
			if (!s.ok) throw Error(await s.text() || `HTTP ${s.status}`);
			return;
		}
		let a = await e.arrayBuffer(), c = s(k ?? ""), d = o({
			actionId: ve,
			params: {
				[F]: R,
				repo: t,
				path: n,
				content_type: r,
				data_b64: oe(a)
			},
			clientRequestId: i()
		}), f = await fetch(c, {
			method: "POST",
			headers: {
				...A,
				"Content-Type": "application/json",
				"Connect-Protocol-Version": "1"
			},
			body: JSON.stringify(d)
		});
		if (!f.ok) throw Error(await u(f));
		let p = await f.json();
		if (!ee(p.status)) throw Error(p.message ?? "Upload action did not return a terminal status");
		if (l(p.status)) throw Error(p.message ?? "Upload action failed");
	}, ct = async (e) => {
		if (z === "") {
			j("Open a folder first, or use the Upload button to choose a folder.", "error");
			return;
		}
		if (H.current) {
			j("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0;
		let t = z;
		we(!0);
		let r = 0;
		try {
			for (let n of Array.from(e)) try {
				await st(n, t, n.name), r++;
			} catch (e) {
				j(`Upload failed: ${n.name} — ${v(e)}`, "error");
			}
		} finally {
			H.current = !1, we(!1);
		}
		r > 0 && (j(`Uploaded ${r} file${r === 1 ? "" : "s"}`, "ok"), M(n ?? "*"));
	};
	return /* @__PURE__ */ D("div", {
		className: "h-full flex flex-col relative",
		onDragOver: (e) => {
			e.preventDefault(), Se(!0);
		},
		onDragLeave: () => Se(!1),
		onDrop: (e) => {
			e.preventDefault(), Se(!1), e.dataTransfer.files.length > 0 && ct(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ D("div", {
				className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0",
				children: [
					/* @__PURE__ */ E("button", {
						onClick: () => Z(""),
						className: "text-sky-400 hover:underline",
						children: "/"
					}),
					He.map((e, t) => {
						let n = He.slice(0, t + 1).join("/");
						return /* @__PURE__ */ D("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ E("span", {
								className: "text-zinc-600",
								children: "/"
							}), /* @__PURE__ */ E("button", {
								onClick: () => Z(n),
								className: "text-sky-400 hover:underline",
								children: e
							})]
						}, t);
					}),
					/* @__PURE__ */ D("div", {
						className: "ml-auto flex items-center gap-3 text-zinc-500",
						children: [
							Pe && /* @__PURE__ */ D("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ E("input", {
										type: "search",
										value: Fe,
										onChange: (e) => Ie(e.target.value),
										onKeyDown: (e) => {
											e.key === "Enter" && Ye(), e.key === "Escape" && Q();
										},
										placeholder: "Search files…",
										className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
									}),
									/* @__PURE__ */ E("button", {
										onClick: () => void Ye(),
										disabled: Re,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
										"aria-label": "Search",
										title: "Search this namespace",
										children: Re ? "…" : "🔍"
									}),
									J && /* @__PURE__ */ E("button", {
										onClick: Q,
										className: "text-zinc-400 hover:text-zinc-100 px-1",
										title: "Clear search, back to browsing",
										children: "✕"
									})
								]
							}),
							(ye || ve || L) && /* @__PURE__ */ E("button", {
								onClick: Ze,
								className: "text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5",
								title: "Upload a file or fetch a media URL",
								children: "⬆ Upload"
							}),
							/* @__PURE__ */ E("button", {
								onClick: Je,
								className: "text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5",
								title: V === "gallery" ? "Switch to icons (no thumbnails)" : "Switch to gallery (loads image thumbnails)",
								children: V === "gallery" ? "◫ Gallery" : "☰ Icons"
							}),
							/* @__PURE__ */ E("span", {
								className: "tabular-nums",
								children: J ? `${J.length} result${J.length === 1 ? "" : "s"}` : `${Ve.length} on page`
							}),
							(Ue || We) && /* @__PURE__ */ D("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ E("button", {
										onClick: () => qe(B - 1),
										disabled: !Ue,
										className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
										"aria-label": "Previous page",
										children: "‹"
									}),
									/* @__PURE__ */ D("span", {
										className: "tabular-nums text-zinc-400",
										children: ["Page ", B]
									}),
									/* @__PURE__ */ E("button", {
										onClick: () => qe(B + 1),
										disabled: !We,
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
			/* @__PURE__ */ D("div", {
				className: "flex-1 overflow-auto relative min-h-0",
				children: [
					xe && /* @__PURE__ */ E("div", {
						className: "absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none",
						children: /* @__PURE__ */ E("div", {
							className: "text-sky-300 text-sm",
							children: "Drop files to upload"
						})
					}),
					X.length === 0 ? /* @__PURE__ */ E(a, { children: J ? "No files match your search." : "This folder is empty. Drop files to upload." }) : V === "gallery" ? /* @__PURE__ */ E(de, {
						entries: X,
						onClick: at,
						onSelect: it,
						onOpenWith: Ke ? rt : void 0,
						mediaUrlFor: et,
						entryKey: (e) => d(e, z)
					}) : /* @__PURE__ */ D("table", {
						className: "w-full text-xs",
						children: [/* @__PURE__ */ E("thead", {
							className: "sticky top-0 bg-zinc-900 z-[1]",
							children: /* @__PURE__ */ D("tr", {
								className: "text-zinc-400 border-b border-zinc-800",
								children: [
									/* @__PURE__ */ E("th", {
										className: "text-left px-3 py-2 w-8",
										children: /* @__PURE__ */ E("span", {
											className: "sr-only",
											children: "Entry kind"
										})
									}),
									/* @__PURE__ */ E("th", {
										className: "text-left px-3 py-2",
										children: "Name"
									}),
									/* @__PURE__ */ E("th", {
										className: "text-right px-3 py-2 w-24",
										children: "Size"
									}),
									/* @__PURE__ */ E("th", {
										className: "text-left px-3 py-2 w-40",
										children: "Type"
									}),
									/* @__PURE__ */ E("th", {
										className: "text-left px-3 py-2 w-36",
										children: "Modified"
									}),
									Ke && /* @__PURE__ */ E("th", {
										className: "w-10",
										children: /* @__PURE__ */ E("span", {
											className: "sr-only",
											children: "Actions"
										})
									})
								]
							})
						}), /* @__PURE__ */ E("tbody", { children: X.map((e, t) => /* @__PURE__ */ D("tr", {
							tabIndex: 0,
							onClick: () => it(e),
							onDoubleClick: () => at(e),
							onKeyDown: (t) => {
								t.key === "Enter" ? (t.preventDefault(), at(e)) : t.key === " " && (t.preventDefault(), it(e));
							},
							className: "group border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none",
							children: [
								/* @__PURE__ */ E("td", {
									className: "px-3 py-1.5 select-none",
									children: b(e) ? "📁" : "📄"
								}),
								/* @__PURE__ */ E("td", {
									className: "px-3 py-1.5 text-zinc-100 truncate",
									children: e.name
								}),
								/* @__PURE__ */ E("td", {
									className: "px-3 py-1.5 text-right text-zinc-400",
									children: b(e) ? "—" : re(e.size_bytes ?? 0)
								}),
								/* @__PURE__ */ E("td", {
									className: "px-3 py-1.5 text-zinc-500 truncate",
									children: e.content_type ?? ""
								}),
								/* @__PURE__ */ E("td", {
									className: "px-3 py-1.5 text-zinc-500 truncate",
									children: e.modified_at ?? ""
								}),
								Ke && /* @__PURE__ */ E("td", {
									className: "pr-2 text-right",
									children: !b(e) && /* @__PURE__ */ E("button", {
										type: "button",
										onClick: (t) => {
											t.stopPropagation(), rt(e);
										},
										onDoubleClick: (e) => e.stopPropagation(),
										className: "size-7 rounded text-zinc-600 hover:text-zinc-100 hover:bg-zinc-700/70 opacity-60 group-hover:opacity-100 focus:opacity-100",
										"aria-label": `Open ${e.name ?? "file"} with another application`,
										title: "Open with…",
										children: "···"
									})
								})
							]
						}, d(e, z) || String(t))) })]
					}),
					Ce && /* @__PURE__ */ E("div", {
						className: "absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg",
						children: "Uploading…"
					})
				]
			}),
			U && /* @__PURE__ */ E(P, {
				entry: U,
				mediaUrl: et(U),
				autoAdvanceQueue: ne(X),
				navigableQueue: se(X),
				onSelect: (e) => W(e),
				onClose: () => W(null),
				onDownload: () => {
					ot(U);
				},
				onOpenWith: Ke ? () => rt(U) : void 0
			}),
			Te && /* @__PURE__ */ E("div", {
				className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60",
				onClick: () => {
					q || G(!1);
				},
				children: /* @__PURE__ */ D("div", {
					className: "flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ D("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ D("h2", {
								className: "text-sm font-medium text-zinc-100",
								children: ["Upload to ", R]
							}), /* @__PURE__ */ E("button", {
								onClick: () => {
									q || G(!1);
								},
								className: "text-zinc-500 hover:text-zinc-200",
								"aria-label": "Close",
								children: "✕"
							})]
						}),
						L && /* @__PURE__ */ D("div", {
							className: "flex gap-1 text-xs",
							children: [/* @__PURE__ */ E("button", {
								onClick: () => Ee("url"),
								className: `px-3 py-1 rounded border ${K === "url" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
								children: "From URL"
							}), /* @__PURE__ */ E("button", {
								onClick: () => Ee("file"),
								className: `px-3 py-1 rounded border ${K === "file" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
								children: "Local file"
							})]
						}),
						/* @__PURE__ */ D("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Folder (repo)",
								/* @__PURE__ */ E("input", {
									type: "text",
									value: De,
									onChange: (e) => Oe(e.target.value),
									placeholder: "e.g. year=2026/name=avatar",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ E("span", {
									className: "text-zinc-600",
									children: "The repository partition. Becomes a source key."
								})
							]
						}),
						/* @__PURE__ */ D("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Filename ",
								K === "file" && "(optional — defaults to the file’s name)",
								/* @__PURE__ */ E("input", {
									type: "text",
									value: ke,
									onChange: (e) => Ae(e.target.value),
									placeholder: "e.g. avatar.mp4",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ E("span", {
									className: "text-zinc-600",
									children: "Location inside the repo (may include subfolders)."
								})
							]
						}),
						K === "url" ? /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ D("label", {
							className: "flex flex-col gap-1 text-xs text-zinc-400",
							children: [
								"Media URL",
								/* @__PURE__ */ E("input", {
									type: "url",
									value: je,
									onChange: (e) => Me(e.target.value),
									placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8",
									className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
								}),
								/* @__PURE__ */ E("span", {
									className: "text-zinc-600",
									children: "HTTP(S) media URL or raw HLS playlist. Fetched server-side."
								})
							]
						}), /* @__PURE__ */ E("button", {
							onClick: () => void Qe(),
							disabled: q,
							className: "self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm",
							children: q ? "Starting…" : "Fetch & store"
						})] }) : /* @__PURE__ */ D(T, { children: [/* @__PURE__ */ E("input", {
							type: "file",
							onChange: (e) => {
								let t = e.target.files?.[0];
								t && $e(t);
							},
							disabled: q,
							className: "text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
						}), q && /* @__PURE__ */ E("span", {
							className: "self-end text-xs text-zinc-400",
							children: "Uploading…"
						})] })
					]
				})
			})
		]
	});
}
function de({ entries: e, onClick: t, onSelect: n, onOpenWith: r, mediaUrlFor: i, entryKey: a }) {
	return /* @__PURE__ */ E("div", {
		className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3",
		children: e.map((e, o) => {
			let s = g(e.content_type, e.name, e.kind) === "image", c = b(e);
			return /* @__PURE__ */ D("div", {
				className: "group relative min-w-0",
				children: [/* @__PURE__ */ D("button", {
					type: "button",
					onClick: () => n?.(e),
					onDoubleClick: () => t(e),
					onKeyDown: (n) => {
						n.key === "Enter" && (n.preventDefault(), t(e));
					},
					className: "w-full flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left select-none",
					children: [/* @__PURE__ */ E("div", {
						className: "w-full aspect-square bg-zinc-950 rounded flex items-center justify-center overflow-hidden",
						children: c ? /* @__PURE__ */ E("span", {
							className: "text-4xl select-none",
							children: "📁"
						}) : s && e.name ? /* @__PURE__ */ E("img", {
							src: i(e),
							alt: e.name ?? "",
							loading: "lazy",
							decoding: "async",
							className: "w-full h-full object-cover"
						}) : /* @__PURE__ */ E("span", {
							className: "text-4xl select-none",
							children: "📄"
						})
					}), /* @__PURE__ */ E("span", {
						className: "w-full text-xs text-zinc-200 truncate",
						title: e.name,
						children: e.name
					})]
				}), r && !c && /* @__PURE__ */ E("button", {
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
function P({ entry: e, mediaUrl: r, autoAdvanceQueue: i, navigableQueue: a, onSelect: o, onClose: s, onDownload: c, onOpenWith: ee }) {
	let l = g(e.content_type, e.name, e.kind), u = l === "text" || l === "json" || l === "yaml" || l === "csv" || l === "markdown", [f, p] = w(l === "image" || l === "video" || l === "pdf" || u), [h, te] = w(!1), [ne, y] = w(null), [ie, ae] = w(null), [b, oe] = w(null), [se, x] = w(null), ce = a.length > 1, S = d(e), T = a.findIndex((e) => d(e) === S), [M, ue] = w(!1), [N, de] = w(!0), P = C(null), fe = C(null);
	t(!0, P, fe);
	let pe = () => {
		let e = m(a, S, M, N);
		e && o(e);
	}, me = () => {
		let e = _(a, S, N);
		e && o(e);
	}, he = () => {
		let e = m(i, S, M, N);
		e && o(e);
	}, F = () => p(!1), I = () => {
		p(!1), te(!0), y(null);
	}, ge = (e) => {
		e.target === e.currentTarget && s();
	};
	return le(() => {
		if (!u) return;
		let e = !1;
		return (async () => {
			try {
				let t = await O(r);
				if (e) return;
				l === "csv" ? oe(A(t)) : l === "json" ? ae(k(t)) : l === "markdown" ? x(await j(t)) : ae(t), p(!1);
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
	]), /* @__PURE__ */ D("div", {
		ref: P,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Preview ${e.name ?? "file"}`,
		tabIndex: -1,
		className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
		onClick: ge,
		onKeyDown: (e) => {
			if (n(e, P, !0, s), e.defaultPrevented) return;
			let t = e.target;
			if (!(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
				if (e.key === "ArrowRight") e.preventDefault(), pe();
				else if (e.key === "ArrowLeft") e.preventDefault(), me();
				else if (e.key === " ") {
					let t = P.current?.querySelector("video, audio");
					t && (e.preventDefault(), t.paused ? t.play() : t.pause());
				}
			}
		},
		children: [/* @__PURE__ */ D("div", {
			className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900",
			children: [
				/* @__PURE__ */ E("span", {
					className: "text-sm font-medium truncate flex-1",
					children: e.name
				}),
				/* @__PURE__ */ E("span", {
					className: "text-xs text-zinc-500 truncate max-w-[200px]",
					children: e.content_type
				}),
				typeof e.size_bytes == "number" && /* @__PURE__ */ E("span", {
					className: "text-xs text-zinc-600 tabular-nums",
					children: re(e.size_bytes)
				}),
				ce && /* @__PURE__ */ D("div", {
					className: "flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2",
					children: [
						/* @__PURE__ */ E("button", {
							onClick: me,
							className: "hover:text-zinc-100 leading-none px-1",
							"aria-label": "Previous (←)",
							title: "Previous (←)",
							children: "⏮"
						}),
						/* @__PURE__ */ E("button", {
							onClick: pe,
							className: "hover:text-zinc-100 leading-none px-1",
							"aria-label": "Next (→)",
							title: "Next (→)",
							children: "⏭"
						}),
						/* @__PURE__ */ E("button", {
							onClick: () => ue((e) => !e),
							className: `px-1 leading-none ${M ? "text-sky-400" : "hover:text-zinc-100"}`,
							"aria-label": "Toggle shuffle",
							title: M ? "Shuffle on" : "Shuffle off",
							children: "🔀"
						}),
						/* @__PURE__ */ E("button", {
							onClick: () => de((e) => !e),
							className: `px-1 leading-none ${N ? "text-sky-400" : "hover:text-zinc-100"}`,
							"aria-label": "Toggle repeat",
							title: N ? "Repeat on" : "Repeat off",
							children: "🔁"
						}),
						/* @__PURE__ */ D("span", {
							className: "text-xs text-zinc-500 tabular-nums",
							children: [
								T >= 0 ? T + 1 : "–",
								" / ",
								a.length
							]
						})
					]
				}),
				ee && /* @__PURE__ */ E("button", {
					type: "button",
					onClick: ee,
					className: "text-xs text-zinc-400 hover:text-zinc-100",
					children: "Open with…"
				}),
				/* @__PURE__ */ E("button", {
					onClick: c,
					className: "text-xs text-sky-400 hover:underline",
					children: "Download"
				}),
				/* @__PURE__ */ E("button", {
					ref: fe,
					onClick: s,
					className: "text-zinc-400 hover:text-zinc-100 text-lg leading-none",
					"aria-label": "Close preview",
					children: "×"
				})
			]
		}), /* @__PURE__ */ D("div", {
			className: "flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative",
			onClick: ge,
			children: [
				f && !h && /* @__PURE__ */ E("div", {
					className: "absolute inset-0 flex items-center justify-center pointer-events-none",
					children: /* @__PURE__ */ E("div", {
						className: "text-zinc-500 text-xs uppercase tracking-wider",
						children: "Loading…"
					})
				}),
				h && /* @__PURE__ */ D("div", {
					className: "flex flex-col items-center gap-3 text-zinc-300 text-sm max-w-md text-center",
					children: [
						/* @__PURE__ */ E("span", {
							className: "text-zinc-500",
							children: "⚠ Preview couldn't load."
						}),
						ne && /* @__PURE__ */ E("span", {
							className: "text-zinc-600 text-xs font-mono break-words",
							children: ne
						}),
						/* @__PURE__ */ E("button", {
							onClick: c,
							className: "text-sky-400 hover:underline text-xs",
							children: "Download instead"
						})
					]
				}),
				!h && l === "video" && /* @__PURE__ */ E("video", {
					src: r,
					controls: !0,
					autoPlay: !0,
					playsInline: !0,
					preload: "metadata",
					onLoadedMetadata: F,
					onEnded: he,
					onError: I,
					className: "max-h-full max-w-full bg-black rounded shadow-2xl"
				}),
				!h && l === "audio" && /* @__PURE__ */ D("div", {
					className: "flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl w-full max-w-md",
					children: [
						/* @__PURE__ */ E("div", {
							className: "text-3xl select-none",
							"aria-hidden": "true",
							children: "♪"
						}),
						/* @__PURE__ */ E("div", {
							className: "text-sm text-zinc-200 truncate max-w-full",
							title: e.name,
							children: e.name
						}),
						/* @__PURE__ */ E("audio", {
							src: r,
							controls: !0,
							autoPlay: !0,
							preload: "metadata",
							onEnded: he,
							onError: I,
							className: "w-full"
						})
					]
				}),
				!h && l === "image" && /* @__PURE__ */ E("img", {
					src: r,
					alt: e.name ?? "",
					decoding: "async",
					onLoad: F,
					onError: I,
					className: "max-h-full max-w-full object-contain rounded shadow-2xl"
				}),
				!h && l === "pdf" && /* @__PURE__ */ E("iframe", {
					src: r,
					title: e.name ?? "PDF preview",
					onLoad: F,
					className: "w-full h-full bg-white rounded shadow-2xl border-0"
				}),
				!h && (l === "text" || l === "json" || l === "yaml") && ie !== null && /* @__PURE__ */ E("pre", {
					className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words",
					children: ie
				}),
				!h && l === "markdown" && se !== null && /* @__PURE__ */ E("div", {
					className: "w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none",
					dangerouslySetInnerHTML: { __html: se }
				}),
				!h && l === "csv" && b !== null && /* @__PURE__ */ E("div", {
					className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl",
					children: /* @__PURE__ */ D("table", {
						className: "border-collapse",
						children: [b.length > 0 && /* @__PURE__ */ E("thead", { children: /* @__PURE__ */ E("tr", { children: b[0].map((e, t) => /* @__PURE__ */ E("th", {
							className: "border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800",
							children: e
						}, t)) }) }), /* @__PURE__ */ E("tbody", { children: b.slice(1).map((e, t) => /* @__PURE__ */ E("tr", { children: e.map((e, t) => /* @__PURE__ */ E("td", {
							className: "border border-zinc-800 px-2 py-1 align-top",
							children: e
						}, t)) }, t)) })]
					})
				}),
				(l === null || l === "heic" || l === "mkv") && !h && /* @__PURE__ */ D("div", {
					className: "flex flex-col items-center gap-3 text-zinc-300 text-sm",
					children: [/* @__PURE__ */ D("span", {
						className: "text-zinc-500",
						children: [
							"No native preview for ",
							e.content_type ?? "this file type",
							"."
						]
					}), /* @__PURE__ */ E("button", {
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
export { ue as n, N as t };
