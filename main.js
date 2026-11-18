"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PenCanvasPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian3 = require("obsidian");

// src/i18n.ts
var import_obsidian = require("obsidian");
var lang = "auto";
function setLang(l2) {
  lang = l2;
}
function isZh() {
  if (lang !== "auto") return lang === "zh";
  return (0, import_obsidian.getLanguage)().startsWith("zh");
}
var tr = (zh, en) => isZh() ? zh : en;

// node_modules/perfect-freehand/dist/esm/index.mjs
var { PI: e } = Math;
var t = e + 1e-4;
var n = 0.5;
var r = [1, 1];
function i(e2, t2, n2, r2 = (e3) => e3) {
  return e2 * r2(0.5 - t2 * (0.5 - n2));
}
var { min: a } = Math;
function o(e2, t2, n2) {
  let r2 = a(1, t2 / n2);
  return a(1, e2 + (a(1, 1 - r2) - e2) * (r2 * 0.275));
}
function s(e2) {
  return [-e2[0], -e2[1]];
}
function c(e2, t2) {
  return [e2[0] + t2[0], e2[1] + t2[1]];
}
function l(e2, t2, n2) {
  return e2[0] = t2[0] + n2[0], e2[1] = t2[1] + n2[1], e2;
}
function u(e2, t2) {
  return [e2[0] - t2[0], e2[1] - t2[1]];
}
function d(e2, t2, n2) {
  return e2[0] = t2[0] - n2[0], e2[1] = t2[1] - n2[1], e2;
}
function f(e2, t2) {
  return [e2[0] * t2, e2[1] * t2];
}
function p(e2, t2, n2) {
  return e2[0] = t2[0] * n2, e2[1] = t2[1] * n2, e2;
}
function m(e2, t2) {
  return [e2[0] / t2, e2[1] / t2];
}
function h(e2) {
  return [e2[1], -e2[0]];
}
function g(e2, t2) {
  let n2 = t2[0];
  return e2[0] = t2[1], e2[1] = -n2, e2;
}
function ee(e2, t2) {
  return e2[0] * t2[0] + e2[1] * t2[1];
}
function _(e2, t2) {
  return e2[0] === t2[0] && e2[1] === t2[1];
}
function v(e2) {
  return Math.hypot(e2[0], e2[1]);
}
function y(e2, t2) {
  let n2 = e2[0] - t2[0], r2 = e2[1] - t2[1];
  return n2 * n2 + r2 * r2;
}
function b(e2) {
  return m(e2, v(e2));
}
function x(e2, t2) {
  return Math.hypot(e2[1] - t2[1], e2[0] - t2[0]);
}
function S(e2, t2, n2) {
  let r2 = Math.sin(n2), i2 = Math.cos(n2), a2 = e2[0] - t2[0], o2 = e2[1] - t2[1], s2 = a2 * i2 - o2 * r2, c2 = a2 * r2 + o2 * i2;
  return [s2 + t2[0], c2 + t2[1]];
}
function C(e2, t2, n2, r2) {
  let i2 = Math.sin(r2), a2 = Math.cos(r2), o2 = t2[0] - n2[0], s2 = t2[1] - n2[1], c2 = o2 * a2 - s2 * i2, l2 = o2 * i2 + s2 * a2;
  return e2[0] = c2 + n2[0], e2[1] = l2 + n2[1], e2;
}
function w(e2, t2, n2) {
  return c(e2, f(u(t2, e2), n2));
}
function te(e2, t2, n2, r2) {
  let i2 = n2[0] - t2[0], a2 = n2[1] - t2[1];
  return e2[0] = t2[0] + i2 * r2, e2[1] = t2[1] + a2 * r2, e2;
}
function T(e2, t2, n2) {
  return c(e2, f(t2, n2));
}
var E = [0, 0];
var D = [0, 0];
var O = [0, 0];
function k(e2, n2) {
  let r2 = T(e2, b(h(u(e2, c(e2, [1, 1])))), -n2), i2 = [], a2 = 1 / 13;
  for (let n3 = a2; n3 <= 1; n3 += a2) i2.push(S(r2, e2, t * 2 * n3));
  return i2;
}
function A(e2, n2, r2) {
  let i2 = [], a2 = 1 / r2;
  for (let r3 = a2; r3 <= 1; r3 += a2) i2.push(S(n2, e2, t * r3));
  return i2;
}
function j(e2, t2, n2) {
  let r2 = u(t2, n2), i2 = f(r2, 0.5), a2 = f(r2, 0.51);
  return [u(e2, i2), u(e2, a2), c(e2, a2), c(e2, i2)];
}
function M(e2, n2, r2, i2) {
  let a2 = [], o2 = T(e2, n2, r2), s2 = 1 / i2;
  for (let n3 = s2; n3 < 1; n3 += s2) a2.push(S(o2, e2, t * 3 * n3));
  return a2;
}
function ne(e2, t2, n2) {
  return [c(e2, f(t2, n2)), c(e2, f(t2, n2 * 0.99)), u(e2, f(t2, n2 * 0.99)), u(e2, f(t2, n2))];
}
function N(e2, t2, n2) {
  return e2 === false || e2 === void 0 ? 0 : e2 === true ? Math.max(t2, n2) : e2;
}
function re(e2, t2, n2) {
  return e2.slice(0, 10).reduce((e3, r2) => {
    let i2 = r2.pressure;
    return t2 && (i2 = o(e3, r2.distance, n2)), (e3 + i2) / 2;
  }, e2[0].pressure);
}
function P(e2, n2 = {}) {
  let { size: r2 = 16, smoothing: a2 = 0.5, thinning: f2 = 0.5, simulatePressure: m2 = true, easing: _2 = (e3) => e3, start: v2 = {}, end: b2 = {}, last: x2 = false } = n2, { cap: S2 = true, easing: w2 = (e3) => e3 * (2 - e3) } = v2, { cap: T2 = true, easing: P2 = (e3) => --e3 * e3 * e3 + 1 } = b2;
  if (e2.length === 0 || r2 <= 0) return [];
  let F2 = e2[e2.length - 1].runningLength, I2 = N(v2.taper, r2, F2), L2 = N(b2.taper, r2, F2), R2 = (r2 * a2) ** 2, z = [], B = [], V = re(e2, m2, r2), H = i(r2, f2, e2[e2.length - 1].pressure, _2), U, W = e2[0].vector, G = e2[0].point, K = G, q = G, J = K, Y = false;
  for (let n3 = 0; n3 < e2.length; n3++) {
    let { pressure: a3 } = e2[n3], { point: s2, vector: h2, distance: v3, runningLength: b3 } = e2[n3], x3 = n3 === e2.length - 1;
    if (!x3 && F2 - b3 < 3) continue;
    f2 ? (m2 && (a3 = o(V, v3, r2)), H = i(r2, f2, a3, _2)) : H = r2 / 2, U === void 0 && (U = H);
    let S3 = b3 < I2 ? w2(b3 / I2) : 1, T3 = F2 - b3 < L2 ? P2((F2 - b3) / L2) : 1;
    H = Math.max(0.01, H * Math.min(S3, T3));
    let k2 = (x3 ? e2[n3] : e2[n3 + 1]).vector, A2 = x3 ? 1 : ee(h2, k2), j2 = ee(h2, W) < 0 && !Y, M2 = A2 !== null && A2 < 0;
    if (j2 || M2) {
      g(E, W), p(E, E, H);
      for (let e3 = 0; e3 <= 1; e3 += 0.07692307692307693) d(D, s2, E), C(D, D, s2, t * e3), q = [D[0], D[1]], z.push(q), l(O, s2, E), C(O, O, s2, t * -e3), J = [O[0], O[1]], B.push(J);
      G = q, K = J, M2 && (Y = true);
      continue;
    }
    if (Y = false, x3) {
      g(E, h2), p(E, E, H), z.push(u(s2, E)), B.push(c(s2, E));
      continue;
    }
    te(E, k2, h2, A2), g(E, E), p(E, E, H), d(D, s2, E), q = [D[0], D[1]], (n3 <= 1 || y(G, q) > R2) && (z.push(q), G = q), l(O, s2, E), J = [O[0], O[1]], (n3 <= 1 || y(K, J) > R2) && (B.push(J), K = J), V = a3, W = h2;
  }
  let X = [e2[0].point[0], e2[0].point[1]], Z = e2.length > 1 ? [e2[e2.length - 1].point[0], e2[e2.length - 1].point[1]] : c(e2[0].point, [1, 1]), Q = [], $ = [];
  if (e2.length === 1) {
    if (!(I2 || L2) || x2) return k(X, U || H);
  } else {
    I2 || L2 && e2.length === 1 || (S2 ? Q.push(...A(X, B[0], 13)) : Q.push(...j(X, z[0], B[0])));
    let t2 = h(s(e2[e2.length - 1].vector));
    L2 || I2 && e2.length === 1 ? $.push(Z) : T2 ? $.push(...M(Z, t2, H, 29)) : $.push(...ne(Z, t2, H));
  }
  return z.concat($, B.reverse(), Q);
}
var F = [0, 0];
function I(e2) {
  return e2 != null && e2 >= 0;
}
function L(e2, t2 = {}) {
  var _a;
  let { streamline: i2 = 0.5, size: a2 = 16, last: o2 = false } = t2;
  if (e2.length === 0) return [];
  let s2 = 0.15 + (1 - i2) * 0.85, l2 = Array.isArray(e2[0]) ? e2 : e2.map(({ x: e3, y: t3, pressure: r2 = n }) => [e3, t3, r2]);
  if (l2.length === 2) {
    let e3 = l2[1];
    l2 = l2.slice(0, -1);
    for (let t3 = 1; t3 < 5; t3++) l2.push(w(l2[0], e3, t3 / 4));
  }
  l2.length === 1 && (l2 = [...l2, [...c(l2[0], r), ...l2[0].slice(2)]]);
  let u2 = [{ point: [l2[0][0], l2[0][1]], pressure: I(l2[0][2]) ? l2[0][2] : 0.25, vector: [...r], distance: 0, runningLength: 0 }], f2 = false, p2 = 0, m2 = u2[0], h2 = l2.length - 1;
  for (let e3 = 1; e3 < l2.length; e3++) {
    let t3 = o2 && e3 === h2 ? [l2[e3][0], l2[e3][1]] : w(m2.point, l2[e3], s2);
    if (_(m2.point, t3)) continue;
    let r2 = x(t3, m2.point);
    if (p2 += r2, e3 < h2 && !f2) {
      if (p2 < a2) continue;
      f2 = true;
    }
    d(F, m2.point, t3), m2 = { point: t3, pressure: I(l2[e3][2]) ? l2[e3][2] : n, vector: b(F), distance: r2, runningLength: p2 }, u2.push(m2);
  }
  return u2[0].vector = ((_a = u2[1]) == null ? void 0 : _a.vector) || [0, 0], u2;
}
function R(e2, t2 = {}) {
  return P(L(e2, t2), t2);
}

