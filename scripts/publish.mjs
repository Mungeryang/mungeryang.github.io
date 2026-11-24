import { execFileSync } from 'node:child_process';
const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });
const branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
if (branch !== 'main') throw new Error('请在 main 分支发布；其他分支可通过 Pull Request 合并。');
run('npm', ['run', 'check']); run('npm', ['run', 'build']);
// Only stage writing and media; unrelated code changes require an explicit git add.
run('git', ['add', '--', 'source', 'public/img']);
const status = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim();
if (status) run('git', ['commit', '-m', process.argv.slice(2).join(' ') || 'docs: update blog content']);
run('git', ['push', 'origin', 'main']);
