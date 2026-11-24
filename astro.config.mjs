import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import hexoNotes from './src/lib/remark-hexo-notes.mjs';
import { unified } from '@astrojs/markdown-remark';
export default defineConfig({
  site: 'https://www.mungeryang.top', output: 'static', trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: { processor: unified({ remarkPlugins: [hexoNotes, remarkMath], rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]] }), shikiConfig: { theme: 'github-light' } },
});
