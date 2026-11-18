import { bucketRegion } from './fill';
import { GLFillLayer } from './glfill';
import { Modal, Notice, Scope, TextFileView, WorkspaceLeaf, addIcon, setIcon } from 'obsidian';
import type PenCanvasPlugin from './main';
import { CanvasDoc, FILL_STYLES, FillStyle, Item, PALETTE, Pt, ShapeItem, ShapeKind, StrokeItem } from './types';
import {
	BBox, closedOutline, detachFill, drawFill, hitFill, drawItem, drawLine, drawShape, emptyDoc, hitItem, isFillOnly, pointInPoly, polygonArea, intersects, itemBBox, itemGeomBBox, itemTouchesBox, parseDoc, round, serialize,
	strokeOutlinePath, translateItem, uid,
} from './geometry';

export const VIEW_TYPE = 'pen-canvas-view';

// Lucide "hand" mirrored so the thumb is on the right: a left hand.
/** A full render slower than this (ms) switches pan/zoom/drag to bitmap previews. */
const SLOW_MS = 10;
let clipboard: Item[] = [];
let pasteCount = 0;

addIcon('pc-left-hand', '<g transform="translate(100,0) scale(-4.1667,4.1667)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
	'<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>' +
	'<path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>' +
	'<path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></g>');
export const EXT = 'pencanvas';
export const DARK_BG = '#1e1e1e';
const DARK_BG_CONST = DARK_BG;

type Tool = 'pen' | 'eraser' | 'select' | 'hand' | 'fill' | ShapeKind;

interface Gesture {
	pid: number;
	pointerType: string;
	kind: 'stroke' | 'shape' | 'erase' | 'box' | 'move' | 'pan';
	snapX?: number[]; snapY?: number[];
	sel0?: BBox;
	stroke?: StrokeItem;
	shape?: ShapeItem;
	sx: number; sy: number; // world start
	cx: number; cy: number; // world current
	lx: number; ly: number; // last client pos (pan)
	snapped?: boolean;
	t0: number; events: number; coalesced: number; pmin: number; pmax: number;
}

const BACKGROUNDS: [string, string][] = [
	['暗色', DARK_BG_CONST],
	['白色', '#ffffff'], ['米黄', '#fbf6e9'], ['浅灰', '#f1f3f5'], ['浅绿', '#eef6ee'], ['深灰', '#2b2b2b'], ['黑色', '#111111'],
];

type PEvt = PointerEvent & { getCoalescedEvents?: () => PointerEvent[]; getPredictedEvents?: () => PointerEvent[] };

export class PenCanvasView extends TextFileView {
	plugin: PenCanvasPlugin;
	doc: CanvasDoc = emptyDoc('#ffffff');
	broken: string | null = null;

	private stage!: HTMLDivElement;
	private base!: HTMLCanvasElement;
	private live!: HTMLCanvasElement;
	private bctx!: CanvasRenderingContext2D;
	private lctx!: CanvasRenderingContext2D;
	private msgEl!: HTMLDivElement;
	private toolBtns = new Map<Tool, HTMLElement>();
	private colorBtns: HTMLElement[] = [];
	private brushBtn!: HTMLElement;
	private bgBtn!: HTMLElement;
	private popovers = new Map<string, { el: HTMLElement; anchor: () => HTMLElement; refresh: () => void }>();
	private leftBtn!: HTMLElement;
	private toolbarEl!: HTMLElement;
	private ro?: ResizeObserver;

	private vx = 0; private vy = 0; private scale = 1;
	private dpr = 1; private w = 0; private h = 0;
	private rect: DOMRect | null = null;
	private needFit = true;
	private raf = 0;

	private tool: Tool = 'pen';
	private color = '#1e1e1e'; // base #rrggbb
	private opacity = 1;
	private fillStyle: FillStyle = 'solid';
	private fillDensity = 50; // percent
	private fillPanel: HTMLElement | null = null;
	private fillSwatches: HTMLElement[] = [];
	private densityRange!: HTMLInputElement;
	private densityLabel!: HTMLElement;
	private opRange!: HTMLInputElement;
	private opNum!: HTMLInputElement;
	private size = 3;

	private undoStack: Item[][] = [];
	private redoStack: Item[][] = [];
	private selected = new Set<string>();
	private moveDx = 0; private moveDy = 0;

	private g: Gesture | null = null;
	private touches = new Map<number, { x: number; y: number }>();
	private gl: GLFillLayer | null = null;
	private glCanvas: HTMLCanvasElement | null = null;
	private lastRenderMs = 0;
	private viewTimer = 0;
	private snap: { cv: HTMLCanvasElement; scale: number; vx: number; vy: number } | null = null;
	private moveLayers: { rest: HTMLCanvasElement; sel: HTMLCanvasElement; scale: number; vx: number; vy: number } | null = null;
	private pinch: { s0: number; vx0: number; vy0: number; cx0: number; cy0: number; d0: number } | null = null;

	private diag = { desyncRequested: false, desyncGranted: false as boolean | undefined, types: new Set<string>(), last: '', glFill: false };

	constructor(leaf: WorkspaceLeaf, plugin: PenCanvasPlugin) {
		super(leaf);
		this.plugin = plugin;
		// Default ink follows the theme: white on dark, black on light.
		this.color = document.body.classList.contains('theme-dark') ? '#ffffff' : '#1e1e1e';
		this.scope = new Scope(this.app.scope);
		this.scope.register(['Mod'], 'z', () => { this.undo(); return false; });
		this.scope.register(['Mod', 'Shift'], 'z', () => { this.redo(); return false; });
		this.scope.register(['Mod'], 'y', () => { this.redo(); return false; });
		this.scope.register(['Mod'], 'c', () => { if (!this.selected.size) return true; this.copySelected(); return false; });
		this.scope.register(['Mod'], 'x', () => { if (!this.selected.size) return true; this.copySelected(); this.deleteSelected(); return false; });
		this.scope.register(['Mod'], 'v', () => { if (!clipboard.length) return true; this.paste(); return false; });
		this.scope.register(['Mod'], 'd', () => { if (!this.selected.size) return true; this.copySelected(); this.paste(); return false; });
		this.scope.register([], 'Delete', () => { this.deleteSelected(); return false; });
		this.scope.register([], 'Backspace', () => { this.deleteSelected(); return false; });
	}

	getViewType(): string { return VIEW_TYPE; }
	getDisplayText(): string { return this.file?.basename ?? '手写画布'; }
	getIcon(): string { return 'pen-tool'; }
	canAcceptExtension(ext: string): boolean { return ext === EXT; }

	getViewData(): string {
		return this.broken !== null ? this.broken : serialize(this.doc);
	}

	setViewData(data: string, clear: boolean): void {
		try {
			this.doc = parseDoc(data) ?? emptyDoc(this.plugin.newBackground());
			this.broken = null;
		} catch (e) {
			// Never overwrite a file we cannot read.
			this.broken = data;
			this.doc = emptyDoc(this.plugin.newBackground());
			new Notice('手写画布：文件无法解析，已进入只读保护，不会写回。' + String(e));
		}
		if (clear) {
			this.undoStack = [];
			this.redoStack = [];
			this.selected.clear();
			this.needFit = true;
		}
		if (this.stage) {
			this.applyBackground();
			this.msgEl.toggleClass('is-hidden', this.broken === null);
			if (this.needFit && this.w) this.fit();
			this.scheduleRender();
		}
	}

	clear(): void {
		this.doc = emptyDoc(this.plugin.newBackground());
		this.broken = null;
		this.undoStack = [];
		this.redoStack = [];
		this.selected.clear();
		this.needFit = true;
	}

	async onOpen(): Promise<void> {
		const root = this.contentEl;
		root.empty();
		root.addClass('pc-root');
		this.stage = root.createDiv({ cls: 'pc-stage' });
		if (this.plugin.settings.glFill) {
			const gcv = this.stage.createEl('canvas', { cls: 'pc-gl' });
			this.gl = GLFillLayer.create(gcv);
			if (!this.gl) gcv.remove();
			else this.glCanvas = gcv;
		}
		this.diag.glFill = !!this.gl;
		this.base = this.stage.createEl('canvas', { cls: 'pc-base' });
		this.live = this.stage.createEl('canvas', { cls: 'pc-live' });
		this.buildToolbar(root);
		this.msgEl = this.stage.createDiv({ cls: 'pc-msg is-hidden', text: '文件内容无法解析为手写画布，已暂停编辑以保护原文件。' });
		this.bctx = this.base.getContext('2d') as CanvasRenderingContext2D;
		const want = this.plugin.settings.desynchronized;
		this.diag.desyncRequested = want;
		this.lctx = this.live.getContext('2d', { desynchronized: want }) as CanvasRenderingContext2D;
		const attrs = (this.lctx as CanvasRenderingContext2D & { getContextAttributes?: () => { desynchronized?: boolean } }).getContextAttributes?.();
		this.diag.desyncGranted = attrs?.desynchronized;

		const s = this.stage;
		s.addEventListener('pointerdown', this.onDown);
		s.addEventListener('pointermove', this.onMove);
		s.addEventListener('pointerup', this.onUp);
		s.addEventListener('pointercancel', this.onUp);
		s.addEventListener('wheel', this.onWheel, { passive: false });
		s.addEventListener('contextmenu', (e) => e.preventDefault());
		// Keep Obsidian mobile's swipe gestures (sidebars, pull-down) from reacting while drawing.
		const stopTouch = (e: TouchEvent) => { e.stopPropagation(); if (e.cancelable) e.preventDefault(); };
		s.addEventListener('touchstart', stopTouch, { passive: false });
		s.addEventListener('touchmove', stopTouch, { passive: false });

		this.ro = new ResizeObserver(() => this.resize());
		this.ro.observe(s);
		this.applyBackground();
		this.setTool('pen');
		this.refreshToolbar();
	}

