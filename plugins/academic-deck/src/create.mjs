import { access, cp, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const template = fileURLToPath(new URL('../templates/basic/', import.meta.url));
export async function createDeck(directory, { title = '学术汇报', packageSpec } = {}, componentVersion) {
  const version = packageSpec ?? componentVersion;
  if (!version) throw new Error('缺少组件版本');
  if (path.isAbsolute(version)) await access(version);
  const target = path.resolve(directory);
  await mkdir(path.dirname(target), { recursive: true });
  await mkdir(target);
  for (const entry of await readdir(template)) {
    await cp(path.join(template, entry), path.join(target, entry), { recursive: true, force: false, errorOnExist: true });
  }
  const project = {
    name: 'academic-report', private: true, type: 'module',
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview --host 127.0.0.1' },
    dependencies: { '@godcreator/academic-deck': version, react: '^19.2.0', 'react-dom': '^19.2.0' },
    devDependencies: { vite: '^7.0.0', '@vitejs/plugin-react': '^5.0.0' },
  };
  await writeFile(path.join(target, 'package.json'), JSON.stringify(project, null, 2) + '\n');
  await writeFile(path.join(target, 'pnpm-workspace.yaml'), 'allowBuilds:\n  esbuild: true\n');
  await writeFile(path.join(target, '.gitignore'), 'node_modules/\ndist/\n.artifacts/\n');
  await writeFile(path.join(target, 'src/title.js'), 'export const title = ' + JSON.stringify(title) + ';\n');
  return { directory: target, package: '@godcreator/academic-deck', version, next: '在目标目录执行 pnpm install，再调用 deck.build' };
}
