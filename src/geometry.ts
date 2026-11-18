import { getStroke } from 'perfect-freehand';
import { CanvasDoc, FillStyle, Item, PolygonItem, Pt, ShapeItem, StrokeItem } from './types';

export interface BBox { x0: number; y0: number; x1: number; y1: number; }

interface Cache { path: Path2D; fillPath?: Path2D; head?: Path2D; bbox: BBox; gbox: BBox; }
const cache = new WeakMap<Item, Cache>();

type StrokeParams = Pick<StrokeItem, 'size' | 'thinning' | 'smoothing' | 'streamline' | 'sim'>;

export function strokeOutlinePath(points: Pt[], s: StrokeParams): Path2D {
	const outline = getStroke(points, {
		size: s.size,
		thinning: s.thinning,
		smoothing: s.smoothing,
		streamline: s.streamline,
		simulatePressure: s.sim,
		last: true, // same for live and final render -> no shape change on pen-up
	});
	const p = new Path2D();
	const n = outline.length;
	if (n < 2) return p;
	p.moveTo(outline[0][0], outline[0][1]);
	for (let i = 0; i < n; i++) {
		const a = outline[i], b = outline[(i + 1) % n];
		p.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
	}
	p.closePath();
	return p;
}

function polygonPath(pts: ArrayLike<number>[]): Path2D {
	const p = new Path2D();
	if (!pts.length) return p;
	p.moveTo(pts[0][0], pts[0][1]);
	for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
	p.closePath();
	return p;
}

function arrowGeom(it: ShapeItem): { shaftEnd: [number, number]; head: [number, number][] } {
	const dx = it.x2 - it.x1, dy = it.y2 - it.y1;
	const len = Math.hypot(dx, dy) || 1;
	let h = Math.max(it.size * 3.5, 10);
	if (h > len * 0.6) h = len * 0.6;
	const ux = dx / len, uy = dy / len;
	const bx = it.x2 - ux * h, by = it.y2 - uy * h;
	const w = h * 0.55;
	return {
		shaftEnd: [bx + ux * h * 0.2, by + uy * h * 0.2],
		head: [[it.x2, it.y2], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]],
	};
}

export function shapePath(it: ShapeItem): { path: Path2D; head?: Path2D } {
	const p = new Path2D();
	const x = Math.min(it.x1, it.x2), y = Math.min(it.y1, it.y2);
	const w = Math.abs(it.x2 - it.x1), h = Math.abs(it.y2 - it.y1);
	switch (it.type) {
		case 'rect': p.rect(x, y, w, h); return { path: p };
		case 'ellipse': p.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); return { path: p };
		case 'line': p.moveTo(it.x1, it.y1); p.lineTo(it.x2, it.y2); return { path: p };
		case 'arrow': {
			const g = arrowGeom(it);
			p.moveTo(it.x1, it.y1); p.lineTo(g.shaftEnd[0], g.shaftEnd[1]);
			return { path: p, head: polygonPath(g.head) };
		}
	}
}

/** Polyline used for hit testing and bbox. */
function polyline(it: Item): { pts: number[][]; closed: boolean } {
	if (it.type === 'stroke') return { pts: it.points, closed: !!it.fill };
	if (it.type === 'polygon') return { pts: it.points, closed: true };
	if (it.type === 'rect') return { pts: [[it.x1, it.y1], [it.x2, it.y1], [it.x2, it.y2], [it.x1, it.y2]], closed: true };
	if (it.type === 'ellipse') {
		const cx = (it.x1 + it.x2) / 2, cy = (it.y1 + it.y2) / 2;
		const rx = Math.abs(it.x2 - it.x1) / 2, ry = Math.abs(it.y2 - it.y1) / 2;
		const pts: number[][] = [];
		for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
		return { pts, closed: true };
	}
	return { pts: [[it.x1, it.y1], [it.x2, it.y2]], closed: false };
}

