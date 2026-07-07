import { jsxs as f, jsx as s, Fragment as ft } from "react/jsx-runtime";
import { useState as v, useEffect as j, useCallback as ce, useRef as U, useMemo as I, lazy as kr, Component as Nr, useContext as Lt, createContext as Dt, Suspense as Sr } from "react";
import { ResponsiveContainer as Ae, LineChart as zr, CartesianGrid as He, XAxis as We, YAxis as qe, Tooltip as _e, Line as Ar, Brush as Pn, ReferenceLine as _r, ReferenceArea as Tr, ReferenceDot as $r, PieChart as Cr, Pie as Er, Cell as In, BarChart as Mt, Legend as Ln, Bar as Ot, ScatterChart as Mr, ZAxis as Or, Scatter as Rr, Treemap as jr, AreaChart as Pr, Area as Ir, RadarChart as Lr, PolarGrid as Dr, PolarAngleAxis as Fr, PolarRadiusAxis as Ur, Radar as Br } from "recharts";
import { createChart as Kr, ColorType as Hr, CandlestickSeries as Wr, HistogramSeries as qr, createSeriesMarkers as Gr } from "lightweight-charts";
function Bt() {
  if (typeof window > "u") return "desktop";
  const e = window.innerWidth;
  return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function Vr() {
  const [e, t] = v(Bt);
  return j(() => {
    const n = () => t(Bt());
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), e;
}
const Dn = "application/connect+json", Kt = new TextDecoder();
async function Fn(e, t) {
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
          u.length > 0 && (d = JSON.parse(Kt.decode(u)));
        } catch {
        }
        t.isDisposed() || t.onTrailer?.(d);
        return;
      }
      const c = n.subarray(r + 5, r + 5 + a);
      r += 5 + a;
      try {
        const u = JSON.parse(Kt.decode(c));
        t.isDisposed() || t.onMessage(u);
      } catch {
      }
    }
  }
}
function Un(e, t) {
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
function Jr(e) {
  return e.inline ?? e.data;
}
function Ht(e) {
  return e.refreshIntervalMs ?? e.refreshInterval;
}
function Wt(e) {
  return e instanceof Error ? e.name === "AbortError" ? !0 : /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function qt(e) {
  if (!e.signal.aborted) {
    if (typeof DOMException < "u") {
      e.abort(new DOMException("Data source disposed", "AbortError"));
      return;
    }
    e.abort();
  }
}
const Gt = 3e4, vt = 1e3;
function Xr(e, t) {
  return t ? Un(e, t) : e;
}
const Yr = /* @__PURE__ */ new Set([
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
function Zr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return e;
  const t = Object.keys(e);
  return t.length === 1 && Yr.has(t[0]) ? e[t[0]] : e;
}
function Qr(e) {
  const [t, n] = v(null), [r, o] = v(!0), [i, l] = v(null), [a, c] = v(null), [u, d] = v(!1), [m, h] = v(null), [p, g] = v(0), b = ce(() => g((L) => L + 1), []), k = U(vt), N = U(void 0), _ = U(null), C = U(void 0), E = U(0), x = ce((L) => {
    const G = Xr(Zr(L), e?.transform);
    n(G), l(null), o(!1), c(Date.now()), E.current = Date.now();
  }, [e?.transform]), T = ce((L) => {
    const G = e?.throttleMs ?? 0;
    if (G <= 0) {
      x(L);
      return;
    }
    const X = Date.now() - E.current;
    if (X >= G) {
      x(L);
      return;
    }
    _.current = L, C.current || (C.current = setTimeout(() => {
      _.current !== null && x(_.current), _.current = null, C.current = void 0;
    }, G - X));
  }, [x, e?.throttleMs]), $ = I(() => e ? JSON.stringify([
    e.url,
    e.source_id,
    e.method,
    e.body,
    e.headers,
    e.stream,
    Ht(e),
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
    const L = Jr(e);
    if (L !== void 0) {
      T(L);
      return;
    }
    if (!e.url) {
      o(!1);
      return;
    }
    if (e.stream === "connect") {
      let D = !1;
      const W = new AbortController(), M = async () => {
        if (!D)
          try {
            const P = await fetch(e.url, {
              method: "POST",
              // Spread author headers first so the protocol Content-Type
              // wins. Otherwise a stray Content-Type header on the source
              // overrides the connect+json marker.
              headers: { ...e.headers, "Content-Type": Dn },
              body: JSON.stringify(e.body ?? {}),
              signal: W.signal
            });
            if (!P.ok) throw new Error(`ConnectRPC: HTTP ${P.status}`);
            if (!P.body) throw new Error("ConnectRPC: no response body");
            d(!0), h(null), l(null), k.current = vt;
            const Y = P.body.getReader();
            await Fn(Y, {
              onMessage: T,
              onTrailer: (V) => {
                if (V.error) {
                  const se = V.error.code ?? "unknown", y = V.error.message ?? "stream error";
                  D || l(`${se}: ${y}`);
                }
              },
              isDisposed: () => D
            }), Y.releaseLock();
          } catch (P) {
            !D && P instanceof Error && !Wt(P) && l(P.message);
          } finally {
            if (!D) {
              d(!1);
              const P = k.current;
              h(Date.now() + P), N.current = setTimeout(() => {
                k.current = Math.min(k.current * 2, Gt), M();
              }, P);
            }
          }
      };
      return M(), () => {
        D = !0, qt(W), clearTimeout(N.current), d(!1), h(null);
      };
    }
    if (e.stream === !0) {
      let D = null, W = !1;
      const M = () => {
        W || (D = new EventSource(e.url), D.onopen = () => {
          d(!0), h(null), l(null), k.current = vt;
        }, D.onmessage = (P) => {
          try {
            T(JSON.parse(P.data));
          } catch {
            l("Failed to parse stream");
          }
        }, D.onerror = () => {
          if (D?.close(), d(!1), !W) {
            const P = k.current;
            h(Date.now() + P), N.current = setTimeout(() => {
              k.current = Math.min(k.current * 2, Gt), M();
            }, P);
          }
        });
      };
      return M(), () => {
        W = !0, clearTimeout(N.current), D?.close(), d(!1), h(null);
      };
    }
    const G = new AbortController();
    let X = !1;
    const K = async () => {
      if (!X)
        try {
          const D = await fetch(e.url, {
            method: e.method || "GET",
            headers: e.headers,
            body: e.body ? JSON.stringify(e.body) : void 0,
            signal: G.signal
          });
          if (!D.ok) throw new Error(`HTTP ${D.status}`);
          T(await D.json());
        } catch (D) {
          !X && D instanceof Error && !Wt(D) && l(D.message);
        } finally {
          X || o(!1);
        }
    };
    K();
    let Q;
    const ee = Ht(e);
    return ee && ee > 0 && (Q = setInterval(() => {
      K();
    }, ee)), () => {
      X = !0, qt(G), Q && clearInterval(Q);
    };
  }, [$, T, p]), j(() => () => {
    C.current && clearTimeout(C.current);
  }, []), { data: t, loading: r, error: i, lastUpdated: a, connected: u, nextRetryAt: m, refresh: b };
}
const es = {
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
function Vt({ component: e }) {
  switch (e ? es[e] : "block") {
    case "chart":
      return /* @__PURE__ */ s(ns, {});
    case "table":
      return /* @__PURE__ */ s(rs, {});
    case "list":
      return /* @__PURE__ */ s(ss, {});
    case "single":
      return /* @__PURE__ */ s(os, {});
    case "donut":
      return /* @__PURE__ */ s(is, {});
    case "grid":
      return /* @__PURE__ */ s(ls, {});
    default:
      return /* @__PURE__ */ s(as, {});
  }
}
function F({ children: e, padded: t }) {
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
function Jt({ message: e, onRetry: t }) {
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
const ts = [40, 60, 35, 75, 55, 85, 50, 70, 90, 45, 65, 80, 55, 95, 60, 50, 75, 65, 80, 70];
function ns() {
  return /* @__PURE__ */ s("div", { className: "h-full flex items-end gap-1", children: ts.map((e, t) => /* @__PURE__ */ s(
    "div",
    {
      className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
      style: { height: `${e}%`, animationDelay: `${t * 40}ms` }
    },
    t
  )) });
}
function rs() {
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
function ss() {
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
function os() {
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col items-center justify-center gap-2", children: [
    /* @__PURE__ */ s("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }),
    /* @__PURE__ */ s("div", { className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse", style: { animationDelay: "120ms" } })
  ] });
}
function is() {
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
function ls() {
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
function as() {
  return /* @__PURE__ */ s("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
function cs(e) {
  return /* @__PURE__ */ s(F, { children: "Unknown widget type" });
}
const B = (e, t) => kr(() => e().then((n) => ({ default: n[t] }))), Ft = /* @__PURE__ */ new Map([
  ["timeseries", B(() => Promise.resolve().then(() => ni), "Timeseries")],
  ["candlestick", B(() => Promise.resolve().then(() => ci), "Candlestick")],
  ["table", B(() => Promise.resolve().then(() => yi), "DataTable")],
  ["metric", B(() => Promise.resolve().then(() => Ai), "Metric")],
  ["text", B(() => Promise.resolve().then(() => Ci), "Text")],
  ["prompt", B(() => Promise.resolve().then(() => Mi), "Prompt")],
  ["gauge", B(() => Promise.resolve().then(() => Pi), "Gauge")],
  ["distribution", B(() => Promise.resolve().then(() => Fi), "Distribution")],
  ["heatmap", B(() => Promise.resolve().then(() => Gi), "Heatmap")],
  ["events", B(() => Promise.resolve().then(() => Yi), "Events")],
  ["catalog", B(() => Promise.resolve().then(() => tl), "Catalog")],
  ["orderbook", B(() => Promise.resolve().then(() => sl), "OrderBook")],
  ["paired_grid", B(() => Promise.resolve().then(() => ul), "PairedGrid")],
  ["trade", B(() => Promise.resolve().then(() => bl), "Trade")],
  ["ticker", B(() => Promise.resolve().then(() => wl), "Ticker")],
  ["volume_profile", B(() => Promise.resolve().then(() => Al), "VolumeProfile")],
  ["stat_strip", B(() => Promise.resolve().then(() => Ml), "StatStrip")],
  ["bar_chart", B(() => Promise.resolve().then(() => Pl), "BarChart")],
  ["scatter", B(() => Promise.resolve().then(() => Bl), "Scatter")],
  ["clock", B(() => Promise.resolve().then(() => Xl), "Clock")],
  ["treemap", B(() => Promise.resolve().then(() => ta), "Treemap")],
  ["image", B(() => Promise.resolve().then(() => sa), "Image")],
  ["iframe", B(() => Promise.resolve().then(() => aa), "Iframe")],
  ["histogram", B(() => Promise.resolve().then(() => ha), "Histogram")],
  ["section", B(() => Promise.resolve().then(() => ga), "Section")],
  ["area_chart", B(() => Promise.resolve().then(() => Sa), "AreaChart")],
  ["slider", B(() => Promise.resolve().then(() => _a), "Slider")],
  ["select", B(() => Promise.resolve().then(() => Ma), "Select")],
  ["boxplot", B(() => Promise.resolve().then(() => Ia), "Boxplot")],
  ["radar", B(() => Promise.resolve().then(() => Ba), "Radar")],
  ["dag", B(() => Promise.resolve().then(() => Va), "Dag")],
  ["multi_select", B(() => Promise.resolve().then(() => Xa), "MultiSelect")],
  ["json", B(() => Promise.resolve().then(() => Qa), "Json")],
  ["sparkline", B(() => Promise.resolve().then(() => nc), "Sparkline")],
  ["action_log", B(() => Promise.resolve().then(() => cc), "ActionLog")],
  ["alert_log", B(() => Promise.resolve().then(() => fc), "AlertLog")],
  ["tape", B(() => Promise.resolve().then(() => kc), "Tape")],
  ["file_browser", B(() => Promise.resolve().then(() => qc), "FileBrowser")]
]), tu = new Set(Ft.keys());
function us(e) {
  return Ft.get(e) || cs;
}
function nu(e, t) {
  Ft.set(e, t);
}
class ds extends Nr {
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
const fs = {
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
}, Bn = Dt(fs);
function ae() {
  return Lt(Bn);
}
const bt = "medallion.terminal.v1.TerminalService";
function ms(e) {
  return `${e.replace(/\/$/, "")}/${bt}/Generate`;
}
function ps(e, t, n) {
  return {
    prompt: e,
    context: { values: t },
    current_widgets: n
  };
}
function Kn(e) {
  return `${e.replace(/\/$/, "")}/${bt}/SubmitAction`;
}
function hs(e) {
  return `${e.replace(/\/$/, "")}/${bt}/WatchAction`;
}
function Hn(e) {
  return { action_id: e.actionId, params: e.params, client_request_id: e.clientRequestId };
}
function bs(e) {
  return {
    action_id: e.actionId ?? "",
    id: e.id ?? "",
    client_request_id: e.clientRequestId ?? ""
  };
}
function Wn() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
let Xt = !1;
class gs extends Error {
  constructor(t) {
    super(`Missing context key: \${ctx.${t}}`), this.key = t, this.name = "InterpolationError";
  }
}
function Be(e, t, n) {
  return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (r, o) => {
    if (o in t) return t[o];
    if (n?.strict) throw new gs(o);
    return "";
  });
}
function xs(e, t, n) {
  if (e.source_id) {
    if (n === void 0)
      return Xt || (console.warn(
        `[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`
      ), Xt = !0), e;
    const o = e.stream ? "Stream" : "Get", i = n.replace(/\/$/, ""), l = {};
    if (e.params)
      for (const [a, c] of Object.entries(e.params))
        l[a] = Be(c, t, { strict: !0 });
    return {
      url: `${i}/${bt}/${o}`,
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
    let o = Be(e.url, t, { strict: !0 });
    if (e.params && Object.keys(e.params).length > 0) {
      const i = Object.entries(e.params).map(([l, a]) => `${encodeURIComponent(l)}=${encodeURIComponent(Be(a, t, { strict: !0 }))}`).join("&");
      o = o.includes("?") ? `${o}&${i}` : `${o}?${i}`;
    }
    r.url = o;
  }
  return r;
}
const qn = Dt({
  now: 0,
  subscribe: () => () => {
  }
});
function gt(e = !0) {
  const { now: t, subscribe: n } = Lt(qn);
  return j(() => {
    if (e)
      return n();
  }, [e, n]), t;
}
function ys({ children: e }) {
  const [t, n] = v(() => Date.now()), r = U(0), o = U(null), i = I(() => ({
    now: t,
    subscribe: () => (r.current += 1, o.current == null && (o.current = setInterval(() => n(Date.now()), 1e3)), () => {
      r.current = Math.max(0, r.current - 1), r.current === 0 && o.current != null && (clearInterval(o.current), o.current = null);
    })
  }), [t]);
  return j(() => () => {
    o.current != null && clearInterval(o.current);
  }, []), /* @__PURE__ */ s(qn.Provider, { value: i, children: e });
}
const vs = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function ws(e, t) {
  const n = Gn(t);
  return n ? zs(n, e) : !1;
}
function ks(e) {
  return Gn(e) !== null;
}
function Gn(e) {
  const t = e.trim();
  if (!t) return null;
  const n = Yt(t, "||"), r = [];
  for (const o of n) {
    const i = Yt(o, "&&"), l = [];
    for (const a of i) {
      const c = Ns(a);
      if (!c) return null;
      l.push(c);
    }
    if (l.length === 0) return null;
    r.push(l);
  }
  return r.length === 0 ? null : r;
}
function Yt(e, t) {
  const n = [];
  let r = 0, o = !1;
  for (let i = 0; i < e.length; i++)
    if (e[i] === '"' && (o = !o), !o && !o && e.startsWith(t, i)) {
      n.push(e.slice(r, i)), r = i + t.length, i += t.length - 1;
      continue;
    }
  return n.push(e.slice(r)), n.map((i) => i.trim());
}
function Ns(e) {
  const t = e.trim().match(vs);
  if (!t) return null;
  const [, n, r, o] = t;
  return { path: n.trim(), op: r, rhs: Ss(o.trim()) };
}
function Ss(e) {
  if (e === "true") return !0;
  if (e === "false") return !1;
  if (e === "null") return null;
  if (e.length >= 2 && e.startsWith('"') && e.endsWith('"'))
    return e.slice(1, -1);
  const t = Number(e);
  return Number.isNaN(t) ? e : t;
}
function zs(e, t) {
  for (const n of e) {
    let r = !0;
    for (const o of n)
      if (!As(Un(t, o.path), o.op, o.rhs)) {
        r = !1;
        break;
      }
    if (r) return !0;
  }
  return !1;
}
function As(e, t, n) {
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
const _s = {
  warn: 720,
  // mid
  error: 480
  // low — more alarming
}, Zt = 160, Ts = 0.08;
let nt = null;
function $s() {
  if (typeof window > "u") return null;
  if (nt) return nt;
  const e = window, t = window.AudioContext || e.webkitAudioContext;
  return t ? (nt = new t(), nt) : null;
}
function Cs(e) {
  const t = _s[e];
  if (!t) return;
  const n = $s();
  if (!n) return;
  n.state === "suspended" && n.resume().catch(() => {
  });
  const r = n.createOscillator(), o = n.createGain();
  r.type = "sine", r.frequency.value = t, o.gain.value = 0, r.connect(o), o.connect(n.destination);
  const i = n.currentTime;
  o.gain.linearRampToValueAtTime(Ts, i + 0.02), o.gain.linearRampToValueAtTime(0, i + Zt / 1e3), r.start(i), r.stop(i + Zt / 1e3 + 0.05);
}
const mt = { columns: [], rows: [] };
function ze(e) {
  if (e == null) return null;
  const t = typeof e;
  if (t === "number" || t === "boolean" || t === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function me(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const i of Object.keys(o))
      n.has(i) || (n.add(i), t.push(i));
  const r = e.map((o) => {
    const i = {};
    for (const l of t) i[l] = ze(o[l]);
    return i;
  });
  return { columns: t, rows: r };
}
function le(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ut(e) {
  const t = (r) => Array.isArray(r) ? r : le(r) && Array.isArray(r.points) ? r.points : null;
  if (le(e) && Array.isArray(e.series)) {
    const r = e.series, o = /* @__PURE__ */ new Map(), i = [];
    for (let l = 0; l < r.length; l++) {
      const a = r[l], c = a.name ?? `series_${l + 1}`;
      i.push(c);
      const u = a.points ?? a.data ?? [];
      for (const d of u) {
        const m = String(d.timestamp ?? ""), h = o.get(m) ?? { timestamp: m };
        h[c] = ze(d.value), o.set(m, h);
      }
    }
    return { columns: ["timestamp", ...i], rows: [...o.values()] };
  }
  const n = t(e);
  return n ? {
    columns: ["timestamp", "value"],
    rows: n.map((r) => ({ timestamp: ze(r.timestamp), value: ze(r.value) }))
  } : null;
}
function Vn(e) {
  return le(e) && Array.isArray(e.bars) ? me(e.bars) : null;
}
function Jn(e) {
  if (Array.isArray(e) && e.length > 0 && le(e[0]))
    return me(e);
  if (le(e) && "rows" in e) {
    const t = e, n = Array.isArray(t.columns) ? t.columns : [];
    if (n.length > 0 && le(n[0])) {
      const i = n.map((a) => a.key), l = t.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(i.map((c, u) => [c, ze(a[u])])) : Qt(a, i)
      );
      return { columns: i, rows: l };
    }
    if (n.length > 0 && typeof n[0] == "string") {
      const o = n, i = t.rows.map(
        (l) => Array.isArray(l) ? Object.fromEntries(o.map((a, c) => [a, ze(l[c])])) : Qt(l, o)
      );
      return { columns: o, rows: i };
    }
    const r = t.rows;
    return r.length > 0 && le(r[0]) ? me(r) : mt;
  }
  return null;
}
function Qt(e, t) {
  const n = {};
  for (const r of t) n[r] = ze(e[r]);
  return n;
}
function Xn(e) {
  return le(e) && Array.isArray(e.cells) ? me(e.cells) : null;
}
function Yn(e) {
  return le(e) && Array.isArray(e.slices) ? me(e.slices) : null;
}
function Ve(e) {
  return le(e) && Array.isArray(e.events) ? me(e.events) : null;
}
function Rt(e) {
  return le(e) && Array.isArray(e.items) ? me(e.items) : null;
}
function Zn(e) {
  if (le(e) && (Array.isArray(e.bids) || Array.isArray(e.asks))) {
    const t = e.bids ?? [], n = e.asks ?? [], r = [
      ...t.map((o) => ({ side: "bid", ...o })),
      ...n.map((o) => ({ side: "ask", ...o }))
    ];
    return me(r);
  }
  return null;
}
function Qn(e) {
  return typeof e == "number" ? { columns: ["value"], rows: [{ value: e }] } : le(e) && "value" in e && typeof e.value != "object" ? me([e]) : null;
}
function er(e) {
  if (le(e) && "value" in e) {
    const { value: t, min: n, max: r } = e;
    return me([{ value: t, min: n, max: r }]);
  }
  return null;
}
const Es = {
  timeseries: ut,
  area_chart: ut,
  sparkline: ut,
  candlestick: Vn,
  table: Jn,
  heatmap: Xn,
  distribution: Yn,
  events: Ve,
  tape: Ve,
  action_log: Ve,
  alert_log: Ve,
  text: Rt,
  ticker: Rt,
  orderbook: Zn,
  metric: Qn,
  gauge: er
};
function Ms(e) {
  if (e == null) return mt;
  if (Array.isArray(e))
    return e.length === 0 ? mt : le(e[0]) ? me(e) : { columns: ["value"], rows: e.map((t) => ({ value: ze(t) })) };
  if (le(e)) {
    const t = Object.entries(e).find(([, n]) => Array.isArray(n));
    return t && le(t[1][0]) ? me(t[1]) : me([e]);
  }
  return { columns: ["value"], rows: [{ value: ze(e) }] };
}
function Os(e, t) {
  if (e == null) return mt;
  if (t) {
    const n = Es[t];
    if (n) {
      const r = n(e);
      if (r) return r;
    }
  }
  for (const n of [
    ut,
    Vn,
    Xn,
    Yn,
    Ve,
    Rt,
    Zn,
    er,
    Qn,
    Jn
  ]) {
    const r = n(e);
    if (r && r.rows.length > 0) return r;
  }
  return Ms(e);
}
const en = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
  ndjson: "application/x-ndjson;charset=utf-8",
  parquet: "application/vnd.apache.parquet"
}, Rs = {
  csv: "csv",
  json: "json",
  ndjson: "ndjson",
  parquet: "parquet"
}, tr = [
  { key: "csv", label: "CSV" },
  { key: "parquet", label: "Parquet" },
  { key: "json", label: "JSON" },
  { key: "ndjson", label: "NDJSON" }
];
function tn(e) {
  if (e == null) return "";
  const t = String(e);
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function js(e) {
  const { columns: t, rows: n } = e, r = t.map(tn).join(","), o = n.map((i) => t.map((l) => tn(i[l])).join(","));
  return [r, ...o].join(`
`);
}
function Ps(e) {
  return JSON.stringify(e.rows, null, 2);
}
function Is(e) {
  return e.rows.map((t) => JSON.stringify(t)).join(`
`);
}
function Ls(e) {
  return e.columns.map((t) => ({
    name: t,
    data: e.rows.map((n) => n[t] ?? null)
  }));
}
async function Ds(e) {
  const { parquetWriteBuffer: t } = await import("./index-BKASYduw.js"), n = e.columns.length > 0 ? Ls(e) : [{ name: "value", data: [] }], r = t({ columnData: n });
  return new Uint8Array(r);
}
function Fs(e, t) {
  switch (t) {
    case "csv":
      return js(e);
    case "json":
      return Ps(e);
    case "ndjson":
      return Is(e);
  }
}
function nr(e) {
  return e.table ?? Os(e.data, e.component);
}
async function Us(e, t) {
  const n = nr(e);
  if (t === "parquet") {
    const o = await Ds(n);
    return new Blob([o.slice().buffer], { type: en.parquet });
  }
  const r = Fs(n, t);
  return new Blob([r], { type: en[t] });
}
function rr(e) {
  return nr(e).rows.length;
}
function Bs(e, t) {
  return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${Rs[t]}`;
}
async function sr(e, t, n) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function")
    return !1;
  const r = await Us(e, t), o = URL.createObjectURL(r), i = document.createElement("a");
  return i.href = o, i.download = Bs(n, t), document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(o), 0), !0;
}
function Ks(e, t) {
  if (!t) return null;
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "just now";
  if (n < 60) return `${n}s ago`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function Hs(e) {
  const { resolution: t, loading: n, error: r, data: o, options: i, component: l, widgetId: a, Component: c, onRenderError: u, onRetry: d } = e;
  return t.error ? /* @__PURE__ */ s(Jt, { message: t.error }) : n ? /* @__PURE__ */ s(Vt, { component: l }) : r ? /* @__PURE__ */ s(Jt, { message: r, onRetry: d }) : /* @__PURE__ */ s("div", { className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]", children: /* @__PURE__ */ s(ds, { onError: u, children: /* @__PURE__ */ s(Sr, { fallback: /* @__PURE__ */ s(Vt, { component: l }), children: /* @__PURE__ */ s(c, { data: o, options: i, widgetId: a }) }) }) });
}
function Ws({
  widget: e,
  data: t,
  onRefresh: n,
  onCopy: r,
  onToast: o
}) {
  const { dispatch: i, fullscreenId: l, setFullscreenId: a } = ae(), [c, u] = v(!1), [d, m] = v(!1), [h, p] = v(!1), g = U(null);
  j(() => {
    if (!c) return;
    const $ = (L) => {
      g.current && !g.current.contains(L.target) && (u(!1), m(!1));
    };
    return document.addEventListener("mousedown", $), () => document.removeEventListener("mousedown", $);
  }, [c]);
  const b = e.source, k = b?.data !== void 0 && !b.url && !b.source_id, N = !!b && !k, _ = !!e.id, C = !!e.id && l !== e.id, E = t == null ? 0 : rr({ data: t, component: e.component }), x = E > 0, T = async ($) => {
    p(!0);
    try {
      const L = await sr(
        { data: t, component: e.component },
        $,
        e.title ?? e.id ?? e.component
      );
      o(
        L ? `Exported ${E.toLocaleString()} rows as ${$.toUpperCase()}` : "Export failed",
        L ? "ok" : "warn"
      );
    } catch {
      o("Export failed", "error");
    } finally {
      p(!1), u(!1), m(!1);
    }
  };
  return /* @__PURE__ */ f("div", { className: "relative", ref: g, children: [
    /* @__PURE__ */ s(
      "button",
      {
        onClick: () => u(($) => !$),
        className: "text-zinc-600 hover:text-zinc-300 px-1.5 text-base leading-none rounded",
        "aria-label": "Widget actions",
        children: "⋮"
      }
    ),
    c && /* @__PURE__ */ f("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-20 min-w-[140px]", children: [
      N && /* @__PURE__ */ s(
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
            onClick: () => m(($) => !$),
            className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
            "aria-expanded": d,
            children: [
              /* @__PURE__ */ f("span", { children: [
                "Export",
                h ? "…" : ""
              ] }),
              /* @__PURE__ */ s("span", { className: "text-zinc-600", children: d ? "▾" : "▸" })
            ]
          }
        ),
        d && /* @__PURE__ */ s("div", { className: "bg-zinc-950/60", children: tr.map(($) => /* @__PURE__ */ s(
          "button",
          {
            onClick: () => T($.key),
            disabled: h,
            className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
            children: $.label
          },
          $.key
        )) })
      ] }),
      C && /* @__PURE__ */ s(
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
function or({ config: e, contentHeight: t, snapshotKey: n }) {
  const { ctx: r, backendUrl: o, refreshIntervalMs: i, compact: l, toast: a, focusedId: c, setFocusedId: u, refreshPulse: d, emit: m, soundEnabled: h, reportWidgetHealth: p, registerWidgetData: g } = ae(), b = I(
    () => e.title ? Be(e.title, r) : e.title,
    [e.title, r]
  ), k = I(() => {
    if (!e.source) return { source: void 0, error: null };
    try {
      const w = xs(e.source, r, o);
      return i && i > 0 && !w.stream ? { source: { ...w, refreshIntervalMs: i }, error: null } : { source: w, error: null };
    } catch (w) {
      return { source: void 0, error: w instanceof Error ? w.message : "Resolution error" };
    }
  }, [e.source, r, o, i]), N = k.source, { data: _, loading: C, error: E, lastUpdated: x, connected: T, nextRetryAt: $, refresh: L } = Qr(N), G = us(e.component), X = U(_);
  X.current = _, j(() => {
    if (n)
      return g(n, () => X.current);
  }, [n, g]);
  const K = !!N?.stream || !!(N?.refreshIntervalMs ?? N?.refreshInterval), Q = N?.staleAfterMs, ee = K && x != null || $ != null || !!Q && x != null, D = gt(ee), W = !!Q && x != null && D - x > Q, M = U(0);
  j(() => {
    if (!d) return;
    const w = e.refresh_policy ?? "global";
    if (w === "manual") return;
    const A = d.id === "*";
    A && w === "self" || !(A || d.id === e.id) || d.n > M.current && (M.current = d.n, L());
  }, [d, e.id, e.refresh_policy, L]);
  const P = U(!1);
  j(() => {
    const w = e.alert;
    if (!w || _ == null) {
      P.current = !1;
      return;
    }
    const A = ws(_, w.when);
    if (A && !P.current) {
      const R = Be(w.message, r), H = w.severity ?? "warn";
      a(R, H), m({ type: "alert", widgetId: e.id, severity: H, message: R, predicate: w.when }), h && Cs(H);
    }
    P.current = A;
  }, [_, e.alert, r, a, m, e.id, h]);
  const Y = U(null);
  j(() => {
    const w = k.error ?? E, A = k.error ? "resolve" : "data";
    w && w !== Y.current ? (m({ type: "widget_error", widgetId: e.id, component: e.component, message: w, source: A }), Y.current = w) : w || (Y.current = null);
  }, [k.error, E, m, e.id, e.component]), j(() => {
    if (!e.id) return;
    const w = !!N?.stream;
    return p(e.id, {
      title: b || e.title || e.component,
      streaming: w,
      connected: w ? T : !0,
      error: k.error ?? E,
      stale: W
    }), () => p(e.id, null);
  }, [e.id, b, e.title, e.component, N?.stream, T, k.error, E, W, p]);
  const V = !!e.id && c === e.id, se = e.id ? () => u(e.id) : void 0;
  return /* @__PURE__ */ f(
    "div",
    {
      onClick: se,
      className: `bg-zinc-900 border ${V ? "border-sky-400/60 shadow-[0_0_12px_-2px_rgba(56,189,248,0.4)]" : "border-zinc-800"} ${l ? "rounded" : "rounded-lg"} overflow-hidden transition-shadow`,
      children: [
        b && /* @__PURE__ */ f("div", { className: `${l ? "px-2.5 py-1.5" : "px-4 py-2.5"} border-b border-zinc-800 flex items-center justify-between`, children: [
          /* @__PURE__ */ s("h3", { className: `${l ? "text-xs" : "text-sm"} font-medium text-zinc-100 truncate`, children: b }),
          /* @__PURE__ */ f("div", { className: "flex items-center gap-2 shrink-0 ml-2", children: [
            K && x && /* @__PURE__ */ f("span", { className: `text-[10px] ${W ? "text-amber-400/80" : "text-zinc-600"}`, children: [
              W ? "stale · " : "",
              Ks(D, x)
            ] }),
            e.source?.stream && !T && $ != null && /* @__PURE__ */ f("span", { className: "text-[10px] text-amber-400/80 tabular-nums", title: "Reconnecting", children: [
              "retry ",
              Math.max(0, Math.ceil(($ - D) / 1e3)),
              "s"
            ] }),
            e.source?.stream && /* @__PURE__ */ s(
              "span",
              {
                className: `w-2 h-2 rounded-full shrink-0 ${T ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
                title: T ? "Connected" : $ ? "Reconnecting" : "Disconnected"
              }
            ),
            /* @__PURE__ */ s(
              Ws,
              {
                widget: e,
                data: _,
                onToast: a,
                onRefresh: L,
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
        /* @__PURE__ */ s("div", { className: l ? "p-2.5" : "p-4", style: { height: l ? Math.round(t * 0.92) : t }, children: Hs({
          resolution: k,
          loading: C,
          error: E,
          data: _,
          options: e.options,
          component: e.component,
          widgetId: e.id,
          Component: G,
          onRenderError: (w) => m({
            type: "widget_error",
            widgetId: e.id,
            component: e.component,
            message: w.message,
            source: "render"
          }),
          // Inline-data sources can't retry; only offer the button
          // when there's an actual fetch/stream behind the widget.
          onRetry: N && !(N.inline !== void 0 || N.data !== void 0) ? L : void 0
        }) })
      ]
    }
  );
}
const ir = Dt({
  hoverTime: null,
  setHoverTime: () => {
  }
});
function lr() {
  return Lt(ir);
}
function qs({ children: e }) {
  const [t, n] = v(null), r = I(() => ({ hoverTime: t, setHoverTime: n }), [t]);
  return /* @__PURE__ */ s(ir.Provider, { value: r, children: e });
}
function Gs(e, t, n) {
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
const pt = "ctx.";
function Vs(e) {
  const t = {}, n = new URLSearchParams(e);
  for (const [r, o] of n)
    r.startsWith(pt) && (t[r.slice(pt.length)] = o);
  return t;
}
function Js(e, t) {
  const n = new URLSearchParams(e);
  for (const r of [...n.keys()])
    r.startsWith(pt) && n.delete(r);
  for (const [r, o] of Object.entries(t))
    n.set(`${pt}${r}`, o);
  return n.toString();
}
const Xe = "medallion-terminal:view:";
function Xs(e, t) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(Xe + e, JSON.stringify(t));
    } catch {
    }
}
function Ys(e) {
  if (!e || typeof window > "u" || !window.localStorage) return null;
  try {
    const t = window.localStorage.getItem(Xe + e);
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
function Zs() {
  if (typeof window > "u" || !window.localStorage) return [];
  const e = [];
  for (let t = 0; t < window.localStorage.length; t++) {
    const n = window.localStorage.key(t);
    n && n.startsWith(Xe) && e.push(n.slice(Xe.length));
  }
  return e.sort();
}
function Qs(e) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.removeItem(Xe + e);
    } catch {
    }
}
const eo = /* @__PURE__ */ new Set(["1d", "5d", "1m", "3m", "1y", "max"]), to = 150, no = 8;
function ro(e, t) {
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
  return i > 0 ? { kind: "set", key: n.slice(0, i).toLowerCase(), value: n.slice(i + 1).trim() } : eo.has(n.toLowerCase()) ? { kind: "set", key: "range", value: n.toLowerCase() } : { kind: "set", key: t, value: n };
}
function so({ suggest: e } = {}) {
  const { ctx: t, setCtx: n, toast: r } = ae(), [o, i] = v(!1), [l, a] = v(""), [c, u] = v([]), [d, m] = v(-1), h = U(null), [p, g] = v([]), b = U(0);
  j(() => {
    const x = (T) => {
      (T.metaKey || T.ctrlKey) && T.key.toLowerCase() === "k" ? (T.preventDefault(), i(($) => !$)) : T.key === "Escape" && i(!1);
    };
    return document.addEventListener("keydown", x), () => document.removeEventListener("keydown", x);
  }, []), j(() => {
    o ? h.current?.focus() : (a(""), m(-1), g([]));
  }, [o]), j(() => {
    if (!e || !o) return;
    const x = l.trim();
    if (!x) {
      g([]);
      return;
    }
    const T = ++b.current, $ = setTimeout(async () => {
      try {
        const L = await e(x);
        if (T !== b.current) return;
        g(L.slice(0, no));
      } catch {
        T === b.current && g([]);
      }
    }, to);
    return () => clearTimeout($);
  }, [l, o, e]);
  const k = I(() => Object.keys(t)[0] ?? "symbol", [t]), N = I(() => o ? Zs() : [], [o, c]);
  if (!o) return null;
  const _ = () => {
    const x = ro(l, k);
    if (!x || x.kind === "noop") {
      i(!1);
      return;
    }
    if (x.kind === "save")
      Xs(x.name, t), r(`Saved "${x.name}"`, "ok");
    else if (x.kind === "load") {
      const T = Ys(x.name);
      if (!T)
        r(`No view named "${x.name}"`, "warn");
      else {
        for (const [$, L] of Object.entries(T)) n($, L);
        r(`Loaded "${x.name}"`, "ok");
      }
    } else if (x.kind === "delete")
      Qs(x.name), r(`Deleted "${x.name}"`, "ok");
    else if (x.kind === "set")
      n(x.key, x.value);
    else if (x.kind === "set_many")
      for (const [T, $] of x.pairs) n(T, $);
    u((T) => [l, ...T.filter(($) => $ !== l)].slice(0, 5)), i(!1);
  }, C = (x) => {
    if (c.length === 0) return;
    const T = Math.max(-1, Math.min(c.length - 1, d + x));
    m(T), a(T === -1 ? "" : c[T]);
  }, E = (x) => {
    for (const [T, $] of Object.entries(x.ctx)) n(T, $);
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
                ref: h,
                type: "text",
                value: l,
                onChange: (x) => a(x.target.value),
                onKeyDown: (x) => {
                  x.key === "Enter" ? (x.preventDefault(), _()) : x.key === "ArrowUp" ? (x.preventDefault(), C(1)) : x.key === "ArrowDown" && (x.preventDefault(), C(-1));
                },
                placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
                className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
              }
            ),
            p.length > 0 && /* @__PURE__ */ s("div", { className: "border-b border-zinc-800 max-h-72 overflow-auto", children: p.map((x, T) => /* @__PURE__ */ f(
              "button",
              {
                onClick: () => E(x),
                className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
                children: [
                  /* @__PURE__ */ s("span", { className: "text-zinc-100", children: x.label }),
                  x.hint && /* @__PURE__ */ s("span", { className: "ml-2 text-[10px] text-zinc-500 font-mono", children: x.hint }),
                  /* @__PURE__ */ s("span", { className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100", children: Object.entries(x.ctx).map(([$, L]) => `${$}=${L}`).join(" · ") })
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
            N.length > 0 && /* @__PURE__ */ f("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "views" }),
              N.map((x) => /* @__PURE__ */ s(
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
const oo = [
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
function io(e) {
  return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([n, r]) => `${n}=${r}`).join(" · ")}`;
}
function lo({ templateShortcuts: e }) {
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
              oo.map((r, o) => /* @__PURE__ */ f("div", { className: "flex items-baseline gap-3", children: [
                /* @__PURE__ */ s("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.keys }),
                /* @__PURE__ */ s("span", { className: "text-xs text-zinc-400", children: r.description })
              ] }, o)),
              e && e.length > 0 && /* @__PURE__ */ f(ft, { children: [
                /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1", children: "Dashboard shortcuts" }),
                e.map((r, o) => /* @__PURE__ */ f("div", { className: "flex items-baseline gap-3", children: [
                  /* @__PURE__ */ s("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.key }),
                  /* @__PURE__ */ s("span", { className: "text-xs text-zinc-400", children: io(r) })
                ] }, `tpl-${o}`))
              ] })
            ] })
          ]
        }
      )
    }
  ) : null;
}
const ao = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
  error: "border-red-500/40     bg-red-500/10     text-red-200",
  info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, co = 3500;
function uo({ toasts: e, dismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ s("div", { className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none", children: e.map((n) => /* @__PURE__ */ s(fo, { toast: n, dismiss: t }, n.id)) });
}
function fo({ toast: e, dismiss: t }) {
  return j(() => {
    const n = setTimeout(() => t(e.id), co);
    return () => clearTimeout(n);
  }, [e.id, t]), /* @__PURE__ */ s(
    "div",
    {
      onClick: () => t(e.id),
      className: `pointer-events-auto cursor-pointer text-xs px-3 py-2 rounded border shadow-lg backdrop-blur-sm ${ao[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
      children: e.message
    }
  );
}
const nn = /* @__PURE__ */ new Set([
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
function mo(e, t) {
  const n = [];
  if (!e || typeof e != "object")
    return n.push({ path: "", severity: "error", message: "template is not an object" }), n;
  if (!Array.isArray(e.widgets))
    return n.push({ path: "widgets", severity: "error", message: "widgets must be an array" }), n;
  const r = t ? /* @__PURE__ */ new Set([...nn, ...t]) : nn;
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
    o.alert && ((typeof o.alert.when != "string" || !ks(o.alert.when)) && n.push({
      path: `${l}.alert.when`,
      severity: "error",
      message: `alert predicate ${JSON.stringify(o.alert.when)} does not parse`
    }), (typeof o.alert.message != "string" || !o.alert.message) && n.push({ path: `${l}.alert.message`, severity: "warn", message: "alert has no message" }));
  }), n;
}
function rn(e, t) {
  return e.id || `__mt_idx_${t}`;
}
function po(e) {
  const t = e?.widgets;
  return !Array.isArray(t) || t.length === 0 ? !1 : t.every((n) => {
    const r = n.source;
    if (!r) return !0;
    const o = r.inline !== void 0 || r.data !== void 0, i = !!(r.source_id || r.url);
    return o || !i;
  });
}
function ho(e, t, n, r, o) {
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
const bo = {
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
}, go = ["1d", "5d", "1m", "3m", "1y", "max"], xo = 200, yo = 200;
function vo({ value: e, onChange: t }) {
  return /* @__PURE__ */ s("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: go.map((n) => {
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
const wo = [
  { label: "Off", ms: null },
  { label: "5s", ms: 5e3 },
  { label: "30s", ms: 3e4 },
  { label: "1m", ms: 6e4 },
  { label: "5m", ms: 3e5 }
];
function ko({ value: e, onChange: t }) {
  return /* @__PURE__ */ s("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: wo.map((n) => {
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
function No() {
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
function So(e) {
  const t = new Date(e), n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), o = String(t.getSeconds()).padStart(2, "0");
  return `${n}:${r}:${o}`;
}
function zo(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Ao() {
  const { recentActions: e, widgetHealth: t } = ae(), n = gt(!0), r = e[0], o = Object.values(t), i = o.filter((d) => d.streaming), l = i.filter((d) => d.connected && !d.error).length, a = o.filter((d) => d.error).length, c = o.filter((d) => d.stale).length, u = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
  return /* @__PURE__ */ f("div", { className: "border-t border-zinc-800 bg-zinc-900/70 px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ s("div", { className: "flex-1 min-w-0 truncate", children: r ? /* @__PURE__ */ f("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ s("span", { className: "tabular-nums w-7 shrink-0", children: zo(n, r.receivedAt) }),
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
    /* @__PURE__ */ s("span", { className: "tabular-nums text-zinc-300", children: So(n) })
  ] });
}
function _o({ health: e }) {
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
function To({ onClick: e }) {
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
function $o({ enabled: e, onToggle: t }) {
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
function Co({ compact: e, onToggle: t }) {
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
function Eo({ onCopied: e }) {
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
function Mo({ onClick: e }) {
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
function Oo({ frozenAt: e }) {
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
function Ro(e) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
  const t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), o = document.createElement("a");
  o.href = r, o.download = `${t}.snapshot.json`, document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
function ar({
  template: e,
  backendUrl: t,
  onEvent: n,
  onCtxChange: r,
  paletteSuggest: o,
  chrome: i = "full",
  onShare: l,
  theme: a = "dark"
}) {
  const c = Vr(), u = e.columns || 12, [d, m] = v(e.widgets), h = I(() => mo(e), [e]), p = I(() => h.some((z) => z.severity === "error"), [h]), g = I(() => !!e.frozenAt || po(e), [e]), [b, k] = v(!1), [N, _] = v(() => {
    const z = e.context?.values ?? {};
    return typeof window > "u" ? z : { ...z, ...Vs(window.location.search) };
  }), [C, E] = v(() => wt("refreshIntervalMs", null)), [x, T] = v(() => wt("compact", !1)), [$, L] = v(() => wt("soundEnabled", !1));
  j(() => {
    kt("refreshIntervalMs", C);
  }, [C]), j(() => {
    kt("compact", x);
  }, [x]), j(() => {
    kt("soundEnabled", $);
  }, [$]);
  const [G, X] = v(null), [K, Q] = v(null), [ee, D] = v(null), [W, M] = v([]), P = U(0), Y = ce((z) => {
    D((O) => ({ id: z, n: (O?.n ?? 0) + 1 }));
  }, []), V = U(n);
  j(() => {
    V.current = n;
  }, [n]);
  const [se, y] = v([]), w = ce(() => y([]), []), [A, R] = v([]), H = ce(() => R([]), []), [J, re] = v({}), te = ce((z, O) => {
    re((Z) => {
      const de = Z[z];
      if (O === null) {
        if (!de) return Z;
        const ve = { ...Z };
        return delete ve[z], ve;
      }
      return de && de.streaming === O.streaming && de.connected === O.connected && de.error === O.error && de.title === O.title && de.stale === O.stale ? Z : { ...Z, [z]: O };
    });
  }, []), ne = U(/* @__PURE__ */ new Map()), pe = ce((z, O) => (ne.current.set(z, O), () => {
    ne.current.get(z) === O && ne.current.delete(z);
  }), []), Me = U({ widgets: d, ctx: N, template: e });
  Me.current = { widgets: d, ctx: N, template: e };
  const xe = ce(() => {
    const { widgets: z, ctx: O, template: Z } = Me.current;
    return ho(Z, z, O, (de, ve) => {
      const ge = ne.current.get(rn(de, ve));
      return ge ? ge() : void 0;
    }, (/* @__PURE__ */ new Date()).toISOString());
  }, []), Pe = ce((z) => {
    V.current?.(z), z.type === "action" ? y((O) => [{
      receivedAt: Date.now(),
      actionId: z.actionId,
      clientRequestId: z.clientRequestId,
      status: z.status,
      message: z.message,
      terminal: z.terminal
    }, ...O].slice(0, xo)) : z.type === "alert" && R((O) => [{
      receivedAt: Date.now(),
      widgetId: z.widgetId,
      severity: z.severity,
      message: z.message,
      predicate: z.predicate
    }, ...O].slice(0, yo));
  }, []), he = ce((z, O = "info") => {
    P.current += 1;
    const Z = P.current;
    M((de) => [...de, { id: Z, message: z, severity: O }]);
  }, []), ye = ce((z) => {
    M((O) => O.filter((Z) => Z.id !== z));
  }, []), ue = ce((z, O) => {
    _((Z) => Z[z] === O ? Z : { ...Z, [z]: O });
  }, []);
  j(() => {
    if (typeof window > "u") return;
    const z = Js(window.location.search, N), O = `${window.location.pathname}${z ? `?${z}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", O);
  }, [N]);
  const $e = U(r);
  j(() => {
    $e.current = r;
  }, [r]), j(() => {
    $e.current?.(N);
  }, [N]);
  const Ie = ce((z, O) => {
    m((Z) => Gs(Z, z, O));
  }, []), Le = (z) => c === "mobile" ? u : c === "tablet" ? Math.min(z, Math.floor(u / 2)) : Math.min(z, u), Ze = I(
    () => ({
      dispatch: Ie,
      ctx: N,
      setCtx: ue,
      backendUrl: t,
      widgets: d,
      refreshIntervalMs: C ?? void 0,
      toast: he,
      compact: x,
      fullscreenId: G,
      setFullscreenId: X,
      focusedId: K,
      setFocusedId: Q,
      refreshPulse: ee,
      requestRefresh: Y,
      emit: Pe,
      recentActions: se,
      clearRecentActions: w,
      recentAlerts: A,
      clearRecentAlerts: H,
      soundEnabled: $,
      widgetHealth: J,
      reportWidgetHealth: te,
      registerWidgetData: pe,
      snapshot: xe
    }),
    [
      Ie,
      N,
      ue,
      t,
      d,
      C,
      he,
      x,
      G,
      K,
      ee,
      Y,
      Pe,
      se,
      w,
      A,
      H,
      $,
      J,
      te,
      pe,
      xe
    ]
  );
  j(() => {
    if (!G) return;
    const z = (O) => {
      O.key === "Escape" && X(null);
    };
    return document.addEventListener("keydown", z), () => document.removeEventListener("keydown", z);
  }, [G]), j(() => {
    if (!K || typeof document > "u") return;
    document.getElementById(`mt-widget-${K}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [K]), j(() => {
    const z = (O) => {
      if (O.metaKey || O.ctrlKey || O.altKey) return;
      const Z = O.target?.tagName;
      if (Z === "INPUT" || Z === "TEXTAREA" || O.target?.isContentEditable) return;
      const ve = e.shortcuts?.find((be) => be.key === O.key);
      if (ve) {
        O.preventDefault();
        for (const [be, De] of Object.entries(ve.ctx)) ue(be, De);
        return;
      }
      const ge = d.map((be) => be.id).filter((be) => !!be);
      if (ge.length === 0) return;
      const Ce = (be) => {
        const De = K ? ge.indexOf(K) : -1, et = ge[(De + be + ge.length) % ge.length];
        Q(et);
      };
      switch (O.key) {
        case "j":
        case "ArrowDown":
          O.preventDefault(), Ce(1);
          break;
        case "k":
        case "ArrowUp":
          O.preventDefault(), Ce(-1);
          break;
        case "f":
          K && (O.preventDefault(), X(K));
          break;
        case "r":
          K && (O.preventDefault(), Y(K));
          break;
        case "Escape":
          K && Q(null);
          break;
      }
    };
    return document.addEventListener("keydown", z), () => document.removeEventListener("keydown", z);
  }, [d, K, Y, e.shortcuts, ue]);
  const Qe = G ? d.find((z) => z.id === G) : null;
  return /* @__PURE__ */ s(Bn.Provider, { value: Ze, children: /* @__PURE__ */ s("div", { className: `mtc-root mtc-theme-${a}`, "data-theme": a, children: /* @__PURE__ */ s(ys, { children: /* @__PURE__ */ f(qs, { children: [
    /* @__PURE__ */ s(so, { suggest: o }),
    /* @__PURE__ */ s(lo, { templateShortcuts: e.shortcuts }),
    /* @__PURE__ */ s(uo, { toasts: W, dismiss: ye }),
    h.length > 0 && (!b || p) && /* @__PURE__ */ s(
      jo,
      {
        issues: h,
        dismissible: !p,
        onDismiss: () => k(!0)
      }
    ),
    /* @__PURE__ */ f("div", { className: "min-h-full bg-zinc-950 flex flex-col", children: [
      /* @__PURE__ */ f("div", { className: "flex-1 p-3 md:p-5", children: [
        (e.title || i === "full") && /* @__PURE__ */ f("div", { className: "mb-4 flex items-center gap-3 flex-wrap", children: [
          e.title && /* @__PURE__ */ s("h1", { className: "text-lg font-semibold text-zinc-100 tracking-tight mr-1", children: Be(e.title, N) }),
          i === "full" && Object.entries(N).map(([z, O]) => z === "range" ? /* @__PURE__ */ s(vo, { value: O, onChange: (Z) => ue(z, Z) }, z) : /* @__PURE__ */ f(
            "div",
            {
              className: "px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs",
              children: [
                /* @__PURE__ */ s("span", { className: "text-zinc-500 uppercase tracking-wider mr-1", children: z }),
                /* @__PURE__ */ s("span", { className: "text-zinc-100 font-mono", children: O })
              ]
            },
            z
          )),
          i === "full" && /* @__PURE__ */ f("div", { className: "ml-auto flex items-center gap-2", children: [
            g ? /* @__PURE__ */ s(Oo, { frozenAt: e.frozenAt }) : /* @__PURE__ */ f(ft, { children: [
              /* @__PURE__ */ s(_o, { health: J }),
              /* @__PURE__ */ s(ko, { value: C, onChange: E }),
              /* @__PURE__ */ s(To, { onClick: () => Y("*") })
            ] }),
            /* @__PURE__ */ s($o, { enabled: $, onToggle: () => L((z) => !z) }),
            /* @__PURE__ */ s(Co, { compact: x, onToggle: () => T((z) => !z) }),
            !g && /* @__PURE__ */ s(
              Mo,
              {
                onClick: () => {
                  const z = xe();
                  l ? l(z) : Ro(z), he(l ? "Snapshot shared" : "Snapshot downloaded", "ok");
                }
              }
            ),
            /* @__PURE__ */ s(Eo, { onCopied: () => he("URL copied", "ok") }),
            /* @__PURE__ */ s(No, {})
          ] })
        ] }),
        /* @__PURE__ */ s(
          "div",
          {
            className: "grid gap-3 md:gap-4 items-start",
            style: { gridTemplateColumns: `repeat(${u}, 1fr)` },
            children: d.map((z, O) => /* @__PURE__ */ s(
              "div",
              {
                id: z.id ? `mt-widget-${z.id}` : void 0,
                style: {
                  gridColumn: `span ${Le(z.span || 6)}`
                },
                children: /* @__PURE__ */ s(
                  or,
                  {
                    config: z,
                    contentHeight: z.height || bo[z.component] || 280,
                    snapshotKey: rn(z, O)
                  }
                )
              },
              z.id || O
            ))
          }
        )
      ] }),
      i === "full" && /* @__PURE__ */ s(Ao, {})
    ] }),
    Qe && /* @__PURE__ */ s(Po, { widget: Qe, onClose: () => X(null) })
  ] }) }) }) });
}
function jo({
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
function Po({ widget: e, onClose: t }) {
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
        /* @__PURE__ */ s("div", { onClick: (r) => r.stopPropagation(), className: "flex-1 min-h-0", children: /* @__PURE__ */ s(or, { config: e, contentHeight: n }) })
      ]
    }
  );
}
const cr = "medallion-terminal:";
function wt(e, t) {
  if (typeof window > "u" || !window.localStorage) return t;
  try {
    const n = window.localStorage.getItem(cr + e);
    return n == null ? t : JSON.parse(n);
  } catch {
    return t;
  }
}
function kt(e, t) {
  if (!(typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(cr + e, JSON.stringify(t));
    } catch {
    }
}
function Io(e, t) {
  j(() => {
    const n = (r) => {
      if (!(r.metaKey || r.ctrlKey)) return;
      const o = Number(r.key);
      Number.isFinite(o) && o >= 1 && o <= 9 && o <= e && (r.preventDefault(), t(o - 1));
    };
    return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
  }, [e, t]);
}
function ru({
  tabs: e,
  activeIndex: t,
  onSelect: n,
  backendUrl: r,
  theme: o = "dark"
}) {
  const i = Math.max(0, Math.min(t, e.length - 1));
  Io(e.length, n);
  const [l, a] = v(() => /* @__PURE__ */ new Set([i]));
  return j(() => {
    a((c) => c.has(i) ? c : /* @__PURE__ */ new Set([...c, i]));
  }, [i]), e.length === 0 ? null : /* @__PURE__ */ s("div", { className: `mtc-root mtc-theme-${o}`, "data-theme": o, children: /* @__PURE__ */ f("div", { className: "min-h-full bg-zinc-950", children: [
    /* @__PURE__ */ s(Lo, { tabs: e, activeIndex: i, onSelect: n }),
    e.map((c, u) => /* @__PURE__ */ s("div", { style: { display: u === i ? "block" : "none" }, children: l.has(u) && /* @__PURE__ */ s(ar, { template: c.template, backendUrl: r, theme: o }) }, u))
  ] }) });
}
function Lo({
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
function su(e = 0) {
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
function ur(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 2);
}
function Ge(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : Math.abs(e) < 1 ? e.toFixed(2) : e.toFixed(1);
}
function dr(e) {
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
const sn = 864e5;
function Do(e) {
  let t = !1, n = 1 / 0, r = -1 / 0;
  for (const o of e) {
    const i = String(o ?? "");
    !t && i.includes(":") && (t = !0);
    const l = new Date(i).getTime();
    isNaN(l) || (l < n && (n = l), l > r && (r = l));
  }
  return { hasTime: t, spanMs: r > n ? r - n : 0 };
}
function Fo(e) {
  return e.hasTime ? e.spanMs <= 2 * sn ? (t) => {
    try {
      const n = new Date(t);
      return isNaN(n.getTime()) ? String(t) : n.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return String(t);
    }
  } : e.spanMs <= 14 * sn ? Ut : je : je;
}
function Uo(e) {
  return e.hasTime ? Ut : je;
}
function Ut(e) {
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
function Bo(e, t = {}) {
  const { decimals: n = 2, as: r = "fraction", signed: o = !1 } = t, i = r === "fraction" ? e * 100 : e;
  return `${o && i > 0 ? "+" : ""}${i.toFixed(n)}%`;
}
function Ko(e, t = "USD", n = {}) {
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
function Ho(e, t = {}) {
  const { signed: n = !1, as: r = "fraction" } = t, o = r === "fraction" ? e * 1e4 : e * 100;
  return `${n && o > 0 ? "+" : ""}${Math.round(o)} bps`;
}
const Ee = {
  ok: "var(--mtc-ok)",
  warn: "var(--mtc-warning)",
  danger: "var(--mtc-danger)",
  error: "var(--mtc-danger)",
  info: "var(--mtc-accent)",
  muted: "var(--mtc-muted)"
}, fe = [
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#a78bfa",
  "#f472b6",
  "#22d3ee",
  "#94a3b8"
], Te = {
  backgroundColor: "var(--mtc-surface)",
  border: "1px solid var(--mtc-border)",
  borderRadius: 6,
  fontSize: 12,
  color: "var(--mtc-fg)"
};
function Wo(e, t) {
  return e ? e in Ee ? Ee[e] : e.startsWith("#") ? e : fe[t % fe.length] : fe[t % fe.length];
}
function fr(e, t = fe) {
  return e.map((n, r) => t[r % t.length]);
}
const qo = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], Go = {
  buy: "var(--mtc-ok)",
  sell: "var(--mtc-danger)",
  info: "var(--mtc-accent)",
  warn: "var(--mtc-warning)"
}, Vo = "var(--mtc-grid)", Nt = "var(--mtc-border)", rt = "var(--mtc-muted)", ht = "var(--mtc-surface)", Jo = "var(--mtc-muted-subtle)";
function Xo({ data: e, options: t }) {
  const { hoverTime: n, setHoverTime: r } = lr(), o = U(null), i = I(() => ti(e), [e]), { tickFormatter: l, labelFormatter: a } = I(() => {
    const m = Do(i?.points.map((h) => h._ts) ?? []);
    return {
      tickFormatter: Fo(m),
      labelFormatter: Uo(m)
    };
  }, [i]), c = I(
    () => fr(i?.keys ?? [], qo),
    [i]
  ), u = t?.brush === !0;
  if (!i) return /* @__PURE__ */ s(F, { children: "No data" });
  const d = n != null && n !== o.current;
  return /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(
    zr,
    {
      data: i.points,
      onMouseMove: (m) => {
        const h = m?.activeLabel;
        if (h != null) {
          const p = String(h);
          o.current = p, r(p);
        }
      },
      onMouseLeave: () => {
        o.current = null, r(null);
      },
      children: [
        /* @__PURE__ */ s(He, { strokeDasharray: "3 3", stroke: Vo }),
        /* @__PURE__ */ s(
          We,
          {
            dataKey: "_ts",
            stroke: Nt,
            tick: { fontSize: 11, fill: rt },
            tickFormatter: l
          }
        ),
        /* @__PURE__ */ s(
          qe,
          {
            stroke: Nt,
            tick: { fontSize: 11, fill: rt },
            tickFormatter: ur,
            width: 60
          }
        ),
        /* @__PURE__ */ s(
          _e,
          {
            contentStyle: Te,
            labelStyle: { color: rt },
            labelFormatter: a
          }
        ),
        i.keys.map((m, h) => /* @__PURE__ */ s(
          Ar,
          {
            type: "monotone",
            dataKey: m,
            stroke: c[h],
            dot: !1,
            strokeWidth: 2
          },
          m
        )),
        u && i.points.length > 4 && /* @__PURE__ */ s(
          Pn,
          {
            dataKey: "_ts",
            height: 20,
            stroke: Nt,
            fill: ht,
            travellerWidth: 6,
            tickFormatter: l
          }
        ),
        d && /* @__PURE__ */ s(_r, { x: n, stroke: Jo, strokeDasharray: "3 3" }),
        i.annotations.map((m, h) => {
          const p = m.color ?? (m.kind ? Go[m.kind] : null) ?? rt;
          if (m.endTimestamp) {
            const [g, b] = m.timestamp <= m.endTimestamp ? [m.timestamp, m.endTimestamp] : [m.endTimestamp, m.timestamp];
            return /* @__PURE__ */ s(
              Tr,
              {
                x1: g,
                x2: b,
                fill: p,
                fillOpacity: 0.1,
                stroke: p,
                strokeOpacity: 0.4,
                strokeDasharray: "3 3",
                label: { value: m.label, position: "insideTopLeft", fontSize: 10, fill: p }
              },
              h
            );
          }
          return m.value === void 0 ? null : /* @__PURE__ */ s(
            $r,
            {
              x: m.timestamp,
              y: m.value,
              r: 6,
              fill: p,
              stroke: ht,
              strokeWidth: 2,
              ifOverflow: "extendDomain",
              shape: (g) => /* @__PURE__ */ s(Yo, { ...g, kind: m.kind, color: p, label: m.label })
            },
            h
          );
        })
      ]
    }
  ) });
}
function Yo({ cx: e, cy: t, kind: n, color: r, label: o }) {
  if (e == null || t == null) return null;
  let i;
  if (n === "buy")
    i = `M${e} ${t - 7} L${e + 6} ${t + 4} L${e - 6} ${t + 4} Z`;
  else if (n === "sell")
    i = `M${e} ${t + 7} L${e + 6} ${t - 4} L${e - 6} ${t - 4} Z`;
  else
    return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("circle", { cx: e, cy: t, r: 5, fill: r, stroke: ht, strokeWidth: 2, children: /* @__PURE__ */ s("title", { children: o }) }) });
  return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("path", { d: i, fill: r, stroke: ht, strokeWidth: 1.5, children: /* @__PURE__ */ s("title", { children: o }) }) });
}
const Zo = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function Qo(e) {
  for (const t of Zo)
    if (t in e) return t;
  return null;
}
function ei(e) {
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
function ti(e) {
  if (!e) return null;
  const t = ei(e);
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const n = e[0], r = Qo(n);
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
const ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Timeseries: Xo
}, Symbol.toStringTag, { value: "Module" })), ri = {
  buy: { shape: "arrowUp", position: "belowBar", color: "ok" },
  sell: { shape: "arrowDown", position: "aboveBar", color: "danger" },
  info: { shape: "circle", position: "aboveBar", color: "accent" },
  warn: { shape: "circle", position: "aboveBar", color: "warning" }
}, on = {
  shape: "circle",
  position: "aboveBar",
  color: "muted"
}, Se = {
  accent: "#38bdf8",
  danger: "#f87171",
  ok: "#34d399",
  warning: "#fbbf24",
  muted: "#8a95a3",
  mutedSubtle: "#5f6b7a",
  border: "#2b323c",
  grid: "#242b34"
};
function si({ data: e }) {
  const { hoverTime: t, setHoverTime: n } = lr(), r = U(null), o = U(null), i = U(null), l = U(null), a = U(null), c = U(null), u = U(Se);
  j(() => {
    if (!r.current) return;
    const m = ai(r.current);
    u.current = m;
    const h = Kr(r.current, {
      layout: {
        background: { type: Hr.Solid, color: "transparent" },
        textColor: m.muted,
        fontSize: 11
      },
      grid: {
        vertLines: { color: m.grid },
        horzLines: { color: m.grid }
      },
      crosshair: {
        vertLine: { color: m.mutedSubtle, width: 1, style: 2 },
        horzLine: { color: m.mutedSubtle, width: 1, style: 2 }
      },
      rightPriceScale: {
        borderColor: m.border
      },
      timeScale: {
        borderColor: m.border,
        timeVisible: !0
      },
      handleScroll: !0,
      handleScale: !0
    }), p = h.addSeries(Wr, {
      upColor: m.ok,
      downColor: m.danger,
      borderDownColor: m.danger,
      borderUpColor: m.ok,
      wickDownColor: m.danger,
      wickUpColor: m.ok
    }), g = h.addSeries(qr, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume"
    });
    h.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 }
    }), o.current = h, i.current = p, l.current = g, a.current = Gr(p, []), h.subscribeCrosshairMove((k) => {
      if (k.time != null) {
        const N = String(k.time);
        c.current = N, n(N);
      } else
        c.current = null, n(null);
    });
    const b = new ResizeObserver((k) => {
      const { width: N, height: _ } = k[0].contentRect;
      h.applyOptions({ width: N, height: _ });
    });
    return b.observe(r.current), () => {
      b.disconnect(), h.remove(), o.current = null, i.current = null, l.current = null, a.current = null;
    };
  }, []), j(() => {
    const m = o.current, h = i.current;
    if (!m || !h) return;
    if (t == null) {
      m.clearCrosshairPosition();
      return;
    }
    if (t === c.current) return;
    const p = h.data?.()[0]?.close ?? 0;
    m.setCrosshairPosition(p, t, h);
  }, [t]);
  const d = I(() => li(e), [e]);
  return j(() => {
    if (i.current && d.candles.length !== 0) {
      if (i.current.setData(d.candles), d.volumes.length > 0 && l.current) {
        const m = u.current;
        l.current.setData(d.volumes.map((h) => ({
          ...h,
          color: h.direction === "down" ? ln(m.danger, 0.3) : ln(m.ok, 0.3)
        })));
      }
      a.current && a.current.setMarkers(oi(d.annotations, u.current)), o.current?.timeScale().fitContent();
    }
  }, [d]), /* @__PURE__ */ f("div", { className: "relative w-full h-full", children: [
    /* @__PURE__ */ s("div", { ref: r, className: "w-full h-full" }),
    d.candles.length === 0 && /* @__PURE__ */ s("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s(F, { children: "No data" }) })
  ] });
}
function oi(e, t) {
  return e.map((n) => {
    const r = n.kind ? ri[n.kind] ?? on : on;
    return {
      time: mr(n.timestamp),
      position: r.position,
      shape: r.shape,
      color: n.color ?? t[r.color],
      text: n.label
    };
  });
}
const ii = ["timestamp", "date", "time", "datetime", "ts", "t"];
function Ue(e, t) {
  for (const r of t)
    if (r in e) return r;
  const n = Object.keys(e).reduce((r, o) => (r[o.toLowerCase()] = o, r), {});
  for (const r of t)
    if (n[r]) return n[r];
  return null;
}
function mr(e) {
  if (typeof e == "number")
    return e > 1e12 ? Math.floor(e / 1e3) : e;
  const t = String(e).trim();
  if (t.includes("T") || / \d/.test(t)) {
    const n = new Date(t.replace(" ", "T"));
    if (!isNaN(n.getTime())) return Math.floor(n.getTime() / 1e3);
  }
  return t.split(" ")[0].split("T")[0];
}
function li(e) {
  const t = { candles: [], volumes: [], annotations: [] };
  if (!e) return t;
  let n, r = [];
  if (Array.isArray(e))
    n = e;
  else if (typeof e == "object" && e !== null) {
    const p = e;
    n = Array.isArray(p.bars) ? p.bars : [], Array.isArray(p.annotations) && (r = p.annotations.map((g) => {
      const b = g;
      return {
        timestamp: String(b.timestamp ?? ""),
        value: typeof b.value == "number" ? b.value : void 0,
        label: String(b.label ?? ""),
        kind: b.kind != null ? String(b.kind) : void 0,
        color: b.color != null ? String(b.color) : void 0
      };
    }));
  } else
    n = [];
  if (n.length === 0 || typeof n[0] != "object" || n[0] === null)
    return { ...t, annotations: r };
  const o = n[0], i = Ue(o, ii), l = Ue(o, ["open", "o"]), a = Ue(o, ["high", "h"]), c = Ue(o, ["low", "l"]), u = Ue(o, ["close", "c"]), d = Ue(o, ["volume", "vol", "v"]);
  if (!i || !l || !a || !c || !u) return { ...t, annotations: r };
  const m = [], h = [];
  for (const p of n) {
    const g = p, b = mr(g[i]), k = Number(g[l]), N = Number(g[a]), _ = Number(g[c]), C = Number(g[u]);
    m.push({ time: b, open: k, high: N, low: _, close: C }), d && g[d] != null && h.push({
      time: b,
      value: Number(g[d]),
      direction: C >= k ? "up" : "down"
    });
  }
  return { candles: m, volumes: h, annotations: r };
}
function ai(e) {
  const t = getComputedStyle(e), n = (r, o) => t.getPropertyValue(r).trim() || o;
  return {
    accent: n("--mtc-accent", Se.accent),
    danger: n("--mtc-danger", Se.danger),
    ok: n("--mtc-ok", Se.ok),
    warning: n("--mtc-warning", Se.warning),
    muted: n("--mtc-muted", Se.muted),
    mutedSubtle: n("--mtc-muted-subtle", Se.mutedSubtle),
    border: n("--mtc-border", Se.border),
    grid: n("--mtc-grid", Se.grid)
  };
}
function ln(e, t) {
  const n = e.trim().match(/^#([0-9a-f]{6})$/i);
  if (n) {
    const o = parseInt(n[1], 16);
    return `rgba(${o >> 16 & 255}, ${o >> 8 & 255}, ${o & 255}, ${t})`;
  }
  const r = e.trim().match(/^rgba?\(([^)]+)\)$/i);
  if (r) {
    const o = r[1].split(/[\s,\/]+/).map(Number).filter(Number.isFinite);
    if (o.length >= 3) return `rgba(${o[0]}, ${o[1]}, ${o[2]}, ${t})`;
  }
  return e;
}
const ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Candlestick: si
}, Symbol.toStringTag, { value: "Module" }));
function pr(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
const ui = /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:?\d{2})$/;
function di(e) {
  if (typeof e != "string" || !ui.test(e.trim())) return e;
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function hr(e) {
  if (!e) return [];
  if (typeof e == "string") return [{ body: e }];
  if (!Array.isArray(e) && typeof e == "object" && e !== null) {
    const t = e;
    return Array.isArray(t.items) ? hr(t.items) : [an(t)];
  }
  return Array.isArray(e) ? e.map((t) => typeof t == "string" ? { body: t } : typeof t == "object" && t !== null ? an(t) : { body: String(t) }) : [];
}
function an(e) {
  return {
    id: e.id != null ? String(e.id) : void 0,
    title: e.title != null ? String(e.title) : void 0,
    meta: e.meta ?? e.source ?? e.date ?? e.author ? [e.source, e.author, di(e.date)].filter(Boolean).map(String).join(" · ") : void 0,
    body: e.body ?? e.content ?? e.summary ?? e.text ? String(e.body ?? e.content ?? e.summary ?? e.text) : void 0,
    tags: Array.isArray(e.tags) ? e.tags.map(String) : void 0,
    image: e.image != null ? String(e.image) : e.image_url != null ? String(e.image_url) : e.thumbnail != null ? String(e.thumbnail) : void 0,
    url: pr(e.url ?? e.uri ?? e.link ?? e.href)
  };
}
const fi = 25, mi = 600;
function pi({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = t?.pageSize || fi, o = t?.row_context, i = t?.heat_columns ?? [], l = t?.export === !0, a = t?.tick_flash === !0, c = t?.search === !0, u = t?.column_formats ?? {}, { columns: d, rows: m, labels: h, formats: p } = I(() => hi(e), [e]), g = I(() => ({ ...p, ...u }), [p, u]), [b, k] = v(null), [N, _] = v(!0), [C, E] = v(0), [x, T] = v(""), $ = (y, w) => {
    const A = d[0] != null ? y[d[0]] : void 0;
    return A == null ? `_idx_${w}` : String(A);
  }, L = U(/* @__PURE__ */ new Map()), [G, X] = v(/* @__PURE__ */ new Map());
  j(() => {
    if (!a) return;
    const y = /* @__PURE__ */ new Map();
    for (let A = 0; A < m.length; A++) {
      const R = m[A], H = $(R, A), J = L.current.get(H), re = {};
      let te = null;
      for (const ne of d) {
        const pe = R[ne];
        typeof pe == "number" && (re[ne] = pe, te == null && J && J[ne] != null && J[ne] !== pe && (te = pe > J[ne] ? "up" : "down"));
      }
      L.current.set(H, re), te && y.set(H, te);
    }
    if (y.size === 0) return;
    X((A) => {
      const R = new Map(A);
      for (const [H, J] of y) R.set(H, J);
      return R;
    });
    const w = setTimeout(() => {
      X((A) => {
        const R = new Map(A);
        for (const [H, J] of y)
          R.get(H) === J && R.delete(H);
        return R;
      });
    }, mi);
    return () => clearTimeout(w);
  }, [m, a]);
  const K = I(() => {
    const y = {};
    for (const w of i) {
      let A = 1 / 0, R = -1 / 0;
      for (const H of m) {
        const J = H[w];
        typeof J == "number" && Number.isFinite(J) && (J < A && (A = J), J > R && (R = J));
      }
      Number.isFinite(A) && Number.isFinite(R) && (y[w] = { min: A, max: R });
    }
    return y;
  }, [m, i]), Q = (y) => {
    if (!o) return;
    const w = o.field ?? d[0], A = y[w];
    A != null && n(o.key, String(A));
  }, ee = I(() => {
    const y = x.trim().toLowerCase();
    return y ? m.filter(
      (w) => d.some((A) => {
        const R = w[A];
        return R != null && String(R).toLowerCase().includes(y);
      })
    ) : m;
  }, [m, d, x]), D = I(() => b ? [...ee].sort((y, w) => {
    const A = y[b], R = w[b];
    if (A == null && R == null) return 0;
    if (A == null) return 1;
    if (R == null) return -1;
    const H = typeof A == "number" && typeof R == "number" ? A - R : String(A).localeCompare(String(R));
    return N ? H : -H;
  }) : ee, [ee, b, N]), W = Math.max(1, Math.ceil(D.length / r)), M = Math.min(C, W - 1), P = D.slice(M * r, (M + 1) * r), Y = D.length > r, V = (y) => {
    b === y ? _(!N) : (k(y), _(!0)), E(0);
  };
  return d.length === 0 ? /* @__PURE__ */ s(F, { children: "No data" }) : /* @__PURE__ */ f("div", { className: "flex flex-col h-full", children: [
    (c || l) && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 pb-1", children: [
      c && /* @__PURE__ */ s(
        "input",
        {
          type: "text",
          value: x,
          onChange: (y) => {
            T(y.target.value), E(0);
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
              d.map(jt).join(","),
              ...D.map((H) => d.map((J) => jt(H[J])).join(","))
            ], w = new Blob([y.join(`
`)], { type: "text/csv;charset=utf-8" }), A = URL.createObjectURL(w), R = document.createElement("a");
            R.href = A, R.download = "export.csv", R.click(), URL.revokeObjectURL(A);
          },
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0",
          title: "Download as CSV",
          children: "↓ CSV"
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "overflow-auto flex-1 min-h-0", children: /* @__PURE__ */ f("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ s("thead", { className: "sticky top-0 bg-zinc-900", children: /* @__PURE__ */ s("tr", { children: d.map((y) => {
        const w = g[y], A = w && w !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(w);
        return /* @__PURE__ */ f(
          "th",
          {
            onClick: () => V(y),
            className: `px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${A ? "text-right" : "text-left"}`,
            children: [
              h[y] ?? y,
              b === y && /* @__PURE__ */ s("span", { className: "ml-1 text-zinc-500", children: N ? "↑" : "↓" })
            ]
          },
          y
        );
      }) }) }),
      /* @__PURE__ */ s("tbody", { children: P.map((y, w) => {
        const A = G.get($(y, w));
        return /* @__PURE__ */ s(
          "tr",
          {
            onClick: o ? () => Q(y) : void 0,
            className: `border-b border-zinc-800/60 transition-colors duration-300 ${A === "up" ? "bg-emerald-500/15" : A === "down" ? "bg-red-500/15" : ""} ${o ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/40"}`,
            children: d.map((H) => {
              const J = K[H], re = y[H], te = J && typeof re == "number" ? { backgroundColor: bi(re, J.min, J.max) } : void 0, ne = g[H];
              if (ne === "link" && re != null) {
                const ye = typeof re == "object" && !Array.isArray(re) ? re : { label: void 0, url: re }, ue = pr(ye.url), $e = ye.label != null && ye.label !== "" ? String(ye.label) : ue ?? "";
                return /* @__PURE__ */ s("td", { className: "px-3 py-2.5 whitespace-nowrap", style: te, children: ue ? /* @__PURE__ */ f(
                  "a",
                  {
                    href: ue,
                    ...ue.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" },
                    className: "text-sky-400 hover:underline",
                    children: [
                      $e,
                      /* @__PURE__ */ s("span", { className: "ml-1 text-xs text-zinc-500", "aria-hidden": "true", children: ue.startsWith("/") ? "→" : "↗" })
                    ]
                  }
                ) : /* @__PURE__ */ s("span", { className: "text-zinc-100", children: $e }) }, H);
              }
              if (ne === "sparkline" && Array.isArray(re))
                return /* @__PURE__ */ s("td", { className: "px-3 py-2.5 whitespace-nowrap", style: te, children: /* @__PURE__ */ s(gi, { values: re }) }, H);
              const pe = ne ? xi(re, ne) : Pt(re), Me = ne ? ne.split(":").slice(1).includes("signed") : !1, Pe = ne && ne !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(ne) ? "text-right" : "", he = Me && typeof re == "number" ? re > 0 ? "text-emerald-400" : re < 0 ? "text-red-400" : "text-zinc-100" : "text-zinc-100";
              return /* @__PURE__ */ s(
                "td",
                {
                  className: `px-3 py-2.5 whitespace-nowrap tabular-nums ${Pe} ${he}`,
                  style: te,
                  children: pe
                },
                H
              );
            })
          },
          w
        );
      }) })
    ] }) }),
    Y && /* @__PURE__ */ f("div", { className: "flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400", children: [
      /* @__PURE__ */ f("span", { children: [
        D.length,
        " rows"
      ] }),
      /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ s("button", { onClick: () => E(0), disabled: M === 0, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "«" }),
        /* @__PURE__ */ s("button", { onClick: () => E((y) => y - 1), disabled: M === 0, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "‹" }),
        /* @__PURE__ */ f("span", { className: "px-2 text-zinc-300", children: [
          M + 1,
          " / ",
          W
        ] }),
        /* @__PURE__ */ s("button", { onClick: () => E((y) => y + 1), disabled: M >= W - 1, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "›" }),
        /* @__PURE__ */ s("button", { onClick: () => E(W - 1), disabled: M >= W - 1, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "»" })
      ] })
    ] })
  ] });
}
function hi(e) {
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
        (d) => Array.isArray(d) ? Object.fromEntries(l.map((m, h) => [m, d[h]])) : d
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
function bi(e, t, n) {
  if (n === t) return "transparent";
  if (t < 0 && n > 0) {
    const o = Math.max(Math.abs(t), Math.abs(n)), i = Math.max(-1, Math.min(1, e / o));
    return i >= 0 ? `rgba(16, 185, 129, ${0.35 * i})` : `rgba(239, 68, 68, ${0.35 * -i})`;
  }
  return `rgba(14, 165, 233, ${0.35 * ((e - t) / (n - t))})`;
}
function jt(e) {
  if (e == null) return "";
  if (typeof e == "object" && !Array.isArray(e) && "url" in e)
    return jt(e.url);
  const t = String(e);
  return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function gi({ values: e }) {
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
function Pt(e) {
  return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function xi(e, t) {
  if (e == null) return "—";
  if (t.split(":")[0] === "datetime") return Ut(e);
  if (typeof e != "number") return Pt(e);
  const [n, ...r] = t.split(":"), o = new Set(r), i = o.has("signed");
  switch (n) {
    case "currency": {
      const l = r.find((a) => a !== "signed") ?? "USD";
      return Ko(e, l);
    }
    case "percent": {
      const l = o.has("p") ? "percent" : "fraction";
      return Bo(e, { signed: i, as: l });
    }
    case "bps":
      return Ho(e, { signed: i });
    case "compact":
      return Ge(e);
    default:
      return Pt(e);
  }
}
const yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DataTable: pi
}, Symbol.toStringTag, { value: "Module" })), vi = 400;
function br(e, t = vi) {
  const [n, r] = v(e), o = U(e), i = U(0), l = U(void 0);
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
      const d = Math.min(1, (u - i.current) / t), m = 1 - Math.pow(1 - d, 3), h = o.current + (e - o.current) * m;
      r(h), d < 1 && (l.current = requestAnimationFrame(c));
    };
    return l.current = requestAnimationFrame(c), () => {
      l.current && cancelAnimationFrame(l.current);
    };
  }, [e, t]), n;
}
const wi = 600;
function ki({ data: e }) {
  const { value: t, delta: n, unit: r, label: o, trend: i } = Si(e), l = br(t), a = U(null), [c, u] = v(null);
  return j(() => {
    const m = a.current;
    if (a.current = t, m == null || m === t) return;
    u(t > m ? "up" : "down");
    const h = setTimeout(() => u(null), wi);
    return () => clearTimeout(h);
  }, [t]), /* @__PURE__ */ f("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ f("div", { className: `text-3xl font-bold tabular-nums transition-colors duration-300 ${c === "up" ? "text-emerald-300" : c === "down" ? "text-red-300" : "text-white"}`, children: [
      dr(l),
      r && /* @__PURE__ */ s("span", { className: "text-base font-normal text-zinc-400 ml-1", children: r })
    ] }),
    n != null && /* @__PURE__ */ f("div", { className: `text-sm font-medium ${n >= 0 ? "text-emerald-400" : "text-red-400"}`, children: [
      n >= 0 ? "▲" : "▼",
      " ",
      zi(n)
    ] }),
    i && i.length >= 2 && /* @__PURE__ */ s(Ni, { values: i }),
    o && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: o })
  ] });
}
function Ni({ values: e }) {
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
function Si(e) {
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
function zi(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const Ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Metric: ki
}, Symbol.toStringTag, { value: "Module" })), _i = 1500;
function Ti({ data: e }) {
  const t = hr(e), n = U(/* @__PURE__ */ new Set()), r = U(!1), [o, i] = v(/* @__PURE__ */ new Set());
  return j(() => {
    const l = t.map(cn);
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
    }, _i);
    return () => clearTimeout(c);
  }, [t]), t.length === 0 ? /* @__PURE__ */ s(F, { children: "No content" }) : /* @__PURE__ */ s("div", { className: "overflow-auto h-full space-y-3", children: t.map((l, a) => {
    const c = cn(l), u = o.has(c) ? "bg-sky-500/5" : "";
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
                ...l.url.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" },
                className: "hover:text-sky-400 hover:underline",
                children: [
                  l.title || $i(l.url),
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
function cn(e) {
  return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function $i(e) {
  try {
    return new URL(e).hostname;
  } catch {
    return e;
  }
}
const Ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Text: Ti
}, Symbol.toStringTag, { value: "Module" }));
function Ei({ options: e }) {
  const { dispatch: t, ctx: n, setCtx: r, backendUrl: o, widgets: i } = ae(), [l, a] = v(""), [c, u] = v(!1), [d, m] = v(null), [h, p] = v(null), g = e?.url, b = !!o, k = ce(async () => {
    const _ = l.trim();
    if (!(!_ || c) && !(!b && !g)) {
      u(!0), p(null), m(null);
      try {
        const C = b ? await fetch(ms(o), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ps(_, n, i))
        }) : await fetch(g, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: _ })
        });
        if (!C.ok) throw new Error(`HTTP ${C.status}`);
        const E = await C.json(), x = E.text ?? E.dialogue?.text;
        if (x && m(x), E.context?.values)
          for (const [T, $] of Object.entries(E.context.values)) r(T, $);
        E.actions && E.actions.length > 0 && t(E.actions, { replaceAll: E.replace_all }), a("");
      } catch (C) {
        p(C instanceof Error ? C.message : "Request failed");
      } finally {
        u(!1);
      }
    }
  }, [l, c, b, o, g, n, i, t, r]), N = (_) => {
    _.key === "Enter" && !_.shiftKey && (_.preventDefault(), k());
  };
  return !b && !g ? /* @__PURE__ */ s(F, { padded: !0, children: "Set a backendUrl on Dashboard or options.url on this widget" }) : /* @__PURE__ */ f("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
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
          onKeyDown: N,
          disabled: c
        }
      ),
      /* @__PURE__ */ s(
        "button",
        {
          onClick: k,
          disabled: c || !l.trim(),
          className: `px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-default
            rounded-lg text-sm text-zinc-200 font-medium shrink-0`,
          children: c ? "..." : "Send"
        }
      )
    ] }),
    d && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-400 leading-relaxed", children: d }),
    h && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: h })
  ] });
}
const Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Prompt: Ei
}, Symbol.toStringTag, { value: "Module" })), st = {
  ok: "var(--mtc-ok)",
  warn: "var(--mtc-warning)",
  danger: "var(--mtc-danger)",
  error: "var(--mtc-danger)",
  info: "var(--mtc-accent)",
  muted: "var(--mtc-muted)"
}, St = "M 16 104 A 84 84 0 0 1 184 104";
function Oi({ data: e }) {
  const t = Ri(e);
  if (!t) return /* @__PURE__ */ s(F, { children: "No data" });
  const n = t.max - t.min, r = n > 0 ? Math.max(0, Math.min(1, (t.value - t.min) / n)) : 0, o = t.bands.find((l) => t.value >= l.from && t.value <= l.to), i = st[o?.color ?? "info"] ?? st.info;
  return /* @__PURE__ */ f("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ f("svg", { viewBox: "0 0 200 120", className: "w-full max-w-[260px]", children: [
      /* @__PURE__ */ s("path", { d: St, fill: "none", stroke: "var(--mtc-grid)", strokeWidth: "16", pathLength: "100" }),
      t.bands.map((l, a) => {
        const c = (l.from - t.min) / n, u = (l.to - t.min) / n;
        return /* @__PURE__ */ s(
          "path",
          {
            d: St,
            fill: "none",
            stroke: st[l.color] ?? st.muted,
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
          d: St,
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
          fill: "var(--mtc-fg)",
          style: { fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
          children: ji(t.value, t.min, t.max)
        }
      )
    ] }),
    t.label && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500 text-center px-2 truncate max-w-full", children: t.label })
  ] });
}
function Ri(e) {
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
function ji(e, t, n) {
  return t === 0 && n === 1 ? `${(e * 100).toFixed(1)}%` : t === -1 && n === 1 ? e >= 0 ? `+${e.toFixed(2)}` : e.toFixed(2) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const Pi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Gauge: Oi
}, Symbol.toStringTag, { value: "Module" }));
function Ii({ data: e }) {
  const t = I(() => Li(e), [e]);
  if (!t) return /* @__PURE__ */ s(F, { children: "No data" });
  const { slices: n, total: r } = t, o = n.map((a, c) => Wo(a.color, c)), i = n.reduce((a, c) => c.value > a.value ? c : a), l = i.value / r * 100;
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ f("div", { className: "flex-1 relative min-h-0", children: [
      /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Cr, { children: [
        /* @__PURE__ */ s(
          Er,
          {
            data: n,
            dataKey: "value",
            nameKey: "label",
            innerRadius: "60%",
            outerRadius: "92%",
            paddingAngle: 2,
            stroke: "none",
            isAnimationActive: !1,
            children: n.map((a, c) => /* @__PURE__ */ s(In, { fill: o[c] }, c))
          }
        ),
        /* @__PURE__ */ s(
          _e,
          {
            contentStyle: Te,
            formatter: (a) => {
              const c = Number(a) || 0;
              return [`${Di(c)} (${(c / r * 100).toFixed(1)}%)`, ""];
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
function Li(e) {
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
function Di(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const Fi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Distribution: Ii
}, Symbol.toStringTag, { value: "Module" })), Ui = 96, Bi = 22;
function Ki({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = I(() => Wi(e), [e]);
  if (!r) return /* @__PURE__ */ s(F, { children: "No data" });
  const o = t?.row_context, i = t?.col_context, l = !!(o || i), a = (k, N) => {
    o && n(o.key, r.rows[k]), i && n(i.key, r.columns[N]);
  }, { rows: c, columns: u, cells: d, min: m, max: h, scale: p } = r, g = d.length <= 60, b = I(() => {
    const k = c.map(() => Array(u.length).fill(void 0));
    for (const N of d) k[N.row][N.col] = N;
    return k;
  }, [c, u, d]);
  return /* @__PURE__ */ f("div", { className: "h-full w-full overflow-auto flex flex-col", children: [
    /* @__PURE__ */ f(
      "div",
      {
        className: "inline-grid min-w-full",
        style: {
          gridTemplateColumns: `${Ui}px repeat(${u.length}, minmax(28px, 1fr))`,
          gap: 2
        },
        children: [
          /* @__PURE__ */ s("div", { className: "sticky left-0 top-0 z-20 bg-zinc-900" }),
          u.map((k) => /* @__PURE__ */ s(
            "div",
            {
              className: "text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900",
              style: { height: Bi },
              children: k
            },
            `c-${k}`
          )),
          c.flatMap((k, N) => [
            /* @__PURE__ */ s(
              "div",
              {
                className: "text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900",
                style: { minHeight: 30 },
                children: k
              },
              `rl-${N}`
            ),
            ...u.map((_, C) => {
              const E = b[N][C];
              if (!E) return /* @__PURE__ */ s("div", { className: "bg-zinc-900 rounded-sm" }, `e-${N}-${C}`);
              const x = gr(E.value, m, h, p);
              return /* @__PURE__ */ s(
                "div",
                {
                  onClick: l ? () => a(N, C) : void 0,
                  className: `rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${l ? "cursor-pointer hover:ring-1 hover:ring-zinc-400" : ""}`,
                  style: { backgroundColor: x, minHeight: 30 },
                  title: `${k} × ${u[C]}: ${E.label ?? E.value.toFixed(2)}`,
                  children: g && /* @__PURE__ */ s("span", { className: "text-white/90", children: E.label ?? qi(E.value) })
                },
                `cell-${N}-${C}`
              );
            })
          ])
        ]
      }
    ),
    /* @__PURE__ */ s(Hi, { min: m, max: h, scale: p })
  ] });
}
function Hi({ min: e, max: t, scale: n }) {
  const r = n === "diverging" ? [-1, -0.5, 0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1], o = t - e;
  return /* @__PURE__ */ f("div", { className: "flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ s("span", { className: "tabular-nums", children: Ge(e) }),
    /* @__PURE__ */ s("div", { className: "flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden", children: r.map((i, l) => {
      const a = n === "diverging" ? i * Math.max(Math.abs(e), Math.abs(t)) : e + i * o;
      return /* @__PURE__ */ s("div", { className: "flex-1", style: { backgroundColor: gr(a, e, t, n) } }, l);
    }) }),
    /* @__PURE__ */ s("span", { className: "tabular-nums", children: Ge(t) })
  ] });
}
function Wi(e) {
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
function ke(e, t, n) {
  return Math.round(e + (t - e) * n);
}
function gr(e, t, n, r) {
  if (n === t) return "rgb(63 63 70)";
  if (r === "diverging") {
    const i = Math.max(Math.abs(t), Math.abs(n)) || 1, l = Math.max(-1, Math.min(1, e / i));
    if (l >= 0)
      return `rgb(${ke(39, 16, l)} ${ke(39, 185, l)} ${ke(42, 129, l)})`;
    const a = -l;
    return `rgb(${ke(39, 239, a)} ${ke(39, 68, a)} ${ke(42, 68, a)})`;
  }
  const o = Math.max(0, Math.min(1, (e - t) / (n - t)));
  return `rgb(${ke(39, 14, o)} ${ke(39, 165, o)} ${ke(42, 233, o)})`;
}
function qi(e) {
  return Math.abs(e) < 1 ? e.toFixed(2) : Math.abs(e) < 100 ? e.toFixed(1) : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : Math.round(e).toString();
}
const Gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Heatmap: Ki
}, Symbol.toStringTag, { value: "Module" })), Vi = {
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
function Ji({ data: e, options: t }) {
  const n = I(() => Xi(e), [e]), r = t?.filter === !0, [o, i] = v(""), l = I(() => {
    if (!n) return null;
    if (!o.trim()) return n;
    const a = o.toLowerCase();
    return n.filter(
      (c) => c.label.toLowerCase().includes(a) || (c.body?.toLowerCase().includes(a) ?? !1) || (c.source?.toLowerCase().includes(a) ?? !1) || (c.tags?.some((u) => u.toLowerCase().includes(a)) ?? !1)
    );
  }, [n, o]);
  return !n || n.length === 0 ? /* @__PURE__ */ s(F, { children: "No events" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col", children: [
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
        /* @__PURE__ */ s("div", { className: "flex flex-col items-center pt-1.5 shrink-0", children: /* @__PURE__ */ s("span", { className: `w-2 h-2 rounded-full ${Vi[a.status ?? ""] ?? "bg-zinc-600"}` }) }),
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
function Xi(e) {
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
const Yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Events: Ji
}, Symbol.toStringTag, { value: "Module" })), Zi = "medallion.terminal.v1.TerminalService", Qi = {
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
function el() {
  const { backendUrl: e } = ae(), [t, n] = v(null), [r, o] = v(!0), [i, l] = v(null);
  if (j(() => {
    if (!e) {
      o(!1), n(null);
      return;
    }
    o(!0), l(null);
    const c = new AbortController();
    return fetch(`${e.replace(/\/$/, "")}/${Zi}/ListSources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      signal: c.signal
    }).then((u) => u.ok ? u.json() : Promise.reject(new Error(`HTTP ${u.status}`))).then((u) => n(u.sources ?? [])).catch((u) => {
      u.name !== "AbortError" && l(u.message);
    }).finally(() => o(!1)), () => c.abort();
  }, [e]), !e) return /* @__PURE__ */ s(F, { padded: !0, children: "No backendUrl configured on Dashboard" });
  if (r) return /* @__PURE__ */ s(F, { padded: !0, children: "Loading catalog…" });
  if (i) return /* @__PURE__ */ f(F, { padded: !0, children: [
    "Failed to load: ",
    i
  ] });
  if (!t || t.length === 0) return /* @__PURE__ */ s(F, { padded: !0, children: "No sources registered" });
  const a = {};
  for (const c of t) {
    const u = c.shape && Qi[c.shape] || "other";
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
const tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Catalog: el
}, Symbol.toStringTag, { value: "Module" })), un = 10;
function nl({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = I(() => rl(e), [e]), o = t?.price_context, i = o ? (p, g) => {
    n(o.key, String(p)), o.side_key && n(o.side_key, g === "bid" ? "buy" : "sell");
  } : void 0;
  if (!r) return /* @__PURE__ */ s(F, { children: "No data" });
  const l = r.bids[0]?.price, a = r.asks[0]?.price, c = r.mid ?? (l != null && a != null ? (l + a) / 2 : 0), u = r.spread ?? (l != null && a != null ? a - l : 0), d = r.bids.slice(0, un), m = r.asks.slice(0, un).reverse(), h = Math.max(...r.bids.map((p) => p.size), ...r.asks.map((p) => p.size), 1);
  return /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ f("div", { className: "grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800", children: [
      /* @__PURE__ */ s("span", { children: "Price" }),
      /* @__PURE__ */ s("span", { className: "text-right", children: "Size" }),
      /* @__PURE__ */ s("span", { className: "text-right", children: "Cum" })
    ] }),
    /* @__PURE__ */ f("div", { className: "flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto", children: m.map((p, g) => {
        const b = m.slice(g).reduce((k, N) => k + N.size, 0);
        return /* @__PURE__ */ s(dn, { side: "ask", level: p, cum: b, maxSize: h, onPrice: i }, `ask-${g}`);
      }) }),
      /* @__PURE__ */ f("div", { className: "border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ s("span", { className: "text-zinc-200 tabular-nums", children: It(c) }),
        /* @__PURE__ */ f("span", { className: "text-zinc-500 text-[10px]", children: [
          "spread ",
          It(u)
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "flex-1 overflow-auto", children: d.map((p, g) => {
        const b = d.slice(0, g + 1).reduce((k, N) => k + N.size, 0);
        return /* @__PURE__ */ s(dn, { side: "bid", level: p, cum: b, maxSize: h, onPrice: i }, `bid-${g}`);
      }) })
    ] }),
    r.venue && /* @__PURE__ */ s("div", { className: "text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0", children: r.venue })
  ] });
}
function dn({
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
        /* @__PURE__ */ s("span", { className: `relative ${a} tabular-nums`, children: It(t.price) }),
        /* @__PURE__ */ s("span", { className: "relative text-right text-zinc-200 tabular-nums", children: mn(t.size) }),
        /* @__PURE__ */ s("span", { className: "relative text-right text-zinc-500 tabular-nums", children: mn(n) })
      ]
    }
  );
}
function rl(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = fn(t.bids), r = fn(t.asks);
  return n.length === 0 && r.length === 0 ? null : {
    bids: n,
    asks: r,
    mid: typeof t.mid == "number" ? t.mid : void 0,
    spread: typeof t.spread == "number" ? t.spread : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0
  };
}
function fn(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = t;
    return { price: Number(n.price ?? 0), size: Number(n.size ?? 0) };
  }).filter((t) => Number.isFinite(t.price) && Number.isFinite(t.size) && t.size > 0) : [];
}
function It(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(2);
}
function mn(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OrderBook: nl
}, Symbol.toStringTag, { value: "Module" })), ol = 6;
function il({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = I(() => ll(e), [e]), o = I(
    () => r ? [...r.rows].sort((u, d) => u.key - d.key) : [],
    [r]
  );
  if (!r) return /* @__PURE__ */ s(F, { children: "No data" });
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
        const m = i != null && l > 0 && Math.abs(u.key - i) < l, h = !!c;
        return /* @__PURE__ */ f(
          "tr",
          {
            onClick: h ? () => n(c.key, String(u.key)) : void 0,
            className: `border-b border-zinc-800/40 ${`${m ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"} ${h ? "cursor-pointer" : ""}`}`,
            children: [
              a.map((g) => /* @__PURE__ */ s("td", { className: "text-right px-2 py-1 text-zinc-300", children: hn(u.left?.values?.[g.key], g.format) }, `l-${g.key}`)),
              /* @__PURE__ */ s("td", { className: `text-center px-2 py-1 font-medium ${m ? "text-zinc-100 bg-zinc-950/60" : "text-zinc-300 bg-zinc-950/40"}`, children: u.key.toLocaleString() }),
              a.map((g) => /* @__PURE__ */ s("td", { className: "text-right px-2 py-1 text-zinc-300", children: hn(u.right?.values?.[g.key], g.format) }, `r-${g.key}`))
            ]
          },
          d
        );
      }) })
    ] }) })
  ] });
}
function ll(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e;
  if (!Array.isArray(t.rows) || t.rows.length === 0) return null;
  const n = t.rows.map((i) => {
    const l = i;
    return {
      // Accept legacy options shape (`strike`/`call`/`put`) so authored
      // fixtures keep rendering during migration.
      key: Number(l.key ?? l.strike ?? 0),
      left: pn(l.left ?? l.call),
      right: pn(l.right ?? l.put)
    };
  }), r = al(t.measures), o = r.length > 0 ? r : cl(n);
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
function al(e) {
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
function cl(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of [n.left, n.right])
      if (r?.values) for (const o of Object.keys(r.values)) t.add(o);
  return Array.from(t).slice(0, ol).map((n) => ({ key: n, label: n }));
}
function pn(e) {
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
function hn(e, t) {
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
const ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PairedGrid: il
}, Symbol.toStringTag, { value: "Module" })), dl = /* @__PURE__ */ new Set([
  "ACTION_STATUS_OK",
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]), fl = /* @__PURE__ */ new Set([
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]);
function dt(e) {
  return !!e && dl.has(e);
}
function bn(e) {
  return !!e && fl.has(e);
}
const ml = 64;
function pl(e, t) {
  const [n, r] = v([]), [o, i] = v(!1), [l, a] = v(null);
  return j(() => {
    if (!e || !t || !!!(t.clientRequestId || t.id || t.actionId)) return;
    r([]), i(!1), a(null);
    const u = new AbortController();
    let d = !1;
    return (async () => {
      try {
        const m = await fetch(hs(e), {
          method: "POST",
          headers: { "Content-Type": Dn },
          body: JSON.stringify(bs(t)),
          signal: u.signal
        });
        if (!m.ok) throw new Error(`WatchAction: HTTP ${m.status}`);
        if (!m.body) throw new Error("WatchAction: no response body");
        const h = m.body.getReader();
        await Fn(h, {
          onMessage: (p) => {
            const g = p;
            r((b) => b.length >= ml ? [...b.slice(1), g] : [...b, g]), dt(g.status) && i(!0);
          },
          onTrailer: (p) => {
            if (p.error) {
              const g = p.error.code ?? "unknown", b = p.error.message ?? "watch error";
              a(`${g}: ${b}`);
            }
            i(!0);
          },
          isDisposed: () => d
        }), h.releaseLock();
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
function hl({ options: e }) {
  const t = e ?? {}, { ctx: n, toast: r, backendUrl: o, emit: i } = ae(), l = t.symbol ?? n.symbol ?? "", a = t.url, c = t.action_id ?? "place_order", u = o ? "connect" : a ? "url" : null, [d, m] = v("buy"), [h, p] = v(""), [g, b] = v(""), k = U(n.price);
  j(() => {
    n.price !== k.current && (k.current = n.price, n.price != null && b(n.price));
  }, [n.price]);
  const N = U(n.side);
  j(() => {
    n.side !== N.current && (N.current = n.side, (n.side === "buy" || n.side === "sell") && m(n.side));
  }, [n.side]);
  const [_, C] = v(!1), [E, x] = v(null), [T, $] = v(null), [L, G] = v(!1), [X, K] = v(null), Q = pl(u === "connect" ? o : void 0, X);
  j(() => {
    if (!Q.latest) return;
    const M = Q.latest;
    M.message && x(M.message);
    const P = dt(M.status);
    i({
      type: "action",
      actionId: M.action_id ?? c,
      clientRequestId: M.client_request_id ?? "",
      status: String(M.status ?? ""),
      message: M.message,
      terminal: P
    }), P && (M.message && r(M.message, bn(M.status) ? "error" : "ok"), K(null));
  }, [Q.latest, r, i, c]), j(() => {
    L && G(!1);
  }, [h, g, d]);
  const ee = ce(async () => {
    if (!u || _) return;
    const M = Number(h);
    if (!Number.isFinite(M) || M <= 0) {
      $("Amount must be a positive number");
      return;
    }
    const P = g ? Number(g) : void 0;
    if (g && (!Number.isFinite(P) || P <= 0)) {
      $("Price must be positive");
      return;
    }
    if (t.confirm && !L) {
      G(!0), $(null), x(null);
      return;
    }
    const Y = {
      symbol: l,
      side: d,
      amount: M,
      type: P == null ? "market" : "limit",
      ...P != null && { price: P }
    };
    C(!0), $(null), x(null);
    const V = Wn();
    try {
      const se = u === "connect" ? await fetch(Kn(o), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Hn({ actionId: c, params: Y, clientRequestId: V }))
      }) : await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": V },
        body: JSON.stringify(Y)
      });
      if (!se.ok) throw new Error(`HTTP ${se.status}`);
      const y = await se.json().catch(() => ({})), w = typeof y.message == "string" ? y.message : "Order submitted", A = typeof y.status == "string" ? y.status : "";
      i({
        type: "action",
        actionId: c,
        clientRequestId: V,
        status: A,
        message: w,
        terminal: dt(A)
      }), bn(y.status) ? ($(w), r(w, "error")) : (x(w), r(w, "ok"), p(""), b(""), G(!1)), u === "connect" && !dt(y.status) && K({ clientRequestId: V });
    } catch (se) {
      const y = se instanceof Error ? se.message : "Submit failed";
      $(y), r(y, "error"), i({
        type: "action",
        actionId: c,
        clientRequestId: V,
        status: "ACTION_STATUS_FAILED",
        message: y,
        terminal: !0
      });
    } finally {
      C(!1);
    }
  }, [u, o, a, c, _, h, g, l, d, t.confirm, L, r, i]);
  if (j(() => {
    if (!L) return;
    const M = (P) => {
      P.key === "Escape" && G(!1);
    };
    return document.addEventListener("keydown", M), () => document.removeEventListener("keydown", M);
  }, [L]), !u)
    return /* @__PURE__ */ s(F, { children: "Trade requires backendUrl or options.url" });
  const D = (M) => `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${d === M ? M === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"}`, W = d === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
  if (L) {
    const M = g ? Number(g) : null, P = `${d.toUpperCase()} ${h}${t.quote_unit ? ` ${t.quote_unit}` : ""} ${M ? `@ ${M.toLocaleString()}` : "at market"}`;
    return /* @__PURE__ */ f("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
      /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: "Confirm" }),
      /* @__PURE__ */ s("div", { className: `text-sm font-medium ${d === "buy" ? "text-emerald-300" : "text-red-300"}`, children: P }),
      l && /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: l }),
      /* @__PURE__ */ f("div", { className: "flex gap-2 mt-1", children: [
        /* @__PURE__ */ s(
          "button",
          {
            onClick: () => G(!1),
            className: "flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ s(
          "button",
          {
            onClick: ee,
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
      /* @__PURE__ */ s("button", { onClick: () => m("buy"), className: D("buy"), children: "Buy" }),
      /* @__PURE__ */ s("button", { onClick: () => m("sell"), className: D("sell"), children: "Sell" })
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
      gn,
      {
        label: "Amount",
        unit: t.quote_unit,
        value: h,
        onChange: p,
        disabled: _
      }
    ),
    t.quick_amounts && t.quick_amounts.length > 0 && t.available != null && /* @__PURE__ */ s("div", { className: "flex gap-1", children: t.quick_amounts.map((M, P) => {
      const V = (t.available * M).toFixed(6).replace(/\.?0+$/, "");
      return /* @__PURE__ */ f(
        "button",
        {
          onClick: () => p(V),
          disabled: _,
          className: "flex-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30",
          title: `${(M * 100).toFixed(0)}% of available`,
          children: [
            (M * 100).toFixed(0),
            "%"
          ]
        },
        P
      );
    }) }),
    /* @__PURE__ */ s(
      gn,
      {
        label: "Price",
        placeholder: "market",
        value: g,
        onChange: b,
        disabled: _
      }
    ),
    /* @__PURE__ */ s(
      "button",
      {
        onClick: ee,
        disabled: _ || !h,
        className: `mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${W}`,
        children: _ ? "..." : d === "buy" ? `Buy ${t.quote_unit ?? ""}`.trim() : `Sell ${t.quote_unit ?? ""}`.trim()
      }
    ),
    E && /* @__PURE__ */ s("div", { className: "text-xs text-emerald-400", children: E }),
    T && /* @__PURE__ */ s("div", { className: "text-xs text-red-400", children: T })
  ] });
}
function gn({
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
const bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Trade: hl
}, Symbol.toStringTag, { value: "Module" })), gl = {
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
}, xl = "border-zinc-700 text-zinc-300";
function yl({ data: e, options: t }) {
  const n = I(() => vl(e), [e]);
  if (!n || n.length === 0)
    return /* @__PURE__ */ s(F, { children: "No items" });
  const o = Math.max(5, (t ?? {}).speed_seconds ?? 30);
  return /* @__PURE__ */ s("div", { className: "h-full overflow-hidden flex items-center group", children: /* @__PURE__ */ f(
    "div",
    {
      className: "flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]",
      style: { animationDuration: `${o}s` },
      children: [
        n.map((i, l) => /* @__PURE__ */ s(xn, { item: i }, `a-${l}`)),
        n.map((i, l) => /* @__PURE__ */ s(xn, { item: i, "aria-hidden": !0 }, `b-${l}`))
      ]
    }
  ) });
}
function xn({ item: e, ...t }) {
  const n = gl[e.status ?? ""] ?? xl;
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
function vl(e) {
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
const wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Ticker: yl
}, Symbol.toStringTag, { value: "Module" }));
function kl({ data: e }) {
  const t = I(() => Nl(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(F, { children: "No data" });
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
      /* @__PURE__ */ s("span", { className: "relative w-14 shrink-0 text-zinc-300 tabular-nums", children: Sl(r.price) }),
      /* @__PURE__ */ s("span", { className: "relative ml-auto text-zinc-400 tabular-nums", children: zl(r.volume) })
    ] }, o);
  }) }) });
}
function Nl(e) {
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
function Sl(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
}
function zl(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(0);
}
const Al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VolumeProfile: kl
}, Symbol.toStringTag, { value: "Module" }));
function _l({ data: e }) {
  const t = I(() => Cl(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(F, { children: "No data" }) : /* @__PURE__ */ s("div", { className: "h-full overflow-x-auto overflow-y-hidden", children: /* @__PURE__ */ s("div", { className: "flex items-stretch gap-3 h-full", children: t.map((n, r) => /* @__PURE__ */ s(Tl, { stat: n }, r)) }) });
}
function Tl({ stat: e }) {
  const t = br(e.value), n = e.delta == null ? "" : e.delta >= 0 ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ f("div", { className: "shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0", children: [
    /* @__PURE__ */ s("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate", children: e.label }),
    /* @__PURE__ */ f("div", { className: "flex items-baseline gap-1", children: [
      /* @__PURE__ */ s("span", { className: "text-base font-semibold text-zinc-100 tabular-nums truncate", children: dr(t) }),
      e.unit && /* @__PURE__ */ s("span", { className: "text-[10px] text-zinc-500 shrink-0", children: e.unit })
    ] }),
    /* @__PURE__ */ f("div", { className: "flex items-center gap-2", children: [
      e.delta != null && /* @__PURE__ */ f("span", { className: `text-[10px] font-medium tabular-nums ${n}`, children: [
        e.delta >= 0 ? "▲" : "▼",
        " ",
        El(e.delta)
      ] }),
      e.trend && e.trend.length >= 2 && /* @__PURE__ */ s($l, { values: e.trend })
    ] })
  ] });
}
function $l({ values: e }) {
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
function Cl(e) {
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
function El(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const Ml = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StatStrip: _l
}, Symbol.toStringTag, { value: "Module" }));
function Ol(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const i = e;
    Array.isArray(i.bars) ? t = i.bars : Array.isArray(i.rows) && (t = i.rows);
  }
  if (!t) return null;
  const n = t.filter(
    (i) => i != null && typeof i == "object"
  );
  if (n.length === 0) return null;
  if (n.every((i) => "value" in i)) {
    const i = n.map((l) => ({
      label: String(l.label ?? l.name ?? ""),
      value: Number(l.value ?? 0),
      color: l.color != null ? String(l.color) : void 0
    })).filter((l) => Number.isFinite(l.value));
    return i.length > 0 ? { kind: "single", bars: i } : null;
  }
  const r = [];
  for (const i of n)
    for (const [l, a] of Object.entries(i))
      l === "label" || l === "name" || l === "color" || typeof a == "number" && Number.isFinite(a) && !r.includes(l) && r.push(l);
  return r.length === 0 ? null : { kind: "grouped", rows: n.map((i) => ({
    ...i,
    label: String(i.label ?? i.name ?? "")
  })), series: r };
}
const yn = "var(--mtc-grid)", ot = "var(--mtc-border)", it = "var(--mtc-muted)", vn = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function Rl({ data: e }) {
  const t = I(() => Ol(e), [e]);
  if (!t)
    return /* @__PURE__ */ s(F, { children: "No data" });
  if (t.kind === "grouped") {
    const r = fr(t.series, fe);
    return /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Mt, { data: t.rows, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
      /* @__PURE__ */ s(He, { strokeDasharray: "3 3", stroke: yn }),
      /* @__PURE__ */ s(
        We,
        {
          dataKey: "label",
          stroke: ot,
          tick: { fontSize: 11, fill: it },
          interval: 0
        }
      ),
      /* @__PURE__ */ s(
        qe,
        {
          stroke: ot,
          tick: { fontSize: 11, fill: it },
          tickFormatter: wn,
          width: 50
        }
      ),
      /* @__PURE__ */ s(
        _e,
        {
          contentStyle: Te,
          cursor: { fill: vn }
        }
      ),
      /* @__PURE__ */ s(Ln, { wrapperStyle: { fontSize: 11 } }),
      t.series.map((o, i) => /* @__PURE__ */ s(
        Ot,
        {
          dataKey: o,
          fill: r[i],
          radius: [2, 2, 0, 0]
        },
        o
      ))
    ] }) });
  }
  const n = t.bars;
  return /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Mt, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(He, { strokeDasharray: "3 3", stroke: yn }),
    /* @__PURE__ */ s(
      We,
      {
        dataKey: "label",
        stroke: ot,
        tick: { fontSize: 11, fill: it },
        interval: 0
      }
    ),
    /* @__PURE__ */ s(
      qe,
      {
        stroke: ot,
        tick: { fontSize: 11, fill: it },
        tickFormatter: wn,
        width: 50
      }
    ),
    /* @__PURE__ */ s(
      _e,
      {
        contentStyle: Te,
        cursor: { fill: vn }
      }
    ),
    /* @__PURE__ */ s(Ot, { dataKey: "value", radius: [2, 2, 0, 0], children: n.map((r, o) => /* @__PURE__ */ s(In, { fill: jl(r) }, o)) })
  ] }) });
}
function jl(e) {
  return e.color && Ee[e.color] ? Ee[e.color] : e.color && e.color.startsWith("#") ? e.color : e.value < 0 ? "var(--mtc-danger)" : "var(--mtc-accent)";
}
function wn(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 1);
}
const Pl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BarChart: Rl
}, Symbol.toStringTag, { value: "Module" })), Il = "var(--mtc-grid)", kn = "var(--mtc-border)", Nn = "var(--mtc-muted)", Ll = "var(--mtc-muted-subtle)";
function Dl({ data: e }) {
  const t = I(() => Fl(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(F, { children: "No data" });
  const n = t.some((r) => r.size != null);
  return /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Mr, { margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(He, { strokeDasharray: "3 3", stroke: Il }),
    /* @__PURE__ */ s(
      We,
      {
        type: "number",
        dataKey: "x",
        stroke: kn,
        tick: { fontSize: 11, fill: Nn }
      }
    ),
    /* @__PURE__ */ s(
      qe,
      {
        type: "number",
        dataKey: "y",
        stroke: kn,
        tick: { fontSize: 11, fill: Nn },
        width: 50
      }
    ),
    n && /* @__PURE__ */ s(Or, { type: "number", dataKey: "size", range: [40, 280] }),
    /* @__PURE__ */ s(
      _e,
      {
        cursor: { strokeDasharray: "3 3", stroke: Ll },
        contentStyle: Te
      }
    ),
    /* @__PURE__ */ s(
      Rr,
      {
        data: t,
        fill: "var(--mtc-accent)",
        shape: (r) => {
          const { cx: o, cy: i, payload: l } = r;
          if (o == null || i == null || !l) return /* @__PURE__ */ s("circle", { cx: 0, cy: 0, r: 0 });
          const a = Ul(l), u = l.size != null ? Math.min(20, Math.max(3, Math.sqrt(l.size) * 2)) : 5;
          return /* @__PURE__ */ s("g", { children: /* @__PURE__ */ s("circle", { cx: o, cy: i, r: u, fill: a, fillOpacity: 0.7, stroke: a, strokeWidth: 1, children: l.label && /* @__PURE__ */ s("title", { children: l.label }) }) });
        }
      }
    )
  ] }) });
}
function Fl(e) {
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
function Ul(e) {
  return e.color && Ee[e.color] ? Ee[e.color] : e.color && e.color.startsWith("#") ? e.color : "var(--mtc-accent)";
}
const Bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Scatter: Dl
}, Symbol.toStringTag, { value: "Module" })), Kl = ["America/New_York", "Europe/London", "Asia/Singapore"];
function Hl({ options: e }) {
  const t = e ?? {}, n = t.zones?.length ? t.zones : Kl, r = t.format === "12h", [o, i] = v(() => /* @__PURE__ */ new Date());
  return j(() => {
    const l = setInterval(() => i(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(l);
  }, []), /* @__PURE__ */ s("div", { className: "h-full flex items-center justify-around gap-3", children: n.map((l) => {
    const a = Gl(o, l, r), c = Vl(o, l), u = ql(l), d = Jl(l, o);
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
const Wl = {
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
function ql(e) {
  return Wl[e] ?? e.split("/").pop() ?? e;
}
function Gl(e, t, n) {
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
function Vl(e, t) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: t, timeZoneName: "shortOffset" }).formatToParts(e).find((i) => i.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}
function Jl(e, t) {
  try {
    const n = new Intl.DateTimeFormat("en-US", { timeZone: e, hour: "2-digit", hour12: !1 }).format(t), r = Number(n);
    return Number.isFinite(r) ? r >= 9 && r < 17 ? "bg-emerald-500" : r === 8 || r === 17 ? "bg-amber-500" : "bg-zinc-700" : "bg-zinc-700";
  } catch {
    return "bg-zinc-700";
  }
}
const Xl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Clock: Hl
}, Symbol.toStringTag, { value: "Module" }));
function Yl({ data: e }) {
  const t = I(() => ea(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ s(F, { children: "No data" }) : /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ s(
    jr,
    {
      data: t,
      dataKey: "value",
      nameKey: "name",
      stroke: "#18181b",
      isAnimationActive: !1,
      content: /* @__PURE__ */ s(Zl, {}),
      children: /* @__PURE__ */ s(
        _e,
        {
          contentStyle: Te,
          formatter: (n) => [String(n), ""]
        }
      )
    }
  ) });
}
function Zl(e) {
  const { x: t = 0, y: n = 0, width: r = 0, height: o = 0, index: i = 0, name: l, payload: a } = e, c = Ql(a, i), u = r > 60 && o > 24;
  return /* @__PURE__ */ f("g", { children: [
    /* @__PURE__ */ s("rect", { x: t, y: n, width: r, height: o, fill: c, fillOpacity: 0.85, stroke: "#18181b", strokeWidth: 2 }),
    u && l && /* @__PURE__ */ s("text", { x: t + 6, y: n + 16, fill: "#fafafa", fontSize: 11, style: { pointerEvents: "none" }, children: l })
  ] });
}
function Ql(e, t) {
  return e ? e.color && Ee[e.color] ? Ee[e.color] : e.color && e.color.startsWith("#") ? e.color : fe[t % fe.length] : fe[t % fe.length];
}
function ea(e) {
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
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Treemap: Yl
}, Symbol.toStringTag, { value: "Module" }));
function na({ data: e }) {
  const { url: t, alt: n } = ra(e);
  return t ? /* @__PURE__ */ s("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ s(
    "img",
    {
      src: t,
      alt: n,
      loading: "lazy",
      className: "max-w-full max-h-full object-contain"
    }
  ) }) : /* @__PURE__ */ s(F, { children: "No image" });
}
function ra(e) {
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
const sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Image: na
}, Symbol.toStringTag, { value: "Module" })), oa = "allow-scripts allow-same-origin";
function ia({ data: e, options: t }) {
  const { url: n, title: r, sandbox: o } = la(e, t);
  return n ? /* @__PURE__ */ s(
    "iframe",
    {
      src: n,
      title: r,
      sandbox: o,
      loading: "lazy",
      className: "w-full h-full border-0 rounded"
    }
  ) : /* @__PURE__ */ s(F, { children: "No URL" });
}
function la(e, t) {
  let n, r = "embed", o = oa;
  if (typeof e == "string")
    n = e;
  else if (e && typeof e == "object") {
    const i = e;
    typeof i.url == "string" && (n = i.url), typeof i.label == "string" ? r = i.label : typeof i.title == "string" && (r = i.title), typeof i.sandbox == "string" && (o = i.sandbox);
  }
  return t && (typeof t.url == "string" && !n && (n = t.url), typeof t.title == "string" && r === "embed" && (r = t.title), typeof t.sandbox == "string" && (o = t.sandbox)), { url: n, title: r, sandbox: o };
}
const aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Iframe: ia
}, Symbol.toStringTag, { value: "Module" })), ca = 20, ua = "var(--mtc-grid)", Sn = "var(--mtc-border)", zn = "var(--mtc-muted)", da = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function fa({ data: e, options: t }) {
  const n = I(() => ma(e, t), [e, t]);
  return !n || n.length === 0 ? /* @__PURE__ */ s(F, { children: "No data" }) : /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Mt, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ s(He, { strokeDasharray: "3 3", stroke: ua }),
    /* @__PURE__ */ s(
      We,
      {
        dataKey: "bin",
        stroke: Sn,
        tick: { fontSize: 10, fill: zn },
        interval: "preserveStartEnd"
      }
    ),
    /* @__PURE__ */ s(
      qe,
      {
        stroke: Sn,
        tick: { fontSize: 11, fill: zn },
        allowDecimals: !1,
        width: 40
      }
    ),
    /* @__PURE__ */ s(
      _e,
      {
        contentStyle: Te,
        cursor: { fill: da }
      }
    ),
    /* @__PURE__ */ s(Ot, { dataKey: "count", fill: "var(--mtc-accent)", radius: [2, 2, 0, 0] })
  ] }) });
}
function ma(e, t) {
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
  let n = null, r = ca;
  if (Array.isArray(e) && e.every((o) => typeof o == "number"))
    n = e;
  else if (e && typeof e == "object") {
    const o = e;
    Array.isArray(o.values) && o.values.every((i) => typeof i == "number") && (n = o.values), typeof o.bins == "number" && (r = o.bins);
  }
  return typeof t?.bins == "number" && (r = t.bins), !n || (n = n.filter((o) => Number.isFinite(o)), n.length === 0) ? null : pa(n, r);
}
function pa(e, t) {
  const n = Math.min(...e), r = Math.max(...e);
  if (n === r) return [{ bin: Ge(n), count: e.length, rangeStart: n, rangeEnd: r }];
  const o = (r - n) / t, i = Array.from({ length: t }, (l, a) => {
    const c = n + a * o, u = a === t - 1 ? r : c + o;
    return { bin: Ge((c + u) / 2), count: 0, rangeStart: c, rangeEnd: u };
  });
  for (const l of e) {
    let a = Math.floor((l - n) / o);
    a >= t && (a = t - 1), i[a].count += 1;
  }
  return i;
}
const ha = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Histogram: fa
}, Symbol.toStringTag, { value: "Module" }));
function ba({ options: e }) {
  const t = typeof e?.label == "string" ? e.label : "";
  return /* @__PURE__ */ f("div", { className: "h-full flex items-center gap-3 px-1", children: [
    t && /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0", children: t }),
    /* @__PURE__ */ s("div", { className: "flex-1 h-px bg-zinc-800" })
  ] });
}
const ga = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Section: ba
}, Symbol.toStringTag, { value: "Module" })), lt = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], xa = "var(--mtc-grid)", zt = "var(--mtc-border)", At = "var(--mtc-muted)", ya = "var(--mtc-surface)", va = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function wa({ data: e, options: t }) {
  const n = I(() => Na(e), [e]), r = t?.brush === !0;
  if (!n) return /* @__PURE__ */ s(F, { children: "No data" });
  const o = n.keys.length > 1;
  return /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Pr, { data: n.points, children: [
    /* @__PURE__ */ s(He, { strokeDasharray: "3 3", stroke: xa }),
    /* @__PURE__ */ s(
      We,
      {
        dataKey: "_ts",
        stroke: zt,
        tick: { fontSize: 11, fill: At },
        tickFormatter: je
      }
    ),
    /* @__PURE__ */ s(
      qe,
      {
        stroke: zt,
        tick: { fontSize: 11, fill: At },
        tickFormatter: ur,
        width: 50
      }
    ),
    /* @__PURE__ */ s(
      _e,
      {
        contentStyle: Te,
        labelStyle: { color: At },
        labelFormatter: je
      }
    ),
    n.keys.map((i, l) => /* @__PURE__ */ s(
      Ir,
      {
        type: "monotone",
        dataKey: i,
        stroke: lt[l % lt.length],
        fill: lt[l % lt.length],
        fillOpacity: 0.35,
        strokeWidth: 1.5,
        stackId: o ? "stack" : void 0
      },
      i
    )),
    r && n.points.length > 4 && /* @__PURE__ */ s(
      Pn,
      {
        dataKey: "_ts",
        height: 20,
        stroke: zt,
        fill: ya,
        travellerWidth: 6,
        tickFormatter: je
      }
    )
  ] }) });
}
function ka(e) {
  for (const t of va) if (t in e) return t;
  return null;
}
function Na(e) {
  if (!e) return null;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const t = e[0], n = ka(t);
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
const Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AreaChart: wa
}, Symbol.toStringTag, { value: "Module" })), za = 100;
function Aa({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae(), o = t.min ?? 0, i = t.max ?? 100, l = t.step ?? 1, a = t.label ?? t.key ?? "value", c = (() => {
    if (t.key && n[t.key] != null) {
      const p = Number(n[t.key]);
      if (Number.isFinite(p)) return p;
    }
    return t.default != null ? t.default : o;
  })(), [u, d] = v(c), m = U(null);
  if (j(() => {
    if (!t.key) return;
    const p = n[t.key];
    if (p == null) return;
    const g = Number(p);
    Number.isFinite(g) && g !== u && d(g);
  }, [t.key, n[t.key ?? ""]]), !t.key)
    return /* @__PURE__ */ s(F, { children: "Slider requires options.key" });
  const h = (p) => {
    d(p), m.current && clearTimeout(m.current), m.current = setTimeout(() => {
      r(t.key, String(p));
    }, za);
  };
  return /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ f("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ s("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: a }),
      /* @__PURE__ */ f("span", { className: "text-sm font-semibold text-zinc-100 tabular-nums", children: [
        _t(u, l),
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
        onChange: (p) => h(Number(p.target.value)),
        className: "w-full accent-sky-500"
      }
    ),
    /* @__PURE__ */ f("div", { className: "flex justify-between text-[10px] text-zinc-600 tabular-nums", children: [
      /* @__PURE__ */ s("span", { children: _t(o, l) }),
      /* @__PURE__ */ s("span", { children: _t(i, l) })
    ] })
  ] });
}
function _t(e, t) {
  const n = t >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(t)));
  return e.toFixed(n);
}
const _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Slider: Aa
}, Symbol.toStringTag, { value: "Module" }));
function Ta(e, t, n) {
  if (e !== void 0 && e !== "")
    return { current: e, shouldSync: !1 };
  const r = t || n[0]?.value || "";
  return { current: r, shouldSync: r !== "" };
}
function $a({ data: e, options: t }) {
  const n = t ?? {}, { ctx: r, setCtx: o } = ae(), i = n.key, l = Ca(e, n), a = i ? r[i] : void 0, { current: c, shouldSync: u } = Ta(a, n.default, l);
  return j(() => {
    i && u && o(i, c);
  }, [i, u, c, o]), i ? l.length === 0 ? /* @__PURE__ */ s(F, { children: "Select has no choices" }) : /* @__PURE__ */ f("div", { className: "flex flex-col h-full justify-center gap-1.5 px-2", children: [
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
  ] }) : /* @__PURE__ */ s(F, { children: "Select requires options.key" });
}
function Ca(e, t) {
  const n = Ea(e);
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
function Ea(e) {
  if (Array.isArray(e)) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (Array.isArray(t.rows)) return t.rows;
    if (Array.isArray(t.entries)) return t.entries;
  }
  return [];
}
const Ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Select: $a
}, Symbol.toStringTag, { value: "Module" })), Ne = { top: 12, right: 12, bottom: 28, left: 44 }, An = ["#0ea5e9", "#10b981", "#a78bfa", "#f59e0b", "#f472b6", "#fbbf24"];
function Oa({ data: e }) {
  const t = I(() => ja(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ s(F, { children: "No data" });
  const n = t.flatMap((u) => [u.min, u.max, ...u.outliers]), r = Math.min(...n), o = Math.max(...n), i = (o - r) * 0.05 || 1, l = r - i, a = o + i, c = Array.from({ length: 5 }, (u, d) => l + (a - l) * d / 4);
  return /* @__PURE__ */ s("svg", { viewBox: "0 0 600 320", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ s(
    Ra,
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
function Ra({
  boxes: e,
  yMin: t,
  yMax: n,
  ticks: r,
  width: o,
  height: i
}) {
  const l = o - Ne.left - Ne.right, a = i - Ne.top - Ne.bottom, c = l / e.length, u = Math.min(c * 0.5, 60), d = (m) => Ne.top + (1 - (m - t) / (n - t)) * a;
  return /* @__PURE__ */ f("g", { children: [
    r.map((m, h) => {
      const p = d(m);
      return /* @__PURE__ */ f("g", { children: [
        /* @__PURE__ */ s("line", { x1: Ne.left, x2: Ne.left + l, y1: p, y2: p, stroke: "#27272a", strokeDasharray: "3 3" }),
        /* @__PURE__ */ s("text", { x: Ne.left - 6, y: p + 3, textAnchor: "end", fontSize: 10, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: Ge(m) })
      ] }, `g-${h}`);
    }),
    e.map((m, h) => {
      const p = Ne.left + c * h + c / 2, g = p - u / 2, b = An[h % An.length], k = d(m.min), N = d(m.max), _ = d(m.q1), C = d(m.q3), E = d(m.median);
      return /* @__PURE__ */ f("g", { children: [
        /* @__PURE__ */ s("line", { x1: p, x2: p, y1: k, y2: N, stroke: b, strokeOpacity: 0.6 }),
        /* @__PURE__ */ s("line", { x1: p - u / 4, x2: p + u / 4, y1: k, y2: k, stroke: b, strokeOpacity: 0.8 }),
        /* @__PURE__ */ s("line", { x1: p - u / 4, x2: p + u / 4, y1: N, y2: N, stroke: b, strokeOpacity: 0.8 }),
        /* @__PURE__ */ s("rect", { x: g, y: C, width: u, height: Math.max(1, _ - C), fill: b, fillOpacity: 0.25, stroke: b, strokeWidth: 1.5 }),
        /* @__PURE__ */ s("line", { x1: g, x2: g + u, y1: E, y2: E, stroke: b, strokeWidth: 2 }),
        m.outliers.map((x, T) => /* @__PURE__ */ s("circle", { cx: p, cy: d(x), r: 2.5, fill: b, fillOpacity: 0.7 }, T)),
        /* @__PURE__ */ s("text", { x: p, y: i - 8, textAnchor: "middle", fontSize: 11, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: m.label })
      ] }, h);
    })
  ] });
}
function ja(e) {
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
      return i.length === 0 ? null : Pa(o, i);
    }
    return null;
  }).filter((n) => n != null);
  return t.length > 0 ? t : null;
}
function Pa(e, t) {
  const n = [...t].sort((p, g) => p - g), r = (p) => {
    const g = (n.length - 1) * p, b = Math.floor(g), k = Math.ceil(g);
    return b === k ? n[b] : n[b] + (n[k] - n[b]) * (g - b);
  }, o = r(0.25), i = r(0.5), l = r(0.75), a = l - o, c = o - 1.5 * a, u = l + 1.5 * a, d = [];
  let m = 1 / 0, h = -1 / 0;
  for (const p of n)
    p < c || p > u ? d.push(p) : (p < m && (m = p), p > h && (h = p));
  return Number.isFinite(m) || (m = n[0]), Number.isFinite(h) || (h = n[n.length - 1]), { label: e, min: m, q1: o, median: i, q3: l, max: h, outliers: d };
}
const Ia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Boxplot: Oa
}, Symbol.toStringTag, { value: "Module" })), La = "var(--mtc-grid)", _n = "var(--mtc-border)", Tn = "var(--mtc-muted)", Da = "var(--mtc-muted-subtle)";
function Fa({ data: e }) {
  const t = I(() => Ua(e), [e]);
  return t ? /* @__PURE__ */ s(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ f(Lr, { data: t.rows, outerRadius: "75%", children: [
    /* @__PURE__ */ s(Dr, { stroke: La }),
    /* @__PURE__ */ s(Fr, { dataKey: "metric", stroke: _n, tick: { fontSize: 11, fill: Tn } }),
    /* @__PURE__ */ s(Ur, { stroke: _n, tick: { fontSize: 9, fill: Da } }),
    /* @__PURE__ */ s(_e, { contentStyle: Te }),
    t.series.length > 1 && /* @__PURE__ */ s(Ln, { wrapperStyle: { fontSize: 11, color: Tn } }),
    t.series.map((n, r) => /* @__PURE__ */ s(
      Br,
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
  ] }) }) : /* @__PURE__ */ s(F, { children: "No data" });
}
function Ua(e) {
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
        const d = u, m = String(d.name ?? ""), h = d.values;
        Array.isArray(h) && typeof h[a] == "number" && (c[m] = h[a]);
      }
      return c;
    }), series: o };
  }
  return null;
}
const Ba = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Radar: Fa
}, Symbol.toStringTag, { value: "Module" })), Ka = {
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
}, $n = "#52525b", Oe = 130, Je = 44, Cn = 80, Tt = 18, $t = 16;
function Ha({ data: e }) {
  const t = I(() => Ga(qa(e)), [e]);
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
          const r = n.status ? Ka[n.status] ?? $n : $n;
          return /* @__PURE__ */ f("g", { children: [
            /* @__PURE__ */ s(
              "rect",
              {
                x: n.x,
                y: n.y,
                width: Oe,
                height: Je,
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
                x: n.x + Oe / 2,
                y: n.y + Je / 2 + 4,
                textAnchor: "middle",
                fontSize: 11,
                fill: "#fafafa",
                fontFamily: "ui-sans-serif",
                children: Wa(n.label, 18)
              }
            ),
            /* @__PURE__ */ s("circle", { cx: n.x + 8, cy: n.y + 8, r: 3, fill: r })
          ] }, n.id);
        })
      ]
    }
  ) }) : /* @__PURE__ */ s(F, { children: "No data" });
}
function Wa(e, t) {
  return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function qa(e) {
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
function Ga(e) {
  if (!e || e.nodes.length === 0) return null;
  const { nodes: t, edges: n } = e, r = /* @__PURE__ */ new Map();
  for (const b of t) r.set(b.id, []);
  for (const b of n) r.get(b.to)?.push(b.from);
  const o = /* @__PURE__ */ new Map();
  for (const b of t) o.set(b.id, 0);
  let i = !0, l = 0;
  for (; i && l++ < t.length + 1; ) {
    i = !1;
    for (const b of n) {
      const k = (o.get(b.from) ?? 0) + 1;
      (o.get(b.to) ?? 0) < k && (o.set(b.to, k), i = !0);
    }
  }
  const a = /* @__PURE__ */ new Map();
  for (const b of t) {
    const k = o.get(b.id) ?? 0;
    a.has(k) || a.set(k, []), a.get(k).push(b.id);
  }
  const c = Math.max(0, ...o.values()), u = Math.max(...Array.from(a.values(), (b) => b.length)), d = $t * 2 + u * Oe + (u - 1) * Tt, m = $t * 2 + (c + 1) * Je + c * (Cn - Je), h = /* @__PURE__ */ new Map();
  for (const [b, k] of a) {
    const N = k.length * Oe + (k.length - 1) * Tt, _ = (d - N) / 2;
    k.forEach((C, E) => {
      h.set(C, {
        x: _ + E * (Oe + Tt),
        y: $t + b * Cn
      });
    });
  }
  const p = t.map((b) => ({ ...b, ...h.get(b.id) })), g = n.map((b) => {
    const k = h.get(b.from), N = h.get(b.to);
    return !k || !N ? null : {
      x1: k.x + Oe / 2,
      y1: k.y + Je,
      x2: N.x + Oe / 2,
      y2: N.y
    };
  }).filter((b) => b != null);
  return { nodes: p, edges: g, width: d, height: m };
}
const Va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Dag: Ha
}, Symbol.toStringTag, { value: "Module" }));
function Ja({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae();
  if (!t.key)
    return /* @__PURE__ */ s(F, { children: "MultiSelect requires options.key" });
  const o = t.choices ?? [];
  if (o.length === 0)
    return /* @__PURE__ */ s(F, { children: "MultiSelect requires options.choices" });
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
const Xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultiSelect: Ja
}, Symbol.toStringTag, { value: "Module" }));
function Ya({ data: e }) {
  const t = I(() => {
    if (e == null) return "";
    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return String(e);
    }
  }, [e]);
  return t ? /* @__PURE__ */ s("pre", { className: "text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed", children: Za(t) }) : /* @__PURE__ */ s(F, { children: "No data" });
}
function Za(e) {
  const t = [], n = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let r = 0, o;
  for (; (o = n.exec(e)) != null; )
    o.index > r && t.push({ text: e.slice(r, o.index) }), o[1] ? (t.push({ text: o[1], color: o[2] ? "#a1a1aa" : "#34d399" }), o[2] && t.push({ text: o[2] })) : o[3] ? t.push({ text: o[3], color: "#fbbf24" }) : o[4] && t.push({ text: o[4], color: "#0ea5e9" }), r = n.lastIndex;
  return r < e.length && t.push({ text: e.slice(r) }), t.map(
    (i, l) => i.color ? /* @__PURE__ */ s("span", { style: { color: i.color }, children: i.text }, l) : i.text
  );
}
const Qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Json: Ya
}, Symbol.toStringTag, { value: "Module" }));
function ec({ data: e, options: t }) {
  const n = t ?? {}, r = I(() => tc(e), [e]);
  if (!r || r.length < 2)
    return /* @__PURE__ */ s(F, { children: "No data" });
  const o = Math.min(...r), l = Math.max(...r) - o || 1, a = r[r.length - 1] >= r[0], c = n.color ?? (a ? "#10b981" : "#ef4444"), u = r.map((d, m) => {
    const h = m / (r.length - 1) * 100, p = 22 - (d - o) / l * 20 - 1;
    return `${h.toFixed(1)},${p.toFixed(1)}`;
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
function tc(e) {
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
const nc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Sparkline: ec
}, Symbol.toStringTag, { value: "Module" })), rc = {
  ACTION_STATUS_OK: { dot: "bg-emerald-400", text: "text-emerald-300" },
  ACTION_STATUS_ACCEPTED: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_PENDING: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_REJECTED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_FAILED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_CANCELLED: { dot: "bg-zinc-400", text: "text-zinc-300" }
}, sc = { dot: "bg-zinc-500", text: "text-zinc-400" };
function oc(e) {
  return e.replace(/^ACTION_STATUS_/, "").toLowerCase();
}
function ic(e) {
  return e ? e.length <= 8 ? e : e.slice(0, 6) + "…" : "";
}
function lc(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function ac({ options: e }) {
  const { recentActions: t, clearRecentActions: n } = ae(), r = e?.limit || 25, o = gt(t.length > 0), i = t.slice(0, r);
  return i.length === 0 ? /* @__PURE__ */ s(F, { children: "No actions yet" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
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
      const c = rc[l.status] ?? sc;
      return /* @__PURE__ */ f(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.message ?? "",
          children: [
            /* @__PURE__ */ s("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: lc(o, l.receivedAt) }),
            /* @__PURE__ */ s("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}` }),
            /* @__PURE__ */ s("span", { className: "text-zinc-200 shrink-0", children: l.actionId }),
            /* @__PURE__ */ s("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${c.text}`, children: oc(l.status) }),
            l.message && /* @__PURE__ */ s("span", { className: "text-zinc-400 truncate flex-1 min-w-0", children: l.message }),
            /* @__PURE__ */ s("span", { className: "text-zinc-600 text-[10px] shrink-0", children: ic(l.clientRequestId) })
          ]
        },
        `${l.clientRequestId}-${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActionLog: ac
}, Symbol.toStringTag, { value: "Module" })), En = {
  error: { dot: "bg-red-400", text: "text-red-300" },
  warn: { dot: "bg-amber-400", text: "text-amber-300" },
  ok: { dot: "bg-emerald-400", text: "text-emerald-300" },
  info: { dot: "bg-sky-400", text: "text-sky-300" }
};
function uc(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function dc({ options: e }) {
  const { recentAlerts: t, clearRecentAlerts: n } = ae(), r = e?.limit || 50, o = gt(t.length > 0), i = t.slice(0, r);
  return i.length === 0 ? /* @__PURE__ */ s(F, { children: "No alerts" }) : /* @__PURE__ */ f("div", { className: "h-full flex flex-col text-xs font-mono", children: [
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
      const c = En[l.severity] ?? En.warn;
      return /* @__PURE__ */ f(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.predicate,
          children: [
            /* @__PURE__ */ s("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: uc(o, l.receivedAt) }),
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
const fc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AlertLog: dc
}, Symbol.toStringTag, { value: "Module" })), mc = 500, pc = 800;
function hc(e) {
  return e.id ? `id:${e.id}` : `t:${e.timestamp ?? ""}|p:${e.price ?? ""}|s:${e.size ?? ""}|x:${e.label ?? ""}`;
}
function bc(e) {
  const t = (e ?? "").toLowerCase();
  return t === "buy" || t === "bid" ? { row: "bg-emerald-500/5", text: "text-emerald-400" } : t === "sell" || t === "ask" ? { row: "bg-red-500/5", text: "text-red-400" } : { row: "", text: "text-zinc-300" };
}
function gc(e) {
  if (e == null) return [];
  if (Array.isArray(e)) return e.map(at);
  if (typeof e == "object") {
    const t = e;
    return Array.isArray(t.events) ? t.events.map(at) : Array.isArray(t.items) ? t.items.map(at) : [at(t)];
  }
  return [];
}
function at(e) {
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
function xc({ data: e, options: t }) {
  const n = t?.cap || mc, r = gc(e), [o, i] = v([]), l = U(/* @__PURE__ */ new Set()), a = U(!1);
  if (j(() => {
    if (r.length === 0) return;
    const u = [];
    for (const d of r) {
      const m = hc(d);
      l.current.has(m) || (l.current.add(m), u.push({ ...d, _key: m, _receivedAt: Date.now() }));
    }
    u.length !== 0 && (i((d) => {
      const m = [...u.reverse(), ...d];
      if (m.length <= n) return m;
      for (const h of m.slice(n)) l.current.delete(h._key);
      return m.slice(0, n);
    }), a.current || (a.current = !0));
  }, [e, n]), o.length === 0)
    return /* @__PURE__ */ s(F, { children: "No prints yet" });
  const c = Date.now() - pc;
  return /* @__PURE__ */ s("div", { className: "h-full overflow-auto text-xs font-mono", children: o.map((u) => {
    const d = bc(u.side), h = u._receivedAt > c && a.current ? "bg-sky-500/10" : d.row;
    return /* @__PURE__ */ f(
      "div",
      {
        className: `grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${h}`,
        children: [
          /* @__PURE__ */ s("span", { className: "text-zinc-500 tabular-nums truncate", children: u.timestamp != null ? yc(u.timestamp) : "" }),
          /* @__PURE__ */ s("span", { className: `truncate ${d.text}`, children: u.label ?? u.side?.toUpperCase() ?? "·" }),
          /* @__PURE__ */ s("span", { className: `text-right tabular-nums ${d.text}`, children: u.price != null ? vc(u.price) : "" }),
          /* @__PURE__ */ s("span", { className: "text-right tabular-nums text-zinc-400", children: u.size != null ? wc(u.size) : "" })
        ]
      },
      u._key
    );
  }) });
}
function yc(e) {
  try {
    const t = new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), o = String(t.getSeconds()).padStart(2, "0");
    return `${n}:${r}:${o}`;
  } catch {
    return je(e);
  }
}
function vc(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(Math.abs(e) < 1 ? 4 : 2);
}
function wc(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const kc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Tape: xc
}, Symbol.toStringTag, { value: "Module" }));
function Re(e) {
  if (e instanceof Error) return e.message;
  if (typeof e == "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}
function Ke(e) {
  const t = (e.kind ?? "").toString().toUpperCase();
  return t === "FOLDER" || t === "KIND_FOLDER";
}
function Nc(e) {
  const t = Sc(e);
  return t || [];
}
function Sc(e) {
  if (!e) return null;
  if (Array.isArray(e)) return e;
  if (typeof e == "object") {
    const t = e;
    if (Array.isArray(t.entries)) return t.entries;
    if (Array.isArray(t.rows)) return t.rows;
  }
  return null;
}
function zc(e) {
  const t = e.filter(Ke).sort(Mn), n = e.filter((r) => !Ke(r)).sort(Mn);
  return [...t, ...n];
}
function Mn(e, t) {
  return (e.name ?? "").localeCompare(t.name ?? "");
}
function Ac(e) {
  return e ? e.split("/").filter(Boolean) : [];
}
function _c(e, t) {
  const n = (e ?? "").replace(/^\/+|\/+$/g, ""), r = (t ?? "").replace(/^\/+|\/+$/g, "");
  return n ? r ? n + "/" + r : n : r;
}
function xr(e) {
  const t = ["B", "KB", "MB", "GB", "TB"];
  let n = 0, r = e;
  for (; r >= 1024 && n < t.length - 1; )
    r /= 1024, n++;
  return `${n === 0 ? r.toFixed(0) : r.toFixed(1)} ${t[n]}`;
}
const Tc = /* @__PURE__ */ new Set(["audio", "video", "mkv"]), $c = /* @__PURE__ */ new Set(["audio", "video", "mkv", "image", "heic"]);
function Cc(e) {
  return e.filter((t) => {
    const n = Ye(t.content_type, t.name);
    return n !== null && Tc.has(n);
  });
}
function Ec(e) {
  return e.filter((t) => {
    const n = Ye(t.content_type, t.name);
    return n !== null && $c.has(n);
  });
}
function On(e, t, n, r, o = Math.random) {
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
function Mc(e, t, n) {
  if (e.length === 0) return null;
  const r = e.findIndex((o) => o.name === t);
  return r > 0 ? e[r - 1] : n ? e[e.length - 1] : null;
}
function Ye(e, t) {
  const n = (t ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "", r = (e ?? "").toLowerCase().split(";")[0].trim();
  return r === "image/heic" || r === "image/heif" || n === "heic" || n === "heif" ? "heic" : r === "video/x-matroska" || r === "application/x-matroska" || n === "mkv" ? "mkv" : r.startsWith("video/") ? "video" : r.startsWith("audio/") ? "audio" : r.startsWith("image/") ? "image" : r === "application/pdf" || n === "pdf" ? "pdf" : r === "application/json" || r === "text/json" || n === "json" ? "json" : r === "application/yaml" || r === "text/yaml" || r === "application/x-yaml" || n === "yaml" || n === "yml" ? "yaml" : r === "text/markdown" || r === "text/x-markdown" || n === "md" || n === "markdown" ? "markdown" : r === "text/csv" || r === "application/csv" || n === "csv" ? "csv" : r.startsWith("text/") || n === "txt" || n === "log" || n === "ini" || n === "conf" ? "text" : null;
}
function Rn(e, t, n) {
  const r = encodeURIComponent(t);
  return e.replace("{bucket}", r).replace("{namespace}", r).replace("{path}", encodeURIComponent(n));
}
function Oc(e) {
  let t = "";
  const n = new Uint8Array(e);
  for (let r = 0; r < n.byteLength; r++) t += String.fromCharCode(n[r]);
  return btoa(t);
}
async function ct(e) {
  try {
    return (await e.json()).message ?? `HTTP ${e.status}`;
  } catch {
    return `HTTP ${e.status}`;
  }
}
async function Rc(e, t) {
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
      const h = JSON.parse(new TextDecoder().decode(m));
      if (h.data) {
        const p = atob(h.data), g = new Uint8Array(p.length);
        for (let b = 0; b < p.length; b++) g[b] = p.charCodeAt(b);
        a.push(g.buffer);
      }
    } catch {
    }
  }
  return new Blob(a, { type: t ?? "application/octet-stream" });
}
async function jc(e) {
  const t = await fetch(e);
  if (!t.ok) throw new Error(`fetch failed: ${t.status}`);
  return t.text();
}
function Pc(e) {
  try {
    return JSON.stringify(JSON.parse(e), null, 2);
  } catch {
    return e;
  }
}
function Ic(e) {
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
async function Lc(e) {
  const [{ marked: t }, { default: n }] = await Promise.all([
    import("./marked.esm-CgtsUw0D.js"),
    import("./purify.es-ZDSJOUnA.js")
  ]);
  try {
    const r = await t.parse(e, { async: !0 });
    return n.sanitize(r);
  } catch {
    return `<pre>${Dc(e)}</pre>`;
  }
}
function Dc(e) {
  return e.replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]);
}
let Ct = null;
function yr(e) {
  return import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    e
  );
}
async function Fc(e) {
  const { default: t } = await yr("heic2any"), n = await t({ blob: e, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(n) ? n[0] : n;
}
async function Uc(e, t) {
  t?.("Loading ffmpeg…");
  const n = await Bc();
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
async function Bc() {
  if (Ct) return Ct;
  const { FFmpeg: e } = await yr("@ffmpeg/ffmpeg"), t = new e();
  return await t.load(), Ct = t, t;
}
function Kc({ data: e, options: t, widgetId: n }) {
  const r = t ?? {}, { ctx: o, setCtx: i, backendUrl: l, toast: a, requestRefresh: c } = ae(), u = r.path_ctx ?? "path", d = r.bucket_ctx ?? "org", m = r.bucket_param ?? "org", h = r.page_ctx ?? "page", p = r.page_size_ctx ?? "page_size", g = r.view_mode_ctx ?? "view_mode", b = r.upload_action_id ?? "upload", k = r.upload_url, N = r.ingest_url, _ = o[d] ?? "default", C = o[u] ?? "", E = parseInt(o[h] ?? "1", 10) || 1, x = parseInt(o[p] ?? "50", 10) || 50, T = o[g] === "gallery" ? "gallery" : "icons", [$, L] = v(!1), [G, X] = v(!1), [K, Q] = v(null), [ee, D] = v(!1), [W, M] = v("url"), [P, Y] = v(""), [V, se] = v(""), [y, w] = v(""), [A, R] = v(!1), H = r.search_url, [J, re] = v(""), [te, ne] = v(null), [pe, Me] = v(!1), xe = I(() => Nc(e), [e]), Pe = te ?? xe, he = I(
    () => te || zc(xe),
    [te, xe]
  ), ye = I(() => Ac(C), [C]), ue = !te && E > 1, $e = !te && xe.length >= x, Ie = r.media_url_template ?? "/media?namespace={namespace}&path={path}";
  j(() => {
    E !== 1 && i(h, "1");
  }, [_, C]);
  const Le = (S) => i(u, S), Ze = (S) => i(h, String(Math.max(1, S))), Qe = () => i(g, T === "gallery" ? "icons" : "gallery"), z = async () => {
    if (!H) return;
    const S = J.trim();
    if (S === "") {
      ne(null);
      return;
    }
    Me(!0);
    try {
      const q = await fetch((l ?? "") + H, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [m]: _, query: S })
      });
      if (!q.ok) {
        a(`Search failed: ${await ct(q)}`, "error");
        return;
      }
      const oe = await q.json();
      ne((oe.hits ?? []).map((ie) => ({ ...ie, kind: "file" })));
    } catch (q) {
      a(`Search failed: ${Re(q)}`, "error");
    } finally {
      Me(!1);
    }
  }, O = () => {
    re(""), ne(null);
  }, Z = (S) => {
    O(), Le(S);
  }, de = () => {
    Y(C), se(""), w(""), M(N ? "url" : "file"), D(!0);
  }, ve = async () => {
    if (!N) return;
    const S = P.trim(), q = V.trim(), oe = y.trim();
    if (!S || !q || !oe) {
      a("Need a folder (repo), a filename, and a URL", "error");
      return;
    }
    R(!0);
    try {
      const ie = await fetch((l ?? "") + N, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [m]: _, repo: S, path: q, url: oe })
      });
      if (!ie.ok)
        throw new Error(await ct(ie));
      a(`Fetching ${q} in the background — it'll appear when done.`, "ok"), D(!1);
    } catch (ie) {
      a(`Ingest failed: ${Re(ie)}`, "error");
    } finally {
      R(!1);
    }
  }, ge = async (S) => {
    const q = P.trim(), oe = V.trim() || S.name;
    if (!q) {
      a("Need a destination folder (repo)", "error");
      return;
    }
    R(!0);
    try {
      await et(S, q, oe), a(`Uploaded ${oe}`, "ok"), D(!1), c(n ?? "*");
    } catch (ie) {
      a(`Upload failed: ${Re(ie)}`, "error");
    } finally {
      R(!1);
    }
  }, Ce = (S) => S.path && S.path !== "" ? S.path : _c(C, S.name ?? ""), be = (S) => {
    if (Ke(S)) {
      te ? Z(Ce(S)) : Le(Ce(S));
      return;
    }
    if (Ie && Ye(S.content_type, S.name)) {
      Q(S);
      return;
    }
    De(S);
  };
  j(() => {
    if (!K) return;
    const S = (q) => {
      q.key === "Escape" && Q(null);
    };
    return window.addEventListener("keydown", S), () => window.removeEventListener("keydown", S);
  }, [K]);
  const De = async (S) => {
    const q = r.download_url;
    if (!q) {
      a("Download not configured (set options.download_url)", "error");
      return;
    }
    if (!S.name) {
      a("File has no name", "error");
      return;
    }
    const oe = Ce(S), ie = (l ?? "") + q;
    try {
      const we = await fetch(ie, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1"
        },
        body: JSON.stringify({ [m]: _, path: oe })
      });
      if (!we.ok) {
        const tt = await ct(we);
        a(`Download failed: ${tt}`, "error");
        return;
      }
      const xt = await Rc(we, S.content_type), Fe = document.createElement("a");
      Fe.href = URL.createObjectURL(xt), Fe.download = S.name, Fe.click(), setTimeout(() => URL.revokeObjectURL(Fe.href), 5e3);
    } catch (we) {
      a(`Download failed: ${Re(we)}`, "error");
    }
  }, et = async (S, q, oe) => {
    const ie = S.type || "application/octet-stream";
    if (k) {
      const wr = new URLSearchParams({ [m]: _, repo: q, path: oe, content_type: ie }), yt = await fetch(`${l ?? ""}${k}?${wr.toString()}`, { method: "POST", body: S });
      if (!yt.ok) throw new Error(await yt.text() || `HTTP ${yt.status}`);
      return;
    }
    const we = await S.arrayBuffer(), xt = Kn(l ?? ""), Fe = Hn({
      actionId: b,
      params: { [m]: _, repo: q, path: oe, content_type: ie, data_b64: Oc(we) },
      clientRequestId: Wn()
    }), tt = await fetch(xt, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
      body: JSON.stringify(Fe)
    });
    if (!tt.ok) throw new Error(await ct(tt));
  }, vr = async (S) => {
    if (C === "") {
      a("Open a folder first, or use the Upload button to choose a folder.", "error");
      return;
    }
    const q = C;
    X(!0);
    let oe = 0;
    for (const ie of Array.from(S))
      try {
        await et(ie, q, ie.name), oe++;
      } catch (we) {
        a(`Upload failed: ${ie.name} — ${Re(we)}`, "error");
      }
    X(!1), oe > 0 && (a(`Uploaded ${oe} file${oe === 1 ? "" : "s"}`, "ok"), c(n ?? "*"));
  };
  return /* @__PURE__ */ f(
    "div",
    {
      className: "h-full flex flex-col relative",
      onDragOver: (S) => {
        S.preventDefault(), L(!0);
      },
      onDragLeave: () => L(!1),
      onDrop: (S) => {
        S.preventDefault(), L(!1), S.dataTransfer.files.length > 0 && vr(S.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0", children: [
          /* @__PURE__ */ s("button", { onClick: () => Le(""), className: "text-sky-400 hover:underline", children: "/" }),
          ye.map((S, q) => {
            const oe = ye.slice(0, q + 1).join("/");
            return /* @__PURE__ */ f("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "/" }),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Le(oe),
                  className: "text-sky-400 hover:underline",
                  children: S
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
                  value: J,
                  onChange: (S) => re(S.target.value),
                  onKeyDown: (S) => {
                    S.key === "Enter" && z(), S.key === "Escape" && O();
                  },
                  placeholder: "Search files…",
                  className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => {
                    z();
                  },
                  disabled: pe,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
                  "aria-label": "Search",
                  title: "Search this namespace",
                  children: pe ? "…" : "🔍"
                }
              ),
              te && /* @__PURE__ */ s(
                "button",
                {
                  onClick: O,
                  className: "text-zinc-400 hover:text-zinc-100 px-1",
                  title: "Clear search, back to browsing",
                  children: "✕"
                }
              )
            ] }),
            (k || b || N) && /* @__PURE__ */ s(
              "button",
              {
                onClick: de,
                className: "text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5",
                title: "Upload a file or fetch a media URL",
                children: "⬆ Upload"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                onClick: Qe,
                className: "text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5",
                title: T === "gallery" ? "Switch to icons (no thumbnails)" : "Switch to gallery (loads image thumbnails)",
                children: T === "gallery" ? "◫ Gallery" : "☰ Icons"
              }
            ),
            /* @__PURE__ */ s("span", { className: "tabular-nums", children: te ? `${te.length} result${te.length === 1 ? "" : "s"}` : `${Pe.length} on page` }),
            (ue || $e) && /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Ze(E - 1),
                  disabled: !ue,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
                  "aria-label": "Previous page",
                  children: "‹"
                }
              ),
              /* @__PURE__ */ f("span", { className: "tabular-nums text-zinc-400", children: [
                "Page ",
                E
              ] }),
              /* @__PURE__ */ s(
                "button",
                {
                  onClick: () => Ze(E + 1),
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
          $ && /* @__PURE__ */ s("div", { className: "absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none", children: /* @__PURE__ */ s("div", { className: "text-sky-300 text-sm", children: "Drop files to upload" }) }),
          he.length === 0 ? /* @__PURE__ */ s(F, { children: te ? "No files match your search." : "This folder is empty. Drop files to upload." }) : T === "gallery" ? /* @__PURE__ */ s(
            Hc,
            {
              entries: he,
              onClick: be,
              mediaUrlFor: (S) => S.name ? (l ?? "") + Rn(Ie, _, Ce(S)) : ""
            }
          ) : /* @__PURE__ */ f("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ s("thead", { className: "sticky top-0 bg-zinc-900 z-[1]", children: /* @__PURE__ */ f("tr", { className: "text-zinc-400 border-b border-zinc-800", children: [
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-8" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2", children: "Name" }),
              /* @__PURE__ */ s("th", { className: "text-right px-3 py-2 w-24", children: "Size" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-40", children: "Type" }),
              /* @__PURE__ */ s("th", { className: "text-left px-3 py-2 w-36", children: "Modified" })
            ] }) }),
            /* @__PURE__ */ s("tbody", { children: he.map((S, q) => /* @__PURE__ */ f(
              "tr",
              {
                onDoubleClick: () => be(S),
                className: "border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none",
                children: [
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 select-none", children: Ke(S) ? "📁" : "📄" }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-100 truncate", children: S.name }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-right text-zinc-400", children: Ke(S) ? "—" : xr(S.size_bytes ?? 0) }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-500 truncate", children: S.content_type ?? "" }),
                  /* @__PURE__ */ s("td", { className: "px-3 py-1.5 text-zinc-500 truncate", children: S.modified_at ?? "" })
                ]
              },
              `${S.kind ?? ""}:${S.name ?? q}`
            )) })
          ] }),
          G && /* @__PURE__ */ s("div", { className: "absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg", children: "Uploading…" })
        ] }),
        K && /* @__PURE__ */ s(
          Wc,
          {
            entry: K,
            mediaUrl: (l ?? "") + Rn(Ie, _, Ce(K)),
            autoAdvanceQueue: Cc(he),
            navigableQueue: Ec(he),
            onSelect: (S) => Q(S),
            onClose: () => Q(null),
            onDownload: () => {
              De(K);
            }
          }
        ),
        ee && /* @__PURE__ */ s(
          "div",
          {
            className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60",
            onClick: () => {
              A || D(!1);
            },
            children: /* @__PURE__ */ f(
              "div",
              {
                className: "flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md",
                onClick: (S) => S.stopPropagation(),
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
                          A || D(!1);
                        },
                        className: "text-zinc-500 hover:text-zinc-200",
                        "aria-label": "Close",
                        children: "✕"
                      }
                    )
                  ] }),
                  N && /* @__PURE__ */ f("div", { className: "flex gap-1 text-xs", children: [
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => M("url"),
                        className: `px-3 py-1 rounded border ${W === "url" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
                        children: "From URL"
                      }
                    ),
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => M("file"),
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
                        value: P,
                        onChange: (S) => Y(S.target.value),
                        placeholder: "e.g. year=2026/name=avatar",
                        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                      }
                    ),
                    /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "The repository partition. Becomes a source key." })
                  ] }),
                  /* @__PURE__ */ f("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                    "Filename ",
                    W === "file" && "(optional — defaults to the file’s name)",
                    /* @__PURE__ */ s(
                      "input",
                      {
                        type: "text",
                        value: V,
                        onChange: (S) => se(S.target.value),
                        placeholder: "e.g. avatar.mp4",
                        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                      }
                    ),
                    /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "Location inside the repo (may include subfolders)." })
                  ] }),
                  W === "url" ? /* @__PURE__ */ f(ft, { children: [
                    /* @__PURE__ */ f("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                      "Media URL",
                      /* @__PURE__ */ s(
                        "input",
                        {
                          type: "url",
                          value: y,
                          onChange: (S) => w(S.target.value),
                          placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8",
                          className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        }
                      ),
                      /* @__PURE__ */ s("span", { className: "text-zinc-600", children: "HTTP(S) media URL or raw HLS playlist. Fetched server-side." })
                    ] }),
                    /* @__PURE__ */ s(
                      "button",
                      {
                        onClick: () => {
                          ve();
                        },
                        disabled: A,
                        className: "self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm",
                        children: A ? "Starting…" : "Fetch & store"
                      }
                    )
                  ] }) : /* @__PURE__ */ f(ft, { children: [
                    /* @__PURE__ */ s(
                      "input",
                      {
                        type: "file",
                        onChange: (S) => {
                          const q = S.target.files?.[0];
                          q && ge(q);
                        },
                        disabled: A,
                        className: "text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
                      }
                    ),
                    A && /* @__PURE__ */ s("span", { className: "self-end text-xs text-zinc-400", children: "Uploading…" })
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
function Hc({
  entries: e,
  onClick: t,
  mediaUrlFor: n
}) {
  return /* @__PURE__ */ s("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3", children: e.map((r, o) => {
    const i = Ye(r.content_type, r.name), l = i === "image" || i === "heic", a = Ke(r);
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
      `${r.kind ?? ""}:${r.name ?? o}`
    );
  }) });
}
function Wc({
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
  ), [m, h] = v(!1), [p, g] = v(null), [b, k] = v(null), [N, _] = v("Loading…"), [C, E] = v(null), [x, T] = v(null), [$, L] = v(null), G = r.length > 1, X = r.findIndex((y) => y.name === e.name), [K, Q] = v(!1), [ee, D] = v(!0), W = () => {
    const y = On(r, e.name, K, ee);
    y && o(y);
  }, M = () => {
    const y = Mc(r, e.name, ee);
    y && o(y);
  }, P = () => {
    const y = On(n, e.name, K, ee);
    y && o(y);
  };
  j(() => {
    const y = (w) => {
      const A = w.target;
      if (!(A && (A.tagName === "INPUT" || A.tagName === "TEXTAREA" || A.isContentEditable))) {
        if (w.key === "ArrowRight")
          w.preventDefault(), W();
        else if (w.key === "ArrowLeft")
          w.preventDefault(), M();
        else if (w.key === " ") {
          const R = document.querySelector("video, audio");
          R && (w.preventDefault(), R.paused ? R.play() : R.pause());
        }
      }
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [e.name, r.length, K, ee]);
  const Y = () => d(!1), V = () => {
    d(!1), h(!0), g(null);
  }, se = (y) => {
    y.target === y.currentTarget && i();
  };
  return j(() => {
    if (a !== "heic" && a !== "mkv") return;
    let y = !1, w = null;
    return (async () => {
      try {
        let A;
        if (a === "heic") {
          _("Decoding HEIC…");
          const R = await fetch(t);
          if (!R.ok) throw new Error(`fetch failed: ${R.status}`);
          A = await Fc(await R.blob());
        } else
          A = await Uc(t, (R) => {
            y || _(R);
          });
        if (y) return;
        w = URL.createObjectURL(A), k(w), d(!1);
      } catch (A) {
        if (y) return;
        g(Re(A)), h(!0), d(!1);
      }
    })(), () => {
      y = !0, w && URL.revokeObjectURL(w);
    };
  }, [a, t]), j(() => {
    if (!c) return;
    let y = !1;
    return (async () => {
      try {
        const w = await jc(t);
        if (y) return;
        a === "csv" ? T(Ic(w)) : a === "json" ? E(Pc(w)) : a === "markdown" ? L(await Lc(w)) : E(w), d(!1);
      } catch (w) {
        if (y) return;
        g(Re(w)), h(!0), d(!1);
      }
    })(), () => {
      y = !0;
    };
  }, [a, c, t]), /* @__PURE__ */ f(
    "div",
    {
      className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
      onClick: se,
      children: [
        /* @__PURE__ */ f("div", { className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900", children: [
          /* @__PURE__ */ s("span", { className: "text-sm font-medium truncate flex-1", children: e.name }),
          /* @__PURE__ */ s("span", { className: "text-xs text-zinc-500 truncate max-w-[200px]", children: e.content_type }),
          typeof e.size_bytes == "number" && /* @__PURE__ */ s("span", { className: "text-xs text-zinc-600 tabular-nums", children: xr(e.size_bytes) }),
          G && /* @__PURE__ */ f("div", { className: "flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2", children: [
            /* @__PURE__ */ s(
              "button",
              {
                onClick: M,
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
                onClick: () => Q((y) => !y),
                className: `px-1 leading-none ${K ? "text-sky-400" : "hover:text-zinc-100"}`,
                "aria-label": "Toggle shuffle",
                title: K ? "Shuffle on" : "Shuffle off",
                children: "🔀"
              }
            ),
            /* @__PURE__ */ s(
              "button",
              {
                onClick: () => D((y) => !y),
                className: `px-1 leading-none ${ee ? "text-sky-400" : "hover:text-zinc-100"}`,
                "aria-label": "Toggle repeat",
                title: ee ? "Repeat on" : "Repeat off",
                children: "🔁"
              }
            ),
            /* @__PURE__ */ f("span", { className: "text-xs text-zinc-500 tabular-nums", children: [
              X >= 0 ? X + 1 : "–",
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
            className: "flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative",
            onClick: se,
            children: [
              u && !m && /* @__PURE__ */ s("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s("div", { className: "text-zinc-500 text-xs uppercase tracking-wider", children: N }) }),
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
                  onLoadedMetadata: Y,
                  onEnded: P,
                  onError: V,
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
                    onEnded: P,
                    onError: V,
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
                  onLoad: Y,
                  onError: V,
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
                  onLoad: Y,
                  className: "w-full h-full bg-white rounded shadow-2xl border-0"
                }
              ),
              !m && a === "heic" && b && /* @__PURE__ */ s(
                "img",
                {
                  src: b,
                  alt: e.name ?? "",
                  decoding: "async",
                  onError: V,
                  className: "max-h-full max-w-full object-contain rounded shadow-2xl"
                }
              ),
              !m && a === "mkv" && b && /* @__PURE__ */ s(
                "video",
                {
                  src: b,
                  controls: !0,
                  autoPlay: !0,
                  playsInline: !0,
                  preload: "metadata",
                  onLoadedMetadata: Y,
                  onEnded: P,
                  onError: V,
                  className: "max-h-full max-w-full bg-black rounded shadow-2xl"
                }
              ),
              !m && (a === "text" || a === "json" || a === "yaml") && C !== null && /* @__PURE__ */ s("pre", { className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words", children: C }),
              !m && a === "markdown" && $ !== null && /* @__PURE__ */ s(
                "div",
                {
                  className: "w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none",
                  dangerouslySetInnerHTML: { __html: $ }
                }
              ),
              !m && a === "csv" && x !== null && /* @__PURE__ */ s("div", { className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl", children: /* @__PURE__ */ f("table", { className: "border-collapse", children: [
                x.length > 0 && /* @__PURE__ */ s("thead", { children: /* @__PURE__ */ s("tr", { children: x[0].map((y, w) => /* @__PURE__ */ s("th", { className: "border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800", children: y }, w)) }) }),
                /* @__PURE__ */ s("tbody", { children: x.slice(1).map((y, w) => /* @__PURE__ */ s("tr", { children: y.map((A, R) => /* @__PURE__ */ s("td", { className: "border border-zinc-800 px-2 py-1 align-top", children: A }, R)) }, w)) })
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
const qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileBrowser: Kc
}, Symbol.toStringTag, { value: "Module" }));
function ou({ view: e, filenameBase: t, onExport: n, variant: r = "button" }) {
  const [o, i] = v(!1), [l, a] = v(null), c = U(null);
  j(() => {
    if (!o) return;
    const p = (g) => {
      c.current && !c.current.contains(g.target) && i(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [o]);
  const u = rr(e), d = u === 0, m = async (p) => {
    a(p);
    let g = !1;
    try {
      g = await sr(e, p, t);
    } catch {
      g = !1;
    } finally {
      a(null), i(!1), n?.(p, g);
    }
  }, h = r === "row" ? /* @__PURE__ */ s(
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
    h,
    o && !d && /* @__PURE__ */ f("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-30 min-w-[140px]", children: [
      /* @__PURE__ */ f("div", { className: "px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600", children: [
        u.toLocaleString(),
        " rows"
      ] }),
      tr.map((p) => /* @__PURE__ */ f(
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
function Gc(e) {
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
function iu({ config: e, onEvent: t, theme: n = "dark" }) {
  const [r, o] = v({});
  j(() => {
    if (!e.templateUrl) return;
    let a = !1;
    return o({}), fetch(e.templateUrl).then((c) => {
      if (!c.ok) throw new Error(`Template fetch failed: ${c.status}`);
      return c.json();
    }).then((c) => {
      if (a) return;
      const u = Object.keys(e.ctx).length > 0 ? {
        ...c,
        context: {
          values: { ...c.context?.values ?? {}, ...e.ctx }
        }
      } : c;
      o({ template: u });
    }).catch((c) => {
      a || o({ error: c instanceof Error ? c.message : "Template load error" });
    }), () => {
      a = !0;
    };
  }, [e.templateUrl, e.ctx]);
  const i = I(() => Gc(e), [e]), l = e.templateUrl ? r.template : i;
  return e.templateUrl && r.error ? /* @__PURE__ */ s(Et, { title: "Embed error", body: r.error, theme: n }) : e.templateUrl && !l ? /* @__PURE__ */ s(Et, { title: "Loading…", body: "Fetching dashboard template", theme: n }) : l ? /* @__PURE__ */ s("div", { className: `mtc-root mtc-theme-${n}`, "data-theme": n, children: /* @__PURE__ */ s("div", { className: "min-h-screen bg-zinc-950", children: /* @__PURE__ */ s(
    ar,
    {
      template: l,
      backendUrl: e.backendUrl,
      chrome: e.chrome === "full" ? "full" : "minimal",
      onEvent: t,
      theme: n
    }
  ) }) }) : /* @__PURE__ */ s(
    Et,
    {
      title: "Nothing to embed",
      body: "Pass a ?template= URL, or a ?src= source id (with &backend=), or a ?url= data URL.",
      theme: n
    }
  );
}
function Et({ title: e, body: t, theme: n }) {
  return /* @__PURE__ */ s("div", { className: `mtc-root mtc-theme-${n}`, "data-theme": n, children: /* @__PURE__ */ s("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-6", children: /* @__PURE__ */ f("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ s("div", { className: "text-sm font-medium text-zinc-200 mb-1", children: e }),
    /* @__PURE__ */ s("div", { className: "text-xs text-zinc-500", children: t })
  ] }) }) });
}
function Vc(e) {
  return e === "1" || e === "true" || e === "yes";
}
function lu(e) {
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
        stream: Vc(t.get("stream")),
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
function au(e, t) {
  const n = new URLSearchParams();
  t.templateUrl && n.set("template", t.templateUrl), t.widget && (t.widget.component && n.set("component", t.widget.component), t.widget.sourceId && n.set("src", t.widget.sourceId), t.widget.url && n.set("url", t.widget.url), t.widget.stream && n.set("stream", "1"), t.widget.refreshIntervalMs && n.set("refreshMs", String(t.widget.refreshIntervalMs))), t.title && n.set("title", t.title), t.backendUrl && n.set("backend", t.backendUrl), t.chrome === "full" && n.set("chrome", "full");
  for (const [o, i] of Object.entries(t.ctx ?? {})) n.set(`ctx.${o}`, i);
  const r = n.toString();
  return r ? `${e}?${r}` : e;
}
const jn = "medallion.terminal.v1.TerminalService";
function Jc(e) {
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
function Xc(e) {
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
function cu(e, t) {
  const n = t.protocol ?? "connect", r = t.endpoint.replace(/\/$/, ""), o = e.map((l) => ({
    id: l.id,
    name: l.name ?? l.id,
    description: l.description,
    shape: l.shape,
    streamable: l.streamable,
    columns: Xc(l.shape),
    params: (l.params ?? []).map((a) => ({
      key: a.key,
      required: a.required ?? !1,
      type: Jc(a.type),
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
  return n === "connect" && (i.service = jn, i.getUrl = `${r}/${jn}/Get`), i;
}
function uu(e) {
  return JSON.stringify(e, null, 2);
}
function du(e) {
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
  ac as ActionLog,
  dc as AlertLog,
  wa as AreaChart,
  nn as BUILTIN_COMPONENTS,
  tu as BUILTIN_KEYS,
  Rl as BarChart,
  Oa as Boxplot,
  si as Candlestick,
  el as Catalog,
  Hl as Clock,
  so as CommandPalette,
  Ha as Dag,
  ar as Dashboard,
  Bn as DashboardContext,
  pi as DataTable,
  Ii as Distribution,
  Rs as EXTENSION,
  iu as EmbedView,
  F as Empty,
  ds as ErrorBoundary,
  Jt as ErrorState,
  Ji as Events,
  ou as ExportMenu,
  Kc as FileBrowser,
  Oi as Gauge,
  Ki as Heatmap,
  fa as Histogram,
  ir as HoverContext,
  qs as HoverProvider,
  ia as Iframe,
  na as Image,
  Ya as Json,
  en as MIME,
  ki as Metric,
  ru as MultiDashboard,
  Ja as MultiSelect,
  qn as NowContext,
  ys as NowProvider,
  nl as OrderBook,
  fe as PALETTE,
  il as PairedGrid,
  cs as Placeholder,
  Ei as Prompt,
  Fa as Radar,
  Ee as SEMANTIC,
  Dl as Scatter,
  ba as Section,
  $a as Select,
  lo as ShortcutsOverlay,
  Vt as Skeleton,
  Aa as Slider,
  ec as Sparkline,
  _l as StatStrip,
  xc as Tape,
  Ti as Text,
  yl as Ticker,
  Xo as Timeseries,
  hl as Trade,
  Yl as Treemap,
  kl as VolumeProfile,
  or as WidgetShell,
  ur as abbreviateAxis,
  Gs as applyActions,
  Hn as buildActionRequest,
  bs as buildActionWatchRequest,
  cu as buildBiDescriptor,
  au as buildEmbedUrl,
  ps as buildGenerateRequest,
  ms as buildGenerateUrl,
  ho as buildSnapshot,
  Kn as buildSubmitActionUrl,
  hs as buildWatchActionUrl,
  ks as canParsePredicate,
  du as connectionFields,
  tn as csvEscape,
  Qs as deleteView,
  uu as descriptorToJson,
  sr as downloadView,
  ws as evaluateAlert,
  Bs as exportFilename,
  Us as exportView,
  Os as flatten,
  Ho as formatBps,
  Ge as formatCompact,
  Ko as formatCurrency,
  Bo as formatPercent,
  dr as formatStat,
  je as formatTimestamp,
  Un as getNested,
  us as getWidget,
  Be as interpolate,
  po as isStaticTemplate,
  dt as isTerminalStatus,
  Zs as listViews,
  Ys as loadView,
  Wn as newClientRequestId,
  lu as parseEmbedConfig,
  Vs as readCtxFromUrl,
  nu as registerWidget,
  Wo as resolveColor,
  xs as resolveSource,
  Xs as saveView,
  Fs as serializeText,
  js as toCsv,
  Ps as toJson,
  Is as toNdjson,
  Ds as toParquet,
  br as useAnimatedNumber,
  Vr as useBreakpoint,
  ae as useDashboard,
  Qr as useDataSource,
  lr as useHover,
  gt as useNow,
  su as useTabFromUrl,
  pl as useWatchAction,
  mo as validateTemplate,
  rr as viewRowCount,
  rn as widgetSnapshotKey,
  Js as writeCtxToUrl
};
