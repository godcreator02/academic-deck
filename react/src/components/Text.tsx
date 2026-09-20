import type { ReactNode } from 'react'

/**
 * 正文原子 —— 对应 src/components.css 第 7/8/9 节。
 * 全部走类名，几何/字号在 CSS 里；这些组件只负责「结构 + 变体」。
 */

/** 正文基元：20pt / 行距 1.5（D4 正文档下限） */
export function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className ? 'prose ' + className : 'prose'}>{children}</div>
}

/**
 * 分栏容器。用户 2026-09-20：单栏与两栏「两种都常用」，不设默认、两者同为一等公民。
 *   单栏 → 不包容器，直接用 .prose（每行 38 字）
 *   两栏 → .cols--2（每行 18 字，行距放松到 1.6）
 *   主从 → .cols--sidebar（1.6 : 1）
 */
export function Cols({
  variant = 2,
  sidebar = false,
  children,
}: {
  variant?: 2 | 3
  sidebar?: boolean
  children: ReactNode
}) {
  const cls = sidebar ? 'cols--sidebar' : `cols--${variant}`
  return <div className={`doc__body ${cls} prose`}>{children}</div>
}

/** 定理/定义/引理框 ［提炼］彩条宽 2.85pt 取自 slide7 两条色条的实测值 */
export type BoxVariant = 'theorem' | 'def' | 'lemma' | 'remark' | 'plain'

export function Box({
  variant = 'plain',
  label,
  children,
}: {
  variant?: BoxVariant
  label?: ReactNode
  children: ReactNode
}) {
  return (
    <div className={`box box--${variant}`}>
      {label != null && <span className="box__label">{label}</span>}
      {children}
    </div>
  )
}

/** 要点条 ［提炼］编号块取 slide5 round2DiagRect（对角两圆角）的形状语言 */
export function Points({ children }: { children: ReactNode }) {
  return <ul className="points">{children}</ul>
}

export function Point({ n, children }: { n: number | string; children: ReactNode }) {
  return (
    <li className="point">
      <span className="point__no">{n}</span>
      <span>{children}</span>
    </li>
  )
}

/** icon 块 ［提炼］取 slide4 椭圆 6/7/8 的「实心彩圆 + 白字」处理 */
export function IconBlock({
  tone = 'amber',
  children,
}: {
  tone?: 'amber' | 'red' | 'brick' | 'yellow'
  children: ReactNode
}) {
  const cls = tone === 'amber' ? 'iconblk' : `iconblk iconblk--${tone}`
  return <span className={cls}>{children}</span>
}

/** 图注 ［决策 D4］16pt 辅助档（给图做注的元信息） */
export function FigCap({
  no,
  children,
  style,
}: {
  no?: ReactNode
  children: ReactNode
  style?: React.CSSProperties
}) {
  return (
    <p className="figcap" style={style}>
      {no != null && <span className="figcap__no">{no}</span>}
      {children}
    </p>
  )
}

/** 脚注角标：.8em = 正文 20pt 的八折 = 正好 16pt（在册值，不是 13.6pt 这种野值） */
export function FnRef({ children }: { children: ReactNode }) {
  return <span className="fnref">{children}</span>
}

/** 脚注区 ［决策 D4］16pt */
export function Footnotes({ children }: { children: ReactNode }) {
  return <div className="footnotes">{children}</div>
}

/**
 * 对比表 ［提炼］表格文字属正文档 → 20pt（D4）。
 * 密度不够时调行高与内边距，不缩字号。
 */
export function Table({
  head,
  rows,
}: {
  head?: ReactNode[]
  rows: ReactNode[][]
}) {
  return (
    <table className="table">
      {head && (
        <thead>
          <tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
      )}
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}
