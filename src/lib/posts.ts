import { getCollection, type CollectionEntry } from 'astro:content';
import manifest from '../../migration/legacy-manifest.json';
export type Post = CollectionEntry<'posts'>;
const oldPaths = new Map(manifest.posts.map(post => [post.file.replace(/^_posts\//, '').replace(/\.md$/, ''), post.path]));
export const postPath = (post: Post) => oldPaths.get(post.id) ?? `${post.data.date.slice(0, 10).replaceAll('-', '/')}/${post.id}`;
export const postUrl = (post: Post) => `/${postPath(post).split('/').map(encodeURIComponent).join('/')}/`;
export const dateLabel = (post: Post) => post.data.date.slice(0, 10);
export async function allPosts() { return (await getCollection('posts', ({ data }) => !data.draft)).sort((a, b) => b.data.date.localeCompare(a.data.date)); }
export function excerpt(post: Post, length = 115) {
  return (post.data.description || post.body || '').replace(/```[\s\S]*?```/g, '').replace(/\{%[\s\S]*?%\}/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/<[^>]+>/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*`>$~\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, length);
}
export function taxonomyUrl(kind: 'tags' | 'categories', name: string) { return `/${kind}/${encodeURIComponent(name.replaceAll(' ', '-'))}/`; }
