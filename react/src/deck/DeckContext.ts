import { createContext, useContext } from 'react'

/** Deck 级状态：当前页、总页数、章节目录，以及翻页动作 */
export interface DeckState {
  /** 当前页序号，从 0 起 */
  cur: number
  total: number
  /** 目录页与 <Deck chapters> 共享的章节名 */
  chapters: string[]
  show: (n: number) => void
  next: () => void
  prev: () => void
}

/** 每页自己的序号：由 Deck 用 Children.map 注入，避免组件去数 DOM */
export interface SlideIndex {
  index: number
  total: number
}

export const DeckContext = createContext<DeckState | null>(null)
export const SlideIndexContext = createContext<SlideIndex>({ index: 0, total: 1 })

export function useDeck(): DeckState {
  const v = useContext(DeckContext)
  if (!v) throw new Error('useDeck 必须在 <Deck> 内使用')
  return v
}

export function useSlideIndex(): SlideIndex {
  return useContext(SlideIndexContext)
}