function getCache(it: Item): Cache {
	let c = cache.get(it);
	if (c) return c;
	const pl = polyline(it).pts;
	let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
	for (const q of pl) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
	const pad = it.size * (it.type === 'arrow' ? 4 : 1) + 1;
	const bbox = { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
	const gbox = { x0, y0, x1, y1 };
	if (it.type === 'stroke') {
		c = { path: strokeOutlinePath(it.points, it), bbox, gbox, fillPath: it.fill ? polygonPath(it.points) : undefined };
	} else if (it.type === 'polygon') {
		c = { path: polygonPath(it.points), bbox, gbox };
		for (const h of it.holes ?? []) c.path.addPath(polygonPath(h));
	} else {
		const sp = shapePath(it);
		c = { path: sp.path, head: sp.head, bbox, gbox };
	}
	cache.set(it, c);
	return c;
}

export function itemBBox(it: Item): BBox { return getCache(it).bbox; }
/** Geometric bbox without stroke padding (used for snapping). */
export function itemGeomBBox(it: Item): BBox { return getCache(it).gbox; }

export function intersects(a: BBox, b: BBox): boolean {
	return a.x0 <= b.x1 && a.x1 >= b.x0 && a.y0 <= b.y1 && a.y1 >= b.y0;
}

const RES = 4; // tile pixels per world unit for the raster pattern

/** One repeating tile of a fill style, in world units: dots [x, y, r]* and line segments [x0, y0, x1, y1]*. */
interface TileSpec { size: number; res: number; dots: Float32Array; lines: number[]; cell: number; nc: number; start: Uint32Array; }
const specs = new Map<string, TileSpec>();
const patterns = new Map<string, { pat: CanvasPattern; res: number }>();
const screens = new Map<string, { cv: HTMLCanvasElement }>();

function tileSpec(style: FillStyle, density: number): TileSpec {
	const key = `${style}|${density}`;
	const hit = specs.get(key);
	if (hit) return hit;
	const d = density <= 10 ? density * 10 : density; // 0.5.0 stored 1..10
	const TILE = Math.round(800 / Math.max(10, Math.min(100, d))); // world units; 50% -> 16
	// Stipple uses one large tile (512 world units) so the repeat is not visible; density sets dot count.
	const size = style === 'stipple' ? 512 : TILE;
	const dots: number[] = [], lines: number[] = [];
	if (style === 'hatch' || style === 'cross') {
		lines.push(-1, size + 1, size + 1, -1, -1, 1, 1, -1, size - 1, size + 1, size + 1, size - 1);
		if (style === 'cross') lines.push(-1, -1, size + 1, size + 1, size - 1, -1, size + 1, 1, -1, size - 1, 1, size + 1);
	} else if (style === 'dots') {
		dots.push(size / 4, size / 4, 1.6, (size * 3) / 4, (size * 3) / 4, 1.6);
	} else {
		// "Electron cloud": fixed pseudo-random stipple, the same on every device.
		let seed = 12345;
		const rnd = () => { // mulberry32
			seed = (seed + 0x6d2b79f5) | 0;
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
		for (let i = 0, n = Math.round(size * size * 0.025 * (16 / TILE) ** 2); i < n; i++) dots.push(rnd() * size, rnd() * size, 0.6 + rnd() * 0.9);
	}
	// Bucket the dots into a grid of cells so drawing a small area only visits the dots near it.
	const nc = Math.max(1, Math.round(size / 32)), cell = size / nc;
	const cellOf = (k: number) => Math.min(nc - 1, Math.floor(dots[k + 1] / cell)) * nc + Math.min(nc - 1, Math.floor(dots[k] / cell));
	const start = new Uint32Array(nc * nc + 1);
	for (let k = 0; k < dots.length; k += 3) start[cellOf(k) + 1]++;
	for (let i = 0; i < nc * nc; i++) start[i + 1] += start[i];
	const fill = start.slice(0, nc * nc), sorted = new Float32Array(dots.length);
	for (let k = 0; k < dots.length; k += 3) { const at = fill[cellOf(k)]++ * 3; sorted[at] = dots[k]; sorted[at + 1] = dots[k + 1]; sorted[at + 2] = dots[k + 2]; }
	const spec = { size, res: Math.min(RES, 2048 / size), dots: sorted, lines, cell, nc, start };
	specs.set(key, spec);
	return spec;
}

/** Draw the tile's primitives for every tile overlapping rect r (world units) into ctx's current transform. */
function paintTiles(t: CanvasRenderingContext2D, sp: TileSpec, r: BBox): void {
	const { size, dots, lines } = sp;
	const i0 = Math.floor((r.x0 - 2) / size), i1 = Math.floor((r.x1 + 2) / size);
	const j0 = Math.floor((r.y0 - 2) / size), j1 = Math.floor((r.y1 + 2) / size);
	if (dots.length) {
		t.beginPath();
		const { cell, nc, start } = sp;
		for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
			const ox = i * size, oy = j * size;
			// Cells of this tile that overlap r (dots reach at most 2 units past their cell).
			const cx0 = Math.max(0, Math.floor((r.x0 - ox - 2) / cell)), cx1 = Math.min(nc - 1, Math.floor((r.x1 - ox + 2) / cell));
			const cy0 = Math.max(0, Math.floor((r.y0 - oy - 2) / cell)), cy1 = Math.min(nc - 1, Math.floor((r.y1 - oy + 2) / cell));
			for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
				const q = cy * nc + cx;
				for (let k = start[q] * 3, e = start[q + 1] * 3; k < e; k += 3) {
					const x = ox + dots[k], y = oy + dots[k + 1], rr = dots[k + 2];
					if (x + rr < r.x0 || x - rr > r.x1 || y + rr < r.y0 || y - rr > r.y1) continue;
					t.moveTo(x + rr, y); t.arc(x, y, rr, 0, Math.PI * 2);
				}
			}
		}
		t.fill();
	}
	if (lines.length) {
		t.lineWidth = 1.2; t.lineCap = 'square';
		t.beginPath();
		for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
			const ox = i * size, oy = j * size;
			for (let k = 0; k < lines.length; k += 4) { t.moveTo(ox + lines[k], oy + lines[k + 1]); t.lineTo(ox + lines[k + 2], oy + lines[k + 3]); }
		}
		t.stroke();
	}
}

