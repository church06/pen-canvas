import { tr } from './i18n';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Pointer drag on an element, reporting the position as fractions (0-1) of its box. Uses pointer capture and
 * needs `touch-action: none` on the element, so it works the same for mouse, touch and pen (native range inputs
 * do not move with the S Pen inside Obsidian mobile).
 */
export function dragArea(area: HTMLElement, onMove: (fx: number, fy: number) => void, onEnd?: () => void): void {
	let id: number | null = null;
	const at = (e: PointerEvent) => {
		const b = area.getBoundingClientRect();
		onMove(clamp01((e.clientX - b.left) / b.width), clamp01((e.clientY - b.top) / b.height));
	};
	area.addEventListener('pointerdown', (e) => {
		if (area.hasClass('is-disabled')) return;
		id = e.pointerId;
		try { area.setPointerCapture(id); } catch { /* synthetic events */ }
		e.preventDefault();
		e.stopPropagation();
		at(e);
	});
	area.addEventListener('pointermove', (e) => { if (e.pointerId === id) at(e); });
	const end = (e: PointerEvent) => {
		if (e.pointerId !== id) return;
		id = null;
		onEnd?.();
	};
	area.addEventListener('pointerup', end);
	area.addEventListener('pointercancel', end);
}

export function hexToRgb(hex: string): [number, number, number] | null {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) return null;
	const n = parseInt(m[1], 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
	return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

/** h 0-360, s and v 0-1. */
export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
	r /= 255; g /= 255; b /= 255;
	const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
	let h = 0;
	if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	return [((h * 60) + 360) % 360, max ? d / max : 0, max];
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
	const f = (n: number) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
	return [f(5) * 255, f(3) * 255, f(1) * 255];
}

export interface PickerOptions {
	value: string;
	/** Called on every change while picking. */
	onInput: (hex: string) => void;
	/** Called once with the final colour (Done, or a tap outside). Cancel calls onInput with the start value instead. */
	onDone: (hex: string) => void;
}

/** Photoshop-style colour picker: saturation/brightness square, hue bar, and HEX / RGB / HSV fields. */
export class ColorPicker {
	readonly el: HTMLElement;
	private h = 0;
	private s = 0;
	private v = 0;
	private start = '#000000';
	private opts: PickerOptions | null = null;
	private sv: HTMLElement;
	private svThumb: HTMLElement;
	private hue: HTMLElement;
	private hueThumb: HTMLElement;
	private oldSw: HTMLElement;
	private newSw: HTMLElement;
	private hexIn: HTMLInputElement;
	private rgbIn: HTMLInputElement[] = [];
	private hsvIn: HTMLInputElement[] = [];

