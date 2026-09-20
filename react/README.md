# react/ — 学术风演示模板的 React 组件层

与 `../src` 的静态版**并行**存在，不是替代：静态版是零依赖、双击即开的交付物，
这里是组件级编写方式。两版**共用同一套 CSS**（`../src/tokens.css`、`deck.css`、
`components.css`、`pages.css`）与同一批素材（`../src/assets`），所以几何与字号只有一个真值。

```bash
pnpm install
pnpm dev            # 开发态（Vite，开放了 ../ 的 fs 白名单以便读共享 CSS）
pnpm build          # 类型检查 + 构建到 dist/（IIFE 经典脚本，dist 可双击打开）
pnpm preview        # 预览构建产物
pnpm check:tokens   # 校验 TS 常量与 tokens.css 未分叉
```

## 目录

```
src/
  theme/tokens.ts      与 tokens.css 一一对应的 JS 镜像（画布/字号阶梯/色板/chrome/容量估算）
  theme/assets.ts      素材入口（引 @deck/assets/*）
  deck/                DeckContext、useFitScale、Deck、Slide
  components/          Chrome、Lockups、Text、Formula
  slides/index.tsx     CoverSlide / TocSlide / SectionSlide / ContentSlide / ThanksSlide
  demo/StyleGuide.tsx  自指视觉规范 deck（与 ../src/demo.html 同内容）
```

## 用法

```tsx
import { Deck } from './deck/Deck'
import { CoverSlide, TocSlide, SectionSlide, ContentSlide, ThanksSlide } from './slides'
import { Box, Point, Points, FigCap } from './components/Text'
import { Formula } from './components/Formula'

<Deck chapters={['色彩与用色', '字号体系', '版式与组件', '公式与代码']}>
  <CoverSlide subtitle="…" presenter="…" />
  <TocSlide />                                  {/* 条目自动来自 chapters */}
  <SectionSlide part="01" title="色彩与用色" lead="…" />
  <ContentSlide title="色板" figure={<FigCap no="图 1">…</FigCap>}>
    …单栏内容…
  </ContentSlide>
  <ContentSlide title="对比" cols={2}>…两栏内容…</ContentSlide>
  <ContentSlide title="公式" sidebar>
    <Formula display number={1}>{'\\hat{f}=\\arg\\min_{f\\in\\mathcal{H}}…'}</Formula>
  </ContentSlide>
  <ThanksSlide />
</Deck>
```

- **章节名只声明一处**：`<Deck chapters>`，目录页与页码自动跟上。
- **页码声明式**：`<Pager/>` 从 `SlideIndexContext` 读自己的序号，打印时每页天然正确；
  单页稿想固定成源模板里的 4/9，用 `<Slide page={4} total={9}>`（`ContentSlide` 也透传）。
- **版式靠 props**：`cols={1|2}`、`sidebar`、`bodyClassName`、`figure`、`footnotes`。
  `figure` / `footnotes` 挂在 slide 上而不是正文盒里——放进正文盒会把盒高撑破。

## 样式：不复制，只引用

`src/main.tsx` 按与静态版 `<link>` 相同的顺序引入共享 CSS：

```ts
import '@deck/tokens.css'
import '@deck/deck.css'
import '@deck/components.css'
import '@deck/pages.css'
import 'katex/dist/katex.min.css'
```

组件只产出**与静态版完全相同的类名**，几何/颜色/字号仍在 CSS 里。
所以改设计只需动 CSS，两版同步生效；`pnpm check:tokens` 则看住 TS 侧那份镜像。

## 两个必须知道的坑

1. **file:// 下 ES module 会被 CORS 拦掉** —— React 产物双击后白屏（实测打印只有 1 页 Letter 白纸）。
   `vite.config.ts` 里用 `output.format='iife'` + 一个插件把 `<script type="module">` 换成经典脚本。
2. **经典脚本要补 `defer`** —— module 自带 defer，换成经典脚本后它会在 `<head>` 里抢在
   `<div id="root">` 之前执行，报「找不到 #root」。

改 `vite.config.ts` 时这两条别丢，丢了 dist 就不能双击打开了。