	async onClose(): Promise<void> {
		this.ro?.disconnect();
		if (this.raf) cancelAnimationFrame(this.raf);
		this.gl?.dispose();
		this.gl = null;
	}

	// ---------- toolbar ----------

	private btn(parent: HTMLElement, icon: string, label: string, onClick: () => void): HTMLElement {
		const b = parent.createEl('button', { cls: 'pc-btn', attr: { 'aria-label': label } });
		setIcon(b, icon);
		b.addEventListener('click', onClick);
		return b;
	}

	// Hub: a round, draggable disc. Core = current tool; middle ring = 8 buttons; outer ring = two sliders
	// (left half size, right half opacity; bottom = min, top = max). Radii in CSS px.
	private static HUB = { R: 112, core: 30, btnR: 64, slideR: 97, slideSpan: 140 };
	private hubBtns: [HTMLElement, number][] = []; // element, angle (deg, screen coords: 0 = right, 90 = down)
	private hubSvg: SVGSVGElement | null = null;
	private hubLeft: boolean | null = null;
	private fanDir = 45;
	private coreIcon!: HTMLElement;
	private coreText!: HTMLElement;
	private static TOOLS: [Tool, string, string][] = [
		['pen', 'pencil', '笔'], ['eraser', 'eraser', '橡皮（整笔擦除）'], ['select', 'mouse-pointer-2', '框选 / 移动'],
		['fill', 'paint-bucket', '填充（点封闭区域）'], ['hand', 'move', '平移'], ['rect', 'square', '矩形'],
		['ellipse', 'circle', '椭圆'], ['line', 'minus', '直线'], ['arrow', 'move-up-right', '箭头'],
	];

