import { useMemo, type ReactNode } from 'react'
import katex from 'katex'

/**
 * 公式 ［决策 D3］
 *
 * 静态版用 KaTeX 的 auto-render 扫 DOM 自动渲染；React 版**不能**这么做——
 * auto-render 会直接改 DOM，和 React 的 reconciler 打架（重渲染时节点被换掉、
 * 公式丢失）。这里改成纯渲染：katex.renderToString 出 HTML，交给 React 管。
 *
 * 字号与正文同号（CSS 里 .formula--block .katex 是 1em → 20pt）。
 * KaTeX 内部上下标按数学排版缩到约 0.7em（≈14pt），是字号体系里登记过的白名单例外。
 */
export function Formula({
  children,
  display = false,
  number,
}: {
  /** LaTeX 源码（不含 $ 定界符） */
  children: string
  display?: boolean
  /** 独立公式右侧的编号，如 1 → 渲染成 (1) */
  number?: number | string
}) {
  const html = useMemo(
    () =>
      katex.renderToString(children, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      }),
    [children, display],
  )

  if (!display) {
    return <span className="formula" dangerouslySetInnerHTML={{ __html: html }} />
  }
  return (
    <div className="formula--block">
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {number != null && <span className="formula__no">({number})</span>}
    </div>
  )
}

/** 行内公式的简写：<F>{'\\lambda > 0'}</F> */
export function F({ children }: { children: string }) {
  return <Formula>{children}</Formula>
}

/** 行内代码 ［决策 D2/D4］16pt 辅助档（用户：代码不受 20pt 下限约束） */
export function Code({ children }: { children: ReactNode }) {
  return <code className="code">{children}</code>
}

/**
 * 代码块 ［决策 D2/D4］16pt 辅助档。
 * children 传已高亮的 JSX（.k / .s / .c 三个类见 components.css）；
 * 传纯字符串时按原文输出。
 */
export function Pre({ children }: { children: ReactNode }) {
  return <pre className="pre">{children}</pre>
}
