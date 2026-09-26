import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { _ as t, d as n, g as r, h as i, p as a, w as o } from "./States-Ds3cxTem.js";
import { i as s, n as c, t as l } from "./utils-j4lJ7S1v.js";
import { d as u, f as d } from "./PropertyValue-BtibYjWJ.js";
import { T as f } from "./sourceError-BwpI_4dr.js";
import { t as ee } from "./Pagination-tCTZ9nS0.js";
import { d as te, l as p, t as m } from "./FilePreview-UlYHT2ft.js";
import { n as ne } from "./Overlays-_7OI9Emq.js";
import { t as h } from "./DataGrid-BVxWg9u8.js";
import { Ct as re, Et as g, Ft as ie, kt as ae, yt as _ } from "./MultiDashboard-_VMaZFFO.js";
import { s as oe } from "./AssetOpen-B2zlxvNf.js";
import { r as v, t as se } from "./useWatchAction-B-hvgC4R.js";
import { _ as y, a as ce, b as le, c as ue, d as de, f as fe, g as b, h as pe, i as x, l as me, m as he, n as S, o as ge, p as _e, r as ve, s as C, t as ye, u as be, v as w, x as T, y as xe } from "./fileBrowserHelpers-Dl4kjgk0.js";
import { useEffect as Se, useMemo as Ce, useRef as E, useState as D } from "react";
import { jsx as O, jsxs as k } from "react/jsx-runtime";
//#region src/widgets/FileBrowser.tsx
var we = /* @__PURE__ */ e({ FileBrowser: () => A });
function A({ data: e, options: s, widgetId: c, entryIcon: l, entryHref: m, selection: de = "single", selectedIds: pe, onSelectionChange: ge, contextActions: we, onOpen: A }) {
	let { locale: De, timeZone: Oe } = o(), j = s ?? {}, { ctx: M, setCtx: N, backendUrl: P, backendHeaders: F, fetch: I, toast: L, requestRefresh: ke, emitIntent: Ae } = ae(), { available: je, openAsset: Me, openWith: Ne } = oe(), Pe = j.path_ctx ?? "path", Fe = j.bucket_ctx ?? "org", R = j.bucket_param ?? "org", Ie = j.page_ctx ?? "page", Le = j.page_size_ctx ?? "page_size", Re = j.view_mode_ctx ?? "view_mode", ze = j.upload_action_id ?? "upload", Be = j.upload_url, z = j.ingest_url, B = M[Fe] ?? "default", V = M[Pe] ?? "", Ve = parseInt(M[Ie] ?? "1", 10) || 1, He = parseInt(M[Le] ?? "50", 10) || 50, H = M[Re] === "gallery" ? "gallery" : "icons", [Ue, We] = D(!1), [Ge, Ke] = D(!1), U = E(!1), [W, G] = D(null), [qe, Je] = D([]), [Ye, K] = D(!1), [q, Xe] = D("url"), [Ze, Qe] = D(""), [$e, et] = D(""), [tt, nt] = D(""), [J, Y] = D(!1), rt = j.search_url, [it, at] = D(""), [X, ot] = D(null), [st, ct] = D(!1), Z = E(null);
	Se(() => () => Z.current?.abort(), []);
	let lt = Ce(() => fe(e), [e]), ut = X ?? lt, Q = Ce(() => X || xe(lt), [X, lt]), dt = Ce(() => le(V), [V]), ft = !X && Ve > 1, pt = !X && lt.length >= He, mt = j.media_url_template ?? "/media?namespace={namespace}&path={path}", ht = je && j.open_with !== !1;
	Se(() => {
		Ve !== 1 && N(Ie, "1");
	}, [B, V]);
	let gt = (e) => N(Pe, e), _t = (e) => N(Ie, String(Math.max(1, e))), vt = () => N(Re, H === "gallery" ? "icons" : "gallery"), yt = async () => {
		if (!rt) return;
		let e = it.trim();
		if (e === "") {
			bt();
			return;
		}
		if (Z.current) return;
		let t = new AbortController();
		Z.current = t, ct(!0);
		try {
			let n = w(P, rt), r = await T(P, n, I)(n, {
				method: "POST",
				headers: {
					...S(P, n, F),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[R]: B,
					query: e
				}),
				signal: t.signal
			});
			if (!r.ok) {
				L(`Search failed: ${await y(r)}`, "error");
				return;
			}
			let i = await r.json();
			if (Z.current !== t) return;
			ot((i.hits ?? []).map((e) => ({
				...e,
				kind: "file"
			})));
		} catch (e) {
			t.signal.aborted || L(`Search failed: ${x(e)}`, "error");
		} finally {
			Z.current === t && (Z.current = null, ct(!1));
		}
	}, bt = () => {
		Z.current?.abort(), Z.current = null, ct(!1), at(""), ot(null);
	}, xt = (e) => {
		bt(), gt(e);
	}, St = () => {
		Qe(V), et(""), nt(""), Xe(z ? "url" : "file"), K(!0);
	}, Ct = async () => {
		if (!z) return;
		let e = Ze.trim(), t = $e.trim(), n = tt.trim();
		if (!e || !t || !n) {
			L("Need a folder (repo), a filename, and a URL", "error");
			return;
		}
		if (U.current) {
			L("Another file operation is already in progress", "warn");
			return;
		}
		U.current = !0, Y(!0);
		try {
			let r = w(P, z), i = await T(P, r, I)(r, {
				method: "POST",
				headers: {
					...S(P, r, F),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[R]: B,
					repo: e,
					path: t,
					url: n
				})
			});
			if (!i.ok) throw Error(await y(i));
			L(`Fetching ${t} in the background — it'll appear when done.`, "ok"), K(!1);
		} catch (e) {
			L(`Ingest failed: ${x(e)}`, "error");
		} finally {
			U.current = !1, Y(!1);
		}
	}, wt = async (e) => {
		let t = Ze.trim(), n = $e.trim() || e.name;
		if (!t) {
			L("Need a destination folder (repo)", "error");
			return;
		}
		if (U.current) {
			L("Another file operation is already in progress", "warn");
			return;
		}
		U.current = !0, Y(!0);
		try {
			await Mt(e, t, n), L(`Uploaded ${n}`, "ok"), K(!1), ke(c ?? "*");
		} catch (e) {
			L(`Upload failed: ${x(e)}`, "error");
		} finally {
			U.current = !1, Y(!1);
		}
	}, $ = (e) => e.path && e.path !== "" ? e.path : me(V, e.name ?? ""), Tt = (e) => mt && e.name ? w(P, ve(mt, B, $(e))) : "", Et = (e) => {
		let t = b(e.content_type, e.name, e.kind), n = j.open_intent ?? (t === "video" || t === "audio" || t === "mkv" ? "play" : "view");
		return {
			asset: {
				id: e.id ?? e.object_id,
				namespace: B,
				path: $(e),
				name: e.name ?? ($(e) || "Untitled file"),
				kind: e.kind,
				contentType: e.content_type,
				sizeBytes: e.size_bytes,
				modifiedAt: e.modified_at,
				capabilities: e.capabilities,
				symlinkTargetId: e.symlink_target_id,
				url: Tt(e) || void 0,
				metadata: { ...e.metadata }
			},
			intent: n,
			source: {
				component: "file_browser",
				widgetId: c
			}
		};
	}, Dt = (e) => {
		let t = b(e.content_type, e.name, e.kind), n = !!mt && ue(t);
		return {
			native: n ? () => G(e) : void 0,
			nativeLabel: n ? "Native preview" : void 0,
			download: j.download_url ? () => jt(e) : void 0
		};
	}, Ot = (e) => {
		Ne(Et(e), Dt(e));
	}, kt = (e) => {
		let t = e.id ?? e.object_id;
		t && Ae?.({
			type: "object.select",
			objectId: t
		});
	}, At = (e) => {
		if (A?.(e, $(e)) === !0) return;
		let t = e.id ?? e.object_id;
		if (t && Ae?.({
			type: "object.open",
			objectId: t,
			mode: C(e) ? "browse" : j.open_intent ?? "preview"
		}), C(e)) {
			X ? xt($(e)) : gt($(e));
			return;
		}
		if (je && j.open_with !== !1) {
			Me(Et(e), Dt(e));
			return;
		}
		if (mt && ue(b(e.content_type, e.name, e.kind))) {
			G(e);
			return;
		}
		jt(e);
	};
	async function jt(e) {
		let t = j.download_url;
		if (!t) {
			L("Download not configured (set options.download_url)", "error");
			return;
		}
		if (!e.name) {
			L("File has no name", "error");
			return;
		}
		let n = $(e), r = w(P, t);
		try {
			let t = await T(P, r, I)(r, {
				method: "POST",
				headers: {
					...S(P, r, F),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[R]: B,
					path: n
				})
			});
			if (!t.ok) {
				let e = await y(t);
				L(`Download failed: ${e}`, "error");
				return;
			}
			let i = await _e(t, e.content_type), a = document.createElement("a");
			a.href = URL.createObjectURL(i), a.download = e.name, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
		} catch (e) {
			L(`Download failed: ${x(e)}`, "error");
		}
	}
	let Mt = async (e, t, n) => {
		let r = e.type || "application/octet-stream";
		if (Be) {
			let i = new URLSearchParams({
				[R]: B,
				repo: t,
				path: n,
				content_type: r
			}), a = w(P, Be), o = a.includes("?") ? "&" : "?", s = await T(P, a, I)(`${a}${o}${i.toString()}`, {
				method: "POST",
				headers: S(P, a, F),
				body: e
			});
			if (!s.ok) throw Error(await s.text() || `HTTP ${s.status}`);
			return;
		}
		let i = await e.arrayBuffer(), a = re(P ?? ""), o = _({
			actionId: ze,
			params: {
				[R]: B,
				repo: t,
				path: n,
				content_type: r,
				data_b64: ye(i)
			},
			clientRequestId: g()
		}), s = await (I ?? globalThis.fetch)(a, {
			method: "POST",
			headers: {
				...F,
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
		if (V === "") {
			L("Open a folder first, or use the Upload button to choose a folder.", "error");
			return;
		}
		if (U.current) {
			L("Another file operation is already in progress", "warn");
			return;
		}
		U.current = !0;
		let t = V;
		Ke(!0);
		let n = 0;
		try {
			for (let r of Array.from(e)) try {
				await Mt(r, t, r.name), n++;
			} catch (e) {
				L(`Upload failed: ${r.name} — ${x(e)}`, "error");
			}
		} finally {
			U.current = !1, Ke(!1);
		}
		n > 0 && (L(`Uploaded ${n} file${n === 1 ? "" : "s"}`, "ok"), ke(c ?? "*"));
	}, Pt = (e) => ce(e, V) || $(e), Ft = [
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
		...ht ? [{
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
	], It = pe ?? qe, Lt = (e) => {
		pe || Je(e);
		let t = Q.filter((t) => e.includes(Pt(t)));
		ge?.(t), t.length === 1 && kt(t[0]);
	};
	return /* @__PURE__ */ k("div", {
		className: "mtc-file-browser h-full flex flex-col relative",
		"data-mtc-file-browser": "",
		"data-mtc-path": V,
		"data-mtc-view": H,
		onDragOver: (e) => {
			e.preventDefault(), We(!0);
		},
		onDragLeave: () => We(!1),
		onDrop: (e) => {
			e.preventDefault(), We(!1), e.dataTransfer.files.length > 0 && Nt(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ k("div", {
				className: "mtc-file-browser-toolbar",
				"data-mtc-part": "toolbar",
				children: [/* @__PURE__ */ O(p, {
					label: "Folder path",
					items: [{
						id: "/",
						label: B,
						onSelect: () => gt("")
					}, ...dt.map((e, t) => ({
						id: dt.slice(0, t + 1).join("/"),
						label: e,
						onSelect: () => gt(dt.slice(0, t + 1).join("/"))
					}))]
				}), /* @__PURE__ */ k("div", {
					className: "mtc-file-browser-actions",
					children: [
						rt && /* @__PURE__ */ O(te, {
							label: "Search files",
							placeholder: "Search files",
							size: "small",
							value: it,
							onValueChange: (e) => {
								at(e), e === "" && X && bt();
							},
							onSubmit: () => void yt(),
							"aria-busy": st || void 0,
							className: "mtc-file-browser-search"
						}),
						X && /* @__PURE__ */ O(f, {
							onRemove: bt,
							removeLabel: "Clear search, back to browsing",
							children: "Search results"
						}),
						(Be || ze || z) && /* @__PURE__ */ O(n, {
							size: "small",
							startIcon: /* @__PURE__ */ O(i, { name: "upload" }),
							onClick: St,
							title: "Upload a file or fetch a media URL",
							children: "Upload"
						}),
						/* @__PURE__ */ O(n, {
							size: "small",
							variant: "ghost",
							startIcon: /* @__PURE__ */ O(i, { name: H === "gallery" ? "table" : "image" }),
							onClick: vt,
							"aria-pressed": H === "gallery",
							title: H === "gallery" ? "Switch to the list (no thumbnails)" : "Switch to the gallery (loads image thumbnails)",
							children: "Gallery"
						})
					]
				})]
			}),
			/* @__PURE__ */ k("div", {
				className: "flex-1 overflow-hidden relative min-h-0 flex flex-col",
				"data-mtc-part": H === "gallery" ? "gallery" : "list",
				children: [
					Ue && /* @__PURE__ */ k("div", {
						className: "mtc-file-browser-drop",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ O(i, { name: "upload" }), " Drop files to upload"]
					}),
					Q.length === 0 ? /* @__PURE__ */ O(ie, { children: X ? "No files match your search." : "This folder is empty. Drop files to upload." }) : H === "gallery" ? /* @__PURE__ */ O("div", {
						className: "flex-1 overflow-auto",
						children: /* @__PURE__ */ O(Te, {
							entries: Q,
							onClick: At,
							onSelect: kt,
							onOpenWith: ht ? Ot : void 0,
							mediaUrlFor: Tt,
							entryKey: Pt,
							entryIcon: l
						})
					}) : /* @__PURE__ */ O(h, {
						label: X ? "Search results" : `Files in ${V || B}`,
						className: "mtc-file-browser-grid",
						columns: Ft,
						rows: Q,
						rowKey: Pt,
						rowLabel: (e) => e.name ?? $(e),
						selection: de,
						selectedKeys: It,
						onSelectionChange: Lt,
						onRowActivate: At,
						rowHref: m ? (e) => m(e, $(e)) : void 0,
						onNavigate: m && A ? ((e) => {
							A(e, $(e)) !== !0 && At(e);
						}) : void 0,
						contextActions: we ? (e) => we(e, $(e)) : void 0,
						rowProps: (e) => ({
							"data-mtc-entry-kind": C(e) ? "folder" : "file",
							"data-mtc-entry-id": e.id ?? e.object_id,
							"data-mtc-entry-path": $(e)
						}),
						footer: X ? /* @__PURE__ */ k("span", { children: [
							X.length,
							" result",
							X.length === 1 ? "" : "s"
						] }) : ft || pt ? /* @__PURE__ */ O(ee, {
							label: "File pages",
							summary: `${ut.length} on page`,
							page: Ve,
							hasNext: pt,
							onPageChange: _t
						}) : /* @__PURE__ */ k("span", { children: [ut.length, " on page"] })
					}),
					Ge && /* @__PURE__ */ O("div", {
						className: "mtc-file-browser-uploading",
						role: "status",
						children: "Uploading…"
					})
				]
			}),
			W && /* @__PURE__ */ O(Ee, {
				entry: W,
				mediaUrl: Tt(W),
				fetch: T(P, Tt(W), I),
				autoAdvanceQueue: he(Q),
				navigableQueue: be(Q),
				onSelect: (e) => G(e),
				onClose: () => G(null),
				onDownload: () => {
					jt(W);
				},
				onOpenWith: ht ? () => Ot(W) : void 0
			}),
			/* @__PURE__ */ O(ne, {
				open: Ye,
				onOpenChange: (e) => {
					J || K(e);
				},
				title: `Upload to ${B}`,
				dismissible: !J,
				className: "mtc-file-browser-upload",
				footer: q === "url" ? /* @__PURE__ */ O(n, {
					intent: "primary",
					variant: "solid",
					loading: J,
					loadingLabel: "Starting…",
					onClick: () => void Ct(),
					children: "Fetch and store"
				}) : void 0,
				children: /* @__PURE__ */ k("div", {
					className: "grid gap-3",
					"data-mtc-part": "upload-dialog",
					children: [
						z && /* @__PURE__ */ k("div", {
							role: "group",
							"aria-label": "Upload source",
							className: "flex gap-1",
							children: [/* @__PURE__ */ O(n, {
								size: "small",
								variant: q === "url" ? "solid" : "outline",
								intent: q === "url" ? "primary" : "neutral",
								"aria-pressed": q === "url",
								onClick: () => Xe("url"),
								children: "From URL"
							}), /* @__PURE__ */ O(n, {
								size: "small",
								variant: q === "file" ? "solid" : "outline",
								intent: q === "file" ? "primary" : "neutral",
								"aria-pressed": q === "file",
								onClick: () => Xe("file"),
								children: "Local file"
							})]
						}),
						/* @__PURE__ */ O(u, {
							label: "Folder (repo)",
							description: "The repository partition. Becomes a source key.",
							children: /* @__PURE__ */ O(d, {
								value: Ze,
								onChange: (e) => Qe(e.target.value),
								placeholder: "e.g. year=2026/name=avatar"
							})
						}),
						/* @__PURE__ */ O(u, {
							label: q === "file" ? "Filename (optional; defaults to the file’s name)" : "Filename",
							description: "Location inside the repo (may include subfolders).",
							children: /* @__PURE__ */ O(d, {
								value: $e,
								onChange: (e) => et(e.target.value),
								placeholder: "e.g. avatar.mp4"
							})
						}),
						q === "url" ? /* @__PURE__ */ O(u, {
							label: "Media URL",
							description: "HTTP(S) media URL or raw HLS playlist. Fetched server-side.",
							children: /* @__PURE__ */ O(d, {
								type: "url",
								value: tt,
								onChange: (e) => nt(e.target.value),
								placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8"
							})
						}) : /* @__PURE__ */ O(u, {
							label: "File",
							children: /* @__PURE__ */ O(d, {
								type: "file",
								onChange: (e) => {
									let t = e.target.files?.[0];
									t && wt(t);
								},
								disabled: J
							})
						}),
						J && q === "file" && /* @__PURE__ */ O("p", {
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
	let p = b(e.content_type, e.name, e.kind), [ne, h] = D(!1);
	Se(() => h(!1), [t]);
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
				onError: () => h(!0),
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
						onError: () => h(!0),
						className: "mtc-file-preview-audio"
					})
				]
			}) : /* @__PURE__ */ O(m, {
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