	private buildToolbar(root: HTMLElement): void {
		const H = PenCanvasView.HUB;
		const hub = root.createDiv({ cls: 'pc-hub' });
		this.toolbarEl = hub;
		hub.style.width = hub.style.height = `${2 * H.R}px`;
		this.hubSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.hubSvg.classList.add('pc-hub-disk');
		hub.appendChild(this.hubSvg);

		const core = hub.createEl('button', { cls: 'pc-btn pc-hub-core', attr: { 'aria-label': '选择工具' } });
		this.coreIcon = core.createSpan({ cls: 'pc-core-icon' });
		this.coreText = core.createSpan({ cls: 'pc-core-text' });
		core.addEventListener('click', () => this.togglePopover('tools'));

		const put = (el: HTMLElement, deg: number) => { this.hubBtns.push([el, deg]); return el; };
		this.brushBtn = put(hub.createEl('button', { cls: 'pc-btn pc-brush', attr: { 'aria-label': '颜色 / 透明度' } }), -90);
		this.brushBtn.createSpan({ cls: 'pc-dot' });
		this.brushBtn.addEventListener('click', () => this.togglePopover('colors'));
		put(this.btn(hub, 'undo-2', '撤销', () => this.undo()), -135);
		put(this.btn(hub, 'redo-2', '重做', () => this.redo()), 180);
		// Settings / actions on the right half.
		put(this.btn(hub, 'copy', '复制所选 (Ctrl+C)', () => this.copySelected()), -45);
		put(this.btn(hub, 'clipboard-paste', '粘贴 (Ctrl+V)', () => this.paste()), 0);
		this.bgBtn = put(hub.createEl('button', { cls: 'pc-btn pc-text-btn', text: 'BG', attr: { 'aria-label': '画布背景颜色' } }), 45);
		this.bgBtn.addEventListener('click', () => this.togglePopover('bg'));
		put(this.btn(hub, 'scan', '显示全部', () => { this.fit(); this.scheduleRender(); }), 90);
		this.leftBtn = put(this.btn(hub, 'pc-left-hand', '左手模式（菜单换到右侧）', () => { void this.plugin.setLeftHand(!this.plugin.settings.leftHand); }), 135);

		// Pointer on the disc: the outer ring drives the sliders, anywhere else (not a button) drags the disc.
		let mode: 'size' | 'op' | 'drag' | null = null;
		let grab = [0, 0];
		const polar = (e: PointerEvent) => {
			const b = hub.getBoundingClientRect();
			const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
			return { r: Math.hypot(dx, dy) * ((2 * H.R) / b.width), deg: (Math.atan2(dy, dx) * 180) / Math.PI };
		};
		const slide = (e: PointerEvent) => {
			const { deg } = polar(e);
			const lo = 90 + (180 - H.slideSpan) / 2; // bottom end of the left arc
			let t: number;
			if (mode === 'size') t = (((deg + 360) % 360) - lo) / H.slideSpan;
			else t = (90 - (180 - H.slideSpan) / 2 - deg) / H.slideSpan;
			t = Math.max(0, Math.min(1, t));
			if (mode === 'size') this.setSize(Math.round(1 + t * 29), false);
			else this.setOpacity(Math.round(5 + t * 95), false);
		};
		const svg = this.hubSvg;
		svg.addEventListener('pointerdown', (e) => {
			const { r, deg } = polar(e);
			if (r > H.R + 2) return;
			try { svg.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
			e.preventDefault();
			const gap = (180 - H.slideSpan) / 2; // free angle at the top and bottom of the outer ring = drag grips
			if (r >= H.slideR - 14 && Math.abs(Math.abs(deg) - 90) > gap) { mode = Math.abs(deg) > 90 ? 'size' : 'op'; slide(e); return; }
			mode = 'drag';
			grab = [e.clientX - hub.offsetLeft, e.clientY - hub.offsetTop];
		});
		svg.addEventListener('pointermove', (e) => {
			if (mode === 'drag') { this.moveHub(e.clientX - grab[0], e.clientY - grab[1], false); return; }
			if (mode) slide(e);
		});
		const end = () => {
			const was = mode;
			mode = null;
			if (was === 'size') this.setSize(this.size, true);
			else if (was === 'op') this.setOpacity(Math.round(this.opacity * 100), true);
			else if (was === 'drag') this.moveHub(hub.offsetLeft, hub.offsetTop, true);
		};
		svg.addEventListener('pointerup', end);
		svg.addEventListener('pointercancel', end);

		// The opacity number input lives in the colour popover; the range input stays detached for the shared refresh code.
		this.opRange = document.createElement('input');
		this.opNum = document.createElement('input');
		this.opNum.className = 'pc-op-num';
		Object.assign(this.opNum, { type: 'number', min: '5', max: '100', step: '1' });
		this.opNum.addEventListener('change', () => this.setOpacity(Number(this.opNum.value), true));
		this.opNum.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.opNum.blur(); e.stopPropagation(); });
		this.layoutHub();
	}

	/**
	 * Place the disc at (x, y) px inside the view, kept fully inside with a margin. The position is stored
	 * as a fraction of the free space so it survives resizes; left-hand mode mirrors it horizontally.
	 */
	private moveHub(x: number, y: number, save: boolean): void {
		const hub = this.toolbarEl, root = this.contentEl;
		const M = 8, freeX = Math.max(1, root.clientWidth - hub.offsetWidth - 2 * M), freeY = Math.max(1, root.clientHeight - hub.offsetHeight - 2 * M);
		const fx = Math.max(0, Math.min(1, (x - M) / freeX)), fy = Math.max(0, Math.min(1, (y - M) / freeY));
		hub.style.left = `${M + fx * freeX}px`;
		hub.style.top = `${M + fy * freeY}px`;
		if (save) {
			const st = this.plugin.settings;
			st.hubX = st.leftHand ? 1 - fx : fx; // stored for right-hand; mirrored on use
			st.hubY = fy;
			void this.plugin.saveSettings();
		}
	}

	/** Apply the stored position (default: top-left, or top-right in left-hand mode). */
	private placeHub(): void {
		const st = this.plugin.settings, hub = this.toolbarEl, root = this.contentEl;
		if (!root.clientWidth) return;
		const M = 8, freeX = Math.max(1, root.clientWidth - hub.offsetWidth - 2 * M), freeY = Math.max(1, root.clientHeight - hub.offsetHeight - 2 * M);
		const fx = st.leftHand ? 1 - st.hubX : st.hubX;
		hub.style.left = `${M + fx * freeX}px`;
		hub.style.top = `${M + st.hubY * freeY}px`;
	}

	private layoutHub(): void {
		const H = PenCanvasView.HUB;
		for (const [el, deg] of this.hubBtns) {
			const a = (deg * Math.PI) / 180;
			el.style.left = `${H.R + H.btnR * Math.cos(a)}px`;
			el.style.top = `${H.R + H.btnR * Math.sin(a)}px`;
		}
		const core = this.coreIcon.parentElement as HTMLElement;
		core.style.left = core.style.top = `${H.R}px`;
		this.placeHub();
		this.drawHubDisk();
	}

	private drawHubDisk(): void {
		const svg = this.hubSvg;
		if (!svg) return;
		const H = PenCanvasView.HUB, R = H.R, W = 2 * R, c = R, r = H.slideR;
		svg.setAttribute('width', String(W));
		svg.setAttribute('height', String(W));
		svg.setAttribute('viewBox', `0 0 ${W} ${W}`);
		const pt = (deg: number, rad = r) => [c + rad * Math.cos((deg * Math.PI) / 180), c + rad * Math.sin((deg * Math.PI) / 180)];
		const arc = (a0: number, a1: number) => {
			const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
			return `M ${x0} ${y0} A ${r} ${r} 0 0 ${a1 > a0 ? 1 : 0} ${x1} ${y1}`;
		};
		const span = H.slideSpan, lo = 90 + (180 - span) / 2, ro = 90 - (180 - span) / 2;
		const ts = (this.size - 1) / 29, to = (this.opacity * 100 - 5) / 95;
		const sA = lo + ts * span, oA = ro - to * span;
		const [hx1, hy1] = pt(sA), [hx2, hy2] = pt(oA);
		svg.innerHTML =
			`<circle class="pc-disk" cx="${c}" cy="${c}" r="${R - 1}"/>` +
			`<circle class="pc-disk-sep" cx="${c}" cy="${c}" r="${H.slideR - 16}"/>` +
			`<path class="pc-slide-track" d="${arc(lo, lo + span)}"/><path class="pc-slide-track" d="${arc(ro, ro - span)}"/>` +
			`<path class="pc-slide-fill" d="${arc(lo, sA)}"/><path class="pc-slide-fill" d="${arc(ro, oA)}"/>` +
			`<circle class="pc-slide-handle" cx="${hx1}" cy="${hy1}" r="9"/><circle class="pc-slide-handle" cx="${hx2}" cy="${hy2}" r="9"/>` +
			[-90, 90].map((d) => [-6, 0, 6].map((o) => { const [x, y] = pt(d + o); return `<circle class="pc-grip" cx="${x}" cy="${y}" r="2"/>`; }).join('')).join('') +
			'';
		this.coreText?.setText(`${this.size}px · ${Math.round(this.opacity * 100)}%`);
	}

	/** Popovers open beside the disc (below it when there is room, else above). */
	private placeAboveHub(el: HTMLElement): void {
		el.removeClass('is-hidden');
		const root = this.contentEl.getBoundingClientRect();
		const hub = this.toolbarEl.getBoundingClientRect();
		const x = hub.left - root.left + hub.width / 2 - el.offsetWidth / 2;
		let y = hub.bottom - root.top + 6;
		if (y + el.offsetHeight > root.height - 4) y = hub.top - root.top - el.offsetHeight - 6;
		el.style.left = `${Math.min(Math.max(4, x), root.width - el.offsetWidth - 4)}px`;
		el.style.top = `${Math.max(4, y)}px`;
	}

	/** Fill-style panel: pattern swatches on the left, density on the right (solid is fixed at 100%). */
	private fillStyleMenu(): void {
		const wasFill = this.tool === 'fill';
		this.setTool('fill');
		if (wasFill && this.fillPanel && !this.fillPanel.hasClass('is-hidden')) { this.closeFillPanel(); return; }
		if (!this.fillPanel) this.buildFillPanel();
		this.placeAboveHub(this.fillPanel as HTMLElement);
		this.refreshFillPanel();
	}

	private closeFillPanel(): void { this.fillPanel?.addClass('is-hidden'); }

	private buildFillPanel(): void {
		const p = this.contentEl.createDiv({ cls: 'pc-fill-panel is-hidden' });
		this.fillPanel = p;
		const grid = p.createDiv({ cls: 'pc-fill-grid' });
		for (const [st, label] of FILL_STYLES) {
			const b = grid.createEl('button', { cls: 'pc-fill-swatch', attr: { 'aria-label': label, 'data-style': st } });
			const cv = b.createEl('canvas');
			cv.width = cv.height = 40 * (window.devicePixelRatio || 1);
			b.addEventListener('click', () => {
				this.fillStyle = st;
				this.refreshFillPanel();
				if (this.selected.size) this.mutateSelected((it) => (it.fill ? this.withFillStyle({ ...it }) : it));
			});
			this.fillSwatches.push(b);
		}
		const side = p.createDiv({ cls: 'pc-fill-density' });
		side.createSpan({ text: '密度' });
		this.densityRange = side.createEl('input', { attr: { type: 'range', min: '10', max: '100', step: '10' } });
		this.densityLabel = side.createSpan({ cls: 'pc-fill-density-val' });
		this.densityRange.addEventListener('input', () => { this.fillDensity = Number(this.densityRange.value); this.refreshFillPanel(); });
		this.densityRange.addEventListener('change', () => {
			if (this.selected.size) this.mutateSelected((it) => (it.fill ? this.withFillStyle({ ...it }) : it));
		});
		// Close when drawing or tapping elsewhere.
		this.registerDomEvent(document, 'pointerdown', (e) => {
			const t = e.target as Node;
			if (!p.contains(t) && !(this.toolBtns.get('fill') as HTMLElement).contains(t)) this.closeFillPanel();
		}, true);
	}

	private refreshFillPanel(): void {
		if (!this.fillPanel) return;
		const solid = this.fillStyle === 'solid';
		for (const b of this.fillSwatches) {
			const st = b.dataset.style as FillStyle;
			b.toggleClass('is-active', st === this.fillStyle);
			const cv = b.querySelector('canvas') as HTMLCanvasElement;
			const c = cv.getContext('2d') as CanvasRenderingContext2D;
			const k = cv.width / 40;
			c.setTransform(1, 0, 0, 1, 0, 0);
			c.clearRect(0, 0, cv.width, cv.height);
			c.setTransform(k, 0, 0, k, 0, 0);
			// Icons are monochrome: white on a dark theme, black on a light theme.
			const mono = document.body.classList.contains('theme-dark') ? '#ffffff' : '#000000';
			drawFillIcon(c, st, mono);
		}
		this.densityRange.disabled = solid;
		this.densityRange.parentElement?.toggleClass('is-disabled', solid);
		this.densityRange.value = String(solid ? 100 : this.fillDensity);
		this.densityLabel.setText(`${solid ? 100 : this.fillDensity}%`);
	}

	private withFillStyle<T extends Item>(it: T): T {
		delete it.fillStyle; delete it.fillDensity;
		if (this.fillStyle !== 'solid') {
			it.fillStyle = this.fillStyle;
			if (this.fillDensity !== 50) it.fillDensity = this.fillDensity;
		}
		return it;
	}

	/** Opacity in percent. Applies to new ink and, on commit, to the selection. */
	private setOpacity(pct: number, commit: boolean): void {
		if (!isFinite(pct)) return;
		pct = Math.max(5, Math.min(100, Math.round(pct)));
		this.opacity = pct / 100;
		this.opRange.value = String(pct);
		this.opNum.value = String(pct);
		if (commit && this.selected.size) this.mutateSelected((it) => this.recolor(it, it.color.slice(0, 7)));
		this.refreshToolbar();
	}

	/** New colour (current opacity) for an item; its fill follows. */
	private recolor(it: Item, base: string): Item {
		const ink = this.withAlpha(base, this.opacity);
		return { ...it, color: ink, fill: it.fill ? ink : null };
	}

	private withAlpha(c: string, a: number): string {
		if (a >= 1 || !/^#[0-9a-fA-F]{6}$/.test(c)) return c;
		return c + Math.round(a * 255).toString(16).padStart(2, '0');
	}

	/** Current pen colour including opacity. */
	private get ink(): string { return this.withAlpha(this.color, this.opacity); }

	// ---------- popovers (fill styles, background, brush ring) ----------

	private togglePopover(name: 'bg' | 'tools' | 'colors'): void {
		if (!this.popovers.has(name)) this.buildPopover(name);
		const p = this.popovers.get(name);
		if (!p) return;
		const open = !p.el.hasClass('is-hidden');
		for (const q of this.popovers.values()) q.el.addClass('is-hidden');
		this.closeFillPanel();
		if (open) return;
		this.placePopover(p.el, p.anchor());
		p.refresh();
	}

	private placePopover(el: HTMLElement, _anchor: HTMLElement): void {
		if (!el.hasClass('pc-fan')) { this.placeAboveHub(el); return; }
		// Centre the fan on the disc and open it towards the middle of the view.
		el.removeClass('is-hidden');
		const root = this.contentEl.getBoundingClientRect(), hub = this.toolbarEl.getBoundingClientRect();
		const cx = hub.left + hub.width / 2 - root.left, cy = hub.top + hub.height / 2 - root.top;
		this.fanDir = (Math.atan2(root.height / 2 - cy, root.width / 2 - cx) * 180) / Math.PI;
		const F = PenCanvasView.HUB.R + 70;
		el.style.left = `${cx - F}px`;
		el.style.top = `${cy - F}px`;
		el.style.width = el.style.height = `${2 * F}px`;
	}

	private buildPopover(name: 'bg' | 'tools' | 'colors'): void {
		const el = this.contentEl.createDiv({ cls: `pc-popover pc-pop-${name} is-hidden` });
		const anchor = () => (name === 'bg' ? this.bgBtn : name === 'colors' ? this.brushBtn : this.coreIcon.parentElement as HTMLElement);
		let refresh = () => {};
		if (name === 'bg') {
			const swatches: HTMLElement[] = [];
			for (const [label, c] of BACKGROUNDS) {
				const sw = el.createEl('button', { cls: 'pc-bg-swatch', attr: { 'aria-label': label, 'data-color': c } });
				sw.style.setProperty('--pc-c', c);
				sw.addEventListener('click', () => { this.setBackground(c); refresh(); });
				swatches.push(sw);
			}
			const custom = el.createEl('input', { cls: 'pc-bg-custom', attr: { type: 'color', 'aria-label': '自定义背景色' } });
			custom.addEventListener('input', () => { this.setBackground(custom.value); refresh(); });
			refresh = () => {
				for (const sw of swatches) sw.toggleClass('is-active', sw.dataset.color === this.doc.background);
				custom.value = /^#[0-9a-fA-F]{6}$/.test(this.doc.background) ? this.doc.background : '#ffffff';
			};
		} else if (name === 'tools') {
			const grid = el.createDiv({ cls: 'pc-tool-grid' });
			for (const [t, icon, label] of PenCanvasView.TOOLS) {
				const b = this.btn(grid, icon, label, () => {
					el.addClass('is-hidden');
					if (t === 'fill') this.fillStyleMenu(); else this.setTool(t);
				});
				this.toolBtns.set(t, b);
			}
			refresh = () => { for (const [t, b] of this.toolBtns) b.toggleClass('is-active', t === this.tool); };
		} else {
			// Concepts-style fan: colour wedges radiate out from the disc, opening towards the canvas.
			el.addClass('pc-fan');
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			el.appendChild(svg);
			const custom = el.createEl('input', { cls: 'pc-fan-custom', attr: { type: 'color', 'aria-label': '自定义颜色' } });
			custom.addEventListener('input', () => { this.pickColor(custom.value); refresh(); });
			const row = el.createDiv({ cls: 'pc-ring-op pc-fan-op' });
			row.createSpan({ text: '透明度' });
			row.appendChild(this.opNum);
			row.createSpan({ text: '%' });
			svg.addEventListener('click', (e) => {
				const c = (e.target as Element).getAttribute('data-color');
				if (c === 'custom') custom.click();
				else if (c) { this.pickColor(c); refresh(); }
			});
			refresh = () => {
				const H = PenCanvasView.HUB, F = H.R + 70, r0 = H.R + 8, r1 = H.R + 58;
				svg.setAttribute('width', String(2 * F)); svg.setAttribute('height', String(2 * F));
				svg.setAttribute('viewBox', `0 0 ${2 * F} ${2 * F}`);
				const items: [string, string][] = [...PALETTE, ['自定义', 'custom']];
				const span = 200, step = span / items.length, start = this.fanDir - span / 2;
				const pt = (r: number, d: number) => `${F + r * Math.cos((d * Math.PI) / 180)} ${F + r * Math.sin((d * Math.PI) / 180)}`;
				let h = '<defs><linearGradient id="pc-rainbow" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset=".33" stop-color="#0f0"/><stop offset=".66" stop-color="#00f"/><stop offset="1" stop-color="#f0f"/></linearGradient></defs>';
				items.forEach(([label, c], i) => {
					const d0 = start + i * step + 0.8, d1 = start + (i + 1) * step - 0.8;
					const on = c === this.color;
					const ro = on ? r1 + 8 : r1;
					h += `<path class="pc-wedge${on ? ' is-active' : ''}" data-color="${c}" fill="${c === 'custom' ? 'url(#pc-rainbow)' : c}" d="M ${pt(r0, d0)} A ${r0} ${r0} 0 0 1 ${pt(r0, d1)} L ${pt(ro, d1)} A ${ro} ${ro} 0 0 0 ${pt(ro, d0)} Z"><title>${label}</title></path>`;
				});
				svg.innerHTML = h;
				const a = (this.fanDir * Math.PI) / 180, rr = r1 + 56;
				row.style.left = `${F + rr * Math.cos(a)}px`;
				row.style.top = `${F + rr * Math.sin(a)}px`;
				custom.value = /^#[0-9a-fA-F]{6}$/.test(this.color) ? this.color : '#000000';
			};
		}
		this.popovers.set(name, { el, anchor, refresh });
		this.registerDomEvent(document, 'pointerdown', (e) => {
			const t = e.target as Node;
			if (!el.contains(t) && !anchor().contains(t)) el.addClass('is-hidden');
		}, true);
	}



	private setSize(px: number, commit: boolean): void {
		this.size = Math.max(1, Math.min(30, px));
		if (commit && this.selected.size) this.mutateSelected((it) => (isFillOnly(it) ? it : { ...it, size: this.size }));
		this.refreshToolbar();
	}

	private setBackground(c: string): void {
		if (this.broken !== null) return;
		this.doc.background = c;
		this.applyBackground();
		this.requestSave();
		// Remember the last choice: new canvases start with it (each file still keeps its own colour).
		this.plugin.settings.defaultBackground = c;
		this.plugin.settings.bgChosen = true;
		void this.plugin.saveSettings();
	}

	private applyBackground(): void {
		this.stage.style.setProperty('--pc-bg', this.doc.background);
	}

	private setTool(t: Tool): void {
		this.tool = t;
		if (t !== 'select' && this.selected.size) { this.selected.clear(); this.scheduleRender(); }
		this.refreshToolbar();
	}

	private pickColor(c: string): void {
		this.color = c;
		if (this.selected.size) this.mutateSelected((it) => this.recolor(it, c));
		else if (this.tool === 'eraser' || this.tool === 'select' || this.tool === 'hand') this.tool = 'pen';
		this.refreshToolbar();
	}

	private drawRingIfOpen(): void {
		this.drawHubDisk();
	}

	/** Mirror the toolbar to the right side when left-hand mode is on (persisted in plugin settings). */
	applyLeftHand(): void {
		const on = this.plugin.settings.leftHand;
		this.leftBtn?.toggleClass('is-active', on);
		if (this.toolbarEl && this.hubLeft !== on) {
			this.hubLeft = on;
			this.placeHub();
			for (const p of this.popovers.values()) p.el.addClass('is-hidden');
			this.closeFillPanel();
		}
	}

	private refreshToolbar(): void {
		for (const [t, b] of this.toolBtns) b.toggleClass('is-active', t === this.tool);
		for (const b of this.colorBtns) b.toggleClass('is-active', b.dataset.color === this.color);
		if (this.brushBtn) {
			const dot = this.brushBtn.querySelector('.pc-dot') as HTMLElement;
			dot.style.setProperty('--pc-d', `${Math.max(4, Math.min(22, this.size * 1.2))}px`);
			dot.style.setProperty('--pc-ink', this.ink);
		}
		const ti = PenCanvasView.TOOLS.find(([t]) => t === this.tool);
		if (this.coreIcon && ti && this.coreIcon.dataset.icon !== ti[1]) { this.coreIcon.empty(); setIcon(this.coreIcon, ti[1]); this.coreIcon.dataset.icon = ti[1]; }
		this.drawRingIfOpen();
		if (this.tool !== 'fill') this.closeFillPanel();
		else this.refreshFillPanel();
		this.applyLeftHand();
		const pct = String(Math.round(this.opacity * 100));
		if (this.opRange) { this.opRange.value = pct; this.opNum.value = pct; }
	}

	// ---------- viewport ----------

	private resize(): void {
		const r = this.stage.getBoundingClientRect();
		this.rect = r;
		this.dpr = window.devicePixelRatio || 1;
		this.w = r.width; this.h = r.height;
		for (const c of [this.base, this.live, this.glCanvas]) {
			if (!c) continue;
			c.width = Math.max(1, Math.round(r.width * this.dpr));
			c.height = Math.max(1, Math.round(r.height * this.dpr));
		}
		if (this.needFit && this.w > 0) this.fit();
		if (this.toolbarEl) this.placeHub();
		this.renderBase();
	}

	private fit(): void {
		this.needFit = false;
		const items = this.doc.items;
		if (!items.length || !this.w) { this.vx = 0; this.vy = 0; this.scale = 1; return; }
		let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
		for (const it of items) { const b = itemBBox(it); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); }
		const pad = 40;
		const s = Math.min(1, (this.w - pad * 2) / Math.max(1, x1 - x0), (this.h - pad * 2) / Math.max(1, y1 - y0));
		this.scale = Math.max(0.05, s);
		this.vx = (this.w - (x1 - x0) * this.scale) / 2 - x0 * this.scale;
		this.vy = (this.h - (y1 - y0) * this.scale) / 2 - y0 * this.scale;
	}

	private applyT(c: CanvasRenderingContext2D): void {
		const k = this.dpr * this.scale;
		c.setTransform(k, 0, 0, k, this.dpr * this.vx, this.dpr * this.vy);
	}

	private clearCtx(c: CanvasRenderingContext2D): void {
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.clearRect(0, 0, c.canvas.width, c.canvas.height);
	}

	private toWorld(e: PointerEvent): [number, number] {
		const r = this.rect ?? this.stage.getBoundingClientRect();
		return [(e.clientX - r.left - this.vx) / this.scale, (e.clientY - r.top - this.vy) / this.scale];
	}

	private viewBBox(): BBox {
		return { x0: -this.vx / this.scale, y0: -this.vy / this.scale, x1: (this.w - this.vx) / this.scale, y1: (this.h - this.vy) / this.scale };
	}

	private scheduleRender(): void {
		if (this.viewTimer) { window.clearTimeout(this.viewTimer); this.viewTimer = 0; }
		if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.renderBase(); });
	}

	/**
	 * Pan / zoom: when a full render is slow (many fills on screen), show the last full render
	 * stretched to the new view, and render properly once the view stops changing.
	 */
	private scheduleViewRender(): void {
		if (this.lastRenderMs < SLOW_MS || !this.snap) { this.scheduleRender(); return; }
		if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.drawSnap(); });
		if (this.viewTimer) window.clearTimeout(this.viewTimer);
		this.viewTimer = window.setTimeout(() => { this.viewTimer = 0; this.scheduleRender(); }, 150);
	}

	private glOn(): boolean {
		if (this.gl?.lost) { this.gl = null; this.glCanvas?.remove(); this.glCanvas = null; } // fall back to 2D fills
		return !!this.gl;
	}

	/** Fills on the WebGL layer (cheap, so drawn for real on every frame, including previews). */
	private renderGL(): void {
		if (!this.glOn()) return;
		const moving = this.moveDx !== 0 || this.moveDy !== 0;
		const k = this.dpr * this.scale;
		(this.gl as GLFillLayer).render(this.doc.items, k, this.dpr * this.vx, this.dpr * this.vy, this.viewBBox(),
			moving ? (it) => (this.selected.has(it.id) ? [this.moveDx, this.moveDy] : null) : null);
	}

	private drawSnap(): void {
		this.renderGL();
		const sn = this.snap;
		if (!sn || !this.bctx) return;
		const c = this.bctx;
		this.clearCtx(c);
		const k = this.scale / sn.scale;
		c.drawImage(sn.cv, this.dpr * (this.vx - sn.vx * k), this.dpr * (this.vy - sn.vy * k), sn.cv.width * k, sn.cv.height * k);
	}

	/** Draw items (fills first, then lines) that pass `want`, culled to the view. Returns the bbox of selected ones. */
	private drawItems(c: CanvasRenderingContext2D, want: (isSel: boolean) => boolean, offsetSel: boolean): BBox | null {
		const vb = this.viewBBox();
		let sel: BBox | null = null;
		// Pass 1: fills, pass 2: lines — a fill never covers a line.
		for (const pass of this.glOn() ? [drawLine] : [drawFill, drawLine]) {
			for (const it of this.doc.items) {
				const isSel = this.selected.has(it.id);
				if (!want(isSel)) continue;
				const b = itemBBox(it);
				if (isSel && pass === drawLine) sel = sel ? { x0: Math.min(sel.x0, b.x0), y0: Math.min(sel.y0, b.y0), x1: Math.max(sel.x1, b.x1), y1: Math.max(sel.y1, b.y1) } : { ...b };
				if (isSel && offsetSel) { c.save(); c.translate(this.moveDx, this.moveDy); pass(c, it); c.restore(); continue; }
				if (intersects(b, vb)) pass(c, it);
			}
		}
		return sel;
	}

	private drawSelBox(c: CanvasRenderingContext2D, sel: BBox | null, dx: number, dy: number): void {
		if (!sel) return;
		c.save();
		c.translate(dx, dy);
		c.setLineDash([6 / this.scale, 4 / this.scale]);
		c.lineWidth = 1 / this.scale;
		c.strokeStyle = '#4c8bf5';
		c.strokeRect(sel.x0, sel.y0, sel.x1 - sel.x0, sel.y1 - sel.y0);
		c.restore();
	}

	private layer(): CanvasRenderingContext2D {
		const cv = document.createElement('canvas');
		cv.width = this.bctx.canvas.width; cv.height = this.bctx.canvas.height;
		const c = cv.getContext('2d') as CanvasRenderingContext2D;
		this.applyT(c);
		return c;
	}

	private renderBase(): void {
		if (!this.bctx) return;
		const c = this.bctx;
		const moving = this.moveDx !== 0 || this.moveDy !== 0;
		this.renderGL();
		if (!moving) this.moveLayers = null;
		else if (this.moveLayers || this.lastRenderMs >= SLOW_MS) {
			// Dragging a selection over a heavy scene: render the rest and the selection once, then just shift a bitmap.
			if (!this.moveLayers || this.moveLayers.scale !== this.scale || this.moveLayers.vx !== this.vx || this.moveLayers.vy !== this.vy) {
				const rest = this.layer(), selc = this.layer();
				this.drawItems(rest, (s) => !s, false);
				const dx = this.moveDx, dy = this.moveDy;
				this.moveDx = this.moveDy = 0; // draw the selection at its original place
				this.drawSelBox(selc, this.drawItems(selc, (s) => s, false), 0, 0);
				this.moveDx = dx; this.moveDy = dy;
				this.moveLayers = { rest: rest.canvas, sel: selc.canvas, scale: this.scale, vx: this.vx, vy: this.vy };
			}
			const L = this.moveLayers;
			this.clearCtx(c);
			c.drawImage(L.rest, 0, 0);
			c.drawImage(L.sel, this.moveDx * this.scale * this.dpr, this.moveDy * this.scale * this.dpr);
			return;
		}
		const t0 = performance.now();
		this.clearCtx(c);
		this.applyT(c);
		this.drawSelBox(c, this.drawItems(c, () => true, moving), this.moveDx, this.moveDy);
		// Recording the commands is cheap; the real cost (rasterising, often on the GPU) shows up as a late next frame.
		this.lastRenderMs = Math.max(this.lastRenderMs * 0.5, performance.now() - t0);
		requestAnimationFrame(() => { const d = performance.now() - t0 - 17; if (d > this.lastRenderMs) this.lastRenderMs = d; });
		if (moving) return;
		// Keep a copy for fast pan / zoom previews (only needed when rendering is slow).
		if (this.lastRenderMs >= SLOW_MS) {
			const w = c.canvas.width, h = c.canvas.height;
			const cv = this.snap?.cv.width === w && this.snap.cv.height === h ? this.snap.cv : Object.assign(document.createElement('canvas'), { width: w, height: h });
			const sc = cv.getContext('2d') as CanvasRenderingContext2D;
			sc.clearRect(0, 0, w, h);
			sc.drawImage(c.canvas, 0, 0);
			this.snap = { cv, scale: this.scale, vx: this.vx, vy: this.vy };
		} else this.snap = null;
	}

	private selectionBBox(): BBox | null {
		let sel: BBox | null = null;
		for (const it of this.doc.items) {
			if (!this.selected.has(it.id)) continue;
			const b = itemBBox(it);
			sel = sel ? { x0: Math.min(sel.x0, b.x0), y0: Math.min(sel.y0, b.y0), x1: Math.max(sel.x1, b.x1), y1: Math.max(sel.y1, b.y1) } : { ...b };
		}
		return sel;
	}

	// ---------- history ----------

	private snapshot(): void {
		this.undoStack.push(this.doc.items.slice());
		if (this.undoStack.length > 200) this.undoStack.shift();
		this.redoStack = [];
	}

	private undo(): void {
		const prev = this.undoStack.pop();
		if (!prev || this.broken !== null) return;
		this.redoStack.push(this.doc.items);
		this.doc.items = prev;
		this.selected.clear();
		this.scheduleRender();
		this.requestSave();
	}

	private redo(): void {
		const next = this.redoStack.pop();
		if (!next || this.broken !== null) return;
		this.undoStack.push(this.doc.items);
		this.doc.items = next;
		this.selected.clear();
		this.scheduleRender();
		this.requestSave();
	}

	private mutateSelected(fn: (it: Item) => Item): void {
		if (this.broken !== null) return;
		this.snapshot();
		this.doc.items = this.doc.items.map((it) => (this.selected.has(it.id) ? fn(it) : it));
		this.scheduleRender();
		this.requestSave();
	}

	private copySelected(): void {
		if (!this.selected.size) { new Notice('先选中要复制的内容'); return; }
		clipboard = this.doc.items.filter((it) => this.selected.has(it.id)).map((it) => JSON.parse(JSON.stringify(it)) as Item);
		pasteCount = 0;
	}

	/** Paste the copied items, offset a little more each time; centred in the view when the originals are off screen. */
	private paste(): void {
		if (!clipboard.length) { new Notice('还没有复制内容'); return; }
		if (this.broken !== null) return;
		let b: BBox | null = null;
		for (const it of clipboard) {
			const q = itemBBox(it);
			b = b ? { x0: Math.min(b.x0, q.x0), y0: Math.min(b.y0, q.y0), x1: Math.max(b.x1, q.x1), y1: Math.max(b.y1, q.y1) } : { ...q };
		}
		if (!b) return;
		const vb = this.viewBBox();
		let dx: number, dy: number;
		if (intersects(b, vb)) { pasteCount++; dx = dy = (24 / this.scale) * pasteCount; }
		else { dx = (vb.x0 + vb.x1 - b.x0 - b.x1) / 2; dy = (vb.y0 + vb.y1 - b.y0 - b.y1) / 2; }
		this.snapshot();
		this.selected.clear();
		for (const it of clipboard) {
			const n = { ...translateItem(it, dx, dy), id: uid() } as Item;
			this.doc.items.push(n);
			this.selected.add(n.id);
		}
		this.scheduleRender();
		this.requestSave();
	}

	private deleteSelected(): void {
		if (!this.selected.size || this.broken !== null) return;
		this.snapshot();
		this.doc.items = this.doc.items.filter((it) => !this.selected.has(it.id));
		this.selected.clear();
		this.scheduleRender();
		this.requestSave();
	}

	// ---------- input ----------

	private newGesture(e: PointerEvent, kind: Gesture['kind']): Gesture {
		const [x, y] = this.toWorld(e);
		return { pid: e.pointerId, pointerType: e.pointerType, kind, sx: x, sy: y, cx: x, cy: y, lx: e.clientX, ly: e.clientY, t0: e.timeStamp, events: 0, coalesced: 0, pmin: 1, pmax: 0 };
	}

	private onDown = (e: PointerEvent): void => {
		if (this.broken !== null) return;
		this.diag.types.add(e.pointerType);
		this.rect = this.stage.getBoundingClientRect();

		if (e.pointerType === 'touch') {
			if (this.g && this.g.pointerType !== 'touch') return; // palm rejection while pen/mouse is active
			this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
			this.capture(e.pointerId);
			if (this.touches.size >= 2) {
				if (this.g) this.cancelGesture();
				this.startPinch();
				return;
			}
			if (this.plugin.settings.penOnly || this.tool === 'hand') { this.g = this.newGesture(e, 'pan'); return; }
			this.startTool(e, this.tool);
			return;
		}

		// Pen or mouse: a touch gesture in progress (e.g. resting palm) yields to the pen.
		if (this.g && this.g.pointerType === 'touch') this.cancelGesture();
		this.pinch = null;
		if (this.g) return;
		this.capture(e.pointerId);
		if (e.pointerType === 'mouse' && (e.button === 1 || this.tool === 'hand')) { this.g = this.newGesture(e, 'pan'); return; }
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		let tool = this.tool;
		// Pen eraser end (button 5 / buttons&32) or barrel button (buttons&2) -> eraser while held.
		if (e.pointerType === 'pen' && (e.button === 5 || (e.buttons & 32) !== 0 || (e.buttons & 2) !== 0)) tool = 'eraser';
		if (tool === 'hand') { this.g = this.newGesture(e, 'pan'); return; }
		this.startTool(e, tool);
	};

	private capture(id: number): void {
		try { this.stage.setPointerCapture(id); } catch { /* pointer already gone */ }
	}

	private pressure(e: PointerEvent): number {
		if (e.pointerType !== 'pen') return 0.5;
		const p = Math.min(1, Math.max(0.02, e.pressure || 0.02));
		return Math.pow(p, this.plugin.settings.pressureGamma);
	}

	private startTool(e: PointerEvent, tool: Tool): void {
		const st = this.plugin.settings;
		if (tool === 'pen') {
			const g = this.newGesture(e, 'stroke');
			const p = this.pressure(e);
			g.stroke = {
				type: 'stroke', id: uid(), color: this.ink, size: this.size, fill: null,
				thinning: st.thinning, smoothing: st.smoothing, streamline: st.streamline, sim: e.pointerType !== 'pen',
				points: [[g.sx, g.sy, p]],
			};
			g.pmin = g.pmax = p;
			this.g = g;
			this.drawLiveStroke([]);
		} else if (tool === 'eraser') {
			this.g = this.newGesture(e, 'erase');
			this.eraseAt(this.g.sx, this.g.sy);
		} else if (tool === 'fill') {
			const [x, y] = this.toWorld(e);
			this.bucket(x, y);
		} else if (tool === 'select') {
			const [x, y] = this.toWorld(e);
			const sb = this.selectionBBox();
			// Tap/click on an item's outline (or inside a filled one) selects just that item, topmost first.
			// Unfilled shapes are only hit on their line, so the outer of two nested circles can be picked alone.
			const r = 8 / this.scale;
			let hit: Item | null = null;
			for (let i = this.doc.items.length - 1; i >= 0; i--) {
				const it = this.doc.items[i];
				if (!isFillOnly(it) && hitItem(it, x, y, r)) { hit = it; break; }
			}
			if (!hit) for (let i = this.doc.items.length - 1; i >= 0; i--) {
				const it = this.doc.items[i];
				if (isFillOnly(it) && hitItem(it, x, y, 0)) { hit = it; break; }
			}
			if (hit && !this.selected.has(hit.id)) {
				if (!e.shiftKey) this.selected.clear();
				this.selected.add(hit.id);
				this.scheduleRender();
			}
			const inSel = sb && x >= sb.x0 && x <= sb.x1 && y >= sb.y0 && y <= sb.y1;
			if (hit || inSel) {
				const g = this.newGesture(e, 'move');
				g.sel0 = this.selectionGeomBBox() ?? undefined;
				this.buildSnap(g, this.selected);
				this.g = g;
			} else {
				if (!e.shiftKey) this.selected.clear();
				this.scheduleRender();
				this.g = this.newGesture(e, 'box');
			}
		} else if (tool !== 'hand') {
			const g = this.newGesture(e, 'shape');
			this.buildSnap(g, null);
			g.sx += this.snap1([g.sx], g.snapX).d;
			g.sy += this.snap1([g.sy], g.snapY).d;
			g.shape = { type: tool, id: uid(), color: this.ink, size: this.size, fill: null, x1: g.sx, y1: g.sy, x2: g.sx, y2: g.sy };
			this.g = g;
		}
	}

	private onMove = (e: PointerEvent): void => {
		const pe = e as PEvt;
		if (e.pointerType === 'touch' && this.touches.has(e.pointerId)) {
			this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
			if (this.pinch) { this.updatePinch(); return; }
		}
		const g = this.g;
		if (!g || g.pid !== e.pointerId) return;
		g.events++;
		const evs = pe.getCoalescedEvents?.() ?? [];
		const list = evs.length ? evs : [e];
		g.coalesced += list.length;
		const [x, y] = this.toWorld(e);
		g.cx = x; g.cy = y;

		switch (g.kind) {
			case 'pan':
				this.vx += e.clientX - g.lx; this.vy += e.clientY - g.ly;
				g.lx = e.clientX; g.ly = e.clientY;
				this.scheduleViewRender();
				break;
			case 'stroke': {
				const s = g.stroke as StrokeItem;
				for (const ev of list) {
					const [wx, wy] = this.toWorld(ev);
					const p = this.pressure(ev);
					if (p < g.pmin) g.pmin = p;
					if (p > g.pmax) g.pmax = p;
					s.points.push([wx, wy, p]);
				}
				let pred: Pt[] = [];
				if (this.plugin.settings.prediction && pe.getPredictedEvents) {
					// Use only the first predicted sample: further ones overshoot on curves.
					pred = pe.getPredictedEvents().slice(0, 1).map((ev) => { const [wx, wy] = this.toWorld(ev); return [wx, wy, this.pressure(ev)] as Pt; });
				}
				this.drawLiveStroke(pred);
				break;
			}
			case 'erase':
				for (const ev of list) { const [wx, wy] = this.toWorld(ev); this.eraseAt(wx, wy); }
				break;
			case 'shape': {
				const sh = g.shape as ShapeItem;
				const rx = this.snap1([x], g.snapX), ry = this.snap1([y], g.snapY);
				sh.x2 = x + rx.d; sh.y2 = y + ry.d;
				const label = this.stickyShape(sh);
				g.cx = sh.x2; g.cy = sh.y2;
				this.clearCtx(this.lctx); this.applyT(this.lctx); drawShape(this.lctx, sh);
				if (label) this.drawLabel(label, sh.x2, sh.y2);
				else this.drawGuides(rx.at, ry.at);
				break;
			}
			case 'box': {
				const c = this.lctx;
				this.clearCtx(c); this.applyT(c);
				c.setLineDash([6 / this.scale, 4 / this.scale]);
				c.lineWidth = 1 / this.scale;
				c.strokeStyle = '#4c8bf5';
				c.strokeRect(g.sx, g.sy, x - g.sx, y - g.sy);
				c.setLineDash([]);
				break;
			}
			case 'move': {
				let dx = x - g.sx, dy = y - g.sy;
				let gx: number | null = null, gy: number | null = null;
				const b = g.sel0;
				if (b) {
					const rx = this.snap1([b.x0 + dx, (b.x0 + b.x1) / 2 + dx, b.x1 + dx], g.snapX);
					const ry = this.snap1([b.y0 + dy, (b.y0 + b.y1) / 2 + dy, b.y1 + dy], g.snapY);
					dx += rx.d; dy += ry.d; gx = rx.at; gy = ry.at;
				}
				this.moveDx = dx; this.moveDy = dy;
				this.scheduleRender();
				this.clearCtx(this.lctx); this.applyT(this.lctx);
				this.drawGuides(gx, gy);
				break;
			}
		}
	};

	private onUp = (e: PointerEvent): void => {
		if (e.type === 'pointercancel' && e.pointerType !== 'touch') console.log(`[pen-canvas] pointercancel from ${e.pointerType}`);
		if (e.pointerType === 'touch') {
			this.touches.delete(e.pointerId);
			if (this.pinch) {
				if (this.touches.size < 2) this.pinch = null;
				return;
			}
		}
		const g = this.g;
		if (!g || g.pid !== e.pointerId) return;
		this.g = null;
		switch (g.kind) {
			case 'stroke': {
				const s = g.stroke as StrokeItem;
				s.points = s.points.map((p) => [round(p[0], 2), round(p[1], 2), round(p[2], 3)] as Pt);
				this.commit(s);
				const dur = e.timeStamp - g.t0;
				this.diag.last = `${g.pointerType}：${g.events} 次 move 事件，${s.points.length} 个采样点，${dur.toFixed(0)} ms` +
					(dur > 0 ? `（约 ${(g.coalesced / (dur / 1000)).toFixed(0)} 点/秒，事件 ${(g.events / (dur / 1000)).toFixed(0)} 次/秒）` : '') +
					`，压感 ${g.pmin.toFixed(2)}–${g.pmax.toFixed(2)}`;
				break;
			}
			case 'shape': {
				const sh = g.shape as ShapeItem;
				sh.x2 = g.cx; sh.y2 = g.cy;
				this.clearCtx(this.lctx);
				if (Math.hypot(sh.x2 - sh.x1, sh.y2 - sh.y1) * this.scale < 4) break;
				sh.x1 = round(sh.x1, 2); sh.y1 = round(sh.y1, 2); sh.x2 = round(sh.x2, 2); sh.y2 = round(sh.y2, 2);
				this.commit(sh);
				break;
			}
			case 'erase':
				this.clearCtx(this.lctx);
				if (g.snapped) this.requestSave();
				break;
			case 'box': {
				this.clearCtx(this.lctx);
				const b: BBox = { x0: Math.min(g.sx, g.cx), y0: Math.min(g.sy, g.cy), x1: Math.max(g.sx, g.cx), y1: Math.max(g.sy, g.cy) };
				for (const it of this.doc.items) if (itemTouchesBox(it, b)) this.selected.add(it.id);
				this.scheduleRender();
				break;
			}
			case 'move': {
				const dx = this.moveDx, dy = this.moveDy;
				this.moveDx = this.moveDy = 0;
				this.clearCtx(this.lctx);
				if (dx || dy) {
					this.snapshot();
					this.doc.items = this.doc.items.map((it) => (this.selected.has(it.id) ? translateItem(it, dx, dy) : it));
					this.requestSave();
				}
				this.scheduleRender();
				break;
			}
			case 'pan':
				break;
		}
	};

	private cancelGesture(): void {
		const g = this.g;
		this.g = null;
		if (!g) return;
		if (g.kind === 'move') { this.moveDx = this.moveDy = 0; this.scheduleRender(); }
		if (g.kind === 'erase' && g.snapped) this.requestSave();
		this.clearCtx(this.lctx);
	}

	private commit(it: Item): void {
		this.snapshot();
		this.doc.items.push(it);
		this.snap = null; // the preview bitmap no longer matches
		// Draw the finished item onto the base layer, then clear the live layer in the same task.
		if (it.fill) this.renderBase();
		else { this.applyT(this.bctx); drawItem(this.bctx, it); }
		this.clearCtx(this.lctx);
		this.requestSave();
	}

	/**
	 * OneNote-style sticky sizes while dragging a shape: rect/ellipse stick to 1:1 (and 4:3, 2:1 ...),
	 * line/arrow stick to multiples of 45 degrees. Returns a label when stuck.
	 */
	private stickyShape(sh: ShapeItem): string | null {
		const w = sh.x2 - sh.x1, h = sh.y2 - sh.y1;
		const aw = Math.abs(w), ah = Math.abs(h);
		if (Math.max(aw, ah) * this.scale < 12) return null;
		if (sh.type === 'rect' || sh.type === 'ellipse') {
			if (!aw || !ah) return null;
			const ratios: [number, string][] = [[1, '1:1'], [4 / 3, '4:3'], [3 / 4, '3:4'], [2, '2:1'], [1 / 2, '1:2']];
			for (const [t, name] of ratios) {
				const tol = 0.1;
				if (Math.abs(Math.log(aw / ah / t)) < tol) {
					if (aw >= ah * t) sh.y2 = sh.y1 + Math.sign(h) * aw / t;
					else sh.x2 = sh.x1 + Math.sign(w) * ah * t;
					return name;
				}
			}
			return null;
		}
		const len = Math.hypot(w, h);
		const ang = Math.atan2(h, w);
		const step = Math.PI / 4;
		const snapped = Math.round(ang / step) * step;
		if (Math.abs(ang - snapped) < (4 * Math.PI) / 180) {
			sh.x2 = sh.x1 + Math.cos(snapped) * len;
			sh.y2 = sh.y1 + Math.sin(snapped) * len;
			return `${Math.round(((snapped * 180) / Math.PI + 360) % 360)}°`;
		}
		return null;
	}

	private drawLabel(text: string, x: number, y: number): void {
		const c = this.lctx;
		c.save();
		c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		const sx = x * this.scale + this.vx + 12, sy = y * this.scale + this.vy + 12;
		c.font = '12px sans-serif';
		const tw = c.measureText(text).width;
		c.fillStyle = 'rgba(120,82,238,0.9)';
		c.fillRect(sx - 4, sy - 12, tw + 8, 17);
		c.fillStyle = '#fff';
		c.fillText(text, sx, sy);
		c.restore();
	}

	/** Paint bucket: fill the closed region under (x, y) with the current colour + opacity. */
	private bucket(x: number, y: number): void {
		const ink = this.ink;
		const items = this.doc.items;
		// Tapping an existing fill region recolours it.
		for (let i = items.length - 1; i >= 0; i--) {
			const it = items[i];
			if (isFillOnly(it) && hitItem(it, x, y, 0)) { this.replaceItem(it, this.withFillStyle({ ...it, color: ink, fill: ink })); return; }
		}
		// Smallest closed shape / closed stroke around the point.
		let best: Item | null = null, bestA = Infinity;
		for (const it of items) {
			const o = closedOutline(it);
			if (!o || !pointInPoly(x, y, o)) continue;
			const a = polygonArea(o);
			if (a < bestA) { best = it; bestA = a; }
		}
		const res = bucketRegion(items, this.viewBBox(), this.scale, x, y, this.plugin.settings.fillGap);
		if (res.kind === 'wall') return;
		if (res.kind === 'open' || !res.rings.length) {
			if (best) this.replaceItem(best, this.withFillStyle({ ...best, fill: ink }));
			else new Notice('这里不是封闭区域（或者区域超出了当前屏幕）');
			return;
		}
		// The region is exactly one shape's inside: store the fill on the shape so it moves with it.
		if (best && res.rings.length === 1 && Math.abs(res.area - bestA) / bestA < 0.12) {
			this.replaceItem(best, this.withFillStyle({ ...best, fill: ink }));
			return;
		}
		const rings = res.rings.slice().sort((a, b) => polygonArea(b) - polygonArea(a));
		this.commit(this.withFillStyle({ type: 'polygon', id: uid(), color: ink, size: 0, fill: ink, points: rings[0], ...(rings.length > 1 ? { holes: rings.slice(1) } : {}) }));
	}

	private replaceItem(old: Item, next: Item): void {
		this.snapshot();
		this.doc.items = this.doc.items.map((it) => (it === old ? next : it));
		this.scheduleRender();
		this.requestSave();
	}

	private selectionGeomBBox(): BBox | null {
		let sel: BBox | null = null;
		for (const it of this.doc.items) {
			if (!this.selected.has(it.id)) continue;
			const b = itemGeomBBox(it);
			sel = sel ? { x0: Math.min(sel.x0, b.x0), y0: Math.min(sel.y0, b.y0), x1: Math.max(sel.x1, b.x1), y1: Math.max(sel.y1, b.y1) } : { ...b };
		}
		return sel;
	}

	/** Snap targets: edges and centres of visible shapes (handwriting is ignored). */
	private buildSnap(g: Gesture, exclude: Set<string> | null): void {
		if (!this.plugin.settings.snap) return;
		const xs: number[] = [], ys: number[] = [];
		const vb = this.viewBBox();
		for (const it of this.doc.items) {
			if (it.type === 'stroke' || exclude?.has(it.id)) continue;
			const b = itemGeomBBox(it);
			if (!intersects(b, vb)) continue;
			xs.push(b.x0, (b.x0 + b.x1) / 2, b.x1);
			ys.push(b.y0, (b.y0 + b.y1) / 2, b.y1);
		}
		g.snapX = xs; g.snapY = ys;
	}

	private snap1(vals: number[], cands?: number[]): { d: number; at: number | null } {
		let best = Infinity, d = 0, at: number | null = null;
		if (!cands) return { d, at };
		const tol = 6 / this.scale;
		for (const v of vals) for (const c of cands) {
			const e = Math.abs(c - v);
			if (e < tol && e < best) { best = e; d = c - v; at = c; }
		}
		return { d, at };
	}

	private drawGuides(gx: number | null, gy: number | null): void {
		if (gx === null && gy === null) return;
		const c = this.lctx, vb = this.viewBBox();
		c.save();
		c.lineWidth = 1 / this.scale;
		c.strokeStyle = '#7852ee';
		c.setLineDash([4 / this.scale, 4 / this.scale]);
		c.beginPath();
		if (gx !== null) { c.moveTo(gx, vb.y0); c.lineTo(gx, vb.y1); }
		if (gy !== null) { c.moveTo(vb.x0, gy); c.lineTo(vb.x1, gy); }
		c.stroke();
		c.restore();
	}

	private drawLiveStroke(pred: Pt[]): void {
		const g = this.g;
		if (!g || !g.stroke) return;
		const s = g.stroke;
		const c = this.lctx;
		this.clearCtx(c);
		this.applyT(c);
		const pts = pred.length ? s.points.concat(pred) : s.points;
		if (s.fill && pts.length > 2) {
			c.beginPath();
			c.moveTo(pts[0][0], pts[0][1]);
			for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
			c.closePath();
			c.fillStyle = s.fill;
			c.fill();
		}
		c.fillStyle = s.color;
		c.fill(strokeOutlinePath(pts, s));
	}

	private eraseAt(x: number, y: number): void {
		const g = this.g;
		const r = 8 / this.scale;
		const items = this.doc.items;
		// Lines and fills are erased separately: touching a line removes the line but keeps its fill;
		// rubbing inside a fill (away from lines) removes only the fill.
		let next: Item[] | null = null;
		const lineHits = items.filter((it) => hitItem(it, x, y, r, true));
		if (lineHits.length) {
			const hit = new Set(lineHits);
			next = [];
			for (const it of items) {
				if (!hit.has(it)) { next.push(it); continue; }
				const f = detachFill(it);
				if (f) next.unshift(f); // keep the detached fill at the bottom
			}
		} else {
			const fillHits = items.filter((it) => hitFill(it, x, y, r + it.size / 2 + 2 / this.scale));
			if (fillHits.length) {
				const hit = new Set(fillHits);
				next = [];
				for (const it of items) {
					if (!hit.has(it)) next.push(it);
					else if (!isFillOnly(it)) { const n = { ...it, fill: null }; delete n.fillStyle; delete n.fillDensity; next.push(n); }
				}
			}
		}
		if (next && g) {
			if (!g.snapped) { this.snapshot(); g.snapped = true; }
			this.doc.items = next;
			this.scheduleRender();
		}
		const c = this.lctx;
		this.clearCtx(c); this.applyT(c);
		c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
		c.lineWidth = 1 / this.scale; c.strokeStyle = '#888'; c.stroke();
	}

	private startPinch(): void {
		const [a, b] = [...this.touches.values()];
		this.pinch = { s0: this.scale, vx0: this.vx, vy0: this.vy, cx0: (a.x + b.x) / 2, cy0: (a.y + b.y) / 2, d0: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) };
	}

	private updatePinch(): void {
		const p = this.pinch;
		if (!p || this.touches.size < 2) return;
		const [a, b] = [...this.touches.values()];
		const r = this.rect ?? this.stage.getBoundingClientRect();
		const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
		const s = Math.min(8, Math.max(0.05, p.s0 * Math.hypot(a.x - b.x, a.y - b.y) / p.d0));
		const wx = (p.cx0 - r.left - p.vx0) / p.s0, wy = (p.cy0 - r.top - p.vy0) / p.s0;
		this.scale = s;
		this.vx = cx - r.left - wx * s;
		this.vy = cy - r.top - wy * s;
		this.scheduleViewRender();
	}

	private onWheel = (e: WheelEvent): void => {
		e.preventDefault();
		const r = this.stage.getBoundingClientRect();
		if (e.ctrlKey || e.metaKey) {
			const mx = e.clientX - r.left, my = e.clientY - r.top;
			const s = Math.min(8, Math.max(0.05, this.scale * Math.exp(-e.deltaY * 0.01)));
			this.vx = mx - ((mx - this.vx) / this.scale) * s;
			this.vy = my - ((my - this.vy) / this.scale) * s;
			this.scale = s;
		} else {
			this.vx -= e.shiftKey ? e.deltaY : e.deltaX;
			this.vy -= e.shiftKey ? 0 : e.deltaY;
		}
		this.scheduleViewRender();
	};

	// ---------- diagnostics ----------

	showDiagnostics(): void {
		const proto = PointerEvent.prototype as unknown as Record<string, unknown>;
		const lines = [
			`desynchronized：请求=${this.diag.desyncRequested}，getContextAttributes 报告=${String(this.diag.desyncGranted)}`,
			`WebGL 填充：${this.diag.glFill ? "开" : "关/不可用"}`,
			`getCoalescedEvents：${typeof proto.getCoalescedEvents === 'function' ? '支持' : '不支持'}`,
			`getPredictedEvents：${typeof proto.getPredictedEvents === 'function' ? '支持' : '不支持'}`,
			`见到的输入类型：${[...this.diag.types].join(', ') || '（还没有）'}`,
			`上一笔：${this.diag.last || '（先画一笔再看）'}`,
			`devicePixelRatio：${window.devicePixelRatio}`,
			`UA：${navigator.userAgent}`,
		];
		const m = new Modal(this.app);
		m.titleEl.setText('手写输入诊断');
		const pre = m.contentEl.createEl('pre', { cls: 'pc-diag' });
		pre.setText(lines.join('\n'));
		m.contentEl.createEl('p', { text: '注意：desynchronized=true 只说明浏览器接受了这个提示，不能证明真的走了前缓冲渲染。真实延迟要用高速摄像（如手机慢动作）对比。' });
		m.open();
	}
}

/** Crisp, fully opaque 40x40 icon for a fill style (independent of zoom and pen opacity). */
function drawFillIcon(c: CanvasRenderingContext2D, st: FillStyle, color: string): void {
	c.fillStyle = c.strokeStyle = color;
	c.lineWidth = 2.2;
	c.lineCap = 'butt';
	c.save();
	c.beginPath(); c.rect(2, 2, 36, 36); c.clip();
	const line = (x0: number, y0: number, x1: number, y1: number) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
	const dot = (x: number, y: number, r: number) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); };
	if (st === 'solid') c.fillRect(2, 2, 36, 36);
	else if (st === 'hatch' || st === 'cross') {
		for (let d = -40; d <= 80; d += 9) {
			line(d, 40, d + 40, 0);
			if (st === 'cross') line(d, 0, d + 40, 40);
		}
	} else if (st === 'dots') {
		for (let y = 6; y < 40; y += 9) for (let x = (y / 9) % 2 ? 6 : 10.5; x < 40; x += 9) dot(x, y, 2.3);
	} else {
		let seed = 7;
		const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
		for (let i = 0; i < 34; i++) dot(3 + rnd() * 34, 3 + rnd() * 34, 1 + rnd() * 1.2);
	}
	c.restore();
}
