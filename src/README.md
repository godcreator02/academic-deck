# 学术风网页演示模板

纯 HTML + CSS + 少量 JS 的翻页演示模板，零构建。浏览器直接打开、打印导出 PDF。
视觉风格来自 `source/2025redyellownew.pptx`（西交大红黄学术答辩模板），**逐页临摹**后反提
设计令牌与组件库——先照抄，后总结。另有一套 React 组件层（见下），两版共用同一份 CSS。

## 怎么用

```
双击 src/demo.html                 # 看效果（它本身就是模板的视觉规范）
复制 src/ 到你自己的目录           # 新建一份演示（零构建，含 assets/）
```

React 版要先构建一次（构建产物不入仓）：`cd react && pnpm install && pnpm build`，
之后 `react/dist/index.html` 同样可双击打开。

- 翻页：`← →` / `↑ ↓` / `空格` / `PgUp PgDn` / `Home End`；`F` 全屏；点画面右半下一页、左半上一页。
- 导出 PDF：浏览器打印 → 目标「另存为 PDF」、纸张「横向」、边距「无」、勾选「背景图形」。
  `@page` 已把尺寸锁成 960×540pt（= 13.333×7.5in = 1280×720px），一页一 slide，不会裂页。

## 单位：一律 pt

pt 是 pptx 的原生单位，所以代码里的数字与 PowerPoint 属性栏**逐字一致**，不用过换算：

| 量 | 源文件存的 | 换算 | CSS 里写 |
|---|---|---|---|
| 画布 | `p:sldSz cx=12192000 cy=6858000` EMU | ÷12700 | `960pt × 540pt` |
| 字号 | `a:rPr/@sz="3200"`（1/100 pt） | ÷100 | `32pt` |
| 位置尺寸 | `a:off/@x`、`a:ext/@cx` EMU | ÷12700 | `93.7113pt` |
| 线宽 | `a:ln/@w` EMU | ÷12700 | `1pt` / `4.5pt` |
| 阴影 | `a:outerShdw/@dist\|@blurRad` EMU | ÷12700 | `0 3pt 4pt` |

`960×540pt ≡ 1280×720px ≡ 13.3333×7.5in` —— 三者是同一条边。选 pt 是因为它才是文件里的数：
`1280` 只出现在渲染结果里，文件里没有这个值。

⚠ 组合内形状的 `a:xfrm` 是**子坐标系**（chOff ≠ off），不能直接取 raw 值。
例：封底 THANKS 的 raw `x=281.6667pt`，真实位置是 `278.6667pt`（差 4px）。
本仓几何值取自 `work/dump-pt.ps1`（已做组合变换还原）。

## 字号体系（决策 D4）

```
16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 48        ← 等差 +4，九档
80                                                 ← 展示档（THANKS）
```

这十个值**每一个都能在源文件里找到出处**（16 序号块 / 20 条内文字 / 24 目录序号 /
28 目录条目 / 32 页题 / 36 Part 01 / 40 封面校训 / 44 章节大标题 / 48 目录徽标 / 80 THANKS）。
阶梯不是新造的：源文件里本来就有一条 +4 主阶梯，这里是把它往下接一档、再把挤在 12–18 的杂档收掉。

| 令牌 | pt | 谁用它 |
|---|---|---|
| `--fs-meta` / `--fs-code` | **16** | 图注、脚注、页码、脚注角标、代码 —— 唯一允许低于 20 的档 |
| `--fs-body` | **20** | 正文段落、列表、表格、卡片与要点正文、封面副标题与汇报人、章节页说明 |
| `--fs-sub` | 24 | 小节题 h3、「谢谢各位专家」 |
| `--fs-nav` / `--fs-title` / `--fs-part` | 28 / 32 / 36 | 目录条目 / 页题 / 章节 Part 01 |
| `--fs-lead` / `--fs-h1` / `--fs-badge` / `--fs-mega` | 40 / 44 / 48 / 80 | 校训 / 章节大标题 / 目录徽标 / THANKS |

三条规则：

1. **给人读的 ≥20pt**；给内容做注的元信息（图注/脚注/页码/角标）与代码走 16pt 辅助档。
2. **密度靠行距、内边距、分页调，不靠缩字号。**
3. **低于 20pt 的值只允许 16pt** —— 13.6pt / 18.4pt 这类非在册值都是 bug。

