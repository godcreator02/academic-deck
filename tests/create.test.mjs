import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createDeck } from '../plugins/academic-deck/src/create.mjs';

test('creates a portable project with a fixed package version and safely encoded title', async () => {
  const sandbox = await mkdtemp(path.join(os.tmpdir(), 'academic-deck-test-'));
  const target = path.join(sandbox, '汇报 with spaces');
  const title = '中文 "quoted"\nline';
  await createDeck(target, { title }, '0.1.0');
  const pkg = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8'));
  assert.equal(pkg.dependencies['@godcreator/academic-deck'], '0.1.0');
  assert.equal(pkg.scripts.check, undefined);
  assert.equal(pkg.devDependencies.playwright, undefined);
  const titleSource = await readFile(path.join(target, 'src/title.js'), 'utf8');
  assert.equal(JSON.parse(titleSource.slice('export const title = '.length).trim().slice(0, -1)), title);
  await writeFile(path.join(target, 'keep.txt'), 'existing work');
  await assert.rejects(createDeck(target, {}, '0.1.0'), { code: 'EEXIST' });
  assert.equal(await readFile(path.join(target, 'keep.txt'), 'utf8'), 'existing work');
});

test('supports a local package tarball for unpublished development', async () => {
  const sandbox = await mkdtemp(path.join(os.tmpdir(), 'academic-deck-pack-'));
  const target = path.join(sandbox, 'report');
  const archive = path.join(sandbox, 'component.tgz');
  await writeFile(archive, 'fixture');
  await createDeck(target, { packageSpec: archive }, '0.1.0');
  const pkg = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8'));
  assert.equal(pkg.dependencies['@godcreator/academic-deck'], archive);
});