/** Repeating raster pattern in world space (the context transform scales it with the canvas). */
function fillPattern(ctx: CanvasRenderingContext2D, color: string, sp: TileSpec, key: string): CanvasPattern | string {
	const hit = patterns.get(key);
	if (hit) return hit.pat;
	const cv = document.createElement('canvas');
	cv.width = cv.height = Math.ceil(sp.size * sp.res);
	const t = cv.getContext('2d') as CanvasRenderingContext2D;
	t.scale(sp.res, sp.res);
	t.strokeStyle = t.fillStyle = color;
	paintTiles(t, sp, { x0: 0, y0: 0, x1: sp.size, y1: sp.size }); // includes the overlaps from neighbour tiles
	const pat = ctx.createPattern(cv, 'repeat');
	if (!pat) return color;
	pat.setTransform(new DOMMatrix().scale(1 / sp.res));
	if (patterns.size >= 12) patterns.delete(patterns.keys().next().value as string); // stipple tiles are 16 MB each
	patterns.set(key, { pat, res: sp.res });
	return pat;
}

/** Pattern fill: raster tile while it is sharp enough, else vector primitives for the visible part only. */
function patternFill(ctx: CanvasRenderingContext2D, it: Item, clip: Path2D, rule: CanvasFillRule, bbox: BBox): void {
	const style = it.fillStyle as FillStyle, density = it.fillDensity ?? 50, color = it.fill as string;
	const sp = tileSpec(style, density);
	const m = ctx.getTransform();
	const px = Math.hypot(m.a, m.b); // device pixels per world unit
	if (px <= sp.res * 1.1) {
		ctx.fillStyle = fillPattern(ctx, color, sp, `${color}|${style}|${density}`);
		ctx.fill(clip, rule);
		return;
	}
	// Vector: draw the visible dots/lines once per frame into a screen-sized layer for this colour+style,
	// then every fill of that kind just clips and copies it, so the cost does not grow with the number of fills.
	const cw = ctx.canvas.width, ch = ctx.canvas.height;
	const key = `${color}|${style}|${density}|${m.a},${m.b},${m.c},${m.d},${m.e},${m.f},${cw},${ch}`;
	let L = screens.get(key);
	if (!L) {
		// Reuse the oldest layer's canvas (layers for an old view are never needed again).
		let cv: HTMLCanvasElement | undefined;
		if (screens.size >= 6) { const k0 = screens.keys().next().value as string; cv = screens.get(k0)?.cv; screens.delete(k0); }
		cv ??= document.createElement('canvas');
		if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
		const t = cv.getContext('2d') as CanvasRenderingContext2D;
		t.setTransform(1, 0, 0, 1, 0, 0);
		t.clearRect(0, 0, cw, ch);
		t.setTransform(m);
		t.fillStyle = t.strokeStyle = color;
		const inv = m.inverse();
		let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
		for (const [sx, sy] of [[0, 0], [cw, 0], [0, ch], [cw, ch]]) {
			const p = inv.transformPoint(new DOMPoint(sx, sy));
			x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
		}
		paintTiles(t, sp, { x0, y0, x1, y1 });
		L = { cv };
		screens.set(key, L);
	}
	ctx.save();
	ctx.clip(clip, rule);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.drawImage(L.cv, 0, 0);
	ctx.restore();
	void bbox;
}

