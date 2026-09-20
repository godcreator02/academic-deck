/**
 * 防漂移校验：React 侧的 TS 常量必须与 src/tokens.css 逐条一致。
 *
 * 为什么要这个：CSS 是真值，但 JS 侧需要一份镜像做布局算术（见 src/theme/tokens.ts）。
 * 两份值一旦分叉，React 版与静态版就会悄悄长得不一样。这个脚本把它们钉在一起。
 *
 * 用法：pnpm run check:tokens
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(here, '../../src/tokens.css')
const tsPath = resolve(here, '../src/theme/tokens.ts')

const css = readFileSync(cssPath, 'utf8')
const ts = readFileSync(tsPath, 'utf8')

const fail = []
const ok = []

/* ---- 1. 字号阶梯：tokens.css 的 --fs-16..--fs-80 必须落成 TS 的 LADDER ---- */
const cssSizes = [...css.matchAll(/--fs-(\d+):\s*([\d.]+)pt;/g)].map((m) => Number(m[2]))
const tsLadder = (ts.match(/LADDER\s*=\s*\[([^\]]+)\]/)?.[1] ?? '')
  .split(',')
  .map((s) => Number(s.trim()))
  .filter((n) => !Number.isNaN(n))

if (JSON.stringify(cssSizes) !== JSON.stringify(tsLadder)) {
  fail.push(`字号阶梯不一致：\n    tokens.css = [${cssSizes}]\n    tokens.ts  = [${tsLadder}]`)
} else {
  ok.push(`字号阶梯 ${tsLadder.length} 档一致：[${tsLadder.join(', ')}]pt`)
}

/* ---- 2. 角色别名：--fs-<role>: var(--fs-N) 必须与 TS 的 FS[role] 对应 ---- */
const roleMap = {}
/* 注意 [a-z0-9]+：角色名里有 h1 这种带数字的，只写 [a-z]+ 会漏 */
for (const m of css.matchAll(/--fs-([a-z][a-z0-9]*):\s*var\(--fs-(\d+)\);/g)) {
  roleMap[m[1]] = Number(m[2])
}
const tsFs = {}
const fsBlock = ts.match(/export const FS = \{([\s\S]*?)\}\s*as const/)?.[1] ?? ''
for (const m of fsBlock.matchAll(/(\w+):\s*(\d+)/g)) {
  tsFs[m[1]] = Number(m[2])
}
for (const [role, size] of Object.entries(tsFs)) {
  if (roleMap[role] === undefined) {
    fail.push(`角色 "${role}" 在 tokens.css 里没有对应别名`)
  } else if (roleMap[role] !== size) {
    fail.push(`角色 "${role}" 不一致：tokens.css=${roleMap[role]}pt，tokens.ts=${size}pt`)
  }
}
if (Object.keys(tsFs).every((r) => roleMap[r] === tsFs[r]) && Object.keys(tsFs).length) {
  ok.push(`角色别名 ${Object.keys(tsFs).length} 条一致`)
}

/* ---- 3. 画布与正文档下限 ---- */
const canvasW = Number(css.match(/--canvas-w:\s*([\d.]+)pt;/)?.[1])
const canvasH = Number(css.match(/--canvas-h:\s*([\d.]+)pt;/)?.[1])
const tsSlide = ts.match(/SLIDE\s*=\s*\{\s*w:\s*(\d+),\s*h:\s*(\d+)\s*\}/)
if (!tsSlide || Number(tsSlide[1]) !== canvasW || Number(tsSlide[2]) !== canvasH) {
  fail.push(`画布不一致：tokens.css=${canvasW}×${canvasH}pt，tokens.ts=${tsSlide?.[1]}×${tsSlide?.[2]}`)
} else {
  ok.push(`画布 ${canvasW}×${canvasH}pt 一致`)
}
const tsFloor = Number(ts.match(/BODY_FLOOR\s*=\s*(\d+)/)?.[1])
if (tsFloor !== 20) fail.push(`正文档下限应为 20pt，tokens.ts 写的是 ${tsFloor}`)
else ok.push(`正文档下限 ${tsFloor}pt`)

/* ---- 4. chrome 几何抽检（tokens.css 的 --chrome-* 必须能在 tokens.ts 找到同值） ---- */
const chromePairs = [
  ['--chrome-title-x', 'titleX'],
  ['--chrome-title-y', 'titleY'],
  ['--chrome-logo-x', 'logoX'],
  ['--chrome-bar-y', 'barY'],
  ['--chrome-bar-h', 'barH'],
]
for (const [cssVar, tsKey] of chromePairs) {
  const cv = Number(css.match(new RegExp(cssVar + ':\\s*([\\d.]+)pt;'))?.[1])
  const tv = Number(ts.match(new RegExp(tsKey + ':\\s*([\\d.]+)'))?.[1])
  if (!(Math.abs(cv - tv) < 1e-6)) fail.push(`chrome ${cssVar} 不一致：css=${cv}，ts=${tv}`)
}
if (!fail.some((f) => f.startsWith('chrome'))) ok.push(`chrome 几何抽检 ${chromePairs.length} 项一致`)

/* ---- 输出 ---- */
for (const o of ok) console.log('  ✓ ' + o)
if (fail.length) {
  console.error('\n✗ tokens 分叉了 ' + fail.length + ' 处：')
  for (const f of fail) console.error('  · ' + f)
  console.error('\n改 src/tokens.css 时，记得同步 react/src/theme/tokens.ts。')
  process.exit(1)
}
console.log('\n未发现分叉。')
