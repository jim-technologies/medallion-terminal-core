import { i as e, n as t } from "./utils-B2QVXvLO.js";
import { Component as n, Suspense as r, createContext as i, useCallback as a, useContext as o, useMemo as s, useRef as c, useState as l } from "react";
import { jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/core/ErrorBoundary.tsx
var f = class extends n {
	state = { error: null };
	static getDerivedStateFromError(e) {
		return { error: e };
	}
	componentDidCatch(e, t) {
		console.error("[MedallionTerminal] Widget error:", e, t.componentStack), this.props.onError?.(e);
	}
	render() {
		return this.state.error ? /* @__PURE__ */ u("div", {
			className: "flex items-center justify-center h-full text-red-400/80 text-sm p-4 text-center",
			children: /* @__PURE__ */ d("div", { children: [/* @__PURE__ */ u("div", {
				className: "font-medium mb-1",
				children: "Widget Error"
			}), /* @__PURE__ */ u("div", {
				className: "text-zinc-500 text-xs",
				children: this.state.error.message
			})] })
		}) : this.props.children;
	}
}, p = Object.freeze({}), m = 32, h = 128;
function g(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function _(e, t = 256) {
	if (typeof e != "string") return;
	let n = e.trim();
	return n ? n.slice(0, t) : void 0;
}
function v(e, t = 64) {
	if (!Array.isArray(e)) return;
	let n = [...new Set(e.map((e) => _(e, 128)).filter((e) => !!e))].slice(0, t);
	return n.length > 0 ? n : void 0;
}
function y(e) {
	return (e ?? "").split(";", 1)[0].trim().toLowerCase();
}
function b(e) {
	return (e ?? "").trim().toLowerCase();
}
function x(e, t) {
	if (!e || e.length === 0) return !0;
	let n = y(t);
	return n ? e.some((e) => {
		let t = y(e);
		return t === "*/*" || t === "*" ? !0 : t.endsWith("/*") ? n.startsWith(t.slice(0, -1)) : t === n;
	}) : !1;
}
function S(e, t) {
	if (!e || e.length === 0) return !0;
	let n = b(t);
	return n ? e.some((e) => {
		let t = b(e);
		return t === "*" || t === n;
	}) : !1;
}
function C(e, t) {
	return (!e.intents || e.intents.length === 0 || e.intents.includes(t.intent)) && x(e.accepts, t.asset.contentType) && S(e.acceptsKinds, t.asset.kind);
}
function w(e, t) {
	let n = g(e) ? e : {}, r = Array.isArray(n.applications) ? n.applications : [], i = [], a = /* @__PURE__ */ new Set();
	for (let e of r.slice(0, h)) {
		if (i.length >= m) break;
		if (!g(e)) continue;
		let n = _(e.id, 128), r = _(e.name, 128), o = _(e.renderer, 128);
		if (!n || !r || !o || a.has(n)) continue;
		let s = {
			id: n,
			name: r,
			renderer: o,
			description: _(e.description, 512),
			icon: _(e.icon, 8),
			accepts: v(e.accepts),
			acceptsKinds: v(e.acceptsKinds ?? e.accepts_kinds),
			intents: v(e.intents),
			launchContext: e.launchContext
		};
		C(s, t) && (a.add(n), i.push(s));
	}
	let o = _(n.preferredApplicationId, 128);
	return {
		applications: i,
		preferredApplicationId: o && a.has(o) ? o : void 0
	};
}
function T(e, t = {}) {
	let n = e.preferredApplicationId ? e.applications.find((t) => t.id === e.preferredApplicationId) : void 0;
	return n ? {
		kind: "application",
		application: n
	} : t.native ? { kind: "native" } : e.applications.length === 1 ? {
		kind: "application",
		application: e.applications[0]
	} : e.applications.length > 1 ? { kind: "choose" } : t.download ? { kind: "download" } : { kind: "none" };
}
function E(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
}
async function D(e) {
	e.native ? await e.native() : e.download && await e.download();
}
var O = i({
	available: !1,
	openAsset: async (e, t = {}) => D(t),
	openWith: async (e, t = {}) => D(t)
});
function k() {
	return o(O);
}
function A({ children: e, resolveAssetIntent: t, renderers: n = p, applicationFrame: r = P, savePreference: i, onError: o }) {
	let [m, h] = l(null), g = c(0), _ = c(!1), v = a((e, t) => {
		let n = e instanceof Error ? e : Error(String(e));
		o ? o(n, t) : console.error("[MedallionTerminal] Asset open error:", n);
	}, [o]), y = a(() => {
		g.current += 1, _.current = !1, h(null);
	}, []), b = a((e, t) => {
		let r = w(e, t), i = r.applications.filter((e) => E(n, e.renderer) ? !0 : (v(/* @__PURE__ */ Error(`Asset application "${e.name}" requested unregistered renderer "${e.renderer}"`), t), !1));
		return {
			applications: i,
			preferredApplicationId: i.some((e) => e.id === r.preferredApplicationId) ? r.preferredApplicationId : void 0
		};
	}, [n, v]), x = a(async (e, t, n) => {
		h(null);
		try {
			e === "native" ? await n.native?.() : await n.download?.();
		} catch (e) {
			v(e, t);
		}
	}, [v]), S = a(async (e, r, i = {}) => {
		let a = ++g.current;
		if (_.current = !1, !t) {
			if (e === "choose") h({
				kind: "choosing",
				session: {
					request: r,
					resolution: { applications: [] },
					fallbacks: i
				}
			});
			else try {
				await D(i);
			} catch (e) {
				v(e, r);
			}
			return;
		}
		h({
			kind: "resolving",
			request: r
		});
		let o;
		try {
			o = b(await t(r), r);
		} catch (t) {
			if (a !== g.current) return;
			if (v(t, r), e === "choose") h({
				kind: "choosing",
				session: {
					request: r,
					resolution: { applications: [] },
					fallbacks: i
				}
			});
			else {
				h(null);
				try {
					await D(i);
				} catch (e) {
					v(e, r);
				}
			}
			return;
		}
		if (a !== g.current) return;
		let s = {
			request: r,
			resolution: o,
			fallbacks: i
		};
		if (e === "choose") {
			h({
				kind: "choosing",
				session: s
			});
			return;
		}
		let c = T(o, i);
		if (c.kind === "application") {
			let e = E(n, c.application.renderer);
			if (!e) {
				h(null), v(/* @__PURE__ */ Error(`Renderer "${c.application.renderer}" is no longer registered`), r);
				return;
			}
			h({
				kind: "running",
				session: s,
				application: c.application,
				renderer: e
			});
		} else c.kind === "choose" ? h({
			kind: "choosing",
			session: s
		}) : c.kind === "native" || c.kind === "download" ? await x(c.kind, r, i) : (h(null), v(/* @__PURE__ */ Error(`No application can ${r.intent} "${r.asset.name}"`), r));
	}, [
		b,
		v,
		n,
		t,
		x
	]), C = a((e, t) => S("default", e, t), [S]), k = a((e, t) => S("choose", e, t), [S]), A = a(async (e, t, r) => {
		if (!_.current) {
			if (_.current = !0, r && i && t.kind !== "download") {
				let n = t.kind === "native" ? { kind: "native" } : {
					kind: "application",
					applicationId: t.application.id
				};
				try {
					Promise.resolve(i({
						request: e.request,
						selection: n
					})).catch((t) => v(t, e.request));
				} catch (t) {
					v(t, e.request);
				}
			}
			if (t.kind === "application") {
				let r = E(n, t.application.renderer);
				if (!r) {
					h(null), v(/* @__PURE__ */ Error(`Renderer "${t.application.renderer}" is no longer registered`), e.request);
					return;
				}
				h({
					kind: "running",
					session: e,
					application: t.application,
					renderer: r
				});
			} else await x(t.kind, e.request, e.fallbacks);
		}
	}, [
		n,
		v,
		x,
		i
	]), N = s(() => ({
		available: !!t,
		openAsset: C,
		openWith: k
	}), [
		C,
		k,
		t
	]);
	return /* @__PURE__ */ d(O.Provider, {
		value: N,
		children: [
			e,
			m?.kind === "resolving" && /* @__PURE__ */ u(j, {
				request: m.request,
				onClose: y
			}),
			m?.kind === "choosing" && /* @__PURE__ */ u(M, {
				session: m.session,
				canRemember: !!i,
				onSelect: (e, t) => {
					A(m.session, e, t);
				},
				onClose: y
			}),
			m?.kind === "running" && /* @__PURE__ */ u(f, {
				onError: (e) => v(e, m.session.request),
				children: /* @__PURE__ */ u(r, {
					request: m.session.request,
					application: m.application,
					Renderer: m.renderer,
					chooseApplication: () => {
						_.current = !1, h({
							kind: "choosing",
							session: m.session
						});
					},
					close: y,
					onError: (e) => v(e, m.session.request)
				})
			}, `${m.application.id}:${m.session.request.asset.id ?? m.session.request.asset.path ?? m.session.request.asset.name}`)
		]
	});
}
function j({ request: n, onClose: r }) {
	let i = c(null);
	return e(!0, i), /* @__PURE__ */ u("div", {
		className: "mtc-overlay fixed inset-0 z-[60] flex items-center justify-center px-4",
		onClick: r,
		children: /* @__PURE__ */ d("div", {
			ref: i,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `Finding applications for ${n.asset.name}`,
			tabIndex: -1,
			className: "mtc-popover w-full max-w-sm px-5 py-4",
			onClick: (e) => e.stopPropagation(),
			onKeyDown: (e) => t(e, i, !0, r),
			children: [
				/* @__PURE__ */ u("div", {
					className: "text-[10px] uppercase tracking-[0.14em] text-zinc-500",
					children: "Open asset"
				}),
				/* @__PURE__ */ u("div", {
					className: "mt-1 text-sm font-medium text-zinc-100 truncate",
					children: n.asset.name
				}),
				/* @__PURE__ */ d("div", {
					className: "mt-3 flex items-center gap-2 text-xs text-zinc-500",
					children: [/* @__PURE__ */ u("span", {
						className: "inline-block size-2 rounded-full border border-sky-400 border-t-transparent animate-spin",
						"aria-hidden": "true"
					}), "Checking workspace applications…"]
				})
			]
		})
	});
}
function M({ session: n, canRemember: r, onSelect: i, onClose: a }) {
	let [o, s] = l(!1), f = c(null), p = c(null);
	e(!0, f, p);
	let { request: m, resolution: h, fallbacks: g } = n, _ = h.applications.length > 0 || !!g.native || !!g.download, v = m.asset.contentType || m.asset.kind || "this file type";
	return /* @__PURE__ */ u("div", {
		className: "mtc-overlay fixed inset-0 z-[60] flex items-center justify-center px-4",
		onClick: a,
		children: /* @__PURE__ */ d("div", {
			ref: f,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `Open ${m.asset.name} with`,
			tabIndex: -1,
			className: "mtc-popover w-full max-w-lg overflow-hidden motion-safe:animate-[fadeIn_160ms_ease-out]",
			onClick: (e) => e.stopPropagation(),
			onKeyDown: (e) => t(e, f, !0, a),
			children: [
				/* @__PURE__ */ d("div", {
					className: "px-4 py-3 border-b border-zinc-800 flex items-start gap-3",
					children: [/* @__PURE__ */ d("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ u("div", {
								className: "text-[10px] uppercase tracking-[0.14em] text-zinc-500",
								children: "Open with"
							}),
							/* @__PURE__ */ u("h2", {
								className: "mt-0.5 text-sm font-medium text-zinc-100 truncate",
								children: m.asset.name
							}),
							/* @__PURE__ */ d("div", {
								className: "mt-0.5 text-[10px] text-zinc-600 font-mono truncate",
								children: [
									v,
									" · ",
									m.intent
								]
							})
						]
					}), /* @__PURE__ */ u("button", {
						ref: p,
						type: "button",
						onClick: a,
						className: "text-lg leading-none text-zinc-500 hover:text-zinc-100 px-1",
						"aria-label": "Close application chooser",
						children: "×"
					})]
				}),
				/* @__PURE__ */ d("div", {
					className: "max-h-[26rem] overflow-auto p-2",
					children: [
						h.applications.length > 0 && /* @__PURE__ */ u("div", {
							className: "px-2 pt-1 pb-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-600",
							children: "Workspace applications"
						}),
						h.applications.map((e) => /* @__PURE__ */ u(N, {
							icon: e.icon ?? I(e.name),
							name: e.name,
							description: e.description ?? "Available in this workspace",
							preferred: e.id === h.preferredApplicationId,
							onClick: () => i({
								kind: "application",
								application: e
							}, o)
						}, e.id)),
						(g.native || g.download) && /* @__PURE__ */ u("div", {
							className: "px-2 pt-3 pb-1.5 text-[9px] uppercase tracking-[0.14em] text-zinc-600",
							children: "Built in"
						}),
						g.native && /* @__PURE__ */ u(N, {
							icon: "NP",
							name: g.nativeLabel ?? "Native preview",
							description: "Open with the framework’s built-in viewer",
							preferred: !h.preferredApplicationId,
							onClick: () => i({ kind: "native" }, o)
						}),
						g.download && /* @__PURE__ */ u(N, {
							icon: "DL",
							name: g.downloadLabel ?? "Download",
							description: "Save the original file to this device",
							onClick: () => i({ kind: "download" }, !1)
						}),
						!_ && /* @__PURE__ */ d("div", {
							className: "px-4 py-8 text-center text-sm text-zinc-500",
							children: [
								"No permitted application supports ",
								v,
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ d("div", {
					className: "px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between gap-3",
					children: [r ? /* @__PURE__ */ d("label", {
						className: "flex items-center gap-2 text-xs text-zinc-400 cursor-pointer",
						children: [
							/* @__PURE__ */ u("input", {
								type: "checkbox",
								checked: o,
								onChange: (e) => s(e.target.checked),
								className: "accent-sky-500"
							}),
							"Always use my choice for ",
							v
						]
					}) : /* @__PURE__ */ u("span", {
						className: "text-[10px] text-zinc-600",
						children: "Apps are filtered by workspace policy"
					}), /* @__PURE__ */ u("span", {
						className: "text-[10px] text-zinc-600 shrink-0",
						children: "esc close"
					})]
				})
			]
		})
	});
}
function N({ icon: e, name: t, description: n, preferred: r = !1, onClick: i }) {
	return /* @__PURE__ */ d("button", {
		type: "button",
		onClick: i,
		className: "w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-left hover:bg-zinc-800/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500",
		children: [
			/* @__PURE__ */ u("span", {
				className: "size-9 shrink-0 rounded-md border border-zinc-700 bg-zinc-900 flex items-center justify-center text-[10px] font-semibold tracking-wide text-zinc-300",
				children: e
			}),
			/* @__PURE__ */ d("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ d("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ u("span", {
						className: "text-sm text-zinc-100 truncate",
						children: t
					}), r && /* @__PURE__ */ u("span", {
						className: "text-[8px] uppercase tracking-wider text-sky-300 border border-sky-500/30 bg-sky-500/10 rounded px-1 py-0.5",
						children: "Default"
					})]
				}), /* @__PURE__ */ u("span", {
					className: "block text-[10px] text-zinc-500 truncate",
					children: n
				})]
			}),
			/* @__PURE__ */ u("span", {
				className: "text-zinc-600",
				"aria-hidden": "true",
				children: "›"
			})
		]
	});
}
function P({ request: n, application: i, Renderer: a, chooseApplication: o, close: s }) {
	let l = c(null), f = c(null);
	return e(!0, l, f), /* @__PURE__ */ d("div", {
		ref: l,
		className: "fixed inset-0 z-[60] flex flex-col bg-zinc-950 text-zinc-100",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `${i.name}: ${n.asset.name}`,
		tabIndex: -1,
		onKeyDown: (e) => t(e, l, !0, s),
		children: [/* @__PURE__ */ d("div", {
			className: "h-11 shrink-0 flex items-center gap-3 px-4 border-b border-zinc-800 bg-zinc-900/95",
			children: [
				/* @__PURE__ */ u("span", {
					className: "size-6 rounded border border-zinc-700 bg-zinc-950 flex items-center justify-center text-[8px] font-semibold text-zinc-300",
					children: i.icon ?? I(i.name)
				}),
				/* @__PURE__ */ d("div", {
					className: "min-w-0 flex-1 flex items-baseline gap-2",
					children: [/* @__PURE__ */ u("span", {
						className: "text-xs font-medium text-zinc-200 truncate",
						children: i.name
					}), /* @__PURE__ */ u("span", {
						className: "text-[10px] text-zinc-600 truncate",
						children: n.asset.name
					})]
				}),
				/* @__PURE__ */ u("button", {
					type: "button",
					onClick: o,
					className: "text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-1",
					children: "Open with…"
				}),
				/* @__PURE__ */ u("button", {
					ref: f,
					type: "button",
					onClick: s,
					className: "text-lg leading-none text-zinc-500 hover:text-zinc-100 px-1",
					"aria-label": "Close application",
					children: "×"
				})
			]
		}), /* @__PURE__ */ u("div", {
			className: "flex-1 min-h-0 overflow-auto",
			children: /* @__PURE__ */ u(r, {
				fallback: /* @__PURE__ */ u(F, {}),
				children: /* @__PURE__ */ u(a, {
					asset: n.asset,
					intent: n.intent,
					application: i,
					launchContext: i.launchContext,
					close: s,
					chooseApplication: o
				})
			})
		})]
	});
}
function F() {
	return /* @__PURE__ */ d("div", {
		className: "h-full min-h-48 flex items-center justify-center gap-2 text-xs text-zinc-500",
		children: [/* @__PURE__ */ u("span", {
			className: "inline-block size-2 rounded-full border border-sky-400 border-t-transparent animate-spin",
			"aria-hidden": "true"
		}), "Loading application…"]
	});
}
function I(e) {
	return e.split(/\s+/).filter(Boolean).slice(0, 2).map((e) => e[0]?.toUpperCase()).join("") || "APP";
}
//#endregion
export { T as a, f as c, x as i, C as n, w as o, S as r, k as s, A as t };
