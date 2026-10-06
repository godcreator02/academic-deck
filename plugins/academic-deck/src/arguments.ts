import path from 'node:path'

export type DeckAction = 'create' | 'build' | 'check' | 'export'
export type DeckBrowser = 'chrome' | 'msedge'

export interface DeckArguments {
  directory: string
  title?: string
  packageSpec?: string
  browser?: DeckBrowser
  out?: string
}

export function parseArguments(action: DeckAction, input: unknown): DeckArguments {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new Error('需要对象参数，directory 为绝对路径')
  const record = input as Record<string, unknown>
  const allowed = new Set([
    'directory',
    ...(action === 'create' ? ['title', 'packageSpec'] : []),
    ...(action === 'check' || action === 'export' ? ['browser'] : []),
    ...(action === 'export' ? ['out'] : []),
  ])
  for (const [key, value] of Object.entries(record)) {
    if (!allowed.has(key)) throw new Error('不支持的参数：' + key)
    if (typeof value !== 'string' || !value.trim()) throw new Error(key + ' 必须是非空字符串')
  }
  const { directory, title, packageSpec, browser, out } = record
  if (typeof directory !== 'string' || !path.isAbsolute(directory)) throw new Error('directory 必须是绝对路径')
  if (browser !== undefined && browser !== 'chrome' && browser !== 'msedge') throw new Error('browser 只支持 chrome 或 msedge')
  if (out !== undefined && (typeof out !== 'string' || !path.isAbsolute(out) || path.extname(out).toLowerCase() !== '.pdf')) throw new Error('out 必须是 PDF 文件的绝对路径')
  // 只接受已发布的固定版本号或本地 .tgz 绝对路径，不用浮动 tag
  if (
    packageSpec !== undefined &&
    (typeof packageSpec !== 'string' || (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(packageSpec) && !(path.isAbsolute(packageSpec) && packageSpec.endsWith('.tgz'))))
  ) throw new Error('packageSpec 必须是固定版本号或本地 .tgz 绝对路径')
  const args: DeckArguments = { directory: path.resolve(directory) }
  if (typeof title === 'string') args.title = title
  if (typeof packageSpec === 'string') args.packageSpec = packageSpec
  if (browser === 'chrome' || browser === 'msedge') args.browser = browser
  if (typeof out === 'string') args.out = out
  return args
}
