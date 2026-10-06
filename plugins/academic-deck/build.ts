import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = path.dirname(fileURLToPath(import.meta.url))
const libraryRoot = path.dirname(fileURLToPath(import.meta.resolve('@godcreator/academic-deck/package.json')))
const driverRoot = path.dirname(fileURLToPath(import.meta.resolve('playwright-core/package.json')))
const library = JSON.parse(await readFile(path.join(libraryRoot, 'package.json'), 'utf8')) as { name: string; version: string }
const version = JSON.stringify({ package: library.name, version: library.version }, null, 2) + '\n'
const dist = path.resolve(root, 'dist')
if (path.dirname(dist) !== root) throw new Error('输出目录不在插件内')
await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
await writeFile(path.join(root, 'dist/component-version.json'), version)
// playwright-core loads driver assets dynamically; ship its whole self-contained package.
await cp(driverRoot, path.join(root, 'dist/vendor/playwright-core'), {
  recursive: true, filter: source => path.basename(source) !== 'node_modules',
})
await build({
  absWorkingDir: root, entryPoints: ['src/index.ts'], outfile: 'dist/index.js',
  bundle: true, format: 'esm', platform: 'node', target: 'node22',
  external: ['@godcreator/gwb-kernel-desktop', '@godcreator/gwb-skills', '@godcreator/gwb-commands', 'cordis'],
})
console.log('gwb-academic-deck: 4 commands, template and browser driver built')
