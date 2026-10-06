import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

export type ChromiumLauncher = typeof import('playwright-core').chromium

const require = createRequire(import.meta.url)

/** 运行时加载随包发布的完整自包含驱动（dist/vendor），类型取自开发依赖 playwright-core */
export function loadChromium(): ChromiumLauncher {
  const vendor = require(fileURLToPath(new URL('./vendor/playwright-core/index.js', import.meta.url))) as { chromium: ChromiumLauncher }
  return vendor.chromium
}
