import http, { type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import { readFile, realpath } from 'node:fs/promises'
import path from 'node:path'

export interface BuildServer {
  url: string
  close(): Promise<void>
}

const mime: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json' }

export async function serveBuild(directory: string): Promise<BuildServer> {
  const root = await realpath(directory)
  const server = http.createServer((request: IncomingMessage, response: ServerResponse) => { void handle(request, response) })
  async function handle(request: IncomingMessage, response: ServerResponse) {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname)
      const target = await realpath(path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname)))
      const relative = path.relative(root, target)
      if (relative.startsWith('..') || path.isAbsolute(relative)) { response.writeHead(403).end(); return }
      const data = await readFile(target)
      response.writeHead(200, { 'Content-Type': mime[path.extname(target)] ?? 'application/octet-stream' }).end(data)
    } catch { response.writeHead(404).end() }
  }
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve) })
  const address = server.address() as AddressInfo
  return {
    url: 'http://127.0.0.1:' + address.port + '/',
    close: () => new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
      server.closeAllConnections()
    }),
  }
}
