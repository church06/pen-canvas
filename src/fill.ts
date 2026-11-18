import { BBox, drawLine, intersects, itemBBox, round, strokeGap } from './geometry';
import { Item } from './types';

type P2 = [number, number];
export type BucketResult = { kind: 'region'; rings: P2[][]; area: number } | { kind: 'open' } | { kind: 'wall' };

const MAX_CELLS = 4_000_000;

/**
 * Paint-bucket: rasterise the visible lines, flood-fill from the tapped point and trace the
 * region back to polygons (world coordinates). Works for regions closed by several strokes.
 * The region must be closed within the visible area, otherwise 'open'.
 */
export function bucketRegion(items: Item[], vb: BBox, scale: number, wx: number, wy: number, gapPx = 5): BucketResult {
	let k = scale; // cells per world unit (1 cell per screen pixel)
	let W = Math.ceil((vb.x1 - vb.x0) * k), H = Math.ceil((vb.y1 - vb.y0) * k);
	if (W * H > MAX_CELLS) { const f = Math.sqrt(MAX_CELLS / (W * H)); k *= f; W = Math.ceil(W * f); H = Math.ceil(H * f); }
	const cv = document.createElement('canvas');
	cv.width = W; cv.height = H;
	const ctx = cv.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
	ctx.setTransform(k, 0, 0, k, -vb.x0 * k, -vb.y0 * k);
	for (const it of items) {
		if (!intersects(itemBBox(it), vb)) continue;
		drawLine(ctx, it);
		// Join the ends of nearly closed freehand strokes with an invisible line.
		const g = strokeGap(it);
		if (g) {
			ctx.strokeStyle = '#000';
			ctx.lineWidth = Math.max(it.size, 1.5 / k);
			ctx.lineCap = 'round';
			ctx.beginPath(); ctx.moveTo(g[0][0], g[0][1]); ctx.lineTo(g[1][0], g[1][1]); ctx.stroke();
		}
	}
	const data = ctx.getImageData(0, 0, W, H).data;

	const wall = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) if (data[i * 4 + 3] > 8) wall[i] = 1;
	// Close small gaps between lines: grow walls by (1 + gap/2) cells, so a gap of about gapPx
	// screen pixels is sealed for the flood. The region is grown back afterwards.
	const close = 1 + Math.round((gapPx / 2) * (k / scale));
	const wall2 = dilate(wall, W, H, close, null);

	const sx = Math.floor((wx - vb.x0) * k), sy = Math.floor((wy - vb.y0) * k);
	if (sx < 0 || sy < 0 || sx >= W || sy >= H) return { kind: 'open' };
	if (wall2[sy * W + sx]) return { kind: 'wall' };

	const reg = new Uint8Array(W * H);
	const stack = new Int32Array(W * H);
	let sp = 0;
	stack[sp++] = sy * W + sx; reg[sy * W + sx] = 1;
	while (sp) {
		const i = stack[--sp];
		const x = i % W, y = (i - x) / W;
		if (x === 0 || y === 0 || x === W - 1 || y === H - 1) return { kind: 'open' };
		for (const j of [i - 1, i + 1, i - W, i + W]) if (!reg[j] && !wall2[j]) { reg[j] = 1; stack[sp++] = j; }
	}

	// Grow back over the space the wall growth took (but not across lines), then a little
	// further under the lines so no gap shows between fill and line.
	let cur = dilate(reg, W, H, close, wall);
	let filled = 0;
	for (let i = 0; i < W * H; i++) filled += cur[i];
	cur = dilate(cur, W, H, Math.max(2, Math.round(2 * k / scale)), null);

	const rings = traceRings(cur, W, H).map((ring) =>
		simplifyClosed(ring, 0.8).map(([x, y]) => [round(vb.x0 + (x + 0.5) / k, 2), round(vb.y0 + (y + 0.5) / k, 2)] as P2),
	).filter((r) => r.length >= 3);
	return { kind: 'region', rings, area: filled / (k * k) };
}

// Marching squares over cell samples. Corner bits: tl=8, tr=4, br=2, bl=1. Edges: T R B L.
const CASES: string[][] = [
	[], ['LB'], ['BR'], ['LR'], ['TR'], ['TR', 'LB'], ['TB'], ['TL'],
	['TL'], ['TB'], ['TL', 'BR'], ['TR'], ['LR'], ['BR'], ['LB'], [],
];

function traceRings(m: Uint8Array, W: number, H: number): P2[][] {
	const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < W && y < H ? m[y * W + x] : 0);
	const key = (x2: number, y2: number) => (y2 + 2) * (2 * W + 8) + (x2 + 2);
	const adj = new Map<number, number[]>();
	const pos = new Map<number, P2>();
	const link = (a: number, b: number) => {
		(adj.get(a) ?? adj.set(a, []).get(a) as number[]).push(b);
		(adj.get(b) ?? adj.set(b, []).get(b) as number[]).push(a);
	};
	for (let y = -1; y < H; y++) for (let x = -1; x < W; x++) {
		const c = (at(x, y) << 3) | (at(x + 1, y) << 2) | (at(x + 1, y + 1) << 1) | at(x, y + 1);
		for (const seg of CASES[c]) {
			const pts = seg.split('').map((e) => {
				const p: P2 = e === 'T' ? [x + 0.5, y] : e === 'R' ? [x + 1, y + 0.5] : e === 'B' ? [x + 0.5, y + 1] : [x, y + 0.5];
				const kk = key(Math.round(p[0] * 2), Math.round(p[1] * 2));
				pos.set(kk, p);
				return kk;
			});
			link(pts[0], pts[1]);
		}
	}
	const used = new Set<number>();
	const rings: P2[][] = [];
	for (const start of adj.keys()) {
		if (used.has(start)) continue;
		const ring: P2[] = [];
		let prev = -1, cur = start;
		while (!used.has(cur)) {
			used.add(cur);
			ring.push(pos.get(cur) as P2);
			const n = adj.get(cur) as number[];
			const next = n[0] !== prev ? n[0] : n[1];
			prev = cur; cur = next;
		}
		rings.push(ring);
	}
	return rings;
}

function rdp(pts: P2[], eps: number): P2[] {
	if (pts.length < 3) return pts.slice();
	const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
	const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
	let maxD = -1, idx = 0;
	for (let i = 1; i < pts.length - 1; i++) {
		const d = len ? Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len : Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
		if (d > maxD) { maxD = d; idx = i; }
	}
	if (maxD <= eps) return [pts[0], pts[pts.length - 1]];
	return rdp(pts.slice(0, idx + 1), eps).slice(0, -1).concat(rdp(pts.slice(idx), eps));
}

function simplifyClosed(ring: P2[], eps: number): P2[] {
	if (ring.length < 8) return ring;
	const half = Math.floor(ring.length / 2);
	const a = rdp(ring.slice(0, half + 1), eps), b = rdp(ring.slice(half).concat([ring[0]]), eps);
	return a.slice(0, -1).concat(b.slice(0, -1));
}

/** Grow a mask by n cells (4-neighbour steps); cells set in `block` are never entered. */
function dilate(src: Uint8Array, W: number, H: number, n: number, block: Uint8Array | null): Uint8Array {
	let cur = src;
	for (let step = 0; step < n; step++) {
		const nx = cur.slice();
		for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
			const i = y * W + x;
			if (cur[i] || (block && block[i])) continue;
			if (cur[i - 1] || cur[i + 1] || cur[i - W] || cur[i + W]) nx[i] = 1;
		}
		cur = nx;
	}
	return cur;
}
