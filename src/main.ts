import { App, Plugin, PluginSettingTab, Setting, TFolder, normalizePath } from 'obsidian';
import { DARK_BG, EXT, PenCanvasView, VIEW_TYPE } from './view';
import { DEFAULT_SETTINGS, PenSettings } from './types';
import { emptyDoc, serialize } from './geometry';
import { Lang, setLang, tr } from './i18n';

const newLabel = () => tr('新建手写画布', 'New pen canvas');

export default class PenCanvasPlugin extends Plugin {
	settings: PenSettings = { ...DEFAULT_SETTINGS };

	async onload(): Promise<void> {
		await this.loadSettings();
		setLang(this.settings.lang);
		this.registerView(VIEW_TYPE, (leaf) => new PenCanvasView(leaf, this));
		this.registerExtensions([EXT], VIEW_TYPE);
		this.addRibbonIcon('pen-tool', newLabel(), () => { void this.createCanvas(); });
		this.addCommand({ id: 'new-canvas', name: newLabel(), callback: () => { void this.createCanvas(); } });
		this.addCommand({
			id: 'diagnostics',
			name: tr('显示手写输入诊断信息', 'Show pen input diagnostics'),
			checkCallback: (checking) => {
				const v = this.app.workspace.getActiveViewOfType(PenCanvasView);
				if (!v) return false;
				if (!checking) v.showDiagnostics();
				return true;
			},
		});
		this.registerEvent(this.app.workspace.on('file-menu', (menu, file, source) => {
			try {
				const folder = file instanceof TFolder ? file : file.parent;
				if (!folder) return;
				menu.addItem((item) => item.setTitle(newLabel()).setIcon('pen-tool')
					.onClick(() => { void this.createCanvas(folder); }));
			} catch (e) {
				console.error('[pen-canvas] file-menu handler failed', e);
			}
		}));
		this.addSettingTab(new PenCanvasSettingTab(this.app, this));
	}

	async createCanvas(folder?: TFolder): Promise<void> {
		const active = this.app.workspace.getActiveFile();
		const parent = folder ?? this.app.fileManager.getNewFileParent(active?.path ?? '');
		const dir = parent.isRoot() ? '' : parent.path + '/';
		const base = tr('手写画布', 'Pen canvas');
		let i = 0;
		while (this.app.vault.getAbstractFileByPath(normalizePath(`${dir}${base}${i ? ' ' + i : ''}.${EXT}`))) i++;
		const path = normalizePath(`${dir}${base}${i ? ' ' + i : ''}.${EXT}`);
		const file = await this.app.vault.create(path, serialize(emptyDoc(this.newBackground())));
		await this.app.workspace.getLeaf(true).openFile(file);
	}

	async setLeftHand(on: boolean): Promise<void> {
		this.settings.leftHand = on;
		await this.saveSettings();
		this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((l) => { if (l.view instanceof PenCanvasView) l.view.applyLeftHand(); });
	}

	/** Background for a new canvas: the last one picked, or black/white following the theme. */
	newBackground(): string {
		if (this.settings.bgChosen) return this.settings.defaultBackground;
		return activeDocument.body.classList.contains('theme-dark') ? DARK_BG : '#ffffff';
	}

