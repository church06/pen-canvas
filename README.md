# Pen Canvas

An infinite canvas for handwriting in Obsidian, for desktop and Android tablets (S Pen pressure supported).

- **New canvas**: right-click a folder → *New pen canvas*, the ribbon pen icon, or the command *New pen canvas*. Files end in `.pencanvas`.
- **Disc menu** (no toolbar): drag the top (dotted) or bottom handle to move the disc; tap the bottom "···" for settings (canvas background, fit all, left-hand mode).
  - Centre: shows the current tool; tap for *Pan*, tap again for the previous tool.
  - Work keys: *Color / opacity*, *Pen*, *Select / move*, *Eraser* (removes whole strokes), *Fill* (opens the pattern panel), *Shapes*. Select and Eraser go back to the previous tool when tapped again. The Shapes key shows the last shape; tap it again while a shape is active to open the drawer with *Rectangle*, *Ellipse*, *Line* and *Arrow*.
  - Helper keys: *Undo*, *Redo*, *Copy selection*, *Paste*.
  - Outer ring: left arc sets the size, right arc the opacity.
  - *Left-hand mode* mirrors the keys only.
- **Color fan**: 15 hues × 4 shades with hex codes, plus your last 3 custom colors. Drag or scroll to turn it.
- **Fill**: tap inside a closed area; styles *Solid*, *Hatch*, *Crosshatch*, *Dots*, *Stipple* with a density slider. Small gaps (default 5 px) still count as closed.
- **Snapping**: shapes and moved selections snap to other shapes' edges and centres; ellipses/rectangles pause at 1:1, 4:3, 2:1…, lines at multiples of 45°.
- **Touch and keys**: one finger pans, two fingers zoom (with *Draw with pen only*). Mouse: left draws, middle or wheel pans, Ctrl+wheel zooms. Ctrl+Z / Ctrl+Shift+Z, Ctrl+C / X / V, Ctrl+D duplicates, Delete removes the selection.
- **Language** follows Obsidian (Chinese or English) and can be fixed in settings. **Colors** follow Obsidian's light or dark theme.

## Install

From Obsidian: *Settings → Community plugins → Browse*, search for **Pen Canvas**.
Manually: copy `main.js`, `manifest.json` and `styles.css` from the latest release into `<vault>/.obsidian/plugins/pen-canvas/` and enable the plugin.

## File format

`.pencanvas` files are plain JSON (one item per line), so they sync and diff well. Each stroke stores its own rendering settings, so changing the settings never changes old drawings, and a file that cannot be read is opened read-only and never overwritten.

## Development

`npm install`, then `npm run build`. Stroke outlines use [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT).

---

# 中文说明

Obsidian 无限画布 + 手写插件。电脑和安卓平板都能用。

## 安装
把 `main.js`、`manifest.json`、`styles.css` 复制到 vault 的 `.obsidian/plugins/pen-canvas/`，在设置里启用。
（`.obsidian` 文件夹要被 Autosync 同步，平板上才会有这个插件。）