/** A bucket-fill region: a polygon (maybe with holes) without an outline. */
export function isFillOnly(it: Item): boolean { return it.type === 'polygon' && it.size <= 0; }

export function drawItem(ctx: CanvasRenderingContext2D, it: Item): void {
	drawFill(ctx, it);
	drawLine(ctx, it);
}

/** Fills are drawn in a first pass, under every line, so filling never hides a line. */
export function drawFill(ctx: CanvasRenderingContext2D, it: Item): void {
	if (!it.fill || it.type === 'line' || it.type === 'arrow') return;
	const c = getCache(it);
	const path = it.type === 'stroke' ? c.fillPath : c.path;
	if (!path) return;
	const rule: CanvasFillRule = it.type === 'stroke' ? 'nonzero' : 'evenodd';
	if (it.fillStyle && it.fillStyle !== 'solid') { patternFill(ctx, it, path, rule, c.bbox); return; }
	ctx.fillStyle = it.fill;
	ctx.fill(path, rule);
}

export function drawLine(ctx: CanvasRenderingContext2D, it: Item): void {
	const c = getCache(it);
	if (it.type === 'stroke') { ctx.fillStyle = it.color; ctx.fill(c.path); return; }
	if (it.size <= 0) return;
	ctx.strokeStyle = it.color;
	ctx.lineWidth = it.size;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.stroke(c.path);
	if (c.head) { ctx.fillStyle = it.color; ctx.fill(c.head); ctx.stroke(c.head); }
}

/** A freehand stroke whose ends are closer than this fraction of its size counts as closed. */
export const OPEN_GAP = 0.6;

/** Ends of a nearly closed freehand stroke (to be joined virtually for filling), else null. */
export function strokeGap(it: Item): [number[], number[]] | null {
	if (it.type !== 'stroke' || it.points.length < 3) return null;
	const pts = it.points, a = pts[0], z = pts[pts.length - 1];
	const b = getCache(it).gbox;
	const gap = Math.hypot(a[0] - z[0], a[1] - z[1]);
	return gap < Math.max(8, OPEN_GAP * Math.hypot(b.x1 - b.x0, b.y1 - b.y0)) ? [z, a] : null;
}

/** True when (x, y) is inside the item's fill (not counting its line). */
export function hitFill(it: Item, x: number, y: number, margin = 0): boolean {
	if (!it.fill || it.type === 'line' || it.type === 'arrow') return false;
	const b = getCache(it).gbox;
	if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return false;
	const pts = polyline(it).pts;
	if (!inPoly(x, y, pts)) return false;
	const rings = it.type === 'polygon' && it.holes ? [pts, ...it.holes] : [pts];
	if (it.type === 'polygon' && it.holes?.some((h) => inPoly(x, y, h))) return false;
	// Stay `margin` away from the edge so rubbing along a line does not also take the fill.
	if (margin > 0) for (const ring of rings) for (let i = 0; i < ring.length; i++) {
		if (it.type === 'stroke' && i === ring.length - 1) continue; // the gap of an open stroke has no line
		const p = ring[i], q = ring[(i + 1) % ring.length];
		if (distSeg(x, y, p[0], p[1], q[0], q[1]) < margin) return false;
	}
	return true;
}

/** The fill of an item as a separate outline-less region (used when its line is erased). */
export function detachFill(it: Item): PolygonItem | null {
	if (!it.fill || it.type === 'line' || it.type === 'arrow') return null;
	const pts = polyline(it).pts.map((p) => [round(p[0], 2), round(p[1], 2)] as [number, number]);
	if (pts.length < 3) return null;
	return {
		type: 'polygon', id: uid(), color: it.fill, size: 0, fill: it.fill, points: pts,
		...(it.type === 'polygon' && it.holes ? { holes: it.holes } : {}),
		...(it.fillStyle ? { fillStyle: it.fillStyle } : {}),
		...(it.fillDensity ? { fillDensity: it.fillDensity } : {}),
	};
}

