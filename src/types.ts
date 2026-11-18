export type Pt = [number, number, number]; // x, y, pressure (world coords)

export interface StrokeItem {
	type: 'stroke';
	id: string;
	color: string;
	size: number;
	fill: string | null;
	fillStyle?: FillStyle; // pattern for the fill; absent = solid
	fillDensity?: number; // percent 10..100, absent = 50; ignored for solid
	// Rendering params are stored per stroke so a stroke looks identical on every
	// device and never changes when settings change later.
	thinning: number;
	smoothing: number;
	streamline: number;
	sim: boolean; // simulated pressure (mouse / finger)
	points: Pt[];
}

export type ShapeKind = 'rect' | 'ellipse' | 'line' | 'arrow';

export interface ShapeItem {
	type: ShapeKind;
	id: string;
	color: string;
	size: number;
	fill: string | null;
	fillStyle?: FillStyle; // pattern for the fill; absent = solid
	fillDensity?: number; // percent 10..100, absent = 50; ignored for solid
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

export interface PolygonItem {
	type: 'polygon';
	id: string;
	color: string;
	size: number;
	fill: string | null;
	fillStyle?: FillStyle; // pattern for the fill; absent = solid
	fillDensity?: number; // percent 10..100, absent = 50; ignored for solid
	points: [number, number][];
	holes?: [number, number][][]; // extra rings, filled with even-odd rule
}

export type Item = StrokeItem | ShapeItem | PolygonItem;

export type FillStyle = 'solid' | 'hatch' | 'cross' | 'dots' | 'stipple';
export const FILL_STYLES: [FillStyle, string][] = [
	['solid', '实心'], ['hatch', '斜线'], ['cross', '网格线'], ['dots', '圆点'], ['stipple', '电子云（随机点）'],
];

export interface CanvasDoc {
	type: 'pen-canvas';
	version: 1;
	background: string;
	items: Item[];
}

export interface PenSettings {
	penOnly: boolean;
	thinning: number;
	smoothing: number;
	streamline: number;
	pressureGamma: number;
	prediction: boolean;
	desynchronized: boolean;
	defaultBackground: string;
	bgChosen: boolean; // false = follow the theme (dark -> black canvas, light -> white)
	snap: boolean;
	leftHand: boolean;
	fillGap: number;
	glFill: boolean; // draw fills with WebGL (falls back to 2D when unavailable)
	hubX: number; // menu disc position as a fraction of the free space (right-hand; mirrored in left-hand mode)
	hubY: number;
}

export const DEFAULT_SETTINGS: PenSettings = {
	penOnly: true,
	thinning: 0.6,
	smoothing: 0.5,
	streamline: 0.3,
	pressureGamma: 1,
	prediction: true,
	desynchronized: true,
	defaultBackground: '#ffffff',
	bgChosen: false,
	snap: true,
	leftHand: false,
	fillGap: 5,
	glFill: true,
	hubX: 0,
	hubY: 0,
};

// Obsidian's default accent palette (light-theme values) plus neutrals.
export const PALETTE: [string, string][] = [
	['黑', '#1e1e1e'], ['灰', '#8a8a8a'], ['白', '#ffffff'],
	['红', '#e93147'], ['橙', '#ec7500'], ['黄', '#e0ac00'], ['绿', '#08b94e'],
	['青', '#00bfbc'], ['蓝', '#086ddd'], ['紫', '#7852ee'], ['粉', '#d53984'],
];
export const OPACITIES = [1, 0.75, 0.5, 0.3, 0.15];
