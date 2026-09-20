import { useSlideIndex } from '../deck/DeckContext'
import { LOGO } from '../theme/assets'

/**
 * 正文页 chrome 四件套 —— 与 src/components.css 的第 1/2/3 节逐条对应。
 * 组件只产出类名，几何/颜色/字号仍在 CSS 里（单源）。
 */

/** 双箭头：红压黄。［临摹］slideLayout7 燕尾形 6/1，尖深 = min(w,h)×0.5 */
export function Chevrons() {
  return (
    <>
      <span className="chev chev--yellow" aria-hidden="true" />
      <span className="chev chev--red" aria-hidden="true" />
    </>
  )
}

/** 页题 ［临摹］slide4–8 矩形 41，32pt 微软雅黑，左内缩 7.2pt */
export function PageHead({ title }: { title: string }) {
  return <div className="page-head">{title}</div>
}

/** 右上校徽 ［临摹］slideLayout7 Picture 2 */
export function PageLogo() {
  return <img className="page-logo" src={LOGO} alt="西安交通大学" />
}

/** 底部渐变条 ［临摹］slideLayout7 矩形 3，径向 #C00000 → #FFC000 */
export function PageBar() {
  return <div className="page-bar" aria-hidden="true" />
}

/**
 * 页码 ［提炼］
 * 序号从 SlideIndexContext 读（声明式），所以打印时每页都对。
 * 字号 16pt 辅助档（D4：元信息允许低于 20）。
 */
export function Pager() {
  const { index, total } = useSlideIndex()
  return (
    <div className="pager">
      <span className="pager__cur">{index + 1}</span>
      <span className="pager__sep">/</span>
      <span className="pager__total">{total}</span>
    </div>
  )
}

/** 正文页 chrome 组合：双箭头 + 页题 + 校徽（底部渐变条与页码由页面按层叠顺序补） */
export function PageChrome({ title }: { title: string }) {
  return (
    <>
      <Chevrons />
      <PageHead title={title} />
      <PageLogo />
    </>
  )
}
