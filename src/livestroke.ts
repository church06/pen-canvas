// Incremental port of perfect-freehand 1.2.3 getStroke (getStrokePoints + getStrokeOutlinePoints) for the
// options this plugin uses (no tapers, round caps, default easing). Both stages are forward-running filters,
// so the outline of everything but the last few points never changes. LiveOutline freezes that prefix
// (state checkpoint + outline points) and recomputes only the tail on each move, which keeps the cost per
// pointer move constant however long the stroke gets. compute() returns exactly what getStroke would.
import type { Pt } from './types';

type V = [number, number];
interface SP { point: V; pressure: number; vector: V; distance: number; runningLength: number }
interface AState { prev: SP; rl: number; reached: boolean }
interface BState { j: number; prevPressure: number; prevVector: V; prevL: V; prevR: V; sharpPrev: boolean; radius: number }
export interface LiveOpts { size: number; thinning: number; smoothing: number; streamline: number; sim: boolean }

const FIXED_PI = Math.PI + 0.0001, RATE = 0.275, START_SEG = 13, END_SEG = 29, CORNER_SEG = 13, END_NOISE = 3;
const MIN_RADIUS = 0.01, DEFAULT_FIRST_PRESSURE = 0.25, DEFAULT_PRESSURE = 0.5;

const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const mul = (a: V, n: number): V => [a[0] * n, a[1] * n];
const per = (a: V): V => [a[1], -a[0]];
const neg = (a: V): V => [-a[0], -a[1]];
const dpr = (a: V, b: V): number => a[0] * b[0] + a[1] * b[1];
const uni = (a: V): V => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
const dist = (a: V, b: V): number => Math.hypot(a[1] - b[1], a[0] - b[0]);
const dist2 = (a: V, b: V): number => { const dx = a[0] - b[0], dy = a[1] - b[1]; return dx * dx + dy * dy; };
const lrp = (a: V, b: V, t: number): V => add(a, mul(sub(b, a), t));
const prj = (a: V, b: V, c: number): V => add(a, mul(b, c));
function rot(a: V, c: V, r: number): V {
	const s = Math.sin(r), co = Math.cos(r), px = a[0] - c[0], py = a[1] - c[1];
	return [px * co - py * s + c[0], px * s + py * co + c[1]];
}
const validP = (p: number | undefined): p is number => p != null && p >= 0;
function simP(prev: number, distance: number, size: number): number {
	const sp = Math.min(1, distance / size), rp = Math.min(1, 1 - sp);
	return Math.min(1, prev + (rp - prev) * (sp * RATE));
}

export function startCap(first: V, right0: V): V[] {
	const cap: V[] = [], step = 1 / START_SEG;
	for (let t = step; t <= 1; t += step) cap.push(rot(right0, first, FIXED_PI * t));
	return cap;
}

export class LiveOutline {
	/** Frozen outline points (left and right side), never change once added. */
	readonly L: V[] = [];
	readonly R: V[] = [];
	/** Raw input points consumed into the frozen prefix. */
	rawFrozen = 0;
	private sp: SP[] = [];
	private a: AState | null = null;
	private b: BState | null = null;
	private initP = 0;
	private t: number;
	private minD: number;

	constructor(private o: LiveOpts) {
		this.t = 0.15 + (1 - o.streamline) * 0.85;
		this.minD = Math.pow(o.size * o.smoothing, 2);
	}

	private stepA(out: SP[], st: AState, p: Pt, isLast: boolean): void {
		const point: V = isLast ? [p[0], p[1]] : lrp(st.prev.point, p as unknown as V, this.t);
		if (st.prev.point[0] === point[0] && st.prev.point[1] === point[1]) return;
		const distance = dist(point, st.prev.point);
		st.rl += distance;
		if (!isLast && !st.reached) {
			if (st.rl < this.o.size) return;
			st.reached = true;
		}
		const d = sub(st.prev.point, point);
		st.prev = { point, pressure: validP(p[2]) ? p[2] : DEFAULT_PRESSURE, vector: uni(d), distance, runningLength: st.rl };
		out.push(st.prev);
	}

	/** One iteration of getStrokeOutlinePoints' main loop. */
	private stepB(get: (j: number) => SP, n: number, total: number, st: BState, L: V[], R: V[]): void {
		const j = st.j++;
		const o = this.o;
		const { point, vector, distance, runningLength } = get(j);
		let { pressure } = get(j);
		const isLast = j === n - 1;
		if (!isLast && total - runningLength < END_NOISE) return;
		let radius: number;
		if (o.thinning) {
			if (o.sim) pressure = simP(st.prevPressure, distance, o.size);
			radius = o.size * (0.5 - o.thinning * (0.5 - pressure));
		} else radius = o.size / 2;
		radius = Math.max(MIN_RADIUS, radius * 1);
		st.radius = radius;
		const nextVector = (!isLast ? get(j + 1) : get(j)).vector;
		const nextDpr = !isLast ? dpr(vector, nextVector) : 1.0;
		const prevDpr = dpr(vector, st.prevVector);
		const isSharp = prevDpr < 0 && !st.sharpPrev;
		const isNextSharp = nextDpr !== null && nextDpr < 0;
		if (isSharp || isNextSharp) {
			const off = mul(per(st.prevVector), radius);
			const step = 1 / CORNER_SEG;
			let tl: V = st.prevL, tr: V = st.prevR;
			for (let t = 0; t <= 1; t += step) {
				tl = rot(sub(point, off), point, FIXED_PI * t);
				L.push(tl);
				tr = rot(add(point, off), point, FIXED_PI * -t);
				R.push(tr);
			}
			st.prevL = tl; st.prevR = tr;
			if (isNextSharp) st.sharpPrev = true;
			return;
		}
		st.sharpPrev = false;
		if (isLast) {
			const off = mul(per(vector), radius);
			L.push(sub(point, off));
			R.push(add(point, off));
			return;
		}
		const off = mul(per(lrp(nextVector, vector, nextDpr)), radius);
		const tl = sub(point, off);
		if (j <= 1 || dist2(st.prevL, tl) > this.minD) { L.push(tl); st.prevL = tl; }
		const tr = add(point, off);
		if (j <= 1 || dist2(st.prevR, tr) > this.minD) { R.push(tr); st.prevR = tr; }
		st.prevPressure = pressure;
		st.prevVector = vector;
	}

