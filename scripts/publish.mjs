import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const readGit = args => execFileSync('git', args, { encoding: 'utf8' }).trim();
const run = (command, args, options = {}) => execFileSync(command, args, { stdio: 'inherit', ...options });

function localImagePath(reference) {
  const src = reference.trim().replace(/^(?:\.\.?\/)+img\//, '/img/');
  if (!src.startsWith('/img/')) return undefined;
  const file = resolve('public', decodeURIComponent(src.split(/[?#]/)[0]).replace(/^\//, ''));
  if (!file.startsWith(resolve('public/img') + sep)) throw new Error(`图片路径超出 public/img：${reference}`);
  return relative(process.cwd(), file).split(sep).join('/');
}

// 只添加照片清单与本次修改文章实际引用的图片，不扫描整个图片目录。
export function publicationImagePaths(photos, markdown = []) {
  const paths = new Set();
  const include = src => { const path = localImagePath(src); if (path) paths.add(path); };
  for (const photo of photos) if (!photo.draft && typeof photo.src === 'string') include(photo.src);
  for (const body of markdown) {
    const references = /!\[[^\]]*\]\(([^)\n]+)\)|<img\b[^>]*\bsrc=["']([^"']+)["']|^(?:index_img|cover|banner_img):\s*(.+)$/gm;
    for (const match of body.matchAll(references)) {
      const src = (match[1] || match[2] || match[3]).trim()
        .replace(/\s+["'][^"']*["']$/, '').replace(/^<|>$/g, '').replace(/^["']|["']$/g, '');
      include(src);
    }
  }
  return [...paths];
}

export function publish(message) {
  if (readGit(['branch', '--show-current']) !== 'main') throw new Error('请在 main 分支发布；其他分支可通过 Pull Request 合并。');
  console.log('\n[1/5] 检查文章与配置…');
  run('npm', ['run', 'check']);
  console.log('\n[2/5] 构建博客…');
  run('npm', ['run', 'build']);
  console.log('\n[3/5] 准备文章、照片清单与选中的本地图片…');
  const changed = new Set([
    ...readGit(['diff', '--name-only', '-z', 'HEAD', '--', 'source']).split('\0'),
    ...readGit(['ls-files', '--others', '--exclude-standard', '-z', '--', 'source']).split('\0'),
  ].filter(Boolean));
  const markdown = [...changed].filter(path => path.endsWith('.md') && path !== 'source/picture/index.md' && existsSync(path)).map(path => readFileSync(path, 'utf8'));
  const photos = JSON.parse(readFileSync('src/data/photos.json', 'utf8'));
  const images = publicationImagePaths(photos, markdown);
  for (const image of images) if (!existsSync(image)) throw new Error(`找不到本地图片：${image}`);
  run('git', ['add', '--', 'source', 'src/data/photos.json', ...images]);
  console.log(`已检查 ${photos.filter(photo => !photo.draft).length} 张照片，选择 ${images.length} 个本地图片文件。`);
  console.log('\n[4/5] 创建 Git 提交…');
  if (readGit(['diff', '--cached', '--name-only'])) run('git', ['commit', '-m', message || 'docs: update blog content']);
  else console.log('没有需要新提交的内容，将继续同步 GitHub。');
  console.log('\n[5/5] 推送 GitHub…');
  const configuredSSH = spawnSync('git', ['config', '--get', 'core.sshCommand'], { encoding: 'utf8' }).stdout?.trim();
  run('git', ['push', 'origin', 'main'], {
    timeout: 120_000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_SSH_COMMAND: process.env.GIT_SSH_COMMAND || configuredSSH || 'ssh -o BatchMode=yes -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=2' },
  });
  console.log('\n已推送 GitHub，自动部署完成后网站会更新。');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { publish(process.argv.slice(2).join(' ')); }
  catch (error) { console.error(`\n发布未完成：${error.message}`); process.exitCode = 1; }
}
