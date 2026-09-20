import type { ReactNode } from 'react'
import { Slide } from '../deck/Slide'
import { useDeck } from '../deck/DeckContext'
import { PageBar, PageChrome, Pager } from '../components/Chrome'
import { BG_COVER } from '../theme/assets'
import {
  Band, BandBar, BandLead, BandPart, BandTitle, BandWash,
  Brandmark, CoverBg, CoverVeil, Hairline, Motto, ThanksArc, TocBadge, TocItem,
  TocLogo, TocNum, TocRing, TocStrip, TocVeil, Wordmark, WordmarkSub,
} from '../components/Lockups'

/**
 * 五类关键页的 React 版 —— 与 src/pages/*.html 一一对应。
 * 页面级坐标在 src/pages.css，原子本性在 src/components.css；
 * 这两份 CSS 与静态版共用，所以两版几何不可能漂移。
 */

/* ============================ 封面 ============================ */

export function CoverSlide({
  motto = '精勤求学  敦笃励志  果毅力行  忠恕任事',
  subtitle,
  presenter,
}: {
  /** 四句校训，句间是两个空格（CSS 用 pre-wrap 保住） */
  motto?: string
  subtitle: ReactNode
  presenter: ReactNode
}) {
  return (
    <Slide kind="cover">
      <CoverBg />
      <CoverVeil />
      <Brandmark className="cover__logo" />
      <Motto>{motto}</Motto>
      <div className="cover__subtitle">{subtitle}</div>
      <Hairline className="cover__rule--l" />
      <div className="cover__presenter">{presenter}</div>
      <Hairline className="cover__rule--r" />
    </Slide>
  )
}

/* ============================ 目录 ============================ */

/**
 * 目录页。
 * 条目默认从 <Deck chapters> 读 —— 章节名只声明一处，目录与页码自动跟上；
 * 也可用 items 显式覆盖。
 */
export function TocSlide({ items }: { items?: string[] }) {
  const { chapters } = useDeck()
  const list = (items ?? chapters).slice(0, 4)
  return (
    <Slide kind="toc">
      <TocStrip />
      <TocVeil />
      <TocBadge />
      <TocRing />
      {list.map((_, i) => (
        <TocNum key={'n' + i} n={(i + 1) as 1 | 2 | 3 | 4}>
          {i + 1}
        </TocNum>
      ))}
      {list.map((t, i) => (
        <TocItem key={'t' + i} n={(i + 1) as 1 | 2 | 3 | 4}>
          {t}
        </TocItem>
      ))}
      <TocLogo />
    </Slide>
  )
}

/* ========================= 章节过渡页 ========================= */

export function SectionSlide({
  part,
  title,
  lead,
}: {
  /** 如 '01' → 渲染成「Part  01」（两个空格） */
  part: string
  title: ReactNode
  lead: ReactNode
}) {
  return (
    <Slide kind="section">
      <BandTitle>{title}</BandTitle>
      <BandLead>{lead}</BandLead>
      <Band />
      <BandWash />
      <BandBar />
      <BandPart>{`Part  ${part}`}</BandPart>
    </Slide>
  )
}

/* =========================== 正文页 =========================== */

export function ContentSlide({
  title,
  /** 1 = 单栏满宽（每行 38 字）｜2 = 两栏等宽（每行 18 字） */
  cols = 1,
  /** 主从两栏（1.6 : 1），与 cols 互斥、优先级更高 */
  sidebar = false,
  /** 追加到正文容器的类名（例如放色板网格时给 'swatches'） */
  bodyClassName = '',
  /** 图注：挂在 slide 上（不是正文盒里），否则会把正文盒撑高 */
  figure,
  /** 脚注区：同上 */
  footnotes,
  page,
  total,
  children,
}: {
  title: string
  cols?: 1 | 2
  sidebar?: boolean
  bodyClassName?: string
  figure?: ReactNode
  footnotes?: ReactNode
  page?: number
  total?: number
  children: ReactNode
}) {
  const layout = sidebar ? 'cols--sidebar' : cols === 2 ? 'cols--2' : ''
  const cls = ['doc__body', 'prose', layout, bodyClassName].filter(Boolean).join(' ')
  return (
    <Slide kind="doc" page={page} total={total}>
      <PageChrome title={title} />
      <div className={cls}>{children}</div>
      {figure}
      {footnotes}
      <PageBar />
      <Pager />
    </Slide>
  )
}

/* ============================ 封底 ============================ */

export function ThanksSlide({
  word = 'THANKS',
  sub = '谢谢各位专家',
}: {
  word?: ReactNode
  sub?: ReactNode
}) {
  return (
    <Slide kind="thanks">
      {/* 底图与封面同一张（slide9 图片 4 与 slide1 图片 4 同 rId2），同样纯拉伸 */}
      <img className="thanks-bg" src={BG_COVER} alt="" aria-hidden="true" />
      <CoverVeil />
      <ThanksArc />
      <Wordmark>{word}</Wordmark>
      <WordmarkSub>{sub}</WordmarkSub>
      <Brandmark className="thanks__logo" />
    </Slide>
  )
}
