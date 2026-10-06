import { readFile } from 'node:fs/promises'
import type { GwbContext } from '@godcreator/gwb-kernel-desktop'
import type {} from '@godcreator/gwb-commands'
import type {} from '@godcreator/gwb-skills'
import { parseArguments } from './arguments.mjs'
import { createDeck } from './create.mjs'
import { buildProject } from './build-project.mjs'
import { inspectDeck } from './inspect.mjs'
import { loadChromium } from './browser.mjs'
import { createJobs } from './jobs.mjs'

export const name = 'gwb-academic-deck'
export const inject = ['gwbCommands', 'gwbSkills']

const definitions = [
  { action: 'create', description: '在指定新目录创建引用 academic-deck 组件包的汇报项目',
    usage: '{directory: 新目录绝对路径, title?: 标题, packageSpec?: 固定版本号或本地组件.tgz绝对路径}。默认使用随插件记录的组件版本；目录必须不存在。不安装依赖。回 {directory, package, version, next}。' },
  { action: 'build', description: '使用汇报项目安装的 Vite 构建网页产物',
    usage: '{directory: 项目绝对路径}。先在项目中 pnpm install；需要声明 academic-deck 依赖。构建到 dist，超时 120 秒。回 {directory, output, stdout, stderr}，输出保留末尾。' },
  { action: 'check', description: '检查已构建汇报的资源、画布、溢出和打印布局，保存逐页截图',
    usage: '{directory: 项目绝对路径, browser?: "chrome"|"msedge"}。先 deck.build；默认使用已安装的 Chrome。写入 .artifacts/check.json 和 slide-N.png，检查失败回错误。回 {directory, pages, report, screenshots}，详细结果读报告。' },
  { action: 'export', description: '检查已构建汇报并导出 PDF，拒绝覆盖已有 PDF',
    usage: '{directory: 项目绝对路径, out?: 新PDF绝对路径, browser?: "chrome"|"msedge"}。先 deck.build；默认输出 .artifacts/report.pdf、浏览器 chrome。回 {directory, pages, report, screenshots, pdf}。' },
] as const

export function apply(ctx: GwbContext): void {
  const commands = ctx.gwbCommands
  if (!commands) throw new Error('缺少 gwbCommands')
  const jobs = createJobs()
  ctx.effect(() => () => jobs.dispose())
  ctx.gwbSkills.register(new URL('../skills/', import.meta.url))
  for (const definition of definitions) {
    commands.register({ name: 'deck.' + definition.action, description: definition.description, usage: definition.usage, effect: 'write' }, async input => {
      const args = parseArguments(definition.action, input)
      return jobs.run(args.directory, async (signal: AbortSignal) => {
        signal.throwIfAborted()
        if (definition.action === 'create') {
          const component = JSON.parse(await readFile(new URL('./component-version.json', import.meta.url), 'utf8'))
          return createDeck(args.directory, args, component.version)
        }
        if (definition.action === 'build') return buildProject(args.directory, signal)
        const result = await inspectDeck(args.directory, { ...args, pdf: definition.action === 'export' }, loadChromium(), signal)
        return { directory: args.directory, pages: result.count, report: result.report, screenshots: result.screenshots, ...(result.pdf ? { pdf: result.pdf } : {}) }
      })
    })
  }
}
