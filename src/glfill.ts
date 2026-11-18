import { BBox, fillRings, intersects, itemGeomBBox, patternTile } from './geometry';
import { FillStyle, Item } from './types';

/*
 * WebGL2 layer that draws every fill (solid and patterned) under the 2D line layer.
 * Shapes go through "stencil, then cover": the outline triangles mark the stencil (even-odd or
 * non-zero), then a bounding quad is shaded where the stencil is set. Patterns are computed per
 * pixel in the fragment shader, so they cost the same at any zoom and never blur; when a pattern
 * gets finer than a pixel it fades to its average coverage instead of shimmering.
 */

const VS = `#version 300 es
in vec2 a_pos;
uniform vec2 u_scale;
uniform vec2 u_off;
uniform vec2 u_shift;
out vec2 v_world;
void main() {
	v_world = a_pos;
	gl_Position = vec4((a_pos + u_shift) * u_scale + u_off, 0.0, 1.0);
}`;

const FS = `#version 300 es
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

const STYLE: Record<FillStyle, number> = { solid: 0, hatch: 1, cross: 2, dots: 3, stipple: 4 };

interface Geo { tri: Float32Array; quad: Float32Array; evenodd: boolean; }
const geoCache = new WeakMap<Item, Geo>();

function geometry(it: Item): Geo | null {
	const hit = geoCache.get(it);
	if (hit) return hit;
	const fr = fillRings(it);
	if (!fr) return null;
	const tri: number[] = [];
	for (const ring of fr.rings) {
		if (ring.length < 3) continue;
		const x0 = ring[0][0], y0 = ring[0][1];
		for (let i = 1; i < ring.length - 1; i++) tri.push(x0, y0, ring[i][0], ring[i][1], ring[i + 1][0], ring[i + 1][1]);
	}
	const b = itemGeomBBox(it);
	const x0 = b.x0 - 1, y0 = b.y0 - 1, x1 = b.x1 + 1, y1 = b.y1 + 1;
	const g = { tri: Float32Array.from(tri), quad: Float32Array.of(x0, y0, x1, y0, x1, y1, x0, y0, x1, y1, x0, y1), evenodd: fr.evenodd };
	geoCache.set(it, g);
	return g;
}

const colorCache = new Map<string, [number, number, number, number]>();
let colorCtx: CanvasRenderingContext2D | null = null;
function parseColor(c: string): [number, number, number, number] {
	const hit = colorCache.get(c);
	if (hit) return hit;
	if (!colorCtx) {
		const cv = createEl('canvas');
		cv.width = cv.height = 1;
		colorCtx = cv.getContext('2d', { willReadFrequently: true });
	}
	const ctx = colorCtx;
	if (!ctx) return [0, 0, 0, 1];
	ctx.clearRect(0, 0, 1, 1);
	ctx.fillStyle = '#000';
	ctx.fillStyle = c;
	ctx.fillRect(0, 0, 1, 1);
	const d = ctx.getImageData(0, 0, 1, 1).data;
	const v: [number, number, number, number] = [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255]; // straight (not premultiplied) alpha
	if (colorCache.size > 256) colorCache.clear();
	colorCache.set(c, v);
	return v;
}

export class GLFillLayer {
	private gl: WebGL2RenderingContext;
	private prog: WebGLProgram;
	private buf: WebGLBuffer;
	private loc: Record<string, WebGLUniformLocation | null> = {};
	private aPos: number;
	// Uploaded vertex data: all fills of the document, rebuilt only when the item list changes.
	private uploaded: Item[] = [];
	private offsets = new Map<Item, { tri: number; triN: number; quad: number }>();
	lost = false;

	static create(cv: HTMLCanvasElement): GLFillLayer | null {
		try {
			const gl = cv.getContext('webgl2', { stencil: true, antialias: true, premultipliedAlpha: true, alpha: true, depth: false });
			if (!gl) return null;
			return new GLFillLayer(gl);
		} catch (e) {
			console.warn('[pen-canvas] WebGL fill layer unavailable', e);
			return null;
		}
	}

	private constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		const sh = (type: number, src: string) => {
			const s = gl.createShader(type) as WebGLShader;
			gl.shaderSource(s, src);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
			return s;
		};
		const p = gl.createProgram();
		gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
		gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
		gl.linkProgram(p);
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? 'link');
		this.prog = p;
		for (const n of ['u_scale', 'u_off', 'u_shift', 'u_color', 'u_style', 'u_tile', 'u_px']) this.loc[n] = gl.getUniformLocation(p, n);
		this.aPos = gl.getAttribLocation(p, 'a_pos');
		this.buf = gl.createBuffer();
		gl.canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); this.lost = true; });
	}

	private upload(items: Item[]): void {
		const same = items.length === this.uploaded.length && items.every((it, i) => it === this.uploaded[i]);
		if (same) return;
		const gl = this.gl;
		const parts: Float32Array[] = [];
		let n = 0; // floats
		this.offsets.clear();
		for (const it of items) {
			const g = geometry(it);
			if (!g) continue;
			this.offsets.set(it, { tri: n / 2, triN: g.tri.length / 2, quad: (n + g.tri.length) / 2 });
			parts.push(g.tri, g.quad);
			n += g.tri.length + g.quad.length;
		}
		const all = new Float32Array(n);
		let at = 0;
		for (const p of parts) { all.set(p, at); at += p.length; }
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
		gl.bufferData(gl.ARRAY_BUFFER, all, gl.DYNAMIC_DRAW);
		this.uploaded = items.slice();
	}

	/**
	 * Draw all fills. k = device pixels per world unit, (tx, ty) = device-pixel translation,
	 * vb = visible world box, shift(it) = extra world offset for items being dragged.
	 */
	render(items: Item[], k: number, tx: number, ty: number, vb: BBox, shift: ((it: Item) => [number, number] | null) | null): void {
		if (this.lost) return;
		const gl = this.gl;
		const W = gl.canvas.width, H = gl.canvas.height;
		gl.viewport(0, 0, W, H);
		gl.clearColor(0, 0, 0, 0);
		gl.clearStencil(0);
		gl.stencilMask(0xff);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		const fills = items.filter((it) => it.fill && it.type !== 'line' && it.type !== 'arrow');
		if (!fills.length) return;
		this.upload(fills);
		gl.useProgram(this.prog);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
		gl.enableVertexAttribArray(this.aPos);
		gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
		gl.uniform2f(this.loc.u_scale, (2 * k) / W, (-2 * k) / H);
		gl.uniform2f(this.loc.u_off, (2 * tx) / W - 1, 1 - (2 * ty) / H);
		gl.uniform1f(this.loc.u_px, 1 / k);
		gl.enable(gl.STENCIL_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.CULL_FACE);
		for (const it of fills) {
			const off = this.offsets.get(it);
			if (!off || !off.triN) continue;
			const sh = shift?.(it) ?? null;
			const b = itemGeomBBox(it);
			const bb = sh ? { x0: b.x0 + sh[0], y0: b.y0 + sh[1], x1: b.x1 + sh[0], y1: b.y1 + sh[1] } : b;
			if (!intersects(bb, vb)) continue;
			gl.uniform2f(this.loc.u_shift, sh ? sh[0] : 0, sh ? sh[1] : 0);
			const evenodd = (geoCache.get(it) as Geo).evenodd;
			// 1) mark the inside in the stencil buffer
			gl.colorMask(false, false, false, false);
			gl.stencilFunc(gl.ALWAYS, 0, 0xff);
			if (evenodd) {
				gl.stencilMask(0x01);
				gl.stencilOp(gl.KEEP, gl.KEEP, gl.INVERT);
			} else {
				gl.stencilMask(0xff);
				gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP);
				gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);
			}
			gl.drawArrays(gl.TRIANGLES, off.tri, off.triN);
			// 2) shade the bounding quad where marked, clearing the stencil as it goes
			gl.colorMask(true, true, true, true);
			gl.stencilMask(0xff);
			gl.stencilFunc(gl.NOTEQUAL, 0, 0xff);
			gl.stencilOp(gl.ZERO, gl.ZERO, gl.ZERO);
			const [r, g, bl, a] = parseColor(it.fill as string);
			gl.uniform4f(this.loc.u_color, r, g, bl, a);
			const style = it.fillStyle ?? 'solid';
			gl.uniform1i(this.loc.u_style, STYLE[style] ?? 0);
			gl.uniform1f(this.loc.u_tile, patternTile(it.fillDensity ?? 50));
			gl.drawArrays(gl.TRIANGLES, off.quad, 6);
		}
		gl.disable(gl.STENCIL_TEST);
	}

	clear(): void {
		if (this.lost) return;
		const gl = this.gl;
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	dispose(): void {
		this.gl.getExtension('WEBGL_lose_context')?.loseContext();
	}
}
