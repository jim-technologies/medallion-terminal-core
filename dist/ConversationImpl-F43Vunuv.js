import { t as e } from "./states-BJ0AAwxU.js";
import { n as t } from "./DashboardContext-65LG4CII.js";
import { r as n, t as r } from "./textNormalize-Ba1I6dwH.js";
import { n as i, t as a } from "./CursorPager-ByrL0U0d.js";
import { useMemo as o, useState as s } from "react";
import { Fragment as c, jsx as l, jsxs as u } from "react/jsx-runtime";
//#region src/widgets/conversationShape.ts
function d(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function f(e) {
	return d(e) ? e : {};
}
function p(e) {
	if (e != null) return String(e).trim() || void 0;
}
function m(e) {
	return d(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function h(e) {
	let t = typeof e == "number" ? e : typeof e == "string" && e.trim() ? Number(e) : NaN;
	if (!(!Number.isFinite(t) || t < 0)) return Math.floor(t);
}
function g(e) {
	let t = String(e ?? "").toLowerCase();
	return t.includes("assistant") || t === "ai" || t === "bot" ? "assistant" : t.includes("system") ? "system" : t.includes("tool") || t.includes("function") ? "tool" : t.includes("event") || t.includes("notice") ? "event" : "message";
}
function _(e) {
	if (!d(e)) return null;
	let t = p(e.id ?? e.participantId ?? e.participant_id), r = p(e.name ?? e.displayName ?? e.display_name);
	return !t || !r ? null : {
		id: t,
		name: r,
		avatarUrl: n(e.avatarUrl ?? e.avatar_url ?? e.imageUrl ?? e.image_url),
		role: p(e.role),
		status: p(e.status ?? e.presence),
		context: m(e.context)
	};
}
function v(e, t) {
	if (!d(e)) return null;
	let r = n(e.url ?? e.href), i = n(e.thumbnailUrl ?? e.thumbnail_url ?? e.previewUrl ?? e.preview_url), a = p(e.name ?? e.title ?? e.filename) ?? r?.split("/").pop() ?? "Attachment";
	return {
		id: p(e.id ?? e.attachmentId ?? e.attachment_id) ?? t,
		name: a,
		kind: p(e.kind ?? e.type) ?? y(e, r),
		url: r,
		thumbnailUrl: i,
		contentType: p(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type),
		sizeBytes: h(e.sizeBytes ?? e.size_bytes ?? e.size)
	};
}
function y(e, t) {
	let n = p(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type)?.toLowerCase();
	return n?.startsWith("image/") ? "image" : n?.startsWith("video/") ? "video" : n?.startsWith("audio/") ? "audio" : t && /\.(png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i.test(t) ? "image" : "file";
}
function b(e, t) {
	if (!d(e)) return null;
	let n = p(e.label ?? e.emoji ?? e.name);
	return n ? {
		key: p(e.key ?? e.id) ?? t,
		label: n,
		count: h(e.count) ?? 0,
		viewerReacted: e.viewerReacted === !0 || e.viewer_reacted === !0 || e.reacted === !0
	} : null;
}
function x(e, t, r) {
	let i = typeof e == "string" ? { body: e } : f(e);
	if (Object.keys(i).length === 0) return null;
	let a = p(i.id ?? i.messageId ?? i.message_id) ?? `message-${t + 1}`, o = p(i.senderId ?? i.sender_id ?? i.authorId ?? i.author_id), s = o ? r.get(o) : void 0, c = p(i.body ?? i.text ?? i.content), l = (Array.isArray(i.attachments) ? i.attachments : []).map((e, t) => v(e, `${a}-attachment-${t + 1}`)).filter((e) => e !== null);
	if (!c && l.length === 0 && i.kind == null && i.type == null) return null;
	let u = Array.isArray(i.reactions) ? i.reactions : [];
	return {
		id: a,
		timestamp: p(i.timestamp ?? i.createdAt ?? i.created_at ?? i.date),
		senderId: o,
		senderName: p(i.senderName ?? i.sender_name ?? i.author ?? i.name) ?? s?.name ?? (g(i.kind ?? i.type ?? i.role) === "assistant" ? "Assistant" : "Unknown"),
		senderAvatarUrl: n(i.senderAvatarUrl ?? i.sender_avatar_url ?? i.avatarUrl ?? i.avatar_url) ?? s?.avatarUrl,
		kind: g(i.kind ?? i.type ?? i.role),
		body: c,
		replyToId: p(i.replyToId ?? i.reply_to_id),
		edited: i.edited === !0 || i.isEdited === !0 || i.is_edited === !0,
		status: p(i.status ?? i.deliveryStatus ?? i.delivery_status),
		attachments: l,
		reactions: u.map((e, t) => b(e, `${a}-reaction-${t + 1}`)).filter((e) => e !== null),
		threadReplyCount: h(i.threadReplyCount ?? i.thread_reply_count ?? i.replyCount ?? i.reply_count),
		metadata: f(i.metadata),
		context: m(i.context)
	};
}
function S(e) {
	let t = Array.isArray(e) ? { messages: e } : f(e), n = (Array.isArray(t.participants) ? t.participants : []).map(_).filter((e) => e !== null), r = new Map(n.map((e) => [e.id, e])), i = Array.isArray(t.messages) ? t.messages : Array.isArray(t.items) ? t.items : Array.isArray(t.transcript) ? t.transcript : [], a = /* @__PURE__ */ new Map();
	for (let [e, t] of i.entries()) {
		let n = x(t, e, r);
		n && a.set(n.id, n);
	}
	return {
		id: p(t.id ?? t.conversationId ?? t.conversation_id) ?? "",
		title: p(t.title ?? t.name ?? t.channel),
		subtitle: p(t.subtitle ?? t.description ?? t.topic),
		viewerId: p(t.viewerId ?? t.viewer_id ?? t.currentParticipantId ?? t.current_participant_id),
		participants: n,
		messages: [...a.values()],
		unreadCount: h(t.unreadCount ?? t.unread_count),
		nextPageToken: p(t.nextPageToken ?? t.next_page_token),
		context: m(t.context)
	};
}
function C(e, t, n = {}) {
	let r = {
		...e.context,
		...t.context
	}, i = n.conversationKey ?? "conversation_id", a = n.messageKey ?? "message_id", o = n.senderKey ?? "sender_id";
	return e.id && !(i in r) && (r[i] = e.id), a in r || (r[a] = t.id), t.senderId && !(o in r) && (r[o] = t.senderId), r;
}
//#endregion
//#region src/widgets/ConversationImpl.tsx
function w({ data: n, options: r, widgetId: c }) {
	let { ctx: d } = t(), f = o(() => S(n), [n]), p = r ?? {}, m = p.mode ?? "channel", h = !!f.nextPageToken || !!d[i(c, p)], [g, _] = s(""), v = o(() => {
		let e = g.trim().toLowerCase();
		return e ? f.messages.filter((t) => [
			t.senderName,
			t.body,
			...t.attachments.map((e) => e.name),
			...Object.values(t.metadata)
		].filter((e) => e != null).join(" ").toLowerCase().includes(e)) : f.messages;
	}, [f.messages, g]);
	return /* @__PURE__ */ u("div", {
		className: "h-full min-h-0 flex flex-col",
		children: [
			p.show_header !== !1 && (f.title || f.subtitle || f.participants.length > 0 || (f.unreadCount ?? 0) > 0) && /* @__PURE__ */ l(T, {
				conversation: f,
				showParticipants: p.show_participants !== !1
			}),
			p.search && /* @__PURE__ */ u("label", {
				className: "mx-1 mb-2 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-500 focus-within:border-zinc-600",
				children: [
					/* @__PURE__ */ l("span", {
						"aria-hidden": "true",
						children: "⌕"
					}),
					/* @__PURE__ */ l("span", {
						className: "sr-only",
						children: "Search messages"
					}),
					/* @__PURE__ */ l("input", {
						type: "search",
						value: g,
						onChange: (e) => _(e.target.value),
						placeholder: "Search messages…",
						className: "min-w-0 flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 outline-none"
					})
				]
			}),
			/* @__PURE__ */ l("div", {
				className: `flex-1 min-h-0 overflow-auto px-1 ${m === "assistant" ? "space-y-3" : "space-y-0.5"}`,
				role: "log",
				"aria-label": f.title ? `${f.title} messages` : "Conversation messages",
				children: f.messages.length === 0 ? /* @__PURE__ */ l(e, { children: "No messages" }) : v.length === 0 ? /* @__PURE__ */ l(e, { children: "No matching messages" }) : v.map((e, t) => /* @__PURE__ */ l(E, {
					conversation: f,
					message: e,
					previous: v[t - 1],
					mode: m,
					options: p
				}, e.id))
			}),
			h && /* @__PURE__ */ u("div", {
				className: "border-t border-zinc-800 pt-1.5 flex items-center justify-between gap-2 text-[10px] text-zinc-600 shrink-0",
				children: [/* @__PURE__ */ l("span", { children: f.nextPageToken ? "Older history available" : "" }), /* @__PURE__ */ l(a, {
					nextPageToken: f.nextPageToken,
					widgetId: c,
					options: {
						...p,
						previous_label: p.previous_label ?? "Newer",
						next_label: p.next_label ?? "Older"
					},
					ariaLabel: "Conversation history pages"
				})]
			})
		]
	});
}
function T({ conversation: e, showParticipants: n }) {
	let { setCtx: r } = t();
	return /* @__PURE__ */ u("button", {
		type: "button",
		onClick: () => {
			for (let [t, n] of Object.entries(e.context)) r(t, n);
			e.id && !("conversation_id" in e.context) && r("conversation_id", e.id);
		},
		className: "mb-2 flex w-full items-start justify-between gap-3 border-b border-zinc-800 px-1 pb-2 text-left",
		children: [/* @__PURE__ */ u("span", {
			className: "min-w-0",
			children: [e.title && /* @__PURE__ */ l("strong", {
				className: "block truncate text-sm font-medium text-zinc-100",
				children: e.title
			}), e.subtitle && /* @__PURE__ */ l("span", {
				className: "block truncate text-[11px] text-zinc-500",
				children: e.subtitle
			})]
		}), /* @__PURE__ */ u("span", {
			className: "flex shrink-0 items-center gap-2",
			children: [e.unreadCount != null && e.unreadCount > 0 && /* @__PURE__ */ u("span", {
				className: "rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-medium text-sky-300",
				children: [e.unreadCount, " unread"]
			}), n && e.participants.length > 0 && /* @__PURE__ */ l("span", {
				className: "flex -space-x-1",
				"aria-label": `${e.participants.length} participants`,
				children: e.participants.slice(0, 4).map((e) => /* @__PURE__ */ l(k, {
					participant: e,
					size: "small"
				}, e.id))
			})]
		})]
	});
}
function E({ conversation: e, message: n, previous: r, mode: i, options: a }) {
	let { ctx: o, setCtx: s } = t(), c = {
		conversationKey: a.message_context?.conversation_key,
		messageKey: a.message_context?.message_key,
		senderKey: a.message_context?.sender_key
	}, d = o[c.messageKey ?? "message_id"] === n.id, f = n.senderId ? e.participants.find((e) => e.id === n.senderId) : void 0, p = !!e.viewerId && n.senderId === e.viewerId, m = i === "channel" && r?.senderId != null && r.senderId === n.senderId && r.kind === n.kind, h = n.replyToId ? e.messages.find((e) => e.id === n.replyToId) : void 0, g = () => {
		for (let [t, r] of Object.entries(C(e, n, c))) s(t, r);
	}, _ = (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), g());
	};
	if (n.kind === "system" || n.kind === "event") return /* @__PURE__ */ u("article", {
		role: "button",
		tabIndex: 0,
		onClick: g,
		onKeyDown: _,
		className: `mx-auto my-2 max-w-[92%] rounded border px-3 py-1.5 text-center text-[11px] ${d ? "border-sky-500/50 bg-sky-500/10 text-sky-200" : "border-zinc-800 bg-zinc-900/70 text-zinc-500 hover:border-zinc-700"}`,
		children: [n.body ?? n.senderName, n.timestamp && /* @__PURE__ */ l("span", {
			className: "ml-2 text-[9px] text-zinc-600",
			children: A(n.timestamp)
		})]
	});
	if (n.kind === "tool") return /* @__PURE__ */ u("article", {
		role: "button",
		tabIndex: 0,
		onClick: g,
		onKeyDown: _,
		className: `mx-7 rounded border px-3 py-2 font-mono text-[11px] ${d ? "border-sky-500/50 bg-sky-500/10" : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"}`,
		children: [
			/* @__PURE__ */ u("div", {
				className: "mb-1 flex items-center justify-between gap-2 text-zinc-500",
				children: [/* @__PURE__ */ u("span", {
					className: "uppercase tracking-wider",
					children: ["Tool · ", n.senderName]
				}), n.status && /* @__PURE__ */ l("span", { children: M(n.status) })]
			}),
			n.body && /* @__PURE__ */ l("div", {
				className: "whitespace-pre-wrap break-words text-zinc-300",
				children: n.body
			}),
			/* @__PURE__ */ l(O, { attachments: n.attachments })
		]
	});
	let v = i === "assistant" && n.kind === "assistant", y = i !== "channel" && p, b = i === "direct" || i === "assistant" && !v;
	return /* @__PURE__ */ u("article", {
		role: "button",
		tabIndex: 0,
		onClick: g,
		onKeyDown: _,
		className: `group flex gap-2 rounded border-l-2 px-2 transition-colors ${m ? "py-1" : "py-2"} ${y ? "flex-row-reverse" : ""} ${d ? "border-sky-500 bg-sky-500/10" : "border-transparent hover:bg-zinc-800/30"}`,
		children: [/* @__PURE__ */ l("div", {
			className: `w-7 shrink-0 ${m ? "invisible" : ""}`,
			children: /* @__PURE__ */ l(k, {
				participant: f,
				fallbackName: n.senderName,
				fallbackUrl: n.senderAvatarUrl
			})
		}), /* @__PURE__ */ u("div", {
			className: `min-w-0 max-w-full flex-1 ${y ? "flex flex-col items-end" : ""}`,
			children: [
				!m && /* @__PURE__ */ u("div", {
					className: `mb-0.5 flex items-baseline gap-2 ${y ? "flex-row-reverse" : ""}`,
					children: [
						/* @__PURE__ */ l("strong", {
							className: "truncate text-xs font-medium text-zinc-200",
							children: n.senderName
						}),
						n.timestamp && /* @__PURE__ */ l("time", {
							className: "shrink-0 text-[9px] text-zinc-600",
							dateTime: n.timestamp,
							children: A(n.timestamp)
						}),
						n.edited && /* @__PURE__ */ l("span", {
							className: "text-[9px] text-zinc-600",
							children: "edited"
						})
					]
				}),
				h && /* @__PURE__ */ l(D, { message: h }),
				(n.body || n.attachments.length > 0) && /* @__PURE__ */ u("div", {
					className: `max-w-full ${b ? y ? "rounded-lg rounded-tr-sm bg-sky-500/15 px-3 py-2" : "rounded-lg rounded-tl-sm bg-zinc-800/80 px-3 py-2" : ""}`,
					children: [n.body && /* @__PURE__ */ l("div", {
						className: "whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300",
						children: n.body
					}), a.show_attachments !== !1 && /* @__PURE__ */ l(O, { attachments: n.attachments })]
				}),
				/* @__PURE__ */ u("div", {
					className: `mt-1 flex flex-wrap items-center gap-1.5 ${y ? "justify-end" : ""}`,
					children: [
						a.show_reactions !== !1 && n.reactions.map((e) => /* @__PURE__ */ u("span", {
							className: `rounded-full border px-1.5 py-0.5 text-[10px] ${e.viewerReacted ? "border-sky-500/40 bg-sky-500/10 text-sky-200" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`,
							children: [
								e.label,
								" ",
								e.count
							]
						}, e.key)),
						n.threadReplyCount != null && n.threadReplyCount > 0 && /* @__PURE__ */ u("span", {
							className: "text-[10px] font-medium text-sky-400",
							children: [
								n.threadReplyCount,
								" ",
								n.threadReplyCount === 1 ? "reply" : "replies"
							]
						}),
						a.show_delivery_status !== !1 && n.status && /* @__PURE__ */ l("span", {
							className: `text-[9px] ${N(n.status)}`,
							children: M(n.status)
						})
					]
				})
			]
		})]
	});
}
function D({ message: e }) {
	return /* @__PURE__ */ u("div", {
		className: "mb-1.5 max-w-full border-l-2 border-zinc-700 pl-2 text-[10px] text-zinc-500",
		children: [/* @__PURE__ */ l("strong", {
			className: "mr-1 text-zinc-400",
			children: e.senderName
		}), /* @__PURE__ */ l("span", {
			className: "line-clamp-1",
			children: e.body ?? e.attachments[0]?.name ?? "Message"
		})]
	});
}
function O({ attachments: e }) {
	return e.length === 0 ? null : /* @__PURE__ */ l("div", {
		className: "mt-2 grid max-w-md gap-1.5",
		children: e.map((e) => {
			let t = n(e.url), r = n(e.thumbnailUrl), i = /* @__PURE__ */ u(c, { children: [e.kind === "image" && (r ?? t) ? /* @__PURE__ */ l("img", {
				src: r ?? t,
				alt: "",
				loading: "lazy",
				className: "h-14 w-20 shrink-0 rounded object-cover bg-zinc-800"
			}) : /* @__PURE__ */ l("span", {
				className: "flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-800 text-zinc-500",
				children: P(e.kind)
			}), /* @__PURE__ */ u("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ l("strong", {
					className: "block truncate text-[11px] font-medium text-zinc-300",
					children: e.name
				}), /* @__PURE__ */ l("span", {
					className: "block text-[9px] text-zinc-600",
					children: [M(e.kind), F(e.sizeBytes)].filter(Boolean).join(" · ")
				})]
			})] });
			return t ? /* @__PURE__ */ l("a", {
				href: t,
				onClick: (e) => e.stopPropagation(),
				...t.startsWith("/") ? {} : {
					target: "_blank",
					rel: "noopener noreferrer"
				},
				className: "flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1.5 hover:border-zinc-700",
				children: i
			}, e.id) : /* @__PURE__ */ l("div", {
				className: "flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1.5",
				children: i
			}, e.id);
		})
	});
}
function k({ participant: e, fallbackName: t = "Unknown", fallbackUrl: r, size: i = "normal" }) {
	let a = e?.name ?? t, o = n(e?.avatarUrl ?? r), s = `${i === "small" ? "h-5 w-5 text-[8px]" : "h-7 w-7 text-[9px]"} rounded flex shrink-0 items-center justify-center border border-zinc-700 bg-zinc-800 font-medium text-zinc-300`;
	return o ? /* @__PURE__ */ l("img", {
		src: o,
		alt: a,
		loading: "lazy",
		className: `${s} object-cover`
	}) : /* @__PURE__ */ l("span", {
		className: s,
		title: a,
		children: j(a)
	});
}
function A(e) {
	let t = r(e);
	return typeof t == "string" ? t : e;
}
function j(e) {
	return e.trim().split(/\s+/).slice(0, 2).map((e) => e[0]?.toUpperCase() ?? "").join("");
}
function M(e) {
	return e.replace(/^MESSAGE_/, "").replace(/_/g, " ").toLowerCase();
}
function N(e) {
	let t = e.toLowerCase();
	return t.includes("fail") || t.includes("error") ? "text-red-400" : t.includes("read") || t.includes("deliver") ? "text-sky-400" : t.includes("send") ? "text-amber-400" : "text-zinc-600";
}
function P(e) {
	return e.includes("video") ? "▶" : e.includes("audio") ? "♪" : e.includes("link") ? "↗" : e.includes("code") ? "</>" : "▧";
}
function F(e) {
	if (e != null) return e < 1024 ? `${e} B` : e < 1024 ** 2 ? `${Math.round(e / 1024)} KB` : `${(e / 1024 ** 2).toFixed(e >= 10 * 1024 ** 2 ? 0 : 1)} MB`;
}
//#endregion
export { w as ConversationImpl };