	async loadSettings(): Promise<void> {
		this.settings = { ...DEFAULT_SETTINGS, ...((await this.loadData()) as Partial<PenSettings> | null) };
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

class PenCanvasSettingTab extends PluginSettingTab {
	plugin: PenCanvasPlugin;
	constructor(app: App, plugin: PenCanvasPlugin) { super(app, plugin); this.plugin = plugin; }

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		const s = this.plugin.settings;
		const save = () => { void this.plugin.saveSettings(); };
		new Setting(containerEl).setName(tr('界面语言', 'Language'))
			.setDesc(tr('默认跟随 Obsidian 的语言。重新打开画布后生效（命令名要重启 Obsidian）。', 'Follows Obsidian\'s language by default. Applies to canvases opened afterwards (command names after restarting Obsidian).'))
			.addDropdown((d) => d.addOption('auto', tr('跟随 Obsidian', 'Follow Obsidian')).addOption('zh', '中文').addOption('en', 'English')
				.setValue(s.lang).onChange((v) => { s.lang = v as Lang; setLang(s.lang); save(); this.display(); }));
		containerEl.createEl('p', { text: tr('笔迹参数只影响之后画的新笔画；旧笔画按各自保存的参数渲染，所以在电脑和平板上看起来一致。', 'Stroke settings only affect new strokes. Existing strokes keep the settings they were drawn with, so they look the same on every device.') });

		new Setting(containerEl).setName(tr('左手模式', 'Left-hand mode')).setDesc(tr('圆盘内圈的按键左右镜像（位置和外圈滑条不变）。也可以在圆盘“···”菜单里切换。', 'Mirrors the keys of the disc menu left to right (its position and the outer sliders stay). Also in the disc\'s "···" menu.'))
			.addToggle((t) => t.setValue(s.leftHand).onChange((v) => { void this.plugin.setLeftHand(v); }));
		new Setting(containerEl).setName(tr('只用笔画画', 'Draw with pen only')).setDesc(tr('开启后手指只用来平移/缩放，笔才画画（防误触）。', 'Fingers only pan and zoom; only the pen draws (avoids accidental marks).'))
			.addToggle((t) => t.setValue(s.penOnly).onChange((v) => { s.penOnly = v; save(); }));
		new Setting(containerEl).setName(tr('压感变细程度 (thinning)', 'Pressure thinning')).setDesc(tr('0 = 不受压力影响，1 = 变化最大。', '0 = width ignores pressure, 1 = strongest effect.'))
			.addSlider((sl) => sl.setLimits(0, 1, 0.05).setValue(s.thinning).onChange((v) => { s.thinning = v; save(); }));
		new Setting(containerEl).setName(tr('压感曲线', 'Pressure curve')).setDesc(tr('<1 轻压就粗，>1 要用力才粗。', 'Below 1: light pressure already gives thick lines. Above 1: press harder for thick lines.'))
			.addSlider((sl) => sl.setLimits(0.3, 2.5, 0.05).setValue(s.pressureGamma).onChange((v) => { s.pressureGamma = v; save(); }));
		new Setting(containerEl).setName(tr('轮廓平滑 (smoothing)', 'Edge smoothing'))
			.addSlider((sl) => sl.setLimits(0, 1, 0.05).setValue(s.smoothing).onChange((v) => { s.smoothing = v; save(); }));
		new Setting(containerEl).setName(tr('防抖 (streamline)', 'Stabilizer (streamline)')).setDesc(tr('越大越顺，但笔迹会更明显地落后笔尖。', 'Higher is smoother, but the line trails further behind the pen tip.'))
			.addSlider((sl) => sl.setLimits(0, 0.9, 0.05).setValue(s.streamline).onChange((v) => { s.streamline = v; save(); }));
		new Setting(containerEl).setName(tr('笔尖预测', 'Pen tip prediction')).setDesc(tr('用 getPredictedEvents 提前画一小段，减少视觉延迟；抬笔后预测部分被丢弃。', 'Draws a short predicted piece ahead of the pen (getPredictedEvents) to hide latency. The prediction is dropped when you lift the pen.'))
			.addToggle((t) => t.setValue(s.prediction).onChange((v) => { s.prediction = v; save(); }));
		new Setting(containerEl).setName(tr('低延迟画布 (desynchronized)', 'Low-latency canvas (desynchronized)')).setDesc(tr('重新打开画布后生效。若出现撕裂或闪烁可关闭。', 'Applies after reopening the canvas. Turn off if you see tearing or flicker.'))
			.addToggle((t) => t.setValue(s.desynchronized).onChange((v) => { s.desynchronized = v; save(); }));
		new Setting(containerEl).setName(tr('对齐吸附', 'Snapping')).setDesc(tr('画形状、移动选中内容时，吸附到其他形状的边和中线并显示参考线（手写笔画不参与）。拖椭圆/矩形时会在 1:1、4:3、2:1 等比例停一下，直线/箭头在 45° 倍数停一下。', 'When drawing shapes or moving a selection, snap to the edges and centre lines of other shapes and show guides (handwriting is ignored). Ellipses and rectangles pause at 1:1, 4:3, 2:1 and similar ratios; lines and arrows at multiples of 45°.'))
			.addToggle((t) => t.setValue(s.snap).onChange((v) => { s.snap = v; save(); }));
		new Setting(containerEl).setName(tr('填充封口间隙（像素）', 'Fill gap tolerance (px)')).setDesc(tr('线条之间小于这个距离的缺口，填充时当作封闭。0 = 必须完全封口。', 'Gaps between lines smaller than this count as closed when filling. 0 = the area must be fully closed.'))
			.addSlider((sl) => sl.setLimits(0, 20, 1).setValue(s.fillGap).onChange((v) => { s.fillGap = v; save(); }));
		new Setting(containerEl).setName(tr('GPU 渲染填充 (WebGL)', 'GPU fills (WebGL)')).setDesc(tr('填充用显卡绘制，大量图案填充时更流畅、放大不糊。重新打开画布后生效；若显示异常可关闭，改回原来的方式。', 'Draws fills on the GPU: smoother with many pattern fills and sharp when zoomed. Applies after reopening the canvas; turn off if fills look wrong.'))
			.addToggle((t) => t.setValue(s.glFill).onChange((v) => { s.glFill = v; save(); }));
		new Setting(containerEl).setName(tr('新画布默认背景色', 'Default background for new canvases')).setDesc(tr('默认跟随主题（暗色主题黑底、亮色主题白底）；在画布里选过背景色后会记住上次的选择。', 'Follows the theme by default (dark theme: black, light theme: white). Once you pick a background in a canvas, that choice is remembered.'))
			.addColorPicker((c) => c.setValue(this.plugin.newBackground()).onChange((v) => { s.defaultBackground = v; s.bgChosen = true; save(); }))
			.addExtraButton((b) => b.setIcon('rotate-ccw').setTooltip(tr('恢复跟随主题', 'Follow the theme again')).onClick(() => { s.bgChosen = false; save(); this.display(); }));
	}
}
