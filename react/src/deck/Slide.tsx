import type { ReactNode } from 'react'
import { useDeck, useSlideIndex } from './DeckContext'

/** 页型：决定用哪套页面级布局类（见 src/pages.css） */
export type SlideKind = 'cover' | 'toc' | 'section' | 'doc' | 'thanks'

interface SlideProps {
  kind: SlideKind
  children: ReactNode
  /** 额外类名，接页内布局类（如 doc__body / toc__item--1） */
  className?: string
  /** 页码覆盖：单页稿想固定成源模板里的 4/9 时可以给 */
  page?: number
  total?: number
}

/**
 * <Slide> —— 一页容器。
 * 只负责：套 inset:0 的画布盒、按当前页切换 is-active、把页码数据落到 data-*。
 * 几何一律交给 pages.css / components.css（与静态版同一份 CSS）。
 */
export function Slide({ kind, children, className = '', page, total }: SlideProps) {
  const { cur } = useDeck()
  const idx = useSlideIndex()
  const active = idx.index === cur
  return (
    <section
      className={`slide ${kind}${active ? ' is-active' : ''}${className ? ' ' + className : ''}`}
      data-page={page ?? idx.index + 1}
      data-total={total ?? idx.total}
      aria-hidden={!active}
    >
      {children}
    </section>
  )
}
