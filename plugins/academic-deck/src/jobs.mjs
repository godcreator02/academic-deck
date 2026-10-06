import { realpath } from 'node:fs/promises';
import path from 'node:path';

export function createJobs() {
  const active = new Map();
  let disposed = false;
  return {
    async run(directory, operation) {
      if (disposed) throw new Error('插件正在卸载');
      let canonical;
      try { canonical = await realpath(directory); } catch { canonical = path.resolve(directory); }
      const key = process.platform === 'win32' ? canonical.toLowerCase() : canonical;
      if (disposed) throw new Error('插件正在卸载');
      if (active.has(key)) throw new Error('该目录已有汇报操作正在执行');
      const controller = new AbortController();
      const pending = Promise.resolve().then(() => operation(controller.signal));
      active.set(key, { controller, pending });
      try { return await pending; } finally { active.delete(key); }
    },
    async dispose() {
      disposed = true;
      for (const { controller } of active.values()) controller.abort();
      await Promise.allSettled([...active.values()].map(job => job.pending));
    },
  };
}
