import { t as e } from "./states-BJ0AAwxU.js";
import { n as t } from "./DashboardContext-BKgLoCrb.js";
import { a as n, i as r, n as i, r as a, t as o } from "./mediaShape-BR7XYFoe.js";
import { useCallback as s, useEffect as c, useMemo as l, useRef as u, useState as d } from "react";
import { Fragment as f, jsx as p, jsxs as m } from "react/jsx-runtime";
//#region src/widgets/MediaGalleryImpl.tsx
function h({ data: i, options: a }) {
	let u = a ?? {}, { ctx: f, setCtx: h } = t(), _ = l(() => n(i), [i]), [y, x] = d(""), [S, C] = d("all"), [w, T] = d("all"), [E, D] = d(null), O = l(() => o(_.items, {
		query: y,
		kind: S,
		collectionId: w
	}), [
		w,
		S,
		_.items,
		y
	]), k = l(() => r(O, u.group_by ?? "day"), [O, u.group_by]), A = E == null ? -1 : O.findIndex((e) => e.id === E), j = A >= 0 ? O[A] : void 0, M = u.media_context?.key ?? "media_id", N = u.media_context?.kind_key ?? "media_kind", P = s((e) => {
		for (let [t, n] of Object.entries(e.context)) h(t, n);
		M in e.context || h(M, e.id), N in e.context || h(N, e.kind), D(e.id);
	}, [
		M,
		N,
		h
	]), F = s((e) => {
		if (O.length < 2 || A < 0) return;
		let t = (A + e + O.length) % O.length;
		P(O[t]);
	}, [
		O,
		P,
		A
	]);
	if (c(() => {
		E && !_.items.some((e) => e.id === E) && D(null);
	}, [_.items, E]), c(() => {
		if (!j) return;
		let e = (e) => {
			e.key === "Escape" ? (e.preventDefault(), e.stopPropagation(), D(null)) : e.key === "ArrowRight" ? (e.preventDefault(), e.stopPropagation(), F(1)) : e.key === "ArrowLeft" && (e.preventDefault(), e.stopPropagation(), F(-1));
		};
		return window.addEventListener("keydown", e, !0), () => window.removeEventListener("keydown", e, !0);
	}, [F, j]), _.items.length === 0) return /* @__PURE__ */ p(e, { children: "No photos or videos" });
	let I = _.items.some((e) => e.favorite), L = u.kind_filter !== !1, R = u.density === "compact" ? 104 : 142;
	return /* @__PURE__ */ m("div", {
		className: "h-full min-h-0 flex flex-col relative",
		children: [
			/* @__PURE__ */ m("div", {
				className: "flex flex-col gap-2 pb-2 border-b border-zinc-800 shrink-0",
				children: [/* @__PURE__ */ m("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [u.search !== !1 && /* @__PURE__ */ p("input", {
						type: "search",
						value: y,
						onChange: (e) => x(e.target.value),
						placeholder: "Search media…",
						"aria-label": "Search media",
						className: "min-w-0 flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600"
					}), u.collection_filter !== !1 && _.collections.length > 0 && /* @__PURE__ */ m("select", {
						value: w,
						onChange: (e) => T(e.target.value),
						"aria-label": "Filter by collection",
						className: "max-w-[12rem] bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-600",
						children: [/* @__PURE__ */ p("option", {
							value: "all",
							children: "All collections"
						}), _.collections.map((e) => /* @__PURE__ */ m("option", {
							value: e.id,
							children: [e.name, e.itemCount == null ? "" : ` (${e.itemCount})`]
						}, e.id))]
					})]
				}), L && /* @__PURE__ */ p("div", {
					className: "flex items-center gap-1 overflow-x-auto pb-0.5",
					children: [
						["all", "All"],
						["image", "Photos"],
						["video", "Videos"],
						...I ? [["favorite", "Favorites"]] : []
					].map(([e, t]) => /* @__PURE__ */ p("button", {
						type: "button",
						onClick: () => C(e),
						"aria-pressed": S === e,
						className: `px-2 py-1 rounded text-[10px] uppercase tracking-wider whitespace-nowrap border ${S === e ? "bg-sky-500/15 text-sky-300 border-sky-500/30" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-200"}`,
						children: t
					}, e))
				})]
			}),
			/* @__PURE__ */ m("div", {
				className: "flex items-center justify-between py-1.5 text-[10px] uppercase tracking-wider text-zinc-600 shrink-0",
				children: [/* @__PURE__ */ m("span", { children: [O.length.toLocaleString(), " shown"] }), _.total != null && /* @__PURE__ */ m("span", { children: [_.total.toLocaleString(), " total"] })]
			}),
			/* @__PURE__ */ p("div", {
				className: "flex-1 min-h-0 overflow-auto pr-1",
				children: O.length === 0 ? /* @__PURE__ */ p(e, { children: "No matching media" }) : /* @__PURE__ */ p("div", {
					className: "space-y-4 pb-1",
					children: k.map((e) => /* @__PURE__ */ m("section", {
						"aria-labelledby": `media-group-${b(e.key)}`,
						children: [(u.group_by ?? "day") !== "none" && /* @__PURE__ */ p("div", {
							id: `media-group-${b(e.key)}`,
							className: "sticky top-0 z-10 py-1.5 bg-zinc-950/95 backdrop-blur-sm text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500",
							children: e.label
						}), /* @__PURE__ */ p("div", {
							className: "grid gap-1.5",
							style: { gridTemplateColumns: `repeat(auto-fill, minmax(${R}px, 1fr))` },
							children: e.items.map((e) => /* @__PURE__ */ p(g, {
								item: e,
								selected: f[M] === e.id,
								onOpen: () => P(e)
							}, e.id))
						})]
					}, e.key))
				})
			}),
			j && /* @__PURE__ */ p(v, {
				item: j,
				collections: _.collections,
				index: A,
				count: O.length,
				autoplay: u.autoplay_videos === !0,
				loop: u.loop_videos === !0,
				showDetails: u.show_details !== !1,
				onClose: () => D(null),
				onPrevious: () => F(-1),
				onNext: () => F(1)
			}, j.id)
		]
	});
}
function g({ item: e, selected: t, onOpen: n }) {
	let r = a(e.durationSeconds);
	return /* @__PURE__ */ m("button", {
		type: "button",
		onClick: n,
		className: `group relative aspect-square overflow-hidden rounded-sm border text-left bg-zinc-900 ${t ? "border-sky-400 ring-1 ring-sky-400/50" : "border-zinc-800 hover:border-zinc-600"}`,
		"aria-label": `Open ${e.kind === "video" ? "video" : "photo"} ${e.title}`,
		title: e.title,
		children: [
			/* @__PURE__ */ p(_, { item: e }),
			/* @__PURE__ */ p("div", {
				className: "absolute inset-x-0 bottom-0 pt-8 pb-1.5 px-2 bg-gradient-to-t from-black/85 to-transparent",
				children: /* @__PURE__ */ p("div", {
					className: "text-[11px] font-medium text-zinc-100 truncate",
					children: e.title
				})
			}),
			/* @__PURE__ */ p("div", {
				className: "absolute top-1.5 left-1.5 flex items-center gap-1",
				children: e.kind === "video" && /* @__PURE__ */ m("span", {
					className: "px-1.5 py-0.5 rounded-sm bg-black/70 text-[9px] uppercase tracking-wider text-zinc-100",
					children: ["▶", r ? ` ${r}` : ""]
				})
			}),
			e.favorite && /* @__PURE__ */ p("span", {
				className: "absolute top-1.5 right-1.5 text-amber-300 drop-shadow",
				"aria-label": "Favorite",
				title: "Favorite",
				children: "★"
			})
		]
	});
}
function _({ item: e }) {
	let [t, n] = d(!1), r = e.thumbnailUrl ?? (e.kind === "image" ? e.url : void 0);
	return !r || t ? /* @__PURE__ */ p("div", {
		className: "absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgb(63_63_70/0.55),transparent_45%),linear-gradient(135deg,rgb(24_24_27),rgb(9_9_11))]",
		children: /* @__PURE__ */ p("span", {
			className: "text-xl text-zinc-600",
			"aria-hidden": "true",
			children: e.kind === "video" ? "▶" : "▧"
		})
	}) : /* @__PURE__ */ p("img", {
		src: r,
		alt: "",
		loading: "lazy",
		decoding: "async",
		draggable: !1,
		onError: () => n(!0),
		className: "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
	});
}
function v({ item: e, collections: t, index: n, count: r, autoplay: o, loop: s, showDetails: l, onClose: h, onPrevious: g, onNext: _ }) {
	let [v, b] = d(!0), [S, C] = d(!1), w = u(null), T = e.collectionIds.map((e) => t.find((t) => t.id === e)?.name ?? e), E = Object.entries(e.metadata).filter(([, e]) => e == null || [
		"string",
		"number",
		"boolean"
	].includes(typeof e)).slice(0, 10);
	c(() => {
		w.current?.focus();
	}, []);
	let D = (e) => {
		e.target === e.currentTarget && h();
	};
	return /* @__PURE__ */ m("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/98 text-zinc-100",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": e.title,
		onClick: D,
		children: [/* @__PURE__ */ m("div", {
			className: "flex items-center gap-3 px-4 py-2 border-b border-zinc-800 bg-zinc-900/95 shrink-0",
			children: [
				/* @__PURE__ */ m("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ p("div", {
						className: "text-sm font-medium truncate",
						children: e.title
					}), /* @__PURE__ */ m("div", {
						className: "text-[10px] uppercase tracking-wider text-zinc-500",
						children: [e.kind, e.favorite ? " · favorite" : ""]
					})]
				}),
				/* @__PURE__ */ m("span", {
					className: "text-xs tabular-nums text-zinc-500",
					children: [
						n + 1,
						" / ",
						r
					]
				}),
				/* @__PURE__ */ p("a", {
					href: e.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-xs text-sky-400 hover:text-sky-300",
					children: "Open original"
				}),
				/* @__PURE__ */ p("button", {
					ref: w,
					type: "button",
					onClick: h,
					className: "text-xl leading-none text-zinc-400 hover:text-zinc-100 px-1",
					"aria-label": "Close media viewer",
					children: "×"
				})
			]
		}), /* @__PURE__ */ m("div", {
			className: "flex-1 min-h-0 flex",
			onClick: D,
			children: [/* @__PURE__ */ m("div", {
				className: "relative flex-1 min-w-0 flex items-center justify-center p-4 bg-black/40 overflow-hidden",
				children: [
					v && !S && /* @__PURE__ */ p("div", {
						className: "absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-wider text-zinc-600",
						children: "Loading media…"
					}),
					S ? /* @__PURE__ */ m("div", {
						className: "flex flex-col items-center gap-2 text-sm text-zinc-500",
						children: [/* @__PURE__ */ p("span", { children: "Preview unavailable" }), /* @__PURE__ */ p("a", {
							href: e.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-xs text-sky-400 hover:text-sky-300",
							children: "Open original"
						})]
					}) : e.kind === "video" ? /* @__PURE__ */ p("video", {
						src: e.url,
						poster: e.thumbnailUrl,
						controls: !0,
						autoPlay: o,
						loop: s,
						playsInline: !0,
						preload: "metadata",
						onLoadedMetadata: () => b(!1),
						onError: () => {
							b(!1), C(!0);
						},
						className: "max-w-full max-h-full bg-black shadow-2xl"
					}) : /* @__PURE__ */ p("img", {
						src: e.url,
						alt: e.title,
						decoding: "async",
						onLoad: () => b(!1),
						onError: () => {
							b(!1), C(!0);
						},
						className: "max-w-full max-h-full object-contain shadow-2xl"
					}),
					r > 1 && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("button", {
						type: "button",
						onClick: g,
						className: "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white",
						"aria-label": "Previous media",
						title: "Previous (←)",
						children: "‹"
					}), /* @__PURE__ */ p("button", {
						type: "button",
						onClick: _,
						className: "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-12 rounded-sm bg-black/55 text-zinc-300 hover:bg-black/80 hover:text-white",
						"aria-label": "Next media",
						title: "Next (→)",
						children: "›"
					})] })
				]
			}), l && /* @__PURE__ */ m("aside", {
				className: "hidden lg:block w-72 xl:w-80 shrink-0 border-l border-zinc-800 bg-zinc-900/70 p-4 overflow-auto",
				children: [
					/* @__PURE__ */ p("div", {
						className: "text-[10px] uppercase tracking-[0.14em] text-zinc-500 mb-4",
						children: "Details"
					}),
					/* @__PURE__ */ m("dl", {
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ p(y, {
								label: "Captured",
								value: i(e.capturedAt ?? e.createdAt)
							}),
							/* @__PURE__ */ p(y, {
								label: "Type",
								value: e.contentType ?? e.kind
							}),
							/* @__PURE__ */ p(y, {
								label: "Dimensions",
								value: e.width && e.height ? `${e.width.toLocaleString()} × ${e.height.toLocaleString()}` : void 0
							}),
							/* @__PURE__ */ p(y, {
								label: "Duration",
								value: a(e.durationSeconds)
							}),
							/* @__PURE__ */ p(y, {
								label: "Collections",
								value: T.length > 0 ? T.join(", ") : void 0
							}),
							E.map(([e, t]) => /* @__PURE__ */ p(y, {
								label: x(e),
								value: t == null ? "—" : String(t)
							}, e))
						]
					}),
					e.description && /* @__PURE__ */ p("p", {
						className: "mt-5 text-xs leading-relaxed text-zinc-400",
						children: e.description
					}),
					e.tags.length > 0 && /* @__PURE__ */ p("div", {
						className: "mt-5 flex flex-wrap gap-1",
						children: e.tags.map((e) => /* @__PURE__ */ p("span", {
							className: "px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400",
							children: e
						}, e))
					})
				]
			})]
		})]
	});
}
function y({ label: e, value: t }) {
	return t ? /* @__PURE__ */ m("div", { children: [/* @__PURE__ */ p("dt", {
		className: "text-[9px] uppercase tracking-wider text-zinc-600",
		children: e
	}), /* @__PURE__ */ p("dd", {
		className: "mt-0.5 text-zinc-300 break-words",
		children: t
	})] }) : null;
}
function b(e) {
	return e.replace(/[^a-zA-Z0-9_-]/g, "-");
}
function x(e) {
	return e.replace(/[_-]+/g, " ");
}
//#endregion
export { h as MediaGalleryImpl };
