import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { parseArguments } from '../plugins/academic-deck/src/arguments.mjs';
import { createJobs } from '../plugins/academic-deck/src/jobs.mjs';

test('command arguments reject ambiguous paths, floating package versions and unknown options', () => {
  const directory = path.resolve('.artifacts/argument-fixture');
  assert.throws(() => parseArguments('create', { directory: 'relative' }), /绝对路径/);
  assert.throws(() => parseArguments('create', { directory, packageSpec: 'latest' }), /固定版本/);
  assert.throws(() => parseArguments('check', { directory, title: 'ignored' }), /不支持/);
  assert.throws(() => parseArguments('check', { directory, browser: 'unknown' }), /browser/);
  assert.throws(() => parseArguments('export', { directory, out: 'relative.pdf' }), /out/);
  assert.equal(parseArguments('create', { directory, packageSpec: '0.1.0' }).packageSpec, '0.1.0');
});

test('jobs reject overlapping directory operations and await cancellation on disposal', async () => {
  const jobs = createJobs();
  const directory = path.resolve('.');
  let cancelled = false;
  let markStarted;
  const started = new Promise(resolve => { markStarted = resolve; });
  const first = jobs.run(directory, signal => new Promise(resolve => {
    signal.addEventListener('abort', () => { cancelled = true; resolve('cancelled'); }, { once: true });
    markStarted();
  }));
  await started;
  await assert.rejects(jobs.run(directory, async () => {}), /已有汇报操作/);
  await jobs.dispose();
  assert.equal(await first, 'cancelled');
  assert.equal(cancelled, true);
  await assert.rejects(jobs.run(directory, async () => {}), /卸载/);
});
