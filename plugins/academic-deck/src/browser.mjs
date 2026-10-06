import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
// Build ships the complete self-contained driver, including its runtime assets.
export function loadChromium() {
  return require(fileURLToPath(new URL('./vendor/playwright-core/index.js', import.meta.url))).chromium;
}
