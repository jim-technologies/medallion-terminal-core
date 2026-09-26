import { i as e, n as t, t as n } from "./utils-j4lJ7S1v.js";
import { createContext as r, forwardRef as i, useCallback as a, useContext as o, useEffect as s, useId as c, useMemo as l, useRef as u, useState as d } from "react";
import { Fragment as f, jsx as p, jsxs as m } from "react/jsx-runtime";
import { createPortal as h } from "react-dom";
//#region src/foundations/messages.ts
var g = {
	"button.working": "Working",
	"breadcrumbs.label": "Breadcrumbs",
	"combobox.placeholder": "Select…",
	"combobox.empty": "No matching options",
	"dialog.close": "Close dialog",
	"drawer.close": "Close drawer",
	"splitPane.resize": "Resize panes",
	"tag.remove": "Remove",
	"toolbar.label": "Toolbar",
	"tree.collapse": "Collapse {label}",
	"tree.expand": "Expand {label}",
	"state.loading": "Loading",
	"state.retry": "Retry",
	"state.error.title": "Unable to load",
	"state.details": "Details",
	"state.requestId": "Request ID",
	"state.errorCode": "Code",
	"error.unauthenticated.title": "Sign-in required",
	"error.unauthenticated.description": "Your session has ended. Sign in again to continue.",
	"error.forbidden.title": "You don’t have access",
	"error.forbidden.description": "Ask an owner for access.",
	"error.not_found.title": "Not found",
	"error.not_found.description": "It doesn’t exist or was moved.",
	"error.rate_limited.title": "Too many requests",
	"error.rate_limited.description": "Wait a moment, then try again.",
	"error.rate_limited.retryIn": "Try again in {duration}.",
	"error.unavailable.title": "Service unavailable",
	"error.unavailable.description": "The service did not respond. Try again shortly.",
	"error.invalid.title": "Request not accepted",
	"error.invalid.description": "The service could not accept this request.",
	"error.unknown.description": "Something went wrong while loading this.",
	"state.accessDenied.resource": "Ask an owner of {resource} for access.",
	"state.notFound.resource": "{resource} doesn’t exist or was moved.",
	"state.signedOut.title": "You’re signed out",
	"state.signedOut.description": "Sign in to continue.",
	"state.signedOut.action": "Sign in",
	"state.sessionExpired.title": "Your session expired",
	"state.sessionExpired.description": "Your work on this page is kept. Continue to renew your session.",
	"state.sessionExpired.action": "Continue",
	"state.stale.title": "Data may be out of date",
	"state.stale.description": "Last updated {time}.",
	"state.stale.generic": "This view has not refreshed recently.",
	"state.stale.action": "Refresh",
	"copy.label": "Copy",
	"copy.copied": "Copied",
	"value.yes": "Yes",
	"value.no": "No",
	"value.more": "+{count}",
	"value.moreTitle": "{count} more: {items}",
	"value.fields": "{count} fields",
	"value.newTab": "(opens in a new tab)",
	"panel.filter": "Filter",
	"propertyPanel.title": "Properties",
	"propertyPanel.count": "{shown} of {total}",
	"propertyPanel.filter": "Filter properties",
	"propertyPanel.noMatch": "No properties match “{query}”",
	"objectHeader.copyId": "Copy ID",
	"dataGrid.selectAll": "Select all rows",
	"dataGrid.selectRow": "Select {label}",
	"dataGrid.empty": "No rows",
	"dataGrid.loading": "Loading rows",
	"dataGrid.loadingMore": "Loading more rows",
	"dataGrid.rowActions": "Actions for {label}",
	"linkPanel.title": "Links",
	"linkPanel.summary": "{types} link types · {objects} objects",
	"linkPanel.viewAll": "View all {count}",
	"linkPanel.empty": "No links",
	"linkPanel.incoming": "incoming",
	"graph.zoomIn": "Zoom in",
	"graph.zoomOut": "Zoom out",
	"graph.reset": "Reset view",
	"graph.more": "{count} more",
	"graph.moreLabel": "{count} more {relation} {type}",
	"pagination.label": "Pages",
	"pagination.previous": "Previous",
	"pagination.next": "Next",
	"pagination.page": "Page {page} of {count}",
	"pagination.pageOnly": "Page {page}",
	"search.clear": "Clear search",
	"search.removeToken": "Remove {label}",
	"facet.clear": "Clear",
	"facet.showMore": "Show {count} more",
	"facet.showLess": "Show fewer",
	"navRail.collapse": "Collapse navigation",
	"navRail.expand": "Expand navigation",
	"palette.label": "Command palette",
	"palette.placeholder": "Search or type a command",
	"palette.results": "Results",
	"palette.empty": "No results",
	"palette.loading": "Searching",
	"palette.navigate": "navigate",
	"palette.select": "select",
	"palette.close": "close",
	"toast.region": "Notifications",
	"toast.dismiss": "Dismiss notification",
	"activity.empty": "No activity yet",
	"stat.increase": "Increase",
	"stat.decrease": "Decrease",
	"preview.loading": "Loading preview",
	"preview.unsupported.title": "No preview for this file type",
	"preview.unsupported.description": "Download it to open it in another application.",
	"preview.tooLarge.title": "Too large to preview",
	"preview.tooLarge.description": "{size} is over the {limit} preview limit.",
	"preview.blocked.title": "Preview blocked",
	"preview.blocked.description": "The file’s contents are not a valid {kind}, so it is not shown.",
	"preview.unreadable": "This file could not be read as {kind}.",
	"preview.truncatedBytes": "Showing the first {shown} of {total}.",
	"preview.truncatedStart": "Showing the first {shown}.",
	"preview.truncatedTable": "Showing {rows} of {totalRows} rows and {columns} of {totalColumns} columns.",
	"preview.download": "Download",
	"preview.column": "Column {index}",
	"code.lines": "{count} lines",
	"code.wrap": "Wrap lines",
	"code.copy": "Copy code",
	"code.truncated": "Showing the first {shown} of {total} lines."
}, _ = {
	"button.working": "处理中",
	"breadcrumbs.label": "路径导航",
	"combobox.placeholder": "请选择…",
	"combobox.empty": "没有匹配的选项",
	"dialog.close": "关闭对话框",
	"drawer.close": "关闭抽屉",
	"splitPane.resize": "调整窗格大小",
	"tag.remove": "移除",
	"toolbar.label": "工具栏",
	"tree.collapse": "折叠 {label}",
	"tree.expand": "展开 {label}",
	"state.loading": "正在加载",
	"state.retry": "重试",
	"state.error.title": "无法加载",
	"state.details": "详细信息",
	"state.requestId": "请求 ID",
	"state.errorCode": "代码",
	"error.unauthenticated.title": "需要登录",
	"error.unauthenticated.description": "您的会话已结束。请重新登录以继续。",
	"error.forbidden.title": "您没有访问权限",
	"error.forbidden.description": "请向所有者申请访问权限。",
	"error.not_found.title": "未找到",
	"error.not_found.description": "内容不存在或已被移动。",
	"error.rate_limited.title": "请求过多",
	"error.rate_limited.description": "请稍候再试。",
	"error.rate_limited.retryIn": "请在 {duration}后重试。",
	"error.unavailable.title": "服务不可用",
	"error.unavailable.description": "服务没有响应，请稍后重试。",
	"error.invalid.title": "请求未被接受",
	"error.invalid.description": "服务无法接受此请求。",
	"error.unknown.description": "加载时出现问题。",
	"state.accessDenied.resource": "请向 {resource} 的所有者申请访问权限。",
	"state.notFound.resource": "{resource} 不存在或已被移动。",
	"state.signedOut.title": "您已退出登录",
	"state.signedOut.description": "请登录后继续。",
	"state.signedOut.action": "登录",
	"state.sessionExpired.title": "您的会话已过期",
	"state.sessionExpired.description": "此页面上的工作会保留。请继续以续期会话。",
	"state.sessionExpired.action": "继续",
	"state.stale.title": "数据可能已过时",
	"state.stale.description": "最后更新于{time}。",
	"state.stale.generic": "此视图最近没有刷新。",
	"state.stale.action": "刷新",
	"copy.label": "复制",
	"copy.copied": "已复制",
	"value.yes": "是",
	"value.no": "否",
	"value.more": "+{count}",
	"value.moreTitle": "另外 {count} 项：{items}",
	"value.fields": "{count} 个字段",
	"value.newTab": "（在新标签页中打开）",
	"panel.filter": "筛选",
	"propertyPanel.title": "属性",
	"propertyPanel.count": "{shown} / {total}",
	"propertyPanel.filter": "筛选属性",
	"propertyPanel.noMatch": "没有与“{query}”匹配的属性",
	"objectHeader.copyId": "复制 ID",
	"dataGrid.selectAll": "选择所有行",
	"dataGrid.selectRow": "选择 {label}",
	"dataGrid.empty": "没有行",
	"dataGrid.loading": "正在加载行",
	"dataGrid.loadingMore": "正在加载更多行",
	"dataGrid.rowActions": "{label} 的操作",
	"linkPanel.title": "链接",
	"linkPanel.summary": "{types} 种链接类型 · {objects} 个对象",
	"linkPanel.viewAll": "查看全部 {count} 个",
	"linkPanel.empty": "没有链接",
	"linkPanel.incoming": "传入",
	"graph.zoomIn": "放大",
	"graph.zoomOut": "缩小",
	"graph.reset": "重置视图",
	"graph.more": "另外 {count} 个",
	"graph.moreLabel": "另外 {count} 个 {relation} {type}",
	"pagination.label": "分页",
	"pagination.previous": "上一页",
	"pagination.next": "下一页",
	"pagination.page": "第 {page} 页，共 {count} 页",
	"pagination.pageOnly": "第 {page} 页",
	"search.clear": "清除搜索",
	"search.removeToken": "移除 {label}",
	"facet.clear": "清除",
	"facet.showMore": "再显示 {count} 项",
	"facet.showLess": "收起",
	"navRail.collapse": "收起导航",
	"navRail.expand": "展开导航",
	"palette.label": "命令面板",
	"palette.placeholder": "搜索或输入命令",
	"palette.results": "结果",
	"palette.empty": "没有结果",
	"palette.loading": "正在搜索",
	"palette.navigate": "移动",
	"palette.select": "选择",
	"palette.close": "关闭",
	"toast.region": "通知",
	"toast.dismiss": "关闭通知",
	"activity.empty": "暂无动态",
	"stat.increase": "增加",
	"stat.decrease": "减少",
	"preview.loading": "正在加载预览",
	"preview.unsupported.title": "此文件类型无法预览",
	"preview.unsupported.description": "下载后可在其他应用中打开。",
	"preview.tooLarge.title": "文件过大，无法预览",
	"preview.tooLarge.description": "{size} 超过了 {limit} 的预览上限。",
	"preview.blocked.title": "已阻止预览",
	"preview.blocked.description": "文件内容不是有效的 {kind}，因此不予显示。",
	"preview.unreadable": "无法以 {kind} 格式读取此文件。",
	"preview.truncatedBytes": "仅显示前 {shown}（共 {total}）。",
	"preview.truncatedStart": "仅显示前 {shown}。",
	"preview.truncatedTable": "显示 {rows}/{totalRows} 行、{columns}/{totalColumns} 列。",
	"preview.download": "下载",
	"preview.column": "第 {index} 列",
	"code.lines": "{count} 行",
	"code.wrap": "自动换行",
	"code.copy": "复制代码",
	"code.truncated": "仅显示前 {shown} 行（共 {total} 行）。"
}, v = {
	en: g,
	zh: _
};
function y(e) {
	return v[e.toLowerCase().split(/[-_]/)[0] ?? "en"] ?? g;
}
function b(e, t) {
	return t ? e.replace(/\{([a-zA-Z0-9_]+)\}/g, (e, n) => n in t ? String(t[n]) : e) : e;
}
//#endregion
//#region src/foundations/DesignSystemProvider.tsx
var x = "en", S = r(null);
function C(e, t) {
	let n = null, r = 0, i = {
		theme: e,
		density: t
	}, a = () => {
		n && (n.className = `mtc-root mtc-portal-root mtc-theme-${i.theme}`, n.dataset.theme = i.theme, n.dataset.density = i.density);
	};
	return {
		acquire() {
			return typeof document > "u" ? null : (n || (n = document.createElement("div"), a(), document.body.appendChild(n)), r += 1, n);
		},
		release() {
			r = Math.max(0, r - 1), r === 0 && n && (n.remove(), n = null);
		},
		update(e, t) {
			i = {
				theme: e,
				density: t
			}, a();
		}
	};
}
function w() {
	let e = o(S);
	return e ? {
		theme: e.theme,
		density: e.density
	} : null;
}
function T() {
	let e = o(S)?.portal, [t, n] = d(null);
	return s(() => {
		if (e) return n(e.acquire()), () => {
			e.release(), n(null);
		};
	}, [e]), t;
}
function E() {
	let e = o(S);
	return {
		locale: e?.locale ?? x,
		timeZone: e?.timeZone
	};
}
function D() {
	let e = o(S)?.messages ?? g;
	return a((t, n) => b(e[t], n), [e]);
}
function O({ theme: e, density: t, locale: n, timeZone: r, messages: i, children: a }) {
	let c = o(S), [u] = d(() => C(e, t));
	s(() => {
		u.update(e, t);
	}, [
		u,
		e,
		t
	]);
	let f = n ?? c?.locale ?? x, m = r ?? c?.timeZone, h = c?.messages, g = l(() => {
		let e = n === void 0 && h ? h : y(f);
		return i ? {
			...e,
			...i
		} : e;
	}, [
		n,
		f,
		h,
		i
	]), _ = l(() => ({
		theme: e,
		density: t,
		portal: u,
		locale: f,
		timeZone: m,
		messages: g
	}), [
		e,
		t,
		u,
		f,
		m,
		g
	]);
	return /* @__PURE__ */ p(S.Provider, {
		value: _,
		children: a
	});
}
var k = i(function({ theme: e = "dark", density: t = "standard", locale: n, timeZone: r, messages: i, className: a, children: o, ...s }, c) {
	return /* @__PURE__ */ p("div", {
		...s,
		ref: c,
		className: [
			"mtc-root",
			"mtc-design-system",
			`mtc-theme-${e}`,
			a
		].filter(Boolean).join(" "),
		"data-theme": e,
		"data-density": t,
		lang: n ?? s.lang,
		children: /* @__PURE__ */ p(O, {
			theme: e,
			density: t,
			locale: n,
			timeZone: r,
			messages: i,
			children: o
		})
	});
});
//#endregion
//#region src/foundations/intl.ts
function A(e) {
	let t = e instanceof Date ? e : new Date(e);
	return Number.isNaN(t.getTime()) ? null : t;
}
function j(e, { locale: t = "en", ...n } = {}) {
	return new Intl.NumberFormat(t, n).format(e);
}
var M = [
	"byte",
	"kilobyte",
	"megabyte",
	"gigabyte",
	"terabyte",
	"petabyte"
];
function N(e, { locale: t = "en" } = {}) {
	if (!Number.isFinite(e) || e < 0) return String(e);
	let n = e, r = 0;
	for (; n >= 1e3 && r < M.length - 1;) n /= 1e3, r += 1;
	return new Intl.NumberFormat(t, {
		style: "unit",
		unit: M[r],
		unitDisplay: r === 0 ? "long" : "short",
		maximumFractionDigits: r === 0 ? 0 : 1
	}).format(n);
}
function P(e, { locale: t = "en", timeZone: n, dateStyle: r = "medium", timeStyle: i = "short" } = {}) {
	let a = A(e);
	return a ? new Intl.DateTimeFormat(t, {
		timeZone: n,
		dateStyle: r === "none" ? void 0 : r,
		timeStyle: i === "none" ? void 0 : i
	}).format(a) : String(e);
}
var F = [
	["second", 60],
	["minute", 60],
	["hour", 24],
	["day", 30],
	["month", 12],
	["year", Infinity]
];
function I(e, { locale: t = "en", now: n = Date.now() } = {}) {
	let r = A(e);
	if (!r) return String(e);
	let i = (r.getTime() - n) / 1e3, a = new Intl.RelativeTimeFormat(t, { numeric: "auto" });
	for (let [e, t] of F) {
		if (Math.abs(i) < t) return a.format(Math.round(i), e);
		i /= t;
	}
	return a.format(Math.round(i), "year");
}
function L(e, { locale: t = "en" } = {}) {
	let n = Math.max(0, Math.ceil(e / 1e3)), [r, i] = n < 60 ? ["second", n] : n < 3600 ? ["minute", Math.ceil(n / 60)] : ["hour", Math.ceil(n / 3600)];
	return new Intl.NumberFormat(t, {
		style: "unit",
		unit: r,
		unitDisplay: "long"
	}).format(i);
}
//#endregion
//#region src/components/Icon.tsx
function R(e, t, n) {
	return `M${e - n} ${t}a${n} ${n} 0 1 0 ${2 * n} 0a${n} ${n} 0 1 0 ${-2 * n} 0`;
}
function z(e, t, n, r, i = 1.5) {
	return `M${e + i} ${t}h${n - 2 * i}a${i} ${i} 0 0 1 ${i} ${i}v${r - 2 * i}a${i} ${i} 0 0 1 ${-i} ${i}h${-(n - 2 * i)}a${i} ${i} 0 0 1 ${-i} ${-i}v${-(r - 2 * i)}a${i} ${i} 0 0 1 ${i} ${-i}z`;
}
var B = {
	add: "M12 5v14M5 12h14",
	minus: "M5 12h14",
	check: "m5 12 4 4L19 6",
	success: "m5 12 4 4L19 6",
	close: "m6 6 12 12M18 6 6 18",
	"chevron-down": "m7 9 5 5 5-5",
	"chevron-left": "m15 18-6-6 6-6",
	"chevron-right": "m9 18 6-6-6-6",
	"arrow-left": "M19 12H5m6-6-6 6 6 6",
	"arrow-right": "M5 12h14m-6-6 6 6-6 6",
	search: `${R(11, 11, 6.5)}M16 16l4 4`,
	menu: "M4 7h16M4 12h16M4 17h16",
	"panel-left": `${z(3, 4, 18, 16)}M9 4v16`,
	"panel-right": `${z(3, 4, 18, 16)}M15 4v16`,
	"external-link": "M14 5h5v5m-9 4 9-9m0 8v6H5V5h6",
	settings: `${R(12, 12, 3)}M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z`,
	spinner: "M12 3a9 9 0 1 0 9 9M21 3v6h-6",
	copy: `${z(8, 8, 12, 12)}M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3`,
	filter: "M4 5h16l-6 7.5V19l-4 2v-8.5z",
	columns: `${z(3, 4, 18, 16)}M9 4v16M15 4v16`,
	"sort-asc": "M7 20V4M3 8l4-4 4 4M13 7h3M13 12h5M13 17h8",
	"sort-desc": "M7 4v16m-4-4 4 4 4-4M13 7h8M13 12h5M13 17h3",
	refresh: "M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16m0 5v-5h-5",
	history: "M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 3.5v5h5M12 7.5V12l3 2",
	download: "M12 4v11m-5-5 5 5 5-5M5 20h14",
	upload: "M12 20V9m-5 5 5-5 5 5M5 4h14",
	edit: "M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zm10-13 3 3",
	trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
	eye: `M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z${R(12, 12, 3)}`,
	star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
	bolt: "M13 3 5 13h6l-1 8 8-10h-6z",
	"sign-in": "M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M3 12h11m-4-4 4 4-4 4",
	"sign-out": "M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m-1-8h12m-4-4 4 4-4 4",
	hourglass: "M7 3h10M7 21h10M8 3v2.5a4 4 0 0 0 1.6 3.2L12 11l2.4-2.3A4 4 0 0 0 16 5.5V3M8 21v-2.5a4 4 0 0 1 1.6-3.2L12 13l2.4 2.3a4 4 0 0 1 1.6 3.2V21",
	terminal: `${z(3, 4, 18, 16)}M7 9l3 3-3 3M12 15h5`,
	plug: "M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0zm6 9v4",
	info: `${R(12, 12, 9)}M12 11v5M12 8h.01`,
	warning: "M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01",
	error: `${R(12, 12, 9)}M9 9l6 6M15 9l-6 6`,
	home: "M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z",
	explore: `${R(12, 12, 9)}M15.5 8.5l-2 5-5 2 2-5z`,
	ontology: `${R(6, 7, 2.5)}${z(15, 4.5, 5, 5, 1)}M12 14l3.5 6h-7zM8.5 7h6.5M7.4 9.1l3.2 5M16.6 9.6 13.5 14`,
	topology: `${R(12, 5, 2)}${R(12, 13, 2)}${R(5, 19, 2)}${R(19, 19, 2)}M12 7v4m-1.6 3.2-3.8 3.4m7-3.4 3.8 3.4`,
	activity: "M3 12h4l3-8 4 16 3-8h4",
	object: `M12 3l8 4.5v9L12 21l-8-4.5v-9z${R(12, 12, 2.5)}`,
	person: `${R(12, 8, 3.5)}M5 20a7 7 0 0 1 14 0`,
	people: `${R(9, 8.5, 3)}M3.5 19a5.5 5.5 0 0 1 11 0${R(16.5, 9.5, 2.5)}M15.8 14.1A4.5 4.5 0 0 1 20.5 19`,
	organization: `${z(9, 3, 6, 5, 1)}${z(3, 16, 6, 5, 1)}${z(15, 16, 6, 5, 1)}M12 8v4M6 16v-4h12v4`,
	building: "M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3",
	contract: "M6 3h8l4 4v14H6zM14 3v4h4M9 11h6M9 16c1-1.5 2-1.5 2.5 0s1.5 1.5 3 0",
	document: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15h6M9 18h3",
	file: "M6 2h8l4 4v16H6ZM14 2v5h5",
	folder: "M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
	database: "M4 5a8 3 0 1 0 16 0A8 3 0 1 0 4 5M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7",
	dataset: "M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5",
	table: `${z(3, 4, 18, 16)}M3 9h18M3 14.5h18M9 9v11`,
	column: `${z(3, 4, 18, 16)}M3 9h18M10 4v16M14 4v16`,
	bucket: "M4 6h16l-1.8 13.2a1 1 0 0 1-1 .8H6.8a1 1 0 0 1-1-.8zM4 6c0-1.1 3.6-2 8-2s8 .9 8 2",
	link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
	graph: `${R(6, 6, 2)}${R(18, 8, 2)}${R(9, 18, 2)}M8 6.3l8 1.4M6.5 8l2 8M16.8 9.6l-6.6 6.8`,
	event: `${z(3, 5, 18, 16)}M3 10h18M8 3v4m8-4v4M11 14h2v2h-2z`,
	calendar: `${z(3, 5, 18, 16)}M3 10h18M8 3v4m8-4v4`,
	clock: `${R(12, 12, 9)}M12 7v5l3 2`,
	currency: `${R(12, 12, 9)}M14.5 9.5C14 8.5 13.1 8 12 8c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6.5V8m0 8v1.5`,
	order: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6m-6 4h3",
	package: "M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4m-8 4v10",
	truck: `M3 6h11v10H3zm11 4h4l3 3v3h-7z${R(7, 18, 2)}${R(17, 18, 2)}`,
	location: `M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z${R(12, 9.5, 2.5)}`,
	tag: `M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z${R(7.5, 7.5, 1.5)}`,
	flag: "M5 21V4h11l-2 4 2 4H5",
	alert: "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zm4 4.5a2 2 0 0 0 4 0",
	shield: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z",
	key: `${R(8, 15, 4)}M11 12l8-8M16 7l2 2M14 9l2 2`,
	lock: `${z(5, 11, 14, 10)}M8 11V8a4 4 0 0 1 8 0v3`,
	server: `${z(4, 4, 16, 7)}${z(4, 13, 16, 7)}M8 7.5h.01M8 16.5h.01`,
	cloud: "M7 19a4 4 0 0 1-.7-7.9 6 6 0 0 1 11.5-1.6A4.5 4.5 0 0 1 17.5 19z",
	branch: `${R(6, 5, 2)}${R(6, 19, 2)}${R(18, 7, 2)}M6 7v10m12-8v1a4 4 0 0 1-4 4H8a2 2 0 0 0-2 2`,
	commit: `${R(12, 12, 3.5)}M3 12h5.5m7 0H21`,
	workflow: `${z(3, 3, 6, 6, 1)}${z(15, 15, 6, 6, 1)}M9 6h4a4 4 0 0 1 4 4v5m-2.5-2.5L17 15l2.5-2.5`,
	play: "M8 5v14l11-7z",
	pause: "M8 5v14M16 5v14",
	film: `${z(3, 4, 18, 16)}M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4`,
	music: `M9 18V5l11-2v13${R(6, 18, 3)}${R(17, 16, 3)}`,
	image: `${z(3, 4, 18, 16)}${R(8.5, 9.5, 1.5)}M21 16l-5-5-9 9`,
	"chart-line": "M4 4v16h16M7 15l4-4 3 3 5-6",
	"chart-bar": "M4 4v16h16M8 16v-4m4 4V8m4 8v-6",
	globe: `${R(12, 12, 9)}M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z`,
	mail: `${z(3, 5, 18, 14)}M3.5 6.5 12 13l8.5-6.5`,
	phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
	ticket: "M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4zm11 0v2m0 3v2m0 3v1",
	tool: "M14.7 4.3a4.5 4.5 0 0 0 5 5.9L10 20a2.1 2.1 0 0 1-3-3l9.8-9.8a4.5 4.5 0 0 1-2.1-2.9z",
	badge: `${R(12, 9, 5)}M9 13.5 8 21l4-2 4 2-1-7.5`
}, ee = [...Object.keys(B), "more"], V = i(function({ name: e, label: t, size: n = "1em", className: r, strokeWidth: i = 1.75, ...a }, o) {
	return /* @__PURE__ */ p("svg", {
		...a,
		ref: o,
		className: ["mtc-icon", r].filter(Boolean).join(" "),
		width: n,
		height: n,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: i,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		role: t ? "img" : void 0,
		"aria-label": t,
		"aria-hidden": !t || void 0,
		focusable: "false",
		children: e === "more" ? /* @__PURE__ */ p("path", {
			d: `${R(5, 12, 1)}${R(12, 12, 1)}${R(19, 12, 1)}`,
			fill: "currentColor"
		}) : /* @__PURE__ */ p("path", { d: B[e] })
	});
}), H = i(function({ intent: e = "neutral", variant: t = "outline", size: r = "medium", density: i, loading: a = !1, loadingLabel: o, startIcon: s, endIcon: c, disabled: l, className: u, children: d, type: f = "button", ...h }, g) {
	let _ = D();
	return /* @__PURE__ */ m("button", {
		...h,
		ref: g,
		type: f,
		disabled: l || a,
		"aria-busy": a || void 0,
		className: n("mtc-button", i && `mtc-density-${i}`, u),
		"data-intent": e,
		"data-variant": t,
		"data-size": r,
		children: [
			a ? /* @__PURE__ */ p(V, {
				name: "spinner",
				className: "mtc-button-spinner"
			}) : s,
			/* @__PURE__ */ p("span", {
				className: "mtc-button-label",
				children: a ? o ?? _("button.working") : d
			}),
			!a && c
		]
	});
}), U = i(function({ icon: e, className: t, loading: r = !1, loadingLabel: i, "aria-label": a, ...o }, s) {
	let c = D(), l = i ?? c("button.working");
	return /* @__PURE__ */ p(H, {
		...o,
		ref: s,
		className: n("mtc-icon-button", t),
		"aria-label": r ? l : a,
		loading: r,
		loadingLabel: l,
		startIcon: e,
		children: /* @__PURE__ */ p("span", {
			className: "mtc-visually-hidden",
			children: r ? l : a
		})
	});
}), te = i(function({ label: e, density: t, className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ p("div", {
		...a,
		ref: o,
		role: "group",
		"aria-label": e,
		className: n("mtc-button-group", t && `mtc-density-${t}`, r),
		children: i
	});
}), ne = i(function({ intent: e = "neutral", size: t = "small", onRemove: r, removeLabel: i, className: a, children: o, ...s }, c) {
	let l = D();
	return /* @__PURE__ */ m("span", {
		...s,
		ref: c,
		className: n("mtc-tag", a),
		"data-intent": e,
		"data-size": t,
		children: [/* @__PURE__ */ p("span", { children: o }), r && /* @__PURE__ */ p("button", {
			type: "button",
			onClick: r,
			"aria-label": i ?? l("tag.remove"),
			className: "mtc-tag-remove",
			children: /* @__PURE__ */ p(V, { name: "close" })
		})]
	});
}), W = i(function({ intent: e = "neutral", size: t = "small", dot: r, className: i, children: a, ...o }, s) {
	return /* @__PURE__ */ m("span", {
		...o,
		ref: s,
		className: n("mtc-badge", i),
		"data-intent": e,
		"data-size": t,
		children: [r && /* @__PURE__ */ p("span", {
			className: "mtc-badge-dot",
			"aria-hidden": "true"
		}), a]
	});
}), re = i(function({ title: e, intent: t = "info", icon: r, actions: i, className: a, children: o, role: s, ...c }, l) {
	let u = t === "danger" ? "error" : t === "warning" ? "warning" : t === "success" ? "success" : "info";
	return /* @__PURE__ */ m("div", {
		...c,
		ref: l,
		role: s ?? (t === "danger" ? "alert" : "status"),
		className: n("mtc-callout", a),
		"data-intent": t,
		children: [/* @__PURE__ */ p("div", {
			className: "mtc-callout-icon",
			"aria-hidden": "true",
			children: r ?? /* @__PURE__ */ p(V, { name: u })
		}), /* @__PURE__ */ m("div", {
			className: "mtc-callout-content",
			children: [
				e && /* @__PURE__ */ p("div", {
					className: "mtc-callout-title",
					children: e
				}),
				/* @__PURE__ */ p("div", {
					className: "mtc-callout-body",
					children: o
				}),
				i && /* @__PURE__ */ p("div", {
					className: "mtc-callout-actions",
					children: i
				})
			]
		})]
	});
}), ie = {
	ok: "success",
	warning: "warning",
	danger: "danger",
	info: "info",
	neutral: "neutral"
}, ae = i(function({ tone: e = "neutral", size: t = "small", className: r, children: i, ...a }, o) {
	return /* @__PURE__ */ p(W, {
		...a,
		ref: o,
		dot: !0,
		intent: ie[e],
		size: t,
		"data-tone": e,
		className: n("mtc-status-badge", r),
		children: i
	});
}), G = i(function({ className: e, ...t }, r) {
	return /* @__PURE__ */ p("kbd", {
		...t,
		ref: r,
		className: n("mtc-kbd", e)
	});
});
function K(e) {
	let t = e.split(/[\s·._@-]+/u).filter((e) => /\p{L}|\p{N}/u.test(e));
	if (t.length === 0) return "?";
	let n = [...t[0]];
	if (t.length === 1) return n.slice(0, 2).join("").toUpperCase();
	let r = [...t[t.length - 1]];
	return `${n[0] ?? ""}${r[0] ?? ""}`.toUpperCase();
}
var oe = i(function({ name: e, src: t, size: r = 24, decorative: i = !1, className: a, ...o }, c) {
	let [l, u] = d(!1);
	return s(() => u(!1), [t]), /* @__PURE__ */ p("span", {
		...o,
		ref: c,
		className: n("mtc-avatar", a),
		"data-size": r,
		role: i ? void 0 : "img",
		"aria-label": i ? void 0 : e,
		"aria-hidden": i || void 0,
		title: i ? void 0 : e,
		children: t && !l ? /* @__PURE__ */ p("img", {
			src: t,
			alt: "",
			onError: () => u(!0)
		}) : /* @__PURE__ */ p("span", {
			"aria-hidden": "true",
			children: K(e)
		})
	});
}), se = i(function({ width: e, height: t, shape: r = "line", lines: i, className: a, style: o, ...s }, c) {
	let l = (e) => typeof e == "number" ? `${e}px` : e;
	return i && i > 1 ? /* @__PURE__ */ p("span", {
		...s,
		ref: c,
		"aria-hidden": "true",
		className: n("mtc-skeleton-lines", a),
		style: {
			width: l(e),
			...o
		},
		children: Array.from({ length: i }, (e, t) => /* @__PURE__ */ p("span", {
			className: "mtc-skeleton",
			"data-shape": "line",
			style: t === i - 1 ? { width: "60%" } : void 0
		}, t))
	}) : /* @__PURE__ */ p("span", {
		...s,
		ref: c,
		"aria-hidden": "true",
		className: n("mtc-skeleton", a),
		"data-shape": r,
		style: {
			width: l(e),
			height: l(t),
			...o
		}
	});
}), ce = 1500, le = i(function({ value: e, label: t, copiedLabel: r, size: i = "small", clipboard: a, onCopied: o, className: c, ...l }, f) {
	let h = D(), [g, _] = d(!1), v = u(void 0);
	s(() => () => clearTimeout(v.current), []);
	let y = async () => {
		let t = a ?? (typeof navigator < "u" ? navigator.clipboard : void 0);
		if (t) {
			try {
				await t.writeText(e);
			} catch {
				return;
			}
			_(!0), o?.(e), clearTimeout(v.current), v.current = setTimeout(() => _(!1), ce);
		}
	};
	return /* @__PURE__ */ m("span", {
		className: n("mtc-copy-button", c),
		"data-copied": g || void 0,
		children: [/* @__PURE__ */ p(U, {
			...l,
			ref: f,
			variant: "ghost",
			size: i,
			icon: /* @__PURE__ */ p(V, { name: g ? "check" : "copy" }),
			"aria-label": t ?? h("copy.label"),
			onClick: () => void y()
		}), /* @__PURE__ */ p("span", {
			role: "status",
			className: "mtc-visually-hidden",
			children: g ? r ?? h("copy.copied") : ""
		})]
	});
}), ue = i(function({ items: e, className: t, ...r }, i) {
	return /* @__PURE__ */ p("ul", {
		...r,
		ref: i,
		className: n("mtc-meta-row", t),
		children: e.filter((e) => e != null && e !== !1).map((e, t) => /* @__PURE__ */ p("li", {
			className: "mtc-meta-item",
			children: e
		}, t))
	});
}), de = i(function({ title: e, subtitle: t, actions: r, footer: i, headingLevel: a = 2, padded: o = !1, className: s, children: l, ...u }, d) {
	let f = c(), h = `h${a}`;
	return /* @__PURE__ */ m("section", {
		...u,
		ref: d,
		"aria-labelledby": f,
		className: n("mtc-panel", s),
		children: [
			/* @__PURE__ */ m("header", {
				className: "mtc-panel-header",
				children: [
					/* @__PURE__ */ p(h, {
						id: f,
						className: "mtc-panel-title",
						children: e
					}),
					t != null && /* @__PURE__ */ p("span", {
						className: "mtc-panel-subtitle",
						children: t
					}),
					r && /* @__PURE__ */ p("div", {
						className: "mtc-panel-actions",
						children: r
					})
				]
			}),
			/* @__PURE__ */ p("div", {
				className: "mtc-panel-body",
				"data-padded": o || void 0,
				children: l
			}),
			i && /* @__PURE__ */ p("footer", {
				className: "mtc-panel-footer",
				children: i
			})
		]
	});
});
//#endregion
//#region src/components/CommandPalette.tsx
function fe({ open: n, onOpenChange: r, query: i, onQueryChange: a, groups: o, onSelect: g, onSubmit: _, autoHighlight: v = !0, label: y, placeholder: b, loading: x = !1, emptyLabel: S, footer: C, hotkey: w = !0 }) {
	let E = D(), O = T(), k = c(), A = u(null), j = u(null), M = u(null), N = l(() => o.flatMap((e) => e.items.filter((e) => !e.disabled)), [o]), [P, F] = d(null);
	if (e(n, A, j), s(() => {
		F(v ? N[0]?.id ?? null : null);
	}, [N, v]), s(() => {
		if (!w) return;
		let e = (e) => {
			(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && (e.preventDefault(), r(!n));
		};
		return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
	}, [
		w,
		n,
		r
	]), s(() => {
		P && M.current?.querySelector(`[data-command-id="${CSS.escape(P)}"]`)?.scrollIntoView({ block: "nearest" });
	}, [P]), !n) return null;
	let I = (e) => `${k}-option-${e}`, L = (e) => {
		if (N.length === 0) return;
		let t = P ? N.findIndex((e) => e.id === P) : -1, n = t < 0 ? e === 1 ? 0 : N.length - 1 : (t + e + N.length) % N.length;
		F(N[n].id);
	}, R = (e) => {
		e.disabled || (g(e), r(!1));
	}, z = /* @__PURE__ */ p("div", {
		className: "mtc-modal-backdrop mtc-overlay mtc-command-backdrop",
		onMouseDown: (e) => {
			e.target === e.currentTarget && r(!1);
		},
		children: /* @__PURE__ */ m("div", {
			ref: A,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": y ?? E("palette.label"),
			tabIndex: -1,
			className: "mtc-command-palette",
			onKeyDown: (e) => t(e, A, !0, () => r(!1)),
			children: [
				/* @__PURE__ */ m("div", {
					className: "mtc-command-input-row",
					children: [
						/* @__PURE__ */ p(V, {
							name: "search",
							className: "mtc-command-input-icon"
						}),
						/* @__PURE__ */ p("input", {
							ref: j,
							type: "text",
							role: "combobox",
							"aria-expanded": "true",
							"aria-controls": `${k}-listbox`,
							"aria-activedescendant": P ? I(P) : void 0,
							"aria-autocomplete": "list",
							"aria-label": y ?? E("palette.label"),
							placeholder: b ?? E("palette.placeholder"),
							className: "mtc-command-input",
							value: i,
							onChange: (e) => a(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault(), L(e.key === "ArrowDown" ? 1 : -1);
								else if (e.key === "Enter") {
									e.preventDefault();
									let t = P ? N.find((e) => e.id === P) : void 0;
									t ? R(t) : _ && (_(i), r(!1));
								}
							}
						}),
						x && /* @__PURE__ */ p(V, {
							name: "spinner",
							className: "mtc-command-spinner",
							label: E("palette.loading")
						})
					]
				}),
				/* @__PURE__ */ m("div", {
					ref: M,
					id: `${k}-listbox`,
					role: "listbox",
					"aria-label": E("palette.results"),
					className: "mtc-command-list",
					children: [o.map((e) => e.items.length > 0 && /* @__PURE__ */ m("div", {
						role: "group",
						"aria-labelledby": `${k}-group-${e.id}`,
						className: "mtc-command-group",
						children: [/* @__PURE__ */ p("div", {
							id: `${k}-group-${e.id}`,
							className: "mtc-command-group-label",
							role: "presentation",
							children: e.label
						}), e.items.map((e) => /* @__PURE__ */ m("div", {
							id: I(e.id),
							role: "option",
							"aria-selected": e.id === P,
							"aria-disabled": e.disabled || void 0,
							"data-command-id": e.id,
							className: "mtc-command-item",
							onMouseMove: () => {
								!e.disabled && e.id !== P && F(e.id);
							},
							onMouseDown: (e) => e.preventDefault(),
							onClick: () => R(e),
							children: [
								e.icon && /* @__PURE__ */ p("span", {
									className: "mtc-command-item-icon",
									children: e.icon
								}),
								/* @__PURE__ */ m("span", {
									className: "mtc-command-item-copy",
									children: [/* @__PURE__ */ p("span", {
										className: "mtc-command-item-label",
										children: e.label
									}), e.description && /* @__PURE__ */ p("span", {
										className: "mtc-command-item-description",
										children: e.description
									})]
								}),
								e.shortcut && /* @__PURE__ */ p(G, { children: e.shortcut })
							]
						}, e.id))]
					}, e.id)), N.length === 0 && i.trim() !== "" && !x && /* @__PURE__ */ p("div", {
						className: "mtc-command-empty",
						role: "presentation",
						children: S ?? E("palette.empty")
					})]
				}),
				/* @__PURE__ */ p("div", {
					className: "mtc-command-footer",
					children: C ?? /* @__PURE__ */ m(f, { children: [
						/* @__PURE__ */ m("span", { children: [
							/* @__PURE__ */ p(G, { children: "↑" }),
							" ",
							/* @__PURE__ */ p(G, { children: "↓" }),
							" ",
							E("palette.navigate")
						] }),
						/* @__PURE__ */ m("span", { children: [
							/* @__PURE__ */ p(G, { children: "↵" }),
							" ",
							E("palette.select")
						] }),
						/* @__PURE__ */ m("span", { children: [
							/* @__PURE__ */ p(G, { children: "Esc" }),
							" ",
							E("palette.close")
						] })
					] })
				})
			]
		})
	});
	return O ? h(z, O) : z;
}
//#endregion
//#region src/components/Toast.tsx
var pe = {
	neutral: "info",
	info: "info",
	success: "success",
	warning: "warning",
	danger: "error"
}, me = 5e3, he = 8e3;
function ge({ toast: e, onDismiss: t }) {
	let n = D(), r = e.intent ?? "neutral", i = e.duration ?? (r === "danger" ? he : me), [a, o] = d(!1), c = u(i);
	return s(() => {
		if (i <= 0 || a) return;
		let n = Date.now(), r = setTimeout(() => t(e.id), c.current);
		return () => {
			clearTimeout(r), c.current = Math.max(0, c.current - (Date.now() - n));
		};
	}, [
		i,
		a,
		t,
		e.id
	]), /* @__PURE__ */ m("li", {
		className: "mtc-toast",
		"data-intent": r,
		role: r === "danger" ? "alert" : "status",
		onMouseEnter: () => o(!0),
		onMouseLeave: () => o(!1),
		onFocus: () => o(!0),
		onBlur: () => o(!1),
		children: [
			/* @__PURE__ */ p(V, {
				name: pe[r],
				className: "mtc-toast-icon"
			}),
			/* @__PURE__ */ m("div", {
				className: "mtc-toast-content",
				children: [
					/* @__PURE__ */ p("div", {
						className: "mtc-toast-title",
						children: e.title
					}),
					e.description && /* @__PURE__ */ p("div", {
						className: "mtc-toast-description",
						children: e.description
					}),
					e.action && /* @__PURE__ */ p(H, {
						size: "small",
						variant: "ghost",
						intent: "primary",
						className: "mtc-toast-action",
						onClick: () => {
							e.action?.onClick(), t(e.id);
						},
						children: e.action.label
					})
				]
			}),
			/* @__PURE__ */ p(U, {
				icon: /* @__PURE__ */ p(V, { name: "close" }),
				"aria-label": n("toast.dismiss"),
				variant: "ghost",
				size: "small",
				onClick: () => t(e.id)
			})
		]
	});
}
function q({ toasts: e, onDismiss: t, placement: n = "bottom-end" }) {
	let r = D(), i = T();
	if (e.length === 0) return null;
	let a = /* @__PURE__ */ p("section", {
		"aria-label": r("toast.region"),
		className: "mtc-toaster",
		"data-placement": n,
		children: /* @__PURE__ */ p("ol", { children: e.map((e) => /* @__PURE__ */ p(ge, {
			toast: e,
			onDismiss: t
		}, e.id)) })
	});
	return i ? h(a, i) : a;
}
var J = r(null);
function _e({ children: e, limit: t = 4, placement: n }) {
	let [r, i] = d([]), o = u(0), s = a((e) => {
		i((t) => t.filter((t) => t.id !== e));
	}, []), c = a(({ id: e, ...n }) => {
		o.current += 1;
		let r = e ?? `toast-${o.current}`;
		return i((e) => [...e.filter((e) => e.id !== r), {
			...n,
			id: r
		}].slice(-t)), r;
	}, [t]), f = l(() => ({
		toast: c,
		dismiss: s
	}), [c, s]);
	return /* @__PURE__ */ m(J.Provider, {
		value: f,
		children: [e, /* @__PURE__ */ p(q, {
			toasts: r,
			onDismiss: s,
			placement: n
		})]
	});
}
function ve() {
	let e = o(J);
	if (!e) throw Error("useToast must be used inside a ToastProvider");
	return e;
}
//#endregion
//#region src/workbench/States.tsx
var ye = i(function({ title: e, description: t, icon: r, actions: i, compact: a, className: o, ...s }, c) {
	return /* @__PURE__ */ m("div", {
		...s,
		ref: c,
		className: n("mtc-state", o),
		"data-compact": a,
		children: [
			r && /* @__PURE__ */ p("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: r
			}),
			/* @__PURE__ */ p("div", {
				className: "mtc-state-title",
				children: e
			}),
			t && /* @__PURE__ */ p("div", {
				className: "mtc-state-description",
				children: t
			}),
			i && /* @__PURE__ */ p("div", {
				className: "mtc-state-actions",
				children: i
			})
		]
	});
}), be = i(function({ label: e, description: t, variant: r = "spinner", lines: i = 3, compact: a, className: o, ...s }, c) {
	let l = D();
	return /* @__PURE__ */ m("div", {
		...s,
		ref: c,
		role: "status",
		"aria-live": "polite",
		"aria-busy": "true",
		className: n("mtc-state mtc-loading-state", o),
		"data-compact": a,
		children: [
			r === "spinner" ? /* @__PURE__ */ p(V, {
				name: "spinner",
				className: "mtc-state-spinner"
			}) : /* @__PURE__ */ p("div", {
				className: "mtc-state-skeleton",
				"aria-hidden": "true",
				children: Array.from({ length: xe(i) }).map((e, t) => /* @__PURE__ */ p("span", { style: { width: `${88 - t * 9}%` } }, t))
			}),
			/* @__PURE__ */ p("div", {
				className: "mtc-state-title",
				children: e ?? l("state.loading")
			}),
			t && /* @__PURE__ */ p("div", {
				className: "mtc-state-description",
				children: t
			})
		]
	});
});
function xe(e) {
	return Number.isFinite(e) ? Math.max(1, Math.min(Math.trunc(e), 8)) : 3;
}
var Y = {
	unauthenticated: ["error.unauthenticated.title", "error.unauthenticated.description"],
	forbidden: ["error.forbidden.title", "error.forbidden.description"],
	not_found: ["error.not_found.title", "error.not_found.description"],
	rate_limited: ["error.rate_limited.title", "error.rate_limited.description"],
	unavailable: ["error.unavailable.title", "error.unavailable.description"],
	invalid: ["error.invalid.title", "error.invalid.description"],
	unknown: ["state.error.title", "error.unknown.description"]
};
function Se(e, t, n) {
	let [r, i] = Y[e.kind] ?? Y.unknown;
	return e.kind === "rate_limited" && e.retryAfterMs !== void 0 ? [t(r), t("error.rate_limited.retryIn", { duration: L(e.retryAfterMs, { locale: n }) })] : [t(r), t(i)];
}
function X({ reason: e, code: t, requestId: n }) {
	let r = D();
	return !e && !t && !n ? null : /* @__PURE__ */ m("details", {
		className: "mtc-state-details",
		children: [
			/* @__PURE__ */ p("summary", { children: r("state.details") }),
			e && /* @__PURE__ */ p("p", { children: e }),
			(t || n) && /* @__PURE__ */ m("dl", { children: [t && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("dt", { children: r("state.errorCode") }), /* @__PURE__ */ p("dd", { children: /* @__PURE__ */ p("code", { children: t }) })] }), n && /* @__PURE__ */ m(f, { children: [/* @__PURE__ */ p("dt", { children: r("state.requestId") }), /* @__PURE__ */ p("dd", { children: /* @__PURE__ */ p("code", { children: n }) })] })] })
		]
	});
}
var Z = i(function({ title: e, message: t, error: r, onRetry: i, retryLabel: a, actions: o, compact: s, intent: c, className: l, ...u }, d) {
	let f = D(), { locale: h } = E(), [g, _] = r ? Se(r, f, h) : [void 0, void 0], v = c ?? (r && (r.kind === "rate_limited" || r.kind === "unavailable") ? "warning" : "danger");
	return /* @__PURE__ */ m("div", {
		...u,
		ref: d,
		role: "alert",
		className: n("mtc-state mtc-error-state", l),
		"data-compact": s,
		"data-intent": v,
		"data-error-kind": r?.kind,
		children: [
			/* @__PURE__ */ p("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ p(V, { name: v === "warning" ? "warning" : "error" })
			}),
			/* @__PURE__ */ p("div", {
				className: "mtc-state-title",
				children: e ?? g ?? f("state.error.title")
			}),
			/* @__PURE__ */ p("div", {
				className: "mtc-state-description",
				children: t ?? _
			}),
			r && /* @__PURE__ */ p(X, {
				reason: r.message,
				code: r.code,
				requestId: r.requestId
			}),
			(i || o) && /* @__PURE__ */ m("div", {
				className: "mtc-state-actions",
				children: [i && /* @__PURE__ */ p(H, {
					size: "small",
					onClick: i,
					children: a ?? f("state.retry")
				}), o]
			})
		]
	});
}), Q = i(function({ icon: e, tone: t, state: r, title: i, description: a, error: o, actions: s, primaryAction: c, compact: l, className: u, ...d }, f) {
	return /* @__PURE__ */ m("div", {
		role: "status",
		...d,
		ref: f,
		className: n("mtc-state", u),
		"data-compact": l,
		"data-intent": t,
		"data-state": r,
		children: [
			/* @__PURE__ */ p("div", {
				className: "mtc-state-icon",
				"aria-hidden": "true",
				children: /* @__PURE__ */ p(V, { name: e })
			}),
			/* @__PURE__ */ p("div", {
				className: "mtc-state-title",
				children: i
			}),
			a && /* @__PURE__ */ p("div", {
				className: "mtc-state-description",
				children: a
			}),
			o && /* @__PURE__ */ p(X, {
				reason: o.message,
				code: o.code,
				requestId: o.requestId
			}),
			(c || s) && /* @__PURE__ */ m("div", {
				className: "mtc-state-actions",
				children: [c, s]
			})
		]
	});
}), Ce = i(function({ resource: e, title: t, description: n, ...r }, i) {
	let a = D();
	return /* @__PURE__ */ p(Q, {
		...r,
		ref: i,
		icon: "lock",
		tone: "neutral",
		state: "access-denied",
		title: t ?? a("error.forbidden.title"),
		description: n ?? (e ? a("state.accessDenied.resource", { resource: e }) : a("error.forbidden.description"))
	});
}), we = i(function({ onSignIn: e, signInLabel: t, title: n, description: r, ...i }, a) {
	let o = D();
	return /* @__PURE__ */ p(Q, {
		...i,
		ref: a,
		icon: "sign-in",
		tone: "neutral",
		state: "signed-out",
		title: n ?? o("state.signedOut.title"),
		description: r ?? o("state.signedOut.description"),
		primaryAction: e && /* @__PURE__ */ p(H, {
			size: "small",
			intent: "primary",
			variant: "solid",
			onClick: e,
			children: t ?? o("state.signedOut.action")
		})
	});
}), Te = i(function({ onContinue: e, continueLabel: t, title: n, description: r, ...i }, a) {
	let o = D();
	return /* @__PURE__ */ p(Q, {
		...i,
		ref: a,
		icon: "hourglass",
		tone: "neutral",
		state: "session-expired",
		title: n ?? o("state.sessionExpired.title"),
		description: r ?? o("state.sessionExpired.description"),
		primaryAction: e && /* @__PURE__ */ p(H, {
			size: "small",
			intent: "primary",
			variant: "solid",
			onClick: e,
			children: t ?? o("state.sessionExpired.action")
		})
	});
}), Ee = i(function({ resource: e, title: t, description: n, ...r }, i) {
	let a = D();
	return /* @__PURE__ */ p(Q, {
		...r,
		ref: i,
		icon: "search",
		tone: "neutral",
		state: "not-found",
		title: t ?? a("error.not_found.title"),
		description: n ?? (e ? a("state.notFound.resource", { resource: e }) : a("error.not_found.description"))
	});
}), $ = i(function({ retryAfterMs: e, onRetry: t, retryLabel: n, title: r, description: i, error: a, ...o }, s) {
	let c = D(), { locale: l } = E(), u = e ?? a?.retryAfterMs;
	return /* @__PURE__ */ p(Q, {
		...o,
		ref: s,
		error: a,
		icon: "clock",
		tone: "warning",
		state: "rate-limited",
		title: r ?? c("error.rate_limited.title"),
		description: i ?? (u === void 0 ? c("error.rate_limited.description") : c("error.rate_limited.retryIn", { duration: L(u, { locale: l }) })),
		primaryAction: t && /* @__PURE__ */ p(H, {
			size: "small",
			onClick: t,
			children: n ?? c("state.retry")
		})
	});
}), De = i(function({ lastUpdated: e, now: t, onRefresh: n, title: r, description: i, ...a }, o) {
	let s = D(), { locale: c } = E();
	return /* @__PURE__ */ p(Q, {
		...a,
		ref: o,
		icon: "history",
		tone: "warning",
		state: "stale",
		title: r ?? s("state.stale.title"),
		description: i ?? (e === void 0 ? s("state.stale.generic") : s("state.stale.description", { time: I(e, {
			locale: c,
			now: t
		}) })),
		primaryAction: n && /* @__PURE__ */ p(H, {
			size: "small",
			onClick: n,
			children: s("state.stale.action")
		})
	});
}), Oe = i(function({ error: e, resource: t, onRetry: n, onRenewSession: r, ...i }, a) {
	switch (e.kind) {
		case "unauthenticated": return /* @__PURE__ */ p(Te, {
			...i,
			ref: a,
			error: e,
			onContinue: r ?? n
		});
		case "forbidden": return /* @__PURE__ */ p(Ce, {
			...i,
			ref: a,
			error: e,
			resource: t
		});
		case "not_found": return /* @__PURE__ */ p(Ee, {
			...i,
			ref: a,
			error: e,
			resource: t
		});
		case "rate_limited": return /* @__PURE__ */ p($, {
			...i,
			ref: a,
			error: e,
			onRetry: n
		});
		default: return /* @__PURE__ */ p(Z, {
			...i,
			ref: a,
			error: e,
			onRetry: n
		});
	}
});
//#endregion
export { V as A, D as B, W as C, te as D, H as E, I as F, b as G, g as H, k as I, O as L, P as M, L as N, U as O, j as P, w as R, K as S, ne as T, _ as U, T as V, y as W, G as _, Ee as a, se as b, we as c, _e as d, q as f, le as g, oe as h, be as i, N as j, ee as k, Oe as l, fe as m, ye as n, $ as o, ve as p, Z as r, Te as s, Ce as t, De as u, ue as v, re as w, ae as x, de as y, E as z };
