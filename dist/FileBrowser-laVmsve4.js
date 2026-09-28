import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { d as t, h as n, p as r } from "./States-BRpBuveA.js";
import { a as i, r as a, t as o } from "./utils-BfYGx7e_.js";
import { i as s, r as c } from "./FormControls-DtyFD-nE.js";
import { T as ee } from "./sourceError-CTpw8oGk.js";
import { t as l } from "./Pagination-6D1ZC47_.js";
import { d as u, l as d, t as f } from "./FilePreview-BQUuEBAh.js";
import { n as te } from "./Overlays-BqanRm2f.js";
import { t as ne } from "./DataGrid-Bo8lPqJT.js";
import { Ct as p, Et as re, Ft as ie, kt as m, yt as ae } from "./MultiDashboard-CmFSbzfd.js";
import { s as h } from "./AssetOpen-DaH5-6NX.js";
import { r as oe, t as se } from "./useWatchAction-Cw8cQ87p.js";
import { _ as g, a as ce, b as _, c as le, d as ue, f as v, g as y, h as de, i as b, l as fe, m as pe, n as x, o as me, p as he, r as ge, s as S, t as _e, u as ve, v as C, x as w, y as ye } from "./fileBrowserHelpers-BLXm6864.js";
import { useEffect as be, useMemo as xe, useRef as T, useState as E } from "react";
import { jsx as D, jsxs as O } from "react/jsx-runtime";
//#region src/widgets/FileBrowser.tsx
var Se = /* @__PURE__ */ e({ FileBrowser: () => k });
function k({ data: e, options: i, widgetId: a, entryIcon: o, entryHref: f, selection: ue = "single", selectedIds: de, onSelectionChange: me, contextActions: Se, onOpen: k }) {
	let A = i ?? {}, { ctx: j, setCtx: M, backendUrl: N, backendHeaders: P, fetch: F, toast: I, requestRefresh: Te, emitIntent: Ee } = m(), { available: De, openAsset: Oe, openWith: ke } = h(), Ae = A.path_ctx ?? "path", je = A.bucket_ctx ?? "org", L = A.bucket_param ?? "org", Me = A.page_ctx ?? "page", Ne = A.page_size_ctx ?? "page_size", Pe = A.view_mode_ctx ?? "view_mode", Fe = A.upload_action_id ?? "upload", Ie = A.upload_url, R = A.ingest_url, z = j[je] ?? "default", B = j[Ae] ?? "", Le = parseInt(j[Me] ?? "1", 10) || 1, Re = parseInt(j[Ne] ?? "50", 10) || 50, V = j[Pe] === "gallery" ? "gallery" : "icons", [ze, Be] = E(!1), [Ve, He] = E(!1), H = T(!1), [U, W] = E(null), [Ue, We] = E([]), [Ge, G] = E(!1), [K, Ke] = E("url"), [qe, Je] = E(""), [Ye, Xe] = E(""), [Ze, Qe] = E(""), [q, J] = E(!1), $e = A.search_url, [et, tt] = E(""), [Y, nt] = E(null), [rt, it] = E(!1), X = T(null);
	be(() => () => X.current?.abort(), []);
	let Z = xe(() => v(e), [e]), at = Y ?? Z, Q = xe(() => Y || ye(Z), [Y, Z]), ot = xe(() => _(B), [B]), st = !Y && Le > 1, ct = !Y && Z.length >= Re, lt = A.media_url_template ?? "/media?namespace={namespace}&path={path}", ut = De && A.open_with !== !1;
	be(() => {
		Le !== 1 && M(Me, "1");
	}, [z, B]);
	let dt = (e) => M(Ae, e), ft = (e) => M(Me, String(Math.max(1, e))), pt = () => M(Pe, V === "gallery" ? "icons" : "gallery"), mt = async () => {
		if (!$e) return;
		let e = et.trim();
		if (e === "") {
			ht();
			return;
		}
		if (X.current) return;
		let t = new AbortController();
		X.current = t, it(!0);
		try {
			let n = C(N, $e), r = await w(N, n, F)(n, {
				method: "POST",
				headers: {
					...x(N, n, P),
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
				I(`Search failed: ${await g(r)}`, "error");
				return;
			}
			let i = await r.json();
			if (X.current !== t) return;
			nt((i.hits ?? []).map((e) => ({
				...e,
				kind: "file"
			})));
		} catch (e) {
			t.signal.aborted || I(`Search failed: ${b(e)}`, "error");
		} finally {
			X.current === t && (X.current = null, it(!1));
		}
	}, ht = () => {
		X.current?.abort(), X.current = null, it(!1), tt(""), nt(null);
	}, gt = (e) => {
		ht(), dt(e);
	}, _t = () => {
		Je(B), Xe(""), Qe(""), Ke(R ? "url" : "file"), G(!0);
	}, vt = async () => {
		if (!R) return;
		let e = qe.trim(), t = Ye.trim(), n = Ze.trim();
		if (!e || !t || !n) {
			I("Need a folder (repo), a filename, and a URL", "error");
			return;
		}
		if (H.current) {
			I("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0, J(!0);
		try {
			let r = C(N, R), i = await w(N, r, F)(r, {
				method: "POST",
				headers: {
					...x(N, r, P),
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
			if (!i.ok) throw Error(await g(i));
			I(`Fetching ${t} in the background — it'll appear when done.`, "ok"), G(!1);
		} catch (e) {
			I(`Ingest failed: ${b(e)}`, "error");
		} finally {
			H.current = !1, J(!1);
		}
	}, yt = async (e) => {
		let t = qe.trim(), n = Ye.trim() || e.name;
		if (!t) {
			I("Need a destination folder (repo)", "error");
			return;
		}
		if (H.current) {
			I("Another file operation is already in progress", "warn");
			return;
		}
		H.current = !0, J(!0);
		try {
			await Dt(e, t, n), I(`Uploaded ${n}`, "ok"), G(!1), Te(a ?? "*");
		} catch (e) {
			I(`Upload failed: ${b(e)}`, "error");
		} finally {
			H.current = !1, J(!1);
		}
	}, $ = (e) => e.path && e.path !== "" ? e.path : fe(B, e.name ?? ""), bt = (e) => lt && e.name ? C(N, ge(lt, z, $(e))) : "", xt = (e) => {
		let t = y(e.content_type, e.name, e.kind), n = A.open_intent ?? (t === "video" || t === "audio" || t === "mkv" ? "play" : "view");
		return {
			asset: {
				id: e.id ?? e.object_id,
				namespace: z,
				path: $(e),
				name: e.name ?? ($(e) || "Untitled file"),
				kind: e.kind,
				contentType: e.content_type,
				sizeBytes: e.size_bytes,
				modifiedAt: e.modified_at,
				capabilities: e.capabilities,
				symlinkTargetId: e.symlink_target_id,
				url: bt(e) || void 0,
				metadata: { ...e.metadata }
			},
			intent: n,
			source: {
				component: "file_browser",
				widgetId: a
			}
		};
	}, St = (e) => {
		let t = y(e.content_type, e.name, e.kind), n = !!lt && le(t);
		return {
			native: n ? () => W(e) : void 0,
			nativeLabel: n ? "Native preview" : void 0,
			download: A.download_url ? () => Et(e) : void 0
		};
	}, Ct = (e) => {
		ke(xt(e), St(e));
	}, wt = (e) => {
		let t = e.id ?? e.object_id;
		t && Ee?.({
			type: "object.select",
			objectId: t
		});
	}, Tt = (e) => {
		if (k?.(e, $(e)) === !0) return;
		let t = e.id ?? e.object_id;
		if (t && Ee?.({
			type: "object.open",
			objectId: t,
			mode: S(e) ? "browse" : A.open_intent ?? "preview"
		}), S(e)) {
			Y ? gt($(e)) : dt($(e));
			return;
		}
		if (De && A.open_with !== !1) {
			Oe(xt(e), St(e));
			return;
		}
		if (lt && le(y(e.content_type, e.name, e.kind))) {
			W(e);
			return;
		}
		Et(e);
	};
	async function Et(e) {
		let t = A.download_url;
		if (!t) {
			I("Download not configured (set options.download_url)", "error");
			return;
		}
		if (!e.name) {
			I("File has no name", "error");
			return;
		}
		let n = $(e), r = C(N, t);
		try {
			let t = await w(N, r, F)(r, {
				method: "POST",
				headers: {
					...x(N, r, P),
					"Content-Type": "application/json",
					"Connect-Protocol-Version": "1"
				},
				body: JSON.stringify({
					[L]: z,
					path: n
				})
			});
			if (!t.ok) {
				let e = await g(t);
				I(`Download failed: ${e}`, "error");
				return;
			}
			let i = await he(t, e.content_type), a = document.createElement("a");
			a.href = URL.createObjectURL(i), a.download = e.name, a.click(), setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
		} catch (e) {
			I(`Download failed: ${b(e)}`, "error");
		}
	}
	let Dt = async (e, t, n) => {
		let r = e.type || "application/octet-stream";
		if (Ie) {
			let i = new URLSearchParams({
				[L]: z,
				repo: t,
				path: n,
				content_type: r
			}), a = C(N, Ie), o = a.includes("?") ? "&" : "?", s = await w(N, a, F)(`${a}${o}${i.toString()}`, {
				method: "POST",
				headers: x(N, a, P),
				body: e
			});
			if (!s.ok) throw Error(await s.text() || `HTTP ${s.status}`);
			return;
		}
		let i = await e.arrayBuffer(), a = p(N ?? ""), o = ae({
			actionId: Fe,
			params: {
				[L]: z,
				repo: t,
				path: n,
				content_type: r,
				data_b64: _e(i)
			},
			clientRequestId: re()
		}), s = await (F ?? globalThis.fetch)(a, {
			method: "POST",
			headers: {
				...P,
				"Content-Type": "application/json",
				"Connect-Protocol-Version": "1"
			},
			body: JSON.stringify(o)
		});
		if (!s.ok) throw Error(await g(s));
		let c = await s.json();
		if (!oe(c.status)) throw Error(c.message ?? "Upload action did not return a terminal status");
		if (se(c.status)) throw Error(c.message ?? "Upload action failed");
	}, Ot = async (e) => {
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
		He(!0);
		let n = 0;
		try {
			for (let r of Array.from(e)) try {
				await Dt(r, t, r.name), n++;
			} catch (e) {
				I(`Upload failed: ${r.name} — ${b(e)}`, "error");
			}
		} finally {
			H.current = !1, He(!1);
		}
		n > 0 && (I(`Uploaded ${n} file${n === 1 ? "" : "s"}`, "ok"), Te(a ?? "*"));
	}, kt = (e) => ce(e, B) || $(e), At = [
		{
			id: "name",
			header: "Name",
			grow: !0,
			sortValue: (e) => `${+!S(e)}${(e.name ?? "").toLowerCase()}`,
			cell: (e) => /* @__PURE__ */ O("span", {
				className: "mtc-file-name",
				children: [/* @__PURE__ */ D("span", {
					className: "mtc-file-icon",
					"aria-hidden": "true",
					children: o?.(e) ?? /* @__PURE__ */ D(n, { name: S(e) ? "folder" : "file" })
				}), /* @__PURE__ */ D("span", {
					className: "mtc-file-name-text",
					children: e.name
				})]
			})
		},
		{
			id: "size",
			header: "Size",
			kind: "bytes",
			accessor: (e) => S(e) ? null : e.size_bytes ?? null
		},
		{
			id: "type",
			header: "Type",
			accessor: (e) => S(e) ? "Folder" : e.content_type ?? ""
		},
		{
			id: "modified",
			header: "Modified",
			kind: "datetime",
			accessor: (e) => e.modified_at || null
		},
		...ut ? [{
			id: "actions",
			header: "Actions",
			width: 72,
			sortable: !1,
			cell: (e) => S(e) ? null : /* @__PURE__ */ D(r, {
				icon: /* @__PURE__ */ D(n, { name: "more" }),
				variant: "ghost",
				size: "small",
				tabIndex: -1,
				"aria-label": `Open ${e.name ?? "file"} with another application`,
				onClick: (t) => {
					t.stopPropagation(), Ct(e);
				}
			})
		}] : []
	], jt = de ?? Ue, Mt = (e) => {
		de || We(e);
		let t = Q.filter((t) => e.includes(kt(t)));
		me?.(t), t.length === 1 && wt(t[0]);
	};
	return /* @__PURE__ */ O("div", {
		className: "mtc-file-browser h-full flex flex-col relative",
		"data-mtc-file-browser": "",
		"data-mtc-path": B,
		"data-mtc-view": V,
		onDragOver: (e) => {
			e.preventDefault(), Be(!0);
		},
		onDragLeave: () => Be(!1),
		onDrop: (e) => {
			e.preventDefault(), Be(!1), e.dataTransfer.files.length > 0 && Ot(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ O("div", {
				className: "mtc-file-browser-toolbar",
				"data-mtc-part": "toolbar",
				children: [/* @__PURE__ */ D(d, {
					label: "Folder path",
					items: [{
						id: "/",
						label: z,
						onSelect: () => dt("")
					}, ...ot.map((e, t) => ({
						id: ot.slice(0, t + 1).join("/"),
						label: e,
						onSelect: () => dt(ot.slice(0, t + 1).join("/"))
					}))]
				}), /* @__PURE__ */ O("div", {
					className: "mtc-file-browser-actions",
					children: [
						$e && /* @__PURE__ */ D(u, {
							label: "Search files",
							placeholder: "Search files",
							size: "small",
							value: et,
							onValueChange: (e) => {
								tt(e), e === "" && Y && ht();
							},
							onSubmit: () => void mt(),
							"aria-busy": rt || void 0,
							className: "mtc-file-browser-search"
						}),
						Y && /* @__PURE__ */ D(ee, {
							onRemove: ht,
							removeLabel: "Clear search, back to browsing",
							children: "Search results"
						}),
						(Ie || Fe || R) && /* @__PURE__ */ D(t, {
							size: "small",
							startIcon: /* @__PURE__ */ D(n, { name: "upload" }),
							onClick: _t,
							title: "Upload a file or fetch a media URL",
							children: "Upload"
						}),
						/* @__PURE__ */ D(t, {
							size: "small",
							variant: "ghost",
							startIcon: /* @__PURE__ */ D(n, { name: V === "gallery" ? "table" : "image" }),
							onClick: pt,
							"aria-pressed": V === "gallery",
							title: V === "gallery" ? "Switch to the list (no thumbnails)" : "Switch to the gallery (loads image thumbnails)",
							children: "Gallery"
						})
					]
				})]
			}),
			/* @__PURE__ */ O("div", {
				className: "flex-1 overflow-hidden relative min-h-0 flex flex-col",
				"data-mtc-part": V === "gallery" ? "gallery" : "list",
				children: [
					ze && /* @__PURE__ */ O("div", {
						className: "mtc-file-browser-drop",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ D(n, { name: "upload" }), " Drop files to upload"]
					}),
					Q.length === 0 ? /* @__PURE__ */ D(ie, { children: Y ? "No files match your search." : "This folder is empty. Drop files to upload." }) : V === "gallery" ? /* @__PURE__ */ D("div", {
						className: "flex-1 overflow-auto",
						children: /* @__PURE__ */ D(Ce, {
							entries: Q,
							onClick: Tt,
							onSelect: wt,
							onOpenWith: ut ? Ct : void 0,
							mediaUrlFor: bt,
							entryKey: kt,
							entryIcon: o
						})
					}) : /* @__PURE__ */ D(ne, {
						label: Y ? "Search results" : `Files in ${B || z}`,
						className: "mtc-file-browser-grid",
						columns: At,
						rows: Q,
						rowKey: kt,
						rowLabel: (e) => e.name ?? $(e),
						selection: ue,
						selectedKeys: jt,
						onSelectionChange: Mt,
						onRowActivate: Tt,
						rowHref: f ? (e) => f(e, $(e)) : void 0,
						onNavigate: f && k ? ((e) => {
							k(e, $(e)) !== !0 && Tt(e);
						}) : void 0,
						contextActions: Se ? (e) => Se(e, $(e)) : void 0,
						rowProps: (e) => ({
							"data-mtc-entry-kind": S(e) ? "folder" : "file",
							"data-mtc-entry-id": e.id ?? e.object_id,
							"data-mtc-entry-path": $(e)
						}),
						footer: Y ? /* @__PURE__ */ O("span", { children: [
							Y.length,
							" result",
							Y.length === 1 ? "" : "s"
						] }) : st || ct ? /* @__PURE__ */ D(l, {
							label: "File pages",
							summary: `${at.length} on page`,
							page: Le,
							hasNext: ct,
							onPageChange: ft
						}) : /* @__PURE__ */ O("span", { children: [at.length, " on page"] })
					}),
					Ve && /* @__PURE__ */ D("div", {
						className: "mtc-file-browser-uploading",
						role: "status",
						children: "Uploading…"
					})
				]
			}),
			U && /* @__PURE__ */ D(we, {
				entry: U,
				mediaUrl: bt(U),
				fetch: w(N, bt(U), F),
				autoAdvanceQueue: pe(Q),
				navigableQueue: ve(Q),
				onSelect: (e) => W(e),
				onClose: () => W(null),
				onDownload: () => {
					Et(U);
				},
				onOpenWith: ut ? () => Ct(U) : void 0
			}),
			/* @__PURE__ */ D(te, {
				open: Ge,
				onOpenChange: (e) => {
					q || G(e);
				},
				title: `Upload to ${z}`,
				dismissible: !q,
				className: "mtc-file-browser-upload",
				footer: K === "url" ? /* @__PURE__ */ D(t, {
					intent: "primary",
					variant: "solid",
					loading: q,
					loadingLabel: "Starting…",
					onClick: () => void vt(),
					children: "Fetch and store"
				}) : void 0,
				children: /* @__PURE__ */ O("div", {
					className: "grid gap-3",
					"data-mtc-part": "upload-dialog",
					children: [
						R && /* @__PURE__ */ O("div", {
							role: "group",
							"aria-label": "Upload source",
							className: "flex gap-1",
							children: [/* @__PURE__ */ D(t, {
								size: "small",
								variant: K === "url" ? "solid" : "outline",
								intent: K === "url" ? "primary" : "neutral",
								"aria-pressed": K === "url",
								onClick: () => Ke("url"),
								children: "From URL"
							}), /* @__PURE__ */ D(t, {
								size: "small",
								variant: K === "file" ? "solid" : "outline",
								intent: K === "file" ? "primary" : "neutral",
								"aria-pressed": K === "file",
								onClick: () => Ke("file"),
								children: "Local file"
							})]
						}),
						/* @__PURE__ */ D(c, {
							label: "Folder (repo)",
							description: "The repository partition. Becomes a source key.",
							children: /* @__PURE__ */ D(s, {
								value: qe,
								onChange: (e) => Je(e.target.value),
								placeholder: "e.g. year=2026/name=avatar"
							})
						}),
						/* @__PURE__ */ D(c, {
							label: K === "file" ? "Filename (optional; defaults to the file’s name)" : "Filename",
							description: "Location inside the repo (may include subfolders).",
							children: /* @__PURE__ */ D(s, {
								value: Ye,
								onChange: (e) => Xe(e.target.value),
								placeholder: "e.g. avatar.mp4"
							})
						}),
						K === "url" ? /* @__PURE__ */ D(c, {
							label: "Media URL",
							description: "HTTP(S) media URL or raw HLS playlist. Fetched server-side.",
							children: /* @__PURE__ */ D(s, {
								type: "url",
								value: Ze,
								onChange: (e) => Qe(e.target.value),
								placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8"
							})
						}) : /* @__PURE__ */ D(c, {
							label: "File",
							children: /* @__PURE__ */ D(s, {
								type: "file",
								onChange: (e) => {
									let t = e.target.files?.[0];
									t && yt(t);
								},
								disabled: q
							})
						}),
						q && K === "file" && /* @__PURE__ */ D("p", {
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
function Ce({ entries: e, onClick: t, onSelect: i, onOpenWith: a, mediaUrlFor: o, entryKey: s, entryIcon: c }) {
	return /* @__PURE__ */ D("div", {
		className: "mtc-file-gallery",
		children: e.map((e, ee) => {
			let l = y(e.content_type, e.name, e.kind) === "image", u = S(e);
			return /* @__PURE__ */ O("div", {
				className: "mtc-file-tile",
				"data-mtc-entry-kind": u ? "folder" : "file",
				"data-mtc-entry-id": e.id ?? e.object_id,
				children: [/* @__PURE__ */ O("button", {
					type: "button",
					onClick: () => i?.(e),
					onDoubleClick: () => t(e),
					onKeyDown: (n) => {
						n.key === "Enter" && (n.preventDefault(), t(e));
					},
					className: "mtc-file-tile-button",
					children: [/* @__PURE__ */ D("span", {
						className: "mtc-file-tile-media",
						children: l && e.name ? /* @__PURE__ */ D("img", {
							src: o(e),
							alt: "",
							loading: "lazy",
							decoding: "async"
						}) : /* @__PURE__ */ D("span", {
							className: "mtc-file-tile-icon",
							"aria-hidden": "true",
							children: c?.(e) ?? /* @__PURE__ */ D(n, {
								name: u ? "folder" : "file",
								size: 32,
								strokeWidth: 1.5
							})
						})
					}), /* @__PURE__ */ D("span", {
						className: "mtc-file-tile-name",
						title: e.name,
						children: e.name
					})]
				}), a && !u && /* @__PURE__ */ D(r, {
					icon: /* @__PURE__ */ D(n, { name: "more" }),
					size: "small",
					className: "mtc-file-tile-more",
					"aria-label": `Open ${e.name ?? "file"} with another application`,
					title: "Open with…",
					onClick: () => a(e),
					onDoubleClick: (e) => e.stopPropagation()
				})]
			}, s(e) || String(ee));
		})
	});
}
function we({ entry: e, mediaUrl: s, fetch: c, autoAdvanceQueue: ee, navigableQueue: l, onSelect: u, onClose: d, onDownload: te, onOpenWith: ne }) {
	let p = y(e.content_type, e.name, e.kind), [re, m] = E(!1);
	be(() => m(!1), [s]);
	let ae = l.length > 1, h = ce(e), oe = l.findIndex((e) => ce(e) === h), [se, g] = E(!1), [_, le] = E(!0), v = T(null), b = T(null);
	i(!0, v, b);
	let fe = () => {
		let e = ue(l, h, se, _);
		e && u(e);
	}, pe = () => {
		let e = de(l, h, _);
		e && u(e);
	}, x = () => {
		let e = ue(ee, h, se, _);
		e && u(e);
	}, he = p === "video" || p === "audio";
	return /* @__PURE__ */ O("div", {
		ref: v,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `Preview ${e.name ?? "file"}`,
		tabIndex: -1,
		className: "mtc-file-preview-overlay",
		"data-mtc-part": "preview",
		onClick: (e) => {
			e.target === e.currentTarget && d();
		},
		onKeyDown: (e) => {
			if (a(e, v, !0, d), e.defaultPrevented) return;
			let t = e.target;
			if (!(t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) && !t.closest("[role=\"grid\"], pre")) {
				if (e.key === "ArrowRight") e.preventDefault(), fe();
				else if (e.key === "ArrowLeft") e.preventDefault(), pe();
				else if (e.key === " ") {
					let t = v.current?.querySelector("video, audio");
					t && (e.preventDefault(), t.paused ? t.play() : t.pause());
				}
			}
		},
		children: [/* @__PURE__ */ O("div", {
			className: "mtc-file-preview-bar",
			children: [
				/* @__PURE__ */ D("span", {
					className: "mtc-file-preview-name",
					children: e.name
				}),
				e.content_type && /* @__PURE__ */ D("span", {
					className: "mtc-file-preview-meta",
					children: e.content_type
				}),
				typeof e.size_bytes == "number" && /* @__PURE__ */ D("span", {
					className: "mtc-file-preview-meta",
					children: me(e.size_bytes)
				}),
				ae && /* @__PURE__ */ O("div", {
					className: "mtc-file-preview-queue",
					role: "group",
					"aria-label": "Queue",
					children: [
						/* @__PURE__ */ D(r, {
							icon: /* @__PURE__ */ D(n, { name: "chevron-left" }),
							variant: "ghost",
							size: "small",
							"aria-label": "Previous (←)",
							onClick: pe
						}),
						/* @__PURE__ */ D(r, {
							icon: /* @__PURE__ */ D(n, { name: "chevron-right" }),
							variant: "ghost",
							size: "small",
							"aria-label": "Next (→)",
							onClick: fe
						}),
						/* @__PURE__ */ D(t, {
							size: "small",
							variant: "ghost",
							"aria-pressed": se,
							onClick: () => g((e) => !e),
							children: "Shuffle"
						}),
						/* @__PURE__ */ D(t, {
							size: "small",
							variant: "ghost",
							"aria-pressed": _,
							onClick: () => le((e) => !e),
							children: "Repeat"
						}),
						/* @__PURE__ */ O("span", {
							className: "mtc-file-preview-meta",
							children: [
								oe >= 0 ? oe + 1 : "–",
								" / ",
								l.length
							]
						})
					]
				}),
				ne && /* @__PURE__ */ D(t, {
					size: "small",
					variant: "ghost",
					onClick: ne,
					children: "Open with…"
				}),
				/* @__PURE__ */ D(t, {
					size: "small",
					startIcon: /* @__PURE__ */ D(n, { name: "download" }),
					onClick: te,
					children: "Download"
				}),
				/* @__PURE__ */ D(r, {
					ref: b,
					icon: /* @__PURE__ */ D(n, { name: "close" }),
					variant: "ghost",
					size: "small",
					"aria-label": "Close preview",
					onClick: d
				})
			]
		}), /* @__PURE__ */ D("div", {
			className: o("mtc-file-preview-stage", he && "mtc-file-preview-stage-media"),
			onClick: (e) => {
				e.target === e.currentTarget && d();
			},
			children: he && re ? /* @__PURE__ */ D(ie, { children: "Preview could not load. Use Download instead." }) : p === "video" ? /* @__PURE__ */ D("video", {
				src: s,
				controls: !0,
				autoPlay: !0,
				playsInline: !0,
				preload: "metadata",
				onEnded: x,
				onError: () => m(!0),
				className: "mtc-file-preview-media"
			}) : p === "audio" ? /* @__PURE__ */ O("div", {
				className: "mtc-file-preview-audio-card",
				children: [
					/* @__PURE__ */ D(n, {
						name: "music",
						size: 32
					}),
					/* @__PURE__ */ D("span", {
						className: "mtc-file-preview-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ D("audio", {
						src: s,
						controls: !0,
						autoPlay: !0,
						preload: "metadata",
						onEnded: x,
						onError: () => m(!0),
						className: "mtc-file-preview-audio"
					})
				]
			}) : /* @__PURE__ */ D(f, {
				file: {
					name: e.name ?? "",
					url: s,
					contentType: e.content_type,
					sizeBytes: e.size_bytes
				},
				fetch: c,
				onDownload: te,
				height: "calc(100vh - 8rem)",
				className: "mtc-file-preview-body"
			}, s)
		})]
	});
}
//#endregion
export { Se as n, k as t };
