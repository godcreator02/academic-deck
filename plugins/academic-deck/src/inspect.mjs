import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { serveBuild } from './static-server.mjs';

export async function inspectDeck(directory, options = {}, chromium, parentSignal) {
  const signal = parentSignal ? AbortSignal.any([parentSignal, AbortSignal.timeout(180000)]) : AbortSignal.timeout(180000);
  signal.throwIfAborted();
  const root = path.resolve(directory);
  await access(path.join(root, 'dist/index.html'));
  const channel = options.browser ?? 'chrome';
  if (!['chrome', 'msedge'].includes(channel)) throw new Error('browser must be chrome or msedge');
  const artifacts = path.join(root, '.artifacts');
  await mkdir(artifacts, { recursive: true });
  const server = await serveBuild(path.join(root, 'dist'));
  let browser;
  const cancel = () => { void browser?.close().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    signal.throwIfAborted();
    browser = await chromium.launch({ headless: true, channel });
    signal.throwIfAborted();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url() + ': ' + request.failure()?.errorText));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ': ' + response.url()); });
    await page.goto(server.url);
    await page.waitForSelector('.slide');
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
    const count = await page.locator('.slide').count();
    const slides = [];
    for (let index = 0; index < count; index++) {
      await page.evaluate(n => { location.hash = String(n + 1); }, index);
      await page.waitForFunction(n => !document.querySelectorAll('.slide-slot')[n].hidden, index);
      const slide = page.locator('.slide-slot:not([hidden]) .slide');
      const result = await slide.evaluate(element => {
        const core = element.querySelector('.content');
        const bounds = (core ?? element).getBoundingClientRect();
        const overflow = [...element.querySelectorAll('.content section,.content p,.content table,.content figure,.content h2,.content li,.content .formula,.references,.page-title,.cover__subtitle,.toc-item,.band__title,.band__lead')].filter(item => {
          const box = item.getBoundingClientRect();
          // KaTeX's hidden accessibility markup can exceed its visual line box.
          if (item.scrollWidth > item.clientWidth + 3 || (item.matches('section,aside') && item.scrollHeight > item.clientHeight + 3)) return true;
          return core?.contains(item) && (box.bottom > bounds.bottom + 2 || box.right > bounds.right + 2 || box.left < bounds.left - 2 || box.top < bounds.top - 2);
        }).map(item => item.className || item.tagName);
        return { title: element.ariaLabel, size: [element.offsetWidth, element.offsetHeight], overflow };
      });
      if (result.size[0] !== 1280 || result.size[1] !== 720) errors.push('Unexpected canvas on slide ' + (index + 1));
      if (result.overflow.length) errors.push('Slide ' + (index + 1) + ' overflow: ' + result.overflow.join(', '));
      await slide.screenshot({ path: path.join(artifacts, 'slide-' + (index + 1) + '.png') });
      slides.push(result);
    }
    await page.emulateMedia({ media: 'print' });
    const printable = await page.locator('.slide-slot:visible').count();
    if (printable !== count) errors.push('Print layout hides slides');
    const report = { ok: errors.length === 0, count, printable, slides, errors, report: path.join(artifacts, 'check.json'), screenshots: artifacts, pdf: undefined };
    await writeFile(path.join(artifacts, 'check.json'), JSON.stringify(report, null, 2) + '\n');
    if (errors.length) throw new Error(errors.join('\n') + '\nSee ' + path.join(artifacts, 'check.json'));
    if (options.pdf) {
      const output = path.resolve(root, options.out ?? '.artifacts/report.pdf');
      const data = await page.pdf({ preferCSSPageSize: true, printBackground: true });
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, data, { flag: 'wx' });
      report.pdf = output;
    }
    return report;
  } finally {
    signal.removeEventListener('abort', cancel);
    await browser?.close().catch(() => {});
    await server.close();
  }
}
