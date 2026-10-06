import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { inspectDeck } from '../plugins/academic-deck/src/inspect.mjs';
import { chromium } from 'playwright';

test('compiled-output checker rejects real text overflow and records the affected slide', async () => {
  const artifacts = path.resolve(import.meta.dirname, '../examples/example-dab/.artifacts');
  await mkdir(artifacts, { recursive: true });
  const project = await mkdtemp(path.join(artifacts, 'overflow-fixture-'));
  await mkdir(path.join(project, 'dist'));
  await writeFile(path.join(project, 'package.json'), '{"private":true}');
  await writeFile(path.join(project, 'dist/index.html'), `<!doctype html><meta charset="utf-8">
    <style>body{margin:0}.slide{position:relative;width:1280px;height:720px}.content{position:absolute;inset:32px}p{width:50px;white-space:nowrap}</style>
    <div class="slide-slot"><article class="slide" aria-label="Overflow fixture"><div class="content"><p>This text deliberately exceeds its narrow container.</p></div></article></div>`);
  await assert.rejects(inspectDeck(project, {}, chromium), /Slide 1 overflow/);
  const report = JSON.parse(await readFile(path.join(project, '.artifacts/check.json'), 'utf8'));
  assert.equal(report.ok, false);
  assert.equal(report.count, 1);
  assert.deepEqual(report.slides[0].overflow, ['P']);
});
