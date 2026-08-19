import { i as e, n as t } from "./utils-B2QVXvLO.js";
import { At as n, It as r, J as i, X as a, Y as o, Z as s, q as c } from "./MultiDashboard-CwQKjnza.js";
import { s as l } from "./AssetOpen-miowZkWQ.js";
import { n as u, t as d } from "./CursorPager-D5R3-KrK.js";
import { useCallback as f, useEffect as p, useMemo as m, useRef as h, useState as g } from "react";
import { Fragment as _, jsx as v, jsxs as y } from "react/jsx-runtime";
//#region src/widgets/MediaGalleryImpl.tsx
function b({ data: e, options: t, widgetId: i }) {
	let o = t ?? {}, { ctx: h, setCtx: _ } = n(), { available: b, openAsset: S, openWith: w } = l(), E = m(() => s(e), [e]), [D, O] = g(""), [k, A] = g("all"), [j, M] = g("all"), [N, P] = g(null), F = m(() => c(E.items, {
		query: D,
		kind: k,
		collectionId: j
	}), [
		j,
		k,
		E.items,
		D
	]), I = m(() => a(F, o.group_by ?? "day"), [F, o.group_by]), L = N == null ? -1 : F.findIndex((e) => e.id === N), R = L >= 0 ? F[L] : void 0, z = o.media_context?.key ?? "media_id", B = o.media_context?.kind_key ?? "media_kind", V = !!E.nextPageToken || !!h[u(i, o)], H = b && o.open_with !== !1, U = f((e) => ({
		asset: {
			id: e.id,
			name: e.title,
			kind: e.kind,
			contentType: e.contentType ?? (e.kind === "video" ? "video/*" : "image/*"),
			url: e.url,
			metadata: {
				...e.metadata,
				capturedAt: e.capturedAt,
				createdAt: e.createdAt,
				width: e.width,
				height: e.height,
				durationSeconds: e.durationSeconds,
				collectionIds: e.collectionIds
			}
		},
		intent: e.kind === "video" ? "play" : "view",
		source: {
			component: "media_gallery",
			widgetId: i
		}
	}), [i]), W = f((e) => {
		for (let [t, n] of Object.entries(e.context)) _(t, n);
		z in e.context || _(z, e.id), B in e.context || _(B, e.kind), H ? S(U(e), {
			native: () => P(e.id),
			nativeLabel: e.kind === "video" ? "Native video player" : "Native photo viewer"
		}) : P(e.id);
	}, [
		S,
		H,
		U,
		z,
		B,
		_
	]), G = f((e) => {
		if (F.length < 2 || L < 0) return;
		let t = (L + e + F.length) % F.length;
		W(F[t]);
	}, [
		F,
		W,
		L
	]);
	p(() => {
		N && !E.items.some((e) => e.id === N) && P(null);
	}, [E.items, N]);
	let K = E.items.some((e) => e.favorite), q = o.kind_filter !== !1, J = o.density === "compact" ? 104 : 142;
	return /* @__PURE__ */ y("div", {
		className: "h-full min-h-0 flex flex-col relative",
		children: [
			/* @__PURE__ */ y("div", {
				className: "flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0",
				children: [/* @__PURE__ */ y("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [o.search !== !1 && /* @__PURE__ */ v("input", {
						type: "search",
						value: D,
						onChange: (e) => O(e.target.value),
						placeholder: "Search media…",
						"aria-label": "Search media",
						className: "min-w-0 flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
					}), o.collection_filter !== !1 && E.collections.length > 0 && /* @__PURE__ */ y("select", {
						value: j,
						onChange: (e) => M(e.target.value),
						"aria-label": "Filter by collection",
						className: "max-w-[12rem] bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-600",
						children: [/* @__PURE__ */ v("option", {
							value: "all",
							children: "All collections"
						}), E.collections.map((e) => /* @__PURE__ */ y("option", {
							value: e.id,
							children: [e.name, e.itemCount == null ? "" : ` (${e.itemCount})`]
						}, e.id))]
					})]
				}), q && /* @__PURE__ */ v("div", {
					className: "flex items-center gap-1 overflow-x-auto pb-0.5",
					children: [
						["all", "All"],
						["image", "Photos"],
						["video", "Videos"],
						...K ? [["favorite", "Favorites"]] : []
					].map(([e, t]) => /* @__PURE__ */ v("button", {
						type: "button",
						onClick: () => A(e),
						"aria-pressed": k === e,
						className: `px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap border ${k === e ? "bg-sky-500/15 text-sky-300 border-sky-500/30" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-200"}`,
						children: t
					}, e))
				})]
			}),
			/* @__PURE__ */ y("div", {
				className: "flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-600 shrink-0",
				children: [/* @__PURE__ */ y("span", { children: [F.length.toLocaleString(), " shown"] }), E.total != null && /* @__PURE__ */ y("span", { children: [E.total.toLocaleString(), " total"] })]
			}),
			/* @__PURE__ */ v("div", {
				className: "flex-1 min-h-0 overflow-auto pr-1",
				children: E.items.length === 0 ? /* @__PURE__ */ v(r, { children: "No photos or videos" }) : F.length === 0 ? /* @__PURE__ */ v(r, { children: "No matching media" }) : /* @__PURE__ */ v("div", {
					className: "space-y-4 pb-1",
					children: I.map((e) => /* @__PURE__ */ y("section", {
						"aria-labelledby": `media-group-${T(e.key)}`,
						children: [(o.group_by ?? "day") !== "none" && /* @__PURE__ */ v("div", {
							id: `media-group-${T(e.key)}`,
							className: "sticky top-0 z-10 py-1.5 bg-zinc-950/95 backdrop-blur-sm text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500",
							children: e.label
						}), /* @__PURE__ */ v("div", {
							className: "grid gap-1.5",
							style: { gridTemplateColumns: `repeat(auto-fill, minmax(${J}px, 1fr))` },
							children: e.items.map((e) => /* @__PURE__ */ v(x, {
								item: e,
								selected: h[z] === e.id,
								onOpen: () => W(e)
							}, e.id))
						})]
					}, e.key))
				})
			}),
			V && /* @__PURE__ */ v("div", {
				className: "pt-2 flex justify-end shrink-0",
				children: /* @__PURE__ */ v(d, {
					nextPageToken: E.nextPageToken,
					widgetId: i,
					options: o,
					ariaLabel: "Media pages"
				})
			}),
			R && /* @__PURE__ */ v(C, {
				item: R,
				collections: E.collections,
				index: L,
				count: F.length,
				autoplay: o.autoplay_videos === !0,
				loop: o.loop_videos === !0,
				showDetails: o.show_details !== !1,
				onClose: () => P(null),
				onPrevious: () => G(-1),
				onNext: () => G(1),
				onOpenWith: H ? () => {
					w(U(R), {
						native: () => {},
						nativeLabel: R.kind === "video" ? "Native video player" : "Native photo viewer"
					});
				} : void 0
			}, R.id)
		]
	});
}
function x({ item: e, selected: t, onOpen: n }) {
	let r = o(e.durationSeconds);
	return /* @__PURE__ */ y("button", {
		type: "button",
		onClick: n,
		className: `group relative aspect-square overflow-hidden rounded-sm border text-left bg-zinc-900 ${t ? "border-sky-400 ring-1 ring-sky-400/50" : "border-zinc-800 hover:border-zinc-600"}`,
		"aria-label": `Open ${e.kind === "video" ? "video" : "photo"} ${e.title}`,
		title: e.title,
		children: [
			/* @__PURE__ */ v(S, { item: e }),
			/* @__PURE__ */ v("div", {
				className: "absolute inset-x-0 bottom-0 pt-8 pb-1.5 px-2 bg-gradient-to-t from-black/85 to-transparent",
				children: /* @__PURE__ */ v("div", {
					className: "text-[11px] font-medium text-zinc-100 truncate",
					children: e.title
				})
			}),
			/* @__PURE__ */ v("div", {
				className: "absolute top-1.5 left-1.5 flex items-center gap-1",
				children: e.kind === "video" && /* @__PURE__ */ y("span", {
					className: "px-1.5 py-0.5 rounded-sm bg-black/70 text-[9px] uppercase tracking-wider text-zinc-100",
					children: ["▶", r ? ` ${r}` : ""]
				})
			}),
			e.favorite && /* @__PURE__ */ v("span", {
				className: "absolute top-1.5 right-1.5 text-amber-300 drop-shadow",
				"aria-label": "Favorite",
				title: "Favorite",
				children: "★"
			})
		]
	});
}
function S({ item: e }) {
	let [t, n] = g(!1), r = e.thumbnailUrl ?? (e.kind === "image" ? e.url : void 0);
	return !r || t ? /* @__PURE__ */ v("div", {
		className: "absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(63_63_70/0.55),transparent_45%),linear-gradient(135deg,rgb(24_24_27),rgb(9_9_11))]",
		children: /* @__PURE__ */ v("span", {
			className: "text-xl text-zinc-600",
			"aria-hidden": "true",
			children: e.kind === "video" ? "▶" : "▧"
		})
	}) : /* @__PURE__ */ v("img", {
		src: r,
		alt: "",
		loading: "lazy",
		decoding: "async",
		draggable: !1,
		onError: () => n(!0),
		className: "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
	});
}
function C({ item: n, collections: r, index: a, count: s, autoplay: c, loop: l, showDetails: u, onClose: d, onPrevious: f, onNext: p, onOpenWith: m }) {
	let [b, x] = g(!0), [S, C] = g(!1), T = h(null), D = h(null), O = n.collectionIds.map((e) => r.find((t) => t.id === e)?.name ?? e), k = Object.entries(n.metadata).filter(([, e]) => e == null || [
		"string",
		"number",
		"boolean"
	].includes(typeof e)).slice(0, 10);
	e(!0, T, D);
	let A = (e) => {
		e.target === e.currentTarget && d();
	};
	return /* @__PURE__ */ y("div", {
		ref: T,
		className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/98 text-zinc-100",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": n.title,
		tabIndex: -1,
		onClick: A,
		onKeyDown: (e) => {
			t(e, T, !0, d), !e.defaultPrevented && (e.key === "ArrowRight" ? (e.preventDefault(), p()) : e.key === "ArrowLeft" && (e.preventDefault(), f()));
		},
		children: [/* @__PURE__ */ y("div", {
			className: "flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900/95 shrink-0",
			children: [
				/* @__PURE__ */ y("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ v("div", {
						className: "text-sm font-medium truncate",
						children: n.title
					}), /* @__PURE__ */ y("div", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500",
						children: [n.kind, n.favorite ? " · favorite" : ""]
					})]
				}),
				/* @__PURE__ */ y("span", {
					className: "text-xs tabular-nums text-zinc-500",
					children: [
						a + 1,
						" / ",
						s
					]
				}),
				m && /* @__PURE__ */ v("button", {
					type: "button",
					onClick: m,
					className: "text-xs text-zinc-400 hover:text-zinc-100",
					children: "Open with…"
				}),
				/* @__PURE__ */ v("a", {
					href: n.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-xs text-sky-400 hover:text-sky-300",
					children: "Open original"
				}),
				/* @__PURE__ */ v("button", {
					ref: D,
					type: "button",
					onClick: d,
					className: "text-xl leading-none text-zinc-400 hover:text-zinc-100 px-1",
					"aria-label": "Close media viewer",
					children: "×"
				})
			]
		}), /* @__PURE__ */ y("div", {
			className: "flex-1 min-h-0 flex",
			onClick: A,
			children: [/* @__PURE__ */ y("div", {
				className: "relative flex-1 min-w-0 flex items-center justify-center p-4 bg-black/40 overflow-hidden",
				children: [
					b && !S && /* @__PURE__ */ v("div", {
						className: "absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-wider text-zinc-600",
						children: "Loading media…"
					}),
					S ? /* @__PURE__ */ y("div", {
						className: "flex flex-col items-center gap-2 text-sm text-zinc-500",
						children: [/* @__PURE__ */ v("span", { children: "Preview unavailable" }), /* @__PURE__ */ v("a", {
							href: n.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-xs text-sky-400 hover:text-sky-300",
							children: "Open original"
						})]
					}) : n.kind === "video" ? /* @__PURE__ */ v("video", {
						src: n.url,
						poster: n.thumbnailUrl,
						controls: !0,
						autoPlay: c,
						loop: l,
						playsInline: !0,
						preload: "metadata",
						onLoadedMetadata: () => x(!1),
						onError: () => {
							x(!1), C(!0);
						},
						className: "max-w-full max-h-full bg-black shadow-2xl"
					}) : /* @__PURE__ */ v("img", {
						src: n.url,
						alt: n.title,
						decoding: "async",
						onLoad: () => x(!1),
						onError: () => {
							x(!1), C(!0);
						},
						className: "max-w-full max-h-full object-contain shadow-2xl"
					}),
					s > 1 && /* @__PURE__ */ y(_, { children: [/* @__PURE__ */ v("button", {
						type: "button",
						onClick: f,
						className: "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white",
						"aria-label": "Previous media",
						title: "Previous (←)",
						children: "‹"
					}), /* @__PURE__ */ v("button", {
						type: "button",
						onClick: p,
						className: "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white",
						"aria-label": "Next media",
						title: "Next (→)",
						children: "›"
					})] })
				]
			}), u && /* @__PURE__ */ y("aside", {
				className: "hidden lg:block w-72 xl:w-80 shrink-0 border-l border-zinc-800 bg-zinc-900/70 p-4 overflow-auto",
				children: [
					/* @__PURE__ */ v("div", {
						className: "text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-4",
						children: "Details"
					}),
					/* @__PURE__ */ y("dl", {
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ v(w, {
								label: "Captured",
								value: i(n.capturedAt ?? n.createdAt)
							}),
							/* @__PURE__ */ v(w, {
								label: "Type",
								value: n.contentType ?? n.kind
							}),
							/* @__PURE__ */ v(w, {
								label: "Dimensions",
								value: n.width && n.height ? `${n.width.toLocaleString()} × ${n.height.toLocaleString()}` : void 0
							}),
							/* @__PURE__ */ v(w, {
								label: "Duration",
								value: o(n.durationSeconds)
							}),
							/* @__PURE__ */ v(w, {
								label: "Collections",
								value: O.length > 0 ? O.join(", ") : void 0
							}),
							k.map(([e, t]) => /* @__PURE__ */ v(w, {
								label: E(e),
								value: t == null ? "—" : String(t)
							}, e))
						]
					}),
					n.description && /* @__PURE__ */ v("p", {
						className: "mt-5 text-xs leading-relaxed text-zinc-400",
						children: n.description
					}),
					n.tags.length > 0 && /* @__PURE__ */ v("div", {
						className: "mt-5 flex flex-wrap gap-1",
						children: n.tags.map((e) => /* @__PURE__ */ v("span", {
							className: "px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400",
							children: e
						}, e))
					})
				]
			})]
		})]
	});
}
function w({ label: e, value: t }) {
	return t ? /* @__PURE__ */ y("div", { children: [/* @__PURE__ */ v("dt", {
		className: "text-[9px] uppercase tracking-wider text-zinc-600",
		children: e
	}), /* @__PURE__ */ v("dd", {
		className: "mt-0.5 text-zinc-300 break-words",
		children: t
	})] }) : null;
}
function T(e) {
	return e.replace(/[^a-zA-Z0-9_-]/g, "-");
}
function E(e) {
	return e.replace(/[_-]+/g, " ");
}
//#endregion
export { b as MediaGalleryImpl };
