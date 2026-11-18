import { App, Plugin, PluginSettingTab, Setting, TFolder, normalizePath } from 'obsidian';
import { DARK_BG, EXT, PenCanvasView, VIEW_TYPE } from './view';
import { DEFAULT_SETTINGS, PenSettings } from './types';
import { emptyDoc, serialize } from './geometry';

const ZH = (window.localStorage.getItem('language') ?? '').startsWith('zh');
const NEW_LABEL = ZH ? '新建手写画布' : 'New handwriting canvas';

export default class PenCanvasPlugin extends Plugin {
	settings: PenSettings = { ...DEFAULT_SETTINGS };

	async onload(): Promise<void> {
		await this.loadSettings();
		this.registerView(VIEW_TYPE, (leaf) => new PenCanvasView(leaf, this));
		this.registerExtensions([EXT], VIEW_TYPE);
		this.addRibbonIcon('pen-tool', NEW_LABEL, () => { void this.createCanvas(); });
		this.addCommand({ id: 'new-canvas', name: NEW_LABEL, callback: () => { void this.createCanvas(); } });
		this.addCommand({
			id: 'diagnostics',
			name: '显示手写输入诊断信息',
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
				menu.addItem((item) => item.setTitle(NEW_LABEL).setIcon('pen-tool')
					.onClick(() => { void this.createCanvas(folder); }));
			} catch (e) {
				console.error('[pen-canvas] file-menu handler failed', e);
			}
		}));
		this.addSettingTab(new PenCanvasSettingTab(this.app, this));
		console.log(`[pen-canvas] ${this.manifest.version} loaded`);
	}

	async createCanvas(folder?: TFolder): Promise<void> {
		const active = this.app.workspace.getActiveFile();
		const parent = folder ?? this.app.fileManager.getNewFileParent(active?.path ?? '');
		const dir = parent.isRoot() ? '' : parent.path + '/';
		let path = '';
		for (let i = 0; ; i++) {
			path = normalizePath(`${dir}手写画布${i ? ' ' + i : ''}.${EXT}`);
			if (!this.app.vault.getAbstractFileByPath(path)) break;
		}
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
		return document.body.classList.contains('theme-dark') ? DARK_BG : '#ffffff';
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
		containerEl.createEl('p', { text: '笔迹参数只影响之后画的新笔画；旧笔画按各自保存的参数渲染，所以在电脑和平板上看起来一致。' });

		new Setting(containerEl).setName('左手模式').setDesc('菜单换到右侧。也可以点圆盘上的左手按钮切换，选择会被记住。')
			.addToggle((t) => t.setValue(s.leftHand).onChange((v) => { void this.plugin.setLeftHand(v); }));
		new Setting(containerEl).setName('只用笔画画').setDesc('开启后手指只用来平移/缩放，笔才画画（防误触）。')
			.addToggle((t) => t.setValue(s.penOnly).onChange((v) => { s.penOnly = v; save(); }));
		new Setting(containerEl).setName('压感变细程度 (thinning)').setDesc('0 = 不受压力影响，1 = 变化最大。')
			.addSlider((sl) => sl.setLimits(0, 1, 0.05).setValue(s.thinning).setDynamicTooltip().onChange((v) => { s.thinning = v; save(); }));
		new Setting(containerEl).setName('压感曲线').setDesc('<1 轻压就粗，>1 要用力才粗。')
			.addSlider((sl) => sl.setLimits(0.3, 2.5, 0.05).setValue(s.pressureGamma).setDynamicTooltip().onChange((v) => { s.pressureGamma = v; save(); }));
		new Setting(containerEl).setName('轮廓平滑 (smoothing)')
			.addSlider((sl) => sl.setLimits(0, 1, 0.05).setValue(s.smoothing).setDynamicTooltip().onChange((v) => { s.smoothing = v; save(); }));
		new Setting(containerEl).setName('防抖 (streamline)').setDesc('越大越顺，但笔迹会更明显地落后笔尖。')
			.addSlider((sl) => sl.setLimits(0, 0.9, 0.05).setValue(s.streamline).setDynamicTooltip().onChange((v) => { s.streamline = v; save(); }));
		new Setting(containerEl).setName('笔尖预测').setDesc('用 getPredictedEvents 提前画一小段，减少视觉延迟；抬笔后预测部分被丢弃。')
			.addToggle((t) => t.setValue(s.prediction).onChange((v) => { s.prediction = v; save(); }));
		new Setting(containerEl).setName('低延迟画布 (desynchronized)').setDesc('重新打开画布后生效。若出现撕裂或闪烁可关闭。')
			.addToggle((t) => t.setValue(s.desynchronized).onChange((v) => { s.desynchronized = v; save(); }));
		new Setting(containerEl).setName('对齐吸附').setDesc('画形状、移动选中内容时，吸附到其他形状的边和中线并显示参考线（手写笔画不参与）。拖椭圆/矩形时会在 1:1、4:3、2:1 等比例停一下，直线/箭头在 45° 倍数停一下。')
			.addToggle((t) => t.setValue(s.snap).onChange((v) => { s.snap = v; save(); }));
		new Setting(containerEl).setName('填充封口间隙（像素）').setDesc('线条之间小于这个距离的缺口，填充时当作封闭。0 = 必须完全封口。')
			.addSlider((sl) => sl.setLimits(0, 20, 1).setValue(s.fillGap).setDynamicTooltip().onChange((v) => { s.fillGap = v; save(); }));
		new Setting(containerEl).setName('GPU 渲染填充 (WebGL)').setDesc('填充用显卡绘制，大量图案填充时更流畅、放大不糊。重新打开画布后生效；若显示异常可关闭，改回原来的方式。')
			.addToggle((t) => t.setValue(s.glFill).onChange((v) => { s.glFill = v; save(); }));
		new Setting(containerEl).setName('新画布默认背景色').setDesc('默认跟随主题（暗色主题黑底、亮色主题白底）；在画布里选过背景色后会记住上次的选择。')
			.addColorPicker((c) => c.setValue(this.plugin.newBackground()).onChange((v) => { s.defaultBackground = v; s.bgChosen = true; save(); }))
			.addExtraButton((b) => b.setIcon('rotate-ccw').setTooltip('恢复跟随主题').onClick(() => { s.bgChosen = false; save(); this.display(); }));
	}
}
