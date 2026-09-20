import type { ReactNode } from 'react'
import { BG_COVER, BG_TOC, BG_SECTION, LOGO } from '../theme/assets'

/**
 * 首尾页与目录页的成组构件 —— 对应 src/components.css 第 4/5/6 节。
 * 所有坐标/尺寸都写在 CSS（pages.css 摆位 + components.css 本性），组件只产类名。
 */

/* ---------- 封面 / 封底 ---------- */

/** 底图 ［临摹］srcRect 空 + fillRect → 纯拉伸，必须 object-fit:fill */
export function CoverBg() {
  return <img className="cover-bg" src={BG_COVER} alt="" aria-hidden="true" />
}

/** 奶黄蒙版 ［临摹］1%#FDEAC4 → 53%白 → 100%白 alpha0 */
export function CoverVeil() {
  return <div className="cover-veil" aria-hidden="true" />
}

/** 校名区 */
export function Brandmark({ className = '' }: { className?: string }) {
  return (
    <img
      className={'brandmark' + (className ? ' ' + className : '')}
      src={LOGO}
      alt="西安交通大学"
    />
  )
}

/** 封面细线 ［临摹］slide1 组合 20 的 cxnSp，#C00000 1pt */
export function Hairline({ className = '' }: { className?: string }) {
  return <span className={'hairline' + (className ? ' ' + className : '')} aria-hidden="true" />
}

/** 封面校训 ［临摹］40pt，字色 θ=45° 渐变 #C00000→#FFC000，两句之间是两个空格 */
export function Motto({ children }: { children: ReactNode }) {
  return <div className="motto cover__motto">{children}</div>
}

/** 封底 THANKS ［临摹］80pt，字色 θ=90° 渐变 #C86142→#E49E3F */
export function Wordmark({ children }: { children: ReactNode }) {
  return <div className="wordmark thanks__word">{children}</div>
}

/** 封底副行 ［临摹］24pt #404040，分散对齐 */
export function WordmarkSub({ children }: { children: ReactNode }) {
  return <div className="wordmark-sub thanks__sub">{children}</div>
}

/**
 * 封底空心弧 ［临摹］slide9「空心弧 11」blockArc
 *   adj1=5502533(91.709°) adj2=1980318(33.005°) adj3=1053 → 环厚 1.639pt
 *   rot=7086271(118.104°) → 缺口落到正左 180.46°
 *   SVG <circle> 自 3 点钟起顺时针铺，故直接把旋转折进 dasharray：
 *     周长 2π×77.0139 = 483.89；起笔先画 0°→151.104° = 203.11；缺口 78.90
 *   外圈 0.25pt 细描边用「画宽 = 环厚 + 线宽」表示
 */
export function ThanksArc() {
  return (
    <svg className="thanks__arc" viewBox="0 0 155.6667 155.6667" aria-hidden="true">
      <circle
        cx="77.8334" cy="77.8334" r="77.0139" fill="none"
        stroke="#595959" strokeWidth="1.889" strokeDasharray="203.11 78.90"
      />
      <circle
        cx="77.8334" cy="77.8334" r="77.0139" fill="none"
        stroke="#E49E3F" strokeWidth="1.639" strokeDasharray="203.11 78.90"
      />
    </svg>
  )
}

/* ---------- 目录页 ---------- */

/**
 * 左栏底图 ［临摹］slideLayout3 图片 2，srcRect l=35450 r=28977
 * 容器 overflow:hidden 复刻图片框；整图 810×540pt、左移 287.145pt。
 * 不能用 object-fit：cover 只能居中裁，复刻不出指定裁切框。
 */
export function TocStrip() {
  return (
    <div className="toc__strip">
      <img src={BG_TOC} alt="" aria-hidden="true" />
    </div>
  )
}

/** 左栏蒙版 ［临摹］0%#FDEAC4 → 15%白 → 100%白 alpha0 */
export function TocVeil() {
  return <div className="toc__veil" aria-hidden="true" />
}

/** 「目录」徽标 ［临摹］slideLayout3 椭圆 5，48pt #C00000 */
export function TocBadge({ children = '目录' }: { children?: ReactNode }) {
  return <div className="toc-badge toc__badge">{children}</div>
}

/** 金环 ［临摹］椭圆 6，noFill + 4.5pt 渐变描边（θ=225°），路径半径 = 边长/2 */
export function TocRing() {
  return (
    <svg className="toc-ring toc__ring" viewBox="0 0 186.603 181.2571" aria-hidden="true">
      <defs>
        <linearGradient id="tocRingGrad" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFC000" />
          <stop offset="100%" stopColor="#C00000" />
        </linearGradient>
      </defs>
      <ellipse
        cx="93.3015" cy="90.62855" rx="93.3015" ry="90.62855"
        fill="none" stroke="url(#tocRingGrad)" strokeWidth="4.5"
      />
    </svg>
  )
}

/** 目录条目胶囊 ［临摹］slide2 KSO_Shape，28pt，圆角 23.0227pt */
export function TocItem({ n, children }: { n: 1 | 2 | 3 | 4; children: ReactNode }) {
  return <div className={`toc-item toc__item--${n}`}>{children}</div>
}

/** 目录序号圆 ［临摹］slide2 椭圆 18/20/22/24，Ø37.4694pt，24pt 白字 */
export function TocNum({ n, children }: { n: 1 | 2 | 3 | 4; children: ReactNode }) {
  return <div className={`toc-num toc__num--${n}`}>{children}</div>
}

/** 目录页右上校徽（版式里那份被本页那份完全压住，实测未复刻） */
export function TocLogo() {
  return <Brandmark className="toc__logo" />
}

/* ---------- 章节过渡页 ---------- */

/**
 * 图片带 ［临摹］slide3 组合 8 的 图片 7，srcRect t=20623 b=35306
 * 容器 overflow:hidden；整图 862×559.32pt、上移 115.32pt。
 */
export function Band() {
  return (
    <div className="band">
      <img className="band__img" src={BG_SECTION} alt="" aria-hidden="true" />
    </div>
  )
}

/**
 * 橙色蒙版 ［临摹］矩形 2，θ=90°，1%#E49E3F → 40%白 α54% → 100%α0
 * 拆成「不透明颜色层 + mask alpha 层」以对齐 PowerPoint 的直乘 alpha 插值
 * （CSS 默认预乘，异色异 alpha 段会差 Δ≈35/765）。
 */
export function BandWash() {
  return <div className="band__wash" aria-hidden="true" />
}

/** Part 渐变条 ［临摹］i$lîdé，θ=315° → CSS 6.18deg，#C00000 → #E49E3F */
export function BandBar() {
  return <div className="band__bar" aria-hidden="true" />
}

/** Part 文字 ［临摹］36pt Arial Black 白 + 45° 外阴影；原文两个空格靠 pre-wrap 保住 */
export function BandPart({ children }: { children: ReactNode }) {
  return <div className="band__part">{children}</div>
}

/** 章节大标题 ［临摹］矩形 4，44pt 右对齐、垂直居中 */
export function BandTitle({ children }: { children: ReactNode }) {
  return <div className="band__title">{children}</div>
}

/** 章节说明 ［临摹］标题 1，源 12pt；［决策 D4］正文档下限提到 20pt */
export function BandLead({ children }: { children: ReactNode }) {
  return <div className="band__lead">{children}</div>
}