// src/geometry.ts
var cache = /* @__PURE__ */ new WeakMap();
function strokeOutlinePath(points, s2) {
  const outline = R(points, {
    size: s2.size,
    thinning: s2.thinning,
    smoothing: s2.smoothing,
    streamline: s2.streamline,
    simulatePressure: s2.sim,
    last: true
    // same for live and final render -> no shape change on pen-up
  });
  const p2 = new Path2D();
  const n2 = outline.length;
  if (n2 < 2) return p2;
  p2.moveTo(outline[0][0], outline[0][1]);
  for (let i2 = 0; i2 < n2; i2++) {
    const a2 = outline[i2], b2 = outline[(i2 + 1) % n2];
    p2.quadraticCurveTo(a2[0], a2[1], (a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2);
  }
  p2.closePath();
  return p2;
}
function polygonPath(pts) {
  const p2 = new Path2D();
  if (!pts.length) return p2;
  p2.moveTo(pts[0][0], pts[0][1]);
  for (let i2 = 1; i2 < pts.length; i2++) p2.lineTo(pts[i2][0], pts[i2][1]);
  p2.closePath();
  return p2;
}
function arrowGeom(it) {
  const dx = it.x2 - it.x1, dy = it.y2 - it.y1;
  const len = Math.hypot(dx, dy) || 1;
  let h2 = Math.max(it.size * 3.5, 10);
  if (h2 > len * 0.6) h2 = len * 0.6;
  const ux = dx / len, uy = dy / len;
  const bx = it.x2 - ux * h2, by = it.y2 - uy * h2;
  const w2 = h2 * 0.55;
  return {
    shaftEnd: [bx + ux * h2 * 0.2, by + uy * h2 * 0.2],
    head: [[it.x2, it.y2], [bx - uy * w2, by + ux * w2], [bx + uy * w2, by - ux * w2]]
  };
}
function shapePath(it) {
  const p2 = new Path2D();
  const x2 = Math.min(it.x1, it.x2), y2 = Math.min(it.y1, it.y2);
  const w2 = Math.abs(it.x2 - it.x1), h2 = Math.abs(it.y2 - it.y1);
  switch (it.type) {
    case "rect":
      p2.rect(x2, y2, w2, h2);
      return { path: p2 };
    case "ellipse":
      p2.ellipse(x2 + w2 / 2, y2 + h2 / 2, w2 / 2, h2 / 2, 0, 0, Math.PI * 2);
      return { path: p2 };
    case "line":
      p2.moveTo(it.x1, it.y1);
      p2.lineTo(it.x2, it.y2);
      return { path: p2 };
    case "arrow": {
      const g2 = arrowGeom(it);
      p2.moveTo(it.x1, it.y1);
      p2.lineTo(g2.shaftEnd[0], g2.shaftEnd[1]);
      return { path: p2, head: polygonPath(g2.head) };
    }
  }
}
function polyline(it) {
  if (it.type === "stroke") return { pts: it.points, closed: !!it.fill };
  if (it.type === "polygon") return { pts: it.points, closed: true };
  if (it.type === "rect") return { pts: [[it.x1, it.y1], [it.x2, it.y1], [it.x2, it.y2], [it.x1, it.y2]], closed: true };
  if (it.type === "ellipse") {
    const cx = (it.x1 + it.x2) / 2, cy = (it.y1 + it.y2) / 2;
    const rx = Math.abs(it.x2 - it.x1) / 2, ry = Math.abs(it.y2 - it.y1) / 2;
    const pts = [];
    for (let i2 = 0; i2 < 48; i2++) {
      const a2 = i2 / 48 * Math.PI * 2;
      pts.push([cx + rx * Math.cos(a2), cy + ry * Math.sin(a2)]);
    }
    return { pts, closed: true };
  }
  return { pts: [[it.x1, it.y1], [it.x2, it.y2]], closed: false };
}
function getCache(it) {
  var _a;
  let c2 = cache.get(it);
  if (c2) return c2;
  const pl = polyline(it).pts;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const q of pl) {
    if (q[0] < x0) x0 = q[0];
    if (q[0] > x1) x1 = q[0];
    if (q[1] < y0) y0 = q[1];
    if (q[1] > y1) y1 = q[1];
  }
  const pad = it.size * (it.type === "arrow" ? 4 : 1) + 1;
  const bbox = { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  const gbox = { x0, y0, x1, y1 };
  if (it.type === "stroke") {
    c2 = { path: strokeOutlinePath(it.points, it), bbox, gbox, fillPath: it.fill ? polygonPath(it.points) : void 0 };
  } else if (it.type === "polygon") {
    c2 = { path: polygonPath(it.points), bbox, gbox };
    for (const h2 of (_a = it.holes) != null ? _a : []) c2.path.addPath(polygonPath(h2));
  } else {
    const sp = shapePath(it);
    c2 = { path: sp.path, head: sp.head, bbox, gbox };
  }
  cache.set(it, c2);
  return c2;
}
function itemBBox(it) {
  return getCache(it).bbox;
}
function itemGeomBBox(it) {
  return getCache(it).gbox;
}
function intersects(a2, b2) {
  return a2.x0 <= b2.x1 && a2.x1 >= b2.x0 && a2.y0 <= b2.y1 && a2.y1 >= b2.y0;
}
var RES = 4;
var specs = /* @__PURE__ */ new Map();
var patterns = /* @__PURE__ */ new Map();
var screens = /* @__PURE__ */ new Map();
function tileSpec(style, density) {
  const key = `${style}|${density}`;
  const hit = specs.get(key);
  if (hit) return hit;
  const d2 = density <= 10 ? density * 10 : density;
  const TILE = Math.round(800 / Math.max(10, Math.min(100, d2)));
  const size = style === "stipple" ? 512 : TILE;
  const dots = [], lines = [];
  if (style === "hatch" || style === "cross") {
    lines.push(-1, size + 1, size + 1, -1, -1, 1, 1, -1, size - 1, size + 1, size + 1, size - 1);
    if (style === "cross") lines.push(-1, -1, size + 1, size + 1, size - 1, -1, size + 1, 1, -1, size - 1, 1, size + 1);
  } else if (style === "dots") {
    dots.push(size / 4, size / 4, 1.6, size * 3 / 4, size * 3 / 4, 1.6);
  } else {
    let seed = 12345;
    const rnd = () => {
      seed = seed + 1831565813 | 0;
      let t2 = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t2 = t2 + Math.imul(t2 ^ t2 >>> 7, 61 | t2) ^ t2;
      return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
    };
    for (let i2 = 0, n2 = Math.round(size * size * 0.025 * (16 / TILE) ** 2); i2 < n2; i2++) dots.push(rnd() * size, rnd() * size, 0.6 + rnd() * 0.9);
  }
  const nc = Math.max(1, Math.round(size / 32)), cell = size / nc;
  const cellOf = (k2) => Math.min(nc - 1, Math.floor(dots[k2 + 1] / cell)) * nc + Math.min(nc - 1, Math.floor(dots[k2] / cell));
  const start = new Uint32Array(nc * nc + 1);
  for (let k2 = 0; k2 < dots.length; k2 += 3) start[cellOf(k2) + 1]++;
  for (let i2 = 0; i2 < nc * nc; i2++) start[i2 + 1] += start[i2];
  const fill = start.slice(0, nc * nc), sorted = new Float32Array(dots.length);
  for (let k2 = 0; k2 < dots.length; k2 += 3) {
    const at = fill[cellOf(k2)]++ * 3;
    sorted[at] = dots[k2];
    sorted[at + 1] = dots[k2 + 1];
    sorted[at + 2] = dots[k2 + 2];
  }
  const spec = { size, res: Math.min(RES, 2048 / size), dots: sorted, lines, cell, nc, start };
  specs.set(key, spec);
  return spec;
}
function paintTiles(t2, sp, r2) {
  const { size, dots, lines } = sp;
  const i0 = Math.floor((r2.x0 - 2) / size), i1 = Math.floor((r2.x1 + 2) / size);
  const j0 = Math.floor((r2.y0 - 2) / size), j1 = Math.floor((r2.y1 + 2) / size);
  if (dots.length) {
    t2.beginPath();
    const { cell, nc, start } = sp;
    for (let j2 = j0; j2 <= j1; j2++) for (let i2 = i0; i2 <= i1; i2++) {
      const ox = i2 * size, oy = j2 * size;
      const cx0 = Math.max(0, Math.floor((r2.x0 - ox - 2) / cell)), cx1 = Math.min(nc - 1, Math.floor((r2.x1 - ox + 2) / cell));
      const cy0 = Math.max(0, Math.floor((r2.y0 - oy - 2) / cell)), cy1 = Math.min(nc - 1, Math.floor((r2.y1 - oy + 2) / cell));
      for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
        const q = cy * nc + cx;
        for (let k2 = start[q] * 3, e2 = start[q + 1] * 3; k2 < e2; k2 += 3) {
          const x2 = ox + dots[k2], y2 = oy + dots[k2 + 1], rr = dots[k2 + 2];
          if (x2 + rr < r2.x0 || x2 - rr > r2.x1 || y2 + rr < r2.y0 || y2 - rr > r2.y1) continue;
          t2.moveTo(x2 + rr, y2);
          t2.arc(x2, y2, rr, 0, Math.PI * 2);
        }
      }
    }
    t2.fill();
  }
  if (lines.length) {
    t2.lineWidth = 1.2;
    t2.lineCap = "square";
    t2.beginPath();
    for (let j2 = j0; j2 <= j1; j2++) for (let i2 = i0; i2 <= i1; i2++) {
      const ox = i2 * size, oy = j2 * size;
      for (let k2 = 0; k2 < lines.length; k2 += 4) {
        t2.moveTo(ox + lines[k2], oy + lines[k2 + 1]);
        t2.lineTo(ox + lines[k2 + 2], oy + lines[k2 + 3]);
      }
    }
    t2.stroke();
  }
}
function fillPattern(ctx, color, sp, key) {
  const hit = patterns.get(key);
  if (hit) return hit.pat;
  const cv = createEl("canvas");
  cv.width = cv.height = Math.ceil(sp.size * sp.res);
  const t2 = cv.getContext("2d");
  t2.scale(sp.res, sp.res);
  t2.strokeStyle = t2.fillStyle = color;
  paintTiles(t2, sp, { x0: 0, y0: 0, x1: sp.size, y1: sp.size });
  const pat = ctx.createPattern(cv, "repeat");
  if (!pat) return color;
  pat.setTransform(new DOMMatrix().scale(1 / sp.res));
  if (patterns.size >= 12) patterns.delete(patterns.keys().next().value);
  patterns.set(key, { pat, res: sp.res });
  return pat;
}
function patternFill(ctx, it, clip, rule, bbox) {
  var _a, _b;
  const style = it.fillStyle, density = (_a = it.fillDensity) != null ? _a : 50, color = it.fill;
  const sp = tileSpec(style, density);
  const m2 = ctx.getTransform();
  const px = Math.hypot(m2.a, m2.b);
  if (px <= sp.res * 1.1) {
    ctx.fillStyle = fillPattern(ctx, color, sp, `${color}|${style}|${density}`);
    ctx.fill(clip, rule);
    return;
  }
  const cw = ctx.canvas.width, ch = ctx.canvas.height;
  const key = `${color}|${style}|${density}|${m2.a},${m2.b},${m2.c},${m2.d},${m2.e},${m2.f},${cw},${ch}`;
  let L2 = screens.get(key);
  if (!L2) {
    let cv;
    if (screens.size >= 6) {
      const k0 = screens.keys().next().value;
      cv = (_b = screens.get(k0)) == null ? void 0 : _b.cv;
      screens.delete(k0);
    }
    cv != null ? cv : cv = createEl("canvas");
    if (cv.width !== cw || cv.height !== ch) {
      cv.width = cw;
      cv.height = ch;
    }
    const t2 = cv.getContext("2d");
    t2.setTransform(1, 0, 0, 1, 0, 0);
    t2.clearRect(0, 0, cw, ch);
    t2.setTransform(m2);
    t2.fillStyle = t2.strokeStyle = color;
    const inv = m2.inverse();
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [sx, sy] of [[0, 0], [cw, 0], [0, ch], [cw, ch]]) {
      const p2 = inv.transformPoint(new DOMPoint(sx, sy));
      x0 = Math.min(x0, p2.x);
      y0 = Math.min(y0, p2.y);
      x1 = Math.max(x1, p2.x);
      y1 = Math.max(y1, p2.y);
    }
    paintTiles(t2, sp, { x0, y0, x1, y1 });
    L2 = { cv };
    screens.set(key, L2);
  }
  ctx.save();
  ctx.clip(clip, rule);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(L2.cv, 0, 0);
  ctx.restore();
  void bbox;
}
function isFillOnly(it) {
  return it.type === "polygon" && it.size <= 0;
}
function drawItem(ctx, it) {
  drawFill(ctx, it);
  drawLine(ctx, it);
}
function drawFill(ctx, it) {
  if (!it.fill || it.type === "line" || it.type === "arrow") return;
  const c2 = getCache(it);
  const path = it.type === "stroke" ? c2.fillPath : c2.path;
  if (!path) return;
  const rule = it.type === "stroke" ? "nonzero" : "evenodd";
  if (it.fillStyle && it.fillStyle !== "solid") {
    patternFill(ctx, it, path, rule, c2.bbox);
    return;
  }
  ctx.fillStyle = it.fill;
  ctx.fill(path, rule);
}
function drawLine(ctx, it) {
  const c2 = getCache(it);
  if (it.type === "stroke") {
    ctx.fillStyle = it.color;
    ctx.fill(c2.path);
    return;
  }
  if (it.size <= 0) return;
  ctx.strokeStyle = it.color;
  ctx.lineWidth = it.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(c2.path);
  if (c2.head) {
    ctx.fillStyle = it.color;
    ctx.fill(c2.head);
    ctx.stroke(c2.head);
  }
}
var OPEN_GAP = 0.6;
function strokeGap(it) {
  if (it.type !== "stroke" || it.points.length < 3) return null;
  const pts = it.points, a2 = pts[0], z = pts[pts.length - 1];
  const b2 = getCache(it).gbox;
  const gap = Math.hypot(a2[0] - z[0], a2[1] - z[1]);
  return gap < Math.max(8, OPEN_GAP * Math.hypot(b2.x1 - b2.x0, b2.y1 - b2.y0)) ? [z, a2] : null;
}
function hitFill(it, x2, y2, margin = 0) {
  var _a;
  if (!it.fill || it.type === "line" || it.type === "arrow") return false;
  const b2 = getCache(it).gbox;
  if (x2 < b2.x0 || x2 > b2.x1 || y2 < b2.y0 || y2 > b2.y1) return false;
  const pts = polyline(it).pts;
  if (!inPoly(x2, y2, pts)) return false;
  const rings = it.type === "polygon" && it.holes ? [pts, ...it.holes] : [pts];
  if (it.type === "polygon" && ((_a = it.holes) == null ? void 0 : _a.some((h2) => inPoly(x2, y2, h2)))) return false;
  if (margin > 0) for (const ring of rings) for (let i2 = 0; i2 < ring.length; i2++) {
    if (it.type === "stroke" && i2 === ring.length - 1) continue;
    const p2 = ring[i2], q = ring[(i2 + 1) % ring.length];
    if (distSeg(x2, y2, p2[0], p2[1], q[0], q[1]) < margin) return false;
  }
  return true;
}
function detachFill(it) {
  if (!it.fill || it.type === "line" || it.type === "arrow") return null;
  const pts = polyline(it).pts.map((p2) => [round(p2[0], 2), round(p2[1], 2)]);
  if (pts.length < 3) return null;
  return {
    type: "polygon",
    id: uid(),
    color: it.fill,
    size: 0,
    fill: it.fill,
    points: pts,
    ...it.type === "polygon" && it.holes ? { holes: it.holes } : {},
    ...it.fillStyle ? { fillStyle: it.fillStyle } : {},
    ...it.fillDensity ? { fillDensity: it.fillDensity } : {}
  };
}
function polygonArea(pts) {
  let a2 = 0;
  for (let i2 = 0, j2 = pts.length - 1; i2 < pts.length; j2 = i2++) a2 += (pts[j2][0] + pts[i2][0]) * (pts[j2][1] - pts[i2][1]);
  return Math.abs(a2 / 2);
}
function closedOutline(it) {
  if (it.type === "line" || it.type === "arrow" || isFillOnly(it)) return null;
  const { pts } = polyline(it);
  if (it.type !== "stroke") return pts;
  if (pts.length < 3) return null;
  const b2 = getCache(it).gbox;
  const gap = Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
  return gap < Math.max(8, OPEN_GAP * Math.hypot(b2.x1 - b2.x0, b2.y1 - b2.y0)) ? pts : null;
}
function pointInPoly(x2, y2, pts) {
  return inPoly(x2, y2, pts);
}
function drawShape(ctx, it) {
  if (it.type === "polygon") {
    drawShapeWith(ctx, it, polygonPath(it.points));
    return;
  }
  const sp = shapePath(it);
  drawShapeWith(ctx, it, sp.path, sp.head);
}
function drawShapeWith(ctx, it, path, head) {
  if (it.fill && (it.type === "rect" || it.type === "ellipse" || it.type === "polygon")) {
    ctx.fillStyle = it.fill;
    ctx.fill(path);
  }
  ctx.strokeStyle = it.color;
  ctx.lineWidth = it.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(path);
  if (head) {
    ctx.fillStyle = it.color;
    ctx.fill(head);
    ctx.stroke(head);
  }
}
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const l2 = dx * dx + dy * dy;
  let t2 = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
  t2 = Math.max(0, Math.min(1, t2));
  return Math.hypot(ax + t2 * dx - px, ay + t2 * dy - py);
}
function inPoly(x2, y2, pts) {
  let inside = false;
  for (let i2 = 0, j2 = pts.length - 1; i2 < pts.length; j2 = i2++) {
    const xi = pts[i2][0], yi = pts[i2][1], xj = pts[j2][0], yj = pts[j2][1];
    if (yi > y2 !== yj > y2 && x2 < (xj - xi) * (y2 - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function hitItem(it, x2, y2, r2, linesOnly = false) {
  var _a;
  const b2 = getCache(it).bbox;
  if (x2 < b2.x0 - r2 || x2 > b2.x1 + r2 || y2 < b2.y0 - r2 || y2 > b2.y1 + r2) return false;
  const { pts, closed } = polyline(it);
  const tol = it.size / 2 + r2;
  if (linesOnly && isFillOnly(it)) return false;
  if (pts.length === 1) return Math.hypot(pts[0][0] - x2, pts[0][1] - y2) < tol;
  for (let i2 = 1; i2 < pts.length; i2++) if (distSeg(x2, y2, pts[i2 - 1][0], pts[i2 - 1][1], pts[i2][0], pts[i2][1]) < tol) return true;
  if (closed && it.type !== "stroke" && distSeg(x2, y2, pts[pts.length - 1][0], pts[pts.length - 1][1], pts[0][0], pts[0][1]) < tol) return true;
  if (!linesOnly && it.fill && closed && inPoly(x2, y2, pts)) {
    if (it.type === "polygon" && ((_a = it.holes) == null ? void 0 : _a.some((h2) => inPoly(x2, y2, h2)))) return false;
    return true;
  }
  return false;
}
function translateItem(it, dx, dy) {
  if (it.type === "stroke") {
    return { ...it, points: it.points.map((p2) => [round(p2[0] + dx, 2), round(p2[1] + dy, 2), p2[2]]) };
  }
  if (it.type === "polygon") {
    const mv = (ring) => ring.map((p2) => [round(p2[0] + dx, 2), round(p2[1] + dy, 2)]);
    return { ...it, points: mv(it.points), ...it.holes ? { holes: it.holes.map(mv) } : {} };
  }
  return { ...it, x1: round(it.x1 + dx, 2), y1: round(it.y1 + dy, 2), x2: round(it.x2 + dx, 2), y2: round(it.y2 + dy, 2) };
}
function round(v2, d2) {
  const m2 = Math.pow(10, d2);
  return Math.round(v2 * m2) / m2;
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function serialize(d2) {
  const head = JSON.stringify({ type: d2.type, version: d2.version, background: d2.background });
  const items = d2.items.map((i2) => JSON.stringify(i2));
  return head.slice(0, -1) + ',"items":[' + (items.length ? "\n" + items.join(",\n") + "\n" : "") + "]}\n";
}
function emptyDoc(bg) {
  return { type: "pen-canvas", version: 1, background: bg, items: [] };
}
function parseDoc(text) {
  if (!text.trim()) return null;
  const raw = JSON.parse(text);
  if (raw.type !== "pen-canvas" || !Array.isArray(raw.items)) throw new Error(tr("\u4E0D\u662F pen-canvas \u6587\u4EF6", "Not a pen-canvas file"));
  const items = raw.items.filter((i2) => i2 && typeof i2 === "object" && typeof i2.type === "string" && (i2.type === "stroke" || i2.type === "polygon" ? Array.isArray(i2.points) && i2.points.length > 0 : ["rect", "ellipse", "line", "arrow"].includes(i2.type)));
  for (const i2 of items) {
    if (!i2.id) i2.id = uid();
    if (typeof i2.size !== "number") i2.size = 3;
    if (!i2.color) i2.color = "#1e1e1e";
    if (i2.fill === void 0) i2.fill = null;
    if (i2.type === "stroke") {
      if (typeof i2.thinning !== "number") i2.thinning = 0.6;
      if (typeof i2.smoothing !== "number") i2.smoothing = 0.5;
      if (typeof i2.streamline !== "number") i2.streamline = 0.3;
      if (typeof i2.sim !== "boolean") i2.sim = false;
      i2.points = i2.points.map((p2) => [p2[0], p2[1], typeof p2[2] === "number" ? p2[2] : 0.5]);
    }
  }
  return { type: "pen-canvas", version: 1, background: typeof raw.background === "string" ? raw.background : "#ffffff", items };
}
function segsCross(ax, ay, bx, by, cx, cy, dx, dy) {
  const o2 = (px, py, qx, qy, rx, ry) => Math.sign((qx - px) * (ry - py) - (qy - py) * (rx - px));
  return o2(ax, ay, bx, by, cx, cy) !== o2(ax, ay, bx, by, dx, dy) && o2(cx, cy, dx, dy, ax, ay) !== o2(cx, cy, dx, dy, bx, by);
}
function itemTouchesBox(it, b2) {
  if (!intersects(getCache(it).gbox, b2)) return false;
  const { pts, closed } = polyline(it);
  const inBox = (p2) => p2[0] >= b2.x0 && p2[0] <= b2.x1 && p2[1] >= b2.y0 && p2[1] <= b2.y1;
  if (pts.some(inBox)) return true;
  const edges = [[b2.x0, b2.y0, b2.x1, b2.y0], [b2.x1, b2.y0, b2.x1, b2.y1], [b2.x1, b2.y1, b2.x0, b2.y1], [b2.x0, b2.y1, b2.x0, b2.y0]];
  const n2 = pts.length;
  for (let i2 = 0; i2 < (closed ? n2 : n2 - 1); i2++) {
    const p2 = pts[i2], q = pts[(i2 + 1) % n2];
    for (const e2 of edges) if (segsCross(p2[0], p2[1], q[0], q[1], e2[0], e2[1], e2[2], e2[3])) return true;
  }
  return false;
}
function fillRings(it) {
  var _a;
  if (!it.fill || it.type === "line" || it.type === "arrow") return null;
  if (it.type === "stroke") return { rings: [it.points], evenodd: false };
  if (it.type === "polygon") return { rings: [it.points, ...(_a = it.holes) != null ? _a : []], evenodd: true };
  if (it.type === "ellipse") {
    const cx = (it.x1 + it.x2) / 2, cy = (it.y1 + it.y2) / 2;
    const rx = Math.abs(it.x2 - it.x1) / 2, ry = Math.abs(it.y2 - it.y1) / 2;
    const pts = [];
    for (let i2 = 0; i2 < 128; i2++) {
      const a2 = i2 / 128 * Math.PI * 2;
      pts.push([cx + rx * Math.cos(a2), cy + ry * Math.sin(a2)]);
    }
    return { rings: [pts], evenodd: true };
  }
  return { rings: [polyline(it).pts], evenodd: true };
}
function patternTile(density) {
  const d2 = density <= 10 ? density * 10 : density;
  return Math.round(800 / Math.max(10, Math.min(100, d2)));
}

// src/fill.ts
var MAX_CELLS = 4e6;
function bucketRegion(items, vb, scale, wx, wy, gapPx = 5) {
  let k2 = scale;
  let W = Math.ceil((vb.x1 - vb.x0) * k2), H = Math.ceil((vb.y1 - vb.y0) * k2);
  if (W * H > MAX_CELLS) {
    const f2 = Math.sqrt(MAX_CELLS / (W * H));
    k2 *= f2;
    W = Math.ceil(W * f2);
    H = Math.ceil(H * f2);
  }
  const cv = createEl("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.setTransform(k2, 0, 0, k2, -vb.x0 * k2, -vb.y0 * k2);
  for (const it of items) {
    if (!intersects(itemBBox(it), vb)) continue;
    drawLine(ctx, it);
    const g2 = strokeGap(it);
    if (g2) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = Math.max(it.size, 1.5 / k2);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(g2[0][0], g2[0][1]);
      ctx.lineTo(g2[1][0], g2[1][1]);
      ctx.stroke();
    }
  }
  const data = ctx.getImageData(0, 0, W, H).data;
  const wall = new Uint8Array(W * H);
  for (let i2 = 0; i2 < W * H; i2++) if (data[i2 * 4 + 3] > 8) wall[i2] = 1;
  const close = 1 + Math.round(gapPx / 2 * (k2 / scale));
  const wall2 = dilate(wall, W, H, close, null);
  const sx = Math.floor((wx - vb.x0) * k2), sy = Math.floor((wy - vb.y0) * k2);
  if (sx < 0 || sy < 0 || sx >= W || sy >= H) return { kind: "open" };
  if (wall2[sy * W + sx]) return { kind: "wall" };
  const reg = new Uint8Array(W * H);
  const stack = new Int32Array(W * H);
  let sp = 0;
  stack[sp++] = sy * W + sx;
  reg[sy * W + sx] = 1;
  while (sp) {
    const i2 = stack[--sp];
    const x2 = i2 % W, y2 = (i2 - x2) / W;
    if (x2 === 0 || y2 === 0 || x2 === W - 1 || y2 === H - 1) return { kind: "open" };
    for (const j2 of [i2 - 1, i2 + 1, i2 - W, i2 + W]) if (!reg[j2] && !wall2[j2]) {
      reg[j2] = 1;
      stack[sp++] = j2;
    }
  }
  let cur = dilate(reg, W, H, close, wall);
  let filled = 0;
  for (let i2 = 0; i2 < W * H; i2++) filled += cur[i2];
  cur = dilate(cur, W, H, Math.max(2, Math.round(2 * k2 / scale)), null);
  const rings = traceRings(cur, W, H).map(
    (ring) => simplifyClosed(ring, 0.8).map(([x2, y2]) => [round(vb.x0 + (x2 + 0.5) / k2, 2), round(vb.y0 + (y2 + 0.5) / k2, 2)])
  ).filter((r2) => r2.length >= 3);
  return { kind: "region", rings, area: filled / (k2 * k2) };
}
var CASES = [
  [],
  ["LB"],
  ["BR"],
  ["LR"],
  ["TR"],
  ["TR", "LB"],
  ["TB"],
  ["TL"],
  ["TL"],
  ["TB"],
  ["TL", "BR"],
  ["TR"],
  ["LR"],
  ["BR"],
  ["LB"],
  []
];
function traceRings(m2, W, H) {
  const at = (x2, y2) => x2 >= 0 && y2 >= 0 && x2 < W && y2 < H ? m2[y2 * W + x2] : 0;
  const key = (x2, y2) => (y2 + 2) * (2 * W + 8) + (x2 + 2);
  const adj = /* @__PURE__ */ new Map();
  const pos = /* @__PURE__ */ new Map();
  const link = (a2, b2) => {
    const la = adj.get(a2), lb = adj.get(b2);
    if (la) la.push(b2);
    else adj.set(a2, [b2]);
    if (lb) lb.push(a2);
    else adj.set(b2, [a2]);
  };
  for (let y2 = -1; y2 < H; y2++) for (let x2 = -1; x2 < W; x2++) {
    const c2 = at(x2, y2) << 3 | at(x2 + 1, y2) << 2 | at(x2 + 1, y2 + 1) << 1 | at(x2, y2 + 1);
    for (const seg of CASES[c2]) {
      const pts = seg.split("").map((e2) => {
        const p2 = e2 === "T" ? [x2 + 0.5, y2] : e2 === "R" ? [x2 + 1, y2 + 0.5] : e2 === "B" ? [x2 + 0.5, y2 + 1] : [x2, y2 + 0.5];
        const kk = key(Math.round(p2[0] * 2), Math.round(p2[1] * 2));
        pos.set(kk, p2);
        return kk;
      });
      link(pts[0], pts[1]);
    }
  }
  const used = /* @__PURE__ */ new Set();
  const rings = [];
  for (const start of adj.keys()) {
    if (used.has(start)) continue;
    const ring = [];
    let prev = -1, cur = start;
    while (!used.has(cur)) {
      used.add(cur);
      ring.push(pos.get(cur));
      const n2 = adj.get(cur);
      const next = n2[0] !== prev ? n2[0] : n2[1];
      prev = cur;
      cur = next;
    }
    rings.push(ring);
  }
  return rings;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts.slice();
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
  let maxD = -1, idx = 0;
  for (let i2 = 1; i2 < pts.length - 1; i2++) {
    const d2 = len ? Math.abs((pts[i2][0] - ax) * dy - (pts[i2][1] - ay) * dx) / len : Math.hypot(pts[i2][0] - ax, pts[i2][1] - ay);
    if (d2 > maxD) {
      maxD = d2;
      idx = i2;
    }
  }
  if (maxD <= eps) return [pts[0], pts[pts.length - 1]];
  return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
}
function simplifyClosed(ring, eps) {
  if (ring.length < 8) return ring;
  const half = Math.floor(ring.length / 2);
  const a2 = rdp(ring.slice(0, half + 1), eps), b2 = rdp(ring.slice(half).concat([ring[0]]), eps);
  return a2.slice(0, -1).concat(b2.slice(0, -1));
}
function dilate(src, W, H, n2, block) {
  let cur = src;
  for (let step = 0; step < n2; step++) {
    const nx = cur.slice();
    for (let y2 = 1; y2 < H - 1; y2++) for (let x2 = 1; x2 < W - 1; x2++) {
      const i2 = y2 * W + x2;
      if (cur[i2] || block && block[i2]) continue;
      if (cur[i2 - 1] || cur[i2 + 1] || cur[i2 - W] || cur[i2 + W]) nx[i2] = 1;
    }
    cur = nx;
  }
  return cur;
}

// src/glfill.ts
var VS = `#version 300 es
in vec2 a_pos;
uniform vec2 u_scale;
uniform vec2 u_off;
uniform vec2 u_shift;
out vec2 v_world;
void main() {
	v_world = a_pos;
	gl_Position = vec4((a_pos + u_shift) * u_scale + u_off, 0.0, 1.0);
}`;
var FS = `#version 300 es
precision highp float;
precision highp int;
in vec2 v_world;
uniform vec4 u_color;
uniform int u_style;
uniform float u_tile;
uniform float u_px;
out vec4 o;

uint hash(uvec2 p) {
	uint h = p.x * 1597334677u ^ p.y * 3812015801u;
	h ^= h >> 16; h *= 0x7feb352du; h ^= h >> 15; h *= 0x846ca68bu; h ^= h >> 16;
	return h;
}
float rnd(inout uint s) {
	s = s * 747796405u + 2891336453u;
	uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
	w = (w >> 22u) ^ w;
	return float(w) / 4294967296.0;
}
float cover(float r, float d, float px) { return clamp((r - d) / px + 0.5, 0.0, 1.0); }

void main() {
	vec2 p = v_world;
	float T = u_tile, px = u_px, a = 1.0;
	if (u_style == 1 || u_style == 2) {
		float s = T * 0.70710678; // distance between parallel lines
		float c = cover(0.6, abs(fract((p.x + p.y) / T + 0.5) - 0.5) * s, px);
		float mean = 1.2 / s;
		if (u_style == 2) {
			c = max(c, cover(0.6, abs(fract((p.x - p.y) / T + 0.5) - 0.5) * s, px));
			mean = 2.0 * mean - mean * mean;
		}
		a = mix(c, min(mean, 1.0), smoothstep(0.25 * s, 0.7 * s, px));
	} else if (u_style == 3) {
		vec2 q = mod(p, T);
		float d = min(length(q - vec2(T * 0.25)), length(q - vec2(T * 0.75)));
		float mean = 2.0 * 3.14159265 * 1.6 * 1.6 / (T * T);
		a = mix(cover(1.6, d, px), min(mean, 1.0), smoothstep(1.0, 3.2, px));
	} else if (u_style == 4) {
		// "Electron cloud": each cell holds a dot with probability KEEP at a hashed position. Dot radius is
		// capped at half a cell, so only the 2x2 cells nearest the pixel can touch it.
		float rho = 0.025 * (16.0 / T) * (16.0 / T);
		const float KEEP = 0.6;
		float cs = sqrt(KEEP / rho);
		float mean = min(rho * 3.676, 1.0);
		float w = smoothstep(0.6, 2.4, px);
		if (w >= 1.0) { a = mean; } else {
			vec2 q = p / cs - 0.5;
			vec2 g = floor(q);
			float best = 0.0;
			for (int j = 0; j <= 1; j++) for (int i = 0; i <= 1; i++) {
				vec2 cc = g + vec2(float(i), float(j));
				uint s = hash(uvec2(ivec2(cc)));
				float keep = rnd(s);
				vec2 c = (cc + vec2(rnd(s), rnd(s))) * cs;
				float r = min(0.6 + 0.9 * rnd(s), 0.5 * cs);
				if (keep < KEEP) best = max(best, cover(r, length(p - c), px));
			}
			a = mix(best, mean, w);
		}
	}
	// No discard: the cover pass must run on every marked pixel so it can clear the stencil.
	float al = u_color.a * a;
	o = vec4(u_color.rgb * al, al);
}`;
var STYLE = { solid: 0, hatch: 1, cross: 2, dots: 3, stipple: 4 };
var geoCache = /* @__PURE__ */ new WeakMap();
function geometry(it) {
  const hit = geoCache.get(it);
  if (hit) return hit;
  const fr = fillRings(it);
  if (!fr) return null;
  const tri = [];
  for (const ring of fr.rings) {
    if (ring.length < 3) continue;
    const x02 = ring[0][0], y02 = ring[0][1];
    for (let i2 = 1; i2 < ring.length - 1; i2++) tri.push(x02, y02, ring[i2][0], ring[i2][1], ring[i2 + 1][0], ring[i2 + 1][1]);
  }
  const b2 = itemGeomBBox(it);
  const x0 = b2.x0 - 1, y0 = b2.y0 - 1, x1 = b2.x1 + 1, y1 = b2.y1 + 1;
  const g2 = { tri: Float32Array.from(tri), quad: Float32Array.of(x0, y0, x1, y0, x1, y1, x0, y0, x1, y1, x0, y1), evenodd: fr.evenodd };
  geoCache.set(it, g2);
  return g2;
}
var colorCache = /* @__PURE__ */ new Map();
var colorCtx = null;
function parseColor(c2) {
  const hit = colorCache.get(c2);
  if (hit) return hit;
  if (!colorCtx) {
    const cv = createEl("canvas");
    cv.width = cv.height = 1;
    colorCtx = cv.getContext("2d", { willReadFrequently: true });
  }
  const ctx = colorCtx;
  if (!ctx) return [0, 0, 0, 1];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000";
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, 1, 1);
  const d2 = ctx.getImageData(0, 0, 1, 1).data;
  const v2 = [d2[0] / 255, d2[1] / 255, d2[2] / 255, d2[3] / 255];
  if (colorCache.size > 256) colorCache.clear();
  colorCache.set(c2, v2);
  return v2;
}
var GLFillLayer = class _GLFillLayer {
  constructor(gl) {
    this.loc = {};
    // Uploaded vertex data: all fills of the document, rebuilt only when the item list changes.
    this.uploaded = [];
    this.offsets = /* @__PURE__ */ new Map();
    this.lost = false;
    var _a;
    this.gl = gl;
    const sh = (type, src) => {
      var _a2;
      const s2 = gl.createShader(type);
      gl.shaderSource(s2, src);
      gl.compileShader(s2);
      if (!gl.getShaderParameter(s2, gl.COMPILE_STATUS)) throw new Error((_a2 = gl.getShaderInfoLog(s2)) != null ? _a2 : "shader");
      return s2;
    };
    const p2 = gl.createProgram();
    gl.attachShader(p2, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(p2, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(p2);
    if (!gl.getProgramParameter(p2, gl.LINK_STATUS)) throw new Error((_a = gl.getProgramInfoLog(p2)) != null ? _a : "link");
    this.prog = p2;
    for (const n2 of ["u_scale", "u_off", "u_shift", "u_color", "u_style", "u_tile", "u_px"]) this.loc[n2] = gl.getUniformLocation(p2, n2);
    this.aPos = gl.getAttribLocation(p2, "a_pos");
    this.buf = gl.createBuffer();
    gl.canvas.addEventListener("webglcontextlost", (e2) => {
      e2.preventDefault();
      this.lost = true;
    });
  }
  static create(cv) {
    try {
      const gl = cv.getContext("webgl2", { stencil: true, antialias: true, premultipliedAlpha: true, alpha: true, depth: false });
      if (!gl) return null;
      return new _GLFillLayer(gl);
    } catch (e2) {
      console.warn("[pen-canvas] WebGL fill layer unavailable", e2);
      return null;
    }
  }
  upload(items) {
    const same = items.length === this.uploaded.length && items.every((it, i2) => it === this.uploaded[i2]);
    if (same) return;
    const gl = this.gl;
    const parts = [];
    let n2 = 0;
    this.offsets.clear();
    for (const it of items) {
      const g2 = geometry(it);
      if (!g2) continue;
      this.offsets.set(it, { tri: n2 / 2, triN: g2.tri.length / 2, quad: (n2 + g2.tri.length) / 2 });
      parts.push(g2.tri, g2.quad);
      n2 += g2.tri.length + g2.quad.length;
    }
    const all = new Float32Array(n2);
    let at = 0;
    for (const p2 of parts) {
      all.set(p2, at);
      at += p2.length;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, all, gl.DYNAMIC_DRAW);
    this.uploaded = items.slice();
  }
  /**
   * Draw all fills. k = device pixels per world unit, (tx, ty) = device-pixel translation,
   * vb = visible world box, shift(it) = extra world offset for items being dragged.
   */
  render(items, k2, tx, ty, vb, shift) {
    var _a, _b, _c, _d;
    if (this.lost) return;
    const gl = this.gl;
    const W = gl.canvas.width, H = gl.canvas.height;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clearStencil(0);
    gl.stencilMask(255);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    const fills = items.filter((it) => it.fill && it.type !== "line" && it.type !== "arrow");
    if (!fills.length) return;
    this.upload(fills);
    gl.useProgram(this.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.enableVertexAttribArray(this.aPos);
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.loc.u_scale, 2 * k2 / W, -2 * k2 / H);
    gl.uniform2f(this.loc.u_off, 2 * tx / W - 1, 1 - 2 * ty / H);
    gl.uniform1f(this.loc.u_px, 1 / k2);
    gl.enable(gl.STENCIL_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE);
    for (const it of fills) {
      const off = this.offsets.get(it);
      if (!off || !off.triN) continue;
      const sh = (_a = shift == null ? void 0 : shift(it)) != null ? _a : null;
      const b2 = itemGeomBBox(it);
      const bb = sh ? { x0: b2.x0 + sh[0], y0: b2.y0 + sh[1], x1: b2.x1 + sh[0], y1: b2.y1 + sh[1] } : b2;
      if (!intersects(bb, vb)) continue;
      gl.uniform2f(this.loc.u_shift, sh ? sh[0] : 0, sh ? sh[1] : 0);
      const evenodd = geoCache.get(it).evenodd;
      gl.colorMask(false, false, false, false);
      gl.stencilFunc(gl.ALWAYS, 0, 255);
      if (evenodd) {
        gl.stencilMask(1);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INVERT);
      } else {
        gl.stencilMask(255);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);
      }
      gl.drawArrays(gl.TRIANGLES, off.tri, off.triN);
      gl.colorMask(true, true, true, true);
      gl.stencilMask(255);
      gl.stencilFunc(gl.NOTEQUAL, 0, 255);
      gl.stencilOp(gl.ZERO, gl.ZERO, gl.ZERO);
      const [r2, g2, bl, a2] = parseColor(it.fill);
      gl.uniform4f(this.loc.u_color, r2, g2, bl, a2);
      const style = (_b = it.fillStyle) != null ? _b : "solid";
      gl.uniform1i(this.loc.u_style, (_c = STYLE[style]) != null ? _c : 0);
      gl.uniform1f(this.loc.u_tile, patternTile((_d = it.fillDensity) != null ? _d : 50));
      gl.drawArrays(gl.TRIANGLES, off.quad, 6);
    }
    gl.disable(gl.STENCIL_TEST);
  }
  clear() {
    if (this.lost) return;
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  dispose() {
    var _a;
    (_a = this.gl.getExtension("WEBGL_lose_context")) == null ? void 0 : _a.loseContext();
  }
};

// src/livestroke.ts
var FIXED_PI = Math.PI + 1e-4;
var RATE = 0.275;
var START_SEG = 13;
var END_SEG = 29;
var CORNER_SEG = 13;
var END_NOISE = 3;
var MIN_RADIUS = 0.01;
var DEFAULT_FIRST_PRESSURE = 0.25;
var DEFAULT_PRESSURE = 0.5;
var add = (a2, b2) => [a2[0] + b2[0], a2[1] + b2[1]];
var sub = (a2, b2) => [a2[0] - b2[0], a2[1] - b2[1]];
var mul = (a2, n2) => [a2[0] * n2, a2[1] * n2];
var per = (a2) => [a2[1], -a2[0]];
var neg = (a2) => [-a2[0], -a2[1]];
var dpr = (a2, b2) => a2[0] * b2[0] + a2[1] * b2[1];
var uni = (a2) => {
  const l2 = Math.hypot(a2[0], a2[1]);
  return [a2[0] / l2, a2[1] / l2];
};
var dist = (a2, b2) => Math.hypot(a2[1] - b2[1], a2[0] - b2[0]);
var dist2 = (a2, b2) => {
  const dx = a2[0] - b2[0], dy = a2[1] - b2[1];
  return dx * dx + dy * dy;
};
var lrp = (a2, b2, t2) => add(a2, mul(sub(b2, a2), t2));
var prj = (a2, b2, c2) => add(a2, mul(b2, c2));
function rot(a2, c2, r2) {
  const s2 = Math.sin(r2), co = Math.cos(r2), px = a2[0] - c2[0], py = a2[1] - c2[1];
  return [px * co - py * s2 + c2[0], px * s2 + py * co + c2[1]];
}
var validP = (p2) => p2 != null && p2 >= 0;
function simP(prev, distance, size) {
  const sp = Math.min(1, distance / size), rp = Math.min(1, 1 - sp);
  return Math.min(1, prev + (rp - prev) * (sp * RATE));
}
function startCap(first, right0) {
  const cap = [], step = 1 / START_SEG;
  for (let t2 = step; t2 <= 1; t2 += step) cap.push(rot(right0, first, FIXED_PI * t2));
  return cap;
}
var LiveOutline = class {
  constructor(o2) {
    this.o = o2;
    /** Frozen outline points (left and right side), never change once added. */
    this.L = [];
    this.R = [];
    /** Raw input points consumed into the frozen prefix. */
    this.rawFrozen = 0;
    this.sp = [];
    this.a = null;
    this.b = null;
    this.initP = 0;
    this.t = 0.15 + (1 - o2.streamline) * 0.85;
    this.minD = Math.pow(o2.size * o2.smoothing, 2);
  }
  stepA(out, st, p2, isLast) {
    const point = isLast ? [p2[0], p2[1]] : lrp(st.prev.point, p2, this.t);
    if (st.prev.point[0] === point[0] && st.prev.point[1] === point[1]) return;
    const distance = dist(point, st.prev.point);
    st.rl += distance;
    if (!isLast && !st.reached) {
      if (st.rl < this.o.size) return;
      st.reached = true;
    }
    const d2 = sub(st.prev.point, point);
    st.prev = { point, pressure: validP(p2[2]) ? p2[2] : DEFAULT_PRESSURE, vector: uni(d2), distance, runningLength: st.rl };
    out.push(st.prev);
  }
  /** One iteration of getStrokeOutlinePoints' main loop. */
  stepB(get, n2, total, st, L2, R2) {
    const j2 = st.j++;
    const o2 = this.o;
    const { point, vector, distance, runningLength } = get(j2);
    let { pressure } = get(j2);
    const isLast = j2 === n2 - 1;
    if (!isLast && total - runningLength < END_NOISE) return;
    let radius;
    if (o2.thinning) {
      if (o2.sim) pressure = simP(st.prevPressure, distance, o2.size);
      radius = o2.size * (0.5 - o2.thinning * (0.5 - pressure));
    } else radius = o2.size / 2;
    radius = Math.max(MIN_RADIUS, radius * 1);
    st.radius = radius;
    const nextVector = (!isLast ? get(j2 + 1) : get(j2)).vector;
    const nextDpr = !isLast ? dpr(vector, nextVector) : 1;
    const prevDpr = dpr(vector, st.prevVector);
    const isSharp = prevDpr < 0 && !st.sharpPrev;
    const isNextSharp = nextDpr !== null && nextDpr < 0;
    if (isSharp || isNextSharp) {
      const off2 = mul(per(st.prevVector), radius);
      const step = 1 / CORNER_SEG;
      let tl2 = st.prevL, tr3 = st.prevR;
      for (let t2 = 0; t2 <= 1; t2 += step) {
        tl2 = rot(sub(point, off2), point, FIXED_PI * t2);
        L2.push(tl2);
        tr3 = rot(add(point, off2), point, FIXED_PI * -t2);
        R2.push(tr3);
      }
      st.prevL = tl2;
      st.prevR = tr3;
      if (isNextSharp) st.sharpPrev = true;
      return;
    }
    st.sharpPrev = false;
    if (isLast) {
      const off2 = mul(per(vector), radius);
      L2.push(sub(point, off2));
      R2.push(add(point, off2));
      return;
    }
    const off = mul(per(lrp(nextVector, vector, nextDpr)), radius);
    const tl = sub(point, off);
    if (j2 <= 1 || dist2(st.prevL, tl) > this.minD) {
      L2.push(tl);
      st.prevL = tl;
    }
    const tr2 = add(point, off);
    if (j2 <= 1 || dist2(st.prevR, tr2) > this.minD) {
      R2.push(tr2);
      st.prevR = tr2;
    }
    st.prevPressure = pressure;
    st.prevVector = vector;
  }
  initialPressure() {
    const o2 = this.o;
    return this.sp.slice(0, 10).reduce((acc, cur) => {
      const p2 = o2.sim ? simP(acc, cur.distance, o2.size) : cur.pressure;
      return (acc + p2) / 2;
    }, this.sp[0].pressure);
  }
  /**
   * Freeze raw points [rawFrozen, upto). Only call with at least a few dozen raw points left unfrozen
   * after upto. Returns true when new outline points were frozen.
   */
  advance(raw, upto) {
    if (upto <= this.rawFrozen || upto >= raw.length) return false;
    if (!this.a) {
      if (raw.length < 3) return false;
      const p0 = raw[0];
      this.sp.push({ point: [p0[0], p0[1]], pressure: validP(p0[2]) ? p0[2] : DEFAULT_FIRST_PRESSURE, vector: [1, 1], distance: 0, runningLength: 0 });
      this.a = { prev: this.sp[0], rl: 0, reached: false };
      this.rawFrozen = 1;
    }
    for (let i2 = this.rawFrozen; i2 < upto; i2++) this.stepA(this.sp, this.a, raw[i2], false);
    this.rawFrozen = upto;
    const sp = this.sp, n2 = sp.length;
    if (n2 < 12) return false;
    if (!this.b) {
      sp[0].vector = sp[1].vector;
      this.initP = this.initialPressure();
      this.b = { j: 0, prevPressure: this.initP, prevVector: sp[0].vector, prevL: sp[0].point, prevR: sp[0].point, sharpPrev: false, radius: 0 };
    }
    const safe = sp[n2 - 1].runningLength - END_NOISE - 1;
    const before = this.L.length + this.R.length;
    const get = (j2) => sp[j2];
    while (this.b.j < n2 - 2 && sp[this.b.j].runningLength < safe) this.stepB(get, Infinity, Infinity, this.b, this.L, this.R);
    return this.L.length + this.R.length > before;
  }
  get first() {
    return this.sp[0].point;
  }
  /** True once advance() has frozen outline points; tail() is only valid then. */
  get ready() {
    return !!this.b && this.R.length > 0 && this.L.length > 0;
  }
  /** Outline of the not-yet-frozen part: left points, end cap, right points (all in forward order). */
  tail(raw, pred) {
    const a0 = this.a, b0 = this.b;
    const st = { prev: a0.prev, rl: a0.rl, reached: a0.reached };
    const T2 = [];
    const total = raw.length + pred.length;
    for (let i2 = this.rawFrozen; i2 < total; i2++) {
      const p2 = i2 < raw.length ? raw[i2] : pred[i2 - raw.length];
      this.stepA(T2, st, p2, i2 === total - 1);
    }
    const sp = this.sp, n0 = sp.length, n2 = n0 + T2.length;
    const get = (j2) => j2 < n0 ? sp[j2] : T2[j2 - n0];
    const tl = get(n2 - 1).runningLength;
    const bs = { ...b0 };
    const L2 = [], R2 = [];
    while (bs.j < n2) this.stepB(get, n2, tl, bs, L2, R2);
    const last = get(n2 - 1);
    const lastPoint = [last.point[0], last.point[1]];
    const dir = per(neg(last.vector));
    const cap = [], step = 1 / END_SEG, start = prj(lastPoint, dir, bs.radius);
    for (let t2 = step; t2 < 1; t2 += step) cap.push(rot(start, lastPoint, FIXED_PI * 3 * t2));
    return { L: L2, R: R2, cap };
  }
  /** Full outline, identical to getStroke(raw ++ pred, { ..., last: true }). For tests. */
  full(raw, pred = []) {
    const t2 = this.tail(raw, pred);
    const L2 = this.L.concat(t2.L), R2 = this.R.concat(t2.R);
    const sc = startCap(this.sp[0].point, R2[0]);
    return L2.concat(t2.cap, R2.reverse(), sc);
  }
};
function smoothPath(pts, fromVertex = true) {
  const p2 = new Path2D();
  const n2 = pts.length;
  if (n2 < 2) return p2;
  if (fromVertex) p2.moveTo(pts[0][0], pts[0][1]);
  else p2.moveTo((pts[n2 - 1][0] + pts[0][0]) / 2, (pts[n2 - 1][1] + pts[0][1]) / 2);
  for (let i2 = 0; i2 < n2; i2++) {
    const a2 = pts[i2], b2 = pts[(i2 + 1) % n2];
    p2.quadraticCurveTo(a2[0], a2[1], (a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2);
  }
  p2.closePath();
  return p2;
}

// src/view.ts
var import_obsidian2 = require("obsidian");

// src/types.ts
var fillStyles = () => [
  ["solid", tr("\u5B9E\u5FC3", "Solid")],
  ["hatch", tr("\u659C\u7EBF", "Hatch")],
  ["cross", tr("\u7F51\u683C\u7EBF", "Crosshatch")],
  ["dots", tr("\u5706\u70B9", "Dots")],
  ["stipple", tr("\u7535\u5B50\u4E91\uFF08\u968F\u673A\u70B9\uFF09", "Stipple (random dots)")]
];
var DEFAULT_SETTINGS = {
  penOnly: true,
  thinning: 0.6,
  smoothing: 0.5,
  streamline: 0.3,
  pressureGamma: 1,
  prediction: true,
  desynchronized: true,
  defaultBackground: "#ffffff",
  bgChosen: false,
  snap: true,
  leftHand: false,
  fillGap: 5,
  glFill: true,
  hubX: 0,
  hubY: 0,
  recentColors: [],
  lastShape: "rect",
  lang: "auto"
};

// src/view.ts
var VIEW_TYPE = "pen-canvas-view";
function mixHex(a2, b2, t2) {
  const p2 = (h2, i2) => parseInt(h2.slice(1 + 2 * i2, 3 + 2 * i2), 16);
  return "#" + [0, 1, 2].map((i2) => Math.round(p2(a2, i2) + (p2(b2, i2) - p2(a2, i2)) * t2).toString(16).padStart(2, "0")).join("");
}
function textOn(c2) {
  const p2 = (i2) => parseInt(c2.slice(1 + 2 * i2, 3 + 2 * i2), 16) / 255;
  return 0.2126 * p2(0) + 0.7152 * p2(1) + 0.0722 * p2(2) > 0.55 ? "#1e1e1e" : "#ffffff";
}
var FAN_COLUMNS = [
  ["#1e1e1e", "#5c5c5c", "#8a8a8a", "#ffffff"],
  ...[
    "#e93147",
    "#ec7500",
    "#e0ac00",
    "#08b94e",
    "#00bfbc",
    "#086ddd",
    "#7852ee",
    "#d53984",
    "#8b5a2b",
    "#7cb342",
    "#00897b",
    "#3f51b5",
    "#ad1457",
    "#6d4c41"
  ].map((c2) => [mixHex(c2, "#000000", 0.35), c2, mixHex(c2, "#ffffff", 0.4), mixHex(c2, "#ffffff", 0.7)]),
  ["custom"]
];
var SLOW_MS = 10;
var clipboard = [];
var pasteCount = 0;
(0, import_obsidian2.addIcon)("pc-left-hand", '<g transform="translate(100,0) scale(-4.1667,4.1667)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></g>');
var EXT = "pencanvas";
var DARK_BG = "#1e1e1e";
var DARK_BG_CONST = DARK_BG;
var backgrounds = () => [
  [tr("\u6697\u8272", "Dark"), DARK_BG_CONST],
  [tr("\u767D\u8272", "White"), "#ffffff"],
  [tr("\u7C73\u9EC4", "Cream"), "#fbf6e9"],
  [tr("\u6D45\u7070", "Light grey"), "#f1f3f5"],
  [tr("\u6D45\u7EFF", "Light green"), "#eef6ee"],
  [tr("\u6DF1\u7070", "Dark grey"), "#2b2b2b"],
  [tr("\u9ED1\u8272", "Black"), "#111111"]
];
var _PenCanvasView = class _PenCanvasView extends import_obsidian2.TextFileView {
  constructor(leaf, plugin) {
    super(leaf);
    this.doc = emptyDoc("#ffffff");
    this.broken = null;
    this.toolBtns = /* @__PURE__ */ new Map();
    this.colorBtns = [];
    // the colour key itself (popover anchor)
    this.popovers = /* @__PURE__ */ new Map();
    this.vx = 0;
    this.vy = 0;
    this.scale = 1;
    this.dpr = 1;
    this.w = 0;
    this.h = 0;
    this.rect = null;
    this.needFit = true;
    this.raf = 0;
    this.tool = "pen";
    this.color = "#1e1e1e";
    // base #rrggbb
    this.opacity = 1;
    this.fillStyle = "solid";
    this.fillDensity = 50;
    // percent
    this.fillPanel = null;
    this.fillSwatches = [];
    this.size = 3;
    this.undoStack = [];
    this.redoStack = [];
    this.selected = /* @__PURE__ */ new Set();
    this.moveDx = 0;
    this.moveDy = 0;
    this.g = null;
    this.touches = /* @__PURE__ */ new Map();
    this.gl = null;
    this.glCanvas = null;
    this.lastRenderMs = 0;
    this.viewTimer = 0;
    this.snap = null;
    this.moveLayers = null;
    this.pinch = null;
    this.diag = { desyncRequested: false, desyncGranted: false, types: /* @__PURE__ */ new Set(), last: "", glFill: false };
    // Keys: path, icon, centre angle (deg, screen coords: 0 = right, 90 = down; mirrored in left-hand mode), radii.
    this.hubKeys = [];
    this.hubSeps = [];
    // group separator lines and their angle (right-hand frame)
    this.quickBtns = /* @__PURE__ */ new Map();
    this.keyIcon = /* @__PURE__ */ new WeakMap();
    this.drawerBtns = /* @__PURE__ */ new Map();
    this.drawerOpen = false;
    this.backTool = "pen";
    this.shapeKey = null;
    this.hubSvg = null;
    this.hubLeft = null;
    this.fanDir = 45;
    this.fanOff = 0;
    this.onDown = (e2) => {
      if (this.broken !== null) return;
      this.diag.types.add(e2.pointerType);
      this.rect = this.stage.getBoundingClientRect();
      if (this.drawerOpen) this.setDrawer(false);
      if (e2.pointerType === "touch") {
        if (this.g && this.g.pointerType !== "touch") return;
        this.touches.set(e2.pointerId, { x: e2.clientX, y: e2.clientY });
        this.capture(e2.pointerId);
        if (this.touches.size >= 2) {
          if (this.g) this.cancelGesture();
          this.startPinch();
          return;
        }
        if (this.plugin.settings.penOnly || this.tool === "hand") {
          this.g = this.newGesture(e2, "pan");
          return;
        }
        this.startTool(e2, this.tool);
        return;
      }
      if (this.g && this.g.pointerType === "touch") this.cancelGesture();
      this.pinch = null;
      if (this.g) return;
      this.capture(e2.pointerId);
      if (e2.pointerType === "mouse" && (e2.button === 1 || this.tool === "hand")) {
        this.g = this.newGesture(e2, "pan");
        return;
      }
      if (e2.pointerType === "mouse" && e2.button !== 0) return;
      let tool = this.tool;
      if (e2.pointerType === "pen" && (e2.button === 5 || (e2.buttons & 32) !== 0 || (e2.buttons & 2) !== 0)) tool = "eraser";
      if (tool === "hand") {
        this.g = this.newGesture(e2, "pan");
        return;
      }
      this.startTool(e2, tool);
    };
    this.onMove = (e2) => {
      var _a, _b;
      const pe = e2;
      if (e2.pointerType === "touch" && this.touches.has(e2.pointerId)) {
        this.touches.set(e2.pointerId, { x: e2.clientX, y: e2.clientY });
        if (this.pinch) {
          this.updatePinch();
          return;
        }
      }
      const g2 = this.g;
      if (!g2 || g2.pid !== e2.pointerId) return;
      g2.events++;
      const evs = (_b = (_a = pe.getCoalescedEvents) == null ? void 0 : _a.call(pe)) != null ? _b : [];
      const list = evs.length ? evs : [e2];
      g2.coalesced += list.length;
      const [x2, y2] = this.toWorld(e2);
      g2.cx = x2;
      g2.cy = y2;
      switch (g2.kind) {
        case "pan":
          this.vx += e2.clientX - g2.lx;
          this.vy += e2.clientY - g2.ly;
          g2.lx = e2.clientX;
          g2.ly = e2.clientY;
          this.scheduleViewRender();
          break;
        case "stroke": {
          const s2 = g2.stroke;
          for (const ev of list) {
            const [wx, wy] = this.toWorld(ev);
            const p2 = this.pressure(ev);
            if (p2 < g2.pmin) g2.pmin = p2;
            if (p2 > g2.pmax) g2.pmax = p2;
            s2.points.push([wx, wy, p2]);
          }
          let pred = [];
          if (this.plugin.settings.prediction && pe.getPredictedEvents) {
            pred = pe.getPredictedEvents().slice(0, 1).map((ev) => {
              const [wx, wy] = this.toWorld(ev);
              return [wx, wy, this.pressure(ev)];
            });
          }
          this.drawLiveStroke(pred);
          break;
        }
        case "erase":
          for (const ev of list) {
            const [wx, wy] = this.toWorld(ev);
            this.eraseAt(wx, wy);
          }
          break;
        case "shape": {
          const sh = g2.shape;
          const rx = this.snap1([x2], g2.snapX), ry = this.snap1([y2], g2.snapY);
          sh.x2 = x2 + rx.d;
          sh.y2 = y2 + ry.d;
          const label = this.stickyShape(sh);
          g2.cx = sh.x2;
          g2.cy = sh.y2;
          this.clearCtx(this.lctx);
          this.applyT(this.lctx);
          drawShape(this.lctx, sh);
          if (label) this.drawLabel(label, sh.x2, sh.y2);
          else this.drawGuides(rx.at, ry.at);
          break;
        }
        case "box": {
          const c2 = this.lctx;
          this.clearCtx(c2);
          this.applyT(c2);
          c2.setLineDash([6 / this.scale, 4 / this.scale]);
          c2.lineWidth = 1 / this.scale;
          c2.strokeStyle = "#4c8bf5";
          c2.strokeRect(g2.sx, g2.sy, x2 - g2.sx, y2 - g2.sy);
          c2.setLineDash([]);
          break;
        }
        case "move": {
          let dx = x2 - g2.sx, dy = y2 - g2.sy;
          let gx = null, gy = null;
          const b2 = g2.sel0;
          if (b2) {
            const rx = this.snap1([b2.x0 + dx, (b2.x0 + b2.x1) / 2 + dx, b2.x1 + dx], g2.snapX);
            const ry = this.snap1([b2.y0 + dy, (b2.y0 + b2.y1) / 2 + dy, b2.y1 + dy], g2.snapY);
            dx += rx.d;
            dy += ry.d;
            gx = rx.at;
            gy = ry.at;
          }
          this.moveDx = dx;
          this.moveDy = dy;
          this.scheduleRender();
          this.clearCtx(this.lctx);
          this.applyT(this.lctx);
          this.drawGuides(gx, gy);
          break;
        }
      }
    };
    this.onUp = (e2) => {
      if (e2.pointerType === "touch") {
        this.touches.delete(e2.pointerId);
        if (this.pinch) {
          if (this.touches.size < 2) this.pinch = null;
          return;
        }
      }
      const g2 = this.g;
      if (!g2 || g2.pid !== e2.pointerId) return;
      this.g = null;
      switch (g2.kind) {
        case "stroke": {
          const s2 = g2.stroke;
          s2.points = s2.points.map((p2) => [round(p2[0], 2), round(p2[1], 2), round(p2[2], 3)]);
          this.commit(s2);
          const dur = e2.timeStamp - g2.t0;
          const pps = (g2.coalesced / (dur / 1e3)).toFixed(0), eps = (g2.events / (dur / 1e3)).toFixed(0);
          this.diag.last = tr(`${g2.pointerType}\uFF1A${g2.events} \u6B21 move \u4E8B\u4EF6\uFF0C${s2.points.length} \u4E2A\u91C7\u6837\u70B9\uFF0C${dur.toFixed(0)} ms`, `${g2.pointerType}: ${g2.events} move events, ${s2.points.length} samples, ${dur.toFixed(0)} ms`) + (dur > 0 ? tr(`\uFF08\u7EA6 ${pps} \u70B9/\u79D2\uFF0C\u4E8B\u4EF6 ${eps} \u6B21/\u79D2\uFF09`, ` (about ${pps} samples/s, ${eps} events/s)`) : "") + tr(`\uFF0C\u538B\u611F ${g2.pmin.toFixed(2)}\u2013${g2.pmax.toFixed(2)}`, `, pressure ${g2.pmin.toFixed(2)}\u2013${g2.pmax.toFixed(2)}`);
          break;
        }
        case "shape": {
          const sh = g2.shape;
          sh.x2 = g2.cx;
          sh.y2 = g2.cy;
          this.clearCtx(this.lctx);
          if (Math.hypot(sh.x2 - sh.x1, sh.y2 - sh.y1) * this.scale < 4) break;
          sh.x1 = round(sh.x1, 2);
          sh.y1 = round(sh.y1, 2);
          sh.x2 = round(sh.x2, 2);
          sh.y2 = round(sh.y2, 2);
          this.commit(sh);
          break;
        }
        case "erase":
          this.clearCtx(this.lctx);
          if (g2.snapped) this.requestSave();
          break;
        case "box": {
          this.clearCtx(this.lctx);
          const b2 = { x0: Math.min(g2.sx, g2.cx), y0: Math.min(g2.sy, g2.cy), x1: Math.max(g2.sx, g2.cx), y1: Math.max(g2.sy, g2.cy) };
          for (const it of this.doc.items) if (itemTouchesBox(it, b2)) this.selected.add(it.id);
          this.scheduleRender();
          break;
        }
        case "move": {
          const dx = this.moveDx, dy = this.moveDy;
          this.moveDx = this.moveDy = 0;
          this.clearCtx(this.lctx);
          if (dx || dy) {
            this.snapshot();
            this.doc.items = this.doc.items.map((it) => this.selected.has(it.id) ? translateItem(it, dx, dy) : it);
            this.requestSave();
          }
          this.scheduleRender();
          break;
        }
        case "pan":
          break;
      }
    };
    this.bakeCv = null;
    this.onWheel = (e2) => {
      e2.preventDefault();
      const r2 = this.stage.getBoundingClientRect();
      if (e2.ctrlKey || e2.metaKey) {
        const mx = e2.clientX - r2.left, my = e2.clientY - r2.top;
        const s2 = Math.min(8, Math.max(0.05, this.scale * Math.exp(-e2.deltaY * 0.01)));
        this.vx = mx - (mx - this.vx) / this.scale * s2;
        this.vy = my - (my - this.vy) / this.scale * s2;
        this.scale = s2;
      } else {
        this.vx -= e2.shiftKey ? e2.deltaY : e2.deltaX;
        this.vy -= e2.shiftKey ? 0 : e2.deltaY;
      }
      this.scheduleViewRender();
    };
    this.plugin = plugin;
    this.color = activeDocument.body.classList.contains("theme-dark") ? "#ffffff" : "#1e1e1e";
    this.scope = new import_obsidian2.Scope(this.app.scope);
    this.scope.register(["Mod"], "z", () => {
      this.undo();
      return false;
    });
    this.scope.register(["Mod", "Shift"], "z", () => {
      this.redo();
      return false;
    });
    this.scope.register(["Mod"], "y", () => {
      this.redo();
      return false;
    });
    this.scope.register(["Mod"], "c", () => {
      if (!this.selected.size) return true;
      this.copySelected();
      return false;
    });
    this.scope.register(["Mod"], "x", () => {
      if (!this.selected.size) return true;
      this.copySelected();
      this.deleteSelected();
      return false;
    });
    this.scope.register(["Mod"], "v", () => {
      if (!clipboard.length) return true;
      this.paste();
      return false;
    });
    this.scope.register(["Mod"], "d", () => {
      if (!this.selected.size) return true;
      this.copySelected();
      this.paste();
      return false;
    });
    this.scope.register([], "Delete", () => {
      this.deleteSelected();
      return false;
    });
    this.scope.register([], "Backspace", () => {
      this.deleteSelected();
      return false;
    });
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    var _a, _b;
    return (_b = (_a = this.file) == null ? void 0 : _a.basename) != null ? _b : tr("\u624B\u5199\u753B\u5E03", "Pen canvas");
  }
  getIcon() {
    return "pen-tool";
  }
  canAcceptExtension(ext) {
    return ext === EXT;
  }
  getViewData() {
    return this.broken !== null ? this.broken : serialize(this.doc);
  }
  setViewData(data, clear) {
    var _a;
    try {
      this.doc = (_a = parseDoc(data)) != null ? _a : emptyDoc(this.plugin.newBackground());
      this.broken = null;
    } catch (e2) {
      this.broken = data;
      this.doc = emptyDoc(this.plugin.newBackground());
      new import_obsidian2.Notice(tr("\u624B\u5199\u753B\u5E03\uFF1A\u6587\u4EF6\u65E0\u6CD5\u89E3\u6790\uFF0C\u5DF2\u8FDB\u5165\u53EA\u8BFB\u4FDD\u62A4\uFF0C\u4E0D\u4F1A\u5199\u56DE\u3002", "Pen canvas: this file could not be read. It is open read-only and will not be saved. ") + String(e2));
    }
    if (clear) {
      this.undoStack = [];
      this.redoStack = [];
      this.selected.clear();
      this.needFit = true;
    }
    if (this.stage) {
      this.applyBackground();
      this.msgEl.toggleClass("is-hidden", this.broken === null);
      if (this.needFit && this.w) this.fit();
      this.scheduleRender();
    }
  }
  clear() {
    this.doc = emptyDoc(this.plugin.newBackground());
    this.broken = null;
    this.undoStack = [];
    this.redoStack = [];
    this.selected.clear();
    this.needFit = true;
  }
  async onOpen() {
    var _a, _b;
    const root = this.contentEl;
    root.empty();
    root.addClass("pc-root");
    this.stage = root.createDiv({ cls: "pc-stage" });
    if (this.plugin.settings.glFill) {
      const gcv = this.stage.createEl("canvas", { cls: "pc-gl" });
      this.gl = GLFillLayer.create(gcv);
      if (!this.gl) gcv.remove();
      else this.glCanvas = gcv;
    }
    this.diag.glFill = !!this.gl;
    this.base = this.stage.createEl("canvas", { cls: "pc-base" });
    this.live = this.stage.createEl("canvas", { cls: "pc-live" });
    this.buildToolbar(root);
    this.msgEl = this.stage.createDiv({ cls: "pc-msg is-hidden", text: tr("\u6587\u4EF6\u5185\u5BB9\u65E0\u6CD5\u89E3\u6790\u4E3A\u624B\u5199\u753B\u5E03\uFF0C\u5DF2\u6682\u505C\u7F16\u8F91\u4EE5\u4FDD\u62A4\u539F\u6587\u4EF6\u3002", "This file could not be read as a pen canvas. Editing is paused to protect it.") });
    this.bctx = this.base.getContext("2d");
    const want = this.plugin.settings.desynchronized;
    this.diag.desyncRequested = want;
    this.lctx = this.live.getContext("2d", { desynchronized: want });
    const attrs = (_b = (_a = this.lctx).getContextAttributes) == null ? void 0 : _b.call(_a);
    this.diag.desyncGranted = attrs == null ? void 0 : attrs.desynchronized;
    const s2 = this.stage;
    s2.addEventListener("pointerdown", this.onDown);
    s2.addEventListener("pointermove", this.onMove);
    s2.addEventListener("pointerup", this.onUp);
    s2.addEventListener("pointercancel", this.onUp);
    s2.addEventListener("wheel", this.onWheel, { passive: false });
    s2.addEventListener("contextmenu", (e2) => e2.preventDefault());
    const stopTouch = (e2) => {
      e2.stopPropagation();
      if (e2.cancelable) e2.preventDefault();
    };
    s2.addEventListener("touchstart", stopTouch, { passive: false });
    s2.addEventListener("touchmove", stopTouch, { passive: false });
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(s2);
    this.applyBackground();
    this.setTool("pen");
    this.refreshToolbar();
  }
  async onClose() {
    var _a, _b;
    (_a = this.ro) == null ? void 0 : _a.disconnect();
    if (this.raf) window.cancelAnimationFrame(this.raf);
    (_b = this.gl) == null ? void 0 : _b.dispose();
    this.gl = null;
  }
  // ---------- toolbar ----------
  /**
   * Keep touches on the menu disc and its panels away from Obsidian, whose mobile swipe gestures would
   * otherwise open the side panes while the colour fan is turned. No preventDefault on touchstart, so taps
   * still produce clicks.
   */
  shield(el) {
    el.addEventListener("touchstart", (e2) => e2.stopPropagation(), { passive: true });
    el.addEventListener("touchmove", (e2) => {
      e2.stopPropagation();
      if (e2.cancelable) e2.preventDefault();
    }, { passive: false });
    el.addEventListener("touchend", (e2) => e2.stopPropagation(), { passive: true });
  }
  btn(parent, icon, label, onClick) {
    const b2 = parent.createEl("button", { cls: "pc-btn", attr: { "aria-label": label } });
    (0, import_obsidian2.setIcon)(b2, icon);
    b2.addEventListener("click", onClick);
    return b2;
  }
  setDrawer(open) {
    var _a;
    if (open) {
      for (const q of this.popovers.values()) q.el.addClass("is-hidden");
      this.closeFillPanel();
    }
    this.drawerOpen = open;
    (_a = this.toolbarEl) == null ? void 0 : _a.toggleClass("is-drawer", open);
  }
  static get TOOLS() {
    return [
      ["pen", "pencil", tr("\u7B14", "Pen")],
      ["eraser", "eraser", tr("\u6A61\u76AE\uFF08\u6574\u7B14\u64E6\u9664\uFF09", "Eraser (removes whole strokes)")],
      ["select", "mouse-pointer-2", tr("\u6846\u9009 / \u79FB\u52A8", "Select / move")],
      ["fill", "paint-bucket", tr("\u586B\u5145\uFF08\u70B9\u5C01\u95ED\u533A\u57DF\uFF09", "Fill (tap a closed area)")],
      ["hand", "move", tr("\u5E73\u79FB", "Pan")],
      ["rect", "square", tr("\u77E9\u5F62", "Rectangle")],
      ["ellipse", "circle", tr("\u692D\u5706", "Ellipse")],
      ["line", "minus", tr("\u76F4\u7EBF", "Line")],
      ["arrow", "move-up-right", tr("\u7BAD\u5934", "Arrow")]
    ];
  }
  buildToolbar(root) {
    const H = _PenCanvasView.HUB;
    const hub = root.createDiv({ cls: "pc-hub" });
    this.shield(hub);
    this.toolbarEl = hub;
    hub.style.width = hub.style.height = `${2 * H.R}px`;
    this.hubSvg = createSvg("svg");
    this.hubSvg.classList.add("pc-hub-disk");
    hub.appendChild(this.hubSvg);
    const core = hub.createEl("button", { cls: "pc-btn pc-hub-core", attr: { "aria-label": tr("\u5E73\u79FB\uFF08\u518D\u70B9\u4E00\u6B21\u56DE\u5230\u4E0A\u4E00\u4E2A\u5DE5\u5177\uFF09", "Pan (tap again for the previous tool)") } });
    this.coreIcon = core.createSpan({ cls: "pc-core-icon" });
    this.coreText = core.createSpan({ cls: "pc-core-text" });
    core.addEventListener("click", () => {
      if (this.drawerOpen) {
        this.setDrawer(false);
        return;
      }
      this.setTool(this.tool === "hand" ? this.backTool : "hand");
    });
    const keys = createSvg("svg");
    keys.classList.add("pc-hub-keys");
    keys.setAttribute("viewBox", `0 0 ${2 * H.R} ${2 * H.R}`);
    hub.appendChild(keys);
    for (const [cls, mid, span] of [["pc-key-work", 0, 216], ["pc-key-aux", 216, 72], ["pc-key-aux", 144, 72]]) {
      const bgp = createSvg("path");
      bgp.setAttribute("class", `pc-key-bg ${cls}`);
      keys.appendChild(bgp);
      this.hubKeys.push({ path: bgp, ic: null, mid, span });
    }
    const key = (zone, label, mid, span, fn, icon) => {
      const path = createSvg("path");
      path.setAttribute("class", `pc-key ${zone}`);
      path.setAttribute("aria-label", label);
      path.setAttribute("role", "button");
      const title = createSvg("title");
      title.textContent = label;
      path.appendChild(title);
      path.addEventListener("click", fn);
      keys.appendChild(path);
      const ic = hub.createSpan({ cls: "pc-key-icon" });
      if (icon) (0, import_obsidian2.setIcon)(ic, icon);
      this.hubKeys.push({ path, ic, mid, span });
      this.keyIcon.set(path, ic);
      return { path, ic };
    };
    const main = [];
    const brush = key("pc-key-work", tr("\u989C\u8272 / \u900F\u660E\u5EA6", "Color / opacity"), -90, 36, () => this.togglePopover("colors"));
    main.push(brush);
    this.brushKey = brush.path;
    this.brushBtn = brush.ic;
    this.brushBtn.addClass("pc-brush");
    this.brushBtn.createSpan({ cls: "pc-dot" });
    for (const [t2, mid] of [["pen", -54], ["select", -18], ["eraser", 18], ["fill", 54]]) {
      const ti = _PenCanvasView.TOOLS.find(([x2]) => x2 === t2);
      const back = _PenCanvasView.TOGGLE_TOOLS.includes(t2);
      const fn = t2 === "fill" ? () => this.fillStyleMenu() : back ? () => this.setTool(this.tool === t2 ? this.backTool : t2) : () => this.setTool(t2);
      const k2 = key("pc-key-work", back ? ti[2] + tr("\uFF08\u518D\u70B9\u4E00\u6B21\u56DE\u5230\u4E0A\u4E00\u4E2A\u5DE5\u5177\uFF09", " (tap again for the previous tool)") : ti[2], mid, 36, fn, ti[1]);
      main.push(k2);
      this.quickBtns.set(t2, k2.path);
    }
    const shape = key("pc-key-work", tr("\u5F62\u72B6\uFF08\u9009\u4E2D\u65F6\u518D\u70B9\u4E00\u6B21\u6362\u5F62\u72B6\uFF09", "Shapes (tap again while active to pick another shape)"), 90, 36, () => {
      if (_PenCanvasView.SHAPES.includes(this.tool)) this.setDrawer(true);
      else this.setTool(this.plugin.settings.lastShape);
    });
    main.push(shape);
    shape.ic.addClass("pc-shape-ic");
    this.shapeKey = shape.path;
    for (const k2 of main) {
      k2.path.classList.add("pc-key-main");
      k2.ic.addClass("pc-key-main-ic");
    }
    const rest = _PenCanvasView.SHAPES.map((x2) => _PenCanvasView.TOOLS.find(([t2]) => t2 === x2));
    const step = 216 / rest.length;
    rest.forEach(([t2, icon, label], i2) => {
      const k2 = key("pc-key-work", label, -108 + step * (i2 + 0.5), step, () => {
        this.setTool(t2);
        this.setDrawer(false);
      }, icon);
      k2.path.classList.add("pc-key-drawer");
      k2.ic.addClass("pc-key-drawer-ic");
      this.drawerBtns.set(t2, k2.path);
    });
    key("pc-key-aux", tr("\u64A4\u9500", "Undo"), 234, 36, () => this.undo(), "undo-2");
    key("pc-key-aux", tr("\u91CD\u505A", "Redo"), 198, 36, () => this.redo(), "redo-2");
    key("pc-key-aux", tr("\u590D\u5236\u6240\u9009 (Ctrl+C)", "Copy selection (Ctrl+C)"), 162, 36, () => this.copySelected(), "copy");
    key("pc-key-aux", tr("\u7C98\u8D34 (Ctrl+V)", "Paste (Ctrl+V)"), 126, 36, () => this.paste(), "clipboard-paste");
    for (const a2 of [108, 180, 252]) {
      const line = createSvg("path");
      line.setAttribute("class", "pc-key-sep");
      keys.appendChild(line);
      this.hubSeps.push([line, a2]);
    }
    let mode = null;
    let grab = [0, 0], down = [0, 0], grip = false, moved = false;
    const polar = (e2) => {
      const b2 = hub.getBoundingClientRect();
      const dx = e2.clientX - (b2.left + b2.width / 2), dy = e2.clientY - (b2.top + b2.height / 2);
      return { r: Math.hypot(dx, dy) * (2 * H.R / b2.width), deg: Math.atan2(dy, dx) * 180 / Math.PI };
    };
    const slide = (e2) => {
      const { deg } = polar(e2);
      const lo = 90 + (180 - H.slideSpan) / 2;
      let t2;
      if (mode === "size") t2 = ((deg + 360) % 360 - lo) / H.slideSpan;
      else t2 = (90 - (180 - H.slideSpan) / 2 - deg) / H.slideSpan;
      t2 = Math.max(0, Math.min(1, t2));
      if (mode === "size") this.setSize(Math.round(1 + t2 * 29), false);
      else this.setOpacity(Math.round(5 + t2 * 95), false);
    };
    const svg = this.hubSvg;
    svg.addEventListener("pointerdown", (e2) => {
      const { r: r2, deg } = polar(e2);
      if (r2 > H.R + 2) return;
      try {
        svg.setPointerCapture(e2.pointerId);
      } catch (e3) {
      }
      e2.preventDefault();
      const gap = (180 - H.slideSpan) / 2;
      const ring = r2 >= H.slideR - 14;
      if (ring && Math.abs(Math.abs(deg) - 90) > gap) {
        mode = Math.abs(deg) > 90 ? "size" : "op";
        slide(e2);
        return;
      }
      mode = "drag";
      grip = ring && deg > 0;
      moved = false;
      down = [e2.clientX, e2.clientY];
      grab = [e2.clientX - hub.offsetLeft, e2.clientY - hub.offsetTop];
    });
    svg.addEventListener("pointermove", (e2) => {
      if (mode === "drag") {
        if (!moved && Math.hypot(e2.clientX - down[0], e2.clientY - down[1]) < 6) return;
        moved = true;
        this.moveHub(e2.clientX - grab[0], e2.clientY - grab[1], false);
        return;
      }
      if (mode) slide(e2);
    });
    const end = () => {
      const was = mode;
      mode = null;
      if (was === "size") this.setSize(this.size, true);
      else if (was === "op") this.setOpacity(Math.round(this.opacity * 100), true);
      else if (was === "drag" && moved) this.moveHub(hub.offsetLeft, hub.offsetTop, true);
      else if (was === "drag" && grip) this.togglePopover("more");
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
    this.opRange = createEl("input");
    this.opNum = createEl("input");
    this.opNum.className = "pc-op-num";
    Object.assign(this.opNum, { type: "number", min: "5", max: "100", step: "1" });
    this.opNum.addEventListener("change", () => this.setOpacity(Number(this.opNum.value), true));
    this.opNum.addEventListener("keydown", (e2) => {
      if (e2.key === "Enter") this.opNum.blur();
      e2.stopPropagation();
    });
    this.layoutHub();
  }
  /**
   * Place the disc at (x, y) px inside the view, kept fully inside with a margin. The position is stored
   * as a fraction of the free space so it survives resizes; left-hand mode mirrors it horizontally.
   */
  moveHub(x2, y2, save) {
    const hub = this.toolbarEl, root = this.contentEl;
    const M2 = 8, freeX = Math.max(1, root.clientWidth - hub.offsetWidth - 2 * M2), freeY = Math.max(1, root.clientHeight - hub.offsetHeight - 2 * M2);
    const fx = Math.max(0, Math.min(1, (x2 - M2) / freeX)), fy = Math.max(0, Math.min(1, (y2 - M2) / freeY));
    hub.style.left = `${M2 + fx * freeX}px`;
    hub.style.top = `${M2 + fy * freeY}px`;
    if (save) {
      const st = this.plugin.settings;
      st.hubX = fx;
      st.hubY = fy;
      void this.plugin.saveSettings();
    }
  }
  /** Apply the stored position (default: top-left). Left-hand mode does not move the disc. */
  placeHub() {
    const st = this.plugin.settings, hub = this.toolbarEl, root = this.contentEl;
    if (!root.clientWidth) return;
    const M2 = 8, freeX = Math.max(1, root.clientWidth - hub.offsetWidth - 2 * M2), freeY = Math.max(1, root.clientHeight - hub.offsetHeight - 2 * M2);
    const fx = st.hubX;
    hub.style.left = `${M2 + fx * freeX}px`;
    hub.style.top = `${M2 + st.hubY * freeY}px`;
  }
  /** Outline of an annular sector key in the right-hand frame, as x/y relative to the disc centre. */
  static keyOutline(mid, span, N2 = 24) {
    const H = _PenCanvasView.HUB, a0 = mid - span / 2;
    const at = (deg, r2) => [r2 * Math.cos(deg * Math.PI / 180), r2 * Math.sin(deg * Math.PI / 180)];
    const arc = (r2, from, to) => Array.from({ length: N2 + 1 }, (_2, i2) => at(from + (to - from) * i2 / N2, r2));
    return [...arc(H.r1, a0, a0 + span), ...arc(H.r0, a0 + span, a0)];
  }
  /** Key shapes and icon positions; the inner ring is mirrored left-right in left-hand mode. */
  layoutHub() {
    const H = _PenCanvasView.HUB, left = this.plugin.settings.leftHand;
    const sx = left ? -1 : 1;
    for (const [line, a2] of this.hubSeps) {
      const c2 = Math.cos(a2 * Math.PI / 180) * sx, si = Math.sin(a2 * Math.PI / 180);
      line.setAttribute("d", `M ${(H.R + c2 * H.r0).toFixed(2)} ${(H.R + si * H.r0).toFixed(2)} L ${(H.R + c2 * H.r1).toFixed(2)} ${(H.R + si * H.r1).toFixed(2)}`);
    }
    for (const k2 of this.hubKeys) {
      const pts = _PenCanvasView.keyOutline(k2.mid, k2.span);
      k2.path.setAttribute("d", "M " + pts.map(([x2, y2]) => `${(H.R + sx * x2).toFixed(2)} ${(H.R + y2).toFixed(2)}`).join(" L ") + " Z");
      if (!k2.ic) continue;
      const a2 = k2.mid * Math.PI / 180, r2 = Math.sqrt((H.r0 * H.r0 + H.r1 * H.r1) / 2);
      k2.ic.style.left = `${H.R + sx * r2 * Math.cos(a2)}px`;
      k2.ic.style.top = `${H.R + r2 * Math.sin(a2)}px`;
    }
    const core = this.coreIcon.parentElement;
    core.style.left = core.style.top = `${H.R}px`;
    this.placeHub();
    this.drawHubDisk();
  }
  /**
   * The "···" grip band at angle d (-90 top, 90 bottom): an annular band across the gap between the two
   * sliders whose ends are concave, hugging the sliders' round caps, with softly rounded corners. Built as the
   * band shrunk by K, then drawn with a K-wide round-join stroke, which rounds the four corners.
   */
  gripPath(d2, gapA) {
    const H = _PenCanvasView.HUB, s2 = H.slideR, K = 4, HALF = 9.5, CAP = 6.5, GAP = 10;
    const rIn = s2 - HALF + K, rOut = s2 + HALF - K, rho = CAP + GAP + K;
    const P2 = (a2, r2) => [H.R + r2 * Math.cos(a2 * Math.PI / 180), H.R + r2 * Math.sin(a2 * Math.PI / 180)];
    const phi = (r2) => Math.acos((r2 * r2 + s2 * s2 - rho * rho) / (2 * r2 * s2)) * 180 / Math.PI;
    const eA = d2 - gapA, eB = d2 + gapA;
    const aOutA = eA + phi(rOut), aOutB = eB - phi(rOut), aInA = eA + phi(rIn), aInB = eB - phi(rIn);
    const pts = [];
    const N2 = 16;
    for (let i2 = 0; i2 <= N2; i2++) pts.push(P2(aOutA + (aOutB - aOutA) * i2 / N2, rOut));
    const capArc = (e2, from, to) => {
      const [cx, cy] = P2(e2, s2);
      const t0 = Math.atan2(from[1] - cy, from[0] - cx);
      let t1 = Math.atan2(to[1] - cy, to[0] - cx);
      if (t1 - t0 > Math.PI) t1 -= 2 * Math.PI;
      else if (t0 - t1 > Math.PI) t1 += 2 * Math.PI;
      for (let i2 = 1; i2 < N2; i2++) {
        const t2 = t0 + (t1 - t0) * i2 / N2;
        pts.push([cx + rho * Math.cos(t2), cy + rho * Math.sin(t2)]);
      }
    };
    capArc(eB, P2(aOutB, rOut), P2(aInB, rIn));
    for (let i2 = 0; i2 <= N2; i2++) pts.push(P2(aInB + (aInA - aInB) * i2 / N2, rIn));
    capArc(eA, P2(aInA, rIn), P2(aOutA, rOut));
    return "M " + pts.map(([x2, y2]) => `${x2.toFixed(2)} ${y2.toFixed(2)}`).join(" L ") + " Z";
  }
  drawHubDisk() {
    var _a;
    const svg = this.hubSvg;
    if (!svg) return;
    const H = _PenCanvasView.HUB, R2 = H.R, W = 2 * R2, c2 = R2, r2 = H.slideR;
    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(W));
    svg.setAttribute("viewBox", `0 0 ${W} ${W}`);
    const pt = (deg, rad = r2) => [c2 + rad * Math.cos(deg * Math.PI / 180), c2 + rad * Math.sin(deg * Math.PI / 180)];
    const arc = (a0, a1) => {
      const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
      return `M ${x0} ${y0} A ${r2} ${r2} 0 0 ${a1 > a0 ? 1 : 0} ${x1} ${y1}`;
    };
    const span = H.slideSpan, lo = 90 + (180 - span) / 2, ro = 90 - (180 - span) / 2;
    const gapA = (180 - span) / 2;
    const ts = (this.size - 1) / 29, to = (this.opacity * 100 - 5) / 95;
    const sA = lo + ts * span, oA = ro - to * span;
    const [hx1, hy1] = pt(sA), [hx2, hy2] = pt(oA);
    svg.empty();
    const el = (tag, cls, attr, parent = svg) => createSvg(tag, { cls, attr, parent });
    el("circle", "pc-disk", { cx: c2, cy: c2, r: R2 - 1 });
    el("circle", "pc-disk-sep", { cx: c2, cy: c2, r: H.slideR - 15 });
    const gg = el("g", "pc-grip-g", {});
    for (const d2 of [-90, 90]) el("path", "pc-grip-band", { d: this.gripPath(d2, gapA) }, gg);
    el("path", "pc-slide-track", { d: arc(lo, lo + span) });
    el("path", "pc-slide-track", { d: arc(ro, ro - span) });
    el("path", "pc-slide-fill", { d: arc(lo, sA) });
    el("path", "pc-slide-fill", { d: arc(ro, oA) });
    el("circle", "pc-slide-handle", { cx: hx1, cy: hy1, r: 10 });
    el("circle", "pc-slide-handle", { cx: hx2, cy: hy2, r: 10 });
    for (const o2 of [-5, 0, 5]) for (const dr of [-3.5, 3.5]) {
      const [x2, y2] = pt(-90 + o2, H.slideR + dr);
      el("circle", "pc-grip", { cx: x2, cy: y2, r: 1.8 });
    }
    for (const o2 of [-8, 0, 8]) {
      const [x2, y2] = pt(90 + o2);
      el("circle", "pc-grip", { cx: x2, cy: y2, r: 3 });
    }
    (_a = this.coreText) == null ? void 0 : _a.setText(`${this.size}px \xB7 ${Math.round(this.opacity * 100)}%`);
  }
  /** Popovers open beside the disc (below it when there is room, else above). */
  placeAboveHub(el) {
    el.removeClass("is-hidden");
    const root = this.contentEl.getBoundingClientRect();
    const hub = this.toolbarEl.getBoundingClientRect();
    const x2 = hub.left - root.left + hub.width / 2 - el.offsetWidth / 2;
    let y2 = hub.bottom - root.top + 6;
    if (y2 + el.offsetHeight > root.height - 4) y2 = hub.top - root.top - el.offsetHeight - 6;
    el.style.left = `${Math.min(Math.max(4, x2), root.width - el.offsetWidth - 4)}px`;
    el.style.top = `${Math.max(4, y2)}px`;
  }
  /** Fill-style panel: pattern swatches on the left, density on the right (solid is fixed at 100%). */
  fillStyleMenu() {
    const wasFill = this.tool === "fill";
    this.setTool("fill");
    if (wasFill && this.fillPanel && !this.fillPanel.hasClass("is-hidden")) {
      this.closeFillPanel();
      return;
    }
    if (!this.fillPanel) this.buildFillPanel();
    this.placeAboveHub(this.fillPanel);
    this.refreshFillPanel();
  }
  closeFillPanel() {
    var _a;
    (_a = this.fillPanel) == null ? void 0 : _a.addClass("is-hidden");
  }
  buildFillPanel() {
    const p2 = this.contentEl.createDiv({ cls: "pc-fill-panel is-hidden" });
    this.shield(p2);
    this.fillPanel = p2;
    const grid = p2.createDiv({ cls: "pc-fill-grid" });
    for (const [st, label] of fillStyles()) {
      const b2 = grid.createEl("button", { cls: "pc-fill-swatch", attr: { "aria-label": label, "data-style": st } });
      const cv = b2.createEl("canvas");
      cv.width = cv.height = 40 * (window.devicePixelRatio || 1);
      b2.addEventListener("click", () => {
        this.fillStyle = st;
        this.refreshFillPanel();
        if (this.selected.size) this.mutateSelected((it) => it.fill ? this.withFillStyle({ ...it }) : it);
      });
      this.fillSwatches.push(b2);
    }
    const side = p2.createDiv({ cls: "pc-fill-density" });
    side.createSpan({ text: tr("\u5BC6\u5EA6", "Density") });
    this.densityRange = side.createEl("input", { attr: { type: "range", min: "10", max: "100", step: "10" } });
    this.densityLabel = side.createSpan({ cls: "pc-fill-density-val" });
    this.densityRange.addEventListener("input", () => {
      this.fillDensity = Number(this.densityRange.value);
      this.refreshFillPanel();
    });
    this.densityRange.addEventListener("change", () => {
      if (this.selected.size) this.mutateSelected((it) => it.fill ? this.withFillStyle({ ...it }) : it);
    });
    this.registerDomEvent(activeDocument, "pointerdown", (e2) => {
      var _a, _b;
      const t2 = e2.target;
      if (!p2.contains(t2) && !((_b = (_a = this.quickBtns.get("fill")) != null ? _a : this.toolBtns.get("fill")) == null ? void 0 : _b.contains(t2))) this.closeFillPanel();
    }, true);
  }
  refreshFillPanel() {
    var _a;
    if (!this.fillPanel) return;
    const solid = this.fillStyle === "solid";
    for (const b2 of this.fillSwatches) {
      const st = b2.dataset.style;
      b2.toggleClass("is-active", st === this.fillStyle);
      const cv = b2.querySelector("canvas");
      const c2 = cv.getContext("2d");
      const k2 = cv.width / 40;
      c2.setTransform(1, 0, 0, 1, 0, 0);
      c2.clearRect(0, 0, cv.width, cv.height);
      c2.setTransform(k2, 0, 0, k2, 0, 0);
      const mono = activeDocument.body.classList.contains("theme-dark") ? "#ffffff" : "#000000";
      drawFillIcon(c2, st, mono);
    }
    this.densityRange.disabled = solid;
    (_a = this.densityRange.parentElement) == null ? void 0 : _a.toggleClass("is-disabled", solid);
    this.densityRange.value = String(solid ? 100 : this.fillDensity);
    this.densityLabel.setText(`${solid ? 100 : this.fillDensity}%`);
  }
  withFillStyle(it) {
    delete it.fillStyle;
    delete it.fillDensity;
    if (this.fillStyle !== "solid") {
      it.fillStyle = this.fillStyle;
      if (this.fillDensity !== 50) it.fillDensity = this.fillDensity;
    }
    return it;
  }
  /** Opacity in percent. Applies to new ink and, on commit, to the selection. */
  setOpacity(pct, commit) {
    if (!isFinite(pct)) return;
    pct = Math.max(5, Math.min(100, Math.round(pct)));
    this.opacity = pct / 100;
    this.opRange.value = String(pct);
    this.opNum.value = String(pct);
    if (commit && this.selected.size) this.mutateSelected((it) => this.recolor(it, it.color.slice(0, 7)));
    this.refreshToolbar();
  }
  /** New colour (current opacity) for an item; its fill follows. */
  recolor(it, base) {
    const ink = this.withAlpha(base, this.opacity);
    return { ...it, color: ink, fill: it.fill ? ink : null };
  }
  withAlpha(c2, a2) {
    if (a2 >= 1 || !/^#[0-9a-fA-F]{6}$/.test(c2)) return c2;
    return c2 + Math.round(a2 * 255).toString(16).padStart(2, "0");
  }
  /** Current pen colour including opacity. */
  get ink() {
    return this.withAlpha(this.color, this.opacity);
  }
  // ---------- popovers (fill styles, background, brush ring) ----------
  togglePopover(name) {
    if (!this.popovers.has(name)) this.buildPopover(name);
    const p2 = this.popovers.get(name);
    if (!p2) return;
    const open = !p2.el.hasClass("is-hidden");
    for (const q of this.popovers.values()) q.el.addClass("is-hidden");
    this.closeFillPanel();
    if (open) return;
    this.placePopover(p2.el, p2.anchor());
    p2.refresh();
  }
  placePopover(el, _anchor) {
    if (!el.hasClass("pc-fan")) {
      this.placeAboveHub(el);
      return;
    }
    el.removeClass("is-hidden");
    const root = this.contentEl.getBoundingClientRect(), hub = this.toolbarEl.getBoundingClientRect();
    const cx = hub.left + hub.width / 2 - root.left, cy = hub.top + hub.height / 2 - root.top;
    this.fanDir = Math.atan2(root.height / 2 - cy, root.width / 2 - cx) * 180 / Math.PI;
    const F2 = _PenCanvasView.HUB.R + 8 + 4 * 30 + 60;
    el.style.left = `${cx - F2}px`;
    el.style.top = `${cy - F2}px`;
    el.style.width = el.style.height = `${2 * F2}px`;
  }
  buildPopover(name) {
    const el = this.contentEl.createDiv({ cls: `pc-popover pc-pop-${name} is-hidden` });
    this.shield(el);
    const anchor = () => name === "more" ? this.toolbarEl : name === "colors" ? this.brushKey : this.coreIcon.parentElement;
    let refresh = () => {
    };
    if (name === "more") {
      el.createDiv({ cls: "pc-more-title", text: tr("\u753B\u5E03\u80CC\u666F", "Canvas background") });
      const bg = el.createDiv({ cls: "pc-bg-grid" });
      const swatches = [];
      for (const [label, c2] of backgrounds()) {
        const sw = bg.createEl("button", { cls: "pc-bg-swatch", attr: { "aria-label": label, "data-color": c2 } });
        sw.style.setProperty("--pc-c", c2);
        sw.addEventListener("click", () => {
          this.setBackground(c2);
          refresh();
        });
        swatches.push(sw);
      }
      const customBtn = bg.createEl("button", { cls: "pc-bg-swatch pc-bg-custom-btn", attr: { "aria-label": tr("\u81EA\u5B9A\u4E49\u80CC\u666F\u8272", "Custom background color") } });
      const custom = el.createEl("input", { cls: "pc-fan-custom", attr: { type: "color", tabindex: "-1" } });
      customBtn.addEventListener("click", () => custom.click());
      custom.addEventListener("input", () => {
        this.setBackground(custom.value);
        refresh();
      });
      const acts = el.createDiv({ cls: "pc-more-acts" });
      const act = (icon, text, fn) => {
        const b2 = acts.createEl("button", { cls: "pc-more-act" });
        (0, import_obsidian2.setIcon)(b2.createSpan(), icon);
        b2.createSpan({ text });
        b2.addEventListener("click", fn);
        return b2;
      };
      act("scan", tr("\u663E\u793A\u5168\u90E8", "Fit all"), () => {
        el.addClass("is-hidden");
        this.fit();
        this.scheduleRender();
      });
      this.leftBtn = act("pc-left-hand", tr("\u5DE6\u624B\u6A21\u5F0F", "Left-hand mode"), () => {
        void this.plugin.setLeftHand(!this.plugin.settings.leftHand);
      });
      this.leftBtn.toggleClass("is-active", this.plugin.settings.leftHand);
      refresh = () => {
        for (const sw of swatches) sw.toggleClass("is-active", sw.dataset.color === this.doc.background);
        const isCustom = !swatches.some((sw) => sw.dataset.color === this.doc.background);
        customBtn.toggleClass("is-active", isCustom);
        customBtn.style.setProperty("--pc-c", isCustom ? this.doc.background : "transparent");
        custom.value = /^#[0-9a-fA-F]{6}$/.test(this.doc.background) ? this.doc.background : "#ffffff";
      };
    } else if (name === "tools") {
      const grid = el.createDiv({ cls: "pc-tool-grid" });
      for (const [t2, icon, label] of _PenCanvasView.TOOLS.filter(([x2]) => !this.quickBtns.has(x2))) {
        const b2 = this.btn(grid, icon, label, () => {
          el.addClass("is-hidden");
          if (t2 === "fill") this.fillStyleMenu();
          else this.setTool(t2);
        });
        this.toolBtns.set(t2, b2);
      }
      refresh = () => {
        for (const [t2, b2] of this.toolBtns) b2.toggleClass("is-active", t2 === this.tool);
      };
    } else {
      el.addClass("pc-fan");
      const svg = createSvg("svg");
      el.appendChild(svg);
      const rot2 = createSvg("g");
      svg.appendChild(rot2);
      const lab = createSvg("g");
      svg.appendChild(lab);
      let labs = [];
      const placeLabels = (delta) => {
        for (const l2 of labs) {
          const a2 = l2.a + delta, x2 = F2 + l2.r * Math.cos(a2 * Math.PI / 180), y2 = F2 + l2.r * Math.sin(a2 * Math.PI / 180);
          let rt = ((a2 + 90) % 360 + 360) % 360;
          if (rt > 90 && rt < 270) rt -= 180;
          l2.el.setAttribute("x", x2.toFixed(2));
          l2.el.setAttribute("y", y2.toFixed(2));
          l2.el.setAttribute("transform", `rotate(${rt.toFixed(1)} ${x2.toFixed(2)} ${y2.toFixed(2)})`);
        }
      };
      const custom = el.createEl("input", { cls: "pc-fan-custom", attr: { type: "color", "aria-label": tr("\u81EA\u5B9A\u4E49\u989C\u8272", "Custom color") } });
      let recentTimer = 0;
      const remember = () => {
        var _a, _b;
        window.clearTimeout(recentTimer);
        const st = this.plugin.settings, c2 = custom.value.toLowerCase();
        if (!FAN_COLUMNS.some((col) => col.includes(c2)) && ((_a = st.recentColors) == null ? void 0 : _a[0]) !== c2) {
          st.recentColors = [c2, ...((_b = st.recentColors) != null ? _b : []).filter((x2) => x2 !== c2)].slice(0, 3);
          void this.plugin.saveSettings();
        }
        refresh();
      };
      custom.addEventListener("input", () => {
        this.pickColor(custom.value);
        refresh();
        window.clearTimeout(recentTimer);
        recentTimer = window.setTimeout(remember, 1200);
      });
      custom.addEventListener("change", remember);
      const row = el.createDiv({ cls: "pc-ring-op pc-fan-op" });
      row.createSpan({ text: tr("\u900F\u660E\u5EA6", "Opacity") });
      row.appendChild(this.opNum);
      row.createSpan({ text: "%" });
      const STEP = 15, WIN = 210, ROWS = 4, R0 = _PenCanvasView.HUB.R + 8, RH = 30, F2 = R0 + ROWS * RH + 60, EDGE = 14;
      let built = 0;
      let spin = 0;
      const turn = (d2) => {
        this.fanOff += d2;
        const delta = this.fanOff - built;
        if (Math.abs(delta) > 60) refresh();
        else {
          rot2.setAttribute("transform", `rotate(${delta.toFixed(2)} ${F2} ${F2})`);
          placeLabels(delta);
        }
      };
      const stopSpin = () => {
        if (spin) {
          window.cancelAnimationFrame(spin);
          spin = 0;
        }
      };
      let drag = null;
      const angleAt = (e2) => {
        const bb = svg.getBoundingClientRect();
        return Math.atan2(e2.clientY - (bb.top + bb.height / 2), e2.clientX - (bb.left + bb.width / 2)) * 180 / Math.PI;
      };
      svg.addEventListener("pointerdown", (e2) => {
        const tgt = e2.target;
        if (!tgt.classList.contains("pc-wedge") && !tgt.classList.contains("pc-wedge-empty")) return;
        const t2 = tgt.getAttribute("data-color");
        const spinning = !!spin;
        stopSpin();
        try {
          svg.setPointerCapture(e2.pointerId);
        } catch (e3) {
        }
        drag = { a: angleAt(e2), moved: spinning, target: spinning ? null : t2, hist: [[performance.now(), 0]] };
        e2.preventDefault();
      });
      svg.addEventListener("pointermove", (e2) => {
        if (!drag) return;
        let d2 = angleAt(e2) - drag.a;
        if (d2 > 180) d2 -= 360;
        else if (d2 < -180) d2 += 360;
        if (!drag.moved && Math.abs(d2) < 3) return;
        drag.moved = true;
        drag.a = angleAt(e2);
        turn(d2);
        const now = performance.now();
        drag.hist.push([now, d2]);
        while (drag.hist.length > 2 && now - drag.hist[0][0] > 100) drag.hist.shift();
      });
      const release = () => {
        const d2 = drag;
        drag = null;
        if (!d2) return;
        if (!d2.moved) {
          if (d2.target === "custom") custom.click();
          else if (d2.target) {
            this.pickColor(d2.target);
            refresh();
          }
          return;
        }
        const now = performance.now(), recent = d2.hist.filter(([t2]) => now - t2 <= 100);
        const span = recent.length > 1 ? now - recent[0][0] : 0;
        let v2 = span > 0 ? recent.slice(1).reduce((s2, [, x2]) => s2 + x2, 0) / span : 0;
        if (Math.abs(v2) < 0.02) {
          refresh();
          return;
        }
        let last = now;
        const step = (t2) => {
          const dt = Math.min(40, t2 - last);
          last = t2;
          turn(v2 * dt);
          v2 *= Math.pow(0.994, dt);
          if (Math.abs(v2) > 0.01) spin = window.requestAnimationFrame(step);
          else {
            spin = 0;
            refresh();
          }
        };
        spin = window.requestAnimationFrame(step);
      };
      svg.addEventListener("pointerup", release);
      svg.addEventListener("pointercancel", release);
      let wheelTimer = 0;
      svg.addEventListener("wheel", (e2) => {
        e2.preventDefault();
        stopSpin();
        turn(-e2.deltaY * 0.15);
        window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => refresh(), 120);
      }, { passive: false });
      refresh = () => {
        var _a;
        svg.setAttribute("width", String(2 * F2));
        svg.setAttribute("height", String(2 * F2));
        svg.setAttribute("viewBox", `0 0 ${2 * F2} ${2 * F2}`);
        el.style.width = el.style.height = `${2 * F2}px`;
        const w0 = this.fanDir - WIN / 2;
        const mask = `conic-gradient(from ${(w0 + 90).toFixed(1)}deg at 50% 50%, transparent 0deg, #000 ${EDGE}deg, #000 ${WIN - EDGE}deg, transparent ${WIN}deg, transparent 360deg)`;
        svg.style.setProperty("-webkit-mask-image", mask);
        svg.style.setProperty("mask-image", mask);
        const pt = (r2, d2) => `${(F2 + r2 * Math.cos(d2 * Math.PI / 180)).toFixed(2)} ${(F2 + r2 * Math.sin(d2 * Math.PI / 180)).toFixed(2)}`;
        const cols = [...FAN_COLUMNS.slice(0, -1), ["custom", ...((_a = this.plugin.settings.recentColors) != null ? _a : []).slice(0, 3)]];
        rot2.empty();
        lab.empty();
        rot2.removeAttribute("transform");
        const activeCells = [];
        labs = [];
        const k0 = Math.floor((this.fanDir - 180 - this.fanOff) / STEP), k1 = Math.ceil((this.fanDir + 180 - this.fanOff) / STEP);
        for (let k2 = k0; k2 < k1; k2++) {
          const a0 = this.fanOff + k2 * STEP, a1 = a0 + STEP, am = a0 + STEP / 2;
          const col = cols[(k2 % cols.length + cols.length) % cols.length];
          const rel = ((am - this.fanDir) % 360 + 540) % 360 - 180;
          const off = Math.abs(rel) > WIN / 2 - EDGE / 2;
          for (let j2 = 0; j2 < ROWS; j2++) {
            const c2 = col[j2];
            const r0 = R0 + j2 * RH, r1 = r0 + RH;
            const d2 = `M ${pt(r0, a0)} A ${r0} ${r0} 0 0 1 ${pt(r0, a1)} L ${pt(r1, a1)} A ${r1} ${r1} 0 0 0 ${pt(r1, a0)} Z`;
            if (!c2) {
              createSvg("path", { cls: off ? "pc-wedge-empty is-off" : "pc-wedge-empty", attr: { d: d2 }, parent: rot2 });
              continue;
            }
            const isCustom = c2 === "custom";
            const on = c2 === this.color;
            let fill = c2;
            if (isCustom) {
              const [gx0, gy0] = pt((r0 + r1) / 2, a0).split(" "), [gx1, gy1] = pt((r0 + r1) / 2, a1).split(" ");
              const g2 = createSvg("linearGradient", { attr: { id: `pc-rainbow-${k2}`, gradientUnits: "userSpaceOnUse", x1: gx0, y1: gy0, x2: gx1, y2: gy1 }, parent: rot2 });
              for (const [o2, sc] of [["0", "#f00"], [".33", "#0f0"], [".66", "#00f"], ["1", "#f0f"]]) createSvg("stop", { attr: { offset: o2, "stop-color": sc }, parent: g2 });
              fill = `url(#pc-rainbow-${k2})`;
            }
            const cell = createSvg("path", { cls: ["pc-wedge", ...on ? ["is-active"] : [], ...off ? ["is-off"] : []], attr: { "data-color": c2, fill, d: d2 } });
            if (!on) cell.style.stroke = isCustom ? "none" : /^#f[0-9a-f]f[0-9a-f]f[0-9a-f]$/i.test(c2) ? "var(--background-modifier-border)" : c2;
            if (on) activeCells.push(cell);
            else rot2.appendChild(cell);
            const label = isCustom ? tr("\u81EA\u5B9A\u4E49", "Custom") : c2.slice(1).toUpperCase();
            const r2 = (r0 + r1) / 2;
            const t2 = createSvg("text", { cls: "pc-wedge-code", parent: lab });
            t2.style.fill = isCustom ? "#fff" : textOn(c2);
            t2.textContent = label;
            labs.push({ el: t2, a: am, r: r2 });
          }
        }
        for (const cell of activeCells) rot2.appendChild(cell);
        placeLabels(0);
        built = this.fanOff;
        const a2 = this.fanDir * Math.PI / 180;
        const ext = (Math.abs(Math.cos(a2)) * (row.offsetWidth || 160) + Math.abs(Math.sin(a2)) * (row.offsetHeight || 40)) / 2;
        const rr = R0 + ROWS * RH + 10 + ext;
        row.style.left = `${F2 + rr * Math.cos(a2)}px`;
        row.style.top = `${F2 + rr * Math.sin(a2)}px`;
        custom.value = /^#[0-9a-fA-F]{6}$/.test(this.color) ? this.color : "#000000";
      };
    }
    this.popovers.set(name, { el, anchor, refresh });
    this.registerDomEvent(activeDocument, "pointerdown", (e2) => {
      const t2 = e2.target;
      if (!el.contains(t2) && !anchor().contains(t2)) el.addClass("is-hidden");
    }, true);
  }
  setSize(px, commit) {
    this.size = Math.max(1, Math.min(30, px));
    if (commit && this.selected.size) this.mutateSelected((it) => isFillOnly(it) ? it : { ...it, size: this.size });
    this.refreshToolbar();
  }
  setBackground(c2) {
    if (this.broken !== null) return;
    this.doc.background = c2;
    this.applyBackground();
    this.requestSave();
    this.plugin.settings.defaultBackground = c2;
    this.plugin.settings.bgChosen = true;
    void this.plugin.saveSettings();
  }
  applyBackground() {
    this.stage.style.setProperty("--pc-bg", this.doc.background);
  }
  setTool(t2) {
    if (!_PenCanvasView.TOGGLE_TOOLS.includes(t2)) this.backTool = t2;
    this.tool = t2;
    if (_PenCanvasView.SHAPES.includes(t2) && this.plugin.settings.lastShape !== t2) {
      this.plugin.settings.lastShape = t2;
      void this.plugin.saveSettings();
    }
    if (t2 !== "select" && this.selected.size) {
      this.selected.clear();
      this.scheduleRender();
    }
    this.refreshToolbar();
  }
  pickColor(c2) {
    this.color = c2;
    if (this.selected.size) this.mutateSelected((it) => this.recolor(it, c2));
    else if (this.tool === "eraser" || this.tool === "select" || this.tool === "hand") this.tool = "pen";
    this.refreshToolbar();
  }
  drawRingIfOpen() {
    this.drawHubDisk();
  }
  /** Left-hand mode mirrors the keys of the inner ring (not the disc position or the sliders). */
  applyLeftHand() {
    var _a;
    const on = this.plugin.settings.leftHand;
    (_a = this.leftBtn) == null ? void 0 : _a.toggleClass("is-active", on);
    if (this.toolbarEl && this.hubLeft !== on) {
      this.hubLeft = on;
      this.toolbarEl.toggleClass("is-left", on);
      this.layoutHub();
      for (const p2 of this.popovers.values()) p2.el.addClass("is-hidden");
      this.closeFillPanel();
    }
  }
  refreshToolbar() {
    var _a, _b;
    for (const [t2, b2] of this.toolBtns) b2.toggleClass("is-active", t2 === this.tool);
    for (const m2 of [this.quickBtns, this.drawerBtns]) for (const [t2, b2] of m2) {
      b2.classList.toggle("is-active", t2 === this.tool);
      (_a = this.keyIcon.get(b2)) == null ? void 0 : _a.toggleClass("is-active", t2 === this.tool);
    }
    if (this.shapeKey) {
      const on = _PenCanvasView.SHAPES.includes(this.tool), ic = this.keyIcon.get(this.shapeKey);
      this.shapeKey.classList.toggle("is-active", on);
      const si = _PenCanvasView.TOOLS.find(([x2]) => x2 === this.plugin.settings.lastShape);
      if (ic && si) {
        ic.toggleClass("is-active", on);
        if (ic.dataset.icon !== si[1]) {
          ic.empty();
          (0, import_obsidian2.setIcon)(ic, si[1]);
          ic.dataset.icon = si[1];
        }
      }
    }
    (_b = this.toolbarEl) == null ? void 0 : _b.toggleClass("is-hand", this.tool === "hand");
    for (const b2 of this.colorBtns) b2.toggleClass("is-active", b2.dataset.color === this.color);
    if (this.brushBtn) {
      const dot = this.brushBtn.querySelector(".pc-dot");
      dot.style.setProperty("--pc-d", `${Math.max(4, Math.min(22, this.size * 1.2))}px`);
      dot.style.setProperty("--pc-ink", this.ink);
    }
    const ti = _PenCanvasView.TOOLS.find(([t2]) => t2 === this.tool);
    if (this.coreIcon && ti && this.coreIcon.dataset.icon !== ti[1]) {
      this.coreIcon.empty();
      (0, import_obsidian2.setIcon)(this.coreIcon, ti[1]);
      this.coreIcon.dataset.icon = ti[1];
    }
    this.drawRingIfOpen();
    if (this.tool !== "fill") this.closeFillPanel();
    else this.refreshFillPanel();
    this.applyLeftHand();
    const pct = String(Math.round(this.opacity * 100));
    if (this.opRange) {
      this.opRange.value = pct;
      this.opNum.value = pct;
    }
  }
  // ---------- viewport ----------
  resize() {
    const r2 = this.stage.getBoundingClientRect();
    this.rect = r2;
    this.dpr = window.devicePixelRatio || 1;
    this.w = r2.width;
    this.h = r2.height;
    for (const c2 of [this.base, this.live, this.glCanvas]) {
      if (!c2) continue;
      c2.width = Math.max(1, Math.round(r2.width * this.dpr));
      c2.height = Math.max(1, Math.round(r2.height * this.dpr));
    }
    if (this.needFit && this.w > 0) this.fit();
    if (this.toolbarEl) this.placeHub();
    this.renderBase();
  }
  fit() {
    this.needFit = false;
    const items = this.doc.items;
    if (!items.length || !this.w) {
      this.vx = 0;
      this.vy = 0;
      this.scale = 1;
      return;
    }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const it of items) {
      const b2 = itemBBox(it);
      x0 = Math.min(x0, b2.x0);
      y0 = Math.min(y0, b2.y0);
      x1 = Math.max(x1, b2.x1);
      y1 = Math.max(y1, b2.y1);
    }
    const pad = 40;
    const s2 = Math.min(1, (this.w - pad * 2) / Math.max(1, x1 - x0), (this.h - pad * 2) / Math.max(1, y1 - y0));
    this.scale = Math.max(0.05, s2);
    this.vx = (this.w - (x1 - x0) * this.scale) / 2 - x0 * this.scale;
    this.vy = (this.h - (y1 - y0) * this.scale) / 2 - y0 * this.scale;
  }
  applyT(c2) {
    const k2 = this.dpr * this.scale;
    c2.setTransform(k2, 0, 0, k2, this.dpr * this.vx, this.dpr * this.vy);
  }
  clearCtx(c2) {
    c2.setTransform(1, 0, 0, 1, 0, 0);
    c2.clearRect(0, 0, c2.canvas.width, c2.canvas.height);
  }
  toWorld(e2) {
    var _a;
    const r2 = (_a = this.rect) != null ? _a : this.stage.getBoundingClientRect();
    return [(e2.clientX - r2.left - this.vx) / this.scale, (e2.clientY - r2.top - this.vy) / this.scale];
  }
  viewBBox() {
    return { x0: -this.vx / this.scale, y0: -this.vy / this.scale, x1: (this.w - this.vx) / this.scale, y1: (this.h - this.vy) / this.scale };
  }
  scheduleRender() {
    if (this.viewTimer) {
      window.clearTimeout(this.viewTimer);
      this.viewTimer = 0;
    }
    if (!this.raf) this.raf = window.requestAnimationFrame(() => {
      this.raf = 0;
      this.renderBase();
    });
  }
  /**
   * Pan / zoom: when a full render is slow (many fills on screen), show the last full render
   * stretched to the new view, and render properly once the view stops changing.
   */
  scheduleViewRender() {
    if (this.lastRenderMs < SLOW_MS || !this.snap) {
      this.scheduleRender();
      return;
    }
    if (!this.raf) this.raf = window.requestAnimationFrame(() => {
      this.raf = 0;
      this.drawSnap();
    });
    if (this.viewTimer) window.clearTimeout(this.viewTimer);
    this.viewTimer = window.setTimeout(() => {
      this.viewTimer = 0;
      this.scheduleRender();
    }, 150);
  }
  glOn() {
    var _a, _b;
    if ((_a = this.gl) == null ? void 0 : _a.lost) {
      this.gl = null;
      (_b = this.glCanvas) == null ? void 0 : _b.remove();
      this.glCanvas = null;
    }
    return !!this.gl;
  }
  /** Fills on the WebGL layer (cheap, so drawn for real on every frame, including previews). */
  renderGL() {
    if (!this.glOn()) return;
    const moving = this.moveDx !== 0 || this.moveDy !== 0;
    const k2 = this.dpr * this.scale;
    this.gl.render(
      this.doc.items,
      k2,
      this.dpr * this.vx,
      this.dpr * this.vy,
      this.viewBBox(),
      moving ? (it) => this.selected.has(it.id) ? [this.moveDx, this.moveDy] : null : null
    );
  }
  drawSnap() {
    this.renderGL();
    const sn = this.snap;
    if (!sn || !this.bctx) return;
    const c2 = this.bctx;
    this.clearCtx(c2);
    const k2 = this.scale / sn.scale;
    c2.drawImage(sn.cv, this.dpr * (this.vx - sn.vx * k2), this.dpr * (this.vy - sn.vy * k2), sn.cv.width * k2, sn.cv.height * k2);
  }
  /** Draw items (fills first, then lines) that pass `want`, culled to the view. Returns the bbox of selected ones. */
  drawItems(c2, want, offsetSel) {
    const vb = this.viewBBox();
    let sel = null;
    for (const pass of this.glOn() ? [drawLine] : [drawFill, drawLine]) {
      for (const it of this.doc.items) {
        const isSel = this.selected.has(it.id);
        if (!want(isSel)) continue;
        const b2 = itemBBox(it);
        if (isSel && pass === drawLine) sel = sel ? { x0: Math.min(sel.x0, b2.x0), y0: Math.min(sel.y0, b2.y0), x1: Math.max(sel.x1, b2.x1), y1: Math.max(sel.y1, b2.y1) } : { ...b2 };
        if (isSel && offsetSel) {
          c2.save();
          c2.translate(this.moveDx, this.moveDy);
          pass(c2, it);
          c2.restore();
          continue;
        }
        if (intersects(b2, vb)) pass(c2, it);
      }
    }
    return sel;
  }
  drawSelBox(c2, sel, dx, dy) {
    if (!sel) return;
    c2.save();
    c2.translate(dx, dy);
    c2.setLineDash([6 / this.scale, 4 / this.scale]);
    c2.lineWidth = 1 / this.scale;
    c2.strokeStyle = "#4c8bf5";
    c2.strokeRect(sel.x0, sel.y0, sel.x1 - sel.x0, sel.y1 - sel.y0);
    c2.restore();
  }
  layer() {
    const cv = createEl("canvas");
    cv.width = this.bctx.canvas.width;
    cv.height = this.bctx.canvas.height;
    const c2 = cv.getContext("2d");
    this.applyT(c2);
    return c2;
  }
  renderBase() {
    var _a;
    if (!this.bctx) return;
    const c2 = this.bctx;
    const moving = this.moveDx !== 0 || this.moveDy !== 0;
    this.renderGL();
    if (!moving) this.moveLayers = null;
    else if (this.moveLayers || this.lastRenderMs >= SLOW_MS) {
      if (!this.moveLayers || this.moveLayers.scale !== this.scale || this.moveLayers.vx !== this.vx || this.moveLayers.vy !== this.vy) {
        const rest = this.layer(), selc = this.layer();
        this.drawItems(rest, (s2) => !s2, false);
        const dx = this.moveDx, dy = this.moveDy;
        this.moveDx = this.moveDy = 0;
        this.drawSelBox(selc, this.drawItems(selc, (s2) => s2, false), 0, 0);
        this.moveDx = dx;
        this.moveDy = dy;
        this.moveLayers = { rest: rest.canvas, sel: selc.canvas, scale: this.scale, vx: this.vx, vy: this.vy };
      }
      const L2 = this.moveLayers;
      this.clearCtx(c2);
      c2.drawImage(L2.rest, 0, 0);
      c2.drawImage(L2.sel, this.moveDx * this.scale * this.dpr, this.moveDy * this.scale * this.dpr);
      return;
    }
    const t0 = performance.now();
    this.clearCtx(c2);
    this.applyT(c2);
    this.drawSelBox(c2, this.drawItems(c2, () => true, moving), this.moveDx, this.moveDy);
    this.lastRenderMs = Math.max(this.lastRenderMs * 0.5, performance.now() - t0);
    window.requestAnimationFrame(() => {
      const d2 = performance.now() - t0 - 17;
      if (d2 > this.lastRenderMs) this.lastRenderMs = d2;
    });
    if (moving) return;
    if (this.lastRenderMs >= SLOW_MS) {
      const w2 = c2.canvas.width, h2 = c2.canvas.height;
      const cv = ((_a = this.snap) == null ? void 0 : _a.cv.width) === w2 && this.snap.cv.height === h2 ? this.snap.cv : Object.assign(createEl("canvas"), { width: w2, height: h2 });
      const sc = cv.getContext("2d");
      sc.clearRect(0, 0, w2, h2);
      sc.drawImage(c2.canvas, 0, 0);
      this.snap = { cv, scale: this.scale, vx: this.vx, vy: this.vy };
    } else this.snap = null;
  }
  selectionBBox() {
    let sel = null;
    for (const it of this.doc.items) {
      if (!this.selected.has(it.id)) continue;
      const b2 = itemBBox(it);
      sel = sel ? { x0: Math.min(sel.x0, b2.x0), y0: Math.min(sel.y0, b2.y0), x1: Math.max(sel.x1, b2.x1), y1: Math.max(sel.y1, b2.y1) } : { ...b2 };
    }
    return sel;
  }
  // ---------- history ----------
  snapshot() {
    this.undoStack.push(this.doc.items.slice());
    if (this.undoStack.length > 200) this.undoStack.shift();
    this.redoStack = [];
  }
  undo() {
    const prev = this.undoStack.pop();
    if (!prev || this.broken !== null) return;
    this.redoStack.push(this.doc.items);
    this.doc.items = prev;
    this.selected.clear();
    this.scheduleRender();
    this.requestSave();
  }
  redo() {
    const next = this.redoStack.pop();
    if (!next || this.broken !== null) return;
    this.undoStack.push(this.doc.items);
    this.doc.items = next;
    this.selected.clear();
    this.scheduleRender();
    this.requestSave();
  }
  mutateSelected(fn) {
    if (this.broken !== null) return;
    this.snapshot();
    this.doc.items = this.doc.items.map((it) => this.selected.has(it.id) ? fn(it) : it);
    this.scheduleRender();
    this.requestSave();
  }
  copySelected() {
    if (!this.selected.size) {
      new import_obsidian2.Notice(tr("\u5148\u9009\u4E2D\u8981\u590D\u5236\u7684\u5185\u5BB9", "Select something to copy first"));
      return;
    }
    clipboard = this.doc.items.filter((it) => this.selected.has(it.id)).map((it) => JSON.parse(JSON.stringify(it)));
    pasteCount = 0;
  }
  /** Paste the copied items, offset a little more each time; centred in the view when the originals are off screen. */
  paste() {
    if (!clipboard.length) {
      new import_obsidian2.Notice(tr("\u8FD8\u6CA1\u6709\u590D\u5236\u5185\u5BB9", "Nothing has been copied yet"));
      return;
    }
    if (this.broken !== null) return;
    let b2 = null;
    for (const it of clipboard) {
      const q = itemBBox(it);
      b2 = b2 ? { x0: Math.min(b2.x0, q.x0), y0: Math.min(b2.y0, q.y0), x1: Math.max(b2.x1, q.x1), y1: Math.max(b2.y1, q.y1) } : { ...q };
    }
    if (!b2) return;
    const vb = this.viewBBox();
    let dx, dy;
    if (intersects(b2, vb)) {
      pasteCount++;
      dx = dy = 24 / this.scale * pasteCount;
    } else {
      dx = (vb.x0 + vb.x1 - b2.x0 - b2.x1) / 2;
      dy = (vb.y0 + vb.y1 - b2.y0 - b2.y1) / 2;
    }
    this.snapshot();
    this.selected.clear();
    for (const it of clipboard) {
      const n2 = { ...translateItem(it, dx, dy), id: uid() };
      this.doc.items.push(n2);
      this.selected.add(n2.id);
    }
    this.scheduleRender();
    this.requestSave();
  }
  deleteSelected() {
    if (!this.selected.size || this.broken !== null) return;
    this.snapshot();
    this.doc.items = this.doc.items.filter((it) => !this.selected.has(it.id));
    this.selected.clear();
    this.scheduleRender();
    this.requestSave();
  }
  // ---------- input ----------
  newGesture(e2, kind) {
    const [x2, y2] = this.toWorld(e2);
    return { pid: e2.pointerId, pointerType: e2.pointerType, kind, sx: x2, sy: y2, cx: x2, cy: y2, lx: e2.clientX, ly: e2.clientY, t0: e2.timeStamp, events: 0, coalesced: 0, pmin: 1, pmax: 0 };
  }
  capture(id) {
    try {
      this.stage.setPointerCapture(id);
    } catch (e2) {
    }
  }
  pressure(e2) {
    if (e2.pointerType !== "pen") return 0.5;
    const p2 = Math.min(1, Math.max(0.02, e2.pressure || 0.02));
    return Math.pow(p2, this.plugin.settings.pressureGamma);
  }
  startTool(e2, tool) {
    var _a;
    const st = this.plugin.settings;
    if (tool === "pen") {
      const g2 = this.newGesture(e2, "stroke");
      const p2 = this.pressure(e2);
      g2.stroke = {
        type: "stroke",
        id: uid(),
        color: this.ink,
        size: this.size,
        fill: null,
        thinning: st.thinning,
        smoothing: st.smoothing,
        streamline: st.streamline,
        sim: e2.pointerType !== "pen",
        points: [[g2.sx, g2.sy, p2]]
      };
      g2.pmin = g2.pmax = p2;
      g2.lo = new LiveOutline({ size: this.size, thinning: st.thinning, smoothing: st.smoothing, streamline: st.streamline, sim: e2.pointerType !== "pen" });
      const m2 = /^(#[0-9a-fA-F]{6})([0-9a-fA-F]{2})$/.exec(this.ink);
      g2.rgb = m2 ? m2[1] : this.ink;
      g2.alpha = m2 ? parseInt(m2[2], 16) / 255 : 1;
      this.g = g2;
      this.drawLiveStroke([]);
    } else if (tool === "eraser") {
      this.g = this.newGesture(e2, "erase");
      this.eraseAt(this.g.sx, this.g.sy);
    } else if (tool === "fill") {
      const [x2, y2] = this.toWorld(e2);
      this.bucket(x2, y2);
    } else if (tool === "select") {
      const [x2, y2] = this.toWorld(e2);
      const sb = this.selectionBBox();
      const r2 = 8 / this.scale;
      let hit = null;
      for (let i2 = this.doc.items.length - 1; i2 >= 0; i2--) {
        const it = this.doc.items[i2];
        if (!isFillOnly(it) && hitItem(it, x2, y2, r2)) {
          hit = it;
          break;
        }
      }
      if (!hit) for (let i2 = this.doc.items.length - 1; i2 >= 0; i2--) {
        const it = this.doc.items[i2];
        if (isFillOnly(it) && hitItem(it, x2, y2, 0)) {
          hit = it;
          break;
        }
      }
      if (hit && !this.selected.has(hit.id)) {
        if (!e2.shiftKey) this.selected.clear();
        this.selected.add(hit.id);
        this.scheduleRender();
      }
      const inSel = sb && x2 >= sb.x0 && x2 <= sb.x1 && y2 >= sb.y0 && y2 <= sb.y1;
      if (hit || inSel) {
        const g2 = this.newGesture(e2, "move");
        g2.sel0 = (_a = this.selectionGeomBBox()) != null ? _a : void 0;
        this.buildSnap(g2, this.selected);
        this.g = g2;
      } else {
        if (!e2.shiftKey) this.selected.clear();
        this.scheduleRender();
        this.g = this.newGesture(e2, "box");
      }
    } else if (tool !== "hand") {
      const g2 = this.newGesture(e2, "shape");
      this.buildSnap(g2, null);
      g2.sx += this.snap1([g2.sx], g2.snapX).d;
      g2.sy += this.snap1([g2.sy], g2.snapY).d;
      g2.shape = { type: tool, id: uid(), color: this.ink, size: this.size, fill: null, x1: g2.sx, y1: g2.sy, x2: g2.sx, y2: g2.sy };
      this.g = g2;
    }
  }
  cancelGesture() {
    const g2 = this.g;
    this.g = null;
    if (!g2) return;
    if (g2.kind === "move") {
      this.moveDx = this.moveDy = 0;
      this.scheduleRender();
    }
    if (g2.kind === "erase" && g2.snapped) this.requestSave();
    this.clearCtx(this.lctx);
  }
  commit(it) {
    this.snapshot();
    this.doc.items.push(it);
    this.snap = null;
    if (it.fill) this.renderBase();
    else {
      this.applyT(this.bctx);
      drawItem(this.bctx, it);
    }
    this.clearCtx(this.lctx);
    this.requestSave();
  }
  /**
   * OneNote-style sticky sizes while dragging a shape: rect/ellipse stick to 1:1 (and 4:3, 2:1 ...),
   * line/arrow stick to multiples of 45 degrees. Returns a label when stuck.
   */
  stickyShape(sh) {
    const w2 = sh.x2 - sh.x1, h2 = sh.y2 - sh.y1;
    const aw = Math.abs(w2), ah = Math.abs(h2);
    if (Math.max(aw, ah) * this.scale < 12) return null;
    if (sh.type === "rect" || sh.type === "ellipse") {
      if (!aw || !ah) return null;
      const ratios = [[1, "1:1"], [4 / 3, "4:3"], [3 / 4, "3:4"], [2, "2:1"], [1 / 2, "1:2"]];
      for (const [t2, name] of ratios) {
        const tol = 0.1;
        if (Math.abs(Math.log(aw / ah / t2)) < tol) {
          if (aw >= ah * t2) sh.y2 = sh.y1 + Math.sign(h2) * aw / t2;
          else sh.x2 = sh.x1 + Math.sign(w2) * ah * t2;
          return name;
        }
      }
      return null;
    }
    const len = Math.hypot(w2, h2);
    const ang = Math.atan2(h2, w2);
    const step = Math.PI / 4;
    const snapped = Math.round(ang / step) * step;
    if (Math.abs(ang - snapped) < 4 * Math.PI / 180) {
      sh.x2 = sh.x1 + Math.cos(snapped) * len;
      sh.y2 = sh.y1 + Math.sin(snapped) * len;
      return `${Math.round((snapped * 180 / Math.PI + 360) % 360)}\xB0`;
    }
    return null;
  }
  drawLabel(text, x2, y2) {
    const c2 = this.lctx;
    c2.save();
    c2.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const sx = x2 * this.scale + this.vx + 12, sy = y2 * this.scale + this.vy + 12;
    c2.font = "12px sans-serif";
    const tw = c2.measureText(text).width;
    c2.fillStyle = "rgba(120,82,238,0.9)";
    c2.fillRect(sx - 4, sy - 12, tw + 8, 17);
    c2.fillStyle = "#fff";
    c2.fillText(text, sx, sy);
    c2.restore();
  }
  /** Paint bucket: fill the closed region under (x, y) with the current colour + opacity. */
  bucket(x2, y2) {
    const ink = this.ink;
    const items = this.doc.items;
    for (let i2 = items.length - 1; i2 >= 0; i2--) {
      const it = items[i2];
      if (isFillOnly(it) && hitItem(it, x2, y2, 0)) {
        this.replaceItem(it, this.withFillStyle({ ...it, color: ink, fill: ink }));
        return;
      }
    }
    let best = null, bestA = Infinity;
    for (const it of items) {
      const o2 = closedOutline(it);
      if (!o2 || !pointInPoly(x2, y2, o2)) continue;
      const a2 = polygonArea(o2);
      if (a2 < bestA) {
        best = it;
        bestA = a2;
      }
    }
    const res = bucketRegion(items, this.viewBBox(), this.scale, x2, y2, this.plugin.settings.fillGap);
    if (res.kind === "wall") return;
    if (res.kind === "open" || !res.rings.length) {
      if (best) this.replaceItem(best, this.withFillStyle({ ...best, fill: ink }));
      else new import_obsidian2.Notice(tr("\u8FD9\u91CC\u4E0D\u662F\u5C01\u95ED\u533A\u57DF\uFF08\u6216\u8005\u533A\u57DF\u8D85\u51FA\u4E86\u5F53\u524D\u5C4F\u5E55\uFF09", "This is not a closed area (or it extends past the screen)"));
      return;
    }
    if (best && res.rings.length === 1 && Math.abs(res.area - bestA) / bestA < 0.12) {
      this.replaceItem(best, this.withFillStyle({ ...best, fill: ink }));
      return;
    }
    const rings = res.rings.slice().sort((a2, b2) => polygonArea(b2) - polygonArea(a2));
    this.commit(this.withFillStyle({ type: "polygon", id: uid(), color: ink, size: 0, fill: ink, points: rings[0], ...rings.length > 1 ? { holes: rings.slice(1) } : {} }));
  }
  replaceItem(old, next) {
    this.snapshot();
    this.doc.items = this.doc.items.map((it) => it === old ? next : it);
    this.scheduleRender();
    this.requestSave();
  }
  selectionGeomBBox() {
    let sel = null;
    for (const it of this.doc.items) {
      if (!this.selected.has(it.id)) continue;
      const b2 = itemGeomBBox(it);
      sel = sel ? { x0: Math.min(sel.x0, b2.x0), y0: Math.min(sel.y0, b2.y0), x1: Math.max(sel.x1, b2.x1), y1: Math.max(sel.y1, b2.y1) } : { ...b2 };
    }
    return sel;
  }
  /** Snap targets: edges and centres of visible shapes (handwriting is ignored). */
  buildSnap(g2, exclude) {
    if (!this.plugin.settings.snap) return;
    const xs = [], ys = [];
    const vb = this.viewBBox();
    for (const it of this.doc.items) {
      if (it.type === "stroke" || (exclude == null ? void 0 : exclude.has(it.id))) continue;
      const b2 = itemGeomBBox(it);
      if (!intersects(b2, vb)) continue;
      xs.push(b2.x0, (b2.x0 + b2.x1) / 2, b2.x1);
      ys.push(b2.y0, (b2.y0 + b2.y1) / 2, b2.y1);
    }
    g2.snapX = xs;
    g2.snapY = ys;
  }
  snap1(vals, cands) {
    let best = Infinity, d2 = 0, at = null;
    if (!cands) return { d: d2, at };
    const tol = 6 / this.scale;
    for (const v2 of vals) for (const c2 of cands) {
      const e2 = Math.abs(c2 - v2);
      if (e2 < tol && e2 < best) {
        best = e2;
        d2 = c2 - v2;
        at = c2;
      }
    }
    return { d: d2, at };
  }
  drawGuides(gx, gy) {
    if (gx === null && gy === null) return;
    const c2 = this.lctx, vb = this.viewBBox();
    c2.save();
    c2.lineWidth = 1 / this.scale;
    c2.strokeStyle = "#7852ee";
    c2.setLineDash([4 / this.scale, 4 / this.scale]);
    c2.beginPath();
    if (gx !== null) {
      c2.moveTo(gx, vb.y0);
      c2.lineTo(gx, vb.y1);
    }
    if (gy !== null) {
      c2.moveTo(vb.x0, gy);
      c2.lineTo(vb.x1, gy);
    }
    c2.stroke();
    c2.restore();
  }
  drawLiveStroke(pred) {
    var _a, _b, _c;
    const g2 = this.g;
    if (!g2 || !g2.stroke) return;
    const s2 = g2.stroke;
    const c2 = this.lctx;
    const lo = g2.lo;
    if (lo && !s2.fill) {
      if (s2.points.length - lo.rawFrozen > 160) lo.advance(s2.points, s2.points.length - 32);
      if (lo.ready) {
        const full = this.bakeLive(g2, lo) || !g2.dirty;
        const t2 = lo.tail(s2.points, pred);
        const L2 = lo.L.slice(Math.max(0, ((_a = g2.bl) != null ? _a : 0) - 2)).concat(t2.L);
        const R2 = lo.R.slice(Math.max(0, ((_b = g2.br) != null ? _b : 0) - 2)).concat(t2.R);
        const poly = L2.concat(t2.cap, R2.reverse());
        const k2 = this.dpr * this.scale, ox = this.dpr * this.vx, oy = this.dpr * this.vy;
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const q of poly) {
          if (q[0] < x0) x0 = q[0];
          if (q[0] > x1) x1 = q[0];
          if (q[1] < y0) y0 = q[1];
          if (q[1] > y1) y1 = q[1];
        }
        const cur = [Math.floor(x0 * k2 + ox) - 3, Math.floor(y0 * k2 + oy) - 3, Math.ceil(x1 * k2 + ox) + 3, Math.ceil(y1 * k2 + oy) + 3];
        const W = c2.canvas.width, H = c2.canvas.height, pd = g2.dirty;
        const rx0 = Math.max(0, full ? 0 : Math.min(cur[0], pd[0])), ry0 = Math.max(0, full ? 0 : Math.min(cur[1], pd[1]));
        const rx1 = Math.min(W, full ? W : Math.max(cur[2], pd[2])), ry1 = Math.min(H, full ? H : Math.max(cur[3], pd[3]));
        g2.dirty = cur;
        if (rx1 <= rx0 || ry1 <= ry0) return;
        const rw = rx1 - rx0, rh = ry1 - ry0;
        c2.setTransform(1, 0, 0, 1, 0, 0);
        c2.clearRect(rx0, ry0, rw, rh);
        c2.drawImage(this.bakeCv, rx0, ry0, rw, rh, rx0, ry0, rw, rh);
        this.applyT(c2);
        c2.fillStyle = g2.rgb;
        c2.fill(smoothPath(poly, false));
        if (((_c = g2.alpha) != null ? _c : 1) < 1) {
          c2.save();
          c2.setTransform(1, 0, 0, 1, 0, 0);
          c2.beginPath();
          c2.rect(rx0, ry0, rw, rh);
          c2.clip();
          c2.globalCompositeOperation = "destination-in";
          c2.fillStyle = `rgba(0,0,0,${g2.alpha})`;
          c2.fillRect(rx0, ry0, rw, rh);
          c2.restore();
        }
        return;
      }
    }
    this.clearCtx(c2);
    this.applyT(c2);
    const pts = pred.length ? s2.points.concat(pred) : s2.points;
    if (s2.fill && pts.length > 2) {
      c2.beginPath();
      c2.moveTo(pts[0][0], pts[0][1]);
      for (let i2 = 1; i2 < pts.length; i2++) c2.lineTo(pts[i2][0], pts[i2][1]);
      c2.closePath();
      c2.fillStyle = s2.fill;
      c2.fill();
    }
    c2.fillStyle = s2.color;
    c2.fill(strokeOutlinePath(pts, s2));
  }
  /** Draw newly frozen outline pieces of the live stroke onto the bake canvas (opaque colour). */
  bakeLive(g2, lo) {
    var _a, _b, _c;
    const cv = (_a = this.bakeCv) != null ? _a : this.bakeCv = createEl("canvas");
    const ctx = cv.getContext("2d");
    const W = this.live.width, H = this.live.height;
    const sig = `${W}x${H}|${this.dpr}|${this.scale}|${this.vx}|${this.vy}`;
    if (g2.bakeSig !== sig) {
      if (cv.width !== W || cv.height !== H) {
        cv.width = W;
        cv.height = H;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      g2.bakeSig = sig;
      g2.bl = 0;
      g2.br = 0;
      g2.dirty = void 0;
    }
    const bl = (_b = g2.bl) != null ? _b : 0, br = (_c = g2.br) != null ? _c : 0;
    if (bl === lo.L.length && br === lo.R.length) return !g2.dirty;
    const first = bl === 0 && br === 0;
    let poly = lo.L.slice(Math.max(0, bl - 2)).concat(lo.R.slice(Math.max(0, br - 2)).reverse());
    if (first) poly = poly.concat(startCap(lo.first, lo.R[0]));
    this.applyT(ctx);
    ctx.fillStyle = g2.rgb;
    ctx.fill(smoothPath(poly, first));
    g2.bl = lo.L.length;
    g2.br = lo.R.length;
    return !g2.dirty;
  }
  eraseAt(x2, y2) {
    const g2 = this.g;
    const r2 = 8 / this.scale;
    const items = this.doc.items;
    let next = null;
    const lineHits = items.filter((it) => hitItem(it, x2, y2, r2, true));
    if (lineHits.length) {
      const hit = new Set(lineHits);
      next = [];
      for (const it of items) {
        if (!hit.has(it)) {
          next.push(it);
          continue;
        }
        const f2 = detachFill(it);
        if (f2) next.unshift(f2);
      }
    } else {
      const fillHits = items.filter((it) => hitFill(it, x2, y2, r2 + it.size / 2 + 2 / this.scale));
      if (fillHits.length) {
        const hit = new Set(fillHits);
        next = [];
        for (const it of items) {
          if (!hit.has(it)) next.push(it);
          else if (!isFillOnly(it)) {
            const n2 = { ...it, fill: null };
            delete n2.fillStyle;
            delete n2.fillDensity;
            next.push(n2);
          }
        }
      }
    }
    if (next && g2) {
      if (!g2.snapped) {
        this.snapshot();
        g2.snapped = true;
      }
      this.doc.items = next;
      this.scheduleRender();
    }
    const c2 = this.lctx;
    this.clearCtx(c2);
    this.applyT(c2);
    c2.beginPath();
    c2.arc(x2, y2, r2, 0, Math.PI * 2);
    c2.lineWidth = 1 / this.scale;
    c2.strokeStyle = "#888";
    c2.stroke();
  }
  startPinch() {
    const [a2, b2] = [...this.touches.values()];
    this.pinch = { s0: this.scale, vx0: this.vx, vy0: this.vy, cx0: (a2.x + b2.x) / 2, cy0: (a2.y + b2.y) / 2, d0: Math.max(1, Math.hypot(a2.x - b2.x, a2.y - b2.y)) };
  }
  updatePinch() {
    var _a;
    const p2 = this.pinch;
    if (!p2 || this.touches.size < 2) return;
    const [a2, b2] = [...this.touches.values()];
    const r2 = (_a = this.rect) != null ? _a : this.stage.getBoundingClientRect();
    const cx = (a2.x + b2.x) / 2, cy = (a2.y + b2.y) / 2;
    const s2 = Math.min(8, Math.max(0.05, p2.s0 * Math.hypot(a2.x - b2.x, a2.y - b2.y) / p2.d0));
    const wx = (p2.cx0 - r2.left - p2.vx0) / p2.s0, wy = (p2.cy0 - r2.top - p2.vy0) / p2.s0;
    this.scale = s2;
    this.vx = cx - r2.left - wx * s2;
    this.vy = cy - r2.top - wy * s2;
    this.scheduleViewRender();
  }
  // ---------- diagnostics ----------
  showDiagnostics() {
    const proto = PointerEvent.prototype;
    const lines = [
      tr(
        `desynchronized\uFF1A\u8BF7\u6C42=${this.diag.desyncRequested}\uFF0CgetContextAttributes \u62A5\u544A=${String(this.diag.desyncGranted)}`,
        `desynchronized: requested=${this.diag.desyncRequested}, getContextAttributes reports=${String(this.diag.desyncGranted)}`
      ),
      tr(`WebGL \u586B\u5145\uFF1A${this.diag.glFill ? "\u5F00" : "\u5173/\u4E0D\u53EF\u7528"}`, `WebGL fills: ${this.diag.glFill ? "on" : "off / unavailable"}`),
      `getCoalescedEvents: ${typeof proto.getCoalescedEvents === "function" ? tr("\u652F\u6301", "supported") : tr("\u4E0D\u652F\u6301", "not supported")}`,
      `getPredictedEvents: ${typeof proto.getPredictedEvents === "function" ? tr("\u652F\u6301", "supported") : tr("\u4E0D\u652F\u6301", "not supported")}`,
      tr(`\u89C1\u5230\u7684\u8F93\u5165\u7C7B\u578B\uFF1A${[...this.diag.types].join(", ") || "\uFF08\u8FD8\u6CA1\u6709\uFF09"}`, `Input types seen: ${[...this.diag.types].join(", ") || "(none yet)"}`),
      tr(`\u4E0A\u4E00\u7B14\uFF1A${this.diag.last || "\uFF08\u5148\u753B\u4E00\u7B14\u518D\u770B\uFF09"}`, `Last stroke: ${this.diag.last || "(draw a stroke first)"}`),
      `devicePixelRatio: ${window.devicePixelRatio}`,
      `Platform: ${["isDesktopApp", "isMobileApp", "isAndroidApp", "isIosApp", "isTablet", "isPhone"].filter((k2) => import_obsidian2.Platform[k2]).join(", ")}`
    ];
    const m2 = new import_obsidian2.Modal(this.app);
    m2.titleEl.setText(tr("\u624B\u5199\u8F93\u5165\u8BCA\u65AD", "Pen input diagnostics"));
    const pre = m2.contentEl.createEl("pre", { cls: "pc-diag" });
    pre.setText(lines.join("\n"));
    m2.contentEl.createEl("p", { text: tr("\u6CE8\u610F\uFF1Adesynchronized=true \u53EA\u8BF4\u660E\u6D4F\u89C8\u5668\u63A5\u53D7\u4E86\u8FD9\u4E2A\u63D0\u793A\uFF0C\u4E0D\u80FD\u8BC1\u660E\u771F\u7684\u8D70\u4E86\u524D\u7F13\u51B2\u6E32\u67D3\u3002\u771F\u5B9E\u5EF6\u8FDF\u8981\u7528\u9AD8\u901F\u6444\u50CF\uFF08\u5982\u624B\u673A\u6162\u52A8\u4F5C\uFF09\u5BF9\u6BD4\u3002", "Note: desynchronized=true only means the browser accepted the hint; it does not prove front-buffer rendering. Measure real latency with a slow-motion video.") });
    m2.open();
  }
};
// Hub: a round, draggable disc. Core = current tool; middle ring = 5 sector keys that fill the ring, two of
// them split in two by a slanted cut into parts of equal area; outer ring = two sliders (left half size, right half opacity;
// bottom = min, top = max). The "···" grips at the top and bottom drag the disc, a tap opens the settings
// menu. Radii in CSS px; keys span r0..r1, split at rm.
// Sizes are 1.1x the 0.19 disc (Rino asked for 10% larger).
_PenCanvasView.HUB = { R: 123, core: 33, r0: 38.5, r1: 89, slideR: 107, slideSpan: 116 };
// tool to return to when a toggle key is tapped again
_PenCanvasView.TOGGLE_TOOLS = ["select", "eraser", "hand"];
_PenCanvasView.SHAPES = ["rect", "ellipse", "line", "arrow"];
var PenCanvasView = _PenCanvasView;
function drawFillIcon(c2, st, color) {
  c2.fillStyle = c2.strokeStyle = color;
  c2.lineWidth = 2.2;
  c2.lineCap = "butt";
  c2.save();
  c2.beginPath();
  c2.rect(2, 2, 36, 36);
  c2.clip();
  const line = (x0, y0, x1, y1) => {
    c2.beginPath();
    c2.moveTo(x0, y0);
    c2.lineTo(x1, y1);
    c2.stroke();
  };
  const dot = (x2, y2, r2) => {
    c2.beginPath();
    c2.arc(x2, y2, r2, 0, Math.PI * 2);
    c2.fill();
  };
  if (st === "solid") c2.fillRect(2, 2, 36, 36);
  else if (st === "hatch" || st === "cross") {
    for (let d2 = -40; d2 <= 80; d2 += 9) {
      line(d2, 40, d2 + 40, 0);
      if (st === "cross") line(d2, 0, d2 + 40, 40);
    }
  } else if (st === "dots") {
    for (let y2 = 6; y2 < 40; y2 += 9) for (let x2 = y2 / 9 % 2 ? 6 : 10.5; x2 < 40; x2 += 9) dot(x2, y2, 2.3);
  } else {
    let seed = 7;
    const rnd = () => {
      seed = seed * 16807 % 2147483647;
      return seed / 2147483647;
    };
    for (let i2 = 0; i2 < 34; i2++) dot(3 + rnd() * 34, 3 + rnd() * 34, 1 + rnd() * 1.2);
  }
  c2.restore();
}

// src/main.ts
var newLabel = () => tr("\u65B0\u5EFA\u624B\u5199\u753B\u5E03", "New pen canvas");
var PenCanvasPlugin = class extends import_obsidian3.Plugin {
  constructor() {
    super(...arguments);
    this.settings = { ...DEFAULT_SETTINGS };
  }
  async onload() {
    await this.loadSettings();
    setLang(this.settings.lang);
    this.registerView(VIEW_TYPE, (leaf) => new PenCanvasView(leaf, this));
    this.registerExtensions([EXT], VIEW_TYPE);
    this.addRibbonIcon("pen-tool", newLabel(), () => {
      void this.createCanvas();
    });
    this.addCommand({ id: "new-canvas", name: newLabel(), callback: () => {
      void this.createCanvas();
    } });
    this.addCommand({
      id: "diagnostics",
      name: tr("\u663E\u793A\u624B\u5199\u8F93\u5165\u8BCA\u65AD\u4FE1\u606F", "Show pen input diagnostics"),
      checkCallback: (checking) => {
        const v2 = this.app.workspace.getActiveViewOfType(PenCanvasView);
        if (!v2) return false;
        if (!checking) v2.showDiagnostics();
        return true;
      }
    });
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file, source) => {
      try {
        const folder = file instanceof import_obsidian3.TFolder ? file : file.parent;
        if (!folder) return;
        menu.addItem((item) => item.setTitle(newLabel()).setIcon("pen-tool").onClick(() => {
          void this.createCanvas(folder);
        }));
      } catch (e2) {
        console.error("[pen-canvas] file-menu handler failed", e2);
      }
    }));
    this.addSettingTab(new PenCanvasSettingTab(this.app, this));
  }
  async createCanvas(folder) {
    var _a;
    const active = this.app.workspace.getActiveFile();
    const parent = folder != null ? folder : this.app.fileManager.getNewFileParent((_a = active == null ? void 0 : active.path) != null ? _a : "");
    const dir = parent.isRoot() ? "" : parent.path + "/";
    const base = tr("\u624B\u5199\u753B\u5E03", "Pen canvas");
    let i2 = 0;
    while (this.app.vault.getAbstractFileByPath((0, import_obsidian3.normalizePath)(`${dir}${base}${i2 ? " " + i2 : ""}.${EXT}`))) i2++;
    const path = (0, import_obsidian3.normalizePath)(`${dir}${base}${i2 ? " " + i2 : ""}.${EXT}`);
    const file = await this.app.vault.create(path, serialize(emptyDoc(this.newBackground())));
    await this.app.workspace.getLeaf(true).openFile(file);
  }
  async setLeftHand(on) {
    this.settings.leftHand = on;
    await this.saveSettings();
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((l2) => {
      if (l2.view instanceof PenCanvasView) l2.view.applyLeftHand();
    });
  }
  /** Background for a new canvas: the last one picked, or black/white following the theme. */
  newBackground() {
    if (this.settings.bgChosen) return this.settings.defaultBackground;
    return activeDocument.body.classList.contains("theme-dark") ? DARK_BG : "#ffffff";
  }
  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...await this.loadData() };
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
function rows() {
  return [
    { key: "leftHand", name: tr("\u5DE6\u624B\u6A21\u5F0F", "Left-hand mode"), desc: tr("\u5706\u76D8\u5185\u5708\u7684\u6309\u952E\u5DE6\u53F3\u955C\u50CF\uFF08\u4F4D\u7F6E\u548C\u5916\u5708\u6ED1\u6761\u4E0D\u53D8\uFF09\u3002\u4E5F\u53EF\u4EE5\u5728\u5706\u76D8\u201C\xB7\xB7\xB7\u201D\u83DC\u5355\u91CC\u5207\u6362\u3002", `Mirrors the keys of the disc menu left to right (its position and the outer sliders stay). Also in the disc's "\xB7\xB7\xB7" menu.`) },
    { key: "penOnly", name: tr("\u53EA\u7528\u7B14\u753B\u753B", "Draw with pen only"), desc: tr("\u5F00\u542F\u540E\u624B\u6307\u53EA\u7528\u6765\u5E73\u79FB/\u7F29\u653E\uFF0C\u7B14\u624D\u753B\u753B\uFF08\u9632\u8BEF\u89E6\uFF09\u3002", "Fingers only pan and zoom; only the pen draws (avoids accidental marks).") },
    { key: "thinning", name: tr("\u538B\u611F\u53D8\u7EC6\u7A0B\u5EA6 (thinning)", "Pressure thinning"), desc: tr("0 = \u4E0D\u53D7\u538B\u529B\u5F71\u54CD\uFF0C1 = \u53D8\u5316\u6700\u5927\u3002", "0 = width ignores pressure, 1 = strongest effect."), slider: [0, 1, 0.05] },
    { key: "pressureGamma", name: tr("\u538B\u611F\u66F2\u7EBF", "Pressure curve"), desc: tr("<1 \u8F7B\u538B\u5C31\u7C97\uFF0C>1 \u8981\u7528\u529B\u624D\u7C97\u3002", "Below 1: light pressure already gives thick lines. Above 1: press harder for thick lines."), slider: [0.3, 2.5, 0.05] },
    { key: "smoothing", name: tr("\u8F6E\u5ED3\u5E73\u6ED1 (smoothing)", "Edge smoothing"), slider: [0, 1, 0.05] },
    { key: "streamline", name: tr("\u9632\u6296 (streamline)", "Stabilizer (streamline)"), desc: tr("\u8D8A\u5927\u8D8A\u987A\uFF0C\u4F46\u7B14\u8FF9\u4F1A\u66F4\u660E\u663E\u5730\u843D\u540E\u7B14\u5C16\u3002", "Higher is smoother, but the line trails further behind the pen tip."), slider: [0, 0.9, 0.05] },
    { key: "prediction", name: tr("\u7B14\u5C16\u9884\u6D4B", "Pen tip prediction"), desc: tr("\u7528 getPredictedEvents \u63D0\u524D\u753B\u4E00\u5C0F\u6BB5\uFF0C\u51CF\u5C11\u89C6\u89C9\u5EF6\u8FDF\uFF1B\u62AC\u7B14\u540E\u9884\u6D4B\u90E8\u5206\u88AB\u4E22\u5F03\u3002", "Draws a short predicted piece ahead of the pen (getPredictedEvents) to hide latency. The prediction is dropped when you lift the pen.") },
    { key: "desynchronized", name: tr("\u4F4E\u5EF6\u8FDF\u753B\u5E03 (desynchronized)", "Low-latency canvas (desynchronized)"), desc: tr("\u91CD\u65B0\u6253\u5F00\u753B\u5E03\u540E\u751F\u6548\u3002\u82E5\u51FA\u73B0\u6495\u88C2\u6216\u95EA\u70C1\u53EF\u5173\u95ED\u3002", "Applies after reopening the canvas. Turn off if you see tearing or flicker.") },
    { key: "snap", name: tr("\u5BF9\u9F50\u5438\u9644", "Snapping"), desc: tr("\u753B\u5F62\u72B6\u3001\u79FB\u52A8\u9009\u4E2D\u5185\u5BB9\u65F6\uFF0C\u5438\u9644\u5230\u5176\u4ED6\u5F62\u72B6\u7684\u8FB9\u548C\u4E2D\u7EBF\u5E76\u663E\u793A\u53C2\u8003\u7EBF\uFF08\u624B\u5199\u7B14\u753B\u4E0D\u53C2\u4E0E\uFF09\u3002\u62D6\u692D\u5706/\u77E9\u5F62\u65F6\u4F1A\u5728 1:1\u30014:3\u30012:1 \u7B49\u6BD4\u4F8B\u505C\u4E00\u4E0B\uFF0C\u76F4\u7EBF/\u7BAD\u5934\u5728 45\xB0 \u500D\u6570\u505C\u4E00\u4E0B\u3002", "When drawing shapes or moving a selection, snap to the edges and centre lines of other shapes and show guides (handwriting is ignored). Ellipses and rectangles pause at 1:1, 4:3, 2:1 and similar ratios; lines and arrows at multiples of 45\xB0.") },
    { key: "fillGap", name: tr("\u586B\u5145\u5C01\u53E3\u95F4\u9699\uFF08\u50CF\u7D20\uFF09", "Fill gap tolerance (px)"), desc: tr("\u7EBF\u6761\u4E4B\u95F4\u5C0F\u4E8E\u8FD9\u4E2A\u8DDD\u79BB\u7684\u7F3A\u53E3\uFF0C\u586B\u5145\u65F6\u5F53\u4F5C\u5C01\u95ED\u30020 = \u5FC5\u987B\u5B8C\u5168\u5C01\u53E3\u3002", "Gaps between lines smaller than this count as closed when filling. 0 = the area must be fully closed."), slider: [0, 20, 1] },
    { key: "glFill", name: tr("GPU \u6E32\u67D3\u586B\u5145 (WebGL)", "GPU fills (WebGL)"), desc: tr("\u586B\u5145\u7528\u663E\u5361\u7ED8\u5236\uFF0C\u5927\u91CF\u56FE\u6848\u586B\u5145\u65F6\u66F4\u6D41\u7545\u3001\u653E\u5927\u4E0D\u7CCA\u3002\u91CD\u65B0\u6253\u5F00\u753B\u5E03\u540E\u751F\u6548\uFF1B\u82E5\u663E\u793A\u5F02\u5E38\u53EF\u5173\u95ED\uFF0C\u6539\u56DE\u539F\u6765\u7684\u65B9\u5F0F\u3002", "Draws fills on the GPU: smoother with many pattern fills and sharp when zoomed. Applies after reopening the canvas; turn off if fills look wrong.") }
  ];
}
var langName = () => tr("\u754C\u9762\u8BED\u8A00", "Language");
var langDesc = () => tr("\u9ED8\u8BA4\u8DDF\u968F Obsidian \u7684\u8BED\u8A00\u3002\u91CD\u65B0\u6253\u5F00\u753B\u5E03\u540E\u751F\u6548\uFF08\u547D\u4EE4\u540D\u8981\u91CD\u542F Obsidian\uFF09\u3002", "Follows Obsidian's language by default. Applies to canvases opened afterwards (command names after restarting Obsidian).");
var langOptions = () => ({ auto: tr("\u8DDF\u968F Obsidian", "Follow Obsidian"), zh: "\u4E2D\u6587", en: "English" });
var noteName = () => tr("\u7B14\u8FF9\u53C2\u6570\u53EA\u5F71\u54CD\u4E4B\u540E\u753B\u7684\u65B0\u7B14\u753B", "Stroke settings only affect new strokes");
var noteDesc = () => tr("\u65E7\u7B14\u753B\u6309\u5404\u81EA\u4FDD\u5B58\u7684\u53C2\u6570\u6E32\u67D3\uFF0C\u6240\u4EE5\u5728\u7535\u8111\u548C\u5E73\u677F\u4E0A\u770B\u8D77\u6765\u4E00\u81F4\u3002", "Existing strokes keep the settings they were drawn with, so they look the same on every device.");
var bgName = () => tr("\u65B0\u753B\u5E03\u9ED8\u8BA4\u80CC\u666F\u8272", "Default background for new canvases");
var bgDesc = () => tr("\u9ED8\u8BA4\u8DDF\u968F\u4E3B\u9898\uFF08\u6697\u8272\u4E3B\u9898\u9ED1\u5E95\u3001\u4EAE\u8272\u4E3B\u9898\u767D\u5E95\uFF09\uFF1B\u5728\u753B\u5E03\u91CC\u9009\u8FC7\u80CC\u666F\u8272\u540E\u4F1A\u8BB0\u4F4F\u4E0A\u6B21\u7684\u9009\u62E9\u3002", "Follows the theme by default (dark theme: black, light theme: white). Once you pick a background in a canvas, that choice is remembered.");
var PenCanvasSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  /** Writes one setting and its side effects; shared by both settings UIs. Returns true when the tab must be rebuilt. */
  apply(key, value) {
    const s2 = this.plugin.settings;
    if (key === "leftHand") {
      void this.plugin.setLeftHand(value === true);
      return false;
    }
    s2[key] = value;
    if (key === "lang") setLang(s2.lang);
    void this.plugin.saveSettings();
    return key === "lang";
  }
  background(setting) {
    const s2 = this.plugin.settings;
    setting.addColorPicker((c2) => {
      c2.setValue(this.plugin.newBackground()).onChange((v2) => {
        s2.defaultBackground = v2;
        s2.bgChosen = true;
        void this.plugin.saveSettings();
      });
      setting.addExtraButton((b2) => b2.setIcon("rotate-ccw").setTooltip(tr("\u6062\u590D\u8DDF\u968F\u4E3B\u9898", "Follow the theme again")).onClick(() => {
        s2.bgChosen = false;
        void this.plugin.saveSettings();
        c2.setValue(this.plugin.newBackground());
      }));
    });
  }
  // Obsidian 1.13 and later: declarative settings (also indexed by the settings search).
  getSettingDefinitions() {
    const stroke = rows().map((r2) => ({
      name: r2.name,
      desc: r2.desc,
      control: r2.slider ? { type: "slider", key: r2.key, min: r2.slider[0], max: r2.slider[1], step: r2.slider[2] } : { type: "toggle", key: r2.key }
    }));
    return [
      { name: langName(), desc: langDesc(), control: { type: "dropdown", key: "lang", options: langOptions() } },
      { name: noteName(), desc: noteDesc(), searchable: false },
      ...stroke,
      { name: bgName(), desc: bgDesc(), render: (setting) => this.background(setting) }
    ];
  }
  getControlValue(key) {
    return this.plugin.settings[key];
  }
  setControlValue(key, value) {
    if (this.apply(key, value) && (0, import_obsidian3.requireApiVersion)("1.13.0")) this.update();
  }
  // Obsidian older than 1.13: imperative fallback with the same rows.
  display() {
    this.build();
  }
  build() {
    const { containerEl } = this;
    containerEl.empty();
    const s2 = this.plugin.settings;
    new import_obsidian3.Setting(containerEl).setName(langName()).setDesc(langDesc()).addDropdown((d2) => d2.addOptions(langOptions()).setValue(this.plugin.settings.lang).onChange((v2) => {
      if (this.apply("lang", v2)) this.build();
    }));
    new import_obsidian3.Setting(containerEl).setName(noteName()).setDesc(noteDesc());
    for (const r2 of rows()) {
      const row = new import_obsidian3.Setting(containerEl).setName(r2.name);
      if (r2.desc) row.setDesc(r2.desc);
      const sl = r2.slider;
      if (sl) row.addSlider((c2) => c2.setLimits(sl[0], sl[1], sl[2]).setValue(s2[r2.key]).onChange((v2) => {
        this.apply(r2.key, v2);
      }));
      else row.addToggle((c2) => c2.setValue(s2[r2.key]).onChange((v2) => {
        this.apply(r2.key, v2);
      }));
    }
    this.background(new import_obsidian3.Setting(containerEl).setName(bgName()).setDesc(bgDesc()));
  }
};
