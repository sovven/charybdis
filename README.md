# 卡律布狄斯 · CHARYBDIS

荷马《奥德赛》第十二卷：奥德修斯的黑船被卷进卡律布狄斯的漩涡。用 Three.js 写的一个小游戏，电脑和手机都能玩。

**在线玩：** https://sovven.github.io/charybdis/ （手机打开会自动进手机版，也可以直接开 [m.html](https://sovven.github.io/charybdis/m.html)）

## 玩法

- **狂点划桨**：点一下划一桨。每一桨都要花体力（按钮外圈），点得太猛会**力竭**，船员要喘口气才能再划，这时候船会被漩涡往里拽。
- 一秒五下左右最稳；连击越高，一桨越有劲（×20 进入「全力」）。
- 电脑：空格 / W / ↑ / J / K 都能划，按住 A D 转向，Esc 暂停，M 静音。
- 手机：右下角狂点「划桨」，左下角按住转向。

三关 + 自由航行：
1. 漩涡边缘：划出火把浮标
2. 落水的兄弟：救起至少 3 名船员
3. 三吞三吐：风暴和漩涡都拉满，她吞水时稳住节奏省体力，吐水时全力冲，至少剩 8 人

语言：中文 / English / 한국어，标题画面或暂停菜单里切换，也可以在网址后面加 `?lang=en` 或 `?lang=ko`。

## 声音

真实录音（CC0，出处见 [sfx/CREDITS.md](sfx/CREDITS.md)）：暴雨、怒海、狂风、漩涡轰鸣、按距离和方向定位的雷声、一船人一起划桨的水声。改音效：`bash tools/make-sfx.sh`（需要 sfx-src/ 里的原始录音和 ffmpeg）。

## 开发

只改 `game-src.html`，然后：

```
node tools/build.mjs
```

生成 `charybdis.html` / `charybdis-mobile.html`、`dist/` 里的电脑版、手机版和离线版（three.js 打包进去），以及 GitHub Pages 用的 `site/`。推到 main 会自动发布 Pages。

见 [CHANGELOG.md](CHANGELOG.md)。
