const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function dependency(name) {
  const runtime = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
  return require(require.resolve(name, { paths: [runtime, __dirname] }));
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const artifacts = path.join(root, '.artifacts');
  fs.mkdirSync(artifacts, { recursive: true });
  assert.match(fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8'), /<script[^>]+type="module"/);
  const { preview } = await import('vite');
  const server = await preview({ root, configFile: false, preview: { host:'127.0.0.1', port:0, strictPort:true } });
  let browser;
  try {
    browser = await dependency('playwright').chromium.launch({ channel:'chrome', headless:true });
    const page = await browser.newPage({ viewport:{ width:1280, height:720 } });
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    page.on('requestfailed', r=>errors.push(r.url()));
    await page.goto(server.resolvedUrls.local[0]);
    await page.waitForSelector('.slide');
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
    const count = 11;
    assert.equal(await page.locator('.slide').count(), count);
    assert.equal(await page.locator('.toolbar,.review-header,.boundary-controls').count(),0);
    const records=[];
    for(let i=0;i<count;i++) {
      await page.evaluate(n=>{location.hash=String(n);},i+1);
      await page.waitForFunction(n=>!document.querySelectorAll('.slide-slot')[n].hidden,i);
      const slide=page.locator('.slide-slot:not([hidden]) .slide');
      await slide.screenshot({path:path.join(artifacts,`slide-${i+1}.png`)});
      records.push(await slide.evaluate(s=>{
        const c=s.querySelector('.content'), sb=s.getBoundingClientRect(), cb=c?.getBoundingClientRect()||sb;
        const overflows=[...s.querySelectorAll('.content section,.content p,.content table,.content figure,.content h2,.content .formula,.band__title,.band__lead,.references')].filter(e=>{
          const b=e.getBoundingClientRect();
          return e.scrollWidth>e.clientWidth+2 || e.scrollHeight>e.clientHeight+2 || (!e.matches('.references') && (b.bottom>cb.bottom+2 || b.right>cb.right+2 || b.left<cb.left-2));
        }).map(e=>e.className||e.tagName);
        const svgClipped=[...s.querySelectorAll('.sst-diagram text,.sst-diagram foreignObject')].filter(e=>{
          const r=e.getBoundingClientRect(), b=e.closest('.sst-diagram').getBoundingClientRect();
          return r.left<b.left-2||r.right>b.right+2||r.top<b.top-2||r.bottom>b.bottom+2;
        }).map(e=>e.textContent);
        const captions=[...s.querySelectorAll('figure')].map(f=>{
          const a=f.querySelector('.figure-media').getBoundingClientRect(),b=f.querySelector('figcaption').getBoundingClientRect();
          return Math.abs(a.left+a.right-b.left-b.right)/2;
        });
        return {title:s.ariaLabel,size:[s.offsetWidth,s.offsetHeight],overflows,svgClipped,captions,
          core:c?[c.offsetLeft,c.offsetTop,c.offsetWidth,c.offsetHeight]:null,
          tableSizes:[...s.querySelectorAll('td,th')].map(e=>parseFloat(getComputedStyle(e).fontSize)),
          math:[...s.querySelectorAll('[data-tex]')].map(e=>e.dataset.tex)};
      }));
    }
    const sharp=dependency('sharp');
    const tiles=await Promise.all(Array.from({length:count},(_,i)=>i+1).map(async(n)=>({input:await sharp(path.join(artifacts,`slide-${n}.png`)).resize(640,360).toBuffer(),left:((n-1)%2)*640,top:Math.floor((n-1)/2)*360})));
    await sharp({create:{width:1280,height:Math.ceil(count/2)*360,channels:3,background:'white'}}).composite(tiles).png().toFile(path.join(artifacts,'contact-sheet.png'));
    fs.writeFileSync(path.join(artifacts,'verification.json'),JSON.stringify({errors,records},null,2));
    assert.deepEqual(errors,[]);
    for(const r of records) {
      assert.deepEqual(r.size,[1280,720]);
      assert.deepEqual(r.overflows,[],`${r.title}: content overflow`);
      assert.deepEqual(r.svgClipped,[],`${r.title}: SVG label clipped`);
      assert.ok(r.captions.every(x=>x<1));
      if(r.core)assert.deepEqual(r.core,[32,107,1216,576]);
      assert.ok(r.tableSizes.every(x=>Math.abs(x-16*4/3)<.02));
    }
    assert.equal(await page.locator('.sst-sm').count(),18);
    assert.equal(await page.locator('.sst-switch').count(),12);
    assert.ok(records[3].math.includes(String.raw`L_{\sigma}`));
    await page.keyboard.press('Home');
    await page.waitForFunction(()=>location.hash==='#1');
    await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>location.hash==='#2');
    await page.keyboard.press('End');
    await page.waitForFunction(n=>location.hash===`#${n}`,count);
    await page.setViewportSize({width:832,height:736});
    const bounds=await page.locator('.slide-slot:not([hidden])').boundingBox();
    assert.ok(bounds.width<=833&&bounds.height<=737);
    await page.emulateMedia({media:'print'});
    assert.equal(await page.locator('.slide-slot:visible').count(),count);
    console.log(`PASS: ${count} slides; boundaries, captions, 16 pt tables, equations, 18 modules / 12 switches, navigation and print layout.`);
  } finally { await browser?.close();await new Promise(resolve=>server.httpServer.close(resolve)); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});

