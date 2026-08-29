import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { At as t, It as n, mt as r } from "./MultiDashboard-B8rxYV_S.js";
import { r as i } from "./textNormalize-Ba1I6dwH.js";
import { o as a } from "./fileBrowserHelpers-C6N7d9Ga.js";
import { useMemo as o, useState as s } from "react";
import { Fragment as c, jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/widgets/CodeBrowser.tsx
var d = /* @__PURE__ */ e({ CodeBrowser: () => f });
function f({ data: e, options: d }) {
	let f = o(() => r(e), [e]), m = d ?? {}, { setCtx: h } = t(), [g, _] = s(!1);
	if (!f) return /* @__PURE__ */ l(n, { children: "No repository data" });
	let v = m.repository_ctx ?? "repository", y = m.ref_ctx ?? "repo_ref", b = m.path_ctx ?? "repo_path", x = [...f.entries].sort((e, t) => e.kind === t.kind ? e.name.localeCompare(t.name) : e.kind === "directory" ? -1 : t.kind === "directory" ? 1 : e.name.localeCompare(t.name)), S = i(f.url), C = i(f.file?.url), w = f.path.split("/").filter(Boolean), T = () => {
		f.repository && h(v, f.repository);
	}, E = (e) => {
		h(y, e), h(b, "");
	}, D = (e) => {
		h(b, e.path);
	}, O = async () => {
		if (!(!f.file || typeof navigator > "u" || !navigator.clipboard)) try {
			await navigator.clipboard.writeText(f.file.content), _(!0), setTimeout(() => _(!1), 1200);
		} catch {
			_(!1);
		}
	};
	return /* @__PURE__ */ u("div", {
		className: "h-full flex flex-col min-h-0",
		children: [/* @__PURE__ */ u("div", {
			className: "flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs shrink-0 min-w-0",
			children: [
				/* @__PURE__ */ l("button", {
					onClick: T,
					className: "font-medium text-zinc-100 hover:text-sky-300 truncate",
					title: f.repository,
					children: f.repository || "repository"
				}),
				S && /* @__PURE__ */ l("a", {
					href: S,
					...S.startsWith("/") ? {} : {
						target: "_blank",
						rel: "noopener noreferrer"
					},
					className: "text-zinc-600 hover:text-sky-300 shrink-0",
					title: "Open repository",
					children: "↗"
				}),
				/* @__PURE__ */ l("span", {
					className: "text-zinc-700",
					children: "/"
				}),
				f.refs.length > 1 ? /* @__PURE__ */ l("select", {
					value: f.ref,
					onChange: (e) => E(e.target.value),
					className: "bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-300 outline-none focus:border-zinc-600 shrink-0",
					"aria-label": "Repository ref",
					children: f.refs.map((e) => /* @__PURE__ */ l("option", {
						value: e,
						children: e
					}, e))
				}) : /* @__PURE__ */ l("span", {
					className: "font-mono text-[11px] text-zinc-500 shrink-0",
					children: f.ref || "HEAD"
				}),
				/* @__PURE__ */ u("div", {
					className: "flex items-center gap-1 min-w-0 overflow-hidden",
					children: [/* @__PURE__ */ l("button", {
						onClick: () => h(b, ""),
						className: "text-sky-400 hover:underline shrink-0",
						children: "root"
					}), w.map((e, t) => {
						let n = w.slice(0, t + 1).join("/");
						return /* @__PURE__ */ u("span", {
							className: "flex items-center gap-1 min-w-0",
							children: [/* @__PURE__ */ l("span", {
								className: "text-zinc-700",
								children: "/"
							}), /* @__PURE__ */ l("button", {
								onClick: () => h(b, n),
								className: "text-sky-400 hover:underline truncate",
								title: n,
								children: e
							})]
						}, n);
					})]
				})
			]
		}), /* @__PURE__ */ u("div", {
			className: "flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(14rem,0.34fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ l("div", {
				className: "overflow-auto border-b md:border-b-0 md:border-r border-zinc-800 min-h-0",
				children: x.length === 0 ? /* @__PURE__ */ l(n, { children: f.file ? "No sibling entries" : "Empty directory" }) : /* @__PURE__ */ l("div", {
					className: "divide-y divide-zinc-800/50",
					children: x.map((e) => /* @__PURE__ */ u("button", {
						onClick: () => D(e),
						className: `w-full grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-1.5 text-left text-xs hover:bg-zinc-800/50 ${f.file?.path === e.path ? "bg-sky-500/10 text-sky-300" : "text-zinc-300"}`,
						title: e.path,
						children: [
							/* @__PURE__ */ l("span", {
								className: "text-zinc-600",
								"aria-hidden": "true",
								children: e.kind === "directory" ? "▸" : e.kind === "symlink" ? "↗" : "·"
							}),
							/* @__PURE__ */ l("span", {
								className: "truncate",
								children: e.name
							}),
							/* @__PURE__ */ l("span", {
								className: "text-[9px] text-zinc-600 tabular-nums",
								children: e.kind === "file" && e.sizeBytes != null ? a(e.sizeBytes) : ""
							})
						]
					}, `${e.kind}:${e.path}`))
				})
			}), /* @__PURE__ */ l("div", {
				className: "min-h-0 flex flex-col overflow-hidden",
				children: f.file ? /* @__PURE__ */ u(c, { children: [/* @__PURE__ */ u("div", {
					className: "flex items-center gap-2 px-3 py-1.5 border-b border-zinc-800 text-[10px] text-zinc-500 shrink-0",
					children: [
						/* @__PURE__ */ l("span", {
							className: "font-mono truncate text-zinc-300",
							children: f.file.path
						}),
						f.file.language && /* @__PURE__ */ l("span", {
							className: "uppercase tracking-wider shrink-0",
							children: f.file.language
						}),
						f.file.sizeBytes != null && /* @__PURE__ */ l("span", {
							className: "tabular-nums shrink-0",
							children: a(f.file.sizeBytes)
						}),
						f.file.truncated && /* @__PURE__ */ l("span", {
							className: "text-amber-400 uppercase tracking-wider shrink-0",
							children: "truncated"
						}),
						/* @__PURE__ */ l("button", {
							onClick: () => void O(),
							className: "ml-auto text-zinc-500 hover:text-zinc-200 shrink-0",
							children: g ? "Copied" : "Copy"
						}),
						C && /* @__PURE__ */ l("a", {
							href: C,
							...C.startsWith("/") ? {} : {
								target: "_blank",
								rel: "noopener noreferrer"
							},
							className: "text-zinc-500 hover:text-sky-300 shrink-0",
							children: "Raw ↗"
						})
					]
				}), /* @__PURE__ */ l(p, {
					content: f.file.content,
					wrap: m.wrap === !0
				})] }) : /* @__PURE__ */ l(n, {
					padded: !0,
					children: "Select a file to inspect its source"
				})
			})]
		})]
	});
}
function p({ content: e, wrap: t }) {
	let n = e.split("\n");
	return /* @__PURE__ */ l("div", {
		className: "flex-1 overflow-auto min-h-0 bg-zinc-950/50",
		children: /* @__PURE__ */ l("table", {
			className: "w-full font-mono text-[11px] leading-5",
			children: /* @__PURE__ */ l("tbody", { children: n.map((e, n) => /* @__PURE__ */ u("tr", { children: [/* @__PURE__ */ l("td", {
				className: "sticky left-0 w-12 px-2 text-right align-top select-none text-zinc-700 bg-zinc-950/95 border-r border-zinc-900",
				children: n + 1
			}), /* @__PURE__ */ l("td", {
				className: `px-3 text-zinc-300 align-top ${t ? "whitespace-pre-wrap break-words" : "whitespace-pre"}`,
				children: e || " "
			})] }, n)) })
		})
	});
}
//#endregion
export { d as n, f as t };