	private initialPressure(): number {
		const o = this.o;
		return this.sp.slice(0, 10).reduce((acc, cur) => {
			const p = o.sim ? simP(acc, cur.distance, o.size) : cur.pressure;
			return (acc + p) / 2;
		}, this.sp[0].pressure);
	}

	/**
	 * Freeze raw points [rawFrozen, upto). Only call with at least a few dozen raw points left unfrozen
	 * after upto. Returns true when new outline points were frozen.
	 */
	advance(raw: Pt[], upto: number): boolean {
		if (upto <= this.rawFrozen || upto >= raw.length) return false;
		if (!this.a) {
			if (raw.length < 3) return false;
			const p0 = raw[0];
			this.sp.push({ point: [p0[0], p0[1]], pressure: validP(p0[2]) ? p0[2] : DEFAULT_FIRST_PRESSURE, vector: [1, 1], distance: 0, runningLength: 0 });
			this.a = { prev: this.sp[0], rl: 0, reached: false };
			this.rawFrozen = 1;
		}
		for (let i = this.rawFrozen; i < upto; i++) this.stepA(this.sp, this.a, raw[i], false);
		this.rawFrozen = upto;
		const sp = this.sp, n = sp.length;
		if (n < 12) return false;
		if (!this.b) {
			sp[0].vector = sp[1].vector;
			this.initP = this.initialPressure();
			this.b = { j: 0, prevPressure: this.initP, prevVector: sp[0].vector, prevL: sp[0].point, prevR: sp[0].point, sharpPrev: false, radius: 0 };
		}
		// A point's END_NOISE skip depends on the final total length, which is at least the frozen total.
		const safe = sp[n - 1].runningLength - END_NOISE - 1;
		const before = this.L.length + this.R.length;
		const get = (j: number) => sp[j];
		while (this.b.j < n - 2 && sp[this.b.j].runningLength < safe) this.stepB(get, Infinity, Infinity, this.b, this.L, this.R);
		return this.L.length + this.R.length > before;
	}

	get first(): V { return this.sp[0].point; }

	/** True once advance() has frozen outline points; tail() is only valid then. */
	get ready(): boolean { return !!this.b && this.R.length > 0 && this.L.length > 0; }

	/** Outline of the not-yet-frozen part: left points, end cap, right points (all in forward order). */
	tail(raw: Pt[], pred: Pt[]): { L: V[]; R: V[]; cap: V[] } {
		const a0 = this.a as AState, b0 = this.b as BState;
		const st: AState = { prev: a0.prev, rl: a0.rl, reached: a0.reached };
		const T: SP[] = [];
		const total = raw.length + pred.length;
		for (let i = this.rawFrozen; i < total; i++) {
			const p = i < raw.length ? raw[i] : pred[i - raw.length];
			this.stepA(T, st, p, i === total - 1);
		}
		const sp = this.sp, n0 = sp.length, n = n0 + T.length;
		const get = (j: number) => (j < n0 ? sp[j] : T[j - n0]);
		const tl = get(n - 1).runningLength;
		const bs: BState = { ...b0 };
		const L: V[] = [], R: V[] = [];
		while (bs.j < n) this.stepB(get, n, tl, bs, L, R);
		const last = get(n - 1);
		const lastPoint: V = [last.point[0], last.point[1]];
		const dir = per(neg(last.vector));
		const cap: V[] = [], step = 1 / END_SEG, start = prj(lastPoint, dir, bs.radius);
		for (let t = step; t < 1; t += step) cap.push(rot(start, lastPoint, FIXED_PI * 3 * t));
		return { L, R, cap };
	}

	/** Full outline, identical to getStroke(raw ++ pred, { ..., last: true }). For tests. */
	full(raw: Pt[], pred: Pt[] = []): V[] {
		const t = this.tail(raw, pred);
		const L = this.L.concat(t.L), R = this.R.concat(t.R);
		const sc = startCap(this.sp[0].point, R[0]);
		return L.concat(t.cap, R.reverse(), sc);
	}
}

/**
 * Smooth closed path through outline points, same curve construction as strokeOutlinePath. That one starts
 * at vertex 0, which sits slightly outside the smoothed curve; pieces of a stroke start at the midpoint of
 * the closing chord instead (fromVertex false) so no vertex pokes out at the joints.
 */
export function smoothPath(pts: V[], fromVertex = true): Path2D {
	const p = new Path2D();
	const n = pts.length;
	if (n < 2) return p;
	if (fromVertex) p.moveTo(pts[0][0], pts[0][1]);
	else p.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
	for (let i = 0; i < n; i++) {
		const a = pts[i], b = pts[(i + 1) % n];
		p.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
	}
	p.closePath();
	return p;
}
