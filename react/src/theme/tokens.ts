/**
 * 主题常量 —— 与 src/tokens.css 一一对应的 JS 侧镜像
 *
 * 为什么要有这份镜像：CSS 负责"长什么样"，而组件偶尔需要在 JS 里做布局算术
 * （算文本容量、按档位生成目录、判断是否溢出）。这些场景读 var(--fs-*) 很别扭，
 * 所以在 TS 里给一份同源常量。
 *
 * ⚠ 单一真值仍然是 tokens.css。改档位时**两处一起改**，
 *    `pnpm run check:tokens` 会比对两边是否一致（见 scripts/check-tokens.mjs）。
 */

/** 画布：960×540pt = 1280×720px @96dpi = 13.3333×7.5in（与 pptx 的 sldSz 同值） */
export const SLIDE = { w: 960, h: 540 } as const

/** 字号阶梯真值（决策 D4）：16 起、每档 +4，外加 80 展示档。单位 pt。 */
export const LADDER = [16, 20, 24, 28, 32, 36, 40, 44, 48, 80] as const

/** 正文档下限：给人读的内容不得低于此值 */
export const BODY_FLOOR = 20

/** 辅助档（图注/脚注/页码/角标/代码）—— 唯一允许低于 BODY_FLOOR 的档位 */
export const META_SIZE = 16

/** 角色 → 档位。与 tokens.css 的角色别名逐条对应。 */
export const FS = {
  meta: 16,
  code: 16,
  body: 20,
  sub: 24,
  nav: 28,
  title: 32,
  part: 36,
  lead: 40,
  h1: 44,
  badge: 48,
  mega: 80,
} as const

export type FontRole = keyof typeof FS

/** 色板（页面 srgbClr 实测，见 tokens.css 的色板一节） */
export const C = {
  redDeep: '#C00000',
  redTrue: '#C92B2F',
  brick: '#C86142',
  amber: '#E49E3F',
  yellow: '#FFC000',
  cream: '#FDEAC4',
  navy: '#002060',
  ink: '#000000',
  inkSoft: '#0D0D0D',
  gray900: '#404040',
  gray600: '#808080',
  gray500: '#95A5A6',
  gray100: '#F6F6F6',
  blueGray: '#3B5463',
  white: '#FFFFFF',
  hairline: '#595959',
} as const

/** 正文页 chrome 几何（pt）—— 与 tokens.css 的 --chrome-* 同值 */
export const CHROME = {
  titleX: 93.7113,
  titleY: 33.1806,
  titleW: 208.4156,
  titleH: 46.0453,
  logoX: 769.0305,
  logoY: 30.8861,
  logoW: 166.3192,
  logoH: 44.5467,
  barY: 533.625,
  barH: 5.8749,
} as const

/** 页面边距与正文区（pt）—— 与 src/pages.css 的 .doc__body 同值 */
export const LAYOUT = {
  margin: 93.7113,
  bodyTop: 97.5,
  bodyBottom: 88,
  /** 正文区高度 = 540 − 88 − 97.5 = 354.5pt */
  get bodyH() {
    return SLIDE.h - this.bodyBottom - this.bodyTop
  },
  /** 满宽正文区宽度 = 960 − 2×93.7113 = 772.5774pt */
  get bodyW() {
    return SLIDE.w - this.margin * 2
  },
  colGap: 33,
} as const

/** 排版容量估算（用于在 JS 里预判某段文字会不会溢出） */
export function capacityPt(sizePt: number, leading = 1.5) {
  const lineH = sizePt * leading
  const lines = Math.floor(LAYOUT.bodyH / lineH)
  const charsPerLine = Math.floor(LAYOUT.bodyW / sizePt)
  return { lines, charsPerLine, total: lines * charsPerLine, lineH }
}

/** 把数值写成 CSS 长度：pt(93.7113) → '93.7113pt' */
export const pt = (n: number) => `${n}pt`
