import { spawn, execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

export interface BuildResult {
  directory: string
  output: string
  stdout: string
  stderr: string
}

export async function buildProject(directory: string, signal?: AbortSignal): Promise<BuildResult> {
  signal?.throwIfAborted()
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8')) as { dependencies?: Record<string, string> }
  if (!manifest.dependencies?.['@godcreator/academic-deck']) throw new Error('目标项目没有声明 @godcreator/academic-deck 依赖')
  const require = createRequire(path.join(directory, 'package.json'))
  let vite: string
  try { vite = path.join(path.dirname(require.resolve('vite/package.json')), 'bin/vite.js') }
  catch { throw new Error('目标项目未安装 Vite；先在该目录执行 pnpm install') }
  return await new Promise<BuildResult>((resolve, reject) => {
    let stdout = '', stderr = '', stopped = false
    const child = spawn(process.execPath, [vite, 'build'], {
      cwd: directory, env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    })
    const stop = () => {
      stopped = true
      if (!child.pid) return
      if (process.platform === 'win32') execFile('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {})
      else child.kill('SIGTERM')
    }
    const timer = setTimeout(stop, 120000)
    signal?.addEventListener('abort', stop, { once: true })
    const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', stop) }
    child.stdout?.on('data', (chunk: Buffer) => { stdout = (stdout + chunk).slice(-12000) })
    child.stderr?.on('data', (chunk: Buffer) => { stderr = (stderr + chunk).slice(-12000) })
    child.once('error', error => { cleanup(); reject(error) })
    child.once('close', code => {
      cleanup()
      if (stopped) reject(new Error('构建已取消或超过 120 秒'))
      else if (code !== 0) reject(new Error('构建失败：' + (stderr || stdout)))
      else resolve({ directory, output: path.join(directory, 'dist'), stdout, stderr })
    })
    if (signal?.aborted) stop()
  }).then(async result => {
    await access(path.join(directory, 'dist/index.html'))
    return result
  })
}
