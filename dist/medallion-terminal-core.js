import { jsxs as m, jsx as o, Fragment as ft } from "react/jsx-runtime";
import { useState as v, useEffect as R, useCallback as ce, useRef as U, useMemo as L, lazy as _r, Component as Tr, useContext as Ut, createContext as Bt, Suspense as $r } from "react";
import { ResponsiveContainer as Ae, LineChart as Cr, CartesianGrid as He, XAxis as We, YAxis as qe, Tooltip as _e, Line as Er, Brush as Fn, ReferenceLine as Or, ReferenceArea as Mr, ReferenceDot as Rr, PieChart as jr, Pie as Ir, Cell as Un, BarChart as jt, Legend as Bn, Bar as It, ScatterChart as Lr, ZAxis as Pr, Scatter as Dr, Treemap as Fr, AreaChart as Ur, Area as Br, RadarChart as Kr, PolarGrid as Hr, PolarAngleAxis as Wr, PolarRadiusAxis as qr, Radar as Gr } from "recharts";
import { createChart as Vr, ColorType as Jr, CandlestickSeries as Xr, HistogramSeries as Yr, createSeriesMarkers as Zr } from "lightweight-charts";
function Wt() {
  if (typeof window > "u") return "desktop";
  const e = window.innerWidth;
  return e < 768 ? "mobile" : e < 1024 ? "tablet" : "desktop";
}
function Qr() {
  const [e, t] = v(Wt);
  return R(() => {
    const n = () => t(Wt());
    return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
  }, []), e;
}
const Kn = "application/connect+json", qt = new TextDecoder();
async function Hn(e, t) {
  let n = new Uint8Array(0), r = 0;
  for (; !t.isDisposed(); ) {
    const { done: s, value: i } = await e.read();
    if (s) break;
    if (i && i.length > 0) {
      const l = n.length - r, a = new Uint8Array(l + i.length);
      l > 0 && a.set(n.subarray(r), 0), a.set(i, l), n = a, r = 0;
    }
    for (; n.length - r >= 5; ) {
      const l = n[r], a = new DataView(n.buffer, n.byteOffset + r + 1, 4).getUint32(0);
      if (n.length - r < 5 + a) break;
      if (l & 2) {
        const c = n.subarray(r + 5, r + 5 + a);
        r += 5 + a;
        let d = {};
        try {
          c.length > 0 && (d = JSON.parse(qt.decode(c)));
        } catch {
        }
        t.isDisposed() || t.onTrailer?.(d);
        return;
      }
      const u = n.subarray(r + 5, r + 5 + a);
      r += 5 + a;
      try {
        const c = JSON.parse(qt.decode(u));
        t.isDisposed() || t.onMessage(c);
      } catch {
      }
    }
  }
}
function Wn(e, t) {
  return t ? t.split(".").reduce((n, r) => {
    if (n != null) {
      if (Array.isArray(n)) {
        const s = Number(r);
        return Number.isInteger(s) ? n[s] : void 0;
      }
      if (typeof n == "object")
        return n[r];
    }
  }, e) : e;
}
function es(e) {
  return e.inline ?? e.data;
}
function Gt(e) {
  return e.refreshIntervalMs ?? e.refreshInterval;
}
function Vt(e) {
  return e instanceof Error ? e.name === "AbortError" ? !0 : /\babort(?:ed)?\b/i.test(e.message) : !1;
}
function ts(e) {
  e.signal.aborted || e.abort();
}
const Jt = 3e4, Nt = 1e3;
function ns(e, t) {
  return t ? Wn(e, t) : e;
}
const rs = /* @__PURE__ */ new Set([
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
function ss(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return e;
  const t = Object.keys(e);
  return t.length === 1 && rs.has(t[0]) ? e[t[0]] : e;
}
function os(e) {
  const [t, n] = v(null), [r, s] = v(!0), [i, l] = v(null), [a, u] = v(null), [c, d] = v(!1), [f, h] = v(null), [p, g] = v(0), b = ce(() => g((I) => I + 1), []), w = U(Nt), A = U(void 0), $ = U(null), j = U(void 0), E = U(0), x = ce((I) => {
    const G = ns(ss(I), e?.transform);
    n(G), l(null), s(!1), u(Date.now()), E.current = Date.now();
  }, [e?.transform]), T = ce((I) => {
    const G = e?.throttleMs ?? 0;
    if (G <= 0) {
      x(I);
      return;
    }
    const Z = Date.now() - E.current;
    if (Z >= G) {
      x(I);
      return;
    }
    $.current = I, j.current || (j.current = setTimeout(() => {
      $.current !== null && x($.current), $.current = null, j.current = void 0;
    }, G - Z));
  }, [x, e?.throttleMs]), O = L(() => e ? JSON.stringify([
    e.url,
    e.source_id,
    e.method,
    e.body,
    e.headers,
    e.stream,
    Gt(e),
    e.transform,
    e.throttleMs,
    // Inline gets a separate key (truncated to keep the dep stable for
    // payload-identity changes only when the value itself mutates).
    e.inline !== void 0 || e.data !== void 0
  ]) : "", [e]);
  return R(() => {
    if (!e) {
      s(!1);
      return;
    }
    const I = es(e);
    if (I !== void 0) {
      T(I);
      return;
    }
    if (!e.url) {
      s(!1);
      return;
    }
    if (e.stream === "connect") {
      let P = !1;
      const K = new AbortController(), q = async () => {
        if (!P)
          try {
            const z = await fetch(e.url, {
              method: "POST",
              // Spread author headers first so the protocol Content-Type
              // wins. Otherwise a stray Content-Type header on the source
              // overrides the connect+json marker.
              headers: { ...e.headers, "Content-Type": Kn },
              body: JSON.stringify(e.body ?? {}),
              signal: K.signal
            });
            if (!z.ok) throw new Error(`ConnectRPC: HTTP ${z.status}`);
            if (!z.body) throw new Error("ConnectRPC: no response body");
            d(!0), h(null), l(null), w.current = Nt;
            const H = z.body.getReader();
            await Hn(H, {
              onMessage: T,
              onTrailer: (ee) => {
                if (ee.error) {
                  const Q = ee.error.code ?? "unknown", oe = ee.error.message ?? "stream error";
                  P || l(`${Q}: ${oe}`);
                }
              },
              isDisposed: () => P
            }), H.releaseLock();
          } catch (z) {
            !P && z instanceof Error && !Vt(z) && l(z.message);
          } finally {
            if (!P) {
              d(!1);
              const z = w.current;
              h(Date.now() + z), A.current = setTimeout(() => {
                w.current = Math.min(w.current * 2, Jt), q();
              }, z);
            }
          }
      };
      return q(), () => {
        P = !0, ts(K), clearTimeout(A.current), d(!1), h(null);
      };
    }
    if (e.stream === !0) {
      let P = null, K = !1;
      const q = () => {
        K || (P = new EventSource(e.url), P.onopen = () => {
          d(!0), h(null), l(null), w.current = Nt;
        }, P.onmessage = (z) => {
          try {
            T(JSON.parse(z.data));
          } catch {
            l("Failed to parse stream");
          }
        }, P.onerror = () => {
          if (P?.close(), d(!1), !K) {
            const z = w.current;
            h(Date.now() + z), A.current = setTimeout(() => {
              w.current = Math.min(w.current * 2, Jt), q();
            }, z);
          }
        });
      };
      return q(), () => {
        K = !0, clearTimeout(A.current), P?.close(), d(!1), h(null);
      };
    }
    let G = !1;
    const Z = async () => {
      if (!G)
        try {
          const P = await fetch(e.url, {
            method: e.method || "GET",
            headers: e.headers,
            body: e.body ? JSON.stringify(e.body) : void 0
          });
          if (!P.ok) throw new Error(`HTTP ${P.status}`);
          const K = await P.json();
          G || T(K);
        } catch (P) {
          !G && P instanceof Error && !Vt(P) && l(P.message);
        } finally {
          G || s(!1);
        }
    };
    Z();
    let X;
    const Y = Gt(e);
    return Y && Y > 0 && (X = setInterval(() => {
      Z();
    }, Y)), () => {
      G = !0, X && clearInterval(X);
    };
  }, [O, T, p]), R(() => () => {
    j.current && clearTimeout(j.current);
  }, []), { data: t, loading: r, error: i, lastUpdated: a, connected: c, nextRetryAt: f, refresh: b };
}
const is = {
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
function Xt({ component: e }) {
  switch (e ? is[e] : "block") {
    case "chart":
      return /* @__PURE__ */ o(as, {});
    case "table":
      return /* @__PURE__ */ o(cs, {});
    case "list":
      return /* @__PURE__ */ o(us, {});
    case "single":
      return /* @__PURE__ */ o(ds, {});
    case "donut":
      return /* @__PURE__ */ o(fs, {});
    case "grid":
      return /* @__PURE__ */ o(ms, {});
    default:
      return /* @__PURE__ */ o(ps, {});
  }
}
function D({ children: e, padded: t }) {
  return /* @__PURE__ */ m(
    "div",
    {
      className: `flex flex-col items-center justify-center h-full gap-1.5 text-zinc-500 text-sm${t ? " px-4 text-center" : ""}`,
      children: [
        /* @__PURE__ */ o("span", { className: "text-zinc-700 text-xs uppercase tracking-[0.2em] leading-none", children: "·  ·  ·" }),
        e
      ]
    }
  );
}
function Yt({ message: e, onRetry: t }) {
  return /* @__PURE__ */ m("div", { className: "h-full flex flex-col items-center justify-center gap-2 px-2", children: [
    /* @__PURE__ */ m("div", { className: "flex items-center gap-2 text-sm max-w-full", children: [
      /* @__PURE__ */ o("span", { className: "text-red-400 shrink-0", children: "⚠" }),
      /* @__PURE__ */ o("span", { className: "text-zinc-400 font-mono text-xs truncate", children: e })
    ] }),
    t && /* @__PURE__ */ o(
      "button",
      {
        onClick: t,
        className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800",
        children: "Retry"
      }
    )
  ] });
}
const ls = [40, 60, 35, 75, 55, 85, 50, 70, 90, 45, 65, 80, 55, 95, 60, 50, 75, 65, 80, 70];
function as() {
  return /* @__PURE__ */ o("div", { className: "h-full flex items-end gap-1", children: ls.map((e, t) => /* @__PURE__ */ o(
    "div",
    {
      className: "flex-1 bg-zinc-800 rounded-sm animate-pulse",
      style: { height: `${e}%`, animationDelay: `${t * 40}ms` }
    },
    t
  )) });
}
function cs() {
  const t = [80, 64, 96];
  return /* @__PURE__ */ m("div", { className: "h-full flex flex-col gap-2.5", children: [
    /* @__PURE__ */ o("div", { className: "flex gap-4 pb-2 border-b border-zinc-800", children: t.map((n, r) => /* @__PURE__ */ o("div", { className: "h-3 bg-zinc-800 rounded animate-pulse", style: { width: n } }, r)) }),
    Array.from({ length: 5 }).map((n, r) => /* @__PURE__ */ o("div", { className: "flex gap-4", children: t.map((s, i) => /* @__PURE__ */ o(
      "div",
      {
        className: "h-3 bg-zinc-800 rounded animate-pulse",
        style: { width: s, animationDelay: `${(r * 3 + i) * 50}ms` }
      },
      i
    )) }, r))
  ] });
}
function us() {
  return /* @__PURE__ */ o("div", { className: "h-full flex flex-col gap-3.5", children: Array.from({ length: 5 }).map((e, t) => /* @__PURE__ */ m("div", { className: "flex gap-3 items-start pt-1", children: [
    /* @__PURE__ */ o("div", { className: "w-2 h-2 rounded-full bg-zinc-700 mt-1 shrink-0 animate-pulse" }),
    /* @__PURE__ */ m("div", { className: "flex-1 flex flex-col gap-1.5 min-w-0", children: [
      /* @__PURE__ */ o(
        "div",
        {
          className: "h-2.5 bg-zinc-800 rounded animate-pulse",
          style: { width: `${55 + t * 11 % 30}%`, animationDelay: `${t * 80}ms` }
        }
      ),
      /* @__PURE__ */ o(
        "div",
        {
          className: "h-2 bg-zinc-800/60 rounded animate-pulse",
          style: { width: `${35 + t * 7 % 25}%`, animationDelay: `${t * 80 + 40}ms` }
        }
      )
    ] })
  ] }, t)) });
}
function ds() {
  return /* @__PURE__ */ m("div", { className: "h-full flex flex-col items-center justify-center gap-2", children: [
    /* @__PURE__ */ o("div", { className: "w-32 h-7 bg-zinc-800 rounded animate-pulse" }),
    /* @__PURE__ */ o("div", { className: "w-20 h-3 bg-zinc-800/60 rounded animate-pulse", style: { animationDelay: "120ms" } })
  ] });
}
function fs() {
  return /* @__PURE__ */ m("div", { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ o("div", { className: "flex-1 flex items-center justify-center min-h-0", children: /* @__PURE__ */ o("svg", { viewBox: "0 0 100 100", className: "w-full h-full max-w-[160px] max-h-[160px] animate-pulse", children: /* @__PURE__ */ o("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: "#27272a", strokeWidth: "14" }) }) }),
    /* @__PURE__ */ o("div", { className: "grid grid-cols-2 gap-2 mt-2", children: Array.from({ length: 4 }).map((e, t) => /* @__PURE__ */ m("div", { className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ o("div", { className: "w-2 h-2 bg-zinc-800 rounded-sm animate-pulse" }),
      /* @__PURE__ */ o(
        "div",
        {
          className: "flex-1 h-2 bg-zinc-800 rounded animate-pulse",
          style: { animationDelay: `${t * 60}ms` }
        }
      )
    ] }, t)) })
  ] });
}
function ms() {
  return /* @__PURE__ */ o(
    "div",
    {
      className: "h-full grid gap-1",
      style: { gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(5, 1fr)" },
      children: Array.from({ length: 40 }).map((t, n) => /* @__PURE__ */ o(
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
function ps() {
  return /* @__PURE__ */ o("div", { className: "h-full w-full bg-zinc-800 rounded animate-pulse" });
}
function hs(e) {
  return /* @__PURE__ */ o(D, { children: "Unknown widget type" });
}
const B = (e, t) => _r(() => e().then((n) => ({ default: n[t] }))), Kt = /* @__PURE__ */ new Map([
  ["timeseries", B(() => Promise.resolve().then(() => zi), "Timeseries")],
  ["candlestick", B(() => Promise.resolve().then(() => Oi), "Candlestick")],
  ["table", B(() => Promise.resolve().then(() => Bi), "DataTable")],
  ["metric", B(() => Promise.resolve().then(() => Ji), "Metric")],
  ["text", B(() => Promise.resolve().then(() => Qi), "Text")],
  ["prompt", B(() => Promise.resolve().then(() => tl), "Prompt")],
  ["gauge", B(() => Promise.resolve().then(() => ol), "Gauge")],
  ["distribution", B(() => Promise.resolve().then(() => cl), "Distribution")],
  ["heatmap", B(() => Promise.resolve().then(() => bl), "Heatmap")],
  ["events", B(() => Promise.resolve().then(() => vl), "Events")],
  ["catalog", B(() => Promise.resolve().then(() => Sl), "Catalog")],
  ["orderbook", B(() => Promise.resolve().then(() => _l), "OrderBook")],
  ["paired_grid", B(() => Promise.resolve().then(() => Ml), "PairedGrid")],
  ["trade", B(() => Promise.resolve().then(() => Dl), "Trade")],
  ["ticker", B(() => Promise.resolve().then(() => Hl), "Ticker")],
  ["volume_profile", B(() => Promise.resolve().then(() => Jl), "VolumeProfile")],
  ["stat_strip", B(() => Promise.resolve().then(() => ta), "StatStrip")],
  ["bar_chart", B(() => Promise.resolve().then(() => oa), "BarChart")],
  ["scatter", B(() => Promise.resolve().then(() => da), "Scatter")],
  ["clock", B(() => Promise.resolve().then(() => ya), "Clock")],
  ["treemap", B(() => Promise.resolve().then(() => Sa), "Treemap")],
  ["image", B(() => Promise.resolve().then(() => _a), "Image")],
  ["iframe", B(() => Promise.resolve().then(() => Ca), "Iframe")],
  ["histogram", B(() => Promise.resolve().then(() => La), "Histogram")],
  ["section", B(() => Promise.resolve().then(() => Da), "Section")],
  ["area_chart", B(() => Promise.resolve().then(() => qa), "AreaChart")],
  ["slider", B(() => Promise.resolve().then(() => Ja), "Slider")],
  ["select", B(() => Promise.resolve().then(() => ec), "Select")],
  ["boxplot", B(() => Promise.resolve().then(() => oc), "Boxplot")],
  ["radar", B(() => Promise.resolve().then(() => uc), "Radar")],
  ["dag", B(() => Promise.resolve().then(() => bc), "Dag")],
  ["multi_select", B(() => Promise.resolve().then(() => xc), "MultiSelect")],
  ["json", B(() => Promise.resolve().then(() => wc), "Json")],
  ["sparkline", B(() => Promise.resolve().then(() => Sc), "Sparkline")],
  ["action_log", B(() => Promise.resolve().then(() => Ec), "ActionLog")],
  ["alert_log", B(() => Promise.resolve().then(() => Rc), "AlertLog")],
  ["tape", B(() => Promise.resolve().then(() => Hc), "Tape")],
  ["file_browser", B(() => Promise.resolve().then(() => pu), "FileBrowser")]
]), Nu = new Set(Kt.keys());
function bs(e) {
  return Kt.get(e) || hs;
}
function Su(e, t) {
  Kt.set(e, t);
}
class gs extends Tr {
  state = { error: null };
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  componentDidCatch(t, n) {
    console.error("[MedallionTerminal] Widget error:", t, n.componentStack), this.props.onError?.(t);
  }
  render() {
    return this.state.error ? /* @__PURE__ */ o("div", { className: "flex items-center justify-center h-full text-red-400/80 text-sm p-4 text-center", children: /* @__PURE__ */ m("div", { children: [
      /* @__PURE__ */ o("div", { className: "font-medium mb-1", children: "Widget Error" }),
      /* @__PURE__ */ o("div", { className: "text-zinc-500 text-xs", children: this.state.error.message })
    ] }) }) : this.props.children;
  }
}
const xs = {
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
}, qn = Bt(xs);
function ae() {
  return Ut(qn);
}
const bt = "medallion.terminal.v1.TerminalService";
function ys(e) {
  return `${e.replace(/\/$/, "")}/${bt}/Generate`;
}
function vs(e, t, n) {
  return {
    prompt: e,
    context: { values: t },
    current_widgets: n
  };
}
function Gn(e) {
  return `${e.replace(/\/$/, "")}/${bt}/SubmitAction`;
}
function ws(e) {
  return `${e.replace(/\/$/, "")}/${bt}/WatchAction`;
}
function Vn(e) {
  return { action_id: e.actionId, params: e.params, client_request_id: e.clientRequestId };
}
function ks(e) {
  return {
    action_id: e.actionId ?? "",
    id: e.id ?? "",
    client_request_id: e.clientRequestId ?? ""
  };
}
function Jn() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `cr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
let Zt = !1;
class Ns extends Error {
  constructor(t) {
    super(`Missing context key: \${ctx.${t}}`), this.key = t, this.name = "InterpolationError";
  }
}
function Be(e, t, n) {
  return e.replace(/\$\{ctx\.([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (r, s) => {
    if (s in t) return t[s];
    if (n?.strict) throw new Ns(s);
    return "";
  });
}
function Ss(e, t, n) {
  if (e.source_id) {
    if (n === void 0)
      return Zt || (console.warn(
        `[medallion] source_id "${e.source_id}" requires a backendUrl on <Dashboard>; widget will not load until one is set.`
      ), Zt = !0), e;
    const s = e.stream ? "Stream" : "Get", i = n.replace(/\/$/, ""), l = {};
    if (e.params)
      for (const [a, u] of Object.entries(e.params))
        l[a] = Be(u, t, { strict: !0 });
    return {
      url: `${i}/${bt}/${s}`,
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
    let s = Be(e.url, t, { strict: !0 });
    if (e.params && Object.keys(e.params).length > 0) {
      const i = Object.entries(e.params).map(([l, a]) => `${encodeURIComponent(l)}=${encodeURIComponent(Be(a, t, { strict: !0 }))}`).join("&");
      s = s.includes("?") ? `${s}&${i}` : `${s}?${i}`;
    }
    r.url = s;
  }
  return r;
}
const Xn = Bt({
  now: 0,
  subscribe: () => () => {
  }
});
function gt(e = !0) {
  const { now: t, subscribe: n } = Ut(Xn);
  return R(() => {
    if (e)
      return n();
  }, [e, n]), t;
}
function zs({ children: e }) {
  const [t, n] = v(() => Date.now()), r = U(0), s = U(null), i = L(() => ({
    now: t,
    subscribe: () => (r.current += 1, s.current == null && (s.current = setInterval(() => n(Date.now()), 1e3)), () => {
      r.current = Math.max(0, r.current - 1), r.current === 0 && s.current != null && (clearInterval(s.current), s.current = null);
    })
  }), [t]);
  return R(() => () => {
    s.current != null && clearInterval(s.current);
  }, []), /* @__PURE__ */ o(Xn.Provider, { value: i, children: e });
}
const As = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/;
function _s(e, t) {
  const n = Yn(t);
  return n ? Es(n, e) : !1;
}
function Ts(e) {
  return Yn(e) !== null;
}
function Yn(e) {
  const t = e.trim();
  if (!t) return null;
  const n = Qt(t, "||"), r = [];
  for (const s of n) {
    const i = Qt(s, "&&"), l = [];
    for (const a of i) {
      const u = $s(a);
      if (!u) return null;
      l.push(u);
    }
    if (l.length === 0) return null;
    r.push(l);
  }
  return r.length === 0 ? null : r;
}
function Qt(e, t) {
  const n = [];
  let r = 0, s = !1;
  for (let i = 0; i < e.length; i++)
    if (e[i] === '"' && (s = !s), !s && !s && e.startsWith(t, i)) {
      n.push(e.slice(r, i)), r = i + t.length, i += t.length - 1;
      continue;
    }
  return n.push(e.slice(r)), n.map((i) => i.trim());
}
function $s(e) {
  const t = e.trim().match(As);
  if (!t) return null;
  const [, n, r, s] = t;
  return { path: n.trim(), op: r, rhs: Cs(s.trim()) };
}
function Cs(e) {
  if (e === "true") return !0;
  if (e === "false") return !1;
  if (e === "null") return null;
  if (e.length >= 2 && e.startsWith('"') && e.endsWith('"'))
    return e.slice(1, -1);
  const t = Number(e);
  return Number.isNaN(t) ? e : t;
}
function Es(e, t) {
  for (const n of e) {
    let r = !0;
    for (const s of n)
      if (!Os(Wn(t, s.path), s.op, s.rhs)) {
        r = !1;
        break;
      }
    if (r) return !0;
  }
  return !1;
}
function Os(e, t, n) {
  if (t === ">" || t === ">=" || t === "<" || t === "<=") {
    const r = Number(e), s = Number(n);
    if (!Number.isFinite(r) || !Number.isFinite(s)) return !1;
    switch (t) {
      case ">":
        return r > s;
      case ">=":
        return r >= s;
      case "<":
        return r < s;
      case "<=":
        return r <= s;
    }
  }
  return t === "==" ? e === n || typeof e == "number" && typeof n == "number" && e === n : t === "!=" ? !(e === n || typeof e == "number" && typeof n == "number" && e === n) : !1;
}
const Ms = {
  warn: 720,
  // mid
  error: 480
  // low — more alarming
}, en = 160, Rs = 0.08;
let nt = null;
function js() {
  if (typeof window > "u") return null;
  if (nt) return nt;
  const e = window, t = window.AudioContext || e.webkitAudioContext;
  return t ? (nt = new t(), nt) : null;
}
function Is(e) {
  const t = Ms[e];
  if (!t) return;
  const n = js();
  if (!n) return;
  n.state === "suspended" && n.resume().catch(() => {
  });
  const r = n.createOscillator(), s = n.createGain();
  r.type = "sine", r.frequency.value = t, s.gain.value = 0, r.connect(s), s.connect(n.destination);
  const i = n.currentTime;
  s.gain.linearRampToValueAtTime(Rs, i + 0.02), s.gain.linearRampToValueAtTime(0, i + en / 1e3), r.start(i), r.stop(i + en / 1e3 + 0.05);
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
function fe(e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const s of e)
    for (const i of Object.keys(s))
      n.has(i) || (n.add(i), t.push(i));
  const r = e.map((s) => {
    const i = {};
    for (const l of t) i[l] = ze(s[l]);
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
    const r = e.series, s = /* @__PURE__ */ new Map(), i = [];
    for (let l = 0; l < r.length; l++) {
      const a = r[l], u = a.name ?? `series_${l + 1}`;
      i.push(u);
      const c = a.points ?? a.data ?? [];
      for (const d of c) {
        const f = String(d.timestamp ?? ""), h = s.get(f) ?? { timestamp: f };
        h[u] = ze(d.value), s.set(f, h);
      }
    }
    return { columns: ["timestamp", ...i], rows: [...s.values()] };
  }
  const n = t(e);
  return n ? {
    columns: ["timestamp", "value"],
    rows: n.map((r) => ({ timestamp: ze(r.timestamp), value: ze(r.value) }))
  } : null;
}
function Zn(e) {
  return le(e) && Array.isArray(e.bars) ? fe(e.bars) : null;
}
function Qn(e) {
  if (Array.isArray(e) && e.length > 0 && le(e[0]))
    return fe(e);
  if (le(e) && "rows" in e) {
    const t = e, n = Array.isArray(t.columns) ? t.columns : [];
    if (n.length > 0 && le(n[0])) {
      const i = n.map((a) => a.key), l = t.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(i.map((u, c) => [u, ze(a[c])])) : tn(a, i)
      );
      return { columns: i, rows: l };
    }
    if (n.length > 0 && typeof n[0] == "string") {
      const s = n, i = t.rows.map(
        (l) => Array.isArray(l) ? Object.fromEntries(s.map((a, u) => [a, ze(l[u])])) : tn(l, s)
      );
      return { columns: s, rows: i };
    }
    const r = t.rows;
    return r.length > 0 && le(r[0]) ? fe(r) : mt;
  }
  return null;
}
function tn(e, t) {
  const n = {};
  for (const r of t) n[r] = ze(e[r]);
  return n;
}
function er(e) {
  return le(e) && Array.isArray(e.cells) ? fe(e.cells) : null;
}
function tr(e) {
  return le(e) && Array.isArray(e.slices) ? fe(e.slices) : null;
}
function Je(e) {
  return le(e) && Array.isArray(e.events) ? fe(e.events) : null;
}
function Lt(e) {
  return le(e) && Array.isArray(e.items) ? fe(e.items) : null;
}
function nr(e) {
  if (le(e) && (Array.isArray(e.bids) || Array.isArray(e.asks))) {
    const t = e.bids ?? [], n = e.asks ?? [], r = [
      ...t.map((s) => ({ side: "bid", ...s })),
      ...n.map((s) => ({ side: "ask", ...s }))
    ];
    return fe(r);
  }
  return null;
}
function rr(e) {
  return typeof e == "number" ? { columns: ["value"], rows: [{ value: e }] } : le(e) && "value" in e && typeof e.value != "object" ? fe([e]) : null;
}
function sr(e) {
  if (le(e) && "value" in e) {
    const { value: t, min: n, max: r } = e;
    return fe([{ value: t, min: n, max: r }]);
  }
  return null;
}
const Ls = {
  timeseries: ut,
  area_chart: ut,
  sparkline: ut,
  candlestick: Zn,
  table: Qn,
  heatmap: er,
  distribution: tr,
  events: Je,
  tape: Je,
  action_log: Je,
  alert_log: Je,
  text: Lt,
  ticker: Lt,
  orderbook: nr,
  metric: rr,
  gauge: sr
};
function Ps(e) {
  if (e == null) return mt;
  if (Array.isArray(e))
    return e.length === 0 ? mt : le(e[0]) ? fe(e) : { columns: ["value"], rows: e.map((t) => ({ value: ze(t) })) };
  if (le(e)) {
    const t = Object.entries(e).find(([, n]) => Array.isArray(n));
    return t && le(t[1][0]) ? fe(t[1]) : fe([e]);
  }
  return { columns: ["value"], rows: [{ value: ze(e) }] };
}
function Ds(e, t) {
  if (e == null) return mt;
  if (t) {
    const n = Ls[t];
    if (n) {
      const r = n(e);
      if (r) return r;
    }
  }
  for (const n of [
    ut,
    Zn,
    er,
    tr,
    Je,
    Lt,
    nr,
    sr,
    rr,
    Qn
  ]) {
    const r = n(e);
    if (r && r.rows.length > 0) return r;
  }
  return Ps(e);
}
const nn = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
  ndjson: "application/x-ndjson;charset=utf-8",
  parquet: "application/vnd.apache.parquet"
}, Fs = {
  csv: "csv",
  json: "json",
  ndjson: "ndjson",
  parquet: "parquet"
}, or = [
  { key: "csv", label: "CSV" },
  { key: "parquet", label: "Parquet" },
  { key: "json", label: "JSON" },
  { key: "ndjson", label: "NDJSON" }
];
function rn(e) {
  if (e == null) return "";
  const t = String(e);
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function Us(e) {
  const { columns: t, rows: n } = e, r = t.map(rn).join(","), s = n.map((i) => t.map((l) => rn(i[l])).join(","));
  return [r, ...s].join(`
`);
}
function Bs(e) {
  return JSON.stringify(e.rows, null, 2);
}
function Ks(e) {
  return e.rows.map((t) => JSON.stringify(t)).join(`
`);
}
function Hs(e) {
  return e.columns.map((t) => ({
    name: t,
    data: e.rows.map((n) => n[t] ?? null)
  }));
}
async function Ws(e) {
  const { parquetWriteBuffer: t } = await import("./index-BKASYduw.js"), n = e.columns.length > 0 ? Hs(e) : [{ name: "value", data: [] }], r = t({ columnData: n });
  return new Uint8Array(r);
}
function qs(e, t) {
  switch (t) {
    case "csv":
      return Us(e);
    case "json":
      return Bs(e);
    case "ndjson":
      return Ks(e);
  }
}
function ir(e) {
  return e.table ?? Ds(e.data, e.component);
}
async function Gs(e, t) {
  const n = ir(e);
  if (t === "parquet") {
    const s = await Ws(n);
    return new Blob([s.slice().buffer], { type: nn.parquet });
  }
  const r = qs(n, t);
  return new Blob([r], { type: nn[t] });
}
function lr(e) {
  return ir(e).rows.length;
}
function Vs(e, t) {
  return `${(e ?? "export").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "export"}.${Fs[t]}`;
}
async function ar(e, t, n) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function")
    return !1;
  const r = await Gs(e, t), s = URL.createObjectURL(r), i = document.createElement("a");
  return i.href = s, i.download = Vs(n, t), document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(s), 0), !0;
}
function Js(e, t) {
  if (!t) return null;
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "just now";
  if (n < 60) return `${n}s ago`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m ago` : `${Math.floor(r / 60)}h ago`;
}
function Xs(e) {
  const { resolution: t, loading: n, error: r, data: s, options: i, component: l, widgetId: a, Component: u, onRenderError: c, onRetry: d } = e;
  return t.error ? /* @__PURE__ */ o(Yt, { message: t.error }) : n ? /* @__PURE__ */ o(Xt, { component: l }) : r ? /* @__PURE__ */ o(Yt, { message: r, onRetry: d }) : /* @__PURE__ */ o("div", { className: "h-full motion-safe:animate-[fadeIn_200ms_ease-out]", children: /* @__PURE__ */ o(gs, { onError: c, children: /* @__PURE__ */ o($r, { fallback: /* @__PURE__ */ o(Xt, { component: l }), children: /* @__PURE__ */ o(u, { data: s, options: i, widgetId: a }) }) }) });
}
function Ys({
  widget: e,
  data: t,
  onRefresh: n,
  onCopy: r,
  onToast: s
}) {
  const { dispatch: i, fullscreenId: l, setFullscreenId: a } = ae(), [u, c] = v(!1), [d, f] = v(!1), [h, p] = v(!1), g = U(null);
  R(() => {
    if (!u) return;
    const O = (I) => {
      g.current && !g.current.contains(I.target) && (c(!1), f(!1));
    };
    return document.addEventListener("mousedown", O), () => document.removeEventListener("mousedown", O);
  }, [u]);
  const b = e.source, w = b?.data !== void 0 && !b.url && !b.source_id, A = !!b && !w, $ = !!e.id, j = !!e.id && l !== e.id, E = t == null ? 0 : lr({ data: t, component: e.component }), x = E > 0, T = async (O) => {
    p(!0);
    try {
      const I = await ar(
        { data: t, component: e.component },
        O,
        e.title ?? e.id ?? e.component
      );
      s(
        I ? `Exported ${E.toLocaleString()} rows as ${O.toUpperCase()}` : "Export failed",
        I ? "ok" : "warn"
      );
    } catch {
      s("Export failed", "error");
    } finally {
      p(!1), c(!1), f(!1);
    }
  };
  return /* @__PURE__ */ m("div", { className: "relative", ref: g, children: [
    /* @__PURE__ */ o(
      "button",
      {
        onClick: () => c((O) => !O),
        className: "text-zinc-600 hover:text-zinc-300 px-1.5 text-base leading-none rounded",
        "aria-label": "Widget actions",
        children: "⋮"
      }
    ),
    u && /* @__PURE__ */ m("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-20 min-w-[140px]", children: [
      A && /* @__PURE__ */ o(
        "button",
        {
          onClick: () => {
            n(), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Refresh"
        }
      ),
      /* @__PURE__ */ o(
        "button",
        {
          onClick: async () => {
            await r(), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Copy data"
        }
      ),
      x && /* @__PURE__ */ m("div", { children: [
        /* @__PURE__ */ m(
          "button",
          {
            onClick: () => f((O) => !O),
            className: "w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 flex items-center justify-between",
            "aria-expanded": d,
            children: [
              /* @__PURE__ */ m("span", { children: [
                "Export",
                h ? "…" : ""
              ] }),
              /* @__PURE__ */ o("span", { className: "text-zinc-600", children: d ? "▾" : "▸" })
            ]
          }
        ),
        d && /* @__PURE__ */ o("div", { className: "bg-zinc-950/60", children: or.map((O) => /* @__PURE__ */ o(
          "button",
          {
            onClick: () => T(O.key),
            disabled: h,
            className: "block w-full text-left pl-6 pr-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50",
            children: O.label
          },
          O.key
        )) })
      ] }),
      j && /* @__PURE__ */ o(
        "button",
        {
          onClick: () => {
            a(e.id), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800",
          children: "Fullscreen"
        }
      ),
      $ && /* @__PURE__ */ o(
        "button",
        {
          onClick: () => {
            i([{ targetId: e.id, remove: !0 }]), c(!1);
          },
          className: "block w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800",
          children: "Remove"
        }
      )
    ] })
  ] });
}
function cr({ config: e, contentHeight: t, snapshotKey: n }) {
  const { ctx: r, backendUrl: s, refreshIntervalMs: i, compact: l, toast: a, focusedId: u, setFocusedId: c, refreshPulse: d, emit: f, soundEnabled: h, reportWidgetHealth: p, registerWidgetData: g } = ae(), b = L(
    () => e.title ? Be(e.title, r) : e.title,
    [e.title, r]
  ), w = L(() => {
    if (!e.source) return { source: void 0, error: null };
    try {
      const k = Ss(e.source, r, s);
      return i && i > 0 && !k.stream ? { source: { ...k, refreshIntervalMs: i }, error: null } : { source: k, error: null };
    } catch (k) {
      return { source: void 0, error: k instanceof Error ? k.message : "Resolution error" };
    }
  }, [e.source, r, s, i]), A = w.source, { data: $, loading: j, error: E, lastUpdated: x, connected: T, nextRetryAt: O, refresh: I } = os(A), G = bs(e.component), Z = U($);
  Z.current = $, R(() => {
    if (n)
      return g(n, () => Z.current);
  }, [n, g]);
  const X = !!A?.stream || !!(A?.refreshIntervalMs ?? A?.refreshInterval), Y = A?.staleAfterMs, P = X && x != null || O != null || !!Y && x != null, K = gt(P), q = !!Y && x != null && K - x > Y, z = U(0);
  R(() => {
    if (!d) return;
    const k = e.refresh_policy ?? "global";
    if (k === "manual") return;
    const _ = d.id === "*";
    _ && k === "self" || !(_ || d.id === e.id) || d.n > z.current && (z.current = d.n, I());
  }, [d, e.id, e.refresh_policy, I]);
  const H = U(!1);
  R(() => {
    const k = e.alert;
    if (!k || $ == null) {
      H.current = !1;
      return;
    }
    const _ = _s($, k.when);
    if (_ && !H.current) {
      const M = Be(k.message, r), W = k.severity ?? "warn";
      a(M, W), f({ type: "alert", widgetId: e.id, severity: W, message: M, predicate: k.when }), h && Is(W);
    }
    H.current = _;
  }, [$, e.alert, r, a, f, e.id, h]);
  const ee = U(null);
  R(() => {
    const k = w.error ?? E, _ = w.error ? "resolve" : "data";
    k && k !== ee.current ? (f({ type: "widget_error", widgetId: e.id, component: e.component, message: k, source: _ }), ee.current = k) : k || (ee.current = null);
  }, [w.error, E, f, e.id, e.component]), R(() => {
    if (!e.id) return;
    const k = !!A?.stream;
    return p(e.id, {
      title: b || e.title || e.component,
      streaming: k,
      connected: k ? T : !0,
      error: w.error ?? E,
      stale: q
    }), () => p(e.id, null);
  }, [e.id, b, e.title, e.component, A?.stream, T, w.error, E, q, p]);
  const Q = !!e.id && u === e.id, oe = e.id ? () => c(e.id) : void 0;
  return /* @__PURE__ */ m(
    "div",
    {
      onClick: oe,
      className: `bg-zinc-900 border ${Q ? "border-sky-400/60 shadow-[0_0_12px_-2px_rgba(56,189,248,0.4)]" : "border-zinc-800"} ${l ? "rounded" : "rounded-lg"} overflow-hidden transition-shadow`,
      children: [
        b && /* @__PURE__ */ m("div", { className: `${l ? "px-2.5 py-1.5" : "px-4 py-2.5"} border-b border-zinc-800 flex items-center justify-between`, children: [
          /* @__PURE__ */ o("h3", { className: `${l ? "text-xs" : "text-sm"} font-medium text-zinc-100 truncate`, children: b }),
          /* @__PURE__ */ m("div", { className: "flex items-center gap-2 shrink-0 ml-2", children: [
            X && x && /* @__PURE__ */ m("span", { className: `text-[10px] ${q ? "text-amber-400/80" : "text-zinc-600"}`, children: [
              q ? "stale · " : "",
              Js(K, x)
            ] }),
            e.source?.stream && !T && O != null && /* @__PURE__ */ m("span", { className: "text-[10px] text-amber-400/80 tabular-nums", title: "Reconnecting", children: [
              "retry ",
              Math.max(0, Math.ceil((O - K) / 1e3)),
              "s"
            ] }),
            e.source?.stream && /* @__PURE__ */ o(
              "span",
              {
                className: `w-2 h-2 rounded-full shrink-0 ${T ? "bg-emerald-400 animate-pulse" : "bg-amber-500/70"}`,
                title: T ? "Connected" : O ? "Reconnecting" : "Disconnected"
              }
            ),
            /* @__PURE__ */ o(
              Ys,
              {
                widget: e,
                data: $,
                onToast: a,
                onRefresh: I,
                onCopy: async () => {
                  if ($ == null)
                    return a("No data to copy", "warn"), !1;
                  if (typeof navigator > "u" || !navigator.clipboard)
                    return a("Clipboard unavailable", "warn"), !1;
                  try {
                    return await navigator.clipboard.writeText(JSON.stringify($, null, 2)), a(`${e.title ?? e.component} copied`, "ok"), !0;
                  } catch {
                    return a("Clipboard blocked", "warn"), !1;
                  }
                }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ o("div", { className: l ? "p-2.5" : "p-4", style: { height: l ? Math.round(t * 0.92) : t }, children: Xs({
          resolution: w,
          loading: j,
          error: E,
          data: $,
          options: e.options,
          component: e.component,
          widgetId: e.id,
          Component: G,
          onRenderError: (k) => f({
            type: "widget_error",
            widgetId: e.id,
            component: e.component,
            message: k.message,
            source: "render"
          }),
          // Inline-data sources can't retry; only offer the button
          // when there's an actual fetch/stream behind the widget.
          onRetry: A && !(A.inline !== void 0 || A.data !== void 0) ? I : void 0
        }) })
      ]
    }
  );
}
const ur = Bt({
  hoverTime: null,
  setHoverTime: () => {
  }
});
function dr() {
  return Ut(ur);
}
function Zs({ children: e }) {
  const [t, n] = v(null), r = L(() => ({ hoverTime: t, setHoverTime: n }), [t]);
  return /* @__PURE__ */ o(ur.Provider, { value: r, children: e });
}
function Qs(e, t, n) {
  const r = n?.replaceAll ? [] : [...e];
  for (const s of t) {
    const i = r.findIndex((l) => l.id === s.targetId);
    if (s.remove) {
      i >= 0 && r.splice(i, 1);
      continue;
    }
    i >= 0 ? r[i] = {
      ...r[i],
      ...s.component !== void 0 && { component: s.component },
      ...s.title !== void 0 && { title: s.title },
      ...s.span !== void 0 && { span: s.span },
      ...s.height !== void 0 && { height: s.height },
      ...s.source !== void 0 && { source: s.source },
      ...s.options !== void 0 && { options: s.options }
    } : r.push({
      id: s.targetId,
      component: s.component || "placeholder",
      title: s.title,
      span: s.span,
      height: s.height,
      source: s.source,
      options: s.options
    });
  }
  return r;
}
const pt = "ctx.";
function eo(e) {
  const t = {}, n = new URLSearchParams(e);
  for (const [r, s] of n)
    r.startsWith(pt) && (t[r.slice(pt.length)] = s);
  return t;
}
function to(e, t) {
  const n = new URLSearchParams(e);
  for (const r of [...n.keys()])
    r.startsWith(pt) && n.delete(r);
  for (const [r, s] of Object.entries(t))
    n.set(`${pt}${r}`, s);
  return n.toString();
}
const Ye = "medallion-terminal:view:";
function no(e, t) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(Ye + e, JSON.stringify(t));
    } catch {
    }
}
function ro(e) {
  if (!e || typeof window > "u" || !window.localStorage) return null;
  try {
    const t = window.localStorage.getItem(Ye + e);
    if (t == null) return null;
    const n = JSON.parse(t);
    if (!n || typeof n != "object") return null;
    const r = {};
    for (const [s, i] of Object.entries(n))
      typeof i == "string" && (r[s] = i);
    return r;
  } catch {
    return null;
  }
}
function so() {
  if (typeof window > "u" || !window.localStorage) return [];
  const e = [];
  for (let t = 0; t < window.localStorage.length; t++) {
    const n = window.localStorage.key(t);
    n && n.startsWith(Ye) && e.push(n.slice(Ye.length));
  }
  return e.sort();
}
function oo(e) {
  if (!(!e || typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.removeItem(Ye + e);
    } catch {
    }
}
const io = /* @__PURE__ */ new Set(["1d", "5d", "1m", "3m", "1y", "max"]), lo = 150, ao = 8;
function co(e, t) {
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
  const s = n.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/);
  if (s) return { kind: "set", key: s[1].toLowerCase(), value: s[2].trim() };
  const i = n.indexOf(" ");
  return i > 0 ? { kind: "set", key: n.slice(0, i).toLowerCase(), value: n.slice(i + 1).trim() } : io.has(n.toLowerCase()) ? { kind: "set", key: "range", value: n.toLowerCase() } : { kind: "set", key: t, value: n };
}
function uo({ suggest: e } = {}) {
  const { ctx: t, setCtx: n, toast: r } = ae(), [s, i] = v(!1), [l, a] = v(""), [u, c] = v([]), [d, f] = v(-1), h = U(null), [p, g] = v([]), b = U(0);
  R(() => {
    const x = (T) => {
      (T.metaKey || T.ctrlKey) && T.key.toLowerCase() === "k" ? (T.preventDefault(), i((O) => !O)) : T.key === "Escape" && i(!1);
    };
    return document.addEventListener("keydown", x), () => document.removeEventListener("keydown", x);
  }, []), R(() => {
    s ? h.current?.focus() : (a(""), f(-1), g([]));
  }, [s]), R(() => {
    if (!e || !s) return;
    const x = l.trim();
    if (!x) {
      g([]);
      return;
    }
    const T = ++b.current, O = setTimeout(async () => {
      try {
        const I = await e(x);
        if (T !== b.current) return;
        g(I.slice(0, ao));
      } catch {
        T === b.current && g([]);
      }
    }, lo);
    return () => clearTimeout(O);
  }, [l, s, e]);
  const w = L(() => Object.keys(t)[0] ?? "symbol", [t]), A = L(() => s ? so() : [], [s, u]);
  if (!s) return null;
  const $ = () => {
    const x = co(l, w);
    if (!x || x.kind === "noop") {
      i(!1);
      return;
    }
    if (x.kind === "save")
      no(x.name, t), r(`Saved "${x.name}"`, "ok");
    else if (x.kind === "load") {
      const T = ro(x.name);
      if (!T)
        r(`No view named "${x.name}"`, "warn");
      else {
        for (const [O, I] of Object.entries(T)) n(O, I);
        r(`Loaded "${x.name}"`, "ok");
      }
    } else if (x.kind === "delete")
      oo(x.name), r(`Deleted "${x.name}"`, "ok");
    else if (x.kind === "set")
      n(x.key, x.value);
    else if (x.kind === "set_many")
      for (const [T, O] of x.pairs) n(T, O);
    c((T) => [l, ...T.filter((O) => O !== l)].slice(0, 5)), i(!1);
  }, j = (x) => {
    if (u.length === 0) return;
    const T = Math.max(-1, Math.min(u.length - 1, d + x));
    f(T), a(T === -1 ? "" : u[T]);
  }, E = (x) => {
    for (const [T, O] of Object.entries(x.ctx)) n(T, O);
    i(!1);
  };
  return /* @__PURE__ */ o(
    "div",
    {
      className: "fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[20vh] px-4",
      onClick: () => i(!1),
      children: /* @__PURE__ */ m(
        "div",
        {
          className: "w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden",
          onClick: (x) => x.stopPropagation(),
          children: [
            /* @__PURE__ */ o(
              "input",
              {
                ref: h,
                type: "text",
                value: l,
                onChange: (x) => a(x.target.value),
                onKeyDown: (x) => {
                  x.key === "Enter" ? (x.preventDefault(), $()) : x.key === "ArrowUp" ? (x.preventDefault(), j(1)) : x.key === "ArrowDown" && (x.preventDefault(), j(-1));
                },
                placeholder: "symbol:BTC range:1d  ·  /save view  ·  /load view",
                className: "w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
              }
            ),
            p.length > 0 && /* @__PURE__ */ o("div", { className: "border-b border-zinc-800 max-h-72 overflow-auto", children: p.map((x, T) => /* @__PURE__ */ m(
              "button",
              {
                onClick: () => E(x),
                className: "block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group",
                children: [
                  /* @__PURE__ */ o("span", { className: "text-zinc-100", children: x.label }),
                  x.hint && /* @__PURE__ */ o("span", { className: "ml-2 text-[10px] text-zinc-500 font-mono", children: x.hint }),
                  /* @__PURE__ */ o("span", { className: "ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100", children: Object.entries(x.ctx).map(([O, I]) => `${O}=${I}`).join(" · ") })
                ]
              },
              `${x.label}-${T}`
            )) }),
            Object.entries(t).length > 0 && /* @__PURE__ */ m("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "current" }),
              Object.entries(t).map(([x, T]) => /* @__PURE__ */ m("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono", children: [
                x,
                "=",
                T
              ] }, x))
            ] }),
            A.length > 0 && /* @__PURE__ */ m("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "views" }),
              A.map((x) => /* @__PURE__ */ o(
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
            u.length > 0 && /* @__PURE__ */ m("div", { className: "px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-600 self-center", children: "recent" }),
              u.map((x, T) => /* @__PURE__ */ o(
                "button",
                {
                  onClick: () => a(x),
                  className: "text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono",
                  children: x
                },
                T
              ))
            ] }),
            /* @__PURE__ */ m("div", { className: "px-4 py-2 text-[10px] text-zinc-600 flex justify-between", children: [
              /* @__PURE__ */ o("span", { children: "↵ apply  ·  ↑↓ recall" }),
              /* @__PURE__ */ o("span", { children: "esc close" })
            ] })
          ]
        }
      )
    }
  );
}
const fo = [
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
function mo(e) {
  return e.label ? e.label : `Set ${Object.entries(e.ctx).map(([n, r]) => `${n}=${r}`).join(" · ")}`;
}
function po({ templateShortcuts: e }) {
  const [t, n] = v(!1);
  return R(() => {
    const r = (s) => {
      const i = s.target?.tagName, l = i === "INPUT" || i === "TEXTAREA" || s.target?.isContentEditable;
      s.key === "?" && !l ? (s.preventDefault(), n((a) => !a)) : s.key === "Escape" && n(!1);
    };
    return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
  }, []), t ? /* @__PURE__ */ o(
    "div",
    {
      className: "fixed inset-0 z-40 bg-black/60 flex items-center justify-center px-4",
      onClick: () => n(!1),
      children: /* @__PURE__ */ m(
        "div",
        {
          className: "w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]",
          onClick: (r) => r.stopPropagation(),
          children: [
            /* @__PURE__ */ m("div", { className: "px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between", children: [
              /* @__PURE__ */ o("h3", { className: "text-sm font-medium text-zinc-100", children: "Keyboard shortcuts" }),
              /* @__PURE__ */ o("span", { className: "text-[10px] text-zinc-500", children: "esc to close" })
            ] }),
            /* @__PURE__ */ m("div", { className: "px-4 py-3 flex flex-col gap-1.5", children: [
              fo.map((r, s) => /* @__PURE__ */ m("div", { className: "flex items-baseline gap-3", children: [
                /* @__PURE__ */ o("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.keys }),
                /* @__PURE__ */ o("span", { className: "text-xs text-zinc-400", children: r.description })
              ] }, s)),
              e && e.length > 0 && /* @__PURE__ */ m(ft, { children: [
                /* @__PURE__ */ o("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mt-3 mb-1", children: "Dashboard shortcuts" }),
                e.map((r, s) => /* @__PURE__ */ m("div", { className: "flex items-baseline gap-3", children: [
                  /* @__PURE__ */ o("kbd", { className: "text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0", children: r.key }),
                  /* @__PURE__ */ o("span", { className: "text-xs text-zinc-400", children: mo(r) })
                ] }, `tpl-${s}`))
              ] })
            ] })
          ]
        }
      )
    }
  ) : null;
}
const ho = {
  ok: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  warn: "border-amber-500/40   bg-amber-500/10   text-amber-200",
  error: "border-red-500/40     bg-red-500/10     text-red-200",
  info: "border-sky-500/40     bg-sky-500/10     text-sky-200"
}, bo = 3500;
function go({ toasts: e, dismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ o("div", { className: "fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none", children: e.map((n) => /* @__PURE__ */ o(xo, { toast: n, dismiss: t }, n.id)) });
}
function xo({ toast: e, dismiss: t }) {
  return R(() => {
    const n = setTimeout(() => t(e.id), bo);
    return () => clearTimeout(n);
  }, [e.id, t]), /* @__PURE__ */ o(
    "div",
    {
      onClick: () => t(e.id),
      className: `pointer-events-auto cursor-pointer text-xs px-3 py-2 rounded border shadow-lg backdrop-blur-sm ${ho[e.severity]} motion-safe:animate-[fadeIn_180ms_ease-out]`,
      children: e.message
    }
  );
}
const sn = /* @__PURE__ */ new Set([
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
function yo(e, t) {
  const n = [];
  if (!e || typeof e != "object")
    return n.push({ path: "", severity: "error", message: "template is not an object" }), n;
  if (!Array.isArray(e.widgets))
    return n.push({ path: "widgets", severity: "error", message: "widgets must be an array" }), n;
  const r = t ? /* @__PURE__ */ new Set([...sn, ...t]) : sn;
  return e.widgets.forEach((s, i) => {
    const l = `widgets[${i}]`;
    if (!s || typeof s != "object") {
      n.push({ path: l, severity: "error", message: "widget is not an object" });
      return;
    }
    if (!s.component || typeof s.component != "string" ? n.push({ path: `${l}.component`, severity: "error", message: "missing component" }) : r.has(s.component) || n.push({
      path: `${l}.component`,
      severity: "warn",
      message: `unknown component "${s.component}" — register via registerWidget() or fix the spelling`
    }), s.span != null && (!Number.isInteger(s.span) || s.span < 1 || s.span > 12) && n.push({ path: `${l}.span`, severity: "warn", message: `span ${s.span} out of range 1..12` }), s.refresh_policy != null && s.refresh_policy !== "global" && s.refresh_policy !== "self" && s.refresh_policy !== "manual" && n.push({
      path: `${l}.refresh_policy`,
      severity: "error",
      message: `refresh_policy ${JSON.stringify(s.refresh_policy)} must be "global" | "self" | "manual"`
    }), s.source) {
      const a = s.source, u = [];
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
    s.alert && ((typeof s.alert.when != "string" || !Ts(s.alert.when)) && n.push({
      path: `${l}.alert.when`,
      severity: "error",
      message: `alert predicate ${JSON.stringify(s.alert.when)} does not parse`
    }), (typeof s.alert.message != "string" || !s.alert.message) && n.push({ path: `${l}.alert.message`, severity: "warn", message: "alert has no message" }));
  }), n;
}
const fr = "", vo = [
  "authorization",
  "cookie",
  "proxy-authorization",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
  "x-csrf-token",
  "x-xsrf-token"
], wo = [
  "allow-downloads",
  "allow-popups-to-escape-sandbox",
  "allow-top-navigation",
  "allow-top-navigation-by-user-activation"
], Me = {
  allowRelativeUrls: !0,
  allowedUrlOrigins: [],
  disallowedHeaders: vo,
  minRefreshIntervalMs: 1e3,
  iframeSandbox: {
    disallowedTokens: wo,
    allowScriptsWithSameOrigin: !1
  }
}, ko = [
  "url",
  "upload_url",
  "search_url",
  "ingest_url",
  "download_url",
  "media_url_template"
];
function No(e, t = Me) {
  const n = [], r = So(t);
  return !e || typeof e != "object" || !Array.isArray(e.widgets) ? [{ path: "widgets", severity: "error", message: "template.widgets must be an array" }] : (e.widgets.forEach((s, i) => {
    if (!s || typeof s != "object") return;
    const l = `widgets[${i}]`;
    s.source && zo(s.source, `${l}.source`, r, n), Ao(s, l, r, n), s.component === "iframe" && _o(s, l, r, n), s.component === "image" && To(s, l, r, n);
  }), n);
}
function So(e) {
  const t = Me.iframeSandbox;
  return {
    allowedUrlOrigins: on(
      e.allowedUrlOrigins ?? Me.allowedUrlOrigins
    ),
    allowedIframeOrigins: on(e.allowedIframeOrigins ?? e.allowedUrlOrigins ?? []),
    allowRelativeUrls: e.allowRelativeUrls ?? Me.allowRelativeUrls,
    allowedHeaders: e.allowedHeaders ? ln(e.allowedHeaders) : void 0,
    disallowedHeaders: ln(e.disallowedHeaders ?? Me.disallowedHeaders),
    minRefreshIntervalMs: e.minRefreshIntervalMs ?? Me.minRefreshIntervalMs,
    maxRefreshIntervalMs: e.maxRefreshIntervalMs,
    iframeSandbox: {
      requiredTokens: [...t.requiredTokens ?? [], ...e.iframeSandbox?.requiredTokens ?? []],
      disallowedTokens: [
        ...t.disallowedTokens ?? [],
        ...e.iframeSandbox?.disallowedTokens ?? []
      ],
      allowScriptsWithSameOrigin: e.iframeSandbox?.allowScriptsWithSameOrigin ?? t.allowScriptsWithSameOrigin ?? !1
    }
  };
}
function on(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    try {
      t.add(new URL(n).origin);
    } catch {
    }
  return t;
}
function ln(e) {
  return new Set(e.map((t) => t.trim().toLowerCase()).filter(Boolean));
}
function zo(e, t, n, r) {
  typeof e.url == "string" && xt(e.url, `${t}.url`, n.allowedUrlOrigins, n.allowRelativeUrls, r), e.headers && typeof e.headers == "object" && Co(e.headers, `${t}.headers`, n, r), Eo(e.refreshIntervalMs ?? e.refreshInterval, t, n, r);
}
function Ao(e, t, n, r) {
  const s = e.options;
  if (!(!s || typeof s != "object"))
    for (const i of ko) {
      if (e.component === "iframe" && i === "url") continue;
      const l = s[i];
      typeof l != "string" || l === "" || xt(l, `${t}.options.${i}`, n.allowedUrlOrigins, n.allowRelativeUrls, r);
    }
}
function _o(e, t, n, r) {
  const { url: s, sandbox: i } = $o(e);
  s && xt(s, `${t}.iframe.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r), Oo(i, `${t}.iframe.sandbox`, n, r);
}
function To(e, t, n, r) {
  const s = mr(e.source), i = typeof s == "string" ? s : s && typeof s == "object" && typeof s.url == "string" ? s.url : void 0;
  i && xt(i, `${t}.image.url`, n.allowedIframeOrigins, n.allowRelativeUrls, r);
}
function $o(e) {
  const t = e.options, n = mr(e.source);
  let r, s = fr;
  if (typeof n == "string")
    r = n;
  else if (n && typeof n == "object") {
    const i = n;
    typeof i.url == "string" && (r = i.url), typeof i.sandbox == "string" && (s = i.sandbox);
  }
  return t && typeof t == "object" && (!r && typeof t.url == "string" && (r = t.url), typeof t.sandbox == "string" && (s = t.sandbox)), { url: r, sandbox: s };
}
function mr(e) {
  return e?.inline ?? e?.data;
}
function Co(e, t, n, r) {
  for (const s of Object.keys(e)) {
    const i = s.trim().toLowerCase();
    if (!i) {
      r.push({ path: t, severity: "error", message: "header names must be non-empty" });
      continue;
    }
    n.disallowedHeaders.has(i) && r.push({ path: `${t}.${s}`, severity: "error", message: `header "${s}" is not allowed` }), n.allowedHeaders && !n.allowedHeaders.has(i) && r.push({ path: `${t}.${s}`, severity: "error", message: `header "${s}" is not in the allow-list` });
  }
}
function Eo(e, t, n, r) {
  if (!(e == null || e === 0)) {
    if (!Number.isFinite(e) || e < 0) {
      r.push({ path: `${t}.refreshIntervalMs`, severity: "error", message: "refreshIntervalMs must be >= 0" });
      return;
    }
    n.minRefreshIntervalMs != null && e < n.minRefreshIntervalMs && r.push({
      path: `${t}.refreshIntervalMs`,
      severity: "error",
      message: `refreshIntervalMs ${e} is below host minimum ${n.minRefreshIntervalMs}`
    }), n.maxRefreshIntervalMs != null && e > n.maxRefreshIntervalMs && r.push({
      path: `${t}.refreshIntervalMs`,
      severity: "error",
      message: `refreshIntervalMs ${e} is above host maximum ${n.maxRefreshIntervalMs}`
    });
  }
}
function xt(e, t, n, r, s) {
  const i = e.trim();
  if (!i) {
    s.push({ path: t, severity: "error", message: "URL must be non-empty" });
    return;
  }
  if (Mo(i)) {
    if (Ro(i)) {
      s.push({
        path: t,
        severity: "error",
        message: "relative URL template substitution must appear after a path, query, or hash delimiter"
      });
      return;
    }
    r || s.push({ path: t, severity: "error", message: "relative URLs are not allowed by host policy" });
    return;
  }
  if (jo(i).includes("${")) {
    s.push({ path: t, severity: "error", message: "URL origin may not contain template substitution" });
    return;
  }
  let l;
  try {
    l = new URL(i.replace(/\{[A-Za-z0-9_]+\}/g, "value"));
  } catch {
    s.push({ path: t, severity: "error", message: `URL ${JSON.stringify(e)} does not parse` });
    return;
  }
  if (l.protocol !== "http:" && l.protocol !== "https:") {
    s.push({ path: t, severity: "error", message: `URL protocol ${l.protocol} is not allowed` });
    return;
  }
  n.has(l.origin) || s.push({ path: t, severity: "error", message: `URL origin ${l.origin} is not allowed` });
}
function Oo(e, t, n, r) {
  const s = new Set(e.split(/\s+/).map((i) => i.trim()).filter(Boolean));
  for (const i of n.iframeSandbox.requiredTokens)
    s.has(i) || r.push({ path: t, severity: "error", message: `iframe sandbox must include ${i}` });
  for (const i of n.iframeSandbox.disallowedTokens)
    s.has(i) && r.push({ path: t, severity: "error", message: `iframe sandbox token ${i} is not allowed` });
  !n.iframeSandbox.allowScriptsWithSameOrigin && s.has("allow-scripts") && s.has("allow-same-origin") && r.push({
    path: t,
    severity: "error",
    message: "iframe sandbox may not combine allow-scripts and allow-same-origin"
  });
}
function Mo(e) {
  return !e.startsWith("//") && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
}
function Ro(e) {
  const t = e.indexOf("${");
  if (t === -1) return !1;
  const n = e.slice(0, t);
  return /[/?#]/.test(n) ? /^\/+$/.test(n) : !0;
}
function jo(e) {
  if (e.startsWith("//")) {
    const n = e.slice(2).search(/[/?#]/);
    return n === -1 ? e : e.slice(0, n + 2);
  }
  const t = e.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/);
  return t ? t[0] : "";
}
function an(e, t) {
  return e.id || `__mt_idx_${t}`;
}
function Io(e) {
  const t = e?.widgets;
  return !Array.isArray(t) || t.length === 0 ? !1 : t.every((n) => {
    const r = n.source;
    if (!r) return !0;
    const s = r.inline !== void 0 || r.data !== void 0, i = !!(r.source_id || r.url);
    return s || !i;
  });
}
function Lo(e, t, n, r, s) {
  const i = t.map((a, u) => {
    const c = r(a, u);
    if (c === void 0) {
      const d = a.source;
      return d && (d.source_id || d.url || d.stream) ? { ...a, source: { inline: null } } : a;
    }
    return { ...a, source: { inline: c } };
  }), l = {
    ...e,
    context: { values: { ...n } },
    widgets: i
  };
  return s && (l.frozenAt = s), l;
}
const Po = {
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
}, Do = ["1d", "5d", "1m", "3m", "1y", "max"], Fo = 200, Uo = 200;
function Bo({ value: e, onChange: t }) {
  return /* @__PURE__ */ o("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: Do.map((n) => {
    const r = e.toLowerCase() === n;
    return /* @__PURE__ */ o(
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
const Ko = [
  { label: "Off", ms: null },
  { label: "5s", ms: 5e3 },
  { label: "30s", ms: 3e4 },
  { label: "1m", ms: 6e4 },
  { label: "5m", ms: 3e5 }
];
function Ho({ value: e, onChange: t }) {
  return /* @__PURE__ */ o("div", { className: "flex bg-zinc-900 border border-zinc-800 rounded p-0.5 gap-0.5", children: Ko.map((n) => {
    const r = e === n.ms;
    return /* @__PURE__ */ o(
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
function Wo() {
  const e = typeof navigator < "u" && /mac/i.test(navigator.platform);
  return /* @__PURE__ */ m(
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
function qo(e) {
  const t = new Date(e), n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), s = String(t.getSeconds()).padStart(2, "0");
  return `${n}:${r}:${s}`;
}
function Go(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Vo() {
  const { recentActions: e, widgetHealth: t } = ae(), n = gt(!0), r = e[0], s = Object.values(t), i = s.filter((d) => d.streaming), l = i.filter((d) => d.connected && !d.error).length, a = s.filter((d) => d.error).length, u = s.filter((d) => d.stale).length, c = r?.status?.endsWith("_OK") ? "text-emerald-400/80" : r?.status?.endsWith("_PENDING") || r?.status?.endsWith("_ACCEPTED") ? "text-amber-400/80" : r && (r.status?.endsWith("_REJECTED") || r.status?.endsWith("_FAILED") || r.status?.endsWith("_CANCELLED")) ? "text-red-400/80" : "text-zinc-400";
  return /* @__PURE__ */ m("div", { className: "border-t border-zinc-800 bg-zinc-900/70 px-3 md:px-5 py-1 flex items-center gap-4 text-[10px] font-mono text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ o("div", { className: "flex-1 min-w-0 truncate", children: r ? /* @__PURE__ */ m("span", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ o("span", { className: "tabular-nums w-7 shrink-0", children: Go(n, r.receivedAt) }),
      /* @__PURE__ */ o("span", { className: "text-zinc-300 shrink-0", children: r.actionId }),
      /* @__PURE__ */ o("span", { className: `uppercase tracking-wider shrink-0 ${c}`, children: r.status.replace(/^ACTION_STATUS_/, "").toLowerCase() }),
      r.message && /* @__PURE__ */ o("span", { className: "truncate text-zinc-400", children: r.message })
    ] }) : /* @__PURE__ */ o("span", { className: "text-zinc-600", children: "idle" }) }),
    i.length > 0 && /* @__PURE__ */ m(
      "span",
      {
        className: l === i.length ? "text-emerald-400/80" : "text-amber-400/80",
        title: `${l} of ${i.length} streams connected`,
        children: [
          /* @__PURE__ */ m("span", { className: "tabular-nums", children: [
            l,
            "/",
            i.length
          ] }),
          " ",
          /* @__PURE__ */ o("span", { className: "opacity-60", children: "↑" })
        ]
      }
    ),
    u > 0 && /* @__PURE__ */ m("span", { className: "text-amber-400/80 tabular-nums", title: `${u} widget(s) without recent updates`, children: [
      u,
      " stale"
    ] }),
    a > 0 && /* @__PURE__ */ m("span", { className: "text-red-400 tabular-nums", children: [
      a,
      " err"
    ] }),
    /* @__PURE__ */ o("span", { className: "tabular-nums text-zinc-300", children: qo(n) })
  ] });
}
function Jo({ health: e }) {
  const t = Object.values(e);
  if (t.length === 0) return null;
  const n = t.filter((l) => l.streaming), r = n.filter((l) => l.connected && !l.error).length, s = t.filter((l) => l.error);
  if (n.length === 0 && s.length === 0) return null;
  const i = s.map((l) => l.title).join(`
`);
  return /* @__PURE__ */ m("div", { className: "flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider bg-zinc-900 border border-zinc-800 rounded", children: [
    n.length > 0 && /* @__PURE__ */ m(
      "span",
      {
        className: r === n.length ? "text-emerald-400" : "text-amber-400",
        title: `${r} of ${n.length} streams connected`,
        children: [
          /* @__PURE__ */ m("span", { className: "tabular-nums", children: [
            r,
            "/",
            n.length
          ] }),
          /* @__PURE__ */ o("span", { className: "ml-0.5", children: "↑" })
        ]
      }
    ),
    s.length > 0 && /* @__PURE__ */ m("span", { className: "text-red-400 tabular-nums", title: i, children: [
      s.length,
      " err",
      s.length === 1 ? "" : "s"
    ] })
  ] });
}
function Xo({ onClick: e }) {
  return /* @__PURE__ */ o(
    "button",
    {
      onClick: e,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: "Refresh every widget",
      children: "Reload"
    }
  );
}
function Yo({ enabled: e, onToggle: t }) {
  return /* @__PURE__ */ o(
    "button",
    {
      onClick: t,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: e ? "Mute alert sounds" : "Enable alert sounds (warn/error)",
      children: e ? "🔊 On" : "🔇 Off"
    }
  );
}
function Zo({ compact: e, onToggle: t }) {
  return /* @__PURE__ */ o(
    "button",
    {
      onClick: t,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded",
      title: e ? "Switch to comfortable density" : "Switch to compact density",
      children: e ? "Cozy" : "Compact"
    }
  );
}
function Qo({ onCopied: e }) {
  return /* @__PURE__ */ o(
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
function ei({ onClick: e }) {
  return /* @__PURE__ */ o(
    "button",
    {
      onClick: e,
      className: "px-2 py-1 text-[10px] uppercase tracking-wider text-emerald-400/80 hover:text-emerald-300 bg-zinc-900 border border-emerald-500/30 rounded",
      title: "Freeze data into a static, self-contained dashboard to share — nothing re-fetches or regenerates",
      children: "Share"
    }
  );
}
function ti({ frozenAt: e }) {
  const t = e ? new Date(e) : null, n = t && !Number.isNaN(t.getTime()) ? t.toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" }) : null;
  return /* @__PURE__ */ m(
    "span",
    {
      className: "flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800 rounded",
      title: n ? `Static snapshot frozen ${n} — data does not refresh` : "Static snapshot — data does not refresh",
      children: [
        /* @__PURE__ */ o("span", { className: "w-1.5 h-1.5 rounded-full bg-zinc-500" }),
        "Snapshot",
        n ? /* @__PURE__ */ m("span", { className: "text-zinc-600 normal-case tracking-normal", children: [
          "· ",
          n
        ] }) : null
      ]
    }
  );
}
function ni(e) {
  if (typeof document > "u" || typeof URL?.createObjectURL != "function") return;
  const t = (e.title || "dashboard").trim().replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "dashboard", n = new Blob([JSON.stringify(e, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), s = document.createElement("a");
  s.href = r, s.download = `${t}.snapshot.json`, document.body.appendChild(s), s.click(), s.remove(), setTimeout(() => URL.revokeObjectURL(r), 0);
}
function pr({
  template: e,
  backendUrl: t,
  onEvent: n,
  onCtxChange: r,
  paletteSuggest: s,
  chrome: i = "full",
  onShare: l,
  theme: a = "dark",
  templateTrust: u = "untrusted",
  templateTrustPolicy: c = Me
}) {
  const d = Qr(), f = e.columns || 12, [h, p] = v(e.widgets), g = L(() => yo(e), [e]), b = L(
    () => u === "trusted" ? [] : No(e, c),
    [e, u, c]
  ), w = L(
    () => [...g, ...b],
    [g, b]
  ), A = L(() => w.some((S) => S.severity === "error"), [w]), $ = L(() => b.some((S) => S.severity === "error"), [b]), j = L(() => !!e.frozenAt || Io(e), [e]), [E, x] = v(!1), [T, O] = v(() => {
    const S = e.context?.values ?? {};
    return typeof window > "u" ? S : { ...S, ...eo(window.location.search) };
  }), [I, G] = v(() => St("refreshIntervalMs", null)), [Z, X] = v(() => St("compact", !1)), [Y, P] = v(() => St("soundEnabled", !1));
  R(() => {
    zt("refreshIntervalMs", I);
  }, [I]), R(() => {
    zt("compact", Z);
  }, [Z]), R(() => {
    zt("soundEnabled", Y);
  }, [Y]);
  const [K, q] = v(null), [z, H] = v(null), [ee, Q] = v(null), [oe, y] = v([]), k = U(0), _ = ce((S) => {
    Q((C) => ({ id: S, n: (C?.n ?? 0) + 1 }));
  }, []), M = U(n);
  R(() => {
    M.current = n;
  }, [n]);
  const [W, V] = v([]), ne = ce(() => V([]), []), [te, se] = v([]), me = ce(() => se([]), []), [$e, Ee] = v({}), Le = ce((S, C) => {
    Ee((J) => {
      const ue = J[S];
      if (C === null) {
        if (!ue) return J;
        const ge = { ...J };
        return delete ge[S], ge;
      }
      return ue && ue.streaming === C.streaming && ue.connected === C.connected && ue.error === C.error && ue.title === C.title && ue.stale === C.stale ? J : { ...J, [S]: C };
    });
  }, []), pe = U(/* @__PURE__ */ new Map()), be = ce((S, C) => (pe.current.set(S, C), () => {
    pe.current.get(S) === C && pe.current.delete(S);
  }), []), he = U({ widgets: h, ctx: T, template: e });
  he.current = { widgets: h, ctx: T, template: e };
  const ye = ce(() => {
    const { widgets: S, ctx: C, template: J } = he.current;
    return Lo(J, S, C, (ue, ge) => {
      const xe = pe.current.get(an(ue, ge));
      return xe ? xe() : void 0;
    }, (/* @__PURE__ */ new Date()).toISOString());
  }, []), Pe = ce((S) => {
    M.current?.(S), S.type === "action" ? V((C) => [{
      receivedAt: Date.now(),
      actionId: S.actionId,
      clientRequestId: S.clientRequestId,
      status: S.status,
      message: S.message,
      terminal: S.terminal
    }, ...C].slice(0, Fo)) : S.type === "alert" && se((C) => [{
      receivedAt: Date.now(),
      widgetId: S.widgetId,
      severity: S.severity,
      message: S.message,
      predicate: S.predicate
    }, ...C].slice(0, Uo));
  }, []), ve = ce((S, C = "info") => {
    k.current += 1;
    const J = k.current;
    y((ue) => [...ue, { id: J, message: S, severity: C }]);
  }, []), Qe = ce((S) => {
    y((C) => C.filter((J) => J.id !== S));
  }, []), Oe = ce((S, C) => {
    O((J) => J[S] === C ? J : { ...J, [S]: C });
  }, []);
  R(() => {
    if (typeof window > "u") return;
    const S = to(window.location.search, T), C = `${window.location.pathname}${S ? `?${S}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", C);
  }, [T]);
  const Ve = U(r);
  R(() => {
    Ve.current = r;
  }, [r]), R(() => {
    Ve.current?.(T);
  }, [T]);
  const De = ce((S, C) => {
    p((J) => Qs(J, S, C));
  }, []), yt = (S) => d === "mobile" ? f : d === "tablet" ? Math.min(S, Math.floor(f / 2)) : Math.min(S, f), vt = L(
    () => ({
      dispatch: De,
      ctx: T,
      setCtx: Oe,
      backendUrl: t,
      widgets: h,
      refreshIntervalMs: I ?? void 0,
      toast: ve,
      compact: Z,
      fullscreenId: K,
      setFullscreenId: q,
      focusedId: z,
      setFocusedId: H,
      refreshPulse: ee,
      requestRefresh: _,
      emit: Pe,
      recentActions: W,
      clearRecentActions: ne,
      recentAlerts: te,
      clearRecentAlerts: me,
      soundEnabled: Y,
      widgetHealth: $e,
      reportWidgetHealth: Le,
      registerWidgetData: be,
      snapshot: ye
    }),
    [
      De,
      T,
      Oe,
      t,
      h,
      I,
      ve,
      Z,
      K,
      z,
      ee,
      _,
      Pe,
      W,
      ne,
      te,
      me,
      Y,
      $e,
      Le,
      be,
      ye
    ]
  );
  R(() => {
    if (!K) return;
    const S = (C) => {
      C.key === "Escape" && q(null);
    };
    return document.addEventListener("keydown", S), () => document.removeEventListener("keydown", S);
  }, [K]), R(() => {
    if (!z || typeof document > "u") return;
    document.getElementById(`mt-widget-${z}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [z]), R(() => {
    const S = (C) => {
      if (C.metaKey || C.ctrlKey || C.altKey) return;
      const J = C.target?.tagName;
      if (J === "INPUT" || J === "TEXTAREA" || C.target?.isContentEditable) return;
      const ge = e.shortcuts?.find((F) => F.key === C.key);
      if (ge) {
        C.preventDefault();
        for (const [F, re] of Object.entries(ge.ctx)) Oe(F, re);
        return;
      }
      const xe = h.map((F) => F.id).filter((F) => !!F);
      if (xe.length === 0) return;
      const N = (F) => {
        const re = z ? xe.indexOf(z) : -1, ie = xe[(re + F + xe.length) % xe.length];
        H(ie);
      };
      switch (C.key) {
        case "j":
        case "ArrowDown":
          C.preventDefault(), N(1);
          break;
        case "k":
        case "ArrowUp":
          C.preventDefault(), N(-1);
          break;
        case "f":
          z && (C.preventDefault(), q(z));
          break;
        case "r":
          z && (C.preventDefault(), _(z));
          break;
        case "Escape":
          z && H(null);
          break;
      }
    };
    return document.addEventListener("keydown", S), () => document.removeEventListener("keydown", S);
  }, [h, z, _, e.shortcuts, Oe]);
  const et = !$ && K ? h.find((S) => S.id === K) : null;
  return /* @__PURE__ */ o(qn.Provider, { value: vt, children: /* @__PURE__ */ o("div", { className: `mtc-root mtc-theme-${a}`, "data-theme": a, children: /* @__PURE__ */ o(zs, { children: /* @__PURE__ */ m(Zs, { children: [
    /* @__PURE__ */ o(uo, { suggest: s }),
    /* @__PURE__ */ o(po, { templateShortcuts: e.shortcuts }),
    /* @__PURE__ */ o(go, { toasts: oe, dismiss: Qe }),
    w.length > 0 && (!E || A) && /* @__PURE__ */ o(
      ri,
      {
        issues: w,
        dismissible: !A,
        onDismiss: () => x(!0)
      }
    ),
    /* @__PURE__ */ m("div", { className: "min-h-full bg-zinc-950 flex flex-col", children: [
      /* @__PURE__ */ m("div", { className: "flex-1 p-3 md:p-5", children: [
        (e.title || i === "full") && /* @__PURE__ */ m("div", { className: "mb-4 flex items-center gap-3 flex-wrap", children: [
          e.title && /* @__PURE__ */ o("h1", { className: "text-lg font-semibold text-zinc-100 tracking-tight mr-1", children: Be(e.title, T) }),
          i === "full" && Object.entries(T).map(([S, C]) => S === "range" ? /* @__PURE__ */ o(Bo, { value: C, onChange: (J) => Oe(S, J) }, S) : /* @__PURE__ */ m(
            "div",
            {
              className: "px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs",
              children: [
                /* @__PURE__ */ o("span", { className: "text-zinc-500 uppercase tracking-wider mr-1", children: S }),
                /* @__PURE__ */ o("span", { className: "text-zinc-100 font-mono", children: C })
              ]
            },
            S
          )),
          i === "full" && /* @__PURE__ */ m("div", { className: "ml-auto flex items-center gap-2", children: [
            j ? /* @__PURE__ */ o(ti, { frozenAt: e.frozenAt }) : /* @__PURE__ */ m(ft, { children: [
              /* @__PURE__ */ o(Jo, { health: $e }),
              /* @__PURE__ */ o(Ho, { value: I, onChange: G }),
              /* @__PURE__ */ o(Xo, { onClick: () => _("*") })
            ] }),
            /* @__PURE__ */ o(Yo, { enabled: Y, onToggle: () => P((S) => !S) }),
            /* @__PURE__ */ o(Zo, { compact: Z, onToggle: () => X((S) => !S) }),
            !j && /* @__PURE__ */ o(
              ei,
              {
                onClick: () => {
                  const S = ye();
                  l ? l(S) : ni(S), ve(l ? "Snapshot shared" : "Snapshot downloaded", "ok");
                }
              }
            ),
            /* @__PURE__ */ o(Qo, { onCopied: () => ve("URL copied", "ok") }),
            /* @__PURE__ */ o(Wo, {})
          ] })
        ] }),
        /* @__PURE__ */ o(
          "div",
          {
            className: "grid gap-3 md:gap-4 items-start",
            style: { gridTemplateColumns: `repeat(${f}, 1fr)` },
            children: $ ? /* @__PURE__ */ o(si, { issues: b }) : h.map((S, C) => /* @__PURE__ */ o(
              "div",
              {
                id: S.id ? `mt-widget-${S.id}` : void 0,
                style: {
                  gridColumn: `span ${yt(S.span || 6)}`
                },
                children: /* @__PURE__ */ o(
                  cr,
                  {
                    config: S,
                    contentHeight: S.height || Po[S.component] || 280,
                    snapshotKey: an(S, C)
                  }
                )
              },
              S.id || C
            ))
          }
        )
      ] }),
      i === "full" && /* @__PURE__ */ o(Vo, {})
    ] }),
    et && /* @__PURE__ */ o(oi, { widget: et, onClose: () => q(null) })
  ] }) }) }) });
}
function ri({
  issues: e,
  dismissible: t,
  onDismiss: n
}) {
  const r = e.filter((a) => a.severity === "error"), s = e.filter((a) => a.severity === "warn"), i = r.length > 0 ? "bg-red-500/10 border-red-500/40 text-red-200" : "bg-amber-500/10 border-amber-500/40 text-amber-200", l = r.length > 0 ? "Template errors" : "Template warnings";
  return /* @__PURE__ */ m("div", { className: `border-b ${i} px-3 md:px-5 py-2 text-xs flex items-start gap-3`, children: [
    /* @__PURE__ */ m("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ m("div", { className: "font-medium uppercase tracking-wider text-[10px] mb-1", children: [
        l,
        " (",
        r.length + s.length,
        ")"
      ] }),
      /* @__PURE__ */ m("ul", { className: "space-y-0.5", children: [
        [...r, ...s].slice(0, 8).map((a, u) => /* @__PURE__ */ m("li", { className: "font-mono text-[11px] leading-tight", children: [
          /* @__PURE__ */ o("span", { className: "opacity-60", children: a.path || "<root>" }),
          /* @__PURE__ */ o("span", { className: "mx-1.5 opacity-40", children: "·" }),
          /* @__PURE__ */ o("span", { children: a.message })
        ] }, u)),
        e.length > 8 && /* @__PURE__ */ m("li", { className: "opacity-60 text-[10px]", children: [
          "… and ",
          e.length - 8,
          " more"
        ] })
      ] })
    ] }),
    t && /* @__PURE__ */ o(
      "button",
      {
        onClick: n,
        className: "text-[10px] uppercase tracking-wider opacity-70 hover:opacity-100 shrink-0",
        children: "Dismiss"
      }
    )
  ] });
}
function si({ issues: e }) {
  const t = e.filter((n) => n.severity === "error");
  return /* @__PURE__ */ m("div", { className: "col-span-full border border-red-500/40 bg-red-500/10 rounded p-4 text-sm text-red-100", children: [
    /* @__PURE__ */ o("div", { className: "font-medium text-xs uppercase tracking-wider mb-2", children: "Template blocked" }),
    /* @__PURE__ */ o("p", { className: "text-red-200/80 mb-3", children: "This dashboard includes URL, header, iframe, or polling behavior that the host trust policy rejected." }),
    /* @__PURE__ */ m("ul", { className: "space-y-1", children: [
      t.slice(0, 6).map((n, r) => /* @__PURE__ */ m("li", { className: "font-mono text-[11px] leading-tight", children: [
        /* @__PURE__ */ o("span", { className: "opacity-60", children: n.path || "<root>" }),
        /* @__PURE__ */ o("span", { className: "mx-1.5 opacity-40", children: "·" }),
        /* @__PURE__ */ o("span", { children: n.message })
      ] }, r)),
      t.length > 6 && /* @__PURE__ */ m("li", { className: "opacity-60 text-[10px]", children: [
        "… and ",
        t.length - 6,
        " more"
      ] })
    ] })
  ] });
}
function oi({ widget: e, onClose: t }) {
  const n = typeof window < "u" ? Math.floor(window.innerHeight * 0.82) : 600;
  return /* @__PURE__ */ m(
    "div",
    {
      className: "fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8 flex flex-col motion-safe:animate-[fadeIn_180ms_ease-out]",
      onClick: t,
      children: [
        /* @__PURE__ */ m("div", { className: "flex items-center justify-between mb-3 shrink-0", children: [
          /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: "Fullscreen — esc to close" }),
          /* @__PURE__ */ o(
            "button",
            {
              onClick: t,
              className: "text-zinc-500 hover:text-zinc-200 px-2 py-0.5 text-xs rounded border border-zinc-800",
              children: "Close"
            }
          )
        ] }),
        /* @__PURE__ */ o("div", { onClick: (r) => r.stopPropagation(), className: "flex-1 min-h-0", children: /* @__PURE__ */ o(cr, { config: e, contentHeight: n }) })
      ]
    }
  );
}
const hr = "medallion-terminal:";
function St(e, t) {
  if (typeof window > "u" || !window.localStorage) return t;
  try {
    const n = window.localStorage.getItem(hr + e);
    return n == null ? t : JSON.parse(n);
  } catch {
    return t;
  }
}
function zt(e, t) {
  if (!(typeof window > "u" || !window.localStorage))
    try {
      window.localStorage.setItem(hr + e, JSON.stringify(t));
    } catch {
    }
}
function ii(e, t) {
  R(() => {
    const n = (r) => {
      if (!(r.metaKey || r.ctrlKey)) return;
      const s = Number(r.key);
      Number.isFinite(s) && s >= 1 && s <= 9 && s <= e && (r.preventDefault(), t(s - 1));
    };
    return document.addEventListener("keydown", n), () => document.removeEventListener("keydown", n);
  }, [e, t]);
}
function zu({
  tabs: e,
  activeIndex: t,
  onSelect: n,
  backendUrl: r,
  theme: s = "dark",
  templateTrust: i,
  templateTrustPolicy: l
}) {
  const a = Math.max(0, Math.min(t, e.length - 1));
  ii(e.length, n);
  const [u, c] = v(() => /* @__PURE__ */ new Set([a]));
  return R(() => {
    c((d) => d.has(a) ? d : /* @__PURE__ */ new Set([...d, a]));
  }, [a]), e.length === 0 ? null : /* @__PURE__ */ o("div", { className: `mtc-root mtc-theme-${s}`, "data-theme": s, children: /* @__PURE__ */ m("div", { className: "min-h-full bg-zinc-950", children: [
    /* @__PURE__ */ o(li, { tabs: e, activeIndex: a, onSelect: n }),
    e.map((d, f) => /* @__PURE__ */ o("div", { style: { display: f === a ? "block" : "none" }, children: u.has(f) && /* @__PURE__ */ o(
      pr,
      {
        template: d.template,
        backendUrl: r,
        theme: s,
        templateTrust: i,
        templateTrustPolicy: l
      }
    ) }, f))
  ] }) });
}
function li({
  tabs: e,
  activeIndex: t,
  onSelect: n
}) {
  const r = typeof navigator < "u" && /mac/i.test(navigator.platform);
  return /* @__PURE__ */ o("div", { className: "flex gap-0.5 px-3 md:px-5 pt-3 border-b border-zinc-800 overflow-x-auto items-end", children: e.map((s, i) => {
    const l = i === t, a = i < 9 ? `${r ? "⌘" : "Ctrl"}${i + 1}` : null;
    return /* @__PURE__ */ m(
      "button",
      {
        onClick: () => n(i),
        className: `px-3 py-1.5 text-xs font-medium rounded-t whitespace-nowrap transition-colors flex items-center gap-2 ${l ? "bg-zinc-900 text-zinc-100 border-x border-t border-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`,
        title: a ? `Switch with ${a}` : void 0,
        children: [
          /* @__PURE__ */ o("span", { children: s.label || `Tab ${i + 1}` }),
          a && /* @__PURE__ */ o("span", { className: "text-[9px] text-zinc-600 font-mono uppercase tracking-wider", children: a })
        ]
      },
      i
    );
  }) });
}
function Au(e = 0) {
  const [t, n] = v(() => {
    if (typeof window > "u") return e;
    const s = Number(new URLSearchParams(window.location.search).get("tab"));
    return Number.isFinite(s) && s >= 0 ? s : e;
  });
  return [t, (s) => {
    if (n(s), typeof window < "u") {
      const i = new URLSearchParams(window.location.search);
      i.set("tab", String(s)), window.history.replaceState(null, "", `${window.location.pathname}?${i.toString()}${window.location.hash}`);
    }
  }];
}
function br(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 2);
}
function Ge(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : Math.abs(e) < 1 ? e.toFixed(2) : e.toFixed(1);
}
function gr(e) {
  return Math.abs(e) >= 1e12 ? (e / 1e12).toFixed(2) + "T" : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toLocaleString(void 0, { maximumFractionDigits: 4 });
}
function Ie(e) {
  if (e == null) return "";
  try {
    const t = new Date(e);
    return isNaN(t.getTime()) ? String(e) : t.toLocaleDateString(void 0, { month: "short", day: "numeric" });
  } catch {
    return String(e);
  }
}
const cn = 864e5;
function ai(e) {
  let t = !1, n = 1 / 0, r = -1 / 0;
  for (const s of e) {
    const i = String(s ?? "");
    !t && i.includes(":") && (t = !0);
    const l = new Date(i).getTime();
    isNaN(l) || (l < n && (n = l), l > r && (r = l));
  }
  return { hasTime: t, spanMs: r > n ? r - n : 0 };
}
function ci(e) {
  return e.hasTime ? e.spanMs <= 2 * cn ? (t) => {
    try {
      const n = new Date(t);
      return isNaN(n.getTime()) ? String(t) : n.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return String(t);
    }
  } : e.spanMs <= 14 * cn ? Ht : Ie : Ie;
}
function ui(e) {
  return e.hasTime ? Ht : Ie;
}
function Ht(e) {
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
function di(e, t = {}) {
  const { decimals: n = 2, as: r = "fraction", signed: s = !1 } = t, i = r === "fraction" ? e * 100 : e;
  return `${s && i > 0 ? "+" : ""}${i.toFixed(n)}%`;
}
function fi(e, t = "USD", n = {}) {
  const { compact: r = !1, decimals: s } = n;
  try {
    return e.toLocaleString(void 0, {
      style: "currency",
      currency: t,
      maximumFractionDigits: s ?? (r ? 0 : Math.abs(e) >= 100 ? 2 : 4),
      minimumFractionDigits: s ?? (r || Math.abs(e) >= 100 ? 0 : 2)
    });
  } catch {
    return e.toLocaleString();
  }
}
function mi(e, t = {}) {
  const { signed: n = !1, as: r = "fraction" } = t, s = r === "fraction" ? e * 1e4 : e * 100;
  return `${n && s > 0 ? "+" : ""}${Math.round(s)} bps`;
}
const Ce = {
  ok: "var(--mtc-ok)",
  warn: "var(--mtc-warning)",
  danger: "var(--mtc-danger)",
  error: "var(--mtc-danger)",
  info: "var(--mtc-accent)",
  muted: "var(--mtc-muted)"
}, de = [
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
function pi(e, t) {
  return e ? e in Ce ? Ce[e] : e.startsWith("#") ? e : de[t % de.length] : de[t % de.length];
}
function xr(e, t = de) {
  return e.map((n, r) => t[r % t.length]);
}
const hi = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], bi = {
  buy: "var(--mtc-ok)",
  sell: "var(--mtc-danger)",
  info: "var(--mtc-accent)",
  warn: "var(--mtc-warning)"
}, gi = "var(--mtc-grid)", At = "var(--mtc-border)", rt = "var(--mtc-muted)", ht = "var(--mtc-surface)", xi = "var(--mtc-muted-subtle)";
function yi({ data: e, options: t }) {
  const { hoverTime: n, setHoverTime: r } = dr(), s = U(null), i = L(() => Si(e), [e]), { tickFormatter: l, labelFormatter: a } = L(() => {
    const f = ai(i?.points.map((h) => h._ts) ?? []);
    return {
      tickFormatter: ci(f),
      labelFormatter: ui(f)
    };
  }, [i]), u = L(
    () => xr(i?.keys ?? [], hi),
    [i]
  ), c = t?.brush === !0;
  if (!i) return /* @__PURE__ */ o(D, { children: "No data" });
  const d = n != null && n !== s.current;
  return /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(
    Cr,
    {
      data: i.points,
      onMouseMove: (f) => {
        const h = f?.activeLabel;
        if (h != null) {
          const p = String(h);
          s.current = p, r(p);
        }
      },
      onMouseLeave: () => {
        s.current = null, r(null);
      },
      children: [
        /* @__PURE__ */ o(He, { strokeDasharray: "3 3", stroke: gi }),
        /* @__PURE__ */ o(
          We,
          {
            dataKey: "_ts",
            stroke: At,
            tick: { fontSize: 11, fill: rt },
            tickFormatter: l
          }
        ),
        /* @__PURE__ */ o(
          qe,
          {
            stroke: At,
            tick: { fontSize: 11, fill: rt },
            tickFormatter: br,
            width: 60
          }
        ),
        /* @__PURE__ */ o(
          _e,
          {
            contentStyle: Te,
            labelStyle: { color: rt },
            labelFormatter: a
          }
        ),
        i.keys.map((f, h) => /* @__PURE__ */ o(
          Er,
          {
            type: "monotone",
            dataKey: f,
            stroke: u[h],
            dot: !1,
            strokeWidth: 2
          },
          f
        )),
        c && i.points.length > 4 && /* @__PURE__ */ o(
          Fn,
          {
            dataKey: "_ts",
            height: 20,
            stroke: At,
            fill: ht,
            travellerWidth: 6,
            tickFormatter: l
          }
        ),
        d && /* @__PURE__ */ o(Or, { x: n, stroke: xi, strokeDasharray: "3 3" }),
        i.annotations.map((f, h) => {
          const p = f.color ?? (f.kind ? bi[f.kind] : null) ?? rt;
          if (f.endTimestamp) {
            const [g, b] = f.timestamp <= f.endTimestamp ? [f.timestamp, f.endTimestamp] : [f.endTimestamp, f.timestamp];
            return /* @__PURE__ */ o(
              Mr,
              {
                x1: g,
                x2: b,
                fill: p,
                fillOpacity: 0.1,
                stroke: p,
                strokeOpacity: 0.4,
                strokeDasharray: "3 3",
                label: { value: f.label, position: "insideTopLeft", fontSize: 10, fill: p }
              },
              h
            );
          }
          return f.value === void 0 ? null : /* @__PURE__ */ o(
            Rr,
            {
              x: f.timestamp,
              y: f.value,
              r: 6,
              fill: p,
              stroke: ht,
              strokeWidth: 2,
              ifOverflow: "extendDomain",
              shape: (g) => /* @__PURE__ */ o(vi, { ...g, kind: f.kind, color: p, label: f.label })
            },
            h
          );
        })
      ]
    }
  ) });
}
function vi({ cx: e, cy: t, kind: n, color: r, label: s }) {
  if (e == null || t == null) return null;
  let i;
  if (n === "buy")
    i = `M${e} ${t - 7} L${e + 6} ${t + 4} L${e - 6} ${t + 4} Z`;
  else if (n === "sell")
    i = `M${e} ${t + 7} L${e + 6} ${t - 4} L${e - 6} ${t - 4} Z`;
  else
    return /* @__PURE__ */ o("g", { children: /* @__PURE__ */ o("circle", { cx: e, cy: t, r: 5, fill: r, stroke: ht, strokeWidth: 2, children: /* @__PURE__ */ o("title", { children: s }) }) });
  return /* @__PURE__ */ o("g", { children: /* @__PURE__ */ o("path", { d: i, fill: r, stroke: ht, strokeWidth: 1.5, children: /* @__PURE__ */ o("title", { children: s }) }) });
}
const wi = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function ki(e) {
  for (const t of wi)
    if (t in e) return t;
  return null;
}
function Ni(e) {
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
function Si(e) {
  if (!e) return null;
  const t = Ni(e);
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const n = e[0], r = ki(n);
    if (!r) return null;
    const s = Object.keys(n).filter(
      (l) => l !== r && typeof n[l] == "number"
    );
    return s.length === 0 ? null : { points: e.map((l) => {
      const a = l, u = { _ts: a[r] };
      for (const c of s) u[c] = a[c];
      return u;
    }), keys: s, annotations: t };
  }
  if (typeof e == "object" && e !== null && "points" in e) {
    const n = e.points;
    return !Array.isArray(n) || n.length === 0 ? null : { points: n.map((s) => {
      const i = s;
      return { _ts: i.timestamp ?? i.date ?? i.time ?? i.x, value: i.value ?? i.y ?? i.v };
    }), keys: ["value"], annotations: t };
  }
  if (typeof e == "object" && e !== null && "series" in e) {
    const n = e.series;
    if (!Array.isArray(n)) return null;
    const r = /* @__PURE__ */ new Map(), s = [];
    for (const i of n) {
      const l = i, a = String(l.name || l.label || `s${s.length}`);
      s.push(a);
      const u = l.data ?? l.points;
      if (Array.isArray(u))
        for (const c of u) {
          const d = String(c.timestamp ?? c.date ?? c.time ?? c.x ?? "");
          r.has(d) || r.set(d, { _ts: d }), r.get(d)[a] = c.value ?? c.y ?? c.v;
        }
    }
    return { points: Array.from(r.values()), keys: s, annotations: t };
  }
  return null;
}
const zi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Timeseries: yi
}, Symbol.toStringTag, { value: "Module" })), Ai = {
  buy: { shape: "arrowUp", position: "belowBar", color: "ok" },
  sell: { shape: "arrowDown", position: "aboveBar", color: "danger" },
  info: { shape: "circle", position: "aboveBar", color: "accent" },
  warn: { shape: "circle", position: "aboveBar", color: "warning" }
}, un = {
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
function _i({ data: e }) {
  const { hoverTime: t, setHoverTime: n } = dr(), r = U(null), s = U(null), i = U(null), l = U(null), a = U(null), u = U(null), c = U(Se);
  R(() => {
    if (!r.current) return;
    const f = Ei(r.current);
    c.current = f;
    const h = Vr(r.current, {
      layout: {
        background: { type: Jr.Solid, color: "transparent" },
        textColor: f.muted,
        fontSize: 11
      },
      grid: {
        vertLines: { color: f.grid },
        horzLines: { color: f.grid }
      },
      crosshair: {
        vertLine: { color: f.mutedSubtle, width: 1, style: 2 },
        horzLine: { color: f.mutedSubtle, width: 1, style: 2 }
      },
      rightPriceScale: {
        borderColor: f.border
      },
      timeScale: {
        borderColor: f.border,
        timeVisible: !0
      },
      handleScroll: !0,
      handleScale: !0
    }), p = h.addSeries(Xr, {
      upColor: f.ok,
      downColor: f.danger,
      borderDownColor: f.danger,
      borderUpColor: f.ok,
      wickDownColor: f.danger,
      wickUpColor: f.ok
    }), g = h.addSeries(Yr, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume"
    });
    h.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 }
    }), s.current = h, i.current = p, l.current = g, a.current = Zr(p, []), h.subscribeCrosshairMove((w) => {
      if (w.time != null) {
        const A = String(w.time);
        u.current = A, n(A);
      } else
        u.current = null, n(null);
    });
    const b = new ResizeObserver((w) => {
      const { width: A, height: $ } = w[0].contentRect;
      h.applyOptions({ width: A, height: $ });
    });
    return b.observe(r.current), () => {
      b.disconnect(), h.remove(), s.current = null, i.current = null, l.current = null, a.current = null;
    };
  }, []), R(() => {
    const f = s.current, h = i.current;
    if (!f || !h) return;
    if (t == null) {
      f.clearCrosshairPosition();
      return;
    }
    if (t === u.current) return;
    const p = h.data?.()[0]?.close ?? 0;
    f.setCrosshairPosition(p, t, h);
  }, [t]);
  const d = L(() => Ci(e), [e]);
  return R(() => {
    if (i.current && d.candles.length !== 0) {
      if (i.current.setData(d.candles), d.volumes.length > 0 && l.current) {
        const f = c.current;
        l.current.setData(d.volumes.map((h) => ({
          ...h,
          color: h.direction === "down" ? dn(f.danger, 0.3) : dn(f.ok, 0.3)
        })));
      }
      a.current && a.current.setMarkers(Ti(d.annotations, c.current)), s.current?.timeScale().fitContent();
    }
  }, [d]), /* @__PURE__ */ m("div", { className: "relative w-full h-full", children: [
    /* @__PURE__ */ o("div", { ref: r, className: "w-full h-full" }),
    d.candles.length === 0 && /* @__PURE__ */ o("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ o(D, { children: "No data" }) })
  ] });
}
function Ti(e, t) {
  return e.map((n) => {
    const r = n.kind ? Ai[n.kind] ?? un : un;
    return {
      time: yr(n.timestamp),
      position: r.position,
      shape: r.shape,
      color: n.color ?? t[r.color],
      text: n.label
    };
  });
}
const $i = ["timestamp", "date", "time", "datetime", "ts", "t"];
function Ue(e, t) {
  for (const r of t)
    if (r in e) return r;
  const n = Object.keys(e).reduce((r, s) => (r[s.toLowerCase()] = s, r), {});
  for (const r of t)
    if (n[r]) return n[r];
  return null;
}
function yr(e) {
  if (typeof e == "number")
    return e > 1e12 ? Math.floor(e / 1e3) : e;
  const t = String(e).trim();
  if (t.includes("T") || / \d/.test(t)) {
    const n = new Date(t.replace(" ", "T"));
    if (!isNaN(n.getTime())) return Math.floor(n.getTime() / 1e3);
  }
  return t.split(" ")[0].split("T")[0];
}
function Ci(e) {
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
  const s = n[0], i = Ue(s, $i), l = Ue(s, ["open", "o"]), a = Ue(s, ["high", "h"]), u = Ue(s, ["low", "l"]), c = Ue(s, ["close", "c"]), d = Ue(s, ["volume", "vol", "v"]);
  if (!i || !l || !a || !u || !c) return { ...t, annotations: r };
  const f = [], h = [];
  for (const p of n) {
    const g = p, b = yr(g[i]), w = Number(g[l]), A = Number(g[a]), $ = Number(g[u]), j = Number(g[c]);
    f.push({ time: b, open: w, high: A, low: $, close: j }), d && g[d] != null && h.push({
      time: b,
      value: Number(g[d]),
      direction: j >= w ? "up" : "down"
    });
  }
  return { candles: f, volumes: h, annotations: r };
}
function Ei(e) {
  const t = getComputedStyle(e), n = (r, s) => t.getPropertyValue(r).trim() || s;
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
function dn(e, t) {
  const n = e.trim().match(/^#([0-9a-f]{6})$/i);
  if (n) {
    const s = parseInt(n[1], 16);
    return `rgba(${s >> 16 & 255}, ${s >> 8 & 255}, ${s & 255}, ${t})`;
  }
  const r = e.trim().match(/^rgba?\(([^)]+)\)$/i);
  if (r) {
    const s = r[1].split(/[\s,\/]+/).map(Number).filter(Number.isFinite);
    if (s.length >= 3) return `rgba(${s[0]}, ${s[1]}, ${s[2]}, ${t})`;
  }
  return e;
}
const Oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Candlestick: _i
}, Symbol.toStringTag, { value: "Module" }));
function vr(e) {
  if (typeof e != "string") return;
  const t = e.trim();
  if (/^https?:\/\//i.test(t) || /^\/(?!\/)/.test(t)) return t;
}
const Mi = /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:?\d{2})$/;
function Ri(e) {
  if (typeof e != "string" || !Mi.test(e.trim())) return e;
  const t = new Date(e);
  return isNaN(t.getTime()) ? e : t.toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function wr(e) {
  if (!e) return [];
  if (typeof e == "string") return [{ body: e }];
  if (!Array.isArray(e) && typeof e == "object" && e !== null) {
    const t = e;
    return Array.isArray(t.items) ? wr(t.items) : [fn(t)];
  }
  return Array.isArray(e) ? e.map((t) => typeof t == "string" ? { body: t } : typeof t == "object" && t !== null ? fn(t) : { body: String(t) }) : [];
}
function fn(e) {
  return {
    id: e.id != null ? String(e.id) : void 0,
    title: e.title != null ? String(e.title) : void 0,
    meta: e.meta ?? e.source ?? e.date ?? e.author ? [e.source, e.author, Ri(e.date)].filter(Boolean).map(String).join(" · ") : void 0,
    body: e.body ?? e.content ?? e.summary ?? e.text ? String(e.body ?? e.content ?? e.summary ?? e.text) : void 0,
    tags: Array.isArray(e.tags) ? e.tags.map(String) : void 0,
    image: e.image != null ? String(e.image) : e.image_url != null ? String(e.image_url) : e.thumbnail != null ? String(e.thumbnail) : void 0,
    url: vr(e.url ?? e.uri ?? e.link ?? e.href)
  };
}
const ji = 25, Ii = 600;
function Li({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = t?.pageSize || ji, s = t?.row_context, i = t?.heat_columns ?? [], l = t?.export === !0, a = t?.tick_flash === !0, u = t?.search === !0, c = t?.column_formats ?? {}, { columns: d, rows: f, labels: h, formats: p } = L(() => Pi(e), [e]), g = L(() => ({ ...p, ...c }), [p, c]), [b, w] = v(null), [A, $] = v(!0), [j, E] = v(0), [x, T] = v(""), O = (y, k) => {
    const _ = d[0] != null ? y[d[0]] : void 0;
    return _ == null ? `_idx_${k}` : String(_);
  }, I = U(/* @__PURE__ */ new Map()), [G, Z] = v(/* @__PURE__ */ new Map());
  R(() => {
    if (!a) return;
    const y = /* @__PURE__ */ new Map();
    for (let _ = 0; _ < f.length; _++) {
      const M = f[_], W = O(M, _), V = I.current.get(W), ne = {};
      let te = null;
      for (const se of d) {
        const me = M[se];
        typeof me == "number" && (ne[se] = me, te == null && V && V[se] != null && V[se] !== me && (te = me > V[se] ? "up" : "down"));
      }
      I.current.set(W, ne), te && y.set(W, te);
    }
    if (y.size === 0) return;
    Z((_) => {
      const M = new Map(_);
      for (const [W, V] of y) M.set(W, V);
      return M;
    });
    const k = setTimeout(() => {
      Z((_) => {
        const M = new Map(_);
        for (const [W, V] of y)
          M.get(W) === V && M.delete(W);
        return M;
      });
    }, Ii);
    return () => clearTimeout(k);
  }, [f, a]);
  const X = L(() => {
    const y = {};
    for (const k of i) {
      let _ = 1 / 0, M = -1 / 0;
      for (const W of f) {
        const V = W[k];
        typeof V == "number" && Number.isFinite(V) && (V < _ && (_ = V), V > M && (M = V));
      }
      Number.isFinite(_) && Number.isFinite(M) && (y[k] = { min: _, max: M });
    }
    return y;
  }, [f, i]), Y = (y) => {
    if (!s) return;
    const k = s.field ?? d[0], _ = y[k];
    _ != null && n(s.key, String(_));
  }, P = L(() => {
    const y = x.trim().toLowerCase();
    return y ? f.filter(
      (k) => d.some((_) => {
        const M = k[_];
        return M != null && String(M).toLowerCase().includes(y);
      })
    ) : f;
  }, [f, d, x]), K = L(() => b ? [...P].sort((y, k) => {
    const _ = y[b], M = k[b];
    if (_ == null && M == null) return 0;
    if (_ == null) return 1;
    if (M == null) return -1;
    const W = typeof _ == "number" && typeof M == "number" ? _ - M : String(_).localeCompare(String(M));
    return A ? W : -W;
  }) : P, [P, b, A]), q = Math.max(1, Math.ceil(K.length / r)), z = Math.min(j, q - 1), H = K.slice(z * r, (z + 1) * r), ee = K.length > r, Q = (y) => {
    b === y ? $(!A) : (w(y), $(!0)), E(0);
  };
  return d.length === 0 ? /* @__PURE__ */ o(D, { children: "No data" }) : /* @__PURE__ */ m("div", { className: "flex flex-col h-full", children: [
    (u || l) && /* @__PURE__ */ m("div", { className: "flex items-center gap-2 pb-1", children: [
      u && /* @__PURE__ */ o(
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
      l && /* @__PURE__ */ o(
        "button",
        {
          onClick: () => {
            const y = [
              d.map(Pt).join(","),
              ...K.map((W) => d.map((V) => Pt(W[V])).join(","))
            ], k = new Blob([y.join(`
`)], { type: "text/csv;charset=utf-8" }), _ = URL.createObjectURL(k), M = document.createElement("a");
            M.href = _, M.download = "export.csv", M.click(), URL.revokeObjectURL(_);
          },
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0",
          title: "Download as CSV",
          children: "↓ CSV"
        }
      )
    ] }),
    /* @__PURE__ */ o("div", { className: "overflow-auto flex-1 min-h-0", children: /* @__PURE__ */ m("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ o("thead", { className: "sticky top-0 bg-zinc-900", children: /* @__PURE__ */ o("tr", { children: d.map((y) => {
        const k = g[y], _ = k && k !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(k);
        return /* @__PURE__ */ m(
          "th",
          {
            onClick: () => Q(y),
            className: `px-3 py-2 text-zinc-400 border-b border-zinc-700 cursor-pointer hover:text-zinc-100 select-none whitespace-nowrap font-medium ${_ ? "text-right" : "text-left"}`,
            children: [
              h[y] ?? y,
              b === y && /* @__PURE__ */ o("span", { className: "ml-1 text-zinc-500", children: A ? "↑" : "↓" })
            ]
          },
          y
        );
      }) }) }),
      /* @__PURE__ */ o("tbody", { children: H.map((y, k) => {
        const _ = G.get(O(y, k));
        return /* @__PURE__ */ o(
          "tr",
          {
            onClick: s ? () => Y(y) : void 0,
            className: `border-b border-zinc-800/60 transition-colors duration-300 ${_ === "up" ? "bg-emerald-500/15" : _ === "down" ? "bg-red-500/15" : ""} ${s ? "cursor-pointer hover:bg-zinc-800" : "hover:bg-zinc-800/40"}`,
            children: d.map((W) => {
              const V = X[W], ne = y[W], te = V && typeof ne == "number" ? { backgroundColor: Di(ne, V.min, V.max) } : void 0, se = g[W];
              if (se === "link" && ne != null) {
                const be = typeof ne == "object" && !Array.isArray(ne) ? ne : { label: void 0, url: ne }, he = vr(be.url), ye = be.label != null && be.label !== "" ? String(be.label) : he ?? "";
                return /* @__PURE__ */ o("td", { className: "px-3 py-2.5 whitespace-nowrap", style: te, children: he ? /* @__PURE__ */ m(
                  "a",
                  {
                    href: he,
                    ...he.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" },
                    className: "text-sky-400 hover:underline",
                    children: [
                      ye,
                      /* @__PURE__ */ o("span", { className: "ml-1 text-xs text-zinc-500", "aria-hidden": "true", children: he.startsWith("/") ? "→" : "↗" })
                    ]
                  }
                ) : /* @__PURE__ */ o("span", { className: "text-zinc-100", children: ye }) }, W);
              }
              if (se === "sparkline" && Array.isArray(ne))
                return /* @__PURE__ */ o("td", { className: "px-3 py-2.5 whitespace-nowrap", style: te, children: /* @__PURE__ */ o(Fi, { values: ne }) }, W);
              const me = se ? Ui(ne, se) : Dt(ne), $e = se ? se.split(":").slice(1).includes("signed") : !1, Le = se && se !== "sparkline" && /^(currency|percent|bps|compact)(:|$)/.test(se) ? "text-right" : "", pe = $e && typeof ne == "number" ? ne > 0 ? "text-emerald-400" : ne < 0 ? "text-red-400" : "text-zinc-100" : "text-zinc-100";
              return /* @__PURE__ */ o(
                "td",
                {
                  className: `px-3 py-2.5 whitespace-nowrap tabular-nums ${Le} ${pe}`,
                  style: te,
                  children: me
                },
                W
              );
            })
          },
          k
        );
      }) })
    ] }) }),
    ee && /* @__PURE__ */ m("div", { className: "flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs text-zinc-400", children: [
      /* @__PURE__ */ m("span", { children: [
        K.length,
        " rows"
      ] }),
      /* @__PURE__ */ m("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ o("button", { onClick: () => E(0), disabled: z === 0, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "«" }),
        /* @__PURE__ */ o("button", { onClick: () => E((y) => y - 1), disabled: z === 0, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "‹" }),
        /* @__PURE__ */ m("span", { className: "px-2 text-zinc-300", children: [
          z + 1,
          " / ",
          q
        ] }),
        /* @__PURE__ */ o("button", { onClick: () => E((y) => y + 1), disabled: z >= q - 1, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "›" }),
        /* @__PURE__ */ o("button", { onClick: () => E(q - 1), disabled: z >= q - 1, className: "px-1.5 py-0.5 rounded hover:bg-zinc-800 disabled:opacity-30", children: "»" })
      ] })
    ] })
  ] });
}
function Pi(e) {
  const t = { columns: [], rows: [], labels: {}, formats: {} };
  if (!e) return t;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object") {
    const n = [...new Set(e.flatMap((r) => Object.keys(r)))];
    return { ...t, columns: n, rows: e };
  }
  if (typeof e == "object" && e !== null && "rows" in e) {
    const n = e, r = Array.isArray(n.columns) ? n.columns : [];
    if (r.length > 0 && typeof r[0] == "object") {
      const i = r, l = i.map((d) => d.key), a = {}, u = {};
      for (const d of i)
        d.label && (a[d.key] = d.label), d.format && (u[d.key] = d.format);
      const c = n.rows.map(
        (d) => Array.isArray(d) ? Object.fromEntries(l.map((f, h) => [f, d[h]])) : d
      );
      return { columns: l, rows: c, labels: a, formats: u };
    }
    if (r.length > 0) {
      const i = r, l = n.rows.map(
        (a) => Array.isArray(a) ? Object.fromEntries(i.map((u, c) => [u, a[c]])) : a
      );
      return { ...t, columns: i, rows: l };
    }
    const s = n.rows;
    if (s.length > 0 && typeof s[0] == "object" && !Array.isArray(s[0])) {
      const i = [...new Set(s.flatMap((l) => Object.keys(l)))];
      return { ...t, columns: i, rows: s };
    }
  }
  return t;
}
function Di(e, t, n) {
  if (n === t) return "transparent";
  if (t < 0 && n > 0) {
    const s = Math.max(Math.abs(t), Math.abs(n)), i = Math.max(-1, Math.min(1, e / s));
    return i >= 0 ? `rgba(16, 185, 129, ${0.35 * i})` : `rgba(239, 68, 68, ${0.35 * -i})`;
  }
  return `rgba(14, 165, 233, ${0.35 * ((e - t) / (n - t))})`;
}
function Pt(e) {
  if (e == null) return "";
  if (typeof e == "object" && !Array.isArray(e) && "url" in e)
    return Pt(e.url);
  const t = String(e);
  return /[,"\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}
function Fi({ values: e }) {
  const t = e.map((u) => Number(u)).filter((u) => Number.isFinite(u));
  if (t.length < 2) return /* @__PURE__ */ o("span", { className: "text-zinc-600", children: "—" });
  const n = Math.min(...t), s = Math.max(...t) - n || 1, l = t[t.length - 1] >= t[0] ? "#10b981" : "#ef4444", a = t.map((u, c) => {
    const d = c / (t.length - 1) * 100, f = 16 - (u - n) / s * 14 - 1;
    return `${d.toFixed(1)},${f.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ o("svg", { viewBox: "0 0 100 16", className: "w-20 h-4", preserveAspectRatio: "none", children: /* @__PURE__ */ o(
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
function Dt(e) {
  return e == null ? "—" : typeof e == "number" ? Number.isInteger(e) ? e.toLocaleString() : e.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : typeof e == "boolean" ? e ? "Yes" : "No" : String(e);
}
function Ui(e, t) {
  if (e == null) return "—";
  if (t.split(":")[0] === "datetime") return Ht(e);
  if (typeof e != "number") return Dt(e);
  const [n, ...r] = t.split(":"), s = new Set(r), i = s.has("signed");
  switch (n) {
    case "currency": {
      const l = r.find((a) => a !== "signed") ?? "USD";
      return fi(e, l);
    }
    case "percent": {
      const l = s.has("p") ? "percent" : "fraction";
      return di(e, { signed: i, as: l });
    }
    case "bps":
      return mi(e, { signed: i });
    case "compact":
      return Ge(e);
    default:
      return Dt(e);
  }
}
const Bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DataTable: Li
}, Symbol.toStringTag, { value: "Module" })), Ki = 400;
function kr(e, t = Ki) {
  const [n, r] = v(e), s = U(e), i = U(0), l = U(void 0);
  return R(() => {
    if (typeof window > "u" || !Number.isFinite(e)) {
      r(e);
      return;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      r(e);
      return;
    }
    if (e === n) return;
    s.current = n, i.current = performance.now();
    const u = (c) => {
      const d = Math.min(1, (c - i.current) / t), f = 1 - Math.pow(1 - d, 3), h = s.current + (e - s.current) * f;
      r(h), d < 1 && (l.current = requestAnimationFrame(u));
    };
    return l.current = requestAnimationFrame(u), () => {
      l.current && cancelAnimationFrame(l.current);
    };
  }, [e, t]), n;
}
const Hi = 600;
function Wi({ data: e }) {
  const { value: t, delta: n, unit: r, label: s, trend: i } = Gi(e), l = kr(t), a = U(null), [u, c] = v(null);
  return R(() => {
    const f = a.current;
    if (a.current = t, f == null || f === t) return;
    c(t > f ? "up" : "down");
    const h = setTimeout(() => c(null), Hi);
    return () => clearTimeout(h);
  }, [t]), /* @__PURE__ */ m("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ m("div", { className: `text-3xl font-bold tabular-nums transition-colors duration-300 ${u === "up" ? "text-emerald-300" : u === "down" ? "text-red-300" : "text-white"}`, children: [
      gr(l),
      r && /* @__PURE__ */ o("span", { className: "text-base font-normal text-zinc-400 ml-1", children: r })
    ] }),
    n != null && /* @__PURE__ */ m("div", { className: `text-sm font-medium ${n >= 0 ? "text-emerald-400" : "text-red-400"}`, children: [
      n >= 0 ? "▲" : "▼",
      " ",
      Vi(n)
    ] }),
    i && i.length >= 2 && /* @__PURE__ */ o(qi, { values: i }),
    s && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-500", children: s })
  ] });
}
function qi({ values: e }) {
  const t = Math.min(...e), r = Math.max(...e) - t || 1, i = e[e.length - 1] >= e[0] ? "#10b981" : "#ef4444", l = e.map((a, u) => {
    const c = u / (e.length - 1) * 100, d = 18 - (a - t) / r * 16 - 1;
    return `${c.toFixed(1)},${d.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ o("svg", { viewBox: "0 0 100 18", className: "w-full max-w-[120px] h-5", preserveAspectRatio: "none", children: /* @__PURE__ */ o(
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
function Gi(e) {
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
function Vi(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const Ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Metric: Wi
}, Symbol.toStringTag, { value: "Module" })), Xi = 1500;
function Yi({ data: e }) {
  const t = wr(e), n = U(/* @__PURE__ */ new Set()), r = U(!1), [s, i] = v(/* @__PURE__ */ new Set());
  return R(() => {
    const l = t.map(mn);
    if (!r.current) {
      r.current = !0;
      for (const c of l) n.current.add(c);
      return;
    }
    const a = l.filter((c) => !n.current.has(c));
    for (const c of l) n.current.add(c);
    if (a.length === 0) return;
    i((c) => {
      const d = new Set(c);
      for (const f of a) d.add(f);
      return d;
    });
    const u = setTimeout(() => {
      i((c) => {
        const d = new Set(c);
        for (const f of a) d.delete(f);
        return d;
      });
    }, Xi);
    return () => clearTimeout(u);
  }, [t]), t.length === 0 ? /* @__PURE__ */ o(D, { children: "No content" }) : /* @__PURE__ */ o("div", { className: "overflow-auto h-full space-y-3", children: t.map((l, a) => {
    const u = mn(l), c = s.has(u) ? "bg-sky-500/5" : "";
    return /* @__PURE__ */ m(
      "article",
      {
        className: `flex gap-3 border-b border-zinc-800/60 pb-3 last:border-0 rounded-sm transition-colors duration-700 ${c}`,
        children: [
          /* @__PURE__ */ m("div", { className: "flex-1 min-w-0", children: [
            (l.title || l.url) && /* @__PURE__ */ o("h4", { className: "text-sm font-medium text-zinc-100 mb-1 leading-snug", children: l.url ? /* @__PURE__ */ m(
              "a",
              {
                href: l.url,
                ...l.url.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" },
                className: "hover:text-sky-400 hover:underline",
                children: [
                  l.title || Zi(l.url),
                  /* @__PURE__ */ o("span", { className: "ml-1 text-xs text-zinc-500", "aria-hidden": "true", children: l.url.startsWith("/") ? "→" : "↗" })
                ]
              }
            ) : l.title }),
            l.meta && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-500 mb-1.5", children: l.meta }),
            l.body && /* @__PURE__ */ o("p", { className: "text-sm text-zinc-300 leading-relaxed", children: l.body }),
            l.tags && l.tags.length > 0 && /* @__PURE__ */ o("div", { className: "flex gap-1.5 mt-2 flex-wrap", children: l.tags.map((d, f) => /* @__PURE__ */ o("span", { className: "text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400", children: d }, f)) })
          ] }),
          l.image && /* @__PURE__ */ o(
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
function mn(e) {
  return e.id ? `id:${e.id}` : `t:${e.title ?? ""}|b:${(e.body ?? "").slice(0, 60)}`;
}
function Zi(e) {
  try {
    return new URL(e).hostname;
  } catch {
    return e;
  }
}
const Qi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Text: Yi
}, Symbol.toStringTag, { value: "Module" }));
function el({ options: e }) {
  const { dispatch: t, ctx: n, setCtx: r, backendUrl: s, widgets: i } = ae(), [l, a] = v(""), [u, c] = v(!1), [d, f] = v(null), [h, p] = v(null), g = e?.url, b = !!s, w = ce(async () => {
    const $ = l.trim();
    if (!(!$ || u) && !(!b && !g)) {
      c(!0), p(null), f(null);
      try {
        const j = b ? await fetch(ys(s), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vs($, n, i))
        }) : await fetch(g, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: $ })
        });
        if (!j.ok) throw new Error(`HTTP ${j.status}`);
        const E = await j.json(), x = E.text ?? E.dialogue?.text;
        if (x && f(x), E.context?.values)
          for (const [T, O] of Object.entries(E.context.values)) r(T, O);
        E.actions && E.actions.length > 0 && t(E.actions, { replaceAll: E.replace_all }), a("");
      } catch (j) {
        p(j instanceof Error ? j.message : "Request failed");
      } finally {
        c(!1);
      }
    }
  }, [l, u, b, s, g, n, i, t, r]), A = ($) => {
    $.key === "Enter" && !$.shiftKey && ($.preventDefault(), w());
  };
  return !b && !g ? /* @__PURE__ */ o(D, { padded: !0, children: "Set a backendUrl on Dashboard or options.url on this widget" }) : /* @__PURE__ */ m("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
    /* @__PURE__ */ m("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ o(
        "input",
        {
          type: "text",
          className: `flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100
            placeholder-zinc-500 outline-none focus:border-zinc-500 disabled:opacity-50`,
          placeholder: "Ask anything... (Enter to send)",
          value: l,
          onChange: ($) => a($.target.value),
          onKeyDown: A,
          disabled: u
        }
      ),
      /* @__PURE__ */ o(
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
    d && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-400 leading-relaxed", children: d }),
    h && /* @__PURE__ */ o("div", { className: "text-xs text-red-400", children: h })
  ] });
}
const tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Prompt: el
}, Symbol.toStringTag, { value: "Module" })), st = {
  ok: "var(--mtc-ok)",
  warn: "var(--mtc-warning)",
  danger: "var(--mtc-danger)",
  error: "var(--mtc-danger)",
  info: "var(--mtc-accent)",
  muted: "var(--mtc-muted)"
}, _t = "M 16 104 A 84 84 0 0 1 184 104";
function nl({ data: e }) {
  const t = rl(e);
  if (!t) return /* @__PURE__ */ o(D, { children: "No data" });
  const n = t.max - t.min, r = n > 0 ? Math.max(0, Math.min(1, (t.value - t.min) / n)) : 0, s = t.bands.find((l) => t.value >= l.from && t.value <= l.to), i = st[s?.color ?? "info"] ?? st.info;
  return /* @__PURE__ */ m("div", { className: "flex flex-col items-center justify-center h-full gap-1", children: [
    /* @__PURE__ */ m("svg", { viewBox: "0 0 200 120", className: "w-full max-w-[260px]", children: [
      /* @__PURE__ */ o("path", { d: _t, fill: "none", stroke: "var(--mtc-grid)", strokeWidth: "16", pathLength: "100" }),
      t.bands.map((l, a) => {
        const u = (l.from - t.min) / n, c = (l.to - t.min) / n;
        return /* @__PURE__ */ o(
          "path",
          {
            d: _t,
            fill: "none",
            stroke: st[l.color] ?? st.muted,
            strokeWidth: "16",
            opacity: 0.22,
            pathLength: "100",
            strokeDasharray: `${(c - u) * 100} 100`,
            strokeDashoffset: -u * 100
          },
          a
        );
      }),
      /* @__PURE__ */ o(
        "path",
        {
          d: _t,
          fill: "none",
          stroke: i,
          strokeWidth: "16",
          strokeLinecap: "round",
          pathLength: "100",
          strokeDasharray: `${r * 100} 100`
        }
      ),
      /* @__PURE__ */ o(
        "text",
        {
          x: "100",
          y: "92",
          textAnchor: "middle",
          fill: "var(--mtc-fg)",
          style: { fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
          children: sl(t.value, t.min, t.max)
        }
      )
    ] }),
    t.label && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-500 text-center px-2 truncate max-w-full", children: t.label })
  ] });
}
function rl(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e;
  if (typeof t.value != "number") return null;
  const n = typeof t.min == "number" ? t.min : 0, r = typeof t.max == "number" ? t.max : 1, s = Array.isArray(t.bands) ? t.bands.map((i) => {
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
    bands: s,
    label: t.label != null ? String(t.label) : void 0
  };
}
function sl(e, t, n) {
  return t === 0 && n === 1 ? `${(e * 100).toFixed(1)}%` : t === -1 && n === 1 ? e >= 0 ? `+${e.toFixed(2)}` : e.toFixed(2) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const ol = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Gauge: nl
}, Symbol.toStringTag, { value: "Module" }));
function il({ data: e }) {
  const t = L(() => ll(e), [e]);
  if (!t) return /* @__PURE__ */ o(D, { children: "No data" });
  const { slices: n, total: r } = t, s = n.map((a, u) => pi(a.color, u)), i = n.reduce((a, u) => u.value > a.value ? u : a), l = i.value / r * 100;
  return /* @__PURE__ */ m("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ m("div", { className: "flex-1 relative min-h-0", children: [
      /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(jr, { children: [
        /* @__PURE__ */ o(
          Ir,
          {
            data: n,
            dataKey: "value",
            nameKey: "label",
            innerRadius: "60%",
            outerRadius: "92%",
            paddingAngle: 2,
            stroke: "none",
            isAnimationActive: !1,
            children: n.map((a, u) => /* @__PURE__ */ o(Un, { fill: s[u] }, u))
          }
        ),
        /* @__PURE__ */ o(
          _e,
          {
            contentStyle: Te,
            formatter: (a) => {
              const u = Number(a) || 0;
              return [`${al(u)} (${(u / r * 100).toFixed(1)}%)`, ""];
            }
          }
        )
      ] }) }),
      /* @__PURE__ */ m("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
        /* @__PURE__ */ o("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate max-w-[60%]", children: i.label }),
        /* @__PURE__ */ m("div", { className: "text-2xl font-bold text-white tabular-nums", children: [
          l.toFixed(1),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ o("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs", children: n.map((a, u) => /* @__PURE__ */ m("div", { className: "flex items-center gap-1.5 min-w-0", children: [
      /* @__PURE__ */ o("span", { className: "w-2 h-2 rounded-sm shrink-0", style: { backgroundColor: s[u] } }),
      /* @__PURE__ */ o("span", { className: "text-zinc-300 truncate", children: a.label }),
      /* @__PURE__ */ m("span", { className: "text-zinc-500 ml-auto tabular-nums shrink-0", children: [
        (a.value / r * 100).toFixed(1),
        "%"
      ] })
    ] }, u)) })
  ] });
}
function ll(e) {
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
function al(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
const cl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Distribution: il
}, Symbol.toStringTag, { value: "Module" })), ul = 96, dl = 22;
function fl({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => pl(e), [e]);
  if (!r) return /* @__PURE__ */ o(D, { children: "No data" });
  const s = t?.row_context, i = t?.col_context, l = !!(s || i), a = (w, A) => {
    s && n(s.key, r.rows[w]), i && n(i.key, r.columns[A]);
  }, { rows: u, columns: c, cells: d, min: f, max: h, scale: p } = r, g = d.length <= 60, b = L(() => {
    const w = u.map(() => Array(c.length).fill(void 0));
    for (const A of d) w[A.row][A.col] = A;
    return w;
  }, [u, c, d]);
  return /* @__PURE__ */ m("div", { className: "h-full w-full overflow-auto flex flex-col", children: [
    /* @__PURE__ */ m(
      "div",
      {
        className: "inline-grid min-w-full",
        style: {
          gridTemplateColumns: `${ul}px repeat(${c.length}, minmax(28px, 1fr))`,
          gap: 2
        },
        children: [
          /* @__PURE__ */ o("div", { className: "sticky left-0 top-0 z-20 bg-zinc-900" }),
          c.map((w) => /* @__PURE__ */ o(
            "div",
            {
              className: "text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900",
              style: { height: dl },
              children: w
            },
            `c-${w}`
          )),
          u.flatMap((w, A) => [
            /* @__PURE__ */ o(
              "div",
              {
                className: "text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900",
                style: { minHeight: 30 },
                children: w
              },
              `rl-${A}`
            ),
            ...c.map(($, j) => {
              const E = b[A][j];
              if (!E) return /* @__PURE__ */ o("div", { className: "bg-zinc-900 rounded-sm" }, `e-${A}-${j}`);
              const x = Nr(E.value, f, h, p);
              return /* @__PURE__ */ o(
                "div",
                {
                  onClick: l ? () => a(A, j) : void 0,
                  className: `rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${l ? "cursor-pointer hover:ring-1 hover:ring-zinc-400" : ""}`,
                  style: { backgroundColor: x, minHeight: 30 },
                  title: `${w} × ${c[j]}: ${E.label ?? E.value.toFixed(2)}`,
                  children: g && /* @__PURE__ */ o("span", { className: "text-white/90", children: E.label ?? hl(E.value) })
                },
                `cell-${A}-${j}`
              );
            })
          ])
        ]
      }
    ),
    /* @__PURE__ */ o(ml, { min: f, max: h, scale: p })
  ] });
}
function ml({ min: e, max: t, scale: n }) {
  const r = n === "diverging" ? [-1, -0.5, 0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1], s = t - e;
  return /* @__PURE__ */ m("div", { className: "flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0", children: [
    /* @__PURE__ */ o("span", { className: "tabular-nums", children: Ge(e) }),
    /* @__PURE__ */ o("div", { className: "flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden", children: r.map((i, l) => {
      const a = n === "diverging" ? i * Math.max(Math.abs(e), Math.abs(t)) : e + i * s;
      return /* @__PURE__ */ o("div", { className: "flex-1", style: { backgroundColor: Nr(a, e, t, n) } }, l);
    }) }),
    /* @__PURE__ */ o("span", { className: "tabular-nums", children: Ge(t) })
  ] });
}
function pl(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e, n = Array.isArray(t.rows) ? t.rows.map(String) : null, r = Array.isArray(t.columns) ? t.columns.map(String) : null, s = Array.isArray(t.cells) ? t.cells : null;
  if (!n || !r || !s) return null;
  const i = s.map((d) => {
    const f = d;
    return {
      row: Number(f.row ?? 0),
      col: Number(f.col ?? 0),
      value: Number(f.value ?? 0),
      label: f.label != null ? String(f.label) : void 0
    };
  }).filter((d) => d.row >= 0 && d.row < n.length && d.col >= 0 && d.col < r.length);
  if (i.length === 0) return null;
  const l = i.map((d) => d.value), a = typeof t.min == "number" ? t.min : Math.min(...l), u = typeof t.max == "number" ? t.max : Math.max(...l), c = t.scale === "diverging" ? "diverging" : "sequential";
  return { rows: n, columns: r, cells: i, min: a, max: u, scale: c };
}
function ke(e, t, n) {
  return Math.round(e + (t - e) * n);
}
function Nr(e, t, n, r) {
  if (n === t) return "rgb(63 63 70)";
  if (r === "diverging") {
    const i = Math.max(Math.abs(t), Math.abs(n)) || 1, l = Math.max(-1, Math.min(1, e / i));
    if (l >= 0)
      return `rgb(${ke(39, 16, l)} ${ke(39, 185, l)} ${ke(42, 129, l)})`;
    const a = -l;
    return `rgb(${ke(39, 239, a)} ${ke(39, 68, a)} ${ke(42, 68, a)})`;
  }
  const s = Math.max(0, Math.min(1, (e - t) / (n - t)));
  return `rgb(${ke(39, 14, s)} ${ke(39, 165, s)} ${ke(42, 233, s)})`;
}
function hl(e) {
  return Math.abs(e) < 1 ? e.toFixed(2) : Math.abs(e) < 100 ? e.toFixed(1) : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : Math.round(e).toString();
}
const bl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Heatmap: fl
}, Symbol.toStringTag, { value: "Module" })), gl = {
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
function xl({ data: e, options: t }) {
  const n = L(() => yl(e), [e]), r = t?.filter === !0, [s, i] = v(""), l = L(() => {
    if (!n) return null;
    if (!s.trim()) return n;
    const a = s.toLowerCase();
    return n.filter(
      (u) => u.label.toLowerCase().includes(a) || (u.body?.toLowerCase().includes(a) ?? !1) || (u.source?.toLowerCase().includes(a) ?? !1) || (u.tags?.some((c) => c.toLowerCase().includes(a)) ?? !1)
    );
  }, [n, s]);
  return !n || n.length === 0 ? /* @__PURE__ */ o(D, { children: "No events" }) : /* @__PURE__ */ m("div", { className: "h-full flex flex-col", children: [
    r && /* @__PURE__ */ o(
      "input",
      {
        type: "text",
        placeholder: "Filter events…",
        value: s,
        onChange: (a) => i(a.target.value),
        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 mb-2 shrink-0"
      }
    ),
    /* @__PURE__ */ m("div", { className: "flex-1 overflow-auto min-h-0", children: [
      l.length === 0 && /* @__PURE__ */ o("div", { className: "flex items-center justify-center h-full text-zinc-500 text-xs", children: "No matches" }),
      l.map((a, u) => /* @__PURE__ */ m("div", { className: "flex gap-3 px-1 py-2.5 border-b border-zinc-800 last:border-0", children: [
        /* @__PURE__ */ o("div", { className: "flex flex-col items-center pt-1.5 shrink-0", children: /* @__PURE__ */ o("span", { className: `w-2 h-2 rounded-full ${gl[a.status ?? ""] ?? "bg-zinc-600"}` }) }),
        /* @__PURE__ */ m("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ m("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ o("span", { className: "text-xs text-zinc-500 tabular-nums shrink-0 font-mono", children: a.timestamp }),
            /* @__PURE__ */ o("span", { className: "text-sm text-zinc-100 truncate", children: a.label })
          ] }),
          a.body && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-400 mt-0.5 line-clamp-2", children: a.body }),
          (a.source || a.tags && a.tags.length > 0) && /* @__PURE__ */ m("div", { className: "flex items-center gap-2 mt-1 text-[10px] text-zinc-500 flex-wrap", children: [
            a.source && /* @__PURE__ */ o("span", { className: "text-zinc-500", children: a.source }),
            a.tags?.map((c, d) => /* @__PURE__ */ o("span", { className: "px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400", children: c }, d))
          ] })
        ] })
      ] }, u))
    ] })
  ] });
}
function yl(e) {
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
const vl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Events: xl
}, Symbol.toStringTag, { value: "Module" })), wl = "medallion.terminal.v1.TerminalService", kl = {
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
function Nl() {
  const { backendUrl: e } = ae(), [t, n] = v(null), [r, s] = v(!0), [i, l] = v(null);
  if (R(() => {
    if (!e) {
      s(!1), n(null);
      return;
    }
    s(!0), l(null);
    const u = new AbortController();
    return fetch(`${e.replace(/\/$/, "")}/${wl}/ListSources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      signal: u.signal
    }).then((c) => c.ok ? c.json() : Promise.reject(new Error(`HTTP ${c.status}`))).then((c) => n(c.sources ?? [])).catch((c) => {
      c.name !== "AbortError" && l(c.message);
    }).finally(() => s(!1)), () => u.abort();
  }, [e]), !e) return /* @__PURE__ */ o(D, { padded: !0, children: "No backendUrl configured on Dashboard" });
  if (r) return /* @__PURE__ */ o(D, { padded: !0, children: "Loading catalog…" });
  if (i) return /* @__PURE__ */ m(D, { padded: !0, children: [
    "Failed to load: ",
    i
  ] });
  if (!t || t.length === 0) return /* @__PURE__ */ o(D, { padded: !0, children: "No sources registered" });
  const a = {};
  for (const u of t) {
    const c = u.shape && kl[u.shape] || "other";
    a[c] || (a[c] = []), a[c].push(u);
  }
  return /* @__PURE__ */ o("div", { className: "h-full overflow-auto pr-1", children: Object.entries(a).map(([u, c]) => /* @__PURE__ */ m("div", { className: "mb-4 last:mb-0", children: [
    /* @__PURE__ */ m("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5", children: [
      u,
      " ",
      /* @__PURE__ */ m("span", { className: "text-zinc-700", children: [
        "— ",
        c.length
      ] })
    ] }),
    c.map((d) => /* @__PURE__ */ m("div", { className: "py-2 border-b border-zinc-800/60 last:border-0", children: [
      /* @__PURE__ */ m("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
        /* @__PURE__ */ o("span", { className: "text-sm text-zinc-100 font-mono", children: d.id }),
        d.streamable && /* @__PURE__ */ o("span", { className: "text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded", children: "live" }),
        d.name && /* @__PURE__ */ m("span", { className: "text-xs text-zinc-400", children: [
          "— ",
          d.name
        ] })
      ] }),
      d.description && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-500 mt-0.5", children: d.description }),
      d.params && d.params.length > 0 && /* @__PURE__ */ m("div", { className: "text-[10px] text-zinc-500 mt-1 font-mono", children: [
        "params:",
        " ",
        d.params.map((f) => f.required ? `${f.key}*` : f.key).join(", ")
      ] }),
      d.tags && d.tags.length > 0 && /* @__PURE__ */ o("div", { className: "flex gap-1 mt-1 flex-wrap", children: d.tags.map((f) => /* @__PURE__ */ o("span", { className: "text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400", children: f }, f)) })
    ] }, d.id))
  ] }, u)) });
}
const Sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Catalog: Nl
}, Symbol.toStringTag, { value: "Module" })), pn = 10;
function zl({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => Al(e), [e]), s = t?.price_context, i = s ? (p, g) => {
    n(s.key, String(p)), s.side_key && n(s.side_key, g === "bid" ? "buy" : "sell");
  } : void 0;
  if (!r) return /* @__PURE__ */ o(D, { children: "No data" });
  const l = r.bids[0]?.price, a = r.asks[0]?.price, u = r.mid ?? (l != null && a != null ? (l + a) / 2 : 0), c = r.spread ?? (l != null && a != null ? a - l : 0), d = r.bids.slice(0, pn), f = r.asks.slice(0, pn).reverse(), h = Math.max(...r.bids.map((p) => p.size), ...r.asks.map((p) => p.size), 1);
  return /* @__PURE__ */ m("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ m("div", { className: "grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800", children: [
      /* @__PURE__ */ o("span", { children: "Price" }),
      /* @__PURE__ */ o("span", { className: "text-right", children: "Size" }),
      /* @__PURE__ */ o("span", { className: "text-right", children: "Cum" })
    ] }),
    /* @__PURE__ */ m("div", { className: "flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ o("div", { className: "flex-1 overflow-auto", children: f.map((p, g) => {
        const b = f.slice(g).reduce((w, A) => w + A.size, 0);
        return /* @__PURE__ */ o(hn, { side: "ask", level: p, cum: b, maxSize: h, onPrice: i }, `ask-${g}`);
      }) }),
      /* @__PURE__ */ m("div", { className: "border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ o("span", { className: "text-zinc-200 tabular-nums", children: Ft(u) }),
        /* @__PURE__ */ m("span", { className: "text-zinc-500 text-[10px]", children: [
          "spread ",
          Ft(c)
        ] })
      ] }),
      /* @__PURE__ */ o("div", { className: "flex-1 overflow-auto", children: d.map((p, g) => {
        const b = d.slice(0, g + 1).reduce((w, A) => w + A.size, 0);
        return /* @__PURE__ */ o(hn, { side: "bid", level: p, cum: b, maxSize: h, onPrice: i }, `bid-${g}`);
      }) })
    ] }),
    r.venue && /* @__PURE__ */ o("div", { className: "text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0", children: r.venue })
  ] });
}
function hn({
  side: e,
  level: t,
  cum: n,
  maxSize: r,
  onPrice: s
}) {
  const i = t.size / r * 100, l = e === "bid" ? "bg-emerald-500/10" : "bg-red-500/10", a = e === "bid" ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ m(
    "div",
    {
      onClick: s ? () => s(t.price, e) : void 0,
      className: `relative grid grid-cols-3 gap-2 px-2 py-0.5 ${s ? "cursor-pointer hover:bg-zinc-800/40" : ""}`,
      children: [
        /* @__PURE__ */ o("div", { className: `absolute inset-y-0 right-0 ${l}`, style: { width: `${i}%` } }),
        /* @__PURE__ */ o("span", { className: `relative ${a} tabular-nums`, children: Ft(t.price) }),
        /* @__PURE__ */ o("span", { className: "relative text-right text-zinc-200 tabular-nums", children: gn(t.size) }),
        /* @__PURE__ */ o("span", { className: "relative text-right text-zinc-500 tabular-nums", children: gn(n) })
      ]
    }
  );
}
function Al(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = bn(t.bids), r = bn(t.asks);
  return n.length === 0 && r.length === 0 ? null : {
    bids: n,
    asks: r,
    mid: typeof t.mid == "number" ? t.mid : void 0,
    spread: typeof t.spread == "number" ? t.spread : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0
  };
}
function bn(e) {
  return Array.isArray(e) ? e.map((t) => {
    const n = t;
    return { price: Number(n.price ?? 0), size: Number(n.size ?? 0) };
  }).filter((t) => Number.isFinite(t.price) && Number.isFinite(t.size) && t.size > 0) : [];
}
function Ft(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(2);
}
function gn(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const _l = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  OrderBook: zl
}, Symbol.toStringTag, { value: "Module" })), Tl = 6;
function $l({ data: e, options: t }) {
  const { setCtx: n } = ae(), r = L(() => Cl(e), [e]), s = L(
    () => r ? [...r.rows].sort((c, d) => c.key - d.key) : [],
    [r]
  );
  if (!r) return /* @__PURE__ */ o(D, { children: "No data" });
  const i = r.subject_value, l = s.length >= 2 ? s[1].key - s[0].key : 0, a = r.measures, u = t?.row_context;
  return /* @__PURE__ */ m("div", { className: "h-full flex flex-col text-xs", children: [
    /* @__PURE__ */ m("div", { className: "px-3 py-2 border-b border-zinc-800 flex items-baseline gap-3 flex-wrap shrink-0", children: [
      /* @__PURE__ */ o("span", { className: "text-zinc-100 font-medium", children: r.subject }),
      r.dimension && /* @__PURE__ */ o("span", { className: "text-zinc-500", children: r.dimension }),
      i != null && /* @__PURE__ */ o("span", { className: "text-zinc-300 tabular-nums", children: i.toLocaleString() }),
      r.venue && /* @__PURE__ */ o("span", { className: "ml-auto text-zinc-500 text-[10px] uppercase tracking-wider", children: r.venue })
    ] }),
    /* @__PURE__ */ o("div", { className: "flex-1 overflow-auto min-h-0", children: /* @__PURE__ */ m("table", { className: "w-full font-mono tabular-nums", children: [
      /* @__PURE__ */ m("thead", { className: "sticky top-0 bg-zinc-900 z-10", children: [
        /* @__PURE__ */ m("tr", { className: "text-[10px] text-zinc-600 border-b border-zinc-800/60", children: [
          /* @__PURE__ */ o("th", { colSpan: a.length, className: "text-center py-1 text-emerald-400 uppercase tracking-wider", children: r.left_label }),
          /* @__PURE__ */ o("th", { className: "bg-zinc-950" }),
          /* @__PURE__ */ o("th", { colSpan: a.length, className: "text-center py-1 text-red-400 uppercase tracking-wider", children: r.right_label })
        ] }),
        /* @__PURE__ */ m("tr", { className: "text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800", children: [
          a.map((c) => /* @__PURE__ */ o("th", { className: "text-right px-2 py-1.5", children: c.label }, `l-${c.key}`)),
          /* @__PURE__ */ o("th", { className: "text-center px-2 py-1.5 bg-zinc-950", children: r.key_label }),
          a.map((c) => /* @__PURE__ */ o("th", { className: "text-right px-2 py-1.5", children: c.label }, `r-${c.key}`))
        ] })
      ] }),
      /* @__PURE__ */ o("tbody", { children: s.map((c, d) => {
        const f = i != null && l > 0 && Math.abs(c.key - i) < l, h = !!u;
        return /* @__PURE__ */ m(
          "tr",
          {
            onClick: h ? () => n(u.key, String(c.key)) : void 0,
            className: `border-b border-zinc-800/40 ${`${f ? "bg-zinc-800/40" : "hover:bg-zinc-800/20"} ${h ? "cursor-pointer" : ""}`}`,
            children: [
              a.map((g) => /* @__PURE__ */ o("td", { className: "text-right px-2 py-1 text-zinc-300", children: yn(c.left?.values?.[g.key], g.format) }, `l-${g.key}`)),
              /* @__PURE__ */ o("td", { className: `text-center px-2 py-1 font-medium ${f ? "text-zinc-100 bg-zinc-950/60" : "text-zinc-300 bg-zinc-950/40"}`, children: c.key.toLocaleString() }),
              a.map((g) => /* @__PURE__ */ o("td", { className: "text-right px-2 py-1 text-zinc-300", children: yn(c.right?.values?.[g.key], g.format) }, `r-${g.key}`))
            ]
          },
          d
        );
      }) })
    ] }) })
  ] });
}
function Cl(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e;
  if (!Array.isArray(t.rows) || t.rows.length === 0) return null;
  const n = t.rows.map((i) => {
    const l = i;
    return {
      // Accept legacy options shape (`strike`/`call`/`put`) so authored
      // fixtures keep rendering during migration.
      key: Number(l.key ?? l.strike ?? 0),
      left: xn(l.left ?? l.call),
      right: xn(l.right ?? l.put)
    };
  }), r = El(t.measures), s = r.length > 0 ? r : Ol(n);
  return {
    subject: String(t.subject ?? t.underlying ?? ""),
    dimension: typeof t.dimension == "string" ? t.dimension : typeof t.expiry == "string" ? t.expiry : void 0,
    subject_value: typeof t.subject_value == "number" ? t.subject_value : typeof t.underlying_price == "number" ? t.underlying_price : void 0,
    venue: typeof t.venue == "string" ? t.venue : void 0,
    rows: n,
    left_label: String(t.left_label ?? "Left"),
    right_label: String(t.right_label ?? "Right"),
    key_label: String(t.key_label ?? "Key"),
    measures: s
  };
}
function El(e) {
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
function Ol(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of [n.left, n.right])
      if (r?.values) for (const s of Object.keys(r.values)) t.add(s);
  return Array.from(t).slice(0, Tl).map((n) => ({ key: n, label: n }));
}
function xn(e) {
  if (!e || typeof e != "object") return;
  const t = e;
  if (t.values && typeof t.values == "object" && !Array.isArray(t.values)) {
    const r = {};
    for (const [s, i] of Object.entries(t.values))
      typeof i == "number" && (r[s] = i);
    return Object.keys(r).length === 0 ? void 0 : { values: r };
  }
  const n = {};
  for (const [r, s] of Object.entries(t))
    typeof s == "number" && (n[r] = s);
  return Object.keys(n).length === 0 ? void 0 : { values: n };
}
function yn(e, t) {
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
const Ml = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PairedGrid: $l
}, Symbol.toStringTag, { value: "Module" })), Rl = /* @__PURE__ */ new Set([
  "ACTION_STATUS_OK",
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]), jl = /* @__PURE__ */ new Set([
  "ACTION_STATUS_REJECTED",
  "ACTION_STATUS_FAILED",
  "ACTION_STATUS_CANCELLED"
]);
function dt(e) {
  return !!e && Rl.has(e);
}
function vn(e) {
  return !!e && jl.has(e);
}
const Il = 64;
function Ll(e, t) {
  const [n, r] = v([]), [s, i] = v(!1), [l, a] = v(null);
  return R(() => {
    if (!e || !t || !!!(t.clientRequestId || t.id || t.actionId)) return;
    r([]), i(!1), a(null);
    const c = new AbortController();
    let d = !1;
    return (async () => {
      try {
        const f = await fetch(ws(e), {
          method: "POST",
          headers: { "Content-Type": Kn },
          body: JSON.stringify(ks(t)),
          signal: c.signal
        });
        if (!f.ok) throw new Error(`WatchAction: HTTP ${f.status}`);
        if (!f.body) throw new Error("WatchAction: no response body");
        const h = f.body.getReader();
        await Hn(h, {
          onMessage: (p) => {
            const g = p;
            r((b) => b.length >= Il ? [...b.slice(1), g] : [...b, g]), dt(g.status) && i(!0);
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
      } catch (f) {
        !d && f instanceof Error && f.name !== "AbortError" && (a(f.message), i(!0));
      } finally {
        d || i(!0);
      }
    })(), () => {
      d = !0, c.abort();
    };
  }, [e, t?.clientRequestId, t?.id, t?.actionId]), {
    updates: n,
    latest: n.length > 0 ? n[n.length - 1] : null,
    done: s,
    error: l
  };
}
function Pl({ options: e }) {
  const t = e ?? {}, { ctx: n, toast: r, backendUrl: s, emit: i } = ae(), l = t.symbol ?? n.symbol ?? "", a = t.url, u = t.action_id ?? "place_order", c = s ? "connect" : a ? "url" : null, [d, f] = v("buy"), [h, p] = v(""), [g, b] = v(""), w = U(n.price);
  R(() => {
    n.price !== w.current && (w.current = n.price, n.price != null && b(n.price));
  }, [n.price]);
  const A = U(n.side);
  R(() => {
    n.side !== A.current && (A.current = n.side, (n.side === "buy" || n.side === "sell") && f(n.side));
  }, [n.side]);
  const [$, j] = v(!1), [E, x] = v(null), [T, O] = v(null), [I, G] = v(!1), [Z, X] = v(null), Y = Ll(c === "connect" ? s : void 0, Z);
  R(() => {
    if (!Y.latest) return;
    const z = Y.latest;
    z.message && x(z.message);
    const H = dt(z.status);
    i({
      type: "action",
      actionId: z.action_id ?? u,
      clientRequestId: z.client_request_id ?? "",
      status: String(z.status ?? ""),
      message: z.message,
      terminal: H
    }), H && (z.message && r(z.message, vn(z.status) ? "error" : "ok"), X(null));
  }, [Y.latest, r, i, u]), R(() => {
    I && G(!1);
  }, [h, g, d]);
  const P = ce(async () => {
    if (!c || $) return;
    const z = Number(h);
    if (!Number.isFinite(z) || z <= 0) {
      O("Amount must be a positive number");
      return;
    }
    const H = g ? Number(g) : void 0;
    if (g && (!Number.isFinite(H) || H <= 0)) {
      O("Price must be positive");
      return;
    }
    if (t.confirm && !I) {
      G(!0), O(null), x(null);
      return;
    }
    const ee = {
      symbol: l,
      side: d,
      amount: z,
      type: H == null ? "market" : "limit",
      ...H != null && { price: H }
    };
    j(!0), O(null), x(null);
    const Q = Jn();
    try {
      const oe = c === "connect" ? await fetch(Gn(s), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Vn({ actionId: u, params: ee, clientRequestId: Q }))
      }) : await fetch(a, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": Q },
        body: JSON.stringify(ee)
      });
      if (!oe.ok) throw new Error(`HTTP ${oe.status}`);
      const y = await oe.json().catch(() => ({})), k = typeof y.message == "string" ? y.message : "Order submitted", _ = typeof y.status == "string" ? y.status : "";
      i({
        type: "action",
        actionId: u,
        clientRequestId: Q,
        status: _,
        message: k,
        terminal: dt(_)
      }), vn(y.status) ? (O(k), r(k, "error")) : (x(k), r(k, "ok"), p(""), b(""), G(!1)), c === "connect" && !dt(y.status) && X({ clientRequestId: Q });
    } catch (oe) {
      const y = oe instanceof Error ? oe.message : "Submit failed";
      O(y), r(y, "error"), i({
        type: "action",
        actionId: u,
        clientRequestId: Q,
        status: "ACTION_STATUS_FAILED",
        message: y,
        terminal: !0
      });
    } finally {
      j(!1);
    }
  }, [c, s, a, u, $, h, g, l, d, t.confirm, I, r, i]);
  if (R(() => {
    if (!I) return;
    const z = (H) => {
      H.key === "Escape" && G(!1);
    };
    return document.addEventListener("keydown", z), () => document.removeEventListener("keydown", z);
  }, [I]), !c)
    return /* @__PURE__ */ o(D, { children: "Trade requires backendUrl or options.url" });
  const K = (z) => `flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${d === z ? z === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400" : "text-zinc-500 hover:text-zinc-300"}`, q = d === "buy" ? "bg-emerald-500/80 hover:bg-emerald-500 text-zinc-900" : "bg-red-500/80 hover:bg-red-500 text-zinc-900";
  if (I) {
    const z = g ? Number(g) : null, H = `${d.toUpperCase()} ${h}${t.quote_unit ? ` ${t.quote_unit}` : ""} ${z ? `@ ${z.toLocaleString()}` : "at market"}`;
    return /* @__PURE__ */ m("div", { className: "flex flex-col gap-2 h-full justify-center", children: [
      /* @__PURE__ */ o("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: "Confirm" }),
      /* @__PURE__ */ o("div", { className: `text-sm font-medium ${d === "buy" ? "text-emerald-300" : "text-red-300"}`, children: H }),
      l && /* @__PURE__ */ o("div", { className: "text-xs text-zinc-500", children: l }),
      /* @__PURE__ */ m("div", { className: "flex gap-2 mt-1", children: [
        /* @__PURE__ */ o(
          "button",
          {
            onClick: () => G(!1),
            className: "flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ o(
          "button",
          {
            onClick: P,
            disabled: $,
            className: `flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-30 ${q}`,
            children: $ ? "..." : "Confirm"
          }
        )
      ] }),
      T && /* @__PURE__ */ o("div", { className: "text-xs text-red-400", children: T })
    ] });
  }
  return /* @__PURE__ */ m("div", { className: "flex flex-col gap-2 h-full", children: [
    /* @__PURE__ */ m("div", { className: "flex gap-1 bg-zinc-950 rounded p-1", children: [
      /* @__PURE__ */ o("button", { onClick: () => f("buy"), className: K("buy"), children: "Buy" }),
      /* @__PURE__ */ o("button", { onClick: () => f("sell"), className: K("sell"), children: "Sell" })
    ] }),
    l && /* @__PURE__ */ m("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: [
      l,
      t.available != null && /* @__PURE__ */ m("span", { className: "ml-2 text-zinc-400 normal-case", children: [
        "avail ",
        /* @__PURE__ */ o("span", { className: "tabular-nums text-zinc-200", children: t.available.toLocaleString() }),
        t.quote_unit && /* @__PURE__ */ o("span", { className: "ml-1", children: t.quote_unit })
      ] })
    ] }),
    /* @__PURE__ */ o(
      wn,
      {
        label: "Amount",
        unit: t.quote_unit,
        value: h,
        onChange: p,
        disabled: $
      }
    ),
    t.quick_amounts && t.quick_amounts.length > 0 && t.available != null && /* @__PURE__ */ o("div", { className: "flex gap-1", children: t.quick_amounts.map((z, H) => {
      const Q = (t.available * z).toFixed(6).replace(/\.?0+$/, "");
      return /* @__PURE__ */ m(
        "button",
        {
          onClick: () => p(Q),
          disabled: $,
          className: "flex-1 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-zinc-100 bg-zinc-800/60 hover:bg-zinc-800 rounded py-1 disabled:opacity-30",
          title: `${(z * 100).toFixed(0)}% of available`,
          children: [
            (z * 100).toFixed(0),
            "%"
          ]
        },
        H
      );
    }) }),
    /* @__PURE__ */ o(
      wn,
      {
        label: "Price",
        placeholder: "market",
        value: g,
        onChange: b,
        disabled: $
      }
    ),
    /* @__PURE__ */ o(
      "button",
      {
        onClick: P,
        disabled: $ || !h,
        className: `mt-1 py-2 rounded text-sm font-semibold uppercase tracking-wider disabled:opacity-30 ${q}`,
        children: $ ? "..." : d === "buy" ? `Buy ${t.quote_unit ?? ""}`.trim() : `Sell ${t.quote_unit ?? ""}`.trim()
      }
    ),
    E && /* @__PURE__ */ o("div", { className: "text-xs text-emerald-400", children: E }),
    T && /* @__PURE__ */ o("div", { className: "text-xs text-red-400", children: T })
  ] });
}
function wn({
  label: e,
  unit: t,
  placeholder: n,
  value: r,
  onChange: s,
  disabled: i
}) {
  return /* @__PURE__ */ m("div", { className: "flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 focus-within:border-zinc-500", children: [
    /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500 w-12 shrink-0", children: e }),
    /* @__PURE__ */ o(
      "input",
      {
        type: "number",
        inputMode: "decimal",
        placeholder: n ?? "0.00",
        value: r,
        onChange: (l) => s(l.target.value),
        disabled: i,
        className: "flex-1 bg-transparent outline-none text-right text-sm text-zinc-100 tabular-nums disabled:opacity-50"
      }
    ),
    t && /* @__PURE__ */ o("span", { className: "text-xs text-zinc-500 shrink-0", children: t })
  ] });
}
const Dl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Trade: Pl
}, Symbol.toStringTag, { value: "Module" })), Fl = {
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
}, Ul = "border-zinc-700 text-zinc-300";
function Bl({ data: e, options: t }) {
  const n = L(() => Kl(e), [e]);
  if (!n || n.length === 0)
    return /* @__PURE__ */ o(D, { children: "No items" });
  const s = Math.max(5, (t ?? {}).speed_seconds ?? 30);
  return /* @__PURE__ */ o("div", { className: "h-full overflow-hidden flex items-center group", children: /* @__PURE__ */ m(
    "div",
    {
      className: "flex items-center gap-2 shrink-0 motion-safe:animate-[marquee_30s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]",
      style: { animationDuration: `${s}s` },
      children: [
        n.map((i, l) => /* @__PURE__ */ o(kn, { item: i }, `a-${l}`)),
        n.map((i, l) => /* @__PURE__ */ o(kn, { item: i, "aria-hidden": !0 }, `b-${l}`))
      ]
    }
  ) });
}
function kn({ item: e, ...t }) {
  const n = Fl[e.status ?? ""] ?? Ul;
  return /* @__PURE__ */ m(
    "div",
    {
      ...t,
      className: `shrink-0 px-2.5 py-1 rounded border bg-zinc-900/40 text-xs flex items-center gap-2 font-mono ${n}`,
      children: [
        /* @__PURE__ */ o("span", { className: "text-[10px] text-zinc-500 tabular-nums", children: e.timestamp }),
        /* @__PURE__ */ o("span", { children: e.label })
      ]
    }
  );
}
function Kl(e) {
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
const Hl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Ticker: Bl
}, Symbol.toStringTag, { value: "Module" }));
function Wl({ data: e }) {
  const t = L(() => ql(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ o(D, { children: "No data" });
  const n = Math.max(...t.map((r) => r.volume), 1);
  return /* @__PURE__ */ o("div", { className: "h-full overflow-auto", children: /* @__PURE__ */ o("div", { className: "flex flex-col gap-px font-mono text-[10px]", children: t.map((r, s) => {
    const i = r.volume / n * 100;
    return /* @__PURE__ */ m("div", { className: "relative flex items-center px-2 py-0.5", title: `${r.price} — ${r.volume.toLocaleString()}`, children: [
      /* @__PURE__ */ o(
        "div",
        {
          className: "absolute inset-y-0.5 left-16 bg-sky-500/20 rounded-sm",
          style: { width: `${i}%`, maxWidth: "calc(100% - 4.5rem)" }
        }
      ),
      /* @__PURE__ */ o("span", { className: "relative w-14 shrink-0 text-zinc-300 tabular-nums", children: Gl(r.price) }),
      /* @__PURE__ */ o("span", { className: "relative ml-auto text-zinc-400 tabular-nums", children: Vl(r.volume) })
    ] }, s);
  }) }) });
}
function ql(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.rows) ? t = r.rows : Array.isArray(r.levels) && (t = r.levels);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const s = r;
    return { price: Number(s.price ?? 0), volume: Number(s.volume ?? s.size ?? 0) };
  }).filter((r) => Number.isFinite(r.price) && Number.isFinite(r.volume) && r.volume > 0);
  return n.length === 0 ? null : (n.sort((r, s) => s.price - r.price), n);
}
function Gl(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 0 }) : e.toFixed(2);
}
function Vl(e) {
  return Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(2) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(0);
}
const Jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VolumeProfile: Wl
}, Symbol.toStringTag, { value: "Module" }));
function Xl({ data: e }) {
  const t = L(() => Ql(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ o(D, { children: "No data" }) : /* @__PURE__ */ o("div", { className: "h-full overflow-x-auto overflow-y-hidden", children: /* @__PURE__ */ o("div", { className: "flex items-stretch gap-3 h-full", children: t.map((n, r) => /* @__PURE__ */ o(Yl, { stat: n }, r)) }) });
}
function Yl({ stat: e }) {
  const t = kr(e.value), n = e.delta == null ? "" : e.delta >= 0 ? "text-emerald-400" : "text-red-400";
  return /* @__PURE__ */ m("div", { className: "shrink-0 min-w-[120px] max-w-[180px] flex flex-col justify-center px-3 py-1 border-l border-zinc-800 first:border-l-0", children: [
    /* @__PURE__ */ o("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 truncate", children: e.label }),
    /* @__PURE__ */ m("div", { className: "flex items-baseline gap-1", children: [
      /* @__PURE__ */ o("span", { className: "text-base font-semibold text-zinc-100 tabular-nums truncate", children: gr(t) }),
      e.unit && /* @__PURE__ */ o("span", { className: "text-[10px] text-zinc-500 shrink-0", children: e.unit })
    ] }),
    /* @__PURE__ */ m("div", { className: "flex items-center gap-2", children: [
      e.delta != null && /* @__PURE__ */ m("span", { className: `text-[10px] font-medium tabular-nums ${n}`, children: [
        e.delta >= 0 ? "▲" : "▼",
        " ",
        ea(e.delta)
      ] }),
      e.trend && e.trend.length >= 2 && /* @__PURE__ */ o(Zl, { values: e.trend })
    ] })
  ] });
}
function Zl({ values: e }) {
  const t = Math.min(...e), r = Math.max(...e) - t || 1, s = e[e.length - 1] >= e[0], i = e.map((l, a) => {
    const u = a / (e.length - 1) * 100, c = 18 - (l - t) / r * 16 - 1;
    return `${u.toFixed(1)},${c.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ o("svg", { viewBox: "0 0 100 18", className: "w-12 h-3.5", preserveAspectRatio: "none", children: /* @__PURE__ */ o(
    "polyline",
    {
      fill: "none",
      stroke: s ? "#10b981" : "#ef4444",
      strokeWidth: "1.5",
      points: i,
      vectorEffect: "non-scaling-stroke"
    }
  ) });
}
function Ql(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.stats) ? t = r.stats : Array.isArray(r.metrics) && (t = r.metrics);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const s = r;
    return {
      label: String(s.label ?? ""),
      value: Number(s.value ?? 0),
      delta: typeof s.delta == "number" ? s.delta : void 0,
      unit: s.unit != null ? String(s.unit) : void 0,
      trend: Array.isArray(s.trend) && s.trend.every((i) => typeof i == "number") ? s.trend : void 0
    };
  }).filter((r) => Number.isFinite(r.value));
  return n.length > 0 ? n : null;
}
function ea(e) {
  const t = Math.abs(e) <= 1 ? e * 100 : e;
  return `${Math.abs(t).toFixed(2)}%`;
}
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StatStrip: Xl
}, Symbol.toStringTag, { value: "Module" }));
function na(e) {
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
const Nn = "var(--mtc-grid)", ot = "var(--mtc-border)", it = "var(--mtc-muted)", Sn = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function ra({ data: e }) {
  const t = L(() => na(e), [e]);
  if (!t)
    return /* @__PURE__ */ o(D, { children: "No data" });
  if (t.kind === "grouped") {
    const r = xr(t.series, de);
    return /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(jt, { data: t.rows, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
      /* @__PURE__ */ o(He, { strokeDasharray: "3 3", stroke: Nn }),
      /* @__PURE__ */ o(
        We,
        {
          dataKey: "label",
          stroke: ot,
          tick: { fontSize: 11, fill: it },
          interval: 0
        }
      ),
      /* @__PURE__ */ o(
        qe,
        {
          stroke: ot,
          tick: { fontSize: 11, fill: it },
          tickFormatter: zn,
          width: 50
        }
      ),
      /* @__PURE__ */ o(
        _e,
        {
          contentStyle: Te,
          cursor: { fill: Sn }
        }
      ),
      /* @__PURE__ */ o(Bn, { wrapperStyle: { fontSize: 11 } }),
      t.series.map((s, i) => /* @__PURE__ */ o(
        It,
        {
          dataKey: s,
          fill: r[i],
          radius: [2, 2, 0, 0]
        },
        s
      ))
    ] }) });
  }
  const n = t.bars;
  return /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(jt, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ o(He, { strokeDasharray: "3 3", stroke: Nn }),
    /* @__PURE__ */ o(
      We,
      {
        dataKey: "label",
        stroke: ot,
        tick: { fontSize: 11, fill: it },
        interval: 0
      }
    ),
    /* @__PURE__ */ o(
      qe,
      {
        stroke: ot,
        tick: { fontSize: 11, fill: it },
        tickFormatter: zn,
        width: 50
      }
    ),
    /* @__PURE__ */ o(
      _e,
      {
        contentStyle: Te,
        cursor: { fill: Sn }
      }
    ),
    /* @__PURE__ */ o(It, { dataKey: "value", radius: [2, 2, 0, 0], children: n.map((r, s) => /* @__PURE__ */ o(Un, { fill: sa(r) }, s)) })
  ] }) });
}
function sa(e) {
  return e.color && Ce[e.color] ? Ce[e.color] : e.color && e.color.startsWith("#") ? e.color : e.value < 0 ? "var(--mtc-danger)" : "var(--mtc-accent)";
}
function zn(e) {
  return typeof e != "number" ? String(e) : Math.abs(e) >= 1e9 ? (e / 1e9).toFixed(1) + "B" : Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(1) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(1) + "K" : e.toFixed(Number.isInteger(e) ? 0 : 1);
}
const oa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BarChart: ra
}, Symbol.toStringTag, { value: "Module" })), ia = "var(--mtc-grid)", An = "var(--mtc-border)", _n = "var(--mtc-muted)", la = "var(--mtc-muted-subtle)";
function aa({ data: e }) {
  const t = L(() => ca(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ o(D, { children: "No data" });
  const n = t.some((r) => r.size != null);
  return /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(Lr, { margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ o(He, { strokeDasharray: "3 3", stroke: ia }),
    /* @__PURE__ */ o(
      We,
      {
        type: "number",
        dataKey: "x",
        stroke: An,
        tick: { fontSize: 11, fill: _n }
      }
    ),
    /* @__PURE__ */ o(
      qe,
      {
        type: "number",
        dataKey: "y",
        stroke: An,
        tick: { fontSize: 11, fill: _n },
        width: 50
      }
    ),
    n && /* @__PURE__ */ o(Pr, { type: "number", dataKey: "size", range: [40, 280] }),
    /* @__PURE__ */ o(
      _e,
      {
        cursor: { strokeDasharray: "3 3", stroke: la },
        contentStyle: Te
      }
    ),
    /* @__PURE__ */ o(
      Dr,
      {
        data: t,
        fill: "var(--mtc-accent)",
        shape: (r) => {
          const { cx: s, cy: i, payload: l } = r;
          if (s == null || i == null || !l) return /* @__PURE__ */ o("circle", { cx: 0, cy: 0, r: 0 });
          const a = ua(l), c = l.size != null ? Math.min(20, Math.max(3, Math.sqrt(l.size) * 2)) : 5;
          return /* @__PURE__ */ o("g", { children: /* @__PURE__ */ o("circle", { cx: s, cy: i, r: c, fill: a, fillOpacity: 0.7, stroke: a, strokeWidth: 1, children: l.label && /* @__PURE__ */ o("title", { children: l.label }) }) });
        }
      }
    )
  ] }) });
}
function ca(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const r = e;
    Array.isArray(r.points) && (t = r.points);
  }
  if (!t) return null;
  const n = t.map((r) => {
    const s = r;
    return {
      x: Number(s.x ?? 0),
      y: Number(s.y ?? 0),
      label: s.label != null ? String(s.label) : void 0,
      size: typeof s.size == "number" ? s.size : void 0,
      color: s.color != null ? String(s.color) : void 0
    };
  }).filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));
  return n.length > 0 ? n : null;
}
function ua(e) {
  return e.color && Ce[e.color] ? Ce[e.color] : e.color && e.color.startsWith("#") ? e.color : "var(--mtc-accent)";
}
const da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Scatter: aa
}, Symbol.toStringTag, { value: "Module" })), fa = ["America/New_York", "Europe/London", "Asia/Singapore"];
function ma({ options: e }) {
  const t = e ?? {}, n = t.zones?.length ? t.zones : fa, r = t.format === "12h", [s, i] = v(() => /* @__PURE__ */ new Date());
  return R(() => {
    const l = setInterval(() => i(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(l);
  }, []), /* @__PURE__ */ o("div", { className: "h-full flex items-center justify-around gap-3", children: n.map((l) => {
    const a = ba(s, l, r), u = ga(s, l), c = ha(l), d = xa(l, s);
    return /* @__PURE__ */ m("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ m("div", { className: "text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5", children: [
        /* @__PURE__ */ o("span", { children: c }),
        /* @__PURE__ */ o("span", { className: `w-1.5 h-1.5 rounded-full ${d}` })
      ] }),
      /* @__PURE__ */ o("div", { className: "text-base font-semibold text-zinc-100 tabular-nums", children: a }),
      /* @__PURE__ */ o("div", { className: "text-[10px] text-zinc-600 tabular-nums", children: u })
    ] }, l);
  }) });
}
const pa = {
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
function ha(e) {
  return pa[e] ?? e.split("/").pop() ?? e;
}
function ba(e, t, n) {
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
function ga(e, t) {
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: t, timeZoneName: "shortOffset" }).formatToParts(e).find((i) => i.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}
function xa(e, t) {
  try {
    const n = new Intl.DateTimeFormat("en-US", { timeZone: e, hour: "2-digit", hour12: !1 }).format(t), r = Number(n);
    return Number.isFinite(r) ? r >= 9 && r < 17 ? "bg-emerald-500" : r === 8 || r === 17 ? "bg-amber-500" : "bg-zinc-700" : "bg-zinc-700";
  } catch {
    return "bg-zinc-700";
  }
}
const ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Clock: ma
}, Symbol.toStringTag, { value: "Module" }));
function va({ data: e }) {
  const t = L(() => Na(e), [e]);
  return !t || t.length === 0 ? /* @__PURE__ */ o(D, { children: "No data" }) : /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ o(
    Fr,
    {
      data: t,
      dataKey: "value",
      nameKey: "name",
      stroke: "#18181b",
      isAnimationActive: !1,
      content: /* @__PURE__ */ o(wa, {}),
      children: /* @__PURE__ */ o(
        _e,
        {
          contentStyle: Te,
          formatter: (n) => [String(n), ""]
        }
      )
    }
  ) });
}
function wa(e) {
  const { x: t = 0, y: n = 0, width: r = 0, height: s = 0, index: i = 0, name: l, payload: a } = e, u = ka(a, i), c = r > 60 && s > 24;
  return /* @__PURE__ */ m("g", { children: [
    /* @__PURE__ */ o("rect", { x: t, y: n, width: r, height: s, fill: u, fillOpacity: 0.85, stroke: "#18181b", strokeWidth: 2 }),
    c && l && /* @__PURE__ */ o("text", { x: t + 6, y: n + 16, fill: "#fafafa", fontSize: 11, style: { pointerEvents: "none" }, children: l })
  ] });
}
function ka(e, t) {
  return e ? e.color && Ce[e.color] ? Ce[e.color] : e.color && e.color.startsWith("#") ? e.color : de[t % de.length] : de[t % de.length];
}
function Na(e) {
  let t = null;
  if (Array.isArray(e)) t = e;
  else if (e && typeof e == "object") {
    const s = e;
    Array.isArray(s.slices) ? t = s.slices : Array.isArray(s.nodes) && (t = s.nodes);
  }
  if (!t) return null;
  const n = (s) => {
    if (!s || typeof s != "object") return null;
    const i = s, l = String(i.label ?? i.name ?? ""), a = typeof i.value == "number" ? i.value : void 0, u = i.color != null ? String(i.color) : void 0, c = Array.isArray(i.children) ? i.children : Array.isArray(i.slices) ? i.slices : null, d = c ? c.map(n).filter((f) => f != null) : void 0;
    return !d && (!Number.isFinite(a) || (a ?? 0) <= 0) ? null : { name: l, value: a, color: u, children: d };
  }, r = t.map(n).filter((s) => s != null);
  return r.length > 0 ? r : null;
}
const Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Treemap: va
}, Symbol.toStringTag, { value: "Module" }));
function za({ data: e }) {
  const { url: t, alt: n } = Aa(e);
  return t ? /* @__PURE__ */ o("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ o(
    "img",
    {
      src: t,
      alt: n,
      loading: "lazy",
      className: "max-w-full max-h-full object-contain"
    }
  ) }) : /* @__PURE__ */ o(D, { children: "No image" });
}
function Aa(e) {
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
const _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Image: za
}, Symbol.toStringTag, { value: "Module" }));
function Ta({ data: e, options: t }) {
  const { url: n, title: r, sandbox: s } = $a(e, t);
  return n ? /* @__PURE__ */ o(
    "iframe",
    {
      src: n,
      title: r,
      sandbox: s,
      loading: "lazy",
      className: "w-full h-full border-0 rounded"
    }
  ) : /* @__PURE__ */ o(D, { children: "No URL" });
}
function $a(e, t) {
  let n, r = "embed", s = fr;
  if (typeof e == "string")
    n = e;
  else if (e && typeof e == "object") {
    const i = e;
    typeof i.url == "string" && (n = i.url), typeof i.label == "string" ? r = i.label : typeof i.title == "string" && (r = i.title), typeof i.sandbox == "string" && (s = i.sandbox);
  }
  return t && (typeof t.url == "string" && !n && (n = t.url), typeof t.title == "string" && r === "embed" && (r = t.title), typeof t.sandbox == "string" && (s = t.sandbox)), { url: n, title: r, sandbox: s };
}
const Ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Iframe: Ta
}, Symbol.toStringTag, { value: "Module" })), Ea = 20, Oa = "var(--mtc-grid)", Tn = "var(--mtc-border)", $n = "var(--mtc-muted)", Ma = "color-mix(in oklab, var(--mtc-muted) 20%, transparent)";
function Ra({ data: e, options: t }) {
  const n = L(() => ja(e, t), [e, t]);
  return !n || n.length === 0 ? /* @__PURE__ */ o(D, { children: "No data" }) : /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(jt, { data: n, margin: { top: 8, right: 8, bottom: 4, left: 0 }, children: [
    /* @__PURE__ */ o(He, { strokeDasharray: "3 3", stroke: Oa }),
    /* @__PURE__ */ o(
      We,
      {
        dataKey: "bin",
        stroke: Tn,
        tick: { fontSize: 10, fill: $n },
        interval: "preserveStartEnd"
      }
    ),
    /* @__PURE__ */ o(
      qe,
      {
        stroke: Tn,
        tick: { fontSize: 11, fill: $n },
        allowDecimals: !1,
        width: 40
      }
    ),
    /* @__PURE__ */ o(
      _e,
      {
        contentStyle: Te,
        cursor: { fill: Ma }
      }
    ),
    /* @__PURE__ */ o(It, { dataKey: "count", fill: "var(--mtc-accent)", radius: [2, 2, 0, 0] })
  ] }) });
}
function ja(e, t) {
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null && "count" in e[0])
    return e.map((i) => {
      const l = i, a = typeof l.rangeStart == "number" ? l.rangeStart : 0, u = typeof l.rangeEnd == "number" ? l.rangeEnd : 0;
      return {
        bin: String(l.bin ?? ""),
        count: Number(l.count ?? 0),
        rangeStart: a,
        rangeEnd: u
      };
    }).filter((i) => Number.isFinite(i.count));
  let n = null, r = Ea;
  if (Array.isArray(e) && e.every((s) => typeof s == "number"))
    n = e;
  else if (e && typeof e == "object") {
    const s = e;
    Array.isArray(s.values) && s.values.every((i) => typeof i == "number") && (n = s.values), typeof s.bins == "number" && (r = s.bins);
  }
  return typeof t?.bins == "number" && (r = t.bins), !n || (n = n.filter((s) => Number.isFinite(s)), n.length === 0) ? null : Ia(n, r);
}
function Ia(e, t) {
  const n = Math.min(...e), r = Math.max(...e);
  if (n === r) return [{ bin: Ge(n), count: e.length, rangeStart: n, rangeEnd: r }];
  const s = (r - n) / t, i = Array.from({ length: t }, (l, a) => {
    const u = n + a * s, c = a === t - 1 ? r : u + s;
    return { bin: Ge((u + c) / 2), count: 0, rangeStart: u, rangeEnd: c };
  });
  for (const l of e) {
    let a = Math.floor((l - n) / s);
    a >= t && (a = t - 1), i[a].count += 1;
  }
  return i;
}
const La = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Histogram: Ra
}, Symbol.toStringTag, { value: "Module" }));
function Pa({ options: e }) {
  const t = typeof e?.label == "string" ? e.label : "";
  return /* @__PURE__ */ m("div", { className: "h-full flex items-center gap-3 px-1", children: [
    t && /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-[0.15em] text-zinc-500 shrink-0", children: t }),
    /* @__PURE__ */ o("div", { className: "flex-1 h-px bg-zinc-800" })
  ] });
}
const Da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Section: Pa
}, Symbol.toStringTag, { value: "Module" })), lt = ["#38bdf8", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"], Fa = "var(--mtc-grid)", Tt = "var(--mtc-border)", $t = "var(--mtc-muted)", Ua = "var(--mtc-surface)", Ba = ["timestamp", "date", "time", "datetime", "ts", "x", "t"];
function Ka({ data: e, options: t }) {
  const n = L(() => Wa(e), [e]), r = t?.brush === !0;
  if (!n) return /* @__PURE__ */ o(D, { children: "No data" });
  const s = n.keys.length > 1;
  return /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(Ur, { data: n.points, children: [
    /* @__PURE__ */ o(He, { strokeDasharray: "3 3", stroke: Fa }),
    /* @__PURE__ */ o(
      We,
      {
        dataKey: "_ts",
        stroke: Tt,
        tick: { fontSize: 11, fill: $t },
        tickFormatter: Ie
      }
    ),
    /* @__PURE__ */ o(
      qe,
      {
        stroke: Tt,
        tick: { fontSize: 11, fill: $t },
        tickFormatter: br,
        width: 50
      }
    ),
    /* @__PURE__ */ o(
      _e,
      {
        contentStyle: Te,
        labelStyle: { color: $t },
        labelFormatter: Ie
      }
    ),
    n.keys.map((i, l) => /* @__PURE__ */ o(
      Br,
      {
        type: "monotone",
        dataKey: i,
        stroke: lt[l % lt.length],
        fill: lt[l % lt.length],
        fillOpacity: 0.35,
        strokeWidth: 1.5,
        stackId: s ? "stack" : void 0
      },
      i
    )),
    r && n.points.length > 4 && /* @__PURE__ */ o(
      Fn,
      {
        dataKey: "_ts",
        height: 20,
        stroke: Tt,
        fill: Ua,
        travellerWidth: 6,
        tickFormatter: Ie
      }
    )
  ] }) });
}
function Ha(e) {
  for (const t of Ba) if (t in e) return t;
  return null;
}
function Wa(e) {
  if (!e) return null;
  if (Array.isArray(e) && e.length > 0 && typeof e[0] == "object" && e[0] !== null) {
    const t = e[0], n = Ha(t);
    if (!n) return null;
    const r = Object.keys(t).filter((i) => i !== n && typeof t[i] == "number");
    return r.length === 0 ? null : { points: e.map((i) => {
      const l = i, a = { _ts: l[n] };
      for (const u of r) a[u] = l[u];
      return a;
    }), keys: r };
  }
  if (typeof e == "object" && e !== null && "series" in e) {
    const t = e.series;
    if (!Array.isArray(t)) return null;
    const n = /* @__PURE__ */ new Map(), r = [];
    for (const s of t) {
      const i = s, l = String(i.name || i.label || `s${r.length}`);
      r.push(l);
      const a = i.data ?? i.points;
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
const qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AreaChart: Ka
}, Symbol.toStringTag, { value: "Module" })), Ga = 100;
function Va({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae(), s = t.min ?? 0, i = t.max ?? 100, l = t.step ?? 1, a = t.label ?? t.key ?? "value", u = (() => {
    if (t.key && n[t.key] != null) {
      const p = Number(n[t.key]);
      if (Number.isFinite(p)) return p;
    }
    return t.default != null ? t.default : s;
  })(), [c, d] = v(u), f = U(null);
  if (R(() => {
    if (!t.key) return;
    const p = n[t.key];
    if (p == null) return;
    const g = Number(p);
    Number.isFinite(g) && g !== c && d(g);
  }, [t.key, n[t.key ?? ""]]), !t.key)
    return /* @__PURE__ */ o(D, { children: "Slider requires options.key" });
  const h = (p) => {
    d(p), f.current && clearTimeout(f.current), f.current = setTimeout(() => {
      r(t.key, String(p));
    }, Ga);
  };
  return /* @__PURE__ */ m("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ m("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: a }),
      /* @__PURE__ */ m("span", { className: "text-sm font-semibold text-zinc-100 tabular-nums", children: [
        Ct(c, l),
        t.unit && /* @__PURE__ */ o("span", { className: "text-zinc-500 ml-1", children: t.unit })
      ] })
    ] }),
    /* @__PURE__ */ o(
      "input",
      {
        type: "range",
        min: s,
        max: i,
        step: l,
        value: c,
        onChange: (p) => h(Number(p.target.value)),
        className: "w-full accent-sky-500"
      }
    ),
    /* @__PURE__ */ m("div", { className: "flex justify-between text-[10px] text-zinc-600 tabular-nums", children: [
      /* @__PURE__ */ o("span", { children: Ct(s, l) }),
      /* @__PURE__ */ o("span", { children: Ct(i, l) })
    ] })
  ] });
}
function Ct(e, t) {
  const n = t >= 1 ? 0 : Math.min(4, -Math.floor(Math.log10(t)));
  return e.toFixed(n);
}
const Ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Slider: Va
}, Symbol.toStringTag, { value: "Module" }));
function Xa(e, t, n) {
  if (e !== void 0 && e !== "")
    return { current: e, shouldSync: !1 };
  const r = t || n[0]?.value || "";
  return { current: r, shouldSync: r !== "" };
}
function Ya({ data: e, options: t }) {
  const n = t ?? {}, { ctx: r, setCtx: s } = ae(), i = n.key, l = Za(e, n), a = i ? r[i] : void 0, { current: u, shouldSync: c } = Xa(a, n.default, l);
  return R(() => {
    i && c && s(i, u);
  }, [i, c, u, s]), i ? l.length === 0 ? /* @__PURE__ */ o(D, { children: "Select has no choices" }) : /* @__PURE__ */ m("div", { className: "flex flex-col h-full justify-center gap-1.5 px-2", children: [
    /* @__PURE__ */ o("label", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: n.label ?? n.key }),
    /* @__PURE__ */ o(
      "select",
      {
        value: u,
        onChange: (d) => s(n.key, d.target.value),
        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500",
        children: l.map((d) => /* @__PURE__ */ o("option", { value: d.value, children: d.label }, d.value))
      }
    )
  ] }) : /* @__PURE__ */ o(D, { children: "Select requires options.key" });
}
function Za(e, t) {
  const n = Qa(e);
  if (n.length > 0) {
    const r = t.value_field ?? "value", s = t.label_field ?? "label";
    return n.map((i) => {
      if (typeof i == "string") return { value: i, label: i };
      if (i && typeof i == "object") {
        const l = i, a = l[r];
        if (typeof a == "string") {
          const u = l[s];
          return { value: a, label: typeof u == "string" ? u : a };
        }
      }
      return null;
    }).filter((i) => i !== null);
  }
  return (t.choices ?? []).map(
    (r) => typeof r == "string" ? { value: r, label: r } : { value: r.value, label: r.label ?? r.value }
  );
}
function Qa(e) {
  if (Array.isArray(e)) return e;
  if (e && typeof e == "object") {
    const t = e;
    if (Array.isArray(t.rows)) return t.rows;
    if (Array.isArray(t.entries)) return t.entries;
  }
  return [];
}
const ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Select: Ya
}, Symbol.toStringTag, { value: "Module" })), Ne = { top: 12, right: 12, bottom: 28, left: 44 }, Cn = ["#0ea5e9", "#10b981", "#a78bfa", "#f59e0b", "#f472b6", "#fbbf24"];
function tc({ data: e }) {
  const t = L(() => rc(e), [e]);
  if (!t || t.length === 0)
    return /* @__PURE__ */ o(D, { children: "No data" });
  const n = t.flatMap((c) => [c.min, c.max, ...c.outliers]), r = Math.min(...n), s = Math.max(...n), i = (s - r) * 0.05 || 1, l = r - i, a = s + i, u = Array.from({ length: 5 }, (c, d) => l + (a - l) * d / 4);
  return /* @__PURE__ */ o("svg", { viewBox: "0 0 600 320", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ o(
    nc,
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
function nc({
  boxes: e,
  yMin: t,
  yMax: n,
  ticks: r,
  width: s,
  height: i
}) {
  const l = s - Ne.left - Ne.right, a = i - Ne.top - Ne.bottom, u = l / e.length, c = Math.min(u * 0.5, 60), d = (f) => Ne.top + (1 - (f - t) / (n - t)) * a;
  return /* @__PURE__ */ m("g", { children: [
    r.map((f, h) => {
      const p = d(f);
      return /* @__PURE__ */ m("g", { children: [
        /* @__PURE__ */ o("line", { x1: Ne.left, x2: Ne.left + l, y1: p, y2: p, stroke: "#27272a", strokeDasharray: "3 3" }),
        /* @__PURE__ */ o("text", { x: Ne.left - 6, y: p + 3, textAnchor: "end", fontSize: 10, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: Ge(f) })
      ] }, `g-${h}`);
    }),
    e.map((f, h) => {
      const p = Ne.left + u * h + u / 2, g = p - c / 2, b = Cn[h % Cn.length], w = d(f.min), A = d(f.max), $ = d(f.q1), j = d(f.q3), E = d(f.median);
      return /* @__PURE__ */ m("g", { children: [
        /* @__PURE__ */ o("line", { x1: p, x2: p, y1: w, y2: A, stroke: b, strokeOpacity: 0.6 }),
        /* @__PURE__ */ o("line", { x1: p - c / 4, x2: p + c / 4, y1: w, y2: w, stroke: b, strokeOpacity: 0.8 }),
        /* @__PURE__ */ o("line", { x1: p - c / 4, x2: p + c / 4, y1: A, y2: A, stroke: b, strokeOpacity: 0.8 }),
        /* @__PURE__ */ o("rect", { x: g, y: j, width: c, height: Math.max(1, $ - j), fill: b, fillOpacity: 0.25, stroke: b, strokeWidth: 1.5 }),
        /* @__PURE__ */ o("line", { x1: g, x2: g + c, y1: E, y2: E, stroke: b, strokeWidth: 2 }),
        f.outliers.map((x, T) => /* @__PURE__ */ o("circle", { cx: p, cy: d(x), r: 2.5, fill: b, fillOpacity: 0.7 }, T)),
        /* @__PURE__ */ o("text", { x: p, y: i - 8, textAnchor: "middle", fontSize: 11, fill: "#a1a1aa", fontFamily: "ui-sans-serif", children: f.label })
      ] }, h);
    })
  ] });
}
function rc(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const t = e.map((n) => {
    if (!n || typeof n != "object") return null;
    const r = n, s = String(r.label ?? "");
    if (typeof r.median == "number")
      return {
        label: s,
        min: Number(r.min ?? r.median),
        q1: Number(r.q1 ?? r.median),
        median: Number(r.median),
        q3: Number(r.q3 ?? r.median),
        max: Number(r.max ?? r.median),
        outliers: Array.isArray(r.outliers) ? r.outliers.filter((i) => typeof i == "number") : []
      };
    if (Array.isArray(r.values)) {
      const i = r.values.filter((l) => typeof l == "number" && Number.isFinite(l));
      return i.length === 0 ? null : sc(s, i);
    }
    return null;
  }).filter((n) => n != null);
  return t.length > 0 ? t : null;
}
function sc(e, t) {
  const n = [...t].sort((p, g) => p - g), r = (p) => {
    const g = (n.length - 1) * p, b = Math.floor(g), w = Math.ceil(g);
    return b === w ? n[b] : n[b] + (n[w] - n[b]) * (g - b);
  }, s = r(0.25), i = r(0.5), l = r(0.75), a = l - s, u = s - 1.5 * a, c = l + 1.5 * a, d = [];
  let f = 1 / 0, h = -1 / 0;
  for (const p of n)
    p < u || p > c ? d.push(p) : (p < f && (f = p), p > h && (h = p));
  return Number.isFinite(f) || (f = n[0]), Number.isFinite(h) || (h = n[n.length - 1]), { label: e, min: f, q1: s, median: i, q3: l, max: h, outliers: d };
}
const oc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Boxplot: tc
}, Symbol.toStringTag, { value: "Module" })), ic = "var(--mtc-grid)", En = "var(--mtc-border)", On = "var(--mtc-muted)", lc = "var(--mtc-muted-subtle)";
function ac({ data: e }) {
  const t = L(() => cc(e), [e]);
  return t ? /* @__PURE__ */ o(Ae, { width: "100%", height: "100%", children: /* @__PURE__ */ m(Kr, { data: t.rows, outerRadius: "75%", children: [
    /* @__PURE__ */ o(Hr, { stroke: ic }),
    /* @__PURE__ */ o(Wr, { dataKey: "metric", stroke: En, tick: { fontSize: 11, fill: On } }),
    /* @__PURE__ */ o(qr, { stroke: En, tick: { fontSize: 9, fill: lc } }),
    /* @__PURE__ */ o(_e, { contentStyle: Te }),
    t.series.length > 1 && /* @__PURE__ */ o(Bn, { wrapperStyle: { fontSize: 11, color: On } }),
    t.series.map((n, r) => /* @__PURE__ */ o(
      Gr,
      {
        name: n,
        dataKey: n,
        stroke: de[r % de.length],
        fill: de[r % de.length],
        fillOpacity: 0.25,
        strokeWidth: 1.5
      },
      n
    ))
  ] }) }) : /* @__PURE__ */ o(D, { children: "No data" });
}
function cc(e) {
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
    const s = r.map((l) => String(l.name ?? "")).filter(Boolean);
    return { rows: n.map((l, a) => {
      const u = { metric: l };
      for (const c of r) {
        const d = c, f = String(d.name ?? ""), h = d.values;
        Array.isArray(h) && typeof h[a] == "number" && (u[f] = h[a]);
      }
      return u;
    }), series: s };
  }
  return null;
}
const uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Radar: ac
}, Symbol.toStringTag, { value: "Module" })), dc = {
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
}, Mn = "#52525b", Re = 130, Xe = 44, Rn = 80, Et = 18, Ot = 16;
function fc({ data: e }) {
  const t = L(() => hc(pc(e)), [e]);
  return t ? /* @__PURE__ */ o("div", { className: "h-full w-full overflow-auto", children: /* @__PURE__ */ m(
    "svg",
    {
      viewBox: `0 0 ${t.width} ${t.height}`,
      width: t.width,
      height: t.height,
      style: { display: "block" },
      children: [
        /* @__PURE__ */ o("defs", { children: /* @__PURE__ */ o("marker", { id: "dag-arrow", markerWidth: "8", markerHeight: "8", refX: "7", refY: "4", orient: "auto", markerUnits: "strokeWidth", children: /* @__PURE__ */ o("path", { d: "M0,0 L0,8 L8,4 z", fill: "#52525b" }) }) }),
        t.edges.map((n, r) => /* @__PURE__ */ o(
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
          const r = n.status ? dc[n.status] ?? Mn : Mn;
          return /* @__PURE__ */ m("g", { children: [
            /* @__PURE__ */ o(
              "rect",
              {
                x: n.x,
                y: n.y,
                width: Re,
                height: Xe,
                rx: 6,
                ry: 6,
                fill: "#18181b",
                stroke: r,
                strokeWidth: 2
              }
            ),
            /* @__PURE__ */ o(
              "text",
              {
                x: n.x + Re / 2,
                y: n.y + Xe / 2 + 4,
                textAnchor: "middle",
                fontSize: 11,
                fill: "#fafafa",
                fontFamily: "ui-sans-serif",
                children: mc(n.label, 18)
              }
            ),
            /* @__PURE__ */ o("circle", { cx: n.x + 8, cy: n.y + 8, r: 3, fill: r })
          ] }, n.id);
        })
      ]
    }
  ) }) : /* @__PURE__ */ o(D, { children: "No data" });
}
function mc(e, t) {
  return e.length > t ? `${e.slice(0, t - 1)}…` : e;
}
function pc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  const t = e, n = Array.isArray(t.nodes) ? t.nodes : null, r = Array.isArray(t.edges) ? t.edges : [];
  if (!n) return null;
  const s = n.map((l) => {
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
  return { nodes: s, edges: i };
}
function hc(e) {
  if (!e || e.nodes.length === 0) return null;
  const { nodes: t, edges: n } = e, r = /* @__PURE__ */ new Map();
  for (const b of t) r.set(b.id, []);
  for (const b of n) r.get(b.to)?.push(b.from);
  const s = /* @__PURE__ */ new Map();
  for (const b of t) s.set(b.id, 0);
  let i = !0, l = 0;
  for (; i && l++ < t.length + 1; ) {
    i = !1;
    for (const b of n) {
      const w = (s.get(b.from) ?? 0) + 1;
      (s.get(b.to) ?? 0) < w && (s.set(b.to, w), i = !0);
    }
  }
  const a = /* @__PURE__ */ new Map();
  for (const b of t) {
    const w = s.get(b.id) ?? 0;
    a.has(w) || a.set(w, []), a.get(w).push(b.id);
  }
  const u = Math.max(0, ...s.values()), c = Math.max(...Array.from(a.values(), (b) => b.length)), d = Ot * 2 + c * Re + (c - 1) * Et, f = Ot * 2 + (u + 1) * Xe + u * (Rn - Xe), h = /* @__PURE__ */ new Map();
  for (const [b, w] of a) {
    const A = w.length * Re + (w.length - 1) * Et, $ = (d - A) / 2;
    w.forEach((j, E) => {
      h.set(j, {
        x: $ + E * (Re + Et),
        y: Ot + b * Rn
      });
    });
  }
  const p = t.map((b) => ({ ...b, ...h.get(b.id) })), g = n.map((b) => {
    const w = h.get(b.from), A = h.get(b.to);
    return !w || !A ? null : {
      x1: w.x + Re / 2,
      y1: w.y + Xe,
      x2: A.x + Re / 2,
      y2: A.y
    };
  }).filter((b) => b != null);
  return { nodes: p, edges: g, width: d, height: f };
}
const bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Dag: fc
}, Symbol.toStringTag, { value: "Module" }));
function gc({ options: e }) {
  const t = e ?? {}, { ctx: n, setCtx: r } = ae();
  if (!t.key)
    return /* @__PURE__ */ o(D, { children: "MultiSelect requires options.key" });
  const s = t.choices ?? [];
  if (s.length === 0)
    return /* @__PURE__ */ o(D, { children: "MultiSelect requires options.choices" });
  const i = s.map(
    (c) => typeof c == "string" ? { value: c, label: c } : { value: c.value, label: c.label ?? c.value }
  ), l = n[t.key] != null ? n[t.key].split(",").map((c) => c.trim()).filter(Boolean) : t.default ?? [], a = new Set(l), u = (c) => {
    a.has(c) ? a.delete(c) : a.add(c), r(t.key, Array.from(a).join(","));
  };
  return /* @__PURE__ */ m("div", { className: "flex flex-col h-full justify-center gap-2 px-2", children: [
    /* @__PURE__ */ m("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ o("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: t.label ?? t.key }),
      /* @__PURE__ */ m("span", { className: "text-[10px] text-zinc-600", children: [
        a.size,
        " / ",
        i.length
      ] })
    ] }),
    /* @__PURE__ */ o("div", { className: "flex flex-wrap gap-1", children: i.map((c) => {
      const d = a.has(c.value);
      return /* @__PURE__ */ o(
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
const xc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultiSelect: gc
}, Symbol.toStringTag, { value: "Module" }));
function yc({ data: e }) {
  const t = L(() => {
    if (e == null) return "";
    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return String(e);
    }
  }, [e]);
  return t ? /* @__PURE__ */ o("pre", { className: "text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed", children: vc(t) }) : /* @__PURE__ */ o(D, { children: "No data" });
}
function vc(e) {
  const t = [], n = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let r = 0, s;
  for (; (s = n.exec(e)) != null; )
    s.index > r && t.push({ text: e.slice(r, s.index) }), s[1] ? (t.push({ text: s[1], color: s[2] ? "#a1a1aa" : "#34d399" }), s[2] && t.push({ text: s[2] })) : s[3] ? t.push({ text: s[3], color: "#fbbf24" }) : s[4] && t.push({ text: s[4], color: "#0ea5e9" }), r = n.lastIndex;
  return r < e.length && t.push({ text: e.slice(r) }), t.map(
    (i, l) => i.color ? /* @__PURE__ */ o("span", { style: { color: i.color }, children: i.text }, l) : i.text
  );
}
const wc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Json: yc
}, Symbol.toStringTag, { value: "Module" }));
function kc({ data: e, options: t }) {
  const n = t ?? {}, r = L(() => Nc(e), [e]);
  if (!r || r.length < 2)
    return /* @__PURE__ */ o(D, { children: "No data" });
  const s = Math.min(...r), l = Math.max(...r) - s || 1, a = r[r.length - 1] >= r[0], u = n.color ?? (a ? "#10b981" : "#ef4444"), c = r.map((d, f) => {
    const h = f / (r.length - 1) * 100, p = 22 - (d - s) / l * 20 - 1;
    return `${h.toFixed(1)},${p.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ o("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ o("svg", { viewBox: "0 0 100 24", className: "w-full h-full", preserveAspectRatio: "none", children: /* @__PURE__ */ o(
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
function Nc(e) {
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
const Sc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Sparkline: kc
}, Symbol.toStringTag, { value: "Module" })), zc = {
  ACTION_STATUS_OK: { dot: "bg-emerald-400", text: "text-emerald-300" },
  ACTION_STATUS_ACCEPTED: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_PENDING: { dot: "bg-amber-400", text: "text-amber-300" },
  ACTION_STATUS_REJECTED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_FAILED: { dot: "bg-red-400", text: "text-red-300" },
  ACTION_STATUS_CANCELLED: { dot: "bg-zinc-400", text: "text-zinc-300" }
}, Ac = { dot: "bg-zinc-500", text: "text-zinc-400" };
function _c(e) {
  return e.replace(/^ACTION_STATUS_/, "").toLowerCase();
}
function Tc(e) {
  return e ? e.length <= 8 ? e : e.slice(0, 6) + "…" : "";
}
function $c(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Cc({ options: e }) {
  const { recentActions: t, clearRecentActions: n } = ae(), r = e?.limit || 25, s = gt(t.length > 0), i = t.slice(0, r);
  return i.length === 0 ? /* @__PURE__ */ o(D, { children: "No actions yet" }) : /* @__PURE__ */ m("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ m("div", { className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0", children: [
      /* @__PURE__ */ m("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: [
        t.length,
        " action",
        t.length === 1 ? "" : "s"
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          onClick: n,
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
          title: "Clear log",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ o("div", { className: "flex-1 overflow-auto min-h-0", children: i.map((l, a) => {
      const u = zc[l.status] ?? Ac;
      return /* @__PURE__ */ m(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.message ?? "",
          children: [
            /* @__PURE__ */ o("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: $c(s, l.receivedAt) }),
            /* @__PURE__ */ o("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${u.dot}` }),
            /* @__PURE__ */ o("span", { className: "text-zinc-200 shrink-0", children: l.actionId }),
            /* @__PURE__ */ o("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${u.text}`, children: _c(l.status) }),
            l.message && /* @__PURE__ */ o("span", { className: "text-zinc-400 truncate flex-1 min-w-0", children: l.message }),
            /* @__PURE__ */ o("span", { className: "text-zinc-600 text-[10px] shrink-0", children: Tc(l.clientRequestId) })
          ]
        },
        `${l.clientRequestId}-${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const Ec = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActionLog: Cc
}, Symbol.toStringTag, { value: "Module" })), jn = {
  error: { dot: "bg-red-400", text: "text-red-300" },
  warn: { dot: "bg-amber-400", text: "text-amber-300" },
  ok: { dot: "bg-emerald-400", text: "text-emerald-300" },
  info: { dot: "bg-sky-400", text: "text-sky-300" }
};
function Oc(e, t) {
  const n = Math.floor((e - t) / 1e3);
  if (n < 5) return "now";
  if (n < 60) return `${n}s`;
  const r = Math.floor(n / 60);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h`;
}
function Mc({ options: e }) {
  const { recentAlerts: t, clearRecentAlerts: n } = ae(), r = e?.limit || 50, s = gt(t.length > 0), i = t.slice(0, r);
  return i.length === 0 ? /* @__PURE__ */ o(D, { children: "No alerts" }) : /* @__PURE__ */ m("div", { className: "h-full flex flex-col text-xs font-mono", children: [
    /* @__PURE__ */ m("div", { className: "flex items-center justify-between px-2 py-1 border-b border-zinc-800 shrink-0", children: [
      /* @__PURE__ */ m("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: [
        t.length,
        " alert",
        t.length === 1 ? "" : "s"
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          onClick: n,
          className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 rounded",
          title: "Clear log",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ o("div", { className: "flex-1 overflow-auto min-h-0", children: i.map((l, a) => {
      const u = jn[l.severity] ?? jn.warn;
      return /* @__PURE__ */ m(
        "div",
        {
          className: "flex items-baseline gap-2 px-2 py-1 border-b border-zinc-800/60 hover:bg-zinc-800/30",
          title: l.predicate,
          children: [
            /* @__PURE__ */ o("span", { className: "text-zinc-500 shrink-0 w-8 tabular-nums", children: Oc(s, l.receivedAt) }),
            /* @__PURE__ */ o("span", { className: `w-1.5 h-1.5 rounded-full shrink-0 ${u.dot}` }),
            /* @__PURE__ */ o("span", { className: `uppercase tracking-wider text-[10px] shrink-0 ${u.text}`, children: l.severity }),
            /* @__PURE__ */ o("span", { className: "text-zinc-200 truncate flex-1 min-w-0", children: l.message }),
            l.widgetId && /* @__PURE__ */ o("span", { className: "text-zinc-600 text-[10px] shrink-0", children: l.widgetId })
          ]
        },
        `${l.receivedAt}-${a}`
      );
    }) })
  ] });
}
const Rc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AlertLog: Mc
}, Symbol.toStringTag, { value: "Module" })), jc = 500, Ic = 800;
function Lc(e) {
  return e.id ? `id:${e.id}` : `t:${e.timestamp ?? ""}|p:${e.price ?? ""}|s:${e.size ?? ""}|x:${e.label ?? ""}`;
}
function Pc(e) {
  const t = (e ?? "").toLowerCase();
  return t === "buy" || t === "bid" ? { row: "bg-emerald-500/5", text: "text-emerald-400" } : t === "sell" || t === "ask" ? { row: "bg-red-500/5", text: "text-red-400" } : { row: "", text: "text-zinc-300" };
}
function Dc(e) {
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
function Fc({ data: e, options: t }) {
  const n = t?.cap || jc, r = Dc(e), [s, i] = v([]), l = U(/* @__PURE__ */ new Set()), a = U(!1);
  if (R(() => {
    if (r.length === 0) return;
    const c = [];
    for (const d of r) {
      const f = Lc(d);
      l.current.has(f) || (l.current.add(f), c.push({ ...d, _key: f, _receivedAt: Date.now() }));
    }
    c.length !== 0 && (i((d) => {
      const f = [...c.reverse(), ...d];
      if (f.length <= n) return f;
      for (const h of f.slice(n)) l.current.delete(h._key);
      return f.slice(0, n);
    }), a.current || (a.current = !0));
  }, [e, n]), s.length === 0)
    return /* @__PURE__ */ o(D, { children: "No prints yet" });
  const u = Date.now() - Ic;
  return /* @__PURE__ */ o("div", { className: "h-full overflow-auto text-xs font-mono", children: s.map((c) => {
    const d = Pc(c.side), h = c._receivedAt > u && a.current ? "bg-sky-500/10" : d.row;
    return /* @__PURE__ */ m(
      "div",
      {
        className: `grid grid-cols-[64px_1fr_auto_auto] gap-2 px-2 py-0.5 border-b border-zinc-800/40 transition-colors duration-500 ${h}`,
        children: [
          /* @__PURE__ */ o("span", { className: "text-zinc-500 tabular-nums truncate", children: c.timestamp != null ? Uc(c.timestamp) : "" }),
          /* @__PURE__ */ o("span", { className: `truncate ${d.text}`, children: c.label ?? c.side?.toUpperCase() ?? "·" }),
          /* @__PURE__ */ o("span", { className: `text-right tabular-nums ${d.text}`, children: c.price != null ? Bc(c.price) : "" }),
          /* @__PURE__ */ o("span", { className: "text-right tabular-nums text-zinc-400", children: c.size != null ? Kc(c.size) : "" })
        ]
      },
      c._key
    );
  }) });
}
function Uc(e) {
  try {
    const t = new Date(e);
    if (isNaN(t.getTime())) return String(e);
    const n = String(t.getHours()).padStart(2, "0"), r = String(t.getMinutes()).padStart(2, "0"), s = String(t.getSeconds()).padStart(2, "0");
    return `${n}:${r}:${s}`;
  } catch {
    return Ie(e);
  }
}
function Bc(e) {
  return Math.abs(e) >= 1e3 ? e.toLocaleString(void 0, { maximumFractionDigits: 2 }) : e.toFixed(Math.abs(e) < 1 ? 4 : 2);
}
function Kc(e) {
  return Math.abs(e) >= 1e6 ? (e / 1e6).toFixed(2) + "M" : Math.abs(e) >= 1e3 ? (e / 1e3).toFixed(2) + "K" : Math.abs(e) >= 1 ? e.toFixed(2) : e.toFixed(4);
}
const Hc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Tape: Fc
}, Symbol.toStringTag, { value: "Module" }));
function je(e) {
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
function Wc(e) {
  const t = qc(e);
  return t || [];
}
function qc(e) {
  if (!e) return null;
  if (Array.isArray(e)) return e;
  if (typeof e == "object") {
    const t = e;
    if (Array.isArray(t.entries)) return t.entries;
    if (Array.isArray(t.rows)) return t.rows;
  }
  return null;
}
function Gc(e) {
  const t = e.filter(Ke).sort(In), n = e.filter((r) => !Ke(r)).sort(In);
  return [...t, ...n];
}
function In(e, t) {
  return (e.name ?? "").localeCompare(t.name ?? "");
}
function Vc(e) {
  return e ? e.split("/").filter(Boolean) : [];
}
function Jc(e, t) {
  const n = (e ?? "").replace(/^\/+|\/+$/g, ""), r = (t ?? "").replace(/^\/+|\/+$/g, "");
  return n ? r ? n + "/" + r : n : r;
}
function Sr(e) {
  const t = ["B", "KB", "MB", "GB", "TB"];
  let n = 0, r = e;
  for (; r >= 1024 && n < t.length - 1; )
    r /= 1024, n++;
  return `${n === 0 ? r.toFixed(0) : r.toFixed(1)} ${t[n]}`;
}
const Xc = /* @__PURE__ */ new Set(["audio", "video", "mkv"]), Yc = /* @__PURE__ */ new Set(["audio", "video", "mkv", "image", "heic"]);
function Zc(e) {
  return e.filter((t) => {
    const n = Ze(t.content_type, t.name);
    return n !== null && Xc.has(n);
  });
}
function Qc(e) {
  return e.filter((t) => {
    const n = Ze(t.content_type, t.name);
    return n !== null && Yc.has(n);
  });
}
function Ln(e, t, n, r, s = Math.random) {
  if (e.length === 0) return null;
  if (e.length === 1) return r ? e[0] : null;
  const i = e.findIndex((l) => l.name === t);
  if (n) {
    for (let l = 0; l < 5; l++) {
      const a = e[Math.floor(s() * e.length)];
      if (a.name !== t) return a;
    }
    return e[(i + 1) % e.length];
  }
  return i < 0 ? e[0] : i + 1 < e.length ? e[i + 1] : r ? e[0] : null;
}
function eu(e, t, n) {
  if (e.length === 0) return null;
  const r = e.findIndex((s) => s.name === t);
  return r > 0 ? e[r - 1] : n ? e[e.length - 1] : null;
}
function Ze(e, t) {
  const n = (t ?? "").toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "", r = (e ?? "").toLowerCase().split(";")[0].trim();
  return r === "image/heic" || r === "image/heif" || n === "heic" || n === "heif" ? "heic" : r === "video/x-matroska" || r === "application/x-matroska" || n === "mkv" ? "mkv" : r.startsWith("video/") ? "video" : r.startsWith("audio/") ? "audio" : r.startsWith("image/") ? "image" : r === "application/pdf" || n === "pdf" ? "pdf" : r === "application/json" || r === "text/json" || n === "json" ? "json" : r === "application/yaml" || r === "text/yaml" || r === "application/x-yaml" || n === "yaml" || n === "yml" ? "yaml" : r === "text/markdown" || r === "text/x-markdown" || n === "md" || n === "markdown" ? "markdown" : r === "text/csv" || r === "application/csv" || n === "csv" ? "csv" : r.startsWith("text/") || n === "txt" || n === "log" || n === "ini" || n === "conf" ? "text" : null;
}
function Pn(e, t, n) {
  const r = encodeURIComponent(t);
  return e.replace("{bucket}", r).replace("{namespace}", r).replace("{path}", encodeURIComponent(n));
}
function tu(e) {
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
async function nu(e, t) {
  if (!e.body)
    throw new Error("parseConnectStream: response has no body");
  const n = e.body.getReader(), r = [];
  for (; ; ) {
    const { value: c, done: d } = await n.read();
    if (d) break;
    c && r.push(c);
  }
  let s = 0;
  for (const c of r) s += c.length;
  const i = new Uint8Array(s);
  let l = 0;
  for (const c of r)
    i.set(c, l), l += c.length;
  const a = [];
  let u = 0;
  for (; u + 5 <= i.length; ) {
    const c = i[u], d = i[u + 1] << 24 | i[u + 2] << 16 | i[u + 3] << 8 | i[u + 4];
    if (u += 5, u + d > i.length) break;
    const f = i.subarray(u, u + d);
    if (u += d, (c & 2) !== 0) break;
    try {
      const h = JSON.parse(new TextDecoder().decode(f));
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
async function ru(e) {
  const t = await fetch(e);
  if (!t.ok) throw new Error(`fetch failed: ${t.status}`);
  return t.text();
}
function su(e) {
  try {
    return JSON.stringify(JSON.parse(e), null, 2);
  } catch {
    return e;
  }
}
function ou(e) {
  const t = [];
  let n = [], r = "", s = !1;
  for (let i = 0; i < e.length; i++) {
    const l = e[i];
    if (s) {
      if (l === '"' && e[i + 1] === '"') {
        r += '"', i++;
        continue;
      }
      if (l === '"') {
        s = !1;
        continue;
      }
      r += l;
      continue;
    }
    if (l === '"') {
      s = !0;
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
async function iu(e) {
  const [{ marked: t }, { default: n }] = await Promise.all([
    import("./marked.esm-CgtsUw0D.js"),
    import("./purify.es-ZDSJOUnA.js")
  ]);
  try {
    const r = await t.parse(e, { async: !0 });
    return n.sanitize(r);
  } catch {
    return `<pre>${lu(e)}</pre>`;
  }
}
function lu(e) {
  return e.replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]);
}
let Mt = null;
function zr(e) {
  return import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    e
  );
}
async function au(e) {
  const { default: t } = await zr("heic2any"), n = await t({ blob: e, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(n) ? n[0] : n;
}
async function cu(e, t) {
  t?.("Loading ffmpeg…");
  const n = await uu();
  t?.("Fetching file…");
  const r = await fetch(e);
  if (!r.ok) throw new Error(`fetch failed: ${r.status}`);
  const s = new Uint8Array(await r.arrayBuffer());
  t?.("Remuxing…"), await n.writeFile("input.mkv", s);
  const i = await n.exec(["-i", "input.mkv", "-c", "copy", "-movflags", "+faststart", "output.mp4"]);
  if (i !== 0)
    throw new Error("ffmpeg remux failed (code " + i + ") — codec inside MKV may not be browser-compatible");
  const l = await n.readFile("output.mp4");
  if (typeof l == "string")
    throw new Error("ffmpeg readFile returned string");
  return new Blob([new Uint8Array(l)], { type: "video/mp4" });
}
async function uu() {
  if (Mt) return Mt;
  const { FFmpeg: e } = await zr("@ffmpeg/ffmpeg"), t = new e();
  return await t.load(), Mt = t, t;
}
function du({ data: e, options: t, widgetId: n }) {
  const r = t ?? {}, { ctx: s, setCtx: i, backendUrl: l, toast: a, requestRefresh: u } = ae(), c = r.path_ctx ?? "path", d = r.bucket_ctx ?? "org", f = r.bucket_param ?? "org", h = r.page_ctx ?? "page", p = r.page_size_ctx ?? "page_size", g = r.view_mode_ctx ?? "view_mode", b = r.upload_action_id ?? "upload", w = r.upload_url, A = r.ingest_url, $ = s[d] ?? "default", j = s[c] ?? "", E = parseInt(s[h] ?? "1", 10) || 1, x = parseInt(s[p] ?? "50", 10) || 50, T = s[g] === "gallery" ? "gallery" : "icons", [O, I] = v(!1), [G, Z] = v(!1), [X, Y] = v(null), [P, K] = v(!1), [q, z] = v("url"), [H, ee] = v(""), [Q, oe] = v(""), [y, k] = v(""), [_, M] = v(!1), W = r.search_url, [V, ne] = v(""), [te, se] = v(null), [me, $e] = v(!1), Ee = L(() => Wc(e), [e]), Le = te ?? Ee, pe = L(
    () => te || Gc(Ee),
    [te, Ee]
  ), be = L(() => Vc(j), [j]), he = !te && E > 1, ye = !te && Ee.length >= x, Pe = r.media_url_template ?? "/media?namespace={namespace}&path={path}";
  R(() => {
    E !== 1 && i(h, "1");
  }, [$, j]);
  const ve = (N) => i(c, N), Qe = (N) => i(h, String(Math.max(1, N))), Oe = () => i(g, T === "gallery" ? "icons" : "gallery"), Ve = async () => {
    if (!W) return;
    const N = V.trim();
    if (N === "") {
      se(null);
      return;
    }
    $e(!0);
    try {
      const F = await fetch((l ?? "") + W, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [f]: $, query: N })
      });
      if (!F.ok) {
        a(`Search failed: ${await ct(F)}`, "error");
        return;
      }
      const re = await F.json();
      se((re.hits ?? []).map((ie) => ({ ...ie, kind: "file" })));
    } catch (F) {
      a(`Search failed: ${je(F)}`, "error");
    } finally {
      $e(!1);
    }
  }, De = () => {
    ne(""), se(null);
  }, yt = (N) => {
    De(), ve(N);
  }, vt = () => {
    ee(j), oe(""), k(""), z(A ? "url" : "file"), K(!0);
  }, et = async () => {
    if (!A) return;
    const N = H.trim(), F = Q.trim(), re = y.trim();
    if (!N || !F || !re) {
      a("Need a folder (repo), a filename, and a URL", "error");
      return;
    }
    M(!0);
    try {
      const ie = await fetch((l ?? "") + A, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
        body: JSON.stringify({ [f]: $, repo: N, path: F, url: re })
      });
      if (!ie.ok)
        throw new Error(await ct(ie));
      a(`Fetching ${F} in the background — it'll appear when done.`, "ok"), K(!1);
    } catch (ie) {
      a(`Ingest failed: ${je(ie)}`, "error");
    } finally {
      M(!1);
    }
  }, S = async (N) => {
    const F = H.trim(), re = Q.trim() || N.name;
    if (!F) {
      a("Need a destination folder (repo)", "error");
      return;
    }
    M(!0);
    try {
      await ge(N, F, re), a(`Uploaded ${re}`, "ok"), K(!1), u(n ?? "*");
    } catch (ie) {
      a(`Upload failed: ${je(ie)}`, "error");
    } finally {
      M(!1);
    }
  }, C = (N) => N.path && N.path !== "" ? N.path : Jc(j, N.name ?? ""), J = (N) => {
    if (Ke(N)) {
      te ? yt(C(N)) : ve(C(N));
      return;
    }
    if (Pe && Ze(N.content_type, N.name)) {
      Y(N);
      return;
    }
    ue(N);
  };
  R(() => {
    if (!X) return;
    const N = (F) => {
      F.key === "Escape" && Y(null);
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [X]);
  const ue = async (N) => {
    const F = r.download_url;
    if (!F) {
      a("Download not configured (set options.download_url)", "error");
      return;
    }
    if (!N.name) {
      a("File has no name", "error");
      return;
    }
    const re = C(N), ie = (l ?? "") + F;
    try {
      const we = await fetch(ie, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1"
        },
        body: JSON.stringify({ [f]: $, path: re })
      });
      if (!we.ok) {
        const tt = await ct(we);
        a(`Download failed: ${tt}`, "error");
        return;
      }
      const wt = await nu(we, N.content_type), Fe = document.createElement("a");
      Fe.href = URL.createObjectURL(wt), Fe.download = N.name, Fe.click(), setTimeout(() => URL.revokeObjectURL(Fe.href), 5e3);
    } catch (we) {
      a(`Download failed: ${je(we)}`, "error");
    }
  }, ge = async (N, F, re) => {
    const ie = N.type || "application/octet-stream";
    if (w) {
      const Ar = new URLSearchParams({ [f]: $, repo: F, path: re, content_type: ie }), kt = await fetch(`${l ?? ""}${w}?${Ar.toString()}`, { method: "POST", body: N });
      if (!kt.ok) throw new Error(await kt.text() || `HTTP ${kt.status}`);
      return;
    }
    const we = await N.arrayBuffer(), wt = Gn(l ?? ""), Fe = Vn({
      actionId: b,
      params: { [f]: $, repo: F, path: re, content_type: ie, data_b64: tu(we) },
      clientRequestId: Jn()
    }), tt = await fetch(wt, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Connect-Protocol-Version": "1" },
      body: JSON.stringify(Fe)
    });
    if (!tt.ok) throw new Error(await ct(tt));
  }, xe = async (N) => {
    if (j === "") {
      a("Open a folder first, or use the Upload button to choose a folder.", "error");
      return;
    }
    const F = j;
    Z(!0);
    let re = 0;
    for (const ie of Array.from(N))
      try {
        await ge(ie, F, ie.name), re++;
      } catch (we) {
        a(`Upload failed: ${ie.name} — ${je(we)}`, "error");
      }
    Z(!1), re > 0 && (a(`Uploaded ${re} file${re === 1 ? "" : "s"}`, "ok"), u(n ?? "*"));
  };
  return /* @__PURE__ */ m(
    "div",
    {
      className: "h-full flex flex-col relative",
      onDragOver: (N) => {
        N.preventDefault(), I(!0);
      },
      onDragLeave: () => I(!1),
      onDrop: (N) => {
        N.preventDefault(), I(!1), N.dataTransfer.files.length > 0 && xe(N.dataTransfer.files);
      },
      children: [
        /* @__PURE__ */ m("div", { className: "flex items-center gap-1 px-3 py-1.5 text-xs border-b border-zinc-800 shrink-0", children: [
          /* @__PURE__ */ o("button", { onClick: () => ve(""), className: "text-sky-400 hover:underline", children: "/" }),
          be.map((N, F) => {
            const re = be.slice(0, F + 1).join("/");
            return /* @__PURE__ */ m("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ o("span", { className: "text-zinc-600", children: "/" }),
              /* @__PURE__ */ o(
                "button",
                {
                  onClick: () => ve(re),
                  className: "text-sky-400 hover:underline",
                  children: N
                }
              )
            ] }, F);
          }),
          /* @__PURE__ */ m("div", { className: "ml-auto flex items-center gap-3 text-zinc-500", children: [
            W && /* @__PURE__ */ m("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ o(
                "input",
                {
                  type: "search",
                  value: V,
                  onChange: (N) => ne(N.target.value),
                  onKeyDown: (N) => {
                    N.key === "Enter" && Ve(), N.key === "Escape" && De();
                  },
                  placeholder: "Search files…",
                  className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none focus:border-zinc-500 w-40"
                }
              ),
              /* @__PURE__ */ o(
                "button",
                {
                  onClick: () => {
                    Ve();
                  },
                  disabled: me,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 px-1",
                  "aria-label": "Search",
                  title: "Search this namespace",
                  children: me ? "…" : "🔍"
                }
              ),
              te && /* @__PURE__ */ o(
                "button",
                {
                  onClick: De,
                  className: "text-zinc-400 hover:text-zinc-100 px-1",
                  title: "Clear search, back to browsing",
                  children: "✕"
                }
              )
            ] }),
            (w || b || A) && /* @__PURE__ */ o(
              "button",
              {
                onClick: vt,
                className: "text-zinc-200 hover:text-white border border-zinc-700 rounded px-2 py-0.5",
                title: "Upload a file or fetch a media URL",
                children: "⬆ Upload"
              }
            ),
            /* @__PURE__ */ o(
              "button",
              {
                onClick: Oe,
                className: "text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded px-2 py-0.5",
                title: T === "gallery" ? "Switch to icons (no thumbnails)" : "Switch to gallery (loads image thumbnails)",
                children: T === "gallery" ? "◫ Gallery" : "☰ Icons"
              }
            ),
            /* @__PURE__ */ o("span", { className: "tabular-nums", children: te ? `${te.length} result${te.length === 1 ? "" : "s"}` : `${Le.length} on page` }),
            (he || ye) && /* @__PURE__ */ m("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ o(
                "button",
                {
                  onClick: () => Qe(E - 1),
                  disabled: !he,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
                  "aria-label": "Previous page",
                  children: "‹"
                }
              ),
              /* @__PURE__ */ m("span", { className: "tabular-nums text-zinc-400", children: [
                "Page ",
                E
              ] }),
              /* @__PURE__ */ o(
                "button",
                {
                  onClick: () => Qe(E + 1),
                  disabled: !ye,
                  className: "text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 disabled:cursor-not-allowed px-1",
                  "aria-label": "Next page",
                  children: "›"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ m("div", { className: "flex-1 overflow-auto relative min-h-0", children: [
          O && /* @__PURE__ */ o("div", { className: "absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-sky-500 bg-zinc-900/80 pointer-events-none", children: /* @__PURE__ */ o("div", { className: "text-sky-300 text-sm", children: "Drop files to upload" }) }),
          pe.length === 0 ? /* @__PURE__ */ o(D, { children: te ? "No files match your search." : "This folder is empty. Drop files to upload." }) : T === "gallery" ? /* @__PURE__ */ o(
            fu,
            {
              entries: pe,
              onClick: J,
              mediaUrlFor: (N) => N.name ? (l ?? "") + Pn(Pe, $, C(N)) : ""
            }
          ) : /* @__PURE__ */ m("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ o("thead", { className: "sticky top-0 bg-zinc-900 z-[1]", children: /* @__PURE__ */ m("tr", { className: "text-zinc-400 border-b border-zinc-800", children: [
              /* @__PURE__ */ o("th", { className: "text-left px-3 py-2 w-8" }),
              /* @__PURE__ */ o("th", { className: "text-left px-3 py-2", children: "Name" }),
              /* @__PURE__ */ o("th", { className: "text-right px-3 py-2 w-24", children: "Size" }),
              /* @__PURE__ */ o("th", { className: "text-left px-3 py-2 w-40", children: "Type" }),
              /* @__PURE__ */ o("th", { className: "text-left px-3 py-2 w-36", children: "Modified" })
            ] }) }),
            /* @__PURE__ */ o("tbody", { children: pe.map((N, F) => /* @__PURE__ */ m(
              "tr",
              {
                onDoubleClick: () => J(N),
                className: "border-b border-zinc-800/40 hover:bg-zinc-800/40 cursor-pointer select-none",
                children: [
                  /* @__PURE__ */ o("td", { className: "px-3 py-1.5 select-none", children: Ke(N) ? "📁" : "📄" }),
                  /* @__PURE__ */ o("td", { className: "px-3 py-1.5 text-zinc-100 truncate", children: N.name }),
                  /* @__PURE__ */ o("td", { className: "px-3 py-1.5 text-right text-zinc-400", children: Ke(N) ? "—" : Sr(N.size_bytes ?? 0) }),
                  /* @__PURE__ */ o("td", { className: "px-3 py-1.5 text-zinc-500 truncate", children: N.content_type ?? "" }),
                  /* @__PURE__ */ o("td", { className: "px-3 py-1.5 text-zinc-500 truncate", children: N.modified_at ?? "" })
                ]
              },
              `${N.kind ?? ""}:${N.name ?? F}`
            )) })
          ] }),
          G && /* @__PURE__ */ o("div", { className: "absolute bottom-2 right-2 bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-1.5 rounded text-xs shadow-lg", children: "Uploading…" })
        ] }),
        X && /* @__PURE__ */ o(
          mu,
          {
            entry: X,
            mediaUrl: (l ?? "") + Pn(Pe, $, C(X)),
            autoAdvanceQueue: Zc(pe),
            navigableQueue: Qc(pe),
            onSelect: (N) => Y(N),
            onClose: () => Y(null),
            onDownload: () => {
              ue(X);
            }
          }
        ),
        P && /* @__PURE__ */ o(
          "div",
          {
            className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60",
            onClick: () => {
              _ || K(!1);
            },
            children: /* @__PURE__ */ m(
              "div",
              {
                className: "flex flex-col gap-3 bg-zinc-900 border border-zinc-700 rounded-lg p-5 shadow-2xl w-full max-w-md",
                onClick: (N) => N.stopPropagation(),
                children: [
                  /* @__PURE__ */ m("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ m("h2", { className: "text-sm font-medium text-zinc-100", children: [
                      "Upload to ",
                      $
                    ] }),
                    /* @__PURE__ */ o(
                      "button",
                      {
                        onClick: () => {
                          _ || K(!1);
                        },
                        className: "text-zinc-500 hover:text-zinc-200",
                        "aria-label": "Close",
                        children: "✕"
                      }
                    )
                  ] }),
                  A && /* @__PURE__ */ m("div", { className: "flex gap-1 text-xs", children: [
                    /* @__PURE__ */ o(
                      "button",
                      {
                        onClick: () => z("url"),
                        className: `px-3 py-1 rounded border ${q === "url" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
                        children: "From URL"
                      }
                    ),
                    /* @__PURE__ */ o(
                      "button",
                      {
                        onClick: () => z("file"),
                        className: `px-3 py-1 rounded border ${q === "file" ? "border-sky-500 text-sky-300 bg-sky-500/10" : "border-zinc-700 text-zinc-400 hover:text-zinc-200"}`,
                        children: "Local file"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ m("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                    "Folder (repo)",
                    /* @__PURE__ */ o(
                      "input",
                      {
                        type: "text",
                        value: H,
                        onChange: (N) => ee(N.target.value),
                        placeholder: "e.g. year=2026/name=avatar",
                        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                      }
                    ),
                    /* @__PURE__ */ o("span", { className: "text-zinc-600", children: "The repository partition. Becomes a source key." })
                  ] }),
                  /* @__PURE__ */ m("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                    "Filename ",
                    q === "file" && "(optional — defaults to the file’s name)",
                    /* @__PURE__ */ o(
                      "input",
                      {
                        type: "text",
                        value: Q,
                        onChange: (N) => oe(N.target.value),
                        placeholder: "e.g. avatar.mp4",
                        className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                      }
                    ),
                    /* @__PURE__ */ o("span", { className: "text-zinc-600", children: "Location inside the repo (may include subfolders)." })
                  ] }),
                  q === "url" ? /* @__PURE__ */ m(ft, { children: [
                    /* @__PURE__ */ m("label", { className: "flex flex-col gap-1 text-xs text-zinc-400", children: [
                      "Media URL",
                      /* @__PURE__ */ o(
                        "input",
                        {
                          type: "url",
                          value: y,
                          onChange: (N) => k(N.target.value),
                          placeholder: "https://example.com/media.mp4 or https://example.com/playlist.m3u8",
                          className: "bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                        }
                      ),
                      /* @__PURE__ */ o("span", { className: "text-zinc-600", children: "HTTP(S) media URL or raw HLS playlist. Fetched server-side." })
                    ] }),
                    /* @__PURE__ */ o(
                      "button",
                      {
                        onClick: () => {
                          et();
                        },
                        disabled: _,
                        className: "self-end px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 text-white text-sm",
                        children: _ ? "Starting…" : "Fetch & store"
                      }
                    )
                  ] }) : /* @__PURE__ */ m(ft, { children: [
                    /* @__PURE__ */ o(
                      "input",
                      {
                        type: "file",
                        onChange: (N) => {
                          const F = N.target.files?.[0];
                          F && S(F);
                        },
                        disabled: _,
                        className: "text-xs text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-sky-500"
                      }
                    ),
                    _ && /* @__PURE__ */ o("span", { className: "self-end text-xs text-zinc-400", children: "Uploading…" })
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
function fu({
  entries: e,
  onClick: t,
  mediaUrlFor: n
}) {
  return /* @__PURE__ */ o("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3", children: e.map((r, s) => {
    const i = Ze(r.content_type, r.name), l = i === "image" || i === "heic", a = Ke(r);
    return /* @__PURE__ */ m(
      "button",
      {
        onDoubleClick: () => t(r),
        className: "flex flex-col items-center gap-1 p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-left select-none",
        children: [
          /* @__PURE__ */ o("div", { className: "w-full aspect-square bg-zinc-950 rounded flex items-center justify-center overflow-hidden", children: a ? /* @__PURE__ */ o("span", { className: "text-4xl select-none", children: "📁" }) : l && r.name ? /* @__PURE__ */ o(
            "img",
            {
              src: n(r),
              alt: r.name ?? "",
              loading: "lazy",
              decoding: "async",
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ o("span", { className: "text-4xl select-none", children: "📄" }) }),
          /* @__PURE__ */ o("span", { className: "w-full text-xs text-zinc-200 truncate", title: r.name, children: r.name })
        ]
      },
      `${r.kind ?? ""}:${r.name ?? s}`
    );
  }) });
}
function mu({
  entry: e,
  mediaUrl: t,
  autoAdvanceQueue: n,
  navigableQueue: r,
  onSelect: s,
  onClose: i,
  onDownload: l
}) {
  const a = Ze(e.content_type, e.name), u = a === "text" || a === "json" || a === "yaml" || a === "csv" || a === "markdown", [c, d] = v(
    a === "image" || a === "video" || a === "pdf" || a === "heic" || a === "mkv" || u
  ), [f, h] = v(!1), [p, g] = v(null), [b, w] = v(null), [A, $] = v("Loading…"), [j, E] = v(null), [x, T] = v(null), [O, I] = v(null), G = r.length > 1, Z = r.findIndex((y) => y.name === e.name), [X, Y] = v(!1), [P, K] = v(!0), q = () => {
    const y = Ln(r, e.name, X, P);
    y && s(y);
  }, z = () => {
    const y = eu(r, e.name, P);
    y && s(y);
  }, H = () => {
    const y = Ln(n, e.name, X, P);
    y && s(y);
  };
  R(() => {
    const y = (k) => {
      const _ = k.target;
      if (!(_ && (_.tagName === "INPUT" || _.tagName === "TEXTAREA" || _.isContentEditable))) {
        if (k.key === "ArrowRight")
          k.preventDefault(), q();
        else if (k.key === "ArrowLeft")
          k.preventDefault(), z();
        else if (k.key === " ") {
          const M = document.querySelector("video, audio");
          M && (k.preventDefault(), M.paused ? M.play() : M.pause());
        }
      }
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [e.name, r.length, X, P]);
  const ee = () => d(!1), Q = () => {
    d(!1), h(!0), g(null);
  }, oe = (y) => {
    y.target === y.currentTarget && i();
  };
  return R(() => {
    if (a !== "heic" && a !== "mkv") return;
    let y = !1, k = null;
    return (async () => {
      try {
        let _;
        if (a === "heic") {
          $("Decoding HEIC…");
          const M = await fetch(t);
          if (!M.ok) throw new Error(`fetch failed: ${M.status}`);
          _ = await au(await M.blob());
        } else
          _ = await cu(t, (M) => {
            y || $(M);
          });
        if (y) return;
        k = URL.createObjectURL(_), w(k), d(!1);
      } catch (_) {
        if (y) return;
        g(je(_)), h(!0), d(!1);
      }
    })(), () => {
      y = !0, k && URL.revokeObjectURL(k);
    };
  }, [a, t]), R(() => {
    if (!u) return;
    let y = !1;
    return (async () => {
      try {
        const k = await ru(t);
        if (y) return;
        a === "csv" ? T(ou(k)) : a === "json" ? E(su(k)) : a === "markdown" ? I(await iu(k)) : E(k), d(!1);
      } catch (k) {
        if (y) return;
        g(je(k)), h(!0), d(!1);
      }
    })(), () => {
      y = !0;
    };
  }, [a, u, t]), /* @__PURE__ */ m(
    "div",
    {
      className: "fixed inset-0 z-50 flex flex-col bg-zinc-950/95",
      onClick: oe,
      children: [
        /* @__PURE__ */ m("div", { className: "flex items-center gap-3 px-4 py-2 text-zinc-200 border-b border-zinc-800 bg-zinc-900", children: [
          /* @__PURE__ */ o("span", { className: "text-sm font-medium truncate flex-1", children: e.name }),
          /* @__PURE__ */ o("span", { className: "text-xs text-zinc-500 truncate max-w-[200px]", children: e.content_type }),
          typeof e.size_bytes == "number" && /* @__PURE__ */ o("span", { className: "text-xs text-zinc-600 tabular-nums", children: Sr(e.size_bytes) }),
          G && /* @__PURE__ */ m("div", { className: "flex items-center gap-2 text-zinc-400 text-sm border-l border-zinc-700 pl-3 ml-2", children: [
            /* @__PURE__ */ o(
              "button",
              {
                onClick: z,
                className: "hover:text-zinc-100 leading-none px-1",
                "aria-label": "Previous (←)",
                title: "Previous (←)",
                children: "⏮"
              }
            ),
            /* @__PURE__ */ o(
              "button",
              {
                onClick: q,
                className: "hover:text-zinc-100 leading-none px-1",
                "aria-label": "Next (→)",
                title: "Next (→)",
                children: "⏭"
              }
            ),
            /* @__PURE__ */ o(
              "button",
              {
                onClick: () => Y((y) => !y),
                className: `px-1 leading-none ${X ? "text-sky-400" : "hover:text-zinc-100"}`,
                "aria-label": "Toggle shuffle",
                title: X ? "Shuffle on" : "Shuffle off",
                children: "🔀"
              }
            ),
            /* @__PURE__ */ o(
              "button",
              {
                onClick: () => K((y) => !y),
                className: `px-1 leading-none ${P ? "text-sky-400" : "hover:text-zinc-100"}`,
                "aria-label": "Toggle repeat",
                title: P ? "Repeat on" : "Repeat off",
                children: "🔁"
              }
            ),
            /* @__PURE__ */ m("span", { className: "text-xs text-zinc-500 tabular-nums", children: [
              Z >= 0 ? Z + 1 : "–",
              " / ",
              r.length
            ] })
          ] }),
          /* @__PURE__ */ o(
            "button",
            {
              onClick: l,
              className: "text-xs text-sky-400 hover:underline",
              children: "Download"
            }
          ),
          /* @__PURE__ */ o(
            "button",
            {
              onClick: i,
              className: "text-zinc-400 hover:text-zinc-100 text-lg leading-none",
              "aria-label": "Close preview",
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ m(
          "div",
          {
            className: "flex-1 flex items-center justify-center overflow-auto px-4 pt-4 pb-24 relative",
            onClick: oe,
            children: [
              c && !f && /* @__PURE__ */ o("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ o("div", { className: "text-zinc-500 text-xs uppercase tracking-wider", children: A }) }),
              f && /* @__PURE__ */ m("div", { className: "flex flex-col items-center gap-3 text-zinc-300 text-sm max-w-md text-center", children: [
                /* @__PURE__ */ o("span", { className: "text-zinc-500", children: "⚠ Preview couldn't load." }),
                p && /* @__PURE__ */ o("span", { className: "text-zinc-600 text-xs font-mono break-words", children: p }),
                /* @__PURE__ */ o("button", { onClick: l, className: "text-sky-400 hover:underline text-xs", children: "Download instead" })
              ] }),
              !f && a === "video" && /* @__PURE__ */ o(
                "video",
                {
                  src: t,
                  controls: !0,
                  autoPlay: !0,
                  playsInline: !0,
                  preload: "metadata",
                  onLoadedMetadata: ee,
                  onEnded: H,
                  onError: Q,
                  className: "max-h-full max-w-full bg-black rounded shadow-2xl"
                }
              ),
              !f && a === "audio" && /* @__PURE__ */ m("div", { className: "flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl w-full max-w-md", children: [
                /* @__PURE__ */ o("div", { className: "text-3xl select-none", "aria-hidden": "true", children: "♪" }),
                /* @__PURE__ */ o("div", { className: "text-sm text-zinc-200 truncate max-w-full", title: e.name, children: e.name }),
                /* @__PURE__ */ o(
                  "audio",
                  {
                    src: t,
                    controls: !0,
                    autoPlay: !0,
                    preload: "metadata",
                    onEnded: H,
                    onError: Q,
                    className: "w-full"
                  }
                )
              ] }),
              !f && a === "image" && /* @__PURE__ */ o(
                "img",
                {
                  src: t,
                  alt: e.name ?? "",
                  decoding: "async",
                  onLoad: ee,
                  onError: Q,
                  className: "max-h-full max-w-full object-contain rounded shadow-2xl"
                }
              ),
              !f && a === "pdf" && // iframe is more reliably rendered than <embed> across browsers
              // (some refuse <embed> for security reasons; iframe with a
              // direct PDF src gets the native viewer with toolbar/scrub).
              /* @__PURE__ */ o(
                "iframe",
                {
                  src: t,
                  title: e.name ?? "PDF preview",
                  onLoad: ee,
                  className: "w-full h-full bg-white rounded shadow-2xl border-0"
                }
              ),
              !f && a === "heic" && b && /* @__PURE__ */ o(
                "img",
                {
                  src: b,
                  alt: e.name ?? "",
                  decoding: "async",
                  onError: Q,
                  className: "max-h-full max-w-full object-contain rounded shadow-2xl"
                }
              ),
              !f && a === "mkv" && b && /* @__PURE__ */ o(
                "video",
                {
                  src: b,
                  controls: !0,
                  autoPlay: !0,
                  playsInline: !0,
                  preload: "metadata",
                  onLoadedMetadata: ee,
                  onEnded: H,
                  onError: Q,
                  className: "max-h-full max-w-full bg-black rounded shadow-2xl"
                }
              ),
              !f && (a === "text" || a === "json" || a === "yaml") && j !== null && /* @__PURE__ */ o("pre", { className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs font-mono p-4 rounded shadow-2xl whitespace-pre-wrap break-words", children: j }),
              !f && a === "markdown" && O !== null && /* @__PURE__ */ o(
                "div",
                {
                  className: "w-full h-full overflow-auto bg-white text-zinc-900 text-sm p-6 rounded shadow-2xl prose prose-zinc max-w-none",
                  dangerouslySetInnerHTML: { __html: O }
                }
              ),
              !f && a === "csv" && x !== null && /* @__PURE__ */ o("div", { className: "w-full h-full overflow-auto bg-zinc-900 text-zinc-100 text-xs p-4 rounded shadow-2xl", children: /* @__PURE__ */ m("table", { className: "border-collapse", children: [
                x.length > 0 && /* @__PURE__ */ o("thead", { children: /* @__PURE__ */ o("tr", { children: x[0].map((y, k) => /* @__PURE__ */ o("th", { className: "border border-zinc-700 px-2 py-1 text-left font-semibold sticky top-0 bg-zinc-800", children: y }, k)) }) }),
                /* @__PURE__ */ o("tbody", { children: x.slice(1).map((y, k) => /* @__PURE__ */ o("tr", { children: y.map((_, M) => /* @__PURE__ */ o("td", { className: "border border-zinc-800 px-2 py-1 align-top", children: _ }, M)) }, k)) })
              ] }) }),
              a === null && !f && /* @__PURE__ */ m("div", { className: "flex flex-col items-center gap-3 text-zinc-300 text-sm", children: [
                /* @__PURE__ */ m("span", { className: "text-zinc-500", children: [
                  "No inline preview for ",
                  e.content_type ?? "this file type",
                  "."
                ] }),
                /* @__PURE__ */ o("button", { onClick: l, className: "text-sky-400 hover:underline text-xs", children: "Download instead" })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FileBrowser: du
}, Symbol.toStringTag, { value: "Module" }));
function _u({ view: e, filenameBase: t, onExport: n, variant: r = "button" }) {
  const [s, i] = v(!1), [l, a] = v(null), u = U(null);
  R(() => {
    if (!s) return;
    const p = (g) => {
      u.current && !u.current.contains(g.target) && i(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [s]);
  const c = lr(e), d = c === 0, f = async (p) => {
    a(p);
    let g = !1;
    try {
      g = await ar(e, p, t);
    } catch {
      g = !1;
    } finally {
      a(null), i(!1), n?.(p, g);
    }
  }, h = r === "row" ? /* @__PURE__ */ o(
    "button",
    {
      onClick: () => i((p) => !p),
      disabled: d,
      className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-40",
      children: "Export…"
    }
  ) : /* @__PURE__ */ o(
    "button",
    {
      onClick: () => i((p) => !p),
      disabled: d,
      title: d ? "No data to export" : `Export ${c.toLocaleString()} rows`,
      className: "text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0 disabled:opacity-40",
      "aria-label": "Export data",
      children: "↓ Export"
    }
  );
  return /* @__PURE__ */ m("div", { className: "relative", ref: u, children: [
    h,
    s && !d && /* @__PURE__ */ m("div", { className: "absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-30 min-w-[140px]", children: [
      /* @__PURE__ */ m("div", { className: "px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600", children: [
        c.toLocaleString(),
        " rows"
      ] }),
      or.map((p) => /* @__PURE__ */ m(
        "button",
        {
          onClick: () => f(p.key),
          disabled: l != null,
          className: "block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-between",
          children: [
            /* @__PURE__ */ o("span", { children: p.label }),
            l === p.key && /* @__PURE__ */ o("span", { className: "text-zinc-500", children: "…" })
          ]
        },
        p.key
      ))
    ] })
  ] });
}
function hu(e) {
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
function Tu({
  config: e,
  onEvent: t,
  theme: n = "dark",
  templateTrust: r,
  templateTrustPolicy: s
}) {
  const [i, l] = v({});
  R(() => {
    if (!e.templateUrl) return;
    let c = !1;
    return l({}), fetch(e.templateUrl).then((d) => {
      if (!d.ok) throw new Error(`Template fetch failed: ${d.status}`);
      return d.json();
    }).then((d) => {
      if (c) return;
      const f = Object.keys(e.ctx).length > 0 ? {
        ...d,
        context: {
          values: { ...d.context?.values ?? {}, ...e.ctx }
        }
      } : d;
      l({ template: f });
    }).catch((d) => {
      c || l({ error: d instanceof Error ? d.message : "Template load error" });
    }), () => {
      c = !0;
    };
  }, [e.templateUrl, e.ctx]);
  const a = L(() => hu(e), [e]), u = e.templateUrl ? i.template : a;
  return e.templateUrl && i.error ? /* @__PURE__ */ o(Rt, { title: "Embed error", body: i.error, theme: n }) : e.templateUrl && !u ? /* @__PURE__ */ o(Rt, { title: "Loading…", body: "Fetching dashboard template", theme: n }) : u ? /* @__PURE__ */ o("div", { className: `mtc-root mtc-theme-${n}`, "data-theme": n, children: /* @__PURE__ */ o("div", { className: "min-h-screen bg-zinc-950", children: /* @__PURE__ */ o(
    pr,
    {
      template: u,
      backendUrl: e.backendUrl,
      chrome: e.chrome === "full" ? "full" : "minimal",
      onEvent: t,
      theme: n,
      templateTrust: r,
      templateTrustPolicy: s
    }
  ) }) }) : /* @__PURE__ */ o(
    Rt,
    {
      title: "Nothing to embed",
      body: "Pass a ?template= URL, or a ?src= source id (with &backend=), or a ?url= data URL.",
      theme: n
    }
  );
}
function Rt({ title: e, body: t, theme: n }) {
  return /* @__PURE__ */ o("div", { className: `mtc-root mtc-theme-${n}`, "data-theme": n, children: /* @__PURE__ */ o("div", { className: "min-h-screen bg-zinc-950 flex items-center justify-center p-6", children: /* @__PURE__ */ m("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ o("div", { className: "text-sm font-medium text-zinc-200 mb-1", children: e }),
    /* @__PURE__ */ o("div", { className: "text-xs text-zinc-500", children: t })
  ] }) }) });
}
function bu(e) {
  return e === "1" || e === "true" || e === "yes";
}
function $u(e) {
  const t = new URLSearchParams(e.startsWith("?") ? e.slice(1) : e), n = {};
  for (const [c, d] of t.entries())
    if (c.startsWith("ctx.")) {
      const f = c.slice(4);
      f && (n[f] = d);
    }
  const r = t.get("chrome") === "full" ? "full" : "none", s = t.get("title") ?? void 0, i = t.get("backend") ?? void 0, l = t.get("template") ?? void 0;
  if (l)
    return { templateUrl: l, title: s, backendUrl: i, ctx: n, chrome: r };
  const a = t.get("src") ?? void 0, u = t.get("url") ?? void 0;
  if (a || u) {
    const c = t.get("refreshMs"), d = c != null ? Number(c) : NaN;
    return {
      widget: {
        component: t.get("component") ?? "table",
        sourceId: a,
        url: u,
        stream: bu(t.get("stream")),
        refreshIntervalMs: Number.isFinite(d) && d > 0 ? d : void 0
      },
      title: s,
      backendUrl: i,
      ctx: n,
      chrome: r
    };
  }
  return { title: s, backendUrl: i, ctx: n, chrome: r };
}
function Cu(e, t) {
  const n = new URLSearchParams();
  t.templateUrl && n.set("template", t.templateUrl), t.widget && (t.widget.component && n.set("component", t.widget.component), t.widget.sourceId && n.set("src", t.widget.sourceId), t.widget.url && n.set("url", t.widget.url), t.widget.stream && n.set("stream", "1"), t.widget.refreshIntervalMs && n.set("refreshMs", String(t.widget.refreshIntervalMs))), t.title && n.set("title", t.title), t.backendUrl && n.set("backend", t.backendUrl), t.chrome === "full" && n.set("chrome", "full");
  for (const [s, i] of Object.entries(t.ctx ?? {})) n.set(`ctx.${s}`, i);
  const r = n.toString();
  return r ? `${e}?${r}` : e;
}
const Dn = "medallion.terminal.v1.TerminalService";
function gu(e) {
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
function xu(e) {
  const t = (r, s = !1) => ({ name: r, type: "string", isTime: s }), n = (r) => ({ name: r, type: "number" });
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
function Eu(e, t) {
  const n = t.protocol ?? "connect", r = t.endpoint.replace(/\/$/, ""), s = e.map((l) => ({
    id: l.id,
    name: l.name ?? l.id,
    description: l.description,
    shape: l.shape,
    streamable: l.streamable,
    columns: xu(l.shape),
    params: (l.params ?? []).map((a) => ({
      key: a.key,
      required: a.required ?? !1,
      type: gu(a.type),
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
    tables: s
  };
  return n === "connect" && (i.service = Dn, i.getUrl = `${r}/${Dn}/Get`), i;
}
function Ou(e) {
  return JSON.stringify(e, null, 2);
}
function Mu(e) {
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
  Cc as ActionLog,
  Mc as AlertLog,
  Ka as AreaChart,
  sn as BUILTIN_COMPONENTS,
  Nu as BUILTIN_KEYS,
  ra as BarChart,
  tc as Boxplot,
  _i as Candlestick,
  Nl as Catalog,
  ma as Clock,
  uo as CommandPalette,
  fr as DEFAULT_IFRAME_SANDBOX,
  wo as DEFAULT_IFRAME_SANDBOX_DISALLOWED_TOKENS,
  vo as DEFAULT_SENSITIVE_TEMPLATE_HEADERS,
  Me as DEFAULT_UNTRUSTED_TEMPLATE_POLICY,
  fc as Dag,
  pr as Dashboard,
  qn as DashboardContext,
  Li as DataTable,
  il as Distribution,
  Fs as EXTENSION,
  Tu as EmbedView,
  D as Empty,
  gs as ErrorBoundary,
  Yt as ErrorState,
  xl as Events,
  _u as ExportMenu,
  du as FileBrowser,
  nl as Gauge,
  fl as Heatmap,
  Ra as Histogram,
  ur as HoverContext,
  Zs as HoverProvider,
  Ta as Iframe,
  za as Image,
  yc as Json,
  nn as MIME,
  Wi as Metric,
  zu as MultiDashboard,
  gc as MultiSelect,
  Xn as NowContext,
  zs as NowProvider,
  zl as OrderBook,
  de as PALETTE,
  $l as PairedGrid,
  hs as Placeholder,
  el as Prompt,
  ac as Radar,
  Ce as SEMANTIC,
  aa as Scatter,
  Pa as Section,
  Ya as Select,
  po as ShortcutsOverlay,
  Xt as Skeleton,
  Va as Slider,
  kc as Sparkline,
  Xl as StatStrip,
  Fc as Tape,
  Yi as Text,
  Bl as Ticker,
  yi as Timeseries,
  Pl as Trade,
  va as Treemap,
  Wl as VolumeProfile,
  cr as WidgetShell,
  br as abbreviateAxis,
  Qs as applyActions,
  Vn as buildActionRequest,
  ks as buildActionWatchRequest,
  Eu as buildBiDescriptor,
  Cu as buildEmbedUrl,
  vs as buildGenerateRequest,
  ys as buildGenerateUrl,
  Lo as buildSnapshot,
  Gn as buildSubmitActionUrl,
  ws as buildWatchActionUrl,
  Ts as canParsePredicate,
  Mu as connectionFields,
  rn as csvEscape,
  oo as deleteView,
  Ou as descriptorToJson,
  ar as downloadView,
  _s as evaluateAlert,
  Vs as exportFilename,
  Gs as exportView,
  Ds as flatten,
  mi as formatBps,
  Ge as formatCompact,
  fi as formatCurrency,
  di as formatPercent,
  gr as formatStat,
  Ie as formatTimestamp,
  Wn as getNested,
  bs as getWidget,
  Be as interpolate,
  Io as isStaticTemplate,
  dt as isTerminalStatus,
  so as listViews,
  ro as loadView,
  Jn as newClientRequestId,
  $u as parseEmbedConfig,
  eo as readCtxFromUrl,
  Su as registerWidget,
  pi as resolveColor,
  Ss as resolveSource,
  no as saveView,
  qs as serializeText,
  Us as toCsv,
  Bs as toJson,
  Ks as toNdjson,
  Ws as toParquet,
  kr as useAnimatedNumber,
  Qr as useBreakpoint,
  ae as useDashboard,
  os as useDataSource,
  dr as useHover,
  gt as useNow,
  Au as useTabFromUrl,
  Ll as useWatchAction,
  yo as validateTemplate,
  No as validateTemplateTrust,
  lr as viewRowCount,
  an as widgetSnapshotKey,
  to as writeCtxToUrl
};