	constructor(parent: HTMLElement) {
		const el = parent.createDiv({ cls: 'pc-picker is-hidden' });
		this.el = el;
		this.sv = el.createDiv({ cls: 'pc-picker-sv' });
		this.svThumb = this.sv.createDiv({ cls: 'pc-picker-thumb' });
		this.hue = el.createDiv({ cls: 'pc-picker-hue' });
		this.hueThumb = this.hue.createDiv({ cls: 'pc-picker-hue-thumb' });
		dragArea(this.sv, (fx, fy) => { this.s = fx; this.v = 1 - fy; this.update(); });
		dragArea(this.hue, (fx) => { this.h = Math.min(359.9, fx * 360); this.update(); });

		const row = el.createDiv({ cls: 'pc-picker-row' });
		const pv = row.createDiv({ cls: 'pc-picker-preview' });
		this.oldSw = pv.createDiv({ cls: 'pc-picker-old', attr: { 'aria-label': tr('原来的颜色', 'Previous color') } });
		this.newSw = pv.createDiv({ cls: 'pc-picker-new' });
		this.oldSw.addEventListener('click', () => this.set(this.start));
		const hexWrap = row.createEl('label', { cls: 'pc-picker-field pc-picker-hex' });
		hexWrap.createSpan({ text: 'HEX' });
		this.hexIn = hexWrap.createEl('input', { attr: { type: 'text', maxlength: '7', spellcheck: 'false', autocomplete: 'off' } });
		this.hexIn.addEventListener('input', () => {
			const rgb = hexToRgb(this.hexIn.value);
			if (rgb) this.fromRgb(rgb, this.hexIn);
		});
		this.hexIn.addEventListener('change', () => this.update());

		const num = (cls: string, names: string[], max: number[], inputs: HTMLInputElement[], read: () => void) => {
			const r = el.createDiv({ cls: `pc-picker-row ${cls}` });
			names.forEach((n, i) => {
				const f = r.createEl('label', { cls: 'pc-picker-field' });
				f.createSpan({ text: n });
				const inp = f.createEl('input', { attr: { type: 'number', min: '0', max: String(max[i]), step: '1', inputmode: 'numeric' } });
				inp.addEventListener('input', () => { if (inp.value !== '' && !Number.isNaN(Number(inp.value))) read(); });
				inp.addEventListener('change', () => this.update());
				inputs.push(inp);
			});
		};
		const val = (inp: HTMLInputElement, max: number) => Math.max(0, Math.min(max, Number(inp.value) || 0));
		num('pc-picker-rgb', ['R', 'G', 'B'], [255, 255, 255], this.rgbIn, () => {
			const src = this.rgbIn.find((x) => x === activeDocument.activeElement);
			this.fromRgb([val(this.rgbIn[0], 255), val(this.rgbIn[1], 255), val(this.rgbIn[2], 255)], src);
		});
		num('pc-picker-hsv', ['H', 'S', 'B'], [360, 100, 100], this.hsvIn, () => {
			this.h = Math.min(359.9, val(this.hsvIn[0], 360));
			this.s = val(this.hsvIn[1], 100) / 100;
			this.v = val(this.hsvIn[2], 100) / 100;
			this.update(this.hsvIn.find((x) => x === activeDocument.activeElement));
		});

		const acts = el.createDiv({ cls: 'pc-picker-acts' });
		const cancel = acts.createEl('button', { text: tr('取消', 'Cancel') });
		const done = acts.createEl('button', { cls: 'mod-cta', text: tr('完成', 'Done') });
		cancel.addEventListener('click', () => { this.opts?.onInput(this.start); this.close(false); });
		done.addEventListener('click', () => this.close(true));
	}

	isOpen(): boolean { return !this.el.hasClass('is-hidden'); }

	open(opts: PickerOptions): void {
		this.opts = opts;
		this.start = hexToRgb(opts.value) ? opts.value.toLowerCase() : '#000000';
		this.oldSw.style.setProperty('--pc-c', this.start);
		this.el.removeClass('is-hidden');
		this.set(this.start, false);
	}

	/** Done (commit) or close without a final callback. */
	close(commit: boolean): void {
		if (!this.isOpen()) return;
		this.el.addClass('is-hidden');
		const o = this.opts;
		this.opts = null;
		if (commit && o) o.onDone(this.hex());
	}

	hex(): string { const [r, g, b] = hsvToRgb(this.h, this.s, this.v); return rgbToHex(r, g, b); }

	private set(hex: string, notify = true): void {
		const rgb = hexToRgb(hex);
		if (!rgb) return;
		[this.h, this.s, this.v] = rgbToHsv(...rgb);
		this.update(undefined, notify);
	}

	private fromRgb(rgb: [number, number, number], src?: HTMLInputElement): void {
		const [h, s, v] = rgbToHsv(...rgb);
		if (s > 0 && v > 0) this.h = h; // keep the hue on greys
		this.s = s;
		this.v = v;
		this.update(src);
	}

	/** Redraw and fill every field except the one being typed in. */
	private update(src?: HTMLInputElement, notify = true): void {
		const hex = this.hex(), rgb = hsvToRgb(this.h, this.s, this.v);
		this.sv.style.setProperty('--pc-hue', String(Math.round(this.h)));
		this.svThumb.style.left = `${this.s * 100}%`;
		this.svThumb.style.top = `${(1 - this.v) * 100}%`;
		this.svThumb.style.setProperty('--pc-c', hex);
		this.hueThumb.style.left = `${(this.h / 360) * 100}%`;
		this.newSw.style.setProperty('--pc-c', hex);
		if (src !== this.hexIn) this.hexIn.value = hex.toUpperCase();
		this.rgbIn.forEach((inp, i) => { if (inp !== src) inp.value = String(Math.round(rgb[i])); });
		const hsv = [Math.round(this.h), Math.round(this.s * 100), Math.round(this.v * 100)];
		this.hsvIn.forEach((inp, i) => { if (inp !== src) inp.value = String(hsv[i]); });
		if (notify) this.opts?.onInput(hex);
	}
}
