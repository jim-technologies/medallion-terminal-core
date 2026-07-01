import { jsxs as f, jsx as s, Fragment as lt } from "react/jsx-runtime";
import { useState as v, useEffect as j, useCallback as ce, useRef as F, useMemo as L, lazy as rr, Component as sr, useContext as Ct, createContext as $t, Suspense as ir } from "react";
import { ResponsiveContainer as Se, LineChart as or, CartesianGrid as Ue, XAxis as Be, YAxis as Ke, Tooltip as ze, Line as lr, Brush as gn, ReferenceLine as ar, ReferenceArea as cr, ReferenceDot as ur, PieChart as dr, Pie as fr, Cell as xn, BarChart as Nt, Legend as yn, Bar as St, ScatterChart as mr, ZAxis as pr, Scatter as hr, Treemap as br, AreaChart as gr, Area as xr, RadarChart as yr, PolarGrid as vr, PolarAngleAxis as wr, PolarRadiusAxis as kr, Radar as Nr } from "recharts";
import { createChart as Sr, ColorType as zr, CandlestickSeries as Ar, HistogramSeries as _r, createSeriesMarkers as Tr } from "lightweight-charts";
function jt() {
  if (typeof window > "u") return "desktop";
  const e = window.innerWidth;
  return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function Cr() {
  const [e, t] = v(jt);
  return j(() => {
    const n = () => t(jt());
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), e;
}
const vn = "application/connect+json", Rt = new TextDecoder();
async function wn(e, t) {
  let n = new Uint8Array(0), r = 0;
  for (; !t.isDisposed(); ) {
    const { done: i, value: o } = await e.read();
    if (i) break;
    if (o && o.length > 0) {
      const l = n.length - r, a = new Uint8Array(l + o.length);
      l > 0 && a.set(n.subarray(r), 0), a.set(o, l), n = a, r = 0;
    }
    for (; n.length - r >= 5; ) {
      const l = n[r], a = new DataView(n.buffer, n.byteOffset + r + 1, 4).getUint32(0);
      if (n.length - r < 5 + a) break;
      if (l & 2) {
        const c = n.subarray(r + 5, r + 5 + a);
        r += 5 + a;
        let d = {};
        try {
          c.length > 0 && (d = JSON.parse(Rt.decode(c)));
        } catch {
        }
        t.isDisposed() || t.onTrailer?.(d);
        return;
      }
      const u = n.subarray(r + 5, r + 5 + a);
      r += 5 + a;
      try {
        const c = JSON.parse(Rt.decode(u));
        t.isDisposed() || t.onMessage(c);
      } catch {
      }
    }
  }
}
function kn(e, t) {
  return t ? t.split(".").reduce((n, r) => {
    if (n != null) {
      if (Array.isArray(n)) {
        const i = Number(r);
        return Number.isInteger(i) ? n[i] : void 0;
      }
      if (typeof n == "object")
        return n[r];
    }
  }, e) : e;
}
function $r(e) {
  return e.inline ?? e.data;
}
function Pt(e) {
  return e.refreshIntervalMs ?? e.refreshInterval;
}
const Lt = 3e4, pt = 1e3;
function Er(e, t) {
  return t ? kn(e, t) : e;
}
const Mr = /* @__PURE__ */ new Set([
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
function Or(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return e;
  const t = Object.keys(e);
  return t.length === 1 && Mr.has(t[0]) ? e[t[0]] : e;
}
function jr(e) {
  const [t, n] = v(null), [r, i] = v(!0), [o, l] = v(null), [a, u] = v(null), [c, d] = v(!1), [m, b] = v(null), [p, g] = v(0), h = ce(() => g((P) => P + 1), []), w = F(pt), A = F(void 0), _ = F(null), R = F(void 0), $ = F(0), x = ce((P) => {
    const Y = Er(Or(P), e?.transform);
    n(Y), l(null), i(!1), u(Date.now()), $.current = Date.now();
  }, [e?.transform]), T = ce((P) => {
    const Y = e?.throttleMs ?? 0;
    if (Y <= 0) {
      x(P);
      return;
    }
    const H = Date.now() - $.current;
    if (H >= Y) {
      x(P);
      return;
    }
    _.current = P, R.current || (R.current = setTimeout(() => {
      _.current !== null && x(_.current), _.current = null, R.current = void 0;
    }, Y - H));
  }, [x, e?.throttleMs]), E = L(() => e ? JSON.stringify([
    e.url,
    e.source_id,
    e.method,
    e.body,
    e.headers,
    e.stream,
    Pt(e),
    e.transform,
    e.throttleMs,
    // Inline gets a separate key (truncated to keep the dep stable for
    // payload-identity changes only when the value itself mutates).
    e.inline !== void 0 || e.data !== void 0
  ]) : "", [e]);
  return j(() => {
    if (!e) {
      i(!1);
      return;
    }
    const P = $r(e);
    if (P !== void 0) {
      T(P);
      return;
    }
    if (!e.url) {
      i(!1);
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
              headers: { ...e.headers, "Content-Type": vn },
              body: JSON.stringify(e.body ?? {}),
              signal: V.signal
            });
            if (!C.ok) throw new Error(`ConnectRPC: HTTP ${C.status}`);
            if (!C.body) throw new Error("ConnectRPC: no response body");
            d(!0), b(null), l(null), w.current = pt;
            const B = C.body.getReader();
            await wn(B, {
              onMessage: T,
              onTrailer: (ee) => {
                if (ee.error) {
                  const X = ee.error.code ?? "unknown", se = ee.error.message ?? "stream error";
                  I || l(`${X}: ${se}`);
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
              b(Date.now() + C), A.current = setTimeout(() => {
                w.current = Math.min(w.current * 2, Lt), W();
              }, C);
            }
          }
      };
      return W(), () => {
        I = !0, V.abort(), clearTimeout(A.current), d(!1), b(null);
      };
    }
    if (e.stream === !0) {
      let I = null, V = !1;
      const W = () => {
        V || (I = new EventSource(e.url), I.onopen = () => {
          d(!0), b(null), l(null), w.current = pt;
        }, I.onmessage = (C) => {
          try {
            T(JSON.parse(C.data));
          } catch {
            l("Failed to parse stream");
          }
        }, I.onerror = () => {
          if (I?.close(), d(!1), !V) {
            const C = w.current;
            b(Date.now() + C), A.current = setTimeout(() => {
              w.current = Math.min(w.current * 2, Lt), W();
            }, C);
          }
        });
      };
      return W(), () => {
        V = !0, clearTimeout(A.current), I?.close(), d(!1), b(null);
      };
    }
    const Y = new AbortController(), H = async () => {
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
        i(!1);
      }
    };
    H();
    let G;
    const te = Pt(e);
    return te && te > 0 && (G = setInterval(H, te)), () => {
      Y.abort(), G && clearInterval(G);
    };
  }, [E, T, p]), j(() => () => {
    R.current && clearTimeout(R.current);
  }, []), { data: t, loading: r, error: o, lastUpdated: a, connected: c, nextRetryAt: m, refresh: h };
}
const Rr = {
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
function It({ component: e }) {
  switch (e ? Rr[e] : "block") {
    case "chart":
      return /* @__PURE__ */ s(Lr, {});
    case "table":
      return /* @__PURE__ */ s(Ir, {});
    case "list":
      return /* @__PURE__ */ s(Dr, {});
    case "single":
      return /* @__PURE__ */ s(Fr, {});
    case "donut":
      return /* @__PURE__ */ s(Ur, {});
    case "grid":
      return /* @__PURE__ */ s(Br, {});
    default:
      return /* @__PURE__ */ s(Kr, {});
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
function Dt({ message: e, onRetry: t }) {
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
const Pr = [40, 60, 35, 75, 55, 85, 50, 70, 90, 45, 65, 80, 55, 95, 60, 50, 75, 65, 80, 70];
function Lr() {
  return /* @__PURE__ */ s("div", { className: "h-full flex items-end gap-1", children: Pr.map((e, t) => /* @__PURE__ */ s(
    "div",
    {
      className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
      style: { height: `${e}%`, animationDelay: `${t * 40}ms` }
    },
    t
  )) });
}
function Ir() {
  const t = [80, 64, 96];
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col gap-2.5", children: [
    /* @__PURE__ */ s("div", { className: "flex gap-4 pb-2 border-b border-zinc-800", children: t.map((n, r) => /* @__PURE__ */ s("div", { className: "h-3 bg-zinc-800 rounded animate-pulse", style: { width: n } }, r)) }),
    Array.from({ length: 5 }).map((n, r) => /* @__PURE__ */ s("div", { className: "flex gap-4", children: t.map((i, o) => /* @__PURE__ */ s(
      "div",
      {
        className: "h-3 bg-zinc-800 rounded animate-pulse",
        style: { width: i, animationDelay: `${(r * 3 + o) * 50}ms` }
      },
      o
    )) }, r))
  ] });
}
function Dr() {
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
function Fr() {
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col items-center justify-center gap-2", children: [
    /* @__PURE__ */ s("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }),
    /* @__PURE__ */ s("div", { className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse", style: { animationDelay: "120ms" } })
  ] });
}
function Ur() {
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
function Br() {
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
function Kr() {
  return /* @__PURE__ */ s("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
function Hr(e) {
  return /* @__PURE__ */ s(D, { children: "Unknown widget type" });
}
const U = (e, t) => rr(() => e().then((n) => ({ default: n[t] }))), Et = /* @__PURE__ */ new Map([
  ["timeseries", U(() => Promise.resolve().then(() => Li), "Timeseries")],
  ["candlestick", U(() => Promise.resolve().then(() => Ki), "Candlestick")],
  ["table", U(() => Promise.resolve().then(() => Qi), "DataTable")],
  ["metric", U(() => Promise.resolve().then(() => oo), "Metric")],
  ["text", U(() => Promise.resolve().then(() => uo), "Text")],
  ["prompt", U(() => Promise.resolve().then(() => mo), "Prompt")],
  ["gauge", U(() => Promise.resolve().then(() => go), "Gauge")],
  ["distribution", U(() => Promise.resolve().then(() => wo), "Distribution")],
  ["heatmap", U(() => Promise.resolve().then(() => To), "Heatmap")],
  ["events", U(() => Promise.resolve().then(() => Mo), "Events")],
  ["catalog", U(() => Promise.resolve().then(() => Po), "Catalog")],
  ["orderbook", U(() => Promise.resolve().then(() => Do), "OrderBook")],
  ["paired_grid", U(() => Promise.resolve().then(() => Wo), "PairedGrid")],
  ["trade", U(() => Promise.resolve().then(() => Xo), "Trade")],
  ["ticker", U(() => Promise.resolve().then(() => nl), "Ticker")],
  ["volume_profile", U(() => Promise.resolve().then(() => ll), "VolumeProfile")],
  ["stat_strip", U(() => Promise.resolve().then(() => ml), "StatStrip")],
  ["bar_chart", U(() => Promise.resolve().then(() => gl), "BarChart")],
  ["scatter", U(() => Promise.resolve().then(() => wl), "Scatter")],
  ["clock", U(() => Promise.resolve().then(() => Cl), "Clock")],
  ["treemap", U(() => Promise.resolve().then(() => jl), "Treemap")],
  ["image", U(() => Promise.resolve().then(() => Ll), "Image")],
  ["iframe", U(() => Promise.resolve().then(() => Ul), "Iframe")],
  ["histogram", U(() => Promise.resolve().then(() => ql), "Histogram")],
  ["section", U(() => Promise.resolve().then(() => Gl), "Section")],
  ["area_chart", U(() => Promise.resolve().then(() => Ql), "AreaChart")],
  ["slider", U(() => Promise.resolve().then(() => na), "Slider")],
  ["select", U(() => Promise.resolve().then(() => la), "Select")],
  ["boxplot", U(() => Promise.resolve().then(() => fa), "Boxplot")],
  ["radar", U(() => Promise.resolve().then(() => ha), "Radar")],
  ["dag", U(() => Promise.resolve().then(() => wa), "Dag")],
  ["multi_select", U(() => Promise.resolve().then(() => Na), "MultiSelect")],
  ["json", U(() => Promise.resolve().then(() => Aa), "Json")],
  ["sparkline", U(() => Promise.resolve().then(() => Ca), "Sparkline")],
  ["action_log", U(() => Promise.resolve().then(() => Pa), "ActionLog")],
  ["alert_log", U(() => Promise.resolve().then(() => Da), "AlertLog")],
  ["tape", U(() => Promise.resolve().then(() => Ja), "Tape")],
  ["file_browser", U(() => Promise.resolve().then(() => yc), "FileBrowser")]
]), Tc = new Set(Et.keys());
function Wr(e) {
  return Et.get(e) || Hr;
}
function Cc(e, t) {
  Et.set(e, t);
}
class qr extends sr {
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
const Vr = {
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
}, Nn = $t(Vr);
function ae() {
  return Ct(Nn);
}
const ut = "medallion.terminal.v1.TerminalService";
function Gr(e) {
  return `${e.replace(/\/$/, "")}/${ut}/Generate`;
}
function Jr(e, t, n) {
  return {
    prompt: e,
    context: { values: t },
    current_widgets: n
  };
}
function Sn(e) {
  return `${e.replace(/\/$/, "")}/${ut}/SubmitAction`;
}
function Yr(e) {
  return `${e.replace(/\/$/, "")}/${ut}/WatchAction`;
}
function zn(e) {
  return { action_id: e.actionId, params: e.params, client_request_id: e.clientRequestId };
}
function Xr(e) {
  return {
    action_id: e.actionId ?? "",
    id: e.id ?? "",
    client_request_id: e.clientRequestId ?? ""
  };
}
function An() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
let Ft = !1;
class Zr extends Error {
  constructor(t) {
    super(`Missing context key: \${ctx.${t}}`), this.key = t, this.name = "InterpolationError";
  }
}
function De(e, t, n) {
  return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (r, i) => {
    if (i in t) return t[i];
    if (n?.strict) throw new Zr(i);
    return "";
  });
}
function Qr(e, t, n) {
  if (e.source_id) {
    if (n === void 0)
      return Ft || (console.warn(
        `[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`
      ), Ft = !0), e;
    const i = e.stream ? "Stream" : "Get", o = n.replace(/\/$/, ""), l = {};
    if (e.params)
      for (const [a, u] of Object.entries(e.params))
        l[a] = De(u, t, { strict: !0 });
    return {
      url: `${o}/${ut}/${i}`,
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
    let i = De(e.url, t, { strict: !0 });
    if (e.params && Object.keys(e.params).length > 0) {
      const o = Object.entries(e.params).map(([l, a]) => `${encodeURIComponent(l)}=${encodeURIComponent(De(a, t, { strict: !0 }))}`).join("&");
      i = i.includes("?") ? `${i}&${o}` : `${i}?${o}`;
    }
    r.url = i;
  }
  return r;
}
const _n = $t({
  now: 0,
  subscribe: () => () => {
  }
});
function dt(e = !0) {
  const { now: t, subscribe: n } = Ct(_n);
  return j(() => {
    if (e)
      return n();
  }, [e, n]), t;
}
function es({ children: e }) {
  const [t, n] = v(() => Date.now()), r = F(0), i = F(null), o = L(() => ({
    now: t,
    subscribe: () => (r.current += 1, i.current == null && (i.current = setInterval(() => n(Date.now()), 1e3)), () => {
      r.current = Math.max(0, r.current - 1), r.current === 0 && i.current != null && (clearInterval(i.current), i.current = null);
    })
  }), [t]);
  return j(() => () => {
    i.current != null && clearInterval(i.current);
  }, []), /* @__PURE__ */ s(_n.Provider, { value: o, children: e });
}
const ts = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function ns(e, t) {
  const n = Tn(t);
  return n ? os(n, e) : !1;
}
function rs(e) {
  return Tn(e) !== null;
}
function Tn(e) {
  const t = e.trim();
  if (!t) return null;
  const n = Ut(t, "||"), r = [];
  for (const i of n) {
    const o = Ut(i, "&&"), l = [];
    for (const a of o) {
      const u = ss(a);
      if (!u) return null;
      l.push(u);
    }
    if (l.length === 0) return null;
    r.push(l);
  }
  return r.length === 0 ? null : r;
}
function Ut(e, t) {
  const n = [];
  let r = 0, i = !1;
  for (let o = 0; o < e.length; o++)
    if (e[o] === '"' && (i = !i), !i && !i && e.startsWith(t, o)) {
      n.push(e.slice(r, o)), r = o + t.length, o += t.length - 1;
      continue;
    }
  return n.push(e.slice(r)), n.map((o) => o.trim());
}
function ss(e) {
  const t = e.trim().match(ts);
  if (!t) return null;
  const [, n, r, i] = t;
  return { path: n.trim(), op: r, rhs: is(i.trim()) };
}
function is(e) {
  if (e === "true") return !0;
  if (e === "false") return !1;
  if (e === "null") return null;
  if (e.length >= 2 && e.startsWith('"') && e.endsWith('"'))
    return e.slice(1, -1);
  const t = Number(e);
  return Number.isNaN(t) ? e : t;
}
function os(e, t) {
  for (const n of e) {
    let r = !0;
    for (const i of n)
      if (!ls(kn(t, i.path), i.op, i.rhs)) {
        r = !1;
        break;
      }
    if (r) return !0;
  }
  return !1;
}
function ls(e, t, n) {
  if (t === ">" || t === ">=" || t === "<" || t === "<=") {
    const r = Number(e), i = Number(n);
    if (!Number.isFinite(r) || !Number.isFinite(i)) return !1;
    switch (t) {
      case ">":
        return r > i;
      case ">=":
        return r >= i;
      case "<":
        return r < i;
      case "<=":
        return r <= i;
    }
  }
  return t === "==" ? e === n || typeof e == "number" && typeof n == "number" && e === n : t === "!=" ? !(e === n || typeof e == "number" && typeof n == "number" && e === n) : !1;
}
const as = {
  warn: 720,
  // mid
  error: 480
  // low — more alarming
}, Bt = 160, cs = 0.08;
let et = null;
function us() {
  if (typeof window > "u") return null;
  if (et) return et;
  const e = window, t = window.AudioContext || e.webkitAudioContext;
  return t ? (et = new t(), et) : null;
}
function ds(e) {
  const t = as[e];
  if (!t) return;
  const n = us();
  if (!n) return;
  n.state === "suspended" && n.resume().catch(() => {
  });
  const r = n.createOscillator(), i = n.createGain();
  r.type = "sine", r.frequency.value = t, i.gain.value = 0, r.connect(i), i.connect(n.destination);
  const o = n.currentTime;
  i.gain.linearRampToValueAtTime(cs, o + 0.02), i.gain.linearRampToValueAtTime(0, o + Bt / 1e3), r.start(o), r.stop(o + Bt / 1e3 + 0.05);
}
const at = { columns: [], rows: [] };
function Ne(e) {
  if (e == null) return null;
  const t = typeof e;
  if (t === "number" || t === "boolean" || t === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function pe(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const o of Object.keys(i))
      n.has(o) || (n.add(o), t.push(o));
  const r = e.map((i) => {
    const o = {};
    for (const l of t) o[l] = Ne(i[l]);
    return o;
  });
  return { columns: t, rows: r };
}
function le(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function it(e) {
  const t = (r) => Array.isArray(r) ? r : le(r) && Array.isArray(r.points) ? r.points : null;
  if (le(e) && Array.isArray(e.series)) {
    const r = e.series, i = /* @__PURE__ */ new Map(), o = [];
    for (let l = 0; l < r.length; l++) {
      const a = r[l], u = a.name ?? `series_${l + 1}`;
      o.push(u);
      const c = a.points ?? a.data ?? [];
      for (const d of c) {
        const m = String(d.timestamp ?? ""), b = i.get(m) ?? { timestamp: m };
        b[u] = Ne(d.value), i.set(m, b);
      }
    }
    return { columns: ["timestamp", ...o], rows: [...i.values()] };
  }
  const n = t(e);
  return n ? {
    columns: ["timestamp", "value"],
    rows: n.map((r) => ({ timestamp: Ne(r.timestamp), value: Ne(r.value) }))
  } : null;
}
function Cn(e) {
  return le(e) && Array.isArray(e.bars) ? pe(e.bars) : null;
}
function $n(e) {
  if (Array.isArray(e) && e.length > 0 && le(e[0]))
    return pe(e);
  if (le(e) && "rows" in e) {
    const t = e, n = Array.isArray(t.columns) ? t.columns : [];
    if (n.length > 0 && le(n[0])) {
      const o = n.map((a) => a.key), l = t.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(o.map((u, c) => [u, Ne(a[c])])) : Kt(a, o)
      );
      return { columns: o, rows: l };
    }
    if (n.length > 0 && typeof n[0] == "string") {
      const i = n, o = t.rows.map(
        (l) => Array.isArray(l) ? Object.fromEntries(i.map((a, u) => [a, Ne(l[u])])) : Kt(l, i)
      );
      return { columns: i, rows: o };
    }
    const r = t.rows;
    return r.length > 0 && le(r[0]) ? pe(r) : at;
  }
  return null;
}
function Kt(e, t) {
  const n = {};
  for (const r of t) n[r] = Ne(e[r]);
  return n;
}
function En(e) {
  return le(e) && Array.isArray(e.cells) ? pe(e.cells) : null;
}
function Mn(e) {
  return le(e) && Array.isArray(e.slices) ? pe(e.slices) : null;
}
function Ve(e) {
  return le(e) && Array.isArray(e.events) ? pe(e.events) : null;
}
function zt(e) {
  return le(e) && Array.isArray(e.items) ? pe(e.items) : null;
}
function On(e) {
  if (le(e) && (Array.isArray(e.bids) || Array.isArray(e.asks))) {
    const t = e.bids ?? [], n = e.asks ?? [], r = [
      ...t.map((i) => ({ side: "bid", ...i })),
      ...n.map((i) => ({ side: "ask", ...i }))
    ];
    return pe(r);
  }
  return null;
}
function jn(e) {
  return typeof e == "number" ? { columns: ["value"], rows: [{ value: e }] } : le(e) && "value" in e && typeof e.value != "object" ? pe([e]) : null;
}
function Rn(e) {
  if (le(e) && "value" in e) {
    const { value: t, min: n, max: r } = e;
    return pe([{ value: t, min: n, max: r }]);
  }
  return null;
}
const fs = {
  timeseries: it,
  area_chart: it,
  sparkline: it,
  candlestick: Cn,
  table: $n,
  heatmap: En,
  distribution: Mn,
  events: Ve,
  tape: Ve,
  action_log: Ve,
  alert_log: Ve,
  text: zt,
  ticker: zt,
  orderbook: On,
  metric: jn,
  gauge: Rn
};
function ms(e) {
  if (e == null) return at;
  if (Array.isArray(e))
    return e.length === 0 ? at : le(e[0]) ? pe(e) : { columns: ["value"], rows: e.map((t) => ({ value: Ne(t) })) };
  if (le(e)) {
    const t = Object.entries(e).find(([, n]) => Array.isArray(n));
    return t && le(t[1][0]) ? pe(t[1]) : pe([e]);
  }
  return { columns: ["value"], rows: [{ value: Ne(e) }] };
}
function ps(e, t) {
  if (e == null) return at;
  if (t) {
    const n = fs[t];
    if (n) {
      const r = n(e);
      if (r) return r;
    }
  }
  for (const n of [
    it,
    Cn,
    En,
    Mn,
    Ve,
    zt,
    On,
    Rn,
    jn,
    $n
  ]) {
    const r = n(e);
    if (r && r.rows.length > 0) return r;
  }
  return ms(e);
}
const Ht = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
  ndjson: "application/x-ndjson;charset=utf-8",
  parquet: "application/vnd.apache.parquet"
}, hs = {
  csv: "csv",
  json: "json",
  ndjson: "ndjson",
  parquet: "parquet"
}, Pn = [
  { key: "csv", label: "CSV" },
  { key: "parquet", label: "Parquet" },
  { key: "json", label: "JSON" },
  { key: "ndjson", label: "NDJSON" }
];
function Wt(e) {
  if (e == null) return "";
  const t = String(e);
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function bs(e) {
  const { columns: t, rows: n } = e, r = t.map(Wt).join(","), i = n.map((o) => t.map((l) => Wt(o[l])).join(","));
  return [r, ...i].join(`
`);
}
function gs(e) {
  return JSON.stringify(e.rows, null, 2);
}
function xs(e) {
  return e.rows.map((t) => JSON.stringify(t)).join(`
`);
}
function ys(e) {
  return e.columns.map((t) => ({
    name: t,
    data: e.rows.map((n) => n[t] ?? null)
  }));
}
async function vs(e) {
  const { parquetWriteBuffer: t } = await import("./index-BKASYduw.js"), n = e.columns.length > 0 ? ys(e) : [{ name: "value", data: [] }], r = t({ columnData: n });
  return new Uint8Array(r);
}
function ws(e, t) {
  switch (t) {
    case "csv":
      return bs(e);
    case "json":
      return gs(e);
    case "ndjson":
      return xs(e);
  }
}
function Ln(e) {
  return e.table ?? ps(e.data, e.component);
}
async function ks(e, t) {
  const n = Ln(e);
  if (t === "parquet") {
    const i = await vs(n);
    return new Blob([i.slice().buffer], { type: Ht.parquet });
  }
  const r = ws(n, t);
  return new Blob([r], { type: Ht[t] });
}
function In(e) {
  return Ln(e).rows.length;
}
function Ns(e, t) {
  return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${hs[t]}`;
}
async function Dn(e, t, n) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function")
    return !1;
  const r = await ks(e, t), i = URL.createObjectURL(r), o = document.createElement("a");
  return o.href = i, o.download = Ns(n, t), document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(i), 0), !0;
}
function Ss(e, t) {
  if (!t) return null;
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "just now";
  if (n < 60) return `${n}s ago`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function zs(e) {
  const { resolution: t, loading: n, error: r, data: i, options: o, component: l, widgetId: a, Component: u, onRenderError: c, onRetry: d } = e;
  return t.error ? /* @__PURE__ */ s(Dt, { message: t.error }) : n ? /* @__PURE__ */ s(It, { component: l }) : r ? /* @__PURE__ */ s(Dt, { message: r, onRetry: d }) : /* @__PURE__ */ s("div", { className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]", children: /* @__PURE__ */ s(qr, { onError: c, children: /* @__PURE__ */ s(ir, { fallback: /* @__PURE__ */ s(It, { component: l }), children: /* @__PURE__ */ s(u, { data: i, options: o, widgetId: a }) }) }) });
}
function As({
  widget: e,
  data: t,
  onRefresh: n,
  onCopy: r,
  onToast: i
}) {
  const { dispatch: o, fullscreenId: l, setFullscreenId: a } = ae(), [u, c] = v(!1), [d, m] = v(!1), [b, p] = v(!1), g = F(null);
  j(() => {
    if (!u) return;
    const E = (P) => {
      g.current && !g.current.contains(P.target) && (c(!1), m(!1));
    };
    return document.addEventListener("mousedown", E), () => document.removeEventListener("mousedown", E);
  }, [u]);
  const h = e.source, w = h?.data !== void 0 && !h.url && !h.source_id, A = !!h && !w, _ = !!e.id, R = !!e.id && l !== e.id, $ = t == null ? 0 : In({ data: t, component: e.component }), x = $ > 0, T = async (E) => {
    p(!0);
    try {
      const P = await Dn(
        { data: t, component: e.component },
        E,
        e.title ?? e.id ?? e.component
      );
      i(
        P ? `Exported ${$.toLocaleString()} rows as ${E.toUpperCase()}` : "Export failed",
        P ? "ok" : "warn"
      );
    } catch {
      i("Export failed", "error");
    } finally {
      p(!1), c(!1), m(!1);
    }
  };
  return /* @__PURE__ */ f("div", { className: "relative", ref: g, children: [
    /* @__PURE__ */ s(
      "button",
      {
        onClick: () => c((E) => !E),
        className: "text-zinc-600 hover:text-zinc-300 px-1.5 text-base leading-none rounded",
        "aria-label": "Widget actions",
        children: "⋮"
      }
    ),
    u && /* @__PURE__ */ f("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-20 min-w-[140px]", children: [
      A && /* @__PURE__ */ s(
        "button",
        {
          onClick: () => {
            n(), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Refresh"
        }
      ),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: async () => {
            await r(), c(!1);
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
                b ? "…" : ""
              ] }),
              /* @__PURE__ */ s("span", { className: "text-zinc-600", children: d ? "▾" : "▸" })
            ]
          }
        ),
        d && /* @__PURE__ */ s("div", { className: "bg-zinc-950/60", children: Pn.map((E) => /* @__PURE__ */ s(
          "button",
          {
            onClick: () => T(E.key),
            disabled: b,
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
            a(e.id), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Fullscreen"
        }
      ),
      _ && /* @__PURE__ */ s(
        "button",
        {
          onClick: () => {
            o([{ targetId: e.id, remove: !0 }]), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800",
          children: "Remove"
        }
      )
    ] })
  ] });
}
function Fn({ config: e, contentHeight: t, snapshotKey: n }) {
  const { ctx: r, backendUrl: i, refreshIntervalMs: o, compact: l, toast: a, focusedId: u, setFocusedId: c, refreshPulse: d, emit: m, soundEnabled: b, reportWidgetHealth: p, registerWidgetData: g } = ae(), h = L(
    () => e.title ? De(e.title, r) : e.title,
    [e.title, r]
  ), w = L(() => {
    if (!e.source) return { source: void 0, error: null };
    try {
      const k = Qr(e.source, r, i);
      return o && o > 0 && !k.stream ? { source: { ...k, refreshIntervalMs: o }, error: null } : { source: k, error: null };
    } catch (k) {
      return { source: void 0, error: k instanceof Error ? k.message : "Resolution error" };
    }
  }, [e.source, r, i, o]), A = w.source, { data: _, loading: R, error: $, lastUpdated: x, connected: T, nextRetryAt: E, refresh: P } = jr(A), Y = Wr(e.component), H = F(_);
  H.current = _, j(() => {
    if (n)
      return g(n, () => H.current);
  }, [n, g]);
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
    const z = ns(_, k.when);
    if (z && !B.current) {
      const M = De(k.message, r), K = k.severity ?? "warn";
      a(M, K), m({ type: "alert", widgetId: e.id, severity: K, message: M, predicate: k.when }), b && ds(K);
    }
    B.current = z;
  }, [_, e.alert, r, a, m, e.id, b]);
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
  const X = !!e.id && u === e.id, se = e.id ? () => c(e.id) : void 0;
  return /* @__PURE__ */ f(
    "div",
    {
      onClick: se,
      className: `bg-zinc-900 border ${X ? "border-sky-400/60 shadow-[0_0_12px_-2px_rgba(56,189,248,0.4)]" : "border-zinc-800"} ${l ? "rounded" : "rounded-lg"} overflow-hidden transition-shadow`,
      children: [
        h && /* @__PURE__ */ f("div", { className: `${l ? "px-2.5 py-1.5" : "px-4 py-2.5"} border-b border-zinc-800 flex items-center justify-between`, children: [
          /* @__PURE__ */ s("h3", { className: `${l ? "text-xs" : "text-sm"} font-medium text-zinc-100 truncate`, children: h }),
          /* @__PURE__ */ f("div", { className: "flex items-center gap-2 shrink-0 ml-2", children: [
            G && x && /* @__PURE__ */ f("span", { className: `text-[10px] ${W ? "text-amber-400/80" : "text-zinc-600"}`, children: [
              W ? "stale · " : "",
              Ss(V, x)
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
              As,
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
        /* @__PURE__ */ s("div", { className: l ? "p-2.5" : "p-4", style: { height: l ? Math.round(t * 0.92) : t }, children: zs({
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
const Un = $t({
  hoverTime: null,
  setHoverTime: () => {
  }
});
function Bn() {
  return Ct(Un);
}
function _s({ children: e }) {
  const [t, n] = v(null), r = L(() => ({ hoverTime: t, setHoverTime: n }), [t]);
  return /* @__PURE__ */ s(Un.Provider, { value: r, children: e });
}
function Ts(e, t, n) {
  const r = n?.replaceAll ? [] : [...e];
  for (const i of t) {
    const o = r.findIndex((l) => l.id === i.targetId);
    if (i.remove) {
      o >= 0 && r.splice(o, 1);
      continue;
    }
    o >= 0 ? r[o] = {
      ...r[o],
      ...i.component !== void 0 && { component: i.component },
      ...i.title !== void 0 && { title: i.title },
      ...i.span !== void 0 && { span: i.span },
      ...i.height !== void 0 && { height: i.height },
      ...i.source !== void 0 && { source: i.source },
      ...i.options !== void 0 && { options: i.options }
    } : r.push({
      id: i.targetId,
      component: i.component || "placeholder",
      title: i.title,
      span: i.span,
      height: i.height,
      source: i.source,
      options: i.options
    });
  }
  return r;
}
const ct = "ctx.";
function Cs(e) {
  const t = {}, n = new URLSearchParams(e);
  for (const [r, i] of n)
    r.startsWith(ct) && (t[r.slice(ct.length)] = i);
  return t;
}
function $s(e, t) {
  const n = new URLSearchParams(e);
  for (const r of [...n.keys()])
    r.startsWith(ct) && n.delete(r);
  for (const [r, i] of Object.entries(t))
    n.set(`${ct}${r}`, i);
  return n.toString();
}
const Je = "medallion-terminal:view:";
function Es(e, t) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(Je + e, JSON.stringify(t));
    } catch {
    }
}
function Ms(e) {
  if (!e || typeof window > "u" || !window.localStorage) return null;
  try {
    const t = window.localStorage.getItem(Je + e);
    if (t == null) return null;
    const n = JSON.parse(t);
    if (!n || typeof n != "object") return null;
    const r = {};
    for (const [i, o] of Object.entries(n))
      typeof o == "string" && (r[i] = o);
    return r;
  } catch {
    return null;
  }
}
function Os() {
  if (typeof window > "u" || !window.localStorage) return [];
  const e = [];
  for (let t = 0; t < window.localStorage.length; t++) {
    const n = window.localStorage.key(t);
    n && n.startsWith(Je) && e.push(n.slice(Je.length));
  }
  return e.sort();
}
function js(e) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.removeItem(Je + e);
    } catch {
    }
}
const Rs = /* @__PURE__ */ new Set(["1d", "5d", "1m", "3m", "1y", "max"]), Ps = 150, Ls = 8;
function Is(e, t) {
  const n = e.trim();
  if (!n) return null;
  if (n.startsWith("/")) {
    const [l, ...a] = n.slice(1).split(/\s+/), u = a.join(" ").trim();
    switch (l.toLowerCase()) {
      case "save":
        return u ? { kind: "save", name: u } : null;
      case "load":
      case "open":
        return u ? { kind: "load", name: u } : null;
      case "delete":
      case "rm":
        return u ? { kind: "delete", name: u } : null;
      default:
        return { kind: "noop" };
    }
  }
  const r = n.split(/\s+/);
  if (r.length > 1) {
    const l = [];
    let a = !0;
    for (const u of r) {
      const c = u.match(/^([a-zA-Z_][a-zA-Z0-9_]*)[:=](.+)$/);
      if (!c) {
        a = !1;
        break;
      }
      l.push([c[1].toLowerCase(), c[2]]);
    }
    if (a && l.length > 1) return { kind: "set_many", pairs: l };
  }
  const i = n.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/);
  if (i) return { kind: "set", key: i[1].toLowerCase(), value: i[2].trim() };
  const o = n.indexOf(" ");
  return o > 0 ? { kind: "set", key: n.slice(0, o).toLowerCase(), value: n.slice(o + 1).trim() } : Rs.has(n.toLowerCase()) ? { kind: "set", key: "range", value: n.toLowerCase() } : { kind: "set", key: t, value: n };
}
function Ds({ suggest: e } = {}) {
  const { ctx: t, setCtx: n, toast: r } = ae(), [i, o] = v(!1), [l, a] = v(""), [u, c] = v([]), [d, m] = v(-1), b = F(null), [p, g] = v([]), h = F(0);
  j(() => {
    const x = (T) => {
      (T.metaKey || T.ctrlKey) && T.key.toLowerCase() === "k" ? (T.preventDefault(), o((E) => !E)) : T.key === "Escape" && o(!1);
    };
    return document.addEventListener("keydown", x), () => document.removeEventListener("keydown", x);
  }, []), j(() => {
    i ? b.current?.focus() : (a(""), m(-1), g([]));
  }, [i]), j(() => {
    if (!e || !i) return;
    const x = l.trim();
    if (!x) {
      g([]);
      return;
    }
    const T = ++h.current, E = setTimeout(async () => {
      try {
        const P = await e(x);
        if (T !== h.current) return;
        g(P.slice(0, Ls));
      } catch {
        T === h.current && g([]);
      }
    }, Ps);
    return () => clearTimeout(E);
  }, [l, i, e]);
  const w = L(() => Object.keys(t)[0] ?? "symbol", [t]), A = L(() => i ? Os() : [], [i, u]);
  if (!i) return null;
  const _ = () => {
    const x = Is(l, w);
    if (!x || x.kind === "noop") {
      o(!1);
      return;
    }
    if (x.kind === "save")
      Es(x.name, t), r(`Saved "${x.name}"`, "ok");
    else if (x.kind === "load") {
      const T = Ms(x.name);
      if (!T)
        r(`No view named "${x.name}"`, "warn");
      else {
        for (const [E, P] of Object.entries(T)) n(E, P);
        r(`Loaded "${x.name}"`, "ok");
      }
    } else if (x.kind === "delete")
      js(x.name), r(`Deleted "${x.name}"`, "ok");
    else if (x.kind === "set")
      n(x.key, x.value);
    else if (x.kind === "set_many")
      for (const [T, E] of x.pairs) n(T, E);
    c((T) => [l, ...T.filter((E) => E !== l)].slice(0, 5)), o(!1);
  }, R = (x) => {
    if (u.length === 0) return;
    const T = Math.max(-1, Math.min(u.length - 1, d + x));
    m(T), a(T === -1 ? "" : u[T]);
  }, $ = (x) => {
    for (const [T, E] of Object.entries(x.ctx)) n(T, E);
    o(!1);
  };
  return /* @__PURE__ */ s(
    "div",
    {
      className: "fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[20vh] px-4",
      onClick: () => o(!1),
      children: /* @__PURE__ */ f(
        "div",
        {
          className: "w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden",
          onClick: (x) => x.stopPropagation(),
          children: [
            /* @__PURE__ */ s(
              "input",
              {
                ref: b,
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
            u.length > 0 && /* @__PURE__ */ f("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "recent" }),
              u.map((x, T) => /* @__PURE__ */ s(
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
const Fs = [
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
function Us(e) {
  return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([n, r]) => `${n}=${r}`).join(" · ")}`;
}
function Bs({ templateShortcuts: e }) {
  const [t, n] = v(!1);
  return j(() => {
    const r = (i) => {
      const o = i.target?.tagName, l = o === "INPUT" || o === "TEXTAREA" || i.target?.isContentEditable;
      i.key === "?" && !l ? (i.preventDefault(), n((a) => !a)) : i.key === "Escape" && n(!1);
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
              Fs.map((r, i) => /* @__PURE__ */ f("div", { className: "flex items-baseline gap-3", children: [
                /* @__PURE__ */ s("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.keys }),
                /* @__PURE__ */ s("span", { className: "text-xs text-zinc-400", children: r.description })
              ] }, i)),
              e && e.length > 0 && /* @__PURE__ */ f(lt, { children: [
                /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1", children: "Dashboard shortcuts" }),
                e.map((r, i) => /* @__PURE__ */ f("div", { className: "flex items-baseline gap-3", children: [
                  /* @__PURE__ */ s("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.key }),
                  /* @__PURE__ */ s("span", { className: "text-xs text-zinc-400", children: Us(r) })
                ] }, `tpl-${i}`))
              ] })
            ] })
          ]
        }
      )
    }
  ) : null;
}
const Ks = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
  error: "border-red-500/40     bg-red-500/10     text-red-200",
  info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, Hs = 3500;
function Ws({ toasts: e, dismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ s("div", { className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none", children: e.map((n) => /* @__PURE__ */ s(qs, { toast: n, dismiss: t }, n.id)) });
}
function qs({ toast: e, dismiss: t }) {
  return j(() => {
    const n = setTimeout(() => t(e.id), Hs);
    return () => clearTimeout(n);
  }, [e.id, t]), /* @__PURE__ */ s(
    "div",
    {
      onClick: () => t(e.id),
      className: `pointer-events-auto cursor-pointer text-xs px-3 py-2 rounded border shadow-lg backdrop-blur-sm ${Ks[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
      children: e.message
    }
  );
}
const qt = /* @__PURE__ */ new Set([
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
function Vs(e, t) {
  const n = [];
  if (!e || typeof e != "object")
    return n.push({ path: "", severity: "error", message: "template is not an object" }), n;
  if (!Array.isArray(e.widgets))
    return n.push({ path: "widgets", severity: "error", message: "widgets must be an array" }), n;
  const r = t ? /* @__PURE__ */ new Set([...qt, ...t]) : qt;
  return e.widgets.forEach((i, o) => {
    const l = `widgets[${o}]`;
    if (!i || typeof i != "object") {
      n.push({ path: l, severity: "error", message: "widget is not an object" });
      return;
    }
    if (!i.component || typeof i.component != "string" ? n.push({ path: `${l}.component`, severity: "error", message: "missing component" }) : r.has(i.component) || n.push({
      path: `${l}.component`,
      severity: "warn",
      message: `unknown component "${i.component}" — register via registerWidget() or fix the spelling`
    }), i.span != null && (!Number.isInteger(i.span) || i.span < 1 || i.span > 12) && n.push({ path: `${l}.span`, severity: "warn", message: `span ${i.span} out of range 1..12` }), i.refresh_policy != null && i.refresh_policy !== "global" && i.refresh_policy !== "self" && i.refresh_policy !== "manual" && n.push({
      path: `${l}.refresh_policy`,
      severity: "error",
      message: `refresh_policy ${JSON.stringify(i.refresh_policy)} must be "global" | "self" | "manual"`
    }), i.source) {
      const a = i.source, u = [];
      a.source_id && u.push("source_id"), a.url && u.push("url"), (a.inline !== void 0 || a.data !== void 0) && u.push("inline"), u.length > 1 ? n.push({
        path: `${l}.source`,
        severity: "error",
        message: `multiple source modes set (${u.join(", ")}); pick one`
      }) : u.length === 0 && n.push({
        path: `${l}.source`,
        severity: "warn",
        message: "source declared but no mode (source_id / url / inline)"
      }), a.stream && (a.refreshIntervalMs ?? a.refreshInterval) && n.push({
        path: `${l}.source`,
        severity: "warn",
        message: "stream + refreshIntervalMs both set; refresh is ignored on streaming sources"
      });
    }
    i.alert && ((typeof i.alert.when != "string" || !rs(i.alert.when)) && n.push({
      path: `${l}.alert.when`,
      severity: "error",
      message: `alert predicate ${JSON.stringify(i.alert.when)} does not parse`
    }), (typeof i.alert.message != "string" || !i.alert.message) && n.push({ path: `${l}.alert.message`, severity: "warn", message: "alert has no message" }));
  }), n;
}
function Vt(e, t) {
  return e.id || `__mt_idx_${t}`;
}
function Gs(e) {
  const t = e?.widgets;
  return !Array.isArray(t) || t.length === 0 ? !1 : t.every((n) => {
    const r = n.source;
    if (!r) return !0;
    const i = r.inline !== void 0 || r.data !== void 0, o = !!(r.source_id || r.url);
    return i || !o;
  });
}
function Js(e, t, n, r, i) {
  const o = t.map((a, u) => {
    const c = r(a, u);
    if (c === void 0) {
      const d = a.source;
      return d && (d.source_id || d.url || d.stream) ? { ...a, source: { inline: null } } : a;
    }
    return { ...a, source: { inline: c } };
  }), l = {
    ...e,
    context: { values: { ...n } },
    widgets: o
  };
  return i && (l.frozenAt = i), l;
}
const Ys = {
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
}, Xs = ["1d", "5d", "1m", "3m", "1y", "max"], Zs = 200, Qs = 200;
function ei({ value: e, onChange: t }) {
  return /* @__PURE__ */ s("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: Xs.map((n) => {
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
const ti = [
  { label: "Off", ms: null },
  { label: "5s", ms: 5e3 },
  { label: "30s", ms: 3e4 },
  { label: "1m", ms: 6e4 },
  { label: "5m", ms: 3e5 }
];
function ni({ value: e, onChange: t }) {
  return /* @__PURE__ */ s("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: ti.map((n) => {
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
function ri() {
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
function si(e) {
  const t = new Date(e), n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), i = String(t.getSeconds()).padStart(2, "0");
  return `${n}:${r}:${i}`;
}
function ii(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function oi() {
  const { recentActions: e, widgetHealth: t } = ae(), n = dt(!0), r = e[0], i = Object.values(t), o = i.filter((d) => d.streaming), l = o.filter((d) => d.connected && !d.error).length, a = i.filter((d) => d.error).length, u = i.filter((d) => d.stale).length, c = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
  return /* @__PURE__ */ f("div", { className: "border-t border-zinc-800 bg-zinc-900/70 px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ s("div", { className: "flex-1 min-w-0 truncate", children: r ? /* @__PURE__ */ f("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ s("span", { className: "tabular-nums w-7 shrink-0", children: ii(n, r.receivedAt) }),
      /* @__PURE__ */ s("span", { className: "text-zinc-300 shrink-0", children: r.actionId }),
      /* @__PURE__ */ s("span", { className: `uppercase tracking-wider shrink-0 ${c}`, children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase() }),
      r.message && /* @__PURE__ */ s("span", { className: "truncate text-zinc-400", children: r.message })
    ] }) : /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "idle" }) }),
    o.length > 0 && /* @__PURE__ */ f(
      "span",
      {
        className: l === o.length ? "text-emerald-400/80" : "text-amber-400/80",
        title: `${l} of ${o.length} streams connected`,
        children: [
          /* @__PURE__ */ f("span", { className: "tabular-nums", children: [
            l,
            "/",
            o.length
          ] }),
          " ",
          /* @__PURE__ */ s("span", { className: "opacity-60", children: "↑" })
        ]
      }
    ),
    u > 0 && /* @__PURE__ */ f("span", { className: "text-amber-400/80 tabular-nums", title: `${u} widget(s) without recent updates`, children: [
      u,
      " stale"
    ] }),
    a > 0 && /* @__PURE__ */ f("span", { className: "text-red-400 tabular-nums", children: [
      a,
      " err"
    ] }),
    /* @__PURE__ */ s("span", { className: "tabular-nums text-zinc-300", children: si(n) })
  ] });
}
function li({ health: e }) {
  const t = Object.values(e);
  if (t.length === 0) return null;
  const n = t.filter((l) => l.streaming), r = n.filter((l) => l.connected && !l.error).length, i = t.filter((l) => l.error);
  if (n.length === 0 && i.length === 0) return null;
  const o = i.map((l) => l.title).join(`
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
    i.length > 0 && /* @__PURE__ */ f("span", { className: "text-red-400 tabular-nums", title: o, children: [
      i.length,
      " err",
      i.length === 1 ? "" : "s"
    ] })
  ] });
}
function ai({ onClick: e }) {
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
function ci({ enabled: e, onToggle: t }) {
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
function ui({ compact: e, onToggle: t }) {
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
function di({ onCopied: e }) {
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
function fi({ onClick: e }) {
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
function mi({ frozenAt: e }) {
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
function pi(e) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
  const t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
  i.href = r, i.download = `${t}.snapshot.json`, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
function Kn({
  template: e,
  backendUrl: t,
  onEvent: n,
  onCtxChange: r,
  paletteSuggest: i,
  chrome: o = "full",
  onShare: l
}) {
  const a = Cr(), u = e.columns || 12, [c, d] = v(e.widgets), m = L(() => Vs(e), [e]), b = L(() => m.some((S) => S.severity === "error"), [m]), p = L(() => !!e.frozenAt || Gs(e), [e]), [g, h] = v(!1), [w, A] = v(() => {
    const S = e.context?.values ?? {};
    return typeof window > "u" ? S : { ...S, ...Cs(window.location.search) };
  }), [_, R] = v(() => ht("refreshIntervalMs", null)), [$, x] = v(() => ht("compact", !1)), [T, E] = v(() => ht("soundEnabled", !1));
  j(() => {
    bt("refreshIntervalMs", _);
  }, [_]), j(() => {
    bt("compact", $);
  }, [$]), j(() => {
    bt("soundEnabled", T);
  }, [T]);
  const [P, Y] = v(null), [H, G] = v(null), [te, I] = v(null), [V, W] = v([]), C = F(0), B = ce((S) => {
    I((O) => ({ id: S, n: (O?.n ?? 0) + 1 }));
  }, []), ee = F(n);
  j(() => {
    ee.current = n;
  }, [n]);
  const [X, se] = v([]), y = ce(() => se([]), []), [k, z] = v([]), M = ce(() => z([]), []), [K, Z] = v({}), ne = ce((S, O) => {
    Z((J) => {
      const de = J[S];
      if (O === null) {
        if (!de) return J;
        const ye = { ...J };
        return delete ye[S], ye;
      }
      return de && de.streaming === O.streaming && de.connected === O.connected && de.error === O.error && de.title === O.title && de.stale === O.stale ? J : { ...J, [S]: O };
    });
  }, []), Q = F(/* @__PURE__ */ new Map()), re = ce((S, O) => (Q.current.set(S, O), () => {
    Q.current.get(S) === O && Q.current.delete(S);
  }), []), he = F({ widgets: c, ctx: w, template: e });
  he.current = { widgets: c, ctx: w, template: e };
  const _e = ce(() => {
    const { widgets: S, ctx: O, template: J } = he.current;
    return Js(J, S, O, (de, ye) => {
      const ge = Q.current.get(Vt(de, ye));
      return ge ? ge() : void 0;
    }, (/* @__PURE__ */ new Date()).toISOString());
  }, []), Te = ce((S) => {
    ee.current?.(S), S.type === "action" ? se((O) => [{
      receivedAt: Date.now(),
      actionId: S.actionId,
      clientRequestId: S.clientRequestId,
      status: S.status,
      message: S.message,
      terminal: S.terminal
    }, ...O].slice(0, Zs)) : S.type === "alert" && z((O) => [{
      receivedAt: Date.now(),
      widgetId: S.widgetId,
      severity: S.severity,
      message: S.message,
      predicate: S.predicate
    }, ...O].slice(0, Qs));
  }, []), Ce = ce((S, O = "info") => {
    C.current += 1;
    const J = C.current;
    W((de) => [...de, { id: J, message: S, severity: O }]);
  }, []), xe = ce((S) => {
    W((O) => O.filter((J) => J.id !== S));
  }, []), me = ce((S, O) => {
    A((J) => J[S] === O ? J : { ...J, [S]: O });
  }, []);
  j(() => {
    if (typeof window > "u") return;
    const S = $s(window.location.search, w), O = `${window.location.pathname}${S ? `?${S}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", O);
  }, [w]);
  const be = F(r);
  j(() => {
    be.current = r;
  }, [r]), j(() => {
    be.current?.(w);
  }, [w]);
  const $e = ce((S, O) => {
    d((J) => Ts(J, S, O));
  }, []), We = (S) => a === "mobile" ? u : a === "tablet" ? Math.min(S, Math.floor(u / 2)) : Math.min(S, u), Re = L(
    () => ({
      dispatch: $e,
      ctx: w,
      setCtx: me,
      backendUrl: t,
      widgets: c,
      refreshIntervalMs: _ ?? void 0,
      toast: Ce,
      compact: $,
      fullscreenId: P,
      setFullscreenId: Y,
      focusedId: H,
      setFocusedId: G,
      refreshPulse: te,
      requestRefresh: B,
      emit: Te,
      recentActions: X,
      clearRecentActions: y,
      recentAlerts: k,
      clearRecentAlerts: M,
      soundEnabled: T,
      widgetHealth: K,
      reportWidgetHealth: ne,
      registerWidgetData: re,
      snapshot: _e
    }),
    [
      $e,
      w,
      me,
      t,
      c,
      _,
      Ce,
      $,
      P,
      H,
      te,
      B,
      Te,
      X,
      y,
      k,
      M,
      T,
      K,
      ne,
      re,
      _e
    ]
  );
  j(() => {
    if (!P) return;
    const S = (O) => {
      O.key === "Escape" && Y(null);
    };
    return document.addEventListener("keydown", S), () => document.removeEventListener("keydown", S);
  }, [P]), j(() => {
    if (!H || typeof document > "u") return;
    document.getElementById(`mt-widget-${H}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [H]), j(() => {
    const S = (O) => {
      if (O.metaKey || O.ctrlKey || O.altKey) return;
      const J = O.target?.tagName;
      if (J === "INPUT" || J === "TEXTAREA" || O.target?.isContentEditable) return;
      const ye = e.shortcuts?.find((ue) => ue.key === O.key);
      if (ye) {
        O.preventDefault();
        for (const [ue, Pe] of Object.entries(ye.ctx)) me(ue, Pe);
        return;
      }
      const ge = c.map((ue) => ue.id).filter((ue) => !!ue);
      if (ge.length === 0) return;
      const Xe = (ue) => {
        const Pe = H ? ge.indexOf(H) : -1, Ze = ge[(Pe + ue + ge.length) % ge.length];
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
          H && (O.preventDefault(), Y(H));
          break;
        case "r":
          H && (O.preventDefault(), B(H));
          break;
        case "Escape":
          H && G(null);
          break;
      }
    };
    return document.addEventListener("keydown", S), () => document.removeEventListener("keydown", S);
  }, [c, H, B, e.shortcuts, me]);
  const qe = P ? c.find((S) => S.id === P) : null;
  return /* @__PURE__ */ s(Nn.Provider, { value: Re, children: /* @__PURE__ */ s(es, { children: /* @__PURE__ */ f(_s, { children: [
    /* @__PURE__ */ s(Ds, { suggest: i }),
    /* @__PURE__ */ s(Bs, { templateShortcuts: e.shortcuts }),
    /* @__PURE__ */ s(Ws, { toasts: V, dismiss: xe }),
    m.length > 0 && (!g || b) && /* @__PURE__ */ s(
      hi,
      {
        issues: m,
        dismissible: !b,
        onDismiss: () => h(!0)
      }
    ),
    /* @__PURE__ */ f("div", { className: "min-h-full bg-zinc-950 flex flex-col", children: [
      /* @__PURE__ */ f("div", { className: "flex-1 p-3 md:p-5", children: [
        (e.title || o === "full") && /* @__PURE__ */ f("div", { className: "mb-4 flex items-center gap-3 flex-wrap", children: [
          e.title && /* @__PURE__ */ s("h1", { className: "text-lg font-semibold text-zinc-100 tracking-tight mr-1", children: De(e.title, w) }),
          o === "full" && Object.entries(w).map(([S, O]) => S === "range" ? /* @__PURE__ */ s(ei, { value: O, onChange: (J) => me(S, J) }, S) : /* @__PURE__ */ f(
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
          o === "full" && /* @__PURE__ */ f("div", { className: "ml-auto flex items-center gap-2", children: [
            p ? /* @__PURE__ */ s(mi, { frozenAt: e.frozenAt }) : /* @__PURE__ */ f(lt, { children: [
              /* @__PURE__ */ s(li, { health: K }),
              /* @__PURE__ */ s(ni, { value: _, onChange: R }),
              /* @__PURE__ */ s(ai, { onClick: () => B("*") })
            ] }),
            /* @__PURE__ */ s(ci, { enabled: T, onToggle: () => E((S) => !S) }),
            /* @__PURE__ */ s(ui, { compact: $, onToggle: () => x((S) => !S) }),
            !p && /* @__PURE__ */ s(
              fi,
              {
                onClick: () => {
                  const S = _e();
                  l ? l(S) : pi(S), Ce(l ? "Snapshot shared" : "Snapshot downloaded", "ok");
                }
              }
            ),
            /* @__PURE__ */ s(di, { onCopied: () => Ce("URL copied", "ok") }),
            /* @__PURE__ */ s(ri, {})
          ] })
        ] }),
        /* @__PURE__ */ s(
          "div",
          {
            className: "grid gap-3 md:gap-4 items-start",
            style: { gridTemplateColumns: `repeat(${u}, 1fr)` },
            children: c.map((S, O) => /* @__PURE__ */ s(
              "div",
              {
                id: S.id ? `mt-widget-${S.id}` : void 0,
                style: {
                  gridColumn: `span ${We(S.span || 6)}`
                },
                children: /* @__PURE__ */ s(
                  Fn,
                  {
                    config: S,
                    contentHeight: S.height || Ys[S.component] || 280,
                    snapshotKey: Vt(S, O)
                  }
                )
              },
              S.id || O
            ))
          }
        )
      ] }),
      o === "full" && /* @__PURE__ */ s(oi, {})
    ] }),
    qe && /* @__PURE__ */ s(bi, { widget: qe, onClose: () => Y(null) })
  ] }) }) });
}
function hi({
  issues: e,
  dismissible: t,
  onDismiss: n
}) {
  const r = e.filter((a) => a.severity === "error"), i = e.filter((a) => a.severity === "warn"), o = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", l = r.length > 0 ? "Template errors" : "Template warnings";
  return /* @__PURE__ */ f("div", { className: `border-b ${o} px-3 md:px-5 py-2 text-xs flex items-start gap-3`, children: [
    /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ f("div", { className: "font-medium uppercase tracking-wider text-[10px] mb-1", children: [
        l,
        " (",
        r.length + i.length,
        ")"
      ] }),
      /* @__PURE__ */ f("ul", { className: "space-y-0.5", children: [
        [...r, ...i].slice(0, 8).map((a, u) => /* @__PURE__ */ f("li", { className: "font-mono text-[11px] leading-tight", children: [
          /* @__PURE__ */ s("span", { className: "opacity-60", children: a.path || "<root>" }),
          /* @__PURE__ */ s("span", { className: "mx-1.5 opacity-40", children: "·" }),
          /* @__PURE__ */ s("span", { children: a.message })
        ] }, u)),
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
function bi({ widget: e, onClose: t }) {
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
        /* @__PURE__ */ s("div", { onClick: (r) => r.stopPropagation(), className: "flex-1 min-h-0", children: /* @__PURE__ */ s(Fn, { config: e, contentHeight: n }) })
      ]
    }
  );
}
const Hn = "medallion-terminal:";
function ht(e, t) {
  if (typeof window > "u" || !window.localStorage) return t;
  try {
    const n = window.localStorage.getItem(Hn + e);
    return n == null ? t : JSON.parse(n);
  } catch {
    return t;
  }
}
function bt(e, t) {
  if (!(typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(Hn + e, JSON.stringify(t));
    } catch {
    }
}
function gi(e, t) {
  j(() => {
    const n = (r) => {
      if (!(r.metaKey || r.ctrlKey)) return;
      const i = Number(r.key);
      Number.isFinite(i) && i >= 1 && i <= 9 && i <= e && (r.preventDefault(), t(i - 1));
    };
    return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
  }, [e, t]);
}
function $c({
  tabs: e,
  activeIndex: t,
  onSelect: n,
  backendUrl: r
}) {
  const i = Math.max(0, Math.min(t, e.length - 1));
  gi(e.length, n);
  const [o, l] = v(() => /* @__PURE__ */ new Set([i]));
  return j(() => {
    l((a) => a.has(i) ? a : /* @__PURE__ */ new Set([...a, i]));
  }, [i]), e.length === 0 ? null : /* @__PURE__ */ f("div", { className: "min-h-full bg-zinc-950", children: [
    /* @__PURE__ */ s(xi, { tabs: e, activeIndex: i, onSelect: n }),
    e.map((a, u) => /* @__PURE__ */ s("div", { style: { display: u === i ? "block" : "none" }, children: o.has(u) && /* @__PURE__ */ s(Kn, { template: a.template, backendUrl: r }) }, u))
  ] });
}
function xi({
  tabs: e,
  activeIndex: t,
  onSelect: n
}) {
  const r = typeof navigator < "u" && /mac/i.test(navigator.platform);
  return /* @__PURE__ */ s("div", { className: "flex gap-0.5 px-3 md:px-5 pt-3 border-b border-zinc-800 overflow-x-auto items-end", children: e.map((i, o) => {
    const l = o === t, a = o < 9 ? `${r ? "⌘" : "Ctrl"}${o + 1}` : null;
    return /* @__PURE__ */ f(
      "button",
      {
        onClick: () => n(o),
        className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${l ? "bg-zinc-900 text-zinc-100 border-x border-t border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`,
        title: a ? `Switch with ${a}` : void 0,
        children: [
          /* @__PURE__ */ s("span", { children: i.label || `Tab ${o + 1}` }),
          a && /* @__PURE__ */ s("span", { className: "text-[9px] text-zinc-600 font-mono uppercase tracking-wider", children: a })
        ]
      },
      o
    );
  }) });
}
function Ec(e = 0) {
  const [t, n] = v(() => {
    if (typeof window > "u") return e;
    const i = Number(new URLSearchParams(window.location.search).get("tab"));
    return Number.isFinite(i) && i >= 0 ? i : e;
  });
  return [t, (i) => {
    if (n(i), typeof window < "u") {
      const o = new URLSearchParams(window.location.search);
      o.set("tab", String(i)), window.history.replaceState(null, "", `${window.location.pathname}?${o.toString()}${window.location.hash}`);
    }
  }];
}
function Wn(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 2);
}
function He(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : Math.abs(e) < 1 ? e.toFixed(2) : e.toFixed(1);
}
function qn(e) {
  return Math.abs(e) >= 1e12 ? (e / 1e12).toFixed(2) + "T" : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function je(e) {
  if (e == null) return "";
  try {
    const t = new Date(e);
    return isNaN(t.getTime()) ? String(e) : t.toLocaleDateString(void 0, { month: "short", day: "numeric" });
  } catch {
    return String(e);
  }
}
const Gt = 864e5;
function yi(e) {
  let t = !1, n = 1 / 0, r = -1 / 0;
  for (const i of e) {
    const o = String(i ?? "");
    !t && o.includes(":") && (t = !0);
    const l = new Date(o).getTime();
    isNaN(l) || (l < n && (n = l), l > r && (r = l));
  }
  return { hasTime: t, spanMs: r > n ? r - n : 0 };
}
function vi(e) {
  return e.hasTime ? e.spanMs <= 2 * Gt ? (t) => {
    try {
      const n = new Date(t);
      return isNaN(n.getTime()) ? String(t) : n.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return String(t);
    }
  } : e.spanMs <= 14 * Gt ? Mt : je : je;
}
function wi(e) {
  return e.hasTime ? Mt : je;
}
function Mt(e) {
  if (e == null) return "";
  try {
    const t = new Date(e);
    return isNaN(t.getTime()) ? String(e) : t.toLocaleString(void 0, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch {
    return String(e);
  }
}
function ki(e, t = {}) {
  const { decimals: n = 2, as: r = "fraction", signed: i = !1 } = t, o = r === "fraction" ? e * 100 : e;
  return `${i && o > 0 ? "+" : ""}${o.toFixed(n)}%`;
}
function Ni(e, t = "USD", n = {}) {
  const { compact: r = !1, decimals: i } = n;
  try {
    return e.toLocaleString(void 0, {
      style: "currency",
      currency: t,
      maximumFractionDigits: i ?? (r ? 0 : Math.abs(e) >= 100 ? 2 : 4),
      minimumFractionDigits: i ?? (r || Math.abs(e) >= 100 ? 0 : 2)
    });
  } catch {
    return e.toLocaleString();
  }
}
function Si(e, t = {}) {
  const { signed: n = !1, as: r = "fraction" } = t, i = r === "fraction" ? e * 1e4 : e * 100;
  return `${n && i > 0 ? "+" : ""}${Math.round(i)} bps`;
}
const Ee = {
  ok: "#10b981",
  warn: "#f59e0b",
  danger: "#ef4444",
  error: "#ef4444",
  info: "#0ea5e9",
  muted: "#71717a"
}, fe = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#22d3ee",
  "#fb7185"
], Ae = {
  backgroundColor: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 6,
  fontSize: 12,
  color: "#fafafa"
};
function zi(e, t) {
  return e ? e in Ee ? Ee[e] : e.startsWith("#") ? e : fe[t % fe.length] : fe[t % fe.length];
}
const Ai = [
  [/claude|anthropic|opus|sonnet|haiku|fable/i, "#d97757"],
  // Anthropic orange
  [/chatgpt|openai|gpt/i, "#10a37f"],
  // OpenAI green
  [/gemini/i, "#4285f4"],
  // Google blue
  [/grok|xai/i, "#fafafa"],
  // x.ai (inverted)
  [/deepseek/i, "#4d6bfe"],
  [/qwen/i, "#8b5cf6"],
  [/kimi|moonshot/i, "#f472b6"],
  [/glm|zhipu/i, "#22d3ee"],
  [/llama|meta ai/i, "#0668e1"],
  [/mistral/i, "#ff7000"],
  [/market/i, "#38bdf8"],
  // site accent
  [/\belo\b/i, "#71717a"]
  // muted baseline
];
function _i(e) {
  if (!e) return null;
  for (const [t, n] of Ai)
    if (t.test(e)) return n;
  return null;
}
function Ti(e, t) {
  const n = parseInt(e.slice(1), 16), r = (a) => Math.round(
    t >= 0 ? a + (255 - a) * t : a * (1 + t)
  ), [i, o, l] = [n >> 16 & 255, n >> 8 & 255, n & 255].map(r);
  return `#${(i << 16 | o << 8 | l).toString(16).padStart(6, "0")}`;
}
function Vn(e, t = fe) {
  const n = /* @__PURE__ */ new Map();
  return e.map((r, i) => {
    const o = _i(r);
    if (!o) return t[i % t.length];
    const l = n.get(o) ?? 0;
    if (n.set(o, l + 1), l === 0) return o;
    const a = parseInt(o.slice(1, 3), 16) > 176;
    return Ti(o, (a ? -0.22 : 0.25) * l);
  });
}
const Ci = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], $i = {
  buy: "#10b981",
  sell: "#ef4444",
  info: "#0ea5e9",
  warn: "#f59e0b"
};
function Ei({ data: e, options: t }) {
  const { hoverTime: n, setHoverTime: r } = Bn(), i = F(null), o = L(() => Pi(e), [e]), { tickFormatter: l, labelFormatter: a } = L(() => {
    const m = yi(o?.points.map((b) => b._ts) ?? []);
    return {
      tickFormatter: vi(m),
      labelFormatter: wi(m)
    };
  }, [o]), u = L(
    () => Vn(o?.keys ?? [], Ci),
    [o]
  ), c = t?.brush === !0;
  if (!o) return /* @__PURE__ */ s(D, { children: "No data" });
  const d = n != null && n !== i.current;
  return /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(
    or,
    {
      data: o.points,
      onMouseMove: (m) => {
        const b = m?.activeLabel;
        if (b != null) {
          const p = String(b);
          i.current = p, r(p);
        }
      },
      onMouseLeave: () => {
        i.current = null, r(null);
      },
      children: [
        /* @__PURE__ */ s(Ue, { strokeDasharray: "3 3", stroke: "#27272a" }),
        /* @__PURE__ */ s(
          Be,
          {
            dataKey: "_ts",
            stroke: "#3f3f46",
            tick: { fontSize: 11, fill: "#a1a1aa" },
            tickFormatter: l
          }
        ),
        /* @__PURE__ */ s(
          Ke,
          {
            stroke: "#3f3f46",
            tick: { fontSize: 11, fill: "#a1a1aa" },
            tickFormatter: Wn,
            width: 60
          }
        ),
        /* @__PURE__ */ s(
          ze,
          {
            contentStyle: Ae,
            labelStyle: { color: "#a1a1aa" },
            labelFormatter: a
          }
        ),
        o.keys.map((m, b) => /* @__PURE__ */ s(
          lr,
          {
            type: "monotone",
            dataKey: m,
            stroke: u[b],
            dot: !1,
            strokeWidth: 2
          },
          m
        )),
        c && o.points.length > 4 && /* @__PURE__ */ s(
          gn,
          {
            dataKey: "_ts",
            height: 20,
            stroke: "#3f3f46",
            fill: "#18181b",
            travellerWidth: 6,
            tickFormatter: l
          }
        ),
        d && /* @__PURE__ */ s(ar, { x: n, stroke: "#52525b", strokeDasharray: "3 3" }),
        o.annotations.map((m, b) => {
          const p = m.color ?? (m.kind ? $i[m.kind] : null) ?? "#a1a1aa";
          if (m.endTimestamp) {
            const [g, h] = m.timestamp <= m.endTimestamp ? [m.timestamp, m.endTimestamp] : [m.endTimestamp, m.timestamp];
            return /* @__PURE__ */ s(
              cr,
              {
                x1: g,
                x2: h,
                fill: p,
                fillOpacity: 0.1,
                stroke: p,
                strokeOpacity: 0.4,
                strokeDasharray: "3 3",
                label: { value: m.label, position: "insideTopLeft", fontSize: 10, fill: p }
              },
              b
            );
          }
          return m.value === void 0 ? null : /* @__PURE__ */ s(
            ur,
            {
              x: m.timestamp,
              y: m.value,
              r: 6,
              fill: p,
              stroke: "#18181b",
              strokeWidth: 2,
              ifOverflow: "extendDomain",
              shape: (g) => /* @__PURE__ */ s(Mi, { ...g, kind: m.kind, color: p, label: m.label })
            },
            b
          );
        })
      ]
    }
  ) });
}
function Mi({ cx: e, cy: t, kind: n, color: r, label: i }) {
  if (e == null || t == null) return null;
  let o;
  if (n === "buy")
    o = `M${e} ${t - 7} L${e + 6} ${t + 4} L${e - 6} ${t + 4} Z`;
  else if (n === "sell")
    o = `M${e} ${t + 7} L${e + 6} ${t - 4} L${e - 6} ${t - 4} Z`;
  else
    return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("circle", { cx: e, cy: t, r: 5, fill: r, stroke: "#18181b", strokeWidth: 2, children: /* @__PURE__ */ s("title", { children: i }) }) });
  return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("path", { d: o, fill: r, stroke: "#18181b", strokeWidth: 1.5, children: /* @__PURE__ */ s("title", { children: i }) }) });
}
const Oi = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function ji(e) {
  for (const t of Oi)
    if (t in e) return t;
  return null;
}
function Ri(e) {
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
function Pi(e) {
  if (!e) return null;
  const t = Ri(e);
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const n = e[0], r = ji(n);
    if (!r) return null;
    const i = Object.keys(n).filter(
      (l) => l !== r && typeof n[l] == "number"
    );
    return i.length === 0 ? null : { points: e.map((l) => {
      const a = l, u = { _ts: a[r] };
      for (const c of i) u[c] = a[c];
      return u;
    }), keys: i, annotations: t };
  }
  if (typeof e == "object" && e !== null && "points" in e) {
    const n = e.points;
    return !Array.isArray(n) || n.length === 0 ? null : { points: n.map((i) => {
      const o = i;
      return { _ts: o.timestamp ?? o.date ?? o.time ?? o.x, value: o.value ?? o.y ?? o.v };
    }), keys: ["value"], annotations: t };
  }
  if (typeof e == "object" && e !== null && "series" in e) {
    const n = e.series;
    if (!Array.isArray(n)) return null;
    const r = /* @__PURE__ */ new Map(), i = [];
    for (const o of n) {
      const l = o, a = String(l.name || l.label || `s${i.length}`);
      i.push(a);
      const u = l.data ?? l.points;
      if (Array.isArray(u))
        for (const c of u) {
          const d = String(c.timestamp ?? c.date ?? c.time ?? c.x ?? "");
          r.has(d) || r.set(d, { _ts: d }), r.get(d)[a] = c.value ?? c.y ?? c.v;
        }
    }
    return { points: Array.from(r.values()), keys: i, annotations: t };
  }
  return null;
}
const Li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Timeseries: Ei
}, Symbol.toStringTag, { value: "Module" })), Ii = {
  buy: { shape: "arrowUp", position: "belowBar", color: "#10b981" },
  sell: { shape: "arrowDown", position: "aboveBar", color: "#ef4444" },
  info: { shape: "circle", position: "aboveBar", color: "#0ea5e9" },
  warn: { shape: "circle", position: "aboveBar", color: "#f59e0b" }
}, Jt = {
  shape: "circle",
  position: "aboveBar",
  color: "#71717a"
};
function Di({ data: e }) {
  const { hoverTime: t, setHoverTime: n } = Bn(), r = F(null), i = F(null), o = F(null), l = F(null), a = F(null), u = F(null);
  j(() => {
    if (!r.current) return;
    const d = Sr(r.current, {
      layout: {
        background: { type: zr.Solid, color: "transparent" },
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
    }), m = d.addSeries(Ar, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderDownColor: "#f87171",
      borderUpColor: "#34d399",
      wickDownColor: "#f87171",
      wickUpColor: "#34d399"
    }), b = d.addSeries(_r, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume"
    });
    d.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 }
    }), i.current = d, o.current = m, l.current = b, a.current = Tr(m, []), d.subscribeCrosshairMove((g) => {
      if (g.time != null) {
        const h = String(g.time);
        u.current = h, n(h);
      } else
        u.current = null, n(null);
    });
    const p = new ResizeObserver((g) => {
      const { width: h, height: w } = g[0].contentRect;
      d.applyOptions({ width: h, height: w });
    });
    return p.observe(r.current), () => {
      p.disconnect(), d.remove(), i.current = null, o.current = null, l.current = null, a.current = null;
    };
  }, []), j(() => {
    const d = i.current, m = o.current;
    if (!d || !m) return;
    if (t == null) {
      d.clearCrosshairPosition();
      return;
    }
    if (t === u.current) return;
    const b = m.data?.()[0]?.close ?? 0;
    d.setCrosshairPosition(b, t, m);
  }, [t]);
  const c = L(() => Bi(e), [e]);
  return j(() => {
    o.current && c.candles.length !== 0 && (o.current.setData(c.candles), c.volumes.length > 0 && l.current && l.current.setData(c.volumes), a.current && a.current.setMarkers(Fi(c.annotations)), i.current?.timeScale().fitContent());
  }, [c]), /* @__PURE__ */ f("div", { className: "relative w-full h-full", children: [
    /* @__PURE__ */ s("div", { ref: r, className: "w-full h-full" }),
    c.candles.length === 0 && /* @__PURE__ */ s("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s(D, { children: "No data" }) })
  ] });
}
function Fi(e) {
  return e.map((t) => {
    const n = t.kind ? Ii[t.kind] ?? Jt : Jt;
    return {
      time: Gn(t.timestamp),
      position: n.position,
      shape: n.shape,
      color: t.color ?? n.color,
      text: t.label
    };
  });
}
const Ui = ["timestamp", "date", "time", "datetime", "ts", "t"];
function Ie(e, t) {
  for (const r of t)
    if (r in e) return r;
  const n = Object.keys(e).reduce((r, i) => (r[i.toLowerCase()] = i, r), {});
  for (const r of t)
    if (n[r]) return n[r];
  return null;
}
function Gn(e) {
  if (typeof e == "number")
    return e > 1e12 ? Math.floor(e / 1e3) : e;
  const t = String(e).trim();
  if (t.includes("T") || / \d/.test(t)) {
    const n = new Date(t.replace(" ", "T"));
    if (!isNaN(n.getTime())) return Math.floor(n.getTime() / 1e3);
  }
  return t.split(" ")[0].split("T")[0];
}
function Bi(e) {
  const t = { candles: [], volumes: [], annotations: [] };
  if (!e) return t;
  let n, r = [];
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && e !== null) {
    const p = e;
    n = Array.isArray(p.bars) ? p.bars : [], Array.isArray(p.annotations) && (r = p.annotations.map((g) => {
      const h = g;
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
  const i = n[0], o = Ie(i, Ui), l = Ie(i, ["open", "o"]), a = Ie(i, ["high", "h"]), u = Ie(i, ["low", "l"]), c = Ie(i, ["close", "c"]), d = Ie(i, ["volume", "vol", "v"]);
  if (!o || !l || !a || !u || !c) return { ...t, annotations: r };
  const m = [], b = [];
  for (const p of n) {
    const g = p, h = Gn(g[o]), w = Number(g[l]), A = Number(g[a]), _ = Number(g[u]), R = Number(g[c]);
    m.push({ time: h, open: w, high: A, low: _, close: R }), d && g[d] != null && b.push({
      time: h,
      value: Number(g[d]),
      color: R >= w ? "rgba(52, 211, 153, 0.3)" : "rgba(248, 113, 113, 0.3)"
    });
  }
  return { candles: m, volumes: b, annotations: r };
}
const Ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Candlestick: Di
}, Symbol.toStringTag, { value: "Module" }));
function Jn(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
const Hi = /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:?\d{2})$/;
function Wi(e) {
  if (typeof e != "string" || !Hi.test(e.trim())) return e;
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function Yn(e) {
  if (!e) return [];
  if (typeof e == "string") return [{ body: e }];
  if (!Array.isArray(e) && typeof e == "object" && e !== null) {
    const t = e;
    return Array.isArray(t.items) ? Yn(t.items) : [Yt(t)];
  }
  return Array.isArray(e) ? e.map((t) => typeof t == "string" ? { body: t } : typeof t == "object" && t !== null ? Yt(t) : { body: String(t) }) : [];
}
function Yt(e) {
  return {
    id: e.id != null ? String(e.id) : void 0,
    title: e.title != null ? String(e.title) : void 0,
    meta: e.meta ?? e.source ?? e.date ?? e.author ? [e.source, e.author, Wi(e.date)].filter(Boolean).map(String).join(" · ") : void 0,
    body: e.body ?? e.content ?? e.summary ?? e.text ? String(e.body ?? e.content ?? e.summary ?? e.text) : void 0,
    tags: Array.isArray(e.tags) ? e.tags.map(String) : void 0,
    image: e.image != null ? String(e.image) : e.image_url != null ? String(e.image_url) : e.thumbnail != null ? String(e.thumbnail) : void 0,
    url: Jn(e.url ?? e.uri ?? e.link ?? e.href)
  };
}
const qi = 25, Vi = 600;
function Gi({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = t?.pageSize || qi, i = t?.row_context, o = t?.heat_columns ?? [], l = t?.export === !0, a = t?.tick_flash === !0, u = t?.search === !0, c = t?.column_formats ?? {}, { columns: d, rows: m, labels: b, formats: p } = L(() => Ji(e), [e]), g = L(() => ({ ...p, ...c }), [p, c]), [h, w] = v(null), [A, _] = v(!0), [R, $] = v(0), [x, T] = v(""), E = (y, k) => {
    const z = d[0] != null ? y[d[0]] : void 0;
    return z == null ? `_idx_${k}` : String(z);
  }, P = F(/* @__PURE__ */ new Map()), [Y, H] = v(/* @__PURE__ */ new Map());
  j(() => {
    if (!a) return;
    const y = /* @__PURE__ */ new Map();
    for (let z = 0; z < m.length; z++) {
      const M = m[z], K = E(M, z), Z = P.current.get(K), ne = {};
      let Q = null;
      for (const re of d) {
        const he = M[re];
        typeof he == "number" && (ne[re] = he, Q == null && Z && Z[re] != null && Z[re] !== he && (Q = he > Z[re] ? "up" : "down"));
      }
      P.current.set(K, ne), Q && y.set(K, Q);
    }
    if (y.size === 0) return;
    H((z) => {
      const M = new Map(z);
      for (const [K, Z] of y) M.set(K, Z);
      return M;
    });
    const k = setTimeout(() => {
      H((z) => {
        const M = new Map(z);
        for (const [K, Z] of y)
          M.get(K) === Z && M.delete(K);
        return M;
      });
    }, Vi);
    return () => clearTimeout(k);
  }, [m, a]);
  const G = L(() => {
    const y = {};
    for (const k of o) {
      let z = 1 / 0, M = -1 / 0;
      for (const K of m) {
        const Z = K[k];
        typeof Z == "number" && Number.isFinite(Z) && (Z < z && (z = Z), Z > M && (M = Z));
      }
      Number.isFinite(z) && Number.isFinite(M) && (y[k] = { min: z, max: M });
    }
    return y;
  }, [m, o]), te = (y) => {
    if (!i) return;
    const k = i.field ?? d[0], z = y[k];
    z != null && n(i.key, String(z));
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
    const K = typeof z == "number" && typeof M == "number" ? z - M : String(z).localeCompare(String(M));
    return A ? K : -K;
  }) : I, [I, h, A]), W = Math.max(1, Math.ceil(V.length / r)), C = Math.min(R, W - 1), B = V.slice(C * r, (C + 1) * r), ee = V.length > r, X = (y) => {
    h === y ? _(!A) : (w(y), _(!0)), $(0);
  };
  return d.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ f("div", { className: "flex flex-col h-full", children: [
    (u || l) && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 pb-1", children: [
      u && /* @__PURE__ */ s(
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
              d.map(At).join(","),
              ...V.map((K) => d.map((Z) => At(K[Z])).join(","))
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
        const k = g[y], z = k && k !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(k);
        return /* @__PURE__ */ f(
          "th",
          {
            onClick: () => X(y),
            className: `px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${z ? "text-right" : "text-left"}`,
            children: [
              b[y] ?? y,
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
            onClick: i ? () => te(y) : void 0,
            className: `border-b border-zinc-800/60 transition-colors duration-300 ${z === "up" ? "bg-emerald-500/15" : z === "down" ? "bg-red-500/15" : ""} ${i ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/40"}`,
            children: d.map((K) => {
              const Z = G[K], ne = y[K], Q = Z && typeof ne == "number" ? { backgroundColor: Yi(ne, Z.min, Z.max) } : void 0, re = g[K];
              if (re === "link" && ne != null) {
                const me = typeof ne == "object" && !Array.isArray(ne) ? ne : { label: void 0, url: ne }, be = Jn(me.url), $e = me.label != null && me.label !== "" ? String(me.label) : be ?? "";
                return /* @__PURE__ */ s("td", { className: "px-3 py-2.5 whitespace-nowrap", style: Q, children: be ? /* @__PURE__ */ f(
                  "a",
                  {
                    href: be,
                    ...be.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" },
                    className: "text-sky-400 hover:underline",
                    children: [
                      $e,
                      /* @__PURE__ */ s("span", { className: "ml-1 text-xs text-zinc-500", "aria-hidden": "true", children: be.startsWith("/") ? "→" : "↗" })
                    ]
                  }
                ) : /* @__PURE__ */ s("span", { className: "text-zinc-100", children: $e }) }, K);
              }
              if (re === "sparkline" && Array.isArray(ne))
                return /* @__PURE__ */ s("td", { className: "px-3 py-2.5 whitespace-nowrap", style: Q, children: /* @__PURE__ */ s(Xi, { values: ne }) }, K);
              const he = re ? Zi(ne, re) : _t(ne), _e = re ? re.split(":").slice(1).includes("signed") : !1, Ce = re && re !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(re) ? "text-right" : "", xe = _e && typeof ne == "number" ? ne > 0 ? "text-emerald-400" : ne < 0 ? "text-red-400" : "text-zinc-100" : "text-zinc-100";
              return /* @__PURE__ */ s(
                "td",
                {
                  className: `px-3 py-2.5 whitespace-nowrap tabular-nums ${Ce} ${xe}`,
                  style: Q,
                  children: he
                },
                K
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
function Ji(e) {
  const t = { columns: [], rows: [], labels: {}, formats: {} };
  if (!e) return t;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object") {
    const n = [...new Set(e.flatMap((r) => Object.keys(r)))];
    return { ...t, columns: n, rows: e };
  }
  if (typeof e == "object" && e !== null && "rows" in e) {
    const n = e, r = Array.isArray(n.columns) ? n.columns : [];
    if (r.length > 0 && typeof r[0] == "object") {
      const o = r, l = o.map((d) => d.key), a = {}, u = {};
      for (const d of o)
        d.label && (a[d.key] = d.label), d.format && (u[d.key] = d.format);
      const c = n.rows.map(
        (d) => Array.isArray(d) ? Object.fromEntries(l.map((m, b) => [m, d[b]])) : d
      );
      return { columns: l, rows: c, labels: a, formats: u };
    }
    if (r.length > 0) {
      const o = r, l = n.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(o.map((u, c) => [u, a[c]])) : a
      );
      return { ...t, columns: o, rows: l };
    }
    const i = n.rows;
    if (i.length > 0 && typeof i[0] == "object" && !Array.isArray(i[0])) {
      const o = [...new Set(i.flatMap((l) => Object.keys(l)))];
      return { ...t, columns: o, rows: i };
    }
  }
  return t;
}
function Yi(e, t, n) {
  if (n === t) return "transparent";
  if (t < 0 && n > 0) {
    const i = Math.max(Math.abs(t), Math.abs(n)), o = Math.max(-1, Math.min(1, e / i));
    return o >= 0 ? `rgba(16, 185, 129, ${0.35 * o})` : `rgba(239, 68, 68, ${0.35 * -o})`;
  }
  return `rgba(14, 165, 233, ${0.35 * ((e - t) / (n - t))})`;
}
function At(e) {
  if (e == null) return "";
  if (typeof e == "object" && !Array.isArray(e) && "url" in e)
    return At(e.url);
  const t = String(e);
  return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function Xi({ values: e }) {
  const t = e.map((u) => Number(u)).filter((u) => Number.isFinite(u));
  if (t.length < 2) return /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "—" });
  const n = Math.min(...t), i = Math.max(...t) - n || 1, l = t[t.length - 1] >= t[0] ? "#10b981" : "#ef4444", a = t.map((u, c) => {
    const d = c / (t.length - 1) * 100, m = 16 - (u - n) / i * 14 - 1;
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
function _t(e) {
  return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Zi(e, t) {
  if (e == null) return "—";
  if (t.split(":")[0] === "datetime") return Mt(e);
  if (typeof e != "number") return _t(e);
  const [n, ...r] = t.split(":"), i = new Set(r), o = i.has("signed");
  switch (n) {
    case "currency": {
      const l = r.find((a) => a !== "signed") ?? "USD";
      return Ni(e, l);
    }
    case "percent": {
      const l = i.has("p") ? "percent" : "fraction";
      return ki(e, { signed: o, as: l });
    }
    case "bps":
      return Si(e, { signed: o });
    case "compact":
      return He(e);
    default:
      return _t(e);
  }
}
const Qi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DataTable: Gi
}, Symbol.toStringTag, { value: "Module" })), eo = 400;
function Xn(e, t = eo) {
  const [n, r] = v(e), i = F(e), o = F(0), l = F(void 0);
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
    i.current = n, o.current = performance.now();
    const u = (c) => {
      const d = Math.min(1, (c - o.current) / t), m = 1 - Math.pow(1 - d, 3), b = i.current + (e - i.current) * m;
      r(b), d < 1 && (l.current = requestAnimationFrame(u));
    };
    return l.current = requestAnimationFrame(u), () => {
      l.current && cancelAnimationFrame(l.current);
    };
  }, [e, t]), n;
}
const to = 600;
function no({ data: e }) {
  const { value: t, delta: n, unit: r, label: i, trend: o } = so(e), l = Xn(t), a = F(null), [u, c] = v(null);
  return j(() => {
    const m = a.current;
    if (a.current = t, m == null || m === t) return;
    c(t > m ? "up" : "down");
    const b = setTimeout(() => c(null), to);
    return () => clearTimeout(b);
  }, [t]), /* @__PURE__ */ f("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ f("div", { className: `text-3xl font-bold tabular-nums transition-colors duration-300 ${u === "up" ? "text-emerald-300" : u === "down" ? "text-red-300" : "text-white"}`, children: [
      qn(l),
      r && /* @__PURE__ */ s("span", { className: "text-base font-normal text-zinc-400 ml-1", children: r })
    ] }),
    n != null && /* @__PURE__ */ f("div", { className: `text-sm font-medium ${n >= 0 ? "text-emerald-400" : "text-red-400"}`, children: [
      n >= 0 ? "▲" : "▼",
      " ",
      io(n)
    ] }),
    o && o.length >= 2 && /* @__PURE__ */ s(ro, { values: o }),
    i && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: i })
  ] });
}
function ro({ values: e }) {
  const t = Math.min(...e), r = Math.max(...e) - t || 1, o = e[e.length - 1] >= e[0] ? "#10b981" : "#ef4444", l = e.map((a, u) => {
    const c = u / (e.length - 1) * 100, d = 18 - (a - t) / r * 16 - 1;
    return `${c.toFixed(1)},${d.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 100 18", className: "w-full max-w-[120px] h-5", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: o,
      strokeWidth: "1.5",
      points: l,
      vectorEffect: "non-scaling-stroke"
    }
  ) });
}
function so(e) {
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
function io(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Metric: no
}, Symbol.toStringTag, { value: "Module" })), lo = 1500;
function ao({ data: e }) {
  const t = Yn(e), n = F(/* @__PURE__ */ new Set()), r = F(!1), [i, o] = v(/* @__PURE__ */ new Set());
  return j(() => {
    const l = t.map(Xt);
    if (!r.current) {
      r.current = !0;
      for (const c of l) n.current.add(c);
      return;
    }
    const a = l.filter((c) => !n.current.has(c));
    for (const c of l) n.current.add(c);
    if (a.length === 0) return;
    o((c) => {
      const d = new Set(c);
      for (const m of a) d.add(m);
      return d;
    });
    const u = setTimeout(() => {
      o((c) => {
        const d = new Set(c);
        for (const m of a) d.delete(m);
        return d;
      });
    }, lo);
    return () => clearTimeout(u);
  }, [t]), t.length === 0 ? /* @__PURE__ */ s(D, { children: "No content" }) : /* @__PURE__ */ s("div", { className: "overflow-auto h-full space-y-3", children: t.map((l, a) => {
    const u = Xt(l), c = i.has(u) ? "bg-sky-500/5" : "";
    return /* @__PURE__ */ f(
      "article",
      {
        className: `flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${c}`,
        children: [
          /* @__PURE__ */ f("div", { className: "flex-1 min-w-0", children: [
            (l.title || l.url) && /* @__PURE__ */ s("h4", { className: "text-sm font-medium text-zinc-100 mb-1 leading-snug", children: l.url ? /* @__PURE__ */ f(
              "a",
              {
                href: l.url,
                ...l.url.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" },
                className: "hover:text-sky-400 hover:underline",
                children: [
                  l.title || co(l.url),
                  /* @__PURE__ */ s("span", { className: "ml-1 text-xs text-zinc-500", "aria-hidden": "true", children: l.url.startsWith("/") ? "→" : "↗" })
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
function Xt(e) {
  return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function co(e) {
  try {
    return new URL(e).hostname;
  } catch {
    return e;
  }
}
const uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Text: ao
}, Symbol.toStringTag, { value: "Module" }));
function fo({ options: e }) {
  const { dispatch: t, ctx: n, setCtx: r, backendUrl: i, widgets: o } = ae(), [l, a] = v(""), [u, c] = v(!1), [d, m] = v(null), [b, p] = v(null), g = e?.url, h = !!i, w = ce(async () => {
    const _ = l.trim();
    if (!(!_ || u) && !(!h && !g)) {
      c(!0), p(null), m(null);
      try {
        const R = h ? await fetch(Gr(i), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Jr(_, n, o))
        }) : await fetch(g, {
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
        c(!1);
      }
    }
  }, [l, u, h, i, g, n, o, t, r]), A = (_) => {
    _.key === "Enter" && !_.shiftKey && (_.preventDefault(), w());
  };
  return !h && !g ? /* @__PURE__ */ s(D, { padded: !0, children: "Set a backendUrl on Dashboard or options.url on this widget" }) : /* @__PURE__ */ f("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
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
          disabled: u
        }
      ),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: w,
          disabled: u || !l.trim(),
          className: `px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default
            rounded-lg text-sm text-zinc-200 font-medium shrink-0`,
          children: u ? "..." : "Send"
        }
      )
    ] }),
    d && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-400 leading-relaxed", children: d }),
    b && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: b })
  ] });
}
const mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Prompt: fo
}, Symbol.toStringTag, { value: "Module" })), tt = {
  ok: "#10b981",
  warn: "#f59e0b",
  danger: "#ef4444",
  error: "#ef4444",
  info: "#0ea5e9",
  muted: "#71717a"
}, gt = "M 16 104 A 84 84 0 0 1 184 104";
function po({ data: e }) {
  const t = ho(e);
  if (!t) return /* @__PURE__ */ s(D, { children: "No data" });
  const n = t.max - t.min, r = n > 0 ? Math.max(0, Math.min(1, (t.value - t.min) / n)) : 0, i = t.bands.find((l) => t.value >= l.from && t.value <= l.to), o = tt[i?.color ?? "info"] ?? tt.info;
  return /* @__PURE__ */ f("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ f("svg", { viewBox: "0 0 200 120", className: "w-full max-w-[260px]", children: [
      /* @__PURE__ */ s("path", { d: gt, fill: "none", stroke: "#27272a", strokeWidth: "16", pathLength: "100" }),
      t.bands.map((l, a) => {
        const u = (l.from - t.min) / n, c = (l.to - t.min) / n;
        return /* @__PURE__ */ s(
          "path",
          {
            d: gt,
            fill: "none",
            stroke: tt[l.color] ?? tt.muted,
            strokeWidth: "16",
            opacity: 0.22,
            pathLength: "100",
            strokeDasharray: `${(c - u) * 100} 100`,
            strokeDashoffset: -u * 100
          },
          a
        );
      }),
      /* @__PURE__ */ s(
        "path",
        {
          d: gt,
          fill: "none",
          stroke: o,
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
          children: bo(t.value, t.min, t.max)
        }
      )
    ] }),
    t.label && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500 text-center px-2 truncate max-w-full", children: t.label })
  ] });
}
function ho(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e;
  if (typeof t.value != "number") return null;
  const n = typeof t.min == "number" ? t.min : 0, r = typeof t.max == "number" ? t.max : 1, i = Array.isArray(t.bands) ? t.bands.map((o) => {
    const l = o;
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
    bands: i,
    label: t.label != null ? String(t.label) : void 0
  };
}
function bo(e, t, n) {
  return t === 0 && n === 1 ? `${(e * 100).toFixed(1)}%` : t === -1 && n === 1 ? e >= 0 ? `+${e.toFixed(2)}` : e.toFixed(2) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Gauge: po
}, Symbol.toStringTag, { value: "Module" }));
function xo({ data: e }) {
  const t = L(() => yo(e), [e]);
  if (!t) return /* @__PURE__ */ s(D, { children: "No data" });
  const { slices: n, total: r } = t, i = n.map((a, u) => zi(a.color, u)), o = n.reduce((a, u) => u.value > a.value ? u : a), l = o.value / r * 100;
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ f("div", { className: "flex-1 relative min-h-0", children: [
      /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(dr, { children: [
        /* @__PURE__ */ s(
          fr,
          {
            data: n,
            dataKey: "value",
            nameKey: "label",
            innerRadius: "60%",
            outerRadius: "92%",
            paddingAngle: 2,
            stroke: "none",
            isAnimationActive: !1,
            children: n.map((a, u) => /* @__PURE__ */ s(xn, { fill: i[u] }, u))
          }
        ),
        /* @__PURE__ */ s(
          ze,
          {
            contentStyle: Ae,
            formatter: (a) => {
              const u = Number(a) || 0;
              return [`${vo(u)} (${(u / r * 100).toFixed(1)}%)`, ""];
            }
          }
        )
      ] }) }),
      /* @__PURE__ */ f("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
        /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate max-w-[60%]", children: o.label }),
        /* @__PURE__ */ f("div", { className: "text-2xl font-bold text-white tabular-nums", children: [
          l.toFixed(1),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs", children: n.map((a, u) => /* @__PURE__ */ f("div", { className: "flex items-center gap-1.5 min-w-0", children: [
      /* @__PURE__ */ s("span", { className: "w-2 h-2 rounded-sm shrink-0", style: { backgroundColor: i[u] } }),
      /* @__PURE__ */ s("span", { className: "text-zinc-300 truncate", children: a.label }),
      /* @__PURE__ */ f("span", { className: "text-zinc-500 ml-auto tabular-nums shrink-0", children: [
        (a.value / r * 100).toFixed(1),
        "%"
      ] })
    ] }, u)) })
  ] });
}
function yo(e) {
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
  const o = (typeof t.total == "number" ? t.total : null) ?? r.reduce((l, a) => l + a.value, 0);
  return { slices: r, total: o };
}
function vo(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Distribution: xo
}, Symbol.toStringTag, { value: "Module" })), ko = 96, No = 22;
function So({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => Ao(e), [e]);
  if (!r) return /* @__PURE__ */ s(D, { children: "No data" });
  const i = t?.row_context, o = t?.col_context, l = !!(i || o), a = (w, A) => {
    i && n(i.key, r.rows[w]), o && n(o.key, r.columns[A]);
  }, { rows: u, columns: c, cells: d, min: m, max: b, scale: p } = r, g = d.length <= 60, h = L(() => {
    const w = u.map(() => Array(c.length).fill(void 0));
    for (const A of d) w[A.row][A.col] = A;
    return w;
  }, [u, c, d]);
  return /* @__PURE__ */ f("div", { className: "h-full w-full overflow-auto flex flex-col", children: [
    /* @__PURE__ */ f(
      "div",
      {
        className: "inline-grid min-w-full",
        style: {
          gridTemplateColumns: `${ko}px repeat(${c.length}, minmax(28px, 1fr))`,
          gap: 2
        },
        children: [
          /* @__PURE__ */ s("div", { className: "sticky left-0 top-0 z-20 bg-zinc-900" }),
          c.map((w) => /* @__PURE__ */ s(
            "div",
            {
              className: "text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900",
              style: { height: No },
              children: w
            },
            `c-${w}`
          )),
          u.flatMap((w, A) => [
            /* @__PURE__ */ s(
              "div",
              {
                className: "text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900",
                style: { minHeight: 30 },
                children: w
              },
              `rl-${A}`
            ),
            ...c.map((_, R) => {
              const $ = h[A][R];
              if (!$) return /* @__PURE__ */ s("div", { className: "bg-zinc-900 rounded-sm" }, `e-${A}-${R}`);
              const x = Zn($.value, m, b, p);
              return /* @__PURE__ */ s(
                "div",
                {
                  onClick: l ? () => a(A, R) : void 0,
                  className: `rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${l ? "cursor-pointer hover:ring-1 hover:ring-zinc-400" : ""}`,
                  style: { backgroundColor: x, minHeight: 30 },
                  title: `${w} × ${c[R]}: ${$.label ?? $.value.toFixed(2)}`,
                  children: g && /* @__PURE__ */ s("span", { className: "text-white/90", children: $.label ?? _o($.value) })
                },
                `cell-${A}-${R}`
              );
            })
          ])
        ]
      }
    ),
    /* @__PURE__ */ s(zo, { min: m, max: b, scale: p })
  ] });
}
function zo({ min: e, max: t, scale: n }) {
  const r = n === "diverging" ? [-1, -0.5, 0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1], i = t - e;
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ s("span", { className: "tabular-nums", children: He(e) }),
    /* @__PURE__ */ s("div", { className: "flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden", children: r.map((o, l) => {
      const a = n === "diverging" ? o * Math.max(Math.abs(e), Math.abs(t)) : e + o * i;
      return /* @__PURE__ */ s("div", { className: "flex-1", style: { backgroundColor: Zn(a, e, t, n) } }, l);
    }) }),
    /* @__PURE__ */ s("span", { className: "tabular-nums", children: He(t) })
  ] });
}
function Ao(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e, n = Array.isArray(t.rows) ? t.rows.map(String) : null, r = Array.isArray(t.columns) ? t.columns.map(String) : null, i = Array.isArray(t.cells) ? t.cells : null;
  if (!n || !r || !i) return null;
  const o = i.map((d) => {
    const m = d;
    return {
      row: Number(m.row ?? 0),
      col: Number(m.col ?? 0),
      value: Number(m.value ?? 0),
      label: m.label != null ? String(m.label) : void 0
    };
  }).filter((d) => d.row >= 0 && d.row < n.length && d.col >= 0 && d.col < r.length);
  if (o.length === 0) return null;
  const l = o.map((d) => d.value), a = typeof t.min == "number" ? t.min : Math.min(...l), u = typeof t.max == "number" ? t.max : Math.max(...l), c = t.scale === "diverging" ? "diverging" : "sequential";
  return { rows: n, columns: r, cells: o, min: a, max: u, scale: c };
}
function we(e, t, n) {
  return Math.round(e + (t - e) * n);
}
function Zn(e, t, n, r) {
  if (n === t) return "rgb(63 63 70)";
  if (r === "diverging") {
    const o = Math.max(Math.abs(t), Math.abs(n)) || 1, l = Math.max(-1, Math.min(1, e / o));
    if (l >= 0)
      return `rgb(${we(39, 16, l)} ${we(39, 185, l)} ${we(42, 129, l)})`;
    const a = -l;
    return `rgb(${we(39, 239, a)} ${we(39, 68, a)} ${we(42, 68, a)})`;
  }
  const i = Math.max(0, Math.min(1, (e - t) / (n - t)));
  return `rgb(${we(39, 14, i)} ${we(39, 165, i)} ${we(42, 233, i)})`;
}
function _o(e) {
  return Math.abs(e) < 1 ? e.toFixed(2) : Math.abs(e) < 100 ? e.toFixed(1) : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : Math.round(e).toString();
}
const To = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Heatmap: So
}, Symbol.toStringTag, { value: "Module" })), Co = {
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
function $o({ data: e, options: t }) {
  const n = L(() => Eo(e), [e]), r = t?.filter === !0, [i, o] = v(""), l = L(() => {
    if (!n) return null;
    if (!i.trim()) return n;
    const a = i.toLowerCase();
    return n.filter(
      (u) => u.label.toLowerCase().includes(a) || (u.body?.toLowerCase().includes(a) ?? !1) || (u.source?.toLowerCase().includes(a) ?? !1) || (u.tags?.some((c) => c.toLowerCase().includes(a)) ?? !1)
    );
  }, [n, i]);
  return !n || n.length === 0 ? /* @__PURE__ */ s(D, { children: "No events" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col", children: [
    r && /* @__PURE__ */ s(
      "input",
      {
        type: "text",
        placeholder: "Filter events…",
        value: i,
        onChange: (a) => o(a.target.value),
        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 mb-2 shrink-0"
      }
    ),
    /* @__PURE__ */ f("div", { className: "flex-1 overflow-auto min-h-0", children: [
      l.length === 0 && /* @__PURE__ */ s("div", { className: "flex items-center justify-center h-full text-zinc-500 text-xs", children: "No matches" }),
      l.map((a, u) => /* @__PURE__ */ f("div", { className: "flex gap-3 px-1 py-2.5 border-b border-zinc-800 last:border-0", children: [
        /* @__PURE__ */ s("div", { className: "flex flex-col items-center pt-1.5 shrink-0", children: /* @__PURE__ */ s("span", { className: `w-2 h-2 rounded-full ${Co[a.status ?? ""] ?? "bg-zinc-600"}` }) }),
        /* @__PURE__ */ f("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ f("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 tabular-nums shrink-0 font-mono", children: a.timestamp }),
            /* @__PURE__ */ s("span", { className: "text-sm text-zinc-100 truncate", children: a.label })
          ] }),
          a.body && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-400 mt-0.5 line-clamp-2", children: a.body }),
          (a.source || a.tags && a.tags.length > 0) && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mt-1 text-[10px] text-zinc-500 flex-wrap", children: [
            a.source && /* @__PURE__ */ s("span", { className: "text-zinc-500", children: a.source }),
            a.tags?.map((c, d) => /* @__PURE__ */ s("span", { className: "px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400", children: c }, d))
          ] })
        ] })
      ] }, u))
    ] })
  ] });
}
function Eo(e) {
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
const Mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Events: $o
}, Symbol.toStringTag, { value: "Module" })), Oo = "medallion.terminal.v1.TerminalService", jo = {
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
function Ro() {
  const { backendUrl: e } = ae(), [t, n] = v(null), [r, i] = v(!0), [o, l] = v(null);
  if (j(() => {
    if (!e) {
      i(!1), n(null);
      return;
    }
    i(!0), l(null);
    const u = new AbortController();
    return fetch(`${e.replace(/\/$/, "")}/${Oo}/ListSources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      signal: u.signal
    }).then((c) => c.ok ? c.json() : Promise.reject(new Error(`HTTP ${c.status}`))).then((c) => n(c.sources ?? [])).catch((c) => {
      c.name !== "AbortError" && l(c.message);
    }).finally(() => i(!1)), () => u.abort();
  }, [e]), !e) return /* @__PURE__ */ s(D, { padded: !0, children: "No backendUrl configured on Dashboard" });
  if (r) return /* @__PURE__ */ s(D, { padded: !0, children: "Loading catalog…" });
  if (o) return /* @__PURE__ */ f(D, { padded: !0, children: [
    "Failed to load: ",
    o
  ] });
  if (!t || t.length === 0) return /* @__PURE__ */ s(D, { padded: !0, children: "No sources registered" });
  const a = {};
  for (const u of t) {
    const c = u.shape && jo[u.shape] || "other";
    a[c] || (a[c] = []), a[c].push(u);
  }
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto pr-1", children: Object.entries(a).map(([u, c]) => /* @__PURE__ */ f("div", { className: "mb-4 last:mb-0", children: [
    /* @__PURE__ */ f("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5", children: [
      u,
      " ",
      /* @__PURE__ */ f("span", { className: "text-zinc-700", children: [
        "— ",
        c.length
      ] })
    ] }),
    c.map((d) => /* @__PURE__ */ f("div", { className: "py-2 border-b border-zinc-800/60 last:border-0", children: [
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
  ] }, u)) });
}
const Po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Catalog: Ro
}, Symbol.toStringTag, { value: "Module" })), Zt = 10;
function Lo({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => Io(e), [e]), i = t?.price_context, o = i ? (p, g) => {
    n(i.key, String(p)), i.side_key && n(i.side_key, g === "bid" ? "buy" : "sell");
  } : void 0;
  if (!r) return /* @__PURE__ */ s(D, { children: "No data" });
  const l = r.bids[0]?.price, a = r.asks[0]?.price, u = r.mid ?? (l != null && a != null ? (l + a) / 2 : 0), c = r.spread ?? (l != null && a != null ? a - l : 0), d = r.bids.slice(0, Zt), m = r.asks.slice(0, Zt).reverse(), b = Math.max(...r.bids.map((p) => p.size), ...r.asks.map((p) => p.size), 1);
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ f("div", { className: "grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800", children: [
      /* @__PURE__ */ s("span", { children: "Price" }),
      /* @__PURE__ */ s("span", { className: "text-right", children: "Size" }),
      /* @__PURE__ */ s("span", { className: "text-right", children: "Cum" })
    ] }),
    /* @__PURE__ */ f("div", { className: "flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto", children: m.map((p, g) => {
        const h = m.slice(g).reduce((w, A) => w + A.size, 0);
        return /* @__PURE__ */ s(Qt, { side: "ask", level: p, cum: h, maxSize: b, onPrice: o }, `ask-${g}`);
      }) }),
      /* @__PURE__ */ f("div", { className: "border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ s("span", { className: "text-zinc-200 tabular-nums", children: Tt(u) }),
        /* @__PURE__ */ f("span", { className: "text-zinc-500 text-[10px]", children: [
          "spread ",
          Tt(c)
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto", children: d.map((p, g) => {
        const h = d.slice(0, g + 1).reduce((w, A) => w + A.size, 0);
        return /* @__PURE__ */ s(Qt, { side: "bid", level: p, cum: h, maxSize: b, onPrice: o }, `bid-${g}`);
      }) })
    ] }),
    r.venue && /* @__PURE__ */ s("div", { className: "text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0", children: r.venue })
  ] });
}
function Qt({
  side: e,
  level: t,
  cum: n,
  maxSize: r,
  onPrice: i
}) {
  const o = t.size / r * 100, l = e === "bid" ? "bg-emerald-500/10" : "bg-red-500/10", a = e === "bid" ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ f(
    "div",
    {
      onClick: i ? () => i(t.price, e) : void 0,
      className: `relative grid grid-cols-3 gap-2 px-2 py-0.5 ${i ? "cursor-pointer hover:bg-zinc-800/40" : ""}`,
      children: [
        /* @__PURE__ */ s("div", { className: `absolute inset-y-0 right-0 ${l}`, style: { width: `${o}%` } }),
        /* @__PURE__ */ s("span", { className: `relative ${a} tabular-nums`, children: Tt(t.price) }),
        /* @__PURE__ */ s("span", { className: "relative text-right text-zinc-200 tabular-nums", children: tn(t.size) }),
        /* @__PURE__ */ s("span", { className: "relative text-right text-zinc-500 tabular-nums", children: tn(n) })
      ]
    }
  );
}
function Io(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = en(t.bids), r = en(t.asks);
  return n.length === 0 && r.length === 0 ? null : {
    bids: n,
    asks: r,
    mid: typeof t.mid == "number" ? t.mid : void 0,
    spread: typeof t.spread == "number" ? t.spread : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0
  };
}
function en(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = t;
    return { price: Number(n.price ?? 0), size: Number(n.size ?? 0) };
  }).filter((t) => Number.isFinite(t.price) && Number.isFinite(t.size) && t.size > 0) : [];
}
function Tt(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(2);
}
function tn(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const Do = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OrderBook: Lo
}, Symbol.toStringTag, { value: "Module" })), Fo = 6;
function Uo({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => Bo(e), [e]), i = L(
    () => r ? [...r.rows].sort((c, d) => c.key - d.key) : [],
    [r]
  );
  if (!r) return /* @__PURE__ */ s(D, { children: "No data" });
  const o = r.subject_value, l = i.length >= 2 ? i[1].key - i[0].key : 0, a = r.measures, u = t?.row_context;
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs", children: [
    /* @__PURE__ */ f("div", { className: "px-3 py-2 border-b border-zinc-800 flex items-baseline gap-3 flex-wrap shrink-0", children: [
      /* @__PURE__ */ s("span", { className: "text-zinc-100 font-medium", children: r.subject }),
      r.dimension && /* @__PURE__ */ s("span", { className: "text-zinc-500", children: r.dimension }),
      o != null && /* @__PURE__ */ s("span", { className: "text-zinc-300 tabular-nums", children: o.toLocaleString() }),
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
          a.map((c) => /* @__PURE__ */ s("th", { className: "text-right px-2 py-1.5", children: c.label }, `l-${c.key}`)),
          /* @__PURE__ */ s("th", { className: "text-center px-2 py-1.5 bg-zinc-950", children: r.key_label }),
          a.map((c) => /* @__PURE__ */ s("th", { className: "text-right px-2 py-1.5", children: c.label }, `r-${c.key}`))
        ] })
      ] }),
      /* @__PURE__ */ s("tbody", { children: i.map((c, d) => {
        const m = o != null && l > 0 && Math.abs(c.key - o) < l, b = !!u;
        return /* @__PURE__ */ f(
          "tr",
          {
            onClick: b ? () => n(u.key, String(c.key)) : void 0,
            className: `border-b border-zinc-800/40 ${`${m ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"} ${b ? "cursor-pointer" : ""}`}`,
            children: [
              a.map((g) => /* @__PURE__ */ s("td", { className: "text-right px-2 py-1 text-zinc-300", children: rn(c.left?.values?.[g.key], g.format) }, `l-${g.key}`)),
              /* @__PURE__ */ s("td", { className: `text-center px-2 py-1 font-medium ${m ? "text-zinc-100 bg-zinc-950/60" : "text-zinc-300 bg-zinc-950/40"}`, children: c.key.toLocaleString() }),
              a.map((g) => /* @__PURE__ */ s("td", { className: "text-right px-2 py-1 text-zinc-300", children: rn(c.right?.values?.[g.key], g.format) }, `r-${g.key}`))
            ]
          },
          d
        );
      }) })
    ] }) })
  ] });
}
function Bo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e;
  if (!Array.isArray(t.rows) || t.rows.length === 0) return null;
  const n = t.rows.map((o) => {
    const l = o;
    return {
      // Accept legacy options shape (`strike`/`call`/`put`) so authored
      // fixtures keep rendering during migration.
      key: Number(l.key ?? l.strike ?? 0),
      left: nn(l.left ?? l.call),
      right: nn(l.right ?? l.put)
    };
  }), r = Ko(t.measures), i = r.length > 0 ? r : Ho(n);
  return {
    subject: String(t.subject ?? t.underlying ?? ""),
    dimension: typeof t.dimension == "string" ? t.dimension : typeof t.expiry == "string" ? t.expiry : void 0,
    subject_value: typeof t.subject_value == "number" ? t.subject_value : typeof t.underlying_price == "number" ? t.underlying_price : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0,
    rows: n,
    left_label: String(t.left_label ?? "Left"),
    right_label: String(t.right_label ?? "Right"),
    key_label: String(t.key_label ?? "Key"),
    measures: i
  };
}
function Ko(e) {
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
function Ho(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of [n.left, n.right])
      if (r?.values) for (const i of Object.keys(r.values)) t.add(i);
  return Array.from(t).slice(0, Fo).map((n) => ({ key: n, label: n }));
}
function nn(e) {
  if (!e || typeof e != "object") return;
  const t = e;
  if (t.values && typeof t.values == "object" && !Array.isArray(t.values)) {
    const r = {};
    for (const [i, o] of Object.entries(t.values))
      typeof o == "number" && (r[i] = o);
    return Object.keys(r).length === 0 ? void 0 : { values: r };
  }
  const n = {};
  for (const [r, i] of Object.entries(t))
    typeof i == "number" && (n[r] = i);
  return Object.keys(n).length === 0 ? void 0 : { values: n };
}
function rn(e, t) {
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
const Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PairedGrid: Uo
}, Symbol.toStringTag, { value: "Module" })), qo = /* @__PURE__ */ new Set([
  "ACTION_STATUS_OK",
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]), Vo = /* @__PURE__ */ new Set([
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]);
function ot(e) {
  return !!e && qo.has(e);
}
function sn(e) {
  return !!e && Vo.has(e);
}
const Go = 64;
function Jo(e, t) {
  const [n, r] = v([]), [i, o] = v(!1), [l, a] = v(null);
  return j(() => {
    if (!e || !t || !!!(t.clientRequestId || t.id || t.actionId)) return;
    r([]), o(!1), a(null);
    const c = new AbortController();
    let d = !1;
    return (async () => {
      try {
        const m = await fetch(Yr(e), {
          method: "POST",
          headers: { "Content-Type": vn },
          body: JSON.stringify(Xr(t)),
          signal: c.signal
        });
        if (!m.ok) throw new Error(`WatchAction: HTTP ${m.status}`);
        if (!m.body) throw new Error("WatchAction: no response body");
        const b = m.body.getReader();
        await wn(b, {
          onMessage: (p) => {
            const g = p;
            r((h) => h.length >= Go ? [...h.slice(1), g] : [...h, g]), ot(g.status) && o(!0);
          },
          onTrailer: (p) => {
            if (p.error) {
              const g = p.error.code ?? "unknown", h = p.error.message ?? "watch error";
              a(`${g}: ${h}`);
            }
            o(!0);
          },
          isDisposed: () => d
        }), b.releaseLock();
      } catch (m) {
        !d && m instanceof Error && m.name !== "AbortError" && (a(m.message), o(!0));
      } finally {
        d || o(!0);
      }
    })(), () => {
      d = !0, c.abort();
    };
  }, [e, t?.clientRequestId, t?.id, t?.actionId]), {
    updates: n,
    latest: n.length > 0 ? n[n.length - 1] : null,
    done: i,
    error: l
  };
}
function Yo({ options: e }) {
  const t = e ?? {}, { ctx: n, toast: r, backendUrl: i, emit: o } = ae(), l = t.symbol ?? n.symbol ?? "", a = t.url, u = t.action_id ?? "place_order", c = i ? "connect" : a ? "url" : null, [d, m] = v("buy"), [b, p] = v(""), [g, h] = v(""), w = F(n.price);
  j(() => {
    n.price !== w.current && (w.current = n.price, n.price != null && h(n.price));
  }, [n.price]);
  const A = F(n.side);
  j(() => {
    n.side !== A.current && (A.current = n.side, (n.side === "buy" || n.side === "sell") && m(n.side));
  }, [n.side]);
  const [_, R] = v(!1), [$, x] = v(null), [T, E] = v(null), [P, Y] = v(!1), [H, G] = v(null), te = Jo(c === "connect" ? i : void 0, H);
  j(() => {
    if (!te.latest) return;
    const C = te.latest;
    C.message && x(C.message);
    const B = ot(C.status);
    o({
      type: "action",
      actionId: C.action_id ?? u,
      clientRequestId: C.client_request_id ?? "",
      status: String(C.status ?? ""),
      message: C.message,
      terminal: B
    }), B && (C.message && r(C.message, sn(C.status) ? "error" : "ok"), G(null));
  }, [te.latest, r, o, u]), j(() => {
    P && Y(!1);
  }, [b, g, d]);
  const I = ce(async () => {
    if (!c || _) return;
    const C = Number(b);
    if (!Number.isFinite(C) || C <= 0) {
      E("Amount must be a positive number");
      return;
    }
    const B = g ? Number(g) : void 0;
    if (g && (!Number.isFinite(B) || B <= 0)) {
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
    const X = An();
    try {
      const se = c === "connect" ? await fetch(Sn(i), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zn({ actionId: u, params: ee, clientRequestId: X }))
      }) : await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": X },
        body: JSON.stringify(ee)
      });
      if (!se.ok) throw new Error(`HTTP ${se.status}`);
      const y = await se.json().catch(() => ({})), k = typeof y.message == "string" ? y.message : "Order submitted", z = typeof y.status == "string" ? y.status : "";
      o({
        type: "action",
        actionId: u,
        clientRequestId: X,
        status: z,
        message: k,
        terminal: ot(z)
      }), sn(y.status) ? (E(k), r(k, "error")) : (x(k), r(k, "ok"), p(""), h(""), Y(!1)), c === "connect" && !ot(y.status) && G({ clientRequestId: X });
    } catch (se) {
      const y = se instanceof Error ? se.message : "Submit failed";
      E(y), r(y, "error"), o({
        type: "action",
        actionId: u,
        clientRequestId: X,
        status: "ACTION_STATUS_FAILED",
        message: y,
        terminal: !0
      });
    } finally {
      R(!1);
    }
  }, [c, i, a, u, _, b, g, l, d, t.confirm, P, r, o]);
  if (j(() => {
    if (!P) return;
    const C = (B) => {
      B.key === "Escape" && Y(!1);
    };
    return document.addEventListener("keydown", C), () => document.removeEventListener("keydown", C);
  }, [P]), !c)
    return /* @__PURE__ */ s(D, { children: "Trade requires backendUrl or options.url" });
  const V = (C) => `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${d === C ? C === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"}`, W = d === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
  if (P) {
    const C = g ? Number(g) : null, B = `${d.toUpperCase()} ${b}${t.quote_unit ? ` ${t.quote_unit}` : ""} ${C ? `@ ${C.toLocaleString()}` : "at market"}`;
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
      on,
      {
        label: "Amount",
        unit: t.quote_unit,
        value: b,
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
      on,
      {
        label: "Price",
        placeholder: "market",
        value: g,
        onChange: h,
        disabled: _
      }
    ),
    /* @__PURE__ */ s(
      "button",
      {
        onClick: I,
        disabled: _ || !b,
        className: `mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${W}`,
        children: _ ? "..." : d === "buy" ? `Buy ${t.quote_unit ?? ""}`.trim() : `Sell ${t.quote_unit ?? ""}`.trim()
      }
    ),
    $ && /* @__PURE__ */ s("div", { className: "text-xs text-emerald-400", children: $ }),
    T && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: T })
  ] });
}
function on({
  label: e,
  unit: t,
  placeholder: n,
  value: r,
  onChange: i,
  disabled: o
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
        onChange: (l) => i(l.target.value),
        disabled: o,
        className: "flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
      }
    ),
    t && /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 shrink-0", children: t })
  ] });
}
const Xo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Trade: Yo
}, Symbol.toStringTag, { value: "Module" })), Zo = {
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
}, Qo = "border-zinc-700 text-zinc-300";
function el({ data: e, options: t }) {
  const n = L(() => tl(e), [e]);
  if (!n || n.length === 0)
    return /* @__PURE__ */ s(D, { children: "No items" });
  const i = Math.max(5, (t ?? {}).speed_seconds ?? 30);
  return /* @__PURE__ */ s("div", { className: "h-full overflow-hidden flex items-center group", children: /* @__PURE__ */ f(
    "div",
    {
      className: "flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]",
      style: { animationDuration: `${i}s` },
      children: [
        n.map((o, l) => /* @__PURE__ */ s(ln, { item: o }, `a-${l}`)),
        n.map((o, l) => /* @__PURE__ */ s(ln, { item: o, "aria-hidden": !0 }, `b-${l}`))
      ]
    }
  ) });
}
function ln({ item: e, ...t }) {
  const n = Zo[e.status ?? ""] ?? Qo;
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
function tl(e) {
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
const nl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Ticker: el
}, Symbol.toStringTag, { value: "Module" }));
function rl({ data: e }) {
  const t = L(() => sl(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const n = Math.max(...t.map((r) => r.volume), 1);
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto", children: /* @__PURE__ */ s("div", { className: "flex flex-col gap-px font-mono text-[10px]", children: t.map((r, i) => {
    const o = r.volume / n * 100;
    return /* @__PURE__ */ f("div", { className: "relative flex items-center px-2 py-0.5", title: `${r.price} — ${r.volume.toLocaleString()}`, children: [
      /* @__PURE__ */ s(
        "div",
        {
          className: "absolute inset-y-0.5 left-16 bg-sky-500/20 rounded-sm",
          style: { width: `${o}%`, maxWidth: "calc(100% - 4.5rem)" }
        }
      ),
      /* @__PURE__ */ s("span", { className: "relative w-14 shrink-0 text-zinc-300 tabular-nums", children: il(r.price) }),
      /* @__PURE__ */ s("span", { className: "relative ml-auto text-zinc-400 tabular-nums", children: ol(r.volume) })
    ] }, i);
  }) }) });
}
function sl(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.rows) ? t = r.rows : Array.isArray(r.levels) && (t = r.levels);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const i = r;
    return { price: Number(i.price ?? 0), volume: Number(i.volume ?? i.size ?? 0) };
  }).filter((r) => Number.isFinite(r.price) && Number.isFinite(r.volume) && r.volume > 0);
  return n.length === 0 ? null : (n.sort((r, i) => i.price - r.price), n);
}
function il(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
}
function ol(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(0);
}
const ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VolumeProfile: rl
}, Symbol.toStringTag, { value: "Module" }));
function al({ data: e }) {
  const t = L(() => dl(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s("div", { className: "h-full overflow-x-auto overflow-y-hidden", children: /* @__PURE__ */ s("div", { className: "flex items-stretch gap-3 h-full", children: t.map((n, r) => /* @__PURE__ */ s(cl, { stat: n }, r)) }) });
}
function cl({ stat: e }) {
  const t = Xn(e.value), n = e.delta == null ? "" : e.delta >= 0 ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ f("div", { className: "shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0", children: [
    /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate", children: e.label }),
    /* @__PURE__ */ f("div", { className: "flex items-baseline gap-1", children: [
      /* @__PURE__ */ s("span", { className: "text-base font-semibold text-zinc-100 tabular-nums truncate", children: qn(t) }),
      e.unit && /* @__PURE__ */ s("span", { className: "text-[10px] text-zinc-500 shrink-0", children: e.unit })
    ] }),
    /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
      e.delta != null && /* @__PURE__ */ f("span", { className: `text-[10px] font-medium tabular-nums ${n}`, children: [
        e.delta >= 0 ? "▲" : "▼",
        " ",
        fl(e.delta)
      ] }),
      e.trend && e.trend.length >= 2 && /* @__PURE__ */ s(ul, { values: e.trend })
    ] })
  ] });
}
function ul({ values: e }) {
  const t = Math.min(...e), r = Math.max(...e) - t || 1, i = e[e.length - 1] >= e[0], o = e.map((l, a) => {
    const u = a / (e.length - 1) * 100, c = 18 - (l - t) / r * 16 - 1;
    return `${u.toFixed(1)},${c.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 100 18", className: "w-12 h-3.5", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: i ? "#10b981" : "#ef4444",
      strokeWidth: "1.5",
      points: o,
      vectorEffect: "non-scaling-stroke"
    }
  ) });
}
function dl(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.stats) ? t = r.stats : Array.isArray(r.metrics) && (t = r.metrics);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const i = r;
    return {
      label: String(i.label ?? ""),
      value: Number(i.value ?? 0),
      delta: typeof i.delta == "number" ? i.delta : void 0,
      unit: i.unit != null ? String(i.unit) : void 0,
      trend: Array.isArray(i.trend) && i.trend.every((o) => typeof o == "number") ? i.trend : void 0
    };
  }).filter((r) => Number.isFinite(r.value));
  return n.length > 0 ? n : null;
}
function fl(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const ml = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StatStrip: al
}, Symbol.toStringTag, { value: "Module" }));
function pl(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const o = e;
    Array.isArray(o.bars) ? t = o.bars : Array.isArray(o.rows) && (t = o.rows);
  }
  if (!t) return null;
  const n = t.filter(
    (o) => o != null && typeof o == "object"
  );
  if (n.length === 0) return null;
  if (n.every((o) => "value" in o)) {
    const o = n.map((l) => ({
      label: String(l.label ?? l.name ?? ""),
      value: Number(l.value ?? 0),
      color: l.color != null ? String(l.color) : void 0
    })).filter((l) => Number.isFinite(l.value));
    return o.length > 0 ? { kind: "single", bars: o } : null;
  }
  const r = [];
  for (const o of n)
    for (const [l, a] of Object.entries(o))
      l === "label" || l === "name" || l === "color" || typeof a == "number" && Number.isFinite(a) && !r.includes(l) && r.push(l);
  return r.length === 0 ? null : { kind: "grouped", rows: n.map((o) => ({
    ...o,
    label: String(o.label ?? o.name ?? "")
  })), series: r };
}
function hl({ data: e }) {
  const t = L(() => pl(e), [e]);
  if (!t)
    return /* @__PURE__ */ s(D, { children: "No data" });
  if (t.kind === "grouped") {
    const r = Vn(t.series, fe);
    return /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Nt, { data: t.rows, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
      /* @__PURE__ */ s(Ue, { strokeDasharray: "3 3", stroke: "#27272a" }),
      /* @__PURE__ */ s(
        Be,
        {
          dataKey: "label",
          stroke: "#3f3f46",
          tick: { fontSize: 11, fill: "#a1a1aa" },
          interval: 0
        }
      ),
      /* @__PURE__ */ s(
        Ke,
        {
          stroke: "#3f3f46",
          tick: { fontSize: 11, fill: "#a1a1aa" },
          tickFormatter: an,
          width: 50
        }
      ),
      /* @__PURE__ */ s(
        ze,
        {
          contentStyle: Ae,
          cursor: { fill: "rgba(82, 82, 91, 0.2)" }
        }
      ),
      /* @__PURE__ */ s(yn, { wrapperStyle: { fontSize: 11 } }),
      t.series.map((i, o) => /* @__PURE__ */ s(
        St,
        {
          dataKey: i,
          fill: r[o],
          radius: [2, 2, 0, 0]
        },
        i
      ))
    ] }) });
  }
  const n = t.bars;
  return /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Nt, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(Ue, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Be,
      {
        dataKey: "label",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        interval: 0
      }
    ),
    /* @__PURE__ */ s(
      Ke,
      {
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        tickFormatter: an,
        width: 50
      }
    ),
    /* @__PURE__ */ s(
      ze,
      {
        contentStyle: Ae,
        cursor: { fill: "rgba(82, 82, 91, 0.2)" }
      }
    ),
    /* @__PURE__ */ s(St, { dataKey: "value", radius: [2, 2, 0, 0], children: n.map((r, i) => /* @__PURE__ */ s(xn, { fill: bl(r) }, i)) })
  ] }) });
}
function bl(e) {
  return e.color && Ee[e.color] ? Ee[e.color] : e.color && e.color.startsWith("#") ? e.color : e.value < 0 ? "#ef4444" : "#38bdf8";
}
function an(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 1);
}
const gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BarChart: hl
}, Symbol.toStringTag, { value: "Module" }));
function xl({ data: e }) {
  const t = L(() => yl(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const n = t.some((r) => r.size != null);
  return /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(mr, { margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(Ue, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Be,
      {
        type: "number",
        dataKey: "x",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" }
      }
    ),
    /* @__PURE__ */ s(
      Ke,
      {
        type: "number",
        dataKey: "y",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        width: 50
      }
    ),
    n && /* @__PURE__ */ s(pr, { type: "number", dataKey: "size", range: [40, 280] }),
    /* @__PURE__ */ s(
      ze,
      {
        cursor: { strokeDasharray: "3 3", stroke: "#52525b" },
        contentStyle: Ae
      }
    ),
    /* @__PURE__ */ s(
      hr,
      {
        data: t,
        fill: "#0ea5e9",
        shape: (r) => {
          const { cx: i, cy: o, payload: l } = r;
          if (i == null || o == null || !l) return /* @__PURE__ */ s("circle", { cx: 0, cy: 0, r: 0 });
          const a = vl(l), c = l.size != null ? Math.min(20, Math.max(3, Math.sqrt(l.size) * 2)) : 5;
          return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("circle", { cx: i, cy: o, r: c, fill: a, fillOpacity: 0.7, stroke: a, strokeWidth: 1, children: l.label && /* @__PURE__ */ s("title", { children: l.label }) }) });
        }
      }
    )
  ] }) });
}
function yl(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.points) && (t = r.points);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const i = r;
    return {
      x: Number(i.x ?? 0),
      y: Number(i.y ?? 0),
      label: i.label != null ? String(i.label) : void 0,
      size: typeof i.size == "number" ? i.size : void 0,
      color: i.color != null ? String(i.color) : void 0
    };
  }).filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
  return n.length > 0 ? n : null;
}
function vl(e) {
  return e.color && Ee[e.color] ? Ee[e.color] : e.color && e.color.startsWith("#") ? e.color : "#0ea5e9";
}
const wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Scatter: xl
}, Symbol.toStringTag, { value: "Module" })), kl = ["America/New_York", "Europe/London", "Asia/Singapore"];
function Nl({ options: e }) {
  const t = e ?? {}, n = t.zones?.length ? t.zones : kl, r = t.format === "12h", [i, o] = v(() => /* @__PURE__ */ new Date());
  return j(() => {
    const l = setInterval(() => o(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(l);
  }, []), /* @__PURE__ */ s("div", { className: "h-full flex items-center justify-around gap-3", children: n.map((l) => {
    const a = Al(i, l, r), u = _l(i, l), c = zl(l), d = Tl(l, i);
    return /* @__PURE__ */ f("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ f("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5", children: [
        /* @__PURE__ */ s("span", { children: c }),
        /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full ${d}` })
      ] }),
      /* @__PURE__ */ s("div", { className: "text-base font-semibold text-zinc-100 tabular-nums", children: a }),
      /* @__PURE__ */ s("div", { className: "text-[10px] text-zinc-600 tabular-nums", children: u })
    ] }, l);
  }) });
}
const Sl = {
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
function zl(e) {
  return Sl[e] ?? e.split("/").pop() ?? e;
}
function Al(e, t, n) {
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
function _l(e, t) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: t, timeZoneName: "shortOffset" }).formatToParts(e).find((o) => o.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}
function Tl(e, t) {
  try {
    const n = new Intl.DateTimeFormat("en-US", { timeZone: e, hour: "2-digit", hour12: !1 }).format(t), r = Number(n);
    return Number.isFinite(r) ? r >= 9 && r < 17 ? "bg-emerald-500" : r === 8 || r === 17 ? "bg-amber-500" : "bg-zinc-700" : "bg-zinc-700";
  } catch {
    return "bg-zinc-700";
  }
}
const Cl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Clock: Nl
}, Symbol.toStringTag, { value: "Module" }));
function $l({ data: e }) {
  const t = L(() => Ol(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ s(
    br,
    {
      data: t,
      dataKey: "value",
      nameKey: "name",
      stroke: "#18181b",
      isAnimationActive: !1,
      content: /* @__PURE__ */ s(El, {}),
      children: /* @__PURE__ */ s(
        ze,
        {
          contentStyle: Ae,
          formatter: (n) => [String(n), ""]
        }
      )
    }
  ) });
}
function El(e) {
  const { x: t = 0, y: n = 0, width: r = 0, height: i = 0, index: o = 0, name: l, payload: a } = e, u = Ml(a, o), c = r > 60 && i > 24;
  return /* @__PURE__ */ f("g", { children: [
    /* @__PURE__ */ s("rect", { x: t, y: n, width: r, height: i, fill: u, fillOpacity: 0.85, stroke: "#18181b", strokeWidth: 2 }),
    c && l && /* @__PURE__ */ s("text", { x: t + 6, y: n + 16, fill: "#fafafa", fontSize: 11, style: { pointerEvents: "none" }, children: l })
  ] });
}
function Ml(e, t) {
  return e ? e.color && Ee[e.color] ? Ee[e.color] : e.color && e.color.startsWith("#") ? e.color : fe[t % fe.length] : fe[t % fe.length];
}
function Ol(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const i = e;
    Array.isArray(i.slices) ? t = i.slices : Array.isArray(i.nodes) && (t = i.nodes);
  }
  if (!t) return null;
  const n = (i) => {
    if (!i || typeof i != "object") return null;
    const o = i, l = String(o.label ?? o.name ?? ""), a = typeof o.value == "number" ? o.value : void 0, u = o.color != null ? String(o.color) : void 0, c = Array.isArray(o.children) ? o.children : Array.isArray(o.slices) ? o.slices : null, d = c ? c.map(n).filter((m) => m != null) : void 0;
    return !d && (!Number.isFinite(a) || (a ?? 0) <= 0) ? null : { name: l, value: a, color: u, children: d };
  }, r = t.map(n).filter((i) => i != null);
  return r.length > 0 ? r : null;
}
const jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Treemap: $l
}, Symbol.toStringTag, { value: "Module" }));
function Rl({ data: e }) {
  const { url: t, alt: n } = Pl(e);
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
function Pl(e) {
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
const Ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Image: Rl
}, Symbol.toStringTag, { value: "Module" })), Il = "allow-scripts allow-same-origin";
function Dl({ data: e, options: t }) {
  const { url: n, title: r, sandbox: i } = Fl(e, t);
  return n ? /* @__PURE__ */ s(
    "iframe",
    {
      src: n,
      title: r,
      sandbox: i,
      loading: "lazy",
      className: "w-full h-full border-0 rounded"
    }
  ) : /* @__PURE__ */ s(D, { children: "No URL" });
}
function Fl(e, t) {
  let n, r = "embed", i = Il;
  if (typeof e == "string")
    n = e;
  else if (e && typeof e == "object") {
    const o = e;
    typeof o.url == "string" && (n = o.url), typeof o.label == "string" ? r = o.label : typeof o.title == "string" && (r = o.title), typeof o.sandbox == "string" && (i = o.sandbox);
  }
  return t && (typeof t.url == "string" && !n && (n = t.url), typeof t.title == "string" && r === "embed" && (r = t.title), typeof t.sandbox == "string" && (i = t.sandbox)), { url: n, title: r, sandbox: i };
}
const Ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Iframe: Dl
}, Symbol.toStringTag, { value: "Module" })), Bl = 20;
function Kl({ data: e, options: t }) {
  const n = L(() => Hl(e, t), [e, t]);
  return !n || n.length === 0 ? /* @__PURE__ */ s(D, { children: "No data" }) : /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Nt, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(Ue, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Be,
      {
        dataKey: "bin",
        stroke: "#3f3f46",
        tick: { fontSize: 10, fill: "#a1a1aa" },
        interval: "preserveStartEnd"
      }
    ),
    /* @__PURE__ */ s(
      Ke,
      {
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        allowDecimals: !1,
        width: 40
      }
    ),
    /* @__PURE__ */ s(
      ze,
      {
        contentStyle: Ae,
        cursor: { fill: "rgba(82, 82, 91, 0.2)" }
      }
    ),
    /* @__PURE__ */ s(St, { dataKey: "count", fill: "#0ea5e9", radius: [2, 2, 0, 0] })
  ] }) });
}
function Hl(e, t) {
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null && "count" in e[0])
    return e.map((o) => {
      const l = o, a = typeof l.rangeStart == "number" ? l.rangeStart : 0, u = typeof l.rangeEnd == "number" ? l.rangeEnd : 0;
      return {
        bin: String(l.bin ?? ""),
        count: Number(l.count ?? 0),
        rangeStart: a,
        rangeEnd: u
      };
    }).filter((o) => Number.isFinite(o.count));
  let n = null, r = Bl;
  if (Array.isArray(e) && e.every((i) => typeof i == "number"))
    n = e;
  else if (e && typeof e == "object") {
    const i = e;
    Array.isArray(i.values) && i.values.every((o) => typeof o == "number") && (n = i.values), typeof i.bins == "number" && (r = i.bins);
  }
  return typeof t?.bins == "number" && (r = t.bins), !n || (n = n.filter((i) => Number.isFinite(i)), n.length === 0) ? null : Wl(n, r);
}
function Wl(e, t) {
  const n = Math.min(...e), r = Math.max(...e);
  if (n === r) return [{ bin: He(n), count: e.length, rangeStart: n, rangeEnd: r }];
  const i = (r - n) / t, o = Array.from({ length: t }, (l, a) => {
    const u = n + a * i, c = a === t - 1 ? r : u + i;
    return { bin: He((u + c) / 2), count: 0, rangeStart: u, rangeEnd: c };
  });
  for (const l of e) {
    let a = Math.floor((l - n) / i);
    a >= t && (a = t - 1), o[a].count += 1;
  }
  return o;
}
const ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Histogram: Kl
}, Symbol.toStringTag, { value: "Module" }));
function Vl({ options: e }) {
  const t = typeof e?.label == "string" ? e.label : "";
  return /* @__PURE__ */ f("div", { className: "h-full flex items-center gap-3 px-1", children: [
    t && /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0", children: t }),
    /* @__PURE__ */ s("div", { className: "flex-1 h-px bg-zinc-800" })
  ] });
}
const Gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Section: Vl
}, Symbol.toStringTag, { value: "Module" })), nt = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], Jl = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function Yl({ data: e, options: t }) {
  const n = L(() => Zl(e), [e]), r = t?.brush === !0;
  if (!n) return /* @__PURE__ */ s(D, { children: "No data" });
  const i = n.keys.length > 1;
  return /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(gr, { data: n.points, children: [
    /* @__PURE__ */ s(Ue, { strokeDasharray: "3 3", stroke: "#27272a" }),
    /* @__PURE__ */ s(
      Be,
      {
        dataKey: "_ts",
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        tickFormatter: je
      }
    ),
    /* @__PURE__ */ s(
      Ke,
      {
        stroke: "#3f3f46",
        tick: { fontSize: 11, fill: "#a1a1aa" },
        tickFormatter: Wn,
        width: 50
      }
    ),
    /* @__PURE__ */ s(
      ze,
      {
        contentStyle: Ae,
        labelStyle: { color: "#a1a1aa" },
        labelFormatter: je
      }
    ),
    n.keys.map((o, l) => /* @__PURE__ */ s(
      xr,
      {
        type: "monotone",
        dataKey: o,
        stroke: nt[l % nt.length],
        fill: nt[l % nt.length],
        fillOpacity: 0.35,
        strokeWidth: 1.5,
        stackId: i ? "stack" : void 0
      },
      o
    )),
    r && n.points.length > 4 && /* @__PURE__ */ s(
      gn,
      {
        dataKey: "_ts",
        height: 20,
        stroke: "#3f3f46",
        fill: "#18181b",
        travellerWidth: 6,
        tickFormatter: je
      }
    )
  ] }) });
}
function Xl(e) {
  for (const t of Jl) if (t in e) return t;
  return null;
}
function Zl(e) {
  if (!e) return null;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const t = e[0], n = Xl(t);
    if (!n) return null;
    const r = Object.keys(t).filter((o) => o !== n && typeof t[o] == "number");
    return r.length === 0 ? null : { points: e.map((o) => {
      const l = o, a = { _ts: l[n] };
      for (const u of r) a[u] = l[u];
      return a;
    }), keys: r };
  }
  if (typeof e == "object" && e !== null && "series" in e) {
    const t = e.series;
    if (!Array.isArray(t)) return null;
    const n = /* @__PURE__ */ new Map(), r = [];
    for (const i of t) {
      const o = i, l = String(o.name || o.label || `s${r.length}`);
      r.push(l);
      const a = o.data ?? o.points;
      if (Array.isArray(a))
        for (const u of a) {
          const c = String(u.timestamp ?? u.date ?? u.time ?? u.x ?? "");
          n.has(c) || n.set(c, { _ts: c }), n.get(c)[l] = u.value ?? u.y ?? u.v;
        }
    }
    return { points: Array.from(n.values()), keys: r };
  }
  return null;
}
const Ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AreaChart: Yl
}, Symbol.toStringTag, { value: "Module" })), ea = 100;
function ta({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae(), i = t.min ?? 0, o = t.max ?? 100, l = t.step ?? 1, a = t.label ?? t.key ?? "value", u = (() => {
    if (t.key && n[t.key] != null) {
      const p = Number(n[t.key]);
      if (Number.isFinite(p)) return p;
    }
    return t.default != null ? t.default : i;
  })(), [c, d] = v(u), m = F(null);
  if (j(() => {
    if (!t.key) return;
    const p = n[t.key];
    if (p == null) return;
    const g = Number(p);
    Number.isFinite(g) && g !== c && d(g);
  }, [t.key, n[t.key ?? ""]]), !t.key)
    return /* @__PURE__ */ s(D, { children: "Slider requires options.key" });
  const b = (p) => {
    d(p), m.current && clearTimeout(m.current), m.current = setTimeout(() => {
      r(t.key, String(p));
    }, ea);
  };
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ f("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: a }),
      /* @__PURE__ */ f("span", { className: "text-sm font-semibold text-zinc-100 tabular-nums", children: [
        xt(c, l),
        t.unit && /* @__PURE__ */ s("span", { className: "text-zinc-500 ml-1", children: t.unit })
      ] })
    ] }),
    /* @__PURE__ */ s(
      "input",
      {
        type: "range",
        min: i,
        max: o,
        step: l,
        value: c,
        onChange: (p) => b(Number(p.target.value)),
        className: "w-full accent-sky-500"
      }
    ),
    /* @__PURE__ */ f("div", { className: "flex justify-between text-[10px] text-zinc-600 tabular-nums", children: [
      /* @__PURE__ */ s("span", { children: xt(i, l) }),
      /* @__PURE__ */ s("span", { children: xt(o, l) })
    ] })
  ] });
}
function xt(e, t) {
  const n = t >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(t)));
  return e.toFixed(n);
}
const na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Slider: ta
}, Symbol.toStringTag, { value: "Module" }));
function ra(e, t, n) {
  if (e !== void 0 && e !== "")
    return { current: e, shouldSync: !1 };
  const r = t || n[0]?.value || "";
  return { current: r, shouldSync: r !== "" };
}
function sa({ data: e, options: t }) {
  const n = t ?? {}, { ctx: r, setCtx: i } = ae(), o = n.key, l = ia(e, n), a = o ? r[o] : void 0, { current: u, shouldSync: c } = ra(a, n.default, l);
  return j(() => {
    o && c && i(o, u);
  }, [o, c, u, i]), o ? l.length === 0 ? /* @__PURE__ */ s(D, { children: "Select has no choices" }) : /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-1.5 px-2", children: [
    /* @__PURE__ */ s("label", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: n.label ?? n.key }),
    /* @__PURE__ */ s(
      "select",
      {
        value: u,
        onChange: (d) => i(n.key, d.target.value),
        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500",
        children: l.map((d) => /* @__PURE__ */ s("option", { value: d.value, children: d.label }, d.value))
      }
    )
  ] }) : /* @__PURE__ */ s(D, { children: "Select requires options.key" });
}
function ia(e, t) {
  const n = oa(e);
  if (n.length > 0) {
    const r = t.value_field ?? "value", i = t.label_field ?? "label";
    return n.map((o) => {
      if (typeof o == "string") return { value: o, label: o };
      if (o && typeof o == "object") {
        const l = o, a = l[r];
        if (typeof a == "string") {
          const u = l[i];
          return { value: a, label: typeof u == "string" ? u : a };
        }
      }
      return null;
    }).filter((o) => o !== null);
  }
  return (t.choices ?? []).map(
    (r) => typeof r == "string" ? { value: r, label: r } : { value: r.value, label: r.label ?? r.value }
  );
}
function oa(e) {
  if (Array.isArray(e)) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (Array.isArray(t.rows)) return t.rows;
    if (Array.isArray(t.entries)) return t.entries;
  }
  return [];
}
const la = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Select: sa
}, Symbol.toStringTag, { value: "Module" })), ke = { top: 12, right: 12, bottom: 28, left: 44 }, cn = ["#0ea5e9", "#10b981", "#a78bfa", "#f59e0b", "#f472b6", "#fbbf24"];
function aa({ data: e }) {
  const t = L(() => ua(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const n = t.flatMap((c) => [c.min, c.max, ...c.outliers]), r = Math.min(...n), i = Math.max(...n), o = (i - r) * 0.05 || 1, l = r - o, a = i + o, u = Array.from({ length: 5 }, (c, d) => l + (a - l) * d / 4);
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 600 320", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    ca,
    {
      boxes: t,
      yMin: l,
      yMax: a,
      ticks: u,
      width: 600,
      height: 320
    }
  ) });
}
function ca({
  boxes: e,
  yMin: t,
  yMax: n,
  ticks: r,
  width: i,
  height: o
}) {
  const l = i - ke.left - ke.right, a = o - ke.top - ke.bottom, u = l / e.length, c = Math.min(u * 0.5, 60), d = (m) => ke.top + (1 - (m - t) / (n - t)) * a;
  return /* @__PURE__ */ f("g", { children: [
    r.map((m, b) => {
      const p = d(m);
      return /* @__PURE__ */ f("g", { children: [
        /* @__PURE__ */ s("line", { x1: ke.left, x2: ke.left + l, y1: p, y2: p, stroke: "#27272a", strokeDasharray: "3 3" }),
        /* @__PURE__ */ s("text", { x: ke.left - 6, y: p + 3, textAnchor: "end", fontSize: 10, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: He(m) })
      ] }, `g-${b}`);
    }),
    e.map((m, b) => {
      const p = ke.left + u * b + u / 2, g = p - c / 2, h = cn[b % cn.length], w = d(m.min), A = d(m.max), _ = d(m.q1), R = d(m.q3), $ = d(m.median);
      return /* @__PURE__ */ f("g", { children: [
        /* @__PURE__ */ s("line", { x1: p, x2: p, y1: w, y2: A, stroke: h, strokeOpacity: 0.6 }),
        /* @__PURE__ */ s("line", { x1: p - c / 4, x2: p + c / 4, y1: w, y2: w, stroke: h, strokeOpacity: 0.8 }),
        /* @__PURE__ */ s("line", { x1: p - c / 4, x2: p + c / 4, y1: A, y2: A, stroke: h, strokeOpacity: 0.8 }),
        /* @__PURE__ */ s("rect", { x: g, y: R, width: c, height: Math.max(1, _ - R), fill: h, fillOpacity: 0.25, stroke: h, strokeWidth: 1.5 }),
        /* @__PURE__ */ s("line", { x1: g, x2: g + c, y1: $, y2: $, stroke: h, strokeWidth: 2 }),
        m.outliers.map((x, T) => /* @__PURE__ */ s("circle", { cx: p, cy: d(x), r: 2.5, fill: h, fillOpacity: 0.7 }, T)),
        /* @__PURE__ */ s("text", { x: p, y: o - 8, textAnchor: "middle", fontSize: 11, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: m.label })
      ] }, b);
    })
  ] });
}
function ua(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const t = e.map((n) => {
    if (!n || typeof n != "object") return null;
    const r = n, i = String(r.label ?? "");
    if (typeof r.median == "number")
      return {
        label: i,
        min: Number(r.min ?? r.median),
        q1: Number(r.q1 ?? r.median),
        median: Number(r.median),
        q3: Number(r.q3 ?? r.median),
        max: Number(r.max ?? r.median),
        outliers: Array.isArray(r.outliers) ? r.outliers.filter((o) => typeof o == "number") : []
      };
    if (Array.isArray(r.values)) {
      const o = r.values.filter((l) => typeof l == "number" && Number.isFinite(l));
      return o.length === 0 ? null : da(i, o);
    }
    return null;
  }).filter((n) => n != null);
  return t.length > 0 ? t : null;
}
function da(e, t) {
  const n = [...t].sort((p, g) => p - g), r = (p) => {
    const g = (n.length - 1) * p, h = Math.floor(g), w = Math.ceil(g);
    return h === w ? n[h] : n[h] + (n[w] - n[h]) * (g - h);
  }, i = r(0.25), o = r(0.5), l = r(0.75), a = l - i, u = i - 1.5 * a, c = l + 1.5 * a, d = [];
  let m = 1 / 0, b = -1 / 0;
  for (const p of n)
    p < u || p > c ? d.push(p) : (p < m && (m = p), p > b && (b = p));
  return Number.isFinite(m) || (m = n[0]), Number.isFinite(b) || (b = n[n.length - 1]), { label: e, min: m, q1: i, median: o, q3: l, max: b, outliers: d };
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Boxplot: aa
}, Symbol.toStringTag, { value: "Module" }));
function ma({ data: e }) {
  const t = L(() => pa(e), [e]);
  return t ? /* @__PURE__ */ s(Se, { width: "100%", height: "100%", children: /* @__PURE__ */ f(yr, { data: t.rows, outerRadius: "75%", children: [
    /* @__PURE__ */ s(vr, { stroke: "#27272a" }),
    /* @__PURE__ */ s(wr, { dataKey: "metric", stroke: "#3f3f46", tick: { fontSize: 11, fill: "#a1a1aa" } }),
    /* @__PURE__ */ s(kr, { stroke: "#3f3f46", tick: { fontSize: 9, fill: "#52525b" } }),
    /* @__PURE__ */ s(ze, { contentStyle: Ae }),
    t.series.length > 1 && /* @__PURE__ */ s(yn, { wrapperStyle: { fontSize: 11, color: "#a1a1aa" } }),
    t.series.map((n, r) => /* @__PURE__ */ s(
      Nr,
      {
        name: n,
        dataKey: n,
        stroke: fe[r % fe.length],
        fill: fe[r % fe.length],
        fillOpacity: 0.25,
        strokeWidth: 1.5
      },
      n
    ))
  ] }) }) : /* @__PURE__ */ s(D, { children: "No data" });
}
function pa(e) {
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
    const i = r.map((l) => String(l.name ?? "")).filter(Boolean);
    return { rows: n.map((l, a) => {
      const u = { metric: l };
      for (const c of r) {
        const d = c, m = String(d.name ?? ""), b = d.values;
        Array.isArray(b) && typeof b[a] == "number" && (u[m] = b[a]);
      }
      return u;
    }), series: i };
  }
  return null;
}
const ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Radar: ma
}, Symbol.toStringTag, { value: "Module" })), ba = {
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
}, un = "#52525b", Me = 130, Ge = 44, dn = 80, yt = 18, vt = 16;
function ga({ data: e }) {
  const t = L(() => va(ya(e)), [e]);
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
          const r = n.status ? ba[n.status] ?? un : un;
          return /* @__PURE__ */ f("g", { children: [
            /* @__PURE__ */ s(
              "rect",
              {
                x: n.x,
                y: n.y,
                width: Me,
                height: Ge,
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
                x: n.x + Me / 2,
                y: n.y + Ge / 2 + 4,
                textAnchor: "middle",
                fontSize: 11,
                fill: "#fafafa",
                fontFamily: "ui-sans-serif",
                children: xa(n.label, 18)
              }
            ),
            /* @__PURE__ */ s("circle", { cx: n.x + 8, cy: n.y + 8, r: 3, fill: r })
          ] }, n.id);
        })
      ]
    }
  ) }) : /* @__PURE__ */ s(D, { children: "No data" });
}
function xa(e, t) {
  return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function ya(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = Array.isArray(t.nodes) ? t.nodes : null, r = Array.isArray(t.edges) ? t.edges : [];
  if (!n) return null;
  const i = n.map((l) => {
    const a = l;
    return {
      id: String(a.id ?? ""),
      label: String(a.label ?? a.id ?? ""),
      status: a.status != null ? String(a.status) : void 0
    };
  }).filter((l) => l.id), o = r.map((l) => {
    const a = l;
    return { from: String(a.from ?? ""), to: String(a.to ?? "") };
  }).filter((l) => l.from && l.to);
  return { nodes: i, edges: o };
}
function va(e) {
  if (!e || e.nodes.length === 0) return null;
  const { nodes: t, edges: n } = e, r = /* @__PURE__ */ new Map();
  for (const h of t) r.set(h.id, []);
  for (const h of n) r.get(h.to)?.push(h.from);
  const i = /* @__PURE__ */ new Map();
  for (const h of t) i.set(h.id, 0);
  let o = !0, l = 0;
  for (; o && l++ < t.length + 1; ) {
    o = !1;
    for (const h of n) {
      const w = (i.get(h.from) ?? 0) + 1;
      (i.get(h.to) ?? 0) < w && (i.set(h.to, w), o = !0);
    }
  }
  const a = /* @__PURE__ */ new Map();
  for (const h of t) {
    const w = i.get(h.id) ?? 0;
    a.has(w) || a.set(w, []), a.get(w).push(h.id);
  }
  const u = Math.max(0, ...i.values()), c = Math.max(...Array.from(a.values(), (h) => h.length)), d = vt * 2 + c * Me + (c - 1) * yt, m = vt * 2 + (u + 1) * Ge + u * (dn - Ge), b = /* @__PURE__ */ new Map();
  for (const [h, w] of a) {
    const A = w.length * Me + (w.length - 1) * yt, _ = (d - A) / 2;
    w.forEach((R, $) => {
      b.set(R, {
        x: _ + $ * (Me + yt),
        y: vt + h * dn
      });
    });
  }
  const p = t.map((h) => ({ ...h, ...b.get(h.id) })), g = n.map((h) => {
    const w = b.get(h.from), A = b.get(h.to);
    return !w || !A ? null : {
      x1: w.x + Me / 2,
      y1: w.y + Ge,
      x2: A.x + Me / 2,
      y2: A.y
    };
  }).filter((h) => h != null);
  return { nodes: p, edges: g, width: d, height: m };
}
const wa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Dag: ga
}, Symbol.toStringTag, { value: "Module" }));
function ka({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae();
  if (!t.key)
    return /* @__PURE__ */ s(D, { children: "MultiSelect requires options.key" });
  const i = t.choices ?? [];
  if (i.length === 0)
    return /* @__PURE__ */ s(D, { children: "MultiSelect requires options.choices" });
  const o = i.map(
    (c) => typeof c == "string" ? { value: c, label: c } : { value: c.value, label: c.label ?? c.value }
  ), l = n[t.key] != null ? n[t.key].split(",").map((c) => c.trim()).filter(Boolean) : t.default ?? [], a = new Set(l), u = (c) => {
    a.has(c) ? a.delete(c) : a.add(c), r(t.key, Array.from(a).join(","));
  };
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ f("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: t.label ?? t.key }),
      /* @__PURE__ */ f("span", { className: "text-[10px] text-zinc-600", children: [
        a.size,
        " / ",
        o.length
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "flex flex-wrap gap-1", children: o.map((c) => {
      const d = a.has(c.value);
      return /* @__PURE__ */ s(
        "button",
        {
          onClick: () => u(c.value),
          className: `px-2 py-0.5 text-xs rounded border ${d ? "bg-sky-500/20 border-sky-500/40 text-sky-200" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"}`,
          children: c.label
        },
        c.value
      );
    }) })
  ] });
}
const Na = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultiSelect: ka
}, Symbol.toStringTag, { value: "Module" }));
function Sa({ data: e }) {
  const t = L(() => {
    if (e == null) return "";
    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return String(e);
    }
  }, [e]);
  return t ? /* @__PURE__ */ s("pre", { className: "text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed", children: za(t) }) : /* @__PURE__ */ s(D, { children: "No data" });
}
function za(e) {
  const t = [], n = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let r = 0, i;
  for (; (i = n.exec(e)) != null; )
    i.index > r && t.push({ text: e.slice(r, i.index) }), i[1] ? (t.push({ text: i[1], color: i[2] ? "#a1a1aa" : "#34d399" }), i[2] && t.push({ text: i[2] })) : i[3] ? t.push({ text: i[3], color: "#fbbf24" }) : i[4] && t.push({ text: i[4], color: "#0ea5e9" }), r = n.lastIndex;
  return r < e.length && t.push({ text: e.slice(r) }), t.map(
    (o, l) => o.color ? /* @__PURE__ */ s("span", { style: { color: o.color }, children: o.text }, l) : o.text
  );
}
const Aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Json: Sa
}, Symbol.toStringTag, { value: "Module" }));
function _a({ data: e, options: t }) {
  const n = t ?? {}, r = L(() => Ta(e), [e]);
  if (!r || r.length < 2)
    return /* @__PURE__ */ s(D, { children: "No data" });
  const i = Math.min(...r), l = Math.max(...r) - i || 1, a = r[r.length - 1] >= r[0], u = n.color ?? (a ? "#10b981" : "#ef4444"), c = r.map((d, m) => {
    const b = m / (r.length - 1) * 100, p = 22 - (d - i) / l * 20 - 1;
    return `${b.toFixed(1)},${p.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ s("svg", { viewBox: "0 0 100 24", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    "polyline",
    {
      fill: "none",
      stroke: u,
      strokeWidth: "1.5",
      points: c,
      vectorEffect: "non-scaling-stroke"
    }
  ) }) });
}
function Ta(e) {
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
const Ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Sparkline: _a
}, Symbol.toStringTag, { value: "Module" })), $a = {
  ACTION_STATUS_OK: { dot: "bg-emerald-400", text: "text-emerald-300" },
  ACTION_STATUS_ACCEPTED: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_PENDING: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_REJECTED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_FAILED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_CANCELLED: { dot: "bg-zinc-400", text: "text-zinc-300" }
}, Ea = { dot: "bg-zinc-500", text: "text-zinc-400" };
function Ma(e) {
  return e.replace(/^ACTION_STATUS_/, "").toLowerCase();
}
function Oa(e) {
  return e ? e.length <= 8 ? e : e.slice(0, 6) + "…" : "";
}
function ja(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Ra({ options: e }) {
  const { recentActions: t, clearRecentActions: n } = ae(), r = e?.limit || 25, i = dt(t.length > 0), o = t.slice(0, r);
  return o.length === 0 ? /* @__PURE__ */ s(D, { children: "No actions yet" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
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
    /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto min-h-0", children: o.map((l, a) => {
      const u = $a[l.status] ?? Ea;
      return /* @__PURE__ */ f(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.message ?? "",
          children: [
            /* @__PURE__ */ s("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: ja(i, l.receivedAt) }),
            /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${u.dot}` }),
            /* @__PURE__ */ s("span", { className: "text-zinc-200 shrink-0", children: l.actionId }),
            /* @__PURE__ */ s("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${u.text}`, children: Ma(l.status) }),
            l.message && /* @__PURE__ */ s("span", { className: "text-zinc-400 truncate flex-1 min-w-0", children: l.message }),
            /* @__PURE__ */ s("span", { className: "text-zinc-600 text-[10px] shrink-0", children: Oa(l.clientRequestId) })
          ]
        },
        `${l.clientRequestId}-${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const Pa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActionLog: Ra
}, Symbol.toStringTag, { value: "Module" })), fn = {
  error: { dot: "bg-red-400", text: "text-red-300" },
  warn: { dot: "bg-amber-400", text: "text-amber-300" },
  ok: { dot: "bg-emerald-400", text: "text-emerald-300" },
  info: { dot: "bg-sky-400", text: "text-sky-300" }
};
function La(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Ia({ options: e }) {
  const { recentAlerts: t, clearRecentAlerts: n } = ae(), r = e?.limit || 50, i = dt(t.length > 0), o = t.slice(0, r);
  return o.length === 0 ? /* @__PURE__ */ s(D, { children: "No alerts" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
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
    /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto min-h-0", children: o.map((l, a) => {
      const u = fn[l.severity] ?? fn.warn;
      return /* @__PURE__ */ f(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.predicate,
          children: [
            /* @__PURE__ */ s("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: La(i, l.receivedAt) }),
            /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${u.dot}` }),
            /* @__PURE__ */ s("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${u.text}`, children: l.severity }),
            /* @__PURE__ */ s("span", { className: "text-zinc-200 truncate flex-1 min-w-0", children: l.message }),
            l.widgetId && /* @__PURE__ */ s("span", { className: "text-zinc-600 text-[10px] shrink-0", children: l.widgetId })
          ]
        },
        `${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const Da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AlertLog: Ia
}, Symbol.toStringTag, { value: "Module" })), Fa = 500, Ua = 800;
function Ba(e) {
  return e.id ? `id:${e.id}` : `t:${e.timestamp ?? ""}|p:${e.price ?? ""}|s:${e.size ?? ""}|x:${e.label ?? ""}`;
}
function Ka(e) {
  const t = (e ?? "").toLowerCase();
  return t === "buy" || t === "bid" ? { row: "bg-emerald-500/5", text: "text-emerald-400" } : t === "sell" || t === "ask" ? { row: "bg-red-500/5", text: "text-red-400" } : { row: "", text: "text-zinc-300" };
}
function Ha(e) {
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
function Wa({ data: e, options: t }) {
  const n = t?.cap || Fa, r = Ha(e), [i, o] = v([]), l = F(/* @__PURE__ */ new Set()), a = F(!1);
  if (j(() => {
    if (r.length === 0) return;
    const c = [];
    for (const d of r) {
      const m = Ba(d);
      l.current.has(m) || (l.current.add(m), c.push({ ...d, _key: m, _receivedAt: Date.now() }));
    }
    c.length !== 0 && (o((d) => {
      const m = [...c.reverse(), ...d];
      if (m.length <= n) return m;
      for (const b of m.slice(n)) l.current.delete(b._key);
      return m.slice(0, n);
    }), a.current || (a.current = !0));
  }, [e, n]), i.length === 0)
    return /* @__PURE__ */ s(D, { children: "No prints yet" });
  const u = Date.now() - Ua;
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto text-xs font-mono", children: i.map((c) => {
    const d = Ka(c.side), b = c._receivedAt > u && a.current ? "bg-sky-500/10" : d.row;
    return /* @__PURE__ */ f(
      "div",
      {
        className: `grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${b}`,
        children: [
          /* @__PURE__ */ s("span", { className: "text-zinc-500 tabular-nums truncate", children: c.timestamp != null ? qa(c.timestamp) : "" }),
          /* @__PURE__ */ s("span", { className: `truncate ${d.text}`, children: c.label ?? c.side?.toUpperCase() ?? "·" }),
          /* @__PURE__ */ s("span", { className: `text-right tabular-nums ${d.text}`, children: c.price != null ? Va(c.price) : "" }),
          /* @__PURE__ */ s("span", { className: "text-right tabular-nums text-zinc-400", children: c.size != null ? Ga(c.size) : "" })
        ]
      },
      c._key
    );
  }) });
}
function qa(e) {
  try {
    const t = new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), i = String(t.getSeconds()).padStart(2, "0");
    return `${n}:${r}:${i}`;
  } catch {
    return je(e);
  }
}
function Va(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(Math.abs(e) < 1 ? 4 : 2);
}
function Ga(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const Ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Tape: Wa
}, Symbol.toStringTag, { value: "Module" }));
function Oe(e) {
  if (e instanceof Error) return e.message;
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function Fe(e) {
  const t = (e.kind ?? "").toString().toUpperCase();
  return t === "FOLDER" || t === "KIND_FOLDER";
}
function Ya(e) {
  const t = Xa(e);
  return t || [];
}
function Xa(e) {
  if (!e) return null;
  if (Array.isArray(e)) return e;
  if (typeof e == "object") {
    const t = e;
    if (Array.isArray(t.entries)) return t.entries;
    if (Array.isArray(t.rows)) return t.rows;
  }
  return null;
}
function Za(e) {
  const t = e.filter(Fe).sort(mn), n = e.filter((r) => !Fe(r)).sort(mn);
  return [...t, ...n];
}
function mn(e, t) {
  return (e.name ?? "").localeCompare(t.name ?? "");
}
function Qa(e) {
  return e ? e.split("/").filter(Boolean) : [];
}
function ec(e, t) {
  const n = (e ?? "").replace(/^\/+|\/+$/g, ""), r = (t ?? "").replace(/^\/+|\/+$/g, "");
  return n ? r ? n + "/" + r : n : r;
}
function Qn(e) {
  const t = ["B", "KB", "MB", "GB", "TB"];
  let n = 0, r = e;
  for (; r >= 1024 && n < t.length - 1; )
    r /= 1024, n++;
  return `${n === 0 ? r.toFixed(0) : r.toFixed(1)} ${t[n]}`;
}
const tc = /* @__PURE__ */ new Set(["audio", "video", "mkv"]), nc = /* @__PURE__ */ new Set(["audio", "video", "mkv", "image", "heic"]);
function rc(e) {
  return e.filter((t) => {
    const n = Ye(t.content_type, t.name);
    return n !== null && tc.has(n);
  });
}
function sc(e) {
  return e.filter((t) => {
    const n = Ye(t.content_type, t.name);
    return n !== null && nc.has(n);
  });
}
function pn(e, t, n, r, i = Math.random) {
  if (e.length === 0) return null;
  if (e.length === 1) return r ? e[0] : null;
  const o = e.findIndex((l) => l.name === t);
  if (n) {
    for (let l = 0; l < 5; l++) {
      const a = e[Math.floor(i() * e.length)];
      if (a.name !== t) return a;
    }
    return e[(o + 1) % e.length];
  }
  return o < 0 ? e[0] : o + 1 < e.length ? e[o + 1] : r ? e[0] : null;
}
function ic(e, t, n) {
  if (e.length === 0) return null;
  const r = e.findIndex((i) => i.name === t);
  return r > 0 ? e[r - 1] : n ? e[e.length - 1] : null;
}
function Ye(e, t) {
  const n = (t ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "", r = (e ?? "").toLowerCase().split(";")[0].trim();
  return r === "image/heic" || r === "image/heif" || n === "heic" || n === "heif" ? "heic" : r === "video/x-matroska" || r === "application/x-matroska" || n === "mkv" ? "mkv" : r.startsWith("video/") ? "video" : r.startsWith("audio/") ? "audio" : r.startsWith("image/") ? "image" : r === "application/pdf" || n === "pdf" ? "pdf" : r === "application/json" || r === "text/json" || n === "json" ? "json" : r === "application/yaml" || r === "text/yaml" || r === "application/x-yaml" || n === "yaml" || n === "yml" ? "yaml" : r === "text/markdown" || r === "text/x-markdown" || n === "md" || n === "markdown" ? "markdown" : r === "text/csv" || r === "application/csv" || n === "csv" ? "csv" : r.startsWith("text/") || n === "txt" || n === "log" || n === "ini" || n === "conf" ? "text" : null;
}
function hn(e, t, n) {
  const r = encodeURIComponent(t);
  return e.replace("{bucket}", r).replace("{namespace}", r).replace("{path}", encodeURIComponent(n));
}
function oc(e) {
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
async function lc(e, t) {
  if (!e.body)
    throw new Error("parseConnectStream: response has no body");
  const n = e.body.getReader(), r = [];
  for (; ; ) {
    const { value: c, done: d } = await n.read();
    if (d) break;
    c && r.push(c);
  }
  let i = 0;
  for (const c of r) i += c.length;
  const o = new Uint8Array(i);
  let l = 0;
  for (const c of r)
    o.set(c, l), l += c.length;
  const a = [];
  let u = 0;
  for (; u + 5 <= o.length; ) {
    const c = o[u], d = o[u + 1] << 24 | o[u + 2] << 16 | o[u + 3] << 8 | o[u + 4];
    if (u += 5, u + d > o.length) break;
    const m = o.subarray(u, u + d);
    if (u += d, (c & 2) !== 0) break;
    try {
      const b = JSON.parse(new TextDecoder().decode(m));
      if (b.data) {
        const p = atob(b.data), g = new Uint8Array(p.length);
        for (let h = 0; h < p.length; h++) g[h] = p.charCodeAt(h);
        a.push(g.buffer);
      }
    } catch {
    }
  }
  return new Blob(a, { type: t ?? "application/octet-stream" });
}
async function ac(e) {
  const t = await fetch(e);
  if (!t.ok) throw new Error(`fetch failed: ${t.status}`);
  return t.text();
}
function cc(e) {
  try {
    return JSON.stringify(JSON.parse(e), null, 2);
  } catch {
    return e;
  }
}
function uc(e) {
  const t = [];
  let n = [], r = "", i = !1;
  for (let o = 0; o < e.length; o++) {
    const l = e[o];
    if (i) {
      if (l === '"' && e[o + 1] === '"') {
        r += '"', o++;
        continue;
      }
      if (l === '"') {
        i = !1;
        continue;
      }
      r += l;
      continue;
    }
    if (l === '"') {
      i = !0;
      continue;
    }
    if (l === ",") {
      n.push(r), r = "";
      continue;
    }
    if (l === `
