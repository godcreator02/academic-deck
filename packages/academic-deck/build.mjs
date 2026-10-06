import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const root = path.dirname(fileURLToPath(import.meta.url));
// Keep modules separate so Vite handles asset URLs, SVG ?raw imports, and CSS.
async function compile(relative = '') {
  const source = path.join(root, 'src', relative);
  const output = path.join(root, 'dist', relative);
  await mkdir(output, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const input = path.join(source, entry.name);
    if (entry.isDirectory()) { await compile(path.join(relative, entry.name)); continue; }
    if (!/\.jsx?$/.test(entry.name)) { await cp(input, path.join(output, entry.name)); continue; }
    let code = await readFile(input, 'utf8');
    code = code.replace(/(from\s+['"])(\.[^'"]+)(['"])/g, (whole, before, spec, after) =>
      path.extname(spec) ? whole : before + spec + '.js' + after);
    const result = await transform(code, { loader: entry.name.endsWith('.jsx') ? 'jsx' : 'js', jsx: 'automatic', format: 'esm', target: 'es2022' });
    await writeFile(path.join(output, entry.name.replace(/\.jsx$/, '.js')), result.code);
  }
}
await compile();
console.log('academic-deck: components, styles and assets built');
