//#region src/widgets/recordShapes.ts
function e(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function t(t) {
	return e(t) ? t : {};
}
function n(e) {
	return e == null || e === "" ? void 0 : String(e);
}
function r(e) {
	return Array.isArray(e) ? e.map(String) : [];
}
function i(t) {
	return e(t) ? Object.fromEntries(Object.entries(t).filter(([, e]) => e != null).map(([e, t]) => [e, String(t)])) : {};
}
function a(e) {
	if (typeof e == "number" && Number.isFinite(e)) return e;
	if (typeof e == "string" && e.trim() !== "") {
		let t = Number(e);
		if (Number.isFinite(t)) return t;
	}
}
var o = {
	1: "text",
	2: "long_text",
	3: "number",
	4: "currency",
	5: "percent",
	6: "boolean",
	7: "date",
	8: "datetime",
	9: "single_select",
	10: "multi_select",
	11: "user",
	12: "link",
	13: "attachment",
	14: "url",
	15: "email",
	16: "phone",
	17: "formula",
	18: "lookup",
	19: "rollup",
	20: "created_at",
	21: "updated_at"
}, s = {
	1: "grid",
	2: "board",
	3: "calendar",
	4: "gallery",
	5: "list",
	6: "timeline",
	7: "form"
};
function c(e, t) {
	return String(e ?? "").replace(t, "").toLowerCase();
}
function l(e) {
	let t = o[String(e)];
	if (t) return t;
	let n = c(e, "RECORD_FIELD_TYPE_");
	return Object.values(o).includes(n) ? n : "text";
}
function u(e) {
	let t = s[String(e)];
	if (t) return t;
	let n = c(e, "RECORD_VIEW_TYPE_");
	return Object.values(s).includes(n) ? n : "grid";
}
function d(e) {
	return typeof e == "boolean" ? "boolean" : typeof e == "number" ? "number" : Array.isArray(e) ? "multi_select" : "text";
}
function f(e) {
	return e === "formula" || e === "lookup" || e === "rollup" || e === "created_at" || e === "updated_at";
}
function p(t, r) {
	let i = (Array.isArray(t.fields) ? t.fields : []).filter(e).map((t) => {
		let r = l(t.type), i = (Array.isArray(t.choices) ? t.choices : []).filter(e).map((e) => ({
			value: String(e.value ?? ""),
			label: String(e.label ?? e.value ?? ""),
			color: n(e.color)
		})).filter((e) => e.value);
		return {
			key: String(t.key ?? ""),
			label: String(t.label ?? t.key ?? ""),
			type: r,
			description: n(t.description),
			required: t.required === !0,
			readOnly: t.readOnly === !0 || t.read_only === !0 || f(r),
			choices: i,
			linkedTableId: n(t.linkedTableId ?? t.linked_table_id),
			allowMultiple: t.allowMultiple === !0 || t.allow_multiple === !0,
			format: n(t.format),
			defaultValue: t.defaultValue ?? t.default_value
		};
	}).filter((e) => e.key);
	return i.length > 0 ? i : [...new Set(r.flatMap((e) => Object.keys(e.values)))].map((e) => {
		let t = r.find((t) => t.values[e] != null)?.values[e];
		return {
			key: e,
			label: e,
			type: d(t),
			required: !1,
			readOnly: !1,
			choices: [],
			allowMultiple: Array.isArray(t)
		};
	});
}
function m(o) {
	let s = t(o), c = (Array.isArray(s.records) ? s.records : Array.isArray(s.rows) ? s.rows : []).filter(e).map((t, r) => {
		let a = e(t.values) ? t.values : Object.fromEntries(Object.entries(t).filter(([e]) => ![
			"id",
			"_id",
			"createdAt",
			"created_at",
			"updatedAt",
			"updated_at",
			"revision",
			"context"
		].includes(e)));
		return {
			id: String(t.id ?? t._id ?? `record-${r + 1}`),
			values: a,
			createdAt: n(t.createdAt ?? t.created_at),
			updatedAt: n(t.updatedAt ?? t.updated_at),
			revision: n(t.revision),
			context: i(t.context)
		};
	}).filter((e) => e.id), l = p(s, c), d = (Array.isArray(s.views) ? s.views : []).filter(e).map((t) => ({
		id: String(t.id ?? ""),
		name: String(t.name ?? t.id ?? ""),
		type: u(t.type),
		visibleFields: r(t.visibleFields ?? t.visible_fields),
		groupBy: n(t.groupBy ?? t.group_by),
		dateField: n(t.dateField ?? t.date_field),
		titleField: n(t.titleField ?? t.title_field),
		sorts: (Array.isArray(t.sorts) ? t.sorts : []).filter(e).map((e) => ({
			field: String(e.field ?? ""),
			descending: e.descending === !0
		})).filter((e) => e.field),
		filters: (Array.isArray(t.filters) ? t.filters : []).filter(e).map((e) => ({
			field: String(e.field ?? ""),
			operator: String(e.operator ?? "eq").toLowerCase(),
			value: e.value
		})).filter((e) => e.field)
	})).filter((e) => e.id), f = t(s.capabilities), m = String(s.tableId ?? s.table_id ?? ""), h = String(s.tableName ?? s.table_name ?? m);
	return !m && !h && l.length === 0 && c.length === 0 ? null : {
		workspaceId: String(s.workspaceId ?? s.workspace_id ?? ""),
		tableId: m,
		tableName: h,
		primaryField: String(s.primaryField ?? s.primary_field ?? l[0]?.key ?? "id"),
		fields: l,
		records: c,
		views: d,
		activeViewId: n(s.activeViewId ?? s.active_view_id),
		total: a(s.total),
		nextPageToken: n(s.nextPageToken ?? s.next_page_token),
		capabilities: {
			create: f.create === !0,
			update: f.update === !0,
			delete: f.delete === !0,
			createActionId: String(f.createActionId ?? f.create_action_id ?? "record_create"),
			updateActionId: String(f.updateActionId ?? f.update_action_id ?? "record_update"),
			deleteActionId: String(f.deleteActionId ?? f.delete_action_id ?? "record_delete")
		}
	};
}
function h(e) {
	return !e.readOnly && e.type !== "attachment";
}
function g(e, t) {
	return Object.fromEntries(e.map((e) => [e.key, t ? t.values[e.key] : e.defaultValue ?? null]));
}
function _(e, t, n) {
	let r = e.filter(h).filter((e) => JSON.stringify(t[e.key]) !== JSON.stringify(n?.values[e.key])).map((e) => [e.key, t[e.key]]);
	return Object.fromEntries(r);
}
function v(t, n, r = t.primaryField) {
	let i = n.values[r] ?? n.values[t.primaryField];
	return e(i) ? String(i.label ?? i.name ?? i.id ?? n.id) : Array.isArray(i) ? i.map(y).join(", ") || n.id : i == null || i === "" ? n.id : String(i);
}
function y(t) {
	return t == null ? "" : e(t) ? String(t.label ?? t.name ?? t.id ?? "") : Array.isArray(t) ? t.map(y).filter(Boolean).join(", ") : typeof t == "boolean" ? t ? "Yes" : "No" : String(t);
}
function b(e) {
	if (typeof e == "string" && /^\d{4}-\d{2}-\d{2}$/.test(e)) return e;
	let t = e instanceof Date ? e : typeof e == "string" || typeof e == "number" ? new Date(e) : null;
	return !t || Number.isNaN(t.getTime()) ? null : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
function x(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0;
}
function S(t) {
	return e(t) ? t.id ?? t.value ?? t.label ?? t.name ?? "" : t;
}
function C(e, t) {
	let n = S(e), r = S(t);
	return typeof n == "number" && typeof r == "number" ? n === r : String(n ?? "").toLowerCase() === String(r ?? "").toLowerCase();
}
function w(e, t) {
	if (e) return e.choices.find((e) => C(e.value, t))?.color;
}
function T(e, t) {
	let n = e.values[t.field], r = t.value;
	switch (t.operator) {
		case "empty": return x(n);
		case "not_empty": return !x(n);
		case "neq": return !C(n, r);
		case "contains": return Array.isArray(n) ? n.some((e) => C(e, r)) : y(n).toLowerCase().includes(y(r).toLowerCase());
		case "in": {
			let e = Array.isArray(r) ? r : [r];
			return (Array.isArray(n) ? n : [n]).some((t) => e.some((e) => C(t, e)));
		}
		case "gt": return Number(S(n)) > Number(S(r));
		case "gte": return Number(S(n)) >= Number(S(r));
		case "lt": return Number(S(n)) < Number(S(r));
		case "lte": return Number(S(n)) <= Number(S(r));
		default: return C(n, r);
	}
}
function E(e, t) {
	if (!t) return e;
	let n = t.filters.length > 0 ? e.filter((e) => t.filters.every((t) => T(e, t))) : e;
	return t.sorts.length === 0 ? n : n.map((e, t) => ({
		record: e,
		index: t
	})).sort((e, n) => {
		for (let r of t.sorts) {
			let t = S(e.record.values[r.field]), i = S(n.record.values[r.field]);
			if (t == null && i == null) continue;
			if (t == null) return 1;
			if (i == null) return -1;
			let a = typeof t == "number" && typeof i == "number" ? t - i : String(t).localeCompare(String(i), void 0, {
				numeric: !0,
				sensitivity: "base"
			});
			if (a !== 0) return r.descending ? -a : a;
		}
		return e.index - n.index;
	}).map((e) => e.record);
}
function D(e, t, n) {
	return e.views.find((e) => e.id === n && e.type === t) ?? e.views.find((n) => n.id === e.activeViewId && n.type === t) ?? e.views.find((e) => e.type === t);
}
//#endregion
export { h as a, b as c, y as d, g as i, T as l, _ as n, m as o, D as r, w as s, E as t, v as u };
