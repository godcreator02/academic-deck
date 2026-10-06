import path from 'node:path';

export function parseArguments(action, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('需要对象参数，directory 为绝对路径');
  const allowed = new Set(['directory', ...(action === 'create' ? ['title', 'packageSpec'] : []), ...(['check','export'].includes(action) ? ['browser'] : []), ...(action === 'export' ? ['out'] : [])]);
  for (const [key, value] of Object.entries(input)) {
    if (!allowed.has(key)) throw new Error('不支持的参数：' + key);
    if (typeof value !== 'string' || !value.trim()) throw new Error(key + ' 必须是非空字符串');
  }
  if (typeof input.directory !== 'string' || !path.isAbsolute(input.directory)) throw new Error('directory 必须是绝对路径');
  if (input.browser && !['chrome', 'msedge'].includes(input.browser)) throw new Error('browser 只支持 chrome 或 msedge');
  if (input.out && (!path.isAbsolute(input.out) || path.extname(input.out).toLowerCase() !== '.pdf')) throw new Error('out 必须是 PDF 文件的绝对路径');
  // Published exact version or an existing local archive; no floating package tags.
  if (input.packageSpec && !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(input.packageSpec) && !(path.isAbsolute(input.packageSpec) && input.packageSpec.endsWith('.tgz'))) throw new Error('packageSpec 必须是固定版本号或本地 .tgz 绝对路径');
  return { ...input, directory: path.resolve(input.directory) };
}
