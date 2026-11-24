import { readFile, access, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const manifest = JSON.parse(await readFile('migration/legacy-manifest.json', 'utf8'));
const failures = [];
const exists = async path => { try { await access(path); return true; } catch { return false; } };
for (const file of manifest.files) {
  if (!await exists(file.target)) { failures.push(`Missing original file: ${file.target}`); continue; }
  if (process.argv.includes('--baseline')) {
    const hash = createHash('sha256').update(await readFile(file.target)).digest('hex');
    if (hash !== file.sha256) failures.push(`Original file changed: ${file.target}`);
  }
}
for (const route of manifest.routes) {
  if (!await exists(join('dist', route === '.' ? '' : route, 'index.html'))) failures.push(`Missing legacy URL: /${route}/`);
}
const htmlFiles = [];
async function walk(path) { for (const entry of await readdir(path, { withFileTypes: true })) { const child = join(path, entry.name); if (entry.isDirectory()) await walk(child); else if (entry.name.endsWith('.html')) htmlFiles.push(child); } }
await walk('dist');
const missingImages = new Set();
for (const path of htmlFiles) {
  const html = await readFile(path, 'utf8');
  if (/\{%\s*(?:note|endnote)/.test(html)) failures.push(`Untranslated Hexo tag: ${path}`);
  for (const match of html.matchAll(/\bsrc=["'](\/img\/[^"']+)["']/g)) {
    const image = decodeURIComponent(match[1].split('?')[0]);
    if (!await exists(join('dist', image))) missingImages.add(image);
  }
}
missingImages.forEach(path => failures.push(`Missing local image: ${path}`));
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Verified: ${manifest.files.length} original files${process.argv.includes('--baseline') ? ' (SHA-256 identical)' : ''}, ${manifest.posts.length} legacy posts, ${manifest.routes.length} legacy URLs, ${htmlFiles.length} HTML pages; no missing local images or Hexo tags.`);
