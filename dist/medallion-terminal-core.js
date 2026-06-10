import { jsxs as f, jsx as s, Fragment as lt } from "react/jsx-runtime";
import { useState as v, useEffect as j, useCallback as ce, useRef as F, useMemo as L, lazy as Zn, Component as Qn, useContext as At, createContext as _t, Suspense as er } from "react";
import { ResponsiveContainer as _e, LineChart as tr, CartesianGrid as Ve, XAxis as Ge, YAxis as Je, Tooltip as Te, Line as nr, Brush as mn, ReferenceLine as rr, ReferenceArea as sr, ReferenceDot as or, PieChart as ir, Pie as lr, Cell as pn, BarChart as hn, Bar as bn, ScatterChart as ar, ZAxis as cr, Scatter as ur, Treemap as dr, AreaChart as fr, Area as mr, RadarChart as pr, PolarGrid as hr, PolarAngleAxis as br, PolarRadiusAxis as gr, Legend as xr, Radar as yr } from "recharts";
import { createChart as vr, ColorType as wr, CandlestickSeries as kr, HistogramSeries as Nr, createSeriesMarkers as Sr } from "lightweight-charts";
function $t() {
  if (typeof window > "u") return "desktop";
  const e = window.innerWidth;
  return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function zr() {
  const [e, t] = v($t);
  return j(() => {
    const n = () => t($t());
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), e;
}
const gn = "application/connect+json", Et = new TextDecoder();
async function xn(e, t) {
  let n = new Uint8Array(0), r = 0;
  for (; !t.isDisposed(); ) {
    const { done: o, value: i } = await e.read();
    if (o) break;
    if (i && i.length > 0) {
      const l = n.length - r, a = new Uint8Array(l + i.length);
      l > 0 && a.set(n.subarray(r), 0), a.set(i, l), n = a, r = 0;
    }
    for (; n.length - r >= 5; ) {
      const l = n[r], a = new DataView(n.buffer, n.byteOffset + r + 1, 4).getUint32(0);
      if (n.length - r < 5 + a) break;
      if (l & 2) {
        const u = n.subarray(r + 5, r + 5 + a);
        r += 5 + a;
        let d = {};
        try {
          u.length > 0 && (d = JSON.parse(Et.decode(u)));
        } catch {
        }
        t.isDisposed() || t.onTrailer?.(d);
        return;
      }
      const c = n.subarray(r + 5, r + 5 + a);
      r += 5 + a;
      try {
        const u = JSON.parse(Et.decode(c));
        t.isDisposed() || t.onMessage(u);
      } catch {
      }
    }
  }
}
function yn(e, t) {
  return t ? t.split(".").reduce((n, r) => {
    if (n != null) {
      if (Array.isArray(n)) {
        const o = Number(r);
        return Number.isInteger(o) ? n[o] : void 0;
      }
      if (typeof n == "object")
        return n[r];
    }
  }, e) : e;
}
function Ar(e) {
  return e.inline ?? e.data;
}
function Mt(e) {
  return e.refreshIntervalMs ?? e.refreshInterval;
}
const Ot = 3e4, pt = 1e3;
function _r(e, t) {
  return t ? yn(e, t) : e;
}
const Tr = /* @__PURE__ */ new Set([
  "timeseries",
  "candles",
  "table",
  "metric",
  "gauge",
  "heatmap",
  "events",
  "distribution",
  "text",
  "orderbook",
  "paired_grid",
  "embed"
]);
function Cr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return e;
  const t = Object.keys(e);
  return t.length === 1 && Tr.has(t[0]) ? e[t[0]] : e;
}
function $r(e) {
  const [t, n] = v(null), [r, o] = v(!0), [i, l] = v(null), [a, c] = v(null), [u, d] = v(!1), [m, g] = v(null), [p, b] = v(0), h = ce(() => b((P) => P + 1), []), w = F(pt), A = F(void 0), _ = F(null), R = F(void 0), $ = F(0), x = ce((P) => {
    const Y = _r(Cr(P), e?.transform);
    n(Y), l(null), o(!1), c(Date.now()), $.current = Date.now();
  }, [e?.transform]), T = ce((P) => {
    const Y = e?.throttleMs ?? 0;
    if (Y <= 0) {
      x(P);
      return;
    }
    const K = Date.now() - $.current;
    if (K >= Y) {
      x(P);
      return;
    }
    _.current = P, R.current || (R.current = setTimeout(() => {
      _.current !== null && x(_.current), _.current = null, R.current = void 0;
    }, Y - K));
  }, [x, e?.throttleMs]), E = L(() => e ? JSON.stringify([
    e.url,
    e.source_id,
    e.method,
    e.body,
    e.headers,
    e.stream,
    Mt(e),
    e.transform,
    e.throttleMs,
    // Inline gets a separate key (truncated to keep the dep stable for
    // payload-identity changes only when the value itself mutates).
    e.inline !== void 0 || e.data !== void 0
  ]) : "", [e]);
  return j(() => {
    if (!e) {
      o(!1);
      return;
    }
    const P = Ar(e);
    if (P !== void 0) {
      T(P);
      return;
    }
    if (!e.url) {
      o(!1);
      return;
    }
    if (e.stream === "connect") {
      let I = !1;
      const V = new AbortController(), W = async () => {
        if (!I)
          try {
            const C = await fetch(e.url, {
              method: "POST",
              // Spread author headers first so the protocol Content-Type
              // wins. Otherwise a stray Content-Type header on the source
              // overrides the connect+json marker.
              headers: { ...e.headers, "Content-Type": gn },
              body: JSON.stringify(e.body ?? {}),
              signal: V.signal
            });
            if (!C.ok) throw new Error(`ConnectRPC: HTTP ${C.status}`);
            if (!C.body) throw new Error("ConnectRPC: no response body");
            d(!0), g(null), l(null), w.current = pt;
            const B = C.body.getReader();
            await xn(B, {
              onMessage: T,
              onTrailer: (ee) => {
                if (ee.error) {
                  const X = ee.error.code ?? "unknown", re = ee.error.message ?? "stream error";
                  I || l(`${X}: ${re}`);
                }
              },
              isDisposed: () => I
            }), B.releaseLock();
          } catch (C) {
            !I && C instanceof Error && C.name !== "AbortError" && l(C.message);
          } finally {
            if (!I) {
              d(!1);
              const C = w.current;
              g(Date.now() + C), A.current = setTimeout(() => {
                w.current = Math.min(w.current * 2, Ot), W();
              }, C);
            }
          }
      };
      return W(), () => {
        I = !0, V.abort(), clearTimeout(A.current), d(!1), g(null);
      };
    }
    if (e.stream === !0) {
      let I = null, V = !1;
      const W = () => {
        V || (I = new EventSource(e.url), I.onopen = () => {
          d(!0), g(null), l(null), w.current = pt;
        }, I.onmessage = (C) => {
          try {
            T(JSON.parse(C.data));
          } catch {
            l("Failed to parse stream");
          }
        }, I.onerror = () => {
          if (I?.close(), d(!1), !V) {
            const C = w.current;
            g(Date.now() + C), A.current = setTimeout(() => {
              w.current = Math.min(w.current * 2, Ot), W();
            }, C);
          }
        });
      };
      return W(), () => {
        V = !0, clearTimeout(A.current), I?.close(), d(!1), g(null);
      };
    }
    const Y = new AbortController(), K = async () => {
      try {
        const I = await fetch(e.url, {
          method: e.method || "GET",
          headers: e.headers,
          body: e.body ? JSON.stringify(e.body) : void 0,
          signal: Y.signal
        });
        if (!I.ok) throw new Error(`HTTP ${I.status}`);
        T(await I.json());
      } catch (I) {
        I instanceof Error && I.name !== "AbortError" && l(I.message);
      } finally {
        o(!1);
      }
    };
    K();
    let G;
    const te = Mt(e);
    return te && te > 0 && (G = setInterval(K, te)), () => {
      Y.abort(), G && clearInterval(G);
    };
  }, [E, T, p]), j(() => () => {
    R.current && clearTimeout(R.current);
  }, []), { data: t, loading: r, error: i, lastUpdated: a, connected: u, nextRetryAt: m, refresh: h };
}
const Er = {
  timeseries: "chart",
  candlestick: "chart",
  table: "table",
  text: "list",
  events: "list",
  metric: "single",
  gauge: "single",
  distribution: "donut",
  heatmap: "grid",
  prompt: "block",
  orderbook: "table",
  paired_grid: "table",
  catalog: "list",
  trade: "block",
  ticker: "block",
  volume_profile: "list",
  stat_strip: "block",
  bar_chart: "chart",
  scatter: "chart",
  clock: "block",
  treemap: "grid",
  image: "block",
  iframe: "block",
  histogram: "chart",
  section: "block",
  area_chart: "chart",
  slider: "block",
  select: "block",
  boxplot: "chart",
  radar: "chart",
  dag: "grid",
  multi_select: "block",
  json: "list",
  sparkline: "chart"
};
function jt({ component: e }) {
  switch (e ? Er[e] : "block") {
    case "chart":
      return /* @__PURE__ */ s(Or, {});
    case "table":
      return /* @__PURE__ */ s(jr, {});
    case "list":
      return /* @__PURE__ */ s(Rr, {});
    case "single":
      return /* @__PURE__ */ s(Pr, {});
    case "donut":
      return /* @__PURE__ */ s(Lr, {});
    case "grid":
      return /* @__PURE__ */ s(Ir, {});
    default:
      return /* @__PURE__ */ s(Dr, {});
  }
}
function D({ children: e, padded: t }) {
  return /* @__PURE__ */ f(
    "div",
    {
      className: `flex flex-col items-center justify-center h-full gap-1.5 text-zinc-500 text-sm${t ? " px-4 text-center" : ""}`,
      children: [
        /* @__PURE__ */ s("span", { className: "text-zinc-700 text-xs uppercase tracking-[0.2em] leading-none", children: "·  ·  ·" }),
        e
      ]
    }
  );
}
function Rt({ message: e, onRetry: t }) {
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col items-center justify-center gap-2 px-2", children: [
    /* @__PURE__ */ f("div", { className: "flex items-center gap-2 text-sm max-w-full", children: [
      /* @__PURE__ */ s("span", { className: "text-red-400 shrink-0", children: "⚠" }),
      /* @__PURE__ */ s("span", { className: "text-zinc-400 font-mono text-xs truncate", children: e })
    ] }),
    t && /* @__PURE__ */ s(
      "button",
      {
        onClick: t,
        className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800",
        children: "Retry"
      }
    )
  ] });
}
const Mr = [40, 60, 35, 75, 55, 85, 50, 70, 90, 45, 65, 80, 55, 95, 60, 50, 75, 65, 80, 70];
function Or() {
  return /* @__PURE__ */ s("div", { className: "h-full flex items-end gap-1", children: Mr.map((e, t) => /* @__PURE__ */ s(
    "div",
    {
      className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
      style: { height: `${e}%`, animationDelay: `${t * 40}ms` }
    },
    t
  )) });
}
function jr() {
  const t = [80, 64, 96];
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col gap-2.5", children: [
    /* @__PURE__ */ s("div", { className: "flex gap-4 pb-2 border-b border-zinc-800", children: t.map((n, r) => /* @__PURE__ */ s("div", { className: "h-3 bg-zinc-800 rounded animate-pulse", style: { width: n } }, r)) }),
    Array.from({ length: 5 }).map((n, r) => /* @__PURE__ */ s("div", { className: "flex gap-4", children: t.map((o, i) => /* @__PURE__ */ s(
      "div",
      {
        className: "h-3 bg-zinc-800 rounded animate-pulse",
        style: { width: o, animationDelay: `${(r * 3 + i) * 50}ms` }
      },
      i
    )) }, r))
  ] });
}
function Rr() {
  return /* @__PURE__ */ s("div", { className: "h-full flex flex-col gap-3.5", children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ f("div", { className: "flex gap-3 items-start pt-1", children: [
    /* @__PURE__ */ s("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }),
    /* @__PURE__ */ f("div", { className: "flex-1 flex flex-col gap-1.5 min-w-0", children: [
      /* @__PURE__ */ s(
        "div",
        {
          className: "h-2.5 bg-zinc-800 rounded animate-pulse",
          style: { width: `${55 + t * 11 % 30}%`, animationDelay: `${t * 80}ms` }
        }
      ),
      /* @__PURE__ */ s(
        "div",
        {
          className: "h-2 bg-zinc-800/60 rounded animate-pulse",
          style: { width: `${35 + t * 7 % 25}%`, animationDelay: `${t * 80 + 40}ms` }
        }
      )
    ] })
  ] }, t)) });
}
function Pr() {
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col items-center justify-center gap-2", children: [
    /* @__PURE__ */ s("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }),
    /* @__PURE__ */ s("div", { className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse", style: { animationDelay: "120ms" } })
  ] });
}
function Lr() {
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ s("div", { className: "flex-1 flex items-center justify-center min-h-0", children: /* @__PURE__ */ s("svg", { viewBox: "0 0 100 100", className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse", children: /* @__PURE__ */ s("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: "#27272a", strokeWidth: "14" }) }) }),
    /* @__PURE__ */ s("div", { className: "grid grid-cols-2 gap-2 mt-2", children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ f("div", { className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ s("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }),
      /* @__PURE__ */ s(
        "div",
        {
          className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
          style: { animationDelay: `${t * 60}ms` }
        }
      )
    ] }, t)) })
  ] });
}
function Ir() {
  return /* @__PURE__ */ s(
    "div",
    {
      className: "h-full grid gap-1",
      style: { gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(5, 1fr)" },
      children: Array.from({ length: 40 }).map((t, n) => /* @__PURE__ */ s(
        "div",
        {
          className: "bg-zinc-800 rounded-sm animate-pulse",
          style: { animationDelay: `${n * 25}ms` }
        },
        n
      ))
    }
  );
}
function Dr() {
  return /* @__PURE__ */ s("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
function Fr(e) {
  return /* @__PURE__ */ s(D, { children: "Unknown widget type" });
}
const U = (e, t) => Zn(() => e().then((n) => ({ default: n[t] }))), Tt = /* @__PURE__ */ new Map([
  ["timeseries", U(() => Promise.resolve().then(() => _o), "Timeseries")],
  ["candlestick", U(() => Promise.resolve().then(() => Oo), "Candlestick")],
  ["table", U(() => Promise.resolve().then(() => Uo), "DataTable")],
  ["metric", U(() => Promise.resolve().then(() => Go), "Metric")],
  ["text", U(() => Promise.resolve().then(() => Qo), "Text")],
  ["prompt", U(() => Promise.resolve().then(() => ti), "Prompt")],
  ["gauge", U(() => Promise.resolve().then(() => oi), "Gauge")],
  ["distribution", U(() => Promise.resolve().then(() => ci), "Distribution")],
  ["heatmap", U(() => Promise.resolve().then(() => bi), "Heatmap")],
  ["events", U(() => Promise.resolve().then(() => vi), "Events")],
  ["catalog", U(() => Promise.resolve().then(() => Si), "Catalog")],
  ["orderbook", U(() => Promise.resolve().then(() => _i), "OrderBook")],
  ["paired_grid", U(() => Promise.resolve().then(() => Oi), "PairedGrid")],
  ["trade", U(() => Promise.resolve().then(() => Di), "Trade")],
  ["ticker", U(() => Promise.resolve().then(() => Hi), "Ticker")],
  ["volume_profile", U(() => Promise.resolve().then(() => Ji), "VolumeProfile")],
  ["stat_strip", U(() => Promise.resolve().then(() => tl), "StatStrip")],
  ["bar_chart", U(() => Promise.resolve().then(() => il), "BarChart")],
  ["scatter", U(() => Promise.resolve().then(() => ul), "Scatter")],
  ["clock", U(() => Promise.resolve().then(() => xl), "Clock")],
  ["treemap", U(() => Promise.resolve().then(() => Nl), "Treemap")],
  ["image", U(() => Promise.resolve().then(() => Al), "Image")],
  ["iframe", U(() => Promise.resolve().then(() => $l), "Iframe")],
  ["histogram", U(() => Promise.resolve().then(() => Rl), "Histogram")],
  ["section", U(() => Promise.resolve().then(() => Ll), "Section")],
  ["area_chart", U(() => Promise.resolve().then(() => Bl), "AreaChart")],
  ["slider", U(() => Promise.resolve().then(() => Wl), "Slider")],
  ["select", U(() => Promise.resolve().then(() => Yl), "Select")],
  ["boxplot", U(() => Promise.resolve().then(() => ta), "Boxplot")],
  ["radar", U(() => Promise.resolve().then(() => sa), "Radar")],
  ["dag", U(() => Promise.resolve().then(() => ua), "Dag")],
  ["multi_select", U(() => Promise.resolve().then(() => fa), "MultiSelect")],
  ["json", U(() => Promise.resolve().then(() => ha), "Json")],
  ["sparkline", U(() => Promise.resolve().then(() => xa), "Sparkline")],
  ["action_log", U(() => Promise.resolve().then(() => za), "ActionLog")],
  ["alert_log", U(() => Promise.resolve().then(() => Ta), "AlertLog")],
  ["tape", U(() => Promise.resolve().then(() => Ia), "Tape")],
  ["file_browser", U(() => Promise.resolve().then(() => ac), "FileBrowser")]
]), gc = new Set(Tt.keys());
function Ur(e) {
  return Tt.get(e) || Fr;
}
function xc(e, t) {
  Tt.set(e, t);
}
class Br extends Qn {
  state = { error: null };
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  componentDidCatch(t, n) {
    console.error("[MedallionTerminal] Widget error:", t, n.componentStack), this.props.onError?.(t);
  }
  render() {
    return this.state.error ? /* @__PURE__ */ s("div", { className: "flex items-center justify-center h-full text-red-400/80 text-sm p-4 text-center", children: /* @__PURE__ */ f("div", { children: [
      /* @__PURE__ */ s("div", { className: "font-medium mb-1", children: "Widget Error" }),
      /* @__PURE__ */ s("div", { className: "text-zinc-500 text-xs", children: this.state.error.message })
    ] }) }) : this.props.children;
  }
}
const Kr = {
  dispatch: () => {
  },
  ctx: {},
  setCtx: () => {
  },
  widgets: [],
  toast: () => {
  },
  compact: !1,
  fullscreenId: null,
  setFullscreenId: () => {
  },
  focusedId: null,
  setFocusedId: () => {
  },
  refreshPulse: null,
  requestRefresh: () => {
  },
  emit: () => {
  },
  recentActions: [],
  clearRecentActions: () => {
  },
  recentAlerts: [],
  clearRecentAlerts: () => {
  },
  soundEnabled: !1,
  widgetHealth: {},
  reportWidgetHealth: () => {
  },
  registerWidgetData: () => () => {
  },
  snapshot: () => ({ widgets: [] })
}, vn = _t(Kr);
function ae() {
  return At(vn);
}
const ut = "medallion.terminal.v1.TerminalService";
function Hr(e) {
  return `${e.replace(/\/$/, "")}/${ut}/Generate`;
}
function Wr(e, t, n) {
  return {
    prompt: e,
    context: { values: t },
    current_widgets: n
  };
}
function wn(e) {
  return `${e.replace(/\/$/, "")}/${ut}/SubmitAction`;
}
function qr(e) {
  return `${e.replace(/\/$/, "")}/${ut}/WatchAction`;
}
function kn(e) {
  return { action_id: e.actionId, params: e.params, client_request_id: e.clientRequestId };
}
function Vr(e) {
  return {
    action_id: e.actionId ?? "",
    id: e.id ?? "",
    client_request_id: e.clientRequestId ?? ""
  };
}
function Nn() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
let Pt = !1;
class Gr extends Error {
  constructor(t) {
    super(`Missing context key: \${ctx.${t}}`), this.key = t, this.name = "InterpolationError";
  }
}
function Le(e, t, n) {
  return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (r, o) => {
    if (o in t) return t[o];
    if (n?.strict) throw new Gr(o);
    return "";
  });
}
function Jr(e, t, n) {
  if (e.source_id) {
    if (n === void 0)
      return Pt || (console.warn(
        `[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`
      ), Pt = !0), e;
    const o = e.stream ? "Stream" : "Get", i = n.replace(/\/$/, ""), l = {};
    if (e.params)
      for (const [a, c] of Object.entries(e.params))
        l[a] = Le(c, t, { strict: !0 });
    return {
      url: `${i}/${ut}/${o}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { source_id: e.source_id, params: l },
      stream: e.stream ? "connect" : !1,
      refreshIntervalMs: e.refreshIntervalMs ?? e.refreshInterval
    };
  }
  if (!e.url && !e.params) return e;
  const r = { ...e };
  if (e.url) {
    let o = Le(e.url, t, { strict: !0 });
    if (e.params && Object.keys(e.params).length > 0) {
      const i = Object.entries(e.params).map(([l, a]) => `${encodeURIComponent(l)}=${encodeURIComponent(Le(a, t, { strict: !0 }))}`).join("&");
      o = o.includes("?") ? `${o}&${i}` : `${o}?${i}`;
    }
    r.url = o;
  }
  return r;
}
const Sn = _t({
  now: 0,
  subscribe: () => () => {
  }
});
function dt(e = !0) {
  const { now: t, subscribe: n } = At(Sn);
  return j(() => {
    if (e)
      return n();
  }, [e, n]), t;
}
function Yr({ children: e }) {
  const [t, n] = v(() => Date.now()), r = F(0), o = F(null), i = L(() => ({
    now: t,
    subscribe: () => (r.current += 1, o.current == null && (o.current = setInterval(() => n(Date.now()), 1e3)), () => {
      r.current = Math.max(0, r.current - 1), r.current === 0 && o.current != null && (clearInterval(o.current), o.current = null);
    })
  }), [t]);
  return j(() => () => {
    o.current != null && clearInterval(o.current);
  }, []), /* @__PURE__ */ s(Sn.Provider, { value: i, children: e });
}
const Xr = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function Zr(e, t) {
  const n = zn(t);
  return n ? ns(n, e) : !1;
}
function Qr(e) {
  return zn(e) !== null;
}
function zn(e) {
  const t = e.trim();
  if (!t) return null;
  const n = Lt(t, "||"), r = [];
  for (const o of n) {
    const i = Lt(o, "&&"), l = [];
    for (const a of i) {
      const c = es(a);
      if (!c) return null;
      l.push(c);
    }
    if (l.length === 0) return null;
    r.push(l);
  }
  return r.length === 0 ? null : r;
}
function Lt(e, t) {
  const n = [];
  let r = 0, o = !1;
  for (let i = 0; i < e.length; i++)
    if (e[i] === '"' && (o = !o), !o && !o && e.startsWith(t, i)) {
      n.push(e.slice(r, i)), r = i + t.length, i += t.length - 1;
      continue;
    }
  return n.push(e.slice(r)), n.map((i) => i.trim());
}
function es(e) {
  const t = e.trim().match(Xr);
  if (!t) return null;
  const [, n, r, o] = t;
  return { path: n.trim(), op: r, rhs: ts(o.trim()) };
}
function ts(e) {
  if (e === "true") return !0;
  if (e === "false") return !1;
  if (e === "null") return null;
  if (e.length >= 2 && e.startsWith('"') && e.endsWith('"'))
    return e.slice(1, -1);
  const t = Number(e);
  return Number.isNaN(t) ? e : t;
}
function ns(e, t) {
  for (const n of e) {
    let r = !0;
    for (const o of n)
      if (!rs(yn(t, o.path), o.op, o.rhs)) {
        r = !1;
        break;
      }
    if (r) return !0;
  }
  return !1;
}
function rs(e, t, n) {
  if (t === ">" || t === ">=" || t === "<" || t === "<=") {
    const r = Number(e), o = Number(n);
    if (!Number.isFinite(r) || !Number.isFinite(o)) return !1;
    switch (t) {
      case ">":
        return r > o;
      case ">=":
        return r >= o;
      case "<":
        return r < o;
      case "<=":
        return r <= o;
    }
  }
  return t === "==" ? e === n || typeof e == "number" && typeof n == "number" && e === n : t === "!=" ? !(e === n || typeof e == "number" && typeof n == "number" && e === n) : !1;
}
const ss = {
  warn: 720,
  // mid
  error: 480
  // low — more alarming
}, It = 160, os = 0.08;
let et = null;
function is() {
  if (typeof window > "u") return null;
  if (et) return et;
  const e = window, t = window.AudioContext || e.webkitAudioContext;
  return t ? (et = new t(), et) : null;
}
function ls(e) {
  const t = ss[e];
  if (!t) return;
  const n = is();
  if (!n) return;
  n.state === "suspended" && n.resume().catch(() => {
  });
  const r = n.createOscillator(), o = n.createGain();
  r.type = "sine", r.frequency.value = t, o.gain.value = 0, r.connect(o), o.connect(n.destination);
  const i = n.currentTime;
  o.gain.linearRampToValueAtTime(os, i + 0.02), o.gain.linearRampToValueAtTime(0, i + It / 1e3), r.start(i), r.stop(i + It / 1e3 + 0.05);
}
const at = { columns: [], rows: [] };
function we(e) {
  if (e == null) return null;
  const t = typeof e;
  if (t === "number" || t === "boolean" || t === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function fe(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const i of Object.keys(o))
      n.has(i) || (n.add(i), t.push(i));
  const r = e.map((o) => {
    const i = {};
    for (const l of t) i[l] = we(o[l]);
    return i;
  });
  return { columns: t, rows: r };
}
function le(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ot(e) {
  const t = (r) => Array.isArray(r) ? r : le(r) && Array.isArray(r.points) ? r.points : null;
  if (le(e) && Array.isArray(e.series)) {
    const r = e.series, o = /* @__PURE__ */ new Map(), i = [];
    for (let l = 0; l < r.length; l++) {
      const a = r[l], c = a.name ?? `series_${l + 1}`;
      i.push(c);
      const u = a.points ?? a.data ?? [];
      for (const d of u) {
        const m = String(d.timestamp ?? ""), g = o.get(m) ?? { timestamp: m };
        g[c] = we(d.value), o.set(m, g);
      }
    }
    return { columns: ["timestamp", ...i], rows: [...o.values()] };
  }
  const n = t(e);
  return n ? {
    columns: ["timestamp", "value"],
    rows: n.map((r) => ({ timestamp: we(r.timestamp), value: we(r.value) }))
  } : null;
}
function An(e) {
  return le(e) && Array.isArray(e.bars) ? fe(e.bars) : null;
}
function _n(e) {
  if (Array.isArray(e) && e.length > 0 && le(e[0]))
    return fe(e);
  if (le(e) && "rows" in e) {
    const t = e, n = Array.isArray(t.columns) ? t.columns : [];
    if (n.length > 0 && le(n[0])) {
      const i = n.map((a) => a.key), l = t.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(i.map((c, u) => [c, we(a[u])])) : Dt(a, i)
      );
      return { columns: i, rows: l };
    }
    if (n.length > 0 && typeof n[0] == "string") {
      const o = n, i = t.rows.map(
        (l) => Array.isArray(l) ? Object.fromEntries(o.map((a, c) => [a, we(l[c])])) : Dt(l, o)
      );
      return { columns: o, rows: i };
    }
    const r = t.rows;
    return r.length > 0 && le(r[0]) ? fe(r) : at;
  }
  return null;
}
function Dt(e, t) {
  const n = {};
  for (const r of t) n[r] = we(e[r]);
  return n;
}
function Tn(e) {
  return le(e) && Array.isArray(e.cells) ? fe(e.cells) : null;
}
function Cn(e) {
  return le(e) && Array.isArray(e.slices) ? fe(e.slices) : null;
}
function He(e) {
  return le(e) && Array.isArray(e.events) ? fe(e.events) : null;
}
function Nt(e) {
  return le(e) && Array.isArray(e.items) ? fe(e.items) : null;
}
function $n(e) {
  if (le(e) && (Array.isArray(e.bids) || Array.isArray(e.asks))) {
    const t = e.bids ?? [], n = e.asks ?? [], r = [
      ...t.map((o) => ({ side: "bid", ...o })),
      ...n.map((o) => ({ side: "ask", ...o }))
    ];
    return fe(r);
  }
  return null;
}
function En(e) {
  return typeof e == "number" ? { columns: ["value"], rows: [{ value: e }] } : le(e) && "value" in e && typeof e.value != "object" ? fe([e]) : null;
}
function Mn(e) {
  if (le(e) && "value" in e) {
    const { value: t, min: n, max: r } = e;
    return fe([{ value: t, min: n, max: r }]);
  }
  return null;
}
const as = {
  timeseries: ot,
  area_chart: ot,
  sparkline: ot,
  candlestick: An,
  table: _n,
  heatmap: Tn,
  distribution: Cn,
  events: He,
  tape: He,
  action_log: He,
  alert_log: He,
  text: Nt,
  ticker: Nt,
  orderbook: $n,
  metric: En,
  gauge: Mn
};
function cs(e) {
  if (e == null) return at;
  if (Array.isArray(e))
    return e.length === 0 ? at : le(e[0]) ? fe(e) : { columns: ["value"], rows: e.map((t) => ({ value: we(t) })) };
  if (le(e)) {
    const t = Object.entries(e).find(([, n]) => Array.isArray(n));
    return t && le(t[1][0]) ? fe(t[1]) : fe([e]);
  }
  return { columns: ["value"], rows: [{ value: we(e) }] };
}
function us(e, t) {
  if (e == null) return at;
  if (t) {
    const n = as[t];
    if (n) {
      const r = n(e);
      if (r) return r;
    }
  }
  for (const n of [
    ot,
    An,
    Tn,
    Cn,
    He,
    Nt,
    $n,
    Mn,
    En,
    _n
  ]) {
    const r = n(e);
    if (r && r.rows.length > 0) return r;
  }
  return cs(e);
}
const Ft = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
  ndjson: "application/x-ndjson;charset=utf-8",
  parquet: "application/vnd.apache.parquet"
}, ds = {
  csv: "csv",
  json: "json",
  ndjson: "ndjson",
  parquet: "parquet"
}, On = [
  { key: "csv", label: "CSV" },
  { key: "parquet", label: "Parquet" },
  { key: "json", label: "JSON" },
  { key: "ndjson", label: "NDJSON" }
];
function Ut(e) {
  if (e == null) return "";
  const t = String(e);
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function fs(e) {
  const { columns: t, rows: n } = e, r = t.map(Ut).join(","), o = n.map((i) => t.map((l) => Ut(i[l])).join(","));
  return [r, ...o].join(`
`);
}
function ms(e) {
  return JSON.stringify(e.rows, null, 2);
}
function ps(e) {
  return e.rows.map((t) => JSON.stringify(t)).join(`
`);
}
function hs(e) {
  return e.columns.map((t) => ({
    name: t,
    data: e.rows.map((n) => n[t] ?? null)
  }));
}
async function bs(e) {
  const { parquetWriteBuffer: t } = await import("./index-BKASYduw.js"), n = e.columns.length > 0 ? hs(e) : [{ name: "value", data: [] }], r = t({ columnData: n });
  return new Uint8Array(r);
}
function gs(e, t) {
  switch (t) {
    case "csv":
      return fs(e);
    case "json":
      return ms(e);
    case "ndjson":
      return ps(e);
  }
}
function jn(e) {
  return e.table ?? us(e.data, e.component);
}
async function xs(e, t) {
  const n = jn(e);
  if (t === "parquet") {
    const o = await bs(n);
    return new Blob([o.slice().buffer], { type: Ft.parquet });
  }
  const r = gs(n, t);
  return new Blob([r], { type: Ft[t] });
}
function Rn(e) {
  return jn(e).rows.length;
}
function ys(e, t) {
  return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${ds[t]}`;
}
async function Pn(e, t, n) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function")
    return !1;
  const r = await xs(e, t), o = URL.createObjectURL(r), i = document.createElement("a");
  return i.href = o, i.download = ys(n, t), document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(o), 0), !0;
}
function vs(e, t) {
  if (!t) return null;
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "just now";
  if (n < 60) return `${n}s ago`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function ws(e) {
  const { resolution: t, loading: n, error: r, data: o, options: i, component: l, widgetId: a, Component: c, onRenderError: u, onRetry: d } = e;
  return t.error ? /* @__PURE__ */ s(Rt, { message: t.error }) : n ? /* @__PURE__ */ s(jt, { component: l }) : r ? /* @__PURE__ */ s(Rt, { message: r, onRetry: d }) : /* @__PURE__ */ s("div", { className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]", children: /* @__PURE__ */ s(Br, { onError: u, children: /* @__PURE__ */ s(er, { fallback: /* @__PURE__ */ s(jt, { component: l }), children: /* @__PURE__ */ s(c, { data: o, options: i, widgetId: a }) }) }) });
}
function ks({
  widget: e,
  data: t,
  onRefresh: n,
  onCopy: r,
  onToast: o
}) {
  const { dispatch: i, fullscreenId: l, setFullscreenId: a } = ae(), [c, u] = v(!1), [d, m] = v(!1), [g, p] = v(!1), b = F(null);
  j(() => {
    if (!c) return;
    const E = (P) => {
      b.current && !b.current.contains(P.target) && (u(!1), m(!1));
    };
    return document.addEventListener("mousedown", E), () => document.removeEventListener("mousedown", E);
  }, [c]);
  const h = e.source, w = h?.data !== void 0 && !h.url && !h.source_id, A = !!h && !w, _ = !!e.id, R = !!e.id && l !== e.id, $ = t == null ? 0 : Rn({ data: t, component: e.component }), x = $ > 0, T = async (E) => {
    p(!0);
    try {
      const P = await Pn(
        { data: t, component: e.component },
        E,
        e.title ?? e.id ?? e.component
      );
      o(
        P ? `Exported ${$.toLocaleString()} rows as ${E.toUpperCase()}` : "Export failed",
        P ? "ok" : "warn"
      );
    } catch {
      o("Export failed", "error");
    } finally {
      p(!1), u(!1), m(!1);
    }
  };
  return /* @__PURE__ */ f("div", { className: "relative", ref: b, children: [
    /* @__PURE__ */ s(
      "button",
      {
        onClick: () => u((E) => !E),
        className: "text-zinc-600 hover:text-zinc-300 px-1.5 text-base leading-none rounded",
        "aria-label": "Widget actions",
        children: "⋮"
      }
    ),
    c && /* @__PURE__ */ f("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-20 min-w-[140px]", children: [
      A && /* @__PURE__ */ s(
        "button",
        {
          onClick: () => {
            n(), u(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Refresh"
        }
      ),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: async () => {
            await r(), u(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Copy data"
        }
      ),
      x && /* @__PURE__ */ f("div", { children: [
        /* @__PURE__ */ f(
          "button",
          {
            onClick: () => m((E) => !E),
            className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
            "aria-expanded": d,
            children: [
              /* @__PURE__ */ f("span", { children: [
                "Export",
                g ? "…" : ""
              ] }),
              /* @__PURE__ */ s("span", { className: "text-zinc-600", children: d ? "▾" : "▸" })
            ]
          }
        ),
        d && /* @__PURE__ */ s("div", { className: "bg-zinc-950/60", children: On.map((E) => /* @__PURE__ */ s(
          "button",
          {
            onClick: () => T(E.key),
            disabled: g,
            className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
            children: E.label
          },
          E.key
        )) })
      ] }),
      R && /* @__PURE__ */ s(
        "button",
        {
          onClick: () => {
            a(e.id), u(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Fullscreen"
        }
      ),
      _ && /* @__PURE__ */ s(
        "button",
        {
          onClick: () => {
            i([{ targetId: e.id, remove: !0 }]), u(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800",
          children: "Remove"
        }
      )
    ] })
  ] });
}
function Ln({ config: e, contentHeight: t, snapshotKey: n }) {
  const { ctx: r, backendUrl: o, refreshIntervalMs: i, compact: l, toast: a, focusedId: c, setFocusedId: u, refreshPulse: d, emit: m, soundEnabled: g, reportWidgetHealth: p, registerWidgetData: b } = ae(), h = L(
    () => e.title ? Le(e.title, r) : e.title,
    [e.title, r]
  ), w = L(() => {
    if (!e.source) return { source: void 0, error: null };
    try {
      const k = Jr(e.source, r, o);
      return i && i > 0 && !k.stream ? { source: { ...k, refreshIntervalMs: i }, error: null } : { source: k, error: null };
    } catch (k) {
      return { source: void 0, error: k instanceof Error ? k.message : "Resolution error" };
    }
  }, [e.source, r, o, i]), A = w.source, { data: _, loading: R, error: $, lastUpdated: x, connected: T, nextRetryAt: E, refresh: P } = $r(A), Y = Ur(e.component), K = F(_);
  K.current = _, j(() => {
    if (n)
      return b(n, () => K.current);
  }, [n, b]);
  const G = !!A?.stream || !!(A?.refreshIntervalMs ?? A?.refreshInterval), te = A?.staleAfterMs, I = G && x != null || E != null || !!te && x != null, V = dt(I), W = !!te && x != null && V - x > te, C = F(0);
  j(() => {
    if (!d) return;
    const k = e.refresh_policy ?? "global";
    if (k === "manual") return;
    const z = d.id === "*";
    z && k === "self" || !(z || d.id === e.id) || d.n > C.current && (C.current = d.n, P());
  }, [d, e.id, e.refresh_policy, P]);
  const B = F(!1);
  j(() => {
    const k = e.alert;
    if (!k || _ == null) {
      B.current = !1;
      return;
    }
    const z = Zr(_, k.when);
    if (z && !B.current) {
      const M = Le(k.message, r), H = k.severity ?? "warn";
      a(M, H), m({ type: "alert", widgetId: e.id, severity: H, message: M, predicate: k.when }), g && ls(H);
    }
    B.current = z;
  }, [_, e.alert, r, a, m, e.id, g]);
  const ee = F(null);
  j(() => {
    const k = w.error ?? $, z = w.error ? "resolve" : "data";
    k && k !== ee.current ? (m({ type: "widget_error", widgetId: e.id, component: e.component, message: k, source: z }), ee.current = k) : k || (ee.current = null);
  }, [w.error, $, m, e.id, e.component]), j(() => {
    if (!e.id) return;
    const k = !!A?.stream;
    return p(e.id, {
      title: h || e.title || e.component,
      streaming: k,
      connected: k ? T : !0,
      error: w.error ?? $,
      stale: W
    }), () => p(e.id, null);
  }, [e.id, h, e.title, e.component, A?.stream, T, w.error, $, W, p]);
  const X = !!e.id && c === e.id, re = e.id ? () => u(e.id) : void 0;
  return /* @__PURE__ */ f(
    "div",
    {
      onClick: re,
      className: `bg-zinc-900 border ${X ? "border-sky-400/60 shadow-[0_0_12px_-2px_rgba(56,189,248,0.4)]" : "border-zinc-800"} ${l ? "rounded" : "rounded-lg"} overflow-hidden transition-shadow`,
      children: [
        h && /* @__PURE__ */ f("div", { className: `${l ? "px-2.5 py-1.5" : "px-4 py-2.5"} border-b border-zinc-800 flex items-center justify-between`, children: [
          /* @__PURE__ */ s("h3", { className: `${l ? "text-xs" : "text-sm"} font-medium text-zinc-100 truncate`, children: h }),
          /* @__PURE__ */ f("div", { className: "flex items-center gap-2 shrink-0 ml-2", children: [
            G && x && /* @__PURE__ */ f("span", { className: `text-[10px] ${W ? "text-amber-400/80" : "text-zinc-600"}`, children: [
              W ? "stale · " : "",
              vs(V, x)
            ] }),
            e.source?.stream && !T && E != null && /* @__PURE__ */ f("span", { className: "text-[10px] text-amber-400/80 tabular-nums", title: "Reconnecting", children: [
              "retry ",
              Math.max(0, Math.ceil((E - V) / 1e3)),
              "s"
            ] }),
            e.source?.stream && /* @__PURE__ */ s(
              "span",
              {
                className: `w-2 h-2 rounded-full shrink-0 ${T ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
                title: T ? "Connected" : E ? "Reconnecting" : "Disconnected"
              }
            ),
            /* @__PURE__ */ s(
              ks,
              {
                widget: e,
                data: _,
                onToast: a,
                onRefresh: P,
                onCopy: async () => {
                  if (_ == null)
                    return a("No data to copy", "warn"), !1;
                  if (typeof navigator > "u" || !navigator.clipboard)
                    return a("Clipboard unavailable", "warn"), !1;
                  try {
                    return await navigator.clipboard.writeText(JSON.stringify(_, null, 2)), a(`${e.title ?? e.component} copied`, "ok"), !0;
                  } catch {
                    return a("Clipboard blocked", "warn"), !1;
                  }
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s("div", { className: l ? "p-2.5" : "p-4", style: { height: l ? Math.round(t * 0.92) : t }, children: ws({
          resolution: w,
          loading: R,
          error: $,
          data: _,
          options: e.options,
          component: e.component,
          widgetId: e.id,
          Component: Y,
          onRenderError: (k) => m({
            type: "widget_error",
            widgetId: e.id,
            component: e.component,
            message: k.message,
            source: "render"
          }),
          // Inline-data sources can't retry; only offer the button
          // when there's an actual fetch/stream behind the widget.
          onRetry: A && !(A.inline !== void 0 || A.data !== void 0) ? P : void 0
        }) })
      ]
    }
  );
}
const In = _t({
  hoverTime: null,
  setHoverTime: () => {
  }
});
function Dn() {
  return At(In);
}
function Ns({ children: e }) {
  const [t, n] = v(null), r = L(() => ({ hoverTime: t, setHoverTime: n }), [t]);
  return /* @__PURE__ */ s(In.Provider, { value: r, children: e });
}
function Ss(e, t, n) {
  const r = n?.replaceAll ? [] : [...e];
  for (const o of t) {
    const i = r.findIndex((l) => l.id === o.targetId);
    if (o.remove) {
      i >= 0 && r.splice(i, 1);
      continue;
    }
    i >= 0 ? r[i] = {
      ...r[i],
      ...o.component !== void 0 && { component: o.component },
      ...o.title !== void 0 && { title: o.title },
      ...o.span !== void 0 && { span: o.span },
      ...o.height !== void 0 && { height: o.height },
      ...o.source !== void 0 && { source: o.source },
      ...o.options !== void 0 && { options: o.options }
    } : r.push({
      id: o.targetId,
      component: o.component || "placeholder",
      title: o.title,
      span: o.span,
      height: o.height,
      source: o.source,
      options: o.options
    });
  }
  return r;
}
const ct = "ctx.";
function zs(e) {
  const t = {}, n = new URLSearchParams(e);
  for (const [r, o] of n)
    r.startsWith(ct) && (t[r.slice(ct.length)] = o);
  return t;
}
function As(e, t) {
  const n = new URLSearchParams(e);
  for (const r of [...n.keys()])
    r.startsWith(ct) && n.delete(r);
  for (const [r, o] of Object.entries(t))
    n.set(`${ct}${r}`, o);
  return n.toString();
}
const qe = "medallion-terminal:view:";
function _s(e, t) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(qe + e, JSON.stringify(t));
    } catch {
    }
}
function Ts(e) {
  if (!e || typeof window > "u" || !window.localStorage) return null;
  try {
    const t = window.localStorage.getItem(qe + e);
    if (t == null) return null;
    const n = JSON.parse(t);
    if (!n || typeof n != "object") return null;
    const r = {};
    for (const [o, i] of Object.entries(n))
      typeof i == "string" && (r[o] = i);
    return r;
  } catch {
    return null;
  }
}
function Cs() {
  if (typeof window > "u" || !window.localStorage) return [];
  const e = [];
  for (let t = 0; t < window.localStorage.length; t++) {
    const n = window.localStorage.key(t);
    n && n.startsWith(qe) && e.push(n.slice(qe.length));
  }
  return e.sort();
}
function $s(e) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.removeItem(qe + e);
    } catch {
    }
}
const Es = /* @__PURE__ */ new Set(["1d", "5d", "1m", "3m", "1y", "max"]), Ms = 150, Os = 8;
function js(e, t) {
  const n = e.trim();
  if (!n) return null;
  if (n.startsWith("/")) {
    const [l, ...a] = n.slice(1).split(/\s+/), c = a.join(" ").trim();
    switch (l.toLowerCase()) {
      case "save":
        return c ? { kind: "save", name: c } : null;
      case "load":
      case "open":
        return c ? { kind: "load", name: c } : null;
      case "delete":
      case "rm":
        return c ? { kind: "delete", name: c } : null;
      default:
        return { kind: "noop" };
    }
  }
  const r = n.split(/\s+/);
  if (r.length > 1) {
    const l = [];
    let a = !0;
    for (const c of r) {
      const u = c.match(/^([a-zA-Z_][a-zA-Z0-9_]*)[:=](.+)$/);
      if (!u) {
        a = !1;
        break;
      }
      l.push([u[1].toLowerCase(), u[2]]);
    }
    if (a && l.length > 1) return { kind: "set_many", pairs: l };
  }
  const o = n.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/);
  if (o) return { kind: "set", key: o[1].toLowerCase(), value: o[2].trim() };
  const i = n.indexOf(" ");
  return i > 0 ? { kind: "set", key: n.slice(0, i).toLowerCase(), value: n.slice(i + 1).trim() } : Es.has(n.toLowerCase()) ? { kind: "set", key: "range", value: n.toLowerCase() } : { kind: "set", key: t, value: n };
}
function Rs({ suggest: e } = {}) {
  const { ctx: t, setCtx: n, toast: r } = ae(), [o, i] = v(!1), [l, a] = v(""), [c, u] = v([]), [d, m] = v(-1), g = F(null), [p, b] = v([]), h = F(0);
  j(() => {
    const x = (T) => {
      (T.metaKey || T.ctrlKey) && T.key.toLowerCase() === "k" ? (T.preventDefault(), i((E) => !E)) : T.key === "Escape" && i(!1);
    };
    return document.addEventListener("keydown", x), () => document.removeEventListener("keydown", x);
  }, []), j(() => {
    o ? g.current?.focus() : (a(""), m(-1), b([]));
  }, [o]), j(() => {
    if (!e || !o) return;
    const x = l.trim();
    if (!x) {
      b([]);
      return;
    }
    const T = ++h.current, E = setTimeout(async () => {
      try {
        const P = await e(x);
        if (T !== h.current) return;
        b(P.slice(0, Os));
      } catch {
        T === h.current && b([]);
      }
    }, Ms);
    return () => clearTimeout(E);
  }, [l, o, e]);
  const w = L(() => Object.keys(t)[0] ?? "symbol", [t]), A = L(() => o ? Cs() : [], [o, c]);
  if (!o) return null;
  const _ = () => {
    const x = js(l, w);
    if (!x || x.kind === "noop") {
      i(!1);
      return;
    }
    if (x.kind === "save")
      _s(x.name, t), r(`Saved "${x.name}"`, "ok");
    else if (x.kind === "load") {
      const T = Ts(x.name);
      if (!T)
        r(`No view named "${x.name}"`, "warn");
      else {
        for (const [E, P] of Object.entries(T)) n(E, P);
        r(`Loaded "${x.name}"`, "ok");
      }
    } else if (x.kind === "delete")
      $s(x.name), r(`Deleted "${x.name}"`, "ok");
    else if (x.kind === "set")
      n(x.key, x.value);
    else if (x.kind === "set_many")
      for (const [T, E] of x.pairs) n(T, E);
    u((T) => [l, ...T.filter((E) => E !== l)].slice(0, 5)), i(!1);
  }, R = (x) => {
    if (c.length === 0) return;
    const T = Math.max(-1, Math.min(c.length - 1, d + x));
    m(T), a(T === -1 ? "" : c[T]);
  }, $ = (x) => {
    for (const [T, E] of Object.entries(x.ctx)) n(T, E);
    i(!1);
  };
  return /* @__PURE__ */ s(
    "div",
    {
      className: "fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[20vh] px-4",
      onClick: () => i(!1),
      children: /* @__PURE__ */ f(
        "div",
        {
          className: "w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden",
          onClick: (x) => x.stopPropagation(),
          children: [
            /* @__PURE__ */ s(
              "input",
              {
                ref: g,
                type: "text",
                value: l,
                onChange: (x) => a(x.target.value),
                onKeyDown: (x) => {
                  x.key === "Enter" ? (x.preventDefault(), _()) : x.key === "ArrowUp" ? (x.preventDefault(), R(1)) : x.key === "ArrowDown" && (x.preventDefault(), R(-1));
                },
                placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
                className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
              }
            ),
            p.length > 0 && /* @__PURE__ */ s("div", { className: "border-b border-zinc-800 max-h-72 overflow-auto", children: p.map((x, T) => /* @__PURE__ */ f(
              "button",
              {
                onClick: () => $(x),
                className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
                children: [
                  /* @__PURE__ */ s("span", { className: "text-zinc-100", children: x.label }),
                  x.hint && /* @__PURE__ */ s("span", { className: "ml-2 text-[10px] text-zinc-500 font-mono", children: x.hint }),
                  /* @__PURE__ */ s("span", { className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100", children: Object.entries(x.ctx).map(([E, P]) => `${E}=${P}`).join(" · ") })
                ]
              },
              `${x.label}-${T}`
            )) }),
            Object.entries(t).length > 0 && /* @__PURE__ */ f("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "current" }),
              Object.entries(t).map(([x, T]) => /* @__PURE__ */ f("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono", children: [
                x,
                "=",
                T
              ] }, x))
            ] }),
            A.length > 0 && /* @__PURE__ */ f("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "views" }),
              A.map((x) => /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => a(`/load ${x}`),
                  className: "text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-mono",
                  title: `Load view "${x}"`,
                  children: x
                },
                x
              ))
            ] }),
            c.length > 0 && /* @__PURE__ */ f("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "recent" }),
              c.map((x, T) => /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => a(x),
                  className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono",
                  children: x
                },
                T
              ))
            ] }),
            /* @__PURE__ */ f("div", { className: "px-4 py-2 text-[10px] text-zinc-600 flex justify-between", children: [
              /* @__PURE__ */ s("span", { children: "↵ apply  ·  ↑↓ recall" }),
              /* @__PURE__ */ s("span", { children: "esc close" })
            ] })
          ]
        }
      )
    }
  );
}
const Ps = [
  { keys: "⌘ K / Ctrl K", description: "Open command palette (set ctx, save/load views)" },
  { keys: "j / ↓", description: "Focus next widget" },
  { keys: "k / ↑", description: "Focus previous widget" },
  { keys: "f", description: "Fullscreen focused widget" },
  { keys: "r", description: "Refresh focused widget" },
  { keys: "↵", description: "In palette: apply current input" },
  { keys: "Esc", description: "Clear focus / close palette / close fullscreen" },
  { keys: "⌘ 1 — 9", description: "In multi-tab: jump to tab N" },
  { keys: "?", description: "Show this shortcuts cheat sheet" },
  { keys: "/save <name>", description: "In palette: save current ctx as a named view" },
  { keys: "/load <name>", description: "In palette: restore a saved view" },
  { keys: "/delete <name>", description: "In palette: delete a saved view" }
];
function Ls(e) {
  return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([n, r]) => `${n}=${r}`).join(" · ")}`;
}
function Is({ templateShortcuts: e }) {
  const [t, n] = v(!1);
  return j(() => {
    const r = (o) => {
      const i = o.target?.tagName, l = i === "INPUT" || i === "TEXTAREA" || o.target?.isContentEditable;
      o.key === "?" && !l ? (o.preventDefault(), n((a) => !a)) : o.key === "Escape" && n(!1);
    };
    return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
  }, []), t ? /* @__PURE__ */ s(
    "div",
    {
      className: "fixed inset-0 z-40 bg-black/60 flex items-center justify-center px-4",
      onClick: () => n(!1),
      children: /* @__PURE__ */ f(
        "div",
        {
          className: "w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
          onClick: (r) => r.stopPropagation(),
          children: [
            /* @__PURE__ */ f("div", { className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between", children: [
              /* @__PURE__ */ s("h3", { className: "text-sm font-medium text-zinc-100", children: "Keyboard shortcuts" }),
              /* @__PURE__ */ s("span", { className: "text-[10px] text-zinc-500", children: "esc to close" })
            ] }),
            /* @__PURE__ */ f("div", { className: "px-4 py-3 flex flex-col gap-1.5", children: [
              Ps.map((r, o) => /* @__PURE__ */ f("div", { className: "flex items-baseline gap-3", children: [
                /* @__PURE__ */ s("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.keys }),
                /* @__PURE__ */ s("span", { className: "text-xs text-zinc-400", children: r.description })
              ] }, o)),
              e && e.length > 0 && /* @__PURE__ */ f(lt, { children: [
                /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1", children: "Dashboard shortcuts" }),
                e.map((r, o) => /* @__PURE__ */ f("div", { className: "flex items-baseline gap-3", children: [
                  /* @__PURE__ */ s("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.key }),
                  /* @__PURE__ */ s("span", { className: "text-xs text-zinc-400", children: Ls(r) })
                ] }, `tpl-${o}`))
              ] })
            ] })
          ]
        }
      )
    }
  ) : null;
}
const Ds = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
  error: "border-red-500/40     bg-red-500/10     text-red-200",
  info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, Fs = 3500;
function Us({ toasts: e, dismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ s("div", { className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none", children: e.map((n) => /* @__PURE__ */ s(Bs, { toast: n, dismiss: t }, n.id)) });
}
function Bs({ toast: e, dismiss: t }) {
  return j(() => {
    const n = setTimeout(() => t(e.id), Fs);
    return () => clearTimeout(n);
  }, [e.id, t]), /* @__PURE__ */ s(
    "div",
    {
      onClick: () => t(e.id),
      className: `pointer-events-auto cursor-pointer text-xs px-3 py-2 rounded border shadow-lg backdrop-blur-sm ${Ds[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
      children: e.message
    }
  );
}
const Bt = /* @__PURE__ */ new Set([
  "timeseries",
  "candlestick",
  "table",
  "metric",
  "text",
  "prompt",
  "gauge",
  "distribution",
  "heatmap",
  "events",
  "catalog",
  "orderbook",
  "paired_grid",
  "trade",
  "ticker",
  "volume_profile",
  "stat_strip",
  "bar_chart",
  "scatter",
  "clock",
  "treemap",
  "image",
  "iframe",
  "histogram",
  "section",
  "area_chart",
  "slider",
  "select",
  "boxplot",
  "radar",
  "dag",
  "multi_select",
  "json",
  "sparkline",
  "action_log",
  "alert_log",
  "tape",
  "file_browser"
]);
function Ks(e, t) {
  const n = [];
  if (!e || typeof e != "object")
    return n.push({ path: "", severity: "error", message: "template is not an object" }), n;
  if (!Array.isArray(e.widgets))
    return n.push({ path: "widgets", severity: "error", message: "widgets must be an array" }), n;
  const r = t ? /* @__PURE__ */ new Set([...Bt, ...t]) : Bt;
  return e.widgets.forEach((o, i) => {
    const l = `widgets[${i}]`;
    if (!o || typeof o != "object") {
      n.push({ path: l, severity: "error", message: "widget is not an object" });
      return;
    }
    if (!o.component || typeof o.component != "string" ? n.push({ path: `${l}.component`, severity: "error", message: "missing component" }) : r.has(o.component) || n.push({
      path: `${l}.component`,
      severity: "warn",
      message: `unknown component "${o.component}" — register via registerWidget() or fix the spelling`
    }), o.span != null && (!Number.isInteger(o.span) || o.span < 1 || o.span > 12) && n.push({ path: `${l}.span`, severity: "warn", message: `span ${o.span} out of range 1..12` }), o.refresh_policy != null && o.refresh_policy !== "global" && o.refresh_policy !== "self" && o.refresh_policy !== "manual" && n.push({
      path: `${l}.refresh_policy`,
      severity: "error",
      message: `refresh_policy ${JSON.stringify(o.refresh_policy)} must be "global" | "self" | "manual"`
    }), o.source) {
      const a = o.source, c = [];
      a.source_id && c.push("source_id"), a.url && c.push("url"), (a.inline !== void 0 || a.data !== void 0) && c.push("inline"), c.length > 1 ? n.push({
        path: `${l}.source`,
        severity: "error",
        message: `multiple source modes set (${c.join(", ")}); pick one`
      }) : c.length === 0 && n.push({
        path: `${l}.source`,
        severity: "warn",
        message: "source declared but no mode (source_id / url / inline)"
      }), a.stream && (a.refreshIntervalMs ?? a.refreshInterval) && n.push({
        path: `${l}.source`,
        severity: "warn",
        message: "stream + refreshIntervalMs both set; refresh is ignored on streaming sources"
      });
    }
    o.alert && ((typeof o.alert.when != "string" || !Qr(o.alert.when)) && n.push({
      path: `${l}.alert.when`,
      severity: "error",
      message: `alert predicate ${JSON.stringify(o.alert.when)} does not parse`
    }), (typeof o.alert.message != "string" || !o.alert.message) && n.push({ path: `${l}.alert.message`, severity: "warn", message: "alert has no message" }));
  }), n;
}
function Kt(e, t) {
  return e.id || `__mt_idx_${t}`;
}
function Hs(e) {
  const t = e?.widgets;
  return !Array.isArray(t) || t.length === 0 ? !1 : t.every((n) => {
    const r = n.source;
    if (!r) return !0;
    const o = r.inline !== void 0 || r.data !== void 0, i = !!(r.source_id || r.url);
    return o || !i;
  });
}
function Ws(e, t, n, r, o) {
  const i = t.map((a, c) => {
    const u = r(a, c);
    if (u === void 0) {
      const d = a.source;
      return d && (d.source_id || d.url || d.stream) ? { ...a, source: { inline: null } } : a;
    }
    return { ...a, source: { inline: u } };
  }), l = {
    ...e,
    context: { values: { ...n } },
    widgets: i
  };
  return o && (l.frozenAt = o), l;
}
const qs = {
  metric: 120,
  timeseries: 300,
  candlestick: 400,
  table: 350,
  text: 350,
  prompt: 60,
  gauge: 220,
  distribution: 280,
  heatmap: 320,
  events: 320,
  catalog: 480,
  orderbook: 380,
  paired_grid: 420,
  trade: 280,
  ticker: 56,
  volume_profile: 380,
  stat_strip: 90,
  bar_chart: 320,
  scatter: 360,
  clock: 100,
  treemap: 380,
  image: 320,
  iframe: 360,
  histogram: 280,
  section: 24,
  area_chart: 280,
  slider: 80,
  select: 80,
  boxplot: 360,
  radar: 380,
  dag: 420,
  multi_select: 100,
  json: 360,
  sparkline: 60,
  action_log: 320,
  alert_log: 320,
  tape: 320
}, Vs = ["1d", "5d", "1m", "3m", "1y", "max"], Gs = 200, Js = 200;
function Ys({ value: e, onChange: t }) {
  return /* @__PURE__ */ s("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: Vs.map((n) => {
    const r = e.toLowerCase() === n;
    return /* @__PURE__ */ s(
      "button",
      {
        onClick: () => t(n),
        className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`,
        children: n
      },
      n
    );
  }) });
}
const Xs = [
  { label: "Off", ms: null },
  { label: "5s", ms: 5e3 },
  { label: "30s", ms: 3e4 },
  { label: "1m", ms: 6e4 },
  { label: "5m", ms: 3e5 }
];
function Zs({ value: e, onChange: t }) {
  return /* @__PURE__ */ s("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: Xs.map((n) => {
    const r = e === n.ms;
    return /* @__PURE__ */ s(
      "button",
      {
        onClick: () => t(n.ms),
        className: `px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${r ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`,
        title: n.ms ? `Refresh every ${n.label}` : "No auto-refresh",
        children: n.label
      },
      n.label
    );
  }) });
}
function Qs() {
  const e = typeof navigator < "u" && /mac/i.test(navigator.platform);
  return /* @__PURE__ */ f(
    "button",
    {
      onClick: () => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: e, ctrlKey: !e, bubbles: !0 })
        );
      },
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded font-mono",
      title: "Open command palette",
      children: [
        e ? "⌘" : "Ctrl",
        " K"
      ]
    }
  );
}
function eo(e) {
  const t = new Date(e), n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), o = String(t.getSeconds()).padStart(2, "0");
  return `${n}:${r}:${o}`;
}
function to(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function no() {
  const { recentActions: e, widgetHealth: t } = ae(), n = dt(!0), r = e[0], o = Object.values(t), i = o.filter((d) => d.streaming), l = i.filter((d) => d.connected && !d.error).length, a = o.filter((d) => d.error).length, c = o.filter((d) => d.stale).length, u = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
  return /* @__PURE__ */ f("div", { className: "border-t border-zinc-800 bg-zinc-900/70 px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ s("div", { className: "flex-1 min-w-0 truncate", children: r ? /* @__PURE__ */ f("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ s("span", { className: "tabular-nums w-7 shrink-0", children: to(n, r.receivedAt) }),
      /* @__PURE__ */ s("span", { className: "text-zinc-300 shrink-0", children: r.actionId }),
      /* @__PURE__ */ s("span", { className: `uppercase tracking-wider shrink-0 ${u}`, children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase() }),
      r.message && /* @__PURE__ */ s("span", { className: "truncate text-zinc-400", children: r.message })
    ] }) : /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "idle" }) }),
    i.length > 0 && /* @__PURE__ */ f(
      "span",
      {
        className: l === i.length ? "text-emerald-400/80" : "text-amber-400/80",
        title: `${l} of ${i.length} streams connected`,
        children: [
          /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
            l,
            "/",
            i.length
          ] }),
          " ",
          /* @__PURE__ */ s("span", { className: "opacity-60", children: "↑" })
        ]
      }
    ),
    c > 0 && /* @__PURE__ */ f("span", { className: "text-amber-400/80 tabular-nums", title: `${c} widget(s) without recent updates`, children: [
      c,
      " stale"
    ] }),
    a > 0 && /* @__PURE__ */ f("span", { className: "text-red-400 tabular-nums", children: [
      a,
      " err"
    ] }),
    /* @__PURE__ */ s("span", { className: "tabular-nums text-zinc-300", children: eo(n) })
  ] });
}
function ro({ health: e }) {
  const t = Object.values(e);
  if (t.length === 0) return null;
  const n = t.filter((l) => l.streaming), r = n.filter((l) => l.connected && !l.error).length, o = t.filter((l) => l.error);
  if (n.length === 0 && o.length === 0) return null;
  const i = o.map((l) => l.title).join(`
`);
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider bg-zinc-900 border border-zinc-800 rounded", children: [
    n.length > 0 && /* @__PURE__ */ f(
      "span",
      {
        className: r === n.length ? "text-emerald-400" : "text-amber-400",
        title: `${r} of ${n.length} streams connected`,
        children: [
          /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
            r,
            "/",
            n.length
          ] }),
          /* @__PURE__ */ s("span", { className: "ml-0.5", children: "↑" })
        ]
      }
    ),
    o.length > 0 && /* @__PURE__ */ f("span", { className: "text-red-400 tabular-nums", title: i, children: [
      o.length,
      " err",
      o.length === 1 ? "" : "s"
    ] })
  ] });
}
function so({ onClick: e }) {
  return /* @__PURE__ */ s(
    "button",
    {
      onClick: e,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: "Refresh every widget",
      children: "Reload"
    }
  );
}
function oo({ enabled: e, onToggle: t }) {
  return /* @__PURE__ */ s(
    "button",
    {
      onClick: t,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
      children: e ? "🔊 On" : "🔇 Off"
    }
  );
}
function io({ compact: e, onToggle: t }) {
  return /* @__PURE__ */ s(
    "button",
    {
      onClick: t,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: e ? "Switch to comfortable density" : "Switch to compact density",
      children: e ? "Cozy" : "Compact"
    }
  );
}
function lo({ onCopied: e }) {
  return /* @__PURE__ */ s(
    "button",
    {
      onClick: async () => {
        if (!(typeof navigator > "u" || !navigator.clipboard))
          try {
            await navigator.clipboard.writeText(window.location.href), e();
          } catch {
          }
      },
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: "Copy current dashboard URL",
      children: "Snapshot"
    }
  );
}
function ao({ onClick: e }) {
  return /* @__PURE__ */ s(
    "button",
    {
      onClick: e,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300 bg-zinc-900 border border-emerald-500/30 rounded",
      title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
      children: "Share"
    }
  );
}
function co({ frozenAt: e }) {
  const t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : null;
  return /* @__PURE__ */ f(
    "span",
    {
      className: "flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800 rounded",
      title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static snapshot — data does not refresh",
      children: [
        /* @__PURE__ */ s("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
        "Snapshot",
        n ? /* @__PURE__ */ f("span", { className: "text-zinc-600 normal-case tracking-normal", children: [
          "· ",
          n
        ] }) : null
      ]
    }
  );
}
function uo(e) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
  const t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), o = document.createElement("a");
  o.href = r, o.download = `${t}.snapshot.json`, document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