export function polygonArea(pts: number[][]): number {
	let a = 0;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] + pts[i][0]) * (pts[j][1] - pts[i][1]);
	return Math.abs(a / 2);
}

/** Interior (fillable) outline of a closed item, or null if it is not closed. */
export function closedOutline(it: Item): number[][] | null {
	if (it.type === 'line' || it.type === 'arrow' || isFillOnly(it)) return null;
	const { pts } = polyline(it);
	if (it.type !== 'stroke') return pts;
	if (pts.length < 3) return null;
	const b = getCache(it).gbox;
	const gap = Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
	return gap < Math.max(8, OPEN_GAP * Math.hypot(b.x1 - b.x0, b.y1 - b.y0)) ? pts : null;
}

export function pointInPoly(x: number, y: number, pts: number[][]): boolean { return inPoly(x, y, pts); }

export function drawShape(ctx: CanvasRenderingContext2D, it: ShapeItem | PolygonItem): void {
	if (it.type === 'polygon') { drawShapeWith(ctx, it, polygonPath(it.points)); return; }
	const sp = shapePath(it);
	drawShapeWith(ctx, it, sp.path, sp.head);
}

function drawShapeWith(ctx: CanvasRenderingContext2D, it: ShapeItem | PolygonItem, path: Path2D, head?: Path2D): void {
	if (it.fill && (it.type === 'rect' || it.type === 'ellipse' || it.type === 'polygon')) { ctx.fillStyle = it.fill; ctx.fill(path); }
	ctx.strokeStyle = it.color;
	ctx.lineWidth = it.size;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.stroke(path);
	if (head) {
		ctx.fillStyle = it.color;
		ctx.fill(head);
		ctx.stroke(head);
	}
}

function distSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
	const dx = bx - ax, dy = by - ay;
	const l = dx * dx + dy * dy;
	let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0;
	t = Math.max(0, Math.min(1, t));
	return Math.hypot(ax + t * dx - px, ay + t * dy - py);
}

function inPoly(x: number, y: number, pts: number[][]): boolean {
	let inside = false;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
		const xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
		if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

export function hitItem(it: Item, x: number, y: number, r: number, linesOnly = false): boolean {
	const b = getCache(it).bbox;
	if (x < b.x0 - r || x > b.x1 + r || y < b.y0 - r || y > b.y1 + r) return false;
	const { pts, closed } = polyline(it);
	const tol = it.size / 2 + r;
	if (linesOnly && isFillOnly(it)) return false;
	if (pts.length === 1) return Math.hypot(pts[0][0] - x, pts[0][1] - y) < tol;
	for (let i = 1; i < pts.length; i++) if (distSeg(x, y, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]) < tol) return true;
	// A filled freehand stroke is closed only virtually: its gap has no line to hit.
	if (closed && it.type !== 'stroke' && distSeg(x, y, pts[pts.length - 1][0], pts[pts.length - 1][1], pts[0][0], pts[0][1]) < tol) return true;
	if (!linesOnly && it.fill && closed && inPoly(x, y, pts)) {
		if (it.type === 'polygon' && it.holes?.some((h) => inPoly(x, y, h))) return false;
		return true;
	}
	return false;
}

export function translateItem(it: Item, dx: number, dy: number): Item {
	if (it.type === 'stroke') {
		return { ...it, points: it.points.map((p) => [round(p[0] + dx, 2), round(p[1] + dy, 2), p[2]] as Pt) };
	}
	if (it.type === 'polygon') {
		const mv = (ring: [number, number][]) => ring.map((p) => [round(p[0] + dx, 2), round(p[1] + dy, 2)] as [number, number]);
		return { ...it, points: mv(it.points), ...(it.holes ? { holes: it.holes.map(mv) } : {}) };
	}
	return { ...it, x1: round(it.x1 + dx, 2), y1: round(it.y1 + dy, 2), x2: round(it.x2 + dx, 2), y2: round(it.y2 + dy, 2) };
}

export function round(v: number, d: number): number {
	const m = Math.pow(10, d);
	return Math.round(v * m) / m;
}

