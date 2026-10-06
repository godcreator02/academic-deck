const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function dependency(name) {
  try { return require(name); }
  catch (error) {
    const runtime = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE || '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
    try { return require(path.join(runtime, name)); }
    catch { throw new Error(`Cannot load ${name}. Set NODE_PATH or CODEX_NODE_MODULES to your verification runtime.`, { cause: error }); }
  }
}

async function main() {
  const example = process.argv.includes('--example');
  const root = example ? path.resolve(__dirname, '../../../examples/example-dab') : path.resolve(__dirname, '..');
  const artifacts = path.join(root, '.artifacts');
  fs.mkdirSync(artifacts, { recursive: true });
  let url = process.env.DECK_URL, previewServer, browser;
  try {
    assert.match(fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8'), /<script[^>]+type="module"/);
    if (!url) {
      const { preview } = await import('vite');
      previewServer = await preview({ root, configFile: false, preview: { host: '127.0.0.1', port: 0, strictPort: true } });
      url = previewServer.resolvedUrls.local[0];
    }
    assert.match(url, /^https?:\/\//, 'Verify compiled output over HTTP');
    browser = await dependency('playwright').chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1030 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => errors.push(`${r.url()}: ${r.failure()?.errorText}`));
    await page.goto(url);
    await page.waitForSelector('.slide');
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
    const count = await page.locator('.slide').count();
    assert.equal(count, example ? 15 : 8);
    if (example) assert.equal(await page.locator('.toolbar,.review-header,.boundary-controls,.boundary-legend,.review-note').count(), 0);
    const records = [];
    for (let i = 0; i < count; i++) {
      if (example) {
        await page.evaluate(index => { location.hash = String(index + 1); }, i);
        await page.waitForFunction(index => !document.querySelectorAll('.slide-slot')[index].hidden, i);
      } else await page.locator('.toolbar button').nth(i).click();
      const slide = page.locator('.slide-slot:not([hidden]) .slide');
      if (example && await slide.locator('.replica').count()) {
        const result = await slide.evaluate(s => ({
          kind:s.className, size:[s.offsetWidth,s.offsetHeight],
          overflow:[...s.querySelectorAll('h1,p,.motto,.toc-item,.band__part')].filter(e => e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 2).map(e => e.className),
          brokenImages:[...s.querySelectorAll('img')].filter(e => !e.complete || !e.naturalWidth).length,
        }));
        assert.deepEqual(result.size, [1280,720]);
        assert.deepEqual(result.overflow, [], `Page ${i + 1} text overflow`);
        assert.equal(result.brokenImages, 0);
        await slide.screenshot({path:path.join(artifacts, `slide-${i + 1}.png`)});
        records.push(result);
        continue;
      }
      const result = await slide.evaluate(s => {
        const c = s.querySelector('.content'), cb = c.getBoundingClientRect();
        const footer = s.querySelector('.slide-footer').getBoundingClientRect();
        const box = selector => s.querySelector(selector).getBoundingClientRect();
        const center = b => (b.top + b.bottom) / 2;
        const icon = box('.chevrons'), title = box('.page-title'), logo = box('.logo');
        const overflow = [...c.querySelectorAll('section,aside,.figure,.formula,.equation,p,table,h2,li')].filter(el => {
          const b = el.getBoundingClientRect();
          return (el.matches('section,aside') && el.scrollHeight > el.clientHeight + 3) || el.scrollWidth > el.clientWidth + 3 || b.bottom > cb.bottom + 2 || b.right > cb.right + 2;
        }).map(el => el.className || el.tagName);
        const figureOffsets = [...s.querySelectorAll('figure')].map(f => {
          const m = f.querySelector('.figure-media').getBoundingClientRect(), cap = f.querySelector('figcaption').getBoundingClientRect();
          return Math.abs((m.left + m.right - cap.left - cap.right) / 2);
        });
        const equationOffsets = [...s.querySelectorAll('.equation')].map(e => {
          const b = e.getBoundingClientRect(), f = e.querySelector('.formula').getBoundingClientRect();
          return Math.abs((b.left + b.right - f.left - f.right) / 2);
        });
        return {
          size: [s.offsetWidth, s.offsetHeight], core: [c.offsetLeft, c.offsetTop, c.offsetWidth, c.offsetHeight], overflow,
          alignment: [icon.left - cb.left, logo.right - cb.right, center(icon) - center(title), center(logo) - center(title), box('.references').bottom - box('.page-no').bottom],
          figureOffsets, equationOffsets, footerGap: footer.top - cb.bottom,
          referenceSize: parseFloat(getComputedStyle(s.querySelector('.references')).fontSize),
          tableSizes: [...s.querySelectorAll('table')].map(t => parseFloat(getComputedStyle(t).fontSize)),
          switchCount: s.querySelectorAll('.circuit use').length,
        };
      });
      assert.deepEqual(result.size, [1280, 720]);
      assert.deepEqual(result.core, [32, 107, 1216, 576]);
      assert.deepEqual(result.overflow, [], `Page ${i + 1} overflow`);
      assert.ok([...result.alignment, ...result.figureOffsets, ...result.equationOffsets].every(v => Math.abs(v) < 1), `Page ${i + 1} alignment`);
      assert.ok(result.footerGap >= 0);
      assert.ok(Math.abs(result.referenceSize - 14 * 4 / 3) < .02);
      assert.ok(result.tableSizes.every(v => Math.abs(v - 16 * 4 / 3) < .02));
      if ((example ? [3, 6] : [0, 7]).includes(i)) assert.equal(result.switchCount, 8);
      const shot = path.join(artifacts, `slide-${i + 1}.png`);
      await slide.screenshot({ path: shot });
      if (process.argv.includes('--compare')) {
        const sharp = dependency('sharp');
        const baseline = path.join(artifacts, 'baseline', `dab-layouts-${i + 1}.png`);
        const before = await sharp(baseline).raw().toBuffer({ resolveWithObject: true });
        const after = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
        assert.deepEqual(after.info, before.info);
        let changed = 0;
        for (let b = 0; b < before.data.length; b++) if (Math.abs(before.data[b] - after.data[b]) > 8) changed++;
        result.changedChannelRatio = changed / before.data.length;
        assert.ok(result.changedChannelRatio < .005, `Page ${i + 1} visual difference: ${result.changedChannelRatio}`);
      }
      records.push(result);
    }
    if (example) {
      await page.keyboard.press('End');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('.slide-slot:not([hidden]) .slide-closing').count(), 1);
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('.slide-slot:not([hidden]) .slide-cover').count(), 1);
      await page.keyboard.press('Space');
      assert.equal(await page.locator('.slide-slot:not([hidden]) .slide-contents').count(), 1);
      for (const [index, target] of [3,6,10,12].entries()) {
        await page.evaluate(() => { location.hash = '2'; });
        await page.locator('.slide-contents .toc-item').nth(index).click();
        await page.waitForFunction(n => !document.querySelectorAll('.slide-slot')[n-1].hidden, target);
        assert.equal(await page.locator('.slide-slot:not([hidden]) .band__part').textContent(), `Part  0${index+1}`);
      }
      await page.keyboard.press('Home');
      await page.locator('.slide-slot:not([hidden]) .cover__subtitle').click();
      assert.equal(await page.locator('.slide-slot:not([hidden]) .slide-contents').count(), 1);
      await page.keyboard.press('f');
      await page.waitForFunction(() => document.fullscreenElement !== null);
      await page.keyboard.press('f');
      await page.waitForFunction(() => document.fullscreenElement === null);
      await page.keyboard.press('Home');
    } else {
    await page.locator('#left').fill('32');
    assert.equal(await page.locator('#left-range').inputValue(), '32');
    assert.ok(await page.locator('.slide').evaluateAll(els => els.every(s => s.style.getPropertyValue('--left') === '32pt')));
    await page.locator('#reset').click();
    assert.equal(await page.locator('#left').inputValue(), '24');
    await page.locator('.toolbar input').uncheck();
    assert.equal(await page.locator('.measure-overlay').first().evaluate(e => getComputedStyle(e).display), 'none');
    await page.locator('.review-header h1').click();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.slide-slot:not([hidden]) .page-no').textContent(), '1/8');
    }
    if (example) await require(path.join(root, 'scripts/verify-animation.cjs'))(page, artifacts);
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.slide-slot').evaluateAll(els => els.filter(e => getComputedStyle(e).display !== 'none').length), count);
    assert.equal(await page.locator('.slide-transform').first().evaluate(e => getComputedStyle(e).transform), 'none');
    for (const selector of ['.toolbar', '.boundary-controls', '.measure-overlay']) {
      if (await page.locator(selector).count()) assert.equal(await page.locator(selector).first().evaluate(e => getComputedStyle(e).display), 'none');
    }
    if (process.argv.includes('--pdf')) {
      await page.pdf({ path: example ? path.join(root, 'dist/dab-group-meeting.pdf') : path.join(artifacts, 'academic-design.pdf'), preferCSSPageSize: true, printBackground: true });
    }
    await page.emulateMedia({ media: 'screen' });
    await page.setViewportSize({ width: 832, height: 736 });
    assert.equal(await page.locator('.slide').first().evaluate(e => e.offsetWidth), 1280);
    if (example) {
      const bounds=await page.locator('.slide-slot:not([hidden])').boundingBox();
      assert.ok(Math.abs(bounds.width-832)<1 && bounds.height<=736);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth || document.documentElement.scrollHeight>innerHeight),false);
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(artifacts, 'verification.json'), JSON.stringify({ count, url, errors, records }, null, 2));
    console.log(`PASS: ${count} slides, production ES modules over HTTP, geometry, 16pt tables, formulas, captions, navigation, ${example ? 'pure presentation, contents links, fullscreen' : 'safety controls'} and print layout.`);
    if (process.argv.includes('--compare')) console.log('Visual comparison:', records.map(r => r.changedChannelRatio));
  } finally {
    await browser?.close();
    if (previewServer) await new Promise((resolve, reject) => previewServer.httpServer.close(error => error ? reject(error) : resolve()));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
