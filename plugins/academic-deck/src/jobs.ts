import { realpath } from 'node:fs/promises'
import path from 'node:path'

interface DirectoryJob {
  controller: AbortController
  pending: Promise<unknown>
}

export interface DeckJobs {
  run<T>(directory: string, operation: (signal: AbortSignal) => Promise<T>): Promise<T>
  dispose(): Promise<void>
}

export function createJobs(): DeckJobs {
  const active = new Map<string, DirectoryJob>()
  let disposed = false
  return {
    async run<T>(directory: string, operation: (signal: AbortSignal) => Promise<T>): Promise<T> {
      if (disposed) throw new Error('插件正在卸载')
      let canonical: string
      try { canonical = await realpath(directory) } catch { canonical = path.resolve(directory) }
      const key = process.platform === 'win32' ? canonical.toLowerCase() : canonical
      if (disposed) throw new Error('插件正在卸载')
      if (active.has(key)) throw new Error('该目录已有汇报操作正在执行')
      const controller = new AbortController()
      const pending: Promise<unknown> = Promise.resolve().then(() => operation(controller.signal))
      active.set(key, { controller, pending })
      try { return await pending as T } finally { active.delete(key) }
    },
    async dispose() {
      disposed = true
      for (const { controller } of active.values()) controller.abort()
      await Promise.allSettled([...active.values()].map(job => job.pending))
    },
  }
}
