import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * 把入口脚本从 ES module 改成经典脚本，让 dist 能**双击打开**。
 *
 * 为什么需要：file:// 下 Chrome 会以 CORS 为由拒绝加载 <script type="module">，
 * 于是 React 产物双击后是一片空白（实测：headless 打印出来只有 1 页 Letter 白纸）。
 * 经典脚本不受此限，同目录的相对资源（图片、字体）也照常加载。
 * 配合 build.rollupOptions.output.format='iife' 使用。
 */
function classicScript(): Plugin {
  return {
    name: 'deck-classic-script',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        /* 必须补 defer：经典脚本默认同步阻塞，会在 <head> 里抢在 #root 之前执行
           （module 脚本自带 defer 才没这个问题）。少了它报 "找不到 #root"。 */
        .replace(/<script type="module" crossorigin/g, '<script defer')
        .replace(/<link rel="modulepreload"[^>]*>\s*/g, '')
    },
  }
}

/**
 * React 工程刻意**不复制**设计资产：
 *   tokens.css / deck.css / components.css / pages.css / assets/ 都住在 ../src，
 *   与静态版共用同一份，几何与字号只可能有一个真值。
 * 因此需要放开 dev server 的 fs 白名单（默认只允许项目根）。
 */
export default defineConfig({
  base: './',                        // 产物用相对路径：build 出来的 dist 可直接双击打开
  plugins: [react(), classicScript()],
  server: { fs: { allow: ['..'] } },
  resolve: {
    alias: { '@deck': fileURLToPath(new URL('../src', import.meta.url)) },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,            // 大图不内联，保持与静态版同样的资源文件
    rollupOptions: {
      output: {
        format: 'iife',              // 经典脚本，file:// 可加载
        inlineDynamicImports: true,
      },
    },
  },
})
