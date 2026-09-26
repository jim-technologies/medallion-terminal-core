import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { _ as t, d as n, g as r, h as i, p as a, w as o } from "./States-ggbm0c4k.js";
import { i as s, n as c, t as l } from "./utils-j4lJ7S1v.js";
import { i as u } from "./types-Dt7zb-eN.js";
import { f as d, p as f, t as ee } from "./DataGrid-BuzhglbG.js";
import { T as te } from "./sourceError-BK-F_Rp5.js";
import { t as p } from "./Pagination-Ba4KG2jM.js";
import { d as ne, l as m, t as h } from "./FilePreview--JYWYX_D.js";
import { Ct as re, Et as g, Ft as ie, kt as ae, yt as _ } from "./MultiDashboard-DBxt1Ta0.js";
import { s as oe } from "./AssetOpen-CjGLA-3L.js";
import { r as v, t as se } from "./useWatchAction-Cc7EPUcg.js";
import { _ as y, a as ce, b as le, c as ue, d as de, f as fe, g as b, h as pe, i as x, l as me, m as he, n as S, o as ge, p as _e, r as ve, s as C, t as ye, u as be, v as w, x as T, y as xe } from "./fileBrowserHelpers-CaZlNM8g.js";
import { useEffect as Se, useMemo as Ce, useRef as E, useState as D } from "react";
import { jsx as O, jsxs as k } from "react/jsx-runtime";
//#region src/widgets/FileBrowser.tsx
var we = /* @__PURE__ */ e({ FileBrowser: () => A });
function A({ data: e, options: s, widgetId: c, entryIcon: l, entryHref: h, selection: de = "single", selectedIds: pe, onSelectionChange: ge, contextActions: we, onOpen: A }) {
	let { locale: De, timeZone: Oe } = o(), j = s ?? {}, { ctx: M, setCtx: ke, backendUrl: N, backendHeaders: P, fetch: F, toast: I, requestRefresh: Ae, emitIntent: je } = ae(), { available: Me, openAsset: Ne, openWith: Pe } = oe(), Fe = j.path_ctx ?? "path", Ie = j.bucket_ctx ?? "org", L = j.bucket_param ?? "org", Le = j.page_ctx ?? "page", Re = j.page_size_ctx ?? "page_size", ze = j.view_mode_ctx ?? "view_mode", Be = j.upload_action_id ?? "upload", Ve = j.upload_url, R = j.ingest_url, z = M[Ie] ?? "default", B = M[Fe] ?? "", He = parseInt(M[Le] ?? "1", 10) || 1, Ue = parseInt(M[Re] ?? "50", 10) || 50, V = M[ze] === "gallery" ? "gallery" : "icons", [We, Ge] = D(!1), [Ke, qe] = D(!1), H = E(!1), [U, W] = D(null), [Je, Ye] = D([]), [Xe, G] = D(!1), [K, Ze] = D("url"), [Qe, $e] = D(""), [et, tt] = D(""), [nt, rt] = D(""), [q, it] = D(!1), at = j.search_url, [ot, st] = D(""), [J, ct] = D(null), [lt, ut] = D(!1), Y = E(null);
	Se(() => () => Y.current?.abort(), []);
	let dt = Ce(() => fe(e), [e]), ft = J ?? dt, X = Ce(() => J || xe(dt), [J, dt]), pt = Ce(() => le(B), [B]), mt = !J && He > 1, ht = !J && dt.length >= Ue, gt = j.media_url_template ?? "/media?namespace={namespace}&path={path}", _t = Me && j.open_with !== !1;
	Se(() => {
		He !== 1 && ke(Le, "1");
	}, [z, B]);
	let Z = (e) => ke(Fe, e), vt = (e) => ke(Le, String(Math.max(1, e))), yt = () => ke(ze, V === "gallery" ? "icons" : "gallery"), bt = async () => {
		if (!at) return;
		let e = ot.trim();
		if (e === "") {
			xt();
			return;
		}
		if (Y.current) return;
		let t = new AbortController();
		Y.current = t, ut(!0);
		try {
			let n = w(N, at), r = await T(N, n, F)(n, {
				method: "POST",
				headers: {
					...S(N, n, P),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[L]: z,
					query: e
				}),
				signal: t.signal
			});
			if (!r.ok) {
				I(`Search failed: ${await y(r)}`, "error");
				return;
			}
			let i = await r.json();
			if (Y.current !== t) return;
			ct((i.hits ?? []).map((e) => ({
				...e,
				kind: "file"
			})));
		} catch (e) {
			t.signal.aborted || I(`Search failed: ${x(e)}`, "error");
		} finally {
			Y.current === t && (Y.current = null, ut(!1));
		}
	}, xt = () => {
		Y.current?.abort(), Y.current = null, ut(!1), st(""), ct(null);
	}, St = (e) => {
		xt(), Z(e);
	}, Ct = () => {
		$e(B), tt(""), rt(""), Ze(R ? "url" : "file"), G(!0);
	}, wt = async () => {
		if (!R) return;
		let e = Qe.trim(), t = et.trim(), n = nt.trim();
		if (!e || !t || !n) {
			I("Need a folder (repo), a filename, and a URL", "error");
			return;
		}
		if (H.current) {
			I("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0, it(!0);
		try {
			let r = w(N, R), i = await T(N, r, F)(r, {
				method: "POST",
				headers: {
					...S(N, r, P),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[L]: z,
					repo: e,
					path: t,
					url: n
				})
			});
			if (!i.ok) throw Error(await y(i));
			I(`Fetching ${t} in the background — it'll appear when done.`, "ok"), G(!1);
		} catch (e) {
			I(`Ingest failed: ${x(e)}`, "error");
		} finally {
			H.current = !1, it(!1);
		}
	}, Tt = async (e) => {
		let t = Qe.trim(), n = et.trim() || e.name;
		if (!t) {
			I("Need a destination folder (repo)", "error");
			return;
		}
		if (H.current) {
			I("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0, it(!0);
		try {
			await Mt(e, t, n), I(`Uploaded ${n}`, "ok"), G(!1), Ae(c ?? "*");
		} catch (e) {
			I(`Upload failed: ${x(e)}`, "error");
		} finally {
			H.current = !1, it(!1);
		}
	}, Q = (e) => e.path && e.path !== "" ? e.path : me(B, e.name ?? ""), $ = (e) => gt && e.name ? w(N, ve(gt, z, Q(e))) : "", Et = (e) => {
		let t = b(e.content_type, e.name, e.kind), n = j.open_intent ?? (t === "video" || t === "audio" || t === "mkv" ? "play" : "view");
		return {
			asset: {
				id: e.id ?? e.object_id,
				namespace: z,
				path: Q(e),
				name: e.name ?? (Q(e) || "Untitled file"),
				kind: e.kind,
				contentType: e.content_type,
				sizeBytes: e.size_bytes,
				modifiedAt: e.modified_at,
				capabilities: e.capabilities,
				symlinkTargetId: e.symlink_target_id,
				url: $(e) || void 0,
				metadata: { ...e.metadata }
			},
			intent: n,
			source: {
				component: "file_browser",
				widgetId: c
			}
		};
	}, Dt = (e) => {
		let t = b(e.content_type, e.name, e.kind), n = !!gt && ue(t);
		return {
			native: n ? () => W(e) : void 0,
			nativeLabel: n ? "Native preview" : void 0,
			download: j.download_url ? () => jt(e) : void 0
		};
	}, Ot = (e) => {
		Pe(Et(e), Dt(e));
	}, kt = (e) => {
		let t = e.id ?? e.object_id;
		t && je?.({
			type: "object.select",
			objectId: t
		});
	}, At = (e) => {
		if (A?.(e, Q(e)) === !0) return;
		let t = e.id ?? e.object_id;
		if (t && je?.({
			type: "object.open",
			objectId: t,
			mode: C(e) ? "browse" : j.open_intent ?? "preview"
		}), C(e)) {
			J ? St(Q(e)) : Z(Q(e));
			return;
		}
		if (Me && j.open_with !== !1) {
			Ne(Et(e), Dt(e));
			return;
		}
		if (gt && ue(b(e.content_type, e.name, e.kind))) {
			W(e);
			return;
		}
		jt(e);
	};
	async function jt(e) {
		let t = j.download_url;
		if (!t) {
			I("Download not configured (set options.download_url)", "error");
			return;
		}
		if (!e.name) {
			I("File has no name", "error");
			return;
		}
		let n = Q(e), r = w(N, t);
		try {
			let t = await T(N, r, F)(r, {
				method: "POST",
				headers: {
					...S(N, r, P),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[L]: z,
					path: n
				})
			});
			if (!t.ok) {
				let e = await y(t);
				I(`Download failed: ${e}`, "error");
				return;
			}
			let i = await _e(t, e.content_type), a = document.createElement("a");
			a.href = URL.createObjectURL(i), a.download = e.name, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
		} catch (e) {
			I(`Download failed: ${x(e)}`, "error");
		}
	}
	let Mt = async (e, t, n) => {
		let r = e.type || "application/octet-stream";
		if (Ve) {
			let i = new URLSearchParams({
				[L]: z,
				repo: t,
				path: n,
				content_type: r
			}), a = w(N, Ve), o = a.includes("?") ? "&" : "?", s = await T(N, a, F)(`${a}${o}${i.toString()}`, {
				method: "POST",
				headers: S(N, a, P),
				body: e
			});
			if (!s.ok) throw Error(await s.text() || `HTTP ${s.status}`);
			return;
		}
		let i = await e.arrayBuffer(), a = re(N ?? ""), o = _({
			actionId: Be,
			params: {
				[L]: z,
				repo: t,
				path: n,
				content_type: r,
				data_b64: ye(i)
			},
			clientRequestId: g()
		}), s = await (F ?? globalThis.fetch)(a, {
			method: "POST",
			headers: {
				...P,
				"Content-Type": "application/json",
				"Connect-Protocol-Version": "1"
			},
			body: JSON.stringify(o)
		});
		if (!s.ok) throw Error(await y(s));
		let c = await s.json();
		if (!v(c.status)) throw Error(c.message ?? "Upload action did not return a terminal status");
		if (se(c.status)) throw Error(c.message ?? "Upload action failed");
	}, Nt = async (e) => {
		if (B === "") {
			I("Open a folder first, or use the Upload button to choose a folder.", "error");
			return;
		}
		if (H.current) {
			I("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0;
		let t = B;
		qe(!0);
		let n = 0;
		try {
			for (let r of Array.from(e)) try {
				await Mt(r, t, r.name), n++;
			} catch (e) {
				I(`Upload failed: ${r.name} — ${x(e)}`, "error");
			}
		} finally {
			H.current = !1, qe(!1);
		}
		n > 0 && (I(`Uploaded ${n} file${n === 1 ? "" : "s"}`, "ok"), Ae(c ?? "*"));
	}, Pt = (e) => ce(e, B) || Q(e), Ft = [
		{
			id: "name",
			header: "Name",
			width: 280,
			grow: !0,
			sortValue: (e) => `${+!C(e)}${(e.name ?? "").toLowerCase()}`,
			cell: (e) => /* @__PURE__ */ k("span", {
				className: "mtc-file-name",
				children: [/* @__PURE__ */ O("span", {
					className: "mtc-file-icon",
					"aria-hidden": "true",
					children: l?.(e) ?? /* @__PURE__ */ O(i, { name: C(e) ? "folder" : "file" })
				}), /* @__PURE__ */ O("span", {
					className: "mtc-file-name-text",
					children: e.name
				})]
			})
		},
		{
			id: "size",
			header: "Size",
			width: 104,
			align: "end",
			sortValue: (e) => C(e) ? null : e.size_bytes ?? null,
			cell: (e) => C(e) || e.size_bytes == null ? /* @__PURE__ */ O("span", {
				className: "mtc-value-empty",
				children: "—"
			}) : r(e.size_bytes, { locale: De })
		},
		{
			id: "type",
			header: "Type",
			width: 160,
			accessor: (e) => C(e) ? "Folder" : e.content_type ?? ""
		},
		{
			id: "modified",
			header: "Modified",
			width: 176,
			sortValue: (e) => e.modified_at ? Date.parse(e.modified_at) || e.modified_at : null,
			cell: (e) => e.modified_at ? /* @__PURE__ */ O("time", {
				dateTime: e.modified_at,
				children: t(e.modified_at, {
					locale: De,
					timeZone: Oe
				})
			}) : /* @__PURE__ */ O("span", {
				className: "mtc-value-empty",
				children: "—"
			})
		},
		..._t ? [{
			id: "actions",
			header: "Actions",
			width: 72,
			sortable: !1,
			cell: (e) => C(e) ? null : /* @__PURE__ */ O(a, {
				icon: /* @__PURE__ */ O(i, { name: "more" }),
				variant: "ghost",
				size: "small",
				tabIndex: -1,
				"aria-label": `Open ${e.name ?? "file"} with another application`,
				onClick: (t) => {
					t.stopPropagation(), Ot(e);
				}
			})
		}] : []
	], It = pe ?? Je, Lt = (e) => {
		pe || Ye(e);
		let t = X.filter((t) => e.includes(Pt(t)));
		ge?.(t), t.length === 1 && kt(t[0]);
	};
	return /* @__PURE__ */ k("div", {
		className: "mtc-file-browser h-full flex flex-col relative",
		"data-mtc-file-browser": "",
		"data-mtc-path": B,
		"data-mtc-view": V,
		onDragOver: (e) => {
			e.preventDefault(), Ge(!0);
		},
		onDragLeave: () => Ge(!1),
		onDrop: (e) => {
			e.preventDefault(), Ge(!1), e.dataTransfer.files.length > 0 && Nt(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ k("div", {
				className: "mtc-file-browser-toolbar",
				"data-mtc-part": "toolbar",
				children: [/* @__PURE__ */ O(m, {
					label: "Folder path",
					items: [{
						id: "/",
						label: z,
						onSelect: () => Z("")
					}, ...pt.map((e, t) => ({
						id: pt.slice(0, t + 1).join("/"),
						label: e,
						onSelect: () => Z(pt.slice(0, t + 1).join("/"))
					}))]
				}), /* @__PURE__ */ k("div", {
					className: "mtc-file-browser-actions",
					children: [
						at && /* @__PURE__ */ O(ne, {
							label: "Search files",
							placeholder: "Search files",
							size: "small",
							value: ot,
							onValueChange: (e) => {
								st(e), e === "" && J && xt();
							},
							onSubmit: () => void bt(),
							"aria-busy": lt || void 0,
							className: "mtc-file-browser-search"
						}),
						J && /* @__PURE__ */ O(te, {
							onRemove: xt,
							removeLabel: "Clear search, back to browsing",
							children: "Search results"
						}),
						(Ve || Be || R) && /* @__PURE__ */ O(n, {
							size: "small",
							startIcon: /* @__PURE__ */ O(i, { name: "upload" }),
							onClick: Ct,
							title: "Upload a file or fetch a media URL",
							children: "Upload"
						}),
						/* @__PURE__ */ O(n, {
							size: "small",
							variant: "ghost",
							startIcon: /* @__PURE__ */ O(i, { name: V === "gallery" ? "table" : "image" }),
							onClick: yt,
							"aria-pressed": V === "gallery",
							title: V === "gallery" ? "Switch to the list (no thumbnails)" : "Switch to the gallery (loads image thumbnails)",
							children: "Gallery"
						})
					]
				})]
			}),
			/* @__PURE__ */ k("div", {
				className: "flex-1 overflow-hidden relative min-h-0 flex flex-col",
				"data-mtc-part": V === "gallery" ? "gallery" : "list",
				children: [
					We && /* @__PURE__ */ k("div", {
						className: "mtc-file-browser-drop",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ O(i, { name: "upload" }), " Drop files to upload"]
					}),
					X.length === 0 ? /* @__PURE__ */ O(ie, { children: J ? "No files match your search." : "This folder is empty. Drop files to upload." }) : V === "gallery" ? /* @__PURE__ */ O("div", {
						className: "flex-1 overflow-auto",
						children: /* @__PURE__ */ O(Te, {
							entries: X,
							onClick: At,
							onSelect: kt,
							onOpenWith: _t ? Ot : void 0,
							mediaUrlFor: $,
							entryKey: Pt,
							entryIcon: l
						})
					}) : /* @__PURE__ */ O(ee, {
						label: J ? "Search results" : `Files in ${B || z}`,
						className: "mtc-file-browser-grid",
						columns: Ft,
						rows: X,
						rowKey: Pt,
						rowLabel: (e) => e.name ?? Q(e),
						selection: de,
						selectedKeys: It,
						onSelectionChange: Lt,
						onRowActivate: At,
						rowHref: h ? (e) => h(e, Q(e)) : void 0,
						onNavigate: h && A ? ((e) => {
							A(e, Q(e)) !== !0 && At(e);
						}) : void 0,
						contextActions: we ? (e) => we(e, Q(e)) : void 0,
						rowProps: (e) => ({
							"data-mtc-entry-kind": C(e) ? "folder" : "file",
							"data-mtc-entry-id": e.id ?? e.object_id,
							"data-mtc-entry-path": Q(e)
						}),
						footer: J ? /* @__PURE__ */ k("span", { children: [
							J.length,
							" result",
							J.length === 1 ? "" : "s"
						] }) : mt || ht ? /* @__PURE__ */ O(p, {
							label: "File pages",
							summary: `${ft.length} on page`,
							page: He,
							hasNext: ht,
							onPageChange: vt
						}) : /* @__PURE__ */ k("span", { children: [ft.length, " on page"] })
					}),
					Ke && /* @__PURE__ */ O("div", {
						className: "mtc-file-browser-uploading",
						role: "status",
						children: "Uploading…"
					})
				]
			}),
			U && /* @__PURE__ */ O(Ee, {
				entry: U,
				mediaUrl: $(U),
				fetch: T(N, $(U), F),
				autoAdvanceQueue: he(X),
				navigableQueue: be(X),
				onSelect: (e) => W(e),
				onClose: () => W(null),
				onDownload: () => {
					jt(U);
				},
				onOpenWith: _t ? () => Ot(U) : void 0
			}),
			/* @__PURE__ */ O(u, {
				open: Xe,
				onOpenChange: (e) => {
					q || G(e);
				},
				title: `Upload to ${z}`,
				dismissible: !q,
				className: "mtc-file-browser-upload",
				footer: K === "url" ? /* @__PURE__ */ O(n, {
					intent: "primary",
					variant: "solid",
					loading: q,
					loadingLabel: "Starting…",
					onClick: () => void wt(),
					children: "Fetch and store"
				}) : void 0,
				children: /* @__PURE__ */ k("div", {
					className: "grid gap-3",
					"data-mtc-part": "upload-dialog",
					children: [
						R && /* @__PURE__ */ k("div", {
							role: "group",
							"aria-label": "Upload source",
							className: "flex gap-1",
							children: [/* @__PURE__ */ O(n, {
								size: "small",
								variant: K === "url" ? "solid" : "outline",
								intent: K === "url" ? "primary" : "neutral",
								"aria-pressed": K === "url",
								onClick: () => Ze("url"),
								children: "From URL"
							}), /* @__PURE__ */ O(n, {
								size: "small",
								variant: K === "file" ? "solid" : "outline",
								intent: K === "file" ? "primary" : "neutral",
								"aria-pressed": K === "file",
								onClick: () => Ze("file"),
								children: "Local file"
							})]
						}),
						/* @__PURE__ */ O(d, {
							label: "Folder (repo)",
							description: "The repository partition. Becomes a source key.",
							children: /* @__PURE__ */ O(f, {
								value: Qe,
								onChange: (e) => $e(e.target.value),
								placeholder: "e.g. year=2026/name=avatar"
							})
						}),
						/* @__PURE__ */ O(d, {
							label: K === "file" ? "Filename (optional; defaults to the file’s name)" : "Filename",
							description: "Location inside the repo (may include subfolders).",
							children: /* @__PURE__ */ O(f, {
								value: et,
								onChange: (e) => tt(e.target.value),
								placeholder: "e.g. avatar.mp4"
							})
						}),
						K === "url" ? /* @__PURE__ */ O(d, {
							label: "Media URL",
							description: "HTTP(S) media URL or raw HLS playlist. Fetched server-side.",
							children: /* @__PURE__ */ O(f, {
								type: "url",
								value: nt,
								onChange: (e) => rt(e.target.value),
								placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8"
							})
						}) : /* @__PURE__ */ O(d, {
							label: "File",
							children: /* @__PURE__ */ O(f, {
								type: "file",
								onChange: (e) => {
									let t = e.target.files?.[0];
									t && Tt(t);
								},
								disabled: q
							})
						}),
						q && K === "file" && /* @__PURE__ */ O("p", {
							className: "text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]",
							role: "status",
							children: "Uploading…"
						})
					]
				})
			})
		]
	});
}
function Te({ entries: e, onClick: t, onSelect: n, onOpenWith: r, mediaUrlFor: o, entryKey: s, entryIcon: c }) {
	return /* @__PURE__ */ O("div", {
		className: "mtc-file-gallery",
		children: e.map((e, l) => {
			let u = b(e.content_type, e.name, e.kind) === "image", d = C(e);
			return /* @__PURE__ */ k("div", {
				className: "mtc-file-tile",
				"data-mtc-entry-kind": d ? "folder" : "file",
				"data-mtc-entry-id": e.id ?? e.object_id,
				children: [/* @__PURE__ */ k("button", {
					type: "button",
					onClick: () => n?.(e),
					onDoubleClick: () => t(e),
					onKeyDown: (n) => {
						n.key === "Enter" && (n.preventDefault(), t(e));
					},
					className: "mtc-file-tile-button",
					children: [/* @__PURE__ */ O("span", {
						className: "mtc-file-tile-media",
						children: u && e.name ? /* @__PURE__ */ O("img", {
							src: o(e),
							alt: "",
							loading: "lazy",
							decoding: "async"
						}) : /* @__PURE__ */ O("span", {
							className: "mtc-file-tile-icon",
							"aria-hidden": "true",
							children: c?.(e) ?? /* @__PURE__ */ O(i, {
								name: d ? "folder" : "file",
								size: 32,
								strokeWidth: 1.5
							})
						})
					}), /* @__PURE__ */ O("span", {
						className: "mtc-file-tile-name",
						title: e.name,
						children: e.name
					})]
				}), r && !d && /* @__PURE__ */ O(a, {
					icon: /* @__PURE__ */ O(i, { name: "more" }),
					size: "small",
					className: "mtc-file-tile-more",
					"aria-label": `Open ${e.name ?? "file"} with another application`,
					title: "Open with…",
					onClick: () => r(e),
					onDoubleClick: (e) => e.stopPropagation()
				})]
			}, s(e) || String(l));
		})
	});
}
function Ee({ entry: e, mediaUrl: t, fetch: r, autoAdvanceQueue: o, navigableQueue: u, onSelect: d, onClose: f, onDownload: ee, onOpenWith: te }) {
	let p = b(e.content_type, e.name, e.kind), [ne, m] = D(!1);
	Se(() => m(!1), [t]);
	let re = u.length > 1, g = ce(e), ae = u.findIndex((e) => ce(e) === g), [_, oe] = D(!1), [v, se] = D(!0), y = E(null), le = E(null);
	s(!0, y, le);
	let ue = () => {
		let e = de(u, g, _, v);
		e && d(e);
	}, fe = () => {
		let e = pe(u, g, v);
		e && d(e);
	}, x = () => {
		let e = de(o, g, _, v);
		e && d(e);
	}, me = p === "video" || p === "audio";
	return /* @__PURE__ */ k("div", {
		ref: y,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Preview ${e.name ?? "file"}`,
		tabIndex: -1,
		className: "mtc-file-preview-overlay",
		"data-mtc-part": "preview",
		onClick: (e) => {
			e.target === e.currentTarget && f();
		},
		onKeyDown: (e) => {
			if (c(e, y, !0, f), e.defaultPrevented) return;
			let t = e.target;
			if (!(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) && !t.closest("[role=\"grid\"], pre")) {
				if (e.key === "ArrowRight") e.preventDefault(), ue();
				else if (e.key === "ArrowLeft") e.preventDefault(), fe();
				else if (e.key === " ") {
					let t = y.current?.querySelector("video, audio");
					t && (e.preventDefault(), t.paused ? t.play() : t.pause());
				}
			}
		},
		children: [/* @__PURE__ */ k("div", {
			className: "mtc-file-preview-bar",
			children: [
				/* @__PURE__ */ O("span", {
					className: "mtc-file-preview-name",
					children: e.name
				}),
				e.content_type && /* @__PURE__ */ O("span", {
					className: "mtc-file-preview-meta",
					children: e.content_type
				}),
				typeof e.size_bytes == "number" && /* @__PURE__ */ O("span", {
					className: "mtc-file-preview-meta",
					children: ge(e.size_bytes)
				}),
				re && /* @__PURE__ */ k("div", {
					className: "mtc-file-preview-queue",
					role: "group",
					"aria-label": "Queue",
					children: [
						/* @__PURE__ */ O(a, {
							icon: /* @__PURE__ */ O(i, { name: "chevron-left" }),
							variant: "ghost",
							size: "small",
							"aria-label": "Previous (←)",
							onClick: fe
						}),
						/* @__PURE__ */ O(a, {
							icon: /* @__PURE__ */ O(i, { name: "chevron-right" }),
							variant: "ghost",
							size: "small",
							"aria-label": "Next (→)",
							onClick: ue
						}),
						/* @__PURE__ */ O(n, {
							size: "small",
							variant: "ghost",
							"aria-pressed": _,
							onClick: () => oe((e) => !e),
							children: "Shuffle"
						}),
						/* @__PURE__ */ O(n, {
							size: "small",
							variant: "ghost",
							"aria-pressed": v,
							onClick: () => se((e) => !e),
							children: "Repeat"
						}),
						/* @__PURE__ */ k("span", {
							className: "mtc-file-preview-meta",
							children: [
								ae >= 0 ? ae + 1 : "–",
								" / ",
								u.length
							]
						})
					]
				}),
				te && /* @__PURE__ */ O(n, {
					size: "small",
					variant: "ghost",
					onClick: te,
					children: "Open with…"
				}),
				/* @__PURE__ */ O(n, {
					size: "small",
					startIcon: /* @__PURE__ */ O(i, { name: "download" }),
					onClick: ee,
					children: "Download"
				}),
				/* @__PURE__ */ O(a, {
					ref: le,
					icon: /* @__PURE__ */ O(i, { name: "close" }),
					variant: "ghost",
					size: "small",
					"aria-label": "Close preview",
					onClick: f
				})
			]
		}), /* @__PURE__ */ O("div", {
			className: l("mtc-file-preview-stage", me && "mtc-file-preview-stage-media"),
			onClick: (e) => {
				e.target === e.currentTarget && f();
			},
			children: me && ne ? /* @__PURE__ */ O(ie, { children: "Preview could not load. Use Download instead." }) : p === "video" ? /* @__PURE__ */ O("video", {
				src: t,
				controls: !0,
				autoPlay: !0,
				playsInline: !0,
				preload: "metadata",
				onEnded: x,
				onError: () => m(!0),
				className: "mtc-file-preview-media"
			}) : p === "audio" ? /* @__PURE__ */ k("div", {
				className: "mtc-file-preview-audio-card",
				children: [
					/* @__PURE__ */ O(i, {
						name: "music",
						size: 32
					}),
					/* @__PURE__ */ O("span", {
						className: "mtc-file-preview-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ O("audio", {
						src: t,
						controls: !0,
						autoPlay: !0,
						preload: "metadata",
						onEnded: x,
						onError: () => m(!0),
						className: "mtc-file-preview-audio"
					})
				]
			}) : /* @__PURE__ */ O(h, {
				file: {
					name: e.name ?? "",
					url: t,
					contentType: e.content_type,
					sizeBytes: e.size_bytes
				},
				fetch: r,
				onDownload: ee,
				height: "calc(100vh - 8rem)",
				className: "mtc-file-preview-body"
			}, t)
		})]
	});
}
//#endregion
export { we as n, A as t };
