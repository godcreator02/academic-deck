/**
 * 素材入口 —— 直接引 ../src/assets 里的原文件（与静态版同一份，不复制）。
 * Vite 会把它们按 base:'./' 的相对路径产出到 dist，双击 dist/index.html 也能用。
 */
import logoUrl from '@deck/assets/logo-xjtu.png'
import coverBg from '@deck/assets/bg-cover.jpeg'
import tocBg from '@deck/assets/bg-toc.png'
import sectionBg from '@deck/assets/bg-section.jpg'

/** 校徽/校名区（2935×786，带透明） */
export const LOGO = logoUrl
/** 封面与封底底图（4396×1101，被拉伸使用） */
export const BG_COVER = coverBg
/** 目录页左栏底图（3713×2475，经 srcRect 裁切） */
export const BG_TOC = tocBg
/** 章节页底图（3645×2430，经 srcRect 裁切） */
export const BG_SECTION = sectionBg