` || l === "\r") {
      l === "\r" && e[o + 1] === `
` && o++, n.push(r), r = "", t.push(n), n = [];
      continue;
    }
    r += l;
  }
  return (r !== "" || n.length > 0) && (n.push(r), t.push(n)), t;
}
async function dc(e) {
  const [{ marked: t }, { default: n }] = await Promise.all([
    import("./marked.esm-CgtsUw0D.js"),
    import("./purify.es-ZDSJOUnA.js")
  ]);
  try {
    const r = await t.parse(e, { async: !0 });
    return n.sanitize(r);
  } catch {
    return `<pre>${fc(e)}</pre>`;
  }
}
function fc(e) {
  return e.replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]);
}
let wt = null;
function er(e) {
  return import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    e
  );
}
async function mc(e) {
  const { default: t } = await er("heic2any"), n = await t({ blob: e, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(n) ? n[0] : n;
}
async function pc(e, t) {
  t?.("Loading ffmpeg…");
  const n = await hc();
  t?.("Fetching file…");
  const r = await fetch(e);
  if (!r.ok) throw new Error(`fetch failed: ${r.status}`);
  const i = new Uint8Array(await r.arrayBuffer());
  t?.("Remuxing…"), await n.writeFile("input.mkv", i);
  const o = await n.exec(["-i", "input.mkv", "-c", "copy", "-movflags", "+faststart", "output.mp4"]);
  if (o !== 0)
    throw new Error("ffmpeg remux failed (code " + o + ") — codec inside MKV may not be browser-compatible");
  const l = await n.readFile("output.mp4");
  if (typeof l == "string")
    throw new Error("ffmpeg readFile returned string");
  return new Blob([new Uint8Array(l)], { type: "video/mp4" });
}
async function hc() {
  if (wt) return wt;
  const { FFmpeg: e } = await er("@ffmpeg/ffmpeg"), t = new e();
  return await t.load(), wt = t, t;
}
function bc({ data: e, options: t, widgetId: n }) {
  const r = t ?? {}, { ctx: i, setCtx: o, backendUrl: l, toast: a, requestRefresh: u } = ae(), c = r.path_ctx ?? "path", d = r.bucket_ctx ?? "org", m = r.bucket_param ?? "org", b = r.page_ctx ?? "page", p = r.page_size_ctx ?? "page_size", g = r.view_mode_ctx ?? "view_mode", h = r.upload_action_id ?? "upload", w = r.upload_url, A = r.ingest_url, _ = i[d] ?? "default", R = i[c] ?? "", $ = parseInt(i[b] ?? "1", 10) || 1, x = parseInt(i[p] ?? "50", 10) || 50, T = i[g] === "gallery" ? "gallery" : "icons", [E, P] = v(!1), [Y, H] = v(!1), [G, te] = v(null), [I, V] = v(!1), [W, C] = v("url"), [B, ee] = v(""), [X, se] = v(""), [y, k] = v(""), [z, M] = v(!1), K = r.search_url, [Z, ne] = v(""), [Q, re] = v(null), [he, _e] = v(!1), Te = L(() => Ya(e), [e]), Ce = Q ?? Te, xe = L(
    () => Q || Za(Te),
    [Q, Te]
  ), me = L(() => Qa(R), [R]), be = !Q && $ > 1, $e = !Q && Te.length >= x, We = r.media_url_template ?? "/media?namespace={namespace}&path={path}";
  j(() => {
    $ !== 1 && o(b, "1");
  }, [_, R]);
  const Re = (N) => o(c, N), qe = (N) => o(b, String(Math.max(1, N))), S = () => o(g, T === "gallery" ? "icons" : "gallery"), O = async () => {
    if (!K) return;
    const N = Z.trim();
    if (N === "") {
      re(null);
      return;
    }
    _e(!0);
    try {
      const q = await fetch((l ?? "") + K, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [m]: _, query: N })
      });
      if (!q.ok) {
        a(`Search failed: ${await st(q)}`, "error");
        return;
      }
      const ie = await q.json();
      re((ie.hits ?? []).map((oe) => ({ ...oe, kind: "file" })));
    } catch (q) {
      a(`Search failed: ${Oe(q)}`, "error");
    } finally {
      _e(!1);
    }
  }, J = () => {
    ne(""), re(null);
  }, de = (N) => {
    J(), Re(N);
  }, ye = () => {
    ee(R), se(""), k(""), C(A ? "url" : "file"), V(!0);
  }, ge = async () => {
    if (!A) return;
    const N = B.trim(), q = X.trim(), ie = y.trim();
    if (!N || !q || !ie) {
      a("Need a folder (repo), a filename, and a URL", "error");
      return;
    }
    M(!0);
    try {
      const oe = await fetch((l ?? "") + A, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [m]: _, repo: N, path: q, url: ie })
      });
      if (!oe.ok)
        throw new Error(await st(oe));
      a(`Fetching ${q} in the background — it'll appear when done.`, "ok"), V(!1);
    } catch (oe) {
      a(`Ingest failed: ${Oe(oe)}`, "error");
    } finally {
      M(!1);
    }
  }, Xe = async (N) => {
    const q = B.trim(), ie = X.trim() || N.name;
    if (!q) {
      a("Need a destination folder (repo)", "error");
      return;
    }
    M(!0);
    try {
      await Ot(N, q, ie), a(`Uploaded ${ie}`, "ok"), V(!1), u(n ?? "*");
    } catch (oe) {
      a(`Upload failed: ${Oe(oe)}`, "error");
    } finally {
      M(!1);
    }
  }, ue = (N) => N.path && N.path !== "" ? N.path : ec(R, N.name ?? ""), Pe = (N) => {
    if (Fe(N)) {
      Q ? de(ue(N)) : Re(ue(N));
      return;
    }
    if (We && Ye(N.content_type, N.name)) {
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
    const ie = ue(N), oe = (l ?? "") + q;
    try {
      const ve = await fetch(oe, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1"
        },
        body: JSON.stringify({ [m]: _, path: ie })
      });
      if (!ve.ok) {
        const Qe = await st(ve);
        a(`Download failed: ${Qe}`, "error");
        return;
      }
      const ft = await lc(ve, N.content_type), Le = document.createElement("a");
      Le.href = URL.createObjectURL(ft), Le.download = N.name, Le.click(), setTimeout(() => URL.revokeObjectURL(Le.href), 5e3);
    } catch (ve) {
      a(`Download failed: ${Oe(ve)}`, "error");
    }
  }, Ot = async (N, q, ie) => {
    const oe = N.type || "application/octet-stream";
    if (w) {
      const nr = new URLSearchParams({ [m]: _, repo: q, path: ie, content_type: oe }), mt = await fetch(`${l ?? ""}${w}?${nr.toString()}`, { method: "POST", body: N });
      if (!mt.ok) throw new Error(await mt.text() || `HTTP ${mt.status}`);
      return;
    }
    const ve = await N.arrayBuffer(), ft = Sn(l ?? ""), Le = zn({
      actionId: h,
      params: { [m]: _, repo: q, path: ie, content_type: oe, data_b64: oc(ve) },
      clientRequestId: An()
    }), Qe = await fetch(ft, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
      body: JSON.stringify(Le)
    });
    if (!Qe.ok) throw new Error(await st(Qe));
  }, tr = async (N) => {
    if (R === "") {
      a("Open a folder first, or use the Upload button to choose a folder.", "error");
      return;
    }
    const q = R;
    H(!0);
    let ie = 0;
    for (const oe of Array.from(N))
      try {
        await Ot(oe, q, oe.name), ie++;
      } catch (ve) {
        a(`Upload failed: ${oe.name} — ${Oe(ve)}`, "error");
      }
    H(!1), ie > 0 && (a(`Uploaded ${ie} file${ie === 1 ? "" : "s"}`, "ok"), u(n ?? "*"));
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
        N.preventDefault(), P(!1), N.dataTransfer.files.length > 0 && tr(N.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0", children: [
          /* @__PURE__ */ s("button", { onClick: () => Re(""), className: "text-sky-400 hover:underline", children: "/" }),
          me.map((N, q) => {
            const ie = me.slice(0, q + 1).join("/");
            return /* @__PURE__ */ f("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "/" }),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Re(ie),
                  className: "text-sky-400 hover:underline",
                  children: N
                }
              )
            ] }, q);
          }),
          /* @__PURE__ */ f("div", { className: "ml-auto flex items-center gap-3 text-zinc-500", children: [
            K && /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s(
                "input",
                {
                  type: "search",
                  value: Z,
                  onChange: (N) => ne(N.target.value),
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
                  disabled: he,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
                  "aria-label": "Search",
                  title: "Search this namespace",
                  children: he ? "…" : "🔍"
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
                onClick: ye,
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
            /* @__PURE__ */ s("span", { className: "tabular-nums", children: Q ? `${Q.length} result${Q.length === 1 ? "" : "s"}` : `${Ce.length} on page` }),
            (be || $e) && /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => qe($ - 1),
                  disabled: !be,
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
                  onClick: () => qe($ + 1),
                  disabled: !$e,
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
          xe.length === 0 ? /* @__PURE__ */ s(D, { children: Q ? "No files match your search." : "This folder is empty. Drop files to upload." }) : T === "gallery" ? /* @__PURE__ */ s(
            gc,
            {
              entries: xe,
              onClick: Pe,
              mediaUrlFor: (N) => N.name ? (l ?? "") + hn(We, _, ue(N)) : ""
            }
          ) : /* @__PURE__ */ f("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ s("thead", { className: "sticky top-0 bg-zinc-900 z-[1]", children: /* @__PURE__ */ f("tr", { className: "text-zinc-400 border-b border-zinc-800", children: [
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-8" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2", children: "Name" }),
              /* @__PURE__ */ s("th", { className: "text-right px-3 py-2 w-24", children: "Size" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-40", children: "Type" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-36", children: "Modified" })
            ] }) }),
            /* @__PURE__ */ s("tbody", { children: xe.map((N, q) => /* @__PURE__ */ f(
              "tr",
              {
                onDoubleClick: () => Pe(N),
                className: "border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none",
                children: [
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 select-none", children: Fe(N) ? "📁" : "📄" }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-100 truncate", children: N.name }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-right text-zinc-400", children: Fe(N) ? "—" : Qn(N.size_bytes ?? 0) }),
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
          xc,
          {
            entry: G,
            mediaUrl: (l ?? "") + hn(We, _, ue(G)),
            autoAdvanceQueue: rc(xe),
            navigableQueue: sc(xe),
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
                        onChange: (N) => se(N.target.value),
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
                          ge();
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
function gc({
  entries: e,
  onClick: t,
  mediaUrlFor: n
}) {
  return /* @__PURE__ */ s("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3", children: e.map((r, i) => {
    const o = Ye(r.content_type, r.name), l = o === "image" || o === "heic", a = Fe(r);
    return /* @__PURE__ */ f(
      "button",
      {
        onDoubleClick: () => t(r),
        className: "flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left select-none",
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
      `${r.kind ?? ""}:${r.name ?? i}`
    );
  }) });
}
function xc({
  entry: e,
  mediaUrl: t,
  autoAdvanceQueue: n,
  navigableQueue: r,
  onSelect: i,
  onClose: o,
  onDownload: l
}) {
  const a = Ye(e.content_type, e.name), u = a === "text" || a === "json" || a === "yaml" || a === "csv" || a === "markdown", [c, d] = v(
    a === "image" || a === "video" || a === "pdf" || a === "heic" || a === "mkv" || u
  ), [m, b] = v(!1), [p, g] = v(null), [h, w] = v(null), [A, _] = v("Loading…"), [R, $] = v(null), [x, T] = v(null), [E, P] = v(null), Y = r.length > 1, H = r.findIndex((y) => y.name === e.name), [G, te] = v(!1), [I, V] = v(!0), W = () => {
    const y = pn(r, e.name, G, I);
    y && i(y);
  }, C = () => {
    const y = ic(r, e.name, I);
    y && i(y);
  }, B = () => {
    const y = pn(n, e.name, G, I);
    y && i(y);
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
    d(!1), b(!0), g(null);
  }, se = (y) => {
    y.target === y.currentTarget && o();
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
          z = await mc(await M.blob());
        } else
          z = await pc(t, (M) => {
            y || _(M);
          });
        if (y) return;
        k = URL.createObjectURL(z), w(k), d(!1);
      } catch (z) {
        if (y) return;
        g(Oe(z)), b(!0), d(!1);
      }
    })(), () => {
      y = !0, k && URL.revokeObjectURL(k);
    };
  }, [a, t]), j(() => {
    if (!u) return;
    let y = !1;
    return (async () => {
      try {
        const k = await ac(t);
        if (y) return;
        a === "csv" ? T(uc(k)) : a === "json" ? $(cc(k)) : a === "markdown" ? P(await dc(k)) : $(k), d(!1);
      } catch (k) {
        if (y) return;
        g(Oe(k)), b(!0), d(!1);
      }
    })(), () => {
      y = !0;
    };
  }, [a, u, t]), /* @__PURE__ */ f(
    "div",
    {
      className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
      onClick: se,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900", children: [
          /* @__PURE__ */ s("span", { className: "text-sm font-medium truncate flex-1", children: e.name }),
          /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 truncate max-w-[200px]", children: e.content_type }),
          typeof e.size_bytes == "number" && /* @__PURE__ */ s("span", { className: "text-xs text-zinc-600 tabular-nums", children: Qn(e.size_bytes) }),
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
              H >= 0 ? H + 1 : "–",
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
              onClick: o,
              className: "text-zinc-400 hover:text-zinc-100 text-lg leading-none",
              "aria-label": "Close preview",
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ f(
          "div",
          {
            className: "flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative",
            onClick: se,
            children: [
              c && !m && /* @__PURE__ */ s("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s("div", { className: "text-zinc-500 text-xs uppercase tracking-wider", children: A }) }),
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
const yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileBrowser: bc
}, Symbol.toStringTag, { value: "Module" }));
function Mc({ view: e, filenameBase: t, onExport: n, variant: r = "button" }) {
  const [i, o] = v(!1), [l, a] = v(null), u = F(null);
  j(() => {
    if (!i) return;
    const p = (g) => {
      u.current && !u.current.contains(g.target) && o(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [i]);
  const c = In(e), d = c === 0, m = async (p) => {
    a(p);
    let g = !1;
    try {
      g = await Dn(e, p, t);
    } catch {
      g = !1;
    } finally {
      a(null), o(!1), n?.(p, g);
    }
  }, b = r === "row" ? /* @__PURE__ */ s(
    "button",
    {
      onClick: () => o((p) => !p),
      disabled: d,
      className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-40",
      children: "Export…"
    }
  ) : /* @__PURE__ */ s(
    "button",
    {
      onClick: () => o((p) => !p),
      disabled: d,
      title: d ? "No data to export" : `Export ${c.toLocaleString()} rows`,
      className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0 disabled:opacity-40",
      "aria-label": "Export data",
      children: "↓ Export"
    }
  );
  return /* @__PURE__ */ f("div", { className: "relative", ref: u, children: [
    b,
    i && !d && /* @__PURE__ */ f("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-30 min-w-[140px]", children: [
      /* @__PURE__ */ f("div", { className: "px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600", children: [
        c.toLocaleString(),
        " rows"
      ] }),
      Pn.map((p) => /* @__PURE__ */ f(
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
function vc(e) {
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
function Oc({ config: e, onEvent: t }) {
  const [n, r] = v({});
  j(() => {
    if (!e.templateUrl) return;
    let l = !1;
    return r({}), fetch(e.templateUrl).then((a) => {
      if (!a.ok) throw new Error(`Template fetch failed: ${a.status}`);
      return a.json();
    }).then((a) => {
      if (l) return;
      const u = Object.keys(e.ctx).length > 0 ? {
        ...a,
        context: {
          values: { ...a.context?.values ?? {}, ...e.ctx }
        }
      } : a;
      r({ template: u });
    }).catch((a) => {
      l || r({ error: a instanceof Error ? a.message : "Template load error" });
    }), () => {
      l = !0;
    };
  }, [e.templateUrl, e.ctx]);
  const i = L(() => vc(e), [e]), o = e.templateUrl ? n.template : i;
  return e.templateUrl && n.error ? /* @__PURE__ */ s(kt, { title: "Embed error", body: n.error }) : e.templateUrl && !o ? /* @__PURE__ */ s(kt, { title: "Loading…", body: "Fetching dashboard template" }) : o ? /* @__PURE__ */ s("div", { className: "min-h-screen bg-zinc-950", children: /* @__PURE__ */ s(
    Kn,
    {
      template: o,
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
function wc(e) {
  return e === "1" || e === "true" || e === "yes";
}
function jc(e) {
  const t = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), n = {};
  for (const [c, d] of t.entries())
    if (c.startsWith("ctx.")) {
      const m = c.slice(4);
      m && (n[m] = d);
    }
  const r = t.get("chrome") === "full" ? "full" : "none", i = t.get("title") ?? void 0, o = t.get("backend") ?? void 0, l = t.get("template") ?? void 0;
  if (l)
    return { templateUrl: l, title: i, backendUrl: o, ctx: n, chrome: r };
  const a = t.get("src") ?? void 0, u = t.get("url") ?? void 0;
  if (a || u) {
    const c = t.get("refreshMs"), d = c != null ? Number(c) : NaN;
    return {
      widget: {
        component: t.get("component") ?? "table",
        sourceId: a,
        url: u,
        stream: wc(t.get("stream")),
        refreshIntervalMs: Number.isFinite(d) && d > 0 ? d : void 0
      },
      title: i,
      backendUrl: o,
      ctx: n,
      chrome: r
    };
  }
  return { title: i, backendUrl: o, ctx: n, chrome: r };
}
function Rc(e, t) {
  const n = new URLSearchParams();
  t.templateUrl && n.set("template", t.templateUrl), t.widget && (t.widget.component && n.set("component", t.widget.component), t.widget.sourceId && n.set("src", t.widget.sourceId), t.widget.url && n.set("url", t.widget.url), t.widget.stream && n.set("stream", "1"), t.widget.refreshIntervalMs && n.set("refreshMs", String(t.widget.refreshIntervalMs))), t.title && n.set("title", t.title), t.backendUrl && n.set("backend", t.backendUrl), t.chrome === "full" && n.set("chrome", "full");
  for (const [i, o] of Object.entries(t.ctx ?? {})) n.set(`ctx.${i}`, o);
  const r = n.toString();
  return r ? `${e}?${r}` : e;
}
const bn = "medallion.terminal.v1.TerminalService";
function kc(e) {
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
function Nc(e) {
  const t = (r, i = !1) => ({ name: r, type: "string", isTime: i }), n = (r) => ({ name: r, type: "number" });
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
function Pc(e, t) {
  const n = t.protocol ?? "connect", r = t.endpoint.replace(/\/$/, ""), i = e.map((l) => ({
    id: l.id,
    name: l.name ?? l.id,
    description: l.description,
    shape: l.shape,
    streamable: l.streamable,
    columns: Nc(l.shape),
    params: (l.params ?? []).map((a) => ({
      key: a.key,
      required: a.required ?? !1,
      type: kc(a.type),
      defaultValue: a.default_value,
      enumValues: a.enum_values,
      description: a.description
    })),
    tags: l.tags
  })), o = {
    version: 1,
    name: t.name,
    protocol: n,
    endpoint: r,
    auth: t.auth ?? { kind: "none" },
    tables: i
  };
  return n === "connect" && (o.service = bn, o.getUrl = `${r}/${bn}/Get`), o;
}
function Lc(e) {
  return JSON.stringify(e, null, 2);
}
function Ic(e) {
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
  Ra as ActionLog,
  Ia as AlertLog,
  Yl as AreaChart,
  qt as BUILTIN_COMPONENTS,
  Tc as BUILTIN_KEYS,
  hl as BarChart,
  aa as Boxplot,
  Di as Candlestick,
  Ro as Catalog,
  Nl as Clock,
  Ds as CommandPalette,
  ga as Dag,
  Kn as Dashboard,
  Nn as DashboardContext,
  Gi as DataTable,
  xo as Distribution,
  hs as EXTENSION,
  Oc as EmbedView,
  D as Empty,
  qr as ErrorBoundary,
  Dt as ErrorState,
  $o as Events,
  Mc as ExportMenu,
  bc as FileBrowser,
  po as Gauge,
  So as Heatmap,
  Kl as Histogram,
  Un as HoverContext,
  _s as HoverProvider,
  Dl as Iframe,
  Rl as Image,
  Sa as Json,
  Ht as MIME,
  no as Metric,
  $c as MultiDashboard,
  ka as MultiSelect,
  _n as NowContext,
  es as NowProvider,
  Lo as OrderBook,
  fe as PALETTE,
  Uo as PairedGrid,
  Hr as Placeholder,
  fo as Prompt,
  ma as Radar,
  Ee as SEMANTIC,
  xl as Scatter,
  Vl as Section,
  sa as Select,
  Bs as ShortcutsOverlay,
  It as Skeleton,
  ta as Slider,
  _a as Sparkline,
  al as StatStrip,
  Wa as Tape,
  ao as Text,
  el as Ticker,
  Ei as Timeseries,
  Yo as Trade,
  $l as Treemap,
  rl as VolumeProfile,
  Fn as WidgetShell,
  Wn as abbreviateAxis,
  Ts as applyActions,
  zn as buildActionRequest,
  Xr as buildActionWatchRequest,
  Pc as buildBiDescriptor,
  Rc as buildEmbedUrl,
  Jr as buildGenerateRequest,
  Gr as buildGenerateUrl,
  Js as buildSnapshot,
  Sn as buildSubmitActionUrl,
  Yr as buildWatchActionUrl,
  rs as canParsePredicate,
  Ic as connectionFields,
  Wt as csvEscape,
  js as deleteView,
  Lc as descriptorToJson,
  Dn as downloadView,
  ns as evaluateAlert,
  Ns as exportFilename,
  ks as exportView,
  ps as flatten,
  Si as formatBps,
  He as formatCompact,
  Ni as formatCurrency,
  ki as formatPercent,
  qn as formatStat,
  je as formatTimestamp,
  kn as getNested,
  Wr as getWidget,
  De as interpolate,
  Gs as isStaticTemplate,
  ot as isTerminalStatus,
  Os as listViews,
  Ms as loadView,
  An as newClientRequestId,
  jc as parseEmbedConfig,
  Cs as readCtxFromUrl,
  Cc as registerWidget,
  zi as resolveColor,
  Qr as resolveSource,
  Es as saveView,
  ws as serializeText,
  bs as toCsv,
  gs as toJson,
  xs as toNdjson,
  vs as toParquet,
  Xn as useAnimatedNumber,
  Cr as useBreakpoint,
  ae as useDashboard,
  jr as useDataSource,
  Bn as useHover,
  dt as useNow,
  Ec as useTabFromUrl,
  Jo as useWatchAction,
  Vs as validateTemplate,
  In as viewRowCount,
  Vt as widgetSnapshotKey,
  $s as writeCtxToUrl
};