function Fn({
  template: e,
  backendUrl: t,
  onEvent: n,
  onCtxChange: r,
  paletteSuggest: o,
  chrome: i = "full",
  onShare: l
}) {
  const a = zr(), c = e.columns || 12, [u, d] = v(e.widgets), m = L(() => Ks(e), [e]), g = L(() => m.some((S) => S.severity === "error"), [m]), p = L(() => !!e.frozenAt || Hs(e), [e]), [b, h] = v(!1), [w, A] = v(() => {
    const S = e.context?.values ?? {};
    return typeof window > "u" ? S : { ...S, ...zs(window.location.search) };
  }), [_, R] = v(() => ht("refreshIntervalMs", null)), [$, x] = v(() => ht("compact", !1)), [T, E] = v(() => ht("soundEnabled", !1));
  j(() => {
    bt("refreshIntervalMs", _);
  }, [_]), j(() => {
    bt("compact", $);
  }, [$]), j(() => {
    bt("soundEnabled", T);
  }, [T]);
  const [P, Y] = v(null), [K, G] = v(null), [te, I] = v(null), [V, W] = v([]), C = F(0), B = ce((S) => {
    I((O) => ({ id: S, n: (O?.n ?? 0) + 1 }));
  }, []), ee = F(n);
  j(() => {
    ee.current = n;
  }, [n]);
  const [X, re] = v([]), y = ce(() => re([]), []), [k, z] = v([]), M = ce(() => z([]), []), [H, Z] = v({}), oe = ce((S, O) => {
    Z((J) => {
      const de = J[S];
      if (O === null) {
        if (!de) return J;
        const ge = { ...J };
        return delete ge[S], ge;
      }
      return de && de.streaming === O.streaming && de.connected === O.connected && de.error === O.error && de.title === O.title && de.stale === O.stale ? J : { ...J, [S]: O };
    });
  }, []), Q = F(/* @__PURE__ */ new Map()), ne = ce((S, O) => (Q.current.set(S, O), () => {
    Q.current.get(S) === O && Q.current.delete(S);
  }), []), me = F({ widgets: u, ctx: w, template: e });
  me.current = { widgets: u, ctx: w, template: e };
  const ke = ce(() => {
    const { widgets: S, ctx: O, template: J } = me.current;
    return Ws(J, S, O, (de, ge) => {
      const he = Q.current.get(Kt(de, ge));
      return he ? he() : void 0;
    }, (/* @__PURE__ */ new Date()).toISOString());
  }, []), Ne = ce((S) => {
    ee.current?.(S), S.type === "action" ? re((O) => [{
      receivedAt: Date.now(),
      actionId: S.actionId,
      clientRequestId: S.clientRequestId,
      status: S.status,
      message: S.message,
      terminal: S.terminal
    }, ...O].slice(0, Gs)) : S.type === "alert" && z((O) => [{
      receivedAt: Date.now(),
      widgetId: S.widgetId,
      severity: S.severity,
      message: S.message,
      predicate: S.predicate
    }, ...O].slice(0, Js));
  }, []), Se = ce((S, O = "info") => {
    C.current += 1;
    const J = C.current;
    W((de) => [...de, { id: J, message: S, severity: O }]);
  }, []), be = ce((S) => {
    W((O) => O.filter((J) => J.id !== S));
  }, []), ze = ce((S, O) => {
    A((J) => J[S] === O ? J : { ...J, [S]: O });
  }, []);
  j(() => {
    if (typeof window > "u") return;
    const S = As(window.location.search, w), O = `${window.location.pathname}${S ? `?${S}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", O);
  }, [w]);
  const Fe = F(r);
  j(() => {
    Fe.current = r;
  }, [r]), j(() => {
    Fe.current?.(w);
  }, [w]);
  const Ue = ce((S, O) => {
    d((J) => Ss(J, S, O));
  }, []), Be = (S) => a === "mobile" ? c : a === "tablet" ? Math.min(S, Math.floor(c / 2)) : Math.min(S, c), Oe = L(
    () => ({
      dispatch: Ue,
      ctx: w,
      setCtx: ze,
      backendUrl: t,
      widgets: u,
      refreshIntervalMs: _ ?? void 0,
      toast: Se,
      compact: $,
      fullscreenId: P,
      setFullscreenId: Y,
      focusedId: K,
      setFocusedId: G,
      refreshPulse: te,
      requestRefresh: B,
      emit: Ne,
      recentActions: X,
      clearRecentActions: y,
      recentAlerts: k,
      clearRecentAlerts: M,
      soundEnabled: T,
      widgetHealth: H,
      reportWidgetHealth: oe,
      registerWidgetData: ne,
      snapshot: ke
    }),
    [
      Ue,
      w,
      ze,
      t,
      u,
      _,
      Se,
      $,
      P,
      K,
      te,
      B,
      Ne,
      X,
      y,
      k,
      M,
      T,
      H,
      oe,
      ne,
      ke
    ]
  );
  j(() => {
    if (!P) return;
    const S = (O) => {
      O.key === "Escape" && Y(null);
    };
    return document.addEventListener("keydown", S), () => document.removeEventListener("keydown", S);
  }, [P]), j(() => {
    if (!K || typeof document > "u") return;
    document.getElementById(`mt-widget-${K}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [K]), j(() => {
    const S = (O) => {
      if (O.metaKey || O.ctrlKey || O.altKey) return;
      const J = O.target?.tagName;
      if (J === "INPUT" || J === "TEXTAREA" || O.target?.isContentEditable) return;
      const ge = e.shortcuts?.find((ue) => ue.key === O.key);
      if (ge) {
        O.preventDefault();
        for (const [ue, je] of Object.entries(ge.ctx)) ze(ue, je);
        return;
      }
      const he = u.map((ue) => ue.id).filter((ue) => !!ue);
      if (he.length === 0) return;
      const Xe = (ue) => {
        const je = K ? he.indexOf(K) : -1, Ze = he[(je + ue + he.length) % he.length];
        G(Ze);
      };
      switch (O.key) {
        case "j":
        case "ArrowDown":
          O.preventDefault(), Xe(1);
          break;
        case "k":
        case "ArrowUp":
          O.preventDefault(), Xe(-1);
          break;
        case "f":
          K && (O.preventDefault(), Y(K));
          break;
        case "r":
          K && (O.preventDefault(), B(K));
          break;
        case "Escape":
          K && G(null);
          break;
      }
    };
    return document.addEventListener("keydown", S), () => document.removeEventListener("keydown", S);
  }, [u, K, B, e.shortcuts, ze]);
  const Ke = P ? u.find((S) => S.id === P) : null;
  return /* @__PURE__ */ s(vn.Provider, { value: Oe, children: /* @__PURE__ */ s(Yr, { children: /* @__PURE__ */ f(Ns, { children: [
    /* @__PURE__ */ s(Rs, { suggest: o }),
    /* @__PURE__ */ s(Is, { templateShortcuts: e.shortcuts }),
    /* @__PURE__ */ s(Us, { toasts: V, dismiss: be }),
    m.length > 0 && (!b || g) && /* @__PURE__ */ s(
      fo,
      {
        issues: m,
        dismissible: !g,
        onDismiss: () => h(!0)
      }
    ),
    /* @__PURE__ */ f("div", { className: "min-h-full bg-zinc-950 flex flex-col", children: [
      /* @__PURE__ */ f("div", { className: "flex-1 p-3 md:p-5", children: [
        (e.title || i === "full") && /* @__PURE__ */ f("div", { className: "mb-4 flex items-center gap-3 flex-wrap", children: [
          e.title && /* @__PURE__ */ s("h1", { className: "text-lg font-semibold text-zinc-100 tracking-tight mr-1", children: Le(e.title, w) }),
          i === "full" && Object.entries(w).map(([S, O]) => S === "range" ? /* @__PURE__ */ s(Ys, { value: O, onChange: (J) => ze(S, J) }, S) : /* @__PURE__ */ f(
            "div",
            {
              className: "px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs",
              children: [
                /* @__PURE__ */ s("span", { className: "text-zinc-500 uppercase tracking-wider mr-1", children: S }),
                /* @__PURE__ */ s("span", { className: "text-zinc-100 font-mono", children: O })
              ]
            },
            S
          )),
          i === "full" && /* @__PURE__ */ f("div", { className: "ml-auto flex items-center gap-2", children: [
            p ? /* @__PURE__ */ s(co, { frozenAt: e.frozenAt }) : /* @__PURE__ */ f(lt, { children: [
              /* @__PURE__ */ s(ro, { health: H }),
              /* @__PURE__ */ s(Zs, { value: _, onChange: R }),
              /* @__PURE__ */ s(so, { onClick: () => B("*") })
            ] }),
            /* @__PURE__ */ s(oo, { enabled: T, onToggle: () => E((S) => !S) }),
            /* @__PURE__ */ s(io, { compact: $, onToggle: () => x((S) => !S) }),
            !p && /* @__PURE__ */ s(
              ao,
              {
                onClick: () => {
                  const S = ke();
                  l ? l(S) : uo(S), Se(l ? "Snapshot shared" : "Snapshot downloaded", "ok");
                }
              }
            ),
            /* @__PURE__ */ s(lo, { onCopied: () => Se("URL copied", "ok") }),
            /* @__PURE__ */ s(Qs, {})
          ] })
        ] }),
        /* @__PURE__ */ s(
          "div",
          {
            className: "grid gap-3 md:gap-4 items-start",
            style: { gridTemplateColumns: `repeat(${c}, 1fr)` },
            children: u.map((S, O) => /* @__PURE__ */ s(
              "div",
              {
                id: S.id ? `mt-widget-${S.id}` : void 0,
                style: {
                  gridColumn: `span ${Be(S.span || 6)}`
                },
                children: /* @__PURE__ */ s(
                  Ln,
                  {
                    config: S,
                    contentHeight: S.height || qs[S.component] || 280,
                    snapshotKey: Kt(S, O)
                  }
                )
              },
              S.id || O
            ))
          }
        )
      ] }),
      i === "full" && /* @__PURE__ */ s(no, {})
    ] }),
    Ke && /* @__PURE__ */ s(mo, { widget: Ke, onClose: () => Y(null) })
  ] }) }) });
}
function fo({
  issues: e,
  dismissible: t,
  onDismiss: n
}) {
  const r = e.filter((a) => a.severity === "error"), o = e.filter((a) => a.severity === "warn"), i = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", l = r.length > 0 ? "Template errors" : "Template warnings";
  return /* @__PURE__ */ f("div", { className: `border-b ${i} px-3 md:px-5 py-2 text-xs flex items-start gap-3`, children: [
    /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ f("div", { className: "font-medium uppercase tracking-wider text-[10px] mb-1", children: [
        l,
        " (",
        r.length + o.length,
        ")"
      ] }),
      /* @__PURE__ */ f("ul", { className: "space-y-0.5", children: [
        [...r, ...o].slice(0, 8).map((a, c) => /* @__PURE__ */ f("li", { className: "font-mono text-[11px] leading-tight", children: [
          /* @__PURE__ */ s("span", { className: "opacity-60", children: a.path || "<root>" }),
          /* @__PURE__ */ s("span", { className: "mx-1.5 opacity-40", children: "·" }),
          /* @__PURE__ */ s("span", { children: a.message })
        ] }, c)),
        e.length > 8 && /* @__PURE__ */ f("li", { className: "opacity-60 text-[10px]", children: [
          "… and ",
          e.length - 8,
          " more"
        ] })
      ] })
    ] }),
    t && /* @__PURE__ */ s(
      "button",
      {
        onClick: n,
        className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
        children: "Dismiss"
      }
    )
  ] });
}
function mo({ widget: e, onClose: t }) {
  const n = typeof window < "u" ? Math.floor(window.innerHeight * 0.82) : 600;
  return /* @__PURE__ */ f(
    "div",
    {
      className: "fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
      onClick: t,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center justify-between mb-3 shrink-0", children: [
          /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: "Fullscreen — esc to close" }),
          /* @__PURE__ */ s(
            "button",
            {
              onClick: t,
              className: "text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs rounded border border-zinc-800",
              children: "Close"
            }
          )
        ] }),
        /* @__PURE__ */ s("div", { onClick: (r) => r.stopPropagation(), className: "flex-1 min-h-0", children: /* @__PURE__ */ s(Ln, { config: e, contentHeight: n }) })
      ]
    }
  );
}
const Un = "medallion-terminal:";
function ht(e, t) {
  if (typeof window > "u" || !window.localStorage) return t;
  try {
    const n = window.localStorage.getItem(Un + e);
    return n == null ? t : JSON.parse(n);
  } catch {
    return t;
  }
}
function bt(e, t) {
  if (!(typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(Un + e, JSON.stringify(t));
    } catch {
    }
}
function po(e, t) {
  j(() => {
    const n = (r) => {
      if (!(r.metaKey || r.ctrlKey)) return;
      const o = Number(r.key);
      Number.isFinite(o) && o >= 1 && o <= 9 && o <= e && (r.preventDefault(), t(o - 1));
    };
    return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
  }, [e, t]);
}
function yc({
  tabs: e,
  activeIndex: t,
  onSelect: n,
  backendUrl: r
}) {
  const o = Math.max(0, Math.min(t, e.length - 1));
  po(e.length, n);
  const [i, l] = v(() => /* @__PURE__ */ new Set([o]));
  return j(() => {
    l((a) => a.has(o) ? a : /* @__PURE__ */ new Set([...a, o]));
  }, [o]), e.length === 0 ? null : /* @__PURE__ */ f("div", { className: "min-h-full bg-zinc-950", children: [
    /* @__PURE__ */ s(ho, { tabs: e, activeIndex: o, onSelect: n }),
    e.map((a, c) => /* @__PURE__ */ s("div", { style: { display: c === o ? "block" : "none" }, children: i.has(c) && /* @__PURE__ */ s(Fn, { template: a.template, backendUrl: r }) }, c))
  ] });
}
function ho({
  tabs: e,
  activeIndex: t,
  onSelect: n
}) {
  const r = typeof navigator < "u" && /mac/i.test(navigator.platform);
  return /* @__PURE__ */ s("div", { className: "flex gap-0.5 px-3 md:px-5 pt-3 border-b border-zinc-800 overflow-x-auto items-end", children: e.map((o, i) => {
    const l = i === t, a = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
    return /* @__PURE__ */ f(
      "button",
      {
        onClick: () => n(i),
        className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${l ? "bg-zinc-900 text-zinc-100 border-x border-t border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`,
        title: a ? `Switch with ${a}` : void 0,
        children: [
          /* @__PURE__ */ s("span", { children: o.label || `Tab ${i + 1}` }),
          a && /* @__PURE__ */ s("span", { className: "text-[9px] text-zinc-600 font-mono uppercase tracking-wider", children: a })
        ]
      },
      i
    );
  }) });
}
function vc(e = 0) {
  const [t, n] = v(() => {
    if (typeof window > "u") return e;
    const o = Number(new URLSearchParams(window.location.search).get("tab"));
    return Number.isFinite(o) && o >= 0 ? o : e;
  });
  return [t, (o) => {
    if (n(o), typeof window < "u") {
      const i = new URLSearchParams(window.location.search);
      i.set("tab", String(o)), window.history.replaceState(null, "", `${window.location.pathname}?${i.toString()}${window.location.hash}`);
    }
  }];
}
function Bn(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 2);
}
function De(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : Math.abs(e) < 1 ? e.toFixed(2) : e.toFixed(1);
}
function Kn(e) {
  return Math.abs(e) >= 1e12 ? (e / 1e12).toFixed(2) + "T" : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function Me(e) {
  if (e == null) return "";
  try {
    const t = new Date(e);
    return isNaN(t.getTime()) ? String(e) : t.toLocaleDateString(void 0, { month: "short", day: "numeric" });
  } catch {
    return String(e);
  }
}
function bo(e, t = {}) {
  const { decimals: n = 2, as: r = "fraction", signed: o = !1 } = t, i = r === "fraction" ? e * 100 : e;
  return `${o && i > 0 ? "+" : ""}${i.toFixed(n)}%`;
}
function go(e, t = "USD", n = {}) {
  const { compact: r = !1, decimals: o } = n;
  try {
    return e.toLocaleString(void 0, {
      style: "currency",
      currency: t,
      maximumFractionDigits: o ?? (r ? 0 : Math.abs(e) >= 100 ? 2 : 4),
      minimumFractionDigits: o ?? (r || Math.abs(e) >= 100 ? 0 : 2)
    });
  } catch {
    return e.toLocaleString();
  }
}
function xo(e, t = {}) {
  const { signed: n = !1, as: r = "fraction" } = t, o = r === "fraction" ? e * 1e4 : e * 100;
  return `${n && o > 0 ? "+" : ""}${Math.round(o)} bps`;
}
const Ae = {
  ok: "#10b981",
  warn: "#f59e0b",
  danger: "#ef4444",
  error: "#ef4444",
  info: "#0ea5e9",
  muted: "#71717a"
}, pe = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#22d3ee",
  "#fb7185"
], Ce = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 6,
  fontSize: 12,
  color: "#fafafa"
};
function yo(e, t) {
  return e ? e in Ae ? Ae[e] : e.startsWith("#") ? e : pe[t % pe.length] : pe[t % pe.length];
}
const Ht = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], vo = {
  buy: "#10b981",
  sell: "#ef4444",
  info: "#0ea5e9",
  warn: "#f59e0b"
};
function wo({ data: e, options: t }) {
  const { hoverTime: n, setHoverTime: r } = Dn(), o = F(null), i = L(() => Ao(e), [e]), l = t?.brush === !0;
  if (!i) return /* @__PURE__ */ s(D, { children: "No data" });
  const a = n != null && n !== o.current;
  return /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(
    tr,
    {
      data: i.points,
      onMouseMove: (c) => {
        const u = c?.activeLabel;
        if (u != null) {
          const d = String(u);
          o.current = d, r(d);
        }
      },
      onMouseLeave: () => {
        o.current = null, r(null);
      },
      children: [
        /* @__PURE__ */ s(Ve, { strokeDasharray: "3 3", stroke: "#27272a" }),
        /* @__PURE__ */ s(
          Ge,
          {
            dataKey: "_ts",
            stroke: "#3f3f46",
            tick: { fontSize: 11, fill: "#a1a1aa" },
            tickFormatter: Me
          }
        ),
        /* @__PURE__ */ s(
          Je,
          {
            stroke: "#3f3f46",
            tick: { fontSize: 11, fill: "#a1a1aa" },
            tickFormatter: Bn,
            width: 60
          }
        ),
        /* @__PURE__ */ s(
          Te,
          {
            contentStyle: Ce,
            labelStyle: { color: "#a1a1aa" },
            labelFormatter: Me
          }
        ),
        i.keys.map((c, u) => /* @__PURE__ */ s(
          nr,
          {
            type: "monotone",
            dataKey: c,
            stroke: Ht[u % Ht.length],
            dot: !1,
            strokeWidth: 2
          },
          c
        )),
        l && i.points.length > 4 && /* @__PURE__ */ s(
          mn,
          {
            dataKey: "_ts",
            height: 20,
            stroke: "#3f3f46",
            fill: "#18181b",
            travellerWidth: 6,
            tickFormatter: Me
          }
        ),
        a && /* @__PURE__ */ s(rr, { x: n, stroke: "#52525b", strokeDasharray: "3 3" }),
        i.annotations.map((c, u) => {
          const d = c.color ?? (c.kind ? vo[c.kind] : null) ?? "#a1a1aa";
          if (c.endTimestamp) {
            const [m, g] = c.timestamp <= c.endTimestamp ? [c.timestamp, c.endTimestamp] : [c.endTimestamp, c.timestamp];
            return /* @__PURE__ */ s(
              sr,
              {
                x1: m,
                x2: g,
                fill: d,
                fillOpacity: 0.1,
                stroke: d,
                strokeOpacity: 0.4,
                strokeDasharray: "3 3",
                label: { value: c.label, position: "insideTopLeft", fontSize: 10, fill: d }
              },
              u
            );
          }
          return c.value === void 0 ? null : /* @__PURE__ */ s(
            or,
            {
              x: c.timestamp,
              y: c.value,
              r: 6,
              fill: d,
              stroke: "#18181b",
              strokeWidth: 2,
              ifOverflow: "extendDomain",
              shape: (m) => /* @__PURE__ */ s(ko, { ...m, kind: c.kind, color: d, label: c.label })
            },
            u
          );
        })
      ]
    }
  ) });
}
function ko({ cx: e, cy: t, kind: n, color: r, label: o }) {
  if (e == null || t == null) return null;
  let i;
  if (n === "buy")
    i = `M${e} ${t - 7} L${e + 6} ${t + 4} L${e - 6} ${t + 4} Z`;
  else if (n === "sell")
    i = `M${e} ${t + 7} L${e + 6} ${t - 4} L${e - 6} ${t - 4} Z`;
  else
    return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("circle", { cx: e, cy: t, r: 5, fill: r, stroke: "#18181b", strokeWidth: 2, children: /* @__PURE__ */ s("title", { children: o }) }) });
  return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("path", { d: i, fill: r, stroke: "#18181b", strokeWidth: 1.5, children: /* @__PURE__ */ s("title", { children: o }) }) });
}
const No = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function So(e) {
  for (const t of No)
    if (t in e) return t;
  return null;
}
function zo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return [];
  const t = e.annotations;
  return Array.isArray(t) ? t.map((n) => {
    const r = n;
    return {
      timestamp: String(r.timestamp ?? ""),
      endTimestamp: r.end_timestamp != null ? String(r.end_timestamp) : r.endTimestamp != null ? String(r.endTimestamp) : void 0,
      value: typeof r.value == "number" ? r.value : void 0,
      label: String(r.label ?? ""),
      kind: r.kind != null ? String(r.kind) : void 0,
      color: r.color != null ? String(r.color) : void 0
    };
  }) : [];
}
function Ao(e) {
  if (!e) return null;
  const t = zo(e);
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const n = e[0], r = So(n);
    if (!r) return null;
    const o = Object.keys(n).filter(
      (l) => l !== r && typeof n[l] == "number"
    );
    return o.length === 0 ? null : { points: e.map((l) => {
      const a = l, c = { _ts: a[r] };
      for (const u of o) c[u] = a[u];
      return c;
    }), keys: o, annotations: t };
  }
  if (typeof e == "object" && e !== null && "points" in e) {
    const n = e.points;
    return !Array.isArray(n) || n.length === 0 ? null : { points: n.map((o) => {
      const i = o;
      return { _ts: i.timestamp ?? i.date ?? i.time ?? i.x, value: i.value ?? i.y ?? i.v };
    }), keys: ["value"], annotations: t };
  }
  if (typeof e == "object" && e !== null && "series" in e) {
    const n = e.series;
    if (!Array.isArray(n)) return null;
    const r = /* @__PURE__ */ new Map(), o = [];
    for (const i of n) {
      const l = i, a = String(l.name || l.label || `s${o.length}`);
      o.push(a);
      const c = l.data ?? l.points;
      if (Array.isArray(c))
        for (const u of c) {
          const d = String(u.timestamp ?? u.date ?? u.time ?? u.x ?? "");
          r.has(d) || r.set(d, { _ts: d }), r.get(d)[a] = u.value ?? u.y ?? u.v;
        }
    }
    return { points: Array.from(r.values()), keys: o, annotations: t };
  }
  return null;
}
const _o = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Timeseries: wo
}, Symbol.toStringTag, { value: "Module" })), To = {
  buy: { shape: "arrowUp", position: "belowBar", color: "#10b981" },
  sell: { shape: "arrowDown", position: "aboveBar", color: "#ef4444" },
  info: { shape: "circle", position: "aboveBar", color: "#0ea5e9" },
  warn: { shape: "circle", position: "aboveBar", color: "#f59e0b" }
}, Wt = {
  shape: "circle",
  position: "aboveBar",
  color: "#71717a"
};
function Co({ data: e }) {
  const { hoverTime: t, setHoverTime: n } = Dn(), r = F(null), o = F(null), i = F(null), l = F(null), a = F(null), c = F(null);
  j(() => {
    if (!r.current) return;
    const d = vr(r.current, {
      layout: {
        background: { type: wr.Solid, color: "transparent" },
        textColor: "#a1a1aa",
        fontSize: 11
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" }
      },
      crosshair: {
        vertLine: { color: "#52525b", width: 1, style: 2 },
        horzLine: { color: "#52525b", width: 1, style: 2 }
      },
      rightPriceScale: {
        borderColor: "#3f3f46"
      },
      timeScale: {
        borderColor: "#3f3f46",
        timeVisible: !0
      },
      handleScroll: !0,
      handleScale: !0
    }), m = d.addSeries(kr, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderDownColor: "#f87171",
      borderUpColor: "#34d399",
      wickDownColor: "#f87171",
      wickUpColor: "#34d399"
    }), g = d.addSeries(Nr, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume"
    });
    d.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 }
    }), o.current = d, i.current = m, l.current = g, a.current = Sr(m, []), d.subscribeCrosshairMove((b) => {
      if (b.time != null) {
        const h = String(b.time);
        c.current = h, n(h);
      } else
        c.current = null, n(null);
    });
    const p = new ResizeObserver((b) => {
      const { width: h, height: w } = b[0].contentRect;
      d.applyOptions({ width: h, height: w });
    });
    return p.observe(r.current), () => {
      p.disconnect(), d.remove(), o.current = null, i.current = null, l.current = null, a.current = null;
    };
  }, []), j(() => {
    const d = o.current, m = i.current;
    if (!d || !m) return;
    if (t == null) {
      d.clearCrosshairPosition();
      return;
    }
    if (t === c.current) return;
    const g = m.data?.()[0]?.close ?? 0;
    d.setCrosshairPosition(g, t, m);
  }, [t]);
  const u = L(() => Mo(e), [e]);
  return j(() => {
    i.current && u.candles.length !== 0 && (i.current.setData(u.candles), u.volumes.length > 0 && l.current && l.current.setData(u.volumes), a.current && a.current.setMarkers($o(u.annotations)), o.current?.timeScale().fitContent());
  }, [u]), /* @__PURE__ */ f("div", { className: "relative w-full h-full", children: [
    /* @__PURE__ */ s("div", { ref: r, className: "w-full h-full" }),
    u.candles.length === 0 && /* @__PURE__ */ s("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s(D, { children: "No data" }) })
  ] });
}
function $o(e) {
  return e.map((t) => {
    const n = t.kind ? To[t.kind] ?? Wt : Wt;
    return {
      time: Hn(t.timestamp),
      position: n.position,
      shape: n.shape,
      color: t.color ?? n.color,
      text: t.label
    };
  });
}
const Eo = ["timestamp", "date", "time", "datetime", "ts", "t"];
function Pe(e, t) {
  for (const r of t)
    if (r in e) return r;
  const n = Object.keys(e).reduce((r, o) => (r[o.toLowerCase()] = o, r), {});
  for (const r of t)
    if (n[r]) return n[r];
  return null;
}
function Hn(e) {
  if (typeof e == "number")
    return e > 1e12 ? Math.floor(e / 1e3) : e;
  const t = String(e).trim();
  if (t.includes("T") || / \d/.test(t)) {
    const n = new Date(t.replace(" ", "T"));
    if (!isNaN(n.getTime())) return Math.floor(n.getTime() / 1e3);
  }
  return t.split(" ")[0].split("T")[0];
}
function Mo(e) {
  const t = { candles: [], volumes: [], annotations: [] };
  if (!e) return t;
  let n, r = [];
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && e !== null) {
    const p = e;
    n = Array.isArray(p.bars) ? p.bars : [], Array.isArray(p.annotations) && (r = p.annotations.map((b) => {
      const h = b;
      return {
        timestamp: String(h.timestamp ?? ""),
        value: typeof h.value == "number" ? h.value : void 0,
        label: String(h.label ?? ""),
        kind: h.kind != null ? String(h.kind) : void 0,
        color: h.color != null ? String(h.color) : void 0
      };
    }));
  } else
    n = [];
  if (n.length === 0 || typeof n[0] != "object" || n[0] === null)
    return { ...t, annotations: r };
  const o = n[0], i = Pe(o, Eo), l = Pe(o, ["open", "o"]), a = Pe(o, ["high", "h"]), c = Pe(o, ["low", "l"]), u = Pe(o, ["close", "c"]), d = Pe(o, ["volume", "vol", "v"]);
  if (!i || !l || !a || !c || !u) return { ...t, annotations: r };
  const m = [], g = [];
  for (const p of n) {
    const b = p, h = Hn(b[i]), w = Number(b[l]), A = Number(b[a]), _ = Number(b[c]), R = Number(b[u]);
    m.push({ time: h, open: w, high: A, low: _, close: R }), d && b[d] != null && g.push({
      time: h,
      value: Number(b[d]),
      color: R >= w ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)"
    });
  }
  return { candles: m, volumes: g, annotations: r };
}
const Oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Candlestick: Co
}, Symbol.toStringTag, { value: "Module" })), jo = 25, Ro = 600;
function Po({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = t?.pageSize || jo, o = t?.row_context, i = t?.heat_columns ?? [], l = t?.export === !0, a = t?.tick_flash === !0, c = t?.search === !0, u = t?.column_formats ?? {}, { columns: d, rows: m, labels: g, formats: p } = L(() => Lo(e), [e]), b = L(() => ({ ...p, ...u }), [p, u]), [h, w] = v(null), [A, _] = v(!0), [R, $] = v(0), [x, T] = v(""), E = (y, k) => {
    const z = d[0] != null ? y[d[0]] : void 0;
    return z == null ? `_idx_${k}` : String(z);
  }, P = F(/* @__PURE__ */ new Map()), [Y, K] = v(/* @__PURE__ */ new Map());
  j(() => {
    if (!a) return;
    const y = /* @__PURE__ */ new Map();
    for (let z = 0; z < m.length; z++) {
      const M = m[z], H = E(M, z), Z = P.current.get(H), oe = {};
      let Q = null;
      for (const ne of d) {
        const me = M[ne];
        typeof me == "number" && (oe[ne] = me, Q == null && Z && Z[ne] != null && Z[ne] !== me && (Q = me > Z[ne] ? "up" : "down"));
      }
      P.current.set(H, oe), Q && y.set(H, Q);
    }
    if (y.size === 0) return;
    K((z) => {
      const M = new Map(z);
      for (const [H, Z] of y) M.set(H, Z);
      return M;
    });
    const k = setTimeout(() => {
      K((z) => {
        const M = new Map(z);
        for (const [H, Z] of y)
          M.get(H) === Z && M.delete(H);
        return M;
      });
    }, Ro);
    return () => clearTimeout(k);
  }, [m, a]);
  const G = L(() => {
    const y = {};
    for (const k of i) {
      let z = 1 / 0, M = -1 / 0;
      for (const H of m) {
        const Z = H[k];
        typeof Z == "number" && Number.isFinite(Z) && (Z < z && (z = Z), Z > M && (M = Z));
      }
      Number.isFinite(z) && Number.isFinite(M) && (y[k] = { min: z, max: M });
    }
    return y;
  }, [m, i]), te = (y) => {
    if (!o) return;
    const k = o.field ?? d[0], z = y[k];
    z != null && n(o.key, String(z));
  }, I = L(() => {
    const y = x.trim().toLowerCase();
    return y ? m.filter(
      (k) => d.some((z) => {
        const M = k[z];
        return M != null && String(M).toLowerCase().includes(y);
      })
    ) : m;
  }, [m, d, x]), V = L(() => h ? [...I].sort((y, k) => {
    const z = y[h], M = k[h];
    if (z == null && M == null) return 0;
    if (z == null) return 1;
    if (M == null) return -1;
    const H = typeof z == "number" && typeof M == "number" ? z - M : String(z).localeCompare(String(M));
    return A ? H : -H;
  }) : I, [I, h, A]), W = Math.max(1, Math.ceil(V.length / r)), C = Math.min(R, W - 1), B = V.slice(C * r, (C + 1) * r), ee = V.length > r, X = (y) => {
    h === y ? _(!A) : (w(y), _(!0)), $(0);
  };
  return d.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ f("div", { className: "flex flex-col h-full", children: [
    (c || l) && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 pb-1", children: [
      c && /* @__PURE__ */ s(
        "input",
        {
          type: "text",
          value: x,
          onChange: (y) => {
            T(y.target.value), $(0);
          },
          placeholder: "filter…",
          className: "flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
        }
      ),
      l && /* @__PURE__ */ s(
        "button",
        {
          onClick: () => {
            const y = [
              d.map(qt).join(","),
              ...V.map((H) => d.map((Z) => qt(H[Z])).join(","))
            ], k = new Blob([y.join(`
`)], { type: "text/csv;charset=utf-8" }), z = URL.createObjectURL(k), M = document.createElement("a");
            M.href = z, M.download = "export.csv", M.click(), URL.revokeObjectURL(z);
          },
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0",
          title: "Download as CSV",
          children: "↓ CSV"
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "overflow-auto flex-1 min-h-0", children: /* @__PURE__ */ f("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ s("thead", { className: "sticky top-0 bg-zinc-900", children: /* @__PURE__ */ s("tr", { children: d.map((y) => {
        const k = b[y], z = k && k !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(k);
        return /* @__PURE__ */ f(
          "th",
          {
            onClick: () => X(y),
            className: `px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${z ? "text-right" : "text-left"}`,
            children: [
              g[y] ?? y,
              h === y && /* @__PURE__ */ s("span", { className: "ml-1 text-zinc-500", children: A ? "↑" : "↓" })
            ]
          },
          y
        );
      }) }) }),
      /* @__PURE__ */ s("tbody", { children: B.map((y, k) => {
        const z = Y.get(E(y, k));
        return /* @__PURE__ */ s(
          "tr",
          {
            onClick: o ? () => te(y) : void 0,
            className: `border-b border-zinc-800/60 transition-colors duration-300 ${z === "up" ? "bg-emerald-500/15" : z === "down" ? "bg-red-500/15" : ""} ${o ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/40"}`,
            children: d.map((H) => {
              const Z = G[H], oe = y[H], Q = Z && typeof oe == "number" ? { backgroundColor: Io(oe, Z.min, Z.max) } : void 0, ne = b[H];
              if (ne === "sparkline" && Array.isArray(oe))
                return /* @__PURE__ */ s("td", { className: "px-3 py-2.5 whitespace-nowrap", style: Q, children: /* @__PURE__ */ s(Do, { values: oe }) }, H);
              const me = ne ? Fo(oe, ne) : St(oe), ke = ne ? ne.split(":").slice(1).includes("signed") : !1, Se = ne && ne !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(ne) ? "text-right" : "", be = ke && typeof oe == "number" ? oe > 0 ? "text-emerald-400" : oe < 0 ? "text-red-400" : "text-zinc-100" : "text-zinc-100";
              return /* @__PURE__ */ s(
                "td",
                {
                  className: `px-3 py-2.5 whitespace-nowrap tabular-nums ${Se} ${be}`,
                  style: Q,
                  children: me
                },
                H
              );
            })
          },
          k
        );
      }) })
    ] }) }),
    ee && /* @__PURE__ */ f("div", { className: "flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400", children: [
      /* @__PURE__ */ f("span", { children: [
        V.length,
        " rows"
      ] }),
      /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ s("button", { onClick: () => $(0), disabled: C === 0, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "«" }),
        /* @__PURE__ */ s("button", { onClick: () => $((y) => y - 1), disabled: C === 0, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "‹" }),
        /* @__PURE__ */ f("span", { className: "px-2 text-zinc-300", children: [
          C + 1,
          " / ",
          W
        ] }),
        /* @__PURE__ */ s("button", { onClick: () => $((y) => y + 1), disabled: C >= W - 1, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "›" }),
        /* @__PURE__ */ s("button", { onClick: () => $(W - 1), disabled: C >= W - 1, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "»" })
      ] })
    ] })
  ] });
}
function Lo(e) {
  const t = { columns: [], rows: [], labels: {}, formats: {} };
  if (!e) return t;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object") {
    const n = [...new Set(e.flatMap((r) => Object.keys(r)))];
    return { ...t, columns: n, rows: e };
  }
  if (typeof e == "object" && e !== null && "rows" in e) {
    const n = e, r = Array.isArray(n.columns) ? n.columns : [];
    if (r.length > 0 && typeof r[0] == "object") {
      const i = r, l = i.map((d) => d.key), a = {}, c = {};
      for (const d of i)
        d.label && (a[d.key] = d.label), d.format && (c[d.key] = d.format);
      const u = n.rows.map(
        (d) => Array.isArray(d) ? Object.fromEntries(l.map((m, g) => [m, d[g]])) : d
      );
      return { columns: l, rows: u, labels: a, formats: c };
    }
    if (r.length > 0) {
      const i = r, l = n.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(i.map((c, u) => [c, a[u]])) : a
      );
      return { ...t, columns: i, rows: l };
    }
    const o = n.rows;
    if (o.length > 0 && typeof o[0] == "object" && !Array.isArray(o[0])) {
      const i = [...new Set(o.flatMap((l) => Object.keys(l)))];
      return { ...t, columns: i, rows: o };
    }
  }
  return t;
}
function Io(e, t, n) {
  if (n === t) return "transparent";
  if (t < 0 && n > 0) {
    const o = Math.max(Math.abs(t), Math.abs(n)), i = Math.max(-1, Math.min(1, e / o));
    return i >= 0 ? `rgba(16, 185, 129, ${0.35 * i})` : `rgba(239, 68, 68, ${0.35 * -i})`;
  }
  return `rgba(14, 165, 233, ${0.35 * ((e - t) / (n - t))})`;
}
function qt(e) {
  if (e == null) return "";
  const t = String(e);
  return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function Do({ values: e }) {
  const t = e.map((c) => Number(c)).filter((c) => Number.isFinite(c));
  if (t.length < 2) return /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "—" });
  const n = Math.min(...t), o = Math.max(...t) - n || 1, l = t[t.length - 1] >= t[0] ? "#10b981" : "#ef4444", a = t.map((c, u) => {
    const d = u / (t.length - 1) * 100, m = 16 - (c - n) / o * 14 - 1;
    return `${d.toFixed(1)},${m.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 100 16", className: "w-20 h-4", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: l,
      strokeWidth: "1.5",
      points: a,
      vectorEffect: "non-scaling-stroke"
    }
  ) });
}
function St(e) {
  return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Fo(e, t) {
  if (e == null) return "—";
  if (typeof e != "number") return St(e);
  const [n, ...r] = t.split(":"), o = new Set(r), i = o.has("signed");
  switch (n) {
    case "currency": {
      const l = r.find((a) => a !== "signed") ?? "USD";
      return go(e, l);
    }
    case "percent": {
      const l = o.has("p") ? "percent" : "fraction";
      return bo(e, { signed: i, as: l });
    }
    case "bps":
      return xo(e, { signed: i });
    case "compact":
      return De(e);
    default:
      return St(e);
  }
}
const Uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DataTable: Po
}, Symbol.toStringTag, { value: "Module" })), Bo = 400;
function Wn(e, t = Bo) {
  const [n, r] = v(e), o = F(e), i = F(0), l = F(void 0);
  return j(() => {
    if (typeof window > "u" || !Number.isFinite(e)) {
      r(e);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      r(e);
      return;
    }
    if (e === n) return;
    o.current = n, i.current = performance.now();
    const c = (u) => {
      const d = Math.min(1, (u - i.current) / t), m = 1 - Math.pow(1 - d, 3), g = o.current + (e - o.current) * m;
      r(g), d < 1 && (l.current = requestAnimationFrame(c));
    };
    return l.current = requestAnimationFrame(c), () => {
      l.current && cancelAnimationFrame(l.current);
    };
  }, [e, t]), n;
}
const Ko = 600;
function Ho({ data: e }) {
  const { value: t, delta: n, unit: r, label: o, trend: i } = qo(e), l = Wn(t), a = F(null), [c, u] = v(null);
  return j(() => {
    const m = a.current;
    if (a.current = t, m == null || m === t) return;
    u(t > m ? "up" : "down");
    const g = setTimeout(() => u(null), Ko);
    return () => clearTimeout(g);
  }, [t]), /* @__PURE__ */ f("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ f("div", { className: `text-3xl font-bold tabular-nums transition-colors duration-300 ${c === "up" ? "text-emerald-300" : c === "down" ? "text-red-300" : "text-white"}`, children: [
      Kn(l),
      r && /* @__PURE__ */ s("span", { className: "text-base font-normal text-zinc-400 ml-1", children: r })
    ] }),
    n != null && /* @__PURE__ */ f("div", { className: `text-sm font-medium ${n >= 0 ? "text-emerald-400" : "text-red-400"}`, children: [
      n >= 0 ? "▲" : "▼",
      " ",
      Vo(n)
    ] }),
    i && i.length >= 2 && /* @__PURE__ */ s(Wo, { values: i }),
    o && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: o })
  ] });
}
function Wo({ values: e }) {
  const t = Math.min(...e), r = Math.max(...e) - t || 1, i = e[e.length - 1] >= e[0] ? "#10b981" : "#ef4444", l = e.map((a, c) => {
    const u = c / (e.length - 1) * 100, d = 18 - (a - t) / r * 16 - 1;
    return `${u.toFixed(1)},${d.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 100 18", className: "w-full max-w-[120px] h-5", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: i,
      strokeWidth: "1.5",
      points: l,
      vectorEffect: "non-scaling-stroke"
    }
  ) });
}
function qo(e) {
  if (typeof e == "number") return { value: e };
  if (typeof e == "object" && e !== null) {
    const t = e;
    return {
      value: Number(t.value ?? 0),
      delta: t.delta != null ? Number(t.delta) : void 0,
      unit: t.unit != null ? String(t.unit) : void 0,
      label: t.label != null ? String(t.label) : void 0,
      trend: Array.isArray(t.trend) && t.trend.every((n) => typeof n == "number") ? t.trend : void 0
    };
  }
  return { value: 0 };
}
function Vo(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Metric: Ho
}, Symbol.toStringTag, { value: "Module" }));
function Jo(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (/^https?:\/\//i.test(t))
    return t;
}
function qn(e) {
  if (!e) return [];
  if (typeof e == "string") return [{ body: e }];
  if (!Array.isArray(e) && typeof e == "object" && e !== null) {
    const t = e;
    return Array.isArray(t.items) ? qn(t.items) : [Vt(t)];
  }
  return Array.isArray(e) ? e.map((t) => typeof t == "string" ? { body: t } : typeof t == "object" && t !== null ? Vt(t) : { body: String(t) }) : [];
}
function Vt(e) {
  return {
    id: e.id != null ? String(e.id) : void 0,
    title: e.title != null ? String(e.title) : void 0,
    meta: e.meta ?? e.source ?? e.date ?? e.author ? [e.source, e.author, e.date].filter(Boolean).map(String).join(" · ") : void 0,
    body: e.body ?? e.content ?? e.summary ?? e.text ? String(e.body ?? e.content ?? e.summary ?? e.text) : void 0,
    tags: Array.isArray(e.tags) ? e.tags.map(String) : void 0,
    image: e.image != null ? String(e.image) : e.image_url != null ? String(e.image_url) : e.thumbnail != null ? String(e.thumbnail) : void 0,
    url: Jo(e.url ?? e.uri ?? e.link ?? e.href)
  };
}
const Yo = 1500;
function Xo({ data: e }) {
  const t = qn(e), n = F(/* @__PURE__ */ new Set()), r = F(!1), [o, i] = v(/* @__PURE__ */ new Set());
  return j(() => {
    const l = t.map(Gt);
    if (!r.current) {
      r.current = !0;
      for (const u of l) n.current.add(u);
      return;
    }
    const a = l.filter((u) => !n.current.has(u));
    for (const u of l) n.current.add(u);
    if (a.length === 0) return;
    i((u) => {
      const d = new Set(u);
      for (const m of a) d.add(m);
      return d;
    });
    const c = setTimeout(() => {
      i((u) => {
        const d = new Set(u);
        for (const m of a) d.delete(m);
        return d;
      });
    }, Yo);
    return () => clearTimeout(c);
  }, [t]), t.length === 0 ? /* @__PURE__ */ s(D, { children: "No content" }) : /* @__PURE__ */ s("div", { className: "overflow-auto h-full space-y-3", children: t.map((l, a) => {
    const c = Gt(l), u = o.has(c) ? "bg-sky-500/5" : "";
    return /* @__PURE__ */ f(
      "article",
      {
        className: `flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${u}`,
        children: [
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            (l.title || l.url) && /* @__PURE__ */ s("h4", { className: "text-sm font-medium text-zinc-100 mb-1 leading-snug", children: l.url ? /* @__PURE__ */ f(
              "a",
              {
                href: l.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hover:text-sky-400 hover:underline",
                children: [
                  l.title || Zo(l.url),
                  /* @__PURE__ */ s("span", { className: "ml-1 text-xs text-zinc-500", "aria-hidden": "true", children: "↗" })
                ]
              }
            ) : l.title }),
            l.meta && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500 mb-1.5", children: l.meta }),
            l.body && /* @__PURE__ */ s("p", { className: "text-sm text-zinc-300 leading-relaxed", children: l.body }),
            l.tags && l.tags.length > 0 && /* @__PURE__ */ s("div", { className: "flex gap-1.5 mt-2 flex-wrap", children: l.tags.map((d, m) => /* @__PURE__ */ s("span", { className: "text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400", children: d }, m)) })
          ] }),
          l.image && /* @__PURE__ */ s(
            "img",
            {
              src: l.image,
              alt: "",
              className: "w-14 h-14 rounded object-cover shrink-0 bg-zinc-800",
              loading: "lazy"
            }
          )
        ]
      },
      a
    );
  }) });
}
function Gt(e) {
  return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function Zo(e) {
  try {
    return new URL(e).hostname;
  } catch {
    return e;
  }
}
const Qo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Text: Xo
}, Symbol.toStringTag, { value: "Module" }));
function ei({ options: e }) {
  const { dispatch: t, ctx: n, setCtx: r, backendUrl: o, widgets: i } = ae(), [l, a] = v(""), [c, u] = v(!1), [d, m] = v(null), [g, p] = v(null), b = e?.url, h = !!o, w = ce(async () => {
    const _ = l.trim();
    if (!(!_ || c) && !(!h && !b)) {
      u(!0), p(null), m(null);
      try {
        const R = h ? await fetch(Hr(o), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Wr(_, n, i))
        }) : await fetch(b, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: _ })
        });
        if (!R.ok) throw new Error(`HTTP ${R.status}`);
        const $ = await R.json(), x = $.text ?? $.dialogue?.text;
        if (x && m(x), $.context?.values)
          for (const [T, E] of Object.entries($.context.values)) r(T, E);
        $.actions && $.actions.length > 0 && t($.actions, { replaceAll: $.replace_all }), a("");
      } catch (R) {
        p(R instanceof Error ? R.message : "Request failed");
      } finally {
        u(!1);
      }
    }
  }, [l, c, h, o, b, n, i, t, r]), A = (_) => {
    _.key === "Enter" && !_.shiftKey && (_.preventDefault(), w());
  };
  return !h && !b ? /* @__PURE__ */ s(D, { padded: !0, children: "Set a backendUrl on Dashboard or options.url on this widget" }) : /* @__PURE__ */ f("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
    /* @__PURE__ */ f("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ s(
        "input",
        {
          type: "text",
          className: `flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
            placeholder-zinc-500 outline-none focus:border-zinc-500 disabled:opacity-50`,
          placeholder: "Ask anything... (Enter to send)",
          value: l,
          onChange: (_) => a(_.target.value),
          onKeyDown: A,
          disabled: c
        }
      ),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: w,
          disabled: c || !l.trim(),
          className: `px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default
            rounded-lg text-sm text-zinc-200 font-medium shrink-0`,
          children: c ? "..." : "Send"
        }
      )
    ] }),
    d && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-400 leading-relaxed", children: d }),
    g && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: g })
  ] });
}
const ti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Prompt: ei
}, Symbol.toStringTag, { value: "Module" })), tt = {
  ok: "#10b981",
  warn: "#f59e0b",
  danger: "#ef4444",
  error: "#ef4444",
  info: "#0ea5e9",
  muted: "#71717a"
}, gt = "M 16 104 A 84 84 0 0 1 184 104";
function ni({ data: e }) {
  const t = ri(e);
  if (!t) return /* @__PURE__ */ s(D, { children: "No data" });
  const n = t.max - t.min, r = n > 0 ? Math.max(0, Math.min(1, (t.value - t.min) / n)) : 0, o = t.bands.find((l) => t.value >= l.from && t.value <= l.to), i = tt[o?.color ?? "info"] ?? tt.info;
  return /* @__PURE__ */ f("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ f("svg", { viewBox: "0 0 200 120", className: "w-full max-w-[260px]", children: [
      /* @__PURE__ */ s("path", { d: gt, fill: "none", stroke: "#27272a", strokeWidth: "16", pathLength: "100" }),
      t.bands.map((l, a) => {
        const c = (l.from - t.min) / n, u = (l.to - t.min) / n;
        return /* @__PURE__ */ s(
          "path",
          {
            d: gt,
            fill: "none",
            stroke: tt[l.color] ?? tt.muted,
            strokeWidth: "16",
            opacity: 0.22,
            pathLength: "100",
            strokeDasharray: `${(u - c) * 100} 100`,
            strokeDashoffset: -c * 100
          },
          a
        );
      }),
      /* @__PURE__ */ s(
        "path",
        {
          d: gt,
          fill: "none",
          stroke: i,
          strokeWidth: "16",
          strokeLinecap: "round",
          pathLength: "100",
          strokeDasharray: `${r * 100} 100`
        }
      ),
      /* @__PURE__ */ s(
        "text",
        {
          x: "100",
          y: "92",
          textAnchor: "middle",
          fill: "#fafafa",
          style: { fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
          children: si(t.value, t.min, t.max)
        }
      )
    ] }),
    t.label && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500 text-center px-2 truncate max-w-full", children: t.label })
  ] });
}
function ri(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e;
  if (typeof t.value != "number") return null;
  const n = typeof t.min == "number" ? t.min : 0, r = typeof t.max == "number" ? t.max : 1, o = Array.isArray(t.bands) ? t.bands.map((i) => {
    const l = i;
    return {
      from: Number(l.from ?? 0),
      to: Number(l.to ?? 0),
      color: String(l.color ?? "info")
    };
  }) : [];
  return {
    value: t.value,
    min: n,
    max: r,
    bands: o,
    label: t.label != null ? String(t.label) : void 0
  };
}
function si(e, t, n) {
  return t === 0 && n === 1 ? `${(e * 100).toFixed(1)}%` : t === -1 && n === 1 ? e >= 0 ? `+${e.toFixed(2)}` : e.toFixed(2) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Gauge: ni
}, Symbol.toStringTag, { value: "Module" }));
function ii({ data: e }) {
  const t = L(() => li(e), [e]);
  if (!t) return /* @__PURE__ */ s(D, { children: "No data" });
  const { slices: n, total: r } = t, o = n.map((a, c) => yo(a.color, c)), i = n.reduce((a, c) => c.value > a.value ? c : a), l = i.value / r * 100;
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ f("div", { className: "flex-1 relative min-h-0", children: [
      /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(ir, { children: [
        /* @__PURE__ */ s(
          lr,
          {
            data: n,
            dataKey: "value",
            nameKey: "label",
            innerRadius: "60%",
            outerRadius: "92%",
            paddingAngle: 2,
            stroke: "none",
            isAnimationActive: !1,
            children: n.map((a, c) => /* @__PURE__ */ s(pn, { fill: o[c] }, c))
          }
        ),
        /* @__PURE__ */ s(
          Te,
          {
            contentStyle: Ce,
            formatter: (a) => {
              const c = Number(a) || 0;
              return [`${ai(c)} (${(c / r * 100).toFixed(1)}%)`, ""];
            }
          }
        )
      ] }) }),
      /* @__PURE__ */ f("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
        /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate max-w-[60%]", children: i.label }),
        /* @__PURE__ */ f("div", { className: "text-2xl font-bold text-white tabular-nums", children: [
          l.toFixed(1),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs", children: n.map((a, c) => /* @__PURE__ */ f("div", { className: "flex items-center gap-1.5 min-w-0", children: [
      /* @__PURE__ */ s("span", { className: "w-2 h-2 rounded-sm shrink-0", style: { backgroundColor: o[c] } }),
      /* @__PURE__ */ s("span", { className: "text-zinc-300 truncate", children: a.label }),
      /* @__PURE__ */ f("span", { className: "text-zinc-500 ml-auto tabular-nums shrink-0", children: [
        (a.value / r * 100).toFixed(1),
        "%"
      ] })
    ] }, c)) })
  ] });
}
function li(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e, n = Array.isArray(t.slices) ? t.slices : null;
  if (!n) return null;
  const r = n.map((l) => {
    const a = l;
    return {
      label: String(a.label ?? ""),
      value: Number(a.value ?? 0),
      color: a.color != null ? String(a.color) : void 0
    };
  }).filter((l) => l.value > 0);
  if (r.length === 0) return null;
  const i = (typeof t.total == "number" ? t.total : null) ?? r.reduce((l, a) => l + a.value, 0);
  return { slices: r, total: i };
}
function ai(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Distribution: ii
}, Symbol.toStringTag, { value: "Module" })), ui = 96, di = 22;
function fi({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => pi(e), [e]);
  if (!r) return /* @__PURE__ */ s(D, { children: "No data" });
  const o = t?.row_context, i = t?.col_context, l = !!(o || i), a = (w, A) => {
    o && n(o.key, r.rows[w]), i && n(i.key, r.columns[A]);
  }, { rows: c, columns: u, cells: d, min: m, max: g, scale: p } = r, b = d.length <= 60, h = L(() => {
    const w = c.map(() => Array(u.length).fill(void 0));
    for (const A of d) w[A.row][A.col] = A;
    return w;
  }, [c, u, d]);
  return /* @__PURE__ */ f("div", { className: "h-full w-full overflow-auto flex flex-col", children: [
    /* @__PURE__ */ f(
      "div",
      {
        className: "inline-grid min-w-full",
        style: {
          gridTemplateColumns: `${ui}px repeat(${u.length}, minmax(28px, 1fr))`,
          gap: 2
        },
        children: [
          /* @__PURE__ */ s("div", { className: "sticky left-0 top-0 z-20 bg-zinc-900" }),
          u.map((w) => /* @__PURE__ */ s(
            "div",
            {
              className: "text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900",
              style: { height: di },
              children: w
            },
            `c-${w}`
          )),
          c.flatMap((w, A) => [
            /* @__PURE__ */ s(
              "div",
              {
                className: "text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900",
                style: { minHeight: 30 },
                children: w
              },
              `rl-${A}`
            ),
            ...u.map((_, R) => {
              const $ = h[A][R];
              if (!$) return /* @__PURE__ */ s("div", { className: "bg-zinc-900 rounded-sm" }, `e-${A}-${R}`);
              const x = Vn($.value, m, g, p);
              return /* @__PURE__ */ s(
                "div",
                {
                  onClick: l ? () => a(A, R) : void 0,
                  className: `rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${l ? "cursor-pointer hover:ring-1 hover:ring-zinc-400" : ""}`,
                  style: { backgroundColor: x, minHeight: 30 },
                  title: `${w} × ${u[R]}: ${$.label ?? $.value.toFixed(2)}`,
                  children: b && /* @__PURE__ */ s("span", { className: "text-white/90", children: $.label ?? hi($.value) })
                },
                `cell-${A}-${R}`
              );
            })
          ])
        ]
      }
    ),
    /* @__PURE__ */ s(mi, { min: m, max: g, scale: p })
  ] });
}
function mi({ min: e, max: t, scale: n }) {
  const r = n === "diverging" ? [-1, -0.5, 0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1], o = t - e;
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ s("span", { className: "tabular-nums", children: De(e) }),
    /* @__PURE__ */ s("div", { className: "flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden", children: r.map((i, l) => {
      const a = n === "diverging" ? i * Math.max(Math.abs(e), Math.abs(t)) : e + i * o;
      return /* @__PURE__ */ s("div", { className: "flex-1", style: { backgroundColor: Vn(a, e, t, n) } }, l);
    }) }),
    /* @__PURE__ */ s("span", { className: "tabular-nums", children: De(t) })
  ] });
}
function pi(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e, n = Array.isArray(t.rows) ? t.rows.map(String) : null, r = Array.isArray(t.columns) ? t.columns.map(String) : null, o = Array.isArray(t.cells) ? t.cells : null;
  if (!n || !r || !o) return null;
  const i = o.map((d) => {
    const m = d;
    return {
      row: Number(m.row ?? 0),
      col: Number(m.col ?? 0),
      value: Number(m.value ?? 0),
      label: m.label != null ? String(m.label) : void 0
    };
  }).filter((d) => d.row >= 0 && d.row < n.length && d.col >= 0 && d.col < r.length);
  if (i.length === 0) return null;
  const l = i.map((d) => d.value), a = typeof t.min == "number" ? t.min : Math.min(...l), c = typeof t.max == "number" ? t.max : Math.max(...l), u = t.scale === "diverging" ? "diverging" : "sequential";
  return { rows: n, columns: r, cells: i, min: a, max: c, scale: u };
}
function ye(e, t, n) {
  return Math.round(e + (t - e) * n);
}
function Vn(e, t, n, r) {
  if (n === t) return "rgb(63 63 70)";
  if (r === "diverging") {
    const i = Math.max(Math.abs(t), Math.abs(n)) || 1, l = Math.max(-1, Math.min(1, e / i));
    if (l >= 0)
      return `rgb(${ye(39, 16, l)} ${ye(39, 185, l)} ${ye(42, 129, l)})`;
    const a = -l;
    return `rgb(${ye(39, 239, a)} ${ye(39, 68, a)} ${ye(42, 68, a)})`;
  }
  const o = Math.max(0, Math.min(1, (e - t) / (n - t)));
  return `rgb(${ye(39, 14, o)} ${ye(39, 165, o)} ${ye(42, 233, o)})`;
}
function hi(e) {
  return Math.abs(e) < 1 ? e.toFixed(2) : Math.abs(e) < 100 ? e.toFixed(1) : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : Math.round(e).toString();
}
const bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Heatmap: fi
}, Symbol.toStringTag, { value: "Module" })), gi = {
  EVENT_STATUS_OK: "bg-emerald-500",
  EVENT_STATUS_WARN: "bg-amber-500",
  EVENT_STATUS_ERROR: "bg-red-500",
  EVENT_STATUS_INFO: "bg-sky-500",
  EVENT_STATUS_PENDING: "bg-zinc-500 animate-pulse",
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  error: "bg-red-500",
  info: "bg-sky-500",
  pending: "bg-zinc-500 animate-pulse"
};
function xi({ data: e, options: t }) {
  const n = L(() => yi(e), [e]), r = t?.filter === !0, [o, i] = v(""), l = L(() => {
    if (!n) return null;
    if (!o.trim()) return n;
    const a = o.toLowerCase();
    return n.filter(
      (c) => c.label.toLowerCase().includes(a) || (c.body?.toLowerCase().includes(a) ?? !1) || (c.source?.toLowerCase().includes(a) ?? !1) || (c.tags?.some((u) => u.toLowerCase().includes(a)) ?? !1)
    );
  }, [n, o]);
  return !n || n.length === 0 ? /* @__PURE__ */ s(D, { children: "No events" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col", children: [
    r && /* @__PURE__ */ s(
      "input",
      {
        type: "text",
        placeholder: "Filter events…",
        value: o,
        onChange: (a) => i(a.target.value),
        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 mb-2 shrink-0"
      }
    ),
    /* @__PURE__ */ f("div", { className: "flex-1 overflow-auto min-h-0", children: [
      l.length === 0 && /* @__PURE__ */ s("div", { className: "flex items-center justify-center h-full text-zinc-500 text-xs", children: "No matches" }),
      l.map((a, c) => /* @__PURE__ */ f("div", { className: "flex gap-3 px-1 py-2.5 border-b border-zinc-800 last:border-0", children: [
        /* @__PURE__ */ s("div", { className: "flex flex-col items-center pt-1.5 shrink-0", children: /* @__PURE__ */ s("span", { className: `w-2 h-2 rounded-full ${gi[a.status ?? ""] ?? "bg-zinc-600"}` }) }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ f("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 tabular-nums shrink-0 font-mono", children: a.timestamp }),
            /* @__PURE__ */ s("span", { className: "text-sm text-zinc-100 truncate", children: a.label })
          ] }),
          a.body && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-400 mt-0.5 line-clamp-2", children: a.body }),
          (a.source || a.tags && a.tags.length > 0) && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mt-1 text-[10px] text-zinc-500 flex-wrap", children: [
            a.source && /* @__PURE__ */ s("span", { className: "text-zinc-500", children: a.source }),
            a.tags?.map((u, d) => /* @__PURE__ */ s("span", { className: "px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400", children: u }, d))
          ] })
        ] })
      ] }, c))
    ] })
  ] });
}
function yi(e) {
  let t = null;
  if (Array.isArray(e))
    t = e;
  else if (e && typeof e == "object") {
    const n = e;
    Array.isArray(n.events) && (t = n.events);
  }
  return t ? t.map((n) => {
    const r = n;
    return {
      timestamp: String(r.timestamp ?? ""),
      label: String(r.label ?? ""),
      status: r.status != null ? String(r.status) : void 0,
      body: r.body != null ? String(r.body) : void 0,
      source: r.source != null ? String(r.source) : void 0,
      tags: Array.isArray(r.tags) ? r.tags.map(String) : void 0
    };
  }) : null;
}
const vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Events: xi
}, Symbol.toStringTag, { value: "Module" })), wi = "medallion.terminal.v1.TerminalService", ki = {
  SHAPE_TIMESERIES: "timeseries",
  SHAPE_CANDLES: "candles",
  SHAPE_TABLE: "table",
  SHAPE_METRIC: "metric",
  SHAPE_GAUGE: "gauge",
  SHAPE_HEATMAP: "heatmap",
  SHAPE_EVENTS: "events",
  SHAPE_DISTRIBUTION: "distribution",
  SHAPE_TEXT: "text",
  SHAPE_ORDERBOOK: "orderbook",
  SHAPE_PAIRED_GRID: "paired_grid",
  SHAPE_EMBED: "embed"
};
function Ni() {
  const { backendUrl: e } = ae(), [t, n] = v(null), [r, o] = v(!0), [i, l] = v(null);
  if (j(() => {
    if (!e) {
      o(!1), n(null);
      return;
    }
    o(!0), l(null);
    const c = new AbortController();
    return fetch(`${e.replace(/\/$/, "")}/${wi}/ListSources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      signal: c.signal
    }).then((u) => u.ok ? u.json() : Promise.reject(new Error(`HTTP ${u.status}`))).then((u) => n(u.sources ?? [])).catch((u) => {
      u.name !== "AbortError" && l(u.message);
    }).finally(() => o(!1)), () => c.abort();
  }, [e]), !e) return /* @__PURE__ */ s(D, { padded: !0, children: "No backendUrl configured on Dashboard" });
  if (r) return /* @__PURE__ */ s(D, { padded: !0, children: "Loading catalog…" });
  if (i) return /* @__PURE__ */ f(D, { padded: !0, children: [
    "Failed to load: ",
    i
  ] });
  if (!t || t.length === 0) return /* @__PURE__ */ s(D, { padded: !0, children: "No sources registered" });
  const a = {};
  for (const c of t) {
    const u = c.shape && ki[c.shape] || "other";
    a[u] || (a[u] = []), a[u].push(c);
  }
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto pr-1", children: Object.entries(a).map(([c, u]) => /* @__PURE__ */ f("div", { className: "mb-4 last:mb-0", children: [
    /* @__PURE__ */ f("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5", children: [
      c,
      " ",
      /* @__PURE__ */ f("span", { className: "text-zinc-700", children: [
        "— ",
        u.length
      ] })
    ] }),
    u.map((d) => /* @__PURE__ */ f("div", { className: "py-2 border-b border-zinc-800/60 last:border-0", children: [
      /* @__PURE__ */ f("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
        /* @__PURE__ */ s("span", { className: "text-sm text-zinc-100 font-mono", children: d.id }),
        d.streamable && /* @__PURE__ */ s("span", { className: "text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded", children: "live" }),
        d.name && /* @__PURE__ */ f("span", { className: "text-xs text-zinc-400", children: [
          "— ",
          d.name
        ] })
      ] }),
      d.description && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500 mt-0.5", children: d.description }),
      d.params && d.params.length > 0 && /* @__PURE__ */ f("div", { className: "text-[10px] text-zinc-500 mt-1 font-mono", children: [
        "params:",
        " ",
        d.params.map((m) => m.required ? `${m.key}*` : m.key).join(", ")
      ] }),
      d.tags && d.tags.length > 0 && /* @__PURE__ */ s("div", { className: "flex gap-1 mt-1 flex-wrap", children: d.tags.map((m) => /* @__PURE__ */ s("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400", children: m }, m)) })
    ] }, d.id))
  ] }, c)) });
}
const Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Catalog: Ni
}, Symbol.toStringTag, { value: "Module" })), Jt = 10;
function zi({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => Ai(e), [e]), o = t?.price_context, i = o ? (p, b) => {
    n(o.key, String(p)), o.side_key && n(o.side_key, b === "bid" ? "buy" : "sell");
  } : void 0;
  if (!r) return /* @__PURE__ */ s(D, { children: "No data" });
  const l = r.bids[0]?.price, a = r.asks[0]?.price, c = r.mid ?? (l != null && a != null ? (l + a) / 2 : 0), u = r.spread ?? (l != null && a != null ? a - l : 0), d = r.bids.slice(0, Jt), m = r.asks.slice(0, Jt).reverse(), g = Math.max(...r.bids.map((p) => p.size), ...r.asks.map((p) => p.size), 1);
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ f("div", { className: "grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800", children: [
      /* @__PURE__ */ s("span", { children: "Price" }),
      /* @__PURE__ */ s("span", { className: "text-right", children: "Size" }),
      /* @__PURE__ */ s("span", { className: "text-right", children: "Cum" })
    ] }),
    /* @__PURE__ */ f("div", { className: "flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto", children: m.map((p, b) => {
        const h = m.slice(b).reduce((w, A) => w + A.size, 0);
        return /* @__PURE__ */ s(Yt, { side: "ask", level: p, cum: h, maxSize: g, onPrice: i }, `ask-${b}`);
      }) }),
      /* @__PURE__ */ f("div", { className: "border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ s("span", { className: "text-zinc-200 tabular-nums", children: zt(c) }),
        /* @__PURE__ */ f("span", { className: "text-zinc-500 text-[10px]", children: [
          "spread ",
          zt(u)
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto", children: d.map((p, b) => {
        const h = d.slice(0, b + 1).reduce((w, A) => w + A.size, 0);
        return /* @__PURE__ */ s(Yt, { side: "bid", level: p, cum: h, maxSize: g, onPrice: i }, `bid-${b}`);
      }) })
    ] }),
    r.venue && /* @__PURE__ */ s("div", { className: "text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0", children: r.venue })
  ] });
}
function Yt({
  side: e,
  level: t,
  cum: n,
  maxSize: r,
  onPrice: o
}) {
  const i = t.size / r * 100, l = e === "bid" ? "bg-emerald-500/10" : "bg-red-500/10", a = e === "bid" ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ f(
    "div",
    {
      onClick: o ? () => o(t.price, e) : void 0,
      className: `relative grid grid-cols-3 gap-2 px-2 py-0.5 ${o ? "cursor-pointer hover:bg-zinc-800/40" : ""}`,
      children: [
        /* @__PURE__ */ s("div", { className: `absolute inset-y-0 right-0 ${l}`, style: { width: `${i}%` } }),
        /* @__PURE__ */ s("span", { className: `relative ${a} tabular-nums`, children: zt(t.price) }),
        /* @__PURE__ */ s("span", { className: "relative text-right text-zinc-200 tabular-nums", children: Zt(t.size) }),
        /* @__PURE__ */ s("span", { className: "relative text-right text-zinc-500 tabular-nums", children: Zt(n) })
      ]
    }
  );
}
function Ai(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = Xt(t.bids), r = Xt(t.asks);
  return n.length === 0 && r.length === 0 ? null : {
    bids: n,
    asks: r,
    mid: typeof t.mid == "number" ? t.mid : void 0,
    spread: typeof t.spread == "number" ? t.spread : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0
  };
}
function Xt(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = t;
    return { price: Number(n.price ?? 0), size: Number(n.size ?? 0) };
  }).filter((t) => Number.isFinite(t.price) && Number.isFinite(t.size) && t.size > 0) : [];
}
function zt(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(2);
}
function Zt(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OrderBook: zi
}, Symbol.toStringTag, { value: "Module" })), Ti = 6;
function Ci({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => $i(e), [e]), o = L(
    () => r ? [...r.rows].sort((u, d) => u.key - d.key) : [],
    [r]
  );
  if (!r) return /* @__PURE__ */ s(D, { children: "No data" });
  const i = r.subject_value, l = o.length >= 2 ? o[1].key - o[0].key : 0, a = r.measures, c = t?.row_context;
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs", children: [
    /* @__PURE__ */ f("div", { className: "px-3 py-2 border-b border-zinc-800 flex items-baseline gap-3 flex-wrap shrink-0", children: [
      /* @__PURE__ */ s("span", { className: "text-zinc-100 font-medium", children: r.subject }),
      r.dimension && /* @__PURE__ */ s("span", { className: "text-zinc-500", children: r.dimension }),
      i != null && /* @__PURE__ */ s("span", { className: "text-zinc-300 tabular-nums", children: i.toLocaleString() }),
      r.venue && /* @__PURE__ */ s("span", { className: "ml-auto text-zinc-500 text-[10px] uppercase tracking-wider", children: r.venue })
    ] }),
    /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto min-h-0", children: /* @__PURE__ */ f("table", { className: "w-full font-mono tabular-nums", children: [
      /* @__PURE__ */ f("thead", { className: "sticky top-0 bg-zinc-900 z-10", children: [
        /* @__PURE__ */ f("tr", { className: "text-[10px] text-zinc-600 border-b border-zinc-800/60", children: [
          /* @__PURE__ */ s("th", { colSpan: a.length, className: "text-center py-1 text-emerald-400 uppercase tracking-wider", children: r.left_label }),
          /* @__PURE__ */ s("th", { className: "bg-zinc-950" }),
          /* @__PURE__ */ s("th", { colSpan: a.length, className: "text-center py-1 text-red-400 uppercase tracking-wider", children: r.right_label })
        ] }),
        /* @__PURE__ */ f("tr", { className: "text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800", children: [
          a.map((u) => /* @__PURE__ */ s("th", { className: "text-right px-2 py-1.5", children: u.label }, `l-${u.key}`)),
          /* @__PURE__ */ s("th", { className: "text-center px-2 py-1.5 bg-zinc-950", children: r.key_label }),
          a.map((u) => /* @__PURE__ */ s("th", { className: "text-right px-2 py-1.5", children: u.label }, `r-${u.key}`))
        ] })
      ] }),
      /* @__PURE__ */ s("tbody", { children: o.map((u, d) => {
        const m = i != null && l > 0 && Math.abs(u.key - i) < l, g = !!c;
        return /* @__PURE__ */ f(
          "tr",
          {
            onClick: g ? () => n(c.key, String(u.key)) : void 0,
            className: `border-b border-zinc-800/40 ${`${m ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"} ${g ? "cursor-pointer" : ""}`}`,
            children: [
              a.map((b) => /* @__PURE__ */ s("td", { className: "text-right px-2 py-1 text-zinc-300", children: en(u.left?.values?.[b.key], b.format) }, `l-${b.key}`)),
              /* @__PURE__ */ s("td", { className: `text-center px-2 py-1 font-medium ${m ? "text-zinc-100 bg-zinc-950/60" : "text-zinc-300 bg-zinc-950/40"}`, children: u.key.toLocaleString() }),
              a.map((b) => /* @__PURE__ */ s("td", { className: "text-right px-2 py-1 text-zinc-300", children: en(u.right?.values?.[b.key], b.format) }, `r-${b.key}`))
            ]
          },
          d
        );
      }) })
    ] }) })
  ] });
}
function $i(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e;
  if (!Array.isArray(t.rows) || t.rows.length === 0) return null;
  const n = t.rows.map((i) => {
    const l = i;
    return {
      // Accept legacy options shape (`strike`/`call`/`put`) so authored
      // fixtures keep rendering during migration.
      key: Number(l.key ?? l.strike ?? 0),
      left: Qt(l.left ?? l.call),
      right: Qt(l.right ?? l.put)
    };
  }), r = Ei(t.measures), o = r.length > 0 ? r : Mi(n);
  return {
    subject: String(t.subject ?? t.underlying ?? ""),
    dimension: typeof t.dimension == "string" ? t.dimension : typeof t.expiry == "string" ? t.expiry : void 0,
    subject_value: typeof t.subject_value == "number" ? t.subject_value : typeof t.underlying_price == "number" ? t.underlying_price : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0,
    rows: n,
    left_label: String(t.left_label ?? "Left"),
    right_label: String(t.right_label ?? "Right"),
    key_label: String(t.key_label ?? "Key"),
    measures: o
  };
}
function Ei(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || typeof n != "object") continue;
    const r = n;
    typeof r.key == "string" && t.push({
      key: r.key,
      label: typeof r.label == "string" && r.label ? r.label : r.key,
      format: typeof r.format == "string" ? r.format : void 0
    });
  }
  return t;
}
function Mi(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of [n.left, n.right])
      if (r?.values) for (const o of Object.keys(r.values)) t.add(o);
  return Array.from(t).slice(0, Ti).map((n) => ({ key: n, label: n }));
}
function Qt(e) {
  if (!e || typeof e != "object") return;
  const t = e;
  if (t.values && typeof t.values == "object" && !Array.isArray(t.values)) {
    const r = {};
    for (const [o, i] of Object.entries(t.values))
      typeof i == "number" && (r[o] = i);
    return Object.keys(r).length === 0 ? void 0 : { values: r };
  }
  const n = {};
  for (const [r, o] of Object.entries(t))
    typeof o == "number" && (n[r] = o);
  return Object.keys(n).length === 0 ? void 0 : { values: n };
}
function en(e, t) {
  if (e == null) return "·";
  if (t === "percent") return `${(e * 100).toFixed(0)}%`;
  if (t === "compact")
    return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
  if (t === "delta")
    return `${e > 0 ? "+" : ""}${e.toFixed(2)}`;
  if (t?.startsWith("currency")) {
    const n = t.split(":")[1] ?? "USD";
    return e.toLocaleString(void 0, { style: "currency", currency: n, maximumFractionDigits: 0 });
  }
  return e.toFixed(2);
}
const Oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PairedGrid: Ci
}, Symbol.toStringTag, { value: "Module" })), ji = /* @__PURE__ */ new Set([
  "ACTION_STATUS_OK",
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]), Ri = /* @__PURE__ */ new Set([
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]);
function it(e) {
  return !!e && ji.has(e);
}
function tn(e) {
  return !!e && Ri.has(e);
}
const Pi = 64;
function Li(e, t) {
  const [n, r] = v([]), [o, i] = v(!1), [l, a] = v(null);
  return j(() => {
    if (!e || !t || !!!(t.clientRequestId || t.id || t.actionId)) return;
    r([]), i(!1), a(null);
    const u = new AbortController();
    let d = !1;
    return (async () => {
      try {
        const m = await fetch(qr(e), {
          method: "POST",
          headers: { "Content-Type": gn },
          body: JSON.stringify(Vr(t)),
          signal: u.signal
        });
        if (!m.ok) throw new Error(`WatchAction: HTTP ${m.status}`);
        if (!m.body) throw new Error("WatchAction: no response body");
        const g = m.body.getReader();
        await xn(g, {
          onMessage: (p) => {
            const b = p;
            r((h) => h.length >= Pi ? [...h.slice(1), b] : [...h, b]), it(b.status) && i(!0);
          },
          onTrailer: (p) => {
            if (p.error) {
              const b = p.error.code ?? "unknown", h = p.error.message ?? "watch error";
              a(`${b}: ${h}`);
            }
            i(!0);
          },
          isDisposed: () => d
        }), g.releaseLock();
      } catch (m) {
        !d && m instanceof Error && m.name !== "AbortError" && (a(m.message), i(!0));
      } finally {
        d || i(!0);
      }
    })(), () => {
      d = !0, u.abort();
    };
  }, [e, t?.clientRequestId, t?.id, t?.actionId]), {
    updates: n,
    latest: n.length > 0 ? n[n.length - 1] : null,
    done: o,
    error: l
  };
}
function Ii({ options: e }) {
  const t = e ?? {}, { ctx: n, toast: r, backendUrl: o, emit: i } = ae(), l = t.symbol ?? n.symbol ?? "", a = t.url, c = t.action_id ?? "place_order", u = o ? "connect" : a ? "url" : null, [d, m] = v("buy"), [g, p] = v(""), [b, h] = v(""), w = F(n.price);
  j(() => {
    n.price !== w.current && (w.current = n.price, n.price != null && h(n.price));
  }, [n.price]);
  const A = F(n.side);
  j(() => {
    n.side !== A.current && (A.current = n.side, (n.side === "buy" || n.side === "sell") && m(n.side));
  }, [n.side]);
  const [_, R] = v(!1), [$, x] = v(null), [T, E] = v(null), [P, Y] = v(!1), [K, G] = v(null), te = Li(u === "connect" ? o : void 0, K);
  j(() => {
    if (!te.latest) return;
    const C = te.latest;
    C.message && x(C.message);
    const B = it(C.status);
    i({
      type: "action",
      actionId: C.action_id ?? c,
      clientRequestId: C.client_request_id ?? "",
      status: String(C.status ?? ""),
      message: C.message,
      terminal: B
    }), B && (C.message && r(C.message, tn(C.status) ? "error" : "ok"), G(null));
  }, [te.latest, r, i, c]), j(() => {
    P && Y(!1);
  }, [g, b, d]);
  const I = ce(async () => {
    if (!u || _) return;
    const C = Number(g);
    if (!Number.isFinite(C) || C <= 0) {
      E("Amount must be a positive number");
      return;
    }
    const B = b ? Number(b) : void 0;
    if (b && (!Number.isFinite(B) || B <= 0)) {
      E("Price must be positive");
      return;
    }
    if (t.confirm && !P) {
      Y(!0), E(null), x(null);
      return;
    }
    const ee = {
      symbol: l,
      side: d,
      amount: C,
      type: B == null ? "market" : "limit",
      ...B != null && { price: B }
    };
    R(!0), E(null), x(null);
    const X = Nn();
    try {
      const re = u === "connect" ? await fetch(wn(o), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kn({ actionId: c, params: ee, clientRequestId: X }))
      }) : await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": X },
        body: JSON.stringify(ee)
      });
      if (!re.ok) throw new Error(`HTTP ${re.status}`);
      const y = await re.json().catch(() => ({})), k = typeof y.message == "string" ? y.message : "Order submitted", z = typeof y.status == "string" ? y.status : "";
      i({
        type: "action",
        actionId: c,
        clientRequestId: X,
        status: z,
        message: k,
        terminal: it(z)
      }), tn(y.status) ? (E(k), r(k, "error")) : (x(k), r(k, "ok"), p(""), h(""), Y(!1)), u === "connect" && !it(y.status) && G({ clientRequestId: X });
    } catch (re) {
      const y = re instanceof Error ? re.message : "Submit failed";
      E(y), r(y, "error"), i({
        type: "action",
        actionId: c,
        clientRequestId: X,
        status: "ACTION_STATUS_FAILED",
        message: y,
        terminal: !0
      });
    } finally {
      R(!1);
    }
  }, [u, o, a, c, _, g, b, l, d, t.confirm, P, r, i]);
  if (j(() => {
    if (!P) return;
    const C = (B) => {
      B.key === "Escape" && Y(!1);
    };
    return document.addEventListener("keydown", C), () => document.removeEventListener("keydown", C);
  }, [P]), !u)
    return /* @__PURE__ */ s(D, { children: "Trade requires backendUrl or options.url" });
  const V = (C) => `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${d === C ? C === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"}`, W = d === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
  if (P) {
    const C = b ? Number(b) : null, B = `${d.toUpperCase()} ${g}${t.quote_unit ? ` ${t.quote_unit}` : ""} ${C ? `@ ${C.toLocaleString()}` : "at market"}`;
    return /* @__PURE__ */ f("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
      /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: "Confirm" }),
      /* @__PURE__ */ s("div", { className: `text-sm font-medium ${d === "buy" ? "text-emerald-300" : "text-red-300"}`, children: B }),
      l && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: l }),
      /* @__PURE__ */ f("div", { className: "flex gap-2 mt-1", children: [
        /* @__PURE__ */ s(
          "button",
          {
            onClick: () => Y(!1),
            className: "flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ s(
          "button",
          {
            onClick: I,
            disabled: _,
            className: `flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-30 ${W}`,
            children: _ ? "..." : "Confirm"
          }
        )
      ] }),
      T && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: T })
    ] });
  }
  return /* @__PURE__ */ f("div", { className: "flex flex-col gap-2 h-full", children: [
    /* @__PURE__ */ f("div", { className: "flex gap-1 bg-zinc-950 rounded p-1", children: [
      /* @__PURE__ */ s("button", { onClick: () => m("buy"), className: V("buy"), children: "Buy" }),
      /* @__PURE__ */ s("button", { onClick: () => m("sell"), className: V("sell"), children: "Sell" })
    ] }),
    l && /* @__PURE__ */ f("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: [
      l,
      t.available != null && /* @__PURE__ */ f("span", { className: "ml-2 text-zinc-400 normal-case", children: [
        "avail ",
        /* @__PURE__ */ s("span", { className: "tabular-nums text-zinc-200", children: t.available.toLocaleString() }),
        t.quote_unit && /* @__PURE__ */ s("span", { className: "ml-1", children: t.quote_unit })
      ] })
    ] }),
    /* @__PURE__ */ s(
      nn,
      {
        label: "Amount",
        unit: t.quote_unit,
        value: g,
        onChange: p,
        disabled: _
      }
    ),
    t.quick_amounts && t.quick_amounts.length > 0 && t.available != null && /* @__PURE__ */ s("div", { className: "flex gap-1", children: t.quick_amounts.map((C, B) => {
      const X = (t.available * C).toFixed(6).replace(/\.?0+$/, "");
      return /* @__PURE__ */ f(
        "button",
        {
          onClick: () => p(X),
          disabled: _,
          className: "flex-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30",
          title: `${(C * 100).toFixed(0)}% of available`,
          children: [
            (C * 100).toFixed(0),
            "%"
          ]
        },
        B
      );
    }) }),
    /* @__PURE__ */ s(
      nn,
      {
        label: "Price",
        placeholder: "market",
        value: b,
        onChange: h,
        disabled: _
      }
    ),
    /* @__PURE__ */ s(
      "button",
      {
        onClick: I,
        disabled: _ || !g,
        className: `mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${W}`,
        children: _ ? "..." : d === "buy" ? `Buy ${t.quote_unit ?? ""}`.trim() : `Sell ${t.quote_unit ?? ""}`.trim()
      }
    ),
    $ && /* @__PURE__ */ s("div", { className: "text-xs text-emerald-400", children: $ }),
    T && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: T })
  ] });
}
function nn({
  label: e,
  unit: t,
  placeholder: n,
  value: r,
  onChange: o,
  disabled: i
}) {
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 focus-within:border-zinc-500", children: [
    /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500 w-12 shrink-0", children: e }),
    /* @__PURE__ */ s(
      "input",
      {
        type: "number",
        inputMode: "decimal",
        placeholder: n ?? "0.00",
        value: r,
        onChange: (l) => o(l.target.value),
        disabled: i,
        className: "flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
      }
    ),
    t && /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 shrink-0", children: t })
  ] });
}
const Di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Trade: Ii
}, Symbol.toStringTag, { value: "Module" })), Fi = {
  EVENT_STATUS_OK: "border-emerald-500/40 text-emerald-300",
  EVENT_STATUS_WARN: "border-amber-500/40   text-amber-300",
  EVENT_STATUS_ERROR: "border-red-500/40     text-red-300",
  EVENT_STATUS_INFO: "border-sky-500/40     text-sky-300",
  EVENT_STATUS_PENDING: "border-zinc-500/40    text-zinc-300",
  ok: "border-emerald-500/40 text-emerald-300",
  warn: "border-amber-500/40   text-amber-300",
  error: "border-red-500/40     text-red-300",
  info: "border-sky-500/40     text-sky-300",
  pending: "border-zinc-500/40    text-zinc-300"
}, Ui = "border-zinc-700 text-zinc-300";
function Bi({ data: e, options: t }) {
  const n = L(() => Ki(e), [e]);
  if (!n || n.length === 0)
    return /* @__PURE__ */ s(D, { children: "No items" });
  const o = Math.max(5, (t ?? {}).speed_seconds ?? 30);
  return /* @__PURE__ */ s("div", { className: "h-full overflow-hidden flex items-center group", children: /* @__PURE__ */ f(
    "div",
    {
      className: "flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]",
      style: { animationDuration: `${o}s` },
      children: [
        n.map((i, l) => /* @__PURE__ */ s(rn, { item: i }, `a-${l}`)),
        n.map((i, l) => /* @__PURE__ */ s(rn, { item: i, "aria-hidden": !0 }, `b-${l}`))
      ]
    }
  ) });
}
function rn({ item: e, ...t }) {
  const n = Fi[e.status ?? ""] ?? Ui;
  return /* @__PURE__ */ f(
    "div",
    {
      ...t,
      className: `shrink-0 px-2.5 py-1 rounded border bg-zinc-900/40 text-xs flex items-center gap-2 font-mono ${n}`,
      children: [
        /* @__PURE__ */ s("span", { className: "text-[10px] text-zinc-500 tabular-nums", children: e.timestamp }),
        /* @__PURE__ */ s("span", { children: e.label })
      ]
    }
  );
}
function Ki(e) {
  let t = null;
  if (Array.isArray(e))
    t = e;
  else if (e && typeof e == "object") {
    const n = e;
    Array.isArray(n.events) ? t = n.events : Array.isArray(n.items) && (t = n.items);
  }
  return t ? t.map((n) => {
    const r = n;
    return {
      timestamp: String(r.timestamp ?? ""),
      label: String(r.label ?? ""),
      status: r.status != null ? String(r.status) : void 0
    };
  }) : null;
}
const Hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Ticker: Bi
}, Symbol.toStringTag, { value: "Module" }));
function Wi({ data: e }) {
  const t = L(() => qi(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const n = Math.max(...t.map((r) => r.volume), 1);
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto", children: /* @__PURE__ */ s("div", { className: "flex flex-col gap-px font-mono text-[10px]", children: t.map((r, o) => {
    const i = r.volume / n * 100;
    return /* @__PURE__ */ f("div", { className: "relative flex items-center px-2 py-0.5", title: `${r.price} — ${r.volume.toLocaleString()}`, children: [
      /* @__PURE__ */ s(
        "div",
        {
          className: "absolute inset-y-0.5 left-16 bg-sky-500/20 rounded-sm",
          style: { width: `${i}%`, maxWidth: "calc(100% - 4.5rem)" }
        }
      ),
      /* @__PURE__ */ s("span", { className: "relative w-14 shrink-0 text-zinc-300 tabular-nums", children: Vi(r.price) }),
      /* @__PURE__ */ s("span", { className: "relative ml-auto text-zinc-400 tabular-nums", children: Gi(r.volume) })
    ] }, o);
  }) }) });
}
function qi(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.rows) ? t = r.rows : Array.isArray(r.levels) && (t = r.levels);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const o = r;
    return { price: Number(o.price ?? 0), volume: Number(o.volume ?? o.size ?? 0) };
  }).filter((r) => Number.isFinite(r.price) && Number.isFinite(r.volume) && r.volume > 0);
  return n.length === 0 ? null : (n.sort((r, o) => o.price - r.price), n);
}
function Vi(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
}
function Gi(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(0);
}
const Ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VolumeProfile: Wi
}, Symbol.toStringTag, { value: "Module" }));
function Yi({ data: e }) {
  const t = L(() => Qi(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s("div", { className: "h-full overflow-x-auto overflow-y-hidden", children: /* @__PURE__ */ s("div", { className: "flex items-stretch gap-3 h-full", children: t.map((n, r) => /* @__PURE__ */ s(Xi, { stat: n }, r)) }) });
}
function Xi({ stat: e }) {
  const t = Wn(e.value), n = e.delta == null ? "" : e.delta >= 0 ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ f("div", { className: "shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0", children: [
    /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate", children: e.label }),
    /* @__PURE__ */ f("div", { className: "flex items-baseline gap-1", children: [
      /* @__PURE__ */ s("span", { className: "text-base font-semibold text-zinc-100 tabular-nums truncate", children: Kn(t) }),
      e.unit && /* @__PURE__ */ s("span", { className: "text-[10px] text-zinc-500 shrink-0", children: e.unit })
    ] }),
    /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
      e.delta != null && /* @__PURE__ */ f("span", { className: `text-[10px] font-medium tabular-nums ${n}`, children: [
        e.delta >= 0 ? "▲" : "▼",
        " ",
        el(e.delta)
      ] }),
      e.trend && e.trend.length >= 2 && /* @__PURE__ */ s(Zi, { values: e.trend })
    ] })
  ] });
}
function Zi({ values: e }) {
  const t = Math.min(...e), r = Math.max(...e) - t || 1, o = e[e.length - 1] >= e[0], i = e.map((l, a) => {
    const c = a / (e.length - 1) * 100, u = 18 - (l - t) / r * 16 - 1;
    return `${c.toFixed(1)},${u.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 100 18", className: "w-12 h-3.5", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: o ? "#10b981" : "#ef4444",
      strokeWidth: "1.5",
      points: i,
      vectorEffect: "non-scaling-stroke"
    }
  ) });
}
function Qi(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.stats) ? t = r.stats : Array.isArray(r.metrics) && (t = r.metrics);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const o = r;
    return {
      label: String(o.label ?? ""),
      value: Number(o.value ?? 0),
      delta: typeof o.delta == "number" ? o.delta : void 0,
      unit: o.unit != null ? String(o.unit) : void 0,
      trend: Array.isArray(o.trend) && o.trend.every((i) => typeof i == "number") ? o.trend : void 0
    };
  }).filter((r) => Number.isFinite(r.value));
  return n.length > 0 ? n : null;
}
function el(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StatStrip: Yi
}, Symbol.toStringTag, { value: "Module" }));
function nl({ data: e }) {
  const t = L(() => rl(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(hn, { data: t, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(Ve, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Ge,
      {
        dataKey: "label",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        interval: 0
      }
    ),
    /* @__PURE__ */ s(
      Je,
      {
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        tickFormatter: ol,
        width: 50
      }
    ),
    /* @__PURE__ */ s(
      Te,
      {
        contentStyle: Ce,
        cursor: { fill: "rgba(82, 82, 91, 0.2)" }
      }
    ),
    /* @__PURE__ */ s(bn, { dataKey: "value", radius: [2, 2, 0, 0], children: t.map((n, r) => /* @__PURE__ */ s(pn, { fill: sl(n) }, r)) })
  ] }) });
}
function rl(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.bars) ? t = r.bars : Array.isArray(r.rows) && (t = r.rows);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const o = r;
    return {
      label: String(o.label ?? o.name ?? ""),
      value: Number(o.value ?? 0),
      color: o.color != null ? String(o.color) : void 0
    };
  }).filter((r) => Number.isFinite(r.value));
  return n.length > 0 ? n : null;
}
function sl(e) {
  return e.color && Ae[e.color] ? Ae[e.color] : e.color && e.color.startsWith("#") ? e.color : e.value < 0 ? "#ef4444" : "#38bdf8";
}
function ol(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 1);
}
const il = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BarChart: nl
}, Symbol.toStringTag, { value: "Module" }));
function ll({ data: e }) {
  const t = L(() => al(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const n = t.some((r) => r.size != null);
  return /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(ar, { margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(Ve, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Ge,
      {
        type: "number",
        dataKey: "x",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" }
      }
    ),
    /* @__PURE__ */ s(
      Je,
      {
        type: "number",
        dataKey: "y",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        width: 50
      }
    ),
    n && /* @__PURE__ */ s(cr, { type: "number", dataKey: "size", range: [40, 280] }),
    /* @__PURE__ */ s(
      Te,
      {
        cursor: { strokeDasharray: "3 3", stroke: "#52525b" },
        contentStyle: Ce
      }
    ),
    /* @__PURE__ */ s(
      ur,
      {
        data: t,
        fill: "#0ea5e9",
        shape: (r) => {
          const { cx: o, cy: i, payload: l } = r;
          if (o == null || i == null || !l) return /* @__PURE__ */ s("circle", { cx: 0, cy: 0, r: 0 });
          const a = cl(l), u = l.size != null ? Math.min(20, Math.max(3, Math.sqrt(l.size) * 2)) : 5;
          return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("circle", { cx: o, cy: i, r: u, fill: a, fillOpacity: 0.7, stroke: a, strokeWidth: 1, children: l.label && /* @__PURE__ */ s("title", { children: l.label }) }) });
        }
      }
    )
  ] }) });
}
function al(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.points) && (t = r.points);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const o = r;
    return {
      x: Number(o.x ?? 0),
      y: Number(o.y ?? 0),
      label: o.label != null ? String(o.label) : void 0,
      size: typeof o.size == "number" ? o.size : void 0,
      color: o.color != null ? String(o.color) : void 0
    };
  }).filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
  return n.length > 0 ? n : null;
}
function cl(e) {
  return e.color && Ae[e.color] ? Ae[e.color] : e.color && e.color.startsWith("#") ? e.color : "#0ea5e9";
}
const ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Scatter: ll
}, Symbol.toStringTag, { value: "Module" })), dl = ["America/New_York", "Europe/London", "Asia/Singapore"];
function fl({ options: e }) {
  const t = e ?? {}, n = t.zones?.length ? t.zones : dl, r = t.format === "12h", [o, i] = v(() => /* @__PURE__ */ new Date());
  return j(() => {
    const l = setInterval(() => i(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(l);
  }, []), /* @__PURE__ */ s("div", { className: "h-full flex items-center justify-around gap-3", children: n.map((l) => {
    const a = hl(o, l, r), c = bl(o, l), u = pl(l), d = gl(l, o);
    return /* @__PURE__ */ f("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ f("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5", children: [
        /* @__PURE__ */ s("span", { children: u }),
        /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full ${d}` })
      ] }),
      /* @__PURE__ */ s("div", { className: "text-base font-semibold text-zinc-100 tabular-nums", children: a }),
      /* @__PURE__ */ s("div", { className: "text-[10px] text-zinc-600 tabular-nums", children: c })
    ] }, l);
  }) });
}
const ml = {
  "America/New_York": "NY",
  "America/Los_Angeles": "LA",
  "America/Chicago": "CHI",
  "Europe/London": "LDN",
  "Europe/Frankfurt": "FRA",
  "Asia/Tokyo": "TYO",
  "Asia/Singapore": "SGP",
  "Asia/Hong_Kong": "HKG",
  "Asia/Shanghai": "SHA",
  "Australia/Sydney": "SYD",
  UTC: "UTC"
};
function pl(e) {
  return ml[e] ?? e.split("/").pop() ?? e;
}
function hl(e, t, n) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: t,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: n
    }).format(e);
  } catch {
    return "—";
  }
}
function bl(e, t) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: t, timeZoneName: "shortOffset" }).formatToParts(e).find((i) => i.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}
function gl(e, t) {
  try {
    const n = new Intl.DateTimeFormat("en-US", { timeZone: e, hour: "2-digit", hour12: !1 }).format(t), r = Number(n);
    return Number.isFinite(r) ? r >= 9 && r < 17 ? "bg-emerald-500" : r === 8 || r === 17 ? "bg-amber-500" : "bg-zinc-700" : "bg-zinc-700";
  } catch {
    return "bg-zinc-700";
  }
}
const xl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Clock: fl
}, Symbol.toStringTag, { value: "Module" }));
function yl({ data: e }) {
  const t = L(() => kl(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ s(
    dr,
    {
      data: t,
      dataKey: "value",
      nameKey: "name",
      stroke: "#18181b",
      isAnimationActive: !1,
      content: /* @__PURE__ */ s(vl, {}),
      children: /* @__PURE__ */ s(
        Te,
        {
          contentStyle: Ce,
          formatter: (n) => [String(n), ""]
        }
      )
    }
  ) });
}
function vl(e) {
  const { x: t = 0, y: n = 0, width: r = 0, height: o = 0, index: i = 0, name: l, payload: a } = e, c = wl(a, i), u = r > 60 && o > 24;
  return /* @__PURE__ */ f("g", { children: [
    /* @__PURE__ */ s("rect", { x: t, y: n, width: r, height: o, fill: c, fillOpacity: 0.85, stroke: "#18181b", strokeWidth: 2 }),
    u && l && /* @__PURE__ */ s("text", { x: t + 6, y: n + 16, fill: "#fafafa", fontSize: 11, style: { pointerEvents: "none" }, children: l })
  ] });
}
function wl(e, t) {
  return e ? e.color && Ae[e.color] ? Ae[e.color] : e.color && e.color.startsWith("#") ? e.color : pe[t % pe.length] : pe[t % pe.length];
}
function kl(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const o = e;
    Array.isArray(o.slices) ? t = o.slices : Array.isArray(o.nodes) && (t = o.nodes);
  }
  if (!t) return null;
  const n = (o) => {
    if (!o || typeof o != "object") return null;
    const i = o, l = String(i.label ?? i.name ?? ""), a = typeof i.value == "number" ? i.value : void 0, c = i.color != null ? String(i.color) : void 0, u = Array.isArray(i.children) ? i.children : Array.isArray(i.slices) ? i.slices : null, d = u ? u.map(n).filter((m) => m != null) : void 0;
    return !d && (!Number.isFinite(a) || (a ?? 0) <= 0) ? null : { name: l, value: a, color: c, children: d };
  }, r = t.map(n).filter((o) => o != null);
  return r.length > 0 ? r : null;
}
const Nl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Treemap: yl
}, Symbol.toStringTag, { value: "Module" }));
function Sl({ data: e }) {
  const { url: t, alt: n } = zl(e);
  return t ? /* @__PURE__ */ s("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ s(
    "img",
    {
      src: t,
      alt: n,
      loading: "lazy",
      className: "max-w-full max-h-full object-contain"
    }
  ) }) : /* @__PURE__ */ s(D, { children: "No image" });
}
function zl(e) {
  if (typeof e == "string") return { url: e, alt: "" };
  if (e && typeof e == "object") {
    const t = e, n = typeof t.label == "string" ? t.label : typeof t.alt == "string" ? t.alt : "";
    return {
      url: typeof t.url == "string" ? t.url : void 0,
      alt: n
    };
  }
  return { url: void 0, alt: "" };
}
const Al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Image: Sl
}, Symbol.toStringTag, { value: "Module" })), _l = "allow-scripts allow-same-origin";
function Tl({ data: e, options: t }) {
  const { url: n, title: r, sandbox: o } = Cl(e, t);
  return n ? /* @__PURE__ */ s(
    "iframe",
    {
      src: n,
      title: r,
      sandbox: o,
      loading: "lazy",
      className: "w-full h-full border-0 rounded"
    }
  ) : /* @__PURE__ */ s(D, { children: "No URL" });
}
function Cl(e, t) {
  let n, r = "embed", o = _l;
  if (typeof e == "string")
    n = e;
  else if (e && typeof e == "object") {
    const i = e;
    typeof i.url == "string" && (n = i.url), typeof i.label == "string" ? r = i.label : typeof i.title == "string" && (r = i.title), typeof i.sandbox == "string" && (o = i.sandbox);
  }
  return t && (typeof t.url == "string" && !n && (n = t.url), typeof t.title == "string" && r === "embed" && (r = t.title), typeof t.sandbox == "string" && (o = t.sandbox)), { url: n, title: r, sandbox: o };
}
const $l = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Iframe: Tl
}, Symbol.toStringTag, { value: "Module" })), El = 20;
function Ml({ data: e, options: t }) {
  const n = L(() => Ol(e, t), [e, t]);
  return !n || n.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(hn, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(Ve, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Ge,
      {
        dataKey: "bin",
        stroke: "#3f3f46",
        tick: { fontSize: 10, fill: "#a1a1aa" },
        interval: "preserveStartEnd"
      }
    ),
    /* @__PURE__ */ s(
      Je,
      {
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        allowDecimals: !1,
        width: 40
      }
    ),
    /* @__PURE__ */ s(
      Te,
      {
        contentStyle: Ce,
        cursor: { fill: "rgba(82, 82, 91, 0.2)" }
      }
    ),
    /* @__PURE__ */ s(bn, { dataKey: "count", fill: "#0ea5e9", radius: [2, 2, 0, 0] })
  ] }) });
}
function Ol(e, t) {
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null && "count" in e[0])
    return e.map((i) => {
      const l = i, a = typeof l.rangeStart == "number" ? l.rangeStart : 0, c = typeof l.rangeEnd == "number" ? l.rangeEnd : 0;
      return {
        bin: String(l.bin ?? ""),
        count: Number(l.count ?? 0),
        rangeStart: a,
        rangeEnd: c
      };
    }).filter((i) => Number.isFinite(i.count));
  let n = null, r = El;
  if (Array.isArray(e) && e.every((o) => typeof o == "number"))
    n = e;
  else if (e && typeof e == "object") {
    const o = e;
    Array.isArray(o.values) && o.values.every((i) => typeof i == "number") && (n = o.values), typeof o.bins == "number" && (r = o.bins);
  }
  return typeof t?.bins == "number" && (r = t.bins), !n || (n = n.filter((o) => Number.isFinite(o)), n.length === 0) ? null : jl(n, r);
}
function jl(e, t) {
  const n = Math.min(...e), r = Math.max(...e);
  if (n === r) return [{ bin: De(n), count: e.length, rangeStart: n, rangeEnd: r }];
  const o = (r - n) / t, i = Array.from({ length: t }, (l, a) => {
    const c = n + a * o, u = a === t - 1 ? r : c + o;
    return { bin: De((c + u) / 2), count: 0, rangeStart: c, rangeEnd: u };
  });
  for (const l of e) {
    let a = Math.floor((l - n) / o);
    a >= t && (a = t - 1), i[a].count += 1;
  }
  return i;
}
const Rl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Histogram: Ml
}, Symbol.toStringTag, { value: "Module" }));
function Pl({ options: e }) {
  const t = typeof e?.label == "string" ? e.label : "";
  return /* @__PURE__ */ f("div", { className: "h-full flex items-center gap-3 px-1", children: [
    t && /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0", children: t }),
    /* @__PURE__ */ s("div", { className: "flex-1 h-px bg-zinc-800" })
  ] });
}
const Ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Section: Pl
}, Symbol.toStringTag, { value: "Module" })), nt = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], Il = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function Dl({ data: e, options: t }) {
  const n = L(() => Ul(e), [e]), r = t?.brush === !0;
  if (!n) return /* @__PURE__ */ s(D, { children: "No data" });
  const o = n.keys.length > 1;
  return /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(fr, { data: n.points, children: [
    /* @__PURE__ */ s(Ve, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Ge,
      {
        dataKey: "_ts",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        tickFormatter: Me
      }
    ),
    /* @__PURE__ */ s(
      Je,
      {
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        tickFormatter: Bn,
        width: 50
      }
    ),
    /* @__PURE__ */ s(
      Te,
      {
        contentStyle: Ce,
        labelStyle: { color: "#a1a1aa" },
        labelFormatter: Me
      }
    ),
    n.keys.map((i, l) => /* @__PURE__ */ s(
      mr,
      {
        type: "monotone",
        dataKey: i,
        stroke: nt[l % nt.length],
        fill: nt[l % nt.length],
        fillOpacity: 0.35,
        strokeWidth: 1.5,
        stackId: o ? "stack" : void 0
      },
      i
    )),
    r && n.points.length > 4 && /* @__PURE__ */ s(
      mn,
      {
        dataKey: "_ts",
        height: 20,
        stroke: "#3f3f46",
        fill: "#18181b",
        travellerWidth: 6,
        tickFormatter: Me
      }
    )
  ] }) });
}
function Fl(e) {
  for (const t of Il) if (t in e) return t;
  return null;
}
function Ul(e) {
  if (!e) return null;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const t = e[0], n = Fl(t);
    if (!n) return null;
    const r = Object.keys(t).filter((i) => i !== n && typeof t[i] == "number");
    return r.length === 0 ? null : { points: e.map((i) => {
      const l = i, a = { _ts: l[n] };
      for (const c of r) a[c] = l[c];
      return a;
    }), keys: r };
  }
  if (typeof e == "object" && e !== null && "series" in e) {
    const t = e.series;
    if (!Array.isArray(t)) return null;
    const n = /* @__PURE__ */ new Map(), r = [];
    for (const o of t) {
      const i = o, l = String(i.name || i.label || `s${r.length}`);
      r.push(l);
      const a = i.data ?? i.points;
      if (Array.isArray(a))
        for (const c of a) {
          const u = String(c.timestamp ?? c.date ?? c.time ?? c.x ?? "");
          n.has(u) || n.set(u, { _ts: u }), n.get(u)[l] = c.value ?? c.y ?? c.v;
        }
    }
    return { points: Array.from(n.values()), keys: r };
  }
  return null;
}
const Bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AreaChart: Dl
}, Symbol.toStringTag, { value: "Module" })), Kl = 100;
function Hl({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae(), o = t.min ?? 0, i = t.max ?? 100, l = t.step ?? 1, a = t.label ?? t.key ?? "value", c = (() => {
    if (t.key && n[t.key] != null) {
      const p = Number(n[t.key]);
      if (Number.isFinite(p)) return p;
    }
    return t.default != null ? t.default : o;
  })(), [u, d] = v(c), m = F(null);
  if (j(() => {
    if (!t.key) return;
    const p = n[t.key];
    if (p == null) return;
    const b = Number(p);
    Number.isFinite(b) && b !== u && d(b);
  }, [t.key, n[t.key ?? ""]]), !t.key)
    return /* @__PURE__ */ s(D, { children: "Slider requires options.key" });
  const g = (p) => {
    d(p), m.current && clearTimeout(m.current), m.current = setTimeout(() => {
      r(t.key, String(p));
    }, Kl);
  };
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ f("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: a }),
      /* @__PURE__ */ f("span", { className: "text-sm font-semibold text-zinc-100 tabular-nums", children: [
        xt(u, l),
        t.unit && /* @__PURE__ */ s("span", { className: "text-zinc-500 ml-1", children: t.unit })
      ] })
    ] }),
    /* @__PURE__ */ s(
      "input",
      {
        type: "range",
        min: o,
        max: i,
        step: l,
        value: u,
        onChange: (p) => g(Number(p.target.value)),
        className: "w-full accent-sky-500"
      }
    ),
    /* @__PURE__ */ f("div", { className: "flex justify-between text-[10px] text-zinc-600 tabular-nums", children: [
      /* @__PURE__ */ s("span", { children: xt(o, l) }),
      /* @__PURE__ */ s("span", { children: xt(i, l) })
    ] })
  ] });
}
function xt(e, t) {
  const n = t >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(t)));
  return e.toFixed(n);
}
const Wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Slider: Hl
}, Symbol.toStringTag, { value: "Module" }));
function ql(e, t, n) {
  if (e !== void 0 && e !== "")
    return { current: e, shouldSync: !1 };
  const r = t || n[0]?.value || "";
  return { current: r, shouldSync: r !== "" };
}
function Vl({ data: e, options: t }) {
  const n = t ?? {}, { ctx: r, setCtx: o } = ae(), i = n.key, l = Gl(e, n), a = i ? r[i] : void 0, { current: c, shouldSync: u } = ql(a, n.default, l);
  return j(() => {
    i && u && o(i, c);
  }, [i, u, c, o]), i ? l.length === 0 ? /* @__PURE__ */ s(D, { children: "Select has no choices" }) : /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-1.5 px-2", children: [
    /* @__PURE__ */ s("label", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: n.label ?? n.key }),
    /* @__PURE__ */ s(
      "select",
      {
        value: c,
        onChange: (d) => o(n.key, d.target.value),
        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500",
        children: l.map((d) => /* @__PURE__ */ s("option", { value: d.value, children: d.label }, d.value))
      }
    )
  ] }) : /* @__PURE__ */ s(D, { children: "Select requires options.key" });
}
function Gl(e, t) {
  const n = Jl(e);
  if (n.length > 0) {
    const r = t.value_field ?? "value", o = t.label_field ?? "label";
    return n.map((i) => {
      if (typeof i == "string") return { value: i, label: i };
      if (i && typeof i == "object") {
        const l = i, a = l[r];
        if (typeof a == "string") {
          const c = l[o];
          return { value: a, label: typeof c == "string" ? c : a };
        }
      }
      return null;
    }).filter((i) => i !== null);
  }
  return (t.choices ?? []).map(
    (r) => typeof r == "string" ? { value: r, label: r } : { value: r.value, label: r.label ?? r.value }
  );
}
function Jl(e) {
  if (Array.isArray(e)) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (Array.isArray(t.rows)) return t.rows;
    if (Array.isArray(t.entries)) return t.entries;
  }
  return [];
}
const Yl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Select: Vl
}, Symbol.toStringTag, { value: "Module" })), ve = { top: 12, right: 12, bottom: 28, left: 44 }, sn = ["#0ea5e9", "#10b981", "#a78bfa", "#f59e0b", "#f472b6", "#fbbf24"];
function Xl({ data: e }) {
  const t = L(() => Ql(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const n = t.flatMap((u) => [u.min, u.max, ...u.outliers]), r = Math.min(...n), o = Math.max(...n), i = (o - r) * 0.05 || 1, l = r - i, a = o + i, c = Array.from({ length: 5 }, (u, d) => l + (a - l) * d / 4);
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 600 320", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    Zl,
    {
      boxes: t,
      yMin: l,
      yMax: a,
      ticks: c,
      width: 600,
      height: 320
    }
  ) });
}
function Zl({
  boxes: e,
  yMin: t,
  yMax: n,
  ticks: r,
  width: o,
  height: i
}) {
  const l = o - ve.left - ve.right, a = i - ve.top - ve.bottom, c = l / e.length, u = Math.min(c * 0.5, 60), d = (m) => ve.top + (1 - (m - t) / (n - t)) * a;
  return /* @__PURE__ */ f("g", { children: [
    r.map((m, g) => {
      const p = d(m);
      return /* @__PURE__ */ f("g", { children: [
        /* @__PURE__ */ s("line", { x1: ve.left, x2: ve.left + l, y1: p, y2: p, stroke: "#27272a", strokeDasharray: "3 3" }),
        /* @__PURE__ */ s("text", { x: ve.left - 6, y: p + 3, textAnchor: "end", fontSize: 10, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: De(m) })
      ] }, `g-${g}`);
    }),
    e.map((m, g) => {
      const p = ve.left + c * g + c / 2, b = p - u / 2, h = sn[g % sn.length], w = d(m.min), A = d(m.max), _ = d(m.q1), R = d(m.q3), $ = d(m.median);
      return /* @__PURE__ */ f("g", { children: [
        /* @__PURE__ */ s("line", { x1: p, x2: p, y1: w, y2: A, stroke: h, strokeOpacity: 0.6 }),
        /* @__PURE__ */ s("line", { x1: p - u / 4, x2: p + u / 4, y1: w, y2: w, stroke: h, strokeOpacity: 0.8 }),
        /* @__PURE__ */ s("line", { x1: p - u / 4, x2: p + u / 4, y1: A, y2: A, stroke: h, strokeOpacity: 0.8 }),
        /* @__PURE__ */ s("rect", { x: b, y: R, width: u, height: Math.max(1, _ - R), fill: h, fillOpacity: 0.25, stroke: h, strokeWidth: 1.5 }),
        /* @__PURE__ */ s("line", { x1: b, x2: b + u, y1: $, y2: $, stroke: h, strokeWidth: 2 }),
        m.outliers.map((x, T) => /* @__PURE__ */ s("circle", { cx: p, cy: d(x), r: 2.5, fill: h, fillOpacity: 0.7 }, T)),
        /* @__PURE__ */ s("text", { x: p, y: i - 8, textAnchor: "middle", fontSize: 11, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: m.label })
      ] }, g);
    })
  ] });
}
function Ql(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const t = e.map((n) => {
    if (!n || typeof n != "object") return null;
    const r = n, o = String(r.label ?? "");
    if (typeof r.median == "number")
      return {
        label: o,
        min: Number(r.min ?? r.median),
        q1: Number(r.q1 ?? r.median),
        median: Number(r.median),
        q3: Number(r.q3 ?? r.median),
        max: Number(r.max ?? r.median),
        outliers: Array.isArray(r.outliers) ? r.outliers.filter((i) => typeof i == "number") : []
      };
    if (Array.isArray(r.values)) {
      const i = r.values.filter((l) => typeof l == "number" && Number.isFinite(l));
      return i.length === 0 ? null : ea(o, i);
    }
    return null;
  }).filter((n) => n != null);
  return t.length > 0 ? t : null;
}
function ea(e, t) {
  const n = [...t].sort((p, b) => p - b), r = (p) => {
    const b = (n.length - 1) * p, h = Math.floor(b), w = Math.ceil(b);
    return h === w ? n[h] : n[h] + (n[w] - n[h]) * (b - h);
  }, o = r(0.25), i = r(0.5), l = r(0.75), a = l - o, c = o - 1.5 * a, u = l + 1.5 * a, d = [];
  let m = 1 / 0, g = -1 / 0;
  for (const p of n)
    p < c || p > u ? d.push(p) : (p < m && (m = p), p > g && (g = p));
  return Number.isFinite(m) || (m = n[0]), Number.isFinite(g) || (g = n[n.length - 1]), { label: e, min: m, q1: o, median: i, q3: l, max: g, outliers: d };
}
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Boxplot: Xl
}, Symbol.toStringTag, { value: "Module" }));
function na({ data: e }) {
  const t = L(() => ra(e), [e]);
  return t ? /* @__PURE__ */ s(_e, { width: "100%", height: "100%", children: /* @__PURE__ */ f(pr, { data: t.rows, outerRadius: "75%", children: [
    /* @__PURE__ */ s(hr, { stroke: "#27272a" }),
    /* @__PURE__ */ s(br, { dataKey: "metric", stroke: "#3f3f46", tick: { fontSize: 11, fill: "#a1a1aa" } }),
    /* @__PURE__ */ s(gr, { stroke: "#3f3f46", tick: { fontSize: 9, fill: "#52525b" } }),
    /* @__PURE__ */ s(Te, { contentStyle: Ce }),
    t.series.length > 1 && /* @__PURE__ */ s(xr, { wrapperStyle: { fontSize: 11, color: "#a1a1aa" } }),
    t.series.map((n, r) => /* @__PURE__ */ s(
      yr,
      {
        name: n,
        dataKey: n,
        stroke: pe[r % pe.length],
        fill: pe[r % pe.length],
        fillOpacity: 0.25,
        strokeWidth: 1.5
      },
      n
    ))
  ] }) }) : /* @__PURE__ */ s(D, { children: "No data" });
}
function ra(e) {
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const t = e[0];
    if (typeof t.metric == "string") {
      const n = Object.keys(t).filter((r) => r !== "metric" && typeof t[r] == "number");
      return n.length === 0 ? null : { rows: e, series: n };
    }
  }
  if (e && typeof e == "object") {
    const t = e, n = Array.isArray(t.metrics) ? t.metrics.map(String) : null, r = Array.isArray(t.series) ? t.series : null;
    if (!n || !r) return null;
    const o = r.map((l) => String(l.name ?? "")).filter(Boolean);
    return { rows: n.map((l, a) => {
      const c = { metric: l };
      for (const u of r) {
        const d = u, m = String(d.name ?? ""), g = d.values;
        Array.isArray(g) && typeof g[a] == "number" && (c[m] = g[a]);
      }
      return c;
    }), series: o };
  }
  return null;
}
const sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Radar: na
}, Symbol.toStringTag, { value: "Module" })), oa = {
  ok: "#10b981",
  EVENT_STATUS_OK: "#10b981",
  warn: "#f59e0b",
  EVENT_STATUS_WARN: "#f59e0b",
  error: "#ef4444",
  EVENT_STATUS_ERROR: "#ef4444",
  info: "#0ea5e9",
  EVENT_STATUS_INFO: "#0ea5e9",
  pending: "#71717a",
  EVENT_STATUS_PENDING: "#71717a",
  running: "#0ea5e9"
}, on = "#52525b", $e = 130, We = 44, ln = 80, yt = 18, vt = 16;
function ia({ data: e }) {
  const t = L(() => ca(aa(e)), [e]);
  return t ? /* @__PURE__ */ s("div", { className: "h-full w-full overflow-auto", children: /* @__PURE__ */ f(
    "svg",
    {
      viewBox: `0 0 ${t.width} ${t.height}`,
      width: t.width,
      height: t.height,
      style: { display: "block" },
      children: [
        /* @__PURE__ */ s("defs", { children: /* @__PURE__ */ s("marker", { id: "dag-arrow", markerWidth: "8", markerHeight: "8", refX: "7", refY: "4", orient: "auto", markerUnits: "strokeWidth", children: /* @__PURE__ */ s("path", { d: "M0,0 L0,8 L8,4 z", fill: "#52525b" }) }) }),
        t.edges.map((n, r) => /* @__PURE__ */ s(
          "line",
          {
            x1: n.x1,
            y1: n.y1,
            x2: n.x2,
            y2: n.y2,
            stroke: "#3f3f46",
            strokeWidth: 1.5,
            markerEnd: "url(#dag-arrow)"
          },
          r
        )),
        t.nodes.map((n) => {
          const r = n.status ? oa[n.status] ?? on : on;
          return /* @__PURE__ */ f("g", { children: [
            /* @__PURE__ */ s(
              "rect",
              {
                x: n.x,
                y: n.y,
                width: $e,
                height: We,
                rx: 6,
                ry: 6,
                fill: "#18181b",
                stroke: r,
                strokeWidth: 2
              }
            ),
            /* @__PURE__ */ s(
              "text",
              {
                x: n.x + $e / 2,
                y: n.y + We / 2 + 4,
                textAnchor: "middle",
                fontSize: 11,
                fill: "#fafafa",
                fontFamily: "ui-sans-serif",
                children: la(n.label, 18)
              }
            ),
            /* @__PURE__ */ s("circle", { cx: n.x + 8, cy: n.y + 8, r: 3, fill: r })
          ] }, n.id);
        })
      ]
    }
  ) }) : /* @__PURE__ */ s(D, { children: "No data" });
}
function la(e, t) {
  return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function aa(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = Array.isArray(t.nodes) ? t.nodes : null, r = Array.isArray(t.edges) ? t.edges : [];
  if (!n) return null;
  const o = n.map((l) => {
    const a = l;
    return {
      id: String(a.id ?? ""),
      label: String(a.label ?? a.id ?? ""),
      status: a.status != null ? String(a.status) : void 0
    };
  }).filter((l) => l.id), i = r.map((l) => {
    const a = l;
    return { from: String(a.from ?? ""), to: String(a.to ?? "") };
  }).filter((l) => l.from && l.to);
  return { nodes: o, edges: i };
}
function ca(e) {
  if (!e || e.nodes.length === 0) return null;
  const { nodes: t, edges: n } = e, r = /* @__PURE__ */ new Map();
  for (const h of t) r.set(h.id, []);
  for (const h of n) r.get(h.to)?.push(h.from);
  const o = /* @__PURE__ */ new Map();
  for (const h of t) o.set(h.id, 0);
  let i = !0, l = 0;
  for (; i && l++ < t.length + 1; ) {
    i = !1;
    for (const h of n) {
      const w = (o.get(h.from) ?? 0) + 1;
      (o.get(h.to) ?? 0) < w && (o.set(h.to, w), i = !0);
    }
  }
  const a = /* @__PURE__ */ new Map();
  for (const h of t) {
    const w = o.get(h.id) ?? 0;
    a.has(w) || a.set(w, []), a.get(w).push(h.id);
  }
  const c = Math.max(0, ...o.values()), u = Math.max(...Array.from(a.values(), (h) => h.length)), d = vt * 2 + u * $e + (u - 1) * yt, m = vt * 2 + (c + 1) * We + c * (ln - We), g = /* @__PURE__ */ new Map();
  for (const [h, w] of a) {
    const A = w.length * $e + (w.length - 1) * yt, _ = (d - A) / 2;
    w.forEach((R, $) => {
      g.set(R, {
        x: _ + $ * ($e + yt),
        y: vt + h * ln
      });
    });
  }
  const p = t.map((h) => ({ ...h, ...g.get(h.id) })), b = n.map((h) => {
    const w = g.get(h.from), A = g.get(h.to);
    return !w || !A ? null : {
      x1: w.x + $e / 2,
      y1: w.y + We,
      x2: A.x + $e / 2,
      y2: A.y
    };
  }).filter((h) => h != null);
  return { nodes: p, edges: b, width: d, height: m };
}
const ua = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Dag: ia
}, Symbol.toStringTag, { value: "Module" }));
function da({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae();
  if (!t.key)
    return /* @__PURE__ */ s(D, { children: "MultiSelect requires options.key" });
  const o = t.choices ?? [];
  if (o.length === 0)
    return /* @__PURE__ */ s(D, { children: "MultiSelect requires options.choices" });
  const i = o.map(
    (u) => typeof u == "string" ? { value: u, label: u } : { value: u.value, label: u.label ?? u.value }
  ), l = n[t.key] != null ? n[t.key].split(",").map((u) => u.trim()).filter(Boolean) : t.default ?? [], a = new Set(l), c = (u) => {
    a.has(u) ? a.delete(u) : a.add(u), r(t.key, Array.from(a).join(","));
  };
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ f("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: t.label ?? t.key }),
      /* @__PURE__ */ f("span", { className: "text-[10px] text-zinc-600", children: [
        a.size,
        " / ",
        i.length
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "flex flex-wrap gap-1", children: i.map((u) => {
      const d = a.has(u.value);
      return /* @__PURE__ */ s(
        "button",
        {
          onClick: () => c(u.value),
          className: `px-2 py-0.5 text-xs rounded border ${d ? "bg-sky-500/20 border-sky-500/40 text-sky-200" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"}`,
          children: u.label
        },
        u.value
      );
    }) })
  ] });
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultiSelect: da
}, Symbol.toStringTag, { value: "Module" }));
function ma({ data: e }) {
  const t = L(() => {
    if (e == null) return "";
    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return String(e);
    }
  }, [e]);
  return t ? /* @__PURE__ */ s("pre", { className: "text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed", children: pa(t) }) : /* @__PURE__ */ s(D, { children: "No data" });
}
function pa(e) {
  const t = [], n = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let r = 0, o;
  for (; (o = n.exec(e)) != null; )
    o.index > r && t.push({ text: e.slice(r, o.index) }), o[1] ? (t.push({ text: o[1], color: o[2] ? "#a1a1aa" : "#34d399" }), o[2] && t.push({ text: o[2] })) : o[3] ? t.push({ text: o[3], color: "#fbbf24" }) : o[4] && t.push({ text: o[4], color: "#0ea5e9" }), r = n.lastIndex;
  return r < e.length && t.push({ text: e.slice(r) }), t.map(
    (i, l) => i.color ? /* @__PURE__ */ s("span", { style: { color: i.color }, children: i.text }, l) : i.text
  );
}
const ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Json: ma
}, Symbol.toStringTag, { value: "Module" }));
function ba({ data: e, options: t }) {
  const n = t ?? {}, r = L(() => ga(e), [e]);
  if (!r || r.length < 2)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const o = Math.min(...r), l = Math.max(...r) - o || 1, a = r[r.length - 1] >= r[0], c = n.color ?? (a ? "#10b981" : "#ef4444"), u = r.map((d, m) => {
    const g = m / (r.length - 1) * 100, p = 22 - (d - o) / l * 20 - 1;
    return `${g.toFixed(1)},${p.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ s("svg", { viewBox: "0 0 100 24", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: c,
      strokeWidth: "1.5",
      points: u,
      vectorEffect: "non-scaling-stroke"
    }
  ) }) });
}
function ga(e) {
  if (Array.isArray(e)) {
    if (e.every((t) => typeof t == "number")) return e;
    if (e.length > 0 && typeof e[0] == "object" && e[0] !== null)
      return e.map((t) => {
        const n = t;
        return typeof n.value == "number" ? n.value : Number(n.y ?? n.v ?? NaN);
      }).filter((t) => Number.isFinite(t));
  }
  if (e && typeof e == "object") {
    const t = e;
    if (Array.isArray(t.values) && t.values.every((n) => typeof n == "number"))
      return t.values;
  }
  return null;
}
const xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Sparkline: ba
}, Symbol.toStringTag, { value: "Module" })), ya = {
  ACTION_STATUS_OK: { dot: "bg-emerald-400", text: "text-emerald-300" },
  ACTION_STATUS_ACCEPTED: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_PENDING: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_REJECTED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_FAILED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_CANCELLED: { dot: "bg-zinc-400", text: "text-zinc-300" }
}, va = { dot: "bg-zinc-500", text: "text-zinc-400" };
function wa(e) {
  return e.replace(/^ACTION_STATUS_/, "").toLowerCase();
}
function ka(e) {
  return e ? e.length <= 8 ? e : e.slice(0, 6) + "…" : "";
}
function Na(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Sa({ options: e }) {
  const { recentActions: t, clearRecentActions: n } = ae(), r = e?.limit || 25, o = dt(t.length > 0), i = t.slice(0, r);
  return i.length === 0 ? /* @__PURE__ */ s(D, { children: "No actions yet" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0", children: [
      /* @__PURE__ */ f("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: [
        t.length,
        " action",
        t.length === 1 ? "" : "s"
      ] }),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: n,
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
          title: "Clear log",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto min-h-0", children: i.map((l, a) => {
      const c = ya[l.status] ?? va;
      return /* @__PURE__ */ f(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.message ?? "",
          children: [
            /* @__PURE__ */ s("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: Na(o, l.receivedAt) }),
            /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}` }),
            /* @__PURE__ */ s("span", { className: "text-zinc-200 shrink-0", children: l.actionId }),
            /* @__PURE__ */ s("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${c.text}`, children: wa(l.status) }),
            l.message && /* @__PURE__ */ s("span", { className: "text-zinc-400 truncate flex-1 min-w-0", children: l.message }),
            /* @__PURE__ */ s("span", { className: "text-zinc-600 text-[10px] shrink-0", children: ka(l.clientRequestId) })
          ]
        },
        `${l.clientRequestId}-${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const za = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActionLog: Sa
}, Symbol.toStringTag, { value: "Module" })), an = {
  error: { dot: "bg-red-400", text: "text-red-300" },
  warn: { dot: "bg-amber-400", text: "text-amber-300" },
  ok: { dot: "bg-emerald-400", text: "text-emerald-300" },
  info: { dot: "bg-sky-400", text: "text-sky-300" }
};
function Aa(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function _a({ options: e }) {
  const { recentAlerts: t, clearRecentAlerts: n } = ae(), r = e?.limit || 50, o = dt(t.length > 0), i = t.slice(0, r);
  return i.length === 0 ? /* @__PURE__ */ s(D, { children: "No alerts" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ f("div", { className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0", children: [
      /* @__PURE__ */ f("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: [
        t.length,
        " alert",
        t.length === 1 ? "" : "s"
      ] }),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: n,
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
          title: "Clear log",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto min-h-0", children: i.map((l, a) => {
      const c = an[l.severity] ?? an.warn;
      return /* @__PURE__ */ f(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.predicate,
          children: [
            /* @__PURE__ */ s("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: Aa(o, l.receivedAt) }),
            /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}` }),
            /* @__PURE__ */ s("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${c.text}`, children: l.severity }),
            /* @__PURE__ */ s("span", { className: "text-zinc-200 truncate flex-1 min-w-0", children: l.message }),
            l.widgetId && /* @__PURE__ */ s("span", { className: "text-zinc-600 text-[10px] shrink-0", children: l.widgetId })
          ]
        },
        `${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const Ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AlertLog: _a
}, Symbol.toStringTag, { value: "Module" })), Ca = 500, $a = 800;
function Ea(e) {
  return e.id ? `id:${e.id}` : `t:${e.timestamp ?? ""}|p:${e.price ?? ""}|s:${e.size ?? ""}|x:${e.label ?? ""}`;
}
function Ma(e) {
  const t = (e ?? "").toLowerCase();
  return t === "buy" || t === "bid" ? { row: "bg-emerald-500/5", text: "text-emerald-400" } : t === "sell" || t === "ask" ? { row: "bg-red-500/5", text: "text-red-400" } : { row: "", text: "text-zinc-300" };
}
function Oa(e) {
  if (e == null) return [];
  if (Array.isArray(e)) return e.map(rt);
  if (typeof e == "object") {
    const t = e;
    return Array.isArray(t.events) ? t.events.map(rt) : Array.isArray(t.items) ? t.items.map(rt) : [rt(t)];
  }
  return [];
}
function rt(e) {
  if (e == null || typeof e != "object") return {};
  const t = e;
  return {
    id: t.id != null ? String(t.id) : void 0,
    timestamp: t.timestamp != null ? t.timestamp : t.time != null ? t.time : t.ts != null ? t.ts : void 0,
    price: typeof t.price == "number" ? t.price : void 0,
    size: typeof t.size == "number" ? t.size : typeof t.qty == "number" ? t.qty : typeof t.amount == "number" ? t.amount : void 0,
    side: t.side != null ? String(t.side).toLowerCase() : void 0,
    label: t.label != null ? String(t.label) : t.text != null ? String(t.text) : t.title != null ? String(t.title) : void 0
  };
}
function ja({ data: e, options: t }) {
  const n = t?.cap || Ca, r = Oa(e), [o, i] = v([]), l = F(/* @__PURE__ */ new Set()), a = F(!1);
  if (j(() => {
    if (r.length === 0) return;
    const u = [];
    for (const d of r) {
      const m = Ea(d);
      l.current.has(m) || (l.current.add(m), u.push({ ...d, _key: m, _receivedAt: Date.now() }));
    }
    u.length !== 0 && (i((d) => {
      const m = [...u.reverse(), ...d];
      if (m.length <= n) return m;
      for (const g of m.slice(n)) l.current.delete(g._key);
      return m.slice(0, n);
    }), a.current || (a.current = !0));
  }, [e, n]), o.length === 0)
    return /* @__PURE__ */ s(D, { children: "No prints yet" });
  const c = Date.now() - $a;
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto text-xs font-mono", children: o.map((u) => {
    const d = Ma(u.side), g = u._receivedAt > c && a.current ? "bg-sky-500/10" : d.row;
    return /* @__PURE__ */ f(
      "div",
      {
        className: `grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${g}`,
        children: [
          /* @__PURE__ */ s("span", { className: "text-zinc-500 tabular-nums truncate", children: u.timestamp != null ? Ra(u.timestamp) : "" }),
          /* @__PURE__ */ s("span", { className: `truncate ${d.text}`, children: u.label ?? u.side?.toUpperCase() ?? "·" }),
          /* @__PURE__ */ s("span", { className: `text-right tabular-nums ${d.text}`, children: u.price != null ? Pa(u.price) : "" }),
          /* @__PURE__ */ s("span", { className: "text-right tabular-nums text-zinc-400", children: u.size != null ? La(u.size) : "" })
        ]
      },
      u._key
    );
  }) });
}
function Ra(e) {
  try {
    const t = new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), o = String(t.getSeconds()).padStart(2, "0");
    return `${n}:${r}:${o}`;
  } catch {
    return Me(e);
  }
}
function Pa(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(Math.abs(e) < 1 ? 4 : 2);
}
function La(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const Ia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Tape: ja
}, Symbol.toStringTag, { value: "Module" }));
function Ee(e) {
  if (e instanceof Error) return e.message;
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function Ie(e) {
  const t = (e.kind ?? "").toString().toUpperCase();
  return t === "FOLDER" || t === "KIND_FOLDER";
}
function Da(e) {
  const t = Fa(e);
  return t || [];
}
function Fa(e) {
  if (!e) return null;
  if (Array.isArray(e)) return e;
  if (typeof e == "object") {
    const t = e;
    if (Array.isArray(t.entries)) return t.entries;
    if (Array.isArray(t.rows)) return t.rows;
  }
  return null;
}
function Ua(e) {
  const t = e.filter(Ie).sort(cn), n = e.filter((r) => !Ie(r)).sort(cn);
  return [...t, ...n];
}
function cn(e, t) {
  return (e.name ?? "").localeCompare(t.name ?? "");
}
function Ba(e) {
  return e ? e.split("/").filter(Boolean) : [];
}
function Ka(e, t) {
  const n = (e ?? "").replace(/^\/+|\/+$/g, ""), r = (t ?? "").replace(/^\/+|\/+$/g, "");
  return n ? r ? n + "/" + r : n : r;
}
function Gn(e) {
  const t = ["B", "KB", "MB", "GB", "TB"];
  let n = 0, r = e;
  for (; r >= 1024 && n < t.length - 1; )
    r /= 1024, n++;
  return `${n === 0 ? r.toFixed(0) : r.toFixed(1)} ${t[n]}`;
}
const Ha = /* @__PURE__ */ new Set(["audio", "video", "mkv"]), Wa = /* @__PURE__ */ new Set(["audio", "video", "mkv", "image", "heic"]);
function qa(e) {
  return e.filter((t) => {
    const n = Ye(t.content_type, t.name);
    return n !== null && Ha.has(n);
  });
}
function Va(e) {
  return e.filter((t) => {
    const n = Ye(t.content_type, t.name);
    return n !== null && Wa.has(n);
  });
}
function un(e, t, n, r, o = Math.random) {
  if (e.length === 0) return null;
  if (e.length === 1) return r ? e[0] : null;
  const i = e.findIndex((l) => l.name === t);
  if (n) {
    for (let l = 0; l < 5; l++) {
      const a = e[Math.floor(o() * e.length)];
      if (a.name !== t) return a;
    }
    return e[(i + 1) % e.length];
  }
  return i < 0 ? e[0] : i + 1 < e.length ? e[i + 1] : r ? e[0] : null;
}
function Ga(e, t, n) {
  if (e.length === 0) return null;
  const r = e.findIndex((o) => o.name === t);
  return r > 0 ? e[r - 1] : n ? e[e.length - 1] : null;
}
function Ye(e, t) {
  const n = (t ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "", r = (e ?? "").toLowerCase().split(";")[0].trim();
  return r === "image/heic" || r === "image/heif" || n === "heic" || n === "heif" ? "heic" : r === "video/x-matroska" || r === "application/x-matroska" || n === "mkv" ? "mkv" : r.startsWith("video/") ? "video" : r.startsWith("audio/") ? "audio" : r.startsWith("image/") ? "image" : r === "application/pdf" || n === "pdf" ? "pdf" : r === "application/json" || r === "text/json" || n === "json" ? "json" : r === "application/yaml" || r === "text/yaml" || r === "application/x-yaml" || n === "yaml" || n === "yml" ? "yaml" : r === "text/markdown" || r === "text/x-markdown" || n === "md" || n === "markdown" ? "markdown" : r === "text/csv" || r === "application/csv" || n === "csv" ? "csv" : r.startsWith("text/") || n === "txt" || n === "log" || n === "ini" || n === "conf" ? "text" : null;
}
function dn(e, t, n) {
  const r = encodeURIComponent(t);
  return e.replace("{bucket}", r).replace("{namespace}", r).replace("{path}", encodeURIComponent(n));
}
function Ja(e) {
  let t = "";
  const n = new Uint8Array(e);
  for (let r = 0; r < n.byteLength; r++) t += String.fromCharCode(n[r]);
  return btoa(t);
}
async function st(e) {
  try {
    return (await e.json()).message ?? `HTTP ${e.status}`;
  } catch {
    return `HTTP ${e.status}`;
  }
}
async function Ya(e, t) {
  if (!e.body)
    throw new Error("parseConnectStream: response has no body");
  const n = e.body.getReader(), r = [];
  for (; ; ) {
    const { value: u, done: d } = await n.read();
    if (d) break;
    u && r.push(u);
  }
  let o = 0;
  for (const u of r) o += u.length;
  const i = new Uint8Array(o);
  let l = 0;
  for (const u of r)
    i.set(u, l), l += u.length;
  const a = [];
  let c = 0;
  for (; c + 5 <= i.length; ) {
    const u = i[c], d = i[c + 1] << 24 | i[c + 2] << 16 | i[c + 3] << 8 | i[c + 4];
    if (c += 5, c + d > i.length) break;
    const m = i.subarray(c, c + d);
    if (c += d, (u & 2) !== 0) break;
    try {
      const g = JSON.parse(new TextDecoder().decode(m));
      if (g.data) {
        const p = atob(g.data), b = new Uint8Array(p.length);
        for (let h = 0; h < p.length; h++) b[h] = p.charCodeAt(h);
        a.push(b.buffer);
      }
    } catch {
    }
  }
  return new Blob(a, { type: t ?? "application/octet-stream" });
}
async function Xa(e) {
  const t = await fetch(e);
  if (!t.ok) throw new Error(`fetch failed: ${t.status}`);
  return t.text();
}
function Za(e) {
  try {
    return JSON.stringify(JSON.parse(e), null, 2);
  } catch {
    return e;
  }
}
function Qa(e) {
  const t = [];
  let n = [], r = "", o = !1;
  for (let i = 0; i < e.length; i++) {
    const l = e[i];
    if (o) {
      if (l === '"' && e[i + 1] === '"') {
        r += '"', i++;
        continue;
      }
      if (l === '"') {
        o = !1;
        continue;
      }
      r += l;
      continue;
    }
    if (l === '"') {
      o = !0;
      continue;
    }
    if (l === ",") {
      n.push(r), r = "";
      continue;
    }
    if (l === `