源值 **12 / 14 / 18 在本模板退役**。唯一白名单例外是 KaTeX 内部上下标（数学排版缩到约 0.7em）。

`work/audit-fonts.ps1` 会把这三条规则跑成检查：扫全仓 `font-size`，报裸值、报非在册值、报低于 20 的正文。

### 20pt 的容量账

正文区 772.5774×354.5pt，行距按源值 1.5（30pt 行高）→ 每页 11 行：

| 版式 | 每行字数 | 单页容量 | 适合 |
|---|---|---|---|
| 单栏满宽 | **38 字** | ~418 字 | 长段落、公式推导、代码块 |
| 两栏等宽 | **18 字** | ~396 字（行距 1.6 时 ~363） | 并列对比、要点清单、术语表 |

**栏数不改变总容量**（容量 ∝ 面积 ÷ 字号²），只改变每行字数。用户口径：两种都常用，故
组件里不设默认——单栏直接用 `.prose`，两栏用 `.cols--2`，主从用 `.cols--sidebar`。

源模板实测 147–241 字/页，20pt 下有 2–3 倍余量，所以"讲义密度"其实还在，只是不能再往里堆字。

## 文件

| 路径 | 作用 |
|---|---|
| `tokens.css` | 设计令牌：色板、字号阶梯与角色别名、chrome 几何、阴影、渐变 |
| `deck.css` | 演示外壳：舞台缩放、翻页容器、`@page` 打印规则 |
| `components.css` | 原子：页眉/页码/渐变条/目录/章节页/定理框/要点条/icon 块/图注/脚注/公式/代码/表格/分栏 |
| `pages.css` | 五类关键页的**布局层单源**——静态版与 React 版共用，几何不可能漂移 |
| `pages/*.html` | 五类关键页的临摹稿（各自可单独打开、单独打印） |
| `deck.js` | 键盘翻页、页码、全屏、舞台自适应缩放、KaTeX 挂载（零依赖） |
| `demo.html` | 自指 style-guide：模板做出来的第一份演示就是它自己的视觉规范 |
| `assets/` | 从 pptx 原样取出的 4 张位图 + 本地内置的 KaTeX（548KB） |

## React 组件层（`react/`）

```bash
cd react
pnpm install
pnpm dev            # 开发态
pnpm build          # 类型检查 + 构建到 dist/
pnpm check:tokens   # 校验 TS 常量与 tokens.css 未分叉
```

**关键约定：React 工程不复制任何设计资产。** `tokens.css / deck.css / components.css /
pages.css / assets/` 都住在 `../src`，通过 Vite alias `@deck` 引用。因此两版几何只可能有一个真值。

```
react/src/
  theme/tokens.ts     与 tokens.css 一一对应的 JS 镜像（画布/阶梯/色板/chrome/容量估算）
  theme/assets.ts     素材入口
  deck/               <Deck>（舞台+键盘+hash+HUD）、<Slide>、DeckContext、useFitScale
  components/         Chrome（页眉/页码/渐变条）、Lockups（首尾页/目录/章节页构件）、Text、Formula
  slides/             CoverSlide / TocSlide / SectionSlide / ContentSlide / ThanksSlide
  demo/StyleGuide.tsx 自指规范 deck（与 src/demo.html 同内容）
```

组件 API 要点：

- 章节名只声明一处：`<Deck chapters={[...]}>`，`<TocSlide/>` 自动渲染目录；
- 页码声明式：`<Pager/>` 从 `SlideIndexContext` 读自己的序号，**打印时每页天然正确**；
- 版式靠 props：`<ContentSlide title="…" cols={2}>` / `sidebar` / `figure` / `footnotes`；
- 公式用组件而非 auto-render：`<Formula display number={1}>{'\\hat{f}=…'}</Formula>`。
  静态版用 KaTeX auto-render 没问题（那边没有组件层），但 React 里 auto-render 会直接改 DOM、
  和 reconciler 打架，所以改成 `katex.renderToString` 纯渲染。

### 两个坑（都已修，别再踩）