export function uid(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** One item per line: valid JSON, readable diffs, easy for an AI to edit. */
export function serialize(d: CanvasDoc): string {
	const head = JSON.stringify({ type: d.type, version: d.version, background: d.background });
	const items = d.items.map((i) => JSON.stringify(i));
	return head.slice(0, -1) + ',"items":[' + (items.length ? '\n' + items.join(',\n') + '\n' : '') + ']}\n';
}

export function emptyDoc(bg: string): CanvasDoc {
	return { type: 'pen-canvas', version: 1, background: bg, items: [] };
}

/** Returns null for an empty file, throws on invalid content. */
export function parseDoc(text: string): CanvasDoc | null {
	if (!text.trim()) return null;
	const raw = JSON.parse(text) as Partial<CanvasDoc>;
	if (raw.type !== 'pen-canvas' || !Array.isArray(raw.items)) throw new Error('不是 pen-canvas 文件');
	const items = raw.items.filter((i: Item) => i && typeof i === 'object' && typeof i.type === 'string' &&
		(i.type === 'stroke' || i.type === 'polygon' ? Array.isArray(i.points) && i.points.length > 0 : ['rect', 'ellipse', 'line', 'arrow'].includes(i.type)));
	for (const i of items) {
		if (!i.id) i.id = uid();
		if (typeof i.size !== 'number') i.size = 3;
		if (!i.color) i.color = '#1e1e1e';
		if (i.fill === undefined) i.fill = null;
		if (i.type === 'stroke') {
			if (typeof i.thinning !== 'number') i.thinning = 0.6;
			if (typeof i.smoothing !== 'number') i.smoothing = 0.5;
			if (typeof i.streamline !== 'number') i.streamline = 0.3;
			if (typeof i.sim !== 'boolean') i.sim = false;
			i.points = i.points.map((p) => [p[0], p[1], typeof p[2] === 'number' ? p[2] : 0.5] as Pt);
		}
	}
	return { type: 'pen-canvas', version: 1, background: typeof raw.background === 'string' ? raw.background : '#ffffff', items };
}

function segsCross(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): boolean {
	const o = (px: number, py: number, qx: number, qy: number, rx: number, ry: number) => Math.sign((qx - px) * (ry - py) - (qy - py) * (rx - px));
	return o(ax, ay, bx, by, cx, cy) !== o(ax, ay, bx, by, dx, dy) && o(cx, cy, dx, dy, ax, ay) !== o(cx, cy, dx, dy, bx, by);
}

/** True when the item's drawn line passes through the box (touching is enough). */
export function itemTouchesBox(it: Item, b: BBox): boolean {
	if (!intersects(getCache(it).gbox, b)) return false;
	const { pts, closed } = polyline(it);
	const inBox = (p: number[]) => p[0] >= b.x0 && p[0] <= b.x1 && p[1] >= b.y0 && p[1] <= b.y1;
	if (pts.some(inBox)) return true;
	const edges = [[b.x0, b.y0, b.x1, b.y0], [b.x1, b.y0, b.x1, b.y1], [b.x1, b.y1, b.x0, b.y1], [b.x0, b.y1, b.x0, b.y0]];
	const n = pts.length;
	for (let i = 0; i < (closed ? n : n - 1); i++) {
		const p = pts[i], q = pts[(i + 1) % n];
		for (const e of edges) if (segsCross(p[0], p[1], q[0], q[1], e[0], e[1], e[2], e[3])) return true;
	}
	return false;
}

/** Outline rings of an item's fill (world units) and its fill rule, for the WebGL fill layer. */
export function fillRings(it: Item): { rings: ArrayLike<number>[][]; evenodd: boolean } | null {
	if (!it.fill || it.type === 'line' || it.type === 'arrow') return null;
	if (it.type === 'stroke') return { rings: [it.points], evenodd: false };
	if (it.type === 'polygon') return { rings: [it.points, ...(it.holes ?? [])], evenodd: true };
	if (it.type === 'ellipse') {
		const cx = (it.x1 + it.x2) / 2, cy = (it.y1 + it.y2) / 2;
		const rx = Math.abs(it.x2 - it.x1) / 2, ry = Math.abs(it.y2 - it.y1) / 2;
		const pts: number[][] = [];
		for (let i = 0; i < 128; i++) { const a = (i / 128) * Math.PI * 2; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
		return { rings: [pts], evenodd: true };
	}
	return { rings: [polyline(it).pts], evenodd: true };
}

/** Pattern period in world units for a fill density (percent; 0.5.0 stored 1..10). */
export function patternTile(density: number): number {
	const d = density <= 10 ? density * 10 : density;
	return Math.round(800 / Math.max(10, Math.min(100, d)));
}