` || l === "\r") {
      l === "\r" && e[i + 1] === `
` && i++, n.push(r), r = "", t.push(n), n = [];
      continue;
    }
    r += l;
  }
  return (r !== "" || n.length > 0) && (n.push(r), t.push(n)), t;
}
async function ec(e) {
  const [{ marked: t }, { default: n }] = await Promise.all([
    import("./marked.esm-CgtsUw0D.js"),
    import("./purify.es-ZDSJOUnA.js")
  ]);
  try {
    const r = await t.parse(e, { async: !0 });
    return n.sanitize(r);
  } catch {
    return `<pre>${tc(e)}</pre>`;
  }
}
function tc(e) {
  return e.replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]);
}
let wt = null;
function Jn(e) {
  return import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    e
  );
}
async function nc(e) {
  const { default: t } = await Jn("heic2any"), n = await t({ blob: e, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(n) ? n[0] : n;
}
async function rc(e, t) {
  t?.("Loading ffmpeg…");
  const n = await sc();
  t?.("Fetching file…");
  const r = await fetch(e);
  if (!r.ok) throw new Error(`fetch failed: ${r.status}`);
  const o = new Uint8Array(await r.arrayBuffer());
  t?.("Remuxing…"), await n.writeFile("input.mkv", o);
  const i = await n.exec(["-i", "input.mkv", "-c", "copy", "-movflags", "+faststart", "output.mp4"]);
  if (i !== 0)
    throw new Error("ffmpeg remux failed (code " + i + ") — codec inside MKV may not be browser-compatible");
  const l = await n.readFile("output.mp4");
  if (typeof l == "string")
    throw new Error("ffmpeg readFile returned string");
  return new Blob([new Uint8Array(l)], { type: "video/mp4" });
}
async function sc() {
  if (wt) return wt;
  const { FFmpeg: e } = await Jn("@ffmpeg/ffmpeg"), t = new e();
  return await t.load(), wt = t, t;
}
function oc({ data: e, options: t, widgetId: n }) {
  const r = t ?? {}, { ctx: o, setCtx: i, backendUrl: l, toast: a, requestRefresh: c } = ae(), u = r.path_ctx ?? "path", d = r.bucket_ctx ?? "org", m = r.bucket_param ?? "org", g = r.page_ctx ?? "page", p = r.page_size_ctx ?? "page_size", b = r.view_mode_ctx ?? "view_mode", h = r.upload_action_id ?? "upload", w = r.upload_url, A = r.ingest_url, _ = o[d] ?? "default", R = o[u] ?? "", $ = parseInt(o[g] ?? "1", 10) || 1, x = parseInt(o[p] ?? "50", 10) || 50, T = o[b] === "gallery" ? "gallery" : "icons", [E, P] = v(!1), [Y, K] = v(!1), [G, te] = v(null), [I, V] = v(!1), [W, C] = v("url"), [B, ee] = v(""), [X, re] = v(""), [y, k] = v(""), [z, M] = v(!1), H = r.search_url, [Z, oe] = v(""), [Q, ne] = v(null), [me, ke] = v(!1), Ne = L(() => Da(e), [e]), Se = Q ?? Ne, be = L(
    () => Q || Ua(Ne),
    [Q, Ne]
  ), ze = L(() => Ba(R), [R]), Fe = !Q && $ > 1, Ue = !Q && Ne.length >= x, Be = r.media_url_template ?? "/media?namespace={namespace}&path={path}";
  j(() => {
    $ !== 1 && i(g, "1");
  }, [_, R]);
  const Oe = (N) => i(u, N), Ke = (N) => i(g, String(Math.max(1, N))), S = () => i(b, T === "gallery" ? "icons" : "gallery"), O = async () => {
    if (!H) return;
    const N = Z.trim();
    if (N === "") {
      ne(null);
      return;
    }
    ke(!0);
    try {
      const q = await fetch((l ?? "") + H, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [m]: _, query: N })
      });
      if (!q.ok) {
        a(`Search failed: ${await st(q)}`, "error");
        return;
      }
      const se = await q.json();
      ne((se.hits ?? []).map((ie) => ({ ...ie, kind: "file" })));
    } catch (q) {
      a(`Search failed: ${Ee(q)}`, "error");
    } finally {
      ke(!1);
    }
  }, J = () => {
    oe(""), ne(null);
  }, de = (N) => {
    J(), Oe(N);
  }, ge = () => {
    ee(R), re(""), k(""), C(A ? "url" : "file"), V(!0);
  }, he = async () => {
    if (!A) return;
    const N = B.trim(), q = X.trim(), se = y.trim();
    if (!N || !q || !se) {
      a("Need a folder (repo), a filename, and a URL", "error");
      return;
    }
    M(!0);
    try {
      const ie = await fetch((l ?? "") + A, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [m]: _, repo: N, path: q, url: se })
      });
      if (!ie.ok)
        throw new Error(await st(ie));
      a(`Fetching ${q} in the background — it'll appear when done.`, "ok"), V(!1);
    } catch (ie) {
      a(`Ingest failed: ${Ee(ie)}`, "error");
    } finally {
      M(!1);
    }
  }, Xe = async (N) => {
    const q = B.trim(), se = X.trim() || N.name;
    if (!q) {
      a("Need a destination folder (repo)", "error");
      return;
    }
    M(!0);
    try {
      await Ct(N, q, se), a(`Uploaded ${se}`, "ok"), V(!1), c(n ?? "*");
    } catch (ie) {
      a(`Upload failed: ${Ee(ie)}`, "error");
    } finally {
      M(!1);
    }
  }, ue = (N) => N.path && N.path !== "" ? N.path : Ka(R, N.name ?? ""), je = (N) => {
    if (Ie(N)) {
      Q ? de(ue(N)) : Oe(ue(N));
      return;
    }
    if (Be && Ye(N.content_type, N.name)) {
      te(N);
      return;
    }
    Ze(N);
  };
  j(() => {
    if (!G) return;
    const N = (q) => {
      q.key === "Escape" && te(null);
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [G]);
  const Ze = async (N) => {
    const q = r.download_url;
    if (!q) {
      a("Download not configured (set options.download_url)", "error");
      return;
    }
    if (!N.name) {
      a("File has no name", "error");
      return;
    }
    const se = ue(N), ie = (l ?? "") + q;
    try {
      const xe = await fetch(ie, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1"
        },
        body: JSON.stringify({ [m]: _, path: se })
      });
      if (!xe.ok) {
        const Qe = await st(xe);
        a(`Download failed: ${Qe}`, "error");
        return;
      }
      const ft = await Ya(xe, N.content_type), Re = document.createElement("a");
      Re.href = URL.createObjectURL(ft), Re.download = N.name, Re.click(), setTimeout(() => URL.revokeObjectURL(Re.href), 5e3);
    } catch (xe) {
      a(`Download failed: ${Ee(xe)}`, "error");
    }
  }, Ct = async (N, q, se) => {
    const ie = N.type || "application/octet-stream";
    if (w) {
      const Xn = new URLSearchParams({ [m]: _, repo: q, path: se, content_type: ie }), mt = await fetch(`${l ?? ""}${w}?${Xn.toString()}`, { method: "POST", body: N });
      if (!mt.ok) throw new Error(await mt.text() || `HTTP ${mt.status}`);
      return;
    }
    const xe = await N.arrayBuffer(), ft = wn(l ?? ""), Re = kn({
      actionId: h,
      params: { [m]: _, repo: q, path: se, content_type: ie, data_b64: Ja(xe) },
      clientRequestId: Nn()
    }), Qe = await fetch(ft, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
      body: JSON.stringify(Re)
    });
    if (!Qe.ok) throw new Error(await st(Qe));
  }, Yn = async (N) => {
    if (R === "") {
      a("Open a folder first, or use the Upload button to choose a folder.", "error");
      return;
    }
    const q = R;
    K(!0);
    let se = 0;
    for (const ie of Array.from(N))
      try {
        await Ct(ie, q, ie.name), se++;
      } catch (xe) {
        a(`Upload failed: ${ie.name} — ${Ee(xe)}`, "error");
      }
    K(!1), se > 0 && (a(`Uploaded ${se} file${se === 1 ? "" : "s"}`, "ok"), c(n ?? "*"));
  };
  return /* @__PURE__ */ f(
    "div",
    {
      className: "h-full flex flex-col relative",
      onDragOver: (N) => {
        N.preventDefault(), P(!0);
      },
      onDragLeave: () => P(!1),
      onDrop: (N) => {
        N.preventDefault(), P(!1), N.dataTransfer.files.length > 0 && Yn(N.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0", children: [
          /* @__PURE__ */ s("button", { onClick: () => Oe(""), className: "text-sky-400 hover:underline", children: "/" }),
          ze.map((N, q) => {
            const se = ze.slice(0, q + 1).join("/");
            return /* @__PURE__ */ f("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "/" }),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Oe(se),
                  className: "text-sky-400 hover:underline",
                  children: N
                }
              )
            ] }, q);
          }),
          /* @__PURE__ */ f("div", { className: "ml-auto flex items-center gap-3 text-zinc-500", children: [
            H && /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s(
                "input",
                {
                  type: "search",
                  value: Z,
                  onChange: (N) => oe(N.target.value),
                  onKeyDown: (N) => {
                    N.key === "Enter" && O(), N.key === "Escape" && J();
                  },
                  placeholder: "Search files…",
                  className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => {
                    O();
                  },
                  disabled: me,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
                  "aria-label": "Search",
                  title: "Search this namespace",
                  children: me ? "…" : "🔍"
                }
              ),
              Q && /* @__PURE__ */ s(
                "button",
                {
                  onClick: J,
                  className: "text-zinc-400 hover:text-zinc-100 px-1",
                  title: "Clear search, back to browsing",
                  children: "✕"
                }
              )
            ] }),
            (w || h || A) && /* @__PURE__ */ s(
              "button",
              {
                onClick: ge,
                className: "text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5",
                title: "Upload a file or fetch a media URL",
                children: "⬆ Upload"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                onClick: S,
                className: "text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5",
                title: T === "gallery" ? "Switch to icons (no thumbnails)" : "Switch to gallery (loads image thumbnails)",
                children: T === "gallery" ? "◫ Gallery" : "☰ Icons"
              }
            ),
            /* @__PURE__ */ s("span", { className: "tabular-nums", children: Q ? `${Q.length} result${Q.length === 1 ? "" : "s"}` : `${Se.length} on page` }),
            (Fe || Ue) && /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Ke($ - 1),
                  disabled: !Fe,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
                  "aria-label": "Previous page",
                  children: "‹"
                }
              ),
              /* @__PURE__ */ f("span", { className: "tabular-nums text-zinc-400", children: [
                "Page ",
                $
              ] }),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Ke($ + 1),
                  disabled: !Ue,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
                  "aria-label": "Next page",
                  children: "›"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ f("div", { className: "flex-1 overflow-auto relative min-h-0", children: [
          E && /* @__PURE__ */ s("div", { className: "absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none", children: /* @__PURE__ */ s("div", { className: "text-sky-300 text-sm", children: "Drop files to upload" }) }),
          be.length === 0 ? /* @__PURE__ */ s(D, { children: Q ? "No files match your search." : "This folder is empty. Drop files to upload." }) : T === "gallery" ? /* @__PURE__ */ s(
            ic,
            {
              entries: be,
              onClick: je,
              mediaUrlFor: (N) => N.name ? (l ?? "") + dn(Be, _, ue(N)) : ""
            }
          ) : /* @__PURE__ */ f("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ s("thead", { className: "sticky top-0 bg-zinc-900 z-[1]", children: /* @__PURE__ */ f("tr", { className: "text-zinc-400 border-b border-zinc-800", children: [
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-8" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2", children: "Name" }),
              /* @__PURE__ */ s("th", { className: "text-right px-3 py-2 w-24", children: "Size" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-40", children: "Type" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-36", children: "Modified" })
            ] }) }),
            /* @__PURE__ */ s("tbody", { children: be.map((N, q) => /* @__PURE__ */ f(
              "tr",
              {
                onClick: () => je(N),
                className: "border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer",
                children: [
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 select-none", children: Ie(N) ? "📁" : "📄" }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-100 truncate", children: N.name }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-right text-zinc-400", children: Ie(N) ? "—" : Gn(N.size_bytes ?? 0) }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-500 truncate", children: N.content_type ?? "" }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-500 truncate", children: N.modified_at ?? "" })
                ]
              },
              `${N.kind ?? ""}:${N.name ?? q}`
            )) })
          ] }),
          Y && /* @__PURE__ */ s("div", { className: "absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg", children: "Uploading…" })
        ] }),
        G && /* @__PURE__ */ s(
          lc,
          {
            entry: G,
            mediaUrl: (l ?? "") + dn(Be, _, ue(G)),
            autoAdvanceQueue: qa(be),
            navigableQueue: Va(be),
            onSelect: (N) => te(N),
            onClose: () => te(null),
            onDownload: () => {
              Ze(G);
            }
          }
        ),
        I && /* @__PURE__ */ s(
          "div",
          {
            className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60",
            onClick: () => {
              z || V(!1);
            },
            children: /* @__PURE__ */ f(
              "div",
              {
                className: "flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md",
                onClick: (N) => N.stopPropagation(),
                children: [
                  /* @__PURE__ */ f("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ f("h2", { className: "text-sm font-medium text-zinc-100", children: [
                      "Upload to ",
                      _
                    ] }),
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => {
                          z || V(!1);
                        },
                        className: "text-zinc-500 hover:text-zinc-200",
                        "aria-label": "Close",
                        children: "✕"
                      }
                    )
                  ] }),
                  A && /* @__PURE__ */ f("div", { className: "flex gap-1 text-xs", children: [
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => C("url"),
                        className: `px-3 py-1 rounded border ${W === "url" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
                        children: "From URL"
                      }
                    ),
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => C("file"),
                        className: `px-3 py-1 rounded border ${W === "file" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
                        children: "Local file"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ f("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                    "Folder (repo)",
                    /* @__PURE__ */ s(
                      "input",
                      {
                        type: "text",
                        value: B,
                        onChange: (N) => ee(N.target.value),
                        placeholder: "e.g. year=2026/name=avatar",
                        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                      }
                    ),
                    /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "The git-clone partition. Becomes a GitHub repo." })
                  ] }),
                  /* @__PURE__ */ f("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                    "Filename ",
                    W === "file" && "(optional — defaults to the file’s name)",
                    /* @__PURE__ */ s(
                      "input",
                      {
                        type: "text",
                        value: X,
                        onChange: (N) => re(N.target.value),
                        placeholder: "e.g. avatar.mp4",
                        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                      }
                    ),
                    /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "Location inside the repo (may include subfolders)." })
                  ] }),
                  W === "url" ? /* @__PURE__ */ f(lt, { children: [
                    /* @__PURE__ */ f("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                      "Media URL",
                      /* @__PURE__ */ s(
                        "input",
                        {
                          type: "url",
                          value: y,
                          onChange: (N) => k(N.target.value),
                          placeholder: "https://youtu.be/… or https://…/playlist.m3u8",
                          className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        }
                      ),
                      /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "YouTube, a supported site, or a raw HLS playlist. Fetched server-side." })
                    ] }),
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => {
                          he();
                        },
                        disabled: z,
                        className: "self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm",
                        children: z ? "Starting…" : "Fetch & store"
                      }
                    )
                  ] }) : /* @__PURE__ */ f(lt, { children: [
                    /* @__PURE__ */ s(
                      "input",
                      {
                        type: "file",
                        onChange: (N) => {
                          const q = N.target.files?.[0];
                          q && Xe(q);
                        },
                        disabled: z,
                        className: "text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
                      }
                    ),
                    z && /* @__PURE__ */ s("span", { className: "self-end text-xs text-zinc-400", children: "Uploading…" })
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
function ic({
  entries: e,
  onClick: t,
  mediaUrlFor: n
}) {
  return /* @__PURE__ */ s("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3", children: e.map((r, o) => {
    const i = Ye(r.content_type, r.name), l = i === "image" || i === "heic", a = Ie(r);
    return /* @__PURE__ */ f(
      "button",
      {
        onClick: () => t(r),
        className: "flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left",
        children: [
          /* @__PURE__ */ s("div", { className: "w-full aspect-square bg-zinc-950 rounded flex items-center justify-center overflow-hidden", children: a ? /* @__PURE__ */ s("span", { className: "text-4xl select-none", children: "📁" }) : l && r.name ? /* @__PURE__ */ s(
            "img",
            {
              src: n(r),
              alt: r.name ?? "",
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ s("span", { className: "text-4xl select-none", children: "📄" }) }),
          /* @__PURE__ */ s("span", { className: "w-full text-xs text-zinc-200 truncate", title: r.name, children: r.name })
        ]
      },
      `${r.kind ?? ""}:${r.name ?? o}`
    );
  }) });
}
function lc({
  entry: e,
  mediaUrl: t,
  autoAdvanceQueue: n,
  navigableQueue: r,
  onSelect: o,
  onClose: i,
  onDownload: l
}) {
  const a = Ye(e.content_type, e.name), c = a === "text" || a === "json" || a === "yaml" || a === "csv" || a === "markdown", [u, d] = v(
    a === "image" || a === "video" || a === "pdf" || a === "heic" || a === "mkv" || c
  ), [m, g] = v(!1), [p, b] = v(null), [h, w] = v(null), [A, _] = v("Loading…"), [R, $] = v(null), [x, T] = v(null), [E, P] = v(null), Y = r.length > 1, K = r.findIndex((y) => y.name === e.name), [G, te] = v(!1), [I, V] = v(!0), W = () => {
    const y = un(r, e.name, G, I);
    y && o(y);
  }, C = () => {
    const y = Ga(r, e.name, I);
    y && o(y);
  }, B = () => {
    const y = un(n, e.name, G, I);
    y && o(y);
  };
  j(() => {
    const y = (k) => {
      const z = k.target;
      if (!(z && (z.tagName === "INPUT" || z.tagName === "TEXTAREA" || z.isContentEditable))) {
        if (k.key === "ArrowRight")
          k.preventDefault(), W();
        else if (k.key === "ArrowLeft")
          k.preventDefault(), C();
        else if (k.key === " ") {
          const M = document.querySelector("video, audio");
          M && (k.preventDefault(), M.paused ? M.play() : M.pause());
        }
      }
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [e.name, r.length, G, I]);
  const ee = () => d(!1), X = () => {
    d(!1), g(!0), b(null);
  }, re = (y) => {
    y.target === y.currentTarget && i();
  };
  return j(() => {
    if (a !== "heic" && a !== "mkv") return;
    let y = !1, k = null;
    return (async () => {
      try {
        let z;
        if (a === "heic") {
          _("Decoding HEIC…");
          const M = await fetch(t);
          if (!M.ok) throw new Error(`fetch failed: ${M.status}`);
          z = await nc(await M.blob());
        } else
          z = await rc(t, (M) => {
            y || _(M);
          });
        if (y) return;
        k = URL.createObjectURL(z), w(k), d(!1);
      } catch (z) {
        if (y) return;
        b(Ee(z)), g(!0), d(!1);
      }
    })(), () => {
      y = !0, k && URL.revokeObjectURL(k);
    };
  }, [a, t]), j(() => {
    if (!c) return;
    let y = !1;
    return (async () => {
      try {
        const k = await Xa(t);
        if (y) return;
        a === "csv" ? T(Qa(k)) : a === "json" ? $(Za(k)) : a === "markdown" ? P(await ec(k)) : $(k), d(!1);
      } catch (k) {
        if (y) return;
        b(Ee(k)), g(!0), d(!1);
      }
    })(), () => {
      y = !0;
    };
  }, [a, c, t]), /* @__PURE__ */ f(
    "div",
    {
      className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
      onClick: re,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900", children: [
          /* @__PURE__ */ s("span", { className: "text-sm font-medium truncate flex-1", children: e.name }),
          /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 truncate max-w-[200px]", children: e.content_type }),
          typeof e.size_bytes == "number" && /* @__PURE__ */ s("span", { className: "text-xs text-zinc-600 tabular-nums", children: Gn(e.size_bytes) }),
          Y && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2", children: [
            /* @__PURE__ */ s(
              "button",
              {
                onClick: C,
                className: "hover:text-zinc-100 leading-none px-1",
                "aria-label": "Previous (←)",
                title: "Previous (←)",
                children: "⏮"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                onClick: W,
                className: "hover:text-zinc-100 leading-none px-1",
                "aria-label": "Next (→)",
                title: "Next (→)",
                children: "⏭"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                onClick: () => te((y) => !y),
                className: `px-1 leading-none ${G ? "text-sky-400" : "hover:text-zinc-100"}`,
                "aria-label": "Toggle shuffle",
                title: G ? "Shuffle on" : "Shuffle off",
                children: "🔀"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                onClick: () => V((y) => !y),
                className: `px-1 leading-none ${I ? "text-sky-400" : "hover:text-zinc-100"}`,
                "aria-label": "Toggle repeat",
                title: I ? "Repeat on" : "Repeat off",
                children: "🔁"
              }
            ),
            /* @__PURE__ */ f("span", { className: "text-xs text-zinc-500 tabular-nums", children: [
              K >= 0 ? K + 1 : "–",
              " / ",
              r.length
            ] })
          ] }),
          /* @__PURE__ */ s(
            "button",
            {
              onClick: l,
              className: "text-xs text-sky-400 hover:underline",
              children: "Download"
            }
          ),
          /* @__PURE__ */ s(
            "button",
            {
              onClick: i,
              className: "text-zinc-400 hover:text-zinc-100 text-lg leading-none",
              "aria-label": "Close preview",
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "div",
          {
            className: "flex-1 flex items-center justify-center overflow-auto p-4 relative",
            onClick: re,
            children: [
              u && !m && /* @__PURE__ */ s("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s("div", { className: "text-zinc-500 text-xs uppercase tracking-wider", children: A }) }),
              m && /* @__PURE__ */ f("div", { className: "flex flex-col items-center gap-3 text-zinc-300 text-sm max-w-md text-center", children: [
                /* @__PURE__ */ s("span", { className: "text-zinc-500", children: "⚠ Preview couldn't load." }),
                p && /* @__PURE__ */ s("span", { className: "text-zinc-600 text-xs font-mono break-words", children: p }),
                /* @__PURE__ */ s("button", { onClick: l, className: "text-sky-400 hover:underline text-xs", children: "Download instead" })
              ] }),
              !m && a === "video" && /* @__PURE__ */ s(
                "video",
                {
                  src: t,
                  controls: !0,
                  autoPlay: !0,
                  playsInline: !0,
                  preload: "metadata",
                  onLoadedMetadata: ee,
                  onEnded: B,
                  onError: X,
                  className: "max-h-full max-w-full bg-black rounded shadow-2xl"
                }
              ),
              !m && a === "audio" && /* @__PURE__ */ f("div", { className: "flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl w-full max-w-md", children: [
                /* @__PURE__ */ s("div", { className: "text-3xl select-none", "aria-hidden": "true", children: "♪" }),
                /* @__PURE__ */ s("div", { className: "text-sm text-zinc-200 truncate max-w-full", title: e.name, children: e.name }),
                /* @__PURE__ */ s(
                  "audio",
                  {
                    src: t,
                    controls: !0,
                    autoPlay: !0,
                    preload: "metadata",
                    onEnded: B,
                    onError: X,
                    className: "w-full"
                  }
                )
              ] }),
              !m && a === "image" && /* @__PURE__ */ s(
                "img",
                {
                  src: t,
                  alt: e.name ?? "",
                  decoding: "async",
                  onLoad: ee,
                  onError: X,
                  className: "max-h-full max-w-full object-contain rounded shadow-2xl"
                }
              ),
              !m && a === "pdf" && // iframe is more reliably rendered than <embed> across browsers
              // (some refuse <embed> for security reasons; iframe with a
              // direct PDF src gets the native viewer with toolbar/scrub).
              /* @__PURE__ */ s(
                "iframe",
                {
                  src: t,
                  title: e.name ?? "PDF preview",
                  onLoad: ee,
                  className: "w-full h-full bg-white rounded shadow-2xl border-0"
                }
              ),
              !m && a === "heic" && h && /* @__PURE__ */ s(
                "img",
                {
                  src: h,
                  alt: e.name ?? "",
                  decoding: "async",
                  onError: X,
                  className: "max-h-full max-w-full object-contain rounded shadow-2xl"
                }
              ),
              !m && a === "mkv" && h && /* @__PURE__ */ s(
                "video",
                {
                  src: h,
                  controls: !0,
                  autoPlay: !0,
                  playsInline: !0,
                  preload: "metadata",
                  onLoadedMetadata: ee,
                  onEnded: B,
                  onError: X,
                  className: "max-h-full max-w-full bg-black rounded shadow-2xl"
                }
              ),
              !m && (a === "text" || a === "json" || a === "yaml") && R !== null && /* @__PURE__ */ s("pre", { className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words", children: R }),
              !m && a === "markdown" && E !== null && /* @__PURE__ */ s(
                "div",
                {
                  className: "w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none",
                  dangerouslySetInnerHTML: { __html: E }
                }
              ),
              !m && a === "csv" && x !== null && /* @__PURE__ */ s("div", { className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl", children: /* @__PURE__ */ f("table", { className: "border-collapse", children: [
                x.length > 0 && /* @__PURE__ */ s("thead", { children: /* @__PURE__ */ s("tr", { children: x[0].map((y, k) => /* @__PURE__ */ s("th", { className: "border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800", children: y }, k)) }) }),
                /* @__PURE__ */ s("tbody", { children: x.slice(1).map((y, k) => /* @__PURE__ */ s("tr", { children: y.map((z, M) => /* @__PURE__ */ s("td", { className: "border border-zinc-800 px-2 py-1 align-top", children: z }, M)) }, k)) })
              ] }) }),
              a === null && !m && /* @__PURE__ */ f("div", { className: "flex flex-col items-center gap-3 text-zinc-300 text-sm", children: [
                /* @__PURE__ */ f("span", { className: "text-zinc-500", children: [
                  "No inline preview for ",
                  e.content_type ?? "this file type",
                  "."
                ] }),
                /* @__PURE__ */ s("button", { onClick: l, className: "text-sky-400 hover:underline text-xs", children: "Download instead" })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileBrowser: oc
}, Symbol.toStringTag, { value: "Module" }));
function wc({ view: e, filenameBase: t, onExport: n, variant: r = "button" }) {
  const [o, i] = v(!1), [l, a] = v(null), c = F(null);
  j(() => {
    if (!o) return;
    const p = (b) => {
      c.current && !c.current.contains(b.target) && i(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [o]);
  const u = Rn(e), d = u === 0, m = async (p) => {
    a(p);
    let b = !1;
    try {
      b = await Pn(e, p, t);
    } catch {
      b = !1;
    } finally {
      a(null), i(!1), n?.(p, b);
    }
  }, g = r === "row" ? /* @__PURE__ */ s(
    "button",
    {
      onClick: () => i((p) => !p),
      disabled: d,
      className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-40",
      children: "Export…"
    }
  ) : /* @__PURE__ */ s(
    "button",
    {
      onClick: () => i((p) => !p),
      disabled: d,
      title: d ? "No data to export" : `Export ${u.toLocaleString()} rows`,
      className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0 disabled:opacity-40",
      "aria-label": "Export data",
      children: "↓ Export"
    }
  );
  return /* @__PURE__ */ f("div", { className: "relative", ref: c, children: [
    g,
    o && !d && /* @__PURE__ */ f("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-30 min-w-[140px]", children: [
      /* @__PURE__ */ f("div", { className: "px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600", children: [
        u.toLocaleString(),
        " rows"
      ] }),
      On.map((p) => /* @__PURE__ */ f(
        "button",
        {
          onClick: () => m(p.key),
          disabled: l != null,
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-between",
          children: [
            /* @__PURE__ */ s("span", { children: p.label }),
            l === p.key && /* @__PURE__ */ s("span", { className: "text-zinc-500", children: "…" })
          ]
        },
        p.key
      ))
    ] })
  ] });
}
function cc(e) {
  if (!e.widget) return null;
  const t = e.widget, n = {
    id: "embed",
    component: t.component,
    span: 12,
    title: e.title,
    source: t.sourceId ? { source_id: t.sourceId, stream: t.stream, refreshIntervalMs: t.refreshIntervalMs } : t.url ? { url: t.url, stream: t.stream, refreshIntervalMs: t.refreshIntervalMs } : void 0
  };
  return {
    title: e.title,
    columns: 12,
    context: Object.keys(e.ctx).length > 0 ? { values: e.ctx } : void 0,
    widgets: [n]
  };
}
function kc({ config: e, onEvent: t }) {
  const [n, r] = v({});
  j(() => {
    if (!e.templateUrl) return;
    let l = !1;
    return r({}), fetch(e.templateUrl).then((a) => {
      if (!a.ok) throw new Error(`Template fetch failed: ${a.status}`);
      return a.json();
    }).then((a) => {
      if (l) return;
      const c = Object.keys(e.ctx).length > 0 ? {
        ...a,
        context: {
          values: { ...a.context?.values ?? {}, ...e.ctx }
        }
      } : a;
      r({ template: c });
    }).catch((a) => {
      l || r({ error: a instanceof Error ? a.message : "Template load error" });
    }), () => {
      l = !0;
    };
  }, [e.templateUrl, e.ctx]);
  const o = L(() => cc(e), [e]), i = e.templateUrl ? n.template : o;
  return e.templateUrl && n.error ? /* @__PURE__ */ s(kt, { title: "Embed error", body: n.error }) : e.templateUrl && !i ? /* @__PURE__ */ s(kt, { title: "Loading…", body: "Fetching dashboard template" }) : i ? /* @__PURE__ */ s("div", { className: "min-h-screen bg-zinc-950", children: /* @__PURE__ */ s(
    Fn,
    {
      template: i,
      backendUrl: e.backendUrl,
      chrome: e.chrome === "full" ? "full" : "minimal",
      onEvent: t
    }
  ) }) : /* @__PURE__ */ s(
    kt,
    {
      title: "Nothing to embed",
      body: "Pass a ?template= URL, or a ?src= source id (with &backend=), or a ?url= data URL."
    }
  );
}
function kt({ title: e, body: t }) {
  return /* @__PURE__ */ s("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-6", children: /* @__PURE__ */ f("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ s("div", { className: "text-sm font-medium text-zinc-200 mb-1", children: e }),
    /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: t })
  ] }) });
}
function uc(e) {
  return e === "1" || e === "true" || e === "yes";
}
function Nc(e) {
  const t = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), n = {};
  for (const [u, d] of t.entries())
    if (u.startsWith("ctx.")) {
      const m = u.slice(4);
      m && (n[m] = d);
    }
  const r = t.get("chrome") === "full" ? "full" : "none", o = t.get("title") ?? void 0, i = t.get("backend") ?? void 0, l = t.get("template") ?? void 0;
  if (l)
    return { templateUrl: l, title: o, backendUrl: i, ctx: n, chrome: r };
  const a = t.get("src") ?? void 0, c = t.get("url") ?? void 0;
  if (a || c) {
    const u = t.get("refreshMs"), d = u != null ? Number(u) : NaN;
    return {
      widget: {
        component: t.get("component") ?? "table",
        sourceId: a,
        url: c,
        stream: uc(t.get("stream")),
        refreshIntervalMs: Number.isFinite(d) && d > 0 ? d : void 0
      },
      title: o,
      backendUrl: i,
      ctx: n,
      chrome: r
    };
  }
  return { title: o, backendUrl: i, ctx: n, chrome: r };
}
function Sc(e, t) {
  const n = new URLSearchParams();
  t.templateUrl && n.set("template", t.templateUrl), t.widget && (t.widget.component && n.set("component", t.widget.component), t.widget.sourceId && n.set("src", t.widget.sourceId), t.widget.url && n.set("url", t.widget.url), t.widget.stream && n.set("stream", "1"), t.widget.refreshIntervalMs && n.set("refreshMs", String(t.widget.refreshIntervalMs))), t.title && n.set("title", t.title), t.backendUrl && n.set("backend", t.backendUrl), t.chrome === "full" && n.set("chrome", "full");
  for (const [o, i] of Object.entries(t.ctx ?? {})) n.set(`ctx.${o}`, i);
  const r = n.toString();
  return r ? `${e}?${r}` : e;
}
const fn = "medallion.terminal.v1.TerminalService";
function dc(e) {
  switch (e) {
    case 2:
    case "PARAM_TYPE_NUMBER":
      return "number";
    case 3:
    case "PARAM_TYPE_BOOLEAN":
      return "boolean";
    case 4:
    case "PARAM_TYPE_TIMESTAMP":
      return "timestamp";
    case 7:
    case "PARAM_TYPE_INTEGER":
      return "integer";
    case 8:
    case "PARAM_TYPE_DATE":
      return "timestamp";
    default:
      return "string";
  }
}
function fc(e) {
  const t = (r, o = !1) => ({ name: r, type: "string", isTime: o }), n = (r) => ({ name: r, type: "number" });
  switch (e) {
    case 1:
    case "SHAPE_TIMESERIES":
      return [t("timestamp", !0), n("value")];
    case 2:
    case "SHAPE_CANDLES":
      return [t("timestamp", !0), n("open"), n("high"), n("low"), n("close"), n("volume")];
    case 4:
    case "SHAPE_METRIC":
      return [n("value"), n("delta"), t("unit"), t("label")];
    case 5:
    case "SHAPE_GAUGE":
      return [n("value"), n("min"), n("max")];
    case 6:
    case "SHAPE_HEATMAP":
      return [t("row"), t("col"), n("value"), t("label")];
    case 7:
    case "SHAPE_EVENTS":
      return [t("timestamp", !0), t("label"), t("status")];
    case 8:
    case "SHAPE_DISTRIBUTION":
      return [t("label"), n("value")];
    case 9:
    case "SHAPE_TEXT":
      return [t("title"), t("body"), t("source"), t("date", !0)];
    case 10:
    case "SHAPE_ORDERBOOK":
      return [t("side"), n("price"), n("size")];
    // SHAPE_TABLE / SHAPE_PAIRED_GRID / unspecified: columns are
    // data-defined; leave empty so the connector infers from a sample.
    default:
      return [];
  }
}
function zc(e, t) {
  const n = t.protocol ?? "connect", r = t.endpoint.replace(/\/$/, ""), o = e.map((l) => ({
    id: l.id,
    name: l.name ?? l.id,
    description: l.description,
    shape: l.shape,
    streamable: l.streamable,
    columns: fc(l.shape),
    params: (l.params ?? []).map((a) => ({
      key: a.key,
      required: a.required ?? !1,
      type: dc(a.type),
      defaultValue: a.default_value,
      enumValues: a.enum_values,
      description: a.description
    })),
    tags: l.tags
  })), i = {
    version: 1,
    name: t.name,
    protocol: n,
    endpoint: r,
    auth: t.auth ?? { kind: "none" },
    tables: o
  };
  return n === "connect" && (i.service = fn, i.getUrl = `${r}/${fn}/Get`), i;
}
function Ac(e) {
  return JSON.stringify(e, null, 2);
}
function _c(e) {
  const t = [
    { label: "Protocol", value: e.protocol === "connect" ? "ConnectRPC (HTTP/JSON)" : "SQL gateway" },
    { label: "Endpoint", value: e.endpoint }
  ];
  return e.protocol === "connect" && e.getUrl && (t.push({ label: "Get RPC URL", value: e.getUrl }), t.push({ label: "Method", value: "POST" }), t.push({ label: "Content-Type", value: "application/json" }), t.push({
    label: "Request body",
    value: '{ "source_id": "<table id>", "params": { ... } }'
  })), e.auth && e.auth.kind !== "none" && t.push({
    label: "Auth",
    value: e.auth.kind === "bearer" ? "Authorization: Bearer <token>" : `${e.auth.headerName ?? "X-Api-Key"}: <token>`
  }), t.push({ label: "Tables", value: String(e.tables.length) }), t;
}
export {
  Sa as ActionLog,
  _a as AlertLog,
  Dl as AreaChart,
  Bt as BUILTIN_COMPONENTS,
  gc as BUILTIN_KEYS,
  nl as BarChart,
  Xl as Boxplot,
  Co as Candlestick,
  Ni as Catalog,
  fl as Clock,
  Rs as CommandPalette,
  ia as Dag,
  Fn as Dashboard,
  vn as DashboardContext,
  Po as DataTable,
  ii as Distribution,
  ds as EXTENSION,
  kc as EmbedView,
  D as Empty,
  Br as ErrorBoundary,
  Rt as ErrorState,
  xi as Events,
  wc as ExportMenu,
  oc as FileBrowser,
  ni as Gauge,
  fi as Heatmap,
  Ml as Histogram,
  In as HoverContext,
  Ns as HoverProvider,
  Tl as Iframe,
  Sl as Image,
  ma as Json,
  Ft as MIME,
  Ho as Metric,
  yc as MultiDashboard,
  da as MultiSelect,
  Sn as NowContext,
  Yr as NowProvider,
  zi as OrderBook,
  pe as PALETTE,
  Ci as PairedGrid,
  Fr as Placeholder,
  ei as Prompt,
  na as Radar,
  Ae as SEMANTIC,
  ll as Scatter,
  Pl as Section,
  Vl as Select,
  Is as ShortcutsOverlay,
  jt as Skeleton,
  Hl as Slider,
  ba as Sparkline,
  Yi as StatStrip,
  ja as Tape,
  Xo as Text,
  Bi as Ticker,
  wo as Timeseries,
  Ii as Trade,
  yl as Treemap,
  Wi as VolumeProfile,
  Ln as WidgetShell,
  Bn as abbreviateAxis,
  Ss as applyActions,
  kn as buildActionRequest,
  Vr as buildActionWatchRequest,
  zc as buildBiDescriptor,
  Sc as buildEmbedUrl,
  Wr as buildGenerateRequest,
  Hr as buildGenerateUrl,
  Ws as buildSnapshot,
  wn as buildSubmitActionUrl,
  qr as buildWatchActionUrl,
  Qr as canParsePredicate,
  _c as connectionFields,
  Ut as csvEscape,
  $s as deleteView,
  Ac as descriptorToJson,
  Pn as downloadView,
  Zr as evaluateAlert,
  ys as exportFilename,
  xs as exportView,
  us as flatten,
  xo as formatBps,
  De as formatCompact,
  go as formatCurrency,
  bo as formatPercent,
  Kn as formatStat,
  Me as formatTimestamp,
  yn as getNested,
  Ur as getWidget,
  Le as interpolate,
  Hs as isStaticTemplate,
  it as isTerminalStatus,
  Cs as listViews,
  Ts as loadView,
  Nn as newClientRequestId,
  Nc as parseEmbedConfig,
  zs as readCtxFromUrl,
  xc as registerWidget,
  yo as resolveColor,
  Jr as resolveSource,
  _s as saveView,
  gs as serializeText,
  fs as toCsv,
  ms as toJson,
  ps as toNdjson,
  bs as toParquet,
  Wn as useAnimatedNumber,
  zr as useBreakpoint,
  ae as useDashboard,
  $r as useDataSource,
  Dn as useHover,
  dt as useNow,
  vc as useTabFromUrl,
  Li as useWatchAction,
  Ks as validateTemplate,
  Rn as viewRowCount,
  Kt as widgetSnapshotKey,
  As as writeCtxToUrl
};
