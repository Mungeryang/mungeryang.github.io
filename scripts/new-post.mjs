import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const title = process.argv.slice(2).join(' ').trim();
if (!title || /[\x00-\x1f/\\]/.test(title) || title === '.' || title === '..') { console.error('用法：npm run new -- "文章标题"（标题不能包含斜杠）'); process.exit(1); }
const parts = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
const path = resolve('source/_posts', `${title}.md`);
await mkdir('source/_posts', { recursive: true });
await writeFile(path, `---\ntitle: ${JSON.stringify(title)}\ndate: ${parts}\ntags: []\ncategories: []\ndraft: true\n---\n\n在这里开始写作。\n`, { flag: 'wx' });
console.log(`已创建：${path}\n写完后将 draft 改为 false，即可发布。`);
