import { describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { inspectDeck } from '../src/inspect'
import { chromium } from 'playwright'

describe('inspectDeck', () => {
  it('编译产物检查器识别真实文字溢出并记录受影响页', async () => {
    const artifacts = fileURLToPath(new URL('../../../../examples/example-dab/.artifacts', import.meta.url))
    await mkdir(artifacts, { recursive: true })
    const project = await mkdtemp(path.join(artifacts, 'overflow-fixture-'))
    await mkdir(path.join(project, 'dist'))
    await writeFile(path.join(project, 'package.json'), '{"private":true}')
    await writeFile(path.join(project, 'dist/index.html'), `<!doctype html><meta charset="utf-8">
    <style>body{margin:0}.slide{position:relative;width:1280px;height:720px}.content{position:absolute;inset:32px}p{width:50px;white-space:nowrap}</style>
    <div class="slide-slot"><article class="slide" aria-label="Overflow fixture"><div class="content"><p>This text deliberately exceeds its narrow container.</p></div></article></div>`)
    await expect(inspectDeck(project, {}, chromium)).rejects.toThrow(/Slide 1 overflow/)
    const report = JSON.parse(await readFile(path.join(project, '.artifacts/check.json'), 'utf8')) as { ok: boolean; count: number; slides: { overflow: string[] }[] }
    expect(report.ok).toBe(false)
    expect(report.count).toBe(1)
    expect(report.slides[0]?.overflow).toEqual(['P'])
  })
})
