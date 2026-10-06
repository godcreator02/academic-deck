import { describe, expect, it } from 'vitest'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createDeck } from '../src/create'

describe('createDeck', () => {
  it('创建固定组件版本、标题安全编码的可移植项目', async () => {
    const sandbox = await mkdtemp(path.join(os.tmpdir(), 'academic-deck-test-'))
    const target = path.join(sandbox, '汇报 with spaces')
    const title = '中文 "quoted"\nline'
    await createDeck(target, { title }, '0.1.0')
    const pkg = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')) as { dependencies: Record<string, string>; scripts: Record<string, string>; devDependencies: Record<string, string> }
    expect(pkg.dependencies['@godcreator/academic-deck']).toBe('0.1.0')
    expect(pkg.scripts.check).toBeUndefined()
    expect(pkg.devDependencies.playwright).toBeUndefined()
    const titleSource = await readFile(path.join(target, 'src/title.js'), 'utf8')
    expect(JSON.parse(titleSource.slice('export const title = '.length).trim().slice(0, -1))).toBe(title)
    await writeFile(path.join(target, 'keep.txt'), 'existing work')
    await expect(createDeck(target, {}, '0.1.0')).rejects.toMatchObject({ code: 'EEXIST' })
    expect(await readFile(path.join(target, 'keep.txt'), 'utf8')).toBe('existing work')
  })

  it('未发布开发时支持本地组件 tarball', async () => {
    const sandbox = await mkdtemp(path.join(os.tmpdir(), 'academic-deck-pack-'))
    const target = path.join(sandbox, 'report')
    const archive = path.join(sandbox, 'component.tgz')
    await writeFile(archive, 'fixture')
    await createDeck(target, { packageSpec: archive }, '0.1.0')
    const pkg = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8')) as { dependencies: Record<string, string> }
    expect(pkg.dependencies['@godcreator/academic-deck']).toBe(archive)
  })
})