## 用法
- 文件列表右键「新建手写画布」（在该文件夹里建），或左侧功能区「笔」图标、命令「新建手写画布」：新建 `手写画布.pencanvas`。
- 选择工具：点在线条上选中这一个（最上层优先，未填充的形状只在线上才算点中，所以嵌套时能只选外圈），按住直接拖动；Shift+点击加选；在空白处拖框，框碰到元素的线条就选中（只框外圈的一段线就只选外圈）。
- 橡皮：线条和填充分开擦。碰到线条只擦线条，填充保留；在填充内部（离开线条）擦，只擦填充。
- 工具：笔、橡皮（整笔擦除）、框选/移动、平移、矩形、椭圆、直线、箭头。
- 圆盘菜单（参考 Concepts）：没有顶部工具栏，一个可拖动的圆盘。上下两端的手柄拖动可移动圆盘（位置会记住）；上面是 3×2 点阵（拖动用），下面是“···”，轻点打开设置菜单（画布背景、显示全部、左手模式）。中心显示当前工具，点一下切到平移，再点回到上一个工具。中间一圈是 10 个 36° 的扇形按键：紫色工作区从正上方起顺时针是颜色、笔、框选、橡皮、填充（点开图案面板）、形状（正下方，显示上次用的形状，角上的小三角（在工作区那一侧，左手模式在左下）表示里面还有别的形状；形状已选中时再点一次，工作区会像抽屉一样换成矩形、椭圆、直线、箭头四个大键，选完、点中心或点画布自动收回），框选/橡皮再点一次回到上一个工具；青色辅助区居中在左侧，从上到下撤销、重做、复制、粘贴。分三组：工作区、撤销/重做、复制/粘贴，组与组之间留一道缝，组内按键之间不分隔。左手模式只把这一圈左右镜像，圆盘位置和外圈滑条不变。最外圈左弧拖动调粗细，右弧调透明度。点颜色弹出扇形色板（15 列 × 4 档 + 自定义，每格标色号；自定义那一列外面三格是最近用过的 3 个自定义色，没有就空着），色块之间无边框紧挨着；沿扇形拖动（松手后带惯性）或滚轮可以转动。
- 颜色（Obsidian 默认调色板 + 自定义）、透明度（滑条或直接输入百分比）。画笔圆点按钮打开圆环：左弧调粗细，右弧调透明度。
- 复制/粘贴：选中后点菜单里的复制、粘贴按钮，或 Ctrl+C / Ctrl+X / Ctrl+V，Ctrl+D 原地复制一份。可以跨画布粘贴。
- 填充默认用 WebGL（显卡）绘制：图案逐像素计算，放大不糊、大量填充不卡；缩小到图案比像素还细时淡化成平均灰度，避免闪烁。设置里可关闭（改回 Canvas 2D），WebGL 不可用时自动回退。
- 画布背景色（BG，色块选择，记住上次的选择）。没选过时跟随主题：暗色主题黑底白笔，亮色主题白底黑笔。
- 填充（油漆桶）：点封闭区域内部就用当前颜色+透明度填充。多条笔画围成的区域也可以；区域刚好是一个形状的内部时，填充记在形状上，跟着形状移动；否则生成一个独立的填充区域（`polygon`，`size` 为 0）。填充总是画在线条下面。点填充工具会弹出面板：左边是样式图示（实心、斜线、网格线、圆点、电子云），右边是密度 10–100%（实心固定 100%）；存为 `fillStyle` / `fillDensity`。没画闭合的手画笔画，首尾缺口小于笔画大小约 60% 时也当作封闭。区域要在当前屏幕内封闭；线条之间约 5 像素以内的小缺口会被当作封闭（设置里可调）。
- 比例吸附（类似 OneNote）：拖椭圆/矩形时在 1:1（正圆/正方形）、4:3、3:4、2:1、1:2 停一下（每档约 ±10%），旁边显示比例；直线/箭头在 0°/45°/90°… 停一下。
- 对齐吸附：画形状、移动选中内容时吸附到其他形状的边和中线，显示参考线。选中内容后点颜色/粗细/填充会改选中的内容。
- 手指：单指平移，双指缩放（设置「只用笔画画」开着时）。笔画画时手掌触摸被忽略。
- 电脑：鼠标左键画；中键拖动平移；滚轮平移；Ctrl+滚轮 / 触控板捏合缩放。Ctrl+Z / Ctrl+Shift+Z；选中后按 Delete 也能删除（菜单里没有删除按钮，用橡皮）。
- S Pen 侧键按住时临时变橡皮（未在真机验证）。
- 界面语言：默认跟随 Obsidian（中文显示中文，其他语言显示英文），设置里可以固定成中文或英文。
- 亮色/暗色：界面配色跟随 Obsidian 主题自动切换。
- 命令「显示手写输入诊断信息」：查看本机是否支持 desynchronized、getCoalescedEvents、getPredictedEvents，以及上一笔的采样率和压感范围。

## 文件格式
`.pencanvas` 是 JSON，一个元素一行：
```json
{"type":"pen-canvas","version":1,"background":"#ffffff","items":[
{"type":"stroke","id":"…","color":"#1e1e1e","size":3,"fill":null,"thinning":0.6,"smoothing":0.5,"streamline":0.3,"sim":false,"points":[[x,y,压力],…]},
{"type":"rect","id":"…","color":"#1e1e1e","size":3,"fill":"#1e1e1e40","x1":0,"y1":0,"x2":100,"y2":50},
{"type":"arrow","id":"…","color":"#e03131","size":3,"fill":null,"x1":0,"y1":0,"x2":100,"y2":50}
]}
```
形状类型：`rect` `ellipse` `line` `arrow`，以及 `polygon`（`points: [[x,y],…]`，任意多边形）。颜色可以是 `#rrggbbaa`（带透明度）。笔画的渲染参数跟着笔画保存，所以改设置不会改变旧笔画，两台设备显示一致。
文件解析失败时插件不会写回，避免损坏同步中的文件。

## 开发
`npm install`，`npm run build`。笔迹轮廓用 [perfect-freehand](https://github.com/steveruizok/perfect-freehand)（MIT）。