1. **file:// 下 ES module 会被 CORS 拦掉**，React 产物双击后是白屏（实测打印出来只有 1 页 Letter 白纸）。
   解法：`vite.config.ts` 里把入口打成 **IIFE 经典脚本**（`output.format='iife'` + 一个把
   `<script type="module">` 换掉的插件）。
2. **经典脚本必须补 `defer`**：module 脚本自带 defer 才没这个问题，去掉 type=module 后
   它会在 `<head>` 里抢在 `<div id="root">` 之前执行，报「找不到 #root」。

## 三条已拍板的决策 + 两条后补

- **D1 主红不区分主次**：`#C00000` 与 `#C92B2F` 并存，各沿用源模板用法。
- **D2 正文与西文固定微软雅黑**；代码走常见等宽栈；Arial Black / Tahoma 装饰位系统自带，照抄保留。
- **D3 带 KaTeX，含自动渲染，且本地内置**（不引 CDN）。
- **D4 字号体系**：16 起 +4 阶梯，正文下限 20pt，辅助档 16pt。见上。
- **D5 验收分家**：几何/色/图/形状仍与 PPT 逐项数值对齐；**文字字号按 D4 自检，不再与 PPT 对齐**
  （这是 D4 带来的有意偏离，不记为回归失败）。

## 令牌来源约定

注释里逐条标明：`［临摹］` = 照抄 pptx 原值；`［决策］` = 拍板的口味/体系决定。
想知道某个数为什么是那个值，看注释里的 XML 原值即可。

## 从 OOXML 搬到 CSS 的四个坑（都有实测依据）

1. **`a:lin/@ang` 带 `scaled="1"` 时不是视觉角度**。实测拟合出的规律是
   `CSS角 = atan2(h·cosθ, −w·sinθ)`。三处独立验证：封面校训 176.02° vs 拟合 176.10°、
   章节页 Part 条 6.18° vs 6.18°、封底 THANKS 180° vs 179.73°。
   轴对齐角度用该公式仍得 90/180/270/0°，所以只有非轴角会被坑到——直接写 `45deg` 会明显错。
2. **`ln` 的 `algn="ctr"` 表示描边骑在几何边界上、向外溢出半个线宽**。目录页金环是
   `w=57150`(4.5pt)，所以 SVG 路径半径是 `边长/2` 而不是 `(边长−4.5)/2`；并且 SVG 的
   `viewBox` 必须与元素框 1:1，否则 `preserveAspectRatio` 会把整个环缩小。
3. **底图常常是裁切不是拉伸**。看 `blipFill/srcRect`：章节页底图上下裁掉 20.6%/35.3%，
   目录左栏底图左右裁掉 35.5%/29.0%（后者裁完恰好零变形）。复刻办法是
   「容器 `overflow:hidden` + 整图放大偏移」。只有封面/封底那张是真空拉伸
   （`srcRect` 空 + `fillRect`），必须用 `object-fit: fill`。
4. **CSS 渐变默认在预乘 alpha 空间插值，PowerPoint 按直乘**。异色 + 异 alpha 的段会差出
   Δ≈35/765。解法是拆成「不透明颜色层 + `mask-image` alpha 层」。

另外：底部渐变条实测在垂直方向**零变化**（纯一维），且色标曲线不属任何常见插值空间，
故按实测剖面写密色标（`--g-bar`），现状与 PPT 逐点 Δ=0。

## 已知残留 / 第二遍待办

- `assets/bg-toc.png` 11.6MB（源模板市场通病），显示尺寸只有 288×540pt，可无损降到几百 KB；
  这是体积瘦身的头号目标（React 版 PDF 16.4MB 主要就是它）。
- PowerPoint 与 Chrome 的**降采样核不同**，位图细节处（建筑、树叶）会有 Δ≈15–40 的像素差；
  平滑处 Δ≤4。按「肉眼对齐」验收，不做逐像素 diff。
- 字体度量差导致文字上下有 1–2px 偏移（跨字体不可避免）。
- 目录页版式里另有一份校徽被本页那份完全压住，实测墨迹完全一致，故未复刻。
- `.cover__subtitle` 在 20pt 下每行约 19 字，副标题超长会折行且末行被 justify 拉开——
  用之前先数一下字数。
