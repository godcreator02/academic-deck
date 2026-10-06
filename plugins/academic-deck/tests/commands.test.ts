import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { parseArguments } from '../src/arguments'
import { createJobs } from '../src/jobs'

describe('parseArguments', () => {
  it('拒绝相对路径、浮动版本号与不支持的参数', () => {
    const directory = path.resolve('.artifacts/argument-fixture')
    expect(() => parseArguments('create', { directory: 'relative' })).toThrow(/绝对路径/)
    expect(() => parseArguments('create', { directory, packageSpec: 'latest' })).toThrow(/固定版本/)
    expect(() => parseArguments('check', { directory, title: 'ignored' })).toThrow(/不支持/)
    expect(() => parseArguments('check', { directory, browser: 'unknown' })).toThrow(/browser/)
    expect(() => parseArguments('export', { directory, out: 'relative.pdf' })).toThrow(/out/)
    expect(parseArguments('create', { directory, packageSpec: '0.1.0' }).packageSpec).toBe('0.1.0')
  })
})

describe('createJobs', () => {
  it('同目录互斥，卸载时取消在途任务并等它结束', async () => {
    const jobs = createJobs()
    const directory = path.resolve('.')
    let cancelled = false
    let markStarted!: () => void
    const started = new Promise<void>(resolve => { markStarted = resolve })
    const first = jobs.run(directory, signal => new Promise(resolve => {
      signal.addEventListener('abort', () => { cancelled = true; resolve('cancelled') }, { once: true })
      markStarted()
    }))
    await started
    await expect(jobs.run(directory, async () => {})).rejects.toThrow(/已有汇报操作/)
    await jobs.dispose()
    expect(await first).toBe('cancelled')
    expect(cancelled).toBe(true)
    await expect(jobs.run(directory, async () => {})).rejects.toThrow(/卸载/)
  })
})
