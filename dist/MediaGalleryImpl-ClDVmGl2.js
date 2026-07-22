import { t as e } from "./states-C06aUH_Z.js";
import { n as t } from "./DashboardContext-65LG4CII.js";
import { a as n, i as r, n as i, r as a, t as o } from "./mediaShape-BR7XYFoe.js";
import { n as s, t as c } from "./CursorPager-ByrL0U0d.js";
import { useCallback as l, useEffect as u, useMemo as d, useRef as f, useState as p } from "react";
import { Fragment as m, jsx as h, jsxs as g } from "react/jsx-runtime";
//#region src/widgets/MediaGalleryImpl.tsx
function _({ data: i, options: a, widgetId: f }) {
	let m = a ?? {}, { ctx: _, setCtx: y } = t(), x = d(() => n(i), [i]), [C, w] = p(""), [T, E] = p("all"), [D, O] = p("all"), [k, A] = p(null), j = d(() => o(x.items, {
		query: C,
		kind: T,
		collectionId: D
	}), [
		D,
		T,
		x.items,
		C
	]), M = d(() => r(j, m.group_by ?? "day"), [j, m.group_by]), N = k == null ? -1 : j.findIndex((e) => e.id === k), P = N >= 0 ? j[N] : void 0, F = m.media_context?.key ?? "media_id", I = m.media_context?.kind_key ?? "media_kind", L = !!x.nextPageToken || !!_[s(f, m)], R = l((e) => {
		for (let [t, n] of Object.entries(e.context)) y(t, n);
		F in e.context || y(F, e.id), I in e.context || y(I, e.kind), A(e.id);
	}, [
		F,
		I,
		y
	]), z = l((e) => {
		if (j.length < 2 || N < 0) return;
		let t = (N + e + j.length) % j.length;
		R(j[t]);
	}, [
		j,
		R,
		N
	]);
	u(() => {
		k && !x.items.some((e) => e.id === k) && A(null);
	}, [x.items, k]), u(() => {
		if (!P) return;
		let e = (e) => {
			e.key === "Escape" ? (e.preventDefault(), e.stopPropagation(), A(null)) : e.key === "ArrowRight" ? (e.preventDefault(), e.stopPropagation(), z(1)) : e.key === "ArrowLeft" && (e.preventDefault(), e.stopPropagation(), z(-1));
		};
		return window.addEventListener("keydown", e, !0), () => window.removeEventListener("keydown", e, !0);
	}, [z, P]);
	let B = x.items.some((e) => e.favorite), V = m.kind_filter !== !1, H = m.density === "compact" ? 104 : 142;
	return /* @__PURE__ */ g("div", {
		className: "h-full min-h-0 flex flex-col relative",
		children: [
			/* @__PURE__ */ g("div", {
				className: "flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0",
				children: [/* @__PURE__ */ g("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [m.search !== !1 && /* @__PURE__ */ h("input", {
						type: "search",
						value: C,
						onChange: (e) => w(e.target.value),
						placeholder: "Search media…",
						"aria-label": "Search media",
						className: "min-w-0 flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
					}), m.collection_filter !== !1 && x.collections.length > 0 && /* @__PURE__ */ g("select", {
						value: D,
						onChange: (e) => O(e.target.value),
						"aria-label": "Filter by collection",
						className: "max-w-[12rem] bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-600",
						children: [/* @__PURE__ */ h("option", {
							value: "all",
							children: "All collections"
						}), x.collections.map((e) => /* @__PURE__ */ g("option", {
							value: e.id,
							children: [e.name, e.itemCount == null ? "" : ` (${e.itemCount})`]
						}, e.id))]
					})]
				}), V && /* @__PURE__ */ h("div", {
					className: "flex items-center gap-1 overflow-x-auto pb-0.5",
					children: [
						["all", "All"],
						["image", "Photos"],
						["video", "Videos"],
						...B ? [["favorite", "Favorites"]] : []
					].map(([e, t]) => /* @__PURE__ */ h("button", {
						type: "button",
						onClick: () => E(e),
						"aria-pressed": T === e,
						className: `px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap border ${T === e ? "bg-sky-500/15 text-sky-300 border-sky-500/30" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-200"}`,
						children: t
					}, e))
				})]
			}),
			/* @__PURE__ */ g("div", {
				className: "flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-600 shrink-0",
				children: [/* @__PURE__ */ g("span", { children: [j.length.toLocaleString(), " shown"] }), x.total != null && /* @__PURE__ */ g("span", { children: [x.total.toLocaleString(), " total"] })]
			}),
			/* @__PURE__ */ h("div", {
				className: "flex-1 min-h-0 overflow-auto pr-1",
				children: x.items.length === 0 ? /* @__PURE__ */ h(e, { children: "No photos or videos" }) : j.length === 0 ? /* @__PURE__ */ h(e, { children: "No matching media" }) : /* @__PURE__ */ h("div", {
					className: "space-y-4 pb-1",
					children: M.map((e) => /* @__PURE__ */ g("section", {
						"aria-labelledby": `media-group-${S(e.key)}`,
						children: [(m.group_by ?? "day") !== "none" && /* @__PURE__ */ h("div", {
							id: `media-group-${S(e.key)}`,
							className: "sticky top-0 z-10 py-1.5 bg-zinc-950/95 backdrop-blur-sm text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500",
							children: e.label
						}), /* @__PURE__ */ h("div", {
							className: "grid gap-1.5",
							style: { gridTemplateColumns: `repeat(auto-fill, minmax(${H}px, 1fr))` },
							children: e.items.map((e) => /* @__PURE__ */ h(v, {
								item: e,
								selected: _[F] === e.id,
								onOpen: () => R(e)
							}, e.id))
						})]
					}, e.key))
				})
			}),
			L && /* @__PURE__ */ h("div", {
				className: "pt-2 flex justify-end shrink-0",
				children: /* @__PURE__ */ h(c, {
					nextPageToken: x.nextPageToken,
					widgetId: f,
					options: m,
					ariaLabel: "Media pages"
				})
			}),
			P && /* @__PURE__ */ h(b, {
				item: P,
				collections: x.collections,
				index: N,
				count: j.length,
				autoplay: m.autoplay_videos === !0,
				loop: m.loop_videos === !0,
				showDetails: m.show_details !== !1,
				onClose: () => A(null),
				onPrevious: () => z(-1),
				onNext: () => z(1)
			}, P.id)
		]
	});
}
function v({ item: e, selected: t, onOpen: n }) {
	let r = a(e.durationSeconds);
	return /* @__PURE__ */ g("button", {
		type: "button",
		onClick: n,
		className: `group relative aspect-square overflow-hidden rounded-sm border text-left bg-zinc-900 ${t ? "border-sky-400 ring-1 ring-sky-400/50" : "border-zinc-800 hover:border-zinc-600"}`,
		"aria-label": `Open ${e.kind === "video" ? "video" : "photo"} ${e.title}`,
		title: e.title,
		children: [
			/* @__PURE__ */ h(y, { item: e }),
			/* @__PURE__ */ h("div", {
				className: "absolute inset-x-0 bottom-0 pt-8 pb-1.5 px-2 bg-gradient-to-t from-black/85 to-transparent",
				children: /* @__PURE__ */ h("div", {
					className: "text-[11px] font-medium text-zinc-100 truncate",
					children: e.title
				})
			}),
			/* @__PURE__ */ h("div", {
				className: "absolute top-1.5 left-1.5 flex items-center gap-1",
				children: e.kind === "video" && /* @__PURE__ */ g("span", {
					className: "px-1.5 py-0.5 rounded-sm bg-black/70 text-[9px] uppercase tracking-wider text-zinc-100",
					children: ["▶", r ? ` ${r}` : ""]
				})
			}),
			e.favorite && /* @__PURE__ */ h("span", {
				className: "absolute top-1.5 right-1.5 text-amber-300 drop-shadow",
				"aria-label": "Favorite",
				title: "Favorite",
				children: "★"
			})
		]
	});
}
function y({ item: e }) {
	let [t, n] = p(!1), r = e.thumbnailUrl ?? (e.kind === "image" ? e.url : void 0);
	return !r || t ? /* @__PURE__ */ h("div", {
		className: "absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(63_63_70/0.55),transparent_45%),linear-gradient(135deg,rgb(24_24_27),rgb(9_9_11))]",
		children: /* @__PURE__ */ h("span", {
			className: "text-xl text-zinc-600",
			"aria-hidden": "true",
			children: e.kind === "video" ? "▶" : "▧"
		})
	}) : /* @__PURE__ */ h("img", {
		src: r,
		alt: "",
		loading: "lazy",
		decoding: "async",
		draggable: !1,
		onError: () => n(!0),
		className: "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
	});
}
function b({ item: e, collections: t, index: n, count: r, autoplay: o, loop: s, showDetails: c, onClose: l, onPrevious: d, onNext: _ }) {
	let [v, y] = p(!0), [b, S] = p(!1), w = f(null), T = e.collectionIds.map((e) => t.find((t) => t.id === e)?.name ?? e), E = Object.entries(e.metadata).filter(([, e]) => e == null || [
		"string",
		"number",
		"boolean"
	].includes(typeof e)).slice(0, 10);
	u(() => {
		w.current?.focus();
	}, []);
	let D = (e) => {
		e.target === e.currentTarget && l();
	};
	return /* @__PURE__ */ g("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/98 text-zinc-100",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": e.title,
		onClick: D,
		children: [/* @__PURE__ */ g("div", {
			className: "flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900/95 shrink-0",
			children: [
				/* @__PURE__ */ g("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ h("div", {
						className: "text-sm font-medium truncate",
						children: e.title
					}), /* @__PURE__ */ g("div", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500",
						children: [e.kind, e.favorite ? " · favorite" : ""]
					})]
				}),
				/* @__PURE__ */ g("span", {
					className: "text-xs tabular-nums text-zinc-500",
					children: [
						n + 1,
						" / ",
						r
					]
				}),
				/* @__PURE__ */ h("a", {
					href: e.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-xs text-sky-400 hover:text-sky-300",
					children: "Open original"
				}),
				/* @__PURE__ */ h("button", {
					ref: w,
					type: "button",
					onClick: l,
					className: "text-xl leading-none text-zinc-400 hover:text-zinc-100 px-1",
					"aria-label": "Close media viewer",
					children: "×"
				})
			]
		}), /* @__PURE__ */ g("div", {
			className: "flex-1 min-h-0 flex",
			onClick: D,
			children: [/* @__PURE__ */ g("div", {
				className: "relative flex-1 min-w-0 flex items-center justify-center p-4 bg-black/40 overflow-hidden",
				children: [
					v && !b && /* @__PURE__ */ h("div", {
						className: "absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-wider text-zinc-600",
						children: "Loading media…"
					}),
					b ? /* @__PURE__ */ g("div", {
						className: "flex flex-col items-center gap-2 text-sm text-zinc-500",
						children: [/* @__PURE__ */ h("span", { children: "Preview unavailable" }), /* @__PURE__ */ h("a", {
							href: e.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-xs text-sky-400 hover:text-sky-300",
							children: "Open original"
						})]
					}) : e.kind === "video" ? /* @__PURE__ */ h("video", {
						src: e.url,
						poster: e.thumbnailUrl,
						controls: !0,
						autoPlay: o,
						loop: s,
						playsInline: !0,
						preload: "metadata",
						onLoadedMetadata: () => y(!1),
						onError: () => {
							y(!1), S(!0);
						},
						className: "max-w-full max-h-full bg-black shadow-2xl"
					}) : /* @__PURE__ */ h("img", {
						src: e.url,
						alt: e.title,
						decoding: "async",
						onLoad: () => y(!1),
						onError: () => {
							y(!1), S(!0);
						},
						className: "max-w-full max-h-full object-contain shadow-2xl"
					}),
					r > 1 && /* @__PURE__ */ g(m, { children: [/* @__PURE__ */ h("button", {
						type: "button",
						onClick: d,
						className: "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white",
						"aria-label": "Previous media",
						title: "Previous (←)",
						children: "‹"
					}), /* @__PURE__ */ h("button", {
						type: "button",
						onClick: _,
						className: "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white",
						"aria-label": "Next media",
						title: "Next (→)",
						children: "›"
					})] })
				]
			}), c && /* @__PURE__ */ g("aside", {
				className: "hidden lg:block w-72 xl:w-80 shrink-0 border-l border-zinc-800 bg-zinc-900/70 p-4 overflow-auto",
				children: [
					/* @__PURE__ */ h("div", {
						className: "text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-4",
						children: "Details"
					}),
					/* @__PURE__ */ g("dl", {
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ h(x, {
								label: "Captured",
								value: i(e.capturedAt ?? e.createdAt)
							}),
							/* @__PURE__ */ h(x, {
								label: "Type",
								value: e.contentType ?? e.kind
							}),
							/* @__PURE__ */ h(x, {
								label: "Dimensions",
								value: e.width && e.height ? `${e.width.toLocaleString()} × ${e.height.toLocaleString()}` : void 0
							}),
							/* @__PURE__ */ h(x, {
								label: "Duration",
								value: a(e.durationSeconds)
							}),
							/* @__PURE__ */ h(x, {
								label: "Collections",
								value: T.length > 0 ? T.join(", ") : void 0
							}),
							E.map(([e, t]) => /* @__PURE__ */ h(x, {
								label: C(e),
								value: t == null ? "—" : String(t)
							}, e))
						]
					}),
					e.description && /* @__PURE__ */ h("p", {
						className: "mt-5 text-xs leading-relaxed text-zinc-400",
						children: e.description
					}),
					e.tags.length > 0 && /* @__PURE__ */ h("div", {
						className: "mt-5 flex flex-wrap gap-1",
						children: e.tags.map((e) => /* @__PURE__ */ h("span", {
							className: "px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400",
							children: e
						}, e))
					})
				]
			})]
		})]
	});
}
function x({ label: e, value: t }) {
	return t ? /* @__PURE__ */ g("div", { children: [/* @__PURE__ */ h("dt", {
		className: "text-[9px] uppercase tracking-wider text-zinc-600",
		children: e
	}), /* @__PURE__ */ h("dd", {
		className: "mt-0.5 text-zinc-300 break-words",
		children: t
	})] }) : null;
}
function S(e) {
	return e.replace(/[^a-zA-Z0-9_-]/g, "-");
}
function C(e) {
	return e.replace(/[_-]+/g, " ");
}
//#endregion
export { _ as MediaGalleryImpl };
