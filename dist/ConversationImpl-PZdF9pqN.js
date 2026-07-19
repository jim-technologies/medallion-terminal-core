import { t as e } from "./states-BJ0AAwxU.js";
import { n as t } from "./DashboardContext-BKgLoCrb.js";
import { r as n, t as r } from "./textNormalize-Ba1I6dwH.js";
import { useMemo as i, useState as a } from "react";
import { Fragment as o, jsx as s, jsxs as c } from "react/jsx-runtime";
//#region src/widgets/conversationShape.ts
function l(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function u(e) {
	return l(e) ? e : {};
}
function d(e) {
	if (e != null) return String(e).trim() || void 0;
}
function f(e) {
	return l(e) ? Object.fromEntries(Object.entries(e).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function p(e) {
	let t = typeof e == "number" ? e : typeof e == "string" && e.trim() ? Number(e) : NaN;
	if (!(!Number.isFinite(t) || t < 0)) return Math.floor(t);
}
function m(e) {
	let t = String(e ?? "").toLowerCase();
	return t.includes("assistant") || t === "ai" || t === "bot" ? "assistant" : t.includes("system") ? "system" : t.includes("tool") || t.includes("function") ? "tool" : t.includes("event") || t.includes("notice") ? "event" : "message";
}
function h(e) {
	if (!l(e)) return null;
	let t = d(e.id ?? e.participantId ?? e.participant_id), r = d(e.name ?? e.displayName ?? e.display_name);
	return !t || !r ? null : {
		id: t,
		name: r,
		avatarUrl: n(e.avatarUrl ?? e.avatar_url ?? e.imageUrl ?? e.image_url),
		role: d(e.role),
		status: d(e.status ?? e.presence),
		context: f(e.context)
	};
}
function g(e, t) {
	if (!l(e)) return null;
	let r = n(e.url ?? e.href), i = n(e.thumbnailUrl ?? e.thumbnail_url ?? e.previewUrl ?? e.preview_url), a = d(e.name ?? e.title ?? e.filename) ?? r?.split("/").pop() ?? "Attachment";
	return {
		id: d(e.id ?? e.attachmentId ?? e.attachment_id) ?? t,
		name: a,
		kind: d(e.kind ?? e.type) ?? _(e, r),
		url: r,
		thumbnailUrl: i,
		contentType: d(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type),
		sizeBytes: p(e.sizeBytes ?? e.size_bytes ?? e.size)
	};
}
function _(e, t) {
	let n = d(e.contentType ?? e.content_type ?? e.mimeType ?? e.mime_type)?.toLowerCase();
	return n?.startsWith("image/") ? "image" : n?.startsWith("video/") ? "video" : n?.startsWith("audio/") ? "audio" : t && /\.(png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i.test(t) ? "image" : "file";
}
function v(e, t) {
	if (!l(e)) return null;
	let n = d(e.label ?? e.emoji ?? e.name);
	return n ? {
		key: d(e.key ?? e.id) ?? t,
		label: n,
		count: p(e.count) ?? 0,
		viewerReacted: e.viewerReacted === !0 || e.viewer_reacted === !0 || e.reacted === !0
	} : null;
}
function y(e, t, r) {
	let i = typeof e == "string" ? { body: e } : u(e);
	if (Object.keys(i).length === 0) return null;
	let a = d(i.id ?? i.messageId ?? i.message_id) ?? `message-${t + 1}`, o = d(i.senderId ?? i.sender_id ?? i.authorId ?? i.author_id), s = o ? r.get(o) : void 0, c = d(i.body ?? i.text ?? i.content), l = (Array.isArray(i.attachments) ? i.attachments : []).map((e, t) => g(e, `${a}-attachment-${t + 1}`)).filter((e) => e !== null);
	if (!c && l.length === 0 && i.kind == null && i.type == null) return null;
	let h = Array.isArray(i.reactions) ? i.reactions : [];
	return {
		id: a,
		timestamp: d(i.timestamp ?? i.createdAt ?? i.created_at ?? i.date),
		senderId: o,
		senderName: d(i.senderName ?? i.sender_name ?? i.author ?? i.name) ?? s?.name ?? (m(i.kind ?? i.type ?? i.role) === "assistant" ? "Assistant" : "Unknown"),
		senderAvatarUrl: n(i.senderAvatarUrl ?? i.sender_avatar_url ?? i.avatarUrl ?? i.avatar_url) ?? s?.avatarUrl,
		kind: m(i.kind ?? i.type ?? i.role),
		body: c,
		replyToId: d(i.replyToId ?? i.reply_to_id),
		edited: i.edited === !0 || i.isEdited === !0 || i.is_edited === !0,
		status: d(i.status ?? i.deliveryStatus ?? i.delivery_status),
		attachments: l,
		reactions: h.map((e, t) => v(e, `${a}-reaction-${t + 1}`)).filter((e) => e !== null),
		threadReplyCount: p(i.threadReplyCount ?? i.thread_reply_count ?? i.replyCount ?? i.reply_count),
		metadata: u(i.metadata),
		context: f(i.context)
	};
}
function b(e) {
	let t = Array.isArray(e) ? { messages: e } : u(e), n = (Array.isArray(t.participants) ? t.participants : []).map(h).filter((e) => e !== null), r = new Map(n.map((e) => [e.id, e])), i = Array.isArray(t.messages) ? t.messages : Array.isArray(t.items) ? t.items : Array.isArray(t.transcript) ? t.transcript : [], a = /* @__PURE__ */ new Map();
	for (let [e, t] of i.entries()) {
		let n = y(t, e, r);
		n && a.set(n.id, n);
	}
	return {
		id: d(t.id ?? t.conversationId ?? t.conversation_id) ?? "",
		title: d(t.title ?? t.name ?? t.channel),
		subtitle: d(t.subtitle ?? t.description ?? t.topic),
		viewerId: d(t.viewerId ?? t.viewer_id ?? t.currentParticipantId ?? t.current_participant_id),
		participants: n,
		messages: [...a.values()],
		unreadCount: p(t.unreadCount ?? t.unread_count),
		nextPageToken: d(t.nextPageToken ?? t.next_page_token),
		context: f(t.context)
	};
}
function x(e, t, n = {}) {
	let r = {
		...e.context,
		...t.context
	}, i = n.conversationKey ?? "conversation_id", a = n.messageKey ?? "message_id", o = n.senderKey ?? "sender_id";
	return e.id && !(i in r) && (r[i] = e.id), a in r || (r[a] = t.id), t.senderId && !(o in r) && (r[o] = t.senderId), r;
}
//#endregion
//#region src/widgets/ConversationImpl.tsx
function S({ data: t, options: n }) {
	let r = i(() => b(t), [t]), o = n ?? {}, l = o.mode ?? "channel", [u, d] = a(""), f = i(() => {
		let e = u.trim().toLowerCase();
		return e ? r.messages.filter((t) => [
			t.senderName,
			t.body,
			...t.attachments.map((e) => e.name),
			...Object.values(t.metadata)
		].filter((e) => e != null).join(" ").toLowerCase().includes(e)) : r.messages;
	}, [r.messages, u]);
	return r.messages.length === 0 ? /* @__PURE__ */ s(e, { children: "No messages" }) : /* @__PURE__ */ c("div", {
		className: "h-full min-h-0 flex flex-col",
		children: [
			o.show_header !== !1 && /* @__PURE__ */ s(C, {
				conversation: r,
				showParticipants: o.show_participants !== !1
			}),
			o.search && /* @__PURE__ */ c("label", {
				className: "mx-1 mb-2 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-500 focus-within:border-zinc-600",
				children: [
					/* @__PURE__ */ s("span", {
						"aria-hidden": "true",
						children: "⌕"
					}),
					/* @__PURE__ */ s("span", {
						className: "sr-only",
						children: "Search messages"
					}),
					/* @__PURE__ */ s("input", {
						type: "search",
						value: u,
						onChange: (e) => d(e.target.value),
						placeholder: "Search messages…",
						className: "min-w-0 flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 outline-none"
					})
				]
			}),
			/* @__PURE__ */ s("div", {
				className: `flex-1 min-h-0 overflow-auto px-1 ${l === "assistant" ? "space-y-3" : "space-y-0.5"}`,
				role: "log",
				"aria-label": r.title ? `${r.title} messages` : "Conversation messages",
				children: f.length === 0 ? /* @__PURE__ */ s(e, { children: "No matching messages" }) : f.map((e, t) => /* @__PURE__ */ s(w, {
					conversation: r,
					message: e,
					previous: f[t - 1],
					mode: l,
					options: o
				}, e.id))
			}),
			r.nextPageToken && /* @__PURE__ */ s("div", {
				className: "border-t border-zinc-800 pt-1.5 text-center text-[10px] text-zinc-600",
				children: "Older history available"
			})
		]
	});
}
function C({ conversation: e, showParticipants: n }) {
	let { setCtx: r } = t();
	return /* @__PURE__ */ c("button", {
		type: "button",
		onClick: () => {
			for (let [t, n] of Object.entries(e.context)) r(t, n);
			e.id && !("conversation_id" in e.context) && r("conversation_id", e.id);
		},
		className: "mb-2 flex w-full items-start justify-between gap-3 border-b border-zinc-800 px-1 pb-2 text-left",
		children: [/* @__PURE__ */ c("span", {
			className: "min-w-0",
			children: [e.title && /* @__PURE__ */ s("strong", {
				className: "block truncate text-sm font-medium text-zinc-100",
				children: e.title
			}), e.subtitle && /* @__PURE__ */ s("span", {
				className: "block truncate text-[11px] text-zinc-500",
				children: e.subtitle
			})]
		}), /* @__PURE__ */ c("span", {
			className: "flex shrink-0 items-center gap-2",
			children: [e.unreadCount != null && e.unreadCount > 0 && /* @__PURE__ */ c("span", {
				className: "rounded-full bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-medium text-sky-300",
				children: [e.unreadCount, " unread"]
			}), n && e.participants.length > 0 && /* @__PURE__ */ s("span", {
				className: "flex -space-x-1",
				"aria-label": `${e.participants.length} participants`,
				children: e.participants.slice(0, 4).map((e) => /* @__PURE__ */ s(D, {
					participant: e,
					size: "small"
				}, e.id))
			})]
		})]
	});
}
function w({ conversation: e, message: n, previous: r, mode: i, options: a }) {
	let { ctx: o, setCtx: l } = t(), u = {
		conversationKey: a.message_context?.conversation_key,
		messageKey: a.message_context?.message_key,
		senderKey: a.message_context?.sender_key
	}, d = o[u.messageKey ?? "message_id"] === n.id, f = n.senderId ? e.participants.find((e) => e.id === n.senderId) : void 0, p = !!e.viewerId && n.senderId === e.viewerId, m = i === "channel" && r?.senderId != null && r.senderId === n.senderId && r.kind === n.kind, h = n.replyToId ? e.messages.find((e) => e.id === n.replyToId) : void 0, g = () => {
		for (let [t, r] of Object.entries(x(e, n, u))) l(t, r);
	}, _ = (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), g());
	};
	if (n.kind === "system" || n.kind === "event") return /* @__PURE__ */ c("article", {
		role: "button",
		tabIndex: 0,
		onClick: g,
		onKeyDown: _,
		className: `mx-auto my-2 max-w-[92%] rounded border px-3 py-1.5 text-center text-[11px] ${d ? "border-sky-500/50 bg-sky-500/10 text-sky-200" : "border-zinc-800 bg-zinc-900/70 text-zinc-500 hover:border-zinc-700"}`,
		children: [n.body ?? n.senderName, n.timestamp && /* @__PURE__ */ s("span", {
			className: "ml-2 text-[9px] text-zinc-600",
			children: O(n.timestamp)
		})]
	});
	if (n.kind === "tool") return /* @__PURE__ */ c("article", {
		role: "button",
		tabIndex: 0,
		onClick: g,
		onKeyDown: _,
		className: `mx-7 rounded border px-3 py-2 font-mono text-[11px] ${d ? "border-sky-500/50 bg-sky-500/10" : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"}`,
		children: [
			/* @__PURE__ */ c("div", {
				className: "mb-1 flex items-center justify-between gap-2 text-zinc-500",
				children: [/* @__PURE__ */ c("span", {
					className: "uppercase tracking-wider",
					children: ["Tool · ", n.senderName]
				}), n.status && /* @__PURE__ */ s("span", { children: A(n.status) })]
			}),
			n.body && /* @__PURE__ */ s("div", {
				className: "whitespace-pre-wrap break-words text-zinc-300",
				children: n.body
			}),
			/* @__PURE__ */ s(E, { attachments: n.attachments })
		]
	});
	let v = i === "assistant" && n.kind === "assistant", y = i !== "channel" && p, b = i === "direct" || i === "assistant" && !v;
	return /* @__PURE__ */ c("article", {
		role: "button",
		tabIndex: 0,
		onClick: g,
		onKeyDown: _,
		className: `group flex gap-2 rounded border-l-2 px-2 transition-colors ${m ? "py-1" : "py-2"} ${y ? "flex-row-reverse" : ""} ${d ? "border-sky-500 bg-sky-500/10" : "border-transparent hover:bg-zinc-800/30"}`,
		children: [/* @__PURE__ */ s("div", {
			className: `w-7 shrink-0 ${m ? "invisible" : ""}`,
			children: /* @__PURE__ */ s(D, {
				participant: f,
				fallbackName: n.senderName,
				fallbackUrl: n.senderAvatarUrl
			})
		}), /* @__PURE__ */ c("div", {
			className: `min-w-0 max-w-full flex-1 ${y ? "flex flex-col items-end" : ""}`,
			children: [
				!m && /* @__PURE__ */ c("div", {
					className: `mb-0.5 flex items-baseline gap-2 ${y ? "flex-row-reverse" : ""}`,
					children: [
						/* @__PURE__ */ s("strong", {
							className: "truncate text-xs font-medium text-zinc-200",
							children: n.senderName
						}),
						n.timestamp && /* @__PURE__ */ s("time", {
							className: "shrink-0 text-[9px] text-zinc-600",
							dateTime: n.timestamp,
							children: O(n.timestamp)
						}),
						n.edited && /* @__PURE__ */ s("span", {
							className: "text-[9px] text-zinc-600",
							children: "edited"
						})
					]
				}),
				h && /* @__PURE__ */ s(T, { message: h }),
				(n.body || n.attachments.length > 0) && /* @__PURE__ */ c("div", {
					className: `max-w-full ${b ? y ? "rounded-lg rounded-tr-sm bg-sky-500/15 px-3 py-2" : "rounded-lg rounded-tl-sm bg-zinc-800/80 px-3 py-2" : ""}`,
					children: [n.body && /* @__PURE__ */ s("div", {
						className: "whitespace-pre-wrap break-words text-[13px] leading-relaxed text-zinc-300",
						children: n.body
					}), a.show_attachments !== !1 && /* @__PURE__ */ s(E, { attachments: n.attachments })]
				}),
				/* @__PURE__ */ c("div", {
					className: `mt-1 flex flex-wrap items-center gap-1.5 ${y ? "justify-end" : ""}`,
					children: [
						a.show_reactions !== !1 && n.reactions.map((e) => /* @__PURE__ */ c("span", {
							className: `rounded-full border px-1.5 py-0.5 text-[10px] ${e.viewerReacted ? "border-sky-500/40 bg-sky-500/10 text-sky-200" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`,
							children: [
								e.label,
								" ",
								e.count
							]
						}, e.key)),
						n.threadReplyCount != null && n.threadReplyCount > 0 && /* @__PURE__ */ c("span", {
							className: "text-[10px] font-medium text-sky-400",
							children: [
								n.threadReplyCount,
								" ",
								n.threadReplyCount === 1 ? "reply" : "replies"
							]
						}),
						a.show_delivery_status !== !1 && n.status && /* @__PURE__ */ s("span", {
							className: `text-[9px] ${j(n.status)}`,
							children: A(n.status)
						})
					]
				})
			]
		})]
	});
}
function T({ message: e }) {
	return /* @__PURE__ */ c("div", {
		className: "mb-1.5 max-w-full border-l-2 border-zinc-700 pl-2 text-[10px] text-zinc-500",
		children: [/* @__PURE__ */ s("strong", {
			className: "mr-1 text-zinc-400",
			children: e.senderName
		}), /* @__PURE__ */ s("span", {
			className: "line-clamp-1",
			children: e.body ?? e.attachments[0]?.name ?? "Message"
		})]
	});
}
function E({ attachments: e }) {
	return e.length === 0 ? null : /* @__PURE__ */ s("div", {
		className: "mt-2 grid max-w-md gap-1.5",
		children: e.map((e) => {
			let t = n(e.url), r = n(e.thumbnailUrl), i = /* @__PURE__ */ c(o, { children: [e.kind === "image" && (r ?? t) ? /* @__PURE__ */ s("img", {
				src: r ?? t,
				alt: "",
				loading: "lazy",
				className: "h-14 w-20 shrink-0 rounded object-cover bg-zinc-800"
			}) : /* @__PURE__ */ s("span", {
				className: "flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-800 text-zinc-500",
				children: M(e.kind)
			}), /* @__PURE__ */ c("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ s("strong", {
					className: "block truncate text-[11px] font-medium text-zinc-300",
					children: e.name
				}), /* @__PURE__ */ s("span", {
					className: "block text-[9px] text-zinc-600",
					children: [A(e.kind), N(e.sizeBytes)].filter(Boolean).join(" · ")
				})]
			})] });
			return t ? /* @__PURE__ */ s("a", {
				href: t,
				onClick: (e) => e.stopPropagation(),
				...t.startsWith("/") ? {} : {
					target: "_blank",
					rel: "noopener noreferrer"
				},
				className: "flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1.5 hover:border-zinc-700",
				children: i
			}, e.id) : /* @__PURE__ */ s("div", {
				className: "flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1.5",
				children: i
			}, e.id);
		})
	});
}
function D({ participant: e, fallbackName: t = "Unknown", fallbackUrl: r, size: i = "normal" }) {
	let a = e?.name ?? t, o = n(e?.avatarUrl ?? r), c = `${i === "small" ? "h-5 w-5 text-[8px]" : "h-7 w-7 text-[9px]"} rounded flex shrink-0 items-center justify-center border border-zinc-700 bg-zinc-800 font-medium text-zinc-300`;
	return o ? /* @__PURE__ */ s("img", {
		src: o,
		alt: a,
		loading: "lazy",
		className: `${c} object-cover`
	}) : /* @__PURE__ */ s("span", {
		className: c,
		title: a,
		children: k(a)
	});
}
function O(e) {
	let t = r(e);
	return typeof t == "string" ? t : e;
}
function k(e) {
	return e.trim().split(/\s+/).slice(0, 2).map((e) => e[0]?.toUpperCase() ?? "").join("");
}
function A(e) {
	return e.replace(/^MESSAGE_/, "").replace(/_/g, " ").toLowerCase();
}
function j(e) {
	let t = e.toLowerCase();
	return t.includes("fail") || t.includes("error") ? "text-red-400" : t.includes("read") || t.includes("deliver") ? "text-sky-400" : t.includes("send") ? "text-amber-400" : "text-zinc-600";
}
function M(e) {
	return e.includes("video") ? "▶" : e.includes("audio") ? "♪" : e.includes("link") ? "↗" : e.includes("code") ? "</>" : "▧";
}
function N(e) {
	if (e != null) return e < 1024 ? `${e} B` : e < 1024 ** 2 ? `${Math.round(e / 1024)} KB` : `${(e / 1024 ** 2).toFixed(e >= 10 * 1024 ** 2 ? 0 : 1)} MB`;
}
//#endregion
export { S as ConversationImpl };
