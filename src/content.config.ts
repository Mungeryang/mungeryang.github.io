import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const taxonomy = z.union([z.string(), z.array(z.union([z.string(), z.array(z.string())]))]).nullish().transform(value => value ? [...new Set([value].flat(2))] as string[] : []);
const date = z.union([z.date(), z.string()]).transform(value => value instanceof Date ? value.toISOString() : value);
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './source/_posts', generateId: ({ entry, data }) => {
    // Hexo inferred this one post's date from its filesystem metadata.
    if (entry === 'hello-world.md' && !data.date) data.date = '2024-08-05 00:00:00';
    return entry.replace(/\.md$/, '');
  } }),
  schema: z.object({ title: z.string(), date, updated: date.optional(), tags: taxonomy, categories: taxonomy, index_img: z.string().nullish(), description: z.string().optional(), draft: z.boolean().default(false), sticky: z.number().default(0), comments: z.boolean().default(true) }),
});
const pages = defineCollection({
  loader: glob({ pattern: '{about,picture,self}/index.md', base: './source', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: z.object({ title: z.string() }),
});
export const collections = { posts, pages };
