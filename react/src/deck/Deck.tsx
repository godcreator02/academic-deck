import { Children, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DeckContext, SlideIndexContext } from './DeckContext'
import { useFitScale } from './useFitScale'

interface DeckProps {
  /** 章节名：目录页与页码从这里读，不必手写两遍（用户选的 <Deck chapters> 方案） */
  chapters?: string[]
  /** 起始页（1 起），默认读 location.hash */
  initial?: number
  children: ReactNode
}

const readHash = (total: number, fallback: number) => {
  const m = /^#(\d+)$/.exec(window.location.hash)
  if (!m) return fallback
  return Math.max(0, Math.min(total - 1, parseInt(m[1], 10) - 1))
}

/**
 * <Deck> —— 演示运行时：舞台缩放、键盘翻页、页码、全屏、hash 路由。
 *
 * 与静态版 deck.js 行为一致（同样的键位与 hash 约定），但页码改成声明式：
 * 每页的 <Pager> 从 SlideIndexContext 拿自己的序号，不再靠 JS 事后填 DOM。
 * 因此打印时每一页的页码天然正确。
 */
export function Deck({ chapters = [], initial = 0, children }: DeckProps) {
  const items = useMemo(() => Children.toArray(children), [children])
  const total = items.length

  const stageRef = useRef<HTMLDivElement>(null)
  useFitScale(stageRef)

  const [cur, setCur] = useState(() => readHash(total, initial))

  const show = useCallback(
    (n: number) => {
      const next = Math.max(0, Math.min(total - 1, n))
      setCur(next)
      if (window.history.replaceState) window.history.replaceState(null, '', '#' + (next + 1))
    },
    [total],
  )
  const next = useCallback(() => show(cur + 1), [cur, show])
  const prev = useCallback(() => show(cur - 1), [cur, show])

  /* 键盘：← → ↑ ↓ 空格 PgUp PgDn Home End 翻页；F 全屏 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key
      if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') {
        e.preventDefault(); show(cur + 1)
      } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
        e.preventDefault(); show(cur - 1)
      } else if (k === 'Home') {
        e.preventDefault(); show(0)
      } else if (k === 'End') {
        e.preventDefault(); show(total - 1)
      } else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cur, show, total])

  /* 地址栏直接改 #n 也能跳（同文档导航不会重跑脚本） */
  useEffect(() => {
    const onHash = () => setCur(readHash(total, 0))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [total])

  const value = useMemo(
    () => ({ cur, total, chapters, show, next, prev }),
    [cur, total, chapters, show, next, prev],
  )

  return (
    <>
      <div
        className="stage"
        ref={stageRef}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) return
          if (e.clientX < window.innerWidth / 2) prev()
          else next()
        }}
      >
        <DeckContext.Provider value={value}>
          {items.map((child, i) => (
            <SlideIndexContext.Provider key={i} value={{ index: i, total }}>
              {child}
            </SlideIndexContext.Provider>
          ))}
        </DeckContext.Provider>
      </div>
      <div className="hud">
        {cur + 1}
        <span className="hud__sep">/</span>
        {total}
      </div>
    </>
  )
}
